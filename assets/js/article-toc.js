// article-toc.js — 文章頁「本文目錄」自動產生（ES module）。
//
// 長文讀者需要一個可以直接跳到某一段的入口。標題本身的錨點由 kramdown 預設產生
// （_config.yml 沒關 auto_ids），這裡只做兩件事：把正文裡的段落標題收成一份清單，
// 插在第一個段落標題之前。不改標題、不補 id、不動內文任何一個字。
//
// 三個刻意的邊界：
//   1. 頁面已經有手寫目錄（7 篇長文的大綱版）→ 整支略過，避免同一頁出現兩份目錄。
//   2. 標題數未達門檻（MIN_ITEMS）→ 不插入，短文不該出現比內文還長的目錄。
//   3. 只收 h2（段落標題）。h3 小節一起收會讓清單暴增（最長的一篇是 27 個 h2＋24 個 h3），
//      扁平樣式也表達不出層次；純邏輯 buildTocItems 仍看得懂 h3 的層級，
//      要改成收 h3 只需調 init 的選擇器與 levels。
//
// 沿用 tarot-daily.js／qimen-ui.js 的入口慣例：typeof document 守衛（方便 node 測試 import）
// ＋容器不存在就安靜略過、不拋錯。
import { esc } from './core/core-dom.js';

// 門檻沿用 _layouts/article.html 中段 CTA 的「6」；注意那裡是切開後的段數
// （h2_parts.size >= 6 ≒ 5 個 h2），這裡是實際收到的標題數 >= 6。
export const MIN_ITEMS = 6;

const LEVEL_OF = { H2: 2, H3: 3, H4: 4 };

function levelOf(heading) {
  if (!heading) return 0;
  const byTag = LEVEL_OF[String(heading.tagName || '').toUpperCase()];
  if (byTag) return byTag;
  return Number(heading.level) || 0;
}

function cleanText(heading) {
  // textContent 已經是攤平後的純文字：標題裡的粗體、行內程式碼、連結都只留文字。
  return String((heading && heading.textContent) || '').replace(/\s+/g, ' ').trim();
}

function attr(value) {
  return esc(value).replace(/"/g, '&quot;');
}

/**
 * 純邏輯：一串標題元素 → 目錄項目。
 * 沒有 id 或沒有文字的標題直接跳過（無從跳轉／無從顯示）。
 * 收到的項目未達 minItems 時回空陣列，代表「這篇不需要目錄」。
 *
 * @param {ArrayLike} headings 具 tagName／textContent／id 的標題元素（或同形狀物件）
 * @param {{minItems?: number, levels?: number[]}} [options]
 * @returns {{level: number, text: string, id: string}[]}
 */
export function buildTocItems(headings, options = {}) {
  const minItems = Number.isFinite(options.minItems) ? options.minItems : MIN_ITEMS;
  const levels = Array.isArray(options.levels) && options.levels.length ? options.levels : [2, 3];

  const items = Array.prototype.slice.call(headings || [])
    .map((heading) => ({
      level: levelOf(heading),
      text: cleanText(heading),
      id: String((heading && heading.id) || '').trim(),
    }))
    .filter((item) => item.id && item.text && levels.indexOf(item.level) !== -1);

  return items.length >= minItems ? items : [];
}

/** 純邏輯：目錄項目 → 目錄區塊的 HTML 字串（沿用既有 .article-toc 扁平樣式）。 */
export function tocHtml(items) {
  if (!items || !items.length) return '';
  const lis = items
    .map((item) => `<li><a href="#${attr(item.id)}">${esc(item.text)}</a></li>`)
    .join('');
  return '<nav class="article-toc" aria-label="本文目錄">'
    + '<span class="article-toc-label">本文目錄</span>'
    + `<ul>${lis}</ul>`
    + '</nav>';
}

export function init(doc = typeof document !== 'undefined' ? document : null) {
  if (!doc) return false;
  const body = doc.querySelector('.post-content');
  if (!body) return false;
  if (body.querySelector('.article-toc')) return false; // 已有手寫目錄

  const headings = body.querySelectorAll('h2');
  const items = buildTocItems(headings, { levels: [2] });
  if (!items.length) return false;

  const anchor = Array.prototype.slice.call(headings)
    .filter((h) => String(h.id || '').trim() && cleanText(h))[0];
  if (!anchor || typeof anchor.insertAdjacentHTML !== 'function') return false;

  // 插在第一個段落標題之前：前言段落與「30 秒結論」框都留在目錄上方。
  anchor.insertAdjacentHTML('beforebegin', tocHtml(items));
  return true;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
}
