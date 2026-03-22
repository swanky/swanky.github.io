---
title: "這 40 個實戰技巧，才是真正把 AI Coding 工具用到飛起來的方法"
date: 2026-03-23
categories: [claude-code]
tags: [claude-code]
layout: article
nav_active: education
cover_image: /assets/img/linkedin/claude-code-40-practices.svg
description: "40 個 Claude Code 最值得先學起來的最佳實踐，從基礎設定、工作流加速、上下文管理，到自動化驗證與平行多代理協作，幫你把 AI 開發工具從補字工具升級為完整的協作作業系統。"
keywords: Claude Code,AI coding,最佳實踐,開發加速,工作流優化,技術顧問,史旺基,Swanky Studio
---

很多人用 Claude Code，還停留在「幫我補這個 function」、「幫我改一段錯誤」的層次。
但真正把它用順的人，早就不是把它當自動補字工具，而是把它當成一套可以協作、執行、檢查、迭代的開發作業系統。

差別就在這裡：

不是「幫我寫一段程式」，
而是「幫我從規劃、修改、測試到驗證，一路把整個功能做完」。

原文有一句話很精準：

> 一般使用者和進階使用者的差距，不在於天分，而在於設定。
> 而這個差距，可能每週就值回 4 到 6 小時。

這篇文章整理了 **40 個 Claude Code 最值得先學起來的最佳實踐**。
如果你平常有在用 Claude Code、Cursor、CLI 型 AI 開發工具，這篇很值得存起來。

---

## 一、基礎設定：先把工作台搭好，效率才會開始放大

### 1. 先設 `cc` alias，省掉重複輸入

認真的 Claude Code 使用者，第一步通常會先做 alias。

把下面這行加到 `~/.zshrc` 或 `~/.bashrc`：

```bash
alias cc='claude --dangerously-skip-permissions'
```

然後執行：

```bash
source ~/.zshrc
```

之後你就可以直接打 `cc`，不用每次都輸入整串 `claude`。
而且這個設定會略過權限提示，操作速度會快很多。

不過這裡要特別提醒：
**這個選項等於你明確授權 Claude 更高的操作自由度**，請在你了解風險的前提下使用，不要無腦開。

---

### 2. 開啟即時狀態列

在 Claude Code 裡執行：

```bash
/statusline
```

它會幫你產生一段 shell script，讓終端機在每次互動後，顯示目前資料夾、分支、context 使用情況等資訊。

簡單講，它像是你的開發 HUD。
工作一久，這個小東西非常有感。

---

### 3. 把 context window 拉大到 1M tokens

如果你用的是支援大上下文的模型，例如 Sonnet 4.6 或 Opus 4.6，可以在工作中途切換：

```bash
/model opus[1m]
```

大 context 的好處是能一次理解更多檔案、更多歷史脈絡。
但不是越大越好，因為太大也可能導致 compaction 影響品質。

比較實際的做法是：
**先從 500k 開始，再慢慢找到自己專案最穩的甜蜜點。**

---

### 4. 一次設定輸出風格，之後都省事

執行：

```bash
/config
```

你可以選擇 Claude 的輸出風格，例如：

* Explanatory
* Concise
* Technical

也可以在 `~/.claude/output-styles/` 自訂自己的風格。

這件事很像替助理先定調。
先把口吻、技術深度、回答密度設定好，後面就不用一直手動糾正文風。

---

### 5. 用手機遠端控制 Claude Code

執行：

```bash
claude remote-control
```

之後可以從 `claude.ai` 或手機 App 連進來控制。
你可以在電腦上開一個長時間 refactor，然後去倒杯茶、坐沙發、用手機看進度。

這個功能很容易讓人第一次覺得：
「好，現在真的有點像活在未來。」

---

## 二、工作流加速：不是更努力，是少摩擦

### 6. `!` 前綴可以直接把 bash 結果送進上下文

例如：

```bash
!git status
!npm test
```

這些輸出會直接進到 Claude 的上下文裡，讓它可以立即根據結果行動。
少掉手動複製貼上的來回，很適合 debug 迴圈。

---

### 7. `Esc` 停止，`Esc + Esc` 回溯

* `Esc`：立刻停止 Claude 目前的動作
* `Esc + Esc` 或 `/rewind`：開啟還原選單，可恢復程式碼、對話，或兩者一起恢復

這就是你的 AI 版 undo。
當你發現「這方向好像不太對」時，越早回頭越省時間。

---

### 8. `Ctrl + S` 暫存 prompt 草稿

當你 prompt 打到一半，突然想到要先問另一個小問題，這功能就很神。

`Ctrl + S` 可以先把目前草稿存起來，等你插問完、拿到答案後，原本草稿會自動回來。

多段式任務時非常實用。

---

### 9. `Ctrl + B` 讓長任務背景執行

當 Claude 在跑測試、build、長時間檢查時，可以按：

```
Ctrl + B
```

讓它在背景繼續工作，而你前台還能繼續對話或規劃下一步。

這種平行處理感很重要，因為真正浪費時間的，常常不是 AI 慢，而是你一直被它卡住節奏。

---

### 10. `/btw` 用來插問，不污染主線對話

如果你臨時想問一句：

* 為什麼這樣設計？
* 你剛剛這個做法的替代方案是什麼？

可以用 `/btw` 開側邊問題視窗。
好處是主對話脈絡不會被一堆岔題弄髒。

---

### 11. `Ctrl + G` 先改 Claude 的計畫，再讓它做

當 Claude 提出實作計畫時，按 `Ctrl + G` 可以打開那份 plan 直接編輯。

這很關鍵。
因為很多時間不是花在「Claude 不會做」，而是花在「它用錯方法做得很勤勞」。

先修策略，再執行，省下的是後面整串返工。

---

### 12. 用語音 dictation，prompt 通常會更完整

執行：

```bash
/voice
```

語音輸入有一個很微妙但真實的優勢：
你講話時，通常會自然補上更多背景、限制條件、例外情境。

打字時常常只剩指令。
講出來時，反而更像真的在交辦工作。

---

## 三、上下文與 prompt 管理：清不清楚，比長不長更重要

### 13. 不相關任務之間記得 `/clear`

很多人會把一個 session 用成三小時大雜燴。
但上下文一旦越積越多，前面那些舊訊息就會悄悄稀釋你後面的指令。

所以遇到不同任務時，請果斷：

```bash
/clear
```

一個乾淨 session，往往比一個混濁的長 session 更強。

---

### 14. 修正兩次還不對，就重開新 prompt

如果你已經糾正 Claude 兩次，它還是沒抓到方向，不要硬修第三次。

最有效的方法通常是：

1. `/clear`
2. 用剛剛學到的資訊，重寫一份更精準的新 prompt

因為在錯誤脈絡裡硬拉，很容易越改越亂。

---

### 15. 不要描述 bug，直接貼原始資料

不要只說：

* 我這裡有個錯
* 感覺是 API 有問題
* build 好像掛了

直接貼：

* error log
* CI output
* terminal 錯誤
* Slack 討論串
* failing test

例如：

```bash
cat error.log | claude "explain this error and suggest a fix"
```

AI 最怕的是被人類先抽象化過。
你幫它整理過頭，它反而少了最重要的細節。

---

### 16. 架構性任務請用 Plan Mode

按 `Shift + Tab` 進入 Plan Mode。
只要是多檔案修改、模組重構、資料流重整、架構調整，先進 Plan Mode 幾乎都值得。

前面多花幾分鐘，後面可以少浪費二十分鐘在「很認真地做錯事」。

---

### 17. 明確指定要看的檔案

直接用：

```
@src/auth/middleware.ts
```

這樣 Claude 就能直接讀指定檔案，而不用自己去整個 codebase 裡亂找。

你本來就知道要看哪裡，就別讓它花 token 到處翻箱倒櫃。

---

### 18. 探索陌生程式碼時，反而可以故意問模糊一點

例如：

* 你會怎麼改善這個檔案？
* 這段程式看起來有哪些潛在問題？
* 這個模組哪裡最不一致？

這種模糊 prompt 在陌生地形很有用。
因為你不知道該問什麼時，Claude 有機會幫你指出你根本還沒想到的地方。

---

### 19. 使用 `/compact` 時，要告訴它保留什麼

例如：

```bash
/compact focus on the API changes
```

如果不加指示，壓縮後很可能把真正重要的線索一起壓扁。
但如果你先講清楚要保留什麼，compact 才會像摘要，不會像失憶。

---

### 20. 在 prompt 裡加上 `ultrathink`

如果你使用支援的模型，可以在 prompt 裡加入：

```
ultrathink
```

這會讓 Claude 依照問題複雜度，動態分配推理資源。
遇到困難問題時，品質提升通常是看得出來的，不是心理作用。

---

## 四、自動化、工具與驗證：讓它不只會寫，還會自己檢查

### 21. 一定要給 Claude 自我驗證的方法

例如你不要只說：

> 幫我重構 auth

而要說：

> 幫我重構 auth，跑測試，若失敗就修到通過再結束

這種 prompt 會大幅提升成果品質。
因為你不是只交代「做」，而是交代「做完後要驗證」。

---

### 22. 安裝 LSP plugin

LSP 類型的插件可以在 Claude 修改程式後，自動提供診斷資訊，例如 type error、語法錯誤等。

例如：

```bash
/plugin install typescript-lsp@claude-plugins-official
```

好處是它可以在你還沒發現問題前，先幫忙修掉。

---

### 23. 能用 CLI 工具，就優先別用 MCP Server

* CLI 工具通常更省 context
* 對長 session 來說更有效率

例如教 Claude 使用：

* `gh` 來處理 PR
* `sentry-cli` 來 debug production 問題

在長時間工作中，這種 context 節省會一直累積。

---

### 24. MCP Server 先裝這四種就好

推薦的四個高訊噪比選擇：

* **Playwright**：驗證 UI
* **PostgreSQL / MySQL**：查 schema、查資料庫
* **Slack**：直接讀 bug 討論串
* **Figma**：設計稿轉程式碼

重點不是裝越多越厲害。
而是先把真的常用的裝熟，不然最後只會變成工具收藏家。

---

### 25. 用 `/loop` 做背景輪詢

例如：

```bash
/loop 5m check if deploy succeeded
```

這樣 Claude 會在背景定時檢查部署是否成功，而你的 session 還可以繼續做別的事。

很適合處理 deploy、job 狀態、長時間流程追蹤。

---

### 26. 用 `/permissions` 設 allowlist

像 `npm run lint`、`npm test` 這類安全又常用的指令，不要每次都重新批准。

把它們加進 allowlist，才能維持工作流順暢。
那些看似小小的確認視窗，累積起來就是一筆很隱形的生產力稅。

---

## 五、CLAUDE.md 與規則管理：不是越多越好，是越準越好

### 27. 先跑 `/init`，再把產生結果砍掉一半

`/init` 會幫你產生一份起始版 `CLAUDE.md`。

但真正重要的是下一步：
**狠狠刪掉你無法明確說明必要性的內容。**

因為每一條多餘規則，都會吃掉 Claude 的注意力預算。

---

### 28. 檢查每一行規則：沒有它，Claude 真的會犯錯嗎？

這是一個很好用的判斷標準：

> 如果沒有這一條，Claude 真的會因此犯錯嗎？

如果答案是「不會」，那就刪掉。
你大概只有 **150 到 200 條指令的有效預算**，超過之後服從度就會開始下降。

---

### 29. 每犯一次錯，就更新一次 `CLAUDE.md`

當 Claude 出錯時，直接說：

> 更新 `CLAUDE.md`，避免下次再犯同樣錯誤

這樣你的規則檔會變成一個會持續進化的系統。
不是寫一次就擺著，而是每次踩坑後都變得更聰明一點。

---

### 30. 用 `.claude/rules/` 寫條件式規則

例如：

* 只有 `.ts` 檔才載入 TypeScript 規則
* 只有 `/db` 資料夾才載入資料庫規則

這樣可以避免不相關規則一直佔 context。
該出現時出現，不該出現時安靜，這才是好規則。

---

### 31. 用 `@imports` 讓 `CLAUDE.md` 保持精簡

不要把所有規範全文貼進 `CLAUDE.md`。
可以改成引用：

```
@docs/git-instructions.md
```

只有需要時 Claude 才去讀。
這樣基礎上下文就能保持輕量。

---

### 32. Skills 是「按需載入」的知識庫

放在 `.claude/skills/` 的 skills，可以在需要時擴充 Claude 的能力，但平常不會一直佔著基礎 context。

你可以把它想成函式庫：

* 需要時載入
* 不需要時隱形

這比把所有知識都硬塞進 `CLAUDE.md` 乾淨很多。

---

### 33. `CLAUDE.md` 適合寫建議，Hooks 適合寫硬規則

* `CLAUDE.md` 比較像「傾向遵守」
* Hooks 才是「每次都會執行」

如果你有不能妥協的要求，例如：

* 格式規範
* 安全限制
* 程式碼標準
* 必跑檢查

那就不要只寫在 `CLAUDE.md`，要用 Hooks。

---

### 34. 用 PostToolUse hook 自動格式化

例如在 `.claude/settings.json` 加入：

```json
"hooks": {
  "PostToolUse": [
    {
      "matcher": "Edit|Write",
      "hooks": [
        {
          "type": "command",
          "command": "npx prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
        }
      ]
    }
  ]
}
```

這樣每次 Claude 改完檔案後，都能自動跑 Prettier。
省掉手動整理格式這件小事，累積起來就是很大的順暢感。

---

### 35. 用 PreToolUse 阻擋危險指令

你可以在 Bash 工具真正執行前攔截危險命令，例如：

* `rm -rf`
* `DROP TABLE`

這類 PreToolUse hook 很像安全護欄。
有了它，你才比較敢讓 Claude 擁有更高自主權。

---

## 六、進階玩法：平行工作、分身代理、隔離環境

### 36. 用 `--worktree` 開平行分支工作

例如：

```bash
claude --worktree feature-auth
```

這會建立獨立 working copy。
你可以同時開 3 個 session，讓不同 Claude 各做不同功能，彼此不互相踩到。

當你真的掌握這個模式，AI 協作的吞吐量會直接變成另一個等級。

---

### 37. 用 subagents 保持主 context 乾淨

例如你可以說：

> 用 subagents 幫我釐清 payment flow

它會開一個獨立實例去讀檔、分析，再把摘要帶回來。
主對話不用被一大坨探索過程塞滿。

這很像把「查資料」和「做決策」分工。

---

### 38. 為重複任務建立自訂 subagents

透過 `/agents`，你可以建立固定用途的代理，例如：

* 快速搜尋 agent
* 嚴格 TypeScript reviewer
* 文件撰寫 agent
* PR 檢查 agent

久了之後，你會不是只有一個 Claude，
而是有一整組隨叫隨到的小隊。

---

### 39. Agent teams 處理大規模平行任務

可以開啟：

```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS
```

這樣會由一個 team lead 把任務分派給 3 到 5 個 subagents 平行處理。

如果是大型研究、多模組重構、跨範圍分析，這種玩法的速度提升不是線性的，是整個工作模式都變了。

---

### 40. 用 `/sandbox` 做高風險實驗

`sandbox` 可以在作業系統層級隔離環境，像是用 Seatbelt 或 bubblewrap 去保護主系統。

你可以放心讓 Claude 在裡面做大膽的實驗性重構，跑完再看 diff，喜歡的再合併。

這功能的價值在於：
**你可以讓它更敢做事，但不用拿真實環境陪它賭。**

---

## 真正該優化的，不只是程式碼，還有你的 AI 工作流

這 40 個技巧有一個共同核心：

不是叫你變成什麼傳說中的 10x 工程師，
而是讓你別再用「最原始、最手動、最容易卡住」的方式在跟 AI 協作。

真正快的人，優化的不只是一段 code，
而是整套：

* 怎麼交辦
* 怎麼驗證
* 怎麼縮短來回
* 怎麼減少上下文污染
* 怎麼把規則寫成系統
* 怎麼讓 AI 平行工作

這些差距，平常一天感覺不大。
但一週、一個月、一季累積下來，會變成非常誇張的複利。

---

## 建議你這週就先做的 5 件事

如果你不想一次吃下 40 條，可以先做這 5 個：

1. 設定 `cc` alias
2. 開始用 Plan Mode 處理多檔案任務
3. 在 prompt 裡加入「跑測試並修到通過」
4. 建立精簡版 `CLAUDE.md`
5. 把常用安全指令加入 `/permissions` allowlist

這五個先做好，工作流通常就會先明顯順起來。
