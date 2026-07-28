---
layout: post
title: "Domain dominance: persistence after Domain Admin"
date: 2026-07-09
---

Reaching Domain Admin is a milestone, not the finish line. **Domain dominance**
is the tradecraft of staying in - surviving password resets, re-imaging, and
incident response - by capturing key material that outlives any single account.
Understanding these is as much a defender's job as an operator's, because each
one changes what "contained" has to mean.

## The persistence primitives

- **Golden ticket** - forge TGTs with the stolen **krbtgt** key. Resetting user
  passwords won't help; only rotating krbtgt (twice) invalidates it.
- **DCSync** - abuse directory replication rights (`DS-Replication-Get-Changes`)
  to pull any account's hashes straight from a DC, no code on the box. It looks
  like legitimate replication, which is what makes it quiet.
- **DPAPI domain backup key** - a domain has one master backup key that can
  decrypt *any* user's DPAPI-protected secrets (browser passwords, saved
  credentials) forever. It effectively never rotates.
- **Golden certificate** - steal the enterprise CA's private key and you can mint
  authentication certificates for anyone, indefinitely (the AD CS analog of a
  golden ticket).
- **AdminSDHolder / SDProp** - plant an ACE on the template that SDProp stamps
  back onto privileged groups every hour, re-granting access even after cleanup.

## Why they're hard to evict

Every one of these captures something structural - a domain-wide key, a
replication right, a CA - rather than an account. Reset the obvious credentials
and the foothold remains. That's why real remediation after a DA compromise is
heavy: rotate **krbtgt twice**, audit and revoke **replication rights**, treat
the **CA** as compromised, and in the worst cases rebuild trust from a known-good
state.

## What to watch

- Replication requests (`4662` with the replication GUIDs) from anything that
  isn't a DC.
- New or unexpected **certificate templates** and CA enrollment activity.
- Changes to **AdminSDHolder** and to privileged-group membership that reappear
  after removal.
- krbtgt password age - an account that *never* rotates is a standing risk, not a
  detection, but it caps how bad a golden ticket can get.

Assume the keys, then verify visibility. Dominance is only durable against a
defender who doesn't know these exist.
