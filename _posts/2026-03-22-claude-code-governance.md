---
title: "你不知道的 Claude Code：從聊天工具到工程代理，你真正該學的是治理"
date: 2026-03-22 00:00:01 +0000
categories: [claude-code]
layout: article
nav_active: education
cover_image: /assets/img/linkedin/claude-code-governance.svg
description: "Claude Code 不是聊天機器人，是一套可以治理的工程代理系統。深入解析六層架構、上下文工程、Skills/Hooks/Subagents 設計，以及 Prompt Caching 與驗證閉環。"
---

很多人第一次用 Claude Code，都用 ChatBot 的直覺在操作：

丟一段需求，等它幫你寫完。不對就再補 prompt。再不對就把規則寫更長。再不對就接更多 MCP、開更多子代理。

結果常常不是越來越強，而是越來越亂。上下文變髒、工具越接越多卻越容易選錯、規則越寫越長卻越不遵守。

這不是 prompt 技巧不夠。而是你在用一個「工程代理系統」，卻還用「聊天機器人」的方式管理它。

這篇文章的目標，是把 Claude Code 從「看起來很會寫程式的聊天視窗」，還原成一套可以治理、可以驗證、可以長期維護的工程工作系統。

---

## 一、底層是代理循環，不是對話回應

Claude Code 的核心不是「回答問題」，而是反覆執行一個循環：

> 收集上下文 → 採取行動 → 驗證結果 → 完成，或回到收集

這個循環看似簡單，但實務上會不會失控，取決於你怎麼設計它的上下文、行動能力、控制邊界、隔離方式與驗證機制。

卡住的地方幾乎從來不是模型不夠聰明。更多時候是：給了它錯誤的上下文、沒辦法判斷結果對不對、也沒辦法撤回。

把 Claude Code 想成一個剛進團隊的高能力工程師。你如果只丟一句「去做」，它可能也會開始動。但真正決定品質的，從來不是它願不願意做，而是：它拿到了哪些資訊、可以做哪些事、哪些事不能做、什麼情況要停、怎樣才算完成。

---

## 二、六層架構：治理 Claude Code 的完整框架

要把 Claude Code 用穩，最實用的方式是把它拆成六層來看：

| 層次 | 組件 | 負責的事 |
|------|------|---------|
| L1 | CLAUDE.md / rules / memory | 長期上下文、協作契約、固定約束 |
| L2 | Tools / MCP | 動作能力、外部連接、資料讀寫 |
| L3 | Skills | 工作方法論、按需載入的工作流 |
| L4 | Hooks | 強制插入、審計點、確定性控制 |
| L5 | Subagents | 隔離的工作單元、高噪音任務 |
| L6 | Verifiers | 驗證閉環、可回滾、可審查 |

這六層缺一不可。只強化其中一層，整體系統反而容易失衡：

- CLAUDE.md 寫太長 → 常駐上下文先污染自己
- 工具接太多 → Claude 選工具像在逛迷宮
- Subagent 開到處都是 → 狀態開始漂移
- 沒有驗證 → 最後只能靠「它說做完了」自我安慰

這就是很多人越用越卡的根源。

---

## 三、先把名詞切清楚

這幾個詞很容易混在一起：

| 組件 | 定位 | 給 Claude 的是什麼 | 典型用途 |
|------|------|--------------------|---------|
| Tool / MCP | 動作能力 | 新功能 | 讀檔、改檔、查 GitHub、跑指令 |
| Skill | 工作方法 | 流程與框架 | 發布前清單、故障分診流程 |
| Hook | 硬性控制 | 確定性插入點 | 編輯後自動 lint、阻止修改特定檔案 |
| Subagent | 隔離執行 | 獨立上下文 | 掃整個 repo、大量測試、大型審查 |

一句話記住：要給新能力用 Tool/MCP，要給方法用 Skill，要做硬限制用 Hook，要做隔離探索用 Subagent。

---

## 四、上下文工程：最重要的系統約束

很多人把上下文當「容量問題」，其實卡住的地方通常不是不夠長，而是太吵了——有用的資訊被大量無關內容淹沒。

### 真實的上下文成本

Claude Code 的 200K 上下文並非全部可用。實際成本分布大致如下：

| 類型 | 佔用量 | 說明 |
|------|--------|------|
| 系統指令 | ~2K | 固定開銷 |
| 啟用的 Skill 描述符 | ~1–5K | 每個 Skill 的描述常駐 |
| MCP Server 工具定義 | ~10–20K | **最大隱形殺手** |
| LSP 狀態 | ~2–5K | 固定開銷 |
| CLAUDE.md + Memory | ~3–7K | 半固定 |
| 動態可用（對話、檔案、工具輸出） | ~160–180K | 真正能用的空間 |

一個典型 MCP Server（如 GitHub）包含 20–30 個工具定義，每個約 200 tokens，合計 4,000–6,000 tokens。接 5 個 Server，光工具定義就吃掉約 25,000 tokens（12.5%）。在需要大量讀碼的場景，這 12.5% 很關鍵。

### 建議的上下文分層

| 載入方式 | 放哪裡 | 放什麼 |
|----------|--------|--------|
| 始終常駐 | CLAUDE.md | 專案契約、建置命令、禁止事項 |
| 按路徑載入 | rules | 語言、目錄、檔案類型特定規則 |
| 按需載入 | Skills | 工作流程、領域知識 |
| 隔離載入 | Subagents | 大量探索、平行研究、高噪音任務 |
| 不進上下文 | Hooks | 確定性腳本、審計、阻斷 |

設計的本質很簡單：**偶爾才用到的東西，不要每次都塞進主上下文。**

### Tool Output：另一個隱形上下文殺手

除了 MCP 工具定義的固定開銷，動態部分同樣有個常被忽視的坑：Tool Output。`cargo test` 一次完整輸出動輒幾千行，`git log`、`find`、`grep` 在稍大的 repo 裡也能輕鬆塞滿螢幕。

Claude 並不需要全部細節，它通常只需要知道：有沒有過、哪裡掛了、下一步該做什麼。但只要這些輸出進了上下文，就是實實在在的 token 消耗。

**實務建議**：與其把完整輸出餵給 Claude，不如截短：

```bash
cargo test 2>&1 | head -30
```

更進一步，可以用 Hook 透明處理輸出，讓 Claude 只看到關鍵訊號：

```
# 原始輸出（幾千行）
running 262 tests ...

# 處理後 Claude 看到的
✓ cargo test: 262 passed (1 suite, 0.08s)
```

Claude 真正需要的就是「過了還是掛了，掛在哪裡」，其他都是噪音。

### 壓縮機制的陷阱與解法

上下文快滿時 Claude Code 會自動壓縮，但預設壓縮算法按「可重新讀取」判斷，早期的架構決策和約束理由往往會被一起刪掉。兩小時後再改，可能根本不記得兩小時前定了什麼。

**解法一：在 CLAUDE.md 寫 Compact Instructions**

```markdown
## Compact Instructions
When compressing, preserve in priority order:
1. Architecture decisions (NEVER summarize)
2. Modified files and their key changes
3. Current verification status (pass/fail)
4. Open TODOs and rollback notes
5. Tool outputs (can delete, keep pass/fail only)
```

**解法二：開新會話前，先讓 Claude 寫 HANDOFF.md**

請 Claude 寫清楚：目前做到哪裡、試過哪些方法、哪些走得通、哪些是死路、下一步建議做什麼、目前風險與待驗證項目。下一個新鮮上下文的 Claude 只讀這份文件就能接著做，不依賴壓縮算法的摘要品質。

---

## 五、Plan Mode 的工程價值

Plan Mode 的本質是把「探索」和「執行」拆開。探索階段不動檔案，只做釐清目標、確認限制、比較方案、拆解實作順序、找出風險點。

| 階段 | 操作 | 目的 |
|------|------|------|
| 探索（Plan Mode） | 只讀、分析、比較方案 | 不在錯誤假設上浪費執行成本 |
| 執行 | 動檔案、寫程式 | 方案已確認後才開始 |

**按兩下 Shift+Tab 進入 Plan Mode**。

對於複雜重構、跨模組遷移、高風險設定變更，Plan Mode 特別有用。一個進階玩法：開一個 Claude 寫計畫，再開一個以「高級工程師」身份審這個計畫，讓 AI 審 AI，效果很好。

---

## 六、Skills 設計：不是模板庫，是按需載入的工作流

Skill 的描述符常駐上下文，完整內容只有真的被觸發時才載入。這個「按需載入」機制叫做 **progressive disclosure（漸進式揭露）**。

### 一個好 Skill 應該具備什麼

| 要素 | 說明 | 範例 |
|------|------|------|
| 描述寫「何時使用」 | 不是「我是什麼」，而是「什麼情況用我」 | `Use for PR reviews with focus on correctness.` |
| 完整步驟 | 輸入、步驟、輸出、停止條件 | 避免寫了開頭沒有結尾 |
| 正文只放骨架 | 大資料拆到 supporting files | 不要把百科全書塞進 SKILL.md |
| 有副作用要限制 | 加 `disable-model-invocation: true` | 防止 Claude 自己心血來潮觸發 |

描述符要寫短，每個 Skill 都在偷上下文空間：

```yaml
# 低效（~45 tokens）
description: |
  This skill helps you review code changes in Rust projects.
  It checks for common issues like unsafe code, error handling...

# 高效（~9 tokens）
description: Use for PR reviews with focus on correctness.
```

### 三種最值得自己做的 Skill 類型

| 類型 | 適合情境 | 核心設計 |
|------|---------|---------|
| 檢查清單型 | release 前、交付前核對 | 每項 pass/fail，有一項 fail 就不能繼續 |
| 工作流型 | 高風險操作（遷移、回滾） | 加 `disable-model-invocation: true`，內建回滾步驟 |
| 領域專家型 | 故障分診、日誌調查 | 固定的證據收集路徑 + 決策矩陣 |

**範例：領域專家型（runtime-diagnosis）**

```yaml
---
name: runtime-diagnosis
description: Use when the app crashes, hangs, or behaves unexpectedly at runtime.
---

## Evidence Collection
1. Run `app doctor` and capture full output
2. Last 50 lines of logs
3. Plugin/module state

## Decision Matrix
| Symptom         | First Check              |
|-----------------|--------------------------|
| Crash on startup | doctor output → syntax error |
| Rendering glitch | GPU backend / terminal capability |
| Config not applied | Config path + schema version |

## Output
Root cause / Blast radius / Fix steps / Verification command
```

### Skill 調用頻率的最佳策略

| 頻率 | 策略 |
|------|------|
| 高頻（>1 次/會話） | 保持 auto-invoke，優化描述符 |
| 低頻（<1 次/會話） | disable-auto-invoke，手動觸發，描述符脫離上下文 |
| 極低頻（<1 次/月） | 移除 Skill，改為文件記錄 |

---

## 七、Tool 設計：不是功能越多越好

給 agent 用的工具，重點不是功能堆得多完整，而是**讓它更容易用對**。

### 好工具 vs. 壞工具

| 面向 | 好的設計 | 壞的設計 |
|------|---------|---------|
| 命名 | `github_pr_review`（有系統前綴） | `review`（模糊）|
| 目標 | 單一明確目的 | 一個工具包五種行為 |
| 參數 | 語義清楚 | 到處都是 `id`、`name`、`target` |
| 錯誤訊息 | 有修正指引 | 只回 opaque error code |
| 大輸出 | 支援 concise/detailed 模式 | 永遠完整輸出 |
| 層次 | 高層任務工具 | 暴露過多底層碎片工具 |

Claude 選工具靠的是語意判斷，而不是你覺得 API 設計漂不漂亮。工具越碎、越模糊、越多重目的，它就越容易選歪。

### AskUserQuestion 工具的演進：一個真實的設計故事

Claude Code 團隊在設計「任務中途暫停問用戶」這個功能時，試了三個版本：

| 版本 | 做法 | 問題 |
|------|------|------|
| v1 | 給已有工具加 `question` 參數 | Claude 大多數時候直接忽略，繼續往下跑 |
| v2 | 要求 Claude 在輸出裡寫特定 markdown 格式 | Claude 經常「忘了」按格式寫，邏輯非常脆弱 |
| v3 | 做成獨立的 `AskUserQuestion` 工具 | Claude 想提問就必須顯式調用它，調用即暫停，無歧義 |

結論：既然你就是要 Claude 停下來問，那就直接給它一個專門的工具。加個 flag 或約定輸出格式，它一順手就略過去了。

### 什麼時候不該再加 Tool

| 情況 | 建議做法 |
|------|---------|
| 本地 shell 就能穩定完成 | 讓 shell 做，不要再多包一層 |
| 模型只需要靜態知識 | 用文件、rules、Skill |
| 需求本質是流程約束 | 用 Skill，不是 Tool |
| Schema 與回傳格式還不穩定 | 先驗證清楚再做成工具 |

---

## 八、Hooks：把不該靠記憶的事收回確定性流程

Hooks 不是「自動化小腳本」，更精準的說法是：**控制平面的硬邏輯**。凡是你不希望 Claude 靠臨場發揮決定的事，都可以考慮放進 Hook。

### 適合 vs. 不適合放 Hooks 的事

| 適合放 Hooks | 不適合放 Hooks |
|------------|--------------|
| 阻擋修改受保護檔案 | 需要大量上下文判讀的語意決策 |
| 編輯完自動 format / lint | 長時間執行的業務流程 |
| SessionStart 注入動態上下文 | 需要多步推理與權衡的判斷 |
| 任務完成後推送通知 | （這些應交給 Skill 或 Subagent）|

**範例：編輯 Rust 檔後立刻 cargo check**

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit",
      "pattern": "*.rs",
      "hooks": [{
        "type": "command",
        "command": "cargo check 2>&1 | head -30",
        "statusMessage": "Running cargo check..."
      }]
    }]
  }
}
```

每次編輯完立刻知道有沒有編譯錯誤，不是等你改了十幾個檔後才發現第一個檔就編不過。

### 三層搭配最穩

只靠其中一層都會有漏洞：

- 只寫 CLAUDE.md 規則 → Claude 經常當沒看見
- 只靠 Hooks → 細節判斷做不了
- 只靠 Skill → 沒有強制保護

| 層次 | 角色 |
|------|------|
| CLAUDE.md | 宣告規則（「提交前必須通過測試和 lint」） |
| Skill | 告訴它流程與判讀方式 |
| Hook | 在關鍵路徑做硬驗證，必要時阻斷 |

三樣疊加才有方法、有規則、也有警察。

---

## 九、Subagents：最大的價值不是平行，而是隔離

很多人聽到 Subagent，第一反應是「平行跑比較快」。但它最大的價值其實是**隔離**。

大範圍掃 repo、跑大量測試、大型日誌搜尋、代碼審查——這些工作非常容易污染主上下文。交給 Subagent 做，主線只拿回摘要，主上下文會乾淨很多。

### 設計 Subagent 時要明確約束

| 參數 | 目的 |
|------|------|
| `tools / disallowedTools` | 限定工具範圍，不給和主線一樣寬的權限 |
| `model` | 探索任務用 Haiku/Sonnet，重要審查用 Opus |
| `maxTurns` | 防止跑飛 |
| `isolation: worktree` | 需要動檔案時隔離檔案系統 |

如果子代理權限跟主線一樣寬，那不叫隔離，只是分身。

### 適合丟給 Subagent 的任務

- 「掃整個 repo，找所有和 auth token 相關的實作」
- 「審查這次 PR，有沒有 correctness 風險」
- 「比較 A 與 B 兩種遷移方案的差異」
- 「收集最近 50 行錯誤日誌與模組依賴狀態」

長時間執行的 bash 命令可以按 **Ctrl+B** 移到背景，Claude 之後會用 BashOutput 工具查看結果，不會阻塞主線程繼續工作。

---

## 十、Prompt Caching：很少人講，但非常重要

Prompt cache 是按前綴匹配運作的。越靠前、越穩定的內容，越能被重用。高命中率不只省成本，速率限制也會寬鬆很多。

Claude Code 的 Prompt 順序：

| 順序 | 內容 | 穩定性 |
|------|------|--------|
| 1 | System Prompt | 靜態，應鎖定 |
| 2 | Tool Definitions | 靜態，應鎖定 |
| 3 | Chat History | 動態，放後面 |
| 4 | 當前使用者輸入 | 最後 |

### 常見破壞 Cache 的行為

| 行為 | 為什麼有害 |
|------|-----------|
| 系統 Prompt 放時間戳 | 讓靜態內容每次都變化 |
| 工具定義順序不固定 | 前綴不匹配，cache 失效 |
| 會話中途增刪工具 | 同上 |
| **長會話中途切換模型** | **最常被忽略！會重建整個 cache** |

關於切換模型：你以為簡單問題切 Haiku 比較省，但如果前面已經和 Opus 聊了 100K tokens，切換模型會重建整個 cache，可能反而更貴。確實需要切換，用 Subagent 交接，而不是在主線切換。

動態資訊（如當前時間）不要放進系統 Prompt，放到使用者訊息裡傳進去就好，系統 Prompt 不動，cache 不會被打壞。

---

## 十一、Verifiers：沒有驗證，就沒有工程級代理

「Claude 說完成了」在工程上幾乎不算完成。真正的完成，至少要能回答：它有沒有做對、錯在哪裡、能不能回滾、誰可以審查。

### Verifier 三層架構

| 層次 | 工具 | 適用 |
|------|------|------|
| 基本層 | exit code、lint、typecheck、unit test | 每次變更 |
| 中階層 | integration test、screenshot diff、contract test、smoke test | 功能完成後 |
| 高階層 | production log、monitoring metrics、人工審查清單 | release 前 |

在 CLAUDE.md 明確定義驗收方式：

```markdown
## Verification
For backend changes:
- Run `make test` and `make lint`

For API changes:
- Update contract tests

Definition of done:
- All tests pass
- Lint passes
- No untracked TODO remains
```

**一個很簡單的判斷標準**：如果一個任務你說不清楚「什麼叫做完」，那它大概率也不適合直接丟給 Claude 自主完成。

---

## 十二、高頻命令一覽

這些命令的共同目標只有一個：**主動管理上下文，不要等系統替你善後。**

### 上下文管理

| 命令 | 用途 |
|------|------|
| `/context` | 查看 token 使用結構，排查 MCP 或訊息歷史佔比 |
| `/clear` | 同一問題被糾偏兩次以上，直接重開 |
| `/compact` | 壓縮對話，要搭配 Compact Instructions |
| `/memory` | 確認哪些 CLAUDE.md 真的被載入 |

### 能力與治理

| 命令 | 用途 |
|------|------|
| `/mcp` | 管理 MCP 連接，檢查 token 成本，斷開閒置 server |
| `/hooks` | 管理 hooks，控制平面入口 |
| `/permissions` | 查看或更新權限白名單 |
| `/sandbox` | 設定沙箱隔離 |
| `/model` | Opus 用深度推理，Sonnet 用常規，Haiku 用快速探索 |

### 會話延續與平行

| 命令 | 用途 |
|------|------|
| `claude --continue` | 恢復當前目錄最近會話 |
| `claude --resume` | 打開選擇器恢復歷史會話 |
| `claude --continue --fork` | 從已有會話分叉，同一起點不同方案 |
| `claude --worktree` | 建立隔離 git worktree |
| `claude -p "prompt"` | 非互動模式，接入 CI / pre-commit |
| `claude -p --output-format json` | 結構化輸出，便於腳本消費 |

### 比較少人提但很好用的

| 命令/操作 | 用途 |
|----------|------|
| `/simplify` | 對剛改完的程式碼做三維檢查（復用、品質、效率），發現問題直接修 |
| `/rewind` | 回到某個會話 checkpoint 重新總結，適合 Claude 已沿錯誤路徑探索太久 |
| `/btw` | 不打斷主任務的前提下快速問一個旁路問題 |
| `/insight` | 分析當前會話，提煉哪些內容值得沉澱到 CLAUDE.md |
| 雙擊 ESC | 回去編輯上一條輸入，重發，不用重開會話 |
| `~/.claude/projects/` | 所有會話記錄存放於此，用 grep 可搜尋歷史 |

---

## 十三、CLAUDE.md 正確寫法：協作契約，不是知識庫

### 應該放什麼 vs. 不該放什麼

| 應該放 | 不該放 |
|--------|--------|
| build / test / run 指令 | 大段背景介紹 |
| 關鍵目錄與模組邊界 | 完整 API 文件 |
| 風格與命名約束 | 空泛原則（如「寫高品質程式碼」） |
| 不明顯的環境坑 | Claude 看 repo 就能推得出來的事 |
| NEVER 清單 | 大量低頻知識（這些放 Skills） |
| 驗證方式 | |
| Compact Instructions | |

### 一份值得參考的範本

```markdown
# Project Contract

## Build And Test
- Install: `pnpm install`
- Dev: `pnpm dev`
- Test: `pnpm test`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`

## Architecture Boundaries
- HTTP handlers live in `src/http/handlers/`
- Domain logic lives in `src/domain/`
- Do not put persistence logic in handlers

## Safety Rails
### NEVER
- Modify `.env`, lockfiles, or CI secrets without explicit approval
- Remove feature flags without checking all call sites
- Commit without running tests

### ALWAYS
- Show diff before committing
- Update CHANGELOG for user-facing changes

## Verification
- Backend changes: `make test` + `make lint`
- API changes: update contract tests

## Compact Instructions
Preserve:
1. Architecture decisions (NEVER summarize)
2. Modified files and key changes
3. Current verification status (pass/fail)
4. Open risks, TODOs, rollback notes
```

**一個很實用的技巧**：每次糾正 Claude 的錯後，告訴它：

> "Update your CLAUDE.md so you don't make that mistake again."

Claude 在幫自己補規則時其實挺好用的，用久了確實越來越少犯同樣的錯。不過要定期 review，當初加的限制久了也會過時。

---

## 十四、建議的專案目錄結構

```plaintext
Project/
├── CLAUDE.md                      ← 全域契約
├── .claude/
│   ├── rules/
│   │   ├── core.md                ← 語言通用規則
│   │   ├── config.md
│   │   └── release.md
│   ├── skills/
│   │   ├── runtime-diagnosis/     ← 領域專家型
│   │   ├── config-migration/      ← 工作流型
│   │   ├── release-check/         ← 檢查清單型
│   │   └── incident-triage/
│   ├── agents/
│   │   ├── reviewer.md
│   │   └── explorer.md
│   └── settings.json
└── docs/
    └── ai/
        ├── architecture.md
        └── release-runbook.md
```

同時維護多個專案時，把穩定的個人基線放在 `~/.claude/`，各專案差異放在專案級 `.claude/`，不同專案之間就不容易互相污染。

---

## 十五、最常見的反模式

| 反模式 | 為什麼有害 |
|--------|-----------|
| 把 CLAUDE.md 當 Wiki | 每次會話被一大包低頻資訊壓著跑 |
| Skill 寫得太胖 | 一個 Skill 同時包 review、deploy、debug、incident，誰都像它但誰都不夠像 |
| 工具太多且命名模糊 | Claude 每次都得猜該用哪一個 |
| 沒有 verifier | 只能靠直覺相信「它應該做好了」 |
| 過度自治（Subagent 不限制） | 像把辦公室門窗全開還掛招牌說歡迎入侵 |
| 不做上下文切換 | 任務換階段了，還在同一個老會話裡繼續堆 |
| allowedTools 不整理 | 久了像抽屜裡的舊鑰匙，哪把還能開門連你自己都不知道 |

---

## 十六、給初學者的實作順序：不要一次全上

| 步驟 | 做什麼 | 放什麼 |
|------|--------|--------|
| 第一步 | 寫最小可用 CLAUDE.md | build/test/run + NEVER 清單 + 驗證方式 + Compact Instructions |
| 第二步 | 把差異規則拆到 rules | 前端目錄規則、後端目錄規則、特定語言規則 |
| 第三步 | 做 2–3 個高頻 Skill | PR review、release-check、runtime-diagnosis |
| 第四步 | 加最小 Hooks | 編輯後自動 lint、阻擋特定檔案修改 |
| 第五步 | 定義 verifier | 至少先有 test + lint + typecheck |
| 第六步 | 才考慮 Subagents 與更多 MCP | 先把治理做好，再擴能力 |

不要反過來。不然很容易從工程代理進化成工程煙火。

---

## 結語：三個階段

用 Claude Code 大概會經歷三個階段：

| 階段 | 關注點 | 典型行為 |
|------|--------|---------|
| 第一階段 | 這個功能怎麼用、這個命令是什麼 | 一直加 MCP、裝工具 |
| 第二階段 | 怎麼讓它少出錯、怎麼修 prompt | 規則越寫越長 |
| 第三階段 | 怎麼讓 agent 在約束下穩定工作 | 治理上下文、設計驗證、控制邊界 |

到了第三階段，關注點悄悄變掉了：從「這個功能怎麼用」變成「怎麼讓 agent 在約束下自己跑起來」，兩件事感覺差很多。

Claude Code 的成熟使用方式，最終不是關心「它會不會做」，而是「你有沒有把這套系統治理到可以放心讓它做」。

如果一個任務你說不清楚「什麼叫做完」，那它大概率也不適合直接丟給 Claude 自主完成——驗證標準本身都沒有，Claude 再聰明也跑不出正確答案。
