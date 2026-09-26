import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = name => readFileSync(join(root, name), 'utf8');
const photos = JSON.parse(read('_data/flickr_static.json'));
const paths = JSON.parse(read('_data/flickr_image_paths.json'));
const fallbacks = JSON.parse(read('assets/data/flickr-fallbacks.json'));

test('Flickr CDN failures resolve to reviewed local copies of every mapped photo', () => {
  assert.deepEqual(Object.keys(fallbacks).sort(), Object.keys(photos).sort());
  for (const [id, image] of Object.entries(fallbacks)) {
    assert.equal(paths[image], id, `Fallback changes photo identity: ${id}`);
    assert.ok(existsSync(join(root, image)), `Missing fallback: ${image}`);
  }
  const book = JSON.parse(read('_data/nft_seven_eight.json'));
  for (const p of book.photos) assert.equal(fallbacks[p.flickr_id], p.image);
});

test('Flickr mappings resolve existing assets to uncropped, correctly sized images of the same photo', () => {
  for (const [path, id] of Object.entries(paths)) {
    assert.ok(existsSync(join(root, path)), `Missing local identity: ${path}`);
    assert.ok(photos[id]?.full, `Missing public size: ${id}`);
  }
  for (const [id, p] of Object.entries(photos)) {
    assert.ok(p.sizes.length > 0);
    let previousWidth = 0;
    for (const s of p.sizes) {
      assert.match(s.url, new RegExp(`^https://live\\.staticflickr\\.com/\\d+/${id}_[a-f0-9]+(?:_[a-z0-9]+)?\\.jpg$`));
      assert.doesNotMatch(s.url, /_[sq]\.jpg$/, `Square crop: ${id}`);
      assert.ok(s.width > previousWidth && s.height > 0, `Invalid width descriptors: ${id}`);
      assert.ok(Math.abs((s.width / s.height) / (p.width / p.height) - 1) < 0.01, `Changed composition: ${id}`);
      previousWidth = s.width;
    }
    assert.match(p.full, new RegExp(`^https://live\\.staticflickr\\.com/\\d+/${id}_[a-f0-9]+_[a-z0-9]+\\.(?:jpg|png)$`));
    assert.ok(p.width >= p.sizes.at(-1).width);
    assert.ok(p.sizes.some(s => s.url === p.src));
    assert.equal(p.srcset, p.sizes.map(s => `${s.url} ${s.width}w`).join(', '));
  }
});

test('Seven Names preserves the approved release, all 42 photos, seven chapters and the a04 image', () => {
  const source = readFileSync(join(root, '_data/nft_seven_eight.json'));
  assert.equal(createHash('sha256').update(source).digest('hex'), '00fde96786bdfb49f64e0c9efc051ec020d12ff49fa5544854ed63560f3fb907');
  const book = JSON.parse(source);
  assert.equal(book.pdf_pages, 52);
  assert.equal(book.character_count, 7);
  assert.equal(book.presentation_count, 8);
  assert.equal(book.characters.length, 7);
  assert.equal(book.chapters.length, 7);
  assert.deepEqual(book.photos.map(p => p.order), Array.from({ length: 42 }, (_, i) => i + 1));
  assert.equal(book.photos[31].id, 'me-two-ways-through-a04');
  assert.equal(book.photos[31].flickr_id, '55551735384');
  for (const p of book.photos) {
    assert.ok(book.chapters.some(c => c.id === p.chapter));
    assert.ok(p.characters.every(id => book.characters.some(c => c.id === id)));
    assert.equal(paths[p.image], p.flickr_id);
    assert.equal(paths[p.preview], p.flickr_id);
    assert.ok(photos[p.flickr_id].width >= p.width && photos[p.flickr_id].height >= p.height);
    assert.ok(p.alt.includes('AI'));
  }
});

test('Cropped or specially compressed derivatives stay local instead of being swapped for larger Flickr originals', () => {
  // 首頁 WebP 是裁好壓好的版位圖、-card.jpg 是列表縮圖；對到 Flickr 會換成 3–5 倍大的原圖
  const derivatives = Object.keys(paths).filter(path => path.startsWith('/assets/img/home/') || path.endsWith('-card.jpg'));
  assert.deepEqual(derivatives, []);
});

test('Beyond the Frame alt text names who is in each frame (models/in-shot.html relies on it)', () => {
  // 多人合輯沒有逐張角色欄位，出鏡張數與角色頁選圖靠 alt 第一個「，」前的主詞判斷
  const book = JSON.parse(read('_data/beyond_the_frame.json'));
  const subjects = new Set(book.photos.map(p => p.alt.split('，')[0]));
  assert.deepEqual([...subjects].sort(), ['場景細節', '成年虛構角色李瓶兒', '成年虛構角色李瓶兒與潘金蓮', '成年虛構角色潘金蓮'].sort());
  assert.deepEqual(book.models, ['李瓶兒', '潘金蓮']);
});
