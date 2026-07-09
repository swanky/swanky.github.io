// fixtures-golden.mjs — 八字排盤 golden 案例（人工從外部排盤站交叉採集；未過前頁面續標 beta）。
//
// ⚠ 採集程序（執行模型「絕對禁止」自行推算或編造期望值——寧可留空＋TODO，填假 golden 比沒有更糟）：
//   1. 用 ≥3 個獨立排盤站（如 元亨利貞、問真八字、漢程網）交叉輸入同一出生資料，取一致結果才入檔。
//   2. 至少 10+ 命例，重點覆蓋：日柱錨點（跨世紀）、立春界（年柱切換）、23:00 換日（早子/晚子）。
//   3. 每筆填 input（欄位與頁面表單一致）＋ expected（四柱干支）。
//
// input:    { year, month, day, hour, minute, tz, gender, dayBoundary?, noTime? }
// expected: { year: '甲子', month: '..', day: '..', hour: '..' }（干支字串）
export const GOLDEN_BAZI = [
  // TODO(人工採集)：例
  // {
  //   label: '台北 1990-06-15 14:30 男',
  //   input: { year: 1990, month: 6, day: 15, hour: 14, minute: 30, tz: 'Asia/Taipei', gender: 'male' },
  //   expected: { year: '庚午', month: '壬午', day: '——', hour: '——' },
  // },
];
