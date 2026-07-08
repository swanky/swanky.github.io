// hd-astro.js — 人類圖天文層的薄相容層（實作已上移至 core/core-astro.js）。
// 通用天文函式一律 re-export 自 core-astro；本檔僅保留 HD 專屬的 designTimeMs（88° design arc 領域邏輯）。
// hd-engine／hd-judge／hd-timezone／hd-ui／測試 import 路徑不變（吃 re-export）。
import {
  astro, sunLonAt, norm360, wrapPM180, HdError,
} from '../core/core-astro.js';

export {
  _injectAstronomy, HdError, PLANET_IDS,
  sunLonAt, trueNodeLonAt, meanNodeLonAt, positionsAt,
} from '../core/core-astro.js';

// ---- Design 時刻：出生前太陽黃經回退 88° ------------------------------

const DAY_MS = 86400000;

export function designTimeMs(birthUtcMs) {
  const Ast = astro();
  const target = norm360(sunLonAt(birthUtcMs) - 88);
  // 太陽視速度 0.9533–1.0197°/日 → Design 時刻必在出生前 86.2–92.4 天
  const t = Ast.SearchSunLongitude(target, new Date(birthUtcMs - 94 * DAY_MS), 10);
  let resultMs;
  if (t) {
    resultMs = t.date.getTime();
  } else {
    // 備援：二分搜索（g(t) = wrap±180(sunLon(t) − target) 在區間內嚴格遞增）
    let lo = birthUtcMs - 95 * DAY_MS;
    let hi = birthUtcMs - 83 * DAY_MS;
    if (wrapPM180(sunLonAt(lo) - target) > 0 || wrapPM180(sunLonAt(hi) - target) < 0) {
      throw new HdError('DESIGN_SEARCH_FAILED', '無法求解設計時刻，請確認出生日期是否在 1900–2100 年範圍內。');
    }
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (wrapPM180(sunLonAt(mid) - target) < 0) lo = mid; else hi = mid;
    }
    resultMs = (lo + hi) / 2;
  }
  const err = Math.abs(wrapPM180(sunLonAt(resultMs) - target));
  if (err > 1e-3) {
    throw new HdError('DESIGN_SEARCH_FAILED', '設計時刻求解精度不足，請稍後再試。');
  }
  return resultMs;
}
