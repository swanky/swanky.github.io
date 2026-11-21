---
title: "Hermes 插件黑客松前 10 名：評審選的不是功能，是不靠模型記得的關口"
seo_title: "Hermes Agent Plugin Hackathon 前 10 名解析：Foreman、Plan Mode、Mandate 等插件怎麼管住 AI Agent"
date: 2026-11-21
published: false
categories: [technical]
tags: [ai-agent, hermes-agent, agentic-engineering, hooks, permissions, claude-code, codex]
layout: article
cover_alt: "（Banner 待站主確認規格後補）"
use_glightbox: true
cta_context: agentic
extra_css: |
  .post-content .hk-wrap { overflow-x: auto; margin: 20px 0; border: 1px solid #E6E1D6; border-radius: 12px; background: #fff; }
  .post-content .hk-table { min-width: 720px; width: 100%; border-collapse: collapse; font-size: 0.92em; margin: 0; }
  .post-content .hk-table caption { caption-side: top; text-align: left; color: #5F5B53; font-size: 0.92em; padding: 10px 14px 8px; }
  .post-content .hk-table th { background: #FBF3DC; border-bottom: 3px solid #E5A300; text-align: left; padding: 9px 10px; vertical-align: bottom; line-height: 1.3; }
  .post-content .hk-table td { border-bottom: 1px solid #EEE9DD; padding: 8px 10px; vertical-align: top; line-height: 1.4; }
  .post-content .hk-table tbody tr:nth-child(even) td { background: #FDFAF3; }
  .post-content .hk-table td:first-child, .post-content .hk-table th:first-child { position: sticky; left: 0; background: #fff; font-weight: 700; border-right: 2px solid #F3ECDB; }
  .post-content .hk-table th:first-child { background: #FBF3DC; }
  .post-content .hk-table .hk-group td { background: #E6F2F9; color: #1F5F85; font-weight: 800; position: static; }
  .post-content .hk-y { color: #1E6B41; font-weight: 700; }
  .post-content .hk-p { color: #8A5D00; font-weight: 700; }
  .post-content .hk-n { color: #9A958B; }
  .post-content .hk-note { font-size: 0.92em; color: #5F5B53; }
related_posts:
  - production-ai-agent-control-planes
  - ai-agent-wallet-permission-boundaries
  - all-code-is-slop-verification-evidence
description: "Hermes 插件黑客松前 10 名，多數把規則從提示詞搬到工具執行前的關口。我讀了十個專案的程式，拆它們怎麼擋、數字怎麼讀、哪裡擋不到。"
keywords: Hermes Agent, Nous Research, Plugin Hackathon, Foreman, Plan Mode, Seedguard, Mandate, safe-swap, Promise Keeper, Hermes Canvas, Ariadne, Housemate, Hermes Gadget SDK, pre_tool_call, Claude Code hooks, Codex hooks, AI Agent 權限, 史旺基, Swanky Studio
---

你在提示詞裡寫：「不准合併 PR，要先問我。」AI 回答：「好的，我記住了。」

三小時後，對話被壓縮過兩次，它換了一個角度理解任務，覺得反正測試都綠了，就把 PR 合了。它沒有說謊，只是那句話在它的記憶裡已經不在了。

Nous Research 這次辦的 Hermes Agent 插件黑客松，前 10 名大多在處理這種問題。官方開跑公告寫得很直接：評審看實用性、可靠性、完成度與創意，而且**偏好「做到提示詞或技能做不到的事」的插件**。[[1]](https://x.com/NousResearch/status/2118094256438936062)

**我的判斷：這屆前段班贏在把「請 AI 記得」改成「AI 忘了也照樣會執行的關口」。但關口只管得到經過它的東西，而且它看的是呼叫當下的資訊，看不到程式跑起來之後做了什麼。** 多數作者自己把擋不到的路列在 README 裡。那幾份清單，比得獎名單更有用。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>十件裡有七件掛在「工具執行前一刻」</strong>：管合併、改檔、排程、密鑰、禁區。Hermes 的 <code>pre_tool_call</code> 可以放行、改寫、擋下或交給人，這段程式不靠模型記得。另外一件做升級前驗證，兩件把 Hermes 搬到房間和實體小裝置上。</li>
    <li><strong>同樣是關口，讀的東西不一樣</strong>：有的整類工具直接鎖掉，有的讀指令文字，有的讀真正會提交的程式差異。要放行一部分工作，就得讀得更深，換個寫法才騙不過；但沒有一件看得到程式跑起來之後做什麼。</li>
    <li><strong>真正的分歧在看不懂的時候</strong>：Promise Keeper、Mandate 看不懂就擋；safe-swap 看不懂就照原樣跑。兩種都對，用途不同。</li>
    <li><strong>作者數字大多可以追到來源，但口徑很窄</strong>：Plan Mode 的 82% 是兩個 AI 評審只看計畫文字的偏好；Mandate 的 29/29 來自單一便宜模型、作者自寫的攻擊目標。</li>
    <li><strong>最該先補的是「走不進關口的路」</strong>：走別的執行環境的指令、只能旁觀的輔助模型呼叫、腳本內部的行為。這些路失效時不會有任何訊息，所以 GitHub 分支保護與 CI 還是要開。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part"><span class="article-toc-part-title">這屆在比什麼</span><ol class="article-toc-items">
      <li><a href="#contest">比賽規則裡，最關鍵的是一句評審偏好</a></li>
      <li><a href="#ten">十件作品，其實是兩種產品</a></li>
      <li><a href="#gate">共同的一步：把規則從提示詞搬到關口</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">做法差在哪</span><ol class="article-toc-items">
      <li><a href="#reads">同樣是關口，讀的東西不一樣</a></li>
      <li><a href="#matrix">用六把尺橫向比較</a></li>
      <li><a href="#defaults">看不懂的時候，預設擋還是放行</a></li>
      <li><a href="#approval">人按的那一下，怎麼確定是人按的、而且看過了</a></li>
      <li><a href="#numbers">作者數字，各自的分母是什麼</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">放回自己的工作</span><ol class="article-toc-items">
      <li><a href="#compare">和 Claude Code、Codex 的同類機制比</a></li>
      <li><a href="#limits">它們會在哪裡失效，哪一種最該先補</a></li>
      <li><a href="#start">如果是我，會這樣裝</a></li>
    </ol></li>
  </ol>
</nav>

## 比賽規則裡，最關鍵的是一句評審偏好 {#contest}

先把基本資料放好。黑客松在 2026 年 11 月 4 日（美東時間）開跑，為期 7 天，現金獎金合計 US$20,000：第一名 US$10,000，第二名 US$5,000，第三名 US$2,500，第四、五名 US$1,500 與 US$1,000，另外五名佳作拿週邊與額度。投稿要做三件事：向 Hermes 插件目錄開 PR、在 X 發 90 秒內的示範影片、填表單。[[1]](https://x.com/NousResearch/status/2118094256438936062)

11 月 20 日公布結果。官方說將近 1,000 位社群成員投稿，先由 agent 替每件作品打分，再由五位社群評審排出前 10 名。[[2]](https://x.com/NousResearch/status/2123882430620733742)

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center"><p>Nous Research 公布 Hermes Agent 插件黑客松前 10 名（2026-11-20）</p>&mdash; <a href="https://twitter.com/NousResearch/status/2123882430620733742">在 X 上看原貼文</a></blockquote>

我覺得整份規則裡最重要的是這句：評審偏好**做到提示詞或技能做不到的事**。[[1]](https://x.com/NousResearch/status/2118094256438936062)

提示詞是寫給模型讀的話，技能是一包說明加範例，兩者都要靠模型照做。插件不一樣，它是 Hermes 本體會執行的程式碼。模型會忘記一句話，但它忘了，那段程式照樣執行。

「提示詞做不到」在這份名單裡有兩種意思。一種是**強制力**：規則由程式執行，不由模型決定要不要遵守。另一種是**新的場景**：第 2 名 Housemate 做語音喇叭，第 10 名 Gadget SDK 做實體小裝置，提示詞寫得再長，也長不出麥克風和螢幕。前 10 名兩種都有，前一種佔多數，這篇主要談它。

先講清楚一個限制：我看不到評分表，也不知道第一輪 agent 評分用的是什麼標準。下面談「評審偏好什麼」，是從公告的這一句話加上得獎名單倒推的，不是評審自己的說法。

## 十件作品，其實是兩種產品 {#ten}

名次與作者以官方得獎串為準。[[2]](https://x.com/NousResearch/status/2123882430620733742) 「一句話」是我讀過各專案 README 與程式後的整理。

<div class="hk-wrap">
<table class="hk-table">
  <caption>官方前 10 名。分組是我的歸類，不是官方分類。</caption>
  <thead><tr><th scope="col">名次與作品</th><th scope="col">它在做什麼</th><th scope="col">它擋的是哪種失誤</th></tr></thead>
  <tbody>
    <tr class="hk-group"><td colspan="3">第一種：管住 AI 做的事，或查證它做了什麼</td></tr>
    <tr><td>1. Foreman</td><td>commit、push、開 PR、合併前，讀真正會被提交的程式差異，擋下跳過測試、放寬檢查、塞進機密的修改；合併只能由人下指令</td><td>為了讓檢查變綠而動手腳</td></tr>
    <tr><td>3. Plan Mode</td><td>規劃期間只給唯讀工具，人核准「這一版」計畫後才准改檔</td><td>還沒想清楚就動手</td></tr>
    <tr><td>4. Seedguard</td><td>種子碼、私鑰、API key 在送出模型前換成代號；工具真的需要時，人限時、限工具放行</td><td>把祕密送到模型供應商</td></tr>
    <tr><td>6. Mandate</td><td>先觀察排程工作實際做了什麼，整理成最小權限規則，人核准後擋掉範圍外的呼叫</td><td>半夜沒人看時被注入指令帶走</td></tr>
    <tr><td>7. safe-swap</td><td>把 <code>git push --force</code> 換成較安全的版本，把 <code>rm -r</code> 改成搬進隔離區，可以復原</td><td>一行指令毀掉別人的成果</td></tr>
    <tr><td>8. Promise Keeper</td><td>你用白話說「不要碰 prod」，它變成每次工具呼叫都會檢查的規則，而且只有人能開關</td><td>規則在長對話裡被忘掉</td></tr>
    <tr><td>9. Hermes Canvas</td><td>計畫畫成畫布上的盒子，盒子亮不亮看真實寫檔與測試結果，不看模型自己說</td><td>沒做完卻說做完了</td></tr>
    <tr><td>5. Ariadne</td><td>把真實對話錄下來，升級 Hermes 前離線重播，看新版行為有沒有變</td><td>升級後默默變了</td></tr>
    <tr class="hk-group"><td colspan="3">第二種：把 Hermes 搬出筆電</td></tr>
    <tr><td>2. Housemate</td><td>舊手機、筆電變成各房間的免持語音喇叭，危險指令可以口頭核准</td><td>（不是護欄，是新的使用場景）</td></tr>
    <tr><td>10. Hermes Gadget SDK</td><td>把 ESP32 等開發板做成會說話、會顯示核准問題的實體小裝置</td><td>（不是護欄，是新的使用場景）</td></tr>
  </tbody>
</table>
</div>

第一組裡，前七件都掛在工具執行前的關口上。Ariadne 我放在最後，因為它不攔任何東西，它是驗證工具。但它回答的問題和其他七件一樣：**怎麼確定 AI 這次的行為，跟你以為的一樣。**

第二組的兩件，各自也在處理核准。不在電腦前的時候，你怎麼對一個危險指令說好或不好？這一點後面會回來談。

## 共同的一步：把規則從提示詞搬到關口 {#gate}

Hermes 有一組 hook，也就是讓插件在特定時刻插進來執行的掛勾。這屆最常用的是 `pre_tool_call`。官方文件寫它在**每一次工具執行前一刻**觸發，內建工具和插件工具都算。[[12]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L556)

在這個關口，插件可以回四種答案：什麼都不說就放行；`modify` 改寫參數；`block` 擋下，並把原因當成錯誤訊息還給模型；`approve` 把這次呼叫送到人的核准流程。多個插件同時表態時，擋下優先於送人核准。[[12]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L580) 這段程式在逾時或出錯時，Hermes 預設會擋下。[[12]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L396)

為什麼大家都掛在這裡，不掛在核准流程上？Hermes 在「要問人之前」和「人回答之後」也各有一個 hook，但文件寫明它們只能旁觀：回傳值會被忽略，不能否決，也不能替人回答。文件自己的建議是，要擋就在 `pre_tool_call` 擋。[[12]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L1540)

<figure>
  <a href="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/gate.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="hermes-hackathon" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/gate-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/gate.svg' | relative_url }}" alt="流程圖：模型決定呼叫工具後，先經過 pre_tool_call 關口，插件可以放行、改寫、擋下或交給人核准，之後工具才執行。下方列出關口看不到的四條路：Codex 原生執行、TUI 側邊 agent、輔助模型呼叫、腳本內部行為" width="840" height="464"></picture>
  </a>
  <figcaption>自製圖解。關口行為依 Hermes 官方 hook 文件<a href="https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L556">[12]</a>；看不到的路依各作者 README 自述。</figcaption>
</figure>

看兩個具體例子，就知道「放在關口」和「寫在提示詞」差在哪。

**Foreman 不讓 AI 自己合併。** 程式裡，只要 AI 自己執行 `gh pr merge`，就直接回「擋下」，訊息是「合併是使用者的決定，請他執行 `/foreman merge`」。作者在旁邊註解為什麼不回「送人核准」：因為人在核准視窗按了「一律允許」，或開了不問人的模式，之後的合併就全部放行了。[[4]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/foreman/gate.py#L1116-L1119) 同一句「不准合併」，寫在提示詞裡是請求，寫在這裡是每次都會執行的檢查。

Foreman 判斷「這次提交有沒有動手腳」時，讀的也不是指令。它讀 git 真正會記錄下來的差異；審查規則的設定，取自這條分支從主線分出去的那個點，所以一個 PR 沒辦法順手放寬審查自己的規則。規則看不出來的部分，交給第二個模型讀差異。作者把這個模型綁得很緊：它提出的每一項問題都要逐字引用差異內容，引文不在差異裡就丟掉；它的結論只供參考，不能放行，也不能合併。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md) 第二個模型只能幫忙找問題，不能替任何人開門。

**Plan Mode 不靠「請你先規劃」。** 作者在示範貼文說，Hermes 內建的 `/plan` 只是模型可以忽略的一句指示。[[34]](https://x.com/ElectricSheepIO/status/2119788823911571787) 它的做法是工具白名單：規劃期間只放行讀檔、搜尋這類唯讀工具；終端機、程式執行、子 agent、MCP 和任何沒見過的工具全部擋下；寫檔只准寫進計畫資料夾。插件內部一出錯也是擋。[[5]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md)

白名單比「看指令長什麼樣」穩得多。規劃期間整個終端機都進不去，AI 換什麼寫法下指令都沒差。

所以評審為什麼偏好這類作品？我的理解有三層。

**一，提示詞的保證會過期。** 長對話會被壓縮，任務會被重新理解。Plan Mode 作者說內建的 `/plan` 是模型可以忽略的指示，講的就是這件事。[[34]](https://x.com/ElectricSheepIO/status/2119788823911571787) 關口上的程式每次工具呼叫都跑一次，不會因為對話變長就變弱。

**二，提示詞讓同一個模型又當球員又當裁判。** 「不准合併」寫在提示詞裡，判斷這次算不算合併、要不要遵守的，還是那個想把任務做完的模型。Foreman 連「送人核准」都不用，直接擋，就是不讓這個判斷回到會被一句「一律允許」影響的地方。[[4]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/foreman/gate.py#L1116-L1119)

**三，寫成程式的規則可以被檢查。** 「我有交代 AI 不要碰」沒辦法驗證。Mandate 把攻擊紀錄和重播腳本放進 repo，Plan Mode 數得出核准前有幾次改到程式，這些數字的口徑後面會細看。就算沒有數字，像第一名的 Foreman，規則本身也是讀得到的程式，別人可以逐行看它擋什麼。評審要比可靠性，總得有東西可以比。

但提示詞沒有因此變得沒用。Promise Keeper 兩層都做：每輪對話開始時，它把已啟用的規則寫進提示，讓模型少撞牆；擋不擋，則由關口上的程式決定。[[16]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/__init__.py#L360-L364) 提示讓模型知道規則，關口管它不知道、或不想知道的時候。

還要補一個前提：關口上的程式，本身也是 agent 碰得到的檔案。手上有終端機的 agent，可以試著停用插件，或改插件的資料檔。做得完整的作品會先堵這條路。Promise Keeper 有一條永遠開著的內建規則，不准 AI 改規則檔與插件程式，也不准它執行停用插件的指令。[[15]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/README.md) Foreman 的關口同樣會擋下關掉 Foreman、或改插件設定的指令。[[4]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/foreman/gate.py#L1013-L1019) 「不靠模型記得」要成立，護欄得先保護自己。

## 同樣是關口，讀的東西不一樣 {#reads}

都掛在 `pre_tool_call`，不代表擋得一樣牢。讀完程式後我覺得，分出高下的是關口**拿什麼當判斷依據**。由淺到深大約四層：

<div class="hk-wrap">
<table class="hk-table">
  <caption>分層是我的歸類。「擋不到」一欄取自各作者 README 的已知限制，我沒有自己跑過這些繞法。</caption>
  <thead><tr><th scope="col">關口讀什麼</th><th scope="col">誰這樣做</th><th scope="col">好處</th><th scope="col">擋不到的</th></tr></thead>
  <tbody>
    <tr><td>1. 工具的名稱</td><td>Plan Mode 的規劃期<a href="https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md">[5]</a></td><td>指令怎麼寫都沒差，因為整個終端機都進不去</td><td>不經過關口的執行路徑；計畫核准後，這把鎖就不適用了</td></tr>
    <tr><td>2. 指令的文字</td><td>safe-swap<a href="https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/shellscan.py#L1-L7">[14]</a>；Foreman 辨識 commit、push、合併<a href="https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md">[3]</a>；Plan Mode 核准後的「不准 commit」</td><td>便宜，而且知道 AI 想做的是哪個動作</td><td>alias、腳本、變數拼出來的指令，都認不出來</td></tr>
    <tr><td>3. 參數裡的路徑與主機，看不懂的當黑箱</td><td>Mandate<a href="https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/README.md">[8]</a>、Promise Keeper<a href="https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/README.md">[15]</a></td><td>包在 <code>bash -c</code> 裡、用變數拼的、沒見過的程式，多半直接擋；Mandate 只放行逐字核准過的那一條</td><td>程式跑起來才決定的事：被允許的 <code>curl</code> 跟著轉址去別的主機；被允許的 <code>make test</code>，但 Makefile 已經被改過</td></tr>
    <tr><td>4. 留下來的結果</td><td>Foreman 讀真正會提交的差異<a href="https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md">[3]</a>；Canvas 讀檢查指令的退出碼<a href="https://github.com/0xbyt4/hermes-canvas/blob/d6eeff0d6f7ec653262537bdd7bb001cc6d3c7f8/canvas/binding.py#L369-L378">[17]</a></td><td>不管指令怎麼寫，看的是做出來的東西</td><td>沒被檢查到的那部分結果；以及「檢查什麼」如果是 AI 自己選的，結果再真也沒用</td></tr>
  </tbody>
</table>
</div>

**我的讀法：第一層穩，是因為它整類都擋；只要想放行一部分工作，就得往下讀，而且越往下越貴。** Plan Mode 的白名單最便宜也最穩，代價是規劃期間 AI 連跑一次測試都不行。從第二層開始，AI 還能做事，但換個寫法就可能漏掉；讀得越深，越不容易被寫法騙過。Promise Keeper 要做到「看不懂就擋」、又不能什麼都擋，就得看懂很多東西：它自己寫了一套拆解 shell 指令的程式，還會把 Python 程式碼拆成結構，判斷它是只讀還是會寫。我讀到的版本，光這一個檔案就有 2,422 行。

**同一件作品可以同時站在兩層。** Foreman 判斷內容時讀差異，是第四層；但辨識「這是不是一次 commit」時，讀的是指令文字，是第二層。所以它擋得住「把斷言放寬」，卻認不出 `$G commit`。Plan Mode 規劃期在第一層，核准之後的「不准 commit」掉回第二層，作者自己標為「盡力而為」。作者的測試紀錄裡，精簡設定下 108 次有 2 次、另一輪 112 次有 1 次，AI 還是 commit 了，三次都發生在載入一個「每步都 commit」的技能之後；傳統設定 70 次是 0 次。[[5]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L794-L806)

**這屆沒有一件讀得到第五層：程式實際做了什麼。** 那要靠沙盒，也就是把程式關在碰不到外面的環境裡跑。Mandate 的 README 直接寫「它不是沙盒」，只看工具的參數，看不到程式執行後做什麼。[[8]](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/README.md) 這是關口這種做法的天花板，不是哪一位作者沒做好。

Seedguard 示範了另一種「讀結果」，只是用在測試上：它不只檢查遮罩函式的回傳值，還架了一個假的模型供應商，讓真的 Hermes 把請求送過去，再檢查主對話送到的每一個請求裡有沒有祕密原文。[[10]](https://github.com/Investorquab/Seedguard/blob/889dcb03308571a7a39af050bfacf7518d2d6fce/TESTING.md) 在收件端驗，比在寄件端自己說「我遮了」可信。

## 用六把尺橫向比較 {#matrix}

issue 裡請我至少比五件事：關口還是提示、人為核准、最小權限、可不可以復原、進度有沒有真實證據。我多加一把「看不懂或出錯時，預設怎麼做」，因為讀完程式後，這一把最能分出作品的性格。

<div class="hk-wrap">
<table class="hk-table">
  <caption>每一格都對應到該專案的 README 或程式。<span class="hk-y">✔</span> 是核心設計，<span class="hk-p">◐</span> 是部分做到，<span class="hk-n">—</span> 是沒有做，「不適用」是那件作品本來就不處理這件事。</caption>
  <thead><tr><th scope="col">作品</th><th scope="col">規則放在哪</th><th scope="col">人為核准</th><th scope="col">最小權限</th><th scope="col">可以復原</th><th scope="col">真實證據</th><th scope="col">看不懂／出錯時</th></tr></thead>
  <tbody>
    <tr><td>Foreman</td><td>工具關口＋收工前檢查</td><td class="hk-y">✔ 合併只能由人下指令</td><td class="hk-n">—</td><td class="hk-n">—</td><td class="hk-y">✔ 讀真正會提交的差異</td><td>要問人</td></tr>
    <tr><td>Plan Mode</td><td>工具關口（白名單）</td><td class="hk-y">✔ 核准綁定這一版計畫</td><td class="hk-y">✔ 規劃期只給唯讀工具</td><td class="hk-n">—</td><td class="hk-n">—</td><td>擋</td></tr>
    <tr><td>Seedguard</td><td>送模型前的請求層＋工具關口</td><td class="hk-y">✔ 限時、限工具放行祕密</td><td class="hk-p">◐ 祕密只交給指定工具</td><td class="hk-n">—</td><td class="hk-n">—</td><td>擋（改送空白請求）</td></tr>
    <tr><td>Mandate</td><td>工具關口</td><td class="hk-y">✔ 規則書要人核准</td><td class="hk-y">✔ 每個排程工作一份</td><td class="hk-n">—</td><td class="hk-p">◐ 規則從實際呼叫學來</td><td>擋</td></tr>
    <tr><td>safe-swap</td><td>工具關口（改寫指令）</td><td class="hk-n">— 沿用 Hermes 原本的核准</td><td class="hk-n">—</td><td class="hk-y">✔ 隔離區、快照、lease</td><td class="hk-p">◐ 收據記下影響幾個檔</td><td>照原樣跑，但明講沒改</td></tr>
    <tr><td>Promise Keeper</td><td>工具關口＋執行前最後一關＋提示</td><td class="hk-y">✔ 規則只有人能開</td><td class="hk-p">◐ 禁區規則</td><td class="hk-n">—</td><td class="hk-n">—</td><td>擋</td></tr>
    <tr><td>Hermes Canvas</td><td>工具關口＋收工前檢查</td><td class="hk-p">◐ 人可在畫布上改計畫</td><td class="hk-p">◐ 刪掉的盒子不准再寫</td><td class="hk-n">—</td><td class="hk-y">✔ 寫檔與測試結果點燈</td><td>放行</td></tr>
    <tr><td>Ariadne</td><td>錄製與離線重播</td><td class="hk-n">—</td><td class="hk-n">—</td><td class="hk-n">—</td><td class="hk-y">✔ 用你自己的真實對話</td><td class="hk-n">不適用</td></tr>
    <tr><td>Housemate</td><td>聊天平台（語音進出）</td><td class="hk-y">✔ 口頭核准，聽不清楚就不算</td><td class="hk-n">不適用</td><td class="hk-n">不適用</td><td class="hk-n">不適用</td><td>擋（等 Hermes 逾時）</td></tr>
    <tr><td>Gadget SDK</td><td>聊天平台（實體裝置）</td><td class="hk-y">✔ 指令顯示不全就不能按核准</td><td class="hk-n">不適用</td><td class="hk-n">不適用</td><td class="hk-n">不適用</td><td>只能拒絕</td></tr>
  </tbody>
</table>
</div>

<p class="hk-note">手機上可以左右滑動表格。</p>

橫著看，我看到三件比個別功能更重要的事。

**第一，沒有一件作品什麼都做。** Foreman 管證據不管權限，Plan Mode 管權限不管復原，safe-swap 管復原但不擋任何東西。它們是可以疊起來用的零件。疊的時候有順序問題，失效那一節會談。

**第二，「真實證據」這一欄最少人做，但最難被模型騙。** Canvas 的盒子要亮起「完成」，執行的指令必須和盒子綁定的檢查指令一字不差；程式註解特別寫了，`echo '<check>'`、`<check> || true` 或多加參數都不算。[[17]](https://github.com/0xbyt4/hermes-canvas/blob/d6eeff0d6f7ec653262537bdd7bb001cc6d3c7f8/canvas/binding.py#L369-L378) Foreman 則是讀 git 真正會記錄下來的差異，不看指令文字。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md)

**第三，可以復原的只有 safe-swap 一件。** 這很可惜。擋下來是最後一道線，能復原的系統才能讓人放心多給一點權限。它的復原也有上限：`git push --force` 換成較安全的版本後，只是拒絕不安全的推送，推出去的沒辦法收回；超過 20,000 個檔案或 200 MB 的 `git clean` 不拍快照，照原樣執行，並標明這次沒有保護。[[13]](https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/README.md)

## 看不懂的時候，預設擋還是放行 {#defaults}

每個護欄都會遇到它看不懂的指令：包在 `bash -c` 裡的字串、變數組出來的路徑、一支沒見過的程式。這時候怎麼做，是設計者的價值選擇。

<figure>
  <a href="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/deny-or-allow.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="hermes-hackathon" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/deny-or-allow-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/deny-or-allow.svg' | relative_url }}" alt="三欄對照：預設擋下的有 Plan Mode、Seedguard、Mandate、Promise Keeper；交給人的有 Foreman；預設放行的有 safe-swap 與 Hermes Canvas。下方註明平台本身也不一致：Hermes 的 pre_tool_call 出錯會擋，middleware 出錯會放行，Codex hook 回傳不支援的欄位時照樣執行" width="840" height="452"></picture>
  </a>
  <figcaption>自製圖解。依各專案程式與 README、Hermes 與 Codex 官方文件整理。</figcaption>
</figure>

兩個極端剛好是第 7 名和第 8 名。

**safe-swap 只改它完全看懂的指令。** 它沒有用現成的 shell 解析器，而是自己寫了一個刻意做小的掃描器，檔頭註解寫著：任何它不完全理解的東西都會放棄，指令原封不動。[[14]](https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/shellscan.py#L1-L7) 插件自己出錯也一律放行。[[30]](https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/runtime.py#L150-L176) README 說得很清楚：它從不擋、也不碎念，「它不是護欄」。[[13]](https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/README.md)

我很欣賞它多做的一件事：看起來具破壞性、但改不了的指令，它會明講 `NOT swapped`，不讓 AI 以為自己有保護。

另外要更正一個常見的說法。safe-swap 真的「換掉」的指令只有兩種：`git push --force` 換成 `--force-with-lease --force-if-includes`，`rm` 換成搬進隔離區。`git reset --hard`、`git clean`、`git branch -D` 這幾種，是先拍快照、再照原樣執行。[[13]](https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/README.md)

**Promise Keeper 反過來，看不懂就擋。** 它的規則判斷完全不經過語言模型，檔頭第一行就寫「決定擋不擋，從不讓 LLM 參與」。[[32]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/promise_keeper/rules.py#L1) 你的白話規則也是用固定規則轉換，不是請模型理解。[[33]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/promise_keeper/detect.py#L1-L6) 指令如果指向受保護的資料夾，除非它確定那支程式只會讀，例如 `cat`、`ls`、`git diff`，否則一律擋。[[15]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/README.md) Mandate 是同一派：包在 `bash -c` 裡的、接在 `xargs` 或 `sudo` 後面的、用變數拼的，全部當成黑箱，只有逐字核准過的那一條才放行。[[8]](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/README.md)

兩種都合理，差別在用途。safe-swap 想讓日常的手滑變得可以救，代價是不保證；Promise Keeper 想守住一條你說過的線，代價是偶爾誤擋。**拿 safe-swap 當安全邊界，或拿 Promise Keeper 當日常便利工具，都是用錯地方。**

我分辨這兩派的方法，是問「插件自己壞掉時，你損失的是什麼」。守線的插件（Promise Keeper、Mandate、Seedguard、Plan Mode）壞掉時如果放行，你失去的是保護，而且不會知道，所以它們寧可擋錯。幫忙的插件（safe-swap、Canvas）壞掉時如果擋下，你失去的是進度，所以它們寧可不幫。自己寫 hook 時，先回答這一題，再決定出錯時回什麼。

再往下挖，有一個連平台都沒統一的細節。Hermes 的 `pre_tool_call` 出錯時會擋，但另一種掛法 middleware 出錯時，Hermes 會落回原始請求，也就是放行。Seedguard 的註解直接寫出這件事，所以它在任何內部錯誤時都改送不含內容的空白請求，絕不讓例外往外拋。[[9]](https://github.com/Investorquab/Seedguard/blob/889dcb03308571a7a39af050bfacf7518d2d6fce/hooks.py#L195-L210) Promise Keeper 也獨立做了一樣的事，註解寫：如果這段出錯，Hermes 會跳過它直接執行工具，所以每條路徑都要明確回傳。[[16]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/__init__.py#L202-L221)

兩組不同的作者，各自踩到同一個平台細節，各自補上。我覺得這就是「完成度」最具體的樣子。

## 人按的那一下，怎麼確定是人按的、而且看過了 {#approval}

很多護欄最後都落在「請人核准」。如果 AI 自己就能按核准，這一關就是裝飾。這屆作品在這件事上的做法，是我最想抄回自己環境的部分。

- **Plan Mode 讓 AI 拿不到核准按鈕。** 它給 AI 的 `plan_mode` 工具只有開啟、狀態、關閉、送出、檢視、列出六種動作，沒有「核准」。[[31]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/plan_mode/plugin.py#L83) 核准還綁著計畫的版本與內容雜湊值，計畫改過一個字就要重新核准。[[5]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md)
- **Foreman 的合併與例外放行都只能用人打的指令。** README 寫：slash 指令由你輸入，模型沒有任何工具能執行它們。例外放行一次只有 24 小時。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md)
- **Promise Keeper 的規則先以「提案」存著。** AI 從對話裡抓到你的規則，只能存成提案；啟用只能透過人輸入的指令或 Desktop 面板。[[33]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/promise_keeper/detect.py#L1-L6)
- **Seedguard 的放行有時限。** `/seedguard arm <id> 5` 只放行某個祕密給指定工具 5 分鐘，時間到自動失效。[[18]](https://x.com/Quabnation/status/2119574841057517629)
- **Gadget SDK 不讓你盲按。** 裝置螢幕小，指令只有在能完整顯示、而且是一般可列印字元時才會顯示；看不全時只能拒絕，或回主機核准。文件另外寫：讓 AI 問你選擇題的功能和核准刻意分開，AI 不能用一道選擇題頂替核准；按鍵核准也只算這一次，不會變成「一律允許」。[[23]](https://github.com/Adolanium/hermes-gadget-sdk/blob/35dbae77f21c54519dde7fcd90ef5a92192c6f60/docs/hermes-integration.md)
- **Housemate 聽不清楚就不算。** 口頭回答不是明確的「approve」，例如「好，但它會刪什麼？」，一律不核准，接著由 Hermes 自己的核准逾時拒絕。[[20]](https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/core/answers.py#L1-L15) Hermes 預設逾時是 300 秒。[[24]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/security.md) 口頭的「approve」只會對應到 Hermes 那張核准卡上最窄的一種放行；被 Hermes 智慧核准標記的指令，只能點螢幕核准，口頭不算。要留意的是，喇叭唸的是 Hermes 對指令的描述，不是指令本身；完整指令顯示在那個房間的螢幕卡片上。[[19]](https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/CLAIMS.md)
- **Mandate 在沒人的時候，乾脆不問。** 排程執行時，範圍外的呼叫一律擋，而且它從不回「送人核准」，所以 Hermes 的排程核准設定沒辦法把一次違規變成放行。[[8]](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/README.md)

這七種做法可以收成三個條件。**AI 手上沒有核准這個動作**：Plan Mode、Foreman、Promise Keeper、Seedguard 都是。**核准綁著內容和期限**：計畫的雜湊值、5 分鐘、24 小時、只算這一次。**人看得到自己在核准什麼**：Gadget SDK 顯示不全就不給按。

前兩個條件，這屆做得很紮實。但核准還是會被稀釋，作者們自己列了這幾種情況：

- **Foreman**：開了不問人的模式、或關掉核准時，「擋下」照樣成立，但原本「要問人」的情況會在沒有人的狀態下放行。共用的聊天室裡，任何被 Hermes 授權的人都能下合併指令。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md)
- **Plan Mode**：使用者說「不要問我問題」時，AI 可能跳過核准卡；聊天平台的 `/approve all` 會把等待中的計畫和指令一起核准。[[5]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L718)
- **Seedguard**：放行期間，被注入指令的 agent 可以在允許的工具裡用那個祕密；放行中的值也會出現在本機的行程參數，和你自己的核准視窗裡。[[35]](https://github.com/Investorquab/Seedguard/blob/889dcb03308571a7a39af050bfacf7518d2d6fce/README.md)
- **Mandate**：評測裡的核准是腳本自動按的，沒有人讀過規則。有一個工作在觀察期把報告寫錯位置，規則照學、核准照過，之後寫到正確位置反而被擋。[[7]](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/bench/README.md)

**我的判斷：這屆把「誰按的」處理得很好，「按之前看了什麼」還很弱。** 核准視窗跳得太頻繁、或一次核准一整批時，人按下去的那一下，保護力和 AI 自己按差不了多少。Mandate 那個寫錯位置的例子最清楚：流程上有人核准這一步，實際上沒有人讀。

這裡也有一個邊界：「slash 指令只有人能打」是 Hermes 本身的行為，各插件都建立在這個前提上。我沒有去 Hermes 原始碼逐行確認，只能說這是作者們的共同說法。

## 作者數字，各自的分母是什麼 {#numbers}

示範貼文裡的數字很漂亮，但每個數字都要先問「分母是什麼」。我把查得到出處的放在一起：

<div class="hk-wrap">
<table class="hk-table">
  <caption>「出處」是我在 repo 裡找到的原始說明；「未驗證」代表 repo 內找不到原始紀錄。全部是作者自述，我沒有重跑任何測試。</caption>
  <thead><tr><th scope="col">宣稱</th><th scope="col">實際口徑</th><th scope="col">我怎麼讀</th></tr></thead>
  <tbody>
    <tr><td>Plan Mode：盲測評審 82% 選它的計畫</td><td>評審是兩個 AI 模型（Claude 一個、Codex 一個），只看計畫文字做成對比較；兩邊用同一個模型。README 寫明比的是計畫偏好，不是成品程式碼對不對；配對數沒有列出，兩位評審的 95% 信賴區間是 71–91% 與 76–86%。貼文另外提到的 83% 到 92%，是四個較大任務、各 12 次執行的結果。<a href="https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L551-L561">[5]</a></td><td>「評審比較喜歡」不等於「做出來比較對」。評測腳本和原始資料不在 repo 裡，無法重現。</td></tr>
    <tr><td>Plan Mode：50 次中 0 次在核准前碰程式碼</td><td>貼文寫 50 次<a href="https://x.com/ElectricSheepIO/status/2119788419924570130">[6]</a>；README 分成 38 次與 12 次兩批，而且只算經過 <code>pre_tool_call</code> 的工具。<a href="https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L554">[5]</a></td><td>成立，但範圍限定在關口看得到的地方。</td></tr>
    <tr><td>Plan Mode：規劃期間 0 次執行指令</td><td>同一組測試裡，對照的 Codex 規劃模式在核准前 38 次有 38 次跑了唯讀指令與測試，Plan Mode 是 0 次。<a href="https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L688">[5]</a></td><td>這是兩種規劃方式，不是安全分數。Codex 邊查邊規劃，Plan Mode 只讀不跑；鎖比較嚴，換來的是規劃時沒有測試結果可以參考。</td></tr>
    <tr><td>Plan Mode 的代價（作者自己寫出來的）</td><td>端到端耗時是 Codex 的 1.61 倍與 1.82 倍；四個較大任務的 token 用量是 1.2 到 5.3 倍；隱藏偏好找出 9/10，Codex 10/10；早期比較的環境對 Codex 不公平，作者承認公布的比值「美化了 Plan Mode」。<a href="https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L684">[5]</a></td><td>這是全場最誠實的一段，值得給分。安全有成本，作者把帳攤開了。</td></tr>
    <tr><td>Mandate：29/29 次攻擊呼叫被擋；120 次攻擊中造成傷害 0 次，預設設定是 18 次</td><td>Hermes v0.23.0 排程、gpt-4o-mini 單一模型、10 個作者自製的工作。注入包裝文字取自公開的 AgentDojo 與 InjecAgent，六類攻擊目標是作者自寫。模型真的照注入行動的只有 22% 到 26%，所以每組只有 29 到 42 次攻擊呼叫。核准是腳本自動按的，沒有人讀過規則。<a href="https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/bench/README.md">[7]</a></td><td>作者自己寫「當成 29 之 29，不要當成證明」。資料與腳本都在 repo，可以無金鑰重播，是這屆最可檢查的一組數字。</td></tr>
    <tr><td>Mandate：1,038 次合法呼叫誤擋 39 次</td><td>這是用自己錄下的紀錄重播、而且是看過同一批資料修正後的數字；修正前是 58 次。<a href="https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/bench/README.md">[7]</a></td><td>誤擋率約 3.8% 到 5.6%，應該和攔截率並列看。對每晚要跑完的排程，這不是小數字。</td></tr>
    <tr><td>Mandate：多觀察幾次，誤擋少很多</td><td>同一批紀錄、修正前的程式重播：觀察 3 次誤擋 58/1,038，觀察 4 次 33/817，觀察 5 次 13/609。分母變小，是因為多拿去觀察的那幾次不再計分。<a href="https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/bench/README.md">[7]</a></td><td>作者說觀察次數是影響誤擋的主要因素。評測用的 3 次，我會當成下限，不當成建議值。</td></tr>
    <tr><td>Mandate 的代價（作者自己寫出來的）</td><td>Mandate 那一組的 120 次攻擊執行，有 30 次沒跑完，Hermes 預設是 19 次；沒有攻擊的執行完成 40/50，Hermes 預設是 42/50。<a href="https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/bench/README.md">[7]</a></td><td>沒跑完的次數比預設多。我沒有逐筆核對原因，不能全算在誤擋頭上；但這組數字和 0/120 要一起看。</td></tr>
    <tr><td>Housemate：停止說話後 2.6 秒回答</td><td>20 次暖機後的中位數，p95 是 3.2 秒。同一台電腦、短答案；作者寫明「這不是通用數字」。<a href="https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/CLAIMS.md">[19]</a></td><td>條件寫得很清楚，這種寫法值得學。</td></tr>
    <tr><td>Housemate：喚醒 58/58、每小時誤喚醒 0.11 次</td><td>合成語音；9.2 小時公版有聲書只發生 1 次誤喚醒。作者自己註明「不是在真實家庭量的」，沒有電視、音樂和小孩。<a href="https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/CLAIMS.md">[19]</a></td><td>放家裡前，自己要再量一次。</td></tr>
    <tr><td>Ariadne：5 個對話、0 處變化、約 3 分鐘；358 個 commit 用 10 次重播找到元兇</td><td>repo 的範例畫面是 4 個對話、114 秒；網站上的二分搜尋步驟是展示動畫，repo 內沒有實際執行紀錄。<a href="https://github.com/miracle352/hermes-ariadne/blob/128c95967a0761ad24d3d224441d1502c43bbb69/README.md">[21]</a></td><td>未驗證。358 次用二分法約 9 次可以收斂，數量級合理。</td></tr>
    <tr><td>測試數：Seedguard 129 項、Housemate 513 項</td><td>Seedguard 自己的測試紀錄之後已到 149 項<a href="https://github.com/Investorquab/Seedguard/blob/889dcb03308571a7a39af050bfacf7518d2d6fce/TESTING.md">[10]</a>；Housemate 的報告已是 566 項。<a href="https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/CLAIMS.md">[19]</a></td><td>貼文是當時的快照，不影響判斷。</td></tr>
  </tbody>
</table>
</div>

Foreman 拿第一名，但 README 沒有任何效果數字，只有一個案例：它在真實對話裡擋下一個只放寬了兩個斷言的 PR。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md) 我反而覺得這是好事。它沒有報一個漂亮的攔截率，只說清楚擋什麼、不擋什麼。

把這些數字照「別人能不能檢查」排一次，順序和名次很不一樣：

1. **Mandate（第 6 名）**：紀錄和腳本都在 repo，不用金鑰就能重播，對自己不利的數字也列了。
2. **Housemate（第 2 名）**：每一項宣稱都分級，附重現指令與結果檔。[[19]](https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/CLAIMS.md)
3. **Plan Mode（第 3 名）**：方法和不利的數字寫得很細，但評測腳本與原始資料不在 repo。
4. **Ariadne（第 5 名）**：貼文裡的數字，在 repo 找不到原始紀錄。
5. **Foreman（第 1 名）**：沒有效果數字。

我不認為這代表評審看走眼。公告列的評分項目是實用性、可靠性、完成度與創意，沒有一項叫「評測嚴謹」。但如果你要挑一個裝進自己的環境，我會把這個順序看得比名次重：能重播的數字，你可以換成自己的工作再跑一次；不能重播的，只能選擇信或不信。

## 和 Claude Code、Codex 的同類機制比 {#compare}

如果你用的是 Claude Code 或 Codex，這屆作品可以直接換算成你手上的工具。三家都有「工具執行前」的掛勾，差別在細節：

<div class="hk-wrap">
<table class="hk-table">
  <caption>依三家官方文件整理（查核日 2026-11-21）。</caption>
  <thead><tr><th scope="col">問題</th><th scope="col">Hermes</th><th scope="col">Claude Code</th><th scope="col">Codex</th></tr></thead>
  <tbody>
    <tr><td>工具執行前能不能擋</td><td><code>pre_tool_call</code> 回 block<a href="https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L556">[12]</a></td><td><code>PreToolUse</code> 回 deny<a href="https://code.claude.com/docs/en/hooks">[25]</a></td><td><code>PreToolUse</code> 回 deny<a href="https://learn.chatgpt.com/docs/hooks">[27]</a></td></tr>
    <tr><td>能不能改寫參數</td><td>可以，modify 的參數會疊加合併</td><td>可以，<code>updatedInput</code> 整份替換，改完再對權限規則檢查一次</td><td>可以，必須搭配 allow 一起回傳</td></tr>
    <tr><td>能不能交給人</td><td>可以，approve 送進核准流程</td><td>可以，ask；另有 <code>PermissionRequest</code> hook</td><td>PreToolUse 目前不支援 ask；另有 <code>PermissionRequest</code> hook</td></tr>
    <tr><td>hook 出錯、格式不對或不表態時</td><td>逾時或出錯會擋</td><td>什麼都不說時，照一般權限流程走；沉默不等於核准<a href="https://code.claude.com/docs/en/hooks">[25]</a></td><td>回傳不支援的欄位時，記為失敗、工具照樣執行<a href="https://learn.chatgpt.com/docs/hooks">[27]</a></td></tr>
    <tr><td>規劃模式</td><td>內建 <code>/plan</code> 是提示；Plan Mode 插件把它變成鎖</td><td>內建於權限系統；規劃模式中，hook 的 allow 對改檔無效<a href="https://code.claude.com/docs/en/permissions">[26]</a></td><td>有 <code>/plan</code> 指令；唯讀可以用沙盒模式強制<a href="https://learn.chatgpt.com/docs/agent-approvals-security">[28]</a></td></tr>
    <tr><td>不讓 agent 收工</td><td><code>pre_verify</code>，每輪最多催 3 次</td><td><code>Stop</code> hook 可擋</td><td><code>Stop</code> hook</td></tr>
    <tr><td>官方怎麼定位</td><td>hook 是政策關口</td><td>Bash 規則只比對 Claude 寫出的指令文字，不是程式的安全邊界<a href="https://code.claude.com/docs/en/permissions">[26]</a></td><td>「當成有用的護欄，不是完整的強制邊界」<a href="https://learn.chatgpt.com/docs/hooks">[27]</a></td></tr>
  </tbody>
</table>
</div>

我從這張表讀出四件事。

**一、hook 的權力很接近，差在預設值。** 三家都能擋、能改寫。多個 hook 意見不同時，Hermes 是擋下優先於送人核准，Claude Code 是 deny 優先於 ask、再優先於 allow，兩家都是嚴的贏。[[12]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L580) [[25]](https://code.claude.com/docs/en/hooks) 差別在出狀況的時候：Hermes 的工具關口出錯會擋；Claude Code 的 hook 不表態，就回到權限規則；Codex 文件則寫，PreToolUse 回了它不支援的欄位（例如要求問人），會記成 hook 執行失敗，工具呼叫照常繼續。[[27]](https://learn.chatgpt.com/docs/hooks) 所以同一支守門的 hook 搬到 Codex，回傳格式要先對過文件，不然它可能安靜地失效。這和前面 Seedguard、Promise Keeper 補的是同一種坑。

**二、Claude Code 把一部分保證放在 hook 外面。** 它的 deny 與 ask 規則不管 hook 回什麼都會檢查，hook 改寫過的參數也要再檢查一次；規劃模式也是權限系統的一部分，hook 說 allow 也改不了檔。[[26]](https://code.claude.com/docs/en/permissions) Hermes 這屆的作品，有不少是在插件層補這種「平台級的鎖」。Plan Mode 對 Hermes 的意義，大約就是 Claude Code 內建規劃模式的位置。

**三、兩家官方文件和第一名的作者，講的是同一句話：這不是沙盒。** Claude Code 說 Bash 規則不是程式的安全邊界，Codex 說 hook 不是完整的強制邊界，Foreman 的 README 開頭就說它擋的是 AI 公開走的捷徑，不是會藏指令的 agent。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md) 平台方和得獎者在這點上看法一致，是全篇我最有把握的結論。

**四、每一家的關口都有照不到的路。** 不只 Hermes。Codex 文件寫，它的工具 hook 涵蓋終端機指令、改檔、MCP 與其他本機工具，但網頁搜尋這類由服務端執行的工具不在範圍內，而且有些特殊的工具路徑可能跳過預設的 hook。[[27]](https://learn.chatgpt.com/docs/hooks) 不管用哪一家，都該自己列一次「我的 hook 看不到什麼」。

對實際在跑 agent 的人，這屆的做法可以這樣換算：

- **「合併只能由人」**：Claude Code 用 deny 規則，因為 deny 與 ask 規則不管 hook 回什麼都會檢查。[[26]](https://code.claude.com/docs/en/permissions) 但規則比對的是指令文字，所以和 Foreman 一樣，要搭配 GitHub 分支保護。
- **「規劃期間不准改檔」**：Claude Code 用內建的規劃模式，Codex 用唯讀的沙盒模式。[[28]](https://learn.chatgpt.com/docs/agent-approvals-security) 兩家都不必自己寫 hook。
- **「這類指令先問我」**：Claude Code 的 hook 可以回 ask。Codex 的 PreToolUse 目前不支援 ask，要改成直接擋，或接 `PermissionRequest` hook。[[27]](https://learn.chatgpt.com/docs/hooks)
- **「檢查沒過不准收工」**：Claude Code 用 `Stop` hook 擋；Hermes 用 `pre_verify`，預設每輪最多催 3 次。Codex 的 `Stop` hook 可以回一段理由，Codex 會把它當成新的使用者指示接著做。[[27]](https://learn.chatgpt.com/docs/hooks)

還有一個對搬家有用的細節：Hermes 用腳本寫的 hook，也接受 Claude Code 相容的回傳格式，退出碼 2 同樣代表擋下。[[12]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L2046-L2076) 寫過 Claude Code hook 的人，有一部分可以直接沿用。

我的結論：用 Claude Code 或 Codex 的人，這屆最該抄的不是哪一支插件，是三個習慣。出錯時的行為自己寫死；核准這個動作不交到 AI 手上；把擋不到的路寫出來。

## 它們會在哪裡失效，哪一種最該先補 {#limits}

這一節是讀完十個 README 和關鍵程式後，我覺得真正要記住的邊界。分五類。

先講排序。我的判準只有一個：**失效的時候，你會不會知道。** 照這個判準，最該先補的是第 1 類，因為指令走了關口看不到的路，插件不會有任何反應，你會以為保護還在。其次是第 4 類，因為它失效時畫面上是綠燈。第 3 類只在你裝了兩支以上才會發生，裝之前查得到。第 5 類是慢慢發生的，你至少會感覺到煩。最不急的是第 2 類：作者列得最清楚，分支保護和 CI 也接得住。

這個排序有前提：agent 只是想抄捷徑。如果你防的是被注入指令、會刻意藏動作的 agent，第 2 類要排到最前面，而且解法是沙盒，不是再疊更多關口。

**1. 走不進關口的路。** Plan Mode 作者列出 Hermes 的 Codex 執行環境、TUI 的 `/background` 與 `btw` 側邊 agent，都不經過它的關口。[[5]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L754-L760) Hermes 官方文件只寫了 Codex 的指令與改檔是原生執行、不經 Hermes，沒有明文說關口不觸發；兩者說法相容，但目前是作者自述。Seedguard 的漏洞則確定在平台：Hermes 原始碼寫明輔助模型呼叫（產生標題、壓縮對話）的 hook 只能旁觀，回傳值被忽略。[[11]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/agent/auxiliary_hooks.py#L7-L10) 所以在終端機裡打進去的祕密，仍可能被拿去產生標題；從聊天 App 傳進來的，會在存檔前先遮掉。[[35]](https://github.com/Investorquab/Seedguard/blob/889dcb03308571a7a39af050bfacf7518d2d6fce/README.md#L213-L214)

**2. 指令換個寫法。** Foreman 作者自己列出擋不到的寫法：`gh api` 直接打合併 API、`gh pr review --approve`、直接推到主分支、alias、腳本、`g\it`、`$G commit`、`xargs gh`。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md) 所以它要求你同時在 GitHub 開分支保護與必要檢查。Mandate 能擋下大部分怪寫法，因為它把看不懂的東西都當黑箱，但它也承認只看參數、看不到程式跑起來做了什麼。[[8]](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/README.md)

幾個比較少人提的細節。Foreman 的作者寫，AI 可以用一行 git 指令改掉本機記錄的主線位置，縮小被檢查的範圍；Foreman 自己的審查結果是一般檔案，AI 如果繞過文字比對去寫它，有機會偽造一筆「通過」。作者的結論是：這層防護是盡力而為，真正獨立的是 CI 的必要檢查。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md) Mandate 也有一個已知缺口：規則學到 `grep -c` 之後，不會檢查 grep 讀的是哪個檔，所以 `grep -c K .env` 會通過。[[7]](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/bench/README.md) Plan Mode 核准後的「不准 commit」，前面提過，作者的測試紀錄裡漏了 3 次。

**3. 一起裝，可能互相抵消。** 這是我覺得最少人注意的地方：

- Plan Mode 與 Promise Keeper 都寫了：別的插件回傳的 `modify` 改寫，會在它們檢查之後才套用。[[5]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L762) [[15]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/README.md#L39) 也就是說，一個會改寫指令的插件，可能讓守門插件檢查到的，不是最後真正執行的那一份。
- safe-swap 把 `rm -r` 改寫成搬移之後，那行指令就不再命中 Hermes 原本的「遞迴刪除要核准」規則。README 自己寫了這件事。[[13]](https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/README.md) 檔案可以救回來，所以作者覺得合理；但你少看到一次核准視窗。
- Ariadne 重播時工具不會真的執行，所以 `pre_tool_call` 這類 hook 在重播中不會觸發。[[21]](https://github.com/miracle352/hermes-ariadne/blob/128c95967a0761ad24d3d224441d1502c43bbb69/README.md) 它能告訴你升級後 Hermes 送出的請求有沒有變，但驗不到 Foreman、Mandate 這些護欄還擋不擋得住。

<figure>
  <a href="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/check-order.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="hermes-hackathon" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/check-order-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/check-order.svg' | relative_url }}" alt="流程圖：模型送出 rm -r build 後依序經過四步。第一步守門插件檢查，看到原始指令；第二步套用另一個插件的改寫；第三步 Hermes 內建核准規則，看到改寫後的指令；第四步工具執行。缺口 A：守門插件沒看到最後版本，Plan Mode 與 Promise Keeper 的 README 都列了這一點。缺口 B：內建規則沒看到原始指令，safe-swap 把 rm -r 改成搬移後，不再命中遞迴刪除要核准的規則" width="840" height="384"></picture>
  </a>
  <figcaption>自製圖解。四步的先後順序，是我把 Plan Mode<a href="https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L762">[5]</a>、Promise Keeper<a href="https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/README.md#L39">[15]</a>、safe-swap<a href="https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/README.md">[13]</a> 三位作者的自述拼起來的，我沒有重跑。</figcaption>
</figure>

這一類的麻煩在於，每一支插件單獨看都沒有錯。出問題的是組合，而組合通常不在單一作者的測試範圍裡。

**4. 證據本身是 AI 寫的。** 這屆最常被稱讚的「用真實證據」，也有限制：

- Canvas 盒子的檢查指令是 AI 畫計畫時自己填的。退出碼是真的，但那條檢查查不查得到東西，是模型選的。這是我讀程式的推論，repo 裡沒看到限制檢查內容的機制。人可以在畫布上改盒子，這是補救的地方。另外，AI 用程式執行工具寫出來的檔案，Canvas 事後看不到，程式註解自己寫了這一點。
- Canvas 用 `pre_verify` 不讓 AI 在盒子失敗時收工，但 Hermes 預設每輪最多只催 3 次，之後放行。[[22]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/hermes_cli/config_defaults.py#L203-L204) 這是刻意設計，避免 hook 把迴圈卡死，但它不是絕對保證。
- Mandate 的規則是從實際執行學來的。作者提醒：如果觀察的那幾次已經被入侵，學到的規則會把壞行為也一起放行。[[8]](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/README.md) 還有一點 README 沒有討論：觀察期的 agent，能不能自己去下核准規則的指令。我讀程式時沒看到明確擋下這件事的規則；這只是讀程式留下的疑問，我沒有驗證，不能當成已證實的漏洞。

**5. 擋太多，最後被關掉。** 這一類不會出現在任何「已知限制」清單，因為它不算漏洞。前面的數字已經看到代價：Plan Mode 的端到端耗時是對照組的 1.61 倍與 1.82 倍[[5]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md)；Mandate 在作者的重播裡，每一千多次合法呼叫誤擋數十次[[7]](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/bench/README.md)；safe-swap 的隔離區不會自己清，只會越來越大。[[13]](https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/README.md) 我的判斷是，護欄在真實環境裡很常見的一種失效，是使用者嫌慢、嫌煩，把它關掉，或把核准改成一律允許。這屆沒有任何作品量過這件事，所以這句只是判斷，不是數據。

還有一個小插曲。Ariadne 作者說他用自己的工具，找到「回覆被截斷時 hook 會默默跳過」並送了修補。查原始 issue，實際範圍更窄：是 `post_api_request` 這一個 hook，在回覆因長度截斷、接著自動續寫的那條路徑上不觸發。issue 和修補 PR 截至今天都還沒合併。[[29]](https://github.com/NousResearch/hermes-agent/issues/150324) 發現是真的，只是不能寫成「已修好」。

## 如果是我，會這樣裝 {#start}

這不是採購建議，是讀完程式後的優先順序。前提是你已經讓 agent 碰 git、排程或祕密。

裝任何一支護欄之前，先拿三個問題問它的 README。答不出來的，先不要裝在重要的地方。

- **它讀什麼？** 工具名稱、指令文字、參數，還是留下來的結果。這決定了換個寫法騙不騙得過。
- **它看不懂、或自己出錯時怎麼做？** 擋、問人，還是放行。
- **誰能關掉它、誰能按核准？** 如果答案包含 AI 自己，那一關就不算數。

然後照這個順序做：

1. **先開平台層的鎖，再裝插件。** GitHub 主分支保護、CI 必要檢查、排程工作的 `cron_mode: deny`（Hermes 預設就是這個值）。[[24]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/security.md) 順手檢查你的「一律允許」清單：文件寫，清單裡的規則在無人值守時照樣會執行。Foreman 自己都說，真正獨立的關卡是 CI。
2. **有無人值守的排程，Mandate 類的最小權限最值得做。** 觀察期在乾淨環境跑，而且多跑幾次：作者的重播裡，觀察 5 次的誤擋明顯少於 3 次。規則書自己讀過再核准，特別看寫入路徑對不對，不要學它的評測腳本自動按。
3. **把你說過兩次以上的「不要碰」，變成 Promise Keeper 那種規則。** 用 Claude Code 的人，對應的是 deny 規則加 PreToolUse hook。提示詞裡那一句可以留著，它讓模型少撞牆，但不要只靠它。
4. **祕密會進對話的人，裝完 Seedguard 先跑它的檢查指令。** 作者說 `/seedguard doctor` 會偵測輔助模型呼叫這條漏路，並印出要改的設定。[[18]](https://x.com/Quabnation/status/2119574841057517629) 放行的時間設短，用完就讓它過期。
5. **safe-swap 當保險，不當護欄。** 它不會自己清隔離區，要定期手動清。
6. **裝兩個以上會改寫指令的插件前，先查順序。** 守門的檢查到的，要是最後真正執行的版本。查不出來，就不要把會改寫的和守門的裝在一起。
7. **Plan Mode 核准之後，不要指望它擋 commit。** 規劃期的鎖很牢，核准後那一條只是盡力而為。要擋，回到第 1 點的分支保護。
8. **自己寫 hook，就把出錯時的行為寫死。** Hermes 的 middleware 出錯會落回原始請求；Codex 的 hook 回了不支援的欄位，工具照樣執行。守線的 hook，每一條路徑都要明確回「擋」。
9. **升級 Hermes 之後，護欄要另外測。** Ariadne 的重播驗得到請求有沒有變，驗不到關口還擋不擋。挑一兩條你最在意的規則，升級後親手試一次。

最後回到開頭那句「不准合併 PR，要先問我」。

這屆前 10 名示範的，是把這句話從對話裡拿出來，放到不靠模型記得的地方。它們也一起示範了另一件事：放到那裡之後，你還是得知道那個地方管不到什麼。**提示詞是請求，關口是規則，沙盒和分支保護才是牆。** 三層各做各的事，少了哪一層，都別以為另外兩層會補上。

---

## 參考資料

GitHub 連結都固定在查核當下的 commit 版本。示範貼文與 README 中的數字皆為作者自述，本文沒有重跑任何測試。資料查核日：2026-11-21。

- **[1]** [Nous Research：Hermes Agent Plugin Hackathon 開跑公告（X，2026-11-04）](https://x.com/NousResearch/status/2118094256438936062)
- **[2]** [Nous Research：Hermes Agent Plugin Hackathon 得獎公告與前 10 名串文（X，2026-11-20）](https://x.com/NousResearch/status/2123882430620733742)
- **[3]** [Foreman：plugin README（PedValme/foreman）](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md)
- **[4]** [Foreman：gate.py，自行合併一律擋下的程式段](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/foreman/gate.py#L1116-L1119)
- **[5]** [Plan Mode：README，含與 Codex plan mode 的對照測試與已知限制（100yenadmin/hermes-plan-mode）](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md)
- **[6]** [Eva（@ElectricSheepIO）：Plan Mode 示範貼文（X，2026-11-09）](https://x.com/ElectricSheepIO/status/2119788419924570130)
- **[7]** [Mandate：bench README，攻擊測試與重播方法（JoeProAI/mandate）](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/bench/README.md)
- **[8]** [Mandate：README，威脅模型與已知限制](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/README.md)
- **[9]** [Seedguard：hooks.py，遮罩出錯時改送空白請求（Investorquab/Seedguard）](https://github.com/Investorquab/Seedguard/blob/889dcb03308571a7a39af050bfacf7518d2d6fce/hooks.py#L195-L210)
- **[10]** [Seedguard：TESTING.md，各次測試紀錄](https://github.com/Investorquab/Seedguard/blob/889dcb03308571a7a39af050bfacf7518d2d6fce/TESTING.md)
- **[11]** [Hermes Agent 原始碼：auxiliary_hooks.py，輔助模型呼叫的 hook 只能旁觀](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/agent/auxiliary_hooks.py#L7-L10)
- **[12]** [Hermes Agent 官方文件：Event Hooks](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md)
- **[13]** [safe-swap：README（itsolaph/hermes-safe-swap）](https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/README.md)
- **[14]** [safe-swap：shellscan.py，看不懂就放棄改寫的掃描器](https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/shellscan.py#L1-L7)
- **[15]** [Promise Keeper：README（MokiMeow/promise-keeper）](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/README.md)
- **[16]** [Promise Keeper：__init__.py，執行前最後一關與出錯即擋](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/__init__.py#L202-L221)
- **[17]** [Hermes Canvas：binding.py，檢查指令必須一字不差才算數（0xbyt4/hermes-canvas）](https://github.com/0xbyt4/hermes-canvas/blob/d6eeff0d6f7ec653262537bdd7bb001cc6d3c7f8/canvas/binding.py#L369-L378)
- **[18]** [Quabnation：Seedguard 示範貼文（X，2026-11-08）](https://x.com/Quabnation/status/2119574841057517629)
- **[19]** [Housemate：CLAIMS.md，每個數字的條件與重現方式（RaYYeR220/housemate）](https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/CLAIMS.md)
- **[20]** [Housemate：core/answers.py，口頭核准聽不清楚就不算](https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/core/answers.py#L1-L15)
- **[21]** [Ariadne：README（miracle352/hermes-ariadne）](https://github.com/miracle352/hermes-ariadne/blob/128c95967a0761ad24d3d224441d1502c43bbb69/README.md)
- **[22]** [Hermes Agent 原始碼：config_defaults.py，max_verify_nudges 預設 3](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/hermes_cli/config_defaults.py#L203-L204)
- **[23]** [Hermes Gadget SDK：Hermes 整合文件（Adolanium/hermes-gadget-sdk）](https://github.com/Adolanium/hermes-gadget-sdk/blob/35dbae77f21c54519dde7fcd90ef5a92192c6f60/docs/hermes-integration.md)
- **[24]** [Hermes Agent 官方文件：Security（核准逾時與 cron_mode）](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/security.md)
- **[25]** [Claude Code 官方文件：Hooks reference](https://code.claude.com/docs/en/hooks)
- **[26]** [Claude Code 官方文件：Configure permissions](https://code.claude.com/docs/en/permissions)
- **[27]** [OpenAI Codex 官方文件：Hooks](https://learn.chatgpt.com/docs/hooks)
- **[28]** [OpenAI Codex 官方文件：Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security)
- **[29]** [Hermes Agent issue #150324：post_api_request never fires for a reply cut off with finish_reason=length](https://github.com/NousResearch/hermes-agent/issues/150324)
- **[30]** [safe-swap：runtime.py，改寫發生在工具關口，出錯一律放行](https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/runtime.py#L150-L176)
- **[31]** [Plan Mode：plugin.py，給 AI 的工具沒有「核准」這個動作](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/plan_mode/plugin.py#L83)
- **[32]** [Promise Keeper：rules.py，擋不擋由固定程式判斷](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/promise_keeper/rules.py#L1)
- **[33]** [Promise Keeper：detect.py，白話規則先存成提案](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/promise_keeper/detect.py#L1-L6)
- **[34]** [Eva（@ElectricSheepIO）：Plan Mode 補充說明與安裝指令（X，2026-11-09）](https://x.com/ElectricSheepIO/status/2119788823911571787)
- **[35]** [Seedguard：README，已知限制](https://github.com/Investorquab/Seedguard/blob/889dcb03308571a7a39af050bfacf7518d2d6fce/README.md#L213-L214)

想看更多 agent 權限與驗證的文章，可以接著讀[〈可上線的 AI Agent，不是更會自主〉]({{ '/technical/production-ai-agent-control-planes/' | relative_url }})，或從 [Agentic Engineering 系列]({{ '/technical/agentic-engineering/' | relative_url }})挑一篇開始。

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
