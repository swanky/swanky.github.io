// bazi-svg.js — 四柱命式卡 SVG（頁面內嵌＋PNG 匯出同一資料源）＋PNG iTXt payload 注入。
//
// 命式卡：柱名／天干十神／天干大字／地支大字／藏干／納音，日柱標「日主」、品牌金系。
// PNG payload schema 對齊三重地圖統一格式 {tool:'bazi',v:1,…}（§10.3），報告端可零打字消費。
// iTXt 注入（crc32／IEND 定位）內聯，八字模組自包含、不牽連 HD 引擎。
import { WUXING_COLOR } from './bazi-ganzhi.js';
import { downloadPngFromSvg } from '../core/core-export.js';

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
// canvas→下載尾段與 iTXt 注入已收斂至 core/core-export.js；本函式只負責八字專屬的呼叫組態。
export function exportMingCardPng({ svg, w, h }, { filename = 'bazi-mingpan.png', payload = null, scale = 2 } = {}) {
  downloadPngFromSvg({
    svg,
    width: w,
    height: h,
    scale,
    background: '#fffaf0',
    filename,
    itxt: payload ? { keyword: 'bazi', json: payload } : null,
  });
}
