// 文章結構化資料的日期回歸測試（2026-11-24）：
// post-jsonld／press-article-jsonld 一定輸出 dateModified——有 last_modified_at 用它，沒有就用張貼日。
// datePublished 一律是原始張貼日（AGENTS.md「張貼日期與更新日期分開」）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasSite, NO_SITE_REASON, read, sitePages } from './_site-audit.mjs';

const INCLUDES = ['_includes/post-jsonld.html', '_includes/press-article-jsonld.html'];
const DATE_MODIFIED_LINE = '"dateModified": "{{ page.last_modified_at | default: page.date | date_to_xmlschema }}",';
const DATE_PUBLISHED_LINE = '"datePublished": "{{ page.date | date_to_xmlschema }}",';

for (const include of INCLUDES) {
  test(`${include} 無條件輸出 dateModified（last_modified_at 優先，否則張貼日）`, () => {
    const lines = read(include).split(/\r?\n/).map((line) => line.trim());
    assert.ok(lines.includes(DATE_PUBLISHED_LINE), 'datePublished 必須直接用 page.date');
    // 整行完全相等才算：包在 {% if page.last_modified_at %} 裡的寫法會讓沒有更新日的文章缺這個欄位。
    assert.ok(lines.includes(DATE_MODIFIED_LINE), 'dateModified 必須無條件輸出，且以 page.date 為預設值');
  });
}

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/;

test('建置產物：每一篇 BlogPosting／NewsArticle 都有合法的 dateModified，且不早於 datePublished', { skip: hasSite ? false : NO_SITE_REASON }, () => {
  const problems = [];
  let articles = 0;
  for (const page of sitePages()) {
    for (const block of page.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      if (!/"@type":\s*"(BlogPosting|NewsArticle)"/.test(block[1])) continue;
      let data;
      try { data = JSON.parse(block[1]); } catch (error) { problems.push(`${page.path}：JSON-LD 無法解析（${error.message}）`); continue; }
      if (!['BlogPosting', 'NewsArticle'].includes(data['@type'])) continue;
      articles += 1;
      if (!ISO.test(data.datePublished || '')) problems.push(`${page.path}：datePublished 不合法`);
      if (!ISO.test(data.dateModified || '')) problems.push(`${page.path}：缺 dateModified`);
      else if (new Date(data.dateModified) < new Date(data.datePublished)) problems.push(`${page.path}：dateModified 早於 datePublished`);
    }
  }
  assert.ok(articles >= 100, `文章結構化資料數量異常：${articles}`);
  assert.deepEqual(problems, [], problems.join('\n'));
});
