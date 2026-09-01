import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');

const page = read('story/index.html');
const css = read('assets/css/story.css');
const js = read('assets/js/story/story.js');
const gl = read('assets/js/story/story-gl.js');
const manifest = JSON.parse(read('assets/js/story/story-manifest.json'));

const jpegDimensions = (path) => {
  const data = readFileSync(join(root, path));
  const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  for (let offset = 2; offset + 8 < data.length;) {
    if (data[offset] !== 0xff) { offset += 1; continue; }
    const marker = data[offset + 1];
    if (sof.has(marker)) return { width: data.readUInt16BE(offset + 7), height: data.readUInt16BE(offset + 5) };
    if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
    const length = data.readUInt16BE(offset + 2);
    if (length < 2) break;
    offset += length + 2;
  }
  throw new Error(`${path} 不是可解析的 JPEG`);
};

test('/story/ 對外身分與攝影出版說法正確', () => {
  assert.match(page, /三個宇宙｜史旺基 Swanky Hsiao/);
  // 對外可見文案一律「史旺基」領銜、不出現本名；本名只保留在給搜尋引擎看的結構化資料 alternateName（比照首頁慣例）
  const visibleCopy = page.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  assert.doesNotMatch(visibleCopy, /蕭宇程/);
  assert.match(page, /"alternateName": \["Swanky Hsiao", "蕭宇程"\]/);
  assert.match(page, /3 本個人作品書、2 本合作出版/);
  assert.doesNotMatch(page, /五本個人攝影作品書/);
});

test('/story/ WebGL 序曲使用三張獨立 16:9 衍生圖', () => {
  const overtures = manifest.items.filter((item) => item.overture);
  assert.equal(overtures.length, 3);
  for (const item of overtures) {
    const path = item.overture.replace(/^\//, '');
    assert.ok(existsSync(join(root, path)), `${item.overture} 不存在`);
    const actual = jpegDimensions(path);
    assert.deepEqual(actual, { width: item.overtureWidth, height: item.overtureHeight });
    const ratio = actual.width / actual.height;
    assert.ok(Math.abs(ratio - 16 / 9) < 0.01, `${item.overture} 不是 16:9`);
    assert.match(page, new RegExp(item.overture.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('/story/ 動態層維持漸進增強與行動裝置安全退回', () => {
  assert.match(css, /\.overture \{ display: none; \}/);
  assert.match(css, /html\.gl-overture \.overture/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(gl, /innerWidth >= 900 && innerHeight <= innerWidth \* 1\.12/);
  assert.match(gl, /innerWidth \/ Math\.max\(1, innerHeight\) <= 2\.2/);
  assert.match(gl, /renderDpr\(w, h, 3000000\)/);
  assert.match(gl, /if \(!safeOverture\(\)\) \{ collapse\(\); return; \}/);
  assert.match(gl, /else suspend\(\)/);
  assert.doesNotMatch(gl, /else \{ act = false; teardown\(\); \}/);
  assert.match(gl, /if \(velocity > \.01\) requestFrame\(\)/);
  assert.match(gl, /uVelocity/);
  assert.match(gl, /uTime/);
});

test('/story/ 旗艦體驗包含敘事、現代 CSS 與 fine-pointer 回饋', () => {
  assert.match(page, /class="story-thesis"/);
  assert.match(page, /class="scroll-hint" href="#story-thesis"/);
  assert.match(page, /class="code-signal reveal"/);
  assert.match(page, /class="code-proofs reveal"/);
  assert.match(page, /class="chain-proof"/);
  assert.match(css, /@property --story-scroll/);
  assert.match(css, /animation-timeline: view\(\)/);
  assert.match(css, /container-type: inline-size/);
  assert.match(css, /:has\(:focus-visible\)/);
  assert.match(js, /matchMedia\('\(pointer: fine\)'\)/);
  assert.match(js, /setAttribute\('aria-current', 'location'\)/);
  assert.match(js, /classList\.add\('reveal-ready'\)/);
  assert.match(js, /classList\.add\('blurup-ready'\)/);
  assert.match(page, /class="skip-link" href="#main-content"/);
});
