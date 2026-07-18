/* /story/ ——「三個宇宙」P1 漸進增強腳本（無相依）。
   職責：blur-up 影像淡入、幕導覽狀態與頂欄明暗切換、
   以及「不支援 CSS scroll-driven（如 Firefox）」時的 reveal 與進度條兜底。
   P2 才會啟用 #story-hero-gl 的 WebGL 粒子聚焦；此檔 P1 不碰它。 */
(function () {
  'use strict';

  var supports = (window.CSS && CSS.supports) ? CSS.supports.bind(CSS) : function () { return false; };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasViewTimeline = supports('animation-timeline: view()');
  var hasScrollTimeline = supports('animation-timeline: scroll()');

  /* ---- blur-up：影像載入完成後淡入（處理快取已完成的情況＋失敗兜底） ---- */
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.media-img'));
  imgs.forEach(function (img) {
    var done = function () { img.classList.add('is-loaded'); };
    if (img.complete && img.naturalWidth > 0) { done(); return; }
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
  window.addEventListener('load', function () {
    imgs.forEach(function (img) { img.classList.add('is-loaded'); });
  });

  /* ---- 幕導覽狀態 + 頂欄明暗切換（任何瀏覽器皆生效） ---- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('.act'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.acts-nav a'));
  var paperActs = { '5': true }; /* 05・合作 為紙感淺底，頂欄翻淺色 */

  if ('IntersectionObserver' in window && sections.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var act = e.target.getAttribute('data-act');
        dots.forEach(function (d) {
          d.classList.toggle('is-active', d.getAttribute('data-dot') === act);
        });
        document.body.classList.toggle('nav-on-paper', !!paperActs[act]);
      });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ---- reveal 兜底：僅在「有 JS、允許動效、但不支援 scroll-driven」時啟用 ---- */
  if (!reduceMotion && !hasViewTimeline && 'IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });
  }

  /* ---- 極端兜底：有 JS 但 scroll-driven 與 IntersectionObserver 皆不可用時，直接顯示全部內容（內容零損失） ---- */
  if (!hasViewTimeline && !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) { el.classList.add('is-in'); });
  }

  /* ---- 進度條兜底：不支援 scroll-driven 時以捲動比例更新 ---- */
  var progress = document.querySelector('.progress');
  if (progress && !hasScrollTimeline && !reduceMotion) {
    var ticking = false;
    var update = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var ratio = max > 0 ? (h.scrollTop || window.pageYOffset || 0) / max : 0;
      progress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, ratio)) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
