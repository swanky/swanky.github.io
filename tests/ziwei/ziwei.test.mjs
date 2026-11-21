// ziwei.test.mjs — 紫微斗數隔離層測試。iztro 經 createRequire 載入與瀏覽器相同的 vendored bytes。
// 測試盤一律用虛構日期（不使用站主或任何真人的出生資料）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import {
  _injectIztro, computeZiwei, timeIndexOf, minutesToTimeBoundary, trueSolarWallClock,
  equationOfTimeMin, sanFangSiZheng, soulPalace, bodyPalace, palaceOfStar, ZiweiError,
} from '../../assets/js/ziwei/ziwei-engine.js';

globalThis.self = globalThis.self || globalThis; // vendored UMD 以 self 為宿主
const require = createRequire(import.meta.url);
const iztro = require('../../assets/vendor/iztro/iztro.min.js');
_injectIztro(iztro);

const MAJOR_14 = ['紫微', '天機', '太陽', '武曲', '天同', '廉貞', '天府', '太陰', '貪狼', '巨門', '天相', '天梁', '七殺', '破軍'];
// 十干四化（祿權科忌）——僅作為測試端的獨立對照，產品程式不使用此表。
const SIHUA = {
  甲: ['廉貞', '破軍', '武曲', '太陽'], 乙: ['天機', '天梁', '紫微', '太陰'], 丙: ['天同', '天機', '文昌', '廉貞'],
  丁: ['太陰', '天同', '天機', '巨門'], 戊: ['貪狼', '太陰', '右弼', '天機'], 己: ['武曲', '貪狼', '天梁', '文曲'],
  庚: ['太陽', '武曲', '太陰', '天同'], 辛: ['巨門', '太陽', '文曲', '文昌'], 壬: ['天梁', '紫微', '左輔', '武曲'],
  癸: ['破軍', '巨門', '太陰', '貪狼'],
};

const CASES = [
  { year: 1990, month: 6, day: 15, hour: 14, minute: 30, gender: 'female' },
  { year: 1975, month: 2, day: 4, hour: 23, minute: 20, gender: 'male' },
  { year: 2001, month: 11, day: 30, hour: 0, minute: 10, gender: 'female' },
  { year: 1968, month: 8, day: 8, hour: 7, minute: 0, gender: 'male' },
];

test('timeIndexOf：早子／晚子／一般時辰', () => {
  assert.equal(timeIndexOf(0, 30), 0);
  assert.equal(timeIndexOf(1, 0), 1);
  assert.equal(timeIndexOf(2, 59), 1);
  assert.equal(timeIndexOf(5, 48), 3); // 卯
  assert.equal(timeIndexOf(22, 59), 11);
  assert.equal(timeIndexOf(23, 0), 12);
});

test('minutesToTimeBoundary：交界在奇數整點', () => {
  assert.equal(minutesToTimeBoundary(5, 0), 0);
  assert.equal(minutesToTimeBoundary(6, 0), 60);
  assert.equal(minutesToTimeBoundary(4, 50), 10);
  assert.equal(minutesToTimeBoundary(0, 10), 50);
  assert.equal(minutesToTimeBoundary(23, 5), 5);
});

test('均時差：二月中約 -14 分、十一月初約 +16 分', () => {
  assert.ok(Math.abs(equationOfTimeMin(43) - (-14.2)) < 1.2);
  assert.ok(Math.abs(equationOfTimeMin(307) - 16.4) < 1.2);
});

test('真太陽時：台北(121.5E) 夏至前後比 UTC+8 牆鐘晚約 3–5 分鐘以內', () => {
  const utc = Date.UTC(1990, 5, 21, 6, 0); // 台北 14:00
  const t = trueSolarWallClock(utc, 121.5, 480);
  assert.equal(t.hour, 14);
  assert.ok(t.correctionMin >= 2 && t.correctionMin <= 6, `correction ${t.correctionMin}`);
});

for (const c of CASES) {
  test(`盤面結構不變量 ${c.year}-${c.month}-${c.day} ${c.hour}:${c.minute} ${c.gender}`, () => {
    const ch = computeZiwei({ ...c, refDate: '2026-7-1' });
    assert.equal(ch.palaces.length, 12);
    assert.equal(ch.palaces.filter((p) => p.isSoul).length, 1);
    assert.equal(ch.palaces.filter((p) => p.isBody).length, 1);
    const majors = ch.palaces.flatMap((p) => p.major.map((s) => s.name));
    assert.deepEqual([...majors].sort(), [...MAJOR_14].sort(), '14 主星各出現一次');
    // 地支依序（index 0 = 寅）
    ch.palaces.forEach((p, i) => assert.equal(p.branch, ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'][i]));
    // 命宮地支一致
    assert.equal(soulPalace(ch).branch, ch.soulBranch);
    assert.equal(bodyPalace(ch).branch, ch.bodyBranch);
    // 生年四化與年干對照表一致（獨立對照）
    const yStem = ch.chineseDate[0];
    const got = ch.birthMutagen.map((m) => m.star);
    assert.deepEqual(got, SIHUA[yStem], `年干 ${yStem} 四化`);
    // 大限：12 宮涵蓋連續 120 年，每段 10 年
    const starts = ch.palaces.map((p) => p.decadal[0]).sort((a, b) => a - b);
    for (let i = 1; i < 12; i++) assert.equal(starts[i] - starts[i - 1], 10);
    // 流年四化與流年天干對照
    const ys = ch.horoscope.yearly.stemBranch[0];
    assert.deepEqual(ch.horoscope.yearly.mutagen.map((m) => m.star), SIHUA[ys]);
    // 大限四化與大限宮干一致
    const ds = ch.horoscope.decadal.stemBranch[0];
    assert.deepEqual(ch.horoscope.decadal.mutagen.map((m) => m.star), SIHUA[ds]);
    assert.equal(ch.palaces[ch.horoscope.decadal.palaceIndex].stem, ds);
    // 可序列化
    assert.doesNotThrow(() => JSON.parse(JSON.stringify(ch)));
  });
}

test('2026 流年干支為丙午', () => {
  const ch = computeZiwei({ ...CASES[0], refDate: '2026-7-1' });
  assert.equal(ch.horoscope.yearly.stemBranch, '丙午');
});

test('三方四正', () => {
  assert.deepEqual(sanFangSiZheng(1), { self: 1, opposite: 7, trineA: 5, trineB: 9 });
  assert.deepEqual(sanFangSiZheng(10), { self: 10, opposite: 4, trineA: 2, trineB: 6 });
});

test('palaceOfStar', () => {
  const ch = computeZiwei(CASES[0]);
  const p = palaceOfStar(ch, '紫微');
  assert.ok(p && p.major.some((s) => s.name === '紫微'));
  assert.equal(palaceOfStar(ch, '不存在的星'), null);
});

test('輸入錯誤：缺性別', () => {
  assert.throws(() => computeZiwei({ year: 1990, month: 1, day: 1, hour: 1 }), ZiweiError);
});
