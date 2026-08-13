import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');
const pages = [
  'photography/gallery.html',
  'photography/personal-works.html',
  'photography/commercial-works.html',
  'photography/photo-albums.html',
  'photography/awards.html',
  'photography/for-your-safety.html',
  'photography/uniform-girl.html',
  'photography/archive.html',
];
const sources = Object.fromEntries(pages.map((page) => [page, read(page)]));

function extractYamlList(source, key) {
  const start = source.indexOf(`${key}:`);
  assert.notEqual(start, -1, `缺少 ${key}`);
  const tail = source.slice(start + key.length + 1);
  const nextRootKey = tail.search(/^\S[^\n]*:\s*$/m);
  return nextRootKey === -1 ? tail : tail.slice(0, nextRootKey);
}

function values(block, key) {
  return [...block.matchAll(new RegExp(`^\\s+-?\\s*${key}:\\s*["']?([^"'\\n]+)`, 'gm'))]
    .map((match) => match[1].trim());
}

test('攝影策展資料有 12–18 張可追溯的 Signature Works', () => {
  const data = read('_data/photography_masterpieces.yml');
  const signatures = extractYamlList(data, 'signature_works');
  const ids = values(signatures, 'photo_id');
  const images = values(signatures, 'image');
  const urls = values(signatures, 'flickr_url');

  assert.ok(ids.length >= 12 && ids.length <= 18, `Signature Works 應為 12–18 張，目前 ${ids.length}`);
  assert.equal(new Set(ids).size, ids.length, 'Signature photo ID 不可重複');
  assert.equal(images.length, ids.length);
  assert.equal(urls.length, ids.length);
  assert.deepEqual(images.filter((image) => /album_\d+/.test(image)), [], 'Signature 不可使用相簿封面');
  assert.deepEqual(urls.filter((url) => !/^https:\/\/www\.flickr\.com\/photos\/swanky-hsiao\/\d+\/?$/.test(url)), []);
  assert.deepEqual(images.filter((image) => !existsSync(join(root, image.replace(/^\//, '')))), []);
});

test('永久公開排除的 Flickr 相簿不會進正式策展資料', () => {
  const data = read('_data/photography_masterpieces.yml');
  assert.doesNotMatch(data, /72157690287304332/);
});

test('Flickr 1,110 組相簿都有策展角色，並產生可深入選片的候選池', () => {
  const curation = JSON.parse(read('_data/photography_album_curation.json'));
  const ids = curation.album_decisions.map((album) => album.id);
  assert.equal(curation.summary.analyzed_albums, 1110);
  assert.equal(curation.summary.excluded_albums, 1);
  assert.equal(ids.length, 1109);
  assert.equal(new Set(ids).size, 1109);
  assert.ok(curation.candidate_albums.length >= 120 && curation.candidate_albums.length <= 180);
  assert.ok(curation.candidate_albums.every((album) => album.sample_target <= 15));
  assert.doesNotMatch(JSON.stringify(curation), /72157690287304332/);
});

test('共用子頁 Hero 保留同頁 fragment，不把 CTA 轉到網站首頁', () => {
  const hero = read('_includes/photography/subpage-hero.html');
  assert.match(hero, /primary_prefix == '#'/);
  assert.match(hero, /secondary_prefix == '#'/);
});

test('攝影子頁圖片有尺寸資料與響應式衍生檔', () => {
  const manifest = JSON.parse(read('_data/photography_image_manifest.json'));
  assert.ok(Object.keys(manifest).length >= 80);
  for (const [source, image] of Object.entries(manifest)) {
    assert.ok(image.width > 0 && image.height > 0, `${source} 缺少尺寸`);
    assert.ok(existsSync(join(root, source)), `${source} 不存在`);
    for (const key of ['src_480', 'src_960']) {
      if (image[key]) assert.ok(existsSync(join(root, image[key])), `${image[key]} 不存在`);
    }
  }
  assert.match(read('photography/for-your-safety.html'), /responsive-image\.html/);
  assert.match(read('_includes/photography/work-card.html'), /responsive-image\.html/);
});

test('攝影系列列表使用響應式圖片，不傳送超出顯示需求的原圖', () => {
  const gallery = read('photography/gallery.html');
  const author = read('_data/photography_author.yml');
  const seriesImages = values(extractYamlList(author, 'series'), 'image');
  const manifest = JSON.parse(read('_data/photography_image_manifest.json'));

  assert.match(gallery, /responsive-image\.html image=series\.image/);
  assert.doesNotMatch(gallery, /<img[^>]+src="{{ series\.image/);
  assert.ok(seriesImages.length > 0, '攝影系列缺少圖片');
  for (const image of seriesImages) {
    assert.ok(manifest[image]?.src_480, `${image} 缺少 480px 衍生圖`);
    assert.ok(manifest[image]?.src_960, `${image} 缺少 960px 衍生圖`);
  }
});

test('獎項保留官方查證來源', () => {
  const awards = read('_data/photography_awards.yml');
  assert.equal((awards.match(/^\s+source_url:/gm) || []).length, 6);
  assert.equal((awards.match(/^\s+source_note:/gm) || []).length, 2);
  assert.doesNotMatch(awards, /zoomwin\.php/);
  assert.doesNotMatch(awards, /^\s+source_url: http:/gm);
  assert.match(awards, /result: 榮譽提名/);
  assert.match(read('photography/awards.html'), /award\.source_label/);
});

test('制服歷史頁連結的簽書會照片使用可部署檔名', () => {
  const history = read('photography/uniform-girl-history.html');
  const paths = [...history.matchAll(/'(\/assets\/img\/uniform\/ug1\/iPhone_[^']+)'/g)].map((match) => match[1]);
  assert.equal(paths.length, 11);
  for (const path of paths) {
    assert.ok(existsSync(join(root, path)), `${path} 原圖不存在`);
  }
});

test('攝影子頁共用新版作者視覺，不靠 AOS 才能看見核心內容', () => {
  for (const [page, source] of Object.entries(sources)) {
    assert.match(source, /photo-author-subpage/, `${page} 尚未接入新版攝影子頁框架`);
    assert.doesNotMatch(source, /data-aos=/, `${page} 的核心內容仍依賴 AOS`);
  }
});

test('攝影子頁不再把主要資訊藏在 More 或 hover-only 舊卡片', () => {
  for (const [page, source] of Object.entries(sources)) {
    assert.doesNotMatch(source, />\s*More\s*</, `${page} 仍使用 More`);
    assert.doesNotMatch(source, /portfolio-wrap/, `${page} 仍使用 hover-only portfolio card`);
  }
});

test('人物作品與商業合作使用不同內容角色', () => {
  const personal = read('photography/personal-works.html');
  const commercial = read('photography/commercial-works.html');
  assert.match(personal, /site\.data\.photography_masterpieces\.portfolio_works/);
  assert.match(commercial, /site\.data\.photography_commercial_cases/);
  assert.doesNotMatch(commercial, /photography_masterpieces\.portfolio_works/);
});

test('商業案例的公開角色與 Flickr set 標題一致', () => {
  const cases = read('_data/photography_commercial_cases.yml');
  assert.match(cases, /title: 施文彬《文跡奇武②麻雀雖小》/);
  assert.match(cases, /role: MV 拍攝現場側拍/);
  assert.doesNotMatch(cases, /title: 施文彬專輯平面攝影/);
  assert.match(cases, /title: 《舞琉璃》/);
  assert.match(cases, /role: 舞台劇照與工作紀錄/);
  assert.doesNotMatch(cases, /title: 《戰．舞》/);
});

test('委託與活動頁實際呈現每個公開案例的 Flickr 選片', () => {
  const photos = JSON.parse(read('_data/photography_commercial_photos.json'));
  assert.equal(Object.keys(photos).length, 6);
  assert.equal(Object.values(photos).flat().length, 21);
  for (const [caseId, items] of Object.entries(photos)) {
    assert.ok(items.length >= 3, `${caseId} 少於三張作品`);
    for (const item of items) {
      assert.ok(existsSync(join(root, item.image)), `${item.image} 不存在`);
      assert.match(item.photo_url, /^https:\/\/www\.flickr\.com\/photos\/swanky-hsiao\/\d+\/$/);
      assert.ok(item.width > 0 && item.height > 0 && item.bytes > 0);
      assert.match(item.sha256, /^[0-9a-f]{64}$/);
    }
  }
  assert.match(read('photography/commercial-works.html'), /photography_commercial_photos/);
});

test('攝影出版頁只顯示正文已核查的八筆報導證據', () => {
  const publications = read('_data/photography_publications.yml');
  assert.equal((publications.match(/^\s+- relation:/gm) || []).length, 8);
  assert.equal((publications.match(/^\s+archived: true/gm) || []).length, 3);
  assert.match(publications, /未逐一列出參與攝影師/);
  assert.match(read('photography/photo-albums.html'), /相關報導與公開紀錄/);
});

test('攝影作品圖片預設保留完整比例', () => {
  const css = read('assets/css/photography.css');
  assert.doesNotMatch(css, /object-fit:\s*cover/);
  assert.match(css, /\.photo-author-subpage[\s\S]*?\.photo-subpage-image[\s\S]*?height:\s*auto/);
});

test('攝影首頁 Hero 在桌機保留足夠標題寬度', () => {
  const css = read('assets/css/photography.css');
  assert.match(css, /\.photo-author-hero\s*{[\s\S]*?grid-template-columns:\s*minmax\(0, 1\.35fr\) minmax\(360px, 0\.82fr\)/);
  assert.match(css, /\.photo-author-hero-copy\s*{[\s\S]*?padding:\s*clamp\(48px, 8vw, 120px\) clamp\(32px, 3vw, 56px\)/);
  assert.match(css, /\.photo-author-hero h1\s*{[\s\S]*?font-size:\s*clamp\(2\.8rem, 4\.8vw, 5\.6rem\)/);
});

test('低解析出版封面只縮小、不被版面放大', () => {
  const css = read('assets/css/photography.css');
  assert.match(
    css,
    /\.photo-author-subpage \.photo-subpage-publication > \.photo-subpage-image\s*{[\s\S]*?width:\s*auto;[\s\S]*?max-width:\s*100%;/,
  );
});

test('Archive 深色區的資料卡使用高對比配色', () => {
  const css = read('assets/css/photography.css');
  assert.match(css, /\.photo-author-section:not\(\.photo-author-light\) \.photo-subpage-archive-grid a/);
  assert.match(css, /background: var\(--photo-surface\)/);
  assert.match(css, /color: #f5f1e8 !important/);
});

test('制服系列頁說清楚五本制服相關出版的不同角色', () => {
  const uniform = read('photography/uniform-girl.html');
  assert.match(uniform, /三本個人作品書，兩本合作出版/);
  assert.match(uniform, /《高校制服戀物論》擔任攝影/);
  assert.match(uniform, /《2015臺灣高校制服年鑑》拍攝/);
  assert.match(uniform, /unless book\.role == '個人攝影作品書'/);
});

test('攝影子頁訪客文案不出現內部策展話術', () => {
  const forbidden = ['A 級', 'B 級', 'owner favorite', 'owner-confirmed', 'EXIF', 'metadata', 'Signature card', 'Phase 1', 'Phase 2'];
  for (const [page, source] of Object.entries(sources)) {
    for (const term of forbidden) assert.ok(!source.includes(term), `${page} 洩漏內部詞：${term}`);
  }
});

test('完整作品導覽先展示作品，再展示人物名氣與 Flickr 檔案', () => {
  const gallery = sources['photography/gallery.html'];
  const works = gallery.indexOf('id="signature-works"');
  const series = gallery.indexOf('id="selected-series"');
  const people = gallery.indexOf('id="people-archive"');
  const archive = gallery.indexOf('id="flickr-archive"');
  assert.ok(works >= 0 && works < series && series < people && people < archive);
});
