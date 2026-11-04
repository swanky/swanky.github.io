// 《神話未完成》各冊的來源欄位是攝影端移交的 SHA 契約檔，網站不改資料；
// _includes/photography/myths-source-line.html 靠固定格式把「標題（網址）」排成可點的連結清單。
// 這裡守住格式：來源裡的每個網址都必須包在「（…）」（中文）或「 (…)」（英文）裡，
// 否則模板只能退回純文字，讀者又得自己複製網址。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const series = readFileSync(join(root, '_data/swanky_ji_myths.yml'), 'utf8');
const books = [...series.matchAll(/data:\s*([a-z0-9_]+)/g)].map((m) => m[1]);

const FIELDS = {
  sources_zh: { open: '（', close: '）' },
  source_note_zh: { open: '（', close: '）' },
  sources_en: { open: ' (', close: ')' },
  source_note_en: { open: ' (', close: ')' },
};

test('系列總表列出的每一冊都有資料檔', () => {
  assert.ok(books.length >= 33, `只讀到 ${books.length} 冊`);
});

for (const book of books) {
  test(`${book}：來源網址都寫成「標題（網址）」`, () => {
    const data = JSON.parse(readFileSync(join(root, `_data/${book}.json`), 'utf8'));
    for (const [field, { open, close }] of Object.entries(FIELDS)) {
      const text = data[field];
      if (!text) continue;
      for (const line of String(text).split('\n')) {
        const urls = [...line.matchAll(/https?:\/\//g)];
        for (const m of urls) {
          const before = line.slice(0, m.index);
          assert.ok(before.endsWith(open), `${field} 的網址前面不是「${open.trim()}」：${line.slice(Math.max(0, m.index - 20), m.index + 40)}`);
          assert.ok(line.indexOf(close, m.index) > m.index, `${field} 的網址後面缺「${close}」：${line.slice(m.index, m.index + 60)}`);
        }
      }
    }
  });
}
