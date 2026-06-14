// tarot-deck.js — 78 張塔羅牌的結構資料（牌名、花色、編號、顯示符號）。
// 純資料、零 DOM。牌義文案在 tarot-data-texts.js，視覺在 tarot-card-svg.js。
// id 是穩定鍵：PNG 檔名、文案層 key、測試 fixture 都靠它。

// 四花色（小牌）。color 用於牌面花色符號與點綴。
export const SUITS = {
  wands:     { key: 'wands',     nameZh: '權杖', element: '火', domain: '行動與創造', color: '#E5A300' },
  cups:      { key: 'cups',      nameZh: '聖杯', element: '水', domain: '情感與關係', color: '#4fa6d5' },
  swords:    { key: 'swords',    nameZh: '寶劍', element: '風', domain: '思維與決策', color: '#7d8a99' },
  pentacles: { key: 'pentacles', nameZh: '錢幣', element: '土', domain: '資源與務實', color: '#b08d3e' },
};

const SUIT_ORDER = ['wands', 'cups', 'swords', 'pentacles'];

// 大牌 0–21
const MAJOR = [
  ['愚者', 'The Fool'], ['魔術師', 'The Magician'], ['女祭司', 'The High Priestess'],
  ['皇后', 'The Empress'], ['皇帝', 'The Emperor'], ['教皇', 'The Hierophant'],
  ['戀人', 'The Lovers'], ['戰車', 'The Chariot'], ['力量', 'Strength'],
  ['隱者', 'The Hermit'], ['命運之輪', 'Wheel of Fortune'], ['正義', 'Justice'],
  ['倒吊人', 'The Hanged Man'], ['死神', 'Death'], ['節制', 'Temperance'],
  ['惡魔', 'The Devil'], ['高塔', 'The Tower'], ['星星', 'The Star'],
  ['月亮', 'The Moon'], ['太陽', 'The Sun'], ['審判', 'Judgement'], ['世界', 'The World'],
];

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

// 小牌數字（1–10）與宮廷牌（11–14）
const RANK_ZH = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十',
  11: '侍者', 12: '騎士', 13: '皇后', 14: '國王' };
const RANK_EN = { 1: 'Ace', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight',
  9: 'Nine', 10: 'Ten', 11: 'Page', 12: 'Knight', 13: 'Queen', 14: 'King' };
const SUIT_EN = { wands: 'Wands', cups: 'Cups', swords: 'Swords', pentacles: 'Pentacles' };
// 角落顯示用的精簡符號
const RANK_BADGE = { 1: 'A', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
  11: '侍', 12: '騎', 13: '后', 14: '王' };

function pad2(n) { return String(n).padStart(2, '0'); }

function buildCards() {
  const cards = {};
  // 大牌
  MAJOR.forEach(([zh, en], i) => {
    cards[`major-${pad2(i)}`] = {
      id: `major-${pad2(i)}`, arcana: 'major', num: i, suit: null, rank: null,
      nameZh: zh, nameEn: en, badge: ROMAN[i],
    };
  });
  // 小牌
  SUIT_ORDER.forEach((suit) => {
    for (let r = 1; r <= 14; r++) {
      cards[`${suit}-${pad2(r)}`] = {
        id: `${suit}-${pad2(r)}`, arcana: 'minor', num: r, suit, rank: r,
        nameZh: `${SUITS[suit].nameZh}${RANK_ZH[r]}`,
        nameEn: r >= 2 && r <= 10 ? `${RANK_EN[r]} of ${SUIT_EN[suit]}`
          : (r === 1 ? `Ace of ${SUIT_EN[suit]}` : `${RANK_EN[r]} of ${SUIT_EN[suit]}`),
        badge: RANK_BADGE[r],
      };
    }
  });
  return cards;
}

export const CARDS = buildCards();

// 回傳全副 78 張牌的 id 陣列（給洗牌用）。
export function buildDeck() { return Object.keys(CARDS); }

export const DECK_SIZE = Object.keys(CARDS).length; // 78
