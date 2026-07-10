---
title: "當 ChatGPT 變成 Classic：48 小時三場發布，比的不是誰更聰明，而是誰更會做事"
seo_title: "GPT-5.6、Grok 4.5、Muse Spark 1.1 發布解讀：AI 主戰場從聊天框轉向 agent"
date: 2026-07-10
categories: [technical]
tags: [claude-code]
layout: article
cover_image: /assets/img/linkedin/ai-model-wave-agentic-shift.jpg
hero_image: true
description: "2026 年 7 月 8 日至 9 日，Grok 4.5、GPT-5.6 與 Muse Spark 1.1 在 48 小時內接連發布，OpenAI 同時把 Codex 扶正成桌面主入口、聊天框降級成 ChatGPT Classic。本文從每天用 Claude Code 與多模型工作流的實踐者視角，解讀這波發布潮的分工、benchmark 的口徑陷阱，以及對台灣團隊的 model routing 建議。"
keywords: GPT-5.6, Grok 4.5, Muse Spark, Claude Fable 5, Codex, ChatGPT Classic, agentic coding, model routing, SWE-Bench, Terminal-Bench, Claude Code, Hermes Agent, agentic engineering, AI agent, 史旺基, Swanky Studio
---

7 月 8 日 Grok 4.5，7 月 9 日 GPT-5.6 和 Muse Spark 1.1。48 小時、三家公司、一整排新名字，發布密度高到像在清庫存。

但這兩天最值得玩味的新聞，可能不是任何一個模型。

是 OpenAI 把桌面版的門牌換了：原本給工程師寫程式用的 Codex，升格成新版 ChatGPT 桌面 App 的主體；而那個定義了整個 AI 時代的聊天框，改名叫 **ChatGPT Classic**。手機和網頁版一個像素沒動，改的只有 Mac 和 Windows 桌面端——但方向已經說得很清楚了。

一個 coding agent 工具成了正門，聊天框成了「經典版」。**這一輪的競爭，比的不再是誰更會回答，而是誰更會把活做完。**

我每天的工作主力是 Claude Code，旁邊掛著 Hermes Agent 做多模型調度與備援，也在課堂上教 agentic engineering——所以這波我看得特別仔細。先講結論：三場發布會，其實在說同一件事；而且分工意外地清楚。

## Grok 4.5：便宜到分數可能不重要

先看一個細節：發布方不叫 xAI 了，叫 SpaceXAI。xAI 年初併入 SpaceX，SpaceX 上市後又宣布收購 Cursor——所以 Grok 4.5 是掛著「與 Cursor 共同訓練」名號登場的第一個模型。

這件事為什麼重要？對這幾家不缺算力的公司來說，真正稀缺的是**帶回饋的真實資料**。Cursor 手上有幾百萬開發者每天在接受補全、拒絕建議、推翻 agent 方案、回滾重來——哪個方案被採納、哪個被人打掉，全是別家拿不到的訊號。

不過這裡要誠實拆成兩層：

- **已證實的**：官方確實說了「與 Cursor 共同訓練」，公司整合也在進行。
- **我的推測**：這批資料如果真的能在合規前提下餵進訓練迴路，紅利應該要到下一代才完全兌現。這段可以之後回來驗證。

分數面，Grok 4.5 摸到了第一梯隊的門檻：Artificial Analysis 智能指數排第 4，agentic 工具呼叫單項是全榜第一，Terminal-Bench 2.1 拿 81.6%。但純軟體工程還是有斷層——SWE-Bench Pro 只有 64.7%，對比 Claude Fable 5 的約 80%，15 個百分點不是誤差，是代差。

它真正的殺手鐧是成本結構：定價每百萬 token US$2／6，而且官方數據顯示，解同一道 SWE-Bench Pro 題目，它平均只用約 1.6 萬個輸出 token，大約是 Opus 4.8 的四分之一。**單價低、話又少，做同一件事的總成本差距是倍數級的。**

所以它適合什麼？大量、可自動驗證、有人兜底驗收的 agent 工作流。拿它做需要判斷力的研究或高風險內容？先緩緩。

## Muse Spark 1.1：不砌牆，想當包工頭

Meta 這次的新聞點不在能力，在商業模式：**Meta 第一次用自有的開發者 API 直接賣模型存取。**做了三年開放權重 Llama 的公司，這次選擇收費，連 Zuckerberg 都親自跑到 X 上發文宣傳。

精確一點說，這不是「Meta 第一次靠模型賺錢」（過去有雲端夥伴承接商業化），而是 Meta 首次自己收銀。這個差別很重要——它代表 Meta 想把「代理基礎設施」當成自己的產品線，而不是別人生態的原料。

分數很偏科，但偏得有性格：工具編排類的 MCP Atlas 拿 88.1（Opus 4.8 是 82.2），帶工具的 Humanity's Last Exam 62.1 也是第一；但純寫程式的 SWE-Bench Pro 只有 61.5，長上下文檢索更是明顯落後。

看出來了嗎？**它壓根沒想跟別人卷寫 code，它想當的是包工頭**：自己不砌牆，負責給一群 subagent 派活。官方特別強調它訓練過「先收集脈絡、制定計畫、再把工作分派給平行 subagents」，支援 100 萬 token context 還會自動壓縮上下文，定價 US$1.25／4.25 壓得很低。

這個定位我特別有感，因為它跟我用 Hermes Agent 在做的事幾乎同構：讓一個便宜、擅長調度的模型當中樞，把貴的模型留給關鍵工序。差別是 Meta 想把編排判斷直接訓練進模型，而不是留在應用層框架。這條路能不能走通，值得追蹤。

現實限制：Meta Model API 目前只對美國開發者開放預覽。台灣團隊先列入觀察清單就好，別當成架構依賴。

## GPT-5.6：一家三口，正面對上 Fable 5

OpenAI 一口氣發了三檔：旗艦 Sol、日常款 Terra、快速款 Luna（US$5／30、2.5／15、1／6），外加一個 Ultra——注意，**Ultra 不是更大的模型，是一種多代理模式**，預設協調四個 subagent 平行跑長任務。

頭條數字打的是 agentic coding：Terminal-Bench 2.1 上 Sol 拿 88.8%、Ultra 模式 91.9%。誠實的地方 OpenAI 也照登了：SWE-Bench Pro 上 Sol 只有 64.6%，跟 Fable 5 的約 80% 之間同樣是斷層，這張表就掛在自家發布頁上（登完還補了一句「這個 benchmark 約三成題目本身有問題」——Simon Willison 直接點破這是在找台階）。

第三方複測的說法更立體：Artificial Analysis 智能指數上 Sol 只落後 Fable 5 一分，但每任務成本大約只有三分之一；Coding Agent Index 上 Sol 甚至登頂，輸出 token 少了 54%。不過這裡有個**口徑陷阱**：那是各家模型跑各自官方 harness 的成績——Sol 配 Codex、Fable 配 Claude Code，不是同場對打。把不同榜單的百分比直接並列，是現在模型討論裡最常見的誤區。

還有一段必須寫。METR 的評測發現 Sol 出現他們測過的公開模型中最嚴重的刷分行為——包括繞過權限去讀隱藏的標準答案，METR 因此判定該項結果不可用。好消息是 OpenAI 自己的監控抓到了這些行為，也老實寫進了 system card。所以那條老建議依然有效：**agent 說「done」的時候，別全信。**驗證迴路要自己建，這正是我在[為工作流設計循環]({% post_url 2026-07-07-claude-code-designing-loops %})裡談的事。

我的判斷：Codex 重度使用者無腦升級，這版就是為你們發的；預算敏感的團隊，真正的甜點是 Terra——三個月前的旗艦級能力，現在半價。

## 四個陣營，四種位置

| 模型 | 核心定位 | API 價格（每百萬 token） | 強項 | 現階段短板 |
| --- | --- | ---: | --- | --- |
| GPT-5.6 Sol／Terra／Luna | 從旗艦推理到低成本執行的完整家族 | US$5／30 起，Luna 低至 1／6 | Terminal-Bench 領先；Ultra 原生多代理 | SWE-Bench Pro 仍落後 Fable 5 一截 |
| Grok 4.5 | 高速低價的執行器 | US$2／6 | 工具呼叫全榜第一；輸出 token 極省 | 純軟體工程有代差 |
| Muse Spark 1.1 | 多代理編排的包工頭 | US$1.25／4.25 | 工具編排第一；1M context＋自動壓縮 | 純 coding 偏弱；僅限美國預覽 |
| Claude Fable 5 | 高判斷力、長時程 agentic work | US$10／50 | SWE-Bench Pro 斷層領先；Claude Code 生態成熟 | 單價最高，划不划算取決於返工成本 |

順帶校正一個我看到很多人引用的數字：「Fable 5 SWE-Bench Pro 80.3%」其實有三個口徑——Anthropic 系統卡寫 Fable 5 約 80.0%、受限開放的 Mythos 5 是 80.3%、SpaceXAI 的比較表列 80.4%。差異不大，但**把不同 harness 的數字混成同一個，是討論的起點就歪掉**。

那 Fable 5 還是最強嗎？我會這樣說：它不再能用單一數字宣告全面領先（Terminal-Bench 和某些專業評測已被超車），但在需要判斷力、品味與長時程一致性的工程工作上，它仍是第一梯隊——而我的 Claude Code 暫時不用搬家。不是因為信仰，是因為 SWE-Bench Pro 那張表還掛在那裡，加上整套 harness、hooks、skills、subagents 的工作流成熟度，通常比榜單上高兩三分更值錢。但 Sol 值得正式進入我的 A/B 對照組，這是兩回事。

## 為什麼 Codex 成了正門

回到開頭那個改名。把 coding agent 扶正、把聊天框降級成 Classic，看起來激進，其實是三組數字推著走的：

**用戶量**：ChatGPT 有 9 億週活躍使用者；Codex 只有 500 萬，但半年成長 6 倍，而且超過 100 萬人拿它做的不是軟體開發。

**估值**：Anthropic 最新一輪融資後估值反超 OpenAI，成了全球估值最高的 AI 新創。

**收入**：Anthropic 年化收入 run rate 約 470 億美元，OpenAI 同期約 250 億——用戶少好幾倍的公司，收入接近對手兩倍，因為大頭是企業按 token 結算的 agent 工作負載。光 Claude Code 一個產品，年化收入就超過 25 億美元。

OpenAI 已經提交 IPO 申請。在損益表上，免費聊天用戶是成本；付錢跑 agent 的用戶才是故事。把桌面正門讓給那不到 1% 的付費工作者，改的不是產品，是招股書的封面。（「IPO 壓力直接導致這次整併」是我的策略推論，不是官方說法——但時間線自己會說話。）

還有一層我自己感受很深：**只是聊天的話，你根本不需要桌面 App**，網頁就夠了。到了 agent 時代，桌面 App 才第一次配得上它要的那些權限——存取檔案系統、開終端機、在背景連續跑幾小時的任務。聊天從來用不滿這個殼，OpenAI 只是讓房子物歸原主。

新版 App 頂欄只有兩個模式：「工作」與「Codex」，聊天被收進側欄。你如果用過 Anthropic 的 Claude Cowork，會覺得這個「工作」模式眼熟得很。兩家又踩進同一條河：上次是 Claude Code 和 Codex，這次是 Cowork 和「工作」。方向上是真想到一起了——**下一階段的主戰場不是回答問題，是替你把活幹完。**

## 對實作者的意義：這是佔便宜的窗口

對我們這些拿 AI 幹活的人，眼下是實打實的紅利期：模型在變強、單位任務成本在跳水，連分工都替你排好了。我目前的 routing 假設是這樣——注意，**這是待驗證的 hypothesis，不是永久規則**：

| 任務類型 | 第一候選 | 對照組 |
| --- | --- | --- |
| 架構設計、複雜重構、關鍵 code review | Claude Fable 5 | GPT-5.6 Sol |
| 大量、可自動驗證的批次任務 | Grok 4.5 | GPT-5.6 Luna／Terra |
| 多代理編排實驗 | Muse Spark 1.1（等開放） | GPT-5.6 Ultra |
| 低風險摘要、格式轉換、初稿 | GPT-5.6 Luna | 其他低價模型 |

比表格更重要的是方法：與其每次發布就全面遷移，不如從自己的真實工作裡挑二、三十個代表性任務，定義可判斷的驗收條件，讓候選模型在相同輸入下跑，記錄成功率、總成本和人工返工時間，再把結果寫回 routing 政策。這也是我在[Hermes Agent 的多模型架構]({% post_url 2026-07-04-hermes-agent-mixture-of-agents %})裡走的路線——fallback 只是備援，真正的 routing 要在任務開始前就依風險和成本選好模型。

幾個台灣團隊容易踩的坑，順手列一下：

1. **「已發布」不等於「你能用」。**Muse Spark 限美國預覽，GPT-5.6 在 ChatGPT 各方案採逐步開放。架構別把還拿不穩的模型當單點依賴。
2. **Benchmark 是篩選起點，不是採購結論。**題目品質、污染、harness 差異、reward hacking，每一項都能讓數字失真——連 OpenAI 自己都承認題庫有毛病。
3. **模型生命週期只會更短。**prompt、評測集、workflow 要和模型名稱解耦，讓換模型變成改一行設定，而不是重寫系統。
4. **幻覺只是其中一種失敗。**對 agent 來說，更危險的是用錯工具、誤判任務完成、把未驗證內容寫進正式成果。與其問「哪個模型幻覺低」，不如建立失敗分類和對應的偵測機制。

## 結語：下一個競爭單位，不是模型

這 48 小時的發布潮，沒有產生一個「總冠軍」，但畫清了一件事：**模型正在變成可替換的執行元件，真正值得累積的資產在別處**——任務資料集、驗收標準、routing 政策、失敗紀錄，和一套可重複運作的驗證迴路。模型每一代都會換，這些資產會讓每一代模型都更快變成你的能力。

這也是我對「該不該跟上新模型」這個問題的回答：問題本身問錯了。該問的是——當三家公司都在爭著替你把活幹完的時候，你的工作流，準備好驗收了嗎？

聊天框不會消失，網頁版永遠在那裡，隨手打開隨手關掉，它本來就該是這個形態。只是從這週起，它的名字前面多了個定語。

---

## 參考資料

- [OpenAI：GPT-5.6 發布說明](https://openai.com/index/gpt-5-6/)
- [OpenAI：ChatGPT Work 與新版桌面 App](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)
- [SpaceXAI：Grok 4.5](https://x.ai/news/grok-4-5)
- [Meta：Muse Spark 1.1 與 Meta Model API](https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/)
- [Anthropic：Claude Fable 5 與 Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)
