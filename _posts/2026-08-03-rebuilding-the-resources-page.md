---
layout: post
title: "Rebuilding the resources page"
date: 2026-08-03
tags: [meta]
description: "The Resources page grew from a short starter list into a curated, categorized index of the tooling and research I reach for - here's what I kept, what I cut, and why."
---

The [Resources](/resources/) page began as a short, safe list - the tools
everyone links to. I've now rebuilt it into a categorized index of what I reach
for in practice, and I want to stay honest about the method, because "curated"
earns its name only when you say what you left out.

## Where it came from

The raw material: my own starred repositories - a couple hundred, gathered across
study and engagements. A starred list makes a poor resource page, though. It
piles up. Part of it holds toolchain and dependencies, part of it went dead, and
plenty of it repeats itself. So the rebuild leaned on *subtraction*.

## What I kept

The bar stayed simple: does it still get maintained, and does it still serve red
team tradecraft, malware analysis, or detection engineering - the three things
this site actually covers? Every entry on the page clears both tests.

I also reorganized around **how you'd reach for something** rather than a flat
A-Z. The new sections track the work: C2 and adversary simulation,
post-exploitation and lateral movement, Active Directory and Kerberos, credential
access, evasion and malware development, reverse engineering and analysis,
privilege escalation, OSINT, detection and DFIR, and the reference material that
belongs to no single phase. A one-line descriptor rides on every entry, so the
page reads as a map instead of a bookmark dump.

## What I cut, and why

- **Toolchain and unrelated dev repos.** Language toolchains, CMSes, database
  clients - I starred them for other reasons, and they earn no place on an
  offensive-security page.
- **Stale or superseded tooling.** When a tool sits untouched for years *and* a
  maintained project does the same job better, the maintained one wins. A
  resource page that points you at abandoned code does you no favor.
- **Redundancy.** Where five repos cover one job, I picked the one or two worth
  starting from rather than listing all five.

None of these calls hold forever. The page states it plainly: a living document.
Entries that age out get pulled; entries that earn their spot get added.

## The point

I'd rather this page stay short and trustworthy than run long and padded. Every
link answers "where do I start with this?" for someone who asks - and if you
think something belongs on it, the page closes with an
[issue/PR link](https://github.com/warpedatom/warpedatom.github.io/issues) for
that exact reason.

- Velkris
