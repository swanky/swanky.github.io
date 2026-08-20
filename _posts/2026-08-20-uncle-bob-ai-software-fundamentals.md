---
title: "Matt Pocock × Uncle Bob：AI 寫程式愈快，軟體基本功愈不能省"
seo_title: "Matt Pocock × Uncle Bob 談 AI Coding：測試、架構與軟體基本功"
date: 2026-08-20
published: false
categories: [technical]
tags: [ai-agent, ai-coding, matt-pocock, uncle-bob, clean-code, software-architecture, tdd, mutation-testing, software-engineering]
layout: article
cover_image: /assets/img/linkedin/uncle-bob-ai-software-fundamentals.jpg
cover_alt: "Matt Pocock 與 Uncle Bob 對談，水手服少女在兩人之間整理五階段 Agent、測試、架構與人才培育的工程地圖"
cta_context: agentic
related_posts:
  - matt-pocock-skills-ai-coding-workflow
  - production-ai-agent-control-planes
  - agentic-engineering-patterns-guide
hero_image: true
description: "完整整理並翻譯 Uncle Bob 與 Matt Pocock 的 56 分鐘對談：AI 寫程式愈快，愈需要可執行的品質關卡、模組邊界、小步迭代與人類策略判斷。"
keywords: Uncle Bob, Robert C. Martin, Matt Pocock, AI Coding, Coding Agent, Clean Code, TDD, CRAP, Mutation Testing, 軟體架構, 軟體工程, 史旺基
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>AI 沒有取消軟體工程</strong>：它只是讓程式碼生成變便宜，也讓混亂累積得更快。</li>
    <li><strong>提示詞只能提醒，工具才能執法</strong>：測試、突變測試、複雜度門檻與依賴規則，必須變成 Agent 繞不過去的硬性關卡。</li>
    <li><strong>不要照抄人類儀式</strong>：TDD 的節拍可以調整，但可驗證、可理解、低耦合與責任清楚這些價值不能丟。</li>
    <li><strong>人類要守住策略</strong>：Agent 可以接手更多戰術實作，人仍要決定做什麼、如何切模組、怎樣才算可以交付。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">先看兩個人怎麼把問題拆開</span>
      <ol class="article-toc-items">
        <li><a href="#interview">一場從浴袍開始的訪談</a></li>
        <li><a href="#matt">Matt 把問題一路問到人的位置</a></li>
        <li><a href="#dirty-code">AI 也會在髒程式碼裡打滑</a></li>
        <li><a href="#hard-gates">提示詞是提醒，工具才是法律</a></li>
        <li><a href="#economics">舊工具遇上新的成本曲線</a></li>
        <li><a href="#pipeline">五階段 Agent 品質管線</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">再決定人與 Agent 怎麼分工</span>
      <ol class="article-toc-items">
        <li><a href="#architecture">測試守行為，架構守理解</a></li>
        <li><a href="#values">保留價值，不迷信儀式</a></li>
        <li><a href="#agile">小步迭代又回來了</a></li>
        <li><a href="#learning">新人怎麼長出策略能力</a></li>
        <li><a href="#playbook">我會怎麼試</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">完整內容與核對</span>
      <ol class="article-toc-items">
        <li><a href="#translation">56 分鐘完整正體中文翻譯</a></li>
        <li><a href="#glossary">關鍵術語速查</a></li>
        <li><a href="#sources">來源與翻譯說明</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 一場從浴袍開始的訪談 {#interview}

一場快一小時的 AI 軟體工程訪談，最先留在我腦中的不是模型名稱，而是一個穿著浴袍、清晨站在前廊抱怨 SQL Injection 的老工程師。

這很 Uncle Bob。看見一個荒謬的技術問題，就先把它說穿。

Robert C. Martin 從 1960 年代一路寫程式到今天。當他開始使用 ChatGPT、Grok 與 Coding Agent，最初也不是一路驚艷，而是不停替 AI 收拾留下來的雜亂。真正讓他改觀的，不是模型突然變得完美，而是他發現：Agent 的速度，可能讓一些過去太昂貴、很難每天執行的品質技術，重新變得實用。

我把這場對談完整翻成正體中文，不是因為裡面每句話都是金句，而是它避開了最無聊的「AI 會不會取代工程師」。它問的是另一個比較實際的問題：

> 當程式碼可以高速生成，我們要怎麼把品質、架構與判斷，變成 Agent 不能隨便繞過去的系統？

我的結論很直接：**AI 寫程式愈快，軟體基本功愈不能省。**

## Matt 不是陪襯，他把問題一路問到人的位置 {#matt}

只看標題，很容易以為這是一場 Uncle Bob 的單人演講。其實不是。Matt Pocock 沒有只把麥克風遞過去，他一直在替這套看似完整的方法找代價、找矛盾，也把談話從「怎麼讓 Agent 寫得更好」推到「人接下來要怎麼學會判斷」。

- [23:11](https://www.youtube.com/watch?v=zcLPGC-tvgk&t=1391s)，Matt 把不同 Agent 的工作慣性命名為 **Context Trajectory**：同一場 Session 一旦往某個方向走，後續行為就會被那條軌跡影響。清空上下文，不只是省 Token，而是真的換一條思考路線。
- [35:42](https://www.youtube.com/watch?v=zcLPGC-tvgk&t=2142s)，他追問一個很現實的問題：五段品質管線這麼昂貴，送進去之前到底該規劃多深？這才把談話帶到規格、Agile 與小步回饋。
- [45:52](https://www.youtube.com/watch?v=zcLPGC-tvgk&t=2752s)，他借用 John Ousterhout 的 Tactical／Strategic 區分，問出整場最難的一題：如果 Agent 吃掉戰術工作，新人要去哪裡長出策略能力？
- [52:51](https://www.youtube.com/watch?v=zcLPGC-tvgk&t=3171s)，最後也是 Matt 把問題收回軟體基本功：如果基本功仍然重要，理由到底是什麼？

所以這篇不只是整理 Uncle Bob 的答案。它也在整理 Matt 怎麼改變問題的焦距：從程式碼品質，拉到上下文、成本、迭代，最後拉回人的養成。

## AI 也會在髒程式碼裡打滑 {#dirty-code}

Uncle Bob 早期使用 Coding Agent 的方式，跟今天常見的 Vibe Coding 很像：叫它做一件事，看到功能會動，就立刻做下一件。留下來的命名、重複、耦合與測試缺口先不管，反正 Agent 跑得很快。

問題是，垃圾也會複利。

很快地，Agent 開始修改 A、破壞 B；修好 B，又把 C 弄壞；最後再回頭破壞 A。畫面上看起來很忙，真正進度卻接近零。Uncle Bob 把這種狀態叫作 Thrashing。

這件事有點重要。Agent 與人的複雜度耐受門檻也許不同，但門檻仍然存在。程式碼同時扛太多責任、依賴方向混亂、測試又薄弱時，模型並不會因為上下文比較長就突然免疫。

速度沒有消滅技術債。它只是讓技術債也能高速生成。

## 提示詞是提醒，工具才是法律 {#hard-gates}

Uncle Bob 一開始也試過把 TDD、Clean Code、函式大小與各種規則寫進很長的提示詞。問題是，模型會把它們當成《神鬼奇航》裡的海盜守則：比較像參考，不太像法律。

上下文愈長，早期規則愈容易被擠進中段。模型對這些內容的注意力下降，也就是訪談裡談到的 Lost in the Middle。這時再補一句「請記得寫乾淨一點」，通常只是在用文字勸它乖。

更可靠的做法，是把價值觀翻成可以執行的關卡：

- 測試沒有全綠，不能結束。
- 突變體仍然存活，不能交付。
- 複雜度超過門檻，回去拆解。
- 模組依賴逆流，必須反轉依賴、插入介面或重新分模組。
- 端到端行為不符合驗收情境，就不是完成。

提示詞負責說明意圖。工具負責裁決結果。

這也是我認為 AI Coding 工作流真正的分水嶺：不是 Prompt 寫得多漂亮，而是「完成」有沒有被外部系統定義，而且模型不能自己宣布過關。

## 舊工具遇上新的成本曲線 {#economics}

CRAP 分數與 Mutation Testing 都不是 AI 時代才出現的新發明。它們過去沒有成為所有團隊的日常，不一定是因為沒價值，也可能只是太花時間。

CRAP 把測試覆蓋率與 Cyclomatic Complexity（循環複雜度）放在一起看。路徑很多、測試又不足的函式，風險自然比較高。

Mutation Testing 則故意把程式改壞，例如把 `<` 變成 `>`、把 `==` 變成 `!=`，再重跑測試。如果測試還是綠的，表示那組測試並沒有真的守住行為。

人會嫌這些工作慢、重複又無聊。Agent 不在乎無聊。

這就是成本曲線翻面的地方：AI 不只降低寫程式的成本，也降低反覆檢查、重跑、修正的成本。真正值得自動化的，未必只是產生更多程式碼，而是把過去「知道應該做，卻常常沒做」的品質流程變成預設路徑。

## 五階段 Agent 品質管線 {#pipeline}

Uncle Bob 實驗的 Multi-Agent 管線，把同一項工作依序交給五個短命角色：

1. **Specifier**：把人的需求整理成 Gherkin 情境與 QA 程式。
2. **Coder**：先讓功能運作。
3. **Cleaner**：移除重複、改善命名與結構。
4. **Hardener**：用 CRAP 與 Mutation Testing 對測試強度找麻煩。
5. **QA**：從外部驗證整體行為。

單一 Agent 可能五分鐘就能吐出一個看似完成的版本。通過五個角色也許要一小時。訪談裡 Uncle Bob 估計，這仍可能比人類半天的工作快四到五倍；但這是他的實驗估算，不是可以直接套用到每個團隊的保證。

我覺得這套設計最有意思的地方，不是把 Agent 擬人成一間公司，而是**上下文隔離**。

每個 Agent 只做一件事，完成後退出。下一個角色從乾淨上下文開始，不必繼承前一個角色一路累積的辯解、假設與工作慣性。Coder 想讓東西先動，Cleaner 專心清理，Hardener 則刻意站在對立面找漏洞。

角色分工只是表面。真正被設計的是每段工作的 Context Trajectory。

這個觀察是 Matt 在訪談裡補上的。他指出，同一個上下文不只是裝了多少資訊，也有一路形成的工作軌跡；要真正換掉角色執念，最乾脆的方式就是讓上一個 Agent 結束，下一個從乾淨上下文開始。

當然，Agent 每次重新理解專案都有成本。關卡太多，也可能把速度優勢吃光。所以我不會一開始就照抄五段，而會先找目前最常漏掉的那一關。

## 測試守行為，架構守理解 {#architecture}

完整測試不能替代良好架構。

Uncle Bob 會直接問 Agent：這個系統有哪些模組？彼此怎麼溝通？答案有時會糟到讓他重新檢查整個設計。他因此讓 Agent 建立可以逐層檢視的 UML 架構視圖，另外再用確定性規則限制依賴方向。

這裡可以借用訪談中的「咖啡與連續劇」比喻。模型原本在談咖啡，中途有人塞進一段連續劇，之後每個咖啡話題都可能被那段情節污染。模組也是一樣。如果付款、會員、郵件、報表與快取都擠在同一塊，Agent 很難維持穩定的理解軌跡。

Deep Module 的價值，就是用小而清楚的介面，藏住大量內部複雜度。對人如此，對 Agent 也是如此。

測試告訴模型「系統應該怎麼表現」；架構則告訴它「理解到哪裡可以先停」。兩者解決的是不同問題。

## 保留價值，不要迷信儀式 {#values}

這是整場訪談裡，我最認同的一個區分：**人類使用的工程紀律，不一定要原封不動搬給 Agent；但那些紀律保護的價值不能丟。**

TDD 對人有效，部分原因是人的短期記憶很小。先寫一個測試，再寫剛好讓它通過的程式碼，可以限制同時要處理的資訊。Agent 的上下文容量與工作方式不同，硬逼它照著人類節奏，一次只前進一小格，不一定產生同樣價值。

Matt 把這個回答接回「短期記憶」：TDD 的節拍對人類有幫助，不代表相同儀式對 Agent 也有同樣效益。這讓 values 與 disciplines 的差異不只是 Uncle Bob 的結論，而是兩人一起拆出來的判斷。

可以調整的是 TDD 的節拍、函式大小門檻、複雜度上限，以及每次修改的範圍。

不能丟的是這些東西：

- 行為可驗證。
- 結構可理解。
- 模組低耦合、責任清楚。
- 依賴方向受控。
- 失敗能被確定辨識。
- 系統在修改後仍可維護。

不要把工程方法當宗教。先問它原本在保護什麼，再用適合 Agent 的方式把那個價值留下來。

## AI 讓 Agile 又回來了 {#agile}

AI 很會寫計畫，也很會把計畫寫得像真的。

這一段是從 Matt 的追問開始的：既然品質試煉很花資源，工作送進管線前是不是應該把規格做到非常完整？問題看起來合理，也正好暴露「規格最大化」的誘惑。

於是「先讓多個 Agent 把規格磨到極致，再一次完成全部實作」重新變得很誘人。問題是，人不可能預先想到所有細節，Agent 也沒有足夠的策略判斷替我們補完所有缺口。真正開始實作後，現實很快就會把那份華麗規格敲碎。

Uncle Bob 的實驗最後又回到 Agile：選一個小而完整的 Story，做一點、驗證、看架構、重整，再做下一點。

這不是不要規格。是不要把規格當成另一套必須永遠同步的原始碼。規格可以是暫時的，會修改，也可能在完成任務後消失。最後真正能被執行與驗證的，仍是成品、測試與實際行為。

模型愈快，錯誤方向被大量自動化的風險也愈高。小步回饋不是過時的儀式，反而是避免 Agent 一口氣把錯誤做大的保險。

## 新人怎麼長出策略能力 {#learning}

Matt Pocock 把問題推到最難回答的地方：如果 Agent 已經能做掉很多前線實作，團隊為什麼還要聘請一個做得比較慢的新手？而沒有戰術經驗的人，又要怎麼長成看得懂架構後果的策略工程師？

Uncle Bob 沒有假裝自己有完美答案。他提出的是一條接近學徒制的路：從二進位、電腦基礎、簡單 CPU 與組合語言開始，讓新人親手理解抽象層底下發生什麼；再透過 pair programming，跟著有經驗的人學會判斷。

他也建議去讀那些「老到沒人讀」的軟體工程書。舊書裡當然有過時技術，但模組化、溝通成本、技術債與設計後果，是前人真的付過代價才留下來的知識。

AI 可以壓縮戰術工作，卻也可能一起壓縮新人的練習場。這不是多裝一套 Coding Agent 就能解掉的人才問題。團隊若想得到未來的策略工程師，就得刻意保留能看見因果、能犯小錯、也有人帶著反省的學習路徑。

## 如果是我，我會先這樣試 {#playbook}

我不會把整個系統交給五個 Agent，然後期待一週後收到奇蹟。那比較像把風險藏進自動化裡。

我會先選一個邊界清楚、可回滾、能從需求一路驗證到 UI 或 API 的小 Story，跑一個最小版本：

1. **提示詞只留必要資訊**：任務、不可違反的限制、完成定義。
2. **先建立硬性關卡**：至少有單元測試、靜態分析與端到端驗收；有餘裕再加複雜度與突變測試。
3. **把清理與加固拆開**：不要讓同一個 Agent 一邊為自己的實作辯護，一邊假裝客觀審查。
4. **把架構規則寫成工具能檢查的形式**：哪些模組可以依賴哪些模組，不只留在簡報裡。
5. **人類審策略**：需求對不對、模組怎麼切、風險有沒有被看見。不是坐在旁邊跟 Agent 比打字速度。
6. **量測整個週期**：看 Lead Time、缺陷、回滾、存活突變體與後續維護，不只看第一版生成多快。
7. **每一、兩個 Story 重看架構**：方向錯了就早點重組，不讓錯誤乘上 Agent 的速度。

先證明一條小路能穩定走通，再擴大。這很無聊，但 production 通常就是靠這些無聊的事活下來。

## 最後判斷：基本功不是手工情懷 {#final-judgment}

訪談最後，Matt 再把整場對話壓成一句：軟體基本功聽起來仍然重要，為什麼？

從機器語言、組合語言、高階語言，到今天的模型，每次抽象層往上，總有人說工作要消失了。工作確實會變，複雜度卻沒有跟著消失。它只是搬到新的地方。

AI 可以替人產生更多程式碼，不能讓責任、依賴、行為、風險與維護成本憑空消失。

Clean Code、測試、模組化、架構方向與小步回饋仍然重要，不是因為我們懷念手工寫程式，而是人與模型都需要一套方法，把大到無法承受的複雜度，壓縮成可以理解、可以驗證的形狀。

以前基本功常被嫌慢。現在真正有意思的地方是，AI 或許終於讓我們付得起那個成本。

---

## 56 分鐘完整正體中文翻譯 {#translation}

以下依照原影片 00:00 至 56:20 的順序，完整保留來源 HTML 中的 133 段中文翻譯。點時間碼可從 YouTube 對應位置播放。英文原文收在每段下方，方便需要時逐段核對。

> 翻譯為中文可讀性補上標點、分段並統一技術術語；這不是原作者或頻道發布的官方譯稿。


### 起點與 AI 初體驗

<details class="article-transcript" data-index="1" data-time="00:00" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=0s" target="_blank" rel="noopener noreferrer">00:00</a><span>Matt</span><small>#001</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">今天準備了一份大禮。我邀請到一位早就很想訪談的人。他投入軟體的時間，至少跟我當開發者的資歷一樣久，事實上遠遠更久，而且如今也正開始在 AI Agent 領域留下自己的印記。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I&#x27;ve got a treat for you today. I&#x27;ve got someone who I&#x27;ve been wanting to speak to for a while. Someone who has been really into um I mean software for as long as I&#x27;ve been a developer, much longer than I&#x27;ve been a developer. And someone who&#x27;s now making his mark on the agent space.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="2" data-time="00:18" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=18s" target="_blank" rel="noopener noreferrer">00:18</a><span>Matt／Uncle Bob</span><small>#002</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">今天 Uncle Bob Martin 穿著浴袍上線，準備開戰。Uncle Bob，你好，歡迎。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">你好，謝謝邀請，很高興來到這裡。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">真的很高興你來。對不熟悉「浴袍梗」的觀眾，我們可能得先交代一下。這到底是怎麼回事？為什麼浴袍會變成你個人形象中很重要的一部分？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我想，那是大約兩年前開始的。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">We have uh Uncle Bob Martin live and in his bathrobe ready to throw down. Uncle Bob, hello. Welcome. &gt;&gt; Hello and thank you. Good to be here. It&#x27;s great. It&#x27;s great to have you. It&#x27;s great to have you. Um, for folks who don&#x27;t know the bathrobe thing specifically, we should probably caveat that. What&#x27;s What&#x27;s going on there? And why is the bathrobe become a important part of your character? &gt;&gt; I I it happened I think two years ago.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="3" data-time="00:47" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=47s" target="_blank" rel="noopener noreferrer">00:47</a><span>Uncle Bob</span><small>#003</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">那天清晨六點，我穿著浴袍站在自家前廊，突然想到 SQL 有多糟，因為它帶來各種 SQL Injection（SQL 注入）問題。從資安角度來看，用一種文字語言作為資料庫存取介面，根本不合理。我當時就拿出手機開始抱怨，後來那段影片便成了「晨間浴袍怒評」。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I was on my front porch in my bathrobe. It was 6:00 in the morning and and I started thinking about how awful SQL was because of all the SQL injections and what you know makes no sense to have a textual language as your database access um for security reasons. And I I was in my bathroom at the time and I just pulled out my phone and I ranted and that became the morning bathrobe rant.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="4" data-time="01:13" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=73s" target="_blank" rel="noopener noreferrer">01:13</a><span>Uncle Bob／Matt</span><small>#004</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">看來大家很喜歡，所以我後來又拍了幾次。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">所以你今天也是帶著那種情緒來的嗎？就是那個「天還早、我還沒喝咖啡，別來煩我」的 Uncle Bob？清晨六點就在想 SQL，老兄，六點耶，拜託。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">好了，這段到此為止。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Apparently it was popular so I did it a few more times. &gt;&gt; So is this the mood that you&#x27;ve come here today in? Is this is this the uncle &gt;&gt; Bob? It&#x27;s early in the morning. I haven&#x27;t had my coffee and just don&#x27;t bother me. &gt;&gt; 6:00 in the morning thinking about sequel, man. 6 in the morning. Come on. &gt;&gt; I&#x27;m done with this now.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="5" data-time="01:32" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=92s" target="_blank" rel="noopener noreferrer">01:32</a><span>Uncle Bob／Matt</span><small>#005</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">其實現在是早上十點。浴袍已經脫掉了，我也喝到今天第一罐健怡可樂，所以狀態很好。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">很好，現在 POLO 衫也亮相了。現場大多數觀眾是開發者，但也有些不是。那麼，Uncle Bob 的故事該怎麼介紹給非開發者聽？</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">It&#x27;s actually 10 in the morning. &gt;&gt; The bathroom off. I have me. I&#x27;m on my first Diet Coke, so I&#x27;m fine. &gt;&gt; Very good. Okay. Well, now the polo shirt is out. Um what&#x27;s what&#x27;s the Uncle Bob&#x27;s story like for there are probably some folks most of my folks are developers but some of my folks are not developers as well in this audience.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="6" data-time="01:54" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=114s" target="_blank" rel="noopener noreferrer">01:54</a><span>Matt／Uncle Bob</span><small>#006</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我們要怎麼向非開發者介紹「Uncle Bob 這個現象」？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">說我是什麼現象，我可不敢當。我就是一名程式設計師，而且已經做了非常久，現在超過半個世紀了。我的第一支程式寫於 1964 年，那時我十二歲。那是一台母親送我的小型電腦模型，是十二歲生日禮物；程式設計方式，是把一根根白色小管套在插銷上。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">How do we introduce Uncle Bob the phenomenon that is Uncle Bob to especially non-developers. &gt;&gt; Phenomenon. I don&#x27;t know about that. Um I&#x27;m a programmer. I I&#x27;ve been a programmer for a very long time. Uh over half a century at this point. uh started it. My first program was in 1964 and I was 12. The program was was uh a little model computer that my mother had bought me for my 12th birthday and programmed it by putting little white tubes on pegs.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="7" data-time="02:32" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=152s" target="_blank" rel="noopener noreferrer">02:32</a><span>Uncle Bob／Matt</span><small>#007</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">它本質上是一台三位元有限狀態機，但十二歲的我完全被它迷住了。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">好，你十二歲開始，那麼五十多年後，是怎麼一路走到今天這位 Uncle Bob 的？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">其實不只五十年。總之，我就是開始盡可能學習所有能找到的程式設計知識。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">It was essentially a three-bit finite state machine, but it fascinated the hell out of me at the age of 12. Okay. So, you&#x27;re 12 years old. How do we get to uh 50 years later, Uncle Bob doing his thing now? &gt;&gt; Yeah, a little more than 50. Um, let&#x27;s see. Well, I I you know, I just started learning as much as I could about programming.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="8" data-time="02:54" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=174s" target="_blank" rel="noopener noreferrer">02:54</a><span>Uncle Bob</span><small>#008</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">父親買了 Fortran、COBOL 和 PL/I 的書給我，我全部讀完。當時根本沒有機器可以執行，所以我在紙上寫程式，再用腦袋模擬執行。十六歲時，我短暫找到一份會寫一點程式的工作；十八歲時得到第一份正式工作，從此一路當程式設計師到現在。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">My father bought me a book about Forran, a book about Cobalt, book about PL1. I read them all. Had no machines to execute anything on, so I wrote programs on paper and executed them in my head. got a job uh um writing a little bit of code at the age of 16. Um but that was a temporary thing. Then I got a real job at the age of 18 and I&#x27;ve been a programmer ever since.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="9" data-time="03:18" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=198s" target="_blank" rel="noopener noreferrer">03:18</a><span>Matt／Uncle Bob</span><small>#009</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">所以你在第一線打滾了非常久，也寫過一本相當重要的書。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我寫過幾本，其中一本我覺得確實重要。其他也寫了幾本，不過有一本特別走紅，那很令人開心。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我記得是《程式碼的清潔度》？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">對，《Clean Code》，沒錯。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&gt;&gt; So you&#x27;ve been in the trenches for a long time and you wrote rather an important book I think. &gt;&gt; A few I one of them I think was important. I&#x27;ve written a few more but uh yeah one of them seemed to take off. That was a nice one. &gt;&gt; Yeah. and um uh the cleanliness of code if I remember correctly or &gt;&gt; yeah clean code. Yeah. Yeah. Yeah.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="10" data-time="03:39" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=219s" target="_blank" rel="noopener noreferrer">03:39</a><span>Uncle Bob／Matt</span><small>#010</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">這是第二版。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">每當我和別人談軟體工程的好書，這可能是最常被提起的一本。它極受歡迎，影響力也非常大。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&gt;&gt; Here&#x27;s the second edition. This is this is the second edition. But you know &gt;&gt; I mean it&#x27;s it&#x27;s maybe the most um certainly when I have conversations about good books. It&#x27;s it&#x27;s uh for software engineering. It&#x27;s the one that most often gets quoted back at me. Like it&#x27;s incredibly popular, incredibly influential.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="11" data-time="03:59" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=239s" target="_blank" rel="noopener noreferrer">03:59</a><span>Matt／Uncle Bob</span><small>#011</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">這正是我今天想訪問你的原因。你在 AI 出現以前的時代影響深遠，而且幾乎親身經歷了整個前 AI 軟體年代。如今 AI 已經真正進場，你的工作方式有什麼改變？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">這件事其實讓我有點措手不及。大約是去年十二月、聖誕節前後，我只是隨手試玩。我早就碰過 ChatGPT、一些 Grok，還有其他各種工具。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So, and that&#x27;s why I&#x27;m interested to talk to you today because you&#x27;ve had this big influence in like the preAI era and you&#x27;ve been working in the pre-AI era for almost as long as it&#x27;s existed virtually now. How have things changed for you, Uncle Bob, now that AI is out there and is a thing? Um, so this took me a little by surprise around December of of last year, Christmas time, and I&#x27;m just fiddling around and I I&#x27;d already been playing with, you know, chaty PT and a little bit of Grock and a little bit of this and a little bit of</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="12" data-time="04:39" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=279s" target="_blank" rel="noopener noreferrer">04:39</a><span>Uncle Bob</span><small>#012</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">起初我沒有留下太深刻的印象。後來有一段時間，我開始覺得，也許這些東西比原先想的更有意思。我弄到第一個 Agent，應該是早期的 Grok。我請它替我寫點程式，寫得不算好，但確實寫了出來；而我當時手上剛好正在進行一個專案。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">that. And I hadn&#x27;t been real impressed. Uh, and then I went through a period where I thought, well, maybe these things are a little more interesting than I thought. And I I got an agent. First agent I got I think was um Grock early Grock. It was an early Grock one and I just asked it to write me some code and it did a kind of a poor job but it wrote the code and I was in the middle of a project at the time.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="13" data-time="05:06" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=306s" target="_blank" rel="noopener noreferrer">05:06</a><span>Uncle Bob</span><small>#013</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">於是我想，也許它能幫忙。我讓它和我一起做專案，但我幾乎一直在替它收拾殘局。它總是把現場弄亂，四處留下像狗屎一樣的小爛攤子。我當時的感覺是，它很快，這點很有趣；但它也令人挫折，因為收拾它的東西反而拖慢了我。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So I said well maybe this thing can help me with this project and I started having it work with me on the project and I was cleaning up after it all the time just you know it was always making a mess. was always leaving little dog dude behind. And I thought, you know, it&#x27;s it&#x27;s interesting because it&#x27;s fast, but it&#x27;s frustrating because it makes me slow.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="14" data-time="05:31" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=331s" target="_blank" rel="noopener noreferrer">05:31</a><span>Matt／Uncle Bob</span><small>#014</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">沒錯。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">接著我想到，等一下，正因為它很快，所以它能做一些我做不到、或不值得由我親自做的事情。2000 年代初期曾有幾項技術讓我眼睛一亮。我覺得它們是好點子，卻完全不實用。其中一項叫作 CRAP。沒辦法，它就是個縮寫。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&gt;&gt; Yep. &gt;&gt; And then I started thinking, well, wait a minute, because it&#x27;s fast, it can do things that I cannot. So in the uh very early 2000s there were a couple of innovations that that caught me. I thought oo these are good ideas but they were completely impractical. One of them was called um uh crap. Um it was uh it&#x27;s an acronym.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="15" data-time="05:58" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=358s" target="_blank" rel="noopener noreferrer">05:58</a><span>Uncle Bob</span><small>#015</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">CRAP 的做法，是把程式碼覆蓋率，也就是測試覆蓋率，和每個函式的循環複雜度放進一套複雜公式，最後算出一個分數。那個分數大致是在衡量你的函式到底有多「爛」。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">What can I say? But it&#x27;s it was a way to take uh code coverage. So you would you would run code coverage, test coverage over your code and you&#x27;d also measure the cyclatic complexity of every function and you would mix those two in a complicated formula and out would come a score and the score was a measure of how crappy your function was.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="16" data-time="06:25" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=385s" target="_blank" rel="noopener noreferrer">06:25</a><span>Uncle Bob</span><small>#016</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">2000 年代初，我認為這是很棒的點子，便拿手上一個大型專案來跑。結果的確找出一堆很爛的函式；但我得逐一修正它們、重寫測試，耗掉非常久。何況原本系統都能運作，我實在負擔不起這樣做。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And uh way back in the early 2000s, I thought this is a great idea. And I ran it over a big project I was working on. And yeah, there was a bunch of crappy functions, but then it took me forever to go through every one of those functions and try and fix them and rewrite the tests and but and it was all working. So I didn&#x27;t think I really could afford to do that.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="17" data-time="06:47" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=407s" target="_blank" rel="noopener noreferrer">06:47</a><span>Uncle Bob</span><small>#017</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">所以它雖然有趣，我還是先擱在一旁。另一項創新叫作 Mutation Testing（突變測試），這也非常吸引我。它會用一個小程式巡過原始碼，把負號改成正號、小於改成大於、等於改成不等於，還會做其他類似變更。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So although it was interesting, I kind of set it aside. And another one of those um innovations was called mutation testing. And this this one really caught my attention, too, because in mutation testing, you you have a little a little program that runs through your source code and flips negative signs to positive signs and less than signs to greater signs and equal signs to not equal signs and other things as well.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="18" data-time="07:11" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=431s" target="_blank" rel="noopener noreferrer">07:11</a><span>Uncle Bob</span><small>#018</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">每做一次這種變更，它就把整套測試全部跑一遍，並且預期測試必須失敗，因為程式顯然已被改動了重要語意。假如測試沒有失敗，那就是一個「存活的突變體」，你得把它殺掉。我大約在 2000 年，也拿同一個專案試過。測試套件每次要跑四分鐘，而它可能得跑上數百次，所以只能整夜執行。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And for each of those flips, it runs your entire test suite and expects the test suite to fail because obviously they&#x27;ve changed something significant. And if it doesn&#x27;t fail, well, that&#x27;s a surviving mutant and it must be killed. Now, I ran this again over that same project right around the year 2000. And I had to run it overnight because the test suite ran for four minutes and I was running it maybe several hundred times.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="19" data-time="07:40" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=460s" target="_blank" rel="noopener noreferrer">07:40</a><span>Uncle Bob</span><small>#019</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">結果它找出不少存活突變體，我也能補強測試把它們解決。但同樣地，這在當時並不實用，根本無法納入一般建置流程。到了去年十二月，或當時可能已經是一月，我突然想到：等一下，這些 Agent 很快，也不在乎工作有多無聊，而且會照我要求去做。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Uh, but it came up with a bunch of surviving mutants which I was able to fix. But once again, it was impractical. I could not put that as part of a a normal build scenario. And so I&#x27;m sitting there last December or maybe it was January by this time and I&#x27;m thinking,&quot;Well, wait a minute. These guys are fast and they don&#x27;t care how boring the work is and they will do what I tell them to do.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="20" data-time="08:04" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=484s" target="_blank" rel="noopener noreferrer">08:04</a><span>Uncle Bob</span><small>#020</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">那何不讓它把剛完成的所有內容都跑一次 CRAP 分析？它真的會跑，接著自己清理程式碼。我看著它工作，心想這還真不錯。再叫它跑突變測試，它也照做。以前得整夜跑完的事情，它也許三十分鐘就完成，然後再把所有漏洞補上，確保每個地方都有測試覆蓋。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So why don&#x27;t you run crap over everything you&#x27;ve just done and it would run crap and then it would it would clean up the code.&quot; And I was watching it do this. I think, well, that&#x27;s pretty cool. And why don&#x27;t you run mutation testing, too? and it would run the mutation testing. Maybe it took it 30 minutes instead of an overnight run and then it would plug all the holes and make sure there were tests covering everything.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="21" data-time="08:30" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=510s" target="_blank" rel="noopener noreferrer">08:30</a><span>Uncle Bob</span><small>#021</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我想，這或許就是清理那些「狗屎」的方法。Agent 會留下很多爛攤子和鬆散雜物，但這些工具也許能把它們掃乾淨。因此我沿著這條路繼續加入更多工具，也持續調整與 Agent 合作的方式，最後把它們帶到能交出相當不錯成果的程度。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I thought, you know, this might be a way to clean up the dog dew. These things leave a lot of deus and fluff behind, but maybe this is a good way to clean up all the dog. So I I continued on this path of adding more tools and continuing to work with these agents and I got them to a place where they were doing a pretty good job.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="22" data-time="08:50" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=530s" target="_blank" rel="noopener noreferrer">08:50</a><span>Uncle Bob</span><small>#022</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">所以我現在的原則是：先讓 Agent 開始工作，再要求它們執行這些工具；而我會努力把整個流程推到一個境界，也就是我根本不必閱讀程式碼，依然可以信任它們做的事。當然，我會用其他方式驗證程式碼品質仍然可靠。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So nowadays my nowadays my principle is, you know, I will set the agents working. I will have them run these tools and I&#x27;m going to work very hard to get it into a situation where I don&#x27;t have to look at the code at all. &gt;&gt; I can trust what they do. And now I do other things to verify that the code is still decent.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="23" data-time="09:13" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=553s" target="_blank" rel="noopener noreferrer">09:13</a><span>Uncle Bob</span><small>#023</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我會查看 CRAP 分數，確保它夠低；偶爾抽查程式碼，也會執行一大堆其他測試。但整體目標就是如此。既然它們真的很快，而我又能把它們限制在能做出好成果的範圍內，我就不打算把自己的緩慢強加在它們身上。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">You know, I will look at the crap scores and make sure that they&#x27;re low. And I will I will do spot checks on the code from time to time. And I have a whole bunch of other tests that I run. But overall, that&#x27;s my goal. If these things are fast, and they are, and if I can constrain them to do a good job, then I am not going to impose my slowness upon them.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="24" data-time="09:40" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=580s" target="_blank" rel="noopener noreferrer">09:40</a><span>Uncle Bob／Matt</span><small>#024</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">對我而言，逐行或細部檢閱程式碼反而成了額外負擔。它們處理程式碼很快，我處理程式碼很慢。因此，我把程式碼交給它們，自己負責周邊的護欄，確認整體仍然正確。到目前為止，效果不錯。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">也就是說，你的目標是逐步離開程式碼本身，甚至淡出人工 Code Review，改為在程式碼外圍搭起一套鷹架，讓你不必直接碰它，同時用盡可能緊的拘束衣把 Agent 約束住，避免它犯錯。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And my bonus is reviewing the code or inspecting the code at some kind of level of detail. They are fast with code. I am slow with code. So I&#x27;m going to let them have the code and I&#x27;m going to deal with the stuff around that to make sure it&#x27;s all okay. So far so good. So your goal is to start pulling yourself away from the code, away from human review to construct this scaffolding around the code so that you don&#x27;t have to interact with it much yourself and so that the agent is constrained as much as possible in as tight a straight jacket as</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="25" data-time="10:17" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=617s" target="_blank" rel="noopener noreferrer">10:17</a><span>Matt</span><small>#025</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">不過這裡有個前提值得先談。首先，「dog doo」用英國口音念起來實在不太好聽。更重要的是，為什麼狗屎般的壞程式碼真的那麼糟？為什麼我們要在意？既然 Agent 這麼快、推進速度這麼高，為什麼還得費力打造這些控制裝置？難道不能一路往前衝，直到 Bug 自己消失嗎？</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">possible so that it can&#x27;t make a mistake. I think there&#x27;s so there&#x27;s an assumption there that I want to touch on first which is that the word dog do right doesn&#x27;t sound good in in a British accent dog do you know so so what why is why is dog do bad why is bad code bad like why why do we care about that because these things are so fast and they can move so quickly why do we care why are we bothering with all of this harness can&#x27;t we just push through until the bugs just disappear.</p>
</details>
</div>
</details>


### 品質護欄與上下文

<details class="article-transcript" data-index="26" data-time="10:52" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=652s" target="_blank" rel="noopener noreferrer">10:52</a><span>Uncle Bob</span><small>#026</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我很早就注意到一件事，大約是在十二月。當時我和那個小小的 Grok Agent 合作，叫它做一件事，它便在旁邊留下一堆髒亂。我沒有先清掉，而是直接叫它做下一件事，結果又留下更多髒亂；接著再做下一件，情況持續累積。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">One of the things I noticed really early on, like Decemberish time frame, was that I would be I&#x27;d be working with the the uh like this little Grock agent and I&#x27;d have it do something and it would leave all this mess around and instead of cleaning the mess, I would have it do the next thing and it would leave even more mess around and then I would have it do the next thing.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="27" data-time="11:13" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=673s" target="_blank" rel="noopener noreferrer">11:13</a><span>Uncle Bob</span><small>#027</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">然後我發現它開始變慢，也開始陷入困難。它會修改某個地方，卻不小心弄壞另一處；接著去修另一處，又無意間破壞第三處，最後原地打轉。我這才意識到：這些 Agent 或許很快，也可能相當聰明，但它們和人類一樣，也會受到髒亂程式碼的拖累。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And I noticed it slowing down and I noticed it having having uh difficulty. It would it would get into a mode where it would change one thing but inadvertently break another and then it would have to fix that but inadvertently break another. Started going around in circles and I thought okay these agents they may be they may be fast and they be maybe relatively smart but they are as subject as humans are to messy code.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="28" data-time="11:42" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=702s" target="_blank" rel="noopener noreferrer">11:42</a><span>Uncle Bob</span><small>#028</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">也許它們的耐受度和人類不同，但那條臨界線仍然存在。程式碼可以髒亂到連 Agent 都再也處理不了，接著它們只會不斷空轉，把情況弄得更糟，最後無能為力。我甚至真的遇過 Agent 直接放棄。有一次，某個 Agent 的意思大概就是：「我再也處理不了這東西了。」</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Now maybe not as subject. Maybe there&#x27;s a difference in threshold, but the threshold is still there. The code can get messy enough that the agents cannot deal with it any any longer and then they&#x27;ll just start to spin and make a mess even worse and and be unable. I&#x27;ve actually had them just give up. One agent one time said, &quot;I just can&#x27;t deal with this anymore.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="29" data-time="12:07" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=727s" target="_blank" rel="noopener noreferrer">12:07</a><span>Uncle Bob／Matt</span><small>#029</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">這是我的意譯，它當然沒有真的講出這句話，但狀況明顯就是如此。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">所以你的回應是：「我要怎麼把這些爛東西清掉？」我認為，多數人碰到這種情況時，會開始把更多指令塞進 Agent。他們會想：「好，我要向負責實作的 Agent 灌入更多資訊。」於是一直往 `CLAUDE.md` 或 `AGENTS.md` 裡加內容。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&quot; Parap I&#x27;m paraphrasing it. didn&#x27;t use those words, but that was obviously what was going on. &gt;&gt; Yeah. So, your response to that then is, &quot;How can I clean up the crap?&quot; And I think when most people encounter that, they start loading the agent with instructions, right? They start saying, &quot;Okay, I&#x27;m going to pour in information into the agent that&#x27;s doing the implementation, right? I&#x27;m going to pile in on claw.md or agents.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="30" data-time="12:34" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=754s" target="_blank" rel="noopener noreferrer">12:34</a><span>Matt／Uncle Bob</span><small>#030</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">每次看到壞結果，就再加一條指令。你採取的卻不是這種方式，而是建立確定性的機制。換句話說，你用的是自動化檢查；很多人用的則是我所稱的「steering」，也就是靠提示去操控方向。你為什麼沒有一路採用 steering？你仍然會做嗎？你的思考方式是什麼？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">一開始我確實就是那麼做的。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">mmd and every time I see something bad I&#x27;m going to use an instruction instead of what you&#x27;re doing where it&#x27;s a deterministic mechanism. So you&#x27;re using automated checks whereas a lot of other people are using in my terminology steering right they&#x27;re trying to steer it. So why didn&#x27;t you are you doing any steering or like how does that work in your mindset? So, initially I started with that.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="31" data-time="12:58" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=778s" target="_blank" rel="noopener noreferrer">12:58</a><span>Uncle Bob</span><small>#031</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我早期的提示詞會寫：「測試驅動開發要這樣做」、「乾淨程式碼要這樣寫」、「你的程式碼應該長成這個樣子」、「必須遵守這些規則」。最後往往堆成五到十頁長的文件，鉅細靡遺描述好程式碼的一切美德。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I start, you know, I my early prompts were here&#x27;s how you do test-driven development. Here&#x27;s how you do clean code. Here&#x27;s what your code should look like. You should follow all these rules. And, you know, you come up with eventually a document that&#x27;s five or 10 pages long describing all the good things about code.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="32" data-time="13:16" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=796s" target="_blank" rel="noopener noreferrer">13:16</a><span>Uncle Bob／Matt</span><small>#032</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我想，我甚至可以把整本該死的書全餵給它。可是我發現，不論你稱它們 Agent、模型或別的名字，它們看待這些規則的方式，很像《神鬼奇航》裡那句話：那些比較像「參考準則」，有時候才會遵守。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我一定得稱讚你，因為我腦中浮現的也是完全相同的比喻。很高興我們想到一塊去了。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I I suppose I could have fed the whole dog on book into it. Mhm. &gt;&gt; But what I noticed was that the agents, the the models, whatever you want to call them, um they treat those rules in the uh Pirates of the Caribbean sense. They&#x27;re more like guidelines, you know, might follow. &gt;&gt; Can I just Can I just credit you? That&#x27;s exactly the metaphor that came into my head as well.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="33" data-time="13:41" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=821s" target="_blank" rel="noopener noreferrer">13:41</a><span>Uncle Bob</span><small>#033</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">它們確實會逐漸淡化那些規則，而背後也有技術原因。我做了一點研究，雖然不算很多，想知道模型為什麼會這樣。結果發現一個稱為「Lost in the Middle，中段遺失」的現象：當模型內的上下文視窗愈堆愈長，開頭和結尾的內容會比較突出，中間的內容則因技術因素較容易失去影響力。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So, I&#x27;m glad we&#x27;re aligned there. &gt;&gt; Yeah. Well, so they they definitely will soften and there&#x27;s technical reasons behind this. I did a not not a lot of research but some research into why the models behave this way and it turns out that there&#x27;s this phenomenon known as lost in the middle. So as the context window builds up inside the model the stuff at the very beginning and the stuff at the very end have more prominence than the stuff in the middle uh for technical reasons.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="34" data-time="14:16" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=856s" target="_blank" rel="noopener noreferrer">14:16</a><span>Uncle Bob</span><small>#034</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">所以 Agent 會忽略中段內容。假如開頭指令本身很長，原本放在前面的東西也會被後續內容推進中間。也許一開始的前三句仍保有高優先度，但第 50 句、第 80 句早已消失在上下文中段的某個角落。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">But once again, the the agent will ignore the stuff in the middle. And anything you say at the very beginning is going to get shoved into the middle if it&#x27;s long, right? So maybe the first three sentences you put at the beginning will remain as priority, but the 50th and the 80th sentence in there, they&#x27;re gone. They&#x27;re just in the middle somewhere.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="35" data-time="14:38" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=878s" target="_blank" rel="noopener noreferrer">14:38</a><span>Uncle Bob</span><small>#035</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">可憐的 Agent 得處理一個愈來愈龐大的上下文，努力從中撈出重要訊號，而中間那些內容往往就不見了。確定性工具不會以這種方式消失。因此，我認為使用 Agent 的關鍵，也是非常難做到的事，就是把初始提示詞壓縮到絕對最小，讓其中盡可能多的內容都留在高優先區。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And the poor agent is trying to deal with this massive context that&#x27;s ever growing, ever growing. and it&#x27;s trying to pull the important bits out and the stuff in the middle is just gone. So deterministic tools don&#x27;t disappear that way. The the key that I think with agents, and this is really hard to do, the key with agents is to trim that initial prompt down to its absolute minimum so that you can get as much of it as possible into its priority.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="36" data-time="15:12" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=912s" target="_blank" rel="noopener noreferrer">15:12</a><span>Matt</span><small>#036</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">對，然後把確定性工具放到事後執行。完全同意。我把上下文視窗稱作「聰明區」和「笨區」，這不是我發明的，是 Dex Hardy 的說法，我只是借來用，因為真的很好。尤其上下文較前面的部分，例如最初約十五萬個 Token，模型通常還相當聰明。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&gt;&gt; Yeah. &gt;&gt; Right. and then do deterministic tools after the fact. &gt;&gt; Totally. I refer to this as like the smart zone and the dumb zone of the uh context window. It&#x27;s not my term. That&#x27;s Dex Hardy&#x27;s term. I stole it and it&#x27;s very very good. Which is especially at the early part of the context window, like the first 150k tokens, it&#x27;s pretty smart.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="37" data-time="15:33" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=933s" target="_blank" rel="noopener noreferrer">15:33</a><span>Matt</span><small>#037</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">但愈往後，Transformer 裡各項注意力關係就愈吃緊，訊號被稀釋。那就像每個人都在喊話，每一個 Token 都在愈來愈擁擠的房間裡大叫，最後你再也無法從雜訊中聽見真正的訊號。這和我的經驗完全吻合。所以你某種程度上放棄了 steering，重新回到過去那些自動檢查技術。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">But then as you go along, then the attention relationships in the transformer get really strained. It&#x27;s really diluted. It&#x27;s like everyone&#x27;s shouting. Each token is shouting in a crowded room and the room&#x27;s getting more crowded. Right? you can&#x27;t hear the signal for the noise. That that&#x27;s that totally rings true for me. So you&#x27;ve got then you sort of rejected steering and you sort of started going back to some old techniques in automated checks.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="38" data-time="15:58" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=958s" target="_blank" rel="noopener noreferrer">15:58</a><span>Matt／Uncle Bob</span><small>#038</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">而這些檢查不像 steering 指令那樣塞進上下文視窗，因此似乎可以一層又一層往上疊。假如再搭配強型別語言、測試等機制，整體會變成什麼模樣？自動化檢查是否也可能多到過頭？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">這正是我現在非常努力想找出答案的問題。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Now it sounds like then because those checks don&#x27;t go into the context window in the same way that steering instructions do, you can kind of just layer those on, right? And layer them up and up and up. So if you&#x27;re using a language with strong types and like tests and like how does that picture look to you? Is there ever too much when it comes to automated checks? &gt;&gt; That&#x27;s one of the things that I&#x27;m working very hard to figure out.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="39" data-time="16:22" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=982s" target="_blank" rel="noopener noreferrer">16:22</a><span>Uncle Bob</span><small>#039</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">顯然一定存在「太多」的情況。你終究可能把 Agent 拖慢到比人類還慢，那時就已經輸掉這場遊戲，根本沒有做的必要。不過只要它相對人類仍保有生產力優勢，你就還是領先。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Obviously there has to be a case where there&#x27;s too much, right? You eventually you will slow the agents down to the point where they&#x27;re slower than humans. And at that point you&#x27;ve lost the game. &gt;&gt; Why do it? Um, but as long as you can keep the margin of productivity higher than a human, you&#x27;re still you&#x27;re still ahead of the game.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="40" data-time="16:43" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1003s" target="_blank" rel="noopener noreferrer">16:43</a><span>Uncle Bob</span><small>#040</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">依我目前觀察，這個優勢仍可維持在兩倍、三倍或四倍左右，它們依然很快。當然，我已經大幅拖慢它們。使用確定性工具時，你其實是把 Agent 放進一個迴圈。如今大家很愛談迴圈，而這就是一個典型例子。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Uh, and and from what I&#x27;ve seen so far, I you know, I can get that margin, you know, like a factor of two or three or four, right? They&#x27;ll they&#x27;ll still go pretty fast. Now, I&#x27;m I&#x27;m slowing them down a lot. When when uh when you use these deterministic tools, what you are really doing is you&#x27;re putting them into a loop. Lots of people like to talk about loops nowadays.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="41" data-time="17:03" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1023s" target="_blank" rel="noopener noreferrer">17:03</a><span>Uncle Bob</span><small>#041</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">你把它放進迴圈並告訴它：「你必須持續修改程式碼，直到這項工具判定合格。」於是 Agent 一圈又一圈地跑：「好，我得修這個、做那個；這裡得補更多測試；得降低循環複雜度。」</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">You&#x27;re putting them into a loop and you&#x27;re saying, &quot;Okay, you must you must change the code until this tool says that it&#x27;s okay.&quot; And now the agent is going around and around and around. Okay, I&#x27;ve got to do this. I&#x27;ve got to do that. I&#x27;ve got to I&#x27;ve got to add more tests over here. I&#x27;ve got to cut the cyclatic complexity.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="42" data-time="17:19" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1039s" target="_blank" rel="noopener noreferrer">17:19</a><span>Uncle Bob</span><small>#042</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">「我得把這些函式拆開，還有一大堆工作要做。」它會花上一段時間，直到所有內容符合規範。你等於犧牲一部分生產力，換取更高品質；某個地方必然會遇到報酬開始反轉的臨界點，只是我還沒找到。現在我正在嘗試讓多個 Agent 彼此對話與交接：一個負責某件事，下一個審查，再下一個測試，另一個加固，依此類推。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I&#x27;ve got to split these functions apart. Got to do all this work. And it takes it a while to do all that until it gets it into conformance. So you&#x27;re you&#x27;re you&#x27;re you are sacrificing productivity for higher quality and at some point that&#x27;s got to give way. But I haven&#x27;t found the end point of that yet. &gt;&gt; So now I&#x27;m in the midst of trying to get multiple agents talking to each other and handing off to each other so that one guy does one thing and the next one reviews it and the next one tests it and the next one hardens it and so on. And</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="43" data-time="17:52" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1072s" target="_blank" rel="noopener noreferrer">17:52</a><span>Uncle Bob／Matt</span><small>#043</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">這會產生非常驚人的溝通成本，但整體仍大幅快過人類。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">那我們就來談 Multi-Agent 系統，因為我覺得它非常迷人。不過我一直對某類說法抱持懷疑，這也許是我們看法不同之處。有些人會說：「我已經把所有員工都裁掉，現在有一百個 Agent。」</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">there&#x27;s communication overhead like crazy in that. and yet it&#x27;s still faster by a large token than a human. &gt;&gt; Let&#x27;s talk about that. Let&#x27;s talk about multi- aent systems because that&#x27;s I find that super fascinating. I have always had a bit of a and I think this might be something something where we differ &gt;&gt; which is I&#x27;ve always had a bit of a suspicion of like people who say uh you know I&#x27;ve I&#x27;ve got rid of all my workforce. I now have a hundred agents.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="44" data-time="18:21" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1101s" target="_blank" rel="noopener noreferrer">18:21</a><span>Matt</span><small>#044</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">每個 Agent 都有不同角色，彼此交談，甚至各自擁有電子郵件帳號，諸如此類的胡扯。我通常不太相信這套。不過在「實作」與「審查」的組合上，我願意例外。它的好處未必是讓兩個 Agent 都高度專門化。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Every one of them has a different role. They all talk to each other. they&#x27;ve got their own email accounts, all that all that rubbish, you know. Um, and so for me, what&#x27;s always worked, but okay, I sort of make an exception when it comes to implementation and then review, right? And I think the benefit there is not having two very specialized agents.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="45" data-time="18:41" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1121s" target="_blank" rel="noopener noreferrer">18:41</a><span>Matt</span><small>#045</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">比較像是：第一個負責實作，採取紅、綠、重構的思路。實作者只要先寫出會失敗的測試，再把功能做通即可，不必讓程式碼漂亮。接著審查者進場，它不必重新探索整個問題，因為實作者留下的差異內容已經清清楚楚。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">It&#x27;s having okay, you do the implementation and it&#x27;s kind of like a red green refactor approach, which is the implement all it has to do is just like write the bad test and then make it work. It doesn&#x27;t have to make it beautiful. And then the reviewer comes in. It doesn&#x27;t have to do the exploration because it&#x27;s already got the diff from the implementer.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="46" data-time="19:00" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1140s" target="_blank" rel="noopener noreferrer">19:00</a><span>Matt</span><small>#046</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">它明確知道自己要審查什麼。由於任務範圍小得多，你也能在審查 Agent 的提示裡加入更多 steering 指令。因此我很想聽你的做法：實作者負責什麼、審查者負責什麼，還有所謂 hardener（加固者）又在做什麼？這部分我還沒實驗過，請多說一些。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">It knows exactly what it&#x27;s reviewing. And then you can pile in quite a lot more steering instructions in there because the task is much less constrained. So I&#x27;m really interested in your take on that on like what the implementer does, what the reviewer does, and what these other hardener agents. I&#x27;ve not experimented with that.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="47" data-time="19:17" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1157s" target="_blank" rel="noopener noreferrer">19:17</a><span>Uncle Bob</span><small>#047</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">採用這類 Multi-Agent 架構有兩項優點。第一，可以平行執行。例如你可以同時跑三個編碼 Agent，而我的小筆電其實能支援遠超過三個。第二，把 Agent 聚焦在單一任務，可以控制上下文視窗的規模。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Give me more on that. So there&#x27;s two advantages to having multiple agents like this. The one is that you can run them in parallel. So you could have, you know, three coders running at the same time. And my little laptop can support a lot more than three. Um the other advantage is that when you focus the agents down to a single task, you&#x27;re keeping the context window under control.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="48" data-time="19:42" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1182s" target="_blank" rel="noopener noreferrer">19:42</a><span>Uncle Bob</span><small>#048</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">如此一來，「中段遺失」問題就小得多。你可以在提示開頭多放幾條規則，雖然不能多太多，但它們往往會遵守得更好。你也可以設計成：Agent 被生出來，完成任務，然後死亡；下一個 Agent 以乾淨上下文接手。這些都是優點。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">The lost in the middle problem becomes much less of a problem. So you can pile a few more, not a lot more, but a few more rules up at the top and they&#x27;ll tend to follow them better. You can also set up a a system where the agents um are born, do the task, and die so that the next one comes in with a clean context. So those are the advantages.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="49" data-time="20:05" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1205s" target="_blank" rel="noopener noreferrer">20:05</a><span>Uncle Bob</span><small>#049</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">缺點則是啟動成本很高。Agent 光是開始運作可能就要十到十五秒，之後還得重新理解完整上下文，這些都形成啟動時間。我喜歡把任務切得盡可能聚焦。首先，我會啟動一個 Specifier，也就是規格整理 Agent。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">The disadvantages are that the startup times are high, right? So an agent takes, you know, 10 15 seconds to even start up. uh and then it&#x27;s got to figure out its whole context all over again. So there&#x27;s that that particular startup time as well. I like to focus the task as much as I can. So I will run a specifier.</p>
</details>
</div>
</details>


### Multi-Agent 品質管線

<details class="article-transcript" data-index="50" data-time="20:26" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1226s" target="_blank" rel="noopener noreferrer">20:26</a><span>Uncle Bob</span><small>#050</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">Specifier 的工作，是把人類寫的文件轉成 Gherkin 規格，以及一套 QA 程序。Gherkin 就是 Given／When／Then 那種格式，屬於高階驗收測試；QA 程序基本上則是一套系統測試，也就是依照文件，從 UI 操作整個系統。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">The job of the specifier is to take a a human written document and turn it into a uh a girkin and a QA a QA uh procedure. Girkin is you know given when then stuff. It&#x27;s a high level acceptance test. Uh and a QA procedure is a essentially a system test. You know you run the system through the UI with a with a QA procedure.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="51" data-time="20:56" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1256s" target="_blank" rel="noopener noreferrer">20:56</a><span>Uncle Bob</span><small>#051</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我要求它們完全從人類角度來寫：「你是一個人，正在透過 UI 操作這套系統，而且必須證明系統能正常工作。」最後會產出兩份文件，一份 Gherkin、一份 QA 文件。接著把兩者交給 Coder。Coder 的工作，是撰寫單元測試，以及實作該使用者故事所需的程式碼，同時讓 Gherkin 驗收測試通過。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And I have them write it from a human&#x27;s point of view. You are a human. You are operating this system at the UI. You must prove that the system works. And I will produce those two documents. Girkin documents QA documents. And then those feed into a coder. The coder&#x27;s job is to write unit tests and the code that implements the described uh story and uh also get the girkin working.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="52" data-time="21:24" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1284s" target="_blank" rel="noopener noreferrer">21:24</a><span>Uncle Bob</span><small>#052</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">Coder 會花一些時間把功能做通，完成後再交給 Cleaner。Cleaner 的工作是執行 CRAP 分析，加上一般程式碼審查，清掉實作者留下的所有髒亂，因為走到這一步時，實作者通常早已把現場弄得慘不忍睹。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So it has to do that and then that gets fed over. Once that&#x27;s working, the coder will work on that for a little while that gets fed into a cleaner and the cleaner&#x27;s job is to run crap analysis and just general code review. clean it clean up whatever mess the implement made because the implement will have made a horrible mess by that point.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="53" data-time="21:45" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1305s" target="_blank" rel="noopener noreferrer">21:45</a><span>Uncle Bob</span><small>#053</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">接著交給 Hardener。Hardener 會執行突變測試，而且毫不留情。它會不斷突變程式碼，要求達到百分之百覆蓋率，等號、小於號等各種條件都要被驗證，這會花上很長時間。完成後再交給 QA Agent。QA Agent 會把原本的 QA 文件轉成可執行腳本，實際操控系統，最後產出確定性的通過或失敗結果。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And then I have it go from there to a hardener. The hardener is the guy who runs the mutation testing and he&#x27;s absolutely merciless, right? It&#x27;s going to mutate it and it&#x27;s going to have 100% coverage and every equal sign and every less it&#x27;s going to do that work which takes a good long time. uh and it pops out the end and then it goes into a QA agent and the QA agent takes the the written QA document, turns it into an executable script that manipulates the system and comes up with a deterministic result.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="54" data-time="22:23" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1343s" target="_blank" rel="noopener noreferrer">22:23</a><span>Uncle Bob</span><small>#054</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">假如程式能一路通過這些關卡，你得到的就會是一套相當能運作的程式。我用這套方式已經取得很多成功。某項任務若交給單一 Agent，五分鐘就能做完，但結果相當可疑；用這條流程則大約要一小時。不過仍然划算，因為人類可能得花半天。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And and if you can get through all of that, you&#x27;ve got a pretty pretty working program. I&#x27; I&#x27;ve had a lot of success with this. it uh if I if I give it a task that takes a single agent five minutes to complete with questionable results. Uh this will take it about an hour. It&#x27;ll take about an hour to go through all that which is still a benefit because you know a person would take about a half a day.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="55" data-time="22:52" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1372s" target="_blank" rel="noopener noreferrer">22:52</a><span>Uncle Bob／Matt</span><small>#055</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">所以我的生產力也許提升了四到五倍，而且品質非常高，甚至高到超過一般人類願意投入的程度。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">而且你不只是省下當下的生產力。你其實是先把生產力投資在前段，換取未來的回報；這是在投資自己的程式碼庫。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">沒錯。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So maybe I&#x27;ve got a you know a factor of four factor of five improvement in productivity and very high quality much more quality than the human would ever put into it. And it&#x27;s not only that, but you&#x27;re you&#x27;re saving productivity or or you&#x27;re spending productivity early to gain it later, right? This is an investment in your own codebase. Yeah.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="56" data-time="23:11" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1391s" target="_blank" rel="noopener noreferrer">23:11</a><span>Matt</span><small>#056</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我覺得很有意思的是，你操控的不只是上下文視窗本身，還包括整個工作階段的「上下文軌跡」。假如你先讓 Agent 做某件事，並把它引導到某個方向，那麼同一場 Session、同一個上下文視窗裡後續的所有行為，往往都會繼續沿著那條軌跡前進。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">What I found really interesting about that is this is something I&#x27;ve been thinking about recently is it&#x27;s not only the context window that you&#x27;re manipulating. You&#x27;re also there&#x27;s this idea of a trajectory of a context window, right? Of a session where if you get the agent to do one thing and you steer it in a certain way, then everything that follows in that same session, that same context window, will continue following that trajectory.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="57" data-time="23:35" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1415s" target="_blank" rel="noopener noreferrer">23:35</a><span>Matt</span><small>#057</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">例如你讓它說：「好，也許這裡應該測試 UI。」此後不論你要求它做多少次修改，它每次都可能再次測 UI。唯一能清除這條軌跡的方法，就是清空上下文視窗。因此，一個只求先把功能做通的實作 Agent，其軌跡就不會像那個堅持百分之百覆蓋率的 Agent 那麼嚴苛。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So if you get it to say, &quot;Okay, maybe we should test the UI here,&quot; then every single time it will test the UI again, no matter how many changes you get it to make. And the only way to clear the trajectory is to clear the context window, right? So if you&#x27;re an implement agent and you&#x27;re just trying to get it working, then your trajectory is kind of it&#x27;s not quite as harsh as the one who&#x27;s trying to make sure you have 100% coverage.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="58" data-time="24:00" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1440s" target="_blank" rel="noopener noreferrer">24:00</a><span>Matt／Uncle Bob</span><small>#058</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我覺得這點很有趣。它和你的心智模型吻合嗎？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">完全吻合。這些模型有一個相當知名的效應，而且非程式設計情境也會發生。比如你正和模型聊哪種咖啡最好喝、怎麼沖才好，整段對話都很愉快。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And I found that really interesting. Is that something you does that click with your mental model as well? &gt;&gt; Yeah, it certainly does. There&#x27;s a a pretty well-known effect with these models and it happens with people who aren&#x27;t programmers, right? So, you&#x27;re talking to a model about um oh, I don&#x27;t know what what&#x27;s the best coffee to have and how do you how do you brew it nicely? And you&#x27;re having this nice little conversation with the agent about this or with the model about this.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="59" data-time="24:26" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1466s" target="_blank" rel="noopener noreferrer">24:26</a><span>Uncle Bob</span><small>#059</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">忽然有人從旁邊走過，正在談他最近看的電視連續劇，這些內容意外進入上下文視窗。不是你加進去的，是路人帶進來的；但從那一刻起，所有咖啡話題都開始和那齣連續劇扯上關係。模型不知道兩者不同，也無法正確區分。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And then somebody walks by and they happen to be talking about the latest soap opera that they saw saw on television and that gets into the context window. You didn&#x27;t put it there. This guy walking by put it in there. But then from that point on all the coffee references have to do with the soap opera, right? The the the model doesn&#x27;t know. It can&#x27;t differentiate.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="60" data-time="24:47" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1487s" target="_blank" rel="noopener noreferrer">24:47</a><span>Uncle Bob／Matt</span><small>#060</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">所以你所說的「軌跡」很精準。只要模型的方向沒有混亂，它知道自己正在往哪裡走，而且上下文內的內容彼此一致，就不太會出現大家常遇到的離譜幻覺。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">甚至不一定是幻覺，也可能只是偏離目標。幻覺永遠是風險，不論來自模型本身，還是你餵給它的上下文；大家某種程度已接受這項風險。而你這種讓不同 Agent 接連通過殘酷關卡的做法，正好能把許多問題消掉。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So your idea of trajectory is pretty good, right? As long as you can keep the direction of the model unconfused. It knows the direction it&#x27;s going in. Everything in the context window is consistent. then it&#x27;s not going to have these crazy hallucinations that that people often deal with &gt;&gt; or even just mis even just misalignment right like halluc I think hallucination is always a danger right like whether it&#x27;s you know hallucination context you gave it whatever like it&#x27;s an sort of an accepted danger and your approach of</p>
</details>
</div>
</details>


### 架構、模組與測試

<details class="article-transcript" data-index="61" data-time="25:19" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1519s" target="_blank" rel="noopener noreferrer">25:19</a><span>Matt</span><small>#061</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">好，你已經談了很多實作階段，之後還能再回來。另一件我想問的是，你前期會做多少規劃？特別是，你如何思考程式碼庫的內部結構？擁有一套好測試當然重要，但我很想知道你對整體設計的看法。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">this kind of gauntlet of different agents slamming horrendous stuff is sort of a is a great way of taking out that so okay you&#x27;ve talked a lot about the implementation phase and we can get back to that later too. What I&#x27;m also interested in is what planning do you do up front and especially how are you thinking about the internal structure of your code bases? Because having a good test suite, right? I mean, I&#x27;m interested in what you think here.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="62" data-time="25:50" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1550s" target="_blank" rel="noopener noreferrer">25:50</a><span>Matt／Uncle Bob</span><small>#062</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">完善的測試套件、突變測試等都很好；但假如 API 設計很差，模組形狀也很糟，它們會如何與這些自動檢查交互作用？你投入多少心力在架構上？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">直到大約一個月前，這部分我都還是手動處理。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Having a good test suite is good, right? Having mutation testing, all that stuff is good. But if you&#x27;ve got badly designed APIs, if you&#x27;ve got badly shaped modules, how does that interact with all of this automated checks and stuff like how much are you thinking about that? &gt;&gt; So up to the last month or so, what I was doing there was doing that part manually.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="63" data-time="26:16" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1576s" target="_blank" rel="noopener noreferrer">26:16</a><span>Uncle Bob</span><small>#063</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我會先讓 Agent 建出一套看起來不錯的東西，接著對它們展開盤問。這仍然是手動過程，只是我會利用 Agent 來回答：「目前結構是什麼？這個模組和那個模組如何互動？系統到底有哪些模組？它們怎麼溝通？」問完之後，我通常會嚇得半死，因為答案恐怖得不得了。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So I would I would have the agents build me up a nice thing and then I would interrogate the agents. And this was manual but but still using the agents, right? I&#x27;d interrogate the agents. What&#x27;s the structure here? How how does this module interrelate with that module? What are the modules after all? And how do they talk to each other? I would ask those questions and then I would get scared to death because the answers were horribly frightening.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="64" data-time="26:42" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1602s" target="_blank" rel="noopener noreferrer">26:42</a><span>Uncle Bob</span><small>#064</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">然後我會親自設計模組結構，再告訴 Agent：「模組真正應該這樣切分，彼此應該這樣溝通。」我會提供一份實作計畫，再讓它們照著做。這部分很棘手。因此，我也讓 Agent 替我做了一個架構檢視器。它能在畫面上顯示一張漂亮的 UML 圖，呈現系統模組結構與依賴方向。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And then I would design a module structure and I would tell the agent, okay, here&#x27;s how the modules should really be partitioned and here&#x27;s how you should communicate with them. And I would give them an implementation plan that they would then implement. Now, that&#x27;s a that&#x27;s a tough one. So I also had my agents build me an architecture viewer so I can pop up on the screen a nice little UML diagram essentially nice little UML diagram that shows me the modular structure of the system and where the dependencies run</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="65" data-time="27:13" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1633s" target="_blank" rel="noopener noreferrer">27:13</a><span>Uncle Bob</span><small>#065</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我可以點進某個模組查看其中的子模組，再點進子模組，甚至直接把程式碼叫到畫面上。換言之，我能任意往下鑽，在任何層級檢視系統架構。這工具對我非常實用，我也經常使用。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">and I can click on a module and I can see inside it to the subm modules and I can click on the subm modules and it&#x27;ll actually pop the code up on on the screen for me. So I can I can drill down as much as I want and view the system architecture at any level. That was really useful to me and I I&#x27;ve made good use of that.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="66" data-time="27:34" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1654s" target="_blank" rel="noopener noreferrer">27:34</a><span>Uncle Bob</span><small>#066</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我另外建立了一項確定性工具，可以明確定義哪些模組能依賴哪些模組、哪些不能互相依賴，以及依賴關係應該往哪個方向流動。這些規則會寫進一個小而嚴密的規格檔，Agent 不得違反。最後還有一個檢查器；若發現違規，Agent 就必須想辦法修正。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I&#x27;ve also put together a another deterministic tool where I can define which module should depend on which, which one should not depend on which, how the dependency should flow. That goes into a nice tight little specification file that the agents cannot violate. There&#x27;s another little checker that runs at the end and if they violate it, they&#x27;ve got to fix it somehow.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="67" data-time="27:57" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1677s" target="_blank" rel="noopener noreferrer">27:57</a><span>Uncle Bob／Matt</span><small>#067</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">通常它會反轉依賴、插入介面、把模組拆成兩半，或採取其他方式，確保我的架構規則不被破壞。我現在正嘗試把「產生架構規則」本身也自動化，但目前不太順利。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我和你幾乎坐在同一艘船上。良好設計的模組能帶來巨大槓桿。你能解釋這份槓桿來自哪裡嗎？為什麼模組結構這麼重要？</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Usually by inverting a dependency or inserting an interface or splitting a module in half or something like that and it will it will um keep my rules um from being violated. I&#x27;m working now to see if I can automate that and I&#x27;m having not a lot of luck so far. I&#x27;m basically in exactly the same boat as you, which is you just get so much leverage by having well-designed modules, right? Could you explain what that leverage is? Why is why is having a good structure for these modules important? &gt;&gt; Well, it&#x27;s the same argument that we had</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="68" data-time="28:36" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1716s" target="_blank" rel="noopener noreferrer">28:36</a><span>Uncle Bob</span><small>#068</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">道理和髒程式碼對乾淨程式碼完全相同。任何切分良好、介面紀律清楚的系統，人類都比較容易掌握，因為我們的腦袋擅長把事物分艙處理。模型和 Agent 也是如此，也許它們的臨界值和人類稍有不同，這我還不知道。但只要它們能聚焦在單一模組，而且該模組保有一致的「軌跡」，不會因內部混雜太多主題而困惑，工作表現就會好得多。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">for the dirty code versus clean code. Anything that is well partitioned with welld disciplined interfaces between it is something a human can grasp because we compartmentalize in our minds well so do the models so do the agents maybe at a slightly different threshold I don&#x27;t know about that yet but they work far better if they can focus on a module and if that module has a trajectory right using your term so that the the model does not get confused by the topics inside that module.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="69" data-time="29:12" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1752s" target="_blank" rel="noopener noreferrer">29:12</a><span>Uncle Bob／Matt</span><small>#069</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我一直同時說 model 和 module，希望大家沒有搞混。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我們懂，我們懂。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">但這真的很重要。還是那個咖啡與連續劇的例子。假如你在一個模組裡塞進天底下所有東西，可憐的 Agent 就會想：「我到底在這裡做什麼？這裡還能怎麼工作？」若能妥善分艙，它就會像人類一樣運作得相當好。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Okay, I&#x27;m using the word model and module. I want clear. &gt;&gt; We get it. We get it. &gt;&gt; But that that&#x27;s important. And it&#x27;s the same argument. It&#x27;s the coffee and soap op opera argument. If you load up a module with every bit of stuff under the of under the sun, the the poor agent is going to wonder, &quot;What the heck am I doing in here? How do I do anything in here?&quot; if you compartmentalize nicely works pretty well just like a human.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="70" data-time="29:41" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1781s" target="_blank" rel="noopener noreferrer">29:41</a><span>Matt</span><small>#070</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">這樣一來，你可能也能從測試套件獲得更高價值。這讓我想到另一個相關問題。我必須說，我非常喜歡你的作品，但我也是 John Ousterhout 作品的忠實讀者。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&gt;&gt; So you&#x27;re getting and you&#x27;re probably getting better value out of your test suite as well because that&#x27;s what I always think is like okay I suppose here&#x27;s here&#x27;s another question for you that&#x27;s related to this I think of and I have to say I&#x27;m a huge fan of um huge fan of your work but I&#x27;m also a huge fan of John Aster&#x27;s work.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="71" data-time="29:57" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1797s" target="_blank" rel="noopener noreferrer">29:57</a><span>Matt</span><small>#071</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">誰不是呢？他是很棒的人，你附近大概也放著他的書。他提出的「深模組」概念令我著迷。壞模組往往是淺模組，介面很寬，內部卻沒有隱藏多少東西；深模組則擁有很小的介面，背後隱藏大量資訊。我覺得這對模型特別有利，因為模型只要讀懂介面，不必先理解完整實作。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Yeah &gt;&gt; where um I mean who isn&#x27;t a great guy you you probably got his book around somewhere. Um and his concept of deep modules is something I find really fascinating which is you have an you can have bad modules which is kind of shallow modules right that have a wide interface and not much hidden inside them and you can also have deep modules which have a small interface and then a deep um lots of hidden information inside them and it occurs to me that that is really good with models because they can read the interface without</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="72" data-time="30:27" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1827s" target="_blank" rel="noopener noreferrer">30:27</a><span>Matt／Uncle Bob</span><small>#072</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">這和你的想法相呼應嗎？你的做法也是如此嗎？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">完全是。模型會注意介面名稱，也會注意整體結構。這能讓它們不必閱讀下層程式碼，既是優點，也可能成為風險。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">having to understand the implementation. Does that sort of chime with you? And it&#x27;s not how you&#x27;re approaching things as well. &gt;&gt; Yeah, &gt;&gt; absolutely. Does &gt;&gt; the models pay attention to interface names? They they pay attention to the structure. It can allow them to not read the code beneath them, which is both a danger and and an advantage.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="73" data-time="30:45" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1845s" target="_blank" rel="noopener noreferrer">30:45</a><span>Uncle Bob</span><small>#073</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">只要程式碼保持一致，就沒有問題。它們也會注意測試，會透過閱讀測試理解系統行為。因此，任何能改善程式碼結構的事情，都能幫助模型理解程式碼。順帶一提，這本書的附錄裡，有一段我和 John Ousterhout 的長篇辯論，非常有趣。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&gt;&gt; Y &gt;&gt; as long as the code is consistent, you&#x27;re okay. Um they also pay attention to the tests. They read tests to understand what the system does. Um so yeah all anything you can do that helps the structure of the code will help the models understand that code. By the way in this book there is a long debate between me and John Ora in the appendix and it it was a lot of fun.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="74" data-time="31:11" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1871s" target="_blank" rel="noopener noreferrer">31:11</a><span>Uncle Bob／Matt</span><small>#074</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我們兩個聊得很開心。好吧，我不知道他有多開心，但我自己非常開心。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我把整段都看完了。我看過你們在 YouTube 上的一場精彩對談，真的非常喜歡。事實上，那也正是我今天想邀你來的原因之一。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">He and I had a blast. Well I don&#x27;t know how much fun he had but I had a lot of fun. &gt;&gt; I watched I watched the entire thing. I saw you guys interviewed um on a really great uh uh YouTube discussion where you talked about it and I I I I just loved it and I that&#x27;s kind of the reason I wanted you to come on actually because I I just enjoyed that so much.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="75" data-time="31:30" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1890s" target="_blank" rel="noopener noreferrer">31:30</a><span>Matt</span><small>#075</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">接下來有好幾條路可以問。那麼，你現在回頭看自己的書，有沒有什麼內容會想修改或更新？我特別想到「建立小函式、保持函式短小」這類建議。我們剛才一直在談很多事情其實沒有改變：這種品質關卡始終是好方法，只是過去從來沒有足夠人力把每一關都跑完。這些想法長期以來都成立，如今只是換了一種執行方式。可是，有沒有什麼舊觀念是現在真的應該丟掉的？</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Um okay, there&#x27;s a few different ways I could go now. Um okay. Is there in your book anything that you would change or update now? because specifically I&#x27;m thinking about some advice like um create small functions let&#x27;s say and keep functions small um is there is there anything that you&#x27;re sort of because we&#x27;ve been talking a lot about how things have not changed right how gauntlets like this have always been good we&#x27;ve just never had the labor available to actually push through them right these ideas have been good for a long time we&#x27;re just sort of</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="76" data-time="32:09" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1929s" target="_blank" rel="noopener noreferrer">32:09</a><span>Matt／Uncle Bob</span><small>#076</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">這是個很寬廣的問題，我也不太喜歡這樣問，因為會給你很大壓力。不過你有答案嗎？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">首先，是各種「門檻值」需要改變。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">modifying them in a different way but is there anything that we just need to and this is I suppose a wide question. Is there anything that we need to throw out that&#x27;s just like done or is there anything that&#x27;s I don&#x27;t like asking this question because it puts a lot of pressure on you, but do you have an answer for that one? &gt;&gt; So, um thresholds for one thing.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="77" data-time="32:28" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1948s" target="_blank" rel="noopener noreferrer">32:28</a><span>Uncle Bob</span><small>#077</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我認為 Agent 能承受的複雜度和人類不同。它們擁有好得多的短期記憶，不只是巨大，而且短期內幾乎可以精準保留。因此，我做的一件事就是放寬函式允許的大小，而調整方式是改變 CRAP 分數門檻。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Uh it seems to me that the the agents can deal with different levels of complexity than humans. They have a a much better short-term memory. I mean, a huge short-term memory and a perfectly accurate short-term memory. So one of the things that I do is I widen the um the allowed size of a function and I do that by adjusting the crap score.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="78" data-time="32:52" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=1972s" target="_blank" rel="noopener noreferrer">32:52</a><span>Uncle Bob／Matt</span><small>#078</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">對人類來說，我會要求 CRAP 分數低於 4；對 Agent，我目前設成 6，甚至考慮提高到 8。我正在找那條臨界線，但它很難測出來。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">從 4 到 8，甚至 4 到 12，具體上代表什麼差別？是二十行函式對一百行函式嗎？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">核心其實是循環複雜度，也就是函式內可能通過的路徑數。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">So for a human I would keep crap numbers below four, right? But for the agents I&#x27;ve set this at six and I&#x27;m thinking and maybe I&#x27;ll push it to eight. Um I&#x27;m trying to find where the threshold is and it&#x27;s not an easy threshold to find. But &gt;&gt; what what does that look like in terms of four to eight? Like what&#x27;s the or 4 to 12? What&#x27;s the difference there? like is it like a 20 line 100line function? &gt;&gt; Um so it really boils down to the cyclatic complexity which is the number of pathways through the function.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="79" data-time="33:20" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2000s" target="_blank" rel="noopener noreferrer">33:20</a><span>Uncle Bob</span><small>#079</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">假如測試覆蓋率是百分之百，那麼 CRAP 分數 6，大致表示函式裡有六條執行路徑，而且全部都被測試覆蓋。這正是 CRAP 的目標：先讓所有內容都有測試，再限制循環複雜度。我和 Agent 辯論過很多次。順帶提醒，任何你和 Agent 進行的辯論都不能完全相信，不過我還是照辯不誤。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And uh if you&#x27;ve got 100% coverage then a crap score of six means that there are six pathways through the through the function. They&#x27;re all covered with tests. So that&#x27;s really the goal of crap, right? Get it all covered with tests and then limit the cyclomatic complexity. Um, and you know, I&#x27;ve had a number of debates with the agents, and by the way, you can&#x27;t trust any debate you have with an agent, but I still have them anyway.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="80" data-time="33:44" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2024s" target="_blank" rel="noopener noreferrer">33:44</a><span>Uncle Bob</span><small>#080</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">它們似乎認為：「對，6 大概很合理。」你當然不能真的信它們，但好吧。我確實認為 Agent 與人類的門檻不同。還有另一個因素：我的書中談過許多紀律，其中之一是測試驅動開發。我是 TDD 的堅定支持者。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Uh, and they they seem to think that, oh yeah, you know, six is probably pretty good. Well, you know, I don&#x27;t you don&#x27;t really trust them, but okay. Um, but I, you know, I think there&#x27;s a threshold difference there. There&#x27;s another another factor. In my books, I talk about disciplines. One of them was was test-driven development. I&#x27;m a big advocate of test-driven development.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="81" data-time="34:07" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2047s" target="_blank" rel="noopener noreferrer">34:07</a><span>Uncle Bob</span><small>#081</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">但 TDD 是一種人類紀律，是因應人類大腦的運作方式而形成。我不能，也不會強迫 Agent 照搬。我不認為要求 Agent 先寫一行測試、再寫一行正式程式碼、接著再補下一行測試，有任何意義。對人類來說，這樣做有道理。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">But that&#x27;s a human discipline that&#x27;s done because humans are wired a certain way. I cannot and will not enforce that on the agents. I don&#x27;t think it makes any sense to make an agent write a single line of a test and then write a single line of the production code and then the next line of the test. I don&#x27;t think that makes any sense. For a human, it does.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="82" data-time="34:31" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2071s" target="_blank" rel="noopener noreferrer">34:31</a><span>Uncle Bob</span><small>#082</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">至少對我而言，它為工作帶來很大好處；但對 Agent，我不這麼認為。因此，我允許 Agent 採取比較接近 John Ousterhout 的方式：先寫一個函式，再替該函式補測試；接著寫下一個函式，再替下一個函式寫測試。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">At least for me. I mean there&#x27;s a a huge benefit for my work but for the agents I don&#x27;t think so. So I allow the agents to behave more like John Asterhow would which is to write a function and then write the test for that function and then write the next function and write the test for that function.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="83" data-time="34:49" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2089s" target="_blank" rel="noopener noreferrer">34:49</a><span>Uncle Bob</span><small>#083</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">即使我明確要求它們以高度嚴謹的方式進行 TDD，它們最後仍總會退回這種做法，幾乎每次都一樣。所以我想，也許這是可以接受的。結論是：把「人類的紀律」強加在 Agent 身上，可能是錯的；把「人類重視的價值」施加在 Agent 身上則沒有錯，只是某些門檻需要調整。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I allow them to do that even when I have told them to do test-driven development at high discipline. They always fall back on doing that. They always end up doing that. So I figure that&#x27;s probably okay. So the bottom line there is it&#x27;s probably a mistake to impose a human discipline on an agent. It is not a mistake to impose human values on the agent, but there may be thresholds that we need to change.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="84" data-time="35:18" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2118s" target="_blank" rel="noopener noreferrer">35:18</a><span>Uncle Bob／Matt</span><small>#084</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">至於那些紀律本身，也就是具體行為流程，我不認為強迫 Agent 照做是明智的。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">這個說法非常漂亮，我很喜歡。所以關鍵是短期記憶。TDD 對短期記憶很有限的人類特別有幫助：你只需要記住足以寫出測試的內容，再保留剛好足夠的資訊讓測試通過，然後甚至可以離開去喝杯咖啡。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">But the disciplines themselves, the behaviors, I don&#x27;t think it&#x27;s wise to impose those. &gt;&gt; That&#x27;s a lovely way of phrasing it. I really like that. So it&#x27;s it&#x27;s a short-term memory thing, right? Because TDD is great when you have very low short-term memory, like humans, right? You have enough short-term memory to write the test and then enough short-term memory, just enough to make the test pass, right? You can go out and get a coffee or something.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="85" data-time="35:42" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2142s" target="_blank" rel="noopener noreferrer">35:42</a><span>Matt／Uncle Bob</span><small>#085</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">很好，謝謝。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">不客氣。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我們已經談了很多如何建造系統、實作功能，以及模組架構等。那麼，在把工作交給 Specifier、正式進入那條品質試煉迴圈之前，你會做什麼？會規劃到多深？畢竟把錯誤的工作送進這麼昂貴的關卡，浪費會非常大。你怎麼看？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">人的誘惑總是想先規格化：規格、規格、再規格，最後才交給 Agent。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&gt;&gt; So, okay, that was great. Thank you. You&#x27;re welcome. &gt;&gt; In the Okay, we&#x27;ve talked a lot about building the thing, right? Right. and building the implementation, right, and doing module architecture and that sort of thing. What do you do before you kick things off to your specifier? How much planning are you doing before you actually go into this gauntlet loop? Because like putting the wrong work in a gauntlet is super wasteful, right? How do you think about that? Well, so the temptation is to specify, you know, get the human to specify,</p>
</details>
</div>
</details>


### 敏捷、規格與迭代

<details class="article-transcript" data-index="86" data-time="36:23" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2183s" target="_blank" rel="noopener noreferrer">36:23</a><span>Uncle Bob</span><small>#086</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">這是非常古老的誘惑。1970 年代我們就掉進去過，最後導向瀑布式流程等做法。敏捷革命正是對它的回應，或至少是一種反擊。至於我們現在把敏捷做得有多好，我也不確定；但敏捷至少是在提醒我們：「等一下。」</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">specify, specify, specify and then give it to the agent. This is a very old temptation. It was a temptation we underwent in the 70s. It led us to the waterfall uh process and all of that. And and the agile revolution was the answer to that or the answer back to that. I don&#x27;t know how how well we&#x27;re doing with the agile revolution either, but but it was the it was a way to say, &quot;Wait a minute.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="87" data-time="36:52" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2212s" target="_blank" rel="noopener noreferrer">36:52</a><span>Uncle Bob</span><small>#087</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">「大量前期規劃會把事情弄得一團亂，因為最後做出來的東西從來不像原始計畫。」面對 Agent 時，人們又會受到同樣誘惑：「好，我們先不停規劃，然後再交給 Agent。」我試過，而且就在這個星期仍在試，結果總是災難。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">All this heavy upfront planning makes a mess of everything cuz what comes out at the end doesn&#x27;t look anything like the plan and never has.&quot; Well, the temptation with agents is to do the same thing, right? Okay, we&#x27;re going to plan plan. Then we&#x27;ll give it to the agent. And I have tried this. In fact, I&#x27;ve been in the middle of trying this just this week and it&#x27;s it&#x27;s always a disaster.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="88" data-time="37:17" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2237s" target="_blank" rel="noopener noreferrer">37:17</a><span>Uncle Bob</span><small>#088</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">每次結果都相同。你做出龐大計畫，等 Agent 真正開始執行後，人類才發現它們根本不可能照計畫走，因為你沒有想到所有事情，而 Agent 又沒有你那麼有判斷力。於是它們半懂不懂地衝向荒謬方向，你只能叫停、倒退、重寫計畫，再重新啟動。現在我已經放棄那條路。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">It and it&#x27;s always the same outcome, right? The you make all these plans and then as the agents are running, you the human realize that they can&#x27;t follow that plan because you didn&#x27;t think of everything and they&#x27;re not as wise as you are. So they&#x27;re running halfcocked off on some nonsense that you have to stop, back up, rewrite the plan, and then start them over again. And so I&#x27;ve given up on that.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="89" data-time="37:43" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2263s" target="_blank" rel="noopener noreferrer">37:43</a><span>Uncle Bob</span><small>#089</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我想：「好，等一下，改試敏捷方法。」我不知道它最後會不會很成功，也可能效果普通，但值得嘗試。先讓 Agent 做一、兩個 Story，完成後再檢視架構；必要時我親自介入。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I said, &quot;Okay, wait a minute. Let&#x27;s try the agile approach now.&quot; And I don&#x27;t know how this is going to work out. It might not work out all that well, but but let&#x27;s try the agile approach. Let&#x27;s just let them do a story or two, and then we&#x27;ll look at the architecture at the end, and we maybe I&#x27;ll have to manually get involved.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="90" data-time="38:02" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2282s" target="_blank" rel="noopener noreferrer">38:02</a><span>Uncle Bob／Matt</span><small>#090</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我會整理一些問題，接著再做幾個 Story，然後重複。這也許比較好。我們可能永遠無法完全避開每一輪結束後的人工作業與重新組織。雖然我仍試著找出自動化方法，但不確定是否真的可能。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我把它想成這樣：過去有一大塊勞動成本，是用來真正把東西建出來。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">and you know sort a few things out and then a few more stories and so on. That might be a better approach. We we may never uh escape that manual organizing step at the end. Although I&#x27;m trying to figure out a way to do it, but I don&#x27;t know I don&#x27;t know if that&#x27;s possible. &gt;&gt; I think of it like you&#x27;ve got this huge chunk of labor that needs to happen.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="91" data-time="38:24" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2304s" target="_blank" rel="noopener noreferrer">38:24</a><span>Matt</span><small>#091</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">以前實作可能耗費幾天、幾週，甚至幾個月；如今這一塊大幅縮小了。但前期規劃與後續審查的成本仍然差不多。開發者被期待進行更快速的迭代，可是真正困難的部分並沒有一起縮短，耗費的時間大致仍舊相同。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Right? In the old days, this was building the thing, right? and building the thing would take days, weeks, months maybe. Um, now that has shrunk, right? But the planning up front and then the review is still the same, right? We&#x27;re expected to do these faster iteration cycles as devs, but the stuff that was actually quite hard is still kind of the same and takes the same amount of time.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="92" data-time="38:47" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2327s" target="_blank" rel="noopener noreferrer">38:47</a><span>Matt</span><small>#092</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">你仍然可能把東西做錯，更精確地說，你仍可能做出「錯的東西」。我完全同意，現在很多人沉迷於「極大化規劃」：拿到規格後不停思考，再把規格丟給七個不同 Agent 輪番處理，最後得到一份更漂亮的計畫，才開始實作。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Building the thing wrong or sorry, building the wrong thing is something that you can still do. And I totally agree that there&#x27;s like this sort of a lot of folks are doing this kind of plan maxing thing where they&#x27;re just, you know, they take their spec and they they think about their spec, they run their spec through seven different agents or something and then they um, you know, they get back a better plan that they then go and implement or something.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="93" data-time="39:11" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2351s" target="_blank" rel="noopener noreferrer">39:11</a><span>Matt／Uncle Bob</span><small>#093</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">這聽起來不太好，對吧？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">Agent 超級愛寫計畫，天啊，它們愛死了。它們會不斷替計畫增添枝葉，把計畫寫得華麗、漂亮、細節滿滿。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">然後在最後全部崩解。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">沒錯。我認為現在產業裡已經看得到這種現象。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">How like that sound not sound good? &gt;&gt; The agents love to write plans. Oh my goodness, they love it. And they will embellish the plans and the plans will be gorgeous and beautiful and spell out all kinds of details. &gt;&gt; Yeah. And then they fall apart at the end. &gt;&gt; Um so yeah, I I think you can see it in the industry right now.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="94" data-time="39:33" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2373s" target="_blank" rel="noopener noreferrer">39:33</a><span>Uncle Bob</span><small>#094</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">目前有一股 Spec-Driven Development（規格驅動開發）的潮流。我的直覺是，它大概不會成功；至少我的實驗結果並不好。我現在反而認為，或許該重新回頭看看敏捷的核心：先做一點、取得回饋；再多做一點、再取得回饋；重新整理；接著再做一點、回饋、再整理。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">There&#x27;s this movement towards spectriven development. Uh and my my uh impression there is that that&#x27;s probably not going to work. My experiments did not work particularly well. Um, and I&#x27;m thinking now maybe we should once again look at the agile ideas and maybe the idea of do a little bit, get some feedback, do a little bit more, get some feedback, reorganize, do a little bit more, feedback, reorganize.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="95" data-time="40:00" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2400s" target="_blank" rel="noopener noreferrer">40:00</a><span>Uncle Bob</span><small>#095</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">以前講敏捷課程時，我常說一個故事。假設修改一棟房子的任何內容都只要一美元，包括第一次打地基、蓋屋頂，每一次請承包商變更都只收一美元。你會怎麼蓋這棟房子？你會先花幾千美元聘請建築師，做出一份完美計畫，然後付承包商一美元，要求他一次蓋完嗎？還是你會直接走向承包商說：</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I used to tell this story back when I was doing agile lectures. If if it cost you $1 to make a change to a house, including the initial laying of the foundation, the initial roof, everything, every change you gave to the contractor would cost you a dollar. How would you build that house? Would you hire an architect and pay thousands of dollars to the architect to come up with the perfect plan that they then paid a dollar to the contractor so that he could build in one shot? Or would you walk up to the contractor and say,</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="96" data-time="40:39" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2439s" target="_blank" rel="noopener noreferrer">40:39</a><span>Uncle Bob</span><small>#096</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">「我要把地基蓋在這裡，形狀做成這樣。」看一看又說：「不，這不好，改一下地基。先做一小段。廚房放這裡，客廳放那裡。」兩美元而已。接著又發現不對，再把兩個空間交換。讓孩子們實際走一遍，發現動線很糟，那就移動樓梯，或再做其他調整。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&quot;I want the foundation here. Make it that shape.&quot; Oh, no. That&#x27;s bad. Okay, let&#x27;s change that foundation. Let&#x27;s do a little Put the kitchen over here. Put the living room there. THERE&#x27;S $2. OH, HECK NO. Let&#x27;s change those around. That&#x27;s let&#x27;s let the kids walk through the oh the traffic pattern is crappy. Move the stairs or whatever.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="97" data-time="40:59" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2459s" target="_blank" rel="noopener noreferrer">40:59</a><span>Uncle Bob／Matt</span><small>#097</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">顯然，後者大概更合理，而這正是我們現在面對的情況。一次變更只要一美元，也許兩美元、五美元；但變更成本已暴跌到幾乎趨近於零，可能已接近我們有生之年能看到的最低點。好吧，這個預測也許將來會被打臉；但既然修改已經便宜到這種程度，為什麼還要做昂貴的完整前期規劃？何不反覆調整、再調整，直到它看起來正確？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">百分之百同意，不能更同意了。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Um obviously the latter is probably better and that&#x27;s what we are looking at right now. It costs a dollar. Well maybe two, maybe five. But the the cost of change has plummeted to as close to zero as I think we&#x27;re ever going to get it. and well that&#x27;s that&#x27;s a prediction I&#x27;ll probably lose but still right the cost of change has has gone so far down that why would you do this upfront planning because that&#x27;s expensive why wouldn&#x27;t you just fiddle fiddle fiddle fiddle until it looks right &gt;&gt; yes I I 100% agree I couldn&#x27;t agree more</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="98" data-time="41:41" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2501s" target="_blank" rel="noopener noreferrer">41:41</a><span>Matt</span><small>#098</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我真正有很大意見的是「規格驅動開發」這個標籤。它到底是什麼？至少可以有十種不同解釋。每次你把資訊傳給 Agent，算不算規格驅動？提示工程算不算？某種意義上，當然也算。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">the the thing I the thing I have I think I have a massive issue with the specdriven development label Because what is spectriven development, right? Like you can have like 10 different interpretations of it and every time you pass information to an agent, right? Is prompt engineering specri development, right? Like it kind of is.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="99" data-time="42:01" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2521s" target="_blank" rel="noopener noreferrer">42:01</a><span>Matt</span><small>#099</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">以前你可能對坐在辦公室另一頭的同事說：「幫我修一下頁首的載入問題。」這算規格驅動開發嗎？那句話是不是你交給他的規格？現在我只要說「先做一點前期對齊」，大家就把它稱作規格驅動。但我認為真正差別在於：你是否把規格永久保存？之後是否不斷回頭以它為準？</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">You know, you don&#x27;t you know, you would say to your, you know, if in the old days you would have like your mate over the other side, your colleague, and you would say, you just fix that loading issue in the in the header or something. Is that spec driven development? Right? Like is that a specification that I&#x27;ve given him? you know and it seems like every time I say okay do a little bit of upfront alignment first that approach then gets called spectriven development but for me I think the difference is are you persisting your specifications right</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="100" data-time="42:27" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2547s" target="_blank" rel="noopener noreferrer">42:27</a><span>Matt／Uncle Bob</span><small>#100</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">你的態度是什麼？你會在 Repo 裡保留所有規格清單嗎？實際做法如何？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">不，我不會。這些規格是暫時性的，用過就消失。它們會頻繁改變，我不斷調整，之後就讓它們退場。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">are you returning to those specifications so what&#x27;s your attitude there like do you do you keep like a list of all of your specs in the repo &gt;&gt; or do you like what&#x27;s going on there &gt;&gt; no I do not um the the specifications are ephemeris they go away. Uh they change a lot. I fiddleled with them and you know that that goes away.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="101" data-time="42:49" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2569s" target="_blank" rel="noopener noreferrer">42:49</a><span>Uncle Bob</span><small>#101</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">如今已經沒有一個能取代原始碼的位置。以前原始碼是由人類親手寫成，所以它等於最終規格。現在這種對應關係不存在了。原始碼當然還在，但已經不是人類撰寫。很多人會對這種缺口感到不安，於是認為必須有某個由人類產出的東西，在一開始就把一切完整定義。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">There is no equivalent to source code. You know we humans wrote the source code. So that was that was the final specification. Well that doesn&#x27;t exist anymore. There is still source code but we humans aren&#x27;t the ones writing it. And a lot of people feel that lack. There has to be a human thing that defines everything up front.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="102" data-time="43:13" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2593s" target="_blank" rel="noopener noreferrer">43:13</a><span>Uncle Bob</span><small>#102</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">不過說到底，Agent 產出的成果仍然源自人類的意圖。我最近的做法是，不再先建立一份規格來定義「我想要什麼」，甚至也不另外寫文件定義「我目前有什麼」。我直接看最後成果，然後說：「這個成果本身就是規格。」我目前公開放了不少工具。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Well, I mean, in the end, even what the agents produce was produced by humans. The the thing that I&#x27;ve be been doing lately is this. Instead of creating a specification that defines what I want or defines what I have even, I look at the end result and say, well, that is the specification. So, I&#x27;ve got a bunch of tools out there.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="103" data-time="43:39" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2619s" target="_blank" rel="noopener noreferrer">43:39</a><span>Uncle Bob</span><small>#103</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">例如 CRAP 工具可以跑 Clojure、Java 和 Go，其中幾個是我讓 Agent 替我寫的。我也有突變測試器、Agent Harness，以及其他一堆東西。我會告訴大家：不要直接下載那些工具，因為它們是為我自己的需求打造的。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I&#x27;ve got like the crap tool runs for closure. It runs for Java. It runs for Go. I wrote a few of them, right? I had my agents write them. I&#x27;ve got the mutation tester. I&#x27;ve got my my agent harness. You know, I&#x27;ve got all these things up there. What I tell people is don&#x27;t download those. I wrote them for me.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="104" data-time="43:58" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2638s" target="_blank" rel="noopener noreferrer">43:58</a><span>Uncle Bob／Matt</span><small>#104</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">你應該把 Agent 指向那些工具，讓它閱讀與研究，再替你打造一套屬於你的版本。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">對，我認為這是更好的做法：先用既有成果表達某個東西的本質，再依照自己的特殊需求客製化。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">沒錯。Agent 有一件很奇特的事：你把東西傳給它，它真的會讀。這和人類差很多。你傳給某人一份龐大規格，也許有百分之二十的機會被讀完，而百分之二十可能都太樂觀，搞不好只有百分之五。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">What you should do is point your agents at them, have the agents look at them, and then build one for you. &gt;&gt; Yeah. I think that&#x27;s a far better way of specifying the essence of something and then customizing it to your to your particular need. &gt;&gt; Yep. It&#x27;s what I always find weird about agents is that if you send them something, they read it, right? Which is very different to humans, right? Very, you know, you can maybe get a 20% hit rate if you send someone a massive specification and 20% is maybe a bit generous. 5% maybe if you pass a you</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="105" data-time="44:33" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2673s" target="_blank" rel="noopener noreferrer">44:33</a><span>Matt／Uncle Bob</span><small>#105</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">但把規格傳給 Agent，它大概真的會讀。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">反過來看，Agent 寫出來的東西，人類卻不會讀。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">完全正確。我以前沒從這個角度想過。它們期待我們把它們寫的一切都讀完，可是我們根本不讀，天啊。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">know a spec to an agent they&#x27;re probably going to read it right &gt;&gt; the opposite side of that is the things that the agents write the humans don&#x27;t read. &gt;&gt; Yes. Exactly. Yeah. Exactly. So they&#x27;re expecting I had thought of it like that. They&#x27;re expecting us to read everything they write and we just don&#x27;t. God.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="106" data-time="44:53" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2693s" target="_blank" rel="noopener noreferrer">44:53</a><span>Matt</span><small>#106</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">這段關係還真是單方面。長期來看，我很想知道人際互動會如何改變，因為我們愈來愈習慣和 Agent 溝通。我現在常直接口述指令給 Agent，感覺就像和朋友說話。我很好奇，隨著時間推進，生活會怎樣反過來模仿這些科技互動。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">It&#x27;s so one-sided. You know, long term, I&#x27;m interested in how human relationships differ or get different because we&#x27;re so used to communicating with agents, right? I dictate to my agents. So, it&#x27;s like I&#x27;m just sort of talking to a friend or something. I&#x27;m really interested in sort of how life imitates art over time and stuff.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="107" data-time="45:10" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2710s" target="_blank" rel="noopener noreferrer">45:10</a><span>Matt／Uncle Bob</span><small>#107</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我不知道，但真的很迷人。好，我想問一個可能接近最後的問題，而且分量不小。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">可以，算是「接近最後」。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我要再次引用 John Ousterhout，因為他對不同類型的程式設計有一組很好的區分：Tactical Programming（戰術式程式設計）。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I don&#x27;t know. That&#x27;s fascinating to me. So, okay. And I think I&#x27;m going to ask you maybe the final question, and it&#x27;s a sort of fairly beefy one. &gt;&gt; Um, if that&#x27;s all right, finalish. Um, I&#x27;m gonna go John Alart again &gt;&gt; because John has a great definition for &gt;&gt; different types of programming, right? You&#x27;ve got the tactical programming.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="108" data-time="45:32" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2732s" target="_blank" rel="noopener noreferrer">45:32</a><span>Matt／Uncle Bob</span><small>#108</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">你要去拿書了嗎？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">你都提到了，我一定得把書拿下來。等等，它應該就在這附近。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我的呢？我也拿到了。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">很好。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">你看，我拿到了。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">對，就是那本。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">完成。好，戰術式與策略式程式設計。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Are you going to get it? &gt;&gt; I I just have to You&#x27;ve mentioned I&#x27;ve got to pull this book down. &gt;&gt; Wait. &gt;&gt; Uh, it&#x27;s it&#x27;s here somewhere. &gt;&gt; Where&#x27;s mine? I&#x27;ve got mine. &gt;&gt; Oh, good. Okay. All right. &gt;&gt; There you go. I&#x27;ve got mine. &gt;&gt; There it is. Yep. &gt;&gt; I got it. &gt;&gt; Okay. &gt;&gt; Done. um tactical versus strategic programming. Yeah.</p>
</details>
</div>
</details>


### 學習、策略與基本功

<details class="article-transcript" data-index="109" data-time="45:52" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2752s" target="_blank" rel="noopener noreferrer">45:52</a><span>Matt</span><small>#109</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">戰術層就像戰場前線的士官，實際投入戰鬥；策略層則像將軍，負責決定整場戰爭的走向。我想我們都同意，這是區分程式設計工作類型的好框架。而 Agent 非常擅長戰術，卻非常不擅長策略。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&gt;&gt; So tactical is the sergeant on the ground, the person kind of fighting the battle. The strategic stuff is the general kind of the person directing the course of the war. &gt;&gt; Now I think we both agree that&#x27;s a good framing, right, for different types of programming. And agents are really good at tactical, really bad at strategic.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="110" data-time="46:11" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2771s" target="_blank" rel="noopener noreferrer">46:11</a><span>Uncle Bob／Matt</span><small>#110</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">對。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">那麼，對剛入門的人來說，假如 AI 已經吃掉所有戰術工作，他們該怎麼學會策略式程式設計？我想現場很多人真正想向你索取的就是這個。他們希望你把腦袋直接交出來，讓大家灌進自己腦中，理解突變測試為什麼重要，也知道該怎麼解釋與設計模組。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&gt;&gt; Yeah. Now, for people who are just starting out and AI has now eaten all of the tactical stuff, how do they learn to do strategic programming? Because I think a lot of people here, that&#x27;s kind of what they want from you, Bob. They want, please just give me your brain so that I can inject into it, understand why mutation testing is so good, tell me how to explain these modules.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="111" data-time="46:36" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2796s" target="_blank" rel="noopener noreferrer">46:36</a><span>Matt／Uncle Bob</span><small>#111</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我想，這就是大家要的。所以你現在的任務，是把自己的腦袋分享給所有人。他們到底該怎麼學？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我很常被問這個問題。我沒有完美答案，因為老實說，我也不知道。不過我可以說說自己會如何思考。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Like, that&#x27;s what they want, I think. So that&#x27;s your job now is to give people your brain. How how how did they learn that stuff? &gt;&gt; Okay. So, um I get this question a lot. I don&#x27;t have perfect answers to it because I really don&#x27;t know. But but here&#x27;s how I would think about this. Here&#x27;s here&#x27;s how I do think about this.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="112" data-time="46:58" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2818s" target="_blank" rel="noopener noreferrer">46:58</a><span>Uncle Bob</span><small>#112</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">首先，不論在大學或其他地方，程式設計師的學習方式都應該包含真正寫程式。你應該持續寫一段時間，也許一年，我不確定究竟多久，但一定要親自寫，才能知道 Agent 面對的是什麼。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">First of all, the um the way a programmer should learn whether it&#x27;s in university or somewhere else, right? It should be to write code. You should you should be writing code right for a year. I don&#x27;t know how long but you should be writing code so that you know what the agents are dealing with.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="113" data-time="47:16" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2836s" target="_blank" rel="noopener noreferrer">47:16</a><span>Uncle Bob</span><small>#113</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">接著，當你進入一家大量使用 Agent 的公司時，剛完成訓練的年輕人應該被當成一個 Agent 看待。負責運行那些 Agent 的人，也許是 Lead Engineer，或任何正在進行策略決策、手上管理一群 Agent 的人，應該用同樣方式看待你。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">The next thing that I think should happen is that when you get hired into a company where that company is making heavy use of agents, you the young young person just coming out of training should be treated like an agent. the uh the the guy who&#x27;s running the you know maybe the lead engineer or whoever the guy who&#x27;s got bunch of agents running and he&#x27;s being strategic.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="114" data-time="47:41" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2861s" target="_blank" rel="noopener noreferrer">47:41</a><span>Uncle Bob</span><small>#114</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">他應該把和 Agent 相同類型的任務交給你，也讓你接受 Agent 必須通過的同一套確定性工具檢驗。你需要在這種狀態下待上幾個月，生產力糟得要命，卻能學到非常多東西。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">He should look at you as an agent and he should give you the same kind of tasks that the agents have and subject you to the same kind of deterministic tools that the agent have agents have to use. And you should spend several months in that state being horribly unproductive but learning a hell of a lot.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="115" data-time="48:02" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2882s" target="_blank" rel="noopener noreferrer">48:02</a><span>Uncle Bob</span><small>#115</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">等你通過那條試煉之路，也許才值得被信任，可以開始管理一個自己的 Agent。我不確定，但未來的訓練大概會長得像這樣。你不能徹底失去與程式碼的接觸。十年前我常告訴人們：假如從未寫過組合語言，就該花一個週末親手寫一次，至少知道幕後真正發生什麼事。因為如果你整天只寫 Java，其實活在一個幻想世界裡。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">And by the time you&#x27;ve gone through that gauntlet, maybe you can be trusted to run an agent of your own. I don&#x27;t know. It&#x27;s going to be something like that. You cannot lose the code entirely. I used to tell people um 10 years ago used to tell people um if you&#x27;ve never written assembly language, you should spend the weekend writing assembly language just so that you know what&#x27;s really going on behind the scenes because if if all you&#x27;re doing is writing Java all day long, you live in a fantasy world.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="116" data-time="48:37" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2917s" target="_blank" rel="noopener noreferrer">48:37</a><span>Uncle Bob</span><small>#116</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">底下仍有你不了解的魔法。花一個週末寫組合語言，才會真正明白電腦在做什麼。我認為，AI 時代的教育路徑仍然保留這個道理。你得從二進位基礎開始，一路經過組合語言、像 C 這種較底層的程式碼，再到 Python 等高階語言；接著才是 Agent 工作方式與確定性工具，最後在監督下學會以策略角度管理 Agent。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">There is still magic yet that you don&#x27;t understand. Spend a weekend doing assembly language and you will finally understand what&#x27;s really going on. And I I think that remains true somehow during this educational pathway. You&#x27;ve got to go from the basics binary all the way through assembly language some basic code like C some higher level code like Python or something and then deal with uh agent kind of work and deterministic tools and finally be able to strategically run an agent under supervision.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="117" data-time="49:14" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2954s" target="_blank" rel="noopener noreferrer">49:14</a><span>Matt</span><small>#117</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我也不知道還能怎麼說得更好了。不過這真的很難，因為同時發生兩件事。Agent 是覆蓋在程式碼之上的抽象層；而你剛才提到的模組檢視器，也是一種蓋在程式碼上方的抽象層，我覺得非常有意思。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&gt;&gt; Yeah, &gt;&gt; I don&#x27;t know how better to say that. &gt;&gt; It&#x27;s so hard though, right? because there&#x27;s two there&#x27;s two things going on there, right? Like there&#x27;s the agent is a kind of abstraction layer, right, over the code. And so you got the code and then it&#x27;s interesting you were talking about an abstraction layer like a sort of um module viewer, right? Like I think that&#x27;s super interesting.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="118" data-time="49:36" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=2976s" target="_blank" rel="noopener noreferrer">49:36</a><span>Matt</span><small>#118</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">這類抽象工具確實很適合學習，因為當你往下鑽時，反而能更深入理解程式碼。但假如某個新人只是在照書做戰術工作，公司一定會想：「我們為什麼要雇這個人？Uncle Bob 那群五個 Hardener Agent，用一小部分成本就能把他打得落花流水。」這是很現實的疑問。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">That&#x27;s a really good way to learn getting these kind of abstractions over the code so when you dive in you understand it more deeply. But if you have someone who&#x27;s just like sitting on your books just doing tactical work, surely as a company you&#x27;re going to look at that and go, why are we hiring this person when we&#x27;ve got, you know, we&#x27;ve got Uncle Bob&#x27;s swarm of five hardeners and stuff that can beat it, you know, a fraction of the cost, right? I&#x27;m I I just I I&#x27;m so Okay.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="119" data-time="50:06" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3006s" target="_blank" rel="noopener noreferrer">50:06</a><span>Matt</span><small>#119</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">那麼，有哪些資源、書籍或學習方法？抱歉，我其實還有一個問題。我正在想，人們究竟如何獲得這種知識，因為策略式程式設計的回饋迴路非常長，傳統上尤其如此。一個人可能工作六個月就離職，永遠學不到策略能力，因為他的錯誤也許九個月後才會爆發，他根本沒機會看見自己的後果。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">What What like resources or books can or approaches or Sorry, there&#x27;s one more question here which is I&#x27;m I&#x27;m I&#x27;m trying to like work out how people get this information because the feedback loop on strategic programming is so long, right? Or traditionally it has been very long. So you you can often &gt;&gt; like people who just like quit jobs after six months or something, they might never learn strategic programming, right? Because their mistakes are maybe nine months away, you know, so they just never see the their own mistakes. But I</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="120" data-time="50:40" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3040s" target="_blank" rel="noopener noreferrer">50:40</a><span>Matt／Uncle Bob</span><small>#120</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">但有了 Agent，事情可能不同。整體速度提升後，你能更快從錯誤獲得回饋。所以我想知道，去年十二月時，你怎麼判斷 Agent 正在犯錯？當你看著那些成果，認定它是一坨爛東西時，你是怎麼辨識的？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">早期我只是直接閱讀程式碼，看見那些狗屎般的痕跡。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">think with agents, you can, right? Because it&#x27;s sped up so much, you can actually get more feedback on your mistakes sooner. And I suppose what I&#x27;m interested in is how did you know that your agents were making mistakes back in December when you were looking at them and going this is dog? How did you identify that? &gt;&gt; Um early on I was just looking at the code and seeing the dog do.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="121" data-time="51:04" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3064s" target="_blank" rel="noopener noreferrer">51:04</a><span>Uncle Bob／Matt</span><small>#121</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">不過那不是最重要的部分。真正重要的是下一步，我看見它們開始 Thrashing，也就是反覆掙扎、改了又壞、原地消耗。我看得出 Agent 正在受苦，而且認得那種掙扎，因為我自己也曾經歷過。問題就在這裡：新手進來時，很可能看不出那是掙扎。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">那這該怎麼學？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">我自己是用慘痛經驗學會的，完全是社會大學。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">That wasn&#x27;t the important part. The important part was the next step where I watched them thrash. I could see the agent struggle and I recognized the struggle since I have been through that struggle. Right? And that&#x27;s one of the issues is the novice would come in and not recognize the struggle. &gt;&gt; Now, how do you learn that? How do you learn? You know, I learned it the hard way. School of hard knocks.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="122" data-time="51:28" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3088s" target="_blank" rel="noopener noreferrer">51:28</a><span>Uncle Bob／Matt</span><small>#122</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">年輕人要怎麼學會辨識？其實這方面有大量知識，尤其是那些因為太老而沒人讀的老書，內容非常精彩。可以讀 Tom DeMarco 的作品，也可以讀 Ed Yourdon；還有其他很多作者，糟糕，我現在一時想不起名字。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">《The Pragmatic Programmer》之類的。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">對，還有很多這類舊書，都非常好。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">How do you learn that as a young person coming in? How do you recognize that? There is a wealth of information about this. Um the the old books, the ones that nobody reads because they&#x27;re old. Uh the old books on this topic are terrific, right? you go to the works by Tom DeMarco or or the works by Ed Yordan or you know go go read you know um gez I can&#x27;t think of the names right now but &gt;&gt; pragmatic programmer you know the pragmatic programmer um the the there&#x27;s a lot &gt;&gt; there&#x27;s a lot of these older books they&#x27;re very good</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="123" data-time="52:10" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3130s" target="_blank" rel="noopener noreferrer">52:10</a><span>Uncle Bob</span><small>#123</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">年輕時若仔細研讀，會逐漸建立對高階策略工作的感覺。當然，你得過濾某些已經過時的內容，因為不少書寫於 1970 或 1980 年代；但許多關鍵教訓，也正是在那個年代被痛苦學會的。所以一開始，我會先從這些書入手。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">&gt;&gt; um that if you if you study them when you&#x27;re young you will get may feel for what this higher level strategic play is. You&#x27;ll have to filter out some of the archaic stuff because a lot of these books were written in the 70s or the 80s, right? But that&#x27;s when these lessons were learned. And so I, you know, that&#x27;s that&#x27;s where I would go initially.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="124" data-time="52:35" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3155s" target="_blank" rel="noopener noreferrer">52:35</a><span>Uncle Bob／Matt</span><small>#124</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">先透過書理解，再親身感受。這也是我認為新人應該先「扮演 Agent」幾個月的原因，讓他真正知道那種工作是什麼。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">成為 Agent，讓 Agent 把工作委派給你。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">對，你變成 Agent 的 Sub-Agent。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我喜歡這個說法。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">I would go to those books and learn that stuff that way. And then, of course, you&#x27;re going to have to learn it by feeling it. &gt;&gt; Yeah. That&#x27;s why I think they ought to play play uh agents for a few months so they can learn what that&#x27;s really like. &gt;&gt; Become the agent. Have the agent delegate to you. Yeah.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="125" data-time="52:51" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3171s" target="_blank" rel="noopener noreferrer">52:51</a><span>Matt／Uncle Bob</span><small>#125</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">好，我真的還有最後一個問題，應該很短。聽起來，軟體基本功依然重要，對吧？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">對。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">為什麼？你會怎麼回答那些認為基本功已經不重要的人？</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">軟體基本功之所以重要，理由和它一直以來重要的理由完全相同。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">You become a sub agent of the agent. I like that. So, okay. I do have one more question. It&#x27;s I suppose a short one. Sure. &gt;&gt; Um which is &gt;&gt; sounds like then software fundamentals still matter, right? &gt;&gt; Yeah. &gt;&gt; And why is that? And what do you say to the people who say that they don&#x27;t matter? &gt;&gt; Why is that? Um software fundamentals matter for the reason they have always mattered.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="126" data-time="53:25" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3205s" target="_blank" rel="noopener noreferrer">53:25</a><span>Uncle Bob</span><small>#126</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">這句話是誰說的？我想可能是 Dijkstra。也許我記錯了，但大意是：軟體是人類嘗試過最複雜的事物，比我們做過的任何其他工作都複雜。既然軟體極度複雜，所謂基本功，就是把複雜度整理成可被理解形式的方法。不只人類需要如此，我們的模型同樣需要。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">The let&#x27;s see who said this. It was um uh Dystra I think who said it. I&#x27;m I&#x27;m going to get this wrong, but software is the most complicated thing that humans have ever attempted to do. More complicated than you know any other task that we&#x27;ve tried. Software is the most complicated thing. And therefore, the fundamentals are the are way of organizing that complexity into a form that can be conceived not just by humans, but by our models as well.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="127" data-time="53:59" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3239s" target="_blank" rel="noopener noreferrer">53:59</a><span>Uncle Bob</span><small>#127</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">畢竟這些模型本來就是依照人類而建立。因此，基本功仍然適用，因為那是讓複雜事物變得可思考、可掌握的方式。現在確實有人認為基本功不再重要。他們會學到教訓，而且會用很痛的方式學會；我想不會等太久。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Since our models are modeled after humans after all. So the fundamentals still apply because that&#x27;s the way we organize complexity to be conceived or be to be conceived of. There are folks right now who think that the fundamentals don&#x27;t matter. They will learn and they will learn that the hard way and and it won&#x27;t take very long.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="128" data-time="54:22" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3262s" target="_blank" rel="noopener noreferrer">54:22</a><span>Uncle Bob／Matt</span><small>#128</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">也許需要的時間比我預期久，因為 Agent 的確很強。但我已經親眼看過它們撞上那堵牆，所以我知道牆真的存在，也不想再撞一次。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">我們此刻正處在一組很有趣的歷史平行裡。你剛才提到抽象層，而我們如今已經站在編譯器之上的新層級。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Might take longer than I think it&#x27;ll take because the agents are pretty good. But I&#x27;ve watched them hit the hit the uh wall. So I know that wall is there and I don&#x27;t want to hit that again. &gt;&gt; It&#x27;s a very interesting interesting set of parallels that we&#x27;re in at the moment. We you had mentioned the the abstraction layer, right? And you know we&#x27;re we&#x27;re now at a at a level where we&#x27;re above the compiler.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="129" data-time="54:52" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3292s" target="_blank" rel="noopener noreferrer">54:52</a><span>Matt</span><small>#129</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">以前我們的抽象層是編譯器，再之前是組合語言，更早以前則是二進位；如今我們來到模型這一層。每當抽象層往上升一階，停留在較低層的人都會抱怨：「這會毀掉一切。」</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">We used to our our our abstraction layer used to be the compiler. Before that it was assembly language. Before that it was binary. And now it&#x27;s up here at this level of the model. At every one of those steps up up the abstraction layer. The people at the at the lower step complaint said, &quot;Oh, this is going to ruin everything.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="130" data-time="55:13" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3313s" target="_blank" rel="noopener noreferrer">55:13</a><span>Matt／Uncle Bob</span><small>#130</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">「我們甚至會失去所有工作。事情變得太容易，連五歲小孩都能寫程式。」而當年他們談的甚至可能還是二進位。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">沒錯。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">每一步都一樣。如今我們又站在下一層，下面的人說：「這會毀掉一切。」但不，它不會。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">We&#x27;re not even going to have jobs anymore. It&#x27;s become so easy that five-year-olds will be able to write the code.&quot; And you know, back then they were still talking about like binary. Yes. At every step it&#x27;s the same. And and so we&#x27;re at this next step and the people down here are saying, &quot;Oh, it&#x27;s going to ruin everything.&quot; No, it&#x27;s not.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="131" data-time="55:35" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3335s" target="_blank" rel="noopener noreferrer">55:35</a><span>Uncle Bob／Matt</span><small>#131</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">相同規則仍然適用。所有基本功都還存在，而且存在的理由完全沒變。今天被你丟掉的規則，一年後你會從地板上重新撿起來，拍掉灰塵，然後想起自己當初為什麼需要它。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">謝謝你，Bob。我記得柏拉圖好像有句話，說文字書寫會讓人變笨。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">The same rules apply. All the same fundamentals exist for all the same reasons. The rules you throw away are the ones you&#x27;re going to pick up off the floor in a year and dust off and remember why you need them. &gt;&gt; Yeah. Thank you so much, Bob. There&#x27;s a there&#x27;s a great quote from I think Plato where he says that writing is going to make people stupider.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="132" data-time="56:00" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3360s" target="_blank" rel="noopener noreferrer">56:00</a><span>Matt</span><small>#132</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">所以早從古希臘開始，人們就在進行同樣的抽象層爭論，實在荒謬。我看看現在有多少人看直播……有一千五百人，太驚人了。我想所有觀眾都會同意，這是一場非常精彩的對談。Bob，真的非常感謝你。</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Right? So people have had that same abstraction argument since you know the Greeks, right? Ridiculous. I think everyone uh watching, how many folks have we got on this stream? Uh we&#x27;ve got 1,500 people watching. Incredible. Uh I think we can all agree that was a fantastic conversation. Um Bob, thank you so much.</p>
</details>
</div>
</details>

<details class="article-transcript" data-index="133" data-time="56:20" open>
<summary><a href="https://www.youtube.com/watch?v=zcLPGC-tvgk&amp;t=3380s" target="_blank" rel="noopener noreferrer">56:20</a><span>Matt／Uncle Bob</span><small>#133</small></summary>
<div class="article-transcript__body">
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">再把你的書舉起來一次，讓大家看看。《Clean Code》。你那邊現在應該十一點了吧？該換回浴袍了。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--guest">Uncle Bob</span><span class="article-transcript__dialogue">對，沒錯。</span></p>
<p class="article-transcript__line"><span class="article-transcript__speaker article-transcript__speaker--host">Matt</span><span class="article-transcript__dialogue">太完美了。各位，謝謝收看，我現在要結束直播。我和 Bob 會繼續留在線上……（原始逐字稿在此處截斷。）</span></p>
<details class="article-transcript__original">
<summary>核對英文原文</summary>
<p lang="en">Um, hold up your book one more time so folks can uh can get it. Let&#x27;s see. Clean code. And I think what is 11:00 a.m. now your time? Back to the bathrobe. Uh, &gt;&gt; yeah. Yeah, it is. &gt;&gt; Perfect. So, folks, thank you so much. I&#x27;m going to end the stream here. Me and Bob are gonna stay on for a</p>
</details>
</div>
</details>


## 關鍵術語速查 {#glossary}

- **CRAP**：以測試覆蓋率與循環複雜度辨識高風險函式的品質指標。訪談重點是把它做成 Agent 必須修到合格的關卡。
- **Cyclomatic Complexity**：衡量程式中獨立執行路徑數量。分支愈多，理解與測試成本通常愈高。
- **Mutation Testing**：故意改壞程式，再確認測試能抓到。如果測試仍通過，該突變體便「存活」。
- **Gherkin**：以 Given／When／Then 表達驗收行為的規格格式，讓需求能被人與工具共同閱讀。
- **Lost in the Middle**：長上下文中，模型較容易忽略中段資訊；開頭與最近內容往往更顯著。
- **Context Trajectory**：同一個工作階段早期形成的方向，會持續影響後續決策。清空上下文才能真正換軌。
- **Deep Module**：用小而清楚的介面隱藏大量內部複雜度，降低呼叫者與 Agent 的理解負擔。
- **Tactical／Strategic**：戰術式程式設計處理眼前實作；策略式程式設計決定系統長期結構、界線與方向。

## 來源與翻譯說明 {#sources}

- 原始影片：[LIVE: Uncle Bob on Software Fundamentals in the Age of AI](https://www.youtube.com/watch?v=zcLPGC-tvgk)
- 對談者：Robert C. Martin（Uncle Bob）、Matt Pocock
- 本文依使用者提供的英文逐字稿與正體中文翻譯 HTML 整理。
- 主文中的流程建議與判斷是我的整理，不是逐字引述；完整翻譯區則依原始順序保留全部 133 段。
- 封面為 AI 生成概念圖，用來呈現「高速生成的程式碼通過工程品質關卡」，不是訪談現場或真實人物影像。

影片與英文內容的權利歸原作者與原發布頻道所有。本譯文供中文讀者學習、研究與討論。
