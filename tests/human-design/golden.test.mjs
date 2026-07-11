// golden.test.mjs — 端到端：與業界參考站固化案例逐筆比對（防 vendor 升級回歸）
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import './_setup.mjs';
import { computeChart } from '../../assets/js/human-design/hd-engine.js';
import { positionsAt, PLANET_IDS } from '../../assets/js/human-design/hd-astro.js';
import { lonToGateLine } from '../../assets/js/human-design/hd-mandala.js';
import { GOLDEN_CHARTS, GOLDEN_TRANSITS } from './fixtures-golden.mjs';

for (const fx of GOLDEN_CHARTS) {
  test(`golden 出生圖：${fx.label}`, () => {
    const c = computeChart(fx.input);
    for (const p of PLANET_IDS) {
      assert.equal(`${c.personality[p].gate}.${c.personality[p].line}`, fx.personality[p],
        `Personality ${p}`);
      assert.equal(`${c.design[p].gate}.${c.design[p].line}`, fx.design[p],
        `Design ${p}`);
    }
    assert.equal(c.type, fx.result.type, '類型');
    assert.equal(c.authority, fx.result.authority, '內在權威');
    assert.equal(c.profile, fx.result.profile, '人生角色');
    assert.equal(c.definition, fx.result.definition, '定義');
    assert.deepEqual(c.crossGates, fx.result.crossGates, '輪迴交叉四門');
    assert.equal(c.crossAngle, fx.result.crossAngle, '交叉角度');
  });
}

for (const fx of GOLDEN_TRANSITS) {
  test(`golden 即時星盤：${fx.label}`, () => {
    const pos = positionsAt(Date.UTC(...fx.utc));
    for (const p of PLANET_IDS) {
      const r = lonToGateLine(pos[p]);
      assert.equal(`${r.gate}.${r.line}`, fx.personality[p], `${p}（${pos[p].toFixed(3)}°）`);
    }
  });
}

// ---- 交叉驗證固化案例（golden/golden-cases.json）----
// 來源：humandesignasia.org（Maia 引擎）2026-07-11 Playwright 逐筆實測採集。
// 涵蓋 DST/歷史時區/午夜/閘門切換邊界/南半球/近日界線/半-四分之一小時偏移/五型七權威。
// 參考站僅以文字揭露 type/profile/definition/authority/輪迴交叉（含四門）；中心/通道/全行星
// 啟動門僅在伺服器端 PNG（無文字版），已截圖存證（scratchpad/golden-src-*.png），此處不比對。
const CROSSVAL = JSON.parse(readFileSync(new URL('./golden/golden-cases.json', import.meta.url), 'utf8'));
for (const fx of CROSSVAL.cases) {
  test(`golden 交叉驗證（Maia/humandesignasia）：${fx.id}`, () => {
    const [y, mo, d] = fx.input.date.split('-').map(Number);
    const [h, mi] = fx.input.time.split(':').map(Number);
    const c = computeChart({ year: y, month: mo, day: d, hour: h, minute: mi, tz: fx.input.tz });
    assert.equal(c.type, fx.expected.type, '類型');
    assert.equal(c.authority, fx.expected.authority, '內在權威');
    assert.equal(c.profile, fx.expected.profile, '人生角色');
    assert.equal(c.definition, fx.expected.definition, '定義');
    assert.equal(c.crossAngle, fx.expected.crossAngle, '交叉角度');
    assert.deepEqual(c.crossGates, fx.expected.crossGates, '輪迴交叉四門');
  });
}
