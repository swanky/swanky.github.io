// article-toc.test.mjs — 文章頁自動「本文目錄」的單元測試。
// 重點：短文不插目錄、長文的錨點與層級正確、頁面已有手寫目錄就整支略過、
//       標題含行內標籤時只取乾淨文字、同名標題各自指向自己的錨點。
// 以極簡 document mock 驗證 DOM 部分（沿用 core-dom.test.mjs 的做法，不引入 jsdom）。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MIN_ITEMS, buildTocItems, tocHtml, init } from '../assets/js/article-toc.js';

const REPO_ROOT = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(REPO_ROOT, path), 'utf8');

// 假標題元素：真實 DOM 的 textContent 已經是攤平後的純文字。
const h = (level, text, id) => ({ tagName: `H${level}`, textContent: text, id });

// 假 .post-content：只提供 querySelector／querySelectorAll 與插入點的 insertAdjacentHTML。
function mockDoc({ headings = [], manualToc = false, hasBody = true } = {}) {
  const inserted = [];
  const anchor = headings[0];
  if (anchor) {
    anchor.insertAdjacentHTML = (position, html) => inserted.push({ position, html });
  }
  const body = {
    querySelector: (sel) => (sel === '.article-toc' && manualToc ? { manual: true } : null),
    querySelectorAll: (sel) => (sel === 'h2' ? headings.filter((x) => x.tagName === 'H2') : []),
  };
  return {
    inserted,
    doc: { querySelector: (sel) => (sel === '.post-content' && hasBody ? body : null) },
  };
}

const sixH2 = [
  h(2, '為什麼要治理', 'why'),
  h(2, '第一層：指令', 'layer-1'),
  h(2, '第二層：技能', 'layer-2'),
  h(2, '第三層：掛鉤', 'layer-3'),
  h(2, '驗證閉環', 'verify'),
  h(2, '結語', 'closing'),
];

test('門檻：標題數未達 6 個就不產生目錄（短文）', () => {
  assert.equal(MIN_ITEMS, 6);
  assert.deepEqual(buildTocItems(sixH2.slice(0, 5)), []);
  assert.equal(tocHtml(buildTocItems(sixH2.slice(0, 5))), '');
  assert.equal(buildTocItems([]).length, 0);
  assert.equal(buildTocItems(sixH2).length, 6); // 剛好達門檻就要有
});

test('達門檻：層級與錨點都正確，輸出繁體中文標題與無障礙標籤', () => {
  const mixed = [...sixH2, h(3, '小節一', 'sub-1'), h(4, '不收的層級', 'deep')];
  const items = buildTocItems(mixed);

  assert.deepEqual(items.map((x) => x.level), [2, 2, 2, 2, 2, 2, 3]);
  assert.deepEqual(items.map((x) => x.id).slice(0, 2), ['why', 'layer-1']);
  assert.equal(items.at(-1).text, '小節一');

  const html = tocHtml(items);
  assert.match(html, /^<nav class="article-toc" aria-label="本文目錄">/);
  assert.match(html, /<span class="article-toc-label">本文目錄<\/span>/);
  assert.match(html, /<li><a href="#why">為什麼要治理<\/a><\/li>/);
  assert.match(html, /<li><a href="#sub-1">小節一<\/a><\/li>/);
  // 可見文案不得出現英文縮寫或工程術語（class 名不算可見文案）
  const visible = html.replace(/<[^>]+>/g, '');
  assert.doesNotMatch(visible, /TOC|目次|Table of Contents|anchor|heading/i);
  assert.equal(visible.startsWith('本文目錄'), true);
  assert.equal((html.match(/<li>/g) ?? []).length, 7);

  // 只收 h2 時 h3／h4 都不進清單
  assert.equal(buildTocItems(mixed, { levels: [2] }).length, 6);
});

test('標題含行內標籤時取到乾淨文字，並跳過沒有錨點或沒有文字的標題', () => {
  const items = buildTocItems([
    // 真實 DOM 的 textContent：<code>npm test</code> 只留文字
    h(2, '\n  用 npm test 驗證  \n', 'verify'),
    h(2, '含 & < > 的標題', 'escaped'),
    h(2, '沒有錨點的標題', ''),
    h(2, '   ', 'blank'),
    h(2, '第三段', 'three'),
    h(2, '第四段', 'four'),
    h(2, '第五段', 'five'),
    h(2, '第六段', 'six'),
    h(2, '第七段', 'seven'),
  ]);

  assert.equal(items.length, 7); // 無 id 與空白標題各被剔除一個
  assert.equal(items[0].text, '用 npm test 驗證');
  assert.equal(items.map((x) => x.id).includes('blank'), false);
  assert.match(tocHtml(items), /<a href="#escaped">含 &amp; &lt; &gt; 的標題<\/a>/);
});

test('重複標題文字時，各自的錨點仍然正確（kramdown 會給第二個 -1 尾碼）', () => {
  const items = buildTocItems([
    h(2, '常見問題', 'faq'),
    h(2, '常見問題', 'faq-1'),
    ...sixH2.slice(0, 4),
  ]);
  const dupes = items.filter((x) => x.text === '常見問題');

  assert.equal(dupes.length, 2);
  assert.deepEqual(dupes.map((x) => x.id), ['faq', 'faq-1']);
  const html = tocHtml(items);
  assert.match(html, /<a href="#faq">常見問題<\/a>/);
  assert.match(html, /<a href="#faq-1">常見問題<\/a>/);
});

test('掛載：達門檻時插在第一個段落標題之前', () => {
  const { doc, inserted } = mockDoc({ headings: sixH2.map((x) => ({ ...x })) });

  assert.equal(init(doc), true);
  assert.equal(inserted.length, 1);
  assert.equal(inserted[0].position, 'beforebegin');
  assert.match(inserted[0].html, /class="article-toc"/);
});

test('掛載：頁面已有手寫目錄時整支略過，短文與無正文容器也不動作', () => {
  const manual = mockDoc({ headings: sixH2.map((x) => ({ ...x })), manualToc: true });
  assert.equal(init(manual.doc), false);
  assert.equal(manual.inserted.length, 0);

  const short = mockDoc({ headings: sixH2.slice(0, 3).map((x) => ({ ...x })) });
  assert.equal(init(short.doc), false);
  assert.equal(short.inserted.length, 0);

  const noBody = mockDoc({ hasBody: true, headings: [] });
  assert.equal(init(noBody.doc), false);
  assert.equal(init(mockDoc({ hasBody: false }).doc), false);
  assert.equal(init(null), false);
});

test('文章 layout 掛載自動目錄，且沿用既有扁平目錄樣式（不新增樣式系統）', () => {
  const layout = read('_layouts/article.html');
  const css = read('assets/css/style.css');

  assert.match(layout, /assets\/js\/article-toc\.js' \| relative_url/);
  assert.match(layout, /<script type="module"/);
  assert.match(css, /\.article-toc \{/);
  assert.match(css, /\.article-toc a \{/);
  assert.match(css, /\.post-content h2,\s*\.post-content h3 \{\s*scroll-margin-top: 84px;/);
});

test('7 篇手寫大綱的文章維持原樣（自動版會讓路）', () => {
  const manualPosts = [
    '_posts/2026-03-22-gstack-workflow-guide.md',
    '_posts/2026-08-08-matt-pocock-skills-ai-coding-workflow.md',
    '_posts/2026-08-20-uncle-bob-ai-software-fundamentals.md',
    '_posts/2026-08-24-ai-agent-surgical-team.md',
    '_posts/2026-08-25-hermes-bot-mode-persistent-ai-team.md',
    '_posts/2026-08-26-scaffolding-thin-harness-agent-architecture.md',
    '_posts/2026-08-28-ai-video-production-rehearsal-seedance-workflow.md',
  ];
  for (const file of manualPosts) {
    assert.match(read(file), /<nav class="article-toc article-toc--outline"/, `${file} 手寫大綱不見了`);
  }
});
