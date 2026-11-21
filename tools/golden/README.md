# golden 案例產生腳本

星座與八字排盤的「標準答案」由這兩支腳本用**和本站不同的實作**算出，再存成 fixtures 給 `npm test` 比對。本站程式碼不參與產生過程。

| 腳本 | 參考實作 | 輸出 → 貼進 |
|---|---|---|
| `astro_golden.py` | Swiss Ephemeris（pyswisseph，Moshier 星曆、真交點、宮位 `W`／`E`） | `tests/astrology/fixtures-golden.mjs` |
| `bazi_golden.py` | sxtwl（壽星天文曆）＋ Swiss Ephemeris 太陽黃經交叉月支 | `tests/bazi/fixtures-golden.mjs` |

## 重跑

```bash
uv venv --python 3.11 .venv-golden
uv pip install --python .venv-golden --only-binary :all: -r tools/golden/requirements.txt
.venv-golden/Scripts/python -X utf8 tools/golden/astro_golden.py > astro.json
.venv-golden/Scripts/python -X utf8 tools/golden/bazi_golden.py  > bazi.json
```

把 JSON 陣列的 `label`／`input`／`expected` 貼回對應 fixtures（`utc`、`sunLon` 是除錯欄位，可省略）。**不得手改 expected**；要加案例就改腳本裡的 `CASES` 重跑。案例只用公開城市與虛構時間，不放任何真人出生資料。
