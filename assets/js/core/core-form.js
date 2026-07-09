// core-form.js — 自我探索實驗室共用表單填充（_includes/birth-form.html 的 JS 對應）。
// 原 astro-ui / bazi-ui 各養一份 fillSelect / fillCities（逐字重複），收攏至此；
// 紫微（roadmap Phase 6）等新 adapter 直接 fillBirthSelects(prefix) 即可。
import { $, esc } from './core-dom.js';
import { CITIES } from './core-cities.js';

export function fillSelect(id, from, to, pad) {
  const el = $(id);
  if (!el) return;
  let html = '';
  for (let i = from; i <= to; i++) html += `<option value="${i}">${pad ? String(i).padStart(2, '0') : i}</option>`;
  el.innerHTML = html;
}

// requireLatLon：星座命盤需經緯度算宮位，過濾掉沒有座標的城市；八字只需時區與經度、不過濾。
export function fillCities(id, { requireLatLon = false } = {}) {
  const el = $(id);
  if (!el) return;
  const groups = {};
  CITIES.forEach((c, i) => {
    if (requireLatLon && c.lat == null) return;
    (groups[c.group] = groups[c.group] || []).push({ i, zh: c.zh });
  });
  let html = '';
  for (const g of Object.keys(groups)) {
    html += `<optgroup label="${esc(g)}">`;
    for (const { i, zh } of groups[g]) html += `<option value="${i}">${esc(zh)}</option>`;
    html += '</optgroup>';
  }
  el.innerHTML = html;
}

// 一次填好 birth-form.html 的年月日時分＋城市。
export function fillBirthSelects(prefix, { requireLatLon = false } = {}) {
  const now = new Date();
  fillSelect(`${prefix}-y`, 1920, now.getFullYear(), false);
  fillSelect(`${prefix}-mo`, 1, 12, false);
  fillSelect(`${prefix}-d`, 1, 31, false);
  fillSelect(`${prefix}-h`, 0, 23, true);
  fillSelect(`${prefix}-mi`, 0, 59, true);
  fillCities(`${prefix}-city`, { requireLatLon });
}
