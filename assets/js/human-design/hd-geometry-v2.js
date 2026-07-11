// hd-geometry-v2.js — BodyGraph v2 幾何單一事實來源
// v2 幾何，viewBox 1000×1400，中軸 x=500，內容約 x[120,880] y[95,1305]（置中於 500,700）。
// spec 見私檔 hd-redesign-spec-v2.md（第三～七節）。設計範式（對齊 Maia 現代 app 品味基準）：
//   - 中軸五段（head-ajna / ajna-throat / throat-g / g-sacral / sacral-root）＝筆直平行管（15 條 L 直線）。
//   - 離軸長通道＝溫和 Q 弧、向外鼓出（15 條），形成優雅環繞感而非工程直線格陣。
//   - Integration（10/20/34/57）＝v2.5.1 案 U「三線 Y 樹」（用戶第九輪紅線裁決，取代 v2.5 共幹）：
//     主線 20→57 沿左側大弧掃下、10/34 各出一條支線併入主線；六條通道＝段組合、共享段「座標完全相同」→
//     白管收斂成一主線＋兩支線；匯點 J10/J34 裸露在主線上（平滑 Y、無節點記號；座標見 IT 常數）。
// 座標全自建、不複製任何站的 SVG path。舊檔 hd-geometry.js 保留回退，本檔不動舊檔。
// 半段切分沿用舊檔 De Casteljau 思路（見 channelHalfDs2）。gate 圓直徑 30（r15）、字級 18。

export const VIEWBOX2 = { minX: 0, minY: 0, w: 1000, h: 1400 };

// 3 條中軸垂直管的 x 座標。
export const AXIS_COLS = { L: 450, C: 500, R: 550 };

// ── 九大中心形狀 ──────────────────────────────────────────────────────────────
// 每個中心：kind（poly 頂點 / rect）、gates 清單、labelPos（tooltip/圖例錨點）、a11yLabel。
// 形狀維持經典辨識：頭△尖上、Ajna▽尖下、喉□、G◇、意志小△、脾▷尖右內、情緒◁尖左內、薦骨□、根□。
// （v2.3 用戶第五輪修正：脾/情緒尖端朝「內」指向薦骨——先前朝外做反；比對 myBodyGraph 官方盤。）
// G 是視覺核心、對角 156 為九中心最大；情緒(solar)與脾(spleen)構成左右最寬點且左右平衡、不搶注意力。
export const CENTER_SHAPES2 = {
  head: {
    kind: 'poly', cornerR: 24, points: [[500, 95], [610, 225], [390, 225]],
    gates: [64, 61, 63], labelPos: [500, 175], a11yLabel: '頭腦中心（Head）',
  },
  ajna: {
    kind: 'poly', cornerR: 24, points: [[390, 275], [610, 275], [500, 415]],
    gates: [47, 24, 4, 17, 11, 43], labelPos: [500, 330], a11yLabel: '邏輯中心（Ajna）',
  },
  throat: {
    kind: 'rect', x: 425, y: 470, w: 150, h: 158, r: 26,
    gates: [62, 23, 56, 16, 20, 35, 12, 45, 31, 8, 33],
    labelPos: [500, 549], a11yLabel: '喉嚨中心（Throat）',
  },
  g: {
    kind: 'poly', cornerR: 18, points: [[500, 699], [586, 785], [500, 871], [414, 785]],
    gates: [1, 7, 13, 10, 25, 15, 46, 2], labelPos: [500, 785], a11yLabel: 'G 中心（自我定位）',
  },
  // v2.1（2026-07-10 用戶紅圈修訂）：Heart 由 G 右「上」下移至 G 右「下」（經典盤位置；spec 三節原文「右上」為誤）。
  // v2.3 微放大（邊 104→114、內切圓半徑 32）：4 顆 r15 閘門圓才能完整內含（v2.3 閘門不出框規則）。
  // v2.5（用戶第八輪）：尖端翻轉朝「上」（照 myBodyGraph）——21 近上尖、51 中央、26 左下角、40 右下角；
  // 四條通道自然三向分流不交錯：21-45 由上入尖、25-51 左上邊入、26-44 左下角向左出、37-40 右下角向右入。
  heart: {
    kind: 'poly', cornerR: 16, points: [[640, 797], [697, 893], [583, 893]],
    gates: [21, 40, 26, 51], labelPos: [720, 861], a11yLabel: '意志力中心（Heart / Ego）',
  },
  spleen: {
    kind: 'poly', cornerR: 26, points: [[120, 895], [120, 1105], [282, 1000]],
    gates: [48, 57, 44, 50, 32, 28, 18], labelPos: [180, 1000], a11yLabel: '直覺中心（Spleen）',
  },
  sacral: {
    kind: 'rect', x: 425, y: 935, w: 150, h: 150, r: 26,
    gates: [5, 14, 29, 34, 27, 59, 42, 3, 9],
    labelPos: [500, 1010], a11yLabel: '薦骨中心（Sacral）',
  },
  solar: {
    kind: 'poly', cornerR: 26, points: [[880, 895], [880, 1105], [718, 1000]],
    gates: [36, 22, 37, 6, 49, 55, 30], labelPos: [820, 1000], a11yLabel: '情緒中心（Solar Plexus）',
  },
  root: {
    kind: 'rect', x: 425, y: 1155, w: 150, h: 150, r: 26,
    gates: [53, 60, 52, 54, 38, 58, 19, 39, 41],
    labelPos: [500, 1230], a11yLabel: '根部中心（Root）',
  },
};

// 渲染順序（中心層）：脊柱由上而下，脾/情緒最後（避免尖端壓過中軸）。
export const CENTER_DRAW_ORDER2 = ['head', 'ajna', 'throat', 'g', 'sacral', 'root', 'spleen', 'solar', 'heart'];

// ── 64 閘門固定錨點 [x, y] ────────────────────────────────────────────────────
// 中軸段閘門對齊三管 x∈{450,500,550}；側翼閘門沿中心邊緣排列；圓點直徑 30、不遮通道轉折。
// v2.3 全面內收：每顆閘門圓（r15）完整落在所屬中心塊內（rect＝內縮 bbox、poly＝到各邊距離≥15），
// 通道端點＝錨點 → 線視覺上「從這顆閘門長出、接到那顆閘門」（配合 renderer 通道疊於中心之上）。
export const GATE_ANCHORS2 = {
  // 頭腦 Head（底邊三管，連下接 Ajna）
  64: [450, 205], 61: [500, 205], 63: [550, 205],
  // 邏輯 Ajna（上排三管接頭腦；17/11 沿斜邊內收、43 近尖端）
  47: [450, 297], 24: [500, 297], 4: [550, 297], 17: [458, 333], 11: [542, 333], 43: [500, 388],
  // 喉嚨 Throat（上排接 Ajna、下排接 G；左緣 16/20、右緣 35/12/45；全數內縮 bbox x[440,560] y[485,613]）
  62: [450, 486], 23: [500, 486], 56: [550, 486],
  16: [441, 528], 20: [441, 566], 35: [559, 520], 12: [559, 553], 45: [559, 584],
  31: [450, 612], 8: [500, 612], 33: [550, 612],
  // G 自我（◇ 八閘門；10 近左尖為 integration 樞紐、25 近右尖出意志；斜邊距≥15）
  1: [500, 722], 7: [462, 760], 13: [538, 760], 10: [437, 785], 25: [563, 785],
  15: [462, 810], 46: [538, 810], 2: [500, 848],
  // 意志力 Heart/Ego（小△尖朝上，G 右下；v2.5）：21 近上尖、51 中央、26/40 貼左右下角（斜邊距≈15.6 極限靠角）
  21: [640, 830], 40: [670, 878], 26: [610, 878], 51: [640, 861],
  // 直覺 Spleen（v2.3 尖朝右）：48/57/44 沿上斜邊由外而內、50 近尖端、32/28/18 沿下斜邊由內而外（照 myBodyGraph）
  48: [146, 940], 57: [186, 962], 44: [226, 984], 50: [252, 1000], 32: [226, 1016], 28: [186, 1038], 18: [146, 1060],
  // 薦骨 Sacral（上排接 G、下排接根；左緣 34(integration)/27、右緣 59；內縮 bbox x[440,560] y[950,1070]）
  5: [450, 957], 14: [500, 957], 29: [550, 957], 34: [440, 995], 27: [440, 1035], 59: [560, 1010],
  42: [450, 1063], 3: [500, 1063], 9: [550, 1063],
  // 情緒 Solar Plexus（v2.3 尖朝左，鏡像脾）：36/22/37 沿上斜邊由外而內、6 近尖端、49/55/30 沿下斜邊
  36: [854, 940], 22: [814, 962], 37: [774, 984], 6: [748, 1000], 49: [774, 1016], 55: [814, 1038], 30: [854, 1060],
  // 根 Root（上排接薦骨；左欄 54/38/58 接脾、右欄 19/39/41 接情緒；內縮 bbox x[440,560] y[1170,1290]）
  53: [450, 1177], 60: [500, 1177], 52: [550, 1177],
  54: [442, 1215], 38: [442, 1250], 58: [442, 1285], 19: [558, 1215], 39: [558, 1250], 41: [558, 1285],
};

// gate → center 反查表（由 CENTER_SHAPES2 導出，供 renderer / 驗證用）。
export const GATE_TO_CENTER2 = (() => {
  const m = {};
  for (const [cid, c] of Object.entries(CENTER_SHAPES2)) for (const g of c.gates) m[g] = cid;
  return m;
})();

// ── 36 通道 ──────────────────────────────────────────────────────────────────
// 每條：gateA（小）、gateB（大）、t（'L' 直線 / 'Q' 二次貝茲弧 / 'P' 多段路徑）、c（Q 控制點）、
// segs（P 專用：[{c?,p}...] 自 gateA 錨點起的各段——c 有值為 Q 段、無則 L 段，最後一段 p＝gateB 錨點）。
// 端點 s/e 直接取自 GATE_ANCHORS2（DRY、避免座標漂移）：s=gateA 端、e=gateB 端。
// 說明分三類：mid=中軸直管、arc=離軸溫和弧、integ=Integration 專用。

// v2.5.1 案 U（用戶第九輪紅線裁決，草圖 12.png）：Integration 六條＝「三條實體線的 Y 樹」：
//   主線＝喉20 →沿左側大弧掃下→ 脾57，被兩個匯點切三段（上段 20→J10、中段 J10→J34、末段 J34→57）；
//   建法＝單一母曲線 Q(p20, C=[225,770], p57) 以 blossom 在 t=0.55/0.815 細分 → 匯點兩側控制點共線＝主線全程 G1 平滑。
//   10 支線＝G10 →微拱近水平→ J10（主線左鼓處）；34 支線＝薦34 →爬升拱越 26-44→ J34（主線靠 57 端，
//   末段留 ~74（>2 插座徑）白管——J34 不貼 57 插座，20-34/10-34 亮時不誤讀為觸及 57）。
//   六通道＝段組合：20-57=上中末｜10-20=支10+上｜10-57=支10+中末｜10-34=支10+中+支34｜20-34=上中+支34｜34-57=支34+末。
//   共享段座標完全相同 → 白管收斂成 Y 樹；共享段同亮歧義由插座亮暗消歧（用戶已理解並接受此取捨）。
//   支線刻意以 ~50-53° 併入、不做正切合流：正切會在匯點旁與主線疊出「偽共段」、且反向使用時成 180° 髮夾。
const IT = {
  J10: [257, 786.8],   // 匯點一（10 支線併入；母曲線 t=0.55，近 gate10 等高）
  J34: [206.5, 890.6], // 匯點二（34 支線併入；母曲線 t=0.815，距 57 約 74）
  cUp: [322.2, 678.2],  // 主線上段控制（出 20 約 43° 下左）
  cMid: [225.5, 839.1], // 主線中段控制（與 cUp/J10 共線、與 J34/cTail 共線）
  cTail: [193.2, 926.5],// 主線末段控制（自上方陡入 57，穿過 48/44 插座間淨空）
  cB10: [349, 777],     // 10 支線控制（微拱 ~4、以 ~53° 併入 J10）
  cB34: [310, 853],     // 34 支線控制（爬升 47°、apex≈(251,883)、與 26-44 成 ~51° 交錯後下探併入 J34）
  p10: GATE_ANCHORS2[10], p20: GATE_ANCHORS2[20], p34: GATE_ANCHORS2[34], p57: GATE_ANCHORS2[57], // 端點＝閘門錨點（DRY）
};

const CH_DEF = [
  // 中軸五段・筆直平行管（15）
  { a: 47, b: 64, t: 'L', k: 'mid' }, { a: 24, b: 61, t: 'L', k: 'mid' }, { a: 4, b: 63, t: 'L', k: 'mid' },
  { a: 17, b: 62, t: 'L', k: 'mid' }, { a: 23, b: 43, t: 'L', k: 'mid' }, { a: 11, b: 56, t: 'L', k: 'mid' },
  { a: 1, b: 8, t: 'L', k: 'mid' }, { a: 7, b: 31, t: 'L', k: 'mid' }, { a: 13, b: 33, t: 'L', k: 'mid' },
  { a: 2, b: 14, t: 'L', k: 'mid' }, { a: 5, b: 15, t: 'L', k: 'mid' }, { a: 29, b: 46, t: 'L', k: 'mid' },
  { a: 3, b: 60, t: 'L', k: 'mid' }, { a: 9, b: 52, t: 'L', k: 'mid' }, { a: 42, b: 53, t: 'L', k: 'mid' },
  // 離軸大弧（15）——v2.2 弧族嵌套：同族相鄰弧以「apex 垂直偏移≈33」保持等距平行感
  // （translated-chord 天真法在近垂直段會黏管；改用 apex-offset：apex_inner = apex_outer + 33·n̂⊥）。
  { a: 16, b: 48, t: 'Q', c: [212, 676], k: 'arc' },   // 喉→脾上斜邊外側（上左族・外）
  { a: 35, b: 36, t: 'Q', c: [789, 673], k: 'arc' },   // 喉→情緒上斜邊外側（上右族・外）
  { a: 12, b: 22, t: 'Q', c: [753, 684], k: 'arc' },   // 喉→情緒（上右族・內，apex-offset 34）
  { a: 27, b: 50, t: 'Q', c: [346, 1038], k: 'arc' },  // 薦→脾尖（近水平微垂）
  { a: 6, b: 59, t: 'Q', c: [654, 1028], k: 'arc' },   // 情緒尖→薦（近水平微垂）
  { a: 32, b: 54, t: 'Q', c: [287, 1167], k: 'arc' },  // 脾下斜邊→根（下左族・內）
  { a: 28, b: 38, t: 'Q', c: [258, 1191], k: 'arc' },  // 下左族・中（apex-offset 36）
  { a: 18, b: 58, t: 'Q', c: [229, 1216], k: 'arc' },  // 下左族・外（apex-offset 72）
  { a: 19, b: 49, t: 'Q', c: [713, 1167], k: 'arc' },  // 根→情緒下斜邊（下右族・內，鏡像）
  { a: 39, b: 55, t: 'Q', c: [742, 1191], k: 'arc' },  // 下右族・中
  { a: 30, b: 41, t: 'Q', c: [771, 1216], k: 'arc' },  // 下右族・外
  { a: 21, b: 45, t: 'Q', c: [636, 700], k: 'arc' },   // v2.5：喉45→意志21 近垂直微右弧、貫上尖入 21（heart 尖朝上後由上分流）
  { a: 25, b: 51, t: 'Q', c: [588, 846], k: 'arc' },   // v2.5：G右25→意志51 短弧（apex≈595,835），穿 heart 左上斜邊入 51、避開 26 插座（t0.7 距 26 圓心 30）
  { a: 37, b: 40, t: 'Q', c: [750, 890], k: 'arc' },   // v2.5：情緒37→意志40 右下角橫入（apex≈736,911，入角約水平——heart 右向分流）
  { a: 26, b: 44, t: 'Q', c: [310, 920], k: 'arc' },   // v2.5：意志26 左下角向左出→脾44（apex≈359,930）；過 G 下方淨空16、與主幹 75° 乾淨交錯、與分岔的必然交點壓在脾邊界（x≈243）
  // Integration 專用幾何（6）——v2.5.1 案 U Y 樹：六條＝IT 段組合（P=多段路徑：segs=[{c?,p}...] 自 gateA 錨點起；
  // Q 段反向共用同一控制點 → 共享段兩向座標完全相同、白管精確疊合）
  { a: 10, b: 20, t: 'P', segs: [{ c: IT.cB10, p: IT.J10 }, { c: IT.cUp, p: IT.p20 }], k: 'integ' },  // 支10＋上段
  { a: 10, b: 34, t: 'P', segs: [{ c: IT.cB10, p: IT.J10 }, { c: IT.cMid, p: IT.J34 }, { c: IT.cB34, p: IT.p34 }], k: 'integ' },  // 支10＋中段＋支34
  { a: 10, b: 57, t: 'P', segs: [{ c: IT.cB10, p: IT.J10 }, { c: IT.cMid, p: IT.J34 }, { c: IT.cTail, p: IT.p57 }], k: 'integ' }, // 支10＋中段＋末段
  { a: 20, b: 34, t: 'P', segs: [{ c: IT.cUp, p: IT.J10 }, { c: IT.cMid, p: IT.J34 }, { c: IT.cB34, p: IT.p34 }], k: 'integ' },   // 上段＋中段＋支34
  { a: 20, b: 57, t: 'P', segs: [{ c: IT.cUp, p: IT.J10 }, { c: IT.cMid, p: IT.J34 }, { c: IT.cTail, p: IT.p57 }], k: 'integ' },  // 主線全長（上中末）
  { a: 34, b: 57, t: 'P', segs: [{ c: IT.cB34, p: IT.J34 }, { c: IT.cTail, p: IT.p57 }], k: 'integ' },  // 支34＋末段
];

const pt = (p) => `${p[0]},${p[1]}`;

// P 段序列 → path 尾串（不含開頭 M）。
const segsD = (segs) => segs.map((sg) => (sg.c ? ` Q${pt(sg.c)} ${pt(sg.p)}` : ` L${pt(sg.p)}`)).join('');

// 由定義建 CHANNEL_PATHS2（物件，鍵＝"小-大"）。每筆含 id/gateA/gateB/t/c/segs/kind/d（整條 path）。
export const CHANNEL_PATHS2 = (() => {
  const out = {};
  for (const def of CH_DEF) {
    const id = `${def.a}-${def.b}`;
    const s = GATE_ANCHORS2[def.a];
    const e = GATE_ANCHORS2[def.b];
    const d = def.t === 'P' ? `M${pt(s)}${segsD(def.segs)}`
      : def.t === 'Q' ? `M${pt(s)} Q${pt(def.c)} ${pt(e)}` : `M${pt(s)} L${pt(e)}`;
    out[id] = { id, gateA: def.a, gateB: def.b, t: def.t, c: def.c || null, segs: def.segs || null, kind: def.k, s, e, d };
  }
  return out;
})();

// 整條通道 path d（顏色連續連接兩中心）。
export function channelFullD2(ch) {
  if (ch.t === 'P') return ch.d;
  return ch.t === 'Q' ? `M${pt(ch.s)} Q${pt(ch.c)} ${pt(ch.e)}` : `M${pt(ch.s)} L${pt(ch.e)}`;
}

// 把通道在 t=0.5 切兩半（直線取中點、貝茲用 De Casteljau；P=依各段長度取全程中點、分割所在段）。
// 回傳 [gateA 半段 d, gateB 半段 d]，對齊 ch.gateA / ch.gateB——供懸掛閘門「只延伸到中點」。
export function channelHalfDs2(ch) {
  const s = ch.s, e = ch.e;
  if (ch.t === 'P') {
    const r2 = (v) => Math.round(v * 100) / 100;
    const lerp = (a, b, t) => [r2(a[0] + (b[0] - a[0]) * t), r2(a[1] + (b[1] - a[1]) * t)];
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    // 各段長（Q 用控制多邊形均值近似——僅供取中點，視覺精度足夠）
    const segs = [];
    let prev = s;
    for (const sg of ch.segs) {
      const len = sg.c ? (dist(prev, sg.c) + dist(sg.c, sg.p) + dist(prev, sg.p)) / 2 : dist(prev, sg.p);
      segs.push({ c: sg.c || null, p: sg.p, s: prev, len });
      prev = sg.p;
    }
    const half = segs.reduce((a, b) => a + b.len, 0) / 2;
    let acc = 0, i = 0;
    while (i < segs.length - 1 && acc + segs[i].len < half) { acc += segs[i].len; i++; }
    const sg = segs[i]; // 含全程中點的段
    const tt = Math.min(1, Math.max(0, (half - acc) / sg.len));
    let midTail, midHead, m;
    if (!sg.c) {
      m = lerp(sg.s, sg.p, tt);
      midTail = ` L${pt(m)}`;
      midHead = `M${pt(m)} L${pt(sg.p)}`;
    } else {
      const c1 = lerp(sg.s, sg.c, tt), c2 = lerp(sg.c, sg.p, tt);
      m = lerp(c1, c2, tt);
      midTail = ` Q${pt(c1)} ${pt(m)}`;
      midHead = `M${pt(m)} Q${pt(c2)} ${pt(sg.p)}`;
    }
    let d1 = `M${pt(s)}`;
    for (let k = 0; k < i; k++) d1 += segs[k].c ? ` Q${pt(segs[k].c)} ${pt(segs[k].p)}` : ` L${pt(segs[k].p)}`;
    d1 += midTail;
    let d2 = midHead;
    for (let k = i + 1; k < segs.length; k++) d2 += segs[k].c ? ` Q${pt(segs[k].c)} ${pt(segs[k].p)}` : ` L${pt(segs[k].p)}`;
    return [d1, d2];
  }
  if (ch.t === 'L') {
    const m = [(s[0] + e[0]) / 2, (s[1] + e[1]) / 2];
    return [`M${pt(s)} L${pt(m)}`, `M${pt(m)} L${pt(e)}`];
  }
  const c = ch.c;
  const m = [0.25 * s[0] + 0.5 * c[0] + 0.25 * e[0], 0.25 * s[1] + 0.5 * c[1] + 0.25 * e[1]];
  const c1 = [(s[0] + c[0]) / 2, (s[1] + c[1]) / 2];
  const c2 = [(c[0] + e[0]) / 2, (c[1] + e[1]) / 2];
  return [`M${pt(s)} Q${pt(c1)} ${pt(m)}`, `M${pt(m)} Q${pt(c2)} ${pt(e)}`];
}

// 中心形狀 → SVG path d（rect 走圓角、poly 依 cornerR 圓角化頂點；無 cornerR 則折線閉合）。renderer/驗證共用。
// v2.2：poly 圓角＝每頂點沿兩鄰邊各退 cornerR，以 Q（控制點＝原頂點）補圓——三角/菱形變柔和 squircle 感。
export function centerPathD2(shape) {
  if (shape.kind === 'rect') {
    const { x, y, w, h } = shape;
    const r = Math.min(shape.r || 0, w / 2, h / 2);
    if (!r) return `M${x},${y} h${w} v${h} h${-w} Z`;
    return `M${x + r},${y} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 ${-r},${r} h${-(w - 2 * r)} a${r},${r} 0 0 1 ${-r},${-r} v${-(h - 2 * r)} a${r},${r} 0 0 1 ${r},${-r} Z`;
  }
  const ptsArr = shape.points;
  const r = shape.cornerR || 0;
  if (!r) return 'M' + ptsArr.map(pt).join(' L') + ' Z';
  const n = ptsArr.length;
  const f = (v) => Math.round(v * 100) / 100;
  let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = ptsArr[(i + n - 1) % n], p1 = ptsArr[i], p2 = ptsArr[(i + 1) % n];
    const v1 = [p0[0] - p1[0], p0[1] - p1[1]], l1 = Math.hypot(v1[0], v1[1]);
    const v2 = [p2[0] - p1[0], p2[1] - p1[1]], l2 = Math.hypot(v2[0], v2[1]);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const a = [f(p1[0] + (v1[0] / l1) * rr), f(p1[1] + (v1[1] / l1) * rr)]; // 進入點（沿前邊退 rr）
    const b = [f(p1[0] + (v2[0] / l2) * rr), f(p1[1] + (v2[1] / l2) * rr)]; // 離開點（沿後邊退 rr）
    d += (i === 0 ? `M${a[0]},${a[1]}` : ` L${a[0]},${a[1]}`) + ` Q${p1[0]},${p1[1]} ${b[0]},${b[1]}`;
  }
  return d + ' Z';
}
