import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { buildDeck } from '../assets/js/tarot/tarot-deck.js';

const root = resolve(import.meta.dirname, '..');
const targetWidth = 480;
const force = process.argv.includes('--force');
const decks = ['rws', 'uniform', 'clonex'];
const expectedNames = buildDeck().map((id) => `${id}.jpg`).sort();
let generated = 0;
let unchanged = 0;

for (const deck of decks) {
  const sourceDir = resolve(root, 'assets', 'img', 'tarot', deck);
  const outputDir = resolve(root, 'assets', 'img', 'tarot', 'thumbs', deck);
  const actualNames = readdirSync(sourceDir).filter((name) => name.endsWith('.jpg')).sort();
  if (actualNames.join('\n') !== expectedNames.join('\n')) {
    throw new Error(`${deck} 牌組不是完整的 78 張 JPEG，請先修正來源檔。`);
  }
  mkdirSync(outputDir, { recursive: true });

  for (const sourceName of expectedNames) {
    const sourcePath = resolve(sourceDir, sourceName);
    const outputPath = resolve(outputDir, sourceName.replace(/\.jpg$/, '.webp'));
    if (!force && existsSync(outputPath) && statSync(outputPath).mtimeMs >= statSync(sourcePath).mtimeMs) {
      unchanged += 1;
      continue;
    }
    const result = spawnSync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', sourcePath,
      '-vf', `scale=${targetWidth}:-2`, '-frames:v', '1', '-an',
      '-c:v', 'libwebp', '-preset', 'picture', '-q:v', '72', '-compression_level', '6',
      '-map_metadata', '-1', outputPath,
    ], { encoding: 'utf8' });
    if (result.status !== 0) {
      throw new Error(`ffmpeg 無法產生 ${deck}/${sourceName}：${result.stderr}`);
    }
    generated += 1;
  }
}

console.log(JSON.stringify({ decks: decks.length, cardsPerDeck: expectedNames.length, targetWidth, generated, unchanged }, null, 2));
