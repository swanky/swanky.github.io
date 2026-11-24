// 圖片寬高資料檔的回歸測試（2026-11-24）。
// _data/image_dimensions.json 由 tools/build-image-dimensions.mjs 產生，版型在建置時查表替 <img> 補 width／height。
// 資料檔少登記幾張圖沒關係（那幾張只是不補寬高）；但登記了就必須與實際圖檔一致，否則瀏覽器會先留錯位置。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSize, imageSizeFromBuffer } from '../tools/lib/image-size.mjs';
import { DATA_FILE } from '../tools/build-image-dimensions.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const read = (relativePath) => readFileSync(join(ROOT, relativePath), 'utf8');

test('尺寸解析：PNG、GIF、SVG 與帶旋轉資訊的 JPEG', () => {
  const png = Buffer.alloc(32);
  png.write('\x89PNG\r\n\x1a\n', 0, 'latin1'); png.writeUInt32BE(13, 8); png.write('IHDR', 12, 'latin1');
  png.writeUInt32BE(640, 16); png.writeUInt32BE(427, 20);
  assert.deepEqual(imageSizeFromBuffer(png), [640, 427]);

  const gif = Buffer.alloc(16);
  gif.write('GIF89a', 0, 'latin1'); gif.writeUInt16LE(320, 6); gif.writeUInt16LE(200, 8);
  assert.deepEqual(imageSizeFromBuffer(gif), [320, 200]);

  const jpeg = (orientation) => {
    const tiff = Buffer.alloc(8 + 2 + 12 + 4);
    tiff.write('II', 0, 'latin1'); tiff.writeUInt16LE(42, 2); tiff.writeUInt32LE(8, 4); tiff.writeUInt16LE(1, 8);
    tiff.writeUInt16LE(0x0112, 10); tiff.writeUInt16LE(3, 12); tiff.writeUInt32LE(1, 14); tiff.writeUInt16LE(orientation, 18);
    const exif = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), tiff]);
    const app1 = Buffer.concat([Buffer.from([0xff, 0xe1, (exif.length + 2) >> 8, (exif.length + 2) & 0xff]), exif]);
    const sof = Buffer.from([0xff, 0xc0, 0x00, 0x11, 0x08, 0x03, 0x00, 0x04, 0x00, 0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01]);
    return Buffer.concat([Buffer.from([0xff, 0xd8]), app1, sof, Buffer.from([0xff, 0xd9])]);
  };
  assert.deepEqual(imageSizeFromBuffer(jpeg(1)), [1024, 768], '橫幅：寬 1024 高 768');
  assert.deepEqual(imageSizeFromBuffer(jpeg(6)), [768, 1024], 'Orientation 6（直拍）：顯示時寬高對調');

  assert.deepEqual(imageSizeFromBuffer(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630"></svg>')), [1200, 630]);
  assert.equal(imageSizeFromBuffer(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"></svg>')), null, '只有 viewBox 的 SVG 沒有固定尺寸，不補');
  assert.equal(imageSizeFromBuffer(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"></svg>')), null);
});

test('資料檔登記的每張圖都存在，寬高與實際圖檔一致', () => {
  const data = JSON.parse(read(DATA_FILE));
  const entries = Object.entries(data);
  assert.ok(entries.length >= 300, `登記數量異常：${entries.length}`);
  const problems = [];
  for (const [path, size] of entries) {
    if (!path.startsWith('/') || !Array.isArray(size) || size.length !== 2 || !size.every((n) => Number.isInteger(n) && n > 0)) {
      problems.push(`${path}：格式錯誤`);
      continue;
    }
    const full = join(ROOT, path.slice(1));
    if (!existsSync(full)) { problems.push(`${path}：圖檔不存在`); continue; }
    const actual = imageSize(full);
    if (!actual || actual[0] !== size[0] || actual[1] !== size[1]) problems.push(`${path}：登記 ${size.join('×')}，實際 ${actual ? actual.join('×') : '無法判定'}`);
  }
  assert.deepEqual(problems, [], `請重新執行 node tools/build-image-dimensions.mjs：\n${problems.slice(0, 20).join('\n')}`);
});

test('補寬高的版型接線還在，且只用在圖片高度會等比縮放的容器', () => {
  const include = read('_includes/img-dimensions.html');
  assert.match(include, /site\.data\.image_dimensions\[imgdim_key\]/);
  assert.match(include, /unless imgdim_tag contains ' width=' or imgdim_tag contains ' height='/, '已經寫了寬高的圖不能再補一次');

  const article = read('_layouts/article.html');
  assert.match(article, /\{% include img-dimensions\.html html=content %\}/);
  assert.doesNotMatch(article, /\{\{ content \}\}/, '文章內文要輸出補過寬高的版本');
  assert.match(read('assets/css/style.css'), /\.post-content img \{\s*max-width: 100%;\s*height: auto;/, '.post-content img 必須維持 height:auto');
  assert.match(read('assets/css/style.css'), /\.article-cover img \{\s*width: 100%;\s*height: auto;/, '.article-cover img 必須維持 height:auto');

  const character = read('_layouts/jinpingmei-character.html');
  assert.match(character, /\{% include img-dimensions\.html html=content %\}/);
  assert.match(character, /\.jpm-versions img \{ height: auto; \}/, '角色頁「視覺版本」的圖要有 height:auto，否則會被 height 屬性拉變形');
});
