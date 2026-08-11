/* 古典小說通用閱讀器：字級記憶、米紙模式、閱讀進度、續讀記憶、左右鍵換回。
 *
 * 行為刻意與金瓶梅原文書房一致（assets/js/jinpingmei-reader.js 為其原型），
 * 差別在 localStorage 鍵依 book_id 分開——不同作品的閱讀位置互不干擾，
 * 但字級與米紙模式是跨作品偏好，用共用鍵。
 *
 * 兩份閱讀器 JS 的收斂條件見 docs/novel-platform/architecture.md §5。
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reader = document.querySelector('.bk-reader');
  var bookId = (reader && reader.dataset.book) || (document.body && document.body.dataset.book) || 'book';

  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 私密模式 */ } }
  function load(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }

  // ── 續讀記憶（每本書一組）：記讀到哪一篇、捲到哪；讀過 70% 列入已讀 ──
  var POS_KEY = 'bk-pos-' + bookId;
  var SET_KEY = 'bk-read-' + bookId;
  var posTimer = null;
  var markedRead = false;

  function currentPct() {
    var max = root.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, window.scrollY / max) : 0;
  }

  function savePos() {
    var head = document.querySelector('.bk-reader-head');
    if (!head || !reader) return;
    var h1 = head.querySelector('h1');
    var pct = currentPct();
    store(POS_KEY, {
      url: location.pathname,
      label: h1 ? h1.childNodes[0].textContent.trim() : '',
      pct: Math.round(pct * 1000) / 1000,
      t: Date.now()
    });
    if (!markedRead && pct >= 0.7) {
      markedRead = true;
      var set = load(SET_KEY) || [];
      if (set.indexOf(location.pathname) === -1) { set.push(location.pathname); store(SET_KEY, set); }
    }
  }

  if (reader) {
    var prevPos = load(POS_KEY); // 先取舊值，savePos 會覆寫
    window.addEventListener('scroll', function () {
      if (posTimer) clearTimeout(posTimer);
      posTimer = setTimeout(savePos, 300);
    }, { passive: true });
    savePos();
    // 從目錄「接著上次讀」進來（#continue）：等版面穩定後跳回上次位置
    if (location.hash === '#continue' && prevPos && prevPos.url === location.pathname && prevPos.pct > 0.02) {
      window.addEventListener('load', function () {
        setTimeout(function () {
          window.scrollTo({ top: prevPos.pct * (root.scrollHeight - window.innerHeight), behavior: 'instant' });
          savePos();
        }, 60);
      });
    }
  }

  // ── 目錄頁：續讀入口與已讀標記 ──
  var resume = document.querySelector('[data-resume]');
  if (resume) {
    var pos = load(POS_KEY);
    if (pos && pos.url) {
      var a = resume.querySelector('a');
      a.setAttribute('href', pos.url + '#continue');
      a.querySelector('[data-resume-label]').textContent = pos.label || '上次讀到的地方';
      resume.hidden = false;
    }
  }
  var readSet = load(SET_KEY) || [];
  if (readSet.length) {
    document.querySelectorAll('.bk-chapter-list a').forEach(function (a) {
      if (readSet.indexOf(new URL(a.href, location.href).pathname) !== -1) a.parentNode.classList.add('is-read');
    });
  }

  // ── 字級（跨作品共用偏好）──
  var SIZE_KEY = 'bk-reader-size';
  var saved = null;
  try { saved = localStorage.getItem(SIZE_KEY); } catch (e) { /* 私密模式 */ }
  if (saved === 's' || saved === 'l') root.setAttribute('data-reader-size', saved);
  var buttons = document.querySelectorAll('.bk-sizer button');
  function syncButtons() {
    var cur = root.getAttribute('data-reader-size') || 'm';
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.size === cur)); });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var size = b.dataset.size;
      if (size === 'm') root.removeAttribute('data-reader-size');
      else root.setAttribute('data-reader-size', size);
      try { localStorage.setItem(SIZE_KEY, size); } catch (e) { /* 忽略 */ }
      syncButtons();
    });
  });
  syncButtons();

  // ── 米紙模式（跨作品共用偏好；class 由 layout head 的防閃爍腳本先行套用）──
  var paperBtn = document.querySelector('[data-paper-toggle]');
  if (paperBtn) {
    var syncPaper = function () { paperBtn.setAttribute('aria-pressed', String(root.classList.contains('bk-paper'))); };
    paperBtn.addEventListener('click', function () {
      root.classList.toggle('bk-paper');
      try { localStorage.setItem('bk-paper', root.classList.contains('bk-paper') ? '1' : '0'); } catch (e) { /* 忽略 */ }
      syncPaper();
    });
    syncPaper();
  }

  // ── 閱讀進度條 ──
  var bar = document.querySelector('[data-progress]');
  if (bar) {
    var ticking = false;
    var update = function () {
      var max = root.scrollHeight - window.innerHeight;
      bar.style.width = max > 0 ? (Math.min(1, window.scrollY / max) * 100).toFixed(2) + '%' : '0%';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // ── 左右鍵換回（輸入框聚焦時不攔截）──
  var nav = document.querySelector('.bk-reader[data-prev], .bk-reader[data-next]');
  if (nav) {
    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      var url = e.key === 'ArrowLeft' ? nav.dataset.prev : (e.key === 'ArrowRight' ? nav.dataset.next : '');
      if (url) window.location.href = url;
    });
  }
}());
