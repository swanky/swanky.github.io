---
title: "Bot Mode 不是多開幾個聊天視窗：AI Agent 正從 Session 走向有名字的長期同事"
seo_title: "Hermes Bot Mode 深度解析：Profile、Group Chat、Routine 與 AI Agent 團隊"
date: 2026-08-25
published: true
categories: [technical]
tags: [hermes-agent, bot-mode, ai-agent, multi-agent, agentic-engineering, grok-bot, claude-code, codex, ai-engineering]
layout: article
cover_image: /assets/img/linkedin/hermes-bot-mode-persistent-ai-team.jpg
cover_alt: "水手服 AI 系統工程師在自架控制室裡協調研究、開發、驗證與排程四個具名 Bot，並以安全邊界與人類核准 Gate 控制外部動作"
cta_context: agentic
related_posts:
  - ai-agent-surgical-team
  - matt-pocock-skills-ai-coding-workflow
  - ai-executor-orchestrator
hero_image: true
description: "Hermes Bot Mode 把 Profile 變成有名字、記憶、技能、模型與排程的長期 AI 角色。本文從底層架構、群組協作、安全邊界到 Grok Bot、Claude Code 與 Codex 的產品路線，分析 Identity-centric Agent 為什麼值得注意。"
keywords: Hermes Bot Mode, Hermes Agent, Grok Bot, Claude Code Agent Teams, Codex Goal Mode, AI Agent, Multi-Agent, Persistent Agent, Profile, Routine, 史旺基
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>Bot Mode 不是多開幾個聊天視窗</strong>：在 Hermes 裡，Bot 就是一個 Profile，角色、模型、記憶、技能、工具、對話與排程都能長期保留。</li>
    <li><strong>真正的改變是持久化對象</strong>：Grok Bot／Hermes 把「那位 AI 同事」放在首頁；Claude Code／Codex 仍更常從專案 Session、Task 或 Goal 出發。</li>
    <li><strong>持久化不等於自治，更不等於隔離</strong>：Hermes Profile 不是 filesystem sandbox；Grok Bots 也共用同一台帳號層級的 cloud computer。</li>
    <li><strong>我看好的不是 AI 公司幻想</strong>：比較合理的架構，是少數長期角色負責脈絡與責任，再召喚一次性 workers 執行；這不是 Hermes 內建的安全保證，我會要求高風險外部動作另外通過可驗證的 Gate。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">先搞懂 Bot Mode 改了什麼</span>
      <ol class="article-toc-items">
        <li><a href="#sidebar">AI 公司先長在左側欄裡</a></li>
        <li><a href="#identity">從 Session-centric 到 Identity-centric</a></li>
        <li><a href="#profile">底層沒有魔法：Bot 就是 Profile</a></li>
        <li><a href="#collaboration">Bot 怎麼聊天、交接與定期工作</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">再看它的邊界與下一步</span>
      <ol class="article-toc-items">
        <li><a href="#comparison">Grok Bot、Hermes、Claude Code、Codex 差在哪</a></li>
        <li><a href="#security">最危險的誤會：Profile 不是 Sandbox</a></li>
        <li><a href="#trend">Persistent Agent 會把什麼問題放大</a></li>
        <li><a href="#playbook">如果是我，我會先做四個角色</a></li>
      </ol>
    </li>
  </ol>
</nav>

## AI 公司先長在左側欄裡 {#sidebar}

這幾天我收到一封介紹 Hermes Bot Mode 的 newsletter，標題大意是：「一支免費、而且真正屬於你的 AI 團隊。」

我第一個反應其實不是興奮，而是有點想笑。AI 公司終於從簡報裡走出來了，只是暫時還沒有辦公室，先長在 Desktop 左側欄裡。

但我把 [Hermes Bot Mode 官方文件](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode)、Profile、Cron 與跨機器通訊機制重新看過一輪，再對照 Grok Bot、Claude Code 與 Codex，發現這次不只是換皮。

我自己的 Hermes 已經開啟 Bot Mode protocol，但 roster 目前仍只有一個 `default`。這個狀態反而很誠實：**功能存在，不代表團隊已經被設計出來。**

多開十個聊天視窗很容易。困難的是：每個角色該記得什麼、能碰什麼、何時交接、出了事由誰負責。

Bot Mode 真正改變的，是這個問題開始被放進產品的核心。

## 從 Session-centric 到 Identity-centric {#identity}

過去使用 AI 工具，我們通常從一件工作開始：

```text
開一段對話
  ↓
描述任務
  ↓
Agent 執行
  ↓
拿回結果
  ↓
Session 慢慢被遺忘
```

就算背後有 Subagent，它們通常也是為了眼前工作臨時被叫進來，做完再把結果交回主 Agent。

Bot Mode 把順序反過來：

```text
先建立一個長期角色
  ↓
配置責任、模型、記憶、Skills、Tools、Routines
  ↓
不同任務持續交給「同一個角色」
  ↓
角色累積脈絡，並與其他角色交接
```

最大的差異不是「有沒有 Multi-Agent」。Claude Code、Codex 早就能平行派出 Subagents。

真正的問題是：**工作做完後，系統主要留下的是那個 Task，還是那個人？**

這不是純粹的 UI 差異。持久化對象一變，使用者就會開始替 Agent 設計職責、權限、升級路徑、例行工作與協作關係。原本是 Prompt Engineering 的東西，慢慢變成 Organization Design。

## 底層沒有魔法：Bot 就是 Profile {#profile}

Nous 官方對 Hermes Bot Mode 的定義很直接：

> A Bot is a profile.

Hermes 原本就有 Profile。每個 Profile 都有自己的狀態目錄，裡面可以放：

```text
~/.hermes/profiles/researcher/
├─ config.yaml       # 模型、工具與執行設定
├─ .env              # 憑證設定
├─ SOUL.md           # 角色與長期指令
├─ memories/         # 持久記憶
├─ skills/           # 可重用程序
├─ sessions/         # 對話與工作脈絡
└─ cron/             # 排程工作
```

Bot Mode 做的，是把這些 Profile 正式包裝成一份有名字、頭像、職稱與描述的 roster。Desktop 只是控制面；CLI 看到的是同一個底層 Agent：

```bash
hermes -p researcher chat
hermes profile list
hermes cron list
```

在建立 Bot 時，可以選擇：

- 從既有 Profile 複製 config、Skills、SOUL 與 Memory。
- 建立新的 Fresh Profile。
- 用 Create empty 跳過預載 Skills，從最小能力開始。
- 為每個 Bot 綁定不同 Provider／Model。
- 分別開啟 Skills、Toolsets 與 MCP Servers。
- 設定自訂 SOUL.md。
- 建在本機、遠端 Gateway、SSH 主機或 Hermes Cloud instance。

Bot 的生命週期也和一般 Session 不一樣。右鍵可以 Duplicate、Hide 或 Delete：Duplicate 會複製 config、Skills、SOUL、Memory 與外觀，但不會複製來源對話；Hide 只把它收起來，Group membership、@mention 與 Routine 不受影響；Delete Profile 則是真正的破壞性刪除，而且 default Profile 不能刪。名稱、職稱與 description 有助於人類與其他 Bot 判斷「該找誰」，卻不構成權限控制。[[1]](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode#the-bots-pane)

換句話說，Bot Mode 沒有再造一套 Agent runtime。它把原本分散在 Profile、Memory、Skills、Cron、Gateway 裡的能力，整理成一個人比較容易理解的角色模型。Hermes v0.20.3 在 2026 年 8 月 16 日把 Bot Mode plugin 與 teammate protocol 正式 bundle 進穩定版，也是因為底層原本就已經存在，不需要再發明一個平行世界。[[3]](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.16.2)

這裡還要補一個版本陷阱。Hermes 線上文件追蹤 `main`，而 8 月下旬的 structured `message_agent`、完整跨 Gateway relay 與 typed failure reasons，有些是在當時最新正式 release 之後才合併。以下分析的是 2026 年 8 月 25 日官方文件呈現的 current design；實際操作前，仍要以安裝版本與 release notes 為準。把 `main` 上的文件直接當成每台舊 Desktop 都已經有，會是另一種很 Agentic 的自信錯誤。

<figure>
  <a href="{{ '/assets/img/technical/hermes-bot-mode/bot-profile-anatomy.svg' | relative_url }}">
    <img src="{{ '/assets/img/technical/hermes-bot-mode/bot-profile-anatomy.svg' | relative_url }}" alt="Hermes Desktop 與 CLI 共用 Bot Profile；Profile 內包含身份、模型、SOUL、記憶、Skills、Tools、MCP、Bot Chat 與 Routines。Profile 分開狀態但 OAuth 或 token pool 可能共享，而且不構成檔案系統沙箱" loading="lazy">
  </a>
  <figcaption>Bot Mode 是既有 Profile 的控制面。點圖可開啟原尺寸；最下方的安全邊界比上面的可愛 roster 更重要。</figcaption>
</figure>

### Bot Chat 是一段不輕易結束的關係

每個 Bot 建立時，都會同時產生一個 canonical Bot Chat。它不是普通工作 Session，而是那個角色的持久主對話。

官方甚至刻意攔截這個聊天裡的 `/new` 與 `/reset`，改成 `/compact`：清掉過重的工作上下文，但不把關係 fork 成另一段 Session。[[1]](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode#creating-a-bot)

這個設計很有意思。它承認長期角色需要連續性，也承認 context window 不可能無限成長。

持久記憶不是把所有聊天永遠塞進 Prompt，而是知道什麼該保留、什麼該壓縮、什麼已經過期。這部分做不好，所謂的「長期同事」很快就會變成一位記得很多過時規則、但每天都很有自信的老員工。這種人類已經夠多了，沒必要再自動生成一批。

## Bot 怎麼聊天、交接與定期工作 {#collaboration}

Bot Mode 目前有三種主要協作形態。

### 1. 直接 @mention：把工作交給具名角色

你可以在 Bot Chat 裡輸入：

```text
@researcher 查核這個技術宣稱，再把來源交給 @writer。
```

這裡不是單純把文字複製到另一個聊天室。Hermes 會先從 live roster 解析對象，把 profile、friendly name 與所在裝置交給目前的 Bot，再由它自行組成訊息，透過：

```text
message_agent(target="researcher", message="...")
```

送進對方的 canonical Bot Chat。

`message_agent` 會驗證 target、補上 sender attribution，並以 fire-and-forget 方式執行。發送者先拿到 acknowledgement；接收者完成後，回覆再以背景通知送回來。目前也不會在另一位 Bot 正工作到一半時硬插話，而是在它下一次 invocation 接收訊息。這個工具只存在於 Bot Mode 管理的 canonical Bot Chat，不會突然出現在所有一般 Session。[[1]](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode#bot-to-bot-messaging)

這些細節看似瑣碎，卻是在回答一個真正的分散式系統問題：誰傳的、傳給誰、失敗能不能重試、同名角色在不同機器上怎麼辨認、對方離線時怎麼回報。

### 2. Group Chat：有限回合的多 Agent 討論

Hermes 的 Group Chat 不是讓一群模型無限互相稱讚。

目前規則是：

- 一個 Room 可放 2–6 個 Bots。
- 每次使用者訊息最多跑三輪 serial rounds。
- 每次 send 最多產生十則 Bot 訊息。
- 指定 `@mention` 時，只叫被點名的成員；沒指定才讓所有成員判斷要不要回答。
- Bot 可以選擇 pass，不必每個人都講話。
- Bot 可用 `@user` 把需要人類判斷的問題標成 needs you。
- 每位成員都有自己的 `Group: <name>` 持久 Session。

這些限制與協調行為都是 Desktop coordinator 的明確規則，不是靠 Prompt 拜託 Bots 自律。[[1]](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode#groups-and-group-chats)

完整 orchestration log 留在 Desktop 本機；Gateway 只取得有界的近期 transcript projection。這能降低各成員各自保留一套分歧群聊歷史的風險，但也表示 Gateway 上看到的內容不一定是完整稽核紀錄。

這個 hard cap 很重要。Multi-Agent 最容易出現的假象，就是大家都有說話，所以看起來很忙；Token 也真的有燒掉，但沒有多產生一個可驗證的判斷。

我會把 Group Chat 留給真正有衝突的工作，例如架構取捨、風險反證與內容審稿。單純交接，直接 @mention 就好。

### 3. Routine：把已經做對的流程交給 Cron

Bot 的 Routine 本質上就是 Hermes Cron job。Desktop 會把它顯示在 Bot 旁邊，但 CLI 仍能在 `hermes cron list` 看到。真正執行排程的是 Gateway daemon；scheduler 約每 60 秒 tick 一次，每次 run 都是新的 isolated Agent Session，Prompt 仍要能自足。[[13]](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)

這表示 Routine 可以沿用既有排程能力，而不是另外養一套自動化系統。它也有一個很容易忽略的行為：**隱藏 Bot 只是不顯示，@mention、Group membership 與 Routine 都會繼續運作。**[[1]](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode#routines)

因此 Routine 適合：

- 每日新聞與技術掃描。
- 定期價格或網站狀態監測。
- 每週內容整理與研究摘要。
- 測試、報告或資料清理等可重複流程。

但「Bot 還在 roster」與「工作能永遠跑」是兩件事。Hermes 不會憑空替你提供一台永不關機的主機；Gateway、scheduler 與所在機器仍要運作。跨機器 DM 若走 Desktop relay，也需要同時認得兩端的 Desktop 保持連線；真正 always-on 的 peer-to-peer 路徑，則要另外設定 Gateway API、網路可達性與強金鑰。[[1]](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode#messaging-across-connected-machines-the-desktop-relay)

<figure>
  <a href="{{ '/assets/img/technical/hermes-bot-mode/safe-collaboration-loop.svg' | relative_url }}">
    <img src="{{ '/assets/img/technical/hermes-bot-mode/safe-collaboration-loop.svg' | relative_url }}" alt="作者建議的 Bot Mode 控制架構：人類先定義風險，讓具名 Bot 依工作選擇直接交接、有限回合群組討論或排程；輸出再通過確定性檢查、證據與獨立審查，以及人類核准" loading="lazy">
  </a>
  <figcaption>作者建議的控制架構，並非 Hermes 內建強制流程。長期身份保存脈絡、責任與能力設定，但本身不構成權限或核准邊界。點圖可放大。</figcaption>
</figure>

## Grok Bot、Hermes、Claude Code、Codex 差在哪 {#comparison}

把這四個產品放在一起看，很容易陷入功能表格：誰有 Subagent、誰有排程、誰能開 Terminal。

我覺得更有用的問題仍然是：**系統主要把什麼當成長期存在的第一級物件？**

<figure>
  <a href="{{ '/assets/img/technical/hermes-bot-mode/identity-vs-task-model.svg' | relative_url }}">
    <img src="{{ '/assets/img/technical/hermes-bot-mode/identity-vs-task-model.svg' | relative_url }}" alt="截至 2026 年 8 月 25 日，作者依主要產品入口把 Grok Bot 與 Hermes 歸為 Identity-first，把 Claude Code 與 Codex 歸為 Work-first；這是定性分組，不是能力排行或等距尺度" loading="lazy">
  </a>
  <figcaption>作者依 2026 年 8 月 25 日的產品入口做定性分組；位置不代表分數或距離。四者都有重疊能力，也仍在快速互相靠近。點圖可開啟原尺寸。</figcaption>
</figure>

| 產品 | 主要持久化對象 | 協作方式 | 執行環境與取向 |
|---|---|---|---|
| Grok Bot | 具名 Bot、account-wide Skills、Bot-owned Routines | Bots 交接與協作 | 託管式 persistent cloud computer；所有 Bots 共用帳號層級的檔案、登入與 CLI credentials |
| Hermes Bot Mode | Profile、Bot Chat、Memory、Cron | @mention、DM、有限回合 Group Chat、跨機器 peer | Local／Remote Gateway／SSH／Cloud；模型、SOUL、Skills、Tools、MCP 可自行配置 |
| Claude Code | 專案 Session 與可重用 Agent definition | Subagents；experimental Agent Teams 可共用 Task List、互相傳訊 | 以 Coding workflow 為核心；Agent Team 通常隨 lead session 結束 |
| Codex | Chat、Goal、Task、可選的跨 Chat Memories | 主 Agent 協調平行 Subagents | CLI／IDE／Desktop／Cloud；以完成條件與可驗收成果收斂 |

### Grok Bot：託管式 AI 辦公室

xAI 官方把 Grok Bot 定義為長期存在的 AI teammate。每個 Bot 有自己的畫面，可以使用 Browser、Apps、Terminal 與 Files；不同 Bots 能交接工作、保存 Skills、建立排程或事件觸發的 Routines。背景 Routine 即使筆電闔上仍可運作。[[4]](https://docs.x.ai/grok-bot/overview)[[5]](https://docs.x.ai/grok-bot/skills-routines-and-automations)

但官方也講得很清楚：同一個帳號下的所有 Bots 共用一台 persistent cloud computer。檔案、瀏覽器 Session、App login 與 command-line credentials 都對整個 roster 可見。每個 Bot 有自己的 screen，卻不是自己的 security boundary。[[6]](https://docs.x.ai/grok-bot/approvals-security-and-privacy#understand-the-shared-computer-boundary)

Skills 與 Connectors 也是 account-wide library，不是每個 Bot 各自擁有的隔離資產；底層模型由產品選擇並可自動 failover，沒有使用者 model picker。它的優勢是省事，代價是控制面與資料邊界交給託管平台。[[14]](https://docs.x.ai/grok-bot/computer-and-apps)

### Hermes Bot Mode：自己組裝 AI 組織

Hermes 的優勢不是「免費 Grok Bot」。軟體本身是開源的，但模型 API、搜尋、影像生成、主機、GPU 與維運時間都會花錢。

真正差異是它把選擇權留給你：Bot 可以用不同模型、住在不同機器、擁有不同 SOUL 與工具組合，還能從 CLI 直接操作同一個 Profile。

控制力比較高，表示你也得自己承擔架構、監控、憑證與復原。自架從來不是免費，它只是把帳單從訂閱費拆成更多欄位。

### Claude Code：為專案臨時組成的工程 Tiger Team

Claude Code 的 Custom Subagents 可以保存角色定義、工具與權限；Agent Teams 則讓 Team Lead 建立多個獨立 Session、共用 Task List，並讓 teammates 彼此傳訊。目前官方仍把 Agent Teams 標成 experimental、預設關閉，而且只在 CLI 提供，不是 Claude Desktop 功能。每個 teammate 都是獨立 Claude instance，Token 成本也會隨成員數增加。[[7]](https://code.claude.com/docs/en/sub-agents)[[8]](https://code.claude.com/docs/en/agent-teams)

它很像為眼前 Repository 召集一支工程小隊。Agent definition 與 shared task list 可以留下，但 live Team runtime 會隨 Session 結束；in-process teammates 也不會靠 `/resume` 自動復活。這不是整間公司的長期 roster。

### Codex：把 Goal 做到可驗收

Codex 的 `/goal` 可以把長工作整理成有 title、spec 與 acceptance criteria 的持久目標，在 CLI、IDE 或 Desktop 中繼續、暫停與恢復。Subagents 則能在平行 threads 研究、實作與測試，再把結果帶回主 thread；目前官方描述的是由主 Agent 集中協調，而不是像 Claude Agent Teams 那樣讓 peers 共用 Task List、互相接管 lead。[[9]](https://developers.openai.com/codex/long-running-work)[[10]](https://developers.openai.com/codex/subagents)

Codex 也有預設關閉的 Memories，可跨 Chats 保存偏好與背景。不過官方把它定位成 recall layer，而不是權威規則來源；更高優先級的 system、developer、AGENTS.md 與當前 Prompt 仍會覆蓋它。這讓 Codex 並非「完全沒有長期脈絡」，只是產品入口仍從 Chat／Goal 開始，而不是先建立一位具名 teammate。[[16]](https://learn.chatgpt.com/docs/customization/memories)

所以 Codex 給我的感覺不是「Bob 今天又來上班」，而是「Goal #381 還沒 Done」。Goal 屬於那一個 Chat；它可以保存與恢復工作條件，卻不是跨任意 Chat、專案與排程都存在的角色身份。Codex 持久化的是工程承諾與完成條件，而不是先替執行者建立人格。

這四者其實沒有誰會把誰完全取代。比較可能的組合，是 Hermes／Grok Bot 保存長期責任與脈絡，Claude Code／Codex 類型的 workers 負責一次性、可平行、可驗收的工程執行。

## 最危險的誤會：Profile 不是 Sandbox {#security}

Bot Mode 的介面很像組織圖，很容易讓人誤以為每個 Bot 也像部門一樣有自己的門禁。

沒有。

Hermes 官方 Profile 文件明確區分三件事：

- Profile：隔離 config、Memory、Sessions、Skills、Cron 與 Gateway state。
- Workspace：Terminal 從哪個目錄開始。
- Sandbox：Agent 實際能存取哪些檔案與系統資源。

在預設 `local` terminal backend 下，Agent 仍然沿用執行 Hermes 的 OS 使用者權限。設定 `terminal.cwd` 只決定起始位置，不會阻止它走到其他資料夾；SOUL.md 裡寫「不要碰」也不是防火牆。[[2]](https://hermes-agent.nousresearch.com/docs/user-guide/profiles#profiles-vs-workspaces-vs-sandboxing)

另外，Desktop 建立新 Bot 時，預設可能共享主要 Profile 的 OAuth／token pool。Clone 更會把 config、Skills、SOUL 與 Memory 一起帶過去。[[1]](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode#creating-a-bot)

所以敏感用途不能只靠換名字與頭像隔離。Fresh Profile 會有乾淨的 Session 與 Memory，但仍可能沿用目前的 Provider、API key 或 shared OAuth pool；「狀態是新的」不代表「身份與憑證也是新的」。我會要求：

1. 用 Create empty 建最小 Bot，不做 full Duplicate；需要的 Skills 再逐一加回。
2. 另行配置用途專屬的 Credentials／Gateway，不把 shared token pool 當成隔離；Host 上的 CLI Credentials 也要配合 `terminal.home_mode: profile` 或更強的 OS 邊界。
3. 只開必要的 Toolsets、Skills 與 MCP Servers。
4. 不需要 Terminal 的角色就不要給 Terminal。
5. 真正敏感的執行放進 Container、VM 或權限受限的遠端 Backend。
6. 發布、Merge、刪除、付款、寄信與 Production 修改，一律經人類核准。
7. 公司資料與個人 Agent 完全分開，不把內部 Email、Slack、程式碼或 Credentials 丟進個人 Bot。

Persistent identity 會讓 Agent 比一次性 Session 更好用，也會讓錯誤權限活得更久。

## Persistent Agent 會把什麼問題放大 {#trend}

我認為 2026 年 Agent 工具確實正在從 Session-centric 往 Identity-centric 移動，但下一個競爭點不會只是「誰能養更多 Bots」。

### 1. Context 會從資產變成負債

長期角色可以累積偏好、歷史與工作方法，這是它的價值。但錯誤記憶、過期 Skill、失效 Connector 與曾經合理的決策，也會一起留下。

一次性 Agent 做錯一次就結束；Persistent Agent 可能把同一個錯誤變成每週 Routine。

未來需要的不只是 Memory，而是 Memory lifecycle：來源、時效、衝突、刪除、回滾與責任人。

### 2. Agent 通訊會變成新的分散式系統

一旦 Bots 可以跨機器、跨 Gateway、非同步交接，就會碰到我們早已熟悉的問題：重試、冪等性、重複訊息、離線、timeout、身份解析與可觀測性。

Hermes 已經替 delivery failure 定義 typed reason，並區分哪些錯誤值得自動重試、哪些重試只會浪費額度。這比「Agents 可以互聊」更值得注意，因為真正的系統通常不是壞在 Demo 的 happy path。[[1]](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode#when-a-delivery-fails-typed-reasons)

### 3. Review debt 會比 Token 更早撞牆

Bots 愈多，產出愈快，人類的審查佇列就愈長。

DORA 2024 觀察到 AI 採用與文件、程式碼品質及 Review speed 改善相關，但也與 Delivery throughput、stability 下滑相關。METR 在 2025 年初的隨機實驗則發現，特定資深開源開發者在熟悉 Repository 上使用當時的 AI 工具，平均慢了 19%；原研究頁現在已明確警告，這個結果很可能不再適用於當前工具。2026 年更新資料出現加速訊號，但估計區間跨過零，且受到參與者不願被分配到禁用 AI、任務選擇與多 Agent 並行工時難以計算等偏誤影響，METR 自己也只稱為很弱的證據。這些結果不能直接比較，更不能推論所有 Agent 都會提高或降低生產力；它們共同提醒的，是**生成速度不等於交付速度，量測方法也必須跟著工作型態改變。**[[11]](https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report)[[12]](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)[[15]](https://metr.org/blog/2026-02-24-uplift-update/)

所以我不會讓同一個 Bot 一邊寫、一邊證明自己寫得很好。確定性檢查（測試、型別、Lint、靜態掃描）、證據審查（來源、Browser、視覺）、不同角色或模型的 Reviewer，以及人類 Gate，必須分層存在。

### 4. 最合理的是長期 Manager 加一次性 Workers

不是每個工作都值得建立一位永久 AI 員工。

需要長期累積脈絡、承擔固定責任、定期被叫用的角色，適合做 Bot。一次性研究、單一 PR、短暫反方審查與大量平行嘗試，則適合 Subagent 或 Task worker。

未來成熟的 Agent 系統，比較可能長這樣：

```text
少數 Persistent Bots
負責責任、脈絡、路由與例行工作
          ↓
按需召喚 Ephemeral Workers
負責研究、實作、測試與反證
          ↓
Deterministic Verification
          ↓
Independent Review
          ↓
Human Approval
```

AI 組織不是把每個職稱都做成一個聊天頭像，而是替不同生命週期的工作選對執行單位。

## 如果是我，我會先做四個角色 {#playbook}

我不會一開始建立十五個 Bots。Roster 很大，看起來很像公司，但也可能只是多了一個需要管理的通訊錄。

我會先從四個長期角色開始：

```text
Orchestrator
├─ Research Scout
├─ Builder / Editor
└─ Verification Gatekeeper
```

### Orchestrator

保留目標、限制、優先順序與責任邊界。它可以路由工作，但不應自動擁有所有高風險權限。

### Research Scout

負責找官方文件、論文、新聞與反證。可以排 Daily／Weekly Routine，但不能自行發布。

### Builder／Editor

依規格產生程式碼、文件、文章或素材。它的工作目錄與可寫範圍要清楚，不能因為「方便」就讀整台電腦。

### Verification Gatekeeper

使用不同角色、不同提示，必要時甚至不同模型。它負責測試、來源、Security scan、Browser evidence 與風險分類，但不能自己批准自己 Merge。

接著只量五件事：

1. 一項工作從提出到可驗收花多久。
2. 人類實際花多少時間 Review。
3. 有多少產出被退回重做。
4. Routine 是否產生過期、重複或無人處理的結果。
5. 權限與資料是否曾超出原本邊界。

如果這四個角色都還沒有穩定，再增加 Bot 通常不會比較像公司，只會比較像多開幾個群組，而且每個群組都有人在 tag 你。

## 我真正期待的不是 AI 公司 {#conclusion}

Hermes Bot Mode 不是 Claude Code Subagent 的另一個名字，也不只是 Grok Bot 的開源版本。

它比較像是把 Hermes 從「一個很強的 Agent」變成「一個可以設計 Agent 生命週期與責任關係的控制面」。Profile、Bot Chat、Group、Routine 與跨機器 messaging 原本都是技術元件；Bot Mode 把它們組成了人比較容易操作的組織模型。

這個方向很有價值，但「有名字」不會自動帶來責任，「有記憶」不會自動帶來判斷，「能互聊」也不代表已經形成團隊。

工具商很喜歡把這些介面畫成一間 AI 公司。對我來說，更準確的比喻其實是一張責任地圖：誰記得什麼、誰可以做什麼、哪裡必須停下來等人。

如果這張地圖沒有先畫清楚，開再多 Bots，也只是讓混亂開始有了頭像。

<small>封面為 AI 生成概念圖，以水手服 AI 系統工程師與四個具名機器人角色呈現 Persistent Bot roster、工作交接、Routine 與驗證 Gate；不代表 Nous Research、xAI、Anthropic 或 OpenAI 的官方介面、合作或背書。內文圖解由作者依官方文件重新繪製。</small>

---

## 參考資料

[1] [Nous Research：Hermes Agent Bot Mode](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode)

[2] [Nous Research：Profiles — Running Multiple Agents](https://hermes-agent.nousresearch.com/docs/user-guide/profiles)

[3] [Hermes Agent v0.20.3 Release Notes](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.16.2)

[4] [xAI：Grok Bot Overview](https://docs.x.ai/grok-bot/overview)

[5] [xAI：Grok Bot Skills and Routines](https://docs.x.ai/grok-bot/skills-routines-and-automations)

[6] [xAI：Grok Bot Approvals, Security, and Privacy](https://docs.x.ai/grok-bot/approvals-security-and-privacy)

[7] [Anthropic：Claude Code Custom Subagents](https://code.claude.com/docs/en/sub-agents)

[8] [Anthropic：Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams)

[9] [OpenAI：Codex Long-running Work and Goal Mode](https://developers.openai.com/codex/long-running-work)

[10] [OpenAI：Codex Subagents](https://developers.openai.com/codex/subagents)

[11] [Google Cloud：2024 DORA Report](https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report)

[12] [METR：Early-2025 AI and Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)

[13] [Nous Research：Hermes Cron Scheduling](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)

[14] [xAI：Grok Bot Use the Computer and Apps](https://docs.x.ai/grok-bot/computer-and-apps)

[15] [METR：We Are Changing Our Developer Productivity Experiment Design](https://metr.org/blog/2026-02-24-uplift-update/)

[16] [OpenAI：Codex Memories](https://learn.chatgpt.com/docs/customization/memories)
