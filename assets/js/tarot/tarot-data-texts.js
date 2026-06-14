// tarot-data-texts.js — 78 張牌的「職場反思」原創牌義（四段結構），合併自五個花色檔。
// 每張牌：{ symbol 牌面象徵, work 職場連結, reflect[] 反思問題, action 一週行動, reversed 逆位視角 }
// 撰寫守則見 tools/tarot-writing-spec.md：不預測事件、不恐嚇、不宿命、逆位＝換角度、必要時轉介、全原創。
// 文案為史旺基工作室原創，與任何塔羅出版或占卜機構無涉（頁尾明示免責）。
import { MAJOR_TEXT } from './tarot-text-major.js';
import { WANDS_TEXT } from './tarot-text-wands.js';
import { CUPS_TEXT } from './tarot-text-cups.js';
import { SWORDS_TEXT } from './tarot-text-swords.js';
import { PENTACLES_TEXT } from './tarot-text-pentacles.js';

export const READINGS = {
  ...MAJOR_TEXT,
  ...WANDS_TEXT,
  ...CUPS_TEXT,
  ...SWORDS_TEXT,
  ...PENTACLES_TEXT,
};
