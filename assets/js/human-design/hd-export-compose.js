// hd-export-compose.js — 合盤匯出四式（B5）：SVG／透明 PNG／品牌卡 PNG／社群卡 PNG。
// 卡片＝字串組裝：renderCompositeBodygraph(background:false) 巢狀嵌入＋四類統計列＋A/B 圖例＋品牌尾。
// 三種 PNG 全部注入 hd-birth iTXt **雙人 payload**（{v,kind:'composite',a:{…},b:{…}}）——站主 2026-07-11
// 拍板「嵌，報告 ingest 便利優先」：客戶傳任一張圖卡即可供報告端排合盤；keyword 沿用 'hd-birth'，
// 報告端以 payload.kind 分流單人/合盤。底層走 core-export（與單人 hd-export-v2 同管線）。
import { renderCompositeBodygraph } from './hd-bodygraph-compose.js';
import { THEMES_V2 } from './hd-theme.js';
import { VIEWBOX2 } from './hd-geometry-v2.js';
import { CATEGORY_TEXTS } from './hd-composite-texts.js';
import { downloadPngFromSvg, downloadSvgString } from '../core/core-export.js';

const THEME_ID = 'modern';
const BG_W = VIEWBOX2.w, BG_H = VIEWBOX2.h; // 1000 × 1400
const FONT = "'Noto Sans TC','PingFang TC','Microsoft JhengHei','Heiti TC',sans-serif";
const CAT_ORDER = ['electromagnetic', 'companionship', 'dominance', 'compromise'];

const theme = () => THEMES_V2[THEME_ID];
const num = (n) => Math.round(n * 100) / 100;
const escXml = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function embedComposite(composite, { x, y, w, h }) {
  const svg = renderCompositeBodygraph(composite, { theme: THEME_ID, background: false, interactive: false });
  return svg.replace(
    /^<svg\b[^>]*>/,
    `<svg x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" viewBox="${VIEWBOX2.minX} ${VIEWBOX2.minY} ${BG_W} ${BG_H}" preserveAspectRatio="xMidYMid meet">`,
  );
}

// 四類統計列（色點＋中文名＋數量），水平置中
function statsRowSvg(composite, th, { cx, y, fontSize }) {
  const ct = th.compose;
  const items = CAT_ORDER.map((k) => ({ color: ct.categories[k], label: CATEGORY_TEXTS[k].nameZh, n: composite.categories[k].length }));
  const itemW = fontSize * 6.4;
  const total = itemW * items.length;
  let x = cx - total / 2;
  const p = [];
  for (const it of items) {
    p.push(`<circle cx="${num(x + fontSize * 0.5)}" cy="${num(y)}" r="${num(fontSize * 0.42)}" fill="${it.color}"/>`);
    p.push(`<text x="${num(x + fontSize * 1.2)}" y="${num(y)}" font-family="${FONT}" font-size="${fontSize}" fill="#4a463e" dominant-baseline="central">${escXml(it.label)} ${it.n}</text>`);
    x += itemW;
  }
  return `<g>${p.join('')}</g>`;
}

// A/B 圖例列（青實線＝A、洋紅虛線＝B）
function legendRowSvg(nameA, nameB, th, { cx, y, fontSize }) {
  const ct = th.compose;
  const segW = fontSize * 2.2;
  const la = `${nameA}`;
  const lb = `${nameB}`;
  const wA = segW + fontSize * (la.length + 1.4);
  const wB = segW + fontSize * (lb.length + 1.4);
  const gap = fontSize * 2;
  let x = cx - (wA + gap + wB) / 2;
  const p = [];
  p.push(`<line x1="${num(x)}" y1="${num(y)}" x2="${num(x + segW)}" y2="${num(y)}" stroke="${ct.a.color}" stroke-width="5" stroke-linecap="round"/>`);
  p.push(`<text x="${num(x + segW + fontSize * 0.5)}" y="${num(y)}" font-family="${FONT}" font-size="${fontSize}" fill="#4a463e" dominant-baseline="central">${escXml(la)}</text>`);
  x += wA + gap;
  p.push(`<line x1="${num(x)}" y1="${num(y)}" x2="${num(x + segW)}" y2="${num(y)}" stroke="${ct.b.color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${ct.bDash}"/>`);
  p.push(`<text x="${num(x + segW + fontSize * 0.5)}" y="${num(y)}" font-family="${FONT}" font-size="${fontSize}" fill="#4a463e" dominant-baseline="central">${escXml(lb)}</text>`);
  return `<g>${p.join('')}</g>`;
}

function composeCard({ composite, nameA, nameB, subText, highlight, width: W, height: H }) {
  const th = theme();
  const gf = th.skin.goldFrame;
  const cx = W / 2;
  const P = Math.round(W * 0.036);
  const headerH = Math.round(H * 0.115);
  const footerH = Math.round(H * 0.06);
  const statsH = Math.round(H * 0.075);
  const midTop = P + headerH;
  const midBot = H - P - footerH - statsH;
  const midH = midBot - midTop;
  const scale = Math.min((W - 2 * P) / BG_W, midH / BG_H);
  const bgW = BG_W * scale, bgH = BG_H * scale;
  const bgX = (W - bgW) / 2, bgY = midTop + (midH - bgH) / 2;

  const parts = [];
  parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${th.skin.surface}"/>`);
  if (gf) parts.push(`<rect x="${gf.inset}" y="${gf.inset}" width="${W - 2 * gf.inset}" height="${H - 2 * gf.inset}" rx="${gf.r}" fill="none" stroke="${gf.color}" stroke-opacity="${gf.alpha}" stroke-width="${gf.w}"/>`);
  parts.push(`<text x="${cx}" y="${num(P + 44)}" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="700" fill="#2b2b2b">${escXml(nameA)} × ${escXml(nameB)}</text>`);
  parts.push(`<text x="${cx}" y="${num(P + 82)}" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="600" fill="#B07A00">${escXml(highlight || '人類圖合盤')}</text>`);
  if (subText) parts.push(`<text x="${cx}" y="${num(P + 110)}" text-anchor="middle" font-family="${FONT}" font-size="15" fill="#8a8577">${escXml(subText)}</text>`);
  parts.push(embedComposite(composite, { x: bgX, y: bgY, w: bgW, h: bgH }));
  parts.push(statsRowSvg(composite, th, { cx, y: midBot + statsH * 0.32, fontSize: 19 }));
  parts.push(legendRowSvg(nameA, nameB, th, { cx, y: midBot + statsH * 0.78, fontSize: 16 }));
  const fy = H - P - footerH / 2;
  parts.push(`<text x="${cx}" y="${num(fy)}" text-anchor="middle" font-family="${FONT}" font-size="17" font-weight="700" fill="${gf ? gf.color : '#E5A300'}">swanky.github.io/human-design/relationship</text>`);
  parts.push(`<text x="${cx}" y="${num(fy + 24)}" text-anchor="middle" font-family="${FONT}" font-size="13" fill="#9a9484">免費人類圖合盤 · 兩人出生資料都不離開瀏覽器</text>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${parts.join('')}</svg>`;
}

const itxtOf = (meta) => (meta ? { keyword: 'hd-birth', json: meta } : null);

// ── 公開 API ──────────────────────────────────────────────────────────────────
// bundle：{ composite, nameA, nameB, meta, subText, highlight, filenameBase, onError }
//   meta＝雙人 iTXt payload {v,kind:'composite',a:{name,date,time,place,tz,offset,unknown_time},b:{…},source}
//   highlight＝一句互動亮點（社群卡標語；由 UI 規則式選材）。

export function exportCompositeSvg(b) {
  const svg = renderCompositeBodygraph(b.composite, { theme: THEME_ID, background: true, interactive: false });
  downloadSvgString({ svg, filename: `${b.filenameBase}.svg` });
}

export function exportCompositeTransparentPng(b) {
  const svg = renderCompositeBodygraph(b.composite, { theme: THEME_ID, background: false, interactive: false });
  downloadPngFromSvg({
    svg, width: BG_W, height: BG_H, scale: 2, background: null,
    filename: `${b.filenameBase}-transparent.png`, itxt: itxtOf(b.meta), onError: b.onError,
  });
}

export function exportCompositeBrandCard(b) {
  const W = 1320, H = 1560;
  const svg = composeCard({ composite: b.composite, nameA: b.nameA, nameB: b.nameB, subText: b.subText, highlight: b.highlight, width: W, height: H });
  downloadPngFromSvg({
    svg, width: W, height: H, scale: 2, background: theme().skin.surface,
    filename: `${b.filenameBase}-card.png`, itxt: itxtOf(b.meta), onError: b.onError,
  });
}

export function exportCompositeSocialCard(b) {
  const W = 1200, H = 1500;
  const svg = composeCard({ composite: b.composite, nameA: b.nameA, nameB: b.nameB, subText: b.subText, highlight: b.highlight, width: W, height: H });
  downloadPngFromSvg({
    svg, width: W, height: H, scale: 1, background: theme().skin.surface,
    filename: `${b.filenameBase}-social.png`, itxt: itxtOf(b.meta), onError: b.onError,
  });
}
