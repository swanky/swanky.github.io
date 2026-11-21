import '../_setup-astronomy.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeChart } from '../../assets/js/human-design/hd-engine.js';
import { hdBriefData } from '../../assets/js/human-design/hd-brief.js';
import { buildAiBrief } from '../../assets/js/core/core-ai-brief.js';

const chart = computeChart({ year: 1990, month: 6, day: 15, hour: 14, minute: 30, tz: 'Asia/Taipei' });

test('人類圖 brief：含類型、權威、中心、通道、行星表', () => {
  const d = hdBriefData(chart, { name: '小明', cityLabel: '台北' });
  const md = buildAiBrief(d, { focus: 'career', today: '2026-11-21', age: 36 });
  for (const s of ['人類圖', '類型：', '內在權威：', '人生角色：', '九大中心', '有定義的通道', '個性（黑）', '小明', '1990-06-15 14:30']) assert.ok(md.includes(s), s);
  assert.ok(!/undefined|NaN|\[object/.test(md));
});

test('人類圖 brief：不附上生日與稱呼', () => {
  const md = buildAiBrief(hdBriefData(chart, { name: '小明', hidePersonal: true }), { focus: 'overall' });
  assert.ok(!md.includes('小明'));
  assert.ok(!md.includes('1990-06-15'));
});

test('人類圖 brief：時間不確定時提醒', () => {
  const md = buildAiBrief(hdBriefData(chart, { timeUnknown: true }), { focus: 'overall' });
  assert.ok(md.includes('出生時間不確定'));
});
