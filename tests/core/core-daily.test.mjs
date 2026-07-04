// core-daily：每日鎖純邏輯測試（date mock + mock localStorage，零瀏覽器）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dayKey, isToday, canReroll, loadDaily, saveDaily } from '../../assets/js/core/core-daily.js';

test('dayKey 產生本地日界 YYYY-MM-DD', () => {
  assert.equal(dayKey(new Date(2026, 6, 4, 23, 59)), '2026-07-04');
  assert.equal(dayKey(new Date(2026, 0, 9, 0, 1)), '2026-01-09');
  assert.equal(dayKey(new Date(2026, 11, 31, 12, 0)), '2026-12-31');
});

test('isToday 依當地日界判定', () => {
  const now = new Date(2026, 6, 4, 10, 0);
  assert.equal(isToday({ date: '2026-07-04' }, now), true);
  assert.equal(isToday({ date: '2026-07-03' }, now), false);
  assert.equal(isToday(null, now), false);
});

test('canReroll：跨日重置，同日達上限則不可', () => {
  const now = new Date(2026, 6, 4, 10, 0);
  assert.equal(canReroll(null, 1, now), true);                                 // 今天還沒抽
  assert.equal(canReroll({ date: '2026-07-03', rerolls: 9 }, 1, now), true);   // 昨天記錄 → 跨日重置
  assert.equal(canReroll({ date: '2026-07-04', rerolls: 0 }, 1, now), true);   // 今天抽過、還沒換
  assert.equal(canReroll({ date: '2026-07-04', rerolls: 1 }, 1, now), false);  // 今天已換 1 次
});

test('loadDaily／saveDaily round-trip（mock localStorage）＋跨日過期', () => {
  const store = {};
  global.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
  try {
    const now = new Date(2026, 6, 4, 12, 0);
    assert.equal(loadDaily('t', now), null);
    assert.equal(saveDaily('t', { cardId: 'the-fool', reversed: false }, 0, now), true);
    const rec = loadDaily('t', now);
    assert.ok(rec && rec.value.cardId === 'the-fool' && rec.rerolls === 0);
    assert.equal(loadDaily('t', new Date(2026, 6, 5, 0, 1)), null); // 隔天讀不到
  } finally {
    delete global.localStorage;
  }
});
