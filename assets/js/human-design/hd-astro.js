// hd-astro.js — 天文計算層（astronomy-engine adapter）
// 所有黃經皆為地心視黃經、true ecliptic of date（與占星/人類圖慣用座標一致）。
// 時間一律以 UTC milliseconds（number）進出本層，內部才轉 AstroTime。
//
// vendor：assets/vendor/astronomy-engine/astronomy.browser.min.js（UMD，掛 global `Astronomy`）。
// Node 測試經 _injectAstronomy() 注入同一份檔案（createRequire 載入）。

let A = null;

export function _injectAstronomy(lib) {
  A = lib;
}

function astro() {
  if (!A) A = globalThis.Astronomy;
  if (!A) throw new HdError('ASTRO_MISSING', '天文計算函式庫未載入，請重新整理頁面再試。');
  return A;
}

export class HdError extends Error {
  constructor(code, messageZh) {
    super(messageZh);
    this.code = code;
  }
}

function norm360(deg) {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

// 包裝到 (-180, 180]，用於黃經差比較與二分搜索
function wrapPM180(deg) {
  let x = norm360(deg);
  if (x > 180) x -= 360;
  return x;
}

// ---- 13 天體黃經 -------------------------------------------------------

const BODY_CALLS = [
  // [id, 計算方式]
  ['mercury', 'Mercury'],
  ['venus', 'Venus'],
  ['mars', 'Mars'],
  ['jupiter', 'Jupiter'],
  ['saturn', 'Saturn'],
  ['uranus', 'Uranus'],
  ['neptune', 'Neptune'],
  ['pluto', 'Pluto'],
];

export const PLANET_IDS = [
  'sun', 'earth', 'moon', 'northNode', 'southNode',
  'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
];

export function sunLonAt(utcMs) {
  const Ast = astro();
  return norm360(Ast.SunPosition(Ast.MakeTime(new Date(utcMs))).elon);
}

// 月球密切升交點（osculating node）黃經 — 與 Swiss Ephemeris TRUE_NODE 同定義。
// 作法：月球地心 state vector（EQJ）旋轉到 true ecliptic of date，
// 軌道角動量 h = r × v，升交點方向 n = ẑ × h = (−hy, hx, 0)。
export function trueNodeLonAt(utcMs) {
  const Ast = astro();
  const t = Ast.MakeTime(new Date(utcMs));
  const st = Ast.GeoMoonState(t);
  const rot = Ast.Rotation_EQJ_ECT(t);
  const s = Ast.RotateState(rot, st);
  const hx = s.y * s.vz - s.z * s.vy;
  const hy = s.z * s.vx - s.x * s.vz;
  return norm360(Math.atan2(hx, -hy) * 180 / Math.PI);
}

// Meeus 平均升交點（mean node）— 備援模式（golden 比對若顯示參考站採 mean node 時切換）
export function meanNodeLonAt(utcMs) {
  const Ast = astro();
  const t = Ast.MakeTime(new Date(utcMs));
  const T = t.tt / 36525; // 儒略世紀（TT，自 J2000.0）
  const omega = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T
    + T * T * T / 467441 - T * T * T * T / 60616000;
  return norm360(omega);
}

// 13 天體黃經一次算齊 → { sun: deg, earth: deg, ... }
export function positionsAt(utcMs, nodeMode = 'true') {
  const Ast = astro();
  const t = Ast.MakeTime(new Date(utcMs));
  const out = {};
  out.sun = norm360(Ast.SunPosition(t).elon);
  out.earth = norm360(out.sun + 180);
  out.moon = norm360(Ast.EclipticGeoMoon(t).lon);
  out.northNode = nodeMode === 'mean' ? meanNodeLonAt(utcMs) : trueNodeLonAt(utcMs);
  out.southNode = norm360(out.northNode + 180);
  for (const [id, bodyName] of BODY_CALLS) {
    const vec = Ast.GeoVector(Ast.Body[bodyName], t, true); // aberration=true → 視位置
    out[id] = norm360(Ast.Ecliptic(vec).elon);
  }
  return out;
}

// ---- Design 時刻：出生前太陽黃經回退 88° ------------------------------

const DAY_MS = 86400000;

export function designTimeMs(birthUtcMs) {
  const Ast = astro();
  const target = norm360(sunLonAt(birthUtcMs) - 88);
  // 太陽視速度 0.9533–1.0197°/日 → Design 時刻必在出生前 86.2–92.4 天
  const t = Ast.SearchSunLongitude(target, new Date(birthUtcMs - 94 * DAY_MS), 10);
  let resultMs;
  if (t) {
    resultMs = t.date.getTime();
  } else {
    // 備援：二分搜索（g(t) = wrap±180(sunLon(t) − target) 在區間內嚴格遞增）
    let lo = birthUtcMs - 95 * DAY_MS;
    let hi = birthUtcMs - 83 * DAY_MS;
    if (wrapPM180(sunLonAt(lo) - target) > 0 || wrapPM180(sunLonAt(hi) - target) < 0) {
      throw new HdError('DESIGN_SEARCH_FAILED', '無法求解設計時刻，請確認出生日期是否在 1900–2100 年範圍內。');
    }
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (wrapPM180(sunLonAt(mid) - target) < 0) lo = mid; else hi = mid;
    }
    resultMs = (lo + hi) / 2;
  }
  const err = Math.abs(wrapPM180(sunLonAt(resultMs) - target));
  if (err > 1e-3) {
    throw new HdError('DESIGN_SEARCH_FAILED', '設計時刻求解精度不足，請稍後再試。');
  }
  return resultMs;
}
