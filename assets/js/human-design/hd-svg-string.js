// hd-svg-string.js — DOM-free bodygraph SVG 字串渲染器（Node 與瀏覽器皆可用）
// 與 hd-svg.js 共用「同一份 hd-geometry.js 幾何」與「同一個引擎 chart 物件」，
// 差別只在：本檔輸出 SVG 字串、完全不依賴 document，故可在 Node 烤靜態 SVG（給報告產生器），
// 也可在前端直接 innerHTML。皮膚（配色）由 theme 參數決定——同一套引擎＋幾何，兩種外觀。
//
// 用法：
//   import { computeChart } from './hd-engine.js';
//   import { renderBodygraphSvg } from './hd-svg-string.js';
//   const svg = renderBodygraphSvg(computeChart(input), { theme: 'report' });

import {
  CENTER_SHAPES, GATE_ANCHORS, CENTER_DRAW_ORDER, CENTER_LABEL_POS,
  CHANNEL_PATHS, OUTSIDE_LABELS, VIEWBOX, channelFullD, channelHalfDs,
} from './hd-geometry.js';
import { CHANNELS } from './hd-data-channels.js';
import { CENTERS } from './hd-data-centers.js';

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
  // 精緻報告版：標準人類圖「逐中心」配色（與離線報告產生器 bodygraph.py 同一份色票）
  report: {
    bg: 'transparent',
    base: '#e2dbc9',
    design: '#c14b42', personality: '#23252a',
    doubleStyle: 'stripe', // 紅實線 + 黑虛線疊出條紋
    centerColors: {
      head: ['#f0d873', '#9a8a2e'], ajna: ['#a9c97e', '#5f7a3a'], throat: ['#bf9263', '#7c5a34'],
      g: ['#d8e25e', '#76803a'], heart: ['#d9534f', '#8e2f2c'], sacral: ['#d9534f', '#8e2f2c'],
      spleen: ['#ad8a64', '#71573b'], solar: ['#c79a64', '#7c5a34'], root: ['#ad8a64', '#71573b'],
    },
    open: ['#ffffff', '#b4b4ac'],
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

// chart：computeChart() 的輸出（含 gateActivations / definedCenters）
// opts.theme：'report' | 'gold'（預設 report）
export function renderBodygraphSvg(chart, opts = {}) {
  const theme = THEMES[opts.theme] || THEMES.report;
  const { minX, minY, w, h } = VIEWBOX;
  const ga = chart.gateActivations || {};
  const definedCenters = new Set(chart.definedCenters || []);
  const centerFill = (id) => {
    if (!definedCenters.has(id)) return theme.open;
    return theme.centerColors ? theme.centerColors[id] : theme.defined;
  };
  const out = [];

  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${w} ${h}" role="img" aria-label="人類圖 bodygraph">`);
  out.push('<style>text{font-family:"Noto Sans TC","Microsoft JhengHei","PingFang TC",sans-serif}</style>');
  if (theme.bg && theme.bg !== 'transparent') {
    out.push(`<rect x="${minX}" y="${minY}" width="${w}" height="${h}" fill="${theme.bg}"/>`);
  }

  // ---- 1) 通道底層：全 36 條弧線（淺色），長通道往外彎、互不交叉 ----
  for (const ch of CHANNELS) {
    const p = CHANNEL_PATHS[ch.id];
    if (!p) continue;
    out.push(`<path d="${channelFullD(p)}" fill="none" stroke="${theme.base}" stroke-width="4.5" stroke-linecap="round"/>`);
  }

  // ---- 2) 啟動／懸掛半段：任一端閘門啟動，那半線就上色（含未連通的懸掛閘門，呈現顯隱關係）----
  const drawHalf = (seg, act) => {
    if (act.p && act.d) {
      out.push(`<path d="${seg}" fill="none" stroke="${theme.design}" stroke-width="7.5" stroke-linecap="round"/>`);
      if (theme.doubleStyle === 'stripe') {
        out.push(`<path d="${seg}" fill="none" stroke="${theme.personality}" stroke-width="7.5" stroke-linecap="butt" stroke-dasharray="5 5"/>`);
      } else {
        out.push(`<path d="${seg}" fill="none" stroke="${theme.personality}" stroke-width="3" stroke-linecap="round"/>`);
      }
    } else {
      out.push(`<path d="${seg}" fill="none" stroke="${act.p ? theme.personality : theme.design}" stroke-width="7.5" stroke-linecap="round"/>`);
    }
  };
  for (const ch of CHANNELS) {
    const p = CHANNEL_PATHS[ch.id];
    if (!p) continue;
    const [h0, h1] = channelHalfDs(p); // h0↔ch.gates[0]（小）、h1↔ch.gates[1]（大）
    const a0 = ga[ch.gates[0]];
    const a1 = ga[ch.gates[1]];
    if (a0) drawHalf(h0, a0);
    if (a1) drawHalf(h1, a1);
  }

  // ---- 3) 九大中心 ----
  for (const id of CENTER_DRAW_ORDER) {
    const s = CENTER_SHAPES[id];
    const [fill, stroke] = centerFill(id);
    if (s.kind === 'rect') {
      out.push(`<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`);
    } else {
      out.push(`<polygon points="${s.points.map((q) => q.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`);
    }
  }

  // ---- 4) 閘門（頂層）：未啟動＝空心；設計=紅、個性=黑、雙重=左紅右黑＋白圈框 ----
  const r = 8;
  for (const [gStr, pos] of Object.entries(GATE_ANCHORS)) {
    const [x, y] = pos;
    const act = ga[gStr];
    if (!act) {
      out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#c7c7c0" stroke-width="1"/>`);
      out.push(`<text x="${x}" y="${y}" font-size="8.5" text-anchor="middle" dominant-baseline="central" fill="#9aa0ab">${gStr}</text>`);
      continue;
    }
    if (act.p && act.d) {
      out.push(`<path d="M${x},${y - r} A${r},${r} 0 0 0 ${x},${y + r} Z" fill="${theme.design}"/>`);
      out.push(`<path d="M${x},${y - r} A${r},${r} 0 0 1 ${x},${y + r} Z" fill="${theme.personality}"/>`);
    } else {
      out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${act.p ? theme.personality : theme.design}"/>`);
    }
    out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="1.2"/>`);
    out.push(`<text x="${x}" y="${y}" font-size="8.5" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="#fff">${gStr}</text>`);
  }

  // ---- 5) 中心標籤 ----
  for (const id of CENTER_DRAW_ORDER) {
    const [lx, ly] = CENTER_LABEL_POS[id];
    const name = CENTERS[id].nameZh.replace('中心', '');
    if (OUTSIDE_LABELS.includes(id)) {
      // 三角太小：標籤畫在中心右外側、左對齊、固定深色（白底也看得見）
      out.push(`<text x="${lx}" y="${ly}" font-size="11" font-weight="600" text-anchor="start" dominant-baseline="middle" fill="#555">${name}</text>`);
      continue;
    }
    const [fill] = centerFill(id);
    const def = definedCenters.has(id);
    const labelColor = def ? (luminance(fill) > 0.62 ? '#4a4a30' : '#ffffff') : '#9aa0ab';
    out.push(`<text x="${lx}" y="${ly}" font-size="11" font-weight="600" text-anchor="middle" dominant-baseline="middle" fill="${labelColor}">${name}</text>`);
  }

  out.push('</svg>');
  return out.join('\n');
}
