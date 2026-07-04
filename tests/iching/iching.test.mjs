// 易經引擎測試：64 卦資料＋起卦邏輯完全自驗。
// 銅錢分布（6:7:8:9=1:3:3:1）用統計容差；數字/時間起卦確定性；之卦推導；卦義禁詞掃描。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HEXAGRAMS, TRIGRAMS, linesToHex, trigramBits, hexByNo,
} from '../../assets/js/iching/iching-hexagrams.js';
import { castCoins, castNumbers, castTime } from '../../assets/js/iching/iching-cast.js';

test('64 卦：no 1-64 唯一、上下卦組合唯一、lines 合法', () => {
  assert.equal(HEXAGRAMS.length, 64);
  const nos = new Set(), keys = new Set();
  for (const h of HEXAGRAMS) {
    nos.add(h.no); keys.add(h.upper * 8 + h.lower);
    assert.equal(h.lines.length, 6);
    assert.ok(h.upper >= 0 && h.upper < 8 && h.lower >= 0 && h.lower < 8);
    assert.ok(h.lines.every((l) => l === 0 || l === 1));
    assert.ok(h.name && h.oneLine && h.symbol.length === 2);
  }
  assert.equal(nos.size, 64);
  assert.equal(keys.size, 64);
  assert.equal(Math.min(...nos), 1);
  assert.equal(Math.max(...nos), 64);
});

test('linesToHex 雙向對應：每卦 lines → 回該卦', () => {
  for (const h of HEXAGRAMS) assert.equal(linesToHex(h.lines).no, h.no, h.name);
});

test('已知卦：乾坤既濟未濟、trigramBits', () => {
  assert.equal(linesToHex([1, 1, 1, 1, 1, 1]).name, '乾');
  assert.equal(linesToHex([0, 0, 0, 0, 0, 0]).name, '坤');
  assert.equal(hexByNo(1).name, '乾');
  assert.equal(hexByNo(64).name, '未濟');
  assert.equal(linesToHex([1, 0, 1, 0, 1, 0]).name, '既濟'); // 離下坎上
  assert.deepEqual(trigramBits(7), [1, 1, 1]); // 乾
  assert.deepEqual(trigramBits(0), [0, 0, 0]); // 坤
  assert.deepEqual(trigramBits(2), [0, 1, 0]); // 坎
  assert.equal(TRIGRAMS.length, 8);
});

test('銅錢起卦：值域 6-9、動爻為老陰老陽、分布近 1:3:3:1', () => {
  const cnt = { 6: 0, 7: 0, 8: 0, 9: 0 };
  const N = 6000, rounds = N / 6;
  for (let k = 0; k < rounds; k++) {
    const r = castCoins();
    assert.equal(r.lines.length, 6);
    assert.equal(r.values.length, 6);
    for (const v of r.values) { assert.ok(v >= 6 && v <= 9); cnt[v]++; }
    for (const i of r.moving) assert.ok(r.values[i] === 6 || r.values[i] === 9);
    assert.ok(r.ben);
    if (r.moving.length) assert.ok(r.zhi); else assert.equal(r.zhi, null);
  }
  assert.ok(cnt[6] / N > 0.06 && cnt[6] / N < 0.19, `P6=${cnt[6] / N}`);
  assert.ok(cnt[9] / N > 0.06 && cnt[9] / N < 0.19, `P9=${cnt[9] / N}`);
  assert.ok(cnt[7] / N > 0.26 && cnt[7] / N < 0.49, `P7=${cnt[7] / N}`);
  assert.ok(cnt[8] / N > 0.26 && cnt[8] / N < 0.49, `P8=${cnt[8] / N}`);
});

test('數字起卦：確定性＋之卦推導（1,1→乾之同人）', () => {
  const a = castNumbers(1, 1), b = castNumbers(1, 1);
  assert.equal(a.ben.no, b.ben.no);
  assert.equal(a.ben.name, '乾');
  assert.equal(a.moving.length, 1);
  assert.equal(a.moving[0], 1);       // 動爻第 2 爻
  assert.equal(a.zhi.name, '同人');    // 乾第 2 爻變 → 天火同人
});

test('時間起卦：確定性、結構完整', () => {
  const a = castTime(2026, 7, 4, 12), b = castTime(2026, 7, 4, 12);
  assert.equal(a.ben.no, b.ben.no);
  assert.equal(a.moving.length, 1);
  assert.ok(a.ben);
});

test('64 卦義無吉凶恐嚇禁詞', () => {
  const banned = /(大凶|大吉|災難|喪|絕命|破財|血光|必然|注定|一定會|橫財)/;
  for (const h of HEXAGRAMS) assert.ok(!banned.test(h.oneLine), `${h.name}: ${h.oneLine}`);
});
