// visual-regression.test.mjs — Phase 6 軌 A：BodyGraph v2 視覺回歸快照測試。
// ─────────────────────────────────────────────────────────────────────────────
// 逐一渲染 8 fixtures × 3 主題 = 24 個 SVG 字串，與落檔的 golden 快照比對 byte-identical。
// 快照＝SVG 字串（非 PNG）：跨機穩定（無光柵化/字型/瀏覽器差異）、diff 人眼可讀、Node 純跑。
// 涵蓋 spec 二十節第 9 條「visual regression tests 完成」與第 7 條「三主題共用同一 geometry」的
// 逐主題像素級鎖定：任何 hd-bodygraph.js / hd-theme.js / hd-geometry-v2.js 的非預期視覺漂移都會亮紅。
//
// ── 快照缺失＝fail（防呆）──
//   若對應 snapshots/{fixture}-{theme}.golden.svg 不存在，測試直接 fail 並提示重生指令，
//   而非悄悄跳過（跳過＝假綠，等於沒有回歸保護）。
//
// ── 視覺改版時如何重生快照 ──
//   1. 只有在視覺「刻意要改」且新視覺已被人工/驗圖確認後才重生；純重構若無視覺變動，
//      本測試應保持綠、不該重生（重生＝把回歸測試的意義抹掉）。
//   2. 跑重生腳本（在 scratchpad、非 repo 內，用絕對路徑，任何 cwd 皆可）：
//        node ".../scratchpad/regen-snapshots.mjs"
//      —— 腳本邏輯與本測試完全一致：對每個 fixture×theme 呼叫 renderBodygraph(fixture,{theme})
//         的預設（非互動、含卡面底＋金框）輸出，寫入 snapshots/{fixture}-{theme}.golden.svg。
//   3. `git diff tests/human-design/fixtures/snapshots/` 檢視差異＝預期視覺改動、無意外漂移。
//   4. `npm test` 應全綠。
//
//   scratchpad 為 ephemeral；若該腳本遺失，等效重生程式碼即下面這段（在 repo root 跑）：
//     import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
//     import { renderBodygraph } from './assets/js/human-design/hd-bodygraph.js';
//     const D = 'tests/human-design/fixtures';
//     mkdirSync(`${D}/snapshots`, { recursive: true });
//     for (const n of FIXTURE_NAMES) for (const t of THEMES)
//       writeFileSync(`${D}/snapshots/${n}-${t}.golden.svg`,
//         renderBodygraph(JSON.parse(readFileSync(`${D}/${n}.json`,'utf8')), { theme: t }), 'utf8');
// ─────────────────────────────────────────────────────────────────────────────

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { renderBodygraph } from '../../assets/js/human-design/hd-bodygraph.js';

const FIX = new URL('./fixtures/', import.meta.url);
const SNAP = new URL('./fixtures/snapshots/', import.meta.url);
const loadFixture = (name) => JSON.parse(readFileSync(new URL(name + '.json', FIX), 'utf8'));

// 與 bodygraph-v2.test.mjs / regen-snapshots.mjs 相同的 8 組 fixtures × 3 主題。
const FIXTURE_NAMES = ['all-undefined', 'single-channel', 'multi-hang', 'all-personality', 'all-design', 'mixed', 'integration', 'hero'];
const THEMES = ['classic', 'modern', 'dark'];

for (const name of FIXTURE_NAMES) {
  for (const theme of THEMES) {
    test(`視覺回歸：${name} × ${theme} byte-identical 於 golden 快照`, () => {
      const snapUrl = new URL(`${name}-${theme}.golden.svg`, SNAP);
      // 防呆：快照缺失即 fail（不得靜默跳過）。
      assert.ok(
        existsSync(snapUrl),
        `快照缺失：snapshots/${name}-${theme}.golden.svg —— 若為新 fixture/主題，跑 scratchpad/regen-snapshots.mjs 產生後 git diff 覆核。`,
      );
      const golden = readFileSync(snapUrl, 'utf8');
      const actual = renderBodygraph(loadFixture(name), { theme });
      assert.equal(
        actual,
        golden,
        `${name} × ${theme} 與 golden 快照不符：若為刻意視覺改版，跑 regen-snapshots.mjs 重生後 git diff 覆核；否則為非預期視覺漂移，應查 hd-bodygraph/hd-theme/hd-geometry-v2 改動。`,
      );
    });
  }
}
