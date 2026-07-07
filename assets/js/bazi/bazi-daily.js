// bazi-daily.js — 今日五行（自我探索實驗室・行動儀式）。
// 零輸入：顯示今天的日柱干支＋當值五行基調＋一句反思提醒，內鏈八字主工具。
// 純日柱算術（gregorianToCJDN，不需天文引擎）；同一天必然同結果（確定性），
// 提醒句由 CJDN 決定（跨日輪替、不需儲存）。防呆 DOM 寫入。
import { gregorianToCJDN, dayGzFromCJDN } from './bazi-pillars.js';
import { GAN, ZHI, GAN_WUXING, ganOf, zhiOf, WUXING_COLOR, NAYIN } from './bazi-ganzhi.js';
import { DAILY_HINTS, WUXING_TODAY } from './bazi-data-texts.js';
import { exportMingCardPng } from './bazi-svg.js';

const $ = (id) => document.getElementById(id);
const setHTML = (id, html) => { const e = $(id); if (e) e.innerHTML = html; };
const onClick = (id, fn) => { const e = $(id); if (e) e.addEventListener('click', fn); };
const gtag = (...a) => { if (window.gtag) window.gtag(...a); };
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function todayInfo() {
  const now = new Date();
  const y = now.getFullYear(), mo = now.getMonth() + 1, d = now.getDate();
  const cjdn = gregorianToCJDN(y, mo, d);
  const gz = dayGzFromCJDN(cjdn);
  const gan = ganOf(gz), zhi = zhiOf(gz);
  const ganName = GAN[gan], zhiName = ZHI[zhi];
  const wuxing = GAN_WUXING[gan];
  const hints = DAILY_HINTS[ganName] || [''];
  return {
    y, mo, d, cjdn, gz, ganName, zhiName, wuxing,
    dateLabel: `${y}/${String(mo).padStart(2, '0')}/${String(d).padStart(2, '0')}`,
    mood: WUXING_TODAY[wuxing] || '',
    hint: hints[cjdn % hints.length],
    nayin: NAYIN[gz],
  };
}

let lastSvg = null;

function buildDailySvg(t) {
  const W = 600, H = 380, color = WUXING_COLOR[t.wuxing];
  const FONT = "font-family:'Noto Sans TC','Microsoft JhengHei',sans-serif";
  let s = '';
  s += `<rect width="${W}" height="${H}" fill="#fffaf0"/><rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="16" fill="none" stroke="#efe0c2" stroke-width="1.5"/>`;
  s += `<text x="${W / 2}" y="56" text-anchor="middle" font-size="22" font-weight="800" fill="#3a3226" style="${FONT}">今日五行</text>`;
  s += `<text x="${W / 2}" y="82" text-anchor="middle" font-size="14" fill="#E5A300" style="${FONT}">${esc(t.dateLabel)}</text>`;
  s += `<text x="${W / 2}" y="196" text-anchor="middle" font-size="96" font-weight="800" fill="${color}" style="${FONT}">${esc(t.ganName + t.zhiName)}</text>`;
  s += `<text x="${W / 2}" y="236" text-anchor="middle" font-size="15" fill="#8a7f6a" style="${FONT}">天干 ${esc(t.ganName)}（${esc(t.wuxing)}）· ${esc(t.nayin)}</text>`;
  s += `<text x="${W / 2}" y="286" text-anchor="middle" font-size="15" fill="#3a3226" style="${FONT}">${esc(t.mood)}</text>`;
  s += `<text x="${W / 2}" y="316" text-anchor="middle" font-size="14" fill="#6b6252" style="${FONT}">${esc(t.hint)}</text>`;
  s += `<text x="${W / 2}" y="352" text-anchor="middle" font-size="11" fill="#a89a7a" style="${FONT}">swanky.github.io · 自我探索實驗室 · 供反思，不作命定判斷</text>`;
  return { svg: `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="今日五行卡">${s}</svg>`, w: W, h: H };
}

function render() {
  const t = todayInfo();
  const color = WUXING_COLOR[t.wuxing];
  setHTML('wuxing-daily-card', `
    <p class="wd-date">${esc(t.dateLabel)}</p>
    <div class="wd-gz" style="color:${color}">${esc(t.ganName)}${esc(t.zhiName)}</div>
    <p class="wd-meta">天干 <b style="color:${color}">${esc(t.ganName)}</b>（${esc(t.wuxing)}）· ${esc(t.nayin)}</p>
    <p class="wd-mood">${esc(t.mood)}</p>
    <div class="wd-hint"><h5>今天的提醒</h5><p>${esc(t.hint)}</p></div>`);
  lastSvg = buildDailySvg(t);
}

function doDownload() {
  if (!lastSvg) return;
  const t = todayInfo();
  exportMingCardPng(lastSvg, { filename: `wuxing-daily-${t.y}${String(t.mo).padStart(2, '0')}${String(t.d).padStart(2, '0')}.png`, payload: null });
  gtag('event', 'wuxing_daily_download');
}

function init() {
  render();
  onClick('wuxing-daily-download', doDownload);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
