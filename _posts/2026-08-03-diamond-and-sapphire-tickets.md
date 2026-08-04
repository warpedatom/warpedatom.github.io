---
layout: post
title: "Diamond and sapphire tickets"
date: 2026-08-03
tags: [kerberos, active-directory]
description: "The gemstone tickets Unit 42 named: diamond and sapphire tickets both edit a real, KDC-issued TGT instead of forging one from scratch - and that single design choice breaks most golden-ticket detections."
series: kerberos
---

Golden and silver tickets forge a ticket *from nothing* - and that's exactly the
seam most detections pull on. Unit 42 gave names to the two techniques that close
that seam by starting from a **real, KDC-issued TGT** and editing it: the
[diamond and sapphire tickets](https://unit42.paloaltonetworks.com/next-gen-kerberos-attacks/).
Both still need the **krbtgt** key, so the root defense holds - but because the
ticket begins life as a genuine one, the tells that expose a golden ticket vanish.

I walked the golden/silver/diamond trio at a high level in
[Golden, silver, and diamond tickets]({% post_url 2026-05-29-golden-silver-and-diamond-tickets %}).
This post goes deeper on diamond and introduces its stealthier cousin.

## The shared prerequisite

Each attack in this family decrypts and re-signs a TGT, and the krbtgt key both
encrypts and signs every TGT. So the entry fee matches a golden ticket: you need
the **krbtgt hash or AES key**, which typically comes from a DCSync after you
reach Domain Admin. Getting there is loud - DCSync, LSASS access, replication
from a host that isn't a DC - and that noise is where detection belongs, because
the tickets themselves stay quiet.

## Diamond tickets

A diamond ticket takes a **legitimate TGT** and rewrites its PAC. The flow:

```text
1. Obtain a real TGT for a user you control
   - a straight AS-REQ with the user's credentials, or
   - Rubeus /tgtdeleg to pull a usable TGT with no elevation
2. Decrypt the TGT with the krbtgt key.
3. Edit the PAC - add privileged group RIDs (512 = Domain Admins), etc.
4. Re-encrypt and re-sign with the krbtgt key.
```

Because the ticket *began* as a real AS-REP from the DC, it carries the KDC's own
lifetimes and internally consistent fields - not the tooling defaults and
implausible values that expose a forged-from-scratch golden ticket.

With Rubeus, the `diamond` command runs the whole sequence - request, decrypt,
patch the PAC, re-sign - in one step. `/tgtdeleg` sources the base TGT without
local admin:

```text
Rubeus.exe diamond /tgtdeleg /enctype:aes ^
  /krbkey:<krbtgt_AES_key> ^
  /ticketuser:administrator /ticketuserid:500 /groups:512 ^
  /domain:corp.local /dc:dc01.corp.local ^
  /createnetonly:C:\Windows\System32\cmd.exe /ptt
```

Unit 42 splits diamond usage into two shapes, and the split drives detection:

- **Impersonate a privileged user.** Change the `cname` *and* the PAC so the
  ticket comes out under `administrator` with RID 512. This reaches the
  golden-ticket outcome the diamond way - a TGT with no matching AS exchange for
  that user.
- **Elevate the user in place.** Leave `cname` alone and add the privileged RIDs
  to the low-privileged user's own PAC. Now the TGT and every downstream TGS name
  the *same real user*, backed by a real logon - so the "TGT with no preceding
  authentication" tell never fires. This is the sneaky variant.

## Sapphire tickets

The sapphire ticket (Charlie Bromberg's technique) attacks the same PAC from a
different angle. Rather than *edit* a PAC - which can leave it inconsistent with
what the DC would issue - it **transplants a genuine one**.

You start with the credentials of *any* domain user, call them Joe, and request
Joe's TGT normally. Then you abuse **U2U + S4U2Self** to make the KDC hand you a
service ticket whose PAC belongs to a real high-privileged target:

```text
1. Get Joe's TGT (normal AS-REQ).
2. Craft a TGS-REQ that combines:
   - PA_FOR_USER  -> the high-priv user to impersonate (S4U2Self)
   - sname        -> Joe (a "service" that is just Joe)
   - Joe's TGT in additional-tickets, with ENC-TKT-IN-SKEY set (U2U)
3. The KDC returns a service ticket carrying the target's real, DC-built PAC,
   sealed to Joe's key - so Joe can decrypt it.
4. Using the krbtgt key, decrypt Joe's TGT, swap in that genuine PAC, set the
   cname to the target, and re-sign.
```

The payoff: a TGT for a privileged user whose PAC the **DC itself built and
signed**, rather than one the attacker fabricated. Impacket's `ticketer.py`
implements this as its sapphire mode. It reuses the U2U+S4U2Self roasting idea,
repurposed to steal a PAC rather than an encrypted blob to crack.

## Diamond vs sapphire: where the PAC comes from

Both edit the PAC of a legitimate TGT. Provenance separates them:

- **Diamond** rewrites the *original* PAC - so it can hold values the DC would
  never assemble (a low-priv account suddenly carrying RID 512, group data that
  doesn't line up).
- **Sapphire** substitutes a *genuine* PAC lifted from a real privileged user, so
  it stays internally consistent by construction. That makes it the harder of the
  two to catch on the ticket alone.

## Detection

You won't reliably catch these by staring at the ticket - so pivot:

- **Chase the prerequisite.** Signs of krbtgt hash theft - a DCSync (replication
  from a host that isn't a DC), suspicious DC connections, credential-dumping
  tooling - mark the loud, catchable stage. Everything downstream inherits from
  it.
- **Sapphire's U2U + S4U2Self shape.** Right after the attack you often see a TGT
  request (event **4768**) and a TGS request (**4769**) from the *same host* for
  *two different users*, with no authentication event that explains the second
  user's presence on that machine.
- **PAC vs reality (event 4627).** Enable the *Audit Logon* success subcategory
  and event **4627** lists the groups an account logged on with. When a forged
  ticket asserts Domain Admins (RID 512) but the account doesn't belong, the
  mismatch shows. Correlate with **4728/4732** (a group gained a member) to
  suppress the case where someone genuinely joined the group.
- **The in-place diamond is the worst case.** Elevating a user without changing
  `cname` yields a TGT and TGS for the same real user, so ticket-artifact
  detection has nothing to grab. That leaves behavioral anomalies - a
  low-privileged account suddenly reaching resources it never touched before.

## Root fix

The cure matches every ticket in the family: protect the key material. **Rotate
krbtgt twice** on any DA-level compromise (the account keeps its previous key for
compatibility, so one rotation won't do it), guard DCSync rights as the sensitive
access they represent, and instrument the noisy path to the krbtgt hash rather
than hoping to spot a ticket that was, by design, built to look real.
