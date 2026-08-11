/**
 * 通用章回匯入器：content/<book>/editions/<edition>/ → _books/<book>-<edition>-<NNN>.html
 *
 * 與 tools/build_jinpingmei_chapters.py 的差別（刻意改掉的三件事）：
 *   1. 來源在 repo 內（content/），不是本機外部路徑——可重建、可版本控制
 *   2. 寫入段落 ID（PLAN.md §10／TASK-005），金瓶梅目前沒有
 *   3. front matter 帶 text_sha256，讓 npm test 能驗「原文一字未改」（PLAN.md §56）
 *
 * 用法：node tools/import_book_chapters.mjs <book_id> [edition_id]
 * 冪等：重跑輸出相同。輸出檔一律整批覆寫——**_books/ 底下的檔案不可手改**。
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { parseYamlSequence } from './lib/mini-yaml.mjs';

const [bookId, editionArg] = process.argv.slice(2);
if (!bookId) { console.error('用法：node tools/import_book_chapters.mjs <book_id> [edition_id]'); process.exit(1); }

const books = parseYamlSequence(readFileSync('_data/books.yml', 'utf8'));
const book = books.find((b) => b.id === bookId);
if (!book) throw new Error(`_data/books.yml 沒有 id=${bookId}`);
const editionId = editionArg || book.primary_edition;
const edition = book.editions.find((e) => e.id === editionId);
if (!edition) throw new Error(`${bookId} 沒有 edition=${editionId}`);
const isPrimary = editionId === book.primary_edition;

const srcDir = join('content', bookId, 'editions', editionId);
const index = JSON.parse(readFileSync(join(srcDir, 'chapter_index.json'), 'utf8'));

const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
const pad3 = (n) => String(n).padStart(3, '0');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const yq = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

/** 段落切割：以空行為界（與 tools/stage_shuihu_pilot.mjs 同規則，段數已交叉驗證過）。 */
export const splitParagraphs = (text) =>
  text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/**
 * 把一個原文段落拆成「語意行」。
 *
 * 素材的換行有兩種，必須分開處理，否則詩詞會被壓成一行：
 *   - 硬換行：Gutenberg 固定行寬造成，續行頂格（無縮排）→ 接回上一行
 *   - 語意換行：詩句、唱詞，每行都有縮排 → 各自成行
 * 中文無詞間空格，接合不產生語意變化；儲存層（content/）逐位元組不動。
 */
export function logicalLines(block) {
  const out = [];
  block.split('\n').forEach((line, i) => {
    if (i === 0 || /^[\s　]/.test(line)) out.push(line.trim());
    else out[out.length - 1] += line.trim();
  });
  return out.filter(Boolean);
}

/** 回目 heading 拆成 label（第一回／楔子）與 couplet（對句）。 */
function splitHeading(heading) {
  const h = heading.trim();
  const i = h.search(/[\s　]/);
  if (i === -1) return { label: h, couplet: '' };
  return { label: h.slice(0, i), couplet: h.slice(i).replace(/^[\s　]+/, '') };
}

mkdirSync('_books', { recursive: true });
// 先清掉本 (book, edition) 的舊輸出，避免縮小匯入範圍時留下孤兒檔
const prefix = `${bookId}-${editionId}-`;
for (const f of readdirSync('_books')) if (f.startsWith(prefix)) unlinkSync(join('_books', f));

const written = [];
for (const entry of index) {
  const pad = pad3(entry.chapter);
  const text = readFileSync(join(srcDir, entry.path), 'utf8').replace(/\r\n/g, '\n');

  const hash = sha256(text);
  if (hash !== entry.text_sha256) throw new Error(`${entry.path} hash 不符 chapter_index.json——原文可能被改動`);

  const paras = splitParagraphs(text);
  if (paras.length !== entry.paragraph_count) throw new Error(`${entry.path} 段數 ${paras.length} ≠ index 記錄 ${entry.paragraph_count}`);
  if (paras[0].replace(/[\s　]/g, '') !== entry.heading.replace(/[\s　]/g, '')) {
    throw new Error(`${entry.path} 第一段不是回目 heading，匯入規則（p0001＝回目、不進正文）不成立`);
  }

  const { label, couplet } = splitHeading(entry.heading);
  // p0001 是回目本身，由 layout 當標題渲染，不重複進正文；正文從 p0002 起，
  // 編號沿用素材包的正典序號，才對得回 content/ 與未來的段落級引用。
  const body = paras.slice(1)
    .map((p, i) => `<p id="p-${pad}-${String(i + 2).padStart(4, '0')}">${logicalLines(p).map(esc).join('<br>')}</p>`)
    .join('\n');

  const urlEd = isPrimary ? '' : `${editionId}/`;
  const permalink = `/${bookId}/text/${urlEd}${pad}/`;
  const desc = `《${book.title}》${label}原文全文（${edition.label}）${couplet ? `：${couplet}` : ''}。`;

  const fm = [
    '---',
    'layout: book-chapter',
    `book_id: ${bookId}`,
    `edition_id: ${editionId}`,
    `chapter: ${entry.chapter}`,
    `label: ${yq(label)}`,
    `couplet: ${yq(couplet)}`,
    `title: ${yq(entry.heading.trim())}`,
    `permalink: ${yq(permalink)}`,
    `description: ${yq(desc)}`,
    `paragraph_count: ${entry.paragraph_count}`,
    `text_sha256: ${entry.text_sha256}`,
    `source_url: ${yq(edition.source_page)}`,
    '---',
  ].join('\n');

  const out = join('_books', `${prefix}${pad}.html`);
  writeFileSync(out, `${fm}\n${body}\n`, 'utf8');
  written.push({ out, chapter: entry.chapter, label, paras: paras.length - 1, permalink });
}

console.log(`匯入 ${written.length} 篇 → _books/（${book.title}・${edition.label}）`);
for (const w of written) console.log(`  ${w.permalink}  ${w.label}  正文 ${w.paras} 段`);
const declared = edition.imported_chapters;
if (declared !== written.length) {
  console.error(`\n✗ _data/books.yml 的 imported_chapters=${declared} 與實際匯入 ${written.length} 篇不符——請更新註冊表`);
  process.exit(1);
}
console.log(`imported_chapters=${declared} 與實際一致`);
