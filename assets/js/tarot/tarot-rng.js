// tarot-rng.js — 密碼學等級亂數的相容層（實作已上移至 core/core-rng.js）。
// 塔羅端（tarot-draw）沿用本檔 import 路徑不變；核心實作與易經（iching-cast）共用同一份。
export { secureRandomInt, secureBool, secureShuffle } from '../core/core-rng.js';
