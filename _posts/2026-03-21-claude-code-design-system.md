---
title: "從工程師到設計通才：利用 Claude Code 與三層架構打造 AI 設計系統全攻略"
date: 2026-03-21 12:00:00 +0800
categories: [claude-code]
layout: article
nav_active: education
cover_image: /assets/img/linkedin/claude-code-design-system.svg
description: "透過三層設計裝備系統（Skills、Canvas、Inspiration）與 Claude Code，任何工程師都能穩定交付高品質、具備專業感的產品介面。"
keywords: Claude Code,設計系統,AI coding,前端設計,AI學習,史旺基,Swanky Studio
---

## 1. 數位產品開發的新範式：AI 賦能的設計無感轉型

在傳統研發體系中，「工程邏輯」與「視覺審美」常被視為天平的兩端。工程師精於系統架構，卻往往在像素間距、排版節奏與色彩對比前駐足。然而，生成式 AI 正在重塑這一格局，將設計門檻降至前所未有的高度。現在，具備設計能力的「設計工程師（Design Engineer）」已不再是少數天才的專利，而是任何能熟練駕馭 AI 指令集的專業人士都能觸及的邊界。

以前 TikTok 與 Amazon 工程師 Neethan Wu 的轉型為例，他在短短三個月內從零設計經驗，進化到能每週穩定交付高品質、具備專業感的產品介面。這並非依賴 AI 的隨機產出，而是透過一套結構化的「設計裝備系統（Harness）」將專家的隱性知識（Tacit Knowledge）內化為工程能力。

| 時間點 | 設計能力狀態 | 核心痛點 | 最終產出與價值 |
|--------|------------|---------|--------------|
| 三個月前 | 完全空白（零 UI/UX 經驗） | 產出帶有廉價「AI 泡麵味」的粗糙介面 | 僅能負責純工程邏輯，設計需等待排程 |
| 轉型期間 | 建立 AI Design Harness | AI 決策碎片化，對話結束即遺忘規範 | 導入系統化 Skills，開始理解「視覺 DNA」 |
| 現在 | 端到端設計與交付通才 | 如何在維持設計感時兼顧程式碼可維護性 | 每週穩定產出高品質、可上線的專業設計 |

這種「Design Without Designing」的核心競爭力，在於工程師能以「審美」為導向引導「邏輯」，實現能力的指數級擴張。要達成此目標，我們需要一套結構化的「Harness（裝備系統）」來武裝 AI Agent。

---

## 2. 三層設計裝備系統（The Harness Framework）深度解析

要讓 AI Agent 真正像一名資深設計師般思考，必須構建一套三層架構，將專業判斷標準、協作介面與審美訓練整合進工作流中。

| 架構層級 | 核心功能 | 代表工具 | 對工程師的價值 |
|---------|---------|---------|--------------|
| Layer 1: Skills（專業知識） | 將大師級判斷標準編碼進 Agent | Impeccable, Design Engineer Skill | 借用專家品味，解決「AI 忘記設計決策」問題 |
| Layer 2: Canvas（協作介面） | 提供 Agent 可直讀直寫的運作沙盒 | Paper, Pencil | 「殼（Shell）與核（Kernel）」架構，支援 Git 版控 |
| Layer 3: Inspiration（審美訓練） | 縮短從靈感到產出的實作距離 | Variant, Mobbin, Awwwards | 萃取「視覺 DNA」，訓練工程師的審美眼光 |

**關鍵組件深度分析：**

- **Layer 1: Skills（專業知識內化）：** 這是將隱性知識顯性化的過程。除了 Paul Bakaus 針對 Web UI 優化的 Impeccable，還包括 Emil Kowalski 的 Design Engineer Skill（專精於動畫節奏與微互動細節），以及 Dammyjay 的 Interface Design。後者透過持久化的 system.md 解決了 Agent 在不同對話中遺忘設計規範的問題，確保設計決策具備持續性。

- **Layer 2: Agent Canvas（協作介面）：** 畫布是 AI 的「殼」，Agent 是「核」。Paper 以 HTML/CSS 為基礎，讓設計即程式碼。而 Pencil 則採用 JSON 格式的 .pen 檔案，具備良好的 Git-diffable 特性。Pencil 的 Swarm Mode 更是殺手鐧，支援多達六個 Agent 同時協作，分別處理字型、佈局、排版與設計規範的同步更新。

- **Layer 3: Inspiration（審美訓練）：** 透過 Variant 的 Style Dropper 功能，工程師能直接從頂級作品中吸取配色與空間密度等視覺 DNA，並將其轉化為程式碼參數，從根本上訓練工程師的「判斷力」。

在所有工具中，Claude Code 內的 Skills 是改變產出品質最直接的槓桿，特別是透過 Impeccable 注入的專業標準。

---

## 3. Claude Code 實戰：Impeccable 技能的深度應用

Claude Code 的 Skills 機制允許我們將複雜的設計邏輯注入開發環境。Impeccable 作為 Anthropic frontend-design 的強化版，提供了超過 20 個專業指令，是目前優化 Web UI 的權威方案。

**安裝與配置路徑**

- **路徑 A（npx）：** 執行 `npx skills add pbakaus/impeccable` 自動部署。
- **路徑 B（Marketplace）：** 在 Claude Code 內使用 `/plugin marketplace add pbakaus/impeccable`。

**核心指令集：診斷與精修的標準化路徑**

- **Diagnostic（診斷類）：**
  - `/audit`：全面診斷 UI 結構問題，並提供優化方向。
  - `/critique`：進行主觀審美評估，導向更深層的修飾建議。
- **Refinement（修飾類）：**
  - `/typeset`：建立固定的字級尺度（Fixed Scale），而非無序的流體排版。
  - `/arrange`：精準校正 Layout 與 Spacing，消除佈局紊亂。
  - `/polish`：整體細節精修，消除毛邊。
  - `/delight`：Neethan Wu 最推薦的指令，能針對細節注入驚喜感，使產品質感在一夜之間完成跨越式升級。

**自動修正「AI 泡麵味」（反模式糾正）**

Impeccable 能自動識別並消除以下常見的 AI 設計失誤：

- 過度飽和的紫色與彩色漸層
- 低對比度導致的可讀性災難（如灰字壓彩色背景）
- 無意義的巢狀卡片（Nested Cards）堆疊
- 缺乏光影層次的純黑（Pure Black）背景

---

## 4. 高效能設計工作流：從診斷到規範的標準路徑

在 AI 協作中，建立正確的「節奏感」能防止 AI 陷入無效的隨機修改。我們必須依循一個結構化的 SOP。

1. **注入設計上下文（`/teach-impeccable`）**
   2026/03 的重大更新引入了 `.impeccable.md` 機制。工程師應先跑一次此指令，定義品牌語氣、產品定位與使用者輪廓。這份上下文會跨 Skills 共用，確保 AI 的「設計人格」一致且不被覆蓋。

2. **啟動初步診斷（`/audit`）**
   優先處理結構性問題（視覺層級、規格化），而非急於美化。

3. **分層專項修復（`/typeset` & `/arrange`）**
   優先處理排版與間距。記住：App UI 應追求秩序感的固定尺度，而非盲目追求 fluid typography。

4. **細節打磨與精修（`/polish` & `/delight`）**
   在結構穩固的基礎上，進行最後的精緻度升級。

5. **萃取設計規範與 Token**
   要求 AI 將視覺修正收斂成可重用的 Design Tokens 或 Component Props，防止硬編碼（Hardcoding）導致的技術債。

**團隊協作策略：** 務必將 Skill 安裝在專案層級（`.claude/skills/`）並提交至 Git。這能確保團隊中每位工程師叫喚 Claude 修復頁面時，審美標準與限制條件保持絕對一致。

---

## 5. 實戰防禦機制：約束條件與常見失誤規避

「保留約束」是工程師管理 AI 設計時最重要的手段。必須將 AI 關在正確的跑道內，避免其像「看到草地的羊」一樣隨意重構。

**核心防禦：State Management & API Integrity Preservation**

在 Prompt 中必須明確劃定邊界：

- **邏輯鎖定：** 嚴禁修改 API 調用邏輯、Router 配置與狀態管理系統。
- **資產優先：** 強制 AI 優先復用現有元件庫（Existing Components），而非自行創造新組件。
- **範疇限定：** 明確指令僅針對 UI 結構、間距、排版與色彩進行修正。

| 錯誤行為 | 潛在影響 | 正確做法 |
|---------|---------|---------|
| 使用空洞指令（如「變高級」） | 產出缺乏品牌特性的萬用模板 | 提供具體的 `.impeccable.md` 設計上下文 |
| 一次性要求修改全站 | 修改過於碎片化，難以驗證且易出錯 | 建立一頁「樣板頁面」（如 Dashboard），驗證後再擴散 |
| 缺乏約束條件 | AI 順手重構整個設計系統，導致邏輯崩潰 | 使用「保留約束」，限制 AI 僅更動視覺表現層 |
| 忽視可維護性 | 產生大量單頁 Inline Styles，難以維護 | 要求 AI 將修正收斂為 CSS Tokens 或 Props |

---

## 6. 結語：當 Google Stitch 遇上 Figma，設計的未來是什麼？

設計工具的邊界正在以前所未有的速度瓦解。Google Stitch 的更新引發 Figma 股價大幅波動，這不僅僅是市場競爭，更預示著 Design.md 概念的崛起——設計不再是封閉的繪圖格式，而是與程式碼、版本控制深度耦合的動態文件。

在未來，設計的「殼（Canvas）」會越來越輕量化，而「核（AI Agent）」的判斷力將決定產品的生死。透過建立自己的「設計裝備系統」，工程師能以邏輯為骨架，將資深設計師的隱性知識轉化為執行力。當 Google Stitch 讓設計自動化成為主流，工程師的優勢在於能將審美感直接注入開發流程。

現在，就從建立你的第一份 `.impeccable.md` 開始，利用 Claude Code 擴展你的能力邊界。在這個 AI 原生的開發時代，你不需要成為設計師，你只需要擁有最強大的裝備系統。
