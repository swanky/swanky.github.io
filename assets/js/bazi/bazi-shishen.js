// bazi-shishen.js — 十神判定＋五行分布統計＋日主強弱「傾向」（純函式，可 node --test）。
//
// 十神：日干為我，五行生剋＋陰陽同異查表。五行分布：天干 1.0、藏干本氣 1.0/中氣 0.5/餘氣 0.3。
// 日主強弱只給「傾向」（得令/得地/得勢三指標分列）＋固定免責語，**不做用神推薦**（§7.3）。
import {
  GAN, GAN_WUXING, GAN_YIN, ZHI_WUXING, ZHI_HIDDEN, HIDDEN_WEIGHT, WUXING,
  isSheng, isKe,
} from './bazi-ganzhi.js';

// 十神順序（顯示用）
export const TEN_GODS = ['比肩', '劫財', '食神', '傷官', '偏財', '正財', '七殺', '正官', '偏印', '正印'];

// 日干（我）對某天干的十神。x=me 比劫；我生 食傷；我剋 財；剋我 官殺；生我 印。
export function tenGod(dayGan, targetGan) {
  const me = GAN_WUXING[dayGan], x = GAN_WUXING[targetGan];
  const same = GAN_YIN[dayGan] === GAN_YIN[targetGan]; // 同陰陽
  if (x === me) return same ? '比肩' : '劫財';
  if (isSheng(me, x)) return same ? '食神' : '傷官';   // 我生
  if (isKe(me, x)) return same ? '偏財' : '正財';       // 我剋
  if (isKe(x, me)) return same ? '七殺' : '正官';       // 剋我
  if (isSheng(x, me)) return same ? '偏印' : '正印';    // 生我
  return '';
}

// 五行分布統計：遍歷四柱天干（1.0）與地支藏干（本氣1.0/中氣0.5/餘氣0.3）。
export function wuxingStats(pillars) {
  const scores = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const key of ['year', 'month', 'day', 'hour']) {
    const p = pillars[key];
    if (!p) continue;
    scores[GAN_WUXING[p.gan]] += 1.0; // 天干
    ZHI_HIDDEN[p.zhi].forEach((hg, i) => { scores[GAN_WUXING[hg]] += HIDDEN_WEIGHT[i] || 0.3; });
  }
  const total = WUXING.reduce((s, w) => s + scores[w], 0);
  const percent = {};
  WUXING.forEach((w) => { percent[w] = total ? Math.round(scores[w] / total * 1000) / 10 : 0; });
  return { scores, percent, total: Math.round(total * 10) / 10 };
}

// 十神分布統計（天干＋藏干；日主本身不計）。
export function tenGodCount(pillars) {
  const dayGan = pillars.day.gan;
  const count = {};
  TEN_GODS.forEach((g) => { count[g] = 0; });
  for (const key of ['year', 'month', 'day', 'hour']) {
    const p = pillars[key];
    if (!p) continue;
    if (key !== 'day') count[tenGod(dayGan, p.gan)]++;          // 日干=我，不計
    ZHI_HIDDEN[p.zhi].forEach((hg) => { const g = tenGod(dayGan, hg); if (g) count[g]++; });
  }
  return count;
}

// 每柱天干十神＋藏干十神（顯示用；日干標「日主」）。
export function annotate(pillars) {
  const dayGan = pillars.day.gan;
  const out = {};
  for (const key of ['year', 'month', 'day', 'hour']) {
    const p = pillars[key];
    if (!p) { out[key] = null; continue; }
    out[key] = {
      ganGod: key === 'day' ? '日主' : tenGod(dayGan, p.gan),
      hiddenGods: ZHI_HIDDEN[p.zhi].map((hg) => ({ gan: GAN[hg], god: tenGod(dayGan, hg) })),
    };
  }
  return out;
}

// 日主強弱「傾向」：得令（月支幫身）／得地（地支藏本氣幫身）／得勢（同黨分＞異黨分）。
// 同黨＝比劫（同五行）＋印（生我）。只給傾向，不做用神推薦。
export function dayMasterStrength(pillars, stats) {
  const me = GAN_WUXING[pillars.day.gan];
  const isTong = (w) => w === me || isSheng(w, me); // 同黨：同我 或 生我

  // 得令：月支五行幫身
  const deLing = isTong(ZHI_WUXING[pillars.month.zhi]);
  // 得地：任一地支藏干本氣幫身
  let deDi = false;
  for (const key of ['year', 'month', 'day', 'hour']) {
    const p = pillars[key];
    if (p && isTong(GAN_WUXING[ZHI_HIDDEN[p.zhi][0]])) { deDi = true; break; }
  }
  // 得勢：同黨五行分 ＞ 異黨
  let tong = 0;
  WUXING.forEach((w) => { if (isTong(w)) tong += stats.scores[w]; });
  const support = stats.total ? tong / stats.total : 0;
  const deShi = support > 0.5;

  let tendency;
  if (support >= 0.55) tendency = '偏強';
  else if (support <= 0.35) tendency = '偏弱';
  else tendency = '中和';

  return {
    deLing, deDi, deShi, support: Math.round(support * 1000) / 10,
    tendency,
    note: '這是「傾向」而非定論，不同流派的判法可能不同；此處僅供自我觀察與討論，不作命定判斷。',
  };
}

// 整合分析（供 UI 一次取用）。
export function analyzeChart(pillars) {
  const stats = wuxingStats(pillars);
  return {
    dayGan: pillars.day.gan,
    dayGanName: GAN[pillars.day.gan],
    dayWuxing: GAN_WUXING[pillars.day.gan],
    tenGods: annotate(pillars),
    tenGodCount: tenGodCount(pillars),
    wuxing: stats,
    strength: dayMasterStrength(pillars, stats),
  };
}
