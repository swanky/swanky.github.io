/**
 * 一次性素材 staging：把《水滸傳》pilot 範圍的原文搬進 repo 版本控制。
 *
 * 修掉 docs/novel-platform/current-state.md problem 3（來源在 repo 外、無授權與 hash 紀錄）：
 * 匯入器與驗證器之後一律只讀 content/ 下的 staged 原文，不再依賴 C:\Users\...\Desktop 的素材包。
 *
 * 同時修掉素材包的切割缺陷：「楔子」被誤歸進 normalized/preamble.txt，沒進 chapters/。
 * 楔子是正文開篇（結尾自述「一部七十回正書」「且聽初回分解」），本腳本把它切成第 000 篇。
 *
 * 用法：node tools/stage_shuihu_pilot.mjs [--src <素材包根目錄>]
 * 冪等：重跑結果相同。原文逐位元組不改（楔子僅做行範圍切割，不動任何字元）。
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const DEFAULT_SRC = 'C:/Users/swank/Desktop/classic_chinese_novels_text_only_2026-08-09';
const argSrc = process.argv.indexOf('--src');
const SRC = argSrc > -1 ? process.argv[argSrc + 1] : DEFAULT_SRC;

const BOOK = 'shuihu';
const EDITION = 'gutenberg-23863';
const PILOT_CHAPTERS = [1, 2, 3, 4, 5]; // 楔子（000）另外處理
const WEDGE_FIRST_LINE = 5; // preamble.txt 第 6 行（0-indexed 5）起是楔子正文；前 5 行是 Gutenberg 製作者標記與空行

const srcEd = join(SRC, 'books', BOOK, 'editions', EDITION);
const outEd = join('content', BOOK, 'editions', EDITION);

const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s, 'utf8'); };

/** 段落切割：以空行為界。與素材包 paragraphs/*.jsonl 的產生規則相同，切完會回頭核對段數。 */
export function splitParagraphs(text) {
  return text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

const srcIndex = JSON.parse(readFileSync(join(srcEd, 'chapter_index.json'), 'utf8'));
const srcMeta = JSON.parse(readFileSync(join(srcEd, 'metadata.json'), 'utf8'));

const outIndex = [];
const problems = [];

// ── 第 000 篇：從 preamble.txt 切出楔子 ────────────────────────────
const preamble = readFileSync(join(srcEd, 'normalized', 'preamble.txt'), 'utf8').replace(/\r\n/g, '\n');
const preLines = preamble.split('\n');
if (!preLines[WEDGE_FIRST_LINE].startsWith('楔子')) {
  throw new Error(`preamble.txt 第 ${WEDGE_FIRST_LINE + 1} 行不是楔子開頭，素材包結構可能已變：${preLines[WEDGE_FIRST_LINE].slice(0, 30)}`);
}
const wedgeText = preLines.slice(WEDGE_FIRST_LINE).join('\n').replace(/\n+$/, '\n');
const wedgeParas = splitParagraphs(wedgeText);
write(join(outEd, 'chapters', '000.txt'), wedgeText);
outIndex.push({
  chapter: 0,
  heading: wedgeParas[0],
  paragraph_count: wedgeParas.length,
  text_sha256: sha256(wedgeText),
  path: 'chapters/000.txt',
  provenance: `切自 normalized/preamble.txt 第 ${WEDGE_FIRST_LINE + 1} 行起至檔尾（素材包 chapters/ 遺漏此篇）`,
});

// ── 第 001–005 篇：逐位元組複製 ─────────────────────────────────
for (const n of PILOT_CHAPTERS) {
  const pad = String(n).padStart(3, '0');
  const srcEntry = srcIndex.find((c) => c.chapter === n);
  if (!srcEntry) throw new Error(`素材包 chapter_index.json 找不到第 ${n} 回`);
  const text = readFileSync(join(srcEd, srcEntry.path), 'utf8').replace(/\r\n/g, '\n');

  // 驗一：檔案 hash 必須等於素材包記錄值（確認複製沒改到字）
  const h = sha256(text);
  if (h !== srcEntry.text_sha256) problems.push(`第 ${n} 回 hash 不符：素材包 ${srcEntry.text_sha256.slice(0, 12)} vs 實讀 ${h.slice(0, 12)}`);

  // 驗二：自己的段落切割器必須切出素材包記錄的段數（獨立實作交叉驗證）
  const paras = splitParagraphs(text);
  if (paras.length !== srcEntry.paragraph_count) problems.push(`第 ${n} 回段數不符：素材包 ${srcEntry.paragraph_count} vs 本切割器 ${paras.length}`);

  write(join(outEd, 'chapters', `${pad}.txt`), text);
  outIndex.push({
    chapter: n,
    heading: srcEntry.heading,
    paragraph_count: paras.length,
    text_sha256: h,
    path: `chapters/${pad}.txt`,
  });
}

write(join(outEd, 'chapter_index.json'), `${JSON.stringify(outIndex, null, 2)}\n`);
write(join(outEd, 'metadata.json'), `${JSON.stringify({
  ...srcMeta,
  staged_from: 'classic_chinese_novels_text_only_2026-08-09',
  staged_scope: `楔子＋第 ${PILOT_CHAPTERS[0]}–${PILOT_CHAPTERS[PILOT_CHAPTERS.length - 1]} 回（pilot）`,
  staged_note: '楔子由 normalized/preamble.txt 切出，素材包 chapters/ 未收；其餘章回逐位元組複製，hash 已核對。',
}, null, 2)}\n`);

const total = outIndex.reduce((s, c) => s + c.paragraph_count, 0);
console.log(`staged ${outIndex.length} 篇 → ${outEd}`);
for (const c of outIndex) console.log(`  ${c.path}  ${c.heading.slice(0, 28)}  ${c.paragraph_count} 段  ${c.text_sha256.slice(0, 12)}`);
console.log(`段落合計 ${total}`);
if (problems.length) { console.error('\n驗證失敗：'); for (const p of problems) console.error(`  ✗ ${p}`); process.exit(1); }
console.log('hash 與段數交叉驗證全過');
