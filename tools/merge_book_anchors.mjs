#!/usr/bin/env node
// 合併「本回節點」錨點片段 → 對每一筆機械核對章檔真的有那個段落 → 寫 _data/book_anchors/<book-key>.json。
// 用法：node tools/merge_book_anchors.mjs <book-key> <片段目錄>
//
// 片段格式（片段目錄下每個 *.json）：{"cN": [{"p": 5, "t": "標籤"}, ...], "cM": [...]}
// agent 端只需要給 p（段序，契約見 tools/build_book_anchor_index.mjs）與 t（≤12 全形字標籤）；
// k（段落前綴，供瀏覽器端 drift 偵測）一律由本腳本從章檔第 p 段機械算出——agent 若在片段裡
//夾帶 k 一律忽略，避免手抄造成的前綴錯誤流進資料檔。
//
// 同一回號在不同片段檔重複出現＝後檔覆蓋前檔並警告（檔名先排序，順序穩定可重現）。
// 任何一筆對不到章檔段落，或同一回內 p 有重複，就列出全部錯誤、不寫檔、exit 1。

import fs from 'node:fs';
import path from 'node:path';
import { BOOKS, extractParagraphs, loadChapterFile } from './build_book_anchor_index.mjs';

// 正規化前綴（code point 計，避免代理對字元被切一半）；merge 腳本與 tests/book-anchors.test.mjs
// 共用同一顆函式，兩邊的 k 計算方式不可能各說各話。
export function prefix10(text) {
  return [...(text || '')].slice(0, 10).join('');
}

function loadFragments(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  if (!files.length) throw new Error(`片段目錄裡沒有任何 *.json：${dir}`);
  const merged = {}; // cN -> [{p, t}]（不收 fragment 裡任何多餘欄位，含誤帶的 k）
  for (const f of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const [ch, list] of Object.entries(raw)) {
      if (merged[ch]) console.warn(`[merge_book_anchors] ${ch} 在 ${f} 重複出現，後檔覆蓋前檔`);
      merged[ch] = list.map((a) => ({ p: a.p, t: a.t }));
    }
  }
  return merged;
}

function buildChapter(bookKey, idMode, ch, items, errors) {
  const chapterNum = parseInt(ch.slice(1), 10);
  const raw = loadChapterFile(bookKey, chapterNum);
  if (raw == null) {
    for (const a of items) errors.push(`${ch}/p${a.p}：找不到第 ${chapterNum} 回的章檔`);
    return [];
  }
  const paras = extractParagraphs(raw, idMode);
  const sorted = items.slice().sort((x, y) => x.p - y.p);
  const list = [];
  let lastP = null;
  for (const a of sorted) {
    if (a.p === lastP) {
      errors.push(`${ch}/p${a.p}：同一回內重複的段序`);
      continue;
    }
    lastP = a.p;
    const para = paras.find((x) => x.p === a.p);
    if (!para) {
      errors.push(`${ch}/p${a.p}：章檔中找不到這個段序（共 ${paras.length} 段）`);
      continue;
    }
    list.push({ p: a.p, k: prefix10(para.text), t: a.t });
  }
  return list;
}

function main() {
  const [bookKey, fragDir] = process.argv.slice(2);
  if (!bookKey || !fragDir || !BOOKS[bookKey]) {
    console.error('用法：node tools/merge_book_anchors.mjs <book-key> <片段目錄>');
    console.error('book-key 可選：' + Object.keys(BOOKS).join(', '));
    process.exit(1);
  }

  const merged = loadFragments(fragDir);
  const errors = [];
  const out = {};
  const chapterKeys = Object.keys(merged).sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));

  for (const ch of chapterKeys) {
    out[ch] = buildChapter(bookKey, BOOKS[bookKey].idMode, ch, merged[ch], errors);
  }

  if (errors.length) {
    console.error(`發現 ${errors.length} 項錯誤，未寫檔：`);
    for (const e of errors) console.error('  - ' + e);
    process.exit(1);
  }

  const outPath = path.join('_data', 'book_anchors', `${bookKey}.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`已寫入 ${outPath}（${chapterKeys.length} 回）`);
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) main();
