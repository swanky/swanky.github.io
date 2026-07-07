// numerology-core.js — 生命靈數核心算術（DOM-free，可完全自驗）。
//
// 算法（現代數字學主流：分段化約再相加，主數不拆）：
//   reduceToDigit(n)：反覆將各位數字相加，直到 ≤9 或落在主數 {11,22,33}。
//   lifePathNumber(y,mo,d)：年、月、日各自化約（主數保留）後相加，再化約一次。
//   birthdayNumber(d)：出生「日」化約——作為天賦傾向的輔助數。
// 誠實：數字學無科學命定效力；本工具把數字當「自我觀察的起點」，不預測吉凶、不斷命定。
// 不同流派化約規則略有差異（如年份是否於中途停在主數）；本引擎規則已於頁面「方法說明」寫明並保持一致。

export const MASTER_NUMBERS = [11, 22, 33];

function digitSum(n) {
  let s = 0;
  n = Math.abs(n);
  while (n > 0) { s += n % 10; n = Math.floor(n / 10); }
  return s;
}

// 反覆化約至個位；遇主數（11/22/33）即停。
export function reduceToDigit(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error('reduceToDigit 需要非負整數');
  while (n > 9 && !MASTER_NUMBERS.includes(n)) n = digitSum(n);
  return n;
}

// 生命靈數：年、月、日各自化約後相加，再化約一次（主數不拆）。
export function lifePathNumber(y, mo, d) {
  for (const v of [y, mo, d]) {
    if (!Number.isInteger(v) || v <= 0) throw new Error('生日需為正整數的 年/月/日');
  }
  if (mo > 12 || d > 31) throw new Error('月或日超出合理範圍');
  return reduceToDigit(reduceToDigit(y) + reduceToDigit(mo) + reduceToDigit(d));
}

// 生日數（天賦傾向）：出生「日」化約。
export function birthdayNumber(d) {
  if (!Number.isInteger(d) || d <= 0 || d > 31) throw new Error('日需為 1..31');
  return reduceToDigit(d);
}

// 一次算出整組結果。
export function computeNumerology({ y, mo, d }) {
  const lifePath = lifePathNumber(y, mo, d);
  return {
    lifePath,
    birthday: birthdayNumber(d),
    isMaster: MASTER_NUMBERS.includes(lifePath),
  };
}
