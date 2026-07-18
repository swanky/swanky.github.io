/* /story/ ——「三個宇宙」2026 旗艦互動層（無相依）。
   JS 失敗或停用時：所有內容基底可見、導覽可用、圖片正常顯示。
   支援 scroll-driven animations 的瀏覽器由 CSS 接手；此檔處理 fallback、blur-up、章節狀態與 fine-pointer 回饋。
   WebGL 粒子與攝影序曲由 story-gl.js 獨立管理，失敗時不影響本層。 */
(function () {
  'use strict';

  var supports = (window.CSS && CSS.supports) ? CSS.supports.bind(CSS) : function () { return false; };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasViewTimeline = supports('animation-timeline: view()');
  var hasScrollTimeline = supports('animation-timeline: scroll()');
  var html = document.documentElement;

  /* ---- blur-up：影像載入完成後淡入（處理快取已完成的情況＋失敗兜底） ---- */
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.media-img'));
  imgs.forEach(function (img) {
    var done = function () { img.classList.add('is-loaded'); };
    if (img.complete && img.naturalWidth > 0) { done(); return; }
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
  if (!reduceMotion) html.classList.add('blurup-ready');
  window.addEventListener('load', function () {
    imgs.forEach(function (img) { img.classList.add('is-loaded'); });
  });

  /* ---- 幕導覽狀態 + 頂欄明暗切換（任何瀏覽器皆生效） ---- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('.act'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.acts-nav a'));
  var paperActs = { '5': true }; /* 05・合作 為紙感淺底，頂欄翻淺色 */
  var universes = { '1': 'focus', '2': 'light', '3': 'code', '4': 'chain', '5': 'work', '6': 'focus' };

  if ('IntersectionObserver' in window && sections.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var act = e.target.getAttribute('data-act');
        dots.forEach(function (d) {
          var active = d.getAttribute('data-dot') === act;
          d.classList.toggle('is-active', active);
          if (active) d.setAttribute('aria-current', 'location');
          else d.removeAttribute('aria-current');
        });
        document.body.classList.toggle('nav-on-paper', !!paperActs[act]);
        document.body.setAttribute('data-universe', universes[act] || 'focus');
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
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
    html.classList.add('reveal-ready');
  }
  if (!reduceMotion && hasViewTimeline) html.classList.add('reveal-ready');

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

  /* ---- 精細指標互動：只在 fine pointer 啟用；不影響鍵盤、觸控與 reduced-motion ---- */
  if (!reduceMotion && window.matchMedia && matchMedia('(pointer: fine)').matches) {
    var root = document.documentElement;
    var pointerTick = false;
    var pointerX = 0, pointerY = 0;
    window.addEventListener('pointermove', function (e) {
      pointerX = (e.clientX / Math.max(1, innerWidth) - .5) * 2;
      pointerY = (e.clientY / Math.max(1, innerHeight) - .5) * 2;
      if (pointerTick) return;
      pointerTick = true;
      requestAnimationFrame(function () {
        root.style.setProperty('--pointer-x', pointerX.toFixed(3));
        root.style.setProperty('--pointer-y', pointerY.toFixed(3));
        pointerTick = false;
      });
    }, { passive: true });

    document.querySelectorAll('.tilt-surface').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = Math.min(1, Math.max(0, (e.clientX - r.left) / Math.max(1, r.width)));
        var y = Math.min(1, Math.max(0, (e.clientY - r.top) / Math.max(1, r.height)));
        card.style.setProperty('--tilt-x', ((x - .5) * 6).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', ((.5 - y) * 6).toFixed(2) + 'deg');
        card.style.setProperty('--glow-x', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--glow-y', (y * 100).toFixed(1) + '%');
      }, { passive: true });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      }, { passive: true });
    });
  }
})();
