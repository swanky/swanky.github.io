// fixing.test.mjs — 行星「固定於擢升/衰落」(Fixing) 對照表與整合驗證
// 資料源：SharpAstrology.HumanDesign (MIT)；ground-truth 取自使用者參考站 humandesignasia.org 圖表。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import './_setup.mjs';
import { computeChart } from '../../assets/js/human-design/hd-engine.js';
import { PLANET_IDS } from '../../assets/js/human-design/hd-astro.js';
import { FIXINGS, getFixing } from '../../assets/js/human-design/hd-data-fixing.js';
import { GOLDEN_CHARTS } from './fixtures-golden.mjs';

const VALID_PLANETS = new Set([
  'sun', 'earth', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
]);

test('getFixing ground-truth（對齊參考站可見箭頭）', () => {
  assert.equal(getFixing('mars', 42, 3), 'exalted', 'Mars 42.3 應為擢升 ▲');
  assert.equal(getFixing('neptune', 11, 6), 'exalted', 'Neptune 11.6 應為擢升 ▲');
  assert.equal(getFixing('moon', 42, 3), 'detriment', 'Moon 42.3 應為衰落 ▼');
});

test('交點（南北交點）永不固定 → null', () => {
  assert.equal(getFixing('northNode', 12, 3), null, '北交點 12.3 不顯示箭頭（標準）');
  assert.equal(getFixing('southNode', 11, 6), null, '南交點即便落在已固定爻線也無箭頭');
  // 全表掃描：任何爻線都不該把交點列為 exalt/detriment
  for (const g of Object.keys(FIXINGS)) {
    for (const l of Object.keys(FIXINGS[g])) {
      const e = FIXINGS[g][l];
      assert.ok(e.exalt !== 'northNode' && e.exalt !== 'southNode', `${g}.${l} exalt 不應為交點`);
      assert.ok(e.detriment !== 'northNode' && e.detriment !== 'southNode', `${g}.${l} detriment 不應為交點`);
    }
  }
});

test('已知來源錯誤已修正：25.4 重複擢升只保留 venus', () => {
  assert.equal(getFixing('venus', 25, 4), 'exalted', '25.4 擢升星＝venus（jdempcy 獨立確認）');
  assert.equal(getFixing('jupiter', 25, 4), null, '25.4 的 jupiter 重複條目已剔除');
});

test('非固定星回 null', () => {
  assert.equal(getFixing('sun', 42, 3), null, 'Sun 不是 42.3 的固定星');
  assert.equal(getFixing('mars', 54, 4), null, '54.4 來源無資料 → 任何行星皆 null');
});

test('表結構健全：值皆為 11 行星之一、量級合理', () => {
  let nExalt = 0, nDet = 0, nLines = 0;
  for (const g of Object.keys(FIXINGS)) {
    for (const l of Object.keys(FIXINGS[g])) {
      nLines++;
      const { exalt, detriment } = FIXINGS[g][l];
      if (exalt !== null) { assert.ok(VALID_PLANETS.has(exalt), `非法擢升星 ${exalt} @${g}.${l}`); nExalt++; }
      if (detriment !== null) { assert.ok(VALID_PLANETS.has(detriment), `非法衰落星 ${detriment} @${g}.${l}`); nDet++; }
    }
  }
  assert.ok(nLines >= 380, `涵蓋爻線過少：${nLines}`);
  assert.ok(nExalt + nDet > 700, `固定條目過少：${nExalt}+${nDet}`);
});

test('引擎整合：computeChart 每個活化都掛上正確的 fixing 欄位', () => {
  const c = computeChart(GOLDEN_CHARTS[0].input);
  for (const p of PLANET_IDS) {
    for (const pos of [c.personality[p], c.design[p]]) {
      assert.ok(['exalted', 'detriment', null].includes(pos.fixing), `${p} fixing 值非法`);
      assert.equal(pos.fixing, getFixing(p, pos.gate, pos.line), `${p} 引擎 fixing 與查表不一致`);
    }
  }
});
