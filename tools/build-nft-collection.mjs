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
const piece = (it, i) => `
				<li class="piece${i === 0 ? " piece--lead" : ""}">
					<a href="${esc(it.href)}" target="_blank" rel="noopener noreferrer">
						<span class="piece__img${it.dark_bg ? " piece__img--dark" : ""}"><img src="../assets/images/${esc(it.img)}" alt="${esc(it.name)}，${esc(it.collection)} 系列" width="${it.w || 800}" height="${it.h || 800}" loading="lazy"></span>
						<span class="piece__meta">
							<span class="piece__lot mono">No. ${String(++lot).padStart(2, "0")}</span>
							${(it.collection_display === "" ? "" : `<strong class="piece__artist">${esc(it.collection_display || it.collection)}</strong>
							`)}							<span class="piece__title">${esc(it.title || it.name)}</span>
							<span class="piece__medium">${CHAIN[it.chain] || esc(it.chain)}${it.token_label ? `<span class="dot" aria-hidden="true">·</span>${esc(it.token_label)}` : ""}</span>
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
			<ul class="coll${t.layout === "row" ? " coll--row" : ""} rise">${t.items.map(piece).join("")}
			</ul>
		</div>
	</section>`;

const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>收藏展 | Swanky NFT</title>
	<meta name="description" content="史旺基的 NFT 收藏線上策展：${data.themes.map((t) => t.title).join("、")}${data.themes.length} 個展區，每件作品都連回 OpenSea 原件。">
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

	<!-- ================= Hero：收藏清單的扉頁——年份是主角，一件代表作出血到右緣 ================= -->
	<header class="hero hero--arch hero--paper">
		<div class="hero--arch__grid">
			<div class="hero--arch__main">
				<p class="hero__tag">Swanky NFT · 線上策展</p>
				<h1 class="hero--arch__year">收藏展</h1>
				<p class="hero__title hero__title--sub">${data.subtitle}</p>
				<p class="hero__lead">${data.lead}</p>
				<p class="stamp"><span class="mono">策展</span>史旺基。作品資料與持有狀態以 <a href="${esc(data.meta.opensea)}" target="_blank" rel="noopener noreferrer">OpenSea</a> 上的原件為準。</p>
			</div>
			<figure class="hero--arch__fig">
				<a href="${esc(hero.href)}" target="_blank" rel="noopener noreferrer"><img src="../assets/images/${esc(hero.img)}" alt="${esc(hero.alt)}" width="${hero.w || 800}" height="${hero.h || 800}" fetchpriority="high" style="object-position: ${esc(hero.pos || "50% 20%")}"></a>
				<figcaption class="hero--arch__cap"><span class="mono">${esc(hero.cap || "")}</span>${esc(hero.collection_display || hero.collection)}，${esc(hero.name)}</figcaption>
			</figure>
		</div>
	</header>

	<!-- 展區目錄：一條橫向導覽，像美術館平面圖上的章節列 -->
	<nav class="rooms" aria-label="展區目錄">
		<ol class="wrap rooms__list">${data.themes.map((t, i) => `
			<li><a href="#${esc(t.id)}"><span class="mono">${String(i + 1).padStart(2, "0")}</span>${esc(t.title)}</a></li>`).join("")}
		</ol>
	</nav>
${data.themes.map(theme).join("\n")}

	<footer class="foot">
		<div class="wrap grid12">
			<div class="foot__meta">
				<ul>
					<li><a href="../">NFT 首頁</a></li>
					<li><a href="../uniform-clonex/">Uniform CloneX</a></li>
					<li><a href="../oursong/">制服女孩 NFT 系列</a></li>
					<li><a href="${esc(data.meta.opensea)}" target="_blank" rel="noopener noreferrer">OpenSea</a></li>
					<li><a href="../../">Swanky Studio 主站</a></li>
					<li><a href="https://x.com/swanky">X</a></li>
				</ul>
				<span>&copy; Swanky</span>
			</div>
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
