---
title: "攝影師的 AI 生圖實驗——從「假裝學電繪」到 Stable Diffusion 四週筆記"
date: 2023-02-14 20:00:00 +0800
categories: [claude-code]
layout: article
nav_active: education
cover_image: /assets/facebook-archive/photos/2023-02-14_629017969233007_1.jpg
description: "一個拍了十幾年制服女孩的攝影師，在 2023 年初認真玩了一個月 Stable Diffusion。這是那段時間的實驗筆記與反思。"
keywords: Stable Diffusion,AI生圖,攝影師,AI繪圖,AI學習,史旺基,Swanky Studio
---

## 第一週：假裝在學電繪

2023 年初，我在 Facebook 貼了一句話：「最近開始學電繪～（好啦其實是 AI 生圖）」

那篇貼文獲得了 356 個讚——是我攝影作品的好幾倍。

老實說，看到這個數字，我的第一反應是有點複雜。十幾年的攝影功力，敵不過一個 prompt？

但仔細想想，那些讚按的是什麼？是「驚訝」，是「這個攝影師居然在玩這個」，也是一種時代的集體共鳴——2023 年初，正是 Stable Diffusion 和 Midjourney 讓所有人開始重新思考「圖像是什麼、誰可以創造圖像」的時刻。

![AI 生圖實驗第一週](/assets/facebook-archive/photos/2023-02-14_629017969233007_1.jpg)

## 第二週：效果太好，開始認真研究

隔天我又貼了一篇，標題大概是：「昨天貼文的效果太好，讓我覺得以後是不是用生成的圖來騙讚也不錯，反正跟我的攝影差不多也是從一堆照片中選來貼。」

這是半開玩笑，但也是真心話。

**攝影的本質**，從選景、打光、指導模特兒、後製，到最後從幾百張中挑出那一張——其實是一個持續的「篩選與判斷」過程。AI 生圖改變的只是輸入端（從快門變成 prompt），輸出端的美學判斷，仍然是人在做。

第二週，我開始系統性地研究 Stable Diffusion 的工作流程。

![AI 生圖實驗第二週](/assets/facebook-archive/photos/2023-02-15_630136942454443_1.jpg)

## 第三週：Stable Diffusion + 模型組合

2023-02-20 的實驗組合：

```
Stable Diffusion + ChilloutMix + Korean Doll Likeness + Taiwan Doll Likeness + Ulzzang-6500
```

那時還不太懂模型組合的原理，但效果已經很驚人。

幾個心得：

- **LoRA 模型**讓 Stable Diffusion 可以針對特定風格或臉型進行微調
- **ChilloutMix** 是當時流行的亞洲臉孔基礎模型
- **提示詞工程（Prompt Engineering）**和攝影的「場景設定」有驚人的相似之處——你要告訴 AI 光線、角度、情緒、服裝，就像在現場指導一場拍攝

![Stable Diffusion 模型組合實驗](/assets/facebook-archive/photos/2023-02-20_634292428705561_1.jpg)

## 第四週：九頭身美少女與視覺疲勞

到了三月，試了一個容易產生「九頭身美少女」的模型，又是一批高讚圖。

但同時，也開始覺得有點視覺疲勞。

那時貼了一句引用小王子的話：「真正重要的東西，用眼睛是看不見的」，配上一張真實拍攝的制服女孩照片。

這不是在否定 AI，而是在提醒自己——

**攝影的價值，不只是最終的那張圖像，而是拍攝當下的連結、信任、與那個無法複製的瞬間。**

## 結語：攝影師怎麼看 AI 生圖

玩了一個月之後，我的結論不是「AI 會取代攝影師」，也不是「AI 生圖不算藝術」。

而是：**兩者根本在回答不同的問題。**

AI 生圖回答的是：「我可以視覺化什麼樣的想像？」

攝影回答的是：「這個真實的人，在這個真實的瞬間，有什麼值得記錄？」

當然，這兩個問題的邊界正在模糊——用 AI 協助概念設計、用攝影捕捉真實執行的成果，或許才是接下來的創作方式。

---

**相關 Facebook 貼文**：
- [2023-02-14 原文](https://www.facebook.com/SwankyParty/posts/pfbid02hNsdheDiBKX7gzmFSRHD8byVp4Ym3WkKuXK8LhC49Dbf3XbWZ7UXo2CQPt37ur3Tl)（356 讚）
- [2023-02-15 原文](https://www.facebook.com/SwankyParty/posts/pfbid02NQoMGw8nsP7exuV9H9JrSDF23JVGBAoVZ9xrxZZapNC4nM6zUxVXDMVV99MC4qT9l)（273 讚）
