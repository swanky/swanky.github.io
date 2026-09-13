---
title: "攝影師現在可以怎麼用 AI 做作品？從真人選片到虛擬角色寫真"
seo_title: "攝影師如何用 AI 創作：自動選片、影像延伸與虛擬模特兒寫真"
date: 2026-09-13
published: true
categories: [technical]
tags: [ai-visual, photography, jinpingmei, workflow]
layout: article
permalink: /technical/ai-photographer-judgment-character-photobook/
cover_image: /assets/img/linkedin/ai-photographer-judgment-character-photobook.jpg
cover_alt: "指定參考形象的成年水手服女孩在攝影工作桌挑選照片，從相機、構圖比較到虛擬角色寫真書，呈現攝影師運用 AI 創作的情境插畫"
hero_image: true
cta_context: ai-visual
mid_cta: false
related_posts:
  - jinpingmei-character-lab
  - ai-video-production-rehearsal-seedance-workflow
  - ai-moderation-jinpingmei
use_glightbox: true
description: "攝影師不只可以用 AI 生一張漂亮的圖。我從真人選片、影像延伸到李瓶兒 36 張虛擬寫真的實作，整理三條創作路線，以及攝影經驗真正派得上用場的地方。"
keywords: 攝影師 AI 創作, AI 選片, AI 攝影作品, 虛擬模特兒, 李瓶兒寫真, 人像攝影, 史旺基
extra_css: |
  .post-content .cpb-photo { margin: 2em auto; text-align: center; min-width: 0; }
  .post-content .cpb-photo--portrait { max-width: 500px; }
  .post-content .cpb-photo img { display: block; width: 100%; height: auto; object-fit: contain; border-radius: 14px; }
  .post-content .cpb-photo figcaption { font-size: .85rem; color: #6b7280; margin-top: .7em; }
  .post-content .cpb-pair { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 1.5rem; align-items: start; }
  @media(max-width: 600px) { .post-content .cpb-pair { grid-template-columns: minmax(0,1fr); gap: 0; } }
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>AI 可以幫攝影師做三種不同的事</strong>：整理原片、延伸影像，以及用虛擬模特兒製作新的系列。</li>
    <li><strong>攝影經驗依然派得上用場</strong>：光線、姿勢、視線與整本作品的節奏，比「幫我生成一張漂亮照片」更能決定結果。</li>
    <li><strong>先做一個小企劃就好</strong>：固定人物與主題，從少量畫面開始；先確認方向值得繼續，再增加張數。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">攝影師可以怎麼開始</span>
      <ol class="article-toc-items">
        <li><a href="#selection">先讓 AI 幫忙選片，不必急著生圖</a></li>
        <li><a href="#extension">延伸既有照片，先決定什麼不能改</a></li>
        <li><a href="#virtual-model">用虛擬模特兒，完成原本沒拍過的企劃</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">怎麼把漂亮圖片變成自己的作品</span>
      <ol class="article-toc-items">
        <li><a href="#photographers-eye">攝影師的眼光，究竟用在哪裡</a></li>
        <li><a href="#first-project">如果現在開始，我會先做一個小系列</a></li>
        <li><a href="#what-remains">多一種創作方式，不是抹掉攝影的差別</a></li>
      </ol>
    </li>
  </ol>
</nav>

我拿一場以前拍的照片交給 AI，原本只是想請它幫忙挑片。後來越做越遠：從選照片，到重新安排畫面，最後甚至換成虛擬模特兒，做出一套 36 張的寫真。

這讓我重新想了一個問題：如果今天不用真的按下快門，也能做出一張像照片的影像，攝影師過去累積的經驗，可以拿來做什麼？

對我來說，答案不是急著證明 AI 能不能取代攝影師。我比較有興趣的是：**手上有作品、有拍攝經驗，也有一些一直想做的企劃，現在多了 AI，能往哪裡走？**

這次實作下來，我會把它分成三條路。它們可以接在一起，也可以只取其中一段，不必一開始就把整個攝影流程推倒重來。

## 先讓 AI 幫忙選片，不必急著生圖 {#selection}

第一條路其實最接近攝影師原本的工作：把拍回來的照片整理好。

Sherry 這場有 1,692 張原片。我先讓工具整理相近場景，再由能看圖的 AI 協助比較清晰度、表情與構圖，把候選範圍縮小。這部分處理的是相機內嵌的預覽照片，不是重新替 RAW 顯影。<a class="cpb-cite" href="#record-1">[1]</a>

但「每個場景挑一張」很快就遇到問題：還是太多。有些照片單看都可以，放在一起卻沒有增加新的東西。

攝影師挑片，不只是在找最清楚、眼睛睜開的一張。閉眼可能剛好有情緒，側光本來就會讓半邊臉比較暗；反過來，一張什麼都正常的照片，也可能沒什麼值得看。

所以我會讓 AI **先找候選，再說明為什麼選它**。最後由我決定：這張有沒有我喜歡的眼神？和前一張太像嗎？它值得在作品裡多佔一頁嗎？

如果你手上累積了很多舊照片，這是一個不用改動人物長相、也不用重新拍攝的起點。先從同一場、少量候選開始，比一下 AI 的選擇和你的差在哪裡，比直接請它替全部照片打分數更有意思。

<div class="cpb-pair">
  <figure class="cpb-photo" id="sherry-window">
    <a class="portfolio-lightbox" data-gallery="photographer-judgment" href="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/sherry-original-mg_0017.webp' | relative_url }}" data-title="原拍：窗邊的眼神與笑容">
      <img src="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/sherry-original-mg_0017.webp' | relative_url }}" alt="Sherry 穿米色上衣與格紋裙坐在窗邊石台上，身體前傾，笑著看向鏡頭" width="1600" height="2400" loading="lazy" decoding="async">
    </a>
    <figcaption>Sherry 原拍 _MG_0017。選入它，因為眼神、笑容與前傾坐姿形成了親近感，不是只因為臉夠清楚。僅校正方向與等比例縮圖。</figcaption>
  </figure>
  <figure class="cpb-photo" id="sherry-postbox">
    <a class="portfolio-lightbox" data-gallery="photographer-judgment" href="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/sherry-original-mg_1515.webp' | relative_url }}" data-title="原拍：與紅色郵筒互動">
      <img src="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/sherry-original-mg_1515.webp' | relative_url }}" alt="Sherry 穿深藍色水手領服裝，俯身靠近紅色郵筒，手扶投信口附近並轉向鏡頭微笑" width="1600" height="2400" loading="lazy" decoding="async">
    </a>
    <figcaption>Sherry 原拍 _MG_1515。紅色郵筒帶來色塊，手勢讓人物和場景有了關係。這裡選用原拍，不是 AI 試修版，沒有換裝、換景或裁切。</figcaption>
  </figure>
</div>

## 延伸既有照片，先決定什麼不能改 {#extension}

第二條路，是拿已有的影像探索新的可能。例如試不同的畫面方向，看看另一種場景或造型，是否適合發展成下一個企劃。

這裡有一條我會先畫清楚的線：**你是在修好原本那張照片，還是重新創作另一張影像？**

如果目的是忠實修圖，人物外觀、服裝、動作和拍攝場景就不該任意改掉。若連服裝和環境都換了，工作已經比較接近生成式創作，不能再當作當天真的拍到的畫面。涉及真人，也要另外確認本人同意的使用與修改範圍。

Sherry 的試驗後來走進第二種情況。結果並不是「換個漂亮背景就好了」：原本靠牆、碰著欄杆的姿勢，到了新場景裡，手肘卻像懸在空中；有些版本的臉或身形，也離我認識的模特兒越來越遠。

經過七輪回覆，我決定停止真人試驗，沒有把還沒解決的問題硬寫成成功。<a class="cpb-cite" href="#record-2">[2]</a>

這段經驗讓我更傾向把大幅改造的影像，先當成**企劃草圖**：拿來討論構圖、人物和環境怎麼搭，而不是急著交成品。如果一直花力氣修正「這個人已經不像本人」，換一條創作路線可能比較乾脆。

## 用虛擬模特兒，完成原本沒拍過的企劃 {#virtual-model}

第三條路，就是不再假裝延續某一次真實拍攝，而是用虛構人物重新開始。

我把主角換成自己建立的李瓶兒，採用成年 27 歲的角色設定，做一套現代度假寫真。不是把 Sherry 的照片換臉，而是重新設計人物、服裝與場景的關係。最後完成六章、36 張，並由我逐張核准成品版本。<a class="cpb-cite" href="#record-3">[3]</a>

成品可以直接看：<a href="{{ '/jinpingmei/photobook/li-pinger-no-hurry/' | relative_url }}">李瓶兒《不趕時間的你》寫真集</a>。

這對攝影師有趣的地方，是終於可以把「還沒有機會拍」的構想做出來看看。先不安排整趟旅程，而是從街角、咖啡店、海岸這些畫面，試一本寫真集的氣氛與觀看順序。

不過，虛構人物不代表每張可以隨便變。我會固定角色參考，先確認一張代表照，再讓後續畫面延續同一章的衣著與空間；拍攝上的變化則放在遠近、角度、姿態與情緒，而不是每張都像換了一個人。

寫分鏡時也要換一種說法。比起「日系、自然、漂亮」，我會更具體地交代：人物站在門框哪一邊，肩膀怎麼轉，背景保留多少，眼神是看鏡頭，還是看桌上的花。

**你越能說清楚自己原本會怎麼拍，AI 才越有機會做出你想看的畫面。**

<figure class="cpb-photo" id="cpb-figure-2">
  <a class="portfolio-lightbox" data-gallery="photographer-judgment" href="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/li-pinger-lp36-02-v1-a1.webp' | relative_url }}" data-title="李瓶兒：把人物放進一個完整的場景">
    <img src="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/li-pinger-lp36-02-v1-a1.webp' | relative_url }}" alt="虛構角色李瓶兒穿米白上衣與牛仔褲站在青綠店門旁，完整保留鞋子、街道與遠方港灣" width="1536" height="1024" loading="lazy" decoding="async">
  </a>
  <figcaption>《不趕時間的你》的李瓶兒，AI 生成的虛構角色影像。比起只給一張漂亮的臉，我更想看人物、店面、巷道與遠景如何一起成立；這不是實地旅拍紀錄。</figcaption>
</figure>

## 攝影師的眼光，究竟用在哪裡 {#photographers-eye}

我最有感的一次修改，是一張看花的照片。

設計要李瓶兒看桌上的黃色花，第一版卻是托著腮看向別處。畫面不算醜，人物也大致成立，但她和那朵花沒有真正的關係。

後來改成臉靠近花、視線往下，動作才比較有理由。這不是換一句神奇提示詞就完成的事，而是把產出的圖重新當照片看，再調整畫面。<a class="cpb-cite" href="#record-4">[4]</a><a class="cpb-cite" href="#record-5">[5]</a>

<div class="cpb-pair">
  <figure class="cpb-photo" id="cpb-figure-3">
    <a class="portfolio-lightbox" data-gallery="photographer-judgment" href="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/li-pinger-lp36-10-v1-a1.webp' | relative_url }}" data-title="第一次：有花，但沒有明確看花">
      <img src="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/li-pinger-lp36-10-v1-a1.webp' | relative_url }}" alt="李瓶兒托腮看向右側，黃色花卻在臉部右下方" width="1024" height="1536" loading="lazy" decoding="async">
    </a>
    <figcaption>第一次產圖：有花、有窗光，但視線沒有對上主題。這張被退回，沒有收入成品。AI 生成。</figcaption>
  </figure>
  <figure class="cpb-photo" id="cpb-figure-4">
    <a class="portfolio-lightbox" data-gallery="photographer-judgment" href="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/li-pinger-lp36-10-v1-a2.webp' | relative_url }}" data-title="修正版：讓視線與動作有一個對象">
      <img src="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/li-pinger-lp36-10-v1-a2.webp' | relative_url }}" alt="李瓶兒俯身靠近桌上的黃色花，視線轉向右下方，手部放在桌面" width="1024" height="1536" loading="lazy" decoding="async">
    </a>
    <figcaption>修正版：人物靠近花朵，目光與動作有了較清楚的落點。這個版本收入後續核准的寫真集。AI 生成。</figcaption>
  </figure>
</div>

另一個容易被忽略的問題，是單張好看，整本卻不好看。

一張微笑可以很親近，連著很多張相似的微笑，就容易失去節奏。於是我需要近景與全身、看鏡頭與看物件、安靜與笑開的變化。但變化也不能只是叫人物發呆：每張都要有一個值得留下的理由。

這些正是攝影經驗能帶進 AI 創作的地方。不是多記幾個風格關鍵字，而是知道一張圖哪裡不對、可以怎麼引導，以及什麼時候應該少放一張。

<figure class="cpb-photo cpb-photo--portrait" id="sherry-arch-crop">
  <a class="portfolio-lightbox" data-gallery="photographer-judgment" href="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/sherry-original-mg_0749-left550.webp' | relative_url }}" data-title="原拍裁切：收掉左側空曠，保留人物與拱廊">
    <img src="{{ '/assets/img/technical/ai-photographer-judgment-character-photobook/sherry-original-mg_0749-left550.webp' | relative_url }}" alt="Sherry 穿黑色上衣與灰裙站在磚造拱廊裡，左側空間經裁切收斂，人物全身與上方拱門仍保留" width="1371" height="2400" loading="lazy" decoding="async">
  </a>
  <figcaption>Sherry 原拍 _MG_0749 的裁切版。我收掉左側較空曠的部分，保留人物全身、上方拱門與地面。這是構圖取捨，沒有用 AI 重畫人物或場景。</figcaption>
</figure>

## 如果現在開始，我會先做一個小系列 {#first-project}

我不會建議一開始就要求 AI 做完整本寫真。先做一個小系列，更容易看出自己的方法有沒有用。

**先選一個你真的想拍的主題。** 例如同一個人在咖啡店度過一個下午。主題越具體，越容易判斷哪張是在加分，哪張只是補數。

**再決定哪些事情不能改。** 真人照片要保留哪些部分？虛構人物用哪張參考維持外觀？風格參考只借構圖和光線，不要把另一個人的臉也借進來。

**先確認一張，再談系列。** 用支援參考圖的生圖工具，附上人物依據與具體場景描述；第一張的臉、服裝或氣氛不對，就先修方向，不要急著擴充。

**把下一張當成新的拍攝安排。** 改景別、姿勢或互動，而不是一直複製同一張的微笑。每次產出都拿回來看，別把「指令裡有寫」當成「畫面已做到」。

**最後把照片排在一起看。** 這時才知道哪些太像、哪裡缺一個轉折，或有哪張雖然漂亮，卻不屬於這個系列。原照、參考與生成成品分開留存，也比較不會在之後整理時弄混。

這套做法沒有綁定某一個模型。工具會換，我更想保留下來的是一套自己能持續使用的創作方式。

## 多一種創作方式，不是抹掉攝影的差別 {#what-remains}

這次讓我看到，AI 可以幫攝影師整理已經拍到的東西，也能把尚未拍過的構想往前推。用得好的時候，攝影經驗不只存在於按快門那一刻，也會出現在選片、引導畫面和編排作品的過程裡。

但我不想把兩件事混在一起。真人照片留下的是實際發生過的相遇；虛擬寫真則是我重新設計的場景。它們可以共享構圖與敘事，卻不能互相冒充。

李瓶兒這套也仍有物件細節不連續、部分姿態相近的地方。我核准這批作品，不表示這些限制消失，更不表示已經證明讀者願意付費。<a class="cpb-cite" href="#record-3">[3]</a><a class="cpb-cite" href="#record-6">[6]</a>

如果你已經拍了一段時間，我覺得值得問的，不只是「AI 能不能生成漂亮的圖」。

**而是你腦中那些一直想拍、還沒有機會完成的畫面，現在能不能先做出一小部分。** 做出來之後，再用自己的眼睛決定，它值不值得繼續。

---

## 參考資料 {#references}

以下整理自本次製作與審閱紀錄，是個案經驗，不是所有攝影工作都適用的效果保證。

### [1] 真人選片的起點與資料範圍 {#record-1}

來源：原場與前期製作紀錄。

Sherry 原場有 1,692 張 CR2，分為 96 個場景。前期使用相機內嵌 JPEG 做影像分析與選片，先有 17 張版本，之後才是另一個 36 張重構企劃。預覽 JPEG 不等於 RAW 重新顯影或 RAW 備份。

### [2] Sherry 的修訂與停止真人試驗 {#record-2}

來源：作者回覆與結案。

七輪回覆涵蓋本人感、光影與比例、姿勢支撐、表情吸引力及整書節奏。末輪審閱 14 張，7 張保留、3 張喜歡但有修改意見、4 張要求重做；另 22 張沿用前輪接受版本。作者要求停止真人試驗，沒有繼續生成到全數核准。

### [3] 李瓶兒寫真製作與作者核准 {#record-3}

來源：角色設定、製作結果及後續作者收據。

這套以既有 27 歲虛構角色李瓶兒為主角，做現代度假時尚改編；完成六章、36 張入選影像與 40 頁數位 PDF。實際有 45 次工具呼叫、38 張產圖、7 次工具錯誤。後續作者收據逐張核准 36 個明列成品版本，不包含被退件的舊版本。作品核准、發布行為與銷售效果是不同證據，本文不推定商業成功。

### [4] 看花案例：第一次產圖的退件原因 {#record-4}

來源：代理看圖紀錄。

LP36-10-v1-a1：黃色花位於畫面右下方，眼神卻偏向右上／窗外，並延續托腮姿態。雖然人物、服裝與桌面支撐大致成立，仍因沒有完成看花的分鏡而退件。此圖沒有收入最終 36 張成品。

### [5] 看花案例：修正版的選入理由 {#record-5}

來源：代理看圖紀錄。

LP36-10-v1-a2：人物靠近黃色花，目光向右下方，前臂改由桌面支撐。畫面中的視線與物件關係較明確，代理選入，之後列入作者核准版本。部分手指重疊，不宣稱全部指節均可見；本次同時改動視線、姿勢與距離，不是單一提示詞的因果實驗。

### [6] 整套作品仍有的限制 {#record-6}

來源：歷史代理檢查與作者判斷分工。

部分近距離柔笑與托腮相近，招牌、杯器、窗外地理及衣料細節在各張之間仍有差異。第 28 張替代分鏡造成衣著跳接。36 張原生圖為直幅或橫幅，沒有完成印刷紙材、色域與打樣驗收；也沒有付費流量、售價測試或購買追蹤資料。歷史代理 QA 的待審狀態保留，後續作者收據另列。
