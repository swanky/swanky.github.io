// core-export.js — 自我探索工具共用的 PNG 匯出管線（SVG 字串 → canvas → PNG → 下載）＋ iTXt metadata 注入。
// 三家（人類圖圖卡／八字命式卡／塔羅牌陣）原本各自拷貝一份幾乎相同的 canvas 尾段與 iTXt 機械碼，
// 此檔收斂為單一深模組：呼叫方只負責把自家 SVG 組成完整字串＋給出尺寸與選項，下載細節全在這裡。
// iTXt（crc32／IEND 定位）為純函式、不碰 DOM，可在 Node 直接測；downloadPngFromSvg 需瀏覽器（canvas/Image/URL）。

// ---- PNG iTXt metadata 注入（純 JS，無相依；不碰 DOM，可在 Node 直接測）----
// 把結構化資料（UTF-8 JSON）寫進下載 PNG 的一個 iTXt chunk，讓外部報告管線零打字直接消費。
// 設計與契約見 docs/plan-hd-png-birth-metadata.md（報告端 gen/ingest_png.py 解析同一鍵）。
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// 從尾端掃描 'IEND'（PNG 標準恆在末尾，掃描以求穩健），回傳其 length 欄位起點（type 前 4 bytes）。
function findIENDOffset(png) {
  for (let i = png.length - 8; i >= 8; i--) {
    if (png[i] === 0x49 && png[i + 1] === 0x45 && png[i + 2] === 0x4E && png[i + 3] === 0x44) return i - 4;
  }
  return png.length; // 理論上不會發生：找不到就附加在最後
}

// 在 IEND 前插入一個未壓縮 iTXt(UTF-8) chunk。keyword 須為 ASCII。回傳新的 Uint8Array。
export function injectPngText(png, keyword, text) {
  const enc = new TextEncoder();
  const kw = enc.encode(keyword);   // ASCII keyword（與 Latin-1 同碼位）
  const txt = enc.encode(text);     // UTF-8 文字（中文出生地安全）
  // iTXt data：keyword \0 compFlag(0) compMethod(0) langTag \0 transKeyword \0 text(UTF-8)
  const data = new Uint8Array(kw.length + 5 + txt.length);
  let o = 0;
  data.set(kw, o); o += kw.length;
  data[o++] = 0;  // keyword 結尾 null
  data[o++] = 0;  // compression flag = 0（未壓縮）
  data[o++] = 0;  // compression method = 0
  data[o++] = 0;  // language tag = "" 結尾 null
  data[o++] = 0;  // translated keyword = "" 結尾 null
  data.set(txt, o);

  const type = enc.encode('iTXt');
  const chunk = new Uint8Array(8 + data.length + 4);
  const dv = new DataView(chunk.buffer);
  dv.setUint32(0, data.length, false);          // length（big-endian）
  chunk.set(type, 4);
  chunk.set(data, 8);
  const crcInput = new Uint8Array(4 + data.length);
  crcInput.set(type, 0);
  crcInput.set(data, 4);
  dv.setUint32(8 + data.length, crc32(crcInput), false); // CRC over type+data

  const iend = findIENDOffset(png);
  const out = new Uint8Array(png.length + chunk.length);
  out.set(png.subarray(0, iend), 0);
  out.set(chunk, iend);
  out.set(png.subarray(iend), iend + chunk.length);
  return out;
}

// ---- PNG 匯出（SVG 字串 → canvas → PNG → 觸發下載；需瀏覽器環境）----
// svg：完整 SVG 字串（呼叫方負責組好、含 xmlns）；width/height：SVG 邏輯尺寸（canvas 再乘 scale）。
// scale 一律 clamp ≤2（沿用 hd 行為）；background：canvas 底色，drawImage 前填一次
// （hd/tarot=#fff、bazi=#fffaf0）。**background 傳 falsy（null/false/''）＝透明輸出**：略過 fillRect，
// 保留 canvas 透明像素、輸出 PNG 帶 alpha（人類圖 v2 透明卡用）。既有呼叫方皆傳實色，行為不變。
// itxt={keyword, json}（json 為物件，內部 JSON.stringify）時注入 metadata，null 則不注入。
// 注入失敗不致命：仍下載無 metadata 版並 console.warn（畫面字幕本身已可讀）。
export function downloadPngFromSvg({
  svg, width, height,
  scale = 2,
  background = '#fff',
  filename = 'export.png',
  itxt = null,
  onError = null,
}) {
  const s = Math.min(scale || 2, 2);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width * s;
    canvas.height = height * s;
    const ctx = canvas.getContext('2d');
    // background falsy（null/false/''）＝透明：略過填色，保留透明像素（PNG 帶 alpha）。
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob(async (out) => {
      let outBlob = out;
      // 把 payload 寫進 PNG metadata（可被報告端零打字消費）。注入失敗不致命：仍下載原圖。
      if (itxt) {
        try {
          const bytes = new Uint8Array(await out.arrayBuffer());
          const withMeta = injectPngText(bytes, itxt.keyword, JSON.stringify(itxt.json));
          outBlob = new Blob([withMeta], { type: 'image/png' });
        } catch (e) {
          console.warn('[export] PNG metadata 注入失敗，下載無 metadata 版本：', e);
        }
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(outBlob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    if (onError) onError();
  };
  img.src = url;
}

// ---- SVG 原始向量檔下載（完整 SVG 字串 → .svg blob）----
// 給需要下載向量原檔的呼叫方（人類圖 v2 匯出四式之一）。純瀏覽器（Blob/URL/anchor），不碰 canvas。
export function downloadSvgString({ svg, filename = 'export.svg' }) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
