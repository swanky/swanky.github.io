import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('../', import.meta.url));
const PUBLIC_EXTENSIONS = new Set(['.html', '.md']);
const ALWAYS_FORBIDDEN_RWA_TERMS = ['真實世界資產', '實體世界資產'];
const CONTEXTUAL_FORBIDDEN_RWA_TERMS = ['真實資產'];
const NON_PUBLIC_DIRECTORIES = new Set([
  '.agents',
  '.claude',
  '.git',
  '.hermes',
  '.playwright-mcp',
  '_site',
  'assets',
  'docs',
  'tests',
  'tools',
]);
const RWA_ENTRY_FILES = [
  'technical/articles.html',
  'technical/rwa/index.html',
  '_includes/header.html',
];

function collectPublicSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && NON_PUBLIC_DIRECTORIES.has(entry.name)) return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectPublicSourceFiles(path);
    if (!PUBLIC_EXTENSIONS.has(extname(entry.name))) return [];

    const repoPath = relative(REPO_ROOT, path);
    return extname(entry.name) === '.html' || repoPath.startsWith('_posts') ? [path] : [];
  });
}

function findForbiddenRwaTerms(path, source) {
  const isRwaRelated = relative(REPO_ROOT, path).toLowerCase().includes('rwa') || source.includes('RWA');

  return source
    .split(/\r?\n/)
    .map((line, index) => ({ path, line, lineNumber: index + 1 }))
    .filter(({ line }) => (
      ALWAYS_FORBIDDEN_RWA_TERMS.some((term) => line.includes(term))
      || (isRwaRelated && CONTEXTUAL_FORBIDDEN_RWA_TERMS.some((term) => line.includes(term)))
    ));
}

test('公開來源掃描涵蓋網站根頁與主要內容區', () => {
  const publicFiles = new Set(
    collectPublicSourceFiles(REPO_ROOT).map((path) => relative(REPO_ROOT, path).replaceAll('\\', '/')),
  );

  for (const expected of ['index.html', 'photography/index.html', 'press/index.html', 'explore/index.html']) {
    assert.ok(publicFiles.has(expected), `公開來源掃描漏掉 ${expected}`);
  }
});

test('RWA 關聯判定套用整份檔案而非單一行', () => {
  const violations = findForbiddenRwaTerms(
    join(REPO_ROOT, 'example.html'),
    '第一段介紹 RWA。\n下一段誤寫真實資產。',
  );

  assert.equal(violations.length, 1);
  assert.equal(violations[0].lineNumber, 2);
});

test('硬禁錯譯不需要同檔先出現 RWA', () => {
  const violations = findForbiddenRwaTerms(
    join(REPO_ROOT, 'example.html'),
    '這一頁誤寫真實世界資產，但沒有使用英文縮寫。',
  );

  assert.equal(violations.length, 1);
});

test('RWA 相關公開內容不使用錯譯', () => {
  const violations = collectPublicSourceFiles(REPO_ROOT)
    .flatMap((path) => findForbiddenRwaTerms(path, readFileSync(path, 'utf8')))
    .map(({ path, line, lineNumber }) => `${relative(REPO_ROOT, path)}:${lineNumber} ${line.trim()}`);

  assert.deepEqual(
    violations,
    [],
    `RWA 請一律寫「現實世界資產」，不可使用錯譯：\n${violations.join('\n')}`,
  );
});

test('RWA 技術入口與系列頁首次出現時使用完整術語', () => {
  const violations = RWA_ENTRY_FILES.flatMap((file) => {
    const firstOccurrence = readFileSync(join(REPO_ROOT, file), 'utf8')
      .split(/\r?\n/)
      .map((line, index) => ({ file, line, lineNumber: index + 1 }))
      .find(({ line }) => line.includes('RWA'));

    return firstOccurrence && !firstOccurrence.line.includes('現實世界資產')
      ? [`${file}:${firstOccurrence.lineNumber} ${firstOccurrence.line.trim()}`]
      : [];
  });

  assert.deepEqual(
    violations,
    [],
    `技術入口與系列頁首次出現 RWA 時，請寫「現實世界資產（RWA）」：\n${violations.join('\n')}`,
  );
});
