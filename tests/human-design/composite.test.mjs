// composite.test.mjs — 合盤計算核心（hd-composite.js computeComposite）測試。
// 兩層：①性質測試（spec §6.2 真值表正反例、互斥、A/B 對調、不可變等，輸入手工構造）；
// ②golden 交叉驗證（composite-golden-cases.json：SelfMap 逐條＋Jovian/Maia 官方數量雙站實測，
//   期望值非引擎/模型推導——採集方法論 docs/hd-redesign/composite-golden-design.md）。
// golden 層跑真引擎，需 vendor astronomy（經 _setup-astronomy 注入，與其他引擎測試同法）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import '../_setup-astronomy.mjs';
import { computeComposite, CENTER_IDS, COMPOSITE_VERSION } from '../../assets/js/human-design/hd-composite.js';
import { CHANNELS } from '../../assets/js/human-design/hd-data-channels.js';
import { computeChart } from '../../assets/js/human-design/hd-engine.js';
import { toHumanDesignChart } from '../../assets/js/human-design/hd-adapter.js';
import { makeChart, deepFreeze } from './_composite-helpers.mjs';

// ---- ① 真值表正反例（通道 1-8：gates 1、8，跨 g/throat）----

test('電磁：A 持一端、B 持另一端、雙方皆不完整', () => {
  const r = computeComposite(makeChart([1]), makeChart([8]));
  assert.equal(r.channels['1-8'].state, 'electromagnetic');
  assert.deepEqual(r.channels['1-8'].completeFor, []);
  assert.deepEqual(r.categories.electromagnetic, ['1-8']);
  assert.deepEqual(r.channels['1-8'].gateOwners, { 1: ['a'], 8: ['b'] });
});

test('同 gate 不成通道：A、B 同持單端＝無類、不定義中心、入 sharedGates', () => {
  const r = computeComposite(makeChart([1]), makeChart([1]));
  assert.equal(r.channels['1-8'].state, 'off');
  assert.equal(r.centers.g.defined, false);
  assert.equal(r.centers.throat.defined, false);
  assert.deepEqual(r.sharedGates, [1]);
  assert.equal(r.definition.kind, 'none');
});

test('同伴：雙方皆完整', () => {
  const r = computeComposite(makeChart([1, 8]), makeChart([1, 8]));
  assert.equal(r.channels['1-8'].state, 'companionship');
  assert.deepEqual(r.channels['1-8'].completeFor, ['a', 'b']);
  assert.deepEqual(r.sharedGates, [1, 8]);
});

test('主導：一方完整、對方兩端全無（a/b 各驗）', () => {
  const ra = computeComposite(makeChart([1, 8]), makeChart([]));
  assert.equal(ra.channels['1-8'].state, 'dominance');
  assert.deepEqual(ra.channels['1-8'].completeFor, ['a']);
  const rb = computeComposite(makeChart([]), makeChart([1, 8]));
  assert.equal(rb.channels['1-8'].state, 'dominance');
  assert.deepEqual(rb.channels['1-8'].completeFor, ['b']);
});

test('妥協：一方完整、對方持單端（兩端各驗＋對稱）', () => {
  for (const held of [1, 8]) {
    const r = computeComposite(makeChart([1, 8]), makeChart([held]));
    assert.equal(r.channels['1-8'].state, 'compromise', `對方持 ${held}`);
    assert.deepEqual(r.channels['1-8'].completeFor, ['a']);
    const r2 = computeComposite(makeChart([held]), makeChart([1, 8]));
    assert.deepEqual(r2.channels['1-8'].completeFor, ['b']);
  }
});

test('懸掛 gate：單方單端、對方全無＝無類、不定義中心', () => {
  const r = computeComposite(makeChart([1]), makeChart([]));
  assert.equal(r.channels['1-8'].state, 'off');
  assert.equal(r.centers.g.defined, false);
  assert.deepEqual(r.categories.electromagnetic, []);
  assert.deepEqual(r.categories.dominance, []);
});

test('四類互斥：每條通道恰有一個 state；categories 無重複無交集', () => {
  const A = makeChart([1, 8, 2, 14, 3, 34, 20, 10]);
  const B = makeChart([1, 8, 60, 57, 20]);
  const r = computeComposite(A, B);
  const all = Object.values(r.categories).flat();
  assert.equal(new Set(all).size, all.length, 'categories 內不得重複');
  for (const id of all) assert.equal(r.channels[id].state !== 'off', true);
  for (const ch of CHANNELS) {
    const inCats = all.filter(x => x === ch.id).length;
    assert.equal(inCats, r.channels[ch.id].definedInComposite ? 1 : 0, `${ch.id} 歸類數`);
  }
});

test('A/B 對調：分類集合與中心不變、owner 側對調', () => {
  const A = makeChart([1, 8, 2, 34, 57, 30, 41]);
  const B = makeChart([14, 8, 1, 10, 20, 30]);
  const r1 = computeComposite(A, B);
  const r2 = computeComposite(B, A);
  for (const k of Object.keys(r1.categories)) {
    assert.deepEqual([...r1.categories[k]].sort(), [...r2.categories[k]].sort(), `${k} 集合應不變`);
  }
  for (const c of CENTER_IDS) assert.equal(r1.centers[c].defined, r2.centers[c].defined);
  assert.equal(r1.definition.kind, r2.definition.kind);
  const flip = s => (s === 'a' ? 'b' : 'a');
  for (const ch of CHANNELS) {
    assert.deepEqual(r2.channels[ch.id].completeFor, r1.channels[ch.id].completeFor.map(flip).sort(), `${ch.id} completeFor 對調`);
  }
});

test('自己×自己：所有個人完整通道全為同伴、無其他三類', () => {
  const self = makeChart([1, 8, 2, 14, 34, 57]);
  const r = computeComposite(self, self);
  assert.deepEqual([...r.categories.companionship].sort(), ['1-8', '2-14', '34-57'].sort());
  assert.deepEqual(r.categories.electromagnetic, []);
  assert.deepEqual(r.categories.dominance, []);
  assert.deepEqual(r.categories.compromise, []);
});

test('輸入不可變：deep-frozen 輸入不 throw、輸出引用原 chart', () => {
  const A = deepFreeze(makeChart([1, 8]));
  const B = deepFreeze(makeChart([8, 1]));
  const r = computeComposite(A, B);
  assert.equal(r.people.a.chart, A);
  assert.equal(r.people.b.chart, B);
});

test('中心可追溯：defined 中心的 sourceChannels 非空且全屬四類；未 defined 者為空', () => {
  const r = computeComposite(makeChart([1, 8, 30]), makeChart([41, 2]));
  for (const c of CENTER_IDS) {
    const { defined, sourceChannels } = r.centers[c];
    if (defined) {
      assert.ok(sourceChannels.length > 0, `${c} 缺 sourceChannels`);
      for (const id of sourceChannels) assert.notEqual(r.channels[id].state, 'off');
    } else {
      assert.equal(sourceChannels.length, 0);
    }
  }
});

test('definition：none／single／split 案例', () => {
  assert.equal(computeComposite(makeChart([]), makeChart([])).definition.kind, 'none');
  const single = computeComposite(makeChart([1]), makeChart([8]));
  assert.equal(single.definition.kind, 'single');
  assert.deepEqual([...single.definition.components[0]].sort(), ['g', 'throat']);
  // 兩獨立群：1-8（g/throat）＋ 28-38（spleen/root）
  const split = computeComposite(makeChart([1, 28]), makeChart([8, 38]));
  assert.equal(split.definition.kind, 'split');
  assert.equal(split.definition.components.length, 2);
});

test('中心動態：both／a／b／new（魔法中心）／open 五態', () => {
  // A 定義 g+throat（1-8）、B 定義 sacral+root（3-60）；電磁 2-14 接通 g-sacral（皆已由單方定義）
  const r = computeComposite(makeChart([1, 8, 2]), makeChart([3, 60, 14]));
  assert.equal(r.centers.g.dynamic, 'a', 'g 由 A 帶入');
  assert.equal(r.centers.throat.dynamic, 'a');
  assert.equal(r.centers.sacral.dynamic, 'b', 'sacral 由 B 帶入');
  assert.equal(r.centers.root.dynamic, 'b');
  assert.equal(r.centers.head.dynamic, 'open');
  // 魔法中心：雙方皆開放、合盤才接通
  const magic = computeComposite(makeChart([1]), makeChart([8]));
  assert.equal(magic.centers.g.dynamic, 'new');
  assert.equal(magic.centers.throat.dynamic, 'new');
  // both：雙方各自定義
  const both = computeComposite(makeChart([1, 8]), makeChart([1, 8]));
  assert.equal(both.centers.g.dynamic, 'both');
});

test('不輸出共同 type/authority/profile/cross；version 存在', () => {
  const r = computeComposite(makeChart([1]), makeChart([8]));
  assert.equal(r.version, COMPOSITE_VERSION);
  for (const k of ['type', 'authority', 'profile', 'cross', 'incarnationCross']) {
    assert.equal(k in r, false, `不得有 ${k}`);
  }
});

// ---- ② golden 交叉驗證（雙站實測期望值）----

const goldenUrl = new URL('./golden/composite-golden-cases.json', import.meta.url);
let golden = null;
try { golden = JSON.parse(readFileSync(goldenUrl, 'utf8')); } catch { /* B0 未完成時跳過 */ }

function chartFromInput(input) {
  const [y, m, d] = input.date.split('-').map(Number);
  const [hh, mm] = input.time.split(':').map(Number);
  return toHumanDesignChart(computeChart({ year: y, month: m, day: d, hour: hh, minute: mm, tz: input.tz }));
}

test('golden：合盤四類逐條、中心數、共鳴閘門與雙站實測一致', { skip: !golden && 'composite-golden-cases.json 尚未產生（B0）' }, () => {
  assert.ok(golden.cases.length >= 10, `golden 應 ≥10 組，現 ${golden.cases.length}`);
  for (const c of golden.cases) {
    const r = computeComposite(chartFromInput(c.people.a.input), chartFromInput(c.people.b.input));
    const exp = c.expected;
    // 四類逐條（SelfMap 過濾後）＋數量（Jovian 官方）
    assert.deepEqual([...r.categories.electromagnetic].sort(), exp.categories.electromagnetic.map(e => e.ch).sort(), `${c.id} EM`);
    assert.deepEqual([...r.categories.companionship].sort(), exp.categories.companionship.map(e => e.ch).sort(), `${c.id} CP`);
    assert.deepEqual([...r.categories.dominance].sort(), exp.categories.dominance.map(e => e.ch).sort(), `${c.id} DM`);
    assert.deepEqual([...r.categories.compromise].sort(), exp.categories.compromise.map(e => e.ch).sort(), `${c.id} CX`);
    for (const [k, n] of Object.entries(exp.counts)) assert.equal(r.categories[k].length, n, `${c.id} ${k} count`);
    // 主導/妥協 owner 與妥協對方單 gate
    for (const e of exp.categories.dominance) {
      assert.deepEqual(r.channels[e.ch].completeFor, [e.who], `${c.id} DM ${e.ch} owner`);
    }
    for (const e of exp.categories.compromise) {
      assert.deepEqual(r.channels[e.ch].completeFor, [e.who], `${c.id} CX ${e.ch} owner`);
      const other = e.who === 'a' ? 'b' : 'a';
      assert.equal(r.gates[e.otherGate][other].active, true, `${c.id} CX ${e.ch} 對方持 ${e.otherGate}`);
    }
    // 電磁兩端歸屬
    for (const e of exp.categories.electromagnetic) {
      assert.ok(r.channels[e.ch].gateOwners[e.aGate].includes('a'), `${c.id} EM ${e.ch} A 端`);
      assert.ok(r.channels[e.ch].gateOwners[e.bGate].includes('b'), `${c.id} EM ${e.ch} B 端`);
    }
    // 合盤中心數（定義＋開放＝9）
    const definedCount = CENTER_IDS.filter(x => r.centers[x].defined).length;
    assert.equal(definedCount, exp.definedCenterCount, `${c.id} 定義中心數`);
    assert.equal(9 - definedCount, exp.openCenterCount, `${c.id} 開放中心數`);
    // 共鳴閘門（外部站呈現層子集）
    for (const g of exp.echoGates) assert.ok(r.sharedGates.includes(g), `${c.id} echo ${g} 應在 sharedGates`);
  }
});
