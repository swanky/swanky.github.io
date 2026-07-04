/**
 * 每日鎖（自我探索實驗室「行動儀式」類共用：今日一牌／今日五行／今日鳥籤）。
 *
 * 規則：以當地日界（YYYY-MM-DD）判定「今日」；跨日自動重置；當日可重抽有限次數。
 * 純邏輯函式（dayKey／isToday／canReroll）不碰 DOM／全域，可直接 node --test（傳入 now 做 date mock）。
 * loadDaily／saveDaily 為瀏覽器 localStorage 包裝——隱私：當日結果只存在使用者自己的瀏覽器，不上傳。
 *
 * 記錄 shape：{ date:'YYYY-MM-DD', value:<任意可序列化>, rerolls:number }
 */

export function dayKey(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isToday(record, now = new Date()) {
  return !!record && record.date === dayKey(now);
}

/** 是否還能重抽：新的一天一定可以；同一天則看 rerolls 是否已達上限。 */
export function canReroll(record, maxRerolls = 1, now = new Date()) {
  if (!isToday(record, now)) return true;
  return (record.rerolls || 0) < maxRerolls;
}

/** 讀今日記錄；不是今日（或無、或解析失敗）回 null。 */
export function loadDaily(storeKey, now = new Date()) {
  try {
    const raw = localStorage.getItem(storeKey);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return isToday(obj, now) ? obj : null;
  } catch (e) {
    return null;
  }
}

/** 寫今日記錄；隱私模式或容量滿時靜默失敗（回 false），不影響流程。 */
export function saveDaily(storeKey, value, rerolls = 0, now = new Date()) {
  try {
    localStorage.setItem(storeKey, JSON.stringify({ date: dayKey(now), value, rerolls }));
    return true;
  } catch (e) {
    return false;
  }
}
