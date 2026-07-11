// hd-adapter.js — computeChart() 原始輸出 → 標準 HumanDesignChart（資料與 Renderer 分離層）
// spec v2 第十節：Renderer 不得自行計算行星/推導 Gate/Type，一律吃這份乾淨資料模型。
// 純函數、零 DOM、零副作用；不 mutate 輸入 chart。
//
// 現行引擎輸出（hd-engine.js computeChart / hd-judge.js judge）與本層轉換要點：
//   · gateActivations 是 sparse（只收命中門，值 {p,d,sources}）→ 補完 64 門全量、旗標改名。
//   · definedCenters/openCenters 互補陣列 → 9 中心 'defined' | 'open'。
//   · definedChannels 只有二元（定義/未定義）、無四態 → 本層重算：union 兩端門的 p/d 旗標得
//     'off' | 'personality' | 'design' | 'mixed'（渲染器據此上黑/紅/雙色）。
//
// HumanDesignChart 形（spec 第十節；欄位命名依 spec + 本任務規格）：
//   { gates:   { [1..64]: { gate, activated, personality, design } },   // 64 門全量
//     channels:{ [id]:    'off' | 'personality' | 'design' | 'mixed' }, // 36 條四態
//     centers: { [id]:    'defined' | 'open' } }                        // 9 中心

import { CHANNELS } from './hd-data-channels.js';
import { CENTER_IDS } from './hd-data-centers.js';

// 通道四態＝union 兩端門的 p/d 旗標：
//   兩端任一未啟動 → 'off'（通道未定義）；
//   兩端皆啟動後，看跨兩端的 P/D 併集：有 P 有 D → 'mixed'；只 P → 'personality'；只 D → 'design'。
function channelState(a, b) {
  if (!a || !b) return 'off'; // 需兩端門皆啟動，通道才成立
  const hasP = !!(a.p || b.p);
  const hasD = !!(a.d || b.d);
  if (hasP && hasD) return 'mixed';
  return hasP ? 'personality' : 'design';
}

export function toHumanDesignChart(chart) {
  const ga = (chart && chart.gateActivations) || {};
  const defined = new Set((chart && chart.definedCenters) || []);

  // 64 門全量（sparse 補完；旗標改名 p→personality、d→design；activated＝該門有任一命中）
  const gates = {};
  for (let g = 1; g <= 64; g++) {
    const a = ga[g];
    gates[g] = {
      gate: g,
      activated: !!a,
      personality: !!(a && a.p),
      design: !!(a && a.d),
    };
  }

  // 36 條四態（重算；鍵＝CHANNELS 的「小-大」id，與 hd-geometry-v2.js CHANNEL_PATHS2 對齊）
  const channels = {};
  for (const ch of CHANNELS) {
    const [a, b] = ch.gates;
    channels[ch.id] = channelState(ga[a], ga[b]);
  }

  // 9 中心 'defined' | 'open'（依 definedCenters 判定，openCenters 為互補）
  const centers = {};
  for (const id of CENTER_IDS) centers[id] = defined.has(id) ? 'defined' : 'open';

  return { gates, channels, centers };
}
