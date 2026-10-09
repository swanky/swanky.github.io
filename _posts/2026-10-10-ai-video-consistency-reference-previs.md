---
title: "AI 影片的角色每一鏡都長得不一樣？五個做法讓角色不走樣"
seo_title: "AI 影片角色一致性怎麼做：分清身分與風格、先核准定裝圖、參考圖的極限、抓漂移與白模預演"
date: 2026-10-10 10:15:00 +0800
categories: [technical]
tags: [ai-video, character-consistency, seedance, blender, previs]
layout: article
learn_kit: true
use_glightbox: true
cta_context: agentic
related_posts:
  - ai-video-production-rehearsal-seedance-workflow
  - clonex-bunny-dance-reference-bottleneck
  - ai-video-camera-language-prompt
description: "角色每一鏡都長得不太一樣？分清身分與風格、先核准兩張圖、排成一整排抓漂移，再用白模排站位。"
keywords: AI 影片角色一致性,角色走樣,參考圖,首幀,定裝圖,風格定調圖,Blender 白模,預演,史旺基
cover_image: /assets/img/linkedin/ai-video-consistency-reference-previs.jpg
cover_alt: "成年水手服創作者俯身在發光的預演桌上擺放灰色人偶、移動小攝影機的路線，旁邊架上排著一整排同一張臉的半身像，牆上並列角色定裝圖和配色板"
hero_image: true
---

用 AI 做影片，最常聽到的抱怨是：角色每一顆鏡頭都長得不太一樣。第一顆是她，第三顆好像是她的表妹，到了最後一顆，配件還換邊了。

我一開始也以為多塞幾張參考圖就好。後來發現問題不在圖不夠多，而是沒分清楚：這張圖要它管什麼、不准它管什麼。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>「一致」其實是兩件事</strong>：角色是誰只認官方原圖，衍生圖再好看也只能管風格。</li>
    <li><strong>先核准兩張圖再量產</strong>：一張角色定裝圖、一張風格定調圖，改了就重審。</li>
    <li><strong>參考圖保得住長相，保不住構圖</strong>：要精確的人數與站位，就用首幀。</li>
    <li><strong>漂移要排成一整排看</strong>：空間複雜的鏡頭，先用簡單的 3D 方塊排練站位與運鏡。</li>
  </ul>
</div>

以下的例子，都來自我用自己持有的 CloneX 角色做的彩排，屬於非參賽、非商業的練習。

## 做法一：分清「是誰」和「長什麼樣」 {#two-axes}

寫提示詞之前，我會先替每個角色寫兩張清單：

- **不能變的身分特徵**：臉型、眼睛、髮型、膚質或材質、招牌配件、身形與頭身比。整個系列都要一樣。
- **可以變的美術控制**：服裝變體、光線、媒材、色調、場景、姿勢、鏡頭、情緒。每張可以不同。

參考圖也分兩級。**官方原圖**管身分，判斷「像不像」只看它。**AI 生成或改繪的衍生圖**只能管色調、光影與氣氛，就算它比官方圖好看，也不能拿來證明「這是同一個人」。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-consistency-reference-previs" data-type="image" href="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-identity-style.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-identity-style-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-identity-style.svg' | relative_url }}" width="1200" height="900" alt="角色一致性分兩件事：身分特徵不能變、只認官方原圖；服裝、光線、色調等風格可以每張不同。拿衍生圖當身分參考，每傳一手走樣一點，最後變成另一個人。">
    </picture>
  </a>
  <figcaption>圖 1：身分與風格分開管，衍生圖永遠不當身分證據。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

這條規則擋的是「漂移會累積」。拿一張已經有點走樣的衍生圖當下一張的參考，再傳兩手，角色就變成另一個人了。兩者衝突時，以官方原圖為準，不取平均，也不挑最新那張。

還有一個小陷阱：背影可以證明髮型和身形，不能證明臉。

先考考自己：下面六個特徵，各屬於「不能變的身分」還是「可以變的風格」？想好再翻牌。

<div class="ae-traits">
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">1</span><h3>髮型</h3><p>這是身分，還是風格？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>身分：不能變</h3><p>整個系列都要一樣，判斷只看官方原圖。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">2</span><h3>光線</h3><p>這是身分，還是風格？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>風格：可以變</h3><p>每張可以不同，衍生圖也能拿來定光線。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">3</span><h3>招牌配件</h3><p>這是身分，還是風格？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>身分：不能變</h3><p>正面看得到的別針，換到背面角度也不能消失。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">4</span><h3>色調</h3><p>這是身分，還是風格？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>風格：可以變</h3><p>衍生圖能管的，就是色調、光影與氣氛這一類。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">5</span><h3>頭身比</h3><p>這是身分，還是風格？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>身分：不能變</h3><p>身形與頭身比走樣，整個人看起來就不一樣了。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">6</span><h3>姿勢</h3><p>這是身分，還是風格？</p><p class="ae-flip__hint">點我看答案 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>風格：可以變</h3><p>每張可以不同。但別拿上一顆鏡頭的畫面當身分參考，姿勢會被整組吸過去。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
</div>

## 做法二：先核准兩張圖，再開始量產 {#sheet-and-key}

量產之前先過兩關，就像拍片前的定裝：

1. **角色定裝圖**：全身正面加臉部近照，中性背景、沒有文字。檢查長相、服裝、手腳、年齡感。
2. **風格定調圖**：一張夠複雜的完整場景，證明角色放進場景後沒走樣，色調和光線也能重複。

核准**綁版本**。之後臉、髮型、服裝或固定道具有任何改動，舊的核准就失效，存成新版本重審。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-consistency-reference-previs" data-type="image" href="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-two-gates.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-two-gates-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-two-gates.svg' | relative_url }}" width="1200" height="760" alt="量產前的兩關：角色定裝圖（全身正面加臉部近照）、風格定調圖（一張完整場景），核准並綁定版本後才量產、先做三張試點；臉、髮型、服裝或固定道具一改，舊核准就失效，要重審。">
    </picture>
  </a>
  <figcaption>圖 2：先過角色定裝圖、風格定調圖兩關，核准綁定版本才量產；外觀一改就回到起點。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

我實際遇到的是：做擬真版時，第一次直接拿官方 CG 圖改，結果角色變成「瓷娃娃」。後來改成用文字描述一位真人演員來生成，參考圖只拿來對配件，才通過。順序也固定下來：先生成正面臉、經我核准，其他角度都拿這張核准臉當基準。

量產時，我先做三張試點，分別測單人臉部、雙人互動、三人或場景連續，沒問題才放量。第一次正式審圖，我一次看了 54 張，49 張直接通過。

能用一張核准參考圖，就不要用五張。每多一張參考，就多一個讓不該進來的東西滲進來的機會。

<figure style="margin:2em auto;text-align:center;max-width:1200px;">
  <img src="{{ '/assets/img/ai-video-production-rehearsal/reroll-cartoon-vs-photoreal.jpg' | relative_url }}" alt="同一劇本的卡通版與擬真版短片，在同一段沙漠轉場的實際成片影格比較" style="width:100%;height:auto;border-radius:14px;" loading="lazy">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">實際成片：同一個劇本、同一組角色，卡通與擬真兩種風格各自鎖住長相。兩支都是彩排練習，非參賽、非商業。</figcaption>
</figure>

## 做法三：知道參考圖能做什麼、不能做什麼 {#reference-mode}

「參考圖模式」是只給模型角色或風格的參考圖，不指定影片第一格，讓模型自己決定構圖和動作。要很快出片時，這是最實際的路。

但它有極限。我用來串接影片模型的平台 OpenRouter，官方教學寫得很直接：參考圖用來引導主體、身分或風格，**不是精確的畫面錨點**；要精確控制第一格或最後一格，要改用首幀或首尾幀。[[1]](https://openrouter.ai/docs/cookbook/video-generation/reference-to-video)

我 2026 年 8 月用 Seedance 2.5 實測的感受是：

- **做得到**：這個人是誰、穿什麼、什麼質感。一支 30 秒一鏡到底，從雨夜台北到沙漠再到太空站，卡通、擬真兩版的角色都在三個世界維持同一人。
- **做不到**：精確的構圖、人數、站位與文字。背景招牌會生出亂碼字，要明講「所有招牌、海報、螢幕都是空白」；人數也要寫成精確數字。
- **越長越容易漂**：一支有首幀撐著的 5 秒鏡頭，中段的無人機還是從一台變成兩台，最後只剪前段。ByteDance 自己的公告也承認，多主體互動的穩定性仍要改進。[[2]](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5)

兩種模式怎麼選：

- **首幀模式**最能鎖住人數、順序與構圖，但也會把首幀的缺點一起鎖住。
- **參考圖模式**靠角色圖保住長相，換來的是放棄逐格控制。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-consistency-reference-previs" data-type="image" href="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-mode-choice.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-mode-choice-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-mode-choice.svg' | relative_url }}" width="1200" height="860" alt="依最在意的事選路：精確構圖與人數用首幀模式，但首幀缺點也會被鎖住；很快保住長相用參考圖模式，但放棄逐格控制；空間站位複雜，先用白模排練。">
    </picture>
  </a>
  <figcaption>圖 3：三個路標：在意構圖人數走首幀、在意快速保住長相走參考圖、空間複雜先白模排練。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

另一個常見錯誤：**不要把上一顆鏡頭生成的畫面，直接當下一顆的身分參考**。它會像磁鐵一樣，把姿勢、鏡位整組吸過去。跨鏡頭的一致，應該來自同一組官方原圖和同一段固定描述。

## 做法四：排成一整排，才看得到漂移 {#drift}

漂移最麻煩的地方是：每一張單看都沒問題，排在一起才發現不一樣。

所以我會把整個系列用**相同縮放、相同裁切**排成一張對照表，掃臉寬、眼距、髮量、頭身比、配件在左還是右。各自縮放過的截圖不能當證據，因為比例變化正好會被藏起來。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-consistency-reference-previs" data-type="image" href="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-drift-row.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-drift-row-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-drift-row.svg' | relative_url }}" width="1200" height="720" alt="五張同比例、同裁切的示意角色剪影排成一排，用頭頂、眼睛高度、配件位置三條對齊線掃過，第四張的金色別針從左邊換到右邊。">
    </picture>
  </a>
  <figcaption>圖 4：同比例排成一排（示意剪影），用對齊線一掃，第四張的別針換邊就跑出來了。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

兩個特別容易出事的地方：

- **配件**：正面看得到的金色別針，到了背面角度卻消失，就是連戲錯誤。
- **表情**：大笑、瞇眼的時候，最容易把長相擠壞。

要拿來生影片的第一格畫面，姿勢要真的靜止，不能有動態模糊或甩手殘影，因為影片會把殘影放大成多出來的手腳。付費生成前，放大檢查臉、雙手、雙腳；修圖是整條流程裡最便宜的修正點。

發現漂移時，不是只改最後一張，而是：

1. 先停下後面的生成；
2. 打開當初核准的那一版，當唯一標準；
3. 每張受影響的圖做「左邊核准版、右邊目前版」的對照；
4. 每張只給一個結論：重生、局部修補、通過，或無法判斷；
5. 失敗的版本保留，不刪、不覆蓋。

換你找找看。以下是<strong>示意，非實例</strong>：同一個角色，左邊是當初核准的那一版，右邊是後來生成的一張。哪裡走樣了？

<div class="ae-grid" style="--cols:2">
  <div class="ae-card" data-c="ok"><div class="ae-card__icon"><i class="bi bi-patch-check" aria-hidden="true"></i></div><h3>核准版（示意）</h3><p>齊肩短髮、齊瀏海<br>左胸一枚金色別針<br>約 6 頭身<br>微笑</p></div>
  <div class="ae-card" data-c="key"><div class="ae-card__icon"><i class="bi bi-exclamation-diamond" aria-hidden="true"></i></div><h3>目前版（示意）</h3><p>齊肩短髮、齊瀏海<br>右胸一枚金色別針<br>約 7 頭身<br>大笑、瞇眼</p></div>
</div>

<details class="ae-reveal"><summary>點開看哪裡走樣</summary><div>走樣的有兩處：<strong>別針從左胸換到右胸</strong>（配件連戲錯誤），<strong>頭身比從 6 變 7</strong>（身分特徵）。表情從微笑變大笑屬於可以變的情緒，但大笑、瞇眼最容易把長相擠壞，臉要再對一次。下一步照上面五步：先停下後面的生成，拿核准版當唯一標準逐張對照。</div></details>

## 做法五：空間複雜的鏡頭，先用白模排練 {#previs}

有些鏡頭的問題不是長相，而是空間：多人站位會不會互相擋住、攝影機繞一圈能不能一直看到主角。這些用文字很難講清楚，送進影片模型又很貴。

這時可以先用 [Blender](https://www.blender.org/)（免費開源的 3D 軟體）做**白模預演**：用沒有貼圖的簡單方塊，把場景大小、角色站位和攝影機路徑排出來，在花錢之前先確認這個畫面拍不拍得到。

順序大致是：先定這一鏡要交代什麼；再排空間與動線；再排攝影機路徑；最後輸出小尺寸的快速預覽檢查時長。修的時候先修站位與碰撞，再修構圖與時間。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-consistency-reference-previs" data-type="image" href="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-previs.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-previs-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-consistency-reference-previs-previs.svg' | relative_url }}" width="1200" height="820" alt="白模預演四步：定任務、排空間與動線、排攝影機路徑、輸出快速預覽檢查時長；白模只管空間、時間和機位，角色長相與美術交給參考圖。">
    </picture>
  </a>
  <figcaption>圖 5：白模預演四步。白模只管空間、時間和機位，角色長相交給參考圖。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

交給影片模型時要寫清楚分工：**外觀圖決定角色長相；白模影片只決定空間、時間和機位**。白模裡的格線、箭頭與灰色材質，都不能被當成畫面風格。

我在 [CloneX 舞蹈研究]({{ '/technical/clonex-bunny-dance-reference-bottleneck/' | relative_url }})用過 Blender 輸出的動作參考：同一段舞步，彩色版和深度版都保留了主要動作順序。那是 Bunny（CloneX #15755）的非商業展示試片。

但我要誠實說：目前沒有任何實測證明白模能省多少錢、或提高多少成功率。白模也不是萬能，它可能保留原本模型的體形輪廓；要模型照做揮劍、抓握，白模本身就得真的包含這些動作。對一般固定鏡頭，我不會硬加這一步。

## 你可以這樣開始 {#start}

1. 替主角寫兩張清單：不能變的身分特徵、可以變的美術控制。
2. 把參考圖分成兩疊：官方原圖管身分，其他只管風格。
3. 量產前先做一張角色定裝圖和一張風格定調圖，核准後才放量。
4. 每張參考圖在提示詞裡只給一個職責，例如「這張只管身分，不要複製姿勢與背景」。
5. 每做完一段，用相同縮放排成一整排看一次；發現漂移就回到核准版對照修補。

我拍了十年制服人像。拍真人時，同一個模特兒就是同一個人；做 AI 影片時，「同一個人」要靠你先寫好的規則守住。

---

## 這個系列接著讀

- [AI 影片不是輸入一句話就好：6 天彩排 3 支成片]({{ '/technical/ai-video-production-rehearsal-seedance-workflow/' | relative_url }})：首幀、首尾幀、參考圖三種控制方式的入門。
- [我讓五隻 CloneX 跳 KPOP：參考影片可能才是瓶頸]({{ '/technical/clonex-bunny-dance-reference-bottleneck/' | relative_url }})：Blender 動作參考的實際比較。
- [寫了一堆「電影感」關鍵字，AI 影片還是拍不出來？先把鏡頭語言分成三層]({{ '/technical/ai-video-camera-language-prompt/' | relative_url }})：哪些寫進提示詞、哪些要拆鏡。
- [AI 影片白話術語表]({{ '/technical/ai-video/glossary/' | relative_url }})：看不懂的詞先查這裡。
- [AI 影片製作筆記]({{ '/technical/ai-video/' | relative_url }})：系列入口

## 參考資料

- **[1]** [OpenRouter：Reference-to-Video 官方教學](https://openrouter.ai/docs/cookbook/video-generation/reference-to-video)
- **[2]** [ByteDance Seed：Introducing Seedance 2.5](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5)
