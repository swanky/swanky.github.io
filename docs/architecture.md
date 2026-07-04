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
職場塔羅      /tarot/        ← client-side tool (see Tarot Reflection Tool below); compare.html = 原版偉特對照頁
媒體報導      /press/
NFT策展       /nft/          ← separate mini-site, excluded from Jekyll; index.html includes client-side wallet-connect CloneX gallery (publicnode RPC + Arweave, local-first images with on-chain fallback)
```

## nav_active Values

- `photography` — all photography section pages
- `technical` — technical consultant pages and `categories: [technical]` posts
- `education` — education pages and `categories: [claude-code]` posts
- `human-design` — human design generator page (`/human-design/`)
- `tarot` — workplace tarot reflection tool (`/tarot/`)
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
- `hero_image` — Opt-in top banner on single article pages (requires `cover_image`; default off). Site convention: synced LinkedIn/X articles set it `true`; `cover_image` alone still drives list cards / og:image / JSON-LD.
- **SEO / structured-data fields**: `seo_title` (`<title>` override), `keywords` (meta keywords), `breadcrumbs` (array of `{name, url}` → visible breadcrumb + `BreadcrumbList` JSON-LD via `breadcrumbs-jsonld.html`). See `_includes/head.html` for the full set of SEO/OpenGraph fields.

## Asset Paths

Always use Jekyll's `relative_url` filter:
```liquid
{{ '/assets/img/example.jpg' | relative_url }}
```

## Data Files (`_data/`)

- `services.yml` — Homepage service cards (title, icon, color, description)
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

## Education — Claude Code course page (`/education/claude-code/`)

Introductory page only — it presents the offering but does **not** recruit/enrol students. Avoid banned terms (e.g. 橙皮書). Source material lives in a separate repo (see memory `project_claude_code_course_page` for specifics).
