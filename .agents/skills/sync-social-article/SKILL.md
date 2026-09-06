---
name: sync-social-article
description: 將 LinkedIn Pulse 文章或 X（Twitter）貼文／長文同步到網站的技術專欄（/technical/articles/）。支援單一來源，或兩個連結同時提供時融合成一篇（front matter 同時記錄兩個來源網址）。擷取逐字全文、下載封面圖片，建立符合專案格式的 Jekyll 文章檔案。當使用者提供 LinkedIn 或 X 文章連結，或說「同步文章」、「把這篇加到網站」、「sync linkedin」、「sync x」時觸發。
---

# LinkedIn / X 文章同步到技術專欄

你的任務是把一篇 LinkedIn Pulse 文章、一則 X 貼文（或長文），或兩者（同一篇內容的雙平台版本）同步到 Jekyll 網站的技術專欄。

## 輸入

URL（一個或兩個）：使用者呼叫 skill 時提供的輸入。

- 含 `linkedin.com` → LinkedIn 來源
- 含 `x.com` 或 `twitter.com` → X 來源
- 兩者都有 → **融合模式**（見「融合規則」）
- 若未提供任何 URL，請求使用者提供。

---

## 第一步：抓取來源全文

### A. LinkedIn Pulse（若有此來源）

**⚠️ LLM 摘要式抓取工具（例如以 URL 直接請 AI 代抓網頁內容的工具）對 LinkedIn 只會回傳改寫後的摘要，不可用於逐字擷取正文。必須以真實瀏覽器（如 Playwright）取得 DOM 後再擷取逐字原文。**

用瀏覽器自動化工具在頁面內執行下列腳本一次抓齊（例如透過可在頁面上下文執行任意程式碼的 Playwright 工具）：

```js
async (page) => {
  await page.goto('<LINKEDIN_URL>', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  return await page.evaluate(() => JSON.stringify({
    canonical: (document.querySelector('link[rel="canonical"]')||{}).href,
    title: document.title,
    artText: (document.querySelector('article')||{}).innerText,
    coverSrc: (document.querySelector('article img')||{getAttribute:()=>null}).getAttribute('src'),
  }));
}
```

注意事項（皆為實測踩坑）：
- **canonical 檢查**：URL slug 若含中文形近錯字（如 遐↔適），LinkedIn 會把頁面重導到通用職涯頁。抓完先確認 canonical 的 slug 與輸入一致（cn/www 子域差異可忽略）；不一致就依 canonical 修正字元重抓。
- **日期**：`artText` 內有「發表於 YYYY年M月D日」字樣，從中取出。
- **source_url 一律記 `https://www.linkedin.com/pulse/...`**（www 子域），即使 canonical 顯示 cn 子域也不用 cn。
- `artText` 開頭在標題前可能多一行 kicker／副標（LinkedIn 文章的引言欄位），是作者寫的內容，融合時可當引言素材，不要當雜訊丟掉。
- 正文從作者列（「Swanky Hsiao / 發表於…/ + 關注」）之後開始擷取。

### B. X / Twitter（若有此來源）

X 有三種內容型態，抓法不同。先用 syndication API 判斷型態（使用目前環境的原生 shell 執行）：

```bash
ID=<tweet_id>
TOKEN=$(node -e "console.log(((Number('$ID')/1e15)*Math.PI).toString(36).replace(/(0+|\.)/g,''))")
curl -s "https://cdn.syndication.twimg.com/tweet-result?id=$ID&token=$TOKEN&lang=zh-Hant" -o tweet.json
```

- 回傳 JSON 有 `article` key → **X Article 長文**（text 只是 t.co 連結，真正內容在 Article）
- 有 `note_tweet` → 長推文
- 都沒有 → 普通推文（`text` 即全文）

**X Article 全文用 fxtwitter API 取得**（未登入的 x.com 網頁會被登入牆擋住 Article 內文；syndication API 只給 preview_text 前 100 字）：

```bash
curl -s "https://api.fxtwitter.com/<username>/status/<tweet_id>" -o fx.json
```

從 `fx.json` 取 `tweet.article`：
- `title` — Article 標題
- `created_at` — 發布時間（UTC，轉台北時間取日期）
- `cover_media.media_info.original_img_url` — 封面原圖（pbs.twimg.com，通常是高解析 JPEG）
- `content.blocks[]` — Draft.js 格式全文，逐 block 取 `text`，依 `type` 轉 Markdown：
  - `unstyled` → 段落（block 內的 `\n` 保留為段內斷行）
  - `header-one` → `##`、`header-two` → `###`
  - `unordered-list-item` → `- `、`ordered-list-item` → `1. `
  - `blockquote` → `> `
  - `atomic` → 內嵌圖片，從 `media_entities` 對應

普通推文／note_tweet 也可直接用 fxtwitter 的 `tweet.text`（note_tweet 會給全文）。

**死路備忘（別再浪費時間）**：
- 未登入的瀏覽器自動化開 x.com 貼文頁只能看到 Article 預覽卡片；開 `/i/article/...` 直接被重導到登入頁。
- 以瀏覽器 cookie 匯入方式取得登入態（例如 gstack 的 browse skill 的 cookie-import-browser 功能）在 Windows 上對 Chrome/Brave/Edge 一律遇到 `DPAPI decryption failed`（Chromium App-Bound Encryption），不可行。
- fxtwitter 也失敗時（服務掛掉、貼文私密），最後手段：請使用者直接貼上全文。

---

## 第二步：融合規則（僅雙來源時）

兩個來源是同一篇內容的兩個平台版本，不是兩篇文章。融合成**一篇**：

1. **以較長、較完整的版本為主體**（通常是 LinkedIn 長文）：主標題、段落結構、正文語句皆以主體版為準。
2. **短版（通常是 X）的貢獻**：
   - 標題不同時，短版標題若有力，用作文章開頭的 blockquote 引言（本站慣例，參考既有文章開頭），或棄用——不要並列兩個標題。
   - 短版**獨有**的句子、金句、結尾，主體版沒有的，融入語意對應的位置。
   - 兩版語意重複的內容一律取主體版措辭，不要拼貼造成重複。
3. **front matter 記錄兩個來源**：`source_url`（LinkedIn）＋ `source_url_x`（X）。layout 會自動顯示「本文同步發佈於 LinkedIn 與 X」雙連結。
4. **封面**：兩邊封面不同時，選資訊密度高、與內文對應完整的那張（下載兩張後讀取並檢查內容再決定）；相同就選解析度高的。
5. **日期**：取兩者較早的發布日期。

單一來源時跳過本步：X-only 文章只填 `source_url_x`，LinkedIn-only 只填 `source_url`。

---

## 第三步：產生 slug

根據文章標題產生英文 slug（kebab-case）：
- 取標題關鍵英文詞彙，或從中文標題核心概念翻譯 3-5 個詞
- 全小寫，以 `-` 連接，例：「產品命名與社群記憶」→ `product-naming-community-memory`
- 檢查 `_posts/*<slug>*`（用檔名樣式搜尋）是否已重複；若已存在，詢問使用者是否覆蓋。

## 第四步：下載封面圖片

```bash
curl -sL -o <暫存檔> "<cover-image-url>"
file <暫存檔>   # 先驗格式
```

- 存放路徑：`assets/img/linkedin/<slug>.jpg`（X-only 文章也放這個目錄，維持單一慣例）
- **LinkedIn 封面常是 PNG**：用 `ffmpeg -y -i in.png -q:v 2 assets/img/linkedin/<slug>.jpg` 轉成 JPEG。
- X 封面用 `https://pbs.twimg.com/media/<id>.jpg?name=orig` 取原始解析度。
- 下載失敗（403 或格式異常）就繼續流程，`cover_image` 留空並在最後回報。

## 第五步：標點正規化

正文中的半形標點正規化為全形（`,` → `，`、`.` → `。`、`:` → `：`、`;` → `；`、`?` → `？`、`!` → `！`、`()` → `（）`），**例外**：
- 英文引文、專有名詞、程式碼、URL 內的標點不動（如 `Terra / Luna`、`depeg`、`GPT-5.6`）
- 數字千分位、小數點不動

並移除文章末尾的 hashtag 行（`#AI #SoftwareEngineering` 等）。

## 第六步：建立文章檔案

**檔案路徑**：`_posts/<date>-<slug>.md`

```markdown
---
title: "<文章標題>"
date: <YYYY-MM-DD>
categories: [technical]
layout: article
cover_image: /assets/img/linkedin/<slug>.jpg
hero_image: true
source_url: "<https://www.linkedin.com/pulse/... 完整 URL>"
source_url_x: "<https://x.com/<user>/status/<id>>"
description: "<一句話摘要，約50字內>"
keywords: <逗號分隔，含技術術語、史旺基、Swanky Hsiao、Swanky Studio>
---

<完整正文 Markdown>
```

格式要求：
- title 加雙引號；date 用 YYYY-MM-DD；categories 固定 `[technical]`；layout 固定 `article`
- `hero_image: true` 僅在有設計過的封面圖時加（沒有封面或封面是隨手圖就省略——單篇頁 banner 預設不顯示）
- 若要**自製** banner（來源沒有可用封面時），人物一律用站上的品牌角色形象——參考圖 `assets/img/brand/swanky-mascot-live-ref.jpg`，規範見 `AGENTS.md`「品牌角色形象」段。不得自行創作角色外觀
- `source_url` / `source_url_x` 只填實際存在的來源，各自加雙引號；X URL 去除 query string（`?s=20` 等），用 `x.com` 域名
- description、keywords 為繁體中文（zh-TW）
- 正文保留 Markdown 結構（##/### 標題、列表、引用、程式碼區塊）

## 第七步：評估是否歸入文章系列

本站的「文章系列」成員是硬編碼在各系列 hub 頁面 front matter 的 slug 清單，不是靠文章自身的 front matter。新文章預設不屬於任何系列，需在此步驟主動評估。

1. **盤點現有系列 hub**（搜尋 `technical/*/index.html` 找出 front matter 含 `_groups:` 的頁面）。目前有兩個：
   - `technical/agentic-engineering/index.html` — front matter `agentic_groups`（分組：心法 / 引導法 / 實戰工作流）
   - `technical/rwa/index.html` — front matter `rwa_groups`（分組：總論 / 兩大資產 / 標準與基建 / 監管與在地觀點）
2. 讀取並檢查這些 hub 的 front matter，理解每個系列與各分組的 heading／intro／現有文章清單。
3. 依新文章的 title、description、keywords、內文主題，判斷它是否明確屬於某個系列的某個分組。
4. **若判斷相關 →（不要直接改）先向使用者提出建議並等待確認**：
   - 建議：歸入「哪個系列 → 哪個分組」，插在「哪個 slug 之後」，附一句理由。
   - 等使用者確認或調整後，才在該 hub 頁面對應分組的 `posts:` 清單指定位置編輯插入新文章 slug。slug = 文章檔名去掉日期前綴與 `.md`，且須與其他 slug 互不為子字串（避免 `url contains slug` 誤匹配）。
5. **若判斷不屬於任何現有系列** → 跳過，不修改任何 hub，於最後報告註明「已評估，暫不歸入任何系列」。
6. 不擅自新增系列或新分組；如新文章自成新主題，於報告中向使用者提議，由使用者決定。

## 第八步：本地驗證 + Git commit + push

先驗證：

```bash
bundle exec jekyll build 2>&1 | tail -3   # 確認無錯
```

Windows／Git Bash 陷阱：若 `bundle` wrapper 報 `No such file or directory -- /c/Ruby33-x64/bin/bundle`，不要重裝 Ruby；直接呼叫 Windows batch wrapper：

```bash
'C:/Ruby33-x64/bin/bundle.bat' exec jekyll build
```

發布驗證應輸出到本次新建的獨立 destination；不要覆寫使用者既有的 `_site-*` 或 preview 目錄。

再提交（Windows 環境下，git 操作一律走 POSIX shell，避免 PowerShell 引號跳脫造成 commit message 亂碼）：

```bash
git add _posts/<date>-<slug>.md assets/img/linkedin/<slug>.jpg
# 若第七步有歸入系列，一併加入被修改的 hub 頁面；若本次調整過 layout/CSS 也一併加入
git commit -m "feat(technical): add <slug> article"
git push origin master
```

commit message 規則：
- 第一行：`feat(technical): add <slug> article`
- 結尾的 AI 共同作者署名依當場執行器的既定慣例附上（本 skill 不指定模型名，見 AGENTS.md 跨 agent 原則）
- 不要在 commit message 裡放中文標題（避免編碼問題）
- 若 push 失敗，回報錯誤訊息，不要重試。

---

## 完成後回報

- ✅ 建立的文章檔案路徑、文章標題
- ✅ 來源模式（LinkedIn-only / X-only / 雙來源融合）與各來源 URL
- ✅ 融合模式時：說明融合取捨（主體版、短版融入了什麼）
- ✅ 下載的封面圖片路徑（用了哪邊的封面）
- 📚 系列評估結果（建議歸入哪個系列／分組待確認，或「已評估、未歸入」）
- ✅ Git commit hash
- ⚠️ 任何需要手動確認的問題（圖片下載失敗、日期不確定、X 全文擷取失敗等）

## 注意事項

- **不重複建立**：執行前先搜尋 `_posts/*<slug>*`；同一篇文的第二個來源後補時，是**更新既有檔案**（補 `source_url_x` 或 `source_url`、必要時融合內文），不是開新檔。
- **繁體中文**：所有生成內容（描述、keywords 等）維持繁體中文（zh-TW）。
- **RWA 術語**：若內文涉及 RWA，一律寫「現實世界資產」（不寫真實世界資產）。
- **檔案改動假成功**：關鍵改動後用 `git status` / `git diff --stat` 核實檔案真的變了再往下走。
