#!/usr/bin/env node
// 產生 _data/image_dimensions.json：文章與金瓶梅角色頁用到的站內圖片 → [寬, 高]。
// 版型（_includes/img-dimensions.html、_includes/flickr/source.html）在建置時查這張表，
// 替文章內文與封面的 <img> 補上 width／height，讓瀏覽器在圖片載入前先留好位置、版面不跳動。
// 正式站走 GitHub Pages 內建建置，不執行自訂 plugin，所以尺寸要先算好存成資料檔。
//
// 用法：
//   node tools/build-image-dimensions.mjs           重新產生資料檔（新增或換過文章圖片後跑一次）
//   node tools/build-image-dimensions.mjs --check   只檢查資料檔是否最新，不寫檔（過期時結束碼 1）
// 只讀圖片、不改圖片。忘了跑不會壞：查不到尺寸的圖只是不補寬高，維持原本的行為。
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSize } from './lib/image-size.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const DATA_FILE = '_data/image_dimensions.json';
// 會經過「補寬高」版型的內容來源。要擴大範圍就在這裡加目錄。
const SOURCE_DIRS = ['_posts', '_jinpingmei_characters'];
const IMAGE_PATH = /(?<=["'(\s:=])\/[^\s"'()<>{}|]+?\.(?:jpe?g|png|gif|webp|svg)(?=["')\s?#]|$)/gim;

function sourceFiles(dir) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full, { withFileTypes: true }).flatMap((entry) => {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return sourceFiles(rel);
    return /\.(md|markdown|html)$/i.test(entry.name) ? [rel] : [];
  });
}

/** 掃描內容來源，回傳 { '/站內路徑': [寬, 高] }，鍵依字母排序。 */
export function collectImageDimensions() {
  const found = new Map();
  for (const file of SOURCE_DIRS.flatMap(sourceFiles)) {
    for (const match of readFileSync(join(ROOT, file), 'utf8').matchAll(IMAGE_PATH)) {
      let path;
      try { path = decodeURI(match[0]); } catch { path = match[0]; }
      if (found.has(path)) continue;
      const full = join(ROOT, path.slice(1));
      if (!existsSync(full)) continue; // 站外圖、已搬走的圖：不補寬高
      let size = null;
      try { size = imageSize(full); } catch { size = null; }
      if (size && size[0] > 0 && size[1] > 0) found.set(path, size);
    }
  }
  return Object.fromEntries([...found].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

export function serialize(dimensions) {
  const lines = Object.entries(dimensions).map(([path, size]) => `  ${JSON.stringify(path)}: [${size[0]}, ${size[1]}]`);
  return `{\n${lines.join(',\n')}\n}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const fresh = serialize(collectImageDimensions());
  const target = join(ROOT, DATA_FILE);
  const current = existsSync(target) ? readFileSync(target, 'utf8').replace(/\r\n/g, '\n') : '';
  const count = fresh.split('\n').length - 3;
  if (process.argv.includes('--check')) {
    if (current !== fresh) {
      console.error(`${DATA_FILE} 不是最新的，請執行：node tools/build-image-dimensions.mjs`);
      process.exit(1);
    }
    console.log(`${DATA_FILE} 是最新的（${count} 張圖）。`);
  } else if (current === fresh) {
    console.log(`${DATA_FILE} 已是最新（${count} 張圖），沒有變更。`);
  } else {
    writeFileSync(target, fresh, 'utf8');
    console.log(`已更新 ${DATA_FILE}（${count} 張圖）。`);
  }
}
