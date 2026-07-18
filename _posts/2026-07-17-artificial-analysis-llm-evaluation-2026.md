---
title: "別再只看排行榜第一名：Artificial Analysis 與 2026 LLM 評估方法全解析"
seo_title: "Artificial Analysis 深度解析：2026 LLM Benchmark、速度、成本與私有評估方法"
date: 2026-07-17
published: false
categories: [technical]
tags: [artificial-analysis, llm-evaluation, ai-agent, modelops]
layout: article
cover_image: /assets/img/artificial-analysis-llm-evaluation-2026/artificial-analysis-llm-evaluation-banner.jpg
hero_image: true
description: "排行榜只能幫你縮小候選，不能替你做採購與架構決策。本文拆解 Artificial Analysis Intelligence Index v4.1、Agentic Benchmark、速度與成本，並建立可落地的私有評估與模型路由方法。"
keywords: Artificial Analysis, LLM 評估, Intelligence Index, Benchmark, AI Agent, Agentic Engineering, ModelOps, TTFT, TTFA, Cost per Task, 私有評估集, 模型路由, 史旺基, Swanky Studio
---

每次新模型發布，大家第一個問題通常都是：「它排第幾名？」

這個問題很快，也很容易問錯。

同一個模型換一個 Provider、推理強度、Agent Harness、工具環境或快取策略，速度、成本與任務成功率都可能完全不同。排行榜上的名稱看起來一樣，真正上線的卻不是同一套系統。

Artificial Analysis 有價值的地方，不是再做一張更長的排行榜，而是把模型能力、Agent 任務、API 效能與成本放到同一個觀察介面。

但它仍然不能替企業回答最後一題：**哪一套模型系統，能在可接受的成本、延遲、人工介入與風險下，穩定完成我的工作？**

這篇文章要處理的，就是從公開排行榜走到實際選型，中間那段最容易被省略的路。

## 先給結論：排行榜是雷達，不是方向盤

選擇大型語言模型，至少要同時看四件事：

1. **能力**：模型能否理解、推理、寫程式並完成多步驟任務；
2. **成本**：不是 API 牌價，而是每個合格成果的總成本；
3. **體驗**：首字延遲、第一個可讀答案、完整任務時間與長尾等待；
4. **可靠度**：錯誤率、工具恢復、重大失敗與人工接手比例。

只看 Intelligence Index，會忽略速度與成本；只看 token 單價，會忽略模型為了完成同一件事到底用了多少 token；只看每秒輸出速度，又會忽略模型可能在正式回答前先想了半分鐘。

真正的部署單位從來不是一個 model slug，而是：

> **Model + Configuration + Provider + Harness + Tools + Routing**

## Artificial Analysis 的定位：把「模型強不強」與「服務好不好」拆開

Artificial Analysis 是獨立的 AI 模型與推論服務分析平台。它同時整理三個容易被混在一起的層次：

### Model

被訓練出來的模型本體。能力受到權重、訓練資料、後訓練、推理機制與安全策略影響。

### Provider／Endpoint

真正被呼叫的 API。排隊、Batching、量化、快取、區域節點與流量限制，都會改變使用者感受到的速度與穩定度。

### Agent System

模型外圍的 Prompt、工具、記憶、重試、Context 管理、權限與執行框架。對 Coding Agent 或企業自動化來說，這一層經常與模型本身同樣重要。

同一個開放權重模型放在不同 Provider 上，可能有不同的 Output Speed、Time to First Token、可用 Context、價格與錯誤率。

所以看到「某模型每秒 100 token」時，第一個問題不該是「它好快」，而是：**哪一個 Provider、哪個區域、什麼 Prompt 長度、什麼時間與哪種負載？**

## Intelligence Index v4.1：2026 年開始更像工作測驗，不只像考卷

Artificial Analysis Intelligence Index 是把多項評估加權後形成的複合指標。這裡的 Intelligence 不是人類心理測驗中的智商，而是模型在一套英文、純文字測試裡呈現的綜合能力。

v4.1 分成四大類：

| 類別 | 權重 | 核心問題 |
| --- | ---: | --- |
| Agents | 34% | 能否持續規劃、操作工具、維持狀態並交付成果 |
| Coding | 24% | 能否在程式、終端機與科學運算環境解決問題 |
| Scientific | 24% | 能否處理高難度科學、數學與研究問題 |
| General | 18% | 知識正確率、避免幻覺與長文件整合 |

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/artificial-analysis-llm-evaluation-2026/aa-index-v41.svg' | relative_url }}" alt="Artificial Analysis Intelligence Index v4.1 權重圖：Agents 34%、Coding 24%、Scientific 24%、General 18%" style="width:100%;height:auto;border-radius:14px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖一：Agent 任務已占最大權重，模型競爭正從回答問題轉向完成工作</figcaption>
</figure>

v4.1 由九項評測組成：

| 類別 | 評測 | 權重 | 主要衡量內容 |
| --- | --- | ---: | --- |
| Agents | GDPval-AA v2 | 20% | 真實專業工作、資料蒐集與文件交付 |
| Agents | τ³-Banking | 14% | 知識查閱、對話協作與銀行流程操作 |
| Coding | Terminal-Bench v2.1 | 16% | 終端機、系統管理、資料與程式任務 |
| Coding | SciCode | 8% | 科學研究情境的 Python 程式設計 |
| Scientific | Humanity’s Last Exam | 12% | 高難度跨領域知識與推理 |
| Scientific | GPQA Diamond | 6% | 研究所與博士級科學問題 |
| Scientific | CritPt | 6% | 研究等級物理與數學推理 |
| General | AA-Omniscience | 12% | 知識正確率與避免幻覺 |
| General | AA-LCR | 6% | 長文件資訊擷取與整合 |

這套權重傳達三個訊號。

第一，Agentic Work 已經進入核心，而不是排行榜旁邊的附加欄位。

第二，Benchmark 也需要版本治理。當某些題目逐漸飽和、失去區分前沿模型的能力，就應該被降權或移除。

第三，能力分數開始與 Cost per Task、Time per Task、Tokens per Task 放在一起。模型不只要答對，還要付得起、等得到，並且能在合理步數裡完成。

## 2026 LLM 評估地圖：從公開訊號走向部署決策

評估不是一條由低分走向高分的直線，而是一張逐層收斂的地圖。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/artificial-analysis-llm-evaluation-2026/aa-evaluation-map.svg' | relative_url }}" alt="2026 LLM 評估地圖：從人類偏好、綜合能力、專項能力、營運品質到私有業務評估，最後形成模型、Provider、Harness 與 Routing 的部署決策" style="width:100%;height:auto;border-radius:14px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖二：越接近真正的部署決策，越不能只靠公開排行榜</figcaption>
</figure>

### 第一層：人類偏好

LMArena 透過匿名成對比較，回答「人類比較喜歡哪個回答」。它適合觀察對話體驗、文風與一般使用感受，但不是單純的客觀正確率。

### 第二層：綜合能力

Artificial Analysis Intelligence Index、HLE、GPQA Diamond 等指標，用來快速縮小前沿模型候選池。

### 第三層：專項能力

Coding Agent、軟體工程、專業知識工作、SaaS 自動化、多語言、視覺與長上下文，都需要不同的尺。

### 第四層：營運體質

TTFT、TTFA、Output Speed、P95、Error Rate、Rate Limit、Context Cache 與 Cost per Task，決定模型能不能進入產品。

### 第五層：私有業務評估

真實任務成功率、重大錯誤、人工接手、權限風險與每個合格成果的成本，才是最後的部署依據。

實務上可以先用前兩層，把數百個模型縮小到三至五個；再用專項能力與營運條件淘汰不合格方案，最後用私有任務決定分工與路由。

## 不要把速度、延遲與任務時間混成一個數字

Reasoning Model 讓「回應速度」變得更難描述。收到第一個 token，不代表使用者已經看到正式答案；開始輸出後很快，也不代表整體任務較快。

| 指標 | 實際意義 | 最適合回答的問題 | 常見誤解 |
| --- | --- | --- | --- |
| TTFT | 送出請求到第一個 token | 串流是否快速啟動 | 第一個 token 可能只是推理內容 |
| TTFA | 送出請求到第一個正式答案 token | 使用者何時看到可讀答案 | 經常被 TTFT 掩蓋 |
| Output Speed | 開始輸出後每秒產生多少 token | 長回答與高吞吐工作 | 不包含前置推理與排隊 |
| E2E Time | 送出請求到完整回答結束 | 完整互動等待 | 會受到回答長度影響 |
| Time per Task | 完成一個評估任務的時間 | 長時程 Agent 效率 | 不一定包含外部工具等待 |
| Cost per Task | 每個評估任務的 token 成本 | 模型工作量與經濟性 | 不等於成功業務任務成本 |

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/artificial-analysis-llm-evaluation-2026/aa-latency-metrics.svg' | relative_url }}" alt="LLM 延遲指標圖：請求送出後依序經過排隊與首 token、答案前推理、正式答案輸出，最後才是完整任務時間；TTFT、TTFA、Output Speed 與 E2E Time 衡量不同階段" style="width:100%;height:auto;border-radius:14px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖三：每秒輸出速度只量到最後一段，不能代表完整體驗</figcaption>
</figure>

Artificial Analysis 的效能測試使用固定 Prompt Shape，並持續量測公開端點，避免拿一次速度測試當成長期服務品質。

企業仍應用自己的地區、尖峰流量、Prompt 長度、併發量與工具環境，重測 P50、P95、Timeout 和 Error Rate。

## 從 Token Price 升級到 Cost per Successful Task

模型 A 的牌價比較便宜，不代表完成工作比較便宜。

假設模型 A 每次嘗試成本 US$0.20，成功率只有 40%，平均每個成功任務成本是 US$0.50。

模型 B 每次嘗試成本 US$0.35，成功率 90%，平均每個成功任務反而只要約 US$0.39。

> **每個成功任務成本 = 平均嘗試成本 ÷ 任務成功率**

而且這還只是模型成本。完整成本還包括搜尋、資料庫、Tool API、重試、人工複核、返工、錯誤處理與風險。

真正該優化的不是「每百萬 token 最便宜」，而是：**符合品質門檻，而且不用重新做一次的成果。**

## 常見 Benchmark 的分工：每一把尺都有自己的形狀

| 類型 | 代表評測或平台 | 適合用途 | 主要限制 |
| --- | --- | --- | --- |
| 人類偏好 | [LMArena Arena-Rank](https://arena.ai/blog/arena-rank/) | 對話體驗、文風與一般使用感受 | 會受篇幅、語氣與展示方式影響 |
| 綜合能力 | [Artificial Analysis Intelligence Index](https://artificialanalysis.ai/methodology/intelligence-benchmarking) | 初步篩選與跨模型比較 | 權重代表平台的能力觀點 |
| 硬推理 | [HLE](https://lastexam.ai/)、[GPQA Diamond](https://github.com/idavidrein/gpqa)、[MMLU-Pro](https://github.com/TIGER-AI-Lab/MMLU-Pro) | 科學、研究與知識密集任務 | 不代表能操作工具或完成流程 |
| 程式生成 | [LiveCodeBench](https://livecodebench.github.io/) | 演算法與程式碼生成 | 與大型既有系統維護仍有距離 |
| 軟體工程 | [SWE-bench 系列](https://www.swebench.com/) | Repository 級開發與除錯 | 高度依賴 Harness、工具與版本 |
| 終端機 Agent | [Terminal-Bench](https://www.tbench.ai/) | Coding Agent、DevOps、CLI 工作 | 分數同時反映模型與外圍系統 |
| 專業知識工作 | [GDPval-AA](https://artificialanalysis.ai/evaluations/gdpval-aa)、[AA-Briefcase](https://artificialanalysis.ai/evaluations/aa-briefcase) | 文件、簡報、試算表與專業成果 | 評分成本高，部分使用模型評審 |
| SaaS 自動化 | [AutomationBench-AA](https://artificialanalysis.ai/evaluations/automationbench-aa) | 企業 Agent 與流程自動化 | 模擬環境不等於真實權限系統 |
| 營運品質 | [AA API 效能測試（TTFT、P95、Error Rate、Cost per Task）](https://artificialanalysis.ai/methodology/performance-benchmarking) | 生產部署與容量規劃 | Provider、區域與時間都會改變 |

把不同 Benchmark 的第一名直接放進同一張「總冠軍」表，就像拿短跑、游泳、象棋與搬家公司比一個總分。數字可以算，結論通常沒什麼用。

## 公開排行榜的七個常見陷阱

### 1. 複合指數一定有價值判斷

將多項評測合併成單一分數，就必須決定權重。Agent 34% 對企業自動化合理，對中文創作或純數學研究未必合理。

### 2. 模型分數經常是系統分數

Coding 與 Agent Benchmark 會同時受到 Harness、Prompt、工具、回合限制、重試與 Context 管理影響。

### 3. 靜態資料集會老化

題目可能進入訓練資料，模型也會逐漸把既有評測磨到飽和。Benchmark 必須有版本、日期與污染治理。

### 4. LLM Judge 也有自己的偏好

篇幅、格式、引用與模型家族都可能影響評分。可程式驗證的任務，應優先使用測試與後端狀態檢查。

### 5. 平均值會吃掉長尾風險

平均延遲不代表每次都快。生產環境至少要看 P50、P95、P99、Timeout、Retry 與 Rate Limit。

### 6. Context Window 不等於長文能力

API 接受一百萬 token，不代表模型能可靠召回遠端資訊、整合證據並維持多輪指令一致性。

### 7. 名稱沒變，行為也可能已經變了

安全策略、System Prompt、推論硬體、路由、量化與快取都可能在服務端更新，所以私有評估必須能重跑。

更準確地說，一個 Benchmark 分數其實是：

> **Score = f(Model, Version, Prompt, Effort, Tools, Harness, Budget, Retries, Evaluator)**

## 建立私有評估集：把需求變成能重跑的測試

公開 Benchmark 不知道你的 Repository 結構、中文文風、資料品質、權限政策與可接受風險。

私有 Eval 的目的，是把「大家覺得這模型不錯」變成可以重跑、比較與回歸的工程資產。

起步不需要幾千題。先準備 30 至 100 個真實任務，涵蓋：

- 正常需求；
- 模糊或互相衝突的需求；
- 缺少資料；
- 工具失敗；
- 權限不足；
- 需要人工核准的高風險操作。

最低限度應追蹤：

| 指標 | 用途 | 建議切分 |
| --- | --- | --- |
| Task Success Rate | 任務是否真正完成 | 任務類型、語言、Context 長度 |
| Critical Failure Rate | 不可接受錯誤比例 | 資安、資料、財務、法遵、破壞性操作 |
| Human Intervention Rate | 人工接手與複核成本 | 修正、重跑、完全接管 |
| Cost per Successful Task | 真實經濟成本 | 模型、工具、人工與失敗重試 |
| P50／P95 Completion Time | 一般體驗與長尾風險 | 推論、工具等待與 Queue Time |
| Tool Recovery Rate | 工具失敗後能否恢復 | 重試、替代工具與請求人類 |
| Guardrail Violation Rate | 政策與權限控制 | 讀取、寫入、寄送、付款與刪除 |
| Output Quality | 成果是否可直接交付 | 正確、完整、格式、引用與可讀性 |

每次測試還要固定模型版本、Provider、區域、推理強度、Prompt、Harness、工具政策、Token Budget、最大回合數與重試規則。

否則下次分數變了，你只會知道「有東西變了」，不知道變的是模型、系統還是測試本身。

## 最後的決策不是一名冠軍，而是一套路由

成熟的模型選型，很少會得到「所有任務都用同一個最強模型」這種答案。

比較合理的結果通常是：

- 低風險、大量、格式固定的任務，交給便宜模型；
- 跨模組工程與高風險任務，交給成功率更高的主力模型；
- 文件、簡報或特定語言，交給擅長該輸出的模型；
- 權限、品味、重大風險與最後驗收，保留給人類。

公開排行榜負責找到候選，私有任務決定分工，生產遙測則負責持續修正路由。

到了 2026 年，最值得問的已經不是「哪個模型排行榜最高」，而是：

> **在可接受的成本、延遲、風險與人工介入範圍內，哪套模型系統能最穩定地完成工作？**

這個問題沒有永恆冠軍，但可以有一套持續更新、能被驗證的答案。

---

## 參考資料

- [Artificial Analysis：Intelligence Benchmarking Methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking)
- [Artificial Analysis：Language Model API Performance Benchmarking](https://artificialanalysis.ai/methodology/performance-benchmarking)
- [Artificial Analysis：Intelligence Index v4.1 Announcement](https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-1)
- [Artificial Analysis：General Benchmarking Methodology](https://artificialanalysis.ai/methodology)
- [LMArena：Arena-Rank Methodology](https://lmarena.ai/blog/arena-rank/)
