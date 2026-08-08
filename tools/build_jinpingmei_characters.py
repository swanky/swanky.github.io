# 金瓶梅角色卡 → _jinpingmei_characters collection 轉換器
# 來源：novel-characters-lab 的 cast.md（機器特定路徑，一次性匯入工具）
# 用法：python -X utf8 tools/build_jinpingmei_characters.py
import re
import sys
from pathlib import Path

SRC = Path(r"C:\cc_home\novel-characters-lab\jinpingmei-full\金瓶梅詞話-主要角色-cast.md")
DST = Path(__file__).resolve().parent.parent / "_jinpingmei_characters"

SLUGS = {
    "西門慶": "ximenqing", "吳月娘": "wuyueniang", "李瓶兒": "lipinger",
    "潘金蓮": "panjinlian", "應伯爵": "yingbojue", "陳經濟": "chenjingji",
    "孟玉樓": "mengyulou", "春梅": "chunmei", "孫雪娥": "sunxuee", "李嬌兒": "lijiaoer",
}
# 遊戲版視覺齊備的四位（宋惠蓮不在 Top10 角色卡內，其視覺放影像工作室頁）
GAME_VERSION = {"panjinlian", "lipinger", "wuyueniang", "chunmei"}
FIELD_LABELS = {"性别": "性別", "年龄": "年齡", "身份": "身份", "性格": "性格"}
PROSE_LABELS = {"外貌": "外貌", "性情": "性情", "动机": "動機", "人物弧光": "人物弧光"}
VOICE_LABELS = {"音色": "音色", "音高": "音高", "语速": "語速", "口音": "口音", "情绪": "情緒", "类比": "類比"}


def esc(t: str) -> str:
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def parse_character(block: str):
    lines = block.splitlines()
    m = re.match(r"^([^（\s]+)（([^）]+)）", lines[0])
    if not m:
        sys.exit(f"角色標題解析失敗：{lines[0]!r}")
    name, aliases = m.group(1), m.group(2)
    tagline = ""
    for ln in lines[1:8]:
        if ln.startswith("> "):
            tagline = re.sub(r"^>\s*", "", ln).strip()
            break
    if not tagline:
        sys.exit(f"{name}: 找不到定位句")

    def section(title, nxt):
        pat = re.compile(rf"^### {title}\s*$(.*?)(?=^### {nxt}|\Z)", re.M | re.S)
        sm = pat.search(block)
        return sm.group(1) if sm else ""

    portrait = section("人物画像", "卡通形象提示词")
    prompts = section("卡通形象提示词", "音色提示词")
    voice = block.split("### 音色提示词", 1)[1] if "### 音色提示词" in block else ""
    if not (portrait and prompts and voice):
        sys.exit(f"{name}: 三大段落不齊")

    fields = {}
    for zh_s, zh_t in FIELD_LABELS.items():
        fm = re.search(rf"-\s+\*\*{zh_s}\*\*：(.+)", portrait)
        if fm:
            fields[zh_t] = fm.group(1).strip()
    prose = {}
    for zh_s, zh_t in PROSE_LABELS.items():
        pm = re.search(rf"^\*\*{zh_s}\*\*　(.+)$", portrait, re.M)
        if pm:
            prose[zh_t] = pm.group(1).strip()
    rel_m = re.search(r"\*\*关系\*\*\s*(.*?)(?=\*\*原文依据\*\*)", portrait, re.S)
    relations = []
    if rel_m:
        for ln in rel_m.group(1).splitlines():
            rm = re.match(r"^-\s+(.+?)\s+—\s+(.+)$", ln.strip())
            if rm:
                relations.append((rm.group(1), rm.group(2)))
    quotes = []
    q_m = re.search(r"\*\*原文依据\*\*\s*(.*)$", portrait, re.S)
    if q_m:
        quotes = [re.sub(r"^>\s*", "", q).strip() for q in q_m.group(1).splitlines() if q.strip().startswith(">")]

    codes = re.findall(r"```text\s*\n(.*?)```", prompts, re.S)
    zh_prompt = ""
    zm = re.search(r"^中文：(.+?)(?=^\*\*|\Z)", prompts, re.M | re.S)
    if zm:
        zh_prompt = " ".join(zm.group(1).split())
    style_m = re.search(r"\*\*风格\*\*　(.+)", prompts)

    voice_fields = {}
    for zh_s, zh_t in VOICE_LABELS.items():
        vm = re.search(rf"-\s+\*\*{zh_s}\*\*：(.+)", voice)
        if vm:
            voice_fields[zh_t] = vm.group(1).strip()
    voice_codes = re.findall(r"```text\s*\n(.*?)```", voice, re.S)
    voice_zh = ""
    vzm = re.search(r"^中文：(.+?)(?=^---|\Z)", voice, re.M | re.S)
    if vzm:
        voice_zh = " ".join(vzm.group(1).split())

    return {
        "name": name, "aliases": aliases, "tagline": tagline,
        "fields": fields, "prose": prose, "relations": relations, "quotes": quotes,
        "style": style_m.group(1).strip() if style_m else "",
        "prompt_en": codes[0].strip() if codes else "",
        "prompt_zh": zh_prompt,
        "prompt_negative": codes[1].strip() if len(codes) > 1 else "",
        "prompt_turnaround": codes[2].strip() if len(codes) > 2 else "",
        "voice_fields": voice_fields,
        "voice_en": voice_codes[0].strip() if voice_codes else "",
        "voice_zh": voice_zh,
    }


def render(c, order):
    slug = SLUGS[c["name"]]
    has_master = slug in {"panjinlian", "lipinger", "wuyueniang", "chunmei"}
    parts = []
    parts.append('<section class="jpm-section" style="padding-top:0">')
    parts.append('<dl class="jpm-fields">')
    for k in ("性別", "年齡", "身份", "性格"):
        if k in c["fields"]:
            parts.append(f"<div><dt>{k}</dt><dd>{esc(c['fields'][k])}</dd></div>")
    parts.append("</dl>")
    parts.append('<div class="jpm-prose">')
    for k in ("外貌", "性情", "動機", "人物弧光"):
        if k in c["prose"]:
            parts.append(f"<h2>{k}</h2><p>{esc(c['prose'][k])}</p>")
    parts.append("</div></section>")

    if c["relations"]:
        parts.append('<section class="jpm-section" style="padding-top:0"><div class="jpm-prose"><h2>人物關係</h2></div><ul class="jpm-rel-list">')
        for who, desc in c["relations"]:
            parts.append(f"<li><b>{esc(who)}</b><span>{esc(desc)}</span></li>")
        parts.append("</ul></section>")

    if c["quotes"]:
        parts.append('<section class="jpm-section" style="padding-top:0"><div class="jpm-prose"><h2>原文依據</h2><p>以下逐字引自《金瓶梅詞話》（萬曆本）原典，是這份角色側寫的文本根據。</p></div><ul class="jpm-quotes">')
        for q in c["quotes"]:
            parts.append(f"<li>{esc(q)}</li>")
        parts.append("</ul></section>")

    if has_master or slug in GAME_VERSION:
        parts.append('<section class="jpm-section" style="padding-top:0"><div class="jpm-prose"><h2>視覺版本</h2><p>同一個角色，沿三條視覺路線發展：原典研究的動畫風三視圖、擬真攝影風的選角母版，以及戰棋遊戲《金瓶異夢：十二花界》的立繪。以下全部為 AI 生成影像，並非真人照片。</p></div><div class="jpm-versions">')
        parts.append(f'<figure><img src="{{{{ \'/assets/img/jinpingmei/figures/{slug}-standard.jpg\' | relative_url }}}}" alt="{c["name"]}《金瓶異夢》標準版立繪" loading="lazy"><figcaption>《金瓶異夢》標準版立繪</figcaption></figure>')
        parts.append(f'<figure><img src="{{{{ \'/assets/img/jinpingmei/figures/{slug}-sensual.jpg\' | relative_url }}}}" alt="{c["name"]}《金瓶異夢》成熟版立繪" loading="lazy"><figcaption>《金瓶異夢》成熟版立繪</figcaption></figure>')
        parts.append(f'<figure><img src="{{{{ \'/assets/img/jinpingmei/live-action/{slug}-master.jpg\' | relative_url }}}}" alt="{c["name"]}真人選角母版（AI 擬真攝影風，非真人照片）" loading="lazy"><figcaption>選角母版・AI 擬真攝影風</figcaption></figure>')
        parts.append("</div></section>")

    parts.append('<section class="jpm-section" style="padding-top:0"><div class="jpm-prose"><h2>AI 選角檔案</h2><p>虛擬劇組的工作底稿：把原典證據翻譯成給 AI 的設定指令，再由指令生成上方的角色視覺與聲音方向。完整方法見<a href="{{ \'/jinpingmei/studio/\' | relative_url }}">影像工作室</a>。</p></div>')
    parts.append('<details class="jpm-details"><summary>形象設定指令（給圖像模型）</summary><div class="inner">')
    if c["style"]:
        parts.append(f'<span class="lbl">風格</span><p>{esc(c["style"])}</p>')
    if c["prompt_zh"]:
        parts.append(f'<span class="lbl">設定描述（中文）</span><p>{esc(c["prompt_zh"])}</p>')
    if c["prompt_en"]:
        parts.append(f'<span class="lbl">設定描述（英文原稿）</span><pre>{esc(c["prompt_en"])}</pre>')
    if c["prompt_negative"]:
        parts.append(f'<span class="lbl">排除條件（negative prompt）</span><pre>{esc(c["prompt_negative"])}</pre>')
    if c["prompt_turnaround"]:
        parts.append(f'<span class="lbl">三視圖指令</span><pre>{esc(c["prompt_turnaround"])}</pre>')
    parts.append("</div></details>")
    parts.append('<details class="jpm-details"><summary>聲音設定（給語音模型）</summary><div class="inner">')
    if c["voice_fields"]:
        parts.append("<p>" + "；".join(f"<strong>{k}</strong>：{esc(v)}" for k, v in c["voice_fields"].items()) + "</p>")
    if c["voice_zh"]:
        parts.append(f'<span class="lbl">聲音描述（中文）</span><p>{esc(c["voice_zh"])}</p>')
    if c["voice_en"]:
        parts.append(f'<span class="lbl">聲音描述（英文原稿）</span><pre>{esc(c["voice_en"])}</pre>')
    parts.append("</div></details></section>")

    fm = [
        "---",
        "layout: jinpingmei-character",
        f'name: "{c["name"]}"',
        f'aliases: "{c["aliases"]}"',
        f'tagline: "{c["tagline"]}"',
        f"order: {order}",
        f'turnaround: "/assets/img/jinpingmei/turnaround/{slug}.jpg"',
        f"permalink: /jinpingmei/characters/{slug}/",
        f'title: "{c["name"]}｜金瓶梅角色研究"',
        f'description: "金瓶梅角色研究：{c["name"]}——AI 虛擬劇組整理的人物側寫、原文依據、三視圖設定與聲音方向，皆以《金瓶梅詞話》原典為本。"',
        "---",
    ]
    return "\n".join(fm) + "\n" + "\n".join(parts) + "\n"


def main():
    text = SRC.read_text(encoding="utf-8-sig")
    blocks = re.split(r"^## ", text, flags=re.M)[1:]  # 第一段是書名與故事摘要
    chars = [b for b in blocks if not b.startswith("故事摘要")]
    if len(chars) != 10:
        sys.exit(f"預期 10 位角色，實得 {len(chars)}")
    DST.mkdir(exist_ok=True)
    for i, b in enumerate(chars, start=1):
        c = parse_character(b)
        out = DST / f"{SLUGS[c['name']]}.html"
        out.write_text(render(c, i), encoding="utf-8")
        print(f"written {out.name} ({c['name']}, 關係{len(c['relations'])} 引文{len(c['quotes'])})")
    print("done")


if __name__ == "__main__":
    main()
