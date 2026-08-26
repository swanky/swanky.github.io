---
name: website-technical-column
description: 研究素材並製作、審稿、發布 Swanky 網站技術專欄，含圖表、水手服 Banner、社群轉貼文與上線驗證。當使用者提供文章、影片、論文、貼文、筆記或主題，要求改寫／研究成個人網站專欄時使用。
---

# Swanky 個人網站技術專欄產線

把使用者提供的素材，研究、查核、轉譯成具備技術深度又容易讀懂的網站長文；用可稽核圖表與 Swanky 品牌水手服美少女 Banner 完成視覺敘事；通過 Owner review 後才 commit、push、驗證正式站，最後在桌面交付 LinkedIn 與 X 的可直接複製短文。

## 必要依賴

開始前先載入並遵守：

1. `swanky_voice`：讀完整 `swanky_voice_profile.yaml`，校準第一人稱、判斷、節奏與台灣用語。
2. `research:grounded-citations`：建立來源 ledger、邊研究邊登錄、逐句引用與機械驗證。
3. `creative:website-visual-storytelling`：至少讀：
   - `references/technical-article-data-visualization.md`
   - `references/approval-gated-jekyll-release.md`
   - `references/swanky-site-visual-preferences.md`
4. `creative:swanky-sailor-uniform-article-covers`：Banner 概念、鎖角、裁切與視覺 QA。
5. 素材若是 YouTube／訪談影片，再載入 `media:youtube-content`；PDF／掃描文件則載入對應文件技能。

若上述技能、網站 `AGENTS.md` 或目前 repo 慣例衝突，以網站 repo 的最新 `AGENTS.md` 為準；涉及 Hermes 行為時，再以 Hermes 官方文件為準。

## 固定位置與輸出

- 網站 repo：`C:\Users\swank\Desktop\swanky.github.io`
- 文章：`_posts/YYYY-MM-DD-<slug>.md`
- Banner：`assets/img/linkedin/<slug>.jpg`
- 內文圖表／圖解：`assets/img/technical/<slug>/`
- 社群轉貼文：
  - `C:\Users\swank\Desktop\<slug>-linkedin.txt`
  - `C:\Users\swank\Desktop\<slug>-x.txt`
- 桌面中文 TXT 一律 UTF-8 BOM。

若使用者在當次任務指定其他網站 repo、參考圖或輸出位置，以當次明確指示為準；不得自行「修正」路徑。

詳細成品欄位與回報格式見 `references/delivery-contract.md`。

## 非協商邊界

- 只處理 Swanky 個人品牌、個人研究、公開資料與個人專案。公司任務、公司 repo、內部／客戶機密立即停止，請使用者改成可公開、去識別的個人層面素材。
- 不讀取、保存或引用密碼、金鑰、敏感個資與 `.env`。
- 不捏造 Swanky 的經歷、反應、實測結果、頭銜、客戶成效或數字。沒有來源的個人故事，寧可不寫。
- 不把 AI 圖當作真實事件、客戶成果、課程現場或實測證據。
- 不抄寫來源長段落。必要原文引用要短、可追溯；其餘用 Swanky 的分析框架重新組織。
- 文章在 Owner 看過最終 localhost 成品前維持 `published: false`，不 commit、不 push。
- Owner 對實際預覽明確說「確認，可以發布」後，才把既定 scope commit 並 push。舊的概括授權不能取代對本次成品的 review gate。

## 工作流程

### 1. 先盤點，不急著寫

1. 重新讀網站 repo 的 `AGENTS.md`、`CLAUDE.md`、相關架構／設計文件。
2. 執行 `git status --short`、目前 branch、remote、ahead／behind；保存 dirty baseline，不碰不屬於本篇的既有變更。
3. 讀至少兩篇同題材或最近的技術專欄，確認 front matter、長文元件、引用、CTA、圖表與圖片慣例。
4. 搜尋 `_posts/`、系列 hub 與資產，排除同題重複、slug 衝突、失效 related posts。
5. 建立本次 scope manifest：文章、Banner、內文視覺、必要 hub／測試，以及兩個桌面 TXT。禁止 `git add .`。
6. 清點使用者素材：原始檔／URL、作者、日期、完整性、語言、是否有逐字稿、是否有第一手數據、是否有授權資訊。

素材足夠時直接研究；只有在「缺少的資訊會改變核心結論或造成事實捏造」時才問。不要為標題、slug、圖表配色等低風險決策打斷工作。

### 2. 建立研究與證據鏈

1. 每篇文章建立獨立 citation ledger；取得來源時立刻登錄，不要寫完才憑記憶補 URL。
2. 來源優先順序：
   - 官方文件、規格、原始論文、原始訪談、原始資料。
   - 可信的獨立測試、學術／產業分析。
   - 新聞與二手整理只作脈絡或導覽，不取代第一手證據。
3. 使用者提供直接來源時，先讀原始來源；session history 只能補歷史脈絡，不能證明來源現在的內容。
4. 逐項把資訊標成：`來源事實`、`廠商宣稱`、`獨立量測`、`作者計算`、`Swanky 判斷`、`待確認`。
5. 日期、版本、產品能力、價格、法規、benchmark 等會變動的資訊，必須以當次檢索結果與明確日期為準。
6. 載入官方數字時保留條件：版本、provider、harness、樣本、時間窗、單位、計算公式與限制。不同口徑不能硬畫在同一條尺度上。
7. 重要或爭議宣稱至少找第二個獨立來源交叉核對；找不到就縮小表述或清楚標為未驗證，不要補洞。
8. 影片／訪談若要求「完整翻譯」，要逐段保留所取得內容與時間碼，並說明來源本身是否截斷；不可自行補寫缺失內容。

完成條件：先有可追溯的 claim → source／evidence 對應，再開始長文草稿。

### 3. 先決定文章要讓讀者看懂什麼

寫出內部 brief：

- 核心問題：讀者原本在哪裡困惑？
- 一句核心判斷：Swanky 到底站哪一邊？
- 非技術讀者收穫：能理解什麼、避開什麼誤會？
- 技術讀者收穫：能帶走哪個架構、流程、數據、限制或實作判準？
- 文章邊界：這篇刻意不回答什麼？
- 視覺主軸：哪些概念用圖比用字更清楚？

文章不是來源摘要。至少要完成「整理 → 比較 → 判斷 → 可採取行動」四層轉譯。

### 4. 用雙層閱讀結構寫深而不難的文章

建議骨架，依素材調整，不要硬套成顧問報告：

1. **具體場景或荒謬瞬間**：從來源裡一個可驗證事件、工具行為、對話或問題開始。
2. **30 秒結論**：3–5 點，讓非技術讀者先抓住方向。
3. **先講人話**：用一個準確類比說明「它是什麼、為什麼現在重要」。
4. **拆解原理**：架構、資料流、角色、協議或機制；術語第一次出現就白話定義。
5. **拿證據檢查敘事**：資料、案例、限制與反例，清楚區分來源事實和我的判斷。
6. **說它會怎麼壞**：邊界、風險、成本、失敗模式；不能只有功能與願景。
7. **如果是我，我會怎麼做**：給可落地的判準或小步驟，不寫空泛雞湯。
8. **安靜收尾**：回到人的判斷、工作或生活；不寫「未來值得期待」。
9. **參考資料**：由 ledger 機械產生，與 inline citations 一致。

寫作規則：

- 正體中文、台灣用語、短段落；英文專名保留，不用術語堆權威感。
- 先用白話交代意義，再下鑽到技術細節；不是把技術內容刪掉。
- 每節至少有一個具體例子、證據、圖或可操作判準，不靠形容詞撐篇幅。
- 至少有一個明確判斷與一個反方／限制；有取捨，不裝中立。
- 可以冷吐槽，但批評方法或觀點，不攻擊人。
- 用第一人稱，但只寫可證實的閱讀、研究、實作或既有公開經驗。
- 不寫中國用語、宏大敘事、假數字、假成效、雇主名或內部職稱。
- CTA 只在與文章主題自然相連時加入，語氣平視、不強迫。

### 5. 設計圖文敘事

先做 visual plan，再製圖。長文通常包含：

- 1 張 Banner：負責氣氛、品牌與文章的核心隱喻。
- 2–4 張功能性圖表／圖解：分別回答不同問題，例如「怎麼運作」「差在哪」「會在哪裡等」「成本由什麼構成」。
- 必要的來源截圖或照片：只在能提供真實證據、且權利與脈絡清楚時使用。

不是每節硬塞一張圖。目標是每 1–2 節有一個真正降低理解成本的視覺；純裝飾、重複文字、看起來很科技但沒有資訊的圖不要放。

#### 內文圖表

- 優先自己依引用資料重畫原創 SVG，而不是複製第三方圖表截圖。
- 1200px `viewBox` 是實用畫布；關鍵字在約 720px 文章欄寬與 390px 手機仍要可讀。
- SVG 要有 `<title>`、`<desc>`；文章使用結論導向 alt、短 caption，密圖可點擊開原尺寸。
- 架構圖箭頭要能讀成正確句子；分支、重試、核准與失敗不能畫成錯誤的線性順序。
- 表格、雷達圖與 benchmark 必須保留口徑。Radar 面積不是綜合分數；不同單位不能偷偷正規化。
- 圖上的數字與正文同源；作者計算附公式與假設。

#### 網路圖片／圖表

- 優先順序：repo 既有資產 → Swanky 原始素材 → 可確認授權的外部影像 → 自製 SVG／圖解 → AI 情境圖。
- 外部圖片只有在作者、原始 URL、授權／可引用條件可確認時才下載進 repo；不要 hotlink，也不要用搜尋縮圖當來源。
- 權利不清或第三方圖表可由資料重畫時，改做原創圖，並引用資料來源。
- 保存來源、作者、授權、擷取日期、caption 與 alt；截圖不可假裝成作者原創。

### 6. 產生品牌 Banner

1. 優先使用當次使用者指定參考圖；未另指定時，以網站正本：
   - `assets/img/brand/swanky-mascot-live-ref.jpg`
   - `assets/img/brand/swanky-mascot-anime-ref.jpg`
2. 每次生成都真的附上參考圖；模型不會跨對話記住臉。
3. 從文章萃取：核心決策、單一視覺隱喻、3–6 個主題物件、角色任務、避免清單。
4. 主角固定是同一位**成年**水手服美少女，臉、栗棕直髮、齊瀏海、兩條細紅髮帶與制服配色不可漂移。
5. 需要其他角色時，只用明確成年、外型亮眼、風格一致但臉孔可區分的美少女；每人都要有敘事任務，禁止複製臉、裝飾性站樁或小孩感。
6. 使用 High 品質生成；master 不放文章標題、段落、浮水印與易壞的 UI 文字。
7. 畫面要讓人不讀標題也能猜到主題。水手服少女要和主題物件互動，不是貼在通用科技背景前。
8. 網站輸出 16:9、1920×1080 JPG。依真實來源尺寸裁切；不得拉伸、中央壓縮、補邊、模糊延展或低清放大。
9. 用 vision 檢查原圖與最終裁切：鎖臉、成年感、手指、肢體、髮帶、制服、視覺隱喻、四象限密度、邊緣裁切、亂碼與品牌誤導。任一 blocker 就退件或局部修正。
10. 寫 `cover_alt`；若可能被誤認為證據，在文末加「AI 生成概念圖／情境示意圖」揭露。

### 7. 整合成 unpublished Jekyll 草稿

依目前網站慣例建立 front matter，至少包含：

- `title`、`seo_title`、`date`、`published: false`
- `categories: [technical]`、`layout: article`
- `tags`、`cover_image`、`cover_alt`、`hero_image: true`
- `cta_context`、三篇有效 `related_posts`
- `description`、`keywords`
- 有真實同步來源時才填 `source_url`／`source_url_x`

再完成：

1. 文章放 `_posts/YYYY-MM-DD-<slug>.md`；Banner 必須 `.jpg`。
2. 站內資產一律用 `{{ '/path' | relative_url }}`。
3. 評估現有系列 hub；相關時把建議納入 review scope，不擅自新增系列或分類。
4. 若文章需要新的共用 CSS／include／test，只做最小變更，不做順手重構。
5. `published: false` 只隔離文章 route，不會隔離 `assets/`。核准前禁止 commit／push 草稿及資產；若同 branch 同時要發布別的內容，另外隔離草稿資產。

### 8. 自動驗證後，只請 Owner 看一次

先由 Agent 自己完成，不把半成品丟回使用者：

1. 引用 ledger verify；檢查每個可查事實、數字、版本與引用。
2. 掃描台灣用語、未知 placeholder、假資料、雇主／機密字樣。
3. 驗 SVG XML、JPEG header／尺寸、所有圖片 natural dimensions 與 alt／caption。
4. `npm test`、`git diff --check`。
5. 建立兩個**全新** destination：
   - Normal Production Build：草稿 route／marker 不存在，另報告草稿靜態資產是否仍被複製。
   - Review Build（`--unpublished`）：文章、Banner、圖表、站內連結與來源連結都存在。
6. 啟動只讀 static server；以桌機與真實 390px device metrics 做 browser QA：H1、TLDR、TOC、文章欄寬、圖文節奏、表格、SVG、console、HTTP 200、`scrollWidth <= innerWidth`。
7. 最後一次改文章、front matter、Banner 或圖表後，重建到新的 destination；不得拿 stale build 當證據。
8. 檢查 git diff 只包含 scope manifest，且沒有覆蓋使用者原有 dirty files。

全部通過後，交付 localhost review URL、正式網址預期路徑、scope manifest、測試摘要與尚未執行的 commit／push。明確等待 Owner 對這個最終畫面說「確認，可以發布」。

### 9. 核准後 commit、push、正式驗證

1. 把 `published: false` 改成 `published: true`；納入 Owner 核准的系列 hub／測試變更。
2. 重新跑完整 `npm test`、fresh Jekyll production build、built route／圖片／連結／marker 檢查、`git diff --check`。
3. 只 `git add -- <explicit paths>`；核對 cached name-status、stat、diff、check，確認 scoped 檔案沒有漏 stage，也沒混入 unrelated dirty files。
4. 使用 Conventional Commit，例如 `feat(technical): publish <slug> article`；不要自行加入 AI co-author。
5. `git fetch origin` 後檢查 `origin/master...HEAD`。behind 不為 0 就停下處理，不 force、不重寫歷史。
6. 一般 fast-forward `git push origin master`。
7. 以 commit SHA 找正確 GitHub Actions run；確認 build 與 deploy 都成功。Pages 瞬態錯誤才可依 repo 規範重跑 failed jobs。
8. 直接抓正式文章 URL 與關鍵資產：HTTP 200、最新版 marker、圖片非零 bytes、尺寸正確。CI 綠不等於正式站已更新。
9. 最後確認 local／remote SHA 一致、ahead／behind 為 `0 0`；停止本次啟動的 server／browser，不刪其他人的 preview 或 untracked 檔案。

### 10. 產生桌面社群轉貼短文

正式網址驗證後才寫最終 TXT，避免留下錯誤 URL。

LinkedIn：

- 約 180–450 個中文字元，3–6 個短段落。
- 開頭先放一個反直覺判斷或具體問題；交代讀者能帶走什麼。
- 保留一點 Swanky 的觀點與冷吐槽，不寫成公告或行銷文。
- 一個正式文章 URL；hashtags 0–3 個。

X：

- 單則可直接貼，含正式 URL，保守控制在 260 個 Unicode code points 內。
- 一個鉤子、一個核心判斷、一個讀者收穫；hashtags 0–2 個。
- 不把同一個句子硬切成 thread，也不塞滿標籤。

兩個 TXT 只放可複製正文，不混入字數、備註、分隔線或替代版本。用 Python 實算字元數並驗 UTF-8 BOM；讀回確認內容與正式 URL。

## 完成定義

只有全部成立才能說完成：

- 研究與引用可追溯，重要宣稱有證據或明確限制。
- 文章同時讓一般讀者看懂、讓技術讀者有新東西可帶走，而且讀起來像 Swanky。
- Banner 使用正確參考圖與品牌角色，內文視覺真正降低理解成本。
- Desktop／390px 手機視覺 QA、測試、fresh build、連結與資產檢查都通過。
- Owner 已看過最終預覽並明確核准。
- scoped commit／push、GitHub Pages deploy 與 live page marker 均已驗證。
- 兩份 UTF-8 BOM 社群 TXT 已寫到桌面並讀回驗證。

若任一 Gate 未過，誠實回報「已做到哪裡、哪個證據缺失、下一個可執行修正」，不得以文章檔存在或 CI 綠燈代替完整交付。
