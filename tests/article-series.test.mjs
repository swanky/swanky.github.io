// article-series.test.mjs — 文章互連（系列導覽框、AI 入門教材入口、共同標籤延伸閱讀）的接線與資料契約檢查。
// Liquid 對打錯的 slug 不會報錯，只會默默不顯示，所以在這裡擋：
//   Agentic 系列名單（agentic_groups）裡的每個 slug 都要對得到 _posts 的文章；
//   文章 front matter 的 ai_learn: "<單元>/<章節>" 都要存在於 _data/ai_learn.yml。
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(REPO_ROOT, path), 'utf8');
const postFiles = readdirSync(join(REPO_ROOT, '_posts')).filter((name) => /\.(md|html)$/.test(name));

// 極簡 yml 讀法（同 ai-learn.test.mjs）：只抓 modules 底下的 module slug 與其 chapters 的 slug
function loadModules() {
  const lines = read('_data/ai_learn.yml').split(/\r?\n/);
  const modules = {};
  let current = null;
  let section = null;
  for (const line of lines) {
    let m;
    if ((m = line.match(/^  - slug: (\S+)/))) { current = m[1]; modules[current] = new Set(); section = null; continue; }
    if (/^    chapters:/.test(line)) { section = 'chapters'; continue; }
    if (/^    [a-z_]+:/.test(line)) { section = null; continue; }
    if (current && section === 'chapters' && (m = line.match(/^      - slug: (\S+)/))) modules[current].add(m[1]);
    if (/^[a-z_]+:/.test(line) && !line.startsWith('modules:')) current = null;
  }
  return modules;
}

function frontMatter(source) {
  return source.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
}

// agentic_groups 底下每組的 posts 清單（縮排固定：6 格「- slug」）
function agenticSlugs() {
  const fm = frontMatter(read('technical/agentic-engineering/index.html'));
  const block = fm.split(/^agentic_groups:\s*$/m)[1] ?? '';
  return [...block.matchAll(/^      - (\S+)\s*$/gm)].map((m) => m[1]);
}

test('系列導覽 include 存在，且 article layout 在延伸閱讀之前引入', () => {
  assert.ok(existsSync(join(REPO_ROOT, '_includes/series-nav.html')), '缺 _includes/series-nav.html');
  const layout = read('_layouts/article.html');
  const navAt = layout.indexOf('include series-nav.html');
  const relatedAt = layout.indexOf('include related-posts.html');
  assert.ok(navAt > -1, 'article layout 沒有引入 series-nav.html');
  assert.ok(navAt < relatedAt, 'series-nav 應排在延伸閱讀之前');
});

test('系列導覽的名單只從 Agentic Engineering 系列頁讀，不另存一份', () => {
  const nav = read('_includes/series-nav.html');
  assert.match(nav, /site\.pages \| where: "url", "\/technical\/agentic-engineering\/"/);
  assert.match(nav, /agentic_groups/);
  assert.match(nav, /site\.data\.ai_learn\.modules/);
});

test('Agentic 系列名單的每個 slug 都對得到一篇文章，且不重複', () => {
  const slugs = agenticSlugs();
  assert.ok(slugs.length > 0, '讀不到 agentic_groups 的文章清單');
  assert.equal(new Set(slugs).size, slugs.length, 'agentic_groups 有重複的 slug（系列編號會錯）');
  for (const slug of slugs) {
    const hits = postFiles.filter((file) => file.replace(/\.(md|html)$/, '').endsWith(`-${slug}`));
    assert.equal(hits.length, 1, `系列名單的 ${slug} 對到 ${hits.length} 篇文章`);
  }
});

// AI 影片製作筆記系列頁的 series_groups／further_reading 清單（縮排同上）
function aiVideoLists() {
  const fm = frontMatter(read('technical/ai-video/index.html'));
  const groups = (fm.split(/^series_groups:\s*$/m)[1] ?? '').split(/^further_reading:\s*$/m)[0];
  const further = fm.split(/^further_reading:\s*$/m)[1] ?? '';
  return {
    series: [...groups.matchAll(/^      - (\S+)\s*$/gm)].map((m) => m[1]),
    further: [...further.matchAll(/^  - (\S+)\s*$/gm)].map((m) => m[1]),
  };
}

test('系列導覽也讀 AI 影片製作筆記系列頁的 series_groups，且只計入已發表文章', () => {
  const nav = read('_includes/series-nav.html');
  assert.match(nav, /site\.pages \| where: "url", "\/technical\/ai-video\/"/);
  assert.match(nav, /series_groups/);
  assert.match(nav, /sn_post_urls contains sn_needle/, '系列編號應只計入 site.posts 找得到的文章');
});

test('AI 影片系列名單不重複；延伸閱讀不與系列重疊且每篇都對得到文章', () => {
  const { series, further } = aiVideoLists();
  assert.ok(series.length > 0, '讀不到 series_groups 的文章清單');
  assert.equal(new Set(series).size, series.length, 'series_groups 有重複的 slug（系列編號會錯）');
  // 每個 slug 都要對到一篇 _posts 檔（可以是 published: false 的草稿，頁面與導覽框會自動略過未發表的）
  for (const slug of series) {
    const hits = postFiles.filter((file) => file.replace(/\.(md|html)$/, '').endsWith(`-${slug}`));
    assert.equal(hits.length, 1, `系列名單的 ${slug} 對到 ${hits.length} 篇文章`);
  }
  assert.ok(further.length > 0, '讀不到 further_reading 清單');
  for (const slug of further) {
    assert.ok(!series.includes(slug), `${slug} 同時在系列與延伸閱讀`);
    const hits = postFiles.filter((file) => file.replace(/\.(md|html)$/, '').endsWith(`-${slug}`));
    assert.equal(hits.length, 1, `延伸閱讀的 ${slug} 對到 ${hits.length} 篇文章`);
  }
});

test('文章的 ai_learn 都指到 AI 入門教材裡存在的單元與章節', () => {
  const modules = loadModules();
  let count = 0;
  for (const file of postFiles) {
    const value = frontMatter(read(`_posts/${file}`)).match(/^ai_learn:\s*["']?([^"'\s]+)["']?\s*$/m)?.[1];
    if (!value) continue;
    count += 1;
    const [mod, ch, extra] = value.split('/');
    assert.ok(!extra && mod && ch, `${file}：ai_learn「${value}」格式應為 單元/章節`);
    assert.ok(modules[mod], `${file}：ai_learn 單元「${mod}」不在 _data/ai_learn.yml`);
    assert.ok(modules[mod].has(ch), `${file}：ai_learn 章節「${ch}」不在單元 ${mod}`);
  }
  assert.ok(count >= 5, `預期至少 5 篇文章設了 ai_learn，實際 ${count}`);
});

test('延伸閱讀：手動指定優先，未指定時先用共同標籤再用同分類補位', () => {
  const related = read('_includes/related-posts.html');
  const manualAt = related.indexOf('page.related_posts');
  const tagsAt = related.indexOf('page.tags');
  const categoryAt = related.indexOf('site.categories[primary_cat]');
  assert.ok(manualAt > -1 && tagsAt > manualAt && categoryAt > tagsAt, '延伸閱讀的優先順序不對');
});

test('AI 學習分享頁依分類或標籤收錄文章，超過 12 篇收進「看全部」', () => {
  const page = read('education/ai/index.html');
  for (const tag of ['claude-code', 'ai-agent', 'agentic-engineering']) {
    assert.match(page, new RegExp(`post\\.tags contains '${tag}'`), `未依標籤 ${tag} 收錄`);
  }
  assert.match(page, /post\.categories contains 'claude-code'/);
  assert.match(page, /slice: 0, 12/);
  assert.match(page, /看全部 AI 文章/);
});
