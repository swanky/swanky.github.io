---
name: codex-image
description: 委派本機 codex CLI(內建 image_gen)生成或微調點陣圖(簡報配圖/插畫/示意圖),由目前 AI agent 統籌風格規範與驗收,確保與簡報內容一致。當使用者要生成新的圖片／插畫／配圖，或要修改、重生、微調一張既有的 AI 圖時觸發（不論是否點名 codex）。
---

# codex-image:委派 codex CLI 生圖(orchestrator 模式)

用本機 `codex exec`(非互動模式)呼叫 codex 內建 `image_gen` 工具生圖。
**角色分工是本 skill 的核心**:目前執行工作的 AI agent 是 orchestrator——負責組出完整
prompt(主題、風格、色盤、構圖、尺寸、禁止項、輸出路徑)並驗收成品;codex 只當生圖執行器,
不做任何風格判斷。這樣簡報作者與圖片驗收者是同一個 context,才能確保風格一致。

> 本 skill 2026-08-08 自 `rwa/.claude/skills/codex-image/` **複製**進本 repo(rwa 端保留原檔,
> 那個專案在別台電腦也在用,不可搬走)。本 repo 的正本在 `.agents/skills/`,
> `.claude/skills/` 是 `node tools/sync-agent-skills.mjs` 產生的鏡像——勿手動編輯鏡像。

## 已驗證環境(2026-08-08 於本 repo 複驗)

- **本 repo 實測成功**:`-C "C:\Users\swank\Desktop\swanky.github.io"` 未跳信任提示,
  帶參考圖的 image edit 也通(見下方 sandbox 陷阱的兩個 exclude 旗標),
  1536x1024 一張約 1–2 分鐘。實例:兩篇金瓶梅文章的 banner(`assets/img/jinpingmei/covers/*-banner.jpg`)。

## 原始驗證環境(2026-08-06 於 rwa)

- codex-cli **0.147.0-alpha.1.2**,`image_generation` feature = stable 且已啟用(內建工具,不需 `OPENAI_API_KEY`)。
- `~/.codex/config.toml` 已設 `sandbox_workspace_write.network_access = true` 且保留 corporate proxy 環境變數,生圖網路可通。
- 一張 1024x1024 約 1–2 分鐘;PowerShell 呼叫一律設 `timeout: 600000`。
- **trusted projects**:`c:\cursorhome\rwa` 已在 `~/.codex/config.toml` 的 trusted 清單內
  (2026-08-06 複驗),`-C` 指到本 repo 不會跳信任提示。

### codex 不在 PATH:走 `codex.cmd` shim(2026-08-06)

Codex desktop installer 把執行檔放在**每版不同的 hash 目錄**
(`%LOCALAPPDATA%\OpenAI\Codex\bin\<hash>\codex.exe`),且**不註冊 PATH**,
所以裸 `codex` 原本會 command-not-found,寫死絕對路徑則每次自動更新就失效。

本機已在 `%APPDATA%\npm\codex.cmd`(該目錄已在 PATH)放一支 shim,解析順序:

1. `~/.codex/config.toml` 的 `CODEX_CLI_PATH`(installer 升版時會改寫這行)
2. fallback:`%LOCALAPPDATA%\OpenAI\Codex\bin` 下**最新** build 目錄的 `codex.exe`

兩條路徑都已實測可用,**本 skill 一律直接用裸 `codex`**,不要寫絕對路徑。
若 shim 掉了會回 exit 127 並印出檢查過的位置,照上面兩層重建即可。

PowerShell 5.1 → `.cmd` → `.exe` 的中文引數傳遞已實測正常
(全形冒號、逗號、「引號」原樣抵達,無亂碼無截斷),長 prompt 可直接傳。

### codex 0.160 起會自行讀 repo 規範、要求提權（2026-10-09）

codex 0.160.1 在 exec 模式下會主動讀 `AGENTS.md` 與本 skill、想跑 `git status` 並要求提權；exec 無法批准，整輪中止、不出圖。
它把本 skill 內文印出來時會出現「You've hit your usage limit」字樣——**那是引用，不是真的額度用完**，要讀 rollout jsonl 的 `rate_limits.primary.used_percent` 確認。

解法：呼叫時加 `-c approval_policy=never`，並在 prompt 開頭寫明「這是純生圖工作，不讀其他檔、不跑 git」。

### 額度是獨立的失敗模式

codex 走 ChatGPT 訂閱額度。額度用盡時 session 起得來、sandbox 一切正常,
但模型呼叫直接回:

```
ERROR: You've hit your usage limit. Visit https://chatgpt.com/codex/settings/usage
to purchase more credits or try again at <date>.
```

**這不是設定問題,不要試著改 config 或重登**——只能等重置或加購 credits。
遇到此錯誤停下回報使用者,不要重試。

## Windows sandbox 陷阱:讀本機參考圖會失敗(2026-07-27 於 rwa 實測)

**純文生圖不受影響**;只有需要**讀本機圖檔**的 image edit(換裝、改圖、帶參考圖)會踩到:

```
failed to prepare fs sandbox: failed to prepare windows sandbox wrapper:
windows unelevated restricted-token sandbox cannot enforce split writable root sets directly;
refusing to run unsandboxed
```

原因不是專案信任,而是 `workspace-write` 預設同時掛了 **`workdir` + `/tmp` + `$TMPDIR`
三個可寫根**(`[windows] sandbox = "unelevated"` 處理不了 split root set)。
codex 會自己嘗試把圖 stage 到 `C:\tmp\` 或 `~/.codex/image_edit_inputs\` 再讀,一樣失敗。

**解法**:單次覆寫把可寫根收斂成 `[workdir]` 一個,並讓 **workdir 不要落在 `$TMPDIR` 底下**
(session scratchpad 就在 `$TMPDIR` 下,會重疊):

```powershell
codex exec --skip-git-repo-check -C "<非 temp 的工作目錄>" -s workspace-write `
  -c sandbox_workspace_write.exclude_tmpdir_env_var=true `
  -c sandbox_workspace_write.exclude_slash_tmp=true `
  -o "<工作目錄>\codex-last.txt" "<prompt>"
```

啟動 log 的 `sandbox:` 那行要顯示 `workspace-write [workdir]`(而不是
`[workdir, /tmp, $TMPDIR]`)才算收斂成功。**2026-08-06 於 0.147.0-alpha.1.2 複驗:
不帶旗標是 `[workdir, /tmp, $TMPDIR]`,帶兩個 exclude 後確實收斂成 `[workdir]`。**
輸入圖與輸出圖都放這個 workdir,prompt 內用檔名相對引用。
用 `-c` 而不是改 `config.toml`,避免影響其他專案。

## 執行流程

### 第一步:定規格(orchestrator 責任,不可省略)

先組出結構化圖片規格,再呼叫 codex。至少包含:

- **主題/主體**:畫什麼。
- **風格/媒材**:扁平插畫、照片級、3D 等;同一批簡報素材必須帶同一段「風格常數」文字(見下方風格一致性)。
- **構圖/比例**:方形 1024x1024、簡報橫圖 1536x1024、4K 3840x2160。
- **圖內文字**:需要文字時逐字引號指定;不需要時明寫「無文字、無浮水印」。
- **輸出檔名**:必填。codex 母檔預設存 `~/.codex/generated_images/`,prompt 沒指定目的地就不會落到工作區。
- 結尾固定加:「存成 <路徑>,回報實際存檔的完整路徑」。

輸出路徑規則(本 repo):技術專欄文章 banner → `assets/img/linkedin/<slug>.jpg`(與 website-technical-column 一致);
其他專案封面 → `assets/img/<專案或 slug>/`。
試稿先生到 repo 內的暫存目錄 `assets/img/brand/wip/`(沒有就建立)驗收完再轉正——
**不要生到 scratchpad**,scratchpad 在 `$TMPDIR` 下會踩到下方的 sandbox 陷阱。
wip 目錄不進 git:收尾時刪除整個 wip 目錄,並在回報列出刪了哪些檔。
要當日後風格基準的參考圖才放 `assets/img/brand/`。

**插畫與封面先送規格、再生圖**(站主 2026-10-08 裁決,`docs/brand-book.md` §4.2):
生圖前把每張圖的用途、畫面、出鏡角色、關鍵道具、構圖、禁止元素列成規格表,
連同參考圖路徑交給站主確認符合他的 IP 後才呼叫 codex;頁面先放佔位框,不讓生圖卡住進度。

**畫風錨點**:標竿是技術專欄 banner 的半寫實 2.5D 精修數位繪(看得到筆觸、深鈷藍科技場景加霓虹光軌、
角色大而且在動手操作)。主參考 `assets/img/linkedin/grok-bot-model-routing.jpg`,
生圖前先看 3–5 張近期 banner 定風格常數。否決過的畫風(平塗卡通、Arcane 3D、照片感日光)不要再提。

**有人物出鏡的圖不要自己定角色規格**——站上文章 banner 固定由同一位品牌角色
(水手服少女)出鏡,規範在 `AGENTS.md`「品牌角色形象」段:
prompt 一律附參考圖 `assets/img/brand/swanky-mascot-live-ref.jpg`
並寫明「keep the EXACT same girl as in that reference」,不得自創或改動髮色、紅髮帶、水手服配色。
角色的英文描述正本在 `tools/tarot-ai-style-universal.md` §1.2,但**那段原文是歷史紀錄,含未成年字眼,不可照抄**:
她是成年人(站主 2026-10-09 裁定),prompt 第一行一律用
`one wholesome adult Taiwanese young woman (clearly over 18), gentle and bright expression —`,
外觀描述其餘照 §1.2;全文不得出現 high-school、teen、about 17 等字眼。

實測有效的反制:圖內文字一律在 prompt 尾端寫死
`STRICTLY NO text, NO letters, NO Chinese characters, NO numbers, NO watermark, NO logo`
(中文字生成幾乎必為亂碼);需要「禁止」語意時用符號描述
(`a glowing red prohibition symbol, a circle with a diagonal slash`)而不是要模型寫字。

banner 的做法:codex 只吃 1024x1024／1536x1024／1024x1536,所以生 **1536x1024**,
在 prompt 註明「compose so all key subjects sit inside the central 16:9 band」(列表卡片會裁成 16:9)。
**只發網站的 banner 用原比例、原尺寸轉 JPG,不裁切、不放大、不壓畫質**(站主 2026-10-10 裁決)。
只有站主表明要當 LinkedIn／X 文章封面時,才另外用 PowerShell WIC 裁一份 16:9
(裁切 y 起點依人物位置調整,站姿全身圖切上緣、半身圖上下均分,避免切到鞋子或頭頂;不拉伸、不補邊)。

### 第二步:生成新圖

```powershell
codex exec --skip-git-repo-check -C "<工作根目錄>" -s workspace-write `
  -c approval_policy=never `
  -c sandbox_workspace_write.exclude_tmpdir_env_var=true `
  -c sandbox_workspace_write.exclude_slash_tmp=true `
  -o "<scratchpad>\codex-imagegen-last.txt" `
  "這是純生圖工作，不讀其他檔、不跑 git。<完整規格 prompt>。存成 <相對於工作根目錄的路徑>,回報實際存檔的完整路徑。"
```

- 三個 `-c` 旗標一律帶:`approval_policy=never` 防 0.160 起的提權中止;兩個 `exclude_*` 是附參考圖時必要的 sandbox 收斂(品牌角色圖一定附參考圖)。

- `-C` 指到輸出檔案所在的工作根目錄(repo 素材就指 repo 根目錄,路徑用相對路徑)。
- `-s workspace-write` 必帶(exec 預設 read-only 寫不了檔)。
- **從 stdout 記下 `session id: <uuid>`**——後續微調全靠它。

### 第三步:驗收

直接讀生成的 PNG,逐項核對第一步的規格:主題、風格、構圖、圖內文字正確性、禁止項。

**blocker 只限這幾類**(站主 2026-10-09 裁決,過度審查曾白花額度):真正的性化(走光、內衣、挑逗姿勢、刻意特寫私密部位)、
一般觀看尺寸就讀得出的文字或真實品牌 logo、第三方 IP、明顯畸形、角色不一致。
要放大才看得到的假字、構圖品味、裙子或大腿入鏡、「看起來偏年輕」只記為瑕疵,不算 blocker。

通過 → 第五步。有 blocker 或瑕疵 → 附原圖給站主看,**由站主決定要不要微調或重生**,不可自行花 codex 額度修;
站主同意後才進第四步。

### 第四步:微調迭代(用 resume,不要重新生成)

同一張圖的修改一律走 codex edit 模式,接續原 session:

```powershell
codex exec resume <session-id> --skip-git-repo-check `
  -c approval_policy=never `
  -c sandbox_workspace_write.exclude_tmpdir_env_var=true `
  -c sandbox_workspace_write.exclude_slash_tmp=true `
  -o "<scratchpad>\codex-imagegen-last.txt" `
  "這是純生圖工作，不讀其他檔、不跑 git。只把 <單一修改點> 改成 <目標>,其他(構圖/風格/其餘元素)全部保持不變。存成 <絕對路徑>,回報實際存檔路徑。"
```

- **`resume` 沒有 `-C` 參數**,workdir = 呼叫當下的 cwd,所以輸出路徑**必須用絕對路徑**。
- 每次只改一件事,改完回第三步重新驗收。實測 edit 模式對不變項的保持度極高(雲朵、構圖完全不動,只換主體顏色)。
- 微調會產生新檔,不會覆蓋既有檔;要覆蓋既有資產需在 prompt 明講。

### 第五步:收尾

- 確認最終檔案在目標位置,刪除 `assets/img/brand/wip/` 的中間試稿。
- `~/.codex/generated_images/` 的母檔不在 repo 內,不自動刪;回報裡提一句累積數量,由站主決定是否清理。
- 若是簡報素材,更新引用該圖的 HTML/Markdown。
- 回報:最終檔案路徑、使用的 prompt 重點、session id(供之後跨對話再微調:session 檔在本機保留,`codex exec resume <uuid>` 隨時可接續)。

## 風格一致性守則

- 同一批素材(如一份 townhall deck)先定稿一段**風格常數**(媒材、色盤、線條、光影、人物造型描述),
  之後每張圖的 prompt 開頭原樣帶入,不逐張即興發揮。
- 已生成圖片的修改一律 resume edit,不重新生成——重新生成等於重抽風格。
- 需要成套多張時,一張一張生(一次一個 `codex exec` 呼叫),每張帶同一段風格常數;不要在單一 prompt 要求多張。

## 注意事項與陷阱

| 狀況 | 處理方式 |
|------|---------|
| `codex` command-not-found | shim 掉了。照「codex 不在 PATH」段落重建 `%APPDATA%\npm\codex.cmd`,不要改寫成絕對路徑 |
| `You've hit your usage limit` | ChatGPT 額度用盡,非設定問題。停下回報使用者等重置或加購,不要重試、不要動 config |
| `resume` 存錯位置 | resume 用呼叫當下 cwd 當 workdir;prompt 內一律給絕對輸出路徑 |
| prompt 沒指定輸出檔名 | 圖只留在 `~/.codex/generated_images/`,不會進工作區;規格必含檔名 |
| 透明背景需求 | codex 走 chroma-key 去背流程;複雜主體(毛髮/玻璃/半透明)它會反問,簡單主體可直接要求 |
| 逾時 | 4K 或高複雜度圖較久;timeout 拉滿 600000,仍逾時可改 `run_in_background` 再等通知 |
| codex 回報成功但檔案不在 | 讀 `-o` 的 last-message 檔與 stdout,確認它實際存檔路徑;不要假設成功 |
| 測試/試稿圖 | 放 `assets/img/brand/wip/`(不放 scratchpad,會踩 sandbox 陷阱),收尾刪除;repo 只進最終選用的素材 |
