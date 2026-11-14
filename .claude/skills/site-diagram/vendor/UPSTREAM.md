# vendored：diagram-design

| 項目 | 值 |
|---|---|
| 來源 | https://github.com/cathrynlavery/diagram-design |
| 版本 | commit `f6db0decea96de66b901331a0f79a8d4b147ebae`（2026-11-12，plugin 2.6.164），skill metadata version 2.6；前一版 0cf73c3（2026-10-27） |
| 授權 | MIT（`LICENSE`）；內含圖示的第三方授權見 `THIRD_PARTY_LICENSES.md` |
| 引入日期 | 2026-10-28（原於站主另一個 repo 引入，2026-11-14 移植到本 repo） |

## 複製了什麼

| 本目錄 | upstream 位置 |
|---|---|
| `diagram-design/` | `skills/diagram-design/`（整個目錄，原封不動） |
| `repo-scripts/verify-architecture-delta.py` | `scripts/`（upstream 放在 repo 根，不在 skill 目錄內） |
| （不 vendor）`scripts/verify-geometry.py` | 2026-11-13 換版起改用 skill 內的 `diagram-design/scripts/verify_geometry.py`；upstream repo 根那支只剩 runpy 轉接，依賴 upstream 目錄結構，放在本 repo 會找不到目標 |
| `LICENSE`、`THIRD_PARTY_LICENSES.md` | repo 根 |

本地修改：**無**。本 repo 的規定寫在上層 `SKILL.md` 與 `references/site-zh.md`，不改這裡的檔案。

放在 `site-diagram/vendor/` 而不是 `.claude/skills/diagram-design/`：避免被當成第二個 skill 載入。它的英文描述涵蓋所有圖型，會搶走 `site-diagram` 的觸發，並帶出 first-run 自訂配色的提問與寫入家目錄的 profile 流程。

## 安全檢視（2026-10-28）

- `self_check.py`、`verify_geometry.py`、`verify-architecture-delta.py`：純標準函式庫，只讀傳入的 HTML，無網路與子行程。
- 其他 `diagram-design/scripts/*.py` grep `subprocess|urllib|requests|socket|exec(|eval(`：沒有網路請求或執行外部指令。`export_png.py` 會用 Playwright 開瀏覽器；`drawio_extract.py`、`self_check.py` 只用 `urllib.parse` 解析字串。
- 執行時一律 `py -3 -I`（`shot.py` 例外，見上層 SKILL.md）。

## 更新方式

審查流程（要不要換、換了之後 site-zh 怎麼改）見上層 `SKILL.md`「upstream 更新審查」。實際換版：

1. `py -3 -I check_upstream.py` 確認有新版並讀報告（clone 在 repo 外的 `%USERPROFILE%\tools\diagram-design`）。
2. 整個換掉 `diagram-design/` 與 `repo-scripts/` 的兩支檔，更新本檔的 commit 與日期。
3. 重做安全檢視的 grep。
4. 用 本 repo 已上線的圖（`assets/diagrams/*.html`） 跑 `../scripts/check.py`，確認檢查腳本仍可用、樣本仍通過。

## 換版紀錄

- 2026-11-13：0cf73c3 → f6db0de（56 個 commit）。採納：新增 5 種圖型（steps、unit grid、event modeling、requirement traceability、SBGN）、dependency 的 arc diagram 變體、PlantUML 匯入、Mermaid 匯入多項修正；`self_check.py` 新增「方框內文字超出寬度預算」檢查（與 site-zh §2 字寬預算同一套算法）；verify-geometry 搬進 skill 目錄。本 repo 跟著改：`scripts/check.py` 改呼叫 `diagram-design/scripts/verify_geometry.py`、`check_upstream.py` 的 VENDORED／KEY 清單、site-zh §5。字型、配色、間距規則 upstream 未變，site-zh 覆寫照舊。安全檢視 grep 重做，無網路請求或外部指令（只命中註解與字串）。3 個回歸樣本 check.py 全過。
