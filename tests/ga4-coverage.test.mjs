// GA4 覆蓋率回歸測試（2026-11-24）。
// 比對的是 gtag.js 的 <script> 標籤本身，不是只找評估 ID 字串——ID 出現在註解或 onclick 裡不算有載入。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  ROOT, hasSite, NO_SITE_REASON, read, trackedFiles, frontMatter, frontMatterValue, sitePages, redirectTarget,
} from './_site-audit.mjs';

const GTAG_SCRIPT = /<script\s+async\s+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=(G-[A-Z0-9]+)"\s*><\/script>/;

// 已知不載入 GA4 的建置產物頁，必須逐頁寫死；新增例外前先確認那一頁真的不需要流量統計。
const BUILT_PAGES_WITHOUT_GA4 = [
  // 第三方圖示字型的示範頁（assets/vendor 不手動修改）
  'assets/vendor/bootstrap-icons/index.html',
];

// /nft/ 是沒有 front matter 的獨立靜態子站，用不了 include：7 個正式頁直接貼上展開後的 GA4 片段。
const NFT_PAGES = [
  'nft/index.html',
  'nft/collection/index.html',
  'nft/oursong/index.html',
  'nft/uniform-clonex/index.html',
  'nft/uniform-clonex/bunny-awakens/index.html',
  'nft/uniform-clonex/lore/index.html',
  'nft/uniform-clonex/reroll/index.html',
];

// 買來的版型附的範本殘留頁：_config.yml 已排除於建置之外，不補 GA4。
const NFT_TEMPLATE_LEFTOVERS = [
  'nft/assets/categories.html',
  'nft/assets/main.html',
  'nft/assets/fonts/flaticon/font/flaticon.html',
  'nft/assets/fonts/icomoon/demo.html',
];

// 自己就是完整 HTML 文件（不套版型）卻不載入 GA4 的來源檔。
const STANDALONE_SOURCES_WITHOUT_GA4 = [
  ...NFT_TEMPLATE_LEFTOVERS.map((leftover) => ({ test: (path) => path === leftover })),
  /^assets\/vendor\//,
  /^assets\/diagrams\//, // site-diagram 工作檔，_config.yml 已排除於建置之外
];

/** 把靜態 include 展開（遞迴），讓版型經過幾層 include 才載入 gtag 也查得到。 */
function expandIncludes(text, depth = 0) {
  if (depth > 6) return text;
  return text.replace(/\{%-?\s*include\s+([\w./-]+)[^%]*%\}/g, (whole, name) => {
    const file = join(ROOT, '_includes', name);
    return existsSync(file) ? expandIncludes(read(`_includes/${name}`), depth + 1) : whole;
  });
}

function loadsGtagDirectly(text) {
  return GTAG_SCRIPT.test(expandIncludes(text));
}

function layoutLoadsGtag(name, seen = new Set()) {
  if (!name || seen.has(name)) return false;
  seen.add(name);
  const path = `_layouts/${name}.html`;
  if (!existsSync(join(ROOT, path))) return false;
  const text = read(path);
  if (loadsGtagDirectly(text)) return true;
  const fm = frontMatter(text);
  return fm ? layoutLoadsGtag(frontMatterValue(fm, 'layout'), seen) : false;
}

test('gtag.html 以 <script> 標籤載入 gtag.js，且 config 用同一個評估 ID', () => {
  const source = read('_includes/gtag.html');
  const tag = source.match(GTAG_SCRIPT);
  assert.ok(tag, '_includes/gtag.html 沒有 gtag.js 的 script 標籤');
  assert.ok(source.includes(`gtag('config', '${tag[1]}')`), 'config 的評估 ID 與 script 標籤不一致');
});

test('每個版型都（直接或經上層版型）引入 gtag.html', () => {
  const layouts = readdirSync(join(ROOT, '_layouts')).filter((name) => name.endsWith('.html')).map((name) => name.slice(0, -5));
  assert.ok(layouts.length >= 15, `版型數量異常：${layouts.length}`);
  const missing = layouts.filter((name) => !layoutLoadsGtag(name));
  assert.deepEqual(missing, [], `這些版型沒有載入 GA4：${missing.join(', ')}`);
});

test('書頁、金瓶梅、一般頁 head 與 /games/plum/ 的 GA4 入口都在', () => {
  for (const include of ['_includes/head.html', '_includes/book/head.html', '_includes/jinpingmei/gtag.html']) {
    assert.ok(loadsGtagDirectly(read(include)), `${include} 沒有引入 gtag.html`);
  }
  for (const layout of [
    'default', 'book-chapter', 'book-home', 'book-index', 'book-characters',
    'jinpingmei-chapter', 'jinpingmei-character', 'jinpingmei-short', 'photobook-literary',
  ]) {
    assert.ok(layoutLoadsGtag(layout), `版型 ${layout} 沒有載入 GA4`);
  }
  assert.ok(loadsGtagDirectly(read('games/plum/index.html')), 'games/plum/index.html 沒有引入 gtag.html');
});

test('不套版型的完整 HTML 頁自己要引入 gtag.html（例外寫死）', () => {
  const missing = [];
  for (const path of trackedFiles()) {
    if (!path.endsWith('.html') || /^(_layouts|_includes|_site|docs|tests|tools|\.)/.test(path)) continue;
    if (STANDALONE_SOURCES_WITHOUT_GA4.some((re) => re.test(path))) continue;
    const text = read(path);
    if (!/<html[\s>]/i.test(text)) continue;
    if (/<meta\s+http-equiv=["']refresh["']/i.test(text)) continue; // 手寫轉址頁：訪客不會停留
    const fm = frontMatter(text);
    if (fm === null) { // 沒有 front matter：Jekyll 不處理 include，頁面必須自己帶著展開後的 script 標籤
      if (!GTAG_SCRIPT.test(text)) missing.push(`${path}（沒有 front matter，要直接貼上 GA4 片段）`);
      continue;
    }
    const layout = frontMatterValue(fm, 'layout');
    const hasLayout = layout && !['null', 'none', '~', ''].includes(layout);
    if (hasLayout ? !layoutLoadsGtag(layout) && !loadsGtagDirectly(text) : !loadsGtagDirectly(text)) missing.push(path);
  }
  assert.deepEqual(missing, [], `這些獨立頁沒有載入 GA4：\n${missing.join('\n')}`);
});

test('/nft/ 七個正式頁的 GA4 片段與 gtag.html 展開後逐字相同', () => {
  // 每行去掉縮排後比對：子站用 tab 縮排，片段內容本身不能有任何出入。
  const lines = (text) => text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join('\n');
  const expected = lines(expandIncludes(read('_includes/gtag.html')));
  assert.match(expected, GTAG_SCRIPT);
  assert.doesNotMatch(expected, /\{%|\{\{/, 'gtag.html 展開後不該殘留 Liquid 語法（子站頁面不經 Jekyll 處理）');
  for (const path of NFT_PAGES) {
    const page = lines(read(path));
    assert.ok(page.includes(expected), `${path} 的 GA4 片段與 _includes/gtag.html 不一致，請重新貼上展開後的內容`);
    assert.equal(page.split('googletagmanager.com/gtag/js').length - 1, 1, `${path} 的 gtag.js 只能載入一次`);
  }
});

test('/nft/assets/ 的範本殘留頁不進建置，站內也沒有連結指向它們', () => {
  const config = read('_config.yml');
  for (const path of NFT_TEMPLATE_LEFTOVERS) {
    assert.ok(config.includes(`  - "${path}"`), `_config.yml 的 exclude 少了 ${path}`);
    assert.ok(!GTAG_SCRIPT.test(read(path)), `${path} 是範本殘留頁，不補 GA4`);
  }
  const linkers = trackedFiles()
    .filter((path) => /\.(html|md|yml|json|xml|txt)$/.test(path) && !/^(docs|tests|tools|assets\/vendor|\.)/.test(path) && !NFT_TEMPLATE_LEFTOVERS.includes(path))
    .filter((path) => { let text; try { text = read(path); } catch { return false; } return /nft\/assets\/(categories|main)\.html|flaticon\.html|icomoon\/demo\.html/.test(text) && path !== '_config.yml'; });
  assert.deepEqual(linkers, [], `這些檔案還連到範本殘留頁：${linkers.join(', ')}`);
});

test('建置產物：除了寫死的例外，每一頁都有 gtag.js 的 script 標籤', { skip: hasSite ? false : NO_SITE_REASON }, () => {
  const exceptions = new Set(BUILT_PAGES_WITHOUT_GA4);
  const pages = sitePages().filter((page) => redirectTarget(page.html) === null);
  assert.ok(pages.length > 900, `_site 頁數異常：${pages.length}`);
  const missing = pages.filter((page) => !GTAG_SCRIPT.test(page.html)).map((page) => page.path);
  const unexpected = missing.filter((path) => !exceptions.has(path));
  assert.deepEqual(unexpected, [], `缺 GA4 的頁面：\n${unexpected.join('\n')}`);
  // 例外清單不能過期：已經補上 GA4 或已不存在的頁要從清單拿掉。
  const stale = BUILT_PAGES_WITHOUT_GA4.filter((path) => !missing.includes(path));
  assert.deepEqual(stale, [], `例外清單過期（該頁已有 GA4 或已不在建置產物）：\n${stale.join('\n')}`);
});

test('建置產物：書頁與 /games/plum/ 逐頁都有 GA4', { skip: hasSite ? false : NO_SITE_REASON }, () => {
  const pages = sitePages();
  const books = pages.filter((page) => /^(jinpingmei|honglou|sanguo|shuihu|xiyou)\//.test(page.path) && redirectTarget(page.html) === null);
  assert.ok(books.length >= 600, `書頁數量異常：${books.length}`);
  const missing = books.filter((page) => !GTAG_SCRIPT.test(page.html)).map((page) => page.path);
  assert.deepEqual(missing, []);
  const plum = pages.find((page) => page.path === 'games/plum/index.html');
  assert.ok(plum && GTAG_SCRIPT.test(plum.html), '/games/plum/ 沒有 GA4');
});
