// astro-brief.js — 星座命盤 → 「給 AI 的完整提問」資料（交給 core-ai-brief.buildAiBrief）。純函式。
import { POINT_IDS, POINT_ZH } from './astro-chart.js';

const HOUSE_SYS_ZH = { whole: '整宮制', equal: '等宮制' };
const degStr = (d) => {
  let deg = Math.floor(d);
  let min = Math.round((d - deg) * 60);
  if (min === 60) { deg += 1; min = 0; }
  return `${deg}°${String(min).padStart(2, '0')}′`;
};

// birth: { y, mo, d, h, mi, cityName, timeUnknown, name }
export function astroBriefData(chart, birth, { hidePersonal = false } = {}) {
  const basic = [];
  if (!hidePersonal) {
    basic.push(`出生：${birth.y}-${String(birth.mo).padStart(2, '0')}-${String(birth.d).padStart(2, '0')} ${birth.timeUnknown ? '（時間不確定）' : `${String(birth.h).padStart(2, '0')}:${String(birth.mi).padStart(2, '0')}`}，${birth.cityName || ''}`);
  }
  basic.push(chart.meta.withTime ? `宮位制：${HOUSE_SYS_ZH[chart.meta.houseSystem] || chart.meta.houseSystem}` : '沒有出生時間：上升、天頂與宮位無法計算');

  const rows = [];
  for (const id of ['asc', 'mc', ...POINT_IDS]) {
    const p = chart.points[id];
    if (!p) continue;
    rows.push([POINT_ZH[id], p.signZh, degStr(p.degInSign), p.house ? `第 ${p.house} 宮` : '—', p.retro ? '逆行' : '']);
  }

  const aspects = chart.aspects.slice(0, 14).map((a) => `${POINT_ZH[a.a] || a.a} ${a.name} ${POINT_ZH[a.b] || a.b}（相差 ${a.orb}°）`);

  const counts = { 火: 0, 土: 0, 風: 0, 水: 0 };
  for (const id of ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn']) counts[chart.points[id].element] += 1;

  const sections = [
    { heading: '基本資料', lines: basic },
    { heading: '行星與四軸落點', table: { head: ['點', '星座', '度數', '宮位', '逆行'], rows } },
    { heading: '主要相位（由緊到鬆，已算好）', lines: aspects.length ? aspects : ['沒有在容許範圍內的主要相位'] },
    { heading: '個人行星元素分布（太陽到土星共 7 顆）', lines: [`火 ${counts.火}、土 ${counts.土}、風 ${counts.風}、水 ${counts.水}`] },
  ];
  const caveats = ['相位只列合、六合、刑、拱、沖五種主要相位；容許度：日月 8°、其他行星 6°、四軸 5°。'];
  if (!chart.meta.withTime) caveats.push('沒有出生時間，月亮以當天中午估算；若月亮靠近星座交界，實際月亮星座可能不同。');
  return {
    system: '西洋占星',
    title: `${birth.name && !hidePersonal ? birth.name + '的' : '我的'}星座命盤`,
    source: '排盤：swanky.github.io/astrology/，行星位置採高精度天文星曆計算',
    sections,
    caveats,
    extraRules: ['這是一張出生星盤，不是流年運勢；請聚焦性格、關係模式與天賦，不要預測具體事件。'],
  };
}
