# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Jekyll-based portfolio site for Swanky Studio (史旺基工作室) hosted on GitHub Pages. Based on the Moderna template (BootstrapMade). All content is in Traditional Chinese (zh-TW).

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

- **`_posts/`** — Photo gallery blog posts (HTML). Front matter includes `model_name`, `model_social`, `flickr_album`, `photo_count`, `cover_image`.
- **`_articles/`** — Technical/Web3 articles (Markdown). Front matter includes `source_url` (LinkedIn link), `cover_image`, `description`.
- **Subdirectory pages** — `photography/`, `modeling/`, `cryptocurrency/` contain nested HTML pages for each section.

### Front Matter Variables

Pages use these custom fields:
- `nav_active` — Highlights the active nav item (`home`, `photography`, `technical`, `education`, `nft`, `archive`, `blog`)
- `header_transparent` — Set to `true` for transparent header (only on index.html)
- `extra_css` — Inline CSS injected into `<style>` tag in head
- `extra_head` — Additional HTML injected into `<head>`
- `use_isotope` — Loads Isotope JS (photography grid pages)
- `use_glightbox` — Loads GLightbox CSS+JS (photography lightbox pages)
- `use_purecounter` — Loads PureCounter JS (cryptocurrency/modeling pages)

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

## Known Gotchas

- **Isotope + `loading="lazy"` conflict**: On pages using Isotope grid layout (like `for-your-safety.html`), do NOT use `loading="lazy"` on images. Lazy images don't block `window.load`, causing Isotope to calculate layout before images have dimensions, resulting in collapsed layouts.
- **Flickr image URLs**: Local copies use pattern `{photo_id}_{secret}_{size}.jpeg`. Flickr photo links use `https://www.flickr.com/photos/swanky-hsiao/{photo_id}/`.
- **nft/ directory**: This is a separate mini-site with its own build system (Prepros/SCSS). It is excluded from Jekyll processing via `_config.yml` defaults (`layout: null`). Do not add Jekyll front matter to nft/ files.
