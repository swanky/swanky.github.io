---
layout: article
title: "Poteto 的 2,500 條 PR，真正值得學的是什麼？從 pstack 到能被信任的軟體工廠"
seo_title: "Poteto × Matt Pocock 深度解讀：pstack、驗證技能、架構約束與 AI 軟體工廠"
date: 2026-10-07
published: true
categories: [technical]
tags: [ai-agent, agentic-engineering, pstack, software-engineering, verification, poteto]
description: "從 Lauren Tan 的演講與 Matt Pocock 訪談，拆解 pstack、信任階梯、Feature map、驗證 CLI、Dune 架構與雙迴圈：如何先建立可信環境，再擴大 agent 並行，並保留自動合併的風險邊界。"
keywords: "Poteto, Lauren Tan, Matt Pocock, pstack, verification skill, trust ladder, Grok Bot, software factory, AI 軟體工廠, Agentic Engineering"
cover_image: /assets/img/linkedin/poteto-pstack-trust-before-scale.jpg
cover_alt: "制服品牌主角與 Lauren Tan、Matt Pocock 在概念軟體工廠中檢查成果，周圍大量 Grok 機器人分工開發、驗證與攔截錯誤"
hero_image: true
use_glightbox: true
mid_cta: false
cta_context: agentic
extra_css: |
  @media (max-width: 767px) {
    .back-to-top.d-flex { display: none !important; }
    #header::after, #header.header-scrolled::after { background: #232020; }
  }
related_posts:
  - matt-pocock-skills-ai-coding-workflow
  - production-ai-agent-control-planes
  - ai-code-production-review-bottleneck
---

<p class="text-muted"><small>封面為人物與軟體工廠的概念情境示意，非訪談現場或實際工作場所。</small></p>

看到「一個月交付 2,500 條 PR」，我第一個想問的不是她開了多少個 agent，而是：這些變更，最後是誰敢讓它們進正式環境？

如果答案仍然是「有一個人，每條都打開來看、每個畫面都自己點、每次失敗都親自救」，那只是把程式碼的生產速度提高了。交付的瓶頸，還是那個人。

Lauren Tan，網路上多數人認識的名字是 Poteto，她這兩場分享真正有意思的地方，就在這裡。她不是先設計一間全自動軟體工廠，再想辦法替它找工作。她是先被重複的人工驗證卡住，才一步一步把自己的工具、判斷與教訓，變成 agent 可以使用的環境。[[1]](https://x.com/poteto/status/2102050467505430555) [[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=125s)

**我的判斷是：這不是「怎麼讓 AI 多寫一點」的教學，而是「怎麼讓工程判斷不必每次都由人重新做一次」的案例。**

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>信任先於並行</strong>：沒有可重現的驗證，更多 agent 只會送來更多需要你處理的例外。</li>
    <li><strong>第一個值得做的 skill，是讓 agent 能驗證自己的工作</strong>：產品地圖回答「驗什麼」，穩定工具回答「怎麼操作與取證」。</li>
    <li><strong>工程經驗不能只留在提示詞</strong>：能寫成型別、lint、程序邊界與持續整合規則的，就不要一直靠提醒。</li>
    <li><strong>自動合併不等於全面放行</strong>：抽樣能改善系統，卻不能替每一筆高風險變更提供安全保證。</li>
    <li><strong>2,500 條 PR 是她自述的交付規模，不是可直接套用的績效基準</strong>：真正要量的是合格交付的結果與代價。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part"><span class="article-toc-part-title">先看懂她解決了什麼</span><ol class="article-toc-items">
      <li><a href="#numbers">先把 2,500 這個數字放回原位</a></li>
      <li><a href="#background">她不是突然冒出來的 agent 講者</a></li>
      <li><a href="#meat-proxy">從工程師，變成工具之間的人肉轉接器</a></li>
      <li><a href="#trust">Trust ladder：信任的對象是什麼？</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">把判斷做成 agent 能使用的環境</span><ol class="article-toc-items">
      <li><a href="#verification">Verification skill：不是再加一句「記得測試」</a></li>
      <li><a href="#worked-example">拿一個模糊錯誤回報，走完整條驗證路徑</a></li>
      <li><a href="#pstack">pstack 把工程習慣變成可重複的工作方式</a></li>
      <li><a href="#verification-contract">直接讀 skill：驗證的交付契約長什麼樣？</a></li>
      <li><a href="#research-design">研究、規劃與原型：先讓問題變得可回答</a></li>
      <li><a href="#correction">五層修正：不要把所有教訓都塞進 skill</a></li>
      <li><a href="#dune">Dune：讓最省事的寫法，也是正確的寫法</a></li>
      <li><a href="#gardener">園丁、技術債，與「禁止註解」的爭議</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">從單次成功，走向可持續交付</span><ol class="article-toc-items">
      <li><a href="#loops">內外迴圈：先有會做事的 agent，再談自主運作</a></li>
      <li><a href="#merge">自動合併與抽樣審查，不能只抄結論</a></li>
      <li><a href="#formal">形式驗證能補哪一塊？</a></li>
      <li><a href="#economics">衡量產能，要把重工與風險算回來</a></li>
      <li><a href="#adoption">如果是我，會怎麼開始導入</a></li>
      <li><a href="#kitchen">最後留下的工作，是經營一間好廚房</a></li>
    </ol></li>
  </ol>
</nav>

## 先把 2,500 這個數字放回原位 {#numbers}

這篇的兩個主要來源，一個是 Lauren 發在 X 上的演講，另一個是 Matt Pocock 找她延伸追問的長訪談。前者把方法的骨架交代得很清楚，後者更適合追問：你真的敢不看每條 PR？你相信的是模型，還是驗證工具？工程師接下來把時間花在哪裡？[[1]](https://x.com/poteto/status/2102050467505430555) [[3]](https://www.youtube.com/watch?v=MN9dGgmLyso)

「2,500」是這次分享廣泛流傳的標題數字。**但 PR 數量、變更大小、交付價值與品質，是不同的東西。** 我們無法只靠公開演講，獨立核對內部儲存庫的拆分方式、回退情況、缺陷逃逸與使用者成果。她所說的品質維持，也不能自動升格成外部稽核過的結論。

同一個功能，可以放在一條大 PR，也可以拆成許多小 PR。後者可能更容易回退、測試、整合；也可能只是把計數器衝高。沒有工作範圍與品質的分母，數量本身不夠判斷。

她自己在演講裡也說，一開始並沒有設定每月要交付幾千條 PR。數量是持續投資工具、技能與程式庫之後出現的結果，不是起手式。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=254s)

訪談後半場還補了一個更重要的限定：**2,500 條 PR 不是 2,500 個新功能。** 她說其中大量工作是 gardening，也就是整理程式碼、修剪壞模式、改善其他工程師與 agent 接下來工作的環境。把這些全部換算成「一個人做出幾千個功能」，會把原話讀歪。[[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=2751s)

所以我會把這個數字當成一個值得研究的現象，而不是拿來要求其他工程師的 KPI。**拿別人長期整理過的廚房，去要求一個剛買瓦斯爐的人照同樣速度出餐，沒有什麼工程意義。**

## 她不是突然冒出來的 agent 講者 {#background}

如果只從這次 PR 數字認識 Lauren，很容易把她看成另一位剛出現的 AI 工作流講者。但她之前做的事，反而更能解釋為什麼這套方法長成現在這樣。

她的舊部落格保留了工程、溝通、領導與面試相關文章；她名下的 `hiring-without-whiteboards`，整理的是偏重實際問題與工作能力、而不是腦筋急轉彎式面試的公司和團隊。這份名單也特別說明：白板本身不是壞事，它反對的不是一件文具，而是失焦的評估方式。[[20]](https://no.lol) [[21]](https://raw.githubusercontent.com/poteto/hiring-without-whiteboards/master/README.md)

React 官方的 Compiler v1.0 文章則由她與 Joe Savona、Mofei Zhang 共同署名，歷史段落記錄了她參與編譯器重寫的工作。這支持的是「她參與過核心編譯器工程」，不是「她一個人造了 React Compiler」。[[19]](https://react.dev/blog/2025/10/07/react-compiler-1)

我會把這條線理解成：先把工程經驗公開寫清楚，再在工具裡處理規則與結構，最後把工作方式寫成 agent 能執行的流程。這是我的閱讀，不是替她編一條命中注定的職涯故事。

沿著她在 2026 年的文章往下看，主題也不是一直加碼 PR 數。〈Loops You Can Trust〉談先驗證、再處理環境隔離與並行；pstack 指南第一篇談 verification 與 feature map，第二篇才往研究、規劃、原型和架構走。這個順序，比技能清單有幾十項更值得記。[[18]](https://x.com/poteto/status/2069824386283319343) [[23]](https://x.com/poteto/status/2094457600259842065) [[17]](https://x.com/poteto/status/2097732320606507506)

## 從工程師，變成工具之間的人肉轉接器 {#meat-proxy}

她分享的起點其實很具體：加入 Cursor 後，處理 agent window 的效能問題。Agent 可以提出修改，但不會自己完成她那套觀察與診斷流程。於是人得去操作應用程式、開 DevTools、抓效能資料，再把結果搬回對話。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=125s)

這就是 meat proxy 這個形容讓人有感的地方。你看起來在使用很聰明的工具，實際上卻像兩套系統之間沒有寫好的 API：複製、貼上、截圖、解釋、再重來一次。

問題不只在於浪費時間。只要驗證的每一步都藏在人腦裡，agent 就無法完整重播。不同的人，可能走不同操作路徑；同一個人，下次也可能忘了某個前置條件。

她做的轉換，是把「請你告訴我哪裡慢」變成「你有工具可以啟動應用、操作畫面、收集 trace，再根據證據修正」。這不是替 agent 加一個更漂亮的回答格式，而是把它能碰到的世界擴大。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=411s)

對我來說，這裡有一個很實用的判斷方式：**你反覆替 agent 做的那件事，究竟需要人的判斷，還是只是因為工具還沒接好？**

前者應該留下來。後者值得工程化。但工具接通不等於權限全部開放；可以讓它在隔離環境點按測試，不代表應該讓它拿正式帳號任意操作。

## Trust ladder：信任的對象是什麼？ {#trust}

Lauren 在簡報裡畫了一條信任曲線。橫軸是從少量 agent 走向更大的委派規模，縱軸是信任。最前面那段很辛苦，因為每個對話都得看、每個錯誤都要修，人不在就停住。她的提醒是：如果還沒走出這一段，先開很多 agent，只會得到大量品質不穩的 PR 與回歸問題。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=311s)

<figure>
  <a href="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/trust-curve.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="poteto-diagrams" data-type="image"><img src="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/trust-curve.svg' | relative_url }}" alt="信任與可委派 agent 規模的概念曲線；先建立驗證與約束，再擴大並行，圖中分區不是實測產能" loading="lazy" width="1200" height="760"></a>
  <figcaption>依演講的 trust 投影片重繪。這是觀念圖，不是實測曲線，也不是她同時運行數千 agent 的證據。點圖可放大。<a href="https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=311s">[2]</a></figcaption>
</figure>

「信任」這個詞很容易被講成心態問題：你要更勇敢、更願意放手。我的理解剛好相反。這裡需要的，是更具體的懷疑。

你得能回答：

- 我怎麼知道它真的跑過修改後的程式，而不是引用上一次的成功？
- 我怎麼知道它測的是使用者回報的流程，而不是隨便一條會通的路？
- 它遇到例外，會停下來求助，還是把驗證條件改鬆？
- 它能不能為了完成任務，順手改掉保護自己的規則？
- 即使這次修對了，下一次是否仍然能重現同一套檢查？

如果這些答案都只能靠「模型應該知道」，並行數就不該太高。

**信任不是覺得 agent 不會犯錯，而是知道某些錯誤會被什麼機制攔住；攔不住的部分，又由誰承擔。** 這是我從她的方法往導入實務延伸出的判準，不是一張可以通用到所有團隊的認證表。

## Verification skill：不是再加一句「記得測試」 {#verification}

她最值得先學的工具，是 verification skill：把應用程式的操作與驗證方法，整理成 agent 能重複使用的技能。簡報把它拆成兩個部分：Feature map，以及 CLI。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=518s)

<figure>
  <a href="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/verification-map-cli.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="poteto-diagrams" data-type="image"><img src="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/verification-map-cli.svg' | relative_url }}" alt="驗證技能由產品功能地圖與可重現 CLI 組成：前者提供脈絡，後者啟動真實應用、操作並收集證據" loading="lazy" width="1200" height="760"></a>
  <figcaption>依「High-quality verification」投影片重繪；中文內容依演講整理。Feature map gives context. A CLI gives control. 點圖可放大。<a href="https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=541s">[2]</a></figcaption>
</figure>

### Feature map：不只知道程式在哪裡，還要知道產品怎麼用

她舉的場景是：使用者在 Slack 丟一張只截到局部畫面的圖片，再加幾個問號。Agent 即使能啟動產品，也不一定知道那是什麼功能、怎麼走到那個狀態。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=615s)

程式碼搜尋可以回答「這個元件在哪個檔案」，但那不是同一道問題。

Feature map 應該包含產品行為的脈絡：有哪些功能、從哪個入口進去、需要什麼資料或狀態、使用者會按哪個按鈕或快捷鍵，以及操作後應該看到什麼。它比較像把一位熟悉產品的同事平常口頭解釋的東西，變成可以維護的地圖。

而且，這張地圖不是寫完就永久正確。畫面路徑、權限條件、功能旗標與選取器都會變。**地圖如果過期，agent 可能很熟練地走到錯的地方，然後交出一份看起來完整的證據。**

### CLI：讓操作方法穩定，不必每次即興發明

另一半是可重複的工具。她不希望 agent 每次都現寫一支略有不同的腳本，而是提供固定 CLI，負責啟動應用、操作、收集 trace 與其他診斷資料。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=551s)

這個差別很重要。Prompt 可以要求「證明效能改善」，但沒有可靠工具，agent 可能只做靜態推理，或跑一個與實際瓶頸無關的測試。

反過來說，工具不必一步到位。先支援一條有價值、可重現的流程，比替所有畫面都設計一個還沒驗證過的介面更實際。

### 證據必須能回答一個問題

我會把驗證證據分成幾種，不混著用：

- **型別與靜態檢查**：這些已形式化的結構規則有沒有被違反？
- **單元與整合測試**：在既定輸入與假設下，行為是否符合規格？
- **實際操作、畫面與執行紀錄**：使用者那條路徑是否真的走得通？
- **效能 trace 與資源觀察**：慢在哪裡，修改後是不是同一個瓶頸改善？
- **架構與安全檢查**：這個改動有沒有走錯層、擴大權限，或留下難以維護的捷徑？

它們互相補充，不能彼此冒充。截圖漂亮，不表示資料存對；測試全綠，也不表示測到了真正的問題。

## 拿一個模糊錯誤回報，走完整條驗證路徑 {#worked-example}

下面用一個假設案例，把方法落到可以操作的程度。這不是 Lauren 團隊的實際事故，也不是 pstack 內建的命令清單。

假設回報只有一句：「切到歷史紀錄時整個畫面卡住。」

**第一步，先把「卡住」變成可重現的條件。** Feature map 告訴 agent，歷史紀錄在哪個入口、需要先建立哪些資料、哪些功能旗標會影響畫面。驗證工具使用固定的測試資料，而不是每次臨時造一份不同大小的資料。

**第二步，先留下修改前的證據。** 記錄版本、操作序列、資料條件、環境，以及一次真實操作的 trace。若根本無法重現，工作應停在「尚未重現」，而不是先改一段看起來可疑的程式，再宣稱修好了。

**第三步，找出可反駁的假設。** 例如「資料轉換在 renderer 同步執行，阻塞了互動」。這個假設應該能從呼叫路徑與 trace 找到對應，而不是看到畫面卡就一律加快取。

**第四步，改動後重播相同情境。** 同一組資料、同一個入口、相同操作條件。效能本來就可能有雜訊，因此應有重複觀察與事先約定的判準，不能只挑最好看的那次數字。

**第五步，確認沒有把問題搬家。** UI 變順，可能是把工作移到背景；但若資料錯誤、記憶體持續增長，或其他畫面因此退化，仍然不算完成。

**第六步，交付可查驗的證據包。** 我會至少要求：修改版本、重現步驟、失敗與成功的對照、實際執行的檢查、證據位置、尚未涵蓋的範圍。PR 後來若又被修改，舊證據不能自動替新版本背書。

這整條路徑裡，agent 都可以參與。真正不能省掉的，是「什麼才叫完成」的定義。

驗證 skill 的價值也不只是這一次修得比較快。當你把同一個問題交給另一個 agent，它仍能按照相同方法操作、產出可比較的證據，這份投資才開始複利。

## pstack 把工程習慣變成可重複的工作方式 {#pstack}

先把工具本身說清楚。pstack 是 Lauren 公開的 agent 工作流程與技能集合。README 的主張很直接：**if you want to go fast, go deep first.** 重點是少寫、寫對，再談有信心地並行，不是先堆 agent 數量。[[4]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/README.md)

以下操作與行為以 `0.15.15`、儲存庫版本 `9f451cf…` 為準。技能會持續變動，影片中的個人工作習慣，也不一定等於新版工具的預設行為。[[5]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/.cursor-plugin/plugin.json)

在 Cursor 的聊天介面，官方入口是：[[4]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/README.md)

```text
/add-plugin pstack
/setup-pstack
/poteto-mode <你要完成的任務>
```

這是聊天指令，不是終端機指令。`/setup-pstack` 主要設定不同角色使用的模型，會寫入使用者層的 `~/.cursor/rules/pstack-models.mdc`；它不是按下去就自動建好你的產品驗證環境。模型應以帳號實際可用的選項為準，也不要把設定裡的 budget 檔位誤認成帳單金額上限。[[6]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/setup-pstack/SKILL.md)

`/poteto-mode` 則是工作流程入口。它辨識任務類型、選對應的 playbook，把步驟展開為待辦，再呼叫需要的技能。研究、設計、修 bug、原型，各有不同流程；不是所有工作都固定叫十個 agent，也不是每次都把整套流程跑一遍。[[7]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/SKILL.md)

在演講中，Lauren 把 pstack 介紹成她整理的工程技能與工作方法集合，涵蓋除錯、功能開發、原型等活動。重點不只是讓 agent 檢查功能能不能動，也要讓它學會比較像工程師的做事方式。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=798s)

這解釋了為什麼「先做驗證」不等於「只要做測試」。一個功能可以符合眼前的驗收條件，卻用很差的方式放進程式庫。它可能破壞原有抽象、複製第三份相似邏輯，或讓未來每次修改都得跨越很多不必要的依賴。

對我來說，skill 最適合保存的是有脈絡的工程程序：先查什麼、怎麼區分假設與證據、何時需要原型、什麼情況該停止、失敗後應該修哪個層次。

反而不適合把它當成無限增長的提醒清單。當一個規則已經被違反很多次，繼續在 skill 裡用更重的語氣寫一次，未必是最有效的修法。

**pstack 可以幫你整理做事的程序，但它不能替你的產品憑空產生驗收標準，也不能替一個沒有保護的環境補上安全邊界。**

## 直接讀 skill：驗證的交付契約長什麼樣？ {#verification-contract}

我覺得讀 pstack 最有收穫的方式，是不要只看技能名稱。直接打開它的要求，看看它如何定義「做完」。

### 建立驗證技能：不是生出 Markdown 就交差

`/create-verification-skill` 先從儲存庫找答案：使用者操作哪個表面、如何啟動、現有哪種自動化工具、能取得什麼證據，以及多個實例能不能隔離。原本就有的 Playwright、Cypress、HTTP 或 CLI 工具應先被利用，不是每次重新發明。[[8]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/create-verification-skill/SKILL.md)

生成的 `.cursor/skills/verify-<app>/SKILL.md`，必須把以下環節寫成具體可操作的內容：

- **Launch**：啟動命令、如何知道已就緒，以及如何停止。
- **Doctor**：唯讀檢查目前是不是正確版本、正確實例，是否真的適合開始操作。
- **Drive**：使用真實 selector、命令與路徑，操作實際應用。
- **Evidence**：保存動作及其結果；有檔案、資料庫或訊息副作用，也要一起查驗。
- **Cleanup**：清理自己建立的實例與暫存狀態，但不能順手刪掉證據。
- **Helpers**：附的工具必須能執行，並清楚寫出呼叫方式。[[8]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/create-verification-skill/SKILL.md)

<figure>
  <a href="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/verification-contract.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="poteto-diagrams" data-type="image"><img src="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/verification-contract.svg' | relative_url }}" alt="驗證技能的交付流程：啟動、檢查實例、操作功能、保存證據、清理，最後確認證據仍可查閱；工具與產品路徑是底座" loading="lazy" width="1200" height="760"></a>
  <figcaption>依 pstack 0.15.15 的 create-verification-skill 規格整理，並非原演講投影片。文件、工具與實際操作要一起交付。<a href="https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/create-verification-skill/SKILL.md">[8]</a> 點圖可放大。</figcaption>
</figure>

交付前，它還要求 agent 照著自己寫的指示，真的完成一次啟動、檢查、操作一個已列入地圖的功能、取證、清理。清完後，證據仍必須留在指定位置。**沒有實際執行過的技能，只能算草稿。**[[8]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/create-verification-skill/SKILL.md)

注意這裡的範圍：第一次以一個功能證明整條工具路徑跑得通，不等於產品所有功能已驗證。Feature map 才是後續展開覆蓋的依據。

### 維護驗證技能：不能靠改文件掩蓋產品壞掉

`/maintain-verification-skill` 的界線更有意思。它只能修改驗證技能自己的文件、feature map 與所屬工具，不能順便修改產品程式碼。若產品真的壞了，應回報產品缺口，而不是把預期行為改成目前壞掉的樣子。[[9]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/maintain-verification-skill/SKILL.md)

它把看原始碼和實際操作分開：不同讀取者可以並行研究各功能，真正操作共用應用實例時則要協調，不能多個 agent 同時亂點。即使程式碼看起來沒變，也要做 live pass；無法抵達的路徑要寫出缺少的前提與嘗試紀錄，不能算通過。

最後有三種結果：`clean`，完整檢查後不需要改動；`changed`，提出已證明的文件或工具修正；`blocked`，覆蓋或安全交付做不到。不是每次執行都得產生一條 PR。[[9]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/maintain-verification-skill/SKILL.md)

這個細節剛好呼應前面的數字問題：好的維護工具，也應該允許「檢查後不改任何東西」是正確成果。

### 公開範例可以學結構，不能當成現成 driver

Lauren 的 `verification-skill-example` 用 Atlas 示範文件與產品地圖的樣子，但 README 明說它是虛構產品，操作 driver 並未附上。它是一份可學習的參考，不是 Cursor 內部工具的完整開源版本，更不是照抄命令就能在自己的產品跑通。[[10]](https://raw.githubusercontent.com/poteto/verification-skill-example/d5abe70d0d8c671672b6cef4069363f26c488feb/README.md)

同樣地，建立和維護技能也不等於自動取得雲端代理權限、建立排程或開放合併權限。這些是另外要設定、另外要核准的能力。

## 研究、規劃與原型：先讓問題變得可回答 {#research-design}

驗證解決的是「你做出來的東西，有沒有照預期工作」。但如果一開始就理解錯問題，驗證也可能只是在認真確認一個錯誤答案。

Lauren 在指南第二篇，先處理兩種常見失敗：agent 沒理解人的意圖，或缺少正確工作的上下文。她常要求 agent 先用自己的話重述回報，再開始行動。這不只是禮貌性複誦，而是讓誤解在還便宜的時候浮出來。[[17]](https://x.com/poteto/status/2097732320606507506)

### `/how` 與 `/why`，問的是不同問題

`/how` 要追實際機制：入口在哪、資料怎麼流、哪些模組負責哪件事。`/why` 則研究動機與限制；程式碼能告訴你現在做什麼，卻未必能告訴你當初為什麼這樣做。[[11]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/how/SKILL.md) [[12]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/why/references/epistemics.md)

這個差別很實用。例如看到一個重試機制，agent 可以追出它何時觸發、最多重試幾次。但「當初是為了供應商服務不穩定才加的」，不能只因為聽起來合理，就當成歷史事實。要找得到事故紀錄、討論或提交理由；找不到，就保留未知。

`/why` 的證據規範刻意區分直接證據、支持性證據、推論、猜測與未知。對我來說，這比讓 agent 回答得更有自信重要。**工程解釋不是替既有程式編一個漂亮的身世。**[[12]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/why/references/epistemics.md)

### 不確定性如果能實驗，就不要只開更多計畫會議

她主張從使用方式往回推設計：先寫呼叫端怎麼用、教學怎麼帶，再決定型別、介面與內部結構。原型則用來回答經驗性問題，例如互動是否順、某種設計是否真的能降低延遲，而不是只讓不同模型對抽象計畫互相挑毛病。[[17]](https://x.com/poteto/status/2097732320606507506)

這不是「不用規劃」。比較接近：**把可以透過程式回答的問題，從文件裡搬到一個小實驗。** 原型是研究工具，並不因此取得直接進正式環境的資格。

<figure>
  <a href="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/research-to-design.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="poteto-diagrams" data-type="image"><img src="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/research-to-design.svg' | relative_url }}" alt="先重述問題，分別查運作機制與歷史理由，再用競爭設計和小原型驗證不確定性，最後形成可驗證的執行計畫；研究未知不冒充事實" loading="lazy" width="1200" height="760"></a>
  <figcaption>依 pstack 指南第二篇與 architect 規格整理的工作關係，並非每次任務都固定要走完的單一路線。<a href="https://x.com/poteto/status/2097732320606507506">[17]</a> <a href="https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/architect/SKILL.md">[13]</a> 點圖可放大。</figcaption>
</figure>

### `/architect` 的人工關卡，必須明講

現行 `/architect` 要先理解系統，再做至少兩個結構不同的設計候選，綜合後實作；如果實作反覆撞到架構本身的問題，就回頭重設，而不是一直補特殊分支。[[13]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/architect/SKILL.md)

但這裡有一個使用者很容易忽略的預設：**此版本不會自動停下來等人看設計。** 想保留這道關卡，要明確要求 `/architect with checkpoint`，或直接說「實作前停下來，先讓我看設計」。不能因為流程裡有一個 Agree 階段，就以為一定有人類批准。[[13]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/architect/SKILL.md)

多階段規劃則是 `/poteto-mode` 裡的 playbook，不要另發明一支不存在的通用 `/plan`。它把依賴、要修改的範圍、建置、單元與實際操作驗證、效能判準、審查和合併條件寫進可接手的計畫。[[14]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/playbooks/multi-phase-plan.md)

這條流程與 `/architect` 的預設不同：**計畫本身就是交付物，交回後要停止，收到操作者明確同意才執行。** 此版還規定，改變互動行為的 PR，合併前要讓操作者看截圖與影片；不能把「自主實作」誤解成所有流程都免除人工審查。[[14]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/playbooks/multi-phase-plan.md)

它也有 `check-plan.mjs` 檢查格式。不過讀過腳本就會發現，這是檢查章節、欄位與清單形狀，不會替你啟動產品、看截圖或量測效能。**計畫通過格式檢查，不等於計畫裡的功能已經驗證。**[[15]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/scripts/check-plan.mjs)

## 五層修正：不要把所有教訓都塞進 skill {#correction}

整場演講裡，我最想留下來的一張圖，是她問「每次你糾正 agent，應該把這個修正放在哪裡」的那張。

她列出的順序是：Codebase、Static analysis、Rules／Bugbot、Skills、Style guide。她的判斷是，能改變程式庫與資料結構、讓一類錯誤難以發生，通常比期待 agent 每次記得讀一條提醒更可靠。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=935s)

<figure>
  <a href="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/correction-layers.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="poteto-diagrams" data-type="image"><img src="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/correction-layers.svg' | relative_url }}" alt="糾正 agent 的五層：程式庫與架構、靜態檢查、規則與審查、技能、人工風格指南；能強制的不要只靠提醒" loading="lazy" width="1200" height="760"></a>
  <figcaption>保留原投影片的五層順序，中文說明為本文整理。這不是五種工具的成功率排名，而是從結構約束到人為約定的差異。點圖可放大。<a href="https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=935s">[2]</a></figcaption>
</figure>

### 第一層：程式庫與資料結構

假設一個狀態物件用了很多布林值，於是「已付款、已取消、正在退款」可以同時出現。一直提醒 agent「不要組合錯」，不是很理想。

更好的方向可能是重新設計狀態模型，讓一部分不合法組合根本沒有正常的表示方式。這仍需檢查資料進出邊界；型別不會自動替外部輸入背書。但至少不必每個使用處都重新記住那套規則。

這是作者的延伸例子，對應她所說的：把一類問題從架構與資料結構處理掉，而不只修眼前那一行。

### 第二層：靜態分析與 CI

有些規則很適合被機器穩定判斷。例如特定目錄不能匯入另一層、不能使用某個已淘汰 API，或新增程式不能繼續擴大已知的反模式。

把這些規則放進 lint、編譯診斷與 CI，可以把「Reviewer 記得才會指出」變成「送進來就檢查」。但前提是檢查會執行、失敗真的會阻擋，而且執行者不能自行繞過。

### 第三層：規則與審查工具

不是所有判斷都能寫成確定性規則。需求理解、抽象是否恰當、局部修補有沒有掩蓋根因，仍可能需要上下文與審查。

這一層有價值，但「通常會提醒」不等於「必然阻擋」。她也明確區分這類 guidance 與前面較硬的約束。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=1009s)

### 第四層：Skills

Skill 保存方法與經驗，讓 agent 不必每次從零組織工作。它可以教 agent 如何調查、何時驗證、怎麼交付證據。

但如果使用者跳過它、它沒有被載入，或內容已經失效，效果就會打折。因此 skill 很適合教「怎麼做」，不適合獨自承擔「絕對不能做什麼」。

### 第五層：人工風格指南

風格指南不是沒有用。它往往是工程判斷最早被說清楚的地方。

問題是，當所有規範都只靠人在 code review 記住，PR 量增加時，人就會成為最慢、也最不穩定的執行器。她的建議不是把人拿掉，而是把反覆出現的教訓往更能執行的層次搬。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=1063s)

**同一個提醒講第三次之前，我會先問：這到底還應該是一句提醒嗎？**

後來的 `/correct` 把這件事做得更明確：從提交、回退、review 與既有指示找反覆出現的錯誤類別，優先用架構消除，再用型別、lint、CI、行為測試，最後才是文件與規則。它要求新檢查拿真實過去的錯誤來證明「真的會擋」，不是多加一個永遠綠燈的檢查。這是現行技能的順序，與上面演講的五層圖應分開看。[[16]](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/correct/SKILL.md)

Lauren 介紹這支技能時，用盆景比喻不斷長進儲存庫的提交：需要修正的是塑造行為的環境，而不是永遠站在旁邊盯每個 agent。這不是把程式庫整理漂亮而已，是在決定接下來什麼樣的程式會比較容易長出來。[[22]](https://x.com/poteto/status/2106542593656111276)

## Dune：讓最省事的寫法，也是正確的寫法 {#dune}

Lauren 把團隊針對 Grok Bot 設計的 agent-friendly framework 稱為 Dune。她用它說明一件事：既然 agent 常找捷徑，能不能讓最容易走的路，剛好就是團隊希望它走的路？[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=1137s)

這裡談的是她公開展示的架構觀念，不是要讀者取得或照抄內部框架。真正可借用的是設計原則。

簡報把產品分成 feature UI、navigation、client、host extensions、Electron main 等角色，並把程序邊界反映在目錄、匯入與型別介面。她舉的例子是：不該在 renderer 執行的工作，不要因為一次方便的 import 就混進去，最後阻塞使用者操作。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=1610s)

<figure>
  <a href="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/dune-process-boundaries.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="poteto-diagrams" data-type="image"><img src="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/dune-process-boundaries.svg' | relative_url }}" alt="依公開 Dune 簡報整理的程序分工：renderer 的功能 UI、導覽與 client，透過型別邊界連接 host extensions 與 Electron main" loading="lazy" width="1200" height="760"></a>
  <figcaption>依公開投影片「Process boundaries are visible in the tree」簡化重繪。連線表示邊界關係，不定義完整呼叫協定；並非內部原始碼還原。點圖可放大。<a href="https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=1665s">[2]</a></figcaption>
</figure>

我會把這套思路翻成三件比較通用的事：

1. **讓位置表達責任。** 看檔案位置，就能初步知道這段程式可以做什麼、不該碰什麼。
2. **讓邊界有執行機制。** 不只在架構圖畫分層，也檢查實際的依賴與匯入方向。
3. **讓常見需求有一條維護良好的正路。** 不要讓 agent 為了做一個普通功能，就得先猜十種抽象哪種才是正統。

這不是說把所有彈性封死就會得到好架構。設計錯的限制，也可能逼出更多繞路。我的判準會是：限制是否對準反覆出現的真實失敗？遵守規則的路是否真的可用？例外能否被看見、被審查，而不是偷偷藏進去？

還有一個邊界要講清楚：**型別邊界與目錄分層，不等於安全隔離。** 如果同一個高權限 agent 能修改 lint 設定、讀取正式秘密或解除保護，圖畫得再乾淨，也不能當成完整的權限模型。

## 園丁、技術債，與「禁止註解」的爭議 {#gardener}

她把程式庫比喻成花園。Agent 會模仿已經看見的寫法，因此一個看似無害的 workaround，可能快速變成到處出現的標準模式。程式庫既是產物，也是下一輪工作的範本。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=1318s)

這讓技術債多了一個擴散途徑。以前可能是新同事複製舊範例；現在是許多 agent 同時把那個範例當成「這個專案就是這樣寫」。

她提出 gardener 的角色，不是在每條 PR 後面追著修剪，而是持續觀察：哪些模式開始擴散、哪些應該消失、哪一類錯誤需要新的檢查。先阻止新債繼續長，再逐步清理既有問題。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=1468s)

最有爭議的例子，是她說 Dune 選擇禁止註解。原因不是「註解一律沒有價值」，而是她觀察到 agent 會用註解替暫時補丁辯護，讓根因一直留著；其他 agent 又繼續複製這個模式。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=1376s)

**我不會把「全面禁註解」照單全收。** 有些註解記錄的是協定限制、相容性原因、安全假設、外部行為或無法從程式碼直接看懂的決策。刪掉它們，反而可能讓下一個修改者更容易犯錯。

我會借用她辨認問題的方法，而不是直接照抄她的禁令：

- 註解是在保存不可替代的理由，還是在替明知不好的設計找藉口？
- 這個 workaround 有沒有對應的失敗案例與可檢查條件？
- 能否用明確型別、測試、模組邊界，取代只有文字才說得清楚的隱含約定？
- 如果真的需要例外，有沒有責任人與重新檢視的機制？

園丁的工作不是追求程式碼看起來沒有雜草，而是讓下一輪成長不會沿著錯的方向放大。

## 內外迴圈：先有會做事的 agent，再談自主運作 {#loops}

在訪談裡，Lauren 用 inner loop 指 agent 依某個意圖快照完成工程工作；outer loop 則持續帶入新的回報、限制與情境。她也先說明這是自己當場使用的分法，不必把它當成全產業唯一的標準定義。[[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=2132s)

到了這裡，才適合談 software factory。

在演講裡，她把 Grok Bot 連接訊息、監控、錯誤回報等來源的工作，稱為 outer loop。外面有事件進來，agent 判斷脈絡，再觸發 cloud agents 或其他自動化去做事。她提到 Slack、Sentry 等服務，是為了說明訊號從哪裡來，不是說工具一接好，系統就自然會做對決策。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=1954s)

我會把它整理成兩個層次：

- **內迴圈**：處理一件具體工作。重現、調查、規劃、修改、驗證、交付證據。
- **外迴圈**：決定工作從哪裡來、優先做什麼、交給誰，以及結果如何回饋到後續工作。

<figure>
  <a href="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/inner-outer-loops.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="poteto-diagrams" data-type="image"><img src="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/inner-outer-loops.svg' | relative_url }}" alt="內外迴圈工程示意：外部事件經判斷派工，內迴圈完成修改與驗證，通過整合關卡後觀察真實結果，所有階段受權限與停止條件限制" loading="lazy" width="1200" height="760"></a>
  <figcaption>依演講觀念延伸的作者示意圖。風險關卡、版本綁定與部署控制為本文導入建議，不是 Grok Bot 官方架構。點圖可放大。<a href="https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=1954s">[2]</a></figcaption>
</figure>

這裡的先後順序不能顛倒。內迴圈如果連一個問題都無法可靠完成，外迴圈只是在替不可靠的流程持續補充工作。

她描述的規模化，也不是手動打開幾千個聊天室。外部連接工具把上下文送入專案，由 coordinator 維持任務關聯、分派與進度，再交給子代理處理。這裡真正重要的是：多份看似不同的效能回報，可能指向同一個上游原因；一個回報開一個 agent，反而可能重複修同一件事。[[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=2449s)

另一個反直覺的細節是，她有 agent 持續找 React 的不良模式，卻不要求它立刻修。先追加到文件，每隔幾天看一次，找出共同模式。這個 buffer 不是系統不夠自動，而是在避免每次局部訊號都立刻變成一次局部改動。[[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=2836s)

我會把這件事當成多 agent 設計的提醒：有時候提升品質的方法，不是把事件到修改的延遲壓到最短，而是留下足夠的空間，辨認這些事件其實是不是同一個問題。

而且，事件接入本身就是新的風險面。錯誤紀錄、使用者訊息、Issue 內容，是需要被解讀的資料，不應直接變成高權限指令。能讀取一個回報，不代表可以照回報裡的文字下載執行檔、改權限或送出資料。

下面這些是我會額外要求的營運條件：

- 同一事件有去重機制，失敗重試不會不斷產生相同 PR。
- 同一資源的修改有協調方式，不讓多個 agent 各自修好、合起來卻衝突。
- 有並行上限、成本上限與佇列容量，外部回報暴增時能降速。
- 危險訊號會中止自動流程，而不是無限重試到某次綠燈。
- 能區分「PR 已建立」「變更已合併」「正式環境已部署」「使用者問題已解決」。

最後一點很容易被略過。工廠如果只量離開產線的箱子數，卻不看裡面是不是客戶要的東西，報表可以很好看，事情不一定有做好。

## 自動合併與抽樣審查，不能只抄結論 {#merge}

Matt 在訪談裡直接追問，這到底算不算 dark factory。Lauren 回答，某種意義上算：她有工作流程會在睡覺時持續運作，agent 可以自行合併，她隔天再看已落地的變更。Matt 所反對的則是另一種「幾乎忘記程式碼存在」的理解；兩人其實在用不同的定義。[[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=3107s)

她描述的驗證鏈，會讓其他 verifier agents 啟動應用、點擊、找回歸與實作問題，修完再驗；她把這種互動探索稱為 fuzzing。不過它不能直接等同特定 fuzz-testing 工具的覆蓋保證。她也明講這很吃 token，可以調整驗證者數量，必要時降低配置。**更多驗證者，是有成本的設計選擇，不是一個免費的品質乘數。**[[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=3170s) [[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=3206s)

她並沒有停止看程式。她說自己持續抽查 PR 與品質，發現共同問題就改技能、lint、型別或環境；需要時也會回退或修正已經合併的內容。這是人工介入位置的改變，不是人類問責的消失。[[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=2955s) [[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=3228s)

「讓 agent 自己驗證，甚至自己合併」是最吸引人的部分，也最容易被錯用。

我會先分清兩件事：**審查某一筆變更能不能進去**，以及**觀察整套系統最近做得好不好**。抽樣很適合後者；前者是否能改成自動決策，仍要看風險、可回退性與證據強度。

訪談最不能漏掉的，是 Matt 隨後提出的單向門問題：有些變更能回退，有些會造成資料損失，或留下外部不可逆後果。Lauren 回到可驗證性的限制，也承認自己沒有完整答案。這不是一套已經解決醫療、法律、金融所有風險的通用方案。[[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=3344s) [[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=3455s)

**可驗證與可恢復，是兩個獨立問題。** 更好的驗證可以降低失敗機率，但不會自動還原已刪掉的資料，也不會撤回已經送出的外部操作。這是我不會直接照搬合併權限的理由。

<figure>
  <a href="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/risk-based-merge.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="poteto-diagrams" data-type="image"><img src="{{ '/assets/img/technical/poteto-pstack-trust-before-scale/risk-based-merge.svg' | relative_url }}" alt="風險式合併建議：由受保護的外部規則判斷同版本證據，失敗或缺證據就停止，高風險交人工核准，低風險且符合條件才限定自動合併" loading="lazy" width="1200" height="760"></a>
  <figcaption>作者設計的導入建議，不是 Lauren 團隊已公開實作的完整政策。抽樣用來改善系統，不應取代高風險變更的逐件判斷。點圖可放大。</figcaption>
</figure>

### 不要讓被檢查者同時改寫及格標準

如果 agent 可以修改測試、降低門檻、關掉規則，然後用同一份變更證明自己通過，綠燈就不夠可信。

合理的設計不是「任何測試都不能改」。測試也需要演進。重點是：**產品修改與保護規則修改，應該有不同的授權與審查路徑。** 尤其是權限政策、CI 設定、資料移轉與發布規則，不適合讓一般執行 agent 自己決定。

### 證據要綁定真正將合併的版本

一份 trace、測試紀錄或截圖，如果不知道對應哪個版本，只能證明某個時刻有某次操作成功。

當其他 PR 先合併、依賴改變，或同一條 PR 又有新提交，原本的驗證可能失效。隔離工作區可以避免互相覆寫檔案，但不會自動避免語意衝突；最終整合狀態仍要重新檢查。

### 抽樣不能假設每種變更都一樣

如果只隨機看幾條，可能一直抽到文案與小修補，卻沒看到少量但高風險的權限、付費與資料變更。我會要求依風險與變更類型觀察，而不是把全部 PR 當成同一批產品。

一旦抽到嚴重問題，也不只是修那一條。要問：相同失敗是否已經出現在其他未抽查的變更？哪個檢查沒有涵蓋？是否需要暫停同類自動合併，直到新增的防線真的有效？

**抽樣審查的價值，是讓工程師回頭改善環境；不是用少量看過的案例，替全部沒看過的案例保證。**

## 形式驗證能補哪一塊？ {#formal}

Lauren 在演講裡把實務驗證與更深入的形式方法放在一個光譜上，提到 Lean、TLA+，也坦承這一端更困難，仍有很多問題要處理。她不是說一般團隊必須先完成形式驗證，才能開始使用 agent。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=411s)

這裡很容易發生另一種概念跳躍：從「測試不能證明所有狀態」，直接跳到「換一種語言，就不需要 review」。

形式驗證提供的是在明確模型、規格與假設下，對某些性質的保證。可是規格是否寫對、模型是否涵蓋真實系統、外部輸入與部署環境是否符合假設，仍然要有人負責。

例如你可以證明某個狀態機不會進入一類不合法狀態，卻不能因此宣稱整個產品沒有隱私風險，或使用者一定理解介面。

我會先找價值高、邊界清楚的性質來做，而不是把「形式驗證」當成全面自主開發的通行證。同樣地，型別安全、測試、實際操作與形式方法，不是互相淘汰的關係。它們處理的問題範圍不同。

## 衡量產能，要把重工與風險算回來 {#economics}

如果團隊要導入這套方法，我不會先訂每月 PR 目標。比較值得觀察的是：

- **交付前的等待**：時間花在生成程式，還是等人回答、等環境、等驗證、等整合？
- **驗證的可靠度**：多少工作能按既定程序重現，多少因工具或資料不穩而需要人工接手？
- **缺陷與返工**：合併後才發現多少問題，哪些需要回退，同一類錯誤有沒有持續減少？
- **人的介入成本**：不是只數介入次數，而是分辨高價值判斷與重複搬資料。
- **實際成果**：使用者的問題有沒有解決，產品是否更可靠，維護成本是否下降？
- **全流程費用**：模型、驗證環境、工具維護、人工審查、事故處理，都不能只算其中最便宜的一段。

這些指標也需要共同的工作分類。簡單文案修改與跨服務資料移轉放在同一個平均值裡，很容易把真正的風險藏起來。

還要小心另一件事：驗證本身會變成新的瓶頸。當 agent 產出很快，測試環境、建置時間、資料準備與合併佇列可能開始塞車。這時再增加 agent，不一定讓結果更快，只會增加等待中的工作與相互干擾。

**值得追求的不是最多生成量，而是在可接受的風險與成本下，穩定完成真正有用的變更。**

## 如果是我，會怎麼開始導入 {#adoption}

訪談最後，她還給了一個很實際的技能來源：回看過往對話，找出自己反覆介入和糾正的地方。真正發生過的失敗，比憑空想像一份完美工作流更有價值。模型進步後，skills 也應更聚焦在流程，不必永遠累積教它最基本操作的冗長指示。[[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=3635s) [[3]](https://www.youtube.com/watch?v=MN9dGgmLyso&t=3825s)

我會從一個範圍受控的個人或團隊專案開始，先選一條常用、可觀察、失敗後可復原的功能路徑。以下是本文的導入順序，不是 pstack 官方的認證階段。

### 第一階段：把一條路徑做成能重播的驗證

先由熟悉產品的人操作一次，把環境、測試資料、操作與成功條件說清楚，再提供 agent 同一套工具。

完成條件不是「skill 檔案已經寫好」，而是另一個新的執行環境能按照它完成相同操作，並找到預先安排的失敗案例。只會把正確版本測成成功，還不足以證明它真的能抓錯。

### 第二階段：整理最常見的介入原因

每次人工接手時，記錄原因：缺工具、缺產品脈絡、錯誤假設、規格不清、架構走錯，還是權限本來就不該放行？

然後照五層修正去處理。不是每件事都加一條 prompt；能寫成規則的就寫成規則，需要產品決策的就保留人工判斷。

### 第三階段：讓環境對錯誤有反應

加入刻意設計的負向案例。例如 UI 路徑找不到、測試資料不完整、證據對不上版本、靜態檢查失敗。觀察 agent 會停下來、報告缺件，還是自行找理由跳過。

把「失敗時怎麼辦」也測過，才有資格談少人監督。

### 第四階段：小幅提高並行，先看整合問題

選彼此依賴較少的工作，使用隔離環境。確認同時執行時，測試資料、外部服務與工作佇列不會互相干擾。

這一階段常會暴露單工時看不到的問題：兩條 PR 各自通過，合起來失敗；兩個 agent 修改同一個假設，卻只解決了各自的半邊。這不是再加一段「請注意合作」就能穩定處理。

### 第五階段：才考慮限定範圍的自動合併

把可自動處理的類型列出來，也把不能自動處理的類型列出來。證據缺失、保護規則異動、權限變更與不可逆操作，走不同路徑。

當模型、框架、核心依賴或驗證工具改版，也要重新確認原本建立的信任仍然適用。信任不是永久授權書，它依賴一組會變動的條件。

最後才接外部事件。先確認執行迴圈可靠，再讓它持續收到工作。不要反過來。

## 最後留下的工作，是經營一間好廚房 {#kitchen}

Lauren 不太喜歡 software factory 這個詞。她更偏好 Michelin kitchen，因為軟體仍有創造性，不是把相同零件一直往輸送帶上放。即使不再親自處理每一個步驟，仍要為最後端出去的東西負責。[[2]](https://www.youtube.com/watch?v=Z-jNqqIYGm4&t=56s)

我覺得這個比喻比 PR 計數器更接近重點。

你得決定菜單，整理工作檯，讓工具有固定位置，讓危險的動線消失，讓做錯的人能及早發現，而不是等客人吃到才知道。當一個廚師一直在同一個地方跌倒，最該做的未必是再訓一次話，也可能是把地板修好。

放回軟體工程，就是：把產品知識變成可操作的地圖，把驗證變成穩定工具，把反覆犯的錯變成架構與檢查，把人的時間留給需求、取捨與系統性問題。

**我想學的不是她如何交付 2,500 條 PR，而是她怎麼讓下一條 PR，不必再靠同一個人救一次。**

## 參考資料

演講與訪談的跳轉連結對應下列影片；自動英文字幕可能有辨識誤差。工具行為以文中固定版本的公開技能規格為準，不代表所有平台、模型與帳號都提供相同能力。

- **[1]** [Lauren Tan：原始演講貼文](https://x.com/poteto/status/2102050467505430555)
- **[2]** [演講轉載：here's how i shipped 2,500 PRs last month to production](https://www.youtube.com/watch?v=Z-jNqqIYGm4)
- **[3]** [Matt Pocock × Lauren Tan：完整訪談](https://www.youtube.com/watch?v=MN9dGgmLyso)
- **[4]** [pstack README：先深入，再加速](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/README.md)
- **[5]** [pstack 0.15.15 套件資訊](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/.cursor-plugin/plugin.json)
- **[6]** [setup-pstack：角色與模型設定](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/setup-pstack/SKILL.md)
- **[7]** [poteto-mode：工作流程入口](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/SKILL.md)
- **[8]** [create-verification-skill：建立可操作的驗證技能](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/create-verification-skill/SKILL.md)
- **[9]** [maintain-verification-skill：維護範圍與覆蓋要求](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/maintain-verification-skill/SKILL.md)
- **[10]** [Atlas 驗證技能範例：虛構產品與未附 driver 的說明](https://raw.githubusercontent.com/poteto/verification-skill-example/d5abe70d0d8c671672b6cef4069363f26c488feb/README.md)
- **[11]** [how：理解系統的運作機制](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/how/SKILL.md)
- **[12]** [why：證據、推論與未知的區分](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/why/references/epistemics.md)
- **[13]** [architect：設計候選、實作與人工關卡](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/architect/SKILL.md)
- **[14]** [multi-phase-plan：可接手的多階段執行計畫](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/playbooks/multi-phase-plan.md)
- **[15]** [check-plan.mjs：計畫格式檢查器](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/poteto-mode/scripts/check-plan.mjs)
- **[16]** [correct：把反覆錯誤轉成結構約束](https://raw.githubusercontent.com/cursor/plugins/9f451cf875ad1239912762f67741e8e5ba6ac0f1/pstack/skills/correct/SKILL.md)
- **[17]** [Lauren Tan：The Complete Guide to pstack Pt. 2](https://x.com/poteto/status/2097732320606507506)
- **[18]** [Lauren Tan：Loops You Can Trust](https://x.com/poteto/status/2069824386283319343)
- **[19]** [React 官方：React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1)
- **[20]** [Lauren Tan：個人網站與歷史文章](https://no.lol)
- **[21]** [hiring-without-whiteboards：面試實務名單與理念](https://raw.githubusercontent.com/poteto/hiring-without-whiteboards/master/README.md)
- **[22]** [Lauren Tan：新增 correct 的原始貼文](https://x.com/poteto/status/2106542593656111276)
- **[23]** [Lauren Tan：The Complete Guide to pstack Pt. 1](https://x.com/poteto/status/2094457600259842065)

如果你正在規劃導入，可以接著讀本站的 [Agentic Engineering 系列]({{ '/technical/agentic-engineering/' | relative_url }})。需要先判斷哪一條流程適合試辦，可以從 [AI Agent 導入顧問]({{ '/technical/' | relative_url }})開始：先把問題與驗證條件說清楚，再決定要自動化到哪裡。
