import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, basename, extname } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const responsiveDir = resolve(root, 'assets/img/photography/responsive-subpages');
const manifestPath = resolve(root, '_data/photography_image_manifest.json');
mkdirSync(responsiveDir, { recursive: true });

const textSources = [
  '_data/photography_for_your_safety.yml',
  '_data/photography_masterpieces.yml',
  '_data/photography_publications.yml',
  '_data/photography_awards.yml',
  '_data/photography_certificates.yml',
  '_data/photography_behind_scenes.yml',
  '_data/flickr_album_covers.yml',
  '_data/photography_commercial_cases.yml',
  '_data/photography_commercial_photos.json',
].map((path) => readFileSync(resolve(root, path), 'utf8')).join('\n');

const imagePaths = new Set(textSources.match(/\/assets\/[^\s"']+?\.(?:jpe?g|png)/gi) || []);
const models = readFileSync(resolve(root, '_data/flickr_models.yml'), 'utf8');
const featured = models.split('featured_collab:', 2)[1].split('\n# =====================================================', 1)[0];
for (const match of featured.matchAll(/^\s+cover_image:\s*"?([^"\n]+)"?/gm)) {
  imagePaths.add(`/assets/img/flickr/${match[1].trim()}`);
}
for (let index = 1; index <= 6; index += 1) {
  imagePaths.add(`/assets/img/old/ug3/sjpg/girls_${index}.jpg`);
}

function jpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length - 9) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    // JPEG 允許 marker 前有多個 0xFF 填充位元組（少數相機／編碼器會寫出來），跳過它們
    while (buffer[offset + 1] === 0xff) { offset += 1; }
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = buffer.readUInt16BE(offset);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3) };
    }
    offset += length;
  }
  throw new Error('Unsupported JPEG');
}

function dimensions(path) {
  const buffer = readFileSync(path);
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  return jpegDimensions(buffer);
}

function responsiveKey(publicPath) {
  const extension = extname(publicPath);
  return publicPath.slice('/assets/img/'.length, -extension.length).replaceAll(/[\\/]/g, '-');
}

const manifest = {};
for (const publicPath of [...imagePaths].sort()) {
  const sourcePath = resolve(root, publicPath.slice(1));
  if (!existsSync(sourcePath)) throw new Error(`Missing source: ${publicPath}`);
  let meta;
  try {
    meta = dimensions(sourcePath);
  } catch (error) {
    throw new Error(`Cannot read dimensions of ${publicPath}: ${error.message}`);
  }
  const entry = { width: meta.width, height: meta.height };
  const key = responsiveKey(publicPath);

  for (const targetWidth of [480, 960]) {
    if (meta.width < targetWidth) continue;
    const outputName = `${key}-${targetWidth}.jpg`;
    const outputPath = resolve(responsiveDir, outputName);
    if (!existsSync(outputPath)) {
      const result = spawnSync('ffmpeg', [
        '-hide_banner', '-loglevel', 'error', '-y', '-i', sourcePath,
        '-vf', `scale=${targetWidth}:-2`, '-q:v', '3', '-map_metadata', '-1', outputPath,
      ], { encoding: 'utf8' });
      if (result.status !== 0) throw new Error(`ffmpeg failed for ${publicPath}: ${result.stderr}`);
    }
    entry[`src_${targetWidth}`] = `/assets/img/photography/responsive-subpages/${outputName}`;
  }
  manifest[publicPath] = entry;
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ images: Object.keys(manifest).length, derivatives: Object.values(manifest).reduce((sum, item) => sum + Number(Boolean(item.src_480)) + Number(Boolean(item.src_960)), 0) }, null, 2));
