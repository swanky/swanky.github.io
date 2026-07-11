// hd-composite.js — 合盤（Connection Chart）計算核心：四類關係通道、合盤中心、definition。
// 輸入：兩個 HumanDesignChart（hd-adapter toHumanDesignChart 的輸出）；純函數、不改輸入、無 DOM/analytics 副作用。
// 分類真值表（與 Jovian/Maia 官方及 SelfMap 過濾後雙站實測校準，見 docs/hd-redesign/composite-golden-design.md）：
//   companionship＝雙方皆完整通道；dominance＝一方完整、對方兩端全無；
//   compromise＝一方完整、對方持單端；electromagnetic＝雙方皆不完整、兩端合起湊齊。
//   懸掛 gate（單方持單端、對方全無）不屬任何類、不定義中心。
// 合盤中心只由合盤完整通道（四類聯集）導出；definition 以四類通道為邊做連通分量。
// 刻意不輸出共同 type/authority/profile/cross——合盤無此語意（spec §5.3/§8）。
import { CHANNELS } from './hd-data-channels.js';

export const COMPOSITE_VERSION = 1;

export const CENTER_IDS = ['head', 'ajna', 'throat', 'g', 'heart', 'spleen', 'solar', 'sacral', 'root'];

const DEFINITION_KINDS = ['none', 'single', 'split', 'triple-split', 'quadruple-split'];

function assertChart(c, label) {
  if (!c || typeof c !== 'object' || !c.gates || !c.channels || !c.centers) {
    throw new Error(`computeComposite: ${label} 必須是 HumanDesignChart（含 gates/channels/centers）`);
  }
}

export function computeComposite(chartA, chartB) {
  assertChart(chartA, 'chartA');
  assertChart(chartB, 'chartB');
  const act = (c, g) => !!(c.gates[g] && c.gates[g].activated);
  const full = (c, id) => !!c.channels[id] && c.channels[id] !== 'off';

  const gates = {};
  for (let g = 1; g <= 64; g++) {
    const a = act(chartA, g);
    const b = act(chartB, g);
    const owners = [];
    if (a) owners.push('a');
    if (b) owners.push('b');
    gates[g] = { owners, a: { active: a }, b: { active: b } };
  }

  const channels = {};
  const categories = { electromagnetic: [], companionship: [], dominance: [], compromise: [] };
  for (const ch of CHANNELS) {
    const [g1, g2] = ch.gates;
    const aFull = full(chartA, ch.id);
    const bFull = full(chartB, ch.id);
    let state = 'off';
    let completeFor = [];
    if (aFull && bFull) {
      state = 'companionship';
      completeFor = ['a', 'b'];
    } else if (aFull || bFull) {
      const other = aFull ? chartB : chartA;
      state = (act(other, g1) || act(other, g2)) ? 'compromise' : 'dominance';
      completeFor = [aFull ? 'a' : 'b'];
    } else if ((act(chartA, g1) || act(chartB, g1)) && (act(chartA, g2) || act(chartB, g2))) {
      state = 'electromagnetic';
    }
    channels[ch.id] = {
      state,
      gateOwners: { [g1]: gates[g1].owners.slice(), [g2]: gates[g2].owners.slice() },
      completeFor,
      definedInComposite: state !== 'off',
    };
    if (state !== 'off') categories[state].push(ch.id);
  }

  const centers = {};
  for (const c of CENTER_IDS) centers[c] = { defined: false, sourceChannels: [], dynamic: 'open' };
  for (const ch of CHANNELS) {
    if (!channels[ch.id].definedInComposite) continue;
    for (const c of ch.centers) {
      centers[c].defined = true;
      centers[c].sourceChannels.push(ch.id);
    }
  }
  // dynamic：關係裡這個中心的來源（報告端 center_dynamic 同語意）
  //   both＝雙方各自定義；a/b＝單方定義（帶給對方）；new＝雙方皆開放、合盤才接通（魔法中心）；open＝共同開放
  for (const c of CENTER_IDS) {
    const aDef = chartA.centers[c] === 'defined';
    const bDef = chartB.centers[c] === 'defined';
    centers[c].dynamic = aDef && bDef ? 'both' : aDef ? 'a' : bDef ? 'b' : centers[c].defined ? 'new' : 'open';
  }

  // definition：合盤完整通道為邊、其跨中心為節點的連通分量（CENTER_IDS 固定序→輸出確定）
  const adj = new Map();
  for (const ch of CHANNELS) {
    if (!channels[ch.id].definedInComposite) continue;
    const [c1, c2] = ch.centers;
    if (!adj.has(c1)) adj.set(c1, new Set());
    if (!adj.has(c2)) adj.set(c2, new Set());
    adj.get(c1).add(c2);
    adj.get(c2).add(c1);
  }
  const components = [];
  const seen = new Set();
  for (const start of CENTER_IDS) {
    if (!adj.has(start) || seen.has(start)) continue;
    const comp = [];
    const queue = [start];
    while (queue.length) {
      const cur = queue.shift();
      if (seen.has(cur)) continue;
      seen.add(cur);
      comp.push(cur);
      for (const nb of adj.get(cur)) if (!seen.has(nb)) queue.push(nb);
    }
    components.push(comp);
  }
  const definition = { kind: DEFINITION_KINDS[components.length] || `${components.length}-split`, components };

  // 共鳴閘門全量語意：兩人同持的 gate（外部站呈現會再過濾掉已成類通道者，那是呈現層的事）
  const sharedGates = [];
  for (let g = 1; g <= 64; g++) if (gates[g].owners.length === 2) sharedGates.push(g);

  return {
    version: COMPOSITE_VERSION,
    people: { a: { chart: chartA }, b: { chart: chartB } },
    gates,
    channels,
    categories,
    centers,
    definition,
    sharedGates,
  };
}
