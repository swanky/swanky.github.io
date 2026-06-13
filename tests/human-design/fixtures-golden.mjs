// fixtures-golden.mjs — 與業界參考站交叉驗證的固化案例
//
// 來源：hd.void.com.hk（Jovian Archive 演算法）, 擷取於 2026-06-13。
// 擷取當下逐筆人工核對 26 個行星 gate.line + 五項判定，命中率 100%。
//
// 重要：參考站的「Taipei」時區固定為 GMT+8，不處理台灣歷史夏令時。
// 下列出生案例皆刻意選在無夏令時期間（1990、1995 台灣為 +8），故與參考站一致。
// 本站引擎對 1946-1961/1974-75/1979 會採真實 +9（更精確），那段期間與此參考站
// 會差一小時——那是預期的差異，由 timezone.test.mjs 獨立驗證，不在此比對。

export const GOLDEN_CHARTS = [
  {
    label: '1990-05-15 14:30 台北（投射者／6-2／二分人）',
    source: 'https://hd.void.com.hk/ 擷取 2026-06-13',
    input: { year: 1990, month: 5, day: 15, hour: 14, minute: 30, tz: 'Asia/Taipei' },
    personality: {
      sun: '23.6', earth: '43.6', moon: '61.4', northNode: '19.3', southNode: '33.3',
      mercury: '24.1', venus: '21.4', mars: '22.2', jupiter: '52.6', saturn: '61.5',
      uranus: '58.6', neptune: '38.6', pluto: '1.4',
    },
    design: {
      sun: '30.2', earth: '29.2', moon: '50.2', northNode: '13.4', southNode: '7.4',
      mercury: '41.3', venus: '61.2', mars: '38.3', jupiter: '15.3', saturn: '61.1',
      uranus: '58.5', neptune: '38.5', pluto: '1.5',
    },
    result: {
      type: 'projector', authority: 'emotional', profile: '6/2', definition: 'split',
      crossGates: { pSun: 23, pEarth: 43, dSun: 30, dEarth: 29 }, crossAngle: 'left',
    },
  },
  {
    label: '1995-07-07 10:10 台北（顯示生產者／6-2／二分人）',
    source: 'https://hd.void.com.hk/ 擷取 2026-06-13',
    input: { year: 1995, month: 7, day: 7, hour: 10, minute: 10, tz: 'Asia/Taipei' },
    personality: {
      sun: '39.6', earth: '38.6', moon: '50.5', northNode: '28.1', southNode: '27.1',
      mercury: '12.2', venus: '15.5', mars: '47.6', jupiter: '9.1', saturn: '36.3',
      uranus: '60.3', neptune: '61.4', pluto: '14.4',
    },
    design: {
      sun: '51.2', earth: '57.2', moon: '15.3', northNode: '28.4', southNode: '27.4',
      mercury: '17.5', venus: '63.1', mars: '7.1', jupiter: '5.5', saturn: '22.2',
      uranus: '60.5', neptune: '61.5', pluto: '34.1',
    },
    result: {
      type: 'mg', authority: 'emotional', profile: '6/2', definition: 'split',
      crossGates: { pSun: 39, pEarth: 38, dSun: 51, dEarth: 57 }, crossAngle: 'left',
    },
  },
];

// 即時星盤：固定 UTC 時刻的 13 個 Personality 行星（不涉及出生時間/時區/Design）。
// 直接驗證「星曆 → 黃經 → 閘門爻線映射」這條鏈路，繞開所有時區歧義。
export const GOLDEN_TRANSITS = [
  {
    label: 'Current Transit 2026-06-13 02:05:00 UTC',
    source: 'https://hd.void.com.hk/ Current Transit 擷取 2026-06-13（顯示為 10:05 GMT+8）',
    utc: [2026, 5, 13, 2, 5, 0], // Date.UTC 參數（月份 0-indexed）
    personality: {
      sun: '45.6', earth: '26.6', moon: '23.5', northNode: '55.3', southNode: '59.3',
      mercury: '53.2', venus: '56.4', mars: '2.6', jupiter: '56.1', saturn: '21.4',
      uranus: '20.3', neptune: '17.1', pluto: '41.4',
    },
  },
];
