---
layout: post
title: "AMSI internals: where the scan actually happens"
date: 2026-07-15
---

The Antimalware Scan Interface is the reason a malicious script often gets caught
*after* it's been decoded but *before* it runs. Knowing exactly where AMSI sits
in that pipeline explains both why it's effective and why it's brittle.

## Where it sits

AMSI is a thin, in-process API that scripting hosts call to submit content for
inspection. PowerShell, the Windows Script Host, the .NET runtime, and Office VBA
all wire into it. The important property is *timing*: the host calls AMSI with the
content it's **about to execute**, after any obfuscation or decoding the host
itself performs. So a Base64-wrapped, string-concatenated payload is handed to
AMSI in its final, deobfuscated form - which is why "just encode it" rarely
beats AMSI on its own.

The two functions that matter are `AmsiScanBuffer` and `AmsiScanString`. The host
passes the bytes; AMSI forwards them to the registered antimalware provider
(Microsoft Defender by default, via a COM provider interface) and returns an
`AMSI_RESULT`. A value at or above `AMSI_RESULT_DETECTED` (32768) means block.

```text
Script host ──(deobfuscated content)──► amsi.dll::AmsiScanBuffer
amsi.dll   ──(COM)──► registered provider (e.g. Defender)
provider   ──► AMSI_RESULT  →  clean / detected
```

Everything is **in memory and in-process**. Nothing is written to disk, which is
what lets a scanner inspect content that only ever exists at runtime.

## Why it's brittle - at a high level

Because the scan happens inside the host's own process, the trust boundary is
weak by design. The publicly documented failure classes are:

- **In-process tampering** - patching the scan routine in the module loaded into
  your own process so it always returns "clean."
- **Provider/registration weaknesses** - interfering with how the provider is
  loaded or invoked.
- **Content-level evasion** - breaking up the signatured content so the final
  buffer no longer matches, which works only against brittle exact-literal
  signatures.

The defensive reading is the useful one: AMSI is a strong *tripwire on decoded
content*, but it's not a security boundary against code already running with your
privileges. Treat an AMSI hit as high-value telemetry, correlate it with the
process and command line that produced it, and test whether your own signatures
survive trivial content mutation - a robust signature keys on structure, not on a
single literal string.
