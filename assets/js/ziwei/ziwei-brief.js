// ziwei-brief.js — 紫微命盤 → 「給 AI 的完整提問」資料（交給 core-ai-brief.buildAiBrief）。純函式。
import { sanFangSiZheng, soulPalace } from './ziwei-engine.js';

const starStr = (s) => s.name + (s.brightness ? `(${s.brightness})` : '') + (s.mutagen ? `化${s.mutagen}` : '');
const GENDER_ZH = { male: '男', female: '女' };

export function ziweiBriefData(chart, { name = '', trueSolar = null, hidePersonal = false } = {}) {
  const soul = soulPalace(chart);
  const sf = sanFangSiZheng(soul.index);
  const P = chart.palaces;
  const basic = hidePersonal
    ? [`出生時辰：${chart.timeName}，性別：${GENDER_ZH[chart.input.gender]}（生日已隱去）`]
    : [
      `出生（國曆）：${chart.solarDate} ${chart.timeName}（${chart.timeRange}），性別：${GENDER_ZH[chart.input.gender]}`,
      `農曆：${chart.lunarDate}｜四柱：${chart.chineseDate}`,
    ];
  basic.push(
    `五行局：${chart.fiveElementsClass}｜命主：${chart.soul}｜身主：${chart.body}`,
    `命宮在${chart.soulBranch}宮，身宮在${chart.bodyBranch}宮（${P.find((p) => p.isBody).name}）`,
    `生年四化：${chart.birthMutagen.map((m) => `${m.star}化${m.mutagen}在${m.palace}`).join('、')}`,
  );
  if (trueSolar) basic.push(`出生時間已依出生地換算真太陽時（校正 ${trueSolar.correctionMin >= 0 ? '+' : ''}${trueSolar.correctionMin} 分鐘）`);

  const order = [soul.index];
  for (let i = 1; i < 12; i++) order.push((soul.index - i + 12) % 12); // 命宮起逆排：兄弟、夫妻…
  const rows = order.map((i) => {
    const p = P[i];
    return [
      p.name + (p.isBody ? '〔身宮〕' : ''),
      p.stem + p.branch,
      p.major.length ? p.major.map(starStr).join('、') : '空宮',
      p.minor.map(starStr).join('、') || '—',
      p.decadal ? `${p.decadal[0]}–${p.decadal[1]}` : '',
    ];
  });

  const sections = [
    { heading: '基本資料', lines: basic },
    { heading: '十二宮（從命宮起）', table: { head: ['宮位', '干支', '主星（亮度・四化）', '輔星', '大限歲數'], rows } },
    {
      heading: '命宮的三方四正',
      lines: [
        `本宮：${P[sf.self].name}（${P[sf.self].major.map((s) => s.name).join('、') || '空宮'}）`,
        `對宮：${P[sf.opposite].name}（${P[sf.opposite].major.map((s) => s.name).join('、') || '空宮'}）`,
        `三合：${P[sf.trineA].name}（${P[sf.trineA].major.map((s) => s.name).join('、') || '空宮'}）、${P[sf.trineB].name}（${P[sf.trineB].major.map((s) => s.name).join('、') || '空宮'}）`,
      ],
    },
  ];

  const majors = (p) => p.major.map((s) => s.name).join('、') || '空宮';
  sections.push({
    heading: '各宮的對宮與三合（已算好，請直接引用）',
    table: {
      head: ['宮位', '對宮', '三合宮'],
      rows: order.map((i) => {
        const f = sanFangSiZheng(i);
        return [
          `${P[i].name}（${majors(P[i])}）`,
          `${P[f.opposite].name}（${majors(P[f.opposite])}）`,
          `${P[f.trineA].name}（${majors(P[f.trineA])}）、${P[f.trineB].name}（${majors(P[f.trineB])}）`,
        ];
      }),
    },
  });

  const h = chart.horoscope;
  if (h) {
    const ml = (arr) => arr.map((m) => `${m.star}化${m.mutagen}→${m.palace || '（不在本命十二宮主輔星中）'}`).join('、');
    sections.push({
      heading: hidePersonal ? `目前運勢（以 ${h.refDate} 計）` : `目前運勢（以 ${h.refDate} 計，虛歲 ${h.nominalAge ?? '—'}）`,
      lines: [
        `大限：${h.decadal.range ? h.decadal.range.join('–') + ' 歲' : ''}，在本命${h.decadal.palace}（${h.decadal.stemBranch}），大限夫妻宮落在本命${P[h.decadal.spousePalaceIndex] ? P[h.decadal.spousePalaceIndex].name : '—'}`,
        `大限四化：${ml(h.decadal.mutagen)}`,
        `流年：${h.yearly.stemBranch}年，流年命宮落在本命${h.yearly.palace}`,
        `流年四化：${ml(h.yearly.mutagen)}`,
      ],
    });
  }

  return {
    system: '紫微斗數',
    title: `${name && !hidePersonal ? name + '的' : '我的'}紫微斗數命盤`,
    source: '排盤：swanky.github.io/ziwei/，依開源 iztro 演算法（全書通行排法）',
    sections,
    caveats: [
      '紫微斗數各流派在星曜亮度、四化與部分輔星的安法上有差異，這份資料採用其中一種通行排法。',
      '出生時間若接近兩個時辰的交界，命盤可能整個不同，解讀時請提醒我這個風險。',
    ],
  };
}
