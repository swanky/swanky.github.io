#!/usr/bin/env node
// 古典小說全文搜尋的離線索引產生器（docs/novel-platform/architecture.md §9 Phase 7）。
//
// 用法：node tools/build_search_index.mjs [--check]
//   （無參數）寫出 assets/search/ 下的索引檔
//   --check   只重算不寫檔，比對磁碟上的檔案是否與重算結果一致（漂移檢查）
//
// 設計決策（T8 第一階段實測結論）：
//   - 分書分版一支檔（architecture.md §46：不可把五本書全文一次送進瀏覽器）；前端按需取用。
//   - 不建倒排索引：實測倒排方案下載量是純掃描的 3.2 倍（3530K vs 1114K gzip），
//     只把單次查詢從 0.22ms 縮到 0.02ms；而且結果摘要照樣需要段落原文，索引是純加法。
//     最大單版 3758 段落線性掃描最壞 0.53ms，全七版合掃 2.8ms——瓶頸是下載不是計算。
//   - 不分片：實測分片後全片合計反而比單檔大（gzip 字典被切斷），而全書搜尋等於要下載所有片。
//
// 抽取契約：
//   - 只認 <p id="p-{章回三位}-{段序四位}"> 的段落。章回檔內其他 <p>（例如庚辰本回末
//     批語區塊的說明段）刻意不進索引——那是批語不是正文。
//   - 段序不連續也不從 1 開始是正常的（_books 章回檔的 0001 是回目，不是 <p>），
//     前端只把它當不透明的錨點值。
//   - 章回頁網址規則（主版本省略版本段）由 _data/books.yml 的 primary_edition 決定，
//     算好放進每支檔的 base 欄位；前端絕不重算這條規則。

import fs from 'node:fs';
import path from 'node:path';
import { parseYamlSequence } from './lib/mini-yaml.mjs';

export const BOOKS_YML = '_data/books.yml';
export const OUT_DIR = 'assets/search';
export const INDEX_FILE = `${OUT_DIR}/index.json`;

// 章回檔的來源目錄與檔名前綴。金瓶梅是旗艦子站，章回檔在自己的 collection；
// 其餘四書共用通用層的 _books collection，檔名為 {book}-{edition}-{NNN}.html。
const FLAGSHIP_SOURCES = {
  jinpingmei: { dir: '_jinpingmei', prefix: { wanli: '', chongzhen: 'chongzhen-' } },
};

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 版本清單（books.yml 順序）：每筆帶來源目錄、檔名比對式與網址前綴。 */
export function editionSources(books) {
  const out = [];
  for (const b of books) {
    for (const ed of b.editions || []) {
      if (!ed.imported_chapters) continue; // planned／尚未匯入的版本沒有章回檔
      const flagship = FLAGSHIP_SOURCES[b.id];
      const dir = flagship ? flagship.dir : '_books';
      const prefix = flagship ? flagship.prefix[ed.id] : `${b.id}-${ed.id}-`;
      if (prefix === undefined) throw new Error(`${b.id}/${ed.id}：旗艦來源沒有登記檔名前綴`);
      const isPrimary = ed.id === b.primary_edition;
      out.push({
        book: b.id,
        book_title: b.title,
        edition: ed.id,
        edition_label: ed.label,
        primary: isPrimary,
        base: isPrimary ? `/${b.id}/text/` : `/${b.id}/text/${ed.id}/`,
        key: `${b.id}-${ed.id}`,
        dir,
        prefix,
        match: new RegExp(`^${escapeRe(prefix)}(\\d{3})\\.html$`),
      });
    }
  }
  return out;
}

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

const ENTITIES = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  "&#39;": "'",
  "&apos;": "'",
  '&nbsp;': ' ',
};

/**
 * 段落 HTML → 索引用純文字。
 * 先去標籤（<br> 等行內標籤只留文字），再還原字元實體，最後把全形空白與連續空白
 * 摺成單一半形空格。**不改動任何一個文字**——摺空白之外不做任何替換。
 */
export function normalizeText(html) {
  return String(html == null ? '' : html)
    .replace(/<[^>]+>/g, '')
    .replace(/&(?:lt|gt|quot|#39|apos|nbsp);/g, (m) => ENTITIES[m])
    .replace(/&amp;/g, '&')
    .replace(/[\s　]+/g, ' ')
    .trim();
}

/** 章回檔原始內容 → { chapter, label, couplet, paragraphs: [[seq, text, 章回位]] } */
export function extractChapter(raw) {
  const { fm, body } = parseFrontMatter(raw);
  const re = /<p id="p-(\d{3})-(\d{4})"[^>]*>([\s\S]*?)<\/p>/g;
  const paragraphs = [];
  let m;
  while ((m = re.exec(body)) !== null) {
    const text = normalizeText(m[3]);
    if (!text) continue;
    paragraphs.push([parseInt(m[2], 10), text, m[1]]);
  }
  return {
    chapter: fm.chapter === undefined ? null : parseInt(fm.chapter, 10),
    label: fm.label || '',
    couplet: fm.couplet || '',
    paragraphs,
  };
}

/** 一個版本 → 索引物件（章回依號碼排序，段落依段序排序）。 */
export function buildEdition(src) {
  const files = fs.readdirSync(src.dir)
    .filter((f) => src.match.test(f))
    .map((f) => ({ f, ch: parseInt(f.match(src.match)[1], 10) }))
    .sort((a, b) => a.ch - b.ch);
  if (!files.length) throw new Error(`${src.key}：在 ${src.dir} 找不到任何章回檔`);

  const chapters = [];
  for (const { f, ch } of files) {
    const raw = fs.readFileSync(path.join(src.dir, f), 'utf8');
    const info = extractChapter(raw);
    const c = String(ch).padStart(3, '0');
    for (const p of info.paragraphs) {
      if (p[2] !== c) throw new Error(`${src.dir}/${f}：段落 id 章回位 ${p[2]} 與檔名 ${c} 不符`);
    }
    if (info.chapter !== null && info.chapter !== ch) {
      throw new Error(`${src.dir}/${f}：front matter chapter=${info.chapter} 與檔名 ${c} 不符`);
    }
    chapters.push({
      c,
      l: info.label,
      t: info.couplet,
      ps: info.paragraphs.map(([seq, text]) => [seq, text]).sort((a, b) => a[0] - b[0]),
    });
  }
  return {
    book: src.book,
    book_title: src.book_title,
    edition: src.edition,
    edition_label: src.edition_label,
    base: src.base,
    chapters,
  };
}

/** 全部版本 → { editions: [{src, data}], index: 輕索引物件 }（純計算，不寫檔）。 */
export function buildAll() {
  const books = parseYamlSequence(fs.readFileSync(BOOKS_YML, 'utf8'));
  const sources = editionSources(books);
  const editions = sources.map((src) => ({ src, data: buildEdition(src) }));
  const index = {
    editions: editions.map(({ src, data }) => ({
      book: data.book,
      book_title: data.book_title,
      edition: data.edition,
      edition_label: data.edition_label,
      primary: src.primary,
      base: data.base,
      file: `/${OUT_DIR}/${src.key}.json`,
      chapters: data.chapters.length,
      paragraphs: data.chapters.reduce((n, ch) => n + ch.ps.length, 0),
      toc: data.chapters.map((ch) => [ch.c, ch.l, ch.t]),
    })),
  };
  return { editions, index };
}

/** 產物一律緊湊單行＋結尾換行：重跑必須逐位元組相同（不含時間戳）。 */
export function serialize(obj) {
  return `${JSON.stringify(obj)}\n`;
}

export function fileFor(key) {
  return `${OUT_DIR}/${key}.json`;
}

/** 讀檔並把 CRLF 正規化成 LF（見 --check 分支的說明）。 */
export function readNormalized(file) {
  return fs.readFileSync(file, 'utf8').split('\r\n').join('\n');
}

function main() {
  const check = process.argv.includes('--check');
  const { editions, index } = buildAll();
  const targets = [
    ...editions.map(({ src, data }) => ({ file: fileFor(src.key), text: serialize(data) })),
    { file: INDEX_FILE, text: serialize(index) },
  ];

  if (check) {
    const drift = [];
    for (const t of targets) {
      if (!fs.existsSync(t.file)) { drift.push(`${t.file}：不存在`); continue; }
      // 讀取端正規化換行：repo 開了 core.autocrlf，乾淨 clone 會把產物換成 CRLF，
      // 逐位元組比對會全紅。寫入端仍一律 LF，所以「重跑輸出穩定」的保證不變。
      if (readNormalized(t.file) !== t.text) drift.push(`${t.file}：內容與重算結果不一致`);
    }
    if (drift.length) {
      console.error('索引已漂移，請重跑 node tools/build_search_index.mjs：');
      for (const d of drift) console.error(`  ${d}`);
      process.exit(1);
    }
    console.log(`索引檢查通過：${targets.length} 支檔案與章回原文一致`);
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  let total = 0;
  for (const { src, data } of editions) {
    const file = fileFor(src.key);
    const text = serialize(data);
    fs.writeFileSync(file, text, 'utf8');
    const paras = data.chapters.reduce((n, ch) => n + ch.ps.length, 0);
    total += paras;
    console.log(
      `${src.key.padEnd(26)} ${String(data.chapters.length).padStart(3)} 回`
      + ` ${String(paras).padStart(5)} 段`
      + ` ${(Buffer.byteLength(text) / 1048576).toFixed(2).padStart(5)} MB  → ${file}`,
    );
  }
  const indexText = serialize(index);
  fs.writeFileSync(INDEX_FILE, indexText, 'utf8');
  const tocChapters = index.editions.reduce((n, e) => n + e.chapters, 0);
  console.log(
    `${'index（回目輕索引）'.padEnd(20)} ${String(tocChapters).padStart(3)} 回`
    + `        ${(Buffer.byteLength(indexText) / 1024).toFixed(0).padStart(4)} KB  → ${INDEX_FILE}`,
  );
  console.log(`合計 ${editions.length} 個版本、${total} 個段落`);
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) main();
