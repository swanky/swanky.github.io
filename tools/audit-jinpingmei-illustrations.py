#!/usr/bin/env python3
"""
驗證《金瓶梅》插圖 manifest、正式圖片與禁用素材。

用法：
  python -X utf8 tools/audit-jinpingmei-illustrations.py \
    --manifest _data/jinpingmei_illustrations.json \
    --repo .
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any

APPROVED_LICENSES = {"PDM-1.0", "CC0-1.0", "CC-BY-4.0", "CC-BY-SA-4.0"}
REQUIRED = {
    "id",
    "status",
    "title_zh",
    "creator",
    "date",
    "source_page",
    "rights",
    "review",
}
TEXT_EXTENSIONS = {".html", ".md", ".css", ".js", ".mjs", ".json", ".yml", ".yaml", ".liquid"}


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def iter_text_files(repo: Path):
    ignored = {".git", "_site", "node_modules", ".bundle", "vendor", ".jekyll-cache"}
    for path in repo.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        if any(part in ignored for part in path.parts):
            continue
        yield path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=None)
    parser.add_argument("--repo", type=Path, default=Path("."))
    args = parser.parse_args()

    repo = args.repo.resolve()
    manifest_path = args.manifest or repo / "_data" / "jinpingmei_illustrations.json"
    data: dict[str, Any] = json.loads(manifest_path.read_text(encoding="utf-8"))

    errors: list[str] = []
    warnings: list[str] = []
    ids: set[str] = set()

    for item in data.get("items", []):
        missing = REQUIRED - item.keys()
        if missing:
            errors.append(f"{item.get('id', '<no-id>')}: 缺欄位 {sorted(missing)}")
            continue

        item_id = item["id"]
        if item_id in ids:
            errors.append(f"{item_id}: ID 重複")
        ids.add(item_id)

        rights = item.get("rights", {})
        license_id = rights.get("license_id")
        status = item.get("status", "")
        if status.startswith("approved") and license_id not in APPROVED_LICENSES:
            errors.append(f"{item_id}: approved 但授權不在 allowlist：{license_id}")

        source = item.get("source_page", "")
        if status.startswith("approved") and not source.startswith("https://"):
            errors.append(f"{item_id}: approved 但來源不是 HTTPS")
        if "wenhui.whb.cn" in source:
            errors.append(f"{item_id}: 不得把文匯文章頁當素材來源")
        if status == "approved" and not item.get("alt_zh"):
            errors.append(f"{item_id}: 正式 approved 缺 alt_zh")

        local = item.get("local")
        if status == "approved" and local:
            for key in ("source", "sha256", "web"):
                if key not in local:
                    errors.append(f"{item_id}: local 缺 {key}")
            src = local.get("source")
            if src:
                candidate = repo / src
                if candidate.exists() and sha256(candidate) != local.get("sha256"):
                    errors.append(f"{item_id}: 原檔 SHA-256 不符")
                elif not candidate.exists():
                    warnings.append(f"{item_id}: repo 內找不到套件原檔 {src}，正式 repo 可只留 web 衍生圖")

    blocked_hashes = {
        item["sha256"]: item.get("id", "blocked")
        for item in data.get("blocked", [])
        if item.get("sha256")
    }

    remote_image_pattern = re.compile(
        r"""(?:src|srcset)\s*=\s*["'][^"']*(?:upload\.wikimedia\.org|wenhui\.whb\.cn)[^"']*["']""",
        re.I,
    )
    base64_pattern = re.compile(r"data:image/(?:png|jpeg|jpg|webp|gif);base64,", re.I)

    for path in iter_text_files(repo):
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        rel = path.relative_to(repo)
        if remote_image_pattern.search(text):
            errors.append(f"{rel}: 發現遠端圖片熱連")
        if base64_pattern.search(text) and "jinpingmei" in str(rel).lower():
            warnings.append(f"{rel}: 發現金瓶梅 base64 內嵌圖片，建議改為獨立檔案")

    image_exts = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".tif", ".tiff"}
    for path in repo.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in image_exts:
            continue
        if any(part in {".git", "_site", "node_modules"} for part in path.parts):
            continue
        digest = sha256(path)
        if digest in blocked_hashes:
            errors.append(f"{path.relative_to(repo)}: 命中禁用素材 {blocked_hashes[digest]}")

    if warnings:
        print("WARNINGS")
        for warning in warnings:
            print(f"  - {warning}")

    if errors:
        print("ERRORS", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(f"OK：{len(ids)} 筆素材資料通過；未發現禁用圖或未授權熱連。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
