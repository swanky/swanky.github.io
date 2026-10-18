---
title: "pstack 六個指令，照一天的開發順序用一遍：從 /recall 到 /bro"
seo_title: "pstack 實用 Skill 教學：/recall、/tdd、/interrogate、/no-comments、/create-verification-skill、/bro 怎麼用"
date: 2026-10-18 15:00:00 +0800
published: true
categories: [technical]
tags: [ai-agent, agentic-engineering, pstack, claude-code, tdd, verification, poteto]
layout: article
use_glightbox: true
cover_image: /assets/img/linkedin/pstack-six-skills-workday.jpg
cover_alt: "晨光照進的開發工作室：戴眼鏡的 Lauren Tan 指著身後白板上三層方塊圖示、笑著轉頭說明，水手服品牌主角拿放大鏡湊近一盞亮紅燈的測試燈；桌上散著咖啡與工作日誌、一橘一藍兩台螢幕與四個分類托盤、剪刀與飄落的便利貼，右側是勾滿綠勾的清單板"
hero_image: true
cta_context: agentic
related_posts:
  - poteto-pstack-trust-before-scale
  - claude-code-kent-beck-tdd
  - matt-pocock-skills-ai-coding-workflow
description: "pstack 有 24 條原則、23 套流程、30 個 skill。照一天寫程式的順序，拆解六個單獨用也好用的指令：各自交出什麼證據，以及原始規格裡比影片更嚴格的地方。"
keywords: "pstack, poteto-mode, Lauren Tan, poteto, /recall, /tdd, /interrogate, /no-comments, /create-verification-skill, /bro, Claude Code, AI Coding, 驗證, 史旺基"
---

<p class="text-muted"><small>封面為人物與工作室的概念情境示意，非影片畫面或實際工作場所。</small></p>

一間虛構咖啡店的訂閱欄位。輸入 `abc@gmail`，少了 `.com`，畫面照樣跳出「訂閱成功」。

這是 P & H 頻道 10 月 17 日介紹 pstack 的影片裡，拿來示範修 bug 的題目。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=285s) 修法本身沒什麼好講，改一處驗證規則而已。我比較在意的是修之前那一步：AI 先寫一個測試、跑一次、親眼看它失敗，確定它真的抓得到這個 bug，才開始動程式。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=292s)

這一步很常被跳過。先改程式，再補一個「反正會過」的測試，回報上一樣寫著「測試通過」。

我自己網站的作業規則裡有一句：缺證據，就寫「已改、未驗」。pstack 做的事情很像，只是它把這種紀律拆成一個個可以直接呼叫的指令。

pstack 的整體思路，我在〈[Poteto 的 2,500 條 PR，真正值得學的是什麼？]({{ '/technical/poteto-pstack-trust-before-scale/' | relative_url }})〉寫過了。這篇不重講哲學，而是照一天寫程式的順序，把影片挑的六個指令一個一個打開，看它們各自規定「做完要交出什麼」。

**我的判斷是：這六個指令真正的價值，不在它們會做什麼，而在它們規定了完成時必須留下哪一種證據。**

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>pstack 是一個技能包</strong>：Lauren Tan 公開的 24 條原則、23 套工作流程與 30 個 skill，平常從 <code>/poteto-mode</code> 一個入口進去。</li>
    <li><strong>六個指令，六種證據</strong>：現況簡報、修前失敗與修後通過、四類審查判決、註解刪除清單、可重跑的驗收流程，以及一段白話重述。</li>
    <li><strong>原始規格比影片更克制</strong>：<code>/tdd</code> 規定沒有便宜的測試路徑就別硬寫；<code>/interrogate</code> 只給結論，不動程式。</li>
    <li><strong>Claude Code 可以直接用官方版</strong>：官方說明已寫好安裝指令；社群移植版另外支援 Codex、Copilot 等工具，但帶有自己的修改。</li>
    <li><strong>要我先試，我會挑 <code>/tdd</code> 和 <code>/create-verification-skill</code></strong>：導入前後的差別，最容易看得出來。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part"><span class="article-toc-part-title">先看懂結構</span><ol class="article-toc-items">
      <li><a href="#layers">原則、流程、技能：三層各管一件事</a></li>
      <li><a href="#day">一天的六個指令，各自交出什麼</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">逐一打開六個指令</span><ol class="article-toc-items">
      <li><a href="#recall">早上開工：/recall</a></li>
      <li><a href="#tdd">修 bug：/tdd</a></li>
      <li><a href="#interrogate">改完要審：/interrogate</a></li>
      <li><a href="#no-comments">審查之前：/no-comments</a></li>
      <li><a href="#verification">收工之前：/create-verification-skill</a></li>
      <li><a href="#bro">看不懂時：/bro</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">實際用起來</span><ol class="article-toc-items">
      <li><a href="#demo">影片示範：一間咖啡店網站走完五關</a></li>
      <li><a href="#install">在 Claude Code 裡用：先用官方版</a></li>
      <li><a href="#limits">它會在哪裡卡住</a></li>
      <li><a href="#adoption">如果是我，會怎麼帶進團隊</a></li>
    </ol></li>
  </ol>
</nav>

## 原則、流程、技能：三層各管一件事 {#layers}

pstack 是一個外掛：一堆 skill，加上它們要用的子代理（subagent，也就是主 AI 派出去分工的小幫手），打包成一次裝好。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=41s)

作者 Lauren Tan，網路上多半叫她 poteto。她在 pstack 說明文件裡的自我介紹是：在 Meta、Netflix、Cursor 處理過數百萬行程式碼，也是 React 核心團隊成員，參與 React Compiler 的開發與維護。[[2]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/README.md)

名字也有梗。依 Matt Van Horn 整理她的工作坊說法，pstack 的 p 是 potato：她和 [gstack]({{ '/claude-code/gstack-workflow-guide/' | relative_url }}) 的作者 Garry Tan 同姓、沒有親戚關係，就順手開了個玩笑；她的 X 頭像是一個在吃烤地瓜的卡通人物，poteto 這個暱稱也是這樣來的。[[16]](https://x.com/mvanhorn/status/2111481583668797694)

影片說 pstack 做事分三步：先看原則、再挑流程、最後執行 skill。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=48s) 我在 10 月 18 日對官方 repo 數了一次，數字跟影片一致：[[3]](https://github.com/cursor/plugins/tree/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills) [[4]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/.cursor-plugin/plugin.json)

| 層級 | 數量 | 回答的問題 | 例子 |
|---|---|---|---|
| 原則（Principles） | 24 條 | 遇到取捨時，怎麼判斷？ | 能刪就不加；做完要證明真的能用 |
| 流程（Playbooks） | 23 套 | 這類工作，照什麼順序做？ | 修 bug、加功能、改善效能、做原型、開 PR |
| 技能（Skills） | 30 個 | 這一步，具體要做什麼？ | `/how` 追程式怎麼跑、`/why` 查為什麼這樣寫、`/arena` 讓幾個模型各寫一版再挑 |

有個小細節：在 repo 裡，原則本身也是以 skill 的形式存放。`skills/` 底下一共 54 個資料夾，24 個是原則，剩下 30 個才是影片說的「30 個 skill」。[[3]](https://github.com/cursor/plugins/tree/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills)

這些數字以 0.15.25 版為準。我 10 月 7 日寫上一篇時，版本還是 0.15.15；十一天跳了十個小版本，之後數量變了也不奇怪。

三層聽起來很多，但平常不必自己組合。統一入口是 `/poteto-mode`：它讀你的需求、選一套流程，把那套流程的步驟原封不動抄成待辦清單的前幾項，再在步驟需要時叫出對應的 skill。[[2]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/README.md)

影片的例子是修 bug：它先讀原則，挑修 bug 的流程，照「重現 → 找原因 → 規劃修法 → 驗證」走；到了找原因那一步，再叫 `/how` 和 `/why`。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=96s)

打開那套修 bug 流程，驗證那一步寫得很硬：原本的重現步驟現在要通過；「結果不明確」或在錯的地方驗，都不算過。還有一句我想抄下來貼在牆上：**單元測試證明的是分支行為，不是 bug 不存在。**[[15]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/poteto-mode/playbooks/bug-fix.md)

規格裡還有一條我很喜歡的要求：回覆時要點名「哪一條原則，改變了哪一個決定」，而且只能引用這次真的讀過的原則。[[5]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/poteto-mode/SKILL.md) 這等於不准 AI 拿原則當裝飾，掛在嘴上卻沒用上。

<figure>
  <a href="{{ '/assets/img/technical/pstack-six-skills-workday/three-layers.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="pstack-six-skills" data-type="image"><img src="{{ '/assets/img/technical/pstack-six-skills-workday/three-layers.svg' | relative_url }}" alt="pstack 的運作方式：使用者用 /poteto-mode 描述任務，它先讀 24 條原則決定怎麼判斷，再從 23 套流程挑出修 bug 流程，依序重現、找原因、規劃、修正、驗證，途中叫出 /how、/why、/tdd 等技能" loading="lazy" width="1200" height="720"></a>
  <figcaption>依 pstack 0.15.25 的說明文件與 poteto-mode 規格整理。使用者只描述目標，判斷標準、順序與動作由三層分別負責。<a href="https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/README.md">[2]</a> 點圖可放大。</figcaption>
</figure>

## 一天的六個指令，各自交出什麼 {#day}

影片接著挑了六個「單獨叫也很好用」的 skill，照一天寫程式的順序排：早上 `/recall`、修 bug `/tdd`、審查 `/interrogate`、清註解 `/no-comments`、建立驗收 `/create-verification-skill`，看不懂時 `/bro`。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=119s)

我把這六個的原始規格都打開看了。它們有一個共同設定：規格檔都標了 `disable-model-invocation: true`，也就是不讓模型自己判斷何時該用，而是等你打指令；其中 `/tdd`、`/interrogate`、`/no-comments` 也會由 `/poteto-mode` 的流程在對應步驟點名。[[2]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/README.md) [[5]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/poteto-mode/SKILL.md)

比起「它會做什麼」，我更想知道「它做完要交出什麼」。整理成一張圖：

<figure>
  <a href="{{ '/assets/img/technical/pstack-six-skills-workday/workday-evidence.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="pstack-six-skills" data-type="image"><img src="{{ '/assets/img/technical/pstack-six-skills-workday/workday-evidence.svg' | relative_url }}" alt="一天的六個指令與它們交出的證據：/recall 交現況簡報，/tdd 交修前失敗與修後通過的紀錄，/interrogate 交四類判決，/no-comments 交刪除與保留清單，/create-verification-skill 交可重跑的驗收流程，/bro 交一段白話重述" loading="lazy" width="960" height="1080"></a>
  <figcaption>順序依影片的「一天」安排，每個指令交出的內容依各自的規格檔整理。點圖可放大。</figcaption>
</figure>

## 早上開工：/recall，先把昨天的自己找回來 {#recall}

<figure>
  <a href="{{ '/assets/img/technical/pstack-six-skills-workday/recall.jpg' | relative_url }}" class="portfolio-lightbox" data-gallery="pstack-six-skills" data-type="image"><img src="{{ '/assets/img/technical/pstack-six-skills-workday/recall.jpg' | relative_url }}" alt="剛休假回來的水手服品牌主角頭上架著墨鏡、拖著行李箱、一臉迷糊；Lauren Tan 轉動一台復古放映機，把最近幾天的工作膠卷投在空中，再遞給她一張小小的摘要卡" loading="lazy" width="1536" height="1024"></a>
  <figcaption>/recall 像一台倒帶放映機：把最近七天重播一次，再交給你一張「現在在哪、下一步做什麼」的小卡。概念插畫。</figcaption>
</figure>

休假回來，忘了做到哪。影片的說法是：打 `/recall`，它會翻你最近七天跟 AI 的對話，再查相關的 PR 和 issue，最後給你一份報告：做到哪、哪些試過沒成功、下一步做什麼。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=124s)

規格寫得更細，有三個地方值得注意：[[6]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/recall/SKILL.md)

- **範圍先講清楚**：預設最近 7 天、目前這個專案；沒被要求，就不讀其他專案的對話。也不准把「全部」偷偷縮成「最近幾筆」。
- **兩種紀錄都要翻**：自己的對話紀錄，加上團隊共享的紀錄：使用者一直回報的症狀、修過又被撤回的修正、正式環境還在噴的錯誤。只要主題點名到某個功能或檔案，這一步就是預設，不是看心情。
- **最後對照實際狀態**：用 git 和 GitHub 工具確認那些 PR、分支現在真的是什麼狀態，而不是只相信對話紀錄。

交出來的格式也固定：最多五點現況摘要；每條工作線前面掛一個狀態標籤，例如已合併、PR 開著、進行中、已驗證但未提交、被撤回、還沒開始；最多五個反覆出現的問題；以及一個最有用的下一步。[[6]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/recall/SKILL.md)

比較有意思的是「被撤回的修正」要列進問題清單。這樣下一個人，或下一個 AI，才不會從上一次失敗的地方，再失敗一次。

## 修 bug：/tdd，先看見測試失敗 {#tdd}

<figure>
  <a href="{{ '/assets/img/technical/pstack-six-skills-workday/tdd.jpg' | relative_url }}" class="portfolio-lightbox" data-gallery="pstack-six-skills" data-type="image"><img src="{{ '/assets/img/technical/pstack-six-skills-workday/tdd.jpg' | relative_url }}" alt="實驗台上的玻璃罐陷阱抓住一隻發光的紫色小蟲，上方測試燈亮起紅燈，水手服品牌主角得意地指著紅燈笑，Lauren Tan 拿著小螺絲起子豎起大拇指，旁邊的綠燈還沒亮" loading="lazy" width="1536" height="1024"></a>
  <figcaption>紅燈亮了反而要開心：這代表陷阱真的抓得到這隻 bug。接下來才輪到修，綠燈也才有意義。概念插畫。</figcaption>
</figure>

TDD（測試驅動開發）的意思是先寫測試、再寫程式。影片版的 `/tdd` 是四步：根據問題寫測試、先跑一次確認它失敗、用最小改動修好、再跑一次確認通過。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=139s)

規格裡最關鍵的是第二步的條件：新測試必須「因為對的原因」失敗。如果它直接通過，或是因為無關的原因失敗，就要先修測試或重現步驟，才能動正式程式。[[7]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/tdd/SKILL.md)

沒看過它失敗，你就不知道這個測試到底抓不抓得到這個 bug。一個永遠會過的測試，等於沒有測試，還多送你一份假的安心。

但規格比影片克制得多。它開宗明義寫：只在使用者明確要求 TDD，或這個 bug 有明顯又便宜的本地測試方式時才用；測試路徑不清楚、成本太高、要動用大量整合環境時，就跳過。[[7]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/tdd/SKILL.md)

它甚至寫了：**寧可不加新測試，也不要加一個爛測試。** 爛測試的定義很具體：主要在測假資料、綁死目前的實作細節、依賴時間或無關的全域狀態、為了小修正動用昂貴的基礎設施，或是證明完就會被刪掉。[[7]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/tdd/SKILL.md)

這兩條要合起來看才完整。要嘛交出一個「修前失敗、修後通過」的測試；要嘛老實說明為什麼做不到，改用最接近的可執行檢查，例如一段腳本、一條手動重現指令或瀏覽器自動化。最後的回報要寫出：哪個測試修前失敗、失敗訊息是什麼、修後哪一次通過。[[7]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/tdd/SKILL.md)

如果你想多理解「先失敗」這件事為什麼重要，可以接著讀〈[Claude Code 時代，Kent Beck 為什麼提醒我們不要只看「80% 完成」]({{ '/technical/claude-code-kent-beck-tdd/' | relative_url }})〉。

## 改完要審：/interrogate，讓不同模型各自挑毛病 {#interrogate}

<figure>
  <a href="{{ '/assets/img/technical/pstack-six-skills-workday/interrogate.jpg' | relative_url }}" class="portfolio-lightbox" data-gallery="pstack-six-skills" data-type="image"><img src="{{ '/assets/img/technical/pstack-six-skills-workday/interrogate.jpg' | relative_url }}" alt="聚光燈下的偵訊室：一隻緊張冒汗的小方塊機器人抓著改動清單，兩個不同顏色、戴偵探帽的機器人從左右兩側問話；Lauren Tan 在後方把證據卡分進四色托盤，水手服品牌主角拿著咖啡倚在門邊微笑旁觀" loading="lazy" width="1536" height="1024"></a>
  <figcaption>兩位不同模型的偵探各自問話，最後由主審把證據分成四格。被審的只是程式碼，沒有機器人受傷。概念插畫。</figcaption>
</figure>

改完程式要審查。影片說 `/interrogate` 會把你的改動同時交給不同模型，各自去挑毛病，最後分成四類，而且不會自己動你的程式。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=154s)

規格裡有一句話，我覺得是整個設計的核心：**對抗的訊號來自模型本身的差異，不是替它們指派不同人設。** 一個模型配一位審查者，預設是 Claude Opus 5.5 與 Grok 兩位，可以用 `/setup-pstack` 換掉。影片示範時用的是 Opus 和 Sonnet。[[8]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/interrogate/SKILL.md) [[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=314s)

派出審查者之前，它要先用一段話寫出「這次改動想做到什麼」；不確定就先問你。[[8]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/interrogate/SKILL.md) 這一步很容易被省略，但沒有意圖，審查者只能挑語法毛病，判斷不了這段程式到底有沒有做對事。

意見回來之後，規格要它這樣彙整：兩個以上模型各自提出的同一個問題，訊號最高；只有一個模型提的也要讀，但權重調低；兩邊說法相反的地方，要記下來。[[8]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/interrogate/SKILL.md)

最後下判斷的，不是一個中立的統計員，而是規格所說的「務實的資深工程師」。每條意見只能放進四格之一：[[8]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/interrogate/SKILL.md)

- **必須處理**：影響正確性、安全或可維護性，真實的 PR 會因此被擋下。
- **值得考慮**：有道理，但不確定現在處理划不划算，交給你判斷。
- **記下就好**：技術上沒錯，但現階段不值得動。
- **駁回**：錯的、太挑剔或缺少脈絡，附上簡短理由。

<figure>
  <a href="{{ '/assets/img/technical/pstack-six-skills-workday/interrogate-flow.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="pstack-six-skills" data-type="image"><img src="{{ '/assets/img/technical/pstack-six-skills-workday/interrogate-flow.svg' | relative_url }}" alt="/interrogate 的審查流程：先寫出改動意圖，交給兩個不同模型各自審查，合併重複意見並標出幾個模型提出，再由主審分成必須處理、值得考慮、記下就好、駁回四類，程式碼不會被自動修改" loading="lazy" width="1200" height="700"></a>
  <figcaption>依 interrogate 規格整理。多個模型都提到的問題排在前面，但分類仍由主審判斷，最後交給人決定改不改。<a href="https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/interrogate/SKILL.md">[8]</a> 點圖可放大。</figcaption>
</figure>

我的看法是：幾個模型都說有問題，不代表一定有問題，它們可能有同一個盲點；只有一個模型看見的問題，也可能才是真的。「幾個人同意」只是排優先順序的線索，最後那一層判斷才是這個 skill 的重點。

另外要算成本。每次審查就是多個模型各跑一輪，小改動每次都這樣審，時間和費用都會上去。

## 審查之前：/no-comments，讓每條註解說明自己為什麼還活著 {#no-comments}

<figure>
  <a href="{{ '/assets/img/technical/pstack-six-skills-workday/no-comments.jpg' | relative_url }}" class="portfolio-lightbox" data-gallery="pstack-six-skills" data-type="image"><img src="{{ '/assets/img/technical/pstack-six-skills-workday/no-comments.jpg' | relative_url }}" alt="貼滿黃色便利貼的程式牆前，一隻咧嘴的小怪物拿著大剪刀飛撲剪紙，便利貼像彩帶紛飛；只有古卷、瀏覽器視窗、鏈結圖示三張被玻璃罩護住，Lauren Tan 扶著其中一個玻璃罩微笑，水手服品牌主角笑到摀住嘴" loading="lazy" width="1536" height="1024"></a>
  <figcaption>Comment Sicko 上工：大部分註解都被剪掉，只有授權條款、平台限制這類「我們改不了的事」能躲進玻璃罩。概念插畫。</figcaption>
</figure>

`/no-comments` 會派出一個叫 Comment Sicko 的子代理，把程式裡的註解一條一條審。只是在描述程式做了什麼的，刪；因為外部限制才這樣寫的，例如第三方服務的規定，留下。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=171s)

打開規格會發現，這個子代理的人設寫得非常用力：一個「熱愛刪除、痛恨權宜寫法」的註解仇恨者，被叫出來時第一句話規定是「Yes... Ha ha ha... Yes!」。[[9]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/agents/comment-sicko.md) 看得出作者寫得很開心。

但它的規則其實很嚴謹。能活下來的註解只有五種：[[9]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/agents/comment-sicko.md)

1. 授權條款與法律聲明。
2. 外部依賴、平台、供應商或協定造成，而我們改不了的反直覺行為。
3. 格式化工具的忽略標記，以及規則本身有問題時的檢查豁免。
4. 定義公開介面約定的說明文件。
5. 用來解釋程式寫不出來之限制的 issue 或規格連結。

不確定符不符合，就刪。

更有意思的是第二條的反面：如果那個「讓人意外的行為」是我們自己程式造成的，就不准用註解解釋，而是刪掉註解，把那段程式標成「必須重構」，交給改名、拆函式、補型別或重新設計去處理。Comment Sicko 本身只動註解、只標出目標，從不寫正式程式。[[9]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/agents/comment-sicko.md)

外層的 `/no-comments` 負責收尾：審核它的報告、退回越權或理由不實的刪除、修掉採納的問題。遇到「不要刪」這類約束型註解，則提議把約束寫進型別、測試或 CI 檢查，經你同意才做。[[10]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/no-comments/SKILL.md)

影片的示範剛好兩種各一：一條只是在描述程式做什麼，刪掉，改成一個有名字的變數；另一條說明瀏覽器的特殊行為，留下。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=328s) 後者正好落在「改不了的平台行為」那一條。

我不會把「不確定就刪」照搬到每個專案。有些註解記的是安全假設或當時的取捨，刪掉反而讓下一個人更容易犯錯；這部分的爭議，我在上一篇的〈[園丁與禁止註解]({{ '/technical/poteto-pstack-trust-before-scale/#gardener' | relative_url }})〉那段寫過。

但它把問題問對了：**這條註解是在保存一個無法替代的理由，還是在替一個明知不好的設計找藉口？**

## 收工之前：/create-verification-skill，把驗收變成可以重跑的流程 {#verification}

<figure>
  <a href="{{ '/assets/img/technical/pstack-six-skills-workday/verification.jpg' | relative_url }}" class="portfolio-lightbox" data-gallery="pstack-six-skills" data-type="image"><img src="{{ '/assets/img/technical/pstack-six-skills-workday/verification.jpg' | relative_url }}" alt="水手服品牌主角用搖桿操作機械臂，在一台咖啡店網站的大型模型機上按按鈕，空拍機拍下的證據照片像拍立得漂浮，上方七盞燈全亮綠燈；Lauren Tan 卻從後面偷偷把一隻紫色小蟲塞回機台，頂上的警示燈立刻閃紅" loading="lazy" width="1536" height="1024"></a>
  <figcaption>七盞綠燈全亮還不夠，偷偷把 bug 放回去、警示燈立刻變紅，這套驗證才算可信。概念插畫。</figcaption>
</figure>

這是我認為整套 pstack 最值得帶走的一個。

影片的說法是：它會幫專案產生一個驗證專用的 skill，寫好怎麼啟動、怎麼像使用者一樣操作、拿什麼當證據；再挑三到五個主要功能，每個都寫清楚「怎樣才算真的能用」；交給你之前，它會自己先完整跑過一次。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=187s)

規格裡有幾句話，把「驗收」這件事講得很到位：[[11]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/create-verification-skill/SKILL.md)

- **先問程式庫，不先問人**：怎麼啟動、怎麼操作、能拿到什麼證據，能從專案裡看出來的就不問你。專案裡已經有的自動化測試工具優先用。
- **寫給下一個 AI 讀**：讀的人是一個從沒看過這個系統、正在工作途中的 AI，所以每一步都要具體到能直接照做。
- **證據要走真實使用者的路**：不能靠只給測試用的捷徑；要記下動作和結果，也要檢查副作用，例如檔案有沒有寫入、資料有沒有新增。
- **清理不能把證據一起清掉**：證據要留在指定位置。
- **沒跑過的驗證 skill，只是草稿**。

這些要求的細節，上一篇〈[驗證的交付契約]({{ '/technical/poteto-pstack-trust-before-scale/#verification-contract' | relative_url }})〉有逐項拆解，這裡不重複。

影片示範的結果是七項全部通過。接著它還故意把剛修好的 email 問題放回去，確認這套驗證真的抓得到。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=344s)

這是整支影片我最有感的一刻：**驗證工具本身也需要被驗證。** 要說清楚的是，「故意放回 bug」是影片裡的做法；規格本身要求的是至少跑通一個功能並保留證據。我會建議把這一步也寫進自己的驗收流程。

## 看不懂時：/bro，一句話就是一個 skill {#bro}

<figure>
  <a href="{{ '/assets/img/technical/pstack-six-skills-workday/bro.jpg' | relative_url }}" class="portfolio-lightbox" data-gallery="pstack-six-skills" data-type="image"><img src="{{ '/assets/img/technical/pstack-six-skills-workday/bro.jpg' | relative_url }}" alt="夜晚的沙發角落，身後黑板塞滿密密麻麻的術語塗鴉，水手服品牌主角捧著馬克杯、眼睛轉圈圈；Lauren Tan 坐在旁邊，筆記本上只畫了一個圈和一個箭頭，主角頭上亮起一顆燈泡" loading="lazy" width="1536" height="1024"></a>
  <figcaption>整面黑板的術語，不如一個圈加一個箭頭。這就是 /bro 的全部工作。概念插畫。</figcaption>
</figure>

AI 回了一大段，全是術語，你看不懂。打 `/bro`，它會用白話、短短幾句再講一次。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=208s)

它的規格檔，正文只有一段話：重述你上一則訊息，別用術語，講得連貫一點、簡單一點、短一點，像一個人在跟另一個人說話。[[12]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/bro/SKILL.md)

這是整套 pstack 裡最短的 skill，可能也是非工程師最常用的一個。它也提醒了一件事：skill 不一定要寫得很長。你每天都會重複講的一句要求，寫成一句話就夠了。

## 影片示範：一間咖啡店網站走完五關 {#demo}

影片最後在 Claude Desktop 裡實際跑了一次。安裝方式是在外掛設定裡新增市集、貼上 pstack 的 GitHub 位置、同步後安裝到專案。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=223s) 題目是一家虛構咖啡店的介紹頁，下方有一個訂閱用的 email 欄位。

| 階段 | 指令 | 影片裡發生的事 | 留下的證據 |
|---|---|---|---|
| 1. 建站 | `/poteto-mode` | 讀「新功能」流程與原則，派一個 Sonnet 分身寫程式，自己打開瀏覽器驗證；順手修好手機上營業時間被切成兩段的問題 | 瀏覽器實測，並列出這次用了哪些原則 |
| 2. 修 bug | `/tdd` | `abc@gmail` 先寫測試、跑一次失敗，只改一個地方，再跑一次通過 | 修前失敗、修後通過 |
| 3. 審查 | `/interrogate` | Opus 與 Sonnet 各自挑毛病，意見分成四類，程式沒動 | 四類審查判決 |
| 4. 清註解 | `/no-comments` | 兩條註解：一條刪掉、改成有名字的變數；一條說明瀏覽器行為，保留 | 刪除與保留的理由 |
| 5. 驗收 | <code>/create-<wbr>verification-<wbr>skill</code> | 列出要驗的功能，自己跑過七項全部通過，再故意放回 bug 確認抓得到 | 可以重跑的驗證 skill |

<p class="text-muted"><small>依影片 3:42–5:58 的示範整理。<a href="https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=254s">[1]</a></small></p>

示範結尾還補了兩個場景：看不懂解釋時打 `/bro`；隔天上班忘了做到哪，打 `/recall`，它翻了之前的對話和 git 紀錄，列出做完的、沒做的和下一步。[[1]](https://www.youtube.com/watch?v=b7-2w2T2Lqs&t=361s)

要提醒的是：這是一個單頁的小網站。流程跑得順，不代表在大型專案、複雜測試環境或多人協作時，也一樣順。

## 在 Claude Code 裡用：先用官方版 {#install}

pstack 原本是為 Cursor 寫的，但官方說明現在也寫了 Claude Code 的安裝方式：[[2]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/README.md)

```text
/plugin marketplace add cursor/plugins
/plugin install pstack@cursor-plugins
```

在 Claude Code 裡，指令前面會多一個 `pstack:`，例如 `/poteto-mode` 要打成 `/pstack:poteto-mode`。第一次用先跑 `/pstack:setup-pstack` 選模型，它會把設定寫進 `~/.claude/rules/pstack-models.md`；需要 Cursor 專屬功能的步驟，會跳過並留一行說明。[[2]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/README.md) Cursor 使用者則是 `/add-plugin pstack`。

預設的模型分工是：一般寫程式交給 Grok，最難的改動、文字與判斷交給 Claude Opus 5.5。[[2]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/README.md) 你的帳號不一定有這些模型，所以設定這一步不要跳過。

另外有一個社群移植版 pstack-claude，由 Michael Denyer 維護。它的說明寫的是：把 Lauren Tan 的 pstack 移植到 Claude Code、Codex、Pi、GitHub Copilot，另外也說明了 OpenCode、Gemini CLI 等工具的裝法；會跟著原版更新，但也帶著自己宣告的修改分支。[[13]](https://github.com/michael-denyer/pstack-claude)

所以它不是官方版的鏡像，行為可能和原版不同。我的建議很簡單：只用 Claude Code，先用官方版；主力是 Codex 或 Copilot，再考慮移植版。想試這套觀念，不需要為了它換掉手上的工具。

## 它會在哪裡卡住 {#limits}

**流程不等於驗收標準。** pstack 可以規定「一定要驗」，但要驗什麼，仍然是你的產品知識。驗證 skill 也只能從程式庫看得到的東西去推；產品真正重要的路徑，還是要有人講清楚。

**多模型、多分身，是用費用換品質。** 審查一次跑兩個模型、寫程式另派分身，小改動每次都跑完整流程不划算。`/tdd` 自己都寫了不要硬套，其他指令也一樣。

**它會一直變。** 十一天跳了十個小版本。這篇講的行為以 0.15.25 為準，你裝的時候可能已經不同；數量、預設模型、指令名稱都以當下的說明為準。

**這是一個人的工作方式。** Comment Sicko 的語氣、「不確定就刪」的立場，都帶著很強的個人風格。說明文件最後寫的是「fork it. improve it. make it yours.」[[2]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/README.md) 它本來就是要你拿去改成自己的版本，不是當團隊規範直接套。

## 如果是我，會怎麼帶進團隊 {#adoption}

我覺得這支影片很適合拿來討論一件事：規格驅動開發（SDD，先把要做什麼寫清楚，再讓 AI 動手），要怎麼和 AI Agent 的工作流程接起來。

我會把 pstack 放進整個開發週期裡看：

| 階段 | 用什麼 | 交出什麼 |
|---|---|---|
| 需求與規格 | Example Mapping、OpenSpec | 具體例子、規則與驗收條件 |
| 選擇工程流程 | pstack 原則＋流程 | 選定的流程與待辦清單 |
| 開發與測試 | Claude Code／Codex＋`/tdd` | 修前失敗、修後通過的紀錄 |
| 審查與驗收 | `/interrogate`＋驗證 skill＋CI | 審查判決與可重跑的驗證證據 |

Example Mapping 是一種需求討論法：用一張張具體例子，把規則和邊界情況攤在桌上；OpenSpec 則是一套讓人和 AI 先對齊規格、再動手的開源工具。[[14]](https://github.com/Fission-AI/OpenSpec) 我在〈[從組合語言到 Agentic AI Coding]({{ '/technical/agentic-ai-coding-spec-oriented/' | relative_url }})〉談過規格為什麼變得比以前更重要。

這裡要先講反方，因為反方就是作者本人。pstack 的說明文件有一段「為什麼沒有規劃技能？」，她寫：我個人不相信規劃，最好的規格就是程式碼；真的要做計畫，`/poteto-mode` 也能做，但不是預設。[[2]](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/README.md)

Matt Van Horn 的解讀是：她的程式庫已經替計畫做了事。當框架讓錯的寫法根本寫不出來，計畫就內建在 repo 裡了。[[16]](https://x.com/mvanhorn/status/2111481583668797694)

我同意一半。對一位很強的工程師、加上一個約束很重的程式庫，程式碼確實可以是最精確的規格。但團隊裡的需求，常常來自還沒寫過一行程式的人：產品、業務、客戶。程式碼存在之前，大家需要一個都看得懂的東西先對齊，這就是規格的位置。所以我會把 pstack 放在規格之後：需求講清楚了，再交給它照工程紀律做完。

如果只能先試兩個，我會挑 `/tdd` 和 `/create-verification-skill`。原因很實際：它們把 AI 的成果從「程式寫完了」推到「有可以重跑的驗證證據」，而且導入前後的差別最容易看得出來。

可以比較的東西很樸素：AI 交回來的修正，有多少附了修前失敗的紀錄；驗收時，有多少次還得由人從頭手動點一遍。

最後，這篇也很適合當團隊討論的起點。我會想問的不是「要不要裝 pstack」，而是這個問題：

**我們目前有哪些工程經驗，還只存在資深工程師的腦袋裡，還沒有變成 AI 可以照著做的規範？**

## 最後記得的，是那個被故意放回去的 bug

看完影片，我記得最清楚的不是哪個指令最強，而是那個被故意放回去的 email bug。

驗證工具說「全部通過」不稀奇。它能在 bug 回來的時候喊停，才算數。

「修好了」三個字很便宜。**值錢的是那份讓別人不必相信你，也能自己確認的證據。**

## 參考資料

pstack 的規格與數量以 2026 年 10 月 18 日檢索的 0.15.25 版為準（cursor/plugins 儲存庫 `16541c6`）；影片中的說法以影片發布當時為準。

- **[1]** [P & H：pstack：把頂尖工程師的腦袋，裝進你的 AI（2026/10/17）](https://www.youtube.com/watch?v=b7-2w2T2Lqs)
- **[2]** [pstack 說明文件：安裝、使用方式與完整技能表](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/README.md)
- **[3]** [pstack skills 目錄：24 條原則與 30 個技能](https://github.com/cursor/plugins/tree/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills)
- **[4]** [pstack 0.15.25 套件資訊](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/.cursor-plugin/plugin.json)
- **[5]** [poteto-mode：統一入口與原則引用規則](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/poteto-mode/SKILL.md)
- **[6]** [recall：重建工作脈絡與輸出格式](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/recall/SKILL.md)
- **[7]** [tdd：先失敗再修正，以及何時不要寫測試](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/tdd/SKILL.md)
- **[8]** [interrogate：多模型審查與四類判決](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/interrogate/SKILL.md)
- **[9]** [Comment Sicko：註解審查子代理的保留規則](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/agents/comment-sicko.md)
- **[10]** [no-comments：審核、修正與約束編碼](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/no-comments/SKILL.md)
- **[11]** [create-verification-skill：建立可重跑的驗證技能](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/create-verification-skill/SKILL.md)
- **[12]** [bro：用白話重述上一則訊息](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/bro/SKILL.md)
- **[13]** [pstack-claude：社群移植版說明](https://github.com/michael-denyer/pstack-claude)
- **[14]** [OpenSpec：AI 程式助理的規格驅動開發工具](https://github.com/Fission-AI/OpenSpec)
- **[15]** [bug-fix playbook：修 bug 流程與驗證標準](https://github.com/cursor/plugins/blob/16541c6bc1ed6c8d808b2f78a33364003e82b967/pstack/skills/poteto-mode/playbooks/bug-fix.md)
- **[16]** [Matt Van Horn：Who Is Lauren Tan, aka Poteto?（2026/10/17）](https://x.com/mvanhorn/status/2111481583668797694)

如果你正在規劃導入，可以接著讀本站的 [Agentic Engineering 系列]({{ '/technical/agentic-engineering/' | relative_url }})。需要先判斷哪一條流程適合試辦，可以從 [AI Agent 導入顧問]({{ '/technical/' | relative_url }})開始：先把問題與驗證條件說清楚，再決定要自動化到哪裡。
