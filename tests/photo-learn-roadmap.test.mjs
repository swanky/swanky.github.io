// 看懂寫真：路線圖資料與公開頁的一致性。規則見 docs/photography-study-zone-review-2026-10.md §3.5。
// status 為 published／review 的章必有 url 且檔案存在；專區模板與頁面原始碼不得出現「整理中」「待規劃」（註解內除外）。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8').replace(/\r\n/g, '\n');

// 最小解析 _data/photo_learn.yml：掃出「- title:」項目與同層的 status／url
function items(text) {
  const lines = text.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\s*)- title:\s*(.*)$/);
    if (!m) continue;
    const dash = m[1].length;
    const it = { title: m[2].trim(), line: i + 1 };
    for (let j = i + 1; j < lines.length; j++) {
      const l = lines[j];
      if (!l.trim() || /^\s*#/.test(l)) continue;
      const ind = l.match(/^(\s*)/)[1].length;
      if (ind <= dash) break;
      const kv = l.trim().match(/^([A-Za-z_]+):\s*([^#]*?)\s*(#.*)?$/);
      if (kv) it[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
    }
    out.push(it);
  }
  return out;
}

test('photo_learn.yml：published／review 的項目必有 url，且對應檔案存在', () => {
  const list = items(read('_data/photo_learn.yml'));
  assert.ok(list.length > 0);
  for (const it of list) {
    if (it.status !== 'published' && it.status !== 'review') continue;
    assert.ok(it.url, `第 ${it.line} 行「${it.title}」是 ${it.status} 但沒有 url`);
    const dir = join(ROOT, it.url.replace(/^\//, ''));
    const ok = existsSync(join(dir, 'index.html')) || existsSync(dir + '.html') || existsSync(dir + '.md');
    assert.ok(ok, `「${it.title}」的 url ${it.url} 找不到對應檔`);
  }
});

function stripComments(s) {
  return s
    .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^\s*#.*$/gm, '')       // YAML 註解行
    .replace(/[ \t]+#.*$/gm, '');    // front matter 行尾註解
}

function files() {
  const out = [];
  const walk = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p); else if (/\.(html|md)$/.test(n)) out.push(p);
    }
  };
  walk(join(ROOT, 'photography', 'learn'));
  for (const n of readdirSync(join(ROOT, '_layouts'))) if (n.startsWith('photo-learn-')) out.push(join(ROOT, '_layouts', n));
  for (const n of readdirSync(join(ROOT, '_includes', 'photography'))) if (n.startsWith('learn-')) out.push(join(ROOT, '_includes', 'photography', n));
  return out;
}

test('看懂寫真的模板與頁面原始碼不含「整理中」「待規劃」', () => {
  const fs = files();
  assert.ok(fs.length >= 8);
  for (const f of fs) {
    const body = stripComments(readFileSync(f, 'utf8'));
    for (const word of ['整理中', '待規劃']) {
      assert.ok(!body.includes(word), `${relative(ROOT, f)} 含「${word}」`);
    }
  }
});
