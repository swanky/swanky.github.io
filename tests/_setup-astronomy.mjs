// _setup-astronomy.mjs — 測試共用 bootstrap：載入 vendor UMD（與瀏覽器完全相同的 bytes），
// 經 core-astro 的單點 _injectAstronomy 注入。三家引擎（人類圖／星座／八字）測試共用同一份，
// 注入源統一為 core-astro（避免經 hd-astro re-export 中轉）。
import { createRequire } from 'node:module';
import { _injectAstronomy } from '../assets/js/core/core-astro.js';

const require = createRequire(import.meta.url);
const Astronomy = require('../assets/vendor/astronomy-engine/astronomy.browser.min.js');

_injectAstronomy(Astronomy);

export { Astronomy };
