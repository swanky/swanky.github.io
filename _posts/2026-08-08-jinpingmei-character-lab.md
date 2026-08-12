---
title: "用 AI 替一部百回小說建立全劇組角色設定：金瓶梅角色研究館的工作流"
seo_title: "AI 角色設定工作流：從金瓶梅百回原文到十大角色卡、三視圖與選角母版"
date: 2026-08-08
published: true
categories: [claude-code, technical]
permalink: /claude-code/jinpingmei-character-lab/
tags: [ai-agent, ai-visual, character-design, jinpingmei, workflow, agent-skills]
layout: article
cover_image: /assets/img/jinpingmei/covers/character-lab-banner.jpg
cover_alt: "水手服少女從古書整理多位角色的正面、側面與背面設定圖"
cta_context: ai-visual
related_posts:
  - ai-moderation-jinpingmei
  - ai-document-human-comprehension
  - hermes-agent-openrouter-video-generation
hero_image: true
description: "一套 AI 工作流讀完《金瓶梅詞話》一百回，海選出角色、建立十張附逐字原文依據的角色卡，再生成三視圖設定與擬真選角母版——完整方法與品質關卡公開。"
keywords: AI 角色設定, 角色卡, 金瓶梅, 三視圖, character design, AI workflow, 原典考證, 虛擬劇組, 史旺基, Swanky Studio
---

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>做了什麼</strong>：讓 AI 讀完《金瓶梅詞話》全一百回，從書中海選角色、建立十張附逐字原文依據的角色卡，再生成三視圖設定圖與擬真選角母版。</li>
    <li><strong>關鍵不是生圖</strong>：是「證據紀律」——每個人物設定都能回指到原文行號，每張圖都經過「圖像觀察 vs 原典證據 vs 裁決」的審查迴圈。</li>
    <li><strong>成果在哪</strong>：<a href="/jinpingmei/characters/">角色研究館</a>可以逛，每一頁都附工作底稿；選角流程在<a href="/jinpingmei/studio/">影像工作室</a>。</li>
  </ul>
</div>

## 起點：一部小說，能不能長出一個劇組？

假設今天要把《金瓶梅》拍成影集或做成遊戲，第一件事不是寫劇本，而是回答一連串基本問題：這本書裡到底有哪些人？誰重要？他們長什麼樣子、說話什麼調性、彼此是什麼關係？傳統做法是文學顧問讀書做筆記，以月為單位計。

我把這件事交給 AI 工作流，在短時間內走完了全程。這篇文章公開整套方法——不是「一個神奇 prompt」，而是一條有品質關卡的生產線。

## 第一步：全文入庫

素材是公共領域的《金瓶梅詞話》（萬曆本），取 Wikisource 整理稿，逐回切成一百份結構化文字。這一步看似平凡，卻決定了後面所有環節的品質：每一條人物證據都要能標註出處回目與行號，沒有乾淨的文本庫就沒有可追溯的證據。

（這份文本庫後來也直接變成了站上的<a href="/jinpingmei/text/">原文書房</a>——全文一字未刪改，線上可讀。）

## 第二步：海選——以及海選的殘酷現實

讓 AI 掃描全書抓「像人名的東西」，粗合併後得到超過一千兩百筆候選。這個數字聽起來很壯觀，實際上充滿污染：同一人的多個稱謂、官職誤判、詩詞裡的典故人物都混在裡面。

這是第一個重要教訓：<strong>AI 海選的產出不能直接當結論用</strong>。候選名單需要清洗、合併、排名，最後用「出場證據是否充足」的標準篩出經得起驗證的主要角色——我們定為安全前十名：西門慶、潘金蓮、吳月娘、李瓶兒、春梅、陳經濟、孟玉樓、應伯爵、孫雪娥、李嬌兒。

## 第三步：角色卡——每一句側寫都要有出處

十位角色每人一張卡，欄位包括：身份、性格、外貌、性情、動機、人物弧光、人物關係。規則只有一條：<strong>寫得出來的就引原文，引不出來的就標「（推斷）」</strong>。

例如潘金蓮的「機變伶俐」不是 AI 的印象分數，是第一回的原文：「本性機變伶俐」；她的善妒也不是刻板印象，是她自己說的：「我眼子裏放不下砂子的人」。每張卡的最後都有一排逐字引文，讀者可以自己去原文書房對答案。

## 第四步：形象與聲音——把證據翻譯成指令

角色卡完成後，才輪到生成。每位角色產出三份「給 AI 的設定指令」：

- <strong>形象設定指令</strong>：中英雙語的角色描述，外加排除條件（negative prompt）——明確禁止現代服飾、幼態比例與情色化構圖。
- <strong>三視圖指令</strong>：要求正、側、背三視角同比例、同服裝、同配色，產出可交給美術管線的 model sheet。
- <strong>聲音設定</strong>：音色、音高、語速、口音、情緒的文字規格，供語音生成使用。

這些指令全部公開在每個角色頁的「AI 選角檔案」段落——它們本身就是作品的一部分。

## 第五步：品質關卡——圖像觀察 vs 原典證據 vs 裁決

生成的圖不會直接定稿。每張候選圖走一次三段式審查：

1. <strong>圖像觀察</strong>：這張圖實際畫了什麼？（例：候選的潘金蓮披了一件原典沒有的奇幻宮廷披風）
2. <strong>原典證據</strong>：書裡怎麼寫？（第二回：毛青布大袖衫、湘裙、白綾高底鞋——逐字列出）
3. <strong>裁決</strong>：保留什麼、修掉什麼。（保留臉與漂亮度；服裝依原典重做）

裁決寫成文字記錄，下一輪生成必須回應上一輪裁決。<a href="/jinpingmei/studio/">影像工作室</a>裡有完整的實例與定裝迭代對照圖。

## 心得：AI 的價值在流程，不在單次輸出

這個專案最大的體會：AI 單次輸出的品質天花板不高，但<strong>把 AI 放進一條有證據紀律、有審查關卡、有迭代記錄的流程裡，品質就能收斂</strong>。十張角色卡、十張三視圖、五張擬真選角母版、加上可線上閱讀的百回全文——都是同一條流程的產物。

成果都在站上：從<a href="/jinpingmei/">金瓶梅宇宙</a>進去逛一圈，每一頁都留了工作底稿。如果你的團隊也想把類似流程導入內容生產，歡迎參考<a href="/technical/ai-visual-production/">AI 視覺內容製作</a>服務。
