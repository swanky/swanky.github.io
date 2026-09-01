/**
 * 古典小說文字底本品質評估——可重複跑的同一把尺。
 *
 * 為什麼需要這支工具：素材包附的 QA_REPORT 只驗了「檔案完整、章回切得出來」，
 * 沒驗「文字本身是不是乾淨的繁體原文」。紅樓夢那份底本就是這樣過關的：
 * 檔案完整、120 回都在，但內容是簡→繁機器轉換的劣本。
 *
 * 判別方法＝繁簡對偶字的比例，不是簡體字黑名單。黑名單會誤判：第一版就把
 * 三國演義的「太后」「于禁」、水滸傳的「老种經略相公」（种師道，姓氏）算成
 * 污染，憑空指控了兩個其實乾淨的底本。
 *
 * 用法：
 *   node tools/assess_text_quality.mjs [--json] [--pairs] <檔案或目錄>...
 * 目錄遞歸吃 .txt／.html／.md；.html 會先剝 front matter 與標籤。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

/* trad 可有多個異體（裡／裏 都是傳統寫法，明清白話多作「裏」）。
 * legit＝該簡體形在傳統文本中的正當用法，先扣掉再比。 */
const PAIRS = [
  { name: '裡', trad: ['裡', '裏'], simp: '里', legit: /[一二三四五六七八九十百千萬數幾多餘]里|鄉里|里正|里長|里許|公里|里程|故里|閭里/g },
  { name: '後', trad: ['後'], simp: '后', legit: /皇后|太后|后土|母后|王后|后妃|后宮/g },
  { name: '於', trad: ['於'], simp: '于', legit: /于禁|淳于|于吉|于氏|單于|于闐|于是乎/g },
  { name: '麼', trad: ['麼', '麽'], simp: '么', legit: /斷么|么二|幺/g },
  { name: '種', trad: ['種'], simp: '种', legit: /种師|种經略|老种|小种|种拂|种邵|种輯/g },
  { name: '兒', trad: ['兒'], simp: '儿', legit: null },
  { name: '聽', trad: ['聽'], simp: '听', legit: null },
  { name: '說', trad: ['說'], simp: '说', legit: null },
  { name: '這', trad: ['這'], simp: '这', legit: null },
  { name: '個', trad: ['個', '箇'], simp: '个', legit: null },
  { name: '們', trad: ['們'], simp: '们', legit: null },
  { name: '時', trad: ['時'], simp: '时', legit: null },
  { name: '為', trad: ['為', '爲'], simp: '为', legit: null },
  { name: '來', trad: ['來'], simp: '来', legit: null },
  { name: '國', trad: ['國'], simp: '国', legit: null },
  { name: '會', trad: ['會'], simp: '会', legit: null },
  { name: '對', trad: ['對'], simp: '对', legit: null },
  { name: '過', trad: ['過'], simp: '过', legit: null },
  { name: '門', trad: ['門'], simp: '门', legit: null },
  { name: '長', trad: ['長'], simp: '长', legit: null },
];

const stripHtml = (s) => s
  .replace(/\r\n/g, '\n')                        // 先正規化——工作目錄可能是 CRLF，否則下一行的 ^---\n 比不到
  .replace(/^---\n[\s\S]*?\n---\n/, '')          // Jekyll front matter（否則 YAML 的半形引號會被當成正文）
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<style[\s\S]*?<\/style>/g, '')
  .replace(/<br\s*\/?>/g, '\n')
  .replace(/<\/p>/g, '\n\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

export function assess(text) {
  const t = text.replace(/\r\n/g, '\n');
  const cjk = (t.match(/[㐀-䶿一-鿿]/g) || []).length;
  const count = (re) => (t.match(re) || []).length;
  const countChar = (c) => t.split(c).length - 1;

  const pairs = [];
  let systemicPairs = 0;   // 判定為系統性轉換的對偶組數
  let noiseChars = 0;      // 雜訊等級的簡體字總數
  for (const p of PAIRS) {
    const trad = p.trad.reduce((s, c) => s + countChar(c), 0);
    const simpRaw = countChar(p.simp);
    const legit = p.legit ? count(p.legit) : 0;
    const simp = Math.max(0, simpRaw - legit);
    if (trad + simp === 0) continue;
    const simpShare = Math.round((simp / (trad + simp)) * 1000) / 10;
    const isSystemic = simp >= 20 && simpShare > 50;
    if (isSystemic) systemicPairs += 1; else noiseChars += simp;
    pairs.push({ name: p.name, simpChar: p.simp, trad, simp, simpRaw, legit, simpShare, isSystemic });
  }

  const fullStop = count(/。/g);
  const midDot = count(/．/g);          // 句號被寫成中間點——機器轉檔的典型病徵
  const halfQuote = count(/"/g);
  const curlyQuote = count(/[“”]/g);
  const cornerQuote = count(/[「」『』]/g);
  const blankLines = count(/\n[ \t　]*\n/g);
  const per10k = (n) => (cjk ? Math.round((n / cjk) * 100000) / 10 : 0);

  return {
    cjk,
    blankLines,
    paragraphsPer10k: per10k(blankLines),  // 分段密度；散文長篇低於 ~10 代表幾乎沒分段
    pairs,
    systemicPairs,
    noiseChars,
    noisePer10k: per10k(noiseChars),
    punctuation: { fullStop, midDot, halfQuote, curlyQuote, cornerQuote },
    midDotRatio: fullStop + midDot ? Math.round((midDot / (fullStop + midDot)) * 1000) / 10 : 0,
  };
}

/**
 * 由量測結果推導 books.yml 該填的 text_fidelity。
 *
 * 有這條規則，忠實度就不是逐本目測的印象，而是可重現的推導結果——
 * 換了底本重跑就知道標籤要不要跟著改。
 *   converted   ≥3 組對偶字系統性簡化，或句末大量用「．」→ 不是原文，是轉換本
 *   transcribed 雜訊等級的簡體字每萬字 ≥1 → 謄本，用字有少量出入
 *   verbatim    以上皆非 → 逐字忠於底本
 */
export function suggestFidelity(a) {
  if (a.systemicPairs >= 3 || a.midDotRatio > 5) return 'converted';
  if (a.noisePer10k >= 1) return 'transcribed';
  return 'verbatim';
}

/** 依量測結果下判斷。門檻集中寫在這裡，不散落在報告文字裡。 */
export function verdict(a) {
  const fails = [];
  const warns = [];
  if (a.systemicPairs >= 3) {
    const which = a.pairs.filter((p) => p.isSystemic).map((p) => `${p.name}→${p.simp}(${p.simpShare}%)`).join('、');
    fails.push(`${a.systemicPairs} 組對偶字呈系統性簡化：${which}——這不是原文，是轉換本`);
  } else if (a.systemicPairs > 0) {
    warns.push(`${a.systemicPairs} 組對偶字以簡體形為主，需人工判斷是否為異體字`);
  }
  if (a.midDotRatio > 5) fails.push(`${a.midDotRatio}% 的句末標點是「．」而非「。」`);
  if (a.punctuation.halfQuote > 50) fails.push(`${a.punctuation.halfQuote} 個半形引號 "`);
  if (a.paragraphsPer10k < 8) fails.push(`分段密度每萬字僅 ${a.paragraphsPer10k} 段——幾乎沒有分段`);
  else if (a.paragraphsPer10k < 15) warns.push(`分段密度偏低（每萬字 ${a.paragraphsPer10k} 段）`);
  if (a.noisePer10k > 2) warns.push(`雜訊等級的簡體字每萬字 ${a.noisePer10k} 個（共 ${a.noiseChars} 處）`);
  return { pass: fails.length === 0, fails, warns };
}

/* ── CLI ──────────────────────────────────────────────────── */
const collect = (p) => {
  if (statSync(p).isFile()) return [p];
  return readdirSync(p).flatMap((f) => collect(join(p, f))).filter((f) => ['.txt', '.html', '.md'].includes(extname(f)));
};

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const showPairs = args.includes('--pairs');
const targets = args.filter((a) => !a.startsWith('--'));
if (!targets.length) { console.error('用法：node tools/assess_text_quality.mjs [--json] [--pairs] <檔案或目錄>...'); process.exit(1); }

const results = [];
for (const target of targets) {
  const files = collect(target);
  if (!files.length) { console.error(`${target}：找不到可讀的文字檔`); continue; }
  const text = files.map((f) => (extname(f) === '.txt' ? readFileSync(f, 'utf8').replace(/\r\n/g, '\n') : stripHtml(readFileSync(f, 'utf8')))).join('\n\n');
  const a = assess(text);
  results.push({ target, files: files.length, ...a, verdict: verdict(a), fidelity: suggestFidelity(a) });
}

if (asJson) { console.log(JSON.stringify(results, null, 2)); process.exit(0); }

for (const r of results) {
  const tag = r.verdict.pass ? (r.verdict.warns.length ? '△ 可用（有保留）' : '✓ 乾淨') : '✗ 不合格';
  console.log(`\n${tag}  ${r.target}`);
  console.log(`  漢字 ${r.cjk.toLocaleString()}｜${r.files} 檔｜分段 ${r.blankLines}（每萬字 ${r.paragraphsPer10k}）`);
  console.log(`  系統性簡化對偶組 ${r.systemicPairs}／${r.pairs.length}｜雜訊簡體字 ${r.noiseChars}（每萬字 ${r.noisePer10k}）`);
  console.log(`  → books.yml 該填 text_fidelity: ${suggestFidelity(r)}`);
  const p = r.punctuation;
  console.log(`  句號 ${p.fullStop}｜中間點 ${p.midDot}（占句末 ${r.midDotRatio}%）｜引號 「」${p.cornerQuote} “”${p.curlyQuote} "${p.halfQuote}`);
  if (showPairs) {
    for (const q of r.pairs.filter((x) => x.simp > 0 || x.isSystemic)) {
      console.log(`    ${x_(q)}`);
    }
  }
  for (const f of r.verdict.fails) console.log(`    ✗ ${f}`);
  for (const w of r.verdict.warns) console.log(`    △ ${w}`);
}
function x_(q) {
  return `${q.name}/${q.simpChar}  繁 ${q.trad}　簡 ${q.simpRaw}${q.legit ? `（扣正當用法 ${q.legit}）` : ''} → 有效 ${q.simp}　簡體占比 ${q.simpShare}%${q.isSystemic ? '  ← 系統性' : ''}`;
}
console.log('');
