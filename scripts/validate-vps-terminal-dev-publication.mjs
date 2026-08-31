import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const SPEC_PATH = path.resolve(process.cwd(), "actions/vps-terminal-dev.openapi.json");

const REQUIRED_PUBLIC_OPERATION_IDS = [
  "health",
  "ready",
  "version",
  "readTargetFile",
  "previewTargetPatch",
  "applyTargetPatch",
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
  mutation_self_tests: 5
}, null, 2));
