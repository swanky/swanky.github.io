// composite-render.test.mjs — 合盤渲染器（hd-bodygraph-compose.js）結構測試。
// 驗：XML 良構、報告安全紅線（no polygon/style=/class=/gradient）、無 id 汙染、
// fixtures 逐案視覺語意斷言（A 實線/B 虛線、both 半圓、接合圓、插座）、interactive hit 層 opt-in、
// 三主題全過。視覺快照（byte-identical）待 B2 站主拍板 variant 後固化（比照單人 24 快照法）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { makeChart, assertWellFormedXml } from './_composite-helpers.mjs';
import { computeComposite } from '../../assets/js/human-design/hd-composite.js';
import { renderCompositeBodygraph, assertComposeReportSafe } from '../../assets/js/human-design/hd-bodygraph-compose.js';
import { THEMES_V2 } from '../../assets/js/human-design/hd-theme.js';

const FIX = JSON.parse(readFileSync(new URL('./fixtures/composite/cases.json', import.meta.url), 'utf8')).cases;
const byId = (id) => FIX.find(f => f.id === id);
const render = (fix, opts = {}) => renderCompositeBodygraph(computeComposite(makeChart(fix.a), makeChart(fix.b)), opts);

test('三主題 × 8 fixtures：XML 良構＋紅線全過＋無 id 屬性', () => {
  for (const themeId of Object.keys(THEMES_V2)) {
    for (const fix of FIX) {
      const svg = render(fix, { theme: themeId });
      assertWellFormedXml(svg);
      assertComposeReportSafe(svg);
      assert.ok(!/\bid=/.test(svg), `${themeId}/${fix.id} 不應輸出 id 屬性`);
      assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'));
    }
  }
});

test('compose tokens：三主題皆有 a/b/categories 完整鍵', () => {
  for (const [id, t] of Object.entries(THEMES_V2)) {
    assert.ok(t.compose?.a?.color && t.compose?.b?.color, `${id} 缺 compose a/b`);
    for (const k of ['electromagnetic', 'companionship', 'dominance', 'compromise']) {
      assert.ok(t.compose.categories[k], `${id} 缺 categories.${k}`);
    }
  }
});

test('empty：無啟動彩線（無 A/B 色 stroke）、中心全走 undef 樣式', () => {
  const svg = render(byId('empty'));
  const ct = THEMES_V2.modern.compose;
  assert.ok(!svg.includes(`stroke="${ct.a.color}"`), '不應有 A 色線');
  assert.ok(!svg.includes(`stroke="${ct.b.color}"`), '不應有 B 色線');
  assert.ok(!svg.includes(`fill="${THEMES_V2.modern.centerDefined.g}"`), '不應有 defined 中心');
});

test('dom-a／dom-b：完整方全長線；A 實線、B 虛線雙編碼', () => {
  const ct = THEMES_V2.modern.compose;
  const svgA = render(byId('dom-a'));
  assert.ok(svgA.includes(`stroke="${ct.a.color}"`), 'dom-a 應有 A 色線');
  const aLine = svgA.split('\n').join('').match(new RegExp(`<path[^>]*stroke="${ct.a.color}"[^>]*/>`));
  assert.ok(aLine && !aLine[0].includes('stroke-dasharray'), 'A 線應為實線');
  const svgB = render(byId('dom-b'));
  const bLine = svgB.match(new RegExp(`<path[^>]*stroke="${ct.b.color}"[^>]*stroke-dasharray="${ct.bDash}"[^>]*/>`));
  assert.ok(bLine, 'dom-b 應有 B 色虛線');
});

test('em-one：兩半段各上色＋中點接合圓', () => {
  const ct = THEMES_V2.modern.compose;
  const svg = render(byId('em-one'));
  assert.ok(svg.includes(`stroke="${ct.a.color}"`) && svg.includes(`stroke="${ct.b.color}"`), '電磁應同時有 A/B 色半段');
  assert.ok(new RegExp(`<circle[^>]*r="${ct.jointR}"`).test(svg), '應有接合圓');
});

test('cp-one：A 實線底＋B 虛線疊（同一路徑兩次描繪）', () => {
  const ct = THEMES_V2.modern.compose;
  const svg = render(byId('cp-one'));
  const aCount = (svg.match(new RegExp(`stroke="${ct.a.color}"`, 'g')) || []).length;
  const bCount = (svg.match(new RegExp(`stroke="${ct.b.color}"`, 'g')) || []).length;
  assert.ok(aCount >= 1 && bCount >= 1, '同伴應 A、B 各至少一筆線');
  assert.ok(svg.includes(`stroke-dasharray="${ct.bDash}"`), 'B 疊線應為虛線');
});

test('cx-one：對方持有端＝both 左右半圓（兩個半圓 path＋白環）', () => {
  const ct = THEMES_V2.modern.compose;
  const svg = render(byId('cx-one'));
  assert.ok(svg.includes(`fill="${ct.a.color}"/>`) && svg.includes(`fill="${ct.b.color}"/>`), '應有 A/B 半圓');
  assert.ok(/A15,15 0 0 0 /.test(svg) && /A15,15 0 0 1 /.test(svg), '應有左右兩個半圓弧');
});

test('all-centers：9 中心全部 defined 上色', () => {
  const svg = render(byId('all-centers'));
  const t = THEMES_V2.modern;
  for (const [c, color] of Object.entries(t.centerDefined)) {
    assert.ok(svg.includes(`fill="${color}"`), `中心 ${c} 應上 defined 色 ${color}`);
  }
});

test('interactive：hit 層 opt-in（預設無 data-hit；開啟後有 channel/gate hit＋tabindex）', () => {
  const off = render(byId('mixed-four'));
  assert.ok(!off.includes('data-hit'), '預設不應有 hit 層');
  const on = render(byId('mixed-four'), { interactive: true });
  assert.ok(on.includes('data-hit="channel"') && on.includes('data-hit="gate"'), '應有通道/閘門 hit');
  assert.ok(on.includes('tabindex="0"') && on.includes('role="button"'), '應可鍵盤聚焦');
  assertWellFormedXml(on);
  assertComposeReportSafe(on);
});

test('variant b/c（選型輪）：輸出仍過紅線與 XML；c 有類別徽記', () => {
  for (const v of ['b', 'c']) {
    const svg = render(byId('mixed-four'), { variant: v });
    assertWellFormedXml(svg);
    assertComposeReportSafe(svg);
  }
  const ct = THEMES_V2.modern.compose;
  const svgC = render(byId('mixed-four'), { variant: 'c' });
  assert.ok(svgC.includes(`fill="${ct.categories.dominance}"`), 'variant c 應有主導徽記色');
});

test('background=false：無頁底／卡面／金框', () => {
  const svg = render(byId('empty'), { background: false });
  assert.ok(!svg.includes(THEMES_V2.modern.skin.goldFrame.color), '不應有金框');
});

test('壞輸入：非 composite 物件應 throw', () => {
  assert.throws(() => renderCompositeBodygraph({}), /computeComposite/);
  assert.throws(() => renderCompositeBodygraph(null), /computeComposite/);
});
