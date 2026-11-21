// core-ai-brief.js — 自我探索工具共用：「給 AI 的完整提問」。
// 把命盤資料＋近況＋解讀規則＋訪客自己的問題，組成一段可直接貼進任何 AI 對話的文字（Markdown 結構）。
// 介面用語守則（AGENTS.md TA 規則）：畫面上不出現 prompt／Markdown／md／JSON，
// 一律說「完整提問」「複製去問 AI」「存成文字檔」。
//
// 純函式 buildAiBrief 不碰 DOM（Node 可測）；mountAiBrief 需瀏覽器。

const NL = '\n';

// 問題焦點：每個焦點在提問尾端加上對應的解讀指示。工具可用 focuses 參數限縮（例：星座不做流年）。
export const FOCUS = {
  overall: { label: '認識自己', ask: '請先用三到五句話說出我最核心的特質與人生主題，再分事業、金錢、感情三個面向說明。' },
  love: { label: '感情與關係', ask: '請聚焦在感情與親密關係：我容易被什麼樣的人吸引、我在關係裡的慣性與盲點、適合的相處模式，以及我可以怎麼調整。' },
  career: { label: '工作與方向', ask: '請聚焦在工作與職涯：我的天賦與工作風格、適合的角色、合作時要留意的地方，以及接下來可以嘗試的方向。' },
  year: { label: '今年重點', ask: '請聚焦在今年（資料裡的流年）：主要課題、可以把握的機會、需要放慢的地方，並給我接下來三個月、每個月一個可以實際執行的小行動。' },
  custom: { label: '我自己問', ask: '請聚焦回答我在最後提出的問題，並說明命盤裡哪些依據支持你的看法。' },
};

export const RULES = [
  '命盤已經排好，請直接使用以下資料，不要自己重新排盤或換算。',
  '每個論點都標明依據（哪個宮位、星曜、元素或相位），讓我能自己核對；資料裡沒有的內容不要自行補上。',
  '多指出我和大多數人不一樣的地方；如果從資料看不出明顯特色，請直接說，不要用人人都適用的話填滿。',
  '用「傾向」「可以留意」描述，不要斷言吉凶，也不要保證任何結果；若不同流派看法不同，請說明差異。',
  '財務不做投資建議。',
];
const HEALTH_RULE_OFF = '不要談健康或身體狀況。';
const HEALTH_RULE_ON = '健康只談傳統上的對應與作息建議，不做醫療判斷。';
const FORMAT = '回答格式：先給結論，再分點說明（每點附依據），最後給我一件這週就能試的小事，以及三個我可以接著追問的問題。';

const escCell = (s) => String(s == null ? '' : s).replace(/\|/g, '／').replace(/\n/g, ' ');

function renderSection(sec) {
  const parts = [`## ${sec.heading}`];
  if (sec.lines) parts.push(...sec.lines.map((l) => `- ${l}`));
  if (sec.table) {
    const { head, rows } = sec.table;
    parts.push(`| ${head.map(escCell).join(' | ')} |`);
    parts.push(`| ${head.map(() => '---').join(' | ')} |`);
    parts.push(...rows.map((r) => `| ${r.map(escCell).join(' | ')} |`));
  }
  if (sec.note) parts.push('', sec.note);
  return parts.join(NL);
}

// data: { system, title, source, sections:[{heading, lines?, table?, note?}], caveats?:[], extraRules?:[] }
// opts: { focus, question, situation, includeHealth, today:'YYYY-MM-DD', age?: number|string }
export function buildAiBrief(data, opts = {}) {
  const q = String(opts.question || '').trim();
  // 選「我自己問」卻沒填問題：退回「認識自己」，避免指示自相矛盾
  const focus = (opts.focus === 'custom' && !q) ? FOCUS.overall : (FOCUS[opts.focus] || FOCUS.overall);
  const situation = String(opts.situation || '').trim();
  const blocks = [];
  blocks.push(`# ${data.title}`);
  blocks.push(`我想請你當一位熟悉${data.system}、說話白話又誠實的解讀者。以下是我的命盤資料${data.source ? `（${data.source}）` : ''}。`);
  const ctx = [];
  if (opts.today) ctx.push(`今天日期：${opts.today}`);
  if (opts.age != null && opts.age !== '') ctx.push(`我目前的年齡：${opts.age} 歲`);
  ctx.push(`我的近況：${situation || '（未填寫，請先問我）'}`);
  blocks.push(renderSection({ heading: '關於我', lines: ctx }));
  for (const s of data.sections) blocks.push(renderSection(s));
  if (data.caveats && data.caveats.length) blocks.push(renderSection({ heading: '資料的限制', lines: data.caveats }));
  blocks.push(`## 請你這樣解讀${NL}${focus.ask}`);
  const askFirst = situation
    ? '我已經在上面寫了近況；資訊足夠就直接解讀，真的不夠再問我。'
    : '我沒有寫近況：請先問我兩到三個關於近況的問題，等我回答後，再依照下面的方向與格式解讀。';
  const rules = [...RULES, askFirst, opts.includeHealth ? HEALTH_RULE_ON : HEALTH_RULE_OFF, ...(data.extraRules || []), FORMAT];
  blocks.push(renderSection({ heading: '請遵守', lines: rules }));
  blocks.push(`## 我想問的問題${NL}${q || '（沒有特定問題，請依上面的方向解讀）'}`);
  return blocks.join(NL + NL) + NL;
}

export function briefFilename(system, dateStr) {
  return `${system}-完整提問-${dateStr}.md`;
}

export function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ---- 瀏覽器 UI ----
// container 內渲染：問題方向、近況、自己的問題、隱私選項、預覽、動作。
// getData({ hidePersonal }) 每次取最新命盤資料；getAge() 回目前年齡（可省略）。
export function mountAiBrief(container, { getData, getAge, system, gaTool, focuses }) {
  if (!container) return null;
  const keys = (focuses && focuses.length ? focuses : Object.keys(FOCUS)).filter((k) => FOCUS[k]);
  const id = (s) => `${gaTool}-brief-${s}`;
  container.innerHTML = `
    <div class="ai-brief">
      <div class="ai-brief-head">
        <span class="ai-brief-kicker"><i class="bi bi-chat-square-text"></i> 帶著命盤去問 AI</span>
        <h3>把你的命盤變成一段好問題</h3>
        <p>選一個方向、寫一句近況，我們會把完整命盤和解讀規則整理好。貼到 ChatGPT、Claude 或 Gemini，就能針對你自己的處境一路追問。整理過程都在你的裝置上完成。</p>
      </div>
      <div class="ai-brief-step">
        <span class="ai-brief-label">1. 想問哪個方向？</span>
        <div class="ai-brief-focus" role="radiogroup" aria-label="想問的方向">
          ${keys.map((k, i) => `<label class="ai-brief-chip"><input type="radio" name="${id('focus')}" value="${k}"${i === 0 ? ' checked' : ''}><span>${FOCUS[k].label}</span></label>`).join('')}
        </div>
      </div>
      <div class="ai-brief-step">
        <label class="ai-brief-label" for="${id('sit')}">2. 用一句話說說你的近況（建議填，AI 的回答會具體很多）</label>
        <input type="text" id="${id('sit')}" class="ai-brief-input" maxlength="200" placeholder="例如：工作八年，考慮轉換跑道">
      </div>
      <div class="ai-brief-step">
        <label class="ai-brief-label" for="${id('q')}">3. 有特別想問的事嗎？（選填）</label>
        <input type="text" id="${id('q')}" class="ai-brief-input" maxlength="300" placeholder="例如：適合創業嗎？">
      </div>
      <div class="ai-brief-opts">
        <label class="tool-check"><input type="checkbox" id="${id('hide')}"> 不附上生日與稱呼</label>
        <label class="tool-check"><input type="checkbox" id="${id('health')}"> 也談身心狀態</label>
      </div>
      <details class="ai-brief-preview">
        <summary>看看整理好的完整提問</summary>
        <textarea id="${id('out')}" class="ai-brief-out" readonly rows="12" aria-label="完整提問"></textarea>
      </details>
      <div class="ai-brief-actions">
        <button type="button" class="ai-brief-btn is-primary" id="${id('copy')}"><i class="bi bi-clipboard"></i> 複製去問 AI</button>
        <button type="button" class="ai-brief-btn" id="${id('save')}"><i class="bi bi-download"></i> 存成文字檔</button>
      </div>
      <p class="ai-brief-open">複製後打開：
        <a href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT</a>・<a href="https://claude.ai/new" target="_blank" rel="noopener">Claude</a>・<a href="https://gemini.google.com/app" target="_blank" rel="noopener">Gemini</a>
      </p>
      <p class="ai-brief-status" id="${id('status')}" aria-live="polite"></p>
    </div>`;
  const $ = (s) => document.getElementById(id(s));
  const focusVal = () => (container.querySelector(`input[name="${id('focus')}"]:checked`) || {}).value || keys[0];
  const build = () => {
    const hide = $('hide').checked;
    const data = getData({ hidePersonal: hide });
    if (!data) return '';
    return buildAiBrief(data, {
      focus: focusVal(),
      question: $('q').value,
      situation: $('sit').value,
      includeHealth: $('health').checked,
      today: todayStr(),
      age: hide || !getAge ? null : getAge(),
    });
  };
  const refresh = () => { $('out').value = build(); };
  const status = (t) => { $('status').textContent = t; };
  const ga = (action) => {
    if (window.gtag) window.gtag('event', 'ai_brief', { tool: gaTool, action, focus: focusVal(), has_situation: !!$('sit').value.trim() });
  };
  container.querySelectorAll('input').forEach((el) => el.addEventListener(el.type === 'text' ? 'input' : 'change', refresh));
  $('copy').addEventListener('click', async () => {
    refresh();
    const text = $('out').value;
    try {
      await navigator.clipboard.writeText(text);
      status('已複製！打開任何 AI 對話框貼上就可以開始問。');
    } catch {
      container.querySelector('.ai-brief-preview').open = true;
      $('out').select();
      status('請長按（或 Ctrl+C）複製上方文字。');
    }
    ga('copy');
  });
  $('save').addEventListener('click', () => {
    refresh();
    const blob = new Blob([$('out').value], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = briefFilename(system, todayStr());
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status('已存成文字檔，之後可以直接上傳到 AI 對話裡。');
    ga('save');
  });
  container.querySelectorAll('.ai-brief-open a').forEach((a) => a.addEventListener('click', () => ga('open_' + a.textContent.trim().toLowerCase())));
  refresh();
  return { refresh };
}
