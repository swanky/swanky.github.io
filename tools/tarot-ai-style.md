# AI 牌面美術指導 v3（ChatGPT Image 2.0）— 制服女孩 × Web3／區塊鏈／AI（ink 復古風・art-only）

「制服女孩偉特塔羅」78 張牌面的生圖總指導，**為實體販售牌組設計**。流程：先用 **Part B** 生一張「角色設定圖」＋一張「風格 key art」當基準，之後每張都 **上傳這兩張當參考** ＋ 貼「該牌場景（Part D）＋ Part C 風格後綴」。**只生「人物＋場景」**，復古花邊框與 serif 牌名由網站／印刷的**統一模板**另加——**生圖時絕對不要畫邊框、牌名或任何文字**（這樣 78 張邊框才會完全一致）。

核心原則：科技母題（區塊鏈、AI、算力）是**象徵語言**，對應到塔羅既有符號、優雅融入，**不是貼 logo、不要俗氣幣圈感**。主體仍是溫暖神祕的手繪塔羅，科技只當金色點綴。

---

## Part A — 怎麼用（ChatGPT Image 2.0）

1. **先生兩張基準**：用 Part B 生「角色設定圖」(挑一張最滿意) ＋ 一張「風格 key art」(建議先生星星或命運之輪當風格錨)。兩張都存好。
2. **每張牌**：在 ChatGPT 對話**同時上傳這兩張參考圖**，輸入 `Part D 該牌場景` ＋ 空格 ＋ `Part C 風格後綴`，並加一句 "keep the exact same girl and the same art style as the references"。
3. **每張多生 2–4 張挑最好**（賣品要求一致，寧可多挑）。
4. **尺寸**：直式 **2:3（1024×1536）**，人物場景滿到邊，但**上下各留一點留白**給模板的牌名／編號；**art only，不要畫邊框或任何文字**。
5. **存檔**：依牌 id 存 **JPG**（先壓到約 768px 寬、品質 ~85 給網站用；**印刷另存高解析原檔**）。檔名＝id：`major-00.jpg`…`major-21.jpg`、`wands-01.jpg`…`pentacles-14.jpg`（宮廷牌 11 侍者/12 騎士/13 皇后/14 國王）。id 清單見 `assets/js/tarot/tarot-deck.js`。
6. 丟一張到 `assets/img/tarot/`、在 `tarot-art-manifest.js` 加該 id，網站那張就自動換成你的圖。

---

## Part B — 角色設定圖 prompt（先生這張）

```
A character reference sheet of one wholesome Taiwanese high-school girl, about 17, gentle and bright expression — the single recurring heroine of a tarot deck. Hair: warm chestnut-brown, straight, chest-length, blunt bangs, two thin red hair ribbons; optionally a tiny gold hexagon hairpin as a subtle signature. Outfit: a navy-blue Japanese sailor school uniform (水手服) — white middy blouse, navy sailor collar trimmed with white double stripes, a red neckerchief tied at the chest, a navy pleated skirt, white knee-high socks, brown loafers. Clean, modest, editorial — not fan-service. Bold vintage ink line-art comic illustration — clean confident black outlines, flat cel-shaded coloring, aged-parchment feel, reminiscent of a modern illustrated witch-tarot deck; warm cream background. Show a front full-body view plus a face close-up. No text, no logo. Palette: gold #E5A300, sky-cyan #4fa6d5, navy #2b3a57, red #C0392B, cream #FFFDF7.
```

---

## Part C — 風格後綴 v3（ink 復古風・art only，每張牌都接在場景後面）

```
Style: a bold VINTAGE TAROT illustration in INK LINE-ART comic style — confident clean black outlines, manga/comic-influenced figures, flat cel-shaded coloring with light hatching and an aged-parchment feel; warm muted vintage palette (golden ochre, deep red, forest green, cream). Reminiscent of a modern illustrated witch-tarot deck. Render the tech / brand motifs in the SAME ink-and-flat-color style — blockchain hexagon-and-node glyphs engraved on the coins, fine etched circuit lines on blades, glowing cores drawn as line detail — NOT glossy or sci-fi. The SAME schoolgirl as the reference is the protagonist — chestnut chest-length hair with blunt bangs and red ribbons, navy sailor uniform with white-trimmed collar and red neckerchief. Palette: golden ochre, deep red #C0392B, forest green, navy #2b3a57, cream, with small gold accents. Vertical 2:3; the figure and scene FILL the frame to all edges, but leave a little calm headroom at the very top and bottom. IMPORTANT: ART ONLY — do NOT draw any border, frame, card name, title, roman numeral, letters, numbers, signature, or real brand logos (the ornate border and the serif title are added separately by a uniform template). Wholesome and tasteful; symbolic not literal for darker cards. Keep her face, hair, and uniform exactly like the reference.
```

---

## 花色母題對應（科技象徵融入哪裡）

- **錢幣 Pentacles → 鏈上代幣／價值**：每個 pentacle 圓盤畫成發光的代幣，表面刻原創六角／節點紋（非真實幣 logo），象徵價值上鏈。
- **權杖 Wands → 能量／算力／創造**：權杖芯部透出光、迸出資料火花或光粒，象徵行動力與運算能量。
- **寶劍 Swords → 資料／思維／AI 邏輯**：劍身蝕刻極細電路紋、邊緣帶藍青光，象徵思考＝資訊與判斷。
- **聖杯 Cups → 連結／情感**：杯與水帶虹彩全息光澤、細微漣漪如資料流，象徵連結時代的關係。
- **大牌挑天生契合的加重**：魔術師＝AI 創造（四元素全息化、∞ 化成資料環）；命運之輪＝區塊鏈節點環；女祭司＝全息資料帷幕；星星＝星座連成發光網路；世界＝發光的全球網路球體；皇帝＝秩序網格／協定王座。其餘維持神祕優雅、科技僅點綴。

---

## Part D — 78 張逐卡場景 prompt（v2）

> 每張只寫「該偉特牌(RWS)經典構圖、改制服女孩當主角、並自然融入該花色的科技母題」的場景本體。風格、角色、配色、框、無字交給 Part C 後綴。英文。
> （以下由 tarot-ai-prompts-*.md 合併）

# Part D — 大牌 22 張場景 prompt（v2）

> 每張只寫「該偉特牌(RWS)經典構圖、改制服女孩當主角」的場景本體。風格、角色、配色、框、無字交給 Part C 後綴。英文。
> 用法：上傳角色設定圖＋風格 key art，貼下面該牌場景 ＋ Part C 後綴。

### major-00 · 愚者 The Fool
The schoolgirl stands carefree at the very edge of a high sunlit cliff, one foot stepping out over the drop, face turned up to a brilliant white sun. She holds a single white rose in one hand and a slim traveller's bundle tied to a stick over her shoulder; a small white dog leaps playfully at her ankles. Distant pale mountains and an open sky of fresh morning light spread behind her.

### major-01 · 魔術師 The Magician
The schoolgirl stands behind an altar table with one arm raised to the sky and the other pointing down to the earth, channelling energy through herself. On the table the four suit symbols are reimagined as glowing holographic objects she has conjured — a luminous cup, a coin-disc etched with original hexagon glyphs, a blade of light, and a wand sparking with light-particles. Above her head a flowing infinity loop forms not from a hat-brim but from a streaming ring of luminous data and light. Red roses and white lilies bloom around the table's base.

### major-02 · 女祭司 The High Priestess
The schoolgirl sits calm and upright between two tall temple pillars, one pale and one dark, a crescent moon resting at her feet and a scroll half-hidden in her lap. Behind her hangs a great veil patterned with pomegranates and palms; through the fabric a very faint holographic shimmer of glowing nodes and fine sacred-geometry lines shows through, like a quiet data-curtain. Soft, still, lunar-blue light.

### major-03 · 皇后 The Empress
The schoolgirl reclines like a serene queen on a cushioned throne set in a lush golden wheat field, a small heart-shaped emblem beside her and a slender sceptre in one hand. Ripe grain, blossoming roses and a flowing stream surround her; a verdant forest rises behind. Abundant, warm, fertile late-summer light — the picture of growth and nurture.

### major-04 · 皇帝 The Emperor
The schoolgirl sits firm and composed on a heavy stone throne carved with ram's heads, a sceptre held upright in one hand, barren mountains behind her signalling authority and structure. Through the grey stone of the throne and the rock of the background a very faint geometric grid glows — an underlying lattice of order and protocol, the architecture beneath the rule. Stern, steady, commanding light.

### major-05 · 教皇 The Hierophant
The schoolgirl sits as a teacher-figure between two stone temple pillars, one hand raised in a gesture of blessing and the other resting on a staff. Two students kneel before her with their backs to us, looking up to receive the teaching; a pair of crossed keys lies on the floor between them. Solemn, traditional, hushed sanctuary light.

### major-06 · 戀人 The Lovers
Two figures stand in a green paradise garden beneath a radiant angel with outspread wings who blesses them from above the clouds; the schoolgirl stands on one side. Behind one figure a flowering tree, behind the other a tree wound with a serpent; a bright sun and a single mountain peak rise between them. Tender, dawn-fresh, harmonious light.

### major-07 · 戰車 The Chariot
The schoolgirl stands tall and victorious in a stone war-chariot, gripping its reins, a starry canopy arching over her head and a city wall behind. Two sphinxes — one pale, one dark — sit harnessed at the front of the chariot, pulling in unison through her will. Triumphant, forward-driving, determined light.

### major-08 · 力量 Strength
The schoolgirl bends gently over a great calm lion, her hands resting softly on its open jaws, taming it through tenderness rather than force; the lion leans into her trustingly. A flowing infinity loop floats above her head and a garland of flowers loops at her waist. A soft green meadow and pale mountain beyond. Gentle, courageous, sunlit.

### major-09 · 隱者 The Hermit
The schoolgirl stands alone on a high snowy peak at night, wrapped in a long grey hooded cloak, holding aloft a lantern whose lamp glows with a single radiant star of light to guide the way. A tall staff steadies her other hand. Quiet, solitary, contemplative starlight on the silent summit.

### major-10 · 命運之輪 Wheel of Fortune
A great wheel turns at the centre of the sky, but the wheel itself is reimagined as a glowing ring built from luminous network nodes and connecting lines — a turning circle of light and linked points rather than carved wood. At its four corners float the traditional living creatures — an angel, an eagle, a bull and a lion — each reading from a book amid soft clouds. The schoolgirl gazes up at the revolving ring of fate. Cosmic, fortune-turning light.

### major-11 · 正義 Justice
The schoolgirl sits enthroned and upright between two pillars, an upraised double-edged sword balanced vertically in one hand and a set of even scales held level in the other. A purple veil hangs behind her. Clear, exacting, impartial light — the image of fairness and accountability.

### major-12 · 倒吊人 The Hanged Man
The schoolgirl hangs serenely upside-down, suspended by one ankle from a living T-shaped wooden beam, her other leg crossed behind to form a figure-four, her arms folded calmly out of sight. A soft golden halo of light radiates around her peaceful face. Her expression is tranquil and enlightened, not distressed — a willing pause and a new point of view. Still, suspended, luminous calm.

### major-13 · 死神 Death
A calm armoured rider on a slow white horse advances across the land carrying a banner emblazoned with a large white five-petalled rose, symbol of renewal; the schoolgirl appears as the rider. The figures of a fallen king and kneeling onlookers lie before the horse. In the far distance two pale towers frame a river, and between them a golden sun rises at dawn — endings giving way to a new beginning. Symbolic and dignified, never gruesome.

### major-14 · 節制 Temperance
The schoolgirl stands as a winged angelic figure pouring a flowing stream of water endlessly between two cups, blending them in perfect balance, one foot resting on dry land and the other dipped into a pool of water. A path leads back to two hills crowned by a glowing crown of light, and irises bloom at the water's edge. Calm, healing, harmonising light.

### major-15 · 惡魔 The Devil
The schoolgirl stands composed before a looming horned shadow-figure perched on a dark pedestal; below it two human figures stand loosely chained, but the chains hang slack and open around their necks — the loops are clearly loose enough to lift off and step free at any moment. The mood is one of breakable illusion and self-imposed limits, shadowy but symbolic and not horrific, with a quiet hint of escape and release rather than torment.

### major-16 · 高塔 The Tower
A tall stone tower on a dark crag is struck by a single jagged bolt of lightning, its golden crown blasting loose and figures tumbling away as flames of light burst from the windows; the schoolgirl falls dramatically through the night air. Yet along the horizon behind the crumbling tower a thin band of dawn light breaks through — sudden upheaval that clears the way for new truth. Dramatic but stylised, symbolic not gory.

### major-17 · 星星 The Star
The schoolgirl kneels gracefully at the edge of a tranquil pool under a night sky, one foot in the water and one on land, pouring water from two jugs — one onto the earth, one back into the pool. Above her one great central star shines among seven smaller stars, and fine glowing threads of light link star to star into a delicate luminous network across the sky. The water's mirror-still reflection carries faint shimmering hexagon nodes. Serene, hopeful, healing starlight.

### major-18 · 月亮 The Moon
A full moon with a soft face hangs in a misty night sky, dropping luminous dew, framed by two distant dark towers along a winding path; the schoolgirl stands on the path between them. A dog and a wolf howl up at the moon from either side, and a small crayfish emerges from the still pool in the foreground. Dreamlike, uncertain, silver-blue moonlight — mystery and the subconscious, eerie yet gentle.

### major-19 · 太陽 The Sun
A huge radiant sun with gentle beams fills the sky over a wall of tall blooming sunflowers; the schoolgirl rides joyfully on a calm white pony in the foreground, arms open wide, a single banner streaming behind her. Everything is as bright and innocent as childhood. Pure, exuberant, golden daylight — joy, vitality and success.

### major-20 · 審判 Judgement
A great angel sounds a long trumpet from the clouds above, and below, figures rise with arms lifted from open resting-places in answer to the call; the schoolgirl stands among them, arms raised, face turned upward in awakening. Distant snowy peaks line the horizon. Resurrective, calling, dawn-bright light — reckoning, renewal and a higher summons.

### major-21 · 世界 The World
The schoolgirl dances triumphantly at the centre of a great floating laurel-leaf wreath, a slim wand of light in each hand, draped in flowing cloth. Inside the encircling wreath, instead of empty sky, floats a luminous globe woven from glowing longitude-and-latitude light-lines and connecting network nodes — a softly glowing world-network sphere. At the four corners float the angel, eagle, bull and lion among clouds. Complete, integrated, celebratory light — wholeness and arrival.

### wands-01 · 權杖一 Ace of Wands
A single radiant wand offered from a glowing cloud-hand at the center of the frame, the schoolgirl standing below with one hand lifted in wonder to receive it. The wand's core glows from within and sprouts fresh green leaves at its tip, scattering bright data-sparks and tiny compute light-motes into the air. A distant castle and a winding river sit on the green landscape below, small and serene.

### wands-02 · 權杖二 Two of Wands
The schoolgirl stands on a high castle battlement, holding a small glowing globe in her gloved hands as she gazes out over land and sea toward the horizon. One wand is gripped in her free hand while the second wand stands fixed and upright beside her, fastened to the wall. Both wand cores shine softly, faint compute light-veins threading up their shafts like quiet energy.

### wands-03 · 權杖三 Three of Wands
The schoolgirl seen from behind on a cliff-top, looking out over a calm golden sea where small ships sail toward distant shores. She rests one hand on a tall planted wand while two more wands stand upright around her, their glowing cores trailing faint sparks of light into the breeze. Wide open sky, a sense of patient waiting for things to arrive.

### wands-04 · 權杖四 Four of Wands
A bright celebration scene: four tall wands stand upright in the foreground forming a gateway, joined at the top by a lush garland of flowers and green leaves. The schoolgirl stands beneath the floral arch with arms raised in joyful welcome, tiny light-motes drifting from the glowing wand-tops like festive sparks. A sunlit manor and warm festive crowd glow softly in the background.

### wands-05 · 權杖五 Five of Wands
Five lively youths, the schoolgirl among them, playfully crossing and comparing their wands in the air like a spirited mock-duel — animated and good-natured, nobody angry, nobody hurt, more a burst of energetic teamwork than a fight. Each wand core glows and throws bright data-sparks where they meet, the scattered light-motes mingling overhead like crackling shared energy. Open ground, dynamic friendly motion.

### wands-06 · 權杖六 Six of Wands
The schoolgirl rides a calm white horse in triumphant procession, a laurel victory wreath crowning her head and a second small wreath ringing the tall wand she holds aloft. A warm, admiring crowd walks alongside, lifting five more upright wands around her. Every wand core glows and sheds gentle light-motes overhead, a quiet parade of celebrated energy and success.

### wands-07 · 權杖七 Seven of Wands
The schoolgirl stands on higher ground, planting her feet firmly as she holds one glowing wand braced and ready to defend her position. Six more wands rise up from below the edge, thrust toward her by unseen challengers. Her single wand flares brightest of all, its core blazing with energy and casting bright sparks, the underdog holding her stance with spirited resolve.

### wands-08 · 權杖八 Eight of Wands
Eight glowing wands fly through open air in clean parallel lines, sweeping diagonally across the sky like a swift stream of data in motion. The schoolgirl watches from a green hillside below, hair lifting in the rush of their passage. Each wand trails a ribbon of compute light-motes and fine sparks, the whole flight reading like fast-moving energy and news arriving at speed.

### wands-09 · 權杖九 Nine of Wands
The schoolgirl leans watchfully on a single tall wand, a light bandage wrapped around her head, weary but alert and unbroken. Behind her, eight more wands stand upright in a row like a protective fence or palisade. The wand cores glow steadily, faint sparks pulsing along their shafts like a low reserve of guarded energy held in readiness for one more push.

### wands-10 · 權杖十 Ten of Wands
The schoolgirl walks forward with determined effort, both arms wrapped around a heavy bundle of ten upright wands gathered against her chest, bent under the load yet pressing on toward a small town ahead. The clustered wand cores glow warmly between her arms, light-motes leaking from the bundle, the whole weight reading as accumulated responsibility and energy carried with steadfast resolve.

### wands-11 · 權杖侍者 Page of Wands
The schoolgirl as a curious young page stands in an open desert-bright landscape, both hands holding a single tall wand planted before her as she studies its glowing tip with bright fascination. The wand's core radiates light and sprouts a few fresh leaves, scattering tiny data-sparks and compute light-motes that she watches in delight. Eager, exploratory energy, full of new ideas.

### wands-12 · 權杖騎士 Knight of Wands
The schoolgirl as a daring knight charges forward on a rearing, spirited horse, leaning into the gallop with her glowing wand raised high in one hand. Her movement throws a bright trail of data-sparks and streaking light-motes behind her like a comet's tail of pure momentum. Warm open country rushes past; the whole image is bold, fiery, restless forward energy.

### wands-13 · 權杖皇后 Queen of Wands
The schoolgirl as a warm, confident queen sits on a sun-throne carved with lions and sunflowers, a single tall glowing wand held upright in one hand and a bright sunflower in the other. A small black cat sits calmly at her feet. The wand's core glows steadily and sheds gentle sparks, while soft compute light-motes drift around her like an aura of generous, radiant creative energy.

### wands-14 · 權杖國王 King of Wands
The schoolgirl as a commanding young king sits on a throne adorned with lions and salamanders, holding a tall flowering wand upright in one hand with assured authority. A small living salamander curls near the throne's base. The wand's glowing core blazes brightest of the suit, sparks and light-motes rising from its tip like channeled mastery of energy — visionary, decisive, fully in command.

### cups-01 · 聖杯一 Ace of Cups

A single glowing chalice floats above an open palm that emerges from a soft cloud, a white dove descending to touch its beak to the rim. Five gentle streams of iridescent water pour over from the cup into a calm lily-pond below, each ripple spreading like a soft data-current. The schoolgirl kneels at the pond's edge, both hands cupped to receive the falling light, her face lit with quiet wonder. Faint luminous threads link the dove, the cup, and her open hands.

### cups-02 · 聖杯二 Two of Cups

The schoolgirl and a kindred companion stand facing each other, each lifting a glowing chalice in a gentle toast, the two cups almost touching at the centre. Between and above them hovers a caduceus emblem — twin serpents winding a winged staff — rendered in delicate gold filigree. A soft luminous connecting line arcs from one cup to the other, the iridescent water inside rippling in unison. A green hillside and a small cottage rest far behind them.

### cups-03 · 聖杯三 Three of Cups

Three girls — the heroine and two friends — dance in a small ring, each raising a glowing chalice high as their cups meet in a joyful clink at the centre. Around their feet bloom fruit, pumpkins, and garden flowers in a harvest of plenty. The iridescent water in the cups catches the light, and faint glowing threads weave between the three raised chalices like a gentle circle of connection. Their laughter feels warm and unguarded.

### cups-04 · 聖杯四 Four of Cups

The schoolgirl sits beneath a broad tree, knees drawn up, arms folded, gazing down at three glowing chalices already lined up on the grass before her. From a small cloud at her side, a hand offers a fourth shimmering cup that she has not yet noticed. Her expression is thoughtful and inward, not sorrowful — a quiet pause before she looks up. The faint connecting light from the offered cup waits patiently, ready the moment she turns toward it.

### cups-05 · 聖杯五 Five of Cups

The schoolgirl stands in a dark cloak, head lowered toward three glowing chalices that have tipped over, their iridescent water spilling softly into the grass. Behind her, unseen for now, two cups still stand upright and full. A small bridge crosses a stream toward a warm-lit town in the distance. Her posture is reflective rather than despairing — a gentle ache, with the bridge and the two standing cups offering a clear way home.

### cups-06 · 聖杯六 Six of Cups

In a sunlit courtyard, the schoolgirl gently hands a glowing chalice filled with a white five-pointed flower to a smaller child, both faces soft with nostalgia and kindness. More flower-filled cups rest on a low stone ledge nearby, each blossom faintly luminous. A tender thread of light passes from her cup to the child's, like a memory shared across years. The mood is warm, safe, and quietly affectionate.

### cups-07 · 聖杯七 Seven of Cups

The schoolgirl stands in silhouette before a billowing cloud, gazing up at seven glowing chalices floating in the air, each holding a different vision — a wreath, a glimmering jewel, a small castle, a soft face, a coiled shape, a draped figure, a tiny luminous tower. The iridescent cups shimmer with possibility and illusion alike. Faint connecting threads link the seven visions in a wheel, asking her to choose which to reach for. Her hand hovers, considering.

### cups-08 · 聖杯八 Eight of Cups

Under a serene night sky with a gentle eclipsing moon, the schoolgirl walks away from eight glowing chalices arranged in a neat stack behind her, a walking staff in hand, climbing a quiet path toward distant hills. She does not look back in grief but in calm resolve, choosing to seek something deeper. The cups still glow softly, their connecting threads loosening as she goes. The journey ahead feels peaceful and self-chosen, not a loss.

### cups-09 · 聖杯九 Nine of Cups

The schoolgirl sits contentedly with arms folded and a satisfied, easy smile, on a low bench draped in soft cloth. Behind her, nine glowing chalices are arranged in a graceful arc, each catching an iridescent shimmer of light. Faint luminous threads connect the nine cups in a gentle curve framing her like a halo of fulfilment. The mood is cosy, abundant, and quietly proud — a wish granted.

### cups-10 · 聖杯十 Ten of Cups

The schoolgirl stands with arms open toward a radiant rainbow, ten glowing chalices arched across the sky within its band, their iridescent light spilling warmth over the scene. Beside her, a small family and two children join hands in joy near a cosy cottage and a winding stream. Soft connecting threads link every cup along the rainbow into one luminous arc of harmony. The whole scene glows with belonging and gentle peace.

### cups-11 · 聖杯侍者 Page of Cups

The schoolgirl stands by a gentle shoreline in a soft tunic, lifting a glowing chalice from which a small iridescent fish playfully leaps up to meet her surprised, delighted gaze. Tiny droplets sparkle around the fish like scattered points of light. A faint luminous thread arcs between her eyes and the fish, a moment of whimsical connection. The sea behind her ripples softly, and her expression is curious and tender.

### cups-12 · 聖杯騎士 Knight of Cups

The schoolgirl rides a calm, slow-stepping white horse across a quiet meadow toward a winding river, holding a single glowing chalice out before her like an offering. Her posture is gentle and dreaming, the iridescent water in the cup perfectly still. A faint connecting thread of light trails from the chalice toward the river ahead, as if drawn by feeling. Soft hills and a distant bridge frame her unhurried, romantic approach.

### cups-13 · 聖杯皇后 Queen of Cups

The schoolgirl sits on an ornate throne at the very edge of the sea, cradling an elaborate covered chalice in both hands and gazing into it with serene, loving attention. The throne is carved with shells and gentle waves, and the iridescent water laps softly around its base. Faint luminous threads ripple from the cup across the water like an aura of empathy. She is calm, intuitive, and deeply tender — the still heart of the suit.

### cups-14 · 聖杯國王 King of Cups

The schoolgirl sits composed on a throne that floats steady upon a turbulent, storm-tossed sea, holding a single glowing chalice in one hand without a tremor. Waves surge around her and a small ship tosses in the distance, yet her cup stays perfectly level and calm. A faint luminous thread steadies the chalice like an anchor of feeling held in mastery. Her expression is serene and unshaken — emotional strength immovable as stone.

## 寶劍 Swords — Part D 場景 prompt（v2）

> 寶劍科技母題＝資料／思維／AI 邏輯：劍身蝕刻極細的電路紋、邊緣帶柔和藍青光，象徵思考＝資訊與判斷；抽象優雅、不科幻、不用 logo。
> 每張只寫 RWS 經典構圖＋制服女孩主角＋寶劍資料母題的場景本體；風格、角色、配色、框、無字交給 Part C 後綴。情緒最重的牌一律象徵化，不血腥不恐怖。

### swords-01 · 寶劍一 Ace of Swords
A single luminous sword rises point-up out of swirling clouds, gripped by a hand of light emerging from the sky; its blade is etched with hair-fine circuitry that glows soft cyan along the edges, the clearest single thought made visible. A delicate gold crown wreathed in laurel floats around the tip, light beads dripping from it. The schoolgirl stands small below, gazing up at the blade with calm clarity as a breath of cool wind lifts her hair.

### swords-02 · 寶劍二 Two of Swords
The blindfolded schoolgirl sits on a low stone bench, arms crossed over her chest, balancing two equal swords whose circuit-etched blades each glow a faint blue-cyan — neither tipping. Behind her a calm dark sea meets a slender crescent moon, scattered rocks breaking the water. Her posture is poised and still, a stalemate held in perfect, quiet equilibrium.

### swords-03 · 寶劍三 Three of Swords
Centered, a single heart-shaped emblem of soft light hovers in the air, crossed by three thin luminous swords whose circuit edges trace pale streaks across it — symbolic, never pierced, never bleeding. Behind it a clearing sky: grey rain is almost spent and warm light begins to break through. The schoolgirl stands quietly to one side, hand to her chest, gazing at the emblem with gentle, healing acceptance rather than anguish.

### swords-04 · 寶劍四 Four of Swords
The schoolgirl lies resting on a low stone tomb-like ledge, eyes softly closed in calm meditation, hands folded, fully at peace. Three swords hang above her on the wall like quiet ornaments, their circuit-etched blades dimmed to a low cyan rest-glow; a fourth lies beneath her. A jewel-toned stained-glass window glows warmly behind, casting coloured light over the still, recuperative scene.

### swords-05 · 寶劍五 Five of Swords
On a windswept ridge under low broken clouds, a figure gathers up scattered swords with a wry, knowing look, their circuit edges flickering cold cyan. In the distance two others walk away across the grey shore, heads lowered. The schoolgirl is among the scene — the air carries the quiet ache of hollow victory, of winning at a cost.

### swords-06 · 寶劍六 Six of Swords
The schoolgirl sits hunched and quiet in a small wooden boat being poled across calm water toward a peaceful far shore. Six swords stand upright in the bow, their circuit-etched blades glowing a soft, steady cyan like a line of guiding lights. The water ahead is glassy and still — a gentle passage out of rough water into calmer thought.

### swords-07 · 寶劍七 Seven of Swords
The schoolgirl tiptoes away from a distant cluster of festival tents at dawn, glancing back over her shoulder with a sly, clever half-smile, carrying five circuit-etched swords bundled awkwardly in her arms while two remain planted behind. Their blades give a faint cyan shimmer in the half-light — a scene of cunning, strategy, and quiet getaway.

### swords-08 · 寶劍八 Eight of Swords
The schoolgirl stands lightly bound, a loose cloth over her eyes, ringed by eight swords planted upright in the ground — yet the bindings are visibly slack and the ring of blades has a clear gap opening toward calm light. Their circuit edges glow a gentle cyan. The trap is one she could step free of; the mood is hesitant confinement that already holds its own escape.

### swords-09 · 寶劍九 Nine of Swords
The schoolgirl sits up in bed at night, face buried softly in her hands. Nine swords hang on the dark wall behind her like still, flat shadows — circuit-etched blades dimmed to a faint cyan, present but never menacing. Her quilt is embroidered with tiny gold stars and constellation lines, and at the window the horizon is just beginning to pale toward dawn. Symbolic and tender, the weight of worry held quietly, not horror.

### swords-10 · 寶劍十 Ten of Swords
The schoolgirl lies face-down on the ground at the lowest point, ten circuit-etched swords standing in a neat row along her back — symbolic and bloodless, a burden laid down rather than a wound. But across the horizon a golden dawn is rising in radiant bands, light spilling toward her. The mood is rock-bottom turning to rebound: the worst is over and morning is coming.

### swords-11 · 寶劍侍者 Page of Swords
The young schoolgirl page stands alert on a low rise, gripping an upright sword in both hands as a brisk wind whips her hair and ruffles the grass and clouds behind her. The circuit-etched blade glows keen cyan along its edge, ready and curious. Her stance is watchful and quick-witted, eyes scanning the horizon — fresh ideas and mental vigilance.

### swords-12 · 寶劍騎士 Knight of Swords
The schoolgirl knight charges forward at full gallop on a rushing horse, sword raised high and angled ahead, cloak and hair streaming in the gale, storm-clouds and bent trees behind. The circuit-etched blade trails a sharp cyan light like a streak of pure intent. Everything drives in one decisive direction — bold, swift, headlong resolve.

### swords-13 · 寶劍皇后 Queen of Swords
The schoolgirl as queen sits in profile on a cloud-wreathed stone throne, a single sword held upright in one hand, the other lifted in a measured, discerning gesture. The circuit-etched blade glows clear, cool cyan beside her. Her expression is composed, perceptive, and honest — clarity, independent judgement, and unclouded truth.

### swords-14 · 寶劍國王 King of Swords
The schoolgirl as sovereign sits facing forward on a high stone throne, an upright sword held straight and centered in one hand, posture erect and authoritative. The circuit-etched blade glows steady cyan along its spine. Her gaze is direct, fair, and intellectually commanding — the calm authority of reason, ethics, and impartial judgement.

### pentacles-01 · 錢幣一 Ace of Pentacles
A single radiant hand emerges from a soft glowing cloud, holding out one large luminous on-chain coin like a gift. The coin's surface is engraved with an original abstract pattern of interlocking hexagons and glowing nodes joined by fine connecting lines, a faint five-pointed star fused into the geometry — value being minted onto the chain. Below, a lush garden path leads through a flower-framed stone archway toward distant peaceful mountains, the schoolgirl gazing up at the offered coin with quiet wonder.

### pentacles-02 · 錢幣二 Two of Pentacles
The schoolgirl dances lightly on a quay, tossing and catching two glowing on-chain coins that loop within a flowing figure-eight infinity ribbon of golden light. Each coin is engraved with its own original hexagon-and-node lattice. Behind her the sea rises and falls in tall swelling waves where two ships ride the crests, rising and sinking — a playful image of keeping value in balance amid constant motion.

### pentacles-03 · 錢幣三 Three of Pentacles
Inside a soaring cathedral, under a vaulted stone archway, the schoolgirl stands on a low wooden scaffold as a craftsman, chisel in hand, presenting her work to two consulting figures who hold the plans. Set into the arch above them, three glowing on-chain coins are inlaid in a triangular arrangement, each engraved with an original hexagon-and-node motif — skilled collaboration building something lasting together.

### pentacles-04 · 錢幣四 Four of Pentacles
The schoolgirl sits upright on a low stool before a distant city skyline, both arms wrapped tightly around one large glowing on-chain coin clutched to her chest. One more coin balances on the crown of her head and one rests firmly under each shoe, each engraved with the same original hexagon-and-node glyph — holding on, guarded and still, value pinned down on every side.

### pentacles-05 · 錢幣五 Five of Pentacles
On a snowy night the schoolgirl and a companion walk through falling snow, a little weary but moving steadily forward along a clear path. Beside them glows the warm stained-glass window of a church, five on-chain coins shining within its lattice like jewels — each engraved with original hexagon-and-node patterns. Their faces turn toward the light ahead: hardship for now, but shelter and warmth lie just along the road.

### pentacles-06 · 錢幣六 Six of Pentacles
The schoolgirl stands as a generous figure holding a balanced golden scale in one hand, while with the other she lets glowing on-chain coins fall gently into the cupped palms of two kneeling figures below. Each coin is engraved with an original hexagon-and-node motif and trails a thread of light as it passes — the open-handed flow of giving and receiving, weighed out fairly.

### pentacles-07 · 錢幣七 Seven of Pentacles
The schoolgirl leans on the long handle of a hoe at the edge of a cultivated field, pausing to study a tall leafy vine heavy with seven glowing on-chain coins that have ripened on its branches like fruit. Each coin is engraved with an original hexagon-and-node pattern. Her expression is thoughtful and patient — surveying the slow harvest of long effort, weighing what has grown.

### pentacles-08 · 錢幣八 Eight of Pentacles
The schoolgirl sits absorbed at a craftsman's workbench, chisel and mallet in hand, carving on-chain coins one by one. Finished coins are mounted in a neat vertical row beside her and one more is fixed on the bench under her tools, each freshly engraved with an original hexagon-and-node glyph glowing as it is completed — devoted, patient mastery, refining the craft coin by coin.

### pentacles-09 · 錢幣九 Nine of Pentacles
The schoolgirl stands in a flourishing vineyard heavy with ripe grapes, dressed in elegant refinement, one gloved hand raised and stilled as a calm hooded falcon perches upon it. Among the vines, glowing on-chain coins hang ripened beside the fruit, each engraved with an original hexagon-and-node motif — graceful self-sufficiency, the quiet pride of a garden grown by her own hand.

### pentacles-10 · 錢幣十 Ten of Pentacles
Beneath a grand family archway three generations gather — an elder seated with two dogs, a couple, and the schoolgirl as the young one — within a warm prosperous courtyard. Ten glowing on-chain coins float arranged in the pattern of the Tree of Life across the whole scene, each engraved with an original hexagon-and-node glyph — legacy and abundance, value passed down and woven through the household.

### pentacles-11 · 錢幣侍者 Page of Pentacles
The schoolgirl stands in a green open meadow with gently ploughed earth and distant trees, lifting one large glowing on-chain coin in both hands and gazing at it with curious, studious delight, as if reading a new and wonderful thing. The coin hovers just above her fingertips, engraved with an original hexagon-and-node lattice that glows under her attention — the eager beginner, full of wonder for what she is learning.

### pentacles-12 · 錢幣騎士 Knight of Pentacles
A steady knight on a sturdy black workhorse stands quietly at the edge of a freshly ploughed field, the horse calm and unmoving. The schoolgirl as the rider holds one glowing on-chain coin out before her in an open palm, regarding it with patient resolve. The coin is engraved with an original hexagon-and-node motif. Behind, the tilled rows stretch to the horizon — grounded, dependable, in no hurry, committed to the long task.

### pentacles-13 · 錢幣皇后 Queen of Pentacles
The schoolgirl reigns as a serene queen upon a throne carved with leaves, fruit and small animals, set within a lush abundant garden of roses and overhanging greenery. She cradles one large glowing on-chain coin in her lap, gazing down at it tenderly, while a small rabbit rests in the grass at her feet. The coin is engraved with an original hexagon-and-node glyph — nurturing, fertile, warmly capable abundance.

### pentacles-14 · 錢幣國王 King of Pentacles
The schoolgirl sits as a commanding king upon a grand throne entwined with grape vines and clusters of fruit, robes flowing, one foot resting on a carved stone ornament. In one hand she holds a tall sceptre and in her lap rests one large glowing on-chain coin, engraved with an original hexagon-and-node motif. A prosperous castle and full vineyard stretch behind her — generous mastery, abundance ruled with steady, accomplished ease.
