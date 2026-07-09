// golden.test.mjs — 八字端到端 golden：出生資料直進 computePillarsFromBirth（跨與頁面相同的
// 時區→UTC 縫），與 ≥3 排盤站交叉採集的四柱干支比對。fixture 空陣列時整檔 skip。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../_setup-astronomy.mjs';
import { computePillarsFromBirth } from '../../assets/js/bazi/bazi-pillars.js';
import { GOLDEN_BAZI } from './fixtures-golden.mjs';

test('golden 八字四柱（外部排盤站交叉採集）', { skip: GOLDEN_BAZI.length === 0 && '尚無人工採集 fixture' }, () => {
  for (const fx of GOLDEN_BAZI) {
    const c = computePillarsFromBirth(fx.input);
    const gz = (p) => p.ganName + p.zhiName;
    assert.equal(gz(c.pillars.year), fx.expected.year, `${fx.label} 年柱`);
    assert.equal(gz(c.pillars.month), fx.expected.month, `${fx.label} 月柱`);
    assert.equal(gz(c.pillars.day), fx.expected.day, `${fx.label} 日柱`);
    if (fx.expected.hour) assert.equal(gz(c.pillars.hour), fx.expected.hour, `${fx.label} 時柱`);
  }
});
