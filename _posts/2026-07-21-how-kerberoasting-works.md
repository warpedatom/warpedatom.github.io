---
layout: post
title: "How Kerberoasting works"
date: 2026-07-21
---

Kerberoasting (MITRE ATT&CK **T1558.003**) is one of those techniques that
survives because it abuses the protocol exactly as designed. Any authenticated
domain user can request a service ticket for an account that has a Service
Principal Name, and part of that ticket is encrypted with a key derived from the
service account's password. Request it, take it offline, and crack it - no
elevated rights, no touching the target service.

## The protocol detail it leans on

In Kerberos, when a user wants to reach a service, the KDC issues a **TGS**
(service ticket). A portion of that ticket is encrypted with the *service
account's* long-term key. For a machine account that key is random and
effectively uncrackable. But when the SPN is registered to a **regular user
account** - a SQL service running as `svc_sql`, say - the key derives from a
human-chosen password. That's the whole game.

The attacker never needs to authenticate *to* the service. They just ask the KDC
for the ticket, which the KDC will hand to any valid domain principal:

```text
1. Enumerate accounts that have an SPN set (LDAP: servicePrincipalName=*).
2. Request a TGS for each SPN.
3. Extract the encrypted blob and crack it offline against a wordlist.
```

Because step 3 is offline, there's no lockout, no failed-logon noise on the
target, and no rate limit.

## Why RC4 makes it worse

Tickets encrypted with **RC4-HMAC (etype 23)** are far faster to crack than
AES, and a downgrade to RC4 is often possible. Defenders should watch for a spike
in **TGS requests (event 4769)** for RC4 etype, especially many distinct SPNs
from one principal in a short window.

## Cutting it off

- Give service accounts **long, random passwords** - 25+ characters makes
  offline cracking impractical. Group Managed Service Accounts (gMSAs) do this
  for you and rotate automatically.
- **Retire unnecessary SPNs.** An account with no SPN can't be roasted.
- **Disable RC4** where the environment allows, forcing AES etypes.
- Alert on 4769 patterns rather than trying to block the request itself - the
  request is legitimate Kerberos traffic, which is precisely why the technique
  endures.
