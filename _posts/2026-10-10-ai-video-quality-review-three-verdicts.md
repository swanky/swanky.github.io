---
title: "AI 影片生出來，到底能不能用？用三種判定取代「感覺還可以」"
seo_title: "AI 影片品質驗收怎麼做：通過、有條件通過、僅概念參考三種判定與檢查清單"
date: 2026-10-10 09:45:00 +0800
categories: [technical]
tags: [ai-video, quality-review, workflow, upscaling, human-in-the-loop]
layout: article
learn_kit: true
use_glightbox: true
cta_context: agentic
related_posts:
  - ai-video-model-comparison-method
  - ai-video-basics-for-non-film
  - ai-video-production-rehearsal-seedance-workflow
description: "每一鏡只給三種結論。先寫檢查清單再看片，拿不準就往保守判，畫質放大排在最後。"
keywords: AI 影片品質檢查,影片驗收,看片,檢查清單,重新生成,首幀,畫質放大,超解析度,史旺基
cover_image: /assets/img/linkedin/ai-video-quality-review-three-verdicts.jpg
cover_alt: "成年水手服創作者坐在小放映廳的審片桌前，舉起一段膠片對著放映光檢查、一手按著暫停鍵，桌上排著綠、黃、灰三個印章，身後銀幕上的瑕疵被紅框圈出"
hero_image: true
---

AI 影片的生成服務回「完成」，只代表它交了一個檔案給你。這個鏡頭能不能進成片、要不要花錢重新生成一次、剪輯要避開哪幾秒，都得有人看過才知道。

憑感覺看片一定會漏，所以我把看片拆成固定步驟：**先寫檢查清單、逐條判，最後歸成三種結論之一。**

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>每一鏡只有三種結論</strong>：通過就進成片；有條件通過也進，但要寫出剪輯怎麼避開瑕疵；僅概念參考不進成片。</li>
    <li><strong>先寫檢查清單再看片</strong>：每鏡 6 到 12 條、一句只講一件事，「電影感」這種驗不了的詞不列。</li>
    <li><strong>拿不準就往保守降級</strong>：猶豫時找第二個人看，兩人還是不一致就不進成片。</li>
    <li><strong>畫質放大排在最後</strong>：放大遮不住生成錯誤，素材已經夠清楚就跳過。</li>
  </ul>
</div>

<nav class="article-toc" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ul>
    <li><a href="#verdicts">三種結論，各代表什麼</a></li>
    <li><a href="#checklist">看片前：先寫檢查清單</a></li>
    <li><a href="#rules">看片時的五條規則</a></li>
    <li><a href="#unsure">拿不準怎麼辦：往保守降級</a></li>
    <li><a href="#reroll">判了不能用之後：先找原因，再決定要不要重新生成</a></li>
    <li><a href="#upscale">最後才考慮畫質放大</a></li>
    <li><a href="#start">你可以這樣開始</a></li>
  </ul>
</nav>

## 三種結論，各代表什麼 {#verdicts}

| 結論 | 意思 | 什麼時候給 |
|---|---|---|
| **通過，正式選片** | 這一版成為正式版本，進成片 | 檢查清單每一條都成立，沒有看不清楚的 |
| **有條件通過** | 有瑕疵，但仍進成片 | 這一鏡的主要目的達成，問題只在次要項，而且每一條都寫得出補救方法 |
| **僅概念參考** | 不進成片，只留作方向參考 | 主動作沒發生、角色不像本人、關鍵時刻被瑕疵蓋住，或缺陷剪不掉 |

「有條件通過」有一個必填：**限制是什麼、剪輯怎麼避。**例如剪掉那 0.5 秒、裁切避開邊角、調色蓋掉、縮短使用長度，或說得出「觀眾在成片裡根本看不到」的理由。寫不出來，就不能給這個結論。

沒有第四種「失敗」。判了「僅概念參考」，本身就會觸發下一步：找原因、決定要不要重新生成。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-quality-review-three-verdicts" data-type="image" href="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-flow.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-flow-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-flow.svg' | relative_url }}" width="1200" height="816" alt="三種結論的判斷流程：核心項沒有全部成立就是僅概念參考；次要項也全成立是通過；次要項有問題但寫得出剪輯怎麼避開是有條件通過，寫不出來是僅概念參考。拿不準就往保守降級。">
    </picture>
  </a>
  <figcaption>圖 1：三種結論怎麼判。關鍵在看片前就寫好清單，並標出哪幾條是「核心」。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

舉兩個我實際遇到的例子：

- 我讓四個模型對打同一個滑鏟鏡頭，只有一支拿到「通過」，其他三支都是「僅概念參考」，對打的設計寫在[〈排行榜第一名，不一定適合你的鏡頭〉]({{ '/technical/ai-video-model-comparison-method/' | relative_url }})。
- 一支彩排短片裡，有一鏡的背景招牌生出一堆看不懂的亂碼假字。瑕疵在背景，我看過後判「有條件通過」。之後我的對策是在指令最後寫明：所有招牌、海報、螢幕都要完全留白。

換你判判看。以下三個都是<strong>示意情境，非實例</strong>：

<div class="ae-quizband">
  <div class="ae-quiz" data-ae-quiz="B">
    <div class="ae-quiz__top"><span class="ae-quiz__badge"><i class="bi bi-bullseye" aria-hidden="true"></i>小測驗（示意情境）</span></div>
    <p class="ae-quiz__q">主角的手和杯子融在一起，但只出現 0.3 秒、而且在畫面邊角。這一鏡的主動作和角色身分都沒問題。該給哪個結論？</p>
    <ul class="ae-quiz__opts">
      <li><button type="button" class="ae-quiz__opt" data-option="A"><span class="ae-quiz__letter">A</span><span>通過，正式選片</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="B"><span class="ae-quiz__letter">B</span><span>有條件通過</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="C"><span class="ae-quiz__letter">C</span><span>僅概念參考</span></button></li>
    </ul>
    <div class="ae-quiz__result" tabindex="-1" hidden>
      <strong data-ae-verdict></strong> 瑕疵出在次要項，而且寫得出剪輯怎麼避：剪掉那 0.3 秒，或裁切避開邊角。
      <ul class="ae-quiz__why">
        <li><b>A 通過</b>：有看得到的瑕疵，不是每一條都成立。</li>
        <li><b>C 僅概念參考</b>：核心項都成立，缺陷也剪得掉，不必整鏡放棄。</li>
      </ul>
      <button type="button" class="ae-btn" data-ae-quiz-reset style="margin-top:.75rem">再試一次</button>
    </div>
    <details class="ae-reveal ae-quiz-answer-static"><summary>看答案</summary><div>B，有條件通過：剪掉那 0.3 秒或裁切避開邊角。</div></details>
  </div>
</div>

<details class="ae-reveal"><summary>示意情境 2：這一鏡要主角跳起來，結果她根本沒跳。點開看答案</summary><div><strong>僅概念參考。</strong>主動作沒發生，就是核心項不成立，剪輯也救不回來。下一步先查錯在首幀還是動作。</div></details>

<details class="ae-reveal"><summary>示意情境 3：主角表現都對，只有背景海報出現看不懂的亂碼字。點開看答案</summary><div><strong>有條件通過</strong>，前提是寫得出怎麼避開，例如裁切、調色蓋掉，或說得出觀眾在成片裡根本看不到。寫不出來，就只能是僅概念參考。</div></details>

## 看片前：先寫檢查清單 {#checklist}

三種結論要判得準，關鍵是看片**之前**就把「這一鏡該做到什麼」寫下來。

**一句只講一件事**，能對著畫面直接打勾或打叉。這幾句來自我做 30 秒彩排預告時的變身鏡：

- 「環形光帶正好兩道」
- 「紅色光帶沿身體由下往上升」
- 「水手服全程同一套，可以破損，不可以換裝」
- 「雙臂真的完整展開，不是直接跳到最後姿勢」

**每鏡 6 到 12 條**。太少會漏，太多看不完。「8K」「電影感」「毛孔級細節」這種驗不了的形容詞一律不列。

**標出「核心項」**：這一鏡存在的理由，也就是要發生的主動作，再加上角色身分。我的作品以固定角色為主，角色一走樣整支片就垮，所以身分一律算核心。核心項有一條不成立，最好也只是僅概念參考。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-quality-review-three-verdicts" data-type="image" href="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-checklist.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-checklist-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-checklist.svg' | relative_url }}" width="1200" height="740" alt="示意的變身鏡檢查清單共七條，每條都能對著畫面打勾；角色身分與雙臂完整展開是金色核心項，核心項一條不成立就只能是僅概念參考。">
    </picture>
  </a>
  <figcaption>圖 2：一張檢查清單長這樣（示意）。金色的核心項只要一條不成立，這一鏡最好也只是僅概念參考。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

寫的時候可以對照七種形式，比較不會漏：**數量**（兔耳耳機一對）、**方向**（光帶往上不往下）、**相對位置**（能量柱在身後、不遮臉）、**相對大小**、**顏色**、**狀態**、**動作**（雙臂真的展開）。

表演也要轉成看得到的句子：不寫「演得很悲傷」，改成「角色先看向手中物件，停頓後才抬眼看向出口」。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-quality-review-three-verdicts" data-type="image" href="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-rewrite.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-rewrite-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-rewrite.svg' | relative_url }}" width="1200" height="720" alt="電影感、8K、毛孔級細節、很悲傷這類詞看完也無法打勾，要改寫成數量、方向、相對位置、動作與表演都看得到的句子，例如兔耳耳機一對、雙臂真的展開。">
    </picture>
  </a>
  <figcaption>圖 3：形容詞像一團霧，看完也打不了勾；改寫成看得到的句子才驗得了。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

另外有幾種錯，不管其他地方多漂亮都不能交：未經授權使用真人的長相或聲音、誤導性的商品呈現、品牌日期價格等關鍵事實錯誤、機密或私人資料外露、交付規格根本不符。這幾項不適用「有條件通過」。

## 看片時的五條規則 {#rules}

1. **完整看三遍再判**：一遍當觀眾不暫停，一遍對清單逐條看，一遍用手機看。
2. **分清楚「至少」和「正好」**：「至少三隻兔子」看到三隻就成立；「正好兩道光帶」要確認整段都沒有第三道。
3. **看整段的主要狀態，不只看第一格**：以大部分時間、而且收尾時仍成立的狀態為準。
4. **說要動，就要真的動；因果不能倒**：AI 影片常見「倒帶感」，先撞爛再彈開、碎片自己組回去。就算每一格單看都漂亮，也判不成立。
5. **邊角雜物可以容忍**：主體和主動作成立時，邊角一閃而過的無關路人不推翻檢查項，除非清單寫明「畫面中只有她一人」。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-quality-review-three-verdicts" data-type="image" href="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-three-passes.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-three-passes-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-three-passes.svg' | relative_url }}" width="1200" height="660" alt="完整看三遍再下結論：第一遍當觀眾不暫停，第二遍對清單逐條打勾並在手部、嘴型、剪接點暫停，第三遍用手機小螢幕再看一遍。">
    </picture>
  </a>
  <figcaption>圖 4：同一支片看三遍，每一遍換一種眼睛。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 拿不準怎麼辦：往保守降級 {#unsure}

單一條檢查項也有三種結果：成立、不成立、判定不了。「判定不了」只留給**看不清楚**的情況，又分兩種：

- **沒拍到**：該看的東西根本沒入鏡，例如背後細節從頭到尾沒出現。觀眾在成片裡也看不到，出在次要項通常無害。
- **拍到但不能信**：例如關鍵瞬間手臂被光效糊成一團。這會跟著進成片，被觀眾看到。

出在核心項，不論哪一種，這一鏡都是僅概念參考。

最實用的一條是：**拿不準就往保守降級。**在「通過」和「有條件通過」之間猶豫，給有條件通過，把疑慮寫進備註；在「有條件通過」和「僅概念參考」之間猶豫，找第二個人看，兩人還是不一致就不進成片。

這個精神來自一位隊友寫的自動驗片工具：同一個問題讓機器判三次投票，拿不準時主動交回給人。我把它改成人工版。

## 判了不能用之後：先找原因，再決定要不要重新生成 {#reroll}

判了僅概念參考，第一件事不是重新生成，而是**判斷錯在哪**。我只分兩種：

- **第一格就錯了**：道具、服裝、構圖或身分特徵不對，影片只是忠實放大錯誤。單獨打開首幀圖對照角色設定，錯在圖上就先修圖。
- **動起來才錯**：首幀是對的，但動作沒發生、方向相反、倒放、鏡頭亂動。這時才改指令重新生成。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-quality-review-three-verdicts" data-type="image" href="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-where-wrong.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-where-wrong-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-where-wrong.svg' | relative_url }}" width="1200" height="770" alt="判了不能用先打開首幀圖：道具、服裝、構圖或身分特徵在第一格就錯了，先修圖；首幀對但動作沒發生、方向相反或倒放、鏡頭亂動，才改指令重新生成。">
    </picture>
  </a>
  <figcaption>圖 5：不能用的鏡頭，先打開第一格對照角色設定，就分得出要修圖還是改指令。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

找到原因後，先找比重新生成便宜的修法。先想一下，再翻牌看答案：

<div class="ae-traits">
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">1</span><h3>臉越來越不像</h3><p>鏡頭越往後，角色越不像本人。比重新生成便宜的修法是？</p><p class="ae-flip__hint">點我看修法 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>縮短、少轉頭、重做首幀</h3><p>縮短鏡頭、減少轉頭，回到核准參考重做首幀。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">2</span><h3>手和物件融在一起</h3><p>拿東西的瞬間，手和物件黏成一團。比重新生成便宜的修法是？</p><p class="ae-flip__hint">點我看修法 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>拆成兩鏡接剪</h3><p>拆成「拿起前」「完成後」兩鏡，接在一起剪。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">3</span><h3>商品字樣變形</h3><p>包裝上的字越生越歪。比重新生成便宜的修法是？</p><p class="ae-flip__hint">點我看修法 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>字樣交給後製</h3><p>字樣交給後製疊上，<strong>不讓模型重畫</strong>。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">4</span><h3>多人換臉</h3><p>兩個人同框，臉互相換來換去。比重新生成便宜的修法是？</p><p class="ae-flip__hint">點我看修法 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>一鏡只留一位主角</h3><p>拆成兩人輪流各拍一鏡，每鏡只有一位主角。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
</div>

我每鏡最多生成兩次。值得花第二次，要三個條件同時成立：原因明確而且改得動、這一鏡是成片必要、預算過得了。查不出原因只想「再碰碰運氣」，不做。

還有一條：**品質結論本身從不授權花錢。**判了僅概念參考，不代表可以自動重新生成；每一次都要重新估價、由我放行。

## 最後才考慮畫質放大 {#upscale}

剪輯定了之後，常有人問：要不要再用 AI 放大一次？

AI 放大（超解析度）的白話意思是：用模型去「猜」放大後應該長什麼樣子。它補出的是看起來合理的細節，不是原本的真實細節。

先說清楚：2026 年 9 月我只整理了一套判斷流程、做了評估，**沒有實際下載任何 AI 放大模型試跑**，也沒有拿原片和放大結果做比較。下面是判斷順序，不是實測結論：

1. **素材本身有核心缺陷？**多一根手指、臉逐秒換樣，先回頭修或重新生成。放大只會讓錯誤更清楚。
2. **尺寸夠、看起來也清楚？**直接跳過，再放大只會多出假細節和閃爍。
3. **動畫風格、結構正確但偏軟？**才值得做一小段比較，先試 2 倍，不直接跳 4 倍。
4. **擬真人物？**不要套動畫專用模型；要保住角色長相時，不用會「自己補細節」的修復方式。
5. **環境或成本不划算？**跳過，不為了用模型而用。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-quality-review-three-verdicts" data-type="image" href="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-upscale.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-upscale-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-quality-review-three-verdicts-upscale.svg' | relative_url }}" width="1200" height="900" alt="畫質放大的五道關卡：素材有核心缺陷就回頭修；尺寸夠也清楚就跳過；動畫風、結構對但偏軟才做小段比較、先試 2 倍；擬真人物不用動畫專用模型；環境或成本不划算就跳過。放大後要重新驗收。">
    </picture>
  </a>
  <figcaption>圖 6：要不要畫質放大，由上往下過五道關卡；只有第三關通往「值得試」。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

兩個容易搞錯的觀念：**倍數是寬和高各乘一次**，2 倍是 4 倍像素，1080p 要交 4K 只需要 2 倍；**越新不一定越適合**，較新的影片修復模型 SeedVR 官方就提醒，對 720p 這類輕微損傷的 AI 影片，它傾向生出過多細節、偶爾過度銳化。

放大後的版本也要**重新走一次驗收**，不能沿用原片的核准。我兩支 93 秒彩排短片是 720p 生成，最後用一般縮放放大到 1080p 交件，沒用 AI 放大。

## 你可以這樣開始 {#start}

1. 下一次看片前，先替每一鏡寫 6 到 12 條可以打勾的句子，並標出核心項。
2. 看片完整看三遍：一遍當觀眾、一遍對清單、一遍用手機。
3. 每一鏡只給三種結論之一；給「有條件通過」時，一定寫下剪輯怎麼避。
4. 判了不能用，先打開首幀圖確認錯在圖上還是動作，再決定修圖、改指令或放棄。
5. 拿不準時找第二個人看，兩人不一致就不進成片。

---

## 這個系列接著讀

- [排行榜第一名，不一定適合你的鏡頭：用同一張圖讓 AI 影片模型對打]({{ '/technical/ai-video-model-comparison-method/' | relative_url }})
- [沒念過影視，也想做 AI 影片？先補這四個基本功]({{ '/technical/ai-video-basics-for-non-film/' | relative_url }})
- [AI 影片不是輸入一句話就好：6 天彩排 3 支成片]({{ '/technical/ai-video-production-rehearsal-seedance-workflow/' | relative_url }})
- [AI 影片製作筆記]({{ '/technical/ai-video/' | relative_url }})：系列入口
- 術語看不懂，可以查[AI 影片白話術語表]({{ '/technical/ai-video/glossary/' | relative_url }})

## 參考資料

- [SeedVR：官方說明（Notice 段）](https://github.com/ByteDance-Seed/SeedVR/blob/main/readme.md)
