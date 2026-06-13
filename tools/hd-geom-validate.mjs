// hd-geom-validate.mjs — 弧線幾何的結構健全性檢查：
// 通道（沿實際弧線取樣）是否穿過非端點中心、閘門圓是否重疊、閘門是否浮空於所屬中心外。
// 執行：node tools/hd-geom-validate.mjs
import { GATE_ANCHORS, CHANNEL_PATHS, CENTER_SHAPES } from '../assets/js/human-design/hd-geometry.js';
import { CHANNELS } from '../assets/js/human-design/hd-data-channels.js';
import { CENTERS } from '../assets/js/human-design/hd-data-centers.js';

const A = GATE_ANCHORS;
const inRect = (p, r) => p[0] >= r.x && p[0] <= r.x + r.w && p[1] >= r.y && p[1] <= r.y + r.h;
const inPoly = (p, pts) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1]; if (((yi > p[1]) !== (yj > p[1])) && (p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi)) c = !c; } return c; };
const inShape = (id, p) => { const s = CENTER_SHAPES[id]; return s.kind === 'rect' ? inRect(p, s) : inPoly(p, s.points); };

// 沿通道路徑取樣（直線 2 點、貝茲 De Casteljau 取 N 點）
function samplePath(p, n = 48) {
  const out = [];
  if (p.t === 'L') {
    for (let i = 0; i <= n; i++) { const t = i / n; out.push([p.s[0] + (p.e[0] - p.s[0]) * t, p.s[1] + (p.e[1] - p.s[1]) * t]); }
  } else {
    for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; out.push([u * u * p.s[0] + 2 * u * t * p.c[0] + t * t * p.e[0], u * u * p.s[1] + 2 * u * t * p.c[1] + t * t * p.e[1]]); }
  }
  return out;
}

// 1) 通道穿過非端點中心（沿弧線取樣，掐頭去尾避免端點落在自身中心邊緣）
const cross = [];
for (const ch of CHANNELS) {
  const p = CHANNEL_PATHS[ch.id];
  if (!p) { cross.push(`${ch.id} 缺路徑定義 ✗`); continue; }
  const others = Object.keys(CENTER_SHAPES).filter((id) => !ch.centers.includes(id));
  const pts = samplePath(p);
  const hit = new Set();
  let n = 0;
  for (let i = 3; i < pts.length - 3; i++) for (const id of others) if (inShape(id, pts[i])) { hit.add(id); n++; }
  if (hit.size) cross.push(`${ch.id} 穿過 ${[...hit].join(',')} (${Math.round(100 * n / (pts.length - 6))}%)`);
}

// 2) 閘門圓重疊（r=8 → 圓心距 < 16 視為重疊；< 17 視為偏近）
const ids = Object.keys(A);
const overlap = [];
const tight = [];
for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
  const d = Math.hypot(A[ids[i]][0] - A[ids[j]][0], A[ids[i]][1] - A[ids[j]][1]);
  if (d < 16) overlap.push(`${ids[i]}-${ids[j]} (${d.toFixed(1)})`);
  else if (d < 17) tight.push(`${ids[i]}-${ids[j]} (${d.toFixed(1)})`);
}

// 3) 閘門是否落在其所屬中心內（浮空檢查）—— 僅資訊參考
const GATE_CENTER = {};
for (const [cid, c] of Object.entries(CENTERS)) for (const g of c.gates) GATE_CENTER[g] = cid;
const floating = [];
for (const g of ids) { const cid = GATE_CENTER[g]; if (cid && !inShape(cid, A[g])) floating.push(`${g}@${cid}`); }

console.log('通道穿過非端點中心：', cross.length ? cross : '無 ✓');
console.log('閘門圓重疊(<16)：', overlap.length ? overlap : '無 ✓');
console.log('閘門偏近(16~17)：', tight.length ? tight : '無');
console.log('閘門落在中心外(浮空,僅參考)：', floating.length, floating.length ? floating.join(' ') : '');
