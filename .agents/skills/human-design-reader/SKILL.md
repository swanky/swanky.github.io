---
name: human-design-reader
description: 使用 swanky.github.io 的本機人類圖引擎排出生圖、檢查出生時間誤差，並以繁體中文產出可核對、非命定式的解讀。當使用者要求人類圖排盤、類型／權威／人生角色／中心／通道／輪迴交叉解讀、出生時間不確定性比較，或要把排盤資料交給報告流程時使用。
---

# 人類圖排盤與解讀

使用 repo 內已驗證的 JavaScript 引擎計算，不憑記憶推算閘門、通道或類型。出生資料留在本機；除非使用者明確要求，不送往外部服務。

## 工作流程

1. 確認出生日期、當地時間與 IANA 時區，例如 `Asia/Taipei`。只有 UTC 偏移時可用 `+08:00`，但歷史日光節約時間優先使用 IANA 時區。
2. 執行 `node .agents/skills/human-design-reader/scripts/chart.mjs --date YYYY-MM-DD --time HH:mm --tz Asia/Taipei`。
3. 時間來自回想或約略紀錄時，加 `--uncertainty 15`、`30` 或 `60`。完全不知道時間時加 `--unknown-time`；此模式用正午當主盤，並比較同日五個時段。
4. 先讀輸出中的 `stability`。類型、內在權威、人生角色或定義若不穩定，不把主盤包裝成確定結論；清楚列出可能值並建議查證時間。
5. 依「結構事實 → 可能的生活經驗 → 現實核對問題」三層寫解讀。細節讀 [reading-method.md](references/reading-method.md)，欄位讀 [output-schema.md](references/output-schema.md)。

## 回答規則

- 使用繁體中文與白話；保留 Human Design 專名時，同句解釋它代表什麼。
- 明確區分「已定義」、「未定義但有啟動閘門」、「完全開放」。不要把所有非定義中心都稱為完全開放。
- 輪迴交叉名稱與四個組成閘門可當結構事實；不要把它寫成命定使命、保證或預言。
- 把類型、權威、中心與通道描述成自我觀察框架，不宣稱具有科學診斷效力，也不替代醫療、法律、財務或心理專業意見。
- 不搬用第三方網站的付費或著作文案。需要深入敘述時，以輸出資料與 repo 原創資料為基礎重新組織。
- 若使用者提供姓名，輸出可稱呼對方，但不要把姓名寫入 repo、日誌或其他持久檔案，除非使用者明確要求建立報告。

## 命令範例

```powershell
node .agents/skills/human-design-reader/scripts/chart.mjs --date 1990-05-15 --time 14:30 --tz Asia/Taipei --uncertainty 30
```

```powershell
node .agents/skills/human-design-reader/scripts/chart.mjs --date 1990-05-15 --tz +08:00 --unknown-time
```

腳本成功時只把 JSON 寫到 stdout；輸入錯誤寫到 stderr 並以非零狀態結束，方便 Claude Code、Codex 與 Hermes 用同一方式呼叫。
