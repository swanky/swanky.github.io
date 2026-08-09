#!/usr/bin/env node
import { createRequire } from 'node:module';
import { computeChart, computeChartSamples, computeChartUncertainty } from '../../../../assets/js/human-design/hd-engine.js';
import { PLANET_IDS } from '../../../../assets/js/human-design/hd-astro.js';
import { _injectAstronomy } from '../../../../assets/js/core/core-astro.js';

const require = createRequire(import.meta.url);
_injectAstronomy(require('../../../../assets/vendor/astronomy-engine/astronomy.browser.min.js'));

function fail(message) {
  process.stderr.write(`錯誤：${message}\n`);
  process.exit(2);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === '--unknown-time') { args.unknownTime = true; continue; }
    if (!token.startsWith('--')) fail(`無法辨識參數 ${token}`);
    const value = argv[++i];
    if (!value || value.startsWith('--')) fail(`${token} 缺少值`);
    args[token.slice(2)] = value;
  }
  return args;
}

function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) fail('--date 必須是 YYYY-MM-DD');
  const [, year, month, day] = match.map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCFullYear() !== year || probe.getUTCMonth() + 1 !== month || probe.getUTCDate() !== day) fail('--date 不是有效日期');
  return { year, month, day };
}

function parseTime(value, unknownTime) {
  if (unknownTime && !value) return { hour: 12, minute: 0 };
  const match = /^(\d{2}):(\d{2})$/.exec(value || '');
  if (!match) fail('--time 必須是 24 小時制 HH:mm');
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) fail('--time 不是有效時間');
  return { hour, minute };
}

function parseTz(value) {
  if (!value) fail('需要 --tz，例如 Asia/Taipei 或 +08:00');
  const offset = /^([+-])(\d{2}):(\d{2})$/.exec(value);
  if (!offset) return value;
  const minutes = Number(offset[2]) * 60 + Number(offset[3]);
  if (Number(offset[2]) > 14 || Number(offset[3]) > 59) fail('--tz 的 UTC 偏移無效');
  return { offsetMinutes: offset[1] === '-' ? -minutes : minutes };
}

function activations(positions) {
  return Object.fromEntries(PLANET_IDS.map((planet) => {
    const pos = positions[planet];
    return [planet, { gate: pos.gate, line: pos.line, longitude: Number(pos.lon.toFixed(6)), fixing: pos.fixing }];
  }));
}

function serialize(chart, stability, args) {
  return {
    input: {
      date: `${chart.input.year}-${String(chart.input.month).padStart(2, '0')}-${String(chart.input.day).padStart(2, '0')}`,
      time: `${String(chart.input.hour).padStart(2, '0')}:${String(chart.input.minute).padStart(2, '0')}`,
      timezone: args.tz,
      unknownTime: !!args.unknownTime,
      uncertaintyMinutes: args.uncertainty ? Number(args.uncertainty) : null,
    },
    meta: { birthUtc: chart.birthUtcIso, designUtc: chart.designUtcIso, timezoneLabel: chart.tzInfo.labelZh },
    chart: {
      type: chart.type, authority: chart.authority, profile: chart.profile, definition: chart.definition,
      centers: { defined: chart.definedCenters, undefined: chart.undefinedCenters, fullyOpen: chart.fullyOpenCenters, open: chart.openCenters },
      channels: chart.definedChannels.map((channel) => ({ id: channel.id, nameZh: channel.nameZh, centers: channel.centers })),
      cross: { ...chart.incarnationCross, angle: chart.crossAngle, gates: chart.crossGates },
      activations: { personality: activations(chart.personality), design: activations(chart.design) },
    },
    stability,
  };
}

const args = parseArgs(process.argv.slice(2));
const input = { ...parseDate(args.date), ...parseTime(args.time, args.unknownTime), tz: parseTz(args.tz) };
const uncertainty = args.uncertainty === undefined ? 0 : Number(args.uncertainty);
if (args.unknownTime && uncertainty) fail('--unknown-time 與 --uncertainty 不可同時使用');
if (!args.unknownTime && uncertainty && ![15, 30, 60].includes(uncertainty)) fail('--uncertainty 只接受 15、30、60');

try {
  let primary;
  let stability = null;
  if (args.unknownTime) ({ primary, stability } = computeChartSamples(input));
  else if (uncertainty) ({ primary, stability } = computeChartUncertainty(input, uncertainty));
  else primary = computeChart(input);
  process.stdout.write(`${JSON.stringify(serialize(primary, stability, args), null, 2)}\n`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
