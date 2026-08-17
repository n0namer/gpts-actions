# gpts-actions

Public, publication-safe OpenAPI contracts for custom GPT/OpenAI Actions.

## Source-of-truth model

This repository is the **publication source of truth** for Action schemas that may be loaded from a public Raw URL.

Runtime/service repositories remain the implementation source of truth for code, tests, deployment configuration and operational evidence. A service may keep an implementation-local API contract, but the released public GPT Action contract is the sanitized JSON stored here.

`server-ops` is the operational router and records pointers, topology, runbooks and incidents. It does not store duplicate OpenAPI payloads.

## Current Action contracts

| Action | Public contract |
|---|---|
| VPS Terminal | `actions/vps-terminal.openapi.json` |
| GitHub File Patch API | `actions/github-file-patch.openapi.json` |

## Publication rules

Every published contract must:

- use JSON (`*.openapi.json`);
- contain only the operations required by the GPT Action;
- contain no tokens, credentials, cookies, private keys or secret values;
- contain no private IPs, Docker socket paths, Coolify/deployment UUIDs, runtime snapshots or internal architecture details;
- avoid internal repository/path examples when generic examples are sufficient;
- expose only the public `servers.url` required to call the API;
- prefer a neutral, stable public hostname when available;
- pass JSON/OpenAPI validation, privacy/secret scanning and read-back verification before release.

## Release flow

`service change → select public surface → sanitize → validate → privacy scan → preview/test → publish JSON here → update server-ops pointer`

Do not make an infrastructure/runtime repository public merely to obtain a Raw URL for an Action schema.
