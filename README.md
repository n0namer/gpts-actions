# gpts-actions

Public, publication-safe OpenAPI contracts for custom GPT/OpenAI Actions.

## Source-of-truth model

This repository is the **publication source of truth** for Action schemas that may be loaded from a public Raw URL.

Runtime/service repositories remain the implementation source of truth for code, tests, deployment configuration and operational evidence. A service may keep an implementation-local API contract, but the released public GPT Action contract is the sanitized JSON stored here.

`server-ops` is the operational router and records pointers, topology, runbooks and incidents. It does not store duplicate OpenAPI payloads.

## Runtime discovery and routing

This repository is a publication catalog, **not a routing allowlist**.

For a configured GPT, the current runtime callable Action/tool surface is authoritative for what can actually be invoked now. The GPT should inspect current Action schemas/descriptions and optimize for the **fastest safe verified outcome**: capability fit, expected time-to-DONE, reuse of existing/native artifacts, specialization, verification evidence, blast radius, reversibility and expected troubleshooting/rework cost.

Default search order when applicable:

1. target-platform existing resources, native catalog, one-click templates and managed operations;
2. a specialized current Action for the exact mutation;
3. official ready-to-use image/package/release/template;
4. existing project artifact with a bounded patch;
5. generic API/terminal/manual orchestration;
6. new code/Compose/config from scratch only when faster reusable paths are absent or unsuitable.

Consequences:

- a newly connected callable Action is automatically eligible for selection even if its name is not hard-coded in the System Prompt;
- a schema or historical Action documented here but not connected to the current GPT is known but not callable;
- a renamed Action is selected by its current capability/schema rather than an old remembered connector label;
- a removed Action must never be hallucinated or simulated; the GPT should rediscover the current surface and select a fallback;
- System Prompt changes are required when universal operating policy changes, not whenever the Action inventory changes;
- for a targeted GitHub file mutation, `GitHub File Patch API` should normally beat a generic whole-file rewrite when it is callable and its preview/validation/expected-SHA/reread workflow covers the task;
- for a known target platform such as Coolify, inspect its existing resources and native one-click service/template catalog before generating a new Docker Compose stack.

Detailed selection, recovery and verification rules live in GPT Knowledge (`Capability Cards`, `Operator Protocol`, `SERVICE_CONTRACTS`), while `gpts-system-prompt.md` keeps the compact runtime law.

## Current Action contracts

| Action | Version | Public contract |
|---|---:|---|
| VPS Terminal | `0.3.0` | `actions/vps-terminal.openapi.json` |
| Universal Solver AgentField Control Plane | `0.1.0` | `actions/agentfield-control-plane.openapi.json` |
| GPT Coding Station | `0.4.0-wave4` | `actions/gpt-coding-station.openapi.json` |
| GitHub File Patch API | — | `actions/github-file-patch.openapi.json` |
| OpenClaw Agent (sync) | — | `actions/openclaw.openapi.json` |
| OpenClaw Async Hook | — | `actions/openclaw-hooks.openapi.json` |
| Hermes Agent (sync + async) | — | `actions/hermes.openapi.json` |
| LAN Ops Broker | `0.1.0` (transitional discovery-only) | `actions/lan-ops.openapi.json` |

LAN Ops `0.1.0` is **not** the final operator surface. The accepted target product is a terminal-like operator plane over the authenticated Broker -> WireGuard -> Edge -> Runner path. A later LAN Ops Action revision must add bounded one-shot execution plus managed session start/read/write/terminate after those endpoints exist and pass runtime acceptance. Do not publish speculative operations before the implementation is callable.

VPS Terminal `0.3.0` exposes bounded `exec.run` plus managed session start/read/write/terminate. Terminal mutation is server-side restricted to the allowed OpenClaw target; arbitrary-container exec is not part of the public Action contract.

## Legacy preservation

Retired Action contracts and old routing conventions must be preserved for audit/migration rather than silently erased. Historical material belongs under `legacy/` and must be clearly marked `LEGACY`, `DEPRECATED`, or `SUPERSEDED`; it must not be treated as proof that an operation is callable now.

When an Action is retired, preserve the last known publication-safe contract when available, record its former purpose and replacement/current migration path, then remove it from the **Current Action contracts** table. Do not invent an archived schema if the original bytes are unavailable.

## Sync and async behavior

- OpenClaw sync uses `/v1/chat/completions` or `/v1/responses` and waits for the final response in the same HTTPS request.
- OpenClaw async hook uses `/hooks/agent` and returns after runner admission; it does not provide pollable completion by itself.
- Hermes sync uses `/v1/chat/completions` or `/v1/responses` and waits for the final response in the same HTTPS request.
- Hermes async uses `/v1/runs` plus `/v1/runs/{run_id}` for polling and `/v1/runs/{run_id}/stop` for cancellation.

## Bearer mapping

- GPT Coding Station: Coolify application environment variable `ACTION_BEARER_TOKEN`; the API container receives only the SHA-256 verifier through `STATION_API_AUTH_SHA256`.
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
