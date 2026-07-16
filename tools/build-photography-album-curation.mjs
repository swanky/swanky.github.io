import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
const sourcePath = resolve(root, '_data/flickr_albums.yml');
const outputPath = resolve(root, '_data/photography_album_curation.json');
const source = readFileSync(sourcePath, 'utf8');

const unquote = (value = '') => value.trim().replace(/^"|"$/g, '').replaceAll('\\"', '"');
const albums = source.split(/(?=^  - id:)/m).slice(1).map((block) => {
  const field = (name) => unquote(block.match(new RegExp(`^\\s+(?:-\\s+)?${name}:\\s*(.+)$`, 'm'))?.[1]);
  return {
    id: field('id'),
    title: field('title'),
    url: field('url'),
    primary: field('primary'),
    photos: Number(field('photos') || 0),
  };
});

const permanentExclusionHashes = new Set(['1ee474c736327fcd6470e2c25cb8e04f6d02806b6c6b94ae901ae70b16c51683']);
const albumKey = (id) => createHash('sha256').update(id).digest('hex');
const isPermanentlyExcluded = (album) => permanentExclusionHashes.has(albumKey(album.id));
const excludedAlbumCount = albums.filter(isPermanentlyExcluded).length;
const publishableAlbums = albums.filter((album) => !isPermanentlyExcluded(album));
const ownerAnchorAlbums = new Set([
  '72157656733511982',
  '72157662260290273',
  '72157718999694018',
]);
const seriesTerms = /For Your Safety|安全起見|制服|uniform|人像|寫真|作品|創作|Momo|走在|Doraemon|Bikini|RedBall/i;
const commercialTerms = /專輯|官方MV|MV側拍|劇照|宣傳照|婚禮|婚紗|EMBA|AgileTour|活動紀錄|商業|品牌|博覽會|展覽/i;
const evidenceTerms = /簽書|講座|展覽|GEISAI|媒體|節目|記者會|開幕|頒獎|電台|活動側拍|花絮/i;
const weakCoverTerms = /聚餐|尾牙|記錄|隨拍|手機|測試|Screenshot|未整理/i;
const parseYear = (title) => Number(title.match(/(?:19|20)\d{2}/)?.[0] || 0);

const classified = publishableAlbums.map((album) => {
  const reasons = [];
  let score = 0;
  let role = 'archive';
  const year = parseYear(album.title);


  if (commercialTerms.test(album.title)) {
    role = 'assignment';
    score += 8;
    reasons.push('可辨識的委託或活動用途');
  }
  if (seriesTerms.test(album.title)) {
    role = role === 'assignment' ? role : 'series';
    score += 7;
    reasons.push('具人物、概念或系列選片潛力');
  }
  if (evidenceTerms.test(album.title)) {
    role = role === 'archive' ? 'evidence' : role;
    score += 3;
    reasons.push('可補強出版、展覽或媒體履歷');
  }
  if (ownerAnchorAlbums.has(album.id)) {
    score += 12;
    reasons.push('已有史旺基確認的代表照片');
  }
  if (year >= 2018) {
    score += 3;
    reasons.push('補足近年作品');
  }
  if (album.photos >= 8 && album.photos <= 180) {
    score += 2;
    reasons.push('相簿規模適合深入選片');
  } else if (album.photos > 300) {
    score -= 2;
    reasons.push('需先分層抽樣，避免大型相簿淹沒候選');
  }
  if (weakCoverTerms.test(album.title)) {
    score -= 4;
    reasons.push('較像日常記錄，先留完整檔案');
  }

  const priority = score >= 12 ? 'P0' : score >= 8 ? 'P1' : score >= 5 ? 'P2' : 'P3';
  return { ...album, year, role, priority, score, reasons: reasons.length ? reasons : ['保留於完整 Flickr 檔案'] };
});

const candidateAlbums = classified
  .filter((album) => album.priority !== 'P3')
  .sort((a, b) => b.score - a.score || b.year - a.year || a.id.localeCompare(b.id))
  .slice(0, 180)
  .map((album) => ({ ...album, sample_target: Math.min(album.photos, album.photos > 300 ? 15 : 12) }));

const counts = (key) => Object.fromEntries([...new Set(classified.map((album) => album[key]))]
  .sort()
  .map((value) => [value, classified.filter((album) => album[key] === value).length]));

const output = {
  generated_from: '_data/flickr_albums.yml',
  policy: {
    social_metrics: '只用於召回，不直接決定作品排名',
    permanent_exclusions: '排除內容已自公開策展產物移除',
    candidate_target: '120–180 組相簿；每組最多抽 15 張，少於 8 張者全數檢視',
  },
  summary: {
    analyzed_albums: albums.length,
    excluded_albums: excludedAlbumCount,
    candidate_albums: candidateAlbums.length,
    roles: { ...counts('role'), excluded: excludedAlbumCount },
    priorities: { ...counts('priority'), X: excludedAlbumCount },
  },
  candidate_albums: candidateAlbums,
  album_decisions: classified,
};

writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output.summary, null, 2));
