// hd-timezone.js — 出生地牆鐘時間 → UTC 的相容層（實作已上移至 core/core-timezone.js）。
// hd-engine 沿用本檔 import 路徑不變；星座／八字改直接 import core-timezone。
export { zonedToUtc, zonedToUtcManual, INTL_TZ_OK } from '../core/core-timezone.js';
