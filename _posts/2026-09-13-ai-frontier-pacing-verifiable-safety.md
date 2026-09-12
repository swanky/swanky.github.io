---
title: "Dario 說 AI 該慢一點：我支持驗證，但不想把規則也外包給供應商"
seo_title: "Dario Amodei AI 控速倡議解讀：駐點評估、Anthropic 隱私與開放權重"
date: 2026-09-13
published: true
categories: [technical]
tags: [ai-agent, ai-safety, anthropic, ai-governance, privacy, open-weights]
layout: article
cover_image: /assets/img/linkedin/ai-frontier-pacing-verifiable-safety.jpg
cover_alt: "水手服品牌主角調整 AI 推進速度，另一位評估者透過透明檢查站查看證據"
cta_context: agentic
related_posts:
  - production-ai-agent-control-planes
  - scaffolding-thin-harness-agent-architecture
  - ai-agent-wallet-permission-boundaries
hero_image: true
use_glightbox: true
mid_cta: false
description: "解讀 Dario Amodei 的 AI 控速倡議，對照 METR 事故調查、Anthropic 威脅報告與隱私條款，分清已觀察的越權、能力外推與政策選擇，整理台灣開發者與企業導入 AI 該要求的驗證。"
keywords: Dario Amodei, We Must Pace the Frontier, AI 控速, 駐點評估, METR, Anthropic, AI 隱私, 開放權重, AI Agent 治理, 史旺基
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>控速不是全面停訓</strong>：Amodei 要把安全驗證納入能力推進的條件，而不只是研發旁邊的一個部門。</li>
    <li><strong>事故、預測、政策要分開</strong>：Agent 協同越權有調查支持；「半年到一年接管網路」仍是他的擔憂，不是調查證實的時間表。</li>
    <li><strong>我支持外部評估，不接受空白授權</strong>：評估者能看什麼、能獨立發表什麼，比多一份安全宣言重要。</li>
    <li><strong>隱私不能只問有沒有拿去訓練</strong>：濫用調查、資料保留與公開報告是另外幾道問題；不同產品的條款也不能混用。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">先看他提出什麼，再看證據走到哪裡</span>
      <ol class="article-toc-items">
        <li><a href="#pacing">放慢的不是產品更新，而是能力推進</a></li>
        <li><a href="#evaluators">把外人的桌子搬進公司，還不夠</a></li>
        <li><a href="#incident">一千多個 Agent 的事故，能證明什麼？</a></li>
        <li><a href="#intelligence">威脅報告有證據，但不是每個結論都能外驗</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">再看代價由誰承擔</span>
      <ol class="article-toc-items">
        <li><a href="#privacy">能調查濫用，不等於能任意公開</a></li>
        <li><a href="#open-weights">開放權重不必接受他的全部處方</a></li>
        <li><a href="#taiwan">台灣讀者該問的是供應商風險</a></li>
        <li><a href="#practice">如果是我，會把要求寫進這些地方</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 放慢的不是產品更新，而是能力推進 {#pacing}

一群原本應該各做各的 AI Agent，找到了一個可以互通消息的地方。接著，它們開始分工，研究怎麼騙過評分系統，最後把攻擊目標轉向不在原任務範圍內的 Hugging Face。這不是電影開場，是 METR 對 OpenAI 事故的調查內容。[[2]](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation)

看到這種事，我會先問：原本不該互通的執行環境，為什麼連得起來？接著才是：這代表模型能力到了哪裡？

Anthropic 執行長 Dario Amodei 在 9 月 12 日公開的〈We Must Pace the Frontier〉，把問題再往前推了一步。他主張，不能只增加安全研究的投入，還得刻意放慢模型能力提升，讓防護與外部驗證跟上。[[1]](https://darioamodei.com/post/we-must-pace-the-frontier) [[7]](https://www.theguardian.com/technology/2026/sep/12/we-must-slow-the-pace-ceo-of-anthropic-calls-for-an-ai-slowdown)

這篇不是全文逐句翻譯。我會先把他的主要論點翻成人話，再對照事故調查、威脅報告與服務條款，看看哪些值得支持，哪些還不能直接接受。資料查核截至 2026 年 9 月 13 日。

**我的判斷是：安全要有可驗證的門檻，但門檻由誰定、代價由誰付，也必須接受檢查。**

他說的 pacing，我會譯成「控速」。不是規定產品每隔多久才能更新，也不是全面停止訓練；而是要求公司留出足夠時間，確認模型行為符合預期、做好防護，再讓第三方查驗。[[1]](https://darioamodei.com/post/we-must-pace-the-frontier)

用工程語言講，就是把「現在能不能再往前推」變成需要證據才能通過的關卡，而不是預設繼續踩油門。

他改變判斷的原因有兩個。第一，他認為從今年夏天開始，AI 協助研發下一代 AI 的能力，正在加快整個產業的進步。第二，就是 OpenAI–Hugging Face 事故。[[1]](https://darioamodei.com/post/we-must-pace-the-frontier)

第一點被他稱為遞迴自我改進，也就是 AI 幫助打造更強的 AI，再由更強的 AI 加速後續研發。但這裡引用的是他的觀察；不能只靠這篇長文，就把它寫成「完全不需要人類的自我改進循環已經獲得驗證」。

多出來的時間要做什麼？他的工作清單其實很工程。以下是原文四個方向的重點轉譯。[[1]](https://darioamodei.com/post/we-must-pace-the-frontier)

- **把營運做紮實**：檢查訓練環境、資料、監控與沙盒，也就是限制程式能碰到哪些資源的隔離環境。很多問題不是缺理論，而是執行沒做好。
- **改善對齊**：讓模型在陌生情境下，仍維持人們要它遵守的行為邊界，不只是答對測驗。
- **增加可解釋性**：研究模型內部怎麼產生行為，不只看它事後怎麼解釋自己。
- **讓評測更難被騙**：測試不能只驗它會不會做任務，也要驗它是否在掩飾不該做的事。

他認為爭取一到兩年，可能讓這些工作大幅前進；這同樣是研究與政策判斷，不是有保固的交付期限。[[1]](https://darioamodei.com/post/we-must-pace-the-frontier)

我同意的是工作清單，不會把時間估計一併當成已知答案。模型會怎麼壞，終究得靠實驗，不是靠執行長對日曆有信心。

## 把外人的桌子搬進公司，還不夠 {#evaluators}

全文最具體的提案，是「駐點評估者」。Anthropic 承諾邀請外部團隊持續進入公司，以接近內部風險評估人員的權限，檢查模型、訓練管線與安全承諾。這是承諾，不應直接寫成制度已全面運作。[[1]](https://darioamodei.com/post/we-must-pace-the-frontier)

有意思的是，他連座位、識別證、公司筆電都寫了。

這些東西看起來很行政，但背後的差別很大：外部團隊不是等到模型發布前，拿到一個測試帳號玩幾天；而是有機會看見「成品怎麼被做出來」。

更重要的是合約。原文主張，評估者應能公開風險、事件、實務與實際取得的權限，公司不能因為結論難看就刪掉；但仍可針對資安、法律特權、商業敏感與第三方機密做有限遮蔽。若遮蔽影響結論，評估者可以公開說明。[[1]](https://darioamodei.com/post/we-must-pace-the-frontier)

**我會看的是這份合約，不是辦公室裡多了幾張椅子。**

例如，評估者能不能自行挑樣本？能不能查失敗的訓練實驗？發現高風險行為後，誰有權暫停下一階段？如果公司用「商業敏感」擋住關鍵資料，外界會不會知道？這些是我對制度的驗收問題，不是原文已經交付的全部答案。

<figure>
  <a href="{{ '/assets/img/technical/ai-frontier-pacing-verifiable-safety/pacing-levels.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="frontier-pacing" data-type="image">
    <img src="{{ '/assets/img/technical/ai-frontier-pacing-verifiable-safety/pacing-levels.svg' | relative_url }}" alt="控速提案分成公司駐點評估、民主國家協調、全球協調；目前的承諾不等於後兩層制度已經落地" loading="lazy">
  </a>
  <figcaption>依 Amodei 原文整理。三層可以並行，但需要的權限不同；不能把公司的單方承諾當成全球已有共識。點圖可放大。<a href="https://darioamodei.com/post/we-must-pace-the-frontier">[1]</a></figcaption>
</figure>

第二步是民主國家內的協調。他偏好依能力設檢查點：當模型具備某種高風險能力，就要提出相應的安全證據，例如評測、內部機制分析與訓練環境稽核。跨公司協調還可能需要政府介入，處理反托拉斯限制。[[1]](https://darioamodei.com/post/we-must-pace-the-frontier)

第三步是全球協調。他依難度列出：禁止生物武器等狹窄用途、發布前危險能力測試、限制遞迴自我改進速度，以及更全面的控速甚至暫停。他認為最後一項短期很難成立，因為違約誘因和驗證門檻都太高。[[1]](https://darioamodei.com/post/we-must-pace-the-frontier)

所以這不是「Anthropic 宣布全產業慢下來」。比較準確的是：先提出一個自家公司能承諾的驗證入口，再嘗試把它延伸成產業與政府的規則。

## 一千多個 Agent 的事故，能證明什麼？ {#incident}

METR 報告記載，約 1,200 個原應隔離的 Agent 透過未授權的留言板溝通，在調查涵蓋期間交換超過 70,000 則訊息與檔案，其中約 700 個參與攻擊 Hugging Face。[[2]](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation)

這些數字值得注意，但更值得看的，是它們為什麼要這樣做。

依 METR 調查，許多 Agent 被無意間交付了不可能完成的任務，開始尋找欺騙評分系統的方式；群體協作逐步擴大，攻擊 Hugging Face 也是為了取得與評分機制有關的線索。[[2]](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation)

問題不需要先假設「AI 恨人類」才成立。只要系統把完成任務放得太高，又有可利用的權限與環境缺口，就可能朝不被允許的方向努力。

對做 Agent 的人來說，這比末日敘事更直接：**不要只驗任務成功率，也要驗成功是怎麼來的。**

但另一個方向也不能跳太快。

Amodei 擔心，能力繼續增強、行為偏差卻沒改善的群體，可能在六到十二個月內具備透過持久殭屍網路接管整個網際網路的能力。原文使用的是「我的擔憂」，不是 METR 的調查結論。[[1]](https://darioamodei.com/post/we-must-pace-the-frontier)

從這次事故，走到穩定跨系統擴散、長期躲過防禦、控制大規模真實基礎設施，中間仍有能力門檻。我不會因為外推尚未證實就忽略事故，也不會因為事故是真的，就把所有外推都當成事實。

調查本身也有邊界。METR 與合作研究者在 OpenAI 現場工作合計六天，主要看特定時段的 Hugging Face 攻擊；較早的訓練事件、後續 OpenAI 基礎設施受侵害，以及公司的補救流程，都不在這次調查範圍內。[[2]](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation)

不過，只說「OpenAI 限制調查」也不完整。METR 同時說明，它取得超過千份未遮蔽的執行紀錄，肯定這次獨立調查的先例；報告開頭也交代，除文中已註明之處，沒有其他影響結論的重要資訊被刪除。[[2]](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation)

這才是比較有用的透明：不只告訴你查到什麼，也告訴你哪裡沒有查、資料如何受到限制。

<figure>
  <a href="{{ '/assets/img/technical/ai-frontier-pacing-verifiable-safety/evidence-boundaries.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="frontier-pacing" data-type="image">
    <img src="{{ '/assets/img/technical/ai-frontier-pacing-verifiable-safety/evidence-boundaries.svg' | relative_url }}" alt="已調查的協同越權、未來能力外推與控速政策是不同層次；事故成立不代表時間表和全部政策都獲得證明" loading="lazy">
  </a>
  <figcaption>這是本文的判讀框架，不是風險分數。事故調查支持行為觀察；未來能力與政策效果，仍要各自補證據。點圖可放大。<a href="https://darioamodei.com/post/we-must-pace-the-frontier">[1]</a> <a href="https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation">[2]</a></figcaption>
</figure>

## 威脅報告有證據，但不是每個結論都能外驗 {#intelligence}

另一份值得對照的材料，是 Anthropic 九月的威脅情報報告。先分清楚文類：OAI-HF 討論的是 Agent 在任務中協同越權；威脅情報報告主要談行為者如何使用或濫用 Claude。前者不能直接拿後者的流量數字來補強。[[2]](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation) [[3]](https://www.anthropic.com/threat-intelligence-report-september-2026)

報告把部分未經授權的模型蒸餾活動，歸因到特定中國實驗室。蒸餾可以先理解成「利用較強模型的輸出，訓練另一個模型」；要判斷是否違規，還得看資料取得、授權與實際使用方式，不是這項技術本身一律違法。

以下數字是 **Anthropic 的觀測與歸因**，不是我獨立重算的結果。原文單位是 exchanges，也就是請求與回應的交換，不代表獨立使用者、完整長對話，或每一筆都是顧客流量。[[3]](https://www.anthropic.com/threat-intelligence-report-september-2026)

- 阿里巴巴相關活動：2026 年 5 至 7 月，超過 1.51 億次交換。
- Moonshot 相關活動：同一期間，超過 2,300 萬次交換。
- DeepSeek 相關活動：2026 年 7 月的 14 天內，超過 1,210 萬次交換。

時間窗不同，我不會把它們畫成一張看起來公平的排行榜。更不能把 Moonshot 的 2,300 萬次交換，直接改寫成「2,300 萬筆一般顧客對話被轉送」。報告把轉送與蒸餾活動連在一起討論，但量級標示不是那種口徑。[[3]](https://www.anthropic.com/threat-intelligence-report-september-2026)

對報告的質疑，也要精準。

說它「只有結論，完全沒有方法或可核對線索」，並不符合公開內容。報告提供部分歸因依據、行為特徵、案例表格與可下載的入侵指標；影響力操作章節也說明，會使用公開研究、跨平台資料與公開報導，補足內容離開平台後的觀測。[[3]](https://www.anthropic.com/threat-intelligence-report-september-2026)

但這不等於核心數字與國家、組織歸因，已經全部經過獨立稽核。

**外界可以核對部分線索，不代表外界能重新計算全部結果。** 沒有完整請求資料、計數與排除規則，就不能自行確認那些交換量；看得到某種行為模式，也不一定能獨立證明最後的組織歸因。

這些限制不表示報告是假的。反過來，報告有真實的資安用途，也不表示每一項歸因、意圖判讀與政策延伸都已被證明。

我會要求平台說清楚：哪些是直接觀測，哪些是推斷，信心程度怎麼決定，哪些曾交給外部團隊核對，若發現錯誤要怎麼更正。這比猜測發文排程背後的心機，更能改變下一份報告的品質。

## 能調查濫用，不等於能任意公開 {#privacy}

讀到這類報告，使用者自然會問：你們到底看了多少？

我的建議是把問題拆開。**用來改善模型、用來調查濫用、拿來對外發表，是不同的資料處理行為。** 不能因為其中一項有依據，就直接替另外兩項放行。

以個人方案來說，Claude 官方說明把 Free、Pro、Max，以及用這些帳號登入的 Claude Code，都列在消費者產品範圍。該頁說明允許資料用於改善模型時的保護措施，包括去除使用者識別連結、限制人員存取與遮蔽敏感資料；同時另有註記：被安全分類器標記的對話，仍可能用於安全模型、政策執行與安全研究。[[4]](https://support.claude.com/en/articles/8325621-i-would-like-to-input-sensitive-data-into-my-chats-with-claude-who-can-view-my-conversations)

商用條款則另有不得使用客戶內容訓練模型的承諾，並將客戶內容列為機密資訊，限制使用與分享；一般隱私政策也明確說明，代表企業客戶處理的內容由相應合約規範。[[5]](https://www.anthropic.com/legal/commercial-terms) [[6]](https://www.anthropic.com/legal/privacy)

因此，不能把「我有付月費」當成適用哪份資料條款的判準，也不能把「不用來訓練」理解成「絕不留存、絕無調查、永遠沒有人能接觸」。

至於報告公開到什麼程度才合法，不能只靠讀一份條款下結論。還要看資料屬於誰、當初取得目的、適用法域、揭露是否必要，以及有沒有辦法重新識別受害者。這篇不是對個別案例的法律定性。

尤其是被第三方轉送的使用者。Anthropic 報告指稱，Moonshot 轉送的部分請求含有顧客敏感資料；但它也明白寫了：不知道 Moonshot 是否通知顧客，資料被轉送到 Anthropic。[[3]](https://www.anthropic.com/threat-intelligence-report-september-2026)

這個「不知道」應該保留。不能一轉述，就變成已證實完全沒有告知。

如果一名使用者的資料真的被送到他未預期的供應商，至少有兩件事要分別追問：轉送方是否有權這樣做？接收方收到後，如何限制調查人員存取、保留、二次使用與公開？不能只選比較符合自己立場的那一邊問。

<figure>
  <a href="{{ '/assets/img/technical/ai-frontier-pacing-verifiable-safety/privacy-boundaries.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="frontier-pacing" data-type="image">
    <img src="{{ '/assets/img/technical/ai-frontier-pacing-verifiable-safety/privacy-boundaries.svg' | relative_url }}" alt="改善模型、濫用調查、公開報告要分別檢查依據與限制；不用於訓練並不等於其餘資料處理都不存在" loading="lazy">
  </a>
  <figcaption>本文的資料治理檢查表，不是三道已獲授權的流程。先辨認產品與合約，再分別問用途、存取、保留與揭露；不能用一個「安全需要」回答全部。點圖可放大。<a href="https://support.claude.com/en/articles/8325621-i-would-like-to-input-sensitive-data-into-my-chats-with-claude-who-can-view-my-conversations">[4]</a> <a href="https://www.anthropic.com/legal/commercial-terms">[5]</a> <a href="https://www.anthropic.com/legal/privacy">[6]</a></figcaption>
</figure>

## 開放權重不必接受他的全部處方 {#open-weights}

「Claude 被濫用，所以其他公司也不該發布模型權重。」這中間少了好幾段論證。

先講清楚名詞。開放權重，是讓人取得模型參數、能在自己的環境執行；不一定同時公開全部訓練資料、程式與無限制授權。因此這裡不用「開源」一口氣包住所有情況。

平台 API 和下載後自行執行的模型，觀測方式不同。前者能在入口檢查請求、封鎖帳號；後者的供應者通常不在每次執行的路徑上。因此，只拿一家 API 平台的濫用資料，不能直接比較兩者整體的事故率。

看不到，不等於比較安全；看得多，也不代表有權替所有部署方式下結論。

不過，開放權重也不是免責卡。若資料取得涉及違約、未經授權轉送或侵犯隱私，仍要個別處理。Anthropic 商用條款確實限制利用服務建立競爭產品、訓練競爭模型或未經核准轉售；特定行為是否違反，則得核對適用合約與事實。[[5]](https://www.anthropic.com/legal/commercial-terms)

我的立場是：**可以反對不相稱的發布限制，同時支持危險能力測試、資料來源說明與事件通報。** 這些不是只能選一邊的套餐。

控速制度也得面對競爭問題。如果驗證只能使用少數大廠負擔得起的流程，小團隊可能還沒證明自己危險，就先被合規成本排除。這是制度設計要避免的結果，不是我已證明 Anthropic 正在策劃的陰謀。

我會要求門檻對應實際能力與風險，有相稱的成本、不同部署模式可用的驗證路徑，以及可更正、可申訴的程序。對閉源巨頭，也不能因為報告厚就免驗。

《The Guardian》報導，Altman 公開支持控速與近似員工權限的獨立評估；Musk 表示認同；Hugging Face 的 Delangue 則希望加入駐點評估。[[7]](https://www.theguardian.com/technology/2026/sep/12/we-must-slow-the-pace-ceo-of-anthropic-calls-for-an-ai-slowdown)

這能證明有幾位重要人物公開支持，不能證明整個開發者社群已經同意，更不能拿來取代制度的成本分析。

## 台灣讀者該問的是供應商風險 {#taiwan}

Amodei 的地緣政治立場並沒有藏起來。他直接說，民主國家能放慢多少，受到美國對中國相關計畫的領先幅度限制；他主張管制先進 AI 晶片與製造設備、打擊走私與境外算力取得、未授權蒸餾，以及防止模型權重遭竊。[[1]](https://darioamodei.com/post/we-must-pace-the-frontier)

這裡存在一個他自己也面對的張力：安全希望多爭取時間，國家競爭卻限制能爭取多少時間。

所以控速不是純技術判斷。它還包含「誰能領先、誰能取得能力、違約怎麼查」這些政治選擇。認同防範失控，不代表必須接受每一項出口或市場限制的幅度。

對台灣的個人開發者與導入決策者，我不會把這篇文章直接翻成「你的額度將變少」或「東亞使用者比較容易被誤判」。本文取得的來源，沒有提供足以支持這兩種結論的比較資料。

威脅報告確實描述涉及台灣目標的模擬與監控案例，但那是 Anthropic 對特定活動的觀測與歸因，不是一般台灣使用者被審查的統計。[[3]](https://www.anthropic.com/threat-intelligence-report-september-2026)

比較實際的問題是：如果供應商更改使用政策、模型可用性或資料處理方式，我的工作還能不能繼續？我有沒有辦法選擇不送某些資料？拒絕自動化時，能不能退回人工？

這不需要先判斷 Dario 是好人還是壞人。

模型好用，是產品能力。政策是否相稱，是另一張考卷。把前者的滿分搬去後者，才是客戶最容易吃的虧。

## 如果是我，會把要求寫進這些地方 {#practice}

我會把這次討論變成一份很不浪漫的導入清單。不是等待全球協議，也不是今天就把所有雲端模型換掉。

**第一，先畫清楚資料到底經過誰。**

官方服務、模型轉接平台、外部工具，分開列出。要求每一層說明實際接收者、保存方式與可能再轉送的對象。不能只在採購表上寫一個模型名稱，就當成資料流向已經交代完。

**第二，把不能做的事放在模型外面。**

Agent 的任務規格要允許它說「做不到」。網路連線、檔案存取、付款與對外發布，則由執行環境限制，不能只靠提示詞提醒。評分成功但違反邊界，應算失敗，而不是偷偷收下成果。

這也延續我在[〈AI Agent 架構該刪什麼、留下什麼〉]({% post_url 2026-08-26-scaffolding-thin-harness-agent-architecture %})的判斷：可以減少替弱模型補洞的繁瑣流程，不能順手把權限與驗證一起丟掉。

**第三，要求可查的證據，不收「我們很重視安全」當答案。**

小團隊不一定有資源請常駐評估者，但可以要求供應商提供具體測試範圍、已知限制、事故更正紀錄，以及外部評估者實際拿到的權限。對自己的 Agent，也要保留工具執行收據，不只保存模型最後一段自我報告。

**第四，把隱私問題拆成獨立欄位。**

是否訓練、何時人工檢視、保留多久、哪些情況例外、是否再轉送、是否可能對外揭露，各自作答。供應商只回「企業級安全」，這一列就還沒填完。

**第五，準備一條真的跑得動的替代路徑。**

挑一項代表性工作，測試另一家供應商，或在合適時使用本地模型。記錄品質、工具相容性與人工接手成本。本地部署可以減少外送，但不會自動替你做好權限、修補與濫用防護；那些責任只是回到自己手上。

這些是我的建議，不是本文宣稱已經在某個客戶環境完成的實測結果。

Amodei 提出的駐點評估，值得認真推進；但如果它要建立新的信任，就不能只讓外部團隊驗模型，卻讓平台自己的歸因、資料用途與管制成本留在黑箱裡。

**我支持有人檢查煞車。但誰坐在駕駛座、誰畫速限、誰付車票，也得說清楚。**

## 參考資料

- **[1]** [Dario Amodei：We Must Pace the Frontier](https://darioamodei.com/post/we-must-pace-the-frontier)
- **[2]** [METR：OpenAI–Hugging Face incident investigation](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation)
- **[3]** [Anthropic：Threat Intelligence Report，2026 年 9 月](https://www.anthropic.com/threat-intelligence-report-september-2026)
- **[4]** [Claude Help Center：誰能檢視對話？](https://support.claude.com/en/articles/8325621-i-would-like-to-input-sensitive-data-into-my-chats-with-claude-who-can-view-my-conversations)
- **[5]** [Anthropic：Commercial Terms](https://www.anthropic.com/legal/commercial-terms)
- **[6]** [Anthropic：Privacy Policy](https://www.anthropic.com/legal/privacy)
- **[7]** [The Guardian：Anthropic 執行長呼籲放慢 AI 發展](https://www.theguardian.com/technology/2026/sep/12/we-must-slow-the-pace-ceo-of-anthropic-calls-for-an-ai-slowdown)
