// hd-ui.js — 表單與結果渲染（頁面入口 ES module）
import { computeChart, computeChartSamples } from './hd-engine.js';
import { HdError } from './hd-astro.js';
import { searchCities } from './hd-cities.js';
import { mountChartCard, renderChartCard, exportChartPng } from './hd-svg.js';
import { CENTERS, CENTER_IDS } from './hd-data-centers.js';
import { TYPES, AUTHORITIES, PROFILES, DEFINITIONS, CROSS_ANGLES, PLANETS } from './hd-data-texts.js';
import { GATES } from './hd-data-gates.js';

const $ = (id) => document.getElementById(id);
// 防呆 DOM 寫入：容器不存在就略過、不拋錯。避免部署期間「新版 JS × 舊快取 HTML」
// 缺少新容器（如 #hd-readout）時，renderResult 撞上 null 而中斷整個排盤。
const setHTML = (id, html) => { const e = $(id); if (e) e.innerHTML = html; };
const setText = (id, txt) => { const e = $(id); if (e) e.textContent = txt; };
const setVal = (id, v) => { const e = $(id); if (e) e.value = v; };
const on = (id, ev, fn) => { const e = $(id); if (e) e.addEventListener(ev, fn); };
const gtag = (...a) => { if (window.gtag) window.gtag(...a); };

const state = { tz: null, cityLabel: null, lastChart: null, svg: null };

// ---- 填充表單選項 ----
function fillSelect(sel, items) {
  if (!sel) return;
  sel.innerHTML = items.map((it) => `<option value="${it.v}">${it.t}</option>`).join('');
}
function range(a, b) { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; }
function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }

function initForm() {
  fillSelect($('hd-year'), range(1900, 2100).reverse().map((y) => ({ v: y, t: y })));
  fillSelect($('hd-month'), range(1, 12).map((m) => ({ v: m, t: m })));
  fillSelect($('hd-hour'), range(0, 23).map((h) => ({ v: h, t: String(h).padStart(2, '0') })));
  fillSelect($('hd-minute'), range(0, 59).map((m) => ({ v: m, t: String(m).padStart(2, '0') })));
  setVal('hd-year', 1990);
  setVal('hd-month', 1);
  setVal('hd-hour', 12);
  setVal('hd-minute', 0);
  refreshDays();
  on('hd-year', 'change', refreshDays);
  on('hd-month', 'change', refreshDays);

  // 手動 UTC 偏移：-12:00 ~ +14:00（含 :30/:45）
  const offsets = [-720, -660, -600, -540, -480, -420, -360, -300, -240, -210, -180, -120, -60, 0,
    60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 540, 570, 600, 630, 660, 720, 765, 780, 840];
  fillSelect($('hd-manual-tz'), offsets.map((o) => ({ v: o, t: offsetLabel(o) })));
  setVal('hd-manual-tz', 480);
}

function refreshDays() {
  const yEl = $('hd-year'), mEl = $('hd-month'), dEl = $('hd-day');
  if (!yEl || !mEl || !dEl) return;
  const y = +yEl.value;
  const m = +mEl.value;
  const prev = +dEl.value || 1;
  const max = daysInMonth(y, m);
  fillSelect(dEl, range(1, max).map((d) => ({ v: d, t: d })));
  dEl.value = Math.min(prev, max);
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
  if (!input || !list) return;
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
  const v = (id) => +($(id)?.value || 0);
  return {
    year: v('hd-year'), month: v('hd-month'), day: v('hd-day'),
    hour: v('hd-hour'), minute: v('hd-minute'),
  };
}

function resolveTz() {
  if (state.tz) return state.tz;
  // 城市未選但展開了手動偏移
  const field = $('hd-city-search')?.closest('.hd-field');
  const adv = field ? field.querySelector('.hd-advanced') : null;
  if (adv && adv.open) return { offsetMinutes: +($('hd-manual-tz')?.value || 0) };
  return null;
}

function showError(msg) {
  const e = $('hd-error');
  if (!e) { console.warn('[hd] 缺少 #hd-error 容器：', msg); return; }
  e.textContent = msg;
  e.classList.add('is-show');
}
function clearError() { $('hd-error')?.classList.remove('is-show'); }

function onSubmit() {
  clearError();
  const input = readInput();
  const tz = resolveTz();
  if (!tz) { showError('請輸入出生地點並從清單中選擇，或展開「手動指定時區」。'); return; }
  const unknownTime = !!$('hd-unknown-time')?.checked;

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
  setHTML('hd-meta', `出生：${dateStr}　|　時區：${tzInfo.labelZh}${state.cityLabel ? '（' + state.cityLabel + '）' : ''}`);

  // 摘要卡
  const sums = [
    ['類型', TYPES[chart.type].nameZh],
    ['內在權威', AUTHORITIES[chart.authority].nameZh],
    ['人生角色', PROFILES[chart.profile] ? PROFILES[chart.profile].nameZh.split(' ')[0] : chart.profile],
    ['定義', DEFINITIONS[chart.definition].nameZh],
  ];
  setHTML('hd-summary', sums.map(([l, v]) =>
    `<div class="hd-sum-card"><div class="hd-sum-label">${l}</div><div class="hd-sum-value">${v}</div></div>`).join(''));

  const t = TYPES[chart.type];
  setHTML('hd-strategy', `<strong>策略：</strong>${t.strategy}　·　<strong>順流信號：</strong>${t.signature}　·　<strong>逆流警訊：</strong>${t.notSelf}`);

  // 穩定性面板（未知時間模式）
  const stab = $('hd-stability');
  if (stab && stability) {
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
  } else if (stab) {
    stab.style.display = 'none';
  }

  // bodygraph
  const cardC = $('hd-card-container');
  if (cardC && !state.svg) state.svg = mountChartCard(cardC);
  if (state.svg) renderChartCard(state.svg, chart);

  // 通道清單
  setHTML('hd-channels-list', chart.definedChannels.length
    ? chart.definedChannels.map((c) =>
      `<div class="hd-chan-item"><span class="hd-chan-name">${c.nameZh}</span><span class="hd-chan-id">${c.id}</span><div class="hd-chan-desc">${c.desc}</div></div>`).join('')
    : '<p style="color:#aaa;font-size:0.88rem;">沒有完整定義的通道（反映者特質）。</p>');

  // 設計重點解讀（類型／權威／角色／定義 的白話展開）
  setHTML('hd-readout', renderReadout(chart));

  // 九中心（逐一解讀：有定義＝穩定發送，開放＝吸收放大）
  setHTML('hd-centers-list', CENTER_IDS.map((id) => {
    const defined = chart.definedCenters.includes(id);
    const c = CENTERS[id];
    return `<div class="hd-center-item">
      <span class="hd-cc-name">${c.nameZh}</span> <span class="${defined ? 'hd-cc-defined' : 'hd-cc-open'}">${defined ? '● 已定義' : '○ 開放'}</span>
      <div class="hd-cc-desc">${defined ? c.definedDesc : c.openDesc}</div>
    </div>`;
  }).join(''));

  // 輪迴交叉（框架說明 + 你的交叉 + 角度取向；逐一交叉細解留付費）
  const ang = chart.crossAngle ? CROSS_ANGLES[chart.crossAngle] : '';
  const angMeaning = {
    right: '能量會把你帶向完成「屬於自己」的人生主題',
    juxtaposition: '帶著一條固定而專注的軌道前進',
    left: '人生主題與「他人、互動」深深交織',
  }[chart.crossAngle] || '';
  setHTML('hd-cross', `
    <p class="hd-cross-intro">輪迴交叉是人類圖格局最大的一層，由你出生時與出生前的太陽、地球四個閘門組成，勾勒你這一生整體的主題與舞台。</p>
    <div class="hd-cross-data">你的交叉：<strong>閘門 ${chart.crossGates.pSun}/${chart.crossGates.pEarth} | ${chart.crossGates.dSun}/${chart.crossGates.dEarth}</strong>　<span class="hd-cross-angle">${ang}</span></div>
    ${angMeaning ? `<p class="hd-cross-meaning">${angMeaning}。</p>` : ''}
    <p class="hd-cross-note">這個交叉的具體主題、以及它在你職涯與關係裡怎麼展開，留在付費解讀裡細談。</p>`);

  // 進階：完整行星位置與啟動閘門（可收合）
  setHTML('hd-planets-advanced', renderPlanetsAdvanced(chart));

  // 顯示並捲動
  const res = $('hd-result');
  if (res) {
    res.classList.add('is-show');
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// 設計重點：把已算出的類型／權威／角色／定義原創解讀文案展開
function renderReadout(chart) {
  const t = TYPES[chart.type];
  const a = AUTHORITIES[chart.authority];
  const p = PROFILES[chart.profile];
  const d = DEFINITIONS[chart.definition];
  const item = (label, name, en, desc) =>
    `<div class="hd-readout-item">
      <h4><span class="hd-ro-label">${label}</span> <span class="hd-ro-name">${name}</span>${en ? ` <span class="hd-ro-en">${en}</span>` : ''}</h4>
      <p>${desc}</p>
    </div>`;
  const typeDesc = t.desc + (t.signatureLine ? `<br><span class="hd-ro-signal">順流時：${t.signatureLine}</span>` : '');
  return `<h3 class="hd-readout-title">你的設計重點</h3>
    <div class="hd-readout-grid">
      ${item('類型', t.nameZh, t.nameEn, typeDesc)}
      ${item('內在權威', a.nameZh, a.nameEn, a.desc)}
      ${item('人生角色', p ? p.nameZh : chart.profile, '', p ? p.desc : '')}
      ${item('個人定義', d.nameZh, '', d.desc)}
    </div>`;
}

// 進階行星表：補上啟動閘門的卦名＋關鍵詞（資料來自 hd-data-gates.js，輪廓層；逐閘深解屬付費）
function renderPlanetsAdvanced(chart) {
  const cell = (pos, cls) => {
    const g = GATES[pos.gate];
    const kw = g ? ` <span class="hd-pt-kw">${g.hexZh}·${g.keyword}</span>` : '';
    return `<td class="${cls}">${pos.gate}.${pos.line}${kw}</td>`;
  };
  const rows = PLANETS.map((pl) =>
    `<tr><td>${pl.glyph} ${pl.nameZh}</td>${cell(chart.design[pl.id], 'hd-pt-d')}${cell(chart.personality[pl.id], 'hd-pt-p')}</tr>`).join('');
  return `<details class="hd-advanced-planets">
    <summary>完整行星位置與啟動閘門（進階）</summary>
    <p class="hd-planets-note"><strong class="hd-pt-p">個性（黑）</strong>＝出生當下的你（意識層）；<strong class="hd-pt-d">設計（紅）</strong>＝出生前約 88 天（無意識、身體層）。每格為該行星落入的「閘門.爻」，後方是閘門的卦名與關鍵詞——逐閘與逐爻的深入解讀屬付費報告。</p>
    <table class="hd-planet-table">
      <thead><tr><th>行星</th><th class="hd-pt-d">設計（紅）</th><th class="hd-pt-p">個性（黑）</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </details>`;
}

// ---- PNG / 分享 / 重置 ----
function onDownloadPng() {
  if (!state.lastChart || !state.svg) return;
  const c = state.lastChart;
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = `${c.input.year}-${pad(c.input.month)}-${pad(c.input.day)}`;
  const hm = `${pad(c.input.hour)}:${pad(c.input.minute)}`;
  const unknownTime = !!$('hd-unknown-time')?.checked;
  const name = ($('hd-name')?.value || '').trim();

  // 內嵌 PNG 的出生資料：欄位對齊報告端 build_data_auto.py（date/time/place 為核心，
  // place 城市名即足以重解析時區）。詳見 docs/plan-hd-png-birth-metadata.md。
  const meta = {
    v: 1,
    name: name || null,
    date: ymd,
    time: hm,
    place: state.cityLabel || null,
    tz: (typeof c.input.tz === 'string') ? c.input.tz : null,
    offset: (c.tzInfo && typeof c.tzInfo.offsetMin === 'number') ? c.tzInfo.offsetMin : null,
    unknown_time: unknownTime,
    source: 'swanky.github.io/human-design',
  };

  // 卡片可見字幕：人/Claude 一眼可讀，也是 metadata 遺失時的退路。
  const dateLabel = `${c.input.year}/${pad(c.input.month)}/${pad(c.input.day)}`;
  const tzLabel = c.tzInfo?.labelZh || '';
  // 地點：有城市顯示「城市（時區）」、無城市（手動時區）只顯示時區——避免可見層只剩日期
  const locLabel = state.cityLabel ? `${state.cityLabel}（${tzLabel}）` : tzLabel;
  const locPart = locLabel ? `　・　${locLabel}` : '';
  const sub = unknownTime
    ? `${dateLabel}（未提供時間・以正午計）${locPart}`
    : `${dateLabel} ${hm}${locPart}`;

  // 頂部標題帶文字：優先用使用者填的姓名，未填則用預設值。
  // 未來若改為「必填姓名」或想換預設語，改這兩行即可（彈性集中於此）。
  const DEFAULT_CHART_TITLE = '我的人類圖';
  const headerTitle = name || DEFAULT_CHART_TITLE;

  exportChartPng(state.svg, c, {
    headerTitle,
    titleText: `${TYPES[c.type].nameZh}・${AUTHORITIES[c.authority].nameZh}・${c.profile}`,
    subText: sub,
    filename: `human-design-${c.type}-${c.input.year}${pad(c.input.month)}${pad(c.input.day)}-${pad(c.input.hour)}${pad(c.input.minute)}.png`,
    meta,
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
    setText('hd-share-note', '✓ 連結已複製。注意：連結含出生資料，請只分享給信任的人。');
  }).catch(() => {
    setText('hd-share-note', url);
  });
}

function onReset() {
  $('hd-result')?.classList.remove('is-show');
  setText('hd-share-note', '');
  $('hd-form')?.scrollIntoView({ behavior: 'smooth' });
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
  setVal('hd-year', y); setVal('hd-month', mo); refreshDays();
  setVal('hd-day', day); setVal('hd-hour', h); setVal('hd-minute', mi);
  if (p.get('tz')) state.tz = p.get('tz');
  else if (p.get('o') !== null) {
    const field = $('hd-city-search')?.closest('.hd-field');
    const adv = field ? field.querySelector('.hd-advanced') : null;
    if (adv) adv.open = true;
    setVal('hd-manual-tz', p.get('o'));
  }
  onSubmit();
}

function init() {
  initForm();
  initCitySearch();
  on('hd-submit', 'click', onSubmit);
  on('hd-unknown-time', 'change', (e) => {
    const dis = e.target.checked;
    const h = $('hd-hour'); if (h) h.disabled = dis;
    const mi = $('hd-minute'); if (mi) mi.disabled = dis;
  });
  on('hd-download-png', 'click', onDownloadPng);
  on('hd-share-link', 'click', onShareLink);
  on('hd-reset', 'click', onReset);
  applyHash();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
