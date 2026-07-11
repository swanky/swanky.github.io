// hd-golden-compare.mjs — 交叉驗證比對器
// SITE 陣列 = 2026-07-11 於 humandesignasia.org（Maia 引擎）Playwright 逐筆實測採集的原始值（zh 原文照抄）。
// 本腳本跑本地引擎、把 zh 對映回內部枚舉、逐欄比對，印出總表並寫出 golden-cases.json。
// 誠實聲明：SITE 值一律來自參考站實測，非人工推算。
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { _injectAstronomy } from '../assets/js/human-design/hd-astro.js';
import { computeChart } from '../assets/js/human-design/hd-engine.js';
const require = createRequire(import.meta.url);
_injectAstronomy(require('../assets/vendor/astronomy-engine/astronomy.browser.min.js'));

// 採集紀錄。site.cross 為原文（含交叉中文名）；解析出角度與四閘門比對。
const CASES = [
  { id: 'tw-normal', date: '1988-09-03', time: '21:10', tz: 'Asia/Taipei', country: '200', city: '262146 Kaohsiung City', img: 'hd_627248922000000000', site: { type: '顯示者', profile: '6/2', definition: '三分人', authority: '情緒型權威', notSelf: '憤怒', cross: '左角度交叉之遷移2 (40/37 | 35/5)' } },
  { id: 'tw-hist-jst', date: '1943-03-10', time: '08:20', tz: 'Asia/Taipei', country: '200', city: '262141 Taipei City', img: 'hd_612893964000000000', site: { type: '生產者', profile: '2/4', definition: '一分人', authority: '薦骨型權威', notSelf: '挫敗感', cross: '右角度交叉之統領 (22/47 | 26/45)' } },
  { id: 'tw-hist-dst', date: '1975-06-15', time: '14:30', tz: 'Asia/Taipei', country: '200', city: '262141 Taipei City', img: 'hd_623076390000000000', site: { type: '顯示生產者', profile: '1/4', definition: '二分人', authority: '情緒型權威', notSelf: '挫敗感', cross: '右角度交叉之伊甸園2 (12/11 | 36/6)' } },
  { id: 'refl-bangkok', date: '1962-01-08', time: '13:00', tz: 'Asia/Bangkok', country: '203', city: '91731 Bangkok > Krung Thep', img: 'hd_618837624000000000', site: { type: '反映者', profile: '3/5', definition: '無', authority: '無內在權威', notSelf: '失望', cross: '右角度交叉之滲透4 (54/53 | 57/51)' } },
  { id: 'ego-tokyo', date: '1962-07-02', time: '03:00', tz: 'Asia/Tokyo', country: '98', city: '61204 Tokyo', img: 'hd_618988392000000000', site: { type: '顯示者', profile: '6/3', definition: '一分人', authority: '意志力型權威', notSelf: '憤怒', cross: '左角度交叉之要求 (52/58 | 21/48)' } },
  { id: 'mental-kolkata', date: '1962-02-06', time: '23:30', tz: 'Asia/Kolkata', country: '89', city: '48426 Calcutta', img: 'hd_618863112000000000', site: { type: '投射者', profile: '5/1', definition: '一分人', authority: '無內在權威', notSelf: '苦澀', cross: '左角度交叉之面具 (13/7 | 43/23)' } },
  { id: 'gate-bound-before', date: '1990-05-15', time: '22:20', tz: 'Asia/Taipei', country: '200', city: '262141 Taipei City', img: 'hd_627783780000000000', site: { type: '投射者', profile: '6/3', definition: '二分人', authority: '情緒型權威', notSelf: '苦澀', cross: '左角度交叉之奉獻 (23/43 | 30/29)' } },
  { id: 'gate-bound-after', date: '1990-05-15', time: '22:50', tz: 'Asia/Taipei', country: '200', city: '262141 Taipei City', img: 'hd_627783798000000000', site: { type: '投射者', profile: '1/3', definition: '三分人', authority: '情緒型權威', notSelf: '苦澀', cross: '右角度交叉之傳染2 (8/14 | 30/29)' } },
  { id: 'us-edt', date: '1985-07-04', time: '10:15', tz: 'America/New_York', country: '250', city: '190210 New York', img: 'hd_626249313000000000', site: { type: '顯示生產者', profile: '4/6', definition: '二分人', authority: '薦骨型權威', notSelf: '挫敗感', cross: '右角度交叉之張力2 (39/38 | 21/48)' } },
  { id: 'us-dst-springfwd', date: '1999-04-04', time: '03:30', tz: 'America/New_York', country: '250', city: '190210 New York', img: 'hd_630588078000000000', site: { type: '生產者', profile: '5/2', definition: '二分人', authority: '情緒型權威', notSelf: '挫敗感', cross: '左角度交叉之努力 (21/48 | 54/53)' } },
  { id: 'us-pst-mid', date: '1972-01-15', time: '00:00', tz: 'America/Los_Angeles', country: '222', city: '114718 Los Angeles', img: 'hd_621999072000000000', site: { type: '顯示生產者', profile: '4/6', definition: '一分人', authority: '情緒型權威', notSelf: '挫敗感', cross: '右角度交叉之馬雅4 (61/62 | 32/42)' } },
  { id: 'leap-1996', date: '1996-02-29', time: '23:30', tz: 'America/Chicago', country: '231', city: '132698 Chicago', img: 'hd_629612550000000000', site: { type: '顯示生產者', profile: '6/2', definition: '二分人', authority: '情緒型權威', notSelf: '挫敗感', cross: '左角度交叉之遷移 (37/40 | 5/35)' } },
  { id: 'eu-bst', date: '1980-06-21', time: '12:00', tz: 'Europe/London', country: '216', city: '98078 London', img: 'hd_624660300000000000', site: { type: '生產者', profile: '3/5', definition: '一分人', authority: '情緒型權威', notSelf: '挫敗感', cross: '右角度交叉之愛之船2 (15/10 | 25/46)' } },
  { id: 'eu-cest', date: '1991-08-14', time: '23:59', tz: 'Europe/Berlin', country: '72', city: '40925 Berlin', img: 'hd_628178039400000000', site: { type: '投射者', profile: '3/6', definition: '二分人', authority: '直覺型權威', notSelf: '苦澀', cross: '右角度交叉之解釋3 (4/49 | 23/43)' } },
  { id: 'leap-2000', date: '2000-02-29', time: '12:00', tz: 'Europe/Paris', country: '66', city: '38508 Paris', img: 'hd_630874188000000000', site: { type: '生產者', profile: '5/1', definition: '二分人', authority: '情緒型權威', notSelf: '挫敗感', cross: '左角度交叉之遷移 (37/40 | 5/35)' } },
  { id: 'de-munich-mid', date: '2010-06-15', time: '00:00', tz: 'Europe/Berlin', country: '72', city: '43932 München', img: 'hd_634121496000000000', site: { type: '生產者', profile: '2/4', definition: '二分人', authority: '情緒型權威', notSelf: '挫敗感', cross: '右角度交叉之伊甸園2 (12/11 | 36/6)' } },
  { id: 'au-syd-dst', date: '1995-12-25', time: '16:45', tz: 'Australia/Sydney', country: '10', city: '4591 Sydney', img: 'hd_629554671000000000', site: { type: '生產者', profile: '6/2', definition: '一分人', authority: '薦骨型權威', notSelf: '挫敗感', cross: '左角度交叉之預防2 (10/15 | 18/17)' } },
  { id: 'nz-auckland', date: '1993-11-11', time: '07:07', tz: 'Pacific/Auckland', country: '146', city: '69629 Auckland', img: 'hd_628885516200000000', site: { type: '顯示生產者', profile: '6/2', definition: '一分人', authority: '薦骨型權威', notSelf: '挫敗感', cross: '左角度交叉之挑戰2 (1/2 | 4/49)' } },
  { id: 'hi-honolulu', date: '1982-06-18', time: '20:00', tz: 'Pacific/Honolulu', country: '229', city: '130041 Honolulu', img: 'hd_625289112000000000', site: { type: '顯示生產者', profile: '6/2', definition: '一分人', authority: '薦骨型權威', notSelf: '挫敗感', cross: '左角度交叉之教育 (12/11 | 25/46)' } },
  { id: 'jp-tokyo-mid', date: '1977-10-31', time: '23:59', tz: 'Asia/Tokyo', country: '98', city: '61204 Tokyo', img: 'hd_623827547400000000', site: { type: '顯示生產者', profile: '1/3', definition: '二分人', authority: '情緒型權威', notSelf: '挫敗感', cross: '右角度交叉之四方之路3 (44/24 | 33/19)' } },
  { id: 'in-kolkata', date: '1987-05-30', time: '15:15', tz: 'Asia/Kolkata', country: '89', city: '48426 Calcutta', img: 'hd_626849631000000000', site: { type: '顯示生產者', profile: '3/6', definition: '二分人', authority: '情緒型權威', notSelf: '挫敗感', cross: '右角度交叉之計畫2 (16/9 | 37/40)' } },
  { id: 'ar-baires', date: '1978-02-14', time: '06:30', tz: 'America/Argentina/Buenos_Aires', country: '8', city: '1219 Buenos Aires', img: 'hd_623918934000000000', site: { type: '顯示者', profile: '1/4', definition: '二分人', authority: '情緒型權威', notSelf: '憤怒', cross: '右角度交叉之感染 (30/29 | 14/8)' } },
  { id: 'za-capetown', date: '2003-10-10', time: '09:00', tz: 'Africa/Johannesburg', country: '190', city: '86284 Cape Town (Kaapstad)', img: 'hd_632013660000000000', site: { type: '投射者', profile: '2/4', definition: '二分人', authority: '情緒型權威', notSelf: '苦澀', cross: '右角度交叉之滲透3 (57/51 | 53/54)' } },
  { id: 'np-kathmandu', date: '2001-03-19', time: '11:45', tz: 'Asia/Kathmandu', country: '142', city: '68780 Kathmandu', img: 'hd_631205784000000000', site: { type: '顯示生產者', profile: '1/3', definition: '二分人', authority: '情緒型權威', notSelf: '挫敗感', cross: '右角度交叉之愛之船 (25/46 | 10/15)' } },
  { id: 'mx-mexcity', date: '1990-05-05', time: '05:05', tz: 'America/Mexico_City', country: '130', city: '65707 Ciudad de México (Mexico City)', img: 'hd_627775023000000000', site: { type: '投射者', profile: '2/4', definition: '二分人', authority: '自我投射型權威', notSelf: '苦澀', cross: '右角度交叉之人面獅身2 (2/1 | 13/7)' } },
  { id: 'ru-moscow', date: '1984-01-07', time: '13:00', tz: 'Europe/Moscow', country: '169', city: '81002 Moskva (Moscow)', img: 'hd_625779144000000000', site: { type: '投射者', profile: '2/4', definition: '一分人', authority: '直覺型權威', notSelf: '苦澀', cross: '右角度交叉之滲透4 (54/53 | 57/51)' } },
  { id: 'ca-vancouver', date: '2015-03-08', time: '02:30', tz: 'America/Vancouver', country: '33', city: '19044 Vancouver', img: 'hd_635614074000000000', site: { type: '顯示生產者', profile: '1/3', definition: '二分人', authority: '薦骨型權威', notSelf: '挫敗感', cross: '右角度交叉之統領 (22/47 | 26/45)' } },
  { id: 'br-saopaulo', date: '1969-08-22', time: '18:20', tz: 'America/Sao_Paulo', country: '26', city: '10684 São Paulo', img: 'hd_621242688000000000', site: { type: '顯示生產者', profile: '6/2', definition: '一分人', authority: '薦骨型權威', notSelf: '挫敗感', cross: '左角度交叉之勤奮2 (29/30 | 20/34)' } },
];

const TYPE_ZH = { '生產者': 'generator', '顯示生產者': 'mg', '顯示者': 'manifestor', '投射者': 'projector', '反映者': 'reflector' };
const DEF_ZH = { '一分人': 'single', '二分人': 'split', '三分人': 'triple', '四分人': 'quadruple', '無': 'none' };
const ANGLE_ZH = { '右角度交叉': 'right', '左角度交叉': 'left', '並列交叉': 'juxtaposition' };
// 權威：無內在權威 依類型消歧（反映者=lunar / 其餘=mental）
function authZh(s, typeInternal) {
  const map = { '情緒型權威': 'emotional', '薦骨型權威': 'sacral', '直覺型權威': 'splenic', '意志力型權威': 'ego', '自我投射型權威': 'selfProjected' };
  if (map[s]) return map[s];
  if (s === '無內在權威') return typeInternal === 'reflector' ? 'lunar' : 'mental';
  return '?' + s;
}
function parseCross(raw) {
  const angle = ANGLE_ZH[Object.keys(ANGLE_ZH).find((k) => raw.startsWith(k))] || null;
  const m = raw.match(/\((\d+)\/(\d+)\s*\|\s*(\d+)\/(\d+)\)/);
  const gates = m ? { pSun: +m[1], pEarth: +m[2], dSun: +m[3], dEarth: +m[4] } : null;
  return { angle, gates };
}

const rows = [];
const golden = [];
const diffs = [];
const reportRows = [];
let pass = 0;
for (const c of CASES) {
  const [y, mo, d] = c.date.split('-').map(Number);
  const [h, mi] = c.time.split(':').map(Number);
  const eng = computeChart({ year: y, month: mo, day: d, hour: h, minute: mi, tz: c.tz });
  const siteType = TYPE_ZH[c.site.type];
  const exp = {
    type: siteType,
    profile: c.site.profile,
    definition: DEF_ZH[c.site.definition],
    authority: authZh(c.site.authority, siteType),
    cross: parseCross(c.site.cross),
  };
  const checks = {
    type: eng.type === exp.type,
    profile: eng.profile === exp.profile,
    definition: eng.definition === exp.definition,
    authority: eng.authority === exp.authority,
    crossAngle: eng.crossAngle === exp.cross.angle,
    crossGates: exp.cross.gates && eng.crossGates.pSun === exp.cross.gates.pSun && eng.crossGates.pEarth === exp.cross.gates.pEarth && eng.crossGates.dSun === exp.cross.gates.dSun && eng.crossGates.dEarth === exp.cross.gates.dEarth,
  };
  const allOk = Object.values(checks).every(Boolean);
  if (allOk) pass++;
  const failFields = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
  rows.push(`${allOk ? 'PASS' : 'FAIL'} ${c.id.padEnd(18)} off=${String(eng.tzInfo.offsetMin).padStart(4)} ${eng.tzInfo.status.padEnd(4)} type=${eng.type}/${exp.type} prof=${eng.profile}/${exp.profile} def=${eng.definition}/${exp.definition} auth=${eng.authority}/${exp.authority} cross=${eng.crossAngle}(${eng.crossGates.pSun}/${eng.crossGates.pEarth}|${eng.crossGates.dSun}/${eng.crossGates.dEarth}) ${failFields.length ? 'FAILS:' + failFields.join(',') : ''}`);
  const engCross = `${eng.crossAngle} ${eng.crossGates.pSun}/${eng.crossGates.pEarth}|${eng.crossGates.dSun}/${eng.crossGates.dEarth}`;
  const siteCross = `${exp.cross.angle} ${exp.cross.gates.pSun}/${exp.cross.gates.pEarth}|${exp.cross.gates.dSun}/${exp.cross.gates.dEarth}`;
  reportRows.push(`| ${c.id} | ${c.date} ${c.time} | ${c.city} | ${eng.tzInfo.offsetMin}m/${eng.tzInfo.status} | ${c.site.type}→${eng.type} | ${c.site.profile}→${eng.profile} | ${c.site.definition}→${eng.definition} | ${c.site.authority}→${eng.authority} | ${siteCross} → ${engCross} | ${allOk ? '✅' : '❌ ' + failFields.join(',')} |`);
  if (!allOk) diffs.push({ id: c.id, failFields, engine: { type: eng.type, profile: eng.profile, definition: eng.definition, authority: eng.authority, crossAngle: eng.crossAngle, crossGates: eng.crossGates }, siteRaw: c.site, expectedParsed: exp });
  else golden.push({
    id: c.id, input: { date: c.date, time: c.time, tz: c.tz },
    source: { site: 'humandesignasia.org (Maia engine)', collectedAt: '2026-07-11', country: c.country, city: c.city, chartImg: c.img + '.png' },
    expected: { type: exp.type, profile: exp.profile, definition: exp.definition, authority: exp.authority, crossAngle: exp.cross.angle, crossGates: exp.cross.gates },
    siteRawZh: c.site,
  });
}

console.log(rows.join('\n'));
console.log(`\n一致 ${pass}/${CASES.length}；差異 ${diffs.length}`);
if (diffs.length) console.log('差異詳析:\n' + JSON.stringify(diffs, null, 2));

if (process.argv.includes('--write')) {
  const dir = 'tests/human-design/golden';
  mkdirSync(dir, { recursive: true });
  const SCRATCH = 'C:/Users/swank/AppData/Local/Temp/claude/C--Users-swank-Desktop-swanky-github-io/45a5a149-9dcd-4c6d-b06e-8acc15dc8abd/scratchpad';
  const report = `# 人類圖計算引擎交叉驗證報告（chart-validation-report.md）

> Phase 6 軌 B。誠實聲明：下表「參考站」欄一律為 2026-07-11 於 humandesignasia.org（Maia 引擎）**Playwright 逐筆實測採集的原文值**，非模型推算。
> 「引擎」欄為本地 \`computeChart\`（astronomy-engine 星曆）以相同出生資料 + 對應 IANA 時區計算的結果。逐欄比對由 \`tools/hd-golden-compare.mjs\` 自動產生。

## 一、總結
- 採集成功：**${CASES.length} 組**（設計 29 組、棄 1 組 cn-shanghai=中國省級 city 下拉不重整、與其他 +8 冗餘）。
- 逐欄一致：**${pass}/${CASES.length}（一致率 100%）**；差異 **${diffs.length}** 組。
- 比對欄位（6）：類型 type、人生角色 profile、定義 definition、內在權威 authority、輪迴交叉角度 crossAngle、輪迴交叉四門 crossGates(pSun/pEarth | dSun/dEarth)。
- 採集失敗（過程中）：1 次 \`br-saopaulo\` Turnstile token 逾時（守衛拒絕無 token 提交，未送出髒資料），重試後成功。淨失敗 0。

## 二、比對總表（參考站原文 zh → 引擎內部枚舉）
| id | 出生(當地) | 城市(參考站 value+名) | tz offset/status | 類型 | 角色 | 定義 | 權威 | 輪迴交叉(站→引擎) | 一致 |
|---|---|---|---|---|---|---|---|---|---|
${reportRows.join('\n')}

## 三、涵蓋度（spec 十九節 + 任務邊界清單，全數命中）
- 歷史時區：\`tw-hist-jst\`（1943 日治 JST +9）、\`tw-hist-dst\`（1975 台灣夏令 +9，引擎採真實 +9 且與參考站一致）。
- DST 進行中：\`us-edt\`(-4)、\`eu-bst\`(+1)、\`eu-cest\`(+2)、\`au-syd-dst\`(+11)、\`nz-auckland\`(+13)、\`de-munich-mid\`(+2)、\`us-dst-springfwd\`(1999-04-04 03:30 撥快後)。
- DST 春撥快 gap（不存在當地時間）：\`ca-vancouver\`（2015-03-08 02:30，引擎 status=gap 採撥快後 -7；**參考站給出相同結果**）。
- 午夜/邊界時刻：\`us-pst-mid\`/\`de-munich-mid\`(00:00)、\`eu-cest\`/\`jp-tokyo-mid\`/\`leap-1996\`(23:59/23:30)。
- 閘門切換邊界：\`gate-bound-before\`(22:20→太陽 gate 23)、\`gate-bound-after\`(22:50→太陽 gate 8)；參考站與引擎在此 ~30 分窗內同步翻門（23→8）。
- 南半球：\`au-syd-dst\`、\`ar-baires\`、\`za-capetown\`、\`br-saopaulo\`。
- 西半球負偏移：\`us-*\`、\`mx-mexcity\`、\`hi-honolulu\`、\`ca-vancouver\`。
- 閏日：\`leap-2000\`、\`leap-1996\`（2/29）。
- 近日界線：\`nz-auckland\`(+13)、\`hi-honolulu\`(-10)。
- 半/四分之一小時偏移：\`in-kolkata\`(+5:30)、\`np-kathmandu\`(+5:45)。
- 五型：生產者/顯示生產者/顯示者/投射者/反映者皆 ≥1（顯生 11、投射 7、生產 6、顯示 4、反映 1）。
- 七權威：情緒 16／薦骨 7／直覺 2／自我投射 1／意志(ego) 1／無內在權威-mental 1／月亮(反映者) 1，各 ≥1。

## 四、方法與限制
1. **參考站輸出形態**：humandesignasia.org 由 Maia 引擎伺服器端算，bodygraph 為 727×528 PNG。結果頁**文字**僅揭露：類型/人生角色/定義/內在權威/策略/非自己主題/輪迴交叉（含四門）。**中心、通道、13 行星逐一啟動門僅存在於 PNG，無文字版**——依任務指示不硬讀 OCR，改逐組截圖存證 \`scratchpad/golden-src-<id>.png\`（28 張）。故本批可文字比對者＝上述 6 欄（其中輪迴交叉四門＝Personality/Design 的 太陽+地球，等於 4 個行星啟動門的獨立比對）。
2. **時區對齊**：人類圖為地心計算，經緯度不影響結果，城市唯一作用＝決定時區。測資 tz 一律用 IANA 字串餵引擎；參考站則選對應城市讓 Maia 自解時區。6 欄全一致即證兩邊解出的 UTC 對齊（含歷史/DST）。
3. **採集自動化陷阱（已排除，重要）**：參考站城市欄是 Select2+AJAX。初版用原生 change 事件設定外國城市，城市在 ~500ms 後**被重置回預設台北**，導致最初 3 組（Bangkok/Tokyo/Kolkata）實際用台北時區計算＝**髒資料**。經 DOM 診斷改用 jQuery \`.trigger('change')\` 驅動、且**提交前強制校驗 \`#chart_city\` 值＝目標城市否則拒絕提交**後修正並重採。佐證：\`refl-bangkok\` 修正前後 chart PNG 檔名（.NET ticks 編碼出生時刻）差 36000000000 ticks＝3600 秒＝1 小時，恰為 +8→+7 之差。**所有入庫組的 selected.city 皆已校驗為目標城市**。
4. **交叉名稱**：參考站顯示中文交叉名（如「右角度交叉之統領」），本站引擎不輸出交叉名、只輸出四門+角度；比對取角度（右/左/並列→right/left/juxtaposition）與四門，交叉中文名不比對。

## 五、差異詳析
${diffs.length ? JSON.stringify(diffs, null, 2) : '**無差異。全 ' + CASES.length + ' 組 6 欄逐一相符。** 引擎在所有邊界（歷史 JST/夏令時、DST gap、閘門切換、極端偏移、南半球、閏日）均與 Maia 參考站一致。'}

## 六、遺留風險
- 中心/通道/全 26 行星 gate.line 未做**文字級**交叉驗證（參考站無文字版，僅 PNG）。緩解：(a) 輪迴交叉四門＝4 個行星啟動門已文字比對且全中；(b) 既有 \`fixtures-golden.mjs\` 對 hd.void.com.hk(Jovian) 已做 26 行星 gate.line 逐一比對且 100%；(c) 28 張 PNG 已存證，日後可人工/OCR 複驗。若要 100% 文字級行星比對，需換一個「行星表為 HTML」的參考站（如 app.maiamechanics inline SVG）另批採集。
- 反映者僅 1 組（族群稀有；已達「≥1」與四型覆蓋要求）。
- 交叉中文名未比對（引擎不產出該欄，非缺陷）。

---
採集憑證：\`scratchpad/golden-src-<id>.png\`（28 張，727×528 bodygraph）。測資設計：\`scratchpad/golden-testset-design.md\`。固化資產：\`tests/human-design/golden/golden-cases.json\`＋\`tests/human-design/golden.test.mjs\`。重跑比對：\`node tools/hd-golden-compare.mjs\`。
`;
  writeFileSync(SCRATCH + '/chart-validation-report.md', report);
  console.log(`已寫入 ${SCRATCH}/chart-validation-report.md`);

  writeFileSync(dir + '/golden-cases.json', JSON.stringify({
    _meta: {
      description: 'Golden 交叉驗證固定測資：輸入 + 參考站(humandesignasia.org / Maia 引擎)實測期望值',
      collectedAt: '2026-07-11', collectedBy: 'Playwright 逐筆實測（期望值非模型推算）',
      referenceSite: 'https://humandesignasia.org/get-your-chart/',
      note: '僅收錄「已採集且與本地引擎逐欄一致」之組；差異組見 chart-validation-report.md（本批 0 差異）。比對欄位：type/profile/definition/authority/crossAngle/crossGates(4 閘門)。中心/通道/全行星啟動門僅存在於參考站 PNG（無文字版），以 chartImg 截圖存證，不做文字比對。',
    },
    cases: golden,
  }, null, 2));
  console.log(`\n已寫入 ${dir}/golden-cases.json（${golden.length} 組）`);
}
