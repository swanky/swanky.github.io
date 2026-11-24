// 品牌／雇主切割回歸測試（2026-11-24）：公開來源與建置產物不得出現雇主公司名，
// 個人稱謂一律「大型電信業技術主管」（AGENTS.md「個人稱謂」）。結構化資料也不放 worksFor。
//
// 這個 repo 是公開的，所以禁用字樣本身不以明文寫在這裡——以 base64 存放、執行時才解開，
// 否則「檢查雇主名的測試」自己就成了全站唯一寫出雇主名的檔案。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, SITE, hasSite, NO_SITE_REASON, trackedFiles } from './_site-audit.mjs';

const decode = (value) => Buffer.from(value, 'base64').toString('utf8');
// 依序：中文全名（台／臺兩種寫法）、中文簡稱、英文名（中間可有空白、連字號、底線或無間隔）
const FORBIDDEN = [
  new RegExp(decode('W+WPsOiHul3ngaPlpKflk6XlpKc='), 'u'),
  new RegExp(decode('W+WPsOiHul3lk6XlpKc='), 'u'),
  new RegExp(decode('dGFpd2FuW1xzXy1dKm1vYmlsZQ=='), 'i'),
];

const TEXT_EXTENSIONS = /\.(html?|md|markdown|ya?ml|json|txt|xml|js|mjs|cjs|css|scss|svg|py|ps1|rb|sh|toml|webmanifest|csv|liquid)$/i;
const MAX_BYTES = 8 * 1024 * 1024;

function findHits(text) {
  return FORBIDDEN.some((pattern) => pattern.test(text));
}

test('禁用字樣的比對規則有效（防止解碼壞掉而整個測試空轉）', () => {
  const samples = ['5Y+w54Gj5aSn5ZOl5aSn', '6Ie654Gj5aSn5ZOl5aSn', '5Y+w5ZOl5aSn', 'VGFpd2FuIE1vYmlsZQ==', 'dGFpd2FubW9iaWxl'].map(decode);
  for (const sample of samples) assert.ok(findHits(`前文 ${sample} 後文`), '應該要比對得到');
  assert.equal(findHits('大型電信業技術主管，畢業於台灣大學；Taiwan 的 mobile 網路'), false);
});

test('git 追蹤的文字檔不含雇主名稱', () => {
  const hits = [];
  for (const path of trackedFiles()) {
    const isDotfile = path.split('/').pop().startsWith('.');
    if (!TEXT_EXTENSIONS.test(path) && !isDotfile) continue;
    const full = join(ROOT, path);
    let size;
    try { size = statSync(full).size; } catch { continue; } // 已追蹤但工作目錄沒有的檔
    if (size > MAX_BYTES) continue;
    if (findHits(readFileSync(full, 'utf8'))) hits.push(path);
  }
  assert.deepEqual(hits, [], `這些檔案出現雇主名稱：\n${hits.join('\n')}`);
});

test('公開版型與資料不輸出 worksFor', () => {
  const hits = trackedFiles()
    .filter((path) => /^(_includes|_layouts|_data)\//.test(path) || (/\.(html|md)$/.test(path) && !/^(docs|tests|tools|\.)/.test(path)))
    .filter((path) => { try { return /["']worksFor["']/.test(readFileSync(join(ROOT, path), 'utf8')); } catch { return false; } });
  assert.deepEqual(hits, []);
});

test('建置產物：所有文字檔不含雇主名稱，結構化資料沒有 worksFor', { skip: hasSite ? false : NO_SITE_REASON }, () => {
  const hits = [];
  let scanned = 0;
  const walk = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) { walk(full, rel); continue; }
      if (!TEXT_EXTENSIONS.test(entry.name) || statSync(full).size > MAX_BYTES) continue;
      scanned += 1;
      const text = readFileSync(full, 'utf8');
      if (findHits(text)) hits.push(`${rel}（雇主名稱）`);
      if (entry.name.endsWith('.html') && /"worksFor"/.test(text)) hits.push(`${rel}（worksFor）`);
    }
  };
  walk(SITE, '');
  assert.ok(scanned > 1000, `_site 掃描檔數異常：${scanned}`);
  assert.deepEqual(hits, [], hits.join('\n'));
});
