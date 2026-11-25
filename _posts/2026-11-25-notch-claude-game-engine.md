---
title: "從「拒絕 AI」到嫌 Claude 不夠快，Minecraft 創作者 Notch 改了什麼主意？"
seo_title: "Minecraft 創作者 Notch 的 AI 轉彎：從地圖編輯器到 Claude 重做遊戲引擎"
date: 2026-11-25
published: true
layout: article
categories: [technical]
tags: [claude-code, game-development, minecraft]
cta_context: agentic
cover_image: /assets/img/linkedin/notch-claude-game-engine.jpg
cover_alt: "概念插畫：Notch 拉下礦坑拉桿，工作台吐出成堆發光方塊，史旺姬接住一塊，比對橋面的缺口。"
hero_image: true
related_posts:
  - ai-faster-engineer-misconception
  - ai-coding-design-boundaries
  - all-code-is-slop-verification-evidence
description: "Minecraft 創作者 Notch 從拒絕 AI 到向 Anthropic 加購額度。沿著地圖工具、舊引擎展示與開發者實驗，看懂他為什麼願意付錢，以及誰來驗收。"
keywords: "Minecraft, Notch, Markus Persson, Claude, 遊戲引擎, AI 輔助開發, Levers and Chests, METR"
---

Minecraft 創作者 Markus「Notch」Persson 有個奇妙的購物需求。11 月 23 日，他公開問 Anthropic，能不能賣他「more unlimited token usage」，順便讓 Claude 回快一點。無限還有更多，這句話出自一位四個月前才公開寫下「Reject AI.」的人。[七月發言紀錄][1]、[十一月貼文與上下文][2]

我對中間那一週最感興趣。七月，Notch 才剛叫大家拒絕 AI，就碰上一件遊戲工作室很平常的事：他需要一套地圖編輯器，人卻一直找不齊。到了十一月，他拿來考 Claude 的題目，已經換成自己以前寫過的遊戲引擎。這兩道題，恰好說明我會在什麼時候把工作交給 AI。[七月的工具構想][1]、[十一月的引擎展示][3]

## 地圖編輯器讓他鬆了口

二月時，Notch 的批評已經指向寫程式這項工作。他把鼓吹 AI 寫程式的人說得相當難聽。等到七月，他把立場壓成一句可以被任何人轉貼的口號。這也給幾個月後的讀者留下了一張現成的對照圖：左邊放七月的拒絕，右邊放十一月的詢價，連註解都省了。[二月與七月發言紀錄][1]

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center" data-conversation="none"><p>7 月 14 日，Notch 寫下「Reject AI.」。</p>&mdash; Notch（@notch） <a href="https://twitter.com/notch/status/2076994141628547245">在 X 上看原貼文</a></blockquote>

7 月 14 日的貼文只有兩個英文字。一週後，Notch 說起工作室的招募困難，提到兩樣想交給 AI 試試的工具：地圖編輯器，以及能把節點關係畫出來的工具。他還開了個玩笑，大意是開除聊天機器人，心裡大概比較好過。當時的報導把話停在「考慮試用」，還沒有工具交到團隊手上的紀錄。[七月發言與報導時間線][1]

這裡可以借一道地牢的門來理解。設計關卡的人希望把門拖到走廊盡頭，存檔，重新打開，門還在原位。這就是一個編輯器可以當場演給同事看的功能。至於玩家打開那扇門時，應該先聽見怪物腳步，還是先看見寶箱？兩種版本的程式都能跑，哪一種更好玩，得讓人走進去才知道。這是我舉的例子，也是我覺得他挑工具當起點很合理的地方。

<figure><img src="{{ '/assets/img/technical/notch-claude-game-engine/timeline.svg' | relative_url }}" alt="7 月 14 日拒絕 AI，7 月 21 日考慮試做工具，11 月 20 日展示舊引擎，11 月 23 日詢問額度與速度。" style="width:100%;height:auto"><figcaption>七月還在列想做的工具，十一月已經拿得出畫面。兩段發言相隔四個月。</figcaption></figure>

## 九月，他已經拿方塊世界做壓力測試

七月還只有一張工具願望清單，9 月 8 日已經有畫面可看了。Notch 貼出一段立體場景，說自己在測一套畫出方塊世界的程式，隨後又特地補一則，說明這是透過對話讓 AI 寫出來的。兩則貼文放在一起才有意思：前一則講他想逼出什麼效果，後一則講他用什麼方法做。[Notch 同日補充開發方式](https://x.com/notch/status/2097181292408287681)

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center" data-conversation="none"><p>9 月 8 日，Notch 展示方塊場景的繪圖壓力測試。</p>&mdash; Notch（@notch） <a href="https://twitter.com/notch/status/2097178507465969692">在 X 上看原貼文</a></blockquote>

他用了一個很長的技術名詞，意思可以拿一間空的地下室來想。假如你要記錄地下室裡每一小格放了什麼，逐格記「空、空、空」很浪費。換個做法，先把整個空間分成八塊，空的區域一次記下，只有擺了東西、需要更多細節的地方才繼續往下分。這就是他提到的稀疏八元樹。玩家遠遠望向洞口時，一大塊岩壁也許已經夠用；靠近時才有理由把輪廓畫細。方塊看起來簡單，決定要算到多細，恰好很考驗畫圖的程式。

Notch 說這次連每一輪畫面怎麼算都不用逐步交代。但請留意他已經替模型做了哪些決定：世界要怎麼表示、資料從哪裡來、這次要把細節推到什麼程度。他可以少寫一大段實作，仍然掌握這個實驗要考什麼。這讓我重新理解他七月說的「試試看」：到了九月，他挑的題目已經足夠具體，做壞了自己看得出來。

## 十一月，出題的人寫過原版

11 月 20 日，Notch 展示一個由立體小格子組成的世界。他說，他把以前一套引擎能做什麼描述給 Claude 聽，請它從頭實作，連當年來不及做的功能也一起交代。他解釋，這些位在格子裡的物件可以用來表現樹、風車或火焰。他也提醒觀眾，畫面還有接縫問題。[展示內容整理][2]、[India Today 交叉報導][3]

重做舊引擎有個新專案很難複製的條件：出題的人記得舊版怎麼動。一座風車出現在正確位置，先回答了「物件能放進場景嗎」。走近、繞到背後，再退到遠處，才有機會發現哪個角度會露出接縫。若要加上舊版沒有的新功能，這份記憶能幫的忙就少一些，得另外說清楚什麼表現算合理。**同一套引擎裡，重現舊行為和發明新玩法，需要兩種驗收方式。**

三天後，Notch 開口要買更多額度，也要更快的回應。Token 是模型讀寫文字時切分的小單位。多給用量，長時間來回修改比較不容易被迫中斷；回得更快，才會縮短每一輪等候。對一個正盯著風車接縫、想立刻試下一版的人，這兩項服務各有價值。至於他正在做的地牢遊戲《Levers and Chests》，可以從個人簡介確認；那則詢價貼文本身沒有點名專案，也沒有公布開發工時。[詢價原文轉錄][2]、[專案背景][3]

## 從一段引擎影片，到一個笑臉和一張徵人啟事

回頭看 11 月 20 日的原貼文，還有一個很容易在轉述時消失的細節。Notch 說，匯入方塊模型檔案的功能已經做過，這一次重寫沒有包含它。這直接影響怎麼看影片。假設你要接手這個專案，畫面中出現一棵樹，你還會想知道它怎麼讀進來、換一棵樹能不能用、哪些舊工具仍要保留。把影片拿來看效果很合適，要據此估算移植工作量，就得先問清楚邊界。

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center" data-conversation="none"><p>11 月 20 日，Notch 附上舊引擎重做的展示，並列出這次涵蓋的工作。</p>&mdash; Notch（@notch） <a href="https://twitter.com/notch/status/2123893577873010869">在 X 上看原貼文</a></blockquote>

三天後，詢價貼文把兩個有點抽象的工程問題濃縮成一句人人都看得懂的「我願意付錢」。「可以多用一些」關係到做一半會不會停；「可以再快一點」關係到剛剛看見的問題，能不能趁自己還記得怎麼重現就改完。假設明天要請同事一起看地牢場景，前者會影響今晚能試幾個版本，後者會影響每次失敗之後，還能不能留在同一條思路上。

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center" data-conversation="none"><p>11 月 23 日，Notch 公開向 Anthropic 詢問更高用量與更快回應。</p>&mdash; Notch（@notch） <a href="https://twitter.com/notch/status/2124956108687298792">在 X 上看原貼文</a></blockquote>

馬斯克在下面留了一個 😂。我會把這個表情留給讀者自己看。它確實給這段對話添了喜感，但光靠一個笑臉，猜不出他究竟是在笑「更多的無限」、笑 Notch 轉彎，還是單純覺得這句話好玩。[馬斯克的原始回覆](https://x.com/elonmusk/status/2125268089361035505)

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center" data-conversation="none"><p>11 月 24 日，Notch 回覆：「Yeah, I changed my mind.」</p>&mdash; Notch（@notch） <a href="https://twitter.com/notch/status/2125326211559661640">在 X 上看原貼文</a></blockquote>

隔天事情上了新聞，Notch 先開玩笑請大家等遊戲真的做出來再買，緊接著話鋒一轉，邀比他更懂電腦科學、又能謙虛合作的人來找他。那張徵人啟事，才是這個故事最巧的結尾。七月他因為難找人而想試工具，十一月已經用到想加購，職缺卻還在。他想買更多模型的時間，也願意付錢買另一個工程師的判斷。

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center" data-conversation="none"><p>11 月 25 日，Notch 談自己成了新聞，也公開邀人一起工作。</p>&mdash; Notch（@notch） <a href="https://twitter.com/notch/status/2125506271835046211">在 X 上看原貼文</a></blockquote>

## 一個閃了好幾年的像素，怎樣才算修好？

Notch 還講了一件比詢價更接近工程現場的事。他說，舊程式裡有個像素會閃的老毛病，Claude 從頭寫的版本竟然也有，後來才讓它修好。他高興到請 Claude 做成有局部放大圖、用紅圈圈出問題的報告，接著自己補一句，大概永遠不會讀。這是他的除錯紀錄；光憑貼文，我們看不到修改前後在各種裝置上的表現。[Notch 的除錯回憶](https://x.com/notch/status/2125533997908578459)

更值得讀的是他下一則回覆。他列了好幾個湊在一起的原因，包括表面朝向在某些位置無法平順變化、計算過程中的捨入誤差，以及顯示卡程式語言沒有規定結果的行為。其中一項精度問題，他說自己以前就處理過。這讓「Claude 幫他修了多年的問題」多了一層意思：模型拿到的是一個已經有人追過、能重現、還能用兩套實作交叉觀察的問題。[Notch 補述技術原因](https://x.com/notch/status/2125534981954978278)

如果是我的團隊接手，我會把紅圈報告改成一段誰都能重跑的鏡頭移動。同一座風車、同一段路，先錄下原版閃爍的位置，再讓新舊版本各走一遍。接著換個距離和角度，看修正會不會換個地方又閃起來。這些是我會加的驗收步驟。它也說明，能指揮 AI 寫新功能，和能證明某個老問題終於消失，實際上要準備不同的材料。

## 把原始碼遮起來，寫過程式的人還有優勢嗎？

Notch 後來直接回了一句「Yeah, I changed my mind.」他在另一則回覆裡也舉了一個例子：畫面要把資料送給顯示卡，他對 Claude 把資料位置寫成固定數字的做法有意見。這個細節比一句表態更能說清楚他現在的立場。今天的位置寫死了，明天資料排列一改，就得有人知道該回頭找哪幾個數字。[Notch 的公開回覆紀錄][8]

蘇黎世聯邦理工學院的研究團隊把這個問題做成一道考題。100 名大專學生使用同一套 AI 開發工具，只能打字描述需求、操作做出來的程式，再要求修改。有一題給他們看一個應用程式，刻意拿掉熟悉的用途和名稱。他們得自己去按、去試，推敲畫面背後的規則，再讓 AI 重現。每題限時 15 分鐘，最後看功能做對多少。[CHI 2026 論文，任務設計與實驗方法][7]

學生的資工測驗與寫作成績，都能預測三題的整體表現。兩項合起來解釋了樣本中 20.8% 的分數差異；把一般推理測驗成績也考慮進去後，資工成績和任務表現的關聯仍達統計顯著，寫作的關聯則未達門檻。研究量的是這群學生之間的差異，無法據此算出多學一年程式會進步多少，也無法拿來估 Notch 省下幾天。[論文第 8 節與表 3][7]

回到風車，我會這樣區分兩種本事。看出「轉動視角才會露縫」，需要想得到該試哪個動作；把「畫面怪怪的」改寫成「站在風車背面，向左移一格，葉片與軸心之間會透光」，需要把觀察說清楚。這是我設想的回報範例。即使兩個人手上有一模一樣的 Claude 額度，他們能帶回去修的線索，也可能差很多。

### 學生眼前究竟有什麼？

<figure><a href="{{ '/assets/img/technical/notch-claude-game-engine/eth-study-interface.webp' | relative_url }}"><img src="{{ '/assets/img/technical/notch-claude-game-engine/eth-study-interface.webp' | relative_url }}" width="3099" height="1699" style="width:100%;height:auto" alt="ETH 實驗平台的對話與應用程式預覽畫面。學生輸入要求、操作產出，再決定下一輪要改什麼。"></a><figcaption>點圖可放大查看實驗介面。Sverrir Thorgeirsson、Theo B. Weidmann、Zhendong Su，<a href="https://arxiv.org/html/2603.14133v1#S5.F4">論文圖 4</a>，依 <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> 使用，僅轉換圖片格式。</figcaption></figure>

看這張介面，比讀「自然語言開發」六個字容易。學生可以拿自己的成品來操作，再回對話欄要求修改。想像你交出一個週末餐點規劃器：選餐後看見熱量總數變了，還得再把餐點移除，看數字會不會回去。倘若只交代「照著做一個差不多的」，模型可能畫得很像，直到有人取消一餐，才發現帳根本算不回來。這個操作例子是我的，研究者實際採用的則是預先訂好的功能評分規準。[論文第 3、7 節][7]

<figure><img src="{{ '/assets/img/technical/notch-claude-game-engine/eth-tasks.svg' | relative_url }}" alt="滿分換算為 100 分，重做範例平均 46 分、增加功能 55 分、從無用途提示的介面還原規則 34 分。" style="width:100%;height:auto"><figcaption>三題各給 15 分鐘。依論文表 2 的平均分數乘以 100 重繪；這是功能得分，並非完成任務的人數比例。</figcaption></figure>

我覺得三題中最接近 Notch 的，是重做一個已知範例。對學生來說，能試的只有眼前的介面；對 Notch 來說，舊引擎的行為之外，還多了一份「我當年為什麼這樣寫」的記憶。反過來看，當題目拿掉熟悉的用途，學生還得先猜出畫面在幹嘛，這題的平均分數只剩 34 分。三道題的內容各不相同，這個差距不能單獨歸因於拿掉用途提示，但它很適合拿來提醒帶團隊的人：把工作交出去時，多留一個可操作的舊範例，接手的人就多一個可以拿來問問題的對象。[論文表 2][7]

論文裡還有一個容易被誤讀的數字：資工的獨立解釋量約是寫作的兩倍。這句話值得拆開讀。研究者先把寫作成績放進模型，再加資工分數，多解釋了約 12.5 個百分點的表現差異；把加入的順序反過來，寫作多解釋約 5.9 個百分點。這個比值不能當成面試評分權重。真要觀察一位應徵者，我反而想拿同一個壞掉的場景給他，看他先試哪一步，又怎麼向下一個同事描述自己看到的錯誤。[論文第 8.2 節][7]

## 工程師覺得省了時間，碼表怎麼說？

研究機構 METR 做過一個很像樣的對照。2025 年上半年，16 位熟悉自家開源專案的開發者，拿出 246 件原本就要做的工作，隨機分派哪些可以用 AI。動手前，大家預期能少花 24% 的時間；做完再問，他們仍估計省了 20%。實際記錄下來，允許用 AI 的任務平均多花了 19% 的時間。這批人主要用 Cursor 搭配當時的 Claude 3.5 或 3.7 Sonnet。[METR 實驗設計與結果][4]

<figure><img src="{{ '/assets/img/technical/notch-claude-game-engine/time.svg' | relative_url }}" alt="以不用 AI 的工時為 100，事前預估為 76，事後體感為 80，實際工時為 119。" style="width:100%;height:auto"><figcaption>把不用 AI 的工時設為 100，將 METR 公布的相對變化換算成同一把尺。前兩條是受試者估計，最後一條才是實測。資料見 METR 初次實驗。</figcaption></figure>

故事還有下半場。研究團隊想用更新的工具再測一次，卻碰到招募問題：有些開發者已經不願意抽到「這題不能用 AI」，也有人把自認最適合 AI 的工作留在實驗外。當最有可能受益的人和任務都可能缺席，研究就很難估出工具究竟幫了多少。METR 在 2026 年 2 月公開說明了這個限制。[METR 後續實驗紀錄][5]

把這兩次實驗擺回 Notch 身邊，我會保留兩個判斷。第一，他願意付錢，足以說明多試幾次對他有價值。第二，若團隊要拿這個故事編下一季人力預算，仍得量自己的工時。受試者修的是成熟專案裡的問題，Notch 展示的是重建中的引擎。兩邊連「做完」的條件都不一樣。

## 亞洲和美國的差距，問卷到底問了什麼？

Ipsos 在 2026 年 3 月 20 日至 4 月 3 日訪問 32 國共 23,532 名成人，請他們表態：「使用 AI 的產品和服務讓我感到興奮。」中國受訪者有 83% 同意，印度 79%，美國 33%。同一份問卷裡，印度也有 63% 同意這類產品讓自己緊張。這兩題分開統計，無法從總數認出哪些人兩題都勾了同意。[Ipsos 原始問卷與各國表格][6]

這讓我對「亞洲人務實，美國人反 AI」這種解讀有所保留。買工具的開發者、評價遊戲美術的玩家、回答問卷的消費者，各自在回答不同的問題。同一個人完全可能期待地圖編輯器幫忙，又很在乎遊戲裡的畫是誰畫的。從一串留言猜整個地區的態度，比從一張風車截圖猜整套引擎的品質還難。

## 我會先拿一道門試額度

如果我要替小團隊決定要不要多買一個月，我會先挑一個真的有人在等的工具，例如前面那個地圖編輯器。請關卡設計者留一張舊地圖，寫下三件他明天就要做的事：開舊檔、挪一扇門、存檔重開。再請開發者留一張故意缺資料的地圖，看工具能不能指出哪裡壞了，同時保住原檔。

我會從提出需求開始計時，到同事能自己完成這四件事才停。期間另外記下等模型、修錯、等額度恢復各花多久。假如人常常停在額度上限前，卻能迅速驗過每一次修改，加購就有了具體理由。要是大半天都在追查存檔為什麼吃掉那扇門，我會先把那張會出錯的地圖留成固定測試。

我喜歡 Notch 問得很坦白：他有東西想做，也願意花錢再試一次。我更想保留他展示時那個小動作——先提醒大家，畫面的接縫還有問題。能指出哪裡沒接好的人，才有辦法替下一輪修改出題。

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## 參考資料

1. [七月的兩次發言與開發工具][1]
2. [十一月引擎展示與額度貼文][2]
3. [引擎展示交叉查核][3]
4. [METR 初次實驗][4]
5. [METR 後續招募與選擇偏差][5]
6. [Ipsos 各國同題調查][6]
7. [CHI 2026：資工與寫作能力如何預測 AI 輔助開發表現][7]
8. [Notch 談改變想法與圖形程式的實作細節（公開貼文鏡像）][8]

[1]: https://bunpav.com/blog/notch-vibe-coding-reversal-levers-and-chests
[2]: https://runtimewire.com/article/minecraft-creator-asks-anthropic-for-more-claude-tokens-than-its-plans-will-sell
[3]: https://www.indiatoday.in/amp/technology/news/story/minecraft-creator-asks-anthropic-for-unlimited-ai-tokens-says-he-is-building-something-never-seen-before-3045816-2026-11-24
[4]: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
[5]: https://metr.org/blog/2026-02-24-uplift-update/
[6]: https://resources.ipsos.com/rs/297-CXJ-795/images/Ipsos-AI-Monitor-2026.pdf?version=1
[7]: https://arxiv.org/html/2603.14133v1
[8]: https://www.sotwe.com/notch
