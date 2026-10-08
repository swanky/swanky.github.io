/* AI 自學教材互動元件（/education/ai/learn/）
   每個元件以 data-ae-* 屬性宣告；沒有 JS 時內容仍可閱讀（答案在 <details> 內，CSS 會把按了沒反應的控制項藏起來）。
   每個元件各自初始化並包在 safe() 裡：單一元件出錯只會在主控台留警告，不會拖垮其他元件。
   閱讀進度存在本機瀏覽器（localStorage）；讀寫不到時改存在記憶體，至少這一頁內有效。 */
(function () {
  'use strict';

  var root = document.querySelector('.ae-page');
  if (!root) return;
  root.classList.add('ae-js');

  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function safe(name, fn) {
    return function (el) {
      try { fn(el); } catch (e) { if (window.console) console.warn('[ai-learn] ' + name, e); }
    };
  }
  function init(sel, name, fn) { $all(sel).forEach(safe(name, fn)); }

  /* ---------- 進度儲存 ---------- */
  var STORE_KEY = 'ai-learn:v1';
  var memoryStore = {};
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || memoryStore; } catch (e) { return memoryStore; }
  }
  function saveProgress(p) {
    memoryStore = p;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) { /* 私密視窗等情況：只留在記憶體 */ }
  }

  /* ---------- 進度：章節標記、章節列、單元卡片 ---------- */
  function paintProgress() {
    var p = loadProgress();
    $all('[data-ae-progress-key]').forEach(function (el) {
      var done = !!p[el.getAttribute('data-ae-progress-key')];
      el.classList.toggle('is-done', done);
      var sr = el.querySelector('.ae-sr-done');
      if (sr) sr.textContent = done ? '（已讀完）' : '';
    });
    $all('[data-ae-progress-bar]').forEach(function (bar) {
      var keys = (bar.getAttribute('data-ae-progress-bar') || '').split(',').filter(Boolean);
      var done = keys.filter(function (k) { return p[k]; }).length;
      var fill = bar.querySelector('.ae-progress__fill');
      var text = bar.querySelector('.ae-progress__text');
      if (fill) fill.style.setProperty('--w', (keys.length ? done / keys.length * 100 : 0) + '%');
      if (text) text.textContent = '已讀完 ' + done + '／' + keys.length + ' 幕';
    });
    $all('.ae-chapter-card[data-ae-progress-key] .ae-chapter-card__status').forEach(function (st) {
      st.textContent = p[st.parentElement.getAttribute('data-ae-progress-key')] ? '再讀一次 →' : '開始閱讀 →';
    });
    $all('[data-ae-done]').forEach(function (btn) {
      var done = !!p[btn.getAttribute('data-ae-done')];
      btn.classList.toggle('is-done', done);
      btn.textContent = done ? '✓ 這一幕讀完了' : '標記這一幕讀完了';
      btn.setAttribute('aria-pressed', done ? 'true' : 'false');
    });
  }
  init('[data-ae-done]', 'done', function (btn) {
    btn.addEventListener('click', function () {
      var p = loadProgress();
      var key = btn.getAttribute('data-ae-done');
      if (p[key]) delete p[key]; else p[key] = true;
      saveProgress(p);
      paintProgress();
    });
  });
  safe('progress', paintProgress)();

  /* ---------- 從別頁帶錨點進來：版面撐開後再對準一次（使用者已自行捲動就不搶） ---------- */
  safe('anchor', function () {
    if (location.hash.length < 2) return;
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    var userMoved = false;
    var mark = function () { userMoved = true; };
    ['wheel', 'touchmove', 'keydown'].forEach(function (ev) { window.addEventListener(ev, mark, { once: true, passive: true }); });
    var settle = function () { if (!userMoved) target.scrollIntoView({ block: 'start' }); };
    var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    ready.then(function () { setTimeout(settle, 150); });
    window.addEventListener('load', function () { setTimeout(settle, 300); });
  })();

  /* ---------- 章節列：手機上把目前這一幕捲進可視範圍 ---------- */
  init('.ae-rail ol', 'rail', function (ol) {
    var cur = ol.querySelector('[aria-current="page"]');
    if (cur && ol.scrollWidth > ol.clientWidth) ol.scrollLeft = cur.offsetLeft - (ol.clientWidth - cur.offsetWidth) / 2;
  });

  /* ---------- 單選測驗 ---------- */
  init('[data-ae-quiz]', 'quiz', function (quiz) {
    var answer = quiz.getAttribute('data-ae-quiz');
    var opts = $all('.ae-quiz__opt', quiz);
    var result = quiz.querySelector('.ae-quiz__result');
    var verdict = result && result.querySelector('[data-ae-verdict]');
    opts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        var picked = opt.getAttribute('data-option');
        opts.forEach(function (o) {
          o.disabled = true;
          var key = o.getAttribute('data-option');
          if (key === answer) o.classList.add('is-right');
          else if (key === picked) o.classList.add('is-wrong');
        });
        if (verdict) {
          var right = picked === answer;
          verdict.className = right ? 'is-right' : 'is-wrong';
          verdict.textContent = right ? '答對了！' : '這題的答案是 ' + answer + '。';
        }
        if (result) { result.hidden = false; result.focus({ preventScroll: true }); }
      });
    });
    var reset = quiz.querySelector('[data-ae-quiz-reset]');
    if (reset) reset.addEventListener('click', function () {
      opts.forEach(function (o) { o.disabled = false; o.classList.remove('is-right', 'is-wrong'); });
      if (result) result.hidden = true;
      if (opts[0]) opts[0].focus();
    });
  });

  /* ---------- Token：用字看 vs 用拼圖塊看 ---------- */
  init('[data-ae-tokens]', 'tokens', function (box) {
    var row = box.querySelector('.ae-tokens');
    if (!row) return;
    var btns = $all('[data-mode]', box);
    var sets = {
      chars: (box.getAttribute('data-chars') || '').split('|'),
      tokens: (box.getAttribute('data-tokens') || '').split('|')
    };
    function render(mode) {
      row.setAttribute('data-mode', mode);
      row.textContent = '';
      sets[mode].forEach(function (t) {
        var s = document.createElement('span');
        s.className = 'ae-token';
        s.textContent = t;
        row.appendChild(s);
      });
      var next = document.createElement('span');
      next.className = 'ae-token ae-token--next';
      next.textContent = '？';
      row.appendChild(next);
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false'); });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { render(b.getAttribute('data-mode')); }); });
    render('tokens');
  });

  /* ---------- 步驟播放器：data-loop-to（最後一步之後回到第幾步，1 起算，預設 2）、data-loop-label ---------- */
  init('[data-ae-steps]', 'steps', function (wrap) {
    var list = wrap.querySelector('.ae-steps');
    var steps = $all('.ae-step', wrap);
    if (!list || !steps.length) return;
    var status = wrap.querySelector('.ae-steps-status');
    var prev = wrap.querySelector('[data-step="prev"]');
    var next = wrap.querySelector('[data-step="next"]');
    var loopTo = Math.max(1, Math.min(steps.length, parseInt(wrap.getAttribute('data-loop-to'), 10) || 2)) - 1;
    var loopLabel = wrap.getAttribute('data-loop-label') || ('↻ 回到第 ' + (loopTo + 1) + ' 步');
    var i = 0;
    list.setAttribute('data-ready', '');
    function paint() {
      steps.forEach(function (s, n) {
        s.classList.toggle('is-active', n === i);
        s.classList.toggle('is-seen', n < i);
        if (n === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
      });
      if (status) status.textContent = steps[i].getAttribute('data-status') || ('第 ' + (i + 1) + ' 步');
      if (prev) prev.disabled = i === 0;
      if (next) next.textContent = i === steps.length - 1 ? loopLabel : '下一步 →';
    }
    if (prev) prev.addEventListener('click', function () { if (i > 0) { i--; paint(); } });
    if (next) next.addEventListener('click', function () { i = i === steps.length - 1 ? loopTo : i + 1; paint(); });
    paint();
  });

  /* ---------- 下一個 Token 抽籤＋溫度 ---------- */
  init('[data-ae-sampler]', 'sampler', function (box) {
    var cands = JSON.parse(box.getAttribute('data-ae-sampler'));
    var range = box.querySelector('input[type="range"]');
    var bars = box.querySelector('.ae-bars');
    var sampleBtn = box.querySelector('[data-sample]');
    if (!cands || !range || !bars || !sampleBtn) return;
    var tempLabel = box.querySelector('[data-temp-label]');
    var sentence = box.querySelector('.ae-sampler__sentence mark');
    var history = box.querySelector('.ae-history');
    var rows = cands.map(function (c) {
      var row = document.createElement('div');
      row.className = 'ae-bar';
      var label = document.createElement('span'); label.className = 'ae-bar__label'; label.textContent = c.t;
      var track = document.createElement('span'); track.className = 'ae-bar__track';
      var fill = document.createElement('span'); fill.className = 'ae-bar__fill';
      var value = document.createElement('span'); value.className = 'ae-bar__value';
      track.appendChild(fill);
      row.appendChild(label); row.appendChild(track); row.appendChild(value);
      bars.appendChild(row);
      return row;
    });
    var probs = [];
    function describe(T) {
      return T < 0.5 ? '低溫：幾乎都選同一個' : (T > 1.4 ? '高溫：冷門的字也常被抽到' : '中間：大多選常見的，偶爾換一個');
    }
    function compute() {
      var T = parseFloat(range.value);
      var w = cands.map(function (c) { return Math.pow(c.p, 1 / T); });
      var sum = w.reduce(function (a, b) { return a + b; }, 0);
      probs = w.map(function (x) { return x / sum; });
      rows.forEach(function (row, n) {
        row.querySelector('.ae-bar__fill').style.setProperty('--w', (probs[n] * 100).toFixed(1) + '%');
        row.querySelector('.ae-bar__value').textContent = Math.round(probs[n] * 100) + '%';
      });
      range.setAttribute('aria-valuetext', '溫度 ' + T.toFixed(1) + '，' + describe(T));
      if (tempLabel) tempLabel.textContent = describe(T);
    }
    function draw() {
      var r = Math.random(), acc = 0;
      for (var n = 0; n < probs.length; n++) { acc += probs[n]; if (r <= acc) return n; }
      return probs.length - 1;
    }
    range.addEventListener('input', compute);
    sampleBtn.addEventListener('click', function () {
      var n = draw();
      rows.forEach(function (row, k) { row.classList.toggle('is-picked', k === n); });
      if (sentence) sentence.textContent = cands[n].t;
      if (history) {
        var chip = document.createElement('span');
        chip.textContent = cands[n].t;
        history.appendChild(chip);
        if (history.children.length > 20) history.removeChild(history.firstChild);
      }
    });
    var clear = box.querySelector('[data-sample-clear]');
    if (clear) clear.addEventListener('click', function () {
      if (history) history.textContent = '';
      if (sentence) sentence.textContent = '＿';
      rows.forEach(function (row) { row.classList.remove('is-picked'); });
    });
    compute();
  });

  /* ---------- 分頁：.ae-tabs--wide 在桌機改成三段並列（拿掉分頁語意），手機才是分頁 ---------- */
  init('[data-ae-tabs]', 'tabs', function (wrap) {
    var tablist = wrap.querySelector('[role="tablist"], [data-ae-tablist]');
    var tabs = $all('[data-ae-tab], [role="tab"]', wrap);
    var panels = $all('[data-ae-panel], [role="tabpanel"]', wrap);
    if (!tabs.length || tabs.length !== panels.length) return;
    tabs.forEach(function (t) { t.setAttribute('data-ae-tab', ''); });
    panels.forEach(function (p) { p.setAttribute('data-ae-panel', ''); });
    if (tablist) tablist.setAttribute('data-ae-tablist', '');
    var wide = wrap.classList.contains('ae-tabs--wide') && window.matchMedia ? window.matchMedia('(min-width: 992px)') : null;
    var current = 0;
    function asTabs() {
      if (tablist) { tablist.setAttribute('role', 'tablist'); }
      tabs.forEach(function (t, k) { t.setAttribute('role', 'tab'); t.disabled = false; t.setAttribute('aria-controls', panels[k].id); });
      panels.forEach(function (p, k) { p.setAttribute('role', 'tabpanel'); if (tabs[k].id) p.setAttribute('aria-labelledby', tabs[k].id); });
      select(current, false);
    }
    function asColumns() {
      if (tablist) tablist.removeAttribute('role');
      tabs.forEach(function (t) { ['role', 'aria-selected', 'aria-controls'].forEach(function (a) { t.removeAttribute(a); }); t.tabIndex = -1; t.disabled = true; });
      panels.forEach(function (p) { p.removeAttribute('role'); p.hidden = false; });
    }
    function select(n, focus) {
      current = n;
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === n ? 'true' : 'false');
        t.tabIndex = k === n ? 0 : -1;
        panels[k].hidden = k !== n;
      });
      if (focus) tabs[n].focus();
    }
    tabs.forEach(function (t, n) {
      t.addEventListener('click', function () { if (t.getAttribute('role') === 'tab') select(n, false); });
      t.addEventListener('keydown', function (e) {
        if (t.getAttribute('role') !== 'tab') return;
        var k = null;
        if (e.key === 'ArrowRight') k = (n + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') k = (n + tabs.length - 1) % tabs.length;
        else if (e.key === 'Home') k = 0;
        else if (e.key === 'End') k = tabs.length - 1;
        if (k !== null) { e.preventDefault(); select(k, true); }
      });
    });
    function apply() { if (wide && wide.matches) asColumns(); else asTabs(); }
    if (wide) {
      if (wide.addEventListener) wide.addEventListener('change', apply);
      else if (wide.addListener) wide.addListener(apply);
    }
    apply();
  });

  /* ---------- 分類遊戲 ---------- */
  init('[data-ae-sort]', 'sort', function (game) {
    $all('.ae-sort__item', game).forEach(function (item) {
      var answer = item.getAttribute('data-answer');
      var fb = item.querySelector('.ae-sort__feedback');
      var picks = $all('[data-pick]', item);
      picks.forEach(function (b) { if (!b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', 'false'); });
      if (fb) { fb.hidden = true; fb.setAttribute('aria-live', 'polite'); }
      picks.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var right = btn.getAttribute('data-pick') === answer;
          item.classList.toggle('is-right', right);
          item.classList.toggle('is-wrong', !right);
          picks.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
          if (fb) {
            fb.hidden = false;
            if (fb.firstElementChild) fb.firstElementChild.textContent = right ? '✓ 對。' : '✗ 再想想。';
          }
        });
      });
    });
  });

  /* ---------- 翻牌卡：外層不是按鈕；由 JS 補一顆真正的「翻面」按鈕，看不到的那一面對輔助科技隱藏 ---------- */
  function setFlip(card, open) {
    var front = card.querySelector('.ae-flip__face:not(.ae-flip__face--back)');
    var back = card.querySelector('.ae-flip__face--back');
    card.classList.toggle('is-flipped', open);
    if (front) { front.setAttribute('aria-hidden', open ? 'true' : 'false'); front.inert = open; }
    if (back) { back.setAttribute('aria-hidden', open ? 'false' : 'true'); back.inert = !open; }
    $all('.ae-flip__toggle', card).forEach(function (b) {
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  init('.ae-flip', 'flip', function (card) {
    ['role', 'tabindex', 'aria-pressed'].forEach(function (a) { card.removeAttribute(a); });
    var faces = $all('.ae-flip__face', card);
    faces.forEach(function (face) {
      var isBack = face.classList.contains('ae-flip__face--back');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ae-flip__toggle';
      btn.textContent = isBack ? '翻回正面 ↺' : '翻面看答案 ↻';
      var hint = face.querySelector('.ae-flip__hint');
      if (hint) { btn.textContent = hint.textContent.replace(/\s*[↻↺]\s*$/, '') + (isBack ? ' ↺' : ' ↻'); hint.replaceWith(btn); }
      else face.appendChild(btn);
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        setFlip(card, !card.classList.contains('is-flipped'));
        var other = card.querySelector(isBack ? '.ae-flip__face:not(.ae-flip__face--back) .ae-flip__toggle' : '.ae-flip__face--back .ae-flip__toggle');
        if (other) setTimeout(function () { other.focus({ preventScroll: true }); }, 30);
      });
    });
    card.addEventListener('click', function (e) {
      if (e.target.closest('a, button, input, summary, details')) return;
      setFlip(card, !card.classList.contains('is-flipped'));
    });
    setFlip(card, false);
  });
  init('[data-ae-flip-all]', 'flip-all', function (btn) {
    var scope = document.querySelector(btn.getAttribute('data-ae-flip-all')) || document;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-pressed') !== 'true';
      $all('.ae-flip', scope).forEach(function (c) { setFlip(c, open); });
      btn.setAttribute('aria-pressed', open ? 'true' : 'false');
      btn.textContent = open ? '全部蓋回去' : (btn.getAttribute('data-label') || '全部翻開對答案');
    });
    btn.setAttribute('data-label', btn.textContent);
  });

  /* ---------- 辦公桌模擬器 ---------- */
  init('[data-ae-desk]', 'desk', function (box) {
    var cap = parseInt(box.getAttribute('data-ae-desk'), 10) || 6;
    var table = box.querySelector('.ae-desk__table');
    var meter = box.querySelector('.ae-desk__meter');
    var fill = box.querySelector('.ae-desk__meter-fill');
    var text = box.querySelector('.ae-desk__meter-text');
    var log = box.querySelector('.ae-desk__log');
    if (!table) return;
    table.removeAttribute('aria-live');
    var papers = [];
    var turn = 0;
    function used() { return papers.reduce(function (a, p) { return a + p.size; }, 0); }
    function paint() {
      var u = used();
      if (fill) fill.style.setProperty('--w', Math.min(100, u / cap * 100) + '%');
      if (meter) meter.classList.toggle('is-full', u >= cap);
      if (text) text.textContent = '桌面使用量 ' + u + '／' + cap + ' 格';
      var empty = table.querySelector('.ae-desk__empty');
      if (empty) empty.hidden = papers.length > 0;
    }
    function add(label, size, color, kind) {
      var el = document.createElement('div');
      el.className = 'ae-paper' + (kind === 'summary' ? ' ae-paper--summary' : '');
      if (color) el.style.setProperty('--c', color);
      el.textContent = label;
      table.appendChild(el);
      papers.push({ el: el, size: size, kind: kind, label: label });
      var dropped = [];
      while (used() > cap) {
        var idx = papers.findIndex(function (p) { return p.kind !== 'rule'; });
        if (idx < 0) idx = 0;
        var old = papers.splice(idx, 1)[0];
        dropped.push(old.label);
        old.el.classList.add('is-falling');
        (function (node) { setTimeout(function () { node.remove(); }, 450); })(old.el);
      }
      if (log) {
        log.textContent = dropped.length
          ? '桌面滿了，最早的「' + dropped.join('」「') + '」被擠掉——AI 這一輪就看不到它了。'
          : 'AI 這一輪會把桌上全部重讀一次再回答。';
      }
      paint();
    }
    function start() {
      var list = [];
      try { list = JSON.parse(box.getAttribute('data-init') || '[]'); } catch (e) { list = []; }
      list.forEach(function (it) { add(it.label, it.size || 1, it.color, it.kind); if (it.kind === 'chat') turn++; });
      if (log) log.textContent = '';
      paint();
    }
    $all('[data-add]', box).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var kind = btn.getAttribute('data-add');
        var label = btn.getAttribute('data-label');
        if (kind === 'chat') { turn++; label = '💬 第 ' + turn + ' 輪對話'; }
        add(label, parseInt(btn.getAttribute('data-size'), 10) || 1, btn.getAttribute('data-color'), kind);
      });
    });
    var sum = box.querySelector('[data-summarize]');
    if (sum) sum.addEventListener('click', function () {
      if (!papers.length) return;
      papers.forEach(function (p) { p.el.remove(); });
      papers = [];
      add('📝 摘要：目前結論＋不能改的要求（5 點）', 1, '#e5a300', 'summary');
      if (log) log.textContent = '開了新對話，只帶摘要過來：桌面清爽，最早的要求也還在。記得自己看一眼摘要有沒有漏掉重點。';
    });
    var clear = box.querySelector('[data-clear]');
    if (clear) clear.addEventListener('click', function () {
      papers.forEach(function (p) { p.el.remove(); });
      papers = []; turn = 0;
      start();
    });
    start();
  });

  /* ---------- 對話逐句重現 ---------- */
  init('[data-ae-chat]', 'chat', function (box) {
    var msgs = $all('.ae-chat__msg', box);
    var btn = box.querySelector('[data-chat-next]');
    var after = box.querySelector('[data-chat-after]');
    if (!msgs.length || !btn) return;
    var shown = 1;
    msgs.forEach(function (m, n) { m.hidden = n >= shown; });
    if (after) after.hidden = true;
    btn.addEventListener('click', function () {
      if (shown < msgs.length) { msgs[shown].hidden = false; shown++; }
      if (shown >= msgs.length) {
        btn.hidden = true;
        if (after) after.hidden = false;
      }
    });
  });

  /* ---------- 角色地圖：點角色顯示說明（內容放在 <template>） ---------- */
  init('[data-ae-map]', 'map', function (map) {
    var detail = map.querySelector('.ae-map__detail');
    if (!detail) return;
    detail.setAttribute('aria-live', 'polite');
    var roles = $all('[data-tpl]', map);
    roles.forEach(function (r) {
      r.addEventListener('click', function () {
        roles.forEach(function (x) { x.setAttribute('aria-pressed', x === r ? 'true' : 'false'); });
        var tpl = document.getElementById(r.getAttribute('data-tpl'));
        if (!tpl) return;
        detail.textContent = '';
        detail.appendChild(tpl.content.cloneNode(true));
      });
    });
  });

  /* ---------- 名詞小抄：搜尋與篩選 ---------- */
  init('[data-ae-gloss]', 'gloss', function (box) {
    var input = box.querySelector('.ae-gloss__search');
    var filters = $all('.ae-gloss__filter', box);
    var terms = $all('.ae-term', box);
    var count = box.querySelector('.ae-gloss__count');
    var active = 'all';
    function apply() {
      var q = ((input && input.value) || '').trim().toLowerCase();
      var shown = 0;
      terms.forEach(function (t) {
        var okFilter = active === 'all' || (active === 'star' ? t.hasAttribute('data-star') : t.getAttribute('data-chapter') === active);
        var okText = !q || t.textContent.toLowerCase().indexOf(q) >= 0;
        t.hidden = !(okFilter && okText);
        if (!t.hidden) shown++;
      });
      if (count) count.textContent = '顯示 ' + shown + ' 個名詞';
    }
    if (input) input.addEventListener('input', apply);
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        active = f.getAttribute('data-filter');
        filters.forEach(function (x) { x.setAttribute('aria-pressed', x === f ? 'true' : 'false'); });
        apply();
      });
    });
    apply();
  });

  /* ---------- 自我檢核計分（門檻依題數比例） ---------- */
  init('[data-ae-check]', 'check', function (box) {
    var boxes = $all('input[type="checkbox"]', box);
    var out = box.querySelector('.ae-check__score');
    if (!boxes.length || !out) return;
    var key = 'check:' + box.getAttribute('data-ae-check');
    var saved = loadProgress()[key] || [];
    boxes.forEach(function (b, n) { b.checked = saved.indexOf(n) >= 0; });
    function paint(store) {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      var total = boxes.length;
      var ratio = n / total;
      var msg = ratio >= 0.85 ? '觀念通了！' : (ratio >= 0.65 ? '差一點：回到沒勾的那幾題，重讀旁邊標的那一幕。' : '先從上面那張「四個關鍵詞＋Agent」的圖，和各幕的「只記一句」重看起。');
      out.textContent = '';
      var s = document.createElement('strong');
      s.textContent = n + '／' + total + ' 題';
      out.appendChild(s);
      out.appendChild(document.createTextNode('　' + msg));
      if (store) {
        var p = loadProgress();
        p[key] = boxes.map(function (b, k) { return b.checked ? k : -1; }).filter(function (k) { return k >= 0; });
        saveProgress(p);
      }
    }
    boxes.forEach(function (b) { b.addEventListener('change', function () { paint(true); }); });
    paint(false);
  });
})();
