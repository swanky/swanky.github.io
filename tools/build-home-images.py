#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""首頁「代表成果／最新創作」區的輕量圖片產生器（2026-09-25）。

來源都是 repo 內既有圖檔，輸出到 assets/img/home/ 為 WebP，兩種寬度供 srcset：
  - 四張代表成果縮圖：4:3，360w／720w（版面顯示 110–200px）
  - 三本《制服．女孩》：三張真實封面在暖紙底上排成一張 4:3 合成圖（不用 books.jpg，
    那張合照含五本出版與人物，會與「三本」矛盾）
  - 最新創作橫幅：16:9，800w／1400w（桌機 2.2:1 由 CSS object-fit 再裁）
  - 《金瓶異夢》縮圖：16:9，360w／720w

執行：python -X utf8 tools/build-home-images.py   （需 Pillow，含 WebP 支援）
輸出檔要一起 commit（GitHub Pages 從 git 建置）。
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "home"
OUT.mkdir(parents=True, exist_ok=True)
QUALITY = 80


def load(rel: str) -> Image.Image:
    return Image.open(ROOT / rel.lstrip("/")).convert("RGB")


def cover_crop(im: Image.Image, ratio: float, focus=(0.5, 0.5)) -> Image.Image:
    """置中（或指定焦點）裁到指定寬高比。focus=(x,y) 為 0–1 的相對位置。"""
    w, h = im.size
    if w / h > ratio:
        nw = int(round(h * ratio)); nh = h
    else:
        nw = w; nh = int(round(w / ratio))
    left = int(round((w - nw) * focus[0])); top = int(round((h - nh) * focus[1]))
    return im.crop((left, top, left + nw, top + nh))


def save_set(im: Image.Image, stem: str, widths: list[int], quality: int = QUALITY) -> None:
    for width in widths:
        ratio = width / im.width
        out = im.resize((width, int(round(im.height * ratio))), Image.LANCZOS)
        path = OUT / f"{stem}-{width}.webp"
        out.save(path, "WEBP", quality=quality, method=6)
        print(f"{path.relative_to(ROOT)}  {out.size[0]}x{out.size[1]}  {os.path.getsize(path)//1024} KB")


def books_composite() -> Image.Image:
    """三張真實封面（I／II／III）在暖紙底上略帶角度排開，中間那本在最上層。"""
    W, H = 1440, 1080
    canvas = Image.new("RGB", (W, H), "#fbf6ec")
    # 底部微暗的暖色漸層，讓書像放在紙上而不是浮在白底
    grad = Image.new("L", (1, H))
    for y in range(H):
        grad.putpixel((0, y), int(255 * (1 - 0.10 * y / H)))
    grad = grad.resize((W, H))
    tint = Image.new("RGB", (W, H), "#f2e7d0")
    canvas = Image.composite(canvas, tint, grad)

    covers = [
        ("/assets/img/portfolio/portfolio-1.jpeg", -7),
        ("/assets/img/portfolio/portfolio-2.jpeg", 0),
        ("/assets/img/portfolio/portfolio-5.jpeg", 7),
    ]
    target_h = 720
    xs = [0.27, 0.50, 0.73]  # 三本書中心的相對 x
    layers = []
    for (rel, angle), cx in zip(covers, xs):
        im = load(rel)
        im = im.resize((int(round(im.width * target_h / im.height)), target_h), Image.LANCZOS)
        rgba = im.convert("RGBA")
        rot = rgba.rotate(angle, resample=Image.BICUBIC, expand=True)
        # 柔和陰影
        shadow = Image.new("RGBA", rot.size, (0, 0, 0, 0))
        alpha = rot.split()[3]
        shadow.putalpha(alpha.point(lambda a: int(a * 0.45)))
        shadow = shadow.filter(ImageFilter.GaussianBlur(22))
        x = int(round(W * cx - rot.width / 2)); y = int(round((H - rot.height) / 2)) + 10
        layers.append((shadow, (x + 6, y + 26)))
        layers.append((rot, (x, y)))
    # 先貼左右兩本，再貼中間那本（陰影與本體成對）
    order = [0, 1, 4, 5, 2, 3]
    base = canvas.convert("RGBA")
    for i in order:
        layer, pos = layers[i]
        base.alpha_composite(layer, dest=pos)
    return base.convert("RGB")


def main() -> None:
    # 代表成果四張縮圖 4:3（版位 200px，480w 供 2x 螢幕）
    save_set(cover_crop(load("/assets/img/press/time-magazine-redball.jpg"), 4 / 3, (0.5, 0.5)), "hl-time", [360, 480])
    save_set(books_composite(), "hl-books", [360, 480])
    save_set(cover_crop(load("/assets/img/sec/014_Dulce_1.jpg"), 4 / 3, (0.5, 0.42)), "hl-px3", [360, 480])
    save_set(cover_crop(load("/education/crypto/img/swanky_crypto_class.jpg"), 4 / 3), "hl-soochow", [360, 480])
    # 最新創作橫幅 16:9（主體偏左，焦點 x=0.35；版位最寬 1296px）
    save_set(cover_crop(load("/assets/img/photography/swanky-ji-open-worlds/SJW-35.webp"), 16 / 9, (0.35, 0.5)), "creative-open-worlds", [800, 1400], quality=76)
    # 《金瓶異夢》16:9（版位 260px）
    save_set(load("/assets/img/games/plum/cinematic/hero-poster-v2.jpg"), "creative-plum", [360, 540])


if __name__ == "__main__":
    sys.exit(main())
