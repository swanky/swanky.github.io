#!/usr/bin/env node
// 抽取章回段落索引，供「本回節點」錨點資料的生成（AI 讀索引不讀全文）與驗證使用。
// 用法：node tools/build_book_anchor_index.mjs <book-key> <輸出目錄> [--batch=15]
// 輸出：<輸出目錄>/<book-key>/batch-NN.txt（緊湊索引，每批 N 回）
//
// 段落定位契約（chapter-anchors.js 與 tests/book-anchors.test.mjs 依同一契約）：
// - idMode 'id'：_books 章檔每段已有 id="p-{ch}-{seq}"，p 鍵＝seq 數字（getElementById 定位）。
// - idMode 'nth'：_jinpingmei 章檔無 id，p 鍵＝文檔序 1-based（第 N 個 <p>）。

import fs from 'node:fs';
import path from 'node:path';

export const BOOKS = {
  'jinpingmei-wanli':        { dir: '_jinpingmei', match: /^(\d{3})\.html$/,                          idMode: 'nth', guide: '_data/jinpingmei_guide.yml' },
  'jinpingmei-chongzhen':    { dir: '_jinpingmei', match: /^chongzhen-(\d{3})\.html$/,                idMode: 'nth', guide: '_data/jinpingmei_guide.yml' },
  'shuihu-gutenberg-23863':  { dir: '_books',      match: /^shuihu-gutenberg-23863-(\d{3})\.html$/,   idMode: 'id' },
  'sanguo-gutenberg-23950':  { dir: '_books',      match: /^sanguo-gutenberg-23950-(\d{3})\.html$/,   idMode: 'id' },
  'xiyou-gutenberg-23962':   { dir: '_books',      match: /^xiyou-gutenberg-23962-(\d{3})\.html$/,    idMode: 'id' },
  'honglou-wikisource-120':  { dir: '_books',      match: /^honglou-wikisource-120-(\d{3})\.html$/,   idMode: 'id' },
  'honglou-gengchen-78':     { dir: '_books',      match: /^honglou-gengchen-78-(\d{3})\.html$/,      idMode: 'id' },
};

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^"|"$/g, '');
  }
  return { fm, body: raw.slice(m[0].length) };
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, '').trim();
}

// 回傳 [{p, text}]：p 依 idMode 為 seq 數字或文檔序；text 為去標籤全文。
export function extractParagraphs(raw, idMode) {
  const { body } = parseFrontMatter(raw);
  const out = [];
  const re = /<p(?:\s+id="p-\d+-(\d+)")?\s*>([\s\S]*?)<\/p>/g;
  let m, nth = 0;
  while ((m = re.exec(body)) !== null) {
    nth += 1;
    const p = idMode === 'id' ? (m[1] ? parseInt(m[1], 10) : NaN) : nth;
    out.push({ p, text: stripTags(m[2]) });
  }
  return out;
}

export function loadChapterFile(bookKey, chapter) {
  const cfg = BOOKS[bookKey];
  if (!cfg) throw new Error(`unknown book key: ${bookKey}`);
  const files = fs.readdirSync(cfg.dir).filter((f) => cfg.match.test(f));
  const target = files.find((f) => parseInt(f.match(cfg.match)[1], 10) === chapter);
  if (!target) return null;
  return fs.readFileSync(path.join(cfg.dir, target), 'utf8');
}

function loadGuideHighlights(guidePath) {
  // 抽 _data/jinpingmei_guide.yml 的 common.cN.highlights（免依賴、格式固定）。
  const raw = fs.readFileSync(guidePath, 'utf8');
  const map = {};
  const common = raw.split(/^wanli:|^chongzhen:/m)[0];
  const blocks = common.split(/^ {2}(c\d+):/m);
  for (let i = 1; i < blocks.length; i += 2) {
    const key = blocks[i];
    const hl = [];
    const hlSec = blocks[i + 1].match(/highlights:\r?\n((?: {6}- ".*"\r?\n?)+)/);
    if (hlSec) for (const line of hlSec[1].matchAll(/- "(.*)"/g)) hl.push(line[1]);
    map[key] = hl;
  }
  return map;
}

function main() {
  const [bookKey, outRoot] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const batchArg = process.argv.find((a) => a.startsWith('--batch='));
  const batchSize = batchArg ? parseInt(batchArg.split('=')[1], 10) : 15;
  const cfg = BOOKS[bookKey];
  if (!cfg || !outRoot) {
    console.error('用法：node tools/build_book_anchor_index.mjs <book-key> <輸出目錄> [--batch=15]');
    console.error('book-key 可選：' + Object.keys(BOOKS).join(', '));
    process.exit(1);
  }
  const guideHl = cfg.guide && fs.existsSync(cfg.guide) ? loadGuideHighlights(cfg.guide) : {};
  const files = fs.readdirSync(cfg.dir).filter((f) => cfg.match.test(f))
    .map((f) => ({ f, ch: parseInt(f.match(cfg.match)[1], 10) }))
    .filter((x) => x.ch >= 1)
    .sort((a, b) => a.ch - b.ch);

  const outDir = path.join(outRoot, bookKey);
  fs.mkdirSync(outDir, { recursive: true });
  let batch = [], batchNo = 0, written = [];
  const flush = () => {
    if (!batch.length) return;
    batchNo += 1;
    const p = path.join(outDir, `batch-${String(batchNo).padStart(2, '0')}.txt`);
    fs.writeFileSync(p, batch.join('\n'), 'utf8');
    written.push(p);
    batch = [];
  };
  for (const { f, ch } of files) {
    const raw = fs.readFileSync(path.join(cfg.dir, f), 'utf8');
    const { fm } = parseFrontMatter(raw);
    const paras = extractParagraphs(raw, cfg.idMode);
    const lines = [`== c${ch} ${fm.label || ''}｜${fm.couplet || ''}｜${paras.length}段`];
    const hl = guideHl[`c${ch}`];
    if (hl && hl.length) lines.push(`[看點] ${hl.join(' / ')}`);
    for (const { p, text } of paras) {
      lines.push(`${p}|${text.length}|${text.slice(0, 45)}`);
    }
    lines.push('');
    batch.push(lines.join('\n'));
    if (batch.length >= batchSize) flush();
  }
  flush();
  console.log(`${bookKey}: ${files.length} 回 → ${written.length} 批`);
  for (const p of written) console.log('  ' + p);
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) main();
