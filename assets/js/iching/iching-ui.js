// iching-ui.js — 易經問卦頁面入口（ES module）。
// 流程：輸入問題 →（recommendTopic 主題判定）→ 選起卦方式（銅錢/數字/時間）→ 起卦
//       → 卦象圖 + 本卦/之卦 + 四段解讀（象徵/處境/反思/行動）→ 付費 CTA（深度解卦 mailto）。
// 沿用 tarot-ui/astro-ui 防禦式 DOM 寫入。不占卜吉凶、不預測運勢——把問題換個角度看。
import { castCoins, castNumbers, castTime } from './iching-cast.js';
import { buildReading } from './iching-data-texts.js';
import { buildHexSvg } from './iching-svg.js';
import { recommendTopic, TOPICS } from '../tarot/tarot-spreads.js';
import { $, setHTML, setText, show, on, gtag, esc } from '../core/core-dom.js';

const MAIL = 'swanky.hsiao@gmail.com';

let lastCast = null;

function topicLabel(q) {
  if (!q || !q.trim()) return '';
  try {
    const k = recommendTopic(q);
    const t = TOPICS && TOPICS[k];
    return t ? (t.label || t.name || '') : '';
  } catch (e) { return ''; }
}

function updateMethodRows() {
  const m = $('iching-method') ? $('iching-method').value : 'coins';
  show('iching-num-row', m === 'numbers');
}

function doCast() {
  show('iching-error', false);
  const method = $('iching-method') ? $('iching-method').value : 'coins';
  let cast;
  try {
    if (method === 'numbers') {
      const n1 = parseInt($('iching-n1').value, 10);
      const n2 = parseInt($('iching-n2').value, 10);
      if (!Number.isInteger(n1) || !Number.isInteger(n2) || n1 < 1 || n2 < 1) {
        setText('iching-error', '請輸入兩個正整數（例如今天想到的兩個數字）。');
        show('iching-error', true);
        return;
      }
      cast = castNumbers(n1, n2);
    } else if (method === 'time') {
      const now = new Date();
      cast = castTime(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours());
    } else {
      cast = castCoins();
    }
  } catch (e) {
    setText('iching-error', '起卦失敗，請再試一次。');
    show('iching-error', true);
    return;
  }
  lastCast = cast;
  render(cast, method);
  gtag('event', 'iching_cast', { method });
  const res = $('iching-result');
  if (res && res.scrollIntoView) res.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function render(cast, method) {
  const r = buildReading(cast);
  const mc = cast.moving.length;
  const methodZh = { coins: '銅錢起卦', numbers: '數字起卦（梅花）', time: '時間起卦（梅花）' }[method] || '';

  setHTML('iching-heximg', buildHexSvg(cast));

  let head = `<span class="iching-benname">${esc(cast.ben.name)}卦</span>`;
  if (cast.zhi && mc) head += ` <span class="iching-arrow">→</span> <span class="iching-zhiname">${esc(cast.zhi.name)}卦</span>`;
  head += ` <span class="iching-method-tag">${esc(methodZh)}</span>`;
  setHTML('iching-hexname', head);

  let body = `<div class="iching-seg"><h4>象徵</h4><p>${esc(r.symbol)}</p></div>`;
  body += `<div class="iching-seg"><h4>處境連結</h4><p>${esc(r.situation)}</p></div>`;
  if (r.change) body += `<div class="iching-seg is-change"><h4>變化方向</h4><p>${esc(r.change)}</p></div>`;
  body += `<div class="iching-seg"><h4>給你的反思</h4><ul>${r.reflect.map((q) => `<li>${esc(q)}</li>`).join('')}</ul></div>`;
  body += `<div class="iching-seg"><h4>這一週可以試試</h4><p>${esc(r.action)}</p></div>`;
  setHTML('iching-reading', body);

  const q = $('iching-question') ? $('iching-question').value.trim() : '';
  const changed = cast.zhi && mc ? `（之卦：${cast.ben.name}→${cast.zhi.name}）` : '';
  const subject = `深度解卦：${cast.ben.name}卦${changed}`;
  const bodyMail = `嗨 史旺基，我用易經問卦抽到「${cast.ben.name}卦」${changed}。\n我的問題是：${q || '（想深入聊聊）'}\n想要一份深度解卦（爻辭與行動建議）。`;
  const cta = $('iching-cta-link');
  if (cta) cta.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyMail)}`;

  show('iching-result', true);
}

function init() {
  on('iching-method', 'change', updateMethodRows);
  on('iching-cast', 'click', doCast);
  on('iching-question', 'input', () => {
    const lbl = topicLabel($('iching-question').value);
    setText('iching-topic', lbl ? `這看起來像是關於「${lbl}」的問題` : '');
    show('iching-topic', !!lbl);
  });
  on('iching-cta-link', 'click', () => gtag('event', 'iching_paid_inquiry'));
  updateMethodRows();
  show('iching-result', false);
  show('iching-error', false);
  show('iching-topic', false);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
