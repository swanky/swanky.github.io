"""建置後檢查：找出畫面上看得到、卻沒有做成超連結的網址（讀者得自己複製才能開）。

用法（先跑完 bundle exec jekyll build）：
    python -X utf8 tools/check-bare-urls.py [_site]
有命中就列出「頁面  次數  第一個網址」並以 exit code 1 結束；全乾淨印 pages: 0。
<a>、<script>、<style>、<code>、<pre>、<textarea>、<title> 裡的文字不算（程式碼範例本來就該顯示原網址）。
nft/ 是獨立 mini-site、assets/ 是靜態資源，不掃。只用標準函式庫。
"""
import os
import re
import sys
from html.parser import HTMLParser

SKIP_TAGS = ('a', 'script', 'style', 'code', 'pre', 'textarea', 'title')
VOID_TAGS = ('br', 'img', 'meta', 'link', 'input', 'hr', 'source', 'wbr', 'area', 'base', 'col', 'embed', 'track')
URL_RE = re.compile(r'https?://[^\s<>）)，；、」]+')


class BareUrlFinder(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.hits = []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID_TAGS:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in self.stack:
            while self.stack and self.stack.pop() != tag:
                pass

    def handle_data(self, data):
        if any(t in self.stack for t in SKIP_TAGS):
            return
        self.hits.extend(m.group(0) for m in URL_RE.finditer(data))


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else '_site'
    if not os.path.isdir(root):
        sys.exit(f'{root} 不存在，請先 bundle exec jekyll build')
    pages = 0
    for dirpath, _dirs, files in os.walk(root):
        rel = os.path.relpath(dirpath, root).replace(os.sep, '/')
        if rel.split('/')[0] in ('nft', 'assets'):
            continue
        for name in files:
            if not name.endswith('.html'):
                continue
            path = os.path.join(dirpath, name)
            finder = BareUrlFinder()
            with open(path, encoding='utf8', errors='ignore') as fh:
                finder.feed(fh.read())
            if finder.hits:
                pages += 1
                print(os.path.relpath(path, root).replace(os.sep, '/'), len(finder.hits), finder.hits[0][:90])
    print('pages:', pages)
    sys.exit(1 if pages else 0)


if __name__ == '__main__':
    main()
