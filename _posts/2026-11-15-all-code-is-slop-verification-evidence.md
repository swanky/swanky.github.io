---
title: "AI 交來的程式看不完，那要看什麼？Lauren Tan：改看證據"
seo_title: "All Code Is Slop (Except Mine) 解讀：Lauren Tan 談 AI 程式驗證、形式方法與 11,000 條 PR"
date: 2026-11-15
published: true
categories: [technical]
tags: [ai-agent, agentic-engineering, verification, pstack, software-engineering, poteto]
layout: article
cover_image: /assets/img/linkedin/all-code-is-slop-verification-evidence.jpg
cover_alt: "插畫：深藍色的教室裡，戴圓框眼鏡、留長捲髮的講者拿著麥克風，指著大螢幕講解；史旺姬拿著平板和筆，睜大眼睛聽。螢幕上有兩個循環：左邊紅色，小機器人倒出一堆皺紙，一個小人埋在紙堆裡拿放大鏡找問題；右邊綠色，小機器人交出整齊的文件，另一個機器人自己拿放大鏡檢查"
hero_image: true
use_glightbox: true
cta_context: agentic
extra_css: |
  .post-content .tk-card { border: 1px solid #E6E1D6; border-radius: 12px; padding: 20px 22px 16px; margin: 24px 0; background: #fff; box-shadow: 0 2px 10px rgba(66,52,32,0.06); scroll-margin-top: 96px; display: flex; flex-direction: column; gap: 12px; }
  .post-content .tk-card p { margin: 0; }
  .post-content .tk-head { display: flex; align-items: center; gap: 12px; }
  .post-content .tk-no { flex: 0 0 42px; width: 42px; height: 42px; border-radius: 50%; background: #E5A300; color: #232020; font-weight: 800; display: flex; align-items: center; justify-content: center; }
  .post-content .tk-title { font-size: 1.32em; font-weight: 800; line-height: 1.3; color: #232020; }
  .post-content .tk-en { font-size: 0.9em; color: #5F5B53; font-weight: 400; }
  .post-content .tk-stage { margin-left: auto; font-size: 0.8em; font-weight: 700; padding: 3px 12px; border-radius: 999px; background: #FBF3DC; color: #8A5D00; white-space: nowrap; }
  .post-content .tk-pre .tk-stage { background: #E6F2F9; color: #1F5F85; }
  .post-content .tk-def { font-size: 1.08em; font-weight: 600; color: #232020; }
  .post-content .tk-label { display: block; font-size: 0.8em; font-weight: 800; letter-spacing: 0.06em; color: #8A5D00; margin-bottom: 2px; }
  .post-content .tk-eg { background: #FAF5EA; border-radius: 8px; padding: 10px 14px; }
  .post-content .tk-src { font-size: 0.92em; color: #3d3a36; border-left: 3px solid #D9D2C2; padding-left: 12px; overflow-wrap: anywhere; }
  .post-content .tk-owner { background: #E6F2F9; border-radius: 8px; padding: 10px 14px; }
  .post-content .tk-owner .tk-label { color: #1F5F85; }
  .post-content .tk-role { display: inline-block; font-weight: 800; background: #fff; border: 1px solid #4FA6D5; color: #1F5F85; border-radius: 999px; padding: 0 10px; font-size: 0.88em; margin: 2px 0 4px; }
  .post-content .tk-two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .post-content .tk-two > div { border: 1px solid #E6E1D6; border-radius: 8px; padding: 10px 14px; }
  .post-content .tk-ai { background: rgba(229,163,0,0.10); border-left: 4px solid #E5A300; border-radius: 0 8px 8px 0; padding: 10px 14px; }
  .post-content .tk-ai ol { margin: 8px 0 0; padding-left: 1.4em; }
  .post-content .tk-ai li { margin: 2px 0; }
  .post-content .tk-ai li b { color: #8A5D00; }
  .post-content .tk-human { background: #F1F8F3; border-left: 4px solid #2E8B57; border-radius: 0 8px 8px 0; padding: 10px 14px; }
  .post-content .tk-human .tk-label { color: #1E6B41; }
  .post-content .tk-warn { background: #FCF1EF; border-left: 4px solid #C0392B; border-radius: 0 8px 8px 0; padding: 10px 14px; }
  .post-content .tk-warn .tk-label { color: #A93226; }
  .post-content .tk-more { border-top: 1px dashed #D9D2C2; padding-top: 10px; }
  .post-content .tk-more summary { cursor: pointer; font-weight: 700; color: #8A5D00; }
  .post-content .tk-more-body { display: flex; flex-direction: column; gap: 12px; padding-top: 12px; }
  .post-content .tk-when { border-left: 3px solid #D9D2C2; padding-left: 12px; }
  .post-content .tk-foot { font-size: 0.94em; overflow-wrap: anywhere; }
  .post-content .tk-map-wrap { overflow-x: auto; margin: 20px 0; border: 1px solid #E6E1D6; border-radius: 12px; background: #fff; }
  .post-content .tk-map { min-width: 660px; width: 100%; border-collapse: collapse; font-size: 0.94em; margin: 0; }
  .post-content .tk-map caption { caption-side: top; text-align: left; color: #5F5B53; font-size: 0.92em; padding: 10px 14px 8px; }
  .post-content .tk-map th { background: #FBF3DC; border-bottom: 3px solid #E5A300; text-align: left; padding: 10px 12px; vertical-align: top; font-size: 1.05em; }
  .post-content .tk-map th:first-child { background: #E6F2F9; border-bottom-color: #4FA6D5; }
  .post-content .tk-map td { border-bottom: 1px solid #EEE9DD; padding: 8px 12px; vertical-align: top; line-height: 1.35; }
  .post-content .tk-map td a { font-weight: 700; }
  .post-content .tk-map tbody tr:nth-child(even) td { background: #FDFAF3; }
  .post-content .tk-map td:first-child { border-right: 2px solid #E6F2F9; }
  .post-content .tk-read { background: #FAF5EA; border: 1px solid #E6E1D6; border-radius: 12px; padding: 6px 22px 10px; margin: 20px 0; }
  @media (max-width: 600px) { .post-content .tk-card { padding: 16px 14px 12px; } .post-content .tk-two { grid-template-columns: 1fr; } .post-content .tk-title { font-size: 1.2em; } .post-content .tk-read { padding: 4px 14px 8px; } }
related_posts:
  - poteto-pstack-trust-before-scale
  - pstack-six-skills-workday
  - cognitive-surrender-ai-review
description: "AI 一天交幾十條修改，人看不完。Lauren Tan 的團隊改看操作影片、截圖與狀態圖。這篇拆她用了哪些驗證、數字怎麼讀，以及我不買單的地方。"
keywords: Lauren Tan, Poteto, All Code Is Slop, AI Engineer CODE 2026, 驗證, verification, TLA+, Lean, Bombadil, pstack, statechart, code review, Agentic Engineering, 史旺基, Swanky Studio
---

AI 幫你改完程式，回了一句：「我測過了，沒問題。」

你打開修改內容，兩千行。認真看完要一小時，而它今天還會再交二十份。你會怎麼做？多數人的答案是滑過去、按核准，然後祈禱。

Lauren Tan（網路上叫 Poteto）在 11 月 11 日的 AI Engineer CODE 大會上，給了另一個答案。她說團隊的 code review（合併前由人檢查程式修改），已經縮成在看另一種東西：操作影片、截圖、狀態圖，還有數學驗證的結果。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4260s)

**我的判斷：「改看證據」這一步我買單。她接著說的「最後會沒東西可 review」，我不買單。**

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>「我測過了」不算證據</strong>：要它交出看得到、別人能重跑的東西，例如操作影片、截圖、狀態圖。</li>
    <li><strong>同一個錯糾正第二次，就別再寫提醒</strong>：改成程式會自動擋下來的檢查，比多一行說明可靠。</li>
    <li><strong>每種驗證只回答一個問題</strong>：畫面走得通、亂點不會壞、事件順序不出錯、演算法算得對，是四件不同的事。</li>
    <li><strong>驗證變便宜了</strong>：這些方法都不新，以前是太貴才沒人用。文中把她投影片上的 42 種檢查逐項做成卡片：是什麼、以前誰負責、目標與效益、AI 時代怎麼做。</li>
    <li><strong>11,000 條與 0.5% 都是團隊自己報的數字</strong>：回退率不是出錯率，別拿來當別人的目標。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part"><span class="article-toc-part-title">她這次多講了什麼</span><ol class="article-toc-items">
      <li><a href="#context">這場和上一場，數字要分開看</a></li>
      <li><a href="#prose">糾正 AI 的時候，先別急著多寫一行提醒</a></li>
      <li><a href="#evidence">人不看程式修改，改看什麼</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">證據有哪幾種</span><ol class="article-toc-items">
      <li><a href="#tools">四種驗證，各回答一個問題</a></li>
      <li><a href="#race">一個例子：按了取消之後，誰先到？</a></li>
      <li><a href="#cost">驗證變便宜，所以用量該往這裡搬</a></li>
      <li><a href="#map">那張清單上的 42 種檢查：是什麼、以前誰負責、AI 能接手多少</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">哪些可以帶走，哪些不行</span><ol class="article-toc-items">
      <li><a href="#numbers">11,000 與 0.5%，各自的分母是什麼</a></li>
      <li><a href="#limits">我不買單的兩句話</a></li>
      <li><a href="#start">如果是我，會從這三件事開始</a></li>
    </ol></li>
  </ol>
</nav>

## 這場和上一場，數字要分開看 {#context}

我在十月寫過一篇[〈Poteto 的 2,500 條 PR，真正值得學的是什麼？〉]({{ '/technical/poteto-pstack-trust-before-scale/' | relative_url }})，整理她較早的一場演講和一場長訪談。功能地圖、把教訓分層放、內外兩圈自動化，那篇都寫過，這裡不重複。

這場的講題是 *All Code Is Slop (Except Mine)*，直譯是「所有程式碼都是垃圾，我寫的除外」，一句自嘲。活動頁標示她是 SpaceXSI 的 Principal Engineer；[[1]](https://ai.engineer/code/2026/talks/lauren-tan) 她在台上說自己做的產品是 Grok Bot。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3662s)

先把數字放好，三個不要混在一起：

- **2,500**：上一場講的，她個人一個月的 PR 數。PR 是一份送出去等合併的程式修改。
- **3,000**：這一場開頭講的，還是她個人，「上個月」。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3720s)
- **11,000**：這一場後段講的，是**整個團隊**上個月送進正式環境的數量。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4500s)

<figure>
  <a href="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/three-numbers.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="all-code-is-slop" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/three-numbers-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/three-numbers.svg' | relative_url }}" alt="三個數字的長條圖：上一場演講她個人一個月 2,500 條 PR；這一場開頭她個人上個月 3,000 條；這一場後段整個團隊上個月 11,000 條" width="840" height="292"></picture>
  </a>
  <figcaption>自製圖表，數字皆為講者自述。來源：<a href="https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3720s">[2]</a>、<a href="https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4500s">[2]</a></figcaption>
</figure>

三個都是她在台上自己報的。我沒有找到第二個獨立來源可以核對，所以整篇都把它們當「講者自述」。她也說，走到能在睡覺時交付幾千條 PR，她花了六個月。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3781s)

這場真正新增的內容有三塊：把「驗證」獨立成一層來講、開始用數學方法檢查產品，以及第一次公布團隊層級的數字。下面照這個順序走。

## 糾正 AI 的時候，先別急著多寫一行提醒 {#prose}

她開場先放了一張圖，我認為是整場的地圖。左邊是「低信任」：AI 寫出爛程式，人來驗證，找到問題，再回頭。她在旁邊註記：多數人卡在這裡。右邊是「高信任」：AI 寫出好程式，AI 自己驗證，找到問題，再回頭。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3781s)

<figure>
  <a href="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/trust-loops.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="all-code-is-slop" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/trust-loops-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/trust-loops.svg' | relative_url }}" alt="低信任的循環：AI 寫爛程式，人來驗證，找到問題再回頭，多數人卡在這裡。高信任的循環：AI 寫好程式，AI 自己驗證，找到問題再回頭。兩邊差在程式的品質，和誰來驗證" width="840" height="332"></picture>
  </a>
  <figcaption>依演講投影片「help agents write good code」重繪，中文為本文翻譯。來源：<a href="https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3781s">[2]</a></figcaption>
</figure>

兩個循環長得一樣，只換了兩個詞：「爛」變成「好」，「人」變成「AI」。這篇後面講的所有做法，都是為了換掉這兩個詞。前半段處理第一個，後半段處理第二個。

她用一個倒金字塔說明力氣該花在哪。由大到小四層：[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3781s)

1. **程式本身**：介面怎麼設計、架構怎麼分。
2. **機器會自動跑的檢查**：lint（自動掃描寫法的工具）、型別、各種測試。
3. **驗證**：把程式跑起來實際操作，或用數學方法檢查。
4. **文字**：規則、技能、`AGENTS.md` 這類寫給 AI 看的說明檔，只留給需要判斷的事。

<figure>
  <a href="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/effort-pyramid.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="all-code-is-slop" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/effort-pyramid-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/effort-pyramid.svg' | relative_url }}" alt="倒金字塔四層，由上到下：程式本身、機器自動跑的檢查、驗證、文字。前兩層結果是確定的，糾正 AI 先放這裡；需要判斷的事才留在後兩層" width="840" height="348"></picture>
  </a>
  <figcaption>自製示意圖，依演講內容重畫，不是原投影片。來源：<a href="https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3781s">[2]</a></figcaption>
</figure>

前兩層有個共同點：結果是確定的，違規就過不了。所以她的原則是，每次糾正 AI，都先想能不能變成前兩層的檢查，而不是在說明檔裡多加一行。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3840s)

她舉了兩個自家的例子，都很極端。

**第一個：直接禁用 `useEffect`。** 這是 React（做網頁介面的常用工具）裡一個很容易用錯的功能。她說 AI 用不好，所以團隊在產品程式裡整個禁掉，只准自家框架 Dune 的內部使用。從此這類錯誤不必再靠人在 review 時抓。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4020s)

**第二個：禁掉 99% 的程式註解。** 理由來自一次教訓。AI 喜歡用計時器當快速補丁，還會在旁邊寫註解，解釋這個補丁為什麼合理。下一個 AI 讀到，以為這是專案認可的寫法，照抄。計時器越長越多，產品越來越卡。她的結論是：註解沒有強制力，寫了也擋不住任何事。現在改用 lint 規則，錯誤訊息直接告訴 AI 真正該修的地方在哪。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4080s) [[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4140s)

這兩條禁令我都不會照抄。

React 官方文件到今天仍把 Effect 定位成「和 React 以外的系統同步」的正當出口，只是提醒多數情況用不到。[[7]](https://react.dev/learn/you-might-not-need-an-effect) 她能禁，是因為 Dune 把那份責任接走了。沒有替代品就只下禁令，AI 會換一條路繞過去。

註解也一樣。她公開的技能包 pstack 裡有一支 `no-comments`，打開來看，規則比「禁 99%」細：說明「我們改不了的事」的註解可以留；寫著「不要刪」「不要改」的註解，則要先問能不能改成型別、測試或 lint 來強制，改成了才刪。[[5]](https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/no-comments/SKILL.md)

**值得帶走的是那個問法：這句提醒，是在保存一個理由，還是在假裝一道防線？** 是理由就留著。是防線，就把它做成真的會擋人的東西。

我自己的網站就有現成的對照。站上規定 RWA 一律寫「現實世界資產」，這條除了寫在給 AI 的說明檔，也寫成一條自動測試，譯錯了測試不會過。反過來，那份說明檔還是很長，裡面一大半仍然只是文字。所以這一節我是邊寫邊心虛的。

## 人不看程式修改，改看什麼 {#evidence}

她說團隊的 code review 現在主要在看「驗證產物」：影片、截圖、圖，以及形式驗證的結果。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4260s)

最基本的一種她叫執行期驗證，講白了就是：給 AI 一個辦法把程式跑起來，自己點、自己看，用的是人類工程師也在用的除錯工具。配套有兩樣，一張從使用者角度列出所有功能的「功能地圖」，讓 AI 不必猜「左邊側欄那個東西」是什麼；還有固定的操作工具，讓它每次用同一套方法操作，省用量，也測得了。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4260s) [[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4320s) 這兩樣的細節在上一篇寫過。

<figure>
  <a href="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/review-shift.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="all-code-is-slop" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/review-shift-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/review-shift.svg' | relative_url }}" alt="審查的對象換了：以前人逐行看程式修改，量一大就看不完；Lauren Tan 的團隊改看 AI 交出的操作影片、截圖、狀態圖與數學驗證結果，問的是它有沒有做到我要的事" width="840" height="392"></picture>
  </a>
  <figcaption>自製示意圖，依演講內容整理，不是原投影片。右欄四項是她點名的驗證產物。來源：<a href="https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4260s">[2]</a></figcaption>
</figure>

這個轉換我買單，理由很單純：**人讀程式的速度沒有變，AI 寫程式的速度變了。** 她說 2024 年的時候，上班一天要看同事的三條 PR；現在這個數字大概是三百。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3900s) 三百條不可能每條細看。繼續假裝有在看，比承認看不完更危險，那種狀態我在[〈AI 說「改好了」，你還會再看一眼嗎？〉]({{ '/technical/cognitive-surrender-ai-review/' | relative_url }})寫過。

但「看證據」有一個前提：證據得回答對的問題。一段操作順利的影片，只證明那一次、那條路走得通。

## 四種驗證，各回答一個問題 {#tools}

這場演講裡她點名了四種做法。我把它們排在一起，是因為最常見的誤會，就是拿其中一種的通過，當成另一種的保證。

<figure>
  <a href="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/four-checks.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="all-code-is-slop" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/four-checks-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/four-checks.svg' | relative_url }}" alt="四種驗證各回答一個問題：跑起來操作，回答這條路走不走得通；性質測試，回答亂點一通會不會打破規則；模型檢查，回答事件換個順序會不會出事；數學證明，回答這個演算法是否一定算對。每一種通過，都不代表其他三種也通過" width="840" height="472"></picture>
  </a>
  <figcaption>自製示意圖。四種做法是演講點名的，「不代表什麼」是我依各工具官方文件補的。來源：<a href="https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4320s">[2]</a>、<a href="https://github.com/antithesishq/bombadil">[6]</a>、<a href="https://lamport.azurewebsites.net/tla/high-level-view.html">[8]</a>、<a href="https://lean-lang.org/theorem_proving_in_lean4/Introduction/">[9]</a></figcaption>
</figure>

**跑起來操作。** 回答「使用者這條路走不走得通」。不代表沒走過的路也通。

**性質測試。** 你不寫一個個固定案例，改寫「不管怎麼操作，這件事都應該成立」的規則，再讓工具自己在畫面上亂點、亂輸入，看規則會不會被打破。她的團隊用的是 Bombadil，說已經抓到幾個介面上的錯。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4380s) [[6]](https://github.com/antithesishq/bombadil) 它只保證「試過的那些操作」沒問題；規則寫漏了，通過也沒用。

**模型檢查。** 先把產品的行為簡化成一個模型：有哪些狀態、哪些事件會讓它換狀態。工具再把所有可能的事件順序走一遍，找出會違反規則的那一條路。她的團隊用 TLA+ 檢查主要的使用流程，例子是「通知在多台裝置、多個平台之間同步」。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4320s) TLA+ 的作者 Leslie Lamport 自己把話說得很白：它建的模型在程式碼之上，擋不住寫程式時犯的錯。[[8]](https://lamport.azurewebsites.net/tla/high-level-view.html) 模型對了，程式仍可能沒照模型寫。

**數學證明。** 把「這個演算法一定滿足某個條件」寫成精確的命題，由電腦逐步檢查證明。[[9]](https://lean-lang.org/theorem_proving_in_lean4/Introduction/) 她的團隊用 Lean 證明自己寫的長清單顯示元件（只畫出畫面上看得到的那幾列，讓長清單不卡）不會閃爍、不會抖動。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4320s) 證明成立，只表示那個命題成立。命題有沒有寫對、程式是不是真的照那個演算法寫，是另外兩件事。

她對後兩種的說法很節制：還在實驗，看起來有希望，已經找到不少錯，但不是萬靈丹，只是多一層。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4320s) 這句話比任何一個工具名稱都值得記。

## 一個例子：按了取消之後，誰先到？ {#race}

「模型檢查」聽起來最抽象，用一個小例子就懂了。下面是我自己設計的例子，不是她團隊的案例。

你請系統產生一份報表，等了幾秒，按下「取消」。這時有兩個訊息正在往回送：一個是「報表做好了」，一個是「取消成功」。誰先到？

<figure>
  <a href="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/cancel-race.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="all-code-is-slop" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/cancel-race-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/cancel-race.svg' | relative_url }}" alt="同樣是產生報表後按下取消：如果做好了的訊息先到，結果是已完成；如果取消成功的訊息先到，結果是已取消。同樣的事件，順序不同，結果不同" width="840" height="440"></picture>
  </a>
  <figcaption>自製示意圖，作者設計的簡化例子。真實系統還有重送、多台裝置同步等情況，這裡都省略了。</figcaption>
</figure>

一般的測試會寫「按取消，應該看到已取消」，然後通過。因為測試環境裡，取消成功那個訊息幾乎每次都先到。正式環境網路一慢，另一個順序就出現了：使用者明明按了取消，卻收到一份報表。

模型檢查做的事，就是把這兩種順序，以及你沒想到的其他順序，全部走一遍。

更有用的其實是前一步。要建模型，你得先回答：「取消」到底指使用者按下去那一刻，還是系統確認取消那一刻？這個問題，多數團隊是出事之後才第一次討論。

她新做的 `statechart` 技能就在這個位置。它拿 TLA+ 的模型去檢查，再把結果畫成一張狀態圖，並列出走到違規狀態的最短路徑。技能說明裡有兩條要求我很喜歡：圖上的字要用「看圖的人」的話寫，不能出現程式裡的變數名；還有，絕不能為了讓檢查通過，把規則改鬆。[[4]](https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/statechart/SKILL.md) 她說這種圖配著影片和截圖一起看，比讀程式好 review 得多。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4440s)

## 驗證變便宜，所以用量該往這裡搬 {#cost}

她引用了 Cindy 的一則貼文，投影片上顯示的帳號是 Cindy Sridharan。半年前，Cindy 說自己沒辦法信任 AI，因為一直有細微的錯被合併進去。半年後，她說每天 70% 的 token（AI 的用量計費單位）花在驗證上。Lauren 說這和她自己看到的差不多。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4380s)

接著是整場我最同意的一段：這些都不是新技術，只是好的軟體工程工具，以前因為難懂、難寫、難維護，貴到用不起。AI 把這個成本大幅壓低了。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4440s)

換句話說，AI 讓「寫程式」變便宜是大家都看到的事。**比較少人注意到，它同時讓「檢查程式」變便宜，而且後者才是決定你敢不敢放手的那一半。**

70% 這個數字則不必照抄。它是一個人的使用習慣，加上另一個人說「我也差不多」，不是研究結論。風險低的小修改不需要花七成去驗；動到錢、權限、資料的修改，七成可能還不夠。

## 那張清單上的 42 種檢查：是什麼、以前誰負責、AI 能接手多少 {#map}

講到「這些都不新」的時候，她身後的投影片是一張清單，疊在 Cindy Sridharan 的貼文上，密密麻麻 42 個名詞。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4380s) 這張清單值得慢慢看，因為它回答了一個實際的問題：說要「多花力氣驗證」，到底有哪些事可以做？

清單把檢查分成上線前，以及正式環境裡的部署、發布、發布後三段。這個分法見於 Cindy 2018 年談「在正式環境測試」的文章〈Testing in Production, the safe way〉。[[10]](https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1) 意思是：測試不該只發生在上線前。程式放上正式環境之後，還有三個階段可以繼續檢查。

<figure>
  <a href="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/test-stages.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="all-code-is-slop" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/test-stages-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/test-stages.svg' | relative_url }}" alt="測試分四個階段：上線前在自己的環境測，有 20 項；部署、發布、發布後三個階段都在正式環境裡測，分別有 6 項、5 項、11 項" width="840" height="236"></picture>
  </a>
  <figcaption>自製示意圖，依演講投影片上的清單計數。分類架構出自 Cindy Sridharan。來源：<a href="https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4380s">[2]</a>、<a href="https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1">[10]</a></figcaption>
</figure>

「部署」和「發布」在這裡是兩件事。部署是把新版放上正式環境，但還沒讓使用者碰到；發布才是開始把使用者導過去。中間這段空檔，就是可以拿真實環境來測、又不會傷到人的時間。

先把投影片上那張清單照原樣排成一張表。英文是投影片上的原名（完整寫法），中文是我的譯名。手機上可以左右滑動。

<div class="tk-map-wrap">
<table class="tk-map">
  <caption>演講投影片上的 42 項檢查，照原本的四欄排列。點名稱可以跳到那一項的卡片。</caption>
  <thead><tr>
    <th scope="col">上線前（20 項）<br><span class="tk-en">在自己的環境測</span></th>
    <th scope="col">部署（6 項）<br><span class="tk-en">正式環境，還沒有使用者</span></th>
    <th scope="col">發布（5 項）<br><span class="tk-en">逐步放使用者進來</span></th>
    <th scope="col">發布後（11 項）<br><span class="tk-en">所有人都在用</span></th>
  </tr></thead>
  <tbody>
    <tr><td><a href="#t-01">單元測試</a><br><span class="tk-en">Unit tests</span></td><td><a href="#t-21">整合測試</a><br><span class="tk-en">Integration tests</span></td><td><a href="#t-27">金絲雀發布</a><br><span class="tk-en">Canarying</span></td><td><a href="#t-32">流量複製</a><br><span class="tk-en">Teeing</span></td></tr>
    <tr><td><a href="#t-02">功能測試</a><br><span class="tk-en">Functional tests</span></td><td><a href="#t-22">新舊比對</a><br><span class="tk-en">Tap compare</span></td><td><a href="#t-28">監控</a><br><span class="tk-en">Monitoring</span></td><td><a href="#t-33">效能剖析</a><br><span class="tk-en">Profiling</span></td></tr>
    <tr><td><a href="#t-03">元件測試</a><br><span class="tk-en">Component tests</span></td><td><a href="#t-23">負載測試</a><br><span class="tk-en">Load tests</span></td><td><a href="#t-29">流量調配</a><br><span class="tk-en">Traffic shaping</span></td><td><a href="#t-34">紀錄與事件</a><br><span class="tk-en">Logs / events</span></td></tr>
    <tr><td><a href="#t-04">模糊測試</a><br><span class="tk-en">Fuzz tests</span></td><td><a href="#t-24">影子流量</a><br><span class="tk-en">Shadowing</span></td><td><a href="#t-30">功能開關</a><br><span class="tk-en">Feature flagging</span></td><td><a href="#t-35">混沌測試</a><br><span class="tk-en">Chaos testing</span></td></tr>
    <tr><td><a href="#t-05">性質測試</a><br><span class="tk-en">Property based tests</span></td><td><a href="#t-25">設定測試</a><br><span class="tk-en">Config tests</span></td><td><a href="#t-31">例外追蹤</a><br><span class="tk-en">Exception tracking</span></td><td><a href="#t-36">監控</a><br><span class="tk-en">Monitoring</span></td></tr>
    <tr><td><a href="#t-06">形式驗證</a><br><span class="tk-en">Formal verification</span></td><td><a href="#t-26">長時間測試（浸泡測試）</a><br><span class="tk-en">Soak tests</span></td><td></td><td><a href="#t-37">A/B 測試</a><br><span class="tk-en">A/B tests</span></td></tr>
    <tr><td><a href="#t-07">靜態分析</a><br><span class="tk-en">Static analysis</span></td><td></td><td></td><td><a href="#t-38">分散式追蹤</a><br><span class="tk-en">Tracing</span></td></tr>
    <tr><td><a href="#t-08">變異測試</a><br><span class="tk-en">Mutation tests</span></td><td></td><td></td><td><a href="#t-39">動態探索</a><br><span class="tk-en">Dynamic exploration</span></td></tr>
    <tr><td><a href="#t-09">覆蓋率</a><br><span class="tk-en">Coverage tests</span></td><td></td><td></td><td><a href="#t-40">真實使用者監測</a><br><span class="tk-en">Real user monitoring</span></td></tr>
    <tr><td><a href="#t-10">基準測試</a><br><span class="tk-en">Benchmark tests</span></td><td></td><td></td><td><a href="#t-41">稽核</a><br><span class="tk-en">Auditing</span></td></tr>
    <tr><td><a href="#t-11">契約測試</a><br><span class="tk-en">Contract tests</span></td><td></td><td></td><td><a href="#t-42">值班經驗</a><br><span class="tk-en">Oncall experience</span></td></tr>
    <tr><td><a href="#t-12">寫法檢查</a><br><span class="tk-en">Lint tests</span></td><td></td><td></td><td></td></tr>
    <tr><td><a href="#t-13">驗收測試</a><br><span class="tk-en">Acceptance tests</span></td><td></td><td></td><td></td></tr>
    <tr><td><a href="#t-14">回歸測試</a><br><span class="tk-en">Regression tests</span></td><td></td><td></td><td></td></tr>
    <tr><td><a href="#t-15">冒煙測試</a><br><span class="tk-en">Smoke tests</span></td><td></td><td></td><td></td></tr>
    <tr><td><a href="#t-16">易用性測試</a><br><span class="tk-en">Usability tests</span></td><td></td><td></td><td></td></tr>
    <tr><td><a href="#t-17">介面測試</a><br><span class="tk-en">UI/UX tests</span></td><td></td><td></td><td></td></tr>
    <tr><td><a href="#t-18">滲透測試</a><br><span class="tk-en">Penetration tests</span></td><td></td><td></td><td></td></tr>
    <tr><td><a href="#t-19">威脅建模</a><br><span class="tk-en">Threat modeling</span></td><td></td><td></td><td></td></tr>
    <tr><td><a href="#t-20">效能測試</a><br><span class="tk-en">Performance tests</span></td><td></td><td></td><td></td></tr>
  </tbody>
</table>
</div>

這 42 項我整理成下面的卡片，每張用同一個順序回答：它是什麼（附一個例子）、誰定義過、以前誰負責、目標與效益、AI 時代怎麼做（分準備、執行、交付三步）、人要把關什麼、容易誤會的地方；點「展開」還有什麼時候用、該交出什麼證據、起步建議、可用的工具。例子是我自己擬的一般情境。先說清楚哪些話是誰的。定義是我依一般軟體工程的用法寫的。「以前誰負責」是業界常見的分工，各家公司不同，小團隊常常一個人全包。「AI 時代怎麼做」之後的幾欄是我的建議，不是 Lauren 或 Cindy 的原話；演講裡點名用過的，我會標出來。

卡片很多，所以先講我看完的四個結論，再講這張清單該怎麼讀。卡片留著查閱。

**一、這些工作原本散在很多人身上。** 以主要負責的人來算，42 項裡：開發工程師 17 項、維運人員 13 項、測試人員（QA）3 項、產品經理或需求方 3 項、設計師或使用者研究員 2 項、架構師或技術主管 2 項、資安人員 1 項、稽核人員 1 項。所以「驗證」從來不是測試人員一個人的事，大半本來就在工程師和維運人員手上，只是很多項太花時間，排不進行程。AI 降低的是做這些事的成本，該負責的人沒有換。

<figure>
  <a href="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/who-owned.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="all-code-is-slop" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/who-owned-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/who-owned.svg' | relative_url }}" alt="長條圖：42 項檢查以主要負責的人計，開發工程師 17 項、維運人員 13 項、測試人員 3 項、產品經理或需求方 3 項、設計師或使用者研究員 2 項、架構師或技術主管 2 項、資安人員 1 項、稽核人員 1 項" width="840" height="412"></picture>
  </a>
  <figcaption>自製圖表。主要負責人是我依常見分工做的歸類，不是演講內容；各家公司分工不同。</figcaption>
</figure>

**二、越前面的階段，越能放手。** 上線前那 20 項都在自己的環境裡跑，跑壞了重來就好。這 20 項裡大約四分之三能讓 AI 做完、交出證據；驗收、易用性、滲透測試、威脅建模仍然要人主導。Lauren 整場講的方法，絕大部分落在這一段。

**三、越後面的階段，AI 越適合「讀」，越不適合「動手」。** 正式環境裡的紀錄、追蹤、錯誤回報量很大，正好是 AI 擅長消化的東西。但調流量、關機器、套設定，每一個動作都碰得到真的使用者。這一段我會讓它提建議、準備好指令，按下去的仍然是人，或是一條事先寫死的規則。

**四、有幾項從頭到尾是人的。** 易用性、威脅建模、驗收條件、A/B 測試要比什麼。它們的共同點是：問的不是「程式有沒有照規則跑」，而是「規則本身對不對」。

<figure>
  <a href="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/stage-handoff.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="all-code-is-slop" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/stage-handoff-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/stage-handoff.svg' | relative_url }}" alt="四個階段的分工：上線前 AI 自己做完並交出證據，人看證據、定規格；部署時 AI 寫腳本讀結果，人決定何時跑；發布時 AI 盯數字提建議，人事先寫死退回條件；發布後 AI 大量閱讀整理線索，人下結論、管權限" width="840" height="388"></picture>
  </a>
  <figcaption>自製示意圖，是我的建議，不是演講內容。各階段的技能與工具數量依下方卡片統計。</figcaption>
</figure>

要排順序的話，我會分三步。第一步，讓現有的檢查能用一個指令重跑：測試、寫法檢查、靜態分析。第二步，補上專門抓「測試沒在測」的手法：性質測試、變異測試、模糊測試。第三步，才接正式環境的回饋：監控、例外追蹤、真實使用者監測，並把線上學到的事變回前兩步的檢查。

如果只挑一項先做，我會選變異測試。AI 寫的測試最常見的毛病是看起來很多、其實沒在測。變異測試剛好是檢查這件事的工具，以前嫌它跑起來太慢太貴，現在這個理由弱了很多。

### 這張清單該怎麼讀

<div class="tk-read" markdown="1">

- **42 個名字，其實是 41 件事。** 監控出現兩次：發布時看一次，發布後繼續看。
- **它們不是互相排斥的分類。** 清單混了好幾種角度：測多大的範圍（單元、元件、整合）、為了什麼目的（功能、回歸、驗收）、用什麼手法（模糊、性質、變異）、量什麼（覆蓋率、效能）、怎麼控制發布（金絲雀、功能開關）。同一條測試可以同時是整合測試、功能測試，也是回歸測試。
- **階段不是限制。** 整合測試、負載測試、效能剖析在測試環境也能做，清單只是把它們放在最常見的位置。
- **有幾項是上下關係。** 效能測試是總稱，基準測試、負載測試、長時間測試都算在裡面；寫法檢查是靜態分析的一種。

</div>

**這些名詞沒有統一的官方定義。** Martin Fowler 寫「單元測試」和「整合測試」的時候，開頭都先說這個詞在業界用得很鬆，不同團隊講的範圍不一樣。[[15]](https://martinfowler.com/bliki/UnitTest.html) 所以每張卡片都有一欄「誰定義過」，我列出找得到的權威出處：Martin Fowler 的網站、Google 的《SRE》一書、OWASP、Nielsen Norman Group 等。每個連結我都打開確認過，旁邊是我對那一頁的轉述，不是逐字翻譯。找不到公認出處的，我會直接寫找不到。

想先建立整體觀念，可以從 Fowler 的「測試金字塔」開始：底層快又小的單元測試要多，從畫面一路測到底的測試要少。[[16]](https://martinfowler.com/bliki/TestPyramid.html) Lauren 引用的這張清單，等於把這座金字塔往正式環境再延伸了三段。

Google 的做法可以當對照。《Software Engineering at Google》把測試分成兩個維度來看：「大小」是跑一次要用多少資源，「範圍」是一次驗證多少程式。書裡給的粗略比例是 80% 小範圍的單元測試、15% 中範圍的整合測試、5% 從頭測到尾的測試。[[17]](https://abseil.io/resources/swe-book/html/ch11.html)

### 先認識幾個到處用得上的現成工具

卡片的「可用的工具」只列和那一項直接有關的。另外有三支通用的技能，幾乎每一項都用得上，卡片裡只在最貼近的幾項再點名：[superpowers](https://github.com/obra/superpowers) 的 `test-driven-development`（寫程式前先寫測試）、`systematic-debugging`（遇到錯先找原因，再提修法）、`verification-before-completion`（說「做完了」之前，先跑驗證、看到輸出）。[[11]](https://github.com/obra/superpowers)

網頁操作類的檢查有兩個選擇。Playwright 官方有一組 Test Agents，分成規劃、產生、修復三個代理。[[12]](https://playwright.dev/docs/test-agents) Anthropic 的 `webapp-testing` 是用 Playwright 操作本機網頁、截圖、看瀏覽器紀錄的工具組。[[13]](https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md) Lauren 的 pstack 裡還有兩支和這張清單特別合：`create-verification-skill` 替你的專案產生一支「照使用者的方式操作」的驗證技能，[[14]](https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/create-verification-skill/SKILL.md) [`correct`](https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/correct/SKILL.md) 把 AI 反覆犯的錯變成自動檢查。

三件事先講在前面。這些技能我只讀過官方簡介，沒有實測。標「工具，不是 skill」的 Bombadil 和 k6，要自己接進流程。照卡片算，42 項裡 19 項有對得上的現成技能，5 項只有工具，18 項兩種都沒有。沒有的多半落在正式環境那三段：那裡靠的是你們自己的平台和權限管理，不是裝一支技能就有。

### 上線前：20 項，AI 最能自己做完的一段

<div class="tk-card tk-pre" id="t-01">
  <div class="tk-head"><span class="tk-no">01</span><div><div class="tk-title">單元測試</div><div class="tk-en">Unit tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">測一個小函式或小模組：給這個輸入，該得到那個輸出。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>算運費的函式：買滿一千免運、離島加收。測空購物車、剛好一千、離島地址三種情況。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://martinfowler.com/bliki/UnitTest.html">Martin Fowler〈UnitTest〉</a>：他說這個詞其實定義很鬆，共通點有三個：範圍小、由寫程式的人自己寫、跑得比其他測試快很多。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>寫那段程式的開發工程師，自己寫、自己維護。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認最小的一塊邏輯是對的，包含邊界值和出錯時的處理。</p></div><div><span class="tk-label">效益</span><p>幾秒就跑完，壞了馬上知道壞在哪一塊；之後要重寫也比較敢動。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 最拿手的一項。要它先寫出會失敗的測試，再改程式。留意兩件事：它為了過關去改測試，或把周邊全換成假的替身，結果只是在測自己。</p><ol><li><b>準備：</b>讀需求和這次的修改，列出正常、邊界、出錯三類輸入與預期結果；規則不確定的先問人。</li><li><b>執行：</b>先寫會失敗的測試，再改程式，跑相關測試。</li><li><b>交付：</b>交測試的修改內容和執行紀錄，並說明哪些情況沒測。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>測試檢查的是不是真的需求。不能把程式現在的輸出直接抄成「正確答案」；規則對不對，要問懂業務的人。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>單元測試全過，不代表幾個服務接起來也對。替身用太多，測到的只是「有沒有照順序呼叫」。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>新增或修改函式、修錯、重寫邏輯的時候。日期計算、金額計算、權限判斷這類規則明確的邏輯最划算。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>測試程式、輸入與預期結果的對照、實際執行的紀錄（含通過與失敗）。</p></div><div><span class="tk-label">起步建議</span><p>從風險高、又常改動的純邏輯開始。要求每個測試講得出它在防哪一種錯。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/obra/superpowers/blob/main/skills/test-driven-development/SKILL.md">superpowers 的 test-driven-development</a>、<a href="https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/tdd/SKILL.md">pstack 的 tdd</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-02">
  <div class="tk-head"><span class="tk-no">02</span><div><div class="tk-title">功能測試</div><div class="tk-en">Functional tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">從外面看，一個功能有沒有照規格運作。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>會員在訂單頁選日期區間匯出清單：資料符合篩選條件、總計正確、沒權限的人拿不到。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://martinfowler.com/articles/practical-test-pyramid.html">Ham Vocke〈The Practical Test Pyramid〉</a>：刊在 Martin Fowler 的網站，整理各層測試怎麼分、各該有多少。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">測試人員（QA）</span><p>測試人員（QA）設計案例並執行；開發工程師幫忙把它自動化。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認功能的輸入、輸出、權限和出錯流程，都和講好的規格一致。</p></div><div><span class="tk-label">效益</span><p>避免「畫面按得動，結果卻是錯的」，而且每條需求都對得到一份證據。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>規格和例子由人給，測試讓它寫。要求它連出錯、沒權限的情況一起測，不要只測順利的那條路。</p><ol><li><b>準備：</b>把規格拆成一條條可以檢查的行為，包含出錯和沒權限的情況。</li><li><b>執行：</b>在能觀察到那條規則的最低層寫測試並執行。</li><li><b>交付：</b>交「需求對案例」的對照表和每個案例的結果。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>功能該怎麼運作，由產品經理或懂業務的人決定；測試人員判斷情境夠不夠。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>只測順利的路，會漏掉出錯和沒權限的情況。功能對了，也不代表夠快、好用。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>新功能、需求變更、重要流程上線前。同一個目的，可以在畫面、介面或元件層測，不一定要開瀏覽器。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>需求和案例的對照表、每個案例的執行結果、失敗時的畫面或回應。</p></div><div><span class="tk-label">起步建議</span><p>不要把每個案例都做成瀏覽器腳本。同一條規則能在底層驗的，就在底層驗，比較快也比較穩。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://playwright.dev/docs/test-agents">Playwright Test Agents</a>，可以探索畫面、產出測試計畫與測試。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-03">
  <div class="tk-head"><span class="tk-no">03</span><div><div class="tk-title">元件測試</div><div class="tk-en">Component tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">單獨測一個元件或服務，周邊用假的替身頂著。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>單獨啟動「通知服務」，把寄信的外部服務換成替身，確認訂單成立時它送出正確內容。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://martinfowler.com/bliki/ComponentTest.html">Martin Fowler〈ComponentTest〉</a>：只測系統的一部分，刻意不管範圍以外的東西；元件要多大，由你自己定義。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>負責那個元件的開發工程師。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認元件裡幾個部分合起來，運作是對的。</p></div><div><span class="tk-label">效益</span><p>比整套系統一起測更容易找到問題，又比單元測試多測到內部的配合。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>可以交給它。人要檢查的是替身：有沒有假到和真的差太多。</p><ol><li><b>準備：</b>畫出元件的邊界，列出要用替身代替的外部相依。</li><li><b>執行：</b>透過元件的對外介面測它的行為，並記下替身做了哪些假設。</li><li><b>交付：</b>交執行紀錄和替身假設清單，讓人判斷替身夠不夠真。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>元件的邊界畫在哪、替身的假設合不合理，由負責的工程師確認。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>「元件」多大，每個團隊講的不一樣。替身模擬成功，不能證明真的資料庫或外部服務也相容。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>一個服務、畫面元件或模組的對外介面或內部流程有改動時。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>元件邊界的說明、用了哪些替身與假設、執行紀錄。</p></div><div><span class="tk-label">起步建議</span><p>先用一頁文件講好你們說的「元件」是多大，免得同一個詞各說各話。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/obra/superpowers/blob/main/skills/test-driven-development/SKILL.md">superpowers 的 test-driven-development</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-04">
  <div class="tk-head"><span class="tk-no">04</span><div><div class="tk-title">模糊測試</div><div class="tk-en">Fuzz tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">丟大量隨機、畸形的輸入，看程式會不會當掉。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>上傳檔案的功能：丟進亂碼、超大檔、欄位錯位的檔案，看程式會不會當掉或卡死。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://owasp.org/www-community/Fuzzing">OWASP〈Fuzzing〉</a>：自動送出非預期、畸形的輸入，用來找出錯誤、漏洞和意外的行為。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>開發工程師；重要的對外入口，資安人員會一起做。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>找出會讓程式當掉、卡死或吃光資源的怪輸入。</p></div><div><span class="tk-label">效益</span><p>人列不完的輸入組合交給機器去試；每個當掉的案例都能存下來重播。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>很適合：讓它架工具、長時間跑、整理當掉的案例。Lauren 的團隊做的是相近的性質測試，見第 05 項。提醒一句：沒當掉不代表結果是對的。</p><ol><li><b>準備：</b>選定一個輸入入口，寫好「怎樣算失敗」的判斷，準備幾個正常樣本當種子。</li><li><b>執行：</b>在限制好資源的環境裡長時間跑，自動收集當掉的案例。</li><li><b>交付：</b>交每個問題的最小輸入和重播步驟，重複的合併。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>當掉的案例算不算能被利用的漏洞、影響多大，由工程師和資安人員判斷。能用多少機器資源，由平台限制。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>沒當掉不代表結果正確，還是要有明確的「怎樣算失敗」。它和性質測試有重疊，不是二選一。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>讀檔、匯入、解析格式、接收外部輸入的地方；或這些入口用到的套件升級時。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>讓程式當掉的最小輸入、重播步驟、跑了多久與試了多少輸入。</p></div><div><span class="tk-label">起步建議</span><p>先挑一個重要的輸入入口持續跑，要求每個異常都能重播，勝過一次丟出一大堆追不回來的亂數。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。操作介面可以用 <a href="https://github.com/antithesishq/bombadil">Bombadil</a>（工具，不是 skill），其他情況用該程式語言自己的 fuzz 工具。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-05">
  <div class="tk-head"><span class="tk-no">05</span><div><div class="tk-title">性質測試</div><div class="tk-en">Property based tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">寫「不管怎麼操作都該成立」的規則，讓工具自己去找反例。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>排序功能：不管輸入什麼，輸出的筆數要和輸入一樣，而且由小到大。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://hypothesis.works/articles/what-is-property-based-testing/">David MacIver〈What is Property Based Testing?〉</a>：作者是這類工具的開發者，他說過去的定義一直是「QuickCheck 那個工具做的事」，可見這個詞多半靠工具來理解。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>開發工程師。以前會寫的人不多。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>用規則檢查大量輸入，而不是只靠幾個手寫的例子。</p></div><div><span class="tk-label">效益</span><p>找到人想不到的反例，工具還會把反例縮到最小，方便看懂。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 寫規則草稿，人確認那是不是真的要守的規則。每條規則要它附一個故意違反的例子，證明這個測試真的會失敗。演講點名在用。</p><ol><li><b>準備：</b>和人確認哪些規則「不管怎樣都該成立」，寫成可以執行的檢查。</li><li><b>執行：</b>讓工具大量產生輸入去找反例，找到後縮到最小。</li><li><b>交付：</b>交規則清單、最小反例，以及每條規則會失敗的示範。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>規則本身是不是真的，有沒有偷偷排除掉重要的輸入。抽樣全過不能說成「已證明」。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>規則寫錯，會得到錯的信心。例如小數相加，順序不同結果可能差一點點。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>排序、編碼解碼、資料轉換、「做兩次和做一次結果一樣」這類說得出規則的邏輯。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>規則清單、工具找到的最小反例、每條規則「故意違反會失敗」的示範。</p></div><div><span class="tk-label">起步建議</span><p>每條規則配一個故意違反的例子，先確認測試會失敗，再放大測試量。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>操作介面用 <a href="https://github.com/antithesishq/bombadil">Bombadil</a>（工具，不是 skill）；一般函式用該語言的性質測試框架。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-06">
  <div class="tk-head"><span class="tk-no">06</span><div><div class="tk-title">形式驗證</div><div class="tk-en">Formal verification</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">用數學方法證明，或把所有可能走一遍。就是前面講的模型檢查與數學證明。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>同一份文件兩個人同時編輯：證明不會出現「兩邊都以為自己存成功，其實一邊被蓋掉」。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://lamport.azurewebsites.net/tla/high-level-view.html">Leslie Lamport〈A High-Level View of TLA+〉</a>：TLA+ 的作者。模型描述的是程式碼之上的設計層；它抓的是設計錯誤，不保證程式照著寫。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">架構師或技術主管</span><p>架構師，或懂形式方法的專家。多數團隊以前根本沒人做。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>在講清楚的模型和假設下，證明某件壞事不會發生。</p></div><div><span class="tk-label">效益</span><p>還沒寫大量程式之前，就找出事件順序、重試這類設計上的矛盾。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 讓寫模型便宜很多。人要審的是：模型像不像真的系統。要它把「模型省略了什麼」和結果一起交。演講點名在用。</p><ol><li><b>準備：</b>和人確認要保護的規則，把流程簡化成狀態和事件的模型。</li><li><b>執行：</b>跑模型檢查，把違規的路徑整理成看得懂的步驟。</li><li><b>交付：</b>交模型、檢查過的規則、省略了什麼，以及違規時的最短路徑。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>模型問的是不是對的問題、假設合不合理、結論能推多遠。最好有懂形式方法的人看過。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>AI 用白話解釋一遍，不是證明。模型對了，也擋不住沒照模型寫的程式。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>重要的通訊協定、多件事同時發生的流程、資料一致性、後果嚴重的狀態切換。不是每個新增修改刪除的功能都需要。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>模型本身、檢查過的規則、省略了什麼的說明、違規時的最短路徑。</p></div><div><span class="tk-label">起步建議</span><p>先驗一條出錯代價最高的規則，並把「模型省略了什麼」和結果寫在同一份報告。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/statechart/SKILL.md">pstack 的 statechart</a>、<a href="https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/create-formal-verification-skill/SKILL.md">pstack 的 create-formal-verification-skill</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-07">
  <div class="tk-head"><span class="tk-no">07</span><div><div class="tk-title">靜態分析</div><div class="tk-en">Static analysis</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">不執行程式，只讀程式碼找問題。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>工具掃出「使用者輸入沒檢查就拿去組查詢語句」這類寫法。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://owasp.org/www-community/controls/Static_Code_Analysis">OWASP〈Static Code Analysis〉</a>：用工具在沒有執行的原始碼裡標出可能的弱點；同一頁也提醒，這類工具的誤報很多。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>開發工程師跑工具、修問題；規則由技術主管定，安全類的規則由資安人員定。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>找出型別、資料流向和安全規則上的問題。</p></div><div><span class="tk-label">效益</span><p>程式還沒跑就先擋下機器認得出的錯，人的時間留給設計問題。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>每次修改自動跑。同一種錯糾正過兩次，就讓它寫成新規則。不准它用關掉規則來換全部通過。</p><ol><li><b>準備：</b>確認專案已經開了哪些規則，哪些錯是最近反覆出現的。</li><li><b>執行：</b>每次修改後自動跑；重複出現的錯寫成新規則。</li><li><b>交付：</b>交這次的發現、修了什麼、新增或例外了哪些規則和理由。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>哪些規則要開、哪些例外可以接受，由技術主管和資安人員決定。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>它會誤報也會漏報，而且看不懂完整的業務意思。零警告如果是靠關規則換來的，沒有意義。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>每次提交都跑；工具、規則或主要套件更新時再整體跑一次。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>掃描報告、每個例外的理由與負責人、這次新增或關掉了哪些規則。</p></div><div><span class="tk-label">起步建議</span><p>先開那些報出來就知道怎麼改的規則，慢慢調掉雜訊。每個例外都要有負責人和理由。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/correct/SKILL.md">pstack 的 correct</a>，把 AI 反覆犯的錯變成檢查；安全面可用 <a href="https://github.com/openai/skills/blob/main/skills/.curated/security-best-practices/SKILL.md">OpenAI 的 security-best-practices</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-08">
  <div class="tk-head"><span class="tk-no">08</span><div><div class="tk-title">變異測試</div><div class="tk-en">Mutation tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">故意把程式改壞一點，看測試抓不抓得到。測的是「測試本身」。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>把「滿一千免運」偷改成「滿一千零一」，看有沒有任何測試因此失敗。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://testing.googleblog.com/2021/04/mutation-testing.html">Google Testing Blog〈Mutation Testing〉</a>：有測試因此失敗，叫「殺死」那個變異；沒有任何測試失敗，叫變異「存活」。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">測試人員（QA）</span><p>很少有人專責。有做的團隊，多半是測試工程師帶著開發工程師做。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認測試真的抓得到小錯，而不只是把程式跑過一遍。</p></div><div><span class="tk-label">效益</span><p>找出「覆蓋率很高、其實什麼都沒檢查」的地方。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>特別值得交給 AI，它專治「測試全過，其實什麼都沒測到」。先挑最重要的幾個模組，把沒被抓到的改動逐一補上測試。不必追 100%，有些改動本來就不影響結果。</p><ol><li><b>準備：</b>依這次改動和風險選定範圍，不必一次全專案。</li><li><b>執行：</b>跑變異工具，把沒被抓到的改動分成：缺檢查、沒測到、其實不影響結果。</li><li><b>交付：</b>補上有意義的測試後重跑，交每個重要改動的處理前後。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>沒被抓到的改動，是測試不夠，還是那個改動本來就不影響結果？這要人看。花多少成本做，也是人決定。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>分數會受工具和規則影響。高分不等於沒有錯，也不必追到 100%。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>核心邏輯、重要的修正，或覆蓋率很高、錯卻一直漏出去的模組。可以只測這次改到的範圍。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>沒被抓到的改動清單、每一個的處理方式（補測試，或說明為何不影響）。</p></div><div><span class="tk-label">起步建議</span><p>先挑幾個高風險、沒被抓到的改動逐一補測試，留下判斷理由，比訂一個全專案的分數門檻有用。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。常見的是各程式語言的變異測試工具，例如 Stryker、PIT。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-09">
  <div class="tk-head"><span class="tk-no">09</span><div><div class="tk-title">覆蓋率</div><div class="tk-en">Coverage tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">量測試跑過多少比例的程式。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>報告顯示退款流程的錯誤處理分支完全沒有被任何測試走過。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://martinfowler.com/bliki/TestCoverage.html">Martin Fowler〈TestCoverage〉</a>：覆蓋率拿來找沒測到的程式很有用；拿來當「測試有多好」的分數，幾乎沒用。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>開發工程師收集數字；技術主管決定要看到什麼程度。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>知道哪些程式測試走過、哪些完全沒碰到。</p></div><div><span class="tk-label">效益</span><p>讓缺口看得見，決定下一步該補哪裡。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>讓它列出沒測到的重要分支。別把數字當目標，它會寫空洞的測試去衝數字。</p><ol><li><b>準備：</b>確認量測範圍和排除清單是人核准過的。</li><li><b>執行：</b>跑測試並收集覆蓋率，找出沒走到的重要分支。</li><li><b>交付：</b>交缺口清單和補測建議，數字只當參考。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>量哪些範圍、門檻多少、哪些檔案排除，由技術主管決定。數字變高時，要有人看是不是真的多驗了東西。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>程式被跑過，不等於被檢查過。刪掉難測的檔案、加排除設定、寫沒有檢查的測試，都能讓數字變好看。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>每次修改和上一版比、盤點測試缺口、大改或新服務建立時。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>沒測到的重要分支清單、排除了哪些檔案與理由、和上一版的比較。</p></div><div><span class="tk-label">起步建議</span><p>用「還沒測到的重要分支」清單來管理，不要把 100% 當成可以上線的證書。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。多數程式語言的測試框架都內建或有常用的覆蓋率工具。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-10">
  <div class="tk-head"><span class="tk-no">10</span><div><div class="tk-title">基準測試</div><div class="tk-en">Benchmark tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">固定條件下量速度與資源，拿新舊版比較。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>換了一種搜尋寫法：在同一台機器、同一份資料上各跑三十次，比較兩版的時間。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://www.brendangregg.com/activebenchmarking.html">Brendan Gregg〈Active Benchmarking〉</a>：隨手做的基準測試常常是：想量 A，實際量到 B，卻以為自己量到了 C。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>動到效能的那位開發工程師；大團隊有專門的效能工程師。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>在可以重現的條件下，比出新舊版的速度和資源差異。</p></div><div><span class="tk-label">效益</span><p>用數字決定一個優化值不值得做，也能早點發現變慢。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>要它固定環境、重複量、交前後對照。只量一次的數字不算。</p><ol><li><b>準備：</b>固定機器、資料和工作量，先確認新舊兩版算出來的結果一樣。</li><li><b>執行：</b>新舊各重複量很多次，記錄分布。</li><li><b>交付：</b>交環境說明、分布對照，以及差異是否超過雜訊的判斷。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>測試用的工作量有沒有代表性；快出來的那一點，值不值得多出來的複雜度。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>只跑一次、或在不同機器上比，數字很容易騙人。某一段變快，不代表整個產品變快。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>演算法、資料存取、資源配置這類效能修改，以及重要套件升級時。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>測試環境與資料說明、多次量測的分布（不是單一數字）、新舊對照。</p></div><div><span class="tk-label">起步建議</span><p>先做出一個能穩定重跑的基準，再談門檻。比速度之前，先確認兩版算出來的結果一樣。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/benchmark-checklist/SKILL.md">pstack 的 benchmark-checklist</a>，在回報效能數字之前先檢查量法；服務層級的量測工具可用 <a href="https://grafana.com/docs/k6/latest/">Grafana k6</a>（工具，不是 skill）。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-11">
  <div class="tk-head"><span class="tk-no">11</span><div><div class="tk-title">契約測試</div><div class="tk-en">Contract tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">檢查兩個系統約好的資料格式，有沒有被其中一邊偷改。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>手機應用程式需要訂單資料裡的「狀態」欄位；後端改欄位名稱之前，契約測試先失敗。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://martinfowler.com/bliki/ContractTest.html">Martin Fowler〈ContractTest〉</a>：用替身代替外部服務會留下一個問題：替身還像不像真的服務？契約測試就是在回答這個問題。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>介面兩邊的開發工程師：用的一方寫出期待，提供的一方驗證。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認兩邊對資料格式和互動方式的期待一致。</p></div><div><span class="tk-label">效益</span><p>不用把整套系統開起來，就能發現「這樣改會弄壞別人」。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>適合交給它。約定本身由人管，不准它為了過測試去改約定。</p><ol><li><b>準備：</b>從使用方真正用到的欄位和互動整理出約定。</li><li><b>執行：</b>分別驗使用方和提供方；提供方那邊要對真的服務跑。</li><li><b>交付：</b>交約定內容、兩邊的驗證結果，以及這次改動會影響誰。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>哪些期待是真的約定、哪些只是碰巧這樣寫，由兩邊的工程師講清楚。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>只檢查格式不夠。用的一方只對自己寫的假服務通過，也不算數，要拿去驗真的提供方。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>資料格式要改、好幾個系統共用同一個服務、各自獨立上線，或舊版要淘汰之前。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>雙方約定的內容、提供方實際驗證通過的紀錄、這次改動影響了誰。</p></div><div><span class="tk-label">起步建議</span><p>讓約定跟著真實的使用需求一起更新，不要只驗格式就宣布相容。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。常見的是契約測試框架，例如 Pact。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-12">
  <div class="tk-head"><span class="tk-no">12</span><div><div class="tk-title">寫法檢查</div><div class="tk-en">Lint tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">自動檢查寫法有沒有照專案規定。它是靜態分析的一種。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>規定不准直接印出除錯訊息到正式環境，違規的寫法一存檔就被標出來。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://eslint.org/docs/latest/use/core-concepts/">ESLint 文件〈Core Concepts〉</a>：規則是核心：每條規則檢查程式是否符合某個期待，以及不符合時該怎麼處理。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>開發工程師；規則由技術主管定。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>把團隊講好的寫法規定，交給機器每次都檢查。</p></div><div><span class="tk-label">效益</span><p>省掉 review 時反覆吵寫法的時間。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>錯誤訊息寫清楚「該怎麼改」，AI 會照做。這就是她取代註解的做法。</p><ol><li><b>準備：</b>讀專案的規則設定，確認每條規則的錯誤訊息寫得出「該怎麼改」。</li><li><b>執行：</b>邊寫邊跑，照訊息修正；純改格式的另外送。</li><li><b>交付：</b>交剩下的違規和每一個「忽略」的理由。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>規定本身和可以接受的例外，由技術主管決定。自動修正有沒有改到行為，要工程師確認。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>沒有警告不代表功能正確。不能為了全部通過，就關規則、擴大忽略範圍。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>邊寫邊跑、提交前跑、合併前再跑；規定或工具升級時整體跑一次。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>規則設定檔、這次的違規與修正、任何「忽略這一行」的理由。</p></div><div><span class="tk-label">起步建議</span><p>純粹改格式的修改和改功能的修改分開送，免得一大片機械式修改蓋住真正的邏輯差異。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/correct/SKILL.md">pstack 的 correct</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-13">
  <div class="tk-head"><span class="tk-no">13</span><div><div class="tk-title">驗收測試</div><div class="tk-en">Acceptance tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">用需求方的話檢查：這是不是我要的？</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>業務代表照著「新客戶完成第一筆訂單」的情境實際走一遍，確認每一步都符合他的需要。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://www.agilealliance.org/glossary/acceptance-testing/">Agile Alliance 詞彙表〈Acceptance Testing〉</a>：用例子或使用情境，正式描述產品該有的行為；結果通常只有過或不過。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">產品經理或需求方</span><p>提需求的人：業務單位、產品經理或客戶。測試人員協助執行、整理證據。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認做出來的東西，就是需求方要的東西。</p></div><div><span class="tk-label">效益</span><p>避免技術上全部通過，實際上卻不能用。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>條件由人寫，AI 負責照著跑、交出證據。不能讓它自己訂條件，再自己宣布通過。</p><ol><li><b>準備：</b>把人寫的驗收條件整理成可以逐條執行的情境，有歧義的先問。</li><li><b>執行：</b>照情境實際操作產品，錄下過程。</li><li><b>交付：</b>交逐條結果和影片或截圖，由驗收人決定過不過。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>需求有沒有被滿足、例外能不能接受，只有有權驗收的人能說。管時程的人不會因此就有驗收權。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>AI 能產生和執行驗收案例，但它不能自己想像業務條件，再用自己的理解宣布「使用者已驗收」。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>重要版本交付、流程改變、正式接手之前。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>驗收條件、逐條的結果、驗收人的確認紀錄。</p></div><div><span class="tk-label">起步建議</span><p>動工之前就確認誰驗收、看什麼算過。不要等期限到了才臨時改通過條件。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/create-verification-skill/SKILL.md">pstack 的 create-verification-skill</a>，替專案做一支「照使用者的方式操作」的驗證技能；網頁可用 <a href="https://playwright.dev/docs/test-agents">Playwright Test Agents</a> 或 <a href="https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md">Anthropic 的 webapp-testing</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-14">
  <div class="tk-head"><span class="tk-no">14</span><div><div class="tk-title">回歸測試</div><div class="tk-en">Regression tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">確認以前好的地方，沒被這次改壞。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>修好「折扣碼不能和免運同時用」之後，確認結帳、退款、發票都沒有被弄壞。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://sre.google/sre-book/testing-reliability/">Google《SRE》〈Testing for Reliability〉</a>：回歸測試像一座陳列館，收著過去害系統出錯的那些 bug，用來防止它們溜回程式裡。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">測試人員（QA）</span><p>測試人員為主；開發工程師負責比較底層的部分。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認這次修改沒有弄壞原本正常的功能。</p></div><div><span class="tk-label">效益</span><p>版本一直改，舊功能還是有人顧。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>每修一個錯，就要它補一條能重現那個錯的測試。不准它直接改掉「預期結果」讓測試通過。</p><ol><li><b>準備：</b>分析這次改動會影響哪些既有功能。</li><li><b>執行：</b>跑關鍵流程加上受影響的案例；修過的錯各補一條重現測試。</li><li><b>交付：</b>交選了哪些、為什麼、結果如何；預期結果有變的另外列給人看。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>影響範圍有沒有漏掉別的模組；決定少測哪些、接受哪些風險，要有說得出口的理由。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>確認「那個錯修好了」和確認「沒弄壞別的」是兩件事。也不能把變差的行為直接改成新的預期結果。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>程式、設定、套件或執行環境有改動之後。測多少，看影響範圍和風險。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>這次改動影響範圍的分析、選了哪些案例與理由、執行結果。</p></div><div><span class="tk-label">起步建議</span><p>先建一組小而穩定的關鍵流程，再依這次改了什麼加選，不要每次全跑，也不要只跑新功能。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/obra/superpowers/blob/main/skills/test-driven-development/SKILL.md">superpowers 的 test-driven-development</a>；網頁流程可用 <a href="https://playwright.dev/docs/test-agents">Playwright Test Agents</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-15">
  <div class="tk-head"><span class="tk-no">15</span><div><div class="tk-title">冒煙測試</div><div class="tk-en">Smoke tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">最基本的檢查：開得起來、主要功能沒掛。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>新版部署到測試環境後，先確認首頁打得開、能登入、能查到一筆資料。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://sre.google/sre-book/testing-reliability/">Google《SRE》〈Testing for Reliability〉</a>：只測非常簡單但關鍵的行為，用來提早擋下後面更花錢的測試。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>負責部署的人（維運或開發工程師）；檢查清單常由測試人員提供。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>幾分鐘內判斷這一版值不值得繼續往下測。</p></div><div><span class="tk-label">效益</span><p>早點攔下「根本開不起來」的版本，省掉後面的時間。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>每次修改後自動跑，沒過就停，不往下做。清單要短，檢查太多就失去「快」的意義。</p><ol><li><b>準備：</b>和人確認最少要檢查哪幾件事。</li><li><b>執行：</b>每次部署後自動跑，沒過就停。</li><li><b>交付：</b>交每一項的結果、花的時間，以及停在哪一步。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>「基本可用」的門檻和例外，由負責平台和服務的人定。通過冒煙不等於核准上線。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>健康檢查回報正常，不代表登入、資料庫和主要流程真的正常。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>新環境建好、剛部署完、關鍵設定改過之後。只放少數最有鑑別力的檢查。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>檢查清單與結果、花了多久、沒過時停在哪一步。</p></div><div><span class="tk-label">起步建議</span><p>控制在幾分鐘內有答案的規模，比較深的檢查留給後面的功能和回歸測試。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/create-verification-skill/SKILL.md">pstack 的 create-verification-skill</a>；網頁可用 <a href="https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md">Anthropic 的 webapp-testing</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-16">
  <div class="tk-head"><span class="tk-no">16</span><div><div class="tk-title">易用性測試</div><div class="tk-en">Usability tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">找真人來用，看他們在哪裡卡住。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>請五位沒用過的人完成「改送貨地址」，看他們在哪一步猶豫、找不到按鈕。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://www.nngroup.com/articles/usability-testing-101/">Nielsen Norman Group〈Usability Testing 101〉</a>：研究者請參與者完成任務，在旁邊觀察他的行為、聽他的回饋。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">設計師或使用者研究員</span><p>使用者研究員或設計師；沒有這個職位的團隊，通常是產品經理。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>了解真人找不找得到、看不看得懂、做不做得完。</p></div><div><span class="tk-label">效益</span><p>找出程式測不出來的卡點，少做白工。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 可以模擬操作，找出明顯的障礙。它代替不了真人，它的「使用感想」也不能當成研究結果。</p><ol><li><b>準備：</b>幫忙準備任務腳本和招募條件，先自己走一遍找出明顯的障礙。</li><li><b>執行：</b>真人測試時負責記錄和整理，不代替參與者。</li><li><b>交付：</b>交觀察紀錄的歸納，並標明哪些只是它自己的推測。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>找來的人有沒有代表性、任務有沒有暗示答案、觀察怎麼解讀，由做研究的人判斷。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>AI 扮演的使用者、或 AI 自己操作成功，都不能當成真人研究。沒有真人，就只能叫「假設」。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>原型階段、重要流程或選單架構調整時；或真實使用者一直在同一個地方遇到困難。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>任務腳本、每位參與者的觀察紀錄、歸納出的問題與嚴重程度。</p></div><div><span class="tk-label">起步建議</span><p>先研究一個真實又重要的任務，留下可以回頭查的觀察紀錄。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有現成 skill 可以代替真人。用得到的是錄影、訪談紀錄和任務腳本。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-17">
  <div class="tk-head"><span class="tk-no">17</span><div><div class="tk-title">介面測試</div><div class="tk-en">UI/UX tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">畫面顯示與互動是否正確、一致。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>結帳頁在手機直式、橫式、平板、桌機四種寬度下，按鈕都看得到、按得到。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://martinfowler.com/bliki/BroadStackTest.html">Martin Fowler〈BroadStackTest〉</a>：介面測試我沒有找到公認的定義。最接近的是這一篇講的端到端測試：一次測到應用程式的大部分。他也說，這種測試不一定要經過畫面。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">設計師或使用者研究員</span><p>設計師定標準；前端工程師和測試人員檢查。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認畫面在各種螢幕尺寸和操作方式下，都顯示正確、能用。</p></div><div><span class="tk-label">效益</span><p>早點發現被遮住的按鈕、漏掉的狀態、跑版。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>讓它實際操作，交截圖和影片。畫面和上一版不一樣的時候，要人來判斷是進步還是壞掉，不准它自動把新截圖當成標準。</p><ol><li><b>準備：</b>列出要檢查的畫面、尺寸和狀態（空的、載入中、出錯）。</li><li><b>執行：</b>實際操作並截圖、錄影，和上一版比對。</li><li><b>交付：</b>交差異清單，由人判斷每個差異是進步還是壞掉。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>視覺和互動的標準由設計師核准；好不好懂要真人確認；自動檢查能涵蓋到哪裡，工程師和測試人員說明。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>截圖一模一樣，不代表體驗好；拿來比的那張基準圖也可能是錯的。不同電腦的字型也會造成無關的差異。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>新畫面、共用元件、手機與桌機版面、重要互動或樣式有變動時。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>各尺寸的截圖或影片、和上一版的差異、人看過差異後的判斷。</p></div><div><span class="tk-label">起步建議</span><p>畫面有變動就要有人看過，不讓 AI 因為「不一樣」就把所有基準圖更新掉。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://playwright.dev/docs/test-agents">Playwright Test Agents</a>、<a href="https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md">Anthropic 的 webapp-testing</a>；想讓工具自己亂點找問題，用 <a href="https://github.com/antithesishq/bombadil">Bombadil</a>（工具，不是 skill）。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-18">
  <div class="tk-head"><span class="tk-no">18</span><div><div class="tk-title">滲透測試</div><div class="tk-en">Penetration tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">模擬攻擊者，找可以入侵的漏洞。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>在授權範圍內嘗試：一般會員能不能改網址就看到別人的訂單？</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://owasp.org/www-project-web-security-testing-guide/">OWASP《Web Security Testing Guide》</a>：公開的網頁安全測試指南。<br><a href="https://csrc.nist.gov/pubs/sp/800/115/final">NIST SP 800-115</a>：美國國家標準暨技術研究院的資安測試技術指南。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">資安人員</span><p>資安人員，或外聘的資安團隊。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>在授權的範圍內，證明哪些弱點真的打得進來、後果多嚴重。</p></div><div><span class="tk-label">效益</span><p>修補有先後順序，不被一長串掃描警告淹沒。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>可以幫忙掃已知弱點，只在自己擁有、已授權的環境做。結論由資安人員判斷。掃不到東西，不等於安全。</p><ol><li><b>準備：</b>在授權文件的範圍內，整理要檢查的入口和已知弱點類型。</li><li><b>執行：</b>只對授權的目標執行檢查，記錄每一步。</li><li><b>交付：</b>交每個發現的重現步驟和影響，由資安人員確認。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>測試範圍、方法和證據夠不夠，由資安專家掌握。風險要不要接受，由有權責的主管決定，不是 AI 或測試的人。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>跑一次掃描工具不等於滲透測試。沒掃到東西，更不能寫成「保證安全」。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>重要的對外功能、權限邊界有改動時，或依風險定期安排。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>授權範圍文件、每個發現的重現步驟與影響、修補後的重測結果。</p></div><div><span class="tk-label">起步建議</span><p>把允許用的工具和不能碰的目標，直接限制在執行環境裡，並要求每個發現都附可以重測的證據。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有現成 skill 能完成整個滲透測試。資安人員常用的有 Burp Suite、OWASP ZAP 這類工具。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-19">
  <div class="tk-head"><span class="tk-no">19</span><div><div class="tk-title">威脅建模</div><div class="tk-en">Threat modeling</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">動手前先想清楚：誰會來攻擊、打哪裡、怎麼防。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>新增「用社群帳號登入」之前，先畫出資料怎麼流、哪一段可能被冒用。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://owasp.org/www-community/Threat_Modeling">OWASP〈Threat Modeling〉</a>：找出、溝通並理解威脅與對策，目的是保護有價值的東西。<br><a href="https://www.threatmodelingmanifesto.org/">Threat Modeling Manifesto</a>：分析系統的表示方式，凸顯安全與隱私上的顧慮。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">架構師或技術主管</span><p>架構師或技術主管，和資安人員一起做。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>找出設計裡最需要保護的東西，以及它可能怎麼被攻擊。</p></div><div><span class="tk-label">效益</span><p>問題在設計階段就改掉，比寫完再補便宜。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 可以列初稿，但要對照真的架構，它很會寫出看似完整、其實和你的系統無關的清單。哪些風險要擋、哪些接受，是人的決定。</p><ol><li><b>準備：</b>讀設計和程式，畫出資料怎麼流、信任的邊界在哪。</li><li><b>執行：</b>列出可能的威脅和現有的防護，對照真的架構刪掉不相干的。</li><li><b>交付：</b>交威脅清單，每一條對到一個設計決定或一條測試。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>系統實際長什麼樣、威脅成不成立、防護有沒有效，由架構師和資安人員確認。剩下的風險誰承擔，要有名字。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>AI 很會產出看起來完整、其實和你的架構無關的威脅清單。沒對照現況，結論就不可靠。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>設計初期、資料流向或權限有改、接新的外部服務、部署方式改變時。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>資料流向圖、威脅清單與對應的防護、決定接受的風險與負責人。</p></div><div><span class="tk-label">起步建議</span><p>從一條最關鍵的資料流開始，要求每個高優先的威脅都連到一個設計決定或一條測試。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/openai/skills/blob/main/skills/.curated/security-threat-model/SKILL.md">OpenAI 的 security-threat-model</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-pre" id="t-20">
  <div class="tk-head"><span class="tk-no">20</span><div><div class="tk-title">效能測試</div><div class="tk-en">Performance tests</div></div><span class="tk-stage">上線前</span></div>
  <p class="tk-def">速度與反應時間有沒有達標。它是總稱：基準測試、負載測試、長時間測試都算在裡面。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>平常同時一千人在線，查詢要在一秒內回應，錯誤率低於千分之一。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://sre.google/sre-book/testing-reliability/">Google《SRE》〈Testing for Reliability〉</a>：基本正確性確立之後，下一步是確保系統的效能在整個生命週期都維持可接受。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>維運人員，或專門的效能測試人員；瓶頸由開發工程師修。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認在預期的使用量下，速度、錯誤率和資源用量都達標。</p></div><div><span class="tk-label">效益</span><p>在使用者覺得慢之前，先找到瓶頸。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>給它量測工具和門檻，退步就擋下。要看最慢的那一批請求，不要只看平均。</p><ol><li><b>準備：</b>把人定的目標寫成流量設定和通過門檻。</li><li><b>執行：</b>在指定的環境執行，同時收集回應時間分布和資源用量。</li><li><b>交付：</b>交和目標的對照、瓶頸位置，以及測試環境和正式環境的差異。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>可以接受的速度、容量和成本，由服務負責人和產品經理定。測試環境和正式環境差多少，工程師要說明。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>平均值漂亮，可能蓋住一批很慢的請求。一次通過，不能推到所有流量情況。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>大改版、資料量成長、基礎設施或關鍵查詢有變、重要的流量高峰之前。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>測試的流量設定、回應時間分布（含最慢的那批）、資源用量、和目標的對照。</p></div><div><span class="tk-label">起步建議</span><p>先寫清楚「在多少使用量下，要達到什麼標準」，錯誤率和資源用量一起看。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://grafana.com/docs/k6/latest/">Grafana k6</a>（工具，不是 skill）。</p>
  </div></details>
</div>

### 部署：6 項，放上去了但還沒人用

<div class="tk-card tk-deploy" id="t-21">
  <div class="tk-head"><span class="tk-no">21</span><div><div class="tk-title">整合測試</div><div class="tk-en">Integration tests</div></div><span class="tk-stage">部署</span></div>
  <p class="tk-def">確認新版和真的資料庫、其他服務接得起來。可以在測試環境做，也可以在部署之後做。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>訂單服務接上真的資料庫和訊息佇列：確認下單後庫存真的扣了、通知真的排進去。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://martinfowler.com/bliki/IntegrationTest.html">Martin Fowler〈IntegrationTest〉</a>：確認各自獨立開發的單元接起來後能正確運作。他也提醒這個詞已經被用得很模糊，整合測試不一定要大範圍。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>開發工程師；跨服務的情境由測試人員補。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認幾個真的元件接起來之後，資料和錯誤處理都對。</p></div><div><span class="tk-label">效益</span><p>找出假替身蓋掉的問題，例如權限不對、格式對不上。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>可以寫、可以跑。要用專用的測試帳號與資料，不能弄髒真資料。</p><ol><li><b>準備：</b>列出這次改動碰到哪些真的相依，準備隔離的測試帳號和資料。</li><li><b>執行：</b>把相依服務開起來，跑接點的測試，結束後清乾淨。</li><li><b>交付：</b>交執行紀錄和資料隔離的證明。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>測試用的帳號和資料有沒有確實隔離；資料意思有歧義時，問懂業務的人。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>外部全部換成假的，通常證明不了真的接得起來。在正式環境測，要先證明不會寄出真的通知、寫進真的資料。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>新增或修改資料庫、訊息佇列、外部服務的串接時。只改文案不必整套重跑。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>用了哪些真的元件、測試資料怎麼隔離與清除、執行紀錄。</p></div><div><span class="tk-label">起步建議</span><p>先把現有的整合測試、相依服務怎麼啟動、測試資料怎麼清，包成 AI 可以重複呼叫的流程。讓它跑真的測試，不是只產生測試程式。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/create-verification-skill/SKILL.md">pstack 的 create-verification-skill</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-deploy" id="t-22">
  <div class="tk-head"><span class="tk-no">22</span><div><div class="tk-title">新舊比對</div><div class="tk-en">Tap compare</div></div><span class="tk-stage">部署</span></div>
  <p class="tk-def">把真實流量複製一份給新版，比對新舊兩版的回應一不一樣。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>重寫搜尋功能：同樣一萬筆真實查詢，新舊兩版的結果逐筆比對。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span>這個詞出現在 Cindy Sridharan 的清單裡。她的原文我打不開，沒辦法轉述；上面是業界一般的用法。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>開發工程師做比對；複製流量的機制由維運人員架。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>找出新舊兩版對同一份輸入，回應哪裡不同。</p></div><div><span class="tk-label">效益</span><p>重寫或搬家的時候，有一份看得到的差異清單。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 適合整理差異，分出哪些在預期內。提醒一句：兩版一樣只代表一致，舊版也可能本來就是錯的。</p><ol><li><b>準備：</b>和人確認哪些欄位必須相同、容許多少誤差。</li><li><b>執行：</b>用同一份輸入跑新舊兩版，逐筆比對。</li><li><b>交付：</b>把差異縮成可以重現的案例，分成新版錯、舊版錯、預期內三類。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>怎樣算「業務上相同」由懂業務的人決定。AI 不能自己放寬容許誤差、或跳過重要欄位來讓差異變少。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>兩版一樣只代表一致，舊版也可能有錯。兩邊都跑會增加負擔，「只是讀取」的路徑也可能暗藏寫入或通知。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>重寫既有的計算、查詢或服務，而且舊版可以當比較基準的時候。全新的功能沒有舊版可比，要另外訂標準。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>比對規則、差異清單與分類（預期內或真的錯）、比對工具自己的驗證。</p></div><div><span class="tk-label">起步建議</span><p>先用離線資料，確認比對工具抓得到你故意放進去的差異，再接真的流量。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。通常是自己寫比對程式，搭配流量複製或重播的工具。</p>
  </div></details>
</div>

<div class="tk-card tk-deploy" id="t-23">
  <div class="tk-head"><span class="tk-no">23</span><div><div class="tk-title">負載測試</div><div class="tk-en">Load tests</div></div><span class="tk-stage">部署</span></div>
  <p class="tk-def">照預期的使用量灌請求，看速度和錯誤率守不守得住。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>週年慶之前，模擬預估的同時結帳人數，確認結帳速度和錯誤率還在標準內。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://grafana.com/docs/k6/latest/testing-guides/test-types/">Grafana k6〈Load test types〉</a>：平均負載測試：評估系統在預期的正常情況下表現如何。<br><a href="https://sre.google/sre-book/testing-reliability/">Google《SRE》〈Testing for Reliability〉</a>：壓力測試是另一回事：它要找的是系統和各個元件的極限在哪。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>效能測試人員或維運人員。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認在講好的流量下，速度和錯誤率都還在標準內。</p></div><div><span class="tk-label">效益</span><p>尖峰來之前，先知道容量夠不夠。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>可以寫腳本、讀結果。什麼時候、對哪個環境灌、灌到多少要停，都要人點頭，不讓它自己加量。</p><ol><li><b>準備：</b>依人給的預估流量寫腳本，確認環境和停止條件。</li><li><b>執行：</b>在核准的時間和環境執行，盯著數字，達到停止條件就停。</li><li><b>交付：</b>交回應時間分布、錯誤率、瓶頸和容量估算。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>可以接受的體驗由產品和技術負責人一起定；在正式環境加壓，照既有的授權，不由 AI 自己加量。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>一路加到撐不住，另外叫壓力測試（stress test），目的不同。只看平均會漏掉最慢的那批。固定的使用者人數，也不一定像真實的流量進來方式。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>預期流量會成長、查詢或架構大改、活動之前要估容量的時候。還不知道流量長怎樣，先補觀測。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>流量腳本、停止條件、瓶頸在哪、容量估算。</p></div><div><span class="tk-label">起步建議</span><p>把現有腳本、資料、環境檢查和停止條件包成一套流程，先有可以比較的基準，再讓 AI 提改善。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://grafana.com/docs/k6/latest/">Grafana k6</a>（工具，不是 skill）。</p>
  </div></details>
</div>

<div class="tk-card tk-deploy" id="t-24">
  <div class="tk-head"><span class="tk-no">24</span><div><div class="tk-title">影子流量</div><div class="tk-en">Shadowing</div></div><span class="tk-stage">部署</span></div>
  <p class="tk-def">讓新版默默處理一份真實流量，結果不回給使用者。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>新的推薦服務上線前，先收一份真實流量的副本跑一週，使用者看到的仍是舊版。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://istio.io/latest/docs/tasks/traffic-management/mirroring/">Istio 文件〈Mirroring〉</a>：流量鏡像又叫 shadowing：把正式流量複製一份送到鏡像服務，不在主要請求的路徑上。<br><a href="https://martinfowler.com/bliki/DarkLaunching.html">Martin Fowler〈DarkLaunching〉</a>：讓既有使用者在不知情的狀況下呼叫新的後端功能，用來評估多出來的負載。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>維運人員架設；開發工程師負責確保新版不會產生真的副作用。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>看新版遇到真實的輸入時表現如何，但不影響使用者。</p></div><div><span class="tk-label">效益</span><p>發現測試資料沒涵蓋到的真實情況。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 適合整理結果。開始前先確認新版不會真的寄信、扣款、寫進正式資料。</p><ol><li><b>準備：</b>列出新版所有會產生副作用的動作，逐一確認已隔離。</li><li><b>執行：</b>流量複製開始後，整理新版的錯誤和速度。</li><li><b>交付：</b>交副作用檢查清單、新版的表現，以及多出來的資源成本。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>副作用有沒有隔離乾淨由開發確認；流量和容量由維運確認；資料能不能這樣用，由資安確認。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>「不把回應交給使用者」不等於沒有副作用。鏡像的請求可能照樣寄信、扣款、排工作，也可能讓下游的負擔加倍。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>新服務要取代舊的、搬家、高風險重寫，而且隔離得了副作用、付得起多一份資源的時候。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>副作用隔離的檢查清單、新版的錯誤率與速度、多出來的資源成本。</p></div><div><span class="tk-label">起步建議</span><p>從確定沒有副作用的查詢、小比例抽樣開始。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。靠的是流量複製功能，服務之間的流量管理工具（例如 Istio）多半有提供。</p>
  </div></details>
</div>

<div class="tk-card tk-deploy" id="t-25">
  <div class="tk-head"><span class="tk-no">25</span><div><div class="tk-title">設定測試</div><div class="tk-en">Config tests</div></div><span class="tk-stage">部署</span></div>
  <p class="tk-def">設定的改動也當成程式來測，而且先小範圍套用。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>把等待時間從三十秒改成五秒：先套用到一台機器，確認沒有大量逾時再擴大。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://sre.google/workbook/configuration-design/">Google《SRE Workbook》〈Configuration Design〉</a>：用一整章討論設定該怎麼設計，才不會在緊急時刻改錯。<br><a href="https://sre.google/sre-book/testing-reliability/">Google《SRE》〈Testing for Reliability〉</a>：Google 把服務的設定存在版本控制裡，並且有專門的設定測試。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>維運人員，和那個服務的開發工程師。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認設定在真的環境裡載入正確、連到對的地方。</p></div><div><span class="tk-label">效益</span><p>少掉「格式沒錯、意思錯了」的事故，例如連錯資料庫。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>適合讓它檢查設定改動、說明差在哪。套用到正式環境要人核准。密碼和金鑰不要給它看。</p><ol><li><b>準備：</b>比對新舊設定，說明每一項差在哪、會影響什麼。</li><li><b>執行：</b>檢查格式和相依條件，在小範圍套用後觀察。</li><li><b>交付：</b>交差異說明、觀察結果和退回方式；套用到全部由人核准。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>設定的意思和要套用的環境，由擁有那份設定的人確認；碰到權限或金鑰，要資安或平台的人看。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>格式合法不代表行為正確。設定不該因為「不是程式」就跳過審查。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>改環境參數、連線位址、權限、資源上限、等待時間、功能開關的組合時。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>設定差異、實際生效的值、小範圍套用的觀察結果、退回方式。</p></div><div><span class="tk-label">起步建議</span><p>把格式檢查、實際生效的設定摘要、各環境的差異、行為驗證串在一起，不要只驗語法。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。用設定的格式檢查工具，加上小範圍套用的發布流程。</p>
  </div></details>
</div>

<div class="tk-card tk-deploy" id="t-26">
  <div class="tk-head"><span class="tk-no">26</span><div><div class="tk-title">長時間測試（浸泡測試）</div><div class="tk-en">Soak tests</div></div><span class="tk-stage">部署</span></div>
  <p class="tk-def">讓系統在負載下連續跑很久，找慢慢累積的問題，例如記憶體越吃越多。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>讓系統在一般負載下連跑三天，發現記憶體每小時多吃一點、第二天開始變慢。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://grafana.com/docs/k6/latest/testing-guides/test-types/">Grafana k6〈Load test types〉</a>：浸泡測試：評估系統在長時間下的可靠度與效能。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>效能測試人員或維運人員。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認系統跑了很久之後，資源用量和速度還是穩的。</p></div><div><span class="tk-label">效益</span><p>找到短時間測試看不到的問題。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>適合交給 AI 盯長時間的數據、回報趨勢。要看整段過程，不能只看結束那一刻是不是正常。</p><ol><li><b>準備：</b>設定代表性的負載和觀察時間，確認會記錄整段數據。</li><li><b>執行：</b>執行期間定時檢查記憶體、連線數、速度的趨勢。</li><li><b>交付：</b>交整段曲線、異常出現的時間點和可能的原因。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>跑多久、多少負載才有代表性，由技術負責人決定。沒有變差，只能說明觀察過的那段時間和條件。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>重點是時間和累積，不是負載最高，也不是固定幾小時。只看結束時正常，會漏掉中途變慢和自動重啟。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>長時間不關機的服務、連線管理或暫存機制有改、背景工作有變，或曾經「跑了幾小時、幾天才變差」的系統。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>整段時間的資源曲線、重啟紀錄、問題出現的時間點。</p></div><div><span class="tk-label">起步建議</span><p>用既有的排程去跑，讓 AI 負責設定、分析和整理例外，保留整段時間的數據和重啟紀錄。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://grafana.com/docs/k6/latest/">Grafana k6</a>（工具，不是 skill）。</p>
  </div></details>
</div>

### 發布：5 項，開始放使用者進來

<div class="tk-card tk-release" id="t-27">
  <div class="tk-head"><span class="tk-no">27</span><div><div class="tk-title">金絲雀發布</div><div class="tk-en">Canarying</div></div><span class="tk-stage">發布</span></div>
  <p class="tk-def">先讓一小部分使用者用新版，沒事再擴大。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>新版先給 1% 的使用者，錯誤率和舊版差不多才放到 10%，再放到全部。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://martinfowler.com/bliki/CanaryRelease.html">Martin Fowler〈CanaryRelease〉</a>：先慢慢開放給一小群使用者，再推到全部，用來降低新版的風險。<br><a href="https://sre.google/workbook/canarying-releases/">Google《SRE Workbook》〈Canarying Releases〉</a>：對一項變更做部分、限時的部署並加以評估，用來決定要不要繼續推出。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>負責這次發布的人，通常是維運人員或發布工程師。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>用一小群使用者，判斷新版能不能擴大。</p></div><div><span class="tk-label">效益</span><p>出事的時候，受影響的人少，也退得回去。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 可以盯數字、建議要不要退回。自動退回的條件要事先寫死，不讓它臨場用一段話決定加速。</p><ol><li><b>準備：</b>確認擴大和退回的條件已經寫成平台能執行的規則。</li><li><b>執行：</b>每個階段比較新舊版的數字，整理異常。</li><li><b>交付：</b>交各階段的對照和建議；擴大或退回照規則，不由它臨場決定。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>照事先約好的規則處理。產品風險的取捨是產品經理的；維運負責發布穩定，不等於替所有業務條件背書。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>整體平均可能蓋住那一小群新版使用者的嚴重錯誤。少量請求沒報錯，不代表通過。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>可以依人群或流量慢慢放、有可靠的數字可看、也退得回去的發布。改了就回不去的資料變更，不能只靠它。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>各階段新舊版的數字對照、擴大或退回的依據、實際操作紀錄。</p></div><div><span class="tk-label">起步建議</span><p>先把發布的步驟、新舊版分開的數字、觀察多久、怎麼退回，寫成平台能執行的規則。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。靠的是能分階段發布的平台和新舊版分開的監控。</p>
  </div></details>
</div>

<div class="tk-card tk-release" id="t-28">
  <div class="tk-head"><span class="tk-no">28</span><div><div class="tk-title">監控</div><div class="tk-en">Monitoring</div></div><span class="tk-stage">發布</span></div>
  <p class="tk-def">持續看幾個關鍵數字，例如錯誤率、回應時間。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>發布後半小時，新版的付款失敗率比舊版高一倍，儀表板上看得出來。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://sre.google/sre-book/monitoring-distributed-systems/">Google《SRE》〈Monitoring Distributed Systems〉</a>：「四個黃金訊號」出自這一章，也談什麼問題才值得半夜把人叫起來。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>維運人員；開發工程師負責在程式裡放量測點。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>發布過程中，盡早看出新版有沒有讓服務變差。</p></div><div><span class="tk-label">效益</span><p>發現問題的時間變短，退回的決定有依據。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>可以讓它看異常、先整理一輪。看哪幾個數字是人的判斷，而且新舊版要分開看，不要只看全體平均。</p><ol><li><b>準備：</b>確認新舊版的數字可以分開看，關鍵的業務結果有接上。</li><li><b>執行：</b>發布期間持續查詢，把異常和版本、時間對起來。</li><li><b>交付：</b>交異常摘要和它連回的原始數字。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>維運看運作訊號，開發確認程式的意思，產品經理確認「怎樣算成功」。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>回應正常不保證內容正確。沒有警報，可能只是沒有量到。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>每一次會改變正式行為的發布。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>新舊版分開的關鍵數字、警報紀錄、當時做了什麼決定。</p></div><div><span class="tk-label">起步建議</span><p>先把版本標記和關鍵的業務結果接好，再讓 AI 去查。不要只丟一張儀表板截圖讓它猜。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。靠的是你們的監控平台和儀表板。</p>
  </div></details>
</div>

<div class="tk-card tk-release" id="t-29">
  <div class="tk-head"><span class="tk-no">29</span><div><div class="tk-title">流量調配</div><div class="tk-en">Traffic shaping</div></div><span class="tk-stage">發布</span></div>
  <p class="tk-def">控制多少比例的流量走新版。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>把台北地區的流量先導到新機房，其他地區維持不變。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://istio.io/latest/docs/concepts/traffic-management/">Istio 文件〈Traffic Management〉</a>：用路由規則控制服務之間的流量，可以依百分比分流，拿來做 A/B 測試、金絲雀和分階段發布。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>維運人員或網路工程師。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>精準控制哪些流量進哪一版。</p></div><div><span class="tk-label">效益</span><p>可以慢慢放、隨時切回。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>執行可以自動。比例和節奏的規則由人定，也不要給它任意改所有服務流量的權限。</p><ol><li><b>準備：</b>讀現有的流量規則，模擬這次修改後的分布。</li><li><b>執行：</b>照人定的比例和節奏套用，核對實際分布。</li><li><b>交付：</b>交核對結果和切回的方法。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>正式環境的流量規則由維運負責；開放給誰由產品經理確認；新舊版資料相不相容，由開發確認。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>設定 10% 不等於剛好 10% 的使用者。分流本身也沒有證明程式是對的。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>新舊版要並存、服務搬家、漸進發布，或需要固定一群人走新版的時候。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>分流規則、實際流量分布的核對、切回的演練紀錄。</p></div><div><span class="tk-label">起步建議</span><p>把規則檢查、模擬、實際分布核對、退回檢查包成流程，沿用平台既有的權限。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。靠的是負載平衡器或服務之間的流量管理工具。</p>
  </div></details>
</div>

<div class="tk-card tk-release" id="t-30">
  <div class="tk-head"><span class="tk-no">30</span><div><div class="tk-title">功能開關</div><div class="tk-en">Feature flagging</div></div><span class="tk-stage">發布</span></div>
  <p class="tk-def">程式先上線，功能用開關決定要不要讓人看到。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>新的結帳流程已經上線，但只對內部員工打開；確認沒問題才開給所有人。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://martinfowler.com/articles/feature-toggles.html">Pete Hodgson〈Feature Toggles〉</a>：刊在 Martin Fowler 的網站：不改程式就能改變系統行為；開關會增加複雜度，數量要控制。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">產品經理或需求方</span><p>開關由開發工程師做；開不開、開給誰，是產品經理的決定。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>把「程式上線」和「功能開放」拆成兩件事。</p></div><div><span class="tk-label">效益</span><p>不必一次開給所有人，出問題先關掉。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 很適合清掉用完沒拆的舊開關。開或關本身是產品決定。</p><ol><li><b>準備：</b>列出所有開關、負責人和現在的狀態。</li><li><b>執行：</b>測試重要的開關組合；找出已經全開、可以拆掉的舊開關。</li><li><b>交付：</b>交組合測試的結果和拆除建議，開或關由人決定。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>什麼時候開、開給誰，由產品經理決定。緊急關閉照值班的既定授權。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>開關一多，組合就爆炸。關掉也不一定收得回已經寫進去的資料。畫面上藏起來，不能代替後端的權限檢查。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>功能要先上線後開放、依人群漸進啟用，或需要能隨時關掉的時候。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>開關清單與負責人、各種開關組合的測試、舊開關的拆除紀錄。</p></div><div><span class="tk-label">起步建議</span><p>每個開關都要有負責人和拆除條件，別讓 AI 只會加開關、不管退場。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。靠的是功能開關的管理服務，或自己做的開關設定。</p>
  </div></details>
</div>

<div class="tk-card tk-release" id="t-31">
  <div class="tk-head"><span class="tk-no">31</span><div><div class="tk-title">例外追蹤</div><div class="tk-en">Exception tracking</div></div><span class="tk-stage">發布</span></div>
  <p class="tk-def">自動收集程式出錯的紀錄，和出錯當下的情況。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>上線後系統自動收集到同一個錯誤出現了三百次，都發生在同一款手機。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://microservices.io/patterns/observability/exception-tracking.html">Chris Richardson（microservices.io）〈Exception tracking〉</a>：把所有例外回報到一個集中的服務，由它彙整、追蹤，並通知開發者。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>開發工程師，和當時值班的人。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>把大量的錯誤紀錄，整理成一個一個可以追的問題。</p></div><div><span class="tk-label">效益</span><p>不用一筆一筆翻紀錄，真正影響使用者的錯先處理。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>很適合：讓它把錯誤歸類、找出重複的、開修正草稿。不准它用「關掉問題單」代替「證明修好了」。</p><ol><li><b>準備：</b>以唯讀權限讀錯誤紀錄，依原因歸類、合併重複的。</li><li><b>執行：</b>挑影響最大的，重現它並找出原因。</li><li><b>交付：</b>交修正草稿和一條能重現那個錯的測試。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>根本原因和修法由開發確認；先修哪個、要不要升級成事故，看影響決定。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>沒有報錯不代表業務結果正確。歸類規則錯了，會把不同原因混在一起。錯誤紀錄裡也可能有敏感資料。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>正式服務持續在跑、剛發新版，或錯誤突然變多的時候。沒有報錯但結果不對的情況，要另外看。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>錯誤的歸類、影響人數、對應的版本、修正後不再出現的確認。</p></div><div><span class="tk-label">起步建議</span><p>把歸類、對應版本、重現案例、修完的回歸驗證串成流程。先只給 AI 讀的權限。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md">superpowers 的 systematic-debugging</a>。</p>
  </div></details>
</div>

### 發布後：11 項，大家都在用了

<div class="tk-card tk-post" id="t-32">
  <div class="tk-head"><span class="tk-no">32</span><div><div class="tk-title">流量複製</div><div class="tk-en">Teeing</div></div><span class="tk-stage">發布後</span></div>
  <p class="tk-def">把真實流量複製一份送到別的地方，拿來診斷、重播或比對。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>把某一小時的真實請求存下來，在診斷環境重播，重現只有那時候才發生的錯。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span>這個詞出現在 Cindy Sridharan 的清單裡。她的原文我打不開，沒辦法轉述；上面是業界一般的用法。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>維運人員。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>留下一份真實流量的副本，供之後重播與診斷。</p></div><div><span class="tk-label">效益</span><p>偶爾才發生、人造不出來的問題，有材料可以重現。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 可以用存下的流量重現問題。裡面有個資，只留需要的部分，誰能看要管好。</p><ol><li><b>準備：</b>確認抽樣比例、去除個資的方式和保存期限。</li><li><b>執行：</b>在隔離的診斷環境重播存下的流量，重現問題。</li><li><b>交付：</b>交重現的步驟和結論，到期的資料確實刪除。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>怎麼保護主要路徑由維運決定；要診斷什麼由開發決定；資料能不能這樣用，由資安確認。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>它和影子流量、新舊比對不是三選一：一個提供流量，一個執行新版，一個比較差異。複製本身也有成本。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>只有正式流量才碰得到的罕見問題，或要替影子流量、新舊比對準備來源的時候。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>抽樣比例、去除個資的方式、保存期限、誰存取過。</p></div><div><span class="tk-label">起步建議</span><p>抽最小的量、去掉個資、主副路徑隔離、到期就撤，四件事都做到再開始。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。靠的是流量錄製與重播的工具。</p>
  </div></details>
</div>

<div class="tk-card tk-post" id="t-33">
  <div class="tk-head"><span class="tk-no">33</span><div><div class="tk-title">效能剖析</div><div class="tk-en">Profiling</div></div><span class="tk-stage">發布後</span></div>
  <p class="tk-def">量程式的時間和資源到底花在哪。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>首頁變慢：剖析發現七成的時間花在重複查同一張表。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://www.brendangregg.com/flamegraphs.html">Brendan Gregg〈Flame Graphs〉</a>：火焰圖的發明人。把取樣到的呼叫堆疊畫成圖，最常走的程式路徑一眼就看得到。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>開發工程師；在正式環境量的時候，維運人員要控制量測本身的負擔。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>找出時間和資源實際花在哪幾段程式。</p></div><div><span class="tk-label">效益</span><p>不靠直覺去優化錯的地方。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>很適合。給它工具，它能找出最花時間的地方，改完再量一次。</p><ol><li><b>準備：</b>先和人確認要回答什麼問題，準備可以重現的工作量。</li><li><b>執行：</b>執行剖析，找出最花時間或資源的路徑。</li><li><b>交付：</b>交剖析結果、修改建議，以及修改前後的對照。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>最花時間的地方值不值得改，由開發判斷。在正式環境量，成本由維運控制。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>花最多時間的地方不一定是缺陷，可能本來就該花這麼多。取樣不是完整紀錄，量測本身也會影響程式。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>處理器、記憶體或回應時間出問題，或重要路徑想變快的時候。先講清楚要回答什麼問題。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>剖析結果（例如火焰圖）、判斷的熱點、修改前後的對照。</p></div><div><span class="tk-label">起步建議</span><p>一定要配可以重現的工作量，改之前和改之後都量，讓修改有實測支持。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/benchmark-checklist/SKILL.md">pstack 的 benchmark-checklist</a>，確認量出來的數字可信。</p>
  </div></details>
</div>

<div class="tk-card tk-post" id="t-34">
  <div class="tk-head"><span class="tk-no">34</span><div><div class="tk-title">紀錄與事件</div><div class="tk-en">Logs / events</div></div><span class="tk-stage">發布後</span></div>
  <p class="tk-def">系統自己寫下的流水帳。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>每筆訂單的每次狀態變化，都記一行：誰、什麼時候、從什麼變成什麼。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://12factor.net/logs">The Twelve-Factor App〈Logs〉</a>：紀錄是依時間排序的事件串流。<br><a href="https://opentelemetry.io/docs/concepts/signals/logs/">OpenTelemetry〈Logs〉</a>：帶時間戳記的文字紀錄，建議用結構化的格式。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>開發工程師決定寫什麼；維運人員管收集和保存。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>留下足夠的紀錄，事後能還原發生過什麼事。</p></div><div><span class="tk-label">效益</span><p>跨好幾個服務追問題的時候，不用靠猜。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>適合大量閱讀與摘要，結論要能回頭查到原始紀錄。小心紀錄裡夾帶的文字被它當成指令。</p><ol><li><b>準備：</b>確認重要流程的事件有固定的格式和編號。</li><li><b>執行：</b>大量閱讀並摘要，把相關的事件串起來。</li><li><b>交付：</b>交摘要，每個結論都能連回原始紀錄；推測的部分另外標明。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>一筆紀錄代表的是不是真實發生的狀態，由開發確認。留多久、誰能看，由維運和資安決定。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>紀錄多不等於查得到。少了一致的編號、時間或意思，就接不起來。AI 的推測不能補寫成「發生過」。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>新增重要流程、狀態切換、背景工作或錯誤處理時。不必把所有東西都記下來。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>事件的欄位定義、查詢範例、AI 的摘要能連回的原始紀錄。</p></div><div><span class="tk-label">起步建議</span><p>先定事件的格式和必填欄位，再準備查詢範本。AI 的摘要要能連回原始紀錄。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md">superpowers 的 systematic-debugging</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-post" id="t-35">
  <div class="tk-head"><span class="tk-no">35</span><div><div class="tk-title">混沌測試</div><div class="tk-en">Chaos testing</div></div><span class="tk-stage">發布後</span></div>
  <p class="tk-def">故意弄壞一部分，例如關掉一台機器，看整體撐不撐得住。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>在離峰時段關掉三台資料庫中的一台，確認網站還能下單，而且那台回來後資料一致。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://principlesofchaos.org/">〈Principles of Chaos Engineering〉</a>：在系統上做實驗，建立「它撐得住正式環境的動盪」的信心。做法是先提假設，再試著推翻它。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>維運人員。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認某個零件壞掉的時候，系統撐得住，或是能照預期恢復。</p></div><div><span class="tk-label">效益</span><p>在可控的情況下，先找到「一個壞掉、全部跟著倒」的地方。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 可以設計實驗、整理結果。在正式環境動手要人核准，系統也要先夠穩。</p><ol><li><b>準備：</b>和人寫下假設：弄壞什麼、預期系統怎麼反應、何時停止。</li><li><b>執行：</b>在核准的範圍內注入故障，記錄當時的數字。</li><li><b>交付：</b>交時間線、和假設的對照，以及復原的確認。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>動手和停止、復原由維運負責；程式和資料的結果由開發負責；對業務的影響，產品經理要參與。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>它不是隨機搞破壞。停止注入故障，也不代表所有狀態馬上恢復，要檢查。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>已經有明確的假設、看得到數字、也有停止和復原程序的服務。先處理已知的基本故障，再演練。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>實驗假設、注入了什麼故障、當時的數字、復原的確認。</p></div><div><span class="tk-label">起步建議</span><p>先做實驗範本、停止條件、復原檢查和時間紀錄。不要把「自由執行破壞指令」包裝成自動化。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。靠的是故障注入的實驗平台。</p>
  </div></details>
</div>

<div class="tk-card tk-post" id="t-36">
  <div class="tk-head"><span class="tk-no">36</span><div><div class="tk-title">監控</div><div class="tk-en">Monitoring</div></div><span class="tk-stage">發布後</span></div>
  <p class="tk-def">持續看服務的關鍵數字。和第 28 項是同一件事，只是時間拉長到幾週、幾個月。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>磁碟用量每週長 3%，照這個速度兩個月後會滿。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://sre.google/sre-book/monitoring-distributed-systems/">Google《SRE》〈Monitoring Distributed Systems〉</a>：同第 28 項。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>維運人員。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>長期注意變慢、容量快滿、使用方式改變。</p></div><div><span class="tk-label">效益</span><p>少掉「跑了幾個月突然出事」的情況。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>讓它定期整理趨勢，有例外才叫人。不准它為了讓警報消失，自己把標準放寬。</p><ol><li><b>準備：</b>讀現有的警報和儀表板，確認每個警報有負責人和處理手冊。</li><li><b>執行：</b>定期整理趨勢，例如容量、速度、錯誤率的變化。</li><li><b>交付：</b>交趨勢摘要，有例外才通知人。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>警報出現後怎麼判斷、怎麼處理，由維運負責。對使用者的承諾，由產品和業務決定。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>儀表板全綠，不保證每個流程都對。門檻設太多只會製造雜訊。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>所有持續在跑的服務。看多深，依服務的重要性調整。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>趨勢圖、警報對應的負責人與處理手冊、容量預估。</p></div><div><span class="tk-label">起步建議</span><p>每個警報先對到「影響誰、誰負責、照哪份處理手冊」，再加 AI 的趨勢摘要。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。靠的是你們的監控平台、警報和處理手冊。</p>
  </div></details>
</div>

<div class="tk-card tk-post" id="t-37">
  <div class="tk-head"><span class="tk-no">37</span><div><div class="tk-title">A/B 測試</div><div class="tk-en">A/B tests</div></div><span class="tk-stage">發布後</span></div>
  <p class="tk-def">兩個版本各給一部分人用，用數據比哪個好。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>一半的人看到綠色的結帳按鈕、一半看到橘色，比較兩週內的完成率。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://experimentguide.com/">Kohavi、Tang、Xu《Trustworthy Online Controlled Experiments》</a>：2020 年出版的 A/B 測試專書。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">產品經理或需求方</span><p>產品經理提假設；資料分析人員設計與計算；開發工程師做分組。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>用隨機分組，判斷一個改動到底有沒有效果。</p></div><div><span class="tk-label">效益</span><p>少掉憑直覺、憑前後對比做錯的決定。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>可以幫忙算結果、檢查樣本夠不夠。計算要用固定、可重跑的程式，不讓它自由寫出統計結論。測什麼、怎樣算贏，是產品決定。</p><ol><li><b>準備：</b>幫忙把假設、判斷指標、樣本數和觀察時間寫成事前計畫。</li><li><b>執行：</b>實驗期間檢查分組是否均勻、資料是否正常。</li><li><b>交付：</b>用固定的程式算結果，交效果大小、不確定範圍和負面影響。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>方法和統計由資料分析人員把關；業務意義由業務解讀；要不要採用，由產品經理看完整證據後決定。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>拿不同時間、不同客群直接比，會混進別的因素。一看到有差就喊停，也會誤判。「有顯著差異」不等於值得上線。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>有明確、量得到的問題，樣本夠、能隨機分組、能持續觀察的時候。流量太少，就換別的研究方法。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>事前寫好的實驗計畫、分組是否均勻、結果與不確定範圍、可重跑的分析程式。</p></div><div><span class="tk-label">起步建議</span><p>實驗前先寫好計畫和判斷標準，分析用固定的程式。AI 用來寫、查、解釋，不用來自由產生結論。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。靠的是實驗平台和固定的統計分析程式。</p>
  </div></details>
</div>

<div class="tk-card tk-post" id="t-38">
  <div class="tk-head"><span class="tk-no">38</span><div><div class="tk-title">分散式追蹤</div><div class="tk-en">Tracing</div></div><span class="tk-stage">發布後</span></div>
  <p class="tk-def">跟著一個請求走過所有服務，看每一站花多久。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>一個請求花了四秒：追蹤顯示三秒半卡在呼叫庫存服務。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://opentelemetry.io/docs/concepts/signals/traces/">OpenTelemetry〈Traces〉</a>：追蹤呈現一個請求在應用程式裡走過的完整路徑。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>開發工程師在程式裡放追蹤點；維運人員管平台。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>把一個請求經過的每一站連起來看。</p></div><div><span class="tk-label">效益</span><p>知道慢在哪一站、錯在哪一站。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>適合用來找「慢在哪一站」。追蹤通常只抽樣，找不到不代表沒發生。</p><ol><li><b>準備：</b>確認關鍵流程的編號有一路傳下去。</li><li><b>執行：</b>找出慢或出錯的請求，沿著路徑看每一站。</li><li><b>交付：</b>交那條請求的路徑、問題在哪一站，以及抽樣的限制。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>因果的推論由開發確認；抽多少樣、花多少容量，由維運決定；記了哪些欄位，資安要看。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>追蹤不會自動判斷業務結果對不對。記太細會增加成本，也可能露出敏感資料。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>跨好幾個服務、有背景排隊或多層相依的流程；特別是偶爾很慢、偶爾出錯的時候。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>那條請求的完整路徑、每一站的耗時、抽樣比例。</p></div><div><span class="tk-label">起步建議</span><p>先選幾條關鍵流程，檢查編號有沒有一路傳下去。沿用業界通用的標準，不要自己發明一套。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md">superpowers 的 systematic-debugging</a>。</p>
  </div></details>
</div>

<div class="tk-card tk-post" id="t-39">
  <div class="tk-head"><span class="tk-no">39</span><div><div class="tk-title">動態探索</div><div class="tk-en">Dynamic exploration</div></div><span class="tk-stage">發布後</span></div>
  <p class="tk-def">系統跑著的時候臨時加觀測點，追問事先沒想到的問題。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>使用者說「有時候存不了」：臨時在儲存流程加觀測點，發現只有檔名帶特殊符號時會失敗。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span>這個詞出現在 Cindy Sridharan 的清單裡。她的原文我打不開，沒辦法轉述；上面是業界一般的用法。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>負責查這個問題的開發工程師，或當時值班的人。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>在還不知道原因的時候，用資料一步步縮小範圍。</p></div><div><span class="tk-label">效益</span><p>補上事前的測試和固定報表都沒想到的問題。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>可以讓它提假設、下查詢、判讀。它的猜測不能直接當結論；在正式環境加觀測點，權限要管。</p><ol><li><b>準備：</b>把症狀寫成可以檢驗的假設。</li><li><b>執行：</b>下查詢、看結果、修正假設，一次只加必要的觀測點。</li><li><b>交付：</b>交每一步的查詢和證據，分清楚已證實和仍是猜測。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>哪些結論有證據、哪些還是假設，由負責診斷的人確認。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>兩件事同時發生不等於有因果。臨時加的觀測點也有成本，還可能露出執行中的資料。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>有具體症狀，但現有的監控回答不了原因的時候。這個名稱沒有固定的標準做法。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>提出的假設、每次查詢與結果、哪些已證實、哪些仍是猜測。</p></div><div><span class="tk-label">起步建議</span><p>照「假設、查詢、證據、下一步」走，並限制每次查詢和加觀測點的範圍。不要期待有一支技能能自動找出所有原因。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md">superpowers 的 systematic-debugging</a>，先找原因再提修法。</p>
  </div></details>
</div>

<div class="tk-card tk-post" id="t-40">
  <div class="tk-head"><span class="tk-no">40</span><div><div class="tk-title">真實使用者監測</div><div class="tk-en">Real user monitoring</div></div><span class="tk-stage">發布後</span></div>
  <p class="tk-def">量使用者實際感受到的速度與錯誤。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>實驗室裡首頁一秒就開，但真實使用者在舊款手機和行動網路上，四分之一的人等超過四秒。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Rum-vs-Synthetic">MDN〈RUM vs. Synthetic monitoring〉</a>：真實使用者監測適合看長期趨勢；用腳本模擬的監測，適合在開發期間抓退步。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">開發工程師</span><p>前端工程師；資料分析人員幫忙分群。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>了解使用者在各種裝置和網路下，實際的體驗。</p></div><div><span class="tk-label">效益</span><p>看見實驗室裡測不到的差異，例如某一款手機特別慢。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>可以分析。要知道「使用者遇到的問題有沒有變少」，看的就是這個。只收回答問題需要的資料。</p><ol><li><b>準備：</b>確認收了哪些資料、有沒有超出需要。</li><li><b>執行：</b>依裝置、瀏覽器、地區分群分析，找出體驗特別差的一群。</li><li><b>交付：</b>交分群結果，並對到可能的前端或後端原因。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>技術數字和修法由開發確認；體驗和先後順序由產品經理和設計師判斷；資料能不能收，資安要看。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>樣本不完整：有人擋追蹤、有人沒同意。它也不等於錄下所有操作，更猜不出使用者的動機。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>已經有真實使用者的網站或應用程式，尤其使用者的裝置和網路差異很大的產品。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>依裝置、瀏覽器、地區分群的真實數據，以及收了哪些資料的說明。</p></div><div><span class="tk-label">起步建議</span><p>只收回答問題需要的資料，依裝置、瀏覽器分群來看。全程錄影不該是預設選項。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。靠的是放在網頁或應用程式裡的效能量測套件。</p>
  </div></details>
</div>

<div class="tk-card tk-post" id="t-41">
  <div class="tk-head"><span class="tk-no">41</span><div><div class="tk-title">稽核</div><div class="tk-en">Auditing</div></div><span class="tk-stage">發布後</span></div>
  <p class="tk-def">事後核對資料和操作紀錄對不對得上。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>每季抽查：離職員工的帳號是不是都在當天停用，對照人事紀錄和系統紀錄。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://csrc.nist.gov/glossary/term/audit">NIST 詞彙表〈audit〉</a>：有系統、獨立、留有紀錄的過程：取得證據並客觀評估，判斷符合準則的程度。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">稽核人員</span><p>稽核人員，而且要獨立於開發團隊。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>確認誰在什麼時候做了什麼都查得到，該有的管控有在運作。</p></div><div><span class="tk-label">效益</span><p>不是做事的人自己說「我做對了」。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>可以比對、找異常，只給它讀的權限。結論和責任歸屬是人的事，它不能補寫或修改紀錄。</p><ol><li><b>準備：</b>以唯讀權限取得紀錄，確認來源和完整性。</li><li><b>執行：</b>照稽核人員定的條件比對、抽樣、找異常。</li><li><b>交付：</b>交比對結果和證據來源；結論由稽核人員下。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>稽核人員保留獨立的判斷和結論。提供證據的人、或他的 AI，不會因為產出報告就變成稽核者。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>有紀錄不等於有完整的稽核：還要看紀錄的來源、有沒有被改過、保存多久、誰能存取。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>需要獨立查核、檢查權限和重大管控的時候。團隊平常自己檢查自己，要標明是「自評」，不是獨立稽核。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>抽樣方式、逐筆的核對結果、缺失與改善追蹤。</p></div><div><span class="tk-label">起步建議</span><p>「提供證據」和「分析稽核」分成兩條流程，資料唯讀、權限分開。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span>沒有專門的現成 skill。靠的是不能被修改的操作紀錄和獨立的查核流程。</p>
  </div></details>
</div>

<div class="tk-card tk-post" id="t-42">
  <div class="tk-head"><span class="tk-no">42</span><div><div class="tk-title">值班經驗</div><div class="tk-en">Oncall experience</div></div><span class="tk-stage">發布後</span></div>
  <p class="tk-def">處理過事故的人累積下來的判斷。</p>
  <p class="tk-eg"><span class="tk-label">舉個例子</span>半夜警報響了：值班的人照處理手冊排除，事後檢討發現手冊少了一步，補上去。</p>
  <p class="tk-src"><span class="tk-label">誰定義過</span><a href="https://sre.google/sre-book/being-on-call/">Google《SRE》〈Being On-Call〉</a>：值班是維持服務可靠的關鍵職責；輪值安排不好，對服務和團隊都有嚴重後果。</p>
  <div class="tk-owner"><span class="tk-label">以前誰負責</span><span class="tk-role">維運人員</span><p>輪值的工程師，維運或開發都有。</p></div>
  <div class="tk-two"><div><span class="tk-label">目標</span><p>事故能很快被發現、處理，而且事後有學到東西。</p></div><div><span class="tk-label">效益</span><p>不再重複救同一種火。</p></div></div>
  <div class="tk-ai"><span class="tk-label">AI 時代怎麼做</span><p>AI 可以把事故紀錄整理成檢查清單，再變成前面各階段的新檢查。它的摘要不等於已確認的原因。</p><ol><li><b>準備：</b>事故當下整理時間線、找相關的處理手冊。</li><li><b>執行：</b>事後把紀錄整理成檢討草稿，找出重複發生的模式。</li><li><b>交付：</b>交可以變成新檢查或新測試的建議清單。</li></ol></div>
  <div class="tk-human"><span class="tk-label">人要把關什麼</span><p>當值的人照既定制度決定嚴重程度和處理方式；永久修復由服務負責人做；業務取捨交給有權責的人。</p></div>
  <p class="tk-warn"><span class="tk-label">容易誤會的地方</span>它不是一種測試，沒有「通過」。AI 讀到處理手冊，不等於可以自己擴大正式環境的權限。</p>
  <details class="tk-more"><summary>展開：什麼時候用、該交出什麼證據、起步建議、可用的工具</summary><div class="tk-more-body">
    <p class="tk-when"><span class="tk-label">什麼時候用</span>任何提供持續服務、要負責處理事故的團隊。不一定要有專職的維運人員才能開始輪值。</p>
    <div class="tk-two"><div><span class="tk-label">該交出什麼證據</span><p>事故時間線、做過的處置、事後檢討、因此新增的檢查或測試。</p></div><div><span class="tk-label">起步建議</span><p>先讓 AI 做唯讀的事：事故摘要、時間線、找處理手冊。之後再逐步開放範圍明確、結果可以驗證的動作。</p></div></div>
    <p class="tk-foot"><span class="tk-label">可用的工具</span><a href="https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md">superpowers 的 systematic-debugging</a>。</p>
  </div></details>
</div>

## 11,000 與 0.5%，各自的分母是什麼 {#numbers}

她公布的團隊數字，我整理成一張表。左欄是她說的，右欄是我認為不能直接推論的事。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4500s) [[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4560s)

| 她在台上說的 | 不能直接推論 |
|---|---|
| 團隊上個月送出約 11,000 條 PR | 不等於 11,000 個功能。一件事可以拆成一條，也可以拆成十條。 |
| 十月有 227 人至少貢獻一條 PR | 不等於 227 位全職工程師。她另外提到，不熟專案、順手改一下的貢獻者變多了。 |
| 大約每天出一個穩定版 | 沒說每一版改了多少。 |
| 被回退的 PR 比例穩定在約 0.5% | 不等於只有 0.5% 有錯。見下一節。 |
| 啟動、打字、開新對話、切換對話都比上線時快 | 沒有公布測量條件與原始數據，外人無法重現。 |

全部是概數，全部是團隊自述。她沒有把這些包裝成實驗結果，我也不想替她升級。

我會留意的反而是 227 這個數字。它說明這套環境不只服務老手：不熟專案的人丟進來的修改，也被同一批檢查接住了。如果這是真的，那比 11,000 更有說服力。

## 我不買單的兩句話 {#limits}

**第一句：「到某個時候，你會發現沒東西可 review 了，可以讓 AI 合併大多數自己的 PR。」**[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4200s)

她的推論是：每擋掉一類錯，review 要看的東西就少一類，少到最後就沒了。這個推論漏了一種東西：沒有人想過要檢查的錯。檢查只擋得住你已經見過、而且寫得成規則的問題。需求理解錯了、做了不該做的功能、新型態的資安漏洞，都不在任何一條 lint 裡。

她最後展示的流程是：每次出新版，系統自動開一批 AI 把整個產品當使用者亂用一輪，找到錯就開修正 PR，而且自動合併。她自己也說這聽起來很瘋狂。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4680s) 對一個桌面應用，改壞了隔天再出一版，這也許可以接受。換成改了就收不回來的事，例如刪資料、動帳務、發通知給所有客戶，就是另一個問題。上一篇談過這道「單向門」，這場演講沒有再碰。

**第二句：回退率約 0.5%，所以品質沒有下降。**

回退率量的是「被整條撤掉的 PR 佔多少」。有錯的 PR 不一定會被回退，更常見的做法是再開一條 PR 補上。還沒被發現的錯，當然也不在裡面。在一個 AI 會自動開修正 PR 的團隊，回退率偏低甚至是可以預期的：錯被下一條 PR 蓋過去了，而那一條也算進 11,000。

<figure>
  <a href="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/revert-rate.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="all-code-is-slop" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/revert-rate-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/all-code-is-slop-verification-evidence/revert-rate.svg' | relative_url }}" alt="有錯的 PR 有三種下場：整條被回退、另開一條 PR 補上、還沒被發現。回退率只算到第一種，約 0.5%" width="840" height="316"></picture>
  </a>
  <figcaption>自製示意圖，三格的實際比例沒有公開。0.5% 為團隊自述。來源：<a href="https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4500s">[2]</a></figcaption>
</figure>

我不是說她的品質不好。產品變快是使用者感覺得到的事，她敢在台上講，應該有底氣。我是說，**0.5% 這個數字證明不了她想證明的事**，要看的是使用者遇到的問題有沒有變少。

## 如果是我，會從這三件事開始 {#start}

她結尾的建議很務實：先別急著蓋自動化工廠。如果 AI 單次交出來的東西就是爛的，把它自動化只會得到更多爛東西，還得燒更多用量去救。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=4620s)

照這個順序，不管你用哪一家的 AI 寫程式，我覺得有三件事現在就能做。

1. **把「我測過了」換成一份證據。** 下次交代工作時多加一句：做完後把你實際操作的步驟和結果截圖給我，並寫出哪些情況你沒有試。先求有，再求能重跑。
2. **找出你說過兩次以上的那句提醒。** 翻最近的對話，多半找得到。然後問：這能不能變成一個寫錯就過不了的檢查？能，就花半小時做掉。不能，才留在說明檔裡。
3. **挑一個流程，先把「取消是什麼意思」這種問題說清楚。** 不必學 TLA+。光是畫出有哪些狀態、哪些事件會換狀態，通常就會發現兩個沒人回答過的問題。

第三件事做下去，如果那個流程夠重要、順序夠亂，再考慮模型檢查。它是多一層，不是入場券。

她把寫程式的人比喻成園丁：程式一直長，你管的是它沿著什麼長。[[2]](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3900s) 我自己會記另一句更土的話。

**AI 說它做完了，那是一句話。它交出來的影片、截圖和那張圖，才是可以拿來檢查的東西。** 人的時間有限，就該花在後者，還有那些沒有人想到要檢查的地方。

## 參考資料

演講時間點連結對應主辦單位的整場直播錄影。官方逐字稿為機器轉錄，頁面註明仍有辨識錯誤；本文的引述是中文轉述，不是逐字翻譯。卡片裡的工具連結直接連到各自的官方說明頁，不另外編號。資料查核日：2026-11-15。

- **[1]** [AI Engineer CODE 2026：Lauren Tan〈All Code Is Slop (Except Mine)〉演講頁與逐字稿](https://ai.engineer/code/2026/talks/lauren-tan)
- **[2]** [AI Engineer：AIE CODE 整場直播錄影（本場約 1:01:02–1:18:38）](https://www.youtube.com/watch?v=ZZ19zhYnDKY&t=3662s)
- **[3]** [AI Engineer：All Code Is Slop (Except Mine) — Lauren Tan, SpaceXSI（單場影片）](https://www.youtube.com/watch?v=O_zcc6Xl12g)
- **[4]** [pstack：statechart 技能說明（2026-11-13 版本）](https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/statechart/SKILL.md)
- **[5]** [pstack：no-comments 技能說明（2026-11-13 版本）](https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/no-comments/SKILL.md)
- **[6]** [Antithesis：Bombadil，網頁與終端機介面的性質測試工具](https://github.com/antithesishq/bombadil)
- **[7]** [React 官方文件：You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- **[8]** [Leslie Lamport：A High-Level View of TLA+](https://lamport.azurewebsites.net/tla/high-level-view.html)
- **[9]** [Lean 官方教材：Theorem Proving in Lean 4 導論](https://lean-lang.org/theorem_proving_in_lean4/Introduction/)
- **[10]** [Cindy Sridharan：Testing in Production, the safe way](https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1)（Medium，2018）
- **[11]** [obra/superpowers：test-driven-development、systematic-debugging、verification-before-completion 技能](https://github.com/obra/superpowers)
- **[12]** [Playwright 官方文件：Test Agents](https://playwright.dev/docs/test-agents)
- **[13]** [Anthropic skills：webapp-testing 技能說明](https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md)
- **[14]** [pstack：create-verification-skill 技能說明（2026-11-13 版本）](https://github.com/cursor/plugins/blob/3dbd22ff12742fb28c9700b9760baa29ed41dc13/pstack/skills/create-verification-skill/SKILL.md)
- **[15]** [Martin Fowler：UnitTest](https://martinfowler.com/bliki/UnitTest.html)
- **[16]** [Martin Fowler：TestPyramid](https://martinfowler.com/bliki/TestPyramid.html)
- **[17]** [《Software Engineering at Google》第 11 章：Testing Overview](https://abseil.io/resources/swe-book/html/ch11.html)

想看這套方法的前半段，可以接著讀[〈Poteto 的 2,500 條 PR〉]({{ '/technical/poteto-pstack-trust-before-scale/' | relative_url }})，或從 [Agentic Engineering 系列]({{ '/technical/agentic-engineering/' | relative_url }})挑一篇開始。
