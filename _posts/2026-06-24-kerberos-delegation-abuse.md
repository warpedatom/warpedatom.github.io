---
layout: post
title: "Kerberos delegation abuse: unconstrained, constrained, RBCD"
date: 2026-06-24
---

Delegation exists so a front-end service can act on a user's behalf against a
back-end - a web app reaching a database as *you*, not as itself. Useful, and
routinely turned into a privilege-escalation path. There are three flavors, each
abused differently.

## Unconstrained

A computer trusted for **unconstrained delegation** caches the TGT of any user
who authenticates to it. So if you control such a host and can convince a
privileged account to authenticate to it - the classic trick is coercing a
domain controller with the *printer bug* - its TGT lands in your memory, ready to
reuse. One caching service plus one coerced DC equals Domain Admin.

## Constrained

**Constrained delegation** (`msDS-AllowedToDelegateTo`) limits a service to named
SPNs, which sounds safer. The catch is **S4U2Self** + **S4U2Proxy**: an account
with constrained delegation and *protocol transition* can request a service
ticket **to itself as any user**, then forward it to the allowed SPNs - no
password from the victim required. And because delegation targets an SPN, not a
service, an attacker can often swap the service class (`http` → `cifs`) to reach
more than intended on the same host.

## Resource-based (RBCD)

RBCD flips the trust: the *resource* declares who may delegate to it, in
`msDS-AllowedToActOnBehalfOfOtherIdentity`. That attribute lives on the target
computer object - so if you have write access to it (a `GenericWrite`, or the
right to create a machine account), you can point delegation at an account you
control and impersonate any user to that host.

## Reining it in

- Mark high-value accounts **"Account is sensitive and cannot be delegated"** and
  add them to **Protected Users**.
- Retire **unconstrained** delegation entirely where you can; it's the sharpest
  edge.
- Tightly control **who can write** delegation attributes and create machine
  accounts (`ms-DS-MachineAccountQuota` of 0 closes the easy RBCD path).
- Hunt for `TrustedForDelegation` flags and unexpected `msDS-AllowedToActOnBehalf`
  writes in your directory as configuration drift, not just at attack time.
