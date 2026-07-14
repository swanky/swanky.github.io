import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('assets/img/tarot-clonex-print');
const expectedCards = [
  ...Array.from({ length: 22 }, (_, index) => `major-${String(index).padStart(2, '0')}.png`),
  ...['wands', 'cups', 'swords', 'pentacles'].flatMap((suit) =>
    Array.from({ length: 14 }, (_, index) => `${suit}-${String(index + 1).padStart(2, '0')}.png`),
  ),
];
const allowedFiles = new Set([...expectedCards, 'character-ref.png']);

function readPngDimensions(filePath) {
  const buffer = Buffer.alloc(24);
  const fd = fs.openSync(filePath, 'r');
  try {
    const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
    if (bytesRead !== buffer.length || buffer.toString('ascii', 1, 4) !== 'PNG') {
      return null;
    }
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  } finally {
    fs.closeSync(fd);
  }
}

if (!fs.existsSync(root)) {
  console.error(`Missing directory: ${root}`);
  process.exit(1);
}

const actualFiles = fs.readdirSync(root).filter((name) => name.toLowerCase().endsWith('.png')).sort();
const actualSet = new Set(actualFiles);
const missing = expectedCards.filter((name) => !actualSet.has(name));
const unexpected = actualFiles.filter((name) => !allowedFiles.has(name));
const invalid = [];

for (const name of actualFiles) {
  const dimensions = readPngDimensions(path.join(root, name));
  if (!dimensions || dimensions.width !== 1024 || dimensions.height !== 1536) {
    invalid.push({ name, dimensions });
  }
}

console.log(`Cards: ${expectedCards.length - missing.length}/${expectedCards.length}`);
console.log(`Reference: ${actualSet.has('character-ref.png') ? 'present' : 'missing'}`);
console.log(`Missing: ${missing.length}`);
if (missing.length) console.log(missing.join('\n'));
console.log(`Unexpected PNGs: ${unexpected.length}`);
if (unexpected.length) console.log(unexpected.join('\n'));
console.log(`Wrong format/dimensions: ${invalid.length}`);
for (const item of invalid) {
  console.log(`${item.name}: ${item.dimensions ? `${item.dimensions.width}x${item.dimensions.height}` : 'not a PNG'}`);
}

if (missing.length || unexpected.length || invalid.length || !actualSet.has('character-ref.png')) {
  process.exit(1);
}
