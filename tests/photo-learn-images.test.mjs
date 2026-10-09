// 看懂寫真：作品小圖（評論引用）的規格檢查。規則見 docs/photography-study-zone-review-2026-10.md §2.2。
// 每個 works[].img 必有 credit 與 url；檔案存在且 JPEG 長邊 <= 600；og_image 不得指向 /works/。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const LEARN = join(ROOT, 'photography', 'learn');

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name === 'index.html') out.push(p);
  }
  return out;
}

function frontMatter(text) {
  const m = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n/);
  return m ? m[1] : '';
}

const unq = (v) => v.trim().replace(/\s+#.*$/, '').replace(/^["']|["']$/g, '');

// 最小解析：找出每個「- title:」項目，收集它自己那一層的 key: value
export function listItems(fm) {
  const lines = fm.split('\n');
  const items = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\s*)- title:\s*(.*)$/);
    if (!m) continue;
    const dash = m[1].length;
    const item = { title: unq(m[2]), line: i + 1 };
    for (let j = i + 1; j < lines.length; j++) {
      const l = lines[j];
      if (!l.trim()) continue;
      const ind = l.match(/^(\s*)/)[1].length;
      if (ind <= dash) break;
      if (ind === dash + 2) {
        const kv = l.trim().match(/^([A-Za-z_]+):\s*(.*)$/);
        if (kv) item[kv[1]] = unq(kv[2]);
      }
    }
    items.push(item);
  }
  return items;
}

export function jpegSize(buf) {
  assert.equal(buf[0], 0xff);
  assert.equal(buf[1], 0xd8, '不是 JPEG');
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) { i += 2; continue; }
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  throw new Error('找不到 JPEG SOF 標頭');
}

const pages = walk(LEARN);

// 圖鑑人物檔：_data/photo_atlas/<id>.yml（內容是原本 people[] 的一位，works 在最上層）
const ATLAS = join(ROOT, '_data', 'photo_atlas');
const atlasFiles = existsSync(ATLAS) ? readdirSync(ATLAS).filter((n) => /\.ya?ml$/.test(n)).map((n) => join(ATLAS, n)) : [];
// 頁面 front matter 與人物檔都要掃 works[].img
const sources = [...pages, ...atlasFiles];
const body = (f) => (f.endsWith('.html') ? frontMatter(readFileSync(f, 'utf8')) : readFileSync(f, 'utf8').replace(/\r\n/g, '\n'));

test('找得到 photography/learn 的頁面', () => {
  assert.ok(pages.length >= 1);
});

test('works[].img：credit、url、檔案、尺寸', () => {
  for (const f of sources) {
    const name = relative(ROOT, f);
    for (const it of listItems(body(f))) {
      if (!it.img) continue;
      const where = `${name}:${it.line} 「${it.title}」`;
      assert.ok(it.credit, `${where} 有 img 但缺 credit`);
      assert.ok(/^https?:\/\//.test(it.url || ''), `${where} 有 img 但缺 url（原作連結）`);
      assert.ok(it.img.startsWith('/assets/img/photo-learn/works/'), `${where} img 要放在 assets/img/photo-learn/works/ 底下`);
      assert.match(it.img, /\.jpe?g$/i, `${where} img 要是 JPEG`);
      const file = join(ROOT, it.img);
      assert.ok(existsSync(file), `${where} 檔案不存在：${it.img}`);
      const { w, h } = jpegSize(readFileSync(file));
      assert.ok(Math.max(w, h) <= 600, `${where} 長邊 ${Math.max(w, h)} > 600`);
      assert.equal(Number(it.img_w), w, `${where} img_w（${it.img_w}）與檔案寬 ${w} 不符`);
      assert.equal(Number(it.img_h), h, `${where} img_h（${it.img_h}）與檔案高 ${h} 不符`);
    }
  }
});

test('og_image／image 不得指向 /works/（他人作品小圖不當社群圖卡）', () => {
  for (const f of pages) {
    const fm = frontMatter(readFileSync(f, 'utf8'));
    for (const m of fm.matchAll(/^(og_image|image|cover_image):\s*(.*)$/gm)) {
      assert.ok(!/\/works\//.test(m[2]), `${relative(ROOT, f)} 的 ${m[1]} 指向 works/：${m[2]}`);
    }
  }
});

test('people_ids 每個 id 都有 _data/photo_atlas/<id>.yml，且檔內 id 與檔名一致', () => {
  for (const f of pages) {
    const m = frontMatter(readFileSync(f, 'utf8')).match(/^people_ids:\s*\[([^\]]*)\]/m);
    if (!m) continue;
    for (const id of m[1].split(',').map((x) => x.trim()).filter(Boolean)) {
      const file = join(ATLAS, `${id}.yml`);
      assert.ok(existsSync(file), `${relative(ROOT, f)} 的 people_ids 有 ${id}，但缺 _data/photo_atlas/${id}.yml`);
      assert.match(readFileSync(file, 'utf8'), new RegExp('^id: *' + id + ' *\r?$', 'm'), `${id}.yml 檔內 id 要等於檔名`);
    }
  }
});
