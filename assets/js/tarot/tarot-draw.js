// tarot-draw.js — 抽牌引擎（零 DOM，可 Node 測試）。
// 用 tarot-rng 的密碼學亂數洗牌、抽牌、決定正逆位。
import { buildDeck } from './tarot-deck.js';
import { secureShuffle, secureBool } from './tarot-rng.js';
import { SPREADS } from './tarot-spreads.js';

// 抽一個牌陣。回傳每個位置一張牌：
//   { slot, slotLabel, frame, cardId, reversed }
// 同一張牌不會在一次抽牌中重複（洗牌後依序取）。
export function drawSpread(spreadKey, opts = {}) {
  const allowReversed = opts.allowReversed !== false; // 預設允許逆位
  const spread = SPREADS[spreadKey];
  if (!spread) throw new Error('drawSpread: 未知牌陣 ' + spreadKey);
  const deck = secureShuffle(buildDeck());
  return spread.slots.map((slot, i) => ({
    slot: slot.key,
    slotLabel: slot.label,
    frame: slot.frame,
    cardId: deck[i],
    reversed: allowReversed ? secureBool() : false,
  }));
}
