import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildDeck } from '../../assets/js/tarot/tarot-deck.js';

const ROOT = path.resolve(import.meta.dirname, '../..');
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

function jpegDimensions(filePath) {
  const bytes = fs.readFileSync(filePath);
  assert.equal(bytes[0], 0xff, `${filePath} 不是 JPEG`);
  assert.equal(bytes[1], 0xd8, `${filePath} 不是 JPEG`);
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) { offset += 1; continue; }
    const marker = bytes[offset + 1];
    if (marker === 0xd9 || marker === 0xda) break;
    const length = bytes.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  throw new Error(`找不到 JPEG 尺寸：${filePath}`);
}

test('CloneX web 牌組＝78 張且全為 768×1152 JPEG', () => {
  const dir = path.join(ROOT, 'assets/img/tarot-clonex');
  const expected = buildDeck().map((id) => `${id}.jpg`).sort();
  const actual = fs.readdirSync(dir).filter((name) => name.endsWith('.jpg')).sort();
  assert.deepEqual(actual, expected);
  for (const name of actual) {
    assert.deepEqual(jpegDimensions(path.join(dir, name)), { width: 768, height: 1152 }, name);
  }
});

test('Cyber Tarot Lab 路由、抽牌工具與 gallery 接線完整', () => {
  const routes = [
    'tarot/index.html',
    'tarot/draw/index.html',
    'tarot/decks/index.html',
    'tarot/decks/uniform/index.html',
    'tarot/decks/clonex/index.html',
    'tarot/lab/index.html',
    'technical/ai-visual-production/index.html',
  ];
  for (const route of routes) assert.ok(fs.existsSync(path.join(ROOT, route)), route);
  assert.match(read('tarot/index.html'), /Swanky Cyber Tarot Lab/);
  assert.match(read('tarot/draw/index.html'), /use_tarot: true/);
  assert.match(read('tarot/decks/clonex/index.html'), /use_tarot_gallery: true/);
  assert.match(read('_includes/scripts.html'), /tarot-deck-gallery\.js/);
  assert.match(read('assets/css/tarot-lab.css'), /\.ct-gallery-card img \{[^}]*height: auto;/);
});

test('CloneX gallery 避免舊快取，lightbox 有描述與前後切牌', () => {
  const head = read('_includes/head.html');
  const scripts = read('_includes/scripts.html');
  const gallery = read('assets/js/tarot/tarot-deck-gallery.js');
  assert.match(head, /tarot-lab\.css[^\r\n]*\?v=/);
  assert.match(scripts, /tarot-deck-gallery\.js[^\r\n]*\?v=/);
  assert.doesNotMatch(gallery, /height="1152"/);
  assert.match(gallery, /tarot-data-texts\.js/);
  assert.match(gallery, /ArrowLeft/);
  assert.match(gallery, /ArrowRight/);
  assert.match(gallery, /ct-lightbox__prev/);
  assert.match(gallery, /ct-lightbox__next/);
  assert.match(gallery, /reading\?\.symbol/);
});

test('印刷母版不部署，服務頁使用洽詢報價而非固定價目', () => {
  assert.match(read('_config.yml'), /assets\/img\/tarot-clonex-print/);
  const service = read('technical/ai-visual-production/index.html');
  assert.match(service, /依範圍報價/);
  assert.match(service, /用 Email 免費洽詢/);
  assert.doesNotMatch(service, /NT\$/);
});
