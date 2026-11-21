// 出生地點：matchCity 自動帶入（只在不會排錯時區時才帶），以及表單 resolveTz 的優先順序。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchCity } from '../../assets/js/human-design/hd-cities.js';

test('完全相同或去掉市／縣：直接對到', () => {
  assert.equal(matchCity('台北').zh, '台北市');
  assert.equal(matchCity('臺北市').zh, '台北市');
  assert.equal(matchCity('Taipei').zh, '台北市');
  assert.equal(matchCity(' tokyo ').zh, '東京');
  assert.equal(matchCity('高雄').zh, '高雄市');
  assert.equal(matchCity('悉尼').zh, '雪梨');
});

test('台灣：縣市開頭、台灣／Taiwan、候選全在台灣都帶入台北時區', () => {
  assert.equal(matchCity('台北市大安區').zh, '台北市');
  assert.equal(matchCity('新北市板橋區').zh, '新北市');
  assert.equal(matchCity('taipei city').zh, '台北市');
  assert.equal(matchCity('台灣').tz, 'Asia/Taipei');
  assert.equal(matchCity('Taiwan').tz, 'Asia/Taipei');
  const twOnly = matchCity('北市'); // 台北市／新北市
  assert.ok(twOnly && twOnly.group === '台灣' && twOnly.tz === 'Asia/Taipei');
});

test('國外子字串、單字、跨時區、空字串、查無：一律不帶', () => {
  for (const q of ['san', '漢', '澳', '州', '大', '河', '法', '京', '台', '中', '', '   ', '亞特蘭提斯']) {
    assert.equal(matchCity(q), null, q);
  }
});

// ---- resolveTz：極簡假 DOM ----
function fakeDom() {
  const els = {};
  const mk = (id, extra = {}) => (els[id] = {
    id, value: '', innerHTML: '', open: false,
    classList: { add() {}, remove() {}, contains: () => false },
    addEventListener() {}, closest: () => null, ...extra,
  });
  for (const n of ['year', 'month', 'day', 'hour', 'minute', 'city-search', 'city-list', 'unknown-time', 'uncertainty']) mk(`hd-${n}`);
  const details = { open: false };
  mk('hd-manual-tz', { closest: (sel) => (sel === 'details' ? details : null) });
  globalThis.document = { getElementById: (id) => els[id] || null, querySelectorAll: () => [], addEventListener() {} };
  globalThis.window = {};
  return { els, details };
}

test('resolveTz：預設不指定時區；有選手動時區才採用；打字可對到就自動帶入', async () => {
  const { els, details } = fakeDom();
  const { createBirthForm } = await import('../../assets/js/human-design/hd-form.js');
  const form = createBirthForm({ prefix: 'hd' });
  form.init();
  assert.match(els['hd-manual-tz'].innerHTML, /<option value="">不指定/);
  assert.equal(els['hd-manual-tz'].value, '');
  assert.equal(form.resolveTz(), null);

  els['hd-city-search'].value = '台北市大安區';
  assert.equal(form.resolveTz(), 'Asia/Taipei');
  assert.equal(els['hd-city-search'].value, '台北市');
  assert.equal(form.cityLabel, '台北市');

  const f2 = createBirthForm({ prefix: 'hd' });
  els['hd-city-search'].value = 'san';
  els['hd-manual-tz'].value = '-480';
  assert.deepEqual(f2.resolveTz(), { offsetMinutes: -480 });

  els['hd-manual-tz'].value = '';
  f2.setManualOffset(540);
  assert.equal(details.open, true);
  assert.deepEqual(f2.resolveTz(), { offsetMinutes: 540 });
});
