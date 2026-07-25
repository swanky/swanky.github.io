---
title: "假世界資產，不是假資產：FWA 如何把 NFT 流動性做成一台鏈上扭蛋機"
seo_title: "Fake World Assets 深度解讀：NFT 扭蛋、Loss-to-Earn 與補貼退潮風險"
date: 2026-07-25
published: true
categories: [technical]
tags: [web3, nft, defi, market-design]
layout: article
cover_image: /assets/img/fake-world-assets-fwa-deep-dive/fwa-chain-gacha-banner-v3-fixed.jpg
hero_image: true
description: "Fake World Assets 不只是 NFT 抽卡，而是一套結合 ETH 擔保金、隨機分配、常駐買價與代幣排放的鏈上市場。本文拆解它的定價公式、Loss-to-Earn 敘事，以及補貼退潮後真正要看的風險。"
keywords: Fake World Assets, FWA, NFT, DeFi, Loss-to-Earn, CryptoPunks, BAYC, Azuki, Pudgy Penguins, NFT 流動性, 鏈上扭蛋, 代幣經濟, Web3, 史旺基, Swanky Studio
---

想像一台透明扭蛋機。

裡面不是塑膠玩具，而是 CryptoPunk、無聊猿、Azuki、Pudgy Penguin、Doodles 與 Meebits。每一枚 NFT 後面還鎖著一筆 ETH。你付錢按下按鈕，Chainlink VRF 幫你抽出其中一個部位，然後你再決定：留下 NFT，或把它賣回原存款人。

這聽起來很像賭場把 DeFi 穿在身上。

但如果只停在「NFT 抽卡」，反而低估了 Fake World Assets，簡稱 FWA，真正有意思的地方。它把 NFT 做市、隨機分配、預先資助的買回報價、手續費與代幣補貼，塞進同一個交易流程。

我不是完全站在場外看熱鬧的人。2021 年，我曾把自己的制服女孩攝影做成 NFT，也一路做過 UCX／Uniform CloneX。幾年後回頭看，NFT 最難的從來不是「能不能發」，而是發完以後，誰願意買、怎麼成交，以及流動性退掉後還剩下什麼。

FWA 正面處理了這個老問題，只是它用的方法非常 Web3：**如果每一枚 NFT 都很難各自找到買家，那就不要讓買家選。**

我的結論先放前面：FWA 的市場設計值得拆解，但不能把精巧的機制，直接翻譯成值得重押的投資結論。

*資料與協議參數截點：2026 年 7 月 25 日。本文依 FWA 官方文件與公開合約說明整理，不構成投資建議。*

## 從 RWA 到 FWA：這個名字本身就在唱反調

過去幾年，加密市場一直在談 RWA，也就是現實世界資產。國債、股票、黃金、不動產與應收帳款被搬上鏈，目標是把現實世界的所有權、現金流與結算活動，接進 24 小時不停機的鏈上金融。

Fake World Assets 故意往反方向走。

它不把房子或債券搬上鏈，也不靠倉庫替一張實體收藏卡背書。它使用的原料本來就出生在鏈上：NFT、ETH、智能合約、隨機數與代幣。

所以這裡的「Fake」不是偽造，更不是替詐騙開脫，而是對 RWA 敘事的一次反向命名。RWA 想證明區塊鏈能容納現實資產；FWA 則反問：**加密原生資產一定要長得像傳統金融，才配被當成資產嗎？**

官方文件顯示，主網上線時的許可清單共有 16 個系列，包括 CryptoPunks 721、Milady Maker、Bored Ape Yacht Club、Azuki、Doodles、CrypToadz、Pudgy Penguins、Meebits、Checks、VeeFriends、mfers 與 DeadFellaz 等。核心協議本身不依賴特定系列，但新部位能否進場，仍受當下鏈上白名單設定影響。

更準確地說，FWA 不是一種新 NFT。它創造的是一種新的市場部位：

> **NFT ＋ ETH 擔保金 ＋ 被抽中的機率 ＋ 一個預先寫好的買回承諾。**

## 先拆掉扭蛋機的外殼

FWA 的基本流程可以拆成四步。

1. 存款人把一枚支援的 ERC-721 NFT 與一筆 ETH 一起鎖進協議，形成獨立部位。
2. ETH 擔保金同時決定抽中權重，並替存款人預先資助一個不可撤回的常駐買價。
3. 抽卡者支付由獎池計算出的 acquisition price，加上獨立的 VRF 服務費；Chainlink VRF 提供隨機數，請求依建立順序結算。
4. 抽中後，使用者可以留下 NFT、帶著新擔保金直接重新上架，或接受原存款人的買價，以 ETH 或 FWA 代幣結算。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a href="{{ '/assets/img/fake-world-assets-fwa-deep-dive/fwa-position-lifecycle.svg' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/img/fake-world-assets-fwa-deep-dive/fwa-position-lifecycle.svg' | relative_url }}" alt="FWA 部位生命週期：存款人鎖入 NFT 與 ETH 擔保金，抽卡者支付獎池價格，由 Chainlink VRF 依擔保金倒數權重抽出部位，最後只能留下 NFT、重新上架，或接受存款人的常駐買價" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖一：FWA 不是把 NFT 和免費 ETH 一起送出，而是把 NFT、機率與預先資助的退出報價綁在同一個部位；點圖可開啟原尺寸</figcaption>
</figure>

概念拆開之後，再看實際產品會比較清楚。FWA 的獎池不是一排待售商品，而是一圈同時帶著擔保金、稀有度與抽中機率的部位；抽卡者買的是整個池子的隨機分配，不是點名其中一張。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a href="https://www.bankless.com/read/a-beginners-guide-to-fake-world-assets" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/img/fake-world-assets-fwa-deep-dive/bankless-fwa-pool-interface.png' | relative_url }}" alt="FWA 實際獎池介面，中央以弧形卡片展示 NFT 部位，右側顯示購買操作與近期活動" loading="lazy" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">FWA 實際獎池介面：每張卡片同時呈現擔保金、稀有度與抽中機率，右側則是購買操作與近期活動。介面截圖來源：<a href="https://www.bankless.com/read/a-beginners-guide-to-fake-world-assets" target="_blank" rel="noopener noreferrer">Bankless〈A Beginner's Guide to Fake World Assets〉</a>；著作權歸原作者及平台所有，本文為評論與機制說明引用。</figcaption>
</figure>

這使 FWA 落在幾種產品的交界處。

它不是一般 NFT 市場，因為買方不能指定要哪一枚；它不只是抽獎，因為抽中後還有保留、重掛與賣回等選項；它也不是普通質押，因為存款人鎖入的不只資金，還有一枚可能被別人帶走的 NFT。

它比較像一個**用隨機分配取代指定成交的 NFT 流動性市場**。

## 66 ETH 不是附贈獎金，而是一扇退出門

FWA 最容易讓人看錯的詞，是「backed by ETH」。

假設某枚 CryptoPunk 背後放了 66 ETH。這不代表抽中後能同時抱走 Punk 與 66 ETH。那筆 ETH 是原存款人的擔保金，也是他事先放進合約的買回資金。

抽中者留下 CryptoPunk，原存款人就拿回擔保金；抽中者若不想留下，則可接受常駐買價，把 NFT 賣回原存款人。

依官方目前列出的預設 85% depositor bid rate，66 ETH 對應的買回結算是 56.1 ETH。使用者也可以讓同一筆結算金額透過協議買進 FWA，改領代幣。

兩邊不能一起拿。

<figure style="margin:2em auto;text-align:center;max-width:1000px;">
  <a href="https://www.bankless.com/read/a-beginners-guide-to-fake-world-assets" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/img/fake-world-assets-fwa-deep-dive/bankless-fwa-settlement-options.png' | relative_url }}" alt="FWA 抽中 NFT 後的實際結算介面，可選擇留下 NFT、重新存入、接受 ETH 或改領 FWA 代幣" loading="lazy" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">抽中後的實際結算介面：留下 NFT、重新存入、接受 ETH，或把相同結算金額換成 FWA。這張圖也直接呈現「NFT 與擔保金不能一起拿」。介面截圖來源：<a href="https://www.bankless.com/read/a-beginners-guide-to-fake-world-assets" target="_blank" rel="noopener noreferrer">Bankless〈A Beginner's Guide to Fake World Assets〉</a>；著作權歸原作者及平台所有，本文為評論與機制說明引用。</figcaption>
</figure>

從金融結構看，抽中者得到的不是「NFT 加現金」，而是 NFT 加上一個內嵌的退出選項。存款人則站在另一側：他承諾在抽中者不要 NFT 時，以事先鎖好的資金把它買回。

這就是 FWA 的雙向報價：

- NFT 被帶走，存款人取回擔保金，扣除預設 1% 的 protocol settlement cut；
- NFT 被退回，存款人取回 NFT，抽中者取得預設 85% 擔保價值；
- 其餘折價預設留給協議，但管理參數可以改成分給存款人。

所以擔保金不是越高越神，也不是越低越划算。比較合理的設定，是一個兩種結果發生時，存款人都能接受的價位。

## 真正精巧的地方，是低價部位決定票價

一般抽獎只要放進一個超高價頭獎，票價就得跟著上升，否則期望值會失控。

FWA 的處理方式，是讓抽中權重與擔保金成反比：

> **weightᵢ = K ÷ backingᵢ**

擔保金越低，權重越高，越容易被抽中；擔保金越高，權重越低，通常會在池中停留更久。

每一抽的期望擔保價值，等於池內擔保金的調和平均數。再乘上預設 10% surcharge，才得到 pool acquisition fee；另外還有 VRF 服務費、Gas 與可能的滑價。

這裡的調和平均數很重要。它對小數值特別敏感，因此大量低擔保部位會壓住每一抽的價格；少數高擔保 Punk 很搶眼，卻因為權重極低，不會等比例把票價推上去。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a href="{{ '/assets/img/fake-world-assets-fwa-deep-dive/fwa-inverse-weight-pricing.svg' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/img/fake-world-assets-fwa-deep-dive/fwa-inverse-weight-pricing.svg' | relative_url }}" alt="FWA 倒數權重與調和平均定價範例：0.05、0.5、5 ETH 三個部位的抽中機率約為 90.09%、9.01%、0.90%，調和平均擔保金約 0.135 ETH，加上預設 10% 後約為 0.149 ETH" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖二：作者簡化試算，假設池中只有三個部位；未含 VRF 服務費、Gas、滑價與池子變動，並非即時報價</figcaption>
</figure>

用圖中的簡化池來看，0.05、0.5 與 5 ETH 三個部位，抽中機率約為 90.09%、9.01% 與 0.90%。三者的算術平均是 1.85 ETH，但調和平均只有約 0.135 ETH；加上 10% 後，pool acquisition fee 約 0.149 ETH。

那枚 5 ETH 部位讓畫面看起來很豪華，真正決定大多數人會抽到什麼的，卻是 0.05 ETH 那一區。

巨額擔保金沒有免費增加玩家的期望值。它主要增加的是**敘事張力**。

頭獎負責吸引目光，倒數權重負責讓數學不要破產。這就有點像把一座金光閃閃的城堡放在遠方，再把通往城堡的橋做得比頭髮還細。

## 存款人是莊家嗎？只說一半

FWA 常把存款人描述成站在莊家那一側。這個比喻好懂，卻容易讓人誤以為存款人天然占優勢。

官方費用設計是：每次 acquisition fee 扣掉協議抽成與 crown tithe 後，平均分給所有有效部位。每個部位當下拿到的份額相同，跟它背後放 0.05 ETH 還是 5 ETH 無關。

差異發生在時間。

高擔保部位比較難被抽中，通常能留在池中更久，累積更多次費用與代幣獎勵；低擔保部位容易快速離場。若池子在簡化期間保持不變，某部位的預期存活抽數會隨擔保金增加，於是「每抽分得相同」與「高擔保活得更久」組合起來，才形成官方所說的平均生命週期收益。

但期望值不是保固書。

理論上應停留一百抽的 NFT，仍可能第一抽就被選中。部位一結束，後面的手續費、FWA 排放與 top deposit reward 機會也一起消失。

存款人賺的不是固定利息，而是在承擔一場時間樂透。抽卡者賭抽中哪一枚，存款人賭自己的部位何時被抽走。

兩邊只是站在隨機性的不同方向。

## Loss-to-Earn：它沒有消滅虧損，只是替虧損換了名字

FWA 最會讓人停下來看的詞，大概是 Loss-to-Earn。

假設你花 0.1 ETH 抽卡，卻拿到市場吸引力不高、常駐買價也偏低的 NFT。用 ETH 計價，這次結果可能就是虧損。

FWA 接著提供另一個選項：不要拿 ETH，改把結算金額換成 FWA 代幣。

初始代幣分配中，50% 用來建立 FWA／ETH 市場，30% 進入 15 天排放，20% 用於 v1 snapshot claims。排放的 30% 再平均拆成兩邊：存款人每天取得總供應量 1%，成功抽卡者每天也分 1%，各持續 15 天。

外部買入在初期由管理者控制並預設關閉，但賣出維持開放；一般錢包之間的直接轉帳也受限制。早期代幣因此主要透過實際使用協議取得，而不是讓外部資金直接進場買。

這確實能處理雙邊市場的冷啟動問題：沒有 NFT，抽卡者不來；沒有抽卡者，存款人也沒有理由鎖資產。代幣同時補貼兩邊，先把供給與需求叫進房間。

但「領到 FWA」不等於「已經回本」。

你只是把一筆較明確的 ETH 結算價值，換成尚在價格發現中的代幣曝險。外部買入受限甚至讓初期價格更難被當成自然市場需求的證據。

Loss-to-Earn 沒有把損失擦掉。它只是把「這一抽虧了」重新敘述成「我取得一個早期代幣部位」。

這不是魔法，是風險轉換。

## 真正的考試，是排放結束與回購開關

任何有代幣補貼的協議，上線初期活動量通常混著三種需求：真的喜歡產品、想追稀有 NFT，以及單純想拿排放。

補貼存在時，很難分辨誰是誰。

FWA 的第一場壓力測試，是 15 天排放結束後，使用者還願不願意用 ETH 抽卡。若抽卡量下降，存款人分到的費用減少；存款人撤出後，獎池數量與品質下降；池子變差，又進一步降低抽卡需求。

正向飛輪很漂亮。反向轉的時候也完全不會客氣。

官方設計了 protocol fee 買回 FWA 的路徑；買回後預設按 40%、40%、20% 分給存款人、抽卡者與銷毀。但官方參數頁同時寫得很清楚：**protocol-fee → FWA 的預設比例是 0%，也就是關閉。**

「合約裡有回購函式」和「現在真的有協議收入持續回購」，是兩件完全不同的事。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a href="{{ '/assets/img/fake-world-assets-fwa-deep-dive/fwa-token-economics-stress-test.svg' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/img/fake-world-assets-fwa-deep-dive/fwa-token-economics-stress-test.svg' | relative_url }}" alt="FWA 代幣兩階段經濟：初始固定供應量分為 50% 市場、30% 十五天排放與 20% 快照申領；排放後的協議費回購預設為 0%，若啟用則買回代幣預設按 40%、40%、20% 分給存款人、抽卡者與銷毀，真正壓力測試是補貼退潮後抽卡需求能否維持" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖三：代幣補貼可以啟動市場，不能替市場永久製造需求；回購路徑存在，也不代表回購開關已經打開</figcaption>
</figure>

因此，研究 FWA 不能只問「有沒有回購」，而要繼續問：

- 協議實際產生多少收入？
- protocolFeeToTokenBps 當下是多少？
- 買回金額能否承接排放與早期持有人的賣壓？
- external FWA buys 是否開放？市場深度足不足以承受價格發現？
- 沒有每日 1% 排放後，抽卡者還願不願意付 ETH？

最後一題，才是 FWA 的測謊機。

## FWA 真正創新的，不是把 NFT 變成彩券

撇開 FWA 代幣價格，我認為這套協議至少留下三個值得研究的方向。

### 第一，它把 NFT 流動性問題遊戲化

傳統市場要求賣家等待某位買家剛好看中自己的 NFT。FWA 不替每一枚 NFT 精準找買家，而是把所有需求集中到同一個池，再用隨機分配把需求散出去。

它沒有直接解決價格發現，而是繞過「買家必須指定商品」這個限制。

### 第二，它把 NFT 與報價綁成同一個部位

NFT 進入 FWA 後，不再只是收藏品。它同時帶著抽中權重、退出價格、資金占用、費用現金流與隨機終止風險。

這讓 NFT 從靜態物件，變成一份會累積收益、也可能突然結束的金融部位。

### 第三，它把娛樂放進流動性機制，而不是放在旁邊

很多 DeFi 產品像試算表穿上西裝，功能都在，卻沒有讓人想再用一次的理由。

FWA 從相反方向出發：先做成一台讓人手癢的扭蛋機，再把做市、報價、費用、回購與代幣分配藏進齒輪裡。

這也是為什麼，即使 FWA 代幣最後表現普通，它的機制仍可能被別人搬走。隨機分配、預先資助的常駐買價、雙邊補貼與可程式化退出選項，都可以被移植到其他鏈上資產。

## 投資人真正該看的五種風險

### 一、抽卡期望值不是只看擔保金

公式能精確計算 ETH backing，卻不能替每枚 NFT 算出「今天真的賣得掉的價格」。完整期望值還要納入 NFT 可實現價值、VRF 服務費、Gas、滑價、FWA 獎勵與代幣流動性。

看到有人抽中高價 Punk，只能證明頭獎存在，不能證明平均玩家划算。

### 二、NFT 價值是文化市場，不是合約變數

協議知道某個部位放了多少 ETH，不知道市場明天還喜不喜歡那隻猿、那張像素臉或那個企鵝。

數學可以替擔保金定價，不能替品味定價。

### 三、存款人承擔路徑與存活時間風險

高擔保只能降低被抽中的機率，不能保證部位活到平均壽命。早抽中會提早終止費用與代幣累積；新部位持續進場，也會稀釋每個有效部位分到的費用。

### 四、FWA 代幣承擔不對稱的價格發現

初期外部買入預設關閉、賣出保持開放，排放又集中在 15 天。這能塑造取得路徑，卻不能保證代幣具有足以承接賣壓的自然需求。

領到多少顆代幣，和最後能換回多少 ETH，是兩個問題。

### 五、保管安全不等於經濟政策不會變

官方文件表示，管理者不能拿走存款人的 NFT 與擔保金，但可以暫停部分操作、調整經濟參數、管理外部買入與申領閘門、改變未來費用流向。

資產是否會被直接拿走，與遊戲規則會不會改，是兩個不同層次的風險。前者受限制，不代表後者不存在。

## 我會怎麼觀察這台扭蛋機

如果要判斷 FWA 是短期代幣活動，還是一種能留下來的 NFT 市場，我不會先看社群有多興奮，而會看這六個訊號：

| 訊號 | 真正要回答的問題 |
| --- | --- |
| 排放結束後的 acquisition 次數 | 沒有每日獎勵，還有人願意付費嗎？ |
| 活躍部位數與擔保金分布 | 池子是變深，還是只靠少數頭獎撐畫面？ |
| 新增與撤出系列的品質 | 流動性增加時，有沒有一起引入更多低吸引力 NFT？ |
| ETH 結算與 FWA 結算比例 | 使用者是在使用退出報價，還是在追逐代幣曝險？ |
| protocolFeeToTokenBps 與實際買回 | 回購是白皮書裡的可能性，還是鏈上正在發生的現金流？ |
| FWA／ETH 市場深度與外部買入狀態 | 帳面價格能不能承受真實賣壓？ |

這些數據不會像「某人一抽中 Punk」那麼好傳播，但比較接近協議能不能活下去的答案。

## 結論：值得拆解，不值得浪漫化

FWA 是一套很有創意的市場機制。

它把 NFT 抽卡、流動性提供、內嵌買回報價、代幣排放與協議收入，整合成一個讓人想按下去的產品。它甚至把 NFT 市場最尷尬的問題——沒人剛好想買你手上那一枚——改寫成「反正你也不能選」。

很荒謬，但也真的很聰明。

只是創意不等於低風險，熱鬧也不等於可持續。對參與者來說，比較務實的做法，是把抽卡預算當成娛樂費，不要當成期望報酬已知的投資。

尤其不要因為領到 FWA，就先把代幣數量算成回本。那只是把一種風險換成另一種風險，宇宙帳本沒有因此自動對平。

Fake World Assets 真正賣的，或許從來不只是一枚 NFT。

它賣的是流動性、退出選項、等待時間、稀缺感，以及「下一抽也許會不同」的期待。

我會繼續看這台機器怎麼轉。

但先不把錢包交給它替我思考。

<small>視覺說明：封面為 AI 生成概念圖，使用多個 NFT 系列的風格化視覺暗示，不是官方專案圖像或合作背書；三張技術圖為本文原創機制示意與作者試算；兩張實際介面截圖引用自 Bankless，僅作評論與機制說明。</small>

---

## 參考資料

- [Bankless：A Beginner's Guide to Fake World Assets](https://www.bankless.com/read/a-beginners-guide-to-fake-world-assets)（機制導讀與實際介面截圖來源）
- [Fake World Assets：How it works](https://www.fwa.fun/docs/overview)
- [Fake World Assets：Positions & weighting](https://www.fwa.fun/docs/prizes-odds)
- [Fake World Assets：Pricing & allocation](https://www.fwa.fun/docs/pricing-draw)
- [Fake World Assets：Collections](https://www.fwa.fun/docs/collections)
- [Fake World Assets：Settlement](https://www.fwa.fun/docs/winning)
- [Fake World Assets：Fees & protocol revenue](https://www.fwa.fun/docs/fees)
- [Fake World Assets：$FWA](https://www.fwa.fun/docs/fwa)
- [Fake World Assets：Safety](https://www.fwa.fun/docs/safety)
- [Fake World Assets：Parameters](https://www.fwa.fun/docs/config)
- [延伸閱讀：制服女孩上鏈——攝影作品踏入 NFT 世界的第一步]({% post_url 2021-07-17-uniform-girls-nft-debut %})
