---
title: "合規型代幣標準：ERC-3643 與 ERC-1404 的設計哲學"
date: 2026-05-31 00:01:00 +0800
categories: [technical]
layout: article
cover_image: /assets/img/rwa/rwa-compliant-token-standards.svg
seo_title: ERC-3643 vs ERC-1404 設計哲學｜合規型代幣標準與 CMTAT 解析
description: "ERC-3643 與 ERC-1404 代表 RWA 合規型代幣的兩種哲學：整合派框架 vs 簡化派介面。一文看懂兩者的取捨、gas 與授權差異，以及 CMTAT 為何選擇同時支援兩者。"
keywords: ERC-3643,ERC-1404,CMTAT,合規型代幣,證券代幣標準,RWA,T-REX,RuleEngine,ONCHAINID,智能合約,區塊鏈,史旺基
---

這是我 RWA 系列裡技術含量最高的一篇，寫給正在評估證券代幣架構的工程師與技術主管。如果你還不熟悉 RWA 標準的整體脈絡，建議先讀 [〈RWA 代幣化標準演進史〉]({{ '/technical/rwa-standards-evolution/' | relative_url }})，再回來看這篇的設計細節。

受監管的金融資產代幣化，核心只有一個技術問題：**transfer 不能總是放行。** KYC 沒過的人不能持有、凍結帳戶不能轉出、鎖定期內不能提早轉、黑名單地址要擋下來。問題是——**這個「准不准」的判斷邏輯，該放在哪裡？** 圍繞這個問題，業界演化出兩種截然不同的哲學。

### 一、簡化派：ERC-1404 的極簡主義

ERC-1404（2018 年起草，至今仍是 draft EIP）給出的答案極簡。它的**全部介面只有兩個函數**：

```solidity
interface IERC1404 {
    function detectTransferRestriction(address from, address to, uint256 value)
        external view returns (uint8);          // 0 = 放行，非 0 = 拒絕碼

    function messageForTransferRestriction(uint8 restrictionCode)
        external view returns (string memory);  // 把拒絕碼轉成人類可讀訊息
}
```

它的主張是：**標準只規範「怎麼問」，不規範「怎麼判斷」。** 至於規則邏輯是白名單、Merkle proof、ZK proof 還是外部 oracle，全由實作者自己決定。

這種設計的優點是彈性極大、相容性負擔極小——任何 ERC-20 加上這兩個函數就能接上 ERC-1404 工具鏈，連 Etherscan、MetaMask 都能自動顯示「為什麼這筆轉帳被擋」。缺點則是它**幾乎什麼都沒幫你做**：沒有身分概念、沒有 claim 撤銷、沒有跨代幣互通，甚至連「transfer 前一定要呼叫這個函數」都不強制——標準只說「這個函數存在可被呼叫」，實際的攔截要實作者自己 wire 進 `_update` 或 `_beforeTokenTransfer`。

### 二、整合派：ERC-3643 的完整框架

ERC-3643（前身是 Tokeny 的 T-REX，2024 年成為唯一 Final 的證券代幣標準）走的是完全相反的路。它不只規範一個介面，而是規範**身分、合規、代幣三層的完整框架**，由六個合約組成：

| 合約 | 角色 |
|---|---|
| Token | ERC-20 相容代幣，每筆轉帳前強制檢查合規 |
| Identity Registry (IR) | 合格投資人的鏈上身分入口 |
| IR Storage | 身分資料儲存（可跨代幣共用） |
| Claim Topics Registry | 定義此代幣需要哪些聲明（KYC、合格投資人…） |
| Trusted Issuers Registry | 定義哪些聲明發行者可信 |
| Modular Compliance | 可插拔的合規模組（國別、持倉上限…） |

關鍵差異在「強制程度」。ERC-3643 規範白紙黑字寫著：代幣在任何 transfer 或 mint 之前，**必須（MUST）**透過 Identity Registry 驗證接收方身分。實作者沒有選擇權。每個投資人在鏈上有一個身分合約（ONCHAINID），上面掛著由受信任第三方**簽章**的聲明，可驗真偽、可撤銷、可過期。

這套框架的好處是「opinionated」——開發者不必再煩惱身分系統怎麼設計、合規模組怎麼接，而且不同代幣可以共用同一套身分基礎設施。代價則是「重」：哪怕你只想發一個沒有 KYC 要求的穩定幣，也得部署五個（大多是空的）合規合約；每筆轉帳要跨多個合約做五次以上的函數呼叫，gas 成本明顯較高；加上 T-REX 實作採 GPL-3.0、合規模組採 CC-BY-NC（禁商用），對商用平台並不友善。

### 三、一張表看懂兩派取捨

| 維度 | ERC-1404（簡化派） | ERC-3643（整合派） |
|---|---|---|
| 介面規模 | 2 個函數 | 6 個合約、數十個函數 |
| 強制程度 | 弱（只規範介面） | 強（規範整合方式） |
| 身分概念 | 無，自理 | IR + ONCHAINID 完整框架 |
| Claim 簽章 | 無 | ✅ 內建可撤銷／過期 |
| 跨代幣共用 | ❌ | ✅ 共用身分儲存 |
| 每筆轉帳 gas | 1 次呼叫 | 5+ 次呼叫 |
| 學習曲線 | 數小時 | 數天 |
| 適用場景 | 輕量受限代幣、特殊規則 | 機構級 RWA、跨機構 KYC |

本質上，這就是軟體工程裡老掉牙的辯論——**「unopinionated library」對上「opinionated framework」**——在 RWA 領域的具體呈現。Library 給你自由與責任，framework 給你規範與約束。沒有絕對的對錯，只有適不適合。

### 四、CMTAT 的解法：不選邊站

最有意思的，是瑞士 CMTA 推出的 **CMTAT** 給出的第三條路。它的策略是：**所有介面我都實作，讓外部生態自己選用哪個。**

CMTAT v3.0.0 同時實作了 ERC-1404、ERC-3643（部分介面）、以及最新的 ERC-7943（uRWA）。所以對外部觀察者，同一個 CMTAT 代幣會同時暴露：

- `detectTransferRestriction(from, to, value) → uint8`（ERC-1404 介面）
- `canTransfer(from, to, value) → bool`（ERC-3643 介面）

這兩個函數內部其實呼叫**同一條檢查鏈**（部分凍結餘額 → 暫停／凍結狀態 → RuleEngine 自訂規則），只是回傳格式不同。也就是說，不論對接方支援哪個介面，CMTAT 都能溝通。

但 CMTAT 有一個刻意的留白：它實作 ERC-3643 的合規介面，卻**不實作 ERC-3643 的鏈上身分部分**（IdentityRegistry、ONCHAINID 那一套）。官方文件明寫「without on-chain identity」。這個取捨很關鍵：

- **不綁定特定身分系統**——你可以接 ERC-3643 的 IR、自寫一套、或完全不用，透過 RuleEngine 外掛規則即可；
- **授權乾淨**——CMTAT 採 MPL-2.0（弱 copyleft、允許商用），不必 fork T-REX 的 GPL-3.0 程式碼；
- **解耦**——代幣核心與合規規則分離，規則可插拔升級，不必動到代幣本身。

這正是為什麼 UBS、Taurus、21Shares 等機構在生產環境裡選擇 CMTAT 當代幣核心、再視需求外接 ERC-3643 風格的身分層。它取了整合派的架構優勢，又保留了簡化派的彈性與乾淨授權。

### 五、所以該怎麼選？

如果要我給一個務實的建議，會是這樣：

- **發輕量、規則單純的代幣**（例如內部積分、簡單受限代幣）：ERC-1404 足矣，別過度工程。
- **發機構級、需要跨機構 KYC 互認的證券代幣**：直接採用 ERC-3643 框架，享受它成熟的生態與工具。
- **想要長期彈性、又在意授權與 gas**：CMTAT 作為代幣核心 + RuleEngine 外接規則，是目前國際機構最常見、也最平衡的組合。

值得一提的是，標準還在演進。ERC-7943（uRWA）試圖統一所有 RWA 代幣的最小介面（涵蓋 ERC-20／721／1155），CMTAT 已率先實作。整合派的下一代，可能會比 ERC-3643 更輕、更通用。

### 結語

合規型代幣標準的演進，其實是一部「如何讓區塊鏈聽法律的話」的工程史。ERC-1404 與 ERC-3643 不是對立，而是光譜的兩端；CMTAT 則證明了——**好的架構不必選邊站，而是把選擇權留給使用者。** 這對任何在設計受監管系統的工程師，都是一個值得記住的設計哲學。

延伸閱讀本系列：[〈RWA 是什麼〉]({{ '/technical/rwa-tokenization-overview/' | relative_url }})、[〈標準演進史〉]({{ '/technical/rwa-standards-evolution/' | relative_url }})、[〈債券代幣化〉]({{ '/technical/rwa-bond-tokenization/' | relative_url }})。

> 需要為團隊深入解析 RWA 技術架構或 Web3 標準？歡迎了解我的 [技術顧問服務]({{ '/technical/' | relative_url }}) 與 [Web3 企業內訓]({{ '/education/crypto/' | relative_url }})。
