---
title: "按下暫停提領之後，錢還在走：銀行怎麼判斷一筆虛擬資產能不能放行？"
seo_title: "銀行虛擬資產風控實例：從入金確認、錢包簽署到事故對帳"
date: 2026-11-19
published: true
layout: article
categories: [technical]
tags: [虛擬資產, 區塊鏈, 資產保管, 金融資安, 銀行實務]
cover_image: /assets/img/linkedin/bank-crypto-release.jpg
cover_alt: "金庫彈珠台上，史旺姬壓下紅色停鈕，一枚金幣仍沿透明軌道向前滾，小機器人拿著網子追趕。"
hero_image: true
cta_context: web3
related_posts:
  - vasp-act-trust-war
  - tokenized-stocks-wall-street-clearing
  - etherfi-crypto-cashflow
description: "從幣安暫停提領後仍完成的轉帳談起，用真實收據與銀行、交易所案例，拆解入金確認、簽署權限、提幣告警與事故對帳。"
keywords: 銀行虛擬資產保管, 入金確認數, 提幣告警, 帳務核對, 幣安熱錢包, EIP-7702, Bybit, Bithumb, Ethereum Classic
---

2026 年 10 月 30 日，台灣時間早上 7 點 56 分，幣安一筆未經授權的轉帳在以太坊上完成。數量是 2,961.9 ETH。這時平台已經暫停提領。讀到這裡，我想知道的是：停機之後，誰又簽了一次？幣安的初步調查給了一個容易漏看的細節：這筆交易早已送出，一直在等鏈上確認。光看完成時間，無從推定當時有人重新簽署。[〔1〕](https://www.binance.com/en/blog/community/3229153443759566763)

十四分鐘後，應變團隊做了另一件事。他們讓同一個熱錢包在鏈上清除既有的程式委派。我把研究手記裡的兩筆交易查回公開區塊紀錄：建立委派的時間是凌晨 **04:20:59**，清除委派是 **08:10:35**，都換算成台灣時間。相隔的 3 小時 49 分 36 秒，是兩筆交易收錄的時間差。要算值班團隊花多久才發現、多久才採取行動，還需要內部告警和處置紀錄。[〔2〕](https://eth.blockscout.com/api/v2/transactions/0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b) [〔3〕](https://eth.blockscout.com/api/v2/transactions/0xafbf94c92a8d749988411669fa14d4f8866d9b4420b4ebd299f28e958dac7209)

<figure><picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/diagrams/bank-crypto-release-timeline-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/diagrams/bank-crypto-release-timeline.svg' | relative_url }}" alt="幣安暫停提領後，先前廣播的轉帳在 07:56 完成，08:10 清除委派。" style="width:100%;height:auto"></picture><figcaption>依幣安初報整理，時間為台灣時間。清除委派的收據可在鏈上核對。</figcaption></figure>

這就是銀行導入虛擬資產時，「處理資訊」跨進「處理金流」的那一步。螢幕可以立即告訴客戶「已停用」，但值班主管要回答的是，**還有哪些錢能動、誰還能動、我手上有什麼證據？**

<div class="article-tldr"><span class="article-tldr-label">30 秒結論</span><ul><li>收到一筆交易，先核對資產、收款地址與客戶歸屬，再決定何時開放使用。</li><li>批准提幣時，要有人能獨立核對這次簽署究竟會轉錢，還是會改變錢包權限。</li><li>事故後分別列出資金流向與客戶缺口。追到、凍結、返還和公司墊補，各有不同憑據。</li></ul></div>

## 一張寫著「0 ETH」的收據，怎麼會收到 1,000 USDC？

先看一筆誰都能查的普通轉帳。2025 年 11 月 9 日，Ethereum 主網第 23,761,457 個區塊裡，有一張狀態成功的收據。打開交易頁，原生幣金額寫著 **0 ETH**，互動對象是一個合約。單看這兩欄，很容易以為沒有錢進來。[〔4〕](https://etherscan.io/tx/0xd9638e6799d58646a3716261a456e0550e9ca637bf0e629b24284d005f279fba)

往下讀代幣移轉紀錄，答案就出現了。我核對了 Circle 公布的 USDC 合約地址，再讀取該筆收據的第 106 號事件（紀錄序號）。合約記下 1,000,000,000 個最小單位，按 USDC 的六位小數換算，是 **1,000 USDC**；收款地址末五碼為 `f9B01`。交易頁上的「0」說的是這筆交易附帶的 ETH，收款人收到的 USDC 要看另一欄。這幾項證據都能公開核對，至於地址屬於哪位客戶，得靠保管機構自己的紀錄。[〔5〕](https://developers.circle.com/stablecoins/usdc-contract-addresses) [〔6〕](https://eth.blockscout.com/api/v2/transactions/0xd9638e6799d58646a3716261a456e0550e9ca637bf0e629b24284d005f279fba/logs)

現在把這張真收據放進一個**假設的銀行作業情境**。銀行已核對這個地址分配給甲客戶。第一次收到通知時，系統記下該網路、交易編號與移轉事件序號；一分鐘後同一則通知重送。甲的帳上該有多少？仍是 1,000 USDC。第二次通知可以留下收件紀錄，卻沒有第二筆資產移轉可供入帳。若客戶歸屬不明，這 1,000 應先列待查，不能猜一位客戶入帳。

<figure><picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/diagrams/bank-crypto-release-deposit-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/diagrams/bank-crypto-release-deposit.svg' | relative_url }}" alt="同一筆 1,000 USDC 入金收到兩次通知，客戶只入帳一次。" style="width:100%;height:auto"></picture><figcaption>教學示例。兩次通知共用同一筆鏈上移轉，歸屬不明先列待查。</figcaption></figure>

韓國交易所 Bithumb 的事故讓這個小例子多了一層現實感。2026 年 2 月 6 日晚間，Bithumb 錯發比特幣。韓國金融委員會在 4 月公布檢查後的改善方案，包含每五分鐘比對帳本與錢包餘額、重大差異觸發自動停止，以及獎勵撥款時核對原定單位和數量。這裡有兩道不同的防線：逐筆核對能擋下重複記帳，總額核對能發現整本客戶帳承諾的資產已經對不上錢包。五分鐘是韓國該次方案的間隔，不能拿來當台灣銀行的通用標準。[〔7〕](https://www.fsc.go.kr/eng/pr010101/86230) [〔8〕](https://www.fsc.go.kr/eng/pr010101/86638)

## 那麼，入金到底要等幾個確認？

2019 年 1 月 5 日，Coinbase 的值班工程師收到警報。Ethereum Classic 的節點改採另一段區塊歷史，原先收錄的部分付款被替換，這叫「鏈重組」。到 1 月 7 日的更新，Coinbase 表示已觀察到 15 次重組，其中 12 次涉及同一筆資產重複支用，合計 219,500 ETC。這是它在網路上觀察到的金額；它同時寫明 Coinbase 客戶帳戶未受影響。它採取的處置是暫停該網路收付。[〔9〕](https://www.coinbase.com/en-ca/blog/deep-chain-reorganization-detected-on-ethereum-classic-etc)

如果那晚有客服問「客人再等十分鐘可以嗎」，光看手錶答不出來。第一個問題是**走哪條網路**。Bitcoin 開發者指南把至少六個確認列為高價值收款的參考，第一次是交易被收進區塊。Ethereum 主網採另一種機制，高額放行若要求最終確認，應看包含交易的區塊是否已達 `finalized`，也就是驗證者對相關檢查點已達成協議。前面出事的 Ethereum Classic 又是另一條鏈。[〔10〕](https://developer.bitcoin.org/devguide/payment_processing.html) [〔11〕](https://ethereum.org/developers/docs/consensus-mechanisms/pos/)

第二個問題是**確認之後允許客戶做什麼**。顯示「已偵測到入金」只承諾看見紀錄；開放交易後，客戶已能建立另一筆部位；允許提往外部錢包後，即使回頭沖銷客戶帳，資產也可能已離開。我的做法會是按「網路、資產、要開放的動作」分別寫放行條件。遇到重組或節點對同一筆交易意見不一，先暫停增加可用餘額，由作業人員調查。傳統金融也有扣帳、入帳與最終交割的差別，銀行原本就熟悉這道問題，只是現在多了一份要讀懂的鏈上憑據。[〔12〕](https://www.bis.org/publications/principles-financial-market-infrastructures)

## 三個人都簽了，誰看過那筆真正要送出的指示？

收錢時最怕把餘額記錯，付錢時更怕把另一件事當成提幣批准。2025 年 Bybit 冷錢包事件裡，依公司公布的鑑識更新，Safe 開發者的憑證遭入侵，簽署者被誤導，批准了惡意交易。對方只要能左右所有簽署人看到的內容，再增加一位盯著相同畫面的覆核人，仍可能得到相同答案。[〔13〕](https://www.bybit.com/en/press/post/bybit-confirms-security-integrity-amid-safe-wallet-incident-no-compromise-in-infrastructure-blt9986889e919da8d2)

我會拿兩份資料請保管端核對。第一份是原始提幣指示，寫著幣種、數量、網路與收款地址。第二份是由獨立工具讀取「實際要簽的資料」後，顯示簽署將產生什麼效果。若原單要求轉出 10 ETH，第二份卻顯示會改變錢包執行權限，即使畫面上的收款名稱很熟悉，也該停在簽署之前。這是本文的控制設計示例。

分工可以借鏡星展。星展公開說明，客戶數位資產由銀行用機構級冷錢包保管，與交易所 DDEx 分開。再往下一層，我會把系統設計成「下單人能提出要求、帳務端能保留餘額、保管端才有權簽署」，並請稽核追問誰能改白名單或更換簽署規則。前一句是星展揭露的組織分工，後面是我據此提出的銀行設計題。[〔14〕](https://www.dbs.com/newsroom/DBS_to_launch_crypto_options_trading_and_structured_notes_for_institutional_investors_and_wealth_clients)

簽署前還有人的判斷。2025 年 Coinbase 向美國證管會申報，有人付錢給客服人員取得客戶資料；這些人沒有直接動用客戶資金的權限。有了真實的帳戶細節，冒名者在電話裡會可信得多。FBI 另有公告記錄生成式 AI 模仿聲音與影像的詐騙。這兩份證據各自成立，沒有證據顯示這起 Coinbase 事件使用了 AI。對銀行而言，做法很具體：如果來電要求立刻變更收款地址，改用客戶事先留存的聯絡方式回撥。[〔15〕](https://www.sec.gov/Archives/edgar/data/1679788/000167978825000094/coin-20250514.htm) [〔16〕](https://www.ic3.gov/PSA/2024/PSA241203)

## 提幣告警該設多少？先決定響了以後誰能攔

2022 年 6 月，Ronin 跨鏈橋在一次內部與兩次外部稽核後重開。團隊公開了當時的分級規則：達 100 萬美元的提領要有九成驗證者簽署；達 1,000 萬美元，還要人工審查，並進入七天審查期。值得銀行參考的，是每一級都接著一個明確動作。這些金額屬於 Ronin 當時的橋，要訂本行的門檻得看自己的資金規模與值班能力。[〔17〕](https://blog.roninchain.com/p/the-ronin-bridge-is-open-)

放到銀行，我會用三筆演練來調參數：

- **一筆例行的大額調撥。** 資金從本行熱錢包回到已登錄的保管地址，有核准單，也在預定時段。拿它檢驗規則會不會把正常業務整天攔住。
- **一串各自不大的客戶提領。** 同一收款地址短時間收到多筆款，合計占錢包可用資產相當比例。用本行歷史資料回放，分別看單筆、短時間累計與當日累計。試算人員接到告警到按下暫停之前，還可能流出多少。
- **一筆找不到核准單的流出。** 不論金額，先暫停受影響錢包的新簽署，由保管與作業共同核對在途交易及既有授權。若涉及洗錢疑慮，另由法遵依客戶背景與交易型態判讀。客戶本人確認提領，只回答了授權這一題。[〔18〕](https://www.fatf-gafi.org/en/publications/methodsandtrends/documents/virtual-assets-red-flag-indicators.html)

我會為每條告警留三個數字：重播已知異常抓到幾次、正常營業一天要人工處理幾件、真正停下前最多還可能流出多少。這三個數字，足以讓風管與營運討論「門檻該往哪裡調」。

## 追錢有一本帳，恢復服務還要另一份證據

回到開頭。幣安初報記載自己的錢包使用多方共同簽署，清除委派需要另行協調簽署程序。Ethereum 的 EIP-7702 規格容許帳戶指定由另一段程式碼處理後續呼叫，授權生效後會保留，能做什麼取決於被指定的程式。復業前，除了查新系統能不能正常簽署，還得問舊地址有哪些權限仍然有效。若私鑰也已外洩，只清除一次委派，無法證明舊金鑰已可信。[〔1〕](https://www.binance.com/en/blog/community/3229153443759566763) [〔19〕](https://eips.ethereum.org/EIPS/eip-7702)

錢的部分，最容易被誤讀的是「追回」。11 月 12 日，美國司法部公告，公私部門合計凍結逾 27 億美元，**其中**逾 12 億美元已取得法院授權，可予扣押或限制處分。這個「其中」值十幾億美元：兩個數字若相加，部分資產就被算了兩次。公告也沒有把這兩筆金額列為已返還客戶。幣安另外承諾承擔損失，描述的是公司用自己的資源補足缺口。[〔20〕](https://www.justice.gov/opa/pr/justice-department-announces-actions-disrupt-north-koreas-massive-theft-cryptocurrency) [〔1〕](https://www.binance.com/en/blog/community/3229153443759566763)

<figure><picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/diagrams/bank-crypto-release-funds-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/diagrams/bank-crypto-release-funds.svg' | relative_url }}" alt="凍結逾 27 億美元的資產中，逾 12 億美元取得法院扣押或限制處分的授權。" style="width:100%;height:auto"></picture><figcaption>美國司法部 2026 年 11 月 12 日公告。框線表示包含關係，面積不代表金額。</figcaption></figure>

如果由我編這份每日通報，我會逐筆記下原幣數量、估值時間、目前由誰控制、有沒有返還憑據，再另列公司實際補了多少。復業走另一條線：先保全紀錄、停用受影響的簽署權限、核對在途款項與舊地址；再按網路和資產做小額驗收，從核准、簽署、鏈上完成一路走到客戶帳核對。**追查可以持續數月；今天能否恢復一種資產的提領，要看今天這條路是否驗得過。**

## 回到台灣，銀行可以承諾哪一段？

截至 2026 年 11 月 19 日，台灣《虛擬資產服務法》已公布，施行日期依法由行政院定之。金管會也有銀行虛擬資產保管的主題式試辦文件。規劃服務時，我會把保管、移轉、撮合買賣與涉及法幣的匯兌分列，逐項核對當時有效的規定、試辦核准內容及客戶契約。取得某項保管試辦核准，還不足以對客戶承諾其他三項服務。[〔21〕](https://law.fsc.gov.tw/LawContent.aspx?id=GL004301) [〔22〕](https://www.fsc.gov.tw/uploaddowndoc?file=20160223020901%2F202507211128401.pdf&filedisplay=uploaddowndoc+%282%29.pdf&flag=doc)

下次畫面亮起「交易成功」，我會請團隊把它念完整：哪一條網路上的哪一筆資產，到了誰控制的地址，記進哪個客戶的帳，現在客戶可以做什麼？客服、保管、帳務三邊能從各自的紀錄得到同一個答案，這筆錢才有放行的理由。

## 原始資料與查核方式

本文查核至 2026 年 11 月 19 日，事件當夜均採台灣時間。幣安的事件順序與金額依該公司初報，兩筆委派另查公開區塊時間。1,000 USDC 的轉帳來自公開收據，客戶分戶帳與重送通知是教學示例。各段可直接開啟對應原始資料。

1. [幣安 11 月 3 日初報](https://www.binance.com/en/blog/community/3229153443759566763)
2. [建立委派的區塊紀錄](https://eth.blockscout.com/api/v2/transactions/0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b)
3. [清除委派的區塊紀錄](https://eth.blockscout.com/api/v2/transactions/0xafbf94c92a8d749988411669fa14d4f8866d9b4420b4ebd299f28e958dac7209)
4. [Etherscan 公開交易紀錄](https://etherscan.io/tx/0xd9638e6799d58646a3716261a456e0550e9ca637bf0e629b24284d005f279fba)
5. [Circle 公布的 USDC 合約地址](https://developers.circle.com/stablecoins/usdc-contract-addresses)
6. [Blockscout 代幣移轉收據](https://eth.blockscout.com/api/v2/transactions/0xd9638e6799d58646a3716261a456e0550e9ca637bf0e629b24284d005f279fba/logs)
7. [韓國金融委員會 2 月公告](https://www.fsc.go.kr/eng/pr010101/86230)
8. [韓國金融委員會 4 月檢查結果](https://www.fsc.go.kr/eng/pr010101/86638)
9. [Coinbase 的 ETC 鏈重組紀錄](https://www.coinbase.com/en-ca/blog/deep-chain-reorganization-detected-on-ethereum-classic-etc)
10. [Bitcoin 開發者收款指南](https://developer.bitcoin.org/devguide/payment_processing.html)
11. [Ethereum 權益證明說明](https://ethereum.org/developers/docs/consensus-mechanisms/pos/)
12. [BIS 金融市場基礎設施準則](https://www.bis.org/publications/principles-financial-market-infrastructures)
13. [Bybit 的鑑識更新](https://www.bybit.com/en/press/post/bybit-confirms-security-integrity-amid-safe-wallet-incident-no-compromise-in-infrastructure-blt9986889e919da8d2)
14. [星展銀行的保管說明](https://www.dbs.com/newsroom/DBS_to_launch_crypto_options_trading_and_structured_notes_for_institutional_investors_and_wealth_clients)
15. [Coinbase 向美國 SEC 申報](https://www.sec.gov/Archives/edgar/data/1679788/000167978825000094/coin-20250514.htm)
16. [FBI 生成式 AI 金融詐騙公告](https://www.ic3.gov/PSA/2024/PSA241203)
17. [Ronin 跨鏈橋重新開放公告](https://blog.roninchain.com/p/the-ronin-bridge-is-open-)
18. [FATF 虛擬資產警示指標](https://www.fatf-gafi.org/en/publications/methodsandtrends/documents/virtual-assets-red-flag-indicators.html)
19. [Ethereum EIP-7702](https://eips.ethereum.org/EIPS/eip-7702)
20. [美國司法部 11 月 12 日公告](https://www.justice.gov/opa/pr/justice-department-announces-actions-disrupt-north-koreas-massive-theft-cryptocurrency)
21. [金管會《虛擬資產服務法》](https://law.fsc.gov.tw/LawContent.aspx?id=GL004301)
22. [金管會保管業務試辦說明](https://www.fsc.gov.tw/uploaddowndoc?file=20160223020901%2F202507211128401.pdf&filedisplay=uploaddowndoc+%282%29.pdf&flag=doc)
