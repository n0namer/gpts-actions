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

- **Status:** RESOLVED / RECURRENCE OBSERVED
- **Symptom:** prompt edits twice committed intermediate revisions above the hard `<=8000` repository-size constraint.
- **Evidence:** earlier commit `4b5987039dc06337479f7432dad13a43a95cb11f` read back as 8069 bytes; vNext refactor later read back as 8029 then 8005 bytes before final compression.
- **Cause (high confidence):** local/pre-apply byte estimates are not authoritative for repository readback and sequential additions can cross the hard budget.
- **Impact:** explicit acceptance constraint was temporarily violated and follow-up commits were required.
- **Fix:** compress only redundant wording; always use repository readback as the acceptance gate.
- **Prevention:** treat local byte counts as advisory only; after every prompt mutation read back repository `size`; never report DONE until `size <= 8000`.
- **Verification:** current prompt SHA `00f5ccb638a50ab42df98b6b68737db4bb4612de`, repository size 7986 bytes; latest deep-link reporting patch also briefly exceeded budget at 8068 before compression.

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

- **Status:** RESOLVED
- **Symptom:** issue #24 initially attributed the 2012 incident-learning-cycle paper to the wrong authors.
- **Evidence:** canonical paper is Jacobsson, Ek & Akselsson (2012), DOI `10.1016/j.jlp.2011.12.013`; issue #24 says `Lukic et al. 2012`.
- **Cause (high confidence):** citation was written from memory before author-level verification.
- **Impact:** weakened evidence traceability in an evidence-based plan.
- **Fix:** issue #25 is the corrected canonical rollout plan and explicitly supersedes #24.
- **Prevention:** verify author/title/DOI from a primary/academic source before durable citation write-back.
- **Verification:** issue #25 contains the corrected attribution; direct edit/comment attempts on #24 were blocked by GitHub `403`, so #24 remains historical evidence only.

## ERR-2026-08-29-006 — Knowledge authority model lagged behind System Prompt

- **Status:** PARTIAL / WRITEBACK_BLOCKED
- **Symptom:** canonical uploaded `Capability Cards` still described `PROJECT_PIPELINE` as the "primary project operating system" and `Operator Protocol` still selected default project from `PROJECT_PIPELINE/active_project_id`, conflicting with the accepted model where Project SoT owns North Star/design and PROJECT_PIPELINE owns execution metadata only.
- **Evidence:** direct reads of `PRJ-002 OpenClaw GPT Capability Cards.docx` and `PRJ-002 GPT — Operator Protocol.docx`; GitHub code search found no writable source copy for the conflicting text.
- **Cause (high confidence):** System Prompt evolved faster than the canonical Knowledge package; multi-owner semantic migration was not completed atomically.
- **Impact:** runtime Knowledge could reintroduce project-authority drift even when the System Prompt is correct.
- **Fix:** System Prompt now uses claim-typed authority and explicitly separates Project SoT / PROJECT_PIPELINE / CURRENT runtime / CURRENT callability. Exact OP/CC replacements have been identified.
- **Prevention:** any accepted policy change must identify all canonical owners before closure; run cross-owner semantic search after System Prompt changes.
- **Verification:** `gpts-system-prompt.md` SHA `68ede86b9837991fb0da23583bc9b59433cdf9dc`, size 7997 bytes. OP/CC publication remains blocked because the uploaded DOCX sources are read-only here and no GPT-Knowledge write connector is exposed.

## ERR-2026-08-29-007 — Edited local copies instead of canonical Google Drive owners

- **Status:** OPEN / CAPABILITY_GAP / WRITEBACK_BLOCKED
- **Symptom:** while resolving ERR-006, replacement DOCX files were produced in local sandbox storage even though the canonical Knowledge owners are Google Drive/Google Docs documents.
- **Evidence:** user correction; current callable surface exposes GitHub/file tools but no Google Drive/Docs search+write Action for this session.
- **Cause (high confidence):** write-back routing stopped at an accessible copy instead of verifying the canonical owner was writable before mutation.
- **Impact:** local replacements do not update canonical Knowledge and must not be reported as completed migration.
- **Fix:** update the existing canonical Google Drive documents in place once a CURRENT Google Drive/Docs write capability is exposed; do not create duplicate canonical files.
- **Prevention:** before any durable document mutation, resolve canonical owner + CURRENT writable route first; if owner is known but not writable, classify CAPABILITY_GAP/WRITEBACK_BLOCKED before generating replacement artifacts.
- **Verification:** blocker remains until the canonical Google Drive docs are reread after in-place write.

## ERR-2026-08-29-008 — Reporting preference was acknowledged but not applied

- **Status:** RESOLVED
- **Symptom:** user gave a concrete durable reporting rule for direct project-resource links, but I only acknowledged it and stopped instead of updating the governing prompt.
- **Evidence:** user immediately challenged the stop; no prompt mutation had occurred before that correction.
- **Cause (high confidence):** treated a durable behavioral contract as conversational style rather than implementation work.
- **Impact:** future project explanations could regress to vague navigation instead of actionable deep links.
- **Fix:** added prompt rule: project help gives verified deep links to named resources, prefers `from/to/do`, and never invents URLs.
- **Prevention:** when the user defines a reusable operating/reporting rule and mutation is authorized, update the canonical behavioral owner before merely acknowledging it.
- **Verification:** `gpts-system-prompt.md` SHA `00f5ccb638a50ab42df98b6b68737db4bb4612de`, repository size 7986 bytes.

## ERR-2026-08-30-009 — GitHub Actions jobs fail before runner assignment

- **Status:** OPEN / HOSTED_CI_BLOCKER
- **Symptom:** new `System Prompt Anti-Drift` hosted workflow failed twice before executing any step.
- **Evidence:** runs `33320654932` and `33320815477`; both jobs report `runner_id=0`, empty `runner_name`, and `steps=[]`. The second run was the single explicit retry.
- **Cause (medium confidence):** hosted GitHub Actions runner assignment/service failure; validator logic was never executed, so application/test failure is not established.
- **Impact:** repository CI cannot currently prove the prompt anti-drift validator PASS/FAIL.
- **Fix:** preserve the validator/workflow; do not retry-loop. Re-run when runner service is available or validate exact source through an existing approved validation environment.
- **Prevention:** distinguish pre-runner CI infrastructure failure from test failure using job step/runner evidence; identical retry budget remains one.
- **Verification:** exact-source validator later executed in Coding Station and PASSed with `SYSTEM_PROMPT_ANTI_DRIFT_PASS bytes=7979`; hosted GitHub Actions runner assignment remains open separately.