---
layout: post
title: "Reading entropy to spot packed code"
date: 2026-07-03
tags: [malware-analysis]
description: "Shannon entropy as a first filter for packed or encrypted payloads: how to compute it, what the numbers mean, and how to use it at scale for malware triage."
series: malware-analysis
---

Shannon entropy measures how unpredictable a byte stream is, on a scale of 0 to
8 bits per byte. Plain English text and normal machine code sit comfortably in
the middle. Compressed or encrypted data pushes hard toward the ceiling, because
by definition it has squeezed out the redundancy an analyst - or a signature -
would key on. That single number is a fast first filter for packed payloads.

## The intuition

Entropy is defined over the byte-value distribution of a window:

```text
H = -Σ p(b) · log2 p(b)     for each byte value b in 0..255
```

- **~4.5-6.5 bits/byte** - typical for x86/x64 code and mixed data.
- **~7.9+ bits/byte** - near-maximal; the region looks like ciphertext or a
  compressed blob. A packed section, an embedded archive, or an encrypted stage.

A whole-file average hides the interesting part, so scan in windows and look at
the *shape*:

```powershell
Get-OffsetEntropy .\sample.bin -HighOnly |
    Select-Object -ExpandProperty Windows
```

## Reading the curve, not the number

A packer usually leaves a tell: a low-entropy stub (the unpacking code) sitting
in front of a high-entropy body (the compressed payload). PE section headers
reinforce the story - a `.text` section whose raw size dwarfs a tiny virtual
size, or an oddly named section pegged at 7.9, is worth a closer look.

Two honest caveats. High entropy is not malicious on its own: legitimately
compressed resources, embedded PNGs, and TLS certificates all read high. And low
entropy doesn't clear a file - plenty of malware is plaintext script. Entropy
tells you *where to look*, not *what you found*. Cross-reference the flagged
windows with the strings that survive there and with the PE section they fall
in, and the packed regions usually announce themselves.
