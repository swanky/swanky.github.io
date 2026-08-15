#!/usr/bin/env node
// 錨點確證包：給每個候選錨點附上「前一段＋本段」完整原文，供確證 agent 逐錨核實。
// 動機：索引法（只看段首 45 字）有系統性「標籤晚一段」風險——事件在前段結束、錨落在轉場段。
// 用法：node tools/build_anchor_verify_pack.mjs <book-key> <fragment目錄> <輸出目錄>
// 輸出：<輸出目錄>/<book-key>/verify-NN.txt（與 fragment 檔一一對應）

import fs from 'node:fs';
import path from 'node:path';
import { BOOKS, extractParagraphs, loadChapterFile } from './build_book_anchor_index.mjs';

const [bookKey, fragDir, outRoot] = process.argv.slice(2);
const cfg = BOOKS[bookKey];
if (!cfg || !fragDir || !outRoot) {
  console.error('用法：node tools/build_anchor_verify_pack.mjs <book-key> <fragment目錄> <輸出目錄>');
  process.exit(1);
}

const outDir = path.join(outRoot, bookKey);
fs.mkdirSync(outDir, { recursive: true });

const frags = fs.readdirSync(fragDir).filter((f) => f.endsWith('.json')).sort();
const paraCache = new Map();
function parasOf(chapter) {
  if (!paraCache.has(chapter)) {
    const raw = loadChapterFile(bookKey, chapter);
    paraCache.set(chapter, raw ? extractParagraphs(raw, cfg.idMode) : null);
  }
  return paraCache.get(chapter);
}

for (const f of frags) {
  const data = JSON.parse(fs.readFileSync(path.join(fragDir, f), 'utf8'));
  const lines = [];
  const chapters = Object.keys(data).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  for (const cKey of chapters) {
    const ch = parseInt(cKey.slice(1), 10);
    const paras = parasOf(ch);
    if (!paras) { console.error(`章檔缺失：${cKey}`); process.exit(1); }
    lines.push(`==== ${cKey}（全回共 ${paras.length} 段，段號清單：${paras.map(x => x.p).join(',')}）`);
    for (const a of data[cKey]) {
      const i = paras.findIndex((x) => x.p === a.p);
      if (i === -1) { console.error(`${cKey} p=${a.p} 不存在`); process.exit(1); }
      lines.push(`[錨] ${cKey} p=${a.p} t=${a.t}`);
      if (i > 0) lines.push(`[前段 p=${paras[i - 1].p}] ${paras[i - 1].text}`);
      lines.push(`[本段 p=${a.p}] ${paras[i].text}`);
      lines.push('');
    }
  }
  const out = path.join(outDir, f.replace(/^batch-(\d+)\.json$/, 'verify-$1.txt'));
  fs.writeFileSync(out, lines.join('\n'), 'utf8');
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`${f} → ${path.basename(out)}（${kb} KB）`);
}
