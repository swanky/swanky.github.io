---
title: "Malfoid 三週爆紅：AI 把「角色一致」從畫功變成資料準備"
seo_title: "Malfoid 女版馬份爆紅解析：IP-Adapter、LoRA、DreamBooth 與多參考影片模型如何鎖住角色"
date: 2026-10-14
published: false
categories: [technical]
tags: [ai-video, character-consistency, diffusion, lora, fan-culture]
layout: article
cover_image: /assets/img/linkedin/malfoid-ai-character-consistency.jpg
cover_alt: "史旺姬在夕陽工作室把參考照片釘上軟木板，紅線串起同一角色的不同角度與表情，一張不像的被紅筆打叉"
hero_image: true
use_glightbox: true
mid_cta: false
cta_context: agentic
related_posts:
  - ai-video-consistency-reference-previs
  - ai-video-reference-breakdown
  - ai-video-sound-rights-release-check
description: "一張女版馬份同人圖，三週內長成 AI 短片、LoRA 與生成網站。從 Textual Inversion、DreamBooth、LoRA、IP-Adapter 到商用多參考影片模型，拆解角色一致性怎麼被做出來、又在哪裡會壞。"
keywords: Malfoid, 女版馬份, AI 角色一致性, IP-Adapter, LoRA, DreamBooth, InstantID, Seedance 2.5, Kling Element, Soul ID, 史旺基
---

一個存在十五年的同人點子，為什麼偏偏在 2026 年 9 月，三週內長成了一整個影片類型？

女版馬份（Draco Malfoy 性轉）不是新東西。Know Your Meme 能追到 2011 年 11 月的 Tumblr 貼文；2024 年 3 月 @grizz056 的「If Malfoy was a girl」也拿過 6 萬讚，但都沒有變成潮流。[[1]](https://knowyourmeme.com/memes/malfoid-female-draco-malfoy)

這次不一樣。9 月 22 日 @redteneri 的一張圖之後，跟進的不只是繪師，還有一批 AI 影片帳號；到 10 月中，已經有一分鐘的劇情短片、Civitai 上的多個 LoRA、粉絲做的視覺小說與音樂影片。[[1]](https://knowyourmeme.com/memes/malfoid-female-draco-malfoy)[[2]](https://www.fandompulse.com/p/malfoid-fan-art-trend-takes-over)

我關心的不是這個梗本身，而是它暴露出的一件技術事實：**「讓同一個角色在不同畫面裡還是同一個人」，在三年內從一個研究問題，變成了社群幾天就能分發的資料包。**

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>點子不新，跟進成本新</strong>：性轉馬份流傳十五年，關鍵圖發布 5 天後，Civitai 上就有以它為基礎的 LoRA。</li>
    <li><strong>角色一致性有兩條技術路線</strong>：改權重（DreamBooth、LoRA）或在推論時注入參考特徵（IP-Adapter、InstantID）；商用影片模型把後者包成「多參考輸入」與「元素庫」。</li>
    <li><strong>門檻從畫功移到資料準備</strong>：參考圖的角度、光線、角色分工，現在比 prompt 文字更決定成敗。</li>
    <li><strong>沒被解決的是品質尾巴與權利</strong>：逐格瑕疵、身份與可編輯性的取捨、原作 IP 與名稱爭議，模型都不會替你處理。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part">
      <span class="article-toc-part-title">一個梗怎麼擴散</span>
      <ol class="article-toc-items">
        <li><a href="#what">Malfoid 是什麼，名字為什麼有爭議</a></li>
        <li><a href="#speed">三週裡發生了什麼</a></li>
        <li><a href="#why-now">為什麼是這個角色、這個時間點</a></li>
      </ol>
    </li>
    <li class="article-toc-part">
      <span class="article-toc-part-title">角色一致性的技術拆解</span>
      <ol class="article-toc-items">
        <li><a href="#weights">路線一：把角色寫進權重</a></li>
        <li><a href="#adapters">路線二：推論時注入參考特徵</a></li>
        <li><a href="#video">影片模型把這些包成產品</a></li>
        <li><a href="#break">它會在哪裡壞</a></li>
        <li><a href="#me">如果是我，我會這樣做角色</a></li>
      </ol>
    </li>
  </ol>
</nav>

## Malfoid 是什麼，名字為什麼有爭議 {#what}

Malfoid 是《哈利波特》Draco Malfoy 的粉絲性轉版本，不在書、電影或 HBO 影集裡。[[2]](https://www.fandompulse.com/p/malfoid-fan-art-trend-takes-over) 外型很快收斂成固定規格：鉑金長髮、史萊哲林制服、綠銀條紋領帶、圈形耳環；性格是嘲諷哈利、然後臉紅的傲嬌。[[2]](https://www.fandompulse.com/p/malfoid-fan-art-trend-takes-over)[[3]](https://malfoid.wiki/memes)

粉絲站把它比作 2018 年把庫巴畫成公主的 Bowsette：一個大家都認得的角色，被重畫成女生，一週內洗版。[[3]](https://malfoid.wiki/memes)

名字本身是爭議點。Know Your Meme 解釋，這個詞是 Malfoy 加上 incel 社群貶低女性的「foid」（源自 femoid）。[[1]](https://knowyourmeme.com/memes/malfoid-female-draco-malfoy) 該站作者也寫到，這波使用看起來不是要貶低角色，比較像兩個字剛好好拼。[[2]](https://www.fandompulse.com/p/malfoid-fan-art-trend-takes-over) 我沿用這個詞，是因為它就是這個趨勢的檢索關鍵字；不代表我接受字源。

反應也明顯分裂。Bluesky 上有繪師因原作者相關爭議遭到抨擊，刪圖道歉後改貼到 X；另一邊則有人把它當成「傳統浪漫」來推崇。[[2]](https://www.fandompulse.com/p/malfoid-fan-art-trend-takes-over) 技術媒體的評論則集中在「AI slop」與單格錯誤。[[5]](https://templepc.com/articles/malfoid-divides-the-internet-fan-fun-or-more-ai-slop/) 這些立場我只轉述，不站隊；本文要談的是它在技術上說明了什麼。

## 三週裡發生了什麼 {#speed}

依 Know Your Meme 與 Fandom Pulse 的紀錄整理（數字為各頁記錄當下，社群數字會持續變動）：

| 日期（2026） | 事件 | 紀錄數字 |
|---|---|---|
| 1 月 10 日 | 「Malfoid」一詞首次被用在 Draco 身上（純文字推文） | — [[1]](https://knowyourmeme.com/memes/malfoid-female-draco-malfoy) |
| 9 月 22 日 | @redteneri 發布關鍵圖 | 一週 8.9 萬讚；至 10/12 達 2,190 萬瀏覽、17.4 萬讚 [[1]](https://knowyourmeme.com/memes/malfoid-female-draco-malfoy)[[2]](https://www.fandompulse.com/p/malfoid-fan-art-trend-takes-over) |
| 9 月 27 日 | 以 @redteneri 版本為基礎的 Civitai LoRA 發布 | Anima 基底 [[10]](https://civitai.com/models/2967285/draco-malfoid-malfoy-redteneri-genderswap-femdraco-or-harry-potter) |
| 9 月 29 日 | @masoq095 三版本圖；r/dankmemes 擴散 | 至 10/12 達 12.6 萬讚 [[2]](https://www.fandompulse.com/p/malfoid-fan-art-trend-takes-over) |
| 10 月 1–3 日 | Krea 2、Illustrious XL 等多個 LoRA 上架 | [[11]](https://civitai.com/models/2981000/malfoid-or-draco-malfoy-or-meme-or-illustrious-xl)[[12]](https://civitai.com/models/2978006/malfoid) |
| 10 月 12 日 | 一分鐘舞會劇情動畫 | 86.7 萬瀏覽 [[2]](https://www.fandompulse.com/p/malfoid-fan-art-trend-takes-over) |

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="malfoid-ai-character-consistency" data-type="image" href="{{ '/assets/img/technical/malfoid-ai-character-consistency/timeline.svg' | relative_url }}">
    <img src="{{ '/assets/img/technical/malfoid-ai-character-consistency/timeline.svg' | relative_url }}" alt="時間線：十五年零星同人，2026 年 9 月 22 日後三週內擴散到 AI 短片與 LoRA" width="1200" height="520" loading="lazy">
  </a>
  <figcaption>十五年累積，三週擴散。資料：Know Your Meme [1]、Fandom Pulse [2]。</figcaption>
</figure>

這張表最值得注意的不是瀏覽數，而是 **9 月 22 日到 9 月 27 日之間的 5 天**：一個只存在於幾張同人圖裡的造型，已經被整理成訓練資料、做成可下載的 LoRA，觸發詞直接寫成「femdraco, blonde hair, ringed eyes, black hoop earrings, hogwarts school uniform…」。[[10]](https://civitai.com/models/2967285/draco-malfoid-malfoy-redteneri-genderswap-femdraco-or-harry-potter)

**換句話說，角色設定第一次以「可執行的權重檔」形式流通，而不只是一張圖。**

## 為什麼是這個角色、這個時間點 {#why-now}

我的判斷是三個條件同時成立，以下屬於分析而非量測：

1. **角色規格低熵、高辨識**：鉑金長髮＋綠銀領帶＋黑袍，幾個屬性就能定義一個人。對生成模型來說，屬性越少、越對比，身份越容易被鎖住。
2. **敘事單位剛好等於模型能撐的長度**：嘲諷、停頓、臉紅，一個情緒轉折。AutoWeeb 也觀察到，這些多是不到一分鐘的直式短片，「AI 影片終於能讓一張臉撐到微表情落地」。[[4]](https://autoweeb.com/blog/malfoid-anime-trend-explained)
3. **工具鏈在 2026 年已經成熟到「拿來就用」**：Seedance 2.5 一次可吃 30 張圖的參考，Kling 有元素庫，Higgsfield 有訓練式身份；社群又同步釋出 LoRA。[[6]](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character)[[7]](https://runware.ai/docs/models/bytedance-seedance-2-5/guides/multi-reference-production)[[8]](https://kling.ai/quickstart/klingai-element-library-3-user-guide)

2024 年 @grizz056 那次，第一點已經成立，缺的是第二、三點。

## 路線一：把角色寫進權重 {#weights}

角色一致性在學術上通常叫 **subject-driven generation** 或 **identity preservation**：給定少量主體圖片，讓擴散模型在新場景、新姿勢下生成「同一個主體」。主流解法分兩條路線，差別在於**角色資訊存在哪裡**。

第一條路線是**微調（fine-tuning）**，把角色存進模型參數。

- **Textual Inversion**（Gal et al., 2022）：完全不動生成模型，只在文字編碼器的詞嵌入空間學一個新向量 `S*`，用 3–5 張圖讓「一個新字」代表這個概念。[[13]](https://arxiv.org/abs/2208.01618) 參數極少、可攜，但表達力有限，臉部細節常抓不穩。
- **DreamBooth**（Ruiz et al., 2022）：微調整個 U-Net，把罕見 token 綁到主體上，並加入 **class-specific prior preservation loss**，用模型自己生成的同類別圖片做正則，避免「所有女生都長成她」的語言漂移與過擬合。[[14]](https://arxiv.org/abs/2208.12242) 保真度高，但每個角色都要一份完整權重。
- **LoRA**（Hu et al., 2021）：原本為大型語言模型提出，凍結預訓練權重 `W`，只學低秩增量 `ΔW = BA`（秩 r 遠小於維度）。[[15]](https://arxiv.org/abs/2106.09685) 套用到擴散模型的注意力層後，一個角色的權重差異可以壓到上百 MB 級，正好符合 Civitai 上 Malfoid LoRA 的 66–218 MB 檔案大小。[[10]](https://civitai.com/models/2967285/draco-malfoid-malfoy-redteneri-genderswap-femdraco-or-harry-potter)[[12]](https://civitai.com/models/2978006/malfoid)

這條路線的取捨很清楚：**先付訓練成本，換來推論時不必再帶參考圖**。缺點是綁死基底模型——Civitai 上同一個角色就分別有 Anima、Illustrious、Krea 2 版本，因為 LoRA 不能跨架構直接共用。[[10]](https://civitai.com/models/2967285/draco-malfoid-malfoy-redteneri-genderswap-femdraco-or-harry-potter)[[11]](https://civitai.com/models/2981000/malfoid-or-draco-malfoy-or-meme-or-illustrious-xl)[[12]](https://civitai.com/models/2978006/malfoid)

Higgsfield 的 Soul ID 也屬於這一側：要求同一人 20–80 張、多角度、光線良好的照片，訓練幾分鐘後重複使用。官方文件自己寫得很誠實：期待的是「明顯是同一個人」，而不是逐像素相同的臉。[[6]](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character)

## 路線二：推論時注入參考特徵 {#adapters}

第二條路線**不改基底權重**，而是在每次生成時，把參考圖編碼成條件訊號，送進去參與去噪。

- **IP-Adapter**（Ye et al., 2023）：用 CLIP 影像編碼器把參考圖轉成特徵，再透過 **decoupled cross-attention**——文字特徵與影像特徵各走一組 cross-attention，輸出相加——注入 U-Net。可訓練參數約 22M，就能做到接近完整微調的效果，而且可以和原本的文字提示、ControlNet 並用。[[16]](https://arxiv.org/abs/2308.06721)
- **InstantID**（Wang et al., 2024）：專攻人臉。它不用 CLIP 那種偏語意的全域特徵，改用人臉辨識模型抽出的 **ID embedding** 加上臉部關鍵點，經過 IdentityNet 做空間條件控制，號稱單張圖、零訓練就能保留身份。[[17]](https://arxiv.org/abs/2401.07519)
- **PhotoMaker**（Li et al., 2023）：把多張輸入照片的 ID embedding 堆疊成 **stacked ID embedding**，用多張圖互補單張圖的姿勢、光線偏差。[[18]](https://arxiv.org/abs/2312.04461)

這條路線的優點是**零訓練、即插即用**；代價是每次都要帶參考圖，而且編碼器看到什麼，就只能保留什麼。CLIP 特徵偏語意，常保住「金髮、綠領帶」卻漏掉眼型；人臉 ID 特徵則對動漫臉、側臉與遮擋不穩，因為辨識模型主要是用真人照片訓練。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="malfoid-ai-character-consistency" data-type="image" href="{{ '/assets/img/technical/malfoid-ai-character-consistency/reference-roles.svg' | relative_url }}">
    <img src="{{ '/assets/img/technical/malfoid-ai-character-consistency/reference-roles.svg' | relative_url }}" alt="四種鎖角色做法依準備成本與跨鏡頭穩定度排列：單張參考、多參考輸入、元素庫、訓練身份與 LoRA" width="1200" height="640" loading="lazy">
  </a>
  <figcaption>定性排序示意，非量測。不同做法可以疊加使用。資料：[6][7][8][10]。</figcaption>
</figure>

我的實務心得是：**這兩條路線不是二選一，而是疊加**。LoRA 鎖住畫風與服裝語彙，參考特徵鎖住臉，文字負責場景與動作。三者打架時，最常見的症狀是「臉對了但姿勢僵」或「姿勢對了但臉變成另一個人」——我把它理解為身份保真與可編輯性（fidelity vs. editability）之間的取捨：條件訊號越強，文字能改動的空間越小。

## 影片模型把這些包成產品 {#video}

Malfoid 短片用到的 Seedance、Kling、Higgsfield 是商用系統，**沒有公開內部架構**，所以我不假裝知道它們用的是 IP-Adapter 還是別的東西。能確定的是它們對外暴露的介面，以及介面透露出的設計假設：

| 工具 | 介面 | 文件要求的資料準備 | 隱含的設計假設 |
|---|---|---|---|
| Seedance 2.5（經 Runware） | 單次最多 30 圖、10 影片、10 音訊參考；以 `@Image1` 在 prompt 中指名 | 每張參考指派角色名；排在前面的參考身份保持最穩；最後加「保留臉、髮、服裝」條款 | 多個參考會互相平均，需要明確綁定 [[7]](https://runware.ai/docs/models/bytedance-seedance-2-5/guides/multi-reference-production) |
| Kling 3.0 Element | 元素需 2–4 張圖（1 主＋最多 3 補充）；可跨鏡頭重複呼叫 | 多角度、多表情 | 身份是一個可重用的「資產」 [[8]](https://kling.ai/quickstart/klingai-element-library-3-user-guide) |
| Kling 3.0 Motion Control | 參考圖＋參考動作影片；可綁 1 個臉部元素 | 角色需佔畫面 5% 以上、避免遮擋；動作影片最長 30 秒 | 動作與身份分開供應 [[9]](https://fal.ai/models/fal-ai/kling-video/v3/pro/motion-control/api) |
| Higgsfield Soul ID | 訓練式身份 | 20–80 張同一人照片、含全身照 | 用訓練換跨生成穩定 [[6]](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character) |

Runware 的文件有一段很有技術含量的觀察：三張人像若沒有各自綁定角色名，會被模型「平均成一個合成臉」。[[7]](https://runware.ai/docs/models/bytedance-seedance-2-5/guides/multi-reference-production) 這跟 PhotoMaker 堆疊 ID embedding 時要處理的問題本質相同——多個身份訊號在條件空間裡混在一起。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="malfoid-ai-character-consistency" data-type="image" href="{{ '/assets/img/technical/malfoid-ai-character-consistency/workflow.svg' | relative_url }}">
    <img src="{{ '/assets/img/technical/malfoid-ai-character-consistency/workflow.svg' | relative_url }}" alt="五步工作流：參考表、鎖定身份、附參考圖的 prompt、影片模型、人工挑選；不合格回到生成" width="1200" height="600" loading="lazy">
  </a>
  <figcaption>創作者公開工作流的共同骨架。工具名稱依文件與報導，未逐一實測。</figcaption>
</figure>

## 它會在哪裡壞 {#break}

把角色鎖住，不等於把片子做好。至少有四個尾巴還在：

1. **逐格瑕疵與時間一致性**：TemplePC 整理的反應裡，最常見的批評就是單格錯誤與「AI slop」。[[5]](https://templepc.com/articles/malfoid-divides-the-internet-fan-fun-or-more-ai-slop/) 影片模型的身份保持是逐幀條件，長鏡頭、大轉頭、手部遮臉時最容易漂。
2. **風格域外推**：InstantID、Soul ID 這類用真人照片訓練的身份系統，碰上動漫臉會失準；Soul ID 文件也承認極端風格轉換會帶來漂移。[[6]](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character) 這就是為什麼 Malfoid 社群主要用動漫基底的 LoRA，而不是人臉身份模型。
3. **權利沒有被降低**：這是未授權的《哈利波特》衍生創作。LoRA 把「誰的設計」也一併打包——Civitai 上那份模型名稱直接寫著「Based on Redteneri's Genderswap Draco」。[[10]](https://civitai.com/models/2967285/draco-malfoid-malfoy-redteneri-genderswap-femdraco-or-harry-potter) 原作 IP、二創繪師的設計、訓練資料的取得，三層權利都沒有因為工具變簡單而消失。
4. **社群觀感**：同一張圖在 X 拿到十幾萬讚，在 Bluesky 卻讓繪師刪圖道歉。[[2]](https://www.fandompulse.com/p/malfoid-fan-art-trend-takes-over) 平台文化本身就是產品風險。

<figure class="ae-fig ae-fig--wide">
  <a class="portfolio-lightbox" data-gallery="malfoid-ai-character-consistency" data-type="image" href="{{ '/assets/img/technical/malfoid-ai-character-consistency/what-got-cheaper.svg' | relative_url }}">
    <img src="{{ '/assets/img/technical/malfoid-ai-character-consistency/what-got-cheaper.svg' | relative_url }}" alt="左欄變便宜：角色一致、圖轉短片、複製角色設定；右欄沒變便宜：好梗、細節品質、權利與觀感" width="1200" height="560" loading="lazy">
  </a>
  <figcaption>作者整理判斷。</figcaption>
</figure>

## 如果是我，我會這樣做角色 {#me}

這個網站的 Banner 主角史旺姬，就是我每天在處理的同一個問題：模型不會記得她長什麼樣子，所以每一次生成都要附上同一組參考照。從 Malfoid 這波，我會帶走四個判準：

| 判準 | 具體做法 | 為什麼 |
|---|---|---|
| 先定規格，再談 prompt | 把角色縮到 4–6 個高對比屬性，寫成文字也寫成參考表 | 低熵規格比長 prompt 更容易被鎖住 |
| 參考圖當資料集管理 | 正面、三分之四側、全身、表情各一，光線一致；每張指定「負責什麼」 | 互相矛盾的參考會被平均掉 [[7]](https://runware.ai/docs/models/bytedance-seedance-2-5/guides/multi-reference-production) |
| 依量產規模選路線 | 一次性用參考注入；長期連載才訓練 LoRA／身份 | 訓練成本只有在重複使用時才回本 |
| 挑選要列預算 | 預期候選數、淘汰標準（臉、髮、手、服裝）寫在前面 | 身份保持是機率性的，不是保證 |

工具把「讓她一直是她」變成了一份資料準備工作。可是讓人想按讚的，還是那個「嘲諷完會臉紅」的念頭——那一步，到現在還沒有人能用 LoRA 打包。

本文資料截點為 2026 年 10 月 14 日；社群數字依各來源記錄當下，原始 X 貼文未逐一直接讀取，以 Know Your Meme 與 Fandom Pulse 的轉述為準。

## 參考資料

- **[1]** [Know Your Meme：Malfoid / Female Draco Malfoy](https://knowyourmeme.com/memes/malfoid-female-draco-malfoy)
- **[2]** [Fandom Pulse：Malfoid Fan Art Trend Takes Over Harry Potter Fandom（2026-10-12）](https://www.fandompulse.com/p/malfoid-fan-art-trend-takes-over)
- **[3]** [malfoid.wiki：Malfoid Memes Explained](https://malfoid.wiki/memes)
- **[4]** [AutoWeeb：What Is the Malfoid Anime Trend?（2026-10-12）](https://autoweeb.com/blog/malfoid-anime-trend-explained)
- **[5]** [TemplePC：Malfoid: Harry Potter AI Fan Animations Draw Mixed Reactions（2026-10-12）](https://templepc.com/articles/malfoid-divides-the-internet-fan-fun-or-more-ai-slop/)
- **[6]** [Higgsfield：How to Create and Use a Soul ID Character](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character)
- **[7]** [Runware Docs：Multimodal reference — Seedance 2.5 API](https://runware.ai/docs/models/bytedance-seedance-2-5/guides/multi-reference-production)
- **[8]** [Kling AI：Element Library User Guide](https://kling.ai/quickstart/klingai-element-library-3-user-guide)
- **[9]** [fal：Kling Video v3 Pro Motion Control API](https://fal.ai/models/fal-ai/kling-video/v3/pro/motion-control/api)
- **[10]** [Civitai：Draco "Malfoid" Malfoy Redteneri Genderswap (FemDraco) LoRA](https://civitai.com/models/2967285/draco-malfoid-malfoy-redteneri-genderswap-femdraco-or-harry-potter)
- **[11]** [Civitai：Malfoid Illustrious XL LoRA](https://civitai.com/models/2981000/malfoid-or-draco-malfoy-or-meme-or-illustrious-xl)
- **[12]** [Civitai：Malfoid Krea 2 LoRA](https://civitai.com/models/2978006/malfoid)
- **[13]** [Gal et al.：An Image is Worth One Word (Textual Inversion), arXiv:2208.01618](https://arxiv.org/abs/2208.01618)
- **[14]** [Ruiz et al.：DreamBooth, arXiv:2208.12242](https://arxiv.org/abs/2208.12242)
- **[15]** [Hu et al.：LoRA: Low-Rank Adaptation of Large Language Models, arXiv:2106.09685](https://arxiv.org/abs/2106.09685)
- **[16]** [Ye et al.：IP-Adapter, arXiv:2308.06721](https://arxiv.org/abs/2308.06721)
- **[17]** [Wang et al.：InstantID, arXiv:2401.07519](https://arxiv.org/abs/2401.07519)
- **[18]** [Li et al.：PhotoMaker, arXiv:2312.04461](https://arxiv.org/abs/2312.04461)
