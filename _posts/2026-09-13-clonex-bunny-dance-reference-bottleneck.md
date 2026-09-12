---
title: "我讓五隻 CloneX 跳 KPOP：參考影片可能才是瓶頸"
seo_title: "CloneX 與 Bunny AI 舞蹈實測：Blender、Seedance 文字編舞與深度參考比較"
date: 2026-09-13
published: true
categories: [technical]
tags: [ai-video, ai-agent, clonex, seedance, blender, motion-reference]
layout: article
cover_image: /assets/img/technical/clonex-bunny-dance-reference-bottleneck/cover.jpg
cover_alt: "水手服品牌角色在工作室對照舞蹈影像與三維人形參考，思考動作和外觀如何分工的概念圖"
hero_image: true
mid_cta: false
cta_context: ai-visual
related_posts:
  - ai-video-production-rehearsal-seedance-workflow
  - ucx-uniform-clonex-origin
description: "看完 GPT‑6 Astra 的火箭建模與 3D 列印示範，我把 Blender 裝回來，想試試手上 NFT 提供的三維模型能否協助製作 AI 影片。從五隻 CloneX 群舞到 Bunny 的文字與深度比較，這篇用白話整理實測、失敗與尚未驗證的假設。"
keywords: CloneX, Bunny, AI 舞蹈, Seedance, Blender, 深度參考, 文字編舞, KPOP, AI Agent, 史旺基
---

<style>
.bunny-study{--study-line:#dedbd5;--study-paper:#f7f5f1;--study-ink:#232020;overflow-wrap:anywhere}
.bunny-study .study-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;margin:28px 0}
.bunny-study figure{min-width:0;margin:0;background:var(--study-paper);border:1px solid var(--study-line);border-radius:12px;padding:14px}
.bunny-study .study-pair img,.bunny-study video{display:block;width:100%;height:auto;object-fit:contain;background:#101826;border-radius:6px}
.bunny-study figcaption{font-size:16px;line-height:1.7;margin-top:12px;color:#4b4540}
.bunny-study figcaption strong{display:block;color:var(--study-ink);margin-bottom:5px}
.bunny-study .study-table{overflow-x:auto;margin:24px 0;border:1px solid var(--study-line);border-radius:10px}
.bunny-study .study-table table{margin:0;width:100%;min-width:580px}
.bunny-study .study-table th,.bunny-study .study-table td{white-space:normal;vertical-align:top;padding:12px;font-size:16px;line-height:1.65}
.bunny-study .study-note{border-left:4px solid #8a5d00;padding:16px 20px;background:#fff8e8;margin:24px 0}
.bunny-study .study-note p:last-child{margin-bottom:0}
.bunny-study .study-reference-map{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:24px 0}
.bunny-study .study-reference-map>div{background:var(--study-paper);padding:18px;border:1px solid var(--study-line);border-radius:10px}
.bunny-study .study-reference-map strong{display:block;font-size:20px;margin-bottom:8px}
.bunny-study .study-reference-map p{font-size:17px;line-height:1.7;margin:0}
.bunny-study summary{cursor:pointer;color:#8a5d00;font-weight:700;padding:16px 0}
.bunny-study .study-small{font-size:16px;color:#625b55}
@media(max-width:600px){.bunny-study .study-pair,.bunny-study .study-reference-map{grid-template-columns:1fr}.bunny-study .study-pair{gap:18px}.bunny-study figure{padding:12px}.bunny-study figcaption{font-size:16px}}
@media(max-width:600px){body:has(.bunny-study) .back-to-top{display:none!important}}
</style>

<div class="bunny-study" markdown="1">

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>三維模型載得進來，不等於角色已經會表演。</strong>衣服沒整理好、動作資料沒接好，這些問題都可能被帶進後面的 AI 影片。</li>
    <li><strong>這輪文字編舞比較合我的口味，深度也有還原舞步的價值。</strong>兩件事不衝突，但不能拿不同舞步硬排高下。</li>
    <li><strong>下一個想測的是動作來源。</strong>自然的真人 KPOP 表演轉成匹配深度，仍是尚未執行的假設。</li>
  </ul>
</div>

讓我把 Blender 裝回電腦的，其實不是舞蹈影片，而是一枚火箭。

我看了 [OpenAI 的 GPT‑6 Astra 介紹頁](https://openai.com/zh-Hant/index/gpt-6-astra/)裡的示範影片：有人從無到有做出一個火箭的 3D 模型，最後還把它 3D 列印出來。也就是把螢幕裡的立體設計，變成可以拿在手上的實物。看完，我想到的不是自己也做一枚火箭，而是手上那些原本就附有三維模型的 NFT。

NFT 可以先理解成用區塊鏈記錄持有關係的數位收藏。我這裡說的 **Metaverse Ready**，指的是像 CloneX、Meebit 這類有提供 3D 模型的 NFT，不只有一張代表圖片。它不是「保證能直接放進所有遊戲或元宇宙」的通用認證，更不等於所有用途的授權都已經處理好。

既然模型已經有了，能不能拿來輔助製作 AI 影片？我不必從零捏一個角色，或許可以先安排它的造型、角度與動作，再把畫面交給 AI 做後續生成。**我想試的，是這些原本躺在資料夾裡的三維資產，對自己的創作到底有沒有用。**

所以我重新裝上 Blender。它是一套免費、開放原始碼的三維製作軟體，可以把角色放進虛擬場景，安排燈光、鏡頭與動畫。這次先選自己的五隻 CloneX，目標很直白：讓它們一起跳 KPOP，也就是韓國流行音樂常見的舞蹈風格。後來再縮小到其中的 Bunny（CloneX #15755），集中處理單人表演。

我已經有角色模型，也找得到舞蹈動作。照理說，把它們放進同一個舞台，再讓 Seedance 這個 AI 影片生成模型把畫面整理漂亮，應該就差不多了。結果第一批影片做出來，我的回饋是：「不好看，蠻失望的。」

不是工作失敗。檔案有出來，影片也能播放。只是我想看的角色表演，跟眼前那支片之間，還有一段距離。

這篇整理的是 2026 年 9 月 11～13 日的個人研究。方向、穿搭取捨與審片由我決定；模型盤點、Blender 操作、腳本、素材整理及生成送件，由 AI agent 協助執行。Agent 在這裡就是會使用工具完成工作的 AI 助手，不是我突然學會了整套動畫製作。

先看最初被我退回的十二秒片，以及後來比較喜歡的 A2 八秒片。A2 是後面比較試片的編號，不是另一個模型。它們是第一批結果與後續修正版，**不是只改一項條件的對照實驗**。

<div class="study-pair">
  <figure>
    <video controls playsinline preload="metadata" poster="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/rejected-poster.jpg' | relative_url }}" aria-label="最初被退回的十二秒 Bunny Seedance 試片" aria-describedby="cap-rejected"><source src="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/rejected.mp4' | relative_url }}" type="video/mp4">瀏覽器無法播放，請使用下方原片連結。</video>
    <figcaption id="cap-rejected"><strong>最初：有動作，但不是我要的感覺</strong>首批十二秒試片。金髮、兔耳與機械腿仍可辨識；「不好看」是我的審片回饋，不是解碼失敗。<a href="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/rejected.mp4' | relative_url }}">開啟完整試片</a>。</figcaption>
  </figure>
  <figure>
    <video controls playsinline preload="metadata" poster="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/a2-poster.jpg' | relative_url }}" aria-label="A2 寬構圖加臉部參考的八秒文字編舞試片，無音軌" aria-describedby="cap-a2"><source src="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/a2.mp4' | relative_url }}" type="video/mp4">瀏覽器無法播放，請使用下方原片連結。</video>
    <figcaption id="cap-a2"><strong>後來：A2 文字編舞，八秒</strong>取樣可見側踏、展臂與交叉步，四周留出更多空間。但角色圖、臉部參考、動作提示與片長都變了，不能單押一個原因。無音軌。<a href="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/a2.mp4' | relative_url }}">開啟完整試片</a>。</figcaption>
  </figure>
</div>

## 載入成功，離登台還很遠 {#models}

盤點結果很容易讓人樂觀：240 份不同內容的模型，239 份成功載入；剩下一份是當時工具不支援的文字版 FBX，也就是一種三維模型交換格式。但另一個數字要小心讀：80 組素材有總覽圖片，不代表有 80 隻整理好的完整人物。

裡面有身體、衣物和其他部件。能開啟，只證明軟體讀得懂資料，沒有保證衣服合身，或關節已準備好跳舞。三維角色還需要材質與貼圖：前者決定表面像金屬、布料還是皮膚，後者補上顏色和細節。這次就碰到形狀資料損壞、貼圖缺漏，只能先用灰色外觀替代的狀況。

真正開始動，更能看出差別。首版五人群舞一度有共用的動作資料，角色卻不動。Agent 修正 Blender 4.5 的動作槽位綁定，也就是把「這段動作」接到「這個角色」的設定，才讓資料生效。有一份名叫「舞蹈」的資料，不代表人物正在跳舞。

後來用到的 aespa〈KISS N TELL〉動作，是 **BerserkiKun 製作的 VMD**，也就是保存虛擬骨架動作的檔案，並非藝人官方發布的動畫。骨架可以想成角色身上的一組可動關節，動作檔記錄它們何時抬手、彎膝或轉身；把這套動作接到另一個角色，還得處理身材比例與關節位置的差異。[[1]](https://www.patreon.com/Berserkikun/posts/47-free-aespa-n-166592131)

轉接時把原本每秒三十格的動作取樣成二十四格，試片取其中十二秒。主要順序保留了，卻還沒完成腳掌鎖定，也就是讓支撐腳踩地時不亂滑；頭髮和布料隨動作擺動的物理模擬，也還沒做好。

換句話說，這時候拿到的是能動的工作版本，不是已經自然的舞蹈表演。

## 先把褲子穿回來，再談畫面升級 {#repairs}

我最先在意的，不是模型有多先進，而是畫面裡的人到底穿了什麼。

編號 #15162 和 #17152 的兩個角色，長褲曾被誤放進隱藏清單。修正方法就是把原長褲恢復，不是再寫一句「請保留服裝」。鞋子也走過簡化造型、大小不合適，再換用 MakeHuman 社群提供的三維鞋款模型。免費取得和可以任意使用是兩回事，作者、授權與修改紀錄都得留下。[[2]](https://static.makehumancommunity.org/assets/assetpacks/shoes01.html)

Bunny 的頭髮也不是隨便換個顏色。初期載入的版本是銀白短髮，後來才從舊版女身體髮型包找到金色長髮和紫色機械兔耳耳機。角色資料很多，不代表全部都是同一套正確答案。

接著是衣物穿插，也就是身體或其他衣物穿出衣服表面。Agent 用向外推離衣物、遮住內部身體等方法修正。抽樣量測有改善，但我不會把它寫成「穿模已經修好了」：那些檢查只涵蓋特定時間點與一種穿入條件，不是整支片逐格驗收。

鏡頭晃動與畫面上的字，也被我要求拿掉。我想先看清楚角色的動作，不想靠熱鬧的剪接掩蓋問題。五人之後收斂到 Bunny 單人，是把問題拆小：先讓一個角色看得下去，再回來談群舞。

## Seedance 成功了，我卻不想留下那支片 {#first-results}

最初的想法，是把整理過的 Blender 舞片送進 Seedance，請模型保留舞蹈，改善角色與場景。前者先把三維場景算成一支可播放的影片，後者再依據圖片、文字或影片參考生成新畫面，兩者不是同一個步驟。

過程先碰到一次 HTTP 400，也就是伺服器拒絕請求。那次沒有取得工作編號，也沒有費用回報。後來經我核准改用另一種素材傳送方式，才得到兩支成功影片。這是資料傳輸修復，不是偷偷重送同一筆工作。

但傳輸修好，沒有連帶修好我的審美。

被退回的十二秒片裡，角色確實抬手、交腿、側傾，也還有兔耳、裙子和機械腿。我不滿意的，是整體人物與動作的感覺。Agent 確認影片能從頭讀到尾、沒有檔案解碼錯誤，也量測了鏡頭資料，但這些都不能代替我回答「這是不是我要的作品」。

這也是我開始回頭研究參考素材的原因。如果輸入同時帶著舊模型的比例、衣服和不自然的動作，只要求 AI「變漂亮」，到底要它留下什麼、丟掉什麼？

## 參考不是丟越多越好，而是要知道誰管什麼 {#reference-roles}

社群教學提供了幾條不同路線。abulu8 的示範把角色與場景交給圖片，把舞蹈與運鏡交給影片；Zeto 的連續舞句，則把一小段舞蹈寫成接得起來的動作順序，強調重心如何從一隻腳交給另一隻腳，避免只得到分開的姿勢。這是作者的做法，不是本次已經複製出的成效。[[3]](https://x.com/abulu8/status/2093404851174805661) [[4]](https://x.com/ZetoGroovin/status/2098003565373522328)

我保留的是「分工」和「動作要接得起來」，沒有照搬所有鏡頭。Zeto 那支示範本身有多個鏡頭，而我這輪刻意先看固定全身構圖。

<div class="study-reference-map" role="group" aria-label="三種參考素材的分工">
  <div><strong>身分參考</strong><p>確認是哪個角色。臉、眼睛、髮型與辨識特徵，要有明確基準。</p></div>
  <div><strong>全身造型</strong><p>確認穿搭、比例與舞台；也決定張手、踏步還有多少畫面空間。</p></div>
  <div><strong>動作來源</strong><p>指定舞步的順序和節奏形態。若不要求復刻，才讓文字另編舞句。</p></div>
</div>

深度、剪影、灰模和中性人偶，也不能全叫「遮罩」。遮罩比較像一張範圍標記，告訴工具哪裡是人物、哪裡是背景；其他幾種方法留下的資訊不一樣：

- **深度圖**：用明暗表達表面離鏡頭的遠近。把每個時間點的深度圖接起來，就成了深度參考影片。
- **剪影**：主要留下外輪廓，看得到手腳怎麼展開，卻少了人物表面的前後層次。
- **灰模**：去掉原本材質的三維角色，仍保留形體與光照，像沒上色的模型。
- **中性人偶**：先讓另一個外觀較簡單的角色演出動作，減少原人物衣服、髮型等資訊。

它們都可能簡化外觀，但不是同一種「去掉顏色」，更不能保證一換就比較好看。

Zeto 的深度示範使用的是 Seedance 2.0；另一支綠幕流程先換成中性動捕人物。不能因為都像灰色的人，就當成 Seedance 2.5 的同一種方法。[[5]](https://x.com/ZetoGroovin/status/2077718690817290261) [[6]](https://x.com/ZetoGroovin/status/2055619464469844296)

查教學還有一個坑：APOB 三篇文章有大段共用正文。三個標題不是三次獨立驗證；平台寫「爆紅」，也不是我的影片已經測過爆紅機率。[[7]](https://x.com/apob_ai/status/2092199846459711739)

## 真正值得放在一起看的，是 B 和 C {#matched-test}

後續五支試片，我用 A、B、C 等編號區分條件。A 是文字編舞：用完成造型圖加文字描述，讓 AI 自己生成舞蹈。B 用同圖加彩色動作片，請它跟著指定舞步；C 則把那段彩色片換成同時段、同動作的深度片，這就是這裡說的「匹配深度」。C2 再補臉部參考，A2 改寬構圖並延長。

**B／C 才是同一段舞步的彩色／深度比較。**角色圖、時間段與規格匹配，只替換動作影片的呈現方式。這次深度來自 Blender 場景，不是拿真人影片估算出來的。

<div class="study-pair">
  <figure>
    <video controls playsinline preload="metadata" poster="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/motion-rgb-poster.jpg' | relative_url }}" aria-label="B 使用的四秒 Blender 彩色動作來源" aria-describedby="cap-rgb"><source src="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/motion-rgb.mp4' | relative_url }}" type="video/mp4"></video>
    <figcaption id="cap-rgb"><strong>輸入 B：彩色動作片</strong>除了抬手、交叉步與抬腳，也留下舊角色外觀。動作源自 BerserkiKun 的 VMD，經本次 Blender 轉接。<a href="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/motion-rgb.mp4' | relative_url }}">開啟原片</a>。</figcaption>
  </figure>
  <figure>
    <video controls playsinline preload="metadata" poster="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/motion-depth-poster.jpg' | relative_url }}" aria-label="C 使用的同時段 Blender 灰階深度動作來源" aria-describedby="cap-depth"><source src="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/motion-depth.mp4' | relative_url }}" type="video/mp4"></video>
    <figcaption id="cap-depth"><strong>輸入 C：匹配深度片</strong>同時段、同動作，改用灰階表達深度；仍能看到裙襬和兔耳輪廓。不是換成中性人偶，也不是只剩黑白剪影。<a href="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/motion-depth.mp4' | relative_url }}">開啟原片</a>。</figcaption>
  </figure>
</div>

Agent 對原片與取樣的觀察是：B 和 C 都保留了頭上抬臂、交叉腿、兩側展臂與末段抬腳的主要順序。C 仍產生正常彩色角色，沒有把灰階直接畫到人物身上。Agent 這輪略偏好 C 的臉型與輪廓，但差距有限，也沒量出逐關節的動作誤差。

<div class="study-pair">
  <figure>
    <video controls playsinline preload="metadata" poster="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/b-poster.jpg' | relative_url }}" aria-label="B 彩色參考生成的四秒結果，無音軌" aria-describedby="cap-b"><source src="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/b.mp4' | relative_url }}" type="video/mp4"></video>
    <figcaption id="cap-b"><strong>輸出 B：主要舞步跟得上</strong>取樣可對上抬臂、展臂和末段抬腳；Agent 認為外觀仍有舊模型感。這是本次視覺觀察，不是彩色參考普遍較差的證明。<a href="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/b.mp4' | relative_url }}">開啟完整試片</a>。</figcaption>
  </figure>
  <figure>
    <video controls playsinline preload="metadata" poster="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/c-poster.jpg' | relative_url }}" aria-label="C 深度參考生成的四秒彩色結果，無音軌" aria-describedby="cap-c"><source src="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/c.mp4' | relative_url }}" type="video/mp4"></video>
    <figcaption id="cap-c"><strong>輸出 C：深度有保留動作的價值</strong>角色仍有金髮、藍裙與銀灰機械腿。與 B 的主要姿勢節點相近，不代表逐格完全相同。<a href="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/c.mp4' | relative_url }}">開啟完整試片</a>。</figcaption>
  </figure>
</div>

我的回饋也不是把深度丟掉。我比較喜歡文字編舞的外觀，同時覺得深度還原動作不錯。想讓角色自由跳得好看，和想保留某段指定舞步，本來就是兩個需求。

## A2 改善了構圖，不代表找到一句神咒 {#framing}

A 的角色圖幾乎填滿直式畫面。即使提示要求全身，伸手時還是碰框。取樣裡看得到手指頂到左右邊緣；輸入圖留給舞步的空間，比一句「不要出框」更具體。

A2 把角色放小，補上匹配臉圖、調整手勢，再把四秒延長到八秒。規律取樣與首尾格中，兔耳、雙手和鞋子都留在畫內，人物外觀也比較合我的口味。

<div class="study-pair">
  <figure><img src="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/hero.png' | relative_url }}" loading="lazy" alt="A 使用的全身造型圖，兔耳接近頂端，鞋底與兩側的動作空間較少"><figcaption><strong>A 的原始造型圖</strong>人物幾乎填滿畫面。這張圖能說明構圖起點，不能單靠靜態圖判定影片手部是否出框。</figcaption></figure>
  <figure><img src="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/wide.png' | relative_url }}" loading="lazy" alt="A2 使用的寬構圖造型圖，人物縮小，頭頂與腳下保留更多舞台空間"><figcaption><strong>A2 的寬構圖造型圖</strong>同為直式，全身周圍有更多餘量。「寬」指取景較鬆，不是改成橫片。生成時還增加臉圖與片長，非單因素測試。</figcaption></figure>
</div>

但 A 的文字舞句跟 B／C 的指定舞步不同，A2 又同時改了多項條件。不能因此宣布「文字勝過深度」，更不能把改善歸功於某一句提示詞。

C2 也值得留下。它加了臉圖及用途提示，Agent 在相同時間點比較後，沒有看到明顯而一致的提升。這不等於臉圖永遠沒用，只是目前沒有理由為了很小的差異，一直堆更多參考、繼續抽片。

<div class="study-table" role="region" aria-label="五支方法比較，窄螢幕可左右捲動" tabindex="0" markdown="1">

| 試片 | 條件與請求片長 | 本次可支持的觀察 | 不能推論的事 |
|---|---|---|---|
| A | 造型圖＋文字，四秒 | 外觀方向較喜歡，張手碰框 | 不是指定舞步復刻 |
| B | 同圖＋彩色，四秒 | 主要動作順序跟隨 | 不代表所有彩色來源都不好 |
| C | 同圖＋匹配深度，四秒 | 保留舞步，仍是彩色角色 | 不保證美感自動改善 |
| C2 | C 加臉圖與用途提示，四秒 | 未見明顯一致提升 | 不證明多圖永遠無效 |
| A2 | 寬圖＋臉圖＋調整舞句，八秒 | 取樣構圖改善，本輪較喜歡 | 不知道是哪一項改動貢獻多少 |

</div>

<p class="study-note">窄螢幕可左右滑動上方表格，看完整比較；下方保留各版完整試片。</p>

<details markdown="1">
<summary>展開另外兩支完整試片：A 與 C2</summary>
<div class="study-pair">
  <figure><video controls playsinline preload="none" poster="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/a-poster.jpg' | relative_url }}" aria-label="A 四秒文字編舞，部分伸手碰框，無音軌" aria-describedby="cap-a"><source src="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/a.mp4' | relative_url }}" type="video/mp4"></video><figcaption id="cap-a"><strong>A：保留失敗，不只挑漂亮一格</strong>請留意伸手時與左右畫框的距離。<a href="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/a.mp4' | relative_url }}">開啟完整試片</a>。</figcaption></figure>
  <figure><video controls playsinline preload="none" poster="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/c2-poster.jpg' | relative_url }}" aria-label="C2 四秒深度加臉部參考結果，無音軌" aria-describedby="cap-c2"><source src="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/c2.mp4' | relative_url }}" type="video/mp4"></video><figcaption id="cap-c2"><strong>C2：增加臉圖，沒有穩定勝出</strong>舞步與整體畫面仍接近 C；全身鏡裡臉部可用像素有限。<a href="{{ '/assets/img/technical/clonex-bunny-dance-reference-bottleneck/c2.mp4' | relative_url }}">開啟完整試片</a>。</figcaption></figure>
</div>
</details>

## 下一輪，我想換的是表演，不只是提示詞 {#next-hypothesis}

看完這輪，我懷疑：深度版不夠自然，會不會有一部分是因為來源舞片本來就不自然？

這個懷疑有理由。這次的骨架轉接仍有腳掌和物理模擬缺口，深度也保留了角色的體形與動作輪廓。它能減少材質干擾，卻沒有承諾替我重新設計一段表演。

但這還不是唯一原因的證明，也不是對 Blender 一般能力的否定。角色比例、動作轉接、深度表示、生成模型和提示設定，都可能參與結果。我不想再拿一支不滿意的片，替所有變因下結論。

尚未執行的下一步，是找有權利使用、固定全身鏡頭的自然真人 KPOP 表演，截取連續短舞句，再做同來源、同時段的彩色／深度比較。真人影片的深度需要估算，和直接從三維場景取深度不同；還得先檢查時間上的閃動，以及手腳互相遮擋時是否失真。Video Depth Anything 是可評估的工具方向，不是本次已經使用的工具。[[8]](https://github.com/DepthAnything/Video-Depth-Anything)

如果重新做，我會先問自己：要的是自由編舞，還是指定舞步？再把身分、全身造型和動作來源分開。先測短片，一次替換明確的條件；看過完整結果，再決定值不值得延長。

這次沒有驗證音樂卡點、長片穩定性、統計成功率或爆紅機率。五支方法試片都沒有音軌，連「有跟上舞步」都不能寫成「每一拍都準」。

我原本只是想讓五隻 CloneX 跳舞。最後真正學到的，是在叫 AI 修好一切之前，先看看自己交給它的是什麼。

<!-- main-article-end -->

## 附錄：花了多少，哪些數字不能混在一起 {#costs}

以下是研究當時的實際費用，不是目前報價，也不包含所有創作時間、設備與訂閱成本。

<div class="study-table" role="region" aria-label="兩批影片的已知實付，窄螢幕可左右捲動" tabindex="0" markdown="1">

| 批次 | 成功工作 | 已知實付（美元） | 邊界 |
|---|---:|---:|---|
| 首批 Bunny 影片 | 兩支 | US$3.817984 | 另有一次 HTTP 400 未回報費用，不能補成零 |
| 後續方法比較 | 五支 | US$6.127740 | 獨立批次、獨立預算；A／B／C／C2／A2 |
| 七支成功工作合計 | 七支 | US$9.945724 | 已知實付，不保證最終帳單沒有其他費用 |

</div>

<p class="study-note">窄螢幕可左右滑動上方表格，查看各批費用的限制。</p>

方法比較逐支實付：A 為 US$0.934110；B、C、C2 各 US$1.111680；A2 為 US$1.858590。費用依各工作的 API 實付回報核對，不拿估價充帳。API 是程式向服務送出要求、接收結果的介面；這次也靠它取得工作結果與費用。

影片透過 OpenRouter 這個串接生成模型的服務送出；imagegen 圖片生成則使用既有 ChatGPT 額度，沒有額外 OpenRouter 圖像費用，但不能因此說整個創作完全沒有成本。

### 研究當時的規格與重現界線

這次在 OpenRouter 實際指定的模型版本是 `bytedance/seedance-2.5-20260807`。2026 年 9 月 12 日查閱的規格列有 480p／720p、四至三十秒及 9:16 等選項；前兩個是畫質規格，9:16 則是手機常見的直式畫面比例。這是歷史快照，不能當成日後供應保證。品牌官方介紹、OpenRouter 介面，以及其他平台的功能名稱也不能混用。[[9]](https://openrouter.ai/bytedance/seedance-2.5) [[10]](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5)

五支方法片實際為 720×1280、每秒二十四格、無音軌。四秒請求各有九十七格，八秒請求有一百九十三格，含多出的一個端點影格；不要只看檔名當作精確時長。研究使用相同的隨機種子 `915755`，也就是供模型初始化的一個數字，但它不保證跨條件得到可重複的相同結果。

原研究保留完整英文提示詞、輸入檔案的指紋與送件紀錄。這裡的指紋是用來比對檔案內容是否相同的識別值，不是人的指紋。此處不提供可直接重送的請求包。若要重做，應先重新查模型能力、取得素材權利與新預算，再建立新的工作，不沿用舊工作重送。

這是文字舞句的教學改寫，**不是原始送件提示詞，也不是已驗證的成功配方**：

> Keep one adult character fully visible in a locked full-body shot. Begin in ongoing motion. Transfer weight into a side step, let the torso and shoulders follow, then open the arms into the next step. Keep continuous movement rather than isolated poses. Leave room for hands, ears, and shoes throughout the dance.

### 素材與驗收界線

本文以 Bunny 單人試片呈現比較，不展示含 #17152 的五人畫面；研究曾有該角色，不等於可以拿來商用。Bunny／CloneX 身分、衍生造型、鞋款與動作的公開使用條件仍須分別確認，不能把「模型是我持有的」當作所有權利都處理好了。

動作署名：Motion：[@BerserkiKun](https://youtube.com/@BerserkiKun/shorts)，aespa〈KISS N TELL〉身體 VMD；[動作作者下載頁](https://patreon.com/Berserkikun)、[作者標示的追蹤表演來源](https://www.youtube.com/shorts/SzrIERCiisU)。原檔禁止轉售與重散布，已取得的說明沒有明示成片商用許可；這仍是公開前待確認項目。本文不提供 VMD、模型、完整貼圖或 ZIP 下載，也不附 aespa 歌曲錄音。

Bunny 的鞋款來源是 **TennisShoes（punkduck_tennis_shoes）**，作者 **punkduck**，收錄於 [MakeHuman Community shoes02](https://static.makehumancommunity.org/assets/assetpacks/shoes02.html)，採須保留署名的 [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) 授權。本研究重新縮放、調整鞋楦與骨架權重，也就是鞋子形狀與跟隨關節移動的設定，並移除獨立襪套；後續生成圖與影片再以此作造型參考，不能當成精確原模型。此署名不代表作者背書，也不解除角色與動作的其他權利限制。

畫面比較是研究試片，不是正式成片驗收。Agent 的規律取樣、首尾格檢查、鏡頭資料一致與完整解碼，均不等於逐格無瑕疵。頁面播放器保留完整片，不用漂亮的單格代替整體結果。

[回到文章開頭](#main)

### 原作者與官方來源

開頭的靈感來源為後續補記：[OpenAI：GPT‑6 Astra 介紹頁](https://openai.com/zh-Hant/index/gpt-6-astra/)。火箭建模與列印的觀看經驗由我補充，不是這次 CloneX 試驗的成果，也不代表這次測過 GPT‑6 Astra 的建模能力。

以下則是原研究期間的引用，並非把所有頁面重新測過一次；第三方示範影片與教學全文不在本站重散布。

1. [BerserkiKun：aespa KISS N TELL 免費身體 VMD](https://www.patreon.com/Berserkikun/posts/47-free-aespa-n-166592131)；[作者影片說明](https://www.youtube.com/watch?v=t-RQCVwRK7Y)。原研究查閱：2026-09-12。
2. MakeHuman Community：[shoes01](https://static.makehumancommunity.org/assets/assetpacks/shoes01.html)、[shoes02](https://static.makehumancommunity.org/assets/assetpacks/shoes02.html)、[shoes03](https://static.makehumancommunity.org/assets/assetpacks/shoes03.html)。原研究查閱：2026-09-12。
3. [abulu8：角色圖與舞蹈影片的分工](https://x.com/abulu8/status/2093404851174805661)，2026-08-28。
4. [Zeto：連續 KPOP 舞句模板](https://x.com/ZetoGroovin/status/2098003565373522328)，2026-09-10。
5. [Zeto：Seedance 2.0 深度影片參考](https://x.com/ZetoGroovin/status/2077718690817290261)，2026-07-16。
6. [Zeto：綠幕素體與編舞交付](https://x.com/ZetoGroovin/status/2055619464469844296)，2026-05-16。
7. APOB：[8 月 25 日文章](https://x.com/apob_ai/status/2092199846459711739)、[8 月 17 日文章](https://x.com/apob_ai/status/2089272831066652923)、[8 月 10 日文章](https://x.com/apob_ai/status/2086762672804986954)。共用正文不能重複計為獨立證據。
8. [Video Depth Anything：影片深度估算專案](https://github.com/DepthAnything/Video-Depth-Anything)。原研究查閱：2026-09-13；本次未用於真人轉深度。
9. [OpenRouter：Seedance 2.5 模型頁](https://openrouter.ai/bytedance/seedance-2.5)。原研究規格快照：2026-09-12。
10. [ByteDance Seed：Introducing Seedance 2.5](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5)，2026-07-31。

</div>
