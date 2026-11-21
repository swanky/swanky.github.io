// ziwei-svg.js — 紫微斗數 4×4 方格命盤 SVG（純字串、零外部資源，可轉 PNG）。
// 版面：傳統地支方位（巳午未申在上、寅丑子亥在下），中央 2×2 放基本資料與四化圖例。
// 設計重點：主星大字、四化彩色徽章、命宮金框、選取宮藍框、三方四正金色虛框＋「對宮／三合」標籤（不畫穿過中央文字的連線）。
import { sanFangSiZheng } from './ziwei-engine.js';

// 地支 → 格子 [col,row]
const BRANCH_POS = {
  巳: [0, 0], 午: [1, 0], 未: [2, 0], 申: [3, 0],
  辰: [0, 1], 酉: [3, 1],
  卯: [0, 2], 戌: [3, 2],
  寅: [0, 3], 丑: [1, 3], 子: [2, 3], 亥: [3, 3],
};

export const THEMES = {
  light: {
    bg: '#fffaf0', cell: '#ffffff', cellAlt: '#fdf6e6', line: '#e2cf9a', lineStrong: '#b6820a',
    ink: '#2a2418', sub: '#7a6a4a', faint: '#a89a7a', soul: '#b6820a', center: '#fbf3df', sf: '#b6820a', sel: '#2f6fb5',
  },
  dark: {
    bg: '#0f1424', cell: '#161d33', cellAlt: '#1b2440', line: '#3a4466', lineStrong: '#e5b54a',
    ink: '#f4ead2', sub: '#c9b98f', faint: '#8d8aa0', soul: '#e5b54a', center: '#121a30', sf: '#e5b54a', sel: '#7fb0ff',
  },
};

export const MUTAGEN_COLOR = { 祿: '#2e8b57', 權: '#c0631d', 科: '#2f6fb5', 忌: '#c0392b' };
const BRIGHT_SHORT = { 廟: '廟', 旺: '旺', 得: '得', 利: '利', 平: '平', 不: '不得', 陷: '陷' };

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FONT = "'Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif";

// m：徽章文字（可為「祿」或「化祿」）；顏色依最後一個字（祿權科忌）決定。
function mutagenBadge(x, y, m, size) {
  const c = MUTAGEN_COLOR[String(m).slice(-1)];
  const w = String(m).length * (size - 2) + 8;
  return `<rect x="${x}" y="${y - size + 1}" width="${w}" height="${size + 4}" rx="4" fill="${c}"/>`
    + `<text x="${x + w / 2}" y="${y + 1}" text-anchor="middle" font-size="${size - 2}" font-weight="700" fill="#fff">${m}</text>`;
}

// opts: { theme:'light'|'dark', selected: palaceIndex|null, name, showHoroscope: true }
export function buildZiweiSvg(chart, opts = {}) {
  const T = THEMES[opts.theme] || THEMES.light;
  const S = 800;
  const G = 6; // 外框留白
  const C = (S - G * 2) / 4; // 格寬
  const P = chart.palaces;
  const h = chart.horoscope;
  const sel = opts.selected == null ? P.find((p) => p.isSoul).index : opts.selected;
  const sf = sanFangSiZheng(sel);
  const sfSet = new Set([sf.self, sf.opposite, sf.trineA, sf.trineB]);
  let s = `<rect width="${S}" height="${S}" fill="${T.bg}"/>`;

  const cellXY = (p) => { const [c, r] = BRANCH_POS[p.branch]; return [G + c * C, G + r * C]; };

  // 中央區
  const cx0 = G + C; const cy0 = G + C; const cw = C * 2;
  s += `<rect x="${cx0 + 3}" y="${cy0 + 3}" width="${cw - 6}" height="${cw - 6}" rx="10" fill="${T.center}" stroke="${T.line}" stroke-width="1.5"/>`;
  const mid = cx0 + cw / 2;
  const k = opts.compact ? 1.6 : 1; // 手機版中央字級放大、省略次要行
  let ty = cy0 + 58 * k;
  s += `<text x="${mid}" y="${ty}" text-anchor="middle" font-size="${30 * k}" font-weight="700" fill="${T.ink}">${esc(opts.name || '紫微斗數命盤')}</text>`;
  ty += 40 * k;
  s += `<text x="${mid}" y="${ty}" text-anchor="middle" font-size="${17 * k}" fill="${T.sub}">${esc(chart.solarDate)} ${esc(chart.timeName)}・${chart.input.gender === 'male' ? '男' : '女'}</text>`;
  if (!opts.compact) {
    ty += 28;
    s += `<text x="${mid}" y="${ty}" text-anchor="middle" font-size="17" fill="${T.sub}">農曆 ${esc(chart.lunarDate)}</text>`;
    ty += 28;
    s += `<text x="${mid}" y="${ty}" text-anchor="middle" font-size="17" fill="${T.sub}">${esc(chart.chineseDate)}</text>`;
  }
  ty += 44 * k;
  s += `<text x="${mid}" y="${ty}" text-anchor="middle" font-size="${21 * k}" font-weight="700" fill="${T.ink}">${esc(chart.fiveElementsClass)}</text>`;
  if (!opts.compact) s += `<text x="${mid}" y="${ty + 30}" text-anchor="middle" font-size="18" fill="${T.sub}">命主 ${esc(chart.soul)}　身主 ${esc(chart.body)}</text>`;
  ty += opts.compact ? 64 : 76;
  // 四化圖例
  const legend = ['祿', '權', '科', '忌'];
  if (opts.compact) {
    const lw = 92; const lx0 = mid - (lw * 4) / 2;
    legend.forEach((m, i) => { s += mutagenBadge(lx0 + i * lw + 8, ty + 6, `化${m}`, 36); });
  } else {
    const lw = 74; const lx0 = mid - (lw * 4) / 2;
    legend.forEach((m, i) => {
      const x = lx0 + i * lw;
      s += mutagenBadge(x + 6, ty, m, 18);
      s += `<text x="${x + 36}" y="${ty}" font-size="16" fill="${T.sub}">化${m}</text>`;
    });
  }
  ty += 40;
  if (h && opts.showHoroscope !== false && !opts.compact) {
    s += `<text x="${mid}" y="${ty}" text-anchor="middle" font-size="15" fill="${T.sub}">目前大限 ${h.decadal.range ? h.decadal.range.join('–') : ''} 歲（${esc(h.decadal.palace)}）・${esc(h.yearly.stemBranch)} 流年在${esc(h.yearly.palace)}</text>`;
  }
  if (!opts.compact) s += `<text x="${mid}" y="${cy0 + cw - 18}" text-anchor="middle" font-size="12" fill="${T.faint}">swanky.github.io/ziwei ・ 史旺基自我探索實驗室</text>`;

  // 十二宮
  for (const p of P) {
    const [x, y] = cellXY(p);
    const isSel = p.index === sel && opts.highlightSel !== false;
    const inSF = sfSet.has(p.index);
    const isDec = h && h.decadal.palaceIndex === p.index;
    const isYear = h && h.yearly.palaceIndex === p.index;
    const fill = inSF ? T.cellAlt : T.cell;
    // 點選的剛好是命宮：維持金框（加粗），不讓藍框蓋掉「金框＝命宮」
    const stroke = isSel && !p.isSoul ? T.sel : (p.isSoul ? T.soul : (inSF ? T.sf : T.line));
    const sw = isSel ? (p.isSoul ? 5 : 4) : (p.isSoul ? 3.5 : (inSF ? 2.5 : 1.5));
    const dash = inSF && !isSel && !p.isSoul ? ' stroke-dasharray="9 6"' : '';
    s += `<g class="zw-cell" data-idx="${p.index}" style="cursor:pointer">`;
    s += `<rect x="${x + 3}" y="${y + 3}" width="${C - 6}" height="${C - 6}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash}/>`;

    // 主星（compact＝手機版：主星放大、省略輔星）
    const big = opts.compact ? 40 : 27;
    const step = opts.compact ? 50 : 36;
    let yy = y + (opts.compact ? 54 : 40);
    if (p.major.length) {
      for (const st of p.major) {
        let xx = x + (opts.compact ? 14 : 16);
        s += `<text x="${xx}" y="${yy}" font-size="${big}" font-weight="700" fill="${T.ink}">${esc(st.name)}</text>`;
        xx += big * 2 + 4;
        if (!opts.compact && st.brightness) s += `<text x="${xx}" y="${yy - 1}" font-size="14" fill="${T.sub}">${esc(BRIGHT_SHORT[st.brightness] || st.brightness)}</text>`;
        if (st.mutagen) s += mutagenBadge(opts.compact ? xx : xx + 6 + 14 * (BRIGHT_SHORT[st.brightness] || st.brightness || '').length, yy - 2, st.mutagen, opts.compact ? 28 : 19);
        yy += step;
      }
    } else {
      s += `<text x="${x + 16}" y="${yy}" font-size="${opts.compact ? 30 : 20}" fill="${T.faint}">空宮</text>`;
      yy += step;
    }
    // 輔星（每行 3 顆；compact 只列有四化的輔星）
    const minors = opts.compact ? p.minor.filter((m) => m.mutagen) : p.minor;
    yy += 2;
    for (let i = 0; i < minors.length; i += 3) {
      let xx = x + 16;
      for (const st of minors.slice(i, i + 3)) {
        const col = st.mutagen ? MUTAGEN_COLOR[st.mutagen] : T.sub;
        const fs = opts.compact ? 26 : 16;
        s += `<text x="${xx}" y="${yy}" font-size="${fs}" font-weight="${st.mutagen ? 700 : 500}" fill="${col}">${esc(st.name)}${st.mutagen ? esc(st.mutagen) : ''}</text>`;
        xx += (st.mutagen ? 3.6 : 3.1) * fs;
      }
      yy += opts.compact ? 32 : 22;
    }

    // 底列：宮名＋干支＋大限
    const by = y + C - 16;
    const nfs = opts.compact ? 28 : 18;
    const nameW = p.name.length * (nfs + 1) + 16;
    s += `<rect x="${x + 12}" y="${by - nfs - 3}" width="${nameW}" height="${nfs + 10}" rx="${(nfs + 10) / 2}" fill="${p.isSoul ? T.soul : 'none'}" stroke="${p.isSoul ? T.soul : T.line}" stroke-width="1.5"/>`;
    s += `<text x="${x + 12 + nameW / 2}" y="${by - 1}" text-anchor="middle" font-size="${nfs}" font-weight="700" fill="${p.isSoul ? (opts.theme === 'dark' ? '#141a2e' : '#fff') : T.ink}">${esc(p.name)}</text>`;
    let tagX = x + 12 + nameW + 8;
    if (p.isBody) {
      const br = opts.compact ? 17 : 12;
      s += `<circle cx="${tagX + br}" cy="${by - br / 2 - 1}" r="${br}" fill="${T.lineStrong}"/><text x="${tagX + br}" y="${by + (opts.compact ? 2 : -1)}" text-anchor="middle" font-size="${opts.compact ? 22 : 15}" font-weight="700" fill="${opts.theme === 'dark' ? '#141a2e' : '#fff'}">身</text>`;
      tagX += 30;
    }
    if (!opts.compact) s += `<text x="${x + C - 14}" y="${by - 1}" text-anchor="end" font-size="16" fill="${T.sub}">${esc(p.stem + p.branch)}</text>`;
    if (p.decadal && !opts.compact) s += `<text x="${x + C - 14}" y="${by - 24}" text-anchor="end" font-size="14" fill="${isDec ? T.lineStrong : T.faint}" font-weight="${isDec ? 700 : 400}">${p.decadal[0]}–${p.decadal[1]}${isDec ? ' 大限' : ''}</text>`;
    if (inSF && !isSel && !opts.compact) {
      const role = p.index === sf.opposite ? '對宮' : '三合';
      s += `<text x="${x + C - 14}" y="${y + (isYear ? 50 : 30)}" text-anchor="end" font-size="14" font-weight="700" fill="${T.sf}">${role}</text>`;
    }
    if (isYear && !opts.compact) s += `<text x="${x + C - 14}" y="${y + 30}" text-anchor="end" font-size="14" font-weight="700" fill="${T.lineStrong}">流年</text>`;
    if (isDec && opts.compact) s += `<rect x="${x + C - 22}" y="${y + 12}" width="10" height="10" rx="5" fill="${T.lineStrong}"/>`;
    s += '</g>';
  }

  return `<svg viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="紫微斗數十二宮命盤" font-family="${FONT}">${s}</svg>`;
}

// 分享圖（深色 1080×1280）：標題＋命盤（固定以命宮為選取）＋署名列。回 { svg, w, h }。
export function buildZiweiShareSvg(chart, { name = '' } = {}) {
  const W = 1080; const H = 1280;
  const T = THEMES.dark;
  const soulIdx = chart.palaces.find((p) => p.isSoul).index;
  const board = buildZiweiSvg(chart, { theme: 'dark', selected: soulIdx, highlightSel: false, name: name ? `${name}的命盤` : '' })
    .replace('<svg ', '<svg x="60" y="170" width="960" height="960" ');
  let s = `<rect width="${W}" height="${H}" fill="${T.bg}"/>`;
  s += `<rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="34" fill="none" stroke="${T.soul}" stroke-opacity="0.5" stroke-width="3"/>`;
  s += `<text x="${W / 2}" y="112" text-anchor="middle" font-size="54" font-weight="800" fill="${T.ink}" font-family="${FONT}">${esc(name ? `${name}的紫微命盤` : '我的紫微命盤')}</text>`;
  s += board;
  s += `<text x="${W / 2}" y="${H - 72}" text-anchor="middle" font-size="26" fill="${T.soul}" font-family="${FONT}">swanky.github.io/ziwei ・ 史旺基自我探索實驗室</text>`;
  return { svg: `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`, w: W, h: H };
}
