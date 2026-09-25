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
- **首頁「代表成果」（2026-09-25 v2）**：**不用卡片**——站主看過四張白卡格＋兩張等寬大卡的版本後回饋「沒設計感、圖太多讀取慢」（卡片格緊貼下方 Services 卡片格，兩層卡片相疊）。改回 `.works-list/.work-row` 編輯索引列（Fraunces 斜體金序號、襯線標題、金 tint hover）＋每列一張 4:3 小縮圖（`.works-list--thumbs .w-thumb`，桌機 200px／窄容器 110px；東吳列沒有真正的課堂照片，縮圖位改成墨底金字文字磚 `.w-thumb--tile`，不拿別的課的照片冒充——站主 2026-09-25 抓到）；創作區只有一張滿版橫幅（`.wc-banner`：桌機 2.2:1、字疊底部深色漸層；≤767px 圖上字下）＋《金瓶異夢》次要一列（`.wc-row`，縮圖欄 280px 讓縮圖高≈文字塊高，eyebrow 不高出縮圖頂）。圖片 8 組 WebP 由 `tools/build-home-images.py` 產生（三本書封＝Pillow 合成一張，不用 `books.jpg`；2026-09-25 補「認識史旺基」肖像 1:1 與「其他亮點」兩張活動照 16:9，原 jpg 不刪、JSON-LD 仍指原檔）。
- **首頁「合作方式」（2026-09-25）**：白色圓角卡格改編輯式髮絲線欄（style.css §15：`section.services` 帶底 `--c-paper-2`、`.icon-box` 透明底＋上緣 1px `--c-line-2`、序號 Fraunces 斜體金、hover 只換線色與標題色不浮起；`.explore-home-cta` 同步改上下髮絲線）。理由：緊接代表成果索引列的白卡格讓下滑到中段時編輯感中斷（設計 QA F1）；卡片內容、順序、按鈕都沒動，回退＝刪 §15。
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
- **SWANKY MODELS 虛擬模特兒經紀子站**（/photography/models/，2026-09-24）：紙本 lookbook 調性——暖紙 `#f6f4ef`＋炭墨 `#111110`＋髮絲線，Fraunces 大字標；金色只作 hover 與細節。**子站接管外殼**（`_layouts/models.html`，不掛全站 header／footer，比照金瓶梅子站先例；回退＝七頁 front matter 改回 `layout: home`）。**可點元素刻意不用藥丸也不用實心按鈕**：一律「常規字重＋墨色底線」的文字連結，洽詢入口是一行大字宋體底線連結（`.sm-biglink`）——六輪獨立設計評審一致認為藥丸與實心矩形在這套髮絲線幾何裡都像外來元件；屬子站主題家族的例外，不外溢到其他頁。**2026-09-25 v9 減法**：首頁不再翻黑、不再有索引表——結構只剩報頭字標→三聯幅名冊照→一行導言→每位一本的滿版跨頁（既有核准書圖）→大字洽詢→colophon；宣言引文移到洽詢頁當紙底 blockquote（`.sm-quote`）。**名冊照（`_includes/models/digital.html`）是三張「同棚、同窗光、同 85mm、同底片調色」的站姿四分之三身像**（2:3 原生，本地 webp 三檔），刻意不做經紀公司 polaroid（站主 08-12 否決過「直立正面半身、只換背景色」的同質配方）：一致性來自環境與光，差異只在各人的一個安靜動作。 **2026-09-25 下午（v10–v14，三位 fable 評審取中位數收斂出的規則）**：名冊分兩組（寫真模特兒 3 欄大圖／鏈上角色 7 欄小圖）皆內縮版心、圖在上名字在下、無表格線；只有旗艦寫真集一張滿版出血，其餘全內縮；三個區塊標題同一種襯線 t2、無計數；五級字階（字標／t2／t3／t4／t5）；字標全站一種 cut（Fraunces 600），首頁 nav 不重複字標；宣言句用大字、AI 免責用小字（三位評審共識「主張先於免責」，免責仍在導言、頁尾與 alt）；連結只有一種語法（襯線＋細底線），書名即連結不另放「翻閱整本」；手機名冊橫滑（站主定案）並在標題旁標「可橫滑」；可切換形象用文字分頁鈕 `.sm-switch__tab`（不用藥丸）；含第三方 IP 的角色用 † 註腳而非第三行。**教訓**：全站 `h2{margin:0}` 會蓋掉 `.sm-shell` 的置中，子站標題要寫 `.sm-page h2.xxx`；全站 `main{margin-top:76px}` 是給固定 header 的，子站要歸零；YAML 值含「 #」要加引號。
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
