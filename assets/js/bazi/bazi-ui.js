// bazi-ui.js — 八字排盤頁面入口（ES module）。
// 流程：出生表單 → 城市時區轉 UTC（hd-timezone）→ computePillars → analyzeChart → 渲染
//       命式卡（SVG）／摘要／日主小傳／五行解讀／十神表／大運／PNG。沿用防禦式 DOM 寫入。
// beta（誠實紅線）：日柱排法待跨排盤站 golden 逐筆複核，頁面明示「beta・驗證中」，不宣稱正式。
import { computePillars } from './bazi-pillars.js';
import { analyzeChart, tenGod, TEN_GODS } from './bazi-shishen.js';
import { DAY_MASTER, TEN_GOD, WUXING_LEAD, SEASON, STRENGTH, BALANCE, seasonOf } from './bazi-data-texts.js';
import { buildMingCard, exportMingCardPng } from './bazi-svg.js';
import { CITIES } from '../core/core-cities.js';
import { zonedToUtc } from '../human-design/hd-timezone.js';

const $ = (id) => document.getElementById(id);
const setHTML = (id, html) => { const e = $(id); if (e) e.innerHTML = html; };
const setText = (id, t) => { const e = $(id); if (e) e.textContent = t; };
const show = (id, on) => { const e = $(id); if (e) e.style.display = on ? '' : 'none'; };
const on = (id, ev, fn) => { const e = $(id); if (e) e.addEventListener(ev, fn); };
const gtag = (...a) => { if (window.gtag) window.gtag(...a); };
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function fillSelect(id, from, to, pad) {
  const el = $(id);
  if (!el) return;
  let html = '';
  for (let i = from; i <= to; i++) html += `<option value="${i}">${pad ? String(i).padStart(2, '0') : i}</option>`;
  el.innerHTML = html;
}

function fillCities() {
  const el = $('bazi-city');
  if (!el) return;
  const groups = {};
  CITIES.forEach((c, i) => { (groups[c.group] = groups[c.group] || []).push({ i, zh: c.zh }); });
  let html = '';
  for (const g of Object.keys(groups)) {
    html += `<optgroup label="${esc(g)}">`;
    for (const { i, zh } of groups[g]) html += `<option value="${i}">${esc(zh)}</option>`;
    html += '</optgroup>';
  }
  el.innerHTML = html;
}

function collect() {
  const y = +$('bazi-y').value;
  const mo = +$('bazi-mo').value;
  const d = +$('bazi-d').value;
  const timeUnknown = $('bazi-time-unknown') ? $('bazi-time-unknown').checked : false;
  const h = timeUnknown ? 12 : +$('bazi-h').value;
  const mi = timeUnknown ? 0 : +$('bazi-mi').value;
  const city = CITIES[+$('bazi-city').value];
  const gender = $('bazi-gender') ? $('bazi-gender').value : 'male';
  const dayBoundary = $('bazi-day-boundary') ? $('bazi-day-boundary').value : 'zi23';
  const trueSolarTime = $('bazi-true-solar') ? $('bazi-true-solar').checked : false;
  const name = $('bazi-name') ? $('bazi-name').value.trim() : '';
  return { y, mo, d, h, mi, timeUnknown, city, gender, dayBoundary, trueSolarTime, name };
}

let lastCard = null; // {svg,w,h}
let lastPayload = null;

function doCompute() {
  show('bazi-error', false);
  const inp = collect();
  if (!inp.city) { setText('bazi-error', '請選擇出生城市。'); show('bazi-error', true); return; }
  let tz;
  try { tz = zonedToUtc(inp.y, inp.mo, inp.d, inp.h, inp.mi, inp.city.tz); }
  catch (e) { setText('bazi-error', '時區換算失敗，請確認出生日期與城市。'); show('bazi-error', true); return; }

  // 真太陽時用的當地時區偏移：由「當地牆鐘視為 UTC」與實際 utcMs 反算（不依賴時區庫內部結構）
  const offsetMin = Math.round((Date.UTC(inp.y, inp.mo - 1, inp.d, inp.h, inp.mi) - tz.utcMs) / 60000);

  let chart;
  try {
    chart = computePillars({
      y: inp.y, mo: inp.mo, d: inp.d, h: inp.h, mi: inp.mi, utcMs: tz.utcMs,
      gender: inp.gender, withTime: !inp.timeUnknown, dayBoundary: inp.dayBoundary,
      trueSolarTime: inp.trueSolarTime, lon: inp.city.lon, tzOffsetMin: offsetMin,
    });
  } catch (e) { setText('bazi-error', '排盤失敗，請確認出生資料（支援 1900–2100）。'); show('bazi-error', true); return; }

  const analysis = analyzeChart(chart.pillars);
  render(chart, analysis, inp);
  gtag('event', 'bazi_compute', { timeUnknown: inp.timeUnknown, trueSolar: inp.trueSolarTime });
  const res = $('bazi-result');
  if (res && res.scrollIntoView) res.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function render(chart, analysis, inp) {
  const P = chart.pillars;
  const gzName = (p) => p ? p.ganName + p.zhiName : '—';
  const monthZhi = P.month.zhi;
  const season = seasonOf(monthZhi);

  // 出生字幕
  const dateLabel = `${inp.y}/${String(inp.mo).padStart(2, '0')}/${String(inp.d).padStart(2, '0')}`;
  const timeLabel = inp.timeUnknown ? '時辰未知' : `${String(inp.h).padStart(2, '0')}:${String(inp.mi).padStart(2, '0')}`;
  const meta = { name: inp.name, dateLabel, timeLabel, placeLabel: inp.city.zh };

  // 命式卡（SVG，同時作頁面主視覺與 PNG 匯出來源）
  lastCard = buildMingCard(chart, analysis, meta);
  setHTML('bazi-mingpan', lastCard.svg);
  lastPayload = {
    tool: 'bazi', v: 1, name: inp.name, date: dateLabel, time: inp.timeUnknown ? '' : timeLabel,
    place: inp.city.zh, dayMaster: analysis.dayGanName,
    pillars: { year: gzName(P.year), month: gzName(P.month), day: gzName(P.day), hour: P.hour ? gzName(P.hour) : '' },
  };

  // 摘要
  const st = analysis.strength;
  setHTML('bazi-summary', `
    <div class="bazi-sum-item"><span>日主</span><b>${esc(analysis.dayGanName)}（${esc(analysis.dayWuxing)}）</b></div>
    <div class="bazi-sum-item"><span>月令</span><b>${esc(season)}・${esc(chart.meta.jieName)}</b></div>
    <div class="bazi-sum-item"><span>強弱傾向</span><b>${esc(st.tendency)}</b></div>
    <div class="bazi-sum-item"><span>日柱納音</span><b>${esc(P.day.nayin)}</b></div>`);

  // 日主小傳
  setHTML('bazi-daymaster', `<h3>日主・${esc(analysis.dayGanName)}${esc(analysis.dayWuxing)}</h3><p>${esc(DAY_MASTER[analysis.dayGanName] || '')}</p>`);

  // 五行解讀（最旺主導＋均衡＋強弱＋季節）
  const lead = Object.keys(analysis.wuxing.percent).sort((a, b) => analysis.wuxing.percent[b] - analysis.wuxing.percent[a])[0];
  const maxPct = analysis.wuxing.percent[lead];
  const balance = maxPct >= 40 ? BALANCE.concentrated : BALANCE.even;
  setHTML('bazi-wuxing-read', [
    WUXING_LEAD[lead], balance, STRENGTH[st.tendency], SEASON[season],
  ].map((t) => `<p>${esc(t)}</p>`).join('') + `<p class="bazi-note">${esc(st.note)}</p>`);

  // 十神分布表（只列出現者）＋職場白話
  const rows = TEN_GODS.filter((g) => analysis.tenGodCount[g] > 0).map((g) =>
    `<tr><td class="bazi-tg-name">${g}<span>×${analysis.tenGodCount[g]}</span></td><td>${esc(TEN_GOD[g])}</td></tr>`).join('');
  setHTML('bazi-shishen', `<table class="bazi-tg-table"><tbody>${rows}</tbody></table>`);

  // 大運時間軸
  const luck = chart.luck;
  const dir = luck.forward ? '順排' : '逆排';
  let luckHead = `排法：${dir}`;
  if (luck.startAge) luckHead += `　·　約 ${luck.startAge.years} 歲${luck.startAge.months ? ' ' + luck.startAge.months + ' 個月' : ''} 起運`;
  const steps = luck.steps.map((s) => {
    const god = tenGod(analysis.dayGan, s.gan);
    return `<div class="bazi-luck-card"><span class="bazi-luck-age">${s.startAge} 歲</span><b class="bazi-luck-gz">${esc(s.ganName)}${esc(s.zhiName)}</b><span class="bazi-luck-god">${esc(god)}</span></div>`;
  }).join('');
  setHTML('bazi-luck', `<p class="bazi-luck-head">${luckHead}</p><div class="bazi-luck-track">${steps}</div>`);

  show('bazi-result', true);
  show('bazi-beta-note', true);
}

function doDownload() {
  if (!lastCard) return;
  const namePart = (lastPayload && lastPayload.name) ? '-' + lastPayload.name : '';
  exportMingCardPng(lastCard, { filename: `bazi-mingpan${namePart}.png`, payload: lastPayload });
  gtag('event', 'bazi_download');
}

function init() {
  const now = new Date();
  fillSelect('bazi-y', 1920, now.getFullYear(), false);
  fillSelect('bazi-mo', 1, 12, false);
  fillSelect('bazi-d', 1, 31, false);
  fillSelect('bazi-h', 0, 23, true);
  fillSelect('bazi-mi', 0, 59, true);
  fillCities();
  if ($('bazi-y')) $('bazi-y').value = 1990;
  on('bazi-compute', 'click', doCompute);
  on('bazi-download', 'click', doDownload);
  on('bazi-time-unknown', 'change', () => show('bazi-time-row', !$('bazi-time-unknown').checked));
  show('bazi-result', false);
  show('bazi-error', false);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
