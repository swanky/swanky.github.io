// hd-judge.js — 判定層：閘門激活 → 通道/中心定義 → 類型/內在權威/人生角色/定義
// 純函數、零 DOM 依賴；輸入為 personality/design 兩組 13 天體的 { gate, line }。

import { CHANNELS } from './hd-data-channels.js';
import { CENTERS, CENTER_IDS } from './hd-data-centers.js';
import { PLANET_IDS } from './hd-astro.js';
import { PROFILES } from './hd-data-texts.js';

const MOTOR_CENTERS = CENTER_IDS.filter((id) => CENTERS[id].motor); // heart, sacral, solar, root

// personality / design: { sun: {gate, line}, earth: {...}, ..., pluto: {...} }
export function judge(personality, design) {
  // ---- 閘門激活表 ----
  const gateActivations = {};
  const mark = (col, positions) => {
    for (const planet of PLANET_IDS) {
      const { gate } = positions[planet];
      if (!gateActivations[gate]) gateActivations[gate] = { p: false, d: false, sources: [] };
      gateActivations[gate][col] = true;
      gateActivations[gate].sources.push({ col, planet });
    }
  };
  mark('p', personality);
  mark('d', design);

  // ---- 通道與中心定義 ----
  const definedChannels = CHANNELS.filter(
    (c) => gateActivations[c.gates[0]] && gateActivations[c.gates[1]],
  );
  const definedCenters = [...new Set(definedChannels.flatMap((c) => c.centers))];
  const openCenters = CENTER_IDS.filter((id) => !definedCenters.includes(id));
  const has = (id) => definedCenters.includes(id);

  // 鄰接表（節點 = 定義的中心，邊 = 定義的通道）
  const adj = new Map(definedCenters.map((id) => [id, new Set()]));
  for (const c of definedChannels) {
    adj.get(c.centers[0]).add(c.centers[1]);
    adj.get(c.centers[1]).add(c.centers[0]);
  }

  const reachableFrom = (start) => {
    const seen = new Set([start]);
    const queue = [start];
    while (queue.length) {
      for (const next of adj.get(queue.shift())) {
        if (!seen.has(next)) { seen.add(next); queue.push(next); }
      }
    }
    return seen;
  };

  // ---- 定義（連通分量數）----
  let components = 0;
  const visited = new Set();
  for (const id of definedCenters) {
    if (visited.has(id)) continue;
    components++;
    for (const r of reachableFrom(id)) visited.add(r);
  }
  const definition = ['none', 'single', 'split', 'triple', 'quadruple'][components];

  // ---- 類型 ----
  const throatGroup = has('throat') ? reachableFrom('throat') : new Set();
  const motorToThroat = MOTOR_CENTERS.some((m) => throatGroup.has(m));

  let type;
  if (definedCenters.length === 0) type = 'reflector';
  else if (has('sacral')) type = motorToThroat ? 'mg' : 'generator';
  else if (motorToThroat) type = 'manifestor';
  else type = 'projector';

  // ---- 內在權威（優先序）----
  let authority;
  if (type === 'reflector') authority = 'lunar';
  else if (has('solar')) authority = 'emotional';
  else if (has('sacral')) authority = 'sacral';
  else if (has('spleen')) authority = 'splenic';
  else if (has('heart')) authority = 'ego';
  else if (has('g') && throatGroup.has('g')) authority = 'selfProjected';
  else authority = 'mental';

  // ---- 人生角色與輪迴交叉 ----
  const profile = `${personality.sun.line}/${design.sun.line}`;
  const crossGates = {
    pSun: personality.sun.gate, pEarth: personality.earth.gate,
    dSun: design.sun.gate, dEarth: design.earth.gate,
  };
  const crossAngle = PROFILES[profile] ? PROFILES[profile].angle : null;

  return {
    gateActivations, definedChannels, definedCenters, openCenters,
    definition, type, authority, profile, crossGates, crossAngle, motorToThroat,
  };
}
