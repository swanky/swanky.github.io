---
title: "從單一模型到多代理協作：Hermes Agent 與 Mixture of Agents 深度研究"
seo_title: "Mixture of Agents 是什麼？從 Hermes Agent 看多模型代理協作的下一步"
date: 2026-07-04
categories: [technical]
tags: [claude-code]
layout: article
cover_image: /assets/img/linkedin/hermes-agent-mixture-of-agents.jpg
hero_image: true
description: "AI Agent 的競爭，正從「哪個模型最聰明」轉向「如何讓多模型、工具、記憶與工作流組成可靠系統」。本文從 Mixture of Agents（MoA）切入，解析 Nous Research 的 Hermes Agent 如何把 MoA 產品化成一個虛擬模型供應商，比較 LangGraph、CrewAI、AutoGen、OpenAI Agents SDK 等框架的差異，並附上研究論文清單與治理原則。"
keywords: Mixture of Agents, MoA, Hermes Agent, Nous Research, 多代理協作, multi-agent, AI Agent, agentic engineering, LangGraph, CrewAI, AutoGen, OpenAI Agents SDK, OpenRouter, Claude Code, aggregator, reference model, MoE, ReAct, GAIA, SWE-bench, AI runtime, 史旺基, Swanky Hsiao, Swanky Studio
---

> 2026 年的 AI Agent 競爭，不再只是模型智商競賽，而是 runtime、記憶、工具、安全與評估方法的系統設計競賽。

AI Agent 的競爭，正在從「哪個模型最聰明」轉向「如何讓多個模型、工具、記憶與工作流形成可靠系統」。

Nous Research 的 Hermes Agent 是這個轉向中很值得研究的開源專案。它不只是聊天介面，也不只是 prompt loop，而是把模型供應商切換、工具呼叫、技能系統、長期記憶、排程、自動化、跨平台訊息入口與子代理平行處理，整合在同一個 agent runtime 裡。

更值得注意的是，Hermes Agent 已在官方文件中提供 **Mixture of Agents（MoA）** 功能。它把 MoA 做成一個「虛擬模型供應商」：使用者可以像切換一般模型一樣選擇 `moa` provider；Hermes 會先讓多個 reference models 提供分析，再由 aggregator 作為真正的 acting model 產出回答與工具呼叫。官方文件明確說明，MoA preset 的 aggregator 才是實際寫出 assistant response 與發出 tool calls 的模型，reference models 則先行提供分析供 aggregator 使用。

這篇文章會從四個角度來談：MoA 的研究脈絡與 Hermes 的產品化實作、Hermes Agent 作為個人常駐型 AI runtime 的架構價值、它與主流框架的差異，以及我自己打算怎麼把它放進研究與內容生產的工作流。

---

## 為什麼 2026 年還值得研究 Hermes Agent？

2024 到 2025 年的 Agent 熱潮，很多專案停留在「能 demo」的階段：能規劃、能查資料、能叫工具、能串幾個 API。這些 demo 很漂亮，但放到真實工作裡，很快會遇到幾個問題：

- Agent 不記得過去的互動，或記憶很難管理。
- Agent 會用工具，但缺少權限邊界與安全設計。
- Agent 可以完成單次任務，但很難變成長期可運作的工作系統。
- 多模型很強，但使用者往往不知道何時該用便宜模型、何時該用高階模型。
- Agent 的能力常常散落在 CLI、聊天工具、瀏覽器、自動化腳本與文件系統之間，最後變成一隻章魚在彈鋼琴，手很多，譜很亂。

Hermes Agent 的定位剛好切中這些問題。它的 GitHub README 把 Hermes 描述為 self-improving AI agent，具備 built-in learning loop，能從經驗建立 skills、在使用中改善 skills、搜尋過去對話、跨 session 建立使用者模型，並支援 Telegram、Discord、Slack、WhatsApp、Signal、CLI 等多種入口。

這使 Hermes 比較不像「一次性 Agent 框架」，而更像「個人 AI 作業系統」的雛形。

---

## MoA 是什麼？和 MoE 有什麼不同？

討論 Hermes 的 MoA 前，先要拆開兩個容易混淆的概念：**MoE** 與 **MoA**。

**MoE（Mixture of Experts）** 通常發生在模型內部。模型在推論時會透過 routing 機制選擇部分 expert subnetworks 參與計算。使用者看到的是一個模型，背後的專家選擇由模型架構處理。

**MoA（Mixture of Agents）** 則通常發生在應用層或推論層。它不是模型內部架構，而是讓多個模型或多個代理在同一個任務中產生候選分析、互相補強，最後再由一個整合者輸出結果。

Wang 等人在 2024 年的論文《Mixture-of-Agents Enhances Large Language Model Capabilities》中提出 layered MoA architecture，每一層包含多個 LLM agents，每個 agent 會把前一層的 agent outputs 當成輔助資訊再生成回答。該論文報告 open-source LLM 組成的 MoA 在 AlpacaEval 2.0 取得 65.1% 分數，高於 GPT-4 Omni 的 57.5%。

用比較直覺的方式說：

> MoE 是模型腦內開會。
> MoA 是你在模型外面組一個研究小組。

這個差異很重要。因為 MoA 不需要重新訓練模型，也不需要掌握模型內部參數。它更像是一種 inference-time system design，透過「多模型觀點 ＋ 整合模型」來提升結果品質。

---

## Hermes 如何把 MoA 產品化？

Hermes 的做法不是把 MoA 做成外掛式工作流，而是把它包成一個 **virtual model provider（虛擬模型供應商）**。官方文件說明，每個 MoA preset 會出現在 `moa` provider 底下，像一般模型一樣可以被選取。

當使用者選擇 MoA preset 時，Hermes 的流程大致是這樣：

<figure style="margin:1.6em auto;text-align:center;max-width:680px;">
  <img src="{{ '/assets/img/hermes-moa/moa-loop.svg' | relative_url }}" alt="Hermes MoA agent loop 流程圖：使用者提示先解析 MoA preset，再交由多個 reference models 平行分析（不接觸工具），匯整成 private context 後由 aggregator 判斷是否需要工具，需要就發出 tool call 回到 loop、不需要就產出最終回應" style="width:100%;height:auto;border:1px solid #eef0f2;border-radius:8px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.6em;">圖一：Hermes 的 MoA agent loop——reference models 負責「想法」，aggregator 負責「行動」</figcaption>
</figure>

拆開來看：

1. **解析 preset**：agent loop 先確定這一輪要用哪一組 reference models 與哪一個 aggregator。
2. **reference models 先想**：它們在沒有 tool schemas 的情況下執行，只接收對話中的 user／assistant text，不接收 Hermes 的 system prompt，也看不到 tool-call transcript。
3. **匯整成 private context**：Hermes 把 reference outputs 附加成一段私有脈絡。
4. **aggregator 行動**：aggregator 帶著 Hermes 正常的 tool schema，因此真正的工具呼叫仍由它發出。

這個設計很聰明，因為它保留了 Hermes 原本的 agent loop，不會讓每個 reference model 都陷入工具相容性、權限控管與 provider 格式差異的泥沼。**Reference models 負責「想法」，aggregator 負責「行動」。**

---

## 一個 MoA 設定範例

Hermes 的 MoA preset 可以從 Dashboard、Desktop app、`hermes moa configure [name]` 或 `config.yaml` 設定，而且允許混合不同 provider 與模型。官方範例中，reference models 可以來自 `openai-codex` 與 `openrouter`，aggregator 也可以指定為另一個 provider／model pair。

一個簡化的範例大概長這樣：

```yaml
moa:
  default_preset: review
  presets:
    review:
      reference_models:
        - provider: openrouter
          model: openai/gpt-5.5
        - provider: openrouter
          model: deepseek/deepseek-v4-pro
      aggregator:
        provider: openrouter
        model: anthropic/claude-opus-4.8
      reference_max_tokens: 600
      max_tokens: 4096
      reference_temperature: 0.7
      aggregator_temperature: 0.3
      enabled: true
```

其中最值得注意的是 `reference_max_tokens`。官方文件指出，MoA 每一輪都會平行執行 reference models，然後等待 aggregator 回應；每輪延遲往往和 advisors 產生多少 tokens 高度相關，因為整輪要等最慢的 advisor 完成。設定 `reference_max_tokens` 可以限制 advisors 的輸出長度，讓它們給出簡短建議、降低 wall time，而且不會限制 aggregator 最後給使用者看到的輸出。

我自己的實務判斷是：MoA 不該變成每個問題都開的大砲。它比較適合用在「高價值決策」或「需要多角度檢查」的節點，例如研究報告、方案比較、架構評審、PR review、顧問提案、投資研究，或重要文章發表前的反方檢查。

---

## MoA 的價值：不是更多模型，而是更好的決策流程

MoA 最容易被誤解成「多找幾個模型投票」。但真正有價值的 MoA，不只是投票，而是設計一條決策管線。

比較理想的 MoA 應該包含四種角色：

| 角色 | 任務 | 適合模型 |
| --- | --- | --- |
| Researcher | 蒐集資訊、整理來源、找出關鍵事實 | 成本較低、搜尋強、摘要穩定的模型 |
| Specialist | 針對技術、商業、法規、產品做專業分析 | 特定領域表現好的模型 |
| Skeptic | 挑錯、找風險、檢查過度推論 | 推理強、保守、善於批判的模型 |
| Aggregator | 整合觀點、取捨、形成最終輸出 | 高品質寫作與推理模型 |

這也呼應 2025 年的《Rethinking Mixture-of-Agents》論文。該論文指出，混合不同 LLM 不一定總是優於用單一強模型做 self-ensemble；作者提出 Self-MoA，並在多項 benchmark 中觀察到它能超越 standard MoA。這提醒我們，MoA 的品質取決於模型選擇、任務類型與整合策略，不是模型越多越好。

換句話說，MoA 的核心不是「開很多模型很熱鬧」，而是「在正確的節點引入正確的分歧」。

---

## Hermes Agent 的架構價值

Hermes Agent 值得研究，不只是因為它支援 MoA，而是因為它把 MoA 放進一個比較完整的 agent runtime。

Hermes 官方 README 提到幾個關鍵能力：

- 可使用 Nous Portal、OpenRouter、OpenAI、自有 endpoint 等模型來源，並可用 `hermes model` 切換，降低模型供應商鎖定。
- 支援 Telegram、Discord、Slack、WhatsApp、Signal 與 CLI，並能維持跨平台 conversation continuity。
- 具備 agent-curated memory、periodic nudges、autonomous skill creation、skills self-improve、FTS5 session search 與 LLM summarization。
- 內建 cron scheduler，可執行 daily reports、nightly backups、weekly audits 等自然語言排程任務。
- 可 spawn isolated subagents 做 parallel workstreams，也可以寫 Python scripts 透過 RPC 呼叫工具，把多步流程壓縮成低 context 成本的操作。

這些能力加在一起，代表 Hermes 的重點不是「一次問答」，而是「常駐協作」。這也是我認為它值得持續研究的原因：

> 未來的 AI 能力，不只來自模型本身，而來自模型、工具、記憶、流程、權限與評估方法組成的 runtime。

---

## 和主流 AI Agent 框架比較

### Hermes Agent

Hermes 的特色是「個人常駐型 runtime」。它適合做長期研究、自動化提醒、跨平台助理、個人知識管理、技能累積與多模型路由。它不是最輕量的框架，但很適合需要「長期成長」的 agent。

### LangGraph

LangGraph 更像工程導向的 workflow graph。它適合明確定義狀態、節點、分支、checkpoint 與可重跑流程。如果你在企業內要做可控流程，例如核准、客服分流、合規稽核、文件審查，LangGraph 會比 Hermes 更像「流程引擎」。

### CrewAI

CrewAI 的官方文件主打 collaborative AI agents、crews 與 flows，並強調 guardrails、memory、knowledge、observability 等能力。它適合快速建立角色分工明確的多代理流程，例如研究員、撰稿員、審稿員、專案經理共同完成任務。

### OpenAI Agents SDK

OpenAI Agents SDK 是相對輕量的 agentic app 開發套件。官方文件把 primitive 簡化為 Agents、Agents as tools／Handoffs、Guardrails，並內建 agent loop、function tools、MCP server tool calling、sessions、human-in-the-loop、tracing 等能力。它適合已經在 OpenAI 生態內開發產品的人，尤其是需要清楚 tracing、guardrails 與 handoffs 的應用。

### AutoGen

AutoGen 的定位是 building AI agents and applications。官方文件區分 Studio、AgentChat、Core、Extensions；其中 AgentChat 適合 conversational single and multi-agent applications，Core 則是 event-driven programming framework，用於 scalable multi-agent AI systems。它適合做多代理對話研究、實驗型 agent collaboration，以及需要事件驅動、多語言、分散式代理的架構。

### OpenClaw

OpenClaw 代表另一條路線：以個人自主助理與 skills 生態為主。近期報導與資料顯示，它常被拿來和 Hermes Agent 一起比較，OpenClaw 偏向快速上手、技能庫與多通道整合，Hermes 則偏向 self-learning 與長期 runtime。

但 OpenClaw 也提醒我們一件事：當 agent 具備本機檔案、終端機、瀏覽器、錢包、行事曆或訊息權限時，技能生態本身就會變成供應鏈風險。已有安全研究討論 OpenClaw 這類代理的 skill poisoning、cognitive manipulation、multi-agent cascading failures 與 supply-chain vulnerabilities。

### 框架比較總表

| 框架 | 核心定位 | 最適合場景 | 主要風險 |
| --- | --- | --- | --- |
| Hermes Agent | 個人常駐型 self-improving runtime | 個人研究雷達、跨平台助理、長期記憶、排程、自動化 | 權限控管與記憶治理要設計好 |
| LangGraph | 狀態圖與可控 workflow | 企業流程、自動化管線、可重跑任務 | 需要較多工程設計 |
| CrewAI | 多角色 crews 與 flows | 快速建立多代理分工 | 長期記憶與安全邊界仍需自行規劃 |
| OpenAI Agents SDK | 輕量 agent app runtime | OpenAI 生態內產品開發 | 供應商依賴較高 |
| AutoGen | 多代理對話與事件驅動研究 | 多代理協作研究、原型實驗 | 生產化仍需額外治理 |
| OpenClaw | 個人自主助理與技能生態 | 快速自動化、多通道個人 assistant | 第三方 skills 與高權限操作風險 |

---

## 把 Hermes MoA 放進真實工作流

工具介紹寫完，更重要的是它能落在什麼位置。以下是我自己最想優先落地的三個場景。

### 場景一：AI Agent 研究雷達

這是我最想先做起來的應用。骨架大致是：

<figure style="margin:1.6em auto;text-align:center;max-width:680px;">
  <img src="{{ '/assets/img/hermes-moa/research-radar.svg' | relative_url }}" alt="AI Agent 研究雷達 pipeline 流程圖：Cron 每日觸發三路 Scout（News／Paper／GitHub）平行蒐集，匯整成研究摘要後經 Skeptic 反方檢查、MoA aggregator 整合，最後產出網站長文草稿、LinkedIn 觀點文與 X Thread 三種輸出" style="width:100%;height:auto;border:1px solid #eef0f2;border-radius:8px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.6em;">圖二：AI Agent 研究雷達——同一套骨架換掉資料來源與目標，就能變成顧問案源雷達</figcaption>
</figure>

可以讓 Hermes 每天追蹤：

- AI Agent 新框架
- MoA／multi-agent 論文
- OpenRouter 模型排行與價格變化
- Claude Code／Codex／Grok／Gemini Agent 的能力變化
- Web3 與 AI 交集的新產品
- GitHub 熱門 agent repo

MoA 不一定用在每天的所有摘要，而是用在「每週一篇正式研究文章」前的最後整理。

### 場景二：Web3／AI 技術顧問案源雷達

同一套骨架，換掉資料來源與目標，就能變成顧問案源雷達，而不只是找新聞。Pipeline 可以這樣拆：

1. 掃描企業公告、職缺、技術文章、融資新聞。
2. 判斷該公司是否正在導入 AI Agent、Web3、錢包、資料治理或內部自動化。
3. 產生潛在痛點。
4. 產出顧問切入角度。
5. 生成 LinkedIn 互動建議或冷啟動訊息草稿。
6. 用 MoA 檢查「這個切入點是否合理、會不會太硬、是否有商業價值」。

這種應用很貼近我自己的定位：AI Agent × Web3 × 軟體工程流程顧問。

### 場景三：Claude Code 與 Hermes Agent 的分工

可以把 Claude Code 當成「工程實作副駕駛」，Hermes Agent 當成「長期研究與提醒中樞」。

| 任務 | 適合工具 |
| --- | --- |
| 寫程式、改 repo、跑測試 | Claude Code |
| 長期追蹤新聞與論文 | Hermes Agent |
| 每天彙整 Web3／AI 趨勢 | Hermes Agent |
| Example Mapping／OpenSpec／TDD 實作 | Claude Code |
| 每週研究文章選題 | Hermes Agent ＋ MoA |
| 最終長文修稿 | Claude／ChatGPT／MoA aggregator |

這樣的分工比「哪個工具最好」更成熟。真正有效的 agentic workflow，不是單一工具稱王，而是每個工具坐在對的位置上。

---

## 部署與使用建議

### 不要一開始就全自動

Hermes 有排程、工具、記憶、skills 與 gateway，很容易讓人一開始就想做「全自動個人助理」。但比較穩健的方式是分階段：

1. **只讀取、只整理、不執行外部動作**——例如每日研究摘要、論文雷達、AI 工具新聞整理。
2. **產生草稿，但人工確認後才發出**——例如 LinkedIn 文章草稿、X thread、顧問開發信、活動推薦。
3. **允許低風險自動化**——例如整理資料夾、建立 markdown 筆記、更新 local knowledge base。
4. **高風險操作永遠保留人工確認**——例如寄信、發文、交易、刪檔、改 production 設定、操作公司系統。

### MoA 用在高價值節點

| 任務 | 是否建議用 MoA | 原因 |
| --- | --- | --- |
| 日常問答 | 不建議 | 成本與延遲不划算 |
| 每日新聞摘要 | 視情況 | 可用便宜模型先整理 |
| 技術研究長文 | 建議 | 需要多角度與批判 |
| 顧問提案 | 強烈建議 | 品質與風險很重要 |
| PR review | 建議 | 可加入架構、測試、安全觀點 |
| 投資決策 | 可用，但必須人工判斷 | 避免自動化金融決策 |
| 社交活動推薦 | 不一定 | 可用單模型加偏好記憶即可 |

### 建議建立三種 MoA preset

```yaml
moa:
  default_preset: research
  presets:
    research:
      reference_max_tokens: 700
      reference_temperature: 0.5
      aggregator_temperature: 0.3

    skeptic:
      reference_max_tokens: 500
      reference_temperature: 0.2
      aggregator_temperature: 0.1

    content:
      reference_max_tokens: 600
      reference_temperature: 0.8
      aggregator_temperature: 0.5
```

三種 preset 的用途：

- `research`：研究報告、技術比較、論文摘要。
- `skeptic`：反方檢查、風險控管、投資或顧問提案前的檢查。
- `content`：網站文章、LinkedIn、X thread、個人品牌內容。

---

## 值得一讀的 Agent 研究論文

以下是這篇文章背後的閱讀清單。它不只是「參考資料」，也可以當成後續研究的種子。

### Mixture-of-Agents Enhances Large Language Model Capabilities

MoA 的核心論文，提出 layered MoA architecture，讓多個 LLM agents 分層產生輸出並互相參考，最後提升回答品質。

**對 Hermes 的啟發**：Hermes 把這個概念產品化成 model provider，而不是獨立的 orchestration framework。

### Rethinking Mixture-of-Agents

這篇論文提醒我們，混合不同模型不一定永遠更好；Self-MoA 在不少情境下反而超越 standard MoA。

**對 Hermes 的啟發**：不要迷信「多模型混合」，要針對任務做 A/B test。

### ReAct: Synergizing Reasoning and Acting in Language Models

ReAct 是 tool-using agent 的重要基礎。它把 reasoning traces 與 actions 交錯產生，讓模型能透過外部知識或環境更新自己的行動。

**對 Hermes 的啟發**：Hermes 的 agent loop、tool dispatch 與多輪工具結果回饋，可視為 ReAct 思想在實務系統中的延伸。

### GAIA: A Benchmark for General AI Assistants

GAIA 測試的是真實助理能力，包含 reasoning、multimodality、web browsing 與 tool use。論文指出，人類得分為 92%，而帶 plugins 的 GPT-4 為 15%，顯示真實助理能力遠比單純問答困難。

**對 Hermes 的啟發**：Hermes 這種有工具、瀏覽、記憶與跨 session 能力的 agent，應該用接近 GAIA 的任務來評估，而不是只看聊天品質。

### SWE-bench

SWE-bench 使用真實 GitHub issues 與 pull requests 評估模型修復軟體問題的能力。它要求模型理解 codebase、修改多個檔案、與執行環境互動。

**對 Hermes 的啟發**：要評估 Hermes 的工程能力，不能只看它會不會寫 code，而要看它能否完成可驗證、可回歸測試的修復流程。

### Small Language Models are the Future of Agentic AI

這篇論文主張，很多 agentic systems 其實只需要小模型反覆執行特定任務；小模型在成本、延遲與部署上可能更適合大量的 agent 子任務。

**對 Hermes 的啟發**：MoA 的 reference models 不一定要全部使用最貴的模型。便宜、快速、專門化的小模型，可能更適合當 advisor。

### Agentic AI: A Comprehensive Survey

這篇 survey 把 agentic systems 分成 symbolic／classical 與 neural／generative 兩條脈絡，並指出未來重點在混合式架構，而不是單一路線勝出。

**對 Hermes 的啟發**：Hermes 屬於 neural／generative agent runtime，但若要進入企業流程，仍需要更多 symbolic policy、permission、workflow state 與 audit trail。

### AI Harness Engineering

這篇 2026 年的論文把軟體工程 agent 的能力重新定義為 model-harness-environment system，不只看模型，而是看 task specification、context selection、tool access、project memory、observability、verification、permissions、intervention recording 等 runtime substrate。

**對 Hermes 的啟發**：Hermes 的真正價值不只是模型回答，而是它提供了一個 harness，讓模型能觀察、行動、記憶、驗證與被人類介入。

---

## 風險與治理：Agent 越像員工，越需要管理制度

Hermes、OpenClaw、Claude Code、OpenAI Agents SDK 這類工具越強，越不能只用「聊天機器人」的心態來管理。

一個常駐型 agent 至少會帶來五種風險：

1. **權限風險**：能讀檔、改檔、上網、寄信、呼叫 API。
2. **記憶風險**：長期記憶可能保存過多個人或公司資訊。
3. **工具風險**：MCP server、skills、plugins 可能成為攻擊面。
4. **供應鏈風險**：第三方 skills 或套件可能含惡意邏輯。
5. **錯誤放大風險**：多代理可能互相強化錯誤，形成看似合理的錯誤共識。

因此，比較務實的做法是按風險分級處理，用權限等級決定自動化程度：

<figure style="margin:1.6em auto;text-align:center;max-width:720px;">
  <img src="{{ '/assets/img/hermes-moa/risk-governance.svg' | relative_url }}" alt="Agent 風險治理分級圖：依 Agent 能力研判風險等級，低風險允許自動執行、中風險需人工審閱、高風險僅限人工核准、極高風險不自動化" style="width:100%;height:auto;border:1px solid #eef0f2;border-radius:8px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.6em;">圖三：用權限等級決定自動化程度——能力越高、越接近不可逆操作，越要保留人工把關</figcaption>
</figure>

最低治理基線：

- 只讀任務可自動化。
- 發文、寄信、改檔、刪檔、交易，必須人工確認。
- 高權限工具放進 sandbox 或 allowlist。
- 記憶系統要定期審查。
- 第三方 skills 視為不可信程式碼。
- 重要輸出保留 source map、agent logs 與人工評分。
- MoA 不等於事實查核，仍需 citation checker 與 source quality scoring。

---

## 我的結論

Hermes Agent 的價值，不在於它又多了一個聊天入口，也不在於它能同時接多少模型。它真正值得研究的地方，是它把 AI Agent 從「一次性回答工具」推向「長期運作的個人 runtime」。

MoA 則是 Hermes 中很有代表性的設計：它不是取代 agent loop，而是把多模型觀點嵌入原有的 agent loop。Reference models 提供分析，aggregator 負責輸出與工具呼叫，讓多模型協作不會摧毀原有的工具、安全與會話架構。

對個人使用者而言，Hermes ＋ MoA 最有價值的方向不是「讓 AI 全自動幫我做所有事」，而是建立幾條高品質的工作流：AI Agent 與 Web3 研究雷達、技術顧問案源偵測、Claude Code 工作流改善、研究文章生產線、LinkedIn／X 觀點內容生成與反方檢查，以及高價值決策前的多模型審稿機制。

更抽象地說，Hermes Agent 讓我們開始面對一個新問題：

> 未來的專業能力，不只是會不會問 AI，而是能不能設計一套讓 AI 穩定研究、判斷、行動、記憶與被治理的系統。

這正是 agentic engineering 的核心。

---

## 參考資料

- [Nous Research，Hermes Agent GitHub README](https://github.com/NousResearch/hermes-agent)。
- [Hermes Agent 官方文件：Mixture of Agents](https://hermes-agent.nousresearch.com/docs/user-guide/features/mixture-of-agents)。
- [Wang et al., 2024, *Mixture-of-Agents Enhances Large Language Model Capabilities*](https://arxiv.org/abs/2406.04692)。
- [Li et al., 2025, *Rethinking Mixture-of-Agents: Is Mixing Different Large Language Models Beneficial?*](https://arxiv.org/abs/2502.00674)。
- [Yao et al., 2022, *ReAct: Synergizing Reasoning and Acting in Language Models*](https://arxiv.org/abs/2210.03629)。
- [Mialon et al., 2023, *GAIA: A Benchmark for General AI Assistants*](https://arxiv.org/abs/2311.12983)。
- [Jimenez et al., 2023, *SWE-bench: Can Language Models Resolve Real-World GitHub Issues?*](https://arxiv.org/abs/2310.06770)。
- [Belcak et al., 2025, *Small Language Models are the Future of Agentic AI*](https://arxiv.org/abs/2506.02153)。
- [Zhong and Zhu, 2026, *AI Harness Engineering: A Runtime Substrate for Foundation-Model Software Agents*](https://arxiv.org/abs/2605.13357)。
