---
title: "gstack 教學：把 Claude Code 變成完整的 AI 開發工作流"
seo_title: "Claude Code 教學：用 gstack 打造完整 AI 開發工作流"
date: 2026-03-22 00:00:00 +0000
categories: [claude-code]
layout: article
nav_active: education
cover_image: /assets/img/linkedin/gstack-workflow-guide.svg
hero_image: true
description: "gstack 不是一包 prompt，而是一套把 AI 開發流程角色化、階段化的工作流。從需求定義、工程規劃、PR 審查、QA 測試到出貨，每個階段都有明確分工的 slash commands。"
keywords: gstack,Claude Code,AI工作流,開發流程,AI工具,AI學習,史旺基,Swanky Studio
---

很多人第一次接觸 Claude Code 時，會把它當成一個很會寫程式的聊天視窗。這樣用不是不行，但常常會遇到同樣幾個問題：

- 前面需求沒想清楚就開始做
- 做到一半 scope 越長越歪
- 程式碼能跑，但結構、測試、邊界條件沒顧好
- UI 看起來像能用，實際互動一測就破功
- merge 前沒人幫你當最後一道守門員

**gstack** 的價值，就在於它不是單一 prompt，也不是一包零散工具，而是一套把 AI 開發流程角色化、階段化的工作流。官方 repo 把它描述為 Garry Tan 的 Claude Code 設定，包含多個具明確分工的 skills，從產品思考、工程規劃、設計審查、PR review、QA 到 release 文件同步，都有對應的 slash commands。

---

## 什麼是 gstack？

gstack 是一組依照 **SKILL.md** 規範組成的工作流技能包，設計理念很明確：讓 AI 在不同階段切換不同角色，而不是永遠只用同一種思考模式處理所有事情。代表性的 slash commands 包含 `/office-hours`、`/plan-ceo-review`、`/plan-eng-review`、`/plan-design-review`、`/review`、`/investigate`、`/qa`、`/ship`、`/document-release` 等。

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

---

## 安裝前你要先知道的事

gstack 的基本需求包含 Claude Code、Git、Bun v1.0+，**Windows 額外需要 Node.js**。Windows 11 可透過 Git Bash 或 WSL 使用；由於 Bun 在 Windows 上對 Playwright pipe transport 有已知問題，瀏覽器伺服器會自動 fallback 到 Node.js，所以 `bun` 與 `node` 都要在 PATH 上。

對 Windows 使用者來說，這段很關鍵。你可以用 Git Bash，但若你本來就會在 Claude Code 裡跑不少 CLI 與瀏覽器自動化，**WSL 通常會更穩**。

---

## 安裝方式

### 1) 安裝到你的 Claude Code 全域技能目錄

```bash
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack
./setup
```

### 2) 把 gstack 加進目前專案（讓團隊成員也能用）

這是把實體檔案直接放進 repo，而不是 submodule，因此團隊成員 `git clone` 後就能直接拿到：

```bash
cp -Rf ~/.claude/skills/gstack .claude/skills/gstack
rm -rf .claude/skills/gstack/.git
cd .claude/skills/gstack
./setup
```

### 3) 其他 agent host

gstack 可用在支援 **SKILL.md standard** 的其他 agent host（如 Codex），並支援 `./setup --host auto` 自動偵測環境。

---

## `CLAUDE.md` 要怎麼寫？

如果 Claude 說它看不到 skills，除了重新跑 `./setup`，也要確認你的 `CLAUDE.md` 有一段 gstack 區塊：

```md
## gstack
Use /browse from gstack for all web browsing. Never use mcp__claude-in-chrome__* tools.
Available skills: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review,
 /design-consultation, /review, /ship, /browse, /qa, /qa-only, /design-review,
 /setup-browser-cookies, /retro, /investigate, /document-release, /codex, /careful,
 /freeze, /guard, /unfreeze, /gstack-upgrade.
```

這段看起來像在幫 Claude 做點名，其實是很實際的「操作手冊提示」。Skill 存在，不代表模型每次都會主動想到它；寫進 `CLAUDE.md`，相當於把「這個 repo 的工作規則」固定下來。

---

## 先理解 gstack 的四大層次

在真正開始用之前，建議先把 gstack 分成四層來理解，才不會看到二十幾個指令像工具箱爆開。

### 一、需求與產品定義層

負責回答「我們到底要做什麼？」

- **`/office-hours`** — 從這裡開始。用六個強迫思考問題重新框定產品，挑戰前提，生成替代方案。
- **`/plan-ceo-review`** — 站在 CEO / Founder 視角重新看需求，找出更高價值的版本。支援擴張、收斂、維持 scope、縮減等模式。

### 二、工程與設計規劃層

負責回答「要怎麼做才做得出來？」

- **`/plan-eng-review`** — 聚焦 architecture、system boundaries、data flow、state transitions、failure modes、edge cases、trust boundaries 與 test coverage。強調要畫 diagrams，把模糊假設逼出來。
- **`/plan-design-review`** — 用 0 到 10 的評分法檢查設計方案，說明怎樣才算 10 分，然後直接把 plan 修到更接近 10。
- **`/design-consultation`** — 偏向從零建立設計系統與方向。

### 三、實作後檢查與驗證層

負責回答「做完之後真的安全嗎？」

- **`/review`** — pre-landing PR review，對 diff 做結構性檢查，包含 SQL safety、LLM trust boundary violations、conditional side effects 等。
- **`/qa`** — 測 app、找 bug、修 bug、自動產生 regression tests，再驗證。
- **`/qa-only`** — 相同方法，但只出 bug report 不動程式碼。
- **`/design-review`** — 用設計審查的思維去檢查 live site，再修掉問題。

### 四、安全與收尾層

負責回答「怎麼避免 AI 改過頭，並把專案收乾淨？」

- **`/investigate`** — root-cause debugging，強調「沒有調查就不要修」，若連續三次修法失敗就停止亂補。
- **`/document-release`** — 比對 diff 去修 README、ARCHITECTURE、CONTRIBUTING、CLAUDE.md 等文件漂移。`/ship` 會自動呼叫它，讓出貨同時同步文件。
- **`/freeze`** — 把改動限制在單一目錄。
- **`/guard`** — 結合 `/careful` 和 `/freeze`，適合高風險環境。

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
```

### 工作流 B：改高風險模組

像是支付、登入、授權、排程、交易、資料同步等：

```text
/guard
/plan-eng-review
開始實作
/review
/investigate          ← 若測試或驗證時出現不明錯誤
/qa
/ship
```

這條的核心是先加護欄，再做規劃。你不想在 payment 或 auth 模組旁邊讓 Claude 野放。

### 工作流 C：純前端 / UI 優化

```text
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

等這套順了，再加入 `/office-hours`、`/plan-ceo-review`、`/ship` 與設計系 skills，會更有感。

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
先到安裝目錄重新跑 `./setup`。若 `/browse` 有問題，可再跑 `bun install && bun run build`。若是安裝過舊，可用 `/gstack-upgrade`，或在 `~/.gstack/config.yaml` 開啟 `auto_upgrade: true`。

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

- [gstack README — 安裝、技能列表、Troubleshooting](https://github.com/garrytan/gstack/blob/main/README.md)
- [gstack ARCHITECTURE — persistent browser 與長駐 Chromium daemon 設計](https://github.com/garrytan/gstack/blob/main/ARCHITECTURE.md)
- [gstack docs/skills — `/plan-eng-review`、`/plan-design-review`、`/review` 定位與方法](https://github.com/garrytan/gstack/blob/main/docs/skills.md)
- [gstack AGENTS.md — 以 SKILL.md 組成的 AI engineering workflow](https://github.com/garrytan/gstack/blob/main/AGENTS.md)
