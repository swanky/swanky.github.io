---
title: "想把小說拍成 AI 短劇？先別急著生影片：我用靜態圖做完十集《金瓶梅》的方法"
seo_title: "小說改編 AI 短劇怎麼做：靜態圖分鏡、先配音、人工關卡與連戲檢查（金瓶梅十集實例）"
date: 2026-10-10 11:00:00 +0800
categories: [technical]
tags: [ai-video, jinpingmei, storyboard, adaptation]
layout: article
learn_kit: true
use_glightbox: true
cta_context: agentic
related_posts:
  - jinpingmei-character-lab
  - ai-moderation-jinpingmei
  - ai-video-production-rehearsal-seedance-workflow
description: "想把小說拍成 AI 短劇？十集《金瓶梅》只用生成圖片、旁白與剪輯完成。從鎖原典、先配音到人工把關，一步步拆給你看。"
keywords: 小說改編,AI 短劇,金瓶梅,AI 分鏡,靜態圖影片,旁白,連戲,人工審核,史旺基
cover_image: /assets/img/linkedin/ai-video-jinpingmei-novel-adaptation.jpg
cover_alt: "成年水手服創作者在帶古典窗格與琵琶的夜間剪輯室，一手捧著線裝古書、一手把分鏡卡貼上牆，桌上螢幕先排好旁白波形、靜態畫面跟在後面"
hero_image: true
---

你手上有一本喜歡的小說，想把它拍成一集一集的短劇。最直覺的做法，是把劇情丟給影片生成模型，期待它自己演出來。

但長篇故事最難的往往不是「讓畫面動」，而是讓同一個人撐過十集不換臉，讓沒讀過原著的觀眾也看得懂。這篇用我做完的十集《金瓶梅》短劇，整理出一套非影視本科也能照著走的做法。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>不一定要用影片生成</strong>：十集全是生成的靜態圖，靠旁白、字幕與剪輯撐起來，第八到第十集新增的付費費用是 US$0。</li>
    <li><strong>順序是原典 → 聲音 → 分鏡</strong>：先鎖取材範圍與敏感邊界，配音定稿後才畫圖，畫面跟著聲音走。</li>
    <li><strong>找沒讀過原著的人看第一版</strong>：一句「我有點看不懂」，比所有自動檢查都更早發現問題。</li>
    <li><strong>機器說通過，不等於人核准</strong>：臉、讀音、道具數量，都要有人實際看過、聽過。</li>
  </ul>
</div>

<nav class="article-toc" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ul>
    <li><a href="#why-stills">先問：畫面真的需要動嗎？</a></li>
    <li><a href="#gates">十道關卡，兩條規則</a></li>
    <li><a href="#canon">第一步：鎖住原典和敏感邊界</a></li>
    <li><a href="#narration">「我有點看不懂」：最有價值的一句審核意見</a></li>
    <li><a href="#check">讀音、道具與資料外傳，都要有人點頭</a></li>
    <li><a href="#start">你可以這樣開始</a></li>
  </ul>
</nav>

素材是公共領域的《金瓶梅詞話》（萬曆本），全文收錄在站上的<a href="{{ '/jinpingmei/text/' | relative_url }}">原文書房</a>；十集成片、選角與角色參考圖組，都在<a href="{{ '/jinpingmei/studio/' | relative_url }}">金瓶梅影像工作室</a>。

## 先問：畫面真的需要動嗎？ {#why-stills}

這套短劇從第一天就定好格式：**生成的靜態圖片＋配音＋剪輯**，完全不用影片生成模型。十集片長從 3 分多鐘到將近 8 分鐘，合計約 54 分鐘。

<figure class="ae-epstrip">
<div class="ae-epstrip__row"><a class="ae-epstrip__item" href="{{ '/jinpingmei/studio/' | relative_url }}#ep08"><img src="{{ '/assets/img/games/plum/cinematic/ep08-thumbnail.jpg' | relative_url }}" width="1280" height="720" alt="EP08〈紅妝鬥氣〉影片封面：潘金蓮一身紅白衣裳、髮髻插著金飾，低眉坐在暖房書案前（AI 生成）" loading="lazy" decoding="async"><span>EP08〈紅妝鬥氣〉</span></a><a class="ae-epstrip__item" href="{{ '/jinpingmei/studio/' | relative_url }}#ep09"><img src="{{ '/assets/img/games/plum/cinematic/ep09-thumbnail.jpg' | relative_url }}" width="1280" height="720" alt="EP09〈失子與離世〉影片封面：李瓶兒淺灰衣裙、懷裡抱著孩子的紅色小衣低頭垂淚，身旁一位深褐外袍的年長婦人搭著她的肩（AI 生成）" loading="lazy" decoding="async"><span>EP09〈失子與離世〉</span></a><a class="ae-epstrip__item" href="{{ '/jinpingmei/studio/' | relative_url }}#ep10"><img src="{{ '/assets/img/games/plum/cinematic/ep10-thumbnail.jpg' | relative_url }}" width="1280" height="720" alt="EP10〈月夜出門到重遊舊園〉影片封面：春梅身穿磚紅上衣、灰藍百褶裙，一手撐在擺著一串鑰匙的木櫃上，站在堆滿箱籠的屋內（AI 生成）" loading="lazy" decoding="async"><span>EP10〈月夜出門到重遊舊園〉</span></a></div>
<figcaption>第八到第十集的影片封面（AI 生成）。點圖到影像工作室看成片。</figcaption>
</figure>

我選靜態圖，是因為長篇古裝故事要的東西跟動作片不一樣：

- **人物要撐十集不換臉。**每生成一次，臉就可能跑掉；靜態圖可以一張一張放大檢查，不合格就退件。
- **劇情靠對白與心事推進。**多數畫面只要「讀得懂的一瞬間」，不需要角色真的走路、倒水。
- **成本壓得很低。**第八到第十集，圖片用 ChatGPT 訂閱裡的生圖額度，配音用免費的語音合成服務，新增的付費費用是 US$0。

<div class="ae-quizband">
  <div class="ae-quiz" data-ae-quiz="B">
    <div class="ae-quiz__top"><span class="ae-quiz__badge"><i class="bi bi-bullseye" aria-hidden="true"></i>小測驗</span></div>
    <p class="ae-quiz__q">下面哪一種故事，最適合先試「靜態圖＋旁白」？</p>
    <ul class="ae-quiz__opts">
      <li><button type="button" class="ae-quiz__opt" data-option="A"><span class="ae-quiz__letter">A</span><span>整集都是打鬥、追逐的動作戲</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="B"><span class="ae-quiz__letter">B</span><span>靠對白與心事推進、人物要撐很多集的長篇故事</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="C"><span class="ae-quiz__letter">C</span><span>重點是角色連續走位、跳舞的短片</span></button></li>
    </ul>
    <div class="ae-quiz__result" tabindex="-1" hidden>
      <strong data-ae-verdict></strong> 以對白與心事為主的故事，多數畫面只要「讀得懂的一瞬間」；人物要撐很多集不換臉，靜態圖也能一張一張放大檢查。
      <ul class="ae-quiz__why">
        <li><b>A、C</b>：賣點就是動作本身。這篇的做法是為對白與心事設計的，不用 AI 變形假裝角色走路或倒下。</li>
      </ul>
      <button type="button" class="ae-btn" data-ae-quiz-reset style="margin-top:.75rem">再試一次</button>
    </div>
    <details class="ae-reveal ae-quiz-answer-static"><summary>看答案</summary><div>B，靠對白與心事推進的長篇故事。</div></details>
  </div>
</div>

靜態圖也不能一張撐到底。我給自己的規則是：

- **不用 AI 變形假裝角色走路、接吻或倒下**，也不要每張圖都慢慢放大（看三張就膩了）。
- **運鏡要有理由**：緩推＝人物意識到真相，緩拉＝她被空間包圍。
- **同一構圖做第二張狀態圖**，只改一件事，例如「手握簪／簪落地」，用剪接代替生成動作。
- **每 6 到 10 秒，至少要有一個聲音或畫面的變化。**一張圖硬撐 20 秒，就是在消耗觀眾。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-jinpingmei-novel-adaptation" data-type="image" href="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-stills-motion.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-stills-motion-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-stills-motion.svg' | relative_url }}" width="1200" height="690" alt="靜態圖讓畫面有變化的四種做法：緩推用在人物意識到真相、緩拉表現被空間包圍、同一構圖做第二張狀態圖只改一件事、每 6 到 10 秒至少一個聲音或畫面的變化">
    </picture>
  </a>
  <figcaption>圖 1：靜態圖也能「動」，但運鏡要有理由 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 十道關卡，兩條規則 {#gates}

從第五集起，我把整個流程拆成十道關卡，前一關沒過，就不進下一關。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-jinpingmei-novel-adaptation" data-type="image" href="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-gates.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-gates-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-gates.svg' | relative_url }}" width="1200" height="750" alt="十道關卡依序是取材範圍、事件對照、劇本、聲音、分鏡畫面、全部圖片、粗剪、最終檢查、核准上片、覆盤；聲音比分鏡先鎖定；粗剪發現台詞錯就退回劇本關；機器檢查通過不等於人工核准">
    </picture>
  </a>
  <figcaption>圖 2：十道關卡的順序，以及退回與核准的兩條規則 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

關卡的數量不是重點，重點是兩條規則：

1. **改哪裡，就回到最早受影響的那一關。**台詞錯了就回劇本關，後面已經通過的配音與剪輯，全部重新審。
2. **機器檢查通過，不等於人工核准。**程式可以確認檔案都在、尺寸正確、句數沒少；但臉對不對、這句話演得像不像，要人看、要人聽。

還有一個順序是刻意的：**聲音比分鏡先鎖定。**旁白實際唸多長，決定每張圖要停多久。先畫圖再配音，最後一定是在剪輯台上削足適履。

## 第一步：鎖住原典和敏感邊界 {#canon}

以第八集〈紅妝鬥氣〉為例，開工第一步不是寫劇本，而是把取材範圍鎖在<a href="{{ '/jinpingmei/text/040/' | relative_url }}">第四十回</a>與<a href="{{ '/jinpingmei/text/041/' | relative_url }}">第四十一回</a>，列出這兩回的六個關鍵事件，由我逐一核對。

同一份開工清單也先寫好敏感內容怎麼處理，例如：

- 角色扮成丫鬟的段落，維持成年的臉與身形。
- 丫鬟受罰不拍身體接觸，改用偏頭、茶盤落地與旁人反應來表現。
- 兩個角色受辱、受害的事都要清楚呈現，**不能互相抵銷**。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-jinpingmei-novel-adaptation" data-type="image" href="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-canon-sheet.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-canon-sheet-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-canon-sheet.svg' | relative_url }}" width="1200" height="760" alt="第八集的取材清單：取材鎖在第四十回與第四十一回，列出六個關鍵事件逐一核對，並先寫好三條敏感內容的拍法">
    </picture>
  </a>
  <figcaption>圖 3：開工第一張紙：取材清單（以第八集為例） <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

這一步看起來像在拖時間，其實是防兩件事：AI 用推論補上原文沒有的情節，以及生圖時才發現某個畫面根本不該這樣拍。

生圖指令我也寫成固定清單：畫風、角色基準圖、場景方位、一個看得懂的動作瞬間、構圖、道具數量、光線，再加一份排除清單。其中一條我到處沿用：**中文字一律後製排版，不讓圖片模型寫字。**模型寫的中文常是假字，一出錯整張圖就不能用。

## 「我有點看不懂」：最有價值的一句審核意見 {#narration}

第八集的第一版約 4 分鐘，技術檢查全部通過。我看完之後的審核意見是：

> 「建議字幕加上是誰說的話，其實這部我有點看不懂，很多畫面都沒有旁白，有沒有辦法加一些旁白來讓我覺得比較好懂或是比較精彩」

所有自動檢查都只能確認「東西都在」，沒有一項能回答「觀眾看不看得懂」。

AI 助手第一次補的旁白，寫成了一份解說稿。我沒讓它送出，只補了一個方向：旁白要跟前幾集同一種語氣，不要像在上課。它回去對照前兩集已發布的字幕，重寫成 14 段，用**動作、物件與心事**串起事件。

第二版變成 6 分 14 秒，每段字幕都標出是誰在說話，畫面也依每句配音的實際長度重新排。最後我還做了一個減法：**拿掉全部配樂**，只留旁白、對白與畫面，第九、第十集也照這個做法。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-jinpingmei-novel-adaptation" data-type="image" href="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-narration-v1-v2.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-narration-v1-v2-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-narration-v1-v2.svg' | relative_url }}" width="1200" height="750" alt="第八集從第一版約 4 分鐘、很多畫面沒有旁白，經過一份沒送出的解說稿，改成第二版 6 分 14 秒、14 段故事旁白、字幕標出說話者並拿掉配樂">
    </picture>
  </a>
  <figcaption>圖 4：第八集第一版到第二版，中間發生了什麼 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

示意：下面兩句旁白是依本文原則寫的範例，<strong>不是成片台詞</strong>。同一件事：他等了一整晚的電話，最後沒有響。哪一句是「故事旁白」？

<div class="ae-traits">
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">A</span><h3>旁白 A（示意）</h3><p>「這一段表現出他在對方心中並不重要，內心十分失落。」</p><p class="ae-flip__fix">這是故事旁白嗎？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>這是解說稿</h3><p>直接替觀眾下結論，<strong>像在上課</strong>。觀眾聽到的是評語，不是故事。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">B</span><h3>旁白 B（示意）</h3><p>「他把手機翻過來，又翻回去。十二點過了，螢幕一次也沒亮。」</p><p class="ae-flip__fix">這是故事旁白嗎？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>這是故事旁白</h3><p>用<strong>動作</strong>（翻手機）、<strong>物件</strong>（手機）和<strong>心事</strong>（等電話）串起事件，失落讓觀眾自己感覺到。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
</div>

## 讀音、道具與資料外傳，都要有人點頭 {#check}

**每張圖最多生成兩次。**我曾在睡前請 AI 助手把能生的分鏡先生出來，醒來再一起審；一個晚上產出 47 張候選。範圍事先寫死：不花錢做影片、不上傳，每張最多兩次。有一張第二次沒有回傳，它沒有自己重送，而是保留第一版、把差異寫清楚交給我判斷。這條上限逼你停下來問：是指令寫錯，還是這個畫面本來就不該用生成的？

**讀音要人耳確認。**第二版我覺得有個詞唸起來怪怪的，請它重查。它逐句重查了文字讀音，但也照實寫明：當時的環境聽不到音訊，實際發音仍要人耳確認。這比一句「已全部校正」誠實得多。

**道具照畫面寫，不照提示詞寫。**有一張圖的指令要三顆木球，畫面只生出兩顆，紀錄就寫「實際兩顆」，再判斷影不影響劇情。包袱一開始用哪隻手提，後面出門的鏡頭也要沿用同一隻手。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-jinpingmei-novel-adaptation" data-type="image" href="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-prompt-vs-actual.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-prompt-vs-actual-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-jinpingmei-novel-adaptation-prompt-vs-actual.svg' | relative_url }}" width="1200" height="810" alt="提示詞要三顆木球，畫面只生出兩顆，紀錄照畫面寫實際兩顆；連戲檢查：包袱一開始用哪隻手提，後面出門的鏡頭也沿用同一隻手">
    </picture>
  </a>
  <figcaption>圖 5：照畫面寫紀錄，不照提示詞寫 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

**資料外傳要先同意。**免費的語音合成服務，代表每句台詞都要傳到外部。第八集補旁白時，第一次外傳先被自動審查擋下，等我明確同意才送；第九、第十集的新台詞，AI 助手也沒有沿用上一次的同意，而是再問一次。**資料什麼時候離開你的電腦，應該是有人負責的決定。**

完成後，我還用拉片工具回頭量了第八集的剪接點，46 刀全部對上剪輯時間軸；方法寫在<a href="{{ '/technical/ai-video-reference-breakdown/' | relative_url }}">拆解 AI 影片那一篇</a>。成片在這裡：

<div style="position:relative;width:100%;aspect-ratio:16 / 9;margin:2em 0;border-radius:14px;overflow:hidden;background:#000;">
  <iframe src="https://www.youtube-nocookie.com/embed/biJZfl92ys0?rel=0" title="她穿上最紅的新衣，為什麼還是站不到那一圈裡？｜《金瓶梅》EP08〈紅妝鬥氣〉" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>
</div>

所有人物影像、分鏡與語音都是 AI 生成，不是真人或實拍；成片已標註 AI 生成。

## 你可以這樣開始 {#start}

1. **先判斷畫面需不需要真的動。**以對白與心事為主的故事，先試「靜態圖＋旁白＋有理由的運鏡」。
2. **開工前寫一頁取材清單**：用哪幾章、關鍵事件有哪些、敏感內容怎麼拍。
3. **先錄好旁白再畫分鏡**，讓聲音決定每張圖停多久。
4. **每張圖設生成上限**，例如兩次；第二次還不行，就回頭檢查指令或換畫面。
5. **第一版給沒讀過原著的人看**，問他一句：「哪裡看不懂？」

---

## 這個系列接著讀

- <a href="{{ '/technical/ai-video/' | relative_url }}">AI 影片製作筆記</a>
- <a href="{{ '/technical/ai-video-reference-breakdown/' | relative_url }}">看到厲害的 AI 影片想學？先別抄提示詞，拆清楚它到底做到了什麼</a>
- <a href="{{ '/technical/ai-video-consistency-reference-previs/' | relative_url }}">AI 影片的角色每一鏡都長得不一樣？五個做法讓角色不走樣</a>
- <a href="{{ '/technical/ai-video-agent-human-gates/' | relative_url }}">讓 AI 助手幫你做影片，又不會半夜亂花錢</a>
- <a href="{{ '/claude-code/jinpingmei-character-lab/' | relative_url }}">用 AI 替一部百回小說建立全劇組角色設定</a>
- <a href="{{ '/technical/ai-moderation-jinpingmei/' | relative_url }}">當 AI 拒絕金瓶梅：測出大語言模型的道德邊界</a>
