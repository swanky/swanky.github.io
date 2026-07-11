// hd-export-v2.js — BodyGraph v2 匯出四式（spec v2 §11）。
// 1 原始 SVG · 2 透明背景 PNG（bodygraph 本體）· 3 品牌卡 2x PNG · 4 社群卡 1200×1500 PNG。
// 卡片＝字串組裝：renderBodygraph(background:false) 巢狀嵌入一張大 SVG，行星雙欄以 v2 視覺 tokens 畫回，
// 再光柵化（core-export.downloadPngFromSvg）。三種 PNG 全部注入 hd-birth iTXt（keyword+payload{name,date,time,place,…}）。
// 幾何/主題只讀不改（hd-geometry-v2 / hd-theme 皆紅線）；行星欄畫法參照 v1 hd-svg.js 舊卡、但配色改讀 THEMES_V2.modern。

import { renderBodygraph } from './hd-bodygraph.js';
import { THEMES_V2 } from './hd-theme.js';
import { VIEWBOX2 } from './hd-geometry-v2.js';
import { PLANETS } from './hd-data-texts.js';
import { downloadPngFromSvg, downloadSvgString } from '../core/core-export.js';

const THEME_ID = 'modern';                 // v2 頁面＝Modern Editorial；匯出與畫面一致
const BG_W = VIEWBOX2.w, BG_H = VIEWBOX2.h; // 1000 × 1400
// 字型：CJK stack，字名含空白須「單引號」（嚴格 XML；PNG 匯出過往踩過雙引號坑）。
const FONT = "'Noto Sans TC','PingFang TC','Microsoft JhengHei','Heiti TC',sans-serif";

const theme = () => THEMES_V2[THEME_ID];
const num = (n) => Math.round(n * 100) / 100;
const escXml = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── 把 renderBodygraph 的完整 <svg> 改寫成可定位巢狀 <svg>（保留內部 defs/群組不動）──────────
// 輸出格式為本專案自控、開頭前綴穩定（<svg xmlns=… viewBox=… width=… height=… role=… aria=…>），
// 僅替換最外層開頭標籤：加 x/y/width/height、去 xmlns/role/aria（避免卡片內重複 aria）。
function embedBodygraph(hdChart, { x, y, w, h }) {
  const svg = renderBodygraph(hdChart, { theme: THEME_ID, background: false, interactive: false });
  return svg.replace(
    /^<svg\b[^>]*>/,
    `<svg x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" viewBox="${VIEWBOX2.minX} ${VIEWBOX2.minY} ${BG_W} ${BG_H}" preserveAspectRatio="xMidYMid meet">`,
  );
}

// ── 行星欄（v2 tokens）：13 天體 × gate.line＋固定箭頭▲▼；design 紅 / personality 黑（同 v1 契約）──
function planetColumnSvg(chart, side, { x, y, w, h, th }) {
  const isD = side === 'design';
  const color = isD ? th.channel.design : th.channel.personality;
  const data = (isD ? chart.design : chart.personality) || {};
  const titleZh = isD ? '設計 · 無意識' : '個性 · 意識';
  const titleH = 46;
  const rowH = (h - titleH) / PLANETS.length;
  const p = [];
  p.push(`<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" rx="14" fill="${th.skin.surface}" stroke="${th.page.cardBorder}" stroke-width="1"/>`);
  p.push(`<text x="${num(x + 16)}" y="${num(y + 29)}" font-family="${FONT}" font-size="17" font-weight="700" fill="${color}">${titleZh}</text>`);
  p.push(`<line x1="${num(x + 14)}" y1="${num(y + titleH)}" x2="${num(x + w - 14)}" y2="${num(y + titleH)}" stroke="${th.page.cardBorder}" stroke-width="1"/>`);
  PLANETS.forEach((pl, i) => {
    const cy = y + titleH + rowH * (i + 0.5);
    const pos = data[pl.id] || {};
    const fix = pos.fixing ? (pos.fixing === 'exalted' ? ' ▲' : ' ▼') : '';
    const val = (pos.gate != null) ? `${pos.gate}.${pos.line}${fix}` : '–';
    p.push(`<text x="${num(x + 16)}" y="${num(cy)}" font-family="${FONT}" font-size="20" fill="${color}" dominant-baseline="central">${escXml(pl.glyph)}</text>`);
    p.push(`<text x="${num(x + 46)}" y="${num(cy)}" font-family="${FONT}" font-size="14" fill="#8a8577" dominant-baseline="central">${escXml(pl.nameZh)}</text>`);
    p.push(`<text x="${num(x + w - 14)}" y="${num(cy)}" font-family="${FONT}" font-size="17" font-weight="600" fill="${color}" text-anchor="end" dominant-baseline="central" style="font-variant-numeric:tabular-nums">${escXml(val)}</text>`);
  });
  return `<g>${p.join('')}</g>`;
}

// ── 卡片版面（品牌卡自然尺寸／社群卡 1200×1500 共用同一算法）────────────────────────────────
// 中段＝[行星(design) | bodygraph | 行星(personality)] 置中；bodygraph 依可用寬高等比縮放。
function cardLayout(W, H) {
  const P = Math.round(W * 0.036);
  const headerH = Math.round(H * 0.11);
  const footerH = Math.round(H * 0.055);
  const gap = 20;
  const PW = Math.max(150, Math.round((W - 2 * P) * 0.16));
  const midTop = P + headerH;
  const midBot = H - P - footerH;
  const midH = midBot - midTop;
  const scale = Math.min((W - 2 * P - 2 * PW - 2 * gap) / BG_W, midH / BG_H);
  const bgW = BG_W * scale, bgH = BG_H * scale;
  const bgX = (W - bgW) / 2, bgY = midTop + (midH - bgH) / 2;
  const leftX = P + ((bgX - P) - PW) / 2;
  const rightX = (bgX + bgW) + (((W - P) - (bgX + bgW)) - PW) / 2;
  return { P, headerH, footerH, PW, bgW, bgH, bgX, bgY, colY: bgY, colH: bgH, leftX, rightX };
}

function composeCard({ hdChart, chart, th, width: W, height: H, title, line1, line2 }) {
  const L = cardLayout(W, H);
  const cx = W / 2;
  const gf = th.skin.goldFrame;
  const parts = [];
  parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${th.skin.surface}"/>`);
  if (gf) parts.push(`<rect x="${gf.inset}" y="${gf.inset}" width="${W - 2 * gf.inset}" height="${H - 2 * gf.inset}" rx="${gf.r}" fill="none" stroke="${gf.color}" stroke-opacity="${gf.alpha}" stroke-width="${gf.w}"/>`);
  // 行星雙欄 + bodygraph（互不重疊，順序無妨）
  parts.push(planetColumnSvg(chart, 'design', { x: L.leftX, y: L.colY, w: L.PW, h: L.colH, th }));
  parts.push(planetColumnSvg(chart, 'personality', { x: L.rightX, y: L.colY, w: L.PW, h: L.colH, th }));
  parts.push(embedBodygraph(hdChart, { x: L.bgX, y: L.bgY, w: L.bgW, h: L.bgH }));
  // 標題帶（姓名／Type·Authority·Profile／出生資料）
  parts.push(`<text x="${cx}" y="${num(L.P + 42)}" text-anchor="middle" font-family="${FONT}" font-size="32" font-weight="700" fill="#2b2b2b">${escXml(title)}</text>`);
  if (line1) parts.push(`<text x="${cx}" y="${num(L.P + 78)}" text-anchor="middle" font-family="${FONT}" font-size="19" font-weight="600" fill="#B07A00">${escXml(line1)}</text>`);
  if (line2) parts.push(`<text x="${cx}" y="${num(L.P + 106)}" text-anchor="middle" font-family="${FONT}" font-size="15" fill="#8a8577">${escXml(line2)}</text>`);
  // 頁尾品牌帶
  const fy = H - L.P - L.footerH / 2;
  parts.push(`<text x="${cx}" y="${num(fy)}" text-anchor="middle" font-family="${FONT}" font-size="17" font-weight="700" fill="${gf ? gf.color : '#E5A300'}">swanky.github.io/human-design</text>`);
  parts.push(`<text x="${cx}" y="${num(fy + 24)}" text-anchor="middle" font-family="${FONT}" font-size="13" fill="#9a9484">免費生成你的人類圖 · 出生資料不離開瀏覽器</text>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${parts.join('')}</svg>`;
}

const itxtOf = (meta) => (meta ? { keyword: 'hd-birth', json: meta } : null);

// ── 公開 API ──────────────────────────────────────────────────────────────────
// bundle：{ hdChart, chart, meta, headerTitle, titleText, subText, filenameBase, onError }
//   hdChart＝toHumanDesignChart(chart)；chart＝原始 computeChart（供行星欄）；meta＝iTXt payload（同 v1）。

// 1) 原始 SVG（畫面向量原檔；含卡面底＋金框；靜態、不含 hit 層）
export function exportBodygraphSvg(b) {
  const svg = renderBodygraph(b.hdChart, { theme: THEME_ID, background: true, interactive: false });
  downloadSvgString({ svg, filename: `${b.filenameBase}.svg` });
}

// 2) 透明背景 PNG（bodygraph 本體去頁底色，2x；帶 alpha）
export function exportTransparentPng(b) {
  const svg = renderBodygraph(b.hdChart, { theme: THEME_ID, background: false, interactive: false });
  downloadPngFromSvg({
    svg, width: BG_W, height: BG_H, scale: 2, background: null,
    filename: `${b.filenameBase}-transparent.png`, itxt: itxtOf(b.meta), onError: b.onError,
  });
}

// 3) 品牌卡 2x PNG（bodygraph＋行星雙欄＋標題/字幕＋品牌頁尾）
export function exportBrandCard(b) {
  const W = 1320, H = 1440;
  const svg = composeCard({ hdChart: b.hdChart, chart: b.chart, th: theme(), width: W, height: H, title: b.headerTitle, line1: b.titleText, line2: b.subText });
  downloadPngFromSvg({
    svg, width: W, height: H, scale: 2, background: theme().skin.surface,
    filename: `${b.filenameBase}-card.png`, itxt: itxtOf(b.meta), onError: b.onError,
  });
}

// 4) 社群卡 1200×1500 PNG（品牌卡變體，社群直式比例）
export function exportSocialCard(b) {
  const W = 1200, H = 1500;
  const svg = composeCard({ hdChart: b.hdChart, chart: b.chart, th: theme(), width: W, height: H, title: b.headerTitle, line1: b.titleText, line2: b.subText });
  downloadPngFromSvg({
    svg, width: W, height: H, scale: 1, background: theme().skin.surface,
    filename: `${b.filenameBase}-social.png`, itxt: itxtOf(b.meta), onError: b.onError,
  });
}
