// hd-bodygraph.js — BodyGraph v2 生產版字串渲染器（純字串產生器，Node 與瀏覽器皆可用）
// 由 scratchpad/v2-theme-render-v26.mjs（用戶拍板的 v26 視覺語言，B Modern Editorial=預設）忠實轉正。
// 幾何吃 hd-geometry-v2.js、外觀吃 hd-theme.js THEMES_V2；資料吃標準 HumanDesignChart（hd-adapter.js 產）。
//
// 逐層（paint 順序：背景→白管→中心→塊內空管→啟動線→啟動圓→閘門數字→金框在背景層）：
//   L1 底＋品牌金髮絲框 · L2 未啟動白管（casing→白芯，per-channel 成對；integ 六條群組繪製避免匯點割痕）
//   L4 九中心 · L4b 塊內延伸空管（casing+塊色芯 clip 到中心＝空管直達插座） · L3 啟動線（P/D／mixed 米特閉縫平行雙線）
//   L5 啟動圓＋未啟動插座（淺墊+深字環） · L6 閘門數字
//
// 報告端紅線（硬約束，未來 Python/PyMuPDF 直吃此字串）：
//   輸出禁 <polygon>（一律 path）、禁 <style> 區塊與 class（一律 inline 屬性）、禁 gradient。
//   （舊 hd-svg-string.js 用 <style>+<polygon> 不能直餵報告端；本檔以 assertReportSafe() 於回傳前把關。）
// role="img" + aria-label 保留（沿用既有 "人類圖 bodygraph"）。

import {
  VIEWBOX2, CENTER_SHAPES2, CENTER_DRAW_ORDER2, GATE_ANCHORS2,
  CHANNEL_PATHS2, GATE_TO_CENTER2, channelHalfDs2, centerPathD2,
} from './hd-geometry-v2.js';
import { THEMES_V2 } from './hd-theme.js';
import { GATES } from './hd-data-gates.js';

// ── theme.skin/channel/gate → 內部 SKIN 形（形狀＝拍板 proto 的 SKIN，值來自 theme tokens）──
function skinOf(theme) {
  const s = theme.skin;
  return {
    pageBg: s.pageBg, surface: s.surface,
    track: s.track,
    active: { ...s.active, personality: theme.channel.personality, design: theme.channel.design },
    centerUndef: s.centerUndef,
    gate: {
      r: s.gate.r, fontSize: s.gate.fontSize, fontWeight: s.gate.fontWeight,
      fontFamily: theme.gate.fontFamily, numericMode: s.gate.numericMode,
      activeRing: s.gate.activeRing, activeRingW: s.gate.activeRingW,
    },
    socket: s.socket,
    goldFrame: s.goldFrame,
  };
}

// fullChannels + hangGates → 64 門的渲染態（inactive/personality/design/mixed）。
// 只逃逸至 mixed、不降級：同門被兩不同態命中 → mixed（與拍板 proto 一致，order-independent）。
function gateStates(chart) {
  const st = {};
  for (let g = 1; g <= 64; g++) st[g] = 'inactive';
  const set = (g, s) => { if (st[g] === 'inactive') st[g] = s; else if (st[g] !== s) st[g] = 'mixed'; };
  for (const [id, s] of Object.entries(chart.fullChannels)) {
    const ch = CHANNEL_PATHS2[id];
    if (s === 'mixed') { set(ch.gateA, 'mixed'); set(ch.gateB, 'mixed'); }
    else { set(ch.gateA, s); set(ch.gateB, s); }
  }
  for (const h of chart.hangGates) set(h.gate, h.state);
  return st;
}

const num = (n) => Math.round(n * 100) / 100;

// 通道長度（P=各段控制多邊形近似；Q=控制多邊形；L=直線）——供 track 由長至短、啟動線由長至短繪製。
function chLen(ch) {
  const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  if (ch.t === 'P') {
    let L = 0, prev = ch.s;
    for (const sg of ch.segs) { L += sg.c ? d(prev, sg.c) + d(sg.c, sg.p) : d(prev, sg.p); prev = sg.p; }
    return L;
  }
  return ch.t === 'Q' ? d(ch.s, ch.c) + d(ch.c, ch.e) : d(ch.s, ch.e);
}
function channelsBottomToTop() {
  return Object.values(CHANNEL_PATHS2).slice().sort((a, b) => {
    const am = a.kind === 'mid' ? 1 : 0, bm = b.kind === 'mid' ? 1 : 0;
    if (am !== bm) return am - bm;
    return chLen(b) - chLen(a);
  });
}

// mixed 平行雙細線（P 段接點以米特平均法線閉縫；Q/L 以弦法線偏移）。
function mixedParallel(SKIN, ch, capjoin) {
  const gap = SKIN.active.mixedGap, w = SKIN.active.mixedW;
  const offBy = (p, n, sign) => [num(p[0] + n[0] * sign * gap / 2), num(p[1] + n[1] * sign * gap / 2)];
  const chordN = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
  const build = (sign) => {
    if (ch.t === 'P') {
      const ptsArr = [ch.s, ...ch.segs.map((sg) => sg.p)];
      const normals = ch.segs.map((sg, i) => chordN(ptsArr[i], sg.p));
      const offAt = (i) => {
        if (i === 0) return offBy(ptsArr[0], normals[0], sign);
        if (i === ch.segs.length) return offBy(ptsArr[i], normals[i - 1], sign);
        const S = [normals[i - 1][0] + normals[i][0], normals[i - 1][1] + normals[i][1]];
        const L2n = S[0] * S[0] + S[1] * S[1];
        if (L2n < 1e-9) return offBy(ptsArr[i], normals[i], sign);
        let ox = S[0] * gap / L2n, oy = S[1] * gap / L2n;
        const mag = Math.hypot(ox, oy);
        if (mag > gap) { ox *= gap / mag; oy *= gap / mag; }
        return [num(ptsArr[i][0] + ox * sign), num(ptsArr[i][1] + oy * sign)];
      };
      const o0 = offAt(0);
      let d = `M${o0[0]},${o0[1]}`;
      for (let i = 0; i < ch.segs.length; i++) {
        const oe = offAt(i + 1);
        d += ch.segs[i].c ? ` Q${offBy(ch.segs[i].c, normals[i], sign).join(',')} ${oe[0]},${oe[1]}` : ` L${oe[0]},${oe[1]}`;
      }
      return d;
    }
    const n = chordN(ch.s, ch.e);
    const s = offBy(ch.s, n, sign), e = offBy(ch.e, n, sign);
    if (ch.t === 'Q') { const c = offBy(ch.c, n, sign); return `M${s[0]},${s[1]} Q${c[0]},${c[1]} ${e[0]},${e[1]}`; }
    return `M${s[0]},${s[1]} L${e[0]},${e[1]}`;
  };
  return `<path d="${build(1)}" fill="none" stroke="${SKIN.active.personality}" stroke-width="${w}" ${capjoin}/>`
    + `<path d="${build(-1)}" fill="none" stroke="${SKIN.active.design}" stroke-width="${w}" ${capjoin}/>`;
}

const centerBBox = (c) => c.kind === 'rect'
  ? { x0: c.x, y0: c.y, x1: c.x + c.w, y1: c.y + c.h }
  : { x0: Math.min(...c.points.map((p) => p[0])), y0: Math.min(...c.points.map((p) => p[1])),
      x1: Math.max(...c.points.map((p) => p[0])), y1: Math.max(...c.points.map((p) => p[1])) };
function chBBox(ch) {
  const pts = [ch.s, ch.e];
  if (ch.c) pts.push(ch.c);
  if (ch.segs) for (const sg of ch.segs) { pts.push(sg.p); if (sg.c) pts.push(sg.c); }
  return { x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])),
           x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) };
}
const bboxHit = (a, b, pad) => a.x0 - pad < b.x1 && a.x1 + pad > b.x0 && a.y0 - pad < b.y1 && a.y1 + pad > b.y0;

// ── HumanDesignChart（gates/channels/centers）→ 內部渲染態（centers/fullChannels/hangGates）──
// 渲染器只認渲染態：中心 'defined' 判斷（'open' 走未定義樣式）、fullChannels（非 off 的四態）、
// hangGates（已啟動但未落在任何定義通道的門，衍生自 64-gate Record → 昇序）。
function toRenderChart(hdChart) {
  const channelsIn = hdChart.channels || {};
  const gatesIn = hdChart.gates || {};

  // fullChannels：保留輸入 channels 的插入序（供 L3 等長排序的穩定 tie-break 可預期）
  const fullChannels = {};
  for (const [id, s] of Object.entries(channelsIn)) if (s !== 'off') fullChannels[id] = s;

  // 落在定義通道內的門（不算懸掛）
  const inFull = new Set();
  for (const id of Object.keys(fullChannels)) {
    const ch = CHANNEL_PATHS2[id];
    if (ch) { inFull.add(ch.gateA); inFull.add(ch.gateB); }
  }

  // hangGates：已啟動、未落在任何定義通道；態由門的 p/d 旗標得（昇序＝deterministic 生產序）
  const hangGates = [];
  for (let g = 1; g <= 64; g++) {
    const gg = gatesIn[g];
    if (!gg || !gg.activated || inFull.has(g)) continue;
    const state = gg.personality && gg.design ? 'mixed' : gg.personality ? 'personality' : 'design';
    hangGates.push({ gate: g, state });
  }

  return { centers: hdChart.centers || {}, fullChannels, hangGates };
}

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 報告端紅線把關：回傳前確認無 polygon/style/class/gradient（保護未來 Python/PyMuPDF 直吃）。
function assertReportSafe(svg) {
  if (/<polygon\b/.test(svg)) throw new Error('hd-bodygraph 紅線違反：輸出含 <polygon>（報告端須一律 path）');
  if (/<style[\s>]/.test(svg)) throw new Error('hd-bodygraph 紅線違反：輸出含 <style> 區塊（報告端須 inline 屬性）');
  if (/\sclass=/.test(svg)) throw new Error('hd-bodygraph 紅線違反：輸出含 class 樣式（報告端須 inline 屬性）');
  if (/linearGradient|radialGradient|stop-opacity/.test(svg)) throw new Error('hd-bodygraph 紅線違反：輸出含 gradient');
  return svg;
}

// ── 分層渲染（theme 差異的唯一入口：SKIN 從 skinOf(theme)、啟動字色從 theme.gate[state].text）──
function renderSvg(theme, chart, opts) {
  const SKIN = skinOf(theme);
  const stubs = opts.stubs !== false; // 塊內空管＝拍板視覺，預設開
  const aria = escAttr(opts.ariaLabel || '人類圖 bodygraph');
  const gs = gateStates(chart);
  const { minX, minY, w, h } = VIEWBOX2;
  const cap = 'stroke-linecap="round" stroke-linejoin="round"';
  const defs = [];
  let uid = 0;

  // L1 底＋品牌金髮絲框（隨 SVG 匯出＝下載 PNG 跟著走）。
  // opts.background===false（透明 PNG 匯出／卡片嵌入時省底）＝整層省略，圖形落在透明或外層卡面上。
  const L1 = [];
  if (opts.background !== false) {
    L1.push(`<rect x="${minX}" y="${minY}" width="${w}" height="${h}" fill="${SKIN.surface}"/>`);
    if (SKIN.goldFrame) {
      const gf = SKIN.goldFrame;
      L1.push(`<rect x="${minX + gf.inset}" y="${minY + gf.inset}" width="${w - 2 * gf.inset}" height="${h - 2 * gf.inset}" rx="${gf.r}" fill="none" stroke="${gf.color}" stroke-opacity="${gf.alpha}" stroke-width="${gf.w}"/>`);
    }
  }

  // L2 未啟動白管：casing（外框）→ 白芯；integ 六條先全 casing 後全芯（匯點無割痕）
  const L2 = [];
  const tk = SKIN.track;
  const sortedCh = channelsBottomToTop();
  const integCh = sortedCh.filter((c) => c.kind === 'integ');
  let integDone = false;
  for (const ch of sortedCh) {
    if (ch.kind === 'integ') {
      if (!integDone) {
        for (const ic of integCh) L2.push(`<path d="${ic.d}" fill="none" stroke="${tk.casing}" stroke-width="${tk.width + 2 * tk.casingW}" ${cap}/>`);
        for (const ic of integCh) L2.push(`<path d="${ic.d}" fill="none" stroke="${tk.color}" stroke-width="${tk.width}" ${cap}/>`);
        integDone = true;
      }
      continue;
    }
    L2.push(`<path d="${ch.d}" fill="none" stroke="${tk.casing}" stroke-width="${tk.width + 2 * tk.casingW}" ${cap}/>`);
    L2.push(`<path d="${ch.d}" fill="none" stroke="${tk.color}" stroke-width="${tk.width}" ${cap}/>`);
  }

  // L3 啟動線（疊於中心之上，直達塊內插座）：完整通道由長至短，mixed 走平行雙線；懸掛門走半段
  const L3 = [];
  const aw = SKIN.active.width, acw = SKIN.active.casingW, acol = SKIN.active.casing;
  const strokePair = (d, col, wd) =>
    `<path d="${d}" fill="none" stroke="${acol}" stroke-width="${wd + 2 * acw}" ${cap}/>`
    + `<path d="${d}" fill="none" stroke="${col}" stroke-width="${wd}" ${cap}/>`;
  const fullSorted = Object.entries(chart.fullChannels)
    .sort((a, b) => chLen(CHANNEL_PATHS2[b[0]]) - chLen(CHANNEL_PATHS2[a[0]]));
  for (const [id, s] of fullSorted) {
    const ch = CHANNEL_PATHS2[id];
    if (s === 'mixed') {
      L3.push(`<path d="${ch.d}" fill="none" stroke="${acol}" stroke-width="${SKIN.active.mixedGap + SKIN.active.mixedW + 2 * acw}" ${cap}/>`);
      L3.push(mixedParallel(SKIN, ch, cap));
    } else {
      L3.push(strokePair(ch.d, s === 'personality' ? SKIN.active.personality : SKIN.active.design, aw));
    }
  }
  for (const hg of chart.hangGates) {
    for (const ch of Object.values(CHANNEL_PATHS2)) {
      if (chart.fullChannels[ch.id]) continue;
      if (ch.gateA !== hg.gate && ch.gateB !== hg.gate) continue;
      const halves = channelHalfDs2(ch);
      const halfD = ch.gateA === hg.gate ? halves[0] : halves[1];
      const col = hg.state === 'personality' ? SKIN.active.personality : SKIN.active.design;
      L3.push(strokePair(halfD, col, aw));
    }
  }

  // L4 九中心（定義填分類色、未定義淺底描邊）
  const L4 = [];
  for (const cid of CENTER_DRAW_ORDER2) {
    const c = CENTER_SHAPES2[cid];
    const d = centerPathD2(c);
    const defined = chart.centers[cid] === 'defined';
    if (defined) L4.push(`<path d="${d}" fill="${theme.centerDefined[cid]}"/>`);
    else L4.push(`<path d="${d}" fill="${SKIN.centerUndef.fill}" stroke="${SKIN.centerUndef.stroke}" stroke-width="${SKIN.centerUndef.sw}"/>`);
  }

  // L4b 塊內延伸空管（clip 到中心形狀：casing+塊色芯 → 未亮通道也「連通到插座」的空管感）
  const L4b = [];
  if (stubs) {
    for (const cid of CENTER_DRAW_ORDER2) {
      const c = CENTER_SHAPES2[cid];
      const bb = centerBBox(c);
      const fill = chart.centers[cid] === 'defined' ? theme.centerDefined[cid] : SKIN.centerUndef.fill;
      const casings = [], cores = [];
      for (const ch of Object.values(CHANNEL_PATHS2)) {
        if (!bboxHit(chBBox(ch), bb, 8)) continue;
        casings.push(`<path d="${ch.d}" fill="none" stroke="${tk.casing}" stroke-width="${tk.width + 2 * tk.casingW}" ${cap}/>`);
        cores.push(`<path d="${ch.d}" fill="none" stroke="${fill}" stroke-width="${tk.width}" ${cap}/>`);
      }
      if (!casings.length) continue;
      defs.push(`<clipPath id="clip-${cid}"><path d="${centerPathD2(c)}"/></clipPath>`);
      L4b.push(`<g clip-path="url(#clip-${cid})">` + casings.join('') + cores.join('') + `</g>`);
    }
  }

  // L5 啟動圓＋未啟動插座（淺墊+深字環）；L6 閘門數字
  const L5 = [], L6 = [];
  const gt = SKIN.gate;
  for (let g = 1; g <= 64; g++) {
    const [x, y] = GATE_ANCHORS2[g];
    const st = gs[g];
    let txtColor;
    if (st === 'inactive') {
      const cid = GATE_TO_CENTER2[g];
      const defined = chart.centers[cid] === 'defined';
      const bg = defined ? SKIN.socket.pad[cid] : SKIN.socket.undefPad;
      L5.push(`<circle cx="${x}" cy="${y}" r="${gt.r}" fill="${bg}" stroke="${SKIN.socket.stroke}" stroke-width="${SKIN.socket.sw}"/>`);
      txtColor = SKIN.socket.text;
    } else {
      const ring = ` stroke="${gt.activeRing}" stroke-width="${gt.activeRingW}"`;
      if (st === 'mixed') {
        txtColor = theme.gate.mixed.text;
        const cid2 = `gm${uid++}`;
        defs.push(`<clipPath id="${cid2}"><rect x="${x - gt.r}" y="${y - gt.r}" width="${gt.r}" height="${gt.r * 2}"/></clipPath>`);
        L5.push(`<circle cx="${x}" cy="${y}" r="${gt.r}" fill="${SKIN.active.design}"${ring}/>`);
        L5.push(`<circle cx="${x}" cy="${y}" r="${gt.r}" fill="${SKIN.active.personality}" clip-path="url(#${cid2})"/>`);
      } else {
        txtColor = theme.gate[st].text;
        const fill = st === 'personality' ? SKIN.active.personality : SKIN.active.design;
        L5.push(`<circle cx="${x}" cy="${y}" r="${gt.r}" fill="${fill}"${ring}/>`);
      }
    }
    L6.push(`<text x="${x}" y="${y}" fill="${txtColor}" font-size="${gt.fontSize}" font-weight="${gt.fontWeight}" font-family="${gt.fontFamily}" text-anchor="middle" dominant-baseline="central" style="font-variant-numeric:${gt.numericMode}">${g}</text>`);
  }

  // L7 互動 hit 層（opts.interactive；預設關）：透明疊加、只帶 data-*／tabindex／role／aria，供頁面事件委派與高亮。
  // 純附加、不改任何視覺層 → 剝掉 data-hit 元素後與非互動輸出 byte-identical（golden 測試據此驗零漂移）。
  // 報告端紅線不觸（無 polygon/style/class/gradient）；預設關＝結構計數測試（path/circle）不受影響。
  // 疊放序：中心面（大）→ 通道線（中）→ 閘門圓（小，最上，觸控優先）。
  let L7 = '';
  if (opts.interactive) {
    const hitR = theme.gate.hitRadius;
    const stZh = { inactive: '未啟動', personality: '個性啟動', design: '設計啟動', mixed: '雙重啟動' };
    const parts = [];
    for (const cid of CENTER_DRAW_ORDER2) {
      parts.push(`<path d="${centerPathD2(CENTER_SHAPES2[cid])}" fill="transparent" data-center="${cid}" data-hit="center"/>`);
    }
    for (const ch of Object.values(CHANNEL_PATHS2)) {
      parts.push(`<path d="${ch.d}" fill="none" stroke="transparent" stroke-width="24" data-channel="${ch.id}" data-hit="chan" ${cap}/>`);
    }
    for (let g = 1; g <= 64; g++) {
      const [x, y] = GATE_ANCHORS2[g];
      const info = GATES[g];
      const label = escAttr(`閘門 ${g}${info ? ` ${info.hexZh}·${info.keyword}` : ''}，${stZh[gs[g]] || '未啟動'}`);
      parts.push(`<circle cx="${x}" cy="${y}" r="${hitR}" fill="transparent" data-gate="${g}" data-hit="gate" tabindex="0" role="button" aria-label="${label}"/>`);
    }
    L7 = `<g>${parts.join('')}</g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${aria}">`
    + `<defs>${defs.join('')}</defs>`
    + `<g>${L1.join('')}</g><g>${L2.join('')}</g><g>${L4.join('')}</g><g>${L4b.join('')}</g><g>${L3.join('')}</g><g>${L5.join('')}</g><g>${L6.join('')}</g>`
    + L7
    + `</svg>`;
}

// ── 公開 API ──────────────────────────────────────────────────────────────────
// renderBodygraph(hdChart, opts) → SVG 字串。
//   hdChart：標準 HumanDesignChart（hd-adapter.js toHumanDesignChart 產）。
//   opts.theme：'classic' | 'modern' | 'dark'（預設 'modern'＝B Modern Editorial）。
//   opts.stubs：塊內空管，預設 true（拍板視覺；設 false 可關）。
//   opts.ariaLabel：無障礙標籤（預設 '人類圖 bodygraph'）。
//   opts.interactive：附加 L7 透明 hit 層（data-gate/data-channel/data-center＋tabindex/role/aria），預設 false。
//     頁面互動傳 true；靜態匯出／報告端維持 false（結構計數與 byte 基準不受影響）。
//   opts.background：是否畫 L1 卡面底＋金框，預設 true；透明 PNG 匯出與卡片嵌入傳 false。
export function renderBodygraph(hdChart, opts = {}) {
  const theme = THEMES_V2[opts.theme] || THEMES_V2.modern;
  const chart = toRenderChart(hdChart);
  return assertReportSafe(renderSvg(theme, chart, opts));
}
