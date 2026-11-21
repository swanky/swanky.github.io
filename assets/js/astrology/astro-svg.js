// astro-svg.js — 圓形星座命盤 SVG（星座環＋刻度＋宮位＋四軸＋行星＋相位）。純字串產生、零外部資源（可轉 PNG）。
// 2026-11 重畫（站主：原圖線與符號太小太細）：以 390px 手機實際顯示寬度為設計基準，viewBox 640。
//   - 上升度數固定在 9 點鐘方向（整宮制、等宮制皆然）；沒有出生時間時改以牡羊 0° 置左並在圖上註記。
//   - 行星以角度展開避讓（最小間距 MIN_SEP），引線接回真實度數；相位端點用真實度數。
//   - 符號一律附 U+FE0E 強制文字呈現，避免 Windows／手機把 ♈ ♀ 等畫成彩色 emoji。
import { POINT_IDS } from './astro-chart.js';

const VS = '︎';
const SIGN_GLYPH = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((g) => g + VS);
const SIGN_ZH = ['牡羊', '金牛', '雙子', '巨蟹', '獅子', '處女', '天秤', '天蠍', '射手', '摩羯', '水瓶', '雙魚'];
// 火、土、風、水（色相拉開：橘紅／橄欖／藍紫／青綠）
export const ELEMENT_COLOR = ['#d1572e', '#8a7a1f', '#5a6fd6', '#1f9a8a'];
const POINT_GLYPH = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃',
  saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇', northNode: '☊',
};
// 相位三類：合＝金、刑沖＝暖紅、拱六合＝藍（六合虛線）
const ASPECT_STYLE = {
  conjunction: { color: '#c9971a', dash: '' },
  square: { color: '#d0453a', dash: '' },
  opposition: { color: '#d0453a', dash: '' },
  trine: { color: '#3f6fd8', dash: '' },
  sextile: { color: '#3f6fd8', dash: '7 5' },
};

export const THEMES = {
  light: { bg: '#fffdf8', ring: '#fbf5e6', line: '#d8c491', lineSoft: '#e9dcb8', axis: '#9a6c06', ink: '#2a2418', sub: '#7a6a4a', planetBg: '#ffffff', inner: '#fffdf8' },
  dark: { bg: '#0f1424', ring: '#161d33', line: '#5a6080', lineSoft: '#2c3452', axis: '#e5b54a', ink: '#f4ead2', sub: '#c9b98f', planetBg: '#1b2440', inner: '#121a30' },
};

export const MIN_SEP = 12; // 行星顯示最小角距（度）：半徑 203 時約 42px，大於圓圈直徑 38

const norm = (d) => ((d % 360) + 360) % 360;
const f = (n) => n.toFixed(1);

// 角度展開避讓：輸入 [{id, lon}]，回 {id: displayLon}。
// 做法：從最大空隙處切開圓周拉成直線（處理 0°/360° 接縫）→ 相鄰太近的行星併成一群，
// 群以成員真實黃經平均為中心、間距 minSep 對稱攤開 → 群與群又太近就再合併，直到穩定。保持黃經順序。
export function spreadLongitudes(items, minSep = MIN_SEP) {
  const out = {};
  const n = items.length;
  if (!n) return out;
  const sorted = [...items].map((it) => ({ id: it.id, lon: norm(it.lon) })).sort((x, y) => x.lon - y.lon);
  if (n === 1 || n * minSep >= 360) { sorted.forEach((it) => { out[it.id] = it.lon; }); return out; }
  // 找最大空隙，從它後面開始線性化
  let start = 0; let maxGap = -1;
  for (let i = 0; i < n; i++) {
    const g = norm(sorted[(i + 1) % n].lon - sorted[i].lon) || 360;
    if (g > maxGap) { maxGap = g; start = (i + 1) % n; }
  }
  const lin = [];
  for (let k = 0; k < n; k++) {
    const it = sorted[(start + k) % n];
    let v = it.lon;
    if (lin.length && v < lin[lin.length - 1].lon) v += 360;
    lin.push({ id: it.id, lon: v });
  }
  let groups = lin.map((it) => ({ members: [it] }));
  const layout = (g) => {
    const m = g.members.length;
    const center = g.members.reduce((acc, it) => acc + it.lon, 0) / m;
    g.pos = g.members.map((_, k) => center + (k - (m - 1) / 2) * minSep);
  };
  groups.forEach(layout);
  for (let changed = true; changed;) {
    changed = false;
    for (let i = 0; i + 1 < groups.length; i++) {
      const g1 = groups[i]; const g2 = groups[i + 1];
      if (g2.pos[0] - g1.pos[g1.pos.length - 1] < minSep - 1e-9) {
        const merged = { members: [...g1.members, ...g2.members] };
        layout(merged);
        groups.splice(i, 2, merged);
        changed = true;
        break;
      }
    }
  }
  for (const g of groups) g.members.forEach((it, k) => { out[it.id] = norm(g.pos[k]); });
  return out;
}

// opts: { theme:'light'|'dark', showDegrees: true }
export function buildChartSvg(chart, opts = {}) {
  if (typeof opts === 'number') opts = {}; // 舊呼叫相容：buildChartSvg(chart, 440)
  const T = THEMES[opts.theme] || THEMES.light;
  const S = 640;
  const cx = S / 2;
  const cy = S / 2;
  const R = 290;
  const rBandIn = 244;
  const rTick = 236;
  const rPlanet = 203;
  const rDeg = 174;
  const rHouseOut = 152;
  const rAsp = 128;
  const asc = chart.points.asc;
  const ref = asc ? asc.lon : 0; // 9 點鐘方向的黃經
  const ang = (lon) => (180 + (lon - ref)) * Math.PI / 180;
  const P = (r, lon) => { const a = ang(lon); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
  const line = (r1, l1, r2, l2, stroke, w, extra = '') => {
    const [x1, y1] = P(r1, l1); const [x2, y2] = P(r2, l2);
    return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
  };
  const arcPath = (r1, r2, l1, l2) => {
    const [a1x, a1y] = P(r2, l1); const [a2x, a2y] = P(r2, l2);
    const [b2x, b2y] = P(r1, l2); const [b1x, b1y] = P(r1, l1);
    // 黃經增加＝螢幕逆時針（sweep 0）
    return `M${f(a1x)},${f(a1y)} A${r2},${r2} 0 0 0 ${f(a2x)},${f(a2y)} L${f(b2x)},${f(b2y)} A${r1},${r1} 0 0 1 ${f(b1x)},${f(b1y)} Z`;
  };
  let s = `<rect width="${S}" height="${S}" fill="${T.bg}"/>`;

  // 星座帶：元素色淡底＋分隔線＋符號
  for (let i = 0; i < 12; i++) {
    const col = ELEMENT_COLOR[i % 4];
    s += `<path d="${arcPath(rBandIn, R, i * 30, i * 30 + 30)}" fill="${col}" fill-opacity="${opts.theme === 'dark' ? 0.22 : 0.12}"/>`;
    s += line(rBandIn, i * 30, R, i * 30, T.line, 2);
    const [gx, gy] = P((rBandIn + R) / 2, i * 30 + 15);
    s += `<text x="${f(gx)}" y="${f(gy)}" text-anchor="middle" dominant-baseline="central" font-size="28" fill="${col}" class="astro-glyph"><title>${SIGN_ZH[i]}</title>${SIGN_GLYPH[i]}</text>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${T.line}" stroke-width="2.5"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${rBandIn}" fill="${T.inner}" stroke="${T.line}" stroke-width="2"/>`;

  // 刻度：每 1°／5°／10°
  for (let d = 0; d < 360; d++) {
    const len = d % 10 === 0 ? 10 : d % 5 === 0 ? 7 : 3.5;
    s += line(rBandIn - len, d, rBandIn, d, T.line, d % 5 === 0 ? 1.4 : 0.8);
  }

  // 宮位線＋宮號
  const cusps = chart.houseCusps;
  if (cusps) {
    s += `<circle cx="${cx}" cy="${cy}" r="${rHouseOut}" fill="none" stroke="${T.lineSoft}" stroke-width="1.5"/>`;
    cusps.forEach((c, i) => {
      s += line(rAsp, c, rTick, c, T.lineSoft, 1.8);
      const next = cusps[(i + 1) % 12];
      const mid = c + norm(next - c) / 2;
      const [hx, hy] = P((rAsp + rHouseOut) / 2, mid);
      s += `<text x="${f(hx)}" y="${f(hy)}" text-anchor="middle" dominant-baseline="central" font-size="19" font-weight="700" fill="${T.sub}" class="astro-house">${i + 1}</text>`;
    });
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${rAsp}" fill="none" stroke="${T.line}" stroke-width="1.8"/>`;

  // 相位線（真實度數、不含四軸、不畫合相——合相以行星並排呈現）
  for (const a of chart.aspects) {
    if (['asc', 'mc'].includes(a.a) || ['asc', 'mc'].includes(a.b)) continue;
    if (a.type === 'conjunction') continue;
    const pa = chart.points[a.a]; const pb = chart.points[a.b];
    if (!pa || !pb) continue;
    const st = ASPECT_STYLE[a.type];
    const w = Math.max(1.5, Math.min(3, 3 - a.orb * 0.25));
    s += line(rAsp, pa.lon, rAsp, pb.lon, st.color, f(w), `${st.dash ? ` stroke-dasharray="${st.dash}"` : ''} stroke-opacity="0.8"`);
  }

  // 四軸：上升–下降、天頂–天底（整條粗線＋外側標籤）
  if (asc && chart.points.mc) {
    const mc = chart.points.mc.lon;
    for (const [lon, lab] of [[asc.lon, 'AC'], [norm(asc.lon + 180), 'DC'], [mc, 'MC'], [norm(mc + 180), 'IC']]) {
      s += line(rAsp, lon, R + 2, lon, T.axis, (lab === 'AC' || lab === 'MC') ? 4 : 2.5);
      const [lx, ly] = P(R + 16, lon);
      s += `<text x="${f(lx)}" y="${f(ly)}" text-anchor="middle" dominant-baseline="central" font-size="17" font-weight="800" fill="${T.axis}" class="astro-axis">${lab}</text>`;
    }
  }

  // 行星：避讓後的顯示角度＋引線＋度數
  const items = POINT_IDS.filter((id) => chart.points[id]).map((id) => ({ id, lon: chart.points[id].lon }));
  const disp = spreadLongitudes(items);
  // 度數標籤：相鄰行星太近時內外交錯兩層，避免黏在一起
  const degR = {};
  const byDisp = [...items].sort((a, b) => disp[a.id] - disp[b.id]);
  let lvl = 0;
  byDisp.forEach((it, i) => {
    const prev = byDisp[(i - 1 + byDisp.length) % byDisp.length];
    const g = norm(disp[it.id] - disp[prev.id]);
    lvl = (i > 0 && g < 16) ? 1 - lvl : 0;
    degR[it.id] = lvl ? rDeg - 17 : rDeg;
  });
  for (const { id, lon } of items) {
    const p = chart.points[id];
    const dl = disp[id];
    s += line(rTick, lon, rTick - 10, lon, T.ink, 2.5); // 真實度數刻度
    s += line(rTick - 10, lon, rPlanet + 20, dl, T.sub, 1.2, ' stroke-opacity="0.7"');
    const [x, y] = P(rPlanet, dl);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="19" fill="${T.planetBg}" stroke="${T.line}" stroke-width="1.5"/>`;
    s += `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" dominant-baseline="central" font-size="26" fill="${T.ink}" class="astro-glyph">${POINT_GLYPH[id]}${VS}</text>`;
    // 度數與逆行標記放在行星內側（沿同一角度），不會撞到左右鄰星
    if (opts.showDegrees !== false || p.retro) {
      const [dx, dy] = P(degR[id], dl);
      const deg = opts.showDegrees !== false ? `<tspan class="astro-deg">${Math.floor(p.degInSign)}°</tspan>` : '';
      const retro = p.retro ? '<tspan fill="#d0453a" font-weight="800">R</tspan>' : '';
      s += `<text x="${f(dx)}" y="${f(dy)}" text-anchor="middle" dominant-baseline="central" font-size="13" fill="${T.sub}" class="astro-degr">${deg}${retro}</text>`;
    }
  }

  if (!asc) {
    s += `<text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="14" fill="${T.sub}">未輸入出生時間：</text>`;
    s += `<text x="${cx}" y="${cy + 26}" text-anchor="middle" font-size="14" fill="${T.sub}">牡羊座放在左側</text>`;
  }

  const fontStack = "'Segoe UI Symbol','Noto Sans Symbols','Noto Sans Symbols 2','Apple Symbols','DejaVu Sans','Noto Sans TC','Microsoft JhengHei',sans-serif";
  return `<svg viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="星座命盤圓盤" font-family="${fontStack}">${s}</svg>`;
}


// 分享圖卡（深色直式 1080×1350）：稱呼＋太陽／月亮／上升一句話＋命盤。回 { svg, w, h }。
export function buildShareCardSvg(chart, { name = '', lines = [] } = {}) {
  const W = 1080;
  const H = 1350;
  const T = THEMES.dark;
  const wheel = buildChartSvg(chart, { theme: 'dark', showDegrees: false })
    .replace('<svg ', `<svg x="90" y="330" width="900" height="900" `);
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const font = "'Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif";
  let s = `<rect width="${W}" height="${H}" fill="${T.bg}"/>`;
  s += `<rect x="28" y="28" width="${W - 56}" height="${H - 56}" rx="36" fill="none" stroke="${T.axis}" stroke-opacity="0.5" stroke-width="3"/>`;
  s += `<text x="${W / 2}" y="130" text-anchor="middle" font-size="58" font-weight="800" fill="${T.ink}" font-family="${font}">${esc(name ? `${name}的星座命盤` : '我的星座命盤')}</text>`;
  lines.slice(0, 3).forEach((l, i) => {
    s += `<text x="${W / 2}" y="${210 + i * 48}" text-anchor="middle" font-size="34" fill="${T.sub}" font-family="${font}">${esc(l)}</text>`;
  });
  s += wheel;
  s += `<text x="${W / 2}" y="${H - 62}" text-anchor="middle" font-size="26" fill="${T.axis}" font-family="${font}">swanky.github.io/astrology ・ 史旺基自我探索實驗室</text>`;
  return { svg: `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`, w: W, h: H };
}
