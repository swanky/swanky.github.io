// tarot-card-svg.js — 原創、程式化的牌面 SVG（零外部圖檔 → 可乾淨進 PNG 匯出，不汙染 canvas）。
// 品牌金邊框 + 花色符號 + 牌名；大牌用羅馬數字環。逆位＝中央圖案旋轉 180° + 角落「逆位」標記，牌名維持正向可讀。
// 同一份 inner 標記同時用於：頁面正面、PNG 匯出。座標空間固定 240×360。
import { SUITS } from './tarot-deck.js';

export const FACE_W = 240;
export const FACE_H = 360;
const GOLD = '#E5A300';
const GOLD_DK = '#b6820a';
const CREAM = '#FFFDF7';
const INK = '#2c2a26';
// 字型名用單引號（這份 SVG 會以嚴格 XML 載入做 PNG 匯出，style 屬性用雙引號，故內層字型名不可用雙引號）
const FONT = "'Noto Sans TC','Microsoft JhengHei','PingFang TC','Heiti TC',sans-serif";

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 花色符號（置中於 0,0，可縮放）
function suitGlyph(suit, color) {
  switch (suit) {
    case 'wands':
      return `<g stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <line x1="0" y1="-42" x2="0" y2="42"/>
        <path d="M0 -18 q18 -4 24 -24"/>
        <path d="M0 -4 q-18 -4 -24 -24"/>
      </g>`;
    case 'cups':
      return `<g fill="none" stroke="${color}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
        <path d="M-24 -26 a24 24 0 0 0 48 0"/>
        <line x1="0" y1="22" x2="0" y2="34"/>
        <path d="M-20 36 q20 10 40 0"/>
        <line x1="-24" y1="-26" x2="24" y2="-26"/>
      </g>`;
    case 'swords':
      return `<g stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M-5 -42 L0 -50 L5 -42" fill="${color}"/>
        <line x1="0" y1="-46" x2="0" y2="28"/>
        <line x1="-17" y1="16" x2="17" y2="16"/>
        <circle cx="0" cy="34" r="4.5" fill="${color}"/>
      </g>`;
    case 'pentacles':
      return `<g fill="none" stroke="${color}" stroke-width="4" stroke-linejoin="round">
        <circle cx="0" cy="0" r="32"/>
        <path d="M0 -26 L14.1 17.4 L-22.8 -9.4 L22.8 -9.4 L-14.1 17.4 Z"/>
      </g>`;
    default:
      return '';
  }
}

// 大牌中央：金色細環 + 羅馬數字
function majorGlyph(badge) {
  const fs = badge.length >= 4 ? 30 : badge.length === 3 ? 36 : 44;
  return `<g>
    <circle cx="0" cy="0" r="46" fill="none" stroke="${GOLD}" stroke-width="2.2"/>
    <circle cx="0" cy="0" r="52" fill="none" stroke="${GOLD}" stroke-width="0.8" opacity="0.5"/>
    <circle cx="0" cy="-52" r="2.4" fill="${GOLD}"/>
    <circle cx="0" cy="52" r="2.4" fill="${GOLD}"/>
    <circle cx="-52" cy="0" r="2.4" fill="${GOLD}"/>
    <circle cx="52" cy="0" r="2.4" fill="${GOLD}"/>
    <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
      style="font:700 ${fs}px ${FONT}; letter-spacing:1px" fill="${GOLD_DK}">${esc(badge)}</text>
  </g>`;
}

// 一張牌的內容（不含外層 <svg>）。座標 0..240 × 0..360。
export function cardFaceInner(card, reversed) {
  const suit = card.suit;
  const color = suit ? SUITS[suit].color : GOLD;
  const isMajor = card.arcana === 'major';
  const cx = FACE_W / 2;
  const cy = 150;

  // 中央圖案（逆位時旋轉 180）
  let motif;
  if (isMajor) {
    motif = majorGlyph(card.badge);
  } else {
    const isCourt = card.rank >= 11;
    const label = isCourt ? card.badge : card.badge; // 角落已有 badge；中央放花色符號
    motif = `${suitGlyph(suit, color)}`;
    // 宮廷牌：花色符號下方加一個小冠點綴
    if (isCourt) {
      motif += `<path d="M-22 50 L-11 40 L0 50 L11 40 L22 50 L18 58 L-18 58 Z" fill="none" stroke="${color}" stroke-width="3.5" stroke-linejoin="round"/>`;
    }
  }
  const motifTransform = reversed ? `translate(${cx} ${cy}) rotate(180)` : `translate(${cx} ${cy})`;

  // 花色點綴（小牌：依數字畫小圓點，1..10）
  let pips = '';
  if (!isMajor && card.rank >= 1 && card.rank <= 10) {
    pips = `<text x="${cx}" y="232" text-anchor="middle" style="font:600 13px ${FONT}; letter-spacing:2px" fill="${color}">${esc(SUITS[suit].element)}　${esc(SUITS[suit].domain)}</text>`;
  } else if (!isMajor) {
    pips = `<text x="${cx}" y="232" text-anchor="middle" style="font:600 13px ${FONT}; letter-spacing:2px" fill="${color}">${esc(SUITS[suit].nameZh)}宮廷</text>`;
  } else {
    pips = `<text x="${cx}" y="232" text-anchor="middle" style="font:600 12px ${FONT}; letter-spacing:3px" fill="${GOLD_DK}">大阿爾克那</text>`;
  }

  const revBadge = reversed
    ? `<g transform="translate(${FACE_W - 30} 30)">
        <rect x="-26" y="-13" width="52" height="26" rx="13" fill="${GOLD}"/>
        <text x="0" y="1" text-anchor="middle" dominant-baseline="central" style="font:700 13px ${FONT}" fill="#fff">逆位</text>
      </g>`
    : '';

  return `
    <rect x="6" y="6" width="${FACE_W - 12}" height="${FACE_H - 12}" rx="16" fill="${CREAM}" stroke="${GOLD}" stroke-width="2.5"/>
    <rect x="14" y="14" width="${FACE_W - 28}" height="${FACE_H - 28}" rx="11" fill="none" stroke="${GOLD}" stroke-width="0.9" opacity="0.45"/>
    <text x="24" y="40" style="font:700 19px ${FONT}" fill="${GOLD_DK}">${esc(card.badge)}</text>
    ${revBadge}
    <g transform="${motifTransform}">${motif}</g>
    ${pips}
    <text x="${cx}" y="294" text-anchor="middle" style="font:700 22px ${FONT}" fill="${INK}">${esc(card.nameZh)}</text>
    <text x="${cx}" y="318" text-anchor="middle" style="font:400 12px ${FONT}; letter-spacing:0.5px" fill="#a99">${esc(card.nameEn)}</text>
  `;
}

// 牌背（面朝下）：金色菱格 + 中央星芒
export function cardBackInner() {
  const cx = FACE_W / 2, cy = FACE_H / 2;
  let rays = '';
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i;
    const x = cx + Math.cos(a) * 40, y = cy + Math.sin(a) * 40;
    rays += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${GOLD}" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  return `
    <rect x="6" y="6" width="${FACE_W - 12}" height="${FACE_H - 12}" rx="16" fill="#7a5500"/>
    <rect x="6" y="6" width="${FACE_W - 12}" height="${FACE_H - 12}" rx="16" fill="url(#tarot-back-grad)"/>
    <rect x="16" y="16" width="${FACE_W - 32}" height="${FACE_H - 32}" rx="10" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity="0.7"/>
    <g opacity="0.9">${rays}</g>
    <circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="${GOLD}" stroke-width="2.4"/>
    <circle cx="${cx}" cy="${cy}" r="4" fill="${GOLD}"/>
    <text x="${cx}" y="${FACE_H - 30}" text-anchor="middle" style="font:600 12px ${FONT}; letter-spacing:4px" fill="${GOLD}">職場塔羅</text>
  `;
}

// 包成完整 <svg>（頁面用）
export function faceSvg(card, reversed, cls) {
  return `<svg class="${cls || 'tarot-face-svg'}" viewBox="0 0 ${FACE_W} ${FACE_H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(card.nameZh)}${reversed ? '（逆位）' : ''}">${cardFaceInner(card, reversed)}</svg>`;
}
export function backSvg(cls) {
  return `<svg class="${cls || 'tarot-back-svg'}" viewBox="0 0 ${FACE_W} ${FACE_H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="tarot-back-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8a6310"/><stop offset="1" stop-color="#6b4a00"/>
    </linearGradient></defs>${cardBackInner()}</svg>`;
}
