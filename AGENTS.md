# AGENTS.md

## Repository role and authority

`gpts-actions` is the publication/policy repository for sanitized GPT/OpenAI Action contracts and the compact GPT system prompt. It is **not** the runtime implementation SoT and it is **not** proof of CURRENT callability.

Before material work read, in order: `PLAN.md` (Project North Star / Phase Goal / DoD), `README.md` (publication model and contract inventory), `ERRORS.md` (local evidence-backed failure ledger), then the affected `actions/*.openapi.json`, validation script(s), and `gpts-system-prompt.md` when prompt policy is in scope. The canonical cross-repo engineering standard is `n0namer/server-ops:main:docs/standards/FAST_VERIFIED_ENGINEERING.md`.

Authority boundaries are strict:
- `PLAN.md` owns project intent, phase goals and anti-drift checkpoints.
- `actions/*.openapi.json` owns publication-safe public Action contracts.
- runtime/service repos own implementation, tests, deployment configuration and operational truth.
- CURRENT connected tool schemas own what a GPT can actually call now; publication here never proves callability.
- `server-ops` owns cross-service operational pointers/runbooks/incidents; do not duplicate them here.
- `ERRORS.md` owns this repo's verified local lessons; read it before mutation and dedupe rather than restating incidents.

## Project North Star and current engineering objective

North Star: make `gpts-actions` a trustworthy publication and policy package: public Action contracts are safe and verifiable, the compact system prompt encodes universal runtime law without confusing publication with CURRENT callability, detailed Knowledge stays semantically aligned, and regressions are caught by evidence before reaching users.

Current phase from `PLAN.md`: policy/package anti-drift. For Action-surface work the local completion boundary is **publication correctness plus consumer propagation evidence**; repository publication alone is necessary but not sufficient.

## Fast Verified Engineering contract

Optimize for **time-to-verified-running-change**, not time-to-patch or time-to-merge.

Core loop:
`OBSERVE -> LOCALIZE -> ROUTE -> PATCH -> TARGETED VERIFY -> ITERATE -> FULL VERIFY -> RUNTIME PROOF -> CANONICALIZE -> DEPLOY -> POST-DEPLOY VERIFY -> WRITE-BACK`

Use only the stages needed for the task, but never skip evidence required by its DoD.

Always keep these evidence layers separate:
1. Project/design SoT — what should exist.
2. Source-on-disk — exact repository/worktree bytes and SHA.
3. Loaded runtime — what process/container/config/schema is actually loaded.
4. Concrete execution — what happened for one request/job/run.
5. Deterministic validation — what exact tests/checks passed on what exact source.
6. Functional/semantic outcome — whether the intended user-visible behavior is correct.

Therefore: code-on-disk != loaded runtime; test PASS != deploy proof; HTTP 200/health/`succeeded` != functional or semantic acceptance; published OpenAPI != CURRENT callable GPT surface.

## Routing and coding lanes

Choose the route with the lowest expected time-to-verified change while preserving reversibility and evidence.

- **Runtime-bound defects:** use an already-authorized permanent DEV runtime with bounded/stale-safe patch, targeted check, same-runtime reload only when required, then canary + bounded logs/execution evidence. Production live editing is forbidden by default.
- **Source-bound / multi-file / refactor work:** prefer an exact-SHA isolated GPT Coding Station session when CURRENT callable and healthy. Preserve the exact accepted delta when moving it elsewhere.
- **Publication-contract changes in this repo:** work on a development branch, validate the exact schema bytes, privacy constraints and repo-specific validator locally/isolated when possible, then canonicalize through GitHub. Do not edit a runtime service here.
- **GitHub/CI/redeploy:** canonicalization/release boundary, not the inner debug loop for every hypothesis. If CI fails before runner assignment/steps, classify it as validation infrastructure evidence, not application-test failure.

A verified fix must be transported as the **same exact delta** between runtime, Coding Station and GitHub; do not reimplement it from memory.

## Repository-specific validation

Use existing validators; do not invent commands. Known canonical checks in this repository include:
- system prompt: `node scripts/validate-system-prompt.mjs`;
- VPS Terminal DEV publication consistency: `node scripts/validate-vps-terminal-dev-publication.mjs`;
- VPS Terminal DEV approval publication: `node scripts/validate-vps-terminal-dev-approval-publication.mjs`.

Validation ladder:
`JSON/syntax/static -> affected publication validator -> related publication regressions -> all required repo validators -> runtime/API smoke -> consumer Action callability -> functional/semantic/E2E acceptance`.

For `gpts-system-prompt.md`, repository readback must also prove the hard `<=8000` byte budget after every mutation; local estimates are advisory only.

For `actions/*.openapi.json`, verify at minimum:
- valid JSON/OpenAPI and stable `operationId`s;
- only the intended public operations are exposed;
- no tokens, credentials, cookies, private keys, private IPs, Docker socket paths, Coolify/deployment UUIDs, runtime snapshots or internal-only architecture details leak;
- public `servers.url` is correct and neutral/stable where possible;
- affected repo validator PASSes on the exact source.

## Runtime, deployment and consumer acceptance

This repository has no standalone application runtime to deploy. Runtime truth belongs to the corresponding service repo and live service. For publication changes, bind evidence to both identities: exact schema commit/SHA here and exact live service/API identity where relevant.

A published Action change is not DONE until the intended GPT consumer has refreshed/re-imported the schema when required, a fresh session exposes the expected exact `operationId` set, and at least one bounded live call/readback proves each newly required operation. For removed/forbidden operations, add a negative callability check where meaningful.

Known relevant DEV runtime evidence for VPS Terminal DEV is owned by the `vps-terminal` project; do not hard-code transient container IDs here. Use CURRENT runtime tools to discover exact targets. `vps-terminal-dev-gateway` is a known registered DEV target only when CURRENT readback confirms it. Runtime/source identity and request/execution/correlation IDs should accompany logs or canary evidence.

Diagnose narrow-to-broad: structured execution/status evidence -> execution-scoped logs -> bounded runtime logs -> broader service/node logs only if still needed.

## Mutation, rollback and write-back discipline

Before mutation observe exact branch/head and affected file SHA. Preserve unrelated state and an explicit rollback/recovery path. Use stale-safe exact patches when available. After timeout or ambiguous mutation, read post-state before retrying; retry an identical failed mutation at most once unless new evidence changes the diagnosis.

Do not create `v2`, `final`, sidecar or duplicate canonical documents when an owner exists. Update canonical owners in place. Nested `AGENTS.md` is justified only when a subtree has materially different rules.

Write-back ownership:
- project decision/progress -> `PLAN.md`;
- publication usage/contract inventory -> `README.md`;
- reusable verified local incident/lesson -> `ERRORS.md`;
- public Action contract -> matching `actions/*.openapi.json`;
- universal compact runtime law -> `gpts-system-prompt.md`;
- runtime implementation/deploy facts -> owning service repo, not here.

## DoD and reporting

For any batch define the exact target/env and DoD before patching. Validation blockers (missing runner, dependency, credential-free access, consumer refresh, unavailable runtime) are not application failures.

Final status is exactly one of:
`DONE | PARTIAL | BLOCKED | FAILED | EVIDENCE_MISSING`

`DONE` requires all task-specific DoD evidence, including runtime/consumer proof when the change affects a callable Action surface. Report separately: what changed, what exact source was tested, what runtime/consumer actually executed, what acceptance evidence passed, and what remains.