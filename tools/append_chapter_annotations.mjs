/**
 * 把抄本夾註（批語）貼進既有章回頁——「本回批語一覽」最小可上線版。
 *
 * 為什麼是獨立一支腳本、不併進 import_book_chapters.mjs：
 *   後者會先清掉整個 (book, edition) 的舊輸出再重寫 front matter 與正文，
 *   是「原文匯入」的單一職責。批語是輔助層，只在既有檔案尾端加一個帶標記的
 *   區塊，**正文與 front matter 一個位元都不碰**。
 *   ⚠ 每次跑完 import_book_chapters.mjs，都要再跑一次本腳本把批語區塊補回去。
 *
 * 為什麼是靜態寫入、不做前端載入：
 *   實測資料量（庚辰本 4008 條、批語文字合計 354KB）平均每回只增 4.7KB、
 *   最大一回（第 19 回 220 條）18.5KB，章回頁本身約 24KB——靜態寫入零前端負擔，
 *   而且搜尋引擎與站內搜尋看得到。
 *
 * 對位問題（老實說）：
 *   批語資料只有 {id, chapter, order, note} 四個欄位，**沒有任何段落對位欄位**；
 *   order 只是抽取時的先後順序。抽取器（fetch_wikisource.mjs）在單一線性掃描中
 *   把批語從正文挖掉才切段落，當下沒有記錄位置，事後無法可靠回填。真正的逐句
 *   對位要重抓維基文庫並加位移追蹤，屬另案前置工程。所以頁面上老實寫「照抄本
 *   原本的順序條列」，不假裝對得回段落。
 *
 * 批語文字一字不改：出處記號只做「拆出來當小標」的呈現，不改寫、不潤飾、不翻譯。
 * 拆不出來的整條原樣顯示，並在報告裡計數。
 *
 * 用法：
 *   node tools/append_chapter_annotations.mjs <book_id> <edition_id> [--check]
 *   例：node tools/append_chapter_annotations.mjs honglou gengchen-78
 *   --check 只比對不寫檔，內容與現況不符就 exit 1（給 CI／測試用）。
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const MARK_BEGIN = '<!-- annotations:begin';
export const MARK_END = '<!-- annotations:end -->';

const pad3 = (n) => String(n).padStart(3, '0');

/**
 * 出處記號白名單：**逐字列出實際資料裡出現過的記號**，不寫成「抄本名＋批型」的
 * 組合文法——文法會把「該批」「題曰」「批語 暫記寶釵製謎云」這種本文開頭誤判成
 * 出處。白名單外的一律走原樣顯示那條路。清單由 annotations/*.jsonl 全量盤點得出。
 */
export const SOURCE_TAGS = new Set([
  '庚辰雙行夾批', '甲戌側批', '庚辰側批', '蒙側批', '甲戌雙行夾批', '庚辰眉批',
  '甲戌眉批', '蒙雙行夾批', '甲側', '蒙回末總批', '庚辰', '蒙回前總批', '甲戌',
  '蒙', '甲夾', '甲雙', '蒙回末總評', '蒙回後總評', '己卯側批', '靖眉批', '甲眉',
  '靖', '蒙回前總評', '蒙回前詩', '庚批', '甲夾批', '甲戌、庚辰、己卯', '蒙、戚',
  '蒙回前批', '蒙、戚回前', '蒙回前', '靖側批', '庚辰旁批', '庚辰批', '蒙側 批',
  '庚辰夾批', '蒙雙', '甲側，蒙、戚、覺雙', '甲戌行夾批', '己卯夾批', '甲侧',
  '甲戌夾批', '蒙、戚雙', '庚', '靖本眉批', '戚本', '前庚辰雙行夾批',
  '戚本回前總評', '己卯眉批', '蒙夾批', '庚辰侧批', '蒙回前詞', '甲戌回尾',
  '已卯夹批', '庚辰、已卯、有正、蒙批', '庚辰、已卯回前批', '辰夾批', '靖藏眉批',
  '楊、庚、覺、舒回前', '脂批',
]);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** 資料裡有兩條批語內含 `<br>`（維基文庫排版殘留）。渲染成真正的換行，一個字都不動。 */
const escNote = (s) => esc(s).replace(/&lt;br&gt;/g, '<br>');

/**
 * 拆出處記號：只認「整條剛好包在一對【】裡」且冒號前的字串在白名單內的情形。
 * @returns {{ tag: string|null, text: string }} tag=null 代表原樣顯示整條
 */
export function parseNote(note) {
  const raw = note.trim();
  const wrapped = raw.startsWith('【') && raw.endsWith('】')
    && raw.indexOf('【', 1) === -1 && raw.indexOf('】') === raw.length - 1;
  if (!wrapped) return { tag: null, text: raw };
  const inner = raw.slice(1, -1);
  const i = inner.indexOf('：');
  if (i <= 0) return { tag: null, text: raw };
  const tag = inner.slice(0, i);
  if (!SOURCE_TAGS.has(tag)) return { tag: null, text: raw };
  return { tag, text: inner.slice(i + 1) };
}

/** 把 parseNote 的結果拼回原字串——測試用這個證明「一字未改」。 */
export function reassemble({ tag, text }) {
  return tag === null ? text : `【${tag}：${text}】`;
}

/** 讀某一回的批語；沒有資料檔回傳 null（不是空陣列，要分得出「缺資料」與「零條」）。 */
export function loadAnnotations(bookId, editionId, chapter) {
  const p = join('content', bookId, 'editions', editionId, 'annotations', `${pad3(chapter)}.jsonl`);
  if (!existsSync(p)) return null;
  const rows = readFileSync(p, 'utf8').replace(/\r\n/g, '\n').split('\n')
    .map((l) => l.trim()).filter(Boolean)
    .map((l) => JSON.parse(l));
  rows.sort((a, b) => a.order - b.order);
  return rows;
}

/** 產生批語區塊 HTML（含前後標記）。純函式，測試直接呼叫。 */
export function buildBlock(rows) {
  const items = rows.map((r) => {
    const { tag, text } = parseNote(r.note);
    const body = `<span class="bk-ann-text">${escNote(text)}</span>`;
    return tag === null
      ? `      <li class="bk-ann-item bk-ann-item--plain" id="${r.id}">${body}</li>`
      : `      <li class="bk-ann-item" id="${r.id}"><span class="bk-ann-src">${esc(tag)}</span>${body}</li>`;
  });
  // 文案紅線：這個底本的忠實度是 transcribed（用字與原抄本可能有少量出入），所以只能說
  // 「照原樣收錄、站上不改一個字」，不能說「照抄本原樣」——那是冒充逐字。出處記號也不
  // 宣稱是「抄本上原有」（記號裡有甲戌／蒙／靖等他本的名字，來源關係 repo metadata 沒有
  // 記載，不得推斷）。
  const intro = '這些批語出自早期抄本，原本夾在抄本的正文之間。抄本本身沒有標明每一條寫在正文的哪一句旁邊，'
    + '所以這裡照抄本原本的先後順序條列，不對應上面的段落。每條開頭的小字是出處記號，照原樣保留；'
    + '批語文字照原樣收錄，站上不改一個字。';
  return [
    `${MARK_BEGIN}：本回批語，由 tools/append_chapter_annotations.mjs 產生，勿手改 -->`,
    `<details class="bk-ann" id="annotations" data-ann-count="${rows.length}">`,
    `  <summary class="bk-ann-summary"><b>本回批語</b><span class="bk-ann-count">共 ${rows.length} 條</span></summary>`,
    '  <div class="bk-ann-inner">',
    `    <p class="bk-ann-intro">${intro}</p>`,
    '    <ol class="bk-ann-list">',
    ...items,
    '    </ol>',
    '  </div>',
    '</details>',
    MARK_END,
  ].join('\n');
}

/** 把區塊塞進（或換掉）章回頁尾端；block=null 就把舊區塊清掉。回傳新的整份檔案內容。 */
export function applyBlock(fileText, block) {
  const src = fileText.replace(/\r\n/g, '\n');
  const b = src.indexOf(MARK_BEGIN);
  const e = src.indexOf(MARK_END);
  let base = src;
  if (b !== -1 && e !== -1) {
    base = src.slice(0, b).replace(/\n+$/, '\n') + src.slice(e + MARK_END.length).replace(/^\n+/, '');
  }
  base = base.replace(/\n+$/, '\n');
  return block ? `${base}${block}\n` : base;
}

/** 把區塊剝掉，用來證明「正文零改動」。 */
export function stripBlock(fileText) {
  return applyBlock(fileText, null);
}

// ── CLI ────────────────────────────────────────────────────────
const invoked = (process.argv[1] || '').replace(/\\/g, '/');
if (invoked.endsWith('tools/append_chapter_annotations.mjs')) {
  const args = process.argv.slice(2);
  const [bookId, editionId] = args.filter((a) => !a.startsWith('--'));
  const checkOnly = args.includes('--check');
  if (!bookId || !editionId) {
    console.error('用法：node tools/append_chapter_annotations.mjs <book_id> <edition_id> [--check]');
    process.exit(1);
  }
  const prefix = `${bookId}-${editionId}-`;
  const files = readdirSync('_books').filter((f) => f.startsWith(prefix) && f.endsWith('.html')).sort();
  if (files.length === 0) {
    console.error(`_books/ 找不到 ${prefix}*.html`);
    process.exit(1);
  }

  let totalNotes = 0;
  let withBlock = 0;
  let plainCount = 0;
  const noData = [];
  const tagUse = new Map();
  const drift = [];

  for (const f of files) {
    const chapter = Number(f.match(/-(\d{3})\.html$/)[1]);
    const rows = loadAnnotations(bookId, editionId, chapter);
    const path = join('_books', f);
    const before = readFileSync(path, 'utf8');
    let block = null;
    if (rows && rows.length) {
      block = buildBlock(rows);
      totalNotes += rows.length;
      withBlock += 1;
      for (const r of rows) {
        const { tag } = parseNote(r.note);
        if (tag === null) plainCount += 1;
        else tagUse.set(tag, (tagUse.get(tag) || 0) + 1);
      }
    } else {
      noData.push(chapter);
    }
    const after = applyBlock(before, block);
    // 保命檢查：剝掉區塊後必須與原檔（同樣剝掉舊區塊）逐字相同，否則就是動到正文了
    if (stripBlock(after) !== stripBlock(before)) {
      console.error(`✗ ${path}：區塊以外的內容被改動了，中止`);
      process.exit(1);
    }
    if (after !== before.replace(/\r\n/g, '\n')) {
      if (checkOnly) drift.push(path);
      else writeFileSync(path, after, 'utf8');
    }
  }

  console.log(`${checkOnly ? '檢查' : '寫入'} ${withBlock} 篇批語區塊／共 ${files.length} 篇（${bookId}・${editionId}）`);
  console.log(`批語總計 ${totalNotes} 條：出處記號拆出 ${totalNotes - plainCount} 條、原樣顯示（拆不出出處）${plainCount} 條`);
  console.log(`沒有批語資料、不出現區塊的回：${noData.length ? noData.join('、') : '無'}`);
  const top = [...tagUse.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  console.log(`出處記號前八名：${top.map(([t, c]) => `${t} ${c}`).join('／')}`);
  if (checkOnly && drift.length) {
    console.error(`\n✗ 這些檔案的批語區塊與資料不同步：\n  ${drift.join('\n  ')}\n  請跑：node tools/append_chapter_annotations.mjs ${bookId} ${editionId}`);
    process.exit(1);
  }
  if (checkOnly) console.log('✓ 批語區塊與資料同步');
}
