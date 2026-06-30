---
title: "我們不缺 AI 寫的文件，我們缺願意被讀完的文件"
date: 2026-05-18
categories: [technical]
tags: [claude-code]
layout: article
cover_image: /assets/img/linkedin/ai-document-human-comprehension.jpg
hero_image: true
source_url: "https://www.linkedin.com/pulse/%E6%88%91%E5%80%91%E4%B8%8D%E7%BC%BA-ai-%E5%AF%AB%E7%9A%84%E6%96%87%E4%BB%B6%E6%88%91%E5%80%91%E7%BC%BA%E9%A1%98%E6%84%8F%E8%A2%AB%E8%AE%80%E5%AE%8C%E7%9A%84%E6%96%87%E4%BB%B6-swanky-hsiao-69xzc"
description: "AI 時代文件的核心問題不是產生速度，而是人類理解效率。Markdown 應作工作流底稿，HTML 應成審查儀表板，重點是建立更好的「人機理解介面」。"
keywords: AI 文件生成, Markdown vs HTML, 審查介面, 人類理解, Agentic Engineering, Example Mapping, OpenSpec, Claude Code, 史旺基, Swanky Studio, 軟體工程效率, 技術文檔, 工作流自動化
---

### 從 AI 生成文件，到人類理解介面

最近讀到 Claude Code 團隊成員 Thariq Shihipar 寫的《The unreasonable effectiveness of HTML》，加上 Andrej Karpathy 的回應，讓我突然有種恍然大悟的感覺，原來很多業界頂尖也都沒有很想仔細看 AI 生了什麼內容因為真的太累人。

這個議題不只是「Markdown 跟 HTML 哪個比較好」。

它在提醒我們：**AI 時代，文件的角色正在改變。**

---

### Markdown 為什麼一直是首選？

因為它「方便人類編輯」。

純文字、好寫、可進 Git、可 diff，對工程師再自然不過。規格、計劃、PR 說明、會議紀錄，大家都用它。

但 Thariq 點出一個尷尬的事實：

當 AI Agent 越來越強，我們已經很少自己編輯這些檔案了。

更常見的流程是：AI 產生 → 人類閱讀判斷 → 人類給回饋 → AI 修改 → 進入實作審查。

也就是說，Markdown 最大的優點 ——「容易讓人修改」—— 在 AI 協作流程裡，比重正在快速下降。

---

### 真正昂貴的不是寫文件

最近我在團隊內推動 Claude Code、Example Mapping、OpenSpec 跟 Superpowers Skill，深刻體會到：

**AI 產 Markdown 的速度真的太快了。**

問題已經不是「AI 能不能寫文件」，而是 ——

**人會不會真的讀完？**

一份 200 行的規格，看起來很完整。但實務上主管、PM、工程師、QA 真的會逐行細讀嗎？更不用說要從裡頭快速判斷：這個需求 Ready 嗎？Example Mapping 有沒有漏掉情境？OpenSpec 的 scope 合理嗎？實作符合驗收條件嗎？PR 的風險在哪？

---

### 我現在的想法：文件要分兩種角色

- **Markdown 給 AI 與工作流程用**
- **HTML 給人類審查與決策用**

實際上我們正在嘗試的流程長這樣：

```
Jira Story (Epic)
  → Example Mapping → example-map.md + review.html (審查 Ready)
  → OpenSpec proposal/spec/tasks + review.html (審查開工)
  → Claude Code 實作 + 自動化測試
  → validation-report.html (證據)
  → PR + pr-explainer.html (Reviewer 入口)
```

Markdown 沒被取代，它仍然適合被 Git 管、被 AI 讀、被工程師精準修改。

但 HTML 在這個流程裡扮演了另一個角色 ——**它是審查介面。**

- **example-map-review.html** 把 Rules / Examples / Questions / Assumptions 視覺化，讓團隊一眼判斷需求清不清楚
- **openspec-review.html** 把 scope、非目標、風險、資料流、驗收條件做成一頁，讓 Tech Lead 容易做決策
- **validation-report.html** 把測試結果、Playwright 截圖、失敗案例放一起，讓 AI 不是只說「我做完了」，而是拿出證據
- **pr-explainer.html** 把變更範圍、影響、風險點整理清楚，讓 Reviewer 直接抓到重點

---

### Karpathy 的觀點把這件事再拉高一層

他的重點不是「HTML 比 Markdown 好」，而是在談人類與 AI 之間的輸入輸出頻寬。

人類給 AI 的輸入，未來會越來越偏向語音、指向、圈選、自然互動。AI 回給人類的輸出，不該永遠只是文字。

它應該更視覺化、更互動、更像一個可以被探索的介面。

AI 輸出格式的演進，大概是：

```
raw text → Markdown → HTML → interactive simulation
```

---

### 對 IT 團隊真正的意義

在企業裡，真正昂貴的從來不是文件產生。

AI 已經把產文件的成本砍到極低。

**真正昂貴的是：需求被誤解、審查沒看懂就放行、測試證據不足、PR 風險沒被抓到、大家以為對齊了，其實腦中的畫面完全不同。**

所以推動 Agentic Engineering，不能只問：

❌ **AI 有沒有幫我們寫更多文件？**

更該問：

✅ **AI 有沒有幫我們建立更好的「理解介面」？**

如果只是 Markdown 變更多，團隊只是從「人寫的文件沒人看」，進化到「AI 寫的文件沒人看」。

那不是效率，那只是把文件山蓋得更快。

---

### 文件的新定位

所以我現在會這樣定位：

- **Markdown 是工作流的底稿**
- **HTML 是人類審查的儀表板**
- **測試報告是 AI 完成工作的證據**
- **PR Explainer 是 Reviewer 進入脈絡的入口**

文件已經不再只是記錄，它會變成工作流的一部分 —— 是人跟 AI 對齊的介面，也是需求、設計、實作、測試、審查之間的橋梁。

以前我們選 Markdown，是因為「人要容易寫」。當 AI 已經很會寫之後，問題該變成：

**「人要怎麼更容易理解？」**

AI 讓文件生成變便宜。但人的理解與決策，仍然非常昂貴。

---

### 相關資源

- 原文 Thariq Shihipar：[https://x.com/trq212/status/2052809885763747935](https://x.com/trq212/status/2052809885763747935)
- HTML 範例集：[https://thariqs.github.io/html-effectiveness/](https://thariqs.github.io/html-effectiveness/)

**討論問題：** 你的團隊現在怎麼用 AI 產文件？是越來越多 Markdown，還是已經開始往「人類可消化的介面」走了？歡迎留言聊聊。
