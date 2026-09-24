---
title: "DHH 說該放下筆了：工程師抗拒的是 AI，還是他的結論？"
seo_title: "DHH Pencils Down 演講解讀：AI 接受度、手寫程式成本與企業導入"
date: 2026-09-24
published: true
categories: [technical]
tags: [ai-agent, agentic-engineering, software-engineering, dhh, rails, ai-adoption]
layout: article
cover_image: /assets/img/linkedin/dhh-pencils-down-ai-adoption.jpg
cover_alt: "水手服品牌主角站在暖色劇院指揮自動操作的電腦鍵盤，鉛筆放在一旁，象徵從親手實作轉向協調軟體創作"
hero_image: true
use_glightbox: true
mid_cta: false
cta_context: agentic
related_posts:
  - ai-code-production-review-bottleneck
  - ai-define-verify-problems
  - production-ai-agent-control-planes
description: "DHH 的停筆宣言為何引發反彈？從 Rails World 2026 演講與 AI 導入經驗，談為什麼我把 AI First 當成合作前提，卻不把盲信產出當成專業。"
keywords: DHH, pencils down, Rails World 2026, AI 接受度, AI 寫程式, 手寫程式, Agentic Engineering, 37signals, 企業 AI 導入, 史旺基
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>反對 DHH，不一定是反對 AI</strong>：每天使用工具、仍不信任所有產出、不同意他的產業預測，三件事可以同時成立。</li>
    <li><strong>他的主張不只限於自家公司</strong>：37signals 的政策、對多數公司的判斷、年底近乎全面適用的預測，必須分層檢查。</li>
    <li><strong>值得學的是先交給 Agent 做</strong>：但不該用手寫比例、程式行數或模型用量，代替合格交付的成本。</li>
    <li><strong>我支持 AI First，不支持盲信產出</strong>：願意採用新的工作方式，是合作前提；是否交付，仍由驗證結果決定。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">先分清他說的話，與讀者反對的事</span>
      <ol class="article-toc-items">
        <li><a href="#surprise">看見這些反彈，我也有點訝異</a></li>
        <li><a href="#ai-first">我接受不信任產出，不接受拒絕嘗試</a></li>
        <li><a href="#claims">他真的只是在說自己的公司嗎？</a></li>
        <li><a href="#practice">最值得學的，是改變工作的預設值</a></li>
        <li><a href="#kindness">「我是為你好」，不能跳過證據</a></li>
        <li><a href="#optimism">93% 與 36%，到底在比什麼？</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">把效率主張，放回可以查驗的工作</span>
      <ol class="article-toc-items">
        <li><a href="#economics">經濟帳不能只算生成的那幾分鐘</a></li>
        <li><a href="#blackbox">把 Rust 當黑箱，誰負責知道它會怎麼壞？</a></li>
        <li><a href="#pilot">如果是我，不會先下達停筆令</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 看見這些反彈，我也有點訝異 {#surprise}

看到 Ruby on Rails 作者 DHH 的「pencils down」貼文和後續反彈，我第一個反應是：他的讀者對 AI 的接受度，怎麼會這麼低？

那則貼文說得很滿：對多數公司的多數程式設計師，手寫程式已不再是經濟上划算的技能；但做軟體的未來從未這麼好，不要把這個時刻看成末日。它連到他的 Rails World 2026 開場演講。[[1]](https://x.com/dhh/status/2102936073642869121)

想了一下，我覺得這裡其實混著幾種不同的不滿。

**「不喜歡他這段話」與「不願意用 AI」，不是同一道題。** 一個人可以每天讓 AI 寫程式，仍不接受「手寫已經不划算」；也可以承認工具變強，卻不喜歡自己的工作經驗被描述成該告別的過去。

演講現場的反應就很有意思。DHH 請每週仍大量手寫程式的人舉手，接著說大約只有五個。這段現場互動不能當成採用率調查，卻與網路上激烈的反彈形成反差。[[2]](https://www.youtube.com/watch?v=vDjW_dRyKXY&t=1306s)

用不用 AI，與聽不聽得下去這番話，恐怕要分開看。

<figure>
  <a href="{{ '/assets/img/technical/dhh-pencils-down-ai-adoption/acceptance-layers.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="dhh-pencils-down" data-type="image">
    <img src="{{ '/assets/img/technical/dhh-pencils-down-ai-adoption/acceptance-layers.svg' | relative_url }}" alt="AI 的工具使用、產出信任與產業論述認同是三個獨立問題；一個人可以使用工具但不同意預測" loading="lazy">
  </a>
  <figcaption>每天使用 AI，仍然可以要求檢查產出，也可以不同意講者的預測。這是三種不同的判斷。點圖可放大。</figcaption>
</figure>

## 我接受不信任產出，不接受拒絕嘗試 {#ai-first}

對我來說，這不只是網路上的辯論。在推動 AI 開發時，我也遇過工程師不滿這種工作方式，有人打從心裡就無法信任 AI 的產出。這讓我很能理解，DHH 為什麼會想把話講得這麼直接。

但「我不信任 AI」後面接什麼，差別很大。

如果接的是「所以我要補測試、檢查權限、重跑失敗案例」，我認為這是專業。換成人寫的程式，我也不會因為知道作者是誰，就直接放行。

如果接的是「所以我不想試，也不願意改變原本的做法」，那就不只是品質問題，而是我們是否還適合用同一種方式工作。

**我會把願意接受 AI First，當成選擇合作夥伴的前提。** 對我來說，AI First 是先思考哪些工作可以交給 AI，再把規格、驗證與必要的人工介入安排好；不是 AI 說什麼就照做，也不是禁止所有手寫。

團隊不可能永遠停在「到底要不要用」的爭論。決定往這個方向走，就需要願意動手、調整方法、一起處理失敗的人。若對基本工作方式的期待已經不同，我不認為一定要勉強維持原來的組合，讓彼此長期消耗。

這不是新舊年資的問題。資深工程師願意把經驗用來帶 AI，價值可能更大；新人只會接受模型的第一個答案，也不叫 AI First。

所以，我支持 DHH 把 Agent 變成工作的預設。但支持這個方向，不代表我得接受他的每一個時間表，更不代表所有反對意見都可以不用聽。**願意採用是合作條件，產出過關仍要靠證據。**

## 他真的只是在說自己的公司嗎？ {#claims}

「Pencils down」原本像是考試結束時的「放下筆」。DHH 把它拿來描述公司的新工作方式：37signals 已不再把手寫程式當成日常開發的預設；需要手寫時，先問為什麼 Agent 沒做出想要的成果，再修開發流程。[[2]](https://www.youtube.com/watch?v=vDjW_dRyKXY&t=1245s)

這裡的 Agent，是能接任務、操作工具、修改與測試程式的 AI 助手，不只是替下一行程式提供建議的自動完成工具。

如果他只說「我們公司現在這樣做」，爭論會小得多。但他沒有停在那裡。

他說手寫程式對多數公司的多數工程師，已經不再是具經濟生產力的活動；接著又預測到了年底，會擴及幾乎所有領域、程式設計師與公司。前者是對當下產業的判斷，後者是未來預測。兩者都不是只在描述 37signals。[[2]](https://www.youtube.com/watch?v=vDjW_dRyKXY&t=2440s)

這也是爭論刺耳的地方。他不只是在分享自家公司的成功經驗，還在告訴其他工程師：對多數人來說，你們熟悉的工作方式已經不划算了。

**公司可以依自己的結果改政策；要替多數公司下結論，還得拿出跨情境的證據。** 熟悉的產品、明確的需求與可重跑的測試，跟文件殘缺、權責不清的舊系統，不是同一種開發環境。

37signals 可以先走，其他團隊也值得跟進試。但要不要全面改變工作方式，最後得回到自己的產品與交付結果，不能只靠 DHH 的把握。

<figure>
  <a href="{{ '/assets/img/technical/dhh-pencils-down-ai-adoption/claim-levels.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="dhh-pencils-down" data-type="image">
    <img src="{{ '/assets/img/technical/dhh-pencils-down-ai-adoption/claim-levels.svg' | relative_url }}" alt="DHH 的主張分成公司政策、多數公司的經濟判斷、年底近乎全面適用的預測；範圍擴大需要另外提出證據" loading="lazy">
  </a>
  <figcaption>公司的政策、對多數企業的判斷、對年底的預測，涵蓋範圍不同，不能靠同一個成功案例全部證明。點圖可放大。<a href="https://x.com/dhh/status/2102936073642869121">[1]</a> <a href="https://www.youtube.com/watch?v=vDjW_dRyKXY&amp;t=2440s">[2]</a></figcaption>
</figure>

## 最值得學的，是改變工作的預設值 {#practice}

我支持這場演講最具體的那一部分：不要每接到一件工作，就自動假設必須由人從第一行開始寫。

先讓 Agent 試，觀察它在哪裡失敗。如果它找不到專案規則，就補規則；測試環境起不來，就修環境；總是漏掉同一種邊界，就把它變成驗收條件。否則只是反覆換句話催 AI，並沒有改善開發方式。

37signals 也不是一次就順利。DHH 說，春季為 Basecamp 5 收尾時，設計師各自交出的變更看來合理，合在一起卻破壞了架構；最後仍靠 Agent 加速與大量手寫搭配交付。他後來認為，當時退回熟悉的做法太快，新模型或許已能做得更好。[[2]](https://www.youtube.com/watch?v=vDjW_dRyKXY&t=1354s)

我會把這段經驗當成重新測試的理由。春季做不到，不代表之後也做不到；但模型更新了，也不會讓原本的架構問題自動消失。

同一場演講裡，他也提到 HEY 的下一版打算改做各平台各自的 App，後端換成 Rust，這項改造當時仍在進行。[[2]](https://www.youtube.com/watch?v=vDjW_dRyKXY&t=1444s) 實作成本改變，舊的架構理由確實值得重算；但改造要付出的發行、相容與維護成本，不會因為程式由 Agent 寫就自動消失。

## 「我是為你好」，不能跳過證據 {#kindness}

演講之後，DHH 又發了一則貼文，說讓好人活在已不存在的幻想世界裡，並不仁慈；即使會痛，也要告訴他們，越早接受現實，越早能適應未來。[[3]](https://x.com/dhh/status/2103080538332451190) 稍後他又引《加拉太書》「我告訴你們真話，反而成了你們的敵人嗎？」回應 Reddit 上的批評。[[5]](https://x.com/dhh/status/2103101450268311750)

用這種方式回應，討論很容易變成：一邊認為自己在講真話，另一邊覺得自己的專業被否定。原本可以討論的工作方法，反而退到後面。

我能理解這種急。若你已經用工具做出以前辦不到的事，看別人還在爭論「到底能不能用」，很容易覺得對方根本沒試過。可是一旦把所有不同意見都解釋成否認現實，就少了一個重要可能：對方試過，只是碰到不同的工作條件，或不同意你把經驗推得那麼遠。

**善意可以解釋為什麼要講重話，不能證明重話就是對的。** 同樣地，說法讓人不舒服，也不能證明工具沒用。

帶團隊時，我會看反對意見能不能往下處理。指出資料不能外流，就安排合適的環境；指出測試抓不到錯，就補測試。這些人是在幫忙把路修好。若連試過之後的結果都不願意討論，才是工作方向真的不同。

## 93% 與 36%，到底在比什麼？ {#optimism}

DHH 接著引用中美對 AI 的態度差距：中國 93%、美國 36%，並把中國的樂觀視為一項強大優勢，認為美國必須扭轉這個局面。[[4]](https://x.com/dhh/status/2103100849149132981)

這兩個數字來自 Gallup 與 Microsoft 合作的調查。問的是**知道 AI 的受訪者，預期 AI 是否會對本國人民大致有幫助**，衡量的是對未來的期待，不是使用率，也不是對程式碼品質的信任。[[6]](https://news.gallup.com/poll/714593/optimism-globally-widespread-despite-uneven.aspx) [[7]](https://datawrapper.dwcdn.net/jqaHd/4/dataset.csv)

<figure>
  <a href="{{ '/assets/img/technical/dhh-pencils-down-ai-adoption/optimism-poll.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="dhh-pencils-down" data-type="image">
    <img src="{{ '/assets/img/technical/dhh-pencils-down-ai-adoption/optimism-poll.svg' | relative_url }}" alt="在知道 AI 的受訪者中，預期 AI 對本國人民大致有幫助的比例，中國為 93%、美國為 36%；這不是 AI 使用率" loading="lazy">
  </a>
  <figcaption>Microsoft–Gallup 2026 調查：知道 AI 的受訪者中，預期 AI 對本國人民大致有幫助的比例。其餘回答不能一律當成「有害」。點圖可放大。<a href="https://news.gallup.com/poll/714593/optimism-globally-widespread-despite-uneven.aspx">[6]</a> <a href="https://datawrapper.dwcdn.net/jqaHd/4/dataset.csv">[7]</a></figcaption>
</figure>

Gallup 也提醒，樂觀程度並不單純跟著使用率走：有人很期待 AI，自己卻還沒怎麼用。[[6]](https://news.gallup.com/poll/714593/optimism-globally-widespread-despite-uneven.aspx)

DHH 認為這種態度差距會成為競爭優勢，我能理解他的推論。願意投入的人，確實比較有機會找到新做法。但從「期待有幫助」走到「實際做得更好」，中間還有工具、能力與組織的差別；這份態度調查不能替後半段作答。

對我來說，樂觀有一個很實際的價值：讓人願意投入時間試，容忍初期不順，找出新的做法。但樂觀應該是開始實驗的理由，不是實驗已經成功的證據。

## 經濟帳不能只算生成的那幾分鐘 {#economics}

「Economically viable」是整個爭論裡最值得認真看的字。它不是在問手寫快不快樂，而是在問：以同樣的交付要求，哪種做法值得付錢？

假設要替一個公開活動做報名資料匯出。Agent 很快做出按鈕與下載功能，這當然有價值。但如果匯出的名單混入別場活動、包含不該外流的欄位，或資料一多就逾時，成本就會出現在後面。

我會比較的，是同類工作從說明需求到通過驗收的完整成本：模型費用、準備時間、人工審查、返工，以及觀察期間內的維運負擔。

程式行數不適合當產出的分母：大量生成程式，不能直接換成同倍率的商業價值。

<figure>
  <a href="{{ '/assets/img/technical/dhh-pencils-down-ai-adoption/delivery-economics.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="dhh-pencils-down" data-type="image">
    <img src="{{ '/assets/img/technical/dhh-pencils-down-ai-adoption/delivery-economics.svg' | relative_url }}" alt="以模型、準備、審查、返工及維運總成本，除以通過同一驗收門檻的交付數量，而不是以生成程式行數判斷效率" loading="lazy">
  </a>
  <figcaption>比較同類任務，把準備、審查、返工與維運一起算進去，再看每份合格交付的成本。不同難度的功能，不能當成等值的一件。點圖可放大。</figcaption>
</figure>

如果採用 Agent 之後，連審查與返工一起算仍更省、更快，我沒有理由堅持手寫才叫專業。反過來，如果為了做到「零手寫」，把原本容易修好的問題變成反覆重試，那只是把新口號當成舊信仰。

尤其不能拿「你不夠樂觀」去解釋每一次失敗。那樣的流程永遠不會輸，因為輸的都被算在人身上。

## 把 Rust 當黑箱，誰負責知道它會怎麼壞？ {#blackbox}

DHH 說自己不懂 Rust，甚至認為這是優點；他從外部評估成果，不干預每個實作細節。他也把這比作企業主委託工程師製作系統。[[2]](https://www.youtube.com/watch?v=vDjW_dRyKXY&t=2140s)

這個類比有道理。採購系統的人本來就不必親自讀完所有程式。但委託沒有讓責任消失，只是把工作交給另一方。

我的問題會是：驗收者是否知道要測什麼？只從正常畫面操作，可能看不到權限繞過、重複請求、錯誤復原，或依賴套件出問題時的影響。Agent 可以協助檢查這些事，但不能因為它也說「檢查過了」，就省略能重跑的證據。

「不用逐行手寫」和「不必理解系統」，差得很遠。

所以我仍會讓團隊保留讀程式與手動除錯的練習，不是為了維持打字的尊嚴，而是讓人有能力在工具失敗時接手。

## 如果是我，不會先下達停筆令 {#pilot}

我會先挑一類需求清楚、資料可控制、出錯能復原的工作，讓 Agent 成為優先實作方式，再做這幾件事：

1. **先固定驗收條件。** 同一類任務不因為是 AI 做的就降低標準。權限、失敗處理與必要的效能要求，先講清楚。
2. **保留可比較的基準。** 記錄過去同類任務，或用難度接近的工作比較。不要拿一次展示和一套正式系統比快。
3. **記錄人工介入的原因。** 是需求不清、環境壞掉、模型能力不足，還是規範要求？分開記，才知道該修哪裡。
4. **把不該發生的事列成停用條件。** 例如越權讀資料、關鍵錯誤沒被測試抓到、無法復原。不要等出事才補一句「有人在迴圈裡」。
5. **依結果擴大，不依態度表忠誠。** 成本確實下降、品質守住，就擴大；某類工作不適合，就保留其他路徑。

前一篇〈[AI 寫得出程式，不代表產品上得了線]({{ '/technical/ai-code-production-review-bottleneck/' | relative_url }})〉談的是產出與交付之間的落差。這次 DHH 的爭論，讓我更在意另一件事：我們能不能一邊承認工具已經改變工作，一邊保留反對過度推論的權利？

我仍然對 AI 能讓個人做更多事感到興奮，也不覺得工程師該靠維持手寫比例證明自己的價值。一起合作的人不必相信 AI 每次都對，也不必接受 DHH 的全部預測；但願意以 AI First 的方式工作，是我會要求的共同前提。

筆可以放下。判斷不要一起放下。

## 參考資料

演講引用可直接跳到對應片段；完整影片、後續貼文與調查資料列於下方。

- **[1]** [DHH：Pencils down 原貼文](https://x.com/dhh/status/2102936073642869121)。多數公司與多數程式設計師的經濟判斷，以及對軟體創作的樂觀。
- **[2]** [Ruby on Rails 官方：Rails World 2026 Opening Keynote — DHH](https://www.youtube.com/watch?v=vDjW_dRyKXY)。本文重點段落可直接跳看：[公司政策](https://www.youtube.com/watch?v=vDjW_dRyKXY&t=1245s)、[Basecamp 5](https://www.youtube.com/watch?v=vDjW_dRyKXY&t=1354s)、[HEY 改造](https://www.youtube.com/watch?v=vDjW_dRyKXY&t=1444s)。
- **[3]** [DHH 談直言與善意的貼文](https://x.com/dhh/status/2103080538332451190)。
- **[4]** [DHH 談中美 AI 樂觀程度的貼文](https://x.com/dhh/status/2103100849149132981)。引用 Nick Gillespie，並提出競爭優勢的解讀。
- **[5]** [DHH 引用《加拉太書》回應批評的貼文](https://x.com/dhh/status/2103101450268311750)。
- **[6]** [Gallup：AI Optimism Globally Widespread Despite Uneven Use](https://news.gallup.com/poll/714593/optimism-globally-widespread-despite-uneven.aspx)。2026 年 9 月 22 日發布，含調查方法與分母說明。
- **[7]** [Gallup 圖表原始資料：AI 對本國人民及日常生活的預期](https://datawrapper.dwcdn.net/jqaHd/4/dataset.csv)。
