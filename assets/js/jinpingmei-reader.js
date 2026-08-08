/* 金瓶梅原文書房：閱讀進度條、字級記憶、左右鍵換回、續讀記憶 */
(function () {
  'use strict';

  // 續讀記憶：記住「讀到哪一回、捲到哪」＋讀過 70% 即列入已讀
  var POS_KEY = 'jpm-reading-pos';
  var SET_KEY = 'jpm-read-set';
  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 私密模式 */ } }
  function load(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
  var reader = document.querySelector('.jpm-reader');
  var posTimer = null;
  var markedRead = false;
  function currentPct() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, window.scrollY / max) : 0;
  }
  function savePos() {
    var meta = document.querySelector('.jpm-reader-head');
    if (!meta || !reader) return;
    var vol = meta.querySelector('.jpm-volume');
    var h1 = meta.querySelector('h1');
    var pct = currentPct();
    store(POS_KEY, {
      url: location.pathname,
      label: h1 ? h1.childNodes[0].textContent.trim() : '',
      edition: vol ? vol.textContent.split('・')[0] : '',
      pct: Math.round(pct * 1000) / 1000,
      t: Date.now()
    });
    if (!markedRead && pct >= 0.7) {
      markedRead = true;
      var set = load(SET_KEY) || [];
      if (set.indexOf(location.pathname) === -1) {
        set.push(location.pathname);
        store(SET_KEY, set);
      }
    }
  }
  if (reader) {
    // 先取舊記錄（savePos 會覆寫），#continue 恢復要用進頁前的值
    var prevPos = load(POS_KEY);
    window.addEventListener('scroll', function () {
      if (posTimer) clearTimeout(posTimer);
      posTimer = setTimeout(savePos, 300);
    }, { passive: true });
    savePos();
    // 從目錄「續讀」進來（#continue）：等版面穩定後跳回上次位置
    if (location.hash === '#continue' && prevPos && prevPos.url === location.pathname && prevPos.pct > 0.02) {
      window.addEventListener('load', function () {
        setTimeout(function () {
          var doc = document.documentElement;
          window.scrollTo({ top: prevPos.pct * (doc.scrollHeight - window.innerHeight), behavior: 'instant' });
          savePos();
        }, 60);
      });
    }
  }

  // 字級（localStorage 記憶）
  var KEY = 'jpm-reader-size';
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* 私密模式 */ }
  if (saved === 's' || saved === 'l') root.setAttribute('data-reader-size', saved);
  var buttons = document.querySelectorAll('.jpm-sizer button');
  function syncButtons() {
    var cur = root.getAttribute('data-reader-size') || 'm';
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.size === cur)); });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var size = b.dataset.size;
      if (size === 'm') root.removeAttribute('data-reader-size');
      else root.setAttribute('data-reader-size', size);
      try { localStorage.setItem(KEY, size); } catch (e) { /* 忽略 */ }
      syncButtons();
    });
  });
  syncButtons();

  // 閱讀進度條
  var bar = document.querySelector('[data-progress]');
  if (bar) {
    var ticking = false;
    var update = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      bar.style.width = max > 0 ? (Math.min(1, window.scrollY / max) * 100).toFixed(2) + '%' : '0%';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // 左右鍵換回（輸入框聚焦時不攔截）
  var article = document.querySelector('.jpm-reader[data-prev], .jpm-reader[data-next]');
  if (article) {
    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      var url = e.key === 'ArrowLeft' ? article.dataset.prev : (e.key === 'ArrowRight' ? article.dataset.next : '');
      if (url) window.location.href = url;
    });
  }
}());
