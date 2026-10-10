#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""超大原圖的響應式版本產生器（2026-10-10）。

原圖直接當 <img src> 會拖垮手機載入。這裡為指定原圖在「原圖旁」產生：
  {stem}-{w}.webp   w ∈ 480／960／1600（只產 ≤ 原寬；原寬 <1600 時，最大一階用原寬，不放大）
  {stem}-{top}.jpg  最大一階的 JPEG fallback（<picture> 的 <img src>）
  {stem}-lightbox.jpg  長邊 ≤2400、品質 82（僅 lightbox 連結用；LIGHTBOX=True 的才產）
編碼器沿用 tools/build-home-images.py：Pillow WEBP quality 80 method 6、LANCZOS 縮放。
kind="thumb"（版面上只是小縮圖的格狀圖）：只產 480／960 webp 與 480 寬的 jpg fallback（不產大尺寸）。
原圖保留在 git，不動。

執行：python -X utf8 tools/build-oversized-images.py   （需 Pillow，含 WebP 支援；可重跑，會覆寫）
輸出檔要一起 commit。
"""
from __future__ import annotations

import json
import os
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
WEBP_Q = 80
JPG_Q = 82
WIDTHS = (480, 960, 1600)
LIGHTBOX_EDGE = 2400
FALLBACK_CAP_KB = 480

EXTRA_FULL: list[str] = [
    "assets/img/ai-coding-selection-2026/ai-coding-tool-selection-2026.jpg",
    "assets/img/artificial-analysis-llm-evaluation-2026/artificial-analysis-llm-evaluation-banner.jpg",
    "assets/img/fake-world-assets-fwa-deep-dive/bankless-fwa-pool-interface.png",
    "assets/img/fake-world-assets-fwa-deep-dive/fwa-chain-gacha-banner-v3-fixed.jpg",
    "assets/img/games/plum/hero-gameplay.jpg",
    "assets/img/games/plum/rebuild/slice-battle.jpg",
    "assets/img/games/plum/rebuild/slice-battle2.jpg",
    "assets/img/games/plum/rebuild/slice-hud.jpg",
    "assets/img/hermes-openrouter-video/asset-selection-contact.jpg",
    "assets/img/kimi-k3-open-frontier/kimi-k3-open-frontier-banner.jpg",
    "assets/img/production-ai-agent-control-planes/production-ai-agent-control-planes-banner-v2.jpg",
    "assets/img/photography/selected/24350775633.jpg",
    "assets/img/web3/web3-consulting-anime.jpg",
    "assets/img/web3/web3-rwa-research-anime.jpg",
    "assets/img/web3/web3-trusted-data-anime.jpg",
    "assets/img/linkedin/agent-parallel-verification-first.jpg",
    "assets/img/linkedin/ai-agent-surgical-team.jpg",
    "assets/img/linkedin/ai-agent-wallet-permission-boundaries.jpg",
    "assets/img/linkedin/ai-code-production-review-bottleneck.jpg",
    "assets/img/linkedin/ai-video-agent-human-gates.jpg",
    "assets/img/linkedin/ai-video-basics-for-non-film.jpg",
    "assets/img/linkedin/ai-video-camera-language-prompt.jpg",
    "assets/img/linkedin/ai-video-competition-rehearsal-to-finals.jpg",
    "assets/img/linkedin/ai-video-consistency-reference-previs.jpg",
    "assets/img/linkedin/ai-video-cost-control.jpg",
    "assets/img/linkedin/ai-video-model-comparison-method.jpg",
    "assets/img/linkedin/ai-video-reference-breakdown.jpg",
    "assets/img/linkedin/dhh-pencils-down-ai-adoption.jpg",
    "assets/img/linkedin/grok-bot-model-routing.jpg",
    "assets/img/linkedin/hermes-bot-mode-persistent-ai-team.jpg",
    "assets/img/linkedin/matt-pocock-skills-ai-coding-workflow.jpg",
    "assets/img/linkedin/nft-new-uses-market-reality.jpg",
    "assets/img/linkedin/poteto-pstack-trust-before-scale.jpg",
    "assets/img/linkedin/scaffolding-thin-harness-agent-architecture.jpg",
    "assets/img/linkedin/uncle-bob-ai-software-fundamentals.jpg",
    "nft/assets/images/NFT_pics_800.jpg",  # nft/ 是獨立子站、不放衍生檔，輸出改到 OUT_OVERRIDE
]

OUT_OVERRIDE = {"nft/assets/images/NFT_pics_800.jpg": "assets/img/technical/uniform-girls-nft-debut/NFT_pics_800"}

# (相對路徑, 是否產 lightbox 版, kind)  kind: "full" 或 "thumb"
SOURCES = [
    ("assets/img/redball.jpg", False, "full"),
    ("education/crypto/img/nft_nps_1.jpeg", False, "full"),
    ("assets/img/class_1_1_nps.jpeg", False, "full"),
    ("assets/img/class_1_2_nps.jpeg", False, "full"),
    ("assets/img/technical/clonex-bunny-dance-reference-bottleneck/hero.png", False, "full"),
    ("assets/img/technical/clonex-bunny-dance-reference-bottleneck/wide.png", False, "full"),
    ("assets/img/linkedin/ai-agent-payments-web3.jpg", False, "full"),
]

# 制服女孩歷程頁的格狀縮圖（版面約 285px 寬）：thumb 即可；前四張同時給 lightbox 版
_UG = "assets/img/uniform/"
SOURCES += [(p, True, "thumb") for p in [
    _UG + "ug3/制服女孩3見面會.jpg", _UG + "ug1/制服女孩簽書見面會.jpg",
    _UG + "高校制服戀物論_新書座談會.jpg", _UG + "ug1/簽書會_1_effected.jpg",
]]
SOURCES += [(p, False, "thumb") for p in [
    _UG + "books.jpg", _UG + "ug1/ug1_shih.jpg",
    _UG + "ug1/10387089_10152518081238094_4120939190858956274_o.jpg",
    _UG + "ug1/10431423_10203991964789248_3453868355221491809_o.jpg",
    _UG + "ug1/10517349_10203991966389288_4929346200338332420_o.jpg",
    _UG + "ug1/1890570_10152221485610767_1841806395_o.jpg",
    _UG + "ug1/71584_10202220814414539_819263412_n.jpg",
    _UG + "ug2/10679664_10152685819968094_605167657307133793_o.jpg",
    _UG + "ug2/11025911_10204997839177581_232479791354786255_o.jpg",
    _UG + "ug2/11039253_10153136824453094_4015987053211649556_o.jpg",
    _UG + "ug2/11043397_10153160867773094_5173811301970275670_o.jpg",
    _UG + "ug2/11070834_10153161471958094_34429012719912683_o.jpg",
    "assets/img/old/ug3/cover.jpg", "assets/img/old/ug3/author.jpg",
    "assets/img/old/calendar_s_2016.jpg",
    _UG + "11221877_10153498930455329_9143763719781873441_o.jpg",
    _UG + "11538993_10153388996173094_1923924695849238883_o.jpg",
    _UG + "1493409_10152472461473094_7294494462771092776_o.jpg",
    _UG + "newspaper.jpg", _UG + "uniform_news.jpg", _UG + "yam_news.jpg",
] + [f"assets/img/old/ug3/sjpg/girls_{i}.jpg" for i in range(1, 7)]
  + [f"assets/img/old/cal_2016/cal_2016_{i:02d}.jpg" for i in range(1, 13)]]

# 其他頁面超過 500KB 的圖（文章 banner、卡片、遊戲截圖……）：full，供 <picture>／hero_srcset 使用
SOURCES += [(p, False, "full") for p in EXTRA_FULL]


def post_covers() -> set[str]:
    """_posts/ 內所有 front matter cover_image（相對路徑、無開頭斜線）。"""
    covers = set()
    for post in (ROOT / "_posts").iterdir():
        if post.suffix not in (".md", ".html"):
            continue
        head = post.read_text(encoding="utf-8", errors="ignore").split("---", 2)
        if len(head) < 3:
            continue
        m = re.search(r"^cover_image:[ \t]*[\"']?([^\"'\r\n]+)", head[1], re.M)
        if m:
            covers.add(m.group(1).strip().lstrip("/"))
    return covers


def is_banner(rel: str, covers: set[str]) -> bool:
    """Banner 一律以原圖原畫質呈現（站主 2026-10-10 裁定）：不壓縮、不縮圖、不換 webp，所以不產衍生檔。
    判準：文章 cover_image、/assets/img/linkedin/ 底下、檔名含 banner、web3/*-anime.jpg。"""
    name = rel.rsplit("/", 1)[-1]
    return (
        rel in covers
        or rel.startswith("assets/img/linkedin/")
        or "banner" in name.lower()
        or (rel.startswith("assets/img/web3/") and name.endswith("-anime.jpg"))
    )


def resized(im: Image.Image, width: int) -> Image.Image:
    if width >= im.width:
        return im
    return im.resize((width, int(round(im.height * width / im.width))), Image.LANCZOS)


def emit(im: Image.Image, path: Path, fmt: str, cap_kb: int = 0) -> None:
    if fmt == "WEBP":
        im.save(path, "WEBP", quality=WEBP_Q, method=6)
    else:
        q = JPG_Q
        while True:
            im.save(path, "JPEG", quality=q, optimize=True, progressive=True)
            # cap_kb：fallback JPEG 超過上限就降品質（長圖問卷會超標）；lightbox 不設上限
            if not cap_kb or os.path.getsize(path) <= cap_kb * 1024 or q <= 60:
                break
            q -= 4
    print(f"{path.relative_to(ROOT)}  {im.width}x{im.height}  {os.path.getsize(path)//1024} KB")


def record(manifest: dict, rel: str, stem: Path, sizes: list[int], top: int, im: Image.Image) -> None:
    """寫進 _data/oversized_images.json，讓 _includes/flickr/source.html 以原圖路徑查到響應式版本。"""
    pub = "/" + stem.relative_to(ROOT).as_posix()
    manifest["/" + rel] = {
        "src": f"{pub}-{top}.jpg",
        "srcset": [{"path": f"{pub}-{w}.webp", "w": w} for w in sizes],
        "width": im.width,
        "height": im.height,
    }


def emit_lightbox(im: Image.Image, stem: Path) -> None:
    scale = min(1.0, LIGHTBOX_EDGE / max(im.size))
    lb = im if scale == 1.0 else im.resize(
        (int(round(im.width * scale)), int(round(im.height * scale))), Image.LANCZOS)
    emit(lb, Path(f"{stem}-lightbox.jpg"), "JPEG")


def main() -> None:
    manifest: dict = {}
    covers = post_covers()
    for rel, lightbox, kind in SOURCES:
        if is_banner(rel, covers):
            print(f"skip banner (keep original): {rel}")
            continue
        src = ROOT / rel
        im = Image.open(src).convert("RGB")
        stem = (ROOT / OUT_OVERRIDE[rel]) if rel in OUT_OVERRIDE else src.with_suffix("")
        stem.parent.mkdir(parents=True, exist_ok=True)
        if kind == "thumb":
            sizes = [w for w in (480, 960) if w <= im.width] or [im.width]
            for w in sizes:
                emit(resized(im, w), Path(f"{stem}-{w}.webp"), "WEBP")
            top = sizes[0]
            emit(resized(im, top), Path(f"{stem}-{top}.jpg"), "JPEG", cap_kb=FALLBACK_CAP_KB)
            if lightbox:
                emit_lightbox(im, stem)
            record(manifest, rel, stem, sizes, top, im)
            continue
        sizes = [w for w in WIDTHS if w <= im.width]
        if im.width < WIDTHS[-1] and im.width not in sizes:
            sizes.append(im.width)
        for w in sizes:
            emit(resized(im, w), Path(f"{stem}-{w}.webp"), "WEBP")
        top = sizes[-1]
        emit(resized(im, top), Path(f"{stem}-{top}.jpg"), "JPEG", cap_kb=FALLBACK_CAP_KB)
        if lightbox:
            emit_lightbox(im, stem)
        record(manifest, rel, stem, sizes, top, im)
    out = ROOT / "_data" / "oversized_images.json"
    out.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"_data/oversized_images.json  {len(manifest)} entries")


if __name__ == "__main__":
    main()
