// 奇門示意盤：資料結構完整性 + 禁詞掃描（零 DOM，可直接 node --test）。
// 守護：9 宮齊全、8 門/9 星/8 神不重複、tone 合法、文案不含恐嚇字眼。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QIMEN_DEMO } from '../../assets/js/qimen/qimen-demo-data.js';

const TONES = new Set(['auspicious', 'caution', 'neutral']);
// §13.3 語氣鐵律基礎禁詞（注意：八門術語「死門／驚門」不是禁詞，故用完整詞組比對）
const BANNED = ['準到可怕', '命中註定', '一定成功', '必定破財', '投資必賺', '神準', '開運必勝', '桃花爆棚', '財庫大開', '厄運', '報應', '劫數', '凶煞', '血光', '大凶'];

test('示意盤共 9 宮', () => {
  assert.equal(QIMEN_DEMO.palaces.length, 9);
});

test('恰好一個中宮，其餘 8 宮元素齊全', () => {
  const centers = QIMEN_DEMO.palaces.filter((p) => p.center);
  assert.equal(centers.length, 1);
  assert.ok(centers[0].summary && centers[0].summary.length > 0);

  const cells = QIMEN_DEMO.palaces.filter((p) => !p.center);
  assert.equal(cells.length, 8);
  for (const p of cells) {
    assert.ok(p.palace, 'palace 缺');
    assert.ok(p.direction, 'direction 缺');
    assert.ok(p.men, 'men 缺');
    assert.ok(p.star, 'star 缺');
    assert.ok(p.shen, 'shen 缺');
    assert.ok(Array.isArray(p.gan) && p.gan.length > 0, 'gan 缺');
    assert.ok(TONES.has(p.tone), `tone 不合法: ${p.tone}`);
    assert.ok(p.note && p.note.length >= 8, 'note 太短');
  }
});

test('八門、九星、八神在 8 宮內各不重複（盤面自洽）', () => {
  const cells = QIMEN_DEMO.palaces.filter((p) => !p.center);
  assert.equal(new Set(cells.map((p) => p.men)).size, 8);
  assert.equal(new Set(cells.map((p) => p.star)).size, 8);
  assert.equal(new Set(cells.map((p) => p.shen)).size, 8);
});

test('示意盤文案不含禁用恐嚇字眼', () => {
  const text = JSON.stringify(QIMEN_DEMO);
  for (const w of BANNED) {
    assert.ok(!text.includes(w), `不應含「${w}」`);
  }
});
