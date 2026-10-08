---
layout: article
title: "Grok Bot 開始替你挑大腦：馬斯克那則貼文，是 AI 從「模型戰爭」走向「調度戰爭」的訊號"
seo_title: "Grok Bot 改走多模型路由深度解析：Claude Opus 5.5、Midjourney、Suno 與 AI Agent 調度戰爭"
date: 2026-10-08
published: true
categories: [technical]
tags: [ai-agent, grok-bot, model-routing, harness, claude-opus, agentic-engineering, llm-industry]
description: "馬斯克宣布 Grok Bot 會依任務改用 Claude Opus 5.5、Midjourney、Suno 等最合適的後端。本文從原始貼文、官方文件與社群反應出發，拆解 Bot 的四代演化、代理人三層結構、對所有 LLM 廠商的六個影響，以及企業該怎麼看待「替你挑模型」的代理人。"
keywords: "Grok Bot, 模型路由, model routing, Claude Opus 5.5, Midjourney, Suno, SpaceXAI, Elon Musk, AI Agent, harness, 代理人, Agentic Engineering, 史旺基"
cover_image: /assets/img/linkedin/grok-bot-model-routing.jpg
cover_alt: "水手服品牌主角在太空任務控制室裡拿著放大鏡與長帳單，追查 Grok Bot 機器人把工作接線分派給 Opus 5.5、Midjourney、Suno 三個工作站，左側的馬斯克漫畫肖像正拉下派工拉桿"
hero_image: true
use_glightbox: true
mid_cta: false
cta_context: agentic
extra_css: |
  @media (max-width: 767px) {
    .back-to-top.d-flex { display: none !important; }
    #header::after, #header.header-scrolled::after { background: #232020; }
  }
related_posts:
  - hermes-bot-mode-persistent-ai-team
  - artificial-analysis-llm-evaluation-2026
  - hermes-agent-mixture-of-agents
---

<p class="text-muted"><small>封面為人物與 AI 調度中心的概念情境插畫，不是真實事件或產品畫面。</small></p>

10 月 7 日下午，馬斯克在 X 上發了三句話。

> Important note regarding Grok @Bot:
>
> Going forward, @SpaceX will use the best back end model for any given task, including Claude Opus 5.5, MidJourney, Suno and other leading APIs.
>
> Whatever is most likely to give you the best outcome.

翻成白話是：往後 Grok Bot 會依每一件工作，挑最合適的後端模型來做，包括 Claude Opus 5.5、Midjourney、Suno，以及其他領先的服務。哪個最有機會給你最好的結果，就用哪個。[[1]](https://x.com/elonmusk/status/2107724314451878104)

這則貼文在一天內累積了將近 6,900 萬次觀看、9.7 萬多個讚（10 月 8 日擷取）。[[1]](https://x.com/elonmusk/status/2107724314451878104) 底下最多的反應是：「太好了。」

我第一個反應比較像是：**一間花了兩年說自家模型最強的公司，現在公開說，最強的不一定要是自己的。這不是認輸，而是換了比賽項目。**

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>這不是「Grok 被 Claude 取代」</strong>：貼文說的是依任務挑模型，不是全面換掉；而且還沒有生效日、對應表、價格與退出機制。</li>
    <li><strong>真正的訊號是「代理人」和「模型」正式分家</strong>：使用者交辦工作的那一層，開始可以向外採購最好的大腦，而不必只用自家的。</li>
    <li><strong>官方文件其實早就寫了</strong>：Grok Bot 沒有讓使用者自己挑模型的選項，模型組合會隨時間改變、不保證固定供應商。</li>
    <li><strong>對所有 AI 模型公司的壓力</strong>：比賽從「誰的模型分數最高」，變成「誰最常被代理人選中、每完成一件事要花多少錢」。</li>
    <li><strong>對使用者和企業的功課</strong>：當 Bot 替你挑大腦，你要看得到是誰在想、資料去了哪、失敗與帳單算誰的。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part"><span class="article-toc-part-title">先看懂這則貼文</span><ol class="article-toc-items">
      <li><a href="#unsaid">三句話說了什麼，更重要的是沒說什麼</a></li>
      <li><a href="#grok-bot">Grok Bot 不是另一個聊天視窗</a></li>
      <li><a href="#why-now">為什麼是現在：馬斯克兩週前自己說了答案</a></li>
      <li><a href="#docs">文件早就寫好了：沒有模型選擇器</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">社群怎麼看</span><ol class="article-toc-items">
      <li><a href="#reactions">一片叫好，但叫好的人是誰？</a></li>
      <li><a href="#mixed-signals">同一天，三種說法</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">把 Bot 放回歷史</span><ol class="article-toc-items">
      <li><a href="#history">Bot 的四代演化：從灌水帳號到你願意給密碼的同事</a></li>
      <li><a href="#layers">現在的 Bot 是三層疊起來的</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">對所有 AI 模型的影響</span><ol class="article-toc-items">
      <li><a href="#fit">一、評價標準：從排行榜變成「被選中率」</a></li>
      <li><a href="#brand">二、品牌忠誠變成結果忠誠</a></li>
      <li><a href="#cost">三、帳單：牌價不等於每件工作的成本</a></li>
      <li><a href="#data">四、換大腦，也是換資料處理者</a></li>
      <li><a href="#specialist">五、圖像與音樂，還是專門模型的地盤</a></li>
      <li><a href="#open">六、開源與自架模型的機會</a></li>
      <li><a href="#grok-itself">那 Grok 自己的模型呢？</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">往後怎麼走</span><ol class="article-toc-items">
      <li><a href="#futures">三種走向，企業最可能走第三種</a></li>
      <li><a href="#if-me">如果是我，會先確認這六件事</a></li>
      <li><a href="#ending">當 Bot 替你挑大腦</a></li>
    </ol></li>
  </ol>
</nav>

## 三句話說了什麼，更重要的是沒說什麼 {#unsaid}

先把貼文本身說清楚，因為接下來所有討論都建立在這三句話上。

它說的是：**Grok Bot 往後會依「任務」挑後端模型**。點名的有三家：寫文字、做推理的 Claude Opus 5.5；生圖的 Midjourney；做音樂的 Suno；再加上一句「其他領先的服務」。挑選標準只有一個：最可能給你最好的結果。

大約八小時後，馬斯克又補了一則：「Grok Bot 會用任何能為使用者達成最好結果的東西。簡單的問題會交給小而快的模型，答案複雜的問題會交給大模型。」[[2]](https://x.com/elonmusk/status/2107849623364895151) 這句話把路由的邏輯講得更像工程師會講的話：不是每件事都找最貴的大腦，而是看題目難度分配。

但同樣重要的，是這兩則貼文**沒有說**的事：

| 沒交代的事 | 為什麼重要 |
| --- | --- |
| 什麼時候生效 | 截至 10 月 7 日，SpaceXAI 的新聞頁與產品更新紀錄都還沒出現這項變更。[[8]](https://cellcog.ai/blog/grok-bot-claude-opus-5-5/)[[9]](https://www.thinkfacility.com/blog/grok-bot-will-use-claude-opus-midjourney-suno/) |
| 哪些工作交給誰 | 沒有對應表。「文字給 Claude、圖給 Midjourney、音樂給 Suno」是大家依產品類別的推測。 |
| 使用者能不能自己指定、能不能退出 | 沒提。這會決定「替你挑」是貼心服務，還是收走選擇權。 |
| 資料會不會送到其他公司、留多久 | 沒提。對企業來說，這是能不能簽約的問題。 |
| 怎麼計費 | 沒提。不同模型的價差可以差好幾倍（後面會算給你看）。 |
| 被點名的三家怎麼說 | 截至報導截稿，Anthropic、Midjourney、Suno 都沒有公開回應。[[9]](https://www.thinkfacility.com/blog/grok-bot-will-use-claude-opus-midjourney-suno/)[[10]](https://gizmodo.com/grok-bot-is-now-a-model-router-as-spacex-continues-to-pivot-further-toward-ai-infrastructure-2000823057) |

所以我會把它讀成一則**方向宣言**，而不是已經上線的產品規格。方向很清楚，細節全部待補。

這一點對讀者很實際：如果你明天就要跟公司說「Grok Bot 現在可以用 Claude 了」，你手上其實沒有任何文件可以佐證。先等規格，再改流程。

## Grok Bot 不是另一個聊天視窗 {#grok-bot}

要理解這則貼文為什麼重要，得先知道 Grok Bot 是什麼。它不是 grok.com 那個聊天框。

SpaceXAI 在 8 月 11 日推出 Grok Bot 時，第一句話是：「Grok Bot 是你那一組永遠在線的代理人。它們有自己的電腦，像你一樣在各種工具和 App 裡工作，全天候運作。」官方的說法是，它們會把工作從頭到尾做完，只有需要你核准時才回來找你；你不用先設計流程，傳訊息交辦就好；多個 Bot 之間還能互相傳訊息、分工。[[3]](https://x.ai/news/introducing-grok-bot)

9 月 28 日，官方再推出 Team Bots：一個 Bot 可以被整個團隊共用，接上 Salesforce、Notion、GitHub，也能被拉進 Slack 頻道裡一起工作。官方舉的內部例子是，一個工程 Bot 協調了數百個雲端程式代理，幫一個五人團隊每天出超過 100 個程式變更請求（PR），幾週內做出 Team Bots。[[4]](https://x.ai/news/team-bots) 這是公司自己的內部使用描述，不是客戶成效，但它說明了產品想要的樣子：**一群會自己分工的數位同事，不是一個問答機器。**

如果用一張表對照：

| | 傳統聊天機器人 | Grok Bot 這類代理人 |
| --- | --- | --- |
| 你給它的 | 一個問題 | 一件工作 |
| 它記得的 | 這次對話 | 你的偏好、流程、團隊脈絡 |
| 它在哪裡做事 | 一個文字框 | 一台雲端電腦，登入你的工具 |
| 什麼叫完成 | 回你一段話 | 把事情做完，必要時請你核准 |
| 怎麼組織 | 一次一個對話 | 多個 Bot 分工、交接 |

我在 8 月寫過一篇〈[Bot Mode 不是多開幾個聊天視窗]({{ '/technical/hermes-bot-mode-persistent-ai-team/' | relative_url }})〉，那時候的判斷是：AI 代理人正從「一次性對話」走向「有名字的長期同事」。Grok Bot 就是那條路上最大眾化的產品之一。

而一個「同事」用哪顆大腦思考，本來就不一定要跟它的名牌同一家。這就是這次貼文的伏筆。

## 為什麼是現在：馬斯克兩週前自己說了答案 {#why-now}

時間線拉出來，這則貼文一點也不突然。

- **2 月**：SpaceX 收購 xAI 生效。Grok 從一間獨立模型公司的招牌，變成一個太空、通訊、資料中心集團裡的 AI 產品線。[[11]](https://runtimewire.com/article/spacex-grok-bot-rival-model-routing)
- **5 月**：多家媒體報導，Anthropic 開始使用 SpaceX 的 Colossus 資料中心來訓練與執行 Claude。而馬斯克過去曾公開稱 Anthropic「邪惡」。[[10]](https://gizmodo.com/grok-bot-is-now-a-model-router-as-spacex-continues-to-pivot-further-toward-ai-infrastructure-2000823057)
- **8 月 11 日**：Grok Bot 測試版上線。[[3]](https://x.ai/news/introducing-grok-bot)
- **9 月**：Claude Opus 5.5 發布。
- **9 月底**：一份公開的媒體專訪逐字稿裡，馬斯克形容自家的 Grok 4.7 是「很扎實的主力模型」，接著說：「它沒有剛發布的 Opus 5.5 那麼好。」[[21]](https://singjupost.com/transcript-cmg-interview-with-tesla-ceo-elon-musk/)
- **9 月 28 日**：Team Bots 上線。[[4]](https://x.ai/news/team-bots)
- **10 月 7 日**：本則貼文。

把這幾點連起來，邏輯其實很順：**自家模型暫時不是最強，但代理人產品正在長大；與其讓產品等模型追上，不如讓產品先用最好的零件。**

前 xAI 創始團隊成員 Toby Pohlen 在底下補了一段很有意思的歷史：「Grok 早期，我們用 Flux 來生圖。在自家模型準備好之前，它對產品成長很關鍵。」他接著說：「這也替模型團隊設了門檻：你的模型得打贏對手，不然就進不了產品。」[[16]](https://x.com/TobyPhln/status/2107765082398617990)

我覺得這句話比馬斯克的貼文更誠實。它說明了這不是第一次，也說明了內部的遊戲規則改了：**模型團隊不再自動擁有自家產品的位子。**

Gizmodo 的觀察則從另一面切進來：SpaceX 把算力租給 Anthropic、也租給其他公司，現在又把 Grok Bot 變成路由器，整間公司越來越像 AI 基礎設施商，而不只是模型公司。[[10]](https://gizmodo.com/grok-bot-is-now-a-model-router-as-spacex-continues-to-pivot-further-toward-ai-infrastructure-2000823057) 租算力給對手，和在自己的產品裡採購對手的模型，是同一套邏輯的兩面：**算力與調度可以賺錢，不必每一個字都出自自家的模型。**

## 文件早就寫好了：沒有模型選擇器 {#docs}

這一段是我在查資料時最意外的發現。

很多人把這則貼文讀成「Grok Bot 開放了」。但如果去翻 SpaceXAI 自己的 Grok Bot 安全文件，裡面早就寫著：

> Cursor manages model selection. There is no customer-facing model picker, and the serving mix can change over time with no fixed vendor set guaranteed.

意思是：**模型由 Cursor 負責選擇；沒有提供給客戶的模型選擇器；實際使用的模型組合會隨時間改變，不保證固定是哪幾家供應商。**[[5]](https://docs.x.ai/grok-bot/security)

同一份文件還寫了兩件企業法務一定會圈起來的事：團隊層級的模型白名單只有企業方案有，而且「不保證執行」；如果你的合約限制了哪些第三方可以處理你的資料，請在導入 Grok Bot 前先聯絡業務窗口。[[5]](https://docs.x.ai/grok-bot/security)

這裡出現了一個很多人沒注意的名字：Cursor。Grok Bot 的登入、資料設定、訓練退出選項，都跟著 Cursor 帳號走；用量也是記在 Cursor 帳號上，不是記在 Grok 或 X 上。[[6]](https://docs.x.ai/grok-bot/approvals-security-and-privacy)[[7]](https://cursor.com/help/grok-bot/plans) 換句話說，**Grok Bot 選模型的那一層，本來就是一個習慣在多家模型之間切換的程式工具在管。**

所以更準確的說法是：

- 「Grok Bot 不讓你自己挑模型」不是新聞，文件早就這樣寫。
- 「模型組合不保證固定」也不是新聞。
- **新聞是馬斯克親口把對手的名字說出來，並且把它包裝成產品承諾。**

這差別很重要。前者是條款裡的一句話，後者是對 6,900 萬人說「我們會替你挑最好的」。後者會改變使用者的期待，也會改變其他模型公司的策略。

## 一片叫好，但叫好的人是誰？ {#reactions}

我原本預期會看到一場大分裂：一邊說「終於可以一個訂閱用全部」，另一邊說「我的資料憑什麼送去 Anthropic」。實際找下來，畫面沒有那麼對稱。

**歡迎派**是聲量的主體，而且語氣很一致：

- 科技評論者 Robert Scoble：「Grok 開放了。天啊。」（這則有 140 多萬次觀看）[[13]](https://x.com/Scobleizer/status/2107734490747638013)
- 開發者 Matt Shumer：「這對 Bot 使用者是極好的消息。」[[14]](https://x.com/mattshumer_/status/2107753260828570066)
- AI 評論帳號 kimmonismus 認為 Grok Bot 本來就是最好的全天候代理人，現在還會自動為每件工作挑最好的模型，並說其他公司「應該學」。[[15]](https://x.com/kimmonismus/status/2107736997812981770)
- 投資人 Anthony Pompliano 說，他們自己的產品從一開始就做了模型路由；一個不肯把問題交給最合適模型的產品，是在剝奪使用者的最好體驗。他預期多數 AI 應用產品「最後都會讓步」，開放多種模型。[[17]](https://x.com/APompliano/status/2107792874192474142)

**結構派**比較少，但更值得讀：

- 前面提到的 Toby Pohlen，把重點放在「自家模型得贏，才能進產品」。[[16]](https://x.com/TobyPhln/status/2107765082398617990)
- 專門追 AI 產品動態的 TestingCatalog 認為這可能是 Grok Bot 的一大優勢，但也點出一個尷尬：這會讓大家對接下來的 Grok 模型該抱多少期待，變得有點微妙。[[18]](https://x.com/testingcatalog/status/2107803665457189061)

**疑慮派**呢？說實話，我找到的證據很薄。有媒體轉述回覆串裡有人問資料隱私怎麼處理、有人希望可以選擇退出，RuntimeWire 也替讀者列出「能不能選模型、誰在處理資料、能不能退出」等問題，並指出 Grok Bot 條款寫著服務可能保留客戶的資料、檔案、瀏覽器登入、憑證、記憶與流程。[[11]](https://runtimewire.com/article/spacex-grok-bot-rival-model-routing) 但我沒能直接讀到 6,000 多則回覆的原文，所以不會替誰編一句抱怨。

截至 10 月 8 日，在 Reddit、Hacker News、LinkedIn 和中文社群，還找不到針對這則貼文的實質討論串。這不代表沒有，只代表它在第一天主要還是 X 上的事。

所以我會這樣讀這份「民意」：**叫好的主要是 X 上的 AI 重度使用者與評論者，他們本來就同時訂好幾家、本來就在手動切換模型。對他們來說，這是把自己的習慣變成產品預設值。** 真正會猶豫的人，是那些要替資料負責的人。他們通常不在推特上即時回覆，而是在採購會議裡慢慢問。

這也是我為什麼不想把這篇寫成「網友兩極」。證據不支持那個戲劇性。

## 同一天，三種說法 {#mixed-signals}

如果你讀得仔細一點，會發現 10 月 7 日當天，關於「Grok Bot 到底用什麼模型」，至少有三種說法：

1. **馬斯克的主貼文**：依任務挑最好的後端，點名 Opus 5.5、Midjourney、Suno。[[1]](https://x.com/elonmusk/status/2107724314451878104)
2. **馬斯克的補充**：簡單問題走小而快的模型，複雜問題走大模型。[[2]](https://x.com/elonmusk/status/2107849623364895151)
3. **Grok Bot 團隊成員的說法**：Tbreak 報導，SpaceXAI 的 Grok Bot 團隊成員 Lauren（@poteto）在 X 上說「所有 Bot 都會由 Opus 5.5 驅動」，而且 Bot 可以啟動執行 Cursor 任何模型的雲端代理。[[12]](https://tbreak.com/grok-bot-claude-opus-midjourney-suno/) 這則原推我沒能直接打開，目前只有這一個來源轉述。

這三句話不一定互相矛盾。一種合理的讀法是：主要的「工作大腦」預設改成 Opus 5.5，簡單的小事交給小模型，圖和音樂再外包給專門的服務。但這是我的推測，官方沒有這樣說明過。

對讀者來說，重點不是猜哪一句才對，而是看見一件事：**當模型選擇變成產品內部的決定，連公司自己的人講出來都會不太一樣。** 這正是使用者需要「看得到實際是哪個模型在做」的原因。

## Bot 的四代演化：從灌水帳號到你願意給密碼的同事 {#history}

為了避免把這件事讀成「馬斯克又在吵架」，我想把 Bot 這個字放回比較長的時間軸上。它至少經歷了四代，彼此重疊，不是一代取代一代。

<figure>
  <a href="{{ '/assets/img/technical/grok-bot-model-routing/bot-four-generations.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="grok-routing-diagrams" data-type="image"><img src="{{ '/assets/img/technical/grok-bot-model-routing/bot-four-generations.svg' | relative_url }}" alt="Bot 四代演化：規則 Bot、對話 Bot、代理實驗、數位同事；交辦的單位從一條指令變成一件工作，第四代開始替使用者挑模型" loading="lazy" width="1200" height="800"></a>
  <figcaption>作者整理的約略分期，年代彼此重疊。點圖可放大。</figcaption>
</figure>

**第一代：規則 Bot。** 聊天室裡的腳本、新聞推播、地震速報，也包括大量灌水與洗版的假帳號。在社群平台上，「bot」這個字長期帶著負面意思：它是平台治理要對付的敵人，不是同事。

**第二代：對話 Bot。** 客服機器人、Siri、Alexa。它們能聽懂你想做什麼，但能辦的事很窄。2022 年底，會聊天的大型語言模型讓「Bot」的形象一夕翻轉，變成「會聊天的 AI」。可是它沒有自己的電腦，不能穩定操作你的軟體，長一點的工作很容易斷掉。

**第三代：代理實驗。** 大約 2023 到 2025 年，大家開始給 AI 一個目標，讓它自己拆步驟去做。結果大家都學到了同樣的教訓：迴圈會空轉、帳單會暴衝、出錯了很難查是哪一步。這段時間分出了兩條路：一條是寫程式的代理人，在程式碼和終端機裡特別強；另一條是可以自己架設的個人代理框架，強在記憶、技能和多模型調度。模型路由工具也在這段時間成熟，不過那時候的動機大多是省錢和備援，不是品牌策略。

**第四代：數位同事。** 2026 年的 Grok Bot 和各家的同類產品，語言從「下提示詞」變成「交辦工作」，從「一次對話」變成「有電腦、有排程、有核准點」的工作者。

如果把四代放在一起看，**交辦的單位一直在變大**：一條指令、一句話、一個目標、一件工作。而工作越大，越不可能由單一模型包辦所有步驟。這次的貼文，就是第四代公開承認這件事。

還有一個我覺得很有意思的反轉：**Bot 從被平台追殺的灌水帳號，變成你願意把帳號密碼交給它的同事。** 這個信任的翻轉，其實比換哪顆模型大得多。而現在這位同事開始對外採購大腦了，你得重新想一次：你信任的到底是它，還是它背後那幾家公司？

## 現在的 Bot 是三層疊起來的 {#layers}

要看懂這則貼文的影響範圍，我會把今天的 Bot 拆成三層。

<figure>
  <a href="{{ '/assets/img/technical/grok-bot-model-routing/routing-stack.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="grok-routing-diagrams" data-type="image"><img src="{{ '/assets/img/technical/grok-bot-model-routing/routing-stack.svg' | relative_url }}" alt="三層結構：使用者在分發與信任層交辦工作，Grok Bot 在編排層判斷交給哪個模型，模型層包括自家 Grok、Opus 5.5、Midjourney、Suno 與其他服務；貼文沒說生效日、退出機制、資料去向與計費" loading="lazy" width="1200" height="940"></a>
  <figcaption>模型層的分工是依各家產品類別推測，不是官方對應表。點圖可放大。</figcaption>
</figure>

1. **模型層**：真正「想事情」的大腦。Grok、Claude、GPT、Gemini，以及圖像、音樂、影片的專門模型。能力還在快速進步，但任何一家領先的時間都越來越短。
2. **編排層**：代理人的「工作方式」。記憶、技能、工具權限、核准點、失敗重試，以及這次新增的「這件事交給哪個模型」。工程圈常把這層叫 harness，可以想成馬具：馬再強，沒有好的馬具也拉不動車。
3. **分發與信任層**：誰擁有使用者。帳號、登入、團隊脈絡、帳單，都在這一層。X、Cursor、Slack、各家企業軟體都在搶這層。

LangChain 在 10 月 1 日剛發表一篇文章，主張模型路由應該放在編排層，而不是放在通用的 API 閘道。理由很直覺：編排層看得到這件工作的上下文，知道現在是在規劃、寫程式還是檢查，閘道只看得到一串文字。他們在自家的開源寫程式代理上實測，相對於「每一步都找最頂級的模型」，每件程式任務的中位成本降低了 64%，品質沒有可量測的下降。[[19]](https://www.langchain.com/blog/how-to-build-a-model-router-in-the-harness) 這是他們自家的實驗，不是獨立評測，但方向和馬斯克的補充說明一致：簡單的交給小的，難的交給大的。

**Grok Bot 同時碰到三層。** 它有自家模型、有編排層、又掛在 X 和 Cursor 這兩個龐大的入口上。所以這則貼文的力道，比「又一家做了模型路由」大得多：**掌握入口的人，決定了什麼叫「最好的模型」。**

我自己這半年在站上寫過 [Hermes Agent 的多代理協作]({{ '/technical/hermes-agent-mixture-of-agents/' | relative_url }})、也寫過[用 Hermes 搭配 OpenRouter 做影片]({{ '/technical/hermes-agent-openrouter-video-generation/' | relative_url }})。在那類可以自己架設的代理框架裡，「這一步用哪個模型」本來就是使用者自己設定的。Grok Bot 做的事情，是把這個本來屬於工程師的設定，**變成一般人看不到、也不必看的產品預設值**。方便是真的方便，代價是選擇權也一起被收進去了。

## 一、評價標準：從排行榜變成「被選中率」 {#fit}

我在〈[別再只看排行榜第一名]({{ '/technical/artificial-analysis-llm-evaluation-2026/' | relative_url }})〉裡寫過，排行榜分數只是評估模型的起點，不是終點。這則貼文讓這件事變得更具體。

如果連最會宣傳自家模型的人，都公開說「哪個結果好就用哪個」，那模型公司真正要贏的，就不再只是排行榜，而是**代理人的路由決策**。採購的人會開始問：

- 這一類工作，過去一週代理人實際交給誰最多？
- 失敗的時候，自動改派給誰？
- 每成功完成一件工作要花多少錢，而不是每百萬字的牌價是多少？

這種「用真實選擇當評分」的思路，市場上已經有人在做。OpenRouter 在 8 月推出的自動路由，標題就叫「以市場的智慧驅動模型路由」，參考的是大量使用者在不同任務上實際選了哪個模型。[[20]](https://openrouter.ai/blog/announcements/) Grok Bot 的不同之處在於：它不是讓你參考別人的選擇，而是直接替你選好，而且你看不到選單。

**當產品預設值替幾千萬人定義「什麼叫最好」，排行榜的權力就開始轉移到路由器手上。**

## 二、品牌忠誠變成結果忠誠 {#brand}

過去兩年，模型公司的行銷語言都是「我們最強」。代理產品的語言開始變成「我們最會挑」。這兩種說法放在同一間公司裡，會互相打臉。

Grok 就是第一個活生生的例子。TestingCatalog 那句「對接下來的 Grok 模型該抱多少期待」的擔心，其實就是品牌層面的代價：**如果使用者心裡的版本變成「Grok Bot 很好用，因為它底下是 Claude」，那 Grok 這個名字代表的就是殼，不是腦。**

這個裂痕不會只發生在 SpaceXAI。任何同時賣模型、又賣代理人的公司，遲早都要回答：當你的代理人發現對手的模型在某件事上比較好，你要不要用？用了，模型品牌受傷；不用，代理人產品變差。

我的判斷是：**長期來看，使用者會對「結果」忠誠，而不是對「模型」忠誠。** 就像大多數人不會在意手機裡的晶片是哪家代工，只在意手機好不好用。這對模型公司不是好消息，但對使用者大多是好消息，前提是他們看得到、也能控制。

## 三、帳單：牌價不等於每件工作的成本 {#cost}

這裡我想算一筆帳，因為它是最容易被「最好的結果」這幾個字蓋掉的地方。

AI 模型是按 token 計費的，可以把 token 想成模型讀寫的「字數單位」。依報導引用的列表價，Claude Opus 5.5 每百萬 token 輸入 4 美元、輸出 20 美元；Grok 4.7 在提示長度 20 萬 token 以下時，輸入 2 美元、輸出 6 美元。[[8]](https://cellcog.ai/blog/grok-bot-claude-opus-5-5/) （其他平台上看到的 Grok 4.7 價格不完全一致，下面的試算只用來看「價差結構」，不是精確報價。）

<figure>
  <a href="{{ '/assets/img/technical/grok-bot-model-routing/task-cost-example.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="grok-routing-diagrams" data-type="image"><img src="{{ '/assets/img/technical/grok-bot-model-routing/task-cost-example.svg' | relative_url }}" alt="作者試算：同一件代理工作累計輸入 30 萬、輸出 4 萬 token，Grok 4.7 約 0.84 美元、Opus 5.5 約 2 美元，約 2.4 倍；Opus 的輸出 token 只占 12% 卻占帳單 40%" loading="lazy" width="1200" height="800"></a>
  <figcaption>作者試算，未計快取折扣、重試與工具費用。點圖可放大。</figcaption>
</figure>

假設一件代理工作，來回呼叫模型十幾次，累計讀進 30 萬 token、寫出 4 萬 token：

- 用 Grok 4.7：0.3 × 2 ＋ 0.04 × 6 ≈ **0.84 美元**
- 用 Opus 5.5：0.3 × 4 ＋ 0.04 × 20 ≈ **2.00 美元**

差了大約 2.4 倍。更值得注意的是結構：在 Opus 5.5 那一欄，**輸出只占總 token 的 12%，卻占了帳單的 40%**。代理人越常「想很久、寫很長、失敗重來」，這個價差就越會被放大。

這帶出三個問題，貼文都沒回答：

1. **差額誰吸收？** 如果訂閱價不變、底層換成更貴的模型，要嘛平台吃下成本，要嘛用量額度會變少。
2. **使用者知不知道？** Grok Bot 的用量採額度制，記在 Cursor 帳號上。[[7]](https://cursor.com/help/grok-bot/plans) 如果一件工作消耗的額度因為換了模型而改變，使用者需要看得到原因。
3. **企業帳單會不會跳？** 對按量計費的團隊來說，「只求最好」和「預算可控」是兩件會打架的事。

這裡有一個小插曲可以說明「看得到」有多重要。9 月初，Cursor 論壇上有團隊用戶發現，用量頁面上出現了 Grok Bot 的項目，以為 Bot 在吃他們的 Cursor 額度。官方回覆說那只是顯示問題，Bot 有自己獨立的額度；但同時提醒：**從 Grok Bot 啟動的雲端程式代理，會計入 Cursor 方案。**[[22]](https://forum.cursor.com/t/cursor-team-grok-bot-is-using-my-first-party-cursor-models-allowance/170742) 那次跟路由無關，也已經修好了。但它說明了一件事：**代理人一旦會自己啟動別的代理人、自己挑模型，計費的歸屬就會變得很難靠直覺理解。**

對所有模型公司來說，結論很直接：你需要一個夠好、夠便宜、適合當預設工人的模型，再加一個真正的頂級模型專門接難題，以及清楚的快取和計價規則。**否則代理層會很冷靜地把你路由掉。**

## 四、換大腦，也是換資料處理者 {#data}

這是我認為最被低估的一點：**路由不只是換一顆大腦，而是換一個處理你資料的公司。**

想像一個企業用 Grok Bot 處理客戶信件。昨天，這些信只會經過 SpaceXAI 和 Cursor；明天，同一封信可能被送到 Anthropic。圖片需求可能到 Midjourney，配樂到 Suno。合約裡的「第三方資料處理者清單」可能一夕之間多了好幾家。

官方文件其實已經預告了這個問題：如果你的合約限制了資料處理者，導入前先找業務談；團隊層級的模型白名單只有企業方案有，而且「不保證執行」。[[5]](https://docs.x.ai/grok-bot/security) 對法務來說，「白名單不保證執行」這句話，大概就足以讓合約卡住。

還有一個比較少人想到的面向：**不同模型的「個性」不一樣。** Grok 一向以比較敢回答、比較少說教為賣點；Claude 的安全策略和拒答邊界跟它很不一樣。同一個 Bot，底層一換，回答的尺度、拒絕的時機、甚至語氣都可能跳動。使用者以為自己在跟同一個同事說話，其實背後換了人。

反過來，模型公司也會不安。Anthropic 花了很多力氣設計自己的安全策略，現在它的模型可能被包在一個它無法完全控制的代理人裡執行。我會預期模型公司接下來開始在合約裡規定「你可以怎麼編排我」，例如日誌、資料保存、能不能被包進競爭產品。

## 五、圖像與音樂，還是專門模型的地盤 {#specialist}

貼文點名 Midjourney 和 Suno，等於公開承認了一件事：**通用的大型語言模型還沒有吃掉圖像和音樂。**

有趣的是，SpaceXAI 自己其實有圖像和影片模型。Think Facility 指出，SpaceXAI 的新聞頁上就列著今年夏天推出的 Imagine Image 2.0 和 Imagine Video 1.5；被點名的三家裡，有兩家跟自家產品是重疊的。[[9]](https://www.thinkfacility.com/blog/grok-bot-will-use-claude-opus-midjourney-suno/) 願意在自家已有產品的領域採購外部服務，說明「結果導向」至少在口號上是認真的。

但這裡也有一個落地上的疑問。就我能查到的公開資料，Suno 在 7 月才宣布開始「探索」開發者 API、先從少數合作夥伴開始；[[23]](https://www.digitalmusicnews.com/2026/07/03/suno-is-opening-an-api-partner-program/) Midjourney 我也沒找到公開的自助式官方 API。如果路由要真的接上它們，大概需要個別的合作協議。這也是為什麼我會說：先把這則貼文當成方向，而不是規格。

對所有模型公司的提示是：**如果你的護城河只剩「什麼都能做一點」，在代理經濟裡會被拆開來採購。** 代理人會把寫作、推理、圖像、音樂分給各自最強的人，就像一個好的專案經理不會叫同一個人包辦企劃、設計和配樂。

## 六、開源與自架模型的機會 {#open}

如果結果可以外包，企業接下來一定會問：那敏感的步驟，能不能改用自己架設的開源模型，只把可以公開的部分送出去？

這正是可以自己架設的代理框架一直在做的事：同一套流程裡，有的步驟用雲端頂級模型，有的步驟用本機模型，資料不出門。Grok Bot 把「依任務挑模型」的邏輯推給一般大眾，等於替這個想法做了一次大型的市場教育。

**開源模型不一定要贏排行榜。** 只要在某些可以稽核的特定工作上「夠好，而且資料不出門」，就會被路由進來。這對開源陣營可能是比排行榜更實際的勝利方式。

## 那 Grok 自己的模型呢？ {#grok-itself}

最容易寫錯的一句話是「Grok 放棄自研」。貼文沒有這個意思，馬斯克在訪談裡也說了他們大約每一兩個月就推出新模型。[[21]](https://singjupost.com/transcript-cmg-interview-with-tesla-ceo-elon-musk/)

比較準確的讀法是：

- 自家模型變成**預設工人、成本錨點**，以及對手漲價或斷供時的**退路**。
- 跟頂級模型的差距，可以先用採購補上；訓練資源可以繼續押在下一版。
- Toby Pohlen 那句話說得很清楚：自家模型得打贏，才能進產品。[[16]](https://x.com/TobyPhln/status/2107765082398617990) 這對模型團隊是壓力，也可能是更健康的內部競爭。

風險則在品牌：使用者心裡的版本如果變成「Grok 只是殼」，就算代理人訂閱在成長，模型的名字也會一點一點變淡。

## 三種走向，企業最可能走第三種 {#futures}

往後會怎麼走？我不認為只有一個終局。以下是我的情境推演，不是機率預測。

<figure>
  <a href="{{ '/assets/img/technical/grok-bot-model-routing/three-futures.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="grok-routing-diagrams" data-type="image"><img src="{{ '/assets/img/technical/grok-bot-model-routing/three-futures.svg' | relative_url }}" alt="三種走向：A 編排層贏、模型變零件；B 模型廠商把編排層收回、做封閉套件；C 依風險分層混合使用，作者判斷企業最可能走 C" loading="lazy" width="1200" height="820"></a>
  <figcaption>作者情境推演；三條路可能在不同產業同時出現。點圖可放大。</figcaption>
</figure>

**A：編排層贏，模型變零件。** 使用者只記得「我的 Bot」，底層今天是 Opus、明天是下一代 Grok、後天是開源模型，只要結果穩定就好。模型公司變成比價格、比評測的供應商。最大的風險是：編排者手上握有跨模型的使用資料，變成新的資料集中者。

**B：模型公司把編排層收回去。** 各家把操作電腦、寫程式、企業連接器做成自己的封閉體驗，並且在合約裡限制自己的模型被包進競爭對手的代理人。結局是幾個垂直套件並存，而不是一個 Bot 統治全部。風險是使用者的工作流被鎖在單一供應商裡。

**C：依風險分層混合。** 低風險、可以替換的工作，例如草圖、配樂、初稿、分類，交給最划算或最好的外部模型；高風險的工作，例如個資、合約、未公開的程式碼、醫療，鎖在白名單或自架模型裡。

我認為**企業最可能走 C**。原因不浪漫：企業本來就是用風險分級在管理供應商，AI 模型只是多了一類供應商。但 C 也最考驗細節。如果白名單只寫在文件上、系統卻「不保證執行」，那分層就只是一種願望。

## 如果是我，會先確認這六件事 {#if-me}

如果你的團隊正在評估 Grok Bot，或任何會「替你挑模型」的代理人產品，我會在簽約或擴大使用前先確認：

1. **看得到嗎？** 每一件工作實際用了哪個模型、改派過幾次，使用者和管理者能不能在用量紀錄裡看到。
2. **能指定嗎？** 特定工作能不能鎖定模型，或至少排除某幾家。
3. **白名單是真的擋得住，還是寫在文件上？** 問清楚「不保證執行」在什麼情況下會失效。
4. **資料去哪裡？** 拿到完整的第三方資料處理者清單，確認保存期限與是否用於訓練，並約定清單變動時要通知你。
5. **帳單怎麼算？** 換成更貴的模型時，額度、費用與通知機制是什麼。
6. **出錯算誰的？** 代理人用了 A 公司的模型做出錯誤決定，責任與申訴窗口在哪裡。

如果是個人使用者，我的建議簡單很多：**敏感的東西先不要交給任何你看不到「是誰在想」的代理人。** 其餘的，就好好享受一個訂閱用到好幾家頂級模型的便利。

對在企業裡寫流程、寫規範的人，還有一個比較長遠的提醒：當執行層會自己挑模型，你的流程文件就不能只是給人看的簡報和流程圖。它得是代理人讀得懂的規格，寫清楚哪些步驟可以外包、哪些不行、驗收標準是什麼。**否則代理人會用它自己的預設值，替你填滿所有空白。**

## 當 Bot 替你挑大腦 {#ending}

回到那三句話。

「Whatever is most likely to give you the best outcome.」哪個最有機會給你最好的結果，就用哪個。

聽起來很難反對。但「最好」從來不是一個中性的詞。最好是更準、更便宜、更安全、更快，還是對平台最划算？當選單消失，這個問題的答案就從使用者手上，移到了路由器裡。

我不覺得這是壞事。大多數時候，一個好的代理人比我們更清楚該找誰做事，就像一個好的專案經理。但好的專案經理會告訴你：這件事我交給了誰、為什麼、花了多少、出事了誰負責。

**模型戰爭比的是誰最聰明。調度戰爭比的是，誰能讓你放心把選擇交出去，同時還看得見它替你選了什麼。**

## 參考資料

社群貼文的觀看與按讚數會持續變動，文中數字為 2026 年 10 月 8 日擷取。價格為報導引用的列表價，實際以各廠商公告為準。

- **[1]** [Elon Musk：Grok Bot 改用最佳後端模型的原始貼文](https://x.com/elonmusk/status/2107724314451878104)
- **[2]** [Elon Musk：簡單問題走小模型、複雜問題走大模型](https://x.com/elonmusk/status/2107849623364895151)
- **[3]** [SpaceXAI：Introducing Grok Bot](https://x.ai/news/introducing-grok-bot)
- **[4]** [SpaceXAI：Team Bots](https://x.ai/news/team-bots)
- **[5]** [SpaceXAI Docs：Grok Bot security（模型選擇、白名單、資料處理者）](https://docs.x.ai/grok-bot/security)
- **[6]** [SpaceXAI Docs：Approvals, security, and privacy](https://docs.x.ai/grok-bot/approvals-security-and-privacy)
- **[7]** [Cursor Docs：Grok Bot 方案與計費](https://cursor.com/help/grok-bot/plans)
- **[8]** [CellCog：Grok Bot Will Route to Claude Opus 5.5, Musk Says](https://cellcog.ai/blog/grok-bot-claude-opus-5-5/)
- **[9]** [Think Facility：Musk says Grok Bot will route tasks to Claude Opus 5.5, Midjourney and Suno](https://www.thinkfacility.com/blog/grok-bot-will-use-claude-opus-midjourney-suno/)
- **[10]** [Gizmodo：Grok Bot Is Now a Model Router as SpaceX Continues to Pivot Further Toward AI Infrastructure](https://gizmodo.com/grok-bot-is-now-a-model-router-as-spacex-continues-to-pivot-further-toward-ai-infrastructure-2000823057)
- **[11]** [RuntimeWire：SpaceX says Grok Bot will use rival AI models for different tasks](https://runtimewire.com/article/spacex-grok-bot-rival-model-routing)
- **[12]** [Tbreak：Grok Bot switches to Claude Opus 5.5, adds Midjourney, Suno](https://tbreak.com/grok-bot-claude-opus-midjourney-suno/)
- **[13]** [Robert Scoble：Grok goes open](https://x.com/Scobleizer/status/2107734490747638013)
- **[14]** [Matt Shumer：extremely good news for Bot users](https://x.com/mattshumer_/status/2107753260828570066)
- **[15]** [kimmonismus：Grok Bot 自動挑選模型的評論](https://x.com/kimmonismus/status/2107736997812981770)
- **[16]** [Toby Pohlen：早期 Grok 用 Flux 生圖、模型團隊的新門檻](https://x.com/TobyPhln/status/2107765082398617990)
- **[17]** [Anthony Pompliano：多數 AI 應用產品終將開放多模型](https://x.com/APompliano/status/2107792874192474142)
- **[18]** [TestingCatalog：對未來 Grok 模型期待的疑問](https://x.com/testingcatalog/status/2107803665457189061)
- **[19]** [LangChain：How to Build a Model Router in the Harness](https://www.langchain.com/blog/how-to-build-a-model-router-in-the-harness)
- **[20]** [OpenRouter：Model Routing Powered by Wisdom of the Market](https://openrouter.ai/blog/announcements/)
- **[21]** [The Singju Post：CMG 專訪馬斯克逐字稿](https://singjupost.com/transcript-cmg-interview-with-tesla-ceo-elon-musk/)
- **[22]** [Cursor 社群論壇：Grok Bot 用量顯示問題與官方回覆](https://forum.cursor.com/t/cursor-team-grok-bot-is-using-my-first-party-cursor-models-allowance/170742)
- **[23]** [Digital Music News：Suno is Opening an API Partner Program](https://www.digitalmusicnews.com/2026/07/03/suno-is-opening-an-api-partner-program/)

如果你正在規劃 AI 代理人的導入，可以接著讀本站的 [Agentic Engineering 系列]({{ '/technical/agentic-engineering/' | relative_url }})。需要先判斷哪些流程適合交給代理人、資料邊界該怎麼畫，可以從 [AI Agent 導入顧問]({{ '/technical/' | relative_url }})開始。
