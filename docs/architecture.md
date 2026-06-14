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
  - Article posts (`.md`): front matter includes `layout: article`, `categories`, `cover_image`, `source_url`, `description`. Use `categories: [technical]` for 技術顧問 articles, `categories: [claude-code]` for AI學習分享 articles.
- **`_articles/`** — Technical/Web3 articles (Markdown). Front matter includes `source_url` (LinkedIn link), `cover_image`, `description`.
- **Subdirectory pages** — nested HTML pages organised by section (see Site Structure below).

## Site Structure

```
主頁          /
攝影寫真      /photography/  → photo-albums/ awards/ personal-works/ archive/ uniform/
技術顧問      /technical/    → articles/
教育訓練      /education/    → modeling/ crypto/ (trading/ defi/ nft/) ai/ claude-code/
人類圖        /human-design/ ← client-side tool (see Human Design Generator below)
媒體報導      /press/
NFT策展       /nft/          ← separate mini-site, excluded from Jekyll
```

## nav_active Values

- `photography` — all photography section pages
- `technical` — technical consultant pages and `categories: [technical]` posts
- `education` — education pages and `categories: [claude-code]` posts
- `human-design` — human design generator page (`/human-design/`)
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
- **Engine** (`assets/js/human-design/`, 15 ES modules): `hd-engine` (orchestration), `hd-astro` (ephemeris via astronomy-engine), `hd-geometry` / `hd-mandala` / `hd-svg` / `hd-svg-string` (bodygraph rendering), `hd-judge`, `hd-timezone`, `hd-cities`, `hd-ui` (browser entry point), and `hd-data-*` (gates / channels / centers / texts / qr).
- **Tests** (`tests/human-design/*.test.mjs`): run with `npm test` (`node --test`). Covers astro, timezone, geometry, mandala, judge, and golden fixtures.
- **Tooling** (`tools/`): render & geometry-validation POCs, including `hd-report-poc.*` (paid-report prototype).
- **astronomy-engine loading** (non-obvious — see Known Gotchas in `CLAUDE.md`): browser uses the UMD global `Astronomy`; Node tests use `createRequire()` via the vendored `assets/vendor/astronomy-engine/package.json` `"type":"commonjs"` override.

## Education — Claude Code course page (`/education/claude-code/`)

Introductory page only — it presents the offering but does **not** recruit/enrol students. Avoid banned terms (e.g. 橙皮書). Source material lives in a separate repo (see memory `project_claude_code_course_page` for specifics).
