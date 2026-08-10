---
layout: post
title: "Introducing NoiseHound: the quietest path, not just a path"
date: 2026-08-10
tags: [active-directory, detection]
description: "NoiseHound re-ranks BloodHound attack paths by how detectable they are, so you can ask for the quietest route to Domain Admins - not just any route. Here's the idea, the lab-measured calibration behind it, and what's honestly still an estimate."
---

BloodHound answers one question well: *is there a path* from here to Domain
Admins? It hands you the shortest one. But the shortest path and the quietest
path are rarely the same, and on a monitored network that difference is the whole
engagement.

**NoiseHound** takes the same graph and re-ranks paths by *expected detection
cost* instead of hop count. You give it a source and an objective, and it tells
you which route is least likely to light up a SOC - and by how much.

## Detectability isn't a guess

The easy version of this tool would hard-code some noise numbers from intuition.
I didn't want that. Every edge score comes from a **lab-measured calibration**:
each attack technique was executed against an instrumented Active Directory lab,
and the telemetry it actually produced was counted - Windows Security auditing,
Microsoft Defender for Endpoint, and an open Elastic SIEM tier. The score reflects
what the defender *actually saw*, not what I assumed they would.

That yields three profiles - **audit**, **EDR**, and **Elastic** - because the
same technique is loud in different amounts depending on who is watching. A native
DCSync and a Rubeus kerberoast trip completely different tiers, and the scoring
reflects it. One useful result fell out early: the free, self-hosted Elastic rules
caught some techniques the commercial EDR didn't flag at all.

## Two engines, one answer

The Python front-end handles ingestion - BloodHound CE zips, JSON, a directory, or
a live `bolt://` Neo4j graph - and reporting. The heavy pathfinding is offloaded to
**DeadAir**, a native Rust engine, when the graph gets big. They return identical
results - DeadAir's regression tests are pinned to the same measured profiles - so
you can reach for either. NoiseHound can also write the noise scores back onto the
BloodHound graph, so you can run a noise-weighted quietest-path query right in the
BloodHound UI.

## Honest about what's measured

Thirty of the fifty-seven corpus edges are calibrated against real telemetry. The
rest carry conservative estimates, clearly flagged. The identity-alert tier
(Defender for Identity), a full 57-edge range, and a per-tool noise axis are on the
roadmap - not silently faked. A detection-scoring tool that lied about its own
measurements would be worse than no tool at all.

Both are open source and MIT-licensed:

- `pip install noisehound` &middot; [github.com/warpedatom/NoiseHound](https://github.com/warpedatom/NoiseHound)
- `cargo install deadair` &middot; [github.com/warpedatom/DeadAir](https://github.com/warpedatom/DeadAir)
- More on the [Projects](/projects/) page.

- Velkris
