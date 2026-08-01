---
layout: page
title: Resources
permalink: /resources/
description: "Curated red team and offensive security resources — tools, references, and reading lists."
last_modified_at: 2026-08-01
---

# Resources

A curated collection of tools, references, and reading material for red team operators, malware analysts, and detection engineers. Maintained as a living document.

---

## Offensive Tooling

| Tool | Purpose |
|------|---------|
| [Impacket](https://github.com/fortra/impacket) | Python classes for working with network protocols (SMB, MSRPC, Kerberos) |
| [Rubeus](https://github.com/GhostPack/Rubeus) | C# Kerberos abuse toolkit |
| [Certify](https://github.com/GhostPack/Certify) | Active Directory Certificate Services enumeration and abuse |
| [SharpHound](https://github.com/BloodHoundAD/SharpHound) | BloodHound data collector for AD environments |
| [Cobalt Strike](https://www.cobaltstrike.com/) | Commercial adversary simulation platform |
| [Sliver](https://github.com/BishopFox/sliver) | Open-source adversary emulation / C2 framework |
| [Havoc](https://github.com/HavocFramework/Havoc) | Modern C2 framework |
| [Brute Ratel](https://bruteratel.com/) | Commercial C2 focused on EDR evasion |

## Detection & Analysis

| Tool | Purpose |
|------|---------|
| [OffsetInspect](https://github.com/warpedatom/OffsetInspect) | PowerShell toolkit for detection-boundary and static analysis |
| [YARA](https://virustotal.github.io/yara/) | Pattern matching for malware classification |
| [Sigma](https://github.com/SigmaHQ/sigma) | Generic signature format for SIEM systems |
| [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) | Windows system monitoring and logging |
| [Velociraptor](https://docs.velociraptor.app/) | Endpoint visibility and collection at scale |
| [PE-bear](https://github.com/hasherezade/pe-bear) | PE file reverse engineering tool |
| [Detect It Easy](https://github.com/horsicq/Detect-It-Easy) | Packer/compiler/linker detection |

## Kerberos & Active Directory

| Resource | Type |
|----------|------|
| [The Hacker Recipes](https://www.thehacker.recipes/) | Comprehensive AD attack playbook |
| [SpecterOps Blog](https://posts.specterops.io/) | Research on AD security and tradecraft |
| [harmj0y's blog](https://blog.harmj0y.net/) | Kerberos, delegation, and AD abuse research |
| [ADSecurity.org](https://adsecurity.org/) | Active Directory security deep dives |

## Malware Analysis

| Resource | Type |
|----------|------|
| [MalwareBazaar](https://bazaar.abuse.ch/) | Malware sample sharing platform |
| [VirusTotal](https://www.virustotal.com/) | Multi-scanner analysis service |
| [ANY.RUN](https://any.run/) | Interactive malware sandbox |
| [Unpac.me](https://www.unpac.me/) | Automated malware unpacking |
| [PE Format (MS Docs)](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format) | Official PE specification |

## Evasion Research

| Resource | Type |
|----------|------|
| [Elastic Security Labs](https://www.elastic.co/security-labs) | EDR internals and detection research |
| [MDSec Blog](https://www.mdsec.co.uk/blog/) | Advanced red team tradecraft |
| [RedTeam.pl](https://redteam.pl/en/) | Evasion techniques and tooling |
| [ired.team](https://www.ired.team/) | Red team notes and cheatsheets |

## Standards & Frameworks

| Framework | Purpose |
|-----------|---------|
| [MITRE ATT&CK](https://attack.mitre.org/) | Adversary tactics and techniques knowledge base |
| [MITRE D3FEND](https://d3fend.mitre.org/) | Defensive technique knowledge graph |
| [Atomic Red Team](https://github.com/redcanaryco/atomic-red-team) | Small, portable detection tests mapped to ATT&CK |
| [LOLBAS](https://lolbas-project.github.io/) | Living off the land binaries, scripts, and libraries |
| [GTFOBins](https://gtfobins.github.io/) | Unix binaries for privilege escalation and evasion |

---

*Have a suggestion? Open an [issue](https://github.com/warpedatom/warpedatom.github.io/issues) or PR.*
