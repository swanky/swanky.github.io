// 不靠外部工具找出圖片裡的 GPS 定位欄位（JPEG／PNG／WebP／TIFF 的 EXIF，以及內嵌 XMP）。
// 給 tests/media-gps.test.mjs 用；影片與其他格式請用 tools/audit-media-gps.mjs（exiftool）。
// 只讀不寫。要移除定位資訊用 `exiftool -gps:all= -overwrite_original <檔案>`（無損，不重新壓縮）。
import { closeSync, openSync, readSync, readFileSync, statSync } from 'node:fs';

const GPS_TAG_NAMES = {
  1: 'GPSLatitudeRef', 2: 'GPSLatitude', 3: 'GPSLongitudeRef', 4: 'GPSLongitude', 5: 'GPSAltitudeRef', 6: 'GPSAltitude',
  7: 'GPSTimeStamp', 18: 'GPSMapDatum', 27: 'GPSProcessingMethod', 28: 'GPSAreaInformation', 29: 'GPSDateStamp',
};
const XMP_FIELDS = ['GPSLatitude', 'GPSLongitude', 'GPSAltitude'];

/** 解析 TIFF 結構（EXIF 本體），回傳 GPS IFD 內的欄位名稱；只有版本號（tag 0）不算。 */
function gpsTagsInTiff(tiff) {
  if (tiff.length < 8) return [];
  const order = tiff.toString('latin1', 0, 2);
  if (order !== 'II' && order !== 'MM') return [];
  const little = order === 'II';
  const u16 = (offset) => (offset + 2 <= tiff.length ? (little ? tiff.readUInt16LE(offset) : tiff.readUInt16BE(offset)) : -1);
  const u32 = (offset) => (offset + 4 <= tiff.length ? (little ? tiff.readUInt32LE(offset) : tiff.readUInt32BE(offset)) : -1);
  if (u16(2) !== 42) return [];
  const ifd0 = u32(4);
  const count = u16(ifd0);
  if (ifd0 < 8 || count < 0) return [];
  for (let index = 0; index < count; index += 1) {
    const entry = ifd0 + 2 + index * 12;
    if (u16(entry) !== 0x8825) continue;
    const gpsIfd = u32(entry + 8);
    const gpsCount = u16(gpsIfd);
    if (gpsIfd < 8 || gpsCount < 0) return [];
    const found = [];
    for (let g = 0; g < gpsCount; g += 1) {
      const tag = u16(gpsIfd + 2 + g * 12);
      if (tag > 0) found.push(`exif:${GPS_TAG_NAMES[tag] || `GPSTag${tag}`}`);
    }
    return found;
  }
  return [];
}

function stripExifHeader(buffer) {
  return buffer.toString('latin1', 0, 6) === 'Exif\0\0' ? buffer.subarray(6) : buffer;
}

function gpsFieldsInXmp(buffer) {
  return XMP_FIELDS.filter((field) => buffer.includes(`exif:${field}`)).map((field) => `xmp:${field}`);
}

function jpegExif(buffer) {
  const found = [];
  let offset = 2;
  while (offset + 4 <= buffer.length && buffer[offset] === 0xff) {
    const marker = buffer[offset + 1];
    if (marker === 0xda || marker === 0xd9) break; // 影像資料開始
    const length = buffer.readUInt16BE(offset + 2);
    const body = buffer.subarray(offset + 4, Math.min(offset + 2 + length, buffer.length));
    if (marker === 0xe1 && body.toString('latin1', 0, 6) === 'Exif\0\0') found.push(...gpsTagsInTiff(body.subarray(6)));
    offset += 2 + length;
  }
  return found;
}

function pngExif(buffer) {
  const found = [];
  let offset = 8;
  while (offset + 8 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('latin1', offset + 4, offset + 8);
    if (type === 'eXIf') found.push(...gpsTagsInTiff(stripExifHeader(buffer.subarray(offset + 8, offset + 8 + length))));
    if (type === 'IEND') break;
    offset += 12 + length;
  }
  return found;
}

/** 給一段檔案內容（至少含檔頭），回傳找到的 GPS 欄位名稱陣列；沒有就是空陣列。 */
export function findGpsInBuffer(buffer) {
  const found = [];
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) found.push(...jpegExif(buffer));
  else if (buffer.length >= 8 && buffer.toString('latin1', 1, 4) === 'PNG') found.push(...pngExif(buffer));
  else if (buffer.length >= 8 && ['II', 'MM'].includes(buffer.toString('latin1', 0, 2))) found.push(...gpsTagsInTiff(buffer));
  found.push(...gpsFieldsInXmp(buffer));
  return [...new Set(found)];
}

/** WebP 的 EXIF／XMP 區塊通常在檔尾：沿著 RIFF 區塊表頭跳著讀，不必把整張圖讀進記憶體。 */
function findGpsInWebp(path, size) {
  const found = [];
  const fd = openSync(path, 'r');
  try {
    const head = Buffer.alloc(12);
    readSync(fd, head, 0, 12, 0);
    if (head.toString('latin1', 0, 4) !== 'RIFF' || head.toString('latin1', 8, 12) !== 'WEBP') return [];
    let offset = 12;
    const chunkHead = Buffer.alloc(8);
    while (offset + 8 <= size) {
      if (readSync(fd, chunkHead, 0, 8, offset) < 8) break;
      const type = chunkHead.toString('latin1', 0, 4);
      const length = chunkHead.readUInt32LE(4);
      if (type === 'EXIF' || type === 'XMP ') {
        const body = Buffer.alloc(Math.min(length, size - offset - 8));
        readSync(fd, body, 0, body.length, offset + 8);
        found.push(...(type === 'EXIF' ? gpsTagsInTiff(stripExifHeader(body)) : gpsFieldsInXmp(body)));
      }
      offset += 8 + length + (length % 2);
    }
  } finally {
    closeSync(fd);
  }
  return [...new Set(found)];
}

const HEAD_BYTES = 512 * 1024;

/** 檢查一個圖檔；JPEG／TIFF 只讀檔頭（EXIF 與 XMP 都在影像資料之前），PNG 整檔讀，WebP 跳著讀。 */
export function findGpsInFile(path) {
  const size = statSync(path).size;
  if (/\.webp$/i.test(path)) return findGpsInWebp(path, size);
  if (/\.png$/i.test(path)) return findGpsInBuffer(readFileSync(path));
  const length = Math.min(size, HEAD_BYTES);
  const buffer = Buffer.alloc(length);
  const fd = openSync(path, 'r');
  try { readSync(fd, buffer, 0, length, 0); } finally { closeSync(fd); }
  return findGpsInBuffer(buffer);
}
