// bodygraph-v2.test.mjs — Phase 3-4 生產模組測試（hd-adapter + hd-bodygraph）。
// 舊 geometry.test.mjs（v1 系統）一字不動；本檔獨立測 v2 資料層與字串渲染器。
// 涵蓋：adapter（sparse→64 全量、四態 union、輸入不可變）、renderer 結構紅線、三主題、
//       同位鐵證（hero×modern vs v2t-b-chart.svg 拍板基準）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { toHumanDesignChart } from '../../assets/js/human-design/hd-adapter.js';
import { renderBodygraph } from '../../assets/js/human-design/hd-bodygraph.js';
import { CHANNELS } from '../../assets/js/human-design/hd-data-channels.js';
import { CENTER_IDS } from '../../assets/js/human-design/hd-data-centers.js';
import { VIEWBOX2, CHANNEL_PATHS2, channelHalfDs2 } from '../../assets/js/human-design/hd-geometry-v2.js';
import { THEMES_V2 } from '../../assets/js/human-design/hd-theme.js';

const FIX = new URL('./fixtures/', import.meta.url);
const loadFixture = (name) => JSON.parse(readFileSync(new URL(name + '.json', FIX), 'utf8'));
const FIXTURE_NAMES = ['all-undefined', 'single-channel', 'multi-hang', 'all-personality', 'all-design', 'mixed', 'integration', 'hero'];

// ─────────────────────────────────────────────────────────────────────────────
// 1) adapter：sparse→64 全量、四態 union、9 中心、輸入不可變
// ─────────────────────────────────────────────────────────────────────────────

// 合成 computeChart 風輸入（adapter 只讀 gateActivations / definedCenters）
function rawChart() {
  const g = (p, d) => ({ p, d, sources: [] });
  return {
    gateActivations: {
      1: g(true, false), 8: g(true, false),   // 1-8   → personality（兩端皆 P）
      4: g(false, true), 63: g(false, true),  // 4-63  → design（兩端皆 D）
      11: g(true, false), 56: g(false, true), // 11-56 → mixed（P 端 + D 端）
      20: g(true, true), 34: g(true, false),  // 20-34 → mixed（一端 P&D）；且測門雙旗標
      24: g(true, false),                       // 24-61 → off（夥伴 61 未啟動）
    },
    definedCenters: ['g', 'throat', 'ajna'],
    openCenters: ['head', 'heart', 'sacral', 'spleen', 'solar', 'root'],
  };
}

test('adapter：gates 補完 64 門全量，sparse 命中/未命中皆正確', () => {
  const hd = toHumanDesignChart(rawChart());
  assert.equal(Object.keys(hd.gates).length, 64, '應為 64 門全量');
  for (let i = 1; i <= 64; i++) assert.ok(hd.gates[i], `門 ${i} 缺項`);
  // 命中門
  assert.deepEqual(hd.gates[1], { gate: 1, activated: true, personality: true, design: false });
  assert.deepEqual(hd.gates[4], { gate: 4, activated: true, personality: false, design: true });
  assert.deepEqual(hd.gates[20], { gate: 20, activated: true, personality: true, design: true });
  // 未命中門（sparse 補完為未啟動）
  assert.deepEqual(hd.gates[5], { gate: 5, activated: false, personality: false, design: false });
  assert.deepEqual(hd.gates[64], { gate: 64, activated: false, personality: false, design: false });
});

test('adapter：channels 36 條四態，union 兩端門旗標（含 mixed 判定）', () => {
  const hd = toHumanDesignChart(rawChart());
  assert.equal(Object.keys(hd.channels).length, 36, '應為 36 通道');
  assert.equal(hd.channels['1-8'], 'personality', '兩端皆 P → personality');
  assert.equal(hd.channels['4-63'], 'design', '兩端皆 D → design');
  assert.equal(hd.channels['11-56'], 'mixed', 'P 端 + D 端 → mixed');
  assert.equal(hd.channels['20-34'], 'mixed', '一端門帶 P&D → mixed');
  assert.equal(hd.channels['24-61'], 'off', '夥伴門未啟動 → off');
  // 四態皆為合法列舉值
  for (const s of Object.values(hd.channels)) assert.ok(['off', 'personality', 'design', 'mixed'].includes(s));
});

test('adapter：channels 鍵集＝CHANNELS id 集＝CHANNEL_PATHS2 幾何鍵集（可渲染保證）', () => {
  const hd = toHumanDesignChart(rawChart());
  const adapterKeys = new Set(Object.keys(hd.channels));
  const channelKeys = new Set(CHANNELS.map((c) => c.id));
  const geomKeys = new Set(Object.keys(CHANNEL_PATHS2));
  assert.deepEqual([...adapterKeys].sort(), [...channelKeys].sort(), 'adapter vs CHANNELS');
  assert.deepEqual([...channelKeys].sort(), [...geomKeys].sort(), 'CHANNELS vs 幾何');
});

test('adapter：centers 9 中心，依 definedCenters 判 defined/open', () => {
  const hd = toHumanDesignChart(rawChart());
  assert.equal(Object.keys(hd.centers).length, 9);
  for (const id of CENTER_IDS) {
    const expect = ['g', 'throat', 'ajna'].includes(id) ? 'defined' : 'open';
    assert.equal(hd.centers[id], expect, `中心 ${id}`);
  }
});

test('adapter：輸入不可變（不 mutate chart，輸出不共用參考）', () => {
  const raw = rawChart();
  const snapshot = JSON.stringify(raw);
  const hd = toHumanDesignChart(raw);
  assert.equal(JSON.stringify(raw), snapshot, 'chart 被改動了');
  // 輸出為全新物件，改動不回寫輸入
  hd.gates[1].personality = false;
  assert.equal(raw.gateActivations[1].p, true, '輸出與輸入共用了參考');
});

test('adapter：邊界——空 chart（reflector 式，無啟動）→ 全 off/open', () => {
  const hd = toHumanDesignChart({ gateActivations: {}, definedCenters: [] });
  assert.equal(Object.keys(hd.gates).length, 64);
  assert.ok(Object.values(hd.gates).every((g) => !g.activated));
  assert.ok(Object.values(hd.channels).every((s) => s === 'off'));
  assert.ok(Object.values(hd.centers).every((s) => s === 'open'));
});

// ─────────────────────────────────────────────────────────────────────────────
// 2) renderer：結構斷言（報告端紅線）、viewBox、casing 對數、插座墊色、三主題
// ─────────────────────────────────────────────────────────────────────────────

test('renderer：報告端紅線——無 <polygon> / <style> / class / gradient', () => {
  for (const name of FIXTURE_NAMES) {
    for (const theme of ['classic', 'modern', 'dark']) {
      const svg = renderBodygraph(loadFixture(name), { theme });
      assert.doesNotMatch(svg, /<polygon\b/, `${name}/${theme} 含 <polygon>`);
      assert.doesNotMatch(svg, /<style[\s>]/, `${name}/${theme} 含 <style>`);
      assert.doesNotMatch(svg, /\sclass=/, `${name}/${theme} 含 class`);
      assert.doesNotMatch(svg, /linearGradient|radialGradient|stop-opacity/, `${name}/${theme} 含 gradient`);
    }
  }
});

test('renderer：<svg> viewBox 正確、role=img + aria-label 保留', () => {
  const { minX, minY, w, h } = VIEWBOX2;
  const svg = renderBodygraph(loadFixture('hero'), { theme: 'modern' });
  assert.ok(svg.startsWith(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${w} ${h}"`), 'viewBox 前綴錯');
  assert.match(svg, /viewBox="0 0 1000 1400"/);
  assert.match(svg, /role="img"/);
  assert.match(svg, /aria-label="人類圖 bodygraph"/);
  assert.ok(svg.trim().endsWith('</svg>'));
});

test('renderer：36 通道 casing 對數（未啟動軌 casing×36 + 芯×36）', () => {
  // stubs:false 隔離出底層 track（casing 寬 16、芯 12 為 track 專屬；其餘層線寬皆 ≤10）
  const svg = renderBodygraph(loadFixture('all-undefined'), { theme: 'modern', stubs: false });
  assert.equal((svg.match(/stroke-width="16"/g) || []).length, 36, 'track casing 應 36 條');
  assert.equal((svg.match(/stroke-width="12"/g) || []).length, 36, 'track 白芯應 36 條');
});

test('renderer：插座墊色＝theme socket.pad 值（三主題 × 已定義中心的未啟動門）', () => {
  // hero 的 throat 為已定義；其未啟動門（如 62@[450,486]）插座填色＝該主題 pad.throat
  for (const theme of ['classic', 'modern', 'dark']) {
    const svg = renderBodygraph(loadFixture('hero'), { theme });
    const pad = THEMES_V2[theme].skin.socket.pad.throat;
    assert.ok(svg.includes(`cx="450" cy="486" r="15" fill="${pad}"`), `${theme} throat 插座墊色 ${pad} 未出現於門 62`);
  }
});

test('renderer：三主題各渲染成功、頁底/卡面色隨主題', () => {
  for (const theme of ['classic', 'modern', 'dark']) {
    const svg = renderBodygraph(loadFixture('integration'), { theme });
    assert.match(svg, /^<svg /, `${theme} 應以 <svg 開頭`);
    assert.ok(svg.includes(`fill="${THEMES_V2[theme].skin.surface}"`), `${theme} 卡面底色未出現`);
    assert.ok(svg.includes('</svg>'));
  }
});

test('renderer：無重複 SVG id；每個 clip-path url 皆有對應 clipPath', () => {
  const svg = renderBodygraph(loadFixture('hero'), { theme: 'modern' });
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size, `有重複 id：${ids.filter((v, i) => ids.indexOf(v) !== i)}`);
  const refs = [...svg.matchAll(/clip-path="url\(#([^)]+)\)"/g)].map((m) => m[1]);
  const idSet = new Set(ids);
  for (const r of refs) assert.ok(idSet.has(r), `clip-path 引用 #${r} 無對應 clipPath`);
});

test('renderer：四態齊現——inactive/personality/design/mixed 各有渲染案例', () => {
  const modern = THEMES_V2.modern;
  // integration fixture 含 personality/design/mixed 通道；未啟動門到處都是
  const svg = renderBodygraph(loadFixture('integration'), { theme: 'modern' });
  assert.ok(svg.includes(`stroke="${modern.channel.personality}"`), 'personality 啟動色缺');
  assert.ok(svg.includes(`stroke="${modern.channel.design}"`), 'design 啟動色缺');
  // mixed 平行雙線＝同時出現 P 與 D 色的 mixedW 細線
  assert.ok(svg.includes(`stroke-width="${modern.skin.active.mixedW}"`), 'mixed 平行雙線缺');
  // 未啟動插座字色
  assert.ok(svg.includes(`fill="${modern.skin.socket.text}"`), 'inactive 插座字色缺');
});

test('renderer：結構計數（hero×modern）——64 數字、67 圓（64+3 mixed）、311 path、5 rect', () => {
  const svg = renderBodygraph(loadFixture('hero'), { theme: 'modern' });
  assert.equal((svg.match(/<text\b/g) || []).length, 64, '閘門數字應 64');
  assert.equal((svg.match(/<circle\b/g) || []).length, 67, '閘門圓應 67（64 + 3 mixed 疊圓）');
  assert.equal((svg.match(/<path\b/g) || []).length, 311, 'path 應 311');
  assert.equal((svg.match(/<rect\b/g) || []).length, 5, 'rect 應 5（底+金框+3 mixed clip）');
});

// ─────────────────────────────────────────────────────────────────────────────
// 3) 同位鐵證：hero × modern === v2t-b-chart.svg（拍板 byte 基準）
//    兩處合理的生產版差異，正規化後 byte-identical（見下說明）。
// ─────────────────────────────────────────────────────────────────────────────
test('同位鐵證：hero×modern 正規化後 byte-identical 於 v2t-b-chart.svg', () => {
  const golden = readFileSync(new URL('hero-modern.golden.svg', FIX), 'utf8');
  const out = renderBodygraph(loadFixture('hero'), { theme: 'modern' });

  // 差異一：生產版 <svg> 加 role/aria（spec §8 無障礙 + 沿用舊 renderer 標籤）；基準 proto 無。
  const ARIA = ' role="img" aria-label="人類圖 bodygraph"';
  assert.ok(out.includes(ARIA), 'aria 應存在');
  const noAria = out.replace(ARIA, '');

  // 差異二：懸掛門繪製序。基準 proto 的 MOCK 手寫序 [7,25,16,36,41,59]；生產版由 64-gate Record
  //   昇序衍生 [7,16,25,36,41,59]，使 L3 中 gate16(16-48 半段) 與 gate25(25-51 半段) 兩 strokePair
  //   相鄰對調。兩者為視覺不相交區域（喉區 vs G 區），像素全同；昇序＝deterministic 生產正解。
  //   正規化＝把此二相鄰 strokePair 換回 MOCK 序後，應與基準 byte-identical。
  const d16 = channelHalfDs2(CHANNEL_PATHS2['16-48'])[0]; // gate16=gateA 半段
  const d25 = channelHalfDs2(CHANNEL_PATHS2['25-51'])[0]; // gate25=gateA 半段
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pairOf = (src, d) => {
    const m = src.match(new RegExp(`<path d="${esc(d)}"[^>]*/><path d="${esc(d)}"[^>]*/>`));
    assert.ok(m, `找不到 d=${d} 的 strokePair`);
    return m[0];
  };
  const p16 = pairOf(noAria, d16), p25 = pairOf(noAria, d25);
  assert.ok(noAria.includes(p16 + p25), '生產版 gate16/25 strokePair 應相鄰（昇序）');
  const normalized = noAria.replace(p16 + p25, p25 + p16);

  assert.equal(normalized, golden, '正規化後應與 v2t-b-chart.svg byte-identical');
  // 未正規化前，除上述二差異外元素多重集完全相同（無內容漂移）
  const toks = (s) => (s.match(/<[^>]+>|[^<]+/g) || []).sort();
  assert.deepEqual(toks(noAria), toks(golden), '元素多重集應完全相同（零內容漂移）');
});

test('同位：三主題產出的 SVG 僅色彩 token 不同、結構長度接近（共用 geometry）', () => {
  const a = renderBodygraph(loadFixture('hero'), { theme: 'classic' });
  const b = renderBodygraph(loadFixture('hero'), { theme: 'modern' });
  const c = renderBodygraph(loadFixture('hero'), { theme: 'dark' });
  const count = (s) => ({ path: (s.match(/<path\b/g) || []).length, circle: (s.match(/<circle\b/g) || []).length, text: (s.match(/<text\b/g) || []).length });
  assert.deepEqual(count(a), count(b), 'classic vs modern 結構計數應相同');
  assert.deepEqual(count(b), count(c), 'modern vs dark 結構計數應相同');
});

// ─────────────────────────────────────────────────────────────────────────────
// 4) 互動層（Phase 5b）：opts.interactive 純附加透明 hit 層
//    正規化＝strip data-hit 元素＋空群組後，與非互動輸出 byte-identical（視覺零漂移的等價證明）。
//    ＝任務要求「同位鐵證正規化規則擴充『strip data-* 與 hit circle』後仍須 byte-identical」。
// ─────────────────────────────────────────────────────────────────────────────
test('互動層：interactive 疊加 strip hit 後 byte-identical 於非互動輸出（零視覺漂移）', () => {
  const base = renderBodygraph(loadFixture('hero'), { theme: 'modern' });
  const inter = renderBodygraph(loadFixture('hero'), { theme: 'modern', interactive: true });
  assert.notEqual(inter, base, 'interactive 應有附加 hit 內容');
  // 正規化：剝掉所有 data-hit 元素（透明 hit 層）＋隨之空掉的 hit 群組
  const stripped = inter
    .replace(/<(?:circle|path)\b[^>]*\bdata-hit="[^"]*"[^>]*\/>/g, '')
    .replace(/<g><\/g>/g, '');
  assert.equal(stripped, base, 'strip data-hit 後應與非互動輸出 byte-identical');
  // 附加物僅止於 data-*／tabindex／role／aria（報告端紅線仍守：無 class/style/polygon/gradient）
  assert.doesNotMatch(inter, /\sclass=/, 'interactive 不得引入 class');
  assert.doesNotMatch(inter, /<polygon\b|<style[\s>]|linearGradient|radialGradient/, 'interactive 不得引入 polygon/style/gradient');
  // hit 目標齊備：64 gate + 36 channel + 9 center
  assert.equal((inter.match(/data-hit="gate"/g) || []).length, 64, 'gate hit 應 64');
  assert.equal((inter.match(/data-hit="chan"/g) || []).length, 36, 'channel hit 應 36');
  assert.equal((inter.match(/data-hit="center"/g) || []).length, 9, 'center hit 應 9');
  // 每顆 gate hit 帶無障礙標籤與 tabindex（鍵盤可聚焦）
  assert.ok(inter.includes('role="button"') && inter.includes('tabindex="0"'), 'gate hit 應可鍵盤聚焦');
  assert.match(inter, /aria-label="閘門 20[^"]*"/, 'gate hit 應有中文 aria-label');
});
