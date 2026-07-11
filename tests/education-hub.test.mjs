import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hub = readFileSync(new URL('../education/index.html', import.meta.url), 'utf8');
const hero = readFileSync(new URL('../_includes/education/hero.html', import.meta.url), 'utf8');
const instructor = readFileSync(new URL('../_includes/education/instructor.html', import.meta.url), 'utf8');

test('education hub 不再使用含虛構數字的 terminal 示意圖', () => {
  assert.doesNotMatch(hub, /claude-code-terminal\.svg/);
});

test('education hub 的非 Hero 圖片使用 lazy loading', () => {
  const images = [...hub.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  assert.ok(images.length > 0);
  assert.deepEqual(images.filter((tag) => !tag.includes('loading="lazy"')), []);
});

test('education Hero 圖片優先載入且支援雙視覺', () => {
  assert.match(hero, /fetchpriority="high"/);
  assert.match(hero, /decoding="async"/);
  assert.match(hero, /include\.secondary_image/);
  assert.match(hero, /include\.secondary_media_label/);
  assert.match(hub, /secondary_media_label="攝影作品"/);
});

test('education hub 核心內容不依賴 AOS 才顯示', () => {
  assert.doesNotMatch(hub, /class="[^"]*edu-path-card[^"]*"[^>]*data-aos/);
  assert.doesNotMatch(hub, /class="[^"]*edu-card[^"]*"[^>]*data-aos/);
  assert.doesNotMatch(hub, /class="[^"]*edu-cta[^"]*"[^>]*data-aos/);
  assert.doesNotMatch(instructor, /data-aos/);
});
