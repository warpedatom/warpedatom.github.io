---
layout: page
title: Projects
permalink: /projects/
description: "Open-source defensive security tooling - OffsetInspect and OffsetScan."
last_modified_at: 2026-07-28
---

# Projects

Open-source tooling I build for detection engineering and malware triage. Both
are read-only by design - they analyze binaries and detection behavior without
ever disabling or reconfiguring endpoint protection.

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
