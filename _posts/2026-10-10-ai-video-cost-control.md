---
title: "AI 影片的錢都花在哪？四個習慣讓預算不失控"
seo_title: "AI 影片預算怎麼控制：送出前看報價、每鏡最多兩次、失敗也記帳、比每可用秒成本"
date: 2026-10-10 10:00:00 +0800
categories: [technical]
tags: [ai-video, cost-control, openrouter, seedance, workflow]
layout: article
learn_kit: true
use_glightbox: true
cta_context: agentic
related_posts:
  - ai-video-production-rehearsal-seedance-workflow
  - ai-video-agent-human-gates
  - ai-video-model-comparison-method
description: "AI 影片的錢，常常不是花在成片上，而是重新生成與失敗。四個習慣，加上我前後實付約 US$125 的帳本。"
keywords: AI 影片成本,AI 影片預算,生成前估價,重抽上限,每可用秒成本,失敗記帳,Seedance,史旺基
cover_image: /assets/img/linkedin/ai-video-cost-control.jpg
cover_alt: "成年水手服創作者在影片生成機房裡，手指停在紅色確認鈕上方、一手拉著長長的收據低頭核對，旁邊有天平、帳本和打了紅叉的淘汰片段"
hero_image: true
---

第一次用 AI 做影片，很容易覺得「一顆鏡頭才幾塊美金」。等到片子做完、對帳單出來，才發現有不少錢不是花在成片上，而是花在重來、失敗和沒人記得的那幾次。

這篇整理我自己做 AI 影片時養成的四個花錢習慣。從賽前彩排到正式比賽，前後實付約 US$125，每一筆都有紀錄。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>送出前先看報價</strong>：價格照當下官方價格表算，查不到就寫「未知」。</li>
    <li><strong>每顆鏡頭最多兩次</strong>：第三次要人看過失敗原因與新報價，單獨放行。</li>
    <li><strong>失敗也要記帳</strong>：被拒絕、不能用、付了錢卻下載不到，各記一列。</li>
    <li><strong>比模型看「每可用秒成本」</strong>：失敗的版本也算進去，單價便宜不等於比較省。</li>
  </ul>
</div>

## 錢為什麼會不知不覺花掉 {#why}

影片生成多半依秒數或運算量計價。2026 年 8 月我用 Seedance 2.5 生成一顆 15 秒、720p 的鏡頭，實付約 US$3.48。單看不貴，但有三件事會疊加：

1. **秒數**：鏡頭拉長，價格跟著往上。
2. **重抽**：不滿意就再生一次，每次都是全額。
3. **AI 助手太勤勞**：沒有規則擋著，負責操作的 AI 助手可能把同一個錯誤再生好幾次。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-cost-control" data-type="image" href="{{ '/assets/img/ai-video/ai-video-cost-control-stack.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-cost-control-stack-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-cost-control-stack.svg' | relative_url }}" width="1200" height="720" alt="一顆 15 秒、720p 的鏡頭實付約 3.48 美元，再疊上秒數拉長、重抽每次全額、AI 助手重複送件，花費就像硬幣一樣越疊越高。">
    </picture>
  </a>
  <figcaption>圖 1：單看一顆鏡頭不貴；秒數、重抽、AI 助手重複送件一疊，錢就一層層變多。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

下面這張圖，是我現在每一顆鏡頭都會走的流程。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-cost-control" data-type="image" href="{{ '/assets/img/ai-video/ai-video-cost-control-shot-flow.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-cost-control-shot-flow-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-cost-control-shot-flow.svg' | relative_url }}" width="1200" height="780" alt="一顆鏡頭的花錢流程：先看報價單、人核准這一張報價才生成；能用就記帳，不能用先寫失敗原因、改輸入再送，第三次要新報價並由人單獨放行；失敗也要記帳。">
    </picture>
  </a>
  <figcaption>圖 2：每一次花錢之前都有人點頭，每一次花完都有一列帳。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 習慣一：送出前，先看到一張報價單 {#quote}

每次付費生成前，我要先看到一張白話的報價單：

- 這顆鏡頭要拍什麼、怎樣才算成功；
- 模型、秒數、解析度、畫面比例；
- 單價、這次估價、目前累計花了多少、這是第幾次；
- 可能的風險，例如會不會被供應商的內容過濾擋下、角色會不會走樣。

**價格要查當下的，不能憑印象。** 我實際碰過：一個模型首頁寫每秒 US$0.08，我送了 1080p、5 秒的鏡頭，實付卻是 US$1.26，因為解析度不同，單價也不同。所以每批送出前都重查價格表；查不到，就在報價單寫「未知」，交給人決定。寧可承認不知道，也不要編一個看起來合理的數字。

**核准只對那一張報價有效。** 我核准的是「這個解析度、這個秒數、這幾個版本」。改成 1080p、多要一個版本、換了提示詞，就是一張新報價，要重新核准。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-cost-control" data-type="image" href="{{ '/assets/img/ai-video/ai-video-cost-control-quote.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-cost-control-quote-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-cost-control-quote.svg' | relative_url }}" width="1200" height="920" alt="示意報價單列出拍什麼、模型、秒數、解析度、畫面比例、版本數、單價、這次估價、目前累計、第幾次與可能風險；改了解析度、秒數、版本數或提示詞，就要重新核准。">
    </picture>
  </a>
  <figcaption>圖 3：一張報價單的欄位（示意）。金色欄位一改，就是新報價。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

每個案子也先定上限。我的賽前彩排一開始上限是 US$30，後來經我同意放寬到 US$85；雙風格短片另開的預算超出 US$1.01，也是我明確說「接受」才算數。上限不是用來湊滿的，它讓「超過」這件事看得見，而且一定有人點頭。

## 習慣二：每顆鏡頭最多兩次 {#rolls}

第一次不滿意，可以再生一次。但第二次之前，要先寫下失敗屬於哪一類：構圖不對、角色走樣、動作破綻、首幀（影片第一格畫面）本身有問題，還是人數錯。

然後**改輸入**：改提示詞、改首幀、改秒數。只換一個亂數設定再送，等於同一張彩券買兩次。如果問題出在首幀，先用生圖把畫面修好，修圖比重生影片便宜很多。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-cost-control" data-type="image" href="{{ '/assets/img/ai-video/ai-video-cost-control-reroll.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-cost-control-reroll-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-cost-control-reroll.svg' | relative_url }}" width="1200" height="720" alt="只換亂數設定重送，等於同一張彩券買兩次；應該先寫下失敗屬於構圖、角色走樣、動作破綻、首幀或人數哪一類，再改提示詞、首幀或秒數。">
    </picture>
  </a>
  <figcaption>圖 4：只換亂數重送，像同一張彩券買兩次；寫下原因再改輸入，才是重新瞄準。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

第三次不是自動的。要附上新估價、目前累計，以及前兩次為什麼失敗，由我針對這一顆單獨放行。

我實際遇到的是：一支卡通、一支擬真的雙風格短片，兩個版本的最後一段都用到第三次。第二次都是換了方法、卻帶出新問題，一支人物被拉長裁切，一支被卡通參考圖帶成了動畫風。每種風格各生成 7 次、實付 US$27.80，其中 2 次被淘汰，約佔四分之一。這就是重抽的真實代價。

## 習慣三：失敗也要記帳 {#failures}

「失敗」至少有四種，記法不同。先猜猜看每一種有沒有收錢、該怎麼記，再翻牌對答案：

<div class="ae-traits">
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">1</span><h3>送出時就被拒絕</h3><p>例如參考圖被判定含真人，工作根本沒開始。有沒有收錢？怎麼記？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>通常沒有收錢</h3><p>記下被擋的原因，下次調整輸入。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">2</span><h3>生成完成，但畫面不能用</h3><p>檔案拿到了，只是剪不進成片。有沒有收錢？怎麼記？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>有收錢</h3><p>照實付記帳，標成「只能當方向參考」。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">3</span><h3>有收費，但檔案下載不到</h3><p>顯示已完成、也扣款了，就是拿不到檔案。怎麼記？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>有收錢</h3><p>記下<strong>工作編號與金額</strong>，當對帳憑據。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">4</span><h3>費用沒有回報</h3><p>系統沒告訴你這次花了多少。可以先記成零嗎？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>不知道，就寫「未知」</h3><p>不能補成零。零看起來比較好看，但沒有根據。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
</div>

第三種聽起來很少見，我在正式比賽第一天就碰到了。同一個模型有四筆工作顯示已完成、也已扣款，卻一度怎樣都下載不到，四筆合計約 US$7.18。因為每一筆都記了工作編號和實付金額，我能清楚指出是哪四筆，不用靠記憶跟供應商來回。

第四種也遇過：一次請求被伺服器拒絕，沒拿到工作編號，也沒有費用回報。那筆我寫「未知」。補成零帳面比較好看，但那個零沒有根據。

還有一條相關規則：送出後如果斷線或逾時，**先查那一筆的狀態，不要自動重送**。工作可能其實已經被接受，重送就是付第二次錢。

## 習慣四：比單價，不如比「每可用秒成本」 {#usable}

比較模型時，最容易看的是每秒單價。但真正花出去的錢是：

> **每可用秒成本＝所有嘗試的實付（含失敗與淘汰）÷ 最後真正剪進成片的秒數**

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-cost-control" data-type="image" href="{{ '/assets/img/ai-video/ai-video-cost-control-usable-second.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-cost-control-usable-second-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-cost-control-usable-second.svg' | relative_url }}" width="1200" height="760" alt="每可用秒成本＝所有嘗試的實付（成功、失敗、淘汰都算）÷ 最後真正剪進成片的秒數；方向參考永遠不算可用秒數，有條件可用的要修好用上才算。">
    </picture>
  </a>
  <figcaption>圖 5：分子把失敗和淘汰的錢都算進去，分母只算真正剪進成片的秒數。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

幾個算法上的原則：

- 失敗與淘汰的版本照樣算進去，不然高單價、低成功率的模型會被美化。
- 只能當方向參考的片段，永遠不算可用秒數。
- 「有條件可用」的片段，要等後製修好、真的用上了才算。

我做過一次四個模型的對打：在高難度動作鏡，單價較便宜的 Grok 1.5 一秒都不能用，每可用秒成本根本算不出來；換成站姿、微笑這類低動態鏡頭，它每秒反而比 Seedance 2.5 便宜約 39%。**哪個模型省錢，要看鏡頭類型**，完整數字寫在[模型比較篇]({{ '/technical/ai-video-model-comparison-method/' | relative_url }})。

老實說，這個指標我目前樣本很小，每種組合只有一兩支。所以我只用它排順序、抓明顯差距，不用小數點製造精確感。

<div class="ae-quizband">
  <div class="ae-quiz" data-ae-quiz="B">
    <div class="ae-quiz__top"><span class="ae-quiz__badge"><i class="bi bi-calculator" aria-hidden="true"></i>小測驗（示意數字）</span></div>
    <p class="ae-quiz__q">兩個假設的模型（示意，非實際報價），同一顆 5 秒鏡頭：甲每秒 0.1 美元，生成 6 次才有一版能用；乙每秒 0.2 美元，生成 2 次就有一版能用。兩個最後都剪進成片 5 秒。哪個的每可用秒成本比較低？</p>
    <ul class="ae-quiz__opts">
      <li><button type="button" class="ae-quiz__opt" data-option="A"><span class="ae-quiz__letter">A</span><span>甲，單價只有一半</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="B"><span class="ae-quiz__letter">B</span><span>乙</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="C"><span class="ae-quiz__letter">C</span><span>一樣</span></button></li>
    </ul>
    <div class="ae-quiz__result" tabindex="-1" hidden>
      <strong data-ae-verdict></strong> 把失敗的次數一起算進去，乙反而比較省。
      <ul class="ae-quiz__why">
        <li><b>甲</b>：0.1 美元 × 5 秒 × 6 次＝3 美元，除以 5 可用秒＝每可用秒 0.6 美元。</li>
        <li><b>乙</b>：0.2 美元 × 5 秒 × 2 次＝2 美元，除以 5 可用秒＝每可用秒 0.4 美元。</li>
      </ul>
      <button type="button" class="ae-btn" data-ae-quiz-reset style="margin-top:.75rem">再試一次</button>
    </div>
    <details class="ae-reveal ae-quiz-answer-static"><summary>看答案</summary><div>B，乙。甲每可用秒 0.6 美元，乙 0.4 美元。</div></details>
  </div>
</div>

## 我的帳本長這樣 {#books}

以下都是供應商回報的實付金額，不是估價：

| 階段 | 內容 | 實付 |
|---|---|---:|
| 賽前彩排 | 小型試跑、模型比較、30 秒概念預告、三首 AI 配樂、兩支雙風格短片 | US$64.11 |
| 正式比賽 | 現場限時賽，最後入圍決賽八強 | US$60.82 |
| **合計** | | **約 US$125（US$124.93）** |

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-cost-control" data-type="image" href="{{ '/assets/img/ai-video/ai-video-cost-control-ledger.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-cost-control-ledger-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-cost-control-ledger.svg' | relative_url }}" width="1200" height="660" alt="帳本兩段實付：賽前彩排 64.11 美元、正式比賽 60.82 美元，合計 124.93 美元；圖片生成的既有訂閱額度、自己電腦上的剪接混音、時間與設備都沒算進去。">
    </picture>
  </a>
  <figcaption>圖 6：兩段實付加起來約 US$125；訂閱、時間、設備不在這個數字裡。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

不在這張表裡的也要說清楚：圖片生成用的是既有的 ChatGPT 訂閱額度，沒有另外分攤；剪接、混音、品質檢查在自己電腦上完成，沒有額外費用。我的時間、設備與訂閱，都不在這個數字裡。

對我來說，這張帳本比單價表更有用：它告訴我錢實際去了哪裡。

## 你可以這樣開始 {#start}

不需要任何工具，一張試算表就夠：

1. 每次送出前列一行：模型、秒數、解析度、單價、這次估價、目前累計；查不到價格寫「未知」。
2. 先定一個案子上限，超過時一定要有人明確點頭。
3. 每顆鏡頭預設兩次；第二次前寫下失敗原因並改輸入，第三次單獨核准。
4. 每次生成都記一列：工作編號、實付、能不能用，失敗與被拒絕的也記。
5. 剪完片後，回頭標出每顆鏡頭真正用了幾秒，再算每可用秒成本。

---

## 這個系列接著讀

- [AI 影片不是輸入一句話就好：6 天彩排 3 支成片]({{ '/technical/ai-video-production-rehearsal-seedance-workflow/' | relative_url }})：這套預算習慣最早的實戰背景。
- [排行榜第一名，不一定適合你的鏡頭：用同一張圖讓 AI 影片模型對打]({{ '/technical/ai-video-model-comparison-method/' | relative_url }})：四個模型對打的完整結果。
- [讓 AI 助手幫你做影片，又不會半夜亂花錢：五個把關做法]({{ '/technical/ai-video-agent-human-gates/' | relative_url }})：哪些事一定要人點頭。
- [AI 影片白話術語表]({{ '/technical/ai-video/glossary/' | relative_url }})：看不懂的詞先查這裡。
- [AI 影片製作筆記]({{ '/technical/ai-video/' | relative_url }})：系列入口
