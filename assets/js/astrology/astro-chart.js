// astro-chart.js — 星座命盤主計算：{utcMs, lat, lon, houseSystem, withTime} → chart JSON。
// 座標系：地心視黃經、true ecliptic of date（core-astro.positionsAt）。
// 「不確定出生時間」模式（withTime=false）：只出行星星座，不算 ASC/宮位。
import { positionsAt, norm360, wrapPM180 } from '../core/core-astro.js';
import { zonedToUtc } from '../core/core-timezone.js';
import { computeAngles, houseCusps, houseOf, isPolar } from './astro-houses.js';
import { detectAspects } from './astro-aspects.js';

export const SIGNS = ['牡羊', '金牛', '雙子', '巨蟹', '獅子', '處女', '天秤', '天蠍', '射手', '摩羯', '水瓶', '雙魚'];
export const SIGNS_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
export const SIGN_ELEMENT = ['火', '土', '風', '水', '火', '土', '風', '水', '火', '土', '風', '水'];

// 星座命盤採用的點（北交點取代南交；冥王到冥王星）
export const POINT_IDS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'northNode'];
export const POINT_ZH = {
  sun: '太陽', moon: '月亮', mercury: '水星', venus: '金星', mars: '火星',
  jupiter: '木星', saturn: '土星', uranus: '天王星', neptune: '海王星', pluto: '冥王星',
  northNode: '北交點', asc: '上升', mc: '天頂',
};

export function signOf(lon) {
  return Math.floor(norm360(lon) / 30);
}

// 逆行：比較 t 與 t+1 天黃經（日、月、交點不標逆行）。
function isRetro(id, utcMs) {
  if (id === 'sun' || id === 'moon' || id === 'northNode') return false;
  const d0 = positionsAt(utcMs)[id];
  const d1 = positionsAt(utcMs + 86400000)[id];
  return wrapPM180(d1 - d0) < 0;
}

function pointObj(lonDeg, withHouse) {
  const sign = signOf(lonDeg);
  const o = {
    lon: lonDeg,
    sign,
    signZh: SIGNS[sign],
    signEn: SIGNS_EN[sign],
    element: SIGN_ELEMENT[sign],
    degInSign: norm360(lonDeg) % 30,
  };
  return o;
}

// 由出生「牆鐘時刻」直接排盤（對齊 golden 端到端縫，與頁面吃同一條時區→UTC 縫）：
// 內部解時區 → utcMs → 既有 computeChart。zonedToUtc 失敗會拋 HdError（code TZ_*）。
// input: { year, month, day, hour, minute, tz, lat, lon, houseSystem?, noTime? }
export function computeChartFromBirth(input) {
  const { year, month, day, hour, minute, tz, lat, lon, houseSystem = 'whole', noTime = false } = input;
  const { utcMs } = zonedToUtc(year, month, day, hour, minute, tz);
  return computeChart({ utcMs, lat, lon, houseSystem, withTime: !noTime });
}

// input: { utcMs, lat, lon, houseSystem?, withTime? }（internal seam；牆鐘入口見 computeChartFromBirth）
export function computeChart(input) {
  const { utcMs, lat, lon, houseSystem = 'whole', withTime = true } = input;
  const pos = positionsAt(utcMs);

  const points = {};
  for (const id of POINT_IDS) {
    points[id] = pointObj(pos[id], false);
    points[id].retro = isRetro(id, utcMs);
  }

  let angles = null;
  let cusps = null;
  const polar = withTime && typeof lat === 'number' && isPolar(lat);
  const haveTime = withTime && typeof lat === 'number' && typeof lon === 'number' && !polar;

  if (haveTime) {
    angles = computeAngles(utcMs, lat, lon);
    cusps = houseCusps(angles.asc, houseSystem);
    points.asc = pointObj(angles.asc, false);
    points.mc = pointObj(angles.mc, false);
    for (const id of POINT_IDS) points[id].house = houseOf(points[id].lon, cusps);
  }

  const aspectInput = {};
  for (const id of POINT_IDS) aspectInput[id] = { lon: points[id].lon };
  if (angles) {
    aspectInput.asc = { lon: angles.asc };
    aspectInput.mc = { lon: angles.mc };
  }
  const aspects = detectAspects(aspectInput);

  return {
    meta: { utcMs, lat, lon, houseSystem, withTime: haveTime, polar: !!polar },
    points,
    houseCusps: cusps,
    aspects,
  };
}
