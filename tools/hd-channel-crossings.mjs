// hd-channel-crossings.mjs — 量測全 36 通道兩兩的視覺交叉（含 via 折線），驅動模板重排。
// 規則：共用同一閘門的兩通道在該閘門相接，不算交叉；其餘為真正的線段交叉。
// 目標模板（站主依標準盤觀察）：只允許整合織紋束 {10-20,10-34,10-57,20-34,20-57,34-57}
// （閘門 10/20/34/57 互連的 K4）互相交叉、以及 26-44。
// 執行：node tools/hd-channel-crossings.mjs
import { CHANNEL_PATHS } from '../assets/js/human-design/hd-geometry.js';
import { CHANNELS } from '../assets/js/human-design/hd-data-channels.js';

const WEAVE = new Set(['10-20', '10-34', '10-57', '20-34', '20-57', '34-57']);
const isExpected = (id1, id2) =>
  (WEAVE.has(id1) && WEAVE.has(id2)) || id1 === '26-44' || id2 === '26-44';

// 通道折線：沿實際路徑取樣（直線 2 點、貝茲弧線取多點近似）
function polyline(ch) {
  const p = CHANNEL_PATHS[ch.id];
  if (!p) return [];
  if (p.t === 'L') return [p.s, p.e];
  const out = [];
  const n = 16;
  for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; out.push([u * u * p.s[0] + 2 * u * t * p.c[0] + t * t * p.e[0], u * u * p.s[1] + 2 * u * t * p.c[1] + t * t * p.e[1]]); }
  return out;
}
function segments(pts) {
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) segs.push([pts[i], pts[i + 1]]);
  return segs;
}
// 嚴格相交（端點接觸不算；用於排除共端點情況前先做共點判斷）
function segInt(p1, p2, p3, p4) {
  const d = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
  return false;
}
function channelsCross(c1, c2) {
  // 共用閘門 → 在該閘門相接，不算交叉
  if (c1.gates.some((g) => c2.gates.includes(g))) return false;
  const s1 = segments(polyline(c1)), s2 = segments(polyline(c2));
  for (const a of s1) for (const b of s2) if (segInt(a[0], a[1], b[0], b[1])) return true;
  return false;
}

const crossings = [];
for (let i = 0; i < CHANNELS.length; i++) {
  for (let j = i + 1; j < CHANNELS.length; j++) {
    if (channelsCross(CHANNELS[i], CHANNELS[j])) {
      crossings.push([CHANNELS[i].id, CHANNELS[j].id]);
    }
  }
}
const unexpected = crossings.filter(([a, b]) => !isExpected(a, b));
const expected = crossings.filter(([a, b]) => isExpected(a, b));

console.log(`總交叉對數：${crossings.length}`);
console.log(`\n預期內（織紋 + 26-44）：${expected.length}`);
expected.forEach(([a, b]) => console.log(`  ✓ ${a} × ${b}`));
console.log(`\n不該交叉（需重排消除）：${unexpected.length}`);
unexpected.forEach(([a, b]) => console.log(`  ✗ ${a} × ${b}`));
