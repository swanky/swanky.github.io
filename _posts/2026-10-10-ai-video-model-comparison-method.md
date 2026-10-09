---
title: "排行榜第一名，不一定適合你的鏡頭：用同一張圖讓 AI 影片模型對打"
seo_title: "AI 影片模型怎麼選：同一張首幀、同一段指令對打，用每可用秒成本算帳"
date: 2026-10-10 09:30:00 +0800
categories: [technical]
tags: [ai-video, model-comparison, seedance, openrouter, workflow]
layout: article
learn_kit: true
use_glightbox: true
cta_context: agentic
related_posts:
  - ai-video-production-rehearsal-seedance-workflow
  - ai-video-quality-review-three-verdicts
  - hermes-agent-openrouter-video-generation
description: "排行榜只能幫你縮名單。用同一張圖、同一段指令、同樣秒數讓模型對打，才知道哪個模型適合你的鏡頭。"
keywords: AI 影片模型比較,影片模型怎麼選,Seedance,Grok Imagine,Hailuo,OpenRouter,圖生影片,每可用秒成本,史旺基
cover_image: /assets/img/linkedin/ai-video-model-comparison-method.jpg
cover_alt: "成年水手服創作者在測試實驗室裡拿著碼錶和評分夾板，看著同一個發光方塊接出四條光纜、送進四台測試機台，四個螢幕上同一個奔跑人形只有一台畫得乾淨"
hero_image: true
---

要做 AI 影片，第一個問題通常是：用哪個模型？最快的答案是看排行榜。

我也這麼做過。結果榜上排在前面的兩個模型，在我的鏡頭裡都沒過關；反而是榜上找不到的那一個，交出唯一能用的畫面。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>排行榜只能縮名單</strong>：它回答「大家整體比較喜歡誰」，不回答「我這一鏡該交給誰」。</li>
    <li><strong>對打只能有一個變因</strong>：同一張首幀、同一段指令、同樣秒數與比例，差異才算是模型造成的。</li>
    <li><strong>考題要挑會失敗的鏡頭</strong>：原地微笑人人都會，衝刺滑鏟加攝影機後退跟拍才分得出高下。</li>
    <li><strong>結論不是冠軍，是分工表</strong>：哪一類鏡頭交給誰，用實付金額和「每秒可用畫面的成本」算帳。</li>
  </ul>
</div>

<nav class="article-toc" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ul>
    <li><a href="#why">為什麼排行榜不夠用</a></li>
    <li><a href="#specs">步驟一：先查規格，刷掉不能用的</a></li>
    <li><a href="#test">步驟二：出一道會失敗的考題</a></li>
    <li><a href="#control">步驟三：只留一個變因</a></li>
    <li><a href="#judge">步驟四：由要負責的人判，記下失敗類型</a></li>
    <li><a href="#cost">步驟五：記實付，算每秒可用畫面的成本</a></li>
    <li><a href="#assign">步驟六：把結論寫成分工表</a></li>
    <li><a href="#start">你可以這樣開始</a></li>
  </ul>
</nav>

## 為什麼排行榜不夠用 {#why}

2026 年 8 月，我為了一場 AI 影像比賽準備製作流程。當時最有公信力的第三方訊號，是 [Artificial Analysis](https://artificialanalysis.ai/video/leaderboard/image-to-video) 的影片模型盲測榜：真人在不知道模型名稱的情況下兩兩比較，再算出排名。

我在 8 月 23 日讀到的情況是：「用一張圖生成影片」的含聲音榜，Seedance 2.0 排第 1；Hailuo 3 在幾個榜都排前三；我最想試的 Seedance 2.5 不在榜上。照這樣看，我應該直接選 Seedance 2.0。

實測結果剛好相反。這不代表榜單錯了：它測的是大量通用題目上的平均偏好，我測的是「風格化 3D 角色、用一張圖當第一格、加上高難度動作」這種很窄的用途。

而且排名會動。10 月再看同一個榜，前五名的順序和成員都變了。所以本文的排名一律是 **2026 年 8 月 23 日**的狀態，請當成歷史紀錄，不要當現在的推薦。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-model-comparison-method" data-type="image" href="{{ '/assets/img/ai-video/ai-video-model-comparison-method-funnel.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-model-comparison-method-funnel-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-model-comparison-method-funnel.svg' | relative_url }}" width="1200" height="720" alt="選模型的漏斗：排行榜反映大量通用題目的平均偏好，只能縮名單；查規格把 24 個影片模型刷到 4 個；同一份考題對打，4 個只有 1 個通過；最後寫成哪類鏡頭交給誰的分工表。">
    </picture>
  </a>
  <figcaption>圖 1：排行榜只能縮名單，最後要落到一張分工表（2026 年 8 月）。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 步驟一：先查規格，刷掉不能用的 {#specs}

花任何一毛生成費之前，我先做了一張能力對照表。資料來自 OpenRouter（用同一個帳號就能串接多家 AI 模型的服務平台）的影片模型清單，那天清單上有 24 個影片模型。

我只比對跟自己用途有關的幾欄：

| 要查什麼 | 為什麼重要 | 當時查到的例子 |
|---|---|---|
| 能不能用一張圖當第一格 | 我的流程是先核准畫面再讓它動 | Sora 2 Pro 在這個平台上不能，直接淘汰 |
| 能不能指定最後一格 | 變身鏡需要指定終點畫面 | Grok Imagine Video 1.5 只能指定第一格 |
| 解析度 | 交付要 1080p | Seedance 2.5 只有 480p、720p；Hailuo 3 固定 2K |
| 可選秒數 | 鏡頭長度要排得進去 | Veo 3.1 只能選 4、6、8 秒 |
| 計價方式 | 估價能不能信 | Grok、Hailuo 按秒計價；Seedance 按運算量計價 |

做完這張表，名單就從 24 個收斂到 4 個：Seedance 2.5、Seedance 2.0、Hailuo 3、Grok Imagine Video 1.5。

**規格不相容的模型，畫質再好都用不上。**我當時的結論之一是：預算根本不是淘汰的瓶頸，規格相容和沒驗證過的品質才是。

<div class="ae-quizband">
  <div class="ae-quiz" data-ae-quiz="A">
    <div class="ae-quiz__top"><span class="ae-quiz__badge"><i class="bi bi-bullseye" aria-hidden="true"></i>小測驗</span></div>
    <p class="ae-quiz__q">假設你要交 1080p，而且要指定最後一格畫面。只看上面這張表，哪兩個模型一定會被刷掉？</p>
    <ul class="ae-quiz__opts">
      <li><button type="button" class="ae-quiz__opt" data-option="A"><span class="ae-quiz__letter">A</span><span>Seedance 2.5 和 Grok Imagine Video 1.5</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="B"><span class="ae-quiz__letter">B</span><span>Hailuo 3 和 Seedance 2.0</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="C"><span class="ae-quiz__letter">C</span><span>Veo 3.1 和 Hailuo 3</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="D"><span class="ae-quiz__letter">D</span><span>都不會被刷掉</span></button></li>
    </ul>
    <div class="ae-quiz__result" tabindex="-1" hidden>
      <strong data-ae-verdict></strong> Seedance 2.5 在這個平台只有 480p、720p，交不了 1080p；Grok Imagine Video 1.5 只能指定第一格，做不到指定最後一格。（實際交件時，我是在後製把 Seedance 2.5 的 720p 放大成 1080p 輸出；這題只看規格表。）
      <ul class="ae-quiz__why">
        <li><b>B、C</b>：表上查到的限制不在這兩項（Veo 3.1 卡的是秒數，Hailuo 3 是解析度固定 2K），只看這張表，不能說它們一定被刷掉。</li>
        <li><b>D</b>：A 的兩個模型各有一項條件做不到。</li>
      </ul>
      <button type="button" class="ae-btn" data-ae-quiz-reset style="margin-top:.75rem">再試一次</button>
    </div>
    <details class="ae-reveal ae-quiz-answer-static"><summary>看答案</summary><div>A。Seedance 2.5 沒有 1080p，Grok Imagine Video 1.5 不能指定最後一格。</div></details>
  </div>
</div>

## 步驟二：出一道會失敗的考題 {#test}

比較模型最常見的錯，是拿太簡單的題目去考。角色站著微笑、頭髮被風吹，幾乎每個模型都漂亮，比不出差異。

要找的是**最可能翻車、而且翻車對你傷害最大的鏡頭**。我出的考題，改編自一則公開的參考案例：

- 角色在未來感走廊裡往鏡頭衝刺；
- 壓低身體滑鏟，從一道紅色雷射底下穿過；
- 起身繼續跑，攝影機在她前方往後退、持續跟拍。

這一題同時考四件事：動作有沒有真的滑鏟、有沒有物理上穿過雷射、角色還像不像第一格那個人、攝影機有沒有照指示後退。

如果你做的是商品片，考題可能是「商品幾乎不動、只有光線變化，標示有沒有變形」；做口播，可能是「單人自然反應，臉有沒有走樣」；拍對話，可能是「兩人輪流入鏡，視線方向接不接得上」。原則一樣：**挑你最怕失敗的那一鏡。**

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-model-comparison-method" data-type="image" href="{{ '/assets/img/ai-video/ai-video-model-comparison-method-difficulty.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-model-comparison-method-difficulty-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-model-comparison-method-difficulty.svg' | relative_url }}" width="1200" height="660" alt="考題難度從簡單到難：原地微笑、頭髮被風吹，幾乎每個模型都漂亮，比不出差異；衝刺、滑鏟過雷射、攝影機後退跟拍，同時考動作、物理、角色、運鏡四件事，才分得出高下。換成你的題目：商品片看標示有沒有變形、口播看臉有沒有走樣、對話看視線接不接得上。">
    </picture>
  </a>
  <figcaption>圖 2：考題要選在難的那一端：最可能翻車、翻車代價最大的鏡頭。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 步驟三：只留一個變因 {#control}

對打要公平，就只能讓「模型」這件事不同。我固定了這些條件：

- **同一張首幀圖**（首幀就是影片的第一格畫面），還確認四個模型拿到的是同一個檔案，不是看起來一樣的兩張圖；
- **同一段英文指令**，一字不改；
- **同樣 5 秒、同樣 16:9**；
- **原生聲音關閉**，避免聲音影響我對畫面的判斷。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-model-comparison-method" data-type="image" href="{{ '/assets/img/ai-video/ai-video-model-comparison-method-bakeoff.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-model-comparison-method-bakeoff-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-model-comparison-method-bakeoff.svg' | relative_url }}" width="1200" height="760" alt="模型對打：同一張首幀、同一段指令、同樣 5 秒 16:9、原生聲音關閉，考題是滑鏟過雷射加攝影機後退跟拍。Seedance 2.5 動作、物理、角色、運鏡都過，判為通過；Grok Imagine Video 1.5 滑鏟變成跌倒、Seedance 2.0 人物不像第一格、Hailuo 3 只是蹲下穿過雷射，三支都是僅概念參考。結論：動作鏡交給 Seedance 2.5，低動態短鏡交給 Grok。">
    </picture>
  </a>
  <figcaption>圖 3：同一份考題交給四個模型，只有一支過關。結論不是選冠軍，而是一張「哪類鏡頭交給誰」的分工表（2026 年 8 月實測）。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

要老實說，這場並不完全公平：Hailuo 3 在這個平台只有 2K 一種解析度，其他三個是 720p。它畫素最多卻在動作上沒過，所以解析度沒幫它贏；但如果你要比畫質細節，這種不對等就要另外處理。

**變因沒控制好，結論就很難解讀**：你不知道差異來自模型、來自指令被改過，還是那張圖被換過。

## 步驟四：由要負責的人判，記下失敗類型 {#judge}

四支影片回來後，由我親自判定。我是這個角色的持有人，也是最後要對成片負責的人。

我判的不是「哪支比較好看」，而是逐項看它在哪裡失敗：

- **Seedance 2.5**：動作、物理、角色、運鏡都過，判為通過。
- **Grok Imagine Video 1.5**：畫面順又漂亮，但滑鏟變成跌倒，後段身體穿過雷射。
- **Seedance 2.0**：有特技感，但人物和第一格不太像，變成另一種卡通感。
- **Hailuo 3**：畫面本身沒問題，但人物只是蹲下，直接穿過雷射。

只有 Seedance 2.5 拿到「通過」，其他三支都是「僅概念參考」，也就是不進成片、只留作方向參考。三種判定怎麼下，我另外寫在[〈AI 影片生出來能不能用？〉]({{ '/technical/ai-video-quality-review-three-verdicts/' | relative_url }})；四支片的實際畫面在[〈AI 影片不是輸入一句話就好〉]({{ '/technical/ai-video-production-rehearsal-seedance-workflow/' | relative_url }})。

**記失敗類型比記分數有用。**「Grok 動作鏡不行，但畫面很順」這句話，直接告訴我它還能用在哪裡。

<div class="ae-traits" id="model-flip">
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">1</span><h3>Seedance 2.5</h3><p class="ae-flip__fix">這一鏡過關了嗎？</p><p class="ae-flip__hint">點我看它失敗在哪 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>通過</h3><p>動作、物理、角色、運鏡都過。分工表上，負責高難度動作、變身、重特效。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">2</span><h3>Grok Imagine Video 1.5</h3><p class="ae-flip__fix">這一鏡過關了嗎？</p><p class="ae-flip__hint">點我看它失敗在哪 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>僅概念參考</h3><p>失敗在動作和物理：滑鏟變成跌倒，後段身體穿過雷射。但畫面順又漂亮，分工表上改接低動態、日常、特寫、氛圍和 1 到 3 秒插入鏡。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">3</span><h3>Seedance 2.0</h3><p class="ae-flip__fix">這一鏡過關了嗎？</p><p class="ae-flip__hint">點我看它失敗在哪 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>僅概念參考</h3><p>失敗在角色：有特技感，但人物和第一格不太像，變成另一種卡通感。這次只測了一種鏡頭，還看不出它適合哪一類。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">4</span><h3>Hailuo 3</h3><p class="ae-flip__fix">這一鏡過關了嗎？</p><p class="ae-flip__hint">點我看它失敗在哪 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>僅概念參考</h3><p>失敗在物理：畫面本身沒問題，但人物只是蹲下，直接穿過雷射。這次只測了一種鏡頭，還看不出它適合哪一類。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
</div>

## 步驟五：記實付，算每秒可用畫面的成本 {#cost}

每一支片我都記下平台回報的實付金額，而不是自己算的估價。按運算量計價的模型，估價可能差很多：我用清單上的起價粗估 Seedance 2.5 跑 5 秒 720p 約 0.47 美元，實付是 1.165 美元。相對地，Grok 按秒計價，兩次實測都跟公告價格一致。

更重要的是**每秒可用畫面的成本**：花掉的錢，除以真正能放進成片的秒數。

同一個動作鏡，Grok 花了 0.71 美元，但一秒都不能用，這類鏡頭它的划算程度等於零。Seedance 2.5 單價雖貴，換算下來每秒可用畫面約 0.233 美元。只看單價，你會選錯。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-model-comparison-method" data-type="image" href="{{ '/assets/img/ai-video/ai-video-model-comparison-method-cost.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-model-comparison-method-cost-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-model-comparison-method-cost.svg' | relative_url }}" width="1200" height="720" alt="只看每秒生成費，Grok 每秒 0.142 美元，比 Seedance 2.5 換算的每秒 0.233 美元便宜；改看每秒可用畫面成本，Seedance 2.5 五秒都能用，每秒約 0.233 美元，Grok 花了 0.71 美元卻一秒都不能用。同一個 5 秒 720p 動作鏡，2026 年 8 月實付。">
    </picture>
  </a>
  <figcaption>圖 4：只看單價，Grok 比較便宜；改算每秒可用畫面的成本，結論就翻過來（同一個 5 秒 720p 動作鏡，2026 年 8 月實付）。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 步驟六：把結論寫成分工表 {#assign}

對打的終點不是冠軍，而是一張「哪一類鏡頭交給誰」的表：

| 鏡頭類型 | 交給誰 | 理由（2026 年 8 月） |
|---|---|---|
| 高難度動作、變身、重特效 | Seedance 2.5 | 只有它交出可用的動作鏡；可以指定最後一格 |
| 低動態、日常、特寫、氛圍、1 到 3 秒插入鏡 | Grok Imagine Video 1.5 | 低動態鏡頭先前兩度驗證穩定；720p 每秒 0.142 美元，比 Seedance 2.5 省約 39%；能做 2 秒短鏡 |

這張表後來直接用在我第一支 30 秒彩排預告：動作鏡交給 Seedance 2.5，2 到 3 秒的短鏡交給 Grok，那一輪新生成的鏡頭第一次就全部完成，沒有重新生成任何一鏡。

這場對打也有明顯限制：只測了一種鏡頭，每個模型只跑一支，樣本很小。數字只適合拿來排序、抓明顯差距，不要用小數點製造精確感。

## 你可以這樣開始 {#start}

1. 從你的分鏡裡，挑出最怕失敗、失敗代價最大的那一鏡當考題。
2. 先做一張四、五欄的規格表，把首幀、尾幀、解析度、秒數不合的模型刷掉。
3. 固定同一張圖、同一段指令、同樣秒數與比例，聲音先關掉。
4. 執行前先寫下 3 到 5 條通過條件，跑完不改判準。
5. 每一支都記實付，失敗的也記，最後算每秒可用畫面的成本，寫成分工表。

---

## 這個系列接著讀

- [AI 影片不是輸入一句話就好：6 天彩排 3 支成片，我踩過的審核、參考圖與成本問題]({{ '/technical/ai-video-production-rehearsal-seedance-workflow/' | relative_url }})
- [AI 影片生出來，到底能不能用？用三種判定取代「感覺還可以」]({{ '/technical/ai-video-quality-review-three-verdicts/' | relative_url }})
- [我讓 Hermes Agent 串上 OpenRouter 生影片：從 GPT-5.6 Sol 到 35 秒成片的完整實作]({{ '/technical/hermes-agent-openrouter-video-generation/' | relative_url }})
- 系列入口：[AI 影片製作筆記]({{ '/technical/ai-video/' | relative_url }})
- 術語看不懂，可以查[AI 影片白話術語表]({{ '/technical/ai-video/glossary/' | relative_url }})

## 參考資料

- [Artificial Analysis：Image-to-Video Leaderboard](https://artificialanalysis.ai/video/leaderboard/image-to-video)（排名會變動；本文引用 2026 年 8 月 23 日的讀取結果）
