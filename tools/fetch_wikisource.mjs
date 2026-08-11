/**
 * 從中文維基文庫抓章回原文，轉成 content/ 的 staged 純文字格式。
 *
 * 為什麼需要這條管道：素材包的紅樓夢底本是簡→繁機器轉換的劣本（繁體形完全
 * 不存在、73% 句末用「．」、多數回無分段），不能當原文用。站上《金瓶梅》正是
 * 從維基文庫收錄的，品質良好——同一條路走給其餘作品。
 *
 * 用法：
 *   node tools/fetch_wikisource.mjs --book honglou --edition wikisource-120 \
 *     --page "紅樓夢/第{NNN}回" --from 1 --to 120 [--dry 3]
 *
 *   --page   維基文庫頁名樣板。{NNN}＝補零三位（第001回）；{CN}＝中文數字（第一回）
 *   --dry N  只抓前 N 回並印出結果，不寫檔（用來確認轉換規則）
 *
 * 輸出：content/<book>/editions/<edition>/
 *   chapters/NNN.txt        正文（下游 import_book_chapters.mjs 吃這個）
 *   annotations/NNN.jsonl   抄本夾註（脂批等），與正文分離保存
 *   chapter_index.json / metadata.json
 *
 * 轉換原則：**只移除維基文庫的排版與編者附加物，不動原文一個字。**
 * 抄本夾註（庚辰本的脂批）不是小說正文，但也不是現代編者添加的——所以不丟掉，
 * 另存 annotations/ 供日後當輔助層用（PLAN.md §6：原文與輔助資訊分層）。
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i > -1 ? argv[i + 1] : d; };
const BOOK = arg('book');
const EDITION = arg('edition');
const PAGE_TPL = arg('page');
const FROM = Number(arg('from', 1));
const TO = Number(arg('to', 1));
const DRY = argv.includes('--dry') ? Number(arg('dry', 3)) : 0;
if (!BOOK || !EDITION || !PAGE_TPL) {
  console.error('用法：node tools/fetch_wikisource.mjs --book <id> --edition <id> --page "書名/第{NNN}回" --from 1 --to 120 [--dry 3]');
  process.exit(1);
}

const UA = 'swanky.github.io/1.0 (classic novel reader; contact via https://swanky.github.io)';
const pad3 = (n) => String(n).padStart(3, '0');
const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 阿拉伯數字 → 中文數字（維基文庫有些書的分頁名用「第七十八回」而非「第078回」）。 */
export function toChineseNumeral(n) {
  const d = '零一二三四五六七八九';
  if (n <= 10) return n === 10 ? '十' : d[n];
  if (n < 20) return `十${d[n % 10]}`;
  if (n < 100) return `${d[Math.floor(n / 10)]}十${n % 10 ? d[n % 10] : ''}`;
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (rest === 0) return `${d[h]}百`;
  if (rest < 10) return `${d[h]}百零${d[rest]}`;
  return `${d[h]}百${toChineseNumeral(rest)}`;
}

const pageNameFor = (n) => PAGE_TPL.replace('{NNN}', pad3(n)).replace('{CN}', toChineseNumeral(n));

async function fetchRaw(pageName) {
  const url = `https://zh.wikisource.org/w/index.php?title=${encodeURIComponent(pageName)}&action=raw`;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) return res.text();
    if (res.status === 404) throw new Error(`404 找不到頁面：${pageName}`);
    if (attempt === 3) throw new Error(`${pageName} 取得失敗：HTTP ${res.status}`);
    await sleep(1200 * attempt);
  }
  throw new Error('unreachable');
}

/**
 * 逐字掃描處理 {{模板}}，用堆疊配對括號。
 *
 * 為什麼不用正則：脂批裡有巢狀模板（【蒙、戚回前：…以冒{{~|蒙作「帽」}}之…】），
 * 非貪婪比對會停在內層的 }}，導致批語沒被抽乾淨、又被後續規則跨行吃掉，把整回
 * 段落黏成一團。庚辰本第 2、3 回就是這樣只切出 4 段的。
 *
 * @param {string} s wikitext
 * @param {(inner: string) => string|null} handler 收到模板內容，回傳替代字串；回傳 null 表示丟掉
 */
export function replaceTemplates(s, handler) {
  let out = '';
  let i = 0;
  while (i < s.length) {
    const start = s.indexOf('{{', i);
    if (start === -1) { out += s.slice(i); break; }
    out += s.slice(i, start);
    // 找配對的 }}
    let depth = 0;
    let j = start;
    let end = -1;
    while (j < s.length - 1) {
      if (s[j] === '{' && s[j + 1] === '{') { depth += 1; j += 2; continue; }
      if (s[j] === '}' && s[j + 1] === '}') { depth -= 1; j += 2; if (depth === 0) { end = j; break; } continue; }
      j += 1;
    }
    if (end === -1) { out += s.slice(start); break; }   // 括號沒收尾，原樣保留讓殘留檢查抓
    const inner = s.slice(start + 2, end - 2);
    const rep = handler(inner);
    out += rep === null ? '' : rep;
    i = end;
  }
  return out;
}

/**
 * wikitext → { text, heading, annotations }
 * 順序重要：先拆掉會包住正文的結構（header、ref、夾註、模板、連結），最後才處理空白。
 */
export function wikitextToPlain(wt) {
  let s = wt.replace(/\r\n/g, '\n');
  const annotations = [];
  let headerHeading = '';

  // 2) 編者註腳與註釋段——現代附加物，不是小說原文
  s = s.replace(/<ref[^>]*\/>/g, '');
  s = s.replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '');
  // 標題用字兩岸混雜（註釋／注釋／注释／註解…），一律涵蓋；這一段到檔尾全部丟掉
  s = s.replace(/^==+\s*[註注][釋释解][^=\n]*==+[\s\S]*$/m, '');
  s = s.replace(/^==+\s*(?:参考|參考|外部[链連][结結]|參見|参见)[^=\n]*==+[\s\S]*$/m, '');
  s = s.replace(/<references\s*\/?>/g, '');

  // 3) 一次掃完所有模板（堆疊配對，巢狀安全）。三種處理：
  //      header      → 回目藏在 section 參數，取出來當標題，其餘丟掉
  //      內容是【…】 → 抄本夾註（脂批），抽出另存，**不進正文**
  //      其他有 |    → 取第一個 | 之後的內容當正文（{{center|X}}、{{~~|X}}）
  //      其他無 |    → 樣式／授權／Footer 之類，整個丟掉
  const handleTemplate = (inner) => {
    const name = inner.split('|')[0].trim().toLowerCase();
    if (name.startsWith('header')) {
      // 先把巢狀模板攤平再取 section。庚辰本第 3 回的回目裡就夾著一條脂批，
      // 模板內含 |，任何 [^|]* 的正則都會在那裡斷掉、把回目切一半
      //（曾產生「第三回　金陵城起復賈雨村　榮國府收養{{~~」這種標題）。
      const flat = replaceTemplates(inner, (x) => {
        const b = x.indexOf('|');
        const body = b === -1 ? '' : x.slice(b + 1);
        if (/^\s*【/.test(body)) annotations.push(body.replace(/\s+/g, ' ').trim());
        return '';
      });
      const m = /\|\s*section\s*=\s*([^\n|]*)/i.exec(`|${flat.slice(flat.indexOf('|') + 1)}`);
      if (m) {
        headerHeading = m[1]
          .replace(/'''/g, '')
          .replace(/\[\[[^\]]*\]\]/g, '')
          .replace(/-\{([^{}]*)\}-/g, '$1')     // 回目裡也有 -{广}-（第 50 回）
          .replace(/【[^】]*】/g, '')
          .trim();
      }
      return null;
    }
    const bar = inner.indexOf('|');
    if (bar === -1) return null;                               // 無參數模板：丟掉
    const body = inner.slice(bar + 1);
    // 判準是內容被【】包住。同一個 {{~~}} 在紅樓夢 120 回本是用來包正文，
    // 所以只能看內容判斷，不能看模板名。
    if (/^\s*【/.test(body)) {
      annotations.push(replaceTemplates(body, (x) => {         // 夾註內的巢狀模板取其內容
        const b = x.indexOf('|');
        return b === -1 ? '' : x.slice(b + 1);
      }).replace(/\s+/g, ' ').trim());
      return '';
    }
    // 回傳的內容可能還有巢狀模板（例：{{~~|正文…{{~|校記}}…}}），要再掃一次，
    // 否則會留下未處理的 {{ 被殘留檢查擋下（庚辰本第 4 回就是這樣）。
    return replaceTemplates(body, handleTemplate);
  };
  s = replaceTemplates(s, handleTemplate);

  // 3b) 裸露的抄本夾註：有些批語沒有包在模板裡，直接以【庚辰批語　…】的形式寫在正文中
  //     （第 22 回）。判準與模板內一致：【】內出現 批／側／眉／夾／雙 這類批語標記。
  s = s.replace(/【[^】]{0,10}[批側眉夾雙][\s\S]{0,4000}?】/g, (note) => {
    annotations.push(note.replace(/\s+/g, ' ').trim());
    return '';
  });

  // 4) <poem> 內每一行都是語意行（詩詞、唱詞），標上縮排讓下游的
  //    logicalLines() 不把它們接成一行；同一個 poem 區塊視為一個段落。
  s = s.replace(/<poem>([\s\S]*?)<\/poem>/g, (_, inner) => {
    const lines = inner.split('\n').map((l) => l.trim()).filter(Boolean);
    return `\n\n${lines.map((l) => `    ${l}`).join('\n')}\n\n`;
  });
  // <br> 也是語意換行（詩句），轉成縮排新行而不是直接刪掉。
  // 後面**只能吃掉空格與定位字元，不能吃換行**——原本寫 \s* 會把 <br> 之後的空行
  // 一起吞掉，段落分隔就沒了（庚辰本第 2、3 回因此整回只切出 4 段）。
  s = s.replace(/<br\s*\/?>[ \t]*/g, '\n    ');

  // 5) 繁簡轉換抑制標記 -{...}- ：保留內文
  s = s.replace(/-\{([^{}]*)\}-/g, '$1');
  // MediaWiki 的 :: 縮排標記（用來排詩句）→ 轉成語意行的縮排
  s = s.replace(/^:+[ \t]*/gm, '    ');

  // 8) 導覽行——**按結構判斷**：整行只由 [[...]] 連結與空白組成就整行刪掉。
  //    不要比對顯示文字：紅樓夢第 80 回的下一回寫成「高續下一回」，
  //    任何固定字樣清單都會漏掉這種在地變體。
  s = s.replace(/^(?:[\s　]*\[\[[^\]]*\]\])+[\s　]*$/gm, '');

  // 9) 內部連結：[[目標|顯示]] → 顯示；[[目標]] → 目標
  s = s.replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1');
  s = s.replace(/\[\[([^\]]*)\]\]/g, '$1');
  s = s.replace(/\[https?:\/\/\S+\s+([^\]]*)\]/g, '$1');

  // 10) 粗體斜體、分隔線、HTML 註解、已知標籤
  s = s.replace(/'''''|'''|''/g, '');
  s = s.replace(/^-{4,}\s*$/gm, '');
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  // 已知標籤逐類處理。**刻意不寫「剝除所有標籤」**——那樣下面的殘留檢查就永遠
  // 不會再響，等於自廢武功；遇到沒見過的標籤要被擋下來、人工判斷怎麼處理。
  s = s.replace(/<section[^>]*\/?>/g, '');                                   // 區段轉錄標記，無內容
  s = s.replace(/<\/?(?:noinclude|includeonly|onlyinclude)[^>]*>/g, '');
  s = s.replace(/<li[^>]*>/g, '\n').replace(/<\/li>/g, '');                  // 列表項各自成行
  s = s.replace(/<\/?[uo]l[^>]*>/g, '\n\n');
  s = s.replace(/<hr\s*\/?>/g, '\n\n');
  s = s.replace(/<\/?(?:small|big|span|div|center|p|sup|sub|i|b|u|s|tt|code|em|strong|font|abbr)[^>]*>/g, '');

  // 10b) 段落邊界：以全角雙空格「　　」開頭的行是新段落的起頭（中文排版慣例）。
  //      有些頁面用空行分段，有些頁面每段各自一行、彼此不空行（庚辰本第 12 回），
  //      統一補上空行，段落切割才不會把整回黏成一團。
  //      只認「恰好兩個全角空格＋非空白」，避免動到詩句那種更深的縮排。
  s = s.replace(/^　　(?=[^\s　])/gm, '\n　　');

  // 11) 空白收尾：有縮排的行保留縮排（語意行），其餘去頭尾空白
  s = s.split('\n').map((l) => (/^[\s　]+\S/.test(l) ? l.replace(/\s+$/, '') : l.trim())).join('\n');
  s = s.replace(/\n{3,}/g, '\n\n').trim();

  // 12) 回目：內文沒有時用 header 的 section 補上（庚辰本的回目只在 header 裡）
  const firstPara = s.split(/\n\s*\n/)[0] || '';
  const looksLikeHeading = /^(第[一二三四五六七八九十百零〇\d]+回|楔子|引子|卷首|凡例)/.test(firstPara.trim());
  if (!looksLikeHeading && headerHeading) s = `${headerHeading}\n\n${s}`;

  return { text: `${s}\n`, heading: headerHeading, annotations };
}

const splitParagraphs = (t) => t.split(/\n\s*\n/).map((p) => p.replace(/\s+$/, '')).filter((p) => p.trim());

const outDir = join('content', BOOK, 'editions', EDITION);
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s, 'utf8'); };

const index = [];
const problems = [];
let annTotal = 0;
const limit = DRY ? Math.min(DRY, TO - FROM + 1) : TO - FROM + 1;

for (let i = 0; i < limit; i += 1) {
  const n = FROM + i;
  const pageName = pageNameFor(n);
  let conv;
  try {
    conv = wikitextToPlain(await fetchRaw(pageName));
  } catch (e) {
    problems.push(`第 ${n} 回：${e.message}`);
    continue;
  }
  const plain = conv.text;

  // 多版本並列的頁面（第 67 回是「==列藏本==／==程高本==」）：這一回的文字不屬於
  // 本底本，硬收進來等於冒充。報出來、跳過不寫，由 books.yml 的 missing_chapters 記錄。
  if (/^==\s*[^=\n]*本\s*==/m.test(plain)) {
    problems.push(`第 ${n} 回：頁面並列多個版本（${(plain.match(/^==\s*([^=\n]*本)\s*==/gm) || []).join('、')}），不屬單一底本，已跳過`);
    await sleep(350);
    continue;
  }

  // 殘留檢查：轉換規則沒涵蓋到的維基標記會被這裡擋下來，不必靠肉眼看
  const residue = [
    [/^==+/m, '章節標題 =='], [/\{\{/, '模板 {{'], [/\[\[/, '連結 [['],
    [/<ref/i, '註腳 <ref'], [/<\/?[a-z]+[^>]*>/i, 'HTML 標籤'], [/-\{/, '轉換標記 -{'],
    [/【[^】]{0,8}[側眉夾雙批]/, '未抽出的抄本夾註'],
  ].filter(([re]) => re.test(plain)).map(([, name]) => name);
  if (residue.length) problems.push(`第 ${n} 回：轉換後仍殘留 ${residue.join('、')}`);

  const paras = splitParagraphs(plain);
  const heading = (paras[0] || '').trim();

  // 品質閘門：第一段必須是回目，且整回要有足夠內容
  if (!/^(第[一二三四五六七八九十百零〇\d]+回|楔子|引子|卷首|凡例)/.test(heading)) {
    problems.push(`第 ${n} 回：第一段不像回目 →「${heading.slice(0, 30)}」`);
  }
  if (paras.length < 5) problems.push(`第 ${n} 回：只切出 ${paras.length} 段，疑似抓到空頁或轉換失敗`);

  const text = `${paras.join('\n\n')}\n`;
  annTotal += conv.annotations.length;
  index.push({
    chapter: n,
    heading,
    paragraph_count: paras.length,
    text_sha256: sha256(text),
    path: `chapters/${pad3(n)}.txt`,
    ...(conv.annotations.length ? { annotation_count: conv.annotations.length, annotation_path: `annotations/${pad3(n)}.jsonl` } : {}),
  });
  if (!DRY) {
    write(join(outDir, 'chapters', `${pad3(n)}.txt`), text);
    if (conv.annotations.length) {
      write(join(outDir, 'annotations', `${pad3(n)}.jsonl`),
        `${conv.annotations.map((a, k) => JSON.stringify({ id: `${BOOK}-${pad3(n)}-a${String(k + 1).padStart(4, '0')}`, chapter: n, order: k + 1, note: a })).join('\n')}\n`);
    }
  }

  console.log(`  ${pad3(n)}  ${heading.slice(0, 32)}  ${paras.length} 段  ${text.length} 字${conv.annotations.length ? `  夾註 ${conv.annotations.length}` : ''}`);
  if (DRY) {
    console.log(`      首段：${(paras[1] || '').slice(0, 44)}…`);
    console.log(`      末段：${(paras[paras.length - 1] || '').slice(0, 44)}…`);
    if (conv.annotations.length) console.log(`      夾註樣本：${conv.annotations[0].slice(0, 44)}…`);
  }
  await sleep(350);   // 對維基文庫客氣一點
}

if (!DRY) {
  write(join(outDir, 'chapter_index.json'), `${JSON.stringify(index, null, 2)}\n`);
  write(join(outDir, 'metadata.json'), `${JSON.stringify({
    book_id: BOOK,
    edition_id: EDITION,
    source_type: '中文維基文庫（Wikisource）',
    source_page: `https://zh.wikisource.org/wiki/${PAGE_TPL.split('/')[0]}`,
    page_template: `https://zh.wikisource.org/wiki/${PAGE_TPL}`,
    retrieved_at: new Date().toISOString().slice(0, 10),
    chapter_count: index.length,
    annotation_count: annTotal,
    normalization: [
      'wikitext → 純文字',
      '移除 <ref> 編者註腳與註釋段（現代附加物，非小說內容）',
      '抄本夾註（【甲側：…】等脂批）抽出到 annotations/，不混進正文',
      '移除導覽連結、header／樣式／授權模板、分隔線',
      '保留 -{...}- 繁簡轉換抑制標記的內文',
      '<poem> 與 <br> 的換行保留為語意行（縮排標記）',
    ],
    text_changes: '未做繁簡轉換、未改字、未改標點、未經 AI 改寫。',
    license: '原文屬公共領域；維基文庫的校對與排版層為 CC BY-SA 4.0／GFDL',
  }, null, 2)}\n`);
  console.log(`\n寫出 ${index.length} 篇 → ${outDir}${annTotal ? `（另存 ${annTotal} 條抄本夾註）` : ''}`);
}

if (problems.length) {
  console.error(`\n${problems.length} 項問題：`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log(`\n${DRY ? '試抓' : '抓取'}完成，段落與回目檢查全過`);
