import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const schema=JSON.parse(fs.readFileSync(new URL("../actions/vps-terminal-validator-dev.openapi.json",import.meta.url),"utf8"));
const operations=Object.values(schema.paths).flatMap(p=>Object.values(p)).map(op=>op.operationId).sort();
const run=schema.paths["/v1/validators/run"].post.requestBody.content["application/json"].schema;

test("Validator DEV Action exposes only list run and get",()=>{
  assert.deepEqual(operations,["getValidation","listValidators","runValidator"]);
  assert.equal(schema.servers.length,1);
  assert.match(schema.servers[0].url,/^https:\/\/vps-terminal-dev\./);
  assert.ok(!schema.servers[0].url.includes("vps-terminal.srv1904412.hstgr.cloud"));
});

test("runValidator has no arbitrary execution or mutation selectors",()=>{
  assert.equal(run.additionalProperties,false);
  assert.deepEqual(run.required,["validator_id","candidate_digest"]);
  const allowed=Object.keys(run.properties).sort();
  assert.deepEqual(allowed,["candidate_digest","input","input_ref","validator_id"]);
  for(const k of ["cmd","command","shell","target","target_id","container","container_id","resource","operation","force","approve","approved","skip_confirmation","deploy","restart","delete"]){
    assert.equal(Object.hasOwn(run.properties,k),false,`forbidden field leaked: ${k}`);
  }
});

test("Validator DEV Action contains no approval mutation or terminal execution paths",()=>{
  const paths=Object.keys(schema.paths).join("\n");
  for(const forbidden of ["/approval","/mutations","/exec","/sessions","/containers","/target/file","/reload","/lifecycle"]){
    assert.equal(paths.includes(forbidden),false,`forbidden path leaked: ${forbidden}`);
  }
  assert.deepEqual(schema.security,[{Bearer:[]}]);
  assert.equal(schema.components.securitySchemes.Bearer.scheme,"bearer");
});
