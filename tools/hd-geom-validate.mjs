// hd-geom-validate.mjs — 重排後的結構健全性檢查：通道是否穿過非端點中心、閘門圓是否重疊。
import { GATE_ANCHORS, CHANNEL_VIA, CENTER_SHAPES } from '../assets/js/human-design/hd-geometry.js';
import { CHANNELS } from '../assets/js/human-design/hd-data-channels.js';
import { CENTERS } from '../assets/js/human-design/hd-data-centers.js';

const A = GATE_ANCHORS;
const inRect = (p, r) => p[0] >= r.x && p[0] <= r.x + r.w && p[1] >= r.y && p[1] <= r.y + r.h;
const inPoly = (p, pts) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1]; if (((yi > p[1]) !== (yj > p[1])) && (p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi)) c = !c; } return c; };
const inShape = (id, p) => { const s = CENTER_SHAPES[id]; return s.kind === 'rect' ? inRect(p, s) : inPoly(p, s.points); };

// 1) 通道穿過非端點中心
const cross = [];
for (const ch of CHANNELS) {
  const a = A[ch.gates[0]], b = A[ch.gates[1]], v = CHANNEL_VIA[ch.id];
  const segs = v ? [[a, v], [v, b]] : [[a, b]];
  const others = Object.keys(CENTER_SHAPES).filter((id) => !ch.centers.includes(id));
  let n = 0, tot = 0;
  for (const [s, e] of segs) for (let t = 0.06; t <= 0.94; t += 0.02) { tot++; const p = [s[0] + (e[0] - s[0]) * t, s[1] + (e[1] - s[1]) * t]; for (const id of others) if (inShape(id, p)) n++; }
  if (n > 0) cross.push(`${ch.id} 穿過中心 ${[...new Set(segs.flatMap(([s,e])=>{const r=[];for(let t=0.06;t<=0.94;t+=0.02){const p=[s[0]+(e[0]-s[0])*t,s[1]+(e[1]-s[1])*t];for(const id of Object.keys(CENTER_SHAPES))if(!ch.centers.includes(id)&&inShape(id,p))r.push(id);}return r;}))].join(',')} (${Math.round(100*n/tot)}%)`);
}

// 2) 閘門圓重疊（圓心距 < 18，r=10）
const ids = Object.keys(A);
const near = [];
for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
  const d = Math.hypot(A[ids[i]][0] - A[ids[j]][0], A[ids[i]][1] - A[ids[j]][1]);
  if (d < 18) near.push(`${ids[i]}-${ids[j]} (${Math.round(d)})`);
}

// 3) 閘門是否落在其所屬中心內（浮空檢查）—— 僅資訊參考
const GATE_CENTER = {};
for (const [cid, c] of Object.entries(CENTERS)) for (const g of c.gates) GATE_CENTER[g] = cid;
const floating = [];
for (const g of ids) { const cid = GATE_CENTER[g]; if (cid && !inShape(cid, A[g])) floating.push(`${g}@${cid}`); }

console.log('通道穿過非端點中心：', cross.length ? cross : '無 ✓');
console.log('閘門過近(<18)：', near.length ? near : '無 ✓');
console.log('閘門落在中心外(浮空,僅參考)：', floating.length, floating.length ? floating.join(' ') : '');
