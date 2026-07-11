// hd-golden-run.mjs — golden 交叉驗證專用 runner（讀真引擎，輸出全部可比對欄位）
// 用法：node tools/hd-golden-run.mjs <YYYY-MM-DD> <HH:MM> <tz>
//   tz 可為 IANA 字串（Asia/Taipei）或帶正負號的偏移分鐘數（+480 / -300）
// 輸出：JSON（type/authority/profile/definition/中心/通道/P&D 每行星 gate.line/交叉）
import { createRequire } from 'node:module';
import { _injectAstronomy, PLANET_IDS } from '../assets/js/human-design/hd-astro.js';
import { computeChart } from '../assets/js/human-design/hd-engine.js';

const require = createRequire(import.meta.url);
_injectAstronomy(require('../assets/vendor/astronomy-engine/astronomy.browser.min.js'));

const [dateArg, timeArg, tzArg] = process.argv.slice(2);
const [year, month, day] = dateArg.split('-').map(Number);
const [hour, minute] = timeArg.split(':').map(Number);

// tz：純數字（含 +/-）→ offsetMinutes；否則當 IANA 字串
const tz = /^[+-]?\d+$/.test(tzArg) ? { offsetMinutes: Number(tzArg) } : tzArg;
const input = { year, month, day, hour, minute, tz };

const chart = computeChart(input);

const TYPE_EN = { generator: 'Generator', mg: 'Manifesting Generator', manifestor: 'Manifestor', projector: 'Projector', reflector: 'Reflector' };
const AUTH_EN = { emotional: 'Emotional (Solar Plexus)', sacral: 'Sacral', splenic: 'Splenic', ego: 'Ego / Heart', selfProjected: 'Self-Projected', mental: 'Mental / None (Environment)', lunar: 'Lunar' };
const DEF_EN = { none: 'No Definition', single: 'Single Definition', split: 'Split Definition', triple: 'Triple Split', quadruple: 'Quadruple Split' };

const planetLines = (side) => PLANET_IDS.map((p) => ({
  planet: p, gate: chart[side][p].gate, line: chart[side][p].line,
}));

const out = {
  input: { date: dateArg, time: timeArg, tz: tzArg },
  tzInfo: chart.tzInfo,
  birthUtcIso: chart.birthUtcIso,
  designUtcIso: chart.designUtcIso,
  type: chart.type,
  typeEn: TYPE_EN[chart.type],
  authority: chart.authority,
  authorityEn: AUTH_EN[chart.authority],
  profile: chart.profile,
  definition: chart.definition,
  definitionEn: DEF_EN[chart.definition],
  definedCenters: chart.definedCenters,
  openCenters: chart.openCenters,
  definedChannels: chart.definedChannels.map((c) => c.id).sort(),
  cross: {
    gates: `${chart.crossGates.pSun}/${chart.crossGates.pEarth} | ${chart.crossGates.dSun}/${chart.crossGates.dEarth}`,
    angle: chart.crossAngle,
  },
  personalityGates: [...new Set(PLANET_IDS.map((p) => chart.personality[p].gate))].sort((a, b) => a - b),
  designGates: [...new Set(PLANET_IDS.map((p) => chart.design[p].gate))].sort((a, b) => a - b),
  personalityPlanets: planetLines('personality'),
  designPlanets: planetLines('design'),
};

console.log(JSON.stringify(out, null, 2));
