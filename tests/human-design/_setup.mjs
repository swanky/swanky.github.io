// _setup.mjs — 測試共用 bootstrap：載入 vendor UMD（與瀏覽器執行完全相同的 bytes）並注入引擎
import { createRequire } from 'node:module';
import { _injectAstronomy } from '../../assets/js/human-design/hd-astro.js';

const require = createRequire(import.meta.url);
const Astronomy = require('../../assets/vendor/astronomy-engine/astronomy.browser.min.js');

_injectAstronomy(Astronomy);

export { Astronomy };
