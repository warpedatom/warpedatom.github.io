---
layout: post
title: "An update, and where this is going"
date: 2026-07-27
tags: [meta]
description: "A brief note on how VELKRIS shifted from certification notes to original write-ups on offensive mechanisms - and what's coming next."
---

When I started this site last October, the plan was to post lab notes and track
a certification journey. That plan changed, for the better.

Republishing course material and lab walkthroughs isn't something I'm interested
in doing - it isn't mine to give away, and the internet has enough copied notes
already. What I'd actually found useful, over months of study, was forcing
myself to explain a mechanism from scratch until it held together. So that's what
this became: original write-ups on how things *actually* work, built from public
research and specifications, in my own words.

The first batch is up:

- **Kerberos, end to end** - and the ticket attacks (golden, silver, and
  diamond) that fall straight out of the protocol.
- **Delegation abuse** and **domain dominance** - the Active Directory paths, and
  the persistence that outlives a password reset.
- **AMSI internals**, **imphash**, **entropy**, and **TLSH** - the analysis and
  detection side I spend most of my time in.

Alongside the writing, the [Projects](/projects/) page now covers the two tools I
maintain - **OffsetInspect** and **OffsetScan** - both read-only, both built for
detection engineering and malware triage without ever touching endpoint
protection.

Everything here stays defensive and educational. The goal isn't a wall of
tradecraft; it's a small, honest set of explanations I'd have wanted when I was
first figuring these out. More to come.

- Velkris
