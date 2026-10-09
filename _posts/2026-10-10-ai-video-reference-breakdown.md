---
title: "看到厲害的 AI 影片想學？先別抄提示詞，拆清楚它到底做到了什麼"
seo_title: "怎麼拆解別人的 AI 影片：參考案例四欄筆記、拉片量切點、哪些交給程式哪些要人看"
date: 2026-10-10 11:30:00 +0800
categories: [technical]
tags: [ai-video, shot-breakdown, reference, workflow]
layout: article
learn_kit: true
use_glightbox: true
cta_context: agentic
related_posts:
  - ai-video-camera-language-prompt
  - ai-video-quality-review-three-verdicts
  - ai-video-jinpingmei-novel-adaptation
description: "看到厲害的 AI 影片，先別急著抄提示詞。用四個問題拆解參考案例，再用程式量切點，分清哪些能學、哪些只是剪得好。"
keywords: AI 影片拉片,參考案例,拆解 AI 影片,切點偵測,景別,運鏡,提示詞,史旺基
cover_image: /assets/img/linkedin/ai-video-reference-breakdown.jpg
cover_alt: "成年水手服創作者在看片室的發光桌面前，一手拎起長條底片逐格細看、一手在平板時間軸上畫紅色切點，桌上有量尺、捲尺、剪刀和打勾打叉的分類卡"
hero_image: true
---

在社群上滑到一支很厲害的 AI 影片，第一個念頭通常是：「提示詞呢？我也要。」

我一開始也是這樣。後來發現，照抄提示詞通常做不出同樣的片，原因不在提示詞，而在**你根本不知道那支片是怎麼做出來的**：一次生成，還是十段剪起來？這篇整理我拆參考影片的方法，讓你看片時先分清楚哪些能學、哪些只是剪得好。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>先問「它到底做到了什麼」</strong>：我收的 75 支 AI 影片案例裡，有 43 支無法從成片判斷是不是一次生成的。</li>
    <li><strong>每個案例只寫四件事</strong>：為什麼值得看、可以學什麼、哪裡不能信、適不適合我的案子。</li>
    <li><strong>拉片要分工</strong>：切點與秒數交給程式量，景別與運鏡才交給模型判斷，漸變轉場要人看。</li>
    <li><strong>量尺不是評審</strong>：鏡頭表全部對得上，不代表片子好看或沒有穿幫。</li>
  </ul>
</div>

<nav class="article-toc" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ul>
    <li><a href="#fields">每個案例只寫四件事</a></li>
    <li><a href="#risk">最有用的一欄是「哪裡不能信」</a></li>
    <li><a href="#cases">六個值得拆的案例</a></li>
    <li><a href="#breakdown">拉片：程式量切點，模型只判斷</a></li>
    <li><a href="#prompt-vs-cut">提示詞說在 3.5 秒切，片子沒有</a></li>
    <li><a href="#consistency">量尺，不是評審</a></li>
    <li><a href="#start">你可以這樣開始</a></li>
  </ul>
</nav>

## 每個案例只寫四件事 {#fields}

我替自己做了一個參考案例庫，到 2026 年 9 月中收了 121 個案例，只給自己研究用。別人的影片、圖片與完整提示詞**不轉貼、不公開**；這篇引用時，只寫作者帳號、一句話描述與原貼文連結。

每收一個案例，我只寫四個欄位：

1. **為什麼值得看**：一句話說清楚它厲害在哪。
2. **可以學什麼**：拆成可以搬到自己案子的做法。
3. **哪裡不能信**：貼文宣稱與畫面不符的地方、沒公開的資訊、權利疑慮。
4. **適不適合我的案子**：這個做法放到我手上的題目，風險高還是低。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-reference-breakdown" data-type="image" href="{{ '/assets/img/ai-video/ai-video-reference-breakdown-notecard.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-reference-breakdown-notecard-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-reference-breakdown-notecard.svg' | relative_url }}" width="1200" height="740" alt="參考案例筆記卡範本，用虛構的示意範例填寫：為什麼值得看、可以學什麼、哪裡不能信、適不適合我的案子，第三欄「哪裡不能信」最重要">
    </picture>
  </a>
  <figcaption>圖 1：參考案例筆記卡，四欄的填法（範例為虛構示意，非實例） <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 最有用的一欄是「哪裡不能信」 {#risk}

121 個案例裡有 75 個附影片。回頭統計我自己寫的「哪裡不能信」欄位：

- **43 支**都寫到同一件事：**無法從成片判斷是不是一次生成的**，其中多數明顯是多段剪接。
- 很多貼文沒附完整提示詞，或附的提示詞跟畫面對不上。
- 有些貼文本身是工具商的合作宣傳，宣稱的效果沒有對照。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-reference-breakdown" data-type="image" href="{{ '/assets/img/ai-video/ai-video-reference-breakdown-waffle.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-reference-breakdown-waffle-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-reference-breakdown-waffle.svg' | relative_url }}" width="1200" height="720" alt="75 支有影片的參考案例裡，43 支我在筆記寫到無法從成片判斷是不是一次生成；社群上的 30 秒短片，背後可能是好幾段剪起來的">
    </picture>
  </a>
  <figcaption>圖 2：75 支有影片的案例，每格一支；紅色是看不出是否一次生成的 43 支 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

這對剛入門的人很重要。你看到「一個提示詞生成 30 秒電影感短片」，背後很可能是好幾段素材剪起來的。拿它當標準要求自己的第一支片，只會覺得工具很爛、或自己很爛。

## 六個值得拆的案例 {#cases}

以下都避開既有影視或動漫角色，只用我自己的話轉述，畫面請點原貼文看。

<div class="ae-grid ae-cases" style="--cols:2">
  <div class="ae-card ae-case" data-c="llm"><p class="ae-case__by"><span class="ae-case__num">1</span>作者 @saniaspeaks_</p><h3>臥室四鏡頭連戲</h3><p class="ae-case__row"><b>學什麼</b>用三張參考圖鎖住人物、服裝與房間，提示詞把動作、燈光與聲音寫得像驗收規格。</p><p class="ae-case__row ae-case__row--warn"><b>別信什麼</b>它要求的切點時間跟實際對不上（下面量給你看）。</p><p class="ae-case__link"><a href="https://x.com/saniaspeaks_/status/2078474489063678257">看原貼文 <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a></p></div>
  <div class="ae-card ae-case" data-c="llm"><p class="ae-case__by"><span class="ae-case__num">2</span>作者 @PixelAigc</p><h3>古建木雕活過來又變回去</h3><p class="ae-case__row"><b>學什麼</b>「靜止 → 局部變化 → 回到原狀」的短循環。</p><p class="ae-case__row ae-case__row--warn"><b>別信什麼</b>這支 26 秒的片，其實是六段約 4 到 5 秒的素材剪成的。</p><p class="ae-case__link"><a href="https://x.com/PixelAigc/status/2078657396281577515">看原貼文 <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a></p></div>
  <div class="ae-card ae-case" data-c="llm"><p class="ae-case__by"><span class="ae-case__num">3</span>作者 @PixelAigc</p><h3>同一段提示詞丟給兩個模型比</h3><p class="ae-case__row"><b>學什麼</b>比較的思路：作者把別人寫的 30 秒打鬥提示詞丟進另一個模型。</p><p class="ae-case__row ae-case__row--warn"><b>別信什麼</b>只生出 15 秒；作者自評約有對照模型的「六成」效果，但這是主觀自評，貼文也沒附兩邊影片並列。</p><p class="ae-case__link"><a href="https://x.com/PixelAigc/status/2098542029865447875">看原貼文 <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a></p></div>
  <div class="ae-card ae-case" data-c="llm"><p class="ae-case__by"><span class="ae-case__num">4</span>作者 @FMediaart5698</p><h3>65 秒長段預告</h3><p class="ae-case__row"><b>學什麼</b>長片節奏：靠逼近的腳步聲與威脅感一路升級。</p><p class="ae-case__row ae-case__row--warn"><b>別信什麼</b>這是剪輯工具的合作宣傳，沒公開完整提示詞，生成次數與剪接工作量都不明。</p><p class="ae-case__link"><a href="https://x.com/FMediaart5698/status/2078387589548265558">看原貼文 <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a></p></div>
  <div class="ae-card ae-case" data-c="llm"><p class="ae-case__by"><span class="ae-case__num">5</span>作者 @jackzhang123vip</p><h3>先做白模，再渲染成兩種美術風格</h3><p class="ae-case__row"><b>學什麼</b>作者先貼一段沒上材質的灰白 3D 動作預覽，隔天貼出同一段動作的兩種渲染版本：動作與構圖很可能在白模階段就定好了。</p><p class="ae-case__row ae-case__row--warn"><b>別信什麼</b>沒說白模與渲染用了什麼工具。</p><p class="ae-case__link"><a href="https://x.com/jackzhang123vip/status/2098990013325390178">看原貼文 <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a></p></div>
  <div class="ae-card ae-case" data-c="llm"><p class="ae-case__by"><span class="ae-case__num">6</span>作者 @PixelAigc</p><h3>58 支影片的批次翻車</h3><p class="ae-case__row"><b>學什麼</b><strong>批次任務不會繼承你沒寫進去的要求</strong>，大批開跑前先抽一兩支驗證。</p><p class="ae-case__row ae-case__row--warn"><b>別信什麼</b>批次指令只寫「照前面的做」：AI 助手批次跑了約 14 小時，58 支全變成同一種古詩朗誦風，而不是原本要的搞笑。</p><p class="ae-case__link"><a href="https://x.com/PixelAigc/status/2098617270524428690">看原貼文 <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a></p></div>
</div>

<p class="ae-tip"><b>練習一下（示意，非實例）：</b>假設你滑到一則貼文：「一個提示詞生成 30 秒電影感短片！」沒附提示詞，角落還標著合作。下面四張卡，先想想哪裡能信、哪裡不能，再翻面。</p>

<div class="ae-traits" id="trust-cards">
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">1</span><h3>「一個提示詞生成 30 秒」</h3><p>貼文宣稱一次就生出整支片。</p><p class="ae-flip__fix">能信嗎？</p><p class="ae-flip__hint">先想一下，再點我看解析 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>先打問號</h3><p>背後可能是好幾段剪起來的。我收的 75 支有影片案例裡，<strong>43 支無法從成片判斷是不是一次生成</strong>。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">2</span><h3>沒附提示詞</h3><p>只有成片，沒有寫法。</p><p class="ae-flip__fix">能信嗎？</p><p class="ae-flip__hint">先想一下，再點我看解析 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>無從驗證</h3><p>沒附就無法對照；就算附了，也可能跟畫面對不上。寫進「哪裡不能信」。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">3</span><h3>標註合作</h3><p>角落寫著和工具商合作。</p><p class="ae-flip__fix">能信嗎？</p><p class="ae-flip__hint">先想一下，再點我看解析 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>當成宣傳看</h3><p>可能是工具商的合作宣傳，宣稱的效果<strong>要有對照才算數</strong>。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">4</span><h3>畫面真的很好看</h3><p>光影、節奏都很漂亮。</p><p class="ae-flip__fix">能學嗎？</p><p class="ae-flip__hint">先想一下，再點我看解析 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>能學，但要拆</h3><p>寫進「可以學什麼」之前，先分清楚它是一次生成、還是剪得好。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
</div>

<p><button type="button" class="ae-btn" data-ae-flip-all="#trust-cards">全部翻開對答案</button></p>

## 拉片：程式量切點，模型只判斷 {#breakdown}

「拉片」是影視圈的老功夫：把一支成片拆回逐鏡頭表，記下每鏡幾秒、拍多近（景別）、攝影機怎麼動（運鏡）、畫面是什麼。

現在很多人會想：丟給 AI 看就好。問題是，**讓模型自己數切點、算秒數，它會數錯，而且你很難發現。**我後來採用的分工是：

| 工作 | 交給誰 |
|---|---|
| 切點（兩個鏡頭交接的那一格）、每鏡秒數、畫面動多少 | 程式量 |
| 景別、運鏡、畫面描述 | 模型看代表畫格判斷 |
| 最後對帳：秒數加總、說「推近」的鏡頭畫面真的有動 | 程式檢查 |
| 漸變轉場、「該動卻沒動」、好不好看 | 人看 |

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-reference-breakdown" data-type="image" href="{{ '/assets/img/ai-video/ai-video-reference-breakdown-division.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-reference-breakdown-division-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-reference-breakdown-division.svg' | relative_url }}" width="1200" height="740" alt="拉片三方分工：程式像尺，量切點、秒數與畫面動多少；模型像眼睛，看代表畫格判斷景別、運鏡與畫面描述，但自己數切點會數錯；人抓漸變轉場、該動卻沒動與好不好看">
    </picture>
  </a>
  <figcaption>圖 3：拉片分三方，各做自己擅長的事 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

這套分工來自開源專案 <a href="https://github.com/eternityspring/reelbench-skills" target="_blank" rel="noopener">reelbench-skills</a>（作者 eternityspring，Apache-2.0 授權）的拉片功能，量切點用的是免費影片處理工具 FFmpeg。我在自己電腦上的複本改成正體中文，也把「跳過的檢查算通過」改成「**跳過＝沒驗**」。整套不花錢，一支 6 分多鐘的片，量完只要約 22 秒。

我先拿自己的片測，因為自己的片有標準答案。有兩件事值得知道：

- **同角色、同色調的片會漏刀。**在一支 CloneX 彩排片裡，有一刀從米白色的門切到白色長廊，意思完全不同，但亮度與顏色太像，預設靈敏度就以為沒切。把門檻從預設 0.30 調到 0.15 之後，另一支片（我的《金瓶梅》第八集）46 刀就全中了。
- **多抓的一刀，可能是真的。**有一刀落在一段 AI 生成片段的中間：模型自己偷偷切了一刀。這正是拉片最有用的地方，**它能抓到模型沒照你的鏡頭結構出片。**

<div class="ae-quizband">
  <div class="ae-quiz" data-ae-quiz="B">
    <div class="ae-quiz__top"><span class="ae-quiz__badge"><i class="bi bi-bullseye" aria-hidden="true"></i>小測驗</span></div>
    <p class="ae-quiz__q">你想知道一支參考影片每一鏡幾秒，交給誰最可靠？</p>
    <ul class="ae-quiz__opts">
      <li><button type="button" class="ae-quiz__opt" data-option="A"><span class="ae-quiz__letter">A</span><span>丟給模型看片，請它直接數</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="B"><span class="ae-quiz__letter">B</span><span>用程式量切點，再算出每鏡秒數</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="C"><span class="ae-quiz__letter">C</span><span>照提示詞裡寫的秒數抄下來</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="D"><span class="ae-quiz__letter">D</span><span>看一遍，憑感覺估</span></button></li>
    </ul>
    <div class="ae-quiz__result" tabindex="-1" hidden>
      <strong data-ae-verdict></strong> 數字交給程式量，判斷才交給模型。同色調的片記得把偵測門檻調低，免得漏刀。
      <ul class="ae-quiz__why">
        <li><b>A 模型直接數</b>：它會數錯，而且你很難發現。</li>
        <li><b>C 照提示詞抄</b>：提示詞寫的秒數不一定兌現，下一段就是例子。</li>
      </ul>
      <button type="button" class="ae-btn" data-ae-quiz-reset style="margin-top:.75rem">再試一次</button>
    </div>
    <details class="ae-reveal ae-quiz-answer-static"><summary>看答案</summary><div>B，用程式量切點，再算出每鏡秒數。</div></details>
  </div>
</div>

## 提示詞說在 3.5 秒切，片子沒有 {#prompt-vs-cut}

拉片也能拿來拆別人的片（第三方影片只在自己電腦上分析，不散布）。上面第一個案例的提示詞，明確寫了三個硬切時間點，實測卻是這樣：

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-reference-breakdown" data-type="image" href="{{ '/assets/img/ai-video/ai-video-reference-breakdown-prompt-vs-cut.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-reference-breakdown-prompt-vs-cut-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-reference-breakdown-prompt-vs-cut.svg' | relative_url }}" width="1200" height="720" alt="提示詞要求在 3.5、7.5、11.0 秒切換鏡頭，實際量到的切點在 2.29、5.25、9.83 秒，差距 1.21、2.25、1.17 秒都不一樣，代表不是片頭被裁掉，而是模型沒照時間碼切">
    </picture>
  </a>
  <figcaption>圖 4：同一支參考影片，提示詞要求的切點與實際量到的切點 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

有趣的是，**換機位、燈光由暖轉冷這類畫面指令，它倒是照做了。**這只是一支片的觀察，不是規則；但它提醒我：寫在提示詞裡的精確秒數，不要當成一定會兌現的規格，剪接點最好留到剪輯時自己決定。

## 量尺，不是評審 {#consistency}

拉片工具最後會跑一輪檢查：時間軸連續、秒數加總正確、描述夠具體、運鏡有畫面證據。全部通過時，報告上會出現漂亮的「全部通過」。

但它保證的只有一件事：**這份鏡頭表沒有自相矛盾。**手有沒有崩、角色有沒有走樣、聲音和畫面有沒有對上、好不好看，它都證明不了，上游專案也寫明它不評價片子好壞。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-reference-breakdown" data-type="image" href="{{ '/assets/img/ai-video/ai-video-reference-breakdown-ruler-vs-judge.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-reference-breakdown-ruler-vs-judge-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-reference-breakdown-ruler-vs-judge.svg' | relative_url }}" width="1200" height="720" alt="量尺，不是評審：拉片工具能確認鏡頭表資料一致，例如時間軸連續、秒數加總正確；但手有沒有崩、角色有沒有走樣、聲畫有沒有對上、好不好看，它證明不了，仍要人看">
    </picture>
  </a>
  <figcaption>圖 5：「全部通過」只到虛線為止，下面那層要人看 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

所以拉片結果不能取代人看片。品質判定仍是三種結果之一，詳見<a href="{{ '/technical/ai-video-quality-review-three-verdicts/' | relative_url }}">品質驗收那一篇</a>。它真正的價值，是讓我和 AI 助手討論一支片時，有一份量得出來的共同依據。

## 你可以這樣開始 {#start}

1. **下次存參考影片時，順手寫四欄**：為什麼值得看、可以學什麼、哪裡不能信、適不適合我。
2. **先問「它到底做到了什麼」**：一次生成還是剪接？是不是合作宣傳？提示詞有沒有公開？
3. **數字交給程式，判斷交給模型，好不好看交給人。**
4. **把「提示詞宣稱」和「實際結果」並排**，看哪些控制真的有效。
5. **批次生成前先抽一兩支驗證**，別讓沒寫進去的要求被默默丟掉。

---

## 這個系列接著讀

- <a href="{{ '/technical/ai-video/' | relative_url }}">AI 影片製作筆記：系列入口</a>
- <a href="{{ '/technical/ai-video-camera-language-prompt/' | relative_url }}">寫了一堆「電影感」關鍵字，AI 影片還是拍不出來？先把鏡頭語言分成三層</a>
- <a href="{{ '/technical/ai-video-quality-review-three-verdicts/' | relative_url }}">AI 影片生出來，到底能不能用？用三種判定取代「感覺還可以」</a>
- <a href="{{ '/technical/ai-video-jinpingmei-novel-adaptation/' | relative_url }}">想把小說拍成 AI 短劇？先別急著生影片：我用靜態圖做完十集《金瓶梅》的方法</a>
- <a href="{{ '/technical/ai-video-model-comparison-method/' | relative_url }}">排行榜第一名，不一定適合你的鏡頭：用同一張圖讓 AI 影片模型對打</a>
