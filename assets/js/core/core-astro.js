// core-astro.js — 共用天文計算層（星座命盤／未來八字節氣、奇門局共用）。
//
// Phase 2 策略：re-export 已上線 HD 引擎 hd-astro.js 的通用函式（**不改動 hd-astro，零回歸風險**），
// 另加星座命盤／宮位所需的 helper（norm360／wrapPM180／obliquity／恆星時）。
// 未來把 hd-astro 正式改為 import 本檔（§3.2 Phase 0 重構）列 backlog。
//
// 座標系：地心視黃經、true ecliptic of date（占星慣用），與 HD 一致。
// 時間一律 UTC milliseconds 進出。vendor astronomy-engine 提供 SiderealTime／MakeTime。
import {
  positionsAt, sunLonAt, trueNodeLonAt, meanNodeLonAt,
  _injectAstronomy as _injectHd, PLANET_IDS,
} from '../human-design/hd-astro.js';

export { positionsAt, sunLonAt, trueNodeLonAt, meanNodeLonAt, PLANET_IDS };

let A = null;

// 測試注入：同時餵給本層與 HD 層（瀏覽器端兩者都靠 global Astronomy，不需呼叫）。
export function _injectAstronomy(lib) {
  A = lib;
  _injectHd(lib);
}

function astro() {
  if (!A) A = globalThis.Astronomy;
  if (!A) throw new Error('天文計算函式庫未載入，請重新整理頁面再試。');
  return A;
}

export function norm360(deg) {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

export function wrapPM180(deg) {
  const x = norm360(deg);
  return x > 180 ? x - 360 : x;
}

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
