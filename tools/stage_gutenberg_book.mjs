/**
 * 把 Project Gutenberg 素材包的章回原文 staged 進 repo 版本控制。
 *
 * 取代原本只服務水滸傳 pilot 的 tools/stage_shuihu_pilot.mjs——同一套流程要用在
 * 三國演義與西遊記，寫死一本書沒道理。
 *
 * 修掉 docs/novel-platform/current-state.md problem 3（來源在 repo 外、無授權與
 * hash 紀錄）：匯入器與驗證器之後一律只讀 content/ 下的 staged 原文。
 *
 * 也修掉素材包的切割缺陷：水滸傳的「楔子」被誤歸進 normalized/preamble.txt，
 * chapters/ 完全沒收。楔子是正文開篇（結尾自述「一部七十回正書」「且聽初回分解」），
 * 本腳本偵測 preamble 裡是否有正文標題（楔子／引子／卷首／凡例），有就切成第 000 篇。
 * 三國與西遊的 preamble 只有一行 Gutenberg 製作者標記，不會誤收。
 *
 * 用法：
 *   node tools/stage_gutenberg_book.mjs --book shuihu --edition gutenberg-23863 --from 1 --to 70
 *   [--src <素材包根目錄>]
 *
 * 冪等：重跑結果相同。原文逐位元組不改（楔子僅做行範圍切割，不動任何字元）。
 * 每一回都對照素材包記錄的 sha256，並用自寫的段落切割器交叉驗證段數。
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i > -1 ? argv[i + 1] : d; };
const BOOK = arg('book');
const EDITION = arg('edition');
const FROM = Number(arg('from', 1));
const TO = Number(arg('to'));
const SRC = arg('src', 'C:/Users/swank/Desktop/classic_chinese_novels_text_only_2026-08-09');
if (!BOOK || !EDITION || !TO) {
  console.error('用法：node tools/stage_gutenberg_book.mjs --book <id> --edition <id> --from 1 --to <N> [--src <素材包>]');
  process.exit(1);
}

const srcEd = join(SRC, 'books', BOOK, 'editions', EDITION);
const outEd = join('content', BOOK, 'editions', EDITION);

const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s, 'utf8'); };
const pad3 = (n) => String(n).padStart(3, '0');

/** 段落切割：以空行為界。與素材包 paragraphs/*.jsonl 同規則，切完會回頭核對段數。 */
export const splitParagraphs = (text) =>
  text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

const srcIndex = JSON.parse(readFileSync(join(srcEd, 'chapter_index.json'), 'utf8'));
const srcMeta = JSON.parse(readFileSync(join(srcEd, 'metadata.json'), 'utf8'));

const outIndex = [];
const problems = [];

// ── 第 000 篇：preamble 裡若藏著正文開篇（水滸傳的楔子），切出來 ──────────
const preamble = readFileSync(join(srcEd, 'normalized', 'preamble.txt'), 'utf8').replace(/\r\n/g, '\n');
const preLines = preamble.split('\n');
const leadIdx = preLines.findIndex((l) => /^(楔子|引子|卷首|凡例)/.test(l.trim()));
if (leadIdx > -1 && FROM === 1) {
  const leadText = preLines.slice(leadIdx).join('\n').replace(/\n+$/, '\n');
  const leadParas = splitParagraphs(leadText);
  write(join(outEd, 'chapters', '000.txt'), leadText);
  outIndex.push({
    chapter: 0,
    heading: leadParas[0],
    paragraph_count: leadParas.length,
    text_sha256: sha256(leadText),
    path: 'chapters/000.txt',
    provenance: `切自 normalized/preamble.txt 第 ${leadIdx + 1} 行起至檔尾（素材包 chapters/ 遺漏此篇）`,
  });
  console.log(`  000  ${leadParas[0].slice(0, 30)}  ${leadParas.length} 段  ← 從 preamble 補回`);
}

// ── 各回：逐位元組複製，並雙重交叉驗證 ─────────────────────────────
for (let n = FROM; n <= TO; n += 1) {
  const entry = srcIndex.find((c) => c.chapter === n);
  if (!entry) { problems.push(`素材包 chapter_index.json 找不到第 ${n} 回`); continue; }
  const text = readFileSync(join(srcEd, entry.path), 'utf8').replace(/\r\n/g, '\n');

  // 驗一：hash 必須等於素材包記錄值（確認複製沒改到字）
  const h = sha256(text);
  if (h !== entry.text_sha256) problems.push(`第 ${n} 回 hash 不符：素材包 ${entry.text_sha256.slice(0, 12)} vs 實讀 ${h.slice(0, 12)}`);

  // 驗二：自寫的段落切割器要切出素材包記錄的段數（獨立實作交叉驗證）
  const paras = splitParagraphs(text);
  if (paras.length !== entry.paragraph_count) problems.push(`第 ${n} 回段數不符：素材包 ${entry.paragraph_count} vs 本切割器 ${paras.length}`);

  // 驗三：第一段必須是回目（下游匯入器靠這條規則把 p0001 當標題）
  if (paras[0].replace(/[\s　]/g, '') !== entry.heading.replace(/[\s　]/g, '')) {
    problems.push(`第 ${n} 回第一段不是回目：「${paras[0].slice(0, 24)}」`);
  }

  write(join(outEd, 'chapters', `${pad3(n)}.txt`), text);
  outIndex.push({ chapter: n, heading: entry.heading, paragraph_count: paras.length, text_sha256: h, path: `chapters/${pad3(n)}.txt` });
}

write(join(outEd, 'chapter_index.json'), `${JSON.stringify(outIndex, null, 2)}\n`);
write(join(outEd, 'metadata.json'), `${JSON.stringify({
  ...srcMeta,
  staged_from: 'classic_chinese_novels_text_only_2026-08-09',
  staged_scope: `${leadIdx > -1 && FROM === 1 ? '卷首＋' : ''}第 ${FROM}–${TO} 回`,
  staged_note: leadIdx > -1 && FROM === 1
    ? '卷首（楔子）由 normalized/preamble.txt 切出，素材包 chapters/ 未收；其餘章回逐位元組複製，hash 已核對。'
    : '章回逐位元組複製，hash 已核對。',
}, null, 2)}\n`);

const total = outIndex.reduce((s, c) => s + c.paragraph_count, 0);
console.log(`\nstaged ${outIndex.length} 篇 → ${outEd}｜段落合計 ${total}`);
if (problems.length) {
  console.error(`\n${problems.length} 項驗證失敗：`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log('hash、段數、回目三重交叉驗證全過');
