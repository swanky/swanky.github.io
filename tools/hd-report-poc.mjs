// hd-report-poc.mjs — 概念驗證：報告用 bodygraph 與線上工具「共用同一個引擎＋幾何＋繪圖器」
// 證明：餵出生資料 → 主站引擎計算（與線上工具同源、已驗證）→ hd-svg-string 字串繪圖器
//       輸出靜態 SVG（報告可直接內嵌）；皮膚由 theme 切換，引擎/幾何零差異。
// 執行：node tools/hd-report-poc.mjs
// 產物（皆在 tools/，已於 _config.yml 排除，不進站台）：
//   hd-report-poc.svg          報告皮膚 bodygraph（靜態 SVG）
//   hd-report-poc.html         自包含預覽：報告皮膚 vs 金色皮膚 並排 + 行星表

import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { _injectAstronomy } from '../assets/js/human-design/hd-astro.js';
import { computeChart } from '../assets/js/human-design/hd-engine.js';
import { renderBodygraphSvg } from '../assets/js/human-design/hd-svg-string.js';
import { TYPES, AUTHORITIES, PROFILES, DEFINITIONS, PLANETS } from '../assets/js/human-design/hd-data-texts.js';

// --- bootstrap：與測試套件相同，載入 vendor UMD 並注入引擎（Node 可用同一份 bytes）---
const require = createRequire(import.meta.url);
_injectAstronomy(require('../assets/vendor/astronomy-engine/astronomy.browser.min.js'));

// --- 站主出生資料（與參考報告同一人）---
const input = { year: 1983, month: 6, day: 26, hour: 5, minute: 48, tz: 'Asia/Taipei' };
const chart = computeChart(input);

// --- 資料一致性驗證（對照報告/總覽的 ground truth）---
const line = (id, side) => `${chart[side][id].gate}.${chart[side][id].line}`;
console.log('=== 引擎計算結果（應與參考報告逐筆一致）===');
console.log('類型 :', TYPES[chart.type].nameZh, `(${TYPES[chart.type].nameEn})`);
console.log('權威 :', AUTHORITIES[chart.authority].nameZh);
console.log('角色 :', chart.profile, PROFILES[chart.profile] ? PROFILES[chart.profile].nameZh : '');
console.log('定義 :', DEFINITIONS[chart.definition].nameZh);
console.log('定義中心 :', chart.definedCenters.join('、'));
console.log('通道 :', chart.definedChannels.map((c) => `${c.id} ${c.nameZh}`).join('、'));
console.log('輪迴交叉 :', `${chart.crossGates.pSun}/${chart.crossGates.pEarth} | ${chart.crossGates.dSun}/${chart.crossGates.dEarth}`);
console.log('設計太陽/個性太陽 :', line('sun', 'design'), '/', line('sun', 'personality'));

// --- 渲染兩種皮膚（同一 chart、同一幾何）---
const svgReport = renderBodygraphSvg(chart, { theme: 'report' });
const svgGold = renderBodygraphSvg(chart, { theme: 'gold' });

const here = (name) => fileURLToPath(new URL(name, import.meta.url));
writeFileSync(here('hd-report-poc.svg'), svgReport);

// --- 行星表（與報告同款：設計紅標頭 / 個性黑標頭）---
const ptab = (side, caption, headBg) => {
  const rows = PLANETS.map((p) =>
    `<tr><td>${p.glyph} ${p.nameZh}</td><td class="g">${chart[side][p.id].gate}.${chart[side][p.id].line}</td></tr>`).join('');
  return `<table class="ptab"><caption style="background:${headBg}">${caption}</caption>
    <tr><th>行星</th><th>閘門.爻</th></tr>${rows}</table>`;
};

const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>POC：報告 bodygraph 共用線上工具引擎</title>
<style>
  body{font-family:"Noto Sans TC","Microsoft JhengHei",sans-serif;background:#faf8f2;color:#1d2433;margin:0;padding:28px}
  h1{font-size:20px;letter-spacing:.06em;margin:0 0 4px}
  .sub{color:#8a8fa0;font-size:13px;margin-bottom:22px}
  .facts{background:#fffdf8;border:1px solid #e6dfcd;border-radius:12px;padding:14px 18px;font-size:13.5px;margin-bottom:26px;line-height:1.9}
  .facts b{color:#8d6f2f}
  .skins{display:grid;grid-template-columns:1fr 1fr;gap:26px}
  @media(max-width:900px){.skins{grid-template-columns:1fr}}
  .skin{background:#fffdf8;border:1px solid #e6dfcd;border-radius:16px;padding:18px}
  .skin h2{font-size:15px;letter-spacing:.1em;margin:0 0 12px;text-align:center;color:#4d5468}
  .bg-flex{display:grid;grid-template-columns:120px 1fr 120px;gap:10px;align-items:start}
  .ptab{width:100%;border-collapse:collapse;font-size:11px}
  .ptab caption{font-weight:700;letter-spacing:.12em;padding:6px;border-radius:8px 8px 0 0;color:#fff;font-size:11px}
  .ptab th,.ptab td{border:1px solid #e6dfcd;padding:3px 5px;text-align:center}
  .ptab th{background:#f7f1e2;color:#4d5468;font-weight:500;font-size:10px}
  .ptab td.g{font-weight:700}
  .chart{width:100%}
  .chart svg{width:100%;height:auto;display:block}
</style></head><body>
  <h1>POC — 報告版 bodygraph 由「線上工具的引擎＋幾何＋繪圖器」產生</h1>
  <div class="sub">同一支引擎計算、同一份 hd-geometry 幾何、同一個 hd-svg-string 繪圖器；左右只差一個 theme 參數。</div>
  <div class="facts">
    <b>${TYPES[chart.type].nameZh}</b> ・ 內在權威 <b>${AUTHORITIES[chart.authority].nameZh}</b> ・ 人生角色 <b>${chart.profile}</b> ・ <b>${DEFINITIONS[chart.definition].nameZh}</b><br>
    定義中心：${chart.definedCenters.join('、')}　｜　通道：${chart.definedChannels.map((c) => c.id).join('、')}　｜　輪迴交叉：${chart.crossGates.pSun}/${chart.crossGates.pEarth} | ${chart.crossGates.dSun}/${chart.crossGates.dEarth}
  </div>
  <div class="skins">
    <div class="skin"><h2>報告皮膚（theme: report）</h2>
      <div class="bg-flex">
        ${ptab('design', '設計 DESIGN', '#c14b42')}
        <div class="chart">${svgReport}</div>
        ${ptab('personality', '個性 PERSONALITY', '#23252a')}
      </div>
    </div>
    <div class="skin"><h2>線上工具皮膚（theme: gold）</h2>
      <div class="bg-flex">
        ${ptab('design', '設計 DESIGN', '#c14b42')}
        <div class="chart">${svgGold}</div>
        ${ptab('personality', '個性 PERSONALITY', '#23252a')}
      </div>
    </div>
  </div>
</body></html>`;

writeFileSync(here('hd-report-poc.html'), html);
console.log('\n已輸出：tools/hd-report-poc.svg、tools/hd-report-poc.html');
