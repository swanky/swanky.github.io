---
title: "讓 AI 助手幫你做影片，又不會半夜亂花錢：五個把關做法"
seo_title: "讓 AI 助手做影片不失控：人工核准、審片頁、付費工作不重送與製作紀錄"
date: 2026-10-10 10:45:00 +0800
categories: [technical]
tags: [ai-video, ai-agent, agentic-engineering, human-in-the-loop, workflow]
layout: article
learn_kit: true
use_glightbox: true
cta_context: agentic
related_posts:
  - production-ai-agent-control-planes
  - ai-video-cost-control
  - hermes-agent-openrouter-video-generation
description: "AI 助手能送件、算帳、剪接，但「可以」只能由人說。整理讓它放手做事又不失控的五個做法。"
keywords: AI 助手,AI Agent,AI 影片製作,人工核准,審片,製作紀錄,Human in the loop,史旺基
cover_image: /assets/img/linkedin/ai-video-agent-human-gates.jpg
cover_alt: "成年水手服創作者站在自動化影片產線中央的關卡前，一手舉著只有打勾和打叉的審片平板，一手比出「先停一下」，旁邊是加了透明保護蓋的紅色按鈕，兩側機械手臂把膠卷排隊送到她面前"
hero_image: true
---

AI 助手越來越能幹：它可以幫你寫提示詞、生圖、送出影片生成、下載、算帳、剪接。用久了，很容易想直接說一句「你看著辦」。

問題是，影片生成每一次都要付錢。你睡覺的時候，它可能正把同一個錯誤再生第五次。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>AI 可以做，「可以」只能人說</strong>：權利、預算、鏡頭通過、上傳，這四種核准只能由人給。</li>
    <li><strong>花錢、發布、刪檔每次都要問</strong>：其他已授權的工作，讓它主動做完。</li>
    <li><strong>審片回覆是唯一依據</strong>：沒回就是待定，檔案一改就重審。</li>
    <li><strong>付費工作送出後絕不重送</strong>：每個產物留一份製作紀錄，中途斷線也接得起來。</li>
  </ul>
</div>

我在 2026 年 8 到 9 月做 AI 影片時，大部分操作都交給 AI agent，也就是會自己使用工具完成工作的 AI 助手。它做得很好，好到我必須先想清楚：哪些事它可以自己做，哪些事一定要停下來等我。

背後的架構想法，我在〈[可上線的 AI Agent，不是更會自主]({{ '/technical/production-ai-agent-control-planes/' | relative_url }})〉寫過。這篇只看它落到影片製作時長什麼樣子。

## 做法一：先寫下哪些事 AI 不能替你決定 {#roles}

AI 助手可以提建議、準備草稿、執行已核准的工作。但這四件事，它不能替我說「好了」：

- 權利已經確認；
- 預算已經核准；
- 鏡頭已經通過；
- 成片可以上傳。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-agent-human-gates" data-type="image" href="{{ '/assets/img/ai-video/ai-video-agent-human-gates-who-decides.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-agent-human-gates-who-decides-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-agent-human-gates-who-decides.svg' | relative_url }}" width="1200" height="770" alt="AI 助手主動做完草稿、生圖修圖、查進度下載、對帳、剪接與整理上傳包並交出證據；只有人能說權利已確認、預算已核准、鏡頭已通過、成片可以上傳；付費生成、公開發布或上傳、刪除或覆寫檔案、更動預算上限，每一次都要人核准">
    </picture>
  </a>
  <figcaption>圖 1：AI 做事並交出證據，人只負責說「可以」 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

另外有幾個動作，每一次都要我明確點頭：任何付費生成、公開發布或上傳、刪除或覆寫我的檔案、更動預算上限。

其餘的工作，我反而要求它主動做完，不要自創關卡。例如在既定範圍內用 ChatGPT 額度生圖修圖，不必逐張問我；但它要記下總共生成幾次、同一張圖失敗幾次，同一個目標失敗到第六次就停下來，改查原因、換方法。

這份授權只讓它「可以生成」，不代表我已經看過那張圖。**「可以去做」和「我看過說好」，是兩件事，要分開記。**

先猜猜看：下面八件事，哪些 AI 可以自己做，哪些每次都要人核准？

<div class="ae-chain">
  <div class="ae-chain__card"><span class="ae-chain__emoji">🎨</span><span class="ae-chain__prompt">在已授權的範圍內生圖、修圖：<span class="ae-chain__box">＿</span></span><span class="ae-chain__cue">🤔 AI 自己做，還是每次要人核准？</span><details class="ae-reveal"><summary>揭曉</summary><div>AI 自己做。不必逐張問，但要記下生成幾次；同一個目標失敗到第六次就停下來查原因。</div></details></div>
  <div class="ae-chain__card"><span class="ae-chain__emoji">💸</span><span class="ae-chain__prompt">送出一筆付費影片生成：<span class="ae-chain__box">＿</span></span><span class="ae-chain__cue">🤔 AI 自己做，還是每次要人核准？</span><details class="ae-reveal"><summary>揭曉</summary><div>每次都要人核准。任何付費生成都要明確點頭。</div></details></div>
  <div class="ae-chain__card"><span class="ae-chain__emoji">📦</span><span class="ae-chain__prompt">整理上傳包：<span class="ae-chain__box">＿</span></span><span class="ae-chain__cue">🤔 AI 自己做，還是每次要人核准？</span><details class="ae-reveal"><summary>揭曉</summary><div>AI 自己做。整理好交給人；真正上傳是另一回事。</div></details></div>
  <div class="ae-chain__card"><span class="ae-chain__emoji">🗑️</span><span class="ae-chain__prompt">刪除舊檔：<span class="ae-chain__box">＿</span></span><span class="ae-chain__cue">🤔 AI 自己做，還是每次要人核准？</span><details class="ae-reveal"><summary>揭曉</summary><div>每次都要人核准。刪除或覆寫你的檔案，都要你點頭。</div></details></div>
  <div class="ae-chain__card"><span class="ae-chain__emoji">✂️</span><span class="ae-chain__prompt">剪接：<span class="ae-chain__box">＿</span></span><span class="ae-chain__cue">🤔 AI 自己做，還是每次要人核准？</span><details class="ae-reveal"><summary>揭曉</summary><div>AI 自己做。剪接、量測、抽格檢查，做完交出證據。</div></details></div>
  <div class="ae-chain__card"><span class="ae-chain__emoji">📈</span><span class="ae-chain__prompt">把預算上限調高：<span class="ae-chain__box">＿</span></span><span class="ae-chain__cue">🤔 AI 自己做，還是每次要人核准？</span><details class="ae-reveal"><summary>揭曉</summary><div>每次都要人核准。更動預算上限只能由人決定。</div></details></div>
  <div class="ae-chain__card"><span class="ae-chain__emoji">🧾</span><span class="ae-chain__prompt">對帳：<span class="ae-chain__box">＿</span></span><span class="ae-chain__cue">🤔 AI 自己做，還是每次要人核准？</span><details class="ae-reveal"><summary>揭曉</summary><div>AI 自己做。掃過所有製作紀錄、去掉重複，再和預算帳本比對。</div></details></div>
  <div class="ae-chain__card"><span class="ae-chain__emoji">📢</span><span class="ae-chain__prompt">公開上傳到 YouTube：<span class="ae-chain__box">＿</span></span><span class="ae-chain__cue">🤔 AI 自己做，還是每次要人核准？</span><details class="ae-reveal"><summary>揭曉</summary><div>每次都要人核准。公開發布或上傳，每一次都要人明確點頭。</div></details></div>
</div>

## 做法二：把關卡放在花錢與發布之前 {#gates}

我的影片產線上有八道人工關卡。對多數人來說，最值得先設的是這五道：

1. **隱私**：影片生成服務不保證不留存資料，所以只送可以公開的素材。
2. **時間先定**：先用臨時配音和動態分鏡確認每顆鏡頭多長，再做關鍵畫面。
3. **關鍵畫面**：要用圖片帶動的鏡頭，送出前都要有我核准過的關鍵畫面。這是最保護預算的一關。
4. **預算與重抽**：列出鏡頭數、總秒數、價格與上限；每顆鏡頭最多兩次，第三次單獨核准。
5. **發布**：AI 只產出本機檔案，上傳與公開另外核准。

關卡不是要 AI 每做一步就停下來等我。已經授權的不重問；我要的是**沒授權的動作，一定停得下來**。成本那一關怎麼算，寫在〈[AI 影片的錢都花在哪]({{ '/technical/ai-video-cost-control/' | relative_url }})〉。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-agent-human-gates" data-type="image" href="{{ '/assets/img/ai-video/ai-video-agent-human-gates-pipeline-gates.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-agent-human-gates-pipeline-gates-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-agent-human-gates-pipeline-gates.svg' | relative_url }}" width="1200" height="710" alt="影片產線從劇本、時間、關鍵畫面、預算到生成、審片、發布；五道人工關卡像旗子插在花錢與發布之前：先定長度、人核准畫面、報價與上限、只送可公開的素材、發布另外核准">
    </picture>
  </a>
  <figcaption>圖 2：人工關卡插在花錢與發布之前 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 做法三：審片頁，只讓人看需要用眼睛判斷的 {#review}

需要我判斷的東西，例如關鍵畫面、生成片段、成片、配樂候選，AI 會整理成一個**審片頁**：直接在瀏覽器打開的網頁，圖片、影片、聲音都在自己電腦上。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/ai-video-production-rehearsal/offline-review-dashboard.jpg' | relative_url }}" alt="實際的離線審片頁，並排顯示首幀、尾幀與核准按鈕，記錄預算、檔案指紋及人工決定" style="width:100%;height:auto;border-radius:14px;" loading="lazy">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">實際審片畫面（彩排作品）：預算、版本、檔案資訊由系統整理，「要不要花錢生成」由人親自決定。</figcaption>
</figure>

每一項旁邊列出版本、使用的模型與實付金額，然後只給我四個選項：

- **核准**：允許進入下一步；
- **附註核准**：只允許我寫下的條件，AI 不能自己重新解讀；
- **要修改**、**退回**：這一項的花錢與發布全部擋下。

我勾完的回覆存成一個檔案，**這個回覆就是唯一依據**。幾條規則跟著它：

- 沒有回覆的項目一律是「待定」，不能從沉默推定同意。
- 審過之後檔案只要改了一點點，就要重審，核准不能沿用。
- 真正送出前，系統會把實際要送的首尾畫面，和我核准當下的那一份比對；對不上就擋下，並用白話說明原因。

最後這條是為了避免「審 A、送 B」：我看過的是這張，送出去的卻是另一張。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-agent-human-gates" data-type="image" href="{{ '/assets/img/ai-video/ai-video-agent-human-gates-fingerprint.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-agent-human-gates-fingerprint-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-agent-human-gates-fingerprint.svg' | relative_url }}" width="1200" height="690" alt="核准畫面時記下檔案指紋，送出前把要送的畫面再算一次指紋比對，一致才放行，對不上就擋下並用白話說明原因">
    </picture>
  </a>
  <figcaption>圖 3：「審 A、送 B」怎麼被擋下 <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 做法四：付費工作送出後，絕不重送 {#submit-lock}

付費影片生成是先送出一個工作，再定期查它好了沒。最危險的時刻，是送出後網路斷了。

工作可能其實已經被接受、正在跑。如果 AI 判斷「失敗了，再送一次」，你就付了兩次錢。所以規則是：

- 已送出的工作**絕不重送**；
- 斷線或逾時，先查那個工作的狀態，再記錄結果；
- 真的要再生成，就是一筆新工作：新估價、新核准，而且算進重抽次數。

我實際遇到過一個比較隱蔽的版本。最早的工具把所有工作編號寫進同一份清單：讀出來、加一行、寫回去。一次只送一支沒問題；同時送 8 支時，後寫的會蓋掉前一支，實測會掉 3 到 6 筆。**錢付了，工作編號卻不見了。**

後來改成每支工作各自一份紀錄，只能新建、永遠不覆寫。中途斷了，接手的人或 AI 直接讀這些紀錄、接著查，不重送。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="ai-video-agent-human-gates" data-type="image" href="{{ '/assets/img/ai-video/ai-video-agent-human-gates-records.svg' | relative_url }}">
    <picture>
      <source media="(max-width: 767px)" srcset="{{ '/assets/img/ai-video/ai-video-agent-human-gates-records-m.svg' | relative_url }}">
      <img src="{{ '/assets/img/ai-video/ai-video-agent-human-gates-records.svg' | relative_url }}" width="1200" height="730" alt="同時送 8 支時，共用一份清單會互相蓋掉，實測掉 3 到 6 筆；改成一支一份、只新建不覆寫的紀錄，全部留得住">
    </picture>
  </a>
  <figcaption>圖 4：共用一份清單 vs 一支一份紀錄（掉幾筆為示意） <span class="ae-fig__zoom">點圖放大</span></figcaption>
</figure>

## 做法五：每個產物都留一張「身分證」 {#records}

我讓每一張生成圖、每一支生成影片旁邊，都放一份同名的小檔案，我叫它**製作紀錄**，記下：用了哪個模型、哪段提示詞、工作編號、實付金額（取供應商回報的數字，不拿估價充數）、檔案指紋，以及驗收狀態：通過、有條件可用，或只能當方向參考。

它有三個用途：

- **對帳**：累計花費不是人用計算機加的，而是程式掃過所有製作紀錄、用工作編號去重複，再和預算帳本比對。對不上，要先解釋清楚，才能替下一批報價。
- **接手**：AI 助手可能因為額度用完或斷線停在半路。專案狀態分成給程式讀的、給人讀的，以及每一步都追加一行的接手紀錄。任何工具中途斷掉都不可怕，沒有接手點才可怕。
- **證明**：失敗的生成也有紀錄，照實記金額。核准過的檔案不准改，要改就存新版本重審，「哪一版才算通過」永遠有答案。

## 別忘了：機器檢查不等於人的判斷 {#machine-vs-human}

AI 會做很多機器檢查：影片能不能完整播放、長度與規格對不對、抽出畫面排成一張總覽。這些都是給我看的**資料**，不是**決定**。只有人能把一顆鏡頭標成「通過」。

機器檢查自己也會出錯。有一次，生圖工具的執行紀錄裡剛好印進一段說明文件，裡面有「usage limit」（額度用盡）這幾個字；靠關鍵字判斷失敗的程式就會誤以為額度沒了。後來規則改成：**先看有沒有真的產出檔案**，沒產出才去讀錯誤訊息，而且要比對整句。

<div class="ae-quizband">
  <div class="ae-quiz" data-ae-quiz="B">
    <div class="ae-quiz__top"><span class="ae-quiz__badge"><i class="bi bi-bullseye" aria-hidden="true"></i>小測驗</span></div>
    <p class="ae-quiz__q">AI 送出一筆付費影片生成後，網路斷了、等到逾時都沒回應。它下一步該做什麼？</p>
    <ul class="ae-quiz__opts">
      <li><button type="button" class="ae-quiz__opt" data-option="A"><span class="ae-quiz__letter">A</span><span>判定失敗，馬上再送一次</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="B"><span class="ae-quiz__letter">B</span><span>先查那個工作的狀態，再記錄結果</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="C"><span class="ae-quiz__letter">C</span><span>換一個模型重新送，比較保險</span></button></li>
      <li><button type="button" class="ae-quiz__opt" data-option="D"><span class="ae-quiz__letter">D</span><span>當作沒發生，繼續做下一顆鏡頭</span></button></li>
    </ul>
    <div class="ae-quiz__result" tabindex="-1" hidden>
      <strong data-ae-verdict></strong> 工作可能其實已被接受、正在跑。已送出的工作絕不重送；先查狀態、再記錄。真的要再生成，就是一筆新工作：新估價、新核准，而且算進重抽次數。
      <ul class="ae-quiz__why">
        <li><b>A 馬上再送</b>：如果原本那筆其實在跑，你就付了兩次錢。</li>
        <li><b>C 換模型重送</b>：一樣是沒核准的新花費。</li>
      </ul>
      <button type="button" class="ae-btn" data-ae-quiz-reset style="margin-top:.75rem">再試一次</button>
    </div>
    <details class="ae-reveal ae-quiz-answer-static"><summary>看答案</summary><div>B，先查那個工作的狀態，再記錄結果；已送出的工作絕不重送。</div></details>
  </div>
</div>

再想兩個情境：

<details class="ae-reveal"><summary>AI 回報「已完成」，卻沒附任何檔案？</summary><div>先看有沒有真的產出檔案。沒產出，才去讀錯誤訊息；「已完成」這句話本身不算證據。</div></details>

<details class="ae-reveal"><summary>審片頁上有一項，我沒有回覆？</summary><div>一律當作「待定」，不能從沉默推定同意。那一項的花錢與發布都先停著。</div></details>

## 你可以這樣開始 {#start}

1. 寫一張「AI 不能替我決定」的清單：權利、預算、驗收、上傳。
2. 付費生成、發布、刪檔、改預算，設定成每次都要你明確點頭；其他已授權的讓它做完。
3. 需要用眼睛判斷的東西，請 AI 整理成一頁讓你勾選；沒勾的就是待定。
4. 告訴 AI：付費工作送出後絕不重送，逾時先查狀態。
5. 每個生成檔案旁邊留一份製作紀錄：模型、提示詞、工作編號、實付、驗收狀態。

讓 AI 做影片，最難的不是讓它會做，而是讓它知道什麼時候不能做。

---

## 這個系列接著讀

- [可上線的 AI Agent，不是更會自主：四層控制面]({{ '/technical/production-ai-agent-control-planes/' | relative_url }})：本篇背後的架構原則。
- [我讓 Hermes Agent 串上 OpenRouter 生影片：從 GPT-5.6 Sol 到 35 秒成片的完整實作]({{ '/technical/hermes-agent-openrouter-video-generation/' | relative_url }})：付費送件核准從流程紀律走向程式關卡的起點。
- [AI 影片的錢都花在哪？四個習慣讓預算不失控]({{ '/technical/ai-video-cost-control/' | relative_url }})：報價、重抽上限與失敗記帳。
- [限時 AI 影片比賽怎麼準備？我帶著五條停損線進到決賽八強]({{ '/technical/ai-video-competition-rehearsal-to-finals/' | relative_url }})：這套把關在比賽現場怎麼運作。
- [AI 影片白話術語表]({{ '/technical/ai-video/glossary/' | relative_url }})：看不懂的詞先查這裡。
- [AI 影片製作筆記]({{ '/technical/ai-video/' | relative_url }})
