---
title: "「Scaffolding is coping」不是不要規範：AI Agent 架構該刪什麼、留下什麼"
seo_title: "Scaffolding is coping 是什麼？Thin Harness、SDD 與 AI Agent 架構實戰"
date: 2026-08-26
published: true
categories: [technical]
tags: [ai-agent, ai-coding, agent-harness, codex, claude-code, sdd, agent-skills, multi-agent, context-engineering, software-architecture]
layout: article
cover_image: /assets/img/linkedin/scaffolding-thin-harness-agent-architecture.jpg
cover_alt: "水手服少女從 AI 核心拆除糾纏的臨時線路，同時保留測試盾牌、核准閘門、證據筆記與乾淨執行軌道"
cta_context: agentic
related_posts:
  - production-ai-agent-control-planes
  - matt-pocock-skills-ai-coding-workflow
  - ai-agent-surgical-team
hero_image: true
description: "Tibo Sottiaux 說 Scaffolding is coping, not scaling，不代表不要規格、測試與安全邊界。本文拆解 Thin Harness、Capability Overhang、Artifact-driven Agent Workflow，以及 SDD 該如何調整。"
keywords: Scaffolding is coping, Thin Harness, AI Agent 架構, Agent Harness, Capability Overhang, SDD, Spec-Driven Development, Codex, Claude Code, Agent Skills, Multi-Agent, Context Engineering, 史旺基
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>該刪的不是規格，而是替今天模型補弱點的流程</strong>：Prompt hack、固定 Router、硬編排 Agent 數量與 Retry spaghetti，都可能在下一代模型出現後變成技術債。</li>
    <li><strong>Thin Harness 不等於 No Harness</strong>：Context、工具、Sandbox、核准、狀態與證據仍是 Agent 能可靠工作的基礎設施。</li>
    <li><strong>Memory 正在從聊天功能變成工作產物</strong>：目標、計畫、指令、結果、失敗路徑與決策理由，應留在任何 Agent 都能搜尋的 Notebook、Markdown 或 Runbook。</li>
    <li><strong>SDD 要少管路徑，多管真相</strong>：把意圖、限制、完成定義與驗證寫清楚，讓 Agent 自己決定怎麼走。</li>
    <li><strong>Agent 越多不等於生產力越高</strong>：執行頻寬變大之後，人的注意力與決策佇列反而更早撞牆。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">先拆掉最容易出現的誤讀</span>
      <ol class="article-toc-items">
        <li><a href="#headline">標題把問題推成「要不要規範 AI」</a></li>
        <li><a href="#overhang">Scaffolding 真正在反對什麼</a></li>
        <li><a href="#durable">哪些工程不但不能刪，還要加強</a></li>
        <li><a href="#thin-harness">Thin Harness 不是空殼</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">再把訪談翻成可以使用的流程</span>
      <ol class="article-toc-items">
        <li><a href="#artifact">OpenAI 自己留下了很多 Artifact</a></li>
        <li><a href="#memory">Memory 不該困在 Session 裡</a></li>
        <li><a href="#skills">Skills 跟 Strong Model 並不衝突</a></li>
        <li><a href="#attention">Multi-Agent 的瓶頸開始變成人</a></li>
        <li><a href="#sdd">SDD 要從規定步驟，轉成建立球場</a></li>
        <li><a href="#playbook">如果是我，我會這樣改流程</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 標題把問題推成「要不要規範 AI」 {#headline}

我先看到 INSIDE 那篇〈別再用一堆規範綁住 AI〉時，第一個反應是：這個標題很會吸引人點，但也很容易把工程問題推成一場錯的辯論。[[1]](https://www.inside.com.tw/article/42193-tibo-sottiaux-ai-agent-vision-timeline)

一邊變成「模型已經這麼強，規格、測試、流程都該丟掉」；另一邊則開始捍衛 `AGENTS.md`、SDD、TDD 與所有既有工程方法。兩邊吵半天，最後可能只是對「規範」兩個字的定義不同。

Tibo Sottiaux 真正反對的，不是工程本身。

他反對的是：**為了補今天模型的弱點，蓋出一座明天反而困住模型的工程迷宮。**

這個差別很重要。因為如果讀成「不要規範 AI」，最先被刪掉的往往是測試、安全與驗收；真正該被檢討的 Prompt hack、固定編排與沒人敢碰的 Workflow Graph，反而可能繼續活著。

## Scaffolding 真正在反對什麼 {#overhang}

Tibo 在 Dev Interrupted 的訪談裡談到，OpenAI 因為同時做模型與 Codex Harness，可以決定一個問題究竟要在模型訓練解，還是在 Harness 裡解。他甚至直接說：不是所有問題都要修在 Harness；有些能力，幾個月後會由新模型補上。[[2]](https://podscan.fm/podcasts/dev-interrupted/episodes/scaffolding-is-coping-not-scaling-and-other-lessons-from-codex-openais-thibault-sottiaux)

這才是「Scaffolding is coping, not scaling」的背景。

假設今天的模型只有 70 分，你替它設計一條很完整的路：

```
任務 → Router → Planner → 5 個 Sub-agent → Critic → Reviewer → Retry → Summarizer
```

每一個元件都可能有合理理由。Router 避免它走錯路，Reviewer 補它不會自我檢查，Retry 把偶發失敗磨掉，Summarizer 則是因為 Context 不夠長。

問題是，下一代模型如果從 70 分升到 95 分，這條路不一定只是「仍然有用但比較保守」。它也可能直接擋住模型原本能做得更好的方法。

Tibo 把這種情況叫做 **Capability Overhang**：模型能力已經跳升，Harness 卻仍假設它只有舊能力，所以新的推理、規劃與工具使用方式無法表達出來。[[2]](https://podscan.fm/podcasts/dev-interrupted/episodes/scaffolding-is-coping-not-scaling-and-other-lessons-from-codex-openais-thibault-sottiaux)

說穿了，你辛苦蓋的 Agent Architecture，可能不是系統的外骨骼，而是一件小兩號的盔甲。

<figure>
  <a href="{{ '/assets/img/technical/scaffolding-thin-harness-agent-architecture/scaffolding-decay-matrix.svg' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/img/technical/scaffolding-thin-harness-agent-architecture/scaffolding-decay-matrix.svg' | relative_url }}" alt="AI Agent 架構折舊矩陣：Prompt hack、固定 Router、人工 Context 壓縮與 Retry spaghetti 容易隨模型進步折舊；規格、測試、權限、版本與決策紀錄則會繼續放大更強模型的能力" loading="lazy">
  </a>
  <figcaption>真正要問的不是「要不要工程」，而是模型升級後，這項工程會放大能力，還是繼續把模型鎖在舊假設裡。點圖可開啟原尺寸。</figcaption>
</figure>

## 哪些工程不但不能刪，還要加強 {#durable}

這也是整個討論最容易被偷換概念的地方。

`AGENTS.md` 並沒有突然變成落後做法。Codex 官方文件現在仍明確寫著，它會在開始工作前讀取 `AGENTS.md`，並依全域、Repository 與目錄層級組合指引。[[9]](https://learn.chatgpt.com/docs/agent-configuration/agents-md)

但一份好的 `AGENTS.md`，應該告訴 Agent 專案的客觀事實與邊界：

- 測試怎麼跑。
- 哪些資料不能碰。
- 架構有哪些不可破壞的限制。
- 專案使用什麼語言、版本與慣例。
- 哪些動作需要人工核准。
- 完成時要留下什麼證據。

它不需要替模型寫一篇「你現在要如何思考」的長篇劇本。

我會把 Agent 外部的工程分成兩類：

| 類型 | 例子 | 我的處理方式 |
|---|---|---|
| **定義真相與責任** | Spec、Acceptance Criteria、Tests、Evals、Security、Permission、Observability、Git、CI | 保留，而且做成可執行、可查核的系統邊界 |
| **補償模型暫時弱點** | 特殊 Prompt、固定 Agent 數量、硬寫死的 Graph、人工 Context 搬運、過度 Retry | 設有效期限；模型升級就重新做最小 Harness 測試 |

安全邊界更不會因模型變聰明而消失。

一個更聰明、工具更多、執行更快的 Agent，如果沒有 Sandbox、權限範圍與不可逆動作核准，通常不是比較自由，而是比較快出事。模型能力與安全控制不是同一條軸，不能拿前者去抵銷後者。

## Thin Harness 不是空殼 {#thin-harness}

OpenAI 在 8 月 19 日公開 Codex 的 Open Agent Harness 時，把 Harness 定義得很具體：它要維持對話狀態、管理 Context、呼叫工具、處理失敗、套用 Sandbox 與 Approval Policy，還要讓工作跨 Turn 延續。[[7]](https://developers.openai.com/blog/codex-as-a-platform)

官方同時公布一項自家測試：在 ARC-AGI-3 上，retained reasoning 加上 Context Compaction，讓 GPT-5.6 Sol 從 13.3% 提升到 38.3%，而 Output Token 降為原本的六分之一。這是 OpenAI 自己的 Benchmark 結果，不該被當成所有任務都會複製的獨立量測；但它至少說明一件事：**Harness 的設計仍然可以大幅改變模型表現。**[[7]](https://developers.openai.com/blog/codex-as-a-platform)

所以「Strong Model + Thin Harness」裡的 Thin，指的是：

- 少一點針對舊模型寫死的偏見。
- 少一點不必要的固定路由與角色扮演。
- 少一點把流程複雜度誤認成系統成熟度。

它不是：

- 不管理 Context。
- 不限制工具與資料。
- 不保存 State。
- 不做 Approval。
- 不留 Evidence。

<figure>
  <a href="{{ '/assets/img/technical/scaffolding-thin-harness-agent-architecture/thin-harness-stack.svg' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/img/technical/scaffolding-thin-harness-agent-architecture/thin-harness-stack.svg' | relative_url }}" alt="薄 Harness 三層架構：應用層提供真實工作介面、業務脈絡、工具與權限；Harness 管理狀態、Context、工具迴圈、Sandbox、核准、失敗與證據；模型理解任務並自己決定路徑" loading="lazy">
  </a>
  <figcaption>Thin Harness 是減少脆弱假設，不是拿掉測試、安全、核准與稽核。點圖可開啟原尺寸。</figcaption>
</figure>

## OpenAI 自己留下了很多 Artifact {#artifact}

如果只看「Scaffolding is coping」這句話，很容易以為 OpenAI 的理想工作流是把 Prompt 丟給 Codex，然後雙手離開鍵盤。

但 OpenAI 在 8 月 25 日公開的內部案例，實際上完全不是這樣。

一位 OpenAI 工程師用 Codex 與 Runme Notebook 處理重複的模型評估工作。流程是：

1. 先寫一個短而持久的 Goal。
2. 要 Codex 參考上一次執行，提出詳細 Plan。
3. 在開始前等待人類審查與核准。
4. 執行時記下 Command、Output 與判讀。
5. 把死路、取捨與「下次要怎麼做」一起留在 Notebook。
6. 產生可被搜尋的 Markdown Index，讓後續 Agent 找得到先前經驗。[[6]](https://developers.openai.com/blog/automating-repetitive-work-at-openai-with-codex)

這套流程不薄嗎？

其實很薄。因為它沒有替每一種評估另外寫一個硬編排自動化，也沒有先規定一定要叫幾個 Agent、用哪個模型思考、失敗三次後換哪條 Graph。

它把耐久的東西留下：Goal、Plan Approval、Evidence、Decision Record 與可搜尋歷史。執行路徑則讓 Codex 依當次狀況決定。

我把這種模式稱為 **Artifact-driven Agent Workflow**。這是我的整理名稱，不是 OpenAI 宣布的新產品名。

## Memory 不該困在 Session 裡 {#memory}

OpenAI 那篇文章裡，我覺得最值得注意的不是 Notebook 本身，而是這句設計：把意圖、動作、決策與結果放進同一個 Artifact。[[6]](https://developers.openai.com/blog/automating-repetitive-work-at-openai-with-codex)

這會把 Agent Memory 從「它好像還記得我」改成比較工程化的問題：

- 上次實際跑了什麼？
- 哪條路失敗？
- 為什麼最後選 A？
- 哪個結果有 Test 或 Evidence？
- 下次 Agent 要去哪裡搜尋？

聊天記憶適合保留偏好、語氣與長期背景。但只要是會影響工作結果的知識，我不建議只放在 Claude Code、Codex 或 Hermes 的某一段 Session 裡。

因為 Session 很容易壓縮、結束、換模型、換工具，甚至只剩一句看起來很完整、實際上已經漏掉關鍵失敗路徑的摘要。

真正 model-agnostic 的 Memory，通常很樸素：Repository 裡的 Markdown、版本化 Spec、測試輸出、Runbook、Notebook、決策紀錄與系統產生的收據。它們不性感，但下一個 Agent 可以讀，下一個人也可以查。

<figure>
  <a href="{{ '/assets/img/technical/scaffolding-thin-harness-agent-architecture/artifact-driven-agent-loop.svg' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/img/technical/scaffolding-thin-harness-agent-architecture/artifact-driven-agent-loop.svg' | relative_url }}" alt="Artifact-driven Agent 工作循環：從持久 Goal 與 Spec 產生 Agent Plan，只在高影響決策卡人工核准，執行後保存測試證據、決策紀錄與可搜尋 Artifact，再供下一次執行重用" loading="lazy">
  </a>
  <figcaption>Memory 不只是在聊天視窗裡「記得你」。工作型 Memory 要能被搜尋、驗證、比較與重跑。點圖可開啟原尺寸。</figcaption>
</figure>

## Skills 跟 Strong Model 並不衝突 {#skills}

Tibo 在 Matthew Berman 的新訪談裡談到，熟練的 Coding Agent 使用者現在還得自己管理 Skill Files、Memory、Sub-agent 與一小群 Agent Network；每當這些機制失靈，使用者面前那個「懂你的完整夥伴」幻覺就會破掉。他理想中的產品，不該讓人一直處理這些 Implementation Detail。[[8]](https://www.youtube.com/watch?v=4qjEgPojjzM)

這不代表 Skill、Memory 與 Sub-agent 在技術上會消失。

比較可能的情況是：**它們會從使用者要手動管理的 UI 概念，退到 Agent 自己使用的底層能力。**

Anthropic 現在的 Agent Skills 正好可以用來理解這件事。它採取 Progressive Disclosure：平常只載入名稱與描述；符合需求時才讀 `SKILL.md`；Reference 與 Script 則在真正需要時再取用。[[5]](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

這跟「把全部規則塞進 System Prompt」不是同一件事。

前者提供一組可以被 Agent 自己發現、組合與執行的 Primitive；後者則先把模型的注意力塞滿，再希望它一字不漏地照劇本演出。

所以我不會把 OpenAI 與 Anthropic 簡化成互相衝突的兩派。比較準確的說法是：

- **OpenAI：Strong Model + Thin Harness。**
- **Anthropic：Strong Model + Composable Skills。**

最後兩邊很可能在同一個方向會合：底層能力仍然存在，但人只需要說清楚要什麼、不能破壞什麼，以及怎麼證明完成。

## Multi-Agent 的瓶頸開始變成人 {#attention}

INSIDE 把 Tibo 過去談過的方向整理成「Single Agent → Multi-Agent Network」。這個判斷放在後端架構上未必錯，但新訪談又補了一個很有意思的修正。

Matthew Berman 說，他現在因為 Agent 慢，會同時開 10 到 15 個；如果 Ultra Fast 模型把回應大幅加快，也許反而只需要同時處理 3 到 4 個。這兩個數字是主持人描述自己的工作流，不是 Tibo 提出的通用最佳實踐。Tibo 回應的重點，是產品必須尊重人的注意力與 Context Switching 成本。[[8]](https://www.youtube.com/watch?v=4qjEgPojjzM)

這跟我前面寫的 [AI Agent 外科手術團隊]({% post_url 2026-08-24-ai-agent-surgical-team %})其實是同一個瓶頸：執行頻寬可以突然放大，人的決策頻寬不會同比例成長。

十幾隻 Agent 在 Terminal 裡同時跑，看起來很像未來。等它們一起回來、每隻都附一份很有自信的報告時，未來就會變成你的 Review Queue。

所以我不會把「Agent 越多」當成成熟度指標。

我更看好的是：一個更強、更快、更懂脈絡的 Agent，在底下自己決定要不要平行探索、叫多少 Worker、何時合併結果。使用者看到的是一個責任邊界；平行化是 Implementation Detail。

Tibo 同一場訪談也說，ChatGPT 與 Codex 的合併方向來自同一個想法：底層是相同的技術與 Harness，介面再依個人的工作調整。[[8]](https://www.youtube.com/watch?v=4qjEgPojjzM)

這表示 Coding Agent 可能不是一個永遠獨立的物種。更像是 General Agent 第一個被攻破、又最容易用 Test 與 Git 驗證的高價值工作領域。

## SDD 要從規定步驟，轉成建立球場 {#sdd}

這些訊號放回 SDD 或 OpenSpec，我的結論不是「規格已經過時」。

剛好相反。

模型越能自己規劃，Spec 越不需要教它每一步怎麼想，卻越需要把以下事情說清楚：

- **Intent**：到底要解決誰的什麼問題。
- **Constraints**：架構、相容性、資料與商業邊界。
- **Non-goals**：這次刻意不碰什麼。
- **Acceptance Criteria**：什麼叫完成。
- **Tests / Evals**：哪些結果可以機械驗證。
- **Evidence**：完成時要留下什麼收據。
- **Approval Gates**：哪些高影響決策與不可逆動作必須等人。

以前常見的 Spec，實際上混進了大量 Orchestration：

> Step 1 先讀 A，Step 2 呼叫 Agent B，Step 3 用模型 C，Step 4 寫 `plan.md`，Step 5 叫 Reviewer，Step 6 不及格 Retry 三次。

比較未來型的 Spec 會像這樣：

> 需求、限制與完成定義在這裡。你可以自己決定調查與實作路徑；但不能越過安全邊界，所有 Acceptance Criteria 都要有可重現 Evidence，高影響變更要在 Decision Gate 等待核准。

差別不是從「有規格」變成「沒規格」。

差別是從 **Procedure Contract**，逐漸轉成 **Outcome + Boundary + Evidence Contract**。

規格不是 AI 的籠子，而是球場的邊界線。

球員越強，你越不需要告訴他每一步腳要踩哪裡；但界外、犯規、得分與終場規則，反而要定義得更清楚。

## 我對幾個預測的可信度 {#forecast}

| 預測 | 我的判斷 | 理由 |
|---|---|---|
| Prompt hack、手刻 Routing 會大量折舊 | ★★★★☆ | 模型與原生 Harness 正在吃掉短期補丁，但特殊環境仍會保留少量定制 |
| Skills、Memory、Sub-agent 會消失 | ★★★☆☆ | 技術元件不會消失，手動管理它們的產品體驗會逐漸退到背景 |
| 現在的 Codex 幾個月後看起來很原始 | ★★★☆☆ | 方向可信，時間表要對產品負責人的樂觀保留折扣 |
| Multi-Agent 會成為下一個主要 UI | ★★☆☆☆ | 後端動態平行化很可能增加，前端讓人管理 20 隻 Agent 未必是終局 |
| Artifact-driven Workflow 會更重要 | ★★★★☆ | 它不依賴單一模型或 Session，能直接累積組織可查核的工作知識 |

這裡的星等是我的判斷，不是來源提供的評分。

## 如果是我，我會這樣改流程 {#playbook}

如果團隊現在已經在用 Claude Code、Codex、Hermes 或其他 Agent，我不會急著重做一套新架構。我會先做六件事：

1. **替每一層 Scaffolding 標註原因與有效期限**：它在補哪個模型弱點？模型升級後用最小案例重測，沒必要就刪。
2. **把規格改成 Intent、Constraints、Acceptance Criteria 與 Evidence**：少寫固定思考步驟，多寫不可破壞的真相。
3. **把 Human-in-the-loop 移到決策點**：Plan、架構取捨、外部寫入、付費與不可逆動作才卡人工；探索與可逆修正讓 Agent 自己跑。
4. **把執行紀錄做成第一級產物**：Command、測試結果、失敗路徑與決策理由寫進 Notebook、Markdown 或 Runbook，不只留聊天摘要。
5. **不要把 Agent 數量當 KPI**：先量人的 Review Queue、返工與 Decision Latency；注意力爆掉時先合併責任，不是再加一隻 Reviewer Agent。
6. **每次換模型都跑 Harness Ablation**：從最簡流程開始，一層一層加回 Router、Skill、Memory、Reviewer；只有能穩定改善真實任務結果的層才留下。

最後一點很重要。

很多 Agent Architecture 的問題，不是它完全沒用，而是從來沒有人測過：**拿掉之後是不是反而更好。**

我以前寫過 [Production AI Agent 的四層控制面]({% post_url 2026-07-23-production-ai-agent-control-planes %})，強調 Instruction、Evidence、State 與 Permission。現在回頭看，我仍然會保留那四層；但會更小心，不把「控制面」寫成模型必須逐字照演的思考劇本。

控制面應該管理邊界、狀態與收據。模型則負責在邊界裡找到路。

## 不要投資在教今天的 AI 每一步怎麼走 {#ending}

把這幾篇訪談與 OpenAI 新公開的工作流放在一起，我最後帶走的不是「不要 Scaffolding」這句漂亮口號。

而是：

> **不要投資在教今天的 AI 每一步怎麼工作；要投資在讓明天更聰明的 AI 知道什麼是對的。**

長期有價值的，仍然是 Specification、Architecture、Domain Knowledge、Tests、Evals、Security、Observability、Data，以及可以被下一次工作重用的 Artifact。

至於 Prompt 技巧、固定 Agent 組織圖、Context 搬運與 Routing 花招，我不會說它們今天全部沒用。但我會開始把它們當消耗品，而不是地基。

地基應該讓更強的東西長上去，不是讓它永遠維持我們第一次搭鷹架時的形狀。

---

## 參考資料

- **[1]** [INSIDE：別再用一堆規範綁住 AI！OpenAI 產品負責人 Tibo 談 Agent 願景與時間線](https://www.inside.com.tw/article/42193-tibo-sottiaux-ai-agent-vision-timeline)
- **[2]** [Dev Interrupted：Scaffolding is coping, not scaling](https://podscan.fm/podcasts/dev-interrupted/episodes/scaffolding-is-coping-not-scaling-and-other-lessons-from-codex-openais-thibault-sottiaux)
- **[5]** [Anthropic：Agent Skills Overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- **[6]** [OpenAI：Automating repetitive work at OpenAI with Codex](https://developers.openai.com/blog/automating-repetitive-work-at-openai-with-codex)
- **[7]** [OpenAI：Codex as a platform](https://developers.openai.com/blog/codex-as-a-platform)
- **[8]** [Matthew Berman：How to Understand the Next Wave of AI Before Everyone Else｜Tibo Interview](https://www.youtube.com/watch?v=4qjEgPojjzM)
- **[9]** [OpenAI Codex：Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
