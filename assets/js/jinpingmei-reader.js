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
  // 進度只算正文區塊（.jpm-reader＝<article id="chapter-body">），不含回內導航、換頁列、
  // 收錄說明與頁尾。舊版用整份文件算，讀完最後一句還停在八成多，而且「讀過 70% 記為已讀」
  // 會被頁尾稀釋——同一回讀完卻沒被標成已讀（2026-08 稽核 P0-2）。
  // POS_SCHEMA 是為了平滑遷移：舊紀錄的 pct 是文件基準，恢復位置時要用舊公式換算。
  var POS_SCHEMA = 2;
  function bodyTop() { return reader.getBoundingClientRect().top + window.scrollY; }
  function currentPct() {
    var doc = document.documentElement;
    if (!reader || reader.offsetHeight <= 0) {
      var max = doc.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, window.scrollY / max) : 0;
    }
    // 讀到的量＝視窗底緣越過正文起點的距離；正文底緣進到視窗底緣時＝100%
    var read = window.scrollY + window.innerHeight - bodyTop();
    return Math.max(0, Math.min(1, read / reader.offsetHeight));
  }
  function scrollToPct(pct, schema) {
    var doc = document.documentElement;
    if (schema !== POS_SCHEMA || !reader || reader.offsetHeight <= 0) {
      window.scrollTo({ top: pct * (doc.scrollHeight - window.innerHeight), behavior: 'instant' });
      return;
    }
    window.scrollTo({ top: Math.max(0, bodyTop() + pct * reader.offsetHeight - window.innerHeight), behavior: 'instant' });
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
      v: POS_SCHEMA,
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
          scrollToPct(prevPos.pct, prevPos.v);
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

  // 米紙模式（淺色紙感主題）：class 由 layout head 內的防閃爍腳本先行套用
  var paperBtn = document.querySelector('[data-paper-toggle]');
  if (paperBtn) {
    var syncPaper = function () {
      paperBtn.setAttribute('aria-pressed', String(root.classList.contains('jpm-paper')));
    };
    paperBtn.addEventListener('click', function () {
      root.classList.toggle('jpm-paper');
      try { localStorage.setItem('jpm-paper', root.classList.contains('jpm-paper') ? '1' : '0'); } catch (e) { /* 忽略 */ }
      syncPaper();
    });
    syncPaper();
  }

  // 閱讀進度條
  var bar = document.querySelector('[data-progress]');
  if (bar) {
    var ticking = false;
    var update = function () {
      // 與續讀記憶同一個基準（正文區塊），否則進度條與「讀到 X%」會對不起來
      bar.style.width = (currentPct() * 100).toFixed(2) + '%';
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
