# AGENTS.md — 專案共用規範（單一真相來源）

適用任何 coding agent（Claude Code、Hermes、Codex 等）。本檔只寫跨 agent 共用的專案事實與規範；各執行器的工具、權限與載入方式在各自的適配層（`CLAUDE.md`、`.claude/`、`~/.hermes/`、`.codex/`），不在此檔。遷移準則見 `docs/agents/cross-agent-sharing.md`（私有）。

## 專案概觀

Jekyll 靜態網站：史旺基工作室（Swanky Studio）的作品集與服務網站，部署於 GitHub Pages。深度架構脈絡讀 `docs/architecture.md`（layouts、collections、front matter、Human Design engine），視覺設計脈絡讀 `docs/design.md`。`docs/` 其餘內容為私有文件，不進公開 repo（由 `docs/` 內的 nested private repo 版本控制）。

## 建置、測試與部署

- `bundle install` — 安裝相依。
- `bundle exec jekyll build` — 建置到 `_site/`。
- `bundle exec jekyll serve` — 本機開發（http://127.0.0.1:4000）。**agent 執行時避免使用**：殘留的 `--watch` 程序會在操作間隙回復／清空工作目錄檔案（單次操作內穩定、操作間隙回復——這才是「寫入不穩」的真相，不是機器壞了）；檔案神秘回復時先終止殘留的 ruby 程序（PowerShell：`Get-Process ruby | Stop-Process -Force`）。
- `npm test` — engine 測試（`node --test` 跑 `tests/**/*.test.mjs`，免 npm install）。便宜可靠，開發期的主要驗證手段。
- Push 到 `master` 即自動部署。正式站 **https://swanky.github.io**（Flickr 帳號 `swanky-hsiao` 不是網域的一部分）。
- 部署狀態用 GitHub Actions 查詢（`gh run list --limit 5`）。**build** job 失敗→回 repo 除錯；build 綠但 **deploy** 在 `syncing_files` 失敗且訊息為「Deployment failed, try again later」→ GitHub Pages 瞬態問題，`gh run rerun <id> --failed` 重跑即可。

## 完成的定義（可驗證）

「完成」＝改了＋驗了＋證據在手。宣告完成必須附可貼出的驗證輸出（測試輸出、`_site/` 建置產物檢查、頁面實測）；缺證據一律寫「已改、未驗」。開發期用便宜檢查（`npm test`、原始碼 grep、diff）；push 前對全部改動**批次跑一次**完整 `bundle exec jekyll build`＋`_site/` 產物檢查（或瀏覽器實測）。

## 內容規範（不可違反）

- **語言**：站上文案一律繁體中文（zh-TW）。中文行文用全形標點「，：；？！」；英文引號內與程式碼維持半形。
- **對外文案從 TA（目標受眾）角度審查**：這是個人品牌／服務網站，不是給工程師看的。所有面向訪客的文字（按鈕、標題、說明、alt text）一律用 TA 看得懂的白話，不用工程師或領域內行術語——檔案格式（Markdown／JSON／PNG／.ics）、技術實作（localStorage／manifest／schema／render）、領域黑話一律換成「動作或效果」的說法（例：「存成文字檔」「下載完整備份」「加進行事曆提醒」）。功能名優先用中文，除非是既定品牌名（Cyber Tarot Lab、CloneX）或下方有中文大標的裝飾性英文小標。**寫的當下就做，別等交付後被使用者抓**（訪客平均互動僅約 11 秒，一個看不懂的詞就流失）。
- **資產路徑**：一律 `{{ '/path' | relative_url }}`。
- **RWA**：一律寫「現實世界資產」（絕不寫「真實世界資產」）；保留 RWA 縮寫與英文全名。
- **個人稱謂**：站上文案一律「大型電信業技術主管」——絕不出現雇主公司名或內部職稱（品牌／雇主切割）；唯一例外是 `index.html` JSON-LD 的 `worksFor`。
- **兩位熊熊絕不混淆**：吳暐榕＝制服模特兒；卓毓彤＝一線藝人。
- `nft/` 是獨立 mini-site（已排除於 Jekyll 之外），**不要**加 Jekyll front matter。
- `assets/vendor/` 的第三方函式庫**不要**手動修改。

## 內容慣例（文章與圖片）

- 文章放 `_posts/YYYY-MM-DD-slug.md`，`layout: article`；`categories: [technical]`（技術顧問）、`[claude-code]`（AI學習分享）或 `[photography]`（攝影作品）。
- `cover_image` 一律 `.jpg`（PNG 來源先轉 JPEG）；列表卡片會把封面裁成 16:9，選圖／裁圖要預留。
- 同步自 LinkedIn／X 的文章：設 `hero_image: true`；`source_url` 填 LinkedIn（一律 `www.` 子網域）、`source_url_x` 填 X。layout 會自動渲染單／雙來源連結。
- Bootstrap Icons：使用前先確認 glyph class 存在於 vendored CSS（缺字渲染成空方塊——曾是正式站 bug）。

## 環境事實（Windows）

- PowerShell 對 git commit 訊息與路徑有 quoting／encoding 問題——**git 操作一律用 POSIX shell**（如 Git Bash）執行。
- 每次重要寫入後，用獨立手段（diff、回讀、grep）確認寫入成功，再往下蓋。絕不敘述沒有實際收到的結果。
- Python 輸出中文一律 `python -X utf8`（預設 cp950 會 UnicodeEncodeError）。Git Bash 的 `/tmp` 是 MSYS 虛擬路徑，原生 Windows 程式看不到——交換檔案用真實 Windows 路徑。
- 等待 CI 等長工時避免裸 `sleep`，用輪詢迴圈（until-loop）檢查狀態。

## 既知陷阱（Gotchas）

- **Isotope＋`loading="lazy"`**：Isotope grid 頁面不要加 lazy——版面會塌（Isotope 在圖片尺寸已知前就執行）。
- **Flickr URL**：本地副本命名 `{photo_id}_{secret}_{size}.jpeg`；照片連結 `https://www.flickr.com/photos/swanky-hsiao/{photo_id}/`。
- **`.gstack` / `.playwright-mcp` 產物**：開發工具輸出會觸發 watch 重建、可能弄壞本機樣式，跑一次完整 `jekyll build` 可復原（`_config.yml` 已排除）。
- **Vendored astronomy-engine**：瀏覽器以 classic script 載入 `astronomy.browser.min.js`（全域 `Astronomy`）再載 ES module；Node 測試經 `createRequire()` 載入，因 `assets/vendor/astronomy-engine/package.json` 設 `"type":"commonjs"` 覆寫 repo 根的 `"type":"module"`（後者存在只為讓 Node 把 `assets/js/human-design/*.js` 當 ESM 跑測試）。

## 共用 skills

- 可重用的多步驟程序正本放 `.agents/skills/<name>/SKILL.md`（目前：`s2m` 簡報轉 Markdown、`sync-social-article` LinkedIn／X 文章同步）。
- `.claude/skills/` 是由 `node tools/sync-agent-skills.mjs` 從正本產生的 Claude 相容鏡像——**兩邊都不要手動編輯鏡像**；改正本後重跑同步。drift 檢查：`node tools/sync-agent-skills.mjs --check`（已納入 `npm test`）。
- Hermes 經使用者層設定的 `skills.external_dirs` 掃描 `.agents/skills/`。

## 跨 agent 原則

- 不得回退、覆蓋或「清理」使用者未提交的變更；動手前先看 `git status`。
- 不讀取 `.env` 與任何 secrets（此為意圖聲明；實際 deny 由各執行器的 permissions／sandbox 強制）。
- repo 不固定 model、provider、API key 或 AI 共同作者署名——這些屬於各使用者／執行器層設定。
- 適配層（`CLAUDE.md` 等）只描述該 agent 如何載入與執行本檔規則，不得另訂衝突的專案規則。
