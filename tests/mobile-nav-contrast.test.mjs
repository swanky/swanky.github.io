/**
 * 手機主選單「看得見」的回歸測試。
 *
 * 為何值得這支測試：2026-08-13 的 9437421（fix(design): enforce dark text on gold
 * surfaces）把全站 color:#fff 換成 #111，再補一條
 *   #header.header-transparent .navbar > ul > li > a { color: #fff }
 * 把深色 hero 上的導覽白字救回來。那條選擇器含 #header（id），特異性壓過
 * .navbar-mobile a { color: #343a40 }，而手機選單面板是白底——九個一級項目全成白底
 * 白字，選單看起來一片空白，壞了約三週才被站主在手機上發現。
 *
 * 同一批的 39423f5 在同一個元件上加了 tests/mobile-nav-accessibility.test.mjs，但只
 * 斷言 aria／DOM 字串，抓不到這種 cascade 問題。所以這裡不比對色碼字串（那只能防有人
 * 刪掉修正），而是真的算一次 CSS cascade（!important ＞ 特異性 ＞ 文件順序），再用
 * WCAG 對比度斷言——任何未來「全站換色、順手補一條 id 覆蓋」的動作都會在這裡紅燈。
 *
 * 前提：全站只有 style.css 設 navbar 連結顏色。最後一個 test 守住這個前提。
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const cssDir = join(root, 'assets/css');
const styleCss = readFileSync(join(cssDir, 'style.css'), 'utf8');

const VIEWPORT = 390; // iPhone 級寬度：手機選單唯一會出現的情境
const MIN_CONTRAST = 4.5; // WCAG AA 一般文字

/* ---------- 極簡 CSS 解析：只求足以重現 cascade，不是通用引擎 ---------- */

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

// @media 只評估 min/max-width 對 VIEWPORT；print 與 prefers-* 等非本情境者整塊排除
function mediaApplies(prelude, width) {
  const query = prelude.replace(/^@media/i, '').trim();
  if (/print|prefers-|hover\s*:/i.test(query)) return false;
  for (const m of query.matchAll(/\(\s*(max|min)-width\s*:\s*([\d.]+)px\s*\)/gi)) {
    const bound = parseFloat(m[2]);
    if (m[1].toLowerCase() === 'max' && width > bound) return false;
    if (m[1].toLowerCase() === 'min' && width < bound) return false;
  }
  return true;
}

function parseDecls(body) {
  const decls = {};
  for (const chunk of body.split(';')) {
    const colon = chunk.indexOf(':');
    if (colon === -1) continue;
    const prop = chunk.slice(0, colon).trim().toLowerCase();
    let value = chunk.slice(colon + 1).trim();
    if (!prop || !value) continue;
    const important = /!important$/i.test(value);
    if (important) value = value.replace(/!important$/i, '').trim();
    decls[prop] = { value, important };
  }
  return decls;
}

function collectRules(css, width) {
  const rules = [];
  let order = 0;
  const walk = (text) => {
    let i = 0;
    while (i < text.length) {
      const open = text.indexOf('{', i);
      if (open === -1) break;
      const prelude = text.slice(i, open).trim();
      let depth = 1;
      let j = open + 1;
      while (j < text.length && depth > 0) {
        if (text[j] === '{') depth++;
        else if (text[j] === '}') depth--;
        j++;
      }
      const body = text.slice(open + 1, j - 1);
      if (prelude.startsWith('@')) {
        // @media 遞迴進去；@keyframes／@font-face／@supports 等整塊跳過
        if (/^@media/i.test(prelude) && mediaApplies(prelude, width)) walk(body);
      } else {
        for (const raw of prelude.split(',')) {
          const selector = raw.trim();
          if (selector) rules.push({ selector, decls: parseDecls(body), order: order++ });
        }
      }
      i = j;
    }
  };
  walk(stripComments(css));
  return rules;
}

// compound：只認 tag／#id／.class。其餘（pseudo、屬性、*）回 null，整條選擇器作廢
function parseCompound(token) {
  if (!token || !/^(?:[a-zA-Z][\w-]*)?(?:[#.][\w-]+)*$/.test(token)) return null;
  const tag = token.match(/^[a-zA-Z][\w-]*/);
  const ids = [];
  const classes = [];
  for (const m of token.matchAll(/([#.])([\w-]+)/g)) {
    (m[1] === '#' ? ids : classes).push(m[2]);
  }
  if (ids.length > 1) return null;
  return { tag: tag ? tag[0].toLowerCase() : null, id: ids[0] ?? null, classes };
}

// 回傳 [{compound, comb}]，comb 是連到「左邊」那段的關係；不支援者回 null
function parseSelector(selector) {
  if (/[:[\]*]/.test(selector)) return null; // 靜止態不算 :hover／:focus-visible
  const tokens = selector.replace(/\s*([>+~])\s*/g, ' $1 ').trim().split(/\s+/);
  const segs = [];
  let pending = null;
  for (const token of tokens) {
    if (token === '>' || token === '+' || token === '~') {
      if (token !== '>') return null; // 兄弟選擇器未建模
      pending = '>';
      continue;
    }
    const compound = parseCompound(token);
    if (!compound) return null;
    segs.push({ compound, comb: segs.length === 0 ? null : (pending ?? ' ') });
    pending = null;
  }
  return segs.length ? segs : null;
}

const compoundMatches = (c, el) =>
  (!c.tag || c.tag === el.tag) &&
  (!c.id || c.id === el.id) &&
  c.classes.every((cls) => el.classes.includes(cls));

function matchChain(segs, chain, si = segs.length - 1, ci = chain.length - 1) {
  if (ci < 0) return false;
  if (!compoundMatches(segs[si].compound, chain[ci])) return false;
  if (si === 0) return true;
  if (segs[si].comb === '>') return matchChain(segs, chain, si - 1, ci - 1);
  for (let k = ci - 1; k >= 0; k--) if (matchChain(segs, chain, si - 1, k)) return true;
  return false;
}

function specificity(segs) {
  let ids = 0;
  let classes = 0;
  let tags = 0;
  for (const s of segs) {
    if (s.compound.id) ids++;
    classes += s.compound.classes.length;
    if (s.compound.tag) tags++;
  }
  return [ids, classes, tags];
}

const rank = (hit) => [hit.important ? 1 : 0, ...hit.spec, hit.order];
const beats = (a, b) => {
  const ra = rank(a);
  const rb = rank(b);
  for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return ra[i] > rb[i];
  return false;
};

/** 算出 chain 上 props 之一的 cascade 勝者。完全沒命中＝解析器壞了，直接 throw。 */
function resolve(rules, chain, props) {
  const hits = [];
  for (const rule of rules) {
    const segs = parseSelector(rule.selector);
    if (!segs || !matchChain(segs, chain)) continue;
    for (const prop of props) {
      const decl = rule.decls[prop];
      if (decl) {
        hits.push({ ...decl, prop, selector: rule.selector, order: rule.order, spec: specificity(segs) });
      }
    }
  }
  if (!hits.length) {
    throw new Error(`沒有任何 CSS 規則命中 ${props.join('／')}——這代表解析器壞了，不是樣式沒問題`);
  }
  return hits.reduce((best, hit) => (beats(hit, best) ? hit : best));
}

/* ---------- 顏色與對比 ---------- */

const rootVars = Object.fromEntries(
  collectRules(styleCss, VIEWPORT)
    .filter((r) => r.selector === ':root')
    .flatMap((r) => Object.entries(r.decls)
      .filter(([prop]) => prop.startsWith('--'))
      .map(([prop, decl]) => [prop, decl.value])),
);

function toRgb(value) {
  const v = String(value).trim();
  const varRef = v.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)$/);
  if (varRef) {
    const resolved = rootVars[varRef[1]] ?? varRef[2];
    if (!resolved) throw new Error(`無法解析 CSS 變數 ${varRef[1]}`);
    return toRgb(resolved);
  }
  let m = v.match(/^#([0-9a-f]{3})$/i);
  if (m) return [...m[1]].map((ch) => parseInt(ch + ch, 16));
  m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  m = v.match(/^rgba?\(([^)]+)\)$/i);
  if (m) return m[1].split(/[,/]/).slice(0, 3).map((x) => parseFloat(x));
  if (v.toLowerCase() === 'white') return [255, 255, 255];
  if (v.toLowerCase() === 'black') return [0, 0, 0];
  throw new Error(`無法解析顏色值：${value}`);
}

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/* ---------- 被測元素鏈（對應 _includes/header.html 展開後的 DOM） ---------- */

const el = (tag, id, ...classes) => ({ tag, id, classes });

// header 三種狀態：無（一般頁未捲動）、header-transparent（深色 hero）、header-scrolled（捲動後）
const HEADER_STATES = [null, 'header-transparent', 'header-scrolled'];

function panelChain(headerState) {
  const headerClasses = ['fixed-top', 'd-flex', 'align-items-center'];
  if (headerState) headerClasses.push(headerState);
  return [
    el('header', 'header', ...headerClasses),
    el('div', null, 'container', 'd-flex', 'justify-content-between', 'align-items-center'),
    el('nav', 'navbar', 'navbar', 'navbar-mobile'), // navbar-mobile ＝ 選單已展開
    el('ul', 'primary-navigation'),
    el('li', null, 'dropdown'),
  ];
}

const topLinkChain = (state) => [...panelChain(state), el('a', null)];
const subLinkChain = (state) => [...panelChain(state), el('ul', null), el('li', null), el('a', null)];

const BG_PROPS = ['background-color', 'background'];
const describe = (hit) => `${hit.prop}: ${hit.value}（來自 ${hit.selector}）`;

/* ---------- 測試 ---------- */

test('手機選單展開後，一級項目文字對面板底色有足夠對比（三種 header 狀態）', () => {
  const rules = collectRules(styleCss, VIEWPORT);
  for (const state of HEADER_STATES) {
    const label = state ?? '（無 header 狀態）';
    const fg = resolve(rules, topLinkChain(state), ['color']);
    const bg = resolve(rules, panelChain(state).slice(0, -1), BG_PROPS); // 面板＝ul
    const ratio = contrast(toRgb(fg.value), toRgb(bg.value));
    assert.ok(
      ratio >= MIN_CONTRAST,
      `${label}：一級選單項目對比只有 ${ratio.toFixed(2)}:1（需 ≥ ${MIN_CONTRAST}）。`
        + `文字 ${describe(fg)}；底色 ${describe(bg)}`,
    );
  }
});

test('手機選單展開後，子選單項目文字對子面板底色有足夠對比', () => {
  const rules = collectRules(styleCss, VIEWPORT);
  for (const state of HEADER_STATES) {
    const label = state ?? '（無 header 狀態）';
    const fg = resolve(rules, subLinkChain(state), ['color']);
    const bg = resolve(rules, subLinkChain(state).slice(0, -2), BG_PROPS);
    const ratio = contrast(toRgb(fg.value), toRgb(bg.value));
    assert.ok(
      ratio >= MIN_CONTRAST,
      `${label}：子選單項目對比只有 ${ratio.toFixed(2)}:1（需 ≥ ${MIN_CONTRAST}）。`
        + `文字 ${describe(fg)}；底色 ${describe(bg)}`,
    );
  }
});

/**
 * 靈敏度檢查（不是重複測試）：把修正那條覆蓋從 CSS 拿掉後，上面第一個 test 必須真的紅燈。
 * 這條在的意義是證明解析器確實看見了 #header 那條 id 規則——否則「沒命中→undefined→
 * 碰巧通過」的空洞測試看起來也是綠的。
 */
test('靈敏度：移除 .navbar-mobile 覆蓋後，深色 header 狀態下應解析回白底白字', () => {
  const weakened = collectRules(styleCss, VIEWPORT)
    .filter((r) => !r.selector.includes('.navbar-mobile > ul > li > a'));
  for (const state of ['header-transparent', 'header-scrolled']) {
    const fg = resolve(weakened, topLinkChain(state), ['color']);
    assert.deepEqual(
      toRgb(fg.value), [255, 255, 255],
      `${state}：拿掉覆蓋後應該解析出 #fff（實得 ${describe(fg)}）——若不是，解析器沒看見 #header 的 id 規則`,
    );
    const bg = resolve(weakened, panelChain(state).slice(0, -1), BG_PROPS);
    const ratio = contrast(toRgb(fg.value), toRgb(bg.value));
    assert.ok(ratio < 1.5, `${state}：這裡應該重現當年的白底白字（實得 ${ratio.toFixed(2)}:1）`);
  }
});

// 上面只算 style.css。這條守住那個前提：別的 CSS 檔不准偷偷設 navbar 連結顏色
test('navbar 連結顏色只在 style.css 定義', () => {
  const others = readdirSync(cssDir).filter((f) => f.endsWith('.css') && f !== 'style.css');
  const offenders = [];
  for (const file of others) {
    const css = stripComments(readFileSync(join(cssDir, file), 'utf8'));
    for (const m of css.matchAll(/([^{}]*\.navbar[^{}]*)\{([^}]*)\}/g)) {
      if (/(^|;|\s)color\s*:/.test(m[2])) offenders.push(`${file} → ${m[1].trim().replace(/\s+/g, ' ')}`);
    }
  }
  assert.deepEqual(offenders, [], `這些檔案在 style.css 之外設了 navbar 連結顏色，會繞過本測試：\n${offenders.join('\n')}`);
});
