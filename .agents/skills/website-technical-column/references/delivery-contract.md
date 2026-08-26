# Website technical column — delivery contract

本檔定義每次 skill 執行的最低交付內容。實際欄位仍以網站 repo 當下的 `AGENTS.md`、layout 與鄰近文章為準。

## 1. 輸入可以是什麼

使用者可提供一種或多種：

- 網頁、官方文件、新聞、論文、GitHub repo／release、產品頁。
- YouTube／Podcast／訪談影片與逐字稿。
- HTML、Markdown、PDF、簡報、筆記、對話紀錄。
- 一句題目、觀點、問題或想驗證的假說。
- Banner 人物參考圖、想保留的視覺元素或禁用元素。

若輸入同時包含來源全文與原始 URL，兩者都保留：全文便於逐段分析，URL 用於引用與讀者查核。

## 2. 內部研究 brief

動筆前先完成但不必公開：

```text
主題：
核心問題：
一句核心判斷：
目標讀者：
非技術讀者收穫：
技術讀者收穫：
文章邊界：
來源事實：
廠商宣稱：
獨立量測：
作者計算：
Swanky 判斷：
待確認：
可能的反方／失敗模式：
```

## 3. Visual plan

```text
Banner
- 核心決策：
- 單一視覺隱喻：
- 主角動作：
- 其他成年美少女角色與任務：
- 3–6 個主題物件：
- 避免清單：
- 參考圖：

Figure 1
- 讀者問題：
- 圖型：架構／流程／比較／時間／成本／其他
- 資料來源：
- 一句結論：

Figure 2...
```

每張 Figure 必須回答不同問題。若無法說出它降低了哪一個理解成本，就不要做。

## 4. 文章 front matter 最低欄位

```yaml
---
title: "<自然、可讀的文章標題>"
seo_title: "<搜尋意圖較清楚的標題>"
date: YYYY-MM-DD
published: false
categories: [technical]
tags: [<lowercase-or-project-convention>]
layout: article
cover_image: /assets/img/linkedin/<slug>.jpg
cover_alt: "<白話說明畫面與文章概念>"
cta_context: <existing-context>
related_posts:
  - <existing-slug-1>
  - <existing-slug-2>
  - <existing-slug-3>
hero_image: true
description: "<不誇大的搜尋摘要>"
keywords: <逗號分隔的主題詞與品牌詞>
---
```

只有文章確實先發布或同步在 LinkedIn／X 時，才加：

```yaml
source_url: "https://www.linkedin.com/pulse/..."
source_url_x: "https://x.com/.../status/..."
```

不要把使用者提供的研究來源誤填成 `source_url`；研究來源應放 inline citations 與文末參考資料。

## 5. 建議文章元件順序

```text
Front matter
30 秒結論
文章大綱
具體場景／核心問題
白話解釋
技術拆解
Figure：怎麼運作
證據、比較或案例
Figure：差在哪／量測結果
限制與失敗模式
Figure：風險／成本／判斷框架（有需要才做）
如果是我，我會怎麼做
安靜收尾
AI Banner 揭露（若需要）
參考資料
```

不要為了湊結構寫空洞段落。素材較短時可以合併；技術複雜時可以增加章節，但每節仍要有新的讀者價值。

## 6. 圖片與圖表資產紀錄

每個非自製資產要有內部紀錄：

```text
file:
kind: source-photo | source-screenshot | third-party-image | recreated-chart | ai-concept
original_url:
creator:
license_or_basis:
retrieved_at:
caption:
alt:
transform: none | crop | resize | redraw-from-data
```

`license_or_basis` 不明時，不把第三方圖片加入公開 repo。可改成以來源資料重畫的原創 SVG，但資料與結論仍要引用。

## 7. Owner review handoff

只在 Agent QA 全綠後交付一次：

```text
Review URL：
預期正式 URL：
文章標題：
核心判斷：
本次 scope：
- 文章：
- Banner：
- 內文視覺：
- hub／CSS／test（若有）：

已驗證：
- citation：
- npm test：
- normal production build：
- review build：
- desktop browser：
- mobile 390px：
- assets／links：

尚未執行：commit、push、正式部署、桌面最終社群 TXT。
請 Owner 只需要回答是否可發布，或指出要改的地方。
```

## 8. 桌面 TXT 格式

檔名：

```text
C:\Users\swank\Desktop\<slug>-linkedin.txt
C:\Users\swank\Desktop\<slug>-x.txt
```

LinkedIn TXT 只含：

```text
<鉤子／判斷>

<文章在解什麼，以及讀者能得到什麼>

<一小句收束>
<正式文章 URL>

<0–3 個 hashtags，沒有也可以>
```

X TXT 只含：

```text
<鉤子與核心判斷>

<讀者收穫>
<正式文章 URL>
<0–2 個 hashtags，沒有也可以>
```

不要加「LinkedIn 版」「請複製以下文字」「字數 238」等不能直接貼出的文字。

## 9. 最終完成回報

```text
已發布：<正式 URL>
文章：<absolute path>
Banner：<absolute path>（1920×1080 JPG，來源／生成說明）
內文視覺：<數量與 paths>
社群轉貼文：
- <linkedin txt absolute path>
- <x txt absolute path>

驗證：
- citation／tests／fresh build／desktop／mobile／live marker 摘要
- commit SHA
- GitHub Actions run／deploy 狀態
- local ↔ remote：0 0

仍有已知限制：<沒有就寫無；有就具體說明>
```

不宣稱未實際驗證的結果；如果 live propagation 尚未完成，就明寫「已 push、部署成功、正式站尚未讀到新版」，繼續查到成功或誠實回報 blocker。
