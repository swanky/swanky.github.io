// hd-composite-ui.js — 合盤頁入口（/human-design/relationship/）：雙人表單 wizard、合盤計算與結果渲染。
// 計算全在瀏覽器內（computeChart×2 → computeComposite）；出生資料不上傳；
// sessionStorage['hd:composite:a'] 僅存單人頁帶入的表單輸入（同裝置、關閉分頁即清）。
import { computeChart } from './hd-engine.js';
import { HdError } from './hd-astro.js';
import { toHumanDesignChart } from './hd-adapter.js';
import { computeComposite, CENTER_IDS } from './hd-composite.js';
import { renderCompositeBodygraph } from './hd-bodygraph-compose.js';
import { renderBodygraph } from './hd-bodygraph.js';
import { CHANNELS } from './hd-data-channels.js';
import { CENTERS } from './hd-data-centers.js';
import { THEMES_V2 } from './hd-theme.js';
import { CATEGORY_TEXTS, CENTER_DYNAMIC_TEXTS, SUMMARY_CARDS, HOW_TO_READ, METHOD_NOTE } from './hd-composite-texts.js';
import { createBirthForm } from './hd-form.js';
import { exportCompositeSvg, exportCompositeTransparentPng, exportCompositeBrandCard, exportCompositeSocialCard } from './hd-export-compose.js';
import { $, setHTML, on, gtag } from '../core/core-dom.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CH_BY_ID = Object.fromEntries(CHANNELS.map((c) => [c.id, c]));
const CAT_ORDER = ['electromagnetic', 'companionship', 'dominance', 'compromise'];

const state = { composite: null, chartA: null, chartB: null, nameA: '', nameB: '', view: 'merged', relation: '' };
let formA = null;
let formB = null;

// 稱呼是使用者輸入——回傳原文；凡進 innerHTML 的插值點各自 esc（mailto／檔名／aria 用原文）
function nameOf(side) {
  return side === 'a' ? (state.nameA || 'A') : (state.nameB || 'B');
}

// ---- 帶入（單人頁 sessionStorage）----
function applyCarryOver() {
  let data = null;
  try { data = JSON.parse(sessionStorage.getItem('hd:composite:a') || 'null'); } catch (_) { /* 壞資料忽略 */ }
  if (!data) return;
  try {
    if (data.date) { const [y, mo, d] = data.date.split('-').map(Number); formA.setDate(y, mo, d); }
    if (data.time) { const [h, mi] = data.time.split(':').map(Number); formA.setTime(h, mi); }
    if (data.tz) formA.setCity(data.tz, data.place || null);
    else if (typeof data.offsetMinutes === 'number') formA.setManualOffset(data.offsetMinutes);
    if (data.unknownTime) formA.setUnknownTime(true);
    if (data.name) { const el = $('hd-a-name'); if (el) el.value = data.name; }
    const note = $('hdc-carryover');
    if (note) { note.textContent = '已帶入你剛才在單人排盤輸入的資料，可直接修改。'; note.style.display = 'block'; }
  } catch (_) { /* 帶入失敗不擋流程 */ }
}

// ---- 錯誤 ----
function showError(msg) {
  const e = $('hdc-error');
  if (e) { e.textContent = msg; e.classList.add('is-show'); }
}
function clearError() { $('hdc-error')?.classList.remove('is-show'); }

// ---- 提交 ----
function onSubmit() {
  clearError();
  const sides = [
    { key: 'a', form: formA, label: '你（A）' },
    { key: 'b', form: formB, label: '對方（B）' },
  ];
  const charts = {};
  for (const s of sides) {
    const input = s.form.readInput();
    if (!input.day) { showError(`${s.label}：請完整選擇出生日期。`); return; }
    const tz = s.form.resolveTz();
    if (!tz) { showError(`${s.label}：請輸入出生地點並從清單中選擇，或展開「手動指定時區」。`); return; }
    const unknown = s.form.isUnknownTime();
    const eff = unknown ? { ...input, hour: 12, minute: 0 } : input;
    try {
      charts[s.key] = { chart: computeChart({ ...eff, tz }), unknown };
    } catch (err) {
      if (err instanceof HdError) { showError(`${s.label}：${err.message}`); return; }
      showError(`${s.label}：計算時發生未預期的錯誤，請確認輸入並重試。`);
      console.error(err);
      return;
    }
  }
  state.nameA = ($('hd-a-name')?.value || '').trim().slice(0, 20);
  state.nameB = ($('hd-b-name')?.value || '').trim().slice(0, 20);
  state.relation = $('hdc-relation')?.value || '';
  state.chartA = charts.a.chart;
  state.chartB = charts.b.chart;
  state.unknownA = charts.a.unknown;
  state.unknownB = charts.b.unknown;
  state.composite = computeComposite(toHumanDesignChart(charts.a.chart), toHumanDesignChart(charts.b.chart));
  state.anyUnknown = charts.a.unknown || charts.b.unknown;
  renderResult();
  gtag('event', 'hd_relationship_generated', {
    relation_context: state.relation || '(none)',
    unknown_time: state.anyUnknown,
    em_count: state.composite.categories.electromagnetic.length,
    cp_count: state.composite.categories.companionship.length,
    dm_count: state.composite.categories.dominance.length,
    cx_count: state.composite.categories.compromise.length,
  });
  $('hdc-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- 摘要卡（規則式選材）----
function summaryCards(c) {
  const A = esc(nameOf('a'));
  const B = esc(nameOf('b'));
  const chName = (id) => `「${CH_BY_ID[id].nameZh}」`;
  const cards = [];
  const cp = c.categories.companionship;
  const em = c.categories.electromagnetic;
  const cx = c.categories.compromise;
  const dm = c.categories.dominance;
  // 默契
  if (cp.length) cards.push({ ...SUMMARY_CARDS.rapport, body: `你們都完整擁有 ${chName(cp[0])}${cp.length > 1 ? ` 等 ${cp.length} 條通道` : ''}——同一種能量、同一種節奏，是你們最不用解釋的地方。` });
  else if (c.sharedGates.length) cards.push({ ...SUMMARY_CARDS.rapport, body: `你們在 ${c.sharedGates.length} 個閘門上同頻（共鳴閘門）——沒有整條通道的重疊，但這些點上你們天生互相聽得懂。` });
  else cards.push({ ...SUMMARY_CARDS.rapport, body: '你們幾乎沒有重疊的啟動——是互補型的組合，默契要靠相處累積，而不是天生內建。' });
  // 火花
  if (em.length) cards.push({ ...SUMMARY_CARDS.spark, body: `${chName(em[0])}由你們一人一半接通${em.length > 1 ? `，加上共 ${em.length} 條電磁連結` : ''}——在一起才完整的能量，吸引與拉扯都從這裡來。` });
  else cards.push({ ...SUMMARY_CARDS.spark, body: '你們之間沒有電磁連結——少了天雷勾動地火，多了平穩自在，關係的溫度來自累積而非火花。' });
  // 留意
  if (cx.length) {
    const e = c.channels[cx[0]];
    const who = e.completeFor[0] === 'a' ? A : B;
    cards.push({ ...SUMMARY_CARDS.friction, body: `${chName(cx[0])}${who}是完整的、另一人持有一半——最容易「差一點才接得上」的地方。摩擦不是誰的錯，而是設計使然。` });
  } else if (dm.length) {
    const e = c.channels[dm[0]];
    const who = e.completeFor[0] === 'a' ? A : B;
    cards.push({ ...SUMMARY_CARDS.friction, body: `${chName(dm[0])}由 ${who} 穩定帶出、另一人全然接收——感受特別強的一方，記得分辨能量的來源。` });
  } else cards.push({ ...SUMMARY_CARDS.friction, body: '你們之間沒有妥協或主導型的連結——能量重疊得很乾淨，少有需要互相翻譯的地帶。' });
  return cards.map((c2) => `<div class="hdc-sum-card"><div class="hdc-sum-title">${c2.title}</div><p>${c2.body}</p><div class="hdc-sum-hint">${c2.hint}</div></div>`).join('');
}

// ---- 四類 accordion ----
function categorySection(c) {
  const A = esc(nameOf('a'));
  const B = esc(nameOf('b'));
  return CAT_ORDER.map((cat) => {
    const t = CATEGORY_TEXTS[cat];
    const ids = c.categories[cat];
    const items = ids.length ? ids.map((id) => {
      const ch = CH_BY_ID[id];
      const info = c.channels[id];
      const [g1, g2] = ch.gates;
      let holding = '';
      if (cat === 'electromagnetic') {
        const o1 = info.gateOwners[g1][0] === 'a' ? A : B;
        const o2 = info.gateOwners[g2][0] === 'a' ? A : B;
        holding = `${o1} 持 ${g1}、${o2} 持 ${g2}`;
      } else if (cat === 'companionship') {
        holding = '雙方皆完整擁有';
      } else {
        const whoName = info.completeFor[0] === 'a' ? A : B;
        const other = info.completeFor[0] === 'a' ? B : A;
        const otherGates = [g1, g2].filter((g) => info.gateOwners[g].includes(info.completeFor[0] === 'a' ? 'b' : 'a'));
        holding = cat === 'dominance' ? `${whoName} 完整擁有、${other} 全然開放` : `${whoName} 完整擁有、${other} 持 ${otherGates.join('、')}`;
      }
      return `<details class="hdc-ch"><summary><b>${id}</b>　${ch.nameZh}<span class="hdc-ch-hold">${holding}</span></summary>
        <div class="hdc-ch-body"><p class="hdc-ch-centers">${ch.centers.map((x) => CENTERS[x].nameZh).join('—')}</p><p>${ch.desc}</p><p class="hdc-neutral">${t.neutral}</p></div></details>`;
    }).join('') : `<p class="hdc-empty">${t.empty}</p>`;
    return `<div class="hdc-cat" data-cat="${cat}">
      <div class="hdc-cat-head" data-catcolor="${cat}"><h4>${t.nameZh} <span class="hdc-cat-en">${t.nameEn}</span><span class="hdc-cat-count">${ids.length}</span></h4><p class="hdc-cat-tag">${t.tagline}</p></div>
      <p class="hdc-cat-desc">${t.desc}</p><p class="hdc-cat-advice">${t.advice}</p>${items}</div>`;
  }).join('');
}

// ---- 中心動態 ----
function centersSection(c) {
  const A = esc(nameOf('a'));
  const B = esc(nameOf('b'));
  return CENTER_IDS.map((id) => {
    const dyn = c.centers[id].dynamic;
    const t = CENTER_DYNAMIC_TEXTS[dyn];
    const label = t.label.replace('{a}', A).replace('{b}', B);
    const desc = t.desc.replaceAll('{a}', A).replaceAll('{b}', B);
    return `<div class="hdc-center${c.centers[id].defined ? ' is-def' : ''}${dyn === 'new' ? ' is-magic' : ''}">
      <div class="hdc-center-name">${CENTERS[id].nameZh}</div><div class="hdc-center-dyn">${label}</div><p>${desc}</p></div>`;
  }).join('');
}

// ---- 結果渲染 ----
function renderResult() {
  const c = state.composite;
  const A = nameOf('a');
  const B = nameOf('b');
  $('hdc-result').style.display = 'block';
  const defined = CENTER_IDS.filter((x) => c.centers[x].defined).length;
  setHTML('hdc-meta', `<b>${esc(A)} × ${esc(B)}</b>　合盤定義 ${defined} 個中心・關係通道 ${CAT_ORDER.reduce((n, k) => n + c.categories[k].length, 0)} 條`);
  if (state.anyUnknown) {
    setHTML('hdc-unknown-note', '其中一人未確定出生時間（以正午試算）——部分合盤結果可能隨實際出生時間改變。');
    $('hdc-unknown-note').style.display = 'block';
  } else {
    $('hdc-unknown-note').style.display = 'none';
  }
  renderGraph();
  const ct = THEMES_V2.modern.compose;
  setHTML('hdc-legend', `
    <span class="hdc-lg"><i style="background:${ct.a.color}"></i>${esc(A)}（實線）</span>
    <span class="hdc-lg"><i style="background:${ct.b.color}"></i>${esc(B)}（虛線）</span>
    <span class="hdc-lg"><i class="hdc-lg-half" style="background:linear-gradient(90deg, ${ct.a.color} 50%, ${ct.b.color} 50%)"></i>兩人皆啟動</span>
    <span class="hdc-lg"><i class="hdc-lg-open"></i>亮色中心＝合盤定義</span>`);
  setHTML('hdc-summary', summaryCards(c));
  setHTML('hdc-cats', categorySection(c));
  setHTML('hdc-centers', centersSection(c));
}

function renderGraph() {
  const c = state.composite;
  if (state.view === 'merged') {
    setHTML('hdc-graph', renderCompositeBodygraph(c, { ariaLabel: `${nameOf('a')} 與 ${nameOf('b')} 的人類圖合盤` }));
  } else {
    const svgA = renderBodygraph(toHumanDesignChart(state.chartA), { ariaLabel: `${nameOf('a')} 的人類圖` });
    const svgB = renderBodygraph(toHumanDesignChart(state.chartB), { ariaLabel: `${nameOf('b')} 的人類圖` });
    setHTML('hdc-graph', `<div class="hdc-side"><figure>${svgA}<figcaption>${esc(nameOf('a'))}</figcaption></figure><figure>${svgB}<figcaption>${esc(nameOf('b'))}</figcaption></figure></div>`);
  }
  $('hdc-view-merged')?.classList.toggle('is-active', state.view === 'merged');
  $('hdc-view-side')?.classList.toggle('is-active', state.view === 'side');
}

// ---- 下載四式（hd-export-compose）----
// 雙人 iTXt payload：與單人 hd-birth 同 keyword，kind:'composite' 供報告端 ingest 分流（站主拍板嵌）。
function personMeta(side) {
  const c = side === 'a' ? state.chartA : state.chartB;
  const f = side === 'a' ? formA : formB;
  const pad = (n) => String(n).padStart(2, '0');
  return {
    name: (side === 'a' ? state.nameA : state.nameB) || null,
    date: `${c.input.year}-${pad(c.input.month)}-${pad(c.input.day)}`,
    time: `${pad(c.input.hour)}:${pad(c.input.minute)}`,
    place: f.cityLabel || null,
    tz: (typeof c.input.tz === 'string') ? c.input.tz : null,
    offset: (c.tzInfo && typeof c.tzInfo.offsetMin === 'number') ? c.tzInfo.offsetMin : null,
    unknown_time: side === 'a' ? !!state.unknownA : !!state.unknownB,
  };
}

// 社群卡一句亮點（規則式；與摘要卡同優先序，取最有代表性的一類）
function pickHighlight(c) {
  const chName = (id) => CH_BY_ID[id].nameZh;
  if (c.categories.electromagnetic.length) return `我們的火花：「${chName(c.categories.electromagnetic[0])}」一人一半`;
  if (c.categories.companionship.length) return `我們的默契：都擁有「${chName(c.categories.companionship[0])}」`;
  if (c.categories.compromise.length) return `我們最需要翻譯的地方：「${chName(c.categories.compromise[0])}」`;
  if (c.categories.dominance.length) return `一方穩定帶出的能量：「${chName(c.categories.dominance[0])}」`;
  return '互補型的兩個人';
}

function buildCompositeBundle() {
  const c = state.composite;
  const pad = (n) => String(n).padStart(2, '0');
  const a = state.chartA.input, b = state.chartB.input;
  const relPart = state.relation ? `${state.relation}・` : '';
  return {
    composite: c,
    nameA: nameOf('a'),
    nameB: nameOf('b'),
    meta: { v: 1, kind: 'composite', a: personMeta('a'), b: personMeta('b'), source: 'swanky.github.io/human-design/relationship' },
    subText: `${relPart}${a.year}/${pad(a.month)}/${pad(a.day)} × ${b.year}/${pad(b.month)}/${pad(b.day)}`,
    highlight: pickHighlight(c),
    filenameBase: `hd-composite-${a.year}${pad(a.month)}${pad(a.day)}x${b.year}${pad(b.month)}${pad(b.day)}`,
    onError: () => showError('圖卡匯出失敗，請改用瀏覽器截圖。'),
  };
}

function onDownload(kind) {
  if (!state.composite) return;
  const b = buildCompositeBundle();
  ({ svg: exportCompositeSvg, transparent: exportCompositeTransparentPng, card: exportCompositeBrandCard, social: exportCompositeSocialCard }[kind])?.(b);
  gtag('event', 'hd_relationship_download', { format: kind });
}

function onShare() {
  const url = location.origin + location.pathname; // 乾淨連結，不帶任何資料
  const text = '免費人類圖合盤：看看你們之間的四種連結';
  if (navigator.share) {
    navigator.share({ title: document.title, text, url }).then(() => gtag('event', 'hd_relationship_share', { method: 'webshare' })).catch(() => { /* 使用者取消 */ });
  } else {
    navigator.clipboard?.writeText(url).then(() => {
      const b = $('hdc-share');
      if (b) { const t = b.textContent; b.textContent = '已複製連結！'; setTimeout(() => { b.textContent = t; }, 1600); }
      gtag('event', 'hd_relationship_share', { method: 'copy' });
    });
  }
}

function onReportCta(pos) {
  const subject = encodeURIComponent(`合盤深度報告申請｜${nameOf('a')} × ${nameOf('b')}`);
  const relation = state.relation ? `關係情境：${state.relation}\n` : '';
  const body = encodeURIComponent(
    `你好，我想申請人類圖合盤深度報告（NT$1,080 早鳥）。\n\n雙方稱呼：${nameOf('a')} × ${nameOf('b')}\n${relation}\n（請回信附上兩人的出生年月日、時間與地點；或直接附上本頁下載的合盤圖卡檔案即可，圖卡已內含排盤所需資料。）`,
  );
  gtag('event', 'hd_relationship_report_cta', { position: pos });
  location.href = `mailto:swanky.hsiao@gmail.com?subject=${subject}&body=${body}`;
}

// ---- boot ----
function boot() {
  formA = createBirthForm({ prefix: 'hd-a' });
  formB = createBirthForm({ prefix: 'hd-b' });
  formA.init();
  formB.init();
  applyCarryOver();
  on('hdc-submit', 'click', onSubmit);
  on('hdc-dl-card', 'click', () => onDownload('card'));
  on('hdc-dl-social', 'click', () => onDownload('social'));
  on('hdc-dl-transparent', 'click', () => onDownload('transparent'));
  on('hdc-dl-svg', 'click', () => onDownload('svg'));
  on('hdc-share', 'click', onShare);
  on('hdc-view-merged', 'click', () => { state.view = 'merged'; renderGraph(); gtag('event', 'hd_relationship_view_toggle', { view: 'merged' }); });
  on('hdc-view-side', 'click', () => { state.view = 'side'; renderGraph(); gtag('event', 'hd_relationship_view_toggle', { view: 'side' }); });
  for (const pos of ['top', 'mid', 'end']) on(`hdc-report-${pos}`, 'click', () => onReportCta(pos));
  gtag('event', 'hd_relationship_page_view', {});
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
