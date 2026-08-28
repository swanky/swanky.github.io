---
title: "Matt Pocock 光頭哥的 Skills 使用教學：模型愈強，工程流程愈重要"
seo_title: "Matt Pocock Skills 教學：從 /grill-me 到 /implement 的 AI Coding 工作流"
date: 2026-08-08
published: true
categories: [technical]
tags: [ai-agent, ai-coding, agent-skills, matt-pocock, claude-code, codex, software-engineering]
layout: article
cover_image: /assets/img/linkedin/matt-pocock-skills-ai-coding-workflow.jpg
cover_alt: "水手服少女把需求追問、工作說明、任務拆分與檢查串成一條 AI 協作流程"
cta_context: agentic
related_posts:
  - gstack-workflow-guide
  - production-ai-agent-control-planes
  - agentic-engineering-patterns-guide
hero_image: true
description: "完整解析 Matt Pocock 的 AI Coding Skills：從需求追問、共同語言、規格與垂直切票，到 TDD、Code Review 與團隊導入風險。"
keywords: Matt Pocock, AI Skills, Agent Skills, grill-me, grill-with-docs, implement, AI Coding, Claude Code, Codex, Agentic Engineering, 軟體工程, 史旺基, Swanky Studio
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>這套 Skills 是什麼</strong>：不是一包神奇 Prompt，而是把需求澄清、共同語言、規格、切票、TDD 與 Code Review 寫成可重複使用的工程流程。</li>
    <li><strong>新手先用哪兩個</strong>：先從 <code>/grill-me</code> 與 <code>/implement</code> 開始；工作變大，再加入 <code>/grill-with-docs</code>、<code>/to-spec</code> 與 <code>/to-tickets</code>。</li>
    <li><strong>為什麼現在重要</strong>：模型愈強，做錯事情的速度也愈快。真正開始形成主流的，不會是背更多 Prompt，而是把判斷、授權與驗證固定成 Skill。</li>
    <li><strong>先別整包無腦裝</strong>：原版可能問得太久，<code>/implement</code> 會直接 Commit，目前的文件與平行工作流也有維護風險；應先在個人專案小範圍試用。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">先搞懂它到底在解決什麼</span>
      <ol class="article-toc-items">
        <li><a href="#一封看起來像行銷信的信">一封看起來像行銷信的信</a></li>
        <li><a href="#skills-不是-prompt-收藏">Skills 不是 Prompt 收藏</a></li>
        <li><a href="#為什麼模型愈強skill-反而愈重要">為什麼模型愈強，Skill 反而愈重要</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">怎麼裝、怎麼用</span>
      <ol class="article-toc-items">
        <li>
          <a href="#安裝方式">安裝方式</a>
          <span class="article-toc-sub">
            <a href="#codex-與其他支援-agent-skills-的工具">Codex 等工具</a>
            <a href="#claude-code-plugin">Claude Code Plugin</a>
          </span>
        </li>
        <li>
          <a href="#兩條核心工作流">兩條核心工作流</a>
          <span class="article-toc-sub">
            <a href="#小型工作一個-session-可以完成">小型工作</a>
            <a href="#大型工作會跨越多個-session">大型工作</a>
          </span>
        </li>
        <li>
          <a href="#六個核心-skill-怎麼用">六個核心 Skill 怎麼用</a>
          <span class="article-toc-sub">
            <a href="#1-grill-me先把你問到不能再含糊">/grill-me</a>
            <a href="#2-grill-with-docs把共同語言留在-repository">/grill-with-docs</a>
            <a href="#3-to-spec把已經談妥的內容保存下來">/to-spec</a>
            <a href="#4-to-tickets切成-agent-吃得下的垂直工作">/to-tickets</a>
            <a href="#5-implement按照既定決策實作">/implement</a>
            <a href="#6-improve-codebase-architecture找出值得重構的地方">/improve-codebase-architecture</a>
          </span>
        </li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">實際跑一次，以及還沒解決的事</span>
      <ol class="article-toc-items">
        <li>
          <a href="#實際操作範例">實際操作範例</a>
          <span class="article-toc-sub">
            <a href="#第一步先釐清不准寫-code">先釐清</a>
            <a href="#第二步工作變大就保存成-spec">存成 Spec</a>
            <a href="#第三步每一張-ticket-都要重新驗證">逐張驗證</a>
          </span>
        </li>
        <li>
          <a href="#這套流程還沒有解決什麼">這套流程還沒有解決什麼</a>
          <span class="article-toc-sub">
            <a href="#追問可能太久">追問太久</a>
            <a href="#文件可能漂移">文件漂移</a>
            <a href="#implement-不會替你管理整個交付生命週期">交付生命週期</a>
            <a href="#安全掃描不等於值得信任">安全風險</a>
          </span>
        </li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">帶進團隊與最後判斷</span>
      <ol class="article-toc-items">
        <li><a href="#團隊要怎麼導入">團隊要怎麼導入</a></li>
        <li><a href="#最後判斷主流的會是-skill不一定是這一套-skill">最後判斷：主流的會是 Skill</a></li>
        <li><a href="#參考資料">參考資料</a></li>
      </ol>
    </li>
  </ol>
</nav>

<div class="article-part"><span class="article-part-num">一</span><span class="article-part-title">先搞懂它到底在解決什麼</span></div>

## 一封看起來像行銷信的信

前幾天收到 Matt Pocock 的一封信，主旨大意是：「想讓你的團隊一起用我的 Skills 嗎？午休時把這支影片放給大家看。」

老實說，我原本以為這又是一封標準的課程暖身信。免費影片、免費簡報，最後再把人導向即將推出的付費課程。這個判斷沒有錯，但只看成這樣又有點可惜。

影片裡有一句話讓我停了一下：

> **AI accelerates software entropy.**[[1]](https://www.aihero.dev/skills/for-your-team)[[2]](https://docs.google.com/presentation/d/12WTK21TZQrTffYdZg206dWuy_CWICD7Eud8pZVWzItA/edit)

AI 加速的不只是開發速度，也會加速軟體的混亂。

這句話比「AI 讓每個人都能寫程式」誠實多了。模型可以在幾分鐘內吐出幾千行程式碼，但它不會因為產量變高，就自動知道哪些程式碼值得留下。當結構、命名、測試與模組邊界一路變差，下一次 Agent 進來工作時，面對的就是一個更難理解的環境。

Matt 的另一個說法是：

> **Code is the agent’s environment.**[[1]](https://www.aihero.dev/skills/for-your-team)[[2]](https://docs.google.com/presentation/d/12WTK21TZQrTffYdZg206dWuy_CWICD7Eud8pZVWzItA/edit)

程式碼不只是產出，也是 Agent 下一次工作的環境。

這才是他這套 Skills 真正想解決的問題。[免費影片與團隊簡報](https://www.aihero.dev/skills/for-your-team)並不是在教大家記住更多指令，而是在問：當 AI 已經能大量執行，團隊要用什麼方法維持共同理解與工程品質？

## Skills 不是 Prompt 收藏

很多人看到 Agent Skill，直覺上會把它理解成「整理得比較漂亮的 Prompt」。技術格式上，Skill 的核心確實常常只是 Markdown；但如果只剩下這個理解，就像把公司 SOP 說成「幾張寫了字的紙」。

真正有價值的是它把一種做事方式固定下來。

Matt 的 [`mattpocock/skills`](https://github.com/mattpocock/skills) 把幾個常見工程問題，分別交給不同 Skill：

- 需求還模糊：先讓 Agent 追問，不准急著實作
- 團隊用詞混亂：建立共同語言與決策紀錄
- 工作超過一個 Context Window：整理成 Spec，再切成 Ticket
- 開始實作：從可驗證的邊界做 TDD
- 實作完成：用 Code Review 對照規格與工程標準
- 架構開始腐化：定期找出值得深化的模組，而不是到處做表面整理

截至 2026 年 8 月 8 日研究當下，這個 Repository 約有 20.9 萬 GitHub Stars、1.8 萬 Forks；[skills.sh](https://www.skills.sh/mattpocock/skills) 顯示約 1,430 萬次總安裝。[[3]](https://github.com/mattpocock/skills)[[7]](https://www.skills.sh/mattpocock/skills) 這些數字不能證明它一定提高交付品質，但至少說明 Agent Skill 已經不是少數人在玩的 Prompt 收納術。

它正在變成一個新的工程流程載體。

## 為什麼模型愈強，Skill 反而愈重要

直覺上，模型愈聰明，我們應該愈不需要工作流。實際上剛好相反。

模型能力弱時，問題通常是「它做不到」。模型能力強之後，問題會變成：

- 它做得到，但做的是不是對的？
- 它改得很快，但有沒有超出範圍？
- 它通過測試，但測試是不是只證明自己寫的答案？
- 它能平行派出多個 Agent，但這些 Agent 會不會同時踩爛同一個 Git 工作目錄？
- 它可以自己 Commit、開 PR、部署，但哪一步應該停下來讓人確認？

能力提高，代表錯誤的爆炸半徑也變大。

所以 Prompt Engineering 不會完全消失，但重心會逐漸移到 **Context Engineering、Skill、規格、權限與 Verification**。團隊不可能要求每個人每次都臨場寫出完美 Prompt；比較可靠的做法，是把經過驗證的流程寫成大家共用、看得懂、改得動的 Skill。

這也是我認為它會慢慢成為主流的原因。

模型負責理解與執行，Skill 負責提醒它現在扮演什麼角色、遵循什麼工序、什麼叫完成。人則負責決定方向、授權範圍與最後驗收。

三者缺一不可。

<div class="article-part"><span class="article-part-num">二</span><span class="article-part-title">怎麼裝、怎麼用</span></div>

## 安裝方式

目前有兩條主要安裝路線，選一種就好。[[3]](https://github.com/mattpocock/skills)

### Codex 與其他支援 Agent Skills 的工具

```bash
npx skills@latest add mattpocock/skills
```

安裝器會讓你挑選要使用的 Skills 與目標 Agent。第一次導入時，記得一併選取 `setup-matt-pocock-skills`，再進入每個 Repository 執行一次：

```text
/setup-matt-pocock-skills
```

它會設定 Issue Tracker、分類標籤與文件存放位置。

### Claude Code Plugin

```bash
claude plugins install mattpocock-skills
```

Plugin 是由作者維護、隨版本更新的唯讀整包；`npx skills` 則是把可編輯檔案複製到你的環境或專案。不要兩種一起裝，不然每個 Skill 會出現兩份，Agent 還沒開始工作，工具箱先自我繁殖。[[3]](https://github.com/mattpocock/skills)

我的建議是：個人試用先挑少數 Skills，不要看到 29 個現役 Skill 就全部勾下去。工具多不等於流程清楚，通常只是選單變長。

## 兩條核心工作流

Matt 把工作大致分成兩種。[[1]](https://www.aihero.dev/skills/for-your-team)[[2]](https://docs.google.com/presentation/d/12WTK21TZQrTffYdZg206dWuy_CWICD7Eud8pZVWzItA/edit)

### 小型工作：一個 Session 可以完成

```text
/grill-with-docs
→ /implement
```

先透過追問對齊需求、程式碼現況與共同語言；確認工作可以留在同一個 Context Window，就直接進入實作。

### 大型工作：會跨越多個 Session

```text
/grill-with-docs
→ /to-spec
→ /to-tickets
→ 每張 Ticket 分別 /implement
```

Spec 是目的地，Ticket 是走到目的地的路徑。[[1]](https://www.aihero.dev/skills/for-your-team)[[2]](https://docs.google.com/presentation/d/12WTK21TZQrTffYdZg206dWuy_CWICD7Eud8pZVWzItA/edit)

每張 Ticket 應該是一個可獨立驗證的垂直切片，不是「先做全部資料庫、再做全部 API、最後才接 UI」的水平分工。[[3]](https://github.com/mattpocock/skills) 理想的 Ticket 要能在一個乾淨的 Context Window 裡完成，並且交付一條從資料、邏輯到介面的窄路徑。

這種切法其實不新。Tracer Bullet、Vertical Slice、TDD、DDD 與 Deep Module 都是老派軟體工程觀念。比較有意思的是，當模型能力上來之後，這些老觀念突然成為 AI Agent 能否穩定工作的基礎設施。

前幾個月我也整理過 [〈gstack 教學：把 Claude Code 變成完整的 AI 開發工作流〉]({% post_url 2026-03-22-gstack-workflow-guide %})。gstack 比較像替 Claude Code 配上一支角色分工完整的產品與工程團隊；Matt Pocock 的 Skills 則更小、更容易拆解，也更強調由使用者掌握流程。兩者方向不同，但都指向同一件事：不能再把 AI Coding 當成「丟一句話，等它自由發揮」。

## 六個核心 Skill 怎麼用

### 1. `/grill-me`：先把你問到不能再含糊

[`/grill-me`](https://www.aihero.dev/skills-grill-me) 是無狀態的需求追問工具。它不讀 Repository、不寫檔案，也不一定要拿來談程式。[[4]](https://www.aihero.dev/skills-grill-me)

適合剛冒出來的產品想法、文章主題、商業決策，或任何你覺得「大概知道要什麼，但說不清楚」的問題。

```text
/grill-me
我想替個人網站增加一個顧問需求診斷入口，但不想變成普通聯絡表單。
```

Agent 會沿著目標客群、使用情境、成功條件、排除範圍與風險一路追問。它的價值不是替你回答，而是逼你承認哪些事情其實還沒決定。

### 2. `/grill-with-docs`：把共同語言留在 Repository

[`/grill-with-docs`](https://www.aihero.dev/skills-grill-with-docs) 會讀取程式碼，並把釐清後的專案術語寫進 `CONTEXT.md`；重大、難以逆轉、如果沒有背景會顯得奇怪的決策，則寫成 ADR。[[6]](https://www.aihero.dev/skills-grill-with-docs)

這裡借用了 DDD 的 Ubiquitous Language。團隊、領域專家與 Agent 使用同一套詞彙，模型就不用每個 Session 重新猜「這個專案說的會員、客戶、合作案，到底是不是同一種東西」。

### 3. `/to-spec`：把已經談妥的內容保存下來

`/to-spec` 不負責繼續腦力激盪。它的工作是把剛才已經談妥的內容整理成一份 Spec，讓工作跨越 Context Window 之後仍然不至於失憶。

如果工作一個 Session 就做得完，其實可以跳過。每多一層文件，就多一次模型把原意整理歪掉的機會。文件不是愈多愈專業，能維持決策才有價值。

### 4. `/to-tickets`：切成 Agent 吃得下的垂直工作

`/to-tickets` 會把 Spec 拆成帶有相依關係的 Ticket，每張 Ticket 盡量是一個能展示、能測試、能獨立完成的垂直切片。

這一步很適合讓人審查。Ticket 太碎會造成管理成本，太大則會把 Agent 推進 Context Window 的「笨區」。先看切法再批准，比讓五個 Agent 同時開工後才發現拆錯便宜很多。

### 5. `/implement`：按照既定決策實作

[`/implement`](https://www.aihero.dev/skills-implement) 接受已經確定的 Spec、Ticket，或同一段對話裡剛談妥的小型計畫。它會執行 TDD、型別檢查與 Code Review，最後 Commit 到目前 Branch。[[5]](https://www.aihero.dev/skills-implement)

這個「最後 Commit」不是小細節。執行前先確認 Branch，也建議把 Skill 改成 Commit 前停下來，讓人看過 Diff 與測試結果再決定。能自動 Commit 是能力，不代表每次都該自動 Commit。

### 6. `/improve-codebase-architecture`：找出值得重構的地方

這個 Skill 會掃描近期常變動的程式碼，尋找可以把複雜度藏進更小介面的 Deep Module 候選，然後產生一份 HTML 報告。

它只負責調查與提出候選，不直接改程式碼。這個界線我很喜歡：先看哪裡值得投資，再另外開 Session 做設計與實作，避免 Agent 一看到「改善架構」就把半個 Repository 翻修一遍。

<div class="article-part"><span class="article-part-num">三</span><span class="article-part-title">實際跑一次，以及還沒解決的事</span></div>

## 實際操作範例

假設我們要替一個個人網站增加「顧問適配診斷」，讓訪客先回答幾個問題，再決定是否進入付費需求診斷。

### 第一步：先釐清，不准寫 Code

```text
/grill-me
我要替個人網站新增顧問適配診斷。請先追問目標客群、排除條件、輸入、輸出、成功條件與隱私風險，不要開始實作。
```

如果討論後發現只是單頁、小資料量、無登入，也許一個 Session 就做得完。這時可以在同一段對話輸入：

```text
/implement
依照剛才談妥的內容實作，但不要自動 Commit；完成後先提供 Diff、測試與瀏覽器驗證結果。
```

### 第二步：工作變大，就保存成 Spec

如果需求包含後台、Email、付款狀態、權限、資料保存與多個整合點，就不要硬塞在同一個 Session。

```text
/grill-with-docs
/to-spec
/to-tickets
```

先審查 Spec，再審查 Ticket 是否為垂直切片、依賴是否合理。確認之後，開乾淨 Session，一次只實作一張 Ticket：

```text
/implement #42
```

### 第三步：每一張 Ticket 都要重新驗證

不能因為上一張 Ticket 做對，就假設下一張也會對。每次至少檢查：

- Acceptance Criteria 是否真的滿足
- 測試是不是從失敗開始，而不是事後補一個永遠會綠的測試
- Diff 是否超出 Ticket 範圍
- 瀏覽器或外部系統狀態是否真的改變
- Code Review 發現的問題是否已處理，而不是只產生報告

Agent 說「完成」，只代表它停止輸出了。驗證完成，才是真的完成。

## 這套流程還沒有解決什麼

這套 Skills 很紅，但還不到可以整包搬進團隊、從此高枕無憂。

### 追問可能太久

`/grill-me` 官方文件把四輪共 46 題視為普通情況。對大型產品決策可能值得，對小功能就很容易把需求澄清做成口試。[[4]](https://www.aihero.dev/skills-grill-me)

我會把它改成：每輪最多 3 到 5 個最高槓桿問題；遇到必須看介面、資料或原型才能回答的問題，就停止聊天，先做 Throwaway Prototype。

### 文件可能漂移

`/grill-with-docs` 會持續寫入 `CONTEXT.md` 與 ADR。官方文件自己也承認，它比較像單一維護者模式；多人同時使用，文件可能過時、互相矛盾，或把不同主題混在一起。[[6]](https://www.aihero.dev/skills-grill-with-docs)

共同文件必須有 Owner、審查節奏與可自動檢查的 Link／Citation Linter。不然 Shared Context 最後只是另一份沒人敢刪的祖傳文件。

### `/implement` 不會替你管理整個交付生命週期

它不會自動建立 Branch、關閉 Ticket、勾選 Acceptance Criteria，也不會自動修掉 Code Review 的所有問題。這些都還是團隊流程要補上的部分。[[5]](https://www.aihero.dev/skills-implement)

更危險的是，在同一個 Checkout 平行跑多個 `/implement` Session，可能互相踩 Git Index、Stash 與 HEAD。要平行工作，至少使用獨立 Worktree，並把每個 Agent 的 Branch、目錄與權限隔離。[[5]](https://www.aihero.dev/skills-implement)

### 安全掃描不等於值得信任

skills.sh 顯示 `/grill-me` 通過 Gen Agent Trust Hub、Socket 與 Snyk 檢查，Repository 也採 MIT 授權、內容公開可讀。[[3]](https://github.com/mattpocock/skills)[[7]](https://www.skills.sh/mattpocock/skills) 這些都比來路不明的 Prompt 壓縮包好很多。

但第三方 Skill 可以影響檔案、Git、Issue Tracker，甚至帶著 Agent 呼叫更多工具。正式導入前仍然要逐檔審查、Pin 版本、限制權限，並先放到非敏感的個人或沙盒 Repository 測試。

把一個 Skill 裝進高權限 Agent，跟把一句提示詞貼進聊天視窗，風險不是同一個等級。

<div class="article-part"><span class="article-part-num">四</span><span class="article-part-title">帶進團隊與最後判斷</span></div>

## 團隊要怎麼導入

如果要在團隊推這套方法，我不會從「請大家安裝 29 個 Skills」開始。那不是導入，是把選擇困難分發給每一個人。

比較合理的 Pilot 是：

1. 選一個低風險、範圍清楚、兩週內可完成的需求
2. 只導入精簡版 `/grill-me` 或 `/grill-with-docs`
3. 共同審查一份 Spec 與 Ticket 切法
4. 用 TDD、Code Review 與瀏覽器／外部狀態驗證完成一條流程
5. 記錄澄清次數、需求重工、Review Defect、交付時間與人工介入點
6. 回顧哪些規則值得留下，改寫成團隊自己的 Skill

真正的目標不是「全員使用 Matt Pocock 的原版 Skills」，而是讓團隊開始把自己的工程判斷寫成共同資產。

因為別人的 Markdown 再好，也不會自動理解你的產品、風險、命名、權限與組織現實。

## 最後判斷：主流的會是 Skill，不一定是這一套 Skill

我認為 Matt Pocock 的 Skills 會紅，不只是因為他在 TypeScript 與 AI Coding 圈有影響力，而是它踩中了模型能力提高之後的真正問題。

模型愈來愈會做，團隊反而更需要知道：現在該做什麼、做到哪裡、誰能批准、完成如何證明。

未來主流的 Agent 使用方式，應該不會是每個人各自收藏一百條神奇 Prompt；而是公司、團隊與個人把重要的做事方法，整理成可讀、可版本控制、可稽核、可驗證的 Skills。

Matt 這套不會是唯一答案。它有太多追問、文件漂移、Git 自動化與平行工作的邊角仍要修。

但方向很清楚：

> **模型能力會逐漸商品化，真正拉開差距的，是你把什麼判斷與工程紀律留在系統裡。**

光頭哥不是發明了軟體工程。

他只是很早把那些大家嘴上都說重要、實際上常常懶得做的事情，寫成 Agent 真的會照著走的流程。

這就已經很有價值了。

---

## 參考資料

[1] <https://www.aihero.dev/skills/for-your-team> — AI Skills for Real Engineering Teams

[2] <https://docs.google.com/presentation/d/12WTK21TZQrTffYdZg206dWuy_CWICD7Eud8pZVWzItA/edit> — Skills for Real Engineers 簡報

[3] <https://github.com/mattpocock/skills> — mattpocock/skills

[4] <https://www.aihero.dev/skills-grill-me> — The /grill-me Skill

[5] <https://www.aihero.dev/skills-implement> — The /implement Skill

[6] <https://www.aihero.dev/skills-grill-with-docs> — The /grill-with-docs Skill

[7] <https://www.skills.sh/mattpocock/skills> — mattpocock/skills on skills.sh
