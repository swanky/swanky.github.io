---
title: "HUMAN ONE 滿五年：你買到的是會一直被改的作品，那你到底擁有什麼？"
seo_title: "Beeple HUMAN ONE 五年複盤：動態 NFT 的 tokenURI、授權條款與所有權"
date: 2026-11-10
published: true
categories: [technical]
tags: [nft, beeple, human-one, dynamic-nft, tokenuri, digital-art]
layout: article
learn_kit: true
use_glightbox: true
mid_cta: false
cta_context: web3
cover_image: /assets/img/linkedin/beeple-human-one-five-years.jpg
cover_alt: "概念插畫：史旺姬在美術館展間裡，笑著抱住一支超大遙控器、作勢按下紅色按鈕，旁邊立著一座方柱形的螢幕雕塑"
hero_image: true
related_posts:
  - nft-token-standards
  - nft-museum-collection
  - nft-new-uses-market-reality
description: "Beeple 的 HUMAN ONE 滿五年。實際讀取鏈上紀錄後發現：tokenURI 換過兩次網址，持有人是多簽錢包，作品依條款是授權而非賣斷。看懂動態 NFT 你到底擁有什麼。"
keywords: HUMAN ONE, Beeple, 動態 NFT, dynamic NFT, tokenURI, metadata, 佳士得, Christie's, ERC-721, ERC-4906, 數位藝術, 所有權, 史旺基
---

一件會一直被藝術家改的作品，你花了 28,985,000 美元，到底買到了什麼？

2026 年 11 月 10 日中午 12:26（台灣時間），Beeple 在 X 上發文紀念 HUMAN ONE 滿五年。美東時間當時還是 11 月 9 日晚上，正好對上 2021 年佳士得夜拍的成交日。他把這件作品形容成 「a continuing conversation than a finite statement frozen in time」，也就是一場持續的對話，而不是凍結在完成那一刻的陳述。[[1]](https://x.com/beeple/status/2120010114308489433)

我沒有在現場看過 HUMAN ONE，這篇也不是觀展筆記。這則貼文讓我想做的是另一件事：**五年後，回去讀它的鏈上紀錄，看看這個會一直變的承諾，到底接在哪些線上。**讀完之後，我發現答案比拍賣新聞有意思得多。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>藝術圈確實接受了它</strong>：七個章節、至少四家館方或報導可核對的機構展出，這不是自封的地位。</li>
    <li><strong>作品能一直變，靠的是藝術家端的權限</strong>：token 的 tokenURI 在鏈上被改過兩次，最近一次是 2025 年 2 月，從 human-one.xyz 搬到 beeple-collect.com；持有人錢包沒有參與。</li>
    <li><strong>你買到的是 token 和實體，作品本身是授權</strong>：佳士得條款寫明作品授權而非賣斷，NFT 與實體可以分開持有，藝術家保留遠端存取。</li>
    <li><strong>評估動態作品，要看誰能改、改了留不留紀錄</strong>：這件作品的 metadata 今天讀得到，但改網址時合約沒有發出更新事件，舊的 metadata 網址也已查不到位址。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">它被接受了</span>
      <ol class="article-toc-items">
        <li><a href="#readback">五年後，我先去讀了它的鏈上紀錄</a></li>
        <li><a href="#what-sold">HUMAN ONE 到底賣了什麼？</a></li>
        <li><a href="#chapters">七個章節，算不算被藝術圈接受？</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">它靠什麼一直變</span>
      <ol class="article-toc-items">
        <li><a href="#pointer">一直在變是怎麼接線的？</a></li>
        <li><a href="#onchain">鏈上紀錄說了什麼：網址換過兩次</a></li>
        <li><a href="#versions">你看到的，是哪一版？</a></li>
        <li><a href="#terms">條款才是真正的所有權說明書</a></li>
        <li><a href="#failure">它會在哪裡壞掉？</a></li>
        <li><a href="#checklist">買動態作品之前，我會先查的五件事</a></li>
        <li><a href="#closing">凍結的陳述，和沒寫完的對話</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 五年後，我先去讀了它的鏈上紀錄 {#readback}

這篇的起點，是一次失敗的讀取。

這件作品最常被引用的 metadata 網址是 `metadata.human-one.xyz/1`。2021 年底一篇法律評析從 Etherscan 讀 tokenURI 得到它，並指出它放在中心化主機，不是 IPFS。[[6]](https://www.rimonlaw.com/looking-under-the-hood-diligencing-non-fungible-tokens-nft-metadata-and-smart-contracts/)今天開這個網址，一次回 HTTP 500，一次 TLS 錯誤。很容易就想下結論：兩千九百萬美元的 NFT，metadata 掛了。

但讀不到一個網址，不等於作品失效。比較穩的做法，是回到合約問：**它現在指向哪裡？**

2026 年 11 月 10 日晚上 7:58（台灣時間），我用兩個公開節點呼叫合約的 `tokenURI(1)`，結果一致：網址已經是 `metadata.beeple-collect.com/humanone/1`。[[15]](https://eth.blockscout.com/address/0xa4c38796C35Dca618FE22a4e77F4210D0b0350d6)我對新網址連讀三次，三次都是 HTTP 200，內容一字不差。[[16]](https://metadata.beeple-collect.com/humanone/1)舊網址的主機名稱 `metadata.human-one.xyz`，則在 Google 與 Cloudflare 兩家公開 DNS 都查不到位址紀錄。所以先前的錯誤，比較直接的解釋是這個主機名稱已不指向任何伺服器，而不是 metadata 壞了。

這就是整篇文章的縮影：**作品還在、讀得到，可是讀它的路徑，在你不知道的時候被換過了。**

本文資料截點為 2026 年 11 月 10 日；鏈上時間已從 UTC 換算成台灣時間。

## HUMAN ONE 到底賣了什麼？ {#what-sold}

先介紹一下作者。Beeple 本名 Mike Winkelmann，是美國的數位藝術家。2007 年 5 月 1 日起，他每天在網路上發一張新作品，連續做了 13 年半，這個系列叫 *Everydays*。[[21]](https://press.christies.com/results-beeples-purely-digital-nft-based-work-of-art-achieves-693-million-at-christies-1/)

他最有名的一件，是 2021 年 3 月在佳士得以 69,346,250 美元成交的 *Everydays: The First 5000 Days*：把前 5,000 天的每日作品拼成一張數位拼貼。這是大型拍賣行第一次賣純數位、以 NFT 交付的作品，也讓他成為當時拍賣價第三高的在世藝術家。[[21]](https://press.christies.com/results-beeples-purely-digital-nft-based-work-of-art-achieves-693-million-at-christies-1/)

HUMAN ONE 是同年 11 月的下一件，兩件除了作者和拍賣行相同，沒有直接關係，形式也完全相反：5000 天是凍結的，拼好就不再變；HUMAN ONE 是活的，賣出後還一直在變。[[3]](https://press.christies.com/christies-announces-beeplesnbsphuman-onenbspthe-artists-first-ever-dynamic-physical-artwork-video-nft/)[[11]](https://www.theartnewspaper.com/2023/07/27/beeple-sculpture-human-one-crystal-bridges-museum)

白話說，它是一個比人還高的發光盒子。四面牆都是螢幕，裡面一位戴頭盔的旅人一直往前走，其實停在原地，身邊的風景不斷替換。它同時是兩樣東西：

- **實體雕塑**：螢幕、拋光鋁外殼、桃花心木框架、內建媒體伺服器。
- **一枚 NFT**：以太坊合約 `0xa4c38796C35Dca618FE22a4e77F4210D0b0350d6` 的 token #1，2021 年 10 月 28 日鑄造。[[5]](https://www.christies.com/en/lot/lot-6345173)

2021 年 11 月 9 日，佳士得夜拍以 28,985,000 美元成交，新聞稿只寫買家是在瑞士的線上競投者；[[4]](https://press.christies.com/christies-21st-century-evening-sale-achieves-219m/)The Art Newspaper 後來報導買家是 Ryan Zurrer。[[11]](https://www.theartnewspaper.com/2023/07/27/beeple-sculpture-human-one-crystal-bridges-museum)

關鍵在會變。佳士得新聞稿寫明：NFT 的影片放在 Beeple 的私人伺服器，雕塑的素材放在內建媒體伺服器，Beeple 打算在有生之年持續演化這批影像。[[3]](https://press.christies.com/christies-announces-beeplesnbsphuman-onenbspthe-artists-first-ever-dynamic-physical-artwork-video-nft/)佳士得專家 Noah Davis 在拍品頁文章還提到，雕塑會依當地時間從早、午、晚三組素材取畫面，每天隨機。[[5]](https://www.christies.com/en/lot/lot-6345173)

對拍照的人來說，這很反直覺。照片的價值有一部分來自定格：快門落下，就是作品的邊界。HUMAN ONE 刻意拿掉這條邊界。

## 七個章節，算不算被藝術圈接受？ {#chapters}

先講我認同的部分：**它被藝術系統接受，是有證據的。**

官方網站把五年分成七章，每章一套風景與主題，對應一個展出場合：佳士得、義大利 Castello di Rivoli、香港 M+、美國 Crystal Bridges、南京德基藝術博物館、東京森美術館、Palo Alto 的 NODE。[[7]](https://human-one.xyz/)其中四處我能用館方頁或可靠報導核對：M+ 展期 2022 年 12 月 9 日至 2023 年 6 月 11 日[[10]](https://www.mplus.org.hk/en/exhibitions/human-one-beeple/)；Crystal Bridges 自 2023 年 7 月 29 日起展到隔年初[[11]](https://www.theartnewspaper.com/2023/07/27/beeple-sculpture-human-one-crystal-bridges-museum)；森美術館 MACHINE LOVE 展列出 HUMAN ONE[[12]](https://www.mori.art.museum/en/exhibitions/machine_love/02/index.html)；NODE 展期 2026 年 4 月 18 日至 6 月 28 日，並同時展出前六章。[[8]](https://nodefoundation.com/program/infinite-loop)

但要說精確一點：**官方網站寫的是章節期間，不是館方展期。**

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="human-one-five-years" data-type="image" href="{{ '/assets/img/technical/beeple-human-one-five-years/chapters-vs-venues.svg' | relative_url }}">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/beeple-human-one-five-years/chapters-vs-venues-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/beeple-human-one-five-years/chapters-vs-venues.svg' | relative_url }}" width="1200" height="1015" alt="七個章節的官方期間與館方展期對照：M+、Crystal Bridges、森美術館的館方展期都與官方章節期間不同，第二、第五章館方展期本輪未核對" loading="lazy" decoding="async"></picture>
  </a>
  <figcaption>圖 1：章節期間和館方展期是兩套日期。資料截點 2026-11-10，來源同上段。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

例如第六章官方寫到 2026 年 4 月，森美術館的展覽卻在 2025 年 6 月就結束。這不是誰寫錯：章節是作品用這套風景的期間，展期是作品在這家館的期間。

現況更要小心。官方網站至今仍把 NODE 標成「Current Exhibition」，metadata 的 `Exhibition` 欄位也還是 `NODE`；但 NODE 的展覽 6 月 28 日就結束，該館預定 7 月 11 日換上 Kim Asendorf 的新展。[[19]](https://www.rightclicksave.com/article/node-a-physical-space-for-a-digital-world-micky-malka-becky-kleiner-phil-mohun-interview)

雕塑現在在哪裡？**我查不到，未驗證。**Beeple Studios 展歷把 Madison 當代美術館列為目前展出，[[14]](https://beeple-studios.xyz/exhibition/)但館方頁寫明那裡展的是另一件 *Diffuse Control*。[[13]](https://www.mmoca.org/events/diffuse-control-by-beeple/)Zurrer 在週年當天只說，接下來幾個月會有 「some announcements around HUMAN ONE’s next journey」。[[2]](https://x.com/kukulabanze/status/2120044365720559921)

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center"><p>收藏者 Ryan Zurrer 引用週年貼文，預告 HUMAN ONE 的下一程（Ryan Zurrer，2026-11-10）</p>&mdash; <a href="https://twitter.com/kukulabanze/status/2120044365720559921">在 X 上看原貼文</a></blockquote>

我在〈[當博物館開始收藏 NFT]({{ '/technical/nft-museum-collection/' | relative_url }})〉寫過，MoMA 納入永久館藏是歷史定位的訊號。HUMAN ONE 走的是另一條路：**它被很多機構借展，但我沒找到公開資料顯示它進入任何永久館藏。**共同持有人 Jehan Chu 在訪談中也說，2021 年不可能有機構買下它。[[9]](https://www.rightclicksave.com/article/jehan-chu-on-the-collective-stewardship-of-blue-chip-art-interview-beeple-human-one-node-foundation)

我的判斷是：巡展證明它被接受，但展出和保存是兩件事。後者要回答：二十年後，誰還能讓它照原意運作？

## 一直在變是怎麼接線的？ {#pointer}

我在〈[NFT 怎麼存在區塊鏈上]({{ '/technical/nft-token-standards/' | relative_url }})〉寫過基本結構：合約記錄誰持有哪個 token，`tokenURI` 回傳一個網址，指向 metadata 描述檔，描述檔再指向真正的影像。影像幾乎都不在鏈上。

HUMAN ONE 就是這個結構，只是每一層都有人在管：

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="human-one-five-years" data-type="image" href="{{ '/assets/img/technical/beeple-human-one-five-years/pointer-chain.svg' | relative_url }}">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/beeple-human-one-five-years/pointer-chain-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/beeple-human-one-five-years/pointer-chain.svg' | relative_url }}" width="1200" height="1023" alt="從多簽錢包、合約持有紀錄、tokenURI、metadata 主機、影片主機到實體雕塑的六層路徑；持有人只控制第一層的轉移，tokenURI 由藝術家端設定，內容放在中心化主機" loading="lazy" decoding="async"></picture>
  </a>
  <figcaption>圖 2：持有人決定 token 轉給誰，但決定不了 token 指向什麼。讀取時間 2026-11-10（台灣時間）。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

**持有人這一格**：`ownerOf(1)` 回傳的是一個多簽錢包（Safe 合約）。2026 年 11 月 10 日我直接呼叫它的 `getOwners` 與 `getThreshold`：9 位簽署者、門檻 5，要至少 5 人同意才能動這個 token。這和 2026 年 4 月公開的共同持有在形式上相容：Right Click Save 報導，Jehan Chu 與配偶 Jeannie Vu、收藏家 Pablo Rodríguez-Fraile 在 2022 年底成為共同持有人，Zurrer 的基金 1OF1 與投資人 Rhydon Lee 在 2024 年加入。[[9]](https://www.rightclicksave.com/article/jehan-chu-on-the-collective-stewardship-of-blue-chip-art-interview-beeple-human-one-node-foundation)但鏈上只看得到地址；**簽署者是不是這幾位，未驗證。**

**tokenURI 這一格**：它是合約裡的一個字串。改它的是合約管理者錢包，也就是佳士得目錄上列的那個錢包，不是持有人。

**metadata 這一格**：今天回傳的 JSON 寫著 `CHAPTER SEVEN: PRE-HUMAN FEEDBACK`，影片指向 `nft.beeple-collect.com` 上約 49 MB 的 mp4。從公開 DNS 看，兩個網域分別指向雲端網頁服務與 CDN。[[16]](https://metadata.beeple-collect.com/humanone/1)其中 `days_journeyed` 是 1839；從鑄造日往後數 1839 天，剛好是讀取當天。我推測它是伺服器每天算出來的，未驗證。

**實體這一格**：雕塑有自己的媒體伺服器，條款寫明 Beeple 保留遠端存取。[[5]](https://www.christies.com/en/lot/lot-6345173)

所以，所謂一直在變，技術上的意思是：**持有人握著第一格，藝術家握著中間的寫入權，內容放在需要有人付費維護的主機上。**

## 鏈上紀錄說了什麼：網址換過兩次 {#onchain}

區塊鏈的好處，是改過什麼都留下交易。下圖的交易內容來自 Blockscout 解碼，再用另一個節點的交易收據確認每筆都成功、發起地址相同。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="human-one-five-years" data-type="image" href="{{ '/assets/img/technical/beeple-human-one-five-years/onchain-timeline.svg' | relative_url }}">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/beeple-human-one-five-years/onchain-timeline-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/beeple-human-one-five-years/onchain-timeline.svg' | relative_url }}" width="1200" height="978" alt="HUMAN ONE token 時間軸：2021 年鑄造時指向 Arweave、同日改成 human-one.xyz，成交後經幾次轉手進入多簽錢包，2025 年 2 月改指向 beeple-collect.com" loading="lazy" decoding="async"></picture>
  </a>
  <figcaption>圖 3：網址換了兩次，都不經過持有人，兩條線互不相干。時間為台灣時間。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

**第一，它一開始指向 Arweave。**鑄造時寫進鏈上的初始網址是 `arweave.net/...`，一種去中心化儲存，常被拿來降低連結失效的風險。[[6]](https://www.rimonlaw.com/looking-under-the-hood-diligencing-non-fungible-tokens-nft-metadata-and-smart-contracts/)[[15]](https://eth.blockscout.com/address/0xa4c38796C35Dca618FE22a4e77F4210D0b0350d6)同一天晚上，管理者錢包呼叫 `setTokenURI`，改成 `metadata.human-one.xyz/1`。[[15]](https://eth.blockscout.com/address/0xa4c38796C35Dca618FE22a4e77F4210D0b0350d6)那個初始檔我今天從 arweave.net 讀不到，查詢介面也查無資料，原因無法判定。

我的解讀是，這是取捨，不是疏忽。內容定址的好處，是內容一改，地址就跟著變；可是一件要一直改的作品，需要的恰好相反：地址不變、內容可以換。換成一般網址，等於選了可變性，放棄了不可竄改。

**第二，2025 年 2 月又搬了一次家。**台灣時間 2 月 5 日凌晨，同一個管理者錢包把網址改成 `metadata.beeple-collect.com/humanone/1`。[[15]](https://eth.blockscout.com/address/0xa4c38796C35Dca618FE22a4e77F4210D0b0350d6)那時 token 早已在多簽錢包裡，持有人沒有參與。這完全合乎規格：ERC-721 標準明寫 URI 「MAY be mutable」。[[18]](https://eips.ethereum.org/EIPS/eip-721)問題在於，**改了之後，外面的人怎麼知道？**

**第三，改網址時，合約沒有發出任何通知。**這三次修改所在的區塊，合約都沒有事件紀錄；它也不支援 ERC-4906，這個 2022 年提出的擴充標準，就是讓合約在 metadata 改變時發出 `MetadataUpdate` 事件，通知市集重新抓取。[[17]](https://eips.ethereum.org/EIPS/eip-4906)合約部署在 2021 年，比標準早，沒支援很正常；結果就是網址換了，只有翻交易的人才知道。

另外兩點我只陳述、不推論：拍賣成交後，token 經過幾次轉手才進入現在的多簽錢包；2023 年 3 月，管理者錢包設定了 10% 版稅。轉手各方是誰、為何轉移，鏈上看不出來。

## 你看到的，是哪一版？ {#versions}

網址會換、內容會換，就會出現一個實際問題：**不同的人，用不同工具、在不同時間看同一顆 token，看到的不一樣。**

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="human-one-five-years" data-type="image" href="{{ '/assets/img/technical/beeple-human-one-five-years/three-readers.svg' | relative_url }}">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/beeple-human-one-five-years/three-readers-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/beeple-human-one-five-years/three-readers.svg' | relative_url }}" width="1200" height="768" alt="同一顆 token 的五種讀法：今天問合約得到第七章、索引器快取仍是第二章、2021 年法律評析讀到 Crystal Night、舊網址查不到、鑄造時的 Arweave 網址讀不到" loading="lazy" decoding="async"></picture>
  </a>
  <figcaption>圖 4：作品長什麼樣子，取決於你問誰、什麼時候問。讀取時間 2026-11-10。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

同一個晚上，直接問合約再讀網址，得到第七章；問 Blockscout 上這枚 token 的快取，回給我的卻是一支 `Ukraine_...mp4`、`days_journeyed` 為 320 的舊 metadata，從內容看是第二章的狀態。[[15]](https://eth.blockscout.com/address/0xa4c38796C35Dca618FE22a4e77F4210D0b0350d6)2021 年 12 月的法律評析，讀到的則是 `Crystal_Night_...mp4`、`days_journeyed` 57。[[6]](https://www.rimonlaw.com/looking-under-the-hood-diligencing-non-fungible-tokens-nft-metadata-and-smart-contracts/)

這不是說作品有五個正式版本。正式的只有合約此刻指向的那一份，其他是快取、歷史或斷掉的路徑。可是收藏者、策展人和研究者，多半看的是市集頁面、瀏覽器和新聞截圖。**當平台快取停在幾年前，合約又不發更新事件，你在畫面上看到的作品，可能早就不是現在的作品。**

這是我覺得動態 NFT 最需要補的一塊：不是能不能改，而是改過的每一版有沒有被記下來。目前各章的歷史，主要靠官方網站的文字與機構展出紀錄；鏈上只留下網址被改過的痕跡，沒有每一章內容的指紋。

## 條款才是真正的所有權說明書 {#terms}

回到標題：你到底擁有什麼？答案在佳士得拍品頁附的藝術家條款。最關鍵的三句原文：[[5]](https://www.christies.com/en/lot/lot-6345173)

- 「the Artwork is licensed and not sold」：NFT 與實體賣給買方，作品本身是授權。
- 「The Artwork is neither stored nor embedded in the NFT, but is accessible through the NFT.」：作品不在 NFT 裡，只是透過它存取。
- 「The NFT and Physical Element may be separated and owned by different persons.」：NFT 和實體可以分屬不同人。

條款也寫到：Beeple 保留對實體的遠端存取；授權限非商業用途，但博物館展出可賣門票；Beeple 的賠償上限是 100 美元；初次買家同意在購買後一年內，善意配合合理的展出請求。

把條款和鏈上事實放在一起，就是一張比較誠實的權利表。前兩列依據鏈上交易與錢包設定，其餘依據佳士得新聞稿與條款：

| 項目 | 持有人 | 藝術家端 |
|---|---|---|
| 轉移 token | 可以（9 中 5 簽） | 不行 |
| 改 token 網址 | 不行 | 可以，已改兩次 |
| 更新影像 | 不行 | 可以，作品設計 |
| 遠端進入雕塑 | 條款未提 | 保留 |
| 商業利用 | 不行，館方售票除外 | 保留其餘權利 |
| NFT 與實體分開賣 | 可以 | 條款允許 |

這不是在說交易不公平。藝術品買賣本來常常不含著作權，買家也都是在看得到條款的情況下競標。但它改變了擁有的意思。我的理解是：**買家買到的是一個身分加一台機器；作品本身，是藝術家承諾持續透過這兩樣東西送來的內容。**

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="human-one-five-years" data-type="image" href="{{ '/assets/img/technical/beeple-human-one-five-years/owner-and-remote.jpg' | relative_url }}">
    <img src="{{ '/assets/img/technical/beeple-human-one-five-years/owner-and-remote.jpg' | relative_url }}" width="1672" height="941" alt="示意插圖：抱得到盒子，遙控器卻在別人手上" loading="lazy" decoding="async">
  </a>
  <figcaption>插圖：抱得到盒子，遙控器卻在別人手上。示意插圖，非作品實景。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

可以分開持有值得多想一下。若有一天 NFT 和雕塑分屬兩人，兩邊各自接收藝術家的更新，哪一邊才是 HUMAN ONE？條款的答案是：作品不在任何一邊。

## 它會在哪裡壞掉？ {#failure}

我想避免兩種誇大：一種是讀不到就說作品掛了，另一種是有區塊鏈就說會永久保存。依我讀到的結構，實際的風險是這幾個：

1. **主機與網域要有人持續付費。**帳單、續約、服務商規則，任何一項斷掉，讀取就中斷。舊的 metadata 主機名稱已查不到位址，就是小型示範；只是網址事先換了，才沒變成事故。
2. **管理者錢包是單點。**持有人用多簽保護 token 的轉移，但 token 指向哪裡這一格靠的是那一個管理者錢包。私鑰遺失就無法再更新，外流則可能被改成任何東西。這是依結構推論的風險，不代表目前有異常。
3. **藝術家身後誰維護。**佳士得新聞稿談的是藝術家有生之年的更新，拍品頁文章寫的是他往後的藝術生涯。停止更新那天，作品停在哪一章、誰保存最後一版、誰付主機費？我沒找到公開答案。
4. **資訊過期。**官方網站與 metadata 仍寫 NODE。對研究者來說，官方來源寫錯現況，比讀不到更麻煩，因為它看起來是對的。
5. **實體與 NFT 分家。**分家之後，兩邊可能在不同時間收到更新。

反過來說，這五年的實際紀錄是好的：藝術家持續出新章、機構持續邀展。**風險不是它一定會壞，而是它能不能繼續運作，取決於少數人持續做對的事。**這和一幅畫掛在牆上就能撐一百年，是不同的保存模型。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="human-one-five-years" data-type="image" href="{{ '/assets/img/technical/beeple-human-one-five-years/walking-in-place.jpg' | relative_url }}">
    <img src="{{ '/assets/img/technical/beeple-human-one-five-years/walking-in-place.jpg' | relative_url }}" width="1672" height="941" alt="示意插圖：一直往前走，其實停在原地" loading="lazy" decoding="async">
  </a>
  <figcaption>插圖：一直往前走，其實停在原地；能不能繼續走，要看有沒有人一直在跑。示意插圖，非作品實景。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 買動態作品之前，我會先查的五件事 {#checklist}

不需要寫程式，用區塊鏈瀏覽器的 Read Contract 功能就做得到：

1. **它現在指向哪裡？**直接讀 `tokenURI`，別只看市集頁。開頭是 `ipfs://`、`ar://`，還是一般 `https://`？
2. **誰改得了網址？**合約管理者是單一錢包、多簽，還是已放棄權限？過去改過幾次？
3. **改的時候有通知嗎？**合約支不支援 ERC-4906？不支援的話，就得自己定期檢查。
4. **條款怎麼寫？**買到的是作品還是授權？能否商用？實體與 NFT 能否分開？藝術家保留哪些遠端權限？
5. **停止更新之後呢？**有沒有承諾把每一章存到長期保存的地方？誰付主機費？

如果是我來設計動態作品，我會把入口和版本分開：入口可以是會變的網址，讓作品繼續活著；但每次更新，都把那一章存成內容定址的檔案，並在鏈上記下指紋和時間。作品可以一直改，歷史改不掉。這是我的設計判斷，不是 HUMAN ONE 已經在做的事。

這也補充了我在 token 標準那篇談 IPFS 防竄改的段落。對靜態作品，不可竄改是優點；對動態作品，它是需要刻意保留的另一半：**要能改，也要記得改過什麼。**

## 凍結的陳述，和沒寫完的對話 {#closing}

第七章的主題，是人和大型模型之間的回饋迴路。[[7]](https://human-one.xyz/)這一章的 Hidden Gems 比賽請觀眾依每週主題（例如 `LOVE`、`TRUST`）上傳圖片，由 AI 排名；Beeple 事後說有超過 1,200 人送出超過 15,000 張圖，最後補了一句 「The machines thank you for your data.」[[20]](https://x.com/beeple/status/2084693395788739052)

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center"><p>Beeple 紀念 HUMAN ONE 滿五年，附上旅人行走的短片（Beeple，2026-11-10）</p>&mdash; <a href="https://twitter.com/beeple/status/2120010114308489433">在 X 上看原貼文</a></blockquote>

五年過去，這件作品確實照它說的，一直沒寫完。我欣賞這個野心，也認同巡展證明了它的分量。

只是讀完它的鏈上紀錄，我更清楚一件事：對話能繼續，靠的是有人一直在場。對一件會變的作品來說，所謂擁有，比較像取得一個固定的座位；台上說什麼、說到什麼時候，還是由藝術家決定。

---

本文資料截點為 2026 年 11 月 10 日。鏈上與網址讀取時間為當天 19:58–20:04（台灣時間），使用公開節點與 Blockscout。地址屬於誰、實體作品目前位置均未驗證。內嵌貼文版權屬原作者，已核對作者與發文日期。

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## 參考資料

- **[1]** [X：Beeple，FIVE YEARS AGO TODAY _ HUMAN ONE BEGINS（2026-11-10）](https://x.com/beeple/status/2120010114308489433)
- **[2]** [X：Ryan Zurrer，5 years of HUMAN ONE!（2026-11-10）](https://x.com/kukulabanze/status/2120044365720559921)
- **[3]** [Christie's：Christie's Announces Beeple's HUMAN ONE（2021-10-28）](https://press.christies.com/christies-announces-beeplesnbsphuman-onenbspthe-artists-first-ever-dynamic-physical-artwork-video-nft/)
- **[4]** [Christie's：21st Century Evening Sale Achieves $219M（2021-11-09）](https://press.christies.com/christies-21st-century-evening-sale-achieves-219m/)
- **[5]** [Christie's：BEEPLE, HUMAN ONE 拍品頁與 Beeple Sculpture & NFT Terms](https://www.christies.com/en/lot/lot-6345173)
- **[6]** [Rimon Law：Looking Under the Hood: Diligencing NFT Metadata and Smart Contracts（2021-12-29）](https://www.rimonlaw.com/looking-under-the-hood-diligencing-non-fungible-tokens-nft-metadata-and-smart-contracts/)
- **[7]** [HUMAN ONE 官方網站：Chapters](https://human-one.xyz/)
- **[8]** [NODE：BEEPLE: / INFINITE_LOOP（2026-04-18 至 06-28）](https://nodefoundation.com/program/infinite-loop)
- **[9]** [Right Click Save：Jehan Chu on the Collective Stewardship of Blue-Chip Art（2026-04-19）](https://www.rightclicksave.com/article/jehan-chu-on-the-collective-stewardship-of-blue-chip-art-interview-beeple-human-one-node-foundation)
- **[10]** [M+：Beeple: HUMAN ONE（2022-12-09 至 2023-06-11）](https://www.mplus.org.hk/en/exhibitions/human-one-beeple/)
- **[11]** [The Art Newspaper：$29m Beeple sculpture goes on display at Crystal Bridges（2023-07-27）](https://www.theartnewspaper.com/2023/07/27/beeple-sculpture-human-one-crystal-bridges-museum)
- **[12]** [森美術館：MACHINE LOVE 藝術家與作品](https://www.mori.art.museum/en/exhibitions/machine_love/02/index.html)
- **[13]** [Madison Museum of Contemporary Art：Diffuse Control by Beeple](https://www.mmoca.org/events/diffuse-control-by-beeple/)
- **[14]** [Beeple Studios：Exhibitions](https://beeple-studios.xyz/exhibition/)
- **[15]** [Blockscout：HUMANS 合約頁（tokenURI 修改與鑄造交易都在此合約的交易紀錄中）](https://eth.blockscout.com/address/0xa4c38796C35Dca618FE22a4e77F4210D0b0350d6)
- **[16]** [HUMAN ONE metadata（目前 tokenURI 指向的網址）](https://metadata.beeple-collect.com/humanone/1)
- **[17]** [Ethereum Improvement Proposals：ERC-4906 Metadata Update Extension](https://eips.ethereum.org/EIPS/eip-4906)
- **[18]** [Ethereum Improvement Proposals：ERC-721 Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721)
- **[19]** [Right Click Save：NODE, A Physical Space for a Digital World](https://www.rightclicksave.com/article/node-a-physical-space-for-a-digital-world-micky-malka-becky-kleiner-phil-mohun-interview)
- **[20]** [X：Beeple，HUMAN ONE: HIDDEN GEMS 比賽結果（2026-08-05）](https://x.com/beeple/status/2084693395788739052)
- **[21]** [Christie's：Beeple Everydays: The First 5000 Days 成交新聞稿（2021-03-11）](https://press.christies.com/results-beeples-purely-digital-nft-based-work-of-art-achieves-693-million-at-christies-1/)
