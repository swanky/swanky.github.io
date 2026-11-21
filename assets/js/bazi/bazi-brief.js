// bazi-brief.js — 八字命盤 → 「給 AI 的完整提問」資料（交給 core-ai-brief.buildAiBrief）。純函式。
import { tenGod } from './bazi-shishen.js';

const PILLAR_ZH = { year: '年柱', month: '月柱', day: '日柱', hour: '時柱' };

// inp: { y, mo, d, h, mi, timeUnknown, city:{zh}, gender, trueSolarTime, name }
export function baziBriefData(chart, analysis, inp, { hidePersonal = false } = {}) {
  const P = chart.pillars;
  const T = analysis.tenGods;
  const basic = [];
  if (!hidePersonal) {
    basic.push(`出生：${inp.y}-${String(inp.mo).padStart(2, '0')}-${String(inp.d).padStart(2, '0')} ${inp.timeUnknown ? '（時辰不確定）' : `${String(inp.h).padStart(2, '0')}:${String(inp.mi).padStart(2, '0')}`}，${inp.city ? inp.city.zh : ''}`);
  }
  basic.push(`性別：${inp.gender === 'female' ? '女' : '男'}${inp.trueSolarTime ? '｜已換算真太陽時' : ''}`);
  basic.push(`日主：${analysis.dayGanName}（${analysis.dayWuxing}）｜強弱傾向：${analysis.strength.tendency}`);

  const rows = ['year', 'month', 'day', 'hour'].map((k) => {
    const p = P[k];
    if (!p) return [PILLAR_ZH[k], '（時辰不確定）', '', '', ''];
    const t = T[k];
    return [PILLAR_ZH[k], p.ganName + p.zhiName, t.ganGod, t.hiddenGods.map((h) => `${h.gan}（${h.god}）`).join('、'), p.nayin || ''];
  });

  const pct = analysis.wuxing.percent;
  const wx = Object.keys(pct).map((k) => `${k} ${Math.round(pct[k])}%`).join('、');
  const tg = Object.entries(analysis.tenGodCount).filter(([, n]) => n > 0).map(([g, n]) => `${g}×${n}`).join('、');

  const luck = chart.luck;
  const luckLines = [`排法：${luck.forward ? '順排' : '逆排'}${luck.startAge ? `，約 ${luck.startAge.years} 歲起運` : ''}`];
  luckLines.push(luck.steps.map((s) => `${s.startAge} 歲 ${s.ganName}${s.zhiName}（${tenGod(analysis.dayGan, s.gan)}）`).join('、'));

  return {
    system: '八字（四柱命理）',
    title: `${inp.name && !hidePersonal ? inp.name + '的' : '我的'}八字命盤`,
    source: '排盤：swanky.github.io/bazi/，節氣以太陽黃經計算',
    sections: [
      { heading: '基本資料', lines: basic },
      { heading: '四柱（已算好十神與藏干）', table: { head: ['柱', '干支', '天干十神', '地支藏干（十神）', '納音'], rows } },
      { heading: '五行比例（已算好）', lines: [wx] },
      { heading: '十神出現次數', lines: [tg || '—'] },
      { heading: '大運（每十年）', lines: luckLines },
    ],
    caveats: [
      '日主強弱只是依得令、得地、得勢估出的傾向，不代表用神判斷；請不要替我推薦用神或開運物。',
      inp.timeUnknown ? '時辰不確定，所以沒有時柱，解讀時請說明哪些結論會受影響。' : '早子時／晚子時的換日規則各派不同，若出生在 23:00–01:00 請提醒我。',
    ],
  };
}
