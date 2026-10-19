"""看懂寫真：產生各頁的社群預覽圖（og_image，1200×630 JPEG）。

規則（docs/photography-study-zone-plan-2026-10.md §11-B2）：
- 不用他人作品小圖（assets/img/photo-learn/works/）當預覽圖；只用站主自己的作品或文字型設計圖。
- 章節頁與攝影師／模特兒單人段：左邊章名，右邊放該頁「我的作品對照」那張站主作品，
  等比縮進框內、不裁切，圖下標「史旺基作品〈…〉」，避免被誤認成文中攝影師的作品。
- 專區首頁、圖鑑目錄頁、模特兒圖鑑、藝術筆記：只有文字（藝術筆記的作品圖屬他人，不放）。
- 視覺沿用 X 圖卡（docs/social/photo-learn/）：墨底 #141412、細框 #3A3934、金 #F5C53B／#E5A300、米白字。

用法（需要本機 Chrome 與 Pillow）：
  python -X utf8 tools/build-photo-learn-og.py            # 產生圖檔到 assets/img/photo-learn/og/
  python -X utf8 tools/build-photo-learn-og.py --write    # 另外把 og_image 等欄位寫進各頁 front matter
可重跑；圖檔與 front matter 欄位都會覆寫成最新內容。
"""
import argparse
import html
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'img' / 'photo-learn' / 'og'
CHROME_CANDIDATES = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
]
W, H = 1200, 630


def front_matter(path):
    text = path.read_text(encoding='utf-8')
    m = re.match(r'^---\r?\n(.*?)\r?\n---\r?\n', text, re.S)
    return yaml.safe_load(m.group(1)) if m else {}


def own_work_from_html(text):
    """取頁面「我的作品對照」第一張 figure.pl-own 的原圖路徑與圖說。"""
    m = re.search(r'<figure class="pl-own[^"]*">(.*?)</figure>', text, re.S)
    if not m:
        return None
    blk = m.group(1)
    src = re.search(r"""(?:image=|href=)["'](/assets/img/[^"']+)["']""", blk)
    cap = re.search(r'<figcaption>(.*?)</figcaption>', blk, re.S)
    if not src:
        return None
    return {'src': src.group(1), 'caption': short_caption(cap.group(1) if cap else '史旺基作品')}


def short_caption(cap):
    cap = re.sub(r'<[^>]+>', '', cap).replace('點圖放大。', '').strip().rstrip('。')
    if '〉' in cap:
        cap = cap[: cap.index('〉') + 1]
    elif len(cap) > 30:
        cap = cap.split('，')[0]
    cap = cap.replace('史旺基作品，', '史旺基作品・')
    return cap


def split_title(title):
    if '：' in title:
        a, b = title.split('：', 1)
        return a, b
    return title, ''


def card_html(kicker, title, subtitle, photo=None, extra=None):
    """photo: {'path': 本機檔, 'caption': 字}；extra: 文字卡底下的一行補充。"""
    esc = html.escape
    if photo:
        img = Path(photo['path']).as_uri()
        right = f'''
  <figure class="ph"><div class="ph-box"><img src="{img}" alt=""></div>
    <figcaption>{esc(photo['caption'])}</figcaption></figure>'''
        main_cls = 'with-photo'
    else:
        right = ''
        main_cls = 'text-only'
    extra_html = f'<p class="extra">{esc(extra)}</p>' if extra else ''
    sub_html = f'<p class="sub">{esc(subtitle)}</p>' if subtitle else ''
    return f'''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><style>
html,body{{margin:0;width:{W}px;height:{H}px;overflow:hidden;background:#141412}}
body{{font-family:"Microsoft JhengHei","Noto Sans TC","Malgun Gothic","Yu Gothic","Meiryo",sans-serif;color:#F3EFE6;position:relative}}
.frame{{position:absolute;left:28px;top:28px;width:1140px;height:570px;border:2px solid #3A3934;box-sizing:border-box}}
.top{{position:absolute;left:64px;right:64px;top:56px;height:44px;display:flex;align-items:baseline;gap:14px;border-bottom:2px solid #3A3934;font-size:26px}}
.top b{{color:#F5C53B;font-weight:700}} .top span{{color:#B9B3A8}}
.foot{{position:absolute;left:64px;bottom:52px;font-size:22px;color:#B9B3A8}}
.main{{position:absolute;left:64px;top:132px;bottom:100px;display:flex;flex-direction:column;justify-content:center}}
.with-photo .main{{width:590px}} .text-only .main{{right:64px}}
h1{{margin:0;font-size:60px;line-height:1.18;font-weight:700;color:#F3EFE6;word-break:normal;overflow-wrap:anywhere}}
.text-only h1{{font-size:76px}} h1.long{{font-size:50px}}
.sub{{margin:22px 0 0;font-size:38px;line-height:1.35;font-weight:700;color:#F5C53B}}
.text-only .sub{{font-size:42px}}
.extra{{margin:26px 0 0;font-size:28px;line-height:1.5;color:#D8D3C9}}
.ph{{position:absolute;right:64px;top:126px;width:440px;height:444px;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center}}
.ph-box{{width:440px;display:flex;align-items:center;justify-content:center}}
.ph-box img{{max-width:440px;max-height:404px;width:auto;height:auto;display:block;outline:1px solid #3A3934}}
.ph figcaption{{margin-top:12px;font-size:20px;color:#B9B3A8;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:440px}}
</style></head><body class="{main_cls}"><div class="frame"></div>
<div class="top"><b>看懂寫真</b><span>｜{esc(kicker)}</span></div>
<div class="main"><h1{' class="long"' if (photo and len(title) > 9) else ''}>{esc(title)}</h1>{sub_html}{extra_html}</div>{right}
<div class="foot">swanky.github.io　史旺基的攝影學習筆記</div>
</body></html>'''


def find_chrome():
    for c in CHROME_CANDIDATES:
        if os.path.exists(c):
            return c
    sys.exit('找不到 Chrome／Edge')


def render(chrome, html_text, out_jpg, tmpdir):
    page = Path(tmpdir) / (out_jpg.stem + '.html')
    png = Path(tmpdir) / (out_jpg.stem + '.png')
    page.write_text(html_text, encoding='utf-8')
    subprocess.run([chrome, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
                    '--allow-file-access-from-files', f'--window-size={W},{H}', f'--screenshot={png}', page.as_uri()],
                   check=True, capture_output=True, timeout=60)
    im = Image.open(png).convert('RGB')
    if im.size != (W, H):
        im = im.crop((0, 0, W, H))
    out_jpg.parent.mkdir(parents=True, exist_ok=True)
    im.save(out_jpg, 'JPEG', quality=86, optimize=True, progressive=True)


def jobs():
    zone = yaml.safe_load((ROOT / '_data' / 'photo_learn.yml').read_text(encoding='utf-8'))
    out = []
    n_ch = 0
    for i, u in enumerate(zone['units'], 1):
        unit_label = f"U{u['id'][1:]} {u['title']}" if re.match(r'u\d+$', u['id']) else u['title']
        for ch in u['chapters']:
            if ch.get('status') != 'published' or not ch.get('url'):
                continue
            n_ch += 1
            page = ROOT / ch['url'].strip('/') / 'index.html'
            text = page.read_text(encoding='utf-8')
            own = own_work_from_html(text)
            a, b = split_title(ch['title'])
            photo = None
            if own:
                photo = {'path': str(ROOT / own['src'].lstrip('/')), 'caption': own['caption']}
            slug = ch['url'].strip('/').split('/')[-1]
            alt = f"「看懂寫真」〈{ch['title']}〉的預覽圖"
            alt += f"，右邊是{own['caption']}" if own else ''
            out.append(dict(slug=slug, page=page, kicker=unit_label, title=a, subtitle=b, photo=photo, alt=alt))
    # 藝術筆記（作品屬他人，只做文字卡）
    for note in zone.get('art_notes', {}).get('notes', []):
        if note.get('status') != 'published' or not note.get('url'):
            continue
        page = ROOT / note['url'].strip('/') / 'index.html'
        a, b = split_title(note['title'])
        slug = note['url'].strip('/').split('/')[-1]
        out.append(dict(slug=slug, page=page, kicker='藝術筆記', title=a, subtitle=b, photo=None,
                        alt=f"「看懂寫真」藝術筆記〈{note['title']}〉的預覽圖，只有文字"))
    # 圖鑑
    atlas_dir = ROOT / '_data' / 'photo_atlas'
    pho_index = ROOT / 'photography' / 'learn' / 'photographers' / 'index.html'
    mod_index = ROOT / 'photography' / 'learn' / 'models' / 'index.html'
    pho_ids = front_matter(pho_index)['people_ids']
    mod_ids = front_matter(mod_index)['people_ids']
    people = {pid: yaml.safe_load((atlas_dir / f'{pid}.yml').read_text(encoding='utf-8')) for pid in pho_ids + mod_ids}

    def disp(p):
        return f"{p['zh']} {p['name']}" if p.get('zh') else p['name']

    for pid in pho_ids:
        p = people[pid]
        own = own_work_from_html(p.get('works_after', '') or '')
        photo = {'path': str(ROOT / own['src'].lstrip('/')), 'caption': own['caption']} if own else None
        page = ROOT / 'photography' / 'learn' / 'photographers' / pid / 'index.html'
        alt = f"「看懂寫真」攝影師圖鑑：{disp(p)}，{p['theme']}"
        alt += f"；右邊是{own['caption']}" if own else ''
        out.append(dict(slug=f'photographer-{pid}', page=page, kicker='攝影師圖鑑', title=disp(p), subtitle=p['theme'],
                        photo=photo, alt=alt))
    names = '、'.join(people[i]['zh'] if people[i].get('zh') else people[i]['name'] for i in pho_ids)
    out.append(dict(slug='photographers', page=pho_index, kicker='圖鑑', title='攝影師圖鑑',
                    subtitle=f'{len(pho_ids)} 位攝影師，一人一頁', photo=None, extra=names,
                    alt=f'「看懂寫真」攝影師圖鑑：{len(pho_ids)} 位攝影師，一人一頁（{names}）'))
    mnames = '、'.join(people[i]['name'] for i in mod_ids)
    out.append(dict(slug='models', page=mod_index, kicker='圖鑑', title='模特兒圖鑑',
                    subtitle='同一個人，在不同攝影師面前的樣子', photo=None, extra=f'收錄 {mnames}',
                    alt=f'「看懂寫真」模特兒圖鑑：收錄 {mnames}'))
    out.append(dict(slug='learn', page=ROOT / 'photography' / 'learn' / 'index.html', kicker='專區首頁',
                    title=zone['name'], subtitle='看懂一位攝影師，就多學會一種拍法',
                    extra=f'{n_ch} 章筆記・攝影師圖鑑 {len(pho_ids)} 位・模特兒圖鑑 {len(mod_ids)} 位',
                    photo=None, alt=f"「{zone['name']}」社群預覽圖：{zone['subtitle']}"))
    return out


def write_front_matter(page, url, alt):
    text = page.read_text(encoding='utf-8')
    m = re.match(r'^(---\r?\n)(.*?)(\r?\n---\r?\n)', text, re.S)
    head, fm, tail = m.group(1), m.group(2), m.group(3)
    nl = '\r\n' if '\r\n' in head else '\n'
    lines = [l for l in fm.split(nl) if not re.match(r'^(og_image|og_image_width|og_image_height|og_image_alt):', l)]
    block = [f'og_image: {url}', 'og_image_width: 1200', 'og_image_height: 630', f'og_image_alt: "{alt}"']
    idx = next((i for i, l in enumerate(lines) if l.startswith('description:')), None)
    if idx is None:
        idx = next(i for i, l in enumerate(lines) if l.startswith('title:'))
    lines[idx + 1:idx + 1] = block
    page.write_text(head + nl.join(lines) + tail + text[m.end():], encoding='utf-8', newline='')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--write', action='store_true', help='把 og_image 欄位寫進各頁 front matter')
    ap.add_argument('--only', help='只做 slug 含這段字的')
    args = ap.parse_args()
    chrome = find_chrome()
    with tempfile.TemporaryDirectory() as tmp:
        for j in jobs():
            if args.only and args.only not in j['slug']:
                continue
            assert '"' not in j['alt']
            if j['photo']:
                assert '/photo-learn/works/' not in j['photo']['path'].replace('\\', '/'), '不得用他人作品小圖'
                assert os.path.exists(j['photo']['path']), j['photo']['path']
            out = OUT / f"{j['slug']}.jpg"
            render(chrome, card_html(j['kicker'], j['title'], j['subtitle'], j['photo'], j.get('extra')), out, tmp)
            url = '/' + out.relative_to(ROOT).as_posix()
            print(f"{url}  {out.stat().st_size // 1024}KB  ← {j['page'].relative_to(ROOT).as_posix()}")
            if args.write:
                write_front_matter(j['page'], url, j['alt'])


if __name__ == '__main__':
    main()
