// CloneX 鏈上收藏展示 — 純前端、無後端、無 API key。
//
// 改寫自 RTFKT ProjectPhoenix-BEFE 的鏈上讀取模式（balanceOf → tokenOfOwnerByIndex），
// 但原專案靠 Node 後端 + Alchemy key 查詢、且只回傳 tokenId 不抓圖。此版本針對 GitHub Pages
// 靜態站重建：改用公開 mainnet RPC 做唯讀查詢，並補上 tokenURI → metadata → image 取圖。
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.4/+esm";

const CLONEX = "0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b";

// ── 預設展示的收藏地址（藏品櫃）──────────────────────────────────
// 史旺基的錢包地址（已驗證持有 5 個 CloneX）。要改成其他地址，只改這一行。
const GALLERY_ADDRESS = "0x43fbF8dD759778a54Fd50C3F0AADfBf47c490451";
// ────────────────────────────────────────────────────────────────

const MAX_SHOW = 12; // 「精選」最多顯示張數（避免大持倉時拖慢頁面）

// 史旺基精選收藏的 5 張圖已下載存進 repo（800px webp），預設藏品櫃優先用本地檔 →
// 永不依賴 RPC metadata / Arweave 網關，最穩。連錢包看「別人的」收藏時無本地檔，走鏈上。
const LOCAL_IMAGES = {
  "9927": "9927.webp",   // CloneX #17152
  "2692": "2692.webp",   // CloneX #9268
  "9023": "9023.webp",   // CloneX #15162
  "9245": "9245.webp",   // CloneX #15755
  "15939": "15939.webp", // CloneX #17474
};
const LOCAL_BASE = "../nft/assets/images/clonex/";

// 預設藏品櫃的角色標籤（與 uniform-clonex/ 的檔案一致；連別人的錢包時沒有這層）。
// 鍵是鏈上 token id，值是「名稱編號 · 身分」。#15755 是 UCX 主視覺、也是 78 張塔羅牌的原型，
// 預設藏品櫃裡讓它佔大格。
const ROLES = {
  "9245": ["#15755", "正團 · 主視覺"],
  "15939": ["#17474", "正團 · 引導者"],
  "2692": ["#9268", "正團 · 街頭風"],
  "9023": ["#15162", "幕後 · 造型師／技術總監"],
  "9927": ["#17152", "幕後 · 製作人"],
};
const FEATURED = "9245";

// 少數 CloneX 圖的官方 Arweave「路徑解析」在所有網關都壞（manifest 路徑問題、且 arweave.net
// 未 seed 該副本），但底層 data txid 在部分 ar.io 網關仍可達 → 對這些 tokenId 改走 data txid 直連。
// txid 取自 manifest 的 /raw/ 端點，並實測 vilenarios / frostor 對兩張皆回 200 image/png。
const TXID_OVERRIDE = {
  "2692": "7Lm1CCtaB5pnAZ1bdO-Uo6H5tJmlg2efsmhd0sp72D0", // CloneX #9268
  "9245": "hqWmVit5jLrZQ020aiK_BuPB79z9C2zICcTAI1oDj-g", // CloneX #15755
};
const ARIO_GATEWAYS = ["https://vilenarios.com", "https://frostor.xyz", "https://permagate.io"];

const ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

// 公開 mainnet RPC（依序嘗試，第一個能用的就採用）。
const RPCS = [
  "https://ethereum-rpc.publicnode.com",
  "https://eth.drpc.org",
  "https://1rpc.io/eth",
  "https://eth.merkle.io",
];

let readProvider = null;

async function getProvider() {
  if (readProvider) return readProvider;
  for (const rpc of RPCS) {
    try {
      const p = new ethers.JsonRpcProvider(rpc, 1, { staticNetwork: true });
      await p.getBlockNumber(); // 實際呼叫一次，瀏覽器端能通過（含 CORS）才採用
      readProvider = p;
      return p;
    } catch (e) {
      console.warn("[clonex] RPC 無法使用：", rpc, e?.message);
    }
  }
  throw new Error("目前無法連線到以太坊節點，請稍後再試。");
}

function ipfsToHttp(uri) {
  if (!uri) return "";
  if (uri.startsWith("ipfs://ipfs/")) return "https://ipfs.io/ipfs/" + uri.slice(12);
  if (uri.startsWith("ipfs://")) return "https://ipfs.io/ipfs/" + uri.slice(7);
  return uri;
}

// 用 wsrv.nl 免費圖片 CDN 縮圖 + 轉 webp，大幅降低 CloneX 原圖（2000px）的傳輸量。
function proxied(httpUrl) {
  return `https://wsrv.nl/?url=${encodeURIComponent(httpUrl)}&w=640&output=webp`;
}

function shortenAddress(a) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
}

// 取單一 token 的 id / 名稱 / 圖片。任一步失敗都退回只顯示 tokenId。
async function fetchOne(contract, owner, index) {
  const tokenId = (await contract.tokenOfOwnerByIndex(owner, index)).toString();
  let name = `CloneX #${tokenId}`;
  let image = "";
  try {
    const uri = ipfsToHttp(await contract.tokenURI(tokenId));
    const meta = await (await fetch(uri)).json();
    if (meta?.name) name = meta.name;
    if (meta?.image) image = ipfsToHttp(meta.image);
  } catch (e) {
    console.warn("[clonex] metadata 讀取失敗：", tokenId, e?.message);
  }
  return { tokenId, name, image };
}

// 從 metadata 名稱取 CloneX 展示編號（與卡片標題一致），取不到才退回合約 tokenId。
function displayNo(item) {
  const m = /#\s*(\d+)/.exec(item.name || "");
  return m ? `#${m[1]}` : `#${item.tokenId}`;
}

function placeholder(label) {
  const ph = document.createElement("div");
  ph.className = "clonex-noimg";
  ph.textContent = label;
  return ph;
}

// 一張卡片。圖片三級 fallback：wsrv 縮圖 → 原圖 → 編號占位（整卡仍可點到 OpenSea）。
function makeCard(item, isGallery) {
  const a = document.createElement("a");
  a.className = "clonex-card";
  a.href = `https://opensea.io/assets/ethereum/${CLONEX}/${item.tokenId}`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.title = item.name;

  // 圖片來源鏈（依序嘗試，全失敗才退占位）：本地存檔優先 → 鏈上兜底。
  const sources = [];
  const local = LOCAL_IMAGES[item.tokenId];
  if (local) sources.push(LOCAL_BASE + local);
  const tx = TXID_OVERRIDE[item.tokenId];
  if (tx) {
    const direct = ARIO_GATEWAYS.map((g) => `${g}/${tx}`);
    sources.push(proxied(direct[0]), ...direct); // wsrv 縮圖優先，再多網關直連
  } else if (item.image) {
    sources.push(proxied(item.image), item.image);
  }

  if (sources.length) {
    const img = document.createElement("img");
    img.alt = item.name;
    img.loading = "lazy";
    let i = 0;
    img.addEventListener("error", () => {
      i += 1;
      if (i < sources.length) img.src = sources[i];
      else img.replaceWith(placeholder(displayNo(item))); // 全部來源都取不到才優雅降級
    });
    img.src = sources[0];
    a.appendChild(img);
  } else {
    a.appendChild(placeholder(displayNo(item)));
  }

  const meta = document.createElement("div");
  meta.className = "clonex-meta";
  const role = isGallery && ROLES[item.tokenId];
  if (role) {
    // 兩行：編號一行、身分一行，窄螢幕不必截斷
    const id = document.createElement("span");
    id.className = "clonex-id";
    id.textContent = role[0];
    const who = document.createElement("span");
    who.className = "clonex-role";
    who.textContent = role[1];
    meta.append(id, who);
  } else {
    meta.textContent = item.name;
  }
  a.appendChild(meta);
  return a;
}

async function loadCollection(address, label) {
  const grid = document.getElementById("clonex-grid");
  const status = document.getElementById("clonex-status");
  if (!grid || !status) return;

  grid.innerHTML = "";
  status.textContent = "讀取鏈上資料中…";

  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(CLONEX, ABI, provider);
    const balance = Number(await contract.balanceOf(address));

    if (balance === 0) {
      status.innerHTML = `${label} 目前沒有持有 CloneX。`;
      return;
    }

    const count = Math.min(balance, MAX_SHOW);
    status.innerHTML =
      `${label} 共持有 <strong>${balance}</strong> 個 CloneX` +
      (balance > count ? `，以下精選 ${count} 個` : "");

    // 先放骨架卡片，資料到位後逐一替換
    for (let i = 0; i < count; i++) {
      const col = document.createElement("div");
      col.className = "col-6 col-md-4 col-lg-3";
      col.id = `clonex-card-${i}`;
      col.innerHTML = `<div class="clonex-skeleton"></div>`;
      grid.appendChild(col);
    }

    const items = await Promise.all(
      Array.from({ length: count }, (_, i) =>
        fetchOne(contract, address, i)
          .then((d) => ({ i, ...d }))
          .catch(() => ({ i, tokenId: "?", name: "讀取失敗", image: "" }))
      )
    );

    for (const it of items) {
      const col = document.getElementById(`clonex-card-${it.i}`);
      if (!col) continue;
      col.innerHTML = "";
      const isGallery = address === GALLERY_ADDRESS;
      col.appendChild(makeCard(it, isGallery));
      col.classList.toggle("is-feat", isGallery && it.tokenId === FEATURED);
    }
  } catch (e) {
    status.textContent = e?.message || "讀取失敗，請稍後再試。";
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    alert("找不到錢包。請先安裝 MetaMask 等以太坊錢包，再試一次。");
    return;
  }
  const connectBtn = document.getElementById("clonex-connect");
  const backBtn = document.getElementById("clonex-back");
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const addr = accounts[0];
    if (!addr) return;
    if (backBtn) backBtn.style.display = "";
    if (connectBtn) connectBtn.textContent = `已連結 ${shortenAddress(addr)}`;
    // 查詢仍走唯讀 RPC（穩定、且不受使用者錢包所在鏈影響）
    await loadCollection(addr, `你的錢包 ${shortenAddress(addr)}`);
  } catch (e) {
    console.error("[clonex] 連結錢包失敗：", e?.message);
  }
}

function init() {
  const connectBtn = document.getElementById("clonex-connect");
  const backBtn = document.getElementById("clonex-back");
  if (!connectBtn) return;

  connectBtn.addEventListener("click", connectWallet);
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      backBtn.style.display = "none";
      connectBtn.textContent = "連結錢包看我的收藏";
      loadCollection(GALLERY_ADDRESS, "史旺基的收藏");
    });
  }

  loadCollection(GALLERY_ADDRESS, "史旺基的收藏");
}

if (document.readyState !== "loading") init();
else document.addEventListener("DOMContentLoaded", init);
