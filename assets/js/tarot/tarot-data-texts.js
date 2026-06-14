// tarot-data-texts.js — 78 張牌的多領域反思牌義。
// 共用：symbol（牌面象徵）、reversed（逆位視角）。
// 四個領域視角 domains.{work,love,life,money}，每個＝{ connect 對照你的處境, reflect[] 反思問題, action 一週行動 }。
// work 來自既有 tarot-text-*.js；love/life/money 來自 tarot-lens-*.js（撰寫守則見 tools/tarot-lens-spec.md）。
// 全原創、不占卜、不預測；感情不讀對方心意、財務非投資建議。頁尾明示免責。
import { MAJOR_TEXT } from './tarot-text-major.js';
import { WANDS_TEXT } from './tarot-text-wands.js';
import { CUPS_TEXT } from './tarot-text-cups.js';
import { SWORDS_TEXT } from './tarot-text-swords.js';
import { PENTACLES_TEXT } from './tarot-text-pentacles.js';
import { MAJOR_LENS } from './tarot-lens-major.js';
import { WANDS_LENS } from './tarot-lens-wands.js';
import { CUPS_LENS } from './tarot-lens-cups.js';
import { SWORDS_LENS } from './tarot-lens-swords.js';
import { PENTACLES_LENS } from './tarot-lens-pentacles.js';

const BASE = { ...MAJOR_TEXT, ...WANDS_TEXT, ...CUPS_TEXT, ...SWORDS_TEXT, ...PENTACLES_TEXT };
const LENS_PARTS = [MAJOR_LENS, WANDS_LENS, CUPS_LENS, SWORDS_LENS, PENTACLES_LENS];
function domainMap(d) { return Object.assign({}, ...LENS_PARTS.map((p) => (p && p[d]) || {})); }
const LOVE = domainMap('love');
const LIFE = domainMap('life');
const MONEY = domainMap('money');

export const READINGS = {};
for (const id of Object.keys(BASE)) {
  const b = BASE[id];
  READINGS[id] = {
    symbol: b.symbol,
    reversed: b.reversed,
    domains: {
      work:  { connect: b.work, reflect: b.reflect, action: b.action },
      love:  LOVE[id]  || null,
      life:  LIFE[id]  || null,
      money: MONEY[id] || null,
    },
  };
}
