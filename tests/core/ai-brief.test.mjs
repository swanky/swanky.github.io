// ai-brief.test.mjs — 「給 AI 的完整提問」純函式測試（核心模組＋紫微資料）。虛構出生資料。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { buildAiBrief, FOCUS, briefFilename, todayStr } from '../../assets/js/core/core-ai-brief.js';
import { _injectIztro, computeZiwei } from '../../assets/js/ziwei/ziwei-engine.js';
import { ziweiBriefData } from '../../assets/js/ziwei/ziwei-brief.js';

globalThis.self = globalThis.self || globalThis;
_injectIztro(createRequire(import.meta.url)('../../assets/vendor/iztro/iztro.min.js'));

const chart = computeZiwei({ year: 1990, month: 6, day: 15, hour: 14, minute: 30, gender: 'female', refDate: '2026-7-1' });

test('紫微完整提問包含必要段落與規則', () => {
  const t = buildAiBrief(ziweiBriefData(chart, { name: '小明' }), { focus: 'love', situation: '剛換工作', question: '何時適合定下來？', today: '2026-11-21', age: 36 });
  for (const s of ['# 小明的紫微斗數命盤', '## 關於我', '今天日期：2026-11-21', '我目前的年齡：36 歲', '我的近況：剛換工作',
    '## 十二宮（從命宮起）', '## 各宮的對宮與三合', '## 目前運勢', '## 請你這樣解讀', FOCUS.love.ask,
    '不要自己重新排盤', '資訊足夠就直接解讀', '不要談健康', '## 我想問的問題', '何時適合定下來？', '1990-06-15']) {
    assert.ok(t.includes(s), `缺少：${s}`);
  }
  // 12 宮資料列
  assert.equal((t.match(/^\| (命宮|兄弟|夫妻|子女|財帛|疾厄|遷移|僕役|官祿|田宅|福德|父母)/gm) || []).length, 24);
});

test('隱去生日與稱呼', () => {
  const t = buildAiBrief(ziweiBriefData(chart, { name: '小明', hidePersonal: true }), { today: '2026-11-21' });
  assert.ok(!t.includes('小明'));
  assert.ok(!t.includes('1990'));
  assert.ok(!t.includes('虛歲'));
  assert.ok(t.includes('生日已隱去'));
});

test('沒寫近況時請 AI 先問；選我自己問但沒填問題時退回認識自己', () => {
  const d = ziweiBriefData(chart);
  const t = buildAiBrief(d, { focus: 'custom' });
  assert.ok(t.includes('請先問我兩到三個'));
  assert.ok(t.includes(FOCUS.overall.ask));
  assert.ok(!t.includes(FOCUS.custom.ask));
});

test('健康選項切換', () => {
  const d = ziweiBriefData(chart);
  assert.ok(buildAiBrief(d, { includeHealth: true }).includes('不做醫療判斷'));
  assert.ok(buildAiBrief(d, {}).includes('不要談健康'));
});

test('不含禁詞與工程術語（訪客會看到全文）', () => {
  const t = buildAiBrief(ziweiBriefData(chart), { focus: 'overall' });
  for (const w of ['神準', '命中註定', '大凶', '注定', '一定會', 'prompt', 'JSON', 'Markdown']) assert.ok(!t.includes(w), w);
});

test('表格儲存格中的直線符號被替換', () => {
  const t = buildAiBrief({ system: 'x', title: 't', sections: [{ heading: 'h', table: { head: ['a|b'], rows: [['c|d']] } }] });
  assert.ok(t.includes('a／b') && t.includes('c／d'));
});

test('檔名與日期', () => {
  assert.equal(briefFilename('紫微斗數', '2026-11-21'), '紫微斗數-完整提問-2026-11-21.md');
  assert.equal(todayStr(new Date(2026, 0, 5)), '2026-01-05');
});

test('八字完整提問：四柱表、五行、大運、隱私', async () => {
  await import('../_setup-astronomy.mjs');
  const { computePillarsFromBirth } = await import('../../assets/js/bazi/bazi-pillars.js');
  const { analyzeChart } = await import('../../assets/js/bazi/bazi-shishen.js');
  const { baziBriefData } = await import('../../assets/js/bazi/bazi-brief.js');
  const inp = { y: 1990, mo: 6, d: 15, h: 14, mi: 30, timeUnknown: false, city: { zh: '台北市' }, gender: 'female', trueSolarTime: false, name: '小明' };
  const chart = computePillarsFromBirth({ year: 1990, month: 6, day: 15, hour: 14, minute: 30, tz: 'Asia/Taipei', gender: 'female', lon: 121.57 });
  const an = analyzeChart(chart.pillars);
  const t = buildAiBrief(baziBriefData(chart, an, inp), { today: '2026-11-21' });
  for (const s of ['# 小明的八字命盤', '| 年柱 |', '| 時柱 |', '## 五行比例', '## 大運', '不要替我推薦用神']) assert.ok(t.includes(s), s);
  const h = buildAiBrief(baziBriefData(chart, an, inp, { hidePersonal: true }), {});
  assert.ok(!h.includes('小明') && !h.includes('1990'));
});
