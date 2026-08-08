/* 金瓶梅原文書房：閱讀進度條、字級記憶、左右鍵換回 */
(function () {
  'use strict';

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
