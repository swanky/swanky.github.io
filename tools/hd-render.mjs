// hd-render.mjs — 用線上工具的引擎＋幾何＋字串繪圖器，把出生資料烤成 bodygraph SVG。
// 與正式頁同一套引擎/幾何/繪圖器，差別只在 Node 端離線輸出（驗證 / 報告產生用途）。
// 用法：node tools/hd-render.mjs [YYYY-MM-DD] [HH:MM] [UTC偏移分鐘]
//   例：node tools/hd-render.mjs 1990-05-20 09:30 480
// 未帶參數時使用中性示範資料（非任何真實個資），輸出兩種皮膚到 tools/_render/。
import { writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { _injectAstronomy } from '../assets/js/human-design/hd-astro.js';
import { computeChart } from '../assets/js/human-design/hd-engine.js';
import { renderBodygraphSvg } from '../assets/js/human-design/hd-svg-string.js';

// 注入 vendor UMD（與瀏覽器同一份 bytes），讓引擎可在 Node 計算
const require = createRequire(import.meta.url);
_injectAstronomy(require('../assets/vendor/astronomy-engine/astronomy.browser.min.js'));

const [dateArg = '2000-01-01', timeArg = '12:00', offArg = '0'] = process.argv.slice(2);
const [year, month, day] = dateArg.split('-').map(Number);
const [hour, minute] = timeArg.split(':').map(Number);
const offsetMinutes = Number(offArg);
const input = { year, month, day, hour, minute, tz: { offsetMinutes } };

const OUT = 'tools/_render';
mkdirSync(OUT, { recursive: true });

const chart = computeChart(input);
const activated = Object.entries(chart.gateActivations)
  .map(([g, a]) => `${g}${a.p && a.d ? '◑' : a.p ? '●' : '○'}`)
  .sort((x, y) => parseInt(x) - parseInt(y));
console.log(`出生 ${dateArg} ${timeArg}（UTC${offsetMinutes >= 0 ? '+' : ''}${offsetMinutes / 60}）`);
console.log(`類型 ${chart.type}・權威 ${chart.authority}・角色 ${chart.profile}・定義 ${chart.definition}`);
console.log(`定義中心 ${chart.definedCenters.join(', ')}｜通道 ${chart.definedChannels.map((c) => c.id).join(', ')}`);
console.log(`啟動閘門(${activated.length}) ${activated.join(' ')}（◑雙重 ●個性 ○設計）`);

for (const theme of ['report', 'gold']) {
  const svg = renderBodygraphSvg(chart, { theme });
  const file = `${OUT}/chart-${theme}.svg`;
  writeFileSync(file, svg);
  console.log(`  [${theme}] 寫入 ${file}（${svg.length} bytes）`);
}
console.log('完成。');
