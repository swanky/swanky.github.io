// _composite-helpers.mjs — 合盤測試共用工具（非測試檔；node --test 不收）。
// makeChart：手工構造 HumanDesignChart（通道/中心按定義自算，不經 hd-judge——測試輸入為手工設計的
// gate 組合，期望值為真值表語意本身，不涉引擎推導）。
import { CHANNELS } from '../../assets/js/human-design/hd-data-channels.js';
import { CENTER_IDS } from '../../assets/js/human-design/hd-composite.js';

export function makeChart(activeGates) {
  const set = new Set(activeGates);
  const gates = {};
  for (let g = 1; g <= 64; g++) gates[g] = { gate: g, activated: set.has(g), personality: set.has(g), design: false };
  const channels = {};
  const centerDefined = new Set();
  for (const ch of CHANNELS) {
    const on = set.has(ch.gates[0]) && set.has(ch.gates[1]);
    channels[ch.id] = on ? 'personality' : 'off';
    if (on) ch.centers.forEach(c => centerDefined.add(c));
  }
  const centers = {};
  for (const c of CENTER_IDS) centers[c] = centerDefined.has(c) ? 'defined' : 'open';
  return { gates, channels, centers };
}

export function deepFreeze(o) {
  Object.freeze(o);
  for (const v of Object.values(o)) if (v && typeof v === 'object' && !Object.isFrozen(v)) deepFreeze(v);
  return o;
}

// 極簡 XML 良構檢查（棧式標籤平衡；自閉合/宣告略過）——合盤 SVG 無 CDATA/註解/嵌套引號情境
export function assertWellFormedXml(svg) {
  const tags = svg.match(/<[^>]+>/g) || [];
  const stack = [];
  for (const t of tags) {
    if (/^<\?|^<!/.test(t) || /\/>$/.test(t)) continue;
    const m = t.match(/^<(\/?)([a-zA-Z][\w:-]*)/);
    if (!m) throw new Error(`非法標籤：${t.slice(0, 60)}`);
    if (m[1]) {
      const open = stack.pop();
      if (open !== m[2]) throw new Error(`標籤不平衡：</${m[2]}> 對上 <${open}>`);
    } else {
      stack.push(m[2]);
    }
  }
  if (stack.length) throw new Error(`未閉合標籤：${stack.join(',')}`);
}
