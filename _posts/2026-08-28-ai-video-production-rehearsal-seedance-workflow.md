---
title: "AI 影片不是輸入一句話就好：6 天彩排 3 支成片，我踩過的審核、參考圖與成本問題"
seo_title: "AI 影片製作工作流實戰：Seedance 2.5、OpenRouter、人工審核與成本控制"
date: 2026-08-28
published: true
categories: [technical]
tags: [ai-video, seedance, openrouter, agentic-engineering, workflow]
layout: article
cover_image: /assets/img/linkedin/ai-video-production-rehearsal-seedance-workflow.jpg
cover_alt: "成年水手服技術創作者在 AI 影片控制室操作分鏡、成本、品質與後製關卡"
cta_context: agentic
related_posts:
  - hermes-agent-openrouter-video-generation
  - production-ai-agent-control-planes
  - scaffolding-thin-harness-agent-architecture
hero_image: true
use_glightbox: true
description: "從模型比較、參考圖驅動、人工審核、成本帳本到 YouTube 交件，拆解一場 6 天 AI 影片製作彩排真正有效與失敗的地方。"
keywords: AI 影片製作,Seedance 2.5,OpenRouter,參考圖生成,AI Agent,影片工作流,人工審核,成本控制,史旺基
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>6 天彩排交出 3 支片</strong>：我完成 4 模型比較、1 支 30 秒概念預告，以及卡通與擬真兩支 93.3 秒短片。</li>
    <li><strong>總花費是 US$64.11</strong>：成本大頭不在後製，而是長秒數鏡頭與重抽；每次多試一版都要先知道代價。</li>
    <li><strong>沒有一個模型包辦全片</strong>：首幀、首尾幀與參考圖各自控制不同問題，模型要依鏡頭需求選，不是看排行榜決定。</li>
    <li><strong>真正要設計的是製作流程</strong>：AI 影片從展示片走到可交件，需要能停下檢查、退回上一版、留下審核紀錄，也知道由誰核准。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">先看這條 AI 影片產線怎麼搭</span>
      <ol class="article-toc-items">
        <li><a href="#pipeline">我不是在做三支影片，我是在測一條產線</a></li>
        <li><a href="#bakeoff">同一個鏡頭，四個模型差在哪</a></li>
        <li><a href="#control">首幀、首尾幀與參考圖分別控制什麼</a></li>
        <li><a href="#bunny">30 秒概念預告：生成一次過，後製仍做三版</a></li>
        <li><a href="#reroll">兩支 93 秒短片如何驗證雙風格流程</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">再看失敗、成本與公開邊界</span>
      <ol class="article-toc-items">
        <li><a href="#cost">US$64.11 花在哪裡</a></li>
        <li><a href="#review">為什麼 AI 不能替我核准</a></li>
        <li><a href="#rights">做得到，不等於什麼都能拿去用</a></li>
        <li><a href="#playbook">如果明天進場，我會帶哪條最小產線</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 我不是在做三支影片，我是在測一條產線 {#pipeline}

這次的起點，是一場現場才公布題目與角色造型的 AI 影像限時賽。

既然內容不能先做，我能準備的就只剩流程。更準確地說，我要知道：拿到一組陌生角色圖後，能不能在有限時間內完成分鏡、生成、審片、重抽、剪接、聲音、權利揭露與交件。

所以我沒有把目標設成「生出一支看起來很厲害的影片」。那種展示片一直都有人做。

我把目標設成比較無聊，但也比較接近真正交付的問題：

1. 同一個鏡頭，該怎麼選模型？
2. 哪些關卡可以自動跑，哪些一定要人看？
3. 角色跑掉、比例拉長、參考圖被擋時，怎麼退回上一個安全狀態？
4. 每次重抽前，誰知道這次要花多少錢？
5. AI 助手或命令列工具（CLI）中途斷掉，下一個執行者能不能從製作紀錄檔（manifest）接手？

OpenRouter 的影片 API 本來就是非同步工作：先送出生成任務（job），再定期查詢狀態、取回結果與費用。[[1]](https://openrouter.ai/docs/guides/overview/multimodal/video-generation) 這種介面很適合自動化，也很容易讓人誤以為「交給 AI 助手就完成了」。

問題是，生成完成只代表供應商回了檔案，不代表鏡頭能用。

我把每一個「不通過就先停下來」的檢查點，叫做**人工檢查關卡（Gate）**。這不是特別高深的技術名詞，白話就是：先確認前一步真的合格，再決定要不要花下一筆錢。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a class="portfolio-lightbox" data-gallery="ai-video-rehearsal" href="{{ '/assets/img/ai-video-production-rehearsal/production-gates.svg' | relative_url }}">
    <img src="{{ '/assets/img/ai-video-production-rehearsal/production-gates.svg' | relative_url }}" alt="AI 影片彩排流程：題目與角色圖先經低成本測試、分鏡與成本核准，再送付費生成；生成後逐鏡檢查品質、完成後製與交件驗證，不合格鏡頭回到最近的安全關卡" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖一：生成不是終點。每個昂貴或無法回頭的步驟前，都要先設一個能停下來檢查、也能退回上一版的關卡。點圖可開啟原尺寸。</figcaption>
</figure>

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a class="portfolio-lightbox" data-gallery="ai-video-rehearsal" href="{{ '/assets/img/ai-video-production-rehearsal/rehearsal-deliverables.jpg' | relative_url }}">
    <img src="{{ '/assets/img/ai-video-production-rehearsal/rehearsal-deliverables.jpg' | relative_url }}" alt="三支 AI 影片彩排成果規格卡：30 秒 BUNNY AWAKENS，以及卡通與擬真兩支 93.3 秒 REROLL" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">本次彩排的三個公開成果：一支 30 秒概念預告，加上同劇本的卡通與擬真兩支 93.3 秒短片。點圖可開啟原尺寸。</figcaption>
</figure>

## 第一個教訓：排行榜只能幫你縮名單 {#bakeoff}

08 月 23 日，我用同一張首幀、同一段輸入指令（prompt）、同樣 5 秒動作，跑了四個 OpenRouter 影片模型。

測試不是讓角色原地眨眼，而是衝刺、滑鏟穿過雷射、起身，攝影機還要後退跟拍。這種鏡頭會同時測到動作理解、物理連續性、角色保真與運鏡。

結果如下。金額是這次生成任務製作紀錄留下的實付，不是官網估價。

| 名次 | 模型 | 這次實付 | 結果 |
|---|---|---:|---|
| 1 | Seedance 2.5 | US$1.165 | 動作與特技感成立，人物順利避開雷射 |
| 2 | Grok Imagine Video 1.5 | US$0.710 | 有趣，但角色跌倒，身體穿過雷射 |
| — | Seedance 2.0 | US$0.762 | 動作尚可，首幀角色卻漂成另一種卡通感 |
| — | Hailuo 3 | US$0.650 | 解析度最高，但人物只是蹲下，直接穿過雷射 |

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a class="portfolio-lightbox" data-gallery="ai-video-rehearsal" href="{{ '/assets/img/ai-video-production-rehearsal/bakeoff-four-models.jpg' | relative_url }}">
    <img src="{{ '/assets/img/ai-video-production-rehearsal/bakeoff-four-models.jpg' | relative_url }}" alt="同一張首幀與同一段滑鏟動作交給 Seedance 2.5、Grok 1.5、Seedance 2.0 與 Hailuo 3 後的實際影片影格比較" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">實際影格比較：同題測試裡，Seedance 2.5 完成了動作；其他模型分別出現物理穿模、角色風格漂移與動作未完成。點圖可開啟原尺寸。</figcaption>
</figure>

我的原始評語是：「真的表現最好，有特技感且有慢動作的感覺，人物有順利躲過雷射，腳底火花的細節很讚。」

這裡面比較荒謬的地方是，Hailuo 給了 2K，卻沒有完成鏡頭最重要的動作。畫素比較多，不代表故事比較對。

Seedance 2.5 的官方模型頁把它定位在長篇敘事、多模態參考、影片延伸，以及首幀／首尾幀控制。[[2]](https://openrouter.ai/bytedance/seedance-2.5) 這些能力確實符合我的用例，但最後選它，不是因為產品頁這樣寫，而是它通過了我的鏡頭。

**排行榜與規格表負責縮小候選清單。最後的選型，還是要由自己的失敗模式決定。**

## 首幀、首尾幀、參考圖，其實是三種不同控制 {#control}

做 AI 影片時，「我有提供圖片」這句話太含糊了。

至少要分成三種模式：

- **首幀模式**：這張圖就是影片第一格。適合從核准畫面開始動。
- **首尾幀模式**：第一格與最後一格都指定。適合變身、轉場，或一定要抵達某個構圖的鏡頭。
- **參考圖驅動**：圖片只定義角色長相、服裝、道具或風格，不保證成為第一格。

我先用 5 秒變身鏡驗首尾幀。第一抽就通過，實付 US$1.16523。也在這裡踩到一個 API 約束：首尾幀模式不能再送 `aspect_ratio`，畫面比例要跟著首幀走。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a class="portfolio-lightbox" data-gallery="ai-video-rehearsal" href="{{ '/assets/img/ai-video-production-rehearsal/bunny-first-last-frames.jpg' | relative_url }}">
    <img src="{{ '/assets/img/ai-video-production-rehearsal/bunny-first-last-frames.jpg' | relative_url }}" alt="BUNNY AWAKENS 變身鏡的兩張實際核准關鍵幀：人類偽裝態首幀與力量解放態尾幀" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">實際製作素材：首幀規定從哪裡開始，尾幀規定 5 秒後必須抵達哪裡；模型負責生成兩者之間的動作。點圖可開啟原尺寸。</figcaption>
</figure>

接著我才把難度拉高：只給人物參考圖，不給首幀，讓角色在 30 秒一鏡到底裡從雨夜台北穿過沙漠，再到太空站。

我先做了一個 4 秒低解析度的探針測試（probe），花了 US$0.415。身分與換景都成立後，才值得送出 30 秒正式生成。

這個短測試看起來像多花一筆錢。實際上，它是在避免把 US$6.94 的長鏡頭拿來猜 API 行為。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a class="portfolio-lightbox" data-gallery="ai-video-rehearsal" href="{{ '/assets/img/ai-video-production-rehearsal/control-modes.svg' | relative_url }}">
    <img src="{{ '/assets/img/ai-video-production-rehearsal/control-modes.svg' | relative_url }}" alt="首幀、首尾幀與參考圖驅動三種 AI 影片控制模式比較：首幀鎖起點、首尾幀鎖起終點、參考圖驅動鎖角色與風格；先用低成本探針確認最不確定的部分" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖二：先問「我要控制什麼」，再選 API 模式；不要把所有圖片輸入都當成同一件事。</figcaption>
</figure>

## 30 秒概念預告：模型一次過，後製還是做了三版 {#bunny}

第一支彩排是 30 秒《BUNNY AWAKENS》。六個鏡頭裡，兩個英雄鏡交給 Seedance 2.5，短秒數支撐鏡交給 Grok 1.5。

五個新生成鏡頭第一抽全部完成，沒有重抽。這聽起來像順利結束了，其實只是另一種麻煩的開始。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a class="portfolio-lightbox" data-gallery="ai-video-rehearsal" href="{{ '/assets/img/ai-video-production-rehearsal/bunny-approved-storyboard-filmstrip.jpg' | relative_url }}">
    <img src="{{ '/assets/img/ai-video-production-rehearsal/bunny-approved-storyboard-filmstrip.jpg' | relative_url }}" alt="BUNNY AWAKENS 實際核准的 13 格製作分鏡總覽，包含眼睛特寫、街道行走、無人機搜索、兩組變身首尾幀與標題卡" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">實際前製總覽：13 格分鏡先逐格核准，影片生成失敗時才能退回一張已知正確的畫面，而不是從空白指令重來。點圖可開啟原尺寸。</figcaption>
</figure>

後製做了三版：

- v1：畫面、音效與畫面上的介面框都先組起來。
- v2：拿掉紅色介面方框，放回 Grok 原聲。
- v3：重做稀疏的 dark-industrial 配樂與事件導向聲音，才通過人工審核。

我也跑了三首付費 AI 配樂，再做三版免費程序式音樂對照。最後我仍然選付費的 C 版，但我的結論不是「付費模型比較好」。

原話是：「Hermes 舊案效果好主要來自選曲、分層、cue 對時與人工挑選；付費模型不保證主觀品質更好。」

工具可以一次給你三首歌。它不會替你決定哪一個呼吸點該留白，也不會知道爆炸聲晚 6 格會讓整個鏡頭看起來像廉價特效。

成片已放上 YouTube：[[3]](https://www.youtube.com/watch?v=lXnwBJBcbXY)

<div style="position:relative;width:100%;aspect-ratio:16 / 9;margin:2em 0;border-radius:14px;overflow:hidden;background:#000;">
  <iframe src="https://www.youtube-nocookie.com/embed/lXnwBJBcbXY?rel=0" title="BUNNY AWAKENS｜CloneX #15755 AI Cinematic Teaser" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>
</div>

## 兩支 93 秒《REROLL》：真正會壞的是參考圖系統 {#reroll}

08 月 27 日晚上，我把第二輪彩排拍板：同一個五段劇本，同時做卡通與擬真兩個版本。

到 08 月 28 日晚上，兩支 93.3 秒成片都完成並上傳。從需求問答、角色參考、14 張分鏡、付費生成、五輪審核、剪接到 YouTube 上傳包，大約 22 小時。

卡通版：[[4]](https://www.youtube.com/watch?v=WO2lMCWzVNQ)

擬真版：[[5]](https://www.youtube.com/watch?v=9CxNWxmb5qY)

<figure style="margin:2em auto;text-align:center;max-width:1200px;">
  <a class="portfolio-lightbox" data-gallery="ai-video-rehearsal" href="{{ '/assets/img/ai-video-production-rehearsal/reroll-cartoon-vs-photoreal.jpg' | relative_url }}">
    <img src="{{ '/assets/img/ai-video-production-rehearsal/reroll-cartoon-vs-photoreal.jpg' | relative_url }}" alt="REROLL 卡通版與擬真版在同一段沙漠轉場的實際成片影格比較" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">實際成片比較：同一個劇本與同一段轉場，在卡通與擬真兩條流程裡呈現出完全不同的材質與光影。兩支影片都是製作彩排與非正式參賽作品；點圖可開啟原尺寸。</figcaption>
</figure>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;margin:2em 0;">
  <div>
    <div style="position:relative;width:100%;aspect-ratio:16 / 9;border-radius:14px;overflow:hidden;background:#000;">
      <iframe src="https://www.youtube-nocookie.com/embed/WO2lMCWzVNQ?rel=0" title="REROLL｜CloneX AI 動畫短片（卡通版）" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>
    </div>
    <p style="font-size:0.9rem;color:#6b7280;margin-top:0.6em;">REROLL 卡通版｜93.3 秒</p>
  </div>
  <div>
    <div style="position:relative;width:100%;aspect-ratio:16 / 9;border-radius:14px;overflow:hidden;background:#000;">
      <iframe src="https://www.youtube-nocookie.com/embed/9CxNWxmb5qY?rel=0" title="REROLL｜CloneX AI 仿真短片（擬真版）" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>
    </div>
    <p style="font-size:0.9rem;color:#6b7280;margin-top:0.6em;">REROLL 擬真版｜93.3 秒</p>
  </div>
</div>

這一輪讓我看到三種很具體的失敗。

### 1. 寫實人物參考圖會被供應商擋

Seedance 會逐張檢查 `input_references`。同一角色的不同角度，有些通過，有些回 400；這類失敗不扣款，但會讓整段角色配置失效。

我最後讓工具支援 `--drop-indexes`：略過被擋圖片，並自動重編輸入指令裡的 `@Image N` 圖片編號與用途。這比人工刪圖片後再手改十二個索引可靠。

現場如果拿到寫實角色，第一件事不該是送 30 秒重點鏡頭，而是先用 480p、4 秒短測試，看參考圖到底能不能進模型。

### 2. 不同風格的參考圖不能混著補

擬真版最後一段缺了一個角色的可用寫實參考。我曾經拿卡通 sheet 補身分。

身分是回來了，整段卻被帶成動畫。

這個失敗很有用。它證明參考圖不是資料庫欄位，模型也不會只讀你希望它讀的部分。你放進去的每張圖，都可能同時影響長相、材質、比例與整體畫風。

最後我寧可把五人減成四人，也沒有再把兩種風格硬混在一起。

### 3. 一個形容詞也會把比例拉壞

我在多人鏡頭裡要求角色 `tall`，結果模型把所有人拉到約 8.5 頭身，看起來像被垂直縮放過。

後來我把指令改成約 7.5 頭身、自然比例、不拉伸，再明講誰比誰高半個頭，畫面才收回來。

這是 AI 生成常見的問題：人覺得是語意，模型常把它當畫面最佳化方向。形容詞沒有尺度，就會用你最不想看到的方式被放大。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a class="portfolio-lightbox" data-gallery="ai-video-rehearsal" href="{{ '/assets/img/ai-video-production-rehearsal/reference-failure-map.svg' | relative_url }}">
    <img src="{{ '/assets/img/ai-video-production-rehearsal/reference-failure-map.svg' | relative_url }}" alt="AI 影片參考圖的三種失敗與對策：寫實圖片被擋時先做低成本探針並略過問題圖；卡通與擬真混用造成風格漂移時只保留同風格參考；tall 等模糊形容詞造成比例拉長時改用可量化身形約束" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖四：參考圖不是越多越好。先分類失敗，再決定刪圖、降人數，還是換控制方式。</figcaption>
</figure>

## US$64.11 買到的不是成片秒數，是失敗資訊 {#cost}

這次 OpenRouter 實付如下：

| 項目 | 實付 |
|---|---:|
| 冒煙測試與四模型比較 | US$3.44 |
| 30 秒概念預告、首尾幀驗證與三首配樂 | US$4.65 |
| REROLL 參考模式短測試 | US$0.42 |
| REROLL 卡通版 7 次生成 | US$27.80 |
| REROLL 擬真版 7 次生成 | US$27.80 |
| **總計** | **US$64.11** |

後製、剪接、字卡、混音、品質檢查與 YouTube 上傳包都在本機完成，因此沒有額外 API 現金成本。圖像使用既有 ChatGPT 訂閱額度，我也沒有把它假裝成零成本，只是沒有再分攤進這次 OpenRouter 帳本。

兩支 90 秒版本都在最後一段用到第三次生成。原本每鏡最多重抽兩次；第三次必須由我明示放行，並在成本與生成帳本（ledger）留下原因。

這種紀律不酷，但很有用。沒有它，AI 助手最容易做的事不是偷懶，而是很勤勞地幫你把錯誤多生五次。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a class="portfolio-lightbox" data-gallery="ai-video-rehearsal" href="{{ '/assets/img/ai-video-production-rehearsal/cost-and-rolls.svg' | relative_url }}">
    <img src="{{ '/assets/img/ai-video-production-rehearsal/cost-and-rolls.svg' | relative_url }}" alt="AI 影片彩排成本圖：US$64.11 中有 US$56.02 花在 REROLL 雙風格長片，預算控制靠生成前估價、每鏡兩次上限與人工核准第三次生成" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">圖五：成本的大頭不是 API 呼叫次數，而是長秒數鏡頭與重抽。例外要可見，也要有人負責。</figcaption>
</figure>

## 審片看板最重要的功能，是不讓 AI 代替我說「可以」 {#review}

整場彩排留下 10 份正式審核紀錄，格式是方便程式接手的 JSON。

我做的 Dashboard（審片看板）只負責呈現：關鍵幀、鏡頭、版本差異、成本與待確認項目。需要我用眼睛判斷的地方，才放在畫面上。其他填寫與狀態更新走命令列工具。

<figure style="margin:2em auto;text-align:center;max-width:1100px;">
  <a class="portfolio-lightbox" data-gallery="ai-video-rehearsal" href="{{ '/assets/img/ai-video-production-rehearsal/offline-review-dashboard.jpg' | relative_url }}">
    <img src="{{ '/assets/img/ai-video-production-rehearsal/offline-review-dashboard.jpg' | relative_url }}" alt="BUNNY AWAKENS 實際離線審片頁，並排顯示首幀、尾幀與核准按鈕，記錄預算、檔案指紋及人工決定" style="width:100%;height:auto;border-radius:14px;">
  </a>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.7em;">實際審片畫面：預算、版本與檔案指紋可以由系統整理，但「是否核准付費生成」仍由人親自決定。點圖可開啟原尺寸。</figcaption>
</figure>

AI 助手可以提出草案，不能替我設定：

- 權利已清楚
- 預算已核准
- 鏡頭已通過
- 成片可以上傳

看板留下的審核紀錄檔才是唯一權威。AI 助手讀到核准，流程才往下走。

這跟我先前寫的 AI 權限與控制架構是同一件事，只是這次不是在談抽象設計，而是真的有影片、有帳單，也真的會在半夜把不該花的錢花掉。

另外，每張圖與每支影片旁都有製作紀錄檔：模型、輸入指令、生成任務編號、實付、檔案指紋、品質狀態與日期。狀態另有機器讀的 `case-status.json`、人讀的 `STATUS.md`，以及讓下一個 AI 助手接手的 `HANDOFF.md`。

任何一個 AI 工具中途中斷都不可怕。沒有接手點，才可怕。

## 權利與公開邊界：做得到，不等於什麼都能拿去用 {#rights}

這三支影片都是彩排、非參賽作品，也不是商業廣告。

角色來自我持有的 CloneX。含第三方藝術家特徵的角色只作非商業展示，不會放進正式參賽作品。YouTube 說明欄也已揭露畫面與聲音使用生成式 AI，以及作品與 RTFKT、Nike、主辦單位之間沒有贊助關係。

權利檢查目前不是「全部綠燈」：Grok output 已依相關條款查核；Seedance 透過聚合器使用時，模型條款對終端使用者的約束仍有未確認處。OpenRouter 本身也要求使用者遵守適用法律與上游條款。[[6]](https://openrouter.ai/terms)

所以我不會把 YouTube 的自動 Checks 寫成法律清權，也不會因為 API 成功回傳，就假設輸出可以拿去做任何商業用途。

**技術能不能做、平台讓不讓你上傳、法律上能不能使用，是三個不同的檢查關卡。**

## 如果明天進場，我只帶這條最小產線 {#playbook}

彩排完之後，我不會把所有工具都帶進比賽現場。工具越多，不一定越安全。

我會保留六件事：

1. **先做 4 秒短測試**：測角色參考與最難轉場，不用 30 秒鏡頭猜模型。
2. **分鏡先核准並凍結**：需要時可直接退回首幀模式，不從空白指令重來。
3. **每段只用同一風格參考**：缺角色就減少人數，不混用卡通與擬真人物參考圖。
4. **生成前先估價**：每鏡最多兩次，第三次必須人工核准。
5. **逐鏡製作紀錄＋單一審核紀錄**：中斷後能接手，也知道哪一版才算通過。
6. **最後一小時只做交件**：規格、音畫長度、揭露、檔名與封裝，不再重做創意。

我現在比較不在意哪個模型能不能一次生成 30 秒。

我更在意的是，當第 18 秒的角色突然變成另一個人時，整條產線知不知道該停在哪裡、要退回哪一格，以及再試一次會花多少錢。

那才是 AI 影片從展示片走向正式交付的分界。

---

## 參考資料

- **[1]** [OpenRouter：Video Generation 官方文件](https://openrouter.ai/docs/guides/overview/multimodal/video-generation)
- **[2]** [OpenRouter：ByteDance Seedance 2.5 模型頁](https://openrouter.ai/bytedance/seedance-2.5)
- **[3]** [BUNNY AWAKENS｜CloneX #15755 AI Cinematic Teaser](https://www.youtube.com/watch?v=lXnwBJBcbXY)
- **[4]** [REROLL｜CloneX AI 動畫短片（卡通版）](https://www.youtube.com/watch?v=WO2lMCWzVNQ)
- **[5]** [REROLL｜CloneX AI 仿真短片（擬真版）](https://www.youtube.com/watch?v=9CxNWxmb5qY)
- **[6]** [OpenRouter：Terms of Service](https://openrouter.ai/terms)
