// hd-engine.js — 計算引擎 orchestrator：出生資料 → 完整人類圖 chart 物件
// 流程：時區轉換 → 出生/設計兩組 13 天體黃經 → 閘門爻線映射 → 類型/權威/角色判定。
// 零 DOM 依賴；Node 測試與瀏覽器共用。

import { positionsAt, designTimeMs, PLANET_IDS } from './hd-astro.js';
import { lonToGateLine, lonToZodiac } from './hd-mandala.js';
import { zonedToUtc, zonedToUtcManual } from './hd-timezone.js';
import { judge } from './hd-judge.js';
import { getFixing } from './hd-data-fixing.js';

// 行星黃經組 → { sun: { lon, gate, line, degInGate, zodiacLabel, fixing }, ... }
// fixing：'exalted'（固定於擢升 ▲）| 'detriment'（固定於衰落 ▼）| null（含交點皆 null）
function mapPositions(lons) {
  const out = {};
  for (const id of PLANET_IDS) {
    const lon = lons[id];
    const gl = lonToGateLine(lon);
    out[id] = { lon, ...gl, zodiacLabel: lonToZodiac(lon).label, fixing: getFixing(id, gl.gate, gl.line) };
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

function stableValues(samples, getter) {
  const found = new Map();
  for (const chart of samples) {
    const value = getter(chart);
    const key = JSON.stringify(value);
    if (!found.has(key)) found.set(key, value);
  }
  return { stable: found.size === 1, values: [...found.values()] };
}

function activationStability(samples) {
  const changed = [];
  for (const side of ['personality', 'design']) {
    for (const planet of PLANET_IDS) {
      const result = stableValues(samples, (chart) => {
        const pos = chart[side][planet];
        return `${pos.gate}.${pos.line}`;
      });
      if (!result.stable) changed.push({ side, planet, values: result.values });
    }
  }
  return { stable: changed.length === 0, changed };
}

function summarizeStability(samples, meta) {
  const stability = {
    ...meta,
    type: stableValues(samples, (c) => c.type),
    authority: stableValues(samples, (c) => c.authority),
    profile: stableValues(samples, (c) => c.profile),
    definition: stableValues(samples, (c) => c.definition),
    definedCenters: stableValues(samples, (c) => [...c.definedCenters].sort()),
    undefinedCenters: stableValues(samples, (c) => [...c.undefinedCenters].sort()),
    fullyOpenCenters: stableValues(samples, (c) => [...c.fullyOpenCenters].sort()),
    channels: stableValues(samples, (c) => c.definedChannels.map((x) => x.id).sort()),
    cross: stableValues(samples, (c) => ({ ...c.crossGates, angle: c.crossAngle, name: c.incarnationCross?.nameZh || null })),
    activations: activationStability(samples),
  };
  stability.coreStable = ['type', 'authority', 'profile', 'definition'].every((key) => stability[key].stable);
  stability.allStable = ['type', 'authority', 'profile', 'definition', 'definedCenters', 'undefinedCenters',
    'fullyOpenCenters', 'channels', 'cross', 'activations'].every((key) => stability[key].stable);
  return stability;
}

function shiftLocalMinutes(input, deltaMinutes) {
  const local = new Date(Date.UTC(input.year, input.month - 1, input.day, input.hour, input.minute + deltaMinutes));
  return {
    ...input,
    year: local.getUTCFullYear(), month: local.getUTCMonth() + 1, day: local.getUTCDate(),
    hour: local.getUTCHours(), minute: local.getUTCMinutes(),
  };
}

// 已知大致時間：以輸入時間與前後邊界取樣，適合檢查 ±15／30／60 分鐘的結果是否穩定。
export function computeChartUncertainty(input, uncertaintyMinutes, options = {}) {
  if (![15, 30, 60].includes(uncertaintyMinutes)) {
    throw new RangeError('時間誤差只接受 15、30 或 60 分鐘。');
  }
  const samples = [-uncertaintyMinutes, 0, uncertaintyMinutes]
    .map((delta) => computeChart(shiftLocalMinutes(input, delta), options));
  return {
    primary: samples[1],
    samples,
    stability: summarizeStability(samples, { mode: 'range', uncertaintyMinutes }),
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

  return {
    primary,
    samples,
    stability: summarizeStability(samples, { mode: 'day', uncertaintyMinutes: null }),
  };
}
