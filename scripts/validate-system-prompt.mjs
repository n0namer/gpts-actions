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
requirePattern('CURRENT owns actual state', /CURRENT runtime actual state/);
requirePattern('publication is not callability', /publication→gpts-actions≠callability/);
requirePattern('BMAD callability gate', /BMAD-MNNZ defines bmad-help; use only if CURRENT callable\+fit/);
requirePattern('aux-runtime approval', /Aux runtime[^\n]*explicit approval required/);
requirePattern('post-state before retry', /Error\/timeout\/ambiguous result: inspect post-state/);
requirePattern('identical retry budget', /Retry identical failed mutation at most once/);
requirePattern('tested equals deployed identity', /deployed identity=tested identity/);
requirePattern('tool ack is not completion', /Tool acknowledgement≠completion/);
requirePattern('Feynman reporting', /Feynman-first:/);
requirePattern('verified deep links', /verified deep links/);
requirePattern('no invented URLs', /never invent URLs/);

if (/<priority>/.test(text)) failures.push('legacy global <priority> block present');

if (failures.length) {
  console.error('SYSTEM_PROMPT_ANTI_DRIFT_FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(`- observed bytes: ${bytes}`);
  process.exit(1);
}

console.log(`SYSTEM_PROMPT_ANTI_DRIFT_PASS bytes=${bytes}`);
