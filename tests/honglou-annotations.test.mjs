/**
 * 「本回批語」區塊的契約測試（庚辰本抄本夾註最小可上線版）。
 *
 * 守四件事：
 *   1. 條數對得上資料——全書 4008 條、逐回筆數與 annotations/*.jsonl 一致
 *   2. 批語文字一字未改——把頁面上渲染出來的每一條還原回字串，與 jsonl 全量逐字比對
 *   3. 缺資料的回不留空殼——第 67 回底本本來就沒有（books.yml 已宣告），
 *      第 59 回有正文但沒抽到批語，兩者都不該出現批語區塊
 *   4. 正文沒被波及——段落 id 仍連號，批語區塊裡不得出現任何 <p id="p-…">
 *      （validate_content.mjs 與 book-platform.test.mjs 都靠這個格式數正文段落）
 */
import { strict as assert } from 'node:assert';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import {
  MARK_BEGIN, MARK_END, buildBlock, applyBlock, loadAnnotations, parseNote, reassemble,
} from '../tools/append_chapter_annotations.mjs';

const BOOK = 'honglou';
const EDITION = 'gengchen-78';
const ANN_DIR = `content/${BOOK}/editions/${EDITION}/annotations`;
const TOTAL_NOTES = 4008;
/** 底本自己就缺這回（books.yml 的 missing_chapters 已宣告），連正文都沒有 */
const MISSING_CHAPTER = 67;
/** 有正文但抽取器沒抽到任何批語的回——頁面上不該出現空的批語區塊 */
const NO_ANNOTATION_CHAPTERS = [59];

const chapterFiles = readdirSync('_books')
  .filter((f) => f.startsWith(`${BOOK}-${EDITION}-`) && f.endsWith('.html'))
  .sort();
const chapterOf = (f) => Number(f.match(/-(\d{3})\.html$/)[1]);
const read = (f) => readFileSync(`_books/${f}`, 'utf8').replace(/\r\n/g, '\n');

/** 取出批語區塊（沒有就回 null） */
function blockOf(text) {
  const b = text.indexOf(MARK_BEGIN);
  const e = text.indexOf(MARK_END);
  if (b === -1 || e === -1) return null;
  return text.slice(b, e + MARK_END.length);
}

/** 把渲染出來的一條批語還原成原始字串（escNote 的反向操作） */
const unescapeNote = (html) => html
  .replace(/<br>/g, '&lt;br&gt;')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

/** 從區塊裡讀出每一條 {id, tag, text} */
function itemsOf(block) {
  return [...block.matchAll(/<li class="bk-ann-item(?: bk-ann-item--plain)?" id="([^"]+)">([\s\S]*?)<\/li>/g)]
    .map(([, id, inner]) => {
      const src = /<span class="bk-ann-src">([\s\S]*?)<\/span>/.exec(inner);
      const txt = /<span class="bk-ann-text">([\s\S]*?)<\/span>/.exec(inner);
      assert.ok(txt, `${id} 的批語本文沒有渲染出來`);
      return {
        id,
        tag: src ? unescapeNote(src[1]) : null,
        text: unescapeNote(txt[1]),
      };
    });
}

test('資料檔本身：76 回、合計 4008 條批語', () => {
  const files = readdirSync(ANN_DIR).filter((f) => f.endsWith('.jsonl')).sort();
  assert.equal(files.length, 76);
  let total = 0;
  for (const f of files) total += loadAnnotations(BOOK, EDITION, Number(f.slice(0, 3))).length;
  assert.equal(total, TOTAL_NOTES, `批語總數應為 ${TOTAL_NOTES}`);
});

test('每一回頁面的批語條數與該回資料檔筆數相符，全書合計 4008', () => {
  let rendered = 0;
  let chaptersWithBlock = 0;
  for (const f of chapterFiles) {
    const rows = loadAnnotations(BOOK, EDITION, chapterOf(f)) || [];
    const block = blockOf(read(f));
    if (rows.length === 0) continue;
    assert.ok(block, `${f} 有 ${rows.length} 條批語資料，頁面卻沒有批語區塊`);
    const items = itemsOf(block);
    assert.equal(items.length, rows.length, `${f} 頁面 ${items.length} 條 ≠ 資料 ${rows.length} 條`);
    assert.match(block, new RegExp(`data-ann-count="${rows.length}"`), `${f} 的條數標示與資料不符`);
    assert.ok(block.includes(`共 ${rows.length} 條`), `${f} 摘要行的條數與資料不符`);
    assert.deepEqual(items.map((i) => i.id), rows.map((r) => r.id), `${f} 批語順序或編號與資料不符`);
    rendered += items.length;
    chaptersWithBlock += 1;
  }
  assert.equal(chaptersWithBlock, 76);
  assert.equal(rendered, TOTAL_NOTES);
});

test('批語文字一字未改——全部 4008 條逐字還原回資料檔原文', () => {
  let checked = 0;
  let plain = 0;
  for (const f of chapterFiles) {
    const rows = loadAnnotations(BOOK, EDITION, chapterOf(f));
    if (!rows || rows.length === 0) continue;
    const items = itemsOf(blockOf(read(f)));
    rows.forEach((r, i) => {
      const got = reassemble(items[i]);
      assert.equal(got, r.note.trim(), `${f} 第 ${i + 1} 條批語文字與資料不符\n  資料：${r.note}\n  頁面：${got}`);
      if (items[i].tag === null) plain += 1;
      checked += 1;
    });
  }
  assert.equal(checked, TOTAL_NOTES);
  // 出處記號拆不出來的走原樣顯示。這個數字會隨白名單調整而變，但不該暴增——
  // 暴增代表白名單被誤刪，或抽取器換了格式。
  assert.ok(plain <= 80, `原樣顯示的批語 ${plain} 條，超出預期（白名單可能失效）`);
});

test('拆出來的出處記號一定拼得回原字串（不落下、不新增任何字）', () => {
  for (const f of chapterFiles) {
    const rows = loadAnnotations(BOOK, EDITION, chapterOf(f));
    if (!rows || rows.length === 0) continue;
    for (const r of rows) {
      assert.equal(reassemble(parseNote(r.note)), r.note.trim(), `${r.id} 拆解後拼不回原字串`);
    }
  }
});

test('沒有批語資料的回不留空殼區塊；底本自己缺的回也不憑空生出頁面', () => {
  assert.ok(!existsSync(`_books/${BOOK}-${EDITION}-0${MISSING_CHAPTER}.html`),
    `第 ${MISSING_CHAPTER} 回底本本來就沒有，不該有章回頁`);
  assert.ok(!existsSync(`${ANN_DIR}/0${MISSING_CHAPTER}.jsonl`),
    `第 ${MISSING_CHAPTER} 回不該有批語資料檔`);
  for (const n of NO_ANNOTATION_CHAPTERS) {
    const f = `${BOOK}-${EDITION}-0${n}.html`;
    assert.ok(chapterFiles.includes(f), `第 ${n} 回應該有正文頁`);
    assert.equal(loadAnnotations(BOOK, EDITION, n), null, `第 ${n} 回不該有批語資料檔`);
    assert.equal(blockOf(read(f)), null, `第 ${n} 回沒有批語資料，不該出現批語區塊`);
  }
});

test('批語區塊不干擾正文：段落 id 仍連號，區塊裡沒有任何 <p id="p-…">', () => {
  for (const f of chapterFiles) {
    const text = read(f);
    const pad = f.match(/-(\d{3})\.html$/)[1];
    const ids = [...text.matchAll(/<p id="([^"]+)">/g)].map((m) => m[1]);
    assert.ok(ids.length > 0, `${f} 沒有任何段落`);
    ids.forEach((id, i) => {
      assert.equal(id, `p-${pad}-${String(i + 2).padStart(4, '0')}`, `${f} 段落 id 不連號：${id}`);
    });
    const block = blockOf(text);
    if (block) {
      assert.equal(/<p id=/.test(block), false, `${f} 的批語區塊出現 <p id=——會被當成正文段落數`);
      assert.ok(text.indexOf(MARK_BEGIN) > text.lastIndexOf('<p id="p-'), `${f} 批語區塊插在正文中間`);
    }
  }
});

test('頁面上的批語區塊與資料同步（重跑腳本不會有差異）', () => {
  for (const f of chapterFiles) {
    const rows = loadAnnotations(BOOK, EDITION, chapterOf(f));
    const current = read(f);
    const expected = applyBlock(current, rows && rows.length ? buildBlock(rows) : null);
    assert.equal(current, expected,
      `${f} 的批語區塊與資料不同步——請跑 node tools/append_chapter_annotations.mjs ${BOOK} ${EDITION}`);
  }
});

test('批語區塊的說明用訪客看得懂的白話，並老實說明沒有逐句對位', () => {
  const block = blockOf(read(chapterFiles[0]));
  assert.ok(block.includes('抄本本身沒有標明每一條寫在正文的哪一句旁邊'), '沒有老實說明抄本未標明對應位置');
  assert.ok(block.includes('照抄本原本的先後順序條列'), '沒有說明條列順序的依據');
  assert.ok(block.includes('本回批語'), '缺區塊標題');
  const jargon = ['對位', '段落 id', 'jsonl', 'JSON', 'id 欄位', 'schema', 'render', '索引', '快取'];
  for (const w of jargon) {
    assert.ok(!block.includes(w), `批語區塊出現訪客看不懂的用語「${w}」`);
  }
});

test('有批語的章回頁不再宣稱「本頁只呈現原文」', () => {
  const layout = readFileSync('_layouts/book-chapter.html', 'utf8');
  const rendered = layout.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '');
  // 那句話必須被 has_ann 條件包住，否則有批語的頁面會說謊
  assert.match(rendered, /\{%\s*unless has_ann\s*%\}原文與後續整理的輔助資料分開存放，本頁只呈現原文。\{%\s*endunless\s*%\}/);
  assert.match(rendered, /if content contains 'annotations:begin'/);
  assert.equal((rendered.match(/一字未刪改/g) || []).length, 1);
});
