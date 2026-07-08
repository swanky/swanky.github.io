// core-timezone.js — 出生地牆鐘時間 → UTC 轉換層（星座／八字／人類圖共用）。
// 主路徑：瀏覽器/Node 內建 Intl.DateTimeFormat（完整 IANA tzdb，含歷史夏令時）。
// 台灣歷史重點：1937-10-01~1945-09-21 採 JST(+9)；1946-1961/1974-1975/1979 有夏令時(+9)。
// 備援鏈：Intl 探針失敗（精簡 ICU 的舊 WebView）→ 台灣內嵌轉換表 → 手動 UTC 偏移。
// human-design/hd-timezone.js 為薄相容層（re-export 本檔）。

import { HdError } from './core-astro.js';

const HOUR_MS = 3600000;

function makeFormatter(tzId) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tzId,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23',
  });
}

// 某 UTC 時刻在 tz 的牆鐘讀數，以「把牆鐘各欄位當 UTC」編碼成 ms（僅供差值比較）
function wallAsUtc(fmt, utcMs) {
  const parts = {};
  for (const p of fmt.formatToParts(new Date(utcMs))) parts[p.type] = p.value;
  return Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour), Number(parts.minute), Number(parts.second),
  );
}

// ---- Intl 可用性探針（模組載入時跑一次）----
// Asia/Taipei：1975-05-01 00:00Z 應為牆鐘 09:00（夏令時 +9）、1990-01-01 00:00Z 應為 08:00。
function probeIntl() {
  try {
    const fmt = makeFormatter('Asia/Taipei');
    return (
      wallAsUtc(fmt, Date.UTC(1975, 4, 1)) === Date.UTC(1975, 4, 1, 9) &&
      wallAsUtc(fmt, Date.UTC(1990, 0, 1)) === Date.UTC(1990, 0, 1, 8)
    );
  } catch {
    return false;
  }
}

export const INTL_TZ_OK = probeIntl();

// ---- 台灣內嵌備援表（自 IANA tzdata asia 檔抄錄）----
// 區間以「當地牆鐘日期」表示：[start, end) 內 UTC+9，其餘 UTC+8（1900 年後）。
const TAIWAN_PLUS9 = [
  ['1937-10-01', '1945-09-21'], // 日治 JST
  ['1946-05-15', '1946-10-01'],
  ['1947-04-15', '1947-11-01'],
  ['1948-05-01', '1948-10-01'], ['1949-05-01', '1949-10-01'],
  ['1950-05-01', '1950-10-01'], ['1951-05-01', '1951-10-01'],
  ['1952-03-01', '1952-11-01'],
  ['1953-04-01', '1953-11-01'], ['1954-04-01', '1954-11-01'],
  ['1955-04-01', '1955-10-01'], ['1956-04-01', '1956-10-01'],
  ['1957-04-01', '1957-10-01'], ['1958-04-01', '1958-10-01'],
  ['1959-04-01', '1959-10-01'],
  ['1960-06-01', '1960-10-01'], ['1961-06-01', '1961-10-01'],
  ['1974-04-01', '1974-10-01'], ['1975-04-01', '1975-10-01'],
  ['1979-07-01', '1979-10-01'],
];

function taiwanFallbackOffsetMin(y, mo, d) {
  const key = `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  for (const [start, end] of TAIWAN_PLUS9) {
    if (key >= start && key < end) return 540;
  }
  return 480;
}

// ---- 主轉換 ----
// 回傳 { utcMs, offsetMin, status: 'ok'|'ambiguous'|'gap'|'fallback', labelZh }
export function zonedToUtc(y, mo, d, h, mi, tzId) {
  if (!INTL_TZ_OK) {
    if (tzId === 'Asia/Taipei') {
      const offsetMin = taiwanFallbackOffsetMin(y, mo, d);
      const utcMs = Date.UTC(y, mo - 1, d, h, mi) - offsetMin * 60000;
      return { utcMs, offsetMin, status: 'fallback', labelZh: offsetLabel(offsetMin, offsetMin === 540) };
    }
    throw new HdError('TZ_UNAVAILABLE', '此裝置缺少歷史時區資料，請改用「手動指定 UTC 偏移」。');
  }

  let fmt;
  try {
    fmt = makeFormatter(tzId);
  } catch {
    throw new HdError('TZ_UNKNOWN', `無法辨識時區「${tzId}」，請改用「手動指定 UTC 偏移」。`);
  }

  const target = Date.UTC(y, mo - 1, d, h, mi);
  let guess = target;
  for (let i = 0; i < 3; i++) {
    const diff = wallAsUtc(fmt, guess) - target;
    if (diff === 0) break;
    guess -= diff;
  }

  if (wallAsUtc(fmt, guess) === target) {
    // 秋季回撥的重複時段：取第一次出現（較早的 UTC 時刻）
    const candidates = [guess];
    if (wallAsUtc(fmt, guess - HOUR_MS) === target) candidates.push(guess - HOUR_MS);
    if (wallAsUtc(fmt, guess + HOUR_MS) === target) candidates.push(guess + HOUR_MS);
    const utcMs = Math.min(...candidates);
    const status = candidates.length > 1 ? 'ambiguous' : 'ok';
    const offsetMin = (target - utcMs) / 60000;
    return { utcMs, offsetMin, status, labelZh: offsetLabel(offsetMin, isDst(fmt, utcMs, offsetMin, y)) };
  }

  // 春季撥快的不存在時段（如台北 1975-04-01 00:30）：採切換後時間（順移慣例）。
  // offsetMin 回報實際採用 UTC 時刻的真實偏移（非輸入牆鐘的名目差值）。
  const candA = guess;
  const diffA = wallAsUtc(fmt, candA) - target;
  const candB = candA - diffA;
  const utcMs = Math.max(candA, candB);
  const offsetMin = (wallAsUtc(fmt, utcMs) - utcMs) / 60000;
  return { utcMs, offsetMin, status: 'gap', labelZh: offsetLabel(offsetMin, true) };
}

// 手動 UTC 偏移路徑（最終備援）
export function zonedToUtcManual(y, mo, d, h, mi, offsetMin) {
  const utcMs = Date.UTC(y, mo - 1, d, h, mi) - offsetMin * 60000;
  return { utcMs, offsetMin, status: 'ok', labelZh: offsetLabel(offsetMin, false) };
}

// 是否為夏令時間：與同年 1/1、7/1 兩個樣本中較小的偏移比較（較小者視為標準時間）
function isDst(fmt, utcMs, offsetMin, year) {
  try {
    const offAt = (ms) => (wallAsUtc(fmt, ms) - ms) / 60000;
    const standard = Math.min(offAt(Date.UTC(year, 0, 1)), offAt(Date.UTC(year, 6, 1)));
    return offsetMin > standard;
  } catch {
    return false;
  }
}

function offsetLabel(offsetMin, dst) {
  const sign = offsetMin < 0 ? '-' : '+';
  const abs = Math.abs(offsetMin);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hh}:${mm}${dst ? '（夏令時間）' : ''}`;
}
