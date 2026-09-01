#!/usr/bin/env node
/**
 * 金瓶梅十九位角色 → 結構化索引產生器（供日後搜尋與跨書對照用）。
 *
 * 正本是 _jinpingmei_characters/*.html（front matter + 手寫 HTML body）；本工具只讀不改，
 * 從每一檔逐字抽取既有欄位，輸出到 _data/jinpingmei_characters.json（本檔勿手動編輯，
 * 重跑本工具即可重新生成）。刻意不重構渲染管線、不改 19 個 HTML、不改
 * _layouts/jinpingmei-character.html——見 T6a 裁決範圍。
 *
 * 排除範圍：details「AI 選角檔案」（圖像／語音模型生成指令）——那是提示詞不是角色事實。
 *
 * 不作為：抽不到的欄位一律留空並在摘要回報缺漏數，絕不用模型知識杜撰角色事實
 *（尤其 life_stages：19 檔裡只有 3 檔有「書裡的年紀」時間線，其餘 16 人必須是空陣列）。
 *
 * 用法：node tools/build_jinpingmei_character_index.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
export const SRC_DIR = path.join(ROOT, '_jinpingmei_characters');
const OUT_PATH = path.join(ROOT, '_data', 'jinpingmei_characters.yml');

// tagline 的分級／簡介分隔號：U+00B7 MIDDLE DOT（「主角 · 一句話簡介」），
// 不是外觀相似的 U+30FB KATAKANA MIDDLE DOT（・）——兩者長得像但不同碼位，
// 誤用後者會讓下面的 split 抓不到 tier，19 檔實測皆為 U+00B7（見開發時的掃描紀錄）。
const TIER_DOT = '·';
const KNOWN_TIERS = ['主角', '要角'];

const FIELD_LABELS = { 性別: 'gender', 年齡: 'age', 身份: 'identity', 性格: 'personality' };

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) throw new Error('找不到 front matter（缺少 --- 區塊）');
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    fm[kv[1]] = val;
  }
  return { fm, body: raw.slice(m[0].length) };
}

function splitAliases(raw) {
  if (!raw) return [];
  return raw.split('、').map((s) => s.trim()).filter((s) => s.length > 0);
}

function splitTagline(raw, slug) {
  if (!raw) return { tier: '', tagline: '' };
  const idx = raw.indexOf(TIER_DOT);
  if (idx === -1) {
    throw new Error(`${slug}: tagline 找不到分隔號 U+00B7（"${raw}"）——可能用了外觀相似但不同碼位的點號，需人工核對`);
  }
  const tier = raw.slice(0, idx).trim();
  const tagline = raw.slice(idx + 1).trim();
  if (!KNOWN_TIERS.includes(tier)) {
    throw new Error(`${slug}: tier 不在已知分級 [${KNOWN_TIERS.join('/')}] 內："${tier}"`);
  }
  return { tier, tagline };
}

function extractH2P(body, label, slug, required) {
  const re = new RegExp(`<h2>${label}<\\/h2><p>([\\s\\S]*?)<\\/p>`);
  const m = body.match(re);
  if (!m) {
    if (required) throw new Error(`${slug}: 找不到「${label}」段落`);
    return '';
  }
  return m[1].trim();
}

// 章回連結：<a href="{{ '/jinpingmei/text/002/' | relative_url }}">第二回</a>
function extractChapters(spanSrcHtml) {
  if (!spanSrcHtml) return [];
  const re = /<a href="\{\{ '([^']+)' \| relative_url \}\}">([^<]*)<\/a>/g;
  const out = [];
  let m;
  while ((m = re.exec(spanSrcHtml)) !== null) {
    const numMatch = m[1].match(/\/text\/(\d+)\//);
    out.push({
      permalink: m[1],
      label: m[2],
      number: numMatch ? parseInt(numMatch[1], 10) : null,
    });
  }
  return out;
}

function extractFields(body, slug) {
  const m = body.match(/<dl class="jpm-fields">([\s\S]*?)<\/dl>/);
  if (!m) throw new Error(`${slug}: 找不到 jpm-fields 基本資料`);
  const out = { gender: '', age: '', identity: '', personality: '' };
  const re = /<dt>([^<]*)<\/dt><dd>([^<]*)<\/dd>/g;
  let dm;
  let count = 0;
  while ((dm = re.exec(m[1])) !== null) {
    const key = FIELD_LABELS[dm[1]];
    if (key) {
      out[key] = dm[2].trim();
      count += 1;
    }
  }
  if (count !== 4) throw new Error(`${slug}: jpm-fields 應有 4 欄，實抓到 ${count} 欄`);
  return out;
}

function extractRelationships(body, slug) {
  const m = body.match(/<ul class="jpm-rel-list">([\s\S]*?)<\/ul>/);
  if (!m) throw new Error(`${slug}: 找不到 jpm-rel-list 人物關係`);
  const re = /<li><b>([^<]*)<\/b><span>([^<]*)<\/span><\/li>/g;
  const out = [];
  let lm;
  while ((lm = re.exec(m[1])) !== null) {
    out.push({ name: lm[1].trim(), description: lm[2].trim() });
  }
  const rawLiCount = (m[1].match(/<li>/g) || []).length;
  if (out.length !== rawLiCount) {
    throw new Error(`${slug}: jpm-rel-list 有 ${rawLiCount} 條 <li>，但只解析出 ${out.length} 條——格式跟預期不同`);
  }
  return out;
}

function extractQuotes(body, slug) {
  const m = body.match(/<ul class="jpm-quotes">([\s\S]*?)<\/ul>/);
  if (!m) throw new Error(`${slug}: 找不到 jpm-quotes 原文依據`);
  const liRe = /<li>([\s\S]*?)<\/li>/g;
  const out = [];
  let lm;
  while ((lm = liRe.exec(m[1])) !== null) {
    const liHtml = lm[1];
    const srcMatch = liHtml.match(/<span class="src">([\s\S]*?)<\/span>/);
    const text = (srcMatch ? liHtml.slice(0, srcMatch.index) : liHtml).trim();
    const remainder = srcMatch ? liHtml.slice(srcMatch.index + srcMatch[0].length) : '';
    if (remainder.trim().length > 0) {
      throw new Error(`${slug}: jpm-quotes 有一條 <li> 在 span.src 之後還有未預期內容："${remainder.slice(0, 60)}"`);
    }
    out.push({ text, chapters: extractChapters(srcMatch ? srcMatch[1] : '') });
  }
  return out;
}

function extractLifeStages(body, slug) {
  const m = body.match(/<dl class="jpm-fields jpm-stages">([\s\S]*?)<\/dl>/);
  if (!m) return [];
  const divRe = /<div><dt>([^<]*)<\/dt><dd>([\s\S]*?)<\/dd><\/div>/g;
  const out = [];
  let dm;
  while ((dm = divRe.exec(m[1])) !== null) {
    const ageLabel = dm[1].trim();
    const dd = dm[2];
    const titleMatch = dd.match(/<b>([^<]*)<\/b>/);
    const srcMatch = dd.match(/<span class="src">([\s\S]*?)<\/span>/);
    const noteMatch = dd.match(/<span class="note">([^<]*)<\/span>/);
    const evidence = [...dd.matchAll(/<span class="ev">([^<]*)<\/span>/g)].map((x) => x[1].trim());
    out.push({
      age_label: ageLabel,
      stage_title: titleMatch ? titleMatch[1].trim() : '',
      chapters: extractChapters(srcMatch ? srcMatch[1] : ''),
      evidence,
      note: noteMatch ? noteMatch[1].trim() : '',
    });
  }
  const rawDivCount = (m[1].match(/<div><dt>/g) || []).length;
  if (out.length !== rawDivCount) {
    throw new Error(`${slug}: jpm-stages 有 ${rawDivCount} 個時間點，但只解析出 ${out.length} 個`);
  }
  return out;
}

function extractVersions(body, slug) {
  const m = body.match(/<div class="jpm-versions">([\s\S]*?)<\/div><\/section>/);
  if (!m) return [];
  const re = /<figure><a href="\{\{ '([^']+)' \| relative_url \}\}"[^>]*title="([^"]*)"><img[^>]*alt="([^"]*)"[^>]*><\/a><figcaption>([^<]*)<\/figcaption><\/figure>/g;
  const out = [];
  let fm;
  while ((fm = re.exec(m[1])) !== null) {
    out.push({ image: fm[1], title: fm[2], alt: fm[3], caption: fm[4].trim() });
  }
  const rawFigCount = (m[1].match(/<figure>/g) || []).length;
  if (out.length !== rawFigCount) {
    throw new Error(`${slug}: jpm-versions 有 ${rawFigCount} 張圖，但只解析出 ${out.length} 張`);
  }
  return out;
}

export function extractOne(filePath) {
  const slug = path.basename(filePath, '.html');
  const raw = fs.readFileSync(filePath, 'utf8');
  const { fm, body } = parseFrontMatter(raw);

  const order = parseInt(fm.order, 10);
  if (!Number.isInteger(order)) throw new Error(`${slug}: order 不是整數："${fm.order}"`);

  const { tier, tagline } = splitTagline(fm.tagline, slug);

  return {
    slug,
    order,
    name: fm.name || '',
    aliases: splitAliases(fm.aliases),
    tier,
    tagline,
    fields: extractFields(body, slug),
    appearance: extractH2P(body, '外貌', slug, true),
    temperament: extractH2P(body, '性情', slug, true),
    motivation: extractH2P(body, '動機', slug, true),
    character_arc: extractH2P(body, '人物弧光', slug, true),
    relationships: extractRelationships(body, slug),
    quotes: extractQuotes(body, slug),
    life_stages: extractLifeStages(body, slug),
    visuals: {
      turnaround: {
        image: fm.turnaround || '',
        width: fm.turnaround_w ? parseInt(fm.turnaround_w, 10) : null,
        height: fm.turnaround_h ? parseInt(fm.turnaround_h, 10) : null,
        caption: fm.turnaround_caption || '',
      },
      versions: extractVersions(body, slug),
    },
    permalink: fm.permalink || '',
    title: fm.title || '',
    description: fm.description || '',
  };
}

// ---- 極簡 YAML 產出（無 js-yaml 相依）----
// 純量字串一律用 JSON.stringify：YAML 1.1/1.2 的雙引號流純量跳脫規則是 JSON 跳脫的相容超集
//（\"、\\、\n、\t、\uXXXX 皆通用），因此 JSON 字串常值直接貼進 YAML 雙引號純量是合法的；
// 這樣就不必手刻一個容易漏邊界情況的 YAML 字串跳脫器。
function yamlScalar(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return String(v);
  return JSON.stringify(String(v));
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function yamlBlock(value, indent) {
  const pad = '  '.repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return ' []\n';
    let out = '\n';
    for (const item of value) {
      if (isPlainObject(item) || Array.isArray(item)) {
        const inner = yamlBlock(item, indent + 1);
        // 把子區塊的第一行接在 "- " 後面
        out += `${pad}-${inner.replace(new RegExp(`^\\n${'  '.repeat(indent + 1)}`), ' ')}`;
      } else {
        out += `${pad}- ${yamlScalar(item)}\n`;
      }
    }
    return out;
  }
  if (isPlainObject(value)) {
    const keys = Object.keys(value);
    if (keys.length === 0) return ' {}\n';
    let out = '\n';
    for (const k of keys) {
      const v = value[k];
      if (isPlainObject(v) || Array.isArray(v)) {
        out += `${pad}${k}:${yamlBlock(v, indent + 1)}`;
      } else {
        out += `${pad}${k}: ${yamlScalar(v)}\n`;
      }
    }
    return out;
  }
  return ` ${yamlScalar(value)}\n`;
}

function toYaml(characters) {
  const header = [
    '# _data/jinpingmei_characters.yml',
    '#',
    '# 本檔由 tools/build_jinpingmei_character_index.mjs 從 _jinpingmei_characters/*.html',
    '# 自動產生的索引，供日後搜尋與跨書對照用。正本仍是 _jinpingmei_characters/ 底下那 19 個',
    '# collection 檔案（front matter + 手寫 HTML body）——請勿手動編輯本檔，內容有異動時改正本',
    '# 再重跑：node tools/build_jinpingmei_character_index.mjs',
    '#',
    '# 刻意排除「AI 選角檔案」（圖像／語音模型生成指令）——那是提示詞不是角色事實。',
    '# life_stages 只有 3 人（ximenqing／lijiaoer／mengyulou）有資料，其餘 16 人是空陣列，',
    '# 這是原始資料本身的缺口，不是抽取遺漏，不得用模型知識杜撰補上。',
  ].join('\n');
  let body = 'characters:';
  body += yamlBlock(characters, 1);
  return `${header}\n${body}`;
}

function main() {
  const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.html')).sort();
  const characters = [];
  const errors = [];
  for (const f of files) {
    try {
      characters.push(extractOne(path.join(SRC_DIR, f)));
    } catch (err) {
      errors.push(`${f}: ${err.message}`);
    }
  }

  if (errors.length > 0) {
    console.error(`抽取失敗 ${errors.length} 檔：`);
    for (const e of errors) console.error(`  - ${e}`);
    throw new Error('build_jinpingmei_character_index 失敗：見上方錯誤清單');
  }

  characters.sort((a, b) => a.order - b.order);

  const yaml = toYaml(characters);
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, yaml, 'utf8');

  const withStages = characters.filter((c) => c.life_stages.length > 0);
  const tierCounts = characters.reduce((acc, c) => {
    acc[c.tier] = (acc[c.tier] || 0) + 1;
    return acc;
  }, {});
  const totalRelationships = characters.reduce((n, c) => n + c.relationships.length, 0);
  const totalQuotes = characters.reduce((n, c) => n + c.quotes.length, 0);
  const missingAliases = characters.filter((c) => c.aliases.length === 0).map((c) => c.slug);

  console.log(`已寫入 ${path.relative(ROOT, OUT_PATH)}`);
  console.log(`角色數：${characters.length}`);
  console.log(`分級：${Object.entries(tierCounts).map(([k, v]) => `${k} ${v}`).join('、')}`);
  console.log(`人物關係總條數：${totalRelationships}（平均每人 ${(totalRelationships / characters.length).toFixed(1)} 條）`);
  console.log(`原文依據總條數：${totalQuotes}`);
  console.log(`有「書裡的年紀」時間線：${withStages.length} 人（${withStages.map((c) => c.slug).join('、')}）`);
  console.log(`無別名（aliases 為空陣列）：${missingAliases.length} 人（${missingAliases.join('、')}）`);
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) main();
