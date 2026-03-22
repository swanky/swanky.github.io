# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Jekyll-based portfolio site for Swanky Studio (史旺基工作室) hosted on GitHub Pages. Based on the Moderna template (BootstrapMade). All content is in Traditional Chinese (zh-TW).

## Working Style

Execute tasks autonomously. Do not ask for confirmation before starting.

1. **Read first** — Study the relevant code and config before making any changes.
2. **Assume and proceed** — Make reasonable assumptions rather than stopping to ask.
3. **Do the full job** — Edit files, add tests where applicable, run lint/test/build.
4. **Prefer minimal changes** — When multiple approaches are viable, choose the one with the smallest diff and highest maintainability.
5. **No mid-task check-ins** — Proceed without confirmation unless the action would delete data, modify production config, push to a remote, or touch secrets.
6. **Report once at the end:**
   - Which files changed and why
   - Test/build results
   - Any remaining risks or follow-up recommendations

## Development Commands

```bash
bundle install                  # Install dependencies
bundle exec jekyll serve        # Local dev server at http://127.0.0.1:4000
bundle exec jekyll serve --drafts  # Include _drafts/ posts
bundle exec jekyll build        # Build to _site/
```

Deployment is automatic — GitHub Pages rebuilds on push to `master`.

## Architecture

### Layout Inheritance

All layouts extend `default.html`, which assembles the page from includes:

```
default.html  →  head.html + header.html + {{ content }} + footer.html + scripts.html
  ├─ home.html      — Pass-through (used by index, blog, technical, education pages)
  ├─ page.html      — Standard page wrapper
  ├─ post.html      — Blog/photo gallery posts
  └─ article.html   — Articles collection entries
```

### Content Collections

- **`_posts/`** — Two types:
  - Photo gallery posts (`.html`): front matter includes `model_name`, `model_social`, `flickr_album`, `photo_count`, `cover_image`.
  - Article posts (`.md`): front matter includes `layout: article`, `categories`, `cover_image`, `source_url`, `description`. Use `categories: [technical]` for 技術顧問 articles, `categories: [claude-code]` for AI學習分享 articles.
- **`_articles/`** — Technical/Web3 articles (Markdown). Front matter includes `source_url` (LinkedIn link), `cover_image`, `description`.
- **Subdirectory pages** — nested HTML pages organised by section (see Site Structure below).

### Site Structure

Navigation has four top-level sections, each with sub-pages:

```
主頁          /
攝影寫真      /photography/
  ├─ 總覽                   /photography/
  ├─ 出版                   /photography/photo-albums/
  ├─ 獎項                   /photography/awards/
  ├─ 作品 (個人/商業/Flickr) /photography/personal-works/ etc.
  ├─ 歷年記錄               /photography/archive/
  └─ 制服．女孩 × 史旺基   /photography/uniform/   ← (nav: 攝影寫真→作品; images in assets/img/uniform/)

技術顧問      /technical/
  ├─ 總覽                   /technical/
  └─ 專欄文章               /technical/articles/

教育訓練      /education/
  ├─ 總覽                   /education/
  ├─ 模特兒課程             /education/modeling/
  ├─ 加密貨幣課程           /education/crypto/
  │    ├─ trading           /education/crypto/trading/
  │    ├─ defi              /education/crypto/defi/
  │    └─ nft               /education/crypto/nft/
  └─ AI學習分享             /education/ai/

媒體報導      /press/
NFT策展       /nft/   ← separate mini-site, excluded from Jekyll
```

### nav_active Values

- `photography` — all photography section pages
- `technical` — technical consultant pages and `categories: [technical]` posts
- `education` — education pages and `categories: [claude-code]` posts
- `press` — press/media pages
- `nft` — NFT pages
- `home` — homepage only

### Front Matter Variables

Pages use these custom fields:
- `nav_active` — Highlights the active nav item (see values above)
- `header_transparent` — Set to `true` for transparent header (only on index.html)
- `extra_css` — Inline CSS injected into `<style>` tag in head
- `extra_head` — Additional HTML injected into `<head>`
- `use_isotope` — Loads Isotope JS (photography grid pages)
- `use_glightbox` — Loads GLightbox CSS+JS (photography lightbox pages)
- `use_purecounter` — Loads PureCounter JS (education/crypto, education/modeling pages)

### Asset Paths

Always use Jekyll's `relative_url` filter:
```liquid
{{ '/assets/img/example.jpg' | relative_url }}
```

### Data Files (`_data/`)

- `services.yml` — Homepage service cards (title, icon, color, description)
- `social_links.yml` — Footer social media links (used via `{% for %}` loop)

### Vendor Libraries (bundled in assets/vendor/)

Bootstrap (grid/components), AOS (scroll animations via `data-aos`), Isotope (masonry grids, conditional), GLightbox (lightboxes, conditional), PureCounter (animated counters, conditional), Animate.css, Boxicons, Bootstrap Icons. Isotope/GLightbox/PureCounter are loaded conditionally via front matter flags — see Front Matter Variables above.

### Brand Colors

- Primary gold: `#E5A300`
- Secondary yellow: `#F5C53B`
- Accent blue: `#4fa6d5`

## Content & Tone Guidelines (內容與語氣規範)

- **Language**: All website copy, blog posts, and text content MUST be written in Traditional Chinese (zh-TW).
- **Domain Focus**: Content primarily revolves around professional photography, Web3 ecosystem development, and tech management insights.
- **Tone**: Maintain a professional, experienced, yet passionate tone suitable for a studio portfolio and a technical leader.
- **SEO & Accessibility**: Always ensure new images (especially photography works) have descriptive `alt` attributes for SEO and accessibility.

## Design Context

### Users
Four overlapping audiences visit this site:
1. **Photography clients** — individuals or brands considering hiring Swanky for portrait/commercial shoots
2. **Tech/corporate partners** — companies seeking blockchain consulting, agile coaching, or technical leadership
3. **Photography fans and followers** — people who follow Swanky's award-winning work (PX3, IPA, TIME Magazine)
4. **Media and press** — journalists, editors, publishers looking for bio, coverage, and contact info

### Brand Personality
**親切 × 多才多藝** — Approachable and Versatile. Three-word personality: **Genuine · Multifaceted · Distinguished**

Swanky spans two worlds: award-winning portrait photographer (TIME Magazine, PX3 France, IPA USA) and senior tech leader (Taiwan Mobile manager, PhD NTNU, blockchain researcher, agile coach). Warm and human, not cold and corporate; accomplished but not arrogant.

### Aesthetic Direction
**Mixed creative professional** — editorial warmth, art + tech. Not purely a photographer's portfolio nor a tech consultant's site. Think editorial magazine: visual, curated, human — with enough gravitas for serious professional credentials.

- **Theme**: Light mode, editorial warmth. Gold (#E5A300) is a signature, not just a button color.
- **Photography**: Award-winning work should be the hero. Images should breathe and dominate.
- **NOT**: Cold blue tech startup, dark mode with glowing accents, generic Bootstrap template feel.

### Design Principles
1. **Lead with craft** — The photography is TIME Magazine level. The site should feel worthy of that work.
2. **One identity, many facets** — Present one coherent, multi-dimensional person — not siloed "photographer" vs. "tech guy."
3. **Gold as signature** — Use #E5A300 with intention as accent, highlight, and identity marker.
4. **Editorial rhythm** — Vary section treatments dramatically to create a magazine-like reading experience.
5. **Chinese-first confidence** — Fully commit to zh-TW. Mixed Chinese/English CTAs should be resolved.

## Known Gotchas

- **Isotope + `loading="lazy"` conflict**: On pages using Isotope grid layout (like `for-your-safety.html`), do NOT use `loading="lazy"` on images. Lazy images don't block `window.load`, causing Isotope to calculate layout before images have dimensions, resulting in collapsed layouts.
- **Flickr image URLs**: Local copies use pattern `{photo_id}_{secret}_{size}.jpeg`. Flickr photo links use `https://www.flickr.com/photos/swanky-hsiao/{photo_id}/`.
- **nft/ directory**: This is a separate mini-site with its own build system (Prepros/SCSS). It is excluded from Jekyll processing via `_config.yml` defaults (`layout: null`). Do not add Jekyll front matter to nft/ files.
