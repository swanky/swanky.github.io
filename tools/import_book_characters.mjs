/**
 * 角色館一次性匯入工具（機器特定路徑，比照 tools/build_jinpingmei_characters.py 慣例）。
 *
 * 輸入：
 *   1. 素材包 cast.json ×4（shuohao-skills 品質基準，經該 repo 自動校驗＋人工驗收）
 *   2. 判圖 inventory ×2（本次上站流程逐張判讀的 verdict／alt_zh；FLAG 圖一律排除）
 * 輸出：
 *   - _data/book_characters/{book_id}.json（對 schema/book-character.schema.json，npm test 會驗）
 *   - 轉檔計畫 JSON（--plan-out）：src PNG → assets/img/books/{book}/characters/{slug}.jpg，
 *     交給 tools/convert_book_characters.ps1 執行 WIC 轉檔
 *
 * 用法：node tools/import_book_characters.mjs --inventory <a.json> --inventory <b.json> --plan-out <plan.json>
 * 素材更新時：改素材包源頭，重跑本工具（冪等）。
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC_BASE = 'C:/cc_home/novel-characters-lab/shuohao-skills/testdata/benchmarks/novel-characters/classic-chinese-novels';

const BOOKS = {
  shuihu: '水滸傳-主要角色',
  sanguo: '三國演義-主要角色',
  xiyou: '西遊記-主要角色',
  honglou: '紅樓夢-主要角色',
};

// 角色名 → URL slug（拼音連字號，照 docs/novel-platform/architecture.md §6 的形狀）。
// 新角色沒登記會直接丟錯——slug 是人工決定的資料，不自動音譯。
const SLUGS = {
  shuihu: {
    扈三娘: 'hu-sanniang', 孫二娘: 'sun-erniang', 顧大嫂: 'gu-dasao', 潘金蓮: 'pan-jinlian',
    閻婆惜: 'yan-poxi', 潘巧雲: 'pan-qiaoyun', 王婆: 'wang-po', 林娘子: 'lin-niangzi',
    宋江: 'song-jiang', 吳用: 'wu-yong', 盧俊義: 'lu-junyi', 林沖: 'lin-chong',
    魯智深: 'lu-zhishen', 武松: 'wu-song', 李逵: 'li-kui', 楊志: 'yang-zhi',
  },
  sanguo: {
    貂蟬: 'diao-chan', 孫夫人: 'sun-furen', 糜夫人: 'mi-furen', 甘夫人: 'gan-furen',
    蔡夫人: 'cai-furen', 伏皇后: 'fu-huanghou', 甄氏: 'zhen-shi', 祝融夫人: 'zhurong-furen',
    劉備: 'liu-bei', 關羽: 'guan-yu', 張飛: 'zhang-fei', 諸葛亮: 'zhuge-liang',
    曹操: 'cao-cao', 孫權: 'sun-quan', 周瑜: 'zhou-yu', 司馬懿: 'sima-yi',
  },
  xiyou: {
    觀音菩薩: 'guanyin-pusa', 鐵扇公主: 'tieshan-gongzhu', 女兒國國王: 'nuerguo-guowang', 白骨夫人: 'baigu-furen',
    蠍子精: 'xiezi-jing', 玉兔精: 'yutu-jing', 地湧夫人: 'diyong-furen', 玉面公主: 'yumian-gongzhu',
    孫悟空: 'sun-wukong', 唐三藏: 'tang-sanzang', 豬八戒: 'zhu-bajie', 沙悟淨: 'sha-wujing',
    如來佛祖: 'rulai-fozu', 牛魔王: 'niu-mowang', 白龍馬: 'bailong-ma', 二郎神: 'erlang-shen',
  },
  honglou: {
    林黛玉: 'lin-daiyu', 薛寶釵: 'xue-baochai', 王熙鳳: 'wang-xifeng', 賈探春: 'jia-tanchun',
    史湘雲: 'shi-xiangyun', 妙玉: 'miao-yu', 晴雯: 'qing-wen', 襲人: 'xi-ren',
    賈寶玉: 'jia-baoyu', 賈母: 'jia-mu', 賈政: 'jia-zheng', 賈璉: 'jia-lian',
    薛蟠: 'xue-pan', 劉姥姥: 'liu-laolao', 紫鵑: 'zi-juan', 平兒: 'ping-er',
  },
};

// 畫風對照圖的檔名字尾 → 訪客看得懂的標籤
const VARIANT_LABELS = { ghibli: '動畫風', realistic: '寫實繪畫風', photoreal: '擬真版' };

const args = process.argv.slice(2);
const inventoryPaths = [];
let planOut = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--inventory') inventoryPaths.push(args[++i]);
  else if (args[i] === '--plan-out') planOut = args[++i];
}
if (inventoryPaths.length === 0) {
  console.error('用法：node tools/import_book_characters.mjs --inventory <a.json> [--inventory <b.json>] --plan-out <plan.json>');
  process.exit(1);
}

const sha256File = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');

/** 判圖 inventory 合流：{book_id: images[]} */
const inv = {};
for (const p of inventoryPaths) {
  const data = JSON.parse(readFileSync(p, 'utf8'));
  for (const [bookId, payload] of Object.entries(data)) inv[bookId] = payload.images;
}

const plan = [];
let skipped = 0;

for (const [bookId, folder] of Object.entries(BOOKS)) {
  const castPath = join(SRC_BASE, folder, `${folder}-cast.json`);
  const cast = JSON.parse(readFileSync(castPath, 'utf8'));
  const images = inv[bookId];
  if (!images) throw new Error(`inventory 缺 ${bookId}——判圖流程還沒跑完，不能匯入`);

  const seenSha = new Map(); // sha → file（位元組級重複的變體圖直接略過）
  const records = [];

  for (const c of cast.characters) {
    const slug = SLUGS[bookId]?.[c.name];
    if (!slug) throw new Error(`${bookId}: 角色「${c.name}」沒登記 slug——先人工補 SLUGS 再跑`);

    const mine = images.filter((i) => i.character === c.name);
    const main = mine.find((i) => !i.variant);
    if (!main) throw new Error(`${bookId}/${c.name}: inventory 找不到主圖`);
    if (main.verdict !== 'PASS') { console.warn(`跳過（FLAG）：${bookId}/${main.file} — ${main.flag_reason}`); skipped++; continue; }

    const mainSrc = join(SRC_BASE, folder, 'images', main.file);
    seenSha.set(sha256File(mainSrc), main.file);
    plan.push({ src: mainSrc, dst: `assets/img/books/${bookId}/characters/${slug}.jpg` });

    const rec = {
      slug,
      name: c.name,
      ...(c.aliases?.length ? { aliases: c.aliases } : {}),
      gender: c.persona.gender,
      importance: c.importance,
      one_liner: c.oneLiner,
      identity: c.persona.identity,
      image: `${slug}.jpg`,
      width: main.width,
      height: main.height,
      alt: main.alt_zh,
    };

    const variants = [];
    for (const v of mine.filter((i) => i.variant)) {
      if (v.verdict !== 'PASS') { console.warn(`跳過（FLAG）：${bookId}/${v.file} — ${v.flag_reason}`); skipped++; continue; }
      const src = join(SRC_BASE, folder, 'images', v.file);
      const sha = sha256File(src);
      if (seenSha.has(sha)) { console.warn(`跳過（重複位元組）：${bookId}/${v.file} ＝ ${seenSha.get(sha)}`); skipped++; continue; }
      seenSha.set(sha, v.file);
      const suffix = /-sheet-([a-z]+)\.png$/.exec(v.file)?.[1];
      if (!suffix) throw new Error(`${bookId}/${v.file}: 變體檔名不符 -sheet-<style>.png 形狀`);
      const image = `${slug}-${suffix}.jpg`;
      plan.push({ src, dst: `assets/img/books/${bookId}/characters/${image}` });
      variants.push({ image, label: VARIANT_LABELS[suffix] || suffix, width: v.width, height: v.height, alt: v.alt_zh });
    }
    if (variants.length) rec.variants = variants;
    records.push(rec);
  }

  mkdirSync('_data/book_characters', { recursive: true });
  const outPath = `_data/book_characters/${bookId}.json`;
  writeFileSync(outPath, JSON.stringify(records, null, 1) + '\n', 'utf8');
  console.log(`${outPath}：${records.length} 位角色`);
}

if (planOut) {
  writeFileSync(planOut, JSON.stringify(plan, null, 1) + '\n', 'utf8');
  console.log(`轉檔計畫：${planOut}（${plan.length} 張）`);
}
if (skipped) console.log(`共跳過 ${skipped} 張（FLAG 或重複）`);
