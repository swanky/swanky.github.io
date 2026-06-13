// golden.test.mjs — 端到端：與業界參考站固化案例逐筆比對（防 vendor 升級回歸）
import { test } from 'node:test';
import assert from 'node:assert/strict';
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
