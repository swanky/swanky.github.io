// 不靠外部套件讀出圖片的顯示尺寸（JPEG／PNG／GIF／WebP／SVG）。只讀不寫。
// 給 tools/build-image-dimensions.mjs 與 tests/image-dimensions.test.mjs 用。
//
// 「顯示尺寸」＝瀏覽器實際畫出來的寬高：JPEG 若帶 EXIF Orientation 5–8（直拍照片常見），寬高要對調。
// SVG 只有在根元素明確寫了像素寬高時才回傳——只有 viewBox 的 SVG 沒有固定尺寸，會跟著容器伸縮，
// 硬補 width／height 屬性反而會改變它的顯示寬度。
import { readFileSync } from 'node:fs';

function jpegOrientation(buffer, start, end) {
  // start..end 是 APP1 內容；前 6 bytes 為 "Exif\0\0"，其後是 TIFF
  const tiff = buffer.subarray(start + 6, end);
  if (tiff.length < 14) return 1;
  const order = tiff.toString('latin1', 0, 2);
  if (order !== 'II' && order !== 'MM') return 1;
  const little = order === 'II';
  const u16 = (offset) => (offset + 2 <= tiff.length ? (little ? tiff.readUInt16LE(offset) : tiff.readUInt16BE(offset)) : -1);
  const u32 = (offset) => (offset + 4 <= tiff.length ? (little ? tiff.readUInt32LE(offset) : tiff.readUInt32BE(offset)) : -1);
  const ifd0 = u32(4);
  const count = u16(ifd0);
  for (let index = 0; index < count; index += 1) {
    const entry = ifd0 + 2 + index * 12;
    if (u16(entry) === 0x0112) return u16(entry + 8);
  }
  return 1;
}

function jpegSize(buffer) {
  let offset = 2;
  let orientation = 1;
  while (offset + 4 <= buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    if (marker === 0xff) { offset += 1; continue; }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) { offset += 2; continue; }
    const length = buffer.readUInt16BE(offset + 2);
    if (marker === 0xe1 && buffer.toString('latin1', offset + 4, offset + 10) === 'Exif\0\0') {
      orientation = jpegOrientation(buffer, offset + 4, offset + 2 + length);
    }
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isStartOfFrame) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return orientation >= 5 && orientation <= 8 ? [height, width] : [width, height];
    }
    if (marker === 0xda) break;
    offset += 2 + length;
  }
  return null;
}

function webpSize(buffer) {
  const format = buffer.toString('latin1', 12, 16);
  if (format === 'VP8X') return [1 + buffer.readUIntLE(24, 3), 1 + buffer.readUIntLE(27, 3)];
  if (format === 'VP8 ') return [buffer.readUInt16LE(26) & 0x3fff, buffer.readUInt16LE(28) & 0x3fff];
  if (format === 'VP8L') {
    const bits = buffer.readUInt32LE(21);
    return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
  }
  return null;
}

function svgSize(buffer) {
  const root = buffer.toString('utf8').match(/<svg\b[^>]*>/i);
  if (!root) return null;
  const pixels = (name) => {
    const match = root[0].match(new RegExp(`\\s${name}\\s*=\\s*["']\\s*([0-9]*\\.?[0-9]+)\\s*(px)?\\s*["']`, 'i'));
    return match ? Number(match[1]) : null;
  };
  const width = pixels('width');
  const height = pixels('height');
  if (!width || !height || !Number.isInteger(width) || !Number.isInteger(height)) return null;
  return [width, height];
}

/** 回傳 [寬, 高]（整數像素）；無法判定或沒有固定尺寸時回傳 null。 */
export function imageSizeFromBuffer(buffer) {
  if (buffer.length < 16) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return jpegSize(buffer);
  if (buffer.toString('latin1', 1, 4) === 'PNG') return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
  if (buffer.toString('latin1', 0, 3) === 'GIF') return [buffer.readUInt16LE(6), buffer.readUInt16LE(8)];
  if (buffer.toString('latin1', 0, 4) === 'RIFF' && buffer.toString('latin1', 8, 12) === 'WEBP') return webpSize(buffer);
  const head = buffer.toString('utf8', 0, Math.min(buffer.length, 2048));
  if (/<svg\b/i.test(head) || /^\s*<\?xml/i.test(head)) return svgSize(buffer);
  return null;
}

export function imageSize(path) {
  return imageSizeFromBuffer(readFileSync(path));
}
