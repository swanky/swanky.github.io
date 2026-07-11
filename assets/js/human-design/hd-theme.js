// hd-theme.js — BodyGraph v2 視覺 tokens 單一事實來源（spec v2 第五/六/七/九節＋十六節三視覺方向）。
// 三主題共用「同一 geometry / 同一 renderer / 同一結構」，只差 theme tokens（color/stroke/background/
// shadow/highlight）。結構欄位由 buildTheme() 強制一致，避免三份漂移；只有色彩相關值在各 spec 覆寫。
//   A classic — Classic Professional：白紙、經典人類圖低飽和四色（黃/綠/棕/紅）、灰管印刷向、列印/分析師友善。
//   B modern  — Modern Editorial：暖灰頁底＋白圓角卡＋spec 第六節九色暖色票（v26 定稿基準）。一般 UI/社群。
//   C dark    — Dark Analytical：深底、九色低亮度暗化、灰管深槽、Personality 改淺灰白、Design 維持 #C8453C 系。
// 與 hd-geometry-v2.js（幾何）分離：geometry 只管座標、theme 只管外觀，renderer 兩者組合。
//
// ── v26 視覺語言（用戶第十~十一輪拍板）＝各主題 `skin` 區塊（本檔權威 render token 集）───────────────
// 「明度反轉浮起管＋casing 細框＋插座淺墊＋啟動飽和圓＋品牌金髮絲框」。skin 覆蓋前 v2.0 baseline 的
// channel/centerDepth/gate.inactive（後者保留供比對/回退，v26 renderer 不讀）。renderer 讀取分工：
//   · 未啟動軌＝skin.track（浮起管 color + casing 槽）      · 啟動線＝skin.active（寬/casing）＋ channel.personality/design（色）
//   · 未啟動閘門插座＝skin.socket（stroke 環＋淺墊 pad + text）· 啟動閘門圓＝channel[state]（底）＋ gate[state].text（字）
//   · 中心未定義＝skin.centerUndef                          · 品牌金框＝skin.goldFrame（隨 SVG 匯出）
// **插座淺墊 pad 為「預混後的 9 個墊色值」（非函數）＝報告端 Python 可直讀同一份 tokens。**
//   混色公式來源＝scratchpad/v2-skin-derive.mjs（每通道 naive sRGB 線性混，非 gamma-correct，與 renderer 一致）：
//     modern  pad = mixWhite(centerDefined, 0.75)          text #5F5847（v26 鎖定；WCAG 5.39–6.83 全過）
//     classic pad = mixWhite(centerDefined, 0.72)          text #4A463E（白底列印；WCAG 6.75–9.39 全過）
//     dark    pad = mixToward(centerDefined, cardBg, 0.60) text #D2D5DB（深墊淺字；WCAG 5.99–11.19 全過）
//   undefPad＝未定義中心插座底（＝centerUndef.fill）；socket text × pad「inactive 組」三主題全 ≥ WCAG AA 4.5。

// ── 共用結構常數（幾何相鄰；三主題刻意相同，讓選型只比較「視覺方向」而非尺寸）──────────────
const GATE_FONT_FAMILY = "'Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif";
const STRUCT = {
  cardRadius: 20,
  centerUndefinedStrokeWidth: 2,
  centerDepth: { topHighlightWidth: 2, bottomShadeWidth: 1.5 },
  channel: {
    trackWidth: 11,          // 未啟動線寬（spec 五節 10–12；v26 skin 用 12）
    activeWidth: 7.5,        // 啟動線寬（spec 五節 7–8；v26 skin 用 7）
    linecap: 'round', linejoin: 'round',
    mixedParallelWidth: 3.4, // mixed 平行雙細線各半寬
    mixedParallelGap: 4.2,
  },
  gate: {
    diameter: 30, radius: 15,   // spec 七節 26–32
    hitRadius: 22,              // 透明較大 hit area（手機好點）
    fontSize: 18, fontWeight: 600, // spec 七節 15–18；三主題等大＝公平比較
    fontFamily: GATE_FONT_FAMILY,
    numericMode: 'tabular-nums',
    inactiveStrokeWidth: 1.5,
  },
  label: { fontSize: 15 },
};

// v26 skin 共用結構數值（三主題相同；顏色在各主題 skin 覆寫）。
const SS = {
  track: { width: 12, casingW: 2.0 },
  active: { width: 7, casingW: 1.5, mixedW: 3.2, mixedGap: 4.0 },
  centerUndef: { sw: 1.5 },
  gate: { r: 15, fontSize: 18, fontWeight: 600, numericMode: 'tabular-nums', activeRingW: 2.5 },
  socket: { sw: 2 },
  goldFrame: { w: 2, inset: 16, r: 24 },
};

// 以色彩 spec + 共用結構組出完整主題（保證三主題欄位結構一致）。
function buildTheme(c) {
  return {
    id: c.id, name: c.name,
    page: c.page,
    centerDefined: c.centerDefined,
    centerUndefined: { ...c.centerUndefined, strokeWidth: STRUCT.centerUndefinedStrokeWidth },
    centerDepth: { ...c.centerDepth, topHighlightWidth: STRUCT.centerDepth.topHighlightWidth, bottomShadeWidth: STRUCT.centerDepth.bottomShadeWidth },
    channel: { ...STRUCT.channel, ...c.channel },
    gate: {
      diameter: STRUCT.gate.diameter, radius: STRUCT.gate.radius, hitRadius: STRUCT.gate.hitRadius,
      fontSize: STRUCT.gate.fontSize, fontWeight: STRUCT.gate.fontWeight,
      fontFamily: STRUCT.gate.fontFamily, numericMode: STRUCT.gate.numericMode,
      inactive: { ...c.gate.inactive, strokeWidth: STRUCT.gate.inactiveStrokeWidth },
      personality: c.gate.personality,
      design: c.gate.design,
      mixed: c.gate.mixed,
      hoverRing: c.gate.hoverRing,
    },
    label: { ...c.label, fontSize: STRUCT.label.fontSize },
    skin: c.skin, // v26 render token 集（見檔頭）——buildTheme 直通、結構由各主題 spec 明列
  };
}

// ── A · classic（Classic Professional）─────────────────────────────────────────
// 白紙、經典人類圖低飽和四色（黃=Head/G、綠=Ajna、棕=Throat/Spleen/Solar/Root、紅=Heart/Sacral）。
// v26：灰管印刷向（管比白紙深一階＝凹槽感）、插座淺墊 mixWhite 0.72＋深暖字、金框柔和。列印/分析師友善。
const CLASSIC = buildTheme({
  id: 'classic', name: 'Classic Professional',
  page: { bg: '#F4F2EE', cardBg: '#FFFFFF', cardBorder: '#DCDAD3', cardShadow: '0 1px 4px rgba(30,28,24,0.06)' },
  centerDefined: {
    head: '#E3CB6E', ajna: '#90B36E', throat: '#B69C74', g: '#E3CB6E', heart: '#C56A5A',
    spleen: '#B69C74', solar: '#B69C74', sacral: '#C56A5A', root: '#B69C74',
  },
  centerUndefined: { fill: '#FFFFFF', stroke: '#B5B3AD' },
  centerDepth: { topHighlight: 'rgba(255,255,255,0.0)', bottomShade: 'rgba(20,18,14,0.10)' }, // 近平面（v26 renderer 不讀）
  channel: {
    trackColor: '#E6E4DF', trackWidth: 11, activeWidth: 7.5,
    personality: '#262523', design: '#B94A40',                 // 低飽和黑紅（非純黑/純紅）
    trackGrad: { lo: '#E4E2DD', hi: '#EBE9E4' },
    hangingFadeTo: '#E6E4DF',
  },
  gate: {
    inactive: { fill: '#F7F6F3', stroke: '#C3BFB6', text: '#454340' },
    personality: { fill: '#262523', text: '#FFFFFF' },
    design: { fill: '#B94A40', text: '#FFFFFF' },
    mixed: { fillA: '#262523', fillB: '#B94A40', text: '#FFFFFF' },
    hoverRing: { stroke: '#E5A300', strokeWidth: 3 },
  },
  label: { color: '#33322E' },
  skin: {
    pageBg: '#F4F2EE', surface: '#FFFFFF',
    goldFrame: { ...SS.goldFrame, color: '#E5A300', alpha: 0.5 },   // 白紙上柔和（不喧賓奪主）
    track: { ...SS.track, color: '#E6E4DF', casing: '#D3CEC3' },    // 灰管凹白紙（管深一階＋更深凹槽）
    active: { ...SS.active, casing: '#E6E4DF' },                    // 彩線鑲入灰管（casing = track.color）
    centerUndef: { fill: '#FFFFFF', stroke: '#B5B3AD', sw: 2 },     // 白心＋灰描邊（白紙上需 2 才讀）
    gate: { ...SS.gate, activeRing: '#FFFFFF' },
    socket: {
      ...SS.socket, stroke: '#C7C2B7', text: '#4A463E', undefPad: '#FFFFFF',
      // pad = mixWhite(centerDefined, 0.72)（v2-skin-derive.mjs）
      pad: { head: '#F7F0D6', ajna: '#E0EAD6', throat: '#EBE3D8', g: '#F7F0D6', heart: '#EFD5D1', spleen: '#EBE3D8', solar: '#EBE3D8', sacral: '#EFD5D1', root: '#EBE3D8' },
    },
  },
});

// ── B · modern（Modern Editorial）──────────────────────────────────────────────
// v26 定稿基準（spec 六節暖色九色票、暖灰頁底 / 白圓角卡）。一般 UI / 網站 / 社群。此主題 skin＝用戶拍板值，勿漂移。
const MODERN = buildTheme({
  id: 'modern', name: 'Modern Editorial',
  page: { bg: '#E8E4DC', cardBg: '#F1EEE7', cardBorder: '#E8E4DC', cardShadow: '0 12px 36px rgba(35,31,25,0.08)' },
  centerDefined: {
    // v2.6：G 由 #F1C34A 拉齊品牌次色 #F5C53B（docs/design.md Secondary yellow）——視覺核心＝品牌識別位。
    head: '#F3C84B', ajna: '#73BFA3', throat: '#B6A2D8', g: '#F5C53B', heart: '#D98963',
    spleen: '#A9C96E', solar: '#D9A45E', sacral: '#D87862', root: '#9B846A',
  },
  centerUndefined: { fill: '#FBFAF7', stroke: '#B8B4AA' },
  centerDepth: { topHighlight: 'rgba(255,255,255,0.40)', bottomShade: 'rgba(35,31,25,0.22)' },
  channel: {
    trackColor: '#DDD9D0', trackWidth: 11, activeWidth: 7.5,
    personality: '#202124', design: '#C8453C',
    trackGrad: { lo: '#D5D0C6', hi: '#E7E3DB' },
    hangingFadeTo: '#DDD9D0',
  },
  gate: {
    inactive: { fill: '#F1EEE7', stroke: '#C7C2B7', text: '#6B6659' },
    personality: { fill: '#202124', text: '#FFFFFF' },
    design: { fill: '#C8453C', text: '#FFFFFF' },
    mixed: { fillA: '#202124', fillB: '#C8453C', text: '#FFFFFF' },
    hoverRing: { stroke: '#E5A300', strokeWidth: 3 },
  },
  label: { color: '#3B3730' },
  skin: {
    pageBg: '#E8E4DC', surface: '#F1EEE7',
    goldFrame: { ...SS.goldFrame, color: '#E5A300', alpha: 0.65 }, // v26 品牌金髮絲框（editorial plate rule）
    track: { ...SS.track, color: '#FFFFFF', casing: '#D2CEC4' },   // 明度反轉浮起白管＋暖灰 casing
    active: { ...SS.active, casing: '#FFFFFF' },                   // 彩線鑲入白管（casing = track.color）
    centerUndef: { fill: '#FCFBF9', stroke: '#DBD7CE', sw: 1.5 },
    gate: { ...SS.gate, activeRing: '#FFFFFF' },
    socket: {
      ...SS.socket, stroke: '#D2CEC4', text: '#5F5847', undefPad: '#FCFBF9',
      // pad = mixWhite(centerDefined, 0.75)（v26 鎖定；v2-skin-derive.mjs）
      pad: { head: '#FCF1D2', ajna: '#DCEFE8', throat: '#EDE8F5', g: '#FDF1CE', heart: '#F6E2D8', spleen: '#EAF2DB', solar: '#F6E8D7', sacral: '#F5DDD8', root: '#E6E0DA' },
    },
  },
});

// ── C · dark（Dark Analytical）─────────────────────────────────────────────────
// 深底；九中心＝spec 六節色票低亮度暗化；未定義中心融入深底＋暗描邊；Personality 啟動改「淺灰白」（深底上黑不可見）。
// v26：灰管深槽（管比卡面亮、casing 比管暗＝浮起凹槽的深底鏡像）；插座＝深墊（mixToward 卡面 0.60）＋淺字（案 B）——
// unlit 退隱、lit 飽和跳出，深底上「沒亮 vs 點亮」一眼可分。金框在深底上暖光發亮＝品牌簽名保留。
const DARK = buildTheme({
  id: 'dark', name: 'Dark Analytical',
  page: { bg: '#16171A', cardBg: '#1C1D21', cardBorder: '#2E3037', cardShadow: '0 16px 40px rgba(0,0,0,0.5)' },
  centerDefined: { // 九色暗化（L≈40%，保留可辨色相；warm 群以明度/色相分離避免糊在一起）
    head: '#B08A2A', ajna: '#3F7E68', throat: '#6E5F97', g: '#AA8527', heart: '#B15C3C',
    spleen: '#6B893C', solar: '#B0742E', sacral: '#B14634', root: '#7C6248',
  },
  centerUndefined: { fill: '#1E1F24', stroke: '#474C56' },
  centerDepth: { topHighlight: 'rgba(255,255,255,0.10)', bottomShade: 'rgba(0,0,0,0.38)' },
  channel: {
    trackColor: '#34373D', trackWidth: 11, activeWidth: 7.5,
    personality: '#E7E5DF', design: '#C8453C',               // P 改淺灰白；D 維持 #C8453C 系
    trackGrad: { lo: '#303338', hi: '#3A3D44' },
    hangingFadeTo: '#34373D',
  },
  gate: {
    inactive: { fill: '#24272C', stroke: '#3E424A', text: '#AEB2B9' },
    personality: { fill: '#E7E5DF', text: '#202227' },        // 淺圓＋深字（P 反轉，配合淺灰白通道）
    design: { fill: '#C8453C', text: '#FFFFFF' },
    mixed: { fillA: '#E7E5DF', fillB: '#C8453C', text: '#202227' }, // 深字：淺半優、紅半 3:1+（粗數字＝大字）
    hoverRing: { stroke: '#E5A300', strokeWidth: 3 },
  },
  label: { color: '#C8CBD1' },
  skin: {
    pageBg: '#16171A', surface: '#1C1D21',
    goldFrame: { ...SS.goldFrame, color: '#E5A300', alpha: 0.65 }, // 深底上暖光發亮
    track: { ...SS.track, color: '#40434A', casing: '#2A2C31' },   // 灰管＋更暗凹槽（浮起管深底鏡像）
    active: { ...SS.active, casing: '#40434A' },                   // 彩線鑲入灰管（casing = track.color）
    centerUndef: { fill: '#1E1F24', stroke: '#474C56', sw: 1.5 },
    gate: { ...SS.gate, activeRing: '#FFFFFF' },
    socket: {
      ...SS.socket, stroke: '#3E424A', text: '#D2D5DB', undefPad: '#1E1F24',
      // pad = mixToward(centerDefined, cardBg #1C1D21, 0.60)（深墊；v2-skin-derive.mjs）
      pad: { head: '#574925', ajna: '#2A443D', throat: '#3D3750', g: '#554723', heart: '#58362C', spleen: '#3C482C', solar: '#574026', sacral: '#582D29', root: '#423931' },
    },
  },
});

// ── 三主題匯出（spec 十六節）───────────────────────────────────────────────────
export const THEMES_V2 = { classic: CLASSIC, modern: MODERN, dark: DARK };

// 向後相容：既有 renderer 以具名 THEME（＝B modern 基準）匯入。
export const THEME = MODERN;

// 中心已定義色查詢（未定義回 null，由 renderer 決定走 undefined 樣式）。theme 預設 modern。
export function centerFill(centerId, state, theme = MODERN) {
  return state === 'defined' ? theme.centerDefined[centerId] : null;
}

// 依通道狀態回啟動色（inactive / mixed 回 null，另處理）。theme 預設 modern。
export function channelActiveColor(state, theme = MODERN) {
  if (state === 'personality') return theme.channel.personality;
  if (state === 'design') return theme.channel.design;
  return null;
}
