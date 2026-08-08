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

  // 原文書房目錄：續讀按鈕＋已讀標記（資料由 jinpingmei-reader.js 寫入）
  function load(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
  var shelfSlot = document.querySelector('[data-shelf]');
  if (shelfSlot) {
    var pos = load('jpm-reading-pos');
    if (pos && pos.url && pos.label) {
      var a = document.createElement('a');
      a.className = 'jpm-continue';
      a.href = pos.url + '#continue';
      var ab = document.createElement('b');
      ab.textContent = '續讀';
      var as = document.createElement('span');
      as.textContent = pos.edition + '・' + pos.label +
        (pos.pct >= 0.02 ? '（讀到 ' + Math.round(pos.pct * 100) + '%）' : '');
      a.appendChild(ab);
      a.appendChild(as);
      shelfSlot.appendChild(a);
      shelfSlot.hidden = false;
    }
    var readSet = load('jpm-read-set') || [];
    if (readSet.length) {
      Array.prototype.forEach.call(document.querySelectorAll('.jpm-chapter-list a[href]'), function (link) {
        if (readSet.indexOf(link.pathname) !== -1) link.parentNode.classList.add('is-read');
      });
    }
  }

  // 原文書房目錄：場景過濾＋防雷模式（遮未讀回的摘要；讀過或進度之前的回照常顯示）
  var tocTools = document.querySelector('[data-toc-tools]');
  if (tocTools) {
    var chLis = Array.prototype.slice.call(document.querySelectorAll('.jpm-chapter-list li[data-ch]'));
    var extraLis = Array.prototype.slice.call(document.querySelectorAll('.jpm-chapter-list li:not([data-ch])'));
    var blocks = Array.prototype.slice.call(document.querySelectorAll('.jpm-volume-block'));
    var chFrom = function (path) { var m = String(path).match(/\/(\d{3})\/?$/); return m ? parseInt(m[1], 10) : null; };

    var spoilerBtn = tocTools.querySelector('[data-spoiler-toggle]');
    var spoilerHint = tocTools.querySelector('[data-spoiler-hint]');
    var applySpoiler = function () {
      var on = false;
      try { on = localStorage.getItem('jpm-spoiler') === '1'; } catch (e) { /* 忽略 */ }
      var pos = load('jpm-reading-pos');
      var posCh = pos && pos.url ? chFrom(pos.url) : null;
      var readChs = {};
      (load('jpm-read-set') || []).forEach(function (u) { var n = chFrom(u); if (n !== null) readChs[n] = 1; });
      chLis.forEach(function (li) {
        var n = parseInt(li.getAttribute('data-ch'), 10);
        var safe = readChs[n] === 1 || (posCh !== null && n <= posCh);
        li.classList.toggle('is-veiled', on && !safe);
      });
      if (spoilerBtn) spoilerBtn.setAttribute('aria-pressed', String(on));
      if (spoilerHint) spoilerHint.hidden = !on;
    };
    if (spoilerBtn) {
      spoilerBtn.addEventListener('click', function () {
        try {
          var on = localStorage.getItem('jpm-spoiler') === '1';
          localStorage.setItem('jpm-spoiler', on ? '0' : '1');
        } catch (e) { /* 忽略 */ }
        applySpoiler();
      });
    }
    applySpoiler();

    Array.prototype.forEach.call(tocTools.querySelectorAll('[data-sc-filter]'), function (btn) {
      btn.addEventListener('click', function () {
        var v = btn.getAttribute('data-sc-filter');
        Array.prototype.forEach.call(tocTools.querySelectorAll('[data-sc-filter]'), function (b) { b.classList.toggle('on', b === btn); });
        chLis.forEach(function (li) { li.hidden = !!v && li.getAttribute('data-sc') !== v; });
        extraLis.forEach(function (li) { li.hidden = !!v; });
        blocks.forEach(function (bl) { bl.hidden = !bl.querySelector('.jpm-chapter-list li:not([hidden])'); });
      });
    });
    tocTools.hidden = false;
  }

  // 詞語小典：即時搜尋（比對詞與解釋全文）
  var glossInput = document.querySelector('[data-gloss-search]');
  if (glossInput) {
    var glossCount = document.querySelector('[data-gloss-count]');
    var glossGroups = Array.prototype.slice.call(document.querySelectorAll('[data-gloss-group]'));
    var glossItems = [];
    glossGroups.forEach(function (g) {
      Array.prototype.forEach.call(g.querySelectorAll('.jpm-words-item'), function (it) {
        glossItems.push({ el: it, t: it.textContent });
      });
    });
    var glossRender = function () {
      var q = glossInput.value.trim();
      var shown = 0;
      glossItems.forEach(function (it) {
        var hit = !q || it.t.indexOf(q) !== -1;
        it.el.hidden = !hit;
        if (hit) shown++;
      });
      glossGroups.forEach(function (g) { g.hidden = !g.querySelector('.jpm-words-item:not([hidden])'); });
      if (glossCount) glossCount.textContent = q ? '找到 ' + shown + ' 條' : '共 ' + glossItems.length + ' 條';
    };
    glossInput.addEventListener('input', glossRender);
    var glossBox = glossInput.closest('.jpm-gloss-search');
    if (glossBox) glossBox.hidden = false;
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
