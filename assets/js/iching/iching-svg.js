// iching-svg.js — 卦象 SVG 繪製（純字串函式，DOM-free，可 node --test）。
// 六爻由下而上堆疊（lines[0]＝初爻在最下）：陽爻一條實心橫 bar，陰爻左右兩段中間留空。
// 動爻（moving）改品牌金 #E5A300 並於右側加小圓點，其餘爻用墨色 #2c2a26；有之卦時本卦／之卦並排、中間畫 → 箭頭。
const GOLD = '#E5A300';
const INK = '#2c2a26';
const PAD = 12;
const LINE_W = 140;
const LINE_H = 16;
const LINE_GAP = 14;
const YIN_SEG = LINE_W * 0.42; // 左右兩段各 42%、中間留 16% 空
const DOT_R = 5;
const DOT_GAP = 16;
const BLOCK_W = LINE_W + DOT_GAP + DOT_R * 2 + 6; // 線寬 + 動爻圓點淨空
const ARROW_W = 60;
const HEX_H = 6 * LINE_H + 5 * LINE_GAP;

function lineRects(isYang, y, color) {
  if (isYang) return `<rect x="0" y="${y}" width="${LINE_W}" height="${LINE_H}" rx="3" fill="${color}"/>`;
  const x2 = LINE_W - YIN_SEG;
  return `<rect x="0" y="${y}" width="${YIN_SEG}" height="${LINE_H}" rx="3" fill="${color}"/>`
    + `<rect x="${x2}" y="${y}" width="${YIN_SEG}" height="${LINE_H}" rx="3" fill="${color}"/>`;
}

// attr：區分本卦(data-ben-line)／之卦(data-zhi-line)，供測試與未來互動精準定位
function hexGroup(lines, moving, attr) {
  let s = '';
  for (let i = 0; i < 6; i++) {
    const row = 5 - i; // 由下而上堆疊：i=0（初爻）畫在最下排
    const y = row * (LINE_H + LINE_GAP);
    const isMoving = moving.includes(i);
    const color = isMoving ? GOLD : INK;
    s += `<g ${attr}="${i}">`;
    s += lineRects(lines[i] === 1, y, color);
    if (isMoving) s += `<circle cx="${LINE_W + DOT_GAP}" cy="${y + LINE_H / 2}" r="${DOT_R}" fill="${GOLD}"/>`;
    s += '</g>';
  }
  return s;
}

// 本卦→之卦的箭頭（與頁面文字 .iching-arrow 同色），置中於 ARROW_W 欄位
function arrowGlyph(cx, cy) {
  const shaftLen = 26, headLen = 12, headHalf = 8;
  const x0 = cx - (shaftLen + headLen) / 2;
  const xHeadStart = x0 + shaftLen;
  const xTip = xHeadStart + headLen;
  return `<line x1="${x0}" y1="${cy}" x2="${xHeadStart}" y2="${cy}" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/>`
    + `<path d="M${xHeadStart},${cy - headHalf} L${xTip},${cy} L${xHeadStart},${cy + headHalf} Z" fill="${GOLD}"/>`;
}

export function buildHexSvg(cast) {
  const lines = cast.lines;
  const moving = cast.moving || [];
  const hasZhi = !!(cast.zhi && moving.length);

  const totalW = PAD * 2 + BLOCK_W + (hasZhi ? ARROW_W + BLOCK_W : 0);
  const totalH = PAD * 2 + HEX_H;

  let body = `<g transform="translate(${PAD},${PAD})">${hexGroup(lines, moving, 'data-ben-line')}</g>`;
  if (hasZhi) {
    const arrowCx = PAD + BLOCK_W + ARROW_W / 2;
    body += arrowGlyph(arrowCx, PAD + HEX_H / 2);
    const zhiX = PAD + BLOCK_W + ARROW_W;
    body += `<g transform="translate(${zhiX},${PAD})">${hexGroup(cast.zhi.lines, [], 'data-zhi-line')}</g>`;
  }

  return `<svg viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="六爻卦象">${body}</svg>`;
}
