// hd-svg.js — 原創 bodygraph SVG 渲染 + PNG 圖卡匯出（程式化生成 DOM，零外部資源）
// 視覺自成一格：定義中心填品牌金 #E5A300、設計紅 / 個性黑 半段、雙激活＝紅外膛+黑內芯。
// 幾何（座標、通道弧線路徑）一律來自 hd-geometry.js，與字串版繪圖器 hd-svg-string.js 共用同一份。
// 所有樣式內嵌於 SVG <style>，頁面顯示與 PNG 匯出共用。

import {
  CENTER_SHAPES, GATE_ANCHORS, CENTER_DRAW_ORDER, CENTER_LABEL_POS,
  CHANNEL_PATHS, OUTSIDE_LABELS, channelFullD, channelHalfDs,
} from './hd-geometry.js';
import { CENTERS } from './hd-data-centers.js';
import { CHANNELS } from './hd-data-channels.js';
import { PLANETS } from './hd-data-texts.js';
import { QR } from './hd-data-qr.js';
import { downloadPngFromSvg } from '../core/core-export.js';

const SVGNS = 'http://www.w3.org/2000/svg';
// 卡片 = 左 Design 行星欄 + 中央 bodygraph（幾何 viewBox 0 20 520 712）+ 右 Personality 行星欄
// + 底部圖例。PNG 匯出再於卡片下方追加 CTA 區（QR + 網址）。
const CARD = { w: 820, h: 800, graphX: 170, graphY: -4 };
const COL = { titleY: 46, top: 74, rowH: 44, leftX: 26, rightX: 690 };
const LEGEND_Y = 766;       // 底部圖例中線
const CTA_H = 150;          // PNG 匯出時卡片下方追加的 CTA 區高度
const HEADER_H = 64;        // PNG 匯出時卡片上方追加的標題帶高度（放姓名／預設標題）

const COLORS = {
  gold: '#E5A300', goldGate: '#5C4400', personality: '#1d1d1f', design: '#C0392B',
  track: '#e6ddc9', openStroke: '#C9C2B4', cardBg: '#FFFDF7', text: '#3a3a3a',
  labelOn: '#4a4a30', labelOff: '#9aa0ab', labelOutside: '#555',
  legendOpenBg: '#efe9dc', legendOpenText: '#8a7f63', ctaUrl: '#c98f00',
};

// 底部圖例（與離線報告產生器同一套語彙）：色塊＝實際卡片用色
const LEGEND_ITEMS = [
  { t: '設計（無意識）', fill: COLORS.design, fg: '#fff' },
  { t: '個性（意識）', fill: COLORS.personality, fg: '#fff' },
  { t: '雙重啟動', fill: 'url(#hd-split)', fg: '#fff' },
  { t: '有定義的中心', fill: COLORS.gold, fg: '#fff' },
  { t: '開放的中心', fill: COLORS.legendOpenBg, fg: COLORS.legendOpenText },
];

const FONT = '"Noto Sans TC","Microsoft JhengHei","PingFang TC","Heiti TC",sans-serif';

function el(name, attrs = {}, parent = null) {
  const node = document.createElementNS(SVGNS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

// ---- 內嵌樣式（頁面與 PNG 共用）----
function styleText() {
  return `
    .hd-card-bg { fill: ${COLORS.cardBg}; }
    .hd-chan-base { stroke: ${COLORS.track}; stroke-width: 4.5; fill: none; stroke-linecap: round; }
    .hd-chan-half { stroke-width: 7.5; fill: none; stroke-linecap: round; visibility: hidden; }
    .hd-chan-half.is-p { stroke: ${COLORS.personality}; visibility: visible; }
    .hd-chan-half.is-d { stroke: ${COLORS.design}; visibility: visible; }
    .hd-chan-half.is-pd { stroke: ${COLORS.design}; visibility: visible; }
    .hd-chan-core { stroke: ${COLORS.personality}; stroke-width: 3; fill: none; stroke-linecap: round; visibility: hidden; }
    .hd-chan-core.is-on { visibility: visible; }
    .hd-center { fill: #fff; stroke: ${COLORS.openStroke}; stroke-width: 1.6; }
    .hd-center.is-defined { fill: ${COLORS.gold}; stroke: ${COLORS.gold}; }
    .hd-center-label { fill: ${COLORS.labelOff}; font: 600 11px ${FONT}; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .hd-gate-half { fill: transparent; }
    .hd-gate-half.is-p { fill: ${COLORS.personality}; }
    .hd-gate-half.is-d { fill: ${COLORS.design}; }
    .hd-gate-ring { fill: none; stroke: #c7c7c0; stroke-width: 1; }
    .hd-gate.is-active .hd-gate-ring { stroke: #fff; stroke-width: 1.2; }
    .hd-gate-num { font: 600 8.5px ${FONT}; text-anchor: middle; dominant-baseline: central; fill: ${COLORS.goldGate}; pointer-events: none; }
    .hd-gate.is-active .hd-gate-num { fill: #fff; font-weight: 700; }
    .hd-col-title { font: 700 14px ${FONT}; }
    .hd-col-title.is-d { fill: ${COLORS.design}; }
    .hd-col-title.is-p { fill: ${COLORS.personality}; }
    .hd-pl-glyph { font: 16px ${FONT}; dominant-baseline: central; }
    .hd-pl-val { font: 600 14px ${FONT}; dominant-baseline: central; fill: ${COLORS.text}; }
    .hd-pl-row.is-d .hd-pl-glyph { fill: ${COLORS.design}; }
    .hd-pl-row.is-p .hd-pl-glyph { fill: ${COLORS.personality}; }
    .hd-pl-fix { font-size: 11px; }
    .hd-pl-row.is-d .hd-pl-fix { fill: ${COLORS.design}; }
    .hd-pl-row.is-p .hd-pl-fix { fill: ${COLORS.personality}; }
    .hd-card-title { font: 700 18px ${FONT}; fill: #111; }
    .hd-card-sub { font: 400 12px ${FONT}; fill: #888; }
    .hd-watermark { font: 400 11px ${FONT}; fill: #b8b8b8; }
  `;
}

// ---- 建構完整卡片 SVG（一次）----
export function mountChartCard(container) {
  container.innerHTML = '';
  const svg = el('svg', {
    id: 'hd-card', viewBox: `0 0 ${CARD.w} ${CARD.h}`,
    width: CARD.w, height: CARD.h, xmlns: SVGNS, 'font-family': FONT,
    role: 'img', 'aria-label': '人類圖 bodygraph',
  }, container);

  const style = el('style', {}, svg);
  style.textContent = styleText();

  // 雙重啟動圖例用：左紅右黑漸層
  const defs = el('defs', {}, svg);
  const grad = el('linearGradient', { id: 'hd-split', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
  el('stop', { offset: '50%', 'stop-color': COLORS.design }, grad);
  el('stop', { offset: '50%', 'stop-color': COLORS.personality }, grad);

  el('rect', { class: 'hd-card-bg', x: 0, y: 0, width: CARD.w, height: CARD.h, rx: 16 }, svg);

  // bodygraph 子座標系（幾何座標）
  const graph = el('g', { transform: `translate(${CARD.graphX},${CARD.graphY})` }, svg);

  // 1) 通道（底層全 36 條弧線；半段／內芯依激活源逐段上色）
  const chanG = el('g', { class: 'hd-channels' }, graph);
  for (const ch of CHANNELS) {
    const p = CHANNEL_PATHS[ch.id];
    if (!p) continue;
    const [h0, h1] = channelHalfDs(p); // h0↔ch.gates[0]（小）、h1↔ch.gates[1]（大）
    el('path', { class: 'hd-chan-base', d: channelFullD(p) }, chanG);
    el('path', { class: 'hd-chan-half', 'data-channel': ch.id, 'data-gate': ch.gates[0], d: h0 }, chanG);
    el('path', { class: 'hd-chan-half', 'data-channel': ch.id, 'data-gate': ch.gates[1], d: h1 }, chanG);
    // 雙激活內芯（紅外黑內）
    el('path', { class: 'hd-chan-core', 'data-channel': ch.id, 'data-gate': ch.gates[0], d: h0 }, chanG);
    el('path', { class: 'hd-chan-core', 'data-channel': ch.id, 'data-gate': ch.gates[1], d: h1 }, chanG);
  }

  // 2) 中心
  const centerG = el('g', { class: 'hd-centers' }, graph);
  for (const id of CENTER_DRAW_ORDER) {
    const shape = CENTER_SHAPES[id];
    if (shape.kind === 'rect') {
      el('rect', { class: 'hd-center', 'data-center': id, x: shape.x, y: shape.y, width: shape.w, height: shape.h, rx: 10 }, centerG);
    } else {
      el('polygon', { class: 'hd-center', 'data-center': id, points: shape.points.map((q) => q.join(',')).join(' ') }, centerG);
    }
  }

  // 3) 閘門（頂層）：左右半圓 + 環 + 門號
  const gateG = el('g', { class: 'hd-gates' }, graph);
  const r = 8;
  for (const [gateStr, pos] of Object.entries(GATE_ANCHORS)) {
    const [x, y] = pos;
    const g = el('g', { class: 'hd-gate', 'data-gate': gateStr }, gateG);
    // 左半圓（雙激活時＝設計紅）、右半圓（＝個性黑）
    el('path', { class: 'hd-gate-half hd-gate-left', d: `M${x},${y - r} A${r},${r} 0 0 0 ${x},${y + r} Z` }, g);
    el('path', { class: 'hd-gate-half hd-gate-right', d: `M${x},${y - r} A${r},${r} 0 0 1 ${x},${y + r} Z` }, g);
    el('circle', { class: 'hd-gate-ring', cx: x, cy: y, r }, g);
    el('text', { class: 'hd-gate-num', x, y }, g).textContent = gateStr;
  }

  // 4) 中心標籤（獨立層以免被閘門遮）
  const labelG = el('g', { class: 'hd-center-labels' }, graph);
  for (const id of CENTER_DRAW_ORDER) {
    const [lx, ly] = CENTER_LABEL_POS[id];
    const outside = OUTSIDE_LABELS.includes(id);
    el('text', {
      class: 'hd-center-label', 'data-center-label': id, x: lx, y: ly,
      ...(outside ? { 'text-anchor': 'start' } : {}),
    }, labelG);
  }

  // 5) 行星雙欄（左 Design 紅、右 Personality 黑）
  buildPlanetColumn(svg, 'design', COL.leftX, 'Design 設計');
  buildPlanetColumn(svg, 'personality', COL.rightX, 'Personality 個性');

  // 6) 底部圖例（頁面與 PNG 共用）
  buildLegend(svg);

  return svg;
}

// 底部圖例：5 顆色塊 pill，置中橫排（中文字寬近似 1em，依字數估寬）
function buildLegend(svg) {
  const g = el('g', { class: 'hd-legend' }, svg);
  const fs = 12, chW = 14, padX = 11, gap = 9, ph = 24, ls = 0.8;
  const widths = LEGEND_ITEMS.map((it) => it.t.length * chW + padX * 2);
  const total = widths.reduce((a, b) => a + b, 0) + gap * (LEGEND_ITEMS.length - 1);
  let x = (CARD.w - total) / 2;
  LEGEND_ITEMS.forEach((it, i) => {
    const w = widths[i];
    el('rect', { x, y: LEGEND_Y - ph / 2, width: w, height: ph, rx: ph / 2, fill: it.fill }, g);
    el('text', {
      x: x + w / 2, y: LEGEND_Y, 'text-anchor': 'middle', 'dominant-baseline': 'central',
      fill: it.fg, style: `font:600 ${fs}px ${FONT};letter-spacing:${ls}px`,
    }, g).textContent = it.t;
    x += w + gap;
  });
}

function buildPlanetColumn(svg, side, x, title) {
  const isD = side === 'design';
  const g = el('g', { class: `hd-planet-col hd-col-${side}` }, svg);
  el('text', { class: `hd-col-title is-${isD ? 'd' : 'p'}`, x, y: COL.titleY }, g).textContent = title;
  PLANETS.forEach((pl, i) => {
    const ry = COL.top + i * COL.rowH;
    const row = el('g', { class: `hd-pl-row is-${isD ? 'd' : 'p'}`, 'data-planet': pl.id, 'data-side': side }, g);
    el('text', { class: 'hd-pl-glyph', x, y: ry }, row).textContent = pl.glyph;
    el('text', { class: 'hd-pl-val', x: x + 24, y: ry, 'data-role': 'val' }, row).textContent = '–';
  });
}

// ---- 依 chart 渲染狀態 ----
export function renderChartCard(svg, chart) {
  const { gateActivations, definedCenters } = chart;

  // 中心
  for (const node of svg.querySelectorAll('.hd-center')) {
    const id = node.getAttribute('data-center');
    node.classList.toggle('is-defined', definedCenters.includes(id));
  }
  for (const node of svg.querySelectorAll('[data-center-label]')) {
    const id = node.getAttribute('data-center-label');
    node.textContent = CENTERS[id].nameZh.replace('中心', '');
    if (OUTSIDE_LABELS.includes(id)) {
      node.style.fill = COLORS.labelOutside; // 外側標籤恆深色
    } else {
      node.style.fill = definedCenters.includes(id) ? COLORS.labelOn : COLORS.labelOff;
    }
  }

  // 閘門（含懸掛門）：設計=左右紅、個性=左右黑、雙重=左紅右黑
  for (const g of svg.querySelectorAll('.hd-gate')) {
    const gate = g.getAttribute('data-gate');
    const act = gateActivations[gate];
    const left = g.querySelector('.hd-gate-left');
    const right = g.querySelector('.hd-gate-right');
    left.classList.remove('is-p', 'is-d');
    right.classList.remove('is-p', 'is-d');
    g.classList.toggle('is-active', !!act);
    if (!act) continue;
    if (act.p && act.d) { left.classList.add('is-d'); right.classList.add('is-p'); }
    else if (act.p) { left.classList.add('is-p'); right.classList.add('is-p'); }
    else if (act.d) { left.classList.add('is-d'); right.classList.add('is-d'); }
  }

  // 通道半段（任一端閘門啟動即上色，含懸掛半段；顏色依該端激活源）
  for (const half of svg.querySelectorAll('.hd-chan-half')) {
    const gate = half.getAttribute('data-gate');
    half.classList.remove('is-p', 'is-d', 'is-pd');
    const act = gateActivations[gate];
    if (!act) continue;
    if (act.p && act.d) half.classList.add('is-pd');
    else if (act.p) half.classList.add('is-p');
    else if (act.d) half.classList.add('is-d');
  }
  // 雙激活內芯（紅半段中的黑芯）
  for (const core of svg.querySelectorAll('.hd-chan-core')) {
    const gate = core.getAttribute('data-gate');
    const act = gateActivations[gate];
    core.classList.toggle('is-on', !!(act && act.p && act.d));
  }

  // 行星雙欄（gate.line ＋ 固定箭頭：▲ 擢升 / ▼ 衰落）
  for (const row of svg.querySelectorAll('.hd-pl-row')) {
    const side = row.getAttribute('data-side');
    const planet = row.getAttribute('data-planet');
    const data = side === 'design' ? chart.design : chart.personality;
    const cell = row.querySelector('[data-role="val"]');
    const pos = data[planet];
    cell.textContent = `${pos.gate}.${pos.line}`; // 賦值會清掉舊 tspan，重繪安全
    if (pos.fixing) {
      el('tspan', { class: 'hd-pl-fix', dx: 4 }, cell).textContent = pos.fixing === 'exalted' ? '▲' : '▼';
    }
  }
  return svg;
}

// 建構匯出用 SVG clone（卡片 + 底部 CTA 區：QR + 摘要 + 網址）。
// 抽出成可匯出函式，便於離線預覽/測試（不必觸發實際下載即可檢視版面）。
export function buildExportSvg(svg, opts = {}) {
  // 有標題文字才追加頂部標題帶（無則維持原高度，向下相容）
  const headerH = opts.headerTitle ? HEADER_H : 0;
  const fullH = headerH + CARD.h + CTA_H;
  const clone = svg.cloneNode(true);
  clone.setAttribute('viewBox', `0 ${-headerH} ${CARD.w} ${fullH}`);
  clone.setAttribute('width', CARD.w);
  clone.setAttribute('height', fullH);

  // 頂部標題帶（卡片上方）：放姓名或預設標題。延伸卡片米白底到頂部，圓角自然落在最上緣。
  if (headerH) {
    const bg = clone.querySelector('.hd-card-bg');
    if (bg) { bg.setAttribute('y', -headerH); bg.setAttribute('height', CARD.h + headerH); }
    const hg = el('g', { class: 'hd-header' }, clone);
    el('text', {
      x: CARD.w / 2, y: -headerH / 2, 'text-anchor': 'middle', 'dominant-baseline': 'central',
      style: `font:700 30px ${FONT}`, fill: '#1d1d1f',
    }, hg).textContent = opts.headerTitle;
  }

  // CTA 區（卡片下方）：QR Code + 圖卡摘要 + 網址，引導觀者也來生成
  const cta = el('g', { class: 'hd-cta' }, clone);
  el('line', { x1: 70, y1: CARD.h + 2, x2: CARD.w - 70, y2: CARD.h + 2, stroke: '#ece7da', 'stroke-width': 1 }, cta);
  // QR（含 3 模組 quiet zone，確保可掃）
  const qb = 3, qtot = QR.modules + qb * 2, qsize = 112, qx = 204, qy = CARD.h + 18;
  const qg = el('g', { transform: `translate(${qx},${qy}) scale(${(qsize / qtot).toFixed(4)})` }, cta);
  el('rect', { x: 0, y: 0, width: qtot, height: qtot, fill: '#fff' }, qg);
  el('path', { d: QR.path, fill: COLORS.personality, transform: `translate(${qb},${qb})` }, qg);
  // 文字塊（QR 右側）
  const tx = qx + qsize + 28;
  el('text', { x: tx, y: CARD.h + 42, style: `font:700 18px ${FONT}`, fill: '#1d1d1f' }, cta)
    .textContent = opts.titleText || '我的人類圖';
  el('text', { x: tx, y: CARD.h + 66, style: `font:400 12.5px ${FONT}`, fill: '#888' }, cta)
    .textContent = opts.subText || '';
  el('text', { x: tx, y: CARD.h + 98, style: `font:700 18px ${FONT}`, fill: COLORS.ctaUrl }, cta)
    .textContent = QR.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  el('text', { x: tx, y: CARD.h + 120, style: `font:400 11px ${FONT}`, fill: '#aaa' }, cta)
    .textContent = '掃描 QR 或輸入網址，免費生成你的人類圖 · 出生資料不上傳';
  return { clone, fullH };
}

// ---- PNG 匯出（SVG → canvas → PNG）----
// iTXt 注入與 canvas→下載尾段已收斂至 core/core-export.js；本函式只負責 HD 專屬的組版與序列化。
export function exportChartPng(svg, chart, opts = {}) {
  const { clone, fullH } = buildExportSvg(svg, opts);
  const xml = new XMLSerializer().serializeToString(clone);
  downloadPngFromSvg({
    svg: xml,
    width: CARD.w,
    height: fullH,
    scale: opts.scale,
    background: '#fff',
    filename: opts.filename || 'human-design-chart.png',
    itxt: opts.meta ? { keyword: 'hd-birth', json: opts.meta } : null,
    onError: opts.onError,
  });
}
