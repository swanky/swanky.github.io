// indexnow.test.mjs — tools/indexnow.mjs 的「原始檔 → 網址」換算與金鑰檔檢查。
// 換算錯了不會壞站，只會通知到不存在的網址（送出前還有 sitemap 白名單擋），但金鑰檔不對整個機制就失效。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sourceToUrl, KEY } from '../tools/indexnow.mjs';

const REPO_ROOT = fileURLToPath(new URL('../', import.meta.url));
const O = 'https://swanky.github.io';

test('文章：/:categories/:title/', () => {
  assert.equal(sourceToUrl('_posts/2026-07-08-fable-field-guide.md', '---\ntitle: x\ncategories: [technical]\n---\n'), `${O}/technical/fable-field-guide/`);
  assert.equal(sourceToUrl('_posts/2026-03-29-claude-code-s2m-skill.md', '---\ncategories:\n  - claude-code\n---\n'), `${O}/claude-code/claude-code-s2m-skill/`);
});

test('頁面：index → 資料夾網址；其他 .html → 去副檔名的資料夾網址；permalink 優先', () => {
  assert.equal(sourceToUrl('education/ai/learn/ai-basics/mcp/index.html', '---\nlayout: x\n---\n'), `${O}/education/ai/learn/ai-basics/mcp/`);
  assert.equal(sourceToUrl('photography/awards.html', '---\nlayout: x\n---\n'), `${O}/photography/awards/`);
  assert.equal(sourceToUrl('foo/bar.html', '---\npermalink: /baz/\n---\n'), `${O}/baz/`);
});

test('不會單獨成頁的檔一律略過', () => {
  for (const p of ['_layouts/article.html', '_includes/head.html', '_data/ai_learn.yml', 'assets/css/ai-learn.css', 'nft/index.html', 'docs/x.md']) {
    assert.equal(sourceToUrl(p, '---\n---\n'), null, p);
  }
  assert.equal(sourceToUrl('README.md', '# 沒有 front matter'), null);
});

test('金鑰檔在站台根目錄、內容等於金鑰', () => {
  const f = join(REPO_ROOT, `${KEY}.txt`);
  assert.ok(existsSync(f), `缺 ${KEY}.txt`);
  assert.equal(readFileSync(f, 'utf8').trim(), KEY);
  assert.match(KEY, /^[0-9a-f]{32}$/);
});
