// tarot-memo.js — Tarot Decision Memo｜塔羅決策備忘錄。
// 把一次抽牌重構成「五段結構化反思」，並產生可編輯、可匯出（Markdown／PNG）、可存進本機 Journal 的備忘錄。
// 誠實邊界：工具只提供「結構」與「由牌面推導的提示」，真正的假設、可控性與實驗由使用者自己填寫——
// 不是占卜、不預測結果，而是把模糊處境整理成可驗證的行動假設（見 docs/tarot-section-differentiation-roadmap.md §3.2）。
import { CARDS } from './tarot-deck.js';
import { READINGS } from './tarot-data-texts.js';
import { SPREADS, TOPICS } from './tarot-spreads.js';
import { downloadPngFromSvg } from '../core/core-export.js';

const GOLD = '#E5A300';
const GOLD_DK = '#b6820a';
const INK = '#2c2a26';
const MUTED = '#6b6457';
// 字型名用單引號（嚴格 XML 匯出 PNG 時，style 屬性用雙引號，內層字型名不可用雙引號）。
const FONT = "'Noto Sans TC','Microsoft JhengHei','PingFang TC','Heiti TC',sans-serif";
const W = 820;

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 五段的欄位 id（表單 textarea）＋標題＋引導語。single source of truth。
export const MEMO_FIELDS = [
  { id: 'facing', num: '①', label: '你正在面對什麼', hint: '用你自己的話，重述這件事——不用急著解決，先把它說清楚。' },
  { id: 'tension', num: '②', label: '牌面揭露的張力', hint: '牌面照見的兩股互相拉扯的力量、需求或風險。下面先帶入牌義，你可以改寫成自己的話。' },
  { id: 'assumptions', num: '③', label: '可能忽略的假設', hint: '你「以為理所當然、其實還沒驗證」的推論。把它們寫下來，之後才知道要檢查什麼。' },
  { id: 'controllable', num: '④a', label: '我能控制的', hint: '這件事裡，真正握在你手上、可以動的部分。' },
  { id: 'uncontrollable', num: '④b', label: '我不能控制的', hint: '不在你掌握內的部分——寫下來，是為了停止在這裡耗能量。' },
  { id: 'experiment', num: '⑤', label: '七日小實驗', hint: '七天內可完成、可觀察、可回顧的一步。下面帶入牌面建議的行動當種子，改成你真正做得到的。' },
];

// 由一次抽牌建立備忘錄 scaffold。sections 為預填的可編輯預設值。
export function buildMemo({ question, draw, topic, spread, dateText, reviewDate, deckLabel }) {
  const topicLabel = TOPICS[topic] ? TOPICS[topic].label : '';
  const spreadName = SPREADS[spread] ? SPREADS[spread].nameZh : '';
  const cards = draw.map((d) => {
    const c = CARDS[d.cardId] || { nameZh: d.cardId };
    const r = READINGS[d.cardId];
    const dom = r && r.domains ? (r.domains[topic] || r.domains.work) : null;
    return {
      slotLabel: d.slotLabel || '',
      name: c.nameZh + (d.reversed ? '（逆位）' : ''),
      symbol: r && r.symbol ? r.symbol : '',
      action: dom && dom.action ? dom.action : '',
    };
  });
  // ② 張力：帶入每張牌的象徵當起點。⑤ 實驗：以第一張有行動建議的牌為種子。
  const tension = cards.map((c) => `${c.slotLabel ? c.slotLabel + '・' : ''}${c.name}：${c.symbol}`).join('\n');
  const experimentSeed = cards.map((c) => c.action).find(Boolean) || '';
  return {
    meta: { question: question || '', topicLabel, spreadName, deckLabel: deckLabel || '', dateText: dateText || '', reviewDate: reviewDate || '', cards },
    sections: {
      facing: question || '',
      tension,
      assumptions: '',
      controllable: '',
      uncontrollable: '',
      experiment: experimentSeed,
    },
  };
}

// 產生可編輯表單 HTML（呼叫方負責 setHTML 進容器；欄位 id 為 tm-<field>）。
export function memoFormHtml(memo) {
  const m = memo.meta;
  const cardsLine = m.cards.map((c) => `${c.slotLabel ? esc(c.slotLabel) + '・' : ''}${esc(c.name)}`).join('　·　');
  const metaBits = [m.topicLabel, m.spreadName, m.deckLabel].filter(Boolean).map(esc).join('　·　');
  const rows = MEMO_FIELDS.map((f) => `
    <div class="tarot-memo-field">
      <label for="tm-${f.id}"><span class="tarot-memo-num">${f.num}</span> ${esc(f.label)}</label>
      <p class="tarot-memo-hint">${esc(f.hint)}</p>
      <textarea id="tm-${f.id}" rows="${f.id === 'tension' ? 4 : 3}" placeholder="${esc(f.hint)}">${esc(memo.sections[f.id] || '')}</textarea>
    </div>`).join('');
  return `
    <div class="tarot-memo-headline">
      <span class="tarot-memo-kicker">Tarot Decision Memo｜塔羅決策備忘錄</span>
      <p class="tarot-memo-metaline">${metaBits}${m.dateText ? '　·　' + esc(m.dateText) : ''}</p>
      <p class="tarot-memo-cards">${cardsLine}</p>
      <p class="tarot-memo-note">這是一份「反思備忘錄」，不是命理報告。以下每一段都可以編輯——工具給你結構，內容由你決定。填寫的文字只留在這個瀏覽器，不會上傳。</p>
    </div>
    ${rows}`;
}

// 從表單讀回使用者編輯後的五段（回傳新的 memo，meta 沿用）。
export function readMemo(memo) {
  const get = (id) => { const e = document.getElementById('tm-' + id); return e ? e.value.trim() : (memo.sections[id] || ''); };
  const sections = {};
  MEMO_FIELDS.forEach((f) => { sections[f.id] = get(f.id); });
  return { meta: memo.meta, sections };
}

// ---- Markdown 匯出（與畫面同一份資料，故一致）----
export function memoToMarkdown(memo) {
  const m = memo.meta, s = memo.sections;
  const val = (t) => (t && t.trim() ? t.trim() : '（尚未填寫）');
  const cardLines = m.cards.map((c) => `  - ${c.slotLabel ? c.slotLabel + '：' : ''}${c.name}`).join('\n');
  return `# 塔羅決策備忘錄（Tarot Decision Memo）

- 日期：${m.dateText || ''}
- 主題：${m.topicLabel || ''}
- 牌陣：${m.spreadName || ''}
- 牌組：${m.deckLabel || ''}
- 抽到的牌：
${cardLines}

## ① 你正在面對什麼
${val(s.facing)}

## ② 牌面揭露的張力
${val(s.tension)}

## ③ 可能忽略的假設
${val(s.assumptions)}

## ④ 可控制／不可控制
**我能控制的：**
${val(s.controllable)}

**我不能控制的：**
${val(s.uncontrollable)}

## ⑤ 七日小實驗
${val(s.experiment)}

- 預定回顧日期：${m.reviewDate || ''}

---
由 Swanky Cyber Tarot Lab 產生 · 不是占卜，是把模糊處境整理成可驗證的行動假設。
https://swanky.github.io/tarot/
`;
}

// ---- 純文字檔下載（Markdown／JSON／ics 共用；Journal 頁也會用）----
export function downloadText(text, filename, mime) {
  const blob = new Blob([text], { type: (mime || 'text/plain') + ';charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export function downloadMemoMarkdown(memo, filename) {
  downloadText(memoToMarkdown(memo), filename || 'tarot-decision-memo.md', 'text/markdown');
}

// ---- .ics 七日回顧提醒（靜態站無法主動推播，改讓使用者匯入自己的行事曆）----
// 全天事件；DTSTART 為 reviewDate（YYYYMMDD）。UID 由呼叫方傳入的 stamp 決定（避免 Date 於測試環境）。
function icsEscape(s) { return String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); }
export function buildReviewIcs(memo, stamp) {
  const m = memo.meta;
  const ymd = (m.reviewDate || '').replace(/[^0-9]/g, ''); // 2026/07/21 → 20260721
  const uid = 'tarot-memo-' + (stamp || ymd) + '@swanky.github.io';
  const summary = icsEscape('塔羅七日回顧：' + (m.question || m.topicLabel || '你的反思'));
  const desc = icsEscape(
    '回到 Swanky Cyber Tarot Lab，檢查當時的假設與七日小實驗：\n' +
    '1. 當時的假設成立嗎？\n2. 實際採取了什麼行動？\n3. 下次要保留或改變什麼？\n\n七日小實驗：' +
    (memo.sections.experiment || '（當時未填）') + '\n\nhttps://swanky.github.io/tarot/journal/');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Swanky Cyber Tarot Lab//Decision Memo//ZH-TW',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT', 'UID:' + uid, 'DTSTART;VALUE=DATE:' + ymd,
    'SUMMARY:' + summary, 'DESCRIPTION:' + desc, 'TRANSP:TRANSPARENT',
    'BEGIN:VALARM', 'TRIGGER:PT0S', 'ACTION:DISPLAY', 'DESCRIPTION:' + summary, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}
export function downloadReviewIcs(memo, stamp, filename) {
  downloadText(buildReviewIcs(memo, stamp), filename || 'tarot-review-reminder.ics', 'text/calendar');
}

// ---- PNG 匯出：純文字備忘錄卡（向量文字 → canvas → PNG）----
// CJK 折行、不設硬上限（中文不截字）；高度依實際行數動態計算。
function wrapCJK(s, max) {
  const out = [];
  String(s == null ? '' : s).split('\n').forEach((para) => {
    const chars = Array.from(para.replace(/\s+$/,''));
    if (!chars.length) { out.push(''); return; }
    let cur = '';
    for (const ch of chars) { cur += ch; if (Array.from(cur).length >= max) { out.push(cur); cur = ''; } }
    if (cur) out.push(cur);
  });
  return out.length ? out : [''];
}

export function buildMemoSvg(memo) {
  const m = memo.meta, s = memo.sections;
  const margin = 56;
  const bodyMax = 34;      // 每行約 34 全形字
  const lineH = 27;
  let body = '';
  let y = 66;

  // 標頭
  body += `<text x="${margin}" y="${y}" style="font:700 13px ${FONT}; letter-spacing:3px" fill="${GOLD}">TAROT DECISION MEMO · 塔羅決策備忘錄</text>`;
  y += 30;
  const title = [m.topicLabel, m.spreadName].filter(Boolean).join('・') || '我的塔羅反思';
  body += `<text x="${margin}" y="${y}" style="font:700 25px ${FONT}" fill="${INK}">${esc(title)}</text>`;
  if (m.dateText) body += `<text x="${W - margin}" y="${y}" text-anchor="end" style="font:400 13px ${FONT}" fill="#aaa">${esc(m.dateText)}</text>`;
  y += 26;
  const cardsLine = m.cards.map((c) => `${c.slotLabel ? c.slotLabel + '・' : ''}${c.name}`).join('　·　');
  wrapCJK((m.deckLabel ? m.deckLabel + '　·　' : '') + cardsLine, 44).forEach((ln) => {
    body += `<text x="${margin}" y="${y}" style="font:400 13px ${FONT}" fill="${MUTED}">${esc(ln)}</text>`; y += 20;
  });
  y += 8;
  body += `<line x1="${margin}" y1="${y}" x2="${W - margin}" y2="${y}" stroke="#efe7d4" stroke-width="1"/>`;
  y += 26;

  // 五段
  const sectionDefs = [
    ['① 你正在面對什麼', s.facing],
    ['② 牌面揭露的張力', s.tension],
    ['③ 可能忽略的假設', s.assumptions],
    ['④ 可控制／不可控制', '【我能控制的】\n' + (s.controllable || '（尚未填寫）') + '\n【我不能控制的】\n' + (s.uncontrollable || '（尚未填寫）')],
    ['⑤ 七日小實驗', s.experiment],
  ];
  sectionDefs.forEach(([head, text]) => {
    body += `<text x="${margin}" y="${y}" style="font:700 16px ${FONT}" fill="${GOLD_DK}">${esc(head)}</text>`;
    y += 26;
    wrapCJK(text && text.trim() ? text : '（尚未填寫）', bodyMax).forEach((ln) => {
      body += `<text x="${margin}" y="${y}" style="font:400 15px ${FONT}" fill="#3f3b34">${esc(ln)}</text>`;
      y += lineH;
    });
    y += 16;
  });

  // 頁尾
  y += 4;
  body += `<line x1="${margin}" y1="${y}" x2="${W - margin}" y2="${y}" stroke="#efe7d4" stroke-width="1"/>`;
  y += 26;
  if (m.reviewDate) { body += `<text x="${margin}" y="${y}" style="font:700 13px ${FONT}" fill="${GOLD_DK}">預定回顧日期：${esc(m.reviewDate)}</text>`; y += 24; }
  body += `<text x="${margin}" y="${y}" style="font:400 12px ${FONT}" fill="#999">Swanky Cyber Tarot Lab · 不是占卜，是把處境整理成可驗證的行動假設 · swanky.github.io/tarot</text>`;
  y += 24;

  const H = y + 20;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>` +
    `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="18" fill="#FFFDF7" stroke="#f0e4c4" stroke-width="1.5"/>` +
    body + `</svg>`;
  return { svg, w: W, h: H };
}

export function exportMemoPng(memo, opts = {}) {
  const { svg, w, h } = buildMemoSvg(memo);
  downloadPngFromSvg({
    svg, width: w, height: h, scale: opts.scale, background: '#fff',
    filename: opts.filename || 'tarot-decision-memo.png',
    onError: opts.onError,
  });
}
