#!/usr/bin/env node
/**
 * 產生 _data/flickr_static.json：寫真集每張照片的 Flickr 直連參數（server／secret／_b 尺寸）。
 *
 * 為什麼：GitHub Pages 圖片走 Fastly 新加坡節點、快取只有 10 分鐘，實測每張 0.8–2.4 秒；
 * Flickr live.staticflickr.com 同尺寸 0.4 秒、二次 0.08 秒。寫真集頁面的格線預覽改吃 Flickr，
 * 放大用的原尺寸 webp 仍留在本站（Flickr 公開直連最大只有 _b 1024，_h／_k 要 API key 才拿得到 secret）。
 *
 * 來源：只用 Flickr 公開 oEmbed（不需 API key、不碰憑證）：
 *   https://www.flickr.com/services/oembed?url=https://www.flickr.com/photos/swanky-hsiao/{id}/&format=json&maxwidth=1024
 *   回傳 url 形如 https://live.staticflickr.com/{server}/{id}_{secret}_b.jpg，另有 width／height。
 *
 * 掃描的資料檔（有 flickr_id 的寫真集）：
 *   _data/swanky_ji_open_worlds.json、_data/swanky_ji_everyday_light.json、_data/pan_jinlian_she_sees_it_first.json、_data/pan_jinlian_tonight_she_opens.json（photos[].flickr_id）
 *   _data/jinpingmei_photobook_vl20.yml（chapters[].shots[].flickr_id）
 *   _data/jinpingmei_photobook_lp36.yml（同上；36 個 id 取自攝影 workspace 的 upload-results，2026-09-24 補齊）
 *
 * 用法：node tools/flickr-static-map.mjs            # 只補缺的 id（增量）
 *       node tools/flickr-static-map.mjs --refresh  # 全部重抓
 * 輸出：_data/flickr_static.json  { "<flickr_id>": { "server": "65535", "secret": "…", "bw": 1024, "bh": 683 } }
 *   模板組網址：https://live.staticflickr.com/{server}/{id}_{secret}_{z|c|b}.jpg（640／800／1024 長邊）。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, '_data', 'flickr_static.json');
const JSON_BOOKS = ['swanky_ji_open_worlds', 'swanky_ji_everyday_light', 'pan_jinlian_she_sees_it_first', 'pan_jinlian_tonight_she_opens'];
const YML_BOOKS = ['jinpingmei_photobook_vl20', 'jinpingmei_photobook_lp36'];
const refresh = process.argv.includes('--refresh');

const ids = new Set();
for (const b of JSON_BOOKS) {
  const d = JSON.parse(readFileSync(join(root, '_data', `${b}.json`), 'utf8'));
  for (const p of d.photos) if (p.flickr_id) ids.add(String(p.flickr_id));
}
for (const b of YML_BOOKS) {
  const y = readFileSync(join(root, '_data', `${b}.yml`), 'utf8');
  for (const m of y.matchAll(/flickr_id:\s*"?(\d+)"?/g)) ids.add(m[1]);
}

const map = existsSync(OUT) && !refresh ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const todo = [...ids].filter((id) => !map[id]);
console.log(`ids=${ids.size} cached=${ids.size - todo.length} fetch=${todo.length}`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = 0, fail = 0;
for (const id of todo) {
  const api = `https://www.flickr.com/services/oembed?url=${encodeURIComponent(`https://www.flickr.com/photos/swanky-hsiao/${id}/`)}&format=json&maxwidth=1024`;
  try {
    const res = await fetch(api, { headers: { 'user-agent': 'swanky.github.io flickr-static-map' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const m = /^https:\/\/live\.staticflickr\.com\/(\d+)\/(\d+)_([0-9a-f]+)_b\.jpg$/.exec(j.url || '');
    if (!m || m[2] !== id) throw new Error(`unexpected url ${j.url}`);
    map[id] = { server: m[1], secret: m[3], bw: Number(j.width), bh: Number(j.height) };
    ok++;
  } catch (e) {
    fail++;
    console.error(`FAIL ${id}: ${e.message}`);
  }
  await sleep(150);
}

const sorted = Object.fromEntries(Object.keys(map).sort().map((k) => [k, map[k]]));
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
console.log(`written ${OUT}: ${Object.keys(sorted).length} entries (ok=${ok} fail=${fail})`);
if (fail) process.exit(1);
