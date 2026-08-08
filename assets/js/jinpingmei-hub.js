/* 金瓶梅宇宙・旗艦 hub 專屬互動（jinpingmei/index.html 專用）
   共用互動（js-on／reveal／影片門面）在 jinpingmei-universe.js，本檔須在其後載入。
   無 JS 時頁面完全可讀；動效尊重 prefers-reduced-motion（CSS 端處理）。 */
(function () {
  'use strict';

  // 序幕進場（弄珠客序逐句浮現）
  var overture = document.querySelector('.act-overture');
  if (overture) {
    requestAnimationFrame(function () { overture.classList.add('ov-ready'); });
  }

  // 序幕滑鼠微視差（桌面；尊重減少動態偏好）
  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (overture && !noMotion.matches && window.matchMedia('(hover: hover)').matches) {
    var quoteEl = overture.querySelector('.overture-quote');
    var titleEl = overture.querySelector('.overture-title');
    var px = 0, py = 0, raf = null;
    overture.addEventListener('mousemove', function (e) {
      px = (e.clientX / window.innerWidth - .5);
      py = (e.clientY / window.innerHeight - .5);
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        if (quoteEl) { quoteEl.style.transform = 'translate(' + (px * -7) + 'px,' + (py * -5) + 'px)'; }
        if (titleEl) { titleEl.style.transform = 'translate(' + (px * 5) + 'px,' + (py * 4) + 'px)'; }
      });
    });
    overture.addEventListener('mouseleave', function () {
      if (quoteEl) { quoteEl.style.transform = ''; }
      if (titleEl) { titleEl.style.transform = ''; }
    });
  }

  // topbar：離開頁首後上色
  var topbar = document.querySelector('[data-hub-bar]');
  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle('solid', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 右緣卷標：目前章節高亮
  var spineLinks = Array.prototype.slice.call(document.querySelectorAll('.hub-spine a'));
  var acts = spineLinks.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);
  if ('IntersectionObserver' in window && acts.length === spineLinks.length && acts.length) {
    var current = null;
    var spineIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { current = e.target.id; }
      });
      if (current) {
        spineLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
      }
    }, { rootMargin: '-42% 0px -52% 0px' });
    acts.forEach(function (s) { spineIo.observe(s); });
  }

  // 百回長卷：右起＋滑鼠拖曳橫滑（touch 交給原生捲動）
  var muScroll = document.querySelector('[data-mu-scroll]');
  if (muScroll) {
    // direction:rtl 的容器多數瀏覽器已自動停在右端；保險再置一次
    muScroll.scrollLeft = muScroll.scrollWidth;
    var dragging = false, startX = 0, startLeft = 0, moved = false;
    muScroll.addEventListener('mousedown', function (e) {
      dragging = true; moved = false;
      startX = e.pageX; startLeft = muScroll.scrollLeft;
      muScroll.classList.add('dragging');
      e.preventDefault(); // 阻止瀏覽器原生「拖曳連結」，否則 mousemove 不會連續觸發
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 4) { moved = true; }
      muScroll.scrollLeft = startLeft - dx;
    });
    window.addEventListener('mouseup', function () {
      dragging = false;
      muScroll.classList.remove('dragging');
    });
    // 拖曳後放開時抑制誤點連結
    muScroll.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); moved = false; }
    }, true);
    // 直向滾輪在長卷上轉為橫向（僅純直向滾動時）
    muScroll.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        var before = muScroll.scrollLeft;
        muScroll.scrollLeft = before - e.deltaY;
        if (muScroll.scrollLeft !== before) { e.preventDefault(); }
      }
    }, { passive: false });
  }
})();
