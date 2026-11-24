// 轉址回歸測試（2026-11-24）：redirect_from 的來源網址不得撞到真實頁面、不得重複，
// 建置後每個轉址頁的目標都存在、不是自己、也不會繞回來。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  ROOT, hasSite, NO_SITE_REASON, read, trackedFiles, frontMatter, frontMatterValue, redirectFromList,
  sitePages, redirectTarget, siteFileForPath,
} from './_site-audit.mjs';

const SITE_ORIGIN = 'https://swanky.github.io';

function redirectSources() {
  const entries = [];
  for (const path of trackedFiles()) {
    if (!/\.(html|md)$/.test(path) || /^(_layouts|_includes|_site|docs|tests|tools|nft|assets|\.)/.test(path)) continue;
    const fm = frontMatter(read(path));
    if (!fm || !/^redirect_from:/m.test(fm)) continue;
    for (const from of redirectFromList(fm)) entries.push({ path, from, permalink: frontMatterValue(fm, 'permalink') });
  }
  return entries;
}

test('redirect_from 至少涵蓋已知的舊網址，且格式正確', () => {
  const entries = redirectSources();
  assert.ok(entries.length >= 16, `redirect_from 數量異常：${entries.length}`);
  const bad = entries.filter(({ from }) => !from.startsWith('/') || /\s/.test(from) || from.includes('://'));
  assert.deepEqual(bad, [], '來源網址必須是站內絕對路徑');
  const sources = new Set(entries.map(({ from }) => from));
  for (const expected of ['/blog.html', '/archive.html', '/technical-articles.html', '/education-training.html', '/modeling/', '/ai-tutorial/']) {
    assert.ok(sources.has(expected), `舊網址 ${expected} 的轉址不見了`);
  }
});

test('同一個舊網址不會被兩個頁面同時認領', () => {
  const owners = new Map();
  for (const { path, from } of redirectSources()) owners.set(from, [...(owners.get(from) || []), path]);
  const duplicated = [...owners].filter(([, paths]) => new Set(paths).size > 1).map(([from, paths]) => `${from} ← ${paths.join(', ')}`);
  assert.deepEqual(duplicated, []);
});

test('redirect_from 的來源不是該頁自己的網址，也沒有撞到真實存在的來源檔', () => {
  const problems = [];
  for (const { path, from, permalink } of redirectSources()) {
    if (permalink && permalink === from) problems.push(`${path}：來源 ${from} 就是自己的 permalink`);
    const relative = from.replace(/^\//, '');
    const collides = from.endsWith('/')
      ? ['index.html', 'index.md'].some((name) => existsSync(join(ROOT, relative, name)))
      : relative !== path && existsSync(join(ROOT, relative));
    if (collides) problems.push(`${path}：來源 ${from} 已經有真實頁面`);
  }
  assert.deepEqual(problems, []);
});

test('建置產物：每個轉址頁的目標存在、不是自己，且最多轉兩次就到真實頁面', { skip: hasSite ? false : NO_SITE_REASON }, () => {
  const byPath = new Map(sitePages().map((page) => [page.path, page.html]));
  const redirects = [...byPath].filter(([, html]) => redirectTarget(html) !== null);
  assert.ok(redirects.length >= 16, `轉址頁數量異常：${redirects.length}`);
  const problems = [];
  for (const [path, html] of redirects) {
    let current = path;
    let currentHtml = html;
    const trail = [path];
    for (let hop = 0; ; hop += 1) {
      const target = redirectTarget(currentHtml);
      if (target === null) break; // 抵達真實頁面
      if (hop >= 2) { problems.push(`${trail.join(' → ')}：轉址超過兩次`); break; }
      const url = new URL(target, `${SITE_ORIGIN}/${current}`);
      if (url.origin !== SITE_ORIGIN) break; // 轉到站外，不追
      const next = siteFileForPath(url.pathname);
      if (next === null) { problems.push(`${trail.join(' → ')}：目標 ${url.pathname} 不存在`); break; }
      if (trail.includes(next)) { problems.push(`${trail.join(' → ')} → ${next}：轉址迴圈`); break; }
      trail.push(next);
      current = next;
      currentHtml = byPath.get(next) ?? '';
      if (!next.endsWith('.html')) break;
    }
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});
