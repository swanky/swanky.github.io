// tarot-art-manifest.js — 已備妥 AI 牌面圖的卡片 id 清單。
// 用法：每用 ChatGPT Image 生好一張，存成 assets/img/tarot/{id}.jpg（id 見 tarot-deck.js；建議先壓到約 768px 寬、JPG 品質 ~85），
// 再把該 id 加進下面的 ART_IDS，這張牌就會自動改用你的圖（套金色品牌框＋牌名），未列入的維持現有素牌面。
export const ART_DIR = '/assets/img/tarot/';
export const ART_IDS = new Set([
  'major-00', // 愚者 The Fool
  'major-01', // 魔術師 The Magician
  'major-17', // 星星 The Star（暫為舊版，待換 ink）
  // 生好一張就加一個 id
  'major-02',
  'major-03',
  'major-04',
  'major-05',
  'major-06',
  'major-07',
  'major-08',
  'major-09',
  'major-10',
  'major-11',
  'major-12',
  'major-13',
  'major-14',
  'major-15',
  'major-16',
  'major-18',
  'major-19',
  'major-20',
  'major-21',
  'wands-01',
  'wands-02',
  'wands-03',
  'wands-04',
  'wands-05',
]);
