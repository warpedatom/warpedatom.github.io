---
layout: post
title: "Diamond and sapphire tickets"
date: 2026-08-03
tags: [kerberos, active-directory]
description: "The gemstone tickets Unit 42 named: diamond and sapphire tickets both modify a real, KDC-issued TGT instead of forging one from scratch - and that single design choice is what breaks most golden-ticket detections."
series: kerberos
---

Golden and silver tickets forge a ticket *from nothing* - and that's exactly the
seam most detections pull on. Unit 42 gave names to the two techniques that close
that seam by starting from a **real, KDC-issued TGT** and editing it: the
[diamond and sapphire tickets](https://unit42.paloaltonetworks.com/next-gen-kerberos-attacks/).
Both still need the **krbtgt** key, so the root defense doesn't change - but
because the ticket begins its life as a genuine one, the artifacts that give a
golden ticket away largely disappear.

I covered the golden/silver/diamond trio at a high level in
[Golden, silver, and diamond tickets]({% post_url 2026-05-29-golden-silver-and-diamond-tickets %}).
This post goes deeper on diamond and introduces its stealthier cousin.

## The shared prerequisite

Every attack in this family decrypts and re-signs a TGT, and every TGT is
encrypted and signed with the krbtgt account's key. So the entry fee is the same
as a golden ticket: you need the **krbtgt hash or AES key**, typically pulled via
DCSync after reaching Domain Admin. Getting there is loud - DCSync, LSASS access,
replication from a non-DC - which is precisely where detection should live,
because the tickets themselves are the quiet part.

## Diamond tickets

A diamond ticket takes a **legitimate TGT** and rewrites its PAC. The flow:

```text
1. Obtain a real TGT for a user you control
   - straight AS-REQ with the user's credentials, or
   - Rubeus /tgtdeleg to pull a usable TGT with no elevation
2. Decrypt the TGT with the krbtgt key.
3. Modify the PAC - add privileged group RIDs (512 = Domain Admins), etc.
4. Re-encrypt and re-sign with the krbtgt key.
```

Because the ticket *started* as a real AS-REP from the DC, it carries the KDC's
own lifetimes and internally consistent fields instead of the tooling defaults
and implausible values that betray a forged-from-scratch golden ticket.

With Rubeus, the `diamond` command does the whole sequence - request, decrypt,
patch the PAC, re-sign - in one step. `/tgtdeleg` sources the base TGT without
needing local admin:

```text
Rubeus.exe diamond /tgtdeleg /enctype:aes ^
  /krbkey:<krbtgt_AES_key> ^
  /ticketuser:administrator /ticketuserid:500 /groups:512 ^
  /domain:corp.local /dc:dc01.corp.local ^
  /createnetonly:C:\Windows\System32\cmd.exe /ptt
```

Unit 42 splits diamond usage into two shapes, and the distinction matters for
detection:

- **Impersonate a privileged user.** Change the `cname` *and* the PAC so the
  ticket comes out under `administrator` with RID 512. This is the golden-ticket
  outcome, reached the diamond way - a TGT with no matching AS exchange for that
  user.
- **Elevate the user in place.** Leave `cname` alone and only add the privileged
  RIDs to the low-privileged user's PAC. Now the TGT and every downstream TGS are
  for the *same real user*, backed by a real logon - so the "TGT with no
  preceding authentication" tell never fires. This is the sneaky variant.

## Sapphire tickets

The sapphire ticket (Charlie Bromberg's technique) attacks the same PAC, but from
a different angle. Instead of *editing* a PAC - which can leave it inconsistent
with what the DC would actually issue - it **transplants a genuine one**.

You start with the credentials of *any* domain user, call them Joe, and request
Joe's TGT normally. Then you abuse **U2U + S4U2Self** to make the KDC hand you a
service ticket whose PAC belongs to a real high-privileged target:

```text
1. Get Joe's TGT (normal AS-REQ).
2. Craft a TGS-REQ that combines:
   - PA_FOR_USER  -> the high-priv user to impersonate (S4U2Self)
   - sname        -> Joe (a "service" that is really just Joe)
   - Joe's TGT in additional-tickets, with ENC-TKT-IN-SKEY set (U2U)
3. The KDC returns a service ticket carrying the target's real, DC-built PAC,
   encrypted to Joe's key - so Joe can decrypt it.
4. With the krbtgt key, decrypt Joe's TGT, swap in that genuine PAC, set the
   cname to the target, and re-sign.
```

The payoff is a TGT for a privileged user whose PAC was **built and signed by the
DC**, not fabricated. Impacket's `ticketer.py` implements this as its sapphire
mode. It's the same idea as U2U+S4U2Self roasting, repurposed to steal a PAC
rather than an encrypted blob to crack.

## Diamond vs sapphire: where the PAC comes from

Both modify the PAC of a legitimate TGT. The difference is provenance:

- **Diamond** edits the *original* PAC - so it can contain values the DC would
  never have put together (a low-priv account suddenly carrying RID 512, group
  data that doesn't line up).
- **Sapphire** substitutes a *genuine* PAC lifted from a real privileged user, so
  it's internally consistent by construction. That's what makes it the harder of
  the two to catch on the ticket alone.

## Detection

You will not reliably catch these by staring at the ticket - so pivot:

- **Chase the prerequisite.** Signs of krbtgt hash theft - DCSync (replication
  from a host that isn't a DC), suspicious DC connections, credential-dumping
  tooling - are the loud, catchable stage. Everything downstream inherits from
  it.
- **Sapphire's U2U + S4U2Self shape.** Right after the attack you'll often see a
  TGT request (event **4768**) and a TGS request (**4769**) from the *same host*
  for *two different users*, with no authentication event explaining the second
  user's presence on that machine.
- **PAC vs reality (event 4627).** Enable the *Audit Logon* success subcategory
  and event **4627** lists the groups an account logged on with. When a forged
  ticket asserts Domain Admins (RID 512) but the account isn't actually a member,
  the mismatch shows. Correlate with **4728/4732** (added to a group) to suppress
  the legitimate case where someone really was added.
- **The in-place diamond is the worst case.** Elevating a user without changing
  `cname` produces TGT and TGS for the same real user, so ticket-artifact
  detection has nothing to grab. You're left with behavioral anomalies - a
  low-privileged account suddenly reaching resources it never touched before.

## Root fix

Same as every ticket in the family: protect the key material. **Rotate krbtgt
twice** on any DA-level compromise (the account keeps its previous key for
compatibility, so one rotation isn't enough), treat DCSync rights as crown-jewel
access, and instrument the noisy path to the krbtgt hash rather than hoping to
spot a ticket that was, by design, built to look real.
