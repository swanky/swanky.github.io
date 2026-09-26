#!/usr/bin/env node
/** Cache exact public Flickr sizes, without API keys or login.
 * node tools/flickr-static-map.mjs [--refresh]
 * Keep handoff data unchanged; flickr_image_paths.json maps reviewed local assets.
 * Large sizes have distinct URLs. Never guess their secrets or use square crops.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
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
if (existsSync(pathsFile)) for (const id of Object.values(JSON.parse(readFileSync(pathsFile, 'utf8')))) ids.add(String(id));
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
async function worker() {
  while (todo.length) {
    const id = todo.shift();
    try { map[id] = await fetchPhoto(id); }
    catch (error) { failures.push(id); console.error(`FAIL ${id}: ${error.message}`); }
    if (++completed % 25 === 0) console.log(`checked ${completed}`);
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
writeFileSync(out, JSON.stringify(Object.fromEntries(Object.keys(map).sort().map(id => [id, map[id]])), null, 2) + '\n');
console.log(`cached=${Object.keys(map).length} failed=${failures.length}`);
if (failures.length) process.exitCode = 1;
