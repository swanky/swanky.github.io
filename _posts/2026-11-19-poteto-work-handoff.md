---
title: "確認信寄了，客人就約好了嗎？Lauren Tan 談怎麼把工作教給 AI"
seo_title: "Lauren Tan 的 Grok Bot 自動化思考：從客戶預約、修車廠等候到例行工作"
description: "一封時間對不上的預約信，一則嫌等太久的評論。從 Lauren Tan 的兩個例子，看懂怎麼讓 AI 學會人的判斷，也從結果得到回饋。"
date: 2026-11-19
published: true
layout: article
categories: [technical]
tags: [ai-agent, agentic-engineering, grok-bot, poteto, workflow]
keywords: Lauren Tan, poteto, Grok Bot, AI 自動化, 工作交接, 客戶預約, 例行工作, Dr Eggbot
hero_image: true
cover_image: /assets/img/linkedin/poteto-work-handoff.jpg
cover_alt: "概念插畫中，Lauren Tan 伸手攔住機器人的綠勾印章，史旺姬舉起星形孔齒輪，台上待蓋的藍色齒輪卻是三角形孔。"
cta_context: agentic
related_posts:
  - poteto-pstack-trust-before-scale
  - grok-x-relay-experiment
  - pstack-six-skills-workday
---
客人信裡寫的時間，跟預約系統裡的時間不一樣。現在，輪到替店家處理預約的 AI 回信了。它該相信哪一邊？

Lauren Tan（@poteto）在〈Automate Anything with Grok Bot〉裡，把這道題留給最熟悉店務的人。她沒有給出「信件優先」或「系統優先」的標準答案。每家店都有自己的約定，老手往往一眼就知道該回頭查什麼。真正難交接的，就是那一眼。順著她的預約與修車廠兩個例子讀下去，會發現她講的自動化，有很大一部分發生在機器開始做事之前。[Lauren Tan 原文](https://x.com/poteto/status/2123159537016533493)

<div class="article-tldr"><span class="article-tldr-label">30 秒結論</span><ul>
<li>先講客人最後要得到什麼。助手知道目標，才有辦法看出原來的步驟哪裡能改。</li>
<li>挑一個平常會讓人停下來查的例外，請助手說明它會怎麼辦。這能找出熟手還沒交代的判斷。</li>
<li>把客戶的回饋接回同一筆服務紀錄，才有線索改善流程。工作何時自動啟動，是最後才要回答的問題。</li>
</ul></div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part"><span class="article-toc-part-title">交代目標與判斷</span>
      <ol class="article-toc-items">
        <li><a href="#pie">從一個蘋果派開始</a></li>
        <li><a href="#potato">讓 Potato 把工作說回來</a></li>
        </ol>
    </li>
    <li class="article-toc-part"><span class="article-toc-part-title">讓工作接得起來</span>
      <ol class="article-toc-items">
        <li><a href="#booking">一筆預約有兩端要對上</a></li>
        <li><a href="#repair">「等太久」是等在哪裡？</a></li>
        <li><a href="#routine">什麼時候才讓它自己開始？</a></li>
        <li><a href="#references">參考資料</a></li>
      </ol>
    </li>
  </ol>
</nav>

## 從一個蘋果派開始
{: #pie}

Lauren 從烤派談起。買蘋果、備料、組裝、進烤箱，最後還得留時間放涼。食譜寫的是一連串動作；桌上那個可以端出去的派，才讓人知道前面的工夫完成了。換一家烘焙坊，設備變了，做法可以跟著變，想端上桌的東西仍然說得清楚。

辦公室裡反而容易弄混。一個人每天填同一張表、寄同一種信，很自然會把工作描述成「幫我填表寄信」。Lauren 建議再往後問一步：誰拿到它，接著能做什麼？如果店家想要的是客人能在對的時間得到服務，一封寄得很快、時間卻寫錯的信，只會讓客人更有把握地在錯的時候出門。

這也解釋了她為什麼把目標擺在提示詞前面。只交代每個按鈕怎麼按，助手可以把原來的習慣照做一遍。講清楚結果，店家才有理由接受一個步驟更少、客人也約得到的做法。

## 讓 Potato 把工作說回來
{: #potato}

接著，Lauren 邀讀者開一個 Grok Bot。連取名字都不必卡太久，她打趣說，想不到就先叫它 **Potato**。如果連目標都還說不清楚，可以讓這顆「馬鈴薯」先當訪談者，一次問一題，把要負責的事情慢慢問出來。

到了交代流程，她反而鼓勵人先放下整理文件的壓力。打開語音，把自己平常怎麼做、會看哪個工具、哪裡容易出錯，一口氣講出來。說著說著，店主也許才想起來，同樣是一小時的服務，交給不同的人做，下一組客人能排進來的時間未必相同。這種補充，比再列一次「開啟行事曆」有價值得多。

接下來有個小小的停頓：**先請 Potato 把它理解的目標與做法說回來。** 聽的人可以當場發現它漏掉了兩組客人之間的緩衝，或者把「先問客人能不能改期」聽成「直接替客人改期」。此刻修正，成本只是一句話。等它已經接上工具、送出通知，再來解釋就遲了。

## 一筆預約有兩端要對上
{: #booking}

現在回到那封時間對不上的信。Lauren 建議拿幾個真的出過差錯、或熟手臨時換了做法的例子，讓助手說說會怎麼處理。聽到回答後再補規則，比坐下來一次窮舉所有可能情況容易得多。

<figure><picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/diagrams/poteto-work-handoff-booking-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/diagrams/poteto-work-handoff-booking.svg' | relative_url }}" alt="信件與預約紀錄的時間不一致，先查核；欠資料時保留同一筆待辦，確認後再核對預約與通知。" style="width:100%;height:auto"></picture><figcaption>圖一．依 Lauren 的預約例子整理。哪份資料有決定權，要由熟悉店務的人交代。</figcaption></figure>

她把「預約完成」說得很具體：**店裡要正確存好這一筆，客人也要收到對應的確認。** 只看寄件匣，查不到店裡究竟留了哪個時段；只看預約畫面，也無法知道客人拿到的是哪個時間。忙碌的一天裡，最容易消失的是夾在中間的那一筆：還在等客人補資料，今天沒有結案，明天換人處理。

於是，助手還得保留自己在等什麼。客人隔天回信，它要能接回原本那筆預約，免得好心又幫客人排了一次。在 Lauren 的教法裡，讓助手知道何時找人確認，和教它如何順利做完，是同一門功課。

## 「等太久」是等在哪裡？
{: #repair}

就算預約都排對了，店家還是可能收到一句「等太久了」。Lauren 把鏡頭移到修車廠。這是一個設想的案例：如果助手能讀到顧客在評論裡的抱怨，又能找到這位客人當天的到店紀錄，它會多知道什麼？

光看完工時間，很難分辨客人把時間花在哪裡。她建議留下幾個普通卻有用的時刻：客人何時到店、何時和服務人員說上話、何時交出鑰匙，以及維修何時動工、何時結束。這些紀錄可以來自店員在手機上隨手登記的小工具，不必等到店裡先有一套龐大的系統。

<figure><picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/diagrams/poteto-work-handoff-repair-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/diagrams/poteto-work-handoff-repair.svg' | relative_url }}" alt="修車服務的五個時點，從客人抵達、接待、交鑰匙到動工、完工，可分段檢查等候與維修時間。" style="width:100%;height:auto"></picture><figcaption>圖二．五個時點依先後排列。到店至接待的等候時間、動工至完工的維修工時，都要用當天的實際紀錄計算。</figcaption></figure>

同樣一句「等很久」，可能要找完全不同的人來談。若客人站在櫃檯許久才有人招呼，把修車手腳練快也幫不了那一段。若鑰匙很快就收了、車卻遲遲沒動工，下一個值得查的是收車之後的安排。時間能幫忙定位問題，原因仍要回到當天情況核對。

這裡還差一個不起眼的條件。評論在一個地方，工單在另一個地方，怎麼確定談的是同一次服務？Lauren 提到，跨工具的資料要有一致的識別資料，例如客戶編號或訂單號碼。同一位熟客可能來過三次，找到人後還要對到那次到店。否則助手分析得再仔細，也可能替上星期的等待解釋今天的抱怨。

這就是她所說的「讓助手改善自己」在店裡具體會長什麼樣子。客人的一句話成為線索，服務紀錄讓線索可以查證；助手接著提出改善建議，店家才有東西可討論。

## 什麼時候才讓它自己開始？
{: #routine}

直到文章末段，Lauren 才談 Grok Bot 的 **routines**，也就是事先約定什麼情況下啟動一件工作。一封新的預約信適合在抵達時處理；回顧一週裡哪些客人等得久，則可以固定時間整理。兩種工作各自有合適的節奏。

她也在文末介紹了 **Dr Eggbot**，把前面那套訪談、整理工作、設計助手的方法，做成一個協助讀者設計其他機器人的助手。有趣的是，從蘋果派走到這裡，讀者最先要準備的東西始終很樸素：想幫誰、省掉什麼麻煩，以及哪個細節搞錯了，對方明天就會白跑一趟。

回頭看開場那封信，一個懂店務的助手，即使還不知道正確時間，至少知道它在等哪位客人、哪一筆預約、哪一個答案。等客人回信時，它接得上。這樣的一件小事，才值得每天自動發生。

原文為 Lauren Tan（@poteto）的〈Automate Anything with Grok Bot〉。本文依原文重述其方法與假設情境，兩張圖解為依文意重繪。

## 參考資料 {#references}

- **[1]** [Lauren Tan：Automate Anything with Grok Bot](https://x.com/poteto/status/2123159537016533493)
