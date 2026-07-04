// iching-cast.js — 三種起卦（銅錢／梅花數字／梅花時間），吃 core-rng（密碼學亂數）。
//
// 銅錢法：每爻三枚銅錢，secureRandomInt(2)×3 之和 → 6..9（老陰6/少陽7/少陰8/老陽9）；
//   老陰(6)、老陽(9)為動爻，變出「之卦」。概率 6:7:8:9 = 1:3:3:1（三枚公平銅板）。
// 梅花數字／時間：確定性起卦（可自驗），依先天八卦數定上下卦、總和定動爻。
import { secureRandomInt } from '../core/core-rng.js';
import { linesToHex, trigramBits } from './iching-hexagrams.js';

// 先天八卦數（乾1兌2離3震4巽5坎6艮7坤8）→ TRIGRAMS index
const XIANTIAN = { 1: 7, 2: 3, 3: 5, 4: 1, 5: 6, 6: 2, 7: 4, 8: 0 };
function xianToIdx(n) { const r = (((n % 8) + 8) % 8) || 8; return XIANTIAN[r]; }

// 時辰序（子=1…亥=12）；23:00 起為子時
function timeZhiIndex(h) { return (Math.floor((h + 1) / 2) % 12) + 1; }

function buildResult(lines, moving, method, extra) {
  const ben = linesToHex(lines);
  const zhiLines = lines.map((l, i) => (moving.includes(i) ? 1 - l : l));
  const zhi = moving.length ? linesToHex(zhiLines) : null;
  return { lines, moving, ben, zhi, method, ...(extra || {}) };
}

// 三枚銅錢法（隨機）
export function castCoins() {
  const lines = [], moving = [], values = [];
  for (let i = 0; i < 6; i++) {
    const v = 6 + secureRandomInt(2) + secureRandomInt(2) + secureRandomInt(2); // 6..9
    values.push(v);
    lines.push(v % 2 === 1 ? 1 : 0);      // 陽奇陰偶
    if (v === 6 || v === 9) moving.push(i); // 老陰/老陽為動爻
  }
  return buildResult(lines, moving, 'coins', { values });
}

// 梅花數字起卦：上卦=n1、下卦=n2、動爻=(n1+n2) 取 6 餘（確定性）
export function castNumbers(n1, n2) {
  const upper = xianToIdx(n1);
  const lower = xianToIdx(n2);
  const mv = ((n1 + n2) % 6) || 6; // 1..6
  const lines = [...trigramBits(lower), ...trigramBits(upper)];
  return buildResult(lines, [mv - 1], 'numbers', { n1, n2 });
}

// 梅花時間起卦：上卦=(年+月+日)、下卦=(年+月+日+時辰序)、動爻=下卦總和取 6 餘（確定性）
export function castTime(y, mo, d, h) {
  const zhi = timeZhiIndex(h);
  const s1 = y + mo + d;
  const s2 = s1 + zhi;
  const upper = xianToIdx(s1);
  const lower = xianToIdx(s2);
  const mv = (s2 % 6) || 6;
  const lines = [...trigramBits(lower), ...trigramBits(upper)];
  return buildResult(lines, [mv - 1], 'time', { timeZhi: zhi });
}
