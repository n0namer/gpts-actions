# PLAN.md — gpts-actions Project SoT

Status: ACTIVE
Last reconciled: 2026-09-02
Current execution focus: **VPS Terminal DEV compact Action publication is DONE; consumer refresh is next.** Canonical `v0.7.0-dev.6` publishes 28 operations, replacing five dedicated file operations with one bounded `fileAction` closed-enum family. The next gate is GPT consumer schema refresh/import plus live `fileAction` E2E. AgentField connector repair remains paused as a separate workstream. Runtime implementation was already proven in DEV; GitHub was exact publication/write-back only, with no edit->redeploy coding loop.
Canonical project planning/decision owner for this repository. `README.md` owns publication usage/reference docs; `ERRORS.md` owns local error evidence; runtime evidence owns actual deployed/callable state.

## Project North Star

Make `gpts-actions` a trustworthy publication and policy package for the operator GPT: public Action contracts are safe and verifiable, the compact system prompt encodes universal runtime law without confusing publication with CURRENT callability, detailed Knowledge stays semantically aligned with that law, and regressions are caught by evidence before they reach the user.

In plain language: this repo should tell the GPT **what universal rules to follow** and **what Actions are safe to publish**, while never pretending that a published Action is automatically connected or that documentation is the live runtime.

## Authority boundaries

- `PLAN.md` — Project North Star, durable project decisions, phase goals, current roadmap and anti-drift checkpoints for this repo.
- `gpts-system-prompt.md` — compact runtime law; hard acceptance budget `<=8000` repository bytes.
- `README.md` — Action publication model, usage, authentication/publication guidance.
- `actions/*` — publication-safe public Action contracts.
- `ERRORS.md` — evidence-backed local error/lesson ledger.
- Google Drive canonical Knowledge (`Operator Protocol`, `Capability Cards`, `SERVICE_CONTRACTS`, `ALN`) — detailed runtime procedure/contracts/methods; must not drift from the system prompt.
- CURRENT callable surface/runtime — actual callability and live state; never inferred from this repo alone.
- BMAD-MNNZ — canonical workflow/skill definitions; use `bmad-help` to route planning/implementation skills, never as this project's SoT.

## Current verified position

Evidence at reconciliation:

- GitHub `main` HEAD before this plan: `398f2d711eaa001b862e6b117e991198b31141c4` (`Make project reporting Feynman-first`).
- `gpts-system-prompt.md`: SHA `6ae7c2ef876f4c915402d3aa9e5b87a7bbcd5d54`, repository size `7979` bytes.
- Regression review against pre-SourceLoop prompt restored all material guardrails that had been weakened by compression: no invented context/facts, evidence-backed root `ERRORS.md` learning, stage-aware ALN, generic evidence-first debug funnel/observability/no-mutate-only-diagnosis, plus SourceLoop/FVE bootstrap gating and container-first runtime loop.
- `README.md` declares this repo the Action publication SoT and explicitly says publication is not a routing allowlist.
- `ERRORS.md` contains eight evidence-backed incidents/lessons. Repeated prompt-budget overruns prove a machine anti-drift gate is needed.
- GitHub issue #26 is OPEN: canonical Google Drive `Operator Protocol` / `Capability Cards` still require authority-model synchronization and canonical reread. Local replacement copies are not authoritative.
- GitHub issue #25 is OPEN: its historical target `83` is stale. CURRENT inventory is 86 owned repos, 84 with default branches and 2 without; verified ledger coverage is at least 43/84 after four current rollout sub-batches.
- No `PLAN.md` existed before this reconciliation; it now exists on `main` and README links to it.
- Anti-drift validator: `scripts/validate-system-prompt.mjs`; workflow: `.github/workflows/system-prompt-anti-drift.yml`.
- GitHub Actions validation is currently infrastructure-blocked: run `33320654932` and one explicit retry `33320815477` both failed before any step with `runner_id=0` / `steps=[]`; this is not evidence that the validator logic failed.
- Fresh 2026-08-31 publication/readback: `actions/vps-terminal-dev.openapi.json` on `main` already publishes `readTargetFile`, `previewTargetPatch`, `applyTargetPatch`, `listTargetChanges`, `updateTargetWriteback`, `runTargetCheck`, and `reloadTarget`, including stale-safe `TargetPatchRequest` with `expected_sha256`, `old_text`, and `new_text`. The live DEV backend independently exposes the matching patch routes and its startup self-test passes file create/read/patch/journal/delete/rollback. The CURRENT GPT consumer session does not expose `previewTargetPatch` / `applyTargetPatch`, so status is `ACTION_SURFACE_PROPAGATION_PENDING`, not a schema/backend defect.

## Phase Goal — policy/package anti-drift

Bring the package to a state where accepted universal behavior and publication contracts cannot silently drift across `PLAN.md`, system prompt, README, Knowledge owners, and validation evidence.

Phase DoD:

1. Root `PLAN.md` exists and is linked from README.
2. System prompt passes automated hard-budget and semantic invariant checks on exact repository content.
3. Canonical Google Drive OP/CC authority semantics match the accepted typed-authority model; reread evidence closes #26/ERR-006/007.
4. Relevant publication schemas keep existing validation/consistency gates green.
5. Fleet error-memory rollout has an explicit bounded execution path and verified coverage evidence, not inferred counts.
6. Every completed batch updates this file from fresh evidence before selecting the next batch.

## Anti-drift invariants

These are project-level invariants, not temporary tasks:

1. Project SoT owns intended design/North Star; PROJECT_PIPELINE owns execution metadata; CURRENT runtime owns actual state.
2. `gpts-actions` publication never proves CURRENT Action callability.
3. System prompt repository size must be `<=8000` bytes after every mutation.
4. Tool acknowledgement never substitutes for resulting-state/DoD evidence.
5. Code publication/deploy claims require tested identity -> deployed identity -> functional evidence when applicable.
6. Auxiliary runtime creation remains explicit-approval scope.
7. Durable Knowledge changes update the existing canonical owner; no `v2/final/sidecar` copies as replacement SoT.
8. Project reports are Feynman-first: enough context for a reader who did not observe execution; technical terms remain but are briefly explained.
9. Verified project-resource deep links are preferred over vague navigation; URLs are never invented.
10. After each material batch: VERIFY -> update this PLAN/current evidence -> replan. A stale batch list is not authority.

## 30-minute execution batches

A batch is a bounded unit targeted at roughly 20–40 engineering minutes. Timebox is a planning tool, not permission to skip DoD. If evidence changes assumptions, stop/replan rather than finish the checklist mechanically.

### BATCH-01 — Establish SoT + automated prompt anti-drift
Status: DONE — exact-source validator PASS (`SYSTEM_PROMPT_ANTI_DRIFT_PASS bytes=7979`); hosted GitHub runner remains a separate infrastructure blocker
BMad route: `bmad-help` for project/state resolution; bounded direct implementation for repo validation assets.

Tasks:
- create this root `PLAN.md`;
- link it from `README.md`;
- add a zero-secret system-prompt validator checking hard byte budget and critical semantic invariants;
- run validator against exact `main` content/readback;
- update PLAN status with evidence.

DoD:
- `PLAN.md` readable on `main`;
- README points to it as project planning/decision SoT;
- validator exits 0 on current prompt and fails on budget/invariant violations;
- resulting files reread from GitHub.

### BATCH-02 — Canonical Knowledge authority sync
Status: BLOCKED_ON_CURRENT_CAPABILITY
BMad route: `bmad-help` -> document update/validation path; canonical owner is Google Drive.

Tasks:
- update existing Google Drive `Operator Protocol` and `Capability Cards` in place using the already identified before/after authority migration;
- search for stale PROJECT_PIPELINE-as-Project-SoT wording;
- run semantic scenarios: Project SoT vs pipeline, runtime drift, publication-not-callability;
- reread canonical Google docs;
- close/resolve #26 and ERR-006/007 only with canonical evidence.

DoD:
- no stale authority phrases remain in canonical docs;
- no duplicate Knowledge artifact created;
- canonical reread + semantic checks PASS.

Blocker: this session currently has no Google Drive/Docs write Action. Do not substitute local DOCX copies.

### BATCH-03 — Error-memory rollout reconciliation
Status: IN_PROGRESS — four rollout sub-batches PASS (32 repos); verified coverage >=43/84
BMad route: `bmad-help` -> bounded multi-repo execution batches.

Tasks:
- re-observe owned/managed repo inventory and existing `ERRORS.md` coverage;
- reconcile issue #25's historical 83-target assumption with CURRENT inventory;
- roll out only missing canonical ledgers in bounded repo groups with readback;
- never seed fabricated local incidents;
- record verified coverage and recurring cross-repo patterns.

DoD:
- coverage numerator/denominator comes from current evidence;
- no existing ledger overwritten;
- every mutation has readback;
- issue #25 updated/closed only when its actual DoD is met.

### BATCH-04 — Publication/evidence regression sweep
Status: PLANNED
BMad route: `bmad-help` -> relevant validation/review skill per affected Action contract.

Tasks:
- run existing publication consistency validators/workflows against changed publication surfaces;
- verify current schemas remain secret-safe/publication-safe;
- distinguish repo publication PASS from consumer/runtime propagation PASS;
- update README/PLAN only where current evidence changed.

DoD:
- exact validators/checks and results recorded;
- no publication status promoted to CURRENT callability;
- blockers classified precisely.

### BATCH-04A — VPS Terminal DEV compact file Action surface
Status: **PUBLICATION_DONE / CONSUMER_REFRESH_PENDING**
BMad route: `bmad-quick-dev` procedure for one bounded brownfield publication goal; implementation happened in the existing DEV workbench, followed by exact SourceLoop capture.

Evidence:
- container baseline validator PASS at 32 operations;
- `actions/vps-terminal-dev.openapi.json` edited in `workbench:/workspace/gpts-actions` to `v0.7.0-dev.6` with 28 operations;
- five dedicated file operationIds were replaced by one `fileAction` using closed enum `read|create|preview_patch|apply_patch|delete`;
- `FileActionRequest` is `additionalProperties=false`, exposes no generic `args`, and the backend already performs branch-specific field validation/mediation/readback on `/v1/target/file/action`;
- publication validator now requires the exact 28-operation inventory, enforces the `<=30` budget, exact five-value file enum, no generic `args`, and runs 7 mutation self-tests;
- container validation PASS: `operation_count=28`, `required_public_operations=28`, `mutation_self_tests=7`; `git diff --check` PASS; dirty set was exactly schema + validator;
- exact tested delta was captured to `main@f42a4e9137d0c761b5c972fec0277e0f9e5d9c81`; canonical schema/validator reread verified. No runtime redeploy occurred. Independent Coding Station rerun is currently infrastructure-blocked by Gateway Timeout, not a schema failure.

DoD for publication: **PASS**. Remaining acceptance boundary is consumer propagation: refresh/import this schema, prove CURRENT callable surface contains `fileAction` and no five legacy file operationIds, then run bounded live file E2E. Publication itself is not callability.

### BATCH-05 — Restore AgentField Actions/JIT execution channel
Status: IN_PROGRESS / TRANSPORT_PASS / CONTRACT_COMPATIBILITY_BLOCKED — public ingress and CURRENT Action transport are healthy; health/discovery PASS, while stale `/api/ui/v1/...` diagnostic routes and an unavailable writable live-patch target keep the full Action DoD open.
BMad route: `bmad-help` -> `bmad-quick-dev` (QQ, plan-code-review) for the single goal “restore the existing AgentField Action connector compatibility without changing SWE-AF/Universal Solver or using GitHub redeploy as the debug loop”. Canonical BMAD-MNNZ is workflow-only; this `PLAN.md` remains the project SoT.

Scope / non-targets:
- target: AgentField Actions/JIT connector path serving `https://agentfield-actions.srv1904412.hstgr.cloud`;
- existing AgentField DEV application: `edshqtkwskg3lrczekhcmd71`;
- existing gateway service: `fef1mmt9x9q1dcv0pb00svxi`;
- do not change SWE-AF product/runtime, Universal Solver runtime, or GitHub source as a code-debug/redeploy loop.

CURRENT evidence (reconciled 2026-09-02 from live readback):
- AgentField Action `agentfieldHealth` PASSes and `discoverAgentfieldCapabilities` PASSes; discovery shows `swe-planner` and `swe-pro` active, so the earlier `no available server` claim is stale and the transport/JIT availability subgate is closed;
- `listAgentfieldNodes` and node-detail diagnostics reach AgentField but fail on removed `/api/ui/v1/nodes/...` routes; execution logs/debug details likewise fail on removed `/api/ui/v1/executions/...` routes, proving the remaining connector defect is API-contract compatibility rather than transport;
- harmless `swe-planner.plan` execution `exec_20260901_140305_ubbppu2e` was accepted by the Action channel but later failed inside the SWE pipeline after `opencode run` made no progress for 300 seconds; that SWE/OpenCode timeout is a separate defect and remains outside this connector-only batch;
- the existing gateway has no source mount and runs inline Python as PID 1, so the compatibility change must be a bounded runtime/config hotfix rather than GitHub-code/redeploy debugging;
- `vps-terminal-dev` and PROD both expose the self target `vps-terminal-dev-gateway`, but its live-patch root is `/app/gateway`; `/app/config/targets.json` is outside that root. DEV mediation blocks generic registry mutation, while PROD can execute against the self target but direct write to `/app/config/targets.json` fails `EROFS` because the config is in the read-only image layer;
- therefore the nearest required implementation step is a one-time bootstrap of a writable, exact target-registry path (or equivalent typed target-registry mutation) in the existing VPS Terminal control plane, then register the existing AgentField gateway as a live-patch target and apply the compatibility mapping there.
- live gateway container `gateway-fef1mmt9x9q1dcv0pb00svxi` is running with restart_count=0 on private port 8080 and has no source mount;
- gateway PID 1 is inline Python listening on `0.0.0.0:8080`; `/health` is local and independent of upstream auth;
- client Action auth remains separate from upstream auth; upstream requests receive `X-API-Key` from `AGENTFIELD_UPSTREAM_API_KEY`;
- gateway upstream target is the current control-plane container on port 8080;
- AgentField control-plane/workforce logs already evidenced successful `swe-planner`/`swe-pro` node registration/initialization;
- publication schema `actions/agentfield-control-plane.openapi.json` exists on `main` (SHA `af6462313f0dc68edd3f4ec7baa7b6fa278fea99`) and publishes server `https://agentfield-actions.srv1904412.hstgr.cloud` plus the required health/discovery/execution/status/log operations;
- a separate working JIT Action on the same host proves that Coolify `fqdn=null` alone is not sufficient to explain `no available server`.

Working diagnosis / verified delta:
- external DNS and TLS are healthy and resolve the Action hostname to VPS `2.24.1.151`;
- before repair, independent external `GET /health` returned Traefik `503` body `no available server`; exact generated Coolify Compose for service `fef1mmt9x9q1dcv0pb00svxi` had no Traefik router/service labels and the proxy dynamic-file inventory had no AgentField route;
- the bounded connector-plane repair restored HTTP/HTTPS Traefik labels for the existing gateway only; Coolify materialized new gateway generation `b1fe2eb4099045a6dbdcb45eb1de58bdc03f04cf3f3d9dfb6fab2ef5f105afaa` with new compose config hash `6732c0c0cd9b40e0cf26face12fb3e0a80191c172d14468a176b2386e5b7ce01`;
- post-repair independent external `GET /health` returns HTTP `200` with `{"status":"healthy","gateway":"ok"}`; AgentField DEV/SWE runtime was not changed;
- subsequent CURRENT Action readback superseded the earlier post-ingress observation: `agentfieldHealth` and discovery now PASS through the loaded `agentfield_actions` consumer, so no second JIT-binding defect is currently evidenced;
- BMAD `bmad-help` was activated from canonical BMAD-MNNZ and routed this implementation-stage single-goal repair to `bmad-quick-dev` (QQ, plan-code-review). The project has no local BMAD installation/config evidence, so canonical BMAD rules govern workflow while project artifacts remain in this repo.

Tasks (20/80 order, reconciled):
1. bootstrap one exact writable target-registry path (or typed registry mutation) in the existing VPS Terminal control plane; do not broaden `/app/config` generally;
2. register the existing AgentField gateway as a live-patch target and verify target readback before mutation;
3. map only the verified stale Action diagnostic routes to CURRENT AgentField `/api/v1/...` equivalents, using source/API evidence for every mapping;
4. verify health/discovery remain PASS, then nodes/details and bounded execution status/log evidence; keep the separate SWE/OpenCode timeout outside this connector batch;
5. write back verified cause/fix/evidence to this PLAN and add/update `ERRORS.md` only if the failure pattern is reusable and verified.

DoD:
- `agentfieldHealth` PASS;
- `discoverAgentfieldCapabilities` PASS;
- `listAgentfieldNodes` shows `swe-planner` active/ready;
- one harmless SWE reasoner execution is accepted and completes;
- `getAgentfieldExecution` returns terminal status/result;
- `getAgentfieldExecutionLogs` (or equivalent bounded execution evidence) PASSes for that execution;
- no SWE-AF source/runtime, Universal Solver runtime, or GitHub code redeploy was used to obtain the fix.

Rollback/recovery:
- preserve the current running gateway and AgentField DEV as fallback;
- mutate only the exact JIT/connector-plane state proven stale/missing;
- after any ambiguous mutation, reread backend availability before retrying; identical mutation retry budget is one unless new evidence changes the route.

## Anti-drift checkpoint used after every batch

Before selecting the next batch, answer from fresh evidence:

1. What is the Project North Star?
2. What is the current Phase Goal?
3. What exact DoD did this batch target, and which criteria have evidence?
4. What materially changed in repo/runtime/Knowledge?
5. Did any authority assumption become stale or conflict?
6. What is the smallest next DoD-capable batch toward the North Star?

If answers 1–4 cannot be supported, do not advance the plan; classify the evidence gap first.

## Live blockers / debts

- `KNOWLEDGE_WRITEBACK_BLOCKED`: canonical Google Drive OP/CC migration cannot be performed from the CURRENT tool surface in this session.
- Issue #26 evidence contains an older prompt SHA/size; this PLAN's current verified prompt identity supersedes those historical values for current-state reporting.
- Issue #25 inventory/coverage must be re-observed before further mass rollout; historical counts are planning evidence, not CURRENT inventory.

## Useful direct links

Project plan:
https://github.com/n0namer/gpts-actions/blob/main/PLAN.md

System prompt:
https://github.com/n0namer/gpts-actions/blob/main/gpts-system-prompt.md

System prompt raw:
https://raw.githubusercontent.com/n0namer/gpts-actions/main/gpts-system-prompt.md

Publication README:
https://github.com/n0namer/gpts-actions/blob/main/README.md

Error ledger:
https://github.com/n0namer/gpts-actions/blob/main/ERRORS.md

Knowledge-sync issue #26:
https://github.com/n0namer/gpts-actions/issues/26

Error-memory rollout issue #25:
https://github.com/n0namer/gpts-actions/issues/25

BMAD control plane:
https://github.com/n0namer/BMAD-MNNZ
