// modeling-seo.test.mjs — 模特兒鏡頭表現課頁面的搜尋結構化資料護欄（2026-10-28 站主決定：地點寫台北、不寫價格）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../education/modeling/index.html', import.meta.url), 'utf8');
const courseJsonld = readFileSync(new URL('../_includes/course-jsonld.html', import.meta.url), 'utf8');
const frontMatter = page.match(/^---\n([\s\S]*?)\n---/)[1];

test('課程結構化資料標出台北實體課，但不放價格', () => {
  assert.match(frontMatter, /^course_mode: onsite$/m);
  assert.match(frontMatter, /^course_location: 台北市$/m);
  assert.doesNotMatch(page, /NT\$|新台幣|\d+\s*元/);
  // 付費課程分支不得輸出 offers／price；只有免費課（course_free）才有 price: 0
  const paidBranch = courseJsonld.split('{%- if page.course_mode')[1];
  assert.doesNotMatch(paidBranch, /offers|price/);
});

test('FAQ 畫面與 FAQPage 結構化資料吃同一份 front matter', () => {
  const questions = [...frontMatter.matchAll(/^  - q: (.+)$/gm)].map((m) => m[1]);
  assert.equal(questions.length, 4);
  assert.match(page, /\{% for item in page\.faq %\}/);
  assert.match(page, /\{% include faq-jsonld\.html faq=page\.faq %\}/);
  assert.doesNotMatch(page, /<summary>課程價格是多少？<\/summary>/, 'FAQ 不得再手寫一份，避免與結構化資料不同步');
});

test('三期歷史課程維持「額滿」寫法', () => {
  assert.equal((page.match(/額滿/g) || []).length, 3);
});
