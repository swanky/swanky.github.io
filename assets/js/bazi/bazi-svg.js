// bazi-svg.js — 四柱命式卡 SVG（頁面內嵌＋PNG 匯出同一資料源）＋PNG iTXt payload 注入。
//
// 命式卡：柱名／天干十神／天干大字／地支大字／藏干／納音，日柱標「日主」、品牌金系。
// PNG payload schema 對齊三重地圖統一格式 {tool:'bazi',v:1,…}（§10.3），報告端可零打字消費。
// iTXt 注入（crc32／IEND 定位）內聯，八字模組自包含、不牽連 HD 引擎。
import { WUXING_COLOR } from './bazi-ganzhi.js';

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FONT = "font-family:'Noto Sans TC','Microsoft JhengHei',sans-serif"; // 單引號＝嚴格 XML 安全
const GOLD = '#E5A300', INK = '#3a3226', SUB = '#8a7f6a', PAPER = '#fffaf0';

// 命式卡尺寸
const W = 760;
const PILLAR_TOP = 132;

// 建命式卡 SVG 字串。chart=computePillars 結果、analysis=analyzeChart 結果、meta={name,dateLabel,timeLabel,placeLabel}
export function buildMingCard(chart, analysis, meta = {}) {
  const cols = ['year', 'month', 'day', 'hour'].filter((k) => chart.pillars[k]);
  const names = { year: '年柱', month: '月柱', day: '日柱', hour: '時柱' };
  const padX = 44;
  const colW = (W - padX * 2) / cols.length;

  let body = '';
  // 標題
  body += `<text x="${W / 2}" y="52" text-anchor="middle" font-size="26" font-weight="800" fill="${INK}" style="${FONT}">八字命式</text>`;
  body += `<text x="${W / 2}" y="80" text-anchor="middle" font-size="13" fill="${GOLD}" style="${FONT}">史旺基工作室・自我探索實驗室</text>`;
  // 出生字幕
  const sub = [meta.name, meta.dateLabel, meta.timeLabel, meta.placeLabel].filter(Boolean).join('　·　');
  if (sub) body += `<text x="${W / 2}" y="106" text-anchor="middle" font-size="13" fill="${SUB}" style="${FONT}">${esc(sub)}</text>`;

  // 四柱
  cols.forEach((key, i) => {
    const p = chart.pillars[key];
    const cx = padX + colW * (i + 0.5);
    const isDay = key === 'day';
    const ann = analysis.tenGods[key];
    // 日主列金色底
    if (isDay) body += `<rect x="${padX + colW * i + 4}" y="${PILLAR_TOP - 6}" width="${colW - 8}" height="238" rx="12" fill="#fdf3e0" stroke="${GOLD}" stroke-width="1.5"/>`;
    // 柱名
    body += `<text x="${cx}" y="${PILLAR_TOP + 14}" text-anchor="middle" font-size="14" fill="${SUB}" style="${FONT}">${names[key]}</text>`;
    // 天干十神（日柱＝日主）
    body += `<text x="${cx}" y="${PILLAR_TOP + 40}" text-anchor="middle" font-size="13" fill="${isDay ? GOLD : SUB}" font-weight="${isDay ? 700 : 400}" style="${FONT}">${esc(ann.ganGod)}</text>`;
    // 天干大字（五行色）
    body += `<text x="${cx}" y="${PILLAR_TOP + 96}" text-anchor="middle" font-size="54" font-weight="800" fill="${WUXING_COLOR[p.ganWuxing]}" style="${FONT}">${esc(p.ganName)}</text>`;
    // 地支大字（五行色）
    body += `<text x="${cx}" y="${PILLAR_TOP + 158}" text-anchor="middle" font-size="54" font-weight="800" fill="${WUXING_COLOR[p.zhiWuxing]}" style="${FONT}">${esc(p.zhiName)}</text>`;
    // 藏干（天干名橫排）
    const hid = ann.hiddenGods.map((h) => h.gan).join(' ');
    body += `<text x="${cx}" y="${PILLAR_TOP + 188}" text-anchor="middle" font-size="14" fill="${INK}" style="${FONT}">藏 ${esc(hid)}</text>`;
    // 納音
    body += `<text x="${cx}" y="${PILLAR_TOP + 212}" text-anchor="middle" font-size="12" fill="${SUB}" style="${FONT}">${esc(p.nayin)}</text>`;
  });

  // 五行分布條
  let y = PILLAR_TOP + 268;
  body += `<text x="${padX}" y="${y}" font-size="15" font-weight="700" fill="${INK}" style="${FONT}">五行分布</text>`;
  y += 18;
  const order = ['木', '火', '土', '金', '水'];
  const barMax = W - padX * 2 - 90;
  order.forEach((w) => {
    const pct = analysis.wuxing.percent[w] || 0;
    body += `<text x="${padX}" y="${y + 15}" font-size="14" fill="${INK}" style="${FONT}">${w}</text>`;
    body += `<rect x="${padX + 26}" y="${y + 3}" width="${barMax}" height="16" rx="8" fill="#efe7d5"/>`;
    body += `<rect x="${padX + 26}" y="${y + 3}" width="${(barMax * pct / 100).toFixed(1)}" height="16" rx="8" fill="${WUXING_COLOR[w]}"/>`;
    body += `<text x="${W - padX}" y="${y + 15}" text-anchor="end" font-size="13" fill="${SUB}" style="${FONT}">${pct}%</text>`;
    y += 26;
  });

  // 底部：傾向＋免責＋網址
  y += 14;
  const st = analysis.strength;
  body += `<text x="${padX}" y="${y}" font-size="13" fill="${INK}" style="${FONT}">日主${esc(analysis.dayGanName)}（${esc(analysis.dayWuxing)}）· 傾向：${esc(st.tendency)}</text>`;
  y += 22;
  body += `<text x="${padX}" y="${y}" font-size="11" fill="${SUB}" style="${FONT}">結果供自我觀察與討論，不作命定判斷 · 日柱排法 beta 驗證中 · swanky.github.io</text>`;

  const H = y + 24;
  return { svg: `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="八字命式卡"><rect width="${W}" height="${H}" fill="${PAPER}"/><rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="16" fill="none" stroke="#efe0c2" stroke-width="1.5"/>${body}</svg>`, w: W, h: H };
}

// ── PNG 匯出（SVG → canvas → PNG ＋ iTXt payload）────────────────────
export function exportMingCardPng({ svg, w, h }, { filename = 'bazi-mingpan.png', payload = null, scale = 2 } = {}) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = w * scale; canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fffaf0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob(async (out) => {
      let final = out;
      if (payload) {
        try {
          const bytes = new Uint8Array(await out.arrayBuffer());
          final = new Blob([injectPngText(bytes, 'bazi', JSON.stringify(payload))], { type: 'image/png' });
        } catch (e) { /* 注入失敗仍下載原圖 */ }
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(final);
      a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}

// ── iTXt 注入（內聯，PNG metadata；與 hd-svg 同格式）──────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function findIENDOffset(png) {
  for (let i = png.length - 8; i >= 0; i--)
    if (png[i] === 0x49 && png[i + 1] === 0x45 && png[i + 2] === 0x4e && png[i + 3] === 0x44) return i - 4;
  return png.length - 12;
}
function injectPngText(png, keyword, text) {
  const enc = new TextEncoder();
  const kw = enc.encode(keyword);
  const txt = enc.encode(text);
  const data = new Uint8Array(kw.length + 5 + txt.length);
  let o = 0;
  data.set(kw, o); o += kw.length;
  data[o++] = 0; data[o++] = 0; data[o++] = 0; data[o++] = 0; data[o++] = 0;
  data.set(txt, o);
  const type = enc.encode('iTXt');
  const chunk = new Uint8Array(8 + data.length + 4);
  const dv = new DataView(chunk.buffer);
  dv.setUint32(0, data.length, false);
  chunk.set(type, 4);
  chunk.set(data, 8);
  const crcInput = new Uint8Array(4 + data.length);
  crcInput.set(type, 0); crcInput.set(data, 4);
  dv.setUint32(8 + data.length, crc32(crcInput), false);
  const iend = findIENDOffset(png);
  const out = new Uint8Array(png.length + chunk.length);
  out.set(png.subarray(0, iend), 0);
  out.set(chunk, iend);
  out.set(png.subarray(iend), iend + chunk.length);
  return out;
}
