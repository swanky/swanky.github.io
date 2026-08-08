# 金瓶梅原文 → _jinpingmei collection 轉換器（雙版本）
# 來源：本機 novel-characters-lab 專案整理的 Wikisource 逐回 markdown（機器特定路徑，一次性匯入工具）
# 版本 A：《金瓶梅詞話》（萬曆本）→ /jinpingmei/text/NNN/（十卷結構）
# 版本 B：《新刻繡像批評金瓶梅》（崇禎本）→ /jinpingmei/text/chongzhen/NNN/（無卷，十回一組顯示）
# 原則：原文一字不改——只做結構轉換（段落→<p>、wikitext ==X== → <h2>），不動任何內文字元。
# 用法：python -X utf8 tools/build_jinpingmei_chapters.py
import re
import sys
from pathlib import Path

LIT = Path(r"C:\cc_home\godot-test\project-plum-steam\docs\literature")
DST = Path(__file__).resolve().parent.parent / "_jinpingmei"

EDITIONS = [
    {
        "slug": "wanli",
        "src": LIT / "金瓶梅詞話_萬曆本_Wikisource_原典整理_20260725" / "chapters_markdown",
        "book": "金瓶梅詞話（萬曆本）",
        "label": "詞話本",
        "permalink": "/jinpingmei/text/{num:03d}/",
        "out": "{num:03d}.html",
        "has_volume": True,
    },
    {
        "slug": "chongzhen",
        "src": LIT / "金瓶梅_Wikisource_原典整理_20260725" / "chapters_markdown",
        "book": "新刻繡像批評金瓶梅（崇禎本）",
        "label": "崇禎本",
        "permalink": "/jinpingmei/text/chongzhen/{num:03d}/",
        "out": "chongzhen-{num:03d}.html",
        "has_volume": False,
    },
]

HEAD_RE = re.compile(r"^#\s+(\S+)(?:\s+(.*))?$")
VOL_RE = re.compile(r"｜卷\s*(\d+)")
URL_RE = re.compile(r"(https://\S+)")
WIKI_H2_RE = re.compile(r"^==([^=]+)==\s*$")


def esc(t: str) -> str:
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def convert(ed) -> int:
    files = sorted(ed["src"].glob("*.md"))
    if len(files) != 101:
        sys.exit(f"{ed['slug']}: 預期 101 檔，實得 {len(files)}")
    written = 0
    for f in files:
        num = int(f.name.split("_")[0])
        lines = f.read_text(encoding="utf-8-sig").splitlines()
        m = HEAD_RE.match(lines[0])
        if not m:
            sys.exit(f"{ed['slug']}/{f.name}: 標題行解析失敗：{lines[0]!r}")
        label = m.group(1)
        couplet = (m.group(2) or "").strip()

        # 來源引言區塊：緊接標題後、以 > 開頭的連續行（允許中間空行）
        src_url, volume = None, None
        body_start = 1
        i = 1
        while i < min(len(lines), 8):
            t = lines[i].strip()
            if t.startswith(">"):
                um = URL_RE.search(t)
                if um and not src_url:
                    src_url = um.group(1).rstrip("｜")
                vm = VOL_RE.search(t)
                if vm:
                    volume = int(vm.group(1))
                body_start = i + 1
            elif t == "" and body_start == i:
                body_start = i + 1
            elif t != "":
                break
            i += 1
        if not src_url:
            sys.exit(f"{ed['slug']}/{f.name}: 找不到來源連結")
        if ed["has_volume"]:
            if num > 0 and not volume:
                sys.exit(f"{ed['slug']}/{f.name}: 回目缺卷號")
        else:
            volume = (num + 9) // 10 if num > 0 else 0  # 顯示分組用，非原書卷次

        paras = []
        for raw in lines[body_start:]:
            t = raw.rstrip()
            if not t.strip():
                continue
            wh = WIKI_H2_RE.match(t.strip())
            if wh:
                paras.append(f"<h2>{esc(wh.group(1).strip())}</h2>")
            else:
                paras.append(f"<p>{esc(t)}</p>")
        if not paras:
            sys.exit(f"{ed['slug']}/{f.name}: 空內文")

        full_title = f"{label}　{couplet}" if couplet else label
        desc = (
            f"《{ed['book'].split('（')[0]}》（{ed['book'].split('（')[1]}"
            + f"{label}"
            + (f"〈{couplet}〉" if couplet else "")
            + "原文全文，依 Wikisource 整理本收錄，未刪改。"
        )
        fm = [
            "---",
            "layout: jinpingmei-chapter",
            f'title: "{full_title}"',
            f'label: "{label}"',
            f'couplet: "{couplet}"',
            f"chapter: {num}",
            f"volume: {volume if volume is not None else 0}",
            f'edition: "{ed["slug"]}"',
            f'edition_label: "{ed["label"]}"',
            f'book: "{ed["book"]}"',
            f'source_url: "{src_url}"',
            "permalink: " + ed["permalink"].format(num=num),
            f'description: "{desc}"',
            "---",
        ]
        out = DST / ed["out"].format(num=num)
        out.write_text("\n".join(fm) + "\n" + "\n".join(paras) + "\n", encoding="utf-8")
        written += 1
    return written


def main() -> None:
    DST.mkdir(exist_ok=True)
    total = 0
    for ed in EDITIONS:
        n = convert(ed)
        print(f"{ed['slug']}: written {n}")
        total += n
    print(f"total {total} -> {DST}")


if __name__ == "__main__":
    main()
