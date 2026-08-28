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
| VPS Terminal DEV | `0.7.0-dev.1` | `actions/vps-terminal-dev.openapi.json` |
| Universal Solver AgentField Control Plane | `0.2.8` | `actions/agentfield-control-plane.openapi.json` |
| GPT Coding Station | `0.4.0-wave4` | `actions/gpt-coding-station.openapi.json` |
| Context Fabric | `0.1.0` | `actions/context-fabric.openapi.json` |
| GitHub File Patch API | — | `actions/github-file-patch.openapi.json` |
| OpenClaw Agent (sync) | — | `actions/openclaw.openapi.json` |
| OpenClaw Async Hook | — | `actions/openclaw-hooks.openapi.json` |
| Hermes Agent (sync + async) | — | `actions/hermes.openapi.json` |
| LAN Ops Broker | `0.2.0` | `actions/lan-ops.openapi.json` |

LAN Ops `0.2.0` publishes the accepted terminal-capable operator surface over the authenticated Broker -> WireGuard -> Edge -> Runner path. In addition to LAN discovery, it exposes bounded one-shot command execution plus managed terminal session start/get/read/write/terminate. Publication of the contract does not by itself prove Windows runtime acceptance: the current callable surface must still be verified against the live Personal Edge before claiming end-to-end PASS.

VPS Terminal `0.3.0` exposes bounded `exec.run` plus managed session start/read/write/terminate. Terminal mutation is server-side restricted to the allowed OpenClaw target; arbitrary-container exec is not part of the public Action contract.

### AgentField `0.2.8` debugging and persisted logs surface

The AgentField Action is an evidence-first diagnostic interface, not a generic shell. It exposes health, bounded discovery, execution/status, recent executions, execution details/logs, workflow-run correlation, node summary/details, live node logs, reasoner inventory, and persisted-log reads from the workforce volume.

Recommended order is: execution-scoped evidence first, then live node logs, then persisted logs when a node is offline or its live `/agentfield/v1/logs` route is unavailable. Persisted reads are bounded, read-only and credential-like values are redacted. Arbitrary filesystem paths, config files, PID files and secret directories are not exposed.

`0.2.8` adds five persisted-log operations: summary, installed-agent inventory, persisted agent logs through native `af logs`, runlog inventory, and bounded runlog tail. Native live node logs keep `tail_lines` and `application/x-ndjson`; persisted-log responses are bounded JSON. The `0.2.8` schema also uses explicit object `properties` throughout for GPT Builder compatibility.

The previously accepted `0.2.6` Builder surface exposed 14 operations. `0.2.8` publishes 19 operations total. Publishing the schema does not refresh an already-open GPT conversation; Builder re-import and a new-session acceptance are required before claiming the five persisted-log operation IDs are callable there.

## Consumer publication acceptance

Repository publication is necessary but not sufficient for a callable GPT Action. For any added, removed or renamed operation, acceptance requires all of the following:

1. validate and merge the publication-safe schema here;
2. re-import/refresh that schema in the intended GPT consumer configuration;
3. start a new consumer session when the platform snapshots tool definitions per conversation;
4. rediscover the current callable surface and verify the exact expected `operationId` set;
5. run at least one bounded live call/readback for every newly required operation and one negative check for any removed/forbidden operation;
6. record `ACTION_SURFACE_PROPAGATION_PENDING` instead of DONE whenever repository publication is newer than the current callable surface.

For VPS Terminal DEV specifically, `recordProposedLesson` is not accepted merely because `actions/vps-terminal-dev.openapi.json` contains it. Consumer acceptance requires the operation to be callable, a PROPOSED lesson write/readback to succeed, caller-controlled VERIFIED to remain impossible, and internal canary operations to remain absent from the public surface.

## Legacy preservation

Retired Action contracts and old routing conventions must be preserved for audit/migration rather than silently erased. Historical material belongs under `legacy/` and must be clearly marked `LEGACY`, `DEPRECATED`, or `SUPERSEDED`; it must not be treated as proof that an operation is callable now.

When an Action is retired, preserve the last known publication-safe contract when available, record its former purpose and replacement/current migration path, then remove it from the **Current Action contracts** table. Do not invent an archived schema if the original bytes are unavailable.

## Sync and async behavior

- OpenClaw sync uses `/v1/chat/completions` or `/v1/responses` and waits for the final response in the same HTTPS request.
- OpenClaw async hook uses `/hooks/agent` and returns after runner admission; it does not provide pollable completion by itself.
- Hermes sync uses `/v1/chat/completions` or `/v1/responses` and waits for the final response in the same HTTPS request.
- Hermes async uses `/v1/runs` plus `/v1/runs/{run_id}` for polling and `/v1/runs/{run_id}/stop` for cancellation.

## Authentication mapping

- Universal Solver AgentField Control Plane: canonical GPT Builder secret name is `ACTION_BEARER_SECRET`, sent as `Authorization: Bearer <token>`. The gateway maps that value to its runtime `ACTION_BEARER_TOKEN`. The older `X-API-Key` / `AGENTFIELD_ACTION_KEY` path remains a runtime compatibility fallback but is no longer the published Action default. Native AgentField MCP is available at `/mcp` behind the same gateway authentication boundary.
- GPT Coding Station: Coolify application environment variable `ACTION_BEARER_TOKEN`; the API container receives only the SHA-256 verifier through `STATION_API_AUTH_SHA256`.
- OpenClaw sync: runtime `OPENCLAW_GATEWAY_TOKEN` value.
- OpenClaw async hook: dedicated OpenClaw `hooks.token` value; do not reuse the Gateway token.
- Hermes sync + async: runtime `API_SERVER_KEY` value.
- LAN Ops Broker: runtime `BROKER_API_TOKEN` value. `EDGE_INTERNAL_TOKEN` is strictly Broker -> Edge and must never be placed in GPT Builder.

Store only the secret value in the GPT Builder Bearer/API Key field. Never commit bearer values to this repository.

### Action bearer placement rail (mandatory)

Before publishing or re-importing any GPT Action whose bearer must be copied into GPT Builder, verify the deployment-platform secret metadata, not only runtime authentication.

For Coolify-hosted Actions the canonical bearer source is an **application environment variable** owned by the application configuration. The acceptance contract is:

- `is_runtime=true`;
- `is_coolify=false` — the bearer must not be a platform-generated/managed `SERVICE_*` or Docker-derived variable;
- `is_shared=false` unless the Action contract explicitly requires a shared credential;
- `is_shown_once=false` when an operator must copy the value into GPT Builder;
- the container/runtime may consume the environment value, but Docker/container configuration must not be treated as the source of truth for the bearer.

If any required metadata flag is wrong, the Action credential setup is **FAIL** even when an authentication probe succeeds. Correct the application environment metadata first, recreate/reload the affected runtime if needed, then verify both: (1) metadata readback satisfies this contract and (2) wrong/missing bearer is rejected while the intended bearer reaches the authenticated endpoint. Never print the bearer during verification.

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
