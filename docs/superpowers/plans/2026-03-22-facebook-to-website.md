# Facebook 封存內容轉換網站文章 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 Facebook 封存中的高互動內容轉化為網站正式文章，補強 AI 學習分享、技術專欄、攝影典藏三個區塊，並橋接 NFT mini-site 與主站。

**Architecture:** 新增 5 篇 `_posts/` Markdown 文章（`layout: article`），分別歸類為 `[claude-code]`（AI 學習分享）或 `[technical]`（技術專欄）；另修改 2 個 HTML 頁面（攝影典藏 + 技術顧問首頁）加入 Facebook 精選段落與 NFT 橋接連結。

**Tech Stack:** Jekyll, Liquid templating, Markdown, Bootstrap 5 grid, 已存在於 `assets/facebook-archive/photos/` 的本地圖片

---

## 背景知識

- **文章格式**：所有文章放在 `_posts/` 目錄，副檔名 `.md`，使用 `layout: article`
- **AI 學習分享**：`categories: [claude-code]`，`nav_active: education`，顯示於 `/education/ai/`
- **技術專欄**：`categories: [technical]`，`nav_active: technical`，顯示於 `/technical/articles/`
- **圖片路徑**：Facebook 圖片已存於 `assets/facebook-archive/photos/`，front matter 中 `cover_image` 直接用此路徑
- **語言**：全文繁體中文（zh-TW）
- **文章日期**：使用 Facebook 原始貼文日期，格式 `YYYY-MM-DD HH:MM:SS +0800`

---

## 檔案清單

| 動作 | 路徑 | 說明 |
|------|------|------|
| 新增 | `_posts/2023-02-14-stable-diffusion-photography-experiment.md` | AI 生圖實驗筆記（356 讚） |
| 新增 | `_posts/2025-03-27-chatgpt-4o-ghibli-clonex.md` | ChatGPT 4o 吉卜力 + CloneX（35 讚） |
| 新增 | `_posts/2023-03-02-ai-visual-fatigue-photography.md` | AI 視覺疲勞與攝影真實性（131 讚） |
| 新增 | `_posts/2022-12-15-ucx-uniform-clonex-origin.md` | UCX 制服 CloneX 起源故事（技術專欄） |
| 新增 | `_posts/2021-07-17-uniform-girls-nft-debut.md` | 制服女孩踏入 NFT（技術專欄） |
| 修改 | `photography/archive.html` | 加入 Facebook 精選互動段落 |
| 修改 | `technical/index.html` | 加入 NFT mini-site 橋接卡片 |

---

## Task 1：AI 文章一 — Stable Diffusion 實驗筆記

**目標貼文**：2023-02-14（356 讚）、2023-02-15（273 讚）、2023-02-20（204 讚）、2023-03-12（143 讚）
**定位**：AI 學習分享，讓受眾看到一位攝影師從「假裝在學電繪」到認真玩 Stable Diffusion 的四週實驗紀錄

**Cover image**：`/assets/facebook-archive/photos/2023-02-14_629017969233007_1.jpg`

- [ ] **Step 1：建立文章檔案**

建立 `_posts/2023-02-14-stable-diffusion-photography-experiment.md`，內容如下：

```markdown
---
title: "攝影師的 AI 生圖實驗——從「假裝學電繪」到 Stable Diffusion 四週筆記"
date: 2023-02-14 20:00:00 +0800
categories: [claude-code]
layout: article
nav_active: education
cover_image: /assets/facebook-archive/photos/2023-02-14_629017969233007_1.jpg
description: "一個拍了十幾年制服女孩的攝影師，在 2023 年初認真玩了一個月 Stable Diffusion。這是那段時間的實驗筆記與反思。"
---

## 第一週：假裝在學電繪

2023 年初，我在 Facebook 貼了一句話：「最近開始學電繪～（好啦其實是 AI 生圖）」

那篇貼文獲得了 356 個讚——是我攝影作品的好幾倍。

老實說，看到這個數字，我的第一反應是有點複雜。十幾年的攝影功力，敵不過一個 prompt？

但仔細想想，那些讚按的是什麼？是「驚訝」，是「這個攝影師居然在玩這個」，也是一種時代的集體共鳴——2023 年初，正是 Stable Diffusion 和 Midjourney 讓所有人開始重新思考「圖像是什麼、誰可以創造圖像」的時刻。

## 第二週：效果太好，開始認真研究

隔天我又貼了一篇，標題大概是：「昨天貼文的效果太好，讓我覺得以後是不是用生成的圖來騙讚也不錯，反正跟我的攝影差不多也是從一堆照片中選來貼。」

這是半開玩笑，但也是真心話。

**攝影的本質**，從選景、打光、指導模特兒、後製，到最後從幾百張中挑出那一張——其實是一個持續的「篩選與判斷」過程。AI 生圖改變的只是輸入端（從快門變成 prompt），輸出端的美學判斷，仍然是人在做。

第二週，我開始系統性地研究 Stable Diffusion 的工作流程。

## 第三週：Stable Diffusion + 模型組合

2023-02-20 的實驗：

```
Stable Diffusion + ChilloutMix + Korean Doll Likeness + Taiwan Doll Likeness + Ulzzang-6500
```

我那時還不太懂模型組合的原理，但效果已經很驚人。

幾個心得：
- **LoRA 模型**讓 Stable Diffusion 可以針對特定風格或臉型進行微調
- **ChilloutMix** 是當時流行的亞洲臉孔基礎模型
- **提示詞工程（Prompt Engineering）**和攝影的「場景設定」有驚人的相似之處——你要告訴 AI 光線、角度、情緒、服裝，就像在現場指導一場拍攝

## 第四週：九頭身美少女與視覺疲勞

到了三月，我試了一個容易產生「九頭身美少女」的模型，又是一批高讚圖。

但同時，我也開始覺得有點視覺疲勞。

那時我貼了一句引用小王子的話：「真正重要的東西，用眼睛是看不見的」，配上一張真實拍攝的制服女孩照片。

這不是在否定 AI，而是在提醒自己——

**攝影的價值，不只是最終的那張圖像，而是拍攝當下的連結、信任、與那個無法複製的瞬間。**

## 結語：攝影師怎麼看 AI 生圖

玩了一個月之後，我的結論不是「AI 會取代攝影師」，也不是「AI 生圖不算藝術」。

而是：**兩者根本在回答不同的問題。**

AI 生圖回答的是「我可以視覺化什麼樣的想像？」

攝影回答的是「這個真實的人，在這個真實的瞬間，有什麼值得記錄？」

當然，這兩個問題的邊界正在模糊——用 AI 協助概念設計、用攝影捕捉真實執行的成果，或許才是接下來的創作方式。

---

**相關貼文**：
- [2023-02-14 Facebook 原文](https://www.facebook.com/SwankyParty/posts/pfbid0VBW1sfrY6R2JF4dRVJktb6sDLqq8e5XWSB7X4VMxSH7NQRiqF3mKdwL9yEUoP8Zl)
- [2023-02-15 Facebook 原文](https://www.facebook.com/SwankyParty/posts/pfbid0j8TJWc4jwzJ8Yz2rFiXTVqVjT9gHekz7bCT2eXXvnEm2iJq4TiJPCVx4MpVGb7Al)
```

- [ ] **Step 2：確認本地圖片存在**

```bash
ls assets/facebook-archive/photos/2023-02-14_629017969233007_*.jpg
```

預期：列出 6 張圖片（_1 到 _6）

- [ ] **Step 3：本地 Jekyll 確認**

```bash
bundle exec jekyll serve
```

開啟 `http://127.0.0.1:4000/education/ai/` 確認文章卡片出現

- [ ] **Step 4：Commit**

```bash
git add _posts/2023-02-14-stable-diffusion-photography-experiment.md
git commit -m "feat(ai): add Stable Diffusion experiment article from Facebook archive"
```

---

## Task 2：AI 文章二 — ChatGPT 4o 吉卜力 + CloneX IP

**目標貼文**：2025-03-27（35 讚）、2025-03-28（4 讚）
**定位**：AI 學習分享，記錄 ChatGPT 4o 圖像生成功能出現時，一個同時玩過 Blender + 繪師委託 + NFT 的人的視角

**Cover image**：`/assets/facebook-archive/photos/2025-03-27_1201814241953374_1.jpg`

- [ ] **Step 1：建立文章檔案**

建立 `_posts/2025-03-27-chatgpt-4o-ghibli-clonex.md`：

```markdown
---
title: "ChatGPT 4o 圖像革命：吉卜力重繪、CloneX IP，以及那些我曾經費盡苦心做到的事"
date: 2025-03-27 20:00:00 +0800
categories: [claude-code]
layout: article
nav_active: education
cover_image: /assets/facebook-archive/photos/2025-03-27_1201814241953374_1.jpg
description: "當 ChatGPT 4o 能用一句話重繪圖片，我想起了過去研究 Blender、找繪師、發行 NFT 的那段日子——以及這一切對創作者意味著什麼。"
---

## 指令：「以吉卜力動畫風格重畫這張圖片」

2025 年 3 月，ChatGPT 4o 推出了圖像生成功能。

我做了一個大多數人都做的實驗：找一張照片，下指令「以吉卜力動畫風格重畫這張圖片」。

結果，令人驚豔。

不是說吉卜力風格本身有多特別——它在 AI 圖像社群裡已經被玩了很多次。讓我驚訝的是**執行的門檻**：過去需要調教模型、寫複雜 prompt、反覆迭代才能做到的效果，現在一句話就完成了。

而且是在 ChatGPT 的對話框裡，不需要安裝任何東西。

## 我曾經費盡苦心做到的事

看著這個，我想起了幾年前的自己。

2022 年底，我組了一個 CloneX 制服女孩的社群（[UCX，Uniform CloneX](https://www.facebook.com/SwankyParty/posts/pfbid09GVmCmvTRRJdRJezGS5thzqGJCEr9pBG4mH1e97XGLzw89dxdwuMiMJiFtPJ69rBl)），想把這些虛擬角色發展成 IP。

那時候，我的工作流程是：
1. 研究 **Blender**，自己生成 3D 場景
2. 委託繪師畫 CloneX 角色的 2D 衍生圖
3. 把這些圖上鏈，發行 NFT

每一步都費時費力。Blender 的學習曲線很陡，繪師的委託需要溝通與等待，NFT 的發行有技術門檻。

現在，ChatGPT 4o 可以直接拿我的 CloneX 截圖，生成各種風格的衍生圖——而且品質比我當年做的好得多。

## 創作者的角色正在改變

這讓我思考一個問題：**創作者的核心價值，到底是「執行」還是「判斷」？**

過去，攝影師的門檻是技術（相機、光線、後製）。後來手機普及了，技術門檻降低，「眼光」與「選題」變得更重要。

現在，AI 圖像工具讓生成的門檻趨近於零。那麼，創作者剩下什麼？

我認為剩下的是：
- **概念**：為什麼要做這個？想說什麼故事？
- **策展**：從大量生成物中，選出那個「對的」
- **連結**：與真實的人、真實的故事、真實的社群的連結

這不是悲觀的觀點。是一個提醒：**工具進化的速度快過你的想像，但工具永遠替代不了你決定做什麼。**

## 給還在猶豫的人

如果你還沒試過 ChatGPT 4o 的圖像功能，現在就可以試。

找一張你的照片，下一個風格指令，看看結果。不是要你放棄原本的創作方式，而是讓你理解這個工具的邊界在哪——然後決定它能幫你做什麼。

---

**相關貼文**：
- [2025-03-27 Facebook 原文](https://www.facebook.com/SwankyParty/posts/pfbid0mvQ5suJ3mRGeBFmK43zEYoH6ENPrHkCbnQxpLghnrTfg47je4cb4yNGSdLVQpTWYl)
- [2025-03-28 Facebook 原文](https://www.facebook.com/SwankyParty/posts/pfbid0F1ViwUAttCrYLLfxCfTGyhMZUrHK99Mcc2YW59qFo2kW5Z3RWMq7q39sYDXrsnbgl)
```

- [ ] **Step 2：Commit**

```bash
git add _posts/2025-03-27-chatgpt-4o-ghibli-clonex.md
git commit -m "feat(ai): add ChatGPT 4o Ghibli + CloneX IP article"
```

---

## Task 3：AI 文章三 — AI 視覺疲勞與攝影真實性

**目標貼文**：2023-03-02（131 讚）
**定位**：AI 學習分享，最具哲學深度的一篇，適合作為 AI 系列的收尾

**Cover image**：`/assets/facebook-archive/photos/2023-03-02_642589511209186_0.jpg`

- [ ] **Step 1：建立文章檔案**

建立 `_posts/2023-03-02-ai-visual-fatigue-photography-authenticity.md`：

```markdown
---
title: "AI 生圖的視覺疲勞，以及攝影還剩下什麼"
date: 2023-03-02 20:00:00 +0800
categories: [claude-code]
layout: article
nav_active: education
cover_image: /assets/facebook-archive/photos/2023-03-02_642589511209186_0.jpg
description: "玩了一個月 Stable Diffusion 之後，我開始對 AI 生圖感到視覺疲勞。這篇是那段時間的誠實反思：攝影在 AI 時代還剩下什麼？"
---

## 視覺疲勞

2023 年 3 月初，距離我開始玩 Stable Diffusion 大概過了三週。

我貼了這樣一句話：

> 看太多 AI 生成的照片後，覺得有點視覺疲勞了。
>
> 「真正重要的東西，用眼睛是看不見的」

配上一張真實拍攝的制服女孩照片。

那張照片沒有 AI 生圖的那種「完美」，光線不是最理想的，但那個女孩笑得很自然，那個瞬間很真實。

## 為什麼會視覺疲勞？

AI 生成圖像有一個特點：它非常「悅目」。

高對比、完美的臉部比例、乾淨的背景、理想化的光線——這些都是在大量訓練資料中被強化的視覺偏好。

問題是，當每一張圖都是「最佳化的悅目」，你的眼睛很快就不知道該停在哪裡了。

這讓我想到攝影史上的一個辯論：**完美的照片，是不是好的照片？**

紀實攝影的價值，往往來自它的「不完美」——那個失焦的瞬間、那個尷尬的表情，正是它捕捉到了真實。

## 攝影在 AI 時代還剩下什麼

我不打算給出「攝影將死」或「攝影永生」這樣的廉價結論。

但我認為，攝影在 AI 時代的核心價值在於：

**1. 真實性的證明**
一張真實拍攝的照片，是一個時刻存在過的證明。AI 生成的圖無論多完美，都是從統計分佈中採樣的「可能性」，不是「發生過的事實」。

**2. 關係的記錄**
拍攝的過程，是攝影師與被攝者之間的關係。那種信任、那種溝通、那個「你準備好了嗎？」的瞬間——這些都不在最終的圖像裡，但它們構成了那張照片存在的理由。

**3. 選擇的美學**
AI 生成可以產生無限的「還不錯的圖」，但攝影師的眼光，是在真實場景的有限條件下，做出那個獨特的選擇。

## 小王子說的那句話

「真正重要的東西，用眼睛是看不見的。」

這不是在說 AI 生圖不重要。而是在提醒自己，不要因為 AI 能生成「視覺上好看的圖」，就以為它能替代攝影所代表的那種**意義的記錄**。

工具會一直進化。但那個問「這個瞬間值得被記錄嗎？」的人，還是你。

---

**相關貼文**：
- [2023-03-02 Facebook 原文](https://www.facebook.com/SwankyParty/posts/pfbid02LTivJT3e75VFwJf2ZhxBdEsNdGWDgkU9ATYV2y5Lak3C8HHuT1hHe1wgM8NVkJBl)
```

- [ ] **Step 2：Commit**

```bash
git add _posts/2023-03-02-ai-visual-fatigue-photography-authenticity.md
git commit -m "feat(ai): add AI visual fatigue and photography authenticity article"
```

---

## Task 4：技術專欄 — UCX 制服 CloneX 起源故事

**目標貼文**：2022-12-15 UCX 出道（28 讚）、2022-12-11 CloneX cosplay（37 讚）、2022-09-28 第一次線下聚（35 讚）、2022-10-14 Taiwan UCX 介紹、2021-07-17 張小筑 NFT 發行（355 讚）
**定位**：技術專欄，從 Web3 社群實踐的角度記錄 UCX 的誕生過程

**Cover image**：`/assets/facebook-archive/photos/2022-12-15_576144351187036_1.jpg`

- [ ] **Step 1：確認封面圖片存在**

```bash
ls assets/facebook-archive/photos/2022-12-15_576144351187036_*.jpg
ls assets/facebook-archive/photos/2022-12-11_572016944933110_*.jpg
```

- [ ] **Step 2：建立文章檔案**

建立 `_posts/2022-12-15-ucx-uniform-clonex-origin.md`：

```markdown
---
title: "UCX 的誕生：一個攝影師如何在 Web3 世界創建制服女孩社群"
date: 2022-12-15 20:00:00 +0800
categories: [technical]
layout: article
nav_active: technical
cover_image: /assets/facebook-archive/photos/2022-12-15_576144351187036_1.jpg
description: "從 2021 年的第一個制服女孩 NFT，到 2022 年底 UCX（Uniform CloneX）社群正式出道——這是一段用 Web3 工具實踐攝影 IP 的真實紀錄。"
---

## 起點：制服女孩遇上 NFT

2021 年 7 月，我在 OurSong 平台發行了第一個制服女孩 NFT——以模特兒張小筑的作品為主，限量 13 張，售價 $8.8 USD。

發行前，我在 Facebook 寫道：「可以錯過初戀，但不能錯過制服女孩！」

那篇貼文拿到了 355 個讚，是當時互動最高的幾篇之一。

但更重要的是，那次嘗試讓我開始認真思考：**攝影作品作為數位資產，在 Web3 世界有什麼可能性？**

## CloneX 的出現

2022 年，我開始接觸 RTFKT 旗下的 CloneX NFT 計畫。

CloneX 的核心概念是：每一個 NFT 是一個可穿戴、可在虛擬世界中使用的 3D 虛擬人物。它不只是「一張圖」，而是一個具有 IP 潛力的虛擬身份。

作為一個拍過無數制服女孩的攝影師，我看到了一個有趣的交叉點：**如果把制服的美學，移植到 CloneX 的虛擬人物上，會發生什麼？**

這個想法，就是 UCX（Uniform CloneX）的起點。

## 第一次線下聚：從虛擬到真實

2022 年 9 月，CloneX Taiwan 舉辦了第一次線下聚會。

我去了，認識了一群「克隆家人」——在虛擬世界裡持有相同 NFT 系列的人，在真實世界裡第一次見面。

那種體驗很奇特：你們沒有通過傳統的社交管道認識，卻因為一個共同的數位資產而聚在一起。這是 Web3 社群的特有連結方式。

## UCX 出道：2022-12-15

2022 年 12 月，CloneX 第二次線下聚會。

這次，UCX 正式出道。

展位、UCX 的識別視覺、第一批成員的集合——這是一個很小的開始，但對我來說意義重大。

那天，還有朋友 cosplay 成她的 CloneX 角色來參加，帶著 UCX 的精神道具。那個畫面，讓我覺得：**虛擬 IP 和真實人物之間的距離，並不像想象中那麼遠。**

## 從攝影師到社群建立者

這段經歷讓我學到的，不只是 Web3 的技術面（錢包、NFT 合約、二級市場），而是：

**1. 社群是 IP 的護城河**
制服女孩從來不只是我的攝影作品，而是一個有真實粉絲、有情感連結的題材。把這個社群引入 Web3，比從零開始建立一個 NFT 計畫容易得多。

**2. 線下連結依然重要**
Web3 社群的黏性，在線下聚會的那一刻才真正形成。虛擬資產創造相遇的理由，但真實的信任需要真實的接觸。

**3. 跨域是策略，不是偶然**
攝影、技術、Web3——這些看起來無關的背景，在 UCX 這個計畫裡都派上用場。「多才多藝」不是分心，是不同語言的翻譯能力。

## 後記

UCX 後來的發展，受到了整個 Web3 市場的週期影響。2022 年底的加密寒冬，讓很多計畫停滯。

但那段時間建立的連結——那些克隆家人、那些懂制服美學也懂 NFT 的人——依然是真實的。

有些計畫不是失敗，只是在等待下一個時機。

---

**相關連結**：
- [UCX 出道貼文（2022-12-15）](https://www.facebook.com/SwankyParty/posts/pfbid09GVmCmvTRRJdRJezGS5thzqGJCEr9pBG4mH1e97XGLzw89dxdwuMiMJiFtPJ69rBl)
- [CloneX 第一次線下聚（2022-09-28）](https://www.facebook.com/SwankyParty/posts/pfbid05Z1MHLjvpGVYWmePzm8MqBk4nW85E1fE8Y3gGQWkBnZJhUyuQBL5vR8giBxCE6El)
- [UCX @ucx_tw](https://www.instagram.com/ucx_tw)
```

- [ ] **Step 3：Commit**

```bash
git add _posts/2022-12-15-ucx-uniform-clonex-origin.md
git commit -m "feat(technical): add UCX Uniform CloneX origin story article"
```

---

## Task 5：技術專欄 — 制服女孩踏入 NFT

**目標貼文**：2021-07-17（355 讚，張小筑 OurSong NFT 發行）
**定位**：技術專欄，記錄第一次將攝影作品上鏈的決策過程

**Cover image**：`/assets/facebook-archive/photos/2021-07-17_197165862418222_0.jpg`

- [ ] **Step 1：建立文章檔案**

建立 `_posts/2021-07-17-uniform-girls-nft-debut.md`：

```markdown
---
title: "制服女孩上鏈：攝影作品踏入 NFT 世界的第一步"
date: 2021-07-17 12:00:00 +0800
categories: [technical]
layout: article
nav_active: technical
cover_image: /assets/facebook-archive/photos/2021-07-17_197165862418222_0.jpg
description: "2021 年，我在 OurSong 平台發行了第一個制服女孩 NFT。這篇記錄了那個決定背後的思考：為什麼要做、怎麼做、以及學到了什麼。"
---

## 為什麼要把攝影作品做成 NFT？

2021 年中，NFT 的話題已經鋪天蓋地。

作為一個拍了十幾年制服女孩、也在區塊鏈產業工作多年的人，我同時處在兩個世界——攝影圈和 Web3 圈。

大多數攝影師對 NFT 的態度是：「這跟我有什麼關係？」

我的態度是：**我應該親自試試看。**

不是為了投機，也不是為了跟風，而是因為我想搞清楚：攝影作品作為數位資產，在這套機制下到底有什麼可能性？

## OurSong 與第一批作品

我選擇了台灣本地的 NFT 平台 OurSong。

原因很實際：界面對創作者友善，中文社群有一定基礎，適合作為第一次實驗。

第一批作品以模特兒**張小筑**的制服女孩系列為主：

- **限量 13 張**，建議售價 $8.8 USD
- 持有者可解鎖完整尺寸圖片，以及不定期的制服女孩內容
- 銷售收益：模特兒分得一半，另一半用於未來拍攝製作

這個分潤結構，是我認為對創作者和被攝者都公平的設計。攝影不只是攝影師的作品，也是模特兒的貢獻。

## 發行之後

那篇發行貼文拿到了 355 個讚。

但更重要的不是讚數，而是那次實驗讓我真正理解了：

**NFT 的核心不是「賺錢」，而是「所有權的重新定義」。**

當一張照片被鑄造成 NFT，它不再只是一個可以無限複製的數位檔案，而是一個可以追蹤、轉讓、驗證真實性的數位資產。

對攝影師來說，這意味著：你可以在二級市場的每一次轉手中，持續收到版稅。你的作品有了「數位版稅」的機制。

## 學到的事

**技術面**：
- 鑄造（Mint）的流程比想象中簡單，但 gas fee 的時機需要研究
- 選擇平台很重要：不同平台的受眾和定位差異很大
- 作品的稀缺性設計（限量多少）直接影響市場反應

**策略面**：
- 現有的粉絲基礎，是 NFT 銷售最重要的起點
- 攝影 NFT 的買家，往往不只是在買「一張圖」，而是在買「與創作者的連結」
- 分潤機制可以強化創作者的道德立場，也更容易獲得合作者的信任

**人性面**：
- NFT 的炒作性讓很多人失望，但底層的技術概念是真實的
- 重要的是：你自己相信這個作品值得被珍藏，再去做發行

## 那之後

2021 年的這次實驗，是後來 UCX 社群誕生的種子。

把攝影美學帶進 Web3，不是一次就能完成的事。但每一次嘗試，都讓我更理解兩個世界的語言。

---

**相關連結**：
- [2021-07-17 Facebook 原文](https://www.facebook.com/SwankyParty/posts/pfbid0VBW1sfrY6R2JF4dRVJktb6sDLqq8e5XWSB7X4VMxSH7NQRiqF3mKdwL9yEUoP8Zl)
- [OurSong @swanky](https://www.oursong.com/@swanky)
- [制服女孩 × UCX 起源故事](/posts/2022-12-15-ucx-uniform-clonex-origin)
```

- [ ] **Step 2：Commit**

```bash
git add _posts/2021-07-17-uniform-girls-nft-debut.md
git commit -m "feat(technical): add Uniform Girls NFT debut article"
```

---

## Task 6：攝影典藏 — 加入 Facebook 精選互動段落

**目標檔案**：`photography/archive.html`
**位置**：在現有「個人作品」段落（最後一個 section）之後，加入新的「Facebook 精選互動」段落

- [ ] **Step 1：讀取 photography/archive.html 確認插入位置**

找到 `</main>` 標籤之前的最後一個 `</section>` 結尾

- [ ] **Step 2：加入新段落**

在 `</main>` 前插入以下段落（找到現有的最後一個 `</section>` 後加入）：

```html
    <!-- Facebook 精選互動 -->
    <section id="facebook-highlights" class="portfolio" style="padding: 40px 0 60px;">
      <div class="container" data-aos="fade-up">
        <div class="section-title">
          <h2>Facebook 精選互動</h2>
          <p>2017–2025 年間，Facebook 粉絲頁互動最高的攝影作品貼文精選</p>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="0">
            <div class="card h-100">
              <img src="{{ '/assets/facebook-archive/photos/2020-03-08_10160006143465329_0.jpg' | relative_url }}" class="card-img-top" alt="制服女孩騎 UBike" loading="lazy">
              <div class="card-body">
                <p class="card-text small text-muted">2020-03-08 · 199 讚</p>
                <p class="card-text">制服女孩騎 UBike</p>
                <a href="https://www.facebook.com/SwankyParty" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="background:#E5A300;color:#fff;">Facebook 頁面 →</a>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
            <div class="card h-100">
              <img src="{{ '/assets/facebook-archive/photos/2019-07-09_10159101519745329_0.jpg' | relative_url }}" class="card-img-top" alt="讀 Head First Agile 的區塊鏈工程師" loading="lazy">
              <div class="card-body">
                <p class="card-text small text-muted">2019-07-09 · 181 讚</p>
                <p class="card-text">讀 Head First Agile 的區塊鏈工程師</p>
                <a href="https://www.facebook.com/SwankyParty" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="background:#E5A300;color:#fff;">Facebook 頁面 →</a>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
            <div class="card h-100">
              <img src="{{ '/assets/facebook-archive/photos/2018-08-18_10158075093130329_0.jpg' | relative_url }}" class="card-img-top" alt="制服女孩嫺嫺" loading="lazy">
              <div class="card-body">
                <p class="card-text small text-muted">2018-08-18 · 164 讚</p>
                <p class="card-text">制服女孩嫺嫺</p>
                <a href="https://www.facebook.com/SwankyParty" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="background:#E5A300;color:#fff;">Facebook 頁面 →</a>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-2">
          <a href="https://www.facebook.com/SwankyParty" target="_blank" rel="noopener noreferrer" style="color:#E5A300;">查看更多 Facebook 作品 →</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 3：確認三張圖片存在**

```bash
ls assets/facebook-archive/photos/2020-03-08_10160006143465329_0.jpg
ls assets/facebook-archive/photos/2019-07-09_10159101519745329_0.jpg
ls assets/facebook-archive/photos/2018-08-18_10158075093130329_0.jpg
```

若某張不存在，改用同年份的其他圖片（檔名格式：`YYYY-MM-DD_{post_id}_0.jpg`）

- [ ] **Step 4：本地確認**

開啟 `http://127.0.0.1:4000/photography/archive/`，滾動至最底部確認段落出現

- [ ] **Step 5：Commit**

```bash
git add photography/archive.html
git commit -m "feat(photography): add Facebook highlights section to archive page"
```

---

## Task 7：技術顧問首頁 — NFT mini-site 橋接

**目標檔案**：`technical/index.html`
**目標**：在技術顧問首頁的服務卡片區加入一個指向 NFT mini-site 的卡片

- [ ] **Step 1：讀取 technical/index.html 確認結構**

找到現有的服務卡片區（通常是 `.row` 內的 `.col-*` 卡片組），確認插入位置

- [ ] **Step 2：加入 NFT 橋接卡片**

在最後一個服務卡片後加入：

```html
<div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
  <div class="icon-box" style="border-top: 3px solid #E5A300;">
    <div class="icon"><i class="bx bx-cube-alt" style="color:#E5A300;"></i></div>
    <h4><a href="/nft/" target="_blank" rel="noopener noreferrer">NFT 策展 &amp; Web3 實踐</a></h4>
    <p>從制服女孩 NFT 到 UCX（Uniform CloneX）社群，記錄攝影 IP 在 Web3 世界的實踐歷程。</p>
    <a href="/nft/" target="_blank" rel="noopener noreferrer" style="color:#E5A300;font-size:0.9rem;">進入 NFT 策展專區 →</a>
  </div>
</div>
```

- [ ] **Step 3：本地確認**

開啟 `http://127.0.0.1:4000/technical/`，確認 NFT 卡片出現在服務區

- [ ] **Step 4：Commit**

```bash
git add technical/index.html
git commit -m "feat(technical): add NFT mini-site bridge card to technical index"
```

---

## 完成標準

- [ ] `/education/ai/` 顯示 3 篇新 AI 文章卡片（Task 1-3）
- [ ] `/technical/articles/` 顯示 2 篇新技術專欄卡片（Task 4-5）
- [ ] `/photography/archive/` 最底部顯示 Facebook 精選段落（Task 6）
- [ ] `/technical/` 首頁顯示 NFT 橋接卡片（Task 7）
- [ ] 所有文章連結正常，封面圖片正常載入
- [ ] 所有內容為繁體中文

---

## 注意事項

1. **封面圖片**：使用 `assets/facebook-archive/photos/` 中的本地檔案，路徑格式 `/assets/facebook-archive/photos/FILENAME.jpg`
2. **Facebook 貼文連結**：計畫中的 Facebook 連結為範例格式，實際執行時請用 `assets/facebook-archive/posts/YEAR/DATE_POSTID.md` 中的 `**貼文連結**:` 欄位確認真實 URL
3. **文章內容**：計畫中已提供完整文章內容，直接使用即可，不需再擴充或縮減
4. **日期格式**：`YYYY-MM-DD HH:MM:SS +0800`
