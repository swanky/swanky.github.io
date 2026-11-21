// ziwei-engine.js — 紫微斗數排盤隔離層（DOM-free、ES module）。
// 排盤本身完全交給 vendored iztro（MIT，assets/vendor/iztro/iztro.min.js）：
//   瀏覽器：classic script 先載，掛在全域 self.iztro；
//   Node 測試：經 _injectIztro() 注入同一份檔案（createRequire 載入）。
// 本檔只做三件事：① 出生時刻 → iztro 參數（含可選的真太陽時校正）② iztro 輸出 → 本站標準 chart JSON
// ③ 衍生查詢（三方四正、四化落宮）。四化、大限、流年一律取自 iztro，不在本站手寫對照表。

let IZ = null;
export function _injectIztro(lib) { IZ = lib; }
function iz() {
  if (!IZ) IZ = (typeof self !== 'undefined' && self.iztro) || globalThis.iztro || null;
  if (!IZ) throw new ZiweiError('IZTRO_MISSING', '排盤元件未載入，請重新整理頁面再試。');
  return IZ;
}

export class ZiweiError extends Error {
  constructor(code, messageZh) { super(messageZh); this.code = code; }
}

export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const TIME_NAMES = ['早子時', '丑時', '寅時', '卯時', '辰時', '巳時', '午時', '未時', '申時', '酉時', '戌時', '亥時', '晚子時'];
export const MUTAGEN_KEYS = ['祿', '權', '科', '忌'];

// ---- 時辰 ----
// iztro timeIndex：0＝早子(00:00–00:59)、1＝丑(01–02)…11＝亥(21–22)、12＝晚子(23:00–23:59)。
export function timeIndexOf(hour, minute = 0) {
  const h = ((hour % 24) + 24) % 24;
  void minute;
  if (h === 23) return 12;
  if (h === 0) return 0;
  return Math.floor((h + 1) / 2);
}

// 距離最近時辰交界幾分鐘（交界在奇數整點：01,03,…,23）。用來提醒「出生時間在兩個時辰交界附近」。
export function minutesToTimeBoundary(hour, minute) {
  const t = hour * 60 + minute;
  let best = Infinity;
  for (let b = 60; b <= 24 * 60; b += 120) best = Math.min(best, Math.abs(t - b));
  best = Math.min(best, t + 60); // 前一天 23:00 交界
  return best;
}

// ---- 真太陽時（可選）----
// 均時差近似（Spencer 1971，誤差約 ±30 秒），回傳分鐘；dayOfYear 1..366。
export function equationOfTimeMin(dayOfYear) {
  const g = (2 * Math.PI / 365) * (dayOfYear - 1);
  return 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
    - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
}

// UTC 毫秒＋出生地東經 → 真太陽時「牆鐘」{year,month,day,hour,minute,correctionMin}。
// 平太陽時＝UTC＋經度×4 分；真太陽時＝平太陽時＋均時差。
export function trueSolarWallClock(utcMs, lonDeg, offsetMin) {
  const lmtMs = utcMs + lonDeg * 4 * 60000;
  const d0 = new Date(lmtMs);
  const startOfYear = Date.UTC(d0.getUTCFullYear(), 0, 1);
  const doy = Math.floor((lmtMs - startOfYear) / 86400000) + 1;
  const eot = equationOfTimeMin(doy);
  const tstMs = lmtMs + eot * 60000;
  const d = new Date(tstMs);
  const clockMs = utcMs + offsetMin * 60000;
  return {
    year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(),
    hour: d.getUTCHours(), minute: d.getUTCMinutes(),
    correctionMin: Math.round((tstMs - clockMs) / 60000),
  };
}

// ---- 排盤 ----
const pad = (n) => String(n).padStart(2, '0');

function starObj(s) {
  return { name: s.name, brightness: s.brightness || '', mutagen: s.mutagen || '', type: s.type || '' };
}

// input: { year, month, day, hour, minute, gender: 'male'|'female', refDate?: 'YYYY-M-D' }
// 回傳本站標準 chart JSON（純資料，可直接 JSON.stringify）。
export function computeZiwei(input) {
  const { year, month, day, hour, minute = 0, gender, refDate } = input;
  if (!year || !month || !day || hour == null) throw new ZiweiError('INPUT', '請填入完整的出生日期與時間。');
  if (gender !== 'male' && gender !== 'female') throw new ZiweiError('GENDER', '紫微斗數排盤需要選擇性別。');
  const lib = iz();
  const timeIndex = timeIndexOf(hour, minute);
  const solar = `${year}-${month}-${day}`;
  const a = lib.astro.bySolar(solar, timeIndex, gender === 'male' ? '男' : '女', true, 'zh-TW');

  const palaces = a.palaces.map((p) => ({
    index: p.index,
    name: p.name,
    stem: p.heavenlyStem,
    branch: p.earthlyBranch,
    isBody: !!p.isBodyPalace,
    isSoul: p.name === '命宮',
    major: p.majorStars.map(starObj),
    minor: p.minorStars.map(starObj),
    adjective: p.adjectiveStars.map((s) => s.name),
    decadal: p.decadal ? [p.decadal.range[0], p.decadal.range[1]] : null,
    changsheng12: p.changsheng12 || '',
  }));

  const chart = {
    engine: 'iztro',
    input: { year, month, day, hour, minute, gender, timeIndex },
    solarDate: `${year}-${pad(month)}-${pad(day)}`,
    lunarDate: a.lunarDate,
    chineseDate: a.chineseDate,
    timeName: a.time,
    timeRange: a.timeRange,
    zodiac: a.zodiac,
    fiveElementsClass: a.fiveElementsClass,
    soul: a.soul,
    body: a.body,
    soulBranch: a.earthlyBranchOfSoulPalace,
    bodyBranch: a.earthlyBranchOfBodyPalace,
    palaces,
    birthMutagen: birthMutagenOf(palaces),
    horoscope: null,
  };

  if (refDate) chart.horoscope = horoscopeOf(a, chart, refDate, timeIndex);
  return chart;
}

// 生年四化：從各星的 mutagen 欄位收集（iztro 已依生年天干標好）。
function birthMutagenOf(palaces) {
  const out = [];
  for (const p of palaces) {
    for (const s of [...p.major, ...p.minor]) {
      if (s.mutagen) out.push({ star: s.name, mutagen: s.mutagen, palace: p.name, palaceIndex: p.index });
    }
  }
  out.sort((x, y) => MUTAGEN_KEYS.indexOf(x.mutagen) - MUTAGEN_KEYS.indexOf(y.mutagen));
  return out;
}

// 星名 → 落在本命哪一宮（找不到回 null，例如流年才有的星）。
export function palaceOfStar(chart, starName) {
  for (const p of chart.palaces) {
    if ([...p.major, ...p.minor].some((s) => s.name === starName)) return p;
  }
  return null;
}

function mutagenList(chart, names) {
  return (names || []).map((star, i) => {
    const p = palaceOfStar(chart, star);
    return { star, mutagen: MUTAGEN_KEYS[i], palace: p ? p.name : '', palaceIndex: p ? p.index : -1 };
  });
}

function horoscopeOf(a, chart, refDate, timeIndex) {
  const h = a.horoscope(refDate, timeIndex);
  const dIdx = h.decadal.index;
  const yIdx = h.yearly.index;
  return {
    refDate,
    nominalAge: h.age ? h.age.nominalAge : null,
    decadal: {
      palaceIndex: dIdx,
      palace: chart.palaces[dIdx] ? chart.palaces[dIdx].name : '',
      range: chart.palaces[dIdx] ? chart.palaces[dIdx].decadal : null,
      stemBranch: h.decadal.heavenlyStem + h.decadal.earthlyBranch,
      mutagen: mutagenList(chart, h.decadal.mutagen),
      spousePalaceIndex: h.decadal.palaceNames.indexOf('夫妻'),
    },
    yearly: {
      palaceIndex: yIdx,
      palace: chart.palaces[yIdx] ? chart.palaces[yIdx].name : '',
      stemBranch: h.yearly.heavenlyStem + h.yearly.earthlyBranch,
      mutagen: mutagenList(chart, h.yearly.mutagen),
    },
  };
}

// 三方四正：本宮、對宮（+6）、兩個三合宮（+4、+8）。iztro palace.index 與陣列位置一致（0＝寅宮起）。
export function sanFangSiZheng(index) {
  return { self: index, opposite: (index + 6) % 12, trineA: (index + 4) % 12, trineB: (index + 8) % 12 };
}

export function soulPalace(chart) { return chart.palaces.find((p) => p.isSoul); }
export function bodyPalace(chart) { return chart.palaces.find((p) => p.isBody); }
