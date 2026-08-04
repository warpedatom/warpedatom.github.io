---
layout: post
title: "Rebuilding the resources page"
date: 2026-08-03
tags: [meta]
description: "The Resources page grew from a short starter list into a curated, categorized index of the tooling and research I actually reach for - and here's what I kept, what I cut, and why."
---

The [Resources](/resources/) page started as a short, safe list - the tools
everyone links to. I've now rebuilt it from the ground up into a categorized index
of what I *actually* reach for, and I want to be honest about how it was put
together, because "curated" only means something if you say what you left out.

## Where it came from

The raw material was my own starred repositories - a couple hundred of them,
accumulated over study and engagements. A starred list is not a resource page,
though. It's a pile. Half of it is toolchain and dependencies, some of it is dead,
and plenty of it is redundant. So the rebuild was mostly *subtraction*.

## What I kept

The bar was simple: is it still maintained, and is it still relevant to red team
tradecraft, malware analysis, or detection engineering - the three things this
site is actually about? Everything on the page clears both.

I also reorganized around **how you'd actually reach for something** rather than a
flat A-Z. The new sections track the work: C2 and adversary simulation,
post-exploitation and lateral movement, Active Directory and Kerberos, credential
access, evasion and malware development, reverse engineering and analysis,
privilege escalation, OSINT, detection and DFIR, and the reference/cheat-sheet
material that doesn't belong to any single phase. Every entry gets a one-line
descriptor so the page reads as a map, not a bookmark dump.

## What I cut, and why

- **Toolchain and unrelated dev repos.** Language toolchains, CMSes, database
  clients - starred for other reasons, no place on an offensive-security page.
- **Stale or superseded tooling.** If a tool hasn't moved in years *and* a
  maintained project does the same job better, the maintained one wins. A
  resource page that sends you to abandoned code isn't doing you a favor.
- **Redundancy.** Where five repos do one thing, I picked the one or two worth
  starting from instead of listing all five.

None of these calls are permanent. The page says it up front: it's a living
document. Things that age out get pulled; things that earn their place get added.

## The point

I'd rather this page be short and trustworthy than long and padded. Every link is
something I'd actually hand to someone asking "where do I start with this?" - and
if you think something belongs on it, the page ends with an
[issue/PR link](https://github.com/warpedatom/warpedatom.github.io/issues) for
exactly that reason.

- Velkris
