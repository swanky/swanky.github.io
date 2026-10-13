---
title: "Blur 要關站了：把 NFT 變得更好交易，然後呢？"
seo_title: "Blur 關閉網站、Blend 停止新貸款：NFT 流動性與 4 隻 MAYC 的教訓"
date: 2026-10-13
published: true
categories: [technical]
tags: [nft, blur, blend, web3, lending]
layout: article
cover_image: /assets/img/linkedin/blur-frontend-shutdown-nft-liquidity.jpg
cover_alt: "AI 情境插畫：史旺姬拿著 NFT 頭像，身旁展示猿猴、企鵝與像素收藏，輸送帶通往逐漸關閉的交易入口"
hero_image: true
use_glightbox: true
mid_cta: false
cta_context: web3
related_posts:
  - nft-new-uses-market-reality
  - nft-token-standards
  - ucx-uniform-clonex-origin
description: "從 Blur 關站、4 隻變異猿 NFT 的清算經驗，到 Abstract、Blast 退場與 OpenSea 轉向，看懂資金效率為何沒換來長期需求。"
keywords: Blur 關站, Blur 前端關閉, Blend, NFT 借貸, MAYC, 清算, 地板價, Abstract, Blast, Lisk, OpenSea, 史旺基
---

把 NFT 賣得更快、借出更多錢，為什麼最後沒有讓更多人想留下來？

Blur 要停用官方網站了。這個消息讓我想到的，不只是又一個平台退場，而是 NFT 曾經很用力追求的一件事：**把每件不一樣的收藏品，變成可以快速報價、快速周轉的資產。**

我也是那段歷史的參與者。我曾把 **4 隻「變異猿」NFT 拿去抵押借錢，後來遭到清算，失去了這 4 件收藏。**這個猿猴頭像系列叫 MAYC，全名是 Mutant Ape Yacht Club；每一隻都是有獨立編號的數位收藏品。

所謂「清算」，就是抵押品依借貸規則被取走，用來處理債務。對我來說，這不只是畫面上的價格下跌，而是原本持有的那 4 隻，真的不再屬於我。談 Blur 的資金效率，我沒辦法只看產品介紹上漂亮的那一面。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>關掉的是入口，並非抹掉鏈上協議</strong>：依公告報導，Blur 官方網站與 Blend 新貸款撮合將於 2026 年 11 月 12 日停止；既有借款需要處理。</li>
    <li><strong>Blur 的歷史地位不能只用退場概括</strong>：它把專業交易、代幣獎勵與 NFT 借貸接在一起，推高了投機的周轉速度。</li>
    <li><strong>借得更有效率，不等於比較安全</strong>：Blend 沒有固定到期日，但貸方退出時，接續借款失敗仍可能失去 NFT。</li>
    <li><strong>這波退場已經延伸到基礎設施</strong>：Abstract、Blast 準備停止鏈的營運，Blur 關閉網站，OpenSea 則擴張商品。不同選擇，都得回答長期需求在哪裡。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">從交易加速，到借貸的代價</span>
      <ol class="article-toc-items">
        <li><a href="#shutdown">Blur 到底關掉什麼？</a></li>
        <li><a href="#history">它讓 NFT 變得更像交易市場</a></li>
        <li><a href="#floor">不一樣的收藏，為什麼只剩一個價格？</a></li>
        <li><a href="#blend">Blend 的效率，與我的 4 隻 MAYC</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">平台退場以後，需求在哪裡？</span>
      <ol class="article-toc-items">
        <li><a href="#retreat">不只 Blur：Abstract、Blast 與這波退場潮</a></li>
        <li><a href="#huddle">有人退場，也有人一口氣買下 117 隻企鵝</a></li>
        <li><a href="#opensea">OpenSea 換方向，熱潮卻沒有跟著回來</a></li>
        <li><a href="#decision">留下來之前，我會先問的三件事</a></li>
      </ol>
    </li>
  </ol>
</nav>

## Blur 到底關掉什麼？ {#shutdown}

依 The Block 於美東時間 2026 年 10 月 12 日的報導，Blur 宣布將在 **11 月 12 日停用 blur.io 網站入口**，Blend 同日停止撮合新貸款。公告也要求借款人在此前還款，否則讓貸款進入違約，並表示之後會提供資產提取工具。[[1]](https://www.theblock.co/news/ecosystems/2026-10-12-blur-nft-marketplace-shutting-down-frontend-blend-418363)

「前端」就是平常打開瀏覽器後，用來看收藏、出價與操作的畫面。這次停掉它，不等於把以太坊上的交易合約刪除。報導轉述，Blur 市場協議仍在鏈上運行，BLUR 仍保留控制交易費用開關的治理角色。[[1]](https://www.theblock.co/news/ecosystems/2026-10-12-blur-nft-marketplace-shutting-down-frontend-blend-418363)

<figure>
  <a href="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/exit-layers.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="blur-liquidity" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/exit-layers-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/exit-layers.svg' | relative_url }}" alt="11 月 12 日停止網站入口與新貸款撮合；鏈上交易協議保留，借款需處理，提取工具待提供" width="1200" height="605" loading="lazy"></picture>
  </a>
  <figcaption>網站、撮合服務與鏈上協議是不同層。依報導整理的預定安排，截至 2026 年 10 月 13 日；不是提取工具已上線的保證。來源：<a href="https://www.theblock.co/news/ecosystems/2026-10-12-blur-nft-marketplace-shutting-down-frontend-blend-418363">[1]</a>。</figcaption>
</figure>

對一般使用者，差別仍然很大。**合約還在，不等於原本那個好用的產品還在。**誰整理掛單、誰找到對手、誰維護操作介面，都是另一層工作。不能因為底層程式仍可執行，就假設會有人接手原本的服務。

治理權也是如此。基金會文件確實列出社群可設定市場與借貸協議費率的權限，但「能決定是否收費」和「有足夠交易可以收費」是兩件事。[[2]](https://docs.blur.foundation/governance.md)

本文資料截點為 2026 年 10 月 13 日。關站消息已比對 The Block 與 CoinDesk 的報導；原始 X 公告在本次查閱時無法直接讀取，因此時程以媒體轉述標示，不假裝是親自讀到原文。[[1]](https://www.theblock.co/news/ecosystems/2026-10-12-blur-nft-marketplace-shutting-down-frontend-blend-418363)[[3]](https://www.coindesk.com/tech/2026/10/13/once-largest-ethereum-nft-marketplace-blur-is-shutting-down-after-volumes-collapse-99)

## 它讓 NFT 變得更像交易市場 {#history}

我認為 Blur 在 NFT 歷史上有很重要的位置。它把投機的熱度推到另一個高度，靠的不只是多開一家賣圖的網站，而是讓「買進、賣出、再買進」這件事更有效率。

Blur 自己的首頁就很直接：定位是專業交易者的市場，主打批次買進、投資組合分析、零市場手續費，以及掛單與出價獎勵。這些是平台的產品定位與宣傳，不能直接當成使用者獲利的證據。[[4]](https://blur.io/)

從收藏者角度，問題可能是「我喜歡哪一隻？」；從交易者角度，問題容易變成「哪裡有價差、多少量可以成交、這樣操作能拿多少獎勵？」這是我對它的解讀：**工具沒有強迫所有人投機，但會讓某些行為特別省力、特別值得反覆做。**

規模確實一度很大。The Block 引用其資料指出，Blur 月成交額在 2023 年 3 月約為 **14.3 億美元**，到 2026 年 3 月降到 **不足 700 萬美元**。這是同平台兩個月份的美元成交額，不是 NFT 全市場市值，也不是每位收藏者的損益。[[1]](https://www.theblock.co/news/ecosystems/2026-10-12-blur-nft-marketplace-shutting-down-frontend-blend-418363)

我不打算拿這兩個點畫一條假裝完整的三年走勢。但它們已足以提出一個問題：當最方便交易的地方也留不住成交，瓶頸恐怕不只在按鈕夠不夠快。

## 不一樣的收藏，為什麼只剩一個價格？ {#floor}

我能理解很多 NFT 愛好者對這類交易方式的厭惡。原本在意的是角色、特徵、社群與故事，後來看起來卻像把整個系列塞進同一個價格區間，拿來快速交換。

但這裡要說精確一點：**NFT 並沒有因此在技術上變成同質化代幣，也不是全部強制按地板價成交。**地板價通常指一個系列目前最低的掛售價格；有人想賣這個價，不等於有人願意立刻買。

Blur 的系列頁面把「最低掛售價」與「最高買方出價」分開顯示，也列出每件作品的售價、上次成交與買方報價。光是這個排列，就提醒我們它們不是同一個數字。[[5]](https://blur.io/collection/vv-checks)

<figure>
  <a href="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/three-prices.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="blur-liquidity" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/three-prices-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/three-prices.svg' | relative_url }}" alt="地板價是最低掛售，買方出價才表示有人願意買；收藏者對特徵與故事的估值又是另一件事" width="1200" height="605" loading="lazy"></picture>
  </a>
  <figcaption>這是概念比較，沒有填入即時行情。最低賣價、買方報價與個人收藏價值，不能互相代換。</figcaption>
</figure>

例如，同系列裡一隻有你喜歡的衣服，另一隻只有普通特徵。你願意多付錢買前者；只想買到該系列的交易者，可能覺得兩隻都能接受。**同一筆流動性，對他是方便，對你卻可能是差異被忽略。**

這也是「拿地板價來 swap」這種直覺描述想指出的文化衝突。不過，本文談的是系列報價與批次交易帶來的可替代感，不把 Blur 寫成把所有 NFT 存進同一個資金池、自動按單一價格兌換的機制。

版稅又是另一條衝突。創作者希望轉售仍能支持後續創作，交易者則可能把每次扣款當成周轉成本。也不能一口氣說所有 NFT 版稅都已消失：OpenSea 在 2024 年就公布支援符合 ERC721-C 條件的合約執行創作者收益，適用範圍取決於合約與市場相容性。[[6]](https://opensea.io/blog/articles/creator-earnings-erc721-c-compatibility-on-opensea)

我的判斷是，交易效率與創作收入需要各自成立的設計。交易次數再漂亮，也不能直接當成創作者被支持的證據。

## Blend 的效率，與我的 4 隻 MAYC {#blend}

在 BendDAO、ParaSpace 之外，Blend 當年提供了另一種 NFT 借貸選擇。對持有人而言，吸引力很好理解：不先賣掉 NFT，也能把一部分價值拿出來使用。至於是不是「更有效率」，還是要看借到多少、付多少利息，以及要承擔什麼退出條件，不能只看最高可借金額。

Paradigm 在 2023 年 5 月 1 日發表的設計，採用逐筆配對借款人與貸方的方式。核心不依賴外部餵價服務，也沒有固定到期日；金額與利率由願意放款的人報價決定。[[7]](https://www.paradigm.xyz/writing/blend)

**關鍵在貸方想退出的那一刻。**貸方可以啟動接續借款的競價，利率逐步提高，尋找願意接手的人。若沒有接手者、借款人也未還款，便可能被清算，由原貸方取得抵押品。這不是「地板價碰到一條線，系統立刻賣出」的同一種設計。[[7]](https://www.paradigm.xyz/writing/blend)

<figure>
  <a href="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/blend-exit.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="blur-liquidity" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/blend-exit-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/blend-exit.svg' | relative_url }}" alt="貸方要求退出後，借款人可還款；有新貸方則接續借款，競價失敗且未還款則可能失去抵押品" width="1200" height="730" loading="lazy"></picture>
  </a>
  <figcaption>依 Blend 原始設計簡化。這是一般機制圖，不是我的四筆清算交易重建，也不是本次停止服務後的操作指南。來源：<a href="https://www.paradigm.xyz/writing/blend">[7]</a>。</figcaption>
</figure>

所以，無固定到期日的方便，附帶的是對「有人願意繼續借你」的依賴。當大家都想收回資金，即使你仍喜歡那隻 NFT，也不能用喜歡代替還款。

我曾經被清算掉 4 隻 MAYC。這是我自己的經驗，不能拿四隻的結果，推導出每個借款人都會失敗。

它讓這個題目對我很具體：**你可以同時是收藏者與借款人，但貸款到需要處理的時候，合約不會替你保留收藏者的理由。**

借貸本身有用途。它能讓不想出售資產的人暫時取得資金，這個需求沒有因為市場退潮就消失。問題是，如果取得的資金又拿去買更多同樣容易一起跌價的 NFT，原本的收藏風險就加上了債務壓力。

## 不只 Blur：Abstract、Blast 與這波退場潮 {#retreat}

最近確實有一種「怎麼又關一家」的感覺。把消息排開來看，這個感覺有具體事件支撐：**10 月 2 日 Blast 宣布收尾，10 月 6 日輪到 Abstract，10 月 12 日則是 Blur 的網站與借貸服務。**不過，這些公告談的是服務與網路退場，不能直接全部寫成公司破產。[[9]](https://www.theblock.co/news/ecosystems/2026-10-06-abstract-ethereum-layer-2-shutting-down-pudgy-penguins-igloo-417855)[[11]](https://www.theblock.co/news/business/2026-10-02-blast-ethereum-layer-2-shutting-down-417583)[[1]](https://www.theblock.co/news/ecosystems/2026-10-12-blur-nft-marketplace-shutting-down-frontend-blend-418363)

### 企鵝能成為品牌，不代表養得起一條鏈

Abstract 是 Pudgy Penguins「胖企鵝」母公司 Igloo 支持的以太坊第二層網路，通常簡稱 L2。可以把它理解成替以太坊分擔交易的另一套系統，讓應用程式以較低成本運作；但這套系統本身，仍然有人員與維運支出。

依 The Block 10 月 6 日的報導，Abstract 預定 **12 月 15 日停止鏈的營運**。團隊列出的困難包括成長停滯、交易資金不足，以及金融應用與機構採用有限。Igloo 執行長 Luca Netz 表示，公司已投入約 18 個月、承受數千萬美元損失，接下來會把資源轉回 Pudgy Penguins 與 PENGU。這些損失與理由是團隊說法，不是本文查核過的財報。[[9]](https://www.theblock.co/news/ecosystems/2026-10-06-abstract-ethereum-layer-2-shutting-down-pudgy-penguins-igloo-417855)

Abstract 10 月 6 日更新的官方服務條款，也已加入停止營運與資產遷移安排，並提醒退出期限、可用路徑與處理步驟可能調整。**不能把 Blur 的「底層協議仍在」，直接套用成 Abstract 關閉後也能照常操作。**[[10]](https://abs.xyz/terms-of-service)

這件事值得看的，是品牌與基礎設施之間的落差。有人喜歡企鵝、買企鵝商品，不代表每天都需要在企鵝支持的鏈上交易。**IP 能帶來注意力，鏈要活下來卻需要持續使用。**這是我的判斷，不是對 Pudgy Penguins 整個品牌宣告失敗。

### Blast 更直接：維運支出高過收入

同樣由 Blur 創辦人 Pacman 推動的 Blast，10 月 2 日公布的理由更直接：維持網路的成本高過收入，看不到可持續的經營路徑。報導所列的 **10 月 26 日，是一般網站提取入口的截止日**；之後需要直接透過以太坊上的橋接合約處理，不能誤寫成那一天所有資產都自動消失。[[11]](https://www.theblock.co/news/business/2026-10-02-blast-ethereum-layer-2-shutting-down-417583)[[1]](https://www.theblock.co/news/ecosystems/2026-10-12-blur-nft-marketplace-shutting-down-frontend-blend-418363)

本次查閱時，Blast 官方網站已顯示正在結束營運，要求使用者把資產移回以太坊，並提示提取約需一天。這也提醒我們：退出不是按一下就全部完成的事。[[12]](https://blast.io/en/bridge)

### 再往外看，連 Lisk 也在收鏈、換生意

這個現象不只出現在 NFT 圈。Lisk 在 2026 年 8 月的官方文章宣布，**Lisk Chain 將於 10 月 31 日關閉**，協助原有應用轉往 Celo；Lisk 自己則轉向企業財務作業平台，處理帳戶、付款、核准流程與法幣／穩定幣資金。[[13]](https://lisk.com/blog/posts/introducing-the-new-lisk/)

這是值得和 OpenSea 放在一起看的國際趨勢：有些團隊放棄繼續經營一整條鏈，有些市場擴大交易商品，轉去找較具體的使用需求。它們沒有採取相同策略，也不能被合併成「全部倒閉」一個數字。

<figure>
  <a href="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/retreat-deadlines.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="blur-liquidity" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/retreat-deadlines-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/blur-frontend-shutdown-nft-liquidity/retreat-deadlines.svg' | relative_url }}" alt="Blast 的 10 月 26 日是網站提取入口期限，Lisk 的 10 月 31 日與 Abstract 的 12 月 15 日是停鏈安排，Blur 則於 11 月 12 日停網站與新貸款撮合" width="1200" height="730" loading="lazy"></picture>
  </a>
  <figcaption>截至 2026 年 10 月 13 日的預定安排，依期限排序；不是四家公司的破產日期，也不是完整退場名單。個別服務可能有更早的操作期限，仍須核對後續公告。來源：<a href="https://www.theblock.co/news/business/2026-10-02-blast-ethereum-layer-2-shutting-down-417583">[11]</a>、<a href="https://lisk.com/blog/posts/introducing-the-new-lisk/">[13]</a>、<a href="https://www.theblock.co/news/ecosystems/2026-10-12-blur-nft-marketplace-shutting-down-frontend-blend-418363">[1]</a>、<a href="https://www.theblock.co/news/ecosystems/2026-10-06-abstract-ethereum-layer-2-shutting-down-pudgy-penguins-igloo-417855">[9]</a>。</figcaption>
</figure>

### 我看到的共同問題：熱鬧的數字，誰來付帳？

這幾個案例還不足以算出整個產業的倒閉率，也沒有證據證明它們全由同一個原因造成。但它們讓我更在意三個原本容易混在一起的指標：**轉進來多少資金、發生多少交易，以及營運者最後收得到多少收入。**

資金進來等待獎勵，不等於願意長期付費；應用程式有生意，也不表示底下的鏈能收到足以維持服務的費用。把它接回 Blur，問題其實很熟悉：讓資產跑得更快，和讓一門生意持續有人付錢，中間還有很長一段路。

所以，我會把眼前這一波稱為**退場與收縮潮**。最值得警覺的，不只是收藏品又跌了多少，而是當年圍繞收藏品蓋起來的市場、借貸與交易網路，也開始重新計算自己能不能繼續運作。

## 有人退場，也有人一口氣買下 117 隻企鵝 {#huddle}

把文章寫到這裡，很容易給人一種印象：所有人都在離開。但同一段時間，也有人往反方向走。

廢金屬回收業企業家、NFT 收藏者 **Adam Weitsman** 在台灣時間 10 月 12 日的貼文表示，自己週末在鏈上買了 **117 隻 Pudgy Penguins**，想在困難時刻支持喜歡的收藏系列，替這個他已經喜愛的社群帶來信心。他也提到，這個老牌專案帶給許多人快樂，並呼籲大家回到 Pudgy Penguins。[[14]](https://x.com/AdamWeitsman/status/2109414248711381383)[[15]](https://www.ccn.com/news/crypto/adam-weitsman-buys-117-pudgy-penguins-nft-sales/)

這裡的 117 隻是**他本人公布的購買數量**。貼文沒有列出總支出與完整交易清單，本文也沒有逐筆核對他的錢包，因此不把它寫成獨立完成的鏈上查帳結果。[[14]](https://x.com/AdamWeitsman/status/2109414248711381383)

我認為這種支持有意義。社群與角色能讓一個人願意在壞消息出現時繼續收藏，至少說明價格之外，仍然有人在意這個專案。**一條鏈養不下去，與一群人仍然喜歡企鵝，可以同時成立。**

但一個人買 117 隻，和 117 位新收藏者各買一隻，是很不一樣的市場。前者能帶來成交與信心，後者才比較接近參與者正在擴大的證據；兩者都還需要看後續是否留下來。這是我看待這則消息的角度，不是對他的買進動機作額外推測。

所以，我會把這則貼文當成**仍有人願意支持收藏與社群的具體例子**，不會把它升級成「NFT 牛市回來了」。要判斷後者，還得看不同買家是否持續增加、需求能否維持，以及拿掉獎勵後還剩多少交易理由。

平台算的是能不能繼續營運，收藏者可以為自己喜歡的事物付錢。理解這個差別，才不會看到停鏈就說企鵝完了，看到大戶買進又立刻說全市場得救了。

## OpenSea 換方向，熱潮卻沒有跟著回來 {#opensea}

Blur 收縮的同時，OpenSea 已把方向拉到 NFT 之外。2025 年 5 月的 OS2 正式版公告，把跨 19 條鏈的代幣交易與新的獎勵機制一起推出。這足以說明它在擴張商品範圍，卻不能說成「已經放棄 NFT」。[[8]](https://opensea.io/blog/articles/opensea-announces-os2-is-now-out-of-beta-token-trading-fully-live-across-19-chains-new-rewards-program-launches-and-community-hub-revamped)

一個縮小服務，一個擴大市場。我的看法是，兩者都在重新回答平台要靠什麼留下使用者。

但從收藏者的體感來說，NFT 那種熱潮並沒有因此回來。今天看盤，我看到關注的 NFT 地板價又大跌。這裡保留的是我的當日觀察：沒有把它寫成所有系列都同幅下跌，也不把跌勢全部歸因於 Blur 的公告。

這和我先前寫的〈[NFT 又活過來了？先看它換了什麼工作]({{ '/technical/nft-new-uses-market-reality/' | relative_url }})〉是同一個問題：某個產品在進步、某個系列有交易，不等於整個收藏市場重新熱起來。

**平台改方向，是供給端做了選擇；熱潮回不回來，還要有人願意買單。**

如果一件作品的吸引力，只剩下可以轉手、可以借錢、可以換獎勵，那麼三種條件一旦變弱，就很難說明下一個人為什麼需要它。反過來，社群、藝術、角色與使用權也不能只停留在口號：它們得是持有人實際享受得到的東西。

## 留下來之前，我會先問的三件事 {#decision}

現在再看一個 NFT 專案，我會把問題拆成三個，分開回答。

1. **沒有下一個買家，我還想留著它嗎？**是作品、角色、社群活動，還是可用的權利？答案可以很個人，但不要把「有人會接手」誤當成內容本身。
2. **我需要資金時，退出要靠誰？**掛售不等於成交；借款也要看接手者、還款條件與可用的操作入口。只看顯示價格，會漏掉真正需要處理的事。
3. **獎勵停止以後，誰還有理由付錢？**收藏者願意付、創作者能收到、平台能維護，是三件都需要成立的事。不能用同一個成交量數字替它們作答。

仍有 Blend 借款的人，眼前更具體的問題是核對自己的借款狀態與官方後續安排。不要把「之後會有提取工具」理解成現有債務會自動消失；也不要從陌生私訊取得還款或提取入口。這是關站資訊的核對順序，不是本文替任何一筆借款決定如何處置。[[1]](https://www.theblock.co/news/ecosystems/2026-10-12-blur-nft-marketplace-shutting-down-frontend-blend-418363)

我不會因為 Blur 要關站，就否認它曾經做出的改變；也不會因為借貸設計很聰明，就把那 4 隻 MAYC 當成無關緊要的註腳。

Blur 留下的問題是：我們把 NFT 做得越來越適合交易之後，有沒有讓它更值得被收藏？

這個答案，關掉一個網站還給不了。

## 參考資料

- **[1]** [The Block：Blur to shut down frontend next month as NFT trading volume dwindles](https://www.theblock.co/news/ecosystems/2026-10-12-blur-nft-marketplace-shutting-down-frontend-blend-418363)（2026-10-12；公告轉述與月成交額資料）。
- **[2]** [Blur Foundation：Governance](https://docs.blur.foundation/governance.md)（治理權限，不是未來收入承諾）。
- **[3]** [CoinDesk：Once-largest Ethereum NFT marketplace Blur is shutting down after volumes collapse 99%](https://www.coindesk.com/tech/2026/10/13/once-largest-ethereum-nft-marketplace-blur-is-shutting-down-after-volumes-collapse-99)（2026-10-13；本次可讀到搜尋索引中的報導內容，全文頁面未能直接開啟，用於交叉比對）。
- **[4]** [Blur：官方市場首頁](https://blur.io/)（2026-10-13 查閱；產品宣傳與獎勵說明）。
- **[5]** [Blur：Checks 系列交易頁](https://blur.io/collection/vv-checks)（只引用欄位區別，不引用即時價格）。
- **[6]** [OpenSea：Creator earnings — ERC721-C Compatibility on OpenSea](https://opensea.io/blog/articles/creator-earnings-erc721-c-compatibility-on-opensea)（2024-04-02）。
- **[7]** [Paradigm：Blend — Perpetual Lending With NFT Collateral](https://www.paradigm.xyz/writing/blend)（2023-05-01；原始協議設計，不能取代個別貸款條件）。
- **[8]** [OpenSea：OS2 正式版、跨 19 條鏈代幣交易與獎勵機制公告](https://opensea.io/blog/articles/opensea-announces-os2-is-now-out-of-beta-token-trading-fully-live-across-19-chains-new-rewards-program-launches-and-community-hub-revamped)（2025-05-29）。
- **[9]** [The Block：Pudgy Penguins-backed Ethereum L2 Abstract to shut down after losing “tens of millions”](https://www.theblock.co/news/ecosystems/2026-10-06-abstract-ethereum-layer-2-shutting-down-pudgy-penguins-igloo-417855)（2026-10-06；團隊公告與執行長說法的報導）。
- **[10]** [Abstract：Terms of Service，第 12.5 節停止營運安排](https://abs.xyz/terms-of-service)（2026-10-06 更新；僅引用官方收尾安排，不作法律效力判斷）。
- **[11]** [The Block：Blast to wind down network as costs exceed revenue](https://www.theblock.co/news/business/2026-10-02-blast-ethereum-layer-2-shutting-down-417583)（2026-10-02；10 月 26 日為一般網站提取入口期限）。
- **[12]** [Blast：官方停止營運與提取提示](https://blast.io/en/bridge)（2026-10-13 查閱）。
- **[13]** [Lisk：Introducing the New Lisk](https://lisk.com/blog/posts/introducing-the-new-lisk/)（2026 年 8 月；鏈關閉時程與企業財務服務轉向）。
- **[14]** [Adam Weitsman：週末購入 117 隻 Pudgy Penguins 的原始貼文](https://x.com/AdamWeitsman/status/2109414248711381383)（UTC 2026-10-11 22:42，台灣時間 10 月 12 日；透過 X 公開嵌入資料及貼文擷取服務核對文字）。
- **[15]** [CCN：Adam Weitsman Buys 117 Pudgy Penguins](https://www.ccn.com/news/crypto/adam-weitsman-buys-117-pudgy-penguins-nft-sales/)（2026-10-12；人物背景與購買消息的交叉比對）。
