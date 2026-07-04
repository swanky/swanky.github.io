// bazi-pillars.js — 四柱（年月日時）＋大運排算。
//
// 年月柱：吃 utcMs 算太陽黃經（立春換年、十二節換月）；日時柱：吃當地民用時鐘。
// 日柱＝CJDN 純算術（Fliegel–Van Flandern 公式）＋錨點常數；時柱＝五鼠遁。
// 子時規則、真太陽時（進階選項，預設關）皆可切換。
//
// 誠實紅線（§7.3／§7.6）：日柱錨點 DAY_ANCHOR 以公認樣本自洽校準，仍待外部排盤站
// 逐筆 golden 複核；未過 golden，頁面日柱標 beta，不宣稱正式。
import {
  GAN, ZHI, GAN_WUXING, ZHI_WUXING, GAN_YIN, ZHI_HIDDEN, NAYIN,
  ganOf, zhiOf, ganZhiToGz, tigerStartGan, ratStartGan,
} from './bazi-ganzhi.js';
import { sunLonToMonthZhi, sunLonToJieName, baziYearNumber, nextJieMs, prevJieMs } from './bazi-solar.js';
import { sunLonAt } from '../core/core-astro.js';

const DAY_MS = 86400000;

// 日柱錨點：dayGz = (CJDN + DAY_ANCHOR) mod 60（0=甲子）。
// 校準樣本（自洽於 DAY_ANCHOR=49，待 golden 複核）：
//   2000-01-07 = 甲子（gz 0）、1900-01-01 = 甲戌（gz 10）、2000-01-01 = 戊午（gz 54）。
export const DAY_ANCHOR = 49;

// 公曆 → CJDN（Fliegel–Van Flandern，純整數，1900–2100 有效）。回該民用日之 Julian Day Number。
export function gregorianToCJDN(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy
    + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

// CJDN → 日柱干支序（0..59）
export function dayGzFromCJDN(cjdn) {
  return ((cjdn + DAY_ANCHOR) % 60 + 60) % 60;
}

// 均時差（分鐘，視太陽時 − 平太陽時）低精度近似（NOAA/Spencer，誤差 <30 秒，符 §7.3 容差）。
// 純算術、可自驗；只在真太陽時進階選項開啟時使用。
export function equationOfTimeMin(y, mo, d) {
  const n = dayOfYear(y, mo, d);
  const B = 2 * Math.PI * (n - 81) / 364;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

function dayOfYear(y, mo, d) {
  return Math.round((Date.UTC(y, mo - 1, d) - Date.UTC(y, 0, 1)) / DAY_MS) + 1;
}

// 把抽象時鐘 y/mo/d/h/mi 加上校正分鐘（可跨日），回新的 {y,mo,d,h,mi}。
function shiftClock(y, mo, d, h, mi, deltaMin) {
  const dt = new Date(Date.UTC(y, mo - 1, d, h, mi) + Math.round(deltaMin) * 60000);
  return { y: dt.getUTCFullYear(), mo: dt.getUTCMonth() + 1, d: dt.getUTCDate(), h: dt.getUTCHours(), mi: dt.getUTCMinutes() };
}

function makePillar(gz) {
  const g = ganOf(gz), z = zhiOf(gz);
  return {
    gz, gan: g, zhi: z,
    ganName: GAN[g], zhiName: ZHI[z],
    ganWuxing: GAN_WUXING[g], zhiWuxing: ZHI_WUXING[z],
    hidden: ZHI_HIDDEN[z].slice(), // 藏干天干序（本氣起）
    nayin: NAYIN[gz],
  };
}

/**
 * 排四柱＋大運。
 * @param {object} o
 *   y,mo,d,h,mi   當地民用時間（時分在 withTime=false 時忽略）
 *   utcMs         對應 UTC 絕對時刻（年月柱太陽黃經用）
 *   gender        'male'|'female'（大運順逆）
 *   withTime      false → 時柱 null、大運以中午近似（UI 已把 h 設 12）
 *   dayBoundary   'zi23'（預設 23:00 換日）|'late-zi'（晚子時不換日）
 *   trueSolarTime 進階選項，預設 false
 *   lon,tzOffsetMin 真太陽時校正用（trueSolarTime=true 時必填）
 *   luckSteps     大運步數（預設 10）
 */
export function computePillars(o) {
  const {
    y, mo, d, h = 12, mi = 0, utcMs,
    gender = 'male', withTime = true, dayBoundary = 'zi23',
    trueSolarTime = false, lon = null, tzOffsetMin = null, luckSteps = 10,
  } = o;

  // ── 真太陽時校正（進階，預設關）：經度差 4×(lon−標準經線) ＋ 均時差 ──
  let cy = y, cmo = mo, cd = d, ch = h, cmi = mi, corrMin = 0;
  if (trueSolarTime && lon != null && tzOffsetMin != null && withTime) {
    corrMin = 4 * lon - tzOffsetMin + equationOfTimeMin(y, mo, d);
    const s = shiftClock(y, mo, d, h, mi, corrMin);
    cy = s.y; cmo = s.mo; cd = s.d; ch = s.h; cmi = s.mi;
  }

  // ── 年柱：立春換年 ──
  const baziYear = baziYearNumber(utcMs);
  const yearGz = (((baziYear - 4) % 60) + 60) % 60;

  // ── 月柱：月支由太陽黃經、月干由五虎遁 ──
  const sunLon = sunLonAt(utcMs);
  const monthZhi = sunLonToMonthZhi(sunLon);
  const monthOffset = ((monthZhi - 2) % 12 + 12) % 12;       // 距寅的步數
  const monthGan = (tigerStartGan(ganOf(yearGz)) + monthOffset) % 10;
  const monthGz = ganZhiToGz(monthGan, monthZhi);

  // ── 日柱：CJDN＋錨點；子時 23:00 換日 ──
  const hourZhi = Math.floor((ch + 1) / 2) % 12;            // 23→子、0→子、1→丑…
  let dY = cy, dMo = cmo, dD = cd;
  if (dayBoundary === 'zi23' && ch >= 23) {
    const nx = shiftClock(cy, cmo, cd, 0, 0, DAY_MS / 60000); // 進一日
    dY = nx.y; dMo = nx.mo; dD = nx.d;
  }
  const dayGz = dayGzFromCJDN(gregorianToCJDN(dY, dMo, dD));

  // ── 時柱：五鼠遁（子時起干由日干定）──
  let hourGz = null;
  if (withTime) {
    const hourGan = (ratStartGan(ganOf(dayGz)) + hourZhi) % 10;
    hourGz = ganZhiToGz(hourGan, hourZhi);
  }

  const pillars = {
    year: makePillar(yearGz),
    month: makePillar(monthGz),
    day: makePillar(dayGz),
    hour: hourGz == null ? null : makePillar(hourGz),
  };

  // ── 大運 ──
  const luck = computeLuck({ utcMs, yearGan: ganOf(yearGz), gender, monthGz, luckSteps });

  return {
    meta: {
      baziYear, gender, withTime, dayBoundary,
      trueSolarTime: !!(trueSolarTime && corrMin), trueSolarCorrMin: Math.round(corrMin),
      jieName: sunLonToJieName(sunLon), sunLon,
    },
    pillars,
    luck,
  };
}

// 大運：陽年男／陰年女順排，反之逆排；起運＝到鄰節天數÷3（3 天＝1 年）。
function computeLuck({ utcMs, yearGan, gender, monthGz, luckSteps }) {
  const yangYear = !GAN_YIN[yearGan];
  const forward = yangYear === (gender === 'male'); // 陽男順、陰男逆、陽女逆、陰女順
  const boundMs = forward ? nextJieMs(utcMs) : prevJieMs(utcMs);
  let startYears = null, startAge = null, deltaDays = null;
  if (boundMs != null) {
    deltaDays = Math.abs(boundMs - utcMs) / DAY_MS;
    startYears = deltaDays / 3;
    const yrs = Math.floor(startYears);
    startAge = { years: yrs, months: Math.round((startYears - yrs) * 12), decimal: startYears };
  }
  const steps = [];
  const base = startAge ? startAge.years : 0;
  for (let k = 0; k < luckSteps; k++) {
    const gz = ((monthGz + (forward ? 1 : -1) * (k + 1)) % 60 + 60) % 60;
    steps.push({ gz, gan: ganOf(gz), zhi: zhiOf(gz), ganName: GAN[ganOf(gz)], zhiName: ZHI[zhiOf(gz)], startAge: base + 10 * k });
  }
  return { forward, startAge, deltaDays, steps };
}
