// astro 引擎測試：純函式（星座/宮位/相位）可自驗；computeChart 用 inject 後的星曆做 sanity。
// 注意：ASC/MC 的精確 golden（vs astro.com ±0.5°）需真實出生資料，屬人工驗證步驟，
//       本檔只驗證引擎不崩、範圍合理、太陽星座正確；未過 golden 前頁面標 beta。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { _injectAstronomy } from '../../assets/js/core/core-astro.js';

const require = createRequire(import.meta.url);
_injectAstronomy(require('../../assets/vendor/astronomy-engine/astronomy.browser.min.js'));

import { signOf, computeChart, SIGNS, POINT_IDS } from '../../assets/js/astrology/astro-chart.js';
import { houseCusps, houseOf, computeAngles, isPolar } from '../../assets/js/astrology/astro-houses.js';
import { detectAspects, orbFor } from '../../assets/js/astrology/astro-aspects.js';

// ---- 純函式 ----
test('signOf 星座邊界', () => {
  assert.equal(signOf(0), 0);        // 牡羊 0°
  assert.equal(signOf(29.999), 0);   // 牡羊尾
  assert.equal(signOf(30), 1);       // 金牛 0°
  assert.equal(signOf(359.9), 11);   // 雙魚尾
  assert.equal(signOf(360), 0);      // norm 回牡羊
  assert.equal(SIGNS[signOf(280)], '摩羯'); // 摩羯 270–300
});

test('houseCusps：Whole Sign 對齊星座、Equal 對齊度數', () => {
  const whole = houseCusps(195, 'whole'); // ASC 天秤 15° → 1 宮起 180
  assert.equal(whole[0], 180);
  assert.equal(whole[1], 210);
  assert.equal(whole.length, 12);
  const equal = houseCusps(195, 'equal');
  assert.equal(equal[0], 195);
  assert.equal(equal[6], 15); // 對宮 195+180=375→15
});

test('houseOf：落宮區間（含跨 360°）', () => {
  const cusps = houseCusps(180, 'whole'); // [180,210,...,150]
  assert.equal(houseOf(185, cusps), 1);
  assert.equal(houseOf(200, cusps), 1);
  assert.equal(houseOf(210, cusps), 2);
  assert.equal(houseOf(350, cusps), 6);  // 350 在 [330,0) → 第 6 宮
  assert.equal(houseOf(5, cusps), 7);    // 5 在 [0,30) → 第 7 宮（跨 360）
});

test('detectAspects：主要相位與 orb 規則', () => {
  assert.equal(orbFor('sun', 'mars'), 8);   // 含發光體
  assert.equal(orbFor('mercury', 'venus'), 6); // 純行星
  assert.equal(orbFor('asc', 'sun'), 5);    // 含四軸

  const conj = detectAspects({ sun: { lon: 0 }, moon: { lon: 0 } });
  assert.equal(conj[0].type, 'conjunction');
  assert.equal(conj[0].orb, 0);

  const trine = detectAspects({ sun: { lon: 0 }, mars: { lon: 120 } });
  assert.ok(trine.some((a) => a.type === 'trine'));

  // 行星相距 7°：合的 orb=7 > 6，不成立；也不是六合 → 無相位
  const none = detectAspects({ mercury: { lon: 0 }, venus: { lon: 7 } });
  assert.equal(none.length, 0);
});

test('isPolar：|φ|>66° 為極區', () => {
  assert.equal(isPolar(25), false);
  assert.equal(isPolar(80), true);
  assert.equal(isPolar(-70), true);
});

// ---- computeChart sanity（用真實星曆）----
test('computeChart：太陽星座正確、結構齊全（台北出生）', () => {
  // 2000-01-01 12:00 UTC，太陽在摩羯
  const chart = computeChart({ utcMs: Date.UTC(2000, 0, 1, 12, 0), lat: 25.03, lon: 121.56, withTime: true });
  assert.equal(chart.points.sun.signZh, '摩羯');
  assert.ok(chart.meta.withTime);
  assert.ok(chart.points.asc && chart.points.asc.lon >= 0 && chart.points.asc.lon < 360);
  assert.ok(chart.points.mc && chart.points.mc.lon >= 0 && chart.points.mc.lon < 360);
  for (const id of POINT_IDS) {
    assert.ok(chart.points[id].house >= 1 && chart.points[id].house <= 12, `${id} 落宮`);
  }
  assert.ok(Array.isArray(chart.aspects));
});

test('computeChart：不確定時間模式只出行星星座、無 ASC/宮位', () => {
  const chart = computeChart({ utcMs: Date.UTC(2020, 3, 1, 0, 0), lat: 25.03, lon: 121.56, withTime: false });
  assert.equal(chart.meta.withTime, false);
  assert.equal(chart.points.asc, undefined);
  assert.equal(chart.houseCusps, null);
  assert.equal(chart.points.sun.signZh, '牡羊'); // 2020-04-01 太陽在牡羊
});

test('computeChart：極區不算宮位（guard）', () => {
  const chart = computeChart({ utcMs: Date.UTC(2000, 0, 1, 12, 0), lat: 80, lon: 20, withTime: true });
  assert.equal(chart.meta.polar, true);
  assert.equal(chart.meta.withTime, false);
  assert.equal(chart.points.asc, undefined);
});
