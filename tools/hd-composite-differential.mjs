// hd-composite-differential.mjs — JS↔Python 合盤分類對拍（僅本機手動工具，npm test 不依賴）。
// 同輸入跑本站 computeComposite vs 報告端 swanky-human-design/gen/bodygraph.py compose()，
// 比對四類分類集合、owner、合盤定義中心。兩者為同一 truth table 的獨立實作——
// 對拍是密度防線，外部站 golden（composite-golden-cases.json）才是正確性錨點。
// 用法：node tools/hd-composite-differential.mjs [--pairs N]（預設全 378 對）
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import '../tests/_setup-astronomy.mjs';
import { computeChart } from '../assets/js/human-design/hd-engine.js';
import { toHumanDesignChart } from '../assets/js/human-design/hd-adapter.js';
import { computeComposite, CENTER_IDS } from '../assets/js/human-design/hd-composite.js';

const REPORT_GEN = 'C:/Users/swank/Desktop/swanky-human-design/gen';
if (!existsSync(REPORT_GEN + '/bodygraph.py')) {
  console.log('SKIP: 找不到姊妹 repo ' + REPORT_GEN + '/bodygraph.py（本工具僅在本機雙 repo 環境可用）');
  process.exit(0);
}

const golden = JSON.parse(readFileSync(new URL('../tests/human-design/golden/golden-cases.json', import.meta.url), 'utf8'));
const people = [];
for (const c of golden.cases) {
  if (!c.input.time) continue;
  const [y, m, d] = c.input.date.split('-').map(Number);
  const [hh, mm] = c.input.time.split(':').map(Number);
  const hd = toHumanDesignChart(computeChart({ year: y, month: m, day: d, hour: hh, minute: mm, tz: c.input.tz }));
  const gates = Object.values(hd.gates).filter(g => g.activated).map(g => g.gate);
  people.push({ id: c.id, hd, gates });
}

const maxPairs = process.argv.includes('--pairs') ? Number(process.argv[process.argv.indexOf('--pairs') + 1]) : Infinity;
const pairs = [];
for (let i = 0; i < people.length && pairs.length < maxPairs; i++) {
  for (let j = i + 1; j < people.length && pairs.length < maxPairs; j++) pairs.push([i, j]);
}

// Python 側：吃 stdin JSON [{a:[gates],b:[gates]}...]，逐對 compose() 原样輸出
const PY = `
import sys, json
sys.path.insert(0, r'${REPORT_GEN}')
from bodygraph import compose
data = json.load(sys.stdin)
out = []
for p in data:
    out.append(compose(set(p['a']), set(p['b'])))
print(json.dumps(out, ensure_ascii=False, default=list))
`;
const payload = JSON.stringify(pairs.map(([i, j]) => ({ a: people[i].gates, b: people[j].gates })));
const raw = execFileSync('py', ['-X', 'utf8', '-c', PY], { input: payload, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const pyResults = JSON.parse(raw);

// Python compose() 形狀（2026-07-11 實測）：channels=[{gates,kind(中文),who('A'/'B'/'both'/'AB'),centers(中文)}]、
// defined=中文中心名清單、shared=共鳴 gates
const KIND_MAP = { 電磁: 'electromagnetic', 同伴: 'companionship', 主導: 'dominance', 妥協: 'compromise' };
const CENTER_MAP = { 頭腦: 'head', 邏輯: 'ajna', 喉嚨: 'throat', G: 'g', 意志力: 'heart', 直覺: 'spleen', 情緒: 'solar', 薦骨: 'sacral', 根: 'root' };

let diffs = 0;
let checked = 0;
for (let k = 0; k < pairs.length; k++) {
  const [i, j] = pairs[k];
  const js = computeComposite(people[i].hd, people[j].hd);
  const py = pyResults[k];
  const label = `${people[i].id} x ${people[j].id}`;
  checked++;

  const pyCats = { electromagnetic: [], companionship: [], dominance: [], compromise: [] };
  const pyWho = {};
  for (const ch of py.channels || []) {
    const cat = KIND_MAP[ch.kind];
    if (!cat) { diffs++; console.log(`DIFF ${label} 未知 kind: ${ch.kind}`); continue; }
    const id = `${Math.min(...ch.gates)}-${Math.max(...ch.gates)}`;
    pyCats[cat].push(id);
    if (ch.who === 'A' || ch.who === 'B') pyWho[id] = ch.who.toLowerCase();
  }
  for (const cat of Object.keys(pyCats)) {
    const a = [...js.categories[cat]].sort().join(',');
    const b = [...pyCats[cat]].sort().join(',');
    if (a !== b) { diffs++; console.log(`DIFF ${label} ${cat}: JS[${a}] PY[${b}]`); }
  }
  for (const [id, who] of Object.entries(pyWho)) {
    const jsWho = (js.channels[id]?.completeFor || []).join('');
    if (jsWho !== who) { diffs++; console.log(`DIFF ${label} ${id} who: JS ${jsWho} PY ${who}`); }
  }
  // 合盤定義中心逐一比對
  const pyDefined = new Set((py.defined || []).map(c => CENTER_MAP[c]));
  for (const c of CENTER_IDS) {
    if (js.centers[c].defined !== pyDefined.has(c)) {
      diffs++; console.log(`DIFF ${label} center ${c}: JS ${js.centers[c].defined} PY ${pyDefined.has(c)}`);
    }
  }
  // 共鳴 gates
  const pyShared = [...(py.shared || [])].sort((x, y) => x - y).join(',');
  const jsShared = js.sharedGates.join(',');
  if (pyShared !== jsShared) { diffs++; console.log(`DIFF ${label} shared: JS[${jsShared}] PY[${pyShared}]`); }
  // 中心動態（both/A/B/new/open）
  for (const [zh, dyn] of Object.entries(py.center_dynamic || {})) {
    const c = CENTER_MAP[zh];
    const pyDyn = dyn === 'A' ? 'a' : dyn === 'B' ? 'b' : dyn;
    if (js.centers[c].dynamic !== pyDyn) {
      diffs++; console.log(`DIFF ${label} dynamic ${c}: JS ${js.centers[c].dynamic} PY ${pyDyn}`);
    }
  }
}
console.log(`\nchecked ${checked} pairs, diffs: ${diffs}`);
process.exit(diffs ? 1 : 0);
