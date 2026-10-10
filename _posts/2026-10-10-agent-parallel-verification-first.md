---
title: "同時派五個 Agent 之前，先讓它知道自己做錯了"
seo_title: "多個 AI Agent 並行開發怎麼做：從寶玉的五個做法看驗證環境、獨立工作區與模型分工"
date: 2026-10-10 13:00:00 +0800
published: true
categories: [technical]
tags: [ai-agent, agentic-engineering, coding-agent, agents-md, workflow]
layout: article
learn_kit: true
use_glightbox: true
cover_image: /assets/img/linkedin/agent-parallel-verification-first.jpg
cover_alt: "成年水手服創作者站在夜間調度台右側，一手把任務卡插進第三條組裝軌道，一手拿著貼滿便利貼的規則手冊；左邊三條平行軌道各有機械臂在組裝，終點的檢驗閘門亮著綠燈與紅燈，一大兩小的桌上機器人照著藍圖分工"
hero_image: true
cta_context: agentic
related_posts:
  - ai-code-production-review-bottleneck
  - ai-agent-surgical-team
  - matt-pocock-skills-ai-coding-workflow
description: "同時派好幾個 AI Agent 寫程式，卡住的通常不是 Agent 不夠多，是它不知道自己做錯。拆解寶玉的五個做法，排出先後順序。"
keywords: AI Agent 並行, Coding Agent, AGENTS.md, git worktree, 子 Agent, 模型分工, 寶玉, TRAE, 驗證環境, 史旺基
---

終端機開了一排。三個 Agent 在跑，一個在等你回話，一個說做完了，可是你不確定它到底做了什麼。

寶玉在 10 月 9 日的長文裡描述的就是這個畫面：並行一多，哪個任務跑到哪、哪個在等回覆、檔案放在哪，「全靠腦子記」。[[1]](https://x.com/dotey/status/2108559188725043473)

我讀完的第一個反應是：這不是工具不夠多的問題。Agent 一多就亂，通常是因為它們都不知道自己做錯了，每個錯都要繞回你這裡才會被發現。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>先蓋驗證環境，再談並行</strong>：Agent 看不到自己的結果，每多派一個，你就多一條要親自傳話的線。</li>
    <li><strong>能並行的前提是能各自驗收</strong>：任務有依賴就只能排隊；可能改到同一處，就給它獨立的工作區，做完要清掉。</li>
    <li><strong>模型分工要寫進設定</strong>：貴的模型做設計和驗收、便宜的照做。這件事不會自己發生，不寫就是全部用最貴的。</li>
    <li><strong>方法可以帶走，產品不必一起採</strong>：原文是受邀測試產品的寫法；五個做法裡，前三個換什麼工具都成立。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">他在說什麼</span>
      <ol class="article-toc-items">
        <li><a href="#shift">工作從打字搬到派工和驗收</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">換工具也成立的三件事</span>
      <ol class="article-toc-items">
        <li><a href="#environment">先蓋一個 Agent 自己看得到結果的環境</a></li>
        <li><a href="#loop">一個功能怎麼走完一圈</a></li>
        <li><a href="#parallel">能各自驗收，才值得並行</a></li>
        <li><a href="#models">模型分工不會自己發生</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">分辨與落地</span>
      <ol class="article-toc-items">
        <li><a href="#product">哪些是方法，哪些是產品功能</a></li>
        <li><a href="#failure">這套做法會在哪裡壞掉</a></li>
        <li><a href="#start">如果只做一件事</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 工作從打字搬到派工和驗收 {#shift}

寶玉應邀試用字節跳動的 TRAE 新版，借產品的變化，談了四個已經發生的趨勢：IDE（把寫程式、除錯放在一起的編輯器）退到後台、工作入口集中到聊天視窗、從「一個 Agent 幫我寫」變成「指揮一群 Agent 交付」、程式碼多到審查只剩走流程。[[1]](https://x.com/dotey/status/2108559188725043473)

IDE 退場和審查失靈這兩件事，我在〈[AI 寫得出程式，不代表產品上得了線]({% post_url 2026-09-13-ai-code-production-review-bottleneck %})〉拆過了，這篇不重講。

這篇比較值得細看的，是他後半段的五個做法。那些不是趨勢觀察，是他在自己的開源專案 baocut 上，一天幾十到上百個 commit（Git 的一次存檔）累積出來的習慣。[[2]](https://github.com/jimliu/baocut)

他的結論只有一句：寫程式的成本快速下降，想清楚要做什麼、驗證做得對不對，這兩件事越來越值錢。

我同意，但想補一句：「AI 寫了接近 100% 的程式碼」說的是誰按的鍵，不是誰負責。需求拆錯、驗收標準含糊，Agent 只會更快地把錯的東西做成能跑的東西。

## 先蓋一個 Agent 自己看得到結果的環境 {#environment}

他的第一個做法是我認為整篇最重要的一條：Agent 做得好不好，一大半取決於它所在的環境。

他拆成三件事，我覺得可以這樣理解：

- **一張地圖**：模組在哪、文件在哪、要改什麼先讀什麼。Agent 不用每次從頭摸索。
- **一條回饋迴路**：自動化測試、和正式介面同步的網頁原型、先寫的設計文件、強型別語言。Agent 改完自己就能知道對不對，不用等你傳話。
- **一本規則手冊**：寫進 `AGENTS.md`，也就是放在專案裡、專門給 Agent 看的說明檔。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="agent-parallel-verification-first" data-type="image" href="{{ '/assets/img/technical/agent-parallel-verification-first/environment.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/technical/agent-parallel-verification-first/environment-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/technical/agent-parallel-verification-first/environment.svg' | relative_url }}" width="1200" height="720" alt="Agent 的工作環境由三件事組成：地圖讓它找得到路，回饋迴路讓它改完自己知道對錯，規則手冊讓它不重犯；抽查發現的錯誤回寫成規則或自動檢查，下次直接跑不過">
    </picture>
  </a>
  <figcaption>圖 1：地圖、回饋迴路、規則手冊；抽查到的錯回寫成規則 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

規則那一條，他有一句我很想貼在螢幕旁邊：看到 Agent 反覆犯同一個錯，就把它變成一條規則或一項自動檢查，讓它下次犯不了。[[1]](https://x.com/dotey/status/2108559188725043473)

這句話的重點不是「寫規則」，是「犯不了」。提示詞寫得再長，Agent 下次還是可能忘；寫成測試或檢查，它下次就跑不過。

他的 `AGENTS.md` 是公開的，可以直接看他怎麼做。開頭是一張「要做什麼事，就先讀哪份文件」的對照表；下面有幾條硬規則，例如介面要改，先只改原型，給人確認後才動正式程式碼。[[3]](https://github.com/jimliu/baocut/blob/main/AGENTS.md)

對照表放在最前面，是有原因的。規則一多，Agent 不可能每次都讀完；與其整本塞給它，不如告訴它「做這件事，先讀那一段」。

## 一個功能怎麼走完一圈 {#loop}

主文發出後幾個小時，他補了一則實例：baocut 的字幕樣式功能，從頭到尾怎麼做。[[4]](https://x.com/dotey/status/2108663149301846497)

我把它整理成四步：

1. **先寫技術方案。** Agent 調研後寫成文件，他看完再提要求，來回幾次定稿。這份文件放在 repo 裡，開頭就寫著「原型先行」，正式介面要等確認原型後才改。[[5]](https://github.com/JimLiu/baocut/blob/0126a418dbf752ebb7eb2ecc2afc160daee1cfdf/docs/design/subtitle/caption-style-model-design.md)
2. **再做高保真原型。** 原型和正式介面幾乎長得一樣，只是背後接的是模擬邏輯。理由很實際：直接在最終程式碼上改，一旦要返工，時間和 token 都貴很多。
3. **才寫正式程式碼。** 方案和畫面都定了，這一步通常不太需要返工。
4. **驗收。** Agent 先用瀏覽器驗大部分功能，複雜的才讓它操作電腦；他自己再測一輪邊角，例如發現預覽文字太靠上，直接叫 Agent 修。

他的說法是，人「重點還是在兩頭：定義問題和驗收」。[[4]](https://x.com/dotey/status/2108663149301846497)

另一則補充把順序講得更清楚：每個功能、每個 bug 修復都是這樣一圈；圈轉得起來之後，才開始試多個任務並行。[[6]](https://x.com/dotey/status/2108665314619675011)

我覺得這是整串裡最實用的一句。並行不是起點，是單一任務的回饋夠快之後，自然多出來的空檔。

## 能各自驗收，才值得並行 {#parallel}

第二個做法是把自己當成管理者。他列了四件事：定義好任務、交代怎麼驗證、用好版本控制、前期做設計。

我把它們收成一個判斷順序。派工之前，對每個任務問三個問題：

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="agent-parallel-verification-first" data-type="image" href="{{ '/assets/img/technical/agent-parallel-verification-first/parallel-check.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/technical/agent-parallel-verification-first/parallel-check-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/technical/agent-parallel-verification-first/parallel-check.svg' | relative_url }}" width="1200" height="760" alt="派工前三個問題：任務能不能自己驗收，不能就先補驗收條件；任務之間有沒有依賴，有就排隊做；會不會改到同一處，不會就在主線上一起改，會就各開獨立工作區，做完合併並刪掉工作區">
    </picture>
  </a>
  <figcaption>圖 2：派工前的三個問題（本文依原文整理的判斷順序） <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

**第一個問題：它能不能自己驗收？** 派工時把驗收標準和驗證方法一起交代，Agent 才能自己檢查，你只做最終驗收。說不出驗收條件的任務，先別派，派出去也只是換個地方等你。

**第二個問題：任務之間有沒有依賴？** 有依賴就得排隊。硬要並行，只是把等待換成合併衝突。

**第三個問題：會不會改到同一處？** 不會的話，直接在主線上一起改問題不大。可能衝突，就讓每個 Agent 在自己的 worktree 裡做。

worktree 是 Git 內建的功能：同一個專案，多開幾個各自獨立的工作目錄，每個目錄可以在不同分支上做事，互不干擾。[[7]](https://git-scm.com/docs/git-worktree)

代價是佔硬碟。他的處理方式我很喜歡：不是靠記得清，而是寫進規則。baocut 的 `AGENTS.md` 規定，在 worktree 裡做的任務，完成時必須刪掉那個 worktree 和它的分支；真的要留，得在回報裡點名路徑和原因。[[3]](https://github.com/jimliu/baocut/blob/main/AGENTS.md)

每一輪都 commit 也是同一個道理。回滾一次的成本，要低於讓 Agent 重做一次。

## 模型分工不會自己發生 {#models}

第三個做法是不同的工作交給不同的模型：最聰明的模型做設計、寫成文件；中低檔的模型照文件執行；再讓聰明的模型驗收。

他也提到，工具若支援子 Agent（主 Agent 派出去做事的分身），可以讓主 Agent 自己安排這套分工。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="agent-parallel-verification-first" data-type="image" href="{{ '/assets/img/technical/agent-parallel-verification-first/model-tiers.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/technical/agent-parallel-verification-first/model-tiers-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/technical/agent-parallel-verification-first/model-tiers.svg' | relative_url }}" width="1200" height="700" alt="一個任務的分工：人定義需求與驗收標準；強模型寫設計文件；便宜的子 Agent 照文件分頭執行並跑自動測試；強模型驗收；人抽查並負責登入、憑證、推上線這類身分動作。若沒有特別設定，子 Agent 常沿用主 Agent 的模型">
    </picture>
  </a>
  <figcaption>圖 3：貴的模型放在頭尾，便宜的模型放在中間；身分動作留給人 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

這裡有個實務上的坑：以我在用的 Claude Code 來說，子 Agent 如果沒特別指定模型、也沒設預設值，會沿用主 Agent 的模型。也就是說，你以為在分工，其實是一群最貴的模型在做最機械的事。

所以派子 Agent 時要寫明用哪個模型：搜尋、機械性修改用便宜的，設計和驗收才用貴的。最好寫進規則檔，而不是每次口頭提醒。分工不會自己發生。

## 哪些是方法，哪些是產品功能 {#product}

原文是受邀測試的寫法，工作台、專案產物庫、範本庫、自動化、「我的助理」、手機同步，都是在對應 TRAE 自家的功能。這很正常，只是讀的時候要分開看。

第四、第五個做法裡，拆掉產品名之後，方法本身仍然通用：

- **不要從零描述常見任務**：用現成範本，或讓 Agent 先讀懂一個成熟的開源專案再動手。他做 baocut 時參考了另一個開源專案的設計；用到 Adobe 的設計系統，就直接把文件網址丟給 Agent。
- **重複的流程收成 Skill**：他把發布 App 的流程做成一個 Skill，之後只要說一句「幫我發布某個版本」。
- **定時任務先記錄、不急著改**：讓定期檢查把發現的問題寫進文件，累積幾天再看，常會發現好幾個問題來自同一個原因。這招我覺得被低估了。
- **把協作工具接進 Agent**：他舉的是飛書、GitHub、Jira，換成你實際在用的工具，原則一樣。

讓 Agent 操作電腦和瀏覽器那三個例子，要留意邊界。幫 Mac App 簽章時，登入是他自己做；設定 GitHub 自動發布時，也是他自己登入，Agent 才去設環境變數。

這不是把帳號交給 Agent，是把**不能委託的身分動作留在人這邊**，後面的點選和設定才交出去。baocut 的規則裡也寫明，任務完成只建立本機 commit，推上遠端必須由使用者針對當次任務另外明確要求。[[3]](https://github.com/jimliu/baocut/blob/main/AGENTS.md)

## 這套做法會在哪裡壞掉 {#failure}

**數字不能直接拿來引用。** 「新創公司 AI 產生的程式碼接近 100%」「全球用戶超過 600 萬」「某位工程師一個月合併 2500 個 PR」，都是原文轉述或產品口徑，文中沒有附獨立來源。方向和近一年工具的演進一致，但不宜當成事實引用。[[1]](https://x.com/dotey/status/2108559188725043473)

**「非關鍵程式碼可以不審查」是政策，不是技術結論。** 讓 Agent 自己驗證、人做抽查、抽到問題就改規則，這套成立的前提是：你抽得到，而且規則真的會被執行。沒有測試和驗收標準的專案，這條會直接變成品質的空洞。

**規則手冊會長胖。** 每犯一個錯就加一條，半年後就是一本沒人讀完的法典，Agent 也一樣讀不完。地圖式的寫法是解法之一：不把所有規則塞給它，而是告訴它「做這件事時，去讀哪一段」。baocut 的 `AGENTS.md` 開頭就是這樣一張對照表。

**雲端並行換來的是另一組成本。** 他預告 Agent 會搬到雲上，一個任務一台虛擬機；也坦白說，自己現在的瓶頸是電腦不夠多、token 不夠用，之後要習慣多在雲端開任務。[[6]](https://x.com/dotey/status/2108665314619675011) 雲端解決了機器數量與隔離，但帳單、金鑰怎麼管、改完怎麼像在本機一樣順手驗證，都是新的問題。這半句是我的判斷，不是原文的論點。

## 如果只做一件事 {#start}

如果你還沒試過這些做法，我會建議跳過並行和換模型，先做他說的第一條。

具體來說，今天就可以開始：

1. 在專案根目錄寫一份 `AGENTS.md`，第一段只寫「要做什麼，先讀哪裡」。
2. 補一條 Agent 改完就能自己跑的檢查，哪怕只是一個測試指令。
3. 下次 Agent 犯了你已經糾正過的錯，不要再罵它一次，把它寫成第 3 條規則，或一個會失敗的檢查。

等這三件事穩了，再試著同時派兩、三個任務。到那時候你會發現，終端機開了一排也不太需要靠腦子記，因為大部分的錯，在回到你手上之前就已經被擋下來了。

真正留在你手上的，是只有你能判斷的那幾件事。

## 參考資料

- **[1]** [寶玉：從「讓 Agent 寫程式碼」到「指揮一群 Agent 交付」：TRAE 新版和我的五個做法](https://x.com/dotey/status/2108559188725043473)，2026-10-09。X 長文，受邀測試產品；文中數字為作者轉述或產品口徑。
- **[2]** [jimliu/baocut：GitHub 專案首頁](https://github.com/jimliu/baocut)，2026-10-10 讀取。
- **[3]** [baocut：AGENTS.md](https://github.com/jimliu/baocut/blob/main/AGENTS.md)，2026-10-10 讀取。文件地圖、原型先行、commit 與 worktree 清理規則。
- **[4]** [寶玉：baocut 字幕樣式的開發實例](https://x.com/dotey/status/2108663149301846497)，2026-10-09。引用主文的後續貼文，示範方案、原型、實作、驗收四步。
- **[5]** [baocut：字幕樣式模型設計文件](https://github.com/JimLiu/baocut/blob/0126a418dbf752ebb7eb2ecc2afc160daee1cfdf/docs/design/subtitle/caption-style-model-design.md)，2026-10-10 讀取。寶玉實例中引用的技術方案文件。
- **[6]** [寶玉：開發循環與並行的瓶頸](https://x.com/dotey/status/2108665314619675011)，2026-10-09。
- **[7]** [Git 官方文件：git-worktree](https://git-scm.com/docs/git-worktree)，2026-10-10 讀取。
