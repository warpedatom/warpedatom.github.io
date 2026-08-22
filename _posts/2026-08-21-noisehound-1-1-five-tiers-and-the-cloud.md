---
layout: post
title: "NoiseHound 1.1: five detection tiers, and the cloud"
date: 2026-08-21
tags: [active-directory, azure, detection]
description: "NoiseHound 1.1 goes from three measured detection tiers to five - adding Defender for Identity runtime alerts and WDAC - plus the first real measured Azure tier and native AzureHound ingest. Here is what got measured, what got corrected, and how it was validated live."
---

When I [introduced NoiseHound](/2026/08/10/introducing-noisehound/) it shipped
three lab-measured detection tiers - Windows audit, Defender for Endpoint, and an
open Elastic SIEM. **1.1** roughly doubles what is actually measured and pushes the
same "measure, do not guess" discipline into two places it had not reached: the
identity plane and the cloud.

## From three tiers to five

Two on-prem detection sources graduated from *modelled* to *measured*, each against
a live lab:

- **Defender for Identity (MDI).** The v1.0 notes called MDI runtime alerting
  "dark" on my Hyper-V lab. That was wrong - and worth correcting publicly. It was
  a **classic-sensor limitation**, not the environment. On the new v3
  (ETW/MDE-integrated) sensor, runtime alerts fire: Kerberoast and AS-REP roast at
  High, resource-based constrained delegation at Medium. One honest gap stayed a
  gap - a DCSync attempt was *blocked* outright by Defender XDR Attack Disruption,
  which is prevention, not detection, so it is recorded as such.
- **WDAC / App Control** as a tool-signature tier. Under audit mode, each unsigned
  attacker binary raises a CodeIntegrity 3076 at load - Rubeus, Whisker, mimikatz,
  Certify - so the tool-based edges are loud with off-the-shelf tradecraft and
  blind to native or remote equivalents. That contrast *is* the point, and now it
  is measured on all six modelled edges.

## The cloud, measured the same way

NoiseHound now scores Azure/Entra attack paths, and it earns those numbers the
same way it earns the on-prem ones. `noisehound-entra` reads an Entra directory
audit export and calibrates a profile from what actually logged; the first real
run against a throwaway tenant triggered seven `AZ*` directory-plane abuses and
every one was recorded (the cloud control plane is well-instrumented by default -
which is itself the finding). And with `noisehound-inspect -i azurehound.json` it
ingests raw **AzureHound** output directly - no BloodHound CE required - and
synthesises the post-processed edges the BloodHound backend would compute, so a
lone role assignment becomes an `AZGlobalAdmin` edge to the tenant.

## Validated live, not just in tests

Before tagging the release I ran the three things that only a live stack can prove:
`noisehound-writeback` stamped 1,252 relationships in a running BloodHound CE graph
(the scores show up in the edge panel and drive a noise-weighted Cypher query
directly in the UI); `noisehound-elastic` read a live Kibana inventory and reached
full coverage of every measurable edge; and the Azure recipe ran end-to-end in a
real tenant. The two-engine parity still holds - the Python front end and the
native Rust **DeadAir** core return identical rankings.

## Still honest about the rest

37 of the 71 corpus edges are now calibrated against real telemetry across those
five on-prem tiers plus the Azure tier; the remaining edges carry conservative
estimates, still clearly flagged. The roadmap from here is depth and breadth of
measurement - more edges, more environments, more live detection inventories -
not more features. A detection-scoring tool is only worth as much as the
measurements behind it, and I would rather tell you which numbers are which.

- `pip install --upgrade noisehound` &middot; [github.com/warpedatom/NoiseHound](https://github.com/warpedatom/NoiseHound)
- `cargo install deadair` &middot; [github.com/warpedatom/DeadAir](https://github.com/warpedatom/DeadAir)
- The full [operator walkthrough](https://github.com/warpedatom/NoiseHound/blob/main/docs/WALKTHROUGH.md) has the screenshots and the quietest-vs-shortest showcase.

- Velkris
