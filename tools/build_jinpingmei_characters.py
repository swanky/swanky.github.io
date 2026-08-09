"""金瓶梅角色卡 -> _jinpingmei_characters collection 轉換器（v2）

來源（唯讀）：
  C:\\cc_home\\novel-characters-lab\\jinpingmei-full\\data\\catalog\\visual-authority-cast\\v001\\cards\\*.json
  （19 個角色卡；card 檔名 -> 站上 slug 對照見 CARD_SLUG）
  同目錄 v001\\images\\{中文名}-turnaround.png 的 PNG IHDR，取得三視圖實際尺寸
  （bytes 16-20 寬、20-24 高，big-endian；轉檔不改尺寸所以可信）

2026-08-09 v2：改吃 visual-authority-cast v001 JSON、十九人整編
（原 v1 讀 金瓶梅詞話-主要角色-cast.md ＋ live-action-five 真人 cast.md 兩份 Markdown、僅十一人，已棄用）。

用法：python -X utf8 tools/build_jinpingmei_characters.py
"""
import json
import struct
from pathlib import Path

LAB = Path(r"C:\cc_home\novel-characters-lab\jinpingmei-full")
CARDS_DIR = LAB / "data" / "catalog" / "visual-authority-cast" / "v001" / "cards"
IMAGES_DIR = LAB / "data" / "catalog" / "visual-authority-cast" / "v001" / "images"
DST = Path(__file__).resolve().parent.parent / "_jinpingmei_characters"

# 兩個站上會混用、外觀相似但不同碼位的分隔點：逐字保留既有規範，避免手打誤植。
MDOT = "\u00b7"   # MIDDLE DOT，tagline 用「 · 」（前後帶空格）
KDOT = "\u30fb"   # KATAKANA MIDDLE DOT，視覺版本圖說用「・」（無空格）

# card 檔名（不含副檔名）→ 站上 slug（逐字對照派工單）
CARD_SLUG = {
    "01-pan-jinlian": "panjinlian",
    "02-li-pinger": "lipinger",
    "03-wu-yueniang": "wuyueniang",
    "04-pang-chunmei": "chunmei",
    "05-song-huilian": "songhuilian",
    "06-ximenqing": "ximenqing",
    "07-meng-yulou": "mengyulou",
    "08-li-jiaoer": "lijiaoer",
    "09-chen-jingji": "chenjingji",
    "10-ying-bojue": "yingbojue",
    "11-sun-xuee": "sunxuee",
    "12-wang-po": "wangpo",
    "13-wu-zhi": "wuzhi",
    "14-hua-zixu": "huazixu",
    "15-han-aijie": "hanaijie",
    "16-zhou-xiu": "zhouxiu",
    "17-wu-song": "wusong",
    "18-wang-liuer": "wangliuer",
    "19-pu-jing": "pujing",
}

# slug → 名冊順位（逐字對照派工單）
ORDER = {
    "ximenqing": 1, "wuyueniang": 2, "lipinger": 3, "panjinlian": 4, "yingbojue": 5,
    "chenjingji": 6, "mengyulou": 7, "chunmei": 8, "lijiaoer": 9, "sunxuee": 10,
    "songhuilian": 11, "wangpo": 12, "wuzhi": 13, "huazixu": 14, "hanaijie": 15,
    "zhouxiu": 16, "wusong": 17, "wangliuer": 18, "pujing": 19,
}

# 戰棋遊戲《金瓶異夢：十二花界》標準版／成熟版立繪的五名核心女性
LIVE_WOMEN = {"panjinlian", "lipinger", "wuyueniang", "chunmei", "songhuilian"}
# 舊主要角色批次（原 Top10）留下的「動畫風三視圖」——換擬真母版後仍留於視覺版本區作對照
CARTOON_TURNAROUND = {
    "ximenqing", "wuyueniang", "lipinger", "panjinlian", "yingbojue",
    "chenjingji", "mengyulou", "chunmei", "lijiaoer", "sunxuee",
}

IMPORTANCE_ZH = {"protagonist": "主角", "major": "要角"}

_ZH_DIGITS = "零一二三四五六七八九"


def esc(t: str) -> str:
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def zh_num(n: int) -> str:
    """1-100 中文數字，與 _jinpingmei/*.html 回目「第X回」用字一致（十一、二十、一百…）。"""
    if not 1 <= n <= 100:
        raise ValueError(f"zh_num 只支援 1-100：{n}")
    if n == 100:
        return "一百"
    tens, ones = divmod(n, 10)
    if tens == 0:
        return _ZH_DIGITS[ones]
    s = "十" if tens == 1 else _ZH_DIGITS[tens] + "十"
    if ones:
        s += _ZH_DIGITS[ones]
    return s


def read_png_dims(path: Path):
    with open(path, "rb") as f:
        head = f.read(24)
    if head[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"不是合法 PNG：{path}")
    w, h = struct.unpack(">II", head[16:24])
    return w, h


def get_aliases(card: dict) -> str:
    raw = card.get("displayAliases") or card.get("aliases") or []
    raw = [a for a in raw if a != card["name"]]
    return "\u3001".join(raw)


def get_tagline(card: dict) -> str:
    prefix = IMPORTANCE_ZH[card["importance"]]
    return f"{prefix} {MDOT} {card['oneLiner']}"


def chapter_links(chapters) -> str:
    return "\u3001".join(
        f'<a href="{{{{ \'/jinpingmei/text/{c:03d}/\' | relative_url }}}}">第{zh_num(c)}回</a>'
        for c in chapters
    )


def visual_versions_intro(slug: str) -> str:
    has_game = slug in LIVE_WOMEN
    has_cartoon = slug in CARTOON_TURNAROUND
    if has_game and has_cartoon:
        return (
            "同一個角色的其他視覺路線：擬真攝影風選角母版、戰棋遊戲《金瓶異夢：十二花界》的兩版立繪，"
            "以及早期的動畫風三視圖。以下全部為 AI 生成影像，並非真人照片。"
        )
    if has_game:
        return (
            "同一個角色的其他視覺路線：擬真攝影風選角母版、戰棋遊戲《金瓶異夢：十二花界》的兩版立繪。"
            "以下全部為 AI 生成影像，並非真人照片。"
        )
    if has_cartoon:
        return (
            "同一個角色的其他視覺路線：擬真攝影風選角母版，以及早期的動畫風三視圖。"
            "以下全部為 AI 生成影像，並非真人照片。"
        )
    return "同一個角色的另一份視覺材料：擬真攝影風的選角母版。以下全部為 AI 生成影像，並非真人照片。"


def render_body(card: dict, slug: str) -> str:
    name = card["name"]
    persona = card["persona"]
    image = card["image"]
    voice = card["voice"]
    parts = []

    parts.append('<section class="jpm-section" style="padding-top:0">')
    parts.append('<dl class="jpm-fields">')
    if persona.get("gender"):
        parts.append(f"<div><dt>性別</dt><dd>{esc(persona['gender'])}</dd></div>")
    if persona.get("ageRange"):
        parts.append(f"<div><dt>年齡</dt><dd>{esc(persona['ageRange'])}</dd></div>")
    if persona.get("identity"):
        parts.append(f"<div><dt>身份</dt><dd>{esc(persona['identity'])}</dd></div>")
    if persona.get("personality"):
        parts.append(f"<div><dt>性格</dt><dd>{esc(' / '.join(persona['personality']))}</dd></div>")
    parts.append("</dl>")
    parts.append('<div class="jpm-prose">')
    for zh, key in (("外貌", "appearance"), ("性情", "temperament"), ("動機", "motivation"), ("人物弧光", "arc")):
        if persona.get(key):
            parts.append(f"<h2>{zh}</h2><p>{esc(persona[key])}</p>")
    parts.append("</div></section>")

    rels = persona.get("relationships") or []
    if rels:
        parts.append(
            '<section class="jpm-section" style="padding-top:0"><div class="jpm-prose">'
            '<h2>人物關係</h2></div><ul class="jpm-rel-list">'
        )
        for r in rels:
            parts.append(f"<li><b>{esc(r['name'])}</b><span>{esc(r['relation'])}</span></li>")
        parts.append("</ul></section>")

    evidence = persona.get("evidence") or []
    if evidence:
        loc_map = {loc["quote"].strip(): loc["chapters"] for loc in (card.get("evidenceLocations") or [])}
        parts.append(
            '<section class="jpm-section" style="padding-top:0"><div class="jpm-prose"><h2>原文依據</h2>'
            "<p>以下逐字引自《金瓶梅詞話》（萬曆本）原典，是這份角色側寫的文本根據。</p></div>"
            '<ul class="jpm-quotes">'
        )
        for q in evidence:
            chapters = loc_map.get(q.strip())
            if chapters:
                parts.append(f'<li>{esc(q)}<span class="src">（{chapter_links(chapters)}）</span></li>')
            else:
                parts.append(f"<li>{esc(q)}</li>")
        parts.append("</ul></section>")

    intro = visual_versions_intro(slug)
    parts.append(
        '<section class="jpm-section" style="padding-top:0"><div class="jpm-prose"><h2>視覺版本</h2>'
        f"<p>{intro}</p></div>"
        '<div class="jpm-versions">'
    )
    vfigs = [(
        f"/assets/img/jinpingmei/live-action/{slug}-master.jpg",
        f"{name}選角母版（AI 擬真攝影風，非真人照片）",
        f"選角母版{KDOT}AI 擬真攝影風",
    )]
    if slug in LIVE_WOMEN:
        vfigs.append((
            f"/assets/img/jinpingmei/figures/{slug}-standard.jpg",
            f"{name}《金瓶異夢》標準版立繪",
            "《金瓶異夢》標準版立繪",
        ))
        vfigs.append((
            f"/assets/img/jinpingmei/figures/{slug}-sensual.jpg",
            f"{name}《金瓶異夢》成熟版立繪",
            "《金瓶異夢》成熟版立繪",
        ))
    if slug in CARTOON_TURNAROUND:
        vfigs.append((
            f"/assets/img/jinpingmei/turnaround/{slug}.jpg",
            f"{name}動畫風三視圖",
            f"原典研究{KDOT}動畫風三視圖",
        ))
    # 與頁首三視圖同一個 data-gallery，lightbox 內可上下張串看整套視覺
    for vsrc, valt, vcap in vfigs:
        vhref = f"{{{{ '{vsrc}' | relative_url }}}}"
        parts.append(
            f'<figure><a href="{vhref}" class="jpm-zoom" data-gallery="jpm-character" title="{valt}">'
            f'<img src="{vhref}" alt="{valt}" loading="lazy"></a>'
            f"<figcaption>{vcap}</figcaption></figure>"
        )
    parts.append("</div></section>")

    parts.append(
        '<section class="jpm-section" style="padding-top:0"><div class="jpm-prose"><h2>AI 選角檔案</h2>'
        "<p>虛擬劇組的工作底稿：把原典證據翻譯成給 AI 的設定指令，再由指令生成上方的角色視覺與聲音方向。"
        "完整方法見<a href=\"{{ '/jinpingmei/studio/' | relative_url }}\">影像工作室</a>。</p></div>"
    )
    parts.append('<details class="jpm-details"><summary>形象設定指令（給圖像模型）</summary><div class="inner">')
    if image.get("style"):
        parts.append(f'<span class="lbl">風格</span><p>{esc(image["style"])}</p>')
    if image.get("promptZh"):
        parts.append(f'<span class="lbl">設定描述（中文）</span><p>{esc(image["promptZh"])}</p>')
    if image.get("prompt"):
        parts.append(f'<span class="lbl">設定描述（英文原稿）</span><pre>{esc(image["prompt"])}</pre>')
    if image.get("negativePrompt"):
        parts.append(f'<span class="lbl">排除條件（negative prompt）</span><pre>{esc(image["negativePrompt"])}</pre>')
    if image.get("turnaround"):
        parts.append(f'<span class="lbl">三視圖指令</span><pre>{esc(image["turnaround"])}</pre>')
    parts.append("</div></details>")

    parts.append('<details class="jpm-details"><summary>聲音設定（給語音模型）</summary><div class="inner">')
    voice_bits = [
        f"<strong>{zh}</strong>：{esc(voice[key])}"
        for zh, key in (
            ("音色", "timbre"), ("音高", "pitch"), ("語速", "pace"),
            ("口音", "accent"), ("情緒", "emotion"), ("類比", "referenceHint"),
        )
        if voice.get(key)
    ]
    if voice_bits:
        parts.append("<p>" + "；".join(voice_bits) + "</p>")
    if voice.get("promptZh"):
        parts.append(f'<span class="lbl">聲音描述（中文）</span><p>{esc(voice["promptZh"])}</p>')
    if voice.get("prompt"):
        parts.append(f'<span class="lbl">聲音描述（英文原稿）</span><pre>{esc(voice["prompt"])}</pre>')
    parts.append("</div></details></section>")

    return "\n".join(parts)


def render_front_matter(card: dict, slug: str) -> str:
    name = card["name"]
    tw, th = read_png_dims(IMAGES_DIR / f"{name}-turnaround.png")
    fm = [
        "---",
        "layout: jinpingmei-character",
        f'name: "{name}"',
        f'aliases: "{get_aliases(card)}"',
        f'tagline: "{get_tagline(card)}"',
        f"order: {ORDER[slug]}",
        f'turnaround: "/assets/img/jinpingmei/turnaround-live/{slug}.jpg"',
        f"turnaround_w: {tw}",
        f"turnaround_h: {th}",
        'turnaround_caption: "三視圖角色設定\u30fbAI 擬真攝影風（非真人照片）\u30fb以原典描寫為依據"',
        f"permalink: /jinpingmei/characters/{slug}/",
        f'title: "{name}｜金瓶梅角色研究"',
        (
            f'description: "金瓶梅角色研究：{name}\u2014\u2014AI 虛擬劇組整理的人物側寫、原文依據、'
            '三視圖設定與聲音方向，皆以《金瓶梅詞話》原典為本。"'
        ),
        "---",
    ]
    return "\n".join(fm)


def render(card: dict, slug: str) -> str:
    return render_front_matter(card, slug) + "\n" + render_body(card, slug) + "\n"


def main():
    paths = sorted(CARDS_DIR.glob("*.json"))
    assert len(paths) == 19, f"預期 19 個 cards，實得 {len(paths)}"
    unknown = [p.stem for p in paths if p.stem not in CARD_SLUG]
    assert not unknown, f"CARD_SLUG 未涵蓋的檔名：{unknown}"

    DST.mkdir(exist_ok=True)
    written = []
    for path in paths:
        slug = CARD_SLUG[path.stem]
        card = json.loads(path.read_text(encoding="utf-8-sig"))
        (DST / f"{slug}.html").write_text(render(card, slug), encoding="utf-8")
        written.append(slug)
        ev = card["persona"].get("evidence") or []
        loc = {l["quote"].strip() for l in (card.get("evidenceLocations") or [])}
        linked = sum(1 for q in ev if q.strip() in loc)
        print(f"{slug}\torder={ORDER[slug]}\t({card['name']}) 關係{len(card['persona'].get('relationships') or [])} 引文{len(ev)} 連結{linked}")

    assert len(written) == 19
    print(f"done: {len(written)} 位")


if __name__ == "__main__":
    main()
