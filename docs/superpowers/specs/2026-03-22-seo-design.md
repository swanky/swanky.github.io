# SEO Design — Swanky Studio 史旺基工作室

**Date:** 2026-03-22
**Site:** https://swanky.github.io
**Stack:** Jekyll + GitHub Pages

---

## Goals

Improve organic search visibility across three audience segments simultaneously:
- **Photography clients** — zh-TW terms: 攝影寫真、人像攝影、制服女孩攝影、台灣攝影師
- **Tech/corporate leads** — English/mixed: "blockchain consultant Taiwan", "agile coach"
- **Press/brand** — name terms: 史旺基、蕭宇程、Swanky Studio、Swanky Hsiao

---

## Baseline

| Component | Score | Key Issue |
|---|---|---|
| Head meta tags | 9/10 | Missing og:site_name, twitter:site, article OG metadata |
| Section page titles | 6/10 | Photography/Technical/Education inherit generic site title |
| Blog post structured data | 0/10 | No JSON-LD on any post |
| BreadcrumbList schema | 0/10 | Not present |
| Analytics | 0/10 | No tracking (GA4 ID already obtained: G-SB1R6G61LY) |
| robots.txt | 5/10 | Only sitemap line; no explicit directives |
| Post keywords | 5/10 | Most posts missing keywords front matter |

---

## Approach

Full technical SEO layer — fix all instrumentation and structured data gaps. Content strategy (keyword gap analysis, new pages) is out of scope; it follows once analytics data is available.

---

## Design

### 1. Google Analytics 4

Add the GA4 snippet to `_includes/scripts.html`. Measurement ID: `G-SB1R6G61LY`.

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SB1R6G61LY"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-SB1R6G61LY');
</script>
```

Place immediately before `</body>` or at the end of `scripts.html`, after all other vendor scripts.

---

### 2. Head Template Fixes (`_includes/head.html`)

Four additions:

**a. `og:site_name`**
```html
<meta property="og:site_name" content="Swanky Studio 史旺基工作室">
```

**b. `twitter:site`**
```html
<meta name="twitter:site" content="@swanky">
```

**c. `cover_image` → `og:image` wiring**

Current logic checks only `page.og_image`, falling back to `/assets/img/About_r.jpg`. Update to also check `page.cover_image`:

```liquid
{% if page.og_image %}
  <meta property="og:image" content="{{ page.og_image | absolute_url }}">
{% elsif page.cover_image %}
  <meta property="og:image" content="{{ page.cover_image | absolute_url }}">
{% else %}
  <meta property="og:image" content="{{ '/assets/img/About_r.jpg' | absolute_url }}">
{% endif %}
```

Apply the same three-way fallback to `twitter:image`.

**d. Article OG metadata + `og:type` fix**

The existing `og:type` tag in `head.html` only promotes to `article` when `page.layout == 'post'`, missing `layout: article` pages. Update that condition to:
```liquid
{% if page.layout == 'post' or page.layout == 'article' %}article{% else %}website{% endif %}
```

For post pages (`page.layout == 'post'` or `page.layout == 'article'`), also add:

```liquid
{% if page.layout == 'post' or page.layout == 'article' %}
  <meta property="article:published_time" content="{{ page.date | date_to_xmlschema }}">
  {% if page.last_modified_at %}
  <meta property="article:modified_time" content="{{ page.last_modified_at | date_to_xmlschema }}">
  {% endif %}
  <meta property="article:author" content="蕭宇程">
{% endif %}
```

---

### 3. Section Page Titles

Add `title` front matter to three section index pages:

| File | title value |
|---|---|
| `photography/index.html` | `攝影寫真` |
| `technical/index.html` | `技術顧問` |
| `education/index.html` | `教育訓練` |

The existing `head.html` template renders these as `攝影寫真 | Swanky Studio 史旺基工作室` — no template changes needed.

`press/index.html` already has `title: 媒體報導` — no change needed.

---

### 4. Article JSON-LD Structured Data

Create `_includes/post-jsonld.html`:

```html
{% if page.title %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": {{ page.title | jsonify }},
  {% if page.description %}"description": {{ page.description | jsonify }},{% endif %}
  {% if page.cover_image %}"image": "{{ page.cover_image | absolute_url }}",{% endif %}
  "datePublished": "{{ page.date | date_to_xmlschema }}",
  {% if page.last_modified_at %}"dateModified": "{{ page.last_modified_at | date_to_xmlschema }}",{% endif %}
  "author": {
    "@type": "Person",
    "name": "蕭宇程",
    "alternateName": "Swanky Hsiao",
    "url": "https://swanky.github.io"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Swanky Studio 史旺基工作室",
    "url": "https://swanky.github.io"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{{ page.url | absolute_url }}"
  },
  "url": "{{ page.url | absolute_url }}"
}
</script>
{% endif %}
```

Include in `_layouts/post.html` and `_layouts/article.html`:
```liquid
{% include post-jsonld.html %}
```

---

### 5. BreadcrumbList Schema

Create `_includes/breadcrumbs-jsonld.html`:

```html
{% if page.breadcrumbs %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {% for crumb in page.breadcrumbs %}
    {
      "@type": "ListItem",
      "position": {{ forloop.index }},
      "name": {{ crumb.name | jsonify }},
      "item": "{{ crumb.url | absolute_url }}"
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
</script>
{% endif %}
```

Include in `_layouts/page.html` and `_layouts/home.html`.

Layout coverage note:
- `layout: home` covers: `photography/index.html`, `technical/index.html`, `education/index.html`, `press/index.html`, `photography/awards.html`, `photography/personal-works.html`, `photography/commercial-works.html`, `photography/photo-albums.html`, `photography/flickr-gallery.html`, `photography/uniform/index.html`, and education subsection pages.
- `layout: page` covers: `photography/archive.html` and other flat `.html` pages.

Add `breadcrumbs` front matter to the following pages:

**Top-level sections (2-item breadcrumbs):**
- `photography/index.html`
- `technical/index.html`
- `education/index.html`
- `press/index.html`

**Photography subsections (3-item breadcrumbs, all flat `.html` files in `photography/`):**
- `photography/photo-albums.html`
- `photography/awards.html`
- `photography/personal-works.html`
- `photography/commercial-works.html`
- `photography/flickr-gallery.html`
- `photography/archive.html`
- `photography/uniform/index.html`

**Technical subsections:**
- `technical/articles.html`

**Education subsections:**
- `education/modeling/index.html`
- `education/crypto/index.html`
- `education/ai/index.html`

---

### 6. robots.txt

Create `robots.txt` in the repo root:

```
User-agent: *
Allow: /
Disallow: /assets/vendor/

Sitemap: https://swanky.github.io/sitemap.xml
```

This prevents crawlers from indexing vendor library files (Bootstrap, AOS, Isotope, etc.) which currently appear in the auto-generated sitemap.

---

### 7. Keywords Pass on Posts

Add `keywords` front matter to all posts in `_posts/` that are currently missing it. Keywords should:
- Include zh-TW terms matching the post topic
- Include English terms where relevant (for tech posts)
- Include brand terms (史旺基, Swanky Studio) on all posts
- Draw from the existing title and description — no invented terms

All 25 posts in `_posts/` are missing keywords front matter. Note that two posts are `.html` files (`2016-02-10-unicorn-wears-uniform.html`, `2016-03-10-*`) — these need keywords added as well, not just the `.md` files.

---

## Files Changed

| File | Change type |
|---|---|
| `_includes/scripts.html` | Add GA4 snippet |
| `_includes/head.html` | Add og:site_name, twitter:site, cover_image wiring, article OG metadata |
| `_includes/post-jsonld.html` | Create new — Article JSON-LD include |
| `_includes/breadcrumbs-jsonld.html` | Create new — BreadcrumbList include |
| `_layouts/post.html` | Include post-jsonld.html and breadcrumbs-jsonld.html |
| `_layouts/article.html` | Include post-jsonld.html |
| `_layouts/page.html` | Include breadcrumbs-jsonld.html |
| `_layouts/home.html` | Include breadcrumbs-jsonld.html |
| `photography/index.html` | title: 攝影寫真, breadcrumbs front matter |
| `technical/index.html` | title: 技術顧問, breadcrumbs front matter |
| `education/index.html` | title: 教育訓練, breadcrumbs front matter |
| `press/index.html` | breadcrumbs front matter only |
| ~11 subsection pages | breadcrumbs front matter |
| all 25 `_posts/` files (23 `.md` + 2 `.html`) | keywords front matter |
| `robots.txt` | Create new |

---

## Out of Scope

- Google Search Console setup (skipped by user preference)
- Content strategy / new keyword-targeted pages (follows after analytics data)
- Social sharing buttons on posts
- hreflang tags
- Image compression / Core Web Vitals
