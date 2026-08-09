import { test } from 'node:test';
import assert from 'node:assert/strict';
import './_setup.mjs';
import { computeChart, computeChartSamples, computeChartUncertainty } from '../../assets/js/human-design/hd-engine.js';

const INPUT = { year: 1990, month: 5, day: 15, hour: 14, minute: 30, tz: 'Asia/Taipei' };

test('時間誤差以原始輸入為主結果，並檢查完整結構', () => {
  const exact = computeChart(INPUT);
  const result = computeChartUncertainty(INPUT, 60);
  assert.equal(result.samples.length, 3);
  assert.equal(result.primary.birthUtcIso, exact.birthUtcIso);
  assert.equal(result.stability.mode, 'range');
  assert.equal(result.stability.uncertaintyMinutes, 60);
  assert.equal(typeof result.stability.coreStable, 'boolean');
  assert.equal(typeof result.stability.allStable, 'boolean');
  for (const key of ['type', 'authority', 'profile', 'definition', 'definedCenters', 'undefinedCenters',
    'fullyOpenCenters', 'channels', 'cross', 'activations']) {
    assert.equal(typeof result.stability[key].stable, 'boolean', key);
  }
});

test('未知時間模式沿用正午主結果，並提供完整穩定性資訊', () => {
  const result = computeChartSamples(INPUT);
  assert.equal(result.primary.input.hour, 12);
  assert.equal(result.samples.length, 5);
  assert.equal(result.stability.mode, 'day');
  assert.ok(Array.isArray(result.stability.activations.changed));
});

test('時間誤差只接受介面支援的三種範圍', () => {
  assert.throws(() => computeChartUncertainty(INPUT, 10), /15、30 或 60/);
});
