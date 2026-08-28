import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const SPEC_PATH=path.resolve(process.cwd(),"actions/vps-terminal-dev-approval.openapi.json");
const EXACT_PATH="/v1/approval/debug-clone/approve";
const EXACT_OPERATION_ID="approveDebugClone";

function validate(schema){
  const errors=[];
  if(schema?.openapi!=="3.1.0")errors.push(`unexpected OpenAPI version: ${schema?.openapi??"missing"}`);
  const paths=Object.keys(schema?.paths||{});
  if(paths.length!==1||paths[0]!==EXACT_PATH)errors.push(`approval schema must publish exactly ${EXACT_PATH}`);
  const post=schema?.paths?.[EXACT_PATH]?.post;
  if(!post)errors.push("typed debug-clone approval POST is missing");
  if(String(post?.operationId||"")!==EXACT_OPERATION_ID)errors.push(`operationId must be ${EXACT_OPERATION_ID}`);
  const bearer=schema?.components?.securitySchemes?.Bearer;
  if(bearer?.type!=="http"||bearer?.scheme!=="bearer")errors.push("approval bearer security scheme is missing or changed");
  if(Array.isArray(post?.security)&&post.security.length===0)errors.push("approval operation must not disable bearer security");
  return{ok:errors.length===0,errors,operation_count:post?1:0};
}

const clone=v=>JSON.parse(JSON.stringify(v));
function selfTest(schema){
  const failures=[];
  const base=validate(schema);if(!base.ok)failures.push(`baseline invalid: ${base.errors.join("; ")}`);
  const leakedExecute=clone(schema);leakedExecute.paths["/v1/approval/debug-clone/execute"]={post:{operationId:"executeApprovedDebugClone"}};if(validate(leakedExecute).ok)failures.push("execute capability leak was not detected");
  const leakedGeneric=clone(schema);leakedGeneric.paths["/v1/approval/approve"]={post:{operationId:"approveChange"}};if(validate(leakedGeneric).ok)failures.push("generic approval leak was not detected");
  const missing=clone(schema);delete missing.paths[EXACT_PATH];if(validate(missing).ok)failures.push("missing typed approval operation was not detected");
  return failures;
}

const schema=JSON.parse(fs.readFileSync(SPEC_PATH,"utf8"));
const result=validate(schema),self_test_failures=selfTest(schema);
if(!result.ok||self_test_failures.length){console.error(JSON.stringify({status:"FAIL",spec:path.relative(process.cwd(),SPEC_PATH),errors:result.errors,self_test_failures},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",spec:path.relative(process.cwd(),SPEC_PATH),operation_count:1,exact_operation_id:EXACT_OPERATION_ID,mutation_self_tests:3},null,2));
