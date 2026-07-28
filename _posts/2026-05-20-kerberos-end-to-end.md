---
layout: post
title: "Kerberos, end to end"
date: 2026-05-20
tags: [kerberos, active-directory]
---

Almost every Active Directory attack worth knowing rides on Kerberos, so it pays
to hold the whole exchange in your head. Strip away the acronyms and it's three
conversations: prove who you are, get a ticket for a service, present it.

## The three exchanges

**AS-REQ / AS-REP - authentication.** The client encrypts a timestamp with a key
derived from the user's password (pre-authentication) and sends it to the KDC.
If the KDC can decrypt it, the user is who they claim. It returns a
**Ticket-Granting Ticket (TGT)**, encrypted with the **krbtgt** account's key -
so only a domain controller can read it back.

**TGS-REQ / TGS-REP - authorization.** To reach a service, the client presents
its TGT and names a **Service Principal Name (SPN)**. The KDC issues a **service
ticket (TGS)**, and here's the key detail: a portion is encrypted with the
*service account's* long-term key.

**AP-REQ - access.** The client hands the service ticket to the service, which
decrypts it with its own key. The service never talks to the KDC to validate it -
it trusts anything encrypted with its key.

```text
Client ──AS-REQ──►  KDC        (pre-auth timestamp)
Client ◄─AS-REP───  KDC        (TGT, sealed with krbtgt key)
Client ──TGS-REQ─►  KDC        (TGT + target SPN)
Client ◄─TGS-REP──  KDC        (service ticket, sealed with service key)
Client ──AP-REQ──►  Service    (present the ticket)
```

## Why the attacks fall out of the design

Every well-known technique keys on one of these facts:

- The service-ticket blob is encrypted with the service account's key - if that
  account is a user with a weak password, you can crack it offline. That's
  **Kerberoasting**.
- Accounts without pre-auth leak an AS-REP encrypted with their key -
  **AS-REP roasting**.
- The TGT is sealed with the krbtgt key. Steal that key and you can forge a TGT
  for anyone - a **golden ticket**.
- The service trusts its own key blindly, so forging a service ticket with the
  service account's hash - a **silver ticket** - never touches the KDC and leaves
  no `4768`/`4769`.

Hold this map and the rest of AD attack tradecraft stops being a list of tricks
and starts being consequences of one protocol.
