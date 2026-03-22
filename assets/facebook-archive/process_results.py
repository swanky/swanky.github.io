#!/usr/bin/env python
"""
Facebook Archive Processor
處理 Apify 抓取結果，輸出為 Markdown + JSON + 年度索引
"""

import urllib.request
import json
import os
import re
import shutil
from datetime import datetime
from pathlib import Path

def _load_token():
    env_file = Path(__file__).parent / '.env'
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith('APIFY_TOKEN='):
                return line.split('=', 1)[1].strip()
    return os.environ.get('APIFY_TOKEN', '')

TOKEN = _load_token()
RUN_ID = 'xGH38WVy4FE1Yu5qU'
DATASET_ID = 'L3c4OyhRKfUcfBP3d'
BASE_DIR = Path(__file__).parent

POSTS_DIR = BASE_DIR / 'posts'
PHOTOS_DIR = BASE_DIR / 'photos'
METADATA_DIR = BASE_DIR / 'metadata'
INDEXES_DIR = BASE_DIR / 'indexes'
LOGS_DIR = BASE_DIR / 'logs'

for d in [POSTS_DIR, PHOTOS_DIR, METADATA_DIR, INDEXES_DIR, LOGS_DIR]:
    d.mkdir(exist_ok=True)

failures = []
downloaded_images = 0
total_posts = 0


def fetch_json(url):
    resp = urllib.request.urlopen(url, timeout=30)
    return json.loads(resp.read().decode())


def download_image(url, dest_path):
    global downloaded_images
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as resp:
            with open(dest_path, 'wb') as f:
                f.write(resp.read())
        downloaded_images += 1
        return True
    except Exception as e:
        failures.append({'type': 'image', 'url': url, 'error': str(e)})
        return False


def safe_filename(s, maxlen=80):
    s = re.sub(r'[^\w\u4e00-\u9fff\-]', '_', str(s))
    return s[:maxlen]


def parse_date(post):
    """Try to extract a datetime from post data."""
    for field in ['time', 'date', 'timestamp', 'postDate']:
        val = post.get(field)
        if val:
            try:
                if isinstance(val, (int, float)):
                    return datetime.fromtimestamp(val)
                return datetime.fromisoformat(str(val).replace('Z', '+00:00'))
            except Exception:
                pass
    return None


def post_to_markdown(post, dt):
    """Convert a post dict to Markdown."""
    lines = []
    lines.append(f"# Facebook 貼文")
    lines.append(f"")

    if dt:
        lines.append(f"**日期**: {dt.strftime('%Y-%m-%d %H:%M')}")

    post_url = post.get('url') or post.get('postUrl') or post.get('link', '')
    if post_url:
        lines.append(f"**貼文連結**: {post_url}")

    likes = post.get('likes') or post.get('likesCount') or post.get('reactions', {})
    if isinstance(likes, dict):
        total_reactions = sum(v for v in likes.values() if isinstance(v, int))
        if total_reactions:
            lines.append(f"**互動數**: {total_reactions}")
    elif likes:
        lines.append(f"**互動數**: {likes}")

    comments = post.get('comments') or post.get('commentsCount', '')
    if comments:
        lines.append(f"**留言數**: {comments}")

    shares = post.get('shares') or post.get('sharesCount', '')
    if shares:
        lines.append(f"**分享數**: {shares}")

    lines.append(f"")
    lines.append(f"---")
    lines.append(f"")

    text = post.get('text') or post.get('message') or post.get('story') or ''
    if text:
        lines.append(text)
        lines.append(f"")

    # Images
    images = post.get('photos') or post.get('images') or post.get('media') or []
    if isinstance(images, list):
        for img in images:
            img_url = img if isinstance(img, str) else img.get('url') or img.get('src', '')
            if img_url:
                lines.append(f"![圖片]({img_url})")

    return '\n'.join(lines)


def process_dataset():
    global total_posts
    print(f"\n📥 Fetching dataset: {DATASET_ID}")

    # Fetch all items
    url = f'https://api.apify.com/v2/datasets/{DATASET_ID}/items?token={TOKEN}&clean=true&format=json&limit=1000'
    data = fetch_json(url)

    items = data if isinstance(data, list) else data.get('items', [])
    print(f"   Found {len(items)} items in dataset")

    # Save raw log
    with open(LOGS_DIR / 'raw_dataset.json', 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    print(f"   ✓ Raw data saved to logs/raw_dataset.json")

    # Separate page info from posts
    page_info = {}
    posts = []

    for item in items:
        item_type = item.get('type') or item.get('#debug', {}).get('type', '')
        if item_type in ('page', 'about') or 'pageName' in item or 'title' in item and 'posts' in item:
            # This item contains page info
            if not page_info:
                page_info = item
            # Extract embedded posts if any
            embedded_posts = item.get('posts', [])
            posts.extend(embedded_posts)
        elif item_type == 'post' or 'text' in item or 'message' in item or 'postUrl' in item:
            posts.append(item)
        else:
            # Unknown - save as page info fallback
            if not page_info:
                page_info = item
            else:
                posts.append(item)

    # If no posts found directly, try extracting from page_info
    if not posts and page_info:
        posts = page_info.get('posts', [])

    print(f"   Page info found: {'Yes' if page_info else 'No'}")
    print(f"   Posts found: {len(posts)}")

    # Save page metadata
    with open(METADATA_DIR / 'page_info.json', 'w', encoding='utf-8') as f:
        # Remove posts from page_info to keep it clean
        info_copy = {k: v for k, v in page_info.items() if k != 'posts'}
        json.dump(info_copy, f, ensure_ascii=False, indent=2)

    # Save all posts as JSON
    with open(POSTS_DIR / 'all_posts.json', 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    # Process posts by year
    posts_by_year = {}
    for post in posts:
        dt = parse_date(post)
        year = dt.year if dt else 'unknown'
        posts_by_year.setdefault(year, []).append((post, dt))
        total_posts += 1

    # Write Markdown files and download images
    for year, year_posts in sorted(posts_by_year.items()):
        year_dir = POSTS_DIR / str(year)
        year_dir.mkdir(exist_ok=True)

        for post, dt in year_posts:
            post_id = post.get('id') or post.get('postId') or post.get('url', '').split('/')[-1] or 'unknown'
            date_str = dt.strftime('%Y-%m-%d') if dt else 'unknown-date'
            fname = f"{date_str}_{safe_filename(post_id)}.md"

            md_content = post_to_markdown(post, dt)
            with open(year_dir / fname, 'w', encoding='utf-8') as f:
                f.write(md_content)

            # Download images
            images = post.get('photos') or post.get('images') or post.get('media') or []
            if isinstance(images, list):
                for idx, img in enumerate(images):
                    img_url = img if isinstance(img, str) else img.get('url') or img.get('src', '')
                    if img_url:
                        ext = img_url.split('?')[0].split('.')[-1][:4] or 'jpg'
                        img_fname = f"{date_str}_{safe_filename(post_id)}_{idx}.{ext}"
                        download_image(img_url, PHOTOS_DIR / img_fname)

    return page_info, posts, posts_by_year


def write_indexes(page_info, posts, posts_by_year):
    """Write index Markdown files."""

    # Overall index
    lines = ["# Facebook 封存索引 — SwankyParty", "",
             f"**封存日期**: 2026-03-22",
             f"**貼文總數**: {total_posts}",
             f"**下載圖片**: {downloaded_images}",
             "", "## 年度索引", ""]

    for year in sorted(posts_by_year.keys()):
        count = len(posts_by_year[year])
        lines.append(f"- [{year}年 ({count} 篇)](./{year}_index.md)")

    lines += ["", "## 頁面基本資訊", ""]
    if page_info:
        for k, v in page_info.items():
            if k not in ('posts', 'photos') and isinstance(v, (str, int, float, bool)):
                lines.append(f"- **{k}**: {v}")

    with open(INDEXES_DIR / 'index.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    # Per-year indexes
    for year, year_posts in sorted(posts_by_year.items()):
        lines = [f"# {year} 年貼文索引", "", f"共 {len(year_posts)} 篇", "", "| 日期 | 預覽 | 連結 |",
                 "|------|------|------|"]
        for post, dt in sorted(year_posts, key=lambda x: x[1] or datetime.min, reverse=True):
            date_str = dt.strftime('%Y-%m-%d') if dt else '-'
            text = (post.get('text') or post.get('message') or '')[:50].replace('\n', ' ')
            post_url = post.get('url') or post.get('postUrl') or ''
            link = f"[原文]({post_url})" if post_url else '-'
            lines.append(f"| {date_str} | {text}... | {link} |")

        with open(INDEXES_DIR / f'{year}_index.md', 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))

    # Failures list
    lines = ["# 失敗清單", "",
             f"共 {len(failures)} 個項目失敗", ""]
    if failures:
        lines += ["| 類型 | URL | 錯誤 |", "|------|-----|------|"]
        for f_item in failures:
            lines.append(f"| {f_item.get('type','?')} | {f_item.get('url','-')[:60]} | {f_item.get('error','-')[:60]} |")
    else:
        lines.append("✓ 無失敗項目")

    with open(INDEXES_DIR / 'failures.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))


def write_run_report(run_data):
    """Save the run metadata report."""
    report = {
        'run_id': RUN_ID,
        'dataset_id': DATASET_ID,
        'archive_date': '2026-03-22',
        'source_url': 'https://www.facebook.com/SwankyParty',
        'tool': 'apify/facebook-pages-scraper',
        'total_posts_archived': total_posts,
        'images_downloaded': downloaded_images,
        'failures_count': len(failures),
        'apify_run_stats': run_data.get('stats', {}),
        'disclaimer': '本封存僅包含本次執行時可公開取得的內容，不代表完整備份。'
    }
    with open(METADATA_DIR / 'run_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    print("🚀 Facebook Archive Processor")
    print("=" * 50)

    # Fetch run info
    print(f"\n📊 Fetching run info: {RUN_ID}")
    run_data = fetch_json(f'https://api.apify.com/v2/acts/apify~facebook-pages-scraper/runs/{RUN_ID}?token={TOKEN}')
    run_info = run_data.get('data', {})
    status = run_info.get('status')
    print(f"   Status: {status}")
    print(f"   Stats: {json.dumps(run_info.get('stats', {}), indent=4)}")

    if status == 'SUCCEEDED':
        page_info, posts, posts_by_year = process_dataset()
        write_indexes(page_info, posts, posts_by_year)
        write_run_report(run_info)

        print(f"\n{'='*50}")
        print(f"✅ 封存完成！")
        print(f"   貼文數: {total_posts}")
        print(f"   下載圖片: {downloaded_images}")
        print(f"   失敗項目: {len(failures)}")
        print(f"   年份範圍: {sorted(posts_by_year.keys())}")
    elif status == 'RUNNING':
        print("\n⏳ Actor still running. Re-run this script when complete.")
    else:
        print(f"\n❌ Run not succeeded: {status}")
        print("   Check logs/raw_run.json for details")
        with open(LOGS_DIR / 'raw_run.json', 'w', encoding='utf-8') as f:
            json.dump(run_info, f, ensure_ascii=False, indent=2)
