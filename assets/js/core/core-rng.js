// core-rng.js — 共用密碼學亂數層（塔羅洗牌／易經起卦共用）。
//
// 薄封裝：re-export 已上線 tarot-rng.js 的密碼學亂數（**不改動 tarot-rng，零回歸**）。
// 未來把 tarot-rng 正式改為 import 本檔列 backlog（同 core-astro 對 hd-astro 的策略）。
export { secureRandomInt, secureBool, secureShuffle } from '../tarot/tarot-rng.js';
