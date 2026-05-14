---
title: "把 AI 當成「更快的工程師」，是 IT 團隊最貴的誤解"
date: 2026-05-14
categories: [technical]
layout: article
cover_image: /assets/img/linkedin/ai-faster-engineer-misconception.jpg
source_url: "https://www.linkedin.com/pulse/%E6%8A%8A-ai-%E7%95%B6%E6%88%90%E6%9B%B4%E5%BF%AB%E7%9A%84%E5%B7%A5%E7%A8%8B%E5%B8%AB%E6%98%AF-%E5%9C%98%E9%9A%8A%E6%9C%80%E8%B2%B4%E7%9A%84%E8%AA%A4%E8%A7%A3-swanky-hsiao-7tkhc"
description: "把 AI 當成「更快的工程師」是 IT 團隊最貴的誤解。AI 越強，工程紀律越不能消失，必須升級——清晰需求、明確驗收、架構邊界、自動化 gates，才是 AI 協作能跑得快又跑得穩的關鍵。"
keywords: Claude Code, Agentic AI, 工程紀律, Example Mapping, OpenSpec, TDD, CI/CD, BDD, 軟體工程, Swanky Hsiao, 架構設計, 自動化測試, 工程管理, DevOps, 代碼品質
---

### 核心論點

推動 Claude Code 進團隊後，我更確認一件事：

> **AI 越強，工程紀律越不能消失，必須升級。**

這跟 Matt Wynne 的觀點不謀而合——AI coding agent 越來越強，但這不代表可以把需求丟給 AI 期待正確產出。反而相反，AI 越強，團隊越需要把以下問題講清楚：

- 什麼叫做「做對」？
- 哪些情境必須驗收？
- 哪些架構邊界不能破壞？
- 如何證明 AI「真的」完成？

尤其在企業級系統，「看起來可以跑」這四個字遠遠不夠。

### 團隊的實踐工作鏈

#### 【RM → SA】Example Mapping：把需求拆清楚

不急著開 Jira ticket，先讓 PO、SA、RD、QA 對「什麼叫完成」有共同語言。規則、例子、邊界、未回答的問題，全部攤開。

需求模糊，AI 寫得再快也是錯的方向；需求清楚，AI 才有機會跑在正確軌道上。

#### 【SA → SD】OpenSpec：把規格寫成 AI 也看得懂的形式

過去文件主要寫給人看，現在它也是 AI 的工作地圖。

- 地圖模糊，AI 走偏。
- 邊界沒標，AI 鑽進不該碰的地方。

規格不只是溝通工具，更是 AI 協作的護欄。

#### 【PG 階段】Claude Code + Superpower Skill：把 AI 放上軌道

讓 AI 依照 TDD 節奏、既有架構 pattern、CLAUDE.md 規範前進。

重點從來不是「AI 寫得多快」，而是「**AI 有沒有被放在正確的軌道上**」。

軌道對了，速度才有意義；軌道錯了，速度只是把錯誤放大的乘數。

#### 【交付前】用 Gates 自動把關

- 單元測試、整合測試、E2E、Playwright
- Lint、型別檢查、CI
- ADR review、安全掃描、mutation testing

> **AI 是加速器，gates 是煞車。**
>
> **沒有煞車的加速器，不是生產力，是風險放大器。**

### 工作方式的轉變

我們從關心「使用率」，變成關心「組織有沒有準備好，讓 AI 跑得快又跑得穩」：

- 我們的需求，AI 能正確理解嗎？
- 我們的驗收條件，能被自動證明嗎？
- 我們的 codebase pattern 夠清楚，讓 AI 跟得上嗎？
- 我們的 CI 與測試，承接得住 AI 帶來的變更速度嗎？
- 我們有沒有把團隊知識整理成「AI 可讀、新人也可讀」的工程資產？

這些問題沒有快答案，但每一題都決定了 AI 協作的天花板。

### Agentic AI 時代的 IT 團隊架構圖

```
🔧 Claude Code         = 引擎
🧭 Example Mapping     = 需求羅盤
🗺️ OpenSpec            = 規格地圖
🚗 Superpower Skill    = 駕駛習慣
🛑 測試與 CI           = 煞車系統
📜 ADR 與 CLAUDE.md    = 交通規則
```

少了任何一塊，AI 都可能從「助手」變成「技術債製造機」。

### 結論

AI 協作不是一次性的工具導入，而是一套**新的工程操作系統**。

工程師不會消失，但角色變了——從「打字寫 code 的人」，變成**定義問題、設計邊界、建立驗收、判斷風險**的人。

最後想留下這句話：

> **不是讓 AI 取代工程紀律。是用 AI，逼我們把工程紀律做得更清楚、更具體、更可驗證。**
