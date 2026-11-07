import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const read = (relativePath) => readFileSync(join(ROOT, relativePath), 'utf8');

// 2026-11-07：部署產物 1653MB 超過 GitHub Pages 1GB 準則而逾時，寫真集原尺寸 webp 改為不部署（_config.yml exclude）。
const EXCLUDED_FULL_SIZE = [
  /^\/assets\/img\/photography\/[^/]+\/[0-9]{2}\.webp$/,
  /^\/assets\/img\/photography\/[^/]+\/[A-Z]{3}-[0-9]{2}\.webp$/,
];

test('_config.yml excludes full-size photobook webp', () => {
  const config = read('_config.yml');
  assert.match(config, /- "assets\/img\/photography\/\*\/\[0-9\]\[0-9\]\.webp"/);
  assert.match(config, /- "assets\/img\/photography\/\*\/\[A-Z\]\[A-Z\]\[A-Z\]-\[0-9\]\[0-9\]\.webp"/);
});

test('Flickr CDN-error fallbacks never point at undeployed full-size files', () => {
  const fallbacks = JSON.parse(read('assets/data/flickr-fallbacks.json'));
  const bad = Object.values(fallbacks).filter((p) => EXCLUDED_FULL_SIZE.some((re) => re.test(p)));
  assert.deepEqual(bad, [], `備援指向不部署的原尺寸檔：${bad.slice(0, 5).join(', ')}`);
  const missing = Object.values(fallbacks).filter((p) => !existsSync(join(ROOT, p.slice(1))));
  assert.deepEqual(missing, [], `備援指向不存在的檔：${missing.slice(0, 5).join(', ')}`);
});

test('every PDF excluded from the deploy is served from a Release, and every tracked PDF is either', () => {
  // 2026-11-07：PDF 走 GitHub Releases，不進部署產物；漏對照的話下載按鈕會指向不部署的檔而 404。
  const config = read('_config.yml');
  const excluded = new Set([...config.matchAll(/^ {2}- "(assets\/downloads\/[^"]+\.pdf)"\s*$/gm)].map((m) => `/${m[1]}`));
  const hosted = JSON.parse(read('_data/photography_downloads.json'));
  for (const p of excluded) assert.match(hosted[p] || '', /^https:\/\/github\.com\/swanky\/swanky\.github\.io\/releases\/download\//, `不部署但沒有 Release 對照：${p}`);
  for (const [p, url] of Object.entries(hosted)) {
    assert.ok(excluded.has(p), `已有 Release 卻仍部署：${p}`);
    assert.ok(url.endsWith('/' + p.split('/').pop()), `Release 檔名不符：${p}`);
  }
});

test('photobook pages link PDFs through the Release mapping', () => {
  // 直接寫 book.pdf | relative_url 會繞過 _data/photography_downloads.json。
  for (const f of ['jinpingmei/photobook/beyond-the-frame/index.html', 'jinpingmei/photobook/pan-jinlian-she-sees-it-first/index.html', 'jinpingmei/photobook/pan-jinlian-tonight-she-opens/index.html', 'photography/nft-seven-eight/index.html', 'photography/swanky-ji-everyday-light/index.html', 'photography/swanky-ji-open-worlds/index.html']) {
    assert.doesNotMatch(read(f), /book\.pdf \| (relative|absolute)_url|secondary_url=book\.pdf/, f);
  }
});

test('Flickr CDN-error fallbacks are not listed in _config.yml exclude', () => {
  // 2026-11-07：舊 exclude 清單排掉的 -960 檔一度成為備援目標，正式站會 404。
  const excluded = new Set([...read('_config.yml').matchAll(/^ {2}- "([^"*[]+)"\s*$/gm)].map((m) => `/${m[1]}`));
  const fallbacks = JSON.parse(read('assets/data/flickr-fallbacks.json'));
  const bad = Object.values(fallbacks).filter((p) => excluded.has(p));
  assert.deepEqual(bad, [], `備援指向不部署的檔：${bad.slice(0, 5).join(', ')}`);
});
