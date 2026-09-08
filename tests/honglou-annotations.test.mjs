/**
 * 抄本批語逐段對位的契約測試（庚辰本脂批）。
 *
 * 守六件事：
 *   1. 條數對得上資料——全書 4008 條、逐回筆數與 annotations/*.jsonl 一致
 *   2. **對位是真的**——每條批語的錨點引文都必須是它所指段落、所指位置之前的
 *      實際子字串（全 4008 條逐條核對正文檔）。這是「位置沒有算錯」的硬證據：
 *      引文不是改寫、不是模型湊的，是從正文機械切下來的那幾個字
 *   3. 批語文字一字未改——把頁面上渲染出來的每一條還原回字串，與 jsonl 全量逐字比對
 *   4. 缺資料的回不留空殼——第 67 回底本本來就沒有（books.yml 已宣告），
 *      第 59 回有正文但沒抽到批語，兩者都不該出現批語區塊
 *   5. 正文沒被波及——段落 id 仍連號、批語區塊裡不得出現任何 <p id="p-…">、
 *      每個區塊都緊接在它自己宣告的那一段之後
 *   6. 對外文案不說謊——已經對位了，就不能再說「沒有標明寫在哪一句旁邊」；
 *      也不能出現訪客看不懂的術語
 */
import { strict as assert } from 'node:assert';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import {
  MARK_BEGIN, MARK_END, buildBlocks, applyBlocks, stripBlocks, loadAnnotations, parseNote, reassemble,
} from '../tools/append_chapter_annotations.mjs';
import { anchorFor } from '../tools/fetch_wikisource.mjs';

const BOOK = 'honglou';
const EDITION = 'gengchen-78';
const ANN_DIR = `content/${BOOK}/editions/${EDITION}/annotations`;
const TXT_DIR = `content/${BOOK}/editions/${EDITION}/chapters`;
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
const pad3 = (n) => String(n).padStart(3, '0');

/** 正文段落（與 fetch_wikisource 的 para 同一套編號：paras[0] 是回目＝第 1 段） */
function paragraphsOf(chapter) {
  return readFileSync(`${TXT_DIR}/${pad3(chapter)}.txt`, 'utf8')
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+$/, ''))
    .filter((p) => p.trim());
}

/** 取出頁面上所有批語區塊，回傳 [{ para, html }]（依出現順序） */
function blocksOf(text) {
  return [...text.matchAll(/<!-- annotations:begin p(\d{4})[^>]*-->([\s\S]*?)<!-- annotations:end -->/g)]
    .map(([, num, html]) => ({ para: Number(num), html }));
}

/** 把渲染出來的一條批語還原成原始字串（escNote 的反向操作） */
const unescapeNote = (html) => html
  .replace(/<br>/g, '&lt;br&gt;')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

/** 從區塊裡讀出每一條 {id, at, tag, text} */
function itemsOf(html) {
  return [...html.matchAll(/<li class="bk-ann-item(?: bk-ann-item--plain)?" id="([^"]+)">([\s\S]*?)<\/li>/g)]
    .map(([, id, inner]) => {
      const at = /<span class="bk-ann-at">([\s\S]*?)<\/span>/.exec(inner);
      const src = /<span class="bk-ann-src">([\s\S]*?)<\/span>/.exec(inner);
      const txt = /<span class="bk-ann-text">([\s\S]*?)<\/span>/.exec(inner);
      assert.ok(txt, `${id} 的批語本文沒有渲染出來`);
      return {
        id,
        at: at ? unescapeNote(at[1]) : '',
        tag: src ? unescapeNote(src[1]) : null,
        text: unescapeNote(txt[1]),
      };
    });
}

test('資料檔本身：76 回、合計 4008 條批語，每條都帶對位欄位', () => {
  const files = readdirSync(ANN_DIR).filter((f) => f.endsWith('.jsonl')).sort();
  assert.equal(files.length, 76);
  let total = 0;
  for (const f of files) {
    const rows = loadAnnotations(BOOK, EDITION, Number(f.slice(0, 3)));
    for (const r of rows) {
      assert.equal(typeof r.para, 'number', `${r.id} 沒有 para`);
      assert.equal(typeof r.offset, 'number', `${r.id} 沒有 offset`);
      assert.equal(typeof r.anchor, 'string', `${r.id} 沒有 anchor`);
      assert.ok(r.para >= 0, `${r.id} 的 para 不合理：${r.para}`);
    }
    total += rows.length;
  }
  assert.equal(total, TOTAL_NOTES, `批語總數應為 ${TOTAL_NOTES}`);
});

test('對位是真的：每條錨點引文都是正文該位置之前的實際字串（全 4008 條）', () => {
  let checked = 0;
  let inPara = 0;
  let withAnchor = 0;
  for (const f of chapterFiles) {
    const ch = chapterOf(f);
    const rows = loadAnnotations(BOOK, EDITION, ch);
    if (!rows || rows.length === 0) continue;
    const paras = paragraphsOf(ch);
    for (const r of rows) {
      checked += 1;
      if (r.offset < 0) {
        // 抄本裡本來就整段獨立的批語（回前／回末總批）：沒有段內位置，也就沒有引文
        assert.equal(r.anchor, '', `${r.id} 掛在段後卻有引文`);
        continue;
      }
      inPara += 1;
      const para = paras[r.para - 1];
      assert.ok(para, `${r.id} 指向第 ${r.para} 段，但正文只有 ${paras.length} 段`);
      assert.ok(r.offset <= para.length,
        `${r.id} 的 offset ${r.offset} 超出第 ${r.para} 段長度 ${para.length}`);
      if (!r.anchor) continue;
      withAnchor += 1;
      // 引文可能因為太長而從尾端截取，前面補了「…」——比對時去掉那個記號
      const anchor = r.anchor.startsWith('…') ? r.anchor.slice(1) : r.anchor;
      // 引文不以空白結尾（那樣很醜），所以比對時也把正文那一側的尾部空白去掉——
      // 底本裡確實有「…第一淫人也。」␣」這種收尾（第 5 回 a0131）。
      const upto = para.slice(0, r.offset).replace(/[\s　]+$/, '');
      assert.ok(upto.endsWith(anchor),
        `${r.id} 的引文「${r.anchor}」不是第 ${r.para} 段第 ${r.offset} 字之前的文字\n`
        + `  該處正文：…${para.slice(Math.max(0, r.offset - 24), r.offset)}`);
    }
  }
  assert.equal(checked, TOTAL_NOTES);
  // 對位覆蓋率會隨底本重抓而微調，但不該崩掉——掉下來代表標記在轉換途中被吃掉了
  assert.ok(inPara >= 3700, `只有 ${inPara} 條對到段內位置，低於預期（應約 3769）`);
  assert.ok(withAnchor >= 3500, `只有 ${withAnchor} 條附得出引文，低於預期（應約 3585）`);
});

test('每一回頁面的批語條數與該回資料檔筆數相符，全書合計 4008', () => {
  let rendered = 0;
  let chaptersWithBlock = 0;
  for (const f of chapterFiles) {
    const rows = loadAnnotations(BOOK, EDITION, chapterOf(f)) || [];
    const blocks = blocksOf(read(f));
    if (rows.length === 0) {
      assert.equal(blocks.length, 0, `${f} 沒有批語資料，不該出現批語區塊`);
      continue;
    }
    assert.ok(blocks.length > 0, `${f} 有 ${rows.length} 條批語資料，頁面卻沒有批語區塊`);
    const items = blocks.flatMap((b) => itemsOf(b.html));
    assert.equal(items.length, rows.length, `${f} 頁面 ${items.length} 條 ≠ 資料 ${rows.length} 條`);
    // 頁面順序＝**閱讀順序**（依段落、段內位置），刻意不等於資料檔的 order：
    // 抓取器是第二輪才掃「沒有包在模板裡的裸露批語」（第 22 回有那種），所以那幾條
    // 的編號在後、位置卻在前。id 由 order 派生、不因為對位而重新編號，因此這裡比對
    // 的是「編號集合」與「閱讀順序」，不是序列相等。
    assert.deepEqual([...items].map((i) => i.id).sort(), [...rows].map((r) => r.id).sort(),
      `${f} 批語編號與資料不符`);
    const byReading = [...rows].sort((a, b) => (a.para - b.para)
      || ((a.offset < 0 ? Infinity : a.offset) - (b.offset < 0 ? Infinity : b.offset))
      || (a.order - b.order));
    assert.deepEqual(items.map((i) => i.id), byReading.map((r) => r.id),
      `${f} 頁面上的批語沒有按閱讀順序（段落、段內位置）排列`);
    // 每個區塊自己宣告的條數要對
    for (const b of blocks) {
      const n = itemsOf(b.html).length;
      assert.match(b.html, new RegExp(`data-ann-count="${n}"`), `${f} 第 ${b.para} 段區塊的條數標示不符`);
    }
    rendered += items.length;
    chaptersWithBlock += 1;
  }
  assert.equal(chaptersWithBlock, 76);
  assert.equal(rendered, TOTAL_NOTES);
});

test('批語文字與錨點引文都一字未改——全部 4008 條逐字還原回資料檔', () => {
  let checked = 0;
  let plain = 0;
  for (const f of chapterFiles) {
    const rows = loadAnnotations(BOOK, EDITION, chapterOf(f));
    if (!rows || rows.length === 0) continue;
    // 按編號配對，不按位置——頁面是閱讀順序、資料是抽取順序（見上一個測試的說明）
    const byId = new Map(blocksOf(read(f)).flatMap((b) => itemsOf(b.html)).map((i) => [i.id, i]));
    rows.forEach((r) => {
      const item = byId.get(r.id);
      assert.ok(item, `${f} 頁面上找不到 ${r.id}`);
      assert.equal(reassemble(item), r.note.trim(),
        `${r.id} 批語文字與資料不符\n  資料：${r.note}\n  頁面：${reassemble(item)}`);
      assert.equal(item.at, r.anchor, `${r.id} 的引文與資料不符`);
      if (item.tag === null) plain += 1;
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
    assert.equal(blocksOf(read(f)).length, 0, `第 ${n} 回沒有批語資料，不該出現批語區塊`);
  }
});

test('批語區塊不干擾正文：段落 id 連號、區塊裡沒有 <p id="p-…">、剝掉區塊等於純正文', () => {
  for (const f of chapterFiles) {
    const text = read(f);
    const pad = f.match(/-(\d{3})\.html$/)[1];
    const ids = [...text.matchAll(/<p id="([^"]+)">/g)].map((m) => m[1]);
    assert.ok(ids.length > 0, `${f} 沒有任何段落`);
    ids.forEach((id, i) => {
      assert.equal(id, `p-${pad}-${String(i + 2).padStart(4, '0')}`, `${f} 段落 id 不連號：${id}`);
    });
    for (const b of blocksOf(text)) {
      assert.equal(/<p id=/.test(b.html), false, `${f} 的批語區塊出現 <p id=——會被當成正文段落數`);
    }
    // 剝掉全部區塊後不該還有批語的痕跡
    const bare = stripBlocks(text);
    assert.equal(bare.includes(MARK_BEGIN), false, `${f} 剝掉區塊後還有 ${MARK_BEGIN}`);
    assert.equal(bare.includes(MARK_END), false, `${f} 剝掉區塊後還有 ${MARK_END}`);
    assert.equal(bare.includes('class="bk-ann'), false, `${f} 剝掉區塊後還有批語樣式`);
  }
});

test('每個批語區塊都緊接在它自己宣告的那一段之後（回首區在第一段之前）', () => {
  for (const f of chapterFiles) {
    const text = read(f);
    const blocks = blocksOf(text);
    if (blocks.length === 0) continue;
    const pad = f.match(/-(\d{3})\.html$/)[1];
    for (const b of blocks) {
      const at = text.indexOf(`<!-- annotations:begin p${String(b.para).padStart(4, '0')}`);
      if (b.para === 0) {
        // 回首區：它前面不能有任何正文段落
        assert.equal(text.slice(0, at).includes('<p id="p-'), false,
          `${f} 的回首批語區塊排在正文段落之後了`);
        continue;
      }
      // 其餘：它前面最後一個正文段，必須就是它宣告的那一段
      const before = text.slice(0, at);
      const lastId = [...before.matchAll(/<p id="p-\d{3}-(\d{4})">/g)].pop();
      assert.ok(lastId, `${f} 第 ${b.para} 段的批語區塊前面找不到正文段落`);
      assert.equal(Number(lastId[1]), b.para,
        `${f} 宣告第 ${b.para} 段的批語區塊，實際卻接在第 ${Number(lastId[1])} 段（id p-${pad}-${lastId[1]}）之後`);
    }
  }
});

test('頁面上的批語區塊與資料同步（重跑腳本不會有差異）', () => {
  for (const f of chapterFiles) {
    const rows = loadAnnotations(BOOK, EDITION, chapterOf(f));
    const current = read(f);
    const expected = applyBlocks(current, rows && rows.length ? buildBlocks(rows) : null);
    assert.equal(current, expected,
      `${f} 的批語區塊與資料不同步——請跑 node tools/append_chapter_annotations.mjs ${BOOK} ${EDITION}`);
  }
});

test('有批語的章回頁：說明文案用白話、不再宣稱沒有對位，並提供收起來的開關', () => {
  const layout = readFileSync('_layouts/book-chapter.html', 'utf8');
  const rendered = layout.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '');
  // 那句話必須被 has_ann 條件包住，否則有批語的頁面會說謊
  assert.match(rendered, /\{%\s*unless has_ann\s*%\}原文與後續整理的輔助資料分開存放，本頁只呈現原文。\{%\s*endunless\s*%\}/);
  assert.match(rendered, /if content contains 'annotations:begin'/);
  assert.equal((rendered.match(/一字未刪改/g) || []).length, 1);
  // 已經逐段對位了，舊的「沒有標明寫在哪一句旁邊」不能再留著
  assert.equal(rendered.includes('抄本本身沒有標明'), false, '文案還在說抄本沒有標明位置，但現在已經對位了');
  assert.match(rendered, /照抄本原本夾在正文裡的位置/, '沒有說明批語位置的依據');
  // 工具列要有把批語收起來的開關（預設顯示）
  assert.match(rendered, /ann_toggle=has_ann/, 'topbar 沒有收到批語開關的參數');
  const topbar = readFileSync('_includes/book/topbar.html', 'utf8');
  assert.match(topbar, /data-ann-toggle/, 'topbar 沒有批語開關鈕');
  const head = readFileSync('_includes/book/head.html', 'utf8');
  assert.match(head, /bk-ann'\)==='0'/, 'head 缺少「只有存過 0 才隱藏」的防閃爍判斷（預設必須是顯示）');
  const jargon = ['對位', '段落 id', 'jsonl', 'JSON', 'id 欄位', 'schema', 'render', '索引', '快取', 'offset'];
  const copy = /\{%-?\s*if has_ann\s*-?%\}([\s\S]*?)\{%-?\s*endif\s*-?%\}/.exec(rendered);
  assert.ok(copy, '找不到批語說明文案');
  for (const w of jargon) {
    assert.ok(!copy[1].includes(w), `批語說明出現訪客看不懂的用語「${w}」`);
  }
});

test('anchorFor：連續標點群整群收進引文、全是標點時降級為不顯示', () => {
  const at = (t, s) => t.indexOf(s) + s.length;
  const cases = [
    // [段落文字, 批語插在這段字之後, 前一條批語的位置, 期望引文]
    ['　　原來，當年女媧氏煉石補天之時，於大荒山無稽崖煉成', '於大荒山', 0, '於大荒山'],
    ['　　原來，當年女媧氏煉石補天之時，於大荒山無稽崖煉成', '無稽崖', 21, '無稽崖'],
    // 對話收尾是「。」」兩個標點連著——只跳一個標點會讓引文變成孤零零的「」」
    // （盲測抽樣時發現全庫 851 條這樣退化，讀者看到會以為對位壞了）
    ['寶玉道：「你來了。」他便', '你來了。」', 0, '你來了。」'],
    ['他便說道：「好極！」', '好極！」', 0, '好極！」'],
    // 前一條批語剛好緊貼在標點之間：回溯無處可去，引文只剩標點 → 寧可不顯示
    ['寶玉道：「你來了。」他便', '你來了。」', 8, ''],
    // 太長就從尾端截取（離批語最近的部分最有用），前面補「…」
    ['此等處實又非別部小說之熟套起法。', '之熟套起法。', 0, '…處實又非別部小說之熟套起法。'],
  ];
  for (const [text, upto, prev, want] of cases) {
    assert.equal(anchorFor(text, at(text, upto), prev), want,
      `批在「${upto}」之後（前一條 ${prev}）的引文不符`);
  }
});

test('全庫的引文不得退化成純標點（讀者會以為對位壞了）', () => {
  let degenerate = 0;
  const samples = [];
  for (const f of chapterFiles) {
    const rows = loadAnnotations(BOOK, EDITION, chapterOf(f));
    if (!rows) continue;
    for (const r of rows) {
      if (!r.anchor) continue;
      if (!/[^，。？！；：、「」『』（）〈〉《》…—　\s]/.test(r.anchor)) {
        degenerate += 1;
        if (samples.length < 5) samples.push(`${r.id}「${r.anchor}」`);
      }
    }
  }
  assert.equal(degenerate, 0,
    `有 ${degenerate} 條引文只剩標點符號，例如 ${samples.join('、')}`);
});

test('批語多的段落要預設收合、少的直接顯示（否則批語牆會把正文擠出畫面）', () => {
  const FOLD_AT = 8;
  let folded = 0;
  let plain = 0;
  for (const f of chapterFiles) {
    const text = read(f);
    for (const b of blocksOf(text)) {
      const n = itemsOf(b.html).length;
      const isFold = /<details class="bk-ann/.test(b.html);
      if (n >= FOLD_AT) {
        assert.ok(isFold,
          `${f} 第 ${b.para} 段有 ${n} 條批語，應該預設收合（版面實測：19 條會佔掉桌機一整屏）`);
        assert.match(b.html, new RegExp(`有 ${n} 條批語`),
          `${f} 第 ${b.para} 段的收合標題沒寫明條數`);
        folded += 1;
      } else {
        assert.equal(isFold, false,
          `${f} 第 ${b.para} 段只有 ${n} 條批語，不該收起來（讀者不必多按一下）`);
        assert.match(b.html, /<aside class="bk-ann/, `${f} 第 ${b.para} 段的區塊標籤不對`);
        plain += 1;
      }
    }
  }
  // 實測分布：全書 1159 個區塊，8 條以上的 130 個（11.2%）
  assert.equal(folded + plain, 1159, `區塊總數 ${folded + plain} 與實測的 1159 不符`);
  assert.ok(folded > 0 && folded < plain / 4,
    `收合 ${folded} 個、直接顯示 ${plain} 個——收合比例偏離預期（應約 11%）`);
});
