// core-export.test.mjs — PNG iTXt metadata 注入的單元測試（純函式部分）。
// canvas→PNG→下載段需瀏覽器 API（canvas/Image/URL），押在 push 前的實機實測，此處不涵蓋。
// 重點：crc32 正確性（以 IEND 標準 CRC 常數 0xAE426082 為獨立錨點）、iTXt chunk 插在 IEND 之前、
// keyword 與 UTF-8 text（含中文／emoji）可 round-trip 解回、長度增量精確。
import test from 'node:test';
import assert from 'node:assert/strict';
import { injectPngText } from '../../assets/js/core/core-export.js';

// 獨立參考 crc32（PNG/zlib 標準；與被測模組各自實作，互為 oracle）。
function refCrc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) {
    c ^= bytes[i];
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

const enc = new TextEncoder();
const dec = new TextDecoder();
const u32 = (b, o) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;

// 在 haystack 中找 needle 位元組序列的起點（-1 表示找不到）。
function indexOfBytes(haystack, needle) {
  outer: for (let i = 0; i <= haystack.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) if (haystack[i + j] !== needle[j]) continue outer;
    return i;
  }
  return -1;
}

// 最小合法 PNG：8-byte 簽名 + IHDR(13) + IEND(0)。IEND 的 CRC 恆為 0xAE426082。
function minimalPng() {
  return new Uint8Array([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,             // 簽名
    0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52,                        // IHDR length + type
    0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0,                      // IHDR data（1×1、RGBA）
    0, 0, 0, 0,                                                 // IHDR crc（測試不驗）
    0, 0, 0, 0, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82, // IEND
  ]);
}

test('refCrc32 oracle 自檢：IEND 的 CRC 為 PNG 標準常數 0xAE426082', () => {
  assert.equal(refCrc32(enc.encode('IEND')), 0xAE426082);
});

test('injectPngText：長度增量精確 = 12 + keyword + 5 + text（UTF-8 位元組）', () => {
  const png = minimalPng();
  const kw = 'hd-birth';
  const text = '{"name":"小明","place":"臺北"}';
  const out = injectPngText(png, kw, text);
  const expected = 12 + enc.encode(kw).length + 5 + enc.encode(text).length;
  assert.equal(out.length - png.length, expected);
});

test('injectPngText：iTXt chunk 插在 IEND chunk 之前', () => {
  const out = injectPngText(minimalPng(), 'k', 'v');
  const iTxtPos = indexOfBytes(out, enc.encode('iTXt'));
  const iEndPos = indexOfBytes(out, enc.encode('IEND'));
  assert.ok(iTxtPos > 0, 'iTXt 應存在');
  assert.ok(iEndPos > iTxtPos, 'IEND 應在 iTXt 之後');
});

test('injectPngText：keyword 與 UTF-8 text（中文＋emoji）可 round-trip 解回，且 CRC 欄位正確', () => {
  const kw = 'bazi';
  const text = '五行 🎴 中文 payload';
  const out = injectPngText(minimalPng(), kw, text);
  // 定位 iTXt chunk：length(4) type(4) data(length) crc(4)
  const typePos = indexOfBytes(out, enc.encode('iTXt'));
  const lenPos = typePos - 4;
  const dataLen = u32(out, lenPos);
  const dataStart = typePos + 4;
  const data = out.subarray(dataStart, dataStart + dataLen);

  // keyword：到第一個 \0
  const kwEnd = data.indexOf(0);
  assert.equal(dec.decode(data.subarray(0, kwEnd)), kw);
  // text：keyword\0 + compFlag + compMethod + langTag\0 + transKw\0 之後（共 5 個 0）
  const text2 = dec.decode(data.subarray(kwEnd + 5));
  assert.equal(text2, text);

  // CRC 欄位（type+data）以獨立 oracle 覆核 → 間接驗證模組內部 crc32 正確
  const crcField = u32(out, dataStart + dataLen);
  const crcInput = new Uint8Array(4 + dataLen);
  crcInput.set(enc.encode('iTXt'), 0);
  crcInput.set(data, 4);
  assert.equal(crcField, refCrc32(crcInput));
});

test('injectPngText：空 text 正常注入，round-trip 解回空字串', () => {
  const out = injectPngText(minimalPng(), 'hd-birth', '');
  const typePos = indexOfBytes(out, enc.encode('iTXt'));
  const dataLen = u32(out, typePos - 4);
  const data = out.subarray(typePos + 4, typePos + 4 + dataLen);
  const kwEnd = data.indexOf(0);
  assert.equal(dec.decode(data.subarray(0, kwEnd)), 'hd-birth');
  assert.equal(dec.decode(data.subarray(kwEnd + 5)), '');           // text 段為空
  assert.ok(indexOfBytes(out, enc.encode('IEND')) > typePos);        // 仍插在 IEND 前
});

test('injectPngText：無 IEND 的畸形輸入 → chunk 附加在末尾（固化 hd 版 fallback = png.length）', () => {
  // 只有簽名 + 一個非 IEND chunk，全域無 IEND；hd 版 findIENDOffset 掃不到時 fallback 回 png.length
  const noIend = new Uint8Array([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,       // 簽名
    0, 0, 0, 0, 0x49, 0x48, 0x44, 0x52, 0, 0, 0, 0,       // 空 IHDR + crc 佔位
  ]);
  let out;
  assert.doesNotThrow(() => { out = injectPngText(noIend, 'k', 'v'); });
  const typePos = indexOfBytes(out, enc.encode('iTXt'));
  assert.ok(typePos >= noIend.length, 'iTXt chunk 應附加在原 PNG 位元組之後（末尾）');
});
