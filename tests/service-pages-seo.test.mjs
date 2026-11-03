// service-pages-seo.test.mjs — 付費服務頁的搜尋護欄（2026-11-03，issue swanky/rwa#22 P1／P5）。
// 每個服務頁都要輸出結構化資料（Service，或課程頁用 Course），也要有 last_modified_at 讓 sitemap 帶 lastmod。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SERVICE_PAGES = [
  'photography/commercial-works.html',
  'technical/ai-agent-consulting/index.html',
  'technical/web3-consulting/index.html',
  'technical/ai-visual-production/index.html',
  'education/modeling/index.html', // 課程頁：用 Course，不另加 Service（見 _includes/service-jsonld.html 註解）
];

const frontMatterOf = (path) => {
  const src = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  return src.match(/^---\n([\s\S]*?)\n---/)[1];
};

for (const path of SERVICE_PAGES) {
  test(`${path}：有 Service 或 Course 結構化資料，且只有一種`, () => {
    const fm = frontMatterOf(path);
    const hasService = /^service_name: \S/m.test(fm);
    const hasCourse = /^course_name: \S/m.test(fm);
    assert.ok(hasService !== hasCourse, '要剛好擇一：service_name 或 course_name');
    assert.match(fm, /^layout: (home|page)$/m, 'service-jsonld／course-jsonld 只由 home、page layout 引入');
  });

  test(`${path}：有 last_modified_at（sitemap lastmod）`, () => {
    assert.match(frontMatterOf(path), /^last_modified_at: \d{4}-\d{2}-\d{2}$/m);
  });
}

test('home／page layout 都引入 Service 結構化資料', () => {
  for (const layout of ['home', 'page']) {
    const src = readFileSync(new URL(`../_layouts/${layout}.html`, import.meta.url), 'utf8');
    assert.match(src, /\{% include service-jsonld\.html %\}/);
  }
});
