// tarot-card-image.js — 以 AI 牌面圖（assets/img/tarot/{id}.png）為主視覺，套金色品牌框＋牌名緞帶。
// 沒有圖的牌（不在 tarot-art-manifest 的 ART_IDS）→ 回退到現有素牌面 tarot-card-svg，故未生圖前畫面不變。
// 同一份 framedImageInner 供「頁面顯示」與「PNG 匯出」共用（匯出時 href 改傳 dataURL）。
import { faceSvg as plainFaceSvg, backSvg } from './tarot-card-svg.js';
import { ART_IDS, ART_DIR } from './tarot-art-manifest.js';
import { buildDeck } from './tarot-deck.js';

// 牌組登錄表：每個牌組＝一個藝術圖來源目錄 + 具備圖的牌 id 集合。
// uniform＝墨線復古制服女孩（部分牌用 AI 圖、其餘回退素牌面，見 tarot-art-manifest）。
// clonex＝Cute Luxe Cyber Tarot，78 張全數具備圖（assets/img/tarot-clonex/，檔名與 uniform 一致）。
export const DECKS = {
  uniform: { key: 'uniform', dir: ART_DIR, ids: ART_IDS, label: 'Uniform Girl Tarot', labelZh: '制服女孩牌組' },
  clonex:  { key: 'clonex', dir: '/assets/img/tarot-clonex/', ids: new Set(buildDeck()), label: 'CloneX Cute Luxe Cyber Tarot', labelZh: 'CloneX Cute Luxe Cyber Tarot' },
};
export const DECK_KEYS = ['uniform', 'clonex'];
function deckOf(deck) { return DECKS[deck] || DECKS.uniform; }

const FACE_W = 240;
const FACE_H = 360;
const GOLD = '#E5A300';
const GOLD_DK = '#b6820a';
const FONT = "'Noto Sans TC','Microsoft JhengHei','PingFang TC','Heiti TC',sans-serif";
// 復古花邊模板（統一套在 art-only 牌面外）
const INK = '#43331c';
const PARCH = '#f3e8cc';
const GOLDV = '#b08d3e';
const SERIF = "'Noto Serif TC','Songti TC','MingLiU','Times New Roman',serif";
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export { backSvg, FACE_W, FACE_H };
export function hasArt(card, deck) { return deckOf(deck).ids.has(card.id); }
export function artUrl(card, deck) { return deckOf(deck).dir + card.id + '.jpg'; }

// 牌面內容（不含外層 <svg>）：滿版圖 + 金框 + 編號/逆位徽記 + 牌名緞帶。
// href 可為同源網址（頁面顯示）或 dataURL（PNG 匯出）。逆位＝圖旋轉 180，框與文字維持正向。
// 復古襯紙模板（matte）：米黃畫紙襯底，完整藝術圖置中「不被框蓋、不裁切」，上放編號、下放 serif 牌名。
// 框＝圖外圍的留白邊與細墨線，色調暖褐＋米黃，與 ink 復古畫風相搭。逆位＝只旋轉圖。
// clipId 須在整份文件唯一：同一張牌可能同時出現在牌陣格與放大 modal，若共用 'tcimg-{id}' 會產生重複 id（無效 DOM）。用遞增序號讓每個 SVG 自帶唯一 clip。
let clipSeq = 0;
export function framedImageInner(card, reversed, href) {
  const w = FACE_W, h = FACE_H, cx = w / 2;
  const clipId = 'tcimg-' + card.id + '-' + (++clipSeq);
  const ax = 24, aw = w - 48;          // 藝術區 192 寬
  const ah = Math.round(aw * 1.5);     // 288 高（2:3，完整不裁）
  const ay = 36;                        // 36..324
  const nameY = ay + ah + 19;          // ~343
  const imgT = reversed ? `transform="rotate(180 ${cx} ${ay + ah / 2})"` : '';
  const orn = (x, y, sx, sy) => `<path d="M${x} ${y + sy * 12} Q${x} ${y} ${x + sx * 12} ${y}" fill="none" stroke="${GOLDV}" stroke-width="1.2"/>`;
  return `
    <rect x="0" y="0" width="${w}" height="${h}" fill="${PARCH}"/>
    <rect x="6" y="6" width="${w - 12}" height="${h - 12}" rx="8" fill="none" stroke="${INK}" stroke-width="1.5"/>
    <rect x="10" y="10" width="${w - 20}" height="${h - 20}" rx="6" fill="none" stroke="${GOLDV}" stroke-width="0.7" opacity="0.85"/>
    ${orn(13, 13, 1, 1)}${orn(w - 13, 13, -1, 1)}${orn(13, h - 13, 1, -1)}${orn(w - 13, h - 13, -1, -1)}
    <text x="${cx}" y="23" text-anchor="middle" dominant-baseline="middle" style="font:700 ${card.badge.length >= 3 ? 13 : 16}px ${SERIF}; letter-spacing:1px" fill="${INK}">${esc(card.badge)}</text>
    ${reversed ? `<text x="${w - 21}" y="23" text-anchor="middle" dominant-baseline="middle" style="font:700 12px ${SERIF}" fill="#9a3b2a">逆</text>` : ''}
    <defs><clipPath id="${clipId}"><rect x="${ax}" y="${ay}" width="${aw}" height="${ah}"/></clipPath></defs>
    <rect x="${ax}" y="${ay}" width="${aw}" height="${ah}" fill="#e7d9b8"/>
    <image href="${href}" xlink:href="${href}" x="${ax}" y="${ay}" width="${aw}" height="${ah}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${clipId})" ${imgT}/>
    <rect x="${ax}" y="${ay}" width="${aw}" height="${ah}" fill="none" stroke="${INK}" stroke-width="1.4"/>
    <text x="${cx}" y="${nameY}" text-anchor="middle" dominant-baseline="middle" style="font:700 17px ${SERIF}; letter-spacing:3px" fill="${INK}">${esc(card.nameZh)}</text>`;
}

// 頁面用：有圖→框圖；無圖→回退素牌面。deck 決定圖來源（預設 uniform，向後相容）。
export function faceSvg(card, reversed, cls, deck) {
  const dk = deckOf(deck);
  if (!dk.ids.has(card.id)) return plainFaceSvg(card, reversed, cls);
  return `<svg class="${cls || 'tarot-face-svg'}" viewBox="0 0 ${FACE_W} ${FACE_H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="${esc(card.nameZh)}${reversed ? '（逆位）' : ''}">${framedImageInner(card, reversed, dk.dir + card.id + '.jpg')}</svg>`;
}

// 匯出用：抓同源 PNG → dataURL（SVG 當 image 載入時不會載外部資源，dataURL 也不汙染 canvas）。
export async function fetchArtDataUrl(card, deck) {
  try {
    const res = await fetch(artUrl(card, deck));
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = () => resolve(null);
      fr.readAsDataURL(blob);
    });
  } catch (e) { return null; }
}
