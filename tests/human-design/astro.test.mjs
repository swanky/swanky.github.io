// astro.test.mjs — 天文層校驗：太陽黃經（分至點）、交點、Design 不變量
import { test } from 'node:test';
import assert from 'node:assert/strict';
import './_setup.mjs';
import { Astronomy } from './_setup.mjs';
import {
  sunLonAt, trueNodeLonAt, meanNodeLonAt, positionsAt, designTimeMs, PLANET_IDS,
} from '../../assets/js/human-design/hd-astro.js';

const DAY_MS = 86400000;

function angleDiff(a, b) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

test('太陽黃經：公開分至點時刻（±0.005° ≈ 時刻 ±7 分鐘）', () => {
  const cases = [
    [Date.UTC(2020, 2, 20, 3, 50), 0],     // 2020 春分 03:49:36 UTC
    [Date.UTC(2020, 5, 20, 21, 44), 90],   // 2020 夏至 21:43:40 UTC
    [Date.UTC(2020, 11, 21, 10, 2), 270],  // 2020 冬至 10:02:19 UTC
    [Date.UTC(2000, 2, 20, 7, 35), 0],     // 2000 春分 07:35 UTC
  ];
  for (const [ms, expected] of cases) {
    const lon = sunLonAt(ms);
    assert.ok(angleDiff(lon, expected) < 0.005,
      `${new Date(ms).toISOString()} 太陽黃經應 ≈${expected}°，得到 ${lon.toFixed(4)}°`);
  }
});

test('Meeus 平均交點：J2000.0 ≈ 125.04°', () => {
  // J2000.0 = 2000-01-01 12:00 TT ≈ 11:58:56 UTC
  const lon = meanNodeLonAt(Date.UTC(2000, 0, 1, 11, 59));
  assert.ok(angleDiff(lon, 125.0445) < 0.01, `得到 ${lon.toFixed(4)}°`);
});

test('密切交點 vs 平均交點：差距 < 1.8°（震盪範圍性質）', () => {
  for (const ms of [Date.UTC(1975, 3, 10), Date.UTC(1990, 7, 1), Date.UTC(2020, 0, 15)]) {
    const d = angleDiff(trueNodeLonAt(ms), meanNodeLonAt(ms));
    assert.ok(d < 1.8, `${new Date(ms).toISOString()} true/mean node 差 ${d.toFixed(3)}°`);
  }
});

test('自洽：月球過升交點時刻，月亮黃經 ≈ 密切交點黃經', () => {
  // 在交點穿越時刻，月球恰位於軌道面與黃道的交線上
  let node = Astronomy.SearchMoonNode(new Date(Date.UTC(2021, 0, 1)));
  for (let i = 0; i < 4; i++) {
    const ms = node.time.date.getTime();
    const moonLon = Astronomy.EclipticGeoMoon(node.time).lon;
    const expected = node.kind === 1 ? trueNodeLonAt(ms) : (trueNodeLonAt(ms) + 180) % 360;
    assert.ok(angleDiff(moonLon, expected) < 0.05,
      `交點時刻 ${node.time.date.toISOString()}（kind=${node.kind}）月亮黃經 ${moonLon.toFixed(4)} vs 交點 ${expected.toFixed(4)}`);
    node = Astronomy.NextMoonNode(node);
  }
});

test('Design 不變量：太陽弧 88°、間隔 86–93 天', () => {
  const births = [
    Date.UTC(1975, 3, 1, 4, 30), Date.UTC(1986, 2, 15, 6, 30),
    Date.UTC(2000, 11, 31, 16, 0), Date.UTC(2024, 6, 10, 2, 15),
  ];
  for (const birth of births) {
    const design = designTimeMs(birth);
    const arc = (sunLonAt(birth) - sunLonAt(design) + 360) % 360;
    assert.ok(Math.abs(arc - 88) < 1e-3, `太陽弧 ${arc.toFixed(6)}°`);
    const days = (birth - design) / DAY_MS;
    assert.ok(days > 86 && days < 93, `間隔 ${days.toFixed(2)} 天`);
  }
});

test('positionsAt 回傳 13 天體、Earth/SouthNode 對沖', () => {
  const pos = positionsAt(Date.UTC(1990, 5, 15, 12, 0));
  assert.deepEqual(Object.keys(pos).sort(), [...PLANET_IDS].sort());
  assert.ok(angleDiff(pos.earth, (pos.sun + 180) % 360) < 1e-9);
  assert.ok(angleDiff(pos.southNode, (pos.northNode + 180) % 360) < 1e-9);
  for (const id of PLANET_IDS) {
    assert.ok(pos[id] >= 0 && pos[id] < 360, `${id} 黃經 ${pos[id]} 超出範圍`);
  }
});
