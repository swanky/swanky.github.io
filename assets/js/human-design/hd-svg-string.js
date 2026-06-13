// hd-svg-string.js — DOM-free bodygraph SVG 字串渲染器（Node 與瀏覽器皆可用）
// 與 hd-svg.js 共用「同一份 hd-geometry.js 幾何」與「同一個引擎 chart 物件」，
// 差別只在：本檔輸出 SVG 字串、完全不依賴 document，故可在 Node 烤靜態 SVG（給報告產生器），
// 也可在前端直接 innerHTML。皮膚（配色）由 theme 參數決定——同一套引擎＋幾何，兩種外觀。
//
// 用法：
//   import { computeChart } from './hd-engine.js';
//   import { renderBodygraphSvg } from './hd-svg-string.js';
//   const svg = renderBodygraphSvg(computeChart(input), { theme: 'report' });

import { CENTER_SHAPES, GATE_ANCHORS, CENTER_DRAW_ORDER, CENTER_LABEL_POS, CHANNEL_VIA, VIEWBOX } from './hd-geometry.js';
import { CHANNELS } from './hd-data-channels.js';
import { CENTERS } from './hd-data-centers.js';

const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

// 相對亮度 → 決定中心標籤用深色或白色（讓任何皮膚配色都自動可讀）
function luminance(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// ---- 皮膚 -------------------------------------------------------------
export const THEMES = {
  // 精緻報告版：標準人類圖「逐中心」配色（即參考報告那張圖的配色由來）
  report: {
    bg: 'transparent',
    base: '#e7e0d0',
    design: '#c14b42', personality: '#23252a',
    doubleStyle: 'stripe', // 紅實線 + 黑虛線疊出條紋
    centerColors: {
      head: ['#e7dd56', '#9a9a3e'], ajna: ['#8fb84e', '#5f7f34'], throat: ['#b08a5e', '#7a5f3c'],
      g: ['#d8e25e', '#76803a'], heart: ['#d9534f', '#8e2f2c'], sacral: ['#d9534f', '#8e2f2c'],
      spleen: ['#ad8a64', '#71573b'], solar: ['#ad8a64', '#71573b'], root: ['#ad8a64', '#71573b'],
    },
    open: ['#ffffff', '#b3ab9a'],
  },
  // 站台品牌金（與線上工具 hd-svg.js 同一視覺語言）
  gold: {
    bg: '#FFFDF7',
    base: '#efe9dc',
    design: '#C0392B', personality: '#1d1d1f',
    doubleStyle: 'core', // 紅外圈 + 黑內芯
    centerColors: null, // 一律品牌金
    defined: ['#E5A300', '#E5A300'],
    open: ['#ffffff', '#C9C2B4'],
  },
};

// chart：computeChart() 的輸出（含 gateActivations / definedChannels / definedCenters）
// opts.theme：'report' | 'gold'（預設 report）
export function renderBodygraphSvg(chart, opts = {}) {
  const theme = THEMES[opts.theme] || THEMES.report;
  const { w, h } = VIEWBOX;
  const A = GATE_ANCHORS;
  const ga = chart.gateActivations || {};
  const definedIds = new Set((chart.definedChannels || []).map((c) => c.id));
  const definedCenters = new Set(chart.definedCenters || []);
  const centerFill = (id) => {
    if (!definedCenters.has(id)) return theme.open;
    return theme.centerColors ? theme.centerColors[id] : theme.defined;
  };
  const out = [];

  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="人類圖 bodygraph">`);
  out.push('<style>text{font-family:"Noto Sans TC","Microsoft JhengHei","PingFang TC",sans-serif}</style>');
  if (theme.bg && theme.bg !== 'transparent') {
    out.push(`<rect x="0" y="0" width="${w}" height="${h}" fill="${theme.bg}"/>`);
  }

  // ---- 1) 通道（底層）：底線恆畫；已定義者再疊兩段著色（半段以 via/中點分段）----
  for (const ch of CHANNELS) {
    const a = A[ch.gates[0]];
    const b = A[ch.gates[1]];
    const via = CHANNEL_VIA[ch.id];
    const m = via || mid(a, b);
    const baseD = via
      ? `M${a[0]},${a[1]} L${m[0]},${m[1]} L${b[0]},${b[1]}`
      : `M${a[0]},${a[1]} L${b[0]},${b[1]}`;
    out.push(`<path d="${baseD}" fill="none" stroke="${theme.base}" stroke-width="2.5" stroke-linecap="round"/>`);
    if (!definedIds.has(ch.id)) continue;
    for (const [g, end] of [[ch.gates[0], a], [ch.gates[1], b]]) {
      const act = ga[g];
      if (!act) continue;
      const seg = `M${end[0]},${end[1]} L${m[0]},${m[1]}`;
      if (act.p && act.d) {
        out.push(`<path d="${seg}" fill="none" stroke="${theme.design}" stroke-width="11" stroke-linecap="round"/>`);
        if (theme.doubleStyle === 'stripe') {
          out.push(`<path d="${seg}" fill="none" stroke="${theme.personality}" stroke-width="11" stroke-linecap="butt" stroke-dasharray="6 6"/>`);
        } else {
          out.push(`<path d="${seg}" fill="none" stroke="${theme.personality}" stroke-width="4.5" stroke-linecap="round"/>`);
        }
      } else {
        out.push(`<path d="${seg}" fill="none" stroke="${act.p ? theme.personality : theme.design}" stroke-width="11" stroke-linecap="round"/>`);
      }
    }
  }

  // ---- 2) 中心 ----
  for (const id of CENTER_DRAW_ORDER) {
    const s = CENTER_SHAPES[id];
    const [fill, stroke] = centerFill(id);
    if (s.kind === 'rect') {
      out.push(`<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`);
    } else {
      out.push(`<polygon points="${s.points.map((p) => p.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`);
    }
  }

  // ---- 3) 閘門（頂層）：未啟動＝空心；個性=黑、設計=紅、雙重=左黑右紅 ----
  const r = 10;
  for (const [gStr, pos] of Object.entries(A)) {
    const [x, y] = pos;
    const act = ga[gStr];
    if (!act) {
      out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#c2c2c2" stroke-width="1"/>`);
      out.push(`<text x="${x}" y="${y}" font-size="9" text-anchor="middle" dominant-baseline="central" fill="#9a8e63">${gStr}</text>`);
      continue;
    }
    if (act.p && act.d) {
      out.push(`<path d="M${x},${y - r} A${r},${r} 0 0 0 ${x},${y + r} Z" fill="${theme.personality}"/>`);
      out.push(`<path d="M${x},${y - r} A${r},${r} 0 0 1 ${x},${y + r} Z" fill="${theme.design}"/>`);
    } else {
      out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${act.p ? theme.personality : theme.design}"/>`);
    }
    out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="1"/>`);
    out.push(`<text x="${x}" y="${y}" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" fill="#fff">${gStr}</text>`);
  }

  // ---- 4) 中心標籤 ----
  for (const id of CENTER_DRAW_ORDER) {
    const [lx, ly] = CENTER_LABEL_POS[id];
    const [fill] = centerFill(id);
    const def = definedCenters.has(id);
    const labelColor = def ? (luminance(fill) > 0.62 ? '#4a4a30' : '#ffffff') : '#8a8170';
    const name = CENTERS[id].nameZh.replace('中心', '');
    out.push(`<text x="${lx}" y="${ly}" font-size="13" font-weight="600" text-anchor="middle" dominant-baseline="middle" fill="${labelColor}">${name}</text>`);
  }

  out.push('</svg>');
  return out.join('\n');
}
