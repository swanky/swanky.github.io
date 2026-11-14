---
name: site-diagram
description: 替 swanky.github.io 畫簡單明瞭又好看的教學圖解與技術圖表（目標風格：ByteByteGo 式「卡片＋圖示＋箭頭，一眼看懂」）——比較圖、步驟圖、流程圖、四象限、分層圖、架構圖、循序圖、時間軸等，輸出可直接嵌進網頁的 inline SVG（桌機橫式＋手機直式兩版）。底層用 vendored 的 diagram-design（MIT，50 種圖型），套本站品牌金配色、中文字級與「只畫出處寫到的事實」規則。當使用者說「畫圖」「畫圖表」「做示意圖」「教材圖解」「這張圖重畫」「圖畫好看一點」「像 bytebytego 那樣」「Mermaid 重繪」「/site-diagram」，或文章、教學頁、課程頁需要示意圖時使用。插畫、人物、Banner 不用本 skill（改用 codex-image）。也負責檢查 upstream 更新：使用者說「檢查 diagram-design 更新」「更新畫圖工具」時使用。
---

# site-diagram

本站畫圖表的入口。圖型知識與檢查腳本來自 vendored 的 **diagram-design**（`vendor/diagram-design/`，原封不動）；本站的規定寫在本檔與 `references/site-zh.md`，兩者衝突時以本站為準。

移植自站主另一個 repo 的同類 skill（2026-11-14）。內部專案樣本沒有帶過來；配色、名稱全部換成本站的。

## 何時用、何時不用

| 情境 | 用什麼 |
|---|---|
| 教學頁、專欄、課程頁要的比較圖、步驟圖、流程、四象限、分層、架構 | **本 skill** |
| 插畫、人物出鏡、文章 Banner | `codex-image`（照 AGENTS.md「品牌角色形象」附參考圖） |
| 數據圖表（長條、折線） | 本 skill 的 bar／line 圖型可用，但數字一定要有出處和日期 |

## 檔案

| 要用到 | 位置 |
|---|---|
| 字型、字級、配色、手機版、嵌入規則 | `references/site-zh.md`（**每次必讀**） |
| upstream 主說明、圖型清單（§3） | `vendor/diagram-design/SKILL.md` |
| 各圖型的版面規則 | `vendor/diagram-design/references/type-<圖型>.md` |
| 共用元件、輸出規格、版面預算、圖示 | `vendor/diagram-design/references/primitives-core.md`、`output-spec.md`、`layout-budget.md`、`primitive-icons.md` |
| HTML 樣板、範例 | `vendor/diagram-design/assets/template.html`、`example-<圖型>.html` |
| 交付前檢查 | `scripts/check.py` |
| 截圖目視 | `scripts/shot.py` |
| upstream 版本 | `vendor/UPSTREAM.md`、`vendor/check_upstream.py` |

## upstream 的哪些步驟不做

- **§0 first-time setup gate 視為已滿足**：配色與字型由 `references/site-zh.md` 決定，不問使用者要不要自訂、不跑 onboarding、不寫 `~/.diagram-design/`。
- 不改 `vendor/` 內任何檔案；要調整就改 `references/site-zh.md` 或本檔。
- upstream 寫的 `verify_geometry.py` 不直接跑，一律用 `scripts/check.py`（已包含）。
- 不做深色版、手繪風（sketchy）、動畫版。

## 流程

- [ ] **0. 順手查 upstream 新版**：`python -X utf8 -I .agents/skills/site-diagram/vendor/check_upstream.py`。exit 0 不提；exit 10 照常畫，交付時一兩句告訴使用者有新版、問要不要審查換版（換版一定要使用者同意）；連不上就跳過並提一句。
- [ ] **1. 定事實基準**：列出圖上每個元件、連線、數字及其出處（頁面段落、來源與查核日）。**只畫事實基準寫到的東西**；本站的內容硬規則（AGENTS.md「內容規範」：雇主名切割、RWA 用語、TA 白話等）在圖上一樣適用。出處沒寫清楚的不畫，或標「未驗證」。
- [ ] **2. 選圖型**：讀 `vendor/diagram-design/SKILL.md` §3。教學圖解優先考慮：
  - **對照圖**（兩欄卡片左右對照，例如託管 vs 自己保管）→ 用 architecture／nested 的卡片元件自組，兩欄＋中間共用層
  - **步驟圖** → `type-steps.md`（編號＋圖示＋短說明）
  - **四象限** → `type-quadrant.md`
  - **流程／分支** → `type-flowchart.md`；**資料流** → `type-data-flow.md`
  - **分層** → `type-layers.md`
  一張圖只講一件事；要講兩件就拆成兩張。
- [ ] **3. 讀規則**：`references/site-zh.md`，加上該圖型的 `type-*.md`、`primitives-core.md`、`output-spec.md`、`layout-budget.md`。
- [ ] **4. 畫**：從 upstream 樣板開始，輸出 self-contained HTML 到 `assets/diagrams/<頁面 slug>/<圖名>.html`（工作檔，Jekyll 已排除，見下方「產出放哪」），內含**桌機橫式**與**手機直式**兩個 `<svg>`。
  - 中文用台灣繁體、全形標點；技術名詞保留英文。不用 `|`、`｜`。
  - 頁底放 fidelity ledger（省略與合併清單），收在 `<details>` 內。
- [ ] **5. 檢查（未通過不交付）**：
  ```
  python -X utf8 -I .agents/skills/site-diagram/scripts/check.py <產出.html>
  ```
  self_check（離線、system 字型）、verify-geometry、豎線與外部 URL 計數都要過。
- [ ] **6. 截圖目視**：桌機與手機寬各一張。
  ```
  python -X utf8 .agents/skills/site-diagram/scripts/shot.py <產出.html> <輸出.png> 1440
  python -X utf8 .agents/skills/site-diagram/scripts/shot.py <產出.html> <輸出.png> 390
  ```
  看：中文有沒有超框、重疊、被裁；手機上最小字是否 ≥ 13px 實際顯示；整張是否一眼看懂主訊息。截圖存 scratchpad，不進 repo。
- [ ] **7. 嵌入頁面**：照 `references/site-zh.md` §6，把兩個 `<svg>` 放進頁面（或存成 `assets/img/diagrams/*.svg` 用 `<picture>` 切換），再跑一次 `site-verify` 的桌機／390px 檢查。

## 產出放哪

- 工作檔 HTML：`assets/diagrams/<slug>/`——`_config.yml` 需排除 `assets/diagrams`（不進網站產物）；跟著頁面一起 commit，方便日後重畫。
- 上線用的圖：inline 進頁面，或 `assets/img/diagrams/<slug>-<圖名>(-mobile).svg`。
- 試畫、比較版：scratchpad，不 commit。

## upstream 更新審查

使用者同意後才做：`check_upstream.py` 讀報告 → 標 ★ 的檔逐一看 diff → 分成「直接受益／影響 site-zh／可拿掉的變通做法／與本站規則衝突」四類回報 → 同意後照 `vendor/UPSTREAM.md`「更新方式」換版，重跑本站已上線圖的 `check.py` → vendor、site-zh、本檔、`UPSTREAM.md` 一起 commit。
