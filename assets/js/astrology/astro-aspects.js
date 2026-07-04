// astro-aspects.js — 相位偵測與 orb（規劃 §5.3）。
// 相位：合/六合/刑/拱/沖；orb：日月 8°、行星 6°、ASC/MC 5°。
import { wrapPM180 } from '../core/core-astro.js';

export const ASPECTS = [
  { key: 'conjunction', name: '合', angle: 0 },
  { key: 'sextile', name: '六合', angle: 60 },
  { key: 'square', name: '刑', angle: 90 },
  { key: 'trine', name: '拱', angle: 120 },
  { key: 'opposition', name: '沖', angle: 180 },
];

function isLuminary(id) { return id === 'sun' || id === 'moon'; }
function isAngle(id) { return id === 'asc' || id === 'mc'; }

export function orbFor(a, b) {
  if (isAngle(a) || isAngle(b)) return 5;
  if (isLuminary(a) || isLuminary(b)) return 8;
  return 6;
}

// points: { id: { lon } }（可含 asc/mc）。回相位陣列，orb 由緊到鬆排序。
export function detectAspects(points) {
  const ids = Object.keys(points);
  const out = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i];
      const b = ids[j];
      const diff = Math.abs(wrapPM180(points[a].lon - points[b].lon));
      for (const asp of ASPECTS) {
        const orb = Math.abs(diff - asp.angle);
        if (orb <= orbFor(a, b)) {
          out.push({ a, b, type: asp.key, name: asp.name, angle: asp.angle, orb: Math.round(orb * 100) / 100 });
          break; // 一對點只取最貼近的一個相位
        }
      }
    }
  }
  out.sort((x, y) => x.orb - y.orb);
  return out;
}
