#!/usr/bin/env node
// 用 exiftool 檢查 git 追蹤的圖片與影片有沒有 GPS 定位欄位（含 npm test 的純 Node 檢查看不到的影片、XMP、QuickTime）。
// 用法：npm run audit:gps        （或 node tools/audit-media-gps.mjs）
// 只讀不寫。找到的檔案用 `exiftool -gps:all= -overwrite_original <檔案>` 無損移除（不重新壓縮、不改畫質）。
// 結束碼：0＝沒有定位資訊；1＝有檔案帶定位資訊；2＝沒有 exiftool，未驗證。
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const MEDIA = /\.(jpe?g|png|webp|gif|tiff?|heic|heif|avif|mp4|mov|m4v|webm)$/i;

// 先直接執行；Windows 上 exiftool 若是 .bat／.cmd 包裝才退回經由 shell。所有選項都寫進參數檔，命令列只剩 -@ <檔案>。
function exiftool(args) {
  const direct = spawnSync('exiftool', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (!direct.error) return direct;
  return spawnSync('exiftool', args.map((arg) => (/\s/.test(arg) ? `"${arg}"` : arg)), {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, shell: true,
  });
}

const probe = exiftool(['-ver']);
if (probe.status !== 0) {
  console.error('未驗證：找不到 exiftool（https://exiftool.org/）。npm test 仍會用純 Node 檢查 JPEG／PNG／WebP。');
  process.exit(2);
}

// 沒給參數就檢查 git 追蹤的全部媒體檔；也可以直接指定檔案：node tools/audit-media-gps.mjs <檔案...>
const requested = process.argv.slice(2);
const files = requested.length ? requested : execFileSync('git', ['-c', 'core.quotepath=off', 'ls-files', '-z'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
  .split('\0').filter((path) => MEDIA.test(path));

// 檔名含中文與空白：用 UTF-8 的參數檔（一行一個參數）交給 exiftool，不經過命令列編碼。
const workDir = mkdtempSync(join(tmpdir(), 'audit-gps-'));
let output = '';
try {
  const argFile = join(workDir, 'files.args');
  writeFileSync(argFile, [
    '-charset', 'filename=utf8', '-q', '-q', '-m',
    '-if', '$GPSLatitude or $GPSLongitude or $GPSPosition or $GPSCoordinates or $GPSAltitude',
    '-p', '$Directory/$FileName',
    ...files,
  ].join('\n'), 'utf8');
  const result = exiftool(['-@', argFile]);
  if (result.error) throw result.error;
  output = result.stdout || '';
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

const hits = output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
console.log(`exiftool ${probe.stdout.trim()}：檢查 ${files.length} 個圖片／影片檔`);
if (hits.length) {
  console.error(`有 ${hits.length} 個檔案帶定位資訊：`);
  for (const hit of hits) console.error(`  ${hit}`);
  process.exit(1);
}
console.log('沒有檔案帶 GPS 定位欄位。');
