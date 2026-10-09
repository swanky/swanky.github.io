---
title: "寫了一堆「電影感」關鍵字，AI 影片還是拍不出來？先把鏡頭語言分成三層"
seo_title: "AI 影片鏡頭語言怎麼寫進提示詞：20 招分三層，哪些寫進指令、哪些要拆分鏡"
date: 2026-10-10 09:00:00 +0800
categories: [technical]
tags: [ai-video, cinematography, prompt, storyboard, beginner]
layout: article
learn_kit: true
use_glightbox: true
cta_context: agentic
related_posts:
  - ai-video-basics-for-non-film
  - ai-video-quality-review-three-verdicts
  - ai-video-production-rehearsal-seedance-workflow
description: "推軌、移焦、蒙太奇不是同一種東西。把常用鏡頭語言分成三層，就知道哪些能寫進指令、哪些要拆鏡或交給剪輯。"
keywords: AI 影片,鏡頭語言,運鏡,提示詞,分鏡,推軌,移焦,一鏡到底,Cinematique,史旺基
cover_image: /assets/img/linkedin/ai-video-camera-language-prompt.jpg
cover_alt: "成年水手服創作者在黃昏的攝影棚裡推著軌道上的攝影機、轉動對焦輪，鏡頭對準有前中後景的走廊佈景，旁邊是三色分類架與剪接台"
hero_image: true
---

你可能也這樣做過：收集一堆「電影感」關鍵字，推軌、移焦、一鏡到底、蒙太奇，全部貼進輸入指令（prompt），按下生成。

結果畫面在一個鏡頭裡偷偷換場、人物瞬移，或者只是把畫面放大，跟你想的完全不一樣。問題通常不在模型，而在這些詞根本不是同一種東西。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>鏡頭語言分三層</strong>：一個鏡頭之內的寫進指令，鏡頭之間的拆成分鏡或交給剪輯，整支片的世界觀定成全片風格。</li>
    <li><strong>最常浪費錢的錯</strong>：把交叉剪輯、蒙太奇這類「鏡頭之間的事」塞進一次生成，期待模型自己剪好。</li>
    <li><strong>寫得出術語不等於拍得出來</strong>：推軌要寫前後景，移焦要有兩個距離不同的主體，一鏡到底要寫出整條路線。</li>
    <li><strong>每個鏡頭只給一個主要運鏡</strong>：推近、環繞、手持同時要，通常只會換來一團亂動。</li>
  </ul>
</div>

<nav class="article-toc" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ul>
    <li><a href="#where">先問一句：這個技法發生在哪裡？</a></li>
    <li><a href="#layer-shot">第一層：一個鏡頭之內，寫進指令</a></li>
    <li><a href="#layer-storyboard">第二層：鏡頭之間的事，拆鏡或交給剪輯</a></li>
    <li><a href="#layer-style">第三層：整支片的世界觀，定一次就好</a></li>
    <li><a href="#checks">付費生成前的五個自查</a></li>
    <li><a href="#start">你可以這樣開始</a></li>
  </ul>
</nav>

## 先問一句：這個技法發生在哪裡？ {#where}

一開始我也是把關鍵字全部塞進指令，後來才發現，這些詞在講三件完全不同的事：

- **一個鏡頭怎麼拍**：攝影機站多遠、怎麼動、光從哪裡來。寫進指令，模型有機會照做。
- **鏡頭和鏡頭怎麼接**：交叉剪輯、蒙太奇、溶接。硬塞進一次生成，模型常在一個鏡頭裡偷切、瞬移。
- **整支片是哪一種世界**：黑色電影、武俠。這不該每鏡換，否則剪在一起像五支不同的片。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-camera-language-prompt" data-type="image" href="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-three-layers.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-three-layers-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-three-layers.svg' | relative_url }}" width="1200" height="720" alt="鏡頭語言分三層：一個鏡頭之內的景別、運鏡、移焦寫進單鏡指令；鏡頭和鏡頭之間的過肩、蒙太奇、一鏡到底拆分鏡或交給剪輯；整支片的黑色電影、倒敘、調色定成全片風格。把第二層塞進一句指令，模型會偷切、瞬移。">
    </picture>
  </a>
  <figcaption>圖 1：拿到一個電影技法，先判斷它屬於哪一層，再決定放進指令、分鏡表，還是全片風格設定。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

先試試看：下面 8 個常見關鍵字，各屬於第幾層？先猜，再翻牌對答案。

<div class="ae-traits ae-traits--compact" id="layer-flip">
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">1</span><h3>推軌</h3><p class="ae-flip__fix">第幾層？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>第一層：鏡頭之內</h3><p>攝影機整台往前移，寫進指令；記得寫出前景與背景。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">2</span><h3>蒙太奇</h3><p class="ae-flip__fix">第幾層？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>第二層：鏡頭之間</h3><p>一串短鏡頭壓縮時間，是剪輯的工作。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">3</span><h3>黑色電影</h3><p class="ae-flip__fix">第幾層？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>第三層：整支片</h3><p>類型風格全片一套，定一次、每一鏡沿用。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">4</span><h3>移焦</h3><p class="ae-flip__fix">第幾層？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>第一層：鏡頭之內</h3><p>不剪接，把注意力從 A 帶到 B；兩個主體距離要拉開。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">5</span><h3>交叉剪輯</h3><p class="ae-flip__fix">第幾層？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>第二層：鏡頭之間</h3><p>兩個同時發生的場景來回切，分別生成兩組鏡頭再剪。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">6</span><h3>特寫</h3><p class="ae-flip__fix">第幾層？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>第一層：鏡頭之內</h3><p>景別，寫進指令；它最吃臉部一致性。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">7</span><h3>倒敘</h3><p class="ae-flip__fix">第幾層？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>第三層：整支片</h3><p>屬於劇本：決定回憶從哪進出，另定一套光色，再在剪輯時接起來。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">8</span><h3>慢動作</h3><p class="ae-flip__fix">第幾層？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>第二層：鏡頭之間</h3><p>變速交給後製，做得穩定又可重複，不必花生成費去賭。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
</div>

<p><button type="button" class="ae-btn" data-ae-flip-all="#layer-flip" aria-pressed="false">全部翻開對答案</button></p>

我的清單底稿是 VVSVS 製作的免費電影技法資料庫 [Cinematique](https://vvsvs.pro/cinematique)。網站標示收錄 150 多種技法，每個技法頁都會說明用途、怎麼引導 AI、常見錯誤。

我請 AI 助手把它整理成中文索引，替每一項標上「建議放哪一層」，再從中挑出我整理成的 20 招清單。150 多項裡有 22 項在講鏡頭之間的關係，不該塞進單一鏡頭。

先說清楚：這個分層是我自己的整理方式，**不是 Cinematique 官方規格**。以下解說也是我用自己的話寫的，原文請看原站。

## 第一層：一個鏡頭之內，寫進指令（14 招） {#layer-shot}

這一層的共同點是：一個鏡頭之內就能完成，模型看得懂，看片時也驗得出來。

| 類別 | 招式 | 白話 | 寫指令時注意 |
|---|---|---|---|
| 景別（4 招） | 建立鏡頭、中景、中近景、特寫 | 觀眾現在需要看到多少 | 英文術語加可見範圍，例如「medium shot, waist up」 |
| 運鏡（5 招） | 推近、拉遠、推軌、跟拍、環繞 | 攝影機怎麼動 | 一鏡只給一個主要運鏡 |
| 焦點（1 招） | 移焦 | 不剪接，把注意力從 A 帶到 B | 兩個主體距離要明顯不同 |
| 燈光（3 招） | 動機光、畫面內光源、低調光 | 光從哪裡來 | 讓光看得出來源 |
| 構圖（1 招） | 框中框 | 用門框、窗框把人框住 | 強調受困或被觀看 |

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-camera-language-prompt" data-type="image" href="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-shot-sizes.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-shot-sizes-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-shot-sizes.svg' | relative_url }}" width="1200" height="700" alt="同一個人的四種景別：建立鏡頭用寬景交代地點、中景腰部以上、中近景胸口以上、特寫最吃臉部一致性；攝影機離人越近，景別越緊。寫指令時英文術語加上看得到的範圍，例如 medium shot, waist up。">
    </picture>
  </a>
  <figcaption>圖 2：景別決定觀眾現在看到多少；攝影機離人越近，景別越緊。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

幾招值得多說一句：

- **推軌（Dolly Shot）**：攝影機整台往前移。它和「變焦」的差別在近的東西跑得比遠的快。Cinematique 提醒要寫出前景、主體、背景三層，否則模型容易只把畫面放大。
- **移焦（Rack Focus）**：焦點從前景的人換到後景的人。除了距離要拉開，轉焦大約花兩秒，還要有一個觸發點，例如一個聲音或一個眼神。
- **動機光（Motivated Lighting）**：臉上的光看得出來是從窗戶、路燈或螢幕來的。這是讓 AI 畫面看起來可信最便宜的方法。
- **特寫（Close-Up）**：最吃臉部一致性，臉一走樣整鏡報廢。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-camera-language-prompt" data-type="image" href="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-dolly-vs-zoom.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-dolly-vs-zoom-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-dolly-vs-zoom.svg' | relative_url }}" width="1200" height="720" alt="推軌與變焦對照：推軌是攝影機整台往前移，前景跑得比背景快；變焦是攝影機不動、整張畫面均勻放大。要推軌，指令要寫出前景、主體、背景三層。">
    </picture>
  </a>
  <figcaption>圖 3：推軌和變焦的差別，在背景有沒有「湧過來」。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

我實際看片時有個簡單判斷法：要的是推軌，就看背景有沒有「湧過來」的空間變化。如果整張畫面只是均勻放大，那是變焦，不是推軌。

最重要的規則是**每個鏡頭只給一個主要運鏡**。推近加環繞加手持晃動同時要，模型會在幾個要求之間拉扯。真的需要第二個動作，只能是很輕微的輔助。

## 第二層：鏡頭之間的事，拆鏡或交給剪輯（6 招） {#layer-storyboard}

這是整份清單裡最省錢的一層。下面這 6 招常被當成關鍵字塞進單一鏡頭，其實都應該另外處理：

1. **過肩鏡頭（Over-the-Shoulder）**：意義來自兩人輪流正打、反打，要在分鏡階段拆成獨立鏡頭。
2. **反應鏡頭（Reaction Shot）**：展示事件對另一個人的影響。這是一個新鏡頭，不是順便帶到。
3. **交叉剪輯（Cross-Cutting）**：兩個同時發生的場景來回切。分別生成兩組鏡頭再剪。
4. **蒙太奇（Montage）**：一串短鏡頭壓縮時間。一樣是剪輯的工作。
5. **慢動作（Slow Motion）**：變速、定格這類，後製做得穩定又可重複，不必花生成費去賭。
6. **一鏡到底（One-er）**：不拆鏡，但它是「整場怎麼走位」的決定，不是一個關鍵字。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-camera-language-prompt" data-type="image" href="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-dialogue-split.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-dialogue-split-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-dialogue-split.svg' | relative_url }}" width="1200" height="740" alt="同一段兩人對話的兩種做法：把過肩、反打、反應塞進一句指令，常得到鏡頭裡偷切、人物瞬移；在分鏡階段拆成 A 過肩、B 過肩、反應鏡頭三格，分別生成再剪接。">
    </picture>
  </a>
  <figcaption>圖 4：兩人對話，拆成三格分鏡再剪，比塞進一句指令可靠。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

一鏡到底只寫「one continuous take」幾乎沒用。Cinematique 建議寫出完整路線：從哪裡開始、經過哪個門口、在哪裡轉彎、誰從背景穿過、光線在哪裡變色，以及全程不能變的服裝與道具。路線沒寫，模型就會偷偷瞬移。

我實際做過一個 30 秒的一鏡到底：角色從雨夜台北穿過沙漠，再到太空站。做法是在指令裡寫出逐秒的時間軸，把每一次換景排進去，而不是只寫一句「一鏡到底」。完整過程在[〈AI 影片不是輸入一句話就好〉]({{ '/technical/ai-video-production-rehearsal-seedance-workflow/' | relative_url }})。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-camera-language-prompt" data-type="image" href="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-oner-route.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-oner-route-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-oner-route.svg' | relative_url }}" width="1200" height="780" alt="一鏡到底的路線：30 秒例子從雨夜街道經換景節拍到沙漠，再經換景節拍到太空站，指令寫成逐秒時間軸。路線至少寫從哪裡開始、經過哪個門口、在哪裡轉彎、誰從背景穿過、光線在哪裡變色，服裝與道具全程不變。">
    </picture>
  </a>
  <figcaption>圖 5：一鏡到底要寫出整條路線；我的 30 秒例子，是把每一次換景排進逐秒時間軸。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

溶接、淡入淡出這類轉場也屬於這一層，交給剪輯軟體就好。只有故事真的需要連續變形時，才讓模型在鏡頭內生成。

## 第三層：整支片的世界觀，定一次就好 {#layer-style}

- **敘事技法屬於劇本**：倒敘、伏筆、懸念結尾決定的是「拍哪些鏡頭、怎麼排」。你不會寫「flashback」就期待模型知道哪段是回憶，而是在劇本決定回憶從哪進出，替它另定一套光色，再在剪輯時接起來。
- **類型風格全片一套**：黑色電影一旦定了，整支片的光影反差和色彩就該一致。第三鏡黑色電影、第四鏡變成溫暖日系，觀眾只會出戲。我會把它寫進全片共用的風格設定，自己先核准，之後每一鏡沿用。
- **特效一半交給後製**：調色、去飽和、底片顆粒交給後製，做得出可重複的結果；散景、鏡頭光暈可以寫進指令，但只在必要時加，否則畫面很電影，故事卻看不清楚。

## 付費生成前的五個自查 {#checks}

分好層之後，每次付費生成之前，我會對實際要送出的指令跑一輪檢查。不通過就不送，因為一個註定會失敗的鏡頭，連估價都不值得看。

1. 寫了推軌或推近，**有沒有寫前景與背景**？
2. 寫了移焦，**兩個對焦目標夠不夠遠、觸發點寫了沒**？
3. 攝影機最後跑到另一側，**路線寫出來了沒**？沒寫路線的換位就是瞬移。
4. 同一段文字是不是**同時要求「靜止」又「環繞」**？互相矛盾就拆開。
5. **一秒之內是不是塞了兩個以上的事件**？塞太滿就刪事件或拉長鏡頭。

<div class="ae-quizband">
  <div class="ae-quiz" data-ae-quiz="A">
    <div class="ae-quiz__top"><span class="ae-quiz__badge"><i class="bi bi-bullseye" aria-hidden="true"></i>小測驗</span></div>
    <p class="ae-quiz__q">下面這段指令是示意，非實例：「中景，她站在窗邊，攝影機推近；第 2 秒她轉頭，杯子同時落地；焦點從她移到窗外的路燈。」它違反了五項自查裡的哪三條？</p>
    <ul class="ae-quiz__opts">
      <li><button type="button" class="ae-quiz__opt" data-option="A"><span class="ae-quiz__letter">A</span><span>第 1、2、5 條</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="B"><span class="ae-quiz__letter">B</span><span>第 1、3、4 條</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="C"><span class="ae-quiz__letter">C</span><span>第 2、3、5 條</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="D"><span class="ae-quiz__letter">D</span><span>第 3、4、5 條</span></button></li>
    </ul>
    <div class="ae-quiz__result" tabindex="-1" hidden>
      <strong data-ae-verdict></strong> 推近卻沒寫前景與背景（第 1 條）；移焦沒寫觸發點（第 2 條）；第 2 秒同時塞了轉頭和杯子落地（第 5 條）。
      <ul class="ae-quiz__why">
        <li><b>第 3 條</b>：攝影機沒有跑到另一側，不需要寫換位路線。</li>
        <li><b>第 4 條</b>：指令沒有同時要求「靜止」和「環繞」，沒有互相矛盾。</li>
      </ul>
      <button type="button" class="ae-btn" data-ae-quiz-reset style="margin-top:.75rem">再試一次</button>
    </div>
    <details class="ae-reveal ae-quiz-answer-static"><summary>看答案</summary><div>A，第 1、2、5 條：推近沒寫前景與背景、移焦沒有觸發點、同一秒塞了兩件事。</div></details>
  </div>
</div>

還有一個小提醒：外部範例要挑著抄。我看過的兩個範例都用「攝影機最後緩緩停住」收尾，但如果故事要持續移動，每段都停住，接起來就是一頓一頓的。

## 你可以這樣開始 {#start}

1. 把你常用的「電影感」關鍵字列出來，逐一標上第一、二、三層。
2. 把第二層的詞從指令裡拿掉，改寫成分鏡表上的獨立鏡頭或剪輯備註。
3. 寫一份全片風格設定（類型、光色、調色），每一鏡沿用，不每鏡換。
4. 每次付費生成前，對指令跑一次上面五項自查。
5. 和團隊先統一用詞。我光是「垂直搖鏡」這一個動作，就在不同筆記裡看到三、四種譯法，最後指定一套當標準。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-camera-language-prompt" data-type="image" href="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-cheatsheet.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-cheatsheet-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-camera-language-prompt-cheatsheet.svg' | relative_url }}" width="1200" height="954" alt="鏡頭語言速查卡：第一層的景別、運鏡、移焦、光線、框中框寫進指令，一鏡只給一個主要運鏡；第二層的過肩、反應鏡頭、交叉剪輯、蒙太奇、慢動作、一鏡到底、溶接、淡入淡出寫進分鏡表；第三層的類型、敘事技法與調色寫進全片風格，定一次每一鏡沿用。">
    </picture>
  </a>
  <figcaption>圖 6：鏡頭語言速查卡，寫指令前對一下這個詞該放哪裡。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

---

## 這個系列接著讀

- [沒念過影視，也想做 AI 影片？先補這四個基本功，比挑模型更重要]({{ '/technical/ai-video-basics-for-non-film/' | relative_url }})
- [AI 影片生出來，到底能不能用？用三種判定取代「感覺還可以」]({{ '/technical/ai-video-quality-review-three-verdicts/' | relative_url }})
- [AI 影片不是輸入一句話就好：6 天彩排 3 支成片，我踩過的審核、參考圖與成本問題]({{ '/technical/ai-video-production-rehearsal-seedance-workflow/' | relative_url }})
- 系列入口：[AI 影片製作筆記]({{ '/technical/ai-video/' | relative_url }})
- 術語看不懂，可以查[AI 影片白話術語表]({{ '/technical/ai-video/glossary/' | relative_url }})

## 參考資料

- [VVSVS：Cinematique 電影技法提示詞資料庫](https://vvsvs.pro/cinematique)
- [Cinematique：Dolly Shot 推軌技法頁](https://vvsvs.pro/cinematique/dolly-shot)
- [Cinematique：Rack Focus 移焦技法頁](https://vvsvs.pro/cinematique/rack-focus)
- [Cinematique：One-er 一鏡到底技法頁](https://vvsvs.pro/cinematique/one-er)
