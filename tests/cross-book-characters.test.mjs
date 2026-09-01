/**
 * 跨書同名人物互連（T6b）——潘金蓮／西門慶／武松同時出現在《金瓶梅》與《水滸傳》。
 *
 * 這個檔案守三件事：
 *   1. 機械事實不漂移——頁面上寫的「名字出現在第幾回」一律回頭對原文逐字重數一次。
 *      日後底本重新匯入、章回增刪，這裡會先燒起來，而不是讓站上留下過期的回次清單。
 *   2. 雙向連結真的通——每個連結目標都對得上 repo 內實際檔案的 permalink，不只是字串長得像。
 *   3. 版本學紅線——跨書關係的說法只能逐字引用 _data/books.yml 既有措辭；
 *      「誰承襲誰」「哪一段被改寫」這類論斷一個字都不准出現在本次新增的文案裡。
 */
import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import { validate } from '../tools/lib/mini-schema.mjs';

const NAMES = { panjinlian: '潘金蓮', ximenqing: '西門慶', wusong: '武松' };

// _data/books.yml 既有措辭——本次所有跨書／版本說法的唯一來源
const BOOKS_YML = readFileSync('_data/books.yml', 'utf8');
const QUOTE = '武松與潘金蓮的故事也在裡面，和《金瓶梅》接得上。';
const EDITION_LABELS = ['七十回本', '詞話本（萬曆本）'];

// ── 逐字重數：原文出現次數 ────────────────────────────────────
const SHUIHU_RE = /^shuihu-gutenberg-23863-(\d{3})\.html$/;

function shuihuChapters() {
  return readdirSync('_books')
    .map((f) => ({ f, m: SHUIHU_RE.exec(f) }))
    .filter((x) => x.m)
    .map(({ f, m }) => ({ file: `_books/${f}`, chapter: parseInt(m[1], 10), pad: m[1] }))
    .sort((a, b) => a.chapter - b.chapter);
}

function jpmWanliChapters() {
  return readdirSync('_jinpingmei')
    .filter((f) => /^\d{3}\.html$/.test(f))
    .map((f) => ({ file: `_jinpingmei/${f}`, chapter: parseInt(f.slice(0, 3), 10) }))
    .sort((a, b) => a.chapter - b.chapter);
}

const countIn = (files, name) => files
  .map((c) => ({ ...c, n: readFileSync(c.file, 'utf8').split(name).length - 1 }))
  .filter((c) => c.n > 0);

// ── 中文數字（本站文案用中文寫回次，測試得看得懂）────────────
const CN = { 零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
function cn2num(raw) {
  const s = String(raw).replace(/^第/, '').replace(/回$/, '');
  if (s.includes('百')) {
    const [a, b] = s.split('百');
    return (a ? CN[a] : 1) * 100 + (b ? cn2num(b) : 0);
  }
  if (s.includes('十')) {
    const [a, b] = s.split('十');
    return (a ? CN[a] : 1) * 10 + (b ? CN[b] : 0);
  }
  return CN[s];
}

// ── front matter 的 also_in（只認本 task 寫進去的固定形狀）──
function parseAlsoIn(path) {
  const fmMatch = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(readFileSync(path, 'utf8'));
  assert.ok(fmMatch, `${path} 缺 front matter`);
  const lines = fmMatch[1].split(/\r?\n/);
  const start = lines.findIndex((l) => l === 'also_in:');
  if (start < 0) return null;
  const out = { chapters: [] };
  let inChapters = false;
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^\S/.test(line)) break;
    const kv = /^ {2}(\w+):\s*(.*)$/.exec(line);
    if (kv) {
      inChapters = kv[1] === 'chapters';
      if (!inChapters) out[kv[1]] = kv[2].replace(/^"|"$/g, '');
      continue;
    }
    if (!inChapters) continue;
    const lab = /^ {4}- label:\s*"(.*)"$/.exec(line);
    if (lab) {
      out.chapters.push({ label: lab[1] });
      continue;
    }
    const url = /^ {6}url:\s*"(.*)"$/.exec(line);
    if (url) out.chapters[out.chapters.length - 1].url = url[1];
  }
  return out;
}

const jpm = Object.fromEntries(Object.keys(NAMES)
  .map((s) => [s, parseAlsoIn(`_jinpingmei_characters/${s}.html`)]));
const shuihuChars = JSON.parse(readFileSync('_data/book_characters/shuihu.json', 'utf8'));
const bySlug = Object.fromEntries(shuihuChars.map((c) => [c.slug, c]));

// ── 1. 三人都有跨書區塊 ───────────────────────────────────────
test('金瓶梅三位跨書人物都掛上了 also_in 區塊，其餘 16 人不受影響', () => {
  for (const slug of Object.keys(NAMES)) {
    assert.ok(jpm[slug], `_jinpingmei_characters/${slug}.html 缺 also_in`);
    assert.equal(jpm[slug].book, '水滸傳');
    assert.match(jpm[slug].heading, /^另一部小說裡的[她他]$/, `${slug} 的 also_in.heading 不對`);
    for (const k of ['intro', 'count_note']) {
      assert.ok(jpm[slug][k] && jpm[slug][k].length > 20, `${slug} 的 also_in.${k} 太短或缺漏`);
    }
  }
  const others = readdirSync('_jinpingmei_characters')
    .filter((f) => f.endsWith('.html') && !(f.replace('.html', '') in NAMES));
  assert.equal(others.length, 16);
  for (const f of others) {
    assert.equal(parseAlsoIn(`_jinpingmei_characters/${f}`), null, `${f} 不該有 also_in`);
  }
});

// ── 2. 回次清單＝逐字重數的結果（機械事實，不得漂移）─────────
test('金瓶梅三頁列出的《水滸傳》回次，等於回頭逐字重數的結果', () => {
  const chapters = shuihuChapters();
  assert.equal(chapters.length, 71,
    `_books/ 的水滸傳七十回本應為 71 檔（楔子加七十回），實際 ${chapters.length}`);
  for (const [slug, name] of Object.entries(NAMES)) {
    const expected = countIn(chapters, name).map((c) => c.chapter);
    const listed = jpm[slug].chapters.map((c) => {
      const m = /^\/shuihu\/text\/(\d{3})\/$/.exec(c.url);
      assert.ok(m, `${slug} 的回次網址格式不對：${c.url}`);
      return parseInt(m[1], 10);
    });
    assert.deepEqual(listed, expected,
      `${name}：頁面列出 ${listed.join('、')}，逐字重數是 ${expected.join('、')}`);
    assert.ok(expected.length > 0, `${name} 在水滸傳一次都沒出現？`);
  }
});

test('回次連結指向的檔案存在，permalink 與回目標題都對得上', () => {
  for (const slug of Object.keys(NAMES)) {
    for (const ch of jpm[slug].chapters) {
      const pad = /^\/shuihu\/text\/(\d{3})\/$/.exec(ch.url)[1];
      const file = `_books/shuihu-gutenberg-23863-${pad}.html`;
      assert.ok(existsSync(file), `${slug}：連結 ${ch.url} 對應的 ${file} 不存在`);
      const src = readFileSync(file, 'utf8');
      assert.ok(src.includes(`permalink: "${ch.url}"`), `${file} 的 permalink 不是 ${ch.url}`);
      assert.ok(src.includes(`label: "${ch.label}"`), `${file} 的回目不是「${ch.label}」`);
    }
  }
});

// ── 3. 雙向連結 ───────────────────────────────────────────────
test('潘金蓮與武松：兩邊互相連得到，anchor 與 permalink 都真的存在', () => {
  const pairs = [
    { jpmSlug: 'panjinlian', shuihuSlug: 'pan-jinlian' },
    { jpmSlug: 'wusong', shuihuSlug: 'wu-song' },
  ];
  const charsIndex = 'shuihu/characters/index.html';
  assert.ok(existsSync(charsIndex));
  assert.ok(readFileSync(charsIndex, 'utf8').includes('permalink: /shuihu/characters/'));

  for (const { jpmSlug, shuihuSlug } of pairs) {
    // 金瓶梅 → 水滸傳
    assert.equal(jpm[jpmSlug].link_url, `/shuihu/characters/#${shuihuSlug}`);
    assert.ok(jpm[jpmSlug].link_text.includes(NAMES[jpmSlug]));
    assert.ok(bySlug[shuihuSlug], `水滸傳角色館沒有 ${shuihuSlug}，anchor 會連到空的`);
    assert.equal(bySlug[shuihuSlug].name, NAMES[jpmSlug]);

    // 水滸傳 → 金瓶梅
    const back = bySlug[shuihuSlug].also_in;
    assert.ok(back, `shuihu.json 的 ${shuihuSlug} 缺 also_in`);
    assert.equal(back.url, `/jinpingmei/characters/${jpmSlug}/`);
    const page = `_jinpingmei_characters/${jpmSlug}.html`;
    assert.ok(existsSync(page));
    assert.ok(readFileSync(page, 'utf8').includes(`permalink: ${back.url}`),
      `${page} 的 permalink 不是 ${back.url}`);
    assert.ok(back.link_text.includes(NAMES[jpmSlug]));
  }
});

test('西門慶：水滸傳沒有他的角色頁，所以只連原文回次，並老實說明原因', () => {
  const hit = shuihuChars.filter((c) => c.name === '西門慶' || (c.aliases || []).includes('西門慶'));
  assert.equal(hit.length, 0, '水滸傳角色館已經收了西門慶——這一頁應改連他的角色頁');
  assert.equal(jpm.ximenqing.link_url, undefined, '沒有角色頁就不該給角色頁連結');
  assert.ok(jpm.ximenqing.no_link_note && jpm.ximenqing.no_link_note.length > 10,
    '缺少「為什麼不連角色頁」的說明');
  assert.equal(jpm.ximenqing.chapters.length, 5);
});

test('只有跨書那兩位有 also_in，水滸傳其餘 14 位不受影響', () => {
  const withAlso = shuihuChars.filter((c) => c.also_in).map((c) => c.slug);
  assert.deepEqual(withAlso.sort(), ['pan-jinlian', 'wu-song']);
  assert.equal(shuihuChars.length, 16);
});

// ── 4. schema ─────────────────────────────────────────────────
test('also_in 過 book-character.schema.json，且是選填（不是每位角色都有）', () => {
  const schema = JSON.parse(readFileSync('schema/book-character.schema.json', 'utf8'));
  assert.deepEqual(validate(schema, shuihuChars), []);
  const char = schema.$defs.character;
  assert.equal(char.additionalProperties, false, 'additionalProperties 一旦放寬，新欄位就不再被驗');
  assert.ok(char.properties.also_in, 'schema 沒有宣告 also_in——資料會被 additionalProperties 擋下');
  assert.ok(!char.required.includes('also_in'), 'also_in 不該必填');
  // 反向控制：少一個子欄位就必須被擋下來，證明規則真的在驗
  const broken = JSON.parse(JSON.stringify(shuihuChars));
  delete broken.find((c) => c.slug === 'wu-song').also_in.url;
  assert.ok(validate(schema, broken).length > 0, 'also_in 少了 url 卻通過驗證');
});

// ── 5. 金瓶梅側的統計數字也要對得上 ───────────────────────────
test('水滸傳角色館寫的《金瓶梅》回次統計，等於回頭逐字重數的結果', () => {
  const wanli = jpmWanliChapters();
  assert.equal(wanli.length, 101, `_jinpingmei/ 的詞話本應為 101 檔（含卷首序文），實際 ${wanli.length}`);

  // 潘金蓮：「出現在其中七十二回，卷首序文也提到一次」
  const pj = countIn(wanli, '潘金蓮');
  const pjNote = bySlug['pan-jinlian'].also_in.count_note;
  const pjClaim = cn2num(/出現在其中(.+?)回/.exec(pjNote)[1]);
  const pjActual = pj.filter((c) => c.chapter !== 0).length;
  assert.equal(pjClaim, pjActual, `潘金蓮：文案寫 ${pjClaim} 回，逐字重數是 ${pjActual} 回`);
  assert.ok(/卷首序文也提到一次/.test(pjNote));
  const preface = pj.find((c) => c.chapter === 0);
  assert.ok(preface, '卷首序文其實沒提到潘金蓮');
  assert.equal(preface.n, 1, `文案說卷首序文提到一次，實際是 ${preface && preface.n} 次`);

  // 武松：「出現在其中十二回：第一、二、…、一百回」
  const ws = countIn(wanli, '武松').map((c) => c.chapter);
  const wsNote = bySlug['wu-song'].also_in.count_note;
  assert.equal(cn2num(/出現在其中(.+?)回/.exec(wsNote)[1]), ws.length,
    `武松：文案的回數與逐字重數（${ws.length}）不符`);
  const listed = /：(.+?)回。/.exec(wsNote)[1].split('、').map(cn2num);
  assert.deepEqual(listed, ws, `武松：文案列 ${listed.join('、')}，逐字重數是 ${ws.join('、')}`);
});

// ── 6. 版本學紅線：只准逐字引用，不准自己下論斷 ───────────────
const AUTHORED_STRINGS = [
  ...Object.values(jpm).flatMap((a) => [a.heading, a.intro, a.link_text, a.no_link_note, a.count_note]),
  ...shuihuChars.filter((c) => c.also_in).flatMap((c) => Object.values(c.also_in)),
].filter(Boolean);

test('跨書關係的說法逐字出自 _data/books.yml，一個字都沒自己改', () => {
  assert.ok(BOOKS_YML.includes(QUOTE), `_data/books.yml 已經沒有這句話了：「${QUOTE}」`);
  const quoting = AUTHORED_STRINGS.filter((s) => s.includes('書目介紹寫著'));
  assert.equal(quoting.length, 5, `預期 5 段引用（金瓶梅 3 頁＋水滸傳 2 筆），實際 ${quoting.length}`);
  for (const s of quoting) {
    const inner = /書目介紹寫著：「(.+?)」/.exec(s);
    assert.ok(inner, `這段自稱在引用，卻抓不到引號內容：${s}`);
    assert.equal(inner[1], QUOTE);
  }
  // 提到版本一律用註冊表裡的既有標籤，一個字都不准自己造
  let labelHits = 0;
  for (const s of AUTHORED_STRINGS) {
    for (const label of s.match(/[一二三四五六七八九十百]+回本|詞話本（萬曆本）/g) || []) {
      labelHits += 1;
      assert.ok(EDITION_LABELS.includes(label), `「${label}」不在允許的版本標籤清單內`);
      assert.ok(BOOKS_YML.includes(`label: ${label}`),
        `「${label}」不是 _data/books.yml editions 裡的既有標籤`);
    }
  }
  assert.equal(labelHits, 5, `預期 5 段文案各提一次版本標籤，實際 ${labelHits} 次`);
});

test('新增文案不含任何未經 repo 依據的版本學論斷', () => {
  // 這些字一旦出現，就等於在替兩本書的版本關係或戲份下判斷——本 task 沒有依據可以這樣寫。
  const FORBIDDEN = ['改寫', '承襲', '承自', '抄襲', '脫胎', '化用', '藍本', '母本', '原型',
    '前身', '取材', '同一個人物', '就是同一人', '首次登場', '初次登場', '主要情節'];
  const layouts = ['_layouts/jinpingmei-character.html', '_layouts/book-characters.html']
    .map((f) => readFileSync(f, 'utf8'));
  const haystacks = [...AUTHORED_STRINGS, ...layouts];
  for (const word of FORBIDDEN) {
    for (const h of haystacks) {
      assert.ok(!h.includes(word), `新增文案出現無依據的論斷用字「${word}」：${h.slice(0, 60)}`);
    }
  }
  // 反過來，誠實話必須在：每一段回次統計都要說清楚那只是名字出現的統計
  const notes = [...Object.values(jpm).map((a) => a.count_note),
    ...shuihuChars.filter((c) => c.also_in).map((c) => c.also_in.count_note)];
  assert.equal(notes.length, 5);
  for (const n of notes) {
    assert.ok(n.includes('名字出現的回次統計'), `這段回次統計沒說明它只是字面統計：${n}`);
  }
  // 同名不等於同一人，五段都要講
  const intros = [...Object.values(jpm).map((a) => a.intro),
    ...shuihuChars.filter((c) => c.also_in).map((c) => c.also_in.intro)];
  assert.equal(intros.length, 5);
  for (const s of intros) {
    assert.ok(s.includes('不當成同一個人看'), `缺少「同名不等於同一人」的提醒：${s}`);
  }
});

// ── 7. layout 真的有渲染這塊（避免資料寫了卻沒人顯示）─────────
test('兩邊 layout 都有渲染跨書區塊，且通用層仍不硬編碼書名或專屬路徑', () => {
  const jpmLayout = readFileSync('_layouts/jinpingmei-character.html', 'utf8');
  for (const frag of ['page.also_in.heading', 'page.also_in.intro', 'page.also_in.count_note',
    'page.also_in.link_url', 'page.also_in.no_link_note', 'page.also_in.chapters']) {
    assert.ok(jpmLayout.includes(frag), `_layouts/jinpingmei-character.html 沒有渲染 ${frag}`);
  }
  const bkLayout = readFileSync('_layouts/book-characters.html', 'utf8');
  for (const frag of ['c.also_in.heading', 'c.also_in.intro', 'c.also_in.url',
    'c.also_in.link_text', 'c.also_in.count_note']) {
    assert.ok(bkLayout.includes(frag), `_layouts/book-characters.html 沒有渲染 ${frag}`);
  }
  // 通用角色館 layout 的硬規則（見該檔開頭註解）：剝掉註解後不得出現書名或旗艦路徑
  const code = bkLayout
    .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  for (const title of ['金瓶梅', '水滸傳', '三國演義', '西遊記', '紅樓夢', '石頭記']) {
    assert.ok(!code.includes(title), `_layouts/book-characters.html 硬編碼了書名「${title}」`);
  }
  assert.ok(!/\/jinpingmei\//.test(code), '_layouts/book-characters.html 出現 /jinpingmei/ 專屬路徑');
});
