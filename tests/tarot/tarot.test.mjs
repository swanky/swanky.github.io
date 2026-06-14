// 職場塔羅：純邏輯層測試（零 DOM，可直接 node --test）。
// 守護：牌堆完整、洗牌公平、抽牌正確、78 張牌義齊全、無禁用恐嚇詞。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secureRandomInt, secureBool, secureShuffle } from '../../assets/js/tarot/tarot-rng.js';
import { CARDS, buildDeck, DECK_SIZE } from '../../assets/js/tarot/tarot-deck.js';
import { SPREADS, SPREAD_KEYS, recommendSpread, TOPIC_KEYS, recommendTopic } from '../../assets/js/tarot/tarot-spreads.js';
import { drawSpread } from '../../assets/js/tarot/tarot-draw.js';
import { READINGS } from '../../assets/js/tarot/tarot-data-texts.js';

test('牌堆＝78 張、id 不重複', () => {
  const ids = buildDeck();
  assert.equal(ids.length, 78);
  assert.equal(DECK_SIZE, 78);
  assert.equal(new Set(ids).size, 78);
});

test('secureRandomInt 落在範圍內、邊界正確', () => {
  for (let i = 0; i < 3000; i++) {
    const x = secureRandomInt(78);
    assert.ok(Number.isInteger(x) && x >= 0 && x < 78);
  }
  assert.equal(secureRandomInt(1), 0);
  assert.throws(() => secureRandomInt(0));
  assert.equal(typeof secureBool(), 'boolean');
});

test('secureShuffle 是排列（不重複、不遺漏）', () => {
  const deck = buildDeck();
  for (let i = 0; i < 50; i++) {
    const s = secureShuffle(deck);
    assert.equal(s.length, deck.length);
    assert.deepEqual([...s].sort(), [...deck].sort());
  }
});

test('drawSpread：張數正確、牌不重複、欄位齊全', () => {
  for (const key of SPREAD_KEYS) {
    const n = SPREADS[key].count;
    for (let i = 0; i < 30; i++) {
      const d = drawSpread(key);
      assert.equal(d.length, n);
      assert.equal(new Set(d.map((c) => c.cardId)).size, n);
      for (const c of d) {
        assert.ok(CARDS[c.cardId], '有效牌 ' + c.cardId);
        assert.equal(typeof c.reversed, 'boolean');
        assert.ok(c.slotLabel && c.frame);
      }
    }
  }
});

test('drawSpread allowReversed:false → 全部正位', () => {
  const d = drawSpread('five', { allowReversed: false });
  assert.ok(d.every((c) => c.reversed === false));
});

test('每張牌都有 symbol/reversed 與四領域完整視角', () => {
  for (const id of buildDeck()) {
    const r = READINGS[id];
    assert.ok(r, '缺牌義：' + id);
    assert.ok(r.symbol && r.symbol.length > 10, 'symbol 太短：' + id);
    assert.ok(r.reversed && r.reversed.length > 8, 'reversed 太短：' + id);
    assert.ok(r.domains, '缺 domains：' + id);
    for (const dk of TOPIC_KEYS) {
      const d = r.domains[dk];
      assert.ok(d, `缺領域 ${dk}：${id}`);
      assert.ok(d.connect && d.connect.length > 8, `${dk}.connect 太短：${id}`);
      assert.ok(Array.isArray(d.reflect) && d.reflect.length >= 2 && d.reflect.length <= 3, `${dk}.reflect 需 2-3 題：${id}`);
      d.reflect.forEach((q) => assert.ok(q && q.length > 4, `${dk}.reflect 問題太短：${id}`));
      assert.ok(d.action && d.action.length > 8, `${dk}.action 太短：${id}`);
    }
  }
});

test('牌義無孤兒、總數＝78', () => {
  const ids = new Set(buildDeck());
  for (const id of Object.keys(READINGS)) assert.ok(ids.has(id), '孤兒牌義：' + id);
  assert.equal(Object.keys(READINGS).length, 78);
});

test('全部牌義（含四領域）不含禁用恐嚇字眼', () => {
  const banned = ['厄運', '災難', '注定', '命中註定', '報應', '劫數'];
  for (const [id, r] of Object.entries(READINGS)) {
    const parts = [r.symbol, r.reversed];
    for (const dk of TOPIC_KEYS) {
      const d = r.domains[dk];
      if (d) parts.push(d.connect, d.action, ...(d.reflect || []));
    }
    const blob = parts.join(' ');
    for (const w of banned) assert.ok(!blob.includes(w), `禁用字「${w}」出現在 ${id}`);
  }
});

test('recommendTopic 依關鍵字對應主題', () => {
  assert.equal(recommendTopic('我跟男友最近常吵架'), 'love');
  assert.equal(recommendTopic('該不該把存款拿去投資'), 'money');
  assert.equal(recommendTopic('要不要換工作、跟主管談談'), 'work');
  assert.equal(recommendTopic('我最近覺得很迷惘'), 'life');
});

test('recommendSpread 依複雜度對應牌陣', () => {
  assert.equal(recommendSpread('').key, 'single');
  assert.equal(recommendSpread('該不該換工作').key, 'three');
  const tangled = '我跟主管、同事之間的合作很複雜，專案同時有好多事要處理，一方面想推進、一方面又卡很久理不清';
  assert.equal(recommendSpread(tangled).key, 'five');
});
