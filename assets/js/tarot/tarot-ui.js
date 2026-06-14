// tarot-ui.js — 塔羅頁面入口（ES module）。
// 流程：輸入問題 → 建議主題＋牌陣 → 抽牌（密碼學洗牌）→ 翻牌 → 依主題的四段反思 → 串接付費引導。
// 多領域：同一張牌，依主題（職場／感情／生活／財務）給不同視角，但都是反思、不占卜。
// 沿用 hd-ui.js 的防呆 DOM 寫入：容器不存在就略過、不拋錯（部署期「新 JS × 舊快取 HTML」也不會整頁掛掉）。
import { drawSpread } from './tarot-draw.js';
import { SPREADS, SPREAD_KEYS, recommendSpread, TOPICS, TOPIC_KEYS, recommendTopic } from './tarot-spreads.js';
import { CARDS } from './tarot-deck.js';
import { READINGS } from './tarot-data-texts.js';
import { faceSvg, backSvg } from './tarot-card-svg.js';
import { exportReadingPng } from './tarot-export-svg.js';

const $ = (id) => document.getElementById(id);
const setHTML = (id, html) => { const e = $(id); if (e) e.innerHTML = html; };
const setText = (id, txt) => { const e = $(id); if (e) e.textContent = txt; };
const show = (id, on) => { const e = $(id); if (e) e.style.display = on ? '' : 'none'; };
const on = (id, ev, fn) => { const e = $(id); if (e) e.addEventListener(ev, fn); };
const gtag = (...a) => { if (window.gtag) window.gtag(...a); };
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const state = { spread: 'single', spreadManual: false, topic: 'life', topicManual: false, allowReversed: true, draw: null, question: '', revealTimers: [] };

function dateText() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())}`;
}

// ---- 主題選擇 ----
function renderTopicOptions() {
  const wrap = $('tarot-topic-options');
  if (!wrap) return;
  wrap.innerHTML = TOPIC_KEYS.map((k) => {
    const t = TOPICS[k];
    const active = k === state.topic ? ' is-active' : '';
    return `<button type="button" class="tarot-topic-btn${active}" data-topic="${k}">
      <span class="tarot-topic-label">${esc(t.label)}</span>
      <span class="tarot-topic-hint">${esc(t.hint)}</span>
    </button>`;
  }).join('');
  wrap.querySelectorAll('.tarot-topic-btn').forEach((b) => {
    b.addEventListener('click', () => selectTopic(b.getAttribute('data-topic'), true));
  });
}
function selectTopic(key, manual) {
  if (!TOPICS[key]) return;
  state.topic = key;
  if (manual) state.topicManual = true;
  const wrap = $('tarot-topic-options');
  if (wrap) wrap.querySelectorAll('.tarot-topic-btn').forEach((b) => {
    b.classList.toggle('is-active', b.getAttribute('data-topic') === key);
  });
}

// ---- 牌陣選擇 ----
function renderSpreadOptions() {
  const wrap = $('tarot-spread-options');
  if (!wrap) return;
  wrap.innerHTML = SPREAD_KEYS.map((k) => {
    const s = SPREADS[k];
    const active = k === state.spread ? ' is-active' : '';
    return `<button type="button" class="tarot-spread-btn${active}" data-spread="${k}">
      <span class="tarot-spread-name">${esc(s.nameZh)}</span>
      <span class="tarot-spread-count">${s.count} 張</span>
      <span class="tarot-spread-blurb">${esc(s.blurb)}</span>
    </button>`;
  }).join('');
  wrap.querySelectorAll('.tarot-spread-btn').forEach((b) => {
    b.addEventListener('click', () => selectSpread(b.getAttribute('data-spread'), true));
  });
}
function selectSpread(key, manual) {
  if (!SPREADS[key]) return;
  state.spread = key;
  if (manual) state.spreadManual = true;
  const wrap = $('tarot-spread-options');
  if (wrap) wrap.querySelectorAll('.tarot-spread-btn').forEach((b) => {
    b.classList.toggle('is-active', b.getAttribute('data-spread') === key);
  });
}

function updateReco() {
  const q = ($('tarot-question') ? $('tarot-question').value : '') || '';
  state.question = q.trim();
  if (!state.topicManual) selectTopic(recommendTopic(q), false);
  const rec = recommendSpread(q);
  setHTML('tarot-reco', `<i class="bi bi-stars"></i> 建議：<b>${esc(TOPICS[state.topic].label)}</b>　·　<b>${esc(SPREADS[rec.key].nameZh)}</b>　<span class="tarot-reco-why">${esc(rec.reason)}</span>`);
  if (!state.spreadManual) selectSpread(rec.key, false);
}

// ---- 抽牌與翻牌 ----
function doDraw() {
  state.question = ($('tarot-question') ? $('tarot-question').value : '').trim();
  const allow = $('tarot-allow-reversed') ? $('tarot-allow-reversed').checked : true;
  state.allowReversed = allow;
  try {
    state.draw = drawSpread(state.spread, { allowReversed: allow });
  } catch (e) {
    setText('tarot-error', '抽牌時發生問題，請重新整理頁面再試一次。');
    show('tarot-error', true);
    return;
  }
  show('tarot-error', false);
  gtag('event', 'tarot_draw', { spread: state.spread, topic: state.topic, reversed: allow });

  const topicLabel = TOPICS[state.topic].label;
  const qEcho = state.question
    ? `你問的是：<b>${esc(state.question)}</b>`
    : `你沒有特別問什麼——那就讓這張牌，照見你此刻最該被看見的。`;
  setHTML('tarot-question-echo', `<span class="tarot-q-spread">${esc(topicLabel)}</span><span class="tarot-q-spread">${esc(SPREADS[state.spread].nameZh)}</span> ${qEcho}`);

  const n = state.draw.length;
  setHTML('tarot-cards', state.draw.map((d, i) => {
    const card = CARDS[d.cardId];
    return `<div class="tarot-card-slot">
      <div class="tarot-card-pos">${esc(d.slotLabel)}</div>
      <div class="tarot-card" data-i="${i}" tabindex="0" role="button" aria-label="第 ${i + 1} 張・${esc(d.slotLabel)}，點擊翻牌">
        <div class="tarot-card-inner">
          <div class="tarot-card-back">${backSvg()}</div>
          <div class="tarot-card-face">${faceSvg(card, d.reversed)}</div>
        </div>
      </div>
    </div>`;
  }).join(''));

  setHTML('tarot-readings', '');
  show('tarot-actions', false);
  setHTML('tarot-funnel', '');
  show('tarot-result', true);

  const cardEls = $('tarot-cards') ? Array.from($('tarot-cards').querySelectorAll('.tarot-card')) : [];
  cardEls.forEach((el) => {
    const flip = () => el.classList.add('is-flipped');
    el.addEventListener('click', flip);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  });

  const res = $('tarot-result');
  if (res && res.scrollIntoView) res.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });

  state.revealTimers.forEach((t) => clearTimeout(t));
  state.revealTimers = [];
  if (REDUCED) {
    cardEls.forEach((el) => el.classList.add('is-flipped'));
    renderReadings();
  } else {
    cardEls.forEach((el, i) => {
      state.revealTimers.push(setTimeout(() => el.classList.add('is-flipped'), 450 + i * 420));
    });
    state.revealTimers.push(setTimeout(renderReadings, 450 + n * 420 + 350));
  }
}

function domainOf(reading) {
  if (!reading || !reading.domains) return null;
  return reading.domains[state.topic] || reading.domains.work || null;
}

function renderReadings() {
  if (!state.draw) return;
  const topicLabel = TOPICS[state.topic].label;
  const blocks = state.draw.map((d) => {
    const card = CARDS[d.cardId];
    const r = READINGS[d.cardId];
    const dom = domainOf(r);
    const nameLine = `${esc(card.nameZh)}${d.reversed ? '（逆位）' : ''} <span class="tarot-r-en">${esc(card.nameEn)}</span>`;
    if (!r || !dom) {
      return `<div class="tarot-reading">
        <div class="tarot-reading-head"><span class="tarot-reading-pos">${esc(d.slotLabel)}</span>
        <span class="tarot-reading-card">${nameLine}</span></div>
        <p class="tarot-reading-symbol">${esc(r && r.symbol ? r.symbol : '這張牌的詳細解讀正在補上。先記下你抽到它的當下，心裡浮現的第一個念頭。')}</p>
      </div>`;
    }
    const reflectHtml = Array.isArray(dom.reflect) && dom.reflect.length
      ? `<div class="tarot-reading-reflect"><h5>可以問自己的</h5><ul>${dom.reflect.map((q) => `<li>「${esc(q)}」</li>`).join('')}</ul></div>` : '';
    const reversedHtml = d.reversed && r.reversed
      ? `<p class="tarot-reading-reversed"><b>這次是逆位——換個角度看：</b>${esc(r.reversed)}</p>` : '';
    return `<div class="tarot-reading">
      <div class="tarot-reading-head">
        <span class="tarot-reading-pos">${esc(d.slotLabel)}</span>
        <span class="tarot-reading-card">${nameLine}</span>
      </div>
      <p class="tarot-reading-frame">${esc(d.frame)} <b>${esc(card.nameZh)}</b>。</p>
      <p class="tarot-reading-symbol">${esc(r.symbol)}</p>
      <div class="tarot-reading-work"><h5>從「${esc(topicLabel)}」來看你的處境</h5><p>${esc(dom.connect)}</p></div>
      ${reversedHtml}
      ${reflectHtml}
      <p class="tarot-reading-action"><b>這週可以做的一步　</b>${esc(dom.action)}</p>
    </div>`;
  });
  setHTML('tarot-readings', blocks.join(''));
  show('tarot-actions', true);
  renderFunnel();
  gtag('event', 'tarot_reading_shown', { spread: state.spread, topic: state.topic });
}

// ---- 串接付費引導：mailto 預填本次主題、問題與抽到的牌 ----
function renderFunnel() {
  if (!state.draw) return;
  const topicLabel = TOPICS[state.topic].label;
  const spreadName = SPREADS[state.spread].nameZh;
  const cardsLines = state.draw.map((d) => `・${d.slotLabel}：${CARDS[d.cardId].nameZh}${d.reversed ? '（逆位）' : ''}`).join('\n');
  const body = `嗨 史旺基，我在線上抽了一次塔羅，想針對這個結果，做一次更深入的反思引導。\n\n主題：${topicLabel}\n我問的是：${state.question || '（當時沒有特別寫下問題）'}\n牌陣：${spreadName}\n${cardsLines}\n\n我想預約（擇一）：\n□ 客製文字解讀（非同步，email 交付）\n□ 1:1 線上引導（名額有限）\n方便的時段或聯絡方式：\n\n（我了解這是反思引導，不是占卜、不預測具體結果。）`;
  const href = `mailto:swanky.hsiao@gmail.com?subject=${encodeURIComponent('塔羅・反思引導預約')}&body=${encodeURIComponent(body)}`;
  setHTML('tarot-funnel',
    `<div class="tarot-funnel-card">
      <h4>想把這次的牌，聊得更深一點？</h4>
      <p>線上抽牌給你的是一面快速的鏡子。若你想針對「${esc(state.question || '你正在面對的處境')}」，由一位帶過團隊、習慣陪人把事情想清楚的人陪你跑完整套反思——把牌面翻成你能用的下一步——可以來信，我會帶著你這次抽到的牌一起談。</p>
      <a class="tarot-funnel-cta" id="tarot-cta-guide" href="${href}">把這次的牌帶去做一次引導 →</a>
      <p class="tarot-funnel-mini">已自動把你的主題、問題與抽到的牌填進信件，送出前可自行增刪。</p>
    </div>`);
  on('tarot-cta-guide', 'click', () => gtag('event', 'tarot_funnel_click', { spread: state.spread, topic: state.topic }));
}

// ---- 動作 ----
function doDownload() {
  if (!state.draw) return;
  exportReadingPng(state.draw, {
    question: state.question,
    spreadName: TOPICS[state.topic].label + '・' + SPREADS[state.spread].nameZh,
    dateText: dateText(),
  }, {
    filename: `tarot-${state.topic}-${state.spread}-${dateText().replace(/\//g, '')}.png`,
    onError: () => { setText('tarot-error', '圖卡產生失敗，請改用瀏覽器截圖。'); show('tarot-error', true); },
  });
  gtag('event', 'tarot_download', { spread: state.spread, topic: state.topic });
}

function doAgain() { doDraw(); }

// ---- 初始化 ----
function init() {
  renderTopicOptions();
  renderSpreadOptions();
  updateReco();
  on('tarot-question', 'input', updateReco);
  on('tarot-draw', 'click', doDraw);
  on('tarot-download', 'click', doDownload);
  on('tarot-again', 'click', doAgain);
  show('tarot-result', false);
  show('tarot-actions', false);
  show('tarot-error', false);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
