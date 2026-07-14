// tarot-ui.js — 塔羅頁面入口（ES module）。
// 流程：輸入問題 → 建議主題＋牌陣 → 抽牌（密碼學洗牌）→ 翻牌 → 依主題的四段反思 → 串接付費引導。
// 多領域：同一張牌，依主題（職場／感情／生活／財務）給不同視角，但都是反思、不占卜。
// 沿用 hd-ui.js 的防呆 DOM 寫入：容器不存在就略過、不拋錯（部署期「新 JS × 舊快取 HTML」也不會整頁掛掉）。
import { drawSpread } from './tarot-draw.js';
import { SPREADS, SPREAD_KEYS, recommendSpread, TOPICS, TOPIC_KEYS, recommendTopic } from './tarot-spreads.js';
import { CARDS } from './tarot-deck.js';
import { READINGS } from './tarot-data-texts.js';
import { faceSvg, backSvg, DECKS, DECK_KEYS } from './tarot-card-image.js';
import { exportReadingPng } from './tarot-export-svg.js';
import { createOverlay } from './tarot-overlay.js';
import { $, setHTML, setText, show, on, gtag, esc } from '../core/core-dom.js';
import { inquiryMailto } from '../core/core-funnel.js';
import { buildMemo, memoFormHtml, readMemo, downloadMemoMarkdown, exportMemoPng, downloadReviewIcs } from './tarot-memo.js';
import { addEntry } from './tarot-journal-store.js';

const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const state = { spread: 'single', spreadManual: false, topic: 'life', topicManual: false, allowReversed: true, deck: 'uniform', draw: null, question: '', revealTimers: [], revealed: false, memo: null, modalIdx: null };

function dateText() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())}`;
}

// 七日後的回顧日期（給 Decision Memo 與 .ics 提醒）。
function reviewDateText() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())}`;
}
function deckLabel() { return DECKS[state.deck] ? DECKS[state.deck].labelZh : ''; }

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

// ---- 牌組選擇（Uniform 制服女孩 / CloneX Cyber Tarot）----
function renderDeckOptions() {
  const wrap = $('tarot-deck-options');
  if (!wrap) return;
  wrap.innerHTML = DECK_KEYS.map((k) => {
    const d = DECKS[k];
    const active = k === state.deck ? ' is-active' : '';
    return `<button type="button" class="tarot-deck-btn${active}" data-deck="${k}">
      <span class="tarot-deck-name">${esc(d.labelZh)}</span>
      <span class="tarot-deck-sub">${esc(d.label)}</span>
    </button>`;
  }).join('');
  wrap.querySelectorAll('.tarot-deck-btn').forEach((b) => {
    b.addEventListener('click', () => selectDeck(b.getAttribute('data-deck')));
  });
}
function selectDeck(key) {
  if (!DECKS[key]) return;
  state.deck = key;
  const wrap = $('tarot-deck-options');
  if (wrap) wrap.querySelectorAll('.tarot-deck-btn').forEach((b) => {
    b.classList.toggle('is-active', b.getAttribute('data-deck') === key);
  });
  applyDeckToFaces();
  gtag('event', 'tarot_deck_select', { deck: key });
}
// 換牌組時，就地替換已翻開的牌面（含放大 modal 的大圖），毋須重抽。
function applyDeckToFaces() {
  if (!state.draw) return;
  const cardEls = $('tarot-cards') ? Array.from($('tarot-cards').querySelectorAll('.tarot-card')) : [];
  cardEls.forEach((el, i) => {
    const d = state.draw[i];
    const card = d && CARDS[d.cardId];
    const face = el.querySelector('.tarot-card-face');
    if (face && card) face.innerHTML = faceSvg(card, d.reversed, null, state.deck);
  });
  const art = document.querySelector('#tarot-card-modal .tarot-modal-art');
  if (art && state.modalIdx != null) {
    const d = state.draw[state.modalIdx];
    const card = d && CARDS[d.cardId];
    if (card) art.innerHTML = faceSvg(card, d.reversed, null, state.deck);
  }
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
  closeCardModal(); // 重抽前先收掉可能還開著的放大 modal（含還原 body 捲動、背景 inert、焦點）
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
      <div class="tarot-card" data-i="${i}" tabindex="0" role="button" aria-label="第 ${i + 1} 張・${esc(d.slotLabel)}，點擊看大圖與解讀">
        <div class="tarot-card-inner">
          <div class="tarot-card-back">${backSvg()}</div>
          <div class="tarot-card-face">${faceSvg(card, d.reversed, null, state.deck)}</div>
        </div>
      </div>
    </div>`;
  }).join(''));

  setHTML('tarot-readings', '');
  show('tarot-actions', false);
  setHTML('tarot-funnel', '');
  // 重抽：清掉上一輪的決策備忘錄
  state.memo = null;
  setHTML('tarot-memo-form', '');
  setHTML('tarot-memo-saved', '');
  show('tarot-memo', false);
  show('tarot-result', true);

  const cardEls = $('tarot-cards') ? Array.from($('tarot-cards').querySelectorAll('.tarot-card')) : [];
  cardEls.forEach((el) => {
    const openModal = () => {
      const idx = Number(el.getAttribute('data-i'));
      if (!state.revealed) revealAllNow(); // 翻牌動畫途中就點：先快轉揭示並補上下方解讀，再開這張的大圖（避免 modal 有解讀但下方還空白）
      openCardModal(idx, el);
    };
    el.addEventListener('click', openModal);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); } });
  });

  const res = $('tarot-result');
  if (res && res.scrollIntoView) res.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });

  state.revealTimers.forEach((t) => clearTimeout(t));
  state.revealTimers = [];
  state.revealed = false;
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

// 單張牌的四段解讀（不含外層 .tarot-reading 容器）——下方解讀流與卡片放大 modal 共用，確保兩處一致。
function cardReadingInner(d) {
  const card = CARDS[d.cardId];
  const r = READINGS[d.cardId];
  const dom = domainOf(r);
  const topicLabel = TOPICS[state.topic].label;
  const nameLine = `${esc(card.nameZh)}${d.reversed ? '（逆位）' : ''} <span class="tarot-r-en">${esc(card.nameEn)}</span>`;
  const head = `<div class="tarot-reading-head">
        <span class="tarot-reading-pos">${esc(d.slotLabel)}</span>
        <span class="tarot-reading-card">${nameLine}</span>
      </div>`;
  if (!r || !dom) {
    return `${head}
      <p class="tarot-reading-symbol">${esc(r && r.symbol ? r.symbol : '這張牌的詳細解讀正在補上。先記下你抽到它的當下，心裡浮現的第一個念頭。')}</p>`;
  }
  const reflectHtml = Array.isArray(dom.reflect) && dom.reflect.length
    ? `<div class="tarot-reading-reflect"><h5>可以問自己的</h5><ul>${dom.reflect.map((q) => `<li>「${esc(q)}」</li>`).join('')}</ul></div>` : '';
  const reversedHtml = d.reversed && r.reversed
    ? `<p class="tarot-reading-reversed"><b>這次是逆位——換個角度看：</b>${esc(r.reversed)}</p>` : '';
  return `${head}
      <p class="tarot-reading-frame">${esc(d.frame)} <b>${esc(card.nameZh)}</b>。</p>
      <p class="tarot-reading-symbol">${esc(r.symbol)}</p>
      <div class="tarot-reading-work"><h5>從「${esc(topicLabel)}」來看你的處境</h5><p>${esc(dom.connect)}</p></div>
      ${reversedHtml}
      ${reflectHtml}
      <p class="tarot-reading-action"><b>這週可以做的一步　</b>${esc(dom.action)}</p>`;
}

function renderReadings() {
  if (!state.draw) return;
  const blocks = state.draw.map((d) => `<div class="tarot-reading">${cardReadingInner(d)}</div>`);
  setHTML('tarot-readings', blocks.join(''));
  show('tarot-actions', true);
  renderFunnel();
  state.revealed = true;
  gtag('event', 'tarot_reading_shown', { spread: state.spread, topic: state.topic });
}

// 翻牌動畫途中使用者就想看牌：清掉剩餘的揭示計時器、立刻把所有牌翻開並渲染解讀。
function revealAllNow() {
  state.revealTimers.forEach((t) => clearTimeout(t));
  state.revealTimers = [];
  const cardEls = $('tarot-cards') ? $('tarot-cards').querySelectorAll('.tarot-card') : [];
  cardEls.forEach((el) => el.classList.add('is-flipped'));
  renderReadings();
}

// ---- 卡片放大 modal：大圖 ＋ 這張牌的完整解讀。外殼（Esc／點背景關閉、鎖捲動、背景 inert、還原焦點）走共用的 tarot-overlay。----
const cardModal = createOverlay({
  id: 'tarot-card-modal',
  className: 'tarot-modal',
  closeSelector: '.tarot-modal-close',
  innerHTML: `<div class="tarot-modal-card" role="dialog" aria-modal="true" aria-label="塔羅牌詳解">
      <button class="tarot-modal-close" type="button" aria-label="關閉">×</button>
      <div class="tarot-modal-grid">
        <div class="tarot-modal-art"></div>
        <div class="tarot-modal-info"></div>
      </div>
    </div>`,
});
function closeCardModal() { state.modalIdx = null; cardModal.close(); }
// trigger＝被點的卡片元素，關閉後焦點還原回它（用 document.activeElement 在 Safari 滑鼠點 div 時會落在 <body>）。
function openCardModal(i, trigger) {
  const d = state.draw && state.draw[i];
  if (!d) return;
  const card = CARDS[d.cardId];
  if (!card) return;
  const ov = cardModal.ensure();
  state.modalIdx = i;
  ov.querySelector('.tarot-modal-art').innerHTML = faceSvg(card, d.reversed, null, state.deck);
  ov.querySelector('.tarot-modal-info').innerHTML = cardReadingInner(d);
  cardModal.open(trigger);
  // 捲動歸零必須在 is-open（display:flex）之後——元素要有 layout box，設 scrollTop 才生效；
  // 桌機的捲動容器是 .tarot-modal-info，手機（≤640px）是 .tarot-modal-grid，兩者都歸零。
  ov.querySelector('.tarot-modal-grid').scrollTop = 0;
  ov.querySelector('.tarot-modal-info').scrollTop = 0;
  ov.querySelector('.tarot-modal-close').focus();
  gtag('event', 'tarot_card_zoom', { spread: state.spread, topic: state.topic, card: card.id });
}

// ---- 串接付費引導：mailto 預填本次主題、問題與抽到的牌 ----
function renderFunnel() {
  if (!state.draw) return;
  const topicLabel = TOPICS[state.topic].label;
  const spreadName = SPREADS[state.spread].nameZh;
  const cardsLines = state.draw.map((d) => `・${d.slotLabel}：${CARDS[d.cardId].nameZh}${d.reversed ? '（逆位）' : ''}`).join('\n');
  const body = `嗨 史旺基，我在線上抽了一次塔羅，想針對這個結果，做一次更深入的反思引導。\n\n主題：${topicLabel}\n我問的是：${state.question || '（當時沒有特別寫下問題）'}\n牌陣：${spreadName}\n${cardsLines}\n\n我想預約（擇一）：\n□ 客製文字解讀（NT$680 早鳥，非同步，email 交付）\n□ 1:1 線上引導（NT$2,400 / 60 分鐘，名額有限）\n方便的時段或聯絡方式：\n\n（我了解這是反思引導，不是占卜、不預測具體結果。）`;
  const href = inquiryMailto('塔羅・反思引導預約', body);
  setHTML('tarot-funnel',
    `<div class="tarot-funnel-card">
      <h4>想把這次的牌，聊得更深一點？</h4>
      <p>線上抽牌給你的是一面快速的鏡子。若你想針對「${esc(state.question || '你正在面對的處境')}」，由一位帶過團隊、習慣陪人把事情想清楚的人陪你跑完整套反思——把牌面翻成你能用的下一步——可以來信，我會帶著你這次抽到的牌一起談。</p>
      <div class="tarot-funnel-actions">
        <a class="tarot-funnel-cta" id="tarot-cta-guide" href="${href}">把這次的牌帶去做一次引導 →</a>
        <a class="tarot-funnel-plans" href="#tarot-plans">查看引導方案與定價 ↓</a>
      </div>
      <p class="tarot-funnel-mini">已自動把你的主題、問題與抽到的牌填進信件，送出前可自行增刪。</p>
    </div>`);
  on('tarot-cta-guide', 'click', () => gtag('event', 'tarot_funnel_click', { spread: state.spread, topic: state.topic }));
}

// ---- 動作 ----
function doDownload() {
  if (!state.draw) return;
  // 隱私：分享圖卡預設「不」印上使用者的問題，需主動勾選才包含（roadmap §5.5）。
  const includeQ = $('tarot-include-question') ? $('tarot-include-question').checked : false;
  exportReadingPng(state.draw, {
    question: includeQ ? state.question : '',
    spreadName: TOPICS[state.topic].label + '・' + SPREADS[state.spread].nameZh,
    dateText: dateText(),
    deck: state.deck,
  }, {
    filename: `tarot-${state.topic}-${state.spread}-${dateText().replace(/\//g, '')}.png`,
    onError: () => { setText('tarot-error', '圖卡產生失敗，請改用瀏覽器截圖。'); show('tarot-error', true); },
  }).catch(() => {});
  gtag('event', 'tarot_download', { spread: state.spread, topic: state.topic, with_question: includeQ });
}

function doAgain() { doDraw(); }

// ---- Decision Memo：把這次抽牌整理成五段結構化反思，可編輯、可匯出、可存本機 Journal ----
function doGenerateMemo() {
  if (!state.draw) return;
  state.memo = buildMemo({
    question: state.question, draw: state.draw, topic: state.topic, spread: state.spread,
    dateText: dateText(), reviewDate: reviewDateText(), deckLabel: deckLabel(),
  });
  setHTML('tarot-memo-form', memoFormHtml(state.memo));
  setHTML('tarot-memo-saved', '');
  show('tarot-memo', true);
  const el = $('tarot-memo');
  if (el && el.scrollIntoView) el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  gtag('event', 'tarot_memo_generate', { spread: state.spread, topic: state.topic });
}
// 讀回使用者當下編輯的內容（每次匯出／儲存都重讀，確保與畫面一致）。
function currentMemo() { return state.memo ? readMemo(state.memo) : null; }
function memoFilename(ext) { return `tarot-memo-${state.topic}-${dateText().replace(/\//g, '')}.${ext}`; }
function doMemoMarkdown() {
  const m = currentMemo(); if (!m) return;
  downloadMemoMarkdown(m, memoFilename('md'));
  gtag('event', 'tarot_memo_export', { format: 'markdown' });
}
function doMemoPng() {
  const m = currentMemo(); if (!m) return;
  exportMemoPng(m, {
    filename: memoFilename('png'),
    onError: () => { setText('tarot-error', '備忘錄圖片產生失敗，請改用 Markdown 匯出或截圖。'); show('tarot-error', true); },
  });
  gtag('event', 'tarot_memo_export', { format: 'png' });
}
function doMemoIcs() {
  const m = currentMemo(); if (!m) return;
  downloadReviewIcs(m, dateText().replace(/\//g, ''), 'tarot-review-reminder.ics');
  gtag('event', 'tarot_memo_ics', {});
}
function doMemoSave() {
  const m = currentMemo(); if (!m) return;
  const entry = addEntry(m);
  setHTML('tarot-memo-saved', entry
    ? '✓ 已存到本機 Journal（只存在這台裝置的瀏覽器，不上傳）。<a href="/tarot/journal/">開啟我的塔羅 Journal →</a>'
    : '無法存到本機（瀏覽器可能停用了儲存）。你仍可用上面的 Markdown／PNG 匯出保存。');
  gtag('event', 'tarot_memo_save', { spread: state.spread, topic: state.topic });
}

// ---- 初始化 ----
function init() {
  renderTopicOptions();
  renderSpreadOptions();
  renderDeckOptions();
  updateReco();
  on('tarot-question', 'input', updateReco);
  on('tarot-draw', 'click', doDraw);
  on('tarot-download', 'click', doDownload);
  on('tarot-again', 'click', doAgain);
  on('tarot-memo-generate', 'click', doGenerateMemo);
  on('tarot-memo-md', 'click', doMemoMarkdown);
  on('tarot-memo-png', 'click', doMemoPng);
  on('tarot-memo-ics', 'click', doMemoIcs);
  on('tarot-memo-save', 'click', doMemoSave);
  show('tarot-result', false);
  show('tarot-actions', false);
  show('tarot-memo', false);
  show('tarot-error', false);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
