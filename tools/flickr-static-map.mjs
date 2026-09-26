#!/usr/bin/env node
/**
 * 產生 _data/flickr_static.json（每張照片的 Flickr 公開尺寸）與 assets/data/flickr-fallbacks.json
 * （Flickr 圖片載入失敗時，assets/js/flickr-fallback.js 換回的本地副本）。
 *
 * 為什麼走 Flickr：GitHub Pages 圖片走 Fastly 新加坡節點、邊緣快取只有 10 分鐘（max-age=600 不可調），
 * 2026-09-24 實測每張 0.8–2.4 秒；Flickr live.staticflickr.com 同尺寸 0.4 秒、二次 0.08 秒。
 * 所以寫真集與攝影頁的 <img> 改吃 Flickr，本地檔保留為備援。
 *
 * 為什麼解析公開照片頁、不用 oEmbed：oEmbed 最大只回 _b（1024），_h／_k 等大尺寸的 secret 與 _b 不同、oEmbed 不給；
 * 公開照片頁內嵌的 modelExport 有全部公開尺寸，不需 API key、不碰憑證。這是 Flickr 的非公開格式，改版就可能失效——
 * 失敗的 id 保留舊資料並以非零碼結束，不會寫壞既有對照。不猜 secret、不收正方形裁切（sq／q），只收長邊 320–2048 的尺寸。
 *
 * 來源 id：寫真集資料檔的 photos[]／shots[].flickr_id，加上 _data/flickr_image_paths.json（人工核對過的「本地路徑 → Flickr id」）。
 * flickr_image_paths.json 只放與 Flickr 原圖同構圖的本地檔；已裁切或特製壓縮的衍生圖（首頁 WebP、列表 -card.jpg）不要放進來，
 * 否則模板會把它們換成更大的 Flickr 原圖。移交的寫真集資料檔一律不改動。
 *
 * 用法：node tools/flickr-static-map.mjs            # 只抓缺的 id（增量），並重寫備援對照（沒有缺的就不連網）
 *       node tools/flickr-static-map.mjs --refresh  # 全部重抓
 */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, '_data/flickr_static.json');
const refresh = process.argv.includes('--refresh');
const ids = new Set();
for (const name of ['swanky_ji_open_worlds', 'swanky_ji_everyday_light', 'pan_jinlian_she_sees_it_first', 'pan_jinlian_tonight_she_opens', 'beyond_the_frame', 'nft_seven_eight']) {
  const file = join(root, '_data', `${name}.json`);
  if (existsSync(file)) for (const p of JSON.parse(readFileSync(file, 'utf8')).photos) ids.add(String(p.flickr_id));
}
for (const name of ['jinpingmei_photobook_vl20', 'jinpingmei_photobook_lp36']) {
  for (const m of readFileSync(join(root, '_data', `${name}.yml`), 'utf8').matchAll(/flickr_id:\s*"?(\d+)"?/g)) ids.add(m[1]);
}
const pathsFile = join(root, '_data/flickr_image_paths.json');
const paths = existsSync(pathsFile) ? JSON.parse(readFileSync(pathsFile, 'utf8')) : {};
for (const id of Object.values(paths)) ids.add(String(id));
const map = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : {};
const todo = [...ids].filter(id => refresh || !map[id]?.sizes);
function publicModel(html) {
  const match = /modelExport:\s*/.exec(html);
  if (!match) throw new Error('Public photo metadata missing');
  const start = match.index + match[0].length;
  let depth = 0, quoted = false, escaped = false;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; }
    else if (c === '"') quoted = true;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return JSON.parse(html.slice(start, i + 1));
  }
  throw new Error('Incomplete public photo metadata');
}
async function fetchPhoto(id) {
  let photo_url = `https://www.flickr.com/photos/swanky-hsiao/${id}/`;
  const options = () => ({ headers: { 'user-agent': 'swanky.github.io image-size-cache' }, signal: AbortSignal.timeout(45000) });
  let res = await fetch(photo_url, options());
  if (res.status === 404) {
    const embed = await fetch(`https://www.flickr.com/services/oembed?url=${encodeURIComponent(photo_url)}&format=json`, options());
    if (!embed.ok) throw new Error(`oEmbed HTTP ${embed.status}`);
    const canonical = (await embed.json()).web_page;
    if (!new RegExp(`^https://www\\.flickr\\.com/photos/[^/]+/${id}/?$`).test(canonical)) throw new Error('Unexpected canonical photo URL');
    photo_url = canonical;
    res = await fetch(photo_url, options());
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const model = publicModel(await res.text());
  const p = model.main['photo-models'].map(x => x.data).find(x => String(x.id) === id);
  if (!p?.sizes?.data) throw new Error('Photo ID or sizes missing');
  const sizes = Object.entries(p.sizes.data).filter(([key]) => !['sq', 'q', 'o'].includes(key))
    .map(([, v]) => ({ url: 'https:' + v.data.url, width: Number(v.data.width), height: Number(v.data.height) }))
    .filter(x => Math.max(x.width, x.height) >= 320 && Math.max(x.width, x.height) <= 2048)
    .sort((a, b) => a.width - b.width).filter((x, i, arr) => i === 0 || x.width !== arr[i - 1].width);
  if (!sizes.length || sizes.some(x => !new RegExp(`^https://live\\.staticflickr\\.com/\\d+/${id}_[0-9a-f]+(?:_[a-z0-9]+)?\\.jpg$`).test(x.url))) throw new Error('Unexpected photo URL');
  let full = sizes.at(-1);
  // Flickr has no 1254px JPEG derivative for the square approved images.
  // Retain their native size only when opening the lightbox, not in grid srcsets.
  const original = p.sizes.data.o?.data;
  if (original && Math.max(original.width, original.height) <= 2048 && original.width > full.width && /^\/\/live\.staticflickr\.com\/\d+\/\d+_[a-f0-9]+_o\.(?:png|jpg)$/.test(original.url)) {
    full = { url: 'https:' + original.url, width: Number(original.width), height: Number(original.height) };
  }
  const preview = sizes.find(x => Math.max(x.width, x.height) >= 1024) || sizes.at(-1);
  const m = /staticflickr\.com\/(\d+)\/\d+_([0-9a-f]+)(?:_[a-z0-9]+)?\.jpg$/.exec(preview.url);
  return { server: m[1], secret: m[2], bw: preview.width, bh: preview.height,
    src: preview.url, srcset: sizes.map(x => `${x.url} ${x.width}w`).join(', '),
    full: full.url, width: full.width, height: full.height, photo_url, sizes };
}
console.log(`photos=${ids.size} cached=${ids.size - todo.length} fetch=${todo.length}`);
let completed = 0;
const failures = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function worker() {
  while (todo.length) {
    const id = todo.shift();
    try { map[id] = await fetchPhoto(id); }
    catch (error) { failures.push(id); console.error(`FAIL ${id}: ${error.message}`); }
    if (++completed % 25 === 0) console.log(`checked ${completed}`);
    await sleep(150); // 對 Flickr 客氣一點：三路並行、每路請求間隔 150ms
  }
}
await Promise.all(Array.from({ length: 3 }, worker));
writeFileSync(out, JSON.stringify(Object.fromEntries(Object.keys(map).sort().map(id => [id, map[id]])), null, 2) + '\n');
console.log(`cached=${Object.keys(map).length} failed=${failures.length}`);
if (failures.length) process.exitCode = 1;

// 備援對照：每個 id 取 flickr_image_paths.json 裡最大的本地副本（畫質最接近 Flickr 大圖）；同大小取路徑排序第一個。
const localCopies = {};
for (const [path, id] of Object.entries(paths)) (localCopies[String(id)] ||= []).push(path);
const fallbackLines = [];
const orphans = [];
for (const id of Object.keys(map).sort()) {
  const best = (localCopies[id] || []).filter(p => existsSync(join(root, p)))
    .map(p => [p, statSync(join(root, p)).size])
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0];
  if (best) fallbackLines.push(`  ${JSON.stringify(id)}: ${JSON.stringify(best[0])}`);
  else orphans.push(id);
}
// 手寫 JSON 以保持字串排序（JSON.stringify 會把像陣列索引的 id 排到最前面）
writeFileSync(join(root, 'assets/data/flickr-fallbacks.json'), `{\n${fallbackLines.join(',\n')}\n}\n`);
console.log(`fallbacks=${fallbackLines.length}`);
if (orphans.length) { console.error(`NO LOCAL COPY: ${orphans.join(', ')}`); process.exitCode = 1; }
