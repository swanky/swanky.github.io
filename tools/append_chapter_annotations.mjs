/**
 * 把抄本夾註（批語）貼進既有章回頁——**逐句對位版**：每一條批語掛在它原本所批的
 * 那一段之後，並附上批語插入點前面那一句正文（錨點引文），讀者一眼看得出它在批什麼。
 *
 * 為什麼是獨立一支腳本、不併進 import_book_chapters.mjs：
 *   後者會先清掉整個 (book, edition) 的舊輸出再重寫 front matter 與正文，
 *   是「原文匯入」的單一職責。批語是輔助層，只在段落之間插入帶標記的區塊，
 *   **正文段落與 front matter 一個位元都不碰**（applyBlocks 有保命檢查）。
 *   ⚠ 每次跑完 import_book_chapters.mjs，都要再跑一次本腳本把批語區塊補回去。
 *
 * 為什麼是靜態寫入、不做前端載入：
 *   實測資料量（庚辰本 4008 條、批語文字合計 354KB）平均每回只增 4.7KB、
 *   最大一回（第 19 回 220 條）18.5KB，章回頁本身約 24KB——靜態寫入零前端負擔，
 *   而且搜尋引擎與站內搜尋看得到，關掉 JavaScript 也完整。
 *
 * 對位資料從哪來（2026-09-08 起）：
 *   `fetch_wikisource.mjs` 在把批語從正文挖掉時插一個位置標記，讓它跟著正文走完
 *   整條轉換管線，段落切好之後才掃描標記落點——所以 `para`／`offset`／`anchor`
 *   是**機械取得的原始位置**，不是推測，也沒有 AI 判斷的空間。維基文庫的抄本
 *   原始碼裡批語就內嵌在它所批的詞後面（「於大荒山{{~~|【甲側：荒唐也。】}}無稽崖」）。
 *   實測 4008 條裡 3769 條（94.0%）對到段內某個字旁邊；剩下 239 條在抄本裡本來就
 *   整段獨立（回前／回末總批），掛在該段之後。
 *
 * 批語文字一字不改：出處記號只做「拆出來當小標」的呈現，不改寫、不潤飾、不翻譯。
 * 拆不出來的整條原樣顯示，並在報告裡計數。錨點引文一律從正文機械切取，不改寫。
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
/** 一個批語區塊的完整範圍（begin 標記帶段號，所以一頁會有很多個） */
const BLOCK_RE = /<!-- annotations:begin[^>]*-->[\s\S]*?<!-- annotations:end -->\n?/g;
/** 正文段落：id 的數字部分就是 fetch_wikisource 記下的 para（回目算第 1 段、不渲染成 <p>） */
const PARA_RE = /<p id="p-\d{3}-(\d{4})">[\s\S]*?<\/p>/g;

const pad3 = (n) => String(n).padStart(3, '0');
const pad4 = (n) => String(n).padStart(4, '0');

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

/**
 * 一條批語的 `<li>`。
 * 錨點引文（`bk-ann-at`）＝批語插入點前面那一句正文，機械切取；空的就不渲染那個 span
 * （批在段首、或前一條批語就緊貼在旁邊的情形，實測 184 條）。
 */
function itemHtml(row) {
  const { tag, text } = parseNote(row.note);
  const at = row.anchor ? `<span class="bk-ann-at">${esc(row.anchor)}</span>` : '';
  const src = tag === null ? '' : `<span class="bk-ann-src">${esc(tag)}</span>`;
  const cls = tag === null ? 'bk-ann-item bk-ann-item--plain' : 'bk-ann-item';
  return `<li class="${cls}" id="${row.id}">${at}${src}<span class="bk-ann-text">${escNote(text)}</span></li>`;
}

/**
 * 這一段的批語多到會蓋掉正文時，改成預設收合。
 *
 * 閾值從實測來：全書 1159 個批語區塊的中位數只有 2 條、平均 3.5 條，但分布很不均——
 * 8 條以上的有 130 個（11.2%），10 條以上的 68 個（5.9%）。版面實測量到第 19 回第 32 段
 * 掛了 19 條、批語區塊高 787px（跟那段正文本身 890px 幾乎一樣高），桌機要多滑一整屏
 * 純批語才接回小說，手機（390 寬）更達 1.3 個螢幕高。設 8 是因為實測到 7～8 條時
 * 閱讀節奏還可接受，再多就變成「批語牆」。收合的那 11.2% 涵蓋 34.7% 的批語，
 * 其餘 88.8% 的區塊照舊直接顯示——不必為了少數重災區把所有批語都藏起來。
 */
const FOLD_AT = 8;

/**
 * 把一回的批語依落點分組，回傳 Map：段號 → 區塊 HTML。
 * 段號 0 是回首（回前總批，以及回目裡夾的批）——渲染在第一個正文段之前。
 */
export function buildBlocks(rows) {
  const byPara = new Map();
  for (const r of rows) {
    // para 0（回首）與 para 1（回目，不渲染成 <p>）都歸到回首區
    const key = r.para <= 1 ? 0 : r.para;
    if (!byPara.has(key)) byPara.set(key, []);
    byPara.get(key).push(r);
  }
  const blocks = new Map();
  for (const [key, group] of byPara) {
    const where = key === 0 ? '這一回開頭' : `第 ${key} 段`;
    const head = `${MARK_BEGIN} p${pad4(key)}：${where}的批語，`
      + '由 tools/append_chapter_annotations.mjs 產生，勿手改 -->';
    const cls = `bk-ann${key === 0 ? ' bk-ann--head' : ''}`;
    const list = [
      '  <ol class="bk-ann-list">',
      ...group.map((r) => `    ${itemHtml(r)}`),
      '  </ol>',
    ];
    // 少量批語直接顯示（讀者不必多按一下）；多到會蓋掉正文的才收起來，
    // 標題寫明有幾條，用原生 <details>，沒有 JavaScript 也展得開。
    const body = group.length < FOLD_AT
      ? [`<aside class="${cls}" data-ann-count="${group.length}" aria-label="${where}的批語">`, ...list, '</aside>']
      : [
        `<details class="${cls} bk-ann--fold" data-ann-count="${group.length}">`,
        `  <summary class="bk-ann-fold-sum">${where}有 ${group.length} 條批語</summary>`,
        ...list,
        '</details>',
      ];
    blocks.set(key, [head, ...body, MARK_END].join('\n'));
  }
  return blocks;
}

/** 把所有批語區塊剝掉，用來證明「正文零改動」。 */
export function stripBlocks(fileText) {
  return fileText.replace(/\r\n/g, '\n').replace(BLOCK_RE, '');
}

/**
 * 把區塊插進章回頁：回首區放在第一個正文段之前，其餘各放在對應段落之後。
 * blocks=null／空 Map 就只把舊區塊清掉。回傳新的整份檔案內容。
 *
 * 落點對得起來的關鍵：段落 id 的數字部分就是 fetch_wikisource 記下的 para
 * （`p-001-0003` ↔ para 3），兩邊同一套編號，不需要另外對照表。
 */
export function applyBlocks(fileText, blocks) {
  const base = stripBlocks(fileText);
  if (!blocks || blocks.size === 0) return base.replace(/\n{3,}/g, '\n\n');
  const out = base.replace(PARA_RE, (whole, num) => {
    const b = blocks.get(Number(num));
    return b ? `${whole}\n${b}` : whole;
  });
  const head = blocks.get(0);
  if (!head) return out;
  // 回首區插在第一個正文段之前（第一段的 id 在 strip 後的字串裡找，位置沒有偏移問題
  // ——head 是最後才插的）
  const i = out.indexOf('<p id="p-');
  if (i === -1) return `${head}\n${out}`;
  return `${out.slice(0, i)}${head}\n${out.slice(i)}`;
}

// ── 舊介面（單一回末清單）已移除；保留名稱只為讓誤用立刻壞掉而不是靜默跑錯 ──
export const buildBlock = () => { throw new Error('buildBlock 已改為 buildBlocks（逐段對位）'); };
export const applyBlock = () => { throw new Error('applyBlock 已改為 applyBlocks（逐段對位）'); };

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
  let inPara = 0;
  let withAnchor = 0;
  let orphan = 0;
  const noData = [];
  const tagUse = new Map();
  const drift = [];

  for (const f of files) {
    const chapter = Number(f.match(/-(\d{3})\.html$/)[1]);
    const rows = loadAnnotations(bookId, editionId, chapter);
    const path = join('_books', f);
    const before = readFileSync(path, 'utf8');
    let blocks = null;
    if (rows && rows.length) {
      // 落點檢查：para 指到的段落必須真的存在於頁面上，否則批語會靜靜地消失
      const ids = new Set([...before.matchAll(/<p id="p-\d{3}-(\d{4})">/g)].map((m) => Number(m[1])));
      for (const r of rows) {
        if (r.para > 1 && !ids.has(r.para)) {
          console.error(`✗ ${path}：${r.id} 指向第 ${r.para} 段，但頁面上沒有這一段`);
          process.exit(1);
        }
        if (r.offset >= 0) inPara += 1;
        if (r.anchor) withAnchor += 1;
        if (r.para <= 1) orphan += 1;
        const { tag } = parseNote(r.note);
        if (tag === null) plainCount += 1;
        else tagUse.set(tag, (tagUse.get(tag) || 0) + 1);
      }
      blocks = buildBlocks(rows);
      totalNotes += rows.length;
      withBlock += 1;
    } else {
      noData.push(chapter);
    }
    const after = applyBlocks(before, blocks);
    // 保命檢查：剝掉區塊後必須與原檔（同樣剝掉舊區塊）逐字相同，否則就是動到正文了
    if (stripBlocks(after) !== stripBlocks(before)) {
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
  console.log(`對位：段內某個字旁邊 ${inPara} 條（${(inPara / totalNotes * 100).toFixed(1)}%）、附得出引文 ${withAnchor} 條、抄本裡本來就獨立成段（回首／段後）${orphan + (totalNotes - inPara - orphan)} 條`);
  console.log(`沒有批語資料、不出現區塊的回：${noData.length ? noData.join('、') : '無'}`);
  const top = [...tagUse.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  console.log(`出處記號前八名：${top.map(([t, c]) => `${t} ${c}`).join('／')}`);
  if (checkOnly && drift.length) {
    console.error(`\n✗ 這些檔案的批語區塊與資料不同步：\n  ${drift.join('\n  ')}\n  請跑：node tools/append_chapter_annotations.mjs ${bookId} ${editionId}`);
    process.exit(1);
  }
  if (checkOnly) console.log('✓ 批語區塊與資料同步');
}
