---
title: "Loop Engineering：你不再提示 AI，而是設計一個「提示 AI 的系統」"
date: 2026-06-10
categories: [technical]
tags: [claude-code]
layout: article
cover_image: /assets/img/linkedin/loop-engineering-ai-system.jpg
hero_image: true
source_url: "https://www.linkedin.com/pulse/loop-engineering%E4%BD%A0%E4%B8%8D%E5%86%8D%E6%8F%90%E7%A4%BA-ai%E8%80%8C%E6%98%AF%E8%A8%AD%E8%A8%88%E4%B8%80%E5%80%8B%E6%8F%90%E7%A4%BA-ai-%E7%9A%84%E7%B3%BB%E7%B5%B1-swanky-hsiao-najic"
description: "Addy Osmani 為 AI 協作開發定名 Loop Engineering：不再由人提示 AI，而是設計一個提示 AI 的系統。本文補完從 Prompt、Context 到 Loop 的脈絡，並談如何與 Spec-Driven Development 整合落地。"
keywords: Loop Engineering, Prompt Engineering, Context Engineering, Agentic Engineering, Claude Code, Spec-Driven Development, SDD, OpenSpec, TDD, Example Mapping, Addy Osmani, AI Coding, 代理式開發, 軟體工程, 工程治理, 史旺基, Swanky Hsiao, Swanky Studio
---

上週日（6/7），Google Chrome 團隊的工程主管 Addy Osmani 發表了一篇文章，幫 AI 協作開發的下一個階段定了名：**[Loop Engineering](https://addyosmani.com/blog/loop-engineering/)**。

我認為這個概念，對正在導入 AI coding 的技術團隊特別重要。這篇先幫還沒跟上的朋友補一段歷史脈絡，再談我會怎麼把它跟 Spec-Driven Development 整合落地。

## 前情提要：AI 輔助開發的重點，一直在變

**2022 年底，Prompt Engineering。** ChatGPT 問世，大家比的是怎麼把需求問清楚、指令寫精準。一句神 prompt 可以省你兩小時，但 AI 看不到你的程式碼，也看不到執行結果。

**2024 年，Context Engineering。** 大家發現只會下 prompt 還不夠——AI 需要知道專案背景、架構限制、coding style、測試規範。RAG、rules 檔、CLAUDE.md 開始變成標配。

**2025 年，代理式開發。** Claude Code、Cursor 這類 coding agent 不再只是回答問題，而是能讀 repo、改檔案、跑測試、看錯誤訊息、再修正。同年 vibe coding 一詞爆紅，也催生了反作用力——Spec-Driven Development 這類強調工程紀律的方法開始抬頭。

**2026 年，Loop Engineering。** Osmani 的定義很精準：不再由人一直提示 agent，而是**設計一個會提示 agent 的系統**，讓它依照目標反覆迭代到完成。

## 兩種模式的差別

過去的模式是：

人下指令 → AI 回答 → 人檢查 → 人再下指令 → AI 再修改

Loop Engineering 的模式則是：

讀取任務 → 對齊規格 → 拆解工作 → agent 實作 → 執行測試 → 驗證結果 → 記錄狀態 → 決定下一步

人不再站在旁邊一直餵 prompt，而是把「需求、規格、測試、驗證、回饋、記憶」設計成一條可重複運作的產線。AI 是工人，Loop 是產線，工程師還是廠長——不是吉祥物。

## 真正的瓶頸，已經不是「AI 會不會寫 code」

而是團隊有沒有能力定義清楚：

什麼是正確需求？ 什麼是完成條件？ 什麼是可接受的測試？ 什麼風險不能自動化放行？ 什麼知識要沉澱成團隊規範？

以 Claude Code 來說，這些已經可以落地：

- CLAUDE.md 放專案規範與架構原則
- Skills 封裝重複流程，例如「根據 OpenSpec 做 TDD」
- Subagents 拆分角色：規格審查、實作、測試驗證、安全審查
- Hooks 強制執行 lint、格式化、敏感檔案保護
- /goal 定義完成條件，讓 agent 持續做到條件成立
- /loop 定期巡檢 PR、CI、review comments
- GitHub Actions 把 AI review 放進既有開發流程

## 跟 SDD 是天作之合

如果團隊已經用 Example Mapping 釐清需求、用 OpenSpec 沉澱規格、再搭配 TDD，整條路其實就是一個 Spec-driven Loop：

Example Mapping → OpenSpec → 產生測試 → 實作 → CI 驗證 → 獨立驗證 → PR → 經驗回寫團隊規範

關鍵的指令差異：

❌「幫我做這個功能」

✅「根據 OpenSpec 的 acceptance criteria，先產生測試並確認先失敗，再實作到通過，最後由獨立的 verifier agent 檢查是否符合規格。」

還有一個容易被忽略的原則：**maker 與 checker 必須分離**。寫 code 的 agent 不該同時是唯一的評分者，因為它很容易替自己的答案找理由——這一點，跟人類工程師意外地像。

## 但 Loop 不是自動駕駛，它反而更要求紀律

acceptance criteria 模糊 → AI 只會自動化地誤解需求 測試品質不好 → AI 只會自動化地通過爛測試 權限開太大 → AI 只會自動化地放大風險 沒有 review 機制 → AI 只會自動化地累積技術債

所以我把 Loop Engineering 理解成：

**不是用 AI 取代工程師，而是把工程師的判斷、規範、測試與審查能力，變成可以反覆運作的系統。**

未來技術團隊的差異，可能不只在於誰比較會用 AI，而在於誰能把 AI 放進一條**可驗證、可追蹤、可治理**的開發迴圈裡。

Prompt 讓 AI 回答。 Context 讓 AI 理解。 Test 讓 AI 被檢查。 Loop 讓整個工程流程開始轉動。

這或許就是 AI coding 從個人生產力工具，走向團隊工程能力的關鍵一步。

你的團隊現在走到哪一階？歡迎留言聊聊。
