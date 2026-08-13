# gstack Skills 建議（swanky.github.io）

> 針對本專案整理的 gstack skill 使用建議。`docs/` 已被 `_config.yml` 排除，本檔不會發佈到網站。
> 目前 gstack 版本：`1.62.0.0`（2026-08-14 升級；更新用 `/gstack-upgrade`）。CLAUDE.md 的「Tooling — gstack Skills」區段引用本檔。

## 為什麼要分組

本專案有兩種性格，skill 推薦依此分組：

1. **Jekyll 內容／作品集站** — 攝影、技術文章、媒體報導；視覺與 SEO 導向，商業首要目標為名單轉換。
2. **人類圖產生器** `/human-design/` — 是個真前端 app：`assets/js/human-design/` 15 個 ES module 計算引擎、`tests/human-design/` 8 個 Node 測試（`npm test`）、SVG 渲染、`tools/hd-report-poc.*` 付費報告雛形。

所以視覺／內容類與軟體工程類 skill 都用得上。

## Tier 1 — 立刻有用（視覺 / QA / 效能）

| skill | 用在本專案哪裡 |
|---|---|
| `/browse` | 已在用（`_config.yml` 已排除 `.gstack`）。開站、互動、改版前後截圖、push 後驗證 GH Pages 部署。所有視覺工作的底層。 |
| **`/design-review`** ★ | 對 **live 站**做設計師之眼 QA：抓視覺不一致、間距、層級、AI-slop、慢互動並逐項修＋前後截圖。最貼合「編輯雜誌式溫度、金色點綴、攝影為主角」的品牌。 |
| `/qa`（或 `/qa-only` 只報告） | 系統化 QA 並修 bug。人類圖「表單→bodygraph→報告」流程最該跑；近期 commit 多為渲染／DOM 防呆修補，正是此 skill 的守備範圍。 |
| `/benchmark` | 效能回歸基準（載入時間、Core Web Vitals、bundle 大小）。人類圖頁載 astronomy-engine ＋ 15 JS 模組；攝影頁載大量圖（Isotope/GLightbox）。效能＝SEO 與體驗。 |

## Tier 2 — 人類圖 app 程式面

- `/review` + `/codex` — diff 審查 ＋ 對抗式第二意見。引擎含天文計算與幾何，非平凡；codex 擅抓這類邏輯 bug。
- `/investigate` — root-cause 除錯。commit 史多為快取錯位／渲染補丁，根因式除錯比症狀補丁省事。
- `/health` — 程式品質儀表板，可直接跑既有 `npm test` ＋ lint，給綜合分數與趨勢。
- `/spec` — 把**付費報告功能**（目前還是 `tools/` 的 POC）從模糊意圖轉成五階段可執行規格再動工。
- `/office-hours` — builder 模式腦力激盪付費報告、新教育服務的定位與最小切入點。

## Tier 3 — 內容產出 / 改版

- `/make-pdf` — markdown → 出版級 PDF（1.58 起支援 Mermaid/excalidraw 圖 ＋ 單檔 HTML ＋ DOCX）。可做**人類圖付費報告**的 PDF/Word 交付雛形。
- `/diagram` — 英文／mermaid → 圖，技術顧問文章的架構圖解。
- `/scrape` + `/skillify` — 抓網頁資料並把流程固化成 skill（專案已有專屬 `sync-linkedin-article`，此組為通用補充）。
- `/design-shotgun` / `/design-html` / `/design-consultation` — 想改版某區塊時：產多版視覺變體／產出正式 HTML/CSS／建立 DESIGN.md（目前品牌規範只在 CLAUDE.md）。

## 可略過（對此專案不對症）

- 所有 `ios-*`（無 iOS app）。
- `/setup-gbrain`、`/sync-gbrain`（gbrain 未安裝，選用）。
- `/land-and-deploy`、`/setup-deploy`、`/canary`（GH Pages push 即自動部署；canary 僅在想監看 live 站時才考慮）。
- `/pair-agent`、`/open-gstack-browser`、`/benchmark-models`、`/setup-browser-cookies`、`/document-*`、`/cso`（niche 或軟體庫導向）。

## 觸發對照表（Trigger map）

完成某類變更後，考慮用對應 skill 做優化或驗證：

| 當你做這種變更 | 完成後考慮的 skill |
|---|---|
| 任一頁的視覺／版面／內容改動 | `/design-review`（live 頁）；大改版 `/design-shotgun` |
| 人類圖引擎 `assets/js/human-design/*.js` | `/review` + `/codex`；`npm test` 或 `/health`；除錯 `/investigate` |
| 人類圖流程／互動改動 | `/qa`（或 `/qa-only`） |
| 效能敏感頁（人類圖、攝影 grid） | `/benchmark` |
| 付費報告 | `/spec` 規格化、`/make-pdf` 產出 |

## 誠實補充：SEO / 名單目標

商業首要目標是名單轉換、且 GSC/GA4 仍待辦。最對症的其實是 **`marketing-skills:` 外掛**（`seo-audit`、`schema`、`analytics`、`ai-seo`），**不是** gstack。gstack 這邊用 `/benchmark` 補「效能型 SEO」。
