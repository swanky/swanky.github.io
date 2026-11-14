"""檢查 upstream diagram-design 有沒有新版，並列出與本 repo 相關的變更。

用法：py -3 -I check_upstream.py [--clone <repo 外的 clone 路徑>]
  預設 clone 路徑 %USERPROFILE%\\tools\\diagram-design；不存在就 clone 一份（不放進本 repo）。

做的事（唯讀，不改 vendor/ 與本 repo）：
  1. 讀 UPSTREAM.md 的鎖定 commit，git fetch 後比對 origin 預設分支
  2. 列出鎖定版之後的 commit
  3. 列出 vendored 範圍（skills/diagram-design/、兩支 repo-scripts）內有變的檔，並標出本 repo 重度依賴的檔
  4. 印出 CHANGELOG 的差異
  5. 確認 vendor/ 與鎖定版逐檔一致（有人偷改 vendor 會在這裡現形）
有新版 exit 10，已是最新 exit 0，出錯 exit 1。
"""
import argparse
import filecmp
import re
import subprocess
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = Path(__file__).resolve().parent
URL = "https://github.com/cathrynlavery/diagram-design.git"
VENDORED = ["skills/diagram-design/", "scripts/verify-architecture-delta.py"]
# 2026-11-13 起 verify-geometry 隨 skill 出貨（skills/diagram-design/scripts/verify_geometry.py），repo 根那支只是 runpy 轉接檔，不再 vendor
# 本 repo 規則直接覆寫或依賴的 upstream 檔；這些有變要逐條讀 diff，判斷 site-zh.md 要不要跟著改
KEY = [
    "skills/diagram-design/SKILL.md",
    "skills/diagram-design/references/style-guide.md",
    "skills/diagram-design/references/output-spec.md",
    "skills/diagram-design/references/primitives-core.md",
    "skills/diagram-design/references/layout-budget.md",
    "skills/diagram-design/references/profiles.md",
    "skills/diagram-design/references/import-mermaid.md",
    "skills/diagram-design/references/type-architecture.md",
    "skills/diagram-design/references/type-architecture-delta.md",
    "skills/diagram-design/references/type-layers.md",
    "skills/diagram-design/references/type-sequence.md",
    "skills/diagram-design/assets/template.html",
    "skills/diagram-design/assets/template-full.html",
    "skills/diagram-design/scripts/self_check.py",
    "skills/diagram-design/scripts/mermaid_extract.py",
    "skills/diagram-design/scripts/verify_geometry.py",
    "scripts/verify-architecture-delta.py",
]


def git(clone, *args):
    r = subprocess.run(["git", "-C", str(clone), *args], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    if r.returncode:
        raise SystemExit(f"git {' '.join(args)} 失敗：{r.stderr.strip()}")
    return r.stdout


def vendor_drift(clone, pinned):
    """vendor/ 與鎖定版比對；用 git archive 太重，直接用 clone 在鎖定版的檔案樹比。"""
    files = git(clone, "ls-tree", "-r", "--name-only", pinned, "--", *VENDORED).split()
    drift = []
    for f in files:
        local = HERE / ("diagram-design/" + f[len("skills/diagram-design/"):] if f.startswith("skills/")
                        else "repo-scripts/" + Path(f).name)
        blob = subprocess.run(["git", "-C", str(clone), "show", f"{pinned}:{f}"], capture_output=True).stdout
        if not local.exists():
            drift.append(f"缺檔 {f}")
        elif local.read_bytes().replace(b"\r\n", b"\n") != blob.replace(b"\r\n", b"\n"):
            drift.append(f"內容不同 {f}")
    return drift


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--clone", default=str(Path.home() / "tools" / "diagram-design"))
    clone = Path(ap.parse_args().clone)

    m = re.search(r"commit `([0-9a-f]{40})`", (HERE / "UPSTREAM.md").read_text(encoding="utf-8"))
    if not m:
        raise SystemExit("UPSTREAM.md 找不到 40 碼的鎖定 commit")
    pinned = m.group(1)

    if not (clone / ".git").exists():
        print(f"clone {URL} → {clone}")
        subprocess.run(["git", "clone", "-q", URL, str(clone)], check=True)
    git(clone, "fetch", "-q", "origin")
    head = git(clone, "rev-parse", "origin/HEAD").strip()

    print(f"鎖定版 {pinned[:7]}　upstream 最新 {head[:7]}")
    drift = vendor_drift(clone, pinned)
    print(f"vendor/ 與鎖定版一致性：{'一致' if not drift else '不一致 ' + str(len(drift)) + ' 處'}")
    for d in drift[:20]:
        print("  " + d)

    if head == pinned:
        print("已是最新，不用更新。")
        return 0

    print("\n## 新 commit")
    print(git(clone, "log", "--format=%h %ad %s", "--date=short", f"{pinned}..{head}").rstrip())

    changed = git(clone, "diff", "--name-status", pinned, head, "--", *VENDORED).splitlines()
    key = [c for c in changed if c.split("\t")[-1] in KEY]
    print(f"\n## vendored 範圍內變更 {len(changed)} 檔（★ = 本 repo 依賴，要逐條讀 diff）")
    for c in changed:
        print(("★ " if c in key else "  ") + c)

    print("\n## CHANGELOG 差異")
    print(git(clone, "diff", pinned, head, "--", "CHANGELOG.md").rstrip() or "（無）")
    return 10


if __name__ == "__main__":
    sys.exit(main())
