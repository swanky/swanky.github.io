import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (file) => readFileSync(join(root, file), 'utf8');

test('共用頁尾使用二級標題並保留原有視覺規格', () => {
  const footer = read('_includes/footer.html');
  const css = read('assets/css/style.css');

  assert.match(footer, /<h2>聯絡方式<\/h2>/);
  assert.match(footer, /<h2>社群平台<\/h2>/);
  assert.doesNotMatch(footer, /<h[34]>(?:聯絡方式|社群平台)<\/h[34]>/);
  assert.match(css, /#footer \.footer-top \.footer-info h2\s*{[^}]*font-size:\s*18px;/);
  assert.match(css, /#footer \.footer-top \.footer-contact h2\s*{[^}]*font-size:\s*18px;/);
});

test('文章列表卡片依所在層級使用三級或四級標題', () => {
  const cards = read('_includes/article-card-grid.html');
  const related = read('_includes/related-posts.html');
  const listing = read('technical/articles.html');

  assert.match(cards, /include\.heading_level == 4[\s\S]*<h4 class="card-title">[\s\S]*<h3 class="card-title">/);
  assert.match(related, /include article-card-grid\.html articles=related heading_level=4/);
  assert.match(listing, /<h2>Agentic Engineering 系列<\/h2>/);
  assert.doesNotMatch(cards, /<h5 class="card-title">/);
});

test('工具頁由頁名銜接二級區塊，再以三級標題描述子項', () => {
  const expectedLevelTwo = new Map([
    ['_includes/birth-form.html', '輸入出生資料'],
    ['human-design/index.html', '輸入你的出生資料'],
    ['human-design/relationship/index.html', '你的出生資料'],
    ['tarot/draw/index.html', '① 你最近卡在什麼事情上？'],
    ['iching/index.html', '問一個此刻在意的問題'],
    ['numerology/index.html', '輸入你的出生日期'],
  ]);

  for (const [file, title] of expectedLevelTwo) {
    assert.match(read(file), new RegExp(`<h2[^>]*>[^<]*?(?:<[^>]+>[^<]*<\\/[^>]+>[^<]*)?${title}`), file);
  }

  assert.match(read('explore/index.html'), /<h3 class="explore-ethic-title">/);
  assert.match(read('qimen/index.html'), /<h3>奇門示意工具<\/h3>/);
  assert.match(read('human-design/index.html'), /<div class="hd-step3-item">\s*<h3>/);
  assert.match(read('tarot/draw/index.html'), /class="tarot-pos-item"[\s\S]*?<h3>給正在做選擇的你<\/h3>/);
});

test('每日提醒與媒體存檔不再從頁名跳到五級或三級標題', () => {
  assert.match(read('assets/js/bazi/bazi-daily.js'), /<h2>今天的提醒<\/h2>/);
  assert.match(read('assets/js/tarot/tarot-daily.js'), /<h2>今天的提醒<\/h2>/);

  for (const file of [
    'press/digiphoto-20130703.html',
    'press/ettoday-20150602.html',
    'press/xinmedia-20141215.html',
  ]) {
    const source = read(file);
    assert.match(source, /<h2>/, file);
    assert.doesNotMatch(source, /<h3>/, file);
  }
});
