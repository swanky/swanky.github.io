// hd-ui.js — 表單與結果渲染（頁面入口 ES module）
import { computeChart, computeChartSamples, computeChartUncertainty } from './hd-engine.js';
import { HdError } from './hd-astro.js';
import { createBirthForm } from './hd-form.js';
import { mountChartCard, renderChartCard, exportChartPng } from './hd-svg.js';
import { toHumanDesignChart } from './hd-adapter.js';
import { renderBodygraph } from './hd-bodygraph.js';
import { THEMES_V2 } from './hd-theme.js';
import { CENTERS, CENTER_IDS } from './hd-data-centers.js';
import { CHANNELS } from './hd-data-channels.js';
import { TYPES, AUTHORITIES, PROFILES, DEFINITIONS, CROSS_ANGLES, PLANETS, TYPE_SIGNAL_NOTES } from './hd-data-texts.js';
import { GATES } from './hd-data-gates.js';
import { exportBodygraphSvg, exportTransparentPng, exportBrandCard, exportSocialCard } from './hd-export-v2.js';
import { $, setHTML, setText, on, gtag } from '../core/core-dom.js';

const state = {
  lastChart: null,
  hdChart: null,
  svg: null,
  v2: false,
  sel: null,
  reportOfferViewed: false,
  reportPreviewTracked: false,
};
// 表單（年月日時分/城市/手動時區/未知時間）＝hd-form.js factory；tz 與城市標籤狀態在 form 內
const form = createBirthForm({ prefix: 'hd' });

// ---- Feature flag：bodygraph v2（新管線）vs v1（舊 SVG DOM）----
// 預設 v2；URL 覆寫：?bodygraph=v1 強制舊版、?bodygraph=v2 強制新版。
// v1 路徑完整保留、隨時可全退——flag 只是分流，兩條渲染路徑並存。
const HD_V2 = true;
function useV2() {
  try {
    const p = new URLSearchParams(location.search).get('bodygraph');
    if (p === 'v1') return false;
    if (p === 'v2') return true;
  } catch (_) { /* 無 location 時走預設 */ }
  return HD_V2;
}

// ---- 提交 ----（表單初始化/讀值/時區解析已抽至 hd-form.js，本檔經 form 實例使用）
function showError(msg) {
  const e = $('hd-error');
  if (!e) { console.warn('[hd] 缺少 #hd-error 容器：', msg); return; }
  e.textContent = msg;
  e.classList.add('is-show');
}
function clearError() { $('hd-error')?.classList.remove('is-show'); }

function initFormTracking() {
  const card = document.querySelector('#hd-form .hd-form-card');
  if (!card) return;
  let tracked = false;
  const events = ['input', 'change', 'click'];
  const track = () => {
    if (tracked) return;
    tracked = true;
    gtag('event', 'hd_form_started', { from_page: '/human-design/' });
    events.forEach((eventName) => card.removeEventListener(eventName, track, true));
  };
  events.forEach((eventName) => card.addEventListener(eventName, track, true));
}

function onSubmit() {
  clearError();
  const input = form.readInput();
  const tz = form.resolveTz();
  if (!tz) {
    gtag('event', 'hd_form_validation_error', { field: 'birthplace', from_page: '/human-design/' });
    showError('請輸入出生地點並從清單中選擇，或展開「手動指定時區」。');
    return;
  }
  const unknownTime = form.isUnknownTime();
  const uncertaintyMinutes = form.uncertaintyMinutes();

  try {
    if (unknownTime) {
      const { primary, stability } = computeChartSamples({ ...input, tz });
      renderResult(primary, stability);
    } else if (uncertaintyMinutes) {
      const { primary, stability } = computeChartUncertainty({ ...input, tz }, uncertaintyMinutes);
      renderResult(primary, stability);
    } else {
      const chart = computeChart({ ...input, tz });
      renderResult(chart, null);
    }
    gtag('event', 'hd_chart_generated', { unknown_time: unknownTime, uncertainty_minutes: uncertaintyMinutes, from_page: '/human-design/' });
  } catch (err) {
    if (err instanceof HdError) showError(err.message);
    else { showError('計算時發生未預期的錯誤，請確認輸入並重試。'); console.error(err); }
  }
}

// ---- 結果渲染 ----
function renderResult(chart, stability) {
  state.lastChart = chart;
  state.reportOfferViewed = false;
  state.reportPreviewTracked = false;
  const { input, tzInfo } = chart;
  const dateStr = `${input.year}/${String(input.month).padStart(2, '0')}/${String(input.day).padStart(2, '0')} ${String(input.hour).padStart(2, '0')}:${String(input.minute).padStart(2, '0')}`;
  setHTML('hd-meta', `出生：${dateStr}　|　時區：${tzInfo.labelZh}${form.cityLabel ? '（' + form.cityLabel + '）' : ''}`);

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
  const sigNote = TYPE_SIGNAL_NOTES[chart.type];
  const sigBlock = sigNote ? `<p class="hd-cross-note" style="margin-top:6px;">${sigNote}</p>` : '';
  setHTML('hd-strategy', `<div><strong>策略：</strong>${t.strategy}　·　<strong>順流信號：</strong>${t.signature}　·　<strong>逆流警訊：</strong>${t.notSelf}</div>${sigBlock}`);

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
    const heading = stability.mode === 'day'
      ? '你未提供確切出生時間——以下比較同一天五個時段（主結果以正午計算）'
      : `以下比較輸入時間前後 ${stability.uncertaintyMinutes} 分鐘（主結果仍用你輸入的時間）`;
    const structural = (label, value) => `<div class="hd-stab-item"><span>${value.stable ? '✓' : '⚠'}</span><span><strong>${label}</strong>：${value.stable ? '取樣結果一致' : '可能改變'}</span></div>`;
    const changedCount = stability.activations.changed.length;
    stab.innerHTML = `<h5>⏱ ${heading}</h5>`
      + item('類型', 'type', stability.type) + item('內在權威', 'authority', stability.authority)
      + item('人生角色', 'profile', stability.profile) + item('定義', 'definition', stability.definition)
      + structural('中心狀態', stability.definedCenters) + structural('通道', stability.channels)
      + structural('輪迴交叉', stability.cross)
      + `<div class="hd-stab-item"><span>${changedCount ? '⚠' : '✓'}</span><span><strong>行星啟動位置</strong>：${changedCount ? `${changedCount} 個位置可能改變` : '取樣結果一致'}</span></div>`
      + `<div style="margin-top:8px;color:#789;font-size:0.82rem;">這是誤差範圍內的取樣檢查；若核心結果會改變，建議先查證出生時間，再做深入解讀。</div>`;
    stab.style.display = 'block';
  } else if (stab) {
    stab.style.display = 'none';
  }

  // bodygraph（v2＝新管線字串渲染掛 innerHTML＋互動 hit 層；v1＝舊 DOM 卡）
  const cardC = $('hd-card-container');
  if (state.v2) {
    state.hdChart = toHumanDesignChart(chart);
    if (cardC) cardC.innerHTML = renderBodygraph(state.hdChart, { theme: 'modern', interactive: true });
    clearSelection(); // 新盤重繪＝清掉前一盤的選取/高亮狀態
    // 行星欄移出 SVG → HTML 面板；屬性面板；圖例（皆 v2 專屬，資料與 v1 SVG 行星欄同源）
    // v2 圖卡匯出＝hd-export-v2.js 四式（字串組裝＋iTXt），不再掛 v1 DOM 卡
    setHTML('hd-planet-panel', renderPlanetPanel(chart));
    setHTML('hd-attr-panel', renderAttrPanel(chart));
    setHTML('hd-legend', renderLegendHtml());
  } else {
    if (cardC && !state.svg) state.svg = mountChartCard(cardC);
    if (state.svg) renderChartCard(state.svg, chart);
  }

  // 通道清單
  setHTML('hd-channels-list', chart.definedChannels.length
    ? chart.definedChannels.map((c) =>
      `<div class="hd-chan-item"><span class="hd-chan-name">${c.nameZh}</span><span class="hd-chan-id">${c.id}</span><div class="hd-chan-desc">${c.desc}</div></div>`).join('')
    : '<p style="color:#aaa;font-size:0.88rem;">沒有完整定義的通道（反映者特質）。</p>');

  // 設計重點解讀（類型／權威／角色／定義 的白話展開）
  setHTML('hd-readout', renderReadout(chart));
  updateReportOffer();

  // 九中心：未定義（仍有啟動閘門）與完全開放（沒有任何啟動閘門）分開標示。
  setHTML('hd-centers-list', CENTER_IDS.map((id) => {
    const defined = chart.definedCenters.includes(id);
    const fullyOpen = chart.fullyOpenCenters.includes(id);
    const c = CENTERS[id];
    const status = defined ? '● 已定義' : (fullyOpen ? '◎ 完全開放' : '○ 未定義');
    const desc = defined ? c.definedDesc : c.openDesc
      + (fullyOpen ? ' 此中心沒有任何啟動閘門，可把它視為感受外界差異的一個觀察區域。' : ' 此中心雖未形成完整通道，仍有部分閘門被啟動。');
    return `<div class="hd-center-item">
      <span class="hd-cc-name">${c.nameZh}</span> <span class="${defined ? 'hd-cc-defined' : 'hd-cc-open'}">${status}</span>
      <div class="hd-cc-desc">${desc}</div>
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
    <div class="hd-cross-data">你的交叉：<strong>${chart.incarnationCross?.nameZh || `閘門 ${chart.crossGates.pSun}/${chart.crossGates.pEarth} | ${chart.crossGates.dSun}/${chart.crossGates.dEarth}`}</strong>　<span class="hd-cross-angle">${ang}</span></div>
    <div class="hd-cross-data" style="margin-top:4px;">組成閘門：${chart.crossGates.pSun}/${chart.crossGates.pEarth} | ${chart.crossGates.dSun}/${chart.crossGates.dEarth}</div>
    ${angMeaning ? `<p class="hd-cross-meaning">${angMeaning}。</p>` : ''}
    <p class="hd-cross-note">這個交叉的具體主題、以及它在你職涯與關係裡怎麼展開，留在<a href="#hd-report">付費解讀</a>裡細談。</p>`);

  // 進階：完整行星位置與啟動閘門（可收合）
  setHTML('hd-planets-advanced', renderPlanetsAdvanced(chart));

  // 顯示並捲動
  const res = $('hd-result');
  if (res) {
    res.classList.add('is-show');
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ---- 生成後付費報告下一步 ----
// 只把主題、類型與 CTA 位置送進 GA4；姓名、出生資料與地點只留在使用者本機的 Email 草稿。
const REPORT_TOPICS = {
  career: '職涯定位與工作節奏',
  leadership: '帶人方式與團隊協作',
};

function selectedReportTopic() {
  return document.querySelector('input[name="hd-report-topic"]:checked')?.value || 'career';
}

function buildReportMailto() {
  const c = state.lastChart;
  if (!c) return 'mailto:swanky.hsiao@gmail.com?subject=' + encodeURIComponent('人類圖深度報告申請');
  const pad = (n) => String(n).padStart(2, '0');
  const topicKey = selectedReportTopic();
  const topicLabel = REPORT_TOPICS[topicKey] || REPORT_TOPICS.career;
  const name = ($('hd-name')?.value || '').trim();
  const timeLabel = form.isUnknownTime()
    ? '不確定（本次以正午試算）'
    : `${pad(c.input.hour)}:${pad(c.input.minute)}`;
  const placeLabel = form.cityLabel || c.tzInfo?.labelZh || '手動指定時區';
  const lines = [
    '嗨，史旺基，我想申請人類圖主題式深度報告（早鳥 NT$680）。',
    '',
    `想分析的主題：${topicLabel}`,
    name ? `稱呼：${name}` : '',
    `出生資料：${c.input.year}/${pad(c.input.month)}/${pad(c.input.day)} ${timeLabel}，${placeLabel}`,
    `我的排盤摘要：${TYPES[c.type].nameZh}／${AUTHORITIES[c.authority].nameZh}／人生角色 ${c.profile}／${DEFINITIONS[c.definition].nameZh}`,
    '',
    '我目前最想釐清的是：',
    '（請在這裡補上一句即可）',
    '',
    '我了解報告為 AI 輔助生成、人工校稿，預計 3 個工作天交付。',
  ].filter((line, index, arr) => line !== '' || arr[index - 1] !== '');
  return `mailto:swanky.hsiao@gmail.com?subject=${encodeURIComponent(`[人類圖深度報告] ${topicLabel}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

function updateReportOffer() {
  const c = state.lastChart;
  if (!c) return;
  setText('hd-report-personal-key', `${TYPES[c.type].nameZh} × ${AUTHORITIES[c.authority].nameZh} × ${c.profile}`);
  const href = buildReportMailto();
  const resultCta = $('hd-result-report-cta');
  const detailCta = $('hd-cta-report');
  if (resultCta) resultCta.href = href;
  if (detailCta) detailCta.href = href;
}

function trackReportCta(position) {
  if (!state.lastChart) return;
  const topic = selectedReportTopic();
  updateReportOffer();
  gtag('event', 'hd_report_cta', {
    type: state.lastChart.type,
    topic,
    position,
  });
}

function initReportOfferTracking() {
  const offer = $('hd-result-offer');
  if (offer && typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.35);
      if (!visible || !state.lastChart || state.reportOfferViewed) return;
      state.reportOfferViewed = true;
      gtag('event', 'hd_report_offer_viewed', { type: state.lastChart.type });
    }, { threshold: [0.35] });
    observer.observe(offer);
  }

  const preview = $('hd-report-preview');
  preview?.addEventListener('toggle', () => {
    if (!preview.open || !state.lastChart || state.reportPreviewTracked) return;
    state.reportPreviewTracked = true;
    gtag('event', 'hd_report_preview_opened', { type: state.lastChart.type, position: 'result' });
  });

  document.querySelectorAll('input[name="hd-report-topic"]').forEach((input) => {
    input.addEventListener('change', updateReportOffer);
  });
  on('hd-result-report-cta', 'click', () => trackReportCta('result'));
  on('hd-cta-report', 'click', () => trackReportCta('details'));
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
    const fix = pos.fixing ? ` <span class="hd-pt-fix">${pos.fixing === 'exalted' ? '▲' : '▼'}</span>` : '';
    return `<td class="${cls}">${pos.gate}.${pos.line}${fix}${kw}</td>`;
  };
  const rows = PLANETS.map((pl) =>
    `<tr><td>${pl.glyph} ${pl.nameZh}</td>${cell(chart.design[pl.id], 'hd-pt-d')}${cell(chart.personality[pl.id], 'hd-pt-p')}</tr>`).join('');
  return `<details class="hd-advanced-planets">
    <summary>完整行星位置與啟動閘門（進階）</summary>
    <p class="hd-planets-note"><strong class="hd-pt-p">個性（黑）</strong>＝出生當下的你（意識層）；<strong class="hd-pt-d">設計（紅）</strong>＝出生前約 88 天（無意識、身體層）。每格為該行星落入的「閘門.爻」，後方是閘門的卦名與關鍵詞——逐閘與逐爻的深入解讀屬<a href="#hd-report">付費報告</a>。<br>數字旁的 <span class="hd-pt-fix">▲</span> 表示該行星「固定於擢升」、<span class="hd-pt-fix">▼</span> 表示「固定於衰落」（依標準，南北交點不計）。</p>
    <table class="hd-planet-table">
      <thead><tr><th>行星</th><th class="hd-pt-d">設計（紅）</th><th class="hd-pt-p">個性（黑）</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </details>`;
}

// ---- v2 HTML 面板（行星欄移出 SVG／屬性／圖例）----
// v2 行星欄：13 天體 × 設計（紅）/個性（黑）雙欄，每行 gate.line＋Fixing▲▼。
// 資料與 v1 SVG 行星欄完全同源（同一 chart.design / chart.personality），僅呈現改 HTML。
function renderPlanetPanel(chart) {
  const cell = (pos, cls) => {
    const fix = pos.fixing ? ` <span class="hd-pp-fix">${pos.fixing === 'exalted' ? '▲' : '▼'}</span>` : '';
    return `<span class="${cls}">${pos.gate}.${pos.line}${fix}</span>`;
  };
  const rows = PLANETS.map((pl) =>
    `<div class="hd-pp-row">
      <span class="hd-pp-planet"><span class="hd-pp-glyph">${pl.glyph}</span>${pl.nameZh}</span>
      ${cell(chart.design[pl.id], 'hd-pp-d')}
      ${cell(chart.personality[pl.id], 'hd-pp-p')}
    </div>`).join('');
  return `<div class="hd-pp-panel">
    <div class="hd-pp-title">行星啟動位置</div>
    <div class="hd-pp-head"><span>行星</span><span class="hd-pp-d">設計</span><span class="hd-pp-p">個性</span></div>
    ${rows}
    <p class="hd-pp-note">每格為該行星落入的「閘門.爻」。<span class="hd-pp-d">設計（紅）</span>＝出生前約 88 天（無意識）；<span class="hd-pp-p">個性（黑）</span>＝出生當下（意識）。<span class="hd-pp-fix">▲</span>／<span class="hd-pp-fix">▼</span>＝固定於擢升／衰落（南北交點不計）。</p>
  </div>`;
}

// v2 屬性面板：現有結果欄位重組（不新增計算）——類型/內在權威/人生角色/定義/策略/非自己主題/輪迴交叉。
function renderAttrPanel(chart) {
  const t = TYPES[chart.type];
  const a = AUTHORITIES[chart.authority];
  const p = PROFILES[chart.profile];
  const d = DEFINITIONS[chart.definition];
  const cg = chart.crossGates;
  const ang = chart.crossAngle ? CROSS_ANGLES[chart.crossAngle] : '';
  const row = (label, value, sub) =>
    `<div class="hd-attr-row"><div class="hd-attr-label">${label}</div><div class="hd-attr-value">${value}${sub ? `<small>${sub}</small>` : ''}</div></div>`;
  return `<div class="hd-attr-panel">
    <div class="hd-attr-title">你的設計屬性</div>
    ${row('類型', `<span class="hd-attr-gold">${t.nameZh}</span>`, t.nameEn)}
    ${row('內在權威', a.nameZh, a.nameEn)}
    ${row('人生角色', p ? p.nameZh : chart.profile)}
    ${row('定義', d.nameZh)}
    ${row('人生策略', t.strategy)}
    ${row('非自己主題', t.notSelf)}
    ${row('輪迴交叉', chart.incarnationCross?.nameZh || `閘門 ${cg.pSun}/${cg.pEarth} | ${cg.dSun}/${cg.dEarth}`, ang)}
  </div>`;
}

// v2 圖例：色票取自 THEMES_V2.modern（與 bodygraph 同源，避免漂移）。
function renderLegendHtml() {
  const M = THEMES_V2.modern;
  const item = (bg, label) => `<span class="hd-lg-item"><span class="hd-lg-sw" style="${bg}"></span>${label}</span>`;
  return item(`background:${M.channel.design}`, '設計（無意識）')
    + item(`background:${M.channel.personality}`, '個性（意識）')
    + item(`background:linear-gradient(90deg,${M.channel.design} 50%,${M.channel.personality} 50%)`, '雙重啟動')
    + item(`background:${M.centerDefined.g}`, '有定義中心')
    + item(`background:${M.centerUndefined.fill};border:1px solid ${M.centerUndefined.stroke}`, '開放中心');
}

// v2 手機頁籤切換（行星欄／屬性／圖例）——桌機/平板頁籤隱藏、面板全顯，此為版面互動非圖表互動。
function initTabs() {
  const bar = $('hd-tabs');
  if (!bar) return;
  const tabs = Array.from(bar.querySelectorAll('.hd-tab'));
  const panelOf = (key) => document.querySelector(`[data-tabpanel="${key}"]`);
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.hd-tab');
    if (!btn) return;
    const key = btn.dataset.tab;
    tabs.forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    ['planet', 'attr', 'legend'].forEach((k) => panelOf(k)?.classList.toggle('is-active', k === key));
  });
}

// ---- v2 bodygraph 互動（hover/focus 高亮、click/tap 解讀面板、鍵盤、Esc、點空白取消）----
// 高亮走 DOM 端 class（不進 renderBodygraph 字串／不觸報告端紅線）：hit 層元素被加 .is-hl，
// 頁面 CSS 以屬性選擇器 [data-hit] 上色。解讀內容全部取自 hd-data-*（禁編造）。只在 v2 路徑掛。
const HIT_SEL = '[data-hit]';
const bgSvg = () => $('hd-card-container')?.querySelector('svg') || null;
const channelsOfGate = (g) => CHANNELS.filter((c) => c.gates.includes(g));

function hitInfo(el) {
  const hit = el.getAttribute('data-hit');
  if (hit === 'gate') return { kind: 'gate', id: el.getAttribute('data-gate') };
  if (hit === 'chan') return { kind: 'chan', id: el.getAttribute('data-channel') };
  return { kind: 'center', id: el.getAttribute('data-center') };
}
function clearHl() { bgSvg()?.querySelectorAll('.is-hl').forEach((el) => el.classList.remove('is-hl')); }
function hl(svg, sel) { svg.querySelectorAll(sel).forEach((el) => el.classList.add('is-hl')); }

// 閘門→門＋相連通道＋另一端門；通道→整條＋兩端門；中心→中心＋所屬通道
function applyHl(kind, id) {
  const svg = bgSvg(); if (!svg) return;
  if (kind === 'gate') {
    const g = +id;
    hl(svg, `[data-hit="gate"][data-gate="${g}"]`);
    channelsOfGate(g).forEach((c) => {
      hl(svg, `[data-hit="chan"][data-channel="${c.id}"]`);
      const other = c.gates[0] === g ? c.gates[1] : c.gates[0];
      hl(svg, `[data-hit="gate"][data-gate="${other}"]`);
    });
  } else if (kind === 'chan') {
    const c = CHANNELS.find((x) => x.id === id); if (!c) return;
    hl(svg, `[data-hit="chan"][data-channel="${id}"]`);
    c.gates.forEach((g) => hl(svg, `[data-hit="gate"][data-gate="${g}"]`));
  } else if (kind === 'center') {
    hl(svg, `[data-hit="center"][data-center="${id}"]`);
    CHANNELS.filter((c) => c.centers.includes(id)).forEach((c) => hl(svg, `[data-hit="chan"][data-channel="${c.id}"]`));
  }
}

function gateStateZh(g) {
  const gg = state.hdChart && state.hdChart.gates[g];
  if (!gg || !gg.activated) return '未啟動';
  if (gg.personality && gg.design) return '雙重啟動（個性＋設計）';
  return gg.personality ? '個性啟動（意識）' : '設計啟動（無意識）';
}
const chanStateZh = (id) => ({ off: '未啟動', personality: '個性（意識）', design: '設計（無意識）', mixed: '雙重啟動' }[(state.hdChart && state.hdChart.channels[id]) || 'off']);

// 解讀面板 HTML（資料源：GATES / CHANNELS / CENTERS＋本盤 hdChart 狀態）
function detailHtml(kind, id) {
  if (kind === 'gate') {
    const g = +id; const info = GATES[g]; const cid = info && info.center;
    const chans = channelsOfGate(g);
    const chanBlock = chans.length
      ? `<div class="hd-sd-sub">此閘門所在的通道</div>` + chans.map((c) =>
          `<button type="button" class="hd-sd-link" data-jump-chan="${c.id}"><strong>${c.nameZh}</strong>（${c.id}）· ${chanStateZh(c.id)}</button>`).join('')
      : `<p class="hd-sd-note">此閘門目前不在任何完整通道上。</p>`;
    return `<div class="hd-sd-head"><span class="hd-sd-kicker">閘門 GATE</span><h4>${g} · ${info ? info.hexZh : ''}<small>${info ? info.keyword : ''}</small></h4></div>
      <div class="hd-sd-meta">所屬中心：<strong>${cid ? CENTERS[cid].nameZh : '—'}</strong></div>
      <div class="hd-sd-meta">啟動狀態：<strong>${gateStateZh(g)}</strong></div>
      ${chanBlock}`;
  }
  if (kind === 'chan') {
    const c = CHANNELS.find((x) => x.id === id); if (!c) return '';
    const [a, b] = c.gates; const ga = GATES[a], gb = GATES[b]; const [ca, cb] = c.centers;
    return `<div class="hd-sd-head"><span class="hd-sd-kicker">通道 CHANNEL</span><h4>${c.nameZh}<small>${c.id}</small></h4></div>
      <div class="hd-sd-meta">兩端閘門：<strong>${a} ${ga ? ga.hexZh : ''}</strong> ↔ <strong>${b} ${gb ? gb.hexZh : ''}</strong></div>
      <div class="hd-sd-meta">連結中心：<strong>${CENTERS[ca].nameZh}</strong> ↔ <strong>${CENTERS[cb].nameZh}</strong></div>
      <div class="hd-sd-meta">啟動狀態：<strong>${chanStateZh(c.id)}</strong></div>
      <p class="hd-sd-desc">${c.desc}</p>`;
  }
  const c = CENTERS[id]; if (!c) return '';
  const defined = state.hdChart && state.hdChart.centers[id] === 'defined';
  return `<div class="hd-sd-head"><span class="hd-sd-kicker">能量中心 CENTER</span><h4>${c.nameZh}<small>${c.nameEn}</small></h4></div>
    <div class="hd-sd-meta">定義狀態：<strong>${defined ? '● 已定義（穩定發送）' : '○ 開放（吸收放大）'}</strong></div>
    <p class="hd-sd-desc">${defined ? c.definedDesc : c.openDesc}</p>`;
}

function showDetail(html) {
  const d = $('hd-select-detail'); if (!d) return;
  d.innerHTML = `<button type="button" class="hd-sd-close" id="hd-sd-close" aria-label="關閉解讀">×</button>${html}`;
  d.classList.add('is-open'); d.setAttribute('aria-hidden', 'false');
  $('hd-sheet-backdrop')?.classList.add('is-open');
}
function hideDetail() {
  const d = $('hd-select-detail'); if (!d) return;
  d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true');
  $('hd-sheet-backdrop')?.classList.remove('is-open');
}
function clearSelection() {
  state.sel = null; clearHl(); hideDetail();
  bgSvg()?.classList.remove('is-selecting');
}
function selectEl(kind, id) {
  if (state.sel && state.sel.kind === kind && state.sel.id === id) { clearSelection(); return; } // 再點同一個＝取消
  state.sel = { kind, id };
  clearHl(); applyHl(kind, id);
  bgSvg()?.classList.add('is-selecting');
  showDetail(detailHtml(kind, id));
}

function initBgInteraction() {
  const c = $('hd-card-container'); if (!c) return;
  // 選取面板／遮罩移至 body：保證 viewport-fixed（規避祖先 transform／display:none 影響），且不受頁籤隱藏
  const sd = $('hd-select-detail'); if (sd) document.body.appendChild(sd);
  const bd = $('hd-sheet-backdrop'); if (bd) document.body.appendChild(bd);

  const previewFrom = (t) => { const { kind, id } = hitInfo(t); clearHl(); applyHl(kind, id); };
  const restore = () => { clearHl(); if (state.sel) applyHl(state.sel.kind, state.sel.id); };
  c.addEventListener('pointerover', (e) => { const t = e.target.closest(HIT_SEL); if (t) previewFrom(t); });
  c.addEventListener('pointerout', (e) => { if (e.target.closest(HIT_SEL)) restore(); });
  c.addEventListener('focusin', (e) => { const t = e.target.closest(HIT_SEL); if (t) previewFrom(t); });
  c.addEventListener('focusout', restore);
  c.addEventListener('click', (e) => {
    const t = e.target.closest(HIT_SEL); if (!t) return;
    const { kind, id } = hitInfo(t); selectEl(kind, id);
  });
  c.addEventListener('keydown', (e) => {
    const t = e.target.closest('[data-hit="gate"]'); if (!t) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault(); const { kind, id } = hitInfo(t); selectEl(kind, id);
    }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.sel) clearSelection(); });
  document.addEventListener('click', (e) => {
    if (!state.sel) return;
    if (e.target.closest('#hd-card-container')) return;            // 圖內點擊交給委派
    const inDetail = e.target.closest('#hd-select-detail');
    if (inDetail) {
      if (e.target.closest('#hd-sd-close')) { clearSelection(); return; }
      const jump = e.target.closest('[data-jump-chan]');
      if (jump) selectEl('chan', jump.getAttribute('data-jump-chan'));
      return;
    }
    clearSelection();                                              // 點空白處取消
  });
  bd?.addEventListener('click', clearSelection);
}

// ---- PNG / 分享 / 重置 ----
// 出生資料的匯出呈現（iTXt payload＋標題帶／字幕／檔名基底）——v1 單鈕與 v2 四式共用，避免漂移。
function buildBirthPresentation() {
  const c = state.lastChart;
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = `${c.input.year}-${pad(c.input.month)}-${pad(c.input.day)}`;
  const hm = `${pad(c.input.hour)}:${pad(c.input.minute)}`;
  const unknownTime = form.isUnknownTime();
  const name = ($('hd-name')?.value || '').trim();

  // 內嵌 PNG 的出生資料：欄位對齊報告端 build_data_auto.py（date/time/place 為核心，
  // place 城市名即足以重解析時區）。詳見 docs/plan-hd-png-birth-metadata.md。
  const meta = {
    v: 1,
    name: name || null,
    date: ymd,
    time: hm,
    place: form.cityLabel || null,
    tz: (typeof c.input.tz === 'string') ? c.input.tz : null,
    offset: (c.tzInfo && typeof c.tzInfo.offsetMin === 'number') ? c.tzInfo.offsetMin : null,
    unknown_time: unknownTime,
    source: 'swanky.github.io/human-design',
  };

  // 卡片可見字幕：人/Claude 一眼可讀，也是 metadata 遺失時的退路。
  const dateLabel = `${c.input.year}/${pad(c.input.month)}/${pad(c.input.day)}`;
  const tzLabel = c.tzInfo?.labelZh || '';
  // 地點：有城市顯示「城市（時區）」、無城市（手動時區）只顯示時區——避免可見層只剩日期
  const locLabel = form.cityLabel ? `${form.cityLabel}（${tzLabel}）` : tzLabel;
  const locPart = locLabel ? `　・　${locLabel}` : '';
  const subText = unknownTime
    ? `${dateLabel}（未提供時間・以正午計）${locPart}`
    : `${dateLabel} ${hm}${locPart}`;

  // 頂部標題帶文字：優先用使用者填的姓名，未填則用預設值。
  const headerTitle = name || '我的人類圖';
  const titleText = `${TYPES[c.type].nameZh}・${AUTHORITIES[c.authority].nameZh}・${c.profile}`;
  const filenameBase = `human-design-${c.type}-${c.input.year}${pad(c.input.month)}${pad(c.input.day)}-${pad(c.input.hour)}${pad(c.input.minute)}`;
  return { meta, headerTitle, titleText, subText, filenameBase };
}

// v1 匯出：舊金卡單鈕（?bodygraph=v1；行為完全不變）
function onDownloadPng() {
  if (!state.lastChart || !state.svg) return;
  const p = buildBirthPresentation();
  exportChartPng(state.svg, state.lastChart, {
    headerTitle: p.headerTitle,
    titleText: p.titleText,
    subText: p.subText,
    filename: `${p.filenameBase}.png`,
    meta: p.meta,
    onError: () => showError('圖卡匯出失敗，請改用瀏覽器截圖。'),
  });
  gtag('event', 'hd_download_png', { type: state.lastChart.type });
}

// v2 匯出四式（SVG／透明 PNG／品牌卡 2x／社群卡 1200×1500）；三 PNG 皆注入 hd-birth iTXt。
function onDownloadV2(kind) {
  if (!state.lastChart) return;
  const p = buildBirthPresentation();
  const bundle = {
    hdChart: state.hdChart || toHumanDesignChart(state.lastChart),
    chart: state.lastChart,
    meta: p.meta, headerTitle: p.headerTitle, titleText: p.titleText, subText: p.subText,
    filenameBase: p.filenameBase,
    onError: () => showError('圖卡匯出失敗，請改用瀏覽器截圖。'),
  };
  ({ svg: exportBodygraphSvg, transparent: exportTransparentPng, card: exportBrandCard, social: exportSocialCard }[kind])?.(bundle);
  gtag('event', 'hd_download_v2', { type: state.lastChart.type, format: kind });
}

function onShareLink() {
  const c = state.lastChart;
  if (!c) return;
  const pad = (n) => String(n).padStart(2, '0');
  const params = new URLSearchParams({
    d: `${c.input.year}-${pad(c.input.month)}-${pad(c.input.day)}`,
    t: `${pad(c.input.hour)}:${pad(c.input.minute)}`,
  });
  if (form.tz && typeof form.tz === 'string') params.set('tz', form.tz);
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
  form.setDate(y, mo, day);
  form.setTime(h, mi);
  if (p.get('tz')) form.tz = p.get('tz');
  else if (p.get('o') !== null) form.setManualOffset(p.get('o'));
  onSubmit();
}

function init() {
  form.init();
  initFormTracking();
  // Feature flag 分流：設模式 class（CSS 版面據此切換）＋v2 頁籤／v1 攤平 Layer 2。
  // 必須在 applyHash()（可能觸發 renderResult）之前設定 state.v2。
  state.v2 = useV2();
  const resEl = $('hd-result');
  if (resEl) resEl.classList.add(state.v2 ? 'is-v2' : 'is-v1');
  if (state.v2) { initTabs(); initBgInteraction(); }
  else $('hd-layer2')?.setAttribute('open', ''); // v1：Layer 2 攤平（維持舊觀）
  on('hd-submit', 'click', onSubmit);
  // 未知時間的時分停用鉤已由 form.init() 內建
  on('hd-download-png', 'click', onDownloadPng); // v1 單鈕（v2 由 CSS 隱藏）
  // v2 匯出四式（按鈕在 HTML，v1 模式由 CSS 隱藏；handler 皆先檢查 state.lastChart）
  on('hd-dl-card', 'click', () => onDownloadV2('card'));
  on('hd-dl-social', 'click', () => onDownloadV2('social'));
  on('hd-dl-transparent', 'click', () => onDownloadV2('transparent'));
  on('hd-dl-svg', 'click', () => onDownloadV2('svg'));
  on('hd-share-link', 'click', onShareLink);
  on('hd-reset', 'click', onReset);
  initReportOfferTracking();
  // 單人→合盤帶入：存「表單輸入」（非計算結果）進 sessionStorage 再導頁（同分頁有效、關閉即清）
  on('hd-goto-composite', 'click', () => {
    const c = state.lastChart;
    if (!c) return;
    const pad = (n) => String(n).padStart(2, '0');
    const payload = {
      date: `${c.input.year}-${pad(c.input.month)}-${pad(c.input.day)}`,
      time: `${pad(c.input.hour)}:${pad(c.input.minute)}`,
      tz: typeof c.input.tz === 'string' ? c.input.tz : null,
      offsetMinutes: typeof c.input.tz === 'string' ? null : (c.tzInfo?.offsetMin ?? null),
      place: form.cityLabel || null,
      name: ($('hd-name')?.value || '').trim() || null,
      unknownTime: form.isUnknownTime(),
    };
    try { sessionStorage.setItem('hd:composite:a', JSON.stringify(payload)); } catch (_) { /* 隱私模式失敗照樣導頁 */ }
    gtag('event', 'hd_goto_composite', {});
    location.href = new URL('relationship/', location.href).href;
  });
  applyHash();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
