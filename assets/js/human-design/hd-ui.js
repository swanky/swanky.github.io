// hd-ui.js — 表單與結果渲染（頁面入口 ES module）
import { computeChart, computeChartSamples } from './hd-engine.js';
import { HdError } from './hd-astro.js';
import { searchCities } from './hd-cities.js';
import { mountChartCard, renderChartCard, exportChartPng } from './hd-svg.js';
import { CENTERS, CENTER_IDS } from './hd-data-centers.js';
import { TYPES, AUTHORITIES, PROFILES, DEFINITIONS, CROSS_ANGLES, PLANETS } from './hd-data-texts.js';

const $ = (id) => document.getElementById(id);
const gtag = (...a) => { if (window.gtag) window.gtag(...a); };

const state = { tz: null, cityLabel: null, lastChart: null, svg: null };

// ---- 填充表單選項 ----
function fillSelect(sel, items) {
  sel.innerHTML = items.map((it) => `<option value="${it.v}">${it.t}</option>`).join('');
}
function range(a, b) { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; }
function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }

function initForm() {
  fillSelect($('hd-year'), range(1900, 2100).reverse().map((y) => ({ v: y, t: y })));
  fillSelect($('hd-month'), range(1, 12).map((m) => ({ v: m, t: m })));
  fillSelect($('hd-hour'), range(0, 23).map((h) => ({ v: h, t: String(h).padStart(2, '0') })));
  fillSelect($('hd-minute'), range(0, 59).map((m) => ({ v: m, t: String(m).padStart(2, '0') })));
  $('hd-year').value = 1990;
  $('hd-month').value = 1;
  $('hd-hour').value = 12;
  $('hd-minute').value = 0;
  refreshDays();
  $('hd-year').addEventListener('change', refreshDays);
  $('hd-month').addEventListener('change', refreshDays);

  // 手動 UTC 偏移：-12:00 ~ +14:00（含 :30/:45）
  const offsets = [-720, -660, -600, -540, -480, -420, -360, -300, -240, -210, -180, -120, -60, 0,
    60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 540, 570, 600, 630, 660, 720, 765, 780, 840];
  fillSelect($('hd-manual-tz'), offsets.map((o) => ({ v: o, t: offsetLabel(o) })));
  $('hd-manual-tz').value = 480;
}

function refreshDays() {
  const y = +$('hd-year').value;
  const m = +$('hd-month').value;
  const prev = +$('hd-day').value || 1;
  const max = daysInMonth(y, m);
  fillSelect($('hd-day'), range(1, max).map((d) => ({ v: d, t: d })));
  $('hd-day').value = Math.min(prev, max);
}

function offsetLabel(min) {
  const sign = min < 0 ? '-' : '+';
  const abs = Math.abs(min);
  return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}

// ---- 城市搜尋 ----
function initCitySearch() {
  const input = $('hd-city-search');
  const list = $('hd-city-list');
  let activeIdx = -1;
  let results = [];

  const close = () => { list.classList.remove('is-open'); activeIdx = -1; };
  const render = () => {
    if (!results.length) { close(); return; }
    list.innerHTML = results.map((c, i) =>
      `<div class="hd-city-item${i === activeIdx ? ' is-active' : ''}" data-idx="${i}" role="option">
        <span>${c.zh}<span style="color:#bbb;font-size:0.8rem;"> ${c.en}</span></span>
        <span class="hd-city-group">${c.group}</span></div>`).join('');
    list.classList.add('is-open');
  };
  const pick = (c) => {
    state.tz = c.tz; state.cityLabel = c.zh;
    input.value = c.zh;
    close();
  };

  input.addEventListener('input', () => {
    state.tz = null; // 重新輸入即清除已選
    results = searchCities(input.value);
    activeIdx = -1;
    render();
  });
  input.addEventListener('keydown', (e) => {
    if (!list.classList.contains('is-open')) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, results.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (activeIdx >= 0) pick(results[activeIdx]); }
    else if (e.key === 'Escape') close();
  });
  list.addEventListener('mousedown', (e) => {
    const item = e.target.closest('.hd-city-item');
    if (item) pick(results[+item.dataset.idx]);
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.hd-city-wrap')) close(); });
}

// ---- 提交 ----
function readInput() {
  return {
    year: +$('hd-year').value, month: +$('hd-month').value, day: +$('hd-day').value,
    hour: +$('hd-hour').value, minute: +$('hd-minute').value,
  };
}

function resolveTz() {
  if (state.tz) return state.tz;
  // 城市未選但展開了手動偏移
  const adv = $('hd-city-search').closest('.hd-field').querySelector('.hd-advanced');
  if (adv && adv.open) return { offsetMinutes: +$('hd-manual-tz').value };
  return null;
}

function showError(msg) {
  const e = $('hd-error');
  e.textContent = msg;
  e.classList.add('is-show');
}
function clearError() { $('hd-error').classList.remove('is-show'); }

function onSubmit() {
  clearError();
  const input = readInput();
  const tz = resolveTz();
  if (!tz) { showError('請輸入出生地點並從清單中選擇，或展開「手動指定時區」。'); return; }
  const unknownTime = $('hd-unknown-time').checked;

  try {
    if (unknownTime) {
      const { primary, stability } = computeChartSamples({ ...input, tz });
      renderResult(primary, stability);
    } else {
      const chart = computeChart({ ...input, tz });
      renderResult(chart, null);
    }
    gtag('event', 'hd_chart_generated', { unknown_time: unknownTime, from_page: '/human-design/' });
  } catch (err) {
    if (err instanceof HdError) showError(err.message);
    else { showError('計算時發生未預期的錯誤，請確認輸入並重試。'); console.error(err); }
  }
}

// ---- 結果渲染 ----
function renderResult(chart, stability) {
  state.lastChart = chart;
  const { input, tzInfo } = chart;
  const dateStr = `${input.year}/${String(input.month).padStart(2, '0')}/${String(input.day).padStart(2, '0')} ${String(input.hour).padStart(2, '0')}:${String(input.minute).padStart(2, '0')}`;
  $('hd-meta').innerHTML = `出生：${dateStr}　|　時區：${tzInfo.labelZh}${state.cityLabel ? '（' + state.cityLabel + '）' : ''}`;

  // 摘要卡
  const sums = [
    ['類型', TYPES[chart.type].nameZh],
    ['內在權威', AUTHORITIES[chart.authority].nameZh],
    ['人生角色', PROFILES[chart.profile] ? PROFILES[chart.profile].nameZh.split(' ')[0] : chart.profile],
    ['定義', DEFINITIONS[chart.definition].nameZh],
  ];
  $('hd-summary').innerHTML = sums.map(([l, v]) =>
    `<div class="hd-sum-card"><div class="hd-sum-label">${l}</div><div class="hd-sum-value">${v}</div></div>`).join('');

  const t = TYPES[chart.type];
  $('hd-strategy').innerHTML = `<strong>策略：</strong>${t.strategy}　·　<strong>非自己主題：</strong>${t.notSelf}`;

  // 穩定性面板（未知時間模式）
  const stab = $('hd-stability');
  if (stability) {
    const zhMap = {
      type: (v) => (TYPES[v] ? TYPES[v].nameZh : v),
      authority: (v) => (AUTHORITIES[v] ? AUTHORITIES[v].nameZh : v),
      profile: (v) => v,
      definition: (v) => (DEFINITIONS[v] ? DEFINITIONS[v].nameZh : v),
    };
    const item = (label, key, s) => {
      const ok = s.stable;
      const vals = ok ? '' : `（可能為 ${s.values.map(zhMap[key]).join(' 或 ')}）`;
      return `<div class="hd-stab-item"><span>${ok ? '✓' : '⚠'}</span><span><strong>${label}</strong>：${ok ? '整天一致' : '會隨出生時間改變' + vals}</span></div>`;
    };
    stab.innerHTML = `<h5>⏱ 你未提供確切出生時間——以下是整天的穩定性分析（主結果以正午計算）</h5>`
      + item('類型', 'type', stability.type) + item('內在權威', 'authority', stability.authority)
      + item('人生角色', 'profile', stability.profile) + item('定義', 'definition', stability.definition)
      + `<div style="margin-top:8px;color:#789;font-size:0.82rem;">月亮相關的閘門變動最快，若標示為會改變，建議查證出生時間以取得精確結果。</div>`;
    stab.style.display = 'block';
  } else {
    stab.style.display = 'none';
  }

  // bodygraph
  if (!state.svg) state.svg = mountChartCard($('hd-card-container'));
  renderChartCard(state.svg, chart);

  // 通道清單
  $('hd-channels-list').innerHTML = chart.definedChannels.length
    ? chart.definedChannels.map((c) =>
      `<div class="hd-chan-item"><span class="hd-chan-name">${c.nameZh}</span><span class="hd-chan-id">${c.id}</span><div class="hd-chan-desc">${c.desc}</div></div>`).join('')
    : '<p style="color:#aaa;font-size:0.88rem;">沒有完整定義的通道（反映者特質）。</p>';

  // 九中心
  $('hd-centers-list').innerHTML = CENTER_IDS.map((id) => {
    const defined = chart.definedCenters.includes(id);
    return `<div class="hd-center-item"><span class="hd-cc-name">${CENTERS[id].nameZh}</span> <span class="${defined ? 'hd-cc-defined' : 'hd-cc-open'}">${defined ? '● 已定義' : '○ 開放'}</span></div>`;
  }).join('');

  // 輪迴交叉
  const ang = chart.crossAngle ? CROSS_ANGLES[chart.crossAngle] : '';
  $('hd-cross').innerHTML = `<div style="font-size:0.9rem;color:#555;">閘門 ${chart.crossGates.pSun}/${chart.crossGates.pEarth} | ${chart.crossGates.dSun}/${chart.crossGates.dEarth}　<span style="color:#E5A300;">${ang}</span></div>`;

  // 行動版行星表
  $('hd-mobile-planets').innerHTML = renderPlanetTable(chart);

  // 顯示並捲動
  $('hd-result').classList.add('is-show');
  $('hd-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderPlanetTable(chart) {
  const rows = PLANETS.map((pl) =>
    `<tr><td>${pl.glyph} ${pl.nameZh}</td><td class="hd-pt-d">${chart.design[pl.id].gate}.${chart.design[pl.id].line}</td><td class="hd-pt-p">${chart.personality[pl.id].gate}.${chart.personality[pl.id].line}</td></tr>`).join('');
  return `<h4 style="font-size:1rem;font-weight:700;margin:20px 0 8px;">行星位置表</h4>
    <table class="hd-planet-table"><thead><tr><th>行星</th><th class="hd-pt-d">設計(紅)</th><th class="hd-pt-p">個性(黑)</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// ---- PNG / 分享 / 重置 ----
function onDownloadPng() {
  if (!state.lastChart || !state.svg) return;
  const c = state.lastChart;
  exportChartPng(state.svg, c, {
    titleText: `${TYPES[c.type].nameZh}・${AUTHORITIES[c.authority].nameZh}・${c.profile}`,
    subText: `${c.input.year}/${c.input.month}/${c.input.day}`,
    filename: `human-design-${c.type}-${c.input.year}${String(c.input.month).padStart(2, '0')}${String(c.input.day).padStart(2, '0')}.png`,
    onError: () => showError('圖卡匯出失敗，請改用瀏覽器截圖。'),
  });
  gtag('event', 'hd_download_png', { type: c.type });
}

function onShareLink() {
  const c = state.lastChart;
  if (!c) return;
  const pad = (n) => String(n).padStart(2, '0');
  const params = new URLSearchParams({
    d: `${c.input.year}-${pad(c.input.month)}-${pad(c.input.day)}`,
    t: `${pad(c.input.hour)}:${pad(c.input.minute)}`,
  });
  if (state.tz && typeof state.tz === 'string') params.set('tz', state.tz);
  else if (typeof c.tzInfo.offsetMin === 'number') params.set('o', c.tzInfo.offsetMin);
  const url = `${location.origin}${location.pathname}#${params.toString()}`;
  navigator.clipboard.writeText(url).then(() => {
    $('hd-share-note').textContent = '✓ 連結已複製。注意：連結含出生資料，請只分享給信任的人。';
  }).catch(() => {
    $('hd-share-note').textContent = url;
  });
}

function onReset() {
  $('hd-result').classList.remove('is-show');
  $('hd-share-note').textContent = '';
  $('hd-form').scrollIntoView({ behavior: 'smooth' });
}

// 載入時偵測分享 hash → 預填並自動計算
function applyHash() {
  if (!location.hash || location.hash.length < 4) return;
  const p = new URLSearchParams(location.hash.slice(1));
  const d = p.get('d'); const t = p.get('t');
  if (!d || !t) return;
  const [y, mo, day] = d.split('-').map(Number);
  const [h, mi] = t.split(':').map(Number);
  if (!y) return;
  $('hd-year').value = y; $('hd-month').value = mo; refreshDays();
  $('hd-day').value = day; $('hd-hour').value = h; $('hd-minute').value = mi;
  if (p.get('tz')) state.tz = p.get('tz');
  else if (p.get('o') !== null) {
    const adv = $('hd-city-search').closest('.hd-field').querySelector('.hd-advanced');
    if (adv) adv.open = true;
    $('hd-manual-tz').value = p.get('o');
  }
  onSubmit();
}

function init() {
  initForm();
  initCitySearch();
  $('hd-submit').addEventListener('click', onSubmit);
  $('hd-unknown-time').addEventListener('change', (e) => {
    const dis = e.target.checked;
    $('hd-hour').disabled = dis; $('hd-minute').disabled = dis;
  });
  $('hd-download-png').addEventListener('click', onDownloadPng);
  $('hd-share-link').addEventListener('click', onShareLink);
  $('hd-reset').addEventListener('click', onReset);
  applyHash();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
