// hd-bodygraph-compose.js — 合盤 BodyGraph 渲染器（v2 幾何/主題共用，additive 新檔）。
// 吃 computeComposite（hd-composite.js）輸出的正規化 render model——renderer 不重算分類規則（spec §5.5）。
// 視覺語言＝單人 v26「白管插座」延伸＋合盤 A/B 雙編碼：
//   A＝實線、B＝虛線（非顏色雙編碼，灰階/色盲可辨）；owner 上色（A 青/B 洋紅系，tokens 見 hd-theme compose）。
//   electromagnetic＝兩半段各上 owner 色＋中點接合圓；companionship＝A 底實線＋B 虛線疊（報告端 both 語彙）；
//   dominance／compromise＝完整方全長線（差異由閘門圓呈現：妥協的對方端＝左右半圓 both 圓）。
//   未啟動通道＝白管＋插座照舊。閘門圓：A 色／B 色／both 左右半圓／未啟動插座。
//   四類辨識＝啟動線 casing 上四類語意色（電磁金／同伴綠／主導紫／妥協橙）——B2 選型「案 B」，
//   站主 2026-07-11 看圖拍板（選型材料 docs/hd-redesign/composite-visual-proposals.html）。
// 與報告端同級紅線：輸出不得含 polygon/style=/class=/gradient（assertComposeReportSafe，回傳前 throw）。
import {
  VIEWBOX2, CENTER_SHAPES2, GATE_ANCHORS2, CHANNEL_PATHS2, CENTER_DRAW_ORDER2,
  GATE_TO_CENTER2, channelFullD2, channelHalfDs2, centerPathD2,
} from './hd-geometry-v2.js';
import { THEMES_V2 } from './hd-theme.js';
import { CHANNELS } from './hd-data-channels.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const FORBIDDEN = [/<polygon/i, /\bstyle=/i, /\bclass=/i, /gradient/i];
export function assertComposeReportSafe(svg) {
  for (const re of FORBIDDEN) {
    if (re.test(svg)) throw new Error(`合盤 SVG 觸犯報告安全紅線：${re}`);
  }
  return svg;
}

// d2 以「M<x>,<y>」開頭（channelHalfDs2 佈局保證）→ 通道全程中點座標
function midPointOf(halfD2) {
  const m = halfD2.match(/^M(-?[\d.]+),(-?[\d.]+)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

function ownerColor(owner, ct) { return owner === 'a' ? ct.a.color : ct.b.color; }

export function renderCompositeBodygraph(composite, opts = {}) {
  if (!composite || composite.version !== 1 || !composite.channels || !composite.gates || !composite.centers) {
    throw new Error('renderCompositeBodygraph: 需要 computeComposite 輸出（version 1）');
  }
  const themeId = opts.theme || 'modern';
  const theme = THEMES_V2[themeId];
  if (!theme) throw new Error(`未知主題 ${themeId}`);
  const ct = theme.compose;
  const skin = theme.skin;
  const interactive = !!opts.interactive;
  const background = opts.background !== false;
  const ariaLabel = opts.ariaLabel || '人類圖合盤 BodyGraph';

  const { minX, minY, w, h } = VIEWBOX2;
  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${w} ${h}" role="img" aria-label="${esc(ariaLabel)}">`);

  // L1 背景＋卡面＋品牌金髮絲框
  if (background) {
    out.push(`<rect x="${minX}" y="${minY}" width="${w}" height="${h}" fill="${skin.pageBg}"/>`);
    out.push(`<rect x="${minX + 8}" y="${minY + 8}" width="${w - 16}" height="${h - 16}" rx="20" fill="${skin.surface}"/>`);
    const gf = skin.goldFrame;
    out.push(`<rect x="${minX + gf.inset}" y="${minY + gf.inset}" width="${w - 2 * gf.inset}" height="${h - 2 * gf.inset}" rx="${gf.r}" fill="none" stroke="${gf.color}" stroke-opacity="${gf.alpha}" stroke-width="${gf.w}"/>`);
  }

  // L2 白管層（全 36 通道：casing＋track＝未啟動語彙；啟動通道也墊底，彩線鑲入）
  const tr = skin.track;
  for (const ch of CHANNELS) {
    const g = CHANNEL_PATHS2[ch.id];
    const d = channelFullD2(g);
    out.push(`<path d="${d}" fill="none" stroke="${tr.casing}" stroke-width="${tr.width + 2 * tr.casingW}" stroke-linecap="round"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${tr.color}" stroke-width="${tr.width}" stroke-linecap="round"/>`);
  }

  // L3 中心層（合盤 defined＝主題中心色；open＝undef 樣式）
  for (const cId of CENTER_DRAW_ORDER2) {
    const shape = CENTER_SHAPES2[cId];
    const d = centerPathD2(shape);
    const st = composite.centers[cId];
    if (st && st.defined) {
      out.push(`<path d="${d}" fill="${theme.centerDefined[cId]}"/>`);
    } else {
      const cu = skin.centerUndef;
      out.push(`<path d="${d}" fill="${cu.fill}" stroke="${cu.stroke}" stroke-width="${cu.sw}"/>`);
    }
  }

  // L4 啟動線層（四類）：casing＝四類語意色（案 B）、內線＝owner 色（A 實／B 虛）
  const ac = skin.active;
  const dashB = ` stroke-dasharray="${ct.bDash}"`;
  const casingW = ac.width + 2 * ac.casingW + 1.5;
  const joints = []; // 電磁中點接合圓，最後畫（壓在線上、閘門圓下）
  for (const ch of CHANNELS) {
    const info = composite.channels[ch.id];
    if (!info || info.state === 'off') continue;
    const g = CHANNEL_PATHS2[ch.id];
    const fullD = channelFullD2(g);
    const casing = ct.categories[info.state];

    if (info.state === 'electromagnetic') {
      const [dA, dB] = channelHalfDs2(g); // [gateA 側, gateB 側]
      const ownerG1 = info.gateOwners[g.gateA][0];
      const ownerG2 = info.gateOwners[g.gateB][0];
      out.push(`<path d="${dA}" fill="none" stroke="${casing}" stroke-width="${casingW}" stroke-linecap="round"/>`);
      out.push(`<path d="${dB}" fill="none" stroke="${casing}" stroke-width="${casingW}" stroke-linecap="round"/>`);
      out.push(`<path d="${dA}" fill="none" stroke="${ownerColor(ownerG1, ct)}" stroke-width="${ac.width}" stroke-linecap="round"${ownerG1 === 'b' ? dashB : ''}/>`);
      out.push(`<path d="${dB}" fill="none" stroke="${ownerColor(ownerG2, ct)}" stroke-width="${ac.width}" stroke-linecap="round"${ownerG2 === 'b' ? dashB : ''}/>`);
      const m = midPointOf(dB);
      if (m) joints.push({ m });
    } else if (info.state === 'companionship') {
      out.push(`<path d="${fullD}" fill="none" stroke="${casing}" stroke-width="${casingW}" stroke-linecap="round"/>`);
      out.push(`<path d="${fullD}" fill="none" stroke="${ct.a.color}" stroke-width="${ac.width}" stroke-linecap="round"/>`);
      out.push(`<path d="${fullD}" fill="none" stroke="${ct.b.color}" stroke-width="${ac.width}" stroke-linecap="round"${dashB}/>`);
    } else { // dominance / compromise：完整方全長
      const who = info.completeFor[0];
      out.push(`<path d="${fullD}" fill="none" stroke="${casing}" stroke-width="${casingW}" stroke-linecap="round"/>`);
      out.push(`<path d="${fullD}" fill="none" stroke="${ownerColor(who, ct)}" stroke-width="${ac.width}" stroke-linecap="round"${who === 'b' ? dashB : ''}/>`);
    }
  }
  // 電磁中點接合圓（兩半段在此接通的視覺徵記）
  for (const j of joints) {
    out.push(`<circle cx="${j.m[0]}" cy="${j.m[1]}" r="${ct.jointR}" fill="${skin.surface}" stroke="${skin.socket.stroke}" stroke-width="1.5"/>`);
  }

  // L5 閘門圓層（64 門：owner 上色／both 左右半圓／未啟動插座）
  const gk = skin.gate;
  const sk = skin.socket;
  const texts = [];
  for (let gate = 1; gate <= 64; gate++) {
    const anchor = GATE_ANCHORS2[gate];
    if (!anchor) continue;
    const [x, y] = anchor;
    const info = composite.gates[gate];
    const owners = info ? info.owners : [];
    const r = gk.r;
    if (owners.length === 0) {
      const centerId = GATE_TO_CENTER2[gate];
      const defined = composite.centers[centerId] && composite.centers[centerId].defined;
      const pad = defined ? sk.pad[centerId] : sk.undefPad;
      out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${pad}" stroke="${sk.stroke}" stroke-width="${sk.sw}"/>`);
      texts.push({ x, y, gate, color: sk.text });
    } else if (owners.length === 2) {
      out.push(`<path d="M${x},${y - r} A${r},${r} 0 0 0 ${x},${y + r} Z" fill="${ct.a.color}"/>`);
      out.push(`<path d="M${x},${y - r} A${r},${r} 0 0 1 ${x},${y + r} Z" fill="${ct.b.color}"/>`);
      out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${gk.activeRing}" stroke-width="${gk.activeRingW}"/>`);
      texts.push({ x, y, gate, color: '#FFFFFF' });
    } else {
      out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${ownerColor(owners[0], ct)}" stroke="${gk.activeRing}" stroke-width="${gk.activeRingW}"/>`);
      texts.push({ x, y, gate, color: '#FFFFFF' });
    }
  }

  // L6 數字層
  for (const t of texts) {
    out.push(`<text x="${t.x}" y="${t.y}" fill="${t.color}" font-family="${esc(theme.gate.fontFamily)}" font-size="${gk.fontSize}" font-weight="${gk.fontWeight}" text-anchor="middle" dominant-baseline="central">${t.gate}</text>`);
  }

  // L7 hit 層（interactive opt-in；沿單人 data-* 慣例）
  if (interactive) {
    for (const ch of CHANNELS) {
      const g = CHANNEL_PATHS2[ch.id];
      out.push(`<path d="${channelFullD2(g)}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="18" data-hit="channel" data-channel="${ch.id}" tabindex="0" role="button" aria-label="${esc(ch.nameZh)} 通道 ${ch.id}"/>`);
    }
    for (let gate = 1; gate <= 64; gate++) {
      const anchor = GATE_ANCHORS2[gate];
      if (!anchor) continue;
      out.push(`<circle cx="${anchor[0]}" cy="${anchor[1]}" r="${theme.gate.hitRadius}" fill="#000" fill-opacity="0" data-hit="gate" data-gate="${gate}" tabindex="0" role="button" aria-label="閘門 ${gate}"/>`);
    }
  }

  out.push('</svg>');
  return assertComposeReportSafe(out.join(''));
}
