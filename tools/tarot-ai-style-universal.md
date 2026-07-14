# AI 牌面美術指導 · 通用版（Universal / Restyle Kit）

> 這是 [`tarot-ai-style.md`](./tarot-ai-style.md)（制服女孩 × Web3 科技母題 · ink 復古風 v3）的**參數化通用版**。
> 目的：只改三個參數（**藝術畫風／主角人物／四花色母題**），就能用同一套 78 張骨架，生出**任意風格**的整組塔羅牌卡面。
> 讀者＝**Hermes Agent**（prompt 產生器＋生圖專案經理）與站主本人。

---

## 給 Hermes 的一句話任務定義

你（Hermes）**不生圖**——你是「prompt 產生器＋生圖專案經理」。使用者會給你一組「風格參數」（PART 1）。你的工作：

1. 把參數注入 STYLE 後綴（PART 2），逐張套上 78 張場景骨架（PART 3），產出一份**可直接貼進 ChatGPT（Image）的完整 prompt 清單**（格式見 §4.6）；
2. 依 PART 4 引導使用者的生圖順序、逐張**驗數**、生完後的**壓圖換檔＋更新 manifest**。

真正的圖，由使用者拿你產出的英文 prompt，到 ChatGPT 圖像模型生成。你負責的是「文字」與「流程」。

---

## PART 0 · 運作原理（為什麼這樣拆）

塔羅牌的「場景內容」是固定的公共財象徵（皇后＝坐麥田王座持權杖、旁有金星盾；高塔＝被閃電擊中、人自塔頂墜落）。真正會隨風格改變的只有三件事：

| | 內容 | 位置 |
|---|---|---|
| **固定・永不改** | 78 張的 RWS 構圖與象徵（含數量鎖定） | PART 3 場景骨架 |
| **可變・每次填** | ① 藝術畫風 ② 主角人物 ③ 四花色符號長相 | PART 1 參數 |

所以換風格＝只改 PART 1；PART 2、PART 3 原封不動。這保證：

- 全套 78 張**畫風／角色一致**（同一段風格後綴貼滿全套）；
- **塔羅象徵正確**（場景骨架不動，不會因換風格畫錯牌義）；
- **數量精準**（`EXACTLY N` 的鎖定語言寫死在骨架裡）。

**設計分層（重要）**：本通用版刻意把場景骨架寫成**風格中性**——場景只描述「幾個什麼物件、怎麼擺」，物件的「長相」交給可換的風格後綴（PART 2）統一控制。原始 v3 是把科技母題**深融進每張場景**（如「錢幣像果實長在藤上、表面刻六角節點紋」），畫面更融合但綁死科技風、不可換。若你想要那種深度融合，見 §2.5「進階：母題深融場景」。

**為何 prompt 用英文**：核心痛點是「數量精準」與「元素齊全」，圖像模型對 `EXACTLY N` 這類英文指令的遵循度遠高於中文。故 STYLE＋SCENE 一律英文；只有給人看的說明用中文。

---

## PART 1 · 風格參數區（★換風格只改這一區★）

把每個 `{{...}}` 填成你這次要的風格。規則：**最終貼給 ChatGPT 的 prompt 裡不得殘留任何 `{{...}}`**，必須全部替換完成。

### §1.1 `{{ART_STYLE}}` — 藝術畫風（一段英文：媒材＋筆觸＋色調＋質感＋情緒）

這段會出現在每一張的後綴，是全套一致性的錨。

**原牌組實際用的墨線復古（v3 Part C 原文，當基準範例）：**

```
a bold VINTAGE TAROT illustration in INK LINE-ART comic style — confident clean
black outlines, manga/comic-influenced figures, flat cel-shaded coloring with light
hatching and an aged-parchment feel; warm muted vintage palette (golden ochre, deep
red, forest green, cream). Reminiscent of a modern illustrated witch-tarot deck.
```

**換風格範例（自行改寫這一段即可）：**

- **水彩**：`a soft watercolor tarot illustration — loose wet-on-wet washes, bleeding pigments, visible deckled watercolor-paper texture, a dreamy luminous pastel palette.`
- **賽博龐克**：`a neon cyberpunk tarot illustration — glowing holographic linework, subtle chromatic-aberration edges, a dark rain-slick palette lit by electric magenta and cyan, high-tech dystopian mood.`
- **浮世繪**：`an ukiyo-e woodblock tarot illustration — bold flat colour fields, confident carved outlines, visible woodgrain and washi-paper texture, an Edo-period aesthetic.`
- **金箔聖像**：`a Byzantine icon-style tarot illustration — flattened gold-leaf backgrounds, solemn stylised figures, egg-tempera texture, sacred jewel-tone palette.`

### §1.2 `{{CHARACTER}}` — 貫穿全套的主角（＋參考圖流程）

這套牌的識別特徵＝**同一個角色演繹全 78 張**。用一段英文寫死臉孔與服裝關鍵特徵。

**原牌組實際用的角色（v3 Part B 原文，當基準範例）：**

```
one wholesome Taiwanese high-school girl, about 17, gentle and bright expression —
the single recurring heroine of the deck. Hair: warm chestnut-brown, straight,
chest-length, blunt bangs, two thin red hair ribbons; a tiny gold hexagon hairpin as
a subtle signature. Outfit: a navy-blue Japanese sailor school uniform (水手服) —
white middy blouse, navy sailor collar trimmed with white double stripes, a red
neckerchief tied at the chest, a navy pleated skirt, white knee-high socks, brown
loafers. Clean, modest, editorial — not fan-service.
```

換角色只改這一段（例：`a young witch, plum-purple hooded robe, silver crescent-moon earrings, long straight black hair`；或`a small bear-eared mascot in white overalls`…）。

**★角色一致性靠「參考圖」，不是靠文字★**
ChatGPT 生圖前，先備好基準圖再逐張生（沿用 v3 Part A 流程）：

1. **先生兩張基準**：
   - **角色設定圖**：把 §1.1＋§1.2 組成一句 `A character reference sheet of {{CHARACTER}}. {{ART_STYLE}} Show a front full-body view plus a face close-up on a warm cream background. No text, no logo.`，生數張挑最滿意的，存 `character-ref.jpg`。
   - **風格 key art**：先生一張**星星或命運之輪**當「風格錨」（構圖豐富、最能定調），存 `style-key.jpg`。
   - （若你有真人照片素材，可先請 ChatGPT 依 §1.1＋§1.2 把照片轉成乾淨立繪再當角色設定圖；但原牌組其實是**純文字從無到有生的虛構角色**，沒有用真人照片。）
2. **每張牌**：在對話中**同時上傳這兩張參考圖**，貼 `PART 3 場景` ＋ `PART 2 風格後綴`，並加一句 `keep the exact same character and the same art style as the two reference images`。
3. 每張**多生 2–4 張挑最好**（賣品要求一致，寧可多挑）。
4. ※ 每開新對話都要**重新上傳**兩張參考圖（模型不跨對話記憶臉孔）。

### §1.3 四花色母題 — 每花色符號的「長相」

場景骨架只負責「幾個、怎麼擺」；「長什麼樣」由這裡決定，組裝時注入風格後綴（見 §2.4）。各寫一句英文。

**原牌組實際用的科技母題（v3 原文，當基準範例）：**

| 參數 | 花色 | 原牌組母題原文 |
|---|---|---|
| `{{WANDS_MOTIF}}` | 權杖＝能量／算力／創造 | `wooden staffs whose cores glow from within, sprouting data-sparks and tiny compute light-motes` |
| `{{CUPS_MOTIF}}` | 聖杯＝連結／情感 | `chalices whose water carries an iridescent holographic sheen, fine ripples like a gentle data-stream` |
| `{{SWORDS_MOTIF}}` | 寶劍＝資料／思維／AI 邏輯 | `blades etched with hair-fine circuit lines that glow soft cyan along the edges` |
| `{{PENTACLES_MOTIF}}` | 錢幣＝鏈上代幣／價值 | `glowing on-chain coin-discs, each engraved with an original hexagon-and-node glyph (NOT a real logo, NOT a round plain coin)` |

**換風格範例（自然系水彩）：** 權杖＝`pale birch wands wrapped with glowing ivy`／聖杯＝`frosted ceramic tea bowls`／寶劍＝`polished obsidian blades`／錢幣＝`carved jade discs, each engraved with a crescent moon`。

> 母題原則（沿用 v3）：象徵語言要**優雅融入**塔羅既有符號，不是貼 logo、不俗氣；主體仍是該畫風的手繪塔羅，母題只當點綴。

### §1.4（選配）`{{MAJOR_EMPHASIS}}` — 大牌母題加重

原牌組挑了幾張大牌「天生契合母題」的加重處理（v3 原文，供參考；換風格時可自訂或整段留空）：

```
魔術師＝四元素全息化、∞ 化成資料環；命運之輪＝輪做成區塊鏈節點環；
女祭司＝帷幕透出全息資料光；星星＝眾星連成發光網路；世界＝發光的全球網路球體；
皇帝＝石座透出秩序網格／協定王座。其餘大牌維持神祕優雅、母題僅點綴。
```

換風格時，這裡改成「你這個母題最適合加重在哪幾張大牌、怎麼加」；沒有就留空，全大牌走純 RWS 構圖。

### §1.5（選配）全域微調

- `{{ASPECT}}`：預設 `Vertical 2:3; the figure and scene fill the frame to all edges, but leave a little calm headroom at the very top and bottom`（滿版但上下留白，給網站／印刷模板加牌名用；要別的比例才改）。
- `{{EXTRA}}`：全套想統一追加的細節（如 `small gold-leaf accents on key symbols`）；沒有就留空。

### §1.6 一次填好的範例（新風格「月夜水彩・小魔女」）

```
ART_STYLE       = a soft watercolor tarot illustration — loose wet-on-wet washes,
                  deckled paper texture, a moonlit indigo-and-silver palette, dreamy mood.
CHARACTER       = a young witch, about 17 — plum-purple hooded robe, silver crescent-moon
                  earrings, long straight black hair, gentle expression.
WANDS_MOTIF     = pale birch wands wrapped with softly glowing ivy
CUPS_MOTIF      = frosted silver goblets brimming with still moonlit water
SWORDS_MOTIF    = slender blades of pale moonlit steel
PENTACLES_MOTIF = round discs, each engraved with a crescent moon
MAJOR_EMPHASIS  = （留空，全大牌走純 RWS）
ASPECT / EXTRA  = （沿用預設 / 空）
```

→ Hermes 拿這組去套 PART 2＋PART 3，產出整套 78 張 prompt。

---

## PART 2 · 組裝規則（把參數＋骨架拼成一張 prompt）

### §2.1 兩段式結構

每張最終 prompt ＝ `[SCENE]`（取自 PART 3，每張不同）＋空格＋`[STYLE 後綴]`（全套逐字相同，花色牌多一句母題）。順序沿用 v3：**先場景、後風格後綴**。

### §2.2 風格後綴公式（把 §1 參數代入）

```
Style: {{ART_STYLE}} The single recurring protagonist across the whole deck is
{{CHARACTER}} — keep the character's face, hair and outfit exactly like the uploaded
reference. {{ASPECT}}. {{EXTRA}} IMPORTANT: ART ONLY — do NOT draw any border, frame,
card name, title, roman numeral, letters, numbers, signature, or real brand logos
(the ornate border and serif title are added separately by a uniform template).
Wholesome and tasteful; symbolic not literal for darker cards.
```

### §2.3 五條鐵律（寫進每張、不可省）

1. **ART ONLY**：畫面內不得有邊框、外框、文字、標題、羅馬數字、字母、數字、簽名、真實品牌 logo（牌名與花邊由統一模板另加，78 張才會一致）。
2. **2:3 直幅・滿版留頭尾**：直式構圖、人物場景滿到邊，但**上下各留一點 headroom** 給模板牌名／編號。
3. **角色一致**：主角靠「上傳參考圖」鎖定，後綴明講 `exactly like the uploaded reference`。
4. **`EXACTLY N` 數量鎖定**：數字牌的花色符號數量＝牌的數字，骨架已寫死鎖定語言（`clearly countable`／`evenly spaced`／`avoid tangled`／`symmetrical` 等），**不可刪**。
5. **一致性補救**：若某張畫風跑掉，把整段風格後綴再貼一次提醒模型，或重新上傳兩張參考圖。

### §2.4 花色母題注入規則

- **大牌**（`major-00`～`21`）：後綴用 §2.2 原樣。若該張在 `{{MAJOR_EMPHASIS}}` 名單內，於後綴末尾追加那張的加重描述。
- **花色牌**（wands/cups/swords/pentacles 的 `01`～`14`）：在該張後綴末尾追加一句：

  ```
  In this card, every {該花色物件} is rendered as {{對應_MOTIF}}.
  ```

  例：權杖牌 → `every staff is rendered as {{WANDS_MOTIF}}.`；錢幣牌 → `every coin-disc is rendered as {{PENTACLES_MOTIF}}.`
  （母題在每張重申一次，模型遵循度最高——這是刻意的冗餘。）

### §2.5（進階）母題深融場景

若你想要原始 v3 那種「母題長進畫面」的高融合度（而非統一後綴注入），做法：**在 PART 3 該張場景的花色物件出現處，手動把 `{{X_MOTIF}}` 的描述插進去**。原始 `tarot-ai-style.md` 的 Part D 就是這樣寫的，可直接參考它每張的融合寫法（例：錢幣十「ten coins float in the Tree-of-Life pattern, each engraved with a hexagon-and-node glyph」）。代價是換風格時要逐張改，失去純參數化的便利——**只在旗艦精修時才這樣做**。

---

## PART 3 · 78 張場景骨架（★風格中性・永不改★）

用法：取該張 `SCENE` 英文，接上組裝好的風格後綴即成完整 prompt。慣例：

- 主角一律稱 **`the protagonist`**（風格後綴會定義它是誰、長相）。
- 花色物件用**泛稱**（staff／chalice／sword／coin-disc），外觀由 §2.4 母題句決定。
- 每張附**數量自檢**＝生完你要親自數的東西。
- 神話角色（天使、骷髏騎士等）預設「由主角扮演」；要保留原型就改成主角在旁。
- 情緒最重的牌一律**象徵化、不血腥不恐怖**。

### A. 大牌 Major Arcana（22 張，無花色符號）

#### major-00 · 愚者 The Fool
數量自檢：白玫瑰×1、行囊×1、小白狗×1
SCENE: The protagonist stands carefree at the very edge of a high sunlit cliff, one foot stepping out over the drop, face turned up to a brilliant white sun. One hand holds a single white rose; a slim traveller's bundle tied to a stick rests over the shoulder; a small white dog leaps playfully at the ankles. Distant pale mountains and an open morning sky behind.

#### major-01 · 魔術師 The Magician
數量自檢：桌上四法器各×1（杖/杯/劍/幣）、無限符號∞×1
SCENE: The protagonist stands behind an altar table, one arm raised to the sky and the other pointing down to the earth ("as above, so below"). On the table lie the four suit symbols — one wand, one chalice, one sword, one coin-disc. A horizontal infinity loop floats above the head; red roses and white lilies bloom around the table's base.

#### major-02 · 女祭司 The High Priestess
數量自檢：雙柱×2、新月×1、卷軸×1
SCENE: The protagonist sits calm and upright between two tall temple pillars, one pale and one dark, a crescent moon resting at the feet and a scroll half-hidden in the lap. Behind hangs a great veil patterned with pomegranates and palms. Soft, still, lunar-blue light.

#### major-03 · 皇后 The Empress
數量自檢：心形／金星盾×1、權杖×1
SCENE: The protagonist reclines like a serene queen on a cushioned throne set in a lush golden wheat field, holding a slender sceptre; beside the throne stands a heart-shaped shield CLEARLY engraved with one large unmistakable Venus symbol ♀ (a circle above a cross). Ripe grain, blossoming roses, a flowing stream and a verdant forest behind. Warm, fertile, late-summer light.

#### major-04 · 皇帝 The Emperor
數量自檢：公羊頭飾、權杖×1
SCENE: The protagonist sits firm and composed on a heavy stone throne carved with ram's heads, an upright sceptre in one hand, barren mountains behind signalling authority and structure. Stern, steady, commanding light.

#### major-05 · 教皇 The Hierophant
數量自檢：跪拜學生×2、交叉鑰匙×2
SCENE: The protagonist sits as a teacher-figure between two stone temple pillars, one hand raised in blessing, the other resting on a staff. Two students kneel with their backs to us, looking up to receive the teaching; a pair of crossed keys lies on the floor between them. Solemn, traditional, hushed light.

#### major-06 · 戀人 The Lovers
數量自檢：人物×2（一對）＋上方天使×1、太陽×1
SCENE: Two figures stand in a green paradise garden (the protagonist as one of them) beneath a radiant winged angel who blesses them from above the clouds. Behind one figure a flowering tree, behind the other a tree wound with a serpent; a bright sun and a single mountain peak rise between them. Tender, dawn-fresh, harmonious light.

#### major-07 · 戰車 The Chariot
數量自檢：獅身獸×2（一黑一白）
SCENE: The protagonist stands tall and victorious in a stone war-chariot gripping the reins, a starry canopy arching overhead and a city wall behind. Two sphinxes — one pale, one dark — sit harnessed at the front, pulling in unison. Triumphant, forward-driving light.

#### major-08 · 力量 Strength
數量自檢：獅子×1、無限符號∞×1
SCENE: The protagonist bends gently over a great calm lion, hands resting softly on its open jaws, taming it through tenderness rather than force; the lion leans in trustingly. A horizontal infinity loop floats above the head; a garland of flowers at the waist. Soft green meadow, gentle sunlit calm.

#### major-09 · 隱者 The Hermit
數量自檢：提燈×1（內藏一星）、拐杖×1
SCENE: The protagonist stands alone on a high snowy peak at night, wrapped in a long grey hooded cloak, holding aloft a lantern whose lamp glows with a single radiant star to light the way; a tall staff steadies the other hand. Quiet, solitary starlight.

#### major-10 · 命運之輪 Wheel of Fortune
數量自檢：中央大輪×1、輪上三獸、四角活物×4
SCENE: A large recognizable medieval wheel dominates the centre of the sky, its rim inscribed with letters and the four element symbols. Atop the wheel a sphinx holds a sword; a serpent descends the left side; a jackal-headed figure rises the right. At the four corners float the four winged living creatures — an angel, an eagle, a bull and a lion — each reading a book amid clouds. The protagonist gazes up at the turning wheel of fate.

#### major-11 · 正義 Justice
數量自檢：直劍×1、天平×1
SCENE: The protagonist sits enthroned and upright between two pillars, an upraised double-edged sword balanced vertically in one hand and a set of even scales held level in the other; a veil hangs behind. Clear, exacting, impartial light.

#### major-12 · 倒吊人 The Hanged Man
數量自檢：吊繩×1、頭後光環×1
SCENE: The protagonist hangs serenely upside-down, suspended by ONE ankle from a living T-shaped wooden beam, the other leg crossed behind into a figure-four, arms folded calmly. A soft golden halo radiates around the peaceful face. CRUCIAL: both hair AND any hanging garment fall DOWNWARD toward the head, following gravity (never puffing outward). Tranquil, enlightened, a willing pause.

#### major-13 · 死神 Death
數量自檢：白馬×1、白玫瑰旗×1
SCENE: A calm armoured rider on a slow white horse advances across the land carrying a banner emblazoned with a large white five-petalled rose (the protagonist appears as the rider). A fallen king and kneeling onlookers lie before the horse; in the far distance two pale towers frame a river with a golden sunrise between them — endings giving way to a new beginning. Symbolic and dignified, never gruesome, no blood.

#### major-14 · 節制 Temperance
數量自檢：杯×2、額頭光點×1
SCENE: The protagonist stands as a winged angelic figure, one foot on dry land and one dipped in a pool, pouring water in an impossible diagonal stream BETWEEN two cups — the water arcing upward against gravity from one cup to the other. A glowing point on the forehead; irises bloom at the water's edge; a path leads to a distant sunrise between two hills. Calm, healing, harmonising light.

#### major-15 · 惡魔 The Devil
數量自檢：惡魔×1、被鬆鏈者×2
SCENE: The protagonist stands composed before a looming horned shadow-figure perched on a dark pedestal; below it two human figures stand LOOSELY chained — the loops clearly slack enough to lift off and step free at any moment. Shadowy but symbolic, not horrific; a quiet hint of escape rather than torment — breakable illusion and self-imposed limits.

#### major-16 · 高塔 The Tower
數量自檢：塔×1、閃電×1、墜落人形×2
SCENE: A tall stone tower on a dark crag is struck at its crown by a single jagged bolt of lightning, the golden crown blasting loose, stones and flames bursting from the windows. TWO human figures tumble headfirst from the top (dramatic falling silhouettes, dynamic but NOT gory, no blood). The protagonist stands at the base looking up in alarm; a thin band of dawn breaks along the horizon behind. Stylised, symbolic upheaval.

#### major-17 · 星星 The Star
數量自檢：大星×1、小星×7、水瓶×2
SCENE: The protagonist kneels gracefully at the edge of a tranquil pool under a night sky, one foot in the water and one on land, pouring water from two jugs — one onto the earth, one back into the pool. Above shine one great central star and seven smaller stars. A bird rests in a distant tree. Serene, hopeful, healing starlight.

#### major-18 · 月亮 The Moon
數量自檢：月×1、犬與狼×2、龍蝦×1、雙塔×2
SCENE: A full moon with a soft face hangs in a misty night sky dropping luminous dew, framed by two distant dark towers along a winding path; the protagonist stands on the path between them. A dog and a wolf howl up at the moon from either side; a small crayfish emerges from the still pool in the foreground. Dreamlike, silver-blue moonlight — mystery and the subconscious.

#### major-19 · 太陽 The Sun
數量自檢：人面太陽×1、白馬×1、旗×1、向日葵牆
SCENE: A huge radiant sun with a gentle face fills the sky over a wall of tall blooming sunflowers; the protagonist rides joyfully on a calm white pony in the foreground, arms open, a single banner streaming behind. Pure, exuberant, golden daylight — joy and vitality.

#### major-20 · 審判 Judgement
數量自檢：天使×1、號角×1、復甦人物（家庭群像）
SCENE: A great angel sounds a long trumpet from the clouds above; below, figures rise with arms lifted from open resting-places in answer to the call (the protagonist among them, arms raised, face turned upward in awakening). Distant snowy peaks line the horizon. Resurrective, dawn-bright light — reckoning and renewal.

#### major-21 · 世界 The World
數量自檢：橢圓桂冠×1、杖×2、四角活物×4
SCENE: The protagonist dances triumphantly at the centre of a great floating laurel-leaf wreath, a slim wand in each hand, draped in flowing cloth. At the four corners float the angel, eagle, bull and lion among clouds. Complete, integrated, celebratory light — wholeness and arrival.

### B. 權杖 Wands（14 張）— 每張後綴追加 `{{WANDS_MOTIF}}`

#### wands-01 · 權杖一 Ace of Wands
數量自檢：權杖×1（EXACTLY 1）
SCENE: A single wand is offered from a glowing cloud-hand at the centre of the frame, the protagonist standing below with one hand lifted in wonder to receive it; the wand sprouts a few fresh green leaves at its tip. A distant castle and a winding river sit small and serene on the green landscape below. EXACTLY ONE wand.

#### wands-02 · 權杖二 Two of Wands
數量自檢：權杖×2（手持1＋立牆1）
SCENE: The protagonist stands on a high castle battlement holding a small globe in gloved hands, gazing out over land and sea. ONE wand is gripped in the free hand; the SECOND wand stands fixed upright beside them, fastened to the wall. EXACTLY TWO wands, clearly countable. Planning, looking outward.

#### wands-03 · 權杖三 Three of Wands
數量自檢：權杖×3（身邊立3）
SCENE: The protagonist is seen from behind on a cliff-top, watching small ships sail a calm golden sea toward distant shores, one hand resting on a tall planted wand while two more stand upright around them. EXACTLY THREE wands, evenly spaced and countable. Foresight, awaiting returns.

#### wands-04 · 權杖四 Four of Wands
數量自檢：權杖×4（立成華蓋門柱）
SCENE: FOUR tall wands stand upright in the foreground forming a gateway, joined at the top by a lush garland of flowers and leaves; the protagonist stands beneath the floral arch with arms raised in joyful welcome. A sunlit manor and warm festive crowd behind. EXACTLY FOUR wands as the four corner-posts, countable. Celebration, homecoming.

#### wands-05 · 權杖五 Five of Wands
數量自檢：權杖×5（一人一杖，不交叉打結）
SCENE: Five lively youths (the protagonist among them) each hold EXACTLY ONE wand, raised in a spirited good-natured mock-duel — nobody angry, nobody hurt. EXACTLY FIVE WANDS TOTAL, spread apart and clearly arranged so all five are easily countable; AVOID tangled overlapping crossing. Open ground, dynamic friendly motion.

#### wands-06 · 權杖六 Six of Wands
數量自檢：權杖×6（手持1帶桂冠＋群眾5）
SCENE: The protagonist rides a calm white horse in triumphant procession, a laurel wreath crowning the head and a second small wreath ringing the tall wand held aloft; an admiring crowd walks alongside lifting FIVE more upright wands. EXACTLY SIX WANDS TOTAL, all countable and spread apart. Victory, public recognition.

#### wands-07 · 權杖七 Seven of Wands
數量自檢：權杖×7（手持1＋下方仰攻6）
SCENE: The protagonist stands on higher ground, feet planted firmly, holding ONE wand braced to defend the position, while SIX more wands rise up from below the edge, thrust toward them by unseen challengers. EXACTLY SEVEN WANDS TOTAL, all countable. Standing one's ground.

#### wands-08 · 權杖八 Eight of Wands
數量自檢：權杖×8（平行斜飛）
SCENE: EXACTLY EIGHT wands fly through open air in clean parallel lines, sweeping diagonally across the sky in swift flight, evenly spaced — count them clearly, eight, no more no less. The protagonist watches from a green hillside below. Speed, momentum, news arriving.

#### wands-09 · 權杖九 Nine of Wands
數量自檢：權杖×9（手持1＋身後左4右4）
SCENE: The protagonist leans watchfully on ONE tall wand, a light bandage around the head, weary but alert; behind, EIGHT more wands stand upright in a row like a protective fence — EXACTLY FOUR on the LEFT and FOUR on the RIGHT (symmetrical). NINE wands total, all evenly spaced and countable. Resilience, last stand.

#### wands-10 · 權杖十 Ten of Wands
數量自檢：權杖×10（頂端散開可數）
SCENE: The protagonist walks forward with determined effort, both arms wrapped around a heavy bundle of EXACTLY TEN wands gathered against the chest, bending under the load toward a small town ahead; the TOPS of the ten fan out clearly like a spread so all ten are individually countable (AVOID a tight unreadable bundle). Burden, overcommitment.

#### wands-11 · 權杖侍者 Page of Wands
數量自檢：權杖×1
SCENE: The protagonist as a curious young page stands in an open desert-bright landscape, both hands holding a single tall wand planted before them, studying its tip with bright fascination. EXACTLY ONE wand. Eager, exploratory, full of new ideas.

#### wands-12 · 權杖騎士 Knight of Wands
數量自檢：權杖×1、馬×1
SCENE: The protagonist as a daring knight charges forward on a rearing, spirited horse, leaning into the gallop with ONE wand raised high; warm open country rushes past. EXACTLY ONE wand. Bold, fiery, restless forward energy.

#### wands-13 · 權杖皇后 Queen of Wands
數量自檢：權杖×1、向日葵×1、黑貓×1
SCENE: The protagonist as a warm, confident queen sits on a sun-throne carved with lions and sunflowers, ONE tall wand held upright in one hand and a bright sunflower in the other; a small black cat sits calmly at the feet. EXACTLY ONE wand. Warmth, magnetism.

#### wands-14 · 權杖國王 King of Wands
數量自檢：權杖×1、火蜥蜴×1
SCENE: The protagonist as a commanding young king sits on a throne adorned with lions and salamanders, holding ONE tall flowering wand upright with assured authority; a small living salamander curls near the throne's base. EXACTLY ONE wand. Vision, leadership.

### C. 聖杯 Cups（14 張）— 每張後綴追加 `{{CUPS_MOTIF}}`

#### cups-01 · 聖杯一 Ace of Cups
數量自檢：聖杯×1、白鴿×1
SCENE: A single chalice floats above an open palm emerging from a soft cloud, a white dove descending to touch its beak to the rim, five gentle streams of water pouring over into a calm lily-pond below. The protagonist kneels at the pond's edge, both hands cupped to receive, face lit with quiet wonder. EXACTLY ONE cup.

#### cups-02 · 聖杯二 Two of Cups
數量自檢：聖杯×2（兩人互舉）
SCENE: The protagonist and a kindred companion stand facing each other, each lifting a chalice in a gentle toast, the two cups almost touching at the centre; between and above them hovers a caduceus emblem — twin serpents winding a winged staff. A green hillside and a small cottage far behind. EXACTLY TWO cups, countable.

#### cups-03 · 聖杯三 Three of Cups
數量自檢：聖杯×3（三人舉杯共舞）
SCENE: Three friends (the protagonist and two others) dance in a small ring, each raising a chalice high as the cups meet in a joyful clink at the centre; fruit, pumpkins and garden flowers bloom at their feet in a harvest of plenty. EXACTLY THREE cups, all raised and countable. Friendship, celebration.

#### cups-04 · 聖杯四 Four of Cups
數量自檢：聖杯×4（地上3＋雲中遞1）
SCENE: The protagonist sits beneath a broad tree, knees drawn up, arms folded, gazing at THREE cups lined up on the grass in front; from a small cloud at the side a hand offers a FOURTH cup not yet noticed. Expression thoughtful and inward, not sorrowful. EXACTLY FOUR cups, countable. Apathy, a missed offer.

#### cups-05 · 聖杯五 Five of Cups
數量自檢：聖杯×5（前傾倒3＋身後立2）
SCENE: The protagonist stands in a dark cloak, head lowered toward THREE toppled cups spilling their water into the grass; behind them TWO cups still stand upright and full. A small bridge crosses a stream toward a warm-lit town in the distance. Reflective rather than despairing. EXACTLY FIVE cups total (three fallen + two standing), countable.

#### cups-06 · 聖杯六 Six of Cups
數量自檢：聖杯×6（每杯插白色五瓣花）
SCENE: In a sunlit nostalgic courtyard, the protagonist (the older child) gently hands a chalice holding a white five-petalled flower to a smaller child. EXACTLY SIX chalices total, EACH holding one white five-petalled flower, arranged clearly (some on a low stone ledge, some on the ground), all six countable. Warm, innocent, affectionate.

#### cups-07 · 聖杯七 Seven of Cups
數量自檢：聖杯×7（雲中浮現，各盛幻象）
SCENE: The protagonist stands in silhouette before a billowing cloud, gazing up at SEVEN cups floating in the air, each holding a different vision — a wreath, a jewel, a small castle, a soft face, a coiled shape, a draped figure, a small tower. EXACTLY SEVEN cups, countable. Fantasy, illusion, tempting choices.

#### cups-08 · 聖杯八 Eight of Cups
數量自檢：聖杯×8（下排5＋上排3，上排留缺口）
SCENE: Under a serene night sky with a gentle eclipsing moon, the protagonist walks AWAY from the viewer, seen FROM BEHIND (face NOT visible), a staff in hand, climbing a quiet path toward distant hills in calm resolve. Left behind: EXACTLY EIGHT cups stacked five on the bottom row and three on top, with a clear GAP in the upper row (one cup's space empty). All eight countable. Seeking something deeper.

#### cups-09 · 聖杯九 Nine of Cups
數量自檢：聖杯×9（身後弧形排列）
SCENE: The protagonist sits contentedly with arms folded and an easy, satisfied smile on a low cloth-draped bench; behind, NINE cups are arranged in a graceful arc. EXACTLY NINE cups, evenly spaced and countable. Satisfaction, wishes fulfilled ("the wish card").

#### cups-10 · 聖杯十 Ten of Cups
數量自檢：聖杯×10（彩虹上均勻排列）
SCENE: The protagonist stands with arms open toward a radiant rainbow, TEN cups arched across the sky within its band; beside them a small family and two children join hands in joy near a cosy cottage and a winding stream. EXACTLY TEN cups, evenly spaced along the rainbow and countable. Belonging, family harmony.

#### cups-11 · 聖杯侍者 Page of Cups
數量自檢：聖杯×1、魚×1
SCENE: The protagonist stands by a gentle shoreline in a soft tunic, lifting a chalice from which a small fish playfully leaps up to meet their surprised, delighted gaze; the sea ripples softly behind. EXACTLY ONE cup. Intuition, a creative message.

#### cups-12 · 聖杯騎士 Knight of Cups
數量自檢：聖杯×1、白馬×1
SCENE: The protagonist rides a calm, slow-stepping white horse across a quiet meadow toward a winding river, holding a single chalice out before them like an offering, posture gentle and dreaming. Soft hills and a distant bridge frame the unhurried, romantic approach. EXACTLY ONE cup.

#### cups-13 · 聖杯皇后 Queen of Cups
數量自檢：聖杯×1（華蓋帶把手）
SCENE: The protagonist as queen sits on an ornate throne at the very edge of the sea, cradling an elaborate covered chalice in both hands and gazing into it with serene, loving attention; the throne is carved with shells and gentle waves, water lapping at its base. EXACTLY ONE cup. Compassion, emotional depth.

#### cups-14 · 聖杯國王 King of Cups
數量自檢：聖杯×1
SCENE: The protagonist as king sits composed on a throne that floats steady upon a turbulent, storm-tossed sea, holding a single chalice level in one hand without a tremor; waves surge and a small ship tosses in the distance, yet the cup stays perfectly calm. EXACTLY ONE cup. Emotional balance, mastery.

### D. 寶劍 Swords（14 張）— 每張後綴追加 `{{SWORDS_MOTIF}}`

#### swords-01 · 寶劍一 Ace of Swords
數量自檢：寶劍×1、王冠×1
SCENE: A single upright sword rises point-up out of swirling clouds, gripped by a hand of light emerging from the sky; a delicate gold crown wreathed in laurel and a palm floats around the tip, light beads dripping from it. The protagonist stands small below, gazing up with calm clarity. EXACTLY ONE sword.

#### swords-02 · 寶劍二 Two of Swords
數量自檢：寶劍×2（胸前交叉抱持）
SCENE: The blindfolded protagonist sits on a low stone bench, arms crossed over the chest balancing TWO equal swords against the shoulders, neither tipping; behind, a calm dark sea meets a slender crescent moon, scattered rocks breaking the water. EXACTLY TWO swords, countable. A poised stalemate.

#### swords-03 · 寶劍三 Three of Swords
數量自檢：寶劍×3（貫穿一心，象徵、不血腥）
SCENE: Centred, a single heart-shaped emblem hovers in the air, crossed by THREE thin swords — symbolic, never pierced through flesh, never bleeding. Behind it a clearing sky where grey rain is almost spent and warm light begins to break through. The protagonist stands quietly to one side, hand to chest, gazing with gentle, healing acceptance. EXACTLY THREE swords, countable. No blood, not gory.

#### swords-04 · 寶劍四 Four of Swords
數量自檢：寶劍×4（牆掛3＋身下1）
SCENE: The protagonist lies resting on a low stone tomb-like ledge, eyes softly closed in calm meditation, hands folded, fully at peace; THREE swords hang above on the wall like quiet ornaments and a FOURTH lies along the side beneath. A jewel-toned stained-glass window glows warmly behind. EXACTLY FOUR swords, countable. Rest, recovery.

#### swords-05 · 寶劍五 Five of Swords
數量自檢：寶劍×5（每把有人持或落地，絕不懸浮）
SCENE: On a windswept ridge under low broken clouds, the protagonist in the foreground gathers up scattered swords with a wry, knowing look while two defeated figures walk away across the grey shore with lowered heads. EXACTLY FIVE swords total — every sword is either HELD or RESTING on the ground; ABSOLUTELY NO swords floating in mid-air. All five countable. Hollow victory.

#### swords-06 · 寶劍六 Six of Swords
數量自檢：寶劍×6（插於船頭）
SCENE: The protagonist sits hunched and quiet in a small wooden boat being poled across calm water toward a peaceful far shore, with a shrouded companion; SIX swords stand upright in the bow like a line of markers. The water ahead is glassy and still. EXACTLY SIX swords, countable. Transition to calmer waters.

#### swords-07 · 寶劍七 Seven of Swords
數量自檢：寶劍×7（懷抱5清楚＋插地2）
SCENE: The protagonist tiptoes away from a distant cluster of festival tents at dawn, glancing back over the shoulder with a sly half-smile, carrying FIVE swords bundled in the arms (the five blades clearly separated and individually countable, NOT a blurry bundle) while TWO remain planted upright behind. EXACTLY SEVEN swords total. Cunning, quiet getaway.

#### swords-08 · 寶劍八 Eight of Swords
數量自檢：寶劍×8（左4＋右4對稱劍籠）
SCENE: The protagonist stands lightly bound with a loose cloth over the eyes, ringed by swords planted upright in the ground like a cage — EXACTLY FOUR on the LEFT and FOUR on the RIGHT (symmetrical), evenly spaced and countable, with a clear gap opening toward calm light; the bindings are visibly slack and escapable. A distant castle on a cliff. EXACTLY EIGHT swords. Self-imposed entrapment.

#### swords-09 · 寶劍九 Nine of Swords
數量自檢：寶劍×9（水平排列，全可見不被頭擋）
SCENE: Night; the protagonist sits up in bed, face buried softly in the hands. NINE swords hang on the dark wall behind, arranged HORIZONTALLY in parallel, stacked one above another — all nine fully visible and countable (none hidden behind the head). The quilt is embroidered with tiny stars; the window horizon just begins to pale toward dawn. EXACTLY NINE swords. Worry held quietly, not horror.

#### swords-10 · 寶劍十 Ten of Swords
數量自檢：寶劍×10（插地成排框住身體，非穿身、不血腥）
SCENE: The protagonist lies FACE-DOWN on the ground at the lowest point of defeat, while EXACTLY TEN swords stand planted in a neat row/arc in the EARTH along and behind the body (stuck in the GROUND framing the figure, NOT piercing the body, NO blood, not gory). Across the horizon a golden dawn rises in radiant bands. All ten countable. Rock bottom turning to rebound. Make this face-down pose unmistakably distinct from the seated Nine and the standing Eight.

#### swords-11 · 寶劍侍者 Page of Swords
數量自檢：寶劍×1
SCENE: The protagonist as a young page stands alert on a low rise, gripping ONE upright sword in both hands as a brisk wind whips the hair and ruffles the grass and clouds behind; stance watchful and quick-witted, eyes scanning the horizon. EXACTLY ONE sword. Fresh ideas, vigilance.

#### swords-12 · 寶劍騎士 Knight of Swords
數量自檢：寶劍×1、馬×1
SCENE: The protagonist as a knight charges forward at full gallop on a rushing horse, ONE sword raised high and angled ahead, cloak and hair streaming in the gale, storm-clouds and bent trees behind. EXACTLY ONE sword. Bold, swift, headlong resolve.

#### swords-13 · 寶劍皇后 Queen of Swords
數量自檢：寶劍×1（側身 3/4）
SCENE: The protagonist as queen sits in a THREE-QUARTER / SIDE profile pose on a cloud-wreathed stone throne (body turned to the side rather than fully forward), ONE sword held upright in one hand and the other lifted in a measured, discerning gesture; birds fly in the clouds above. EXACTLY ONE sword. Clarity, independent judgement.

#### swords-14 · 寶劍國王 King of Swords
數量自檢：寶劍×1
SCENE: The protagonist as sovereign sits facing forward on a high stone throne, ONE upright sword held straight and centred, posture erect and authoritative; birds in the clouds above. EXACTLY ONE sword. The calm authority of reason and impartial judgement.

### E. 錢幣 Pentacles（14 張）— 每張後綴追加 `{{PENTACLES_MOTIF}}`

#### pentacles-01 · 錢幣一 Ace of Pentacles
數量自檢：錢幣×1、拱門×1
SCENE: A hand emerges from a soft glowing cloud holding out ONE large coin-disc like a gift; below, a lush garden path leads through a flower-framed stone archway toward distant peaceful mountains, the protagonist gazing up at the offered coin with quiet wonder. EXACTLY ONE coin-disc.

#### pentacles-02 · 錢幣二 Two of Pentacles
數量自檢：錢幣×2（∞緞帶環繞）
SCENE: The protagonist dances lightly on a quay, tossing and catching TWO coin-discs that loop within a flowing figure-eight infinity ribbon; behind, the sea rises and falls in tall swelling waves where two ships ride the crests. EXACTLY TWO coin-discs, countable. Balance amid constant motion.

#### pentacles-03 · 錢幣三 Three of Pentacles
數量自檢：錢幣×3（嵌於拱頂，三角排列）
SCENE: Inside a soaring cathedral under a vaulted stone archway, the protagonist stands on a low scaffold as a craftsman, chisel in hand, presenting the work to two consulting figures holding the plans; set into the arch above, THREE coin-discs are inlaid in a triangular arrangement. EXACTLY THREE coin-discs, countable. Skilled collaboration.

#### pentacles-04 · 錢幣四 Four of Pentacles
數量自檢：錢幣×4（頭頂1＋懷抱1＋雙腳踩2）
SCENE: The protagonist sits upright before a distant city skyline, both arms wrapped tightly around ONE large coin-disc clutched to the chest, ONE balanced on the crown of the head, and ONE firmly under EACH shoe. EXACTLY FOUR coin-discs, countable. Holding on, guarded, value pinned down on every side.

#### pentacles-05 · 錢幣五 Five of Pentacles
數量自檢：錢幣×5（教堂彩窗上）、貧病者×2
SCENE: On a snowy night, TWO weary figures walk through falling snow along a path (the protagonist and a companion, one limping or leaning, wrapped against the cold), shut out past the warm stained-glass window of a church. The window shows FIVE coin-discs shining within its lattice like jewels. EXACTLY FIVE coin-discs, countable. Hardship shared, faith tested.

#### pentacles-06 · 錢幣六 Six of Pentacles
數量自檢：錢幣×6（天平＋施捨場景）
SCENE: The protagonist stands as a generous figure holding a balanced golden scale in one hand while, with the other, letting coin-discs fall gently into the cupped palms of two kneeling figures below. EXACTLY SIX coin-discs total, distributed clearly (a few about the giver, some being handed over), all countable. Giving and receiving, weighed fairly.

#### pentacles-07 · 錢幣七 Seven of Pentacles
數量自檢：錢幣×7（藤上，全露不被葉遮）
SCENE: The protagonist leans on the long handle of a hoe at the edge of a cultivated field, pausing to study a tall leafy vine heavy with SEVEN coin-discs ripened on its branches like fruit — all seven fully visible and countable, NOT hidden behind leaves. Thoughtful and patient. EXACTLY SEVEN coin-discs. The slow harvest of long effort.

#### pentacles-08 · 錢幣八 Eight of Pentacles
數量自檢：錢幣×8（牆掛7＋手上1，無多餘散堆）
SCENE: The protagonist sits absorbed at a craftsman's workbench, chisel and mallet in hand, carving a coin-disc. EXACTLY EIGHT coin-discs total — SEVEN finished ones mounted in a neat vertical row beside them, plus ONE being worked at the bench. NO extra piles or scattered discs anywhere (remove all clutter). All eight countable. Devoted, patient mastery.

#### pentacles-09 · 錢幣九 Nine of Pentacles
數量自檢：錢幣×9（藤間一側5＋一側4）、獵鷹×1
SCENE: The protagonist stands in a flourishing vineyard heavy with ripe grapes, dressed in elegant refinement, one gloved hand raised as a calm hooded falcon perches upon it; among the vines hang NINE coin-discs — FIVE on one side and FOUR on the other, all countable. A manor house behind. EXACTLY NINE coin-discs. Graceful self-sufficiency.

#### pentacles-10 · 錢幣十 Ten of Pentacles
數量自檢：錢幣×10（生命之樹分布）、家庭群像、犬×1
SCENE: Beneath a grand family archway three generations gather — an elder seated with a dog, a couple, and the protagonist as the young one — within a warm prosperous courtyard. TEN coin-discs are arranged across the whole scene in the classic Tree-of-Life pattern, all countable. EXACTLY TEN coin-discs. Legacy, family wealth, lasting security.

#### pentacles-11 · 錢幣侍者 Page of Pentacles
數量自檢：錢幣×1
SCENE: The protagonist stands in a green open meadow with gently ploughed earth and distant trees, lifting ONE large coin-disc in both hands and gazing at it with curious, studious delight, as if reading a wonderful new thing. EXACTLY ONE coin-disc. The eager beginner.

#### pentacles-12 · 錢幣騎士 Knight of Pentacles
數量自檢：錢幣×1、黑馬×1
SCENE: The protagonist as a steady knight sits on a sturdy, motionless black workhorse at the edge of a freshly ploughed field, holding ONE coin-disc out before them on an open palm, regarding it with patient resolve; the tilled rows stretch to the horizon behind. EXACTLY ONE coin-disc. Grounded, dependable, committed to the long task.

#### pentacles-13 · 錢幣皇后 Queen of Pentacles
數量自檢：錢幣×1（懷中大幣）、兔子×1
SCENE: The protagonist reigns as a serene queen upon a throne carved with leaves, fruit and small animals, set within a lush abundant garden of roses and overhanging greenery, cradling ONE large coin-disc in the lap and gazing at it tenderly; a small rabbit rests in the grass at the feet. EXACTLY ONE coin-disc. Nurturing, warmly capable abundance.

#### pentacles-14 · 錢幣國王 King of Pentacles
數量自檢：錢幣×1、公牛頭飾／葡萄藤
SCENE: The protagonist sits as a commanding king upon a grand throne entwined with grape vines and clusters of fruit, robes flowing, one hand holding a tall sceptre and ONE large coin-disc resting in the lap; a prosperous castle and full vineyard stretch behind. EXACTLY ONE coin-disc. Generous mastery, abundance ruled with steady ease.

---

## PART 4 · 給 Hermes 的操作手冊

### §4.1 輸入
使用者提供一組 PART 1 參數（`ART_STYLE` / `CHARACTER` / 四個 `*_MOTIF` /（選配）`MAJOR_EMPHASIS`、`ASPECT`、`EXTRA`）。若使用者只給模糊風格詞（如「賽博龐克」），先把它補寫成 §1.1／§1.3 那樣的完整英文句，**回報給使用者確認**後再展開全套。

### §4.2 組裝單張 prompt 的演算法
給定一張牌（slug）：
1. 取 PART 3 該 slug 的 `SCENE` 英文。
2. 組風格後綴：套 §2.2 公式，代入參數。
3. 若 slug 屬某花色，依 §2.4 在後綴末尾追加該花色 `MOTIF` 句；若在 `MAJOR_EMPHASIS` 名單，追加該張加重句。
4. 輸出 ＝ `<SCENE> <風格後綴>`（先場景、後後綴）。**確認無殘留 `{{...}}`。**

### §4.3 生圖順序建議
先鎖定風格與角色，再量產：
1. 生「角色設定圖」＋「風格 key art（建議 `major-17 星星` 或 `major-10 命運之輪`）」兩張基準。
2. 生幾張代表性大牌（如 `major-00`、`major-03`）確認角色與畫風滿意。
3. 逐花色推進：**每個花色先生 Ace（單一符號）確認 MOTIF 對了**，再生該花色數字牌，最後宮廷牌。
4. 收尾其餘大牌。

### §4.4 逐張驗數（★數字牌必做★）
每張數字牌生完，依該張「數量自檢」欄，親自數花色符號數＝牌的數字，不對就重生。
**數的方法**（沿用原牌組經驗）：從**全解析度原圖**左右高倍率裁切逐一點數（低倍率看全幅容易少算）。宮廷牌與王牌確認「只有 1 個主符號」。

### §4.5 生圖後：壓圖換檔 ＋ 更新 manifest（本站實際規格）
1. **存列印原圖**：ChatGPT 生出的高解析原圖，存 `assets/img/tarot-print/{id}.png`（規格 1024×1536 PNG；此目錄刻意保留在 git 供未來重製，見 `_config.yml`）。
2. **壓站上圖**：壓成 `assets/img/tarot/{id}.jpg`（768×1152＝原圖 75%、JPG 品質 ~85）。轉檔用 **PowerShell WIC**（專案慣例，非 python／GDI+；見 `reference_windows_image_convert` 記憶）。範例：
   ```powershell
   # 讀 tarot-print/{id}.png → 縮到寬 768、存 tarot/{id}.jpg q85（WIC）
   # 逐張處理；{id} 例：pentacles-07
   ```
   （目前 repo 無現成腳本，此步為手動逐張；若要量產可自寫一支 WIC 批次。）
3. **更新 manifest**：把該 `{id}` 字串加進 `assets/js/tarot/tarot-art-manifest.js` 的 `ART_IDS` Set（已在集合內的 78 張目前全數上線）。消費端 `tarot-card-image.js` 靠 `ART_DIR + id + '.jpg'` 取圖；不在 Set 內者回退素牌面 SVG。
4. **驗證後才 commit**：`npm test`（含 manifest／drift 檢查）→ push 前跑一次 `bundle exec jekyll build` 確認 `_site/` 該圖存在＋頁面實測。
   - 已知待補（若你重製到這幾張要留意）：`tarot-art-manifest.js` 註記 `pentacles-13/14` 為 Gemini 暫代待重生、`major-17` 星星暫為舊版待換。

### §4.6 產出格式範例（Hermes 交給使用者去貼 ChatGPT 的清單長相）
```
============================================================
【本次風格】<一句話描述> ／ 每次上傳：character-ref.jpg ＋ style-key.jpg
============================================================
〔1〕major-00 · 愚者 The Fool　數量自檢：白玫瑰1/狗1
The protagonist stands carefree at the very edge of a high sunlit cliff … （SCENE）
Style: <代入參數後的完整風格後綴> （STYLE）
────────────────────────────────
〔2〕major-03 · 皇后 The Empress　數量自檢：金星盾1
… （SCENE） … Style: … （STYLE）
（……逐張到 78）
```

---

## PART 5 · 自檢清單 & 常見翻車 → 修法

- **數字對不上**（花色符號多／少）→ 重貼含 `EXACTLY N … clearly countable` 的 SCENE，或改擺放（散開／對稱／分排）。
- **畫風跑掉** → 整段風格後綴再貼一次；或重新上傳兩張參考圖。
- **臉／服裝不一致** → 確認有上傳 `character-ref.jpg`；後綴強調 `exactly like the uploaded reference`。
- **出現邊框／文字／牌名** → 重申 `ART ONLY: no border, no frame, no text, no title, no numerals`。
- **花色母題不一致**（有的畫成別的東西）→ 確認 §2.4 母題句有加進該張、用詞一致。
- **比例跑掉／沒留頭尾** → 重申 `{{ASPECT}}`（滿版但上下留 headroom）。
- **劍／杖懸浮、捆成一團數不出來** → 加 `every sword is held or resting on the ground, none floating`／`tops fanned out, individually countable`。
- **墜落／死亡牌太血腥** → 加 `dramatic but NOT gory, no blood, symbolic`。

---

*完。三參數換風格 → 套 78 骨架 → 逐張驗數 → 壓圖換檔 → 更新 manifest。*
*基準與深融範例見同目錄 `tarot-ai-style.md`（原水手服科技母題 v3）。*
