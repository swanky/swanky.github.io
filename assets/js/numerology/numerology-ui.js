// numerology-ui.js — 生命靈數頁面入口（ES module）。
// 流程：輸入出生年月日 → computeNumerology → 生命靈數大字＋主題/優勢/課題/今日提醒＋生日數 → 付費 CTA。
// 沿用 iching-ui/tarot-ui 的防禦式 DOM 寫入。純前端、資料不上傳；不預測吉凶、不斷命定。
import { computeNumerology } from './numerology-core.js';
import { buildProfile } from './numerology-data-texts.js';
import { $, setHTML, setText, show, on, gtag, esc } from '../core/core-dom.js';
import { inquiryMailto } from '../core/core-funnel.js';

let last = null;

// 解析 <input type="date"> 的 YYYY-MM-DD（不經 Date 物件，避免時區位移）
function parseDateInput(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v || '').trim());
  if (!m) return null;
  const y = +m[1];
  const mo = +m[2];
  const d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, mo, d };
}

function doCompute() {
  show('num-error', false);
  const val = $('num-date') ? $('num-date').value : '';
  const dt = parseDateInput(val);
  if (!dt) {
    setText('num-error', '請選擇一個有效的出生日期。');
    show('num-error', true);
    return;
  }
  let result;
  try {
    result = computeNumerology(dt);
  } catch (e) {
    setText('num-error', '計算失敗，請確認日期後再試一次。');
    show('num-error', true);
    return;
  }
  last = { dt, result };
  render(result);
  gtag('event', 'numerology_compute', { life_path: result.lifePath });
  const res = $('num-result');
  if (res && res.scrollIntoView) res.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function render(result) {
  const p = buildProfile(result.lifePath, result.birthday);
  const masterTag = result.isMaster ? '<span class="num-master">主數</span>' : '';

  setHTML('num-badge', `<div class="num-circle">${result.lifePath}</div>`);
  setHTML('num-title', `生命靈數 <strong>${result.lifePath}</strong>・${esc(p.keyword)} ${masterTag}`);

  let body = `<div class="num-seg"><h4>主題</h4><p>${esc(p.theme)}</p></div>`;
  body += `<div class="num-seg"><h4>你的優勢</h4><p>${esc(p.strength)}</p></div>`;
  body += `<div class="num-seg is-challenge"><h4>你的課題</h4><p>${esc(p.challenge)}</p></div>`;
  body += `<div class="num-seg"><h4>今日提醒</h4><p>${esc(p.reminder)}</p></div>`;
  if (p.birthdayNote) body += `<div class="num-seg is-birthday"><h4>生日數</h4><p>${esc(p.birthdayNote)}</p></div>`;
  setHTML('num-reading', body);

  const subject = `深度數字報告：生命靈數 ${result.lifePath}`;
  const bodyMail = `嗨 史旺基，我的生命靈數是 ${result.lifePath}（${p.keyword}），生日數 ${result.birthday}。\n想要一份更完整的數字組合解讀（生命靈數＋生日數＋流年）。`;
  const cta = $('num-cta-link');
  if (cta) cta.href = inquiryMailto(subject, bodyMail);

  show('num-result', true);
}

function init() {
  on('num-compute', 'click', doCompute);
  on('num-cta-link', 'click', () => gtag('event', 'numerology_paid_inquiry'));
  show('num-result', false);
  show('num-error', false);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
