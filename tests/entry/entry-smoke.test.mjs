// entry-smoke.test.mjs — 瀏覽器入口 module 的冒煙測試。
// 只驗證「import 不炸」：懸空 import、改名漏改、模組頂層誤觸 document/window，
// 從此在 npm test 現形，不必等人工 QA（P0 的 iching-svg.js 缺檔存活 3 天就是前車之鑑）。
// 不驗證功能行為——各家族自己的 *.test.mjs 已覆蓋邏輯層。
import { test } from 'node:test';

const ENTRIES = [
  'human-design/hd-ui.js',
  'tarot/tarot-ui.js',
  'tarot/tarot-compare.js',
  'tarot/tarot-deck-gallery.js',
  'qimen/qimen-ui.js',
  'tarot/tarot-daily.js',
  'astrology/astro-ui.js',
  'bazi/bazi-ui.js',
  'bazi/bazi-daily.js',
  'iching/iching-ui.js',
  'numerology/numerology-ui.js',
];

for (const e of ENTRIES) {
  test(`entry module 載入不炸: ${e}`, async () => {
    await import(`../../assets/js/${e}`);
  });
}
