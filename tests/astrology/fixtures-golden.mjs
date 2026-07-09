// fixtures-golden.mjs — 星座命盤 golden 案例（人工從 astro.com 採集；未過前頁面續標 beta）。
//
// ⚠ 採集程序（執行模型「絕對禁止」自行推算或編造期望值——寧可留空＋TODO，填假 golden 比沒有更糟）：
//   1. 到 astro.com（Extended Chart Selection）逐筆輸入出生資料（年月日時＋城市經緯度）。
//   2. 抄下 ASC、MC 的黃經度數，以及 12 宮首度數；宮位制對齊本站 houseSystem（whole/placidus…）。
//   3. 每筆填 input（欄位與頁面表單一致）＋ expected（asc/mc/cusps 黃經度數）。
//   4. 容差 ±0.5°（平均黃赤交角／節點近似的合理範圍）。
//
// input:    { year, month, day, hour, minute, tz, lat, lon, houseSystem, noTime? }
// expected: { asc, mc, cusps: [12 個黃經度數] }
export const GOLDEN_ASTRO = [
  // TODO(人工採集)：例
  // {
  //   label: '台北 1990-06-15 14:30',
  //   input: { year: 1990, month: 6, day: 15, hour: 14, minute: 30, tz: 'Asia/Taipei', lat: 25.03, lon: 121.57, houseSystem: 'whole' },
  //   expected: { asc: 213.4, mc: 128.7, cusps: [ /* 12 個 */ ] },
  // },
];
