// 由 nft/assets/data/collection.json 產生 nft/collection/index.html（靜態 HTML，爬蟲與 AI 檢索器不用跑 JS）。
// 用法：node tools/build-nft-collection.mjs
// 資料改了就重跑；頁面骨架（導覽、頁尾、扉頁）也在這裡，改版面改這支再重生。
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(resolve(root, "nft/assets/data/collection.json"), "utf8"));

const CHAIN = { ethereum: "Ethereum", base: "Base", polygon: "Polygon", ape_chain: "ApeChain", solana: "Solana" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const total = data.themes.reduce((n, t) => n + t.items.length, 0);
const hero = data.hero;

// 拍品式標籤（參考蘇富比／佳士得 NFT 專場的目錄）：全場連續 No. 編號（沒有東西在賣，不用 Lot）、系列名（相當於藝術家）在上、
// 作品名襯線、最後一行是媒材與鏈。編號跨展區連續，讀起來像一本目錄而不是六張清單。
let lot = 0;
// 版式（collection.json 每個 theme 的 layout）：row＝等寬一列；dense＝六欄密格、首件 2×2；spread＝兩張大圖對頁（.coll--spread）＋另一個 ul 的一列小格（.coll--strip，手機可橫向滑）；
// catalog＝六欄型錄、無主圖；banner＝一張橫幅＋一列小格；預設＝四欄、首件 2×2。主圖由 lead:true 決定（產生時提到最前），不再靠順序。
const LAYOUTS = { row: "coll--row", dense: "coll--dense", spread: "coll--spread", catalog: "coll--catalog", banner: "coll--banner" };
const pieceClass = (layout, i) => {
	if (layout === "row" || layout === "catalog") return "";
	if (layout === "spread") return i < 2 ? " piece--big" : " piece--small";
	if (layout === "banner") return i === 0 ? " piece--banner" : "";
	return i === 0 ? " piece--lead" : "";
};
const sortLead = (items) => [...items].sort((a, b) => (b.lead ? 1 : 0) - (a.lead ? 1 : 0));
const piece = (layout) => (it, i) => `
				<li class="piece${pieceClass(layout, i)}">
					<a href="${esc(it.href)}" target="_blank" rel="noopener noreferrer">
						<span class="piece__img${it.dark_bg ? " piece__img--dark" : ""}${it.contain ? " piece__img--contain" : ""}"><img src="../assets/images/${esc(it.img)}" alt="${esc(it.name)}，${esc(it.collection)} 系列" width="${it.w || 800}" height="${it.h || 800}" loading="lazy"${it.pos ? ` style="object-position: ${esc(it.pos)}"` : ""}></span>
						<span class="piece__meta">
							<span class="piece__lot mono">No. ${String(++lot).padStart(2, "0")}</span>
							${(it.collection_display === "" ? "" : `<strong class="piece__artist">${esc(it.collection_display || it.collection)}</strong>
							`)}							<span class="piece__title">${esc(it.title || it.name)}</span>
							<span class="piece__medium"><span class="pill">${CHAIN[it.chain] || esc(it.chain)}</span>${it.token_label ? `<span class="mono">${esc(it.token_label)}</span>` : ""}</span>
						</span>
					</a>
				</li>`;

const theme = (t, idx) => `
	<section class="sec${t.ink ? " sec--ink" : ""}${idx === 0 ? " sec--first" : ""}" id="${esc(t.id)}">
		<div class="wrap">
			<div class="grid12 sec__head rise">
				<h2 class="h2"><span class="no">展區 ${String(idx + 1).padStart(2, "0")}</span>${esc(t.title)}</h2>
				<p class="sec__lead">${t.lead}${t.link ? ` <a class="more${t.ink ? " more--light" : ""}" href="${esc(t.link.href)}">${esc(t.link.label)}<span class="ar" aria-hidden="true">→</span></a>` : ""}</p>
			</div>
${t.layout === "spread" ? `			<ul class="coll coll--spread rise">${sortLead(t.items).slice(0, 2).map(piece(t.layout)).join("")}
			</ul>
			<ul class="coll coll--strip rise">${sortLead(t.items).slice(2).map((it, i) => piece(t.layout)(it, i + 2)).join("")}
			</ul>` : `			<ul class="coll${LAYOUTS[t.layout] ? ` ${LAYOUTS[t.layout]}` : ""} rise">${sortLead(t.items).map(piece(t.layout)).join("")}
			</ul>`}
		</div>
	</section>`;

const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>收藏展 | Swanky NFT</title>
	<meta name="description" content="史旺基的 NFT 收藏線上策展：${data.themes.map((t) => t.title).join("、")}，共 ${data.themes.length} 個展區，每件作品都連回 OpenSea 原件。">
	<link rel="canonical" href="https://swanky.github.io/nft/collection/">
	<meta property="og:type" content="website">
	<meta property="og:title" content="收藏展 | Swanky NFT">
	<meta property="og:description" content="史旺基的 NFT 收藏線上策展：${data.themes.map((t) => t.title).join("、")}。">
	<meta property="og:image" content="https://swanky.github.io/nft/assets/images/${esc(hero.img)}">
	<meta property="og:url" content="https://swanky.github.io/nft/collection/">
	<meta name="twitter:card" content="summary_large_image">
	<link rel="icon" href="../../assets/img/Swanky_logo_icon32.png">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif:wght@700&family=Noto+Serif+TC:wght@700&display=swap" rel="stylesheet">
	<link rel="preload" as="image" href="../assets/images/${esc(hero.img)}" fetchpriority="high">
	<link rel="stylesheet" href="../assets/css/hub.css">
</head>
<body class="page-coll">
	<a class="skip" href="#${esc(data.themes[0].id)}">跳到主要內容</a>

	<nav class="nav" aria-label="主導覽">
		<div class="wrap nav__in">
			<a class="nav__brand" href="../" aria-label="Swanky NFT 首頁">
				<img src="../../assets/img/Swanky_Logo.svg" alt="Swanky Studio 標誌">
				<span class="nav__tag">NFT</span>
			</a>
			<ul class="nav__links">
				<li><a href="../">NFT 首頁</a></li>
				<li class="nav__wide"><a href="../oursong/">NFT 作品</a></li>
				<li class="is-here"><a href="./" aria-current="page">收藏展</a></li>
				<li class="cta"><a href="../uniform-clonex/">Uniform CloneX</a></li>
			</ul>
		</div>
	</nav>

	<!-- ================= Hero：滿版封面——一件作品出血到四邊，標題壓在圖上，像拍賣圖錄的封面 ================= -->
	<header class="hero hero--cover">
		<a class="hero--cover__img" href="${esc(hero.href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(hero.name)}，看 OpenSea 原件">
			<img src="../assets/images/${esc(hero.img)}" alt="${esc(hero.alt)}" width="${hero.w || 800}" height="${hero.h || 800}" fetchpriority="high" style="object-position: ${esc(hero.pos || "50% 50%")}">
		</a>
		<div class="wrap hero--cover__body">
			<p class="hero__tag">Swanky NFT · 線上策展</p>
			<h1 class="hero--cover__title">收藏展</h1>
			<p class="hero__title hero__title--sub">${data.subtitle}</p>
			<p class="hero__lead">${data.lead}</p>
			<p class="stamp"><span class="mono">策展</span><span>史旺基。作品資料與持有狀態以 <a href="${esc(data.meta.opensea)}" target="_blank" rel="noopener noreferrer">OpenSea</a> 上的原件為準。</span></p>
		</div>
		<p class="hero--cover__cap wrap"><span class="mono">${esc(hero.cap || "封面作品")}</span><a href="${esc(hero.href)}" target="_blank" rel="noopener noreferrer">${esc(hero.collection_display || hero.collection)}，${esc(hero.name)}</a></p>
	</header>

	<!-- 展區目錄：一條橫向導覽，像美術館平面圖上的章節列 -->
	<nav class="rooms" aria-label="展區目錄">
		<ol class="wrap rooms__list">${data.themes.map((t, i) => `
			<li><a href="#${esc(t.id)}"><span class="mono">${String(i + 1).padStart(2, "0")}</span>${esc(t.title)}</a></li>`).join("")}
		</ol>
	</nav>
${data.themes.map(theme).join("\n")}

	<!-- 收尾：走完七區給一個出口——完整收藏在 OpenSea -->
	<section class="sec sec--ink close" id="close">
		<div class="wrap grid12 rise">
			<h2 class="h2 close__h"><span class="no">看完了</span>這裡只是選件</h2>
			<p class="sec__lead close__lead">展出的是值得放在一起看的作品；完整收藏與最新的持有狀態，都在 OpenSea 上。<a class="more more--light" href="${esc(data.meta.opensea)}" target="_blank" rel="noopener noreferrer">到 OpenSea 看完整收藏<span class="ar" aria-hidden="true">↗</span></a></p>
		</div>
	</section>

	<footer class="foot">
		<div class="wrap grid12">
			<div class="foot__meta foot__meta--groups">
				<ul aria-label="站內">
					<li><a href="../">NFT 首頁</a></li>
					<li><a href="../uniform-clonex/">Uniform CloneX</a></li>
					<li><a href="../oursong/">制服女孩 NFT 系列</a></li>
					<li><a href="../../">Swanky Studio 主站</a></li>
				</ul>
				<ul aria-label="站外">
					<li><a href="${esc(data.meta.opensea)}" target="_blank" rel="noopener noreferrer">OpenSea</a></li>
					<li><a href="https://x.com/swanky">X</a></li>
				</ul>
			</div>
			<p class="foot__note">收藏展由史旺基策展，每件作品都連回 OpenSea 上的原件。<span>&copy; Swanky</span></p>
		</div>
	</footer>

	<script>
		// 進場：與首頁同一套 .rise 觀察器（沒有 IntersectionObserver 就直接顯示）
		(function () {
			var els = document.querySelectorAll(".rise");
			if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
			var io = new IntersectionObserver(function (es) {
				es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
			}, { rootMargin: "0px 0px -8% 0px" });
			els.forEach(function (e) { io.observe(e); });
		})();
	</script>
</body>
</html>
`;

mkdirSync(resolve(root, "nft/collection"), { recursive: true });
writeFileSync(resolve(root, "nft/collection/index.html"), html, "utf8");
console.log(`nft/collection/index.html written: ${data.themes.length} themes, ${total} items`);
