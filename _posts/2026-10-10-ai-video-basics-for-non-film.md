---
title: "沒念過影視，也想做 AI 影片？先補這四個基本功，比挑模型更重要"
seo_title: "非影視背景做 AI 影片入門：製作流程、核准點、分鏡寫法與交付規格"
date: 2026-10-10 09:15:00 +0800
categories: [technical]
tags: [ai-video, storyboard, workflow, delivery, beginner]
layout: article
learn_kit: true
use_glightbox: true
cta_context: agentic
related_posts:
  - ai-video-camera-language-prompt
  - ai-video-quality-review-three-verdicts
  - ai-video-production-rehearsal-seedance-workflow
description: "模型只是素材來源之一。非影視背景做 AI 影片，先補流程、核准點、分鏡寫法與交付規格，才交得出一支完整的片。"
keywords: AI 影片,影片製作流程,分鏡,動態分鏡,核准,交付規格,字幕,非影視本科,史旺基
cover_image: /assets/img/linkedin/ai-video-basics-for-non-film.jpg
cover_alt: "成年水手服創作者站在環形製作室中央，一手把分鏡卡釘上軟木板、一手拿筆記本核對，身後一圈八個工作站從腳本、分鏡、生成、剪輯、聲音、字幕一路排到交件"
hero_image: true
---

你可能已經會寫指令、也試過幾個模型，生出來的片段看起來都不錯。但一到要剪成完整影片、交給老闆或客戶，就開始卡：少了鏡頭、聲音對不上，對方要字幕檔，你手上只有燒好字幕的影片。

我是工程背景，拍了十年制服人像，但沒念過影視。做了幾輪 AI 影片後我發現，最弱的不是指令，而是影視圈覺得理所當然的那些事。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>生成只是八站裡的一站</strong>：前面有需求、腳本、分鏡，後面有剪輯、聲音、字幕和交件。</li>
    <li><strong>核准不是不能改</strong>：而是改的時候，知道會牽動哪幾步、要多花多少。</li>
    <li><strong>每一格分鏡至少回答七件事</strong>：用 AI 生成，還要再加參考圖和「看到什麼才算過」。</li>
    <li><strong>交付規格要先寫下來</strong>：尺寸、幀率、聲音、字幕檔、無字版，最後一公里最容易出包。</li>
  </ul>
</div>

<nav class="article-toc" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ul>
    <li><a href="#pipeline">基本功一：看懂整條流程</a></li>
    <li><a href="#approval">基本功二：把核准點當成「改動價目表」</a></li>
    <li><a href="#storyboard">基本功三：分鏡每格回答七件事</a></li>
    <li><a href="#delivery">基本功四：交付規格先寫下來</a></li>
    <li><a href="#start">你可以這樣開始</a></li>
  </ul>
</nav>

這篇整理自一份接案教學手冊，加上我自己踩過的坑。手冊的核心主張只有一句：**先學會交付，再擴充工具。**手冊裡的數字都標明是教學假設或練習起點，不是市場行情，我引用時也照標。

## 基本功一：看懂整條流程 {#pipeline}

影片製作大致分四段：**前期**決定給誰看、要讓對方懂什麼；**製作**取得畫面與聲音；**後期**排順序、混音、上字幕；**交付**處理格式、修改與使用權。

AI 模型只是「製作」這一段裡的一種素材來源，跟實拍、錄音、螢幕錄影是平行的選項。拆細一點，就是下面這八站。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-basics-for-non-film" data-type="image" href="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-pipeline.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-pipeline-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-pipeline.svg' | relative_url }}" width="1200" height="660" alt="AI 影片的八站路線：需求確認、腳本、分鏡、動態分鏡、關鍵畫面、素材製作、後製、驗收交付，每兩站之間都有核准點；付費的 AI 生成只發生在第六站素材製作。越晚改動，要退回重做的站越多。">
    </picture>
  </a>
  <figcaption>圖 1：生成只是八站中的一站。每一站結束都有一個核准點，越晚改動，要退回重做的站越多。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

每一站進下一站之前，都可以先問自己一個問題。點開每一站看看：

<details class="ae-reveal"><summary>第 1 站：需求確認</summary><div><b>交出：</b>一頁需求單。<br><b>進下一站前先問：</b>雙方對「要說什麼、交什麼」理解一樣嗎？</div></details>

<details class="ae-reveal"><summary>第 2 站：腳本</summary><div><b>交出：</b>畫面與聲音對照的稿子。<br><b>進下一站前先問：</b>有沒有寫進查證不了的效果、價格或功能？</div></details>

<details class="ae-reveal"><summary>第 3 站：分鏡</summary><div><b>交出：</b>每一格回答七件事的分鏡。<br><b>進下一站前先問：</b>每一鏡都帶來新的資訊或情緒嗎？</div></details>

<details class="ae-reveal"><summary>第 4 站：動態分鏡</summary><div><b>交出：</b>分鏡圖放進時間軸，配上自己念的暫時旁白。<br><b>進下一站前先問：</b>不靠漂亮畫面，故事已經成立了嗎？</div></details>

<details class="ae-reveal"><summary>第 5 站：關鍵畫面</summary><div><b>交出：</b>逐張核准的關鍵畫面。<br><b>進下一站前先問：</b>這張圖足以代表成片的樣子嗎？</div></details>

<details class="ae-reveal"><summary>第 6 站：素材製作</summary><div><b>交出：</b>畫面與聲音素材（AI 生成在這一站）。<br><b>進下一站前先問：</b>每段素材都有可以剪的頭尾餘量嗎？</div></details>

<details class="ae-reveal"><summary>第 7 站：後製</summary><div><b>交出：</b>排好順序、混好音、上好字幕的版本。<br><b>進下一站前先問：</b>訊息清楚，沒有讓人分心的錯誤嗎？</div></details>

<details class="ae-reveal"><summary>第 8 站：驗收交付</summary><div><b>交出：</b>成片，加上封面、字幕檔、核准版與版本說明。<br><b>進下一站前先問：</b>規格、觀看品質與使用權都過關了嗎？</div></details>

最常被跳過的是**動態分鏡（Animatic）**：把分鏡圖放進時間軸，配上自己念的暫時旁白，先看節奏。它很粗糙，卻能在花第一筆生成費之前，告訴你故事有沒有成立、旁白有沒有超時。

手冊有個提醒很實用：先用手機把稿子完整念一遍，量出實際長度，再替畫面留辨識時間。不要把 55 秒的稿硬塞進 30 秒，最後靠快到看不完的字幕補救。

我自己的彩排也是同樣的骨架：關鍵畫面先逐張核准，估好價、確認付費後才生成，之後逐鏡檢查、剪接、配聲音，最後親手上傳。完整經過在[〈AI 影片不是輸入一句話就好〉]({{ '/technical/ai-video-production-rehearsal-seedance-workflow/' | relative_url }})。

## 基本功二：把核准點當成「改動價目表」 {#approval}

很多人以為核准就是「之後不能改」。比較準確的說法是：**核准後還是能改，但你知道改這一刀會牽動哪幾步。**

- 改一個字幕錯字：通常只動到後製。
- 旁白的「今天」改成「下週」：可能牽動嘴型和片長。
- 角色從短髮改成長髮：所有關鍵畫面和生成片段可能都要重做。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-basics-for-non-film" data-type="image" href="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-ripple.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-ripple-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-ripple.svg' | relative_url }}" width="1200" height="640" alt="三種修改牽動的範圍：字幕錯字通常只動到後製；旁白日期改了可能牽動嘴型和片長，要從素材製作重做；角色改髮型，關鍵畫面、素材製作到後製都可能重做。已核准的檔案不覆寫，要改就出新版本、重新送審。">
    </picture>
  </a>
  <figcaption>圖 2：同樣是「改一下」，牽動的站數差很多。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

所以我的流程裡，**已核准的檔案不覆寫**：要改就出新版本，重新送審。多一道手續，換來每一次修改都看得見代價。

另一個習慣是回饋的寫法。「再有質感一點」這種意見，製作端沒辦法執行。可執行的回饋至少要有三樣：

1. **時間點**：哪一秒到哪一秒。
2. **觀察**：看到了什麼問題。
3. **期望**：改成什麼樣子才算對。

再加上「嚴重度」（擋住交件、應該修、口味問題），以及「這是不是超出原本核准的範圍」。修正瑕疵和變更範圍是兩回事，後者要重新估時間與費用。多人給意見時，先整理成同一輪再交出去。

<div class="ae-quizband">
  <div class="ae-quiz" data-ae-quiz="B">
    <div class="ae-quiz__top"><span class="ae-quiz__badge"><i class="bi bi-bullseye" aria-hidden="true"></i>小測驗</span></div>
    <p class="ae-quiz__q">下面三則回饋是示意，非實例。哪一則，製作端拿到就能直接動手改？</p>
    <ul class="ae-quiz__opts">
      <li><button type="button" class="ae-quiz__opt" data-option="A"><span class="ae-quiz__letter">A</span><span>「再有質感一點」</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="B"><span class="ae-quiz__letter">B</span><span>「0:12–0:15 杯子消失，希望留在桌上」</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="C"><span class="ae-quiz__letter">C</span><span>「整體節奏可以再好一點」</span></button></li>
    </ul>
    <div class="ae-quiz__result" tabindex="-1" hidden>
      <strong data-ae-verdict></strong> 它同時有時間點（0:12–0:15）、觀察（杯子消失）和期望（留在桌上），製作端知道要改哪裡、改成什麼樣子。
      <ul class="ae-quiz__why">
        <li><b>A 再有質感一點</b>：沒有時間點，也沒說「質感」指什麼、要改成什麼樣子。</li>
        <li><b>C 節奏再好一點</b>：同樣沒有時間點和具體期望。改寫時照「哪一秒到哪一秒＋看到什麼問題＋改成什麼樣子」補齊。</li>
      </ul>
      <button type="button" class="ae-btn" data-ae-quiz-reset style="margin-top:.75rem">再試一次</button>
    </div>
    <details class="ae-reveal ae-quiz-answer-static"><summary>看答案</summary><div>B。它有時間點、觀察和期望三樣；A 和 C 要補上「哪一秒到哪一秒＋看到什麼問題＋改成什麼樣子」才能執行。</div></details>
  </div>
</div>

## 基本功三：分鏡每格回答七件事 {#storyboard}

先對齊兩個詞：**鏡頭**是剪輯裡一段連續的視角；**拍攝次**是同一個鏡頭的不同版本，AI 每重新生成一次就是一個新的拍攝次。

還有一個常被忽略的事實：**素材長度不等於使用長度。**10 秒的生成素材可能只有 3 秒能用；成片要用 3 秒，也可能要生成更長，才有自然的頭尾與剪接餘量。

手冊對分鏡的要求我很認同，每一格至少回答七件事：

1. 第幾鏡
2. 在成片裡用幾秒
3. 景別與鏡位（離多遠、從哪個角度）
4. 主體在做什麼
5. 攝影機在做什麼
6. 觀眾聽到什麼
7. 這一鏡的用途（少了它，故事會缺什麼）

用 AI 生成時，我會再加四欄：**參考圖**、人物或商品的**一致性規則**、**製作方式**（生成、實拍還是後製合成）、**驗收條件**（看到什麼才算通過）。最好再加一欄**備案**：生不出來時改用什麼拍法。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-basics-for-non-film" data-type="image" href="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-storyboard-anatomy.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-storyboard-anatomy-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-storyboard-anatomy.svg' | relative_url }}" width="1200" height="790" alt="一格分鏡的解剖圖（示意，非實際委託）：第 3 鏡、成片用 4 秒、中近景平視、她放下手機並抬眼、攝影機固定、觀眾聽到雨聲和手機落桌、用途是讓觀眾知道她做了決定。用 AI 生成時再加參考圖、一致性規則、製作方式、驗收條件與備案，驗收條件在生成之前就寫好。">
    </picture>
  </a>
  <figcaption>圖 3：一格分鏡的解剖：七件事，加上 AI 生成要多填的五欄（示意，非實際委託）。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

示意寫法如下（非實際委託）：

- 第 3 鏡，成片用 4 秒；中近景，胸口以上，平視
- 她放下手機，抬眼看向畫面右側；攝影機固定
- 聲音：環境雨聲，手機落桌的輕響；用途：讓觀眾知道她做了決定
- 製作方式：用已核准的關鍵畫面當第一格，讓它動起來
- 驗收：臉與衣著和核准圖一致、抬眼動作完整、全程只有她一人
- 備案：動作不自然，就拆成「放下手機」與「抬眼」兩鏡

最大的好處是：**驗收條件在生成之前就寫好了。**看片時逐條對，而不是看完才說「好像還可以」。

很多人喜歡讓 AI 一次生一張 3×3 九宮格分鏡。它適合快速檢查景別是否單調，但有三個陷阱：九格圖不是九支影片，不能整張丟給影片模型；切開後每格解析度很低，要重做單鏡參考；九格一起生會互相污染，服裝和人數可能悄悄改變。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-basics-for-non-film" data-type="image" href="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-grid-traps.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-grid-traps-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-grid-traps.svg' | relative_url }}" width="1200" height="700" alt="九宮格分鏡的三個陷阱：切開後每格解析度很低，要重做單鏡參考；九格一起生會互相污染，服裝和人數可能悄悄改變；九格圖不是九支影片，不能整張丟給影片模型。">
    </picture>
  </a>
  <figcaption>圖 4：九宮格分鏡適合拿來檢查景別，生成時要回到一格一格的單鏡。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

生成前還有三個判斷：

- **先選做法，再選模型**：商品示範、精確動作，實拍加後製往往比較穩。
- **估一下這一鏡有多難**：人數、同時發生的動作、遮擋與接觸、攝影機運動、物件精確度，任何一項增加，風險就上升。整支片的核心是一個很難的鏡頭，就**先試那一鏡**。
- **每鏡設重試上限**：我的規則是每鏡最多兩次，第二次之前一定要先寫出失敗原因、改輸入，不原封不動再送一次。

## 基本功四：交付規格先寫下來 {#delivery}

這是非影視背景最容易輕忽、也最常在最後一刻出包的地方。手冊列了一組練習用的起點（不是所有平台的規定）：

- 直式 1080×1920、9:16
- MP4 檔、H.264 影像編碼
- 幀率和核准的時間軸一致，24、25、30、29.97 不能混稱
- 聲音 AAC、48 kHz
- 附件：封面、字幕檔、核准版與版本說明

我自己上傳 YouTube 的 30 秒彩排預告，是橫式 1920×1080、24 fps，響度約 -16 LUFS（衡量整支片平均聽起來多大聲的單位）。

**字幕**有兩種：燒進畫面的，和另外交的字幕檔（常見 SRT 格式），後者可以讓平台處理，也方便自動翻譯。對方要「字幕檔」，只交一支有字幕的影片是不夠的；必要時也準備一份**無字版**。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-basics-for-non-film" data-type="image" href="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-subtitles.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-subtitles-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-basics-for-non-film-subtitles.svg' | relative_url }}" width="1200" height="680" alt="字幕的三種交付：燒進畫面的字幕長在畫面裡、關不掉；影片加上另外交的字幕檔，可以開關、方便自動翻譯；必要時再加一份畫面不帶字的無字版。對方要字幕檔時，只交有字幕的影片不夠。">
    </picture>
  </a>
  <figcaption>圖 5：燒進畫面的字幕、另外交的字幕檔，和無字版，是三種不同的交付物。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

**安全區**沒有通用答案：直式影片在不同平台，標題、帳號、按鈕會蓋住不同位置，而且介面會改版。重要的人物、商品和字幕先留空間，再用當下的平台預覽確認。

匯出之後，跑一遍這五項：

1. 打開輸出檔，確認不是黑畫面、空白或舊版。
2. 從頭聽到尾，沒有漏音、跳音或尾句被切掉。
3. 用手機看字幕與重點畫面。
4. 對照最後核准的稿子，再核一次價格、日期與品牌名。
5. 片尾沒有範本浮水印、未授權標誌或不該露出的私人資料。

我自己就在第 2 項被擋過：幾段影片接起來之後，聲音比畫面長了 60 毫秒，超過上傳檢查的容忍值。解法是重新封裝、讓聲音跟著畫面結束，而不是把已核准的畫面重新壓一次。很小的數字，卻足以讓整包交件卡住。

## 你可以這樣開始 {#start}

1. 下一支片開工前，先寫一頁需求單：給誰看、哪個平台、片長、要交幾個版本。
2. 生成前先做動態分鏡：分鏡圖加上自己用手機念的暫時旁白，確認節奏和長度。
3. 每一格分鏡照七件事填寫，再加上參考圖和驗收條件。
4. 給回饋或收回饋時，一律寫成「時間點＋觀察＋期望」。
5. 把交付規格和匯出後五項檢查存成清單，每次交件前逐條打勾。

---

## 這個系列接著讀

- [寫了一堆「電影感」關鍵字，AI 影片還是拍不出來？先把鏡頭語言分成三層]({{ '/technical/ai-video-camera-language-prompt/' | relative_url }})
- [AI 影片生出來，到底能不能用？用三種判定取代「感覺還可以」]({{ '/technical/ai-video-quality-review-three-verdicts/' | relative_url }})
- [AI 影片不是輸入一句話就好：6 天彩排 3 支成片，我踩過的審核、參考圖與成本問題]({{ '/technical/ai-video-production-rehearsal-seedance-workflow/' | relative_url }})
- 系列入口：[AI 影片製作筆記]({{ '/technical/ai-video/' | relative_url }})
- 術語看不懂，可以查[AI 影片白話術語表]({{ '/technical/ai-video/glossary/' | relative_url }})
