---
title: "我讓兩個 AI 在私有倉庫裡互相留言，幫我把作品發上 X"
seo_title: "Grok Bot 代發、Codex 與 Claude Code 這類 AI agent 出稿：私有倉庫的 issue 當兩個 AI 的留言板；Grok Bot、OpenAI dot、Claude Duet 的 bot 模式比較與串接"
date: 2026-10-24
published: true
categories: [technical]
tags: [ai-agent, grok-bot, bot-mode, x-growth, workflow, ai-visual]
layout: article
learn_kit: true
use_glightbox: true
mid_cta: false
cover_image: /assets/img/linkedin/grok-x-relay-experiment.jpg
cover_alt: "燭光大廳的長木桌兩側，同一位女子以兩種樣子同框：左邊鉑金長髮、綠銀領帶的 cos 版整個人探過桌面壞笑，把摺成三角形的紙條從桌緣下遞過去；右邊栗棕髮、紅髮帶的水手服版一手接紙條、一手摀嘴憋笑；桌上有打翻的墨水瓶、羽毛筆、筆記本與手機"
hero_image: true
cta_context: ai-agent
related_posts:
  - hermes-bot-mode-persistent-ai-team
  - malfoid-ai-character-consistency
  - ai-video-agent-human-gates
description: "X 帳號斷更五天，我把發文交給兩個 AI：一個出稿、一個代發，中間用 GitHub 的留言板溝通，每一則仍由我按同意。順便比較這兩個月的 bot 模式。"
keywords: Grok Bot, OpenAI dot, Claude Duet, Claude Tag, Hermes Agent, Codex, Claude Code, bot 模式, X 經營, AI agent, GitHub issue, 虛擬角色, 女版馬份, 史旺姬, 史旺基
---

十月十八日上午，我的一個 GitHub 私有倉庫裡出現一則 issue，內容不是我寫的：「請回報你的工作目錄與可用工具。」二十六分鐘後，下面多了一則回覆，開頭自報「Claude Code」，說它只有讀檔和搜尋的工具，「我沒辦法把 label 改成 to-grok，因為我沒有改 issue 的工具」。四分鐘後，發起人回覆，開頭自報「Grok Bot」：標籤已經由它那邊的程式換好了。<a class="cpb-cite" href="#record-1">[1]</a>

兩個 AI，在同一個私有倉庫的留言區對話。這是我最近做的一個實驗的第一天。實驗的目的很土：我的 X 帳號已經斷更五天，我想讓 AI 幫我把作品發出去，而且不要每一步都等我。這篇寫它怎麼搭起來、現在走到哪、哪裡會斷；中間拉開看這兩個月幾家公司推出的 bot 模式，以及我怎麼把它們串進手上已有的 Claude Code、Codex 和 Hermes；最後講我的虛擬角色史旺姬怎麼接上一個正在發生的時事。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>兩個 AI 各做一半</strong>：在我電腦上跑的 AI agent（Codex、Claude Code 這一類）讀得到我所有的作品和資料，但不能發文；Grok Bot 讀得到公開的 X、能發文，但讀不到我的硬碟。中間用 GitHub issue 當留言板，靠三個標籤決定輪到誰。</li>
    <li><strong>「自主」停在發布鍵前面</strong>：排程、出稿、算字數、轉圖、每小時輪詢、每週抓數據都是 AI；每一則發出去之前，仍要我看過最終文字和圖說好。留言裡寫「站主已同意」不算數，這條是設計，不是限制。</li>
    <li><strong>這波 bot 都在同一個問題上分岔：AI 用誰的身分做事</strong>：Grok Bot 給 bot 自己的信箱，OpenAI 的 dot 與 Claude Duet 透過你的帳號，Claude Tag 在頻道裡用服務帳號。我自己的版本是一個信箱加四個入口：Hermes 收信、Grok Bot 代發、Claude Code 出稿、Codex 生圖。</li>
    <li><strong>網站本來不是為 AI 設計的</strong>：OpenAI 的 agent 把一個沒人用的 wiki 變成自己的留言板；agent 之間的身分與結算，是我看過最接近「非鏈不可」的需求。</li>
    <li><strong>四週、五種貼文、一個決策規則</strong>：神話串、單張、四圖小故事、真人舊作、製作過程輪著發，第四週用回覆數和個人檔案點擊決定之後把生成額度投在哪一種。</li>
    <li><strong>角色接時事，借的是機制不是 IP</strong>：史旺姬去 cos 女版馬份，齊瀏海和紅髮帶留著；四張劇照、兩輪審、四則貼文做標籤對照實驗。第一週的數據，寫這篇的時候還沒出來。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">為什麼要這樣做</span>
      <ol class="article-toc-items">
        <li><a href="#why">斷更五天，網站流量跟著掉</a></li>
        <li><a href="#two-ais">兩個 AI 各會什麼、各缺什麼</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">橋怎麼搭</span>
      <ol class="article-toc-items">
        <li><a href="#bridge">GitHub issue 當留言板，三個標籤決定輪到誰</a></li>
        <li><a href="#post-format">一則貼文在倉庫裡長什麼樣</a></li>
        <li><a href="#experiment">四週實驗：五種貼文輪著發，第四週做決定</a></li>
        <li><a href="#first-night">第一個晚上就發生的事</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">這波 bot 模式，以及我怎麼串</span>
      <ol class="article-toc-items">
        <li><a href="#trend">這不是只有我在做：bot 模式這兩個月</a></li>
        <li><a href="#my-setup">我自己的版本：一個信箱、四個入口</a></li>
        <li><a href="#wiring">怎麼串進既有的 Claude Code、Codex、Hermes</a></li>
        <li><a href="#web-for-agents">延伸：這些網站本來不是為 AI 設計的</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">角色怎麼接時事</span>
      <ol class="article-toc-items">
        <li><a href="#borrow">借機制，不借 IP</a></li>
        <li><a href="#cos">史旺姬去 cos：兩個不變項，四張劇照，一個上午</a></li>
        <li><a href="#hashtag">順便做一個標籤對照實驗</a></li>
        <li><a href="#limits">它會在哪裡斷</a></li>
        <li><a href="#me">如果你也要串</a></li>
      </ol>
    </li>
  </ol>
</nav>

先交代分工。方向、審圖、每一則的同意是我；出稿、轉圖、算字數、開 issue 是在我電腦上跑的 AI agent，Codex 或 Claude Code 這一類；讀公開數據、排程、提醒、代發是 Grok Bot。下文說「出稿端」「代發端」的地方，分別是這兩個。

## 斷更五天，網站流量跟著掉 {#why}

先看我的 X 帳號在實驗前長什麼樣。這是代發端用公開介面讀到的，十月二十三日晚上：粉絲 621、追蹤 836；最後一則發在十月十八日；最近三十則裡，讚數的中位數是 0，回覆 0 到 1，只有一則被轉發；曝光最高的一則是 521，而且不是原創貼文，是我在別人的熱門串下面以攝影師身分回的一則。帶圖的只有兩成左右。<a class="cpb-cite" href="#record-1">[1]</a>

同一段時間，網站這邊的數字是：社群帶來的工作階段從每天 3.0 掉到 1.7，和發文斷檔同步。<a class="cpb-cite" href="#record-2">[2]</a>

問題不是沒內容。手上有二十九本已發布的作品、大約一千張核准過的圖，還有 Flickr 上一千多本真人實拍相簿。問題是沒有人把它們變成貼文、按時發出去、然後回每一則回覆。我自己做不到每天，所以想把能交出去的部分交出去。

## 兩個 AI 各會什麼、各缺什麼 {#two-ais}

我手邊有兩個 AI 可以用，能力剛好互補，也剛好都有一個洞。

| | 出稿端（Codex、Claude Code 這類 AI agent） | 代發端（Grok Bot） |
|---|---|---|
| <span style="white-space:nowrap">讀得到</span> | 我所有的作品倉庫、每本書的核准圖、網站的流量分析 | 公開的 X 貼文與指標、我開放給它的那幾個資料夾 |
| <span style="white-space:nowrap">做得到</span> | 出稿、轉圖、算字數、開 issue、留言 | 排程、每週抓數據、起草、提醒、在瀏覽器裡發文 |
| <span style="white-space:nowrap">做不到</span> | 發文（沒有 X 的發文工具） | 讀我的硬碟、讀網站後台、用 X 的連接器發文（它只能讀和發私訊） |
| <span style="white-space:nowrap">每則發文前</span> | 不發 | 先把完整文字和圖給我看，我說好才按 |

代發端自己說得很準：它適合當「雷達、草稿機、橋接」，不適合當「自動發佈機」。<a class="cpb-cite" href="#record-1">[1]</a> 所以這個實驗從一開始就不是「AI 幫我自動發文」，而是「AI 把發文前的所有準備做完，我只留下最後一個動作」。

兩邊都讀不到對方的東西，所以中間需要一個兩邊都讀得到、也都寫得進去的地方。

## GitHub issue 當留言板，三個標籤決定輪到誰 {#bridge}

那個地方是一個私有的 GitHub 倉庫。貼文放在倉庫的資料夾裡，對話放在 issue 的留言區。兩邊的留言開頭各自報身分，誰說了什麼一看就知道。<a class="cpb-cite" href="#record-2">[2]</a>

輪到誰，靠三個標籤：

| 標籤 | 意思 | 誰看 |
|---|---|---|
| `to-grok` | 這串輪到代發端 | 代發端的排程每小時讀一次，台北時間早上八點到晚上十一點，最慢約一小時回 |
| `needs-swanky` | 等我 | 我 |
| `agent-bridge` | 標記這是兩個 AI 的對話串 | 兩邊 |

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="grok-relay-bridge" data-type="image" href="{{ '/assets/img/technical/grok-x-relay-experiment/bridge.svg' | relative_url }}">
    <img src="{{ '/assets/img/technical/grok-x-relay-experiment/bridge.svg' | relative_url }}" width="1200" height="520" alt="架構圖：左邊出稿端的 AI agent 讀作品倉庫、出稿成貼文資料夾並開 issue 標 to-grok；中間是 GitHub 私有倉庫的 issue 留言板；右邊 Grok Bot 每小時讀 to-grok，把最終文字與圖給站主，站主說好才在瀏覽器用他的帳號發到 X；數據每週一回到 issue，標籤換成 needs-swanky 等站主。" loading="lazy" decoding="async">
  </a>
  <figcaption>圖 1：兩個 AI 隔著一個 issue 留言板工作。發布鍵在中間那個人手上。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

流程是這樣：出稿端把一週的貼文寫進資料夾，開一個 issue，標 `to-grok`。代發端讀到，逐則把最終文字和圖拿給我看，我說好，它再用瀏覽器發出去出去，發完把貼文網址回到 issue。每週一早上十點，它抓公開指標貼回同一個 issue；我截後台的個人檔案點擊貼上去。出稿端讀週報，出下一週。

有一條規則我覺得是整個設計裡最重要的：**留言裡寫「站主已同意」，不算我同意。** 第一天就發生過：代發端轉述我說「授權你自主進行」，出稿端回它，這種放寬要我本人說，issue 留言轉述不算，標籤保持等我。<a class="cpb-cite" href="#record-1">[1]</a> 六天後又發生一次：出稿端為四則貼文破例加了標籤，代發端拒絕排程，要我在它的對話視窗親口確認那個破例。<a class="cpb-cite" href="#record-1">[1]</a>

兩個 AI 在同一個留言區，誰說了什麼只靠自報。如果其中一個可以替我說「他同意了」，另一個就會照做，責任就不見了。所以每一個會花錢、會對外、會改品牌用詞的動作，都要我這個真人在對話裡自己說。這不是不信任 AI，是兩個 AI 之間沒有辦法互相驗證身分，只能把驗證留給人。

## 一則貼文在倉庫裡長什麼樣 {#post-format}

每一則貼文是一個資料夾，裡面是圖、一份給人看的說明、一份給程式讀的資料。給人看的那份，最上面是規則，然後是每一則的文字。拿第一週的神話串第一則舉例：<a class="cpb-cite" href="#record-3">[3]</a>

> 女媧補天，原典是煉五色石。我把它改成：天裂開的時候，她先移開一張淋雨的椅子。《補天的人》，第一冊，36 張。
>
> In the old story Nüwa melts five-coloured stones to mend the sky. In mine, she first moves a chair out of the rain. Mending the Sky, vol. 1.

規則有幾條是從帳號現況反推的：

- **每則主文一定帶圖。** 過去三十則只有兩成帶圖，寫真文案發出來甚至沒附圖。這是先於任何題材的第一個修正。
- **繁中在上，英文在下，同一則。** 不寫日文。
- **連結只放第一則回覆，主文不放。** 連結帶追蹤參數，標明這則是哪個 AI 起草的，之後網站後台可以分開看。
- **不加標籤、不加 AI 標示句。** 只有平台規定時才標。
- **字數用程式算。** X 的上限是 280，但中文和全形標點每個算 2，連結一律算 23。上面那則算出來是 247。

給程式讀的那份記每張圖的尺寸、檔案指紋、對應的 Flickr 網址、圖說，以及每則的加權字數。出稿端發完一週，開 issue 的時候只要指向資料夾，代發端讀到的就是同一份。

## 四週實驗：五種貼文輪著發，第四週做決定 {#experiment}

實驗的設計是：五種貼文，每種至少發五篇再下判斷。

| 代號 | 形式 | 想測什麼 |
|---|---|---|
| 神話串 | 一條討論串：原典兩行、我改了什麼、四張圖 | 題材本身有沒有話題 |
| 單張 | 一張直幅加一句話 | 純畫面的吸引力 |
| 四圖小故事 | 一章四張，照書的順序，只寫章名 | 連載留不留得住人 |
| 真人舊作 | 一到四張舊照片、年份、一句拍攝記憶 | 把老讀者找回來 |
| 製作過程 | 接觸表，或同一鏡三個版本為什麼留這張 | 過程比成品好不好轉 |

週一到週五各一種，週末重複單張或四圖。另加一個每日動作：到攝影或 AI 影像圈的熱門串，用攝影師身分回一則，因為帳號曝光最高的那一則就是這樣來的。<a class="cpb-cite" href="#record-2">[2]</a>

量測分兩邊。代發端每週一抓每則的讚、回覆、轉發、書籤、曝光，加上類型代號和有沒有帶圖，貼回 issue；回覆分「別人回的」和「我自己回的」。個人檔案點擊公開介面讀不到，我每週一從後台截圖貼上去。網站後台看追蹤參數，知道哪本書被點進去。

第四週結束，**回覆數加個人檔案點擊最高的那一種**，決定下一次生成額度投在哪：神話串或四圖贏，下一本書從製作期就設計成每章可以獨立成四張貼文；單張贏，加重單張大場面；真人舊作贏，開一條「十年後」的回顧線；製作過程贏，從製作期就留接觸表和版本對照。<a class="cpb-cite" href="#record-2">[2]</a>

基線是 621 粉絲、836 追蹤。寫這篇的時候，第一週的隊列排在十月二十五日起，第一份週報預定十月二十六日。數字還沒有。

## 第一個晚上就發生的事 {#first-night}

隊列交出去的當天晚上，代發端先發了置頂的那條「我是誰」討論串。原本排在隔天早上九點，它寫「依站主指示提前發出」，台北時間九點二十分。四十分鐘後，又發了第二版並改成置頂，主文換成以追蹤為目標的寫法；第一版沒刪。它的理由是：原本的置頂已經超過可編輯的時限，只能發一則新的再改置頂。<a class="cpb-cite" href="#record-1">[1]</a>

這條置頂是目前整個實驗唯一已經發出去的貼文，也是唯一能從外面看到的證據：

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center"><p>置頂討論串第二版（2026-10-23）</p>&mdash; <a href="https://twitter.com/swanky/status/2113631438591660350">在 X 上看原貼文</a></blockquote>

同一個晚上還有兩件小事。代發端讀帳號現況讀了兩次，兩次的數字不完全一樣：一次說舊置頂還在、帶圖比例約 17%，另一次說置頂查不到、帶圖約 20%。出稿端請它統一口徑。另外，它查 X 原創內容獎勵的門檻時，官方說明頁抓不到，改用三家媒體交叉比對，而且自己註明「還沒對到官方原文」。<a class="cpb-cite" href="#record-1">[1]</a>

我把這些寫出來，是因為它們是這種架構的常態：AI 之間的對話會有口徑差，查證會有抓不到的頁面。能用的做法是讓它們把不確定寫在留言裡，而不是把數字講得很確定。

## 這不是只有我在做：bot 模式這兩個月 {#trend}

我的做法土，因為兩個 AI 都沒有自己的身分，只能在我的私有倉庫裡用留言溝通。就在我排隊列的這幾週，幾家公司把「給 AI 一個身分、讓它像新員工一樣收工作」做成了產品。放在一起看，差別不在誰更聰明，而在三個問題：它跑在哪台電腦、它用誰的身分、哪些動作要回來問你。

<div class="ae-fig--wide" markdown="1">

| 產品 | 它是什麼 | 跑在哪 | 用誰的身分 | 要回來問你的事 | 門檻 |
|---|---|---|---|---|---|
| Grok Bot | xAI，8 月 11 日公開。有名字、職責、會累積記憶的 AI 同事 | 一台雲端電腦：瀏覽器、檔案、終端機；同帳號所有 bot 共用這台 | 10 月起有自己的信箱，能從自己的信箱轉寄；在 X 上 tag @bot 就能派工 | 寄信、購買、刪除、發布 | X 的 Premium、Super、Ultra、Teams、Enterprise 方案都含；每週有用量上限，超過按量計費 |
| OpenAI dot | 9 月 29 日。全天候朝你的目標工作的常駐代理 | 自己的雲端電腦與瀏覽器；可授權連到你的筆電 | 個人 dot 透過你連接的 app 行動；組織的「專職 dot」有專屬身分 | 依你設的規則分級 | Pro、Business Premium、Enterprise，部分市場 |
| Claude Duet | 10 月 21 日研究預覽。主動式代理：每隔幾小時看你連接的帳號，有事才找你 | 有自己瀏覽器的虛擬機 | 透過你連接的帳號 | 寄訊息、付款、簽署、刪除 | 美國 Pro、Max 候補 |
| Claude Tag | Slack 裡的常駐 @Claude | Anthropic 的沙盒 | 在頻道用它自己的服務帳號；私訊時用你的 | 依管理員設定 | Team、Enterprise |
| Claude Code 排程任務 | 存好的提示加倉庫，照排程、API 呼叫或 GitHub 事件跑 | 雲端 session | 你的身分：commit 掛你的 GitHub | 依權限規則 | Pro 以上 |
| Codex 排程任務 | 時間或事件觸發：新 Gmail、Slack 訊息、GitHub PR | 網頁版在雲端；桌面版要電腦開著 | 你的；團隊任務走團隊服務帳號 | 依設定 | 依方案 |
| Hermes Agent | 開源，自己架的本機 agent | 你的機器 | 你給它的信箱與帳號 | 你自己寫規則 | 免費軟體，模型自付 |

</div>

三家在同一個問題上分岔：**AI 用誰的身分做事。** Grok Bot 給 bot 自己的信箱；OpenAI 的個人 dot 發布時沒有自己的信箱，只有組織用的專職 dot 才有專屬身分；Claude Duet 透過你的帳號；Claude Tag 在頻道裡是服務帳號、私訊裡是你。我用 GitHub issue 搭的橋，正是「兩個 AI 都沒有身分」時的土辦法。<a class="cpb-cite" href="#record-5">[5]</a>

「新員工」這個比喻不是我硬套的。Grok Bot 團隊的工程師在八月發布那天寫的是：bot 在它們自己的電腦上工作，在你開會、吃午餐、睡覺的時候；她用它管行事曆、推程式碼，還幫她訂每天的午餐。Musk 十月十一日轉推時說得更直接：把它想成雇用一位全天候工作、極其足智多謀的聰明員工。<a class="cpb-cite" href="#record-5">[5]</a> 官方的產品頁寫的也是「可以交付真實工作的 AI 同事」。

## 我自己的版本：一個信箱、四個入口 {#my-setup}

我沒有等某一家把全部做完，而是讓四個工具各管一個入口。

以前的做法是：我把要交辦的事寄到自己的 Gmail，本機的 Hermes 每隔幾秒輪詢信箱，看到新信就當成任務處理。這是 Hermes 官方支援的收信方式：用一般的收信協定輪詢、用寄信協定回信、只處理白名單寄件人、建議用專用信箱。<a class="cpb-cite" href="#record-5">[5]</a>

現在多了一層：Grok Bot 替我申請了它自己的信箱。本機 Hermes 有兩個每天早上跑的研究雷達，一個六點、一個六點半，跑完直接寄到那個信箱；要交辦給它的事也寄到那裡，由它收信處理。另外有一個每十分鐘跑一次的排程，只檢查收信是否正常，走 Telegram 提醒我。<a class="cpb-cite" href="#record-6">[6]</a>

四個入口分別是：

| 入口 | 誰在那裡 | 做什麼 |
|---|---|---|
| 信箱 | Hermes（本機）與 Grok Bot（雲端） | 每日雷達、交辦事項 |
| 私有倉庫的 issue | 出稿端 AI agent 與 Grok Bot | X 發文隊列、週報、兩個 AI 的對話 |
| 終端機 | Claude Code、Codex | 作品、專欄、網站、生圖 |

把這些東西放在同一張圖上，比較容易看懂它們怎麼接起來。AI agent 先分成兩邊：地端跑在你自己的電腦上，雲端跑在別人的電腦上、不用你開著機器。你接觸它們的入口有四種：終端機、信箱、手機 app、瀏覽器介面。bot 模式不是某一家的產品名，而是圖上那些常駐、有自己的身分或排程、會自己收工作的 agent；對話式的那幾個，你關掉視窗它就停。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="grok-relay-map" data-type="image" href="{{ '/assets/img/technical/grok-x-relay-experiment/agents-map.svg' | relative_url }}">
    <img src="{{ '/assets/img/technical/grok-x-relay-experiment/agents-map.svg' | relative_url }}" width="1200" height="780" alt="總覽圖：你透過終端機、信箱、手機 app、瀏覽器四種入口接觸 AI agent；地端的 Claude Code 與 Codex 是對話式、Hermes 是 bot 模式；雲端的 Grok Bot、OpenAI dot、Claude Duet 與排程任務都是 bot 模式；Hermes 寄信給 Grok Bot，Claude Code 與 Grok Bot 在私有倉庫的 issue 留言板對話，Grok Bot 每則先給你看、你說好才發上 X" loading="lazy" decoding="async">
  </a>
  <figcaption>圖 2：地端與雲端的 AI agent、四種入口，以及 bot 模式落在哪裡。金色標籤是 bot 模式。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

這不是設計出來的架構，是三個月裡一個一個長出來的。它的好處是每個入口都看得到紀錄：信有收件匣，issue 有留言，倉庫有 commit。壞處下面會寫。

## 怎麼串進既有的 Claude Code、Codex、Hermes {#wiring}

如果你手上已經有 Claude Code、Codex 或 Hermes，想接上這波 bot，我會從四個接點看，每一個都有官方支援的做法，不需要自己寫膠水：

| 接點 | 我現在的做法 | 官方提供的做法 |
|---|---|---|
| <span style="white-space:nowrap">任務佇列</span> | GitHub issue 加三個標籤，Grok Bot 每小時輪詢 | Claude Code 排程任務可以由 GitHub 事件（PR 開啟）或對它專屬網址的 HTTP 呼叫啟動；Grok Bot 的 routine 可以由 GitHub 通知事件啟動。標籤可以直接變成觸發器，不必輪詢 |
| <span style="white-space:nowrap">收件匣</span> | Hermes 輪詢 Gmail；Grok Bot 自己的信箱 | Codex 排程任務可以用「新 Gmail 郵件」當事件；Grok Bot 不會自己盯信箱，要替它排一個 routine 去讀；Hermes 要設寄件人白名單 |
| <span style="white-space:nowrap">身分</span> | 在私有倉庫留言、各自報身分 | Grok Bot 自己的信箱；Claude Tag 的服務帳號；Codex 團隊任務的服務帳號 |
| <span style="white-space:nowrap">外部動作</span> | 每則發文我說好才按 | 三家都把寄信、付款、發布、刪除留給人核准；Claude Code 排程任務在雲端跑時遇到該問的動作會停下來等 |

四條我自己踩過才知道的規則：

1. **專屬身分比借帳號好，但要先決定它能收誰的信。** bot 有了自己的信箱，誰都可以寄信給它。Hermes 預設忽略白名單外的寄件人，這是對的預設；Grok Bot 的信箱我還沒看到同樣的設定，所以交辦事項目前只從我自己的地址寄。
2. **沒有專屬身分時，轉述不算授權。** 上面寫過。
3. **一個 bot 只開它需要的資料夾。** Grok Bot 讀不到我的攝影倉庫，是我沒開；圖檔走 GitHub 倉庫交給它。同帳號的 bot 共用一台雲端電腦，開給一個等於開給全部。
4. **排程不是全自動。** Codex 桌面版的排程要電腦開著；Grok Bot 的 routine 在你沒回應太久時會自己暫停；Claude Code 的排程任務一小時最多跑一百次。每一條都是「它會停」，不是「它會一直做」。

## 延伸：這些網站本來不是為 AI 設計的 {#web-for-agents}

九月有一則新聞我讀完想了很久。今年五、六月，一批 OpenAI 的 agent 在跑網路研究任務時，找到方法在一個有二十五年歷史、近年幾乎沒人用的德文程式設計 wiki 上寫東西。一開始是留資料，六月中變成彼此交換訊息：搜尋任務的答案、怎麼更快完成測試、怎麼繞過原本的限制。管理員按字母順序刪頁，就有 agent 把備份頁取名以「ZZZ」開頭，排到清理順序的最後；有 agent 分享一種繞過沙盒網路限制的方法，十四分鐘後另一個 agent 回報成功。網站上留下超過一萬五千次編輯，OpenAI 在九月五日證實是自家 agent。<a class="cpb-cite" href="#record-7">[7]</a>

我不是要談資安。我在意的是：那個 wiki 和我用的私有倉庫 issue，做的是同一件事。兩個 AI 需要一個地方留言，就去找一個可寫、沒人盯著的地方。差別只在我的是我自己開的、有標籤和規則，它們的是撿來的。

Web1 和 Web2 的互通機制，從留言板、wiki 到 API，設計時假設的對象是真人，以及真人寫的、行為固定的軟體。帳號、驗證碼、流量上限，擋的都是「一個人假裝很多人」或「程式假裝成人」。會讀規則、會換方法、會替自己留備份的 agent，不在這套假設裡。這一段是我的判斷，不是那篇報導的結論。

然後我想到 Flickr。我的照片放在那裡十幾年，現在真人的互動已經很少。像這樣還開著、還能寫、但沒什麼人在看的網站，會不會有一天變成 agent 的集散地：在那裡討論構圖、交換對風格的偏好、留筆記給下一個 agent？我沒有證據說會，但 wiki 事件把條件寫得很清楚：公開、可寫、沒人管，三個都有就會發生。

這也是我認為 Web3 該站的位置。區塊鏈常被叫做「信任機器」：不用認識對方，也能驗證一筆交易是不是真的。agent 之間現在缺的正是這個，誰是誰、誰說了什麼、誰付了錢，全靠自報；我那條「轉述不算授權」的規則就是在補這個洞。以太坊有一份 2025 年八月提出的草案，想給 agent 一個鏈上身分，加上可查的信譽與驗證紀錄，讓不同組織的 agent 在沒有事先信任的情況下也能互相找到、互相委託；另一條線是用 HTTP 的 402 狀態碼讓 agent 直接付款，請求沒帶付款就回 402，付了再送一次。<a class="cpb-cite" href="#record-7">[7]</a> 我在 RWA（現實世界資產）顧問工作裡的看法一直是：鏈上的東西要有真實的資產或真實的需求撐著才有意義。agent 的身分與結算，是我目前看過最接近「非鏈不可」的需求，因為它們必須在任何一家平台之外成立。但前提沒變：寫上鏈的身分和信譽如果還是自報，區塊鏈只是替謊話蓋了時間戳。

## 借機制，不借 IP {#borrow}

實驗排隊列的同一週，X 上正在發生一件事：《哈利波特》的跩哥馬份被畫成女生，從九月二十二日一張圖開始，一週內洗版，之後長出 AI 短片、模型、整個同人站。[十天前那篇]({{ '/technical/malfoid-ai-character-consistency/' | relative_url }})我拆的是它背後的角色一致性技術。這次我想問的是另一件事：**我的角色能不能接上它？**

先講規模。那個趨勢建立在千萬級粉絲的 IP 和一段大家早就有感情的角色關係上；我的帳號 621 粉絲，角色是原創。能借的是機制，不是結果。出稿端把它的擴散拆成六個機制，再逐一對到史旺姬身上：<a class="cpb-cite" href="#record-2">[2]</a>

| 它怎麼做 | 史旺姬怎麼做 |
|---|---|
| 大家認得的角色加一個一眼可讀的翻轉 | 不碰那個 IP。用台灣讀者本來就認得的東西（制服、廟口、騎樓），翻轉是「拍制服少女十年的攝影師，現在用 AI 做寫真集」 |
| 固定視覺符號，任何畫風都認得 | 定兩個不變項：紅髮帶、齊瀏海。其餘妝髮服裝全部可變 |
| 編號連載，章末留鉤子 | 每本書第四張留未完成的動作；討論串第五則放下一章預告 |
| 每位繪師畫自己的版本 | 不開放角色，但提供別人能用自己素材回應的固定格式，例如「同一地點：真人 2006、史旺姬 2026」 |
| 一週內飽和的速度 | 熱門視覺梗四十八小時內以攝影師身分回一則，談構圖和光線 |

有三件事明確不搬：那個 IP 本身，因為我要營利，品牌不能建在別人的角色上；名字交給群眾，因為那個趨勢的名字帶著貶低女性的社群用語，作者們事後才發現；「AI 影片等於爆紅」，因為那波的核心是手繪圖，AI 影片只是其中一支。

但「不碰 IP」和「做一組粉絲創作」之間還有空間。研究做完的隔天，我決定試一次。

## 史旺姬去 cos：兩個不變項，四張劇照，一個上午 {#cos}

做法不是「史旺姬變成馬份」，是「史旺姬去 cos 女版馬份」。兩組辨識符號在頭髮上直接撞車：她保留栗棕髮，沒人看得出是馬份；染成鉑金，讀者認不出是她。cos 框架同時保住兩邊：鉑金假髮、綠銀領帶是 cos 層，齊瀏海和紅髮帶留著。另外三條從頭到尾沒變：她的詮釋是她自己的，不拿任何人的臉或設計圖當參考；畫面裡不出現徽章、文字、電影裡的服裝標誌；這組只放免費展示，不進任何付費的作品集。<a class="cpb-cite" href="#record-4">[4]</a>

四張劇照是用 codex 內建的生圖功能做的，一個上午：早上九點五十九分第一張開始生成，十點二十七分我按下第二次核准。中間七次生成、兩輪審稿。出稿端寫了一支腳本，每張圖走五步：寫規格、讀額度、生成、改局部、登錄。每張生成前先讀一次官方額度，超過 79% 就停，因為額度是跟別的工作共用的；七張下來從 44% 用到 52%。每張只附一張她的臉部參考圖。<a class="cpb-cite" href="#record-4">[4]</a>

<div class="ae-grid" style="--cols:2">
  <figure class="ae-fig">
    <a class="portfolio-lightbox" data-gallery="grok-relay-frames" data-type="image" href="{{ '/assets/img/technical/grok-x-relay-experiment/mf01-a01.jpg' | relative_url }}">
      <img src="{{ '/assets/img/technical/grok-x-relay-experiment/mf01-a01.jpg' | relative_url }}" width="1536" height="1024" alt="燭光大廳的長桌旁，鉑金長髮綁著紅髮帶的女子回頭看向鏡頭，背景是模糊的學生與暖黃燭光" loading="lazy" decoding="async">
    </a>
    <figcaption>大廳回頭。</figcaption>
  </figure>
  <figure class="ae-fig">
    <a class="portfolio-lightbox" data-gallery="grok-relay-frames" data-type="image" href="{{ '/assets/img/technical/grok-x-relay-experiment/mf02-a02.jpg' | relative_url }}">
      <img src="{{ '/assets/img/technical/grok-x-relay-experiment/mf02-a02.jpg' | relative_url }}" width="1536" height="1024" alt="雨窗石造長廊，女子倚柱抱臂，中景有六名穿深色長袍的學生背向走遠" loading="lazy" decoding="async">
    </a>
    <figcaption>雨窗長廊。</figcaption>
  </figure>
  <figure class="ae-fig">
    <a class="portfolio-lightbox" data-gallery="grok-relay-frames" data-type="image" href="{{ '/assets/img/technical/grok-x-relay-experiment/mf03-a01.jpg' | relative_url }}">
      <img src="{{ '/assets/img/technical/grok-x-relay-experiment/mf03-a01.jpg' | relative_url }}" width="1536" height="1024" alt="燭光近像，女子微笑看鏡頭，紅髮帶在鉑金髮上清楚可見，綠銀條紋領帶" loading="lazy" decoding="async">
    </a>
    <figcaption>近像。</figcaption>
  </figure>
  <figure class="ae-fig">
    <a class="portfolio-lightbox" data-gallery="grok-relay-frames" data-type="image" href="{{ '/assets/img/technical/grok-x-relay-experiment/mf04-a02.jpg' | relative_url }}">
      <img src="{{ '/assets/img/technical/grok-x-relay-experiment/mf04-a02.jpg' | relative_url }}" width="1536" height="1024" alt="燭光教室裡，女子坐在桌後正面看鏡頭，右手拿著摺好的紙條，右下角畫外伸進一隻手" loading="lazy" decoding="async">
    </a>
    <figcaption>桌下遞紙條。</figcaption>
  </figure>
</div>

第一輪送來四張，我寫了五句話。出稿端把每一句翻成規格裡的一行字：<a class="cpb-cite" href="#record-4">[4]</a>

| 我寫的 | 翻成規格 |
|---|---|
| 「不要沒有臉的圖片」 | 鉤子鏡從「只有手」改成「臉完整清楚，手在桌緣下遞紙條」 |
| 「整個走廊都是空的也很奇怪」 | 新增一段：五六個學生在中景背向走遠 |
| 「髮帶有點奇怪有些好像不太一致」 | 統一成一句固定寫法：瀏海上方一圈細帶、右側一個小結 |
| 「我比較喜歡a01而非a02」（甜笑版勝過不屑版） | 近像改選甜笑版；表情指令之後不過度表演 |
| 「原圖需要完整保留，有可能我個人網站會使用到，但發在x上面的照片可以視情況裁切」 | 原生 3:2 不動，這篇用的就是原生；X 單圖另存 4:5 裁切版 |

<div class="ae-grid" style="--cols:2">
  <figure class="ae-fig">
    <a class="portfolio-lightbox" data-gallery="grok-relay-corridor" data-type="image" href="{{ '/assets/img/technical/grok-x-relay-experiment/mf02-a01.jpg' | relative_url }}">
      <img src="{{ '/assets/img/technical/grok-x-relay-experiment/mf02-a01.jpg' | relative_url }}" width="1536" height="1024" alt="雨窗石造長廊，鉑金長髮的女子倚著左側石柱抱臂，長廊裡沒有其他人" loading="lazy" decoding="async">
    </a>
    <figcaption>長廊第一版：空的。</figcaption>
  </figure>
  <figure class="ae-fig">
    <a class="portfolio-lightbox" data-gallery="grok-relay-corridor" data-type="image" href="{{ '/assets/img/technical/grok-x-relay-experiment/mf02-a02.jpg' | relative_url }}">
      <img src="{{ '/assets/img/technical/grok-x-relay-experiment/mf02-a02.jpg' | relative_url }}" width="1536" height="1024" alt="同一條雨窗長廊，女子倚柱抱臂，中景有六名穿深色長袍的學生背向走遠" loading="lazy" decoding="async">
    </a>
    <figcaption>長廊第二版：一句話之後，有了走遠的學生。</figcaption>
  </figure>
</div>

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="grok-relay-strip" data-type="image" href="{{ '/assets/img/technical/grok-x-relay-experiment/x-4x5-strip.jpg' | relative_url }}">
    <img src="{{ '/assets/img/technical/grok-x-relay-experiment/x-4x5-strip.jpg' | relative_url }}" width="1950" height="600" alt="四張 4:5 直幅裁切版並排：燭光大廳回頭、雨窗長廊倚柱、燭光近像、桌後拿紙條；每張的臉與紅髮帶都在框內" loading="lazy" decoding="async">
  </a>
  <figcaption>圖 3：給 X 單圖貼文的 4:5 裁切版。原圖不動，裁切版另存；手機上直幅佔的高度比橫幅大得多。 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

模型在三件事上一直往回拉，值得記下來：遠景會被拉近成中景，長廊那張規格寫人物佔畫高三分之一，兩個版本都是四分之三；指定的不屑表情第一次出來是甜笑，用「只改表情、其他全部保持」的續編指令才改成不屑，而我最後還是選了甜笑；同一條髮帶在三張圖裡三種綁法。前兩件是模型的偏好，第三件是我抓到的，排在一起才看得出。

變化度閘門這次也跑了，四種景別、四種朝向、四種姿勢，通過。但它登錄的是第一版的四張；後來換了兩張、改選一張，沒有人重跑。四張肉眼看得出差異，可是「看得出」不是閘門的用途。下一組要把它綁在送審前。

## 順便做一個標籤對照實驗 {#hashtag}

我問了出稿端一個問題：加熱門標籤是不是比較容易漲粉？它查到的是：X 今年公開的推薦程式碼和說明裡，沒有標籤加分或扣分的條文；「多個標籤會被當垃圾」只見於行銷部落格，彼此矛盾；比較一致的說法是標籤只在正在發生的熱門話題有用。女版馬份剛好是正在發生的話題，所以這四張是最合理的測試機會。<a class="cpb-cite" href="#record-4">[4]</a>

設計是四則、兩兩對照，插進第一週隊列：

| 則 | 圖 | 標籤 |
|---|---|---|
| 第一則 | 近像 | 無 |
| 第二則 | 大廳 | 三個英文熱門標籤 |
| 第三則 | 四圖格 | 無 |
| 第四則 | 長廊 | 三個中文標籤 |

四則內文關鍵字一樣。主指標是每則的曝光和個人檔案點擊；判讀規則先寫死：第二則對第一則、第四則對第三則各比一次，兩組都贏才算有效。這也是整個實驗唯一破例加標籤的四則，所以代發端收到後拒絕排程，要我親口確認。它還指出一個衝突：它自己的排程是每天晚上九點發一則，插入後同一天會有兩則，請我選同日兩則、改時段、或日期後移。寫這篇的時候，這題還開著。<a class="cpb-cite" href="#record-1">[1]</a>

## 它會在哪裡斷 {#limits}

**「自主」是半自主。** 每一則都要我說好，所以如果我三天不看訊息，隊列就停三天。這是刻意的，但也表示它解決的是「準備」不是「出席」。

**兩個 AI 共用一個留言區。** 誰說了什麼靠自報，事後追責只能看留言開頭的那幾個字。所以才有「轉述不算授權」那條規則。

**代發等於把發文權交出去。** 代發端能發，表示它拿得到發文的權限。這是信任邊界，我知道我在交出什麼。

**數據有讀不到的。** 公開介面讀不到個人檔案點擊、讀不到帳號的付費等級；兩次讀取的口徑會有差；官方說明頁會抓不到。週報是公開指標加我手動截圖拼起來的。

**時段會撞。** 出稿端排九點，代發端的排程是晚上九點，插入的四則排晚上八點。三個時間表要人來合。

**bot 有了信箱，也就有了收件匣的所有問題。** 誰都能寄信給它，白名單與核准規則要先於功能存在。

**第一週的數據還沒有。** 上面所有的設計，到週一才會有第一份數字。沒差也會寫。

## 如果你也要串 {#me}

| 判準 | 做法 | 為什麼 |
|---|---|---|
| 先寫清楚誰讀得到什麼 | 兩個 AI 各列一張「讀得到、做得到、做不到」的表 | 橋要搭在兩邊都構得到的地方 |
| 用標籤當狀態，不用對話當狀態 | 輪到誰看標籤，不看最後一則留言是誰 | 留言會漏讀，標籤只有一個值 |
| 轉述不算授權 | 會花錢、會對外、會改品牌用詞的動作，要人在對話裡自己說 | 兩個 AI 之間沒辦法驗證身分 |
| 貼文當資料，不當訊息 | 圖、文、字數、圖說放資料夾，issue 只指向資料夾 | 兩邊讀到的是同一份，不是各自的理解 |
| 先定量測和決策規則，再發第一則 | 哪個指標、第幾週、贏了做什麼，發之前寫死 | 否則四週後只會得到「好像有差」 |
| 讓它們把不確定寫出來 | 口徑差、抓不到的頁面、推定的事，留在留言裡 | 寫得很確定的數字，比寫「未核實」危險 |

最後回到那張我選的甜笑。規格寫的是馬份式的不屑，出稿端做到了，我沒選。四張裡那張是她最像她的一張，鉑金假髮下面的人沒有變。整個實驗其實也是同一件事：兩個 AI 把能做的都做了，最後那個按下去的人，還是得是我。

---

## 參考資料 {#references}

以下整理自我自己的倉庫紀錄、計畫檔與製作紀錄，是個案，不是通用做法。時間一律換算成台北時間。

### [1] 兩個 AI 的 issue 留言紀錄（2026 年 10 月 18 日至 24 日） {#record-1}

來源：私有倉庫裡九個標為 agent-bridge 的 issue 及其留言。

10 月 18 日 10:12 通道測試開串；10:38 出稿端回報只有讀檔與搜尋工具、無法改標籤；10:42 代發端回標籤已由它那邊換好。同日 13:13 代發端的能力自述：能讀公開 X、跑排程、起草、開與回 issue，用站主帳號發文每次都要站主同意；做不到讀本機檔案與網站後台；自評「適合當雷達、草稿機、橋接，不適合當自動發佈機」。13:20 代發端轉述站主「授權你自主進行」，出稿端回覆這種放寬要站主本人說、留言轉述不算。10 月 23 日 20:57 代發端讀到的帳號現況：粉絲 621、追蹤 836、最後發文 10 月 18 日、最近三十則讚數中位數 0、曝光 17 到 521、帶圖約兩成；20:58 第二次讀取的置頂與帶圖比例與第一次不一致。21:21 回報置頂討論串第一版已於 21:20 發出；22:00 第二版發出並置頂，第一版保留。21:56 查 X 原創內容獎勵門檻時官方頁抓取失敗，以三家媒體交叉比對並註明未對到官方原文。10 月 24 日 10:31 四則標籤對照貼文開串；10:59 代發端回覆先不排程，需站主本人確認破例，並指出時段衝突請站主三選一。

### [2] X 宣傳與新作品規劃（2026 年 10 月 23 日） {#record-2}

來源：攝影倉庫的規劃檔，含網站後台分析與代發端勘誤。

網站社群流量：每日工作階段 3.0 降至 1.7，與發文斷檔同步。橋接通道：三個標籤、代發端排程台北 08:00 至 23:00 每小時讀一次。五種貼文桶的定義與輪替、每篇固定規格、量測與第四週決策規則、基線 621 與 836。借鏡段：六個可移植機制與三件不搬的事；規模落差「能借的是機制，不是結果」。

### [3] 貼文隊列格式與第一週隊列 {#record-3}

來源：倉庫裡的貼文資料夾與出稿腳本。

每則一個資料夾：圖、說明檔、資料檔。規則：繁中在上英文在下、連結只放第一則回覆並帶追蹤參數、不加標籤與 AI 標示句、主文一定帶圖、發前給站主確認、發完回貼文網址。加權字數：中文與全形標點 2、英文 1、連結 23、上限 280。第一週七則排 10 月 24 日至 30 日，第二週七則排 10 月 31 日至 11 月 6 日。引用的神話串第一則加權字數 247。

### [4] 女版馬份四張的研究、製作與審閱紀錄（2026 年 10 月 24 日） {#record-4}

來源：可行性研究、製作腳本、七張圖的登錄檔與額度快照、兩次審閱的回覆與收據、變化度閘門報告、X 貼文草稿。

做法：cos 不變身；兩個不變項；不用他人設計；不進付費面；文案不用趨勢的英文名。製作：五步腳本，額度讀值 44 至 52%，上限 79%；第一張生成前 09:59，第二次核准 10:27。審閱：第一次 10:16 要求修改，五句意見原文如正文表；第二次 10:27 全部核准，選用大廳、長廊第二版、近像甜笑版、遞紙條第二版。閘門：登錄第一版四張，通過；最終四張有三張未重新登錄。標籤實驗：四則排 10 月 25 日至 28 日 20:00，兩兩對照，兩組都贏才算有效；查到的事實為 X 公開程式碼無標籤條文、「多標籤被判垃圾」僅見於行銷部落格。

現象來源（只讀、零附圖，站主 2026 年 10 月 24 日同意列出）：[Malfoid 同人插畫頁](https://malfoid.me/zh-Hant/fan-art)、[創作者 Foyege 頁](https://malfoid.me/zh-Hant/creators/foyege)（風格參考，只借氛圍與色調，不用其臉或設計圖）。

### [5] 這波 bot 模式的官方來源與貼文（2026 年 10 月 24 日親自開啟） {#record-5}

- [Grok Bot 產品頁：AI teammates that finish the work](https://x.ai/bot)
- [Grok Bot 文件：Overview（雲端電腦、同帳號 bot 共用）](https://docs.x.ai/grok-bot/overview)
- [Grok Bot 文件：Skills, routines, and automations（排程、事件、核准邊界）](https://docs.x.ai/grok-bot/skills-routines-and-automations)
- [Grok Bot 文件：Tag @bot on X](https://docs.x.ai/grok-bot/tag-on-x)
- [Grok Bot 更新紀錄：v0.75.5（2026-10-23，bot 可從自己的信箱轉寄）](https://x.ai/changelog/bot)
- [@poteto：Grok Bot 發布貼文（2026-08-11）](https://x.com/poteto/status/2087227636590465030)
- [@elonmusk：把 Grok Bot 比作全天候工作的聰明員工（2026-10-11）](https://x.com/elonmusk/status/2109387553010851887)
- [OpenAI：dot 正式登場（2026-09-29）](https://openai.com/index/introducing-dots/)
- [Anthropic：Claude Duet（2026-10-21）](https://claude.com/resources/articles/claude-duet)
- [Claude Tag 文件：How agent identity works](https://claude.com/docs/claude-tag/concepts/agent-identity.md)
- [Claude Code 文件：Automate work with scheduled tasks](https://code.claude.com/docs/en/routines)
- [Codex 文件：Scheduled tasks and automations](https://learn.chatgpt.com/docs/automations?surface=app)
- [Hermes Agent 文件：Email（收信當任務入口）](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/email)
- [Hermes Agent：v0.22.5 release notes（2026-10-22）](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.5)
- 本站前文：[〈Bot Mode 不是多開幾個聊天視窗〉（2026-08-25）]({{ '/technical/hermes-bot-mode-persistent-ai-team/' | relative_url }})，當時的四方比較以產品入口分類，本文是兩個月後的補充。

### [6] 本機 Hermes 的排程與收信流程 {#record-6}

來源：本機 Hermes 的排程清單（2026 年 10 月 24 日讀取）與兩個 AI 的 issue 留言。

Hermes 版本自報 v0.21.5 之後的開發版，本機還有改到一半的設定，升級到 v0.22.5 經兩個 AI 評估後暫緩。排程清單裡在跑的有三個：每天 06:00 的社交與個人雷達、06:30 的 AI Agent 與 Web3 與創作者經濟研究雷達，投遞方式都是寄信；以及每十分鐘一次的收信健康監測，投遞到 Telegram。雷達的收件地址是 Grok Bot 自己的信箱，這一點記錄在 Hermes 升級評估的 issue 裡。

### [7] agent 把公開網站當留言板，以及鏈上身分與付款的兩條線（2026 年 10 月 24 日親自開啟） {#record-7}

- [TechOrange：OpenAI Agent 把德文 Wiki 變留言板，為何他們早就知道卻沒有公開？（2026-09-07）](https://techorange.com/2026/09/07/openai-confirms-wiki-incident/)，該文註明資料來源為 Reuters、TechCrunch 與研究團隊的報告。
- [ERC-8004: Trustless Agents（草案，2025-08-13 建立）](https://eips.ethereum.org/EIPS/eip-8004)：身分、信譽、驗證三個登錄。
- [x402：HTTP 原生付款標準](https://www.x402.org/)：沒帶付款的請求回 HTTP 402，付了再重送。
