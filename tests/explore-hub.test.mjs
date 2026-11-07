import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const read = (relativePath) => readFileSync(join(ROOT, relativePath), 'utf8');

// 2026-11-07 站主規則：不列「規劃中」佔位項目——上線了才出現在實驗室首頁與奇門頁。
test('explore hub filters out coming-soon cards', () => {
  assert.match(read('_includes/explore-category.html'), /where_exp: 'c', "c\.status != 'coming-soon'"/);
});

test('explore and qimen pages carry no roadmap or placeholder promises', () => {
  for (const file of ['explore/index.html', 'qimen/index.html', 'qimen/tool/index.html']) {
    const html = read(file);
    assert.doesNotMatch(html, /規劃中|敲碗|開發中|explore-roadmap/, `${file} 不應出現規劃中／開發中的承諾`);
  }
});

test('explore feature links to the human design composite', () => {
  assert.match(read('explore/index.html'), /href="\{\{ '\/human-design\/relationship\/' \| relative_url \}\}"[^>]*hd_goto_composite',\{source:'explore_feature'\}/);
});
