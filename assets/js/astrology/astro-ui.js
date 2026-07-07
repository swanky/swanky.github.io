// astro-ui.js — 星座命盤頁面入口（ES module）。
// 流程：出生表單 → 城市時區轉 UTC（hd-timezone）→ computeChart → 渲染摘要/圓盤/落座表/解讀/相位。
// beta：ASC/宮位公式尚未通過 astro.com golden 驗證，頁面明示「beta・待驗證」，不宣稱正式（誠實紅線）。
// 深度解讀為精簡版（星座特質庫），完整 172 條文案為後續。沿用 hd-ui/tarot-ui 防禦式 DOM 寫入。
import { computeChart, SIGNS, POINT_IDS, POINT_ZH, signOf } from './astro-chart.js';
import { SIGN_TEXTS, POINT_FRAME, BIG_THREE_HINT } from './astro-text-signs.js';
import { buildChartSvg } from './astro-svg.js';
import { CITIES } from '../core/core-cities.js';
import { zonedToUtc } from '../human-design/hd-timezone.js';
import { $, setHTML, setText, show, on, gtag, esc } from '../core/core-dom.js';

const SIGN_GLYPH = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const DEG = (d) => `${Math.floor(d)}°${String(Math.round((d % 1) * 60)).padStart(2, '0')}′`;

function fillSelect(id, from, to, pad) {
  const el = $(id);
  if (!el) return;
  let html = '';
  for (let i = from; i <= to; i++) html += `<option value="${i}">${pad ? String(i).padStart(2, '0') : i}</option>`;
  el.innerHTML = html;
}

function fillCities() {
  const el = $('astro-city');
  if (!el) return;
  const groups = {};
  CITIES.forEach((c, i) => {
    if (c.lat == null) return; // 只放有經緯度的
    (groups[c.group] = groups[c.group] || []).push({ i, zh: c.zh });
  });
  let html = '';
  for (const g of Object.keys(groups)) {
    html += `<optgroup label="${esc(g)}">`;
    for (const { i, zh } of groups[g]) html += `<option value="${i}">${esc(zh)}</option>`;
    html += '</optgroup>';
  }
  el.innerHTML = html;
}

function collect() {
  const y = +$('astro-y').value;
  const mo = +$('astro-mo').value;
  const d = +$('astro-d').value;
  const timeUnknown = $('astro-time-unknown') ? $('astro-time-unknown').checked : false;
  const h = timeUnknown ? 12 : +$('astro-h').value;
  const mi = timeUnknown ? 0 : +$('astro-mi').value;
  const city = CITIES[+$('astro-city').value];
  const houseSystem = $('astro-house-system') ? $('astro-house-system').value : 'whole';
  const name = $('astro-name') ? $('astro-name').value.trim() : '';
  return { y, mo, d, h, mi, timeUnknown, city, houseSystem, name };
}

let lastChart = null;

function doCompute() {
  show('astro-error', false);
  const inp = collect();
  if (!inp.city || inp.city.lat == null) {
    setText('astro-error', '請選擇出生城市。');
    show('astro-error', true);
    return;
  }
  let tz;
  try {
    tz = zonedToUtc(inp.y, inp.mo, inp.d, inp.h, inp.mi, inp.city.tz);
  } catch (e) {
    setText('astro-error', '時區換算失敗，請確認出生日期與城市。');
    show('astro-error', true);
    return;
  }
  let chart;
  try {
    chart = computeChart({
      utcMs: tz.utcMs, lat: inp.city.lat, lon: inp.city.lon,
      houseSystem: inp.houseSystem, withTime: !inp.timeUnknown,
    });
  } catch (e) {
    setText('astro-error', '命盤計算失敗，請稍後再試。');
    show('astro-error', true);
    return;
  }
  lastChart = chart;
  render(chart, inp);
  gtag('event', 'astro_compute', { houseSystem: inp.houseSystem, timeUnknown: inp.timeUnknown });
  const res = $('astro-result');
  if (res && res.scrollIntoView) res.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function bigCard(id, chart) {
  const p = chart.points[id];
  if (!p) {
    return `<div class="astro-big"><div class="astro-big-glyph">?</div><div class="astro-big-body"><span class="astro-big-label">${POINT_ZH[id]}・${BIG_THREE_HINT[id]}</span><b>需要準確出生時間</b><p>上升星座依賴精確的出生時間與地點，你這次選了「不確定時間」。</p></div></div>`;
  }
  const t = SIGN_TEXTS[p.sign];
  return `<div class="astro-big"><div class="astro-big-glyph">${SIGN_GLYPH[p.sign]}</div><div class="astro-big-body">
    <span class="astro-big-label">${POINT_ZH[id]}・${BIG_THREE_HINT[id]}</span>
    <b>${POINT_ZH[id]}在${esc(p.signZh)}</b>
    <p>${esc(t.trait)}</p></div></div>`;
}

function render(chart, inp) {
  // 摘要三卡
  setHTML('astro-big-three', ['sun', 'moon', 'asc'].map((id) => bigCard(id, chart)).join(''));

  // 圓盤
  setHTML('astro-wheel', buildChartSvg(chart, 440));

  // 落座表
  const rows = POINT_IDS.map((id) => {
    const p = chart.points[id];
    return `<tr><td>${POINT_ZH[id]}</td><td>${SIGN_GLYPH[p.sign]} ${esc(p.signZh)}</td><td>${DEG(p.degInSign)}</td><td>${p.house ? p.house + ' 宮' : '—'}</td><td>${p.retro ? '℞ 逆行' : ''}</td></tr>`;
  }).join('');
  const angRows = ['asc', 'mc'].map((id) => {
    const p = chart.points[id];
    if (!p) return '';
    return `<tr class="is-angle"><td>${POINT_ZH[id]}</td><td>${SIGN_GLYPH[p.sign]} ${esc(p.signZh)}</td><td>${DEG(p.degInSign)}</td><td>—</td><td></td></tr>`;
  }).join('');
  setHTML('astro-table', `<table><thead><tr><th>行星／點</th><th>星座</th><th>度數</th><th>宮位</th><th></th></tr></thead><tbody>${angRows}${rows}</tbody></table>`);

  // 逐項解讀（精簡版）
  const readOrder = ['sun', 'moon', 'asc', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'northNode'];
  setHTML('astro-readings', readOrder.map((id) => {
    const p = chart.points[id];
    if (!p) return '';
    const t = SIGN_TEXTS[p.sign];
    const gen = (id === 'uranus' || id === 'neptune' || id === 'pluto');
    return `<div class="astro-reading${gen ? ' is-gen' : ''}">
      <div class="astro-reading-head"><span class="astro-reading-pt">${SIGN_GLYPH[p.sign]} ${POINT_ZH[id]}在${esc(p.signZh)}${p.retro ? '℞' : ''}</span><span class="astro-reading-frame">${esc(POINT_FRAME[id])}</span></div>
      <p>${esc(t.trait)}</p></div>`;
  }).join(''));

  // 相位精選（orb 最緊 8 條）
  const asp = chart.aspects.slice(0, 8);
  setHTML('astro-aspects', asp.length
    ? `<ul class="astro-asp-list">${asp.map((a) => `<li><b>${POINT_ZH[a.a] || a.a} ${a.name} ${POINT_ZH[a.b] || a.b}</b><span>orb ${a.orb}°</span></li>`).join('')}</ul>`
    : '<p class="astro-hint">沒有在容許度內的主要相位。</p>');

  show('astro-result', true);
  show('astro-beta-note', true);
}

function init() {
  const now = new Date();
  fillSelect('astro-y', 1920, now.getFullYear(), false);
  fillSelect('astro-mo', 1, 12, false);
  fillSelect('astro-d', 1, 31, false);
  fillSelect('astro-h', 0, 23, true);
  fillSelect('astro-mi', 0, 59, true);
  fillCities();
  if ($('astro-y')) $('astro-y').value = 1990;
  on('astro-compute', 'click', doCompute);
  on('astro-time-unknown', 'change', () => {
    const u = $('astro-time-unknown').checked;
    show('astro-time-row', !u);
  });
  show('astro-result', false);
  show('astro-error', false);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
