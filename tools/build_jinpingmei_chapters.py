# 金瓶梅詞話（萬曆本）原文 → _jinpingmei collection 轉換器
# 來源：本機 novel-characters-lab 專案整理的 Wikisource 逐回 markdown（機器特定路徑，一次性匯入工具）
# 原則：原文一字不改——本工具只做結構轉換（段落→<p>、序的 ==X== → <h2>），不動任何內文字元。
# 用法：python -X utf8 tools/build_jinpingmei_chapters.py
import re
import sys
from pathlib import Path

SRC = Path(r"C:\cc_home\godot-test\project-plum-steam\docs\literature\金瓶梅詞話_萬曆本_Wikisource_原典整理_20260725\chapters_markdown")
DST = Path(__file__).resolve().parent.parent / "_jinpingmei"

HEAD_RE = re.compile(r"^#\s+(\S+)(?:\s+(.*))?$")
SRC_RE = re.compile(r"^>\s*來源：(\S+?)(?:｜卷\s*(\d+))?(?:｜Revision\s*(\d+))?\s*$")
WIKI_H2_RE = re.compile(r"^==([^=]+)==\s*$")


def esc(t: str) -> str:
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def main() -> None:
    files = sorted(SRC.glob("*.md"))
    if len(files) != 101:
        sys.exit(f"預期 101 檔，實得 {len(files)}")
    DST.mkdir(exist_ok=True)
    written = 0
    for f in files:
        num = int(f.name.split("_")[0])
        lines = f.read_text(encoding="utf-8-sig").splitlines()
        m = HEAD_RE.match(lines[0])
        if not m:
            sys.exit(f"{f.name}: 標題行解析失敗：{lines[0]!r}")
        label = m.group(1)
        couplet = (m.group(2) or "").strip()
        src_url = volume = None
        body_start = 1
        for i, ln in enumerate(lines[1:6], start=1):
            sm = SRC_RE.match(ln.strip())
            if sm:
                src_url, volume = sm.group(1), sm.group(2)
                body_start = i + 1
                break
        if not src_url:
            sys.exit(f"{f.name}: 找不到來源行")
        if num > 0 and not volume:
            sys.exit(f"{f.name}: 回目缺卷號")

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
            sys.exit(f"{f.name}: 空內文")

        full_title = f"{label}　{couplet}" if couplet else label
        desc = (
            f"《金瓶梅詞話》（萬曆本）{label}"
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
            f"volume: {volume if volume else 0}",
            f'source_url: "{src_url}"',
            f"permalink: /jinpingmei/text/{num:03d}/",
            f'description: "{desc}"',
            "---",
        ]
        out = DST / f"{num:03d}.html"
        out.write_text("\n".join(fm) + "\n" + "\n".join(paras) + "\n", encoding="utf-8")
        written += 1
    print(f"written {written} files -> {DST}")


if __name__ == "__main__":
    main()
