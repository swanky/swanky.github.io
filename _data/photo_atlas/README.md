# 看懂寫真圖鑑：人物檔欄位說明（給寫作 agent）

一位人物 = 一個檔 `_data/photo_atlas/<id>.yml`，檔名（不含副檔名）要等於檔內的 `id`。
頁面（`photography/learn/photographers/index.html`、`photography/learn/models/index.html`）只在 front matter 用 `people_ids: [a, b, c]` 列出要收的人（順序＝頁面順序）。
版型：`_layouts/photo-learn-atlas.html`。各 agent 只改自己那一位的檔，不要動頁面 front matter、版型、CSS。
（Jekyll 只讀 yml／json／csv 當資料，這份 .md 會被忽略，不會出錯。）

新增一位：建 `<id>.yml` → 請站主或統籌者把 id 加進頁面 `people_ids`。草稿階段加 `status: review`，本機預覽看得到、正式站不會出現。

## 欄位（範例取自 avedon.yml）

| 欄位 | 必填 | 說明與範例 |
|---|---|---|
| `id` | 必 | 英數與連字號，同檔名，也是頁內錨點。`avedon` |
| `status` | 否 | `published`（缺省）或 `review`。review 只在本機預覽顯示，production 建置整位略過 |
| `name` | 必 | 原文名。`Richard Avedon` |
| `zh` | 否 | 中文通行譯名，查得到館方用法才寫。`蒂姆．沃克`（walker.yml） |
| `zh_note` | 否 | 譯名出處。`中文譯名依奇美博物館展覽` |
| `life` | 有來源才填 | 生卒年。`1923–2004`（查不到就不填，並在 bio 用一句交代） |
| `place` | 否 | 地點或說明。`美國紐約` |
| `theme` | 必 | 一句主題，同時出現在目錄。`讓人動起來，或把人放到白牆前` |
| `view` | 必 | 一句策展視角（站主看法，畫面標「我的看法」） |
| `portrait` | 否 | `{src, width, height, alt, caption}`；只用授權明確允許的圖，caption 寫作者與授權 |
| `figure` | 否 | 同 portrait 結構；正文大圖，放在作品導覽前，只放公有領域或授權允許的圖 |
| `bio` | 必 | HTML（`bio: \|` 區塊），只寫有出處的幾段 `<p>`；段末用 `<sup><a href="#src-avedon">出處</a></sup>` |
| `works_intro` | 否 | 作品導覽前的一句說明（純文字） |
| `works` | 必 | 作品清單，見下 |
| `works_after` | 否 | 作品清單後的 HTML 補註，如 `<p class="atlas-note">…</p>` |
| `videos` | 否 | 影音清單，見下 |
| `take` | 必 | 字串清單：拍照的人可以帶走什麼（站主看法） |
| `related` | 否 | 往下讀的連結，見下 |
| `sources` | 必 | 出處清單，見下；每條都要實際打開核對過 |

### works[]（交給 `_includes/photography/learn-works.html`）
- 必填：`title`（原文作品名）、`year`（字串，加引號 `"1947"`）、`where`（館名）、`url`（該作品頁，不是首頁，要親自打開驗證）、`look`（看點一兩句）
- 選填：`zh`（中文說明）
- 附小圖（選填）：`img`（`/assets/img/photo-learn/works/<slug>/<nn>-<作品>.jpg`，JPEG 長邊 ≤600）、`img_w`、`img_h`（實際像素）、`credit`（有 img 時必填，照館藏頁 © 寫法）
- `npm test` 的 `photo-learn-images.test.mjs` 會檢查 credit、url、檔案存在與尺寸

```yaml
works:
  - title: Renee, the New Look of Dior, Place de la Concorde, Paris
    zh: 穿 Dior「新風貌」的 Renee，巴黎協和廣場
    year: "1947"
    where: 英國 V&A 博物館
    url: https://collections.vam.ac.uk/item/O82835/
    img: /assets/img/photo-learn/works/photographers-avedon/01-renee-new-look-dior.jpg
    img_w: 450
    img_h: 600
    credit: "© Victoria and Albert Museum, London / The Richard Avedon Foundation"
    look: 她正走過廣場，裙擺整片甩開成一個圓弧……
```

### videos[]
`id`（YouTube 影片 id）、`title`、`channel`、`channel_url`、`length`、`lang`、`note`（皆建議填）；`link_only: true` 只外連不嵌入；`thumb: false` 關掉官方縮圖封面。

### related[]（兩種寫法擇一）
- 連到本專區章節：建議寫 `{unit: u3, url: /photography/learn/collaboration/penn-fonssagrives/}`（改章名也不會斷）；也可寫 `{unit: u3, slug: penn-fonssagrives}` 或舊寫法 `{unit: u3, title: 章節標題}`。比對順序 url ＞ slug ＞ title，對照 `_data/photo_learn.yml`，只有看得到的章才輸出；顯示文字用 `title`，沒寫就用章名
- 一般連結：`{label, url, note}`；同頁錨點 url 以 `#` 開頭（如 `"#walker"`）

### sources[]
`title`、`by`（發布單位）、`url` 必填；`note`（這條支撐哪些事實）建議填。

## 規則提醒
- 全站繁體中文、TA 白話；譯名、生卒年等事實查不到就不填、在 bio 用一句交代，不憑印象補（見 AGENTS.md「版本學事實」精神）。
- 只用有授權依據的圖；作品小圖屬評論引用，規則見 `docs/photography-study-zone-review-2026-10.md` §2.2。
