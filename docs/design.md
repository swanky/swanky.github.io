# Design Reference

> On-demand reference for swanky.github.io (Layer 3). `docs/` is excluded from Jekyll, so this file is never published. Linked from `CLAUDE.md`. Read before visual/design work.

## Brand Colors

- Primary gold: `#E5A300`
- Secondary yellow: `#F5C53B`
- Deep gold（內文連結／文字強調的生效色，WCAG AA 5.7:1）: `#8B5E00`；token `--c-gold-deep: #8a5d00`
- Education 子系統輔助藍（僅限 education 家族 badge/callout）: `#4fa6d5`（舊「全站 accent blue」定位已於 2026-07 廢止）
- 金底按鈕文字一律深色 `#111`（2026-07-18 對比決策；白字對金底僅 2.19:1 不合格）

## Theme Families（2026-07-18 追認）

- **Base 亮色編輯**：暖白 `#faf9f7`＋金；首頁、explore、文章與 hub 頁。
- **Photography 作者頁深色 noir**（刻意）：`--photo-ink #10100f` × `--photo-paper #f3efe6` 交替＋金。
- **Technical 深藍**（刻意，2026-07-18 正式追認）：白底＋深藍 hero `#07111f`；AI 顧問線用藍 `#176bff`、Web3 線用金——雙軌強調色。
- **Education 暖紙**：`--edu-paper #FFFDF9`／`--edu-cream #FAF5EA`＋金＋子系統藍。
- **Cyber Tarot Lab 深色霓虹**（刻意）：`#050914`＋青 `#66E5FF`；僅 hub 家族（/tarot/、lab、decks×3）。
- **自我探索工具頁**：亮色暖金；**按鈕語言＝圓角矩形（統一 10px）＋必有 hover**——與行銷頁的藥丸（50px/999px）並立為兩種正式按鈕語言（2026-07-18 D1 決策）：行銷/導流用藥丸、工具/功能操作用 10px 圓角矩形。
- nft/ 為 legacy 獨立 mini-site，不納入品牌系統。

## 版面結構規範（2026-07-22 立，源於站主抓到的審查盲點）

跨頁「版面用滿感」由兩個結構指標決定，與色調無關，日後設計審查必須把它列為跨頁比對維度（2026-07 審查只比了元件層與色調層，漏掉此維度）：

- **Hub／登陸頁 hero 撐屏**：`min-height: max(640px, 85svh)`＋`display:flex; align-items:center`（tarot decks 家族 680px 地板）；≤767px 一律退回 `min-height:auto`。先例：`.edu-hero`、`.explore-hero`、`.ct-section--hero`、`.tech-hero`、`.photo-author-hero`。
- **深色滿版節奏帶**：每個 hub 頁至少 1 段深色滿版 section 製造明暗節奏。用色按家族 token：Base `#232020`（--c-ink）、Education `#26231f`、Technical `#07111f`、Tarot `#050914`、nft `#0a1024`（2026-09-02 起 /nft/ 首頁與 UCX 頁共用 ucx.css 的 `--ink`；舊 `#13111C` 僅剩 /nft/oursong/ 的模板頁）。深色帶上金字一律亮金 `#E5A300`（深金 `#8a5d00` 僅限亮底）；次要文字 `rgba(255,255,255,.72)` 起跳。
- **工具頁例外（硬約束）**：輸入表單／工具主體必須在 1440×900 與 390×844 首屏內——工具頁 hero 不加 min-height，改用「亮色漸層＋細點陣質感層」＋頁尾 `.tool-cta-dark`（#232020）深色帶補節奏。
- **Listing 頁輕量身分帶**：320–420px 深底帶（`.tech-listing-band`、`.press-hero`），不撐滿屏。

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
