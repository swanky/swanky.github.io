# CLAUDE.md

## Overview

Jekyll-based portfolio site for Swanky Studio (史旺基工作室) hosted on GitHub Pages. Based on the Moderna template (BootstrapMade). All content is in Traditional Chinese (zh-TW).

## Working Style

Execute tasks autonomously. Start immediately without asking for confirmation.

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

```
主頁          /
攝影寫真      /photography/  → photo-albums/ awards/ personal-works/ archive/ uniform/
技術顧問      /technical/    → articles/
教育訓練      /education/    → modeling/ crypto/ (trading/ defi/ nft/) ai/
媒體報導      /press/
NFT策展       /nft/          ← separate mini-site, excluded from Jekyll
```

### nav_active Values

- `photography` — all photography section pages
- `technical` — technical consultant pages and `categories: [technical]` posts
- `education` — education pages and `categories: [claude-code]` posts
- `human-design` — human design generator page (`/human-design/`)
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

Bootstrap, AOS (`data-aos`), Isotope, GLightbox, PureCounter, Animate.css, Boxicons, Bootstrap Icons. Isotope/GLightbox/PureCounter loaded conditionally via front matter flags.

### Brand Colors

- Primary gold: `#E5A300`
- Secondary yellow: `#F5C53B`
- Accent blue: `#4fa6d5`

## Content & Tone Guidelines

- **Language**: All website copy, blog posts, and text content MUST be written in Traditional Chinese (zh-TW).
- **Domain Focus**: Content primarily revolves around professional photography, Web3 ecosystem development, and tech management insights.
- **Tone**: Maintain a professional, experienced, yet passionate tone suitable for a studio portfolio and a technical leader.
- **SEO & Accessibility**: Always ensure new images (especially photography works) have descriptive `alt` attributes for SEO and accessibility.

## Design Context

**Audiences**: Photography clients, tech/corporate partners, photography fans, media/press.

**Brand**: 親切 × 多才多藝 — Genuine · Multifaceted · Distinguished. Award-winning photographer (TIME Magazine, PX3, IPA) + senior tech leader (Taiwan Mobile, PhD NTNU, blockchain). Warm and accomplished, not cold and corporate.

**Aesthetic**: Editorial magazine warmth — light mode, gold (#E5A300) as signature accent, photography as hero. Avoid cold tech-startup feel or generic Bootstrap look.

**Principles**: Lead with craft. One coherent identity. Gold used with intention. Vary section treatments for editorial rhythm. Commit fully to zh-TW.

## Known Gotchas

- **Isotope + `loading="lazy"` conflict**: Omit `loading="lazy"` on Isotope grid pages — lazy images cause collapsed layouts because Isotope runs before image dimensions are known.
- **Flickr image URLs**: Local copies use pattern `{photo_id}_{secret}_{size}.jpeg`. Flickr photo links use `https://www.flickr.com/photos/swanky-hsiao/{photo_id}/`.
- **nft/ directory**: Separate mini-site (Prepros/SCSS), excluded from Jekyll via `_config.yml`. Keep Jekyll front matter out of nft/ files.
