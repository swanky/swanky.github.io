// 八字引擎測試：純函式（干支/五虎遁/五鼠遁/藏干/十神/五行權重/日柱錨點）完全自驗；
// computePillars 用 inject 後的星曆做 sanity（立春換年、月支範圍、大運步數）。
// 誠實：跨排盤站 10+ 筆 golden（§7.6）屬人工／外部驗證步驟，未過前頁面日柱標 beta。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { _injectAstronomy } from '../../assets/js/core/core-astro.js';

const require = createRequire(import.meta.url);
_injectAstronomy(require('../../assets/vendor/astronomy-engine/astronomy.browser.min.js'));

import {
  GAN, ZHI, ZHI_HIDDEN, NAYIN, gzName, ganZhiToGz, ganOf, zhiOf,
  tigerStartGan, ratStartGan, isSheng, isKe,
} from '../../assets/js/bazi/bazi-ganzhi.js';
import { sunLonToMonthZhi } from '../../assets/js/bazi/bazi-solar.js';
import {
  computePillars, gregorianToCJDN, dayGzFromCJDN, DAY_ANCHOR, equationOfTimeMin,
} from '../../assets/js/bazi/bazi-pillars.js';
import { tenGod, TEN_GODS, wuxingStats, tenGodCount, dayMasterStrength, analyzeChart } from '../../assets/js/bazi/bazi-shishen.js';

// ---- 干支基元 ----
test('干支序號往返、年柱公式', () => {
  assert.equal(gzName(0), '甲子');
  assert.equal(gzName(59), '癸亥');
  assert.equal(ganZhiToGz(0, 0), 0);
  assert.equal(ganZhiToGz(9, 11), 59);
  assert.equal(ganZhiToGz(0, 1), -1); // 甲丑不存在（陽干配陰支無解）
  // 2024 甲辰年：(2024−4) mod 60 = 40
  assert.equal(gzName(((2024 - 4) % 60 + 60) % 60), '甲辰');
});

// ---- 五虎遁全表（年干→寅月干；口訣：甲己丙、乙庚戊、丙辛庚、丁壬壬、戊癸甲）----
test('五虎遁全表', () => {
  const expect = { 甲: '丙', 乙: '戊', 丙: '庚', 丁: '壬', 戊: '甲', 己: '丙', 庚: '戊', 辛: '庚', 壬: '壬', 癸: '甲' };
  for (let g = 0; g < 10; g++) assert.equal(GAN[tigerStartGan(g)], expect[GAN[g]], `年干 ${GAN[g]}`);
});

// ---- 五鼠遁全表（日干→子時干；口訣：甲己甲、乙庚丙、丙辛戊、丁壬庚、戊癸壬）----
test('五鼠遁全表', () => {
  const expect = { 甲: '甲', 乙: '丙', 丙: '戊', 丁: '庚', 戊: '壬', 己: '甲', 庚: '丙', 辛: '戊', 壬: '庚', 癸: '壬' };
  for (let g = 0; g < 10; g++) assert.equal(GAN[ratStartGan(g)], expect[GAN[g]], `日干 ${GAN[g]}`);
});

// ---- 藏干完整性 ----
test('藏干表：12 支齊、天干序合法、本氣存在、納音 60 項', () => {
  assert.equal(ZHI_HIDDEN.length, 12);
  ZHI_HIDDEN.forEach((arr, z) => {
    assert.ok(arr.length >= 1 && arr.length <= 3, `${ZHI[z]} 藏干數`);
    arr.forEach((g) => assert.ok(g >= 0 && g < 10, `${ZHI[z]} 藏干序`));
  });
  assert.equal(NAYIN.length, 60);
  assert.equal(NAYIN[0], '海中金');
});

// ---- 十神 10×10 ----
test('十神：日干×十天干全表有效，甲日十神點名', () => {
  for (let day = 0; day < 10; day++)
    for (let t = 0; t < 10; t++)
      assert.ok(TEN_GODS.includes(tenGod(day, t)), `${GAN[day]}見${GAN[t]}`);
  // 甲(0) 日：甲比肩、乙劫財、丙食神、丁傷官、戊偏財、己正財、庚七殺、辛正官、壬偏印、癸正印
  const row = ['比肩', '劫財', '食神', '傷官', '偏財', '正財', '七殺', '正官', '偏印', '正印'];
  for (let t = 0; t < 10; t++) assert.equal(tenGod(0, t), row[t], `甲見${GAN[t]}`);
});

// ---- 五行生剋基元 ----
test('五行生剋', () => {
  assert.ok(isSheng('木', '火') && isSheng('水', '木'));
  assert.ok(isKe('木', '土') && isKe('金', '木'));
  assert.ok(!isSheng('木', '土') && !isKe('木', '火'));
});

// ---- 日柱錨點（純算術，鎖定 DAY_ANCHOR；待外部 golden 複核）----
test('日柱：CJDN 公式與錨點樣本', () => {
  assert.equal(DAY_ANCHOR, 49);
  assert.equal(gregorianToCJDN(2000, 1, 1), 2451545);       // = JDN 2451545（2000-01-01 正午）
  assert.equal(gzName(dayGzFromCJDN(gregorianToCJDN(2000, 1, 7))), '甲子');
  assert.equal(gzName(dayGzFromCJDN(gregorianToCJDN(1900, 1, 1))), '甲戌');
  assert.equal(gzName(dayGzFromCJDN(gregorianToCJDN(2000, 1, 1))), '戊午');
  assert.equal(gzName(dayGzFromCJDN(gregorianToCJDN(1984, 2, 2))), '丙寅');
});

// ---- 月支由太陽黃經 ----
test('sunLonToMonthZhi：節氣邊界', () => {
  assert.equal(ZHI[sunLonToMonthZhi(315)], '寅'); // 立春
  assert.equal(ZHI[sunLonToMonthZhi(344.9)], '寅');
  assert.equal(ZHI[sunLonToMonthZhi(345)], '卯'); // 驚蟄
  assert.equal(ZHI[sunLonToMonthZhi(0)], '卯');
  assert.equal(ZHI[sunLonToMonthZhi(15)], '辰');  // 清明
  assert.equal(ZHI[sunLonToMonthZhi(285)], '丑'); // 小寒
  assert.equal(ZHI[sunLonToMonthZhi(314.9)], '丑');
});

// ---- 均時差範圍 ----
test('均時差 |EoT| < 20 分', () => {
  for (const [mo, d] of [[2, 11], [5, 14], [7, 26], [11, 3]])
    assert.ok(Math.abs(equationOfTimeMin(2024, mo, d)) < 20);
});

// ---- 五行統計＋十神統計＋日主強弱 ----
test('五行權重加總、十神統計、日主傾向', () => {
  // 造一個四柱：日主甲木
  const pillars = {
    year: { gz: ganZhiToGz(0, 0), gan: 0, zhi: 0 },   // 甲子
    month: { gz: ganZhiToGz(1, 3), gan: 1, zhi: 3 },  // 乙卯
    day: { gz: ganZhiToGz(0, 2), gan: 0, zhi: 2 },    // 甲寅（日主甲木）
    hour: { gz: ganZhiToGz(2, 0), gan: 2, zhi: 0 },   // 丙子
  };
  const stats = wuxingStats(pillars);
  const sum = Object.values(stats.percent).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 100) < 0.5, `百分比加總 ${sum}`);
  assert.ok(stats.scores['木'] > 0 && stats.total > 0);

  const cnt = tenGodCount(pillars);
  assert.equal(Object.values(cnt).reduce((a, b) => a + b, 0) >= 4, true);

  const st = dayMasterStrength(pillars, stats);
  assert.ok(['偏強', '偏弱', '中和'].includes(st.tendency));
  assert.ok(st.deLing === true); // 月支卯木，幫甲木 → 得令
  assert.ok(/流派/.test(st.note)); // 免責語存在
});

// ---- computePillars 端到端（立春前後換年、結構、大運）----
test('computePillars：立春前年柱=前一年（1984-02-02 → 癸亥年 丙寅日）', () => {
  const utcMs = Date.UTC(1984, 1, 2, 12, 0); // 當地當 UTC 處理
  const c = computePillars({ y: 1984, mo: 2, d: 2, h: 12, mi: 0, utcMs, gender: 'male', withTime: true });
  assert.equal(gzName(c.pillars.year.gz), '癸亥');   // 立春(2/4)前 → 1983 癸亥
  assert.equal(gzName(c.pillars.day.gz), '丙寅');     // 日柱錨點
  assert.equal(c.pillars.hour != null, true);
  assert.ok(c.luck.steps.length === 10);
  assert.ok(['木', '火', '土', '金', '水'].includes(c.pillars.day.ganWuxing));
});

test('computePillars：立春後年柱=當年（1984-02-10 → 甲子年）', () => {
  const utcMs = Date.UTC(1984, 1, 10, 12, 0);
  const c = computePillars({ y: 1984, mo: 2, d: 10, h: 12, mi: 0, utcMs, gender: 'female', withTime: true });
  assert.equal(gzName(c.pillars.year.gz), '甲子'); // 立春後 → 1984 甲子
  assert.equal(ZHI[c.pillars.month.zhi], '寅');    // 立春後為寅月
});

test('computePillars：不確定時辰 → 時柱 null、analyze 不崩', () => {
  const utcMs = Date.UTC(1990, 4, 15, 4, 0);
  const c = computePillars({ y: 1990, mo: 5, d: 15, h: 12, mi: 0, utcMs, withTime: false });
  assert.equal(c.pillars.hour, null);
  const a = analyzeChart(c.pillars);
  assert.ok(a.wuxing.total > 0);
  assert.ok(a.tenGods.day.ganGod === '日主');
});

test('computePillars：23:00 換日 → 日柱進位', () => {
  const utcMs = Date.UTC(1990, 4, 15, 15, 0);
  const day = computePillars({ y: 1990, mo: 5, d: 15, h: 12, mi: 0, utcMs, withTime: true });
  const late = computePillars({ y: 1990, mo: 5, d: 15, h: 23, mi: 30, utcMs, withTime: true, dayBoundary: 'zi23' });
  const noSwitch = computePillars({ y: 1990, mo: 5, d: 15, h: 23, mi: 30, utcMs, withTime: true, dayBoundary: 'late-zi' });
  // 23:00 換日：日柱 = 次日（+1）
  assert.equal(late.pillars.day.gz, (day.pillars.day.gz + 1) % 60);
  // 晚子時不換日：日柱 = 當日
  assert.equal(noSwitch.pillars.day.gz, day.pillars.day.gz);
  // 兩派時支都是子（23:00 起）
  assert.equal(ZHI[late.pillars.hour.zhi], '子');
  assert.equal(ZHI[noSwitch.pillars.hour.zhi], '子');
});
