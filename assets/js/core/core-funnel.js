// core-funnel.js — 付費導流共用層（各工具頁「深度解讀／預約引導」CTA 共用）。
// 收攏原本散落於 tarot/iching/numerology 三個 *-ui.js 的信箱字面值與 mailto 組法。
export const CONTACT = 'swanky.hsiao@gmail.com';
export function inquiryMailto(subject, body) {
  return `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
