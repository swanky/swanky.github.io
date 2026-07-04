/**
 * 奇門九宮格渲染元件（DOM）。Phase 1 僅用 demo 模式；Phase 5 正式排盤沿用同介面。
 *
 * renderQimenGrid(container, gridData, { mode })
 *   container : DOM element
 *   gridData  : { question?, palaces:[9] }（shape 見 qimen-demo-data.js）
 *   opts.mode : 'demo'（半透明「示意資料」浮水印）| 'live'
 *
 * tone → badge 色：auspicious=金（有利窗口）/ caution=灰藍（需謹慎）/ neutral=中性灰。
 * 刻意不用紅色凶煞視覺，不製造恐嚇感（見規劃 §6.4 與 §13）。
 */

const TONE_LABEL = { auspicious: '有利窗口', caution: '需謹慎', neutral: '中性' };

function setText(el, sel, value) {
  const node = el.querySelector(sel);
  if (node) node.textContent = value == null ? '' : value;
}

export function renderQimenGrid(container, gridData, opts = {}) {
  if (!container) return;
  const mode = opts.mode || 'demo';
  const palaces = (gridData && gridData.palaces) || [];
  container.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'qimen-grid' + (mode === 'demo' ? ' is-demo' : '');
  if (mode === 'demo') grid.setAttribute('data-watermark', '示意資料');

  palaces.forEach((p) => {
    const cell = document.createElement('div');
    if (p.center) {
      cell.className = 'qimen-cell qimen-center';
      cell.innerHTML = '<span class="qimen-center-label">中宮 · 用神</span><p class="qimen-center-summary"></p>';
      setText(cell, '.qimen-center-summary', p.summary || (gridData && gridData.question) || '');
    } else {
      const tone = p.tone || 'neutral';
      cell.className = 'qimen-cell tone-' + tone;
      cell.setAttribute('tabindex', '0');
      cell.innerHTML =
        '<div class="qimen-cell-head"><span class="qc-dir"></span><span class="qc-palace"></span></div>' +
        '<div class="qimen-cell-main"><span class="qc-men"></span><span class="qc-star"></span></div>' +
        '<div class="qimen-cell-sub"><span class="qc-shen"></span><span class="qc-gan"></span></div>' +
        '<span class="qimen-tone"></span>' +
        '<div class="qimen-tip" role="tooltip"><b class="qt-title"></b><span class="qt-note"></span></div>';
      setText(cell, '.qc-dir', p.direction);
      setText(cell, '.qc-palace', p.palace);
      setText(cell, '.qc-men', p.men);
      setText(cell, '.qc-star', p.star);
      setText(cell, '.qc-shen', p.shen);
      setText(cell, '.qc-gan', (p.gan || []).join(' '));
      setText(cell, '.qimen-tone', TONE_LABEL[tone] || '');
      setText(cell, '.qt-title', [p.men, p.star, p.shen].filter(Boolean).join(' · '));
      setText(cell, '.qt-note', p.note);
      // 手機點按切換 tooltip（桌機靠 :hover / :focus-within）
      cell.addEventListener('click', () => {
        const open = cell.classList.contains('is-open');
        grid.querySelectorAll('.qimen-cell.is-open').forEach((c) => c.classList.remove('is-open'));
        if (!open) cell.classList.add('is-open');
      });
    }
    grid.appendChild(cell);
  });

  container.appendChild(grid);
}
