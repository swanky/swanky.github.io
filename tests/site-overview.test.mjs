import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');

const header = read('_includes/header.html');
const head = read('_includes/head.html');
const mainJs = read('assets/js/main.js');
const css = read('assets/css/site-overview.css');

test('navbar 原樣保留，總覽面板是補充不是替代', () => {
  assert.match(header, /class="dropdown"/, '原本的下拉導覽必須保留');
  assert.match(header, /mobile-nav-toggle/, '行動版漢堡選單必須保留');
  assert.match(header, /popovertarget="site-overview"/);
  assert.match(header, /id="site-overview"[^>]*popover/);
});

test('總覽面板分組沿用 navbar 分類且資料驅動', () => {
  for (const group of ['攝影寫真', '技術顧問', '教育訓練', '自我探索', '古典文學']) {
    assert.ok(header.includes(`>${group}</a></h3>`), `缺少分組 ${group}`);
  }
  assert.match(header, /{% for t in nav_tools %}/, '自我探索工具需由資料檔生成');
  assert.match(header, /{% for b in site\.data\.books %}/, '書單需由資料檔生成');
});

test('總覽面板具備舊瀏覽器退路與可及性狀態', () => {
  assert.match(mainJs, /'showPopover' in HTMLElement\.prototype/);
  assert.match(mainJs, /site-overview-open/);
  assert.match(mainJs, /event\.key === 'Escape'/);
  assert.match(header, /popovertarget="site-overview" aria-expanded="false"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test('總覽樣式表有掛進 head', () => {
  assert.match(head, /assets\/css\/site-overview\.css/);
});
