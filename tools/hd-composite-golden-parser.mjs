// 合盤 golden 生成器：讀 docs/hd-redesign/composite-golden-evidence/{selfmap,jovian}-{pairId}.txt
// → SelfMap 逐條過濾（composite-golden-design.md §2）→ 與 Jovian 官方數量對拍
// → 與引擎 gate sets sanity 對拍（引擎不產分類期望值，僅驗輸入正確）
// → 產 tests/human-design/golden/composite-golden-cases.json
// 用法：node tools/hd-composite-golden-parser.mjs [--write]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import '../tests/_setup-astronomy.mjs';
import { computeChart } from '../assets/js/human-design/hd-engine.js';
import { toHumanDesignChart } from '../assets/js/human-design/hd-adapter.js';

const EVIDENCE = new URL('../docs/hd-redesign/composite-golden-evidence/', import.meta.url);
const GOLDEN_SINGLE = new URL('../tests/human-design/golden/golden-cases.json', import.meta.url);
const OUT = new URL('../tests/human-design/golden/composite-golden-cases.json', import.meta.url);

// pairId → 單人 golden id 對照（composite-golden-design.md §3）
const PAIRS = {
  'cal-default': null, // 特例：非 golden 人選（SelfMap 預設值）
  'four-max': ['tw-hist-dst', 'eu-bst'],
  'four-cx': ['tw-hist-dst', 'leap-1996'],
  'four-balance': ['us-pst-mid', 'au-syd-dst'],
  'four-split': ['tw-hist-dst', 'us-pst-mid'],
  'em-max': ['ego-tokyo', 'nz-auckland'],
  'cp-max': ['gate-bound-before', 'gate-bound-after'],
  'dm-max': ['tw-hist-dst', 'ar-baires'],
  'cx-max': ['us-pst-mid', 'ca-vancouver'],
  'cx-zero': ['nz-auckland', 'jp-tokyo-mid'],
  'em-zero': ['jp-tokyo-mid', 'in-kolkata'],
  'minimal': ['tw-hist-jst', 'br-saopaulo'],
  'refl-min': ['refl-bangkok', 'ego-tokyo'],
  'maximal': ['tw-hist-dst', 'au-syd-dst'],
  'comp3': ['tw-normal', 'ego-tokyo'],
  'tw-pair': ['tw-normal', 'tw-hist-jst'],
};
const CAL_INPUTS = { a: { date: '2000-01-01', time: '12:00', tz: 'Asia/Taipei' }, b: { date: '1995-06-15', time: '08:00', tz: 'Asia/Taipei' } };

const singles = JSON.parse(readFileSync(GOLDEN_SINGLE, 'utf8')).cases;
const inputOf = id => singles.find(c => c.id === id)?.input;

// dump 兩種存法兼容：真換行原文（批次一）或 JSON 字串字面量（批次二，整檔 "..." 帶 \n 逸出）
function normalizeDump(txt) {
  const t = txt.trim();
  if (t.startsWith('"') && t.endsWith('"')) { try { return JSON.parse(t); } catch { /* 照原文 */ } }
  return txt;
}

// ---------- SelfMap parser ----------
function parseSelfmap(rawTxt) {
  const txt = normalizeDump(rawTxt);
  const lines = txt.split(/\r?\n/).map(l => l.trim());
  // 行星欄：連續 gate.line（>=20 筆）的前兩串 = A/B
  const runs = [];
  let cur = [];
  for (const l of lines) {
    if (/^\d{1,2}\.\d$/.test(l)) cur.push(l);
    else { if (cur.length >= 20) runs.push(cur); cur = []; }
  }
  if (cur.length >= 20) runs.push(cur);
  if (runs.length < 2) throw new Error('SelfMap: 行星欄不足兩串');
  const gatesA = [...new Set(runs[0].map(s => Number(s.split('.')[0])))];
  const gatesB = [...new Set(runs[1].map(s => Number(s.split('.')[0])))];

  // 整合主題：N 個已定義中心 · M 個開放中心
  const theme = txt.match(/(\d+)\s*個已定義中心\s*·\s*(\d+)\s*個開放中心/);
  if (!theme) throw new Error('SelfMap: 找不到整合主題');

  // 四類區段
  const SECTIONS = { 電磁力: 'electromagnetic', 同伴關係: 'companionship-raw', 妥協與協調: 'compromise', 主導與掌控: 'dominance-raw' };
  const idxOf = name => lines.findIndex(l => l === name);
  const bounds = ['電磁力', '同伴關係', '妥協與協調', '主導與掌控', '配置共鳴'].map(idxOf);
  if (bounds.some(i => i < 0)) throw new Error('SelfMap: 區段錨缺失 ' + JSON.stringify(bounds));
  const entries = {};
  const names = Object.keys(SECTIONS);
  for (let s = 0; s < names.length; s++) {
    const seg = lines.slice(bounds[s], bounds[s + 1]);
    const list = [];
    for (let i = 0; i < seg.length; i++) {
      if (!/^\d{1,2}-\d{1,2}$/.test(seg[i])) continue;
      // 後續兩行內找 人物 A ... / 人物 B ...
      const rec = { ch: seg[i], a: null, b: null };
      for (let j = i + 1; j < Math.min(i + 5, seg.length); j++) {
        let m = seg[j].match(/^人物 A\s*(.*)$/);
        if (m) rec.a = m[1].trim();
        m = seg[j].match(/^人物 B\s*(.*)$/);
        if (m) { rec.b = m[1].trim(); break; }
      }
      if (rec.a === null || rec.b === null) throw new Error(`SelfMap: ${seg[i]} 缺 A/B 持有行`);
      list.push(rec);
    }
    entries[SECTIONS[names[s]]] = list;
  }
  return { gatesA, gatesB, defined: Number(theme[1]), open: Number(theme[2]), entries };
}

const parseHold = s => (s === '—' || s === '') ? [] : s.split(/[,，]\s*/).map(Number);

// 過濾（§2）：SelfMap 擴充 → 通道層次四類
function filterSelfmap(entries) {
  const out = { electromagnetic: [], companionship: [], dominance: [], compromise: [] };
  const echoGates = [];
  const rejects = [];
  for (const e of entries['electromagnetic']) {
    const a = parseHold(e.a), b = parseHold(e.b);
    if (a.length === 1 && b.length === 1 && a[0] !== b[0]) out.electromagnetic.push({ ch: e.ch, aGate: a[0], bGate: b[0] });
    else rejects.push(['EM?', e]);
  }
  for (const e of entries['companionship-raw']) {
    const a = parseHold(e.a), b = parseHold(e.b);
    if (a.length === 2 && b.length === 2) out.companionship.push({ ch: e.ch });
    else if (a.length === 1 && b.length === 1 && a[0] === b[0]) echoGates.push(a[0]);
    else rejects.push(['CP?', e]);
  }
  for (const e of entries['dominance-raw']) {
    const a = parseHold(e.a), b = parseHold(e.b);
    if (a.length === 2 && b.length === 0) out.dominance.push({ ch: e.ch, who: 'a' });
    else if (b.length === 2 && a.length === 0) out.dominance.push({ ch: e.ch, who: 'b' });
    else if ((a.length === 1 && b.length === 0) || (b.length === 1 && a.length === 0)) { /* 懸掛 gate，捨棄 */ }
    else rejects.push(['DM?', e]);
  }
  for (const e of entries['compromise']) {
    const a = parseHold(e.a), b = parseHold(e.b);
    if (a.length === 2 && b.length === 1) out.compromise.push({ ch: e.ch, who: 'a', otherGate: b[0] });
    else if (b.length === 2 && a.length === 1) out.compromise.push({ ch: e.ch, who: 'b', otherGate: a[0] });
    else rejects.push(['CX?', e]);
  }
  return { out, echoGates, rejects };
}

// ---------- Jovian parser ----------
function parseJovian(rawTxt) {
  const txt = normalizeDump(rawTxt);
  const num = (re) => { const m = txt.match(re); return m ? Number(m[1]) : null; };
  const theme = txt.match(/Connection Theme\s*\n?\s*(\d+)\s*&\s*(\d+)/);
  const counts = {
    electromagnetic: num(/Electromagnetic Connections\s*\n?\s*(\d+)/),
    dominance: num(/Dominance Connections\s*\n?\s*(\d+)/),
    compromise: num(/Compromise Connections\s*\n?\s*(\d+)/),
    companionship: num(/Companionship Connections\s*\n?\s*(\d+)/),
  };
  if (!theme || Object.values(counts).some(v => v === null)) throw new Error('Jovian: 關鍵欄位缺失');
  // 行星欄（格式「38. 1」）：PERSONA/PERSONB 段
  const grabGates = label => {
    const i = txt.indexOf(label);
    if (i < 0) return null;
    const seg = txt.slice(i, i + 1200);
    const ms = [...seg.matchAll(/(\d{1,2})\.\s?(\d)/g)].slice(0, 26);
    return ms.length >= 20 ? [...new Set(ms.map(m => Number(m[1])))] : null;
  };
  return { defined: Number(theme[1]), open: Number(theme[2]), counts, gatesA: grabGates('PERSONA'), gatesB: grabGates('PERSONB') };
}

// ---------- 引擎 sanity（僅驗 gate sets，不產分類） ----------
function engineGates(input) {
  const [y, m, d] = input.date.split('-').map(Number);
  const [hh, mm] = input.time.split(':').map(Number);
  const hd = toHumanDesignChart(computeChart({ year: y, month: m, day: d, hour: hh, minute: mm, tz: input.tz }));
  return new Set(Object.values(hd.gates).filter(g => g.activated).map(g => g.gate));
}
const setEq = (x, y) => x.size === new Set(y).size && [...y].every(v => x.has(v));

// ---------- 主流程 ----------
const results = [];
const problems = [];
for (const [pairId, ids] of Object.entries(PAIRS)) {
  const smPath = new URL(`selfmap-${pairId}.txt`, EVIDENCE);
  const jvPath = new URL(`jovian-${pairId}.txt`, EVIDENCE);
  if (!existsSync(smPath) || !existsSync(jvPath)) continue; // 尚未採集
  const inputs = pairId === 'cal-default' ? CAL_INPUTS : { a: inputOf(ids[0]), b: inputOf(ids[1]) };
  try {
    const sm = parseSelfmap(readFileSync(smPath, 'utf8'));
    const jv = parseJovian(readFileSync(jvPath, 'utf8'));
    const { out, echoGates, rejects } = filterSelfmap(sm.entries);
    const issues = [];
    // 對拍 1：SelfMap 過濾後數量 vs Jovian 官方
    for (const k of Object.keys(jv.counts)) {
      if (out[k].length !== jv.counts[k]) issues.push(`${k}: SelfMap過濾 ${out[k].length} ≠ Jovian ${jv.counts[k]}`);
    }
    // 對拍 2：中心數
    if (sm.defined !== jv.defined || sm.open !== jv.open) issues.push(`中心數: SelfMap ${sm.defined}/${sm.open} ≠ Jovian ${jv.defined}/${jv.open}`);
    // 對拍 3：gate sets 三方（引擎/SelfMap/Jovian）
    const engA = engineGates(inputs.a), engB = engineGates(inputs.b);
    if (!setEq(engA, sm.gatesA)) issues.push(`gatesA: 引擎≠SelfMap（時區或輸入疑義）`);
    if (!setEq(engB, sm.gatesB)) issues.push(`gatesB: 引擎≠SelfMap`);
    if (jv.gatesA && !setEq(engA, jv.gatesA)) issues.push(`gatesA: 引擎≠Jovian`);
    if (jv.gatesB && !setEq(engB, jv.gatesB)) issues.push(`gatesB: 引擎≠Jovian`);
    if (rejects.length) issues.push(`過濾異型 ${rejects.length} 條: ` + JSON.stringify(rejects.slice(0, 3)));
    if (issues.length) { problems.push({ pairId, issues }); continue; }
    results.push({
      id: pairId,
      people: pairId === 'cal-default'
        ? { a: { input: inputs.a }, b: { input: inputs.b } }
        : { a: { goldenId: ids[0], input: inputs.a }, b: { goldenId: ids[1], input: inputs.b } },
      expected: {
        categories: out,
        counts: jv.counts,
        definedCenterCount: jv.defined,
        openCenterCount: jv.open,
        echoGates: [...new Set(echoGates)].sort((x, y) => x - y),
      },
      source: {
        selfmap: `selfmap-${pairId}.txt`, jovian: `jovian-${pairId}.txt`,
        site: 'selfmap.tw（逐條）+ jovianarchive.com/Maia（官方數量）', collectedAt: '2026-07-11',
      },
    });
  } catch (e) { problems.push({ pairId, issues: [String(e.message)] }); }
}

console.log(`parsed OK: ${results.length} 對（${results.map(r => r.id).join(', ')}）`);
if (problems.length) { console.log('\nPROBLEMS:'); for (const p of problems) console.log(` ${p.pairId}:\n  - ` + p.issues.join('\n  - ')); }

if (process.argv.includes('--write')) {
  const doc = {
    _meta: {
      description: '合盤 golden：SelfMap 逐條（過濾規則見 docs/hd-redesign/composite-golden-design.md §2）+ Jovian/Maia 官方數量雙站交叉，引擎 gate-set sanity 三方對拍全過才收錄',
      collectedAt: '2026-07-11',
      collectedBy: 'Playwright 逐對實測（期望值非模型/引擎推算）',
      note: 'definition components 無外部源（兩站皆不提供），不在期望值內；中心以「數量」為期望（兩站僅給數）。echoGates=雙方同持之 gate（SelfMap 同伴區共鳴閘門，非四類）。',
    },
    cases: results,
  };
  writeFileSync(OUT, JSON.stringify(doc, null, 2) + '\n');
  console.log(`\nwritten: ${OUT.pathname} (${results.length} cases)`);
} else {
  console.log('\n(dry-run；加 --write 落檔)');
}
