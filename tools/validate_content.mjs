/**
 * 古典小說平台的內容驗證器（PLAN.md §4/§56/§57）。
 *
 * 驗三件事：
 *   1. schema —— _data/books.yml 對 schema/book.schema.json、_books/*.html front matter 對 chapter.schema.json
 *   2. 註冊表一致性 —— primary_edition 存在、book_id/edition_id 有登記、章回不重號不跳號、imported_chapters 正確
 *   3. 原文完整性 —— 每篇的 text_sha256 對得上 content/ 的 staged 原檔，且渲染出的每一段逐字等於原檔的對應段
 *
 * 第 3 項是防「AI 悄悄改字」的核心防線：頁面上的字只要與 content/ 的原文差一個字就會失敗。
 *
 * 用法：node tools/validate_content.mjs（獨立跑，印報告）
 *      也被 tests/book-platform.test.mjs 匯入，納入 npm test
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseYamlSequence } from './lib/mini-yaml.mjs';
import { validate } from './lib/mini-schema.mjs';

const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');

/** front matter 解析：只認 `key: value`，支援雙引號、單引號與裸值。 */
export function parseFrontMatter(raw) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw.replace(/\r\n/g, '\n'));
  if (!m) throw new Error('找不到 front matter');
  const data = {};
  for (const line of m[1].split('\n')) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
    const kv = /^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/.exec(line);
    if (!kv) throw new Error(`front matter 無法解析：${line}`);
    let v = kv[2].trim();
    if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) v = v.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    else if (v.startsWith("'") && v.endsWith("'") && v.length >= 2) v = v.slice(1, -1).replace(/''/g, "'");
    else if (/^-?\d+$/.test(v)) v = Number(v);
    data[kv[1]] = v;
  }
  return { data, body: m[2] };
}

/** 段落切割：與 tools/import_book_chapters.mjs 同規則。 */
const splitParagraphs = (text) =>
  text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/** 把 HTML 段落還原成純文字，供與原文逐字比對（去所有空白，中文比對不受排版影響）。 */
const plain = (html) => html
  .replace(/<br\s*\/?>/g, '')
  .replace(/<[^>]+>/g, '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/[\s　]/g, '');

export function validateContent() {
  const problems = [];
  const bad = (msg) => problems.push(msg);

  // ── 1. books.yml 對 book.schema.json ──────────────────────────
  const bookSchema = JSON.parse(readFileSync('schema/book.schema.json', 'utf8'));
  const chapterSchema = JSON.parse(readFileSync('schema/chapter.schema.json', 'utf8'));
  const books = parseYamlSequence(readFileSync('_data/books.yml', 'utf8'));

  const seenBookIds = new Set();
  for (const b of books) {
    for (const e of validate(bookSchema, b)) bad(`books.yml[${b.id || '?'}] ${e}`);
    if (seenBookIds.has(b.id)) bad(`books.yml: book id 重複 "${b.id}"`);
    seenBookIds.add(b.id);
    if (!b.editions.some((e) => e.id === b.primary_edition)) {
      bad(`books.yml[${b.id}]: primary_edition "${b.primary_edition}" 不在自己的 editions 裡`);
    }
    const seenEd = new Set();
    for (const e of b.editions) {
      if (seenEd.has(e.id)) bad(`books.yml[${b.id}]: edition id 重複 "${e.id}"`);
      seenEd.add(e.id);
      if (e.imported_chapters === undefined) bad(`books.yml[${b.id}/${e.id}]: 缺 imported_chapters（收錄進度必須誠實記錄）`);
      else if (e.imported_chapters > e.chapter_count + 1) bad(`books.yml[${b.id}/${e.id}]: imported_chapters ${e.imported_chapters} 超過 chapter_count+1（卷首）`);
    }
    // 有 flagship_url 的作品走專屬子站，不該有 _books 章回；status 也不該是 pilot
    if (b.flagship_url && !b.flagship_url.startsWith('/')) bad(`books.yml[${b.id}]: flagship_url 必須是站內絕對路徑`);
  }
  const byId = new Map(books.map((b) => [b.id, b]));

  // ── 2+3. _books/*.html ────────────────────────────────────────
  const files = existsSync('_books') ? readdirSync('_books').filter((f) => f.endsWith('.html')).sort() : [];
  /** @type {Map<string, number[]>} `${book}/${edition}` → 章回號 */
  const groups = new Map();

  for (const f of files) {
    const path = join('_books', f);
    let fm;
    try { fm = parseFrontMatter(readFileSync(path, 'utf8')); } catch (e) { bad(`${path}: ${e.message}`); continue; }
    const { data, body } = fm;

    for (const e of validate(chapterSchema, data)) bad(`${path} ${e}`);

    const book = byId.get(data.book_id);
    if (!book) { bad(`${path}: book_id "${data.book_id}" 不在 _data/books.yml`); continue; }
    const edition = book.editions.find((e) => e.id === data.edition_id);
    if (!edition) { bad(`${path}: edition_id "${data.edition_id}" 不在 ${data.book_id} 的 editions`); continue; }
    if (book.flagship_url) bad(`${path}: ${data.book_id} 有 flagship_url（走專屬子站），不該同時出現在 _books/`);

    const key = `${data.book_id}/${data.edition_id}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(data.chapter);

    // 檔名與 permalink 必須與 front matter 一致（避免改了一處忘了另一處）
    const pad = String(data.chapter).padStart(3, '0');
    const expectFile = `${data.book_id}-${data.edition_id}-${pad}.html`;
    if (f !== expectFile) bad(`${path}: 檔名應為 ${expectFile}`);
    const isPrimary = data.edition_id === book.primary_edition;
    const expectLink = `/${data.book_id}/text/${isPrimary ? '' : `${data.edition_id}/`}${pad}/`;
    if (data.permalink !== expectLink) bad(`${path}: permalink 應為 ${expectLink}，實際 ${data.permalink}`);

    // ── 原文完整性 ──
    const srcPath = join('content', data.book_id, 'editions', data.edition_id, 'chapters', `${pad}.txt`);
    if (!existsSync(srcPath)) { bad(`${path}: 找不到 staged 原文 ${srcPath}`); continue; }
    const srcText = readFileSync(srcPath, 'utf8').replace(/\r\n/g, '\n');

    if (sha256(srcText) !== data.text_sha256) bad(`${path}: text_sha256 對不上 ${srcPath}——原文或 front matter 被改動過`);

    const srcParas = splitParagraphs(srcText);
    if (srcParas.length !== data.paragraph_count) bad(`${path}: paragraph_count ${data.paragraph_count} ≠ 原文實際段數 ${srcParas.length}`);

    // 回目本身也是原文的一部分（原文第一段），front matter 不得與它不符
    const srcHeading = srcParas[0] || '';
    if (plain(data.title) !== plain(srcHeading)) {
      bad(`${path}: title 與原文回目不符\n    原文：${srcHeading}\n    front matter：${data.title}`);
    }
    // label＋couplet 必須拼回原文回目：頭尾都要對得上，中間允許少掉一個分隔符
    //（三國那份底本的回目是「第一回：上聯，下聯」，「：」不進 label 也不進 couplet）。
    // 這條守的是「不丟字、不造字」，不是守標點。
    const flatHeading = plain(srcHeading);
    const flatLabel = plain(data.label);
    const flatCouplet = plain(data.couplet);
    const gap = flatHeading.slice(flatLabel.length, flatHeading.length - flatCouplet.length);
    if (!flatHeading.startsWith(flatLabel) || !flatHeading.endsWith(flatCouplet)
        || flatLabel.length + flatCouplet.length > flatHeading.length || !/^[：:，,、]?$/.test(gap)) {
      bad(`${path}: label＋couplet 拼回來不等於原文回目\n    原文：${srcHeading}\n    拼回：${data.label}／${data.couplet}`);
    }

    const rendered = [...body.matchAll(/<p id="(p-\d{3}-\d{4})">([\s\S]*?)<\/p>/g)];
    // p0001 是回目，由 layout 當標題渲染，不進正文
    if (rendered.length !== srcParas.length - 1) {
      bad(`${path}: 正文段落數 ${rendered.length} ≠ 原文段數−1（${srcParas.length - 1}）`);
    }
    rendered.forEach(([, id, html], i) => {
      const expectId = `p-${pad}-${String(i + 2).padStart(4, '0')}`;
      if (id !== expectId) bad(`${path}: 第 ${i + 1} 段 id 應為 ${expectId}，實際 ${id}`);
      const src = srcParas[i + 1];
      if (src !== undefined && plain(html) !== plain(src)) {
        bad(`${path}: ${id} 內文與原文不符\n    原文：${plain(src).slice(0, 40)}…\n    頁面：${plain(html).slice(0, 40)}…`);
      }
    });
  }

  // ── 章回連號與收錄數 ──
  for (const [key, chapters] of groups) {
    const [bookId, editionId] = key.split('/');
    const sorted = [...chapters].sort((a, b) => a - b);
    if (new Set(sorted).size !== sorted.length) bad(`${key}: 章回號有重複 ${sorted.join(',')}`);
    const edition = byId.get(bookId)?.editions.find((e) => e.id === editionId);
    // 底本自己缺的回（庚辰本缺第 67 回）要先在 books.yml 宣告，才放行這個缺口；
    // 沒宣告的跳號一律視為匯入漏掉。
    const declaredMissing = new Set(edition?.missing_chapters || []);
    for (let i = 1; i < sorted.length; i += 1) {
      for (let n = sorted[i - 1] + 1; n < sorted[i]; n += 1) {
        if (!declaredMissing.has(n)) bad(`${key}: 第 ${n} 回不見了——底本真的缺這回就在 books.yml 的 missing_chapters 宣告，否則是匯入漏掉`);
      }
    }
    for (const n of declaredMissing) {
      if (sorted.includes(n)) bad(`books.yml[${key}]: missing_chapters 宣告缺第 ${n} 回，但 _books/ 裡有這一回`);
    }
    if (edition && edition.imported_chapters !== sorted.length) {
      bad(`books.yml[${key}]: imported_chapters ${edition.imported_chapters} ≠ _books 實際 ${sorted.length} 篇`);
    }
  }

  // 註冊表宣告有匯入、但 _books 找不到檔案
  for (const b of books) {
    if (b.flagship_url) continue;
    for (const e of b.editions) {
      if (e.imported_chapters > 0 && !groups.has(`${b.id}/${e.id}`)) {
        bad(`books.yml[${b.id}/${e.id}]: 宣告已收 ${e.imported_chapters} 篇，但 _books/ 沒有任何對應檔案`);
      }
    }
  }

  return { problems, bookCount: books.length, chapterFileCount: files.length, groups };
}

// 直接執行時印報告
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const { problems, bookCount, chapterFileCount, groups } = validateContent();
  console.log(`books.yml：${bookCount} 本｜_books/：${chapterFileCount} 篇`);
  for (const [key, ch] of groups) console.log(`  ${key}：${ch.length} 篇（第 ${Math.min(...ch)}–${Math.max(...ch)} 篇）`);
  if (problems.length) {
    console.error(`\n✗ ${problems.length} 項問題：`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log('\n✓ schema、註冊表一致性、原文完整性（hash＋逐段比對）全數通過');
}
