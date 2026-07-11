---
title: "我讓 Hermes Agent 串上 OpenRouter 生影片：從 GPT-5.6 Sol 到 35 秒成片的完整實作"
seo_title: "Hermes Agent 串 OpenRouter 生成影片：Seedance 2.0 Fast、成本閘門與 FFmpeg 工作流實作"
date: 2026-07-11
categories: [technical]
tags: [claude-code, hermes-agent, openrouter, video-generation]
layout: article
cover_image: /assets/img/hermes-openrouter-video/hermes-openrouter-video-banner.jpg
hero_image: true
description: "為了測試 GPT-5.6 Sol，我在 Windows 上替 Hermes Agent 加入本機 openrouter-video plugin，串接 OpenRouter 的非同步影片 API 與 Seedance 2.0 Fast，再用 FFmpeg、Pillow、Edge TTS 完成 35 秒攝影品牌短片。本文記錄設定、成本閘門、manifest、重試、素材解析度與人工驗收的完整過程。"
keywords: Hermes Agent, OpenRouter, Seedance 2.0 Fast, GPT-5.6 Sol, AI 影片生成, image to video, text to video, FFmpeg, Edge TTS, Hermes plugin, agentic workflow, AI Agent, 史旺基, Swanky Studio
---

早上本來只是想測一個新的 GPT 模型。

當時 Hermes Agent 的主模型已經切到 OpenAI Codex provider 的 `gpt-5.6-sol`，透過 ChatGPT Pro OAuth 使用。我想看的不是它會不會回答問題，而是它能不能把一個有成本、有素材、有審核、有失敗可能的工作做完。

不知道為什麼，最後我得到的不是一份 benchmark，而是一支 35 秒的攝影品牌短片，外加一個能讓 Hermes 呼叫 OpenRouter 生成影片的本機 plugin。

這件事有點微妙。因為「叫 AI 生一支影片」聽起來像一句 prompt，實際做下去，真正麻煩的部分幾乎都不在 prompt。

## 先把模型分工拆清楚

這次用了三層不同的工具，但它們不是同一件事。

第一層是 **GPT-5.6 Sol**。它跑在 Hermes Agent 裡，負責理解需求、檢查素材、規劃分鏡、呼叫工具、追蹤狀態與整理結果。它是編排者，不是影片模型。

第二層是 **OpenRouter 與 ByteDance Seedance 2.0 Fast**。真正要花 OpenRouter 額度的，是送進 `/api/v1/videos` 的影片生成工作。

第三層是本機後製：**FFmpeg、Pillow 與 Edge TTS**。字幕、圖片 contain、模糊延伸背景、旁白、音量正規化、串接鏡頭與技術驗證，都在本機完成，不再消耗 OpenRouter 額度。

<figure style="margin:1.8em auto;text-align:center;max-width:1100px;">
  <img src="{{ '/assets/img/hermes-openrouter-video/pipeline.svg' | relative_url }}" alt="Hermes Agent 串接 OpenRouter 影片生成工作流：GPT-5.6 Sol 負責編排，本機 plugin 呼叫 OpenRouter 與 Seedance，完成後由 FFmpeg、Pillow、Edge TTS 後製並驗證" style="width:100%;height:auto;border-radius:10px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.6em;">圖一：模型、付費 API 與本機後製各自坐在不同位置</figcaption>
</figure>

我刻意保留這個分工。讓影片模型同時負責畫面、字幕、旁白、剪輯與成品驗證，看似省事，實際上等於把每一次小修都變成重新抽卡，而且還是付費抽卡。

## 設定到底改了什麼

我先替 Hermes 設定檔建立備份，再比較修改前後的白名單欄位。這一步很重要，因為設定檔旁邊通常就住著 API key 與 OAuth credential；寫技術文章不代表要順便把家門鑰匙貼上網。

當天修改前後，Hermes 的主模型設定都維持：

```yaml
model:
  provider: openai-codex
  default: gpt-5.6-sol
```

真正新增的是本機 plugin：

```yaml
plugins:
  enabled:
    - openrouter-video
  entries:
    openrouter-video:
      enabled: true
```

OpenRouter API key 只放在 Hermes 的 `.env`，不寫進 `config.yaml`、文章、manifest 或專案檔案。這裡只需要知道環境變數名稱是 `OPENROUTER_API_KEY`；實際值當然不會公開。

還有一個容易誤會的細節：Hermes 原本的 `video_gen` 設定仍然指向 xAI 的 `grok-imagine-video`。我沒有硬改核心工具，而是用 `openrouter-video` plugin 註冊另一組本機工具。兩條路可以同時存在，測試失敗時也比較容易拆掉，不會把 Hermes 核心改成只剩我這台電腦看得懂的形狀。

Hermes 官方也建議：個人、專案或本機擴充，優先走 plugin，而不是直接修改 core。這是我最後選擇 plugin 的原因。

## 為什麼要自己做 plugin

OpenRouter 的影片 API 是非同步流程。送出請求後不會立刻拿到 MP4，而是先得到 job id 與 polling URL；接著定期查詢狀態，完成後再下載 content。

最小流程看起來很簡單：

```text
GET  /api/v1/videos/models
POST /api/v1/videos
GET  /api/v1/videos/{job_id}
GET  /api/v1/videos/{job_id}/content?index=0
```

但如果讓一個有工具權限的 Agent 直接呼叫付費 API，我至少需要補上六件事。

### 1. 付費前先估價

這次是由 **Agent 工作流**先查模型資料，根據 token pricing、輸出尺寸、秒數與 24 fps 公式估算成本；顯示預估金額、等我明確核准後，才呼叫 plugin 的 `submit()`。

這裡要說清楚：目前的 `submit()` 本身沒有 approval token 或程式層 hard gate。它的 tool description 會要求 Agent 先取得核准，但如果有人繞過工作流直接呼叫，plugin 仍會送出 POST。這次安全是靠「只讀估價 → 人工核准 → 付費提交」的流程紀律，不是 API 強制保證。若要把它做成多人共用或 unattended service，我會再補一次性 approval token。

我不接受「先跑再說」。可愛歸可愛，帳單不會因為 Agent 語氣很好就自己消失。

### 2. 用 fingerprint 避免重複扣款

`project_id`、`shot_id`、`prompt_hash`，再加上 model、duration、resolution、aspect ratio、audio 與參考圖 hash，會共同形成 fingerprint。

如果相同工作已經提交，plugin 會回傳既有 job，而不是再送一次。這是為了處理最危險的情況：網路斷線、工具 timeout，但 OpenRouter 其實已經收到了工作。沒有冪等保護，Agent 一重試，就可能幫我買兩支一樣的影片。

### 3. 只重試該重試的錯誤

`429` 與部分 `5xx` 可以用 exponential backoff 重試；`400`、`401`、`403` 這類輸入或權限錯誤則直接停。

認證錯誤重跑十次不會突然變有權限，只會讓 log 看起來很努力。

### 4. 輪詢不要太勤

OpenRouter 官方建議影片工作使用合理的輪詢間隔，例如 30 秒。Plugin 因此不會每秒追問一次。影片通常要等幾十秒到數分鐘，急著敲門不會讓 Seedance 畫快一點。

### 5. Data URL 不落地

Image-to-video 需要把首格圖片轉成 Data URL 傳送。但 manifest 不保存整串 base64，只留下：

```text
data-image-sha256:<digest>
```

這樣仍能追蹤輸入是否相同，又不會讓一張參考圖在 log、JSON 與備份裡複製好幾份。

### 6. 每一步都留下可驗證證據

每個工作都會保存 sanitized manifest，包括 job id、status、模型、參數、usage 與輸出路徑。下載後再跑 `ffprobe` 與 SHA-256，確認檔案真的是可讀影片，不是某個副檔名叫 MP4 的錯誤頁面。

這部分不浪漫，但它決定了 Agent 說「完成」時，我到底該不該相信。

## 我怎麼規劃這支影片

影片目標是介紹我的人像攝影與出版經歷，同時保留開放合作的 CTA。最初規劃是 42 秒、10 個鏡頭。

我沒有把 10 鏡全部丟給影片模型。真正需要生成動態的只有三種：

1. 奶油白窗簾上的自然光影。
2. 相機與底片元素的器材氛圍。
3. 短袖水手服風角色的克制動態。

其他內容——形象照、攝影作品、書封、PX3 證書與片尾——都用既有素材做確定性剪輯。這些照片本來就是作品，不需要模型替裡面的人眨眼、轉頭或多長一根手指。

第一輪三支 Seedance 預覽的**請求規格**都是 4 秒、480p、9:16、關閉模型原生音訊；實際下載檔為 496×864、約 4.04 秒。費用各為 US$0.215208，合計 US$0.645624。

其中窗影與水手服角色可用，相機鏡頭不行。

第一版器材畫面長成兩台復古相機加一疊拍立得卡片。但我主要使用的是 Canon EOS 5D Mark IV，底片機偶爾用，拍立得反而很少。畫面不能只做到「像攝影」，還要像我。

所以我只重做器材鏡頭。第二版改成單一 5D Mark IV 類型 DSLR 為主體，50mm 定焦鏡頭，底片捲只留在後方當配角。第二次生成再花 US$0.215208。

整個 OpenRouter 影片生成支出是 **US$0.860832**。後面的剪輯、字幕、旁白、音量與輸出全部在本機完成，沒有再燒影片生成額度。

## 從 42 秒修到 35 秒

第一個完整版本是 42 秒，台灣男聲旁白，畫面用了較多網站舊素材。技術上沒有壞，但看完就是覺得長。

後來我做了三個調整。

第一，旁白改成 `zh-TW-HsiaoYuNeural` 女聲，語速 `+8%`、音高 `+4Hz`。我想要的是甜美青春，不是幼兒化，也不是購物台趕拍。

第二，把主招募文案從醒目的年齡限制改成「人像創作・歡迎洽詢」。未滿 18 歲合作的保障仍保留在片尾小字：須由法定代理人一同聯繫並確認合作內容。開放不等於沒有邊界，邊界也不需要搶走整支影片的主標題。

第三，重新選圖。最後保留形象照、制服女孩、比特幣女孩、五本出版作品、PX3 證書、兩張補充攝影作品，以及核准過的三支生成鏡頭；資訊量太高的月曆與拼貼先拿掉。

<figure style="margin:1.8em auto;text-align:center;max-width:760px;">
  <img src="{{ '/assets/img/hermes-openrouter-video/asset-selection-contact.jpg' | relative_url }}" alt="短影片候選素材 contact sheet：史旺基形象照、制服女孩、比特幣女孩、PX3 證書、出版書封與攝影作品" style="width:100%;height:auto;border-radius:10px;">
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.6em;">圖二：候選素材先做 contact sheet，才決定哪些值得佔用 35 秒</figcaption>
</figure>

單張作品不硬裁成滿版，而是用 contain 卡片保留原比例，背景再用同張照片模糊延伸。這至少不會為了填滿手機螢幕，把書名切掉，或只剩人物身體的一小塊。

最後成品是 35 秒、1080×1920、H.264、30 fps，音訊為 AAC 48 kHz 雙聲道。FFmpeg 檢查不到 0.2 秒以上黑畫面，最終檔案也留下 SHA-256。

<figure style="margin:1.8em auto;text-align:center;max-width:430px;">
  <video controls playsinline preload="metadata" poster="{{ '/assets/img/hermes-openrouter-video/final-video-contact.jpg' | relative_url }}" style="display:block;width:100%;height:auto;border-radius:12px;background:#111;">
    <source src="{{ '/assets/video/hermes-openrouter-video/swanky-portrait-collab-v4.mp4' | relative_url }}" type="video/mp4">
    你的瀏覽器不支援 HTML5 影片播放。
  </video>
  <figcaption style="font-size:0.85rem;color:#6b7280;margin-top:0.6em;">最後成品：35 秒攝影品牌短片（含甜美青春台灣女聲）</figcaption>
</figure>

[下載最終 MP4]({{ '/assets/video/hermes-openrouter-video/swanky-portrait-collab-v4.mp4' | relative_url }})

## 最後踩到的坑：低解析度不是小事

這次有幾本舊出版品封面只有約 300 多像素寬。Contain 可以避免亂裁，卻不能憑空補回細節。放在 1080×1920 的影片裡，書封當然會顯得比較小。

這件事最後變成一條明確規則：**以後圖片解析度偏低，開工前先回報尺寸、放大風險與預期效果，等我確認後才能剪；不擅自放大。**

AI 很容易把「做得到」誤認成「適合做」。但品質問題通常不是最後才發生，而是素材進場的那一刻就決定了一半。

## 這次真正測到的是什麼

表面上，我是在測 GPT-5.6 Sol，也是在研究 Hermes Agent 能不能串 OpenRouter 生影片。

但最後驗證的其實是另一件事：一個模型能不能在碰到付費 API、視覺品味、舊素材、人物安全與本機檔案時，知道哪些事情該自己做，哪些事情一定要停下來問。

Seedance 負責生成四秒鐘的光影與動作。Hermes 負責把工作拆開。OpenRouter 負責提交與計費。FFmpeg 負責把結果變成可重現的成品。最後的「這個相機不像我會用的相機」「影片太長」「這張圖解析度不夠」，仍然只能由人來判斷。

對我來說，這才是 Agent 工作流真正有意思的地方。

不是讓 AI 一口氣做完所有事，而是讓每一種工具只做它擅長的部分，並且在該停的地方停下來。

## 文章素材

- [下載文章 Banner JPG]({{ '/assets/img/hermes-openrouter-video/hermes-openrouter-video-banner.jpg' | relative_url }})
- [開啟影片生成架構圖 SVG]({{ '/assets/img/hermes-openrouter-video/pipeline.svg' | relative_url }})
- [開啟素材篩選 Contact Sheet]({{ '/assets/img/hermes-openrouter-video/asset-selection-contact.jpg' | relative_url }})
- [開啟最終影片 Contact Sheet]({{ '/assets/img/hermes-openrouter-video/final-video-contact.jpg' | relative_url }})
- [下載最終成品 MP4]({{ '/assets/video/hermes-openrouter-video/swanky-portrait-collab-v4.mp4' | relative_url }})

---

## 參考資料

- [Hermes Agent 官方文件](https://hermes-agent.nousresearch.com/docs/)
- [Hermes Agent：Plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins)
- [Hermes Agent：Build a Hermes Plugin](https://hermes-agent.nousresearch.com/docs/guides/build-a-hermes-plugin)
- [OpenRouter：Video Generation](https://openrouter.ai/docs/guides/overview/multimodal/video-generation)
- [OpenRouter Cookbook：Generate and Download a Video from Text](https://openrouter.ai/docs/cookbook/video-generation/text-to-video)
- [OpenRouter：Seedance 2.0 Fast](https://openrouter.ai/bytedance/seedance-2.0-fast)
