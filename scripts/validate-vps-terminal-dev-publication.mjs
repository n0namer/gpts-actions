import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const SPEC_PATH = path.resolve(process.cwd(), "actions/vps-terminal-dev.openapi.json");

const REQUIRED_PUBLIC_OPERATION_IDS = [
  "health",
  "ready",
  "version",
  "targetRegistryAction",
  "sourceLoopAction",
  "fileAction",
  "runTargetCheck",
  "reloadTarget",
  "getOperatorGuidance",
  "listContainers",
  "inspectContainer",
  "containerLogs",
  "execContainer",
  "octocodeResearch",
  "exec",
  "startSession",
  "getSession",
  "readSession",
  "writeSession",
  "terminateSession",
  "listLessons",
  "getLesson",
  "recommendLessons",
  "getSelfProtection",
  "prepareDebugClone",
  "executeApprovedDebugClone",
  "prepareChange",
  "approvalStatus",
  "targetLogs",
  "targetStats"
];

const FORBIDDEN_PUBLIC_PATHS = [
  "/v1/approval/approve",
  "/v1/approval/debug-clone/approve",
  "/v1/approval/execute",
  "/v1/internal/self-protection/approvals/issue",
  "/v1/validators",
  "/v1/validators/run",
  "/v1/scenarios"
];

const METHODS = new Set(["get", "post", "put", "patch", "delete", "options", "head"]);

function operationInventory(schema) {
  const operations = [];
  for (const [route, routeItem] of Object.entries(schema?.paths || {})) {
    for (const [method, operation] of Object.entries(routeItem || {})) {
      if (!METHODS.has(method.toLowerCase()) || !operation || typeof operation !== "object") continue;
      operations.push({ route, method: method.toUpperCase(), operationId: String(operation.operationId || "") });
    }
  }
  return operations;
}

export function validateSchema(schema) {
  const errors = [];
  if (schema?.openapi !== "3.1.0") errors.push(`unexpected OpenAPI version: ${schema?.openapi ?? "missing"}`);

  const operations = operationInventory(schema);
  const ids = operations.map((x) => x.operationId).filter(Boolean);
  const idCounts = new Map();
  for (const id of ids) idCounts.set(id, (idCounts.get(id) || 0) + 1);

  for (const op of operations) {
    if (!op.operationId) errors.push(`missing operationId: ${op.method} ${op.route}`);
  }
  for (const [id, count] of idCounts) {
    if (count !== 1) errors.push(`duplicate operationId: ${id} (${count})`);
  }
  for (const id of REQUIRED_PUBLIC_OPERATION_IDS) {
    if (!idCounts.has(id)) errors.push(`required public operation missing: ${id}`);
  }
  const requiredIds = new Set(REQUIRED_PUBLIC_OPERATION_IDS);
  for (const id of ids) {
    if (!requiredIds.has(id)) errors.push(`unexpected public operation: ${id}`);
  }
  if (operations.length !== REQUIRED_PUBLIC_OPERATION_IDS.length) {
    errors.push(`unexpected public operation count: ${operations.length} (expected ${REQUIRED_PUBLIC_OPERATION_IDS.length})`);
  }
  if (operations.length > 30) errors.push(`public operation budget exceeded: ${operations.length} > 30`);

  const fileActionRef = schema?.paths?.["/v1/target/file/action"]?.post?.requestBody?.content?.["application/json"]?.schema?.$ref;
  if (fileActionRef !== "#/components/schemas/FileActionRequest") {
    errors.push("fileAction must use FileActionRequest");
  }
  const fileAction = schema?.components?.schemas?.FileActionRequest;
  const expectedFileOps = ["read", "create", "preview_patch", "apply_patch", "delete"];
  if (!fileAction || fileAction?.additionalProperties !== false) {
    errors.push("FileActionRequest must exist and fail closed on unknown fields");
  }
  const actualFileOps = fileAction?.properties?.operation?.enum;
  if (JSON.stringify(actualFileOps) !== JSON.stringify(expectedFileOps)) {
    errors.push(`FileActionRequest operation enum changed: ${JSON.stringify(actualFileOps)}`);
  }
  const requiredFileFields = new Set(fileAction?.required || []);
  for (const field of ["operation", "target_id", "path"]) {
    if (!requiredFileFields.has(field)) errors.push(`FileActionRequest required field missing: ${field}`);
  }
  if (Object.prototype.hasOwnProperty.call(fileAction?.properties || {}, "args")) {
    errors.push("FileActionRequest must not expose generic args");
  }

  const targetRegistryRef = schema?.paths?.["/v1/target-registry/action"]?.post?.requestBody?.content?.["application/json"]?.schema?.$ref;
  if (targetRegistryRef !== "#/components/schemas/TargetRegistryActionRequest") {
    errors.push("targetRegistryAction must use TargetRegistryActionRequest");
  }
  const targetRegistryAction = schema?.components?.schemas?.TargetRegistryActionRequest;
  const expectedRegistryOps = ["read", "upsert"];
  if (!targetRegistryAction || targetRegistryAction?.additionalProperties !== false) {
    errors.push("TargetRegistryActionRequest must exist and fail closed on unknown fields");
  }
  if (JSON.stringify(targetRegistryAction?.properties?.operation?.enum) !== JSON.stringify(expectedRegistryOps)) {
    errors.push(`TargetRegistryActionRequest operation enum changed: ${JSON.stringify(targetRegistryAction?.properties?.operation?.enum)}`);
  }
  if (!new Set(targetRegistryAction?.required || []).has("operation")) errors.push("TargetRegistryActionRequest operation must be required");
  if (Object.prototype.hasOwnProperty.call(targetRegistryAction?.properties || {}, "args")) errors.push("TargetRegistryActionRequest must not expose generic args");
  const targetEntry = schema?.components?.schemas?.TargetRegistryEntry;
  if (!targetEntry || targetEntry?.additionalProperties !== false) errors.push("TargetRegistryEntry must fail closed on unknown fields");
  const resolverEnum = schema?.components?.schemas?.TargetRegistryWriteback?.properties?.base_resolver?.properties?.type?.enum;
  if (JSON.stringify(resolverEnum) !== JSON.stringify(["container_image_tag_sha", "configured_sha"])) {
    errors.push(`TargetRegistry writeback resolver enum changed: ${JSON.stringify(resolverEnum)}`);
  }

  const sourceLoopRef = schema?.paths?.["/v1/source-loop/action"]?.post?.requestBody?.content?.["application/json"]?.schema?.$ref;
  if (sourceLoopRef !== "#/components/schemas/SourceLoopActionRequest") errors.push("sourceLoopAction must use SourceLoopActionRequest");
  const sourceLoop = schema?.components?.schemas?.SourceLoopActionRequest;
  const expectedSourceLoopRefs = ["SourceLoopListRequest","SourceLoopArtifactRequest","SourceLoopCandidateRequest","SourceLoopAcceptRequest","SourceLoopRejectRequest"].map(x=>`#/components/schemas/${x}`);
  if (JSON.stringify((sourceLoop?.oneOf||[]).map(x=>x?.$ref)) !== JSON.stringify(expectedSourceLoopRefs)) errors.push("SourceLoopActionRequest oneOf branches changed");
  for (const name of expectedSourceLoopRefs.map(x=>x.split("/").pop())) {
    if (schema?.components?.schemas?.[name]?.additionalProperties !== false) errors.push(`${name} must fail closed on unknown fields`);
  }

  const publishedPaths = new Set(Object.keys(schema?.paths || {}));
  for (const forbidden of FORBIDDEN_PUBLIC_PATHS) {
    for (const published of publishedPaths) {
      if (published === forbidden || published.startsWith(`${forbidden}/`)) {
        errors.push(`privileged path must not be public: ${published}`);
      }
    }
  }

  const sessionStartRef = schema?.paths?.["/v1/sessions"]?.post?.requestBody?.content?.["application/json"]?.schema?.$ref;
  if (sessionStartRef !== "#/components/schemas/SessionStartRequest") {
    errors.push("startSession must use SessionStartRequest");
  }
  const sessionStart = schema?.components?.schemas?.SessionStartRequest;
  if (!sessionStart || sessionStart?.additionalProperties !== false) {
    errors.push("SessionStartRequest must exist and fail closed on unknown fields");
  }
  if (Object.prototype.hasOwnProperty.call(sessionStart?.properties || {}, "timeout_ms")) {
    errors.push("SessionStartRequest must not expose unsupported timeout_ms");
  }

  const bearer = schema?.components?.securitySchemes?.Bearer;
  if (bearer?.type !== "http" || bearer?.scheme !== "bearer") {
    errors.push("single-bearer public security scheme is missing or changed");
  }

  return { ok: errors.length === 0, errors, operation_count: operations.length };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function selfTest(schema) {
  const failures = [];

  const baseline = validateSchema(schema);
  if (!baseline.ok) failures.push(`baseline invalid: ${baseline.errors.join("; ")}`);

  const leaked = clone(schema);
  leaked.paths["/v1/approval/approve"] = { post: { operationId: "approveChange" } };
  if (validateSchema(leaked).ok) failures.push("forbidden privileged-path mutation was not detected");

  const missing = clone(schema);
  delete missing.paths["/v1/approval/status"];
  if (validateSchema(missing).ok) failures.push("missing required-public-operation mutation was not detected");

  const missingTargetStats = clone(schema);
  delete missingTargetStats.paths["/v1/target/stats"];
  if (validateSchema(missingTargetStats).ok) failures.push("missing required targetStats operation mutation was not detected");

  const duplicate = clone(schema);
  duplicate.paths["/synthetic-duplicate"] = { get: { operationId: "health" } };
  if (validateSchema(duplicate).ok) failures.push("duplicate operationId mutation was not detected");

  const unsupportedSessionTimeout = clone(schema);
  unsupportedSessionTimeout.components.schemas.SessionStartRequest.properties.timeout_ms = { type: "integer" };
  if (validateSchema(unsupportedSessionTimeout).ok) failures.push("unsupported startSession timeout_ms mutation was not detected");

  const widenedFileEnum = clone(schema);
  widenedFileEnum.components.schemas.FileActionRequest.properties.operation.enum.push("shell");
  if (validateSchema(widenedFileEnum).ok) failures.push("widened fileAction operation enum was not detected");

  const genericFileArgs = clone(schema);
  genericFileArgs.components.schemas.FileActionRequest.properties.args = { type: "object" };
  if (validateSchema(genericFileArgs).ok) failures.push("generic fileAction args escape was not detected");

  const widenedRegistryEnum = clone(schema);
  widenedRegistryEnum.components.schemas.TargetRegistryActionRequest.properties.operation.enum.push("delete");
  if (validateSchema(widenedRegistryEnum).ok) failures.push("widened targetRegistryAction operation enum was not detected");

  const genericRegistryArgs = clone(schema);
  genericRegistryArgs.components.schemas.TargetRegistryActionRequest.properties.args = { type: "object" };
  if (validateSchema(genericRegistryArgs).ok) failures.push("generic targetRegistryAction args escape was not detected");

  const missingSourceLoop = clone(schema);
  delete missingSourceLoop.paths["/v1/source-loop/action"];
  if (validateSchema(missingSourceLoop).ok) failures.push("missing sourceLoopAction was not detected");

  const genericSourceLoopBranch = clone(schema);
  genericSourceLoopBranch.components.schemas.SourceLoopCandidateRequest.additionalProperties = true;
  if (validateSchema(genericSourceLoopBranch).ok) failures.push("generic sourceLoopAction candidate branch was not detected");

  return failures;
}

const schema = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
const result = validateSchema(schema);
const selfTestFailures = selfTest(schema);

if (!result.ok || selfTestFailures.length) {
  console.error(JSON.stringify({
    status: "FAIL",
    spec: path.relative(process.cwd(), SPEC_PATH),
    operation_count: result.operation_count,
    errors: result.errors,
    self_test_failures: selfTestFailures
  }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "PASS",
  spec: path.relative(process.cwd(), SPEC_PATH),
  operation_count: result.operation_count,
  required_public_operations: REQUIRED_PUBLIC_OPERATION_IDS.length,
  forbidden_public_path_roots: FORBIDDEN_PUBLIC_PATHS.length,
  mutation_self_tests: 11
}, null, 2));
