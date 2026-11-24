// 站台稽核測試的共用工具（2026-11-24）。
// 來源層檢查在 npm test 一律跑。
// 建置產物層檢查（名稱以「建置產物」開頭）不在 npm test 內跑：改完檔案或合併當下，本機 _site/ 還是舊產物，
// 拿舊產物驗新原始碼會誤報。建置後用 npm run audit:site 跑（tools/audit-site.mjs 會設 SITE_AUDIT=1）。
// 略過時一律寫明原因，不會假裝通過。
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const SITE = join(ROOT, '_site');
const siteAuditRequested = process.env.SITE_AUDIT === '1';
export const hasSite = siteAuditRequested && existsSync(join(SITE, 'index.html'));
export const NO_SITE_REASON = siteAuditRequested
  ? '未驗證：本機沒有 _site/，先跑 bundle exec jekyll build 再測'
  : '未驗證：建置產物檢查不在 npm test 內，建置後請跑 npm run audit:site';

export const read = (relativePath) => readFileSync(join(ROOT, relativePath), 'utf8');

let trackedCache;
/** git 追蹤的所有檔案（repo 相對路徑，正斜線）。 */
export function trackedFiles() {
  if (!trackedCache) {
    trackedCache = execFileSync('git', ['-c', 'core.quotepath=off', 'ls-files', '-z'], {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
    }).split('\0').filter(Boolean);
  }
  return trackedCache;
}

export function frontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(\r?\n|$)/);
  return match ? match[1] : null;
}

export function frontMatterValue(fm, key) {
  const match = fm.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));
  if (!match) return undefined;
  return match[1].trim().replace(/^["']|["']$/g, '');
}

/** 讀 front matter 的 redirect_from（單一字串、行內陣列或多行清單都支援）。 */
export function redirectFromList(fm) {
  const lines = fm.split(/\r?\n/);
  const start = lines.findIndex((line) => /^redirect_from:/.test(line));
  if (start === -1) return [];
  const clean = (value) => value.trim().replace(/^["']|["']$/g, '');
  const inline = lines[start].replace(/^redirect_from:/, '').trim();
  if (inline.startsWith('[')) return inline.replace(/^\[|\]$/g, '').split(',').map(clean).filter(Boolean);
  if (inline) return [clean(inline)];
  const list = [];
  for (const line of lines.slice(start + 1)) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (!item) break;
    list.push(clean(item[1]));
  }
  return list;
}

let sitePagesCache;
/** _site 內所有 .html：[{ path: 'a/b/index.html', html }]。 */
export function sitePages() {
  if (sitePagesCache) return sitePagesCache;
  const pages = [];
  const walk = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(join(dir, entry.name), rel);
      else if (entry.name.endsWith('.html')) pages.push({ path: rel, html: readFileSync(join(dir, entry.name), 'utf8') });
    }
  };
  walk(SITE, '');
  sitePagesCache = pages;
  return pages;
}

const REFRESH = /<meta\s+http-equiv=["']refresh["']\s+content=["']\s*\d+\s*;\s*url=([^"']+)["']/i;
/** 轉址頁（jekyll-redirect-from 或手寫 meta refresh）回傳目標網址，否則 null。 */
export function redirectTarget(html) {
  const match = html.match(REFRESH);
  return match ? match[1].trim() : null;
}

/** 網址路徑對應到 _site 內的檔案（相對路徑），找不到回傳 null。 */
export function siteFileForPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split(/[?#]/)[0]).replace(/^\/+/, '');
  const candidates = decoded === '' || decoded.endsWith('/')
    ? [`${decoded}index.html`]
    : [decoded, `${decoded}.html`, `${decoded}/index.html`];
  for (const candidate of candidates) {
    const full = join(SITE, candidate);
    if (existsSync(full) && statSync(full).isFile()) return candidate;
  }
  return null;
}
