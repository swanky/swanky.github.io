---
title: "Claude Code 時代，Kent Beck 為什麼提醒我們不要只看「80% 完成」"
date: 2026-03-19
categories: [technical]
layout: article
cover_image: /assets/img/linkedin/claude-code-kent-beck.jpg
source_url: "https://www.linkedin.com/pulse/claude-code-%E6%99%82%E4%BB%A3kent-beck-%E7%82%BA%E4%BB%80%E9%BA%BC%E6%8F%90%E9%86%92%E6%88%91%E5%80%91%E4%B8%8D%E8%A6%81%E5%8F%AA%E7%9C%8B80-%E5%AE%8C%E6%88%90-swanky-hsiao-wuf3c"
description: "從 Kent Beck 對 TDD 的觀點出發，探討在 Claude Code 與 AI coding 工具時代，為何測試與規格比以往更加重要，80% 完成的系統不等於可交付的系統。"
---

最近看到 Kent Beck 一段話，我覺得非常值得在今天這個 Claude Code 與 AI coding 工具快速普及的時代，再重新讀一次。

他提到：

> "One of my frustrations with 'scientific' studies of TDD is that they concluded that TDD created more reliable software but took longer."

以及他認為真正關鍵的問題其實是：

> "The important question is how long other workflows would take to get to the same level of reliability."

這兩句話，點出了一個很多工程團隊很容易忽略的盲點。

很多人看到「TDD 讓軟體更可靠，但花比較久」這種結論時，直覺會覺得，既然比較慢，那是不是代表效率比較差？

但 Kent Beck 真正想表達的意思不是這樣。他在問的是：如果不用 TDD，而是用其他 workflow，最後也要把系統做到同樣可靠、同樣穩定、同樣可承擔真實風險，那總共要花多久？

這裡的關鍵，不是「誰比較快做出第一版」，而是「誰比較快到達同一個品質終點」。

因為很多方法看起來比較快，往往只是比較快做出一個「能跑的版本」。但從能跑，到真正可靠、可驗證、可交付、可上線，中間通常還有很長一段路，包括：

- 補測試
- 修 bug
- 補邊界條件
- 處理例外流程
- 修正需求理解偏差
- 補齊整合驗證
- 確保上線後不會出大事

所以，如果一種方法只是前面衝得快，後面卻要花更多時間補洞，那它不一定真的比較快。它只是比較早看起來像完成而已。

Kent Beck 後面又講了一句非常重，但也非常精準的話：

> "Nobody cares! 80% of a payroll system is the same as 0% of a payroll system."

這句話如果只看表面，可能會覺得很激烈。但他真正想說的是：

對於薪資系統、金流系統、交易系統、報稅系統、醫療系統這類高正確性場景來說，80% 完成，往往不具備真正的可交付價值。

因為剩下的 20%，常常才是最困難、最關鍵、最不能出錯的部分，例如：

- 各種稅務與法規例外處理
- 邊界條件下的計算正確性
- 外部系統失敗時的補償機制
- 例外付款與特殊案件處理
- 審計、追蹤、覆核與合規要求

也就是說，真正決定一個系統能不能上線的，不是你把主流程做出了多少，而是你有沒有把那些不能錯的地方也做對。

Kent 最後這句，我認為幾乎可以當成今天 AI 開發時代的提醒：

> "Don't tell me it doesn't take as long to not travel as far. Tell me how long it takes to get to the same destination."

我對這句話的理解是：不要只比較前期速度，請說明達到同等品質終點的總時間。

這也是為什麼我認為，在 Claude Code 時代，測試與規格不是變得比較不重要，而是變得更重要。

因為當 AI 可以快速幫我們：

- 生成程式碼
- 重構模組
- 補測試樣板
- 寫 migration script
- 整理文件與技術方案

真正的瓶頸就不再只是「寫不寫得出來」，而是：

- 需求有沒有講清楚
- 商業規則有沒有定義完整
- 邊界條件有沒有先想過
- 驗收標準是否明確
- 改完之後是否真的沒破壞既有功能
- 產出的內容到底是不是做對，而不只是做出來

換句話說，AI 加速的是程式生成，測試保障的是正確性，規格決定的是方向。

如果沒有測試，AI 幫你加速的，不一定只是交付，也可能是錯誤擴散的速度。如果沒有規格，AI 幫你提升的，不一定只是效率，也可能是高效率地做錯事。

所以我越來越認為，Claude Code 時代真正要升級的，不只是 prompt 技巧，而是整個工程方法。

我的理解很簡單：規格，決定 AI 往哪裡走。測試，決定我們能不能相信它走對了。

有規格、有測試、有明確驗收標準的團隊，Claude Code 會像渦輪增壓器。沒有這些基礎的團隊，Claude Code 也可能只是把原本的返工、誤解與技術債放大而已。

所以如果要用一句話總結 Kent Beck 這段話，以及它對今天 AI coding 時代的意義，我會這樣說：

不要只比較誰比較快寫出程式，要比較誰比較快交付一個真正可靠、可驗證、可上線的系統。寫得快，從來不是終點。更快走到正確、可靠、可被信任的終點，才是。
