---
layout: page
title: Projects
permalink: /projects/
description: "Open-source security tooling - OffsetInspect, OffsetScan, NoiseHound, and DeadAir."
last_modified_at: 2026-08-21
---

# Projects

Open-source tooling I build for detection engineering, malware triage, and
detection-aware offense. Two pairings, each a front-end plus a native Rust
engine: **OffsetInspect / OffsetScan** for detection-boundary and binary analysis
(read-only - they never disable or reconfigure endpoint protection), and
**NoiseHound / DeadAir** for scoring BloodHound attack paths by how detectable
they are.

## OffsetInspect

A bounded-memory **PowerShell** toolkit for byte-offset inspection, source
correlation, binary comparison, and defensive detection-boundary analysis. It
locates the earliest content prefix that AMSI or Microsoft Defender still
detects, validates the boundary, and maps it back to the PE section, entropy,
and strings that most likely triggered it - then folds the result into a
Markdown/HTML engagement report.

It also ships a static-triage suite (entropy, string extraction, PE/imphash
parsing, Authenticode verification), a detection-drift journal, and an
authorized-use signature-robustness tester that perturbs samples **only in
memory**.

- Cross-platform core (Windows, Linux, macOS); AMSI/Defender providers are Windows-only
- Ships on the PowerShell Gallery: `Install-Module OffsetInspect`
- [github.com/warpedatom/OffsetInspect](https://github.com/warpedatom/OffsetInspect)

<div class="gh-stats" data-repo="warpedatom/OffsetInspect" aria-label="Live GitHub stats for OffsetInspect"></div>

## OffsetScan

A native **Rust** companion to OffsetInspect for corpus-scale static triage -
thousands of files, where PowerShell's per-file overhead adds up and a parallel,
no-GC core pays for itself. It mirrors OffsetInspect's JSON schema field-for-field,
so the two are interchangeable at the data layer.

PE parsing, entropy, string extraction, hashing, TLSH similarity clustering, and
PE Rich-header build-toolchain fingerprinting - with optional YARA matching
behind a feature gate. Output as pretty JSON, NDJSON for constant-memory
streaming, or flat CSV for a SIEM.

- Cross-platform; no antivirus required
- `cargo install offsetscan`
- [github.com/warpedatom/OffsetScan](https://github.com/warpedatom/OffsetScan)

<div class="gh-stats" data-repo="warpedatom/OffsetScan" aria-label="Live GitHub stats for OffsetScan"></div>

## NoiseHound

Detection-aware attack-path scoring on top of **BloodHound**. Given a source and
an objective (say, Domain Admins), it ranks the available paths by how *loud*
they are - so an operator can take the quietest route, not just the shortest.

Every attack-path edge is scored from a lab-measured calibration - 37 of 77
corpus edges measured against real telemetry across five on-prem detection tiers
(Windows audit, Defender for Endpoint, Elastic SIEM, Defender for Identity, and
WDAC audit) plus a measured Azure/Entra tier, shipped as six drop-in profiles. It
loads BloodHound CE exports, a live Neo4j graph, or raw AzureHound output, and can
write the noise scores back onto the graph for BloodHound-native quietest-path
queries.

- Two-tier engine - Python for flexibility, the native DeadAir core for scale - with identical, validated results
- Loads BloodHound CE zips, JSON, a directory, or a live `bolt://` Neo4j graph
- `pip install noisehound`
- [github.com/warpedatom/NoiseHound](https://github.com/warpedatom/NoiseHound)

<div class="gh-stats" data-repo="warpedatom/NoiseHound" aria-label="Live GitHub stats for NoiseHound"></div>

## DeadAir

The native **Rust** engine core for NoiseHound - fast, noise-weighted attack-path
solving over the same corpus. It mirrors NoiseHound's scoring so the two are
interchangeable, and its regression tests are pinned to the measured profiles for
cross-engine parity.

- Noise-weighted shortest / K-shortest path solving weighted by measured edge detectability
- `cargo install deadair`
- [github.com/warpedatom/DeadAir](https://github.com/warpedatom/DeadAir)

<div class="gh-stats" data-repo="warpedatom/DeadAir" aria-label="Live GitHub stats for DeadAir"></div>
