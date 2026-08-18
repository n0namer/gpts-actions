# gpts-actions

Public, publication-safe OpenAPI contracts for custom GPT/OpenAI Actions.

## Source-of-truth model

This repository is the **publication source of truth** for Action schemas that may be loaded from a public Raw URL.

Runtime/service repositories remain the implementation source of truth for code, tests, deployment configuration and operational evidence. A service may keep an implementation-local API contract, but the released public GPT Action contract is the sanitized JSON stored here.

`server-ops` is the operational router and records pointers, topology, runbooks and incidents. It does not store duplicate OpenAPI payloads.

## Current Action contracts

| Action | Version | Public contract |
|---|---:|---|
| VPS Terminal | `0.3.0` | `actions/vps-terminal.openapi.json` |
| GitHub File Patch API | — | `actions/github-file-patch.openapi.json` |
| OpenClaw Agent (sync) | — | `actions/openclaw.openapi.json` |
| OpenClaw Async Hook | — | `actions/openclaw-hooks.openapi.json` |
| Hermes Agent (sync + async) | — | `actions/hermes.openapi.json` |

VPS Terminal `0.3.0` exposes bounded `exec.run` plus managed session start/read/write/terminate. Terminal mutation is server-side restricted to the allowed OpenClaw target; arbitrary-container exec is not part of the public Action contract.

## Sync and async behavior

- OpenClaw sync uses `/v1/chat/completions` or `/v1/responses` and waits for the final response in the same HTTPS request.
- OpenClaw async hook uses `/hooks/agent` and returns after runner admission; it does not provide pollable completion by itself.
- Hermes sync uses `/v1/chat/completions` or `/v1/responses` and waits for the final response in the same HTTPS request.
- Hermes async uses `/v1/runs` plus `/v1/runs/{run_id}` for polling and `/v1/runs/{run_id}/stop` for cancellation.

## Bearer mapping

- OpenClaw sync: runtime `OPENCLAW_GATEWAY_TOKEN` value.
- OpenClaw async hook: dedicated OpenClaw `hooks.token` value; do not reuse the Gateway token.
- Hermes sync + async: runtime `API_SERVER_KEY` value.

Store only the secret value in the GPT Builder Bearer/API Key field. Never commit bearer values to this repository.

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
