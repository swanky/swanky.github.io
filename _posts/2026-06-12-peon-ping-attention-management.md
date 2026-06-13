---
title: "我請星海爭霸的凱莉根，幫我盯 Claude Code"
date: 2026-06-12
categories: [technical]
tags: [claude-code]
layout: article
cover_image: /assets/img/linkedin/peon-ping-attention-management.jpg
source_url: "https://www.linkedin.com/pulse/%E6%88%91%E8%AB%8B%E6%98%9F%E6%B5%B7%E7%88%AD%E9%9C%B8%E7%9A%84%E5%87%B1%E8%8E%89%E6%A0%B9%E5%B9%AB%E6%88%91%E7%9B%AF-claude-code-swanky-hsiao-l1u3c"
description: "多 session 平行開發讓注意力成為新瓶頸。peon-ping 把 RTS 音效設計搬進 agentic coding，用遊戲角色語音幫你盯住每一條 AI 戰線。"
keywords: peon-ping, Claude Code, 注意力管理, agentic coding, AI 協作, 多工調度, RTS 音效, 星海爭霸, 凱莉根, CESP, 開發者體驗, context switch, 通知系統, Agentic Engineering, 史旺基, Swanky Hsiao, Swanky Studio
---

> 一小時做出來的玩具，十萬工程師在用：peon-ping 與 AI 時代的注意力管理

最近的 AI 協作日常長這樣：同時開好幾個 Claude Code session 在背景跑——一個在改 API、一個在補測試、一個在跑 E2E 驗證。

然後問題來了。

Agent 跑完了、卡在權限確認、或是出錯停住，terminal 並不會主動告訴你。你切去回個訊息或信件，回來才發現它十分鐘前就在等你按 yes。Agent 的時間不值錢，貴的是你每一次 context switch 燒掉的專注力。

有趣的是，這個問題 RTS 遊戲在 25 年前就解掉了。

星海爭霸怎麼讓一個玩家同時管理多條戰線？靠聲音。警報一響，你不用盯著小地圖，就知道該把鏡頭切去哪裡。聲音，本來就是平行任務管理的原生介面。

peon-ping 這個開源專案做的就是這件事：把 RTS 的音效設計，搬進 agentic coding 的工作流。

它的玩法：

→ Session 啟動、任務完成、需要權限、執行出錯、撞到 rate limit，各自觸發不同的遊戲角色語音，搭配螢幕橫幅通知

→ 收錄超過百款遊戲與影視作品的音效包：魔獸爭霸苦工（Peon）、星海爭霸、Portal 的 GLaDOS 都有，也能自己擴充

→ 不同專案目錄可以綁定不同角色——閉著眼睛，聽聲音就知道是哪個專案在叫你

→ 平行 subagent 太吵？一個設定就能只保留主 session 的完成音

→ 開會自動靜音：偵測到麥克風使用中，音效自動暫停

→ 彩蛋：短時間內狂催 prompt，苦工會不耐煩地嗆你 "Me busy, leave me alone!"

不只 Claude Code，Codex、Cursor、Gemini CLI 等十多種工具都支援，背後是 CESP 這個開放的音效事件標準。

這個工具的出身也很有意思。PCMag 最近報導了它背後的故事：最初版本是 Tony Sheng 花一個小時做出來丟上 GitHub 的，他自嘲這大概是自己發布過最蠢的東西——但每個用過的人都說意外好用。後來交棒給前 Google 工程師的弟弟 Gary 經營，登上 Hacker News、被整合進 VS Code 之後，如今已有約十萬名開發者在用。

一個一小時做出來的玩具，能長到十萬人在用，通常代表它打中的痛點是真的。

Gary 受訪時還講了一個我特別有感的點：大家花了不少錢買 AI 算力，但當 terminal 閒置在那邊等你回來，你已經付費的運算額度就是在空轉。

換句話說，注意力管理不只是專注力問題，它直接是成本問題。每一個被你晾在背景的 session，都在燒你刷下去的訂閱費。

我自己掛的是 sc_kerrigan 音效包——星海爭霸的凱莉根。任務跑完，刀鋒女王淡淡丟下一句 "I read you"。寫程式寫到一半被女王點名，荒謬又療癒，而且真的有效：等權限的 session，再也不會被我晾在背景十分鐘。

我之前談 SDD 時寫過：AI 時代的開發瓶頸，已經從「寫程式」移到「規格與判斷」。而開始多 session 平行開發之後，我看到第三個瓶頸正在浮現——注意力。

當開發模式從「人寫程式」變成「人調度多個 agent」，工程師會越來越像 RTS 玩家：拚的不是 APM，而是能不能在對的時間，把注意力切到對的戰線上。

不久之前，還沒有人覺得 Claude Code 需要音效；現在，「AI 跑完要通知我」正在變成理所當然。通知不是 nice-to-have，它是多工調度的基礎建設。

安裝一行搞定（macOS / Linux / WSL2 / Windows 都支援）：`brew install PeonPing/tap/peon-ping`

GitHub：[https://github.com/PeonPing/peon-ping](https://github.com/PeonPing/peon-ping)

PCMag 報導：[https://tech.yahoo.com/ai/claude/articles/inside-peon-ping-warcraft-iii-133000994.html](https://tech.yahoo.com/ai/claude/articles/inside-peon-ping-warcraft-iii-133000994.html)

你的 Claude Code，現在是哪個角色在幫你盯？歡迎留言分享你的音效包。
