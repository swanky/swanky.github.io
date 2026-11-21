// ziwei-ui.js — 紫微斗數頁面入口（ES module）。
// 流程：出生表單（含性別、可選真太陽時）→ computeZiwei（iztro）→ 命盤 SVG（可點宮位看三方四正）
//      → 宮位詳情 → 目前運勢 → 帶著命盤去問 AI → 存成分享圖。
// 2026-11-21 起轉正：命宮／身宮／五行局／宮名宮干／十四主星／生年四化／大限已與獨立參考實作逐筆比對
// （tests/ziwei/golden.test.mjs、tools/golden/ziwei_golden.py）；亮度、輔星煞星、流年不在比對範圍。
import {
  computeZiwei, timeIndexOf, minutesToTimeBoundary, trueSolarWallClock, sanFangSiZheng, soulPalace, TIME_NAMES,
} from './ziwei-engine.js';
import { buildZiweiSvg, buildZiweiShareSvg, MUTAGEN_COLOR } from './ziwei-svg.js';
import { MAJOR_TEXT, PALACE_TEXT, MUTAGEN_TEXT, BRIGHTNESS_TEXT, EMPTY_PALACE_TEXT } from './ziwei-texts.js';
import { ziweiBriefData } from './ziwei-brief.js';
import { mountAiBrief, todayStr } from '../core/core-ai-brief.js';
import { downloadPngFromSvg } from '../core/core-export.js';
import { zonedToUtc, isDstWallTime } from '../core/core-timezone.js';
import { CITIES } from '../core/core-cities.js';
import { fillBirthSelects } from '../core/core-form.js';
import { $, setHTML, setText, show, on, gtag, esc } from '../core/core-dom.js';

let state = { chart: null, inp: null, selected: null, trueSolar: null };
let brief = null;
const compactMQ = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 600px)') : null;

function collect() {
  const city = CITIES[+$('ziwei-city').value];
  const g = document.querySelector('input[name="ziwei-gender"]:checked');
  return {
    y: +$('ziwei-y').value, mo: +$('ziwei-mo').value, d: +$('ziwei-d').value,
    h: +$('ziwei-h').value, mi: +$('ziwei-mi').value,
    city, gender: g ? g.value : '',
    useTrueSolar: $('ziwei-true-solar') ? $('ziwei-true-solar').checked : false,
    name: $('ziwei-name') ? $('ziwei-name').value.trim() : '',
  };
}

function fail(msg) { setText('ziwei-error', msg); show('ziwei-error', true); }

function doCompute() {
  show('ziwei-error', false);
  const inp = collect();
  if (!inp.gender) return fail('請選擇性別：紫微斗數的大限方向依性別而不同。');
  let { y, mo, d, h, mi } = inp;
  let trueSolar = null;
  if (inp.useTrueSolar) {
    if (!inp.city || inp.city.lon == null) return fail('換算真太陽時需要出生城市的經度，請選擇城市。');
    try {
      const z = zonedToUtc(y, mo, d, h, mi, inp.city.tz);
      trueSolar = trueSolarWallClock(z.utcMs, inp.city.lon, z.offsetMin);
      ({ year: y, month: mo, day: d, hour: h, minute: mi } = trueSolar);
    } catch {
      return fail('時區換算失敗，請確認出生日期與城市，或取消真太陽時換算。');
    }
  }
  let chart;
  try {
    chart = computeZiwei({ year: y, month: mo, day: d, hour: h, minute: mi, gender: inp.gender, refDate: refDateStr() });
  } catch (e) {
    return fail(e && e.messageZh ? e.messageZh : (e && e.message) || '排盤失敗，請稍後再試。');
  }
  state = { chart, inp, selected: soulPalace(chart).index, trueSolar, used: { h, mi } };
  render();
  gtag('event', 'ziwei_compute', { true_solar: inp.useTrueSolar });
  const res = $('ziwei-result');
  if (res && res.scrollIntoView) res.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function refDateStr() {
  const n = new Date();
  return `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`;
}

function renderBoard() {
  const { chart, selected, inp } = state;
  setHTML('ziwei-board', buildZiweiSvg(chart, { selected, name: inp.name ? `${inp.name}的命盤` : '', compact: !!(compactMQ && compactMQ.matches) }));
}

function starLine(st) {
  const t = MAJOR_TEXT[st.name];
  const bright = st.brightness ? `<span class="zw-bright">${esc(st.brightness)}・${esc(BRIGHTNESS_TEXT[st.brightness] || '')}</span>` : '';
  const mut = st.mutagen ? `<span class="zw-mut" style="background:${MUTAGEN_COLOR[st.mutagen]}">化${esc(st.mutagen)}</span>` : '';
  return `<div class="zw-star"><div class="zw-star-head"><b>${esc(st.name)}</b>${bright}${mut}${t ? `<span class="zw-key">${esc(t.key)}</span>` : ''}</div>${t ? `<p>${esc(t.text)}</p>` : ''}${st.mutagen ? `<p class="zw-mut-text">${esc(MUTAGEN_TEXT[st.mutagen].label)}：${esc(MUTAGEN_TEXT[st.mutagen].text)}</p>` : ''}</div>`;
}

function renderDetail() {
  const { chart, selected } = state;
  const p = chart.palaces[selected];
  const sf = sanFangSiZheng(selected);
  const P = chart.palaces;
  const opp = P[sf.opposite];
  const majors = p.major.length ? p.major.map(starLine).join('')
    : `<p class="zw-empty">${esc(EMPTY_PALACE_TEXT)}對宮是<b>${esc(opp.name)}</b>（${esc(opp.major.map((s) => s.name).join('、') || '也是空宮')}）。</p>${opp.major.map(starLine).join('')}`;
  const minors = p.minor.length ? `<p class="zw-minor"><span>輔星：</span>${p.minor.map((m) => `<span${m.mutagen ? ` style="color:${MUTAGEN_COLOR[m.mutagen]};font-weight:700"` : ''}>${esc(m.name)}${m.mutagen ? '化' + esc(m.mutagen) : ''}</span>`).join('、')}</p>` : '';
  setHTML('ziwei-detail', `
    <div class="zw-detail-head">
      <h3>${esc(p.name)}${p.name.endsWith('宮') ? '' : '宮'}<small>${esc(p.stem + p.branch)}${p.isBody ? '・身宮' : ''}${p.decadal ? `・大限 ${p.decadal[0]}–${p.decadal[1]} 歲` : ''}</small></h3>
      <p>${esc(PALACE_TEXT[p.name] || '')}</p>
    </div>
    ${majors}${minors}
    <p class="zw-sf">三方四正（盤上金色連線）：對宮 <b>${esc(opp.name)}</b>、三合 <b>${esc(P[sf.trineA].name)}</b>、<b>${esc(P[sf.trineB].name)}</b>。看一個宮位時，傳統上會把這四宮一起看。</p>
    <p class="zw-hint">點盤上任一宮位，可以切換到那一宮的說明。</p>`);
}

function renderSummary() {
  const { chart, trueSolar, used, inp } = state;
  const soul = soulPalace(chart);
  const P = chart.palaces;
  const soulStars = soul.major.length ? soul.major.map((s) => s.name).join('、') : `空宮（借對宮 ${P[sanFangSiZheng(soul.index).opposite].major.map((s) => s.name).join('、') || '—'}）`;
  const body = P.find((p) => p.isBody);
  const cards = [
    { label: '命宮主星・你是什麼樣的人', big: soulStars, sub: soul.major[0] && MAJOR_TEXT[soul.major[0].name] ? MAJOR_TEXT[soul.major[0].name].key : '可塑性高、隨環境調整' },
    { label: '身宮・中年後的重心', big: `${body.name}`, sub: PALACE_TEXT[body.name] || '' },
    { label: '五行局・命主・身主', big: chart.fiveElementsClass, sub: `命主 ${chart.soul}・身主 ${chart.body}` },
  ];
  setHTML('ziwei-summary', cards.map((c) => `<div class="zw-card"><span class="zw-card-label">${esc(c.label)}</span><b>${esc(c.big)}</b><p>${esc(c.sub)}</p></div>`).join(''));
  setHTML('ziwei-sihua', chart.birthMutagen.map((m) => `<li><span class="zw-mut" style="background:${MUTAGEN_COLOR[m.mutagen]}">化${esc(m.mutagen)}</span><b>${esc(m.star)}</b>在<b>${esc(m.palace)}</b><small>${esc(MUTAGEN_TEXT[m.mutagen].text)}</small></li>`).join(''));

  const notes = [];
  if (trueSolar) notes.push(`已依${esc(inp.city.zh)}的經度換算真太陽時（${trueSolar.correctionMin >= 0 ? '+' : ''}${trueSolar.correctionMin} 分鐘），排盤使用 ${String(used.h).padStart(2, '0')}:${String(used.mi).padStart(2, '0')}，落在${TIME_NAMES[timeIndexOf(used.h, used.mi)]}。`);
  const edge = minutesToTimeBoundary(used.h, used.mi);
  if (edge <= 15) notes.push(`<b>提醒：</b>出生時間距離時辰交界只有 ${edge} 分鐘，若記錄的時間有些微誤差，命盤可能整張不同。可以試試勾選或取消「真太陽時」比較看看。`);
  if (!trueSolar && isDstWallTime(inp.y, inp.mo, inp.d, inp.h, inp.mi, inp.city.tz)) {
    notes.push(`<b>夏令時間提醒：</b>你出生的時間，${esc(inp.city.zh)}正在實施夏令時間（時鐘比標準時間快一小時）。紫微傳統上用標準時間排時辰，建議把出生時間減一小時再排一次，或勾選「真太陽時」讓系統自動換算。`);
  }
  setHTML('ziwei-notes', notes.map((n) => `<p>${n}</p>`).join(''));
  show('ziwei-notes', notes.length > 0);
}

function renderFortune() {
  const h = state.chart.horoscope;
  if (!h) { show('ziwei-fortune-panel', false); return; }
  const ml = (arr) => arr.map((m) => `<li><span class="zw-mut" style="background:${MUTAGEN_COLOR[m.mutagen]}">化${esc(m.mutagen)}</span>${esc(m.star)}${m.palace ? `<small>→ 本命${esc(m.palace)}</small>` : ''}</li>`).join('');
  setHTML('ziwei-fortune', `
    <div class="zw-fortune-col"><h4>目前大限・${h.decadal.range ? h.decadal.range.join('–') : ''} 歲</h4><p>走在本命<b>${esc(h.decadal.palace)}</b>（${esc(h.decadal.stemBranch)}）：${esc(PALACE_TEXT[h.decadal.palace] || '')}</p><ul class="zw-mlist">${ml(h.decadal.mutagen)}</ul></div>
    <div class="zw-fortune-col"><h4>${esc(h.yearly.stemBranch)} 流年</h4><p>流年命宮落在本命<b>${esc(h.yearly.palace)}</b>：${esc(PALACE_TEXT[h.yearly.palace] || '')}</p><ul class="zw-mlist">${ml(h.yearly.mutagen)}</ul></div>`);
  show('ziwei-fortune-panel', true);
}

function render() {
  renderSummary();
  renderBoard();
  renderDetail();
  renderFortune();
  show('ziwei-result', true);
  if (!brief) {
    brief = mountAiBrief($('ziwei-brief'), {
      gaTool: 'ziwei',
      system: '紫微斗數',
      getData: ({ hidePersonal }) => (state.chart ? ziweiBriefData(state.chart, { name: state.inp.name, trueSolar: state.trueSolar, hidePersonal }) : null),
      getAge: () => {
        if (!state.inp) return null;
        const n = new Date(); const i = state.inp;
        return n.getFullYear() - i.y - ((n.getMonth() + 1 < i.mo || (n.getMonth() + 1 === i.mo && n.getDate() < i.d)) ? 1 : 0);
      },
    });
  } else brief.refresh();
}

function onBoardClick(ev) {
  const g = ev.target.closest && ev.target.closest('.zw-cell');
  if (!g || !state.chart) return;
  state.selected = +g.getAttribute('data-idx');
  renderBoard();
  renderDetail();
  gtag('event', 'ziwei_palace', { palace: state.chart.palaces[state.selected].name });
}

function saveShare() {
  if (!state.chart) return;
  const card = buildZiweiShareSvg(state.chart, { name: state.inp.name });
  downloadPngFromSvg({ svg: card.svg, width: card.w, height: card.h, scale: 1, background: '#0f1424', filename: `ziwei-${todayStr()}.png` });
  gtag('event', 'ziwei_share_card', {});
}

// 手機上命盤在畫面中時，暫時藏起右下「回到頂端」浮鈕，避免它壓住右下角的宮位（CSS 只在窄螢幕生效）
function watchBoardForFloatingButton() {
  const board = $('ziwei-board');
  if (!board || typeof IntersectionObserver === 'undefined') return;
  new IntersectionObserver((entries) => {
    for (const e of entries) document.body.classList.toggle('zw-board-inview', e.isIntersecting);
  }, { threshold: 0, rootMargin: '-15% 0px -15% 0px' }).observe(board); // 盤面任何一部分進入畫面中段就算在看
}

function init() {
  watchBoardForFloatingButton();
  fillBirthSelects('ziwei', { requireLatLon: false });
  if ($('ziwei-y')) $('ziwei-y').value = 1990;
  on('ziwei-compute', 'click', doCompute);
  on('ziwei-board', 'click', onBoardClick);
  on('ziwei-share', 'click', saveShare);
  if (compactMQ && compactMQ.addEventListener) compactMQ.addEventListener('change', () => { if (state.chart) renderBoard(); });
  show('ziwei-result', false);
  show('ziwei-error', false);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
