# CLAUDE.md

@AGENTS.md

Jekyll portfolio for Swanky Studio (史旺基工作室) on GitHub Pages. Deep structure & design context live in `docs/` — see Rules Routing.

## Claude Code Adapter

- 共用專案規範的**單一真相來源是 `AGENTS.md`**（上行已匯入：建置／測試指令、內容規範、環境事實、gotchas、跨 agent 原則）——跨 agent 事實改那裡，不要加回本檔。本檔只放 Claude 適配：Commander mode、派工路由、harness 專屬環境規則。
- Claude 專屬 permissions／hooks 在 `.claude/settings*.json`。
- `.claude/skills/` 是由 `.agents/skills/`（正本）經 `node tools/sync-agent-skills.mjs` 產生的鏡像——**勿手動編輯鏡像**；改正本後重跑同步（drift 檢查已含在 `npm test`）。

## Working Style

Execute autonomously; start without asking. Read relevant code first; make reasonable assumptions and proceed. Do the full job (edit, test, build); prefer the smallest maintainable diff. Final report: files changed + why, verification output, remaining risks.

- **Commander mode**: 主線程是指揮官，context 是最稀缺資源——但派工是用 token 換 context 的交易，token 額度同樣稀缺。預估讀 **>8 檔或 >1500 行**、**位置未知的開放式翻找**、批次改 **>2 檔**、或要**看任何圖檔**（使用者貼進對話的圖除外）→ 派 subagent，主線程只收結論＋file:line；**派工時 `model` 必填**（搜尋／機械修改用 haiku/sonnet，禁止繼承主線程模型），相關任務合併成一個 agent 派出（規則 `docs/agents/dispatch.md`，模板 `docs/agents/delegation-templates.md`）。已知位置的中量讀取主線程自己讀（吃 prompt cache 比派工便宜）。可能 >200 行的指令輸出一律截尾（`cmd 2>&1 | tail -30`）。
- **Plan externalization**: ≥3 步驟的工作，開工前把步驟清單寫進 scratchpad 計畫檔，每完成一步立即更新；compaction 後第一動作＝重讀計畫檔。
- **Done ＝ 改了＋驗了＋證據在手**: never report「已完成」without pasteable verification output——缺證據就寫「已改、未驗」。**Batch the verification**: during dev use cheap checks only (`npm test`, Grep on source, `git diff`, Read); run the one full `bundle exec jekyll build` + `_site/` grep (or browser) pass **once before push**, over all changes together. 完成判準與各類產物底線驗法：`docs/agents/judgment.md` R2/R5。
- **Mid-task check-ins**: only for the stop-list in `docs/agents/judgment.md` R3 — delete data / modify production config / push to a remote / touch secrets / 對外商業決策（價格、稱謂、品牌語氣）/ 花錢。豁免：`docs/` nested repo 的 `git push dropbox`＝本機 Dropbox 同步、非對外，照既定慣例自動執行。其餘一律自主執行到完。

## Rules Routing（何時讀什麼；session 開頭不用預讀，觸發了再讀）

| 觸發情境 | 讀 |
|---|---|
| 要派 subagent、選 model、要驗收交付 | `docs/agents/dispatch.md`；派工直接套 `docs/agents/delegation-templates.md` |
| 拿不準：真的完成了嗎／要不要問使用者／該換路還是重試／要不要升級模型 | `docs/agents/judgment.md` |
| 想改 CLAUDE.md、docs/agents/*、或 memory 規則 | `docs/agents/maintenance.md`（**先讀再改**） |
| 想新增／修改 AGENTS.md、Hermes／Codex 適配、或跨 agent 共用 skills | `docs/agents/cross-agent-sharing.md`；若會改制度檔再讀 `docs/agents/maintenance.md` |
| 改 layouts、collections、front matter、或 Human Design engine | `docs/architecture.md` |
| 視覺／設計工作 | `docs/design.md` |
| 要產生文章 banner／封面插畫（有人物出鏡） | `AGENTS.md`「品牌角色形象」段——**一律附參考圖** `assets/img/brand/swanky-mascot-live-ref.jpg`，不得自創角色外觀 |
| 新接手本環境、或想了解制度為何這樣設計 | `docs/agents/letter-to-future-sessions.md`、`docs/agents/diagnosis-2026-07.md` |

Precedence when rules conflict: **user's live instruction > CLAUDE.md（適配層）> AGENTS.md（共用規範）> docs/agents/* > memory**（依 `AGENTS.md` 跨 agent 原則，適配層不得另訂與共用規範衝突的專案規則——真衝突時視為 bug，修正之）。依高優先者執行，並修正低優先檔＋在回報中說明（修正動作本身仍受 `docs/agents/maintenance.md` §1 分層約束——黃／紅區先問）。

**Private docs**: `docs/` 除 `.gitignore` 白名單三檔（architecture / design / gstack-skills）外都不進公開 repo，由 **nested private git repo inside `docs/`**（remote `dropbox`）版本控制。After editing them, commit+push from within `docs/`. Setup & restore: `docs/README-private.md`（local-only）。

## Environment Rules (Claude harness 專屬；跨 agent 環境事實見 AGENTS.md「環境事實」)

- **git via the Bash tool**, never PowerShell (quoting/encoding mangles commit messages and paths).
- **Verify writes with a cheap independent check**: after an important Edit/Write, confirm with `git diff --stat` or a Grep for the new text before building on top (don't re-Read the whole file — the harness already tracks edit results; the residual risk is a stray `jekyll serve --watch` reverting files between operations, see AGENTS.md). 這是寫入層驗證；交付層驗收另有規則（`docs/agents/dispatch.md` §7）。Never narrate a result you didn't actually receive.
- **Waiting on CI/long jobs**: bare `sleep N && cmd` is blocked by the harness — use an `until`-loop poll (e.g. `until [ "$(gh run view <id> --json status --jq .status)" = "completed" ]; do sleep 15; done`) with `run_in_background`.
- **Playwright page checks**: `browser_evaluate` runs against about:blank — use `browser_run_code_unsafe` + `page.evaluate` on the real page.

## Local Skills（正本 `.agents/skills/`，`.claude/skills/` 為同步鏡像——見 Adapter 段）

- `/sync-social-article` — sync a LinkedIn Pulse / X post (or fuse both) into `_posts/`. **Always use it when given LinkedIn/X links** — it encodes the working extraction paths; WebFetch only returns paraphrases (unusable) and naive scraping hits login walls.
- `/s2m` — slides (PPTX/PDF) → per-page Markdown.
- `/codex-image` — 委派本機 codex CLI 生圖（文章 banner、插畫）。**本環境唯一的生圖管道**；有人物出鏡一律照 `AGENTS.md`「品牌角色形象」附參考圖。
- gstack skills: after a visual / Human-Design-engine / perf change, *offer* the matching skill (don't run unprompted) — see `docs/gstack-skills.md`.
