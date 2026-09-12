# Design Reference

> On-demand reference for swanky.github.io (Layer 3). `docs/` is excluded from Jekyll, so this file is never published. Linked from `CLAUDE.md`. Read before visual/design work.

## Brand Colors

- Primary gold: `#E5A300`
- Secondary yellow: `#F5C53B`
- Deep gold（內文連結／文字強調的生效色，WCAG AA 5.7:1）: `#8B5E00`；token `--c-gold-deep: #8a5d00`
- Education 子系統輔助藍（僅限 education 家族 badge/callout）: `#4fa6d5`（舊「全站 accent blue」定位已於 2026-07 廢止）
- 金底按鈕文字一律深色 `#111`（2026-07-18 對比決策；白字對金底僅 2.19:1 不合格）

## Design System v2（2026-09-12 全站改版，branch `redesign/2026-09-editorial`）

單一真相源＝`assets/css/style.css` 最末段「Swanky Editorial Design System v2」（token → 基礎 → 外殼 → 按鈕 → 區塊標題 → 卡片 → 首頁 → 閱讀版面 → footer → 動效）。樣板遺留規則刻意保留不刪（多支測試以字串鎖定），系統層以同等或更高特異性在檔尾覆蓋。

- **Token**：色 `--c-gold/--c-gold-2/--c-gold-deep/--c-gold-soft/--c-gold-tint/--c-ink/--c-ink-2/--c-body/--c-muted/--c-line/--c-line-2/--c-paper/--c-paper-2/--c-cream`；字級 `--step--1…--step-6`（流動 clamp）；間距 `--space-2xs…--space-2xl`；圓角 `--r-sm 8/--r-md 12/--r-lg 18/--r-xl 28/--r-pill`；陰影 `--shadow-1/--shadow-2/--shadow-gold`（暖色）；動效 `--ease-out`（支援時為 `linear()` 彈性曲線）、`--dur-1/2/3`；`--header-h 76px`（≤991px 64px）／`--header-h-scrolled 62px`。
- **字體**：顯示字 `--font-display` = Fraunces（拉丁，靜態 500／600／斜 400）＋ Noto Serif TC（中文，**只取靜態 600**：可變字重每片 ~90KB、靜態 ~40KB；Google Fonts 依 unicode-range 切片載入，首頁約 12 片）；內文／UI `--font-sans` = Lato＋系統中文黑體。**只有 h1／h2 與少數顯示元素用襯線**（h3–h6、卡片標題維持無襯線，控制切片數）；全域 `text-wrap: balance`；段落 `text-wrap: pretty`。字型流量：改版前 325KB → 現 841KB（首頁首次載入，之後快取）。**中文不用 italic**（合成斜體），強調改金色螢光筆底線（`.section-eyebrow h2 em`）。
- **外殼**：header 改「墨色玻璃框」——`rgba(35,32,32,.82)`＋backdrop blur、頂端 2px 金色漸層線、白字＋金色滑入底線、下拉白色浮層（圓角 14／暖陰影／透明橋接防 hover 縫隙）、總覽鈕幽靈藥丸、合作洽詢金藥丸；首頁頂端透明、捲動後 62px。**玻璃底（backdrop-filter）放在 `#header::after`，不可放 `#header` 本體**——backdrop-filter 會讓 `position: fixed` 的手機選單抽屜改以 header 為包含區塊。手機選單＝右側暖紙抽屜（`#faf9f7`）＋墨色半透明覆蓋。**導覽列顏色一律寫死色碼**（`tests/mobile-nav-contrast` 真算 cascade，不吃 var()）。footer 改編輯式書尾：logo＋身分一句＋聯絡＋社群＋分區索引；h2 維持 18px（測試鎖定）。
- **按鈕**：行銷藥丸（`.btn-get-started/.btn-color/.btn-cta/.footer-cta`，金底深字→hover 墨底金字＋上浮＋金色陰影；次要描邊）；工具頁 10px 圓角矩形（`assets/css/tools.css`）。兩種以外不再發明。
- **卡片**：`.card/.services .icon-box/.team .member/.explore-card` 同一套表面（白底、`--c-line` 邊、`--r-lg`、`--shadow-1`，hover 上浮 4px＋`--shadow-2`＋金色邊）。
- **動效與現代 CSS**：跨文件 View Transitions（`@view-transition{navigation:auto}` 包在 `prefers-reduced-motion: no-preference`；Firefox 未支援自動略過）、文章閱讀進度條（`animation-timeline: scroll(root)` 包 `@supports`）、`@starting-style`、container queries（精選歷程列）、`content-visibility: auto`（team／footer）、Speculation Rules prefetch（Chromium）。全域 `prefers-reduced-motion: reduce` 一鍵停用動畫／轉場。
- **WebGL 絲綢背景** `assets/js/silk.js`：深色帶加 `data-silk="ink|blue|gold"`＋頁面 `use_silk: true`；DPR ≤1.5、內部解析度 0.6、不可見／分頁隱藏即停、reduce-motion 只畫靜態一幀、無 WebGL／`?nogl=1`／context lost 退回 CSS 底色。只用在沒有照片當主角的深色帶（首頁數據帶、技術 hero、explore 倫理區等），每頁最多 1–2 個。
- **頁尾收斂的刻意差異**：服務／行銷型 hub（technical、education、photography、human-design 服務段）以深色帶＋雙按鈕 CTA 收尾；工具／反思型頁（/explore/ 以「有些事，我們選擇不做」倫理區＋免責收尾、/tarot/ 以免責收尾）刻意不加總 CTA——入口已分散在各卡片，且誠實紅線比導流優先。這不是未對齊，審查時勿當缺陷。
- **標題顏色不全域設定**：h1–h6 只設字體不設 color，深色帶標題靠繼承父層文字色；亮色情境（`.section-title`、`.section-eyebrow h2`、`.article-header h1`、卡片標題等）逐一明確給 `--c-ink`。
- **404**：`404.html`（layout page、sitemap:false）——描邊大數字＋六個分區入口＋總覽鈕。

## Theme Families（2026-07-18 追認）

- **Base 亮色編輯**：暖白 `#faf9f7`＋金；首頁、explore、文章與 hub 頁。外殼（header／footer）自 2026-09 起為墨色 `#232020`＋金，內容區維持亮色。
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
