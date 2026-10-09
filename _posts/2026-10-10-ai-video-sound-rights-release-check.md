---
title: "AI 影片做完畫面只完成一半：聲音怎麼配，上傳前要查哪些事"
seo_title: "AI 影片聲音與上傳前檢查：旁白先量長度、分軌混音、配樂授權、AI 揭露與權利表"
date: 2026-10-10 10:30:00 +0800
categories: [technical]
tags: [ai-video, audio, music-license, youtube, release-checklist]
layout: article
learn_kit: true
use_glightbox: true
cta_context: agentic
related_posts:
  - ai-video-production-rehearsal-seedance-workflow
  - ai-video-quality-review-three-verdicts
  - ai-video-agent-human-gates
description: "觀眾最常抓到的問題常在聲音。整理配音、配樂與混音的做法，以及上傳前的授權與 AI 揭露檢查。"
keywords: AI 影片配樂,AI 配音,混音,響度,音樂授權,AI 揭露,YouTube 上傳檢查,權利表,史旺基
cover_image: /assets/img/linkedin/ai-video-sound-rights-release-check.jpg
cover_alt: "成年水手服創作者戴著監聽耳機在錄音室推動混音台的音量滑桿，另一手拿著打勾、打叉、問號的檢查板，身後螢幕是六條分開的聲音波形，旁邊堆著封好的上傳包"
hero_image: true
---

很多人做 AI 影片，力氣都花在畫面，聲音最後隨便配一首。結果觀眾最常抓到的問題反而在聲音：旁白太趕、音樂蓋過對白、爆炸聲晚了半拍。

再往後一步，是上傳前那些不起眼的確認：這首配樂能不能公開用？有沒有標示 AI 生成？上傳的是不是最後核准的那一版？

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>旁白先量長度再排</strong>：放不進去就改稿，不偷偷加速。</li>
    <li><strong>聲音拆開來混</strong>：人聲出現時音樂讓位，響度要驗最後上傳的那個檔案。</li>
    <li><strong>授權一項一項查</strong>：服務叫得動、帳號借得到，都不等於可以公開用。</li>
    <li><strong>上傳前三件事分開查</strong>：AI 揭露、權利表、上傳包；平台通過不等於權利已確認。</li>
  </ul>
</div>

以下例子來自我用自己持有的 CloneX 角色做的彩排，屬於非參賽、非商業的練習。這部分是製作流程上的關卡，不是法律意見。

## 先量旁白，再排畫面 {#timing}

做聲音之前，先回答一個問題：**畫面長度還能不能動？**

- **畫面已經剪定**：每一句旁白先生成、量好實際長度，再放進那顆鏡頭的時間裡。放不進去就退回處理。
- **還在試排**：先量旁白，再依量到的長度決定每顆鏡頭停多久。

兩種情況都是**先量，再排**，不從字數估秒數。

放不進去時，最省事的做法是把旁白加速。我的規則是超過大約 1.2 倍就改寫句子：講太快的旁白，失去的信任比少講一句更多。每句前後也盡量各留約 0.3 秒，讓畫面先出來，再說話。

選配音也一樣省：挑兩三句有代表性的句子，最多試兩個聲音，選定了才生成全稿。沒有本人書面同意，不做聲音複製，也不模仿真人。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-sound-rights-release-check" data-type="image" href="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-timing.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-timing-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-timing.svg' | relative_url }}" width="1200" height="780" alt="旁白先生成、量好長度，放進鏡頭的長度裡，前後各留約 0.3 秒；放不進去時改寫句子，不把旁白加速超過約 1.2 倍">
    </picture>
  </a>
  <figcaption>圖 1：旁白先量長度，再放進鏡頭 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 聲音拆開來混，重要的才聽得見 {#stems}

我把聲音拆成六條獨立音軌：旁白、對白、環境音、擬音（Foley，貼著畫面動作做的腳步、開門、放杯子等聲音）、音樂、轉場音效。拆開的好處是每一條都能單獨調。

要先知道一件事：影片模型直接生成的聲音，是已經混好的一整條，拆不開。

**人聲出現時，音樂和環境音要讓位。** 我的參考值是旁白出現時，音樂大約降 6 dB、環境音降 3 dB。讓位要漸變，提前一點降、說完再慢慢回來，不要一格一格硬切，否則會有爆音。推動劇情的聲音，例如門鎖、鑰匙聲，不要跟著被壓小。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-sound-rights-release-check" data-type="image" href="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-stems.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-stems-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-stems.svg' | relative_url }}" width="1200" height="796" alt="六條音軌分開調：旁白出現時，音樂漸變降低約 6 dB、環境音降低約 3 dB，說完再慢慢回升；擬音不動，推動劇情的聲音不跟著壓小">
    </picture>
  </a>
  <figcaption>圖 2：人聲一出現，音樂與環境音漸變讓位 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

**響度要事先指定。** 響度（LUFS）是衡量整段聲音平均聽起來多大聲的數值。網頁與 YouTube 我用約 -16 LUFS；比賽放映在主辦規格確認前，一律標「待確認」，不自己填數字。

這裡有個陷阱：最後一道防爆音的處理如果設定不對，會把前面辛苦留下的安全空間吃掉，做出接近破音的成品，而中間每個數字看起來都正常。所以**最後一定驗實際要上傳的影片檔**，不是只驗中間的聲音檔。

## 實例：30 秒預告，鏡頭一次過，聲音改了好幾版 {#bunny-teaser}

<div style="position:relative;width:100%;aspect-ratio:16 / 9;margin:2em 0;border-radius:14px;overflow:hidden;background:#000;">
  <iframe src="https://www.youtube-nocookie.com/embed/lXnwBJBcbXY?rel=0" title="BUNNY AWAKENS｜CloneX #15755 AI Cinematic Teaser" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>
</div>

這支 30 秒概念預告《BUNNY AWAKENS》，是 Bunny（CloneX #15755）的非商業彩排作品。生成的鏡頭第一次就全部通過，沒有重新生成；聲音卻改了好幾版：

- **第一版**：先把畫面和音效組起來，影片模型生成的原生聲音還沒查清授權，先不用。
- **第二版**：把三顆短鏡頭的原生聲音放回去，整體聲音被我退回。
- **第三版**：重做暗黑工業感的配樂與跟著事件走的音效，把爆炸聲拉到夠明顯；那三段原生聲音留著。
- **最後**：配樂再單獨比一輪，才定案。

這一輪配樂，我用 Google Lyria 3 Pro Preview 生了三首（2026 年 8 月，每首 US$0.08），其他聲音全部不動，只換音樂來比。接著做公平對照：三版自己用程式產生的免費音樂，和選中的付費那首放在同一段畫面、同樣音量下比。

<div class="ae-chain">
  <div class="ae-chain__card"><span class="ae-chain__emoji">🎧</span><span class="ae-chain__prompt">付費生成的三個方向：A 極簡電影感、B 自然氛圍、C 現代電子；再加三版免費音樂。我最後選了<span class="ae-chain__box">＿</span></span><span class="ae-chain__cue">🤔 先猜猜看</span><details class="ae-reveal"><summary>揭曉</summary><div>付費的 C，現代電子那首。三版免費音樂放在同一段畫面、同樣音量下比過，我還是選它。</div></details></div>
  <div class="ae-chain__card"><span class="ae-chain__emoji">💰</span><span class="ae-chain__prompt">付費那首勝出，代表付費模型<span class="ae-chain__box">＿</span></span><span class="ae-chain__cue">🙈 一定比較好聽嗎？</span><details class="ae-reveal"><summary>揭曉</summary><div>不代表。效果好，主要來自選曲、分層、音效對準畫面的時間點，以及人工挑選。</div></details></div>
</div>

我最後仍選付費那首，但得到的結論是：效果好，主要來自選曲、分層、音效對準畫面的時間點，以及人工挑選；**付費模型不保證比較好聽**。

後來我把它變成固定順序：

1. 先用文字提出三個不同的聲音方向，說明理由；
2. 用同一段畫面做 12 到 20 秒的短版 A／B／C，音量對齊後盲聽；
3. 選定方向，才生成完整版本。

給配樂模型的提示詞只寫樂風、樂器、情緒、速度，不寫任何藝人、電影或既有歌曲名，預設純音樂、不要人聲。

也不是每支片都需要配樂。另外兩支雙風格短片，我全部使用影片模型的原生聲音（雨聲、腳步、按鈕音和一句台詞），審片時也接受了。

## 授權：一項一項查，不知道就是不行 {#rights}

每個聲音來源，我都分開回答五個問題：

1. 程式碼能不能用？
2. 實際用的模型能不能商用？
3. 生成的成品有沒有額外限制？
4. 裡面的聲音或第三方元件，有沒有另外的權利？
5. 這次的用途，是否涵蓋公開發布？

任何一題答不出來，就是「待確認」，不能推論成通過。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-sound-rights-release-check" data-type="image" href="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-rights-gates.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-rights-gates-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-rights-gates.svg' | relative_url }}" width="1200" height="770" alt="每個聲音來源都要過五道閘門，任何一道答不出來就是「待確認」，不能推論成通過；五題都答得出來才可以公開">
    </picture>
  </a>
  <figcaption>圖 3：五道閘門，一道答不出來就停 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

幾個實際踩過或差點踩到的例子：

- **MusicGen**：程式碼採 MIT 授權，但官方模型頁寫明模型權重採 CC BY-NC 4.0。[[1]](https://huggingface.co/facebook/musicgen-large) NC 就是「非商業」。[[2]](https://creativecommons.org/licenses/by-nc/4.0/) 程式碼能商用，不代表模型能，我直接列進不使用清單。
- **借來的商用素材庫帳號**：計畫一開始，一位隊友能借到朋友的帳號。我第一天就定下規則：這類素材不用在公開發布的作品。
- **音效素材包**：有些允許商業影音使用，卻明文禁止拿去訓練 AI。這類素材我只做傳統剪接混音，不餵進任何 AI。
- **透過串接平台呼叫的模型**：平台讓你叫得到，不代表成品已取得商業授權。平台條款、模型條款要分開查。

以 30 秒預告成片裡那三段 Grok 原生聲音為例，2026 年 8 月查核時，我一路追到 xAI 的企業條款，寫明成品歸使用者，這三段才從「待確認」改成「已驗證」，發布時並加註「Created with Grok」。同一支片用到的 Seedance，我查到最後仍不明確，就照實標「未確認」。

我還會把三種狀態分開記：內部試聽可以用、技術品質過關、可以公開發布。前兩者都成立，第三者仍然可能不成立。

## 上傳前，三件事分開查 {#release}

成片核准後，我不直接上傳，而是先整理一個「上傳包」，最後由我自己登入 YouTube 手動上傳。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-sound-rights-release-check" data-type="image" href="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-release.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-release-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-sound-rights-release-check-release.svg' | relative_url }}" width="1200" height="830" alt="上傳前分開檢查 AI 揭露、權利表、上傳包；權利表只用已驗證、有條件、擋下三種狀態；最後由人在核准不公開上傳、核准公開發布、退回修改、停止四個選項裡決定">
    </picture>
  </a>
  <figcaption>圖 4：上傳前三件事分開查，最後由人在四個選項裡做決定 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

**一、AI 揭露。** YouTube 的說明頁列出需要揭露的情況，例如看起來真實的 AI 內容、AI 改動真實地點或事件，以及作為影片重點的 AI 音樂。[[3]](https://support.google.com/youtube/answer/14328491) 規則會變，所以每次都重查當天的官方頁面。我的三支彩排片都在說明欄寫明：畫面與聲音皆為 AI 生成、與相關品牌沒有贊助關係、是彩排不是參賽作品。

**二、權利表。** 每一層素材（畫面、聲音、角色、字型、縮圖）各占一列，寫清楚來源、條款與能不能商用。狀態只用三種：

- **已驗證**；
- **有條件**：條件要逐字帶到最後一關，不能簡化成「已核准」；
- **擋下**：任何一項擋下，公開發布就停止。

我那兩支雙風格短片，權利表上固定有三項「有條件」：其中一個角色只能非商業使用、影片模型條款對串接平台使用者的約束不明、這是彩排不是參賽作品。公開前，這三個條件都要由我明確接受，不能由流程自動帶過。

另外，**AI 標示不是著作權通行證，完整授權也不能免除揭露**。這兩件事要分開回答。

**三、上傳包。** 幾個重點：

- 上傳的檔案必須和核准的成片是同一份，不重新壓縮；
- 縮圖從核准成片裡擷取，不加字、不用 AI 補畫；
- 影音長度要對齊。我實際遇到的是卡通版剪完，聲音比畫面長了 60 毫秒，被檢查擋下；只重新封裝、不重新壓縮，才過關；
- 匯出後真的打開來看一次：不是黑畫面或舊版、最後一句沒被截掉、用手機也看一遍。

<div class="ae-quizband">
  <div class="ae-quiz" data-ae-quiz="C">
    <div class="ae-quiz__top"><span class="ae-quiz__badge"><i class="bi bi-bullseye" aria-hidden="true"></i>小測驗</span></div>
    <p class="ae-quiz__q">依 YouTube 的說明頁，下面哪一種情況需要做 AI 揭露？</p>
    <ul class="ae-quiz__opts">
      <li><button type="button" class="ae-quiz__opt" data-option="A"><span class="ae-quiz__letter">A</span><span>用 AI 幫忙想影片大綱</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="B"><span class="ae-quiz__letter">B</span><span>用 AI 自動產生字幕</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="C"><span class="ae-quiz__letter">C</span><span>用 AI 生成一段看起來很真實、龍捲風逼近某個真實城市的畫面，但這件事沒有發生過</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="D"><span class="ae-quiz__letter">D</span><span>調色、調光，或加上背景模糊</span></button></li>
    </ul>
    <div class="ae-quiz__result" tabindex="-1" hidden>
      <strong data-ae-verdict></strong> 說明頁把「看起來真實、但沒發生過的場景」列為需要揭露；想大綱、產生字幕、調色調光這類輔助或小幅修改，列在不需要揭露的例子裡。
      <ul class="ae-quiz__why">
        <li><b>以上依 2026-10-09 查閱的官方說明頁</b>：清單只是舉例、不是全部，規則也會變，每次上傳前重查當天的頁面。</li>
      </ul>
      <button type="button" class="ae-btn" data-ae-quiz-reset style="margin-top:.75rem">再試一次</button>
    </div>
    <details class="ae-reveal ae-quiz-answer-static"><summary>看答案</summary><div>C，看起來真實、但沒發生過的場景要揭露。依 2026-10-09 查閱的官方說明頁，規則會變，每次重查。</div></details>
  </div>
</div>

<p class="ae-source">出處：<a href="https://support.google.com/youtube/answer/14328491" target="_blank" rel="noopener">YouTube 說明：揭露生成式 AI 內容</a>（2026-10-09 查閱）。</p>

最後，四個常見誤會，翻開看看：

<div class="ae-traits">
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">1</span><h3>設成「不公開」就安全了</h3><p>反正只有拿到連結的人看得到。</p><p class="ae-flip__fix">真相：不等於私密</p><p class="ae-flip__hint">點我看真相 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>不公開，不等於私密</h3><p>「不公開」不是私密，也<strong>不是沒有風險</strong>。權利和揭露一樣要查。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">2</span><h3>上傳成功，就代表沒問題</h3><p>平台也跑過自動檢查和版權比對了。</p><p class="ae-flip__fix">真相：權利還沒確認</p><p class="ae-flip__hint">點我看真相 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>上傳成功，不等於權利確認</h3><p>自動檢查、版權比對、「影片成功上傳了」，<strong>都不代表權利已經確認</strong>。這要靠你自己的權利表。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">3</span><h3>標了 AI 生成，著作權就沒事</h3><p>都誠實揭露了，應該可以了吧？</p><p class="ae-flip__fix">真相：揭露不是通行證</p><p class="ae-flip__hint">點我看真相 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>AI 標示不是著作權通行證</h3><p>揭露是告訴觀眾怎麼做的；素材能不能用，是另一個問題，<strong>要分開回答</strong>。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
  <div class="ae-flip"><div class="ae-flip__inner">
    <div class="ae-flip__face"><span class="ae-flip__num">4</span><h3>授權都齊了，就不用標 AI</h3><p>每一項都已驗證，還要揭露嗎？</p><p class="ae-flip__fix">真相：揭露照樣要做</p><p class="ae-flip__hint">點我看真相 ↻</p></div>
    <div class="ae-flip__face ae-flip__face--back"><h3>完整授權，也不能免除揭露</h3><p>授權齊全，只回答了「能不能用」；該揭露的情況，<strong>照樣要揭露</strong>。</p><p class="ae-flip__hint">再點一次翻回去</p></div>
  </div></div>
</div>

## 你可以這樣開始 {#start}

1. 旁白先生成、先量長度，放不進去就改稿，不硬加速。
2. 至少把人聲和音樂分開兩軌，人聲出現時讓音樂漸變降低。
3. 配樂先做短版盲聽，選定方向才做完整版。
4. 每個聲音來源列一行：從哪來、條款寫什麼、能不能公開用；答不出來就先不用。
5. 上傳前，打開最後那個檔案從頭看完、聽完一次，再依當天規則填 AI 揭露。

對我來說，聲音和授權是最容易被「之後再說」的兩件事，也正是最該先寫成清單的兩件事。

---

## 這個系列接著讀

- [AI 影片不是輸入一句話就好：6 天彩排 3 支成片，我踩過的審核、參考圖與成本問題]({{ '/technical/ai-video-production-rehearsal-seedance-workflow/' | relative_url }})：30 秒預告與雙風格短片的完整背景。
- [AI 影片生出來，到底能不能用？用三種判定取代「感覺還可以」]({{ '/technical/ai-video-quality-review-three-verdicts/' | relative_url }})
- [讓 AI 助手幫你做影片，又不會半夜亂花錢]({{ '/technical/ai-video-agent-human-gates/' | relative_url }})：上傳為什麼一定要人點頭。
- [AI 影片白話術語表]({{ '/technical/ai-video/glossary/' | relative_url }})：看不懂的詞先查這裡。
- [AI 影片製作筆記]({{ '/technical/ai-video/' | relative_url }})

## 參考資料

- **[1]** [Hugging Face：facebook/musicgen-large 模型頁](https://huggingface.co/facebook/musicgen-large)（2026-10-09 查閱）
- **[2]** [Creative Commons：CC BY-NC 4.0 授權摘要](https://creativecommons.org/licenses/by-nc/4.0/)
- **[3]** [YouTube 說明：揭露生成式 AI 內容](https://support.google.com/youtube/answer/14328491)（2026-10-09 查閱）
