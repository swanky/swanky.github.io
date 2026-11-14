"""site-diagram 交付前檢查：py -3 -I check.py <html> [<html> ...] [--delta]

逐檔跑：
  1. upstream self_check.py --offline（system 字型、不得連外）
  2. upstream verify_geometry.py（2026-11 起隨 skill 出貨；標籤遮罩與節點碰撞，認不得 16px 以上中文標籤，碰撞仍要截圖目視）
  3. 檔名含 "delta" 或加 --delta 時，另跑 verify-architecture-delta.py
  4. 豎線（| 與 ｜）與外部 URL（SVG/XLink xmlns 除外）計數，必須為 0
全部通過 exit 0，任一失敗 exit 1。
"""
import re
import subprocess
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

VENDOR = Path(__file__).resolve().parent.parent / "vendor"
SELF_CHECK = VENDOR / "diagram-design" / "scripts" / "self_check.py"
GEOMETRY = VENDOR / "diagram-design" / "scripts" / "verify_geometry.py"
DELTA = VENDOR / "repo-scripts" / "verify-architecture-delta.py"
XMLNS = re.compile(r"https?://www\.w3\.org/[^\s\"'<>]*")
URL = re.compile(r"https?://[^\s\"'<>)]+")


def run(script, *args):
    r = subprocess.run([sys.executable, "-I", str(script), *args],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    return r.returncode == 0, (r.stdout + r.stderr).strip()


def check(path: Path, delta: bool) -> bool:
    ok_all = True
    steps = [("self_check", SELF_CHECK, ["--offline", str(path)]),
             ("verify-geometry", GEOMETRY, [str(path)])]
    if delta or "delta" in path.name.lower():
        steps.append(("verify-architecture-delta", DELTA, [str(path)]))
    for name, script, args in steps:
        ok, out = run(script, *args)
        ok_all &= ok
        print(f"  {'OK ' if ok else 'NG '} {name}")
        if not ok:
            print("      " + out.replace("\n", "\n      "))
    text = path.read_text(encoding="utf-8")
    pipes = text.count("|") + text.count("｜")
    urls = URL.findall(XMLNS.sub("", text))
    for name, n, detail in (("豎線", pipes, ""), ("外部 URL", len(urls), " ".join(urls[:3]))):
        print(f"  {'OK ' if n == 0 else 'NG '} {name} {n}{' ' + detail if detail else ''}")
        ok_all &= n == 0
    return ok_all


def main():
    args = sys.argv[1:]
    delta = "--delta" in args
    files = [Path(a).resolve() for a in args if a != "--delta"]
    if not files:
        print(__doc__)
        return 2
    failed = 0
    for f in files:
        print(f)
        if not check(f, delta):
            failed += 1
    print(f"\n{len(files) - failed}/{len(files)} 通過")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
