---
title: "NFT 又活過來了？先看它換了什麼工作"
seo_title: "2026 NFT 新趨勢：Credits、FWA、AI Agent 身分與數位所有權"
date: 2026-09-25
published: true
categories: [technical]
tags: [web3, nft, ai-agent, digital-ownership, market-design]
layout: article
cover_image: /assets/img/linkedin/nft-new-uses-market-reality.jpg
cover_alt: "水手服品牌主角在收藏工坊組合彩色像素作品，機器人佩戴工作證，透明展示盒與鑰匙象徵收藏品、工作資格與資產控制權"
hero_image: true
use_glightbox: true
mid_cta: false
extra_css: |
  @media (max-width: 767px) {
    .back-to-top { display: none !important; }
  }
cta_context: web3
related_posts:
  - fake-world-assets-fwa-deep-dive
  - nft-token-standards
  - uniform-girls-nft-debut
description: "NFT 局部回暖，不代表整個市場重返牛市。從 Credits、FWA、OpenSea、NBA Top Shot 到 AI Agent 身分，拆解收藏需求、交易循環與可驗證的所有權。"
keywords: NFT, 2026 NFT 趨勢, Credits, Jack Butcher, FWA, TokenStrategy, OpenSea, NBA Top Shot, ERC-8004, ERC-6551, AI Agent, 數位所有權, 史旺基
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>產品變有趣，不等於市場全面復甦</strong>：短期成交回升、個別系列漲價、持有人能不能賣掉，是不同的問題。</li>
    <li><strong>NFT 不只在換圖片，也在換用途</strong>：從能重新組合的作品，到帳戶控制權、AI 工作資格，真正要看的是拿到什麼、少了誰就不能用。</li>
    <li><strong>平台與品牌正在分道走</strong>：有人擴張跨鏈入口，有人收縮市場，有人經營實體商品。不能把它們全部加總成同一個牛市故事。</li>
    <li><strong>我的判斷標準很簡單</strong>：先找付錢的人、能查驗的權利與退出方式，再看價格。把補貼拿掉後還有人需要，才值得往下研究。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">先把市場熱度，與產品變化分開</span>
      <ol class="article-toc-items">
        <li><a href="#market">同一個市場，可以七天上漲、三十天下跌</a></li>
        <li><a href="#industry">近期新聞不是一條復甦曲線</a></li>
        <li><a href="#credits">Credits：買到一張圖，也買到改變作品的選擇</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">再問 NFT 到底交付了什麼</span>
      <ol class="article-toc-items">
        <li><a href="#strategy">自動買回很漂亮，但錢從哪裡來？</a></li>
        <li><a href="#fwa">FWA：就算抽選公平，也不代表參與者會賺錢</a></li>
        <li><a href="#ownership">買到容器，不等於裡面永遠有資產</a></li>
        <li><a href="#agents">AI 戴上工作證，就能開始領薪水嗎？</a></li>
        <li><a href="#decision">如果是我，會先做哪一種 NFT？</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 同一個市場，可以七天上漲、三十天下跌 {#market}

看到 Bankless 在 9 月 24 日寫「新的 NFT 大教堂正在各處出現」，我其實有點被吸引。它談的不只是老系列地板價反彈，而是新作品、新交易機制，以及用 NFT 取得 AI 系統存取資格。這些確實比又一張漲幅排行榜有意思。[[1]](https://www.bankless.com/read/new-nft-cathedrals-are-going-up-everywhere)

但文章把幾件事接得太快了：有人做新產品，有人賺到錢，所以牛市可能已經回來。

**前兩件可以是真的，第三件仍然需要另外證明。**

我在 2021 年就把自己的制服女孩攝影做成 NFT，後來也做了 UCX／Uniform CloneX。對我來說，這不是一個可以用「圖片到底能不能右鍵存檔」就結束的題目。但走過一輪之後，我也不太想再把每個新玩法都翻譯成「這次不一樣」。

先看市場。2026 年 9 月 25 日上午查閱 CryptoSlam，全球近七天成交額是 54,824,364 美元，頁面顯示增加 52.97%；近三十天成交額則是 192,811,680 美元，顯示減少 69.13%。這是不同滾動視窗各自的比較，不是拿七天總額去跟三十天總額比。[[13]](https://www.cryptoslam.io)

<figure>
  <a href="{{ '/assets/img/technical/nft-new-uses-market-reality/market-windows.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="nft-new-uses" data-type="image">
    <img src="{{ '/assets/img/technical/nft-new-uses-market-reality/market-windows.svg' | relative_url }}" alt="CryptoSlam 近七天成交額增加 52.97%，近三十天減少 69.13%；短期回升與較長期間低迷可以同時存在" loading="lazy">
  </a>
  <figcaption>截至 2026 年 9 月 25 日上午的滾動視窗快照。成交額單位為美元，變化率沿用平台口徑；不是持有人報酬率。來源：<a href="https://www.cryptoslam.io">[13]</a>。點圖可放大。</figcaption>
</figure>

更值得留意的是，三十天的買方地址數增加 16.73%，交易筆數卻減少 67.69%。地址不等於真人，交易變多或變少也不直接等於資金淨流入。這些數據至少提醒我們：不能挑最漂亮的一個指標，替整個市場宣布春天。[[13]](https://www.cryptoslam.io)

榜單裡裝的東西也在改變。crypto.news 9 月 19 日引用的七日資料中，代幣化收藏品平台 Courtyard 以 630 萬美元成交額居系列榜首，但自身成交額仍較前期減少 0.93%；同篇也列入 Alchemix V3 Transmuter 這類金融部位 NFT。那是較早一週的快照，不能和本篇數字接成同一組即時統計。[[20]](https://crypto.news/nft-sales-fall-15-to-37-5m-as-ethereum-leads)

以前說 NFT 市場，很多人腦中是一排頭像。現在同一張榜單可能混著藝術、收藏卡和金融部位。**連商品都不同了，只看總成交額，很容易把不同需求誤認為同一種復甦。**

本文資料截點為 2026 年 9 月 25 日。行情是快照，產品機制依當日公開文件整理；以下談的是產品與風險判斷，不是買賣推薦或安全審計。

## 近期新聞不是一條復甦曲線 {#industry}

把今年的消息放在一起，我看到的比較像重新分工，而不是大家一起回到 2021 年。

### OpenSea 擴張入口，Magic Eden 收縮戰線

OpenSea 在 8 月 31 日公告支援 Solana NFT，把原本已有的 Solana 代幣交易延伸到 NFT，列出的系列包括 Mad Lads、Claynosaurz、Collector Crypt 與 Phygitals。這代表它仍在擴張跨鏈收藏入口，但「支援更多商品」不是「買家已經變多」的同義詞。[[14]](https://opensea.io/blog/articles/opensea-adds-support-for-solana-nfts)

另一邊，Cointelegraph 在 3 月 2 日報導，Magic Eden 宣布停止支援部分 EVM 與 Bitcoin 市場，重心轉向 Solana、NFT 卡包與 Dicey 博弈產品。CEO 的理由很直接：八成成本花在只產生兩成收入的產品。這是當時公布的調整計畫，不代表整個 Magic Eden 關站。[[15]](https://www.tradingview.com/news/cointelegraph:b4b9375eb094b:0-magic-eden-winds-down-evm-bitcoin-nft-markets-to-focus-on-gambling)

兩者放在一起看，比較有用的問題是：哪種服務有人付錢，平台願意繼續維護哪些入口？如果新增的收入主要來自抽卡或下注，也不能直接記成藝術收藏需求回來了。

### NBA Top Shot 繼續做產品，NFL All Day 停止新增發行

NBA Top Shot 在 8 月 18 日公布 Run It Back: Origins，結合新版手機 App、鎖定既有收藏取得購買資格，以及用既有收藏參與換購。它在嘗試讓舊收藏繼續參與新活動，而不只是不斷增加供給。[[16]](https://blog.nbatopshot.com/posts/run-it-back-origins-2026)

同樣由 Dapper Labs 經營的 NFL All Day，則在 5 月宣布不再新增發行 NFT，既有收藏仍能在市場買賣。Decrypt 5 月 14 日的報導也記錄了持有人不滿，以及消息後的交易升溫。[[19]](https://decrypt.co/367926/nfl-all-day-stops-issuing-nfts-dapper-labs-future-plans-league)

這個對照很重要。繼續交易、繼續發行、繼續投入產品，是三個不同狀態。**成交突然變熱，也可能是有人急著重新評估要不要留下。**

### Pudgy Penguins 賣玩具，不等於每位 NFT 持有人都分到錢

Pudgy Penguins 在 9 月 3 日公布的八月回顧，提到 schleich 公仔與新的 14 吋絨毛玩具；更廣的零售通路則列為下一步。這是 NFT 出身品牌往實體商品發展的具體案例。[[18]](https://www.linkedin.com/pulse/august-2026-roundup-pudgy-penguins-fpiic)

但商品推出、品牌做大、NFT 持有人獲利，中間不是等號。除非持有人確實有授權、分潤或其他可執行的權利，否則品牌的成長仍不能直接當成你那枚 NFT 的現金流。

我並不覺得這些發展令人失望。反而是各自找到生意做，比所有人一起喊地板價比較像產業。只是它們應該各自被評估，不該被湊成一張只往上的圖。

## Credits：買到一張圖，也買到改變作品的選擇 {#credits}

這次新案例裡，我最想先看的是 Jack Butcher 的 Credits。

官方網站說明，每筆符合資格的 8 美元 X Money 付款，會對應一枚 Credit。作品把交易識別碼轉成 256 位元，拆成青、洋紅、黃、黑四組 8×8 色版，再由付款時間決定顯示哪些圖層。每一枚都是完整作品。依官方設計，組裝開放後，收藏者可以燃燒 80 枚組成一件 Statement，上限為 1,526 件；9 月 25 日查閱時，網站仍顯示距離開放有八天。[[2]](https://jack.art/credits)

<figure>
  <a href="{{ '/assets/img/technical/nft-new-uses-market-reality/credits-evolution.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="nft-new-uses" data-type="image">
    <img src="{{ '/assets/img/technical/nft-new-uses-market-reality/credits-evolution.svg' | relative_url }}" alt="Credits 把付款紀錄轉為四個色版與完整作品；持有人可保留 Credit，或依規則燃燒 80 枚組成 Statement" loading="lazy">
  </a>
  <figcaption>這裡有意思的是作品如何生成，以及收藏者能做什麼選擇。圖中幾何元素為機制示意，非實際 Credits 作品；組裝依官方開放時程與規則。來源：<a href="https://jack.art/credits">[2]</a>。點圖可放大。</figcaption>
</figure>

作為創作者，我覺得這個設計比「鑄造後漲了幾倍」更值得談。

收藏者不是只拿到一份編號。他能決定保留小作品，或放棄一批小作品，換成另一種組合。作品的形式、供給與收藏者行為被接在一起，這才是單純上傳一張圖片做不到的參與方式。

但供給減少，不等於價格必然上漲。有人願意燃燒 80 枚，也不代表每個人都能用理想價格買齊、組裝，再順利找到下一位收藏者。作品機制可以成立，投資報酬仍然是另一題。

NFW 則把交易傳播與抽選放在一起。Bankless 著重介紹它的 Solana NFT 交易動態與公開看法，但官方條款描述的核心機制，是存入 NFT 與 SOL 擔保金，讓買方付費抽選，再決定留下 NFT 或接受事先備妥的買價。不能只把它當成更容易發現作品的新入口；抽選、費用與退出風險都還在。[[1]](https://www.bankless.com/read/new-nft-cathedrals-are-going-up-everywhere)[[5]](https://www.nfw.fun/terms)

Credits 改變收藏者參與作品的方式，NFW 則把社群傳播與付費抽選接在一起。兩者不該用同一個「很熱」帶過；社群上看得見的贏家，也不會自動把沒貼文的輸家帶進統計。

## 自動買回很漂亮，但錢從哪裡來？ {#strategy}

Credits 出現後，TokenWorks 很快推出 CreditStrategy。Bankless 把它放在新作品帶動新金融實驗的脈絡裡。要理解這類策略，我會先暫時把名字拿掉，直接看資金怎麼走。[[1]](https://www.bankless.com/read/new-nft-cathedrals-are-going-up-everywhere)

TokenStrategy 的 NFT Strategies 文件列出一套通用設計：代幣買賣收取交易額的 10% 作為費用，分配為交易額的 8% 用來買入對應系列 NFT、1% 用來買回並銷毀生態代幣 PNKSTR、另 1% 給對應 NFT 系列的合約擁有人。買到 NFT 後，策略會以更高價格掛售；文件以加價 20% 說明，並註明可依策略調整。賣出 NFT 的收入，再用來買回並銷毀該策略代幣。[[3]](https://docs.tokenstrategy.com/strategy-types/nft-strategies)

這是通用文件，不是每一支策略在每一個區塊都使用相同參數的保證。

<figure>
  <a href="{{ '/assets/img/technical/nft-new-uses-market-reality/strategy-cashflow.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="nft-new-uses" data-type="image">
    <img src="{{ '/assets/img/technical/nft-new-uses-market-reality/strategy-cashflow.svg' | relative_url }}" alt="策略代幣交易產生費用，部分費用買入 NFT；NFT 必須另有買方承接，才有出售收入用於回購銷毀策略代幣" loading="lazy">
  </a>
  <figcaption>資金來自交易費與 NFT 的下一位買家，不是合約憑空創造收益。不同策略的費率與掛價須分別查驗。來源：<a href="https://docs.tokenstrategy.com/strategy-types/nft-strategies">[3]</a>。點圖可放大。</figcaption>
</figure>

機制並不難懂。比較容易被忽略的是：**自動化可以把交易規則寫進程式，卻不能保證成交，更不能替你找到願意付錢的下一位買家。**

如果策略代幣交易變少，買 NFT 的預算就會縮小；如果 NFT 掛出去沒人接，回購資金也不會照預期出現。而且持有策略代幣，不代表天然就擁有按比例領回庫存 NFT 的權利。要看合約到底給了什麼，而不是把它自行想像成基金。

Standard Reserve 也值得放在這裡看。它把章程 NFT 設計成取得「banker」角色與發行分配的席位。但白皮書最後寫得很清楚：它不是銀行，不提供銀行帳戶，儲備資產屬於協議，也不能由參與者贖回。[[8]](https://www.standardreserve.xyz/whitepaper)

名字裡有 Reserve、Banker 或 Yield，不會讓代幣發行自動變成外部營收。對我來說，最重要的不是畫出多漂亮的循環，而是能不能回答：如果沒有人繼續進來交易，這個循環還靠誰付錢？

## FWA：就算抽選公平，也不代表參與者會賺錢 {#fwa}

我先前寫過 [FWA 的 NFT 扭蛋機制]({{ '/technical/fake-world-assets-fwa-deep-dive/' | relative_url }})。這次看到 V2，更應該把版本和參數分開，不能直接拿舊文的比例套用。

FWA 主池的基本單位，是 NFT 加上一筆 ETH 擔保金。依現行文件，擔保金越少，抽選權重越高；這個權重反映的是承諾鎖入的 ETH，不是對 NFT 市價的鑑價。付款報價則以抽中部位的預期擔保金為基礎，再加上相關費用。[[6]](https://www.fwa.fun/docs/prizes-odds)[[7]](https://www.fwa.fun/docs/pricing-draw)

這裡至少有三件事不能混在一起。

第一，Chainlink VRF 提供可驗證的隨機數，不代表每一種參與方式都有正期望報酬。抽選是否依規則執行，與付出的價格是否划算，是不同的問題。官方定價文件也明言，計算結果不保證 NFT 轉售價或可接受的買回報價，足以補回取得成本。[[7]](https://www.fwa.fun/docs/pricing-draw)

第二，中獎後不能同時抱走 NFT 和它背後的 ETH。你可以保留 NFT，或接受事先備妥的買價；走哪條路，資產的歸屬就不同。[[4]](https://www.fwa.fun/docs/winning)

第三，領 ETH 和改領 FWA 代幣，也不是同一種風險。V2 文件的來源預設與部署設定列出：領 ETH 為擔保金的 90%；改領 FWA 則用 92.5% 擔保金去買代幣。後者是買幣預算，不是保證你最後能賣回同額 ETH。管理者可在文件列明的條件下，於 80% 至 95% 範圍調整各自比例；而且結算時才讀取比例，抽中時並沒有鎖定。[[4]](https://www.fwa.fun/docs/winning)

看到「花很少抽到 CryptoPunk」當然會心動。但我更想看完整獎池、所有結果、費用與退出成交，而不是把其中一次漂亮的結果當成模型。

我不否認這是有創意的市場設計。只是它把流動性、抽選、補貼與退出報價組在一起，複雜度變高了，查核也不能只剩「合約是公開的」。

## 買到容器，不等於裡面永遠有資產 {#ownership}

如果說前面是在改變「怎麼交易」，ERC-6551 代表的則是另一條路：讓 NFT 關聯一個能持有資產、執行操作的智慧合約帳戶。你可以把它想成一把控制收藏櫃的鑰匙。[[12]](https://eips.ethereum.org/EIPS/eip-6551)

但標準不是替每枚 NFT 自動發一個唯一錢包。同一枚 NFT 可以因不同實作與設定關聯多個帳戶，實際控制權也必須看帳戶的授權邏輯。截至本文查閱時，ERC-6551 的狀態仍為 Review，不是 Final。[[12]](https://eips.ethereum.org/EIPS/eip-6551)

StonkBrokers 是一個具體案例。官方說明，每枚 Broker 有綁定帳戶，鑄造時放入代幣化股票；持有人可以把資產提出。要繼續取得專案獎勵，另須支付啟用費，而且轉讓會清除啟用狀態，新主人必須重新啟用。網站也明確區分，這些獎勵是專案的行銷獎勵，不是上市公司的股利。[[9]](https://stonkbrokers.io/home)

所以你在二級市場買到一枚 Broker，不能只看「鑄造時曾經有股票」的介紹，就假定現在裡面仍有一樣的東西。

**你買的是鑰匙，不是掛單截圖。**

ERC-6551 的安全章節甚至直接描述這類風險：賣方先把資產放進帳戶吸引報價，再提出資產並接受買方報價。防止這種詐欺，不是標準本身的保證。若買賣的重點在帳戶內資產，就要有可靠的鎖定方式，或讓成交條件在交易執行時檢查資產與數量，而不是只在點按鈕前看一次餘額。[[12]](https://eips.ethereum.org/EIPS/eip-6551)

<figure>
  <a href="{{ '/assets/img/technical/nft-new-uses-market-reality/ownership-layers.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="nft-new-uses" data-type="image">
    <img src="{{ '/assets/img/technical/nft-new-uses-market-reality/ownership-layers.svg' | relative_url }}" alt="NFT 的持有紀錄、可以控制的帳戶或檔案，以及合約承諾的權利，必須分三層查驗，不能由鏈上持有推論永久保存或分潤" loading="lazy">
  </a>
  <figcaption>這是本文整理的查核框架：鏈上持有、技術控制與契約權利不能互相代替。參照 ERC-6551、StonkBrokers 與 Top Shot 的文件：<a href="https://eips.ethereum.org/EIPS/eip-6551">[12]</a>、<a href="https://stonkbrokers.io/home">[9]</a>、<a href="https://blog.nbatopshot.com/posts/authentic-permanent">[17]</a>。點圖可放大。</figcaption>
</figure>

同一個邏輯，也適用於作品保存。NBA Top Shot 在 6 月 8 日宣布，把影片、縮圖與相關資料搬到 IPFS，讓收藏者不必完全依賴單一網站就能核對與取得內容。這比只宣稱「你永久擁有」更具體。[[17]](https://blog.nbatopshot.com/posts/authentic-permanent)

但官方技術說明也留下重要界線：當時把檔案識別碼直接寫入 Flow 鏈上資料的工作仍在進行；IPFS 上的檔案，也至少需要有節點持續保存並提供。不能因此寫成「所有影片都在鏈上，而且永遠不會消失」。[[17]](https://blog.nbatopshot.com/posts/authentic-permanent)

對創作者來說，我會把這看成很實際的功課：所有權紀錄、作品本身、使用授權與保存責任，應該各自說清楚。代幣化實體收藏品也是如此，還要再問保管人、提領條件與法律上的請求權。鏈上查得到，不代表鏈外承諾就會自己履行。

## AI 戴上工作證，就能開始領薪水嗎？ {#agents}

這是我最想繼續研究、也最不想太快樂觀的方向。

identity.md 的 IMD 把 NFT 用在 AI worker 的工作資格。公開 README 說明，一枚 NFT 授權一台啟用中的設備，工作透過持有人自己登入的 Claude Code 或 Codex 執行，會消耗自己的帳號額度；連上工作系統前，還需要 ERC-8004 登記。[[10]](https://raw.githubusercontent.com/Identity-md/worker/main/README.md)

它不是「NFT 裡面住了一個免費 AI」。更接近你取得一個席位，再提供機器、模型使用額度與運作成本，參與外部派工。

這也讓風險從價格，延伸到執行環境。專案 README 建議使用獨立伺服器、避開私人檔案與憑證，並註明公開套件不包含後端原始碼。**有公開 worker，不等於派工、評分與結算的整個系統都已公開。**[[10]](https://raw.githubusercontent.com/Identity-md/worker/main/README.md)

工作資格不等於有案可接，更不代表收入足以支付模型與伺服器成本。

我會先問：任務從誰那裡來？誰付錢？誰認定成果合格？失敗任務的成本誰吸收？NFT 轉手後，舊設備的存取資格會不會立即失效？模型供應商的條款是否允許這種用途？

這些都比地板價漲到多少，更接近一個可持續的生意。

### ERC-8004 登記的是身分，不是可靠保證

ERC-8004 的設計，把代理身分、回饋聲譽與外部驗證分開。身分以 ERC-721 表示，可以指向代理服務與相關資料；回饋和驗證結果則提供判斷材料。截至本文查閱時，它仍是 Draft。規格也明確寫出，付款不在這個協議的範圍內。[[11]](https://eips.ethereum.org/EIPS/eip-8004)

用白話說：有名牌，不代表會做事；有履歷，不代表每次都做對；有收款地址，也不代表一定有人付錢。

身分能轉讓，還帶來另一個問題：過去累積的好評，是不是仍然對應現在的操作者、模型與服務？ERC-8004 規定，轉讓時要清除原本的收款錢包欄位，讓新持有人重新驗證；但這不會替你交接伺服器、網域、訂閱帳號，或撤銷所有鏈外存取權。[[11]](https://eips.ethereum.org/EIPS/eip-8004)

所以我不會把 IMD 的「一枚 NFT、一台設備」寫成 ERC-8004 的通用規則，也不會把 ERC-8004 登記當成通過安全審查。前者是專案政策，後者是身分與信任訊號的規格。兩者各有用途，也各有做不到的事。[[10]](https://raw.githubusercontent.com/Identity-md/worker/main/README.md)[[11]](https://eips.ethereum.org/EIPS/eip-8004)

這條路真正值得期待的，是不同服務之間能否查驗身分、理解履歷、追查責任。而不是替每個 AI Agent 發一枚 NFT，就宣告代理經濟已經成立。

## 如果是我，會先做哪一種 NFT？ {#decision}

把這些案例看完，我反而不會先問要不要發幣。

如果是攝影與創作專案，我會先定義：收藏者買到的是作品版本、實體輸出、參與資格，還是某種授權？圖片由誰保存？創作者不再維護網站時，收藏者還拿得到什麼？Credits 對我的啟發，是把收藏者的選擇寫進作品，而不是替價格寫一段漂亮的故事。

如果是 AI Agent 服務，我會先把任務來源、驗收、成本、付款與故障責任做清楚。只有當「身分需要跨平台查驗」或「控制權真的需要轉手」時，才考慮 NFT。若只是我的網站辨識自己的會員，一般帳號往往更便宜，也更容易處理遺失與申訴。

如果有人拿一個 NFT 提案來找我，我會先問這五個問題：

1. **不看價格，它讓誰多做了什麼？** 收藏、使用、授權、接案，至少要有一個具體答案。
2. **拿掉獎勵與新買家之後，還有誰付錢？** 把服務收入、交易費、代幣發行與資產出售分開算。
3. **權利在哪裡，誰有能力改？** 分清鏈上紀錄、帳戶授權、管理者權限，以及鏈外契約。
4. **要離開時，實際拿得回什麼？** 查成交深度、費用、贖回或提領條件；不要只看最低掛售價。
5. **平台停止服務後，還剩什麼？** 能否取得作品、控制資產、撤銷設備與追查責任，比「永續」兩個字有用。

NFT 最近確實變得更有意思了。我願意繼續看，也願意做小規模的創作與技術驗證。

但如果要我選一個比較值得追的方向，我會選「它讓人真正擁有了什麼」，而不是「它又漲了多少」。

價格可以替一個故事製造聲量。故事退場以後，還能拿來用的部分，才值得留下。

## 參考資料

- **[1]** [Bankless：New NFT Cathedrals Are Going Up Everywhere](https://www.bankless.com/read/new-nft-cathedrals-are-going-up-everywhere)（2026-09-24；原作者揭露持有並使用 FWA）。
- **[2]** [Jack Butcher：Credits 作品與組裝設計](https://jack.art/credits)。
- **[3]** [TokenStrategy：NFT Strategies 通用機制](https://docs.tokenstrategy.com/strategy-types/nft-strategies)。
- **[4]** [FWA：Settlement，V2 結算選項與可調比例](https://www.fwa.fun/docs/winning)。
- **[5]** [NFW：使用條款與非託管協議說明](https://www.nfw.fun/terms)。
- **[6]** [FWA：Positions & weighting，擔保金與抽選權重](https://www.fwa.fun/docs/prizes-odds)。
- **[7]** [FWA：Pricing & allocation，價格、隨機數與退款](https://www.fwa.fun/docs/pricing-draw)。
- **[8]** [Standard Reserve：白皮書與風險聲明](https://www.standardreserve.xyz/whitepaper)。
- **[9]** [StonkBrokers：帳戶、提領、啟用與獎勵機制](https://stonkbrokers.io/home)。
- **[10]** [IdentityMD Worker：公開執行端說明](https://raw.githubusercontent.com/Identity-md/worker/main/README.md)（主分支內容會更新）。
- **[11]** [ERC-8004：Trustless Agents](https://eips.ethereum.org/EIPS/eip-8004)（查閱時狀態為 Draft）。
- **[12]** [ERC-6551：Non-fungible Token Bound Accounts](https://eips.ethereum.org/EIPS/eip-6551)（查閱時狀態為 Review）。
- **[13]** [CryptoSlam：NFT 全球市場資料](https://www.cryptoslam.io)（2026-09-25 台北時間 07:47–07:51 查閱，為滾動視窗快照）。
- **[14]** [OpenSea：Adds Support for Solana NFTs](https://opensea.io/blog/articles/opensea-adds-support-for-solana-nfts)（2026-08-31）。
- **[15]** [Cointelegraph／TradingView：Magic Eden 收縮部分 NFT 市場、轉向博弈產品](https://www.tradingview.com/news/cointelegraph:b4b9375eb094b:0-magic-eden-winds-down-evm-bitcoin-nft-markets-to-focus-on-gambling)（2026-03-02）。
- **[16]** [NBA Top Shot：Run It Back: Origins](https://blog.nbatopshot.com/posts/run-it-back-origins-2026)（2026-08-18 公布，8 月 26 日更新）。
- **[17]** [NBA Top Shot：Every Moment Video Is Now Independently Verifiable](https://blog.nbatopshot.com/posts/authentic-permanent)（2026-06-08）。
- **[18]** [Pudgy Penguins：August 2026 Roundup](https://www.linkedin.com/pulse/august-2026-roundup-pudgy-penguins-fpiic)（2026-09-03）。
- **[19]** [Decrypt：NFL All Day Stops Issuing NFTs](https://decrypt.co/367926/nfl-all-day-stops-issuing-nfts-dapper-labs-future-plans-league)（2026-05-14）。
- **[20]** [crypto.news：NFT sales fall 15% to $37.5M as Ethereum leads](https://crypto.news/nft-sales-fall-15-to-37-5m-as-ethereum-leads)（2026-09-19；引用較早七日視窗，不與本篇即時快照合併）。
