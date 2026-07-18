---
title: "Kimi K3 讓「閉源一定更強」失效了：開放模型如何在特定領域超車"
seo_title: "Kimi K3 深度解析：2.8T MoE、1M Context、Agent Benchmark 與開放權重真相"
date: 2026-07-18
published: true
categories: [technical]
tags: [kimi-k3, open-weight-llm, ai-agent, agentic-engineering]
layout: article
cover_image: /assets/img/kimi-k3-open-frontier/kimi-k3-open-frontier-banner.jpg
hero_image: true
description: "Kimi K3 以 2.8 兆參數、100 萬 token、原生視覺與長程 Agent 能力進入前沿模型第一梯隊，並在前端開發、程式與代理任務的部分評測超越閉源旗艦。本文拆解它的 MoE、KDA、AttnRes、API 成本、Harness 限制，以及『已上線但尚未開放權重』的關鍵差別。"
keywords: Kimi K3, Moonshot AI, 月之暗面, 開放權重模型, 開源 LLM, Mixture of Experts, MoE, Kimi Delta Attention, Attention Residuals, 100萬 token, AI Agent, Agentic Engineering, Kimi Code, Artificial Analysis, Arena WebDev, 史旺基, Swanky Studio
---

在上一篇[〈別再只看排行榜第一名：Artificial Analysis 與 2026 LLM 評估方法全解析〉]({% post_url 2026-07-17-artificial-analysis-llm-evaluation-2026 %})裡，我把模型能力、Agent 任務、速度、成本與私有評估拆成不同層次。結論很簡單：排行榜能幫你找到候選，不能替你做最後的選型。

這套方法很快就遇到一個很難忽略的新案例：**Kimi K3**。

在 Arena 的前端網頁開發榜上，它暫時排第一；Moonshot 公布的 Program Bench、Automation Bench、BrowseComp，也都出現它壓過 Claude Fable 5 或 GPT-5.6 Sol 的項目。這不是某個小模型靠價格換掌聲，而是一個 2.8 兆總參數、100 萬 token 上下文、原生視覺、專門為長時間 Agent 工作打造的重量級模型。

先不要急著把新聞標題寫成「中國開源模型全面擊敗美國閉源 AI」。那樣很有流量，也很容易在兩天後變成笑話。

**K3 真正重要的地方，不是它全面贏了——它沒有。重要的是，閉源模型在所有高價值工作上理所當然領先的假設，已經失效。開放模型陣營不再只是追趕通用平均分，而是開始在前端開發、工具操作、長流程研究與部分程式任務裡，先把旗子插到閉源模型前面。**

這個轉折，比「第幾名」有意思得多。

## 先給結論：開放模型已經局部超車，但 K3 現在還不能直接叫開源

我對 Kimi K3 的判斷可以濃縮成六句話：

1. **它已經正式上線，不是預告。**網頁、桌面工作代理、Coding Agent 與 API 都能使用。
2. **它進入了前沿模型第一梯隊。**截至 2026 年 7 月 18 日，Artificial Analysis Intelligence Index 為 57 分、排名第 4；但速度、價格與輸出長度並不漂亮。
3. **它在特定領域確實贏過頂尖閉源模型。**最明顯的是 Arena WebDev 暫列第一，以及 Program Bench、Automation Bench、BrowseComp 等項目的領先。
4. **它沒有全面超越 Claude 或 GPT。**DeepSWE、FrontierSWE、Terminal-Bench 仍有閉源模型領先，Moonshot 自己也承認整體表現仍落後 Claude Fable 5 與 GPT-5.6 Sol。
5. **它走的是開放權重路線，但截至 7 月 18 日權重還沒發布。**Arena 與 Artificial Analysis 目前仍把它標成 proprietary。
6. **它不是便宜的小模型。**US$3／15 的一般輸入／輸出價、約 62 token／秒、固定 max 推理強度，加上極大的部署需求，讓它比較像重型工程設備，不是大量小任務的免洗工讀生。

所以，最精準的說法不是「開源模型全面勝利」，而是：

> **前沿能力已經從一條封閉的總排行榜，裂成多個領域戰場。開放權重或承諾開放權重的模型，開始在其中一些戰場領先閉源旗艦。**

這代表企業與開發者的選型方法也要改。以前可能先問「哪一家最強」，現在要先問「我的任務到底在哪個戰場」。

## Kimi K3 到底是什麼：不是 2.8 兆參數一起上班

K3 最搶眼的數字是 **2.8 兆總參數**。

如果把它理解成每生成一個 token，都有 2.8 兆參數一起全速運算，會得到一個很壯觀、也不太正確的畫面。K3 採用 Stable LatentMoE；官方表示，它在 896 個專家中，每次有效啟用 16 個。換算後約是 **1.79% 的專家被選中**，但這不等於只有 1.79% 的總參數參與運算，因為模型仍有共享層、注意力與其他結構。

比較好懂的比喻，是一間有 896 位專家的巨型顧問公司。每個 token 進來，路由器挑 16 位進會議室；其他人不必全部開麥克風。

這種設計讓模型能擴大容量，又不必每一步都付出完整 dense model 的計算成本。代價也很直接：

- 路由器要選對專家；
- 熱門專家不能全部塞車；
- 大量 GPU 之間要高速交換資料；
- 訓練與推論都更依賴整體基礎設施。

Moonshot 為此加入 Quantile Balancing、平衡式 expert parallel training 與 Stable LatentMoE。這些名字聽起來很研究，但實際處理的是同一件事：**模型很大不稀奇，能讓 896 個專家不要在分散式系統裡互相等到下班，才是工程。**

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/kimi-k3-open-frontier/kimi-k3-architecture.svg' | relative_url }}" alt="Kimi K3 系統架構圖：文字、圖片與長上下文先經 KDA 和 AttnRes，再由 Stable LatentMoE 從 896 個專家中選擇 16 個，交給 Agent Harness 執行；底層使用 MXFP4 權重、MXFP8 activation 與 64 個以上加速器" style="width:100%;height:auto;border-radius:14px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖一：K3 的能力來自模型、路由、Harness 與推論底座共同作用，不是單看 2.8 兆參數</figcaption>
</figure>

### KDA 與 AttnRes：一個處理長度，一個處理深度

K3 的另外兩個核心結構是：

- **Kimi Delta Attention（KDA）**：作為長上下文與大規模注意力的效率基礎；
- **Attention Residuals（AttnRes）**：讓模型能沿著深度選擇性取回過去層的表示，而不是只把所有資訊一路均勻累加。

直觀地說，KDA 處理的是「文件很長時怎麼不要算到失控」，AttnRes 處理的是「模型很深時怎麼不要把前面的重點稀釋掉」。

官方宣稱這些架構、稀疏度與訓練方法，讓 K3 相較 K2 的整體 scaling efficiency 提升約 2.5 倍。這仍是廠商數據；完整技術報告尚未發布，目前可以理解方向，不能假裝已經完成外部重現。

### 100 萬 token 的價值，不是讓你貼一本小說

K3 的官方精確規格是 **1,048,576 token 上下文**，並支援原生視覺輸入。真正有價值的情境不是炫耀能塞多少頁，而是讓長時間 Agent 同時保留：

- 原始需求與驗收條件；
- 大型程式庫、文件與 API 規格；
- 工具呼叫結果與錯誤紀錄；
- 畫面截圖、視覺回饋與修改歷史；
- 先前嘗試過但失敗的路徑。

K3 特別強調 vision in the loop。它不只寫前端程式，也能看執行畫面，再修改 CSS、互動、遊戲或 3D 場景。這也解釋了為什麼它在前端網頁生成與視覺程式任務上特別突出。

但 Context Window 是容量，不是保真度保證。能放進 100 萬 token，不代表第 37 萬與第 91 萬 token 的細節都能同樣可靠地取回。長上下文仍要用自己的 needle、跨文件整合與長軌跡任務測試。

帳戶限制也可能比模型規格先撞牆。Kimi API 的低階 Tier 0 帳戶目前只有每分鐘 50 萬 token，低於模型的完整上下文容量；要測真正的 1M request，必須先核對帳戶等級、TPM 與 input／reasoning／output 如何共同占用 context。規格頁寫得下，不代表你的帳戶當下送得進去。

## 開放模型開始領先閉源，證據在哪裡？

這裡要把「領先」拆成三種證據：獨立人類偏好、廠商公布評測，以及跨模型綜合指數。三者都能看，但不能混成同一張成績單。

### 1. Arena WebDev：目前最有力的獨立訊號

Arena 在 2026 年 7 月 16 日的 WebDev Overall 榜，把前端網頁開發定義為包含多步驟推理與工具使用的工作。當時的實驗室排名是：

| 排名 | 模型 | 分數 |
| ---: | --- | ---: |
| 1 | Kimi K3 | 1679 ± 17 |
| 2 | Claude Fable 5 | 1631 ± 13 |
| 3 | GPT-5.6 Sol（Codex harness） | 1618 ± 13 |
| 4 | GLM-5.2 | 1587 ± 10 |

如果把條件收緊成「權重今天已經公開」，第 4 名的 GLM-5.2 反而是更直接的證據。Z.ai 已用 MIT 授權發布模型，Arena 上它仍排在 Grok 4.5、Muse Spark 1.1 等多個閉源模型之前。這不代表開放模型拿下通用總冠軍，卻已足以證明：**在一個明確的前端開發領域，開放權重模型可以實際領先多個閉源前沿模型。**

這張表有兩個訊號。

第一，K3 在前端網頁開發這個具體領域，確實暫時領先兩個最強閉源模型。這就是「開放模型路線已能在特定領域超車」最直接的例子。

第二，**在 7 月 16 日的榜單頁面上，Arena 仍把 K3 標成 proprietary**。所以這不是一張「已開源模型第一名」證書，而是「承諾在十一天內開放權重的模型，已先在產品與評測上跑到第一」的時間差。

榜單還會變，K3 也仍是新模型。1679 不是刻在石碑上的數字；真正值得記住的是，前端開發已經不再由閉源模型天然包辦前排。

### 2. Moonshot 官方評測：不是全面勝利，而是明顯偏科

Moonshot 公布的完整表格呈現一個很有性格的模型。

K3 領先的項目包括：

| 評測 | Kimi K3 | Claude Fable 5 | GPT-5.6 Sol |
| --- | ---: | ---: | ---: |
| Program Bench | **77.8** | 76.8 | 77.6 |
| Automation Bench | **30.8** | 29.1 | 29.7 |
| BrowseComp | **91.2** | 88.0 | 90.4 |
| SpreadsheetBench 2 | **34.8** | 34.7 | 32.4 |

但它不是每一科都贏：

| 評測 | Kimi K3 | 領先模型 |
| --- | ---: | --- |
| DeepSWE | 67.5 | GPT-5.6 Sol：73.0 |
| Terminal-Bench 2.1 | 88.3 | GPT-5.6 Sol：88.8 |
| FrontierSWE | 81.2 | Claude Fable 5：86.6 |
| GDPval-AA v2 Elo | 1668 | Claude Fable 5：1760 |

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/kimi-k3-open-frontier/kimi-k3-benchmark-radar.svg' | relative_url }}" alt="Kimi K3、Claude Fable 5 與 GPT-5.6 Sol 六項官方評測雷達圖；K3 在 Program Bench、Automation Bench 與 BrowseComp 領先，在 DeepSWE、Terminal-Bench 與 FrontierSWE 未領先" style="width:100%;height:auto;border-radius:14px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖二：K3 的形狀是局部領先、局部落後；各評測使用條件不同，不能把面積當成綜合總分</figcaption>
</figure>

這組結果最適合支持的結論是：**K3 在前端、瀏覽研究、流程自動化、試算表與部分程式任務已能超車；但在完整軟體工程與綜合專業工作上，還沒有全面領先。**

更麻煩的是，這些項目使用的 Harness 不完全相同。K3 可能搭 Kimi Code，Claude 搭 Claude Code，GPT 搭 Codex；部分評測甚至會取其他模型在不同 Harness 中的最佳分數。K3 也全部使用 max thinking effort。

所以，這些是「模型加工作系統」的結果，不是把三顆裸模型放在無菌室裡打一架。

### 3. Artificial Analysis：能力很強，食量也不小

Artificial Analysis 對 K3 的快照更接近一盆冷水：

- Intelligence Index：**57 分，2026 年 7 月 18 日排名第 4**；
- 輸出速度：約 **62 token／秒**，低於同類平均；這是開始輸出後的 decode 速度，不是使用者等到答案的完整時間；
- 支援文字與圖像輸入、文字輸出、100 萬 token 上下文；
- Intelligence Index 評測共輸出約 **1.30 億 token**，同類平均約 6,300 萬；
- 該次完整 Intelligence Index 評測成本約 **US$2,709.75**。

Artificial Analysis 在 Kimi 官方 API 的 10K 輸入工作負載上，量到約 1.99 秒收到第一個 token，但模型在正式答案前平均先推理約 32.25 秒，因此 **第一個可讀答案 token 約要等 34.24 秒**；生成到 500 token 的端到端時間約 42.30 秒。這組數字比「62 token／秒」更接近人真正坐在螢幕前的感受：它開始講話後不算慢，但開口前會想很久。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/kimi-k3-open-frontier/kimi-k3-latency-anatomy.svg' | relative_url }}" alt="Kimi K3 延遲拆解：1.99 秒收到第一個 token，答案前推理約 32.25 秒，約 34.24 秒看到第一個正式答案 token，生成至 500 token 約 42.30 秒" style="width:100%;height:auto;border-radius:14px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖三：62 token／秒只描述開始輸出後的速度；互動體驗還要看第一個答案出現時間</figcaption>
</figure>

也就是說，K3 不是那種「又小、又快、又便宜，順便把閉源模型全打趴」的童話。它比較像一位能力很強、願意一路做到底，但開會時間很長、差旅費也不少的資深顧問。

這反而讓它的局部領先更值得研究。因為 K3 不是靠極低價格偷到一個位置，而是用重型架構換到特定工作的前沿能力。

## 「開源」這兩個字，現在還不能寫得太順手

Moonshot 稱 K3 為第一個 open 3T-class model，API 文件也直接寫「開源」。但同一份官方資料又說，完整模型權重將於 2026 年 7 月 27 日前發布。

對企業選型而言，現在真正能確定的是：

- 產品與 API 已上線；
- 官方承諾將發布完整權重；
- Moonshot 官方 GitHub 與 Hugging Face 仍找不到 K3 權重 Repository；
- 完整權重、技術報告與最終授權仍待驗收；
- Arena 與 Artificial Analysis 暫時仍標示 proprietary。

即使權重如期上線，**開放權重也不自動等於完整開源 AI**。Open Source Initiative 的 Open Source AI Definition 還會檢查是否提供足夠的參數、程式碼、資料資訊與自由使用、研究、修改、分享的權利。

因此，現在最不容易翻車的寫法是：

> **Kimi K3 是已公開使用、預定於 7 月 27 日前發布完整權重的前沿模型。它代表開放模型路線的能力突破；是否符合完整開源定義，要等權重、程式碼、資料揭露與授權條款實際落地後判定。**

這個字眼不是挑語病。對企業而言，能下載權重、能修改、能商用、能再散布、能取得推論程式與足夠技術資訊，是完全不同的權利。

## 價格不算低，快取才是 K3 經濟學的核心

K3 官方 API 每百萬 token 的價格是：

| 類型 | 價格 |
| --- | ---: |
| 快取命中輸入 | US$0.30 |
| 一般輸入 | US$3.00 |
| 輸出 | US$15.00 |

如果用 70% 快取命中輸入、20% 一般輸入、10% 輸出的示意組合計算，加權價格是每百萬混合 token **US$2.31**。這個數字只有在你的工作負載真的接近該比例時才有意義。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/kimi-k3-open-frontier/kimi-k3-token-economics.svg' | relative_url }}" alt="Kimi K3 API 成本圖：快取命中輸入每百萬 token 0.30 美元、未命中輸入 3 美元、輸出 15 美元；以 70 比 20 比 10 的 token 組合計算，混合價格為 2.31 美元，其中輸出只占 10% token 卻占約 65% 成本" style="width:100%;height:auto;border-radius:14px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖四：輸出只占示意 token mix 的 10%，卻貢獻約 65% 成本；K3 的冗長會直接吃掉快取優勢</figcaption>
</figure>

Moonshot 表示，官方 Kimi API 在 Coding 工作負載的快取命中率可超過 90%。這個優勢來自 Mooncake 的分離式推論架構與長前綴快取。Coding Agent 會反覆攜帶相同程式庫、系統指令與對話歷史，理論上非常適合快取。

但問題是：只要你頻繁改動前綴、切換 Harness、重組訊息或把模型當成臨時 fallback，快取命中率和品質都可能一起掉。

而且輸出是 US$15，K3 在 Artificial Analysis 的輸出量又接近同類平均的兩倍。**便宜的快取輸入，救不了無限制的長篇輸出。**

真正該追的不是 API 價目表，而是：

> **每個被接受的任務成本 = 模型與工具總成本 ÷ 通過驗收的任務數，再加上人工修正、等待、重試與風險。**

這也是我在[2026 年 AI Coding 工具選型]({% post_url 2026-07-12-ai-coding-tool-selection-2026 %})裡反覆強調的 accepted-task economics。模型單價只是最容易被看見的那一小塊。

## K3 最容易被忽略的限制：它不是可以隨便熱插拔的模型

Kimi 官方很誠實地列出一個不常見、但很關鍵的限制：**K3 對完整思考歷史很敏感。**

K3 採保留思考歷史的訓練方式。多輪對話與工具呼叫時，API 文件要求把完整的 assistant message 原樣帶回下一輪，不能只留下最終 `content`。如果 Harness 沒有正確保留歷史，或在進行中的工作中途從其他模型切換到 K3，生成品質可能變得非常不穩定。

這件事直接打臉一個常見想像：

> 「反正都是 OpenAI-compatible API，改一下 model slug 就能無痛切換。」

插頭一樣，只代表插得進去，不代表電壓、通訊協定與工作習慣都一樣。

如果把 K3 接進 Hermes、OpenCode、Codex 相容 Gateway 或企業自製 Agent，至少要驗證：

1. reasoning history 是否完整 round-trip；
2. tool call 與 tool result 是否保持正確順序；
3. context compaction 是否會丟掉 K3 需要的思考內容；
4. mid-session fallback／failback 是否造成品質崩落；
5. 快取是否因訊息重組而失效；
6. Harness 的 System Prompt 與工具描述是否針對 K3 調整。

官方目前建議使用已驗證相容的 Kimi Code。這不是說第三方 Harness 不能用，而是不能只測「API 回了 200」，就宣告整合完成。

## 另一個限制更像 Agent 的性格問題：過度主動

Moonshot 把它叫作 **excessive proactiveness**。

K3 被特別訓練來處理長時間、困難、開放式任務。這讓它能在大型工程與研究裡持續推進，也讓它在需求模糊時，可能替使用者做出預料外的決定。

你叫它移一張椅子，它可能順便重新裝潢會議室。做得還不錯，但問題不是這個。

對有工具權限的 Agent，這不是文風偏好，而是風險模型。系統至少要有：

- 明確的檔案、網路、資料與工具權限；
- 刪除、覆寫、付款、寄送、發布與部署前的人工核准；
- 可執行的 allowlist／denylist，不只是在 Prompt 裡拜託它乖一點；
- 每一步的日誌、產物檢查與失敗回復；
- 對模糊需求先停下詢問的明確規則。

`AGENTS.md` 可以告訴模型怎麼做事，但真正的安全邊界仍要靠 sandbox、權限、憑證、網路政策與 approval gate 強制執行。

K3 上線初期也只有 `max` 推理強度，低與高檔位仍待後續開放。這讓簡單任務可能太慢、太長、太貴。Kimi 官方聯網搜尋工具目前也在更新，文件明確寫著近期不建議使用；需要正式研究流程時，應接自己的可觀測搜尋與引用工具，而不是把產品展示當成生產 SLA。

## 誰現在應該測 K3？

我會優先把 K3 放進以下工作的對照組：

### 1. 前端與視覺程式

給它需求、參考畫面、現有 Repository、瀏覽器截圖與可執行測試，看它能不能在 vision-in-the-loop 裡反覆修改，而不是只生成一張看起來很厲害的首頁。

### 2. 大型 Repository 的長時間任務

例如跨模組重構、測試補齊、工具鏈整合、GPU kernel、資料處理與需要終端機反覆驗證的工作。這些才有機會用到它的長軌跡能力。

### 3. 可交付的知識工作

不要只測「幫我摘要 20 份報告」。測它能不能交付帶來源的研究、試算表、互動圖表、簡報或可檢查的資料產物，並把事實、推論與不確定性分開。

### 4. 開放權重與私有部署的前置研究

大型雲端供應商、研究機構與有 64+ 加速器 supernode 能力的組織，可以先評估權重發布後的部署路線。一般個人或中小企業則不要被「開放權重」三個字騙去下載一艘貨輪。

K3 使用 MXFP4 權重時，2.8 兆參數的理論緊密打包下限就約 **1.4 TB**，還沒算 metadata、共享結構、執行環境、KV cache、通訊與冗餘。官方建議至少 64 個加速器的 supernode，不是因為他們討厭玩家顯示卡。

## 一個務實的 K3 Pilot

不要全面遷移。先挑 20～40 個真實任務，分成四組：

- 前端／視覺開發；
- Repository 級軟體工程；
- 瀏覽與研究；
- 文件、試算表與互動成果。

同一批任務至少比較 K3、現有主力閉源模型，以及一個較便宜的開放權重模型。固定 Repository commit、Prompt、工具、權限、時間上限與驗收條件，記錄：

- 第一次通過率；
- 人工修正分鐘數；
- 測試、視覺回歸與事實查核結果；
- Token、快取、工具呼叫與總成本；
- P50／P95 完成時間；
- 越權、過度主動與誤判完成的次數；
- Harness、Provider、reasoning effort 與版本。

尤其不要把 K3 硬塞進現有 Router，然後在任務中途切過去。K3 適合從任務開始就被正確分流，使用相容 Harness 完整跑完；它目前不是理想的臨時備胎。

最後輸出的決策，也不該是「K3 贏了，所以全部換掉」。比較合理的結果可能是：

- K3：前端、視覺程式、長程研究與特定重型工程；
- Claude／GPT：需要更成熟指令遵循、商務文字與高可靠體驗的工作；
- 較小開放模型：分類、摘要、格式轉換與大量低風險任務；
- 人類：權限、品味、風險與最後驗收。

這才是真正的模型路由，不是把 fallback 名單寫長一點。

## 最後判斷：閉源不再是能力保證，開放也不是免費午餐

Kimi K3 沒有終結 Claude，也沒有把 GPT 送進博物館。

它做的事情比較麻煩：它讓原本很方便的二分法失效了。

以前可以把閉源模型理解成能力前沿，把開放模型理解成便宜、可控、稍微落後的替代方案。現在這條線被前端開發、工具操作、長流程 Agent、視覺程式與研究工作切得亂七八糟。**開放模型不必先拿下通用總冠軍，才有資格在真正的工作裡領先。**

當然，K3 的權重還沒落地，授權還沒驗收，技術報告還沒公開，速度不快，輸出很長，部署也重得離譜。把這些省略掉，只剩「全球最大開源模型」，跟只看排行榜第一名沒有本質差別。

對我來說，K3 最值得記住的不是 2.8 兆。

是從這一代開始，選擇開放模型不再只是為了省錢或避免供應商綁定。有些時候，你選它，是因為它真的把某一種工作做得更好。

這才是閉源模型真正需要擔心的地方。

---

## 參考資料

- [Kimi：Kimi K3 Tech Blog——Open Frontier Intelligence](https://www.kimi.com/blog/kimi-k3)
- [Kimi API：Kimi K3 模型、思考歷史、視覺輸入、快取與限制](https://platform.kimi.com/docs/guide/kimi-k3-quickstart)
- [Kimi API：Kimi K3 價格與帳戶流量限制](https://platform.kimi.ai/docs/pricing/limits)
- [Artificial Analysis：Kimi K3 Intelligence、Speed、Price 與技術規格](https://artificialanalysis.ai/models/kimi-k3)
- [Artificial Analysis：Kimi K3 Provider 速度、延遲與混合價格](https://artificialanalysis.ai/models/kimi-k3/providers)
- [Arena：WebDev AI Leaderboard](https://arena.ai/leaderboard/code/webdev?rankBy=labs)
- [Z.ai：GLM-5.2——MIT 授權與長程 Agent 技術說明](https://z.ai/blog/glm-5.2)
- [Open Source Initiative：Open Source AI Definition 1.0](https://opensource.org/ai/open-source-ai-definition)
- [Reuters：Moonshot unveils Kimi K3](https://www.reuters.com/world/china/chinas-moonshot-unveils-worlds-largest-open-ai-model-closing-us-rivals-2026-07-17/)
