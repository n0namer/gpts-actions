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
| Universal Solver AgentField Control Plane | `0.2.4` | `actions/agentfield-control-plane.openapi.json` |
| GPT Coding Station | `0.4.0-wave4` | `actions/gpt-coding-station.openapi.json` |
| GitHub File Patch API | — | `actions/github-file-patch.openapi.json` |
| OpenClaw Agent (sync) | — | `actions/openclaw.openapi.json` |
| OpenClaw Async Hook | — | `actions/openclaw-hooks.openapi.json` |
| Hermes Agent (sync + async) | — | `actions/hermes.openapi.json` |
| LAN Ops Broker | `0.2.0` | `actions/lan-ops.openapi.json` |

LAN Ops `0.2.0` publishes the accepted terminal-capable operator surface over the authenticated Broker -> WireGuard -> Edge -> Runner path. In addition to LAN discovery, it exposes bounded one-shot command execution plus managed terminal session start/get/read/write/terminate. Publication of the contract does not by itself prove Windows runtime acceptance: the current callable surface must still be verified against the live Personal Edge before claiming end-to-end PASS.

VPS Terminal `0.3.0` exposes bounded `exec.run` plus managed session start/read/write/terminate. Terminal mutation is server-side restricted to the allowed OpenClaw target; arbitrary-container exec is not part of the public Action contract.

### AgentField `0.2.4` debugging surface

The AgentField Action is designed as an evidence-first diagnostic interface, not as a generic shell. In addition to health, discovery, execution and status, the public contract exposes bounded read-only debugging operations for recent executions, execution details, structured execution logs, workflow-run list/detail, node summary/detail, bounded node process logs and reasoner inventory.

Recommended GPT debugging order is: health → locate execution/run → status/result → execution details → bounded execution logs → correlated workflow run → node details/process logs only if execution-scoped evidence is insufficient. Keep correlation identifiers (`execution_id`, `run_id`/workflow id, node/agent id, reasoner id and timestamps) in the analysis. Start with a small log tail and add level/source/text filters only as needed; do not dump whole log streams into model context.

SSE execution events remain runtime-accessible but are intentionally excluded from the GPT Action debug funnel because long-lived streaming responses can time out or flood context. Lifecycle writes are separate from diagnosis and must not be inferred from read-only debugging operations.

`0.2.4` remains a provisional publication-schema release, not a Builder acceptance claim. It retains the 0.2.2 normalization (`x-openai-isConsequential` metadata on all 14 operations and removal of several empty schema objects), documents the live execute target format `<agent_id>.<reasoner_id>`, corrects node-log bounding to the native `tail_lines` query parameter, and explicitly marks native colon-form `invocation_target` discovery values as informational metadata rather than executable targets. The known-working reference contracts use both annotated and unannotated operations, so the normalization itself is not evidence of GPT Builder compatibility. Node process logs intentionally retain the native bounded `application/x-ndjson` wire format; this is the only response media type that differs from the selected JSON-only working reference contracts and must be confirmed by Builder import/Preview before final acceptance.

Publishing `0.2.4` here does not update an already-open GPT conversation. GPT Builder must import/refresh the current schema, and a new-session acceptance must confirm that all published operation IDs—including node logs—are actually callable before claiming `AGENTFIELD_DEBUG_ACTION_PASS`.

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
