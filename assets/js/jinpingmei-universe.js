/* 金瓶梅宇宙・共用互動（hub 與全部子頁）
   1) js-on 旗標：無 JS 時 .reveal 一律直接可見（CSS 端以 .js-on 為前提）
   2) 捲動進場 reveal
   3) 影片門面：點擊才載入 YouTube 播放器（.film-player）
   動效尊重 prefers-reduced-motion（CSS 端處理）。 */
(function () {
  'use strict';
  document.documentElement.classList.add('js-on');

  // 捲動進場 reveal
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // 影片門面：點擊才載入 YouTube 播放器
  Array.prototype.forEach.call(document.querySelectorAll('.film-player'), function (player) {
    var btn = player.querySelector('.film-play');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var id = player.getAttribute('data-video-id');
      if (!id) return;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&autoplay=1';
      iframe.title = player.getAttribute('data-video-title') || 'YouTube 影片';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute('allowfullscreen', '');
      player.innerHTML = '';
      player.appendChild(iframe);
      player.classList.add('playing');
    });
  });
})();
