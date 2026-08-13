// tarot-daily.js — 今日一牌（自我探索實驗室・行動儀式）。
// 復用塔羅引擎：78 張、正逆位、既有牌義（symbol＋生活領域行動，重組為「今日提醒」語氣）。
// 每日鎖（core-daily）：當日重訪同一張；「換一張」限一次。
// 沿用 hd-ui/tarot-ui 的防呆 DOM 寫入：容器不存在就略過、不拋錯。
import { drawSpread } from './tarot-draw.js';
import { CARDS } from './tarot-deck.js';
import { READINGS } from './tarot-data-texts.js';
import { faceSvg, backSvg } from './tarot-card-image.js';
import { exportReadingPng } from './tarot-export-svg.js';
import { loadDaily, saveDaily, canReroll, dayKey } from '../core/core-daily.js';

const STORE = 'swanky-tarot-daily';
const MAX_REROLL = 1;

const $ = (id) => document.getElementById(id);
const setHTML = (id, html) => { const e = $(id); if (e) e.innerHTML = html; };
const show = (id, on) => { const e = $(id); if (e) e.style.display = on ? '' : 'none'; };
const onClick = (id, fn) => { const e = $(id); if (e) e.addEventListener('click', fn); };
const gtag = (...a) => { if (window.gtag) window.gtag(...a); };
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function dateText() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())}`;
}

function drawOne() {
  const d = drawSpread('single', { allowReversed: true })[0];
  return { cardId: d.cardId, reversed: d.reversed };
}

function renderReading(value) {
  const card = CARDS[value.cardId];
  if (!card) return;
  const r = READINGS[value.cardId];
  const dom = r && r.domains ? (r.domains.life || r.domains.work) : null;
  const name = `${card.nameZh}${value.reversed ? '（逆位）' : ''}`;
  let html = `<div class="daily-reading-head"><span class="daily-reading-name">${esc(name)}</span> <span class="tarot-r-en">${esc(card.nameEn)}</span></div>`;
  if (r && r.symbol) html += `<p class="daily-symbol">${esc(r.symbol)}</p>`;
  if (value.reversed && r && r.reversed) html += `<p class="daily-reversed"><b>這次是逆位——換個角度看：</b>${esc(r.reversed)}</p>`;
  if (dom && dom.action) html += `<div class="daily-remind"><h2>今天，試著這樣做</h2><p>${esc(dom.action)}</p></div>`;
  else html += `<div class="daily-remind"><h2>今天的提醒</h2><p>記下你抽到這張牌的當下，心裡浮現的第一個念頭。</p></div>`;
  setHTML('daily-reading', html);
}

function renderCard(value, opts = {}) {
  const card = CARDS[value.cardId];
  if (!card) return;
  const animate = opts.animate && !REDUCED;
  setHTML('daily-card', `<div class="tarot-card${animate ? '' : ' is-flipped'}" id="daily-card-el">
    <div class="tarot-card-inner">
      <div class="tarot-card-back">${backSvg()}</div>
      <div class="tarot-card-face">${faceSvg(card, value.reversed)}</div>
    </div>
  </div>`);
  if (animate) {
    setTimeout(() => { const el = $('daily-card-el'); if (el) el.classList.add('is-flipped'); }, 350);
    setTimeout(() => renderReading(value), 900);
  } else {
    renderReading(value);
  }
  show('daily-intro', false);
  show('daily-result', true);
  updateRerollUi();
}

function updateRerollUi() {
  const can = canReroll(loadDaily(STORE), MAX_REROLL);
  show('daily-reroll', can);
  show('daily-reroll-used', !can);
}

function doDraw(animate) {
  const value = drawOne();
  saveDaily(STORE, value, 0);
  renderCard(value, { animate });
  gtag('event', 'tarot_daily_draw', { reroll: false });
}

function doReroll() {
  const rec = loadDaily(STORE);
  if (!canReroll(rec, MAX_REROLL)) return;
  const value = drawOne();
  const rerolls = (rec && rec.rerolls ? rec.rerolls : 0) + 1;
  saveDaily(STORE, value, rerolls);
  renderCard(value, { animate: true });
  gtag('event', 'tarot_daily_draw', { reroll: true });
}

function doDownload() {
  const rec = loadDaily(STORE);
  if (!rec || !rec.value) return;
  const v = rec.value;
  exportReadingPng(
    [{ cardId: v.cardId, reversed: v.reversed, slotLabel: '今日一牌' }],
    { question: '', spreadName: '今日一牌', dateText: dateText() },
    { filename: `tarot-daily-${dayKey()}.png`, onError: () => {} },
  ).catch(() => {});
  gtag('event', 'tarot_daily_download');
}

function init() {
  const rec = loadDaily(STORE);
  if (rec && rec.value) {
    renderCard(rec.value, { animate: false }); // 今日已抽，直接顯示同一張（每日鎖）
  } else {
    show('daily-intro', true);
    show('daily-result', false);
  }
  onClick('daily-draw', () => doDraw(true));
  onClick('daily-reroll', doReroll);
  onClick('daily-download', doDownload);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
