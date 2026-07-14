// tarot-journal-store.js — 本機塔羅反思 Journal 的資料層（localStorage，純瀏覽器、零後端、零帳號）。
// 抽牌頁（tarot-ui）負責寫入一則決策備忘錄；Journal 頁（tarot-journal）負責讀取、七日回顧、統計、匯出與刪除。
// 隱私：所有資料只存在使用者這台裝置的瀏覽器，不上傳、不同步。提供一鍵完整刪除。
// schema 版本化 + 遷移策略：讀取時若版本較舊會就地升級，故未來改結構不會讓舊資料壞掉。
const STORE_KEY = 'swanky-tarot-journal';
export const SCHEMA_VERSION = 1;

function emptyStore() { return { v: SCHEMA_VERSION, entries: [] }; }

// 遷移：把任意舊/損壞結構升級到目前 schema。v1 為首版，僅做防禦性正規化並預留 while 升級鏈。
function migrate(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.entries)) return emptyStore();
  let d = data;
  if (typeof d.v !== 'number') d = { ...d, v: 1 };
  // while (d.v < SCHEMA_VERSION) { ... 逐版升級 ... d.v++; }  // 之後改結構時在此加升級步驟
  d.v = SCHEMA_VERSION;
  // 正規化每則 entry 的必要欄位，避免舊資料缺鍵造成頁面崩潰。
  d.entries = d.entries.filter((e) => e && typeof e === 'object').map((e) => ({
    id: e.id || ('e' + Math.random().toString(36).slice(2)),
    created: e.created || '',
    dateText: e.dateText || '',
    reviewDate: e.reviewDate || '',
    question: e.question || '',
    topicLabel: e.topicLabel || '',
    spreadName: e.spreadName || '',
    deckLabel: e.deckLabel || '',
    cards: Array.isArray(e.cards) ? e.cards : [],
    sections: e.sections && typeof e.sections === 'object' ? e.sections : {},
    review: e.review && typeof e.review === 'object' ? e.review : null,
  }));
  return d;
}

export function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return emptyStore();
    const migrated = migrate(JSON.parse(raw));
    return migrated;
  } catch (e) { return emptyStore(); }
}

function persist(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); return true; }
  catch (e) { return false; } // 容量滿或隱私模式禁寫：靜默失敗，呼叫方以回傳值判斷
}

// 由一份 memo（tarot-memo 的 {meta, sections}）新增一則 Journal。回傳新 entry（含 id）。
export function addEntry(memo, opts = {}) {
  const data = load();
  const m = memo.meta || {};
  const entry = {
    id: opts.id || ('e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
    created: opts.created || new Date().toISOString(),
    dateText: m.dateText || '',
    reviewDate: m.reviewDate || '',
    question: m.question || '',
    topicLabel: m.topicLabel || '',
    spreadName: m.spreadName || '',
    deckLabel: m.deckLabel || '',
    cards: (m.cards || []).map((c) => ({ slotLabel: c.slotLabel || '', name: c.name || '' })),
    sections: { ...memo.sections },
    review: null,
  };
  data.entries.push(entry);
  persist(data);
  return entry;
}

// 取全部 entries，最新在前。
export function getEntries() { return load().entries.slice().reverse(); }

export function deleteEntry(id) {
  const data = load();
  data.entries = data.entries.filter((e) => e.id !== id);
  return persist(data);
}

export function clearAll() {
  try { localStorage.removeItem(STORE_KEY); return true; } catch (e) { return false; }
}

// 標記某則已完成七日回顧。review = { q1, q2, q3, reviewedDate }。
export function markReviewed(id, review) {
  const data = load();
  const e = data.entries.find((x) => x.id === id);
  if (!e) return false;
  e.review = { done: true, reviewedDate: review.reviewedDate || '', q1: review.q1 || '', q2: review.q2 || '', q3: review.q3 || '' };
  return persist(data);
}

// 統計：完成幾次反思（＝entries 數）、完成幾次回顧、目前可回顧（到期未回顧）幾則。
export function stats(todayYmd) {
  const entries = load().entries;
  const reviews = entries.filter((e) => e.review && e.review.done).length;
  let due = 0;
  if (todayYmd) {
    for (const e of entries) {
      const ymd = (e.reviewDate || '').replace(/[^0-9]/g, '');
      if (ymd && ymd <= todayYmd && !(e.review && e.review.done)) due++;
    }
  }
  return { reflections: entries.length, reviews, due };
}

// 完整匯出（可攜、含所有欄位）。呼叫方負責觸發下載。
export function exportJson() { return JSON.stringify(load(), null, 2); }
