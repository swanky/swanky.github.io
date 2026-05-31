---
title: "一鍵把簡報變文件：我寫了一個 Claude Code Skill 自動解讀 PPTX / PDF 每一頁"
seo_title: "Claude Code Skill 教學：自動把 PPTX／PDF 簡報轉文件"
date: 2026-03-29
categories: [claude-code]
tags: [claude-code]
layout: article
nav_active: education
cover_image: /assets/img/linkedin/claude-code-s2m-skill.svg
description: "自製 Claude Code Skill：s2m（slides-to-markdown），一句指令將 PPTX 或 PDF 簡報逐頁截圖、AI 解讀、Mermaid 圖表還原，產出完整 Markdown 文件。含安裝教學與技術解析。"
keywords: Claude Code,Skill,簡報轉Markdown,PPTX,PDF,Mermaid,slides-to-markdown,AI工具,史旺基
---

每次開完會、上完課，你手上多了一份 30 頁的簡報 PDF。

然後呢？

要整理成會議記錄、寫進技術文件、做成學習筆記——你得一頁一頁截圖，一段一段抄文字，碰到流程圖還得手動畫。光是「把簡報內容搬到文件裡」這件事，就可以花掉半小時到一小時。

我受夠了。所以我寫了一個 Claude Code Skill，叫 **s2m**（slides-to-markdown）。

一句指令：

```bash
/s2m path/to/presentation.pptx
```

它會自動把整份簡報逐頁截圖、用 AI 解讀每一頁的內容、把流程圖轉成 Mermaid 語法，最後產出一份完整的 Markdown 文件。

這篇文章會完整介紹這個 Skill 的功能、安裝方式、技術設計，以及我在設計過程中做的取捨。

---

## 一、什麼是 Claude Code Skill？

在講 s2m 之前，先快速說明 Skill 是什麼。

Claude Code 有三層擴充機制：

| 機制 | 用途 | 觸發方式 |
|------|------|---------|
| **CLAUDE.md** | 專案層級的指令與規範 | 每次對話自動載入 |
| **Hooks** | 事件驅動的自動化腳本 | 工具呼叫前/後自動執行 |
| **Skills** | 可重複使用的任務模板 | `/skill-name` 或自然語言觸發 |

Skill 本質上是一份放在 `.claude/skills/<name>/SKILL.md` 的 Markdown 檔案，裡面定義了：

- **觸發條件**：什麼情境下啟用這個 Skill
- **可用工具**：這個 Skill 被允許使用哪些工具
- **執行流程**：一步步的任務指引，Claude 會照著做
- **錯誤處理**：遇到例外狀況怎麼辦

你可以把 Skill 想像成「寫給 Claude 的 SOP」。它不是一次性的 prompt，而是可以反覆使用、可以分享給團隊的標準化工作流。

---

## 二、s2m 功能總覽

s2m 做的事情很直觀：**把一份簡報變成一份 Markdown 文件**。

但它不是只抓文字。完整的處理流程是：

```
PPTX / PDF
    ↓
逐頁轉為高解析度 PNG 截圖
    ↓
AI 視覺讀取每一頁圖片
    ↓
解讀內容 → 標題、清單、表格、程式碼
    ↓
圖形/流程圖 → Mermaid 語法
    ↓
組合成單一 Markdown 文件 + 圖片目錄
```

### 支援的輸入格式

- `.pptx`（Microsoft PowerPoint）
- `.ppt`（舊版 PowerPoint）
- `.pdf`（任何 PDF 簡報）

### 輸出結構

假設你的簡報叫 `技術架構說明.pptx`，執行後會產生：

```
技術架構說明_slides/        ← 圖片目錄
  ├── page_001.png
  ├── page_002.png
  ├── ...
  └── _text_hints.json     ← 預提取文字（PDF 限定）
技術架構說明_slides.md      ← 完整 Markdown 文件
```

### Markdown 輸出格式

每一頁的結構長這樣：

```markdown
## 第 3 頁

![第3頁](./技術架構說明_slides/page_003.png)

### 解讀

#### 系統架構概覽

- 前端：React + Next.js
- 後端：Node.js microservices
- 資料層：PostgreSQL + Redis

​```mermaid
flowchart LR
  A[使用者] --> B[CDN]
  B --> C[Next.js]
  C --> D[API Gateway]
  D --> E[微服務群]
  E --> F[(PostgreSQL)]
  E --> G[(Redis)]
​```
```

重點是：**每一頁都保留原始截圖，同時附上 AI 解讀的結構化內容**。你可以對照圖片驗證解讀是否正確，也可以直接把文字拿去用。

---

## 三、安裝與下載

### 方法 A：一鍵下載（推薦）

<a href="{{ '/assets/downloads/skills/s2m/SKILL.md.download' | relative_url }}" download="SKILL.md" class="btn btn-warning btn-lg mb-3" style="background-color: #E5A300; border-color: #E5A300; color: #fff; font-weight: bold; text-decoration: none;">
  <i class="bi bi-download"></i>&nbsp; 下載 SKILL.md
</a>

下載後，放到你的專案目錄下：

```bash
mkdir -p .claude/skills/s2m
# 把下載的 SKILL.md 移到這裡
mv ~/Downloads/SKILL.md .claude/skills/s2m/
```

### 方法 B：手動建立

如果你偏好手動操作，在專案目錄下建立 `.claude/skills/s2m/SKILL.md`，貼入本文最後「附錄」段落的完整內容。

### 方法 C：從既有專案複製

如果你已經有一個包含 s2m Skill 的專案，直接複製整個目錄：

```bash
cp -r /path/to/project/.claude/skills/s2m .claude/skills/
```

### 依賴套件

s2m **不需要手動預裝任何套件**。Skill 內建了自動安裝邏輯：

| 套件 | 用途 | 安裝時機 |
|------|------|---------|
| `pymupdf` | PDF → PNG 轉換 + 文字提取 | 處理 PDF 時自動安裝 |
| `comtypes` | Windows PowerPoint COM 控制 | 處理 PPTX（Windows + Office）時自動安裝 |
| `python-pptx` | PPTX 純文字提取（最後手段） | 前兩種方法都失敗時自動安裝 |

唯一的前提是你的系統有 Python 3。如果沒有，先裝 Python。

### 安裝確認

安裝完成後，在 Claude Code 中輸入 `/s2m`，如果出現要求你提供檔案路徑的提示，就代表 Skill 已正確載入。

---

## 四、使用方式

### 基本用法

```bash
/s2m path/to/your-presentation.pptx
```

或是用自然語言：

> 幫我把這份簡報轉成 markdown：C:\Users\me\Documents\meeting.pdf

Claude 會自動辨識出這是 s2m 的使用情境並啟動 Skill。

### 觸發關鍵字

以下說法都會觸發 s2m：

- 「簡報轉 markdown」
- 「pptx 轉文字」
- 「pdf 簡報解讀」
- 「slides to markdown」
- 「把簡報整理成文件」

### 處理過程

執行後，你會在 Claude Code 的對話中看到完整的處理過程：

1. 確認檔案存在
2. 建立輸出目錄
3. 逐頁轉換為 PNG
4. 逐頁讀取圖片並解讀
5. 組合輸出 Markdown
6. 回報完成結果

整個流程全自動，你不需要中途做任何操作。

---

## 五、技術設計解析

這個 Skill 看起來簡單，但裡面有不少設計考量。以下是幾個我覺得值得分享的技術決策。

### 1. 安全化檔名處理

簡報檔名經常包含各種奇怪字元：emoji、全形問號、括號、空白。如果直接拿來當目錄名，很容易在不同作業系統上炸掉。

s2m 用一段 Python 正則表達式做安全化：

```python
import re, os, sys
basename = os.path.splitext(os.path.basename(sys.argv[1]))[0]
safe = re.sub(r'[^\w\s\u4e00-\u9fff\u3400-\u4dbf\uF900-\uFAFF\-.]', '', basename)
safe = re.sub(r'[\s_]+', '_', safe.strip()).strip('_.')
print(safe or 'slides')
```

這段邏輯保留了英文、數字、中文字元和連字號，把其他特殊字元全部過濾掉，並且把連續空白/底線壓縮成單一底線。即使檔名是 `🎯技術架構（第三版）.pptx`，也能安全產出 `技術架構第三版_slides/` 這樣的目錄。

### 2. 多策略 PPTX 轉換：三層 Fallback

PPTX 轉 PNG 是整個 Skill 最棘手的部分，因為沒有一個跨平台的完美解法。s2m 的策略是 **依序嘗試三種方法**：

| 優先順序 | 方法 | 條件 | 品質 |
|---------|------|------|------|
| B1 | PowerPoint COM | Windows + 安裝 MS Office | 最高（原生渲染） |
| B2 | LibreOffice headless → PDF → PNG | 安裝 LibreOffice | 高（大部分排版正確） |
| B3 | python-pptx 純文字提取 | 只需要 Python | 僅文字（無截圖） |

B1 方法的特別之處是，它會根據投影片的**實際尺寸**計算匯出解析度：

```python
w = int(prs.PageSetup.SlideWidth / 72 * 300)
h = int(prs.PageSetup.SlideHeight / 72 * 300)
```

這樣不管是標準 16:9、4:3，還是自訂尺寸的投影片，都能得到 300 DPI 的高品質截圖。

### 3. 自適應縮放：智慧取代固定倍率

處理 PDF 時，s2m 不使用固定的 4x 縮放，而是以 **2560px 為目標寬度**動態計算：

```python
TARGET_W = 2560
scale = max(TARGET_W / page.rect.width, 2.0)
```

這個設計的好處：

- 標準投影片（720pt 寬）→ 產生 ~2560×1920 的圖片，足夠清晰
- A4 文件（595pt 寬）→ 產生 ~2560×3620 的圖片，不會過度放大
- 比固定 4x **減少 30–50% 的檔案大小**，加速後續 AI 讀取

下限 2.0 確保即使是超寬頁面也不會縮放不足。

### 4. 平行處理架構

頁數不同，處理策略也不同：

| 頁數 | 策略 | 原因 |
|------|------|------|
| ≤ 10 | 循序處理 | 開 Agent 的額外開銷不值得 |
| 11–50 | 分批平行（每批 5–8 頁） | 多個 Agent 同時解讀，速度快 2–3 倍 |
| > 50 | 先詢問使用者 | 避免意外消耗大量 token |

平行處理的關鍵是**在同一個訊息中發出所有 Agent 呼叫**，這樣 Claude Code 才會真正同時執行，而不是等一個做完再做下一個。

每個 Agent 會收到：
- 它負責的頁碼範圍與圖片路徑
- 預提取的文字（如果有）
- 完整的解讀規則
- 嚴格的回傳格式

收集完畢後，主流程依頁碼排序合併，產出最終文件。

### 5. Mermaid 圖表還原

這是 s2m 最有價值的功能之一。當 AI 辨識出頁面包含圖形時，不會只寫「這裡有一張流程圖」，而是**直接輸出可渲染的 Mermaid 程式碼**。

支援 13 種圖形類型：

| 圖形類型 | Mermaid 語法 |
|---------|-------------|
| 流程圖 | `flowchart LR` / `flowchart TD` |
| 循序圖 | `sequenceDiagram` |
| 甘特圖 | `gantt` |
| 類別圖 | `classDiagram` |
| 狀態圖 | `stateDiagram-v2` |
| ER 圖 | `erDiagram` |
| 架構/系統圖 | `graph TD` / `graph LR` |
| 組織圖 | `graph TD`（階層式） |
| 心智圖 | `mindmap` |
| 圓餅圖 | `pie` |
| 時間軸 | `timeline` |
| 使用者旅程 | `journey` |
| 象限圖 | `quadrantChart` |

對於複雜圖形，Skill 的指引是**優先還原結構與主要節點**，次要細節標註 `%% [略]`，確保產出的 Mermaid 語法可以正確渲染。

### 6. 錯誤處理機制

s2m 針對七種常見例外定義了明確的處理策略：

| 狀況 | 處理方式 |
|------|---------|
| 檔案不存在 | 報錯並請使用者確認路徑 |
| 無法安裝 pymupdf | 提示手動安裝後重試 |
| PPTX 三種方法皆失敗 | 以純文字模式告知使用者 |
| 圖片數與預期頁數不符 | 列出差異，詢問是否繼續 |
| 單頁讀取失敗 | 跳過，標記警告 |
| 頁數超過 50 | 詢問使用者分批或指定範圍 |
| Agent 回傳缺漏頁面 | 對缺漏頁面改用循序處理 |

這些不是「防呆」，而是讓 Skill 在真實環境中能穩定運作的必要設計。簡報檔案來源五花八門，你永遠不知道下一份會碰到什麼狀況。

---

## 六、實際使用情境

假設你剛參加完一場技術分享會，拿到講者的 30 頁 PDF 簡報。

```bash
/s2m ~/Downloads/microservices-architecture-talk.pdf
```

s2m 會開始工作：

1. **轉換階段**（約 10 秒）：30 張高解析度 PNG 產生完畢
2. **解讀階段**（約 2–3 分鐘）：分成 4 批 Agent 平行處理
3. **組合階段**（即時）：依頁碼排序，寫出 Markdown 文件

完成後你會得到：

- `microservices-architecture-talk_slides/` — 30 張截圖
- `microservices-architecture-talk_slides.md` — 完整 Markdown 文件

打開 Markdown 文件，每一頁都有原始截圖和結構化解讀。架構圖變成了可編輯的 Mermaid 流程圖，表格變成了 Markdown 表格，程式碼變成了有語法標記的 code block。

你可以直接把這份文件：
- 丟進 Notion 或 Obsidian 當學習筆記
- 複製片段到技術文件裡
- 用 Git 追蹤版本變化
- 用 Mermaid 編輯器修改流程圖

---

## 結語

Skill 是 Claude Code 最值得探索的擴充機制。

它不像 CLAUDE.md 只能設定規範，也不像 Hooks 只能做事件反應。Skill 可以定義完整的、多步驟的工作流——而且可以在不同專案之間重複使用。

s2m 只是一個起點。你完全可以根據自己的工作流，寫出更多專屬的 Skill：

- 把會議錄音轉成結構化紀錄
- 把 Figma 設計稿轉成元件規格
- 把 API 文件轉成 SDK 範例程式碼
- 把 CSV 報表轉成視覺化 dashboard

關鍵不是工具有多厲害，而是**你願不願意把重複的工作標準化**。

一旦你把流程寫成 Skill，以後每次遇到同樣的事，就是一句指令的事。

---

## 附錄：完整 SKILL.md 原始碼

以下是 s2m Skill 的完整定義，你可以直接複製到 `.claude/skills/s2m/SKILL.md` 使用。

<a href="{{ '/assets/downloads/skills/s2m/SKILL.md.download' | relative_url }}" download="SKILL.md" class="btn btn-warning btn-lg mb-3" style="background-color: #E5A300; border-color: #E5A300; color: #fff; font-weight: bold; text-decoration: none;">
  <i class="bi bi-download"></i>&nbsp; 下載 SKILL.md
</a>

<details markdown="1">
<summary>點擊展開完整 SKILL.md</summary>

````markdown
---
name: s2m
description: 將 PPTX 或 PDF 簡報逐頁轉為 Markdown 文件，每頁含原始頁面截圖與 AI 解讀內容；圖形/流程圖以 Mermaid 格式呈現。當使用者提到「簡報轉 markdown」、「pptx 轉文字」、「pdf 簡報解讀」、「slides to markdown」、「把簡報整理成文件」時觸發。
argument-hint: <pptx-or-pdf-path>
allowed-tools: Read, Bash, Write, Glob, Agent, Edit
---

# 簡報轉 Markdown（slides-to-markdown）

你的任務是將一份 PPTX 或 PDF 簡報轉換為一份完整的 Markdown 文件，包含每頁的原始截圖影像以及 AI 解讀的文字內容。

## 輸入

目標簡報檔案路徑：`$ARGUMENTS`

若未指定路徑，詢問使用者提供檔案路徑。

---

## 執行流程

### 第一步：確認輸入與準備輸出目錄

1. 確認 `$ARGUMENTS` 指定的檔案存在（用 Bash `test -f`）。
2. 判斷副檔名：`.pptx` / `.ppt` 或 `.pdf`。
3. **安全化輸出目錄名稱**：檔名可能包含 emoji、全形問號、括號等特殊字元，使用以下 Python 腳本產生安全名稱：

```python
import re, os, sys
basename = os.path.splitext(os.path.basename(sys.argv[1]))[0]
safe = re.sub(r'[^\w\s\u4e00-\u9fff\u3400-\u4dbf\uF900-\uFAFF\-.]', '', basename)
safe = re.sub(r'[\s_]+', '_', safe.strip()).strip('_.')
print(safe or 'slides')
```

4. 決定輸出位置（`<safe_name>`）：
   - 圖片目錄：`<safe_name>_slides/`（與來源檔同層）
   - 輸出 Markdown：`<safe_name>_slides.md`（與來源檔同層）
5. 建立圖片輸出目錄。

---

### 第二步：將簡報轉為逐頁 PNG 並提取文字

使用 Bash 執行 Python 腳本。根據檔案類型選擇對應策略。**統一使用 `python -` 搭配 heredoc 執行**。

#### 情況 A：PDF 檔案

同時提取頁面圖片與文字內容，供後續解讀參考：

```python
import sys, os, json, subprocess
pdf_path, out_dir = sys.argv[1], sys.argv[2]
os.makedirs(out_dir, exist_ok=True)

try:
    import fitz
except ImportError:
    subprocess.run([sys.executable, "-m", "pip", "install", "pymupdf", "-q"], check=True)
    import fitz

doc = fitz.open(pdf_path)
texts = {}
TARGET_W = 2560  # 自適應縮放目標寬度

for i, page in enumerate(doc):
    scale = max(TARGET_W / page.rect.width, 2.0)
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale))
    pix.save(os.path.join(out_dir, f"page_{i+1:03d}.png"))
    text = page.get_text().strip()
    if text:
        texts[i+1] = text

if texts:
    with open(os.path.join(out_dir, "_text_hints.json"), "w", encoding="utf-8") as f:
        json.dump(texts, f, ensure_ascii=False, indent=2)

print(f"OK:{len(doc)}")
```

**自適應縮放邏輯**：以 2560px 為目標寬度動態計算 scale（下限 2.0），取代固定 4x。標準投影片（720pt 寬）產生 ~2560×1920 圖片，A4 頁面（595pt 寬）產生 ~2560×3620 圖片。圖檔大小較固定 4x 減少 30–50%，加速後續 Read。

#### 情況 B：PPTX / PPT 檔案

依序嘗試 B1 → B2 → B3。

**B1 — Windows PowerPoint COM（需安裝 MS Office）**

```python
import sys, os, subprocess
pptx_path, out_dir = sys.argv[1], sys.argv[2]
os.makedirs(out_dir, exist_ok=True)
pptx_abs, out_abs = os.path.abspath(pptx_path), os.path.abspath(out_dir)

try:
    import comtypes.client
except ImportError:
    subprocess.run([sys.executable, "-m", "pip", "install", "comtypes", "-q"], check=True)
    import comtypes.client

ppt_app = comtypes.client.CreateObject("PowerPoint.Application")
ppt_app.Visible = 1
prs = ppt_app.Presentations.Open(pptx_abs, ReadOnly=1, Untitled=0, WithWindow=0)

# 根據投影片實際尺寸 × 300 DPI 匯出（維持原始比例）
w = int(prs.PageSetup.SlideWidth / 72 * 300)
h = int(prs.PageSetup.SlideHeight / 72 * 300)

count = prs.Slides.Count
for i in range(1, count + 1):
    prs.Slides(i).Export(os.path.join(out_abs, f"page_{i:03d}.png"), "PNG", w, h)

prs.Close()
ppt_app.Quit()
print(f"OK:{count}")
```

**B2 — LibreOffice headless → PDF → PNG**

```bash
soffice --headless --convert-to pdf --outdir "<out_dir>" "<pptx_path>"
# 再用情況 A 的 pymupdf 腳本處理產生的 PDF
```

**B3 — python-pptx 純文字提取（無渲染，最後手段）**

```python
import sys, os, json, subprocess
pptx_path, out_dir = sys.argv[1], sys.argv[2]
os.makedirs(out_dir, exist_ok=True)

try:
    from pptx import Presentation
except ImportError:
    subprocess.run([sys.executable, "-m", "pip", "install", "python-pptx", "-q"], check=True)
    from pptx import Presentation

prs = Presentation(pptx_path)
slides_data = []
for i, slide in enumerate(prs.slides):
    texts = [p.text.strip() for shape in slide.shapes if shape.has_text_frame
             for p in shape.text_frame.paragraphs if p.text.strip()]
    slides_data.append({"slide": i+1, "texts": texts})

with open(os.path.join(out_dir, "text_data.json"), "w", encoding="utf-8") as f:
    json.dump(slides_data, f, ensure_ascii=False, indent=2)
print(f"OK:{len(prs.slides)}")
```

---

### 第三步：逐頁讀取圖片並解讀（支援平行處理）

轉換完成後，使用 Glob 找出所有 `page_*.png`，按頁碼排序。若 `_text_hints.json` 存在，先用 Read 載入作為解讀輔助。

#### 策略選擇

| 頁數 | 策略 |
|------|------|
| ≤ 10 | **循序處理**：依序 Read 每頁圖片，當場解讀 |
| 11–50 | **平行處理**：分批交由 Agent 同時解讀 |
| > 50 | 先詢問使用者是否分批或指定頁碼範圍 |

#### 平行處理細節（頁數 > 10 時啟用）

將頁面分為多個批次（每批 5–8 頁），對每批使用 **Agent 工具**（`subagent_type: "general-purpose"`）同時處理。**同一訊息中發出所有 Agent 呼叫以實現真正平行。**

每個 Agent 的 prompt 須包含：
1. 其負責的頁碼範圍與圖片絕對路徑清單
2. 對應的 `_text_hints.json` 預提取文字（若有）
3. 下方「解讀規則」的完整內容
4. 回傳格式規定

收集所有 Agent 回傳後，依頁碼排序合併。

#### 解讀規則

##### 文字內容

- 標題 → `##` 或 `###`
- 條列項目 → Markdown 清單（`-` 或 `1.`）
- 表格 → Markdown 表格
- 強調文字 → `**粗體**` 或 `> 引言`
- 程式碼 → 對應語言的 fenced code block
- 頁碼、日期、版本號 → `<!-- page: N -->`

##### 圖形/圖表 → Mermaid

若頁面包含圖形，**必須輸出 Mermaid 程式碼區塊**取代文字描述。支援 13 種圖形類型（流程圖、循序圖、甘特圖、類別圖、狀態圖、ER 圖、架構圖、組織圖、心智圖、圓餅圖、時間軸、使用者旅程、象限圖）。

##### 純圖片/照片

以 `> [圖片：說明]` 描述。

---

### 第四步：組合輸出 Markdown 文件

將所有頁面解讀結果組合成單一 Markdown 文件，每頁以 `---` 分隔，圖片使用相對路徑。

### 第五步：寫出輸出檔案

使用 Write 工具將完整 Markdown 寫入 `<safe_name>_slides.md`。

完成後告知使用者：
- 輸出 Markdown 路徑
- 圖片目錄路徑
- 總頁數
- 解讀不完整的頁面（若有）

---

## 錯誤處理

| 狀況 | 處理方式 |
|------|---------|
| 檔案不存在 | 報錯並請使用者確認路徑 |
| 無法安裝 pymupdf | 提示 `pip install pymupdf` 後重試 |
| PPTX 三種方法皆失敗 | 以 B3 純文字模式告知使用者 |
| 圖片數與預期頁數不符 | 列出差異，詢問是否繼續 |
| 單頁讀取失敗 | 跳過，標記 ⚠️ 此頁圖片無法讀取 |
| 頁數超過 50 | 詢問使用者分批或指定範圍 |
| Agent 回傳缺漏頁面 | 對缺漏頁面 fallback 循序處理 |

---

## 注意事項

- **不可虛構內容**：解讀必須完全基於頁面實際可見內容。
- **保留原文**：中/英文文字直接保留，不得意譯或省略。
- **Mermaid 正確性**：語法必須正確，避免未閉合括號或非法字元。
- **相對路徑**：圖片使用相對路徑，確保可移植。
- **文字輔助**：`_text_hints.json` 僅作驗證參考，最終以圖片內容為準。
````

</details>
