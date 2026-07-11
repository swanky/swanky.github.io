// geometry-v2.test.mjs — Phase 6 軌 A：v2 幾何結構斷言（補 spec 第十二節「結構測試」缺口）。
// bodygraph-v2.test.mjs 驗的是 adapter 輸出與 renderer 輸出；本檔直接鎖 hd-geometry-v2.js 這份
// 幾何單一事實來源：恰 9 中心、恰 64 閘門固定座標且不出 viewBox、36 通道端點合法、每閘門恰屬一中心。
// 幾何為 frozen（純消費）；本檔只讀不改。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VIEWBOX2, CENTER_SHAPES2, GATE_ANCHORS2, GATE_TO_CENTER2, CHANNEL_PATHS2 } from '../../assets/js/human-design/hd-geometry-v2.js';
import { CENTER_IDS } from '../../assets/js/human-design/hd-data-centers.js';

test('幾何：恰好 9 中心，鍵集＝CENTER_IDS', () => {
  assert.equal(Object.keys(CENTER_SHAPES2).length, 9);
  assert.deepEqual(Object.keys(CENTER_SHAPES2).sort(), [...CENTER_IDS].sort());
});

test('幾何：恰好 64 閘門固定座標，鍵集＝{1..64}，皆為 [x,y] 數對', () => {
  const keys = Object.keys(GATE_ANCHORS2).map(Number).sort((a, b) => a - b);
  assert.equal(keys.length, 64);
  assert.deepEqual(keys, Array.from({ length: 64 }, (_, i) => i + 1));
  for (const [g, p] of Object.entries(GATE_ANCHORS2)) {
    assert.ok(Array.isArray(p) && p.length === 2 && p.every(Number.isFinite), `閘門 ${g} 座標非法`);
  }
});

test('幾何：64 閘門圓（r15）完整落在 viewBox 內（無超出 spec §12）', () => {
  const R = 15, { minX, minY, w, h } = VIEWBOX2;
  for (const [g, [x, y]] of Object.entries(GATE_ANCHORS2)) {
    assert.ok(x - R >= minX && x + R <= minX + w, `閘門 ${g} x 超出 viewBox`);
    assert.ok(y - R >= minY && y + R <= minY + h, `閘門 ${g} y 超出 viewBox`);
  }
});

test('幾何：36 通道，gateA<gateB 皆 ∈1..64、id＝"小-大"、兩端皆有錨點', () => {
  const chans = Object.values(CHANNEL_PATHS2);
  assert.equal(chans.length, 36);
  const valid = (n) => Number.isInteger(n) && n >= 1 && n <= 64;
  for (const ch of chans) {
    assert.ok(valid(ch.gateA) && valid(ch.gateB), `${ch.id} 端點越界`);
    assert.ok(ch.gateA < ch.gateB, `${ch.id} gateA 應 < gateB`);
    assert.equal(ch.id, `${ch.gateA}-${ch.gateB}`, `${ch.id} id 格式`);
    assert.ok(GATE_ANCHORS2[ch.gateA] && GATE_ANCHORS2[ch.gateB], `${ch.id} 端點缺錨點`);
  }
});

test('幾何：64 閘門恰好分屬一中心（中心 gates 併集＝{1..64}、GATE_TO_CENTER2 全覆蓋）', () => {
  const seen = new Set();
  for (const c of Object.values(CENTER_SHAPES2)) {
    for (const g of c.gates) {
      assert.ok(!seen.has(g), `閘門 ${g} 屬於多個中心`);
      seen.add(g);
    }
  }
  assert.deepEqual([...seen].sort((a, b) => a - b), Array.from({ length: 64 }, (_, i) => i + 1));
  for (let g = 1; g <= 64; g++) assert.ok(GATE_TO_CENTER2[g], `閘門 ${g} 無反查中心`);
});
