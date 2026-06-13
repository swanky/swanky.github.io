// timezone.test.mjs — 牆鐘→UTC：台灣三個時代（JST／夏令時／現代）＋ DST 邊界
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zonedToUtc, zonedToUtcManual, INTL_TZ_OK } from '../../assets/js/human-design/hd-timezone.js';

test('Intl 歷史時區探針通過（Node 18+ 為 full-icu）', () => {
  assert.ok(INTL_TZ_OK, 'Intl 探針失敗——此環境缺少完整 tzdata');
});

test('台北：現代 +8', () => {
  const r = zonedToUtc(1990, 6, 15, 12, 0, 'Asia/Taipei');
  assert.equal(r.utcMs, Date.UTC(1990, 5, 15, 4, 0));
  assert.equal(r.offsetMin, 480);
  assert.equal(r.status, 'ok');
  assert.equal(r.labelZh, 'UTC+08:00');
});

test('台北：1975 夏令時間 +9', () => {
  const r = zonedToUtc(1975, 5, 1, 12, 0, 'Asia/Taipei');
  assert.equal(r.utcMs, Date.UTC(1975, 4, 1, 3, 0));
  assert.equal(r.offsetMin, 540);
  assert.ok(r.labelZh.includes('夏令時間'));
});

test('台北：1979 夏令時間 +9、1955 夏令時間 +9', () => {
  assert.equal(zonedToUtc(1979, 8, 8, 12, 0, 'Asia/Taipei').offsetMin, 540);
  assert.equal(zonedToUtc(1955, 7, 1, 12, 0, 'Asia/Taipei').offsetMin, 540);
});

test('台北：1937–1945 日治 JST +9、1930 年 +8', () => {
  assert.equal(zonedToUtc(1940, 12, 25, 12, 0, 'Asia/Taipei').offsetMin, 540);
  assert.equal(zonedToUtc(1930, 1, 1, 12, 0, 'Asia/Taipei').offsetMin, 480);
});

test('台北：1975-04-01 00:30 落在撥快空缺 → gap、順移採計', () => {
  const r = zonedToUtc(1975, 4, 1, 0, 30, 'Asia/Taipei');
  assert.equal(r.status, 'gap');
  // 00:30 不存在；順移為 01:30(+09) = 1975-03-31 16:30 UTC
  assert.equal(r.utcMs, Date.UTC(1975, 2, 31, 16, 30));
  assert.equal(r.offsetMin, 540);
});

test('台北：1975-09-30 23:30 出現兩次 → ambiguous、取第一次（夏令 +9）', () => {
  const r = zonedToUtc(1975, 9, 30, 23, 30, 'Asia/Taipei');
  assert.equal(r.status, 'ambiguous');
  assert.equal(r.utcMs, Date.UTC(1975, 8, 30, 14, 30));
  assert.equal(r.offsetMin, 540);
});

test('紐約：夏令 -4／標準 -5', () => {
  assert.equal(zonedToUtc(2020, 7, 4, 12, 0, 'America/New_York').offsetMin, -240);
  assert.equal(zonedToUtc(2020, 1, 15, 12, 0, 'America/New_York').offsetMin, -300);
});

test('手動 UTC 偏移路徑', () => {
  const r = zonedToUtcManual(1986, 3, 15, 14, 30, 480);
  assert.equal(r.utcMs, Date.UTC(1986, 2, 15, 6, 30));
  assert.equal(r.labelZh, 'UTC+08:00');
});
