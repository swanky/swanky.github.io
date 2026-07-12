import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hub = readFileSync(new URL('../education/index.html', import.meta.url), 'utf8');
const hero = readFileSync(new URL('../_includes/education/hero.html', import.meta.url), 'utf8');
const instructor = readFileSync(new URL('../_includes/education/instructor.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../assets/css/education.css', import.meta.url), 'utf8');

test('education hub 不再使用含虛構數字的 terminal 示意圖', () => {
  assert.doesNotMatch(hub, /claude-code-terminal\.svg/);
});

test('education hub 的非 Hero 圖片使用 lazy loading', () => {
  const images = [...hub.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  assert.ok(images.length > 0);
  assert.deepEqual(images.filter((tag) => !tag.includes('loading="lazy"')), []);
});

test('education Hero 圖片優先載入且不使用容易重疊的次圖', () => {
  assert.match(hero, /fetchpriority="high"/);
  assert.match(hero, /decoding="async"/);
  assert.doesNotMatch(hero, /include\.secondary_image/);
  assert.doesNotMatch(hub, /secondary_image=/);
});

test('education hub 每個圖片素材只出現一次', () => {
  const assets = [...hub.matchAll(/\/(?:assets|education)\/[^"'\s]+\.(?:jpe?g|png|svg|webp)/gi)]
    .map((match) => match[0]);
  const duplicates = [...new Set(assets.filter((asset, index) => assets.indexOf(asset) !== index))];
  assert.deepEqual(duplicates, []);
});

test('education hub 在 tablet 寬度前就將路徑卡改為單欄', () => {
  const tabletRules = css.match(/@media \(max-width: 991\.98px\) \{[\s\S]*?\n\}/)?.[0] ?? '';
  assert.match(tabletRules, /\.education-page--hub \.edu-path-grid\s*\{\s*grid-template-columns:\s*1fr/);
});

test('education hub 桌機路徑卡等寬並維持一致圖片比例', () => {
  assert.match(css, /\.education-page--hub \.edu-path-grid\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.education-page--hub \.edu-path-card\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*2/);
});

test('education hub 手機路徑卡將圖片與文字上下分離', () => {
  const mobileRules = css.match(/@media \(max-width: 767\.98px\) \{[\s\S]*?\n\}/)?.[0] ?? '';
  assert.match(mobileRules, /\.education-page--hub \.edu-path-card\s*\{[^}]*aspect-ratio:\s*auto/);
  assert.match(mobileRules, /\.education-page--hub \.edu-path-card img\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*2/);
  assert.match(mobileRules, /\.edu-resource-card\s*\{\s*grid-template-columns:\s*1fr/);
});

test('education hub 核心內容不依賴 AOS 才顯示', () => {
  assert.doesNotMatch(hub, /class="[^"]*edu-path-card[^"]*"[^>]*data-aos/);
  assert.doesNotMatch(hub, /class="[^"]*edu-card[^"]*"[^>]*data-aos/);
  assert.doesNotMatch(hub, /class="[^"]*edu-cta[^"]*"[^>]*data-aos/);
  assert.doesNotMatch(instructor, /data-aos/);
});
