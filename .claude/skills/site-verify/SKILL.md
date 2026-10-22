---
name: site-verify
description: 用真的瀏覽器驗證 swanky.github.io 的頁面：本機建置、起靜態伺服器、桌機與 390px 手機各開一次，收集截圖、HTTP 狀態、頁面錯誤、橫向溢出、破圖與 H1 檢查，以及 push 後的正式站確認。改了版型、CSS、頁面內容或 JS，要證明「訪客看到的真的對」時使用；也用於 push 前的批次驗證與上線後驗證。
---

# site-verify：證明訪客看到的真的對

`npm test` 只證明程式邏輯；這個 skill 證明**建置出來的頁面在瀏覽器裡**沒壞。改編自 pstack `create-verification-skill` 的結構（Launch／Doctor／Drive／Evidence／Cleanup），內容收錄 memory 裡散落的驗證知識。

## 1. Launch：建置並起伺服器

```bash
# 完整建置到 _site/（約 1–3 分鐘；輸出落檔再看尾巴）
/c/Ruby33-x64/bin/bundle exec jekyll build > <工作目錄>/build.log 2>&1; tail -3 <工作目錄>/build.log
```

- 在 Git Bash 裡 `bundle` 不在 PATH，用 `/c/Ruby33-x64/bin/bundle`（PowerShell 可用 `C:/Ruby33-x64/bin/bundle.bat`）。
- **不要用 `jekyll serve`**：殘留的 `--watch` 程序會在操作間隙回復工作目錄的檔案（`AGENTS.md`）。
- 起只讀的靜態伺服器，**每次換一個沒用過的 port**（新 origin＝全新快取，避免瀏覽器吃舊 CSS）：

```bash
python -m http.server <port> --bind 127.0.0.1 --directory _site
```

  在背景執行，記下這個程序的 ID，收尾時只停它。

就緒的判斷：`curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:<port>/` 回 `200`。

## 2. Doctor：這個實例值得驗嗎

驗之前先確認，任何一項不對就先修，不要驗舊東西：

- `_site/` 的修改時間晚於最後一次改原始檔（不然是舊建置）。
- `grep -c '<本次改動才有的字串>' _site/<頁面>/index.html` 大於 0。
- port 是自己剛起的那個伺服器在回應。

## 3. Drive：用瀏覽器打開頁面

```bash
node .agents/skills/site-verify/scripts/verify-page.mjs \
  --base http://127.0.0.1:<port> --out <工作目錄>/evidence /technical/ /tarot/ > <工作目錄>/verify.log 2>&1
cat <工作目錄>/verify.log
```

- 每個路徑跑桌機 1280px 與手機 390px 兩次，每次一張整頁截圖。
- Git Bash 會把 `/technical/` 這類參數改寫成 `C:/Program Files/Git/technical/`；腳本會自動還原，也可以在指令前加 `MSYS_NO_PATHCONV=1`，或省略開頭的 `/`。
- 腳本已處理的已知陷阱：關掉 AOS 進場動畫、lazy 圖改 eager 並等 `decode()`、等字型載入、擋 GA 請求不污染數據。
- 判 FAIL 的條件：非 200、pageerror、`scrollWidth > innerWidth`、破圖、H1 不是剛好一個。`console.error` 只記數字不判 FAIL，數字大於 0 時打開 `report.json` 看內容。
- 腳本找不到 playwright 或瀏覽器時 exit 2，訊息會列出試過的路徑；可用環境變數 `PLAYWRIGHT_MODULE`、`CHROME_PATH` 指定。不要用 `msedge` channel，會靜默卡死。
- 互動流程（點按鈕、填表、下載、lightbox）不在腳本範圍：用 Playwright 在真實頁面上跑 `page.evaluate`。在 Claude Code 用 Playwright MCP 時，要用 `browser_run_code_unsafe`，`browser_evaluate` 跑在 about:blank 上。

### 各區塊要多看什麼

| 改了什麼 | 除了上面，還要驗 |
|---|---|
| 共用版型、include、CSS | 用到它的**每一種**頁面類型都要驗，先用 `blast-radius` 列出波及範圍 |
| models 子站 | 子站首頁與所有受影響頁都截圖；`models.css` 要換版本號 |
| Isotope 格線頁（攝影） | 圖片不得有 `loading="lazy"`，版面不塌 |
| 文章 | H1、30 秒結論、大綱、封面、內文圖、參考資料連結；`-card.jpg` 存在 |
| 人類圖等工具 | `npm test` 全過＋實際操作一次主要流程 |

## 4. Evidence：證據放哪、怎麼看

- 證據放在本次工作目錄的 `evidence/`（不放 repo；`.playwright-mcp/`、`.gstack` 會觸發重建）。
- `report.json` 是機器可讀的完整結果，回報時貼 `verify.log` 的 PASS／FAIL 行。
- **截圖要有人看**：文字檢查會漏掉構圖問題。看圖工作交給 subagent（描述內容用小模型，版面 QA 用中型模型），只回結論；不要把整張圖讀進主線程。收到對齊類的回報，先自己量數字再改 CSS。

## 5. 上線後驗證（push 之後）

1. `gh run list --limit 5` 找到這次 commit 的 run，build 與 deploy 都要成功。deploy 在 `syncing_files` 失敗且訊息是「Deployment failed, try again later」，是 Pages 暫時性問題，`gh run rerun <id> --failed`。
2. 用 `git ls-remote origin master` 確認遠端真的是這個 SHA，不要只信本地輸出。
3. 正式站 https://swanky.github.io 的頁面用 curl 確認 200 與本次的新字串。
4. **CSS／JS 改動不能只信 curl**：CDN 對 gzip／br 變體分開快取（最多 10 分鐘）。用瀏覽器讀 `document.styleSheets` 的實際規則確認生效，或輪詢 `curl -s -H 'Accept-Encoding: gzip' <url> | gunzip | grep -q <新內容>`。
5. 回報時提醒站主：自己的瀏覽器可能還有最多 10 分鐘舊快取，按一次 Ctrl+F5。

## 6. Cleanup

- 停掉自己起的伺服器（用記下的程序 ID）；**不要按程序名稱一次全殺**，可能是別的 session 的。
- 刪掉 `evidence/` 以外的暫存；`_site/` 是 gitignore 的建置產物，留著無妨。
- 證據目錄在交付回報後依全域「收尾清理」規則刪除，並在回報列出。

## Verification

這個 skill 本身的驗證：在乾淨的 `_site/` 上對 `/` 與一篇文章跑第 3 步，`verify.log` 每行都是 PASS，`evidence/` 有 4 張截圖與 `report.json`，伺服器停掉後證據仍在。
