import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (file) => readFileSync(join(root, file), 'utf8');
const header = read('_includes/header.html');
const mainJs = read('assets/js/main.js');
const css = read('assets/css/style.css');

test('手機主選單開關是可聚焦且具控制狀態的按鈕', () => {
  assert.match(header, /<ul id="primary-navigation">/);
  assert.match(header, /<button class="mobile-nav-toggle"[^>]*type="button"/);
  assert.match(header, /aria-label="開啟主選單"/);
  assert.match(header, /aria-controls="primary-navigation"/);
  assert.match(header, /aria-expanded="false"/);
});

test('手機主選單同步開關語意，並支援 Escape 關閉與焦點返回', () => {
  assert.match(mainJs, /setAttribute\('aria-expanded', String\(isOpen\)\)/);
  assert.match(mainJs, /isOpen \? '關閉主選單' : '開啟主選單'/);
  assert.match(mainJs, /event\.key === 'Escape'/);
  assert.match(mainJs, /setMobileNavState\(false, true\)/);
  assert.match(css, /\.mobile-nav-toggle:focus-visible/);
  assert.match(css, /width: 44px;[\s\S]*height: 44px;/);
});
