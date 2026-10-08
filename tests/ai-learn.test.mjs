// ai-learn.test.mjs — AI 自學教材（/education/ai/learn/）的資料契約檢查。
// Liquid 對打錯的 slug 不會報錯，只會默默渲染出空白標題或「即將推出」，所以在這裡擋：
//   章節頁的 ai_module／ai_chapter、內文 chref 的 slug、yml 裡誤會卡與名詞小抄指到的章節，都必須存在於 _data/ai_learn.yml；
//   有 chapter_css 的章節頁，對應的 CSS 檔必須存在。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(REPO_ROOT, path), 'utf8');

// 極簡 yml 讀法：只抓 modules 底下的 module slug 與其 chapters 的 slug（本檔結構固定，不引入 YAML 套件）
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

function walk(dir) {
  const out = [];
  for (const name of readdirSync(join(REPO_ROOT, dir))) {
    const rel = `${dir}/${name}`;
    if (statSync(join(REPO_ROOT, rel)).isDirectory()) out.push(...walk(rel));
    else if (name === 'index.html') out.push(rel);
  }
  return out;
}

const modules = loadModules();
const pages = walk('education/ai/learn');

test('yml 至少有一個單元，且每個單元都有章節', () => {
  assert.ok(Object.keys(modules).length > 0);
  for (const [slug, chapters] of Object.entries(modules)) assert.ok(chapters.size > 0, `${slug} 沒有章節`);
});

test('章節頁的 ai_module／ai_chapter 都存在於 yml，章節專屬 CSS 檔也存在', () => {
  const chapterPages = pages.filter((p) => /layout:\s*ai-learn-chapter/.test(read(p)));
  assert.ok(chapterPages.length > 0, '找不到任何章節頁');
  for (const p of chapterPages) {
    const src = read(p);
    const mod = (src.match(/^ai_module:\s*(\S+)/m) || [])[1];
    const ch = (src.match(/^ai_chapter:\s*(\S+)/m) || [])[1];
    assert.ok(mod && modules[mod], `${p}：ai_module「${mod}」不在 yml`);
    assert.ok(ch && modules[mod].has(ch), `${p}：ai_chapter「${ch}」不在單元 ${mod}`);
    if (/^chapter_css:\s*true/m.test(src)) {
      assert.ok(existsSync(join(REPO_ROOT, `assets/css/ai-learn/${mod}/${ch}.css`)), `${p}：缺 assets/css/ai-learn/${mod}/${ch}.css`);
    }
  }
});

test('內文 chref 的 slug 都對得到章節', () => {
  const allChapters = new Set(Object.values(modules).flatMap((s) => [...s]));
  for (const p of pages) {
    for (const m of read(p).matchAll(/include ai-learn\/chref\.html[^%]*slug="([^"]+)"/g)) {
      assert.ok(allChapters.has(m[1]), `${p}：chref slug「${m[1]}」不存在`);
    }
  }
});

test('誤會卡與名詞小抄指到的章節都存在', () => {
  const yml = read('_data/ai_learn.yml');
  const allChapters = new Set(Object.values(modules).flatMap((s) => [...s]));
  for (const m of yml.matchAll(/chapter: ([a-z0-9-]+)/g)) {
    assert.ok(allChapters.has(m[1]), `yml 指到不存在的章節「${m[1]}」`);
  }
});
