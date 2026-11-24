#!/usr/bin/env node
// 對建置產物（_site/）跑稽核：GA4 覆蓋率、轉址、文章日期、雇主名稱等「要建置後才驗得到」的檢查。
// 用法：bundle exec jekyll build 之後跑 npm run audit:site（或 node tools/audit-site.mjs）。
//
// 這些檢查刻意不放在 npm test 裡：合併或改完檔案的當下，本機的 _site/ 還是上一次建置的舊產物，
// 拿舊產物驗新原始碼會誤報失敗。npm test 只驗原始碼；這支在建置之後、push 之前跑。
// 結束碼：0＝通過；1＝有檢查失敗；2＝沒有 _site/，未驗證。
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
if (!existsSync(join(ROOT, '_site', 'index.html'))) {
  console.error('未驗證：本機沒有 _site/。先跑 bundle exec jekyll build 再跑這支。');
  process.exit(2);
}

// 建置產物層的測試與來源層的寫在同一批檔案裡，名稱一律以「建置產物」開頭。
const files = readdirSync(join(ROOT, 'tests'))
  .filter((name) => name.endsWith('.test.mjs') && readFileSync(join(ROOT, 'tests', name), 'utf8').includes("test('建置產物"))
  .map((name) => join('tests', name));
const result = spawnSync(process.execPath, ['--test', '--test-name-pattern=^建置產物', ...files], {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, SITE_AUDIT: '1' },
});
process.exit(result.status === 0 ? 0 : 1);
