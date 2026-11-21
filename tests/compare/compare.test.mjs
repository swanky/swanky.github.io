// compare.test.mjs — 四套地圖對照。虛構出生資料（不使用站主或任何真人資料）。
import '../_setup-astronomy.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { _injectIztro } from '../../assets/js/ziwei/ziwei-engine.js';
import { computeAll, compareDimensions, verdictOf, keyFacts, compareBriefData, workTopic, palaceStars, DIMENSIONS } from '../../assets/js/compare/compare-core.js';
import { buildAiBrief } from '../../assets/js/core/core-ai-brief.js';

globalThis.self = globalThis.self || globalThis;
const require = createRequire(import.meta.url);
_injectIztro(require('../../assets/vendor/iztro/iztro.min.js'));

const city = { zh: '台北市', tz: 'Asia/Taipei', lat: 25.03, lon: 121.57 };
const birth = { y: 1990, mo: 6, d: 15, h: 14, mi: 30, gender: 'female', city, name: '小明', refDate: '2026-11-21' };
const r = computeAll(birth);

test('四套系統都算得出來', () => {
  assert.ok(r.hd.type && r.astro.points.asc && r.bazi.chart.pillars.day && r.ziwei.palaces.length === 12);
  const f = keyFacts(r);
  for (const k of ['hd', 'astro', 'bazi', 'ziwei']) assert.equal(f[k].length, 3);
  assert.ok(!JSON.stringify(f).includes('undefined'));
});

test('判定規則看票數：一致／多數／分歧／線索不夠', () => {
  const P = { a: '偏主動', b: '偏觀察' };
  const v = (...ps) => verdictOf(ps.map((pole) => ({ pole })), P);
  assert.equal(v('a', 'a', null).kind, 'agree');
  assert.equal(v('a', 'a', 'a', 'a').label, '說法一致：4 套都偏主動');
  const lean = v('a', 'a', 'a', 'b');
  assert.equal(lean.kind, 'lean');
  assert.equal(lean.label, '多數偏主動：3 套偏主動、1 套偏觀察');
  assert.equal(v('b', 'b', 'a', null).pole, 'b');
  assert.equal(v('a', 'b').kind, 'split');
  assert.equal(v('a', 'a', 'b', 'b').kind, 'split');
  assert.equal(v('a', null, null).kind, 'weak');
  assert.equal(v(null, null, null, null).label, '線索不夠，先不下結論');
});

const initiative = DIMENSIONS.find((d) => d.id === 'initiative').read;

test('行動起點：只有顯示者算主動，顯示生產者與生產者都歸觀察', () => {
  const fake = (type) => ({ hd: { type } });
  assert.equal(initiative.hd(fake('manifestor')).pole, 'a');
  assert.equal(initiative.hd(fake('mg')).pole, 'b');
  assert.match(initiative.hd(fake('mg')).basis, /先等回應/);
  assert.equal(initiative.hd(fake('generator')).pole, 'b');
  assert.equal(initiative.hd(fake('projector')).pole, 'b');
});

test('行動起點：星座火風門檻邊界（5 主動、2 觀察、3～4 不歸類）', () => {
  const ids = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
  const astro = (n) => ({ astro: { points: Object.fromEntries(ids.map((id, i) => [id, { element: i < n ? '火' : '土' }])) } });
  assert.equal(initiative.astro(astro(5)).pole, 'a');
  assert.equal(initiative.astro(astro(4)).pole, null);
  assert.equal(initiative.astro(astro(3)).pole, null);
  assert.equal(initiative.astro(astro(2)).pole, 'b');
});

test('紫微空宮借對宮', () => {
  const chart = { palaces: Array.from({ length: 12 }, (_, i) => ({ index: i, name: `p${i}`, major: i === 8 ? [{ name: '七殺' }] : [] })) };
  const res = palaceStars(chart, chart.palaces[2]);
  assert.deepEqual(res.stars, ['七殺']);
  assert.equal(res.borrowed, true);
  assert.equal(initiative.ziwei({ ziwei: { palaces: chart.palaces.map((p) => ({ ...p, isSoul: p.index === 2 })) } }).pole, 'a');
});

test('同一主題（工作）：四套都有指標與白話，不含未定義', () => {
  const wt = workTopic(r);
  assert.equal(wt.rows.length, 4);
  for (const row of wt.rows) assert.ok(row.indicator && row.text && !/undefined|NaN/.test(row.indicator + row.text), row.system);
});

test('每個面向每套系統都有依據文字', () => {
  for (const d of compareDimensions(r)) {
    assert.equal(d.rows.length, 4);
    for (const row of d.rows) assert.ok(row.basis && !row.basis.includes('undefined'), `${d.id}/${row.system}`);
  }
});

test('合併提問：含四套系統、對照表、矛盾規則，隱私選項有效', () => {
  const md = buildAiBrief(compareBriefData(r), { focus: 'overall', today: '2026-11-21', age: 36 });
  for (const s of ['人類圖：', '星座：', '八字：', '紫微：', '本站整理的對照', '同一主題，四套各自怎麼說：工作', '互相矛盾', '小明', '1990-06-15 14:30']) assert.ok(md.includes(s), s);
  assert.ok(!/undefined|NaN|\[object/.test(md));
  const hidden = buildAiBrief(compareBriefData(r, { hidePersonal: true }), { focus: 'overall' });
  assert.ok(!hidden.includes('小明') && !hidden.includes('1990-06-15'));
});
