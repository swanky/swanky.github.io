// tarot-overlay.js — 兩個塔羅頁共用的極簡 overlay/lightbox 基底（工具頁的卡片放大 modal、對照頁的牌面 lightbox）。
// 統一外殼行為：單例 lazy 建立、is-open 切換、body 捲動鎖（save/restore）、
// Esc／點背景／點關閉鈕關閉、背景以原生 inert 隔離（Tab 焦點鎖在 overlay 內、背景對螢幕報讀隱藏，取代手寫 focus trap）、
// 關閉後把焦點還原到開啟時的觸發元素。各頁只提供 id／className／內層 HTML 與「開啟時填內容」邏輯，外殼一律走這裡。
export function createOverlay({ id, className, innerHTML, closeSelector }) {
  let ov = null;
  let lastFocus = null;
  let overflowPrev = '';
  let inerted = [];

  function setInert(on) {
    if (on) {
      if (inerted.length) return;
      inerted = Array.from(document.body.children).filter(
        (el) => el !== ov && !el.hasAttribute('inert'));
      inerted.forEach((el) => el.setAttribute('inert', ''));
    } else {
      inerted.forEach((el) => el.removeAttribute('inert'));
      inerted = [];
    }
  }

  function close() {
    if (ov) ov.classList.remove('is-open');
    setInert(false);
    document.body.style.overflow = overflowPrev;
    overflowPrev = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  function ensure() {
    if (ov) return ov;
    ov = document.createElement('div');
    ov.id = id;
    ov.className = className;
    ov.innerHTML = innerHTML;
    document.body.appendChild(ov);
    ov.addEventListener('click', (e) => {
      if (e.target === ov || (closeSelector && e.target.closest(closeSelector))) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && ov.classList.contains('is-open')) close();
    });
    return ov;
  }

  // open 只切換外殼狀態（記住觸發元素 → is-open → 鎖捲動 → 背景 inert）；
  // 內容由呼叫端在 ensure() 後自行填入，需在 open() 之後做的（如捲動歸零、聚焦）也由呼叫端處理。
  function open(trigger) {
    ensure();
    lastFocus = trigger || document.activeElement;
    overflowPrev = document.body.style.overflow;
    ov.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setInert(true);
    return ov;
  }

  return { ensure, open, close };
}
