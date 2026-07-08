// core-astro.js — 共用天文計算層（真家；星座命盤／八字節氣／奇門局／人類圖共用）。
//
// 所有黃經皆為地心視黃經、true ecliptic of date（與占星／人類圖慣用座標一致）。
// 時間一律以 UTC milliseconds（number）進出本層，內部才轉 AstroTime。
// vendor：assets/vendor/astronomy-engine/astronomy.browser.min.js（UMD，掛 global `Astronomy`）；
// Node 測試經 _injectAstronomy() 注入同一份檔案（createRequire 載入）。
// human-design/hd-astro.js 為薄相容層（re-export 本檔）＋保留 HD 專屬的 designTimeMs（88° design arc）。

export class HdError extends Error {
  constructor(code, messageZh) {
    super(messageZh);
    this.code = code;
  }
}

let A = null;

// 測試注入單點（瀏覽器端靠 global Astronomy，載入時即可用，不需呼叫）。
export function _injectAstronomy(lib) {
  A = lib;
}

export function astro() {
  if (!A) A = globalThis.Astronomy;
  if (!A) throw new HdError('ASTRO_MISSING', '天文計算函式庫未載入，請重新整理頁面再試。');
  return A;
}

export function norm360(deg) {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

// 包裝到 (-180, 180]，用於黃經差比較與二分搜索
export function wrapPM180(deg) {
  const x = norm360(deg);
  return x > 180 ? x - 360 : x;
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

// ---- 星座／八字宮位所需的座標工具 -------------------------------------

// 真黃赤交角（度）。用 Meeus 平均黃赤交角（誤差 <0.01°，在 golden ASC/MC ±0.5° 容差內；
// 不依賴 vendor 內部 e_tilt API，跨版本穩定）。T = 儒略世紀（TT，自 J2000.0）。
export function obliquityDeg(utcMs) {
  const Ast = astro();
  const t = Ast.MakeTime(new Date(utcMs));
  const T = t.tt / 36525;
  return 23.4392911 - 0.0130041667 * T - 1.63889e-7 * T * T + 5.03611e-7 * T * T * T;
}

// 格林威治視恆星時（度）。astronomy-engine SiderealTime 回「小時」→ ×15 轉度。
export function gastDeg(utcMs) {
  const Ast = astro();
  const t = Ast.MakeTime(new Date(utcMs));
  return norm360(Ast.SiderealTime(t) * 15);
}

// 太陽到達指定黃經（度）的時刻搜尋——八字節氣（立春 315°、十二節）與未來奇門局共用。
// 薄封裝 vendor SearchSunLongitude（回 AstroTime|null）：自 startUtcMs 起 limitDays 天內
// 找太陽視黃經 = targetLon 的時刻，回 UTC ms；找不到（區間內無此事件）回 null。
// 太陽日行約 0.985–1.02°，每個節氣事件相隔約 30 天，limitDays 預設 40 足以涵蓋單一事件。
export function searchSunLongitude(targetLon, startUtcMs, limitDays = 40) {
  const Ast = astro();
  const t = Ast.SearchSunLongitude(norm360(targetLon), new Date(startUtcMs), limitDays);
  return t ? t.date.getTime() : null;
}
