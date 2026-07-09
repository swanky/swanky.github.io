# CLAUDE.md

Jekyll portfolio for Swanky Studio (史旺基工作室) on GitHub Pages. Deep structure & design context live in `docs/` — see Rules Routing.

## Working Style

Execute autonomously; start without asking. Read relevant code first; make reasonable assumptions and proceed. Do the full job (edit, test, build); prefer the smallest maintainable diff. Report once at the end: files changed + why, verification output, remaining risks.

- **Commander mode**: 主線程是指揮官，context 是最稀缺資源。預估讀 **>3 檔或 >400 行**、「找找看」搜尋、批次改 **>2 檔**、或要**看任何圖檔**（使用者貼進對話的圖除外）→ 派 subagent，主線程只收結論＋file:line（規則 `docs/agents/dispatch.md`，模板 `docs/agents/delegation-templates.md`）。可能 >200 行的指令輸出一律截尾（`cmd 2>&1 | tail -30`）。依據：鑑識實測探索型讀檔外包率僅 0.8%＝最大漏（`docs/agents/diagnosis-2026-07.md`）。
- **Plan externalization**: ≥3 步驟的工作，開工前把步驟清單寫進 scratchpad 計畫檔，每完成一步立即更新；compaction 後第一動作＝重讀計畫檔。
- **Done ＝ 改了＋驗了＋證據在手**: never report「已完成」without pasteable verification output——缺證據就寫「已改、未驗」。**Batch the verification**: during dev use cheap checks only (`npm test`, Grep on source, `git diff`, Read); run the one full `bundle exec jekyll build` + `_site/` grep (or browser) pass **once before push**, over all changes together. 完成判準與各類產物底線驗法：`docs/agents/judgment.md` R2/R5。
- **Mid-task check-ins**: only for the stop-list in `docs/agents/judgment.md` R3 — delete data / modify production config / push to a remote / touch secrets / 對外商業決策（價格、稱謂、品牌語氣）/ 花錢。豁免：`docs/` nested repo 的 `git push dropbox`＝本機 Dropbox 同步、非對外，照既定慣例自動執行。其餘一律自主執行到完。

## Rules Routing（何時讀什麼；session 開頭不用預讀，觸發了再讀）

| 觸發情境 | 讀 |
|---|---|
| 要派 subagent、選 model、要驗收交付 | `docs/agents/dispatch.md`；派工直接套 `docs/agents/delegation-templates.md` |
| 拿不準：真的完成了嗎／要不要問使用者／該換路還是重試／要不要升級模型 | `docs/agents/judgment.md` |
| 想改 CLAUDE.md、docs/agents/*、或 memory 規則 | `docs/agents/maintenance.md`（**先讀再改**） |
| 改 layouts、collections、front matter、或 Human Design engine | `docs/architecture.md` |
| 視覺／設計工作 | `docs/design.md` |
| 新接手本環境、或想了解制度為何這樣設計 | `docs/agents/letter-to-future-sessions.md`、`docs/agents/diagnosis-2026-07.md` |

Precedence when rules conflict: **user's live instruction > CLAUDE.md > docs/agents/* > memory**. 依高優先者執行，並修正低優先檔＋在回報中說明（修正動作本身仍受 `docs/agents/maintenance.md` §1 分層約束——黃／紅區先問）。

**Private docs**: `docs/` 除 `.gitignore` 白名單三檔（architecture / design / gstack-skills）外都不進公開 repo，由 **nested private git repo inside `docs/`**（remote `dropbox`）版本控制。After editing them, commit+push from within `docs/`. Setup & restore: `docs/README-private.md`（local-only）。

## Development Commands

- `bundle install` — install dependencies
- `bundle exec jekyll serve` — local dev at http://127.0.0.1:4000 (avoid in agent runs — the `--watch` residual reverts working files between tool calls; see Environment Rules)
- `bundle exec jekyll build` — build to _site/
- `npm test` — engine tests via `node --test` over `tests/**/*.test.mjs` (8 suites; no npm install needed). Cheap + reliable — the primary dev-time verification.
- Deploy is automatic on push to `master`. Production URL is **https://swanky.github.io** — the Flickr username `swanky-hsiao` is NOT part of the domain.
- Deploy status: `gh run list --limit 5`. If the **build** job fails → debug the repo. If build is green but **deploy** fails at `syncing_files` with "Deployment failed, try again later" → GitHub Pages transient; just `gh run rerun <id> --failed`.

## Environment Rules (Windows + agent harness)

Violating these is the top cause of failed first attempts — they override default habits:

- **git via the Bash tool**, never PowerShell (quoting/encoding mangles commit messages and paths).
- **Verify writes with an independent tool**: after an important Edit/Write, confirm with `git diff --stat`, Read, or Grep before building on top. 這是寫入層驗證（每次寫入後）；交付層驗收另有規則（`docs/agents/dispatch.md` §7）。Never narrate a result you didn't actually receive.
- **Never `jekyll serve --watch` in agent runs**: a leftover watcher regenerates/clears working-dir files in the gap between tool calls (stable within one call, reverts between calls) — this is the real「寫入不穩」, not a broken machine. Use one-shot `bundle exec jekyll build`, batched before push. If files mysteriously revert, `Get-Process ruby | Stop-Process -Force` first.
- **Python with Chinese output**: always `python -X utf8` (default cp950 throws UnicodeEncodeError). Git Bash `/tmp` is MSYS-virtual — native Windows programs can't see it; use real Windows paths (e.g. the scratchpad dir).
- **Waiting on CI/long jobs**: bare `sleep N && cmd` is blocked by the harness — use an `until`-loop poll (e.g. `until [ "$(gh run view <id> --json status --jq .status)" = "completed" ]; do sleep 15; done`) with `run_in_background`.
- **Playwright page checks**: `browser_evaluate` runs against about:blank — use `browser_run_code_unsafe` + `page.evaluate` on the real page.

## Constraints

- **Language**: all site copy MUST be Traditional Chinese (zh-TW).
- **Asset paths**: always `{{ '/path' | relative_url }}`.
- **RWA**: always write 「現實世界資產」 (never 真實世界資產); keep the RWA acronym + English term.
- **Personal title in site copy**: always 「大型電信業技術主管」 — never the employer's company name or internal title (deliberate brand/employer separation; `index.html` JSON-LD `worksFor` is the one intentional exception).
- **Two 熊熊 — never confuse**: 吳暐榕 = 制服模特兒; 卓毓彤 = 一線藝人.
- **Don't** put Jekyll front matter in `nft/` files (separate mini-site, excluded from Jekyll).
- **Don't** hand-edit vendored libs in `assets/vendor/`.

## Content Conventions (articles & images)

- Article posts live in `_posts/YYYY-MM-DD-slug.md` with `layout: article`; `categories: [technical]` (技術顧問), `[claude-code]` (AI學習分享), or `[photography]` (攝影作品).
- `cover_image` is always a `.jpg` (convert PNG sources to JPEG); list cards crop covers to 16:9 — pick/crop accordingly.
- Synced LinkedIn/X articles: set `hero_image: true`; `source_url` = LinkedIn (always `www.` subdomain), `source_url_x` = X. Layout renders single- or dual-source links automatically.
- 標點: Chinese prose uses full-width `，：；？！`; keep half-width inside English quotes and code.
- Bootstrap Icons: confirm the glyph class exists in the vendored CSS before using it (missing glyphs render as blank squares — past prod bug).

## Local Skills (`.claude/skills/` — s2m 與 sync-social-article 已入庫跨機沿用)

- `/sync-social-article` — sync a LinkedIn Pulse / X post (or fuse both) into `_posts/`. **Always use it when given LinkedIn/X links** — it encodes the working extraction paths; WebFetch only returns paraphrases (unusable) and naive scraping hits login walls.
- `/s2m` — slides (PPTX/PDF) → per-page Markdown.
- gstack skills: after a visual / Human-Design-engine / perf change, *offer* the matching skill (don't run unprompted) — see `docs/gstack-skills.md`.

## Known Gotchas

- **Isotope + `loading="lazy"`**: omit lazy on Isotope grid pages — collapses layout (Isotope runs before image dims known).
- **Flickr URLs**: local copies `{photo_id}_{secret}_{size}.jpeg`; photo links `https://www.flickr.com/photos/swanky-hsiao/{photo_id}/`.
- **`.gstack` / `.playwright-mcp` artifacts**: dev-tool output triggers watch-regenerate and can break local styling until a full `jekyll build` (already excluded in `_config.yml`).
- **Vendored astronomy-engine**: browser loads `astronomy.browser.min.js` as a classic script (global `Astronomy`) before the ES module; Node tests load it via `createRequire()` because `assets/vendor/astronomy-engine/package.json` sets `"type":"commonjs"`, overriding the repo-root `"type":"module"` (which exists only so Node treats `assets/js/human-design/*.js` as ESM for tests).
