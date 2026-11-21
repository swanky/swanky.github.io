---
title: "AI Agent 又失敗了，先別改提示詞：問問是執行框架、迴圈，還是工作圖壞了"
seo_title: "Harness、Loop、Graph 是什麼？AI Agent 三層架構、證據強度與失敗診斷表"
date: 2026-11-21
published: true
categories: [technical]
tags: [ai-agent, agentic-engineering, harness-engineering, loop-engineering, graph-engineering, claude-code, codex]
layout: article
cover_image: /assets/img/linkedin/harness-loop-graph-ai-agent-layers.jpg
cover_alt: "插畫：深藍色的工作室裡疊著三層發光裝置，下層是工具牆、檔案櫃與上鎖的圍欄，中層是一條環形軌道、方塊要通過綠色檢查燈才能離開，上層是用光線連起來的節點看板；史旺姬站在右側指著檢查燈，手裡拿著平板。"
hero_image: true
use_glightbox: true
cta_context: agentic
extra_css: |
  .post-content .lg-wrap { overflow-x: auto; margin: 20px 0; border: 1px solid #E6E1D6; border-radius: 12px; background: #fff; }
  .post-content .lg-table { min-width: 640px; width: 100%; border-collapse: collapse; font-size: 0.92em; margin: 0; }
  .post-content .lg-table caption { caption-side: top; text-align: left; color: #5F5B53; font-size: 0.92em; padding: 10px 14px 8px; }
  .post-content .lg-table th { background: #FBF3DC; border-bottom: 3px solid #E5A300; text-align: left; padding: 9px 10px; line-height: 1.3; }
  .post-content .lg-table td { border-bottom: 1px solid #EEE9DD; padding: 8px 10px; vertical-align: top; line-height: 1.45; word-break: keep-all; overflow-wrap: anywhere; }
  .post-content .lg-table tbody tr:nth-child(even) td { background: #FDFAF3; }
  .post-content .lg-h { color: #2E8B57; font-weight: 800; }
  .post-content .lg-l { color: #D0573A; font-weight: 800; }
  .post-content .lg-g { color: #6B4FA0; font-weight: 800; }
  .post-content .lg-check { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 20px 0; }
  .post-content .lg-check section { border: 1px solid #E6E1D6; border-radius: 12px; background: #fff; padding: 14px 16px; border-top: 6px solid var(--c); }
  .post-content .lg-check h3 { margin: 0 0 8px; font-size: 1.05em; color: var(--c); }
  .post-content .lg-check ul { list-style: none; margin: 0; padding: 0; }
  .post-content .lg-check li { padding: 5px 0 5px 1.6em; position: relative; line-height: 1.45; font-size: 0.95em; }
  .post-content .lg-check li::before { content: "☐"; position: absolute; left: 0; color: var(--c); font-weight: 800; }
  .post-content .lg-gloss { border: 1px solid #E6E1D6; border-radius: 12px; background: #FDFAF3; padding: 10px 16px; margin: 18px 0; }
  .post-content .lg-gloss summary { cursor: pointer; font-weight: 800; color: #8A5D00; }
  .post-content .lg-gloss dl { display: grid; grid-template-columns: max-content 1fr; gap: 6px 14px; margin: 12px 0 4px; font-size: 0.95em; }
  .post-content .lg-gloss dt { font-weight: 700; }
  .post-content .lg-gloss dd { margin: 0; color: #4A463F; }
  @media (max-width: 600px) { .post-content .lg-gloss dl { grid-template-columns: 1fr; gap: 2px; } .post-content .lg-gloss dd { margin-bottom: 8px; } }
  @media (max-width: 760px) { .post-content .lg-check { grid-template-columns: 1fr; } }
  @media (max-width: 600px) { .post-content .lg-table caption::after { content: "（表格可以左右滑動）"; display: block; color: #8A5D00; font-weight: 700; margin-top: 4px; } }
related_posts:
  - hermes-plugin-hackathon-top10
  - claude-code-designing-loops
  - scaffolding-thin-harness-agent-architecture
description: "AI Agent 失敗時，多數人改提示詞或換模型。Whitemon 把問題拆成執行框架、迴圈、工作圖三層；我補上證據強度、復原代價與六個實作限定。"
keywords: Harness Engineering, Loop Engineering, Graph Engineering, AI Agent 架構, 執行框架, 迴圈工程, 工作圖, done_when, Karpathy autoresearch, Claude Code /loop, AI Agent 驗證, 史旺基, Swanky Studio
---

Karpathy 在〈How I use LLMs〉裡請 ChatGPT 查 OpenAI 歷年估值、畫圖，再外推到 2030 年。ChatGPT 回他：大約 1.7 兆美元。

他覺得不對勁：圖上 2030 年那一格標的數字，跟這個說法對不起來。他要求「把這個變數直接印出來」。印出來的結果，對應的是大約 20 兆。同一段示範裡，表格寫明 2015 年估值未知，程式卻自己填了 0.1，沒有告訴他。他的評語是：「有點鬼祟。」[[9]](https://www.youtube.com/watch?v=EWvNQjAaOHw&t=3954s)

模型沒有存心說謊。問題在於，整個流程裡沒有任何一步要求它拿出證據，它說完成，大家就當它完成了。

Whitemon 這篇長文講的就是這件事。[[1]](https://x.com/0xWhitemon/status/2119430401701621865) Agent 失敗了，你改提示詞；又失敗，你換模型；第三次，你在提示詞裡加上全大寫的 IMPORTANT。他說問題幾乎從來不在提示詞，多數時候也不在模型，而在模型外面那套系統。他把那套系統拆成三層：**執行框架（Harness）、迴圈（Loop）、工作圖（Graph）**。

原文給了一個好用的順序：先修環境，再修回饋，最後才修流程。**我的判斷是：順序只是起點，真正難的是出口和關卡要設多嚴，而那取決於這件事做錯了收不收得回來，不是模型多有把握。** 原文是寫給人收藏的整理，有幾處講得比現實乾淨。我拿 Karpathy 自己的 autoresearch 專案當迴圈實例逐格對照，也補上我研究這篇時整理的六個限定。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>三層各管一件事</strong>：執行框架管「它能不能動手」，迴圈管「結果是不是真的」，工作圖管「接下來輪到誰」。修錯層，就會在一層好好的地方除錯一整週。</li>
    <li><strong>迴圈要靠證據轉，不靠自信轉</strong>：「Agent 說做完了」不是停止條件，測試通過才是。一個檢查有多可靠，看它願意接受的最弱證據。</li>
    <li><strong>每一圈都要有出口</strong>：通過就停、同一結果出現兩次就升級交給人、預算用完就停。沒有出口的迴圈不是堅持，是漏錢。</li>
    <li><strong>人要放在收不回來的地方</strong>：依「復原代價」設關卡，不看模型有多有把握。</li>
    <li><strong>原文沒說透的</strong>：測試綠了不代表規格都對、換一個上下文不代表盲點不同、worktree 不是權限沙盒、自動檢查本身也要防止被改。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part"><span class="article-toc-part-title">三層是什麼</span><ol class="article-toc-items">
      <li><a href="#layers">三個詞，三種不同的失敗</a></li>
      <li><a href="#harness">執行框架：把模型拿掉，剩下的都是</a></li>
      <li><a href="#loop">迴圈：靠證據轉，每一圈都要有出口</a></li>
      <li><a href="#graph">工作圖：只畫真的相依的箭頭</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">拿來用</span><ol class="article-toc-items">
      <li><a href="#human">人該放在哪裡</a></li>
      <li><a href="#diagnose">到底是哪一層壞了</a></li>
      <li><a href="#caveats">原文沒說透的六個限定</a></li>
      <li><a href="#checklist">開工前的檢查清單</a></li>
    </ol></li>
  </ol>
</nav>

<details class="lg-gloss">
  <summary>先看名詞小抄（點開）</summary>
  <dl>
    <dt>Agent（AI 代理）</dt><dd>會自己呼叫工具、改檔案、跑指令，一步步把任務做完的 AI。</dd>
    <dt>上下文（context）</dt><dd>模型這一刻「看得到」的全部資訊，有容量上限。</dd>
    <dt>repo（程式庫）</dt><dd>一個專案的全部程式碼與修改紀錄。</dd>
    <dt>PR（Pull Request，合併請求）</dt><dd>把一批修改送給別人審查，通過後才併進正式版本。</dd>
    <dt>CI（Continuous Integration，持續整合）</dt><dd>每次有人送出修改，就自動跑測試與檢查的系統。</dd>
    <dt>lint</dt><dd>自動檢查程式寫法有沒有違反規則的工具。</dd>
    <dt>綠燈／紅燈</dt><dd>測試或檢查通過／沒通過。</dd>
    <dt>結束碼為 0</dt><dd>程式跑完回報「成功」的訊號。這是機器給的，不靠誰說。</dd>
    <dt>worktree</dt><dd>同一個 repo 另外開出的一份工作資料夾，讓兩件事分開改。</dd>
    <dt>沙盒（sandbox）</dt><dd>限制程式能碰哪些檔案、網路、帳號的隔離環境。</dd>
    <dt>資料庫遷移（migration）</dt><dd>改動正式資料庫結構的腳本，跑下去通常很難收回。</dd>
    <dt>副作用</dt><dd>除了回傳結果之外，真的改到外面世界的事，例如寄出一封信、扣了一筆錢。</dd>
  </dl>
</details>

## 三個詞，三種不同的失敗 {#layers}

這是原文。以下不是翻譯，是我依它的架構重新整理，加上我自己的判斷與補充。圖全部依原文內容重畫。

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center"><p>Harness, Loop, Graph: The 3 Layers That Decide If Your AI Agent Works</p>&mdash; Whitemon (@0xWhitemon) <a href="https://twitter.com/0xWhitemon/status/2119430401701621865">2026 年 11 月 8 日</a></blockquote>

原文的切入點是 Karpathy 去年底的一則貼文。他說自己從沒覺得作為程式設計師這麼落後，因為多出了一整層要學的新東西：agents、subagents、提示詞、上下文、記憶、模式、權限、工具、插件、skills、hooks、MCP……[[2]](https://x.com/karpathy/status/2004607146781278521)

Whitemon 的觀察是：這串清單不是一件事，是三層混在同一句話裡。拆開之後，「AI Agent 不可靠」就不再是謎，而是一般的工程問題。

<figure>
  <a href="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/three-layers.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="harness-loop-graph" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/three-layers-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/three-layers.svg' | relative_url }}" alt="三層架構圖：執行框架管環境，問它能不能動手；迴圈管證據，問結果是不是真的；工作圖管流程，問接下來輪到誰。依序問，第一個答案是否的那一層就是該修的地方" width="840" height="416"></picture>
  </a>
  <figcaption>自製圖解，依原文三層定義重畫。<a href="https://x.com/0xWhitemon/status/2119430401701621865">[1]</a></figcaption>
</figure>

原文的一句話版本是：**先環境，再回饋，最後才是流程。** 順序很重要，因為下層的問題會蓋住上層的問題。Agent 連正式環境的紀錄都讀不到，你再怎麼設計檢查也沒用；檢查本身不可信，你把工作拆成再多節點也只是平行地出錯。

## 執行框架：把模型拿掉，剩下的都是 {#harness}

原文給的定義我很喜歡：**把模型從你的架構圖拿掉，圖上還留著的東西，就是執行框架。** 工具、記憶、權限、測試、瀏覽器、專案說明，全部算。

同一個模型，放在聊天框裡只能回答問題；放進一個有終端機、測試、瀏覽器、專案記憶和權限的 repo，就能交付功能。模型權重沒變，變的是執行框架。

OpenAI 的〈Harness engineering〉是很好的例子。他們用 Codex 做一個產品，手寫程式碼為零。早期進度很慢，原因不是模型不夠強，而是環境沒有交代清楚。他們沒有叫 agent「再努力一點」，而是問「缺的是哪一種能力」，再把那個能力做成 agent 看得到、也必須遵守的東西。[[3]](https://openai.com/index/harness-engineering/) Terraform 與 Ghostty 的作者 Mitchell Hashimoto 也說過，通用的 agent 執行框架（例如 Codex、Claude）加上命令列工具與 MCP（讓 AI 接上外部工具的標準介面），勝過他用過的每一個產品內建聊天框。[[4]](https://x.com/mitchellh/status/2077788454860316915) Anthropic 4 月推出的 Claude Managed Agents，更直接把「調校過的執行框架＋正式環境基礎設施」包成產品賣。[[5]](https://x.com/claudeai/status/2041927687460024721)

<figure>
  <a href="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/harness-six.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="harness-loop-graph" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/harness-six-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/harness-six.svg' | relative_url }}" alt="執行框架的六個部分：任務契約、導覽地圖、工具、記憶、圍牆、執行軌跡。下方標示執行順序：模型提議，模型以外的規則檢查，工具才執行；模型不能自己核准自己造成的後果" width="840" height="456"></picture>
  </a>
  <figcaption>自製圖解，依原文「真正的執行框架由什麼組成」重畫。<a href="https://x.com/0xWhitemon/status/2119430401701621865">[1]</a></figcaption>
</figure>

六個部分，原文每一個都給了具體例子。

**任務契約。** 動手前，把要求改寫成一個有終點的東西：

```text
目標      修好登入後被導來導去的無限迴圈（#482）
輸入      問題單、程式庫、錯誤紀錄
產出      一個可以審查的 PR
限制      不改資料庫結構，只動 auth/ 資料夾
完成條件  新寫的測試能重現這個 bug
          修完後，同一個測試通過
          整套測試全部通過
```

最重要的是最後一欄 `done_when`（完成條件）。沒有它，agent 會悄悄把任務換成一個比較簡單的版本，解完再告訴你做好了。

**導覽地圖。** 不要把所有文件塞進上下文。給它一份很短的根目錄說明（例如 `AGENTS.md`），只寫「架構看哪份、測試看哪份、安全規範看哪份」，需要時再去讀。原文說，上下文不是倉庫，是注意力預算；一本厚手冊會在 agent 寫下第一行之前，就把預算吃光。

**工具。** 每多一個工具，模型就多一種選錯的方式，所以十個用途專一的工具，勝過四十個功能重疊的。每個工具都要有清楚的輸入、可以預期的輸出、明確的失敗狀態，和一個權限等級：讀檔可以、在沙盒裡跑測試可以、只能在工作區寫檔、網路依任務開放，部署和刪資料要人核准。

**記憶。** 上下文是記憶體，執行框架是硬碟。決策、走不通的路、還沒解的風險，寫進檔案和修改紀錄，不要留在對話裡。原文的例子是一份 `PROGRESS.md`：目標、試過什麼（調整登入檢查的順序，還是紅燈）、已知什麼（只在登入過期時發生）、下一步看哪個檔、絕對不碰哪些地方。agent 當掉、上下文被清空、或換人接手時，接手的是工作的實際狀態，不是一段模糊的對話摘要。

**圍牆。** 「請不要動資料庫遷移檔」是一個願望；agent 根本沒有那個權限，才是一道牆。模型可以提議，但要不要執行，由模型以外的規則（policy）決定。原文有一句我會直接抄進自己的規範：不要讓同一個系統既想出計畫、又核准風險、又執行後果。

**執行軌跡。** 每次執行都要留下讀得懂的紀錄：載入了什麼、呼叫了哪些工具、改了什麼、跑了哪些測試、重試幾次、花了多少錢。沒有軌跡，失敗是一個謎；有了軌跡，失敗就是下一次修正的材料。

這一點，跟我前一篇寫的 Hermes 插件黑客松是同一件事。那屆前段班贏在把「請 AI 記得」換成「AI 忘了也照樣會執行的關口」。（延伸閱讀：<a href="{{ '/technical/hermes-plugin-hackathon-top10/' | relative_url }}">Hermes 插件黑客松前 10 名</a>） Claude Code 的官方最佳實踐也這樣分：有些事絕對不能發生、有些步驟一定要做，「光靠提示詞保證不了這兩種事」，要改用強制執行的規則。[[6]](https://code.claude.com/docs/en/best-practices)

### 重要規則寫兩次

原文最實用的一招叫「寫兩次」：每一條重要規則，一次寫成 agent 看得懂的說明，一次寫成它繞不過去的檢查。

```text
說明（寫在 AGENTS.md，給 agent 讀）
  介面程式不可以直接查資料庫

檢查（放在 CI，agent 沒辦法跟它爭）
  src/ui/** 只要 import 了 src/db/**，lint 就失敗
```

說明負責講理由，檢查負責在模型忽略說明的那一天照樣擋住。時間一久，過去的事故會變成基礎設施，下一個 agent 不必記得那次事故，因為執行框架替它記得。

我自己的網站也這樣做：給 agent 的規範寫「某個資料夾是自動產生的副本，不要手改」，同時每次跑測試都會比對副本和正本，有人手改就失敗。前者給 agent 理由，後者在它忘記的時候擋住。

### 下一個會壞的地方

執行框架做好之後，agent 可以自己工作一小時。然後它回你：「修好了！現在測試應該都會過。」注意那個「應該」。執行框架讓它有能力，但系統裡還沒有任何東西讓它正確。

## 迴圈：靠證據轉，每一圈都要有出口 {#loop}

每個 agent 本來就有一個小迴圈：呼叫模型、執行工具、把結果餵回去、再來一次。原文說，**迴圈工程從你刻意設計這個循環開始**：不是「再問一次」、不是「重試」，而是一套有目標、有證據、有辦法停下來的工作與回饋系統。

這件事普及得很快。Claude Code 在 3 月推出 `/loop`，可以排程最長 3 天的重複任務，例如「看管我所有的 PR，自動修建置錯誤」。[[7]](https://x.com/bcherny/status/2030193932404150413) Claude Code 作者 Boris Cherny 在 6 月分享讓 agent 自主跑好幾個小時的五個技巧，第五個是：確保它有辦法從頭到尾自己驗證成果。[[8]](https://x.com/bcherny/status/2063792263067754658)

<figure>
  <a href="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/loop-anatomy.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="harness-loop-graph" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/loop-anatomy-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/loop-anatomy.svg' | relative_url }}" alt="迴圈圖：產出、檢查、回饋、修正四步繞著目標與完成條件轉。三個出口：測試通過就完成；同一結果出現兩次就升級處理；重試或額度用完就停" width="840" height="476"></picture>
  </a>
  <figcaption>自製圖解，依原文「迴圈的組成」重畫。<a href="https://x.com/0xWhitemon/status/2119430401701621865">[1]</a></figcaption>
</figure>

原文把一個設計過的迴圈拆成七格。右欄先放 Karpathy 的 autoresearch 對照，後面會細談。

<div class="lg-wrap">
<table class="lg-table">
  <caption>迴圈的七格（依原文），右欄為 autoresearch 的對應做法。<a href="https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md">[11]</a></caption>
  <thead><tr><th scope="col">格子</th><th scope="col">要回答什麼</th><th scope="col">autoresearch 怎麼填</th></tr></thead>
  <tbody>
    <tr><td>觸發 Trigger</td><td>什麼會開始一輪：測試失敗、新問題單、排程</td><td>人說一次「開始實驗」，之後每輪跑完自動開下一輪</td></tr>
    <tr><td>目標 Goal</td><td>確切的達成條件，不是「持續改善」</td><td>固定 5 分鐘訓練內，<code>val_bpb</code>（驗證資料上的誤差分數）越低越好</td></tr>
    <tr><td>狀態 State</td><td>下一輪需要知道什麼</td><td>只留下改善過的修改紀錄，加一份記下每輪結果的表</td></tr>
    <tr><td>行動 Action</td><td>agent 被允許做什麼</td><td>只能改 <code>train.py</code>；評分程式不可以改（寫在說明裡）</td></tr>
    <tr><td>證據 Evidence</td><td>怎麼知道這次真的有效</td><td>從訓練紀錄直接抓分數，機器判定</td></tr>
    <tr><td>回饋 Feedback</td><td>到底哪裡失敗</td><td>分數與記憶體用量；當掉時讀紀錄最後 50 行</td></tr>
    <tr><td>停止 Stop</td><td>無論如何，什麼時候一定要停</td><td>單輪：超過 10 分鐘當失敗並還原。整體：沒有，跑到人打斷為止</td></tr>
  </tbody>
</table>
</div>

### 證據有強弱

迴圈工程最重要的規則只有一句：**不要靠自信轉圈，要靠證據轉。**

<figure>
  <a href="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/evidence-strength.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="harness-loop-graph" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/evidence-strength-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/evidence-strength.svg' | relative_url }}" alt="證據強度由強到弱：機器判定，例如測試結束碼為 0；可觀察，例如執行軌跡顯示真的跑了測試；獨立，例如另一個上下文的審查者；自我回報，例如看起來沒問題。迴圈只要接受最後一種，就是自我回報迴圈" width="840" height="440"></picture>
  </a>
  <figcaption>自製圖解，依原文「不同證據的強度不相同」重畫。長條只表示排序，不是分數。<a href="https://x.com/0xWhitemon/status/2119430401701621865">[1]</a></figcaption>
</figure>

回到開頭 Karpathy 的例子。ChatGPT 說「大約 1.7 兆」，是自我回報；他要求把變數直接印出來，等於把證據拉到「機器判定」那一列。他在影片裡也先明確要求 ChatGPT 用搜尋，因為他「不想要它用幻覺生出資料」。[[9]](https://www.youtube.com/watch?v=EWvNQjAaOHw&t=3906s) 那不是什麼高深技巧，就是不接受最弱的證據。

原文接著給了兩個做法：

- **先寫檢查，再寫程式。** 動手前寫下「綠燈長什麼樣子」，而且要包含一個在現在的程式上會失敗的測試。修之前就會過的測試，什麼也證明不了。寫不出檢查，代表你還沒搞懂任務；寫檢查，就是在寫規格。
- **給回饋，不要給判決。** 「紅燈」是判決，對 agent 幾乎沒有資訊。好的回饋長這樣：

```text
失敗的測試  test_expired_session_redirect
預期        導向 /login
實際        導向 /dashboard（auth/refresh.py 第 61 行）
範圍        只能改 auth/refresh.py
走不通的路  調整登入檢查的順序
```

「預期 vs 實際」把一盞紅燈變成方向；「走不通的路」能防止第三次嘗試悄悄變回第一次嘗試。

### 出口

**沒有出口的迴圈不是堅持，是漏錢。** 三個出口裡，中間那個最重要：同一個結果出現兩次，代表 agent 已經學不到東西，再試也沒用，該升級交給人。缺的是它看不到的資訊，或者問題本身問錯了。迴圈能修正成果，修不了問題。

### 一個真的在跑的迴圈：Karpathy 的 autoresearch

Karpathy 3 月開源的 autoresearch，是我看過把迴圈寫得最清楚的例子。[[10]](https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/README.md) 它讓 agent 整晚自己改一份訓練程式，每輪固定訓練 5 分鐘，看分數有沒有變好，變好就留、沒變好就用 `git reset` 退回原點，再來一輪。

對照上面那張七格表，它的證據和單輪出口做得很紮實：分數由機器判定，不問 agent 覺得怎麼樣；每一輪都寫進結果表，連當掉的也記。但有三格是空的，或只寫了一次：

- **整體沒有出口。** 沒有預算上限，也沒有「同一結果出現兩次就停」。`program.md` 寫著「永遠不要停」，不要問人要不要繼續；點子用完了，就「更努力想」。整個大迴圈唯一的出口，是人打斷。[[11]](https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md)
- **圍牆只寫了說明。** 「只能改 `train.py`、評分程式不可以改」寫在說明裡；README 則建議你把 Claude 或 Codex 的權限確認全部關掉再開跑，也就是 agent 在你的機器上做什麼都不會先問。用原文的話說，這條規則只寫了一次。
- **品味只寫了說明。** 說明裡有一條「越簡單越好」：分數只進步 0.001 卻多了 20 行難看的程式，就不值得留。但證據只量分數，沒有任何檢查會擋下難看的程式，全靠 agent 自己判斷。

這不是在挑它毛病。它跑在單一 GPU、只改一個檔的研究環境，出錯的代價主要是一整晚的實驗白跑，加上一台權限全開的機器。這樣的取捨在那個環境裡說得通。我想說的是：**出口和圍牆要設多嚴，取決於這個迴圈出錯時收不收得回來。** 同一句「永遠不要停」，搬到會寄信、會改正式資料的工作上，就是事故。README 也自己提醒，結果只在同一個運算平台上才能互相比較。

## 工作圖：只畫真的相依的箭頭 {#graph}

每一步都做得很好了。但真實的任務從來不只一步。原文的例子是：修一個 bug、檢查帳務和管理後台是不是用了同一個共用函式、更新文件。

一個 agent 在同一個上下文裡依序做完全部。第二份稽核讀了第一份的筆記，就照著重複一遍。整件事又慢、又是單線，而且只有一種觀點，最後還是同一個 agent 給自己打分數。這時調整迴圈沒有用，因為問題不在任何一步裡面，在步驟之間。

7 月 Peter Steinberger 問了一句「我們還在談迴圈，還是已經改談工作圖了？」，同一天稍晚就有人回「迴圈工程已死，工作圖工程萬歲」，隔天也有人說 agent 正在從 while 迴圈畢業，變成組織圖。[[12]](https://x.com/steipete/status/2078277297791189132)[[13]](https://x.com/svpino/status/2078516761318584774)[[14]](https://x.com/rohit4verse/status/2078776077745623498)

工作圖由三樣東西組成：**節點**是有界限的工作，一個輸入、一個輸出；**邊**是真的相依關係，前一個節點的輸出是後一個的輸入；**狀態**是節點之間留下來的東西。原文有一句很好懂：**迴圈只是一個只有一個節點、箭頭指回自己的工作圖。** 工作圖不取代迴圈，它是好幾個迴圈要互相交接時才需要的東西。

<figure>
  <a href="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/ticket-graph.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="harness-loop-graph" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/ticket-graph-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/ticket-graph.svg' | relative_url }}" alt="工作圖：問題單先界定範圍，再分成修登入驗證、稽核帳務、稽核管理功能、更新文件四件事平行執行，各自有迴圈；結果用一般程式合併，經過依復原代價設定的驗收關卡，最後開 PR" width="840" height="466"></picture>
  </a>
  <figcaption>自製圖解，依原文「把一張任務單改畫成工作圖」重畫。<a href="https://x.com/0xWhitemon/status/2119430401701621865">[1]</a></figcaption>
</figure>

**提早開工檢驗（Early-Start Test）**是判斷箭頭的方法。流程圖裡大部分的箭頭不是真的相依，只是某人剛好想到的順序。每一條箭頭都問：如果 B 在 A 完成前就開始，會壞掉什麼？答案是「不會」，就刪掉那條箭頭，讓它們平行跑。帳務稽核可以在修正完成前開始嗎？可以，所以平行。PR 可以在修正完成前開嗎？不行，所以那條箭頭是真的。

再來是原文的四刀，決定工作圖有沒有幫助：

1. **在會分開出錯的地方切。** 兩個步驟會因為不同原因壞掉，就是兩個節點；總是一起壞，就是一個。
2. **每個工作者都要有自己的上下文。** 四個 agent 共用一個上下文，不是團隊，是一個 agent 戴四頂帽子。第一個寫下的意見，會變成所有人的意見。Rohit 的說法很直接：迴圈工程最大的缺口，是同一個 agent 做事又自己打分數。[[15]](https://x.com/rohit4verse/status/2079945989511905549)
3. **答案永遠不該變的，就寫成程式。** 合併、排序、去除重複、計數，都是一般函式。只有「換一個答案也可能對」的地方才用模型。
4. **凍結已經通過的節點。** 一個節點過了關卡，輸出就唯讀。某處失敗，只重跑那一個節點，帶著它的回饋。重跑好好的工作，只是多給它一次壞掉的機會。

最後原文自己踩了煞車：**大部分任務不需要工作圖。** 五個節點如果能收回成一個迴圈而不失去什麼，就收回去。LangGraph、Google ADK 很早就在做節點、邊、共享狀態，名字是新的，但不要在工作還沒逼你之前就去畫它。

## 人該放在哪裡 {#human}

在最原始的狀態，你就是整個系統：你的手跑程式、眼睛看結果、腦袋決定下一步，模型是唯一不做苦工的部分。

目標不是一個永遠不需要你的 agent。原文說：**你是工作圖裡最慢、最貴的節點，所以只把自己放在錯了收不回來的地方。** 關卡要依「復原代價」設，不依模型的信心。

<figure>
  <a href="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/undo-gate.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="harness-loop-graph" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/undo-gate-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/harness-loop-graph-ai-agent-layers/undo-gate.svg' | relative_url }}" alt="依復原代價分三級：一鍵就能復原的文件、測試、單一函式，綠燈就放行；要花工夫收拾的共用函式、登入驗證、資料結構，要綠燈、執行軌跡加第二意見；收不回來的資料庫遷移、刪除、寄信、動到錢，一定要人簽名" width="840" height="396"></picture>
  </a>
  <figcaption>自製圖解，依原文的三級關卡重畫。<a href="https://x.com/0xWhitemon/status/2119430401701621865">[1]</a></figcaption>
</figure>

最後一級沒有分數。不是 0.95，也不是 0.99。沒有數字讓模型去拚，它就沒有東西可以爭。我認同這個設計：信心分數是模型自己報的，拿它當門檻，就又回到證據強度圖最下面那一列「自我回報」。

## 到底是哪一層壞了 {#diagnose}

改任何東西之前，從這張表的最上面往下找，**第一個符合的症狀，就是你下一個該修的地方**，不是它後面那一項。執行框架的問題會蓋住迴圈的問題，迴圈的問題又會蓋住工作圖的問題。

<div class="lg-wrap">
<table class="lg-table">
  <caption>依原文診斷表整理，由上往下找第一個符合的症狀。</caption>
  <thead><tr><th scope="col">症狀</th><th scope="col">該修的層</th><th scope="col">怎麼修</th></tr></thead>
  <tbody>
    <tr><td>你一直在聊天視窗和終端機之間複製貼上</td><td class="lg-h">執行框架</td><td>給它工具</td></tr>
    <tr><td>它重試已經試過的做法</td><td class="lg-h">執行框架</td><td>把記憶存到檔案裡</td></tr>
    <tr><td>你沒親自檢查之前，「完成」沒有意義</td><td class="lg-l">迴圈</td><td>一個真的會失敗的檢查</td></tr>
    <tr><td>重試一直在同一個錯誤上燒預算</td><td class="lg-l">迴圈</td><td>回饋加上出口</td></tr>
    <tr><td>每一步都對，整體卻很慢</td><td class="lg-g">工作圖</td><td>拆成真正獨立的節點</td></tr>
    <tr><td>一處失敗就要全部重跑</td><td class="lg-g">工作圖</td><td>凍結已通過的節點</td></tr>
    <tr><td>同一個錯誤每週都回來</td><td>所有層</td><td>把教訓記到負責的那一層</td></tr>
  </tbody>
</table>
</div>

最後一列是原文最後一個重點：**每次失敗都應該讓系統升級。** 多數人修的是那一次的成果，好團隊修的是那一類失敗，訣竅是把每個教訓歸到負責它的那一層。

<div class="lg-wrap">
<table class="lg-table">
  <caption>依原文「每一次失敗都應該讓系統升級」整理。</caption>
  <thead><tr><th scope="col">這次的失敗</th><th scope="col">教訓變成</th><th scope="col">歸到哪一層</th></tr></thead>
  <tbody>
    <tr><td>看不到正式環境的紀錄</td><td>一個唯讀的看紀錄工具</td><td class="lg-h">執行框架</td></tr>
    <tr><td>重試了上週已經失敗的做法</td><td>「不要再試」清單多一行</td><td class="lg-h">執行框架</td></tr>
    <tr><td>動了不該動的檔案</td><td>拿掉它的那個權限</td><td class="lg-h">執行框架</td></tr>
    <tr><td>說「修好了」卻沒有能重現問題的測試</td><td>CI 裡的必要檢查</td><td class="lg-l">迴圈</td></tr>
    <tr><td>同一個錯誤連續出現 6 次</td><td>「同一結果出現兩次就停」的出口</td><td class="lg-l">迴圈</td></tr>
    <tr><td>兩份稽核做了重疊的事</td><td>界定範圍時的切分規則</td><td class="lg-g">工作圖</td></tr>
    <tr><td>錯字和登入邏輯修改走同一套審查</td><td>依復原代價設的關卡</td><td class="lg-g">工作圖</td></tr>
  </tbody>
</table>
</div>

注意這張表沒有「提示詞」那一列。在提示詞裡寫「小心不要重複工作」是一個希望；在排程器裡寫一條切分規則，才是結構。下一季的模型讀你的提示詞會有不同理解，但測試永遠用同一種方式讀。

## 原文沒說透的六個限定 {#caveats}

原文的框架我同意，但它是寫給人收藏的整理，很多句子講得比現實乾淨。下面六點是我研究這篇時整理的實作限定，有幾點原文其實碰到了，只是沒有展開。

**一、測試通過，不等於整份規格都對了。** 原文已經提醒「修之前就會過的測試，什麼也證明不了」。再往前一步：綠燈只涵蓋實際被檢查的條件，需求漏寫、測試的判斷寫得太鬆，錯誤照樣會過。證據強度圖最上面那一列「機器判定」，前提是檢查本身寫得夠好。所以要問：這個測試能不能重現原本的問題？有沒有覆蓋預期行為？它真的在目前這版程式上跑過嗎？

**二、換一個上下文，不保證盲點就不同。** 原文的建議順序是先測試、再找另一個上下文的審查者、收不回來的交給人，這個順序我同意。但隔開上下文，只能降低審查者直接沿用前一位結論的機會；如果它拿到的是同一個錯誤前提，照樣會犯同一個錯。審查者要對照的是需求和原始證據，不是作者寫的「我做完了」。

**三、凍結通過的節點，是有條件的。** 能保留成果，前提是它依賴的輸入和驗收條件都沒變。上游改了，舊的通過結果可能就不適用。「不重做無關的工作」不等於「永遠不再檢查」。

**四、worktree 不是權限沙盒。** 原文清單把「在沙盒或 worktree 裡執行」寫成同一項，這要分開看。worktree 隔開的是程式變更，網路、帳號憑證、檔案權限一樣都沒少。原文自己說的「圍牆」，要的是模型以外的規則真的限制它能做什麼。

**五、提早開工檢驗，問的是「成果」相依。** 原文說「修正完成前不能開 PR」。如果你的團隊習慣先開草稿 PR 一起討論，這句話讀成「可以送審的成果，依賴修正本身」就好，不是平台禁止你提早建 PR。

**六、自動檢查要能約束 agent，檢查本身也得防止被改。** 如果做事的 agent 可以順手改掉驗收規則、或繞過關卡，「寫兩次」就只剩形式。autoresearch 就是一例：「評分程式不可以改」只寫在說明裡，agent 真要改，沒有東西擋。驗收規則、執行權限、成果內容最好分開管。重試時也要確認不會重複送出有副作用的動作，例如同一封信寄兩次。

前一篇看 Hermes 黑客松作品時，好幾件的作者都在 README 承認同一類限制：關口只管得到經過關口的東西。兩篇可以對照著讀。

## 開工前的檢查清單 {#checklist}

先看原文列的五個常見錯誤，前三個我最想貼在螢幕旁邊：

1. **太早畫工作圖。** 還沒看過 agent 把工作做一次，就先畫出十二個節點。先用執行框架加一個迴圈跑，收集執行軌跡，只把真的值得的部分正式化。
2. **同一個模型自己寫、自己打分數。** 自我審查和原本的工作有同樣的盲點。先用測試，再用另一個上下文的審查者，收不回來的事交給人。
3. **把「一直試」當迴圈。** 那不是迴圈，是一張一直在刷的信用卡。每個迴圈都要有目標、真的證據、重試上限和出口。
4. **把執行框架當雜物抽屜。** 工具越多，選錯的機會越多。好的執行框架不擁擠，而是精準。
5. **怪模型。** 介面壞了、狀態過期、工具說明含糊、沒有出口，換哪個模型都補不回來。修負責那個失敗的那一層。

原文最後的清單，我整理成三欄。好幾項答案是「否」的話，原文說得很重：換一個更聰明的模型救不了你，只會讓失敗更快、更貴。

<div class="lg-check">
  <section style="--c:#2E8B57"><h3>執行框架</h3><ul>
    <li>開跑前就寫好成功條件</li>
    <li>根目錄的說明是一張地圖，不是一本手冊</li>
    <li>每個工具都有清楚的輸入和失敗狀態</li>
    <li>決策存在檔案裡，不在聊天紀錄裡</li>
    <li>在沙盒裡跑（worktree 不算，見限定四）</li>
    <li>每次工具呼叫都有紀錄</li>
  </ul></section>
  <section style="--c:#D0573A"><h3>迴圈</h3><ul>
    <li>寫程式之前先寫好「綠燈」條件</li>
    <li>檢查至少刻意失敗過一次</li>
    <li>回饋寫出預期和實際的差異</li>
    <li>有重試上限和額度上限</li>
    <li>同一結果出現兩次，就升級交給人</li>
  </ul></section>
  <section style="--c:#6B4FA0"><h3>工作圖</h3><ul>
    <li>先試過只用一個迴圈</li>
    <li>每條箭頭都通過提早開工檢驗</li>
    <li>每個工作者有自己的上下文</li>
    <li>通過的節點已凍結（輸入變了要重驗）</li>
    <li>關卡依復原代價設定，不看信心</li>
  </ul></section>
</div>

原文最後把五種「工程」排在一起。如果你已經聽過提示詞工程，這張表可以幫你把新名詞放回熟悉的位置：

<div class="lg-wrap">
<table class="lg-table">
  <caption>依原文「真正的轉變」整理。</caption>
  <thead><tr><th scope="col">名稱</th><th scope="col">它決定什麼</th><th scope="col">管的是</th></tr></thead>
  <tbody>
    <tr><td>提示詞工程（Prompt Engineering）</td><td>告訴模型做什麼</td><td>指令</td></tr>
    <tr><td>上下文工程（Context Engineering）</td><td>決定它看得到什麼</td><td>工作時的視野</td></tr>
    <tr><td>執行框架工程（Harness Engineering）</td><td>建造它採取行動的世界</td><td class="lg-h">環境</td></tr>
    <tr><td>迴圈工程（Loop Engineering）</td><td>要它證明自己的工作</td><td class="lg-l">證據</td></tr>
    <tr><td>工作圖工程（Graph Engineering）</td><td>決定接下來誰做什麼</td><td class="lg-g">協調</td></tr>
  </tbody>
</table>
</div>

模型每一季都會換。你的任務契約、工具、測試、狀態檔和關卡會留下來，而且每一次把失敗歸到對的地方，它們就變得更好一點。

下次你的 agent 說「完成了」，問問是哪一層說的。

## 參考資料

示範與數字皆為各來源自述，本文沒有重跑任何實驗。資料查核日：2026-11-21。

- **[1]** [Whitemon：Harness, Loop, Graph: The 3 Layers That Decide If Your AI Agent Works（X 長文，2026-11-08）](https://x.com/0xWhitemon/status/2119430401701621865)
- **[2]** [Andrej Karpathy：I've never felt this much behind as a programmer（X，2025-12-26）](https://x.com/karpathy/status/2004607146781278521)
- **[3]** [OpenAI：Harness engineering](https://openai.com/index/harness-engineering/)
- **[4]** [Mitchell Hashimoto：通用 agent 執行框架勝過產品內建聊天框（X，2026-07-16）](https://x.com/mitchellh/status/2077788454860316915)
- **[5]** [Claude：Introducing Claude Managed Agents（X，2026-04-08）](https://x.com/claudeai/status/2041927687460024721)
- **[6]** [Claude Code Docs：Best practices](https://code.claude.com/docs/en/best-practices)
- **[7]** [Boris Cherny：Released today: /loop（X，2026-03-07）](https://x.com/bcherny/status/2030193932404150413)
- **[8]** [Boris Cherny：Five tips for running Opus autonomously for hours/days（X，2026-06-08）](https://x.com/bcherny/status/2063792263067754658)
- **[9]** [Andrej Karpathy：How I use LLMs（YouTube，2025-02-27；估值示範約 1:05:00–1:07:50）](https://www.youtube.com/watch?v=EWvNQjAaOHw&t=3954s)
- **[10]** [karpathy/autoresearch：README](https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/README.md)
- **[11]** [karpathy/autoresearch：program.md](https://github.com/karpathy/autoresearch/blob/228791fb499afffb54b46200aca536f79142f117/program.md)
- **[12]** [Peter Steinberger：Are we still talking loops or did we shift to graphs yet?（X，2026-07-18）](https://x.com/steipete/status/2078277297791189132)
- **[13]** [Santiago：Loop Engineering is dead. Long live Graph Engineering!（X，2026-07-18）](https://x.com/svpino/status/2078516761318584774)
- **[14]** [Rohit：Loop engineering was the last unlock（X，2026-07-19）](https://x.com/rohit4verse/status/2078776077745623498)
- **[15]** [Rohit：The biggest gap with loop engineering（X，2026-07-22）](https://x.com/rohit4verse/status/2079945989511905549)

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
