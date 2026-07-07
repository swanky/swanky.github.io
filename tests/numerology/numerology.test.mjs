// 生命靈數引擎測試：純算術完全自驗。
// reduceToDigit 主數保留、lifePathNumber 已知樣本、12 鍵齊全＋四面向、禁詞掃描。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MASTER_NUMBERS, reduceToDigit, lifePathNumber, birthdayNumber, computeNumerology,
} from '../../assets/js/numerology/numerology-core.js';
import { NUM_TEXTS, buildProfile } from '../../assets/js/numerology/numerology-data-texts.js';

test('reduceToDigit：一般數字化約至個位', () => {
  assert.equal(reduceToDigit(19), 1);   // 19→10→1
  assert.equal(reduceToDigit(12), 3);
  assert.equal(reduceToDigit(9), 9);
  assert.equal(reduceToDigit(1990), 1); // 1990→19→10→1
  assert.equal(reduceToDigit(0), 0);
});

test('reduceToDigit：主數 11/22/33 不拆', () => {
  assert.equal(reduceToDigit(11), 11);
  assert.equal(reduceToDigit(22), 22);
  assert.equal(reduceToDigit(33), 33);
  assert.equal(reduceToDigit(29), 11);   // 29→11 停
  assert.equal(reduceToDigit(38), 11);   // 38→11 停
  assert.equal(reduceToDigit(1975), 22); // 1+9+7+5=22 停在主數
  assert.deepEqual(MASTER_NUMBERS, [11, 22, 33]);
});

test('lifePathNumber：已知樣本（含主數）', () => {
  assert.equal(lifePathNumber(1990, 5, 15), 3);  // 1+5+6=12→3
  assert.equal(lifePathNumber(1975, 5, 2), 11);  // 22+5+2=29→11（主數）
  assert.equal(lifePathNumber(2000, 1, 1), 4);   // 2+1+1=4
});

test('birthdayNumber：生日數（含主數）', () => {
  assert.equal(birthdayNumber(15), 6);
  assert.equal(birthdayNumber(29), 11);
  assert.equal(birthdayNumber(22), 22);
  assert.equal(birthdayNumber(4), 4);
});

test('computeNumerology：整組結構', () => {
  const r = computeNumerology({ y: 1975, mo: 5, d: 2 });
  assert.equal(r.lifePath, 11);
  assert.equal(r.birthday, 2);
  assert.equal(r.isMaster, true);
});

test('非法輸入拋錯', () => {
  assert.throws(() => lifePathNumber(1990, 13, 1));
  assert.throws(() => lifePathNumber(1990, 5, 32));
  assert.throws(() => birthdayNumber(0));
  assert.throws(() => reduceToDigit(-5));
});

test('12 鍵齊全、四面向非空', () => {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  assert.equal(Object.keys(NUM_TEXTS).length, 12);
  for (const k of keys) {
    const t = NUM_TEXTS[k];
    assert.ok(t, `缺鍵 ${k}`);
    for (const f of ['keyword', 'theme', 'strength', 'challenge', 'reminder']) {
      assert.ok(t[f] && t[f].length > 0, `鍵 ${k} 缺 ${f}`);
    }
  }
});

test('buildProfile 對應正確', () => {
  const p = buildProfile(3, 6);
  assert.equal(p.lifePath, 3);
  assert.equal(p.keyword, NUM_TEXTS[3].keyword);
  assert.ok(p.birthdayNote.includes('6'));
});

test('文案無吉凶恐嚇禁詞', () => {
  const banned = /(大凶|大吉|災難|喪|絕命|破財|血光|必然|注定|一定會|橫財)/;
  for (const k of Object.keys(NUM_TEXTS)) {
    const t = NUM_TEXTS[k];
    for (const f of ['keyword', 'theme', 'strength', 'challenge', 'reminder']) {
      assert.ok(!banned.test(t[f]), `鍵 ${k}.${f}: ${t[f]}`);
    }
  }
});
