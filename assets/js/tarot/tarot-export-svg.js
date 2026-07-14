// tarot-export-svg.js — 把抽牌結果排成一張可下載的圖卡（SVG 字串 → canvas → PNG）。
// 純程式化 SVG（牌面也是向量），故 canvas 不會被外部圖檔汙染，離線、跨瀏覽器一致。
// 底部追加 QR + 網址 CTA，沿用 hd-svg.js 的匯出模式。
import { cardFaceInner, FACE_W, FACE_H } from './tarot-card-svg.js';
import { framedImageInner, hasArt, fetchArtDataUrl } from './tarot-card-image.js';
import { CARDS } from './tarot-deck.js';
import { QR } from './tarot-data-qr.js';
import { downloadPngFromSvg } from '../core/core-export.js';

const GOLD = '#E5A300';
const GOLD_DK = '#b6820a';
const INK = '#2c2a26';
// 字型名用單引號（嚴格 XML 載入做 PNG 匯出時，style 屬性用雙引號，內層字型名不可用雙引號）
const FONT = "'Noto Sans TC','Microsoft JhengHei','PingFang TC','Heiti TC',sans-serif";
const W = 820;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// CJK 友善的折行：每行最多 max 字、最多 maxLines 行（超出以「…」收尾）。
function wrapCJK(s, max, maxLines) {
  const chars = Array.from(String(s || '').replace(/\s+/g, ' ').trim());
  const lines = [];
  let cur = '';
  for (const ch of chars) {
    cur += ch;
    if (cur.length >= max) { lines.push(cur); cur = ''; if (lines.length >= maxLines) break; }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (lines.length === 0) return [''];
  if (lines.length >= maxLines && (cur || chars.length > maxLines * max)) {
    let last = lines[maxLines - 1];
    if (last.length > max - 1) last = last.slice(0, max - 1);
    lines[maxLines - 1] = last + '…';
    lines.length = maxLines;
  }
  return lines;
}

// 回傳 { svg, w, h }
export function buildExportSvg(draw, meta = {}, artMap = {}) {
  const n = draw.length;
  const margin = 60;
  const avail = W - margin * 2;
  const gap = 24;
  const cardW = Math.min(220, Math.floor((avail - (n - 1) * gap) / n));
  const scale = cardW / FACE_W;
  const cardH = Math.round(FACE_H * scale);
  const labelH = 30;

  // 標頭：eyebrow + 標題 + 日期 + 問題
  const qLines = meta.question ? wrapCJK('你問的是：' + meta.question, 30, 3) : [];
  const headerTop = 40;
  const titleY = headerTop + 30;
  const qStartY = titleY + 30;
  const headerH = qStartY + qLines.length * 24 + 18;

  const cardsTop = headerH;
  const contentW = n * cardW + (n - 1) * gap;
  const startX = (W - contentW) / 2;
  const cardsBlockBottom = cardsTop + labelH + cardH + 16;

  // CTA 區
  const ctaTop = cardsBlockBottom + 6;
  const ctaH = 150;
  const H = ctaTop + ctaH;

  let body = '';
  // 外框
  body += `<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>`;
  body += `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="18" fill="#FFFDF7" stroke="#f0e4c4" stroke-width="1.5"/>`;
  // 標頭
  body += `<text x="${margin}" y="${headerTop + 4}" style="font:700 13px ${FONT}; letter-spacing:4px" fill="${GOLD}">職場塔羅・反思一張牌</text>`;
  body += `<text x="${margin}" y="${titleY}" style="font:700 24px ${FONT}" fill="${INK}">${esc(meta.spreadName || '我的塔羅')}</text>`;
  if (meta.dateText) {
    body += `<text x="${W - margin}" y="${titleY}" text-anchor="end" style="font:400 13px ${FONT}" fill="#aaa">${esc(meta.dateText)}</text>`;
  }
  qLines.forEach((ln, i) => {
    body += `<text x="${margin}" y="${qStartY + i * 24}" style="font:400 15px ${FONT}" fill="#6b6457">${esc(ln)}</text>`;
  });
  body += `<line x1="${margin}" y1="${headerH - 12}" x2="${W - margin}" y2="${headerH - 12}" stroke="#efe7d4" stroke-width="1"/>`;

  // 牌
  draw.forEach((d, i) => {
    const card = CARDS[d.cardId];
    if (!card) return;
    const x = startX + i * (cardW + gap);
    const cxCard = x + cardW / 2;
    body += `<text x="${cxCard}" y="${cardsTop + 20}" text-anchor="middle" style="font:700 14px ${FONT}" fill="${GOLD_DK}">${esc(d.slotLabel || '')}</text>`;
    const inner = artMap[d.cardId] ? framedImageInner(card, d.reversed, artMap[d.cardId]) : cardFaceInner(card, d.reversed);
    body += `<g transform="translate(${x} ${cardsTop + labelH}) scale(${scale.toFixed(4)})">${inner}</g>`;
  });

  // CTA：QR + 網址
  const qb = 3, qtot = QR.modules + qb * 2, qsize = 104, qx = margin, qy = ctaTop + 14;
  body += `<g transform="translate(${qx} ${qy}) scale(${(qsize / qtot).toFixed(4)})">`;
  body += `<rect x="0" y="0" width="${qtot}" height="${qtot}" fill="#fff"/>`;
  body += `<path d="${QR.path}" fill="${INK}" transform="translate(${qb} ${qb})"/></g>`;
  const tx = qx + qsize + 28;
  body += `<text x="${tx}" y="${ctaTop + 38}" style="font:700 18px ${FONT}" fill="${INK}">換你抽一張，把卡住的處境想清楚</text>`;
  body += `<text x="${tx}" y="${ctaTop + 64}" style="font:400 12.5px ${FONT}" fill="#888">職場塔羅・不是占卜，是給工程師與主管的一面鏡子</text>`;
  body += `<text x="${tx}" y="${ctaTop + 98}" style="font:700 18px ${FONT}" fill="${GOLD_DK}">${esc(QR.url.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</text>`;
  body += `<text x="${tx}" y="${ctaTop + 120}" style="font:400 11px ${FONT}" fill="#aaa">掃描 QR 或輸入網址，免費抽牌 · 抽牌於瀏覽器內完成、不收集個資</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${body}</svg>`;
  return { svg, w: W, h: H };
}

// 匯出 PNG（SVG 字串 → Blob → Image → canvas → PNG 下載）。
// 有 AI 牌面的牌先抓圖轉 dataURL 內嵌，故為 async。
export async function exportReadingPng(draw, meta = {}, opts = {}) {
  const artMap = {};
  for (const d of draw) {
    const card = CARDS[d.cardId];
    if (card && hasArt(card, meta.deck)) { const url = await fetchArtDataUrl(card, meta.deck); if (url) artMap[d.cardId] = url; }
  }
  const { svg, w, h } = buildExportSvg(draw, meta, artMap);
  downloadPngFromSvg({
    svg,
    width: w,
    height: h,
    scale: opts.scale,
    background: '#fff',
    filename: opts.filename || 'tarot-reading.png',
    onError: opts.onError,
  });
}
