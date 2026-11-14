# site-zh：本站的中文字型、字級、配色、手機版與嵌入規則

覆寫 upstream `vendor/diagram-design/references/style-guide.md`、`output-spec.md`、`primitives-core.md` 裡跟**字型、字級、留白、配色、窄螢幕**有關的規定。其他規則照 upstream，例如連線一律直角、焦點色不超過 2 個、複雜度預算、fidelity ledger。兩邊衝突時以本檔為準，並在頁底 ledger 註明「套用 site-zh 覆寫」。

**出處**：站主在另一個 repo 試過兩輪圖表工具（2026-10-28），由該 session 2026-11-14 轉述。第一輪的評語是「字太小」「留白太多」「中文字形不好」；手繪風只拿 1 分。2026-11-14 站主也看了本站教學頁封面圖，評語是「圖跟字都太小，也不好看」，希望改成 ByteByteGo 那種簡單明瞭又好看的圖。

## 1. 字型（system，不連外）

| 用途 | font-family | 字重 |
|---|---|---|
| 標題、節點名、說明、標籤、圖例 | `'Noto Sans TC','Microsoft JhengHei UI','Microsoft JhengHei','PingFang TC',sans-serif` | 名稱 700；說明 400 |
| 英文技術小字（地址開頭、協定、檔名） | `Consolas,'Cascadia Mono','Segoe UI Mono',monospace` | 400 |

- 不引用 Google Fonts 或任何外部 URL；圖要能離線顯示。
- **不用**襯線字，**不用**斜體，因為中文沒有斜體字面，瀏覽器硬斜後很難看。upstream 的斜體註解一律改成正體 15px、accent 色，前面加 3px 寬 accent 色左邊線或「▸」。
- 不用 `ui-monospace`，它在 Windows 會退到細明體。全形字（如「＋」）不要放進 mono 字型，會變形成「十」。

## 2. 字級（SVG user units）

| 角色 | 桌機橫式 | 手機直式 |
|---|---|---|
| 圖內標題（多半不放，交給頁面 H2） | 26px 700 | 22px 700 |
| 節點名、卡片標題 | **20px 700** | **18px 700** |
| 節點說明 | **16px** | **15px** |
| 英文技術小字 | 13px | 13px |
| 箭頭標籤 | 15px 500 | 14px 500 |
| 徽章、編號 | 14px 700（圓形編號直徑 28） | 14px 700 |
| 圖例、註腳 | 14px | 13px |

**實際顯示字級**＝SVG 字級 ×（顯示寬 ÷ viewBox 寬）。本站內文欄最寬約 1100px，手機約 358px。
- 桌機橫式的 viewBox 寬 ≤ 1100，顯示時才不會被縮小。
- 手機直式的 viewBox 寬 **400–480**，最小字顯示時仍 ≥ 13px。

**字寬預算**：全形字（含全形標點）每字算 1em，其他字元算 0.6em。框寬＝最長一行的字寬＋左右各 16px，往上取 4 的倍數。放不下就**刪字或拆行**，不准縮小字級。

## 3. 留白與尺寸

- viewBox 用 `fit`：只包住內容，四周各留 24px，不為了湊比例留大片空白。
- 節點水平間距 40–56px、垂直間距 28–36px；容器內距 20px。
- 一張圖只講一件事。主訊息要在 3 秒內看懂：最多 2 欄或 4 步，超過就拆成兩張。

## 4. 配色（本站品牌，取自 `assets/css/education.css` 的 `--edu-*`）

只做淺色版，不做深色版、手繪風、動畫。

| role | 值 | 用途 |
|---|---|---|
| paper | `#FFFDF9` | 圖底 |
| paper-2 | `#FAF5EA` | 容器底、共用層 |
| ink | `#232020` | 標題、節點名 |
| muted | `#5F5B53` | 說明文字 |
| rule | `rgba(66,52,32,0.14)` | 邊框 |
| accent（品牌金） | `#E5A300` | 焦點、編號底、主箭頭 |
| accent-deep | `#8A5D00` | 金色系上的文字、連結 |
| accent-tint | `rgba(229,163,0,0.10)` | 焦點卡片底 |
| blue | `#4FA6D5` | 對照組（例如「平台」那一側） |
| blue-tint | `#E6F2F9` | 對照組卡片底 |
| ok | `#2E8B57` | 正確做法 |
| danger | `#C0392B` | 錯誤做法、風險 |

- 焦點色最多 2 個（品牌金加一個對照色）；ok 和 danger 只用在「對／錯」的對照上。
- 卡片圓角 8–10px，不加陰影，用 1.5–2px 邊框。
- 圖示用 `primitive-icons.md` 的 24×24 單色圖示，`currentColor` 會跟著換成品牌色。不要自己手繪人物或建築插畫；站主嫌過那種「手繪小人」不好看。

## 5. ByteByteGo 式教學圖解：做法要點

站主要的是「卡片＋圖示＋箭頭、一眼看懂」。

- 每張卡片的結構：圖示（左上或置頂），粗體短標題（≤ 10 字），1–2 行說明（每行 ≤ 16 字）。
- 對照圖：左右兩欄，同一層級的卡片高度一致，中間或上方放兩邊共用的元素（例如「區塊鏈帳本」）。兩欄用 blue 與品牌金區分。
- 步驟圖：圓形編號、圖示、標題、一句話，用直角箭頭串起來。手機版改成由上往下。
- 對／錯對照：ok 用實線加 ✓，danger 用虛線加 ✕，旁邊一定要有文字說明，不能只靠顏色區分。
- 圖上的文字必須和頁面內文一致，不要在圖上寫新的說法。

## 6. 手機版與嵌入頁面

- 讀者在手機上不會橫向捲動圖。**所以每張圖都做兩版：桌機橫式＋手機直式**，不用 min-width 加橫向捲動那一招。
- 嵌入方式（擇一）：
  1. **inline 兩個 `<svg>`**，用 class 切換：`.dg-wide{display:block}.dg-tall{display:none}`，在 `@media (max-width: 640px)` 裡反過來。兩個 `<svg>` 的 `<title>`／`aria-labelledby` 的 id 不能重複。
  2. **存成檔案**放 `assets/img/diagrams/`，用 `<picture><source media="(max-width: 640px)" srcset="…-mobile.svg"><img src="….svg" alt="…" width height></picture>`。檔案很大或要重用時用這個。
- `alt`／`<title>` 用一句話寫出圖的主訊息，不是「示意圖」三個字。
- `<figcaption>` 寫「自製示意圖」加依據（規格或來源與查核日）。
- 不要放進 Isotope 版面裡，也不要加 `loading="lazy"`（見 AGENTS.md「既知陷阱」）。
- 嵌入後用 `site-verify` 跑桌機與 390px：沒有橫向溢出，最小字在畫面上 ≥ 13px，截圖親眼看過。

## 7. 已知限制

- `verify_geometry.py` 只認得 8–14px 的標籤遮罩。16px 以上的中文標籤和節點有沒有撞在一起，只能截圖目視。
- `self_check.py` 用 §2 同一套字寬預算檢查「看得到的方框內」的文字，超出框邊 0.3em 就判失敗；箭頭標籤底板上的文字不在檢查範圍內。
- upstream 的 Mermaid 匯入只支援 flowchart、sequenceDiagram、stateDiagram-v2、erDiagram。
