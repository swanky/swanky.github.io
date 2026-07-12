---
title: "別再問哪個 AI Coding 工具最好：2026 年選型的九層決策框架"
seo_title: "AI Coding 工具怎麼選？2026 年 Claude Code、Codex、Cursor、Copilot、OpenCode、Hermes 與 Grok Build 深度比較"
date: 2026-07-12
categories: [technical]
tags: [claude-code, ai-coding, agentic-engineering, hermes-agent]
layout: article
cover_image: /assets/img/ai-coding-selection-2026/ai-coding-tool-selection-2026.jpg
hero_image: true
description: "AI Coding 選型已不是模型排行榜。本文用九層框架比較 Claude Code、Codex、Grok Build、Hermes Agent、Cursor、OpenCode 與 GitHub Copilot，拆解專案知識、OpenRouter、企業治理、CP 值與 30 天 pilot 方法。"
keywords: AI Coding 工具選擇, Claude Code, Codex, Grok Build, Hermes Agent, Cursor, OpenCode, GitHub Copilot, OpenRouter, AGENTS.md, AI Agent, agentic engineering, 企業 AI 導入, AI Coding ROI, 史旺基, Swanky Studio
---

我最近整理自己的 AI Coding 工具時，發現桌面上已經不是「選一套 IDE」那麼簡單。

Claude Code、Codex、Cursor、OpenCode、Hermes Agent，各自有自己的設定檔、skills、模型、provider、權限與帳單。再加上 OpenRouter、本機模型、MCP 和 cloud agent，整件事很快就從工具選擇變成一個小型分散式系統。

這裡面最荒謬的地方是，市場還是很喜歡問：「哪一個最好？」

這個問題在 2026 年已經不太有用了。**真正的選擇單位不是單一模型，也不是單一 CLI，而是一整套能把需求安全地變成可接受變更的工作系統。**

> 本文資料整理至 2026 年 7 月 12 日。這個市場以週為單位變動，價格、方案額度、模型名稱與指令，採購或部署當天仍應回官方頁面核對。

## 先給結論：工具不需要唯一，但責任必須唯一

如果只想先記住幾件事，我的答案是這七條：

1. **LLM 決定能力上限，harness 決定能力能不能穩定變成可接受的修改，組織流程決定它能不能安全上線。**
2. **多工具並用已是常態。**但保留選擇權，不等於讓每個人把所有工具、模型和 MCP 都接進公司環境。
3. **終端主力先比較 Claude Code 與 Codex；IDE-first 團隊先比較 Cursor 與 GitHub Copilot。**
4. **專案共通知識以 `AGENTS.md` 為核心。**Claude Code 再用薄 `CLAUDE.md` 匯入；不要幻想所有設定檔、skills、hooks 與權限都能零修改共用。
5. **開源 harness 不等於資料留在本機。**OpenCode、Hermes 接上雲端 provider，程式碼和 prompt 一樣會離開裝置。
6. **OpenRouter 提供模型與 provider 選擇，不會自動送你一張合規證書。**資料政策、ZDR、allowlist、region、參數支援與預算都要自己設。
7. **CP 值用「每個被接受的任務」算。**月費和每百萬 token 價格，只是成本最容易被看到的那一小塊。

我給個人技術顧問的實用組合是：**Claude Code 或 Codex 擇一為主力，另一個作不同模型家族的 reviewer；OpenCode 當 model lab；Hermes 負責非機密研究、排程與跨工具編排；OpenRouter 只承接完成資料分級的工作。**

企業則不要先選冠軍。從 Claude Code、Codex、GitHub Copilot、Cursor 中挑兩個進 pilot，用同一批真實 ticket、同一套測試與品質門檻比較。

## 模型只是九層裡的一層

很多人已經知道要分開看 LLM 與 agent harness。這比只看 benchmark 好，但還不夠。

對企業導入或長期個人工作流，我會把 AI Coding 系統拆成九層：

<figure style="margin:1.8em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/ai-coding-selection-2026/nine-layer-framework.svg' | relative_url }}" alt="AI Coding 選型九層決策框架：業務目標、操作介面、Agent harness、LLM、推論供應商、Gateway、專案知識、執行治理、評估營運" style="width:100%;height:auto;border-radius:12px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.6em;">圖一：模型只是其中一層，任何一層接近零，benchmark 再高都救不了導入</figcaption>
</figure>

| 層次 | 真正要問的問題 | 常見選項或產物 |
| --- | --- | --- |
| 業務目標與任務 | 想縮短什麼時間、降低什麼風險？ | 探索、重構、migration、測試、review、incident |
| 操作介面 | 人在哪裡和 agent 協作？ | IDE、CLI、Desktop、Web、Cloud Agent、CI |
| Agent harness | 模型怎麼搜尋、規劃、編輯、驗證與回復？ | tool loop、plan、patch、compaction、subagent、worktree |
| LLM | 需要什麼能力、上下文與延遲？ | coding、reasoning、tool use、vision、structured output |
| 推論供應商 | 同一模型由誰部署？能力和政策是否一致？ | 官方 API、OpenRouter provider、Bedrock、Vertex、on-prem |
| Gateway／Router | 如何管 key、fallback、成本與資料政策？ | OpenRouter、LiteLLM、企業 AI Gateway、內部 proxy |
| 專案知識與協定 | Agent 如何取得正確而可維護的脈絡？ | `AGENTS.md`、rules、skills、MCP、ADR、spec |
| 執行與治理 | Agent 可以在哪裡做什麼？誰能稽核？ | sandbox、network、secrets、SSO、RBAC、audit |
| 評估與營運 | 如何證明值得？升級失敗怎麼回復？ | internal eval、版本 pinning、觀測、回滾、成本 |

我會把成果寫成一個很不科學、但很實用的乘法：

> **成果 = 模型能力 × harness 轉換效率 × 專案脈絡品質 × 驗證與組織能力。**

乘法的麻煩是，只要一項接近零，其他項目堆再高都沒用。

同一個模型放進不同 harness，搜尋範圍、patch 方法、工具 parser、context compaction、測試 loop 都可能改變結果。同一個 model slug 交給不同 provider，也可能遇到量化、chat template、實際 context、cache、延遲或參數支援差異。

所以「它支援 OpenAI-compatible API」只代表門插得進去，不代表電壓一定對。

## 採用很快，信任沒有同步上升

2026 年 Pragmatic Engineer 針對 906 位受訪者的調查顯示，樣本雖偏資深、偏歐美科技公司，但很能反映重度採用者的行為：95% 每週使用 AI 工具，70% 同時使用 2～4 種，另有 15% 使用五種以上。在 regular agent users 中，Claude Code 的使用率為 71%，GitHub Copilot 46%，Cursor 39%。

這不能被解讀成全球市占。比較合理的解讀是：**資深、重度 agent 使用者對 Claude Code 的口碑很強；到了大型企業，GitHub 身分、採購、政策與支援會改變答案。**工程師最喜歡的工具，和企業最容易買的工具，從來就不是同一件事。

另一邊，Stack Overflow 2025 調查裡，46% 受訪者不信任 AI 準確性，信任者只有 33%；66% 的主要挫折是結果「幾乎正確，但還差一點」，45.2% 認為替 AI 產生的 code 除錯更花時間。

這幾個數字放在一起看，結論其實不浪漫：**AI 很容易提高個人的產出感受，卻不會自動提高團隊共同理解、review 品質與維護責任。**

METR 在 2025 年曾觀察到熟悉自己開源 repository 的資深開發者使用 AI 反而慢 19%。但 METR 已在 2026 年明確說明，這個結果不應再被當成現在的定論；後續資料方向轉正，卻受到參與者與任務選擇偏差影響，仍不足以精確估算加速幅度。

DORA 的說法比較接近我自己的經驗：AI 是放大器。流程清楚、測試快、文件可用、feedback loop 短，它會放大優勢；需求模糊、變更批次過大、review 已經塞車，它也會把問題一起放大。

## 七款工具，我會怎麼定位

下面這張表不是排名，而是先用來排除明顯不合適的選項。

| 工具 | 最適合 | 模型自由度 | 一句判斷 |
| --- | --- | --- | --- |
| Claude Code | 終端深度 coding、複雜重構 | 低：Claude-native | 生態成熟；主要綁定模型家族與 Claude 工作流 |
| Codex | OpenAI 生態、CLI／Desktop／cloud task | 中高 | 本機比想像開放；雲端能力仍綁 ChatGPT workspace |
| Grok Build | 新 harness、平行工作流試驗 | 中 | 適合非關鍵 repo pilot；Beta 版本風險仍高 |
| Hermes Agent | 個人排程、記憶、跨工具編排 | 很高 | 是 agent operating layer，不是 coding CLI 的一對一替代品 |
| Cursor | IDE-first、Tab、視覺 review | 高 | UX 完整；平台綁定與重度 agent 成本要實測 |
| OpenCode | OpenRouter／local、多 provider | 很高 | 很好的 model lab；治理與維運責任在使用方 |
| GitHub Copilot | GitHub Enterprise、大規模分發 | 高 | 企業控制面成熟；各 agent surface 仍要分開核對 |

### Claude Code：成熟，但不是中立 harness

Claude Code 的優勢不只是 Claude 模型，而是 `CLAUDE.md`、path-scoped rules、skills、subagents、hooks、MCP、permissions、plan、rewind 與 review 組成的工作方式。對陌生錯誤、跨檔案重構與需要反覆驗證的任務，它仍是我會先測的終端工具。

它的邊界也很清楚。官方 gateway 支援改變 Claude 的上游與企業網路路徑，但不是讓 Claude Code 改跑非 Claude 模型。這是模型 lock-in，沒有必要假裝不是。

### Codex：OpenAI-native，但本機沒有想像中封閉

Codex 橫跨 CLI、Desktop／IDE 與 cloud task，支援 `AGENTS.md`、skills、MCP、sandbox、review、plan 與 managed configuration。它特別適合已在 ChatGPT Business／Enterprise 的組織，也適合拿來當 Claude Code 之外的第二模型家族。

常見誤解是 Codex 只能跑 OpenAI。實際上，本機 Codex 可設定 OpenAI-compatible provider，也可用 `--oss` 連 Ollama 或 LM Studio。但這只證明 harness 能換 provider，不代表 reasoning、tool use、cache 或 cloud features 都和第一方路徑一樣。

### Grok Build：值得測，但 Beta 就是 Beta

Grok Build 已有 project rules、skills、plugins、MCP、plan、tasks、queue、loop 與 headless scripting，也支援自訂 provider。現行官方頁面可免費試用，不應再沿用早期「一定要 Premium+」的資訊。

問題不是功能表太短，而是版本仍快速變動。企業可以從 read-only reviewer、隔離環境或非關鍵 repository 開始；不要因為免費，就順手把 production 權限也送出去。免費和便宜是財務形容詞，不是風險分類。

### Hermes Agent：負責編排，不搶每一個 coding 任務

Hermes 的差異在持久記憶、cron、訊息通道、background work、skills、fallback、OpenRouter 與跨工具委派。它適合回答「何時做、要做什麼、結果送去哪裡」，再把單一 repository 的深度 coding 交給 Claude Code、Codex 或 OpenCode。

Hermes 是 MIT 開源，但只要接雲端 LLM、web search、browser 或遠端 MCP，相關資料仍會送往供應商。對個人顧問，我會用它處理非機密研究、排程、內容與多模型實驗；公司機密 code 則留在企業核准的 inference、sandbox、secrets 與 audit 邊界內。

### Cursor 與 Copilot：一個偏體驗，一個偏控制面

Cursor 把 Tab、Agent、rules、review、cloud agents 與團隊管理放進同一個 IDE。對不想先學 CLI agent 心智模型的團隊，摩擦確實比較低。但 daily agent 的 overage、平台費與模型用量要一起算。

GitHub Copilot 的優勢則是身分、repository、policy、IDE 分發、audit 與採購在同一控制面。這也是它在大型企業有優勢的原因。只是 CLI、IDE local agent、cloud agent、custom agent 與 MCP registry 的治理範圍仍要逐一核對，不能因為 logo 一樣，就當成政策一定相同。

### OpenCode：很好的 model lab，不是自動合規機

OpenCode 支援大量 providers、local model、`AGENTS.md`、agents、MCP 與 TUI／CLI。對個人實驗不同模型、OpenRouter 或內部 gateway，很有價值。

但 `/share`、provider retention、tool parser、Windows 維運、版本回歸與中央 audit 都要自己處理。開源讓你看得到和改得到；它沒有順便幫你聘一個資安團隊。

## 個人和企業，不該共用同一張排行榜

個人重度使用者通常先看：既有訂閱能不能用、互動順不順、能不能按任務切模型、花費是否可見、Windows 是否穩定、設定能不能備份，以及不同資料能不能清楚分流。

我會這樣分工：

| 角色 | 建議選項 | 理由 |
| --- | --- | --- |
| 主力深度 coding | Claude Code 或 Codex | 第一方模型整合、sandbox、review 與 agent loop 較成熟 |
| 第二意見 | 與主力不同家族的 Codex 或 Claude Code | 降低同一模型的系統性盲點 |
| IDE／autocomplete | Cursor 或 Copilot | 日常補全與視覺協作摩擦低 |
| Model lab | OpenCode ＋ OpenRouter | 方便比較 provider、模型與角色分工 |
| 排程／跨工具編排 | Hermes | 記憶、cron、channels、fallback；限核准資料 |
| Git-native 精準補丁 | Aider | 輕量、diff 透明、平台綁定低 |

企業則多了一整排不能用 prompt 代替的硬條件：SAML／OIDC、SCIM、RBAC、離職撤權、model allowlist、MCP registry、network egress、secrets、資料保留、audit、預算、自動停用、版本 pinning、support 與 rollback。

三個名詞尤其不要混在一起：

- **不拿內容訓練模型**：不代表不記錄，也不代表零保留。
- **Zero Data Retention**：通常只描述推論端，不會自動涵蓋 web、plugin、MCP 與 metadata。
- **Data／Inference Residency**：資料儲存與 GPU 推論在哪裡；登入、帳務、connector 和 metadata 可能是另一套範圍。

Restricted data 的答案，很多時候不是挑一個自稱更隱私的 SaaS，而是**不要送出**。

## 企業選型先淘汰，再評分

我不建議一開始就做「Claude 9.5 分、Codex 9.3 分」這種看起來精確的表格。先設 knockout gates，比較誠實。

<figure style="margin:1.8em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/ai-coding-selection-2026/selection-funnel.svg' | relative_url }}" alt="企業 AI Coding 選型漏斗：先用資料、身分、權限、稽核與平台條件淘汰，再以相同真實任務 pilot 比較 accepted-task economics，最後形成核准組合與退出方案" style="width:100%;height:auto;border:1px solid #e2e8f0;border-radius:12px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.6em;">圖二：企業要先問「能不能安全使用」，再問「工程師喜不喜歡」</figcaption>
</figure>

以下任一項不合格，就先不要進加權評分：

- 資料類別與 inference endpoint 不符；
- 無法強制 SSO、撤權、model 或 MCP policy；
- sandbox、network 或 secrets 邊界不符合風險等級；
- 無法取得必要 audit、DPA 或 retention 承諾；
- 不能在目標 OS、repository 與 CI 穩定工作；
- 供應商生命週期、support 或退出條件不可接受。

通過後，再比較真實任務品質、修正時間、安全治理、TCO、穩定性、可攜性與開發體驗。權重依組織風險改，不要先愛上一個工具，再把試算表調成它會贏的樣子。

## `AGENTS.md` 可以共用，但安全邊界不能寫在 Markdown 裡

跨工具時，先分清楚四種東西：

| 類型 | 功能 | 能不能當安全控制 |
| --- | --- | --- |
| Context／instructions | 告訴 agent 架構、指令、慣例與禁區 | 不能。模型可能忽略或誤解 |
| Skills／commands | 封裝可重複 workflow、prompt 與 script | 不能單獨當控制；script 仍需審查 |
| MCP／tools | 提供外部系統、資料或動作 | 需搭配 allowlist、憑證與 tool-level permission |
| Policy／sandbox／hooks | 強制檔案、網路、命令與核准邊界 | 才是 enforcement，而且要驗證是否為 OS-level |

`AGENTS.md` 寫「不要碰 production」不是安全措施。真正的安全措施是 production credential 根本不在環境裡，network policy 擋得住，危險命令需要核准，CI 和 review 不讓未驗證變更進主線。

對多工具 repository，我建議：

```text
repo/
├── AGENTS.md                    # 共用事實、build/test、架構與禁區
├── CLAUDE.md                    # @AGENTS.md + 少量 Claude-only 說明
├── docs/ai/
│   ├── data-classification.md   # 哪些資料可送哪種 endpoint
│   ├── mcp-catalog.md           # 核准 server、owner、資料與權限
│   └── eval-tasks.md            # 內部評測任務與通過標準
├── .agents/skills/              # 可攜 workflow 的候選正本
├── .claude/                     # Claude rules、skills、settings
├── .codex/config.toml
├── .cursor/rules/
├── .opencode/
└── .github/copilot-instructions.md
```

共用事實只寫一份。工具專屬檔案只補能力差異和 override。Windows 環境不要為了看起來優雅就硬上 symlink；薄匯入檔通常比較不會在 zip、CI 或不同 Git 設定裡突然表演消失。

`SKILL.md` 和 MCP 也是同理。可攜的是內容設計與 server contract，不是每個 client 的 discovery path、frontmatter、credential storage、approval 與 allowlist。每次工具升級，都要跑 smoke test 確認規則真的有載入、權限真的有擋住。

## OpenRouter 與本機模型：自由度不是免費午餐

OpenRouter 的價值很明確：一組 API 與帳務使用多模型、選 provider、做 fallback、記 usage、設預算，並依 latency、價格或資料政策挑 endpoint。拿來搭 Hermes、OpenCode、Cline、Aider 或內部評測，很方便。

它不會自動解決：

- harness 對特定模型的 prompt 與工具最佳化；
- provider 的 tool parser、structured output、context 與 cache 差異；
- 企業 SSO、SCIM、repository policy、OS sandbox 或 code provenance；
- web、plugin、MCP 等推論以外的資料流；
- 已經輸出部分 token 後的無痕 failover。

最低限度，我會 pin 明確 model／version，設定 provider allowlist、region、`data_collection: deny`、必要時使用 ZDR、開啟 `require_parameters: true`，並對 user、team、project 設預算和 rate limit。免費 endpoint 只用於公開資料、學習或低風險 PoC。

本機模型則適合 air-gap、固定版本、穩定工作量、敏感資料預處理，或已經證明小模型能過內部門檻的情境。但本機不等於免費。GPU 折舊、電力、量化損失、KV cache、serving、監控、併發與 on-call 工時都是真實成本。

以單張 24GB VRAM 來看，9B 級模型比較務實；量化的 24B～35B 可以試，但 context 要節制。模型頁寫 1M context，不代表消費級 GPU 會因為看到規格表就突然多長記憶體。

更常見的答案是 hybrid：local 做分類、索引、摘要與敏感內容預處理；低價 cloud model 做 scout／worker；強模型負責架構、複雜修改與最終 review。

## CP 值不是月費，而是 accepted-task economics

Claude Pro、Cursor Pro、Copilot Pro，或 OpenRouter 上每百萬 token 幾毛錢，都是入場價格，不是總成本。

<figure style="margin:1.8em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/ai-coding-selection-2026/accepted-task-economics.svg' | relative_url }}" alt="每個被接受任務的成本：席次與 API、人工修正與 review、重試等待回滾、平台維運治理，以及預期事故風險" style="width:100%;height:auto;border-radius:12px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.6em;">圖三：低價模型多跑五次，再讓資深工程師修半小時，通常不便宜</figcaption>
</figure>

我比較在意的公式是：

> **有效 CP 值 = 被接受且通過品質門檻的任務價值 ÷（席次＋推論＋等待＋重工＋維運＋治理＋資安風險成本）**

Pilot 至少要記：

- time to accepted PR／ticket；
- first-pass acceptance；
- 人工修正與 review 分鐘數；
- build、test、lint、security gate 通過率；
- regression、rollback、re-open；
- 實際 model、provider、token、cache、retry 與 subagent；
- 每個 accepted task 的完整成本；
- 30／60／90 天後的維護性與 technical debt。

生成行數、prompt 次數、commit 數、登入率都很容易上升。它們和客戶價值沒有穩定關係，拿來當 KPI 只會鼓勵大家把更多東西生出來，再花更多時間刪掉。

## Benchmark 用來篩選，內部 eval 才能決策

SWE-bench、Terminal-Bench 和廠商 benchmark 可以顯示某個模型／agent 在特定資料集與 scaffold 下的能力，但不等於你的 Java monorepo、部署流程、安全規則或團隊速度。

分數背後至少有 harness、prompt、token budget、attempt 數、工具、題目版本與 pass criteria。就算 benchmark 通過，也不代表 human reviewer 願意接受。

我的做法是準備 20～40 個已知答案或可清楚驗收的真實任務，涵蓋探索、小修補、功能、重構、migration、review 與 incident：

1. 用歷史人工資料建立 baseline，不只問「感覺快多少」。
2. 同一類任務隨機分配或 cross-over 比較兩個 harness，避免第二次作答已經知道答案。
3. 固定 repository commit、依賴、測試、network、`AGENTS.md` 與權限。
4. 記錄 model、provider、harness version、reasoning、token、cache、attempt 與 subagent。
5. 用 human acceptance 加 automated gates 判定，不接受 agent 自稱 done。
6. 把第一次失敗到最後接受的成本全部算進去。
7. 分新人／資深、熟悉／陌生 repository、Windows／macOS／Linux 觀察。
8. 保存去識別的 failure 摘要，轉成下一輪 eval、文件與 policy。

公開 benchmark 的功能是幫你縮小候選池。真正的採購答案，應該從自己的失敗紀錄裡長出來。

## 一個 30 天企業 Pilot

### 第 0～3 天：先畫防線

選一個有真實價值、但不是 production-critical 的 repository。完成資料分級，畫出 IDE／CLI／cloud／provider／MCP 的資料流，決定兩個候選 harness、兩個模型家族，建立 SSO、最小權限、network、secrets、logging 與版本 pinning，並挑出 20～40 個 eval tasks。

### 第 4～10 天：建立可攜知識層

寫精簡 `AGENTS.md`，Claude 用薄 `CLAUDE.md` 匯入。把 build、test、lint、security gate 寫成真的能執行的命令。MCP 先只開 read-only、低風險工具，再用 5～10 個任務測 instructions、compaction、resume、rewind、Windows 與 CI 行為。

### 第 11～20 天：受控實驗

找 5～15 位工程師，按資歷與領域分層。同一類工作比較兩個 harness，不要求每個人使用同一介面。每張 ticket 記 model、provider、成本、人工時間與結果；每週把失敗拆成 context 不足、模型錯誤、工具錯誤、權限阻擋與需求含糊。

### 第 21～27 天：提高風險，但不拆護欄

加入 write MCP、較大重構、review 與 headless 工作。模擬 429、provider outage、模型切換、credential revocation、惡意 repository instruction；測試 rollback、audit、offboarding、budget exceeded，也要驗證跨模型 reviewer 是真的降低缺陷，還是只增加噪音。

### 第 28～30 天：做決策

最後輸出不應只是滿意度排名，而要回答：哪些任務可自主執行、哪些必須 pair／review；主力與備援 harness；核准的 model／provider／region；誰負責 instructions、skills、MCP 與 policy；每個 accepted task 的 p50／p95 時間與成本；以及 rollout、support、版本更新和退出方案。

## 我會怎麼選

### 個人技術顧問或重度工程師

我的基線是：**Claude Code 主力＋Codex reviewer＋OpenCode model lab＋Hermes 非機密編排。**

如果主要工作已在 OpenAI 生態，也可以把 Codex 與 Claude Code 的位置對調。重點不是誰坐正宮，而是 builder 和 reviewer 不要永遠用同一個模型家族，並把公司機密留在核准邊界內。

Grok Build 既然可免費試，就拿公開或個人 repository 跑 eval。免費額度用來換證據，不是換信仰。

### 5～50 人產品團隊

- terminal-first：Claude Code ＋ Codex；
- IDE-first：Cursor ＋ Claude Code，或 Copilot ＋ Codex；
- GitHub procurement-first：Copilot Business 作基線，少數 power users 配 Claude Code／Codex；
- model freedom-first：OpenCode／Cline ＋企業 gateway，但要補中央設定、support 與 audit。

第一天不要讓每個人自己帶 API key、任意 MCP 與任意模型。先建立核准入口，再保留受控實驗沙盒。

### 大型或受監管企業

第一輪 shortlist 可放 Claude Enterprise 的 Claude Code、ChatGPT Enterprise 的 Codex、GitHub Copilot Enterprise、Cursor Enterprise。先用 knockout gates 比 identity、data、MCP、sandbox、audit、residency 與 support，再談工程師偏好。

如果只能買一款，通常是採購和治理折衷。工程上更合理的配置，往往是一款廣泛、低摩擦的工具，加上一款供少數 power users 使用的深度 agent，而不是所有人同額度、同模式。

## 真正該留下來的，不是工具名稱

AI Coding 選型最危險的兩個極端，一個是每週追排行榜，另一個是為了反綁定，把每一款工具都留在正式環境。

前者把能力誤認為成果；後者把選擇權變成維運與治理債。

我會留下的是測試、CI、schema、ADR、spec、精簡的 `AGENTS.md`、可重複的 eval tasks、失敗紀錄與 accepted-task economics。模型、provider 和 harness 則視為可以替換的執行層。

這樣就不需要預測半年後誰排第一。新工具出現時，用同一批真實任務跑兩週，知道哪些資料可以送、失敗怎麼回復、每個被接受的成果花多少錢，再決定留下或換掉。

排行榜很快會過期。能把工具換掉而不把工程方法一起拆掉，才是這份選型真正要買的東西。

---

## 參考資料

- [Pragmatic Engineer：AI tooling survey 2026](https://newsletter.pragmaticengineer.com/p/ai-tooling-2026)
- [Stack Overflow Developer Survey 2025：AI](https://survey.stackoverflow.co/2025/ai)
- [DORA 2025 report](https://dora.dev/research/2025/dora-report/)
- [METR 2025 RCT](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) 與 [2026 方法更新](https://metr.org/blog/2026-02-24-uplift-update/)
- [Anthropic：Claude Code and expertise](https://www.anthropic.com/research/claude-code-expertise)
- Claude Code：[commands](https://code.claude.com/docs/en/commands)、[memory](https://code.claude.com/docs/en/memory)、[LLM gateway](https://code.claude.com/docs/en/llm-gateway)、[pricing](https://claude.com/pricing)
- Codex：[slash commands](https://developers.openai.com/codex/cli/slash-commands)、[`AGENTS.md`](https://developers.openai.com/codex/agent-configuration/agents-md)、[advanced configuration](https://developers.openai.com/codex/config-advanced)、[pricing](https://developers.openai.com/codex/pricing)
- Grok Build：[CLI](https://x.ai/cli)、[commands](https://docs.x.ai/build/modes-and-commands)、[enterprise](https://docs.x.ai/build/enterprise)
- Hermes Agent：[官方文件](https://hermes-agent.nousresearch.com/docs/)、[providers](https://hermes-agent.nousresearch.com/docs/integrations/providers)、[security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- Cursor：[rules](https://cursor.com/docs/rules)、[pricing](https://cursor.com/pricing)、[security](https://cursor.com/security)
- OpenCode：[providers](https://opencode.ai/docs/providers/)、[models](https://opencode.ai/docs/models/)、[rules](https://opencode.ai/docs/rules/)
- GitHub Copilot：[plans](https://github.com/features/copilot/plans)、[enterprise agent management](https://docs.github.com/copilot/concepts/agents/enterprise-management)
- OpenRouter：[provider routing](https://openrouter.ai/docs/guides/routing/provider-selection)、[data collection](https://openrouter.ai/docs/guides/privacy/data-collection)、[ZDR](https://openrouter.ai/docs/guides/features/zdr)、[pricing](https://openrouter.ai/pricing)
