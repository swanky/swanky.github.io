// golden.test.mjs — 星座命盤端到端 golden：出生資料直進 computeChartFromBirth（跨與頁面相同的
// 時區→UTC 縫），與 Swiss Ephemeris 算出的參考值比對。容差：四軸與宮首 0.05°、行星 0.05°（實測最大約 0.006°）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../_setup-astronomy.mjs';
import { computeChartFromBirth } from '../../assets/js/astrology/astro-chart.js';
import { GOLDEN_ASTRO } from './fixtures-golden.mjs';

const TOL = 0.05;

// 黃經環狀差（處理 359.9 vs 0.1）
function degDiff(a, b) {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
}

test('golden 星座命盤（Swiss Ephemeris 獨立參考）', { skip: GOLDEN_ASTRO.length === 0 && '尚無人工採集 fixture' }, () => {
  for (const fx of GOLDEN_ASTRO) {
    const c = computeChartFromBirth(fx.input);
    assert.ok(degDiff(c.points.asc.lon, fx.expected.asc) <= TOL,
      `${fx.label} ASC：算得 ${c.points.asc.lon.toFixed(2)}° vs 期望 ${fx.expected.asc}°`);
    assert.ok(degDiff(c.points.mc.lon, fx.expected.mc) <= TOL,
      `${fx.label} MC：算得 ${c.points.mc.lon.toFixed(2)}° vs 期望 ${fx.expected.mc}°`);
    fx.expected.cusps.forEach((exp, i) => {
      assert.ok(degDiff(c.houseCusps[i], exp) <= TOL,
        `${fx.label} 第 ${i + 1} 宮首：算得 ${c.houseCusps[i].toFixed(2)}° vs 期望 ${exp}°`);
    });
    for (const [id, exp] of Object.entries(fx.expected.planets || {})) {
      assert.ok(degDiff(c.points[id].lon, exp) <= TOL,
        `${fx.label} ${id}：算得 ${c.points[id].lon.toFixed(3)}° vs 期望 ${exp}°`);
    }
  }
});
