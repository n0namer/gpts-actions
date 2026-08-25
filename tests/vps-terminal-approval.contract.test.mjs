import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const spec=JSON.parse(fs.readFileSync(new URL("../actions/vps-terminal-approval.openapi.json",import.meta.url),"utf8"));

test("approval Action exposes only approveChange and no prepare or execute authority",()=>{
  assert.equal(spec.openapi,"3.1.0");
  assert.deepEqual(Object.keys(spec.paths),["/v1/approval/approve"]);
  const op=spec.paths["/v1/approval/approve"]?.post;
  assert.equal(op?.operationId,"approveChange");
  assert.deepEqual(op?.security,[{approvalBearer:[]}]);
  assert.ok(!JSON.stringify(spec.paths).includes("prepareChange"));
  assert.ok(!JSON.stringify(spec.paths).includes("executeApprovedChange"));
});

test("approval Action request cannot carry operation resource args or execution scope",()=>{
  const schema=spec.paths["/v1/approval/approve"].post.requestBody.content["application/json"].schema;
  assert.equal(schema.additionalProperties,false);
  assert.deepEqual(new Set(schema.required),new Set(["request_id","approved","approved_by"]));
  assert.deepEqual(Object.keys(schema.properties).sort(),["approved","approved_by","request_id"]);
  for(const forbidden of ["operation","resource","args","items","command","force","skip_confirmation"]){
    assert.equal(schema.properties[forbidden],undefined);
  }
});

test("approval Action uses a dedicated bearer security scheme",()=>{
  assert.deepEqual(spec.components.securitySchemes.approvalBearer,{type:"http",scheme:"bearer"});
  assert.match(spec.info.description,/cannot prepare or execute/i);
});
