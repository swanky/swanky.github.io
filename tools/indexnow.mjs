// indexnow.mjs — 部署後把「這次改到的頁面」通知 IndexNow（Bing 等搜尋引擎共用；ChatGPT 搜尋與 Copilot 用 Bing 索引）。
// 由 .github/workflows/indexnow.yml 在 GitHub Pages 部署完成後呼叫；也可本機手動跑（DRY_RUN=1 只列不送）。
//
// 用法：
//   BEFORE=<sha> AFTER=<sha> node tools/indexnow.mjs   只送這段 commit 範圍改到的頁面
//   ALL=1 node tools/indexnow.mjs                     送出 sitemap 全部網址（首次設定或大改版後用）
//   URLS="https://swanky.github.io/a/ https://..." node tools/indexnow.mjs
//
// 原則：一律以正式站 sitemap.xml 當白名單——猜錯的網址、已刪除或 noindex（sitemap:false）的頁面都不會送出。
// 改到 _layouts／_includes／_data／assets 這類「影響很多頁」的檔不會自動展開成網址，需要時用 ALL=1。
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const HOST = 'swanky.github.io';
export const KEY = '869f4ba91c119970993e4cc9d00e5ba9';
const ORIGIN = `https://${HOST}`;

function frontMatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : null;
}

function fmValue(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
}

function fmCategories(fm) {
  const inline = fm.match(/^categories:\s*\[([^\]]*)\]/m);
  if (inline) return inline[1].split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  const single = fm.match(/^categories:\s*([^\s\[].*)$/m);
  if (single) return single[1].trim().split(/\s+/);
  const list = fm.match(/^categories:\s*\r?\n((?:\s*-\s*.+\r?\n?)+)/m);
  if (list) return list[1].split(/\r?\n/).map((l) => l.replace(/^\s*-\s*/, '').trim()).filter(Boolean);
  return [];
}

// 依 _config.yml 的 permalink: /:categories/:title/ 與頁面的資料夾網址慣例，把原始檔路徑換成網址。
// 回傳 null＝這個檔不會單獨產生頁面（或無法判斷），交給呼叫端略過。
export function sourceToUrl(path, src) {
  const p = path.replace(/\\/g, '/');
  if (!/\.(md|markdown|html)$/.test(p)) return null;
  if (/^(_layouts|_includes|_data|_sass|_site|assets|docs|tests|tools|node_modules|nft|\.)/.test(p)) return null;
  const fm = frontMatter(src);
  if (fm === null) return null; // 沒有 front matter＝Jekyll 不當頁面處理
  const permalink = fmValue(fm, 'permalink');
  if (permalink) return ORIGIN + permalink;
  const post = p.match(/^_posts\/\d{4}-\d{2}-\d{2}-(.+)\.(md|markdown|html)$/);
  if (post) {
    const cats = fmCategories(fm);
    return `${ORIGIN}/${cats.length ? cats.join('/') + '/' : ''}${post[1]}/`;
  }
  if (p.startsWith('_')) return null; // 其他底線資料夾（collections）各有規則，交給 sitemap 白名單以外的 ALL=1 處理
  if (/(^|\/)index\.(md|markdown|html)$/.test(p)) return `${ORIGIN}/${p.replace(/index\.(md|markdown|html)$/, '')}`;
  return `${ORIGIN}/${p.replace(/\.(md|markdown|html)$/, '')}/`;
}

async function sitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`, { headers: { 'cache-control': 'no-cache' } });
  if (!res.ok) throw new Error(`sitemap.xml HTTP ${res.status}`);
  const xml = await res.text();
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()));
}

function changedFiles(before, after) {
  const out = execFileSync('git', ['diff', '--name-only', '--diff-filter=AMR', before, after], { encoding: 'utf8' });
  return out.split(/\r?\n/).filter(Boolean);
}

async function main() {
  const dry = process.env.DRY_RUN === '1';
  const allowed = await sitemapUrls();
  let urls;
  if (process.env.ALL === '1') {
    urls = [...allowed];
  } else if (process.env.URLS) {
    urls = process.env.URLS.split(/\s+/).filter(Boolean);
  } else {
    const { BEFORE, AFTER } = process.env;
    if (!BEFORE || !AFTER || /^0+$/.test(BEFORE)) { console.log('沒有可比較的 commit 範圍，略過。'); return; }
    const mapped = changedFiles(BEFORE, AFTER)
      .filter((f) => existsSync(f))
      .map((f) => sourceToUrl(f, readFileSync(f, 'utf8')))
      .filter(Boolean);
    urls = [...new Set(mapped)];
  }
  const skipped = urls.filter((u) => !allowed.has(u));
  urls = urls.filter((u) => allowed.has(u));
  if (skipped.length) console.log(`不在 sitemap、不送出（${skipped.length}）：\n  ${skipped.join('\n  ')}`);
  if (!urls.length) { console.log('沒有要通知的網址。'); return; }
  console.log(`要通知的網址（${urls.length}）：\n  ${urls.slice(0, 50).join('\n  ')}${urls.length > 50 ? '\n  …' : ''}`);
  if (dry) { console.log('DRY_RUN=1，不送出。'); return; }

  const keyRes = await fetch(`${ORIGIN}/${KEY}.txt`, { headers: { 'cache-control': 'no-cache' } });
  const keyText = keyRes.ok ? (await keyRes.text()).trim() : '';
  if (keyText !== KEY) throw new Error(`金鑰檔 ${ORIGIN}/${KEY}.txt 讀不到或內容不符（HTTP ${keyRes.status}）`);

  for (let i = 0; i < urls.length; i += 10000) {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: urls.slice(i, i + 10000) }),
    });
    console.log(`IndexNow 回應 HTTP ${res.status}（200／202＝已收下）`);
    if (res.status !== 200 && res.status !== 202) throw new Error(await res.text());
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
