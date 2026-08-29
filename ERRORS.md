# ERRORS.md

Local evidence-backed error ledger for this repository. Read before serious work here. Append only material verified errors or recurring failure patterns; dedupe instead of restating. Never store secrets.

## Entry contract

Each entry records: `ID/date/status`, symptom, evidence, cause + confidence, impact, fix, prevention, verification, and links/commit when available. If cause is not proven, mark it inferred. `RESOLVED` requires readback/test evidence; recurrence reopens or links the prior entry.

## ERR-2026-08-29-001 — Goal hierarchy drift

- **Status:** RESOLVED
- **Symptom:** `PROJECT_PIPELINE`, a local milestone/gate, and the Project North Star were not separated strongly enough; Phase Goal was missing as a first-class level.
- **Evidence:** user correction during system-prompt review; pre-fix prompt allowed `North Star` reporting without explicit `Project North Star → Phase Goal → gate/DoD → next move` hierarchy.
- **Cause (high confidence):** prompt compressed project SoT and execution-state concepts too aggressively.
- **Impact:** wrong North Star, misleading progress/ETA, and risk of optimizing a local acceptance gate as if it were the project goal.
- **Fix:** Project SoT now owns Project North Star/architecture/decisions; `PROJECT_PIPELINE` tracks Phase Goal/stage/tasks/DoD/progress; runtime owns actual state; explicit goal hierarchy added.
- **Prevention:** resolve project SoT before project work and keep all four goal levels explicit in reasoning/reporting.
- **Verification:** current `gpts-system-prompt.md` contains the hierarchy and Phase Goal contract.

## ERR-2026-08-29-002 — Hard prompt-size budget was temporarily exceeded

- **Status:** RESOLVED
- **Symptom:** while adding Phase Goal/replan rules, an intermediate committed prompt reached 8069 bytes despite the hard `<=8000` constraint.
- **Evidence:** repository readback after commit `4b5987039dc06337479f7432dad13a43a95cb11f` reported 8069 bytes.
- **Cause (high confidence):** sequential additions were applied before budgeting the net byte delta.
- **Impact:** violated an explicit acceptance constraint and forced follow-up compression.
- **Fix:** compressed redundant core/debug wording while preserving guardrails; final readback is within budget.
- **Prevention:** estimate replacement byte delta before apply; read back size after every prompt mutation; never report DONE until the hard budget passes.
- **Verification:** current prompt SHA `a2e42d740aa96918a18c7d71d55f504f96be2932`, size 7967 bytes.

## ERR-2026-08-29-003 — ETA policy allowed refusal instead of estimation

- **Status:** RESOLVED
- **Symptom:** snapshots repeatedly returned `ETA unknown`, making the field managerially useless.
- **Evidence:** prior policy explicitly allowed `say unknown` when evidence was weak; user observed repeated refusal to estimate.
- **Cause (high confidence):** safety against false precision became an escape hatch from rough estimation.
- **Impact:** project snapshots lacked actionable planning information.
- **Fix:** ETA is now mandatory via decomposition + velocity/analogues + uncertainty range; wide ranges are preferred to `unknown`, and unbounded work still estimates the discovery/recovery step.
- **Prevention:** distinguish rough evidence-based ranges from fabricated precision; report confidence explicitly.
- **Verification:** current `<style>` requires ETA for next move, phase, and Project North Star.

## ERR-2026-08-29-004 — Code materialization was allowed before exact-source test evidence

- **Status:** RESOLVED
- **Symptom:** a code/deploy flow attempted materialization before proving canonical tests on the exact source; runtime health risked being treated as functional evidence.
- **Evidence:** reported Deep Research incident: routing code existed, but the full pytest suite had not been run and the test runner itself was not prepared.
- **Cause (medium-high confidence):** system prompt lacked an explicit pre-deploy exact-source validation gate.
- **Impact:** deploy effort could proceed on unverified source and obscure whether failures came from code, test environment, or deployment.
- **Fix:** canonical tests must run on exact source before deploy when present; missing runner is a validation blocker, then deployed revision must match tested source, followed by logs/traces + smoke/E2E.
- **Prevention:** use `exact source → canonical tests → exact tested deploy → runtime evidence → E2E` as the default code-change chain.
- **Verification:** rule is present in current `<execution>`.

## ERR-2026-08-29-005 — Evidence citation typo in rollout plan

- **Status:** OPEN / WRITEBACK_BLOCKED
- **Symptom:** issue #24 initially attributed the 2012 incident-learning-cycle paper to the wrong authors.
- **Evidence:** canonical paper is Jacobsson, Ek & Akselsson (2012), DOI `10.1016/j.jlp.2011.12.013`; issue body says `Lukic et al. 2012`.
- **Cause (high confidence):** citation was written from memory before author-level verification.
- **Impact:** weakens evidence traceability in an evidence-based plan.
- **Fix:** correct issue #24 attribution to Jacobsson, Ek & Akselsson (2012).
- **Prevention:** verify author/title/DOI from a primary/academic source before durable citation write-back.
- **Verification:** correction attempts via issue comment and GraphQL update returned GitHub `403 Resource not accessible by personal access token`; local ledger now preserves the correction until issue write access is available.
