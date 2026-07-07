# CLAUDE.md

Jekyll portfolio for Swanky Studio (史旺基工作室) on GitHub Pages. Deep structure & design context live in `docs/` — see Reference.

## Working Style

Execute autonomously; start without asking. Read relevant code first; make reasonable assumptions and proceed. Do the full job (edit, test, build); prefer the smallest maintainable diff. No mid-task check-ins unless the action would delete data, modify production config, push to a remote, or touch secrets. Report once at the end: files changed + why, test/build results, remaining risks.

**Definition of done**: never report「已完成」on an unverified change — but **batch the verification, don't run it per-change**. During dev use cheap checks only (`npm test`, Grep on source, `git diff`, Read). Run the one full `bundle exec jekyll build` + `_site/` grep (or browser) pass **once before push**, over all changes together. Never `jekyll serve --watch` in agent runs (see Environment Rules).

## Development Commands

- `bundle install` — install dependencies
- `bundle exec jekyll serve` — local dev at http://127.0.0.1:4000 (avoid in agent runs — the `--watch` residual reverts working files between tool calls; see Environment Rules)
- `bundle exec jekyll build` — build to _site/
- `npm test` — engine tests via `node --test` over recursive glob `tests/**/*.test.mjs` (8 suites: human-design, tarot, astrology, bazi, iching, qimen, core, numerology; no npm install needed). Cheap + reliable — the primary dev-time verification.
- Deploy is automatic on push to `master`. Production URL is **https://swanky.github.io** — the Flickr username `swanky-hsiao` is NOT part of the domain.
- Deploy status: `gh run list --limit 5`. If the **build** job fails → debug the repo. If build is green but **deploy** fails at `syncing_files` with "Deployment failed, try again later" → GitHub Pages transient; just `gh run rerun <id> --failed`.

## Environment Rules (Windows + agent harness)

Violating these is the top cause of failed first attempts — they override default habits:

- **git via the Bash tool**, never PowerShell (quoting/encoding mangles commit messages and paths).
- **Verify writes with an independent tool**: after an important Edit/Write, confirm with `git diff --stat`, Read, or Grep before building on top. A「success」you didn't independently verify is not done — never narrate a result you didn't actually receive.
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
- Synced LinkedIn/X articles: set `hero_image: true` (site-wide convention); `source_url` = LinkedIn (always `www.` subdomain), `source_url_x` = X. Layout renders single- or dual-source links automatically.
- 標點: Chinese prose uses full-width `，：；？！`; keep half-width inside English quotes and code.
- Bootstrap Icons: confirm the glyph class exists in the vendored CSS before using it (missing glyphs render as blank squares — past prod bug).

## Local Skills (`.claude/skills/`, not in git)

- `/sync-social-article` — sync a LinkedIn Pulse / X post (or fuse both) into `_posts/`. **Always use it when given LinkedIn/X links** — it encodes the working extraction paths; WebFetch only returns paraphrases (unusable) and naive scraping hits login walls.
- `/s2m` — slides (PPTX/PDF) → per-page Markdown.
- gstack skills: after a visual / Human-Design-engine / perf change, *offer* the matching skill (don't run unprompted) — see `docs/gstack-skills.md`.

## Known Gotchas

- **Isotope + `loading="lazy"`**: omit lazy on Isotope grid pages — collapses layout (Isotope runs before image dims known).
- **Flickr URLs**: local copies `{photo_id}_{secret}_{size}.jpeg`; photo links `https://www.flickr.com/photos/swanky-hsiao/{photo_id}/`.
- **`.gstack` / `.playwright-mcp` artifacts**: dev-tool output triggers watch-regenerate and can break local styling until a full `jekyll build` (already excluded in `_config.yml`).
- **Vendored astronomy-engine**: browser loads `astronomy.browser.min.js` as a classic script (global `Astronomy`) before the ES module; Node tests load it via `createRequire()` because `assets/vendor/astronomy-engine/package.json` sets `"type":"commonjs"`, overriding the repo-root `"type":"module"` (which exists only so Node treats `assets/js/human-design/*.js` as ESM for tests).

## Reference (read on demand)

- `docs/architecture.md` — site structure, layouts, collections, `nav_active`, front matter, `_data/`, vendor libs, Human Design / Tarot / NFT apps. **Read before changing layouts, collections, front matter, or the HD engine.**
- `docs/design.md` — brand, colors, tone, audiences, aesthetic. **Read before visual/design work.**
- `docs/gstack-skills.md` — recommended gstack skills + when to offer them.
- **Private docs**: all other `docs/` files (manuals, proposals, content plans — excluded from this public repo) are versioned by a **nested private git repo inside `docs/`** (remote `dropbox`, a Dropbox-synced bare repo). After editing them, commit+push from within `docs/`. Setup & new-machine restore: `docs/README-private.md` (local-only).
