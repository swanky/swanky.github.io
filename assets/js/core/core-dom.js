// core-dom.js — 自我探索工具共用的防禦式 DOM helper（各工具頁入口 ES module 共用）。
// 防呆寫入：容器不存在就略過、不拋錯，避免部署期間「新版 JS × 舊快取 HTML」缺少新容器時
// 撞上 null 而中斷整個工具。各入口 import 需要的子集即可（純瀏覽器端；document/window 僅在呼叫時取用）。
export const $ = (id) => document.getElementById(id);
export const setHTML = (id, html) => { const e = $(id); if (e) e.innerHTML = html; };
export const setText = (id, txt) => { const e = $(id); if (e) e.textContent = txt; };
export const setVal = (id, v) => { const e = $(id); if (e) e.value = v; };
export const show = (id, on) => { const e = $(id); if (e) e.style.display = on ? '' : 'none'; };
export const on = (id, ev, fn) => { const e = $(id); if (e) e.addEventListener(ev, fn); };
export const gtag = (...a) => { if (window.gtag) window.gtag(...a); };
export const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
