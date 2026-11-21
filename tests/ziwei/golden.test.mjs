// golden.test.mjs — 紫微排盤與獨立參考實作（tools/golden/ziwei_golden.py）逐筆比對。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { _injectIztro, computeZiwei } from '../../assets/js/ziwei/ziwei-engine.js';
import { GOLDEN_ZIWEI } from './fixtures-golden.mjs';

globalThis.self = globalThis.self || globalThis;
_injectIztro(createRequire(import.meta.url)('../../assets/vendor/iztro/iztro.min.js'));

const NAME = (n) => ({ 僕役: '交友' }[n] || n); // 同一宮的兩種通行稱呼
const sorted = (a) => [...a].sort();

for (const fx of GOLDEN_ZIWEI) {
  test(`golden：${fx.label}`, () => {
    const c = computeZiwei(fx.input);
    const e = fx.expected;
    assert.equal(c.soulBranch, e.soulBranch, '命宮');
    assert.equal(c.bodyBranch, e.bodyBranch, '身宮');
    assert.equal(c.fiveElementsClass, e.fiveElementsClass, '五行局');
    assert.equal(c.chineseDate.split(' ')[0].slice(0, 2), e.yearGZ, '年干支（春節分年）');
    const mut = ['祿', '權', '科', '忌'].map((k) => (c.birthMutagen.find((m) => m.mutagen === k) || {}).star);
    assert.deepEqual(mut, e.mutagen, '生年四化');
    for (const [br, p] of Object.entries(e.palaces)) {
      const got = c.palaces.find((x) => x.branch === br);
      assert.ok(got, `缺 ${br} 宮`);
      assert.equal(NAME(got.name), p.name, `${br} 宮名`);
      assert.equal(got.stem, p.stem, `${br} 宮干`);
      assert.deepEqual(sorted(got.major.map((s) => s.name)), sorted(p.major), `${br} 宮主星`);
      assert.deepEqual(got.decadal, p.decadal, `${br} 宮大限`);
    }
  });
}
