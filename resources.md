---
layout: page
title: Resources
permalink: /resources/
description: "Curated red team, malware analysis, and detection engineering resources — tools, references, and reading lists."
last_modified_at: 2026-08-03
---

# Resources

A curated collection of tools, references, and reading material for red team
operators, malware analysts, and detection engineers. Drawn from tooling I
actually reach for and research I keep coming back to — maintained as a living
document, weighted toward things that are still maintained and still relevant.

---

## C2 & Adversary Simulation

| Tool | Purpose |
|------|---------|
| [Cobalt Strike](https://www.cobaltstrike.com/) | Commercial adversary simulation platform; the de-facto red team standard |
| [Sliver](https://github.com/BishopFox/sliver) | Open-source cross-platform C2 / adversary emulation framework |
| [Havoc](https://github.com/HavocFramework/Havoc) | Modern, modular C2 framework with a demon agent |
| [Brute Ratel](https://bruteratel.com/) | Commercial C2 built around EDR/AV evasion |
| [Caldera](https://github.com/apache/caldera) | MITRE's automated adversary emulation platform |
| [CrucibleC2](https://github.com/DragoQCC/CrucibleC2) | C# command-and-control framework |
| [C2-Tool-Collection](https://github.com/outflanknl/C2-Tool-Collection) | BOFs and tools that integrate with Cobalt Strike and other C2s |
| [Awesome-CobaltStrike](https://github.com/zer0yu/Awesome-CobaltStrike) | Curated index of Cobalt Strike resources, kits, and BOFs |

## Post-Exploitation & Lateral Movement

| Tool | Purpose |
|------|---------|
| [Impacket](https://github.com/fortra/impacket) | Python classes for network protocols (SMB, MSRPC, Kerberos) and the scripts built on them |
| [NetExec](https://github.com/Pennyw0rth/NetExec) | The maintained successor to CrackMapExec; network execution and enumeration at scale |
| [SharpRDP](https://github.com/0xthirteen/SharpRDP) | Authenticated command execution over RDP without a GUI |
| [SharpMove](https://github.com/0xthirteen/SharpMove) | Authenticated remote execution via WMI, DCOM, and task scheduling |
| [SCShell](https://github.com/Mr-Un1k0d3r/SCShell) | Fileless lateral movement abusing `ChangeServiceConfigA` |
| [PowerLessShell](https://github.com/Mr-Un1k0d3r/PowerLessShell) | Run PowerShell/PowerShell logic without spawning `powershell.exe` |
| [Nishang](https://github.com/samratashok/nishang) | Offensive PowerShell framework for red teaming and post-exploitation |
| [PowerShell-Suite](https://github.com/FuzzySecurity/PowerShell-Suite) | FuzzySec's grab-bag of offensive PowerShell utilities |
| [StandIn](https://github.com/FuzzySecurity/StandIn) | Small .NET AD post-exploitation toolkit |
| [SharpStay](https://github.com/0xthirteen/SharpStay) | .NET persistence installer |

## Active Directory & Kerberos

| Tool / Resource | Purpose |
|-----------------|---------|
| [BloodHound](https://github.com/SpecterOps/BloodHound) | Graph-based AD/Entra attack-path mapping (Community Edition) |
| [SharpHound](https://github.com/BloodHoundAD/SharpHound) | BloodHound data collector for AD environments |
| [RustHound-CE](https://github.com/g0h4n/RustHound-CE) | Fast Rust BloodHound CE ingestor |
| [BloodHound.py](https://github.com/dirkjanm/BloodHound.py) | Python BloodHound ingestor for non-Windows collection |
| [bloodyAD](https://github.com/CravateRouge/bloodyAD) | AD privilege-escalation framework operating over LDAP |
| [autobloody](https://github.com/CravateRouge/autobloody) | Auto-exploits privilege-escalation paths surfaced by BloodHound |
| [Certify](https://github.com/GhostPack/Certify) | AD Certificate Services (AD CS) enumeration and abuse |
| [Certipy](https://github.com/ly4k/Certipy) | Python AD CS enumeration and abuse; ESC1–ESC16 coverage |
| [Rubeus](https://github.com/GhostPack/Rubeus) | C# Kerberos abuse toolkit (roasting, delegation, ticket forgery) |
| [PKINITtools](https://github.com/dirkjanm/PKINITtools) | Kerberos PKINIT and AD CS relaying utilities |
| [krbrelayx](https://github.com/dirkjanm/krbrelayx) | Kerberos relaying and unconstrained-delegation abuse |
| [KrbRelay](https://github.com/cube0x0/KrbRelay) | Kerberos relaying framework |
| [noPac](https://github.com/cube0x0/noPac) | CVE-2021-42287/42278 scanner and exploiter |
| [ldapdomaindump](https://github.com/dirkjanm/ldapdomaindump) | AD information dumper over LDAP for any authenticated user |
| [mitm6](https://github.com/dirkjanm/mitm6) | IPv6/DNS takeover for relaying and credential capture |
| [adidnsdump](https://github.com/dirkjanm/adidnsdump) | Dump AD-integrated DNS as any authenticated user |
| [ROADtools](https://github.com/dirkjanm/ROADtools) | Azure AD / Entra offensive and defensive tooling |
| [PingCastle](https://github.com/netwrix/pingcastle) | Fast AD security posture assessment and reporting |
| [Group3r](https://github.com/Group3r/Group3r) | Find vulnerabilities in AD Group Policy |
| [The Hacker Recipes](https://www.thehacker.recipes/) | Comprehensive AD attack playbook |
| [InternalAllTheThings](https://github.com/swisskyrepo/InternalAllTheThings) | AD and internal pentest cheatsheets |
| [AD Exploitation Cheat Sheet](https://github.com/S1ckB0y1337/Active-Directory-Exploitation-Cheat-Sheet) | Common AD enumeration and attack methods |
| [SpecterOps Blog](https://posts.specterops.io/) | Research on AD security and tradecraft |
| [harmj0y's blog](https://blog.harmj0y.net/) | Kerberos, delegation, and AD abuse research |
| [ADSecurity.org](https://adsecurity.org/) | Active Directory security deep dives |

## Credential Access

| Tool | Purpose |
|------|---------|
| [nanodump](https://github.com/fortra/nanodump) | Flexible LSASS dumper with many evasion modes |
| [Dumpert](https://github.com/outflanknl/Dumpert) | LSASS dumper using direct syscalls and API unhooking |
| [HandleKatz](https://github.com/codewhitesec/HandleKatz) | Position-independent LSASS dumper using cloned handles |
| [SharpDPAPI](https://github.com/GhostPack/SharpDPAPI) | C# port of Mimikatz DPAPI functionality |
| [SharpUp](https://github.com/GhostPack/SharpUp) | C# privilege-escalation checks (PowerUp port) |
| [SharpKatz](https://github.com/b4rtik/SharpKatz) | C# port of Mimikatz logonpasswords, ekeys, and DCSync |
| [ChromeKatz](https://github.com/Meckazin/ChromeKatz) | Dump cookies and credentials from Chrome/Edge process memory |
| [DumpBrowserSecrets](https://github.com/Maldev-Academy/DumpBrowserSecrets) | Extract browser tokens, cookies, and saved credentials |
| [hashcat](https://github.com/hashcat/hashcat) | World's fastest password-recovery / hash-cracking utility |
| [hate_crack](https://github.com/trustedsec/hate_crack) | Automates cracking methodologies through Hashcat |
| [SecLists](https://github.com/danielmiessler/SecLists) | The security tester's companion collection of wordlists |

## Evasion & Malware Development

| Tool / Resource | Purpose |
|-----------------|---------|
| [SysWhispers4](https://github.com/JoasASantos/SysWhispers4) | Direct/indirect syscall generation for AV/EDR evasion |
| [SysWhispers3](https://github.com/klezVirus/SysWhispers3) | Widely-used direct syscall generator |
| [HellsGate](https://github.com/am0nsec/HellsGate) | Original Hell's Gate dynamic syscall resolution technique |
| [RecycledGate](https://github.com/thefLink/RecycledGate) | Hell's/Halo's/Tartaros Gate combined; routes syscalls through ntdll |
| [FreshyCalls](https://github.com/crummie5/FreshyCalls) | Comfortable, low-boilerplate syscall usage |
| [Ekko](https://github.com/Cracked5pider/Ekko) | Sleep obfuscation proof-of-concept |
| [ThreadStackSpoofer](https://github.com/mgeeky/ThreadStackSpoofer) | Hide injected code by spoofing the thread call stack |
| [OffensiveRust](https://github.com/trickster0/OffensiveRust) | Rust weaponization patterns for red team engagements |
| [VX-API](https://github.com/vxunderground/VX-API) | Large collection of malicious-functionality helper routines |
| [awesome-malware-development](https://github.com/rootkit-io/awesome-malware-development) | Curated malware-dev and offensive research resources |
| [BypassAV](https://github.com/matro7sh/BypassAV) | Map of essential techniques to bypass AV and EDR |
| [SharpBlock](https://github.com/CCob/SharpBlock) | Bypass EDR user-mode hooks by blocking DLL entry points |
| [NetLoader](https://github.com/Flangvik/NetLoader) | In-memory C# loader that patches AMSI and ETW |
| [PackMyPayload](https://github.com/mgeeky/PackMyPayload) | Package payloads into containers to evade Mark-of-the-Web |
| [No-Consolation](https://github.com/fortra/No-Consolation) | BOF that runs unmanaged PEs inline |
| [coffee](https://github.com/hakaioffsec/coffee) | COFF/BOF loader written in Rust |
| [InlineExecute-Assembly](https://github.com/anthemtotheego/InlineExecute-Assembly) | Run .NET assemblies inside the Beacon process via BOF |
| [BOF.NET](https://github.com/CCob/BOF.NET) | .NET runtime for Cobalt Strike Beacon Object Files |

## Reverse Engineering & Malware Analysis

| Tool / Resource | Purpose |
|-----------------|---------|
| [x64dbg](https://github.com/x64dbg/x64dbg) | Open-source user-mode debugger tuned for RE and malware analysis |
| [radare2](https://github.com/radareorg/radare2) | UNIX-style reverse-engineering framework and CLI toolset |
| [Detect It Easy](https://github.com/horsicq/Detect-It-Easy) | Packer / compiler / linker detection |
| [PE-bear](https://github.com/hasherezade/pe-bear) | PE reversing tool with a friendly GUI |
| [pe-sieve](https://github.com/hasherezade/pe-sieve) | Scans a process for injected, replaced, or hooked implants |
| [hollows_hunter](https://github.com/hasherezade/hollows_hunter) | pe-sieve across all running processes for hunting implants |
| [libpeconv](https://github.com/hasherezade/libpeconv) | Library to load, manipulate, and dump PE files |
| [tiny_tracer](https://github.com/hasherezade/tiny_tracer) | Pin tool for tracing API calls and transitions |
| [capa](https://github.com/mandiant/capa) | Identify program capabilities from executables |
| [capa-rules](https://github.com/mandiant/capa-rules) | Standard rule collection for capa |
| [FLOSS](https://github.com/mandiant/flare-floss) | Automatically extract obfuscated strings from malware |
| [YARA](https://github.com/VirusTotal/yara) | Pattern-matching engine for malware classification |
| [LIEF](https://github.com/lief-project/LIEF) | Cross-format library to parse and instrument executables |
| [Capstone](https://github.com/capstone-engine/capstone) | Multi-architecture disassembly framework |
| [Unicorn](https://github.com/unicorn-engine/unicorn) | Lightweight multi-architecture CPU emulator framework |
| [System Informer](https://github.com/winsiderss/systeminformer) | Deep process, memory, and handle inspection (formerly Process Hacker) |
| [phnt](https://github.com/winsiderss/phnt) | Native API header set for Windows internals work |
| [mal_unpack](https://github.com/hasherezade/mal_unpack) | Dynamic unpacker built on pe-sieve |
| [PE Format (MS Docs)](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format) | Official PE specification |

## Privilege Escalation

| Tool / Resource | Purpose |
|-----------------|---------|
| [PEASS-ng](https://github.com/peass-ng/PEASS-ng) | winPEAS / linPEAS privilege-escalation enumeration suite |
| [GodPotato](https://github.com/BeichenDream/GodPotato) | SeImpersonate-to-SYSTEM across modern Windows versions |
| [SweetPotato](https://github.com/CCob/SweetPotato) | Collection of local service-to-SYSTEM techniques |
| [PwnKit](https://github.com/ly4k/PwnKit) | Self-contained CVE-2021-4034 (pkexec) local root exploit |
| [GTFOBins](https://gtfobins.github.io/) | Unix binaries for privilege escalation and evasion |
| [LOLBAS](https://lolbas-project.github.io/) | Living-off-the-land binaries, scripts, and libraries for Windows |

## OSINT & Recon

| Tool | Purpose |
|------|---------|
| [theHarvester](https://github.com/laramies/theHarvester) | Emails, subdomains, and names OSINT harvester |
| [recon-ng](https://github.com/lanmaster53/recon-ng) | Modular OSINT reconnaissance framework |
| [subfinder](https://github.com/projectdiscovery/subfinder) | Fast passive subdomain enumeration |
| [httpx](https://github.com/projectdiscovery/httpx) | Fast, multi-purpose HTTP probing toolkit |
| [naabu](https://github.com/projectdiscovery/naabu) | Fast, reliable port scanner |
| [SET](https://github.com/trustedsec/social-engineer-toolkit) | The Social-Engineer Toolkit for phishing and pretext payloads |

## Detection, DFIR & Threat Intel

| Tool / Resource | Purpose |
|-----------------|---------|
| [OffsetInspect](https://github.com/warpedatom/OffsetInspect) | PowerShell toolkit for detection-boundary and static analysis |
| [Sigma](https://github.com/SigmaHQ/sigma) | Generic, portable signature format for SIEM detection |
| [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) | Windows system monitoring and rich event logging |
| [Sysmon Community Guide](https://github.com/trustedsec/SysmonCommunityGuide) | TrustedSec's practical guide to Sysmon configuration |
| [Velociraptor](https://github.com/Velocidex/velociraptor) | Endpoint visibility and collection at scale |
| [Hayabusa](https://github.com/Yamato-Security/hayabusa) | Sigma-based Windows event-log threat hunting and timelining |
| [Chainsaw](https://github.com/WithSecureLabs/chainsaw) | Rapid search and hunt through Windows forensic artefacts |
| [RedELK](https://github.com/outflanknl/RedELK) | Red team SIEM for tracking ops and blue-team activity |
| [attack-stix-data](https://github.com/mitre-attack/attack-stix-data) | MITRE ATT&CK represented as STIX data |
| [MalwareSourceCode](https://github.com/vxunderground/MalwareSourceCode) | vx-underground's malware source archive for study |
| [Elastic Security Labs](https://www.elastic.co/security-labs) | EDR internals and detection research |

## Vulnerability Scanning & Web

| Tool / Resource | Purpose |
|-----------------|---------|
| [Nuclei](https://github.com/projectdiscovery/nuclei) | Fast, template-driven vulnerability scanner |
| [nuclei-templates](https://github.com/projectdiscovery/nuclei-templates) | Community template library for the Nuclei engine |
| [afrog](https://github.com/zan8in/afrog) | Security tool for bug bounty, pentest, and red teaming |
| [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings) | Payloads and bypasses for web app security and CTFs |
| [ysoserial.net](https://github.com/pwntester/ysoserial.net) | Deserialization payload generator for .NET formatters |

## Standards & Frameworks

| Framework | Purpose |
|-----------|---------|
| [MITRE ATT&CK](https://attack.mitre.org/) | Adversary tactics and techniques knowledge base |
| [MITRE D3FEND](https://d3fend.mitre.org/) | Defensive technique knowledge graph |
| [Atomic Red Team](https://github.com/redcanaryco/atomic-red-team) | Small, portable detection tests mapped to ATT&CK |

## Reference & Cheat Sheets

| Resource | Purpose |
|----------|---------|
| [HackTricks](https://github.com/HackTricks-wiki/hacktricks) | Sprawling wiki of tricks and techniques across every phase |
| [Red-Teaming-Toolkit](https://github.com/infosecn1nja/Red-Teaming-Toolkit) | Cutting-edge open-source security tools for red teamers |
| [RedTeam-Tools](https://github.com/A-poc/RedTeam-Tools) | Tools and techniques for red team / pentest engagements |
| [Awesome-Red-Teaming](https://github.com/yeyintminthuhtut/Awesome-Red-Teaming) | Curated red teaming resource list |
| [red-team-scripts](https://github.com/threatexpress/red-team-scripts) | Red-team-focused tools, scripts, and notes |
| [ired.team](https://www.ired.team/) | Red team notes and cheatsheets |
| [MDSec Blog](https://www.mdsec.co.uk/blog/) | Advanced red team tradecraft |

## Malware Analysis Services

| Resource | Purpose |
|----------|---------|
| [MalwareBazaar](https://bazaar.abuse.ch/) | Malware sample sharing platform |
| [VirusTotal](https://www.virustotal.com/) | Multi-scanner analysis service |
| [ANY.RUN](https://any.run/) | Interactive malware sandbox |
| [Unpac.me](https://www.unpac.me/) | Automated malware unpacking |

---

*Have a suggestion? Open an [issue](https://github.com/warpedatom/warpedatom.github.io/issues) or PR.*
