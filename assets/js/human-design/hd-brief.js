// hd-brief.js — 人類圖 → 「給 AI 的完整提問」資料（交給 core-ai-brief.buildAiBrief）。純函式。
import { CENTERS } from './hd-data-centers.js';
import { GATES } from './hd-data-gates.js';
import { TYPES, AUTHORITIES, PROFILES, DEFINITIONS, CROSS_ANGLES, PLANETS } from './hd-data-texts.js';

const pad = (n) => String(n).padStart(2, '0');
const centerZh = (id) => (CENTERS[id] ? CENTERS[id].nameZh : id);
const gateStr = (g) => `${g}${GATES[g] ? `（${GATES[g].keyword}）` : ''}`;

// chart：hd-engine computeChart 的結果；opts.name、opts.cityLabel、opts.timeUnknown
export function hdBriefData(chart, { name = '', cityLabel = '', timeUnknown = false, hidePersonal = false } = {}) {
  const i = chart.input;
  const t = TYPES[chart.type];
  const basic = [];
  if (!hidePersonal) {
    basic.push(`出生：${i.year}-${pad(i.month)}-${pad(i.day)} ${timeUnknown ? '（時間不確定，以正午計算）' : `${pad(i.hour)}:${pad(i.minute)}`}${cityLabel ? `，${cityLabel}` : ''}`);
  }
  basic.push(`類型：${t.nameZh}｜策略：${t.strategy}｜順流信號：${t.signature}｜逆流警訊：${t.notSelf}`);
  basic.push(`內在權威：${AUTHORITIES[chart.authority].nameZh}`);
  const prof = PROFILES[chart.profile];
  basic.push(`人生角色：${prof ? prof.nameZh : chart.profile}`);
  basic.push(`定義：${DEFINITIONS[chart.definition].nameZh}`);
  const crossName = chart.incarnationCross && chart.incarnationCross.nameZh;
  const g = chart.crossGates;
  basic.push(`輪迴交叉：${crossName || '—'}${chart.crossAngle ? `（${CROSS_ANGLES[chart.crossAngle]}）` : ''}｜閘門 ${g.pSun}/${g.pEarth}｜${g.dSun}/${g.dEarth}`);

  const centers = [
    `有定義：${chart.definedCenters.map(centerZh).join('、') || '無'}`,
    `未定義：${chart.undefinedCenters.filter((c) => !chart.fullyOpenCenters.includes(c)).map(centerZh).join('、') || '無'}`,
    `完全空白（沒有任何閘門）：${chart.fullyOpenCenters.map(centerZh).join('、') || '無'}`,
  ];

  const channels = chart.definedChannels.map((c) => `${c.id} ${c.nameZh}（${c.centers.map(centerZh).join('—')}）`);

  const rows = PLANETS.map((p) => {
    const ps = chart.personality[p.id];
    const ds = chart.design[p.id];
    return [p.nameZh, ps ? `${gateStr(ps.gate)}.${ps.line}` : '—', ds ? `${gateStr(ds.gate)}.${ds.line}` : '—'];
  });

  const caveats = ['閘門關鍵字是本站的簡短譯名，不同人類圖流派的用詞可能不同。'];
  if (timeUnknown) caveats.push('出生時間不確定：類型、權威、人生角色可能隨時間改變，解讀時請說明哪些結論比較不可靠。');

  return {
    system: '人類圖',
    title: `${name && !hidePersonal ? name + '的' : '我的'}人類圖`,
    source: '排盤：swanky.github.io/human-design/，行星位置採高精度天文星曆計算',
    sections: [
      { heading: '基本資料', lines: basic },
      { heading: '九大中心', lines: centers },
      { heading: '有定義的通道', lines: channels.length ? channels : ['沒有完整通道（反映者）'] },
      { heading: '行星閘門與爻（個性＝意識層、設計＝潛意識層）', table: { head: ['行星', '個性（黑）', '設計（紅）'], rows } },
    ],
    caveats,
    extraRules: ['請用策略與內在權威當主軸，把結論落到工作、決策與人際的具體做法；不要宣稱命定或保證結果。'],
  };
}
