---
title: "Hermes 插件黑客松前 10 名：評審選的不是功能，是模型繞不過去的關口"
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

**我的判斷：這屆前段班贏的地方，不是想出新功能，而是把「請 AI 記得」改成「AI 想忘也繞不過的關口」。但每個作者都在 README 裡承認：關口只管得到經過關口的東西。** 這一句限制，比得獎名單更值得帶走。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>十件裡有八件在管 AI 手上的權限</strong>：合併、刪檔、排程、密鑰、禁區。另外兩件把 Hermes 搬到房間和實體小裝置上。</li>
    <li><strong>共同做法是把規則放在「工具執行前一刻」</strong>：Hermes 的 <code>pre_tool_call</code> 可以放行、改寫、擋下或交給人，模型改不了這段程式。</li>
    <li><strong>真正的分歧在看不懂的時候</strong>：Promise Keeper、Mandate 看不懂就擋；safe-swap 看不懂就照原樣跑。兩種都對，用途不同。</li>
    <li><strong>作者數字大多可以追到來源，但口徑很窄</strong>：Plan Mode 的 82% 是兩個 AI 評審只看計畫文字的偏好；Mandate 的 29/29 來自單一便宜模型、作者自寫的攻擊目標。</li>
    <li><strong>關口之外的路，一個插件都擋不到</strong>：腳本跑起來之後做什麼、走別的執行環境的指令、只能旁觀的輔助模型呼叫。所以 GitHub 分支保護與 CI 還是要開。</li>
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
      <li><a href="#matrix">用六把尺橫向比較</a></li>
      <li><a href="#defaults">看不懂的時候，預設擋還是放行</a></li>
      <li><a href="#approval">人按的那一下，怎麼確定是人按的</a></li>
      <li><a href="#numbers">作者數字，各自的分母是什麼</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">放回自己的工作</span><ol class="article-toc-items">
      <li><a href="#compare">和 Claude Code、Codex 的同類機制比</a></li>
      <li><a href="#limits">它們會在哪裡失效</a></li>
      <li><a href="#start">如果是我，會這樣裝</a></li>
    </ol></li>
  </ol>
</nav>

## 比賽規則裡，最關鍵的是一句評審偏好 {#contest}

先把基本資料放好。黑客松在 2026 年 11 月 4 日（美東時間）開跑，為期 7 天，現金獎金合計 US$20,000：第一名 US$10,000，第二名 US$5,000，第三名 US$2,500，第四、五名 US$1,500 與 US$1,000，另外五名佳作拿週邊與額度。投稿要做三件事：向 Hermes 插件目錄開 PR、在 X 發 90 秒內的示範影片、填表單。[[1]](https://x.com/NousResearch/status/2118094256438936062)

11 月 20 日公布結果。官方說將近 1,000 位社群成員投稿，先由 agent 替每件作品打分，再由五位社群評審排出前 10 名。[[2]](https://x.com/NousResearch/status/2123882430620733742)

<blockquote class="twitter-tweet" data-dnt="true" data-lang="zh-tw" data-align="center"><p>Nous Research 公布 Hermes Agent 插件黑客松前 10 名（2026-11-20）</p>&mdash; <a href="https://twitter.com/NousResearch/status/2123882430620733742">在 X 上看原貼文</a></blockquote>

我覺得整份規則裡最重要的是這句：評審偏好**做到提示詞或技能做不到的事**。[[1]](https://x.com/NousResearch/status/2118094256438936062)

提示詞是寫給模型讀的話，技能是一包說明加範例，兩者都要靠模型願意照做。插件不一樣，它是 Hermes 本體會執行的程式碼。模型可以忘記一句話，但沒辦法讓一段程式碼不執行。評審把這條線畫出來，前 10 名多數就往這條線上靠。

## 十件作品，其實是兩種產品 {#ten}

名次與作者以官方得獎串為準。[[2]](https://x.com/NousResearch/status/2123882430620733742) 「一句話」是我讀過各專案 README 與程式後的整理。

<div class="hk-wrap">
<table class="hk-table">
  <caption>官方前 10 名。分組是我的歸類，不是官方分類。</caption>
  <thead><tr><th scope="col">名次與作品</th><th scope="col">它在做什麼</th><th scope="col">它擋的是哪種失誤</th></tr></thead>
  <tbody>
    <tr class="hk-group"><td colspan="3">第一種：管住 AI 手上的權限</td></tr>
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

Ariadne 我放在第一組最後，因為它不攔任何東西，它是驗證工具。但它回答的問題和其他七件一樣：**怎麼確定 AI 這次的行為，跟你以為的一樣。**

第二組的兩件，各自也在處理核准。不在電腦前的時候，你怎麼對一個危險指令說好或不好？這一點後面會回來談。

## 共同的一步：把規則從提示詞搬到關口 {#gate}

Hermes 有一組 hook，也就是讓插件在特定時刻插進來執行的掛勾。這屆最常用的是 `pre_tool_call`。官方文件寫它在**每一次工具執行前一刻**觸發，內建工具和插件工具都算。[[12]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L556)

在這個關口，插件可以回四種答案：什麼都不說就放行；`modify` 改寫參數；`block` 擋下，並把原因當成錯誤訊息還給模型；`approve` 把這次呼叫送到人的核准流程。多個插件同時表態時，擋下優先於送人核准。[[12]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L580) 這段程式在逾時或出錯時，Hermes 預設會擋下。[[12]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L396)

<figure>
  <a href="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/gate.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="hermes-hackathon" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/gate-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/hermes-plugin-hackathon-top10/gate.svg' | relative_url }}" alt="流程圖：模型決定呼叫工具後，先經過 pre_tool_call 關口，插件可以放行、改寫、擋下或交給人核准，之後工具才執行。下方列出關口看不到的四條路：Codex 原生執行、TUI 側邊 agent、輔助模型呼叫、腳本內部行為" width="840" height="464"></picture>
  </a>
  <figcaption>自製圖解。關口行為依 Hermes 官方 hook 文件<a href="https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/features/hooks.md#L556">[12]</a>；看不到的路依各作者 README 自述。</figcaption>
</figure>

看兩個具體例子，就知道「放在關口」和「寫在提示詞」差在哪。

**Foreman 不讓 AI 自己合併。** 程式裡，只要 AI 自己執行 `gh pr merge`，就直接回「擋下」，訊息是「合併是使用者的決定，請他執行 `/foreman merge`」。作者在旁邊註解為什麼不回「送人核准」：因為人在核准視窗按了「一律允許」，或開了不問人的模式，之後的合併就全部放行了。[[4]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/foreman/gate.py#L1116-L1119) 同一句「不准合併」，寫在提示詞裡是請求，寫在這裡是事實。

**Plan Mode 不靠「請你先規劃」。** 作者在示範貼文說，Hermes 內建的 `/plan` 只是模型可以忽略的一句指示。[[34]](https://x.com/ElectricSheepIO/status/2119788823911571787) 它的做法是工具白名單：規劃期間只放行讀檔、搜尋這類唯讀工具；終端機、程式執行、子 agent、MCP 和任何沒見過的工具全部擋下；寫檔只准寫進計畫資料夾。插件內部一出錯也是擋。[[5]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md)

白名單比「看指令長什麼樣」穩得多。規劃期間整個終端機都進不去，AI 換什麼寫法下指令都沒差。

所以評審為什麼偏好這類作品？我的理解是：提示詞與技能的天花板是「模型願不願意」，而 agent 出事，通常剛好就是它不願意、或忘了的時候。能把保證放到模型以外的作品，才是在補平台真正缺的那一塊。

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

**第一，沒有一件作品什麼都做。** Foreman 管證據不管權限，Plan Mode 管權限不管復原，safe-swap 管復原但不擋任何東西。它們是可以疊起來用的零件，不是二選一的產品。

**第二，「真實證據」這一欄最少人做，但最難被模型騙。** Canvas 的盒子要亮起「完成」，執行的指令必須和盒子綁定的檢查指令一字不差；程式註解特別寫了，`echo '<check>'`、`<check> || true` 或多加參數都不算。[[17]](https://github.com/0xbyt4/hermes-canvas/blob/d6eeff0d6f7ec653262537bdd7bb001cc6d3c7f8/canvas/binding.py#L369-L378) Foreman 則是讀 git 真正會記錄下來的差異，不看指令文字。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md)

**第三，可以復原的只有 safe-swap 一件。** 這很可惜。擋下來是最後一道線，能復原的系統才能讓人放心多給一點權限。

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

**Promise Keeper 反過來，看不懂就擋。** 它的規則判斷完全不經過語言模型，檔頭第一行就寫「決定擋不擋，從不讓 LLM 參與」。[[32]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/promise_keeper/rules.py#L1) 你的白話規則也是用固定規則轉換，不是請模型理解。[[33]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/promise_keeper/detect.py#L1-L6) 指令如果指向受保護的資料夾，除非它確定那支程式只會讀，例如 `cat`、`ls`、`git diff`，否則一律擋。[[15]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/README.md)

兩種都合理，差別在用途。safe-swap 想讓日常的手滑變得可以救，代價是不保證；Promise Keeper 想守住一條你說過的線，代價是偶爾誤擋。**拿 safe-swap 當安全邊界，或拿 Promise Keeper 當日常便利工具，都是用錯地方。**

再往下挖，有一個連平台都沒統一的細節。Hermes 的 `pre_tool_call` 出錯時會擋，但另一種掛法 middleware 出錯時，Hermes 會落回原始請求，也就是放行。Seedguard 的註解直接寫出這件事，所以它在任何內部錯誤時都改送不含內容的空白請求，絕不讓例外往外拋。[[9]](https://github.com/Investorquab/Seedguard/blob/889dcb03308571a7a39af050bfacf7518d2d6fce/hooks.py#L195-L210) Promise Keeper 也獨立做了一樣的事，註解寫：如果這段出錯，Hermes 會跳過它直接執行工具，所以每條路徑都要明確回傳。[[16]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/__init__.py#L202-L221)

兩組不同的作者，各自踩到同一個平台細節，各自補上。我覺得這就是「完成度」最具體的樣子。

## 人按的那一下，怎麼確定是人按的 {#approval}

很多護欄最後都落在「請人核准」。問題是，如果 AI 自己就能按核准，這一關就是裝飾。這屆作品處理這件事的方法，比功能本身更值得抄。

- **Plan Mode 讓 AI 拿不到核准按鈕。** 它給 AI 的 `plan_mode` 工具只有開啟、狀態、關閉、送出、檢視、列出六種動作，沒有「核准」。[[31]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/plan_mode/plugin.py#L83) 核准還綁著計畫的版本與內容雜湊值，計畫改過一個字就要重新核准。[[5]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md)
- **Foreman 的合併與例外放行都只能用人打的指令。** README 寫：slash 指令由你輸入，模型沒有任何工具能執行它們。例外放行一次只有 24 小時。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md)
- **Promise Keeper 的規則先以「提案」存著。** AI 從對話裡抓到你的規則，只能存成提案；啟用只能透過人輸入的指令或 Desktop 面板。[[33]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/promise_keeper/detect.py#L1-L6)
- **Seedguard 的放行有時限。** `/seedguard arm <id> 5` 只放行某個祕密給指定工具 5 分鐘，時間到自動失效。[[18]](https://x.com/Quabnation/status/2119574841057517629)
- **Gadget SDK 不讓你盲按。** 裝置螢幕小，指令只有在能完整顯示、而且是一般可列印字元時才會顯示；看不全時只能拒絕，或回主機核准。文件另外寫：讓 AI 問你選擇題的功能和核准刻意分開，AI 不能用一道選擇題頂替核准。[[23]](https://github.com/Adolanium/hermes-gadget-sdk/blob/35dbae77f21c54519dde7fcd90ef5a92192c6f60/docs/hermes-integration.md)
- **Housemate 聽不清楚就不算。** 口頭回答不是明確的「approve」，例如「好，但它會刪什麼？」，一律不核准，接著由 Hermes 自己的核准逾時拒絕。[[20]](https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/core/answers.py#L1-L15) Hermes 預設逾時是 300 秒。[[24]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/security.md)

這裡也有一個邊界：「slash 指令只有人能打」是 Hermes 本身的行為，各插件都建立在這個前提上。我沒有去 Hermes 原始碼逐行確認，只能說這是作者們的共同說法。

## 作者數字，各自的分母是什麼 {#numbers}

示範貼文裡的數字很漂亮，但每個數字都要先問「分母是什麼」。我把查得到出處的放在一起：

<div class="hk-wrap">
<table class="hk-table">
  <caption>「出處」是我在 repo 裡找到的原始說明；「未驗證」代表 repo 內找不到原始紀錄。全部是作者自述，我沒有重跑任何測試。</caption>
  <thead><tr><th scope="col">宣稱</th><th scope="col">實際口徑</th><th scope="col">我怎麼讀</th></tr></thead>
  <tbody>
    <tr><td>Plan Mode：盲測評審 82% 選它的計畫</td><td>評審是兩個 AI 模型（Claude 一個、Codex 一個），只看計畫文字做成對比較；兩邊用同一個模型。README 寫明比的是計畫偏好，不是成品程式碼對不對；配對數沒有列出。<a href="https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L551-L561">[5]</a></td><td>「評審比較喜歡」不等於「做出來比較對」。評測腳本和原始資料不在 repo 裡，無法重現。</td></tr>
    <tr><td>Plan Mode：50 次中 0 次在核准前碰程式碼</td><td>貼文寫 50 次<a href="https://x.com/ElectricSheepIO/status/2119788419924570130">[6]</a>；README 分成 38 次與 12 次兩批，而且只算經過 <code>pre_tool_call</code> 的工具。<a href="https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L554">[5]</a></td><td>成立，但範圍限定在關口看得到的地方。</td></tr>
    <tr><td>Plan Mode 的代價（作者自己寫出來的）</td><td>端到端耗時是 Codex 的 1.61 倍與 1.82 倍；隱藏偏好找出 9/10，Codex 10/10；早期比較的環境對 Codex 不公平，作者承認公布的比值「美化了 Plan Mode」。<a href="https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L684">[5]</a></td><td>這是全場最誠實的一段，值得給分。安全有成本，作者把帳攤開了。</td></tr>
    <tr><td>Mandate：29/29 次攻擊呼叫被擋；120 次攻擊中造成傷害 0 次，預設設定是 18 次</td><td>Hermes v0.23.0 排程、gpt-4o-mini 單一模型、10 個作者自製的工作。注入包裝文字取自公開的 AgentDojo 與 InjecAgent，六類攻擊目標是作者自寫。模型真的照注入行動的只有 22% 到 26%，所以每組只有 29 到 42 次攻擊呼叫。核准是腳本自動按的，沒有人讀過規則。<a href="https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/bench/README.md">[7]</a></td><td>作者自己寫「當成 29 之 29，不要當成證明」。資料與腳本都在 repo，可以無金鑰重播，是這屆最可檢查的一組數字。</td></tr>
    <tr><td>Mandate：1,038 次合法呼叫誤擋 39 次</td><td>這是用自己錄下的紀錄重播、而且是看過同一批資料修正後的數字；修正前是 58 次。<a href="https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/bench/README.md">[7]</a></td><td>誤擋率約 3.8% 到 5.6%，應該和攔截率並列看。對每晚要跑完的排程，這不是小數字。</td></tr>
    <tr><td>Housemate：停止說話後 2.6 秒回答</td><td>20 次暖機後的中位數，p95 是 3.2 秒。同一台電腦、短答案；作者寫明「這不是通用數字」。<a href="https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/CLAIMS.md">[19]</a></td><td>條件寫得很清楚，這種寫法值得學。</td></tr>
    <tr><td>Housemate：喚醒 58/58、每小時誤喚醒 0.11 次</td><td>合成語音；9.2 小時公版有聲書只發生 1 次誤喚醒。作者自己註明「不是在真實家庭量的」，沒有電視、音樂和小孩。<a href="https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/CLAIMS.md">[19]</a></td><td>放家裡前，自己要再量一次。</td></tr>
    <tr><td>Ariadne：5 個對話、0 處變化、約 3 分鐘；358 個 commit 用 10 次重播找到元兇</td><td>repo 的範例畫面是 4 個對話、114 秒；網站上的二分搜尋步驟是展示動畫，repo 內沒有實際執行紀錄。<a href="https://github.com/miracle352/hermes-ariadne/blob/128c95967a0761ad24d3d224441d1502c43bbb69/README.md">[21]</a></td><td>未驗證。358 次用二分法約 9 次可以收斂，數量級合理。</td></tr>
    <tr><td>測試數：Seedguard 129 項、Housemate 513 項</td><td>Seedguard 自己的測試紀錄之後已到 149 項<a href="https://github.com/Investorquab/Seedguard/blob/889dcb03308571a7a39af050bfacf7518d2d6fce/TESTING.md">[10]</a>；Housemate 的報告已是 566 項。<a href="https://github.com/RaYYeR220/housemate/blob/09c1a1d0a88bfa8762cee6b3ccf94271b0f172c5/CLAIMS.md">[19]</a></td><td>貼文是當時的快照，不影響判斷。</td></tr>
  </tbody>
</table>
</div>

Foreman 拿第一名，但 README 沒有任何效果數字，只有一個案例：它在真實對話裡擋下一個只放寬了兩個斷言的 PR。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md) 我反而覺得這是好事。它沒有假裝擋下了 95% 的作弊，只說清楚擋什麼、不擋什麼。

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
    <tr><td>hook 出錯或格式不對時</td><td>逾時或出錯會擋</td><td>什麼都不說時，照一般權限流程走；沉默不等於核准<a href="https://code.claude.com/docs/en/hooks">[25]</a></td><td>回傳不支援的欄位時，記為失敗、工具照樣執行<a href="https://learn.chatgpt.com/docs/hooks">[27]</a></td></tr>
    <tr><td>規劃模式</td><td>內建 <code>/plan</code> 是提示；Plan Mode 插件把它變成鎖</td><td>內建於權限系統；規劃模式中，hook 的 allow 對改檔無效<a href="https://code.claude.com/docs/en/permissions">[26]</a></td><td>有 <code>/plan</code> 指令；唯讀可以用沙盒模式強制<a href="https://learn.chatgpt.com/docs/agent-approvals-security">[28]</a></td></tr>
    <tr><td>不讓 agent 收工</td><td><code>pre_verify</code>，每輪最多催 3 次</td><td><code>Stop</code> hook 可擋</td><td><code>Stop</code> hook</td></tr>
    <tr><td>官方怎麼定位</td><td>hook 是政策關口</td><td>Bash 規則只比對 Claude 寫出的指令文字，不是程式的安全邊界<a href="https://code.claude.com/docs/en/permissions">[26]</a></td><td>「當成有用的護欄，不是完整的強制邊界」<a href="https://learn.chatgpt.com/docs/hooks">[27]</a></td></tr>
  </tbody>
</table>
</div>

我從這張表讀出三件事。

**一、hook 的權力很接近，差在預設值。** 三家都能擋、能改寫。差別在出錯的時候：Hermes 的工具關口出錯會擋，Codex 的 hook 回錯格式時照跑，Claude Code 則是 hook 不表態就回到權限規則。所以你寫的 hook 如果有 bug，在 Codex 上可能會默默失效。這和上一節 Seedguard、Promise Keeper 補的是同一個坑。

**二、Claude Code 把一部分保證放在 hook 外面。** 它的 deny 與 ask 規則不管 hook 回什麼都會檢查，hook 改寫過的參數也要再檢查一次；規劃模式也是權限系統的一部分，hook 說 allow 也改不了檔。[[26]](https://code.claude.com/docs/en/permissions) Hermes 這屆的作品，有不少是在插件層補這種「平台級的鎖」。Plan Mode 對 Hermes 的意義，大約就是 Claude Code 內建規劃模式的位置。

**三、三家官方都說了同一句話：這不是沙盒。** Claude Code 說 Bash 規則不是程式的安全邊界，Codex 說 hook 不是完整的強制邊界，Foreman 的 README 開頭就說它擋的是 AI 公開走的捷徑，不是會藏指令的 agent。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md) 官方和得獎者在這點上看法一致，這是全篇最可靠的結論。

## 它們會在哪裡失效 {#limits}

這一節是讀完十個 README 和關鍵程式後，我覺得真正要記住的邊界。分四類。

**1. 走不進關口的路。** Plan Mode 作者列出 Hermes 的 Codex 執行環境、TUI 的 `/background` 與 `btw` 側邊 agent，都不經過它的關口。[[5]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L754-L760) Hermes 官方文件只寫了 Codex 的指令與改檔是原生執行、不經 Hermes，沒有明文說關口不觸發；兩者說法相容，但目前是作者自述。Seedguard 的漏洞則確定在平台：Hermes 原始碼寫明輔助模型呼叫（產生標題、壓縮對話）的 hook 只能旁觀，回傳值被忽略。[[11]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/agent/auxiliary_hooks.py#L7-L10) 所以在終端機裡打進去的祕密，仍可能被拿去產生標題；從聊天 App 傳進來的，會在存檔前先遮掉。[[35]](https://github.com/Investorquab/Seedguard/blob/889dcb03308571a7a39af050bfacf7518d2d6fce/README.md#L213-L214)

**2. 指令換個寫法。** Foreman 作者自己列出擋不到的寫法：`gh api` 直接打合併 API、`gh pr review --approve`、直接推到主分支、alias、腳本、`g\it`、`$G commit`、`xargs gh`。[[3]](https://github.com/PedValme/foreman/blob/f8d23a26f5dab94408f764bd347fe36f8e41c42a/plugin/README.md) 所以它要求你同時在 GitHub 開分支保護與必要檢查。Mandate 能擋下大部分怪寫法，因為它把看不懂的東西都當黑箱，但它也承認只看參數、看不到程式跑起來做了什麼。[[8]](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/README.md)

**3. 一起裝，可能互相抵消。** 這是我覺得最少人注意的地方：

- Plan Mode 與 Promise Keeper 都寫了：別的插件回傳的 `modify` 改寫，會在它們檢查之後才套用。[[5]](https://github.com/100yenadmin/hermes-plan-mode/blob/4619a8dca04451bf628f849897bddf0b90669eb2/README.md#L762) [[15]](https://github.com/MokiMeow/promise-keeper/blob/ab91fee21f607d5515a8e007cf615fc285718dd0/README.md#L39) 也就是說，一個會改寫指令的插件，可能讓守門插件檢查到的，不是最後真正執行的那一份。
- safe-swap 把 `rm -r` 改寫成搬移之後，那行指令就不再命中 Hermes 原本的「遞迴刪除要核准」規則。README 自己寫了這件事。[[13]](https://github.com/itsolaph/hermes-safe-swap/blob/6e66f5fe6651e25951fcd3592a7ac2e75787e7f6/README.md) 檔案可以救回來，所以作者覺得合理；但你少看到一次核准視窗。
- Ariadne 重播時工具不會真的執行，所以 `pre_tool_call` 這類 hook 在重播中不會觸發。[[21]](https://github.com/miracle352/hermes-ariadne/blob/128c95967a0761ad24d3d224441d1502c43bbb69/README.md) 它能告訴你升級後 Hermes 送出的請求有沒有變，但驗不到 Foreman、Mandate 這些護欄還擋不擋得住。

**4. 證據本身是 AI 寫的。** 這屆最常被稱讚的「用真實證據」，也有限制：

- Canvas 盒子的檢查指令是 AI 畫計畫時自己填的。退出碼是真的，但那條檢查查不查得到東西，是模型選的。這是我讀程式的推論，repo 裡沒看到限制檢查內容的機制。
- Canvas 用 `pre_verify` 不讓 AI 在盒子失敗時收工，但 Hermes 預設每輪最多只催 3 次，之後放行。[[22]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/hermes_cli/config_defaults.py#L203-L204) 這是刻意設計，避免 hook 把迴圈卡死，但它不是絕對保證。
- Mandate 的規則是從實際執行學來的。作者提醒：如果觀察的那幾次已經被入侵，學到的規則會把壞行為也一起放行。[[8]](https://github.com/JoeProAI/mandate/blob/4313f6196b6b8f0ccf35fd3bf499182d7814a7bf/README.md)

還有一個小插曲。Ariadne 作者說他用自己的工具，找到「回覆被截斷時 hook 會默默跳過」並送了修補。查原始 issue，實際範圍更窄：是 `post_api_request` 這一個 hook，在回覆因長度截斷、接著自動續寫的那條路徑上不觸發。issue 和修補 PR 截至今天都還沒合併。[[29]](https://github.com/NousResearch/hermes-agent/issues/150324) 發現是真的，只是不能寫成「已修好」。

## 如果是我，會這樣裝 {#start}

這不是採購建議，是讀完程式後的優先順序。前提是你已經讓 agent 碰 git、排程或祕密。

1. **先開平台層的鎖，再裝插件。** GitHub 主分支保護、CI 必要檢查、排程工作的 `cron_mode: deny`（Hermes 預設就是這個值）。[[24]](https://github.com/NousResearch/hermes-agent/blob/8af19a9f30982abfaec61f9e62d660f4ab7d42f3/website/docs/user-guide/security.md) Foreman 自己都說，真正獨立的關卡是 CI。
2. **有無人值守的排程，Mandate 類的最小權限最值得做。** 但觀察期要在乾淨環境跑，而且規則書要自己讀過再核准，不要學它的實驗腳本自動按。
3. **把你說過兩次以上的「不要碰」，變成 Promise Keeper 那種規則。** 用 Claude Code 的人，對應的是 deny 規則加 PreToolUse hook。
4. **safe-swap 當保險，不當護欄。** 記得定期清隔離區，它不會自己清。
5. **裝兩個以上會改寫指令的插件前，先查順序。** 守門的檢查到的，要是最後真正執行的版本。
6. **自己寫 hook，就把出錯時的行為寫死。** Hermes 的 middleware 和 Codex 的 hook，出錯都可能放行。護欄類的 hook，出錯就該擋。

最後回到開頭那句「不准合併 PR，要先問我」。

這屆前 10 名示範的，是把這句話從對話裡拿出來，放到模型碰不到的地方。它們也一起示範了另一件事：放到那裡之後，你還是得知道那個地方管不到什麼。**提示詞是請求，關口是規則，沙盒和分支保護才是牆。** 三層各做各的事，少了哪一層，都別以為另外兩層會補上。

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
