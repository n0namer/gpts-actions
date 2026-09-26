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
requirePattern('Feynman reporting', /Feynman-first: assume zero context/);
requirePattern('result-first reporting', /Lead with result, not trace/);
requirePattern('zero-context final block', /LAST=`Простыми словами:`[^\n]*tested\/done, result\/numbers, meaning, ONE next, user need/);
requirePattern('plain-language jargon guard', /no unexplained G0\/phase\/gate\/SoT\/DoD\/tool labels/);
requirePattern('report one-shot', /One-shot:[^\n]*Простыми словами:[^\n]*36 сообщений/);
requirePattern('verified deep links', /verified deep links/);
requirePattern('no invented URLs', /never invent URLs/);
requirePattern('no invented context/facts', /Never invent context[^\n]*facts/);
requirePattern('root error ledger before mutation', /read root ERRORS\.md before mutation/);
requirePattern('stage-aware ALN', /relevant stage \+ 1–3 useful ALN methods\/EBC/);
requirePattern('debug evidence first', /Debug evidence-first/);
requirePattern('bounded debug funnel', /bounded funnel before broad logs/);
requirePattern('no mutate-only diagnosis', /Never mutate only to diagnose/);
requirePattern('target observability first', /improve target observability, not helper runtime/);
requirePattern('AGENTS before runtime DEV mutation', /Before runtime DEV mutation read nearest AGENTS\.md/);
requirePattern('SourceLoop bootstrap gate', /verify SourceLoop\/FVE bootstrap\+live-patch lane/);
requirePattern('container-first fast loop', /Runtime defect→container-first/);
requirePattern('runtime proof before Git canonicalization', /canonicalize Git via SourceLoop\/owner/);
requirePattern('redeploy is not debug', /redeploy≠debug primitive/);
requirePattern('SourceLoop docs are not bootstrap proof', /SourceLoop docs≠target bootstrap/);
requirePattern('source-bound exact workspace', /Source-bound\/multi-file→exact-source repo workspace/);

requirePattern('CrewSync coordination not SoT', /CrewSync=coordination plane[^\n]*not Project\/Git SoT/);
requirePattern('Crew CURRENT callability gate', /CURRENT schema alone proves callability/);
requirePattern('Crew via VPS Terminal target', /No separate Crew Action:[^\n]*VPS Terminal `ai-crew-sync`[^\n]*runtime=`crew-sync`/);
requirePattern('Crew CLI stable session argv', /\['ai-crew-sync','client','--session',SESSION,\.\.\.\]/);
requirePattern('Crew CLI discovery before gap', /before CAPABILITY_GAP[^\n]*tools --json/);
requirePattern('Crew heartbeat statuses', /`beat`:active\|idle\|busy\|blocked/);
requirePattern('Crew CLI helpers', /CLI digest\/wait\/ask if exposed/);
requirePattern('stable Crew session', /one stable Crew session\/work session/);
requirePattern('exact JIT project claim', /Exact project-prefixed JIT claim/);
requirePattern('single claimed work task', /one claimed task/);
requirePattern('Crew lease renewal', /Lease=900s; renew before long work; lost lease→stop writes/);
requirePattern('claims differ from locks', /Claims != locks/);
requirePattern('empty locks are not conflict proof', /`locks=\[\]` does not prove no conflict/);
requirePattern('shared active writer conflict', /live claimed write-task on same repo\/resource conflicts/);
requirePattern('coordinator authority evidence', /Coordinator authority requires explicit user assignment, Project SoT, resource owner or other authority/);
requirePattern('controlled handoff', /Controlled handoff: freeze writer/);
requirePattern('fresh reread after handoff', /fresh-rereads HEAD\/files\/SourceLoop\/runtime\/tasks\/locks/);
requirePattern('single writer integration lock', /takes narrow integration lock/);
requirePattern('no global claim next task', /never global `claim_next_task` on multi-project bus/);
requirePattern('Crew complete is not Project DONE', /Crew complete != Project DONE/);

if (/<priority>/.test(text)) failures.push('legacy global <priority> block present');

if (failures.length) {
  console.error('SYSTEM_PROMPT_ANTI_DRIFT_FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(`- observed bytes: ${bytes}`);
  process.exit(1);
}

console.log(`SYSTEM_PROMPT_ANTI_DRIFT_PASS bytes=${bytes}`);
