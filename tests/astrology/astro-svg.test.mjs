// astro-svg.test.mjs — 星座圓圖：避讓演算法、上升置左、符號文字呈現、分享卡。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../_setup-astronomy.mjs';
import { spreadLongitudes, buildChartSvg, buildShareCardSvg, MIN_SEP } from '../../assets/js/astrology/astro-svg.js';
import { computeChartFromBirth } from '../../assets/js/astrology/astro-chart.js';

const norm = (d) => ((d % 360) + 360) % 360;
const gap = (a, b) => { const d = Math.abs(norm(a) - norm(b)); return Math.min(d, 360 - d); };

test('避讓：所有顯示角度兩兩相距 ≥ MIN_SEP、順序不變、位移有上限', () => {
  const items = [
    { id: 'a', lon: 100 }, { id: 'b', lon: 101 }, { id: 'c', lon: 103 }, { id: 'd', lon: 104 }, { id: 'e', lon: 250 },
  ];
  const d = spreadLongitudes(items);
  const ids = Object.keys(d);
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    assert.ok(gap(d[ids[i]], d[ids[j]]) >= MIN_SEP - 0.01, `${ids[i]}-${ids[j]}`);
  }
  assert.ok(d.a < d.b && d.b < d.c && d.c < d.d);
  for (const it of items) assert.ok(gap(d[it.id], it.lon) <= MIN_SEP * 2.5, `${it.id} 位移過大`);
  assert.equal(Math.round(d.e), 250); // 沒有鄰居的不動
});

test('避讓：跨 0°/360° 接縫', () => {
  const d = spreadLongitudes([{ id: 'x', lon: 358 }, { id: 'y', lon: 1 }, { id: 'z', lon: 180 }]);
  assert.ok(gap(d.x, d.y) >= MIN_SEP - 0.01);
  assert.ok(gap(d.x, 358) < MIN_SEP && gap(d.y, 1) < MIN_SEP);
});

const CH = computeChartFromBirth({ year: 1990, month: 6, day: 15, hour: 14, minute: 30, tz: 'Asia/Taipei', lat: 25.03, lon: 121.57 });

test('上升固定在左側（9 點鐘）：AC 標籤 x 最小、y 約在中線', () => {
  const svg = buildChartSvg(CH);
  const m = svg.match(/<text x="([\d.]+)" y="([\d.]+)"[^>]*>AC<\/text>/);
  assert.ok(m, '有 AC 標籤');
  assert.ok(+m[1] < 40, `AC x=${m[1]}`);
  assert.ok(Math.abs(+m[2] - 320) < 1, `AC y=${m[2]}`);
});

test('符號一律附文字呈現選擇字元（避免彩色 emoji）', () => {
  const svg = buildChartSvg(CH);
  assert.ok(svg.includes('♈︎'));
  assert.ok(svg.includes('☉︎'));
  assert.ok(!/♀(?!︎)/.test(svg));
});

test('沒有出生時間：不畫四軸、牡羊在左並加註', () => {
  const c = computeChartFromBirth({ year: 1990, month: 6, day: 15, hour: 12, minute: 0, tz: 'Asia/Taipei', lat: 25.03, lon: 121.57, noTime: true });
  const svg = buildChartSvg(c);
  assert.ok(!svg.includes('>AC<'));
  assert.ok(svg.includes('牡羊座放在左側'));
});

test('線寬與字級下限（站主：線與符號太小太細）', () => {
  const svg = buildChartSvg(CH);
  const sizes = [...svg.matchAll(/class="astro-glyph"|font-size="(\d+)"[^>]*class="astro-glyph"/g)];
  assert.ok(sizes.length >= 12);
  assert.ok(/font-size="26"[^>]*class="astro-glyph"/.test(svg));
  assert.ok(/font-size="28"[^>]*class="astro-glyph"/.test(svg));
});

test('分享卡 1080×1350 並內嵌命盤', () => {
  const card = buildShareCardSvg(CH, { name: '測試', lines: ['太陽 雙子座'] });
  assert.equal(card.w, 1080);
  assert.equal(card.h, 1350);
  assert.ok(card.svg.includes('測試的星座命盤'));
  assert.ok(card.svg.includes('width="900" height="900"'));
});
