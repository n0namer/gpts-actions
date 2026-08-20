# Legacy GPT Actions

This directory preserves retired publication-safe Action contracts and routing history for audit, migration and rollback analysis.

## Status rule

Everything under `legacy/` is **non-current by default**. A file here does not prove that an Action is connected or callable in any GPT runtime.

Use these lifecycle labels in future archive notes:

- `LEGACY` — historical, retained for reference;
- `DEPRECATED` — still may exist somewhere, but should not be selected for new work unless current runtime capability evidence makes it the best valid path;
- `SUPERSEDED` — replaced by a newer capability/contract;
- `RETIRED` — no longer part of the supported publication surface.

## Archive procedure

When retiring an Action:

1. capture the last known publication-safe OpenAPI contract if the original bytes are available;
2. record former purpose, last known version/date, reason for retirement and replacement/migration path;
3. remove it from README `Current Action contracts`;
4. keep secrets, private infrastructure identifiers and runtime snapshots out of the archive;
5. do not reconstruct or invent an old schema from memory if the original contract cannot be recovered.

## Runtime rule

Current GPT routing must always start from the runtime callable Actions/tools surface. Legacy files are historical evidence only. If an old operation name is absent from current runtime schemas, do not call or simulate it; rediscover current capabilities and select the best available path.
