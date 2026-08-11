/**
 * 古典小說多書平台的契約測試（PLAN.md §13 測試策略）。
 *
 * 分三層：
 *   1. 內容驗證——schema、註冊表一致性、原文完整性（委派 tools/validate_content.mjs）
 *   2. 抽象契約——通用 layout 不得硬編碼任何書名或單一作品路徑
 *   3. 工具本身——mini-yaml 與 mini-schema 是自製的，必須有自己的測試
 */
import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import { parseYamlSequence } from '../tools/lib/mini-yaml.mjs';
import { validate } from '../tools/lib/mini-schema.mjs';
import { validateContent, parseFrontMatter } from '../tools/validate_content.mjs';

const books = parseYamlSequence(readFileSync('_data/books.yml', 'utf8'));
const BOOK_TITLES = books.flatMap((b) => [b.title, ...(b.alternate_titles || [])]);

// ── 1. 內容驗證 ────────────────────────────────────────────────
test('內容驗證：schema、註冊表一致性、原文完整性全數通過', () => {
  const { problems } = validateContent();
  assert.deepEqual(problems, [], `發現 ${problems.length} 項問題：\n${problems.join('\n')}`);
});

test('註冊表收錄五部作品，id 與狀態符合預期', () => {
  assert.equal(books.length, 5);
  assert.deepEqual(books.map((b) => b.id), ['jinpingmei', 'shuihu', 'sanguo', 'xiyou', 'honglou']);
  assert.equal(books.find((b) => b.id === 'jinpingmei').status, 'published');
  assert.equal(books.find((b) => b.id === 'shuihu').status, 'pilot');
});

test('底本忠實度必須誠實標示，且頁面說法要跟著不同', () => {
  // 這道防線取代了原本「紅樓夢不得標成已上線」的硬規則。作品可以上線，
  // 但用字經過轉換的底本不能冒充逐字原文——說法必須跟著忠實度變。
  for (const b of books) {
    for (const ed of b.editions) {
      assert.ok(ed.text_fidelity, `${b.id}/${ed.id} 缺 text_fidelity`);
      if (ed.text_fidelity !== 'verbatim') {
        assert.ok(ed.note && ed.note.length > 20,
          `${b.id}/${ed.id} 不是逐字忠實的底本（${ed.text_fidelity}），必須在 note 對讀者說明`);
      }
    }
  }
  const layout = readFileSync('_layouts/book-chapter.html', 'utf8');
  for (const f of ['verbatim', 'transcribed', 'converted']) {
    assert.ok(layout.includes(`when '${f}'`), `book-chapter.html 沒有處理 text_fidelity=${f}`);
  }
  // 「一字未刪改」只能出現在 verbatim 那一支。只看會渲染出去的部分——
  // 註解裡說明規則本身也會用到這五個字。
  const rendered = layout.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '');
  assert.equal((rendered.match(/一字未刪改/g) || []).length, 1,
    '「一字未刪改」在 book-chapter.html 的渲染內容出現超過一次——非逐字底本會被誤稱');
});

test('底本自己缺的回必須先宣告，才允許章回號跳號', () => {
  const gc = books.find((b) => b.id === 'honglou').editions.find((e) => e.id === 'gengchen-78');
  assert.deepEqual(gc.missing_chapters, [67], '庚辰本缺第 67 回（維基文庫該頁並列列藏本與程高本，不屬本底本）');
  assert.equal(gc.imported_chapters, gc.chapter_count - gc.missing_chapters.length);
});

test('每本書的 blurb 是給讀者看的白話，不含工程術語', () => {
  const jargon = ['schema', 'JSON', 'Markdown', 'edition_id', 'paragraph', 'localStorage', 'manifest', 'hash', 'render'];
  for (const b of books) {
    assert.ok(b.blurb.length >= 20, `${b.id} 的 blurb 太短`);
    for (const w of jargon) {
      assert.ok(!b.blurb.includes(w), `${b.id} 的 blurb 出現術語「${w}」`);
    }
  }
});

// ── 2. 抽象契約 ────────────────────────────────────────────────
const GENERIC_FILES = [
  '_layouts/book-chapter.html',
  '_layouts/book-index.html',
  '_layouts/book-home.html',
  '_includes/book/head.html',
  '_includes/book/topbar.html',
  '_includes/book/footer.html',
  'books/index.html',
  'assets/js/book-reader.js',
  'assets/css/book-reader.css',
];

test('通用層檔案全部存在', () => {
  for (const f of GENERIC_FILES) assert.ok(existsSync(f), `缺檔：${f}`);
});

test('通用 layout 不硬編碼任何書名——加一本書只需改資料', () => {
  for (const f of GENERIC_FILES) {
    const src = readFileSync(f, 'utf8');
    // 註解區塊允許提及金瓶梅（說明為何兩套並存），先剝掉再驗
    const code = src
      .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    for (const title of BOOK_TITLES) {
      assert.ok(!code.includes(title), `${f} 硬編碼了書名「${title}」——應改為從 _data/books.yml 查表`);
    }
  }
});

test('通用層不指向旗艦子站的專屬路徑', () => {
  for (const f of GENERIC_FILES) {
    const src = readFileSync(f, 'utf8')
      .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    assert.ok(!/\/jinpingmei\//.test(src), `${f} 出現 /jinpingmei/ 路徑`);
    assert.ok(!/jpm-/.test(src), `${f} 出現金瓶梅專屬的 jpm- 命名`);
  }
});

test('每個非 planned 且無專屬子站的作品，都有作品頁與回目頁', () => {
  for (const b of books) {
    if (b.status === 'planned' || b.flagship_url) continue;
    assert.ok(existsSync(`${b.id}/index.html`), `缺 books/${b.id}/index.html`);
    for (const ed of b.editions) {
      if (ed.imported_chapters === 0) continue;
      const dir = ed.id === b.primary_edition ? `${b.id}/text` : `${b.id}/text/${ed.id}`;
      assert.ok(existsSync(`${dir}/index.html`), `缺 ${dir}/index.html`);
    }
  }
});

test('book id 不得與站上既有頂層路徑相撞', () => {
  // 每部作品各佔一個頂層路徑（/shuihu/、/jinpingmei/…），所以 id 一旦撞到既有
  // 區塊就會蓋掉那一區。新增作品時這個測試會先擋下來。
  const reserved = new Set(['books', 'games', 'press', 'nft', 'education', 'tarot', 'story',
    'about', 'services', 'contact', 'blog', 'posts', 'assets', 'feed', 'sitemap', 'search',
    'photography', 'portfolio', 'explore', 'tools', 'schema', 'content']);
  for (const b of books) {
    if (b.flagship_url) {
      // 旗艦作品本來就佔著自己的頂層路徑，只要確認宣告的網址與 id 一致
      assert.equal(b.flagship_url, `/${b.id}/`, `${b.id} 的 flagship_url 應為 /${b.id}/ 才與通用層同形`);
      continue;
    }
    assert.ok(!reserved.has(b.id), `book id "${b.id}" 與站上既有頂層路徑相撞`);
  }
});

test('作品頁與回目頁只放 front matter，不重複實作版面', () => {
  for (const b of books) {
    if (b.status === 'planned' || b.flagship_url) continue;
    const { body } = parseFrontMatter(readFileSync(`${b.id}/index.html`, 'utf8'));
    assert.equal(body.trim(), '', `books/${b.id}/index.html 應只有 front matter`);
  }
});

test('有專屬子站的作品，註冊表宣告的收錄數必須與實際 collection 檔數相符', () => {
  // 這類作品不走 _books/，validate_content.mjs 查不到它們——沒有這個測試，
  // books.yml 就可能默默說謊（宣告 101 篇，實際 collection 只有 99 篇）。
  const flagshipCollections = { jinpingmei: { dir: '_jinpingmei', prefix: { wanli: '', chongzhen: 'chongzhen-' } } };
  for (const b of books) {
    if (!b.flagship_url) continue;
    const map = flagshipCollections[b.id];
    assert.ok(map, `${b.id} 有 flagship_url 但這個測試不知道它的 collection 在哪——請補進 flagshipCollections`);
    const files = readdirSync(map.dir).filter((f) => f.endsWith('.html'));
    for (const ed of b.editions) {
      const prefix = map.prefix[ed.id];
      assert.notEqual(prefix, undefined, `${b.id} 的 edition "${ed.id}" 沒有對應的檔名前綴`);
      const actual = files.filter((f) => (prefix === '' ? /^\d{3}\.html$/.test(f) : f.startsWith(prefix))).length;
      assert.equal(actual, ed.imported_chapters, `books.yml[${b.id}/${ed.id}] 宣告 ${ed.imported_chapters} 篇，${map.dir} 實際 ${actual} 篇`);
    }
  }
});

test('段落 ID 格式正確且連號從 0002 起（回目不進正文）', () => {
  const files = readdirSync('_books').filter((f) => f.endsWith('.html'));
  assert.ok(files.length > 0, '_books/ 是空的');
  for (const f of files) {
    const { data, body } = parseFrontMatter(readFileSync(`_books/${f}`, 'utf8'));
    const pad = String(data.chapter).padStart(3, '0');
    const ids = [...body.matchAll(/<p id="([^"]+)">/g)].map((m) => m[1]);
    assert.ok(ids.length > 0, `${f} 沒有任何段落`);
    ids.forEach((id, i) => {
      assert.match(id, /^p-\d{3}-\d{4}$/, `${f} 段落 id 格式錯誤：${id}`);
      assert.equal(id, `p-${pad}-${String(i + 2).padStart(4, '0')}`, `${f} 段落 id 不連號：${id}`);
    });
  }
});

test('水滸傳 pilot 收錄楔子與前五回', () => {
  const chapters = readdirSync('_books')
    .filter((f) => f.startsWith('shuihu-gutenberg-23863-'))
    .map((f) => Number(f.match(/-(\d{3})\.html$/)[1]))
    .sort((a, b) => a - b);
  assert.deepEqual(chapters, [0, 1, 2, 3, 4, 5], '楔子（000）是正文開篇，不可漏');
  const wedge = parseFrontMatter(readFileSync('_books/shuihu-gutenberg-23863-000.html', 'utf8'));
  assert.equal(wedge.data.label, '楔子');
});

// ── 3. 自製工具的測試 ──────────────────────────────────────────
test('mini-yaml：解析 books.yml 的巢狀結構與各種純量', () => {
  const jpm = books[0];
  assert.equal(jpm.id, 'jinpingmei');
  assert.deepEqual(jpm.alternate_titles, ['金瓶梅詞話', '新刻繡像批評金瓶梅']);   // flow sequence
  assert.equal(jpm.editions.length, 2);                                          // 巢狀 mapping 序列
  assert.equal(jpm.editions[0].chapter_count, 100);                              // 整數
  assert.equal(typeof jpm.editions[0].retrieved_at, 'string');                   // 單引號字串不轉數字
  assert.equal(jpm.editions[0].source_page.startsWith('https://'), true);        // URL 的 :// 不被誤切
});

test('mini-yaml：不支援的語法要丟錯，不默默解錯', () => {
  assert.throws(() => parseYamlSequence('- a: |\n    block\n'), /區塊字串/);
  assert.throws(() => parseYamlSequence('- a: "x"\n'), /雙引號/);
  assert.throws(() => parseYamlSequence('a: 1\n'), /頂層必須是/);
});

test('mini-schema：該過的過、該擋的擋', () => {
  const s = {
    type: 'object',
    required: ['id', 'n'],
    additionalProperties: false,
    properties: {
      id: { type: 'string', pattern: '^[a-z]+$' },
      n: { type: 'integer', minimum: 1 },
      tag: { enum: ['a', 'b'] },
      list: { type: 'array', minItems: 1, items: { type: 'string' } },
      maybe: { type: ['integer', 'null'] },
    },
  };
  assert.deepEqual(validate(s, { id: 'ok', n: 2, tag: 'a', list: ['x'], maybe: null }), []);
  assert.match(validate(s, { n: 1 })[0], /缺必填欄位 "id"/);
  assert.match(validate(s, { id: 'Bad', n: 1 })[0], /pattern/);
  assert.match(validate(s, { id: 'ok', n: 0 })[0], /小於最小值/);
  assert.match(validate(s, { id: 'ok', n: 1.5 })[0], /型別應為 integer/);
  assert.match(validate(s, { id: 'ok', n: 1, tag: 'z' })[0], /不在允許清單/);
  assert.match(validate(s, { id: 'ok', n: 1, list: [] })[0], /少於 1/);
  assert.match(validate(s, { id: 'ok', n: 1, extra: 1 })[0], /未定義欄位/);
});

test('mini-schema：遇到未支援的關鍵字要丟錯，避免規則寫了卻沒在驗', () => {
  assert.throws(() => validate({ type: 'string', maxLength: 3 }, 'abcd'), /不支援關鍵字 "maxLength"/);
});

test('所有 schema 檔都是合法 JSON 且有 title 與 description', () => {
  const files = readdirSync('schema').filter((f) => f.endsWith('.schema.json'));
  assert.ok(files.length >= 9, `schema/ 只有 ${files.length} 檔`);
  for (const f of files) {
    const s = JSON.parse(readFileSync(`schema/${f}`, 'utf8'));
    assert.ok(s.title, `${f} 缺 title`);
    assert.ok(s.description, `${f} 缺 description`);
    assert.equal(s.$schema, 'https://json-schema.org/draft/2020-12/schema', `${f} 的 $schema 不一致`);
  }
});

test('AI 產生的實體 schema 一律要求 evidence 或 review_status（PLAN.md §16/§17）', () => {
  for (const f of ['character', 'relationship', 'event', 'location', 'term', 'canonical-character']) {
    const s = JSON.parse(readFileSync(`schema/${f}.schema.json`, 'utf8'));
    assert.ok(s.properties.review_status, `${f} 缺 review_status`);
    assert.deepEqual(s.properties.review_status.enum, ['unreviewed', 'ai-reviewed', 'human-reviewed', 'verified'], `${f} 的 review_status 選項不一致`);
    assert.ok((s.required || []).includes('review_status'), `${f} 的 review_status 應為必填`);
  }
  // 關係與事件必須指得回原文段落
  for (const f of ['relationship', 'event']) {
    const s = JSON.parse(readFileSync(`schema/${f}.schema.json`, 'utf8'));
    const key = f === 'relationship' ? 'evidence' : 'paragraphs';
    assert.ok((s.required || []).includes(key), `${f} 的 ${key} 應為必填`);
    assert.equal(s.properties[key].minItems, 1, `${f} 的 ${key} 至少要一筆`);
  }
});
