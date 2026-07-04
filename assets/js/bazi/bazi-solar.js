// bazi-solar.js — 八字節氣求解（不用農曆庫，全靠太陽黃經）。
//
// 核心決策（§7.2）：換年以立春（黃經 315°）、換月以十二節，全是太陽黃經事件，
// core-astro.searchSunLongitude 直接算（1900–2100）。八字引擎零新依賴。
//
// 純函式：sunLonToMonthZhi 完全確定（可自驗）；lichunOfYear／nextJieMs 需天文引擎
// （瀏覽器靠 global Astronomy，Node 測試經 core-astro._injectAstronomy 注入）。
import { sunLonAt, searchSunLongitude, norm360 } from '../core/core-astro.js';

const DAY_MS = 86400000;

// 十二節黃經（換月節點），從立春起每 30°：立春→寅、驚蟄→卯 …… 小寒→丑
export const JIE_LON = [315, 345, 15, 45, 75, 105, 135, 165, 195, 225, 255, 285];
export const JIE_NAME = ['立春', '驚蟄', '清明', '立夏', '芒種', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];

// 太陽黃經 → 月支序（0=子…11=亥）。寅月自黃經 315° 起，每 30° 進一支。
// [315,345)→寅、[345,15)→卯、[15,45)→辰 …… [285,315)→丑（完全確定，可自驗）。
export function sunLonToMonthZhi(sunLon) {
  const k = Math.floor((((sunLon - 315) % 360 + 360) % 360) / 30); // 0..11
  return (2 + k) % 12; // 2=寅
}

// 太陽黃經 → 所處節氣名（顯示用）
export function sunLonToJieName(sunLon) {
  const k = Math.floor((((sunLon - 315) % 360 + 360) % 360) / 30);
  return JIE_NAME[k];
}

// 某國曆年立春的 UTC 時刻（太陽黃經 315°）。立春約在 2/3–2/5，自 1/20 起搜 30 天。
export function lichunOfYear(gregYear) {
  return searchSunLongitude(315, Date.UTC(gregYear, 0, 20), 30);
}

// 以立春為界的八字年（西元年）。八字年自立春起算：出生時刻在當年立春之後→當年；之前→前一年。
// 用 UTC 曆年判斷自洽：立春恆在 2 月初，距年界（1/1）逾一個月，遠大於任何時區差。
export function baziYearNumber(utcMs) {
  const y = new Date(utcMs).getUTCFullYear();
  const lichun = lichunOfYear(y);
  return (lichun != null && utcMs >= lichun) ? y : y - 1;
}

// 出生時刻「下一個節」的 UTC 時刻（順排大運起運用）。下一節必在約 30 天內。
export function nextJieMs(utcMs) {
  const s = sunLonAt(utcMs);
  const nextLon = norm360(15 + 30 * Math.ceil((s - 15) / 30 + 1e-9));
  return searchSunLongitude(nextLon, utcMs, 40);
}

// 出生時刻「上一個節」的 UTC 時刻（逆排大運起運用）。上一節在過去約 30 天內。
export function prevJieMs(utcMs) {
  const s = sunLonAt(utcMs);
  const prevLon = norm360(15 + 30 * Math.floor((s - 15) / 30 - 1e-9));
  return searchSunLongitude(prevLon, utcMs - 40 * DAY_MS, 45);
}
