// 照片定位資訊回歸測試（2026-11-24）：git 追蹤的圖片不得帶 GPS 座標。
// 這裡用純 Node 直接讀 EXIF（JPEG／PNG／WebP）與內嵌的 XMP，不需要外部工具，所以能放進 npm test。
// 影片與少見格式要用 exiftool 才驗得到——跑 `npm run audit:gps`（tools/audit-media-gps.mjs）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, trackedFiles } from './_site-audit.mjs';
import { findGpsInBuffer, findGpsInFile } from '../tools/lib/exif-gps.mjs';

const IMAGE = /\.(jpe?g|png|webp|tiff?)$/i;

test('EXIF 解析器認得帶座標的檔，也不會誤判只有版本號的 GPS 區塊', () => {
  const tiff = (gpsEntries) => {
    // 最小的 little-endian TIFF：IFD0 只有一筆 GPSInfo 指標，指向後面的 GPS IFD
    const gpsOffset = 8 + 2 + 12 + 4;
    const buf = Buffer.alloc(gpsOffset + 2 + gpsEntries.length * 12 + 4);
    buf.write('II', 0, 'latin1'); buf.writeUInt16LE(42, 2); buf.writeUInt32LE(8, 4);
    buf.writeUInt16LE(1, 8);
    buf.writeUInt16LE(0x8825, 10); buf.writeUInt16LE(4, 12); buf.writeUInt32LE(1, 14); buf.writeUInt32LE(gpsOffset, 18);
    buf.writeUInt16LE(gpsEntries.length, gpsOffset);
    gpsEntries.forEach((tag, index) => buf.writeUInt16LE(tag, gpsOffset + 2 + index * 12));
    return buf;
  };
  const jpeg = (payload) => {
    const exif = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), payload]);
    const header = Buffer.from([0xff, 0xd8, 0xff, 0xe1, (exif.length + 2) >> 8, (exif.length + 2) & 0xff]);
    return Buffer.concat([header, exif, Buffer.from([0xff, 0xd9])]);
  };
  assert.deepEqual(findGpsInBuffer(jpeg(tiff([0, 1, 2, 3, 4]))), ['exif:GPSLatitudeRef', 'exif:GPSLatitude', 'exif:GPSLongitudeRef', 'exif:GPSLongitude']);
  assert.deepEqual(findGpsInBuffer(jpeg(tiff([0]))), []);
  assert.deepEqual(findGpsInBuffer(jpeg(tiff([]))), []);
  assert.deepEqual(findGpsInBuffer(Buffer.from('<x:xmpmeta><rdf:Description exif:GPSLatitude="25,2.0N"/></x:xmpmeta>')), ['xmp:GPSLatitude']);
  assert.deepEqual(findGpsInBuffer(Buffer.from('not an image')), []);
});

test('git 追蹤的圖片不含 GPS 定位欄位', () => {
  const images = trackedFiles().filter((path) => IMAGE.test(path));
  assert.ok(images.length > 5000, `圖片數量異常：${images.length}`);
  const hits = [];
  for (const path of images) {
    const full = join(ROOT, path);
    if (!existsSync(full)) continue; // 已追蹤但工作目錄沒有的檔
    const found = findGpsInFile(full);
    if (found.length) hits.push(`${path}（${found.slice(0, 4).join('、')}）`);
  }
  assert.deepEqual(hits, [], `這些圖片帶定位資訊，用 exiftool -gps:all= 無損移除：\n${hits.join('\n')}`);
});
