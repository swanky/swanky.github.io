// verify-page.mjs — 用真的瀏覽器打開本機建置好的頁面，桌機與 390px 手機各跑一次，收集證據。
// 用法：
//   node verify-page.mjs --base http://127.0.0.1:8841 --out <證據目錄> /path/ [/path2/ ...]
// 輸出：每頁每個 viewport 一張整頁截圖（<out>/<slug>-<寬>.png）＋ <out>/report.json；stdout 印摘要。
// exit code：0＝全部通過；1＝有頁面失敗（非 200、pageerror、橫向溢出、破圖、缺 H1）；2＝參數或環境錯誤。
// 瀏覽器：預設用本機 Google Chrome；PLAYWRIGHT_MODULE、CHROME_PATH 環境變數可覆寫。
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const opt = { base: '', out: '', paths: [] };
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--base') opt.base = args[++i];
  else if (args[i] === '--out') opt.out = args[++i];
  else opt.paths.push(args[i]);
}
// Git Bash（MSYS）會把開頭是 / 的參數改寫成 Windows 路徑，例如 /technical/ → C:/Program Files/Git/technical/；在這裡還原
opt.paths = opt.paths.map((p) => {
  const m = p.replaceAll('\\', '/').match(/^[A-Za-z]:\/Program Files\/Git(\/.*)?$/);
  return m ? (m[1] || '/') : (p.startsWith('/') ? p : '/' + p);
});
if (!opt.base || !opt.out || opt.paths.length === 0) {
  console.error('用法：node verify-page.mjs --base <http://127.0.0.1:port> --out <dir> <path...>');
  process.exit(2);
}

const PW_CANDIDATES = [
  process.env.PLAYWRIGHT_MODULE,
  'C:/Users/swank/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright',
  'playwright',
].filter(Boolean);
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean);

const require = createRequire(import.meta.url);
let chromium;
for (const m of PW_CANDIDATES) {
  try { ({ chromium } = require(m)); break; } catch { /* 試下一個 */ }
}
const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chromium || !executablePath) {
  console.error(`找不到 playwright（試過 ${PW_CANDIDATES.join('、')}）或瀏覽器（試過 ${CHROME_CANDIDATES.join('、')}）`);
  process.exit(2);
}

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, deviceScaleFactor: 3 },
];
// 關掉 AOS 進場動畫：動畫中途量測與截圖會誤判位移與空白（memory reference_local_verify_toolbox）
const NO_ANIM_CSS = '[data-aos]{transition:none!important;transform:none!important;opacity:1!important;animation:none!important}';

mkdirSync(opt.out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath });
const results = [];
try {
  for (const path of opt.paths) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: !!vp.isMobile,
        deviceScaleFactor: vp.deviceScaleFactor || 1,
      });
      const page = await ctx.newPage();
      // 不送 GA 等統計請求，避免污染正式數據
      await page.route(/googletagmanager\.com|google-analytics\.com/, (r) => r.fulfill({ status: 204, body: '' }));
      const pageErrors = [];
      const consoleErrors = [];
      page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
      page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });

      const url = new URL(path, opt.base).href;
      let resp;
      try {
        resp = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      } catch (e) {
        results.push({ url, viewport: vp.name, status: 0, problems: [`無法開啟：${e.message.split('\n')[0]}`] });
        await ctx.close();
        continue;
      }
      await page.addStyleTag({ content: NO_ANIM_CSS });
      const facts = await page.evaluate(async () => {
        const imgs = [...document.images];
        imgs.forEach((img) => { img.loading = 'eager'; });
        await Promise.race([
          Promise.all(imgs.map((img) => img.decode().catch(() => {}))),
          new Promise((r) => setTimeout(r, 15000)),
        ]);
        await document.fonts.ready;
        const broken = imgs
          .filter((img) => img.complete && img.naturalWidth === 0 && img.currentSrc)
          .map((img) => img.currentSrc);
        return {
          title: document.title,
          h1: document.querySelectorAll('h1').length,
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          images: imgs.length,
          broken,
        };
      });
      const slug = path.replace(/^\/|\/$/g, '').replace(/[^\w.-]+/g, '_') || 'home';
      const shot = join(opt.out, `${slug}-${vp.width}.png`);
      await page.screenshot({ path: shot, fullPage: true });

      const status = resp ? resp.status() : 0;
      const problems = [];
      if (status !== 200) problems.push(`HTTP ${status}`);
      if (pageErrors.length) problems.push(`${pageErrors.length} 個 pageerror`);
      if (facts.scrollWidth > facts.innerWidth) problems.push(`橫向溢出 ${facts.scrollWidth}>${facts.innerWidth}`);
      if (facts.broken.length) problems.push(`${facts.broken.length} 張破圖`);
      if (facts.h1 !== 1) problems.push(`H1 有 ${facts.h1} 個`);
      results.push({ url, viewport: vp.name, status, ...facts, pageErrors, consoleErrors, screenshot: shot, problems });
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}

writeFileSync(join(opt.out, 'report.json'), JSON.stringify(results, null, 2));
for (const r of results) {
  const mark = r.problems.length ? 'FAIL' : 'PASS';
  console.log(`${mark} ${r.viewport.padEnd(7)} ${r.url}  imgs=${r.images ?? '-'} console.error=${r.consoleErrors?.length ?? '-'}${r.problems.length ? '  ← ' + r.problems.join('；') : ''}`);
}
console.log(`report: ${join(opt.out, 'report.json')}`);
process.exit(results.some((r) => r.problems.length) ? 1 : 0);
