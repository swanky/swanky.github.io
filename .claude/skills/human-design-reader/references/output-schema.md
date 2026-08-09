# 腳本輸出欄位

- `input`：標準化後的出生日期、時間、時區與時間誤差設定。
- `meta.birthUtc`、`meta.designUtc`：出生與設計計算時刻。
- `chart.type`、`authority`、`profile`、`definition`：四個核心判定代碼。
- `chart.centers.defined`：由完整通道形成定義的中心。
- `chart.centers.undefined`：沒有形成定義，但至少有一個啟動閘門的中心。
- `chart.centers.fullyOpen`：沒有形成定義，也沒有任何啟動閘門的中心。
- `chart.centers.open`：向下相容欄位，等於 `undefined` 與 `fullyOpen` 的聯集。
- `chart.channels`：完整通道的 `id`、中文名稱與兩端中心。
- `chart.cross`：輪迴交叉名稱、角度及四個組成閘門。
- `chart.activations.personality`、`design`：13 個行星的閘門、爻線與黃經。
- `stability`：有指定誤差或未知時間時才出現。`coreStable` 檢查類型、權威、人生角色、定義；`allStable` 另含中心、通道、交叉與行星啟動。

代碼的中文名稱與原創說明應從 repo 的 `hd-data-texts.js`、`hd-data-centers.js`、`hd-data-channels.js` 讀取，不自行猜譯。
