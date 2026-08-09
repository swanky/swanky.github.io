// judge.test.mjs — 判定層合成案例：類型／內在權威／定義
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { judge } from '../../assets/js/human-design/hd-judge.js';
import { PLANET_IDS } from '../../assets/js/human-design/hd-astro.js';

// 依序把 gates 指派給 13 天體，不足者重複最後一個（重複激活不會新增通道）。
// 預設爻線 3；可用 lines 指定前幾個天體的爻線。
function mkPositions(gates, lines = []) {
  const out = {};
  PLANET_IDS.forEach((id, i) => {
    const gate = gates[Math.min(i, gates.length - 1)];
    out[id] = { gate, line: lines[i] || 3 };
  });
  return out;
}

// 同一組位置餵 personality 與 design（合成測試只關心激活集合）
const both = (gates) => [mkPositions(gates), mkPositions(gates)];

test('無任何通道 → 反映者／月亮權威／無定義', () => {
  const r = judge(...both([1])); // 單一閘門不成通道
  assert.equal(r.type, 'reflector');
  assert.equal(r.authority, 'lunar');
  assert.equal(r.definition, 'none');
  assert.equal(r.definedCenters.length, 0);
  assert.equal(r.openCenters.length, 9);
  assert.deepEqual(r.undefinedCenters, ['g']);
  assert.equal(r.fullyOpenCenters.length, 8);
  assert.ok(!r.fullyOpenCenters.includes('g'));
});

test('僅 20-34（喉-薦）→ 顯示生產者／薦骨權威', () => {
  const r = judge(...both([20, 34]));
  assert.equal(r.type, 'mg');
  assert.equal(r.authority, 'sacral');
  assert.equal(r.definition, 'single');
  assert.ok(r.motorToThroat);
});

test('僅 2-14（G-薦）→ 純生產者（無 motor 連喉）／薦骨權威', () => {
  const r = judge(...both([2, 14]));
  assert.equal(r.type, 'generator');
  assert.equal(r.authority, 'sacral');
  assert.ok(!r.motorToThroat);
});

test('僅 21-45（心-喉）→ 顯示者／意志力權威', () => {
  const r = judge(...both([21, 45]));
  assert.equal(r.type, 'manifestor');
  assert.equal(r.authority, 'ego');
});

test('僅 35-36（喉-情）→ 顯示者／情緒權威', () => {
  const r = judge(...both([35, 36]));
  assert.equal(r.type, 'manifestor');
  assert.equal(r.authority, 'emotional');
});

test('root 經脾連喉（18-58 + 16-48）→ 顯示者／直覺權威', () => {
  const r = judge(...both([18, 58, 16, 48]));
  assert.equal(r.type, 'manifestor');
  assert.equal(r.authority, 'splenic');
  assert.equal(r.definition, 'single');
});

test('僅 7-31（G-喉）→ 投射者／自我投射權威', () => {
  const r = judge(...both([7, 31]));
  assert.equal(r.type, 'projector');
  assert.equal(r.authority, 'selfProjected');
});

test('僅 24-61（邏-頭）→ 投射者／無內在權威', () => {
  const r = judge(...both([24, 61]));
  assert.equal(r.type, 'projector');
  assert.equal(r.authority, 'mental');
});

test('僅 26-44（心-脾）→ 投射者／直覺權威（脾優先於心）', () => {
  const r = judge(...both([26, 44]));
  assert.equal(r.type, 'projector');
  assert.equal(r.authority, 'splenic');
});

test('3-60 + 47-64 → 二分人，生產者（喉未定義）', () => {
  const r = judge(...both([3, 60, 47, 64]));
  assert.equal(r.definition, 'split');
  assert.equal(r.type, 'generator');
  assert.equal(r.authority, 'sacral');
});

test('3-60 + 47-64 + 12-22 → 三分人，顯示生產者（情緒 motor 連喉）／情緒權威', () => {
  const r = judge(...both([3, 60, 47, 64, 12, 22]));
  assert.equal(r.definition, 'triple');
  assert.equal(r.type, 'mg');
  assert.equal(r.authority, 'emotional');
});

test('3-60 + 47-64 + 12-22 + 26-44 → 四分人', () => {
  const r = judge(...both([3, 60, 47, 64, 12, 22, 26, 44]));
  assert.equal(r.definition, 'quadruple');
});

test('人生角色與輪迴交叉取自兩組太陽／地球', () => {
  const p = mkPositions([13, 7, 1], [3, 5]); // p.sun=gate13 line3, p.earth=gate7 line5
  const d = mkPositions([43, 23, 2], [5, 1]); // d.sun=gate43 line5
  const r = judge(p, d);
  assert.equal(r.profile, '3/5');
  assert.deepEqual(r.crossGates, { pSun: 13, pEarth: 7, dSun: 43, dEarth: 23 });
  assert.equal(r.crossAngle, 'right');
  assert.equal(r.incarnationCross.nameZh, '右角度交叉之人面獅身');
});
