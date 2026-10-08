/* AI 自學教材互動元件（/education/ai/learn/）
   每個元件以 data-ae-* 屬性宣告，沒有 JS 時內容仍可閱讀（答案在 <details> 內）。
   閱讀進度存在本機瀏覽器（localStorage），讀不到就當作沒有進度。 */
(function () {
  'use strict';

  var root = document.querySelector('.ae-page');
  if (!root) return;
  root.classList.add('ae-js');

  var STORE_KEY = 'ai-learn:v1';
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) { /* 私密視窗等情況忽略 */ }
  }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- 進度：章節標記、六幕列、hub 卡片 ---------- */
  function paintProgress() {
    var p = loadProgress();
    $all('[data-ae-progress-key]').forEach(function (el) {
      el.classList.toggle('is-done', !!p[el.getAttribute('data-ae-progress-key')]);
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
  $all('[data-ae-done]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var p = loadProgress();
      var key = btn.getAttribute('data-ae-done');
      if (p[key]) delete p[key]; else p[key] = true;
      saveProgress(p);
      paintProgress();
    });
  });
  paintProgress();

  /* 從別頁帶錨點進來：字型與動畫載完、版面撐開後再對準一次 */
  if (location.hash.length > 1) {
    var settle = function () {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) t.scrollIntoView({ block: 'start' });
    };
    var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    ready.then(function () { setTimeout(settle, 150); });
    window.addEventListener('load', function () { setTimeout(settle, 300); });
  }

  /* 手機上把目前章節捲進導覽列可視範圍 */
  $all('.ae-rail ol').forEach(function (ol) {
    var cur = ol.querySelector('[aria-current="page"]');
    if (cur && ol.scrollWidth > ol.clientWidth) ol.scrollLeft = cur.offsetLeft - (ol.clientWidth - cur.offsetWidth) / 2;
  });

  /* ---------- 單選測驗 ---------- */
  $all('[data-ae-quiz]').forEach(function (quiz) {
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
    });
  });

  /* ---------- Token：用字看 vs 用拼圖塊看 ---------- */
  $all('[data-ae-tokens]').forEach(function (box) {
    var row = box.querySelector('.ae-tokens');
    var btns = $all('[data-mode]', box);
    var sets = { chars: box.getAttribute('data-chars').split('|'), tokens: box.getAttribute('data-tokens').split('|') };
    function render(mode) {
      row.setAttribute('data-mode', mode);
      row.innerHTML = '';
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

  /* ---------- 步驟播放器 ---------- */
  $all('[data-ae-steps]').forEach(function (wrap) {
    var list = wrap.querySelector('.ae-steps');
    var steps = $all('.ae-step', wrap);
    var status = wrap.querySelector('.ae-steps-status');
    var prev = wrap.querySelector('[data-step="prev"]');
    var next = wrap.querySelector('[data-step="next"]');
    var i = 0;
    list.setAttribute('data-ready', '');
    function paint() {
      steps.forEach(function (s, n) {
        s.classList.toggle('is-active', n === i);
        s.classList.toggle('is-seen', n < i);
      });
      if (status) status.textContent = steps[i].getAttribute('data-status') || ('第 ' + (i + 1) + ' 步');
      if (prev) prev.disabled = i === 0;
      if (next) next.textContent = i === steps.length - 1 ? '↻ 回到第 2 步，再接一塊' : '下一步 →';
    }
    if (prev) prev.addEventListener('click', function () { if (i > 0) { i--; paint(); } });
    if (next) next.addEventListener('click', function () { i = i === steps.length - 1 ? 1 : i + 1; paint(); });
    paint();
  });

  /* ---------- 下一個 Token 抽籤＋溫度 ---------- */
  $all('[data-ae-sampler]').forEach(function (box) {
    var cands = JSON.parse(box.getAttribute('data-ae-sampler'));
    var range = box.querySelector('input[type="range"]');
    var tempLabel = box.querySelector('[data-temp-label]');
    var sentence = box.querySelector('.ae-sampler__sentence mark');
    var history = box.querySelector('.ae-history');
    var bars = box.querySelector('.ae-bars');
    var rows = cands.map(function (c) {
      var row = document.createElement('div');
      row.className = 'ae-bar';
      row.innerHTML = '<span class="ae-bar__label"></span><span class="ae-bar__track"><span class="ae-bar__fill"></span></span><span class="ae-bar__value"></span>';
      row.querySelector('.ae-bar__label').textContent = c.t;
      bars.appendChild(row);
      return row;
    });
    var probs = [];
    function temp() { return parseFloat(range.value); }
    function compute() {
      var T = temp();
      var w = cands.map(function (c) { return Math.pow(c.p, 1 / T); });
      var sum = w.reduce(function (a, b) { return a + b; }, 0);
      probs = w.map(function (x) { return x / sum; });
      rows.forEach(function (row, n) {
        row.querySelector('.ae-bar__fill').style.setProperty('--w', (probs[n] * 100).toFixed(1) + '%');
        row.querySelector('.ae-bar__value').textContent = Math.round(probs[n] * 100) + '%';
      });
      if (tempLabel) tempLabel.textContent = T < 0.5 ? '低溫：幾乎都選同一個' : (T > 1.4 ? '高溫：冷門的字也常被抽到' : '中間：大多選常見的，偶爾換一個');
    }
    function draw() {
      var r = Math.random();
      var acc = 0;
      for (var n = 0; n < probs.length; n++) {
        acc += probs[n];
        if (r <= acc) return n;
      }
      return probs.length - 1;
    }
    range.addEventListener('input', compute);
    box.querySelector('[data-sample]').addEventListener('click', function () {
      var n = draw();
      rows.forEach(function (row, k) { row.classList.toggle('is-picked', k === n); });
      sentence.textContent = cands[n].t;
      var chip = document.createElement('span');
      chip.textContent = cands[n].t;
      history.appendChild(chip);
      if (history.children.length > 20) history.removeChild(history.firstChild);
    });
    var clear = box.querySelector('[data-sample-clear]');
    if (clear) clear.addEventListener('click', function () {
      history.innerHTML = '';
      sentence.textContent = '＿';
      rows.forEach(function (row) { row.classList.remove('is-picked'); });
    });
    compute();
  });

  /* ---------- 分頁 ---------- */
  $all('[data-ae-tabs]').forEach(function (wrap) {
    var tabs = $all('[role="tab"]', wrap);
    var panels = $all('[role="tabpanel"]', wrap);
    function select(n) {
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === n ? 'true' : 'false');
        t.tabIndex = k === n ? 0 : -1;
        panels[k].hidden = k !== n;
      });
    }
    tabs.forEach(function (t, n) {
      t.addEventListener('click', function () { select(n); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          var k = (n + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
          select(k); tabs[k].focus();
        }
      });
    });
    select(0);
  });

  /* ---------- 分類遊戲 ---------- */
  $all('[data-ae-sort]').forEach(function (game) {
    $all('.ae-sort__item', game).forEach(function (item) {
      var answer = item.getAttribute('data-answer');
      var fb = item.querySelector('.ae-sort__feedback');
      $all('[data-pick]', item).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var right = btn.getAttribute('data-pick') === answer;
          item.classList.toggle('is-right', right);
          item.classList.toggle('is-wrong', !right);
          $all('[data-pick]', item).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
          if (fb) { fb.hidden = false; fb.firstElementChild.textContent = right ? '✓ 對。' : '✗ 再想想。'; }
        });
      });
    });
  });

  /* ---------- 翻牌 ---------- */
  $all('.ae-flip[role="button"]').forEach(function (card) {
    function flip() {
      var flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    }
    card.addEventListener('click', flip);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });
  });

  /* 全部翻開／全部蓋回 */
  $all('[data-ae-flip-all]').forEach(function (btn) {
    var scope = document.querySelector(btn.getAttribute('data-ae-flip-all'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-pressed') !== 'true';
      $all('.ae-flip', scope).forEach(function (c) { c.classList.toggle('is-flipped', open); c.setAttribute('aria-pressed', open ? 'true' : 'false'); });
      btn.setAttribute('aria-pressed', open ? 'true' : 'false');
      btn.textContent = open ? '全部蓋回去' : '全部翻開對答案';
    });
  });

  /* ---------- 辦公桌模擬器 ---------- */
  $all('[data-ae-desk]').forEach(function (box) {
    var cap = parseInt(box.getAttribute('data-ae-desk'), 10) || 6;
    var table = box.querySelector('.ae-desk__table');
    var meter = box.querySelector('.ae-desk__meter');
    var fill = box.querySelector('.ae-desk__meter-fill');
    var text = box.querySelector('.ae-desk__meter-text');
    var log = box.querySelector('.ae-desk__log');
    var papers = [];
    var turn = 0;
    function paint() {
      var used = papers.reduce(function (a, p) { return a + p.size; }, 0);
      fill.style.setProperty('--w', Math.min(100, used / cap * 100) + '%');
      meter.classList.toggle('is-full', used >= cap);
      text.textContent = '桌面使用量 ' + used + '／' + cap + ' 格';
      var empty = table.querySelector('.ae-desk__empty');
      if (empty) empty.hidden = papers.length > 0;
    }
    function add(label, size, color, kind) {
      var el = document.createElement('div');
      el.className = 'ae-paper' + (kind === 'summary' ? ' ae-paper--summary' : '');
      el.style.setProperty('--c', color);
      el.textContent = label;
      table.appendChild(el);
      papers.push({ el: el, size: size, kind: kind, label: label });
      var used = papers.reduce(function (a, p) { return a + p.size; }, 0);
      var dropped = [];
      while (used > cap) {
        var idx = papers.findIndex(function (p) { return p.kind !== 'rule'; });
        if (idx < 0) idx = 0;
        var old = papers.splice(idx, 1)[0];
        used -= old.size;
        dropped.push(old.label);
        old.el.classList.add('is-falling');
        (function (node) { setTimeout(function () { node.remove(); }, 500); })(old.el);
      }
      if (log) {
        log.textContent = dropped.length
          ? '桌面滿了，最早的「' + dropped.join('」「') + '」被擠掉——AI 這一輪就看不到它了。'
          : 'AI 這一輪會把桌上全部重讀一次再回答。';
      }
      paint();
    }
    $all('[data-add]', box).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var kind = btn.getAttribute('data-add');
        var size = parseInt(btn.getAttribute('data-size'), 10) || 1;
        var label = btn.getAttribute('data-label');
        if (kind === 'chat') { turn++; label = '第 ' + turn + ' 輪對話'; }
        add(label, size, btn.getAttribute('data-color'), kind);
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
      init();
    });
    function init() {
      var list = [];
      try { list = JSON.parse(box.getAttribute('data-init') || '[]'); } catch (e) { list = []; }
      list.forEach(function (it) { add(it.label, it.size || 1, it.color, it.kind); if (it.kind === 'chat') turn++; });
      if (log) log.textContent = '';
      paint();
    }
    init();
  });

  /* ---------- 對話逐句重現 ---------- */
  $all('[data-ae-chat]').forEach(function (box) {
    var msgs = $all('.ae-chat__msg', box);
    var btn = box.querySelector('[data-chat-next]');
    var after = box.querySelector('[data-chat-after]');
    var shown = 1;
    msgs.forEach(function (m, n) { m.hidden = n >= shown; });
    if (after) after.hidden = true;
    if (btn) btn.addEventListener('click', function () {
      if (shown < msgs.length) { msgs[shown].hidden = false; shown++; }
      if (shown >= msgs.length) {
        btn.hidden = true;
        if (after) after.hidden = false;
      }
    });
  });

  /* ---------- Hub：五個角色地圖 ---------- */
  $all('[data-ae-map]').forEach(function (map) {
    var detail = map.querySelector('.ae-map__detail');
    var roles = $all('.ae-role', map);
    roles.forEach(function (r) {
      r.addEventListener('click', function () {
        roles.forEach(function (x) { x.setAttribute('aria-pressed', x === r ? 'true' : 'false'); });
        detail.innerHTML = '';
        var tpl = map.querySelector('#' + r.getAttribute('data-tpl'));
        if (tpl) detail.appendChild(tpl.content.cloneNode(true));
      });
    });
  });

  /* ---------- Hub：名詞小抄搜尋與篩選 ---------- */
  $all('[data-ae-gloss]').forEach(function (box) {
    var input = box.querySelector('.ae-gloss__search');
    var filters = $all('.ae-gloss__filter', box);
    var terms = $all('.ae-term', box);
    var count = box.querySelector('.ae-gloss__count');
    var active = 'all';
    function apply() {
      var q = (input.value || '').trim().toLowerCase();
      var shown = 0;
      terms.forEach(function (t) {
        var okFilter = active === 'all' || (active === 'star' ? t.hasAttribute('data-star') : t.getAttribute('data-chapter') === active);
        var okText = !q || t.textContent.toLowerCase().indexOf(q) >= 0;
        t.hidden = !(okFilter && okText);
        if (!t.hidden) shown++;
      });
      if (count) count.textContent = '顯示 ' + shown + ' 個名詞';
    }
    input.addEventListener('input', apply);
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        active = f.getAttribute('data-filter');
        filters.forEach(function (x) { x.setAttribute('aria-pressed', x === f ? 'true' : 'false'); });
        apply();
      });
    });
    apply();
  });

  /* ---------- Hub：自我檢核計分 ---------- */
  $all('[data-ae-check]').forEach(function (box) {
    var boxes = $all('input[type="checkbox"]', box);
    var out = box.querySelector('.ae-check__score');
    var key = 'check:' + box.getAttribute('data-ae-check');
    var saved = loadProgress()[key] || [];
    boxes.forEach(function (b, n) { b.checked = saved.indexOf(n) >= 0; });
    function paint() {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      var total = boxes.length;
      var msg = n >= 8 ? '觀念通了！' : (n >= 6 ? '差一點：回到沒勾的那幾題，重讀對應的章節。' : '先從「一張圖看懂」和各幕的「只記一句」重看起。');
      out.innerHTML = '';
      var s = document.createElement('strong');
      s.textContent = n + '／' + total + ' 題';
      out.appendChild(s);
      out.appendChild(document.createTextNode('　' + msg));
      var p = loadProgress();
      p[key] = boxes.map(function (b, k) { return b.checked ? k : -1; }).filter(function (k) { return k >= 0; });
      saveProgress(p);
    }
    boxes.forEach(function (b) { b.addEventListener('change', paint); });
    paint();
  });
})();
