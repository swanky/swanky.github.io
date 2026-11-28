---
title: "AI 幫我挑好了交換禮物，最後還是我自己結帳：Agent 付款走到哪了，我打算怎麼接到自己的網站"
seo_title: "Agentic Payment 是什麼？x402、AP2、ACP、MPP 趨勢整理，與個人網站接上 x402 的做法"
date: 2026-11-28
published: true
categories: [technical]
tags: [ai-agent, agentic-payment, x402, stablecoin, usdc, web3, mcp, agentic-engineering]
layout: article
cover_image: /assets/img/linkedin/x402-agent-commerce-field-guide.jpg
cover_alt: "史旺姬單膝蹲在打開的販賣機側板旁，一手拿螺絲起子、一手接上發光線纜。機台櫥窗裡排滿發光的資料卡匣，左邊一台圓潤的小機器人正把金色硬幣投進投幣口，出貨口滑出一塊卡匣與一張空白收據。場景是深藍色的科技工坊，地面閃著霓虹光軌。"
hero_image: true
use_glightbox: true
cta_context: web3
extra_css: |
  .post-content .ap-wrap { overflow-x: auto; margin: 20px 0; border: 1px solid #E6E1D6; border-radius: 12px; background: #fff; }
  .post-content .ap-table { min-width: 640px; width: 100%; border-collapse: collapse; font-size: 0.92em; margin: 0; }
  .post-content .ap-table caption { caption-side: top; text-align: left; color: #5F5B53; font-size: 0.92em; padding: 10px 14px 8px; }
  .post-content .ap-table th { background: #FBF3DC; border-bottom: 3px solid #E5A300; text-align: left; padding: 9px 10px; line-height: 1.3; }
  .post-content .ap-table td { border-bottom: 1px solid #EEE9DD; padding: 8px 10px; vertical-align: top; line-height: 1.5; overflow-wrap: anywhere; }
  .post-content .ap-table tbody tr:nth-child(even) td { background: #FDFAF3; }
  .post-content .ap-ok { color: #2E8B57; font-weight: 800; }
  .post-content .ap-no { color: #D0573A; font-weight: 800; }
  .post-content .ap-gloss { border: 1px solid #E6E1D6; border-radius: 12px; background: #FDFAF3; padding: 10px 16px; margin: 18px 0; }
  .post-content .ap-gloss summary { cursor: pointer; font-weight: 800; color: #8A5D00; }
  .post-content .ap-gloss dl { display: grid; grid-template-columns: max-content 1fr; gap: 6px 14px; margin: 12px 0 4px; font-size: 0.95em; }
  .post-content .ap-gloss dt { font-weight: 700; }
  .post-content .ap-gloss dd { margin: 0; color: #4A463F; }
  .post-content .ap-scene { border-left: 4px solid #E5A300; background: #FDFAF3; padding: 12px 16px; margin: 18px 0; border-radius: 0 10px 10px 0; color: #4A463F; }
  .post-content .ap-chat { max-width: 460px; margin-left: auto; margin-right: auto; }
  @media (max-width: 600px) { .post-content .ap-gloss dl { grid-template-columns: 1fr; gap: 2px; } .post-content .ap-gloss dd { margin-bottom: 8px; } }
  @media (max-width: 600px) { .post-content .ap-table caption::after { content: "（表格可以左右滑動）"; display: block; color: #8A5D00; font-weight: 700; margin-top: 4px; } }
related_posts:
  - ai-agent-payments-web3
  - ai-agent-wallet-permission-boundaries
  - you-cant-vibe-code-usdc
description: "AI 會幫你挑、比價、查授權，付款多半還是自己來。整理刷卡與穩定幣兩條 Agent 付款路線的最新進展，拆解 x402，以及我打算怎麼接到個人網站。"
keywords: agentic payment, AI Agent 付款, x402, HTTP 402, AP2, Agentic Commerce Protocol, ACP, Machine Payments Protocol, MPP, 穩定幣, USDC, Cloudflare Workers, MCP, NFT 授權, 史旺基, Swanky Studio
---

年底要交換禮物。我丟給 ChatGPT 一句話：「幫我找 500–600 左右的。」

它想了兩分多鐘，回我八款：馬桶吸造型的小夜燈 579 元、紅龜粿抱枕 559 元、ATM 造型的電子票卡 509 元……每一款都附上購物網站當天的價格，還幫我排了順序，說「想讓大家拆開就笑」選哪個、「想兼顧有趣與禮物感」選哪個。

後來我在購物網站看到一組動畫收藏卡，截圖丟回去問：「這個是正版的嗎，有價值嗎？」它找到代理商的發行公告，確認這個款式有正式授權，再拿賣場當時標的兩盒 599 元和其他通路比，說大約是三折。「投資升值潛力」那一格，它只給 4.5 分，還補一句不建議為了投資囤貨。

我買了兩組。

回頭看這段對話，AI 做了搜尋、比價、查授權、給建議，連「拿一盒去換會不會超過預算」都幫我算好。整個過程裡它唯一沒做的一件事，是付錢。最後那一步，是我自己到購物網站結帳。

另一段對話裡，我丟給它一張毛線頭套的商品照，只問一句：「真人戴起來會長怎樣？」31 秒後，它給我一張試戴圖。

<figure class="ap-chat">
  <a href="{{ '/assets/img/technical/x402-agent-commerce-field-guide/chat-tryon.jpg' | relative_url }}" class="portfolio-lightbox" data-gallery="x402-agent-commerce" data-type="image"><img src="{{ '/assets/img/technical/x402-agent-commerce-field-guide/chat-tryon.jpg' | relative_url }}" alt="ChatGPT 對話截圖：使用者上傳一張商品照，問「真人戴起來會長怎樣？」，ChatGPT 回了一張真人戴著黃色毛線頭套的生成圖。" width="626" height="640"></a>
  <figcaption>我的 ChatGPT 對話截圖（2026-11-28）。圖是 AI 生成的試戴示意，不是實拍，也不是我本人。</figcaption>
</figure>

這兩件事放在一起，就是我想要的購物體驗：像走進一間只為我開的店，看得到、問得到、試得到，最後說一句「就這個」，事情就辦完了。有人會把它叫做元宇宙。我比較在意的是，前面幾步我都親手試過了，**「就這個」之後的那一步，我還是自己來**。

這一步有個名字，叫 agentic payment：讓 AI Agent（會自己呼叫工具、一步步把事情辦完的 AI）代替你、或者自己付款。過去一年多，信用卡組織、支付公司、AI 平台和穩定幣陣營都在補這一步；就在這個月，已經有產品讓助理在限定條件下替人刷卡。這篇先整理他們各自走到哪，再拆開其中一條我最想動手試的路線 x402，最後寫我打算怎麼把它接到自己的網站：服務端怎麼放、客戶端怎麼付，以及我還沒想清楚的地方。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>AI 卡在付款，不是因為不夠聰明</strong>：登入、驗證碼、結帳頁都是為人設計的。Agent 需要的是「可以被程式讀懂的報價」和「有上限的付款授權」。</li>
    <li><strong>補這一步的有兩條路線</strong>：一條讓 Agent 代你刷卡（卡組織、支付公司、AI 平台），一條讓 Agent 自己付穩定幣（x402 這一類）。兩邊沒有互相取代，很多公司同時押兩邊。代刷卡在 2026 年 11 月開始落地：ChatGPT Wallet 先開放給美國的部分使用者，Gemini 用 AP2 購物，台灣在 3 月也完成過第一筆；都有資格限制，還不是人人能用。</li>
    <li><strong>x402 把付款做進請求與回應裡</strong>：第一次要資料，服務回「402 需要付款」加一張報價單；帶著付款授權再要一次，就拿到資料。沒有帳號、沒有結帳頁。</li>
    <li><strong>個人網站的接法</strong>：展示站不動，收款另外放一支小程式；買方先用程式直接付，模型不拿私鑰，支出上限寫在程式裡。</li>
    <li><strong>先潑冷水</strong>：在看得到的鏈上資料裡，像是 Agent 自己決定付出去的金額只占少數；我選的這條路，門檻主要在買方。我自己目前也只跑到「拿到正確的報價單」，還沒付過任何一筆。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part"><span class="article-toc-part-title">Agent 付款走到哪了</span><ol class="article-toc-items">
      <li><a href="#gap">最後一步為什麼卡住</a></li>
      <li><a href="#two-roads">兩條路線：代你刷卡，或讓它自己付</a></li>
      <li><a href="#timeline">一年半的時間軸</a></li>
      <li><a href="#stack">這麼多協定，其實各管一層</a></li>
      <li><a href="#reality">三件比新聞標題更值得知道的事</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">x402 怎麼運作</span><ol class="article-toc-items">
      <li><a href="#x402">x402：買一份資料，送兩次請求</a></li>
      <li><a href="#myths">三個最常見的誤會</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">接到個人網站</span><ol class="article-toc-items">
      <li><a href="#seller">服務端：展示站不動，收款另外放</a></li>
      <li><a href="#buyer">客戶端：模型不拿私鑰</a></li>
      <li><a href="#layers">付款、收據、權利是三件事</a></li>
      <li><a href="#products">賣什麼：Agent 自己做不到的事</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">風險與下一步</span><ol class="article-toc-items">
      <li><a href="#risks">它會怎麼壞</a></li>
      <li><a href="#next">我的下一步</a></li>
    </ol></li>
  </ol>
</nav>

<details class="ap-gloss">
  <summary>先看名詞小抄（點開）</summary>
  <dl>
    <dt>Agent（AI 代理）</dt><dd>會自己呼叫工具、查資料、一步步把任務做完的 AI。</dd>
    <dt>Agentic payment</dt><dd>讓 Agent 代替人付款，或在授權範圍內自己付款。</dd>
    <dt>穩定幣（stablecoin）</dt><dd>價值盯住法幣的加密貨幣。本文談的 USDC 盯住美元。</dd>
    <dt>HTTP 狀態碼</dt><dd>網站回應請求時附的三位數代號。200 是成功，404 是找不到，402 是「需要付款」。</dd>
    <dt>接口（API）</dt><dd>讓程式索取資料或服務的入口。人用網頁，程式用接口。</dd>
    <dt>表頭（header）</dt><dd>請求與回應最前面附帶的幾行說明資料，使用者平常看不到。</dd>
    <dt>私鑰</dt><dd>能動用錢包裡資產的那把鑰匙。誰拿到，誰就能花。</dd>
    <dt>測試網</dt><dd>區塊鏈的練習場，上面的幣沒有價值，拿來試流程用。</dd>
    <dt>Facilitator（代驗代結服務）</dt><dd>幫賣方檢查付款授權是否有效、再把交易送上區塊鏈的服務。</dd>
    <dt>MCP（Model Context Protocol）</dt><dd>讓 AI 助理接上外部工具的共通接法。接上不等於能付款。</dd>
    <dt>NFT</dt><dd>記在區塊鏈上、可以證明「這一份屬於誰」的數位憑證。</dd>
  </dl>
</details>

## 最後一步為什麼卡住 {#gap}

把我買交換禮物的過程攤開，會看到一條很清楚的斷點。

<figure>
  <a href="{{ '/assets/img/technical/x402-agent-commerce-field-guide/shopping-journey.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="x402-agent-commerce" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/x402-agent-commerce-field-guide/shopping-journey-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/x402-agent-commerce-field-guide/shopping-journey.svg' | relative_url }}" alt="購物旅程六步：問、找、比、查授權、試戴，這五步 AI 都做了；第六步付款，是我自己到購物網站結帳。"></picture>
  </a>
  <figcaption>自製圖解，依我和 ChatGPT 的兩段對話整理（2026-11-28）。</figcaption>
</figure>

前五步靠的是查資料、整理、生成圖片，都是 AI 自己就能完成的事。到了付款，它面對的是一整套「確認你是人」的設計：帳號密碼、簡訊驗證碼、刷卡時跳出來的銀行驗證頁、勾選同意條款。這些關卡存在的理由都很正當，防的就是「不是本人在付」。

所以問題不在 AI 的能力。問題是付款這件事需要三樣東西，而一般的結帳流程一樣都沒有替 Agent 準備：

1. **讀得懂的報價**：人看結帳頁就知道要付多少。程式需要的是一份格式固定的報價，寫明金額、幣別、付給誰。
2. **有邊界的授權**：我願意讓它花 600 元買禮物，不代表它可以把我的卡刷到上限。授權要能寫成「買什麼、最多多少、到什麼時候」。
3. **事後講得清楚的紀錄**：買錯了、被騙了、重複扣款了，要查得到是誰同意的、錢去了哪裡。

接下來看到的每一個方案，其實都在回答這三題，只是從不同的地方下手。

## 兩條路線：代你刷卡，或讓它自己付 {#two-roads}

<div class="ap-scene">情境：你對助理說「用我的卡買」，和你對它說「用你錢包裡的錢買」，是兩件很不一樣的事。前者它是你的代理人，後者它自己就是付款的人。</div>

過去一年多的方案，大致分成這兩種。這個分法是為了好懂；嚴格說，「誰核准」「錢從哪裡扣」「出事找誰」是三個可以各自搭配的選項，這一節最後會看到例外。

### 第一條：讓 Agent 代你刷卡

錢還是從你的信用卡出去。卡組織、支付公司與 AI 平台要解決的是：商家怎麼知道，眼前這個自動化程式是真的受你委託，而不是盜刷的機器人。

- **OpenAI 與 Stripe**：2025 年 9 月 29 日發表 Agentic Commerce Protocol（ACP），同時在 ChatGPT 裡推出站內結帳。[[1]](https://openai.com/index/buy-it-in-chatgpt/) 這份規格目前由兩家共同維護，仍標示為測試版。[[2]](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol) Stripe 配套的做法叫 Shared Payment Token：一張有用途與期限限制的授權，讓 Agent 可以動用客戶的卡，卻拿不到卡號本身。[[3]](https://docs.stripe.com/payments/machine) 2026 年 11 月 13 日，OpenAI 再發表 ChatGPT Wallet：使用者先綁一張卡，之後每一筆都要先看過品項、總額與所選的卡，再用臉部或指紋驗證核准，Agent 才能代付。初期只開放給美國的 ChatGPT Pro 訂戶，要年滿 18 歲、持美國發行的合格卡片。[[4]](https://openai.com/index/introducing-chatgpt-wallet/)
- **Google**：2025 年 9 月發表 Agent Payments Protocol（AP2）。它的核心是「授權憑證」（Mandate）：一份防竄改、有密碼學簽章的數位合約，用來證明使用者下過什麼指示。[[5]](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol) 2026 年 4 月 28 日，Google 把 AP2 捐給 FIDO Alliance（制定通行金鑰標準的那個組織）。[[6]](https://blog.google/products-and-platforms/platforms/google-pay/agent-payments-protocol-fido-alliance/) 2026 年 1 月，Google 又與 Shopify 等公司發表 Universal Commerce Protocol（UCP），管的是「怎麼看懂商品、怎麼下單」這一層。[[7]](https://developers.googleblog.com/en/under-the-hood-universal-commerce-protocol-ucp/) 依 Google 的商家說明頁，用 UCP 做的結帳功能目前只適用於美國、加拿大、澳洲，而且限選定的商家。[[8]](https://support.google.com/merchants/answer/16837055?hl=en) 2026 年 11 月，Google 在 Gemini 的產品公告裡寫，Gemini 已經用 AP2 替使用者買東西，可以事先設一個花費上限，收據會進到 Google Wallet。[[9]](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/)
- **Visa**：2025 年 10 月 14 日與 Cloudflare 發表 Trusted Agent Protocol，用 Agent 專屬的密碼學簽章，讓商家分得出可信的 Agent 與惡意機器人。[[10]](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html) 2026 年 4 月再推 Intelligent Commerce Connect，一個接口同時接好幾種協定。[[11]](https://investor.visa.com/news/news-details/2026/Visa-Opens-the-Door-to-AI-Driven-Shopping-for-Businesses-Worldwide/default.aspx) 最新的一步是 2026 年 11 月 17 日把 Agentic Ready 計畫擴大到收款這一側（商家、收單機構、支付服務商），官方稱首批有超過 140 個參與者；原本就在計畫裡的發卡機構則有 175 家以上，分布在 45 個市場。[[12]](https://investor.visa.com/news/news-details/2026/Visa-Expands-Agentic-Ready-to-Help-Scale-Trusted-AI-Commerce-Globally/default.aspx)
- **Mastercard**：2025 年 4 月 29 日發表 Agent Pay，推出給 Agent 專用的代碼化卡號（Agentic Tokens）。[[13]](https://investor.mastercard.com/investor-news/investor-news-details/2025/Mastercard-Unveils-Agent-Pay-Pioneering-Agentic-Payments-Technology-to-Power-Commerce-in-the-Age-of-AI/default.aspx) 台灣讀者最有感的是 2026 年 3 月 26 日：萬事達卡與星展銀行（台灣）宣布，在 Agent Pay 的框架下完成台灣第一筆經身分驗證的 Agent 交易。消費者在對話裡提出機場接送的需求、選定方案，Agent 再用他綁定的卡完成預訂與付款。[[14]](https://www.mastercard.com/news/ap/zh-tw/新聞中心/新聞稿/zh-tw/2026/mar/萬事達卡攜手星展銀行-台灣-完成第一筆代理式ai支付交易/) 這是「完成了一筆」，不是全面開放。
- **Microsoft**：2026 年 1 月 8 日在美國的 Copilot 網站推出 Copilot Checkout，商家仍是實際的賣方。[[15]](https://news.microsoft.com/source/2026/01/08/microsoft-propels-retail-forward-with-agentic-ai-capabilities-that-power-intelligent-automation-for-every-retail-function/)
- **PayPal**：提供讓商家在 AI 助理裡收款、讓商品被 AI 購物助理找到的服務，目前是申請制。[[16]](https://developer.paypal.com/agentic-commerce-services/about)

### 第二條：讓 Agent 自己付穩定幣

Agent 手上有一個裝著穩定幣的錢包，遇到要收費的服務就直接付。這條路線不經過發卡銀行，也不需要商家帳號。

- **x402**：2025 年 5 月上線，後面兩節會拆開講。
- **Cloudflare**：2025 年 9 月與 Coinbase 宣布籌組 x402 Foundation。[[17]](https://blog.cloudflare.com/x402/) 在那之前的 2025 年 7 月，它先推出 pay per crawl，讓網站對 AI 爬蟲按次收費，用的同樣是 402 這個狀態碼，發表時是私有測試。[[18]](https://blog.cloudflare.com/introducing-pay-per-crawl/) 那項服務由 Cloudflare 當名義上的賣方、代收代付；提它是因為同樣回 402，背後可以接不同的收費方式。
- **Stripe 與 Tempo**：2026 年 3 月 18 日發表 Machine Payments Protocol（MPP），同樣讓 Agent 不經結帳頁就能付款。[[19]](https://stripe.com/blog/machine-payments-protocol) 特別的是它卡和穩定幣都收，而且 Stripe 的文件寫明自己同時支援 MPP 與 x402。[[3]](https://docs.stripe.com/payments/machine)
- **Solana Foundation 與 Google Cloud**：2026 年 5 月 5 日推出 Pay.sh，讓 Agent 用錢包當身分、按次付穩定幣，不用替每個服務另外申請帳號或金鑰（據 The Block 報導）。[[20]](https://www.theblock.co/news/web3/2026-05-05-google-cloud-solana-foundation-ai-payments-400059)
- **Circle**（USDC 的發行公司）：2026 年 5 月 11 日發表 Agent Stack，包含給 Agent 用的錢包與極小額付款，並強調支出規則在錢包這一層強制執行。[[21]](https://www.circle.com/blog/introducing-circle-agent-stack-financial-infrastructure-for-the-agentic-economy)

兩條路線適合的東西不一樣：

<div class="ap-wrap">
<table class="ap-table">
  <caption>兩條路線的差別（我的整理）</caption>
  <thead><tr><th></th><th>代你刷卡</th><th>自己付穩定幣</th></tr></thead>
  <tbody>
    <tr><td><strong>錢從哪來</strong></td><td>你的信用卡或支付帳戶</td><td>Agent 可動用的錢包</td></tr>
    <tr><td><strong>適合買什麼</strong></td><td>人本來就會買的東西：禮物、訂房、日用品</td><td>程式之間按次計費的小東西：查一次資料、呼叫一次服務</td></tr>
    <tr><td><strong>金額</strong></td><td>幾十到幾千元。以 Stripe 的 MPP 為例，文件寫用卡片授權付款最低 0.50 美元。<a href="https://docs.stripe.com/payments/machine/mpp">[22]</a></td><td>可以小到幾分錢。同一份文件寫，用穩定幣付款最低 0.01 顆 USDC。<a href="https://docs.stripe.com/payments/machine/mpp">[22]</a></td></tr>
    <tr><td><strong>買錯了</strong></td><td>有既有的爭議與退款機制可以接</td><td>協定本身不處理，要賣方自己設計</td></tr>
    <tr><td><strong>商家要做什麼</strong></td><td>接上平台或支付公司的規格，多半要申請、有地區限制</td><td>自己架一個會回 402 的服務</td></tr>
    <tr><td><strong>誰核准</strong></td><td>多半是人逐筆確認，或事先給一個預算</td><td>多半是事先寫好的規則與上限，也可以每筆由人確認</td></tr>
    <tr><td><strong>買方要有什麼</strong></td><td>一張卡，加上支援的 AI 平台</td><td>通常是錢包、穩定幣、能簽名的付款工具</td></tr>
  </tbody>
</table>
</div>

我買交換禮物那種情境，顯然是第一條路線的場子。第二條路線回答的是另一個問題：當 Agent 為了完成你交代的事，需要自己去買一筆資料、租一點運算、查一次付費資料庫，每次只值幾分錢，這種錢要怎麼付。

兩條路線的界線也正在變模糊，有兩個例子值得記：

- **用 x402 收費，卻記在公司帳單上。** 2026 年 11 月 19 日，AWS Marketplace 宣布支援透過 x402 的 Agent 付款：Agent 可以按次購買架上選定的商品，費用以美元計入企業原本的 AWS 帳單，官方特別寫明不需要加密貨幣錢包。[[23]](https://aws.amazon.com/about-aws/whats-new/2026/11/marketplace-agentic-payments-agentcore/) 協定是 x402，出錢的方式卻是企業熟悉的月結。對技術主管來說，這可能比「讓每個 Agent 各拿一個錢包」更容易過內部那一關。
- **卡組織也做機器對機器的付款。** 2026 年 10 月 20 日，Mastercard 展示 Agent Pay for Machines，說明它建立在 x402 之上，再接上自家的網路；在與 Cloudflare、Coinbase 等夥伴完成端對端試點之後，開放開發者申請搶先試用。[[24]](https://www.mastercard.com/global/en/news-and-trends/press/2026/october/Mastercard-Agent-Pay-for-Machines-in-action.html)

所以更準確的說法是：x402 是一種「怎麼報價、怎麼把付款帶進請求」的格式，背後的錢可以是錢包裡的穩定幣，也可以是別人替你代收代付。我自己要試的是前者。

## 一年半的時間軸 {#timeline}

把兩條路線和相關的規則、事故排在同一條時間軸上：

<figure>
  <a href="{{ '/assets/img/technical/x402-agent-commerce-field-guide/agentic-payment-timeline.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="x402-agent-commerce" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/x402-agent-commerce-field-guide/agentic-payment-timeline-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/x402-agent-commerce-field-guide/agentic-payment-timeline.svg' | relative_url }}" alt="2025 年 4 月到 2026 年 11 月的時間軸，分成代你刷卡、按次付費、規則與事故三條軌道；多數大動作集中在 2025 年 9 月之後，2026 年 11 月有三則消費端與企業端的新進展。"></picture>
  </a>
  <figcaption>自製圖解。各事件的出處見正文與文末參考資料。</figcaption>
</figure>

幾件從圖上讀得出來的事：

- **幾乎所有大動作都擠在 2025 年 9 月之後。** AP2、ACP、x402 Foundation、Visa 的協定，前後不到一個月。
- **2026 年是「捐出去」的一年。** x402 交給 Linux Foundation，AP2 交給 FIDO Alliance，治理從單一公司移到中立組織。
- **消費端在 2026 年 11 月動了起來。** ChatGPT Wallet、Gemini 用 AP2 購物、AWS Marketplace 的 x402 付款，都在同一個月公布。
- **規則跟在後面。** 美國的穩定幣法規（GENIUS Act）最終規則在 2026 年 10 月由主管機關 OCC 發布，2027 年 1 月 18 日生效。[[25]](https://occ.gov/news-issuances/news-releases/2026/nr-occ-2026-92.html) 台灣的《虛擬資產服務法》2026 年 6 月 30 日在立法院三讀通過，[[26]](https://www.ly.gov.tw/Pages/Detail.aspx?nodeid=33324&pid=266121) 7 月 22 日公布，施行日期由行政院另定；法規資料庫目前標示為尚未生效。[[27]](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0400163) 子法的時程只有媒體引述的預估：最快 2027 年第一季完成。[[28]](https://udn.com/news/story/7239/9598149)

## 這麼多協定，其實各管一層 {#stack}

<div class="ap-scene">情境：你看到新聞寫「協定大戰」，覺得應該等贏家出來再說。</div>

把它們排開之後，會發現大部分根本不在同一層。

<figure>
  <a href="{{ '/assets/img/technical/x402-agent-commerce-field-guide/agentic-payment-layers.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="x402-agent-commerce" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/x402-agent-commerce-field-guide/agentic-payment-layers-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/x402-agent-commerce-field-guide/agentic-payment-layers.svg' | relative_url }}" alt="Agent 付款的四層：找商品與下單、授權、身分、付款與結算。多數協定只管其中一層，同層正面較勁的只有少數幾組。"></picture>
  </a>
  <figcaption>自製圖解。分層是我的整理，不是官方分類。</figcaption>
</figure>

買一樣東西要回答四個問題：店裡有什麼、怎麼下單；人同意了什麼；這個 Agent 是誰；錢實際怎麼過去。多數協定只回答其中一題。

所以實際發生的事是「全都接」，而不是選邊：

- Stripe 同時支援 MPP 與 x402。[[3]](https://docs.stripe.com/payments/machine)
- Visa 的 Intelligent Commerce Connect 一次接 Trusted Agent Protocol、MPP、ACP、UCP 四種。[[11]](https://investor.visa.com/news/news-details/2026/Visa-Opens-the-Door-to-AI-Driven-Shopping-for-Businesses-Worldwide/default.aspx)
- Google 發表 AP2 的同一天，就和 Coinbase 等夥伴推出把 x402 接進來的擴充。[[5]](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)
- x402 Foundation 正式運作時，最高等級的成員名單裡同時有 Visa、Mastercard、American Express、Stripe、Google、Cloudflare、Coinbase 與 Circle。[[29]](https://www.linuxfoundation.org/press/linux-foundation-announces-operational-launch-of-x402-foundation-to-standardize-internet-native-payments-for-ai-agents-and-applications) 走刷卡路線的幾家，也都在 x402 基金會的名單上。

真正在同一層正面較勁的，我看只有兩組：x402 和 MPP（都是「機器按次付費」），ACP 和 UCP（都是「怎麼下單」）。而連這兩組，上層的整合服務也是兩邊都接，把選擇權留給商家。

**我的判斷：對想動手的人來說，「該押哪一個協定」是問錯了問題。該問的是「我要解決的是哪一層」。** 我想讓 Agent 付幾分錢買一份資料，那是最底下的結算層，x402 是目前最容易自己架起來的一個。如果我要賣的是實體商品，答案就會完全不同。

還有一類東西常被拿來和付款協定比，其實不管付款。例如以太坊的 ERC-8004，它的草案寫明付款不在範圍內，處理的是 Agent 的身分與信譽。[[30]](https://eips.ethereum.org/EIPS/eip-8004)

## 三件比新聞標題更值得知道的事 {#reality}

### 最大的消費端實驗，退了一步又換個方式回來

ChatGPT 的站內結帳是這一波最受矚目的嘗試。2026 年 3 月，OpenAI 調整了方向。OpenAI 自己的說明是，第一版站內結帳沒有達到他們想提供的彈性，所以改讓商家用自己的結帳流程，OpenAI 把力氣放在幫人找商品。[[31]](https://openai.com/index/powering-product-discovery-in-chatgpt/)[[32]](https://techcrunch.com/2026/03/24/openais-plans-to-make-chatgpt-more-like-amazon-arent-going-so-well) 八個月後的 ChatGPT Wallet 換了一個做法：讓 Agent 帶著使用者逐筆核准過的授權去付款。[[4]](https://openai.com/index/introducing-chatgpt-wallet/) 這一來一回說明了一件事：就算是使用者最多的 AI 平台，「在對話裡直接買完」也要試過幾種做法才找得到路。

我買禮物那次，是挑定之後自己去結帳。換成我不在場、它得自己決定要不要付的時候，誰核准、最多能花多少，就得事先講好。

### 數字要先問口徑

x402 的交易量有好幾種說法。它們量的東西、期間、單位都不一樣，不能直接比大小：

<div class="ap-wrap">
<table class="ap-table">
  <caption>同一個協定，四種數字（都要連口徑一起讀）</caption>
  <thead><tr><th>誰說的</th><th>數字</th><th>期間、單位與口徑</th></tr></thead>
  <tbody>
    <tr><td>x402 官方（v2 發表文）<a href="https://www.x402.org/writing/x402-v2-launch">[33]</a></td><td>已處理超過 1 億筆付款</td><td>廠商自述，沒有說明怎麼算。</td></tr>
    <tr><td>CoinDesk 引 Artemis（2026-03-11）<a href="https://www.coindesk.com/markets/2026/03/11/coinbase-backed-ai-payments-protocol-wants-to-fix-micropayment-but-demand-is-just-not-there-yet">[34]</a></td><td>每天約 2.8 萬美元</td><td>當時的日交易額；同一篇指出約一半是自我交易或刷量。</td></tr>
    <tr><td>TRM Labs（2026-09-09）<a href="https://www.trmlabs.com/trm-tech-blog/whos-actually-paying-measuring-ai-agent-payments-onchain">[35]</a></td><td>約 5,270 萬美元、1.989 億筆；篩選後約 2,562 萬美元</td><td>2025 年 5 月起、三條鏈上的結算交易，單位是美元與筆數；後一個數字篩掉了自己付給自己、批次等情況。TRM 再用兩種行為條件去估，篩選後的金額裡看起來由 Agent 驅動的占 0.6% 到 7.5%。它也提醒：一直用同一個價格向同一個服務購買的位址，行為比較像排程程式。</td></tr>
    <tr><td>Chainalysis（CoinDesk 2026-10-14 報導）<a href="https://www.chainalysis.com/blog/north-america-crypto-adoption-2026/">[36]</a><a href="https://www.coindesk.com/business/2026/10/14/ai-agents-make-138-million-crypto-payments-as-u-s-dominates-spending-on-ai-models">[37]</a></td><td>累計超過 1.38 億筆</td><td>Base 鏈上的累計筆數。另一個數字是截至 2026 年 9 月的 16 個月裡，超過 87% 的付款「筆數」，單筆介於 0.01 美分到 10 美分。報導註明，筆數不等於真實的商業需求。</td></tr>
  </tbody>
</table>
</div>

這些數字彼此不矛盾，只是量的東西不同。我敢說的只有兩件事：筆數很多、單筆很小；而在 TRM 看得到的範圍裡，符合 Agent 行為條件的金額只占少數。這些都是鏈上的觀察，推不到刷卡那一邊。

我不覺得這是壞消息。它只是提醒：現在進場做 x402，目的應該是弄懂這條路怎麼走，而不是期待有人排隊來付錢。

### 出事了誰負責，還沒有人接

協定能做到的，是留下「誰授權了什麼」的證據。至於買錯了、被騙了該誰賠，協定不決定。2026 年 11 月，Linux Foundation 旗下研擬 Agent 授權與支出指引的組織，負責人對 CoinDesk 說得很直接：標準決定不了法律責任，那是契約、主管機關與法院的事。[[38]](https://www.coindesk.com/tech/2026/11/21/openai-anthropic-and-rivals-seek-ai-agent-rules-to-prevent-commerce-chaos)

目前我讀到最早表態的是 American Express。依《財星》報導，它在 2026 年 4 月宣布要替 Agent 代辦的交易提供購買保障；適用哪些 Agent、要符合什麼條件，得看它實際公布的條款。[[39]](https://fortune.com/2026/04/14/american-express-ai-payments-developers-purchase-protection/) ChatGPT Wallet 的公告也提到，符合條件的爭議有保障可用。[[4]](https://openai.com/index/introducing-chatgpt-wallet/)

已經發生的兩件事，一件關於授權，一件關於「Agent 算不算本人」：

- 據報導，2026 年 5 月有人送了一枚帶權限的 NFT 到一個由 AI 操作的錢包，再用藏起來的指令讓 AI 的輸出被當成轉帳命令，轉走的代幣約值 15 萬多美元。報導特別指出，這次沒有私鑰外洩、沒有智能合約漏洞，問題出在「AI 說的話可以直接變成金流」的授權設計。[[40]](https://cointelegraph.com/news/grok-bankr-wallet-free-nft-prompt-injection)
- 2026 年 8 月，美國第九巡迴上訴法院撤銷了 Amazon 對 Perplexity 購物 Agent 的初步禁制令。依 Engadget 引述的法院意見，Agent 是在使用者指示下存取網站，法院認為這樣的行為很可能不違反相關的電腦存取法律。[[41]](https://www.engadget.com/2230471/) 案子還沒結束，但「Agent 替我去逛，算不算我本人去」這一題，已經進了法院。

所以接下來看任何一個方案，我都會先問三件事：它讓 Agent 花錢之前，上限寫在哪裡；人在哪一步可以說不；出事之後查得到什麼。

## x402：買一份資料，送兩次請求 {#x402}

<div class="ap-scene">情境：你的 Agent 要查一份整理好的資料。那個服務不認識你，你也不想為了查一次去註冊帳號、綁信用卡、申請金鑰。</div>

網頁的規格裡，一直有一個幾乎沒人用的狀態碼：402，意思是「需要付款」。x402 的官方文件開頭就寫，這個代號幾十年來都標著「保留給未來使用」。[[42]](https://docs.x402.org/core-concepts/http-402)

x402 做的事，就是把這個空了很久的位置補起來。官方的定位是一個開放的付款標準，讓服務可以直接在 HTTP 上對接口或內容收費，買方不需要帳號、登入狀態或金鑰管理。[[43]](https://docs.x402.org/introduction) 它在 2025 年 5 月上線，[[33]](https://www.x402.org/writing/x402-v2-launch) 2026 年 4 月由 Linux Foundation 宣布成立 x402 Foundation 接手治理、Coinbase 把協定捐出來，7 月基金會正式運作。[[44]](https://www.linuxfoundation.org/press/linux-foundation-is-launching-the-x402-foundation-and-welcoming-the-contribution-of-the-x402-protocol)[[29]](https://www.linuxfoundation.org/press/linux-foundation-announces-operational-launch-of-x402-foundation-to-standardize-internet-native-payments-for-ai-agents-and-applications)

用販賣機來想最快：你按了按鈕，機器不出貨，螢幕顯示「請投 30 元」；你投了，它出貨、吐一張收據。x402 把「螢幕顯示金額」「投幣」「收據」這三件事，各放進一行表頭裡；貨本身，放在回應的內容裡。

<figure>
  <a href="{{ '/assets/img/technical/x402-agent-commerce-field-guide/payment-flow.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="x402-agent-commerce" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/x402-agent-commerce-field-guide/payment-flow-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/x402-agent-commerce-field-guide/payment-flow.svg' | relative_url }}" alt="x402 付款流程：買方要資料，賣方回 402 與報價單；買方簽付款授權後再要一次，賣方請代驗代結服務驗證並結算，最後回 200，資料在回應內容、結算結果在表頭。"></picture>
  </a>
  <figcaption>自製圖解，依 x402 官方文件的流程重畫。<a href="https://docs.x402.org/core-concepts/facilitator">出處</a></figcaption>
</figure>

照官方文件的流程，一次付款是這樣走的：[[45]](https://docs.x402.org/core-concepts/facilitator)

1. 買方向賣方要一份資料，就是一般的請求。
2. 賣方回 402，附上一張報價單，放在 `PAYMENT-REQUIRED` 這行表頭裡。
3. 買方從報價裡選一種付法，用錢包簽一張付款授權。
4. 買方帶著授權再要一次，授權放在 `PAYMENT-SIGNATURE` 表頭裡。
5. 賣方請代驗代結服務（Facilitator）檢查這張授權有沒有效。
6. 有效，賣方就把要給的內容準備好。
7. 賣方請 Facilitator 結算，Facilitator 把交易送上區塊鏈，等它確認。
8. 賣方回 200，交出資料，並在 `PAYMENT-RESPONSE` 表頭附上結算結果。

所以第一次向一個服務買東西，其實要送兩次請求：第一次拿到 402 和報價，第二次帶著付款授權。資料在第二次的回應內容裡，`PAYMENT-RESPONSE` 那行表頭附的是結算結果，兩者是分開的；拿到結算結果不等於拿到貨。上面寫的是固定金額這種付法的流程，其他付法的結算時機不同。

三行表頭的名字與方向，官方文件有一張表寫得很清楚。[[42]](https://docs.x402.org/core-concepts/http-402) 幾個第一次看容易誤會的地方：

- **買方簽的是「授權」，不是自己去轉帳。** 在以太坊相容的鏈上，USDC 支援一種做法（EIP-3009）：持有人用簽章同意一筆轉帳，實際把交易送上鏈、付手續費的可以是別人。[[46]](https://eips.ethereum.org/EIPS/eip-3009) 所以買方只簽名，上鏈由 Facilitator 處理。
- **Facilitator 不保管錢。** 官方文件說它不持有資金、不當保管人，只做驗證，並依買方簽好的內容執行鏈上交易。它是「建議使用、但非必要」的角色，賣方也可以自己驗、自己結。[[45]](https://docs.x402.org/core-concepts/facilitator)
- **協定本身不抽成。** 官方寫的是標準內建零手續費。[[43]](https://docs.x402.org/introduction) 這句話只管協定；你選的 Facilitator 要不要收服務費，是另一回事。

### 一張真的報價單長什麼樣

下面這張不是示意圖。我請 Claude Code 把賣方程式在我的筆電上跑起來，不帶任何付款去要那份付費資料，它回了 402，把表頭解開就是這個（這次測試用的是佔位的收款地址）：

```json
{
  "x402Version": 2,
  "error": "Payment required",
  "resource": {
    "url": "http://localhost/api/premium/checklist",
    "description": "Agentic Engineering Checklist (testnet demo)",
    "mimeType": "application/json"
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:84532",
      "amount": "10000",
      "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      "payTo": "0x1111111111111111111111111111111111111111",
      "maxTimeoutSeconds": 300,
      "extra": { "name": "USDC", "version": "2" }
    }
  ]
}
```

逐行翻成白話：

<div class="ap-wrap">
<table class="ap-table">
  <caption>報價單每一格在說什麼（2026-11-28 本機實測，測試網）</caption>
  <thead><tr><th>欄位</th><th>值</th><th>意思</th></tr></thead>
  <tbody>
    <tr><td><code>scheme</code></td><td><code>exact</code></td><td>固定金額，說多少就是多少。</td></tr>
    <tr><td><code>network</code></td><td><code>eip155:84532</code></td><td>Base Sepolia，Base 這條鏈的測試網。</td></tr>
    <tr><td><code>amount</code></td><td><code>10000</code></td><td>USDC 有 6 位小數，所以 10000 是 0.01 顆測試用 USDC。</td></tr>
    <tr><td><code>asset</code></td><td><code>0x036C…CF7e</code></td><td>測試網上 USDC 的合約地址，和 Circle 官方公布的一致。<a href="https://developers.circle.com/stablecoins/usdc-contract-addresses">[47]</a></td></tr>
    <tr><td><code>payTo</code></td><td>收款地址</td><td>錢要付給誰。這是公開資訊。</td></tr>
    <tr><td><code>maxTimeoutSeconds</code></td><td><code>300</code></td><td>賣方允許這次付款完成的最長時間，這裡是 300 秒。超過了也不代表可以直接重付；結果不明時要先對帳。</td></tr>
  </tbody>
</table>
</div>

這就是前一節說的「讀得懂的報價」。人看不懂沒關係，程式看得懂，而且每一格都能在付款前被檢查：金額有沒有超過上限、收款人是不是我認得的、是不是我願意用的那條鏈。

順帶一提，`exact`（固定金額）只是其中一種付法。官方文件另外列了兩種：`upto` 是買方先授權一個上限、賣方照實際用量收，適合按用量計費的服務；`batch-settlement` 是先確認授權、之後再把多筆小額合起來上鏈結算。[[48]](https://docs.x402.org/getting-started/quickstart-for-buyers)[[42]](https://docs.x402.org/core-concepts/http-402) 我的第一階段只用固定金額，因為它最容易驗證：報價寫多少，鏈上就該看到多少。之後如果要用另外兩種，還得先確認選的錢包、代幣與代驗代結服務都支援，不能假設通用。

## 三個最常見的誤會 {#myths}

**誤會一：我的網站放在 GitHub Pages，加一段程式就能收款。**

不行，原因有兩個。靜態網站的檔案是公開的，任何人都能直接下載，沒有地方可以「先檢查有沒有付錢再給」。另外 GitHub Pages 的使用條款明寫，它不提供給線上商店、或主要用途是促成商業交易的網站當免費主機用。[[49]](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) 所以展示歸展示，收款要另外放。

**誤會二：ChatGPT、Claude、Grok 看到 402 就會自己付錢。**

不會。在支援的購物服務裡，有的助理已經能替人刷卡，像前面提到的 ChatGPT Wallet，但那是卡片那條路，而且有地區與資格限制。[[4]](https://openai.com/index/introducing-chatgpt-wallet/) 要讓助理讀懂我這個服務的 x402 報價、簽出一筆 USDC 付款，還得另外接上相容的付款工具。這三家都能讓使用者自己接外部工具（MCP 連接器），[[50]](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)[[51]](https://developers.openai.com/api/docs/guides/developer-mode)[[52]](https://x.ai/news/grok-connectors) 但接上工具是一回事，手上有錢包、有授權、有人同意，是另一回事。

**誤會三：既然上了區塊鏈，每筆交易都該發一個 NFT 當憑證。**

不需要。付款本身在鏈上就查得到。NFT 該出場的時機，是「付完錢之後還有一份權利要持續存在」的時候，這個後面〈付款、收據、權利〉那一節再拆。

## 服務端：展示站不動，收款另外放 {#seller}

<div class="ap-scene">情境：你有一個放文章與作品的個人網站，想試試讓 Agent 付一點錢買你整理好的資料，但不想把整個網站搬家。</div>

我目前的規劃是這樣：

<figure>
  <a href="{{ '/assets/img/technical/x402-agent-commerce-field-guide/site-architecture.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="x402-agent-commerce" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/x402-agent-commerce-field-guide/site-architecture-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/x402-agent-commerce-field-guide/site-architecture.svg' | relative_url }}" alt="個人網站接上 x402 的架構：展示站維持不動，另外部署一支付費服務；Agent 直接呼叫付費服務，由代驗代結服務把 USDC 結算到賣方的收款地址。虛線是之後才加的模組。"></picture>
  </a>
  <figcaption>自製圖解。這是我的規劃，還沒有部署。</figcaption>
</figure>

- **展示站維持原樣。** 文章、作品、服務說明都留在現在的網站，免費、公開。它只多一個連結，指向付費服務的說明。
- **付費服務是一支另外部署的小程式。** 我打算放在 Cloudflare Workers 上。Cloudflare 的開發文件有現成的做法：用一支 Worker 擋在接口、網頁或檔案前面當付費牆，[[53]](https://developers.cloudflare.com/agents/agentic-payments/x402/) 它自己也是 x402 Foundation 的共同發起者。[[54]](https://www.cloudflare.com/press/press-releases/2025/cloudflare-and-coinbase-will-launch-x402-foundation/)
- **第一階段只有三個入口**：一個回報「我還活著」的健康檢查、一個公開的商品目錄、一份要付錢才拿得到的資料。
- **賣方不放私鑰。** 賣方程式只需要知道「錢要收到哪個地址」，那是公開資訊。依這個設計，就算程式寫壞或設定外洩，裡面也沒有能被偷走的鑰匙。

圖上灰色虛線的四塊（訂單與收據的資料庫、放正式內容的私有儲存空間、NFT 合約、給 Agent 用的服務入口）都是之後的事。第一階段一樣都不需要。

### 我實際驗到哪裡

這一段要講清楚，免得被讀成「已經上線」。

<div class="ap-wrap">
<table class="ap-table">
  <caption>目前的驗證狀態（2026-11-28）</caption>
  <thead><tr><th>項目</th><th>狀態</th><th>說明</th></tr></thead>
  <tbody>
    <tr><td>賣方、買方程式的型別檢查（確認程式的用法符合套件規格）</td><td><span class="ap-ok">已驗</span></td><td>用官方開發套件 2.17.0 與 2.32.0 兩個版本各跑一次，都沒有錯誤。</td></tr>
    <tr><td>健康檢查、公開目錄</td><td><span class="ap-ok">已驗</span></td><td>本機直接呼叫賣方程式，兩個都回 200。</td></tr>
    <tr><td>沒付錢去要付費資料</td><td><span class="ap-ok">已驗</span></td><td>回 402，報價單內容如上一節。</td></tr>
    <tr><td>官方公共 Facilitator</td><td><span class="ap-ok">已驗</span></td><td>查詢它支援的清單，確實包含 Base Sepolia 的固定金額付款。</td></tr>
    <tr><td>真的付一筆測試幣</td><td><span class="ap-no">未驗</span></td><td>一筆都沒付過。</td></tr>
    <tr><td>鏈上查得到那筆轉帳</td><td><span class="ap-no">未驗</span></td><td>同上。</td></tr>
    <tr><td>部署到 Cloudflare</td><td><span class="ap-no">未驗</span></td><td>目前只在筆電上、而且不是在 Cloudflare 的執行環境裡跑。</td></tr>
  </tbody>
</table>
</div>

也就是說，第一階段還在進行中。我現在能證明的只有流程的前半：服務知道怎麼開價。後半（收得到錢、給得出貨）還是紙上的。

### 從測試網到正式上線，差的不只一個設定

官方文件把「上主網」寫成四五個步驟：換 Facilitator、換網路代號、換成真的收款錢包、先用小額試。[[55]](https://docs.x402.org/getting-started/quickstart-for-sellers) 換網路的時候，USDC 的合約地址也要跟著換成主網那一個；收款錢包要和測試用的完全分開。看起來不多，但第一步就有坑。

官方提供的公共 Facilitator 只給開發與測試網用，文件明講不要拿它跑主網。[[45]](https://docs.x402.org/core-concepts/facilitator) 主網要另外選一家。官方列了二十多家，[[56]](https://docs.x402.org/dev-tools/facilitators) 各家條件不同。舉兩家對照：

- **Coinbase 開發者平台的 Facilitator**：每個月前 1,000 筆鏈上交易免費，之後每筆 0.001 美元；要用它的金鑰連線；每筆付款都會做制裁名單與交易風險篩查，有問題的地址會被拒絕。[[57]](https://docs.cdp.coinbase.com/x402/core-concepts/facilitator)
- **PayAI**：文件寫一開始有 1,000 點免費額度，不用註冊、不用金鑰；用完之後依鏈上手續費加成計價，而且不是照付款金額抽成。[[58]](https://docs.payai.network/x402/facilitators/pricing)

我沒查清楚的是：這些服務對台灣的賣方有沒有地區或資格限制。上面兩家的文件頁都沒有寫，但頁面沒寫不等於沒有限制，得實際申請才知道。這一題沒有答案之前，我不會碰主網。

定價也是到那時候才要面對的事。測試用的 0.01 只是為了跑流程；真的要收錢，每一筆的收入得付得起代驗代結的費用、運算、交付和售後處理，太小的金額未必划算。

另外提醒一件容易混淆的事：Cloudflare 另有一個替你代管整個收款流程的 Monetization Gateway，官方文件寫它還在封閉測試，而且買賣雙方都必須在美國。[[59]](https://developers.cloudflare.com/monetization-gateway/) 那項限制寫在代管服務的條件裡。自己在 Workers 上跑 x402 的開發套件是另一條路，但選的代驗代結服務收不收台灣的賣方仍要另外確認，合規、對帳、退款也都得自己扛。

## 客戶端：模型不拿私鑰 {#buyer}

<div class="ap-scene">情境：服務端有了雛形。現在換個位置，你是那個想讓 Agent 幫你付錢的人。你要準備什麼？</div>

先講原則：**付款能力不在模型身上，在它外面那層工具上。** 模型負責讀報價、判斷值不值得、提出「我想買這個」；真正簽名的是一個獨立的錢包程式，而且簽之前要過一道寫死在程式裡的檢查。x402 官方談到把付款接進 AI 助理時，也是這麼寫的：支出控制不要只靠提示詞，檢查要放在付款程式旁邊的程式碼裡。[[60]](https://docs.x402.org/guides/mcp-server-with-x402)

道理很直白。提示詞寫「每筆不能超過 1 美元」，模型大多會照做；但只要它讀到一段惡意內容說「忽略前面的限制」，那句話就可能失效。寫在程式裡的上限不會被說服。

買方要走的路，我分成三條：

<figure>
  <a href="{{ '/assets/img/technical/x402-agent-commerce-field-guide/buyer-paths.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="x402-agent-commerce" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/x402-agent-commerce-field-guide/buyer-paths-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/x402-agent-commerce-field-guide/buyer-paths.svg' | relative_url }}" alt="買方三條路：程式直接付、現成的付款工具、自己做付款閘道。跑這條測試流程，三條路都需要有測試用 USDC 且能簽名的錢包、寫在程式裡的支出上限，以及人的核准。"></picture>
  </a>
  <figcaption>自製圖解。順序是我的規劃。</figcaption>
</figure>

<div class="ap-wrap">
<table class="ap-table">
  <caption>買方三條路（我的規劃順序；各工具說明依官方頁面，2026-11-28 查核）</caption>
  <thead><tr><th>路線</th><th>怎麼做</th><th>誰簽名</th><th>我的看法</th></tr></thead>
  <tbody>
    <tr><td><strong>A. 程式直接付</strong></td><td>用官方開發套件寫一支付款腳本。套件會自動處理「收到 402、簽授權、再送一次」。<a href="https://docs.x402.org/getting-started/quickstart-for-buyers">[48]</a></td><td>你自己的錢包，鑰匙留在你的電腦上</td><td>先做這條。買賣兩邊的條件都在我手上，最適合拿來驗證自己的服務。之後把它包成一個工具給 Agent 呼叫，就有完整的「請助理買資料」體驗。</td></tr>
    <tr><td><strong>B. 現成的付款工具</strong></td><td>把別人做好的付款工具接到 Agent 上。例如 Hermes Agent 的 Pay 外掛，用的是代管的付款帳戶，每筆付款都要你確認；<a href="https://hermes-agent.nousresearch.com/docs/plugins/pay">[61]</a> Pay.sh 則能直接啟動已接好付款工具的 Claude Code 或 Codex，並提供不花真錢的練習模式。<a href="https://pay.sh/docs/pay-for-apis/agents">[62]</a><a href="https://pay.sh/docs/get-started/install">[63]</a></td><td>該工具管理的帳戶或錢包</td><td>拿來對照體驗。這些工具支援哪些鏈、哪些地區，官方頁面沒有寫清楚，不能假設它付得了你自己的服務；在它的練習模式裡跑通，也只證明工具本身會動。</td></tr>
    <tr><td><strong>C. 自己做付款閘道</strong></td><td>讓聊天型助理透過連接器呼叫你的閘道，由人在另一個頁面按核准，閘道背後的獨立錢包服務才簽名。</td><td>你營運的錢包服務</td><td>最後才考慮。工程最大，而且等於自己營運一個替別人管錢的服務，責任完全不同。</td></tr>
  </tbody>
</table>
</div>

要跑我選的這條測試流程，三條路都得先備齊三樣東西：一個裡面有測試用 USDC、能簽名的錢包，寫在程式裡的支出上限，以及人的核准或事先授權。

「寫在程式裡的支出上限」聽起來只是一個數字，實際上我打算讓付款腳本在簽名前逐項核對，任何一項不符就不簽：

- **付到哪裡**：只允許事先列好的服務網址與請求方式；對方回的是轉址就停下，不跟著跳。
- **付給誰**：報價裡的收款地址要和我記下的一致。
- **用什麼付**：鏈、付法、代幣合約三格都要是我允許的那一組。報價單上的代幣名稱可以亂寫，合約地址才算數。
- **付多少**：不超過單筆上限，也不超過當天累計上限。
- **付幾次**：一次執行最多簽一張授權；等超過 30 秒沒有結果就停，交給人看。這一條只管得住「這一次執行」，擋不了同一支腳本被連續啟動很多次，所以當天累計上限要另外記在腳本外面。

這張清單對應的正是上一節報價單裡的每一格。x402 把報價做成程式讀得懂的格式，好處就在這裡：能檢查的東西，都可以在錢離手之前檢查完。

官方開發套件在這一點上給了不錯的預設：買方程式預設只付認得的美元穩定幣，而且每筆上限 1 美元，要放寬得自己改設定。[[48]](https://docs.x402.org/getting-started/quickstart-for-buyers) 這個預設是後來才有的：依官方的版本紀錄，它在 2.26.0 才加進核心套件，[[64]](https://github.com/x402-foundation/x402/blob/main/typescript/packages/core/CHANGELOG.md) 所以我測過的兩個版本裡，2.32.0 有、2.17.0 沒有。雲端安全聯盟（CSA）2026 年 10 月的研究筆記提到，2026 年 8 月修補之前，預設的付款程式沒有支出上限。[[65]](https://labs.cloudsecurityalliance.org/research/csa-research-note-x402-agent-payment-sdk-flaws-20261025-csa/) 所以用舊版本的人要特別留意。

還有一個變動要提：Coinbase 先前給 Agent 用的錢包工具組（Agentic Wallet Skills）已經標示棄用，說明頁寫它會被新的 Wallet MCP 取代，並提醒使用者不要再往舊錢包存錢。[[66]](https://github.com/coinbase/agentic-wallet-skills) 現成的工具說換就換，是我把「自己寫腳本」排第一的另一個原因：腳本依賴的只有協定和官方套件。

### 門檻到底有多高

以我選的這條路（買方自己拿錢包付 USDC）來說，很高，而且高在買方這一側。

賣方做完之後，對方要能付款，得先有錢包、有 USDC、有接好的付款工具，還要願意設定授權。備齊這些的人，現在多半是「會用開發工具、又碰過加密貨幣」的那一群。一般用瀏覽器逛網站的訪客完全用不到：瀏覽器看到 402 不會自己付，除非你另外做一個連錢包的付款頁，而那其實就是又做了一個結帳流程。

所以我對這件事的期待很清楚：它現在是一個可以動手驗證的技術展示，還不是一個能讓一般客戶掏錢的管道。要對一般人收費，刷卡和轉帳的門檻仍然低得多。

買方不必碰錢包的做法也有，例如前面提到 AWS 把 x402 的費用記進企業帳單。但那是平台替買賣雙方代收代付，賣方得先上架到它的市集，不是個人網站自己架得起來的。

## 付款、收據、權利是三件事 {#layers}

<div class="ap-scene">情境：有人付了錢，買的不是「查一次」，而是「這份教材以後都可以下載」。半年後他換了電腦，你怎麼知道他有沒有買過？</div>

這是我在整理的過程中覺得最值得想清楚的一點。很多討論把「付款」「收據」「NFT」混成一件事，其實它們各自回答不同的問題。

<figure>
  <a href="{{ '/assets/img/technical/x402-agent-commerce-field-guide/three-layers.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="x402-agent-commerce" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/x402-agent-commerce-field-guide/three-layers-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/x402-agent-commerce-field-guide/three-layers.svg' | relative_url }}" alt="三層模型：付款層回答誰付了多少，存證層回答買的是什麼，權利層回答現在誰有權使用。查一次資料只需要付款層；可轉讓、或要讓別家服務驗證的使用權才需要權利層。"></picture>
  </a>
  <figcaption>自製圖解。</figcaption>
</figure>

- **付款層**回答「誰付了多少、在哪條鏈」。x402 加上 USDC 做的就是這一層。
- **存證層**回答「賣方承諾這筆錢買的是什麼」。x402 有一個選用的延伸功能，讓賣方替報價與收據加上簽章，當成這次交易的密碼學證明。[[67]](https://docs.x402.org/extensions/offer-receipt) 鏈上的轉帳紀錄只說錢動了，不會說買的是哪個商品、哪個版本。
- **權利層**回答「現在誰有權使用」。這一層才輪到 NFT 或其他授權憑證。

對應到實際的商品：

<div class="ap-wrap">
<table class="ap-table">
  <caption>什麼情況需要到哪一層（我的整理）</caption>
  <thead><tr><th>賣的東西</th><th>需要到哪一層</th><th>理由</th></tr></thead>
  <tbody>
    <tr><td>查一次資料</td><td>付款層</td><td>付完就結束，沒有後續權利。發 NFT 只是多花手續費、多等一段時間。</td></tr>
    <tr><td>一份生成好的報告</td><td>付款層加存證層</td><td>買方需要一張講得清楚「買了什麼」的收據。</td></tr>
    <tr><td>指定版本、以後都能下載</td><td>付款層加存證層，外加賣方自己的訂單紀錄</td><td>換一台電腦重新下載，賣方查自己的訂單就能處理，還用不到 NFT。</td></tr>
    <tr><td>可以轉讓、或要讓別家服務也能驗證的使用權</td><td>三層都要</td><td>權利要能離開賣方的資料庫獨立存在，這才是 NFT 派得上用場的地方。</td></tr>
    <tr><td>唯一的作品、個別授權</td><td>三層都要</td><td>要能辨認「是哪一件」，而不只是「買過這一類」。</td></tr>
    <tr><td>會員、有期限的使用權</td><td>三層都要，外加自己的規則</td><td>到期、續約、用量、撤銷，NFT 本身管不了，要另外設計。</td></tr>
  </tbody>
</table>
</div>

兩個容易踩的地方：

- **NFT 轉手之後，原始付款人不會變。** 付款紀錄說的是「當初誰付的」，NFT 說的是「現在誰持有」。兩者會分開。
- **持有 NFT 不等於取得著作權。** 授權範圍（能不能轉讓、能不能商用、到什麼時候）要寫在條款裡，NFT 只是那份條款的憑證。
- **簽章收據不是發票。** 它證明的是「賣方對這筆交易說過什麼」，不等於法律或稅務上的憑證，而且是選用功能，不是每個服務都會給。
- **公開的東西就是公開的。** NFT 的說明資料任何人都讀得到，裡面不該放交易明細、個人資料或下載網址。只放雜湊值（內容的數位指紋）也不代表安全：雜湊不是加密，原始資料如果選項很少，是可以一個一個試出來的。

真要做權利層，NFT 也不是只有一種。以太坊上幾個常見的標準，適合的商品不一樣：

<div class="ap-wrap">
<table class="ap-table">
  <caption>幾種 NFT 標準與適合的用途（標準名稱依以太坊提案頁；用途對應是我的整理）</caption>
  <thead><tr><th>標準</th><th>特性</th><th>我會拿來對應的商品</th></tr></thead>
  <tbody>
    <tr><td>ERC-721 <a href="https://eips.ethereum.org/EIPS/eip-721">[68]</a></td><td>每一個都獨一無二。</td><td>唯一的作品、個別簽署的授權。</td></tr>
    <tr><td>ERC-1155 <a href="https://eips.ethereum.org/EIPS/eip-1155">[69]</a></td><td>同一種可以發很多份。</td><td>同一版教材賣給很多人。</td></tr>
    <tr><td>ERC-5192 <a href="https://eips.ethereum.org/EIPS/eip-5192">[70]</a></td><td>發出去之後鎖住、不能轉讓。</td><td>綁定個人的資格或會員。</td></tr>
    <tr><td>ERC-4907 <a href="https://eips.ethereum.org/EIPS/eip-4907">[71]</a></td><td>把「持有人」和「使用者」分開，使用權有到期日。</td><td>有期限的租用。</td></tr>
  </tbody>
</table>
</div>

還有一種商品是 NFT 單獨處理不了的：次數型的套票。「買 100 次查詢」如果做成 100 個代幣，鏈上的餘額不會因為你查了一次就少一個；剩餘次數還是得記在賣方自己的帳上。

如果買方之後要回來重新取得已經買過的內容，x402 另有一個延伸功能，讓對方證明自己持有某個錢包，不用再付一次。[[72]](https://docs.x402.org/extensions/sign-in-with-x) 這對「買一次、之後都能用」的商品很關鍵，也是我排在第二、第三階段才處理的東西。要留意的是，證明「這個錢包是我的」只是第一步；賣方接著還是得查這個錢包名下有哪張訂單、或現在持有哪份權利，有沒有過期、次數用完了沒。

## 賣什麼：Agent 自己做不到的事 {#products}

協定搞懂之後，真正難的是這一題。我沒有任何證據顯示，會有人為已經公開的文章付費。

我用一個判準來篩：**Agent 自己做不到、或者自己做很麻煩的事，才值得它付錢。** 照這個標準，我手上的候選是這幾類（都還沒上架，也還沒定價）：

<div class="ap-wrap">
<table class="ap-table">
  <caption>候選商品與我的顧慮（規劃中，未上架）</caption>
  <thead><tr><th>候選</th><th>Agent 為什麼需要</th><th>顧慮</th></tr></thead>
  <tbody>
    <tr><td>需要精確計算的結果，例如排盤類工具</td><td>語言模型不擅長精確的天文曆法計算，一定得呼叫外部程式。</td><td>我的自我探索工具一直承諾「所有計算都在你的裝置上完成、資料不會上傳」。如果另外開一個接口，出生資料就會傳到伺服器，那必須是買方清楚知情、自己選擇的另一種用法，不能混在一起。</td></tr>
    <tr><td>AI 導入的檢核表與流程範本</td><td>買方的 Agent 要替主管整理導入計畫時，可以直接拿結構化的清單來用。</td><td>只有沒公開過的內容才有價值；公開文章的重新包裝不算。</td></tr>
    <tr><td>現實世界資產（Real World Assets，RWA）的架構比較與檢核表</td><td>同上，買的是整理與判斷。</td><td>哪些研究願意拿出來，要我自己逐份挑。</td></tr>
    <tr><td>古典小說的結構化資料</td><td>角色關係、事件索引可以直接查。</td><td>原文是公版，資料也已經公開在站上，賣的只剩「方便」。價值最低。</td></tr>
    <tr><td>攝影作品與授權</td><td>買方多半是人，不是 Agent。</td><td>涉及模特兒與合作方的授權範圍，風險最高。不會是早期商品。</td></tr>
  </tbody>
</table>
</div>

第一筆測試我會用一份示範用的檢核表，內容不重要，目的只是把流程跑通。真正要賣什麼，我還在想。

## 它會怎麼壞 {#risks}

<div class="ap-scene">情境：你的 Agent 付了錢，連線剛好在這時候斷掉。它不知道對方收到沒有。它該再付一次嗎？</div>

官方文件對這題的回答很明確：不行。送出付款授權之後，結果就要當成「未知」，不可以自動再建立或授權第二筆付款，因為對方可能已經收到並結算了。[[73]](https://docs.x402.org/core-concepts/client-server) 正確的做法是先對帳：有交易編號就去鏈上查，沒有就走對方的查詢或客服流程；到了自己設的期限還查不出來，就停下自動付款，轉成人工處理。

賣方這一側也要接得住。買方斷線後拿著原本的訂單編號回來問，賣方查到這筆確實已經結算，就把東西補給他，不再收一次錢；同一張訂單不管被問幾次，領回的都是同一份權利。

這只是其中一種壞法。把我讀到的整理起來：

<div class="ap-wrap">
<table class="ap-table">
  <caption>會壞的地方與對應做法</caption>
  <thead><tr><th>會怎麼壞</th><th>為什麼</th><th>做法</th></tr></thead>
  <tbody>
    <tr><td>付了錢，沒拿到東西</td><td>回應在路上遺失，或結算卡在「已送出、未確認」。官方文件說這種狀態還不是最後結果，交易仍可能上鏈。<a href="https://docs.x402.org/core-concepts/facilitator">[45]</a></td><td>買方不自動重付，先對帳。賣方要保存訂單，讓付過的人能回來領。</td></tr>
    <tr><td>同一筆被扣兩次</td><td>買方以為失敗而重送。</td><td>同一個請求重試時保留同一個付款識別碼；x402 有對應的延伸功能，<a href="https://docs.x402.org/extensions/payment-identifier">[74]</a> 但官方也說，光有識別碼不代表重試就安全，還要看賣方怎麼存、存多久。<a href="https://docs.x402.org/core-concepts/client-server">[73]</a></td></tr>
    <tr><td>被惡意內容騙去付錢</td><td>Agent 讀到的網頁或接口回應裡藏著指令。CSA 的研究筆記提到，Agent 可能被這種方式導去付款給攻擊者控制的伺服器；截至該筆記發布，沒有實際遭利用的通報。<a href="https://labs.cloudsecurityalliance.org/research/csa-research-note-x402-agent-payment-sdk-flaws-20261025-csa/">[65]</a></td><td>外部內容一律當成不可信的資料。金額上限、收款人白名單、可用的鏈，全部寫在程式裡檢查。</td></tr>
    <tr><td>沒給錢卻拿到東西，或給了錢卻被拒絕</td><td>請求與回應是同步的，鏈上結算是非同步的，兩者之間有縫。2026 年 5 月有一篇預印本論文專門分析這類攻擊（尚未經同儕審查）。<a href="https://arxiv.org/abs/2605.11781">[75]</a></td><td>賣方在結算確認前，不交付收不回來的東西。</td></tr>
    <tr><td>付費內容被繞過</td><td>正式內容放在猜得到的公開網址，或付費回應被中間的快取存下來、再發給沒付錢的人。</td><td>正式內容放私有儲存空間，只透過付費服務給；付費回應標明不可快取；下載連結設短時效。</td></tr>
    <tr><td>私鑰外洩</td><td>鑰匙被寫進提示詞、程式庫或紀錄檔。</td><td>賣方只放收款地址；買方的鑰匙只留在自己的機器，測試與正式分開，不共用。</td></tr>
    <tr><td>退款與爭議沒人管</td><td>協定只處理付款。買錯、品質不符、要退錢，都不在它的範圍內。</td><td>自己訂條款、自己做退款流程。這部分我沒有找到夠權威的獨立分析，只能說是我的判斷。</td></tr>
  </tbody>
</table>
</div>

最後一列是我覺得最容易被忽略的。信用卡之所以讓人敢刷，很大一部分是因為刷錯了可以爭議、可以退。穩定幣付款預設沒有這一層，付出去就是付出去了。這也是為什麼卡組織那條路線並沒有因為 x402 出現就消失：它們賣的本來就不只是「把錢送過去」。

正式商用之前，還有契約、稅務與發票、消費者保護、個資、著作權，以及虛擬資產相關的法規要逐項釐清。這些我會另外找專業的人確認，不在這篇下結論。

## 我的下一步 {#next}

我不打算一次做一個商城。順序是這樣：

<figure>
  <a href="{{ '/assets/img/technical/x402-agent-commerce-field-guide/roadmap.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="x402-agent-commerce" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/x402-agent-commerce-field-guide/roadmap-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/x402-agent-commerce-field-guide/roadmap.svg' | relative_url }}" alt="五個階段：測試網付第一筆、私有內容與訂單、NFT 授權、讓 Agent 找得到、正式主網。目前在第一階段：賣方程式已在本機回出 402 與正確報價，還沒付過任何一筆。"></picture>
  </a>
  <figcaption>自製圖解。每個階段下方是過關條件。</figcaption>
</figure>

每一階段都有一個過得了才往下走的條件。第一階段的條件最單純：沒付錢得到 402，付了得到 200 並拿到預期的內容，而且在區塊鏈瀏覽器上查得到那筆轉帳，代幣、收款人、金額三樣都和報價單對得上。每一項都要有證據，少一個就不算過。

這三個只是「順利的那條路」。過關之前我還會故意把它弄壞，看它擋不擋得住：

- 把簽好的授權改掉一個字再送，應該被拒絕。
- 用錯的鏈、錯的代幣、錯的收款地址去付，應該被拒絕。
- 把同一張已經用過的授權再送一次，不該被收兩次錢，也不該再出一次貨。
- 讓代驗代結服務逾時，賣方不該在沒結算的情況下交出內容。
- 從瀏覽器裡的程式呼叫時，確認它讀得到那幾行付款表頭（跨來源的請求預設讀不到，賣方要明確開放）。
- 連續要兩次付費資料，確認第二個人拿到的不是第一個人付錢換來、被快取住的那一份。

第二階段開始要記帳。一筆訂單不會只有「付了」和「沒付」兩種狀態，中間至少還有「已報價」「授權已送出、結果未知」「已結算、還沒交付」。最麻煩的是結果未知那一格：它不能直接當成失敗，也不能當成成功，要有一支定時對帳的程式去鏈上查清楚，再決定補交付還是關單。同一筆訂單不管被重送幾次，都只能交付一次、只能發一次憑證。

還沒想清楚、也不打算假裝想清楚的事：

- **賣什麼。** 前面列的候選商品裡，哪一個值得放第一個，我還沒決定。
- **要不要做 NFT 那一層。** 它只在「長期使用權」的商品上才有意義，而我還不確定自己有沒有那種商品。
- **主網。** 在弄清楚台灣賣方能用哪些 Facilitator、要負哪些義務之前，一切只在測試網上做。
- **讓其他人的 Agent 找得到。** x402 有一個叫 Bazaar 的探索層，[[76]](https://docs.x402.org/extensions/bazaar) 服務要帶著對應的延伸資料、並且真的有付款經過 Facilitator 結算，才會被收錄。那是有了第一筆之後的事。在那之前，公開的商品目錄就是入口：對方的 Agent 先讀目錄，看得到每項商品的版本、用途、價格與授權範圍，再決定要不要詢價。這一段不用付款就能測。

回到開頭那組收藏卡。我想像的畫面其實很小：下次我說「就這個」，助理回我「599 元，我用你上週設的 1,000 元禮物預算付，可以嗎？」我回一個「好」，然後收到一張寫明買了什麼、付給誰的收據。

這個畫面，在美國的少數產品裡已經開始出現。對我來說還沒做完的，是預算怎麼給、出錯誰負責、買的人怎麼安心。那些才是我想花時間的地方。

## 參考資料

資料查核日：2026-11-28。標示日期的是該來源的發表日；沒有標示的是持續更新的文件頁。

- **[1]** [OpenAI：Buy it in ChatGPT: Instant Checkout and the Agentic Commerce Protocol（2025-09-29）](https://openai.com/index/buy-it-in-chatgpt/)
- **[2]** [GitHub：Agentic Commerce Protocol 規格（OpenAI 與 Stripe 維護）](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol)
- **[3]** [Stripe Docs：Machine payments](https://docs.stripe.com/payments/machine)
- **[4]** [OpenAI：Introducing ChatGPT Wallet（2026-11-13）](https://openai.com/index/introducing-chatgpt-wallet/)
- **[5]** [Google Cloud：Announcing Agent Payments Protocol (AP2)（2025-09）](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)
- **[6]** [Google：We're donating Agent Payments Protocol to the FIDO Alliance（2026-04-28）](https://blog.google/products-and-platforms/platforms/google-pay/agent-payments-protocol-fido-alliance/)
- **[7]** [Google Developers Blog：Under the Hood: Universal Commerce Protocol (UCP)](https://developers.googleblog.com/en/under-the-hood-universal-commerce-protocol-ucp/)
- **[8]** [Google Merchant Center 說明：Universal Commerce Protocol 的適用範圍](https://support.google.com/merchants/answer/16837055?hl=en)
- **[9]** [Google：How to use Tasks in Gemini for personal assistance（2026-11）](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/)
- **[10]** [Visa：Visa Unveils Trusted Agent Protocol for AI Commerce（2025-10-14）](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html)
- **[11]** [Visa：Visa Opens the Door to AI-Driven Shopping for Businesses Worldwide（2026-04-08）](https://investor.visa.com/news/news-details/2026/Visa-Opens-the-Door-to-AI-Driven-Shopping-for-Businesses-Worldwide/default.aspx)
- **[12]** [Visa：Visa Expands Agentic Ready to Help Scale Trusted AI Commerce Globally（2026-11-17）](https://investor.visa.com/news/news-details/2026/Visa-Expands-Agentic-Ready-to-Help-Scale-Trusted-AI-Commerce-Globally/default.aspx)
- **[13]** [Mastercard：Mastercard Unveils Agent Pay（2025-04-29）](https://investor.mastercard.com/investor-news/investor-news-details/2025/Mastercard-Unveils-Agent-Pay-Pioneering-Agentic-Payments-Technology-to-Power-Commerce-in-the-Age-of-AI/default.aspx)
- **[14]** [萬事達卡：萬事達卡攜手星展銀行（台灣）完成第一筆代理式 AI 支付交易（2026-03-26）](https://www.mastercard.com/news/ap/zh-tw/新聞中心/新聞稿/zh-tw/2026/mar/萬事達卡攜手星展銀行-台灣-完成第一筆代理式ai支付交易/)
- **[15]** [Microsoft：Microsoft propels retail forward with agentic AI capabilities（2026-01-08）](https://news.microsoft.com/source/2026/01/08/microsoft-propels-retail-forward-with-agentic-ai-capabilities-that-power-intelligent-automation-for-every-retail-function/)
- **[16]** [PayPal Developer：Agentic commerce services](https://developer.paypal.com/agentic-commerce-services/about)
- **[17]** [Cloudflare Blog：Launching the x402 Foundation with Coinbase, and support for x402 transactions（2025-09-23）](https://blog.cloudflare.com/x402/)
- **[18]** [Cloudflare Blog：Introducing pay per crawl（2025-07-01）](https://blog.cloudflare.com/introducing-pay-per-crawl/)
- **[19]** [Stripe Blog：Introducing the Machine Payments Protocol（2026-03-18）](https://stripe.com/blog/machine-payments-protocol)
- **[20]** [The Block：Google Cloud 與 Solana Foundation 推出 Pay.sh（2026-05-05）](https://www.theblock.co/news/web3/2026-05-05-google-cloud-solana-foundation-ai-payments-400059)
- **[21]** [Circle：Introducing Circle Agent Stack（2026-05-11）](https://www.circle.com/blog/introducing-circle-agent-stack-financial-infrastructure-for-the-agentic-economy)
- **[22]** [Stripe Docs：Machine Payments Protocol (MPP)](https://docs.stripe.com/payments/machine/mpp)
- **[23]** [AWS：AWS Marketplace now supports agentic payments with AgentCore（2026-11-19）](https://aws.amazon.com/about-aws/whats-new/2026/11/marketplace-agentic-payments-agentcore/)
- **[24]** [Mastercard：Watch Mastercard Agent Pay for Machines in action（2026-10-20）](https://www.mastercard.com/global/en/news-and-trends/press/2026/october/Mastercard-Agent-Pay-for-Machines-in-action.html)
- **[25]** [美國 OCC：GENIUS Act 最終規則新聞稿（2026-10-21）](https://occ.gov/news-issuances/news-releases/2026/nr-occ-2026-92.html)
- **[26]** [立法院法制局：重要通過法案——制定虛擬資產服務法](https://www.ly.gov.tw/Pages/Detail.aspx?nodeid=33324&pid=266121)
- **[27]** [全國法規資料庫：虛擬資產服務法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0400163)
- **[28]** [聯合新聞網：虛擬資產服務法三讀後的子法時程](https://udn.com/news/story/7239/9598149)
- **[29]** [Linux Foundation：Operational Launch of x402 Foundation（2026-07-14）](https://www.linuxfoundation.org/press/linux-foundation-announces-operational-launch-of-x402-foundation-to-standardize-internet-native-payments-for-ai-agents-and-applications)
- **[30]** [Ethereum Improvement Proposals：ERC-8004 Trustless Agents（草案）](https://eips.ethereum.org/EIPS/eip-8004)
- **[31]** [OpenAI：Powering Product Discovery in ChatGPT（2026-03）](https://openai.com/index/powering-product-discovery-in-chatgpt/)
- **[32]** [TechCrunch：OpenAI's plans to make ChatGPT more like Amazon aren't going so well（2026-03-24）](https://techcrunch.com/2026/03/24/openais-plans-to-make-chatgpt-more-like-amazon-arent-going-so-well)
- **[33]** [x402：Introducing x402 V2](https://www.x402.org/writing/x402-v2-launch)
- **[34]** [CoinDesk：Coinbase-backed AI payments protocol wants to fix micropayments, but demand is just not there yet（2026-03-11）](https://www.coindesk.com/markets/2026/03/11/coinbase-backed-ai-payments-protocol-wants-to-fix-micropayment-but-demand-is-just-not-there-yet)
- **[35]** [TRM Labs：Who's Actually Paying? Measuring AI Agent Payments Onchain（2026-09-09）](https://www.trmlabs.com/trm-tech-blog/whos-actually-paying-measuring-ai-agent-payments-onchain)
- **[36]** [Chainalysis：2026 North America Crypto Adoption](https://www.chainalysis.com/blog/north-america-crypto-adoption-2026/)
- **[37]** [CoinDesk：AI agents make 138 million crypto payments（2026-10-14）](https://www.coindesk.com/business/2026/10/14/ai-agents-make-138-million-crypto-payments-as-u-s-dominates-spending-on-ai-models)
- **[38]** [CoinDesk：OpenAI, Anthropic and rivals seek AI agent rules to prevent commerce chaos（2026-11-21）](https://www.coindesk.com/tech/2026/11/21/openai-anthropic-and-rivals-seek-ai-agent-rules-to-prevent-commerce-chaos)
- **[39]** [Fortune：American Express 推出 Agent 開發套件與購買保障（2026-04-14）](https://fortune.com/2026/04/14/american-express-ai-payments-developers-purchase-protection/)
- **[40]** [Cointelegraph：Grok 與 Bankr 錢包遭隱藏指令攻擊（2026-05-13）](https://cointelegraph.com/news/grok-bankr-wallet-free-nft-prompt-injection)
- **[41]** [Engadget：上訴法院撤銷 Amazon 對 Perplexity 的禁制令（2026-08）](https://www.engadget.com/2230471/)
- **[42]** [x402 Docs：HTTP 402](https://docs.x402.org/core-concepts/http-402)
- **[43]** [x402 Docs：Welcome to x402](https://docs.x402.org/introduction)
- **[44]** [Linux Foundation：Linux Foundation is Launching the x402 Foundation（2026-04-02）](https://www.linuxfoundation.org/press/linux-foundation-is-launching-the-x402-foundation-and-welcoming-the-contribution-of-the-x402-protocol)
- **[45]** [x402 Docs：Facilitator](https://docs.x402.org/core-concepts/facilitator)
- **[46]** [Ethereum Improvement Proposals：EIP-3009 Transfer With Authorization](https://eips.ethereum.org/EIPS/eip-3009)
- **[47]** [Circle Docs：USDC Contract Addresses](https://developers.circle.com/stablecoins/usdc-contract-addresses)
- **[48]** [x402 Docs：Quickstart for Buyers（Spend Controls）](https://docs.x402.org/getting-started/quickstart-for-buyers)
- **[49]** [GitHub Docs：GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- **[50]** [Claude Help Center：Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- **[51]** [OpenAI Developers：Developer mode（把 MCP 伺服器接到 ChatGPT）](https://developers.openai.com/api/docs/guides/developer-mode)
- **[52]** [xAI：Grok Connectors（2026-05-06）](https://x.ai/news/grok-connectors)
- **[53]** [Cloudflare Docs：Agentic payments with x402](https://developers.cloudflare.com/agents/agentic-payments/x402/)
- **[54]** [Cloudflare：Cloudflare and Coinbase Will Launch x402 Foundation（2025-09-23）](https://www.cloudflare.com/press/press-releases/2025/cloudflare-and-coinbase-will-launch-x402-foundation/)
- **[55]** [x402 Docs：Quickstart for Sellers](https://docs.x402.org/getting-started/quickstart-for-sellers)
- **[56]** [x402 Docs：Facilitators](https://docs.x402.org/dev-tools/facilitators)
- **[57]** [Coinbase Developer Documentation：CDP Facilitator](https://docs.cdp.coinbase.com/x402/core-concepts/facilitator)
- **[58]** [PayAI Docs：Facilitator pricing](https://docs.payai.network/x402/facilitators/pricing)
- **[59]** [Cloudflare Docs：Monetization Gateway](https://developers.cloudflare.com/monetization-gateway/)
- **[60]** [x402 Docs：MCP Server with x402](https://docs.x402.org/guides/mcp-server-with-x402)
- **[61]** [Hermes Agent Docs：Pay plugin](https://hermes-agent.nousresearch.com/docs/plugins/pay)
- **[62]** [Pay.sh Docs：Use Pay with agents](https://pay.sh/docs/pay-for-apis/agents)
- **[63]** [Pay.sh Docs：Install](https://pay.sh/docs/get-started/install)
- **[64]** [GitHub：x402-foundation/x402 的 @x402/core 版本紀錄](https://github.com/x402-foundation/x402/blob/main/typescript/packages/core/CHANGELOG.md)
- **[65]** [Cloud Security Alliance：Research Note — x402 Agent Payment SDK Flaws（2026-10-25）](https://labs.cloudsecurityalliance.org/research/csa-research-note-x402-agent-payment-sdk-flaws-20261025-csa/)
- **[66]** [GitHub：coinbase/agentic-wallet-skills（已標示棄用）](https://github.com/coinbase/agentic-wallet-skills)
- **[67]** [x402 Docs：Offer & Receipt extension](https://docs.x402.org/extensions/offer-receipt)
- **[68]** [Ethereum Improvement Proposals：ERC-721 Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721)
- **[69]** [Ethereum Improvement Proposals：ERC-1155 Multi Token Standard](https://eips.ethereum.org/EIPS/eip-1155)
- **[70]** [Ethereum Improvement Proposals：ERC-5192 Minimal Soulbound NFTs](https://eips.ethereum.org/EIPS/eip-5192)
- **[71]** [Ethereum Improvement Proposals：ERC-4907 Rental NFT, an Extension of EIP-721](https://eips.ethereum.org/EIPS/eip-4907)
- **[72]** [x402 Docs：Sign-In-With-X extension](https://docs.x402.org/extensions/sign-in-with-x)
- **[73]** [x402 Docs：Client / Server（Timeouts and Safe Retries）](https://docs.x402.org/core-concepts/client-server)
- **[74]** [x402 Docs：Payment Identifier extension](https://docs.x402.org/extensions/payment-identifier)
- **[75]** [arXiv 2605.11781：Five Attacks on x402 Agentic Payment Protocol（預印本，2026-05）](https://arxiv.org/abs/2605.11781)
- **[76]** [x402 Docs：Bazaar（Discovery Layer）](https://docs.x402.org/extensions/bazaar)
