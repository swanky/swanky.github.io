// hd-form.js — 出生資料表單 factory（單人頁與合盤頁共用；合盤頁 A/B 各實例化一次）。
// 從 hd-ui.js 抽出：年月日時分選單、手動 UTC 偏移、城市搜尋（searchCities autocomplete）、
// 未知時間 checkbox 的時分停用鉤。DOM id 以 prefix 參數化：單人頁 'hd'（hd-year…），
// 合盤頁 'hd-a'／'hd-b'（hd-a-year…）。每實例自有 tz/cityLabel 狀態（原 hd-ui 模組級 state 局部化）。
import { searchCities } from './hd-cities.js';
import { $, setVal, on } from '../core/core-dom.js';

function fillSelect(sel, items) {
  if (!sel) return;
  sel.innerHTML = items.map((it) => `<option value="${it.v}">${it.t}</option>`).join('');
}
function range(a, b) { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; }
function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }
function offsetLabel(min) {
  const sign = min < 0 ? '-' : '+';
  const abs = Math.abs(min);
  return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}

const MANUAL_OFFSETS = [-720, -660, -600, -540, -480, -420, -360, -300, -240, -210, -180, -120, -60, 0,
  60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 540, 570, 600, 630, 660, 720, 765, 780, 840];

export function createBirthForm({ prefix = 'hd' } = {}) {
  const state = { tz: null, cityLabel: null };
  const eid = (n) => `${prefix}-${n}`;
  const el = (n) => $(eid(n));

  function refreshDays() {
    const yEl = el('year'), mEl = el('month'), dEl = el('day');
    if (!yEl || !mEl || !dEl) return;
    const y = +yEl.value;
    const m = +mEl.value;
    const prev = +dEl.value || 1;
    const max = daysInMonth(y, m);
    fillSelect(dEl, range(1, max).map((d) => ({ v: d, t: d })));
    dEl.value = Math.min(prev, max);
  }

  function initCitySearch() {
    const input = el('city-search');
    const list = el('city-list');
    if (!input || !list) return;
    let activeIdx = -1;
    let results = [];

    const close = () => { list.classList.remove('is-open'); activeIdx = -1; };
    const render = () => {
      if (!results.length) { close(); return; }
      list.innerHTML = results.map((c, i) =>
        `<div class="hd-city-item${i === activeIdx ? ' is-active' : ''}" data-idx="${i}" role="option">
          <span>${c.zh}<span style="color:#bbb;font-size:0.8rem;"> ${c.en}</span></span>
          <span class="hd-city-group">${c.group}</span></div>`).join('');
      list.classList.add('is-open');
    };
    const pick = (c) => {
      state.tz = c.tz; state.cityLabel = c.zh;
      input.value = c.zh;
      close();
    };

    input.addEventListener('input', () => {
      state.tz = null; // 重新輸入即清除已選
      results = searchCities(input.value);
      activeIdx = -1;
      render();
    });
    input.addEventListener('keydown', (e) => {
      if (!list.classList.contains('is-open')) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, results.length - 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (activeIdx >= 0) pick(results[activeIdx]); }
      else if (e.key === 'Escape') close();
    });
    list.addEventListener('mousedown', (e) => {
      const item = e.target.closest('.hd-city-item');
      if (item) pick(results[+item.dataset.idx]);
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.hd-city-wrap')) close(); });
  }

  function init() {
    fillSelect(el('year'), range(1900, 2100).reverse().map((y) => ({ v: y, t: y })));
    fillSelect(el('month'), range(1, 12).map((m) => ({ v: m, t: m })));
    fillSelect(el('hour'), range(0, 23).map((h) => ({ v: h, t: String(h).padStart(2, '0') })));
    fillSelect(el('minute'), range(0, 59).map((m) => ({ v: m, t: String(m).padStart(2, '0') })));
    setVal(eid('year'), 1990);
    setVal(eid('month'), 1);
    setVal(eid('hour'), 12);
    setVal(eid('minute'), 0);
    refreshDays();
    on(eid('year'), 'change', refreshDays);
    on(eid('month'), 'change', refreshDays);

    fillSelect(el('manual-tz'), MANUAL_OFFSETS.map((o) => ({ v: o, t: offsetLabel(o) })));
    setVal(eid('manual-tz'), 480);

    // 未知時間：停用時分（固定正午取樣由引擎層處理）
    on(eid('unknown-time'), 'change', (e) => {
      const dis = e.target.checked;
      const h = el('hour'); if (h) h.disabled = dis;
      const mi = el('minute'); if (mi) mi.disabled = dis;
      const uncertainty = el('uncertainty'); if (uncertainty) uncertainty.disabled = dis;
    });

    initCitySearch();
  }

  function readInput() {
    const v = (n) => +(el(n)?.value || 0);
    return { year: v('year'), month: v('month'), day: v('day'), hour: v('hour'), minute: v('minute') };
  }

  function resolveTz() {
    if (state.tz) return state.tz;
    // 城市未選但展開了手動偏移
    const field = el('city-search')?.closest('.hd-field');
    const adv = field ? field.querySelector('.hd-advanced') : null;
    if (adv && adv.open) return { offsetMinutes: +(el('manual-tz')?.value || 0) };
    return null;
  }

  function isUnknownTime() { return !!el('unknown-time')?.checked; }
  function uncertaintyMinutes() { return +(el('uncertainty')?.value || 0); }

  // 程式化帶入（hash 預填／sessionStorage 帶入）：日期時間直設選單、tz 設 IANA 字串或手動偏移
  function setDate(y, mo, d) { setVal(eid('year'), y); setVal(eid('month'), mo); refreshDays(); setVal(eid('day'), d); }
  function setTime(h, mi) { setVal(eid('hour'), h); setVal(eid('minute'), mi); }
  function setCity(tz, label) { state.tz = tz; state.cityLabel = label || null; const inp = el('city-search'); if (inp && label) inp.value = label; }
  function setManualOffset(o) {
    const field = el('city-search')?.closest('.hd-field');
    const adv = field ? field.querySelector('.hd-advanced') : null;
    if (adv) adv.open = true;
    setVal(eid('manual-tz'), o);
  }
  function setUnknownTime(b) {
    const cb = el('unknown-time');
    if (!cb) return;
    cb.checked = !!b;
    cb.dispatchEvent(new Event('change'));
  }

  return {
    init, readInput, resolveTz, isUnknownTime, uncertaintyMinutes,
    setDate, setTime, setCity, setManualOffset, setUnknownTime,
    get tz() { return state.tz; },
    set tz(v) { state.tz = v; },
    get cityLabel() { return state.cityLabel; },
  };
}
