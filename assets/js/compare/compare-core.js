// compare-core.js — 四套地圖對照（人類圖／西洋占星／八字／紫微斗數）。純函式，瀏覽器與 Node 共用。
//
// 對照規則是本站自己整理的「大方向分類」，只取各系統裡傳統上意思最接近的指標，頁面與給 AI 的提問都會
// 附上依據原文，讓訪客與 AI 能自行判斷；有傾向的不到兩套時標「線索不夠」，不硬湊一致。
// 判定看票數（幾套偏哪邊），不採一票否決；只有票數相同才叫分歧。
// 「同一主題，四套各自怎麼說」不做判定，只並排各系統原生指標與站上既有白話說明。
import { computeChart as computeHd } from '../human-design/hd-engine.js';
import { hdBriefData } from '../human-design/hd-brief.js';
import { TYPES, PROFILES } from '../human-design/hd-data-texts.js';
import { computeChartFromBirth, POINT_ZH } from '../astrology/astro-chart.js';
import { SIGN_TEXTS } from '../astrology/astro-text-signs.js';
import { astroBriefData } from '../astrology/astro-brief.js';
import { computePillarsFromBirth } from '../bazi/bazi-pillars.js';
import { analyzeChart } from '../bazi/bazi-shishen.js';
import { baziBriefData } from '../bazi/bazi-brief.js';
import { TEN_GOD } from '../bazi/bazi-data-texts.js';
import { computeZiwei, soulPalace } from '../ziwei/ziwei-engine.js';
import { ziweiBriefData } from '../ziwei/ziwei-brief.js';
import { MAJOR_TEXT } from '../ziwei/ziwei-texts.js';

const PERSONAL = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

// birth: { y, mo, d, h, mi, gender:'male'|'female', city:{ zh, tz, lat, lon }, name, refDate? }
export function computeAll(birth) {
  const { y, mo, d, h, mi, gender, city } = birth;
  const hd = computeHd({ year: y, month: mo, day: d, hour: h, minute: mi, tz: city.tz });
  const astro = computeChartFromBirth({ year: y, month: mo, day: d, hour: h, minute: mi, tz: city.tz, lat: city.lat, lon: city.lon, houseSystem: 'whole' });
  const baziChart = computePillarsFromBirth({ year: y, month: mo, day: d, hour: h, minute: mi, tz: city.tz, gender });
  const baziAnalysis = analyzeChart(baziChart.pillars);
  const ziwei = computeZiwei({ year: y, month: mo, day: d, hour: h, minute: mi, gender, refDate: birth.refDate });
  return { birth, hd, astro, bazi: { chart: baziChart, analysis: baziAnalysis }, ziwei };
}

// 某宮主星（空宮借對宮），回傳 { stars:[名], borrowed:boolean, palace }
export function palaceStars(chart, palace) {
  if (!palace) return { stars: [], borrowed: false, palace };
  if (palace.major.length) return { stars: palace.major.map((s) => s.name), borrowed: false, palace };
  const opp = chart.palaces.find((p) => p.index === (palace.index + 6) % 12);
  return { stars: opp ? opp.major.map((s) => s.name) : [], borrowed: true, palace };
}
export function ziweiSoulStars(chart) { return palaceStars(chart, soulPalace(chart)); }
const officerPalace = (chart) => chart.palaces.find((p) => p.name === '官祿');

function countBy(astro, fn) {
  return PERSONAL.reduce((n, id) => n + (fn(astro.points[id]) ? 1 : 0), 0);
}

// 每個面向：各系統回傳 { pole: 'a'|'b'|null, value, basis }；pole null＝這套系統在此面向沒有明確傾向或沒有對應。
export const DIMENSIONS = [
  {
    id: 'initiative',
    title: '行動起點',
    poles: { a: '主動開創', b: '先觀察、等時機' },
    hint: '你比較習慣自己先出手，還是先看清楚、等對的時機再動？',
    read: {
      hd(r) {
        const t = r.hd.type;
        // 只有顯示者的策略是主動發起；顯示生產者策略仍是先等回應（回應後動作快），歸觀察
        const pole = t === 'manifestor' ? 'a' : 'b';
        const extra = t === 'mg' ? '（先等回應，回應後動作快）' : '';
        return { pole, value: TYPES[t].nameZh, basis: `類型是${TYPES[t].nameZh}，策略「${TYPES[t].strategy}」${extra}` };
      },
      astro(r) {
        const n = countBy(r.astro, (p) => p.element === '火' || p.element === '風');
        const pole = n >= 5 ? 'a' : n <= 2 ? 'b' : null;
        return { pole, value: `火風 ${n}／7`, basis: `太陽到土星 7 顆行星裡，落在火象與風象（傳統上的陽性星座，偏外放）共 ${n} 顆（5 顆以上偏主動、2 顆以下偏觀察，3～4 顆不歸類）` };
      },
      bazi(r) {
        const t = r.bazi.analysis.strength.tendency;
        const pole = t === '偏強' ? 'a' : t === '偏弱' ? 'b' : null;
        return { pole, value: `日主${t}`, basis: `日主${r.bazi.analysis.dayGanName}（${r.bazi.analysis.dayWuxing}）強弱傾向「${t}」（偏強較習慣靠自己扛、照自己的步調；偏弱較擅長借力與配合；中和不歸類。強弱是粗估）` };
      },
      ziwei(r) {
        const { stars, borrowed } = ziweiSoulStars(r.ziwei);
        const sha = stars.filter((s) => ['七殺', '破軍', '貪狼'].includes(s));
        const ji = stars.filter((s) => ['天機', '太陰', '天同', '天梁'].includes(s));
        const pole = sha.length && !ji.length ? 'a' : ji.length && !sha.length ? 'b' : null;
        const label = stars.join('、') || '無主星';
        return { pole, value: `命宮${borrowed ? '借' : ''}${label}`, basis: `命宮${borrowed ? '空宮、借對宮' : ''}主星是${label}（傳統上「殺破狼」主開創變動，「機月同梁」主穩定與服務，其餘不歸類）` };
      },
    },
  },
];

export const SYSTEMS = [
  { id: 'hd', name: '人類圖' },
  { id: 'astro', name: '星座' },
  { id: 'bazi', name: '八字' },
  { id: 'ziwei', name: '紫微' },
];

// 票數判定：有傾向的不到 2 套→線索不夠；全同向→一致；多數決→偏向（顯示票數）；票數相同→分歧。
export function verdictOf(rows, poles = { a: '傾向 A', b: '傾向 B' }) {
  const ps = rows.map((x) => x.pole).filter(Boolean);
  const a = ps.filter((p) => p === 'a').length;
  const b = ps.length - a;
  if (ps.length < 2) return { kind: 'weak', label: '線索不夠，先不下結論', a, b };
  if (!a || !b) { const pole = a ? 'a' : 'b'; return { kind: 'agree', label: `說法一致：${ps.length} 套都${poles[pole]}`, pole, a, b }; }
  if (a !== b) {
    const pole = a > b ? 'a' : 'b'; const other = pole === 'a' ? 'b' : 'a';
    return { kind: 'lean', label: `多數${poles[pole]}：${Math.max(a, b)} 套${poles[pole]}、${Math.min(a, b)} 套${poles[other]}`, pole, a, b };
  }
  return { kind: 'split', label: `說法分歧：${a} 套${poles.a}、${b} 套${poles.b}`, a, b };
}

export function compareDimensions(r) {
  return DIMENSIONS.map((dim) => {
    const rows = SYSTEMS.map((s) => ({ system: s.id, name: s.name, ...dim.read[s.id](r) }));
    return { id: dim.id, title: dim.title, poles: dim.poles, hint: dim.hint, rows, verdict: verdictOf(rows, dim.poles) };
  });
}

const firstSentence = (t) => (t ? t.split('。')[0] + '。' : '');
const WORK_GODS = ['正官', '七殺', '食神', '傷官'];

// 同一主題，四套各自怎麼說（目前主題：工作）。只並排原生指標與站上既有白話，不判定一致或矛盾。
export function workTopic(r) {
  const t = TYPES[r.hd.type];
  const mc = r.astro.points.mc;
  const tenth = PERSONAL.filter((id) => r.astro.points[id] && r.astro.points[id].house === 10);
  const cnt = r.bazi.analysis.tenGodCount;
  const gods = WORK_GODS.filter((g) => cnt[g] > 0).sort((x, y) => cnt[y] - cnt[x]);
  const off = palaceStars(r.ziwei, officerPalace(r.ziwei));
  const offLabel = off.stars.join('、') || '無主星';
  return {
    title: '工作',
    rows: [
      { system: 'hd', name: '人類圖', indicator: `${t.nameZh}・策略「${t.strategy}」`, text: firstSentence(t.desc) },
      { system: 'astro', name: '星座', indicator: mc ? `天頂${mc.signZh}${tenth.length ? `，第 10 宮有${tenth.map((id) => POINT_ZH[id]).join('、')}` : ''}` : '—',
        text: mc ? `天頂代表事業與社會角色的方向。${mc.signZh}的關鍵字是「${SIGN_TEXTS[mc.sign].keyword}」：${firstSentence(SIGN_TEXTS[mc.sign].trait)}` : '' },
      { system: 'bazi', name: '八字', indicator: gods.length ? gods.map((g) => `${g}×${cnt[g]}`).join('、') : '四柱沒有官殺食傷',
        text: gods.length ? `四柱裡最多的是${gods[0]}：${TEN_GOD[gods[0]]}` : '代表規範（正官、七殺）與表現（食神、傷官）的十神都沒出現，工作傾向請看完整八字的其他十神。' },
      { system: 'ziwei', name: '紫微', indicator: `官祿宮${off.borrowed ? '空宮、借對宮' : ''}：${offLabel}`,
        text: off.stars.slice(0, 2).map((n) => (MAJOR_TEXT[n] ? `${n}（${MAJOR_TEXT[n].key}）：${MAJOR_TEXT[n].text}` : n)).join(' ') },
    ],
  };
}

// 各系統的三個重點（給頁面卡片）
export function keyFacts(r) {
  const hd = r.hd; const a = r.astro.points; const bz = r.bazi.analysis;
  const { stars, borrowed } = ziweiSoulStars(r.ziwei);
  const mt = MAJOR_TEXT[stars[0]];
  return {
    hd: [['類型', TYPES[hd.type].nameZh], ['策略', TYPES[hd.type].strategy], ['人生角色', PROFILES[hd.profile] ? PROFILES[hd.profile].nameZh : hd.profile]],
    astro: [['太陽', a.sun.signZh], ['月亮', a.moon.signZh], ['上升', a.asc ? a.asc.signZh : '—']],
    bazi: [['日主', `${bz.dayGanName}（${bz.dayWuxing}）`], ['強弱傾向', STRENGTH_SHORT[bz.strength.tendency] || bz.strength.tendency], ['五行最多', topWuxing(bz)]],
    ziwei: [['命宮主星', (stars.join('、') || '無主星') + (borrowed ? '（借對宮）' : '')], ['主星關鍵字', mt ? mt.key : '—'], ['事業宮主星', palaceStars(r.ziwei, officerPalace(r.ziwei)).stars.join('、') || '無主星']],
  };
}

const STRENGTH_SHORT = { 偏強: '偏強（習慣靠自己扛）', 偏弱: '偏弱（擅長借力配合）', 中和: '中和（能攻能守）' };

function topWuxing(bz) {
  const pct = bz.wuxing.percent;
  const k = Object.keys(pct).sort((x, y) => pct[y] - pct[x])[0];
  return `${k} ${Math.round(pct[k])}%`;
}

const pad = (n) => String(n).padStart(2, '0');

// 合併成一份「給 AI 的完整提問」資料
export function compareBriefData(r, { hidePersonal = false } = {}) {
  const b = r.birth;
  const basic = [];
  if (!hidePersonal) basic.push(`出生：${b.y}-${pad(b.mo)}-${pad(b.d)} ${pad(b.h)}:${pad(b.mi)}，${b.city.zh}`);
  basic.push(`性別：${b.gender === 'female' ? '女' : '男'}`);
  const subs = [
    ['人類圖', hdBriefData(r.hd, { hidePersonal: true })],
    ['星座', astroBriefData(r.astro, { y: b.y, mo: b.mo, d: b.d, h: b.h, mi: b.mi, cityName: b.city.zh }, { hidePersonal: true })],
    ['八字', baziBriefData(r.bazi.chart, r.bazi.analysis, { y: b.y, mo: b.mo, d: b.d, h: b.h, mi: b.mi, city: b.city, gender: b.gender }, { hidePersonal: true })],
    ['紫微', ziweiBriefData(r.ziwei, { hidePersonal: true })],
  ];
  const sections = [{ heading: '基本資料', lines: basic }];
  for (const [name, data] of subs) {
    for (const sec of data.sections) {
      if (sec.heading === '基本資料') sections.push({ ...sec, heading: `${name}：重點` });
      else sections.push({ ...sec, heading: `${name}：${sec.heading}` });
    }
  }
  const dims = compareDimensions(r);
  sections.push({
    heading: '本站整理的對照（大方向分類，僅供參考）',
    table: {
      head: ['面向', ...SYSTEMS.map((s) => s.name), '結果'],
      rows: dims.map((d) => [d.title, ...d.rows.map((x) => (x.pole ? `${d.poles[x.pole]}（${x.value}）` : `沒有明顯傾向（${x.value}）`)), d.verdict.label]),
    },
  });
  const wt = workTopic(r);
  sections.push({
    heading: `同一主題，四套各自怎麼說：${wt.title}`,
    table: { head: ['系統', '指標', '站上白話說明'], rows: wt.rows.map((x) => [x.name, x.indicator, x.text]) },
  });
  const caveats = [];
  for (const [name, data] of subs) for (const c of data.caveats || []) caveats.push(`${name}：${c}`);
  caveats.push('「本站整理的對照」只取各系統最接近的單一指標做大方向分類，請把它當線索，以四套系統的原始資料為準。');
  caveats.push('紫微排盤在本站仍標示測試中，命宮與各宮主星請以專業排盤核對。');
  return {
    system: '四套系統對照（人類圖、西洋占星、八字、紫微斗數）',
    title: `${b.name && !hidePersonal ? b.name + '的' : '我的'}四套地圖對照`,
    source: '排盤：swanky.github.io/explore/compare/，四套系統都在同一份出生資料上計算',
    sections,
    caveats,
    extraRules: [
      '請先列出四套系統「說法一致」的地方，再列出「互相矛盾」的地方，每一點都要註明出自哪套系統的哪個指標。',
      '遇到矛盾不要硬圓成一致：請說明兩種說法各自在描述哪個層面（例如天生傾向 vs 後天習慣、工作 vs 感情），以及我可以怎麼在生活裡觀察哪個比較貼近我。',
      '不要宣稱哪一套系統比較準。',
    ],
  };
}
