import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(REPO_ROOT, path), 'utf8');
const postFiles = readdirSync(join(REPO_ROOT, '_posts'));

const articles = [
  {
    file: '_posts/2026-08-28-ai-video-production-rehearsal-seedance-workflow.md',
    slug: 'ai-video-production-rehearsal-seedance-workflow',
    context: 'agentic',
    hubs: ['technical/agentic-engineering/index.html'],
  },
  {
    file: '_posts/2026-07-23-production-ai-agent-control-planes.md',
    slug: 'production-ai-agent-control-planes',
    context: 'ai-agent',
    hubs: ['technical/agentic-engineering/index.html'],
  },
  {
    file: '_posts/2026-07-25-fake-world-assets-fwa-deep-dive.md',
    slug: 'fake-world-assets-fwa-deep-dive',
    context: 'web3',
    hubs: ['education/crypto/web3-essentials/index.html'],
  },
  {
    file: '_posts/2026-08-07-ai-agent-wallet-permission-boundaries.md',
    slug: 'ai-agent-wallet-permission-boundaries',
    context: 'web3',
    hubs: [
      'technical/agentic-engineering/index.html',
      'education/crypto/web3-essentials/index.html',
    ],
  },
  {
    file: '_posts/2026-08-08-ai-moderation-jinpingmei.md',
    slug: 'ai-moderation-jinpingmei',
    context: 'ai-visual',
    hubs: ['jinpingmei/index.html'],
  },
  {
    file: '_posts/2026-08-08-jinpingmei-character-lab.md',
    slug: 'jinpingmei-character-lab',
    context: 'ai-visual',
    hubs: ['jinpingmei/index.html'],
  },
  {
    file: '_posts/2026-08-08-matt-pocock-skills-ai-coding-workflow.md',
    slug: 'matt-pocock-skills-ai-coding-workflow',
    context: 'agentic',
    hubs: ['technical/agentic-engineering/index.html'],
  },
];

function frontMatter(source) {
  const match = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, '文章缺少 front matter');
  return match[1];
}

function relatedSlugs(frontMatterSource) {
  const block = frontMatterSource.match(/^related_posts:\r?\n((?:  - .+\r?\n?)+)/m)?.[1] ?? '';
  return [...block.matchAll(/^  - (.+)$/gm)].map((match) => match[1].trim());
}

test('新文章具備 SEO、封面替代文字、對應 CTA 與長文中段入口', () => {
  for (const article of articles) {
    const source = read(article.file);
    const metadata = frontMatter(source);
    const cover = metadata.match(/^cover_image:\s*(\S+)$/m)?.[1];

    assert.match(metadata, /^layout:\s*article$/m, `${article.slug} layout 不是 article`);
    assert.match(metadata, /^seo_title:\s*.+$/m, `${article.slug} 缺 seo_title`);
    assert.match(metadata, /^cover_alt:\s*".+"$/m, `${article.slug} 缺白話封面 alt`);
    assert.match(metadata, new RegExp(`^cta_context:\\s*${article.context}$`, 'm'));
    assert.ok(cover?.endsWith('.jpg'), `${article.slug} 封面不是 .jpg`);
    assert.ok(existsSync(join(REPO_ROOT, cover.slice(1))), `${article.slug} 封面檔不存在`);
    assert.ok((source.match(/^## /gm) ?? []).length >= 5, `${article.slug} 未達中段 CTA 門檻`);
  }
});

test('AI 影片彩排文章沿用站內摘要、大綱、參考資料與嵌入播放器格式', () => {
  const source = read('_posts/2026-08-28-ai-video-production-rehearsal-seedance-workflow.md');
  const mainJs = read('assets/js/main.js');
  const style = read('assets/css/style.css');

  assert.match(source, /<div class="article-tldr">/);
  assert.match(source, /<span class="article-tldr-label">30 秒結論<\/span>/);
  assert.match(source, /<nav class="article-toc article-toc--outline" aria-label="文章大綱">/);
  assert.match(source, /<ol class="article-toc-parts">/);
  assert.match(source, /^---\r?\n\r?\n## 參考資料\r?$/m);
  assert.match(source, /^\- \*\*\[1\]\*\* \[[^\]]+\]\(https:\/\//m);
  assert.equal((source.match(/youtube-nocookie\.com\/embed\//g) ?? []).length, 3);
  assert.match(source, /^use_glightbox:\s*true$/m);
  assert.equal((source.match(/class="portfolio-lightbox"/g) ?? []).length, 10);
  assert.equal((source.match(/data-gallery="ai-video-rehearsal"/g) ?? []).length, 10);
  assert.match(mainJs, /const initPortfolioLightbox = \(\) =>/);
  assert.match(mainJs, /window\.__portfolioLightbox = GLightbox/);
  assert.match(mainJs, /window\.addEventListener\('load', initPortfolioLightbox/);
  assert.match(style, /\.post-content a\.portfolio-lightbox\s*\{[\s\S]*?cursor:\s*zoom-in/);

  for (const [file, height] of [
    ['production-gates.svg', 720],
    ['control-modes.svg', 720],
    ['reference-failure-map.svg', 760],
    ['cost-and-rolls.svg', 720],
  ]) {
    const svg = read(`assets/img/ai-video-production-rehearsal/${file}`);
    assert.match(svg, new RegExp(`<svg[^>]+width="1200"[^>]+height="${height}"`));
  }
});

test('文章正文不再放通用 AI 圖片揭露樣板', () => {
  for (const file of postFiles.filter((name) => name.endsWith('.md'))) {
    const source = read(`_posts/${file}`);
    assert.doesNotMatch(
      source,
      /AI 圖片揭露|封面為 AI 生成概念圖|Banner 為 AI 生成概念圖/,
      `${file} 仍含通用 AI 圖片揭露`,
    );
  }
});

test('每篇新文章都有對應 hub 入口', () => {
  for (const article of articles) {
    for (const hub of article.hubs) {
      assert.match(read(hub), new RegExp(article.slug), `${hub} 未收錄 ${article.slug}`);
    }
  }
});

test('每篇新文章的三篇延伸閱讀都能解析到現有文章', () => {
  for (const article of articles) {
    const related = relatedSlugs(frontMatter(read(article.file)));
    assert.equal(related.length, 3, `${article.slug} 延伸閱讀不是三篇`);

    for (const slug of related) {
      const exists = postFiles.some((file) => (
        file.endsWith(`-${slug}.md`) || file.endsWith(`-${slug}.html`)
      ));
      assert.ok(exists, `${article.slug} 的延伸閱讀不存在：${slug}`);
    }
  }
});

test('文章 layout、CTA 與延伸閱讀 include 支援 front matter 接線', () => {
  const layout = read('_layouts/article.html');
  const midCta = read('_includes/article-cta-mid.html');
  const endCta = read('_includes/article-cta.html');
  const related = read('_includes/related-posts.html');

  assert.match(layout, /h2_parts\.size >= 6/);
  assert.match(layout, /include article-cta-mid\.html/);
  assert.match(layout, /page\.cover_alt \| default: page\.title/);
  for (const context of ['ai-agent', 'web3', 'ai-visual', 'agentic']) {
    assert.match(midCta, new RegExp(`cta_context == '${context}'`));
    assert.match(endCta, new RegExp(`cta_context == '${context}'`));
  }
  assert.match(related, /page\.related_posts/);
  assert.match(related, /item\.url contains slug/);
});

test('文章仍由 jekyll-sitemap 收錄並輸出 BlogPosting schema', () => {
  assert.match(read('_config.yml'), /^\s*- jekyll-sitemap$/m);
  assert.match(read('_includes/post-jsonld.html'), /"@type": "BlogPosting"/);
  assert.match(read('_layouts/article.html'), /include post-jsonld\.html/);
});
