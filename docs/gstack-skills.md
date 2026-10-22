# gstack Skills 建議（swanky.github.io）

> 針對本專案整理的 gstack skill 使用建議。`docs/` 已被 `_config.yml` 排除，本檔不會發佈到網站。
> CLAUDE.md「Local Skills」段的最後一行引用本檔：視覺、人類圖引擎、效能改動後，**提議**對應的 skill，不主動執行。

## 現況（2026-10-22 盤點）

- 安裝版本 `1.62.0.0`（2026-08-14 升級），最新版是 `1.79.0.0`。`/gstack-upgrade` 目前關閉，要升級得先開啟它，或手動更新。
- 開關在全域設定 `~/.claude/settings.json` 的 `skillOverrides`（影響所有專案；依 `docs/agents/maintenance.md` §1，改動前先問站主）。
- **目前開啟的只有三個**：`/browse`、`/benchmark`、`/design-review`。其餘 gstack skill 都是 `off`，下方 Tier 2、Tier 3 的建議要用時，得先在 `skillOverrides` 開啟。
- 完整盤點：`docs/skills-audit-2026-10-22/user-skills-audit.md`（私有）。

## 使用前要知道的行為（與本專案規則衝突處）

| skill | 行為 | 怎麼處理 |
|---|---|---|
| `/design-review`（開啟中） | 每修一處就自動 commit 一次，並要求工作樹乾淨；安裝失敗時會 `git checkout -- package.json package-lock.json` | 跑之前先確認 `git status` 乾淨；跑完檢查它產生的 commit，不 push，push 照 R3 問站主 |
| gstack 共用開頭段 | 第一次跑 browse／benchmark／design-review 時，會問要不要開 proactive 模式；下一次會問要不要把 `## Skill routing` 寫進本 repo 的 CLAUDE.md 並 commit | 一律回答不要。CLAUDE.md 是適配層，不另訂路由規則；路由表會把人導向會 push 的 `/ship`、`/land-and-deploy` |
| `/ship`、`/document-generate`、`/land-and-deploy`（關閉中） | 自動 `git push`、合併 PR、固定加 `Co-Authored-By: Claude Opus 4.7` | **保持關閉**。違反 R3（push 前要問站主）與「署名由執行器層決定」 |
| `/review`（關閉中） | 會直接修改並 commit | 要只看報告時用 mattpocock `code-review` 或 Claude Code 內建 `/review` |

## 為什麼要分組

本專案有兩種性格，skill 推薦依此分組：

1. **Jekyll 內容／作品集站**：攝影、技術文章、媒體報導；視覺與 SEO 導向，商業首要目標為名單轉換。
2. **人類圖產生器** `/human-design/`：真正的前端 app，`assets/js/human-design/` 計算引擎＋`tests/` 的 Node 測試（`npm test`）、SVG 渲染。

## Tier 1：已開啟（視覺／效能）

| skill | 用在本專案哪裡 |
|---|---|
| `/browse` | 開站、互動、改版前後截圖、push 後驗證 GH Pages 部署。與 Playwright MCP 並存，兩者擇一即可，不要同時開兩套瀏覽器。 |
| `/design-review` | 對頁面做設計師之眼 QA：視覺不一致、間距、層級、AI-slop、慢互動。注意上表的自動 commit。 |
| `/benchmark` | 效能回歸基準（載入時間、Core Web Vitals）。人類圖頁、攝影 grid 頁最需要。 |

## Tier 2：要用得先開啟（人類圖 app 程式面）

- `/qa`（或 `/qa-only` 只報告）：人類圖「表單→bodygraph→報告」流程。
- `/codex`：對抗式第二意見，抓天文計算與幾何的邏輯 bug。
- `/investigate`：root-cause 除錯（與 mattpocock `diagnosing-bugs` 功能重疊，擇一）。
- `/health`：跑 `npm test`＋lint 給綜合分數。
- `/spec`、`/office-hours`：付費報告、新服務的規格與定位。

## Tier 3：要用得先開啟（內容產出／改版）

- `/make-pdf`：markdown → PDF／DOCX（與 document-skills `pdf` 重疊）。
- `/diagram`：架構圖（站上文章流程圖慣例是手繪白底 SVG，見 memory `reference_article_inline_svg`）。
- `/design-shotgun`、`/design-html`、`/design-consultation`：大改版時產多版視覺。重大改版先出原型給站主裁決。

## 可略過（對此專案不對症）

- 所有 `ios-*`（無 iOS app）。
- `/setup-gbrain`、`/sync-gbrain`（gbrain 未安裝）。
- `/setup-deploy`、`/canary`（GH Pages push 即自動部署）。
- `/pair-agent`、`/open-gstack-browser`、`/benchmark-models`、`/setup-browser-cookies`、`/cso`。

## 觸發對照表（完成變更後提議，不主動跑）

| 當你做這種變更 | 提議的 skill |
|---|---|
| 任一頁的視覺／版面／內容改動 | `/design-review` |
| 人類圖引擎 `assets/js/human-design/*.js` | `npm test`；需要第二意見時提議開啟 `/codex` |
| 人類圖流程／互動改動 | 提議開啟 `/qa` |
| 效能敏感頁（人類圖、攝影 grid） | `/benchmark` |

## SEO／名單目標

最對症的是 `marketing-skills` 外掛（`seo-audit`、`schema`、`analytics`、`ai-seo`），不是 gstack。它已安裝，但在本 repo 被 `settings.local.json` 停用；要用時再開。
