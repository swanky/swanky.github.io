---
title: "AI 可以幫你做出錢包，卻做不出 USDC：軟體變便宜以後，什麼還抄不走？"
seo_title: "You can't vibe code USDC：AI 讓軟體變便宜後，護城河移到狀態、責任與可攜性"
date: 2026-11-05
published: true
categories: [technical]
tags: [web3, ai-agent, stablecoin, usdc, composability, vibe-coding]
layout: article
cover_image: /assets/img/linkedin/you-cant-vibe-code-usdc.jpg
cover_alt: "史旺姬站在金庫大廳，舉起一枚金幣對著光看，金幣拉出光線連到金庫門、帳本書架與遠處店家；左邊另一位女子搖著複製機，吐出一堆沒有連線的金幣與錢包手機"
hero_image: true
use_glightbox: true
mid_cta: false
cta_context: web3
related_posts:
  - blur-frontend-shutdown-nft-liquidity
  - ai-agent-wallet-permission-boundaries
  - ai-agent-payments-web3
description: "AI 能複製介面和程式碼，做不出 USDC 背後的準備金、銀行與法律責任。從 a16z 論點、SVB 事件與 POAP 收攤，看什麼還抄不走。"
keywords: You can't vibe code USDC, vibe coding, USDC, 穩定幣, a16z, 可組合性, 共享狀態, 護城河, AI Agent, x402, POAP, Blur, GENIUS Act, 史旺基, Swanky Studio
---

這週收到 a16z 的電子報，整篇讀完，我記得最清楚的是一句話：

**You can't vibe code USDC.**

Vibe coding 是 Andrej Karpathy 在 2025 年 2 月提出的說法，指的是不太管程式碼本身，靠跟 AI 對話把東西做出來。[[2]](https://en.wikipedia.org/wiki/Vibe_coding) 那句話翻成白話：AI 可以幫你寫出很多東西，但寫不出 USDC。

我覺得這句話很有道理。不過多想一下，會發現它有道理的原因，和 a16z 想推到的結論不完全一樣。

現在叫 AI 做一個錢包 App，不用多久就能看到雛形。你甚至可以部署一個代號叫 USDC 的代幣：在 ERC-20 標準裡，名稱和代號只是合約自己回報的欄位，部署的人想填什麼都行。[[4]](https://ethereum.org/developers/docs/standards/tokens/erc-20) 程式碼可以一模一樣，畫面也可以一模一樣。

但不會有人拿一塊美元跟你換。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>AI 讓程式碼變便宜，稀缺的東西移到「狀態」</strong>：餘額、紀錄、流動性、信用，要靠時間累積，沒辦法重新生成。</li>
    <li><strong>USDC 抄不走，最大的原因在鏈下</strong>：準備金、銀行、法規與稽核，才是它值一美元的理由。2023 年銀行出事時，它一度跌破 87 美分。</li>
    <li><strong>上鏈真正換到的，是撐得過收攤</strong>：Blur、POAP 的網站關了，鏈上紀錄還在；但整合與社群不會自動跟著搬家。</li>
    <li><strong>我會用三個問題盤點抄不走的東西</strong>：拿掉介面還剩什麼狀態、出事時誰負責、你明天消失別人能不能接手。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">a16z 說對了什麼</span>
      <ol class="article-toc-items">
        <li><a href="#claim">可以拿來組合的，從程式碼換成網路</a></li>
        <li><a href="#usdc">拆開一枚 USDC，抄得走的只有最上面一層</a></li>
        <li><a href="#svb">最難抄的那幾層，其實不在鏈上</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">那上鏈到底換到什麼</span>
      <ol class="article-toc-items">
        <li><a href="#survive">網站關掉以後，帳本還在</a></li>
        <li><a href="#saas">同一件事的金融版：舊軟體正在變便宜</a></li>
        <li><a href="#my-check">如果是我，我會先問這三個問題</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 可以拿來組合的，從程式碼換成網路 {#claim}

先講 a16z 這篇在說什麼。作者 Daren Matsuoka 從開源講起：開源讓程式碼可以拿來組合，不用每次從零寫。[[1]](https://a16zfrontier.substack.com/p/when-software-stops-being-the-moat)

區塊鏈圈很早就用類似的話描述自己。以太坊官方文件把智慧合約比喻成樂高，每個合約都像公開的 API，任何人都能呼叫，也能接進自己的應用。[[3]](https://ethereum.org/developers/docs/smart-contracts/composability) a16z 舉的例子是 Uniswap：新應用可以直接用它池子裡現成的流動性，不必自己從頭養一個市場。[[1]](https://a16zfrontier.substack.com/p/when-software-stops-being-the-moat)

a16z 認為這個概念過去沒有紅起來，是因為實驗太貴。要懂合約、資安、稽核，願意下場的人不多。AI 把做原型的成本壓下來以後，實驗會變多，所以值得回頭重看 NFT、DAO、去中心化社群和鏈上遊戲。[[1]](https://a16zfrontier.substack.com/p/when-software-stops-being-the-moat)

整篇最關鍵的是下一段。AI 幾乎能重做任何應用：複製介面、改寫 API、幾分鐘生出新產品。[[1]](https://a16zfrontier.substack.com/p/when-software-stops-being-the-moat) 到那時，「最好用的錢包」已經不稀缺；稀缺的是最深的流動性、最強的信用、最完整的身分關係，以及最被信任的結算網路。[[1]](https://a16zfrontier.substack.com/p/when-software-stops-being-the-moat)

<figure>
  <a href="{{ '/assets/img/technical/you-cant-vibe-code-usdc/code-vs-state.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="vibe-code-usdc" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/you-cant-vibe-code-usdc/code-vs-state-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/you-cant-vibe-code-usdc/code-vs-state.svg' | relative_url }}" alt="錢包畫面、後端程式、合約原始碼，甚至一枚叫 USDC 的代幣，AI 都能重做；餘額、交易紀錄、準備金與願意收它的服務，AI 做不出來" width="1200" height="640" loading="lazy"></picture>
  </a>
  <figcaption>左欄是 AI 越做越便宜的東西，右欄要靠時間與責任累積。依 a16z 原文論點整理，右欄的「準備金、銀行與兌付承諾」是我加上的。來源：<a href="https://a16zfrontier.substack.com/p/when-software-stops-being-the-moat">[1]</a>。</figcaption>
</figure>

到這裡我都同意。程式碼正在變得像水電：重要，但很難再靠它跟別人拉開距離。

## 拆開一枚 USDC，抄得走的只有最上面一層 {#usdc}

想確認這句話到底對在哪裡，我把 USDC 拆成六層來看。

最上面是合約程式。這層真的抄得走：ERC-20 是公開標準，寫一份功能一樣的合約並不難。[[4]](https://ethereum.org/developers/docs/standards/tokens/erc-20)

第二層是鏈上狀態，也就是哪個地址有多少 USDC、什麼時候轉給了誰。這層抄不走。合約可以複製，複製出來的卻是一本空帳本。

再往下，就離開區塊鏈了。

第三層是準備金。Circle 說 USDC 隨時可以 1:1 兌回美元；準備金大部分放在一檔由 BlackRock 管理、向美國證管會（SEC）註冊的貨幣市場基金，其餘是銀行存款。持有內容每週公開，還有四大會計師事務所每月出具第三方確信報告。[[5]](https://www.circle.com/transparency)

第四層是銀行通道。Circle 自己寫過，截至 2023 年 10 月 12 日的 12 個月裡，它靠鑄造和贖回 USDC，在銀行系統與區塊鏈之間搬了超過 2,770 億美元。[[5]](https://www.circle.com/transparency)

第五層是法規。美國 2025 年 7 月簽署的 GENIUS Act，要求穩定幣發行商用美元或短期公債等流動資產做 100% 準備，並且每月公開準備金的組成。[[8]](https://www.whitehouse.gov/fact-sheets/2025/07/fact-sheet-president-donald-j-trump-signs-genius-act-into-law)

最後一層是接受度：交易所、DeFi 協議、付款服務願意收它、願意整合它。a16z 說的「網路」，主要就是這一層。

<figure>
  <a href="{{ '/assets/img/technical/you-cant-vibe-code-usdc/usdc-stack.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="vibe-code-usdc" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/you-cant-vibe-code-usdc/usdc-stack-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/you-cant-vibe-code-usdc/usdc-stack.svg' | relative_url }}" alt="USDC 六層中，只有合約程式能被 AI 重做；鏈上餘額、準備金、銀行通道、法規與接受度都不能，其中準備金、銀行與法規在鏈下" width="1200" height="720" loading="lazy"></picture>
  </a>
  <figcaption>只有合約程式這層 AI 能重做，而且重做出來的東西不是 USDC。準備金、銀行與法規三層都在鏈下。來源：<a href="https://www.circle.com/transparency">[5]</a>、<a href="https://web.archive.org/web/20230313023657/https://www.circle.com/blog/an-update-on-usdc-and-silicon-valley-bank">[6]</a>、<a href="https://www.whitehouse.gov/fact-sheets/2025/07/fact-sheet-president-donald-j-trump-signs-genius-act-into-law">[8]</a>。</figcaption>
</figure>

表畫完，我發現一件有點微妙的事。

## 最難抄的那幾層，其實不在鏈上 {#svb}

2023 年 3 月，矽谷銀行（SVB）倒閉。Circle 當時揭露，USDC 還有 33 億美元的現金準備留在 SVB。[[6]](https://web.archive.org/web/20230313023657/https://www.circle.com/blog/an-update-on-usdc-and-silicon-valley-bank) 那個週六，原本應該值 1 美元的 USDC，一度跌到 87 美分以下。[[7]](https://www.cnbc.com/2023/03/11/stablecoin-usdc-breaks-dollar-peg-after-firm-reveals-it-has-3point3-billion-in-svb-exposure.html)

鏈上什麼都沒壞。合約照常執行，轉帳照常確認。出問題的是鏈下的銀行。

Circle 在同一份聲明裡寫得很直白：USDC 在鏈上可以全年無休地使用，但發行和贖回受美國銀行的營業時間限制。[[6]](https://web.archive.org/web/20230313023657/https://www.circle.com/blog/an-update-on-usdc-and-silicon-valley-bank)

所以我的判斷是：**You can't vibe code USDC 這句話是對的，但讓它成立的那幾層，大多在鏈下。**

USDC 的稀缺，來自一家有人負責、會被稽核、受法規約束的公司，加上它背後的銀行。區塊鏈負責把帳記清楚、讓任何人都讀得到，這件事很重要，但它不是價值的唯一來源。

這也是我覺得 a16z 這篇跳太快的地方。它從「網路比軟體稀缺」，一路推到「區塊鏈或許本來就該是網路的共享狀態層」。[[1]](https://a16zfrontier.substack.com/p/when-software-stops-being-the-moat) 但網路效應不是區塊鏈獨有的。Visa 有結算網路，Google 有帳號身分，Meta 有社交關係；它們同樣抄不走，而且早就存在。

還有一件事要記得：a16z 本身是 crypto 的大型投資人，公開的投資清單裡就有 Uniswap。[[11]](https://a16z.com/investment-list) 這不代表論點錯，只是讀的時候要知道作者站在哪裡。

## 網站關掉以後，帳本還在 {#survive}

那上鏈到底換到什麼？我覺得比較誠實的答案不是「稀缺」，而是**撐得過收攤**。

上個月我寫過 [Blur 關站]({% post_url 2026-10-13-blur-frontend-shutdown-nft-liquidity %})：官方網站和新貸款撮合都要停，鏈上的交易協議卻還在。好用的入口沒了，帳本沒有消失。

POAP 是更完整的例子。這個鏈上出席證明服務，今年 3 月進入維護模式，8 月宣布收攤；代幣留在鏈上，網站與圖片這些鏈下服務不再維護。[[9]](https://www.blocktrend.today/p/795) 區塊勢作者許明恩拿官方提供的封存資料，讓 AI 幫忙，從頭做了一個接續平台；他說封存檔實際只有約 15 GB。[[9]](https://www.blocktrend.today/p/795)

這幾乎就是 a16z 論點的實地測試。AI 很快重做了軟體：網站、查詢、發行流程都有了，舊紀錄查得到，也能繼續發新的活動代幣。作者自己也追問了一句：這樣真的算通過「死亡考驗」嗎？[[9]](https://www.blocktrend.today/p/795)

我的看法是，新平台發出的代幣，出自接手者自己的合約，不是原本 POAP 的合約。過去串接 POAP 的抽獎、驗證、會員工具，認的是原本那份合約，不會自動認得新代幣；願意來領取的社群，也要重新找回來。

軟體可以重做，網路只能重新累積。

<figure>
  <a href="{{ '/assets/img/technical/you-cant-vibe-code-usdc/shutdown-test.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="vibe-code-usdc" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/you-cant-vibe-code-usdc/shutdown-test-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/you-cant-vibe-code-usdc/shutdown-test.svg' | relative_url }}" alt="公司收攤後，網站入口關閉、資料要有人備份、鏈上紀錄還在，但整合與社群不會自動跟到新平台" width="1200" height="660" loading="lazy"></picture>
  </a>
  <figcaption>收攤後的四層。網站入口 AI 最容易重做；整合與社群只能重新累積。依 <a href="{{ '/technical/blur-frontend-shutdown-nft-liquidity/' | relative_url }}">Blur 關站整理</a>與 <a href="https://www.blocktrend.today/p/795">[9]</a> 整理。</figcaption>
</figure>

所以我會把 a16z 那句話改一點：區塊鏈給狀態的，是**可以帶著走、可以驗證、不怕單一公司消失**。稀缺本身，它給不了。前提是有人備份了圖片和資料，也有人願意接手。

## 同一件事的金融版：舊軟體正在變便宜 {#saas}

同一週，a16z 另一篇文章談私募股權。[[10]](https://www.a16z.news/p/is-private-equity-cooked) 它的立場是勸投資人少投收購基金、多投創投，這部分我不背書。但裡面有一段跟這篇有關。

文章說，訂閱制軟體曾是私募最愛的收購標的：收入穩定、好預測，很適合拿來借錢。[[10]](https://www.a16z.news/p/is-private-equity-cooked) 而放款給這些公司的 Golub Capital，旗下軟體業借款人的營收成長，兩年內從 9% 掉到 3% 以下。[[10]](https://www.a16z.news/p/is-private-equity-cooked)

我不會把這個數字全部算到 AI 頭上，原文也沒有這樣說。但方向是一致的：寫軟體越便宜，靠「我有一套軟體」收租的生意，就越難說服人。

## 如果是我，我會先問這三個問題 {#my-check}

不管是在做產品、導入 AI Agent，還是評估一個 Web3 專案，我會先問三個問題。

1. **拿掉介面，你還握有什麼狀態？**客戶資料、交易紀錄、信用歷史、累積多年的作品。介面明天就能被複製，這些不行。
2. **出事的時候，誰負責？**USDC 值一美元，是因為有人承諾兌付、有人稽核、有法律可以追。AI Agent 也一樣：它可以替你付款，但出錯時誰承擔，要先寫清楚。我在 [AI Agent 錢包權限]({% post_url 2026-08-07-ai-agent-wallet-permission-boundaries %})那篇談過額度、白名單與人工核准，處理的就是這一層。
3. **如果你明天消失，別人能不能接手？**資料能不能匯出、狀態能不能被別人讀到、服務能不能有人延續。POAP 能有人接手，是因為鏈上紀錄還在，官方也留下了封存。

AI Agent 開始自己付錢以後，第二題會變得更急。像 x402 這類標準，讓伺服器在收到沒付款的請求時直接回應 HTTP 402，要求對方付款後再試一次。[[12]](https://www.x402.org) 付錢的不再是人，Agent 會選哪條結算路線？它看不到畫面漂不漂亮。我想它會選最多服務願意收、出問題時有人負責的那條。我在 [〈等 AI Agent 開始自己付錢〉]({% post_url 2026-05-31-ai-agent-payments-web3 %})寫過這個方向。

我在 Blur 那篇也寫過自己被清算掉的 4 隻 MAYC。合約把狀態記得很清楚：誰借款、何時清算、抵押品歸誰，一筆不差。它只是不記得我為什麼喜歡那幾隻猿。

程式碼會越來越像水電，打開就有。抄不走的，還是那些要花時間累積、出事時有人站出來負責的東西。

---

## 參考資料

- **[1]** [a16z Frontier：When software stops being the moat](https://a16zfrontier.substack.com/p/when-software-stops-being-the-moat)（Daren Matsuoka，2026-11-04）。
- **[2]** [Wikipedia：Vibe coding](https://en.wikipedia.org/wiki/Vibe_coding)（詞源與 Karpathy 的原始定義）。
- **[3]** [ethereum.org：Smart contract composability](https://ethereum.org/developers/docs/smart-contracts/composability)（智慧合約可組合性與樂高比喻）。
- **[4]** [ethereum.org：ERC-20 Token Standard](https://ethereum.org/developers/docs/standards/tokens/erc-20)（代幣名稱與代號的標準欄位）。
- **[5]** [Circle：Transparency & Stability](https://www.circle.com/transparency)（2026-11-05 查閱；準備金組成、揭露頻率與銀行通道）。
- **[6]** [Circle：An Update on USDC and Silicon Valley Bank](https://web.archive.org/web/20230313023657/https://www.circle.com/blog/an-update-on-usdc-and-silicon-valley-bank)（2023-03，Wayback Machine 封存版；原網址已轉到部落格首頁）。
- **[7]** [CNBC：Stablecoin USDC breaks dollar peg after firm reveals it has $3.3 billion in SVB exposure](https://www.cnbc.com/2023/03/11/stablecoin-usdc-breaks-dollar-peg-after-firm-reveals-it-has-3point3-billion-in-svb-exposure.html)（2023-03-11）。
- **[8]** [The White House：Fact Sheet — President Donald J. Trump Signs GENIUS Act into Law](https://www.whitehouse.gov/fact-sheets/2025/07/fact-sheet-president-donald-j-trump-signs-genius-act-into-law)（2025-07-18）。
- **[9]** [區塊勢 #795：公司倒閉之後，POAP 還剩下什麼？](https://www.blocktrend.today/p/795)（許明恩，2026-08-11）。
- **[10]** [a16z：Is Private Equity Cooked?](https://www.a16z.news/p/is-private-equity-cooked)（Jen Kha，2026-11-04；作者為創投方，立場需一併考量）。
- **[11]** [a16z：Investment List](https://a16z.com/investment-list)（2026-11-05 查閱）。
- **[12]** [x402：internet-native payments standard](https://www.x402.org)（HTTP 402 付款流程說明）。
