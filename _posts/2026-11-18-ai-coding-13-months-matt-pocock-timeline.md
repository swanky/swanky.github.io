---
title: "沒人在寫程式了，然後呢？AI 寫程式這 13 個月，卡關的地方換了五次"
seo_title: "AI coding 這一年：Matt Pocock 時間軸解讀＋2026 年 11 月前沿模型能力比較（Artificial Analysis）"
date: 2026-11-18
published: true
categories: [technical]
tags: [ai-coding, ai-agent, agentic-engineering, matt-pocock, artificial-analysis, benchmark, code-review, software-engineering]
layout: article
cover_image: /assets/img/linkedin/ai-coding-13-months-matt-pocock-timeline.jpg
cover_alt: "插畫：深藍色的科技空間裡，一整面牆排著 13 塊發光的月份面板，左邊塞滿程式碼的光線，越往右越空；史旺姬站在右側，舉著大放大鏡細看最後一塊面板裡的一小段程式碼。"
hero_image: true
use_glightbox: true
cta_context: agentic
extra_css: |
  .post-content .gl-list { border: 1px solid #E6E1D6; border-radius: 12px; background: #fff; padding: 6px 20px; margin: 20px 0; }
  .post-content .gl-list dt { font-weight: 800; color: #232020; margin-top: 12px; }
  .post-content .gl-list dt span { font-weight: 400; color: #5F5B53; font-size: 0.9em; margin-left: 6px; }
  .post-content .gl-list dd { margin: 2px 0 10px; padding-bottom: 10px; border-bottom: 1px dashed #E6E1D6; }
  .post-content .gl-list dd:last-child { border-bottom: 0; }
  .post-content .tl-table-wrap { overflow-x: auto; margin: 20px 0; }
  .post-content .tl-table { min-width: 560px; width: 100%; border-collapse: collapse; font-size: 0.95em; }
  .post-content .tl-table th { background: #FBF3DC; border-bottom: 3px solid #E5A300; text-align: left; padding: 8px 10px; }
  .post-content .tl-table td { border-bottom: 1px solid #EEE9DD; padding: 8px 10px; vertical-align: top; }
  @media (max-width: 600px) { .post-content .gl-list { padding: 4px 14px; } }
related_posts:
  - matt-pocock-skills-ai-coding-workflow
  - all-code-is-slop-verification-evidence
  - artificial-analysis-llm-evaluation-2026
description: "Matt Pocock 用 13 行回顧 AI 寫程式這一年。對照最新的前沿模型評比和每件事的原始出處，看卡關的地方怎麼從寫程式一路換到審查與負責。"
keywords: Matt Pocock, AI coding, AI 寫程式, Artificial Analysis, Intelligence Index, Coding Agent Index, Claude Fable 5.2, GPT-6.2 Astra, Gemini 4 Carbon, Claude Opus 5.5, No AI Slop, Loop Engineering, Agent Skills, 史旺基, Swanky Studio
---

2025 年 11 月 24 日，Anthropic 發表 Claude Opus 4.5。那時候，用 AI 寫程式的人還在討論它能不能接手大部分的工作。

一年後的 11 月 16 日，寫 TypeScript 教學出名的 Matt Pocock 在 X 上發了一則貼文：用 13 行，一個月一行，回顧 AI 寫程式這一年。第一行就是 Opus 4.5，最後一句是：

> TL;DR: no-one is writing code anymore, and we are still figuring out what that means
>
> （一句話：沒有人在寫程式了，而我們還在想這到底代表什麼。）

兩天內累積了二十六萬多次瀏覽。[[1]](https://x.com/mattpocockuk/status/2122287575557706226) 底下有一則回覆很能代表大家的感覺。Lauren Tan（網路上叫 Poteto），就是一週前在大會上講「人改看證據」的那位，回了一句：

> opus 4.5 feels like an eternity ago. incredible how far things have progressed in just a year
>
> （Opus 4.5 感覺已經是上輩子的事了。才一年，進展快到不可思議。）

一年前的旗艦模型，現在讀起來像古代史。這篇就照 Matt 的時間軸，把這一年當成一段歷史來讀。

隔天，獨立評測機構 Artificial Analysis 公布 OpenAI 新模型 GPT-6.2 的成績：綜合能力排到第二名，但在「讓 AI 自己動手寫程式」那份評比裡，分數幾乎沒動。[[2]](https://x.com/ArtificialAnlys/status/2122750634210529569)

這兩則貼文放在一起看，剛好回答 Matt 留下的問題。**我的判斷：這 13 個月不是「AI 取代了寫程式」，而是卡關的地方一直在換。** 模型夠強以後，人先卡在要做的決定太多，接著卡在流程，再來卡在怎麼交代清楚，最後回到「這東西我敢不敢負責」。每一波熱潮，都在收拾上一波留下來的問題。

<div class="article-tldr">
  <span class="article-tldr-label">30 秒結論</span>
  <ul>
    <li><strong>Matt 的 13 行，一半是查得到的事件，一半是他的體感</strong>：我把每一行都找回原始出處，查不到的就照「他的觀察」寫。</li>
    <li><strong>一年換了好幾代，頂尖模型已經擠在一起</strong>：11 月的評比裡，前四名綜合分數只差 6 分；換成「實際動手寫程式」，前段班更是擠在約 3 分之內。</li>
    <li><strong>模型變聰明，不等於寫程式變強</strong>：GPT-6.2 綜合分數跳 5 分，寫程式的分數持平；推理開到最高的 Claude Fable 5.2，寫程式反而比次高一檔的分數低，錢多花將近三倍。</li>
    <li><strong>速度的帳還算不清</strong>：目前最嚴謹的實驗，連研究團隊自己都說只是「很弱的證據」。</li>
    <li><strong>程式碼可以少看，判斷不能交出去</strong>：11 月的 No AI Slop 宣言寫得很清楚，模型再強，人還是要審計畫、設計或結果其中一樣，看哪一樣，由風險決定。</li>
  </ul>
</div>

<nav class="article-toc article-toc--outline" aria-label="文章大綱">
  <span class="article-toc-label">本文大綱</span>
  <ol class="article-toc-parts">
    <li class="article-toc-part"><span class="article-toc-part-title">先看懂這張時間軸</span><ol class="article-toc-items">
      <li><a href="#terms">先對齊幾個名詞</a></li>
      <li><a href="#timeline">13 行壓成一張圖：卡關的地方換了五次</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">五次換站</span><ol class="article-toc-items">
      <li><a href="#models">2025 年冬，第一站：模型夠好，卡關離開「寫」</a></li>
      <li><a href="#frontier">前沿模型現在到哪了：11 月這兩張表</a></li>
      <li><a href="#decisions">2026 年初，第二站：人累了，卡在「做決定」</a></li>
      <li><a href="#process">2026 年春夏，第三站：流程大爆發</a></li>
      <li><a href="#handoff">2026 年夏末，第四站：怎麼交代、怎麼管</a></li>
      <li><a href="#speed">2026 年秋，第五站：說好的速度呢</a></li>
    </ol></li>
    <li class="article-toc-part"><span class="article-toc-part-title">所以人要看什麼</span><ol class="article-toc-items">
      <li><a href="#reading">程式碼還要讀嗎</a></li>
      <li><a href="#limits">我不買單的三個地方</a></li>
      <li><a href="#start">如果是我，接下來會做的三件事</a></li>
    </ol></li>
  </ol>
</nav>

## 先對齊幾個名詞 {#terms}

這一年的討論長了很多新詞，Matt 那 13 行幾乎每行都有一個。先把這篇會用到的列出來，後面碰到就不再停下來解釋。

<dl class="gl-list">
  <dt>SOTA<span>state of the art</span></dt>
  <dd>「當下最頂尖」的意思。說「SOTA 模型」就是目前最強的那幾個模型；Matt 說的「SOTA devs」，指的是走在最前面、最早全面改用 AI 的那群開發者，不是所有工程師。</dd>
  <dt>前沿模型<span>frontier model</span></dt>
  <dd>各家 AI 公司能力最強的那一款，例如 Anthropic 的 Claude Fable 5.2、OpenAI 的 GPT-6.2 Astra、Google 的 Gemini 4 Carbon。</dd>
  <dt>Agent<span>AI 代理</span></dt>
  <dd>不只回答問題，還會自己動手做事的 AI：讀檔案、改程式、跑測試，一路做到交差。</dd>
  <dt>代理工具<span>harness</span></dt>
  <dd>把模型包起來、讓它能動手的那層軟體，例如 Claude Code、Codex、Antigravity。同一個模型換一個代理工具，表現可能不一樣。</dd>
  <dt>推理強度<span>effort</span></dt>
  <dd>讓模型想多久的設定，分低、中、高、最高等檔位。Artificial Analysis 的檔位由低到高是 low、medium、high、xhigh、max，本文分別寫成低、中、高、次高、最高。想越久通常越準，也越貴、越慢，但不一定一路往上。</dd>
  <dt>評測<span>benchmark</span></dt>
  <dd>一套固定的考題，讓不同模型考同一份卷子比分數。考什麼、怎麼改分，決定了分數能說明什麼。</dd>
  <dt>PR<span>pull request</span></dt>
  <dd>一份「我改了這些程式，請檢查後合併」的申請。審 PR 就是合併前由人檢查修改內容。</dd>
  <dt>Slop</dt>
  <dd>原意是餿水。在這裡指「做的人沒花心思、卻要看的人花大把時間弄懂」的 AI 產出。</dd>
</dl>

## 13 行壓成一張圖：卡關的地方換了五次 {#timeline}

Matt 的原文每月一句，從 2025 年 11 月寫到 2026 年 11 月。[[1]](https://x.com/mattpocockuk/status/2122287575557706226) 我把 13 行逐一找回原始出處，再依「那個月大家卡在哪」分成五站。

<figure>
  <a href="{{ '/assets/img/technical/ai-coding-13-months-matt-pocock-timeline/timeline.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="ai-coding-13-months" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/ai-coding-13-months-matt-pocock-timeline/timeline-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/ai-coding-13-months-matt-pocock-timeline/timeline.svg' | relative_url }}" alt="AI 寫程式這 13 個月分成五站：2025 年 11 到 12 月卡關離開寫程式；2026 年 1 到 2 月卡在做決定；3 到 7 月卡在流程；8 到 9 月卡在怎麼交代；10 到 11 月回到誰來負責。實心點是查得到出處的事件，空心點是 Matt 的觀察。" width="840" height="776"></picture>
  </a>
  <figcaption>自製示意圖，依 Matt Pocock 原貼文整理，分站是我的歸納。實心點是有原始出處的事件，空心點是他的觀察、沒有獨立數據。來源：<a href="https://x.com/mattpocockuk/status/2122287575557706226">[1]</a></figcaption>
</figure>

讀這張圖前有一件事要先知道：**Matt 寫的是「流行起來」的月份，不是「出現」的月份。** 例如他寫 1 月 Ralph 迴圈流行，但 Geoffrey Huntley 介紹這個做法的文章是 2025 年 7 月；[[7]](https://ghuntley.com/ralph/) 他寫 3 月 Skills 大爆發，Anthropic 推出 Agent Skills 是 2025 年 10 月。[[10]](https://claude.com/blog/skills) 新做法從出現到變成大家都在談，常常隔好幾個月。

## 2025 年冬，第一站：模型夠好，卡關離開「寫」 {#models}

2025 年 11 月 24 日，Anthropic 發表 Claude Opus 4.5。[[5]](https://www.anthropic.com/news/claude-opus-4-5) 同一天，Peter Steinberger 的開源專案 OpenClaw 在 GitHub 建立，[[6]](https://github.com/openclaw/openclaw) 那是一個裝在自己電腦上、透過你平常用的聊天軟體幫你做事的 AI 助手。Matt 把這兩件事放在時間軸的第一格。

12 月那行說：社群普遍認為，模型已經好到能處理 95% 的寫程式工作。這個 95% 沒有出處，是 Matt 對當時氣氛的描述，不是量測結果。但方向沒有錯：到了 4 月，他寫「多數走在最前面的開發者，已經好幾個月沒親手寫一行程式」。

Poteto 說「像上輩子」，不是誇張。照 Artificial Analysis 收錄的發布日期，Opus 4.5 之後的 12 個月裡，Anthropic 又推出了 8 款旗艦等級的模型，平均不到一個半月一款：[[4]](https://artificialanalysis.ai/agents/coding)

<div class="tl-table-wrap">
<table class="tl-table">
  <thead><tr><th>發布日</th><th>Anthropic 旗艦模型</th><th>同一時期 OpenAI</th></tr></thead>
  <tbody>
    <tr><td>2025-11-24</td><td>Claude Opus 4.5</td><td>GPT-5.1（11-13）</td></tr>
    <tr><td>2026-02-05</td><td>Claude Opus 4.6</td><td>GPT-5.3 Codex（同日）</td></tr>
    <tr><td>2026-04-16</td><td>Claude Opus 4.7</td><td>GPT-5.5（04-23）</td></tr>
    <tr><td>2026-05-28</td><td>Claude Opus 4.8</td><td></td></tr>
    <tr><td>2026-06-09</td><td>Claude Fable 5</td><td>GPT-5.6（07-09）</td></tr>
    <tr><td>2026-07-24</td><td>Claude Opus 5</td><td></td></tr>
    <tr><td>2026-09-01</td><td>Claude Fable 5.1</td><td>GPT-6 Astra（09-03）</td></tr>
    <tr><td>2026-09-22</td><td>Claude Opus 5.5</td><td>GPT-6 Sol（同日）</td></tr>
    <tr><td>2026-11-09</td><td>Claude Fable 5.2</td><td>GPT-6.2 Astra、Sol（11-17）</td></tr>
  </tbody>
</table>
</div>

OpenAI 這一年也從 GPT-5.1 走到 GPT-6.2。一個工具、一種寫法，往往還沒寫完教學，底下的模型就換了一代。

**寫程式這件事，從這裡開始不再是瓶頸。** 那瓶頸去了哪？先看模型這一層現在到哪了。

## 前沿模型現在到哪了：11 月這兩張表 {#frontier}

Artificial Analysis 是一家獨立的 AI 評測機構，用同一套考題測各家模型，我在[〈別再只看排行榜第一名〉]({{ '/technical/artificial-analysis-llm-evaluation-2026/' | relative_url }})拆過它的方法。這次 GPT-6.2 上線後，它的榜單有兩張值得一起看。以下數字都是 2026 年 11 月 18 日從官網直接讀取的。

**第一張是綜合能力（Intelligence Index）**，把 9 項評測合成一個分數，涵蓋推理、知識、科學、寫程式和代理任務。[[3]](https://artificialanalysis.ai/leaderboards/models)

<div class="tl-table-wrap">
<table class="tl-table">
  <thead><tr><th>模型（推理強度）</th><th>綜合分數</th><th>每件任務成本</th></tr></thead>
  <tbody>
    <tr><td>Claude Fable 5.2（最高）</td><td>65</td><td>26.54 美元</td></tr>
    <tr><td>GPT-6.2 Astra（最高）</td><td>62</td><td>4.00 美元</td></tr>
    <tr><td>Gemini 4 Carbon（高）</td><td>60</td><td>5.48 美元</td></tr>
    <tr><td>Claude Opus 5.5（最高）</td><td>59</td><td>10.04 美元</td></tr>
    <tr><td>GPT-6.2 Sol（最高）</td><td>57</td><td>1.01 美元</td></tr>
    <tr><td>Claude Sonnet 5.5（最高）</td><td>55</td><td>10.02 美元</td></tr>
  </tbody>
</table>
</div>

**第二張是寫程式代理（Coding Agent Index）**，讓「模型＋代理工具」實際去做三種工作：改真實專案的程式、在終端機裡操作、回答關於程式碼的技術問題，每題做三次取平均。[[4]](https://artificialanalysis.ai/agents/coding) 它比的是組合，不是單一模型。

<figure>
  <a href="{{ '/assets/img/technical/ai-coding-13-months-matt-pocock-timeline/frontier.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="ai-coding-13-months" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/ai-coding-13-months-matt-pocock-timeline/frontier-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/ai-coding-13-months-matt-pocock-timeline/frontier.svg' | relative_url }}" alt="Artificial Analysis 寫程式代理評比節錄：Claude Code 搭 Fable 5.2 開次高 58.5 分、搭 Opus 5.5 開最高 58.2 分、搭 Fable 5.2 開高 58.2 分，前段班擠在約 3 分之內；Fable 5.2 開到最高反而是 55.7 分，每件任務 44 美元。GPT-6.2 Astra 53.5 分、GPT-6.2 Sol 48.6 分，成本最低。" width="840" height="508"></picture>
  </a>
  <figcaption>自製圖表，數字取自 Artificial Analysis Coding Agent Index（2026-11-18 讀取），節錄 8 個組合；未列入第 2 名、同時混用兩家模型的 Devin Fusion（58.4 分）。分數與成本是不同單位，各畫在自己的尺上。來源：<a href="https://artificialanalysis.ai/agents/coding">[4]</a></figcaption>
</figure>

兩張表對著看，有四件事很清楚：

1. **頂尖幾家已經擠成一團。** 綜合分數前四名差 6 分；寫程式代理的前段班，從 55.5 到 58.5 分，差距約 3 分。[[3]](https://artificialanalysis.ai/leaderboards/models) [[4]](https://artificialanalysis.ai/agents/coding)
2. **綜合分數漲，寫程式不一定跟著漲。** GPT-6.2 Astra 的綜合分數比上一代 GPT-6 Astra 多 5 分（57 → 62），[[24]](https://artificialanalysis.ai/models/gpt-6-astra) 寫程式代理分數卻持平；GPT-6.2 Sol 還掉了大約 3 分。Artificial Analysis 的解釋是：新版回答程式問題時，比上一代更容易漏掉關鍵事實。[[2]](https://x.com/ArtificialAnlys/status/2122750634210529569)
3. **推理強度不是越高越好。** Claude Code 搭 Fable 5.2，開「次高」（xhigh）得 58.5 分；開到「最高」（max）只有 55.7 分，每件任務的成本卻從 15.47 美元變成 44.22 美元，時間從 53 分鐘拉長到 130 分鐘。[[4]](https://artificialanalysis.ai/agents/coding) 這跟我在[〈AI 寫程式的錢花在哪？〉]({{ '/technical/ai-coding-cost-three-knobs/' | relative_url }})整理的開發者實測方向一致。
4. **便宜的選項變多了。** GPT-6.2 Sol 綜合分數 57，每件任務約 1 美元；Artificial Analysis 說它和上一代旗艦 GPT-6 Astra 分數相當，成本只要大約 15%。[[2]](https://x.com/ArtificialAnlys/status/2122750634210529569)

還有一件事這兩張表做不到：**它沒辦法告訴你，模型比 13 個月前強了多少。** 評測的考題會隨模型變強而換新，目前這一版的評分裡，Opus 4.5 沒有分數。[[25]](https://artificialanalysis.ai/models/claude-opus-4-5) 不同版本的分數不能畫在同一條尺上。

所以我讀這兩張表的結論是：**模型這一層，頂尖幾家已經難分高下；決定結果的變數，越來越多落在模型以外。** 選哪個代理工具、開多少推理強度、怎麼交代、怎麼驗收。這正是 Matt 那 13 行後面 11 行在講的事。

## 2026 年初，第二站：人累了，卡在「做決定」 {#decisions}

1 月，Matt 說 Ralph 迴圈開始流行。Huntley 的原文說得很直白：最純粹的 Ralph，就是一段反覆執行同一個指令的小腳本，[[7]](https://ghuntley.com/ralph/) 讓 AI 一輪接一輪做下去，人不用每一步都下指令。

AI 一直做，人就一直要拍板。2 月那行是：大家累壞了，要做的策略決定太多，開始擔心「認知債」。

認知債這個詞，可以追到維多利亞大學 Margaret-Anne Storey 教授 2 月 9 日的文章。她的意思是：做太快欠下的債，不在程式碼裡，在開發者的腦袋裡。[[8]](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/) 程式一直長，懂它的人卻沒跟上。她後來把這個想法寫成論文。[[9]](https://arxiv.org/abs/2603.22106)

這和我在[〈AI 說「改好了」，你還會再看一眼嗎？〉]({{ '/technical/cognitive-surrender-ai-review/' | relative_url }})談的「認知投降」不是同一件事，但會連在一起。認知債是「我已經不懂這段程式了」；認知投降是「我懶得看，直接放行」。前者累積久了，後者就變成唯一的選項。

## 2026 年春夏，第三站：流程大爆發 {#process}

既然人的判斷力是瓶頸，接下來半年，社群做的事情就是：**把判斷寫下來，讓 AI 照著做。**

**3 月：Skills 大爆發。** Skill 是一份寫給 AI 的作業手冊，教它某件事該怎麼做，可以分享給別人直接用。Matt 特別提到 Jesse Vincent 的 superpowers，[[11]](https://github.com/obra/superpowers) 說它早就跑在前面。Matt 自己也公開了一整套，我在[〈Matt Pocock 光頭哥的 Skills 使用教學〉]({{ '/technical/matt-pocock-skills-ai-coding-workflow/' | relative_url }})拆過。

**5 月：「HTML 出乎意料地好用」。** Thariq Shihipar 在 Anthropic 的 Claude 官方部落格寫了一篇文章，主張讓 AI 交報告時用網頁格式，不要用純文字格式。他的理由很誠實：超過 100 行的純文字文件，他自己其實不會讀。[[12]](https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html) Simon Willison 讀完也說，這讓他重新思考了原本的做法。[[13]](https://simonwillison.net/2026/May/8/unreasonable-effectiveness-of-html/) Matt 把這件事解讀成「大家開始需要更好的審查介面」：AI 交來的東西太多，至少要讓人看得下去。

**6 月：Loop Engineering。** 6 月 7 日 Steinberger 發文說：別再對寫程式的 AI 下指令了，你該設計的是「替你下指令的迴圈」。[[14]](https://x.com/steipete/status/2063697162748260627) 同一天，Addy Osmani 把這個想法寫成文章，叫它 loop engineering：把自己從「下指令的人」換掉，改成設計那個下指令的系統。[[15]](https://addyosmani.com/blog/loop-engineering/) Matt 給它的評語是「年度最佳含糊貼文」，帶點揶揄。

**7 月：每場演講都在講「我的軟體工廠」。** 軟體工廠指的是一整條讓 AI 從需求做到上線的流水線。Uber 在 AI Engineer 大會上講他們怎麼蓋這條線；[[16]](https://ai.engineer/talks/agentic-sdlc-at-uber-building-blocks-for-uber-s-software-factory) Latent Space 的大會整理也說，這是整場反覆出現的詞。[[17]](https://latent.space/p/aiewf26trends)

這四件事看起來各自獨立，其實是同一個動作：**把原本在人腦裡的判斷，搬到寫得下來、可以重複的地方。** 我在[〈「Scaffolding is coping」不是不要規範〉]({{ '/technical/scaffolding-thin-harness-agent-architecture/' | relative_url }})和[〈AI Agent 讓「外科手術團隊」復活了〉]({{ '/technical/ai-agent-surgical-team/' | relative_url }})談的，也都是這一站。

## 2026 年夏末，第四站：怎麼交代、怎麼管 {#handoff}

流程寫好了，新的問題是：人和 AI 之間，話講不清楚。

8 月那行是：「Opus 5 講話讓人看不懂，大家對 ASD-STE100 的興趣衝到最高。」前半句我找不到其他來源佐證，當成 Matt 的體感就好。後半句查得到：ASD-STE100 是歐洲航太業的「簡化技術英文」標準，原本用來寫飛機維修手冊，[[19]](https://www.asd-ste100.org/) 規則是句子要短、一句一件事、一個字只有一個意思。有人把它做成 Skill，讓 AI 照這套規則寫，作者自己量到的錯誤大幅減少，[[20]](https://github.com/aminblg/simpleenglish) 不過這是作者自己報的數字，也不是官方認證的工具。

道理不難懂：AI 交來的東西越多，每一份越要讓人一眼看懂。這跟 5 月的 HTML 是同一條線。

9 月，Matt 說 Grok Bot 紅了，大家開始對「長期的經理型對話」有興趣：一條一直開著的對話，記得前因後果，負責把工作分派出去。xAI 9 月 3 日推出企業版，說它是「一整隊 AI 隊友」，你交辦真實的工作，它們從頭做到尾。[[21]](https://x.ai/news/grok-bot-for-enterprise) 我在[〈Grok Bot 開始替你挑大腦〉]({{ '/technical/grok-bot-model-routing/' | relative_url }})和[〈Bot Mode 不是多開幾個聊天視窗〉]({{ '/technical/hermes-bot-mode-persistent-ai-team/' | relative_url }})寫過這個轉變：人從「跟 AI 聊天」，變成「管一群 AI」。

## 2026 年秋，第五站：說好的速度呢 {#speed}

10 月那行最刺耳：說好的速度提升並沒有出現，「無人工廠」看起來還很遠。

Matt 用的詞是 dark factory，原指燈都不用開、全自動運轉的工廠。最接近的描述，是 Dan Shapiro 1 月寫的 AI 寫程式五個等級：最高一級，他形容成「把規格丟進去、軟體跑出來的黑盒子」。[[18]](https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/)

速度到底有沒有變快？目前最嚴謹的公開數據是 METR 的實驗。他們 2025 年初的研究發現，用 AI 的開發者做任務反而多花 19% 的時間；2025 年底再測，回流的開發者大約快了 18%，新找來的開發者快了 4%，但兩個數字的誤差範圍都跨過零，也就是說統計上不能確定真的有變快。METR 自己也寫，因為很多開發者已經不願意不用 AI 工作，願意參加實驗的人有偏差，這份數據「只是很弱的證據」。[[22]](https://metr.org/blog/2026-02-24-uplift-update/)

所以比較準確的說法是：**沒有證據說變慢，也還沒有可靠的證據說快很多。** 再對照前面那張表，GPT-6.2 綜合分數漲了、寫程式代理分數卻沒漲，模型變強也不會自動變成產出變快。我在[〈AI 寫得出程式，不代表產品上得了線〉]({{ '/technical/ai-code-production-review-bottleneck/' | relative_url }})提過類似的觀察：寫得快，卡在後面的審查和上線。

## 程式碼還要讀嗎 {#reading}

11 月，Matt 的最後一行：No AI Slop 宣言發表，讀程式碼看起來還是必要的。

這份宣言由 AI Engineer CODE 大會的講者與與會者共同寫成，11 月 12 日貼在 GitHub 上公開連署，仿照 2001 年的敏捷宣言。[[23]](https://gist.github.com/dexhorthy/4cc96f01be5b1208519e75dad250a948) 裡面有兩句我覺得是整年的註解：

- 「Slop 是不對稱的。」做出一千行的修改或十頁文件，成本趨近於零，審它的成本卻沒變。
- 「AI 不能取代人的判斷，只能放大它，包括判斷的缺席。」

三天前我寫了[〈AI 交來的程式看不完，那要看什麼？〉]({{ '/technical/all-code-is-slop-verification-evidence/' | relative_url }})，整理 Lauren Tan 的做法：人看不完程式修改，就改看 AI 交出來的操作影片、截圖和驗證結果。Matt 卻說讀程式碼還是必要。這兩個說法打架嗎？

我覺得不打架，宣言第 17、18 條剛好把它們接起來：模型變強以後，我們也許不會再讀大部分的程式碼，但還是要審計畫、設計或結果其中一樣；AI 審查、自動檢查有用但不夠，至少要親自看一部分，看哪一部分，由風險決定。[[23]](https://gist.github.com/dexhorthy/4cc96f01be5b1208519e75dad250a948) Lauren Tan 也在這份宣言的致謝名單裡。

<figure>
  <a href="{{ '/assets/img/technical/ai-coding-13-months-matt-pocock-timeline/review-layers.svg' | relative_url }}" class="portfolio-lightbox" data-gallery="ai-coding-13-months" data-type="image">
    <picture><source media="(max-width: 600px)" srcset="{{ '/assets/img/technical/ai-coding-13-months-matt-pocock-timeline/review-layers-mobile.svg' | relative_url }}"><img src="{{ '/assets/img/technical/ai-coding-13-months-matt-pocock-timeline/review-layers.svg' | relative_url }}" alt="四種審查各回答一個問題：看結果，問有沒有幫到人；看證據，問有沒有照要求做；看計畫與設計，問方向對不對；讀程式碼，問這是不是我願意負責的寫法。風險越高，往下疊越多層。" width="840" height="474"></picture>
  </a>
  <figcaption>自製示意圖。四種審查對象整理自 No AI Slop 宣言第 17、18 條與 Lauren Tan 的演講；「依風險往下疊」是我的歸納。來源：<a href="https://gist.github.com/dexhorthy/4cc96f01be5b1208519e75dad250a948">[23]</a></figcaption>
</figure>

換句話說，**證據回答「它有沒有照我要的做」，讀程式碼回答「這是不是我願意負責的東西」。** 一個小工具壞了隔天修就好，看結果夠了；動到金流、權限、別人資料的地方，四層都要有人看過。

## 我不買單的三個地方 {#limits}

**第一，「沒有人在寫程式了」說得太滿。** Matt 自己在 4 月那行寫的是「多數走在最前面的開發者」。從這群人推到所有人，中間少了一大段。他的時間軸是一個站在最前線的人看到的世界，這很有價值，但不是全行業的平均。

**第二，13 行裡有一半是體感。** 「95% 的工作」「大家都累了」「速度沒有出現」都沒有數字。前兩個我找不到量測；第三個最接近的 METR 數據，研究團隊自己都說證據很弱。讀這類回顧時，我會把「查得到的事件」和「作者的感覺」分開放。

**第三，評測分數不等於你的工作。** Artificial Analysis 的寫程式代理評比，比的是「模型＋代理工具」的組合，前段多半是自家模型配自家工具；考題是開源專案和技術問答，不是你公司那套十年歷史的系統。前段班差 3 分以內的時候，你自己的題目會比排行榜更有參考價值。

## 如果是我，接下來會做的三件事 {#start}

1. **選模型時，先在前段班裡比成本，再挑推理強度。** 頂尖幾家已經擠在一起，差別在每件任務花多少錢、花多少時間。拿自己最常做的三種工作各跑一次，比較兩個推理檔位，比追排行榜第一名實際。
2. **替每一種交出去的東西，先決定「要看到哪一層」。** 小工具看結果；對外的功能加看證據；改到資料和權限的，連計畫和關鍵程式碼一起看。先定好，就不會在趕的時候直接放行。
3. **同一個錯糾正第二次，就把它變成自動檢查。** 這是宣言第 21 條，[[23]](https://gist.github.com/dexhorthy/4cc96f01be5b1208519e75dad250a948) 也是 Lauren Tan 那場演講的重點。人的注意力很貴，留給機器檢查不出來的地方。

Matt 說我們還在想「沒人寫程式」代表什麼。宣言最後一條也承認：「我們都還沒搞懂。」[[23]](https://gist.github.com/dexhorthy/4cc96f01be5b1208519e75dad250a948)

這一年我自己的答案是：寫程式的那雙手可以交出去，**決定什麼值得做、什麼可以放行的那個人，還是得留下來。**

## 參考資料

資料查核日：2026-11-18。Artificial Analysis 的分數會隨新模型與評測改版變動，本文數字以查核日當天官網為準。

- **[1]** [Matt Pocock：A brief history of AI Coding since Nov 2025（X，2026-11-16）](https://x.com/mattpocockuk/status/2122287575557706226)
- **[2]** [Artificial Analysis：GPT-6.2 Astra 與 GPT-6.2 Sol 評測結果（X，2026-11-17）](https://x.com/ArtificialAnlys/status/2122750634210529569)
- **[3]** [Artificial Analysis：LLM Leaderboard（Intelligence Index v5.0.1）](https://artificialanalysis.ai/leaderboards/models)
- **[4]** [Artificial Analysis：Coding Agent Index v2.1](https://artificialanalysis.ai/agents/coding)
- **[5]** [Anthropic：Introducing Claude Opus 4.5（2025-11-24）](https://www.anthropic.com/news/claude-opus-4-5)
- **[6]** [OpenClaw：GitHub 專案頁](https://github.com/openclaw/openclaw)
- **[7]** [Geoffrey Huntley：Ralph Wiggum as a "software engineer"（2025-07-14）](https://ghuntley.com/ralph/)
- **[8]** [Margaret-Anne Storey：Cognitive Debt（2026-02-09）](https://margaretstorey.com/blog/2026/02/09/cognitive-debt/)
- **[9]** [Margaret-Anne Storey 等：From Technical Debt to Cognitive and Intent Debt（arXiv）](https://arxiv.org/abs/2603.22106)
- **[10]** [Anthropic：Introducing Agent Skills（2025-10-16）](https://claude.com/blog/skills)
- **[11]** [Jesse Vincent：obra/superpowers](https://github.com/obra/superpowers)
- **[12]** [Thariq Shihipar：Using Claude Code: The Unreasonable Effectiveness of HTML](https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html)
- **[13]** [Simon Willison：The unreasonable effectiveness of HTML（2026-05-08）](https://simonwillison.net/2026/May/8/unreasonable-effectiveness-of-html/)
- **[14]** [Peter Steinberger：monthly reminder（X，2026-06-07）](https://x.com/steipete/status/2063697162748260627)
- **[15]** [Addy Osmani：Loop engineering（2026-06-07）](https://addyosmani.com/blog/loop-engineering/)
- **[16]** [AI Engineer：Building Uber's Agentic Software Factory](https://ai.engineer/talks/agentic-sdlc-at-uber-building-blocks-for-uber-s-software-factory)
- **[17]** [Latent Space：AI Engineer World's Fair 2026 趨勢整理](https://latent.space/p/aiewf26trends)
- **[18]** [Dan Shapiro：The Five Levels: from Spicy Autocomplete to the Software Factory（2026-01-23）](https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/)
- **[19]** [ASD-STE100 Simplified Technical English 官方網站](https://www.asd-ste100.org/)
- **[20]** [aminblg/simpleenglish：讓 AI 照 ASD-STE100 寫作的 Skill（非官方）](https://github.com/aminblg/simpleenglish)
- **[21]** [xAI：Grok Bot for Enterprise（2026-09-03）](https://x.ai/news/grok-bot-for-enterprise)
- **[22]** [METR：開發者生產力實驗更新（2026-02-24）](https://metr.org/blog/2026-02-24-uplift-update/)
- **[23]** [No AI Slop: A Manifesto（GitHub Gist，2026-11-12）](https://gist.github.com/dexhorthy/4cc96f01be5b1208519e75dad250a948)
- **[24]** [Artificial Analysis：GPT-6 Astra 模型頁](https://artificialanalysis.ai/models/gpt-6-astra)
- **[25]** [Artificial Analysis：Claude Opus 4.5 模型頁](https://artificialanalysis.ai/models/claude-opus-4-5)
