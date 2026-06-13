// hd-svg.js — 原創 bodygraph SVG 渲染 + PNG 圖卡匯出（程式化生成 DOM，零外部資源）
// 視覺自成一格：定義中心填品牌金 #E5A300、Personality 黑 / Design 紅 半段、
// 同段雙激活＝紅外膛+黑內芯雙描邊。所有樣式內嵌於 SVG <style>，頁面顯示與 PNG 匯出共用。

import { VIEWBOX, CENTER_SHAPES, GATE_ANCHORS, CENTER_DRAW_ORDER, CENTER_LABEL_POS, CHANNEL_VIA } from './hd-geometry.js';
import { CENTERS } from './hd-data-centers.js';
import { CHANNELS } from './hd-data-channels.js';
import { PLANETS } from './hd-data-texts.js';

const SVGNS = 'http://www.w3.org/2000/svg';
// 卡片 = 左 Design 行星欄 + 中央 bodygraph + 右 Personality 行星欄
const CARD = { w: 920, h: 880, graphX: 150, graphY: 24 };

const COLORS = {
  gold: '#E5A300', goldGate: '#5C4400', personality: '#1d1d1f', design: '#C0392B',
  track: '#EAE4D8', openStroke: '#C9C2B4', cardBg: '#FFFDF7', text: '#3a3a3a',
};

const FONT = '"Noto Sans TC","Microsoft JhengHei","PingFang TC","Heiti TC",sans-serif';

function el(name, attrs = {}, parent = null) {
  const node = document.createElementNS(SVGNS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

function centerPathPoints(shape) {
  if (shape.kind === 'rect') {
    const { x, y, w, h } = shape;
    return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  }
  return shape.points;
}

// ---- 內嵌樣式（頁面與 PNG 共用）----
function styleText() {
  return `
    .hd-card-bg { fill: ${COLORS.cardBg}; }
    .hd-chan-base { stroke: #f0ebdf; stroke-width: 6; fill: none; stroke-linecap: round; }
    .hd-chan-half { stroke-width: 11; fill: none; stroke-linecap: round; visibility: hidden; }
    .hd-chan-half.is-p { stroke: ${COLORS.personality}; visibility: visible; }
    .hd-chan-half.is-d { stroke: ${COLORS.design}; visibility: visible; }
    .hd-chan-half.is-pd { stroke: ${COLORS.design}; visibility: visible; }
    .hd-chan-core { stroke: ${COLORS.personality}; stroke-width: 4.5; fill: none; stroke-linecap: round; visibility: hidden; }
    .hd-chan-core.is-on { visibility: visible; }
    .hd-center { fill: #fff; stroke: ${COLORS.openStroke}; stroke-width: 1.5; }
    .hd-center.is-defined { fill: ${COLORS.gold}; stroke: ${COLORS.gold}; }
    .hd-center-label { fill: ${COLORS.openStroke}; font: 600 11px ${FONT}; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
    .hd-center.is-defined ~ .hd-center-label { fill: #fff; }
    .hd-gate-half { fill: transparent; }
    .hd-gate-half.is-p { fill: ${COLORS.personality}; }
    .hd-gate-half.is-d { fill: ${COLORS.design}; }
    .hd-gate-ring { fill: none; stroke: ${COLORS.openStroke}; stroke-width: 1; }
    .hd-gate.is-active .hd-gate-ring { stroke: #fff; }
    .hd-gate-num { font: 600 9px ${FONT}; text-anchor: middle; dominant-baseline: central; fill: ${COLORS.goldGate}; pointer-events: none; }
    .hd-gate.is-active .hd-gate-num { fill: #fff; }
    .hd-col-title { font: 700 14px ${FONT}; }
    .hd-col-title.is-d { fill: ${COLORS.design}; }
    .hd-col-title.is-p { fill: ${COLORS.personality}; }
    .hd-pl-glyph { font: 16px ${FONT}; dominant-baseline: central; }
    .hd-pl-val { font: 600 14px ${FONT}; dominant-baseline: central; fill: ${COLORS.text}; }
    .hd-pl-row.is-d .hd-pl-glyph { fill: ${COLORS.design}; }
    .hd-pl-row.is-p .hd-pl-glyph { fill: ${COLORS.personality}; }
    .hd-card-title { font: 700 18px ${FONT}; fill: #111; }
    .hd-card-sub { font: 400 12px ${FONT}; fill: #888; }
    .hd-watermark { font: 400 11px ${FONT}; fill: #b8b8b8; }
  `;
}

function midpoint(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }

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

  el('rect', { class: 'hd-card-bg', x: 0, y: 0, width: CARD.w, height: CARD.h, rx: 16 }, svg);

  // bodygraph 子座標系
  const graph = el('g', { transform: `translate(${CARD.graphX},${CARD.graphY})` }, svg);

  // 1) 通道（底層）
  const chanG = el('g', { class: 'hd-channels' }, graph);
  for (const ch of CHANNELS) {
    const a = GATE_ANCHORS[ch.gates[0]];
    const b = GATE_ANCHORS[ch.gates[1]];
    // 預設兩端點直線；少數會穿過第三中心者改以 CHANNEL_VIA 路徑點繞行（半段以此點分段，著色不變）。
    const via = CHANNEL_VIA[ch.id];
    const m = via || midpoint(a, b);
    const baseD = via
      ? `M${a[0]},${a[1]} L${m[0]},${m[1]} L${b[0]},${b[1]}`
      : `M${a[0]},${a[1]} L${b[0]},${b[1]}`;
    el('path', { class: 'hd-chan-base', d: baseD }, chanG);
    el('path', { class: 'hd-chan-half', 'data-channel': ch.id, 'data-gate': ch.gates[0], d: `M${a[0]},${a[1]} L${m[0]},${m[1]}` }, chanG);
    el('path', { class: 'hd-chan-half', 'data-channel': ch.id, 'data-gate': ch.gates[1], d: `M${b[0]},${b[1]} L${m[0]},${m[1]}` }, chanG);
    // 雙激活內芯（紅外黑內）：兩條半段的內芯
    el('path', { class: 'hd-chan-core', 'data-channel': ch.id, 'data-gate': ch.gates[0], d: `M${a[0]},${a[1]} L${m[0]},${m[1]}` }, chanG);
    el('path', { class: 'hd-chan-core', 'data-channel': ch.id, 'data-gate': ch.gates[1], d: `M${b[0]},${b[1]} L${m[0]},${m[1]}` }, chanG);
  }

  // 2) 中心
  const centerG = el('g', { class: 'hd-centers' }, graph);
  for (const id of CENTER_DRAW_ORDER) {
    const shape = CENTER_SHAPES[id];
    const pts = centerPathPoints(shape);
    if (shape.kind === 'rect') {
      el('rect', { class: 'hd-center', 'data-center': id, x: shape.x, y: shape.y, width: shape.w, height: shape.h, rx: 4 }, centerG);
    } else {
      el('polygon', { class: 'hd-center', 'data-center': id, points: pts.map((p) => p.join(',')).join(' ') }, centerG);
    }
  }

  // 3) 閘門（頂層）：環 + 左右半圓 + 門號
  const gateG = el('g', { class: 'hd-gates' }, graph);
  const r = 10;
  for (const [gateStr, pos] of Object.entries(GATE_ANCHORS)) {
    const [x, y] = pos;
    const g = el('g', { class: 'hd-gate', 'data-gate': gateStr }, gateG);
    // 左右半圓（雙激活時左黑右紅）
    el('path', { class: 'hd-gate-half hd-gate-left', d: `M${x},${y - r} A${r},${r} 0 0 0 ${x},${y + r} Z` }, g);
    el('path', { class: 'hd-gate-half hd-gate-right', d: `M${x},${y - r} A${r},${r} 0 0 1 ${x},${y + r} Z` }, g);
    el('circle', { class: 'hd-gate-ring', cx: x, cy: y, r }, g);
    el('text', { class: 'hd-gate-num', x, y }, g).textContent = gateStr;
  }

  // 4) 中心標籤（畫在閘門之上、但屬獨立層以免被門遮）
  const labelG = el('g', { class: 'hd-center-labels' }, graph);
  for (const id of CENTER_DRAW_ORDER) {
    const [lx, ly] = CENTER_LABEL_POS[id];
    el('text', { class: 'hd-center-label', 'data-center-label': id, x: lx, y: ly }, labelG);
  }

  // 5) 行星雙欄（左 Design 紅、右 Personality 黑）
  buildPlanetColumn(svg, 'design', 24, 'Design 設計');
  buildPlanetColumn(svg, 'personality', CARD.w - 150, 'Personality 個性');

  return svg;
}

function buildPlanetColumn(svg, side, x, title) {
  const isD = side === 'design';
  const g = el('g', { class: `hd-planet-col hd-col-${side}` }, svg);
  el('text', { class: `hd-col-title is-${isD ? 'd' : 'p'}`, x, y: CARD.graphY + 14 }, g).textContent = title;
  const rowH = 30;
  const top = CARD.graphY + 44;
  PLANETS.forEach((pl, i) => {
    const ry = top + i * rowH;
    const row = el('g', { class: `hd-pl-row is-${isD ? 'd' : 'p'}`, 'data-planet': pl.id, 'data-side': side }, g);
    el('text', { class: 'hd-pl-glyph', x, y: ry }, row).textContent = pl.glyph;
    el('text', { class: 'hd-pl-val', x: x + 26, y: ry, 'data-role': 'val' }, row).textContent = '–';
  });
}

// ---- 依 chart 渲染狀態 ----
export function renderChartCard(svg, chart) {
  const { gateActivations, definedChannels, definedCenters } = chart;
  const definedChannelIds = new Set(definedChannels.map((c) => c.id));

  // 中心
  for (const node of svg.querySelectorAll('.hd-center')) {
    const id = node.getAttribute('data-center');
    node.classList.toggle('is-defined', definedCenters.includes(id));
  }
  for (const node of svg.querySelectorAll('[data-center-label]')) {
    const id = node.getAttribute('data-center-label');
    node.textContent = CENTERS[id].nameZh.replace('中心', '');
    node.style.fill = definedCenters.includes(id) ? '#fff' : COLORS.openStroke;
  }

  // 閘門（含懸掛門）
  for (const g of svg.querySelectorAll('.hd-gate')) {
    const gate = g.getAttribute('data-gate');
    const act = gateActivations[gate];
    const left = g.querySelector('.hd-gate-left');
    const right = g.querySelector('.hd-gate-right');
    left.classList.remove('is-p', 'is-d');
    right.classList.remove('is-p', 'is-d');
    g.classList.toggle('is-active', !!act);
    if (!act) continue;
    if (act.p && act.d) { left.classList.add('is-p'); right.classList.add('is-d'); }
    else if (act.p) { left.classList.add('is-p'); right.classList.add('is-p'); }
    else if (act.d) { left.classList.add('is-d'); right.classList.add('is-d'); }
  }

  // 通道半段（只在通道定義時顯示；顏色依該端門激活源）
  for (const half of svg.querySelectorAll('.hd-chan-half')) {
    const chId = half.getAttribute('data-channel');
    const gate = half.getAttribute('data-gate');
    half.classList.remove('is-p', 'is-d', 'is-pd');
    if (!definedChannelIds.has(chId)) continue;
    const act = gateActivations[gate];
    if (!act) continue;
    if (act.p && act.d) half.classList.add('is-pd');
    else if (act.p) half.classList.add('is-p');
    else if (act.d) half.classList.add('is-d');
  }
  // 雙激活內芯（紅半段中的黑芯）
  for (const core of svg.querySelectorAll('.hd-chan-core')) {
    const chId = core.getAttribute('data-channel');
    const gate = core.getAttribute('data-gate');
    const act = gateActivations[gate];
    core.classList.toggle('is-on', definedChannelIds.has(chId) && act && act.p && act.d);
  }

  // 行星雙欄
  for (const row of svg.querySelectorAll('.hd-pl-row')) {
    const side = row.getAttribute('data-side');
    const planet = row.getAttribute('data-planet');
    const data = side === 'design' ? chart.design : chart.personality;
    const cell = row.querySelector('[data-role="val"]');
    cell.textContent = `${data[planet].gate}.${data[planet].line}`;
  }
  return svg;
}

// ---- PNG 匯出（SVG → canvas → PNG）----
export function exportChartPng(svg, chart, opts = {}) {
  const scale = Math.min(opts.scale || 2, 2);
  const clone = svg.cloneNode(true);

  // 標頭：類型 + 生日 + 浮水印
  const header = el('g', {});
  const title = el('text', { class: 'hd-card-title', x: CARD.w / 2, y: CARD.h - 44, 'text-anchor': 'middle' });
  title.textContent = opts.titleText || '我的人類圖';
  const sub = el('text', { class: 'hd-card-sub', x: CARD.w / 2, y: CARD.h - 24, 'text-anchor': 'middle' });
  sub.textContent = opts.subText || '';
  const wm = el('text', { class: 'hd-watermark', x: CARD.w / 2, y: CARD.h - 8, 'text-anchor': 'middle' });
  wm.textContent = 'swanky.github.io/human-design';
  header.appendChild(title); header.appendChild(sub); header.appendChild(wm);
  clone.appendChild(header);

  const xml = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = CARD.w * scale;
    canvas.height = CARD.h * scale;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = opts.filename || 'human-design-chart.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    if (opts.onError) opts.onError();
  };
  img.src = url;
}
