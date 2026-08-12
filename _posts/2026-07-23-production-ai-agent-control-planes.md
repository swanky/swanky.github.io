---
title: "可上線的 AI Agent，不是更會自主：從 Context、Evidence、State 到 Permission 的四層控制面"
seo_title: "AI Agent 如何安全上線？Context、Evidence、State、Permission 四層控制面"
date: 2026-07-23
published: true
categories: [technical]
tags: [ai-agent, agentic-engineering, agent-governance, production-ai]
layout: article
cover_image: /assets/img/production-ai-agent-control-planes/production-ai-agent-control-planes-banner-v2.jpg
cover_alt: "水手服少女在機房操作四組流程面板，檢查 AI 系統的規則、證據、進度與權限"
cta_context: ai-agent
related_posts:
  - ai-agent-wallet-permission-boundaries
  - matt-pocock-skills-ai-coding-workflow
  - hermes-agent-openrouter-video-generation
hero_image: true
description: "AI Agent 從 Demo 走到正式環境，難題不是模型能不能呼叫工具，而是指令能否版控、結論能否回指證據、任務能否中斷續跑，以及高風險動作是否真的受權限控制。本文以四層控制面建立可驗收的 Production Agent 架構。"
keywords: AI Agent, Production AI Agent, Agentic Engineering, Context Engineering, Evidence Layer, Agent State, Human Approval, AI Agent 治理, Completion Contract, AI Agent 導入, 史旺基, Swanky Studio
---

一個 AI Agent 在展示環境裡，通常只需要做一件事：看起來很聰明。

到了正式環境，問題完全不同。它必須在正確的指令下工作，使用可以追溯的資料，把長任務的進度留在模型之外，並且在碰到外發、覆寫、刪除、付款或部署時停得下來。

模型能不能呼叫工具，反而是比較簡單的部分。

ByteByteGo 在 2026 年 7 月發表的[〈Best Practices for Building AI Agents That Work in Production〉](https://blog.bytebytego.com/p/best-practices-for-building-ai-agents)，把 Production Agent 的工程問題整理成 Context、Control Flow、State 與 Scope。這四個面向很適合當共同基線，但若要拿來做企業導入、技術審查與上線驗收，我會再重排一次：

> **Instruction／Context、Evidence、State、Permission。**

這不是替原文換四個英文名詞。原文主要在說 Agent 如何穩定運作；我想處理的是另一個問題：**當 Agent 說它完成了，我們憑什麼相信；當它想採取行動，系統憑什麼允許。**

## 先給結論：正式環境要控制的不是模型，而是四個介面

1. **Instruction／Context：它依什麼規則工作？** Prompt、技能、工具說明與執行期脈絡必須可組合、可版控、可測試。
2. **Evidence：它依哪些事實做判斷？** 結論要能回指來源，完成狀態要附機器可檢查的證據。
3. **State：工作做到哪裡？** Run、Step、產物、錯誤、核准與 checkpoint 必須存在模型之外。
4. **Permission：它被允許做什麼？** 身分、資源範圍、風險等級與人工核准要由程式強制，不靠 Prompt 拜託模型自律。

Scope 仍然重要，但我把它視為包住四層的外框：每個 Agent 都要有單一責任、清楚停止條件，以及可交給人或其他 Agent 的交接格式。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a href="{{ '/assets/img/production-ai-agent-control-planes/four-control-planes.svg' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/img/production-ai-agent-control-planes/four-control-planes.svg' | relative_url }}" alt="Production AI Agent 四層控制面架構：Instruction 與 Context 管理可執行規則，Evidence 保存來源與驗收證據，State 保存任務與 checkpoint，Permission 控制工具、資源與人工核准；四層共同約束確定性 Orchestrator 與模型決策" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖一：四層控制面不是塞進 System Prompt 的四段文字，而是模型外部可被檢查與強制執行的系統元件；點圖可開啟原尺寸</figcaption>
</figure>

## 為什麼我要重排 ByteByteGo 的四個原則

原文的分類適合解釋 Production Agent 的設計重點；控制面分類則比較適合拿來做架構審查。兩者的關係如下：

| ByteByteGo 原則 | 本文重新落位 | 需要補上的上線問題 |
| --- | --- | --- |
| Context | Instruction／Context | Prompt 從哪個版本建置？執行期載入了哪些規則與資料？ |
| Control Flow | Permission＋確定性編排 | 哪些步驟由程式固定？哪個動作必須核准？ |
| State | State | 任務能否中斷續跑、重試、稽核與交接？ |
| Scope | 四層外部邊界 | Agent 何時該停、拒絕或轉交？ |

我另外抽出 Evidence，原因很直接：**資料曾經放進 Context，不代表輸出的主張有被資料支持；工具曾經回傳成功，也不代表任務真的完成。**

這兩個落差，正是很多 Agent Demo 一進正式環境就開始欠債的地方。

## 第一層：Instruction／Context 不是一份愈寫愈長的 Prompt

早期 Agent 常把角色、政策、工具用法、輸出格式與例外處理全部塞進一份 System Prompt。人少、流程短時還能工作；規模一大，修改一行文字的影響範圍就很難判斷。

Google Developers Blog 在 2026 年 7 月提出 modular prompt transpilation：把指令拆成可重用模組，在建置時解析 import、變數與相依關係，輸出一份可重現的執行產物。它處理的其實是很熟悉的軟體工程問題：

- 缺少的模組應在建置時失敗，不要等到執行特定任務才爆炸；
- 未定義變數與循環相依要能靜態檢查；
- 原始模組重新建置後，應能和已提交的 golden artifact 比對 drift；
- Agent 可以提出指令修改，但修改應走 Pull Request、測試與人工審查，而不是在執行中偷偷改寫自己。

因此，Instruction Layer 至少要分成兩種東西：

### 穩定控制面

身分、不可違反的安全邊界、工具契約、資料政策、輸出格式與升級規則。這些規則要有版本，變更要能 diff、review、test 與 rollback。

### 任務脈絡

這次工作真正需要的檔案、資料、使用者偏好、前一步結果與少量相關技能。它應按需載入，不是把整個知識庫倒進 Context Window。

Context Window 是容量，不是注意力保證。資訊放得進去，不代表模型會在第十八步仍然抓對版本、記得哪個例外或分清楚哪段資料已過期。

一個可以被稽核的執行紀錄，至少應回答：

```yaml
instruction_artifact: agent-policy@2026.07.23+sha256:...
loaded_skills:
  - research@3.2
  - approval-first-actions@1.4
runtime_context:
  task_id: run_...
  source_snapshot: evidence_set_...
  policy_version: policy_...
```

這只是概念結構，不是某個產品的固定 API。重點是：**日後追查結果時，必須知道模型當時到底看到了哪一套規則。**

## 第二層：Evidence 把「我覺得完成」改成「我能證明完成」

Ground Truth 檢查常被理解成「讓模型多查一次資料」。這還不夠。

Evidence Layer 要保存的是可追蹤關係：哪個主張來自哪個來源、哪個產物由哪個工具產生、哪個驗收條件由什麼檢查通過。它不能只留下模型最後整理過的摘要，因為摘要本身仍可能失真。

Anthropic 在 Claude Science 的公開案例中提到，Allen Institute 的研究者建立了多 Agent 文獻回顧流程。Sub-agent 從大量論文擷取核心主張與量化發現，存進 evidence state database；後續寫作與圖表直接從該資料庫取用，並用 actor-critic 配對，讓一個 Agent 產生內容、另一個 Agent 檢查準確性與引用忠實度。

這個案例值得注意的不是「一次讀了很多論文」，而是它把研究流程拆成：

1. 先建立結構化證據；
2. 再根據證據寫作；
3. 另外執行引用與正確性審查。

套到企業 Agent，一張最小 Evidence Card 可以包含：

```json
{
  "claim_id": "claim-017",
  "source_uri": "https://example.com/source",
  "source_snapshot": "sha256:...",
  "excerpt": "支持這個主張的原始片段",
  "retrieved_at": "2026-07-23T10:00:00+08:00",
  "verifier": "rule-or-reviewer-id",
  "status": "supported"
}
```

Evidence Layer 也要處理「完成」的證據。為每種任務定義 Completion Contract：

- 目標是什麼；
- 哪些條件全部成立才算完成；
- 每個條件需要哪種證據；
- 哪些失敗可以重試；
- 哪些情況必須停下交給人；
- 最終產物與執行收據存在哪裡。

例如「網站文章已完成」不等於 Markdown 已寫完。它可能還需要：建置成功、圖片存在、內部連結可解析、手機版無水平溢位、正常 Production Build 排除未核准草稿。缺一項，狀態就不應該是 `completed`。

## 第三層：State 不能寄生在對話紀錄裡

模型本身可以是無狀態的；工作不行。

ByteByteGo 原文主張把計畫、進度、工具結果與 checkpoint 外部化，讓任務可以恢復、重放與水平擴充。這也是長流程 Agent 是否能進正式環境的分水嶺。

對話紀錄適合讓人理解發生過什麼，卻不適合當唯一狀態來源。它通常同時混著使用者需求、模型推理、工具輸出、錯誤、重試與後來被推翻的決定。Context compaction 一發生，細節還可能被壓成摘要。

最小可用的 State 應把這些欄位拆開：

- `run_id` 與目前 `step_id`；
- 任務狀態與允許的下一個轉移；
- 指令、資料與政策版本；
- 已完成條件與待完成條件；
- 產物位置、hash 與驗證結果；
- 待核准動作與核准對象；
- 錯誤類型、重試次數與 idempotency key；
- checkpoint 與最後一次成功提交時間。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a href="{{ '/assets/img/production-ai-agent-control-planes/production-agent-runtime-loop.svg' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/img/production-ai-agent-control-planes/production-agent-runtime-loop.svg' | relative_url }}" alt="Production AI Agent 執行迴圈：載入版本化指令與狀態，模型提出動作，系統驗證證據與權限，通過後執行工具並保存收據，再依 Completion Contract 決定繼續、等待人工核准、交接或完成" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖二：模型負責提出判斷；確定性 Orchestrator 負責順序、狀態轉移、重試上限與停止條件；點圖可開啟原尺寸</figcaption>
</figure>

外部狀態帶來三個實際好處。

第一，模型或 Provider 可以更換。新模型接手的是同一份結構化 Run，不必從整段聊天猜測工作做到哪裡。

第二，失敗可以恢復。工具 timeout 時，系統能判斷工作是否其實已送出，而不是讓 Agent 一重試就重複寄信、重複付款或重複部署。

第三，責任可以交接。人類接手時不必重看一萬行 transcript，只需要目前狀態、相關證據、已做決定、阻塞原因與下一個允許動作。

## 第四層：Permission 必須由模型外部強制

Prompt 可以描述行為規範，不能充當安全邊界。

你可以在 System Prompt 寫十次「刪檔前先詢問」，但只要 Tool Gateway 仍允許模型直接刪除，這條規則就只是良好意圖。真正的 Permission Layer 必須同時知道：

- 目前是誰或哪個 Agent 在行動；
- 可以使用哪些工具；
- 可以碰哪些資源、路徑、帳號與資料分類；
- 這個動作屬於哪個風險等級；
- 是否需要核准，以及核准綁定的精確 payload；
- 動作完成後要留下什麼 receipt。

我會把常見動作分成四級：

1. **讀取與分析**：在明確資料範圍內可自動執行，仍要記錄來源與存取結果。
2. **本機可逆修改**：可以產生草稿或 patch，但要保留 diff、測試與 rollback 路徑。
3. **對外或共享寫入**：寄送、發布、建立遠端資源與修改共享資料，預設先產生 preview，再核准精確收件人與內容。
4. **不可逆或有金錢影響的動作**：刪除、付款、部署、權限變更與憑證操作，必須使用強制核准、冪等保護與事後對帳。

核准也不能只是一個模糊的 `approved: true`。比較可靠的做法，是把核准綁定到 action fingerprint：工具、目標、關鍵參數、內容 hash、成本上限與到期時間。任何欄位在核准後改變，就要重新核准，避免人批准的是 A，Agent 最後執行的卻是 B。

Hermes Agent v0.19.0 的公開 Release 把 smart approvals、Bitwarden／1Password secrets provider、live subagent transcript 與 durable delivery ledger 放進同一次版本更新。它們解決的面向不同：approval 判斷能不能做、secret provider 控制憑證怎麼取得、live transcript 提供過程可見性、durable delivery 確保完成回覆不因 Gateway crash 消失。這正好說明安全與可靠性不會由一個「更聰明的 Prompt」包辦。

我先前在[〈我讓 Hermes Agent 串上 OpenRouter 生影片〉]({% post_url 2026-07-11-hermes-agent-openrouter-video-generation %})的實作裡，也踩過這條界線。當時付費提交前有人工核准流程，但 plugin 的 `submit()` 本身沒有 approval token；若有人繞過工作流直接呼叫，API 仍會送出。那套流程適合個人受控實驗，若要變成多人服務，就必須把核准從「流程紀律」升級成「程式 hard gate」。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a href="{{ '/assets/img/production-ai-agent-control-planes/risk-approval-handoff-matrix.svg' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/img/production-ai-agent-control-planes/risk-approval-handoff-matrix.svg' | relative_url }}" alt="AI Agent 動作風險、核准與人工交接矩陣：讀取分析、本機可逆修改、對外共享寫入、不可逆或金錢動作分別對應不同自動化範圍、證據、核准與失敗處理" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖三：自主程度應跟動作風險走，不該跟模型能力或使用者對它的好感走；點圖可開啟原尺寸</figcaption>
</figure>

## Control Flow 的核心：外圈確定，內圈才交給模型

ByteByteGo 原文有一句很實用的原則：大多數 Production Agent，應該是確定性流程包住少數模型決策點。

我會把一次工具動作拆成八步：

1. 載入固定版本的 Instruction Artifact；
2. 從外部 State 取回目前步驟；
3. 只組裝這一步需要的 Context 與 Evidence；
4. 讓模型提出結構化 action proposal；
5. 用 schema、ground truth 與規則驗證 proposal；
6. 由 Permission Layer 決定執行、拒絕或等待核准；
7. Tool Gateway 執行後保存 receipt，再原子更新 State；
8. Completion Contract 判斷繼續、重試、交接或完成。

模型可以決定「下一個合理動作是什麼」，但不能自行改寫 state transition、放寬工具權限、把驗證失敗改成成功，或宣布自己已通過 Completion Contract。

這種設計看起來比「給 Agent 一個目標，讓它自己想辦法」保守。正式環境需要的正是這種保守。

ByteByteGo 用一個示意例子說明長流程的複合風險：如果二十個步驟各自都有 95% 成功率，在假設每一步相互獨立的簡化條件下，全程一次成功率只有約 35.85%。這不是任何實際 Agent 的 benchmark，而是提醒我們：**步驟愈多，checkpoint、局部重試、驗證與人工接手愈不能省。**

## Scope 與 Human Handoff 不是失敗處理，是正常路徑

Agent 的職責愈寬，評估資料就愈難準備，權限也愈難收斂。與其做一個「公司萬能助理」，不如先做一個能清楚說明輸入、輸出、工具與停止條件的窄 Agent。

Scope 至少要寫清楚：

- 接受哪些任務；
- 明確拒絕哪些任務；
- 可以讀取與修改哪些資源；
- 最長執行時間、最大成本與最大重試次數；
- 哪些訊號代表資訊不足；
- 哪些情況必須轉交人或其他專責 Agent。

一份合格的 Handoff Package 不需要很長，但要完整：

```yaml
run_id: run_...
goal: "本次工作目標"
current_state: awaiting_human_review
completed_conditions:
  - source_verified
  - draft_built
pending_conditions:
  - owner_visual_approval
artifacts:
  - uri: ...
    sha256: ...
blocked_reason: "需要內容所有者確認視覺與對外發布"
next_allowed_action: "等待核准；不可發布"
```

人類接手不代表 Agent 失敗。Agent 在該停的地方停下來，並把完整脈絡交出來，才是正式系統的成功行為。

## 一份可以拿去做 Pilot 的最小驗收表

### Instruction／Context

- Prompt、技能與工具說明是否有版本、owner 與變更紀錄？
- 是否能從原始模組重建相同的執行產物？
- 是否有靜態檢查、eval 與 rollback？
- 執行紀錄能否指出當時載入哪些版本？

### Evidence

- 關鍵主張能否回指原始來源與 snapshot？
- 工具成功是否有 receipt，而不是只保留模型轉述？
- Completion Contract 是否定義完成條件與必要證據？
- 產生者與 reviewer 是否在流程上分離？

### State

- Run／Step／Artifact／Approval 是否存在模型之外？
- 任務能否從 checkpoint 恢復，而不是重跑全部步驟？
- 寫入與付費動作是否具備 idempotency key？
- 換模型或人工接手時，是否不必重新閱讀完整對話？

### Permission

- Tool Gateway 是否有真正的 allowlist、scope 與資源邊界？
- 核准是否綁定精確 action fingerprint 與到期時間？
- 核准後 payload 改變時，系統是否強制重批？
- 每個外部副作用是否留下可對帳 receipt？

只要其中一層仍然回答「靠模型自己注意」，就還不適合把權限往上加。

## 最後判斷：Production Agent 的成熟度，看它如何被約束

模型能力會繼續上升，Agent 也會愈來愈能自己規劃、使用工具與持續工作。這些進步會提高上限，卻不會自動補上治理。

真正可上線的 Agent，不是最敢自主行動的那一個，而是出了問題時能回答這些問題的系統：

- 它當時依哪個版本的指令工作？
- 哪些證據支持這個結論？
- 工作目前停在哪個狀態？
- 誰允許它執行這個動作？
- 失敗後如何恢復、交接與追責？

如果這五題答不出來，Agent 再會說話，也只是帶工具權限的聊天機器人。

如果答得出來，模型才真正被放進一套可以運作、驗收與持續改善的工程系統。

<small>視覺說明：封面為 AI 生成的概念圖；三張技術圖為本文原創架構示意，不代表特定供應商產品。</small>

---

## 參考資料

- [ByteByteGo：Best Practices for Building AI Agents That Work in Production（2026-07-22）](https://blog.bytebytego.com/p/best-practices-for-building-ai-agents)
- [Google Developers Blog：Building scalable AI agents with modular prompt transpilation（2026-07-16）](https://developers.googleblog.com/building-scalable-ai-agents-with-modular-prompt-transpilation/)
- [Anthropic：Claude Science, an AI workbench for scientists, is now available（2026-06-30）](https://www.anthropic.com/news/claude-science-ai-workbench)
- [Nous Research：Hermes Agent v0.19.0 Release Notes（2026-07-20）](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.20)
