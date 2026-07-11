// geometry.test.mjs — bodygraph 幾何不變式與渲染器煙霧測試。
// 守住「移植自參考端 bodygraph.py 的弧線幾何」結構正確性：36 通道路徑、64 閘門錨點、
// 9 中心形狀、半段切分公式，以及字串渲染器（report/gold 雙皮膚）能產出合法 SVG。
// 不依賴 astronomy vendor（renderBodygraphSvg 直接吃 chart 物件，不經引擎）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  VIEWBOX, CENTER_SHAPES, GATE_ANCHORS, CENTER_DRAW_ORDER, CENTER_LABEL_POS,
  CHANNEL_PATHS, OUTSIDE_LABELS, channelFullD, channelHalfDs,
} from '../../assets/js/human-design/hd-geometry.js';
import { CHANNELS } from '../../assets/js/human-design/hd-data-channels.js';
import { CENTERS } from '../../assets/js/human-design/hd-data-centers.js';
import { renderBodygraphSvg, THEMES } from '../../assets/js/human-design/hd-svg-string.js';

test('VIEWBOX 為 0 20 600 700（直線格陣範式，中軸 x=300）', () => {
  assert.deepEqual(VIEWBOX, { minX: 0, minY: 20, w: 600, h: 700 });
});

test('36 通道路徑與 CHANNELS 一一對應、鍵＝「小-大」', () => {
  assert.equal(CHANNELS.length, 36);
  assert.equal(Object.keys(CHANNEL_PATHS).length, 36);
  for (const ch of CHANNELS) {
    const [a, b] = ch.gates;
    assert.ok(a < b, `${ch.id} gates 應為小到大`);
    assert.equal(ch.id, `${a}-${b}`, `${ch.id} id 應為「小-大」`);
    const p = CHANNEL_PATHS[ch.id];
    assert.ok(p, `通道 ${ch.id} 缺少幾何路徑`);
    assert.ok(p.t === 'L' || p.t === 'Q', `${ch.id} 類型須為 L 或 Q`);
    assert.equal(p.s.length, 2);
    assert.equal(p.e.length, 2);
    if (p.t === 'Q') assert.equal(p.c.length, 2, `${ch.id} 弧線缺控制點`);
  }
  // 無多餘路徑鍵
  const ids = new Set(CHANNELS.map((c) => c.id));
  for (const k of Object.keys(CHANNEL_PATHS)) assert.ok(ids.has(k), `多餘路徑鍵 ${k}`);
});

test('64 閘門錨點齊備，且每條通道兩端皆有錨點', () => {
  const allGates = new Set(Object.values(CENTERS).flatMap((c) => c.gates));
  assert.equal(allGates.size, 64, '中心閘門歸屬總和應為 64');
  assert.equal(Object.keys(GATE_ANCHORS).length, 64, '錨點數應為 64');
  for (const g of allGates) assert.ok(GATE_ANCHORS[g], `閘門 ${g} 缺錨點`);
  for (const ch of CHANNELS) for (const g of ch.gates) {
    assert.ok(GATE_ANCHORS[g], `通道 ${ch.id} 端點 ${g} 缺錨點`);
  }
});

test('9 中心形狀／標籤齊備；外側標籤為合法中心 id', () => {
  for (const id of CENTER_DRAW_ORDER) {
    const s = CENTER_SHAPES[id];
    assert.ok(s, `中心 ${id} 缺形狀`);
    if (s.kind === 'rect') {
      for (const k of ['x', 'y', 'w', 'h']) assert.equal(typeof s[k], 'number', `${id}.${k}`);
    } else {
      assert.ok(Array.isArray(s.points) && s.points.length >= 3, `${id} 多邊形頂點不足`);
    }
    assert.ok(Array.isArray(CENTER_LABEL_POS[id]), `中心 ${id} 缺標籤位置`);
  }
  assert.deepEqual([...CENTER_DRAW_ORDER].sort(), Object.keys(CENTERS).sort());
  for (const id of OUTSIDE_LABELS) assert.ok(CENTER_DRAW_ORDER.includes(id), `外側標籤 ${id} 非合法中心`);
});

test('channelFullD / channelHalfDs 產出合法 path d', () => {
  const line = CHANNEL_PATHS['1-8'];   // L
  const arc = CHANNEL_PATHS['26-44'];  // Q（繞過 G 下尖的弧線；整合 10-34 已改直線）
  assert.match(channelFullD(line), /^M[\d.,-]+ L[\d.,-]+$/);
  assert.match(channelFullD(arc), /^M[\d.,-]+ Q[\d.,-]+ [\d.,-]+$/);
  // 直線半段：兩段在中點相接
  const [h0, h1] = channelHalfDs(line);
  const mid = [(line.s[0] + line.e[0]) / 2, (line.s[1] + line.e[1]) / 2];
  assert.ok(h0.includes(`L${mid[0]},${mid[1]}`), '直線前半應止於中點');
  assert.ok(h1.startsWith(`M${mid[0]},${mid[1]}`), '直線後半應始於中點');
  // 弧線半段：兩段皆為 Q，且後半起點＝前半終點
  const [a0, a1] = channelHalfDs(arc);
  assert.match(a0, /^M.+ Q.+ .+$/);
  assert.match(a1, /^M.+ Q.+ .+$/);
  const a0End = a0.split(' ').pop();
  assert.ok(a1.startsWith(`M${a0End}`), '弧線兩半段應在切點相接');
});

test('renderBodygraphSvg 兩種皮膚皆產出合法 SVG（含正確 viewBox 與著色）', () => {
  // 最小 chart：薦骨 10-34 雙激活（both）＋設計懸掛閘門 17
  const chart = {
    gateActivations: { 10: { p: true, d: true }, 34: { p: true, d: false }, 17: { p: false, d: true } },
    definedCenters: ['g', 'sacral'],
  };
  for (const theme of ['report', 'gold']) {
    const svg = renderBodygraphSvg(chart, { theme });
    assert.match(svg, /^<svg /, `${theme} 應以 <svg 開頭`);
    assert.ok(svg.includes('viewBox="0 20 600 700"'), `${theme} viewBox 錯誤`);
    assert.ok(svg.trim().endsWith('</svg>'), `${theme} 未正確收尾`);
    // 36 條底層通道弧線（未啟動通道調細至 3.5，與啟動半段 7.5 拉開對比）
    assert.equal((svg.match(/stroke-width="3.5"/g) || []).length, 36, `${theme} 底層通道應 36 條`);
    // 啟動半段（7.5）至少出現（10/34/17 各有半段）
    assert.ok((svg.match(/stroke-width="7.5"/g) || []).length >= 3, `${theme} 缺啟動半段`);
    // 定義中心填色（report 用 CENTER_FILL、gold 用品牌金）
    const sacralFill = theme === 'report' ? THEMES.report.centerColors.sacral[0] : THEMES.gold.defined[0];
    assert.ok(svg.includes(sacralFill), `${theme} 薦骨定義填色 ${sacralFill} 未出現`);
  }
});
