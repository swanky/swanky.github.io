// astro-houses.js — 上升(ASC)／天頂(MC)＋宮位計算。
// 公式照規劃 §5.3；以 golden（vs astro.com）為準，ASC/MC ±0.5° 才可標正式。
// lat φ 北緯正、lon λ 東經正。三角函數用弧度。
import { gastDeg, obliquityDeg, norm360 } from '../core/core-astro.js';

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

// 回 { asc, mc, ramc }（度）。
export function computeAngles(utcMs, lat, lon) {
  const ramc = norm360(gastDeg(utcMs) + lon); // 本地恆星時（度）= GAST + 東經
  const ramcR = ramc * D2R;
  const eps = obliquityDeg(utcMs) * D2R;
  const phi = lat * D2R;

  // MC = atan2(sin RAMC, cos RAMC · cos ε)
  const mc = norm360(Math.atan2(Math.sin(ramcR), Math.cos(ramcR) * Math.cos(eps)) * R2D);

  // ASC = atan2(cos RAMC, −(sin RAMC · cos ε + tan φ · sin ε))
  const asc = norm360(
    Math.atan2(Math.cos(ramcR), -(Math.sin(ramcR) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) * R2D,
  );

  return { asc, mc, ramc };
}

// 12 宮起始黃經（度）。
// Whole Sign（預設）：ASC 所在星座 0° 起，每宮整星座 30°。
// Equal：ASC 度數起，每宮 30°。
export function houseCusps(asc, system = 'whole') {
  const cusps = [];
  const start = system === 'equal' ? norm360(asc) : Math.floor(norm360(asc) / 30) * 30;
  for (let i = 0; i < 12; i++) cusps.push(norm360(start + i * 30));
  return cusps;
}

// 行星落宮（1–12）：lon 落在哪個宮區間 [cusps[i], cusps[i+1])（處理跨 360°）。
export function houseOf(lon, cusps) {
  const L = norm360(lon);
  for (let i = 0; i < 12; i++) {
    const a = cusps[i];
    const b = cusps[(i + 1) % 12];
    const inRange = a < b ? (L >= a && L < b) : (L >= a || L < b);
    if (inRange) return i + 1;
  }
  return 1;
}

// 極地 guard：|φ|>66° 時 ASC/宮位不可靠（規劃 §5.3）。
export function isPolar(lat) {
  return Math.abs(lat) > 66;
}
