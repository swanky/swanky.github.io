"""截圖目視：py -3 shot.py <html> <png> [width]（預設 1440；用本機 Edge，不需另裝 chromium）

Playwright 裝在 user site-packages，所以用 `py -3`，不要加 -I。
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

src, out = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
width = int(sys.argv[3]) if len(sys.argv) > 3 else 1440
with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge")
    pg = b.new_page(viewport={"width": width, "height": 900})
    pg.goto(src.as_uri())
    pg.wait_for_timeout(300)
    pg.screenshot(path=str(out), full_page=True)
    b.close()
print(out)
