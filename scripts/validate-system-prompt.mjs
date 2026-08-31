import fs from 'node:fs';

const path = new URL('../gpts-system-prompt.md', import.meta.url);
const text = fs.readFileSync(path, 'utf8');
const bytes = Buffer.byteLength(text, 'utf8');

const failures = [];
const requirePattern = (name, pattern) => {
  if (!pattern.test(text)) failures.push(`${name}: missing`);
};

if (bytes > 8000) failures.push(`hard byte budget: ${bytes} > 8000`);
if (bytes < 1) failures.push('prompt is empty');

requirePattern('typed authority', /<authority>[\s\S]*Claim authority:/);
requirePattern('Project SoT owns design', /Project SoT[^\n]*North Star/);
requirePattern('pipeline execution-only role', /PROJECT_PIPELINE only Phase Goal\/stage\/tasks\/DoD\/progress\/next move/);
requirePattern('CURRENT owns actual state', /actual→CURRENT runtime\/readback/);
requirePattern('publication is not callability', /publication→gpts-actions≠callability/);
requirePattern('BMAD callability gate', /BMAD-MNNZ defines bmad-help[^\n]*CURRENT callable\+fit/);
requirePattern('aux-runtime approval', /Aux runtime[^\n]*NEW scope[^\n]*explicit approval/);
requirePattern('post-state before retry', /Error\/timeout\/ambiguous result: inspect post-state/);
requirePattern('identical retry budget', /Retry identical failed mutation at most once/);
requirePattern('tested equals deployed identity', /deployed identity=tested identity/);
requirePattern('tool ack is not completion', /Tool acknowledgement≠completion/);
requirePattern('Feynman reporting', /Feynman-first:/);
requirePattern('verified deep links', /verified deep links/);
requirePattern('no invented URLs', /never invent URLs/);
requirePattern('AGENTS before runtime DEV mutation', /Before runtime DEV mutation read nearest AGENTS\.md/);
requirePattern('SourceLoop bootstrap gate', /verify SourceLoop\/FVE bootstrap \+ live-patch lane/);
requirePattern('container-first fast loop', /Runtime defect→container-first fast loop/);
requirePattern('runtime proof before Git canonicalization', /canonicalize to Git via SourceLoop\/owner/);
requirePattern('redeploy is not debug', /redeploy≠debug primitive/);
requirePattern('SourceLoop docs are not bootstrap proof', /SourceLoop docs≠target bootstrap/);
requirePattern('source-bound exact workspace', /Source-bound\/multi-file→exact-source repo workspace/);

if (/<priority>/.test(text)) failures.push('legacy global <priority> block present');

if (failures.length) {
  console.error('SYSTEM_PROMPT_ANTI_DRIFT_FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(`- observed bytes: ${bytes}`);
  process.exit(1);
}

console.log(`SYSTEM_PROMPT_ANTI_DRIFT_PASS bytes=${bytes}`);
