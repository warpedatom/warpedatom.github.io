---
layout: page
title: Projects
permalink: /projects/
description: "Open-source defensive security tooling - OffsetInspect and OffsetScan."
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

<script>
(function () {
  var TTL = 36e5; // 1 hour

  function cached(url, key, cb) {
    try {
      var raw = localStorage.getItem(key);
      if (raw) {
        var entry = JSON.parse(raw);
        if (Date.now() - entry.ts < TTL) { cb(entry.d); return; }
      }
    } catch (e) {}
    fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d) {
          try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), d: d })); } catch (e) {}
        }
        cb(d);
      })
      .catch(function () { cb(null); });
  }

  function badge(text, extra) {
    var s = document.createElement('span');
    s.className = 'gh-badge' + (extra ? ' ' + extra : '');
    s.textContent = text;
    return s;
  }

  document.querySelectorAll('.gh-stats[data-repo]').forEach(function (el) {
    var repo = el.dataset.repo;

    cached('https://api.github.com/repos/' + repo, 'gh_repo_' + repo, function (d) {
      if (!d) return;
      el.appendChild(badge('\u2605 ' + d.stargazers_count.toLocaleString()));
      if (d.forks_count) el.appendChild(badge('\u2387 ' + d.forks_count.toLocaleString()));
      if (d.language) el.appendChild(badge(d.language));
    });

    cached('https://api.github.com/repos/' + repo + '/releases/latest', 'gh_rel_' + repo, function (d) {
      if (!d || !d.tag_name) return;
      el.appendChild(badge(d.tag_name, 'gh-badge-rel'));
    });
  });
})();
</script>
