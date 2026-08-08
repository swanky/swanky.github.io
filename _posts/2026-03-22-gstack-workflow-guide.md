---
title: "gstack 教學：把 Claude Code 變成完整的 AI 開發工作流"
seo_title: "Claude Code 教學：用 gstack 打造完整 AI 開發工作流"
date: 2026-03-22 00:00:00 +0000
categories: [claude-code]
layout: article
nav_active: education
cover_image: /assets/img/linkedin/gstack-workflow-guide.svg
hero_image: true
description: "gstack 不是一包 prompt，而是一套把 AI 開發流程角色化、階段化的工作流。從需求定義、工程規劃、PR 審查、QA 測試、資安稽核到部署驗證，每個階段都有明確分工的 slash commands。2026 年 8 月依 v1.60.2.0 更新。"
keywords: gstack,Claude Code,AI工作流,開發流程,AI工具,AI學習,autoplan,cso,land-and-deploy,史旺基,Swanky Studio
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>gstack 是什麼</strong>：一套把 Claude Code 變成「有工序、有守門員、有驗證習慣」的工作流技能包——從規劃、審查、QA 到出貨，每個階段有專屬指令。</li>
    <li><strong>安裝</strong>：把 repo 複製到 <code>~/.claude/skills/gstack</code>，進去跑一次 <code>./setup</code> 就好（<a href="#安裝方式">完整指令見安裝那節</a>；Windows 需另裝 Node.js）。</li>
    <li><strong>新手先練 5 顆</strong>：<code>/plan-eng-review</code>（規劃）、<code>/review</code>（merge 前審查）、<code>/qa</code>（真的去測網頁）、<code>/investigate</code>（先查再修）、<code>/guard</code>（限制改動範圍）。懶得逐顆跑，就用 <code>/autoplan</code> 一次跑完整條規劃鏈。</li>
    <li><strong>最大誤區</strong>：把它當一包超大 prompt——它的價值在節奏與分工，不在單顆指令多神。</li>
    <li><strong>版本提醒</strong>：這半年 gstack 改動很大（<a href="#2026-年-8-月更新這半年多出來的東西">新增內容見這一節</a>）；團隊導入現在官方推薦 <code>./setup --team</code>，不要再把整包複製進 repo。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">先搞懂它是什麼</span>
      <ol class="article-toc-items">
        <li><a href="#什麼是-gstack">什麼是 gstack</a></li>
        <li><a href="#為什麼-gstack-值得學">為什麼值得學</a></li>
        <li><a href="#gstack-適合誰">適合誰</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">裝起來</span>
      <ol class="article-toc-items">
        <li><a href="#安裝前你要先知道的事">安裝前你要先知道的事</a></li>
        <li>
          <a href="#安裝方式">安裝方式</a>
          <span class="article-toc-sub">
            <a href="#1-安裝到你的-claude-code-全域技能目錄">全域安裝</a>
            <a href="#2-讓團隊一起用改用-team-mode不要再複製整包">團隊模式</a>
            <a href="#3-其他-agent-也能用">其他 agent</a>
            <a href="#4-windows-使用者一定要知道的一條">Windows 注意</a>
          </span>
        </li>
        <li><a href="#claudemd-要怎麼寫">CLAUDE.md 要怎麼寫</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">學會怎麼用</span>
      <ol class="article-toc-items">
        <li>
          <a href="#先理解-gstack-的四大層次">先理解四大層次</a>
          <span class="article-toc-sub">
            <a href="#審查類太多了該用哪一顆">該用哪一顆 review</a>
          </span>
        </li>
        <li>
          <a href="#核心-skill-詳解新手最先該學的-8-顆">核心 skill 詳解（8 顆）</a>
          <span class="article-toc-sub">
            <a href="#1-office-hours先把問題問對">/office-hours</a>
            <a href="#2-plan-ceo-review幫你砍-scope也幫你找到更值得做的版本">/plan-ceo-review</a>
            <a href="#3-plan-eng-review最值得養成習慣的一顆">/plan-eng-review</a>
            <a href="#4-plan-design-review避免做出-ai-味很重的-ui-規格">/plan-design-review</a>
            <a href="#5-review不是看有沒有過測試而是看會不會上線爆">/review</a>
            <a href="#6-qa讓-ai-真的去測你的-app">/qa</a>
            <a href="#7-investigate沒有調查就不要亂修">/investigate</a>
            <a href="#8-guardfreeze給-ai-上護欄">/guard、/freeze</a>
          </span>
        </li>
        <li>
          <a href="#你最該照著走的三條工作流">三條工作流</a>
          <span class="article-toc-sub">
            <a href="#工作流-a新功能開發">A 新功能</a>
            <a href="#工作流-b改高風險模組">B 高風險模組</a>
            <a href="#工作流-c純前端--ui-優化">C 前端 UI</a>
          </span>
        </li>
        <li><a href="#新手實戰範例用-gstack-做一個會員分級功能">實戰範例：會員分級</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">新版變化與實務建議</span>
      <ol class="article-toc-items">
        <li><a href="#2026-年-8-月更新這半年多出來的東西">2026 年 8 月更新：新增了什麼</a></li>
        <li><a href="#gstack-最容易踩的坑">最容易踩的坑</a></li>
        <li><a href="#新手最推薦先熟的-5-顆">最推薦先熟的 5 顆</a></li>
        <li><a href="#常見問題">常見問題</a></li>
        <li><a href="#我的實務建議把-gstack-當成團隊開發規範">當成團隊開發規範</a></li>
        <li><a href="#結語">結語</a></li>
        <li><a href="#參考來源">參考來源</a></li>
      </ol>
    </li>
  </ol>
</nav>

<p class="article-update-note">本文 2026 年 3 月首次發表，2026 年 8 月 8 日對照 gstack v1.60.2.0 重新核對，更新了安裝方式、團隊導入做法與技能清單，並補上這半年新增的重點。</p>

很多人第一次接觸 Claude Code 時，會把它當成一個很會寫程式的聊天視窗。這樣用不是不行，但常常會遇到同樣幾個問題：

- 前面需求沒想清楚就開始做
- 做到一半 scope 越長越歪
- 程式碼能跑，但結構、測試、邊界條件沒顧好
- UI 看起來像能用，實際互動一測就破功
- merge 前沒人幫你當最後一道守門員

**gstack** 的價值，就在於它不是單一 prompt，也不是一包零散工具，而是一套把 AI 開發流程角色化、階段化的工作流。官方 repo 把它描述為 Garry Tan 的 Claude Code 設定，包含多個具明確分工的 skills，從產品思考、工程規劃、設計審查、PR review、QA 到 release 文件同步，都有對應的 slash commands。

<div class="article-part"><span class="article-part-num">一</span><span class="article-part-title">先搞懂它是什麼</span></div>

## 什麼是 gstack？

gstack 是一組依照 **SKILL.md** 規範組成的工作流技能包，設計理念很明確：讓 AI 在不同階段切換不同角色，而不是永遠只用同一種思考模式處理所有事情。代表性的 slash commands 包含 `/office-hours`、`/plan-ceo-review`、`/plan-eng-review`、`/plan-design-review`、`/review`、`/investigate`、`/qa`、`/ship`、`/document-release` 等。

規模也一直在長。官方 README 現在把它介紹成「二十三位專家角色加八個 power tool」，repo 裡的技能目錄實際已超過五十個（含 iOS 實機測試、文件生成、效能量測等分支家族）。這對新手其實是壞消息：清單愈長，愈容易一開始就迷路。所以下面會先給你四層分類與三條工作流，再談那些新東西。

換句話說，gstack 不是在幫你「多裝幾個 prompt」，而是在幫你把 Claude Code 變成一支迷你產品與工程團隊：

- 有人負責先挑戰需求定義
- 有人幫你收斂 scope
- 有人逼你把架構與測試想清楚
- 有人專看那些 CI 過了、上線才炸的問題
- 有人真的去瀏覽器裡點、測、截圖、驗證
- 有人把 release 後最容易過期的文件補齊

這也是它跟一般 skill 包最大的差別。

---

## 為什麼 gstack 值得學？

gstack 背後有兩個很實用的核心觀念。

**第一，它把開發拆成有先後順序的流程，而不是讓 AI 一路 freestyle。** 整體節奏從思考、規劃、實作、審查、測試到出貨形成一條鏈，前一階段的輸出會餵給後一階段，避免上下文散掉。

**第二，它不只是一堆 markdown 指令。** gstack 的架構設計說得很清楚：它提供的是 **persistent browser** 加上 workflow skills。為了讓 AI 在瀏覽器裡操作時有亞秒級延遲、又能保留 cookies、tabs 與登入狀態，gstack 讓 Chromium 以長駐 daemon 的方式存在，CLI 再透過 localhost HTTP 呼叫它。這也是為什麼 `/browse`、`/qa`、`/design-review` 這類能力比較像真正在操作一個持續存在的瀏覽器，而不是每次都冷啟動一次。

講白一點，普通的 Claude Code 像很聰明的單兵；gstack 則像替這個單兵配了一張作戰流程圖、一組專家顧問，外加一台不會每五分鐘失憶的瀏覽器。

---

## gstack 適合誰？

gstack 特別適合下面幾種人：

**1. 用 Claude Code 做實際專案的人**
不是只是拿來問問題，而是真的會改 repo、開 PR、跑測試、做 UI 驗證的人。

**2. 常做 Web 專案的人**
因為 `/browse`、`/qa`、`/setup-browser-cookies`、`/design-review` 這類技能，對網頁應用、登入流程、前後台表單、Dashboard 特別有感。`/setup-browser-cookies` 可把真實瀏覽器的 cookies 匯入 headless session，用來測登入後頁面。

**3. 不想讓 AI 每次都從同一個思考高度亂飛的人**
例如需求定義要像 PM，規劃時要像 tech lead，PR 前要像 staff engineer，debug 時要像 debugger。這正是 gstack 最有價值的地方。

<div class="article-part"><span class="article-part-num">二</span><span class="article-part-title">裝起來</span></div>

## 安裝前你要先知道的事

gstack 的基本需求包含 Claude Code、Git、Bun v1.0+，**Windows 額外需要 Node.js**。Windows 11 可透過 Git Bash 或 WSL 使用；由於 Bun 在 Windows 上對 Playwright pipe transport 有已知問題，瀏覽器伺服器會自動 fallback 到 Node.js，所以 `bun` 與 `node` 都要在 PATH 上。

對 Windows 使用者來說，這段很關鍵。你可以用 Git Bash，但若你本來就會在 Claude Code 裡跑不少 CLI 與瀏覽器自動化，**WSL 通常會更穩**。

---

## 安裝方式

### 1) 安裝到你的 Claude Code 全域技能目錄

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack
./setup
```

`--single-branch --depth 1` 是官方現在建議的寫法，只抓最新一份、不拉整段歷史，clone 會快很多。

### 2) 讓團隊一起用：改用 team mode，不要再複製整包

早期的做法是把整個 gstack 目錄複製進專案的 `.claude/skills/`。這招現在**不建議**了——每個 repo 都會存下一份當時的版本，過幾週就開始各人版本不同。官方改成 team mode：專案裡不放實體檔案，每次開 session 自動檢查更新（每小時最多一次，斷網也不會卡住）。

在專案根目錄執行：

```bash
(cd ~/.claude/skills/gstack && ./setup --team) && ~/.claude/skills/gstack/bin/gstack-team-init required && git add .claude/ CLAUDE.md && git commit -m "require gstack for AI-assisted work"
```

`required` 是「沒裝就擋下來」，想改成柔性提醒就把它換成 `optional`。

### 3) 其他 agent 也能用

gstack 現在支援十種 AI coding agent，`./setup` 會自動偵測你裝了哪些，也可以用 `--host` 指定：

| Agent | 參數 | 技能安裝到 |
|---|---|---|
| OpenAI Codex CLI | `--host codex` | `~/.codex/skills/gstack-*/` |
| OpenCode | `--host opencode` | `~/.config/opencode/skills/gstack-*/` |
| Cursor | `--host cursor` | `~/.cursor/skills/gstack-*/` |
| Factory Droid | `--host factory` | `~/.factory/skills/gstack-*/` |
| Slate | `--host slate` | `~/.slate/skills/gstack-*/` |
| Kiro | `--host kiro` | `~/.kiro/skills/gstack-*/` |
| Hermes | `--host hermes` | `~/.hermes/skills/gstack-*/` |
| GBrain | `--host gbrain` | `~/.gbrain/skills/gstack-*/` |

另外 OpenClaw 因為是透過 ACP 開 Claude Code session，只要 Claude Code 這邊裝好，gstack 的技能就直接可用；也有四顆方法論技能（`/office-hours`、`/plan-ceo-review`、`/investigate`、`/retro` 的 OpenClaw 版）可以透過 ClawHub 直接裝進 OpenClaw 自己跑。

### 4) Windows 使用者一定要知道的一條

在沒開「開發者模式」的 Windows（MSYS2／Git Bash）上，`setup` 會改用**檔案複製**而不是 symlink——因為 symlink 在這個環境會變成不會跟著 `git pull` 更新的凍結副本。結果就是：**每次 `git pull` 之後都要再跑一次 `./setup`**，技能檔案才會跟上 repo。`setup` 執行完會印一行提醒。Unix 與 WSL 用 symlink，不需要重跑。

---

## `CLAUDE.md` 要怎麼寫？

如果 Claude 說它看不到 skills，除了重新跑 `./setup`，也要確認你的 `CLAUDE.md` 有一段 gstack 區塊：

```md
## gstack
Use /browse from gstack for all web browsing. Never use mcp__claude-in-chrome__* tools.
Available skills: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review,
/design-consultation, /design-shotgun, /design-html, /review, /ship, /land-and-deploy,
/canary, /benchmark, /browse, /open-gstack-browser, /qa, /qa-only, /design-review,
/setup-browser-cookies, /setup-deploy, /setup-gbrain, /sync-gbrain, /retro, /investigate,
/document-release, /document-generate, /codex, /cso, /autoplan, /pair-agent, /careful, /freeze,
/guard, /unfreeze, /gstack-upgrade, /learn.
```

（這份清單以 2026 年 8 月的官方 README 為準；升級後可以直接照官方 README 的版本覆蓋。）

這段看起來像在幫 Claude 做點名，其實是很實際的「操作手冊提示」。Skill 存在，不代表模型每次都會主動想到它；寫進 `CLAUDE.md`，相當於把「這個 repo 的工作規則」固定下來。

<div class="article-part"><span class="article-part-num">三</span><span class="article-part-title">學會怎麼用</span></div>

## 先理解 gstack 的四大層次

在真正開始用之前，建議先把 gstack 分成四層來理解，才不會看到二十幾個指令像工具箱爆開。

### 一、需求與產品定義層

負責回答「我們到底要做什麼？」

- **`/office-hours`** — 從這裡開始。用六個強迫思考問題重新框定產品，挑戰前提，生成替代方案。
- **`/plan-ceo-review`** — 站在 CEO / Founder 視角重新看需求，找出更高價值的版本。支援擴張、收斂、維持 scope、縮減等模式。
- **`/autoplan`** — 把 CEO → 設計 → 工程三道規劃審查串成一條自動流程，只把需要你拍板的取捨拿出來問。趕時間時很好用。
- **`/spec`** — 把模糊的想法寫成一份可直接執行的規格，分五個階段推進（為什麼做、範圍、技術細節、草稿、落檔），並在存檔前用 Codex 當品質關卡。

### 二、工程與設計規劃層

負責回答「要怎麼做才做得出來？」

- **`/plan-eng-review`** — 聚焦 architecture、system boundaries、data flow、state transitions、failure modes、edge cases、trust boundaries 與 test coverage。強調要畫 diagrams，把模糊假設逼出來。
- **`/plan-design-review`** — 用 0 到 10 的評分法檢查設計方案，說明怎樣才算 10 分，然後直接把 plan 修到更接近 10。
- **`/plan-devex-review`** — 上面那顆是給「使用者」看的介面，這顆是給「開發者」看的體驗：API、CLI、SDK、文件。會追你的上手時間、對照競品、逐步找出摩擦點。
- **`/design-consultation`** — 偏向從零建立設計系統與方向。
- **`/design-shotgun` → `/design-html`** — 前者一次生成 4 到 6 個視覺版本，開一個比較面板讓你挑；挑定之後交給後者變成可上線的 HTML。

### 三、實作後檢查與驗證層

負責回答「做完之後真的安全嗎？」

- **`/review`** — pre-landing PR review，對 diff 做結構性檢查，包含 SQL safety、LLM trust boundary violations、conditional side effects 等。
- **`/qa`** — 測 app、找 bug、修 bug、自動產生 regression tests，再驗證。
- **`/qa-only`** — 相同方法，但只出 bug report 不動程式碼。
- **`/design-review`** — 用設計審查的思維去檢查 live site，再修掉問題。
- **`/devex-review`** — 真的照你的文件走一次新手上手流程，計時、截圖失敗處，再跟 `/plan-devex-review` 當初打的分數對照。
- **`/cso`** — 資安長視角，跑 OWASP Top 10 加 STRIDE 威脅模型，每個發現都要附具體攻擊情境，並設了信心門檻壓低誤報。
- **`/benchmark`** — 量頁面載入時間與 Core Web Vitals，做成前後對照。

### 四、安全與收尾層

負責回答「怎麼避免 AI 改過頭，並把專案收乾淨？」

- **`/investigate`** — root-cause debugging，強調「沒有調查就不要修」，若連續三次修法失敗就停止亂補。
- **`/document-release`** — 比對 diff 去修 README、ARCHITECTURE、CONTRIBUTING、CLAUDE.md 等文件漂移。`/ship` 會自動呼叫它，讓出貨同時同步文件。
- **`/document-generate`** — 上面那顆是補既有文件的漂移，這顆是文件根本還沒寫時，從程式碼生出缺的那幾類文件。
- **`/land-and-deploy` 與 `/canary`** — 前者把「PR 已核准」一路帶到「正式環境已驗證」；後者在部署後持續盯 console 錯誤與效能退化。
- **`/learn`** — 管理 gstack 跨 session 學到的東西（這個專案的慣例、地雷、你的偏好），可以檢視、搜尋、清掉。
- **`/freeze`** — 把改動限制在單一目錄。
- **`/guard`** — 結合 `/careful` 和 `/freeze`，適合高風險環境。

### 審查類太多了，該用哪一顆？

審查類技能是最容易搞混的一區，因為「規劃階段先審」和「上線後實測」各有一顆對應。照你做的東西挑就好：

| 你的東西是給誰用的 | 寫程式前先審 | 做完之後實測 |
|---|---|---|
| 一般使用者（網頁、App 介面） | `/plan-design-review` | `/design-review` |
| 開發者（API、CLI、SDK、文件） | `/plan-devex-review` | `/devex-review` |
| 架構本身（資料流、效能、測試） | `/plan-eng-review` | `/review` |
| 以上都有 | `/autoplan`（自動判斷該跑哪幾種） | — |

---

## 核心 skill 詳解：新手最先該學的 8 顆

### 1. `/office-hours`：先把問題問對

這顆是 gstack 的起手式，也是官方明確標注「Start here」的入口。它不是幫你許願列清單，而是挑戰你的 framing——問你真實痛點是什麼、現在怎麼做、為什麼現狀不夠、你想做的東西是不是其實只是假議題。

**適合情境**：新產品想法剛冒出來、老闆丟一句需求要你展開、你懷疑自己定錯題目。

**建議用法**：不要只說「我要做一個會員系統」。比較好的輸入：

> 我們的電商後台目前會員分級靠人工維護，客服容易出錯。老闆想做會員制度自動化，但我不確定是真要重做會員系統，還是只需要補一層規則引擎與通知機制。

這樣 `/office-hours` 才有東西可以挑戰。

---

### 2. `/plan-ceo-review`：幫你砍 scope，也幫你找到更值得做的版本

這顆站在創辦人或產品負責人的高度，不是問你「能不能做」，而是問你「這樣做值不值得」。有四種模式：Expansion、Selective Expansion、Hold Scope、Reduction。

**適合情境**：覺得需求清單太長、想定 MVP、懷疑功能表面合理但實際價值不高。

**建議用法**：先有一版初步方案，再叫它 review。它是產品剪刀手，不是開腦洞機器。

---

### 3. `/plan-eng-review`：最值得養成習慣的一顆

文件明列它要處理 architecture、系統邊界、資料流、狀態轉移、失敗模式、邊界條件、信任邊界與測試覆蓋，並強調要用 sequence diagram、state diagram、component diagram、data-flow diagram、test matrix 把系統畫出來。

**適合情境**：API 設計、後台流程改造、背景工作 / queue / retry / idempotency、DB migration、第三方整合、支付 / 登入 / 權限等高風險功能。

**建議用法**：把以下資訊一次餵給它——背景與需求、現況架構、你打算怎麼做、你最怕哪裡出事、哪些限制不能碰。

這顆最強的地方不是幫你寫結論，而是把你還沒想到的洞挖出來。

---

### 4. `/plan-design-review`：避免做出 AI 味很重的 UI 規格

專門看實作前的設計規劃。它會對設計各面向做 0 到 10 評分，說明距離 10 分差在哪裡，再把 plan 修得更完整。

**適合情境**：要做 SaaS 後台、表單、Dashboard；有 wireframe 或 UI plan，但細節還鬆；想先把 loading、error、empty state、responsive 想好。

這顆很適合拿來擋掉那種「畫面看似 clean modern，其實只有卡片、圖示和大片留白」的 AI 風格空殼。

---

### 5. `/review`：不是看有沒有過測試，而是看會不會上線爆

這顆是 pre-landing PR review，會分析 branch 相對 base branch 的 diff，找出那些測試不一定會抓到的結構性問題，例如 SQL safety、LLM 信任邊界問題、conditional side effects 等。

**建議節奏**：

1. 完成實作
2. 跑本地測試
3. `/review`
4. 修 findings
5. 進入 `/qa`

---

### 6. `/qa`：讓 AI 真的去測你的 app

`/qa` 會測你的 app、找 bug、修掉、用 atomic commits 提交，再驗證，並對每個修復自動生成 regression tests。這顆最適合網頁應用，尤其是有真實互動與登入狀態的流程。

**適合情境**：Checkout 流程、設定頁、表單提交、權限頁面、Dashboard 篩選器、多步驟 wizard、手機版 menu / modal / upload。

---

### 7. `/investigate`：沒有調查就不要亂修

`/investigate` 是 **Systematic root-cause debugging**，而且有一條鐵律：「沒有調查就不要修」。它會追資料流、測假設，並在三次修法失敗後停下來，避免修成補丁疊疊樂。

**適合情境**：不明原因 bug、改一處壞三處、race condition、state mismatch、背景任務偶發失敗、前後端資料格式不一致。

這顆很像在混亂現場拉起封鎖線，先勘驗，再開刀。

---

### 8. `/guard`、`/freeze`：給 AI 上護欄

- **`/freeze`**：把編輯限制在一個目錄
- **`/guard`**：`/careful` + `/freeze`
- **`/unfreeze`**：解除範圍限制

**適合情境**：Debug 單一模組、改正式環境附近程式、有很多關聯檔案但這次只准動一區、不想讓 Claude 順手「幫你整理一下」結果越整理越大包。

---

## 你最該照著走的三條工作流

### 工作流 A：新功能開發

```text
/office-hours
/plan-ceo-review
/plan-eng-review
/plan-design-review   ← 若有 UI
開始實作
/review
/qa
/ship
/land-and-deploy      ← PR 核准後，一路帶到正式環境驗證
/canary               ← 部署後盯一段時間
```

前面三顆規劃審查如果不想一顆一顆跑，可以直接用 `/autoplan` 一次串完，它只會把需要你拍板的取捨拿出來問。

### 工作流 B：改高風險模組

像是支付、登入、授權、排程、交易、資料同步等：

```text
/guard
/plan-eng-review
開始實作
/review
/cso                  ← 碰到金流、登入、權限就補這顆資安審查
/investigate          ← 若測試或驗證時出現不明錯誤
/qa
/ship
```

這條的核心是先加護欄，再做規劃。你不想在 payment 或 auth 模組旁邊讓 Claude 野放。

### 工作流 C：純前端 / UI 優化

```text
/design-shotgun       ← 還沒想好長什麼樣：一次生成多個版本讓你挑
/design-html          ← 挑定的版本變成可上線的 HTML
/plan-design-review
/design-consultation  ← 若要重建整體設計系統
開始實作
/design-review
/qa
```

先補設計規格，再做 live-site 的視覺與互動檢查，最後用 QA 把實際操作流程測一輪。這樣 UI 就不是只修成漂漂亮亮的截圖，而是能真的用。

---

## 新手實戰範例：用 gstack 做一個會員分級功能

### 第一步：先定義真問題

你對 Claude Code 說：

```
我們的電商系統會員分級現在是人工判斷，容易漏升級，客服常常要補發折扣。我要做一個會員分級自動化功能。
/office-hours
```

比較理想的反應，不是立刻幫你寫資料表，而是把問題改寫成：

- 你真正要解的是「會員狀態同步與權益自動觸發」
- 分級邏輯、通知時機、回溯補發、客服 override 權限都要一併考慮
- 可能不只是資料表欄位新增，而是事件驅動流程

### 第二步：收斂 MVP

```
/plan-ceo-review
```

讓它判斷 MVP 是不是只要先做「升級」不做「降級」、是否先不處理歷史資料回補、哪些通知與權益可以第二階段再做。

### 第三步：補工程骨架

```
/plan-eng-review
```

請它產出分級規則資料結構、訂單完成後的觸發時機、同步與非同步邊界、retry / idempotency / audit log、state diagram、test matrix。

### 第四步：做完後先 PR 級審查

```
/review
```

看看有沒有：rule engine 寫死在 controller、邏輯分散、補發機制沒有 transaction 邊界、權益狀態與會員狀態可能不同步。

### 第五步：跑 QA

若有後台設定頁、會員頁、折扣顯示頁：

```
/qa
```

這時它才會真的去看畫面、點流程、找 interaction bug。

<div class="article-part"><span class="article-part-num">四</span><span class="article-part-title">新版變化與實務建議</span></div>

## 2026 年 8 月更新：這半年多出來的東西

本文首發時 gstack 大約二十顆技能，現在官方清單上有三十幾顆、repo 裡的目錄超過五十個。如果你是三月看過這篇、現在回來複習，下面這幾件事最值得知道。

### 1. 規劃可以一鍵串完

`/autoplan` 把 CEO、設計、工程三道規劃審查自動接起來，只在需要你決定品味與取捨時才停下來問。另外多了 `/spec`，專門把「我大概想做這個」變成一份能直接交給 AI 執行的規格，還會先用 Codex 打分數當關卡，太粗糙就不准存檔。

### 2. 出貨不再停在開 PR

以前流程走到 `/ship`（開 PR）就結束了。現在後面接得上：`/land-and-deploy` 把「PR 已核准」一路帶到「正式環境已驗證」，`/canary` 在部署後持續盯 console 錯誤與效能退化，`/benchmark` 則負責量頁面載入速度與 Core Web Vitals，做前後對照。第一次用 `/land-and-deploy` 前要先跑一次 `/setup-deploy` 設定你的平台與正式站網址。

### 3. 資安變成一個獨立角色

新增 `/cso`（資安長）：跑 OWASP Top 10 加 STRIDE 威脅模型，每個發現都要求附上具體的攻擊情境，並用信心門檻與誤報排除清單壓低雜訊。碰金流、登入、權限、檔案上傳的功能，這顆值得固定跑。

### 4. 設計從「審查」延伸到「生成」

以前設計類只有審查（`/plan-design-review`、`/design-review`）。現在多了兩顆做東西的：`/design-shotgun` 一次生成 4 到 6 個視覺版本、開一個比較面板讓你挑，還會記住你的偏好；挑定之後交給 `/design-html` 變成可上線的 HTML，而不是只能看的示意圖。

### 5. 開發者體驗自成一軸

如果你做的是 API、CLI、SDK 或文件，使用者是工程師而不是一般人，那就換另一組：規劃階段用 `/plan-devex-review`，做完用 `/devex-review` 真的照文件走一次上手流程、計時、截圖失敗處，再回頭跟當初的評分對照。

### 6. 它開始記得你的專案

`/learn` 管理 gstack 跨 session 累積的東西——這個 repo 的慣例、踩過的雷、你的偏好，可以檢視、搜尋、清掉。另外還有 `/context-save`、`/context-restore` 與可選的連續存檔模式：開啟後 AI 會邊做邊自動提交進度（訊息前綴 `WIP:`，並附上決策、剩餘工作、失敗過的做法），電腦掛掉或換手時能還原現場，`/ship` 會在開 PR 前把這些 WIP 提交壓成一筆。

### 7. 不再只服務 Claude Code

現在支援十種 AI coding agent（Codex、Cursor、OpenCode、Hermes、Kiro 等），另有 `/pair-agent` 可以把同一個瀏覽器分享給多個 AI 代理、各自開自己的分頁。另外多了一整組 iOS 實機測試技能（`/ios-qa`、`/ios-fix`、`/ios-design-review` 等），能透過 USB 驅動真的 iPhone 做測試——不做 iOS 可以直接跳過。

### 8. 順手提一下隱私

gstack 有使用統計，但**預設關閉**，第一次執行會問你要不要開；開了也只送技能名稱、耗時、成功失敗、版本與作業系統，不送程式碼、路徑、repo 名稱或你的提示詞。想關掉隨時 `gstack-config set telemetry off`。這點值得知道，因為導入團隊時一定有人會問。

---

## gstack 最容易踩的坑

**1. 把它當超大 prompt 包**
gstack 的強項是分工與節奏，不是「每顆 skill 都超神」。

**2. 需求很模糊，卻跳過 `/office-hours`**
這樣後面就像把房子蓋在鬆沙上，看起來搭起來了，踩上去會陷。

**3. 還沒規劃就急著 `/ship`**
`/ship` 是收尾與出貨，不是替你代替思考。

**4. UI 專案只做 `/review`，沒做 `/qa` 或 `/design-review`**
很多問題不在 code diff 裡，而是在真實操作裡。

**5. Debug 時不開 `/freeze` 或 `/guard`**
AI 很容易看你桌上亂，就順手把隔壁房間也掃了。

**6. 一次把所有 skill 都用滿**
新手最好的節奏不是「全餐」，而是先練熟核心幾顆。

---

## 新手最推薦先熟的 5 顆

如果你今天剛開始用 gstack，我最建議先把這 5 顆練熟：

1. `/plan-eng-review`
2. `/review`
3. `/qa`
4. `/investigate`
5. `/guard`

原因很單純，這 5 顆最直接對應 AI 開發最常見的風險：規劃不夠硬、merge 前缺少結構檢查、網頁實際沒測、出 bug 時只會亂修、改動範圍失控。

等這套順了，再加入 `/office-hours`、`/plan-ceo-review`、`/ship` 與設計系 skills，會更有感。想省事的話，`/autoplan` 可以直接替你把規劃那幾顆串起來；做的東西碰到金流或登入，再加一顆 `/cso`。

---

## 常見問題

**Q1：gstack 會不會取代你自己思考？**
不會。它比較像幫你建立一套「該在什麼時候用哪種思考」的節奏。真正的判斷仍然要你做，尤其是產品取捨、商業決策、系統風險接受度。

**Q2：我只是寫小功能，也需要整套流程嗎？**
不一定。小功能可以簡化成：

```text
/plan-eng-review → 開始做 → /review
```

若有 UI，再補 `/qa`。gstack 最重要的是節奏感，不是每次都要滿漢全席。

**Q3：skills 沒有出現怎麼辦？**
先到安裝目錄重新跑 `./setup`。若 `/browse` 有問題，可再跑 `bun install && bun run build`。若是安裝過舊，可用 `/gstack-upgrade`，或在 `~/.gstack/config.yaml` 開啟 `auto_upgrade: true`。Windows 沒開開發者模式的話，還要記得每次 `git pull` 後重跑一次 `./setup`（原因見上面安裝那節）。

**Q4：我還裝了別的技能包，指令名稱會不會撞？**
會，所以官方留了開關。`./setup --prefix` 會把指令改成 `/gstack-qa` 這種帶前綴的名字，`./setup --no-prefix` 則改回 `/qa`。選過一次之後，後續升級會記住你的選擇。

**Q5：怎麼知道自己現在是哪一版？**
安裝目錄下的 `VERSION` 檔就是版本號，也可以直接跑 `/gstack-upgrade` 讓它告訴你差了什麼。本文更新時的最新版是 v1.60.2.0。

---

## 我的實務建議：把 gstack 當成團隊開發規範

如果你只是自己玩，gstack 已經很好用；但它真正發光，是當你把它變成團隊共識的一部分。你可以在 repo 的 `CLAUDE.md` 明確規定：

- 新功能開始前至少跑一次 `/plan-eng-review`
- UI 變更必跑 `/qa`
- merge 前必跑 `/review`
- 高風險模組先 `/guard`
- 不明 bug 先 `/investigate`
- release 時讓 `/ship` 帶著 `/document-release` 一起收尾

這樣一來，gstack 就不是「某個人偷偷在用的神奇技能」，而是一條大家都知道怎麼走的開發道路。

---

## 結語

gstack 最值得學的地方，不是它有幾顆指令，也不是哪一顆最炫，而是它把 Claude Code 從「很會寫東西的 AI」變成「有工序、有守門員、有驗證習慣的 AI 開發流程」。

你可以把它想成替 Claude Code 裝上一條生產線。不是讓它寫得更快而已，而是讓它**更像一個能交付的工程團隊**。

---

## 參考來源

以下連結於 2026 年 8 月 8 日重新核對，對照版本為 gstack v1.60.2.0。

- [gstack README — 安裝、技能列表、Troubleshooting](https://github.com/garrytan/gstack/blob/main/README.md)
- [gstack ARCHITECTURE — persistent browser 與長駐 Chromium daemon 設計](https://github.com/garrytan/gstack/blob/main/ARCHITECTURE.md)
- [gstack docs/skills — `/plan-eng-review`、`/plan-design-review`、`/review` 定位與方法](https://github.com/garrytan/gstack/blob/main/docs/skills.md)
- [gstack AGENTS.md — 以 SKILL.md 組成的 AI engineering workflow](https://github.com/garrytan/gstack/blob/main/AGENTS.md)
