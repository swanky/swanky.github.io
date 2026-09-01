// book-search.js — 古典小說原文搜尋（/books/search/）的前端。
//
// 為什麼沒有索引結構：T8 實測顯示，這個規模（最大單版 3758 段落）直接掃字串
// 最壞 0.53ms，全七版合掃 2.8ms；改建倒排索引會讓下載量變成 3.2 倍，只為省下
// 使用者感覺不到的 0.2ms。所以這裡就是「把該版原文取回來，逐段找子字串」。
// 子字串比對還有一個好處：中文人名不會被分詞切壞（「西門慶」「陳敬濟」都找得到）。
//
// 純邏輯（parseTerms／searchEdition／highlightHtml…）與 DOM 操作分離，方便 node 測試；
// 入口沿用 article-toc.js 的慣例：typeof document 守衛＋容器不存在就安靜略過。
import { esc } from './core/core-dom.js';

/** 一次最多畫幾筆結果。掃描很快，但把兩千多段高亮後的原文塞進畫面才是手機殺手。 */
export const MAX_RESULTS = 100;
/** 片段前後各留幾個字。 */
export const SNIPPET_RADIUS = 42;
/** 段落短於這個長度就整段顯示，不切片段。 */
export const SNIPPET_WHOLE_BELOW = 120;
/** 「五部一起找」的選項值。 */
export const ALL_EDITIONS = '__all__';

/**
 * 查詢字串與索引文字用同一套空白處理：全形空白與連續空白摺成單一半形空格。
 * 只摺空白，不改動任何一個文字（異體字／簡繁一律不自動改寫——版本用字是版本學事實）。
 */
export function normalizeQuery(text) {
  return String(text == null ? '' : text).replace(/[\s　]+/g, ' ').trim();
}

/**
 * 查詢字串 → 關鍵字陣列（空白分隔、去重，保留使用者輸入的順序）。
 * 不必為了高亮而重排：findRanges 會把重疊與相鄰的命中區間合併，
 * 所以「西門」「西門慶」同時輸入也不會出現 <mark> 套 <mark>。
 */
export function parseTerms(query) {
  const seen = new Set();
  const terms = [];
  for (const raw of normalizeQuery(query).split(' ')) {
    if (!raw || seen.has(raw)) continue;
    seen.add(raw);
    terms.push(raw);
  }
  return terms;
}

/** 一段文字是否包含全部關鍵字（AND）。 */
export function matchesAll(text, terms) {
  if (!terms.length) return false;
  const hay = String(text == null ? '' : text);
  for (const term of terms) if (hay.indexOf(term) === -1) return false;
  return true;
}

/** 命中位置（重疊與相鄰的區間都會併成一段，依起點排序）。 */
export function findRanges(text, terms) {
  const hay = String(text == null ? '' : text);
  const raw = [];
  for (const term of terms) {
    if (!term) continue;
    let i = hay.indexOf(term);
    while (i !== -1) {
      raw.push([i, i + term.length]);
      i = hay.indexOf(term, i + term.length);
    }
  }
  raw.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const merged = [];
  for (const r of raw) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) {
      if (r[1] > last[1]) last[1] = r[1];
    } else {
      merged.push([r[0], r[1]]);
    }
  }
  return merged;
}

/**
 * 命中的字用 <mark> 包起來。先切段再逐段轉義，關鍵字本身也轉義後才放進 <mark>——
 * 絕不在轉義後的字串上找位置（那會把 &amp; 這種展開後的字元算成內文）。
 */
export function highlightHtml(text, terms) {
  const hay = String(text == null ? '' : text);
  const ranges = findRanges(hay, terms);
  let out = '';
  let pos = 0;
  for (const [start, end] of ranges) {
    out += esc(hay.slice(pos, start));
    out += `<mark>${esc(hay.slice(start, end))}</mark>`;
    pos = end;
  }
  return out + esc(hay.slice(pos));
}

/** 取命中處前後的片段。回傳 { text, head, tail }——head／tail 代表前後還有被切掉的字。 */
export function snippet(text, terms, radius = SNIPPET_RADIUS) {
  const hay = String(text == null ? '' : text);
  if (hay.length <= SNIPPET_WHOLE_BELOW) return { text: hay, head: false, tail: false };
  const ranges = findRanges(hay, terms);
  if (!ranges.length) {
    return { text: hay.slice(0, SNIPPET_WHOLE_BELOW), head: false, tail: hay.length > SNIPPET_WHOLE_BELOW };
  }
  const [first, firstEnd] = ranges[0];
  const start = Math.max(0, first - radius);
  const end = Math.min(hay.length, firstEnd + radius);
  return { text: hay.slice(start, end), head: start > 0, tail: end < hay.length };
}

/**
 * 一個版本的原文 → 命中結果。
 * @returns {{hits: {c,l,t,seq,text}[], total: number, chapters: number, capped: boolean}}
 */
export function searchEdition(data, terms, options = {}) {
  const limit = Number.isFinite(options.limit) ? options.limit : MAX_RESULTS;
  const hits = [];
  const chapters = new Set();
  let total = 0;
  if (!terms.length) return { hits, total: 0, chapters: 0, capped: false };
  for (const ch of (data && data.chapters) || []) {
    for (const p of ch.ps || []) {
      if (!matchesAll(p[1], terms)) continue;
      total += 1;
      chapters.add(ch.c);
      if (hits.length < limit) hits.push({ c: ch.c, l: ch.l, t: ch.t, seq: p[0], text: p[1] });
    }
  }
  return { hits, total, chapters: chapters.size, capped: total > hits.length };
}

/** 回目命中（輕索引的 toc 三元陣列 [章回號, 回次, 回目]）。 */
export function searchToc(toc, terms) {
  const out = [];
  if (!terms.length) return out;
  for (const row of toc || []) {
    const label = row[1] || '';
    const couplet = row[2] || '';
    if (!matchesAll(normalizeQuery(`${label} ${couplet}`), terms)) continue;
    out.push({ c: row[0], l: label, t: couplet });
  }
  return out;
}

/** 章回頁網址。base 已含「主版本省略版本段」的規則，這裡不重算。 */
export function chapterUrl(base, c) {
  return `${base}${c}/`;
}

/** 段落深連結：base + 章回號 + 段落錨點（段序補回四位零填）。 */
export function paragraphAnchor(base, c, seq) {
  return `${chapterUrl(base, c)}#p-${c}-${String(seq).padStart(4, '0')}`;
}

/** 把站台根目錄接到索引裡的根相對路徑前面（baseurl 由頁面用 relative_url 給）。 */
export function withRoot(root, absPath) {
  const p = String(absPath == null ? '' : absPath);
  if (p.charAt(0) !== '/') return p;
  const r = String(root == null ? '/' : root);
  return (r.length > 1 && r.charAt(r.length - 1) === '/' ? r.slice(0, -1) : r === '/' ? '' : r) + p;
}

/** 版本的對外名稱：《書名》版本標籤。 */
export function editionName(meta) {
  if (!meta) return '';
  return `《${meta.book_title}》${meta.edition_label}`;
}

// ── 以下為 DOM 層 ──────────────────────────────────────────────

function hitHtml(hit, meta, terms, root, showWhere) {
  const href = withRoot(root, paragraphAnchor(meta.base, hit.c, hit.seq));
  const piece = snippet(hit.text, terms);
  const where = showWhere ? `${esc(editionName(meta))}・` : '';
  const couplet = hit.t ? `<em>${highlightHtml(hit.t, terms)}</em>` : '';
  const head = piece.head ? '……' : '';
  const tail = piece.tail ? '……' : '';
  return `<li class="bks-hit"><a href="${esc(href)}">`
    + `<span class="bks-hit__where">${where}${esc(hit.l)}${couplet}</span>`
    + `<span class="bks-hit__text">${head}${highlightHtml(piece.text, terms)}${tail}</span>`
    + '</a></li>';
}

function tocHtml(rows, meta, terms, root) {
  if (!rows.length) return '';
  const items = rows.map((row) => {
    const href = withRoot(root, chapterUrl(meta.base, row.c));
    const couplet = row.t ? `<em>${highlightHtml(row.t, terms)}</em>` : '';
    return `<li><a href="${esc(href)}">${highlightHtml(row.l, terms)}${couplet}</a></li>`;
  }).join('');
  return `<div class="bks-toc-hits"><h4>回目就有這幾回</h4><ul>${items}</ul></div>`;
}

/** 一個版本的結果區塊（含回目命中與段落命中）。 */
export function resultBlockHtml(meta, result, tocRows, terms, root, showWhere) {
  const parts = [];
  parts.push(`<h3 class="bks-group__title">${esc(editionName(meta))}</h3>`);
  parts.push(tocHtml(tocRows, meta, terms, root));
  if (!result.total) {
    parts.push('<p class="bks-none">這一版的原文裡沒有這些字。</p>');
  } else {
    const counted = terms.length > 1
      ? `這一版有 ${result.total} 段同時出現這 ${terms.length} 個詞，分佈在 ${result.chapters} 回`
      : `這一版有 ${result.total} 段，分佈在 ${result.chapters} 回`;
    parts.push(`<p class="bks-count">${esc(counted)}</p>`);
    parts.push(`<ol class="bks-hits">${result.hits.map((h) => hitHtml(h, meta, terms, root, showWhere)).join('')}</ol>`);
    if (result.capped) {
      parts.push(`<p class="bks-capped">畫面上只列前 ${result.hits.length} 段。想少一點，可以再多打一個詞——兩個詞都出現的段落才會列出來。</p>`);
    }
  }
  return `<section class="bks-group">${parts.join('')}</section>`;
}

export function init(doc = typeof document !== 'undefined' ? document : null) {
  if (!doc) return false;
  const form = doc.querySelector('[data-search-form]');
  const input = doc.querySelector('[data-search-input]');
  const statusEl = doc.querySelector('[data-search-status]');
  const resultsEl = doc.querySelector('[data-search-results]');
  if (!form || !input || !statusEl || !resultsEl) return false;

  const root = form.getAttribute('data-root') || '/';
  const indexPath = form.getAttribute('data-index') || '/assets/search/index.json';
  const cache = new Map(); // key → 該版原文（同一場瀏覽只取一次）
  let indexData = null;
  let running = 0;

  const say = (msg) => { statusEl.textContent = msg; };

  function selectedKey() {
    const picked = form.querySelector('input[name="bks-edition"]:checked');
    return picked ? picked.value : ALL_EDITIONS;
  }

  function metaList(key) {
    const all = (indexData && indexData.editions) || [];
    if (key === ALL_EDITIONS) return all;
    return all.filter((e) => `${e.book}-${e.edition}` === key);
  }

  async function loadIndex() {
    if (indexData) return indexData;
    const res = await fetch(withRoot(root, indexPath), { cache: 'force-cache' });
    if (!res.ok) throw new Error(String(res.status));
    indexData = await res.json();
    return indexData;
  }

  async function loadEdition(meta) {
    const key = `${meta.book}-${meta.edition}`;
    if (cache.has(key)) return cache.get(key);
    const res = await fetch(withRoot(root, meta.file), { cache: 'force-cache' });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    cache.set(key, data);
    return data;
  }

  async function run() {
    const terms = parseTerms(input.value);
    const key = selectedKey();
    if (!terms.length) {
      resultsEl.innerHTML = '';
      resultsEl.setAttribute('aria-busy', 'false');
      say('先輸入想找的字，例如一個人名，或一句記得的話。');
      input.focus();
      return;
    }
    const token = ++running;
    resultsEl.innerHTML = '';
    resultsEl.setAttribute('aria-busy', 'true');
    try {
      await loadIndex();
    } catch (e) {
      resultsEl.setAttribute('aria-busy', 'false');
      say('原文一時取不回來，請重新整理頁面再試一次。');
      return;
    }
    if (token !== running) return;

    const metas = metaList(key);
    if (!metas.length) {
      resultsEl.setAttribute('aria-busy', 'false');
      say('這一部的原文目前還找不到，請換一部試試。');
      return;
    }

    // 回目命中先給——輕索引已經在手上，不必等原文取回來。
    const tocByKey = new Map();
    let tocTotal = 0;
    for (const meta of metas) {
      const rows = searchToc(meta.toc, terms);
      tocByKey.set(`${meta.book}-${meta.edition}`, rows);
      tocTotal += rows.length;
    }
    if (tocTotal) {
      say(metas.length > 1
        ? `回目裡先找到 ${tocTotal} 回。正在取五部書的原文，第一次會等一下…`
        : `回目裡先找到 ${tocTotal} 回。正在取${editionName(metas[0])}的原文，第一次會等一下…`);
    } else {
      say(metas.length > 1
        ? '正在取五部書的原文，第一次會等一下…'
        : `正在取${editionName(metas[0])}的原文，第一次會等一下…`);
    }

    const showWhere = metas.length > 1;
    let done = 0;
    let grandTotal = 0;
    for (const meta of metas) {
      let data;
      try {
        data = await loadEdition(meta);
      } catch (e) {
        if (token !== running) return;
        resultsEl.insertAdjacentHTML('beforeend',
          `<section class="bks-group"><h3 class="bks-group__title">${esc(editionName(meta))}</h3>`
          + '<p class="bks-none">這一部的原文一時取不回來，請稍後再試。</p></section>');
        done += 1;
        continue;
      }
      if (token !== running) return;
      const result = searchEdition(data, terms);
      grandTotal += result.total;
      const rows = tocByKey.get(`${meta.book}-${meta.edition}`) || [];
      if (result.total || rows.length) {
        resultsEl.insertAdjacentHTML('beforeend', resultBlockHtml(meta, result, rows, terms, root, showWhere));
      }
      done += 1;
      if (done < metas.length) {
        say(`已經找完 ${done} 部，還在找其他的…`);
      }
    }
    if (token !== running) return;
    resultsEl.setAttribute('aria-busy', 'false');

    if (!grandTotal && !tocTotal) {
      say('找不到這些字。換個寫法試試——不同底本的用字不一定一樣，例如《金瓶梅》崇禎本把「陳經濟」寫成「陳敬濟」。');
      resultsEl.innerHTML = '<p class="bks-none bks-none--all">目前選的範圍裡沒有這些字。可以少打一個詞，或改選別部書再找一次。</p>';
    } else if (metas.length > 1) {
      say(`五部書合計找到 ${grandTotal} 段原文。`);
    } else {
      say(grandTotal
        ? `在${editionName(metas[0])}裡找到 ${grandTotal} 段原文。`
        : `${editionName(metas[0])}的正文裡沒有，但回目有${tocTotal}回對得上。`);
    }
    syncUrl(terms, key);
  }

  function syncUrl(terms, key) {
    if (!doc.defaultView || !doc.defaultView.history || !doc.defaultView.history.replaceState) return;
    const params = new URLSearchParams();
    params.set('q', terms.join(' '));
    if (key !== ALL_EDITIONS) params.set('in', key);
    try {
      doc.defaultView.history.replaceState(null, '', `?${params.toString()}`);
    } catch (e) { /* 忽略：不影響搜尋本身 */ }
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    run();
  });

  // 帶著網址參數進來（分享出去的搜尋連結）就直接找一次。
  const view = doc.defaultView;
  if (view && view.location && view.location.search) {
    const params = new URLSearchParams(view.location.search);
    const q = params.get('q');
    const where = params.get('in');
    if (where) {
      // 逐一比對 value，不把參數拼進選擇器字串（拼字串遇到怪字元會直接拋錯）
      for (const radio of form.querySelectorAll('input[name="bks-edition"]')) {
        if (radio.value === where) { radio.checked = true; break; }
      }
    }
    if (q) {
      input.value = q;
      run();
    }
  }
  return true;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
}
