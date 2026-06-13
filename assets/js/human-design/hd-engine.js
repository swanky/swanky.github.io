// hd-engine.js — 計算引擎 orchestrator：出生資料 → 完整人類圖 chart 物件
// 流程：時區轉換 → 出生/設計兩組 13 天體黃經 → 閘門爻線映射 → 類型/權威/角色判定。
// 零 DOM 依賴；Node 測試與瀏覽器共用。

import { positionsAt, designTimeMs, PLANET_IDS } from './hd-astro.js';
import { lonToGateLine, lonToZodiac } from './hd-mandala.js';
import { zonedToUtc, zonedToUtcManual } from './hd-timezone.js';
import { judge } from './hd-judge.js';

// 行星黃經組 → { sun: { lon, gate, line, degInGate, zodiacLabel }, ... }
function mapPositions(lons) {
  const out = {};
  for (const id of PLANET_IDS) {
    const lon = lons[id];
    out[id] = { lon, ...lonToGateLine(lon), zodiacLabel: lonToZodiac(lon).label };
  }
  return out;
}

// input: { year, month, day, hour, minute, tz: 'Asia/Taipei' | { offsetMinutes: 480 } }
// options: { nodeMode: 'true' | 'mean' }
export function computeChart(input, options = {}) {
  const nodeMode = options.nodeMode || 'true';
  const { year, month, day, hour, minute } = input;

  const tzInfo = typeof input.tz === 'string'
    ? zonedToUtc(year, month, day, hour, minute, input.tz)
    : zonedToUtcManual(year, month, day, hour, minute, input.tz.offsetMinutes);

  const birthUtcMs = tzInfo.utcMs;
  const designUtcMs = designTimeMs(birthUtcMs);

  const personality = mapPositions(positionsAt(birthUtcMs, nodeMode));
  const design = mapPositions(positionsAt(designUtcMs, nodeMode));
  const result = judge(personality, design);

  return {
    input: { ...input },
    tzInfo,
    birthUtcIso: new Date(birthUtcMs).toISOString(),
    designUtcIso: new Date(designUtcMs).toISOString(),
    personality,
    design,
    ...result,
  };
}

// 未知出生時間模式：一天取五個採樣點，主結果用正午，並回報哪些屬性整日穩定。
const SAMPLE_TIMES = [
  { hour: 0, minute: 0 }, { hour: 6, minute: 0 }, { hour: 12, minute: 0 },
  { hour: 18, minute: 0 }, { hour: 23, minute: 59 },
];

export function computeChartSamples(input, options = {}) {
  const samples = SAMPLE_TIMES.map((t) => computeChart({ ...input, ...t }, options));
  const primary = samples[2]; // 正午

  const stabilityOf = (getter) => {
    const values = [...new Set(samples.map(getter))];
    return { stable: values.length === 1, values };
  };

  return {
    primary,
    samples,
    stability: {
      type: stabilityOf((c) => c.type),
      authority: stabilityOf((c) => c.authority),
      profile: stabilityOf((c) => c.profile),
      definition: stabilityOf((c) => c.definition),
    },
  };
}
