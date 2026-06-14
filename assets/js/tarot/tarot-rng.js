// tarot-rng.js — 密碼學等級亂數（瀏覽器原生 crypto.getRandomValues）。
// 用於洗牌與正逆位：公平、不可預測、零相依。Node 18+ 亦原生支援 globalThis.crypto。
// 與人類圖 hd-astro.js 的「底層純計算」同地位：零 DOM、可 Node 單元測試。
const CRYPTO = (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues)
  ? globalThis.crypto : null;

// 回傳 [0, maxExclusive) 的均勻整數。用拒絕取樣消除模偏差，確保洗牌真正公平。
export function secureRandomInt(maxExclusive) {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error('secureRandomInt: maxExclusive 必須是正整數');
  }
  if (maxExclusive === 1) return 0;
  if (!CRYPTO) {
    // 極端後備（所有目標瀏覽器與 Node 18+ 皆有 crypto，理論上不會走到）
    return Math.floor(Math.random() * maxExclusive);
  }
  const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
  const buf = new Uint32Array(1);
  let x;
  do { CRYPTO.getRandomValues(buf); x = buf[0]; } while (x >= limit);
  return x % maxExclusive;
}

// 公平的銅板：決定一張牌正位或逆位。
export function secureBool() { return secureRandomInt(2) === 1; }

// Fisher-Yates 洗牌（回傳新陣列，不就地修改輸入）。
export function secureShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
