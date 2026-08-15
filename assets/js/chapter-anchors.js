/* 本回節點：正文頂部段落級導覽的執行期驗證與捲動行為。
 *
 * 資料是 AI 整理出來的段落位置（見 _data/book_anchors/），這裡在瀏覽器端重新核對一次
 * 「這個位置現在還是不是原來那句話開頭」——原文若曾被改動、資料就會跟著漂移，核對不過
 * 的節點只隱藏、不亂指；不對原文本身做任何改動或標記（只在 nth 模式下對段落補一個 id
 * 屬性方便跳轉，不動文字內容）。
 *
 * 兩種模式（契約與 tools/build_book_anchor_index.mjs、tools/merge_book_anchors.mjs 一致）：
 *   nth — 金瓶梅：段落原本沒有 id，正文容器內第 N 個 <p>（1-based）即為該筆資料指的段落。
 *   id  — 五書：段落本來就有 id="p-xxx-yyyy"，Liquid 已經算好可用的 href，這裡只需要驗證。
 */
(function () {
  'use strict';

  var navs = document.querySelectorAll('[data-anchors]');
  var chapterBody = document.getElementById('chapter-body');
  if (!navs.length || !chapterBody) return;

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* 忽略 */ }

  function normalize(text) { return (text || '').replace(/\s+/g, ''); }

  function flash(el) {
    if (!el) return;
    el.classList.add('anchor-flash');
    var clear = function () { el.classList.remove('anchor-flash'); };
    el.addEventListener('animationend', clear, { once: true });
    // reduced-motion 或動畫被瀏覽器略過時的保險，避免高亮卡住不消失
    setTimeout(clear, 1500);
  }

  function goTo(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
    flash(el);
  }

  navs.forEach(function (nav) {
    var mode = nav.dataset.mode;
    var chips = Array.prototype.slice.call(nav.querySelectorAll('a[data-p]'));
    if (!chips.length) return;

    var paragraphs = mode === 'nth' ? chapterBody.querySelectorAll('p') : null;
    var okCount = 0;

    chips.forEach(function (a) {
      var k = a.dataset.k || '';
      var target = null;

      if (mode === 'nth') {
        var idx = parseInt(a.dataset.p, 10) - 1;
        var p = (idx >= 0 && paragraphs) ? paragraphs[idx] : null;
        if (p && normalize(p.textContent).indexOf(k) === 0) {
          if (!p.id) p.id = 'anc-' + a.dataset.p;
          a.setAttribute('href', '#' + p.id);
          target = p;
        }
      } else {
        var href = a.getAttribute('href') || '';
        var el = href.indexOf('#') === 0 ? document.getElementById(href.slice(1)) : null;
        if (el && normalize(el.textContent).indexOf(k) === 0) target = el;
      }

      if (target) {
        okCount += 1;
        a.addEventListener('click', function (e) {
          e.preventDefault();
          goTo(target);
        });
      } else {
        a.hidden = true;
        console.warn('[chapter-anchors] 段落前綴對不上原文，已隱藏本節點：', a.textContent);
      }
    });

    // hidden 的啟用／關閉只在 nth 模式做：id 模式的 chip 本來就有可用的 href，
    // 一開始就不是 hidden，個別驗證失敗只隱藏那一顆 chip，不影響整個 nav。
    if (mode === 'nth') nav.hidden = okCount === 0;
  });
}());
