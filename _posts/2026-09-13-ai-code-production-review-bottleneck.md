---
title: "AI 寫得出程式，不代表產品上得了線：工程師的價值搬到哪裡？"
seo_title: "AI 取代工程師了嗎？從寶玉與 Orosz 的討論看程式碼審查與產品交付"
date: 2026-09-13
published: true
categories: [technical]
tags: [ai-agent, agentic-engineering, software-engineering, code-review, ai-governance]
layout: article
cover_image: /assets/img/linkedin/ai-code-production-review-bottleneck.jpg
cover_alt: "水手服品牌主角檢查大量生成的零件，對照右側完成組裝的模組，呈現產出與交付之間的差別"
hero_image: true
use_glightbox: true
mid_cta: false
cta_context: agentic
related_posts:
  - ai-define-verify-problems
  - agentic-ai-coding-spec-oriented
  - production-ai-agent-control-planes
description: "從寶玉、響馬與 Gergely Orosz 的公開討論，拆解 AI 寫程式與產品上線的差距：編碼成本下降之後，團隊該如何處理審查瓶頸、設計驗收證據，以及重新分配工程師與領域專家的責任。"
keywords: AI 取代工程師, 寶玉, Gergely Orosz, 程式碼審查, AI 軟體開發, Agentic Engineering, AI Native, 產品交付, 驗收標準, 史旺基
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>程式碼是中間產物</strong>：能展示功能，不等於能讓別人放心使用，更不等於有人願意付錢。</li>
    <li><strong>編碼的議價能力確實受到挑戰</strong>：原型更容易做，不代表每一種工程職缺都能原封不動留下。</li>
    <li><strong>驗收也要重新設計</strong>：用風險分級、可重跑的測試與上線後監測取代假裝看完；高風險變更仍要深入檢查。</li>
    <li><strong>沒有永久安全的職稱</strong>：人的位置取決於能否判斷、交付與承擔後果，不是名片上有沒有「工程師」。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">先看爭論，再看交付落差</span>
      <ol class="article-toc-items">
        <li><a href="#scene">百分之百取代，與交不出的功能</a></li>
        <li><a href="#symptoms">IDE 少開了，工作卻更多</a></li>
        <li><a href="#profession">工程必要，不代表職缺安全</a></li>
        <li><a href="#prototype">原型與產品之間的距離</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">把驗收做成真的能運作的流程</span>
      <ol class="article-toc-items">
        <li><a href="#review">人工審查不能只剩簽名</a></li>
        <li><a href="#evaluation">測試有沒有能力抓錯？</a></li>
        <li><a href="#native">領域與工程，不必選邊</a></li>
        <li><a href="#next">下一個專案，我會練什麼</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 一邊說百分之百取代，一邊連功能都還沒交出來 {#scene}

9 月 12 日，Leto Bao 在 X 說，寫程式已被 AI「100% 取代」，而程式設計師除了寫程式什麼都不會。未來有價值的，是金融、醫療、工業等領域的人稍微懂一點 AI，就能把東西做出來。[[1]](https://x.com/leto_bao/status/2098612186210062779)

響馬引用這則貼文，反問得很實際：最近一週花了「大幾十億 token」，卻「一個新功能都沒做出來」。[[2]](https://x.com/xicilion/status/2098662982737932444)

一邊說工作已經被取代，另一邊說程式寫了很多，功能還沒交出來。對我來說，兩人碰到的其實是同一個問題：**當程式碼變得容易取得，什麼才算完成工作？**

先說清楚，響馬這句是個人自述，也帶著反諷；不是可供換算帳單的用量紀錄。Leto 的「100%」同樣不是有測試條件的技術結論。不能拿一句暴論當產業統計，也不能拿一句反擊證明 AI 沒用。

寶玉當天下午接著寫了一篇長文。他的反駁中，我最認同的不是「工程師不會消失」，而是這句：程式碼只是軟體的「中間產物」。[[5]](https://x.com/dotey/status/2098700309631512888)

不過，在談職業價值之前，先看他稍早轉述的產業現場。那張清單比較不讓人安心。

## IDE 少開了，工作卻沒有跟著變少 {#symptoms}

寶玉長文發布前，他先翻譯了《The Pragmatic Engineer》作者 Gergely Orosz 的七項觀察。以下依英文原卡整理，不把翻譯加上的解釋算進原文。這是作者觀察，不是涵蓋全產業的抽樣調查。[[3]](https://x.com/GergelyOrosz/status/2098357328504373390) [[4]](https://x.com/dotey/status/2098683651739320420)

1. **開發工具的使用習慣變了。** IDE，也就是把寫程式、除錯等功能放在一起的工具，還在，只是他看到的使用頻率降低。
2. **追求 token 用量的風潮退了。** 原卡用反問嘲諷「tokenmaxxing」；公司用量排行榜的說明，來自寶玉的轉述。
3. **程式碼審查進入「殭屍狀態」。** Orosz 說很多審查只剩做樣子；寶玉譯為「名存實亡」。這不等於所有公司都已取消審查。
4. **開放模型成為省成本的選項。** 原卡認為，開放模型加上推論服務，比最先進模型便宜，效果也接近；沒有交代任務或測量方法，不能推成所有用途都一樣好。
5. **中層管理變薄，職涯發展也受影響。** 原文談的是中層管理，不是「中階工程師」；也沒證明消失的都只是傳話的人。
6. **工作比以前更多。** 寶玉轉述成「工作比以前更累了」；原卡直接寫的是工作更多，沒有測量疲勞或工時。
7. **好工程師仍然難找。** 頂尖 AI 實驗室則是另一種困難：條件很好的應徵者太多，仍有人被拒絕。

這份清單不能證明工程師就業安全。剩下的人更忙，完全可能與人力縮減同時發生；某些公司搶人才，也不代表所有職缺都還在。

它真正讓我在意的是：**如果團隊產出的速度已經超過判斷的速度，「人負責驗收」就不再是一句分工說明，而是一個還沒解決的問題。**

順手補一個容易滑過去的差別：寶玉提到開源模型能避免資料安全問題，原卡並沒有這句。部署在自己能控制的地方，可以改變資料流向；但存取權限、紀錄保存、外部連線與更新來源，還是要另外檢查。模型開放，不是免責通行證。

## 把工程師畫成只會打字的人，當然很好取代 {#profession}

寶玉列出的工作包括理解需求、抽象設計、實作、驗證與維護。這些不是為了保住職稱，臨時塞進去的附加技能，而是他對軟體工程的基本定義。[[5]](https://x.com/dotey/status/2098700309631512888)

拿醫生只會開處方來類比，是在指出同一種錯誤：把職業交出的某個產物，當成整份工作的全部。這個類比可以幫忙拆概念，卻不能拿來證明兩個產業的自動化速度或法律責任相同。

但我也不想順著這個反駁，寫成「所以工程師可以放心」。Leto 的說法太滿，不代表他碰到的變化不存在。

如果一份工作的主要內容，是照著明確需求補畫面、串接既有服務、修改樣板，那麼當同類實作更容易由 AI 完成，這段勞動的議價能力就會受壓。另一方面，領域專家可以自己做原型，縮短從「我知道這裡很痛」到「我們先試試看」的距離。這是值得肯定的改變。

Simon Willison 對兩種工作方式的區分很清楚：他把 vibe coding 限定為完全不關注產生的程式碼、讓模型把東西做出來；Agentic Engineering 則是專業開發者使用能產生、執行與測試程式的 Agent，放大既有專業。不是所有 AI 輔助開發都該叫 vibe coding。[[8]](https://simonwillison.net/2026/Feb/23/agentic-engineering-patterns/)

**工程工作還有必要，與工程師人數、薪資、入行機會不受影響，是完全不同的命題。** 資深工程師搭配 AI，可能讓原本準備擴編的職位不再出現；軟體變便宜，也可能讓更多以前不值得做的需求成立。兩種力量都說得通，這批材料還不能告訴我們最後誰比較大。

## 原型與產品之間，隔著別人的錢與資料 {#prototype}

假設有人用 AI 做了一個課程報名工具。這是說明用的情境，不是客戶案例。

展示時，選課、填資料、按付款，畫面跳出成功通知。很好，值得繼續試。但真的開放報名，問題才開始有意思：

- 最後一個名額，同時來了兩筆付款，誰算報名成功？
- 使用者按了兩次，付款服務又重送通知，會不會建立重複訂單？
- 付款成功但報名寫入失敗，隔天要靠誰對帳？
- 講師能不能看到不屬於自己課程的學員資料？
- 退款規則變了，舊訂單依哪一版處理？系統改壞了又怎麼恢復？

這些不一定要人親手寫程式處理。AI 可以協助設計、實作與測試；但需求中若沒有「已扣款不得無故遺失報名資格」這條規則，程式即使符合原先指令，產品仍然可能做錯。

<figure>
  <a href="{{ '/assets/img/technical/ai-code-production-review-bottleneck/prototype-product.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="code-delivery" data-type="image">
    <img src="{{ '/assets/img/technical/ai-code-production-review-bottleneck/prototype-product.svg' | relative_url }}" alt="課程報名原型能展示付款成功；上線前還要驗證名額、重複通知、資料權限、退款與故障復原" loading="lazy">
  </a>
  <figcaption>本文自擬的課程報名情境。這些是需要補齊的驗證面向，不是所有產品一律照抄的開發清單。點圖可放大。</figcaption>
</figure>

產品價值還有更前面的問題：有人需要嗎？願意付多少？資料取得方式可行嗎？扣掉維運與服務成本，做下去合理嗎？

金融、醫療、工業尤其不能只用展示畫面驗收。個資、專業規範、稽核或工安要求，要依用途與適用規則判斷；不是每個內部小工具都要用同一套大型系統規格，也不是跑得動就能跳過審查。

我不反對領域專家自己動手。相反地，越早把需求做成可討論的東西，通常越容易發現誤會。我要區分的是：**原型證明某條路走得通，產品必須處理其他人也走進來之後會發生什麼。**

## 人工審查不能只剩一個「我看過了」 {#review}

Orosz 在 9 月 8 日的審查專文中，整理了幾種團隊正在嘗試的方法：人審 AI 的審查意見、按出錯影響範圍分級、把注意力前移到計畫與測試、要求更小的修改。公開段落也明講，目前全面取消人工審查的討論，比實際證據更多。[[7]](https://newsletter.pragmaticengineer.com/p/what-is-happening-with-code-reviews)

所以我的解讀不是「review 已死」，而是原本的審法可能接不住現在的產量。

如果每次交來的變更都又大又混雜，最後只好掃一遍、按下同意，再把責任算在人身上，那只是替自動化加了一個簽名欄。出了事，簽名還在，理解不一定在。

我會先分流，讓有限的注意力用在出錯後最難收拾的地方：

- **低風險、易恢復的修改**：先用測試、自動檢查與抽查處理。低風險必須有判定依據，不能由產生修改的 Agent 自己說了算。
- **影響登入、權限、付款或資料結構的修改**：要求人看懂規則、測試與關鍵程式差異，也就是 diff。不能只看 AI 的結論。
- **風險不明的修改**：先停止、補資料，或提高審查等級；不是因為分類器沒抓到就自動放行。

再把交付拆小。一筆修改只解決一件事，附上測試證據，說清楚碰了哪些資料、留下什麼限制、出事如何恢復。自動化測試擅長的檢查交給工具；畫面是否好用、規則是否符合現場，仍要有人實際操作與確認。

<figure>
  <a href="{{ '/assets/img/technical/ai-code-production-review-bottleneck/review-routing.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="code-delivery" data-type="image">
    <img src="{{ '/assets/img/technical/ai-code-production-review-bottleneck/review-routing.svg' | relative_url }}" alt="修改先判斷風險，低風險走自動檢查與抽查，高風險要人工深入審查，風險不明先停止；證據足夠才逐步上線並持續監測" loading="lazy">
  </a>
  <figcaption>參考 Orosz 整理的風險分級方向，延伸為本文的建議流程；不是通用合規標準，也不是讓模型自行核准。點圖可放大。<a href="https://newsletter.pragmaticengineer.com/p/what-is-happening-with-code-reviews">[7]</a></figcaption>
</figure>

這不是比較保守，而是讓審查真的有機會發揮作用。省掉毫無理解的逐行點頭，和省掉驗證，是兩件事。

## 沒有能抓錯的評測，更多 token 只是更多重跑 {#evaluation}

我在六月的〈<a href="{{ '/technical/ai-define-verify-problems/' | relative_url }}">AI 正在改寫軟體開發的瓶頸</a>〉談過「定義與驗證問題」。這次討論值得補上的，是驗證本身也必須有交付品質，不能只要求 AI：「請測完整一點。」

回到課程報名工具。「不得超賣」是規則；「最後一席有多筆同時請求，最多只能成立一筆有效報名，其餘不得留下未處理的扣款」才比較接近能驗的例子。實際退款、保留名額與補償方式，仍要由業務與工程共同決定。

好的評測不只問測試有沒有全綠，還要問：**如果系統真的違反規則，這組測試會不會變紅？**

我會要求正常情境之外，還要有重複通知、逾時、越權、半途失敗與規則變更的測試。讓已知錯誤版本跑一次，確認測試抓得到；保留不隨每次實作一起改動的驗收案例，避免 Agent 為了過關，把答案與考卷一起改掉。

這些要求也可以部分自動化。重點不是找一個永遠不會犯錯的人，而是避免所有檢查都建立在同一個錯誤假設上。

<figure>
  <a href="{{ '/assets/img/technical/ai-code-production-review-bottleneck/evidence-loop.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="code-delivery" data-type="image">
    <img src="{{ '/assets/img/technical/ai-code-production-review-bottleneck/evidence-loop.svg' | relative_url }}" alt="業務規則轉成驗收案例，用已知錯誤確認測試抓得到，再交付實作；上線後的真實失敗回到下一版驗收案例" loading="lazy">
  </a>
  <figcaption>本文建議的驗證循環。測試通過是一份證據，不是安全保證；真實使用的失敗要能回到下一版測試。點圖可放大。</figcaption>
</figure>

績效也該跟著改。我會看從需求到驗收的時間、返工情況、上線失敗與恢復速度，以及使用者是否真的用起來。token 是投入成本，不是成果；程式碼行數也不會自己變成收入。

## 領域知識與工程能力，不需要互相宣布勝利 {#native}

寶玉說能力遷移是雙向的：領域專家能學 AI，工程師也能學領域。這點我同意。但他把領域知識形容成通常可學的外顯知識，我會保留。現場的例外、判斷習慣、信任與責任，不見得都寫在文件裡。[[5]](https://x.com/dotey/status/2098700309631512888)

工程師也不能讀完幾份資料，就自認已經懂醫療或金融。比較可靠的方式，是讓懂流程的人提供規則與失敗案例，懂系統的人把它變成可執行、可驗證的設計。兩種能力可以長在同一人身上，也可以靠合作補齊。

寶玉先前用來判斷 AI Native，也就是 AI 原生組織的標準，是流程圍繞 Agent 執行來設計，人負責定義問題與驗收。這是他的工作框架，不是全產業已採用的認證。[[6]](https://x.com/dotey/status/2093714239718351350)

如果拿它來檢查一個團隊，我會問得更具體：Agent 拿得到需要、且有權使用的資料嗎？可以做哪些修改？何時必須停下來？誰決定驗收條件？誰有權暫停上線？事故發生後，誰真的有能力處理？

有個人留在流程裡，卻沒時間、沒資訊，也沒有否決權，不能算有效監督。

## 我會準備的，不是一個比較安全的職稱 {#next}

最強的反方其實不是「AI 百分之百取代寫程式」，而是：假如規格產生、風險分類、評測設計與上線控制也持續進步，今天搬到上游的工作，明天會不會又被自動化？

會有這種可能。AI 已不只寫程式，Orosz 整理的審查流程就包含讓 AI 幫忙找問題。不能把「人目前需要做的事」寫成「AI 永遠做不到的事」。[[7]](https://newsletter.pragmaticengineer.com/p/what-is-happening-with-code-reviews)

所以，如果是我，下一個小專案就會拿來練這幾件事：

- 把「想做一個功能」改成能說清楚使用者、問題與成功條件的需求。
- 把需求寫成可測規格，至少講清楚失敗時該怎麼辦。
- 設計真的能抓錯的評測，不只收集成功畫面。
- 看懂關鍵程式差異，知道它改了規則、資料還是權限。
- 實際驗證上線、監測與恢復方法，而不是只把責任掛在某個人名下。
- 補一塊領域知識，找懂現場的人一起檢查自己漏掉的假設。

這不是工程師的就業保證，也不是領域專家的入場限制。是當實作越來越便宜，我認為比較值得累積的能力。

**程式寫完了，可以是一個進度。有人能放心使用，才比較接近交付。**

## 參考資料

資料核對截至 2026 年 9 月 13 日。本文是根據公開討論延伸的分析，不是寶玉原文全文翻譯，也不是就業市場調查。短引述依台灣用語轉寫；圖表與課程報名案例為本文整理或自擬，不是第三方實測。

- **[1]** [Leto Bao：AI 與程式設計師的主張](https://x.com/leto_bao/status/2098612186210062779)，2026-09-12。
- **[2]** [響馬：用量與功能交付](https://x.com/xicilion/status/2098662982737932444)，2026-09-12。用量為個人自述，未驗證精確數字。
- **[3]** [Gergely Orosz：軟體工程產業七項觀察](https://x.com/GergelyOrosz/status/2098357328504373390)，2026-09-11。本文核對貼文所附英文原卡。
- **[4]** [寶玉：轉述七項觀察](https://x.com/dotey/status/2098683651739320420)，2026-09-12。與原卡有補充及語氣差異。
- **[5]** [寶玉：程式碼只是中間產物](https://x.com/dotey/status/2098700309631512888)，2026-09-12。職業與能力遷移的判斷屬作者觀點。
- **[6]** [寶玉：AI Native 流程判準](https://x.com/dotey/status/2093714239718351350)，2026-08-29。
- **[7]** [Gergely Orosz：What is happening with code reviews?](https://newsletter.pragmaticengineer.com/p/what-is-happening-with-code-reviews)，2026-09-08。本文僅使用可公開讀取的導言與段落，不聲稱已讀取付費全文。
- **[8]** [Simon Willison：Writing about Agentic Engineering Patterns](https://simonwillison.net/2026/Feb/23/agentic-engineering-patterns)，2026-02-23。用於區分 vibe coding 與 Agentic Engineering，不當成勞動市場證據。

延伸閱讀：<a href="{{ '/technical/agentic-engineering/' | relative_url }}">AI 開發與交付系列</a>。如果團隊卡在「程式一直產出，卻遲遲無法驗收」，可以從<a href="{{ '/technical/' | relative_url }}">技術顧問合作方式</a>開始了解，先釐清阻礙，再決定是否需要導入工具。
