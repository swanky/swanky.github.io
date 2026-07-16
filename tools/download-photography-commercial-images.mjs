import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const outputDir = resolve(root, 'assets/img/flickr/commercial');
const dataPath = resolve(root, '_data/photography_commercial_photos.json');
mkdirSync(outputDir, { recursive: true });

const selections = {
  'michael-shih-mv': [
    ['5046228460', 'MV 拍攝現場的工作人員、燈具與場景'],
    ['5046231342', '演出者在效果鏡頭中的動態畫面'],
    ['5046252028', '舞台燈光下的演出者'],
  ],
  'machi-mv': [
    ['8462822929', '〈幹什麼〉演出者定裝與拍攝現場'],
    ['8463925940', '造型師在拍攝現場整理演出者'],
    ['8463081895', '〈超級掰〉拍攝現場的攝影機與工作團隊'],
    ['8463086541', '〈超級掰〉白棚團體舞蹈畫面'],
  ],
  'film-stills': [
    ['6944017442', '《舞琉璃》雙人托舉舞台劇照'],
    ['6944024900', '《舞琉璃》雙人角色關係舞台劇照'],
    ['7089849425', '《舞琉璃》排練現場與攝影工作'],
    ['6943815766', '《舞琉璃》鏡頭前的動作排練'],
  ],
  'emba-events': [
    ['4431738238', '政大 EMBA 活動報到與現場交流'],
    ['4431767738', '政大 EMBA 活動舞台演出'],
    ['4431011247', '政大 EMBA 活動團體合影'],
  ],
  wedding: [
    ['7150166655', '戶外婚紗側拍中的新人互動'],
    ['7004074608', '戶外婚紗側拍的完整雙人構圖'],
    ['4470432484', '婚宴進場時的新人与動態婚紗'],
    ['4469658185', '婚宴進場中的新人關係與現場光線'],
  ],
  artfn: [
    ['52121948414', 'ArtfN 展位空間、作品與參展者'],
    ['52122205300', 'ArtfN 展出的立體作品與陳列細節'],
    ['52121948224', 'ArtfN 觀眾觀看與記錄作品'],
  ],
};

function jpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length - 9) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
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

const output = {};
for (const [caseId, photos] of Object.entries(selections)) {
  output[caseId] = [];
  for (const [photoId, alt] of photos) {
    const photoUrl = `https://www.flickr.com/photos/swanky-hsiao/${photoId}/`;
    const pageResponse = await fetch(photoUrl, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!pageResponse.ok) throw new Error(`${photoUrl}: HTTP ${pageResponse.status}`);
    const html = await pageResponse.text();
    const imageMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
      || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
    if (!imageMatch) throw new Error(`${photoUrl}: og:image not found`);
    const sourceUrl = imageMatch[1].replaceAll('&amp;', '&');
    const imageResponse = await fetch(sourceUrl, { headers: { 'user-agent': 'Mozilla/5.0' } });
    const contentType = imageResponse.headers.get('content-type') || '';
    if (!imageResponse.ok || !contentType.startsWith('image/jpeg')) {
      throw new Error(`${sourceUrl}: HTTP ${imageResponse.status}, ${contentType}`);
    }
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    const dimensions = jpegDimensions(buffer);
    const filename = `${caseId}-${photoId}.jpg`;
    writeFileSync(resolve(outputDir, filename), buffer);
    output[caseId].push({
      photo_id: photoId,
      image: `/assets/img/flickr/commercial/${filename}`,
      width: dimensions.width,
      height: dimensions.height,
      alt,
      photo_url: photoUrl,
      source_url: sourceUrl,
      bytes: buffer.length,
      sha256: createHash('sha256').update(buffer).digest('hex'),
    });
  }
}
writeFileSync(dataPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ cases: Object.keys(output).length, photos: Object.values(output).flat().length, bytes: Object.values(output).flat().reduce((sum, photo) => sum + photo.bytes, 0), files: Object.values(output).flat().map((photo) => basename(photo.image)) }, null, 2));
