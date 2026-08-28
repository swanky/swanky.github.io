---
title: "AI Agent 讓「外科手術團隊」復活了：一個人帶一群 Agent，瓶頸仍是人腦"
seo_title: "AI Agent 與外科手術團隊：一人團隊的能力、限制與組織設計"
date: 2026-08-24
published: true
categories: [technical]
tags: [ai-agent, ai-coding, software-engineering, software-architecture, conways-law, mythical-man-month, organization-design, claude-code, codex]
layout: article
cover_image: /assets/img/linkedin/ai-agent-surgical-team.jpg
cover_alt: "水手服少女擔任軟體外科手術團隊的主導者，帶領五個 AI Agent，把混亂的網狀溝通整理成星狀協作與鬆耦合模組"
cta_context: agentic
related_posts:
  - ai-executor-orchestrator
  - mid-manager-becomes-builder
  - matt-pocock-skills-ai-coding-workflow
hero_image: true
description: "AI Coding Agent 讓一個有判斷力的人，開始具備過去一支小型團隊才有的交付能力。但執行變快之後，真正的限制仍是問題定義、概念完整性與人腦能維持的系統模型。"
keywords: AI Agent, Coding Agent, 外科手術團隊, 人月神話, 康威定律, Harlan Mills, Fred Brooks, Claude Code, Codex, 軟體架構, 組織設計, 史旺基
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>發 Token 不等於組織轉型</strong>：如果流程與決策方式不變，AI 很可能只是把原本不值得做的事做得更快。</li>
    <li><strong>一人團隊開始可行</strong>：能定義問題、切架構、做取捨的人，可以把實作、測試、重構與文件交給多個 Agent。</li>
    <li><strong>AI 放大執行，沒有放大人腦</strong>：人仍要在腦中維持系統的一致模型；專案一大，認知負荷就會先撞牆。</li>
    <li><strong>大型系統不會變成大型獨角戲</strong>：比較合理的方向，是多位主導者各帶自己的 Agent，透過清楚的介面契約協作。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">先看 AI 改變了哪一種團隊</span>
      <ol class="article-toc-items">
        <li><a href="#tokens">問題不是少買幾張 AI 授權</a></li>
        <li><a href="#conway">組織會長進系統裡</a></li>
        <li><a href="#surgical-team">一個五十年前沒有普及的構想</a></li>
        <li><a href="#agents">Agent 終於補上支援團隊</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">再談它會在哪裡撞牆</span>
      <ol class="article-toc-items">
        <li><a href="#brain">執行變快，人腦沒有擴充記憶體</a></li>
        <li><a href="#scale">大型系統仍然需要分工</a></li>
        <li><a href="#playbook">如果是我，我會這樣設計</a></li>
        <li><a href="#judgment">最後瓶頸還是判斷力</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 問題不是少買幾張 AI 授權 {#tokens}

今天看到[寶玉在 X 上的一則長文](https://x.com/dotey/status/2091662478425899254)，他把 AI Agent、康威定律與《人月神話》的「外科手術團隊」接在一起。被他引用的 Xiaowen 貼文裡，有一句話很準：

> 個人效率解決的是「更快完成眼前這件事」；組織效率解決的是「省掉哪些不值得做的事」。

很多組織導入 AI 的第一個反應，是替每個人買工具、發 Token，再期待所有人都快一點。這當然可能有幫助，但它比較像替原本的組織裝上渦輪。

問題是，如果車子開錯方向，渦輪只會讓它更早抵達錯的地方。

AI 真正有意思的地方，不只是把一小時的工作縮短，而是讓原本能定義問題、整合資源、承擔結果的人，直接做出過去需要一支小隊才能完成的東西。這不是單純的個人生產力提升，而是交付單位開始縮小。

我以前寫過 [Executor 與 Orchestrator 的差別]({% post_url 2026-03-22-ai-executor-orchestrator %})。那篇談的是人的角色；這一篇想往下再挖一層：**當 Orchestrator 真的能帶著一群 Agent 交付，組織與軟體架構會變成什麼形狀？**

## 組織會長進系統裡 {#conway}

Melvin Conway 在 1967 年提出一個後來被稱為[康威定律](https://www.melconway.com/Home/Committees_Paper.html)的觀察：設計系統的組織，最後會做出一套近似自身溝通結構的設計。

四個團隊各自負責一塊，系統通常也會留下四塊邊界。部門之間很難溝通，模組之間的整合通常也不會突然變得優雅。組織圖不會被放進 Git，但它會用另一種方式長進程式碼裡。

傳統軟體開發之所以有需求、產品、架構、開發、測試與維運等角色，不只是大家喜歡畫泳道圖。系統夠大之後，很少有人能同時掌握所有領域，也沒有足夠時間把每件事親手做完，只能靠分工換取規模。

分工的代價是溝通。

如果每兩個人之間都可能需要直接協調，n 個人最多會形成 n(n-1)/2 條配對溝通路徑。人數增加時，潛在路徑不是直線增加。這也是為什麼一個進度落後的專案，多塞幾個人進去，常常先得到更多會議，而不是更多完成品。

## 一個五十年前沒有普及的構想 {#surgical-team}

《人月神話》談過一個很有名、實務上卻沒有成為標準答案的做法：**外科手術團隊（Surgical Team）**。

這個構想原本由 Harlan Mills 提出，Fred Brooks 再於書中完整描述。核心不是找十個能力一樣的人，而是把設計與核心實作集中在一位 Chief Programmer，也就是「外科醫生」身上。副手、工具維護、測試、文件與行政等角色，都圍繞他提供支援。[[1]](https://dl.acm.org/doi/10.5555/1074100.1074209)[[2]](https://www.computer.org/volunteering/awards/mills/about-mills)

網狀溝通因此變成以主導者為中心的星狀結構。最重要的設計決策留在同一個腦中，系統比較容易維持 Brooks 所說的 **Conceptual Integrity（概念完整性）**。

這個想法很漂亮，但也很脆弱：

- 能掌握全局、又能做核心設計的人本來就少。
- 關鍵人物離開或判斷錯誤，整支團隊會一起失速。
- 系統持續變大後，一個人不可能知道所有細節。
- 支援角色仍然要付出溝通、等待與交接成本。

說穿了，當年的外科醫生不只要夠強，還得剛好配到一支隨叫隨到、完全理解他的支援團隊。這種組合在書裡很好看，在現實裡就比較像稀有掉落。

## Agent 終於補上支援團隊 {#agents}

AI Coding Agent 讓這個老構想重新值得討論。

今天，一個有技術判斷力的工程師、產品負責人或架構主導者，可以把問題定義、架構取捨與驗收標準留在自己手上，再讓 Claude Code、Codex 這類 Agent 接手大量支援工作：

| 外科手術團隊 | Agent 時代的做法 |
|---|---|
| 外科醫生／Chief Programmer | 人類負責問題定義、架構、取捨與最終責任 |
| 副手 | Agent 進行設計討論、反方審查與影響分析 |
| 工具維護 | Agent 產生腳本、樣板與自動化工具 |
| 測試 | Agent 補測試、找邊界案例、執行驗證 |
| 文件與程式管理 | Agent 整理文件、重構、維護決策紀錄 |

溝通成本也跟人類團隊不同。Agent 不用先排一場會議理解 Repository，可以直接讀程式碼、測試與版本紀錄；它不會因為被退回重做就開始捍衛面子，也不會嫌寫文件太無聊。

當然，它會看錯、做錯，也可能很有自信地把錯誤一路自動化。這也是為什麼我不把 Agent 當「不用管理的資深工程師」，而是把它當成執行力很強、但必須被規格與驗證約束的支援團隊。

重點不是一個人把所有職稱都兼掉。

重點是：**一個人守住決策核心，AI 把決策轉成可驗證的實作。**

## 執行變快，人腦沒有擴充記憶體 {#brain}

這個模式最容易被講成「一個人抵一支團隊」。我不太喜歡這種說法，因為它把產出速度跟系統駕馭能力混在一起。

AI 確實能讓程式碼、測試與文件更快出現，但沒有替人類擴充工作記憶。主導者仍然要知道：

- 系統現在有哪些重要邊界？
- 這次修改破壞了哪個假設？
- 哪些模組可以互相依賴？
- 測試證明了什麼，又漏了什麼？
- 這個結果符合需求，還是只符合提示詞？

Agent 同時跑得愈多，人的審查佇列也會愈長。最後常見的瓶頸不是 Agent 沒事做，而是人來不及讀懂、判斷與批准。

這也是 AI 一人團隊真正的上限：**執行頻寬變大，決策頻寬沒有同比例成長。**

如果主導者失去對整體的理解，只靠 Agent 回報「測試全綠」，外科手術團隊很快就會退化成一群動作很快、彼此不知道在改什麼的機器人。畫面很忙，病歷也都填了，但沒有人說得清楚病人為什麼躺在那裡。

## 大型系統仍然需要分工 {#scale}

所以我認為，這個模式會先在邊界清楚的中小型系統、個人產品、內部工具，以及大型系統中的獨立模組上發揮最大效果。

超大規模系統不會因為模型變強，就突然適合讓一個人全部掌握。比較合理的結構，是幾位「外科醫生」各自帶著自己的 Agent 支援團隊，分頭負責不同的業務能力或模組，再用清楚的介面契約保持鬆耦合。

這其實是康威定律的逆向操作：

1. 先決定系統真正需要哪些穩定邊界。
2. 再讓每位主導者對一個可理解、可驗證的邊界負責。
3. 模組之間靠 API、事件格式、資料所有權與失敗語意協作。
4. Agent 在邊界內放大執行，不替人偷偷改寫邊界。

未來的分工不一定消失，只是可能不再照前端、後端、QA、文件這種工序切開。每個小型交付單位會更接近「一位能做系統判斷的人，加上一組不知疲倦的 Agent」。

## 如果是我，我會這樣設計 {#playbook}

如果要試這種工作方式，我不會從「同時開十個 Agent」開始。那只是把十條不確定的路一起加速。

我會先做七件事：

1. **選一個邊界清楚的完整成果**：最好能在幾天內走完需求、實作與驗證，不先碰整個核心系統。
2. **人類先寫清楚不可外包的判斷**：問題、目標、架構限制、風險、完成定義與停止條件。
3. **讓 Agent 按責任分工**：實作、測試、清理與審查不要全部塞在同一段上下文，避免它一邊寫答案、一邊替自己打分數。
4. **把規則做成硬性關卡**：測試、靜態分析、依賴方向、介面契約與端到端驗收，不能只寫在提示詞裡勸 Agent 記得。
5. **保留短而可查的決策紀錄**：只記關鍵假設與取捨，不替專案養一座沒人敢刪的文件博物館。
6. **量測整段交付，不只算生成速度**：把重工、Review 缺陷、回滾與後續維護一起算進去。
7. **當人腦開始失去全局，就拆邊界**：不要再加 Agent。先把系統切成能由不同主導者獨立理解的模組。

這跟我前面整理的 [Matt Pocock Skills 工作流]({% post_url 2026-08-08-matt-pocock-skills-ai-coding-workflow %})其實是同一件事：模型愈會做，流程愈要知道什麼不能由模型自己決定。

## 最後瓶頸還是判斷力 {#judgment}

AI Agent 讓 Mills 與 Brooks 當年的外科手術團隊，第一次有機會以很低的協調成本落地。它讓一個有判斷力的人，開始接近過去一支小型團隊的完整交付能力。

但我不認為結論是「團隊不需要了」。

更準確地說，AI 正在壓縮支援執行的成本，也把主導者的判斷品質放大到以前沒有的程度。方向選對，一個人可以走得很快；方向選錯，一群 Agent 也會很有效率地替你把錯誤做完整、測試補齊、文件寫好。

這就有點微妙了。

以前我們怕的是人太多、溝通太慢。現在可能要怕的是執行太快，快到人的理解跟不上。

在 AI 能獨立承擔系統級決策與後果之前，最稀缺的仍然不是 Token，也不是程式碼，而是那個知道什麼值得做、怎麼切、哪裡不能錯，並且願意為結果負責的人。

---

## 參考資料

[1] [Chief Programmer Teams — Harlan D. Mills 1971](https://www.historicprojects.com/Harlan_Mills.html)

[2] [The Harlan D. Mills Collection — University of Tennessee](https://voljournals.utk.edu/utk_harlan/)

[3] [Melvin E. Conway, How Do Committees Invent?](https://www.melconway.com/Home/Committees_Paper.html)

[4] [寶玉：AI Agent 與外科手術團隊](https://x.com/dotey/status/2091662478425899254)

[5] Frederick P. Brooks Jr., *The Mythical Man-Month: Essays on Software Engineering*, Anniversary Edition, Addison-Wesley, 1995.
