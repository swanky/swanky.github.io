// hd-mandala.js — 黃道經度 → Rave Mandala 閘門/爻線映射
// 純函數、零依賴；Node 測試與瀏覽器共用。
//
// Rave Mandala：360° 均分 64 閘門（每閘 5.625°、每爻 0.9375°），
// 起點為 Gate 41 之首（黃經 302° = 水瓶座 2°00'），依黃經遞增排列。
// GATE_ORDER 已以公開星曆錨點交叉驗證：
//   春分點 0° 落 Gate 25（雙魚 28°15' → 牡羊 3°52'30"）、
//   冬至點 270° 落 Gate 10、Gate 60 結束於 302° 接回 Gate 41。

export const START_LON = 302.0; // Gate 41 起點黃經（單一可調常數；golden 測試裁決）
export const GATE_DEG = 5.625;
export const LINE_DEG = 0.9375;

export const GATE_ORDER = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60,
];

export function norm360(deg) {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

// 黃經 → { gate, line, degInGate }
export function lonToGateLine(lon) {
  const x = norm360(lon - START_LON);
  let idx = Math.floor(x / GATE_DEG);
  if (idx > 63) idx = 63; // 浮點保護（x 理論上 < 360）
  const off = x - idx * GATE_DEG;
  let line = Math.floor(off / LINE_DEG) + 1;
  if (line > 6) line = 6;
  return { gate: GATE_ORDER[idx], line, degInGate: off };
}

// 黃經 → 黃道星座與度分（顯示用，例：「水瓶 2°00'」）
const SIGNS_ZH = ['牡羊', '金牛', '雙子', '巨蟹', '獅子', '處女', '天秤', '天蠍', '射手', '摩羯', '水瓶', '雙魚'];

export function lonToZodiac(lon) {
  const x = norm360(lon);
  const signIdx = Math.floor(x / 30);
  const inSign = x - signIdx * 30;
  const deg = Math.floor(inSign);
  const min = Math.round((inSign - deg) * 60);
  // 進位保護：59.6' 四捨五入到 60' 時進到下一度
  if (min === 60) return { sign: SIGNS_ZH[signIdx], deg: deg + 1, min: 0, label: `${SIGNS_ZH[signIdx]} ${deg + 1}°00'` };
  return { sign: SIGNS_ZH[signIdx], deg, min, label: `${SIGNS_ZH[signIdx]} ${deg}°${String(min).padStart(2, '0')}'` };
}
