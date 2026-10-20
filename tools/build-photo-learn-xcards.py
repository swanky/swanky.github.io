"""看懂寫真：X 討論串圖卡產生器（1080×1080，一章 6 張＋caption.md）。

格式沿用 2026-10-09 手做的兩章（docs/social/photo-learn/penn-fonssagrives、jeanloup-sieff）：
  1 hook（封面）→ 2 事實／重點方框 → 3 能借什麼（編號步驟）→ 4 不能抄什麼 → 5 我的作品對照 → 6 導回網站。
每章的文字寫在 docs/social/photo-learn/<slug>/cards.json（只用該章網頁上已有的內容），本工具負責排版：
  python -X utf8 tools/build-photo-learn-xcards.py <slug> [<slug> ...]   # 產生 01–06 的 .svg／.png 與 caption.md
  python -X utf8 tools/build-photo-learn-xcards.py --all
文字太長時會自動縮小字級（不會超出版面）；縮到下限仍放不下就報錯，請改短文案。
需要本機 Chrome（把 SVG 轉成 PNG）與 Pillow。

cards.json 欄位：
  slug, url（章節網址）, header（卡片左上「看懂寫真｜」後面的字，通常是人名）, unit（第 1 張用，如「U2 風格拆解」）,
  title（章名，寫進 caption.md 標題）,
  cards: [
    {"type": "hook", "white": [..], "gold": [..], "pill": "拆解 XXX", "desc": ".."},
    {"type": "boxes", "title": ["白字", "金字（可省）"], "items": [{"k": "1931", "v": ".."}], "note": "出處：..", "desc": ".."},
    {"type": "steps", "title": "能借什麼", "items": [{"h": "..", "sub": ".."}], "desc": ".."},
    {"type": "dont", "title": "不能抄什麼", "items": [{"h": "..", "sub": ".."}], "desc": ".."},
    {"type": "mywork", "image": "/assets/img/...", "work": "作品名", "head": "（可省，覆寫「我拍的〈作品名〉」）", "line": "一句旁白", "desc": ".."},
    {"type": "link", "bullets": ["..", "..", ".."], "desc": ".."}
  ]（type 可重複，例如兩張 boxes；每張可加 "name" 指定檔名後綴，預設 hook／facts／borrow／dont／my-work／link），
  tweets: [6 則推文全文；第 1 則結尾放 2 個 hashtag]
"""
import base64
import html
import io
import json
import os
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOCIAL = ROOT / 'docs' / 'social' / 'photo-learn'
CHROME = [r'C:\Program Files\Google\Chrome\Application\chrome.exe',
          r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe']
INK, LINE, BOX, GOLD, GOLD2, PAPER, MUTED, RED, BLUE = ('#141412', '#3A3934', '#1E1D1A', '#F5C53B', '#E5A300',
                                                        '#F3EFE6', '#B9B3A8', '#F08A7A', '#7FA6D1')
FONT = 'Microsoft JhengHei, Noto Sans TC, Malgun Gothic, Yu Gothic, sans-serif'


def em_width(text):
    w = 0.0
    for ch in text:
        if unicodedata.east_asian_width(ch) in ('W', 'F'):
            w += 1.0
        elif ch == ' ':
            w += 0.3
        elif ch.isupper() or ch.isdigit():
            w += 0.62
        else:
            w += 0.52
    return w


def fit(text, size, avail, minimum):
    """字級：放得下就用 size，否則縮到剛好；低於 minimum 就報錯。"""
    need = em_width(text) * size
    if need <= avail:
        return size
    s = int(avail / em_width(text))
    if s < minimum:
        raise SystemExit(f'文字太長（{em_width(text):.1f} 字寬，可用 {avail}px，最小字級 {minimum}）：{text}')
    return s


def t(x, y, text, size, fill, bold=False, anchor=None):
    a = f' text-anchor="{anchor}"' if anchor else ''
    b = ' font-weight="700"' if bold else ''
    return f'<text x="{x}" y="{y}" font-size="{size}"{b}{a} fill="{fill}">{html.escape(text)}</text>'


def frame(n, header, title, desc, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080" role="img" '
            f'aria-labelledby="t d" font-family="{FONT}">\n'
            f'<title id="t">{html.escape(title)}</title><desc id="d">{html.escape(desc)}</desc>\n'
            f'<rect width="1080" height="1080" fill="{INK}"/>\n'
            f'<rect x="40" y="40" width="1000" height="1000" fill="none" stroke="{LINE}" stroke-width="2"/>\n'
            f'<text x="80" y="112" font-size="30" font-weight="700" fill="{GOLD}">看懂寫真</text>\n'
            f'<text x="214" y="112" font-size="30" fill="{MUTED}">｜{html.escape(header)}</text>\n'
            f'<text x="1000" y="112" font-size="30" text-anchor="end" fill="{MUTED}">{n}/6</text>\n'
            f'<line x1="80" y1="140" x2="1000" y2="140" stroke="{LINE}" stroke-width="2"/>\n'
            f'<text x="80" y="1010" font-size="28" fill="{MUTED}">swanky.github.io</text>\n'
            f'<text x="1000" y="1010" font-size="28" text-anchor="end" fill="{MUTED}">史旺基的攝影學習筆記</text>\n'
            + '\n'.join(body) + '\n</svg>\n')


def card_hook(c):
    out, y = [], 300
    lines = [(s, PAPER) for s in c['white']] + [(s, GOLD) for s in c['gold']]
    n = len(lines)
    step = 120 if n <= 4 else 100
    for i, (s, col) in enumerate(lines):
        if i == len(c['white']) and i > 0:
            y += 40
        out.append(t(80, y, s, fit(s, 96 if n <= 4 else 80, 920, 56), col, True))
        y += step
    pill = c['pill']
    ps = fit(pill, 32, 840, 24)
    pw = int(em_width(pill) * ps) + 80
    py = max(y - 20, 780)
    out.append(f'<rect x="80" y="{py}" width="{pw}" height="76" rx="38" fill="none" stroke="{GOLD2}" stroke-width="3"/>')
    out.append(t(80 + pw // 2, py + 50, pill, ps, GOLD, True, 'middle'))
    return out


def title_block(title, size=64):
    out, y = [], 250
    if isinstance(title, str):
        title = [title]
    for i, s in enumerate(title):
        out.append(t(80, y, s, fit(s, size, 920, 44), PAPER if i == 0 else GOLD, True))
        y += int(size * 1.3)
    return out, y


def card_boxes(c):
    out, y = title_block(c['title'], 64)
    items = c['items']
    if len(items) > 4:
        raise SystemExit('boxes 最多 4 格')
    two = isinstance(c['title'], list) and len(c['title']) > 1
    y, step, bh = (380, 132, 108) if two else (330, 140, 116)
    for it in items:
        out.append(f'<rect x="80" y="{y}" width="920" height="{bh}" rx="18" fill="{BOX}" stroke="{LINE}" stroke-width="2"/>')
        ty = y + bh // 2 + 14
        if it.get('k'):
            out.append(t(120, ty, it['k'], fit(it['k'], 40, 140, 26), GOLD, True))
            out.append(t(280, ty, it['v'], fit(it['v'], 40, 690, 26), PAPER))
        else:
            out.append(t(120, ty, it['v'], fit(it['v'], 40, 850, 26), PAPER))
        y += step
    if c.get('note'):
        out.append(t(80, 940, c['note'], fit(c['note'], 28, 920, 20), MUTED))
    return out


def card_steps(c):
    out = [t(80, 250, c['title'], fit(c['title'], 72, 920, 48), GOLD, True)]
    items = c['items']
    if len(items) > 4:
        raise SystemExit('steps 最多 4 項')
    for i, it in enumerate(items):
        cy = 368 + 150 * i
        out.append(f'<circle cx="122" cy="{cy}" r="34" fill="{GOLD2}"/>' + t(122, cy + 14, str(i + 1), 40, '#111111', True, 'middle'))
        out.append(t(190, cy - 6, it['h'], fit(it['h'], 44, 810, 30), PAPER, True))
        if it.get('sub'):
            out.append(t(190, cy + 48, it['sub'], fit(it['sub'], 34, 810, 24), MUTED))
    return out


def card_dont(c):
    out = [t(80, 250, c['title'], fit(c['title'], 72, 920, 48), PAPER, True)]
    items = c['items']
    if len(items) > 4:
        raise SystemExit('dont 最多 4 項')
    for i, it in enumerate(items):
        y = 300 + 152 * i
        out.append(f'<rect x="80" y="{y}" width="920" height="132" rx="18" fill="{BOX}" stroke="{LINE}" stroke-width="2"/>')
        out.append(t(120, y + 56, it['h'], fit(it['h'], 42, 850, 28), RED, True))
        if it.get('sub'):
            sub = '→ ' + it['sub']
            out.append(t(120, y + 108, sub, fit(sub, 36, 850, 24), PAPER))
    return out


def card_mywork(c):
    src = ROOT / c['image'].lstrip('/')
    im = Image.open(src).convert('RGB')
    im.thumbnail((640, 640))
    w, h = im.size
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=86)
    b64 = base64.b64encode(buf.getvalue()).decode()
    x, y = 540 - w // 2, 170 + (640 - h) // 2
    head = c.get('head') or (f'我拍的〈{c["work"]}〉' if c.get('work') else '我拍的作品')
    return [f'<image x="{x}" y="{y}" width="{w}" height="{h}" href="data:image/jpeg;base64,{b64}"/>',
            t(540, 880, head, fit(head, 44, 920, 30), PAPER, True, 'middle'),
            t(540, 940, c['line'], fit(c['line'], 34, 920, 24), GOLD, False, 'middle')]


def card_link(c, url):
    out = [t(80, 290, '完整一章', 96, PAPER, True)]
    for i, b in enumerate(c['bullets'][:4]):
        s = '・' + b
        out.append(t(80, round(420 + 65.1 * i, 1), s, fit(s, 42, 920, 30), PAPER))
    path = url.replace('https://', '')
    cut = path.index('/learn/') + len('/learn/')
    out.append(f'<rect x="80" y="760" width="920" height="150" rx="20" fill="{GOLD2}"/>')
    out.append(t(540, 826, path[:cut], fit(path[:cut], 40, 860, 28), '#111111', True, 'middle'))
    out.append(t(540, 880, path[cut:], fit(path[cut:], 40, 860, 28), '#111111', True, 'middle'))
    return out


def card_title(c):
    if c['type'] == 'hook':
        return ''.join(c['white']) + ''.join(c['gold'])
    if c['type'] == 'mywork':
        return f'我的作品對照：{c.get("work", "")}'
    if c['type'] == 'link':
        return '完整一章在網站上'
    ti = c['title']
    return ''.join(ti) if isinstance(ti, list) else ti


NAMES = {'hook': '01-hook', 'boxes': '02-facts', 'steps': '03-borrow', 'dont': '04-dont', 'mywork': '05-my-work', 'link': '06-link'}


def build(slug, chrome, tmp):
    d = SOCIAL / slug
    spec = json.loads((d / 'cards.json').read_text(encoding='utf-8'))
    assert len(spec['cards']) == 6 and len(spec['tweets']) == 6, f'{slug}：要剛好 6 張卡、6 則推文'
    files = []
    for n, c in enumerate(spec['cards'], 1):
        kind = c['type']
        body = {'hook': card_hook, 'boxes': card_boxes, 'steps': card_steps, 'dont': card_dont,
                'mywork': card_mywork}.get(kind)
        body = card_link(c, spec['url']) if kind == 'link' else body(c)
        header = spec['unit'] if n == 1 else spec['header']
        name = f'{n:02d}-' + c.get('name', NAMES[kind].split('-', 1)[1])
        svg = frame(n, header, card_title(c), c.get('desc', card_title(c)), body)
        (d / f'{name}.svg').write_text(svg, encoding='utf-8', newline='\n')
        png = d / f'{name}.png'
        subprocess.run([chrome, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
                        '--window-size=1080,1080', f'--screenshot={png}', (d / f'{name}.svg').as_uri()],
                       check=True, capture_output=True, timeout=60)
        with Image.open(png) as im:
            assert im.size == (1080, 1080), (png, im.size)
        files.append(f'{name}.png')
    lines = [f"# X 討論串：{spec['title']}", '',
             f"- 用途：X 討論串，一則推文配一張 1080×1080 圖（`{files[0]}`～`{files[-1]}`）。",
             f"- 章節網址：{spec['url']}",
             '- 每則都控制在中文約 140 字內；hashtag 只放在第 1 則，共 2 個。',
             '- 圖卡由 `tools/build-photo-learn-xcards.py` 依同資料夾的 `cards.json` 產生；改字請改 cards.json 再重跑。',
             '', '---', '']
    for n, (tw, f) in enumerate(zip(spec['tweets'], files), 1):
        lines += [f'**{n}／6**（配 `{f}`）', '', tw.strip(), '']
    (d / 'caption.md').write_text('\n'.join(lines), encoding='utf-8', newline='\n')
    print(f'{slug}: ' + ', '.join(files))


def main():
    args = sys.argv[1:]
    chrome = next((c for c in CHROME if os.path.exists(c)), None) or sys.exit('找不到 Chrome／Edge')
    slugs = sorted(p.parent.name for p in SOCIAL.glob('*/cards.json')) if args == ['--all'] else args
    with tempfile.TemporaryDirectory() as tmp:
        for s in slugs:
            build(s, chrome, tmp)


if __name__ == '__main__':
    main()
