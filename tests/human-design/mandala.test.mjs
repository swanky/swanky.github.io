// mandala.test.mjs — 曼陀羅映射邊界表 + 資料表交叉一致性
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  GATE_ORDER, START_LON, GATE_DEG, LINE_DEG, lonToGateLine, lonToZodiac,
} from '../../assets/js/human-design/hd-mandala.js';
import { GATES } from '../../assets/js/human-design/hd-data-gates.js';
import { CHANNELS } from '../../assets/js/human-design/hd-data-channels.js';
import { CENTERS, CENTER_IDS } from '../../assets/js/human-design/hd-data-centers.js';

test('GATE_ORDER 是 1..64 的排列', () => {
  assert.equal(GATE_ORDER.length, 64);
  assert.deepEqual([...GATE_ORDER].sort((a, b) => a - b), Array.from({ length: 64 }, (_, i) => i + 1));
});

test('常數一致：64 × 5.625° = 360°，每閘 6 爻', () => {
  assert.equal(GATE_DEG * 64, 360);
  assert.equal(LINE_DEG * 6, GATE_DEG);
});

test('邊界表：閘門與爻線', () => {
  const cases = [
    [302.0, 41, 1],     // Gate 41 起點
    [306.7, 41, 6],     // Gate 41 最後一爻
    [307.624, 41, 6],   // Gate 41 結尾前一瞬
    [307.625, 19, 1],   // Gate 19 起點
    [358.25, 25, 1],    // Gate 25 起點 = 雙魚 28°15'
    [0.0, 25, 2],       // 春分點落在 Gate 25 第 2 爻（公開星曆事實）
    [120.0, 56, 4],     // 獅子座 0°
    [270.0, 10, 2],     // 冬至點落在 Gate 10
    [296.4, 60, 1],     // Gate 60 起點附近
    [301.9999, 60, 6],  // 圓環接回 Gate 41 前一瞬
  ];
  for (const [lon, gate, line] of cases) {
    const r = lonToGateLine(lon);
    assert.equal(r.gate, gate, `lon ${lon} 應為閘門 ${gate}，得到 ${r.gate}`);
    assert.equal(r.line, line, `lon ${lon} 應為第 ${line} 爻，得到 ${r.line}`);
  }
});

test('lonToZodiac 顯示格式', () => {
  assert.equal(lonToZodiac(302.0).label, "水瓶 2°00'");
  assert.equal(lonToZodiac(0).label, "牡羊 0°00'");
  assert.equal(lonToZodiac(358.25).label, "雙魚 28°15'");
});

test('GATES 與 CENTERS 的閘門歸屬互逆一致，總和 64', () => {
  let total = 0;
  const seen = new Set();
  for (const id of CENTER_IDS) {
    for (const g of CENTERS[id].gates) {
      assert.ok(!seen.has(g), `閘門 ${g} 重複歸屬`);
      seen.add(g);
      total++;
      assert.equal(GATES[g].center, id, `閘門 ${g}：GATES 表標 ${GATES[g].center}，CENTERS 表標 ${id}`);
    }
  }
  assert.equal(total, 64);
  assert.equal(Object.keys(GATES).length, 64);
});

test('36 條通道：id 唯一、兩端閘門屬其宣告中心', () => {
  assert.equal(CHANNELS.length, 36);
  const ids = new Set(CHANNELS.map((c) => c.id));
  assert.equal(ids.size, 36);
  for (const c of CHANNELS) {
    assert.equal(c.gates.length, 2);
    assert.equal(c.centers.length, 2);
    assert.equal(GATES[c.gates[0]].center, c.centers[0], `通道 ${c.id} 第一端`);
    assert.equal(GATES[c.gates[1]].center, c.centers[1], `通道 ${c.id} 第二端`);
    assert.equal(c.id, `${c.gates[0]}-${c.gates[1]}`);
  }
});
