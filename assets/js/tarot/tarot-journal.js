// tarot-journal.js — 「我的塔羅 Journal」頁控制器（/tarot/journal/）。
// 讀取本機儲存的決策備忘錄，顯示列表、七日回顧狀態與統計，支援單則/全部匯出與刪除。
// 純前端、零後端、零帳號：資料只在使用者這台裝置的瀏覽器（見 tarot-journal-store.js schema）。
// 靜態站無法主動推播「七天到了」，故回顧採「使用者回站時被動提示」＋可下載 .ics 自我提醒。
import { getEntries, deleteEntry, clearAll, markReviewed, stats, exportJson } from './tarot-journal-store.js';
import { MEMO_FIELDS, memoToMarkdown, buildReviewIcs, downloadText } from './tarot-memo.js';
import { $, setHTML, show, on, gtag, esc } from '../core/core-dom.js';

function pad(n) { return String(n).padStart(2, '0'); }
function todayYmd() { const d = new Date(); return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`; }
function todayText() { const d = new Date(); return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`; }
function ymdOf(s) { return String(s || '').replace(/[^0-9]/g, ''); }
function daysBetween(fromYmd, toYmd) {
  const p = (y) => new Date(+y.slice(0, 4), +y.slice(4, 6) - 1, +y.slice(6, 8));
  if (fromYmd.length !== 8 || toYmd.length !== 8) return 0;
  return Math.round((p(toYmd) - p(fromYmd)) / 86400000);
}

// 把 store 的 entry 還原成 tarot-memo 認得的 {meta, sections}，以重用 Markdown／.ics 產生器。
function entryToMemo(e) {
  return {
    meta: { question: e.question, topicLabel: e.topicLabel, spreadName: e.spreadName, deckLabel: e.deckLabel, dateText: e.dateText, reviewDate: e.reviewDate, cards: e.cards },
    sections: e.sections || {},
  };
}
function entryMarkdown(e) {
  let md = memoToMarkdown(entryToMemo(e));
  if (e.review && e.review.done) {
    md += `\n## 七日回顧（${e.review.reviewedDate || ''}）\n**當時的假設成立嗎？**\n${e.review.q1 || '—'}\n\n**實際採取了什麼行動？**\n${e.review.q2 || '—'}\n\n**下次要保留或改變什麼？**\n${e.review.q3 || '—'}\n`;
  }
  return md;
}

function reviewStatus(e) {
  if (e.review && e.review.done) return { key: 'done', label: '已回顧' };
  const ymd = ymdOf(e.reviewDate);
  const today = todayYmd();
  if (ymd && ymd <= today) return { key: 'due', label: '可以回顧了' };
  const n = ymd ? daysBetween(today, ymd) : 0;
  return { key: 'pending', label: n > 0 ? `還有 ${n} 天回顧` : '預定回顧' };
}

function sectionsHtml(sections) {
  return MEMO_FIELDS.map((f) => {
    const v = (sections && sections[f.id] ? sections[f.id] : '').trim();
    return `<div class="tj-sec"><span class="tj-sec-label">${f.num} ${esc(f.label)}</span><p>${v ? esc(v).replace(/\n/g, '<br>') : '<i>（尚未填寫）</i>'}</p></div>`;
  }).join('');
}

function reviewBlock(e, status) {
  if (status.key === 'done') {
    const r = e.review;
    return `<div class="tj-review tj-review--done">
      <h4>七日回顧 · ${esc(r.reviewedDate || '')}</h4>
      <p><b>當時的假設成立嗎？</b><br>${esc(r.q1 || '—').replace(/\n/g, '<br>')}</p>
      <p><b>實際採取了什麼行動？</b><br>${esc(r.q2 || '—').replace(/\n/g, '<br>')}</p>
      <p><b>下次要保留或改變什麼？</b><br>${esc(r.q3 || '—').replace(/\n/g, '<br>')}</p>
    </div>`;
  }
  if (status.key === 'due') {
    const id = e.id;
    return `<div class="tj-review tj-review--due">
      <h4>七天到了，回顧一下當時的判斷</h4>
      <label>當時的假設成立嗎？<textarea id="tj-r1-${id}" rows="2"></textarea></label>
      <label>實際採取了什麼行動？<textarea id="tj-r2-${id}" rows="2"></textarea></label>
      <label>下次要保留或改變什麼？<textarea id="tj-r3-${id}" rows="2"></textarea></label>
      <button class="tj-btn tj-btn--primary" data-review="${id}">完成回顧</button>
    </div>`;
  }
  return `<p class="tj-review-pending">預定 <b>${esc(e.reviewDate || '')}</b> 回顧——七天後回來，檢查當時的假設是否成立。也可以把提醒加進你的行事曆。</p>`;
}

function entryHtml(e) {
  const status = reviewStatus(e);
  const cards = (e.cards || []).map((c) => `${c.slotLabel ? esc(c.slotLabel) + '・' : ''}${esc(c.name)}`).join('　·　');
  const meta = [e.topicLabel, e.spreadName, e.deckLabel].filter(Boolean).map(esc).join('　·　');
  return `<article class="tj-entry" data-id="${e.id}">
    <div class="tj-entry-head">
      <div class="tj-entry-headl">
        <span class="tj-entry-date">${esc(e.dateText || '')}</span>
        <span class="tj-badge tj-badge--${status.key}">${esc(status.label)}</span>
      </div>
      <button class="tj-del" data-del="${e.id}" aria-label="刪除這則">刪除</button>
    </div>
    <p class="tj-entry-q">${e.question ? esc(e.question) : '（當時沒有特別寫下問題）'}</p>
    ${meta ? `<p class="tj-entry-meta">${meta}</p>` : ''}
    ${cards ? `<p class="tj-entry-cards">${cards}</p>` : ''}
    <details class="tj-details"><summary>看五段反思</summary><div class="tj-secs">${sectionsHtml(e.sections)}</div></details>
    ${reviewBlock(e, status)}
    <div class="tj-entry-actions">
      <button class="tj-btn" data-md="${e.id}">存成文字檔</button>
      <button class="tj-btn" data-ics="${e.id}">加到行事曆提醒</button>
    </div>
  </article>`;
}

function renderStats() {
  const s = stats(todayYmd());
  setHTML('tj-stats', `
    <div class="tj-stat"><strong>${s.reflections}</strong><span>次反思</span></div>
    <div class="tj-stat"><strong>${s.reviews}</strong><span>次回顧</span></div>
    <div class="tj-stat"><strong>${s.due}</strong><span>則待回顧</span></div>`);
}

function render() {
  const entries = getEntries();
  renderStats();
  const hasAny = entries.length > 0;
  show('tj-empty', !hasAny);
  show('tj-list', hasAny);
  show('tj-global-actions', hasAny);
  if (hasAny) setHTML('tj-list', entries.map(entryHtml).join(''));
}

function findEntry(id) { return getEntries().find((e) => e.id === id); }

function onListClick(ev) {
  const t = ev.target.closest('button');
  if (!t) return;
  const md = t.getAttribute('data-md');
  const ics = t.getAttribute('data-ics');
  const del = t.getAttribute('data-del');
  const rev = t.getAttribute('data-review');
  if (md) {
    const e = findEntry(md); if (!e) return;
    downloadText(entryMarkdown(e), `tarot-memo-${ymdOf(e.dateText) || md}.md`, 'text/markdown');
    gtag('event', 'tarot_journal_export', { format: 'markdown' });
  } else if (ics) {
    const e = findEntry(ics); if (!e) return;
    downloadText(buildReviewIcs(entryToMemo(e), ymdOf(e.dateText) || ics), 'tarot-review-reminder.ics', 'text/calendar');
    gtag('event', 'tarot_journal_ics', {});
  } else if (del) {
    if (!window.confirm('確定刪除這一則反思？此動作無法復原。')) return;
    deleteEntry(del);
    render();
    gtag('event', 'tarot_journal_delete', {});
  } else if (rev) {
    const g = (n) => { const el = $('tj-r' + n + '-' + rev); return el ? el.value.trim() : ''; };
    markReviewed(rev, { reviewedDate: todayText(), q1: g(1), q2: g(2), q3: g(3) });
    render();
    gtag('event', 'tarot_journal_review', {});
  }
}

function doExportAll() {
  downloadText(exportJson(), 'tarot-journal-export.json', 'application/json');
  gtag('event', 'tarot_journal_export', { format: 'json' });
}
function doClearAll() {
  if (!window.confirm('確定刪除「全部」塔羅反思紀錄？此動作無法復原，且不會保留備份。')) return;
  clearAll();
  render();
  gtag('event', 'tarot_journal_clear', {});
}

function init() {
  render();
  on('tj-list', 'click', onListClick);
  on('tj-export-all', 'click', doExportAll);
  on('tj-clear-all', 'click', doClearAll);
  gtag('event', 'tarot_journal_view', {});
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
