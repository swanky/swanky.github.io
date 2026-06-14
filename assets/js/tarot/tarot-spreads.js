// tarot-spreads.js — 牌陣定義 + 依問題複雜度建議牌陣（純啟發式、零 DOM、零 AI）。
// 牌陣位置帶「職場語意 label」與「frame 引導句」，呼應職場反思定位。
// 刻意不提供凱爾特十字：手機版面難排、最像算命；深盤留付費。
// 三張刻意用「處境／阻力／下一步」而非「過去／現在／未來」，避免落入預測未來。

export const SPREADS = {
  single: {
    key: 'single', nameZh: '單張・聚焦提醒', count: 1,
    blurb: '問題很聚焦時，一張牌給你一個清楚的提醒。',
    slots: [
      { key: 'focus', label: '此刻的提醒', frame: '這張牌先照見你當下最該被看見的——' },
    ],
  },
  three: {
    key: 'three', nameZh: '三張・處境推進', count: 3,
    blurb: '有一個明確處境想推進時，看「現在／阻力／下一步」。',
    slots: [
      { key: 'situation', label: '現在的處境', frame: '你現在站的位置，這張牌讀到的是——' },
      { key: 'obstacle', label: '卡住你的阻力', frame: '真正卡住你的，可能是——' },
      { key: 'next', label: '下一步可以怎麼施力', frame: '若往前一步，這張牌建議的施力點是——' },
    ],
  },
  five: {
    key: 'five', nameZh: '五張・全局盤點', count: 5,
    blurb: '事情牽涉多方、比較糾結時，做一次全局盤點。',
    slots: [
      { key: 'core', label: '核心議題', frame: '這件事真正的核心，這張牌讀到的是——' },
      { key: 'self', label: '你的位置與狀態', frame: '你自己在其中的狀態是——' },
      { key: 'external', label: '外在影響（他人／環境）', frame: '你身處的環境與他人帶來的影響是——' },
      { key: 'obstacle', label: '要鬆開的阻力', frame: '最需要被你鬆開的卡點是——' },
      { key: 'next', label: '可以施力的下一步', frame: '你現在最能使上力的地方是——' },
    ],
  },
};

export const SPREAD_KEYS = ['single', 'three', 'five'];

// 依問題文字的複雜度建議牌陣。回傳 { key, reason }。使用者可手動覆蓋。
export function recommendSpread(question) {
  const q = (question || '').trim();
  if (!q) {
    return { key: 'single', reason: '先輸入你想問的事，我會依問題的複雜度幫你挑一個牌陣。' };
  }
  const len = q.length;
  const multiClause = /[，,、；;。]/.test(q) && len >= 22;
  const choice = /(還是|或是|或|要不要|該不該|猶豫|抉擇|選擇|兩難|哪一個|哪個)/.test(q);
  const tangled = /(糾結|複雜|好多|同時|一方面|另一方面|卡很久|理不清|千頭萬緒|很多事|不知道從何)/.test(q);
  const relational = /(團隊|同事|主管|老闆|部屬|下屬|夥伴|對方|他們|跨部門|關係|人際)/.test(q);

  let score = 0;
  if (multiClause) score += 1;
  if (choice) score += 1;
  if (tangled) score += 2;
  if (relational) score += 1;
  if (len >= 42) score += 1;

  if (score >= 3) {
    return { key: 'five', reason: '你的問題牽涉的面向比較多、也比較糾結——用五張牌做一次全局盤點，看清核心、環境與你能施力的地方。' };
  }
  if (score >= 1 || len >= 16) {
    return { key: 'three', reason: '這個問題有一個明確的處境想往前推——用三張牌看「現在的處境／卡住的阻力／下一步」剛剛好。' };
  }
  return { key: 'single', reason: '你的問題很聚焦——用單張牌給你一個清楚的提醒就夠了。' };
}

// ---- 主題領域（決定用哪一套牌義視角）----
export const TOPICS = {
  work:  { key: 'work',  label: '職場・職涯', hint: '工作、職涯、帶人、決策' },
  love:  { key: 'love',  label: '感情・關係', hint: '伴侶、曖昧、家人、友誼' },
  life:  { key: 'life',  label: '生活・自我', hint: '方向、習慣、內在狀態' },
  money: { key: 'money', label: '財務・抉擇', hint: '金錢觀、風險、重大取捨' },
};
export const TOPIC_KEYS = ['work', 'love', 'life', 'money'];

// 依問題文字猜測主題（使用者可手動覆蓋）。先比對感情／財務／職場，皆無則歸生活。
export function recommendTopic(question) {
  const q = (question || '').trim();
  if (!q) return 'life';
  if (/(男友|女友|男朋友|女朋友|伴侶|對象|曖昧|喜歡的人|愛情|戀|分手|復合|前任|前男友|前女友|感情|另一半|老公|老婆|配偶|結婚|離婚|暗戀|告白|劈腿|外遇|家人|父母|爸媽|孩子|朋友|友情)/.test(q)) return 'love';
  if (/(錢|薪水|薪資|加薪|投資|理財|買房|買車|財務|資金|報酬|存款|花費|負債|貸款|風險|創業|成本|預算|收入|金錢|破產|股票|基金)/.test(q)) return 'money';
  if (/(工作|職場|主管|老闆|老板|同事|部屬|下屬|專案|職涯|升遷|轉職|跳槽|團隊|加班|面試|離職|上班|績效|客戶|簡報|KPI)/.test(q)) return 'work';
  return 'life';
}
