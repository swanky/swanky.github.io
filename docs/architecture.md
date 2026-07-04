# Architecture Reference

> On-demand reference for swanky.github.io (Layer 3). `docs/` is excluded from Jekyll, so this file is never published. Linked from `CLAUDE.md`. Read before changing layouts, content collections, front matter, or the Human Design engine.

## Layout Inheritance

All layouts extend `default.html`, which assembles the page from includes:

```
default.html  →  head.html + header.html + {{ content }} + footer.html + scripts.html
  ├─ home.html      — Pass-through (used by index, blog, technical, education pages)
  ├─ page.html      — Standard page wrapper
  ├─ post.html      — Blog/photo gallery posts
  └─ article.html   — Articles collection entries
```

## Content Collections

- **`_posts/`** — Two types:
  - Photo gallery posts (`.html`): front matter includes `model_name`, `model_social`, `flickr_album`, `photo_count`, `cover_image`.
  - Article posts (`.md`): front matter includes `layout: article`, `categories`, `cover_image`, `hero_image`, `source_url` (LinkedIn, `www.` subdomain), `source_url_x` (X), `description`, `keywords`. Use `categories: [technical]` for 技術顧問 articles, `categories: [claude-code]` for AI學習分享 articles. `article.html` renders single- or dual-source「本文同步發佈於…」links from whichever `source_url*` fields exist.
- **Subdirectory pages** — nested HTML pages organised by section (see Site Structure below). (There is no `_articles/` collection — articles are regular posts with `layout: article`.)

## Site Structure

```
主頁          /
攝影寫真      /photography/  → photo-albums/ awards/ personal-works/ archive/ uniform/
技術顧問      /technical/    → articles/ ai-agent-consulting/ (AI Agent 導入顧問 offer page, homepage-funnel CTA target)
教育訓練      /education/    → modeling/ crypto/ (trading/ defi/ nft/) ai/ claude-code/
人類圖        /human-design/ ← client-side tool (see Human Design Generator below)
職場塔羅      /tarot/        ← client-side tool (see Tarot Reflection Tool below); compare.html = 原版偉特對照頁; daily/ = 今日一牌
自我探索      /explore/      ← 自我探索實驗室 hub（工具館總覽，data 驅動；see Self-Discovery Lab below）
星座命盤      /astrology/    ← client-side 星盤（beta：行星星座可信，ASC/宮位待 golden 驗證）
八字排盤      /bazi/         ← client-side 八字（beta：四柱五行十神大運可排，日柱錨點待 golden 驗證）
易經問卦      /iching/       ← client-side 起卦（六爻+梅花，本卦/動爻/之卦，非 beta）
奇門策略      /qimen/        ← 奇門策略地圖內容頁 + tool/ 教育示意工具（示意九宮格，非正式排盤）
媒體報導      /press/
NFT策展       /nft/          ← separate mini-site, excluded from Jekyll; index.html includes client-side wallet-connect CloneX gallery (publicnode RPC + Arweave, local-first images with on-chain fallback)
```

## nav_active Values

- `photography` — all photography section pages
- `technical` — technical consultant pages and `categories: [technical]` posts
- `education` — education pages and `categories: [claude-code]` posts
- `human-design` — human design generator page (`/human-design/`)
- `tarot` — workplace tarot reflection tool (`/tarot/`) and daily-tarot (`/tarot/daily/`)
- `explore` — 自我探索實驗室 hub (`/explore/`). The「自我探索」dropdown parent highlights for any nav_active in the `explore_navs` list (explore/human-design/astrology/bazi/ziwei/tarot/iching/qimen/…), defined at the top of `_includes/header.html`
- `qimen` — qimen strategy map (`/qimen/`) and demo tool (`/qimen/tool/`)
- `press` — press/media pages
- `nft` — NFT pages
- `home` — homepage only

## Front Matter Variables

- `nav_active` — Highlights the active nav item (see values above)
- `header_transparent` — `true` for transparent header (only on index.html)
- `extra_css` — Inline CSS injected into a `<style>` tag in head
- `extra_head` — Additional HTML injected into `<head>` (e.g. JSON-LD blocks)
- `use_isotope` — Loads Isotope JS (photography grid pages)
- `use_glightbox` — Loads GLightbox CSS+JS (photography lightbox pages)
- `use_purecounter` — Loads PureCounter JS (education/crypto, education/modeling pages)
- `use_human_design` — Loads the Human Design engine (vendor astronomy-engine UMD + `hd-ui.js` ES module) via `scripts.html`
- `use_tarot` — Loads the Tarot engine (`tarot-ui.js` ES module) via `scripts.html`
- `use_qimen_demo` — Loads the Qimen demo grid (`qimen-ui.js` → `qimen-grid.js` + `qimen-demo-data.js`) via `scripts.html` (educational demo, not real charting)
- `use_tarot_daily` — Loads the daily-tarot tool (`tarot-daily.js`, reusing the tarot engine + `core-daily.js` day-lock) via `scripts.html`
- `use_astrology` — Loads the astrology chart tool (vendor astronomy UMD + `astro-ui.js` → `astro-chart/houses/aspects/svg` + `core-astro`/`core-cities`) via `scripts.html`. **beta**: ASC/houses pending golden.
- `use_bazi` — Loads the Bazi chart tool (vendor astronomy UMD for solar-term search + `bazi-ui.js` → `bazi-pillars/solar/ganzhi/shishen/svg` + `core-astro`) via `scripts.html`. **beta**: day-pillar anchor & true-solar-time pending golden.
- `use_bazi_daily` — Loads the daily-wuxing tool (`bazi-daily.js`, day-pillar arithmetic only, no astronomy engine) via `scripts.html`.
- `use_iching` — Loads the I Ching tool (`iching-ui.js` → `iching-cast`/`iching-hexagrams`(64 King Wen)/`iching-data-texts`/`iching-svg` + `core-rng`) via `scripts.html`. Coins/plum-number/plum-time casting → primary + moving lines + resulting hexagram.
- `hero_image` — Opt-in top banner on single article pages (requires `cover_image`; default off). Site convention: synced LinkedIn/X articles set it `true`; `cover_image` alone still drives list cards / og:image / JSON-LD.
- **SEO / structured-data fields**: `seo_title` (`<title>` override), `keywords` (meta keywords), `breadcrumbs` (array of `{name, url}` → visible breadcrumb + `BreadcrumbList` JSON-LD via `breadcrumbs-jsonld.html`). See `_includes/head.html` for the full set of SEO/OpenGraph fields.

## Asset Paths

Always use Jekyll's `relative_url` filter:
```liquid
{{ '/assets/img/example.jpg' | relative_url }}
```

## Data Files (`_data/`)

- `services.yml` — Homepage service cards (title, icon, color, description)
- `divination_services.yml` — Self-discovery lab tool/service cards: `id, title, subtitle, category` (birth-map|inquiry|ritual|service|ethical-boundary), `status` (live|beta|coming-soon|manual-service|not-recommended), `visibility` (public|hidden|internal), `priority, phase, route, icon, input_type, use_cases, cta_label, note, related`; the `qimen` entry also carries `partner_cta {enabled,label,url}`. Public presentation fields only — internal scoring stays in the private plan doc. Rendered via `_includes/explore-category.html` + `explore-card.html`.
- `social_links.yml` — Footer social media links (used via `{% for %}` loop)

## Vendor Libraries (bundled in `assets/vendor/`)

Bootstrap, AOS (`data-aos`), Isotope, GLightbox, PureCounter, Animate.css, Boxicons, Bootstrap Icons. Isotope/GLightbox/PureCounter loaded conditionally via front matter flags.

## Human Design Generator (`/human-design/`)

A self-contained, client-side app — no backend; birth data never leaves the browser.

- **Page**: `human-design/index.html` — sets `use_human_design: true` and injects `WebApplication` + `FAQPage` JSON-LD via `extra_head`.
- **Engine** (`assets/js/human-design/`, 16 ES modules): `hd-engine` (orchestration), `hd-astro` (ephemeris via astronomy-engine), `hd-geometry` / `hd-mandala` / `hd-svg` / `hd-svg-string` (bodygraph rendering), `hd-judge`, `hd-timezone`, `hd-cities`, `hd-ui` (browser entry point), and `hd-data-*` (gates / channels / centers / texts / qr / fixing).
- **Fixing arrows**: planet-table ▲/▼ exaltation/detriment markers from `hd-data-fixing.js` (data ported from SharpAstrology, MIT). Nodes intentionally show no arrows — this matches the standard more closely than reference sites.
- **PNG export metadata**: downloaded card embeds birth data as a visible caption + iTXt chunk (`hd-svg.js` `injectPngText`; payload = name/date/time/place, no lat/lon). Name comes from the optional 姓名 field on the page.
- **Tests** (`tests/human-design/*.test.mjs`): run with `npm test` (`node --test`, also runs tarot tests). Covers astro, timezone, geometry, mandala, judge, and golden fixtures.
- **Tooling** (`tools/`): render & geometry-validation POCs, including `hd-report-poc.*` (paid-report prototype).
- **astronomy-engine loading** (non-obvious — see Known Gotchas in `CLAUDE.md`): browser uses the UMD global `Astronomy`; Node tests use `createRequire()` via the vendored `assets/vendor/astronomy-engine/package.json` `"type":"commonjs"` override.

## Tarot Reflection Tool (`/tarot/`)

A client-side tool framed as a **workplace reflection** aid (not fortune-telling / divination): write a question → spread is recommended by question complexity → draw (crypto-shuffled) → per-position readings → funnels to paid async/1:1 guidance (mailto + stablecoin), mirroring the HD funnel. Positioning, copy, and safety boundaries come from the owner's `tarot-1on1` skill (tarot as a reflection mirror).

- **Pages**: `tarot/index.html` (tool — sets `use_tarot: true`; injects `WebApplication` + `FAQPage` JSON-LD via `extra_head`; loaded by `_includes/scripts.html`; no third-party vendor, so it avoids the HD `type:module`/UMD gotcha) and `tarot/compare.html` (原版偉特 RWS × 史旺基版 deck-comparison page; shares the `tarot-overlay` lightbox shell with the tool's card modal).
- **Card art**: AI-generated 墨線復古 uniform-girl deck (all 78 rendered PNGs); print-resolution originals in `assets/img/tarot-print/` (1024×1536, in git but excluded from `_site`). Pip counts must be verified by high-zoom crops of the full-res PNG — low-zoom full-frame counting undercounts.
- **Engine** (`assets/js/tarot/`, ES modules, DOM-free logic layer is Node-testable): `tarot-rng` (crypto.getRandomValues + Fisher-Yates), `tarot-deck` (78-card structure), `tarot-spreads` (single/three/five + `recommendSpread` complexity heuristic), `tarot-draw`, `tarot-data-texts` (merges `tarot-text-{major,wands,cups,swords,pentacles}.js` — original zh-TW four-part readings), `tarot-card-svg` (programmatic card faces), `tarot-export-svg` (PNG + QR/CTA), `tarot-ui` (browser entry; defensive `setHTML`/`setText` like `hd-ui`).
- **Tests** (`tests/tarot/tarot.test.mjs`, `node --test`): deck integrity, shuffle/draw fairness, reading completeness (all 78 have 4 parts), and a banned-scare-word regression.
- **Content spec**: `tools/tarot-writing-spec.md` — voice + 7 safety rules used to author the card readings (no event prediction, no scare words, reversed = another angle, refer out when needed).
- **Gotcha**: the card-face SVG is re-parsed as **strict XML** for PNG export, so font-family names inside `style="…"` MUST use single quotes — double quotes break the attribute and the export silently fails to decode (on-page HTML render is lenient and hides the bug).

## Self-Discovery Lab (`/explore/`)

「Swanky 自我探索實驗室」把 `/human-design/` 與 `/tarot/` 從兩個單點工具，升級成有分類、藍圖、倫理立場與商業服務的工具館（Phase 1，詳規劃見私有 `docs/self-discovery-tools-plan.md`）。Hub 為 data-driven、無工具 JS。

- **Hub** (`explore/index.html`, `layout: home`): Hero + 四大分類（A 出生地圖 / B 當下問事 / C 行動儀式 / D 商業與策略服務，吃 `_data/divination_services.yml`）+ 產品藍圖 roadmap + 倫理邊界「有些事，我們選擇不做」（ethical-boundary 項）+ 技術透明區 + 免責。JSON-LD: CollectionPage + BreadcrumbList（後者由 breadcrumbs front matter 自動生成）。
- **共用 include 三件套**（新頁一律用；既有 HD／塔羅暫不強制改用，列 backlog）: `tool-privacy.html`（隱私 pill / 完整框，`daily=true` 加 localStorage 說明）、`tool-disclaimer.html`（`variant='medical-legal'` 加強版）、`tool-method-note.html`（排盤規則手風琴，`rules` 以 `|` 分隔、需唯一 `id`）。文字統一來源見規劃 §13。
- **Hub 元件**: `explore-category.html`（依 category + visibility=public 過濾 data 渲染區塊）→ `explore-card.html`（單卡：狀態 badge；live／manual-service 有 route 則整卡連結，coming-soon 用 `<details>` 展開 + 需求訊號 mailto + gtag `explore_signal`）。
- **Qimen** (`/qimen/`, `/qimen/tool/`): 策略地圖內容頁 + 教育示意工具。**Phase 1 只有示意九宮格，非正式排盤（誠實紅線）**；所有盤面標「示意資料／教育展示」。`assets/js/qimen/`: `qimen-grid.js`（`renderQimenGrid(container, gridData, {mode})`，純 CSS grid、tone 金/灰藍/中性、刻意不用紅色凶煞）+ `qimen-demo-data.js`（固定教學盤，上南下北）+ `qimen-ui.js`（入口，渲染所有 `[data-qimen-demo]`；tool 頁示意表單送出只顯示「開發中」說明）。人工服務 CTA 走 `divination_services.yml` 的 `qimen.partner_cta` fallback 到自營 mailto（不寫死合作人姓名）。正式排盤待 spike（Phase 5）。
- **Daily tarot** (`/tarot/daily/`): 今日一牌，復用塔羅引擎（deck/draw/READINGS/faceSvg/exportReadingPng），`assets/js/tarot/tarot-daily.js` + `assets/js/core/core-daily.js` 每日鎖（當日重訪同一張、「換一張」限一次、跨日重置；localStorage key `swanky-tarot-daily`）。不動塔羅主工具。
- **Astrology（beta）** (`/astrology/`): 星座命盤。`assets/js/core/core-astro.js`（re-export hd-astro 通用函式 + `obliquityDeg`/`gastDeg`，**不改 hd-astro，零回歸**）+ `core-cities.js`（~100 城市加經緯度，import hd-cities 合併，**不改 hd-cities**）。`assets/js/astrology/`: `astro-chart.js`（主計算 → chart JSON）、`astro-houses.js`（ASC/MC 公式 + Whole Sign/Equal + `|φ|>66°` 極地 guard）、`astro-aspects.js`（相位 + orb）、`astro-svg.js`（圓盤）、`astro-ui.js`（表單→`zonedToUtc`→排盤→渲染）、`astro-text-signs.js`（12 星座精簡原創文案）。**beta（誠實紅線）**：行星星座落點採高精度星曆可信；ASC/宮位公式須與 astro.com 逐筆 golden 驗證（±0.5°）才移除 beta。深度 ~172 條文案為後續（子代理生成 + 人工抽校）。`tests/astrology/` 覆蓋純函式 + computeChart sanity（太陽星座正確）。data 檔 astrology `status: beta`（explore-card 有 route 則整卡連結 + beta badge）。啟動包規劃見 `docs/self-discovery-phase2-execution-plan.md`。
- **Bazi（beta）** (`/bazi/`, `/bazi/daily/`): 八字排盤 + 今日五行。**不用農曆庫**：換年立春、換月十二節皆＝太陽黃經（`core-astro.searchSunLongitude`）；日柱＝Fliegel–Van Flandern CJDN + 錨點常數（`DAY_ANCHOR`，測試鎖定、待外部 golden）。`assets/js/bazi/`: `bazi-ganzhi.js`（干支/五行/藏干/納音/五虎遁/五鼠遁）、`bazi-solar.js`（節氣求解）、`bazi-pillars.js`（四柱+大運+真太陽時+子時規則）、`bazi-shishen.js`（十神/五行統計/日主強弱傾向，**不做用神推薦**）、`bazi-data-texts.js`、`bazi-svg.js`（命式卡 SVG + PNG iTXt payload `{tool:'bazi',v:1}`）、`bazi-ui.js`、`bazi-daily.js`。**beta（誠實紅線）**：四柱天文基礎可信；日柱錨點與真太陽時須與多個排盤站逐筆 golden 驗證才移除 beta。`tests/bazi/` 覆蓋五虎遁/五鼠遁全表、藏干、十神 10×10、日柱錨點、立春換年、23:00 換日、大運。data 檔 bazi `status: beta`、wuxing-daily `status: live`。
- **I Ching（易經問卦）** (`/iching/`): 六十四卦問卦。`core-rng.js`（薄封裝 tarot-rng）+ `assets/js/iching/`：`iching-hexagrams`（64卦 King Wen＋linesToHex 反查）、`iching-cast`（銅錢=secureRandomInt(2)×3、梅花數字/時間→本卦+動爻+之卦）、`iching-data-texts`（buildReading 結構化五段：象徵/處境/變化/反思/行動）、`iching-svg`（六爻卦象）、`iching-ui`（複用 recommendTopic）。整合梅花＋六爻起卦。**非 beta**：起卦與 64 卦為標準確定演算法、無需 golden；384 爻辭深度版留付費。`tests/iching/` 8 測試。data iching `status: live`。
- **Tests**: `tests/qimen/qimen.test.mjs`（示意盤 9 宮結構 + 8 門/9 星/8 神不重複 + 禁詞）、`tests/core/core-daily.test.mjs`（dayKey/isToday/canReroll date mock + mock localStorage round-trip）。皆已加入 `package.json` 的 `npm test` glob。
- **Nav**: 「自我探索」dropdown（`_includes/header.html` 頂部 `explore_navs` 清單控制父層高亮）收 總覽/人類圖/塔羅/奇門策略地圖；行動儀式類（今日一牌等）不進主導航。首頁 services 區下方有 `.explore-home-cta` banner 導入 hub。
- **Styles**: 共用樣式集中在 `assets/css/style.css` 末尾（「自我探索實驗室」＋「奇門」兩個 section）；daily 頁翻牌 CSS 走頁面 `extra_css`。調色板沿用塔羅頁（金 `#E5A300` / 暖底 `#fffaf0→#fdf3e0`）。

## Education — Claude Code course page (`/education/claude-code/`)

Introductory page only — it presents the offering but does **not** recruit/enrol students. Avoid banned terms (e.g. 橙皮書). Source material lives in a separate repo (see memory `project_claude_code_course_page` for specifics).
