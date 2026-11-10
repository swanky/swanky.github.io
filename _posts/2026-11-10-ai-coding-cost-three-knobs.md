---
title: "AI 寫程式的錢花在哪？先別急著換模型，先看懂帳單"
seo_title: "AI coding 成本怎麼算：Claude Fable 5.2、effort 設定與每件任務成本"
date: 2026-11-10
published: true
categories: [technical]
tags: [claude-code, ai-agent, ai-coding, claude, effort, cost, model-routing, copilot-fusion]
layout: article
cover_image: /assets/img/linkedin/ai-coding-cost-three-knobs.jpg
cover_alt: "黃銅與木頭的工作坊裡，一台巨大的計費錶狂轉、吐出長長的收據；史旺姬被收據纏住腳，拚命把閃電旋鈕往回轉；短髮女孩冷靜地拿放大鏡看收據，手上拿著綠色打勾印章；計費錶上一隻戴眼鏡的小書蟲一直重讀同一本書，每翻一頁就掉出一枚金幣"
hero_image: true
use_glightbox: true
cta_context: agentic
related_posts:
  - artificial-analysis-llm-evaluation-2026
  - grok-bot-model-routing
  - ai-coding-tool-selection-2026
description: "同一個模型只改 effort，花費可以差三倍多。從 Claude 新模型、官方選模指南和開發者實測，看 AI 寫程式的錢花在哪、怎麼量。"
keywords: AI coding 成本, Claude Fable 5.2, Claude Opus 5.5, effort, 推理強度, prompt caching, 快取, Claude Code, Copilot Fusion, 模型路由, 史旺基, Swanky Studio
---

有位開發者拿同一個 prompt，丟給同一個模型 Claude Fable 5.2，只改了一個設定：effort，也就是讓模型想多久的推理強度。設在 high，花了 24.31 美元；拉到 max，花了 87.99 美元。[[5]](https://x.com/0xRhinoX/status/2119915121698840587)

同一天，Anthropic 發表 Fable 5.2 時說，在一項程式測試裡，Fable 5.2 開 high，分數和 Opus 5.5 開到 max 差不多，每件任務的成本卻只要一半左右。[[1]](https://www.anthropic.com/claude-fable-and-mythos-5-2)

兩件事都是真的。差別在於你算的是哪一題、開的是哪一檔。所以「哪個模型比較便宜」這個問題，本身就問錯了。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>牌價只是起點</strong>：同一個模型，換一檔 effort、換一種任務，每題成本可以差好幾倍。別人量出來的每題成本，都不能直接套到你身上。</li>
    <li><strong>錢大多花在「讀」</strong>：實測裡 94% 的帳單是讀取和快取；長時間工作時，98% 的 token 是模型在重讀自己的對話。</li>
    <li><strong>官方建議的順序是：先驗證，再調 effort，最後才換模型</strong>。最便宜的一步，是讓它能檢查自己的成果。</li>
    <li><strong>多模型、自動路由不一定比較省</strong>：換模型要重付快取，路由規則也常常看不到。</li>
    <li><strong>用 API 和用訂閱，是兩本帳</strong>：前者算每件任務的錢，後者算每週能做完多少事。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">帳單長什麼樣</span>
      <ol class="article-toc-items">
        <li><a href="#price">牌價只是起點，同一題可以差好幾倍</a></li>
        <li><a href="#reading">錢大多花在「讀」</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">能調的地方</span>
      <ol class="article-toc-items">
        <li><a href="#knobs">先驗證，再調 effort，最後才換模型</a></li>
        <li><a href="#switching">換模型本身也要錢</a></li>
        <li><a href="#routing">讓系統替你挑模型，不一定比較省</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">怎麼算你自己的帳</span>
      <ol class="article-toc-items">
        <li><a href="#two-ledgers">用 API 和用訂閱，是兩本帳</a></li>
        <li><a href="#measure">自己量一次：三題、兩個模型、兩檔 effort</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 牌價只是起點，同一題可以差好幾倍 {#price}

先看牌價。Anthropic 11 月 9 日發表的 Fable 5.2，每百萬 token 輸入 8 美元、輸出 40 美元，[[1]](https://www.anthropic.com/claude-fable-and-mythos-5-2) 剛好是 Opus 5.5（4 美元、20 美元）的兩倍。[[2]](https://claude.dev/blog/which-claude-model-should-you-build-with/)

照牌價看，Fable 一定比較貴。可是 Anthropic 自己的數字說，在 FrontierCode 2.0 這項測試裡（看模型改的程式會不會被開源專案的維護者合併），Fable 5.2 開 high 拿 45.3%，Opus 5.5 開到最高拿 45.5%，Fable 每件任務的成本大約只有一半。[[1]](https://www.anthropic.com/claude-fable-and-mythos-5-2) 原因是比較強的模型，常常用比較少的步驟就把事情做完。

開發者在 X 上貼出來的結果，方向卻不太一樣：

- 有人拿同一個火箭發射場景測兩個模型，Fable 5.2 花 23.45 美元、32 分鐘；Opus 5.5 花 10.35 美元、24 分鐘。他覺得 Fable 細節比較好，但效率不如預期。[[6]](https://x.com/Bhavani_00007/status/2119902204320780676)
- 開發者 Theo 跑了一次 Fable 5.2，76 分鐘、大約 42 美元，結果是他看過最好的之一，但「沒有比 Opus 5.5 好到哪裡去，尤其以價格來看」。[[7]](https://x.com/theo/status/2119926277801144695)
- 最開頭那位只改 effort 的開發者，high 到 max，花費約 3.6 倍、時間約 3.2 倍。他說 high 那版漏畫了一道極光。[[5]](https://x.com/0xRhinoX/status/2119915121698840587)

<figure>
  <a href="{{ '/assets/img/technical/ai-coding-cost-three-knobs/effort-same-prompt.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="ai-coding-cost" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/ai-coding-cost-three-knobs/effort-same-prompt-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/ai-coding-cost-three-knobs/effort-same-prompt.svg' | relative_url }}" alt="同一個 prompt、同一個 Fable 5.2，只改 effort：high 花 24.31 美元，高一級花 43.79 美元，max 花 87.99 美元，從 high 到 max 花費約 3.6 倍" width="1200" height="638" loading="lazy"></picture>
  </a>
  <figcaption>只改一個設定，花費就差三倍多。一位開發者的單次實驗，不代表平均。來源：<a href="https://x.com/0xRhinoX/status/2119915121698840587">[5]</a></figcaption>
</figure>

第三方的排名也只回答了一半。Artificial Analysis 的綜合指數，Fable 5.2 開 max 拿 65 分，Opus 5.5 開 max 拿 59 分，排第一；[[8]](https://x.com/ArtificialAnlys/status/2119878995386982508) Zapier 用自家自動化流程測試，Fable 5.2 開 max 拿 51.4%，比之前最好的 Sonnet 5.5（44.6%）高。[[9]](https://x.com/wadefoster/status/2119874501747814409) 分數告訴你它比較強，沒告訴你在你的工作上划不划算。

所以我的判斷是：**別人量出來的每題成本，看方向就好，別直接套用。**同一個模型，會因為 effort 檔位、任務類型、要不要一直呼叫工具，花費差好幾倍。能決定你帳單的，只有你自己的任務。

## 錢大多花在「讀」 {#reading}

大家直覺會以為，AI 寫程式最貴的是「寫」。輸出的單價確實最高。但帳單不是這樣算的。

AI by Aakash 的作者 Aakash Gupta 讓 Opus 5.5 在一個大型 Java 程式庫回答 4 個問題，拆開帳單一看：**94% 花在讀**，其中寫入快取占 85%、讀取快取占 9%，輸出只占 6%。[[10]](https://www.aibyaakash.com/p/spotifys-90-trick)

這裡的快取（prompt cache）是指：模型把已經讀過的內容暫存起來，下一輪不用從頭付全價。寫入快取比一般輸入貴，讀取快取很便宜。問題是每次內容變了，就要重新寫入。

另一位開發者貼出他兩週內 148 次 Opus 5.5 長時間工作的統計：中位數一次 3.8 小時、167 輪、6,040 萬 token，**其中 98% 是模型在重讀自己的對話內容**。[[11]](https://x.com/DrFreeman666/status/2119876371325620629)

<figure>
  <a href="{{ '/assets/img/technical/ai-coding-cost-three-knobs/where-money-goes.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="ai-coding-cost" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/ai-coding-cost-three-knobs/where-money-goes-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/ai-coding-cost-three-knobs/where-money-goes.svg' | relative_url }}" alt="帳單金額裡，寫入快取占 85%、讀取快取 9%、輸出只占 6%，讀的部分合計 94%；另一位開發者的長時間工作裡，98% 的 token 是模型在重讀自己的對話內容" width="1200" height="680" loading="lazy"></picture>
  </a>
  <figcaption>寫出來的字單價最貴，但花最多錢的是讀。上下兩條口徑不同：上面算金額，下面算 token 數。來源：<a href="https://www.aibyaakash.com/p/spotifys-90-trick">[10]</a>、<a href="https://x.com/DrFreeman666/status/2119876371325620629">[11]</a></figcaption>
</figure>

讀的錢裡，還有一部分是漏掉的：

- 有團隊統計自家 coding agent 的流量，寫入快取只占 prompt token 的 6.6%，卻占了大約 18% 的帳單。[[12]](https://x.com/aplomb2/status/2119477127116714467)
- 有人在 Claude Code 裡抓到，剛用完快取 30 秒，又把 78 萬多個 token 整段重寫一次快取。他說 Anthropic 已經確認這是 bug。[[13]](https://x.com/Alex_Vainshtein/status/2119339291507593400)

既然錢花在讀，那叫便宜模型去讀，不就省了？Spotify 做了一個外掛，攔下 Claude 整份讀大檔的動作，改由便宜模型讀完、只回傳摘要。Aakash 實測，在強迫整檔讀取的情況下，確實省了 76% 到 87%。可是在一般的 Claude Code 裡幾乎沒得省，叫它用便宜模型讀，反而多花 19% 到 36%，因為 Claude Code 本來就會先搜尋、只讀需要的那幾行。[[10]](https://www.aibyaakash.com/p/spotifys-90-trick)

我會再加一個條件：審查程式碼這種工作，需要的正是逐行的原始內容。把讀檔交給便宜模型、只拿回摘要，省下的錢，可能剛好是審查最需要的證據。

## 先驗證，再調 effort，最後才換模型 {#knobs}

那能調的地方在哪？Anthropic 同一天發了一篇選模型的指南，作者是在 Anthropic 做 Claude Code 的 Addy Osmani。他建議預設先用 Opus 5.5 加 medium，做得不夠好時，照這個順序調：[[2]](https://claude.dev/blog/which-claude-model-should-you-build-with/)

<figure>
  <a href="{{ '/assets/img/technical/ai-coding-cost-three-knobs/three-knobs-order.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="ai-coding-cost" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/ai-coding-cost-three-knobs/three-knobs-order-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/ai-coding-cost-three-knobs/three-knobs-order.svg' | relative_url }}" alt="調整順序：先讓模型能檢查自己的成果，再把 effort 調高一級，最後才換大一號的模型；官方測試裡，全部用 high 跑通過 95.3%、每題 0.29 美元，先用 low 跑、失敗再用 high 重跑，通過約 97%、每題約 0.17 美元" width="1200" height="704" loading="lazy"></picture>
  </a>
  <figcaption>最便宜的一步排在最前面。下方數字是 Anthropic 在自家程式題子集的測試。來源：<a href="https://claude.dev/blog/which-claude-model-should-you-build-with/">[2]</a></figcaption>
</figure>

1. **讓它能檢查自己的成果。**給它跑測試、建置、實際呼叫一次服務的方法。這一步不花模型的錢，卻最常被跳過。
2. **effort 調高一級。**effort 不會讓模型知道它本來不知道的事，那要換模型；但會讓它想久一點、檢查多一點。
3. **換大一號的模型，從比原本低的 effort 開始。**大模型常常不用想那麼久就做得到。

effort 每一檔差多少，官方也給了數字：在 SWE-bench Pro 這項測試裡，Opus 5.5 從 high 降到 medium，分數少大約 2.5 分，成本變成約 70%；降到 low，少大約 8 分，成本約三分之一；往上開到 xhigh，只多 1.4 分，成本卻是 2.5 倍。[[2]](https://claude.dev/blog/which-claude-model-should-you-build-with/)

最值得學的是一個組合技：**先全部用 low 跑，只把失敗的用 high 重跑。**官方測出來的通過率約 97%、每題約 0.17 美元；全部直接用 high，反而是 95.3%、每題 0.29 美元。[[2]](https://claude.dev/blog/which-claude-model-should-you-build-with/)

這招有兩個前提，指南裡寫得比較輕，我覺得要講清楚：

- **要能自動判斷對錯。**有測試可以跑的程式題可以；寫文件、做設計、判斷架構，沒有自動判準，就不知道哪些該重跑。
- **驗證本身也要成本。**寫測試、維護自動檢查的人力，常常比 token 貴。如果你的工作本來就沒有測試，第一步要花的不是模型的錢，是人的時間。

另外，這些數字都是 Anthropic 用自家測試跑出來的，目前沒看到第三方重現，也沒看到人反駁。拿來當方向可以，拿來當報價不行。

## 換模型本身也要錢 {#switching}

「大小模型混著用」聽起來很省，但指南提醒了幾個很少人注意的成本：[[2]](https://claude.dev/blog/which-claude-model-should-you-build-with/)

- **快取屬於寫入它的模型。**對話中途換模型，第一輪要把整段對話重新寫入快取。換之前先用 `/compact` 把對話壓縮，或乾脆用一段簡短的計畫開新對話。
- **往下換模型，前面的思考過程會被丟掉。**小模型讀不到大模型的思考內容，而且不會報錯，就是安靜地丟掉。
- **Claude Code 的預設行為變了。**新版裡負責找檔案、讀程式的 Explore 子代理人，改成跟著你目前用的模型跑，不再固定用最便宜的 Haiku。想省錢，要自己定義一個叫 Explore 的子代理人，指定 `model: haiku`。

指南的原則是：改程式碼的工作留在主模型；小模型只做「錯了很容易發現」的事，例如分類、找檔案、讀 log。

## 讓系統替你挑模型，不一定比較省 {#routing}

既然選模型這麼麻煩，讓系統替你挑呢？這正是業界正在做的事。

GitHub Copilot 10 月底推出 Copilot Fusion。你在選單裡選的不再是某個模型，而是 Standard、High、Max 三種力道，由它決定每一步用哪個模型、要不要加一個模型來審查。[[3]](https://docs.github.com/en/copilot/concepts/models/copilot-fusion) 它的設計有兩點我很欣賞：

- **主對話盡量留在同一個模型上**，保住快取；幫忙審查的模型只拿到它需要的內容。這剛好避開了上一節講的換模型成本。
- **回答完後，把游標移到力道名稱上，就看得到這次用了哪些模型。**

但也有代價。每個用到的模型都照原價計費，High 和 Max 會用到不只一個模型，所以可能花更多。[[3]](https://docs.github.com/en/copilot/concepts/models/copilot-fusion) GitHub 說 Fusion Max 在 Artificial Analysis 的程式代理人指數拿 60 分，和 Claude Code 加 Opus 5.5 開 max 差不到 2 分，平均每件任務的成本約一半。[[4]](https://github.blog/changelog/2026-10-28-route-and-orchestrate-models-with-github-copilot-fusion/) 這是廠商引用的成績，你的任務上不一定成立。

多模型也不保證贏。Anthropic 的指南裡，讓小模型遇到難題去問大模型的幾組配對，沒有一組明顯贏過小模型自己做。[[2]](https://claude.dev/blog/which-claude-model-should-you-build-with/)

我自己訂的 Grok Bot 也會替我挑後端模型。它的用量報告看得到額度用了多少、哪些排程任務用得最多，看不到每一次背後用了哪個模型、各花多少。

所以自動路由解決的是「不用自己挑」，不是「看得懂帳」。路由越自動，你越難畫出自己任務的「分數對花費」圖。人要留在手上的，是驗收標準和預算上限。

## 用 API 和用訂閱，是兩本帳 {#two-ledgers}

前面講的「每件任務成本」，對用 API 付費的團隊最有意義。但很多人，包括台灣多數個人開發者，是付月費訂閱的。訂閱用戶真正在意的，是每週額度用完前，能做完多少事。

Theo 的說法很直接：最好的衡量方式是「每週做完多少工作」。他說只用 Opus 的話，一週大約能跑 1,200 輪、230 個對話；先把 Fable 的額度用完再換 Opus，大約只有 900 輪，但對話數略多。[[14]](https://x.com/theo/status/2119962555326345641) 而 Anthropic 的 Pro 方案和 Team 標準席次，Fable 最多只能用到每週額度的一半。[[1]](https://www.anthropic.com/claude-fable-and-mythos-5-2)

兩本帳，最佳解不一樣：

| | 用 API 付費 | 付月費訂閱 |
|---|---|---|
| 要算的單位 | 每件完成的任務花多少錢 | 每週額度內能做完多少事 |
| 最怕的事 | 少數最難的題目把預算吃光 | 週中就把額度燒完，剩下幾天沒得用 |
| 實際做法 | 便宜的先跑、失敗才升級；把最難的題目算進比價 | 日常用 Opus 加 medium；Fable 和 max 留給真正卡關、或要跑很久沒人看著的工作 |

另一個要記得的：開發者的時間也是成本。直接開最強的模型，如果一次就做完、省下兩小時除錯，可能比較划算。effort 和模型怎麼選，最後要放進「人加機器」的總帳裡算。

## 自己量一次：三題、兩個模型、兩檔 effort {#measure}

既然別人的數字不能直接用，最實在的就是自己量一次。不用很大，一個下午就夠：

1. **挑三件真實工作**，一件簡單、一件普通、一件你覺得難的。每一件先寫好「怎樣算做對」。
2. **兩個模型各跑兩檔 effort**，例如 Sonnet 5.5 和 Opus 5.5，各跑 medium 和 high。每一次都開新的對話，免得快取互相影響。
3. **記下每一次的花費和結果。**用 Claude Code 的話，跑完看 `/usage`；用 API 的話，看回傳的用量欄位。
4. **畫一張「分數對花費」的圖**，橫軸花費、縱軸做對幾題。只保留沒有被其他組合同時「更便宜又更好」比下去的點。
5. **訂閱用戶再多看一件事**：一週下來，額度是在哪一天、因為哪一類工作燒完的。

量完你會得到兩個答案：日常工作用哪個組合就夠，以及什麼樣的工作值得開大。這兩個答案，比任何排行榜都準。

---

新模型一個接一個出來，每一次大家都在問「要不要換」。看完這一輪的數字，我會先問另一個問題：我的錢是花在想，還是花在一直重讀？前者可以靠換模型、調 effort 解決；後者要回頭整理對話、快取，和工作怎麼切。

---

## 參考資料

- **[1]** [Anthropic：Claude Fable 5.2 and Claude Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2)（2026-11-09；牌價、FrontierCode 2.0 成績、Pro 方案 Fable 用量上限）。
- **[2]** [Addy Osmani：Which Claude model should you build with? Fable, Opus, Sonnet, or Haiku](https://claude.dev/blog/which-claude-model-should-you-build-with/)（claude.dev，2026-11-09；牌價表、調整順序、effort 與成本數字、換模型的成本）。
- **[3]** [GitHub Docs：About GitHub Copilot Fusion](https://docs.github.com/en/copilot/concepts/models/copilot-fusion)。
- **[4]** [GitHub Changelog：Route and orchestrate models with GitHub Copilot Fusion](https://github.blog/changelog/2026-10-28-route-and-orchestrate-models-with-github-copilot-fusion/)（2026-10-28）。
- **[5]** [@0xRhinoX：Fable 5.2 只改 effort 的花費比較](https://x.com/0xRhinoX/status/2119915121698840587)（X，2026-11-10）。
- **[6]** [@Bhavani_00007：Fable 5.2 與 Opus 5.5 同場景比較](https://x.com/Bhavani_00007/status/2119902204320780676)（X，2026-11-10）。
- **[7]** [Theo：Fable 5.2 一次 76 分鐘、約 42 美元](https://x.com/theo/status/2119926277801144695)（X，2026-11-10）。
- **[8]** [Artificial Analysis：Claude Fable 5.2 Intelligence Index 結果](https://x.com/ArtificialAnlys/status/2119878995386982508)（X，2026-11-10）。
- **[9]** [Wade Foster：Fable 5.2 在 Zapier AutomationBench 的成績](https://x.com/wadefoster/status/2119874501747814409)（X，2026-11-10）。
- **[10]** [Aakash Gupta：Spotify's Claude Code Token Trick, Tested](https://www.aibyaakash.com/p/spotifys-90-trick)（AI by Aakash，2026-11-10）。
- **[11]** [@DrFreeman666：148 次 Opus 5.5 長時間工作的統計](https://x.com/DrFreeman666/status/2119876371325620629)（X，2026-11-10）。
- **[12]** [Bo Shen：寫入快取占 token 6.6%、占帳單約 18%](https://x.com/aplomb2/status/2119477127116714467)（X，2026-11-09）。
- **[13]** [Alex Vainshtein：Claude Code 快取整段重寫](https://x.com/Alex_Vainshtein/status/2119339291507593400)（X，2026-11-08）。
- **[14]** [Theo：用「每週做完多少工作」衡量](https://x.com/theo/status/2119962555326345641)（X，2026-11-10）。
