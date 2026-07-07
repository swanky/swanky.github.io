/**
 * 奇門頁瀏覽器入口（Phase 1 示意版）。
 * - 把任何 [data-qimen-demo] 容器渲染成示意九宮格。
 * - /qimen/tool/ 的示意表單：送出後只顯示「正式排盤開發中」說明，不做任何排盤。
 * 由 _includes/scripts.html 於 use_qimen_demo 時載入。
 */
import { renderQimenGrid } from './qimen-grid.js';
import { QIMEN_DEMO } from './qimen-demo-data.js';

function init() {
  document.querySelectorAll('[data-qimen-demo]').forEach((el) => {
    renderQimenGrid(el, QIMEN_DEMO, { mode: 'demo' });
  });

  const form = document.getElementById('qimen-demo-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const notice = document.getElementById('qimen-demo-notice');
      if (notice) {
        notice.style.display = 'block';
        notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
