# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Jekyll-based portfolio site for Swanky Studio (史旺基工作室) hosted on GitHub Pages. Uses Jekyll's template system with layouts, includes, and front matter. All content is in Traditional Chinese (zh-TW).

## Architecture

- **`_config.yml`** — Jekyll site configuration
- **`Gemfile`** — GitHub Pages gem dependency
- **`_layouts/`** — Page templates: `default.html` (base), `home.html` (pass-through), `page.html` (standard), `post.html` (blog)
- **`_includes/`** — Shared partials: `head.html`, `header.html`, `footer.html`, `scripts.html`
- **`_posts/`** — Blog posts (photo gallery entries)
- **`assets/`** — Static files: CSS, JS, vendor libs, images
- **`nft/`** — Separate mini-site (not processed by Jekyll, has its own CSS/JS)

### Front Matter Variables

Pages use these custom front matter fields:
- `nav_active` — Highlights the active nav item (`home`, `photography`, `technical`, `education`, `nft`, `archive`, `blog`)
- `header_transparent` — Set to `true` for transparent header (only on index.html)
- `extra_css` — Inline CSS injected into `<style>` tag in head
- `extra_head` — Additional HTML injected into `<head>`

### Asset Paths

Always use Jekyll's `relative_url` filter for asset paths:
```
{{ '/assets/img/example.jpg' | relative_url }}
```

## Content & Tone Guidelines (內容與語氣規範)

- **Language**: All website copy, blog posts, and text content MUST be written in Traditional Chinese (zh-TW).
- **Domain Focus**: Content primarily revolves around professional photography, Web3 ecosystem development, and tech management insights.
- **Tone**: Maintain a professional, experienced, yet passionate tone suitable for a studio portfolio and a technical leader.
- **SEO & Accessibility**: Always ensure new images (especially photography works) have descriptive `alt` attributes for SEO and accessibility.

## Known Gotchas

- **Isotope + `loading="lazy"` conflict**: On pages using Isotope grid layout (like `for-your-safety.html`), do NOT use `loading="lazy"` on images. Lazy images don't block `window.load`, causing Isotope to calculate layout before images have dimensions, resulting in collapsed layouts.
- **Flickr image URLs**: Local copies use pattern `{photo_id}_{secret}_{size}.jpeg`. Flickr photo links use `https://www.flickr.com/photos/swanky-hsiao/{photo_id}/`.
- **nft/ directory**: This is a separate mini-site with its own build system (Prepros/SCSS). It is excluded from Jekyll processing via `_config.yml` defaults (`layout: null`). Do not add Jekyll front matter to nft/ files.
