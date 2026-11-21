// compare-ui.js — 四套地圖對照頁互動。計算全在 compare-core（純函式），本檔只管表單與呈現。
import { computeAll, compareDimensions, keyFacts, compareBriefData, workTopic, SYSTEMS } from './compare-core.js';
import { isDstWallTime } from '../core/core-timezone.js';
import { mountAiBrief } from '../core/core-ai-brief.js';
import { CITIES } from '../core/core-cities.js';
import { fillBirthSelects } from '../core/core-form.js';
import { $, setHTML, setText, show, on, gtag, esc } from '../core/core-dom.js';

const TOOL_LINK = { hd: '/human-design/', astro: '/astrology/', bazi: '/bazi/', ziwei: '/ziwei/' };
const BETA = {}; // 系統 id → 標記文字；與 _data/divination_services.yml 的 status: beta 同步（2026-11-21 起四套皆已轉正）
let last = null;
let brief = null;

function base() {
  const el = document.querySelector('link[rel="canonical"]');
  return el ? new URL(el.href).pathname.replace(/\/explore\/compare\/?$/, '') : '';
}

function collect() {
  const city = CITIES[+$('cmp-city').value];
  const g = document.querySelector('input[name="cmp-gender"]:checked');
  const n = new Date();
  return {
    y: +$('cmp-y').value, mo: +$('cmp-mo').value, d: +$('cmp-d').value,
    h: +$('cmp-h').value, mi: +$('cmp-mi').value,
    city, gender: g ? g.value : '',
    name: $('cmp-name') ? $('cmp-name').value.trim() : '',
    refDate: `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`,
  };
}

function fail(msg) { setText('cmp-error', msg); show('cmp-error', true); }

function doCompute() {
  show('cmp-error', false);
  const b = collect();
  if (!b.gender) return fail('請選擇性別：八字大運與紫微大限的方向依性別而不同。');
  if (!b.city || b.city.lat == null) return fail('請選擇出生城市：星座上升與宮位需要出生地的經緯度。');
  try {
    last = computeAll(b);
  } catch (e) {
    console.error(e);
    return fail((e && (e.messageZh || e.message)) || '排盤失敗，請確認出生資料後再試一次。');
  }
  render();
  gtag('event', 'compare_compute', {});
  const res = $('cmp-result');
  if (res && res.scrollIntoView) res.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function render() {
  const facts = keyFacts(last);
  const root = base();
  setHTML('cmp-cards', SYSTEMS.map((s) => `
    <div class="cmp-card">
      <h4>${esc(s.name)}${BETA[s.id] ? `<span class="cmp-beta">${esc(BETA[s.id])}</span>` : ''}</h4>
      <dl>${facts[s.id].map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
      <a href="${root}${TOOL_LINK[s.id]}">看完整${esc(s.name)}命盤 →</a>
    </div>`).join(''));

  setHTML('cmp-dims', compareDimensions(last).map((d) => {
    const v = d.verdict;
    return `
    <div class="cmp-dim">
      <div class="cmp-dim-head"><b>${esc(d.title)}</b><span class="cmp-poles">${esc(d.poles.a)} ↔ ${esc(d.poles.b)}</span><span class="cmp-verdict is-${v.kind}">${esc(v.label)}</span></div>
      <p class="cmp-dim-hint">${esc(d.hint)}</p>
      <ul class="cmp-rows">${d.rows.map((r) => `
        <li><span class="cmp-sys">${esc(r.name)}${BETA[r.system] ? '<sup class="cmp-beta-mark" title="排盤測試中">＊</sup>' : ''}</span><span class="cmp-pole${r.pole ? '' : ' is-none'}">${r.pole ? esc(d.poles[r.pole]) : '沒有明顯傾向'}</span><span class="cmp-basis">${esc(r.basis)}</span></li>`).join('')}
      </ul>
    </div>`;
  }).join(''));

  const wt = workTopic(last);
  setText('cmp-topic-title', `同一主題，四套各自怎麼說：${wt.title}`);
  setHTML('cmp-topic', wt.rows.map((x) => `
    <div class="cmp-topic-row">
      <div class="cmp-topic-sys">${esc(x.name)}${BETA[x.system] ? '<sup class="cmp-beta-mark" title="排盤測試中">＊</sup>' : ''}</div>
      <div><b class="cmp-topic-ind">${esc(x.indicator)}</b><p>${esc(x.text)}</p></div>
    </div>`).join(''));

  const b = last.birth;
  const dst = isDstWallTime(b.y, b.mo, b.d, b.h, b.mi, b.city.tz);
  setHTML('cmp-dst', dst ? `<b>你出生的時間，${esc(b.city.zh)}正在實施夏令時間</b>（時鐘比標準時間快一小時）。人類圖與星座已自動換算；八字與紫微傳統上用標準時間排，建議把時間減一小時再排一次比較。` : '');
  show('cmp-dst', dst);

  show('cmp-result', true);
  if (!brief) {
    brief = mountAiBrief($('cmp-brief'), {
      gaTool: 'compare',
      system: '四套系統',
      focuses: ['crosscheck', 'overall', 'career', 'love', 'custom'],
      getData: ({ hidePersonal }) => (last ? compareBriefData(last, { hidePersonal }) : null),
      getAge: () => {
        if (!last) return null;
        const n = new Date(); const b = last.birth;
        return n.getFullYear() - b.y - ((n.getMonth() + 1 < b.mo || (n.getMonth() + 1 === b.mo && n.getDate() < b.d)) ? 1 : 0);
      },
    });
  } else brief.refresh();
}

function init() {
  fillBirthSelects('cmp', { requireLatLon: true });
  if ($('cmp-y')) $('cmp-y').value = 1990;
  on('cmp-compute', 'click', doCompute);
  show('cmp-result', false);
  show('cmp-error', false);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
