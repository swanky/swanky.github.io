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
 *   --page   維基文庫頁名樣板，{NNN} 會替換成補零三位的回數
 *   --dry N  只抓前 N 回並印出結果，不寫檔（用來確認轉換規則）
 *
 * 輸出：content/<book>/editions/<edition>/{chapters/NNN.txt, chapter_index.json, metadata.json}
 * 之後照既有流程：node tools/import_book_chapters.mjs <book> <edition>
 *
 * 轉換規則的原則：**只移除維基文庫的排版與編者附加物，不動原文一個字。**
 * 被移除的是 <ref> 註腳（現代編者註解，不是小說內容）、導覽連結、樣式與授權模板。
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
 * wikitext → 純文字。
 * 順序重要：先拆掉會包住正文的結構（ref、模板、連結），最後才處理空白。
 */
export function wikitextToPlain(wt) {
  let s = wt.replace(/\r\n/g, '\n');

  // 1) 編者註腳與註釋段——現代附加物，不是小說原文
  s = s.replace(/<ref[^>]*\/>/g, '');
  s = s.replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '');
  // 標題用字兩岸混雜（註釋／注釋／注释／註解…），一律涵蓋；這一段到檔尾全部丟掉
  s = s.replace(/^==+\s*[註注][釋释解][^=\n]*==+[\s\S]*$/m, '');
  s = s.replace(/^==+\s*(?:参考|參考|外部[链連][结結]|參見|参见)[^=\n]*==+[\s\S]*$/m, '');
  s = s.replace(/<references\s*\/?>/g, '');

  // 2) <poem> 內每一行都是語意行（詩詞、唱詞），標上縮排讓下游的
  //    logicalLines() 不把它們接成一行；同一個 poem 區塊視為一個段落。
  s = s.replace(/<poem>([\s\S]*?)<\/poem>/g, (_, inner) => {
    const lines = inner.split('\n').map((l) => l.trim()).filter(Boolean);
    return `\n\n${lines.map((l) => `    ${l}`).join('\n')}\n\n`;
  });

  // 3) 繁簡轉換抑制標記 -{...}- ：保留內文
  s = s.replace(/-\{([^{}]*)\}-/g, '$1');

  // 4) 有內容的模板：取最後一個參數當內容（{{center|X}}、{{~~|X}}）
  for (let i = 0; i < 4; i += 1) {                       // 巢狀模板，多跑幾輪
    s = s.replace(/\{\{[^{}|]*\|([^{}]*)\}\}/g, '$1');
  }
  // 5) 無內容模板（樣式、授權、作品標記）整個丟掉
  s = s.replace(/\{\{[^{}]*\}\}/g, '');

  // 6) 導覽行——**按結構判斷**：整行只由 [[...]] 連結與空白組成就整行刪掉。
  //    不要比對顯示文字：紅樓夢第 80 回的下一回寫成「高續下一回」，
  //    任何固定字樣清單都會漏掉這種在地變體。
  s = s.replace(/^(?:[\s　]*\[\[[^\]]*\]\])+[\s　]*$/gm, '');

  // 7) 內部連結：[[目標|顯示]] → 顯示；[[目標]] → 目標
  s = s.replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1');
  s = s.replace(/\[\[([^\]]*)\]\]/g, '$1');
  s = s.replace(/\[https?:\/\/\S+\s+([^\]]*)\]/g, '$1');

  // 7) 粗體斜體、分隔線、HTML 註解、殘餘標籤
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
  s = s.replace(/<\/?(?:br|small|big|span|div|center|p|sup|sub|i|b|u|s|tt|code|em|strong|font|abbr)[^>]*>/g, '');

  // 8) 導覽行（整行只剩「回目录 下一回」這類殘骸）
  s = s.replace(/^[\s　]*(?:回目[录錄]|上一[回篇]|下一[回篇]|目[录錄])(?:[\s　]+(?:回目[录錄]|上一[回篇]|下一[回篇]|目[录錄]))*[\s　]*$/gm, '');

  // 9) 空白收尾
  s = s.split('\n').map((l) => (/^\s+\S/.test(l) ? l.replace(/\s+$/, '') : l.trim())).join('\n');
  s = s.replace(/\n{3,}/g, '\n\n').trim();
  return `${s}\n`;
}

const splitParagraphs = (t) => t.split(/\n\s*\n/).map((p) => p.replace(/\s+$/, '')).filter((p) => p.trim());

const outDir = join('content', BOOK, 'editions', EDITION);
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s, 'utf8'); };

const index = [];
const problems = [];
const limit = DRY ? Math.min(DRY, TO - FROM + 1) : TO - FROM + 1;

for (let i = 0; i < limit; i += 1) {
  const n = FROM + i;
  const pageName = PAGE_TPL.replace('{NNN}', pad3(n));
  let plain;
  try {
    plain = wikitextToPlain(await fetchRaw(pageName));
  } catch (e) {
    problems.push(`第 ${n} 回：${e.message}`);
    continue;
  }
  // 殘留檢查：轉換規則沒涵蓋到的維基標記會被這裡擋下來，不必靠肉眼看
  const residue = [
    [/^==+/m, '章節標題 =='], [/\{\{/, '模板 {{'], [/\[\[/, '連結 [['],
    [/<ref/i, '註腳 <ref'], [/<\/?[a-z]+[^>]*>/i, 'HTML 標籤'], [/-\{/, '轉換標記 -{'],
  ].filter(([re]) => re.test(plain)).map(([, name]) => name);
  if (residue.length) problems.push(`第 ${n} 回：轉換後仍殘留 ${residue.join('、')}`);

  const paras = splitParagraphs(plain);
  const heading = (paras[0] || '').trim();

  // 品質閘門：第一段必須是回目，且整回要有足夠內容
  if (!/^(第[一二三四五六七八九十百零〇\d]+回|楔子|引子|卷首)/.test(heading)) {
    problems.push(`第 ${n} 回：第一段不像回目 →「${heading.slice(0, 30)}」`);
  }
  if (paras.length < 5) problems.push(`第 ${n} 回：只切出 ${paras.length} 段，疑似抓到空頁或轉換失敗`);

  const text = `${paras.join('\n\n')}\n`;
  index.push({ chapter: n, heading, paragraph_count: paras.length, text_sha256: sha256(text), path: `chapters/${pad3(n)}.txt` });
  if (!DRY) write(join(outDir, 'chapters', `${pad3(n)}.txt`), text);

  console.log(`  ${pad3(n)}  ${heading.slice(0, 34)}  ${paras.length} 段  ${text.length} 字`);
  if (DRY) {
    console.log(`      首段：${(paras[1] || '').slice(0, 46)}…`);
    console.log(`      末段：${(paras[paras.length - 1] || '').slice(0, 46)}…`);
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
    normalization: [
      'wikitext → 純文字',
      '移除 <ref> 編者註腳與註釋段（現代附加物，非小說內容）',
      '移除導覽連結、樣式與授權模板、分隔線',
      '保留 -{...}- 繁簡轉換抑制標記的內文',
      '<poem> 區塊每行縮排保留為語意行',
    ],
    text_changes: '未做繁簡轉換、未改字、未改標點、未經 AI 改寫。',
    license: '原文屬公共領域；維基文庫的校對與排版層為 CC BY-SA 4.0／GFDL',
  }, null, 2)}\n`);
  console.log(`\n寫出 ${index.length} 篇 → ${outDir}`);
}

if (problems.length) {
  console.error(`\n${problems.length} 項問題：`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log(`\n${DRY ? '試抓' : '抓取'}完成，段落與回目檢查全過`);
