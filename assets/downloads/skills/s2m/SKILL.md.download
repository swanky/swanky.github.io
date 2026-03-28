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

Agent prompt 範本：

```
你負責解讀以下簡報頁面。請依序使用 Read 工具讀取每張圖片並依規則解讀。

頁面清單：
- 第 X 頁：/absolute/path/page_00X.png
- 第 Y 頁：/absolute/path/page_00Y.png

預提取文字（僅供輔助驗證，最終以圖片為準）：
第 X 頁：[text]
第 Y 頁：[text]

=== 解讀規則 ===
[貼入下方完整解讀規則]
=== 規則結束 ===

回傳格式（嚴格遵守，每頁一個區塊）：
<!-- PAGE:X -->
[該頁解讀的 Markdown]
<!-- PAGE:Y -->
[該頁解讀的 Markdown]
```

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

若頁面包含以下圖形，**必須輸出 Mermaid 程式碼區塊**取代文字描述：

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

**Mermaid 語法注意**：節點標籤含特殊字元（括號、引號、冒號）時須以雙引號包裹；確保所有括號閉合、箭頭語法正確。

複雜圖形優先還原**結構與主要節點**，次要細節標註 `%% [略]`。

##### 純圖片/照片

以 `> [圖片：說明]` 描述。

---

### 第四步：組合輸出 Markdown 文件

將所有頁面解讀結果（循序處理的直接使用；平行處理的依 `<!-- PAGE:N -->` 標記排序合併）組合成單一 Markdown 文件：

```markdown
# [簡報標題]

> **來源檔案：** `<filename>`
> **頁數：** N 頁
> **轉換日期：** YYYY-MM-DD

---

## 第 1 頁

![第1頁](./<safe_name>_slides/page_001.png)

### 解讀

[該頁 Markdown 內容]

---

## 第 2 頁

![第2頁](./<safe_name>_slides/page_002.png)

### 解讀

[...]

---
```

- 每頁以 `---` 分隔
- 圖片使用安全化後的相對路徑
- 純圖片頁填入內容說明

---

### 第五步：寫出輸出檔案

使用 **Write 工具**將完整 Markdown 寫入 `<safe_name>_slides.md`。

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
| 單頁讀取失敗 | 跳過，標記 `⚠️ 此頁圖片無法讀取` |
| 頁數超過 50 | 詢問使用者分批或指定範圍 |
| Agent 回傳缺漏頁面 | 對缺漏頁面 fallback 循序處理 |

---

## 注意事項

- **不可虛構內容**：解讀必須完全基於頁面實際可見內容。
- **保留原文**：中/英文文字直接保留，不得意譯或省略。
- **Mermaid 正確性**：語法必須正確，避免未閉合括號或非法字元。
- **相對路徑**：圖片使用相對路徑，確保可移植。
- **文字輔助**：`_text_hints.json` 僅作驗證參考，最終以圖片內容為準。
