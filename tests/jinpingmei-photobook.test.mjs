import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA_PATH = path.join(ROOT, '_data/jinpingmei_photobook.yml');
const IMAGE_DIR = path.join(ROOT, 'assets/img/jinpingmei/photobook');
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

function scalar(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parsePhotobook() {
  const packs = [];
  let pack = null;
  let shot = null;
  for (const line of fs.readFileSync(DATA_PATH, 'utf8').split(/\r?\n/)) {
    let match = line.match(/^  - slug: (.+)$/);
    if (match) {
      pack = { slug: scalar(match[1]), shots: [] };
      packs.push(pack);
      shot = null;
      continue;
    }
    match = line.match(/^    name: (.+)$/);
    if (match && pack) {
      pack.name = scalar(match[1]);
      continue;
    }
    match = line.match(/^      - image: (.+)$/);
    if (match && pack) {
      shot = { image: scalar(match[1]) };
      pack.shots.push(shot);
      continue;
    }
    match = line.match(/^        (caption|alt|width|height): (.+)$/);
    if (match && shot) {
      shot[match[1]] = ['width', 'height'].includes(match[1]) ? Number(match[2]) : scalar(match[2]);
    }
  }
  return packs;
}

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

test('金瓶梅寫真館收錄十位角色、二十六幀，圖片與標示資料一致', () => {
  const packs = parsePhotobook();
  const expectedCounts = {
    panjinlian: 9,
    lipinger: 8,
    chunmei: 1,
    songhuilian: 1,
    wuyueniang: 2,
    mengyulou: 1,
    lijiaoer: 1,
    sunxuee: 1,
    hanaijie: 1,
    wangliuer: 1,
  };

  assert.deepEqual(Object.fromEntries(packs.map((pack) => [pack.slug, pack.shots.length])), expectedCounts);
  assert.equal(packs.reduce((total, pack) => total + pack.shots.length, 0), 26);

  const referenced = [];
  const previews = [];
  for (const pack of packs) {
    const characterPath = path.join(ROOT, `_jinpingmei_characters/${pack.slug}.html`);
    assert.ok(fs.existsSync(characterPath), `${pack.slug} 沒有角色個人頁`);
    assert.match(fs.readFileSync(characterPath, 'utf8'), new RegExp(`permalink: /jinpingmei/characters/${pack.slug}/`));
    assert.ok(pack.name, `${pack.slug} 缺少人物名稱`);

    for (const shot of pack.shots) {
      assert.ok(shot.caption, `${shot.image} 缺少圖說`);
      assert.ok(shot.alt?.includes(pack.name), `${shot.image} 的替代文字未說明人物`);
      const imagePath = path.join(IMAGE_DIR, shot.image);
      assert.ok(fs.existsSync(imagePath), `${shot.image} 圖檔不存在`);
      assert.deepEqual(jpegDimensions(imagePath), { width: shot.width, height: shot.height }, `${shot.image} 尺寸標示不符`);
      assert.ok(fs.statSync(imagePath).size < 400 * 1024, `${shot.image} 超過 400 KB，請先壓縮`);
      referenced.push(shot.image);

      const previewName = shot.image.replace(/\.jpg$/, '-480.jpg');
      const previewPath = path.join(IMAGE_DIR, previewName);
      assert.ok(fs.existsSync(previewPath), `${previewName} 瀏覽圖不存在`);
      const expectedHeight = Math.round(shot.height * 480 / shot.width);
      assert.deepEqual(jpegDimensions(previewPath), { width: 480, height: expectedHeight }, `${previewName} 尺寸不符`);
      assert.ok(fs.statSync(previewPath).size < 100 * 1024, `${previewName} 超過 100 KB，請先壓縮`);
      previews.push(previewName);
    }
  }

  assert.equal(new Set(referenced).size, referenced.length, '寫真資料重複引用同一張圖片');
  const actual = fs.readdirSync(IMAGE_DIR).filter((name) => name.endsWith('.jpg')).sort();
  assert.deepEqual(actual, [...referenced, ...previews].sort(), '寫真圖片目錄有未收錄或缺漏的 JPEG');
});

test('同一份寫真資料同步輸出到寫真館與角色個人頁', () => {
  const layout = read('_layouts/jinpingmei-character.html');
  const gallery = read('jinpingmei/photobook/index.html');
  const include = read('_includes/jinpingmei/photobook.html');
  const css = read('assets/css/jinpingmei-photobook.css');

  assert.match(layout, /include jinpingmei\/photobook\.html slug=charslug/);
  assert.match(gallery, /for p in pb\.packs/);
  assert.match(gallery, /replace: '\.jpg', '-480\.jpg'/);
  assert.match(include, /where: "slug", include\.slug/);
  assert.match(include, /replace: '\.jpg', '-480\.jpg'/);
  assert.match(include, /if pbcols > 4/);
  assert.match(css, /repeat\(var\(--pb-cols, 3\), minmax\(0, 1fr\)\)/);
});
