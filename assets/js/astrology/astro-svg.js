// astro-svg.js — 圓形命盤 SVG（星座環＋宮位線＋行星＋相位線）。純字串產生、零外部資源（尚無 PNG 匯出）。
import { POINT_IDS } from './astro-chart.js';

const SIGN_GLYPH = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ELEMENT_COLOR = ['#c0603a', '#8a7a3a', '#3a7abf', '#3a9a9a']; // 火土風水，循環
const POINT_GLYPH = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃',
  saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇', northNode: '☊', asc: 'AC', mc: 'MC',
};
const ASPECT_COLOR = {
  conjunction: '#E5A300', sextile: '#4a9d4a', square: '#c0603a', trine: '#3a7abf', opposition: '#a04a8a',
};

// 黃經 → screen 角（rad）：牡羊 0° 放左方、逆時針（占星慣例，ASC 在左）。
function ang(lon) { return (180 + lon) * Math.PI / 180; }
function pt(cx, cy, r, lon) {
  const a = ang(lon);
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}
const f = (n) => n.toFixed(1);

export function buildChartSvg(chart, size = 420) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 4;
  const rSignOuter = R;
  const rSignInner = R * 0.84;
  const rPlanet = R * 0.72;
  const rInner = R * 0.56;
  let s = '';

  // 星座環格線＋符號
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = pt(cx, cy, rSignInner, i * 30);
    const [x2, y2] = pt(cx, cy, rSignOuter, i * 30);
    s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#e6dcc4" stroke-width="1"/>`;
    const [gx, gy] = pt(cx, cy, (rSignInner + rSignOuter) / 2, i * 30 + 15);
    s += `<text x="${f(gx)}" y="${f(gy + 5)}" text-anchor="middle" font-size="15" fill="${ELEMENT_COLOR[i % 4]}">${SIGN_GLYPH[i]}</text>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${f(rSignOuter)}" fill="none" stroke="#d9cba8" stroke-width="1.5"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${f(rSignInner)}" fill="none" stroke="#e6dcc4" stroke-width="1"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${f(rInner)}" fill="none" stroke="#eee" stroke-width="1"/>`;

  // 宮位線
  if (chart.houseCusps) {
    for (const c of chart.houseCusps) {
      const [x1, y1] = pt(cx, cy, rInner, c);
      const [x2, y2] = pt(cx, cy, rSignInner, c);
      s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#f0e8d6" stroke-width="1"/>`;
    }
  }

  // ASC/MC 粗線＋標記
  ['asc', 'mc'].forEach((k) => {
    const p = chart.points[k];
    if (!p) return;
    const [x1, y1] = pt(cx, cy, rInner, p.lon);
    const [x2, y2] = pt(cx, cy, rSignOuter, p.lon);
    s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#b6820a" stroke-width="1.6"/>`;
    const [lx, ly] = pt(cx, cy, rSignOuter - 13, p.lon);
    s += `<text x="${f(lx)}" y="${f(ly + 4)}" text-anchor="middle" font-size="10" font-weight="700" fill="#b6820a">${POINT_GLYPH[k]}</text>`;
  });

  // 相位線（不含四軸）
  for (const asp of chart.aspects) {
    if (['asc', 'mc'].includes(asp.a) || ['asc', 'mc'].includes(asp.b)) continue;
    const pa = chart.points[asp.a];
    const pb = chart.points[asp.b];
    if (!pa || !pb) continue;
    const [x1, y1] = pt(cx, cy, rInner, pa.lon);
    const [x2, y2] = pt(cx, cy, rInner, pb.lon);
    s += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${ASPECT_COLOR[asp.type] || '#ccc'}" stroke-width="0.8" opacity="0.5"/>`;
  }

  // 行星
  for (const id of POINT_IDS) {
    const p = chart.points[id];
    if (!p) continue;
    const [x, y] = pt(cx, cy, rPlanet, p.lon);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="10" fill="#fff" stroke="#e6dcc4"/>`;
    s += `<text x="${f(x)}" y="${f(y + 4)}" text-anchor="middle" font-size="12" fill="#333">${POINT_GLYPH[id]}${p.retro ? '<tspan font-size="7" fill="#c0603a">℞</tspan>' : ''}</text>`;
  }

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="星座命盤圓盤">${s}</svg>`;
}
