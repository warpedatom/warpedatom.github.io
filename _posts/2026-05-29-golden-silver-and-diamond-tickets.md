---
layout: post
title: "Golden, silver, and diamond tickets"
date: 2026-05-29
tags: [kerberos, active-directory]
---

Ticket forgery is what makes Kerberos persistence so hard to shake. Once an
attacker holds the right key material, they don't request tickets - they *mint*
or *modify* them, and the domain accepts the result because it's
cryptographically valid.

## Golden tickets (T1558.001)

A golden ticket is a forged **TGT**, and it works because every TGT is encrypted
with the **krbtgt** account's key. Recover that key - the krbtgt NTLM hash or AES
key, typically via DCSync after reaching Domain Admin - and you can fabricate a
TGT for any principal, with any group memberships, and an arbitrary lifetime. The
KDC has no way to tell a forged TGT from one it issued, because it validates the
ticket by decrypting it with the very key you copied.

The uncomfortable part: rotating a compromised user's password does nothing. The
only cure is rotating **krbtgt twice** (the account keeps its previous key for
compatibility, so one rotation isn't enough), which invalidates every outstanding
TGT in the domain.

## Silver tickets (T1558.002)

A silver ticket is narrower and quieter. Instead of forging a TGT, you forge a
**service ticket** for one specific service, signed with that *service account's*
key. Because the service validates the ticket with its own key and never consults
the KDC, a silver ticket generates **no `4768`/`4769` events** - there's no
authentication traffic to log. The tradeoff is scope: the forgery only works for
that one service (and any SPN sharing the account's key).

## Diamond tickets

A diamond ticket is the stealthy evolution of the golden ticket. Rather than
building a TGT from scratch, the attacker requests a **legitimate TGT** from the
KDC, decrypts it with the krbtgt key, **modifies the PAC** (adding privileged
group SIDs, for example), and re-encrypts it. It still needs the krbtgt key - so
the root defense is identical - but because the ticket *started* as a real,
KDC-issued TGT, it carries genuine, internally consistent fields and a real
preceding AS-REQ/AS-REP.

That's what makes it evasive: many golden-ticket detections lean on the artifacts
of forging a ticket *from nothing* - default lifetimes baked in by tooling,
implausible values, or a service ticket that has no matching authentication
event. A diamond ticket inherits the KDC's own values, so those tells largely
disappear. The forgery hides inside a legitimate shell.

## Spotting and stopping forgeries

- **Golden:** watch for TGTs with anomalous lifetimes, missing or mismatched
  account metadata, and logons that skip a preceding AS exchange.
- **Silver:** you won't see KDC logs, so pivot to the *service host* - process
  creation and service-side logon events that don't match a normal Kerberos flow.
- **Diamond:** the hardest to catch on ticket artifacts alone; lean on the PAC
  not matching the account's real group membership, and on privileged logons that
  don't line up with expected access. Detection shifts toward *behavior*.

All three share one root cause and one root fix: protect the key material.
Rotate **krbtgt twice** on any DA-level compromise, give service accounts long
random keys (gMSAs), and treat the krbtgt key and CA as the crown jewels they
are - because once they leak, the tickets they sign are indistinguishable from
the real thing.
