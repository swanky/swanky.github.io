/**
 * 古典小說原文搜尋（T8 Phase 7）的契約測試。
 *
 * 分四層：
 *   1. 覆蓋率與形狀——五本書七個版本都要有索引檔，欄位照抄 _data/books.yml
 *   2. 原文忠實度——索引沒有漂移、段落數獨立可核、抽樣文字逐字相符、批語不進索引
 *   3. 深連結——格式正確、目標章回檔存在且真的有那個段落錨點
 *   4. 搜尋純邏輯——關鍵字交集、高亮轉義、片段裁切（DOM 無關，可在 node 直接跑）
 *
 * 注意：段落總數的基準一律是「章回檔裡 <p id="p-…"> 的實際數量」，
 * 不是 front matter 的 paragraph_count——後者把回目也算一段（_books 每檔多 1）。
 */
import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import { parseYamlSequence } from '../tools/lib/mini-yaml.mjs';
import {
  BOOKS_YML, INDEX_FILE, buildAll, editionSources, extractChapter, fileFor, normalizeText, readNormalized, serialize,
} from '../tools/build_search_index.mjs';
import {
  ALL_EDITIONS, MAX_RESULTS, chapterUrl, editionName, findRanges, highlightHtml, matchesAll,
  normalizeQuery, paragraphAnchor, parseTerms, resultBlockHtml, searchEdition, searchToc, snippet, withRoot,
} from '../assets/js/book-search.js';

const books = parseYamlSequence(readFileSync(BOOKS_YML, 'utf8'));
const sources = editionSources(books);
const index = JSON.parse(readFileSync(INDEX_FILE, 'utf8'));
const onDisk = new Map(sources.map((s) => [s.key, JSON.parse(readFileSync(fileFor(s.key), 'utf8'))]));

/** 章回檔的實際路徑（來源目錄與檔名前綴由 editionSources 算好）。 */
function chapterFile(src, c) {
  return `${src.dir}/${src.prefix}${c}.html`;
}

/** 只用「去掉全部空白」比對，避開索引的摺空白政策——抓的是改寫與截斷。 */
function bare(text) {
  return String(text).replace(/\s|　/g, '');
}

// ── 1. 覆蓋率與形狀 ──────────────────────────────────────────────

test('五本書、七個版本全部有索引檔', () => {
  assert.equal(sources.length, 7, `預期 7 個版本，實際 ${sources.length}`);
  assert.deepEqual([...new Set(sources.map((s) => s.book))], ['jinpingmei', 'shuihu', 'sanguo', 'xiyou', 'honglou']);
  for (const src of sources) {
    assert.ok(existsSync(fileFor(src.key)), `缺索引檔：${fileFor(src.key)}`);
  }
  assert.equal(index.editions.length, 7);
});

test('索引欄位照抄 books.yml，不自行改寫書名或版本標籤', () => {
  for (const src of sources) {
    const data = onDisk.get(src.key);
    const book = books.find((b) => b.id === src.book);
    const ed = book.editions.find((e) => e.id === src.edition);
    assert.equal(data.book, book.id);
    assert.equal(data.book_title, book.title, `${src.key}: 書名與註冊表不符`);
    assert.equal(data.edition, ed.id);
    assert.equal(data.edition_label, ed.label, `${src.key}: 版本標籤與註冊表不符`);
  }
});

test('base 一律依 primary_edition 規則產生（主版本省略版本段）', () => {
  for (const src of sources) {
    const book = books.find((b) => b.id === src.book);
    const expected = src.edition === book.primary_edition
      ? `/${book.id}/text/`
      : `/${book.id}/text/${src.edition}/`;
    assert.equal(onDisk.get(src.key).base, expected, `${src.key}: base 不符規則`);
    assert.equal(index.editions.find((e) => `${e.book}-${e.edition}` === src.key).base, expected);
  }
  // 實測值（T8 第一階段對全 690 檔逐檔驗證 0 例外）
  const byKey = (k) => index.editions.find((e) => `${e.book}-${e.edition}` === k).base;
  assert.equal(byKey('jinpingmei-wanli'), '/jinpingmei/text/');
  assert.equal(byKey('jinpingmei-chongzhen'), '/jinpingmei/text/chongzhen/');
  assert.equal(byKey('honglou-wikisource-120'), '/honglou/text/');
  assert.equal(byKey('honglou-gengchen-78'), '/honglou/text/gengchen-78/');
});

test('輕索引的 file／章回數／段落數與各版索引檔一致', () => {
  for (const meta of index.editions) {
    const key = `${meta.book}-${meta.edition}`;
    const data = onDisk.get(key);
    assert.ok(data, `輕索引列了 ${key}，卻沒有對應的索引檔`);
    assert.equal(meta.file, `/assets/search/${key}.json`);
    assert.ok(existsSync(meta.file.replace(/^\//, '')), `${meta.file} 不存在`);
    assert.equal(meta.chapters, data.chapters.length);
    assert.equal(meta.paragraphs, data.chapters.reduce((n, ch) => n + ch.ps.length, 0));
    assert.equal(meta.toc.length, data.chapters.length);
    assert.deepEqual(meta.toc.map((row) => row[0]), data.chapters.map((ch) => ch.c));
  }
  assert.equal(index.editions.reduce((n, e) => n + e.chapters, 0), 690, '全站章回數應為 690');
  assert.equal(index.editions.reduce((n, e) => n + e.paragraphs, 0), 19333, '全站段落數應為 19333');
});

test('章回號三位零填、依號碼遞增；段序遞增且為正整數', () => {
  for (const src of sources) {
    const data = onDisk.get(src.key);
    let prev = -1;
    for (const ch of data.chapters) {
      assert.match(ch.c, /^\d{3}$/, `${src.key}/${ch.c}: 章回號格式`);
      const n = Number(ch.c);
      assert.ok(n > prev, `${src.key}: 章回未依號碼遞增（${ch.c} 在 ${prev} 之後）`);
      prev = n;
      assert.ok(ch.ps.length > 0, `${src.key}/${ch.c}: 沒有任何段落`);
      let prevSeq = 0;
      for (const [seq, text] of ch.ps) {
        assert.ok(Number.isInteger(seq) && seq > 0, `${src.key}/${ch.c}: 段序 ${seq} 不是正整數`);
        assert.ok(seq > prevSeq, `${src.key}/${ch.c}: 段序未遞增`);
        prevSeq = seq;
        assert.ok(text.length > 0, `${src.key}/${ch.c}/${seq}: 空段落不該進索引`);
      }
    }
  }
});

// ── 2. 原文忠實度 ────────────────────────────────────────────────

test('索引沒有漂移：重新抽取一次的結果與磁碟上的檔案相同（換行正規化後逐位元組比對）', () => {
  const { editions, index: rebuilt } = buildAll();
  for (const { src, data } of editions) {
    assert.equal(readNormalized(fileFor(src.key)), serialize(data),
      `${fileFor(src.key)} 與重算結果不一致——請重跑 node tools/build_search_index.mjs`);
  }
  assert.equal(readNormalized(INDEX_FILE), serialize(rebuilt),
    `${INDEX_FILE} 與重算結果不一致——請重跑 node tools/build_search_index.mjs`);
});

test('每回的段落數等於章回檔裡 <p id="p-…"> 的實際數量（獨立計數，不看 paragraph_count）', () => {
  let checked = 0;
  for (const src of sources) {
    for (const ch of onDisk.get(src.key).chapters) {
      const file = chapterFile(src, ch.c);
      const raw = readFileSync(file, 'utf8');
      const tags = raw.match(/<p id="p-\d{3}-\d{4}"/g) || [];
      assert.equal(ch.ps.length, tags.length, `${file}: 索引 ${ch.ps.length} 段、原檔 ${tags.length} 段`);
      checked += 1;
    }
  }
  assert.equal(checked, 690);
});

test('抽樣段落：索引文字去掉空白後與章回檔原文逐字相符（沒有被改寫或截斷）', () => {
  let sampled = 0;
  for (const src of sources) {
    const chapters = onDisk.get(src.key).chapters;
    // 每版取頭、中、尾三回，每回取頭中尾三段——共 63 個樣本
    for (const ch of [chapters[0], chapters[Math.floor(chapters.length / 2)], chapters[chapters.length - 1]]) {
      const raw = readFileSync(chapterFile(src, ch.c), 'utf8');
      const picks = [ch.ps[0], ch.ps[Math.floor(ch.ps.length / 2)], ch.ps[ch.ps.length - 1]];
      for (const [seq, text] of picks) {
        const id = `p-${ch.c}-${String(seq).padStart(4, '0')}`;
        const m = raw.match(new RegExp(`<p id="${id}"[^>]*>([\\s\\S]*?)</p>`));
        assert.ok(m, `${chapterFile(src, ch.c)}: 找不到段落 ${id}`);
        const fromSource = bare(m[1].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&amp;/g, '&'));
        assert.equal(bare(text), fromSource, `${src.key}/${id}: 索引文字與原文不符`);
        sampled += 1;
      }
    }
  }
  assert.equal(sampled, 63);
});

test('只收正文段落：章回檔裡的回末批語區塊不進索引', () => {
  // 庚辰本章回檔末尾有 <details> 批語區塊，裡面的說明段是 <p class="bk-ann-intro">，
  // 沒有段落 id——抽取式刻意要求 id="p-…"，所以批語一個字都不會進索引。
  const raw = readFileSync('_books/honglou-gengchen-78-001.html', 'utf8');
  if (!raw.includes('bk-ann-intro')) return; // 尚未加上批語區塊的話這條無事可驗
  const introMatch = raw.match(/<p class="bk-ann-intro">([\s\S]*?)<\/p>/);
  assert.ok(introMatch, '找到 bk-ann-intro 但抓不出內容');
  const intro = normalizeText(introMatch[1]).slice(0, 12);
  const data = onDisk.get('honglou-gengchen-78');
  const flat = data.chapters.flatMap((ch) => ch.ps.map((p) => p[1]));
  assert.ok(!flat.some((t) => t.includes(intro)), '批語說明段跑進索引了');
  const annText = raw.match(/<span class="bk-ann-text">([\s\S]*?)<\/span>/);
  if (annText) {
    const first = normalizeText(annText[1]).slice(0, 8);
    assert.ok(!flat.some((t) => t.includes(first)), '批語文字跑進索引了');
  }
});

test('normalizeText 只摺空白、不改動文字（含還原字元實體）', () => {
  assert.equal(normalizeText('　　丈夫隻手把吳鈎'), '丈夫隻手把吳鈎');
  assert.equal(normalizeText('無材可去補蒼天，<br>枉入紅塵若許年！'), '無材可去補蒼天，枉入紅塵若許年！');
  assert.equal(normalizeText('甲&lt;側&gt;'), '甲<側>');
  assert.equal(normalizeText('前  後'), '前 後');
  assert.equal(normalizeText('潘金蓮'), '潘金蓮', '一般文字一個字都不改');
});

test('extractChapter 不吃沒有段落 id 的 <p>', () => {
  const raw = '---\nchapter: 3\nlabel: "第三回"\ncouplet: "甲　乙"\n---\n'
    + '<p id="p-003-0002">正文一</p>\n<p class="bk-ann-intro">批語說明</p>\n<p>沒有 id</p>\n'
    + '<p id="p-003-0003">正文二</p>\n';
  const got = extractChapter(raw);
  assert.equal(got.chapter, 3);
  assert.equal(got.label, '第三回');
  assert.equal(got.couplet, '甲　乙');
  assert.deepEqual(got.paragraphs.map((p) => [p[0], p[1]]), [[2, '正文一'], [3, '正文二']]);
});

// ── 3. 深連結 ────────────────────────────────────────────────────

test('抽樣深連結：格式正確，目標章回檔存在且真的有那個段落錨點', () => {
  let checked = 0;
  for (const src of sources) {
    const data = onDisk.get(src.key);
    for (const ch of [data.chapters[0], data.chapters[data.chapters.length - 1]]) {
      for (const [seq] of [ch.ps[0], ch.ps[ch.ps.length - 1]]) {
        const url = paragraphAnchor(data.base, ch.c, seq);
        assert.match(url, /^\/[a-z]+\/text\/(?:[a-z0-9-]+\/)?\d{3}\/#p-\d{3}-\d{4}$/, `深連結格式錯：${url}`);
        assert.equal(url.split('#')[0], chapterUrl(data.base, ch.c));
        const file = chapterFile(src, ch.c);
        assert.ok(existsSync(file), `深連結 ${url} 的章回檔不存在：${file}`);
        const id = url.split('#')[1];
        assert.ok(readFileSync(file, 'utf8').includes(`<p id="${id}"`), `${file} 裡沒有錨點 ${id}`);
        // 章回檔的 permalink 必須等於 base + 章回號
        const permalink = readFileSync(file, 'utf8').match(/^permalink:\s*"?([^"\r\n]+)"?\s*$/m);
        assert.ok(permalink, `${file} 沒有 permalink`);
        assert.equal(permalink[1].trim(), chapterUrl(data.base, ch.c), `${file}: permalink 與深連結前綴不符`);
        checked += 1;
      }
    }
  }
  assert.equal(checked, 28);
});

test('paragraphAnchor 把段序補回四位零填；withRoot 尊重 baseurl', () => {
  assert.equal(paragraphAnchor('/jinpingmei/text/', '001', 17), '/jinpingmei/text/001/#p-001-0017');
  assert.equal(paragraphAnchor('/honglou/text/gengchen-78/', '001', 2), '/honglou/text/gengchen-78/001/#p-001-0002');
  assert.equal(paragraphAnchor('/jinpingmei/text/chongzhen/', '001', 1), '/jinpingmei/text/chongzhen/001/#p-001-0001');
  assert.equal(withRoot('/', '/assets/search/index.json'), '/assets/search/index.json');
  assert.equal(withRoot('/base/', '/assets/search/index.json'), '/base/assets/search/index.json');
  assert.equal(withRoot('/base', '/assets/search/index.json'), '/base/assets/search/index.json');
  assert.equal(withRoot('/base/', 'relative/path'), 'relative/path');
});

// ── 4. 搜尋純邏輯 ────────────────────────────────────────────────

test('parseTerms：空白分隔、去重、保留輸入順序', () => {
  assert.deepEqual(parseTerms('潘金蓮'), ['潘金蓮']);
  assert.deepEqual(parseTerms('  西門慶   潘金蓮 '), ['西門慶', '潘金蓮']);
  assert.deepEqual(parseTerms('西門慶　潘金蓮'), ['西門慶', '潘金蓮'], '全形空白也算分隔');
  assert.deepEqual(parseTerms('酒 酒'), ['酒'], '重複的詞只留一個');
  assert.deepEqual(parseTerms('西門 西門慶'), ['西門', '西門慶'], '不重排——巢狀高亮交給 findRanges 合併');
  assert.deepEqual(parseTerms('   '), []);
  assert.equal(normalizeQuery('　　葡萄　架　'), '葡萄 架');
});

test('matchesAll：全部關鍵字都要出現才算命中', () => {
  assert.equal(matchesAll('西門慶與潘金蓮', ['西門慶', '潘金蓮']), true);
  assert.equal(matchesAll('西門慶與李瓶兒', ['西門慶', '潘金蓮']), false);
  assert.equal(matchesAll('西門慶', []), false, '沒有關鍵字時不該算命中');
});

test('findRanges：重疊與相鄰的區間都併成一段，不產生嵌套', () => {
  assert.deepEqual(findRanges('西門慶說', ['西門慶', '西門']), [[0, 3]]);
  assert.deepEqual(findRanges('西門慶說', ['西門', '西門慶']), [[0, 3]], '輸入順序不影響結果');
  assert.deepEqual(findRanges('酒酒酒', ['酒']), [[0, 3]], '連著的三個命中併成一段');
  assert.deepEqual(findRanges('酒色酒', ['酒']), [[0, 1], [2, 3]]);
  assert.deepEqual(findRanges('甲乙丙', ['丁']), []);
});

test('highlightHtml：先轉義再包 <mark>，HTML 進不去', () => {
  assert.equal(highlightHtml('西門慶與潘金蓮', ['潘金蓮']), '西門慶與<mark>潘金蓮</mark>');
  assert.equal(highlightHtml('甲<側>乙', ['側']), '甲&lt;<mark>側</mark>&gt;乙');
  assert.equal(highlightHtml('<img src=x onerror=alert(1)>', ['img']),
    '&lt;<mark>img</mark> src=x onerror=alert(1)&gt;', '查詢字串命中標籤字樣也不會產生真標籤');
  assert.equal(highlightHtml('a&b', ['&']), 'a<mark>&amp;</mark>b');
  const nested = highlightHtml('西門慶', parseTerms('西門慶 西門'));
  assert.equal(nested, '<mark>西門慶</mark>', '長詞先處理，不會出現 <mark> 套 <mark>');
});

test('snippet：長段落只取命中處前後，短段落整段留著', () => {
  const short = '西門慶笑道';
  assert.deepEqual(snippet(short, ['西門慶']), { text: short, head: false, tail: false });
  const long = `${'甲'.repeat(200)}潘金蓮${'乙'.repeat(200)}`;
  const piece = snippet(long, ['潘金蓮'], 10);
  assert.equal(piece.text, `${'甲'.repeat(10)}潘金蓮${'乙'.repeat(10)}`);
  assert.equal(piece.head, true);
  assert.equal(piece.tail, true);
  assert.ok(piece.text.includes('潘金蓮'), '片段一定要含命中的字');
});

test('searchEdition：段落級交集、章回聚合、結果上限', () => {
  const data = {
    chapters: [
      { c: '001', l: '第一回', t: '甲　乙', ps: [[1, '西門慶與潘金蓮'], [2, '西門慶獨行']] },
      { c: '002', l: '第二回', t: '丙　丁', ps: [[1, '潘金蓮獨行'], [2, '西門慶與潘金蓮再會']] },
    ],
  };
  const both = searchEdition(data, ['西門慶', '潘金蓮']);
  assert.equal(both.total, 2);
  assert.equal(both.chapters, 2);
  assert.equal(both.capped, false);
  assert.deepEqual(both.hits.map((h) => [h.c, h.seq]), [['001', 1], ['002', 2]]);
  assert.equal(both.hits[0].l, '第一回');
  assert.equal(both.hits[0].t, '甲　乙');

  const one = searchEdition(data, ['西門慶']);
  assert.equal(one.total, 3);
  assert.equal(one.chapters, 2);

  const capped = searchEdition(data, ['西門慶'], { limit: 1 });
  assert.equal(capped.total, 3, '上限只影響畫出來的筆數，總數照實算');
  assert.equal(capped.hits.length, 1);
  assert.equal(capped.capped, true);

  assert.equal(searchEdition(data, []).total, 0);
  assert.equal(MAX_RESULTS, 100);
});

test('searchToc：回目命中（回次＋回目對聯）', () => {
  const toc = [['001', '第一回', '景陽岡武松打虎 潘金蓮嫌夫賣風月'], ['002', '第二回', '俏潘娘簾下勾情 老王婆茶坊說技']];
  assert.deepEqual(searchToc(toc, ['武松打虎']), [{ c: '001', l: '第一回', t: '景陽岡武松打虎 潘金蓮嫌夫賣風月' }]);
  assert.equal(searchToc(toc, ['第二回']).length, 1, '回次也能找');
  assert.equal(searchToc(toc, ['諸葛亮']).length, 0);
  // 回目用全形空白分隔的底本也要找得到跨空白的詞
  assert.equal(searchToc([['001', '第一回', '甄士隱夢幻識通靈　賈雨村風塵懷閨秀']], parseTerms('通靈 賈雨村')).length, 1);
});

test('真實原文回歸值（與 T8 第一階段實測一致）', () => {
  const wanli = onDisk.get('jinpingmei-wanli');
  const big = { limit: Infinity };
  assert.equal(searchEdition(wanli, parseTerms('潘金蓮'), big).total, 239);
  assert.equal(searchEdition(wanli, parseTerms('西門慶'), big).total, 1168);
  assert.equal(searchEdition(wanli, parseTerms('西門慶 潘金蓮'), big).total, 171);
  assert.equal(searchEdition(wanli, parseTerms('酒'), big).total, 966);
  assert.equal(searchEdition(wanli, parseTerms('碧霞宮'), big).total, 4);
  assert.equal(searchEdition(wanli, parseTerms('量子力學'), big).total, 0);
  // 版本用字本來就不統一，這是版本學事實不是資料錯誤（_data/books.yml 已載明
  // 崇禎本原文人名作「陳敬濟」）——所以兩種寫法各自命中，系統絕不自動改寫。
  const chongzhen = onDisk.get('jinpingmei-chongzhen');
  assert.ok(searchEdition(chongzhen, parseTerms('陳敬濟'), big).total > 0);
  assert.equal(searchEdition(wanli, parseTerms('陳敬濟'), big).total, 0);
  assert.ok(searchEdition(wanli, parseTerms('陳經濟'), big).total > 0);
});

test('resultBlockHtml：命中的原文可點、指向段落深連結', () => {
  const meta = { book_title: '金瓶梅', edition_label: '詞話本（萬曆本）', base: '/jinpingmei/text/' };
  const data = { chapters: [{ c: '001', l: '第一回', t: '景陽岡武松打虎 潘金蓮嫌夫賣風月', ps: [[17, '有個嫡親同胞兄弟，名喚武松。']] }] };
  const terms = parseTerms('武松');
  const html = resultBlockHtml(meta, searchEdition(data, terms), searchToc([['001', '第一回', '景陽岡武松打虎 潘金蓮嫌夫賣風月']], terms), terms, '/', false);
  assert.ok(html.includes('href="/jinpingmei/text/001/#p-001-0017"'), `缺段落深連結：${html}`);
  assert.ok(html.includes('href="/jinpingmei/text/001/"'), '缺回目連結');
  assert.ok(html.includes('<mark>武松</mark>'), '關鍵字沒有高亮');
  assert.ok(html.includes('《金瓶梅》詞話本（萬曆本）'), '缺書名與版本標籤');
  assert.equal(editionName(meta), '《金瓶梅》詞話本（萬曆本）');
  // baseurl 不空時連結要跟著長出前綴
  const withBase = resultBlockHtml(meta, searchEdition(data, terms), [], terms, '/base/', true);
  assert.ok(withBase.includes('href="/base/jinpingmei/text/001/#p-001-0017"'), `baseurl 沒接上：${withBase}`);
});

// ── 5. 頁面接線與站台脈絡地圖 ────────────────────────────────────

test('搜尋頁：路徑、資源連結、可及性掛鉤齊備', () => {
  const page = readFileSync('books/search/index.html', 'utf8');
  assert.match(page, /^---\r?\n[\s\S]*?permalink:\s*\/books\/search\/\s*$/m, '缺 permalink /books/search/');
  assert.ok(page.includes("{{ '/assets/css/book-search.css' | relative_url }}"), 'CSS 沒用 relative_url');
  assert.ok(page.includes("{{ '/assets/js/book-search.js' | relative_url }}"), 'JS 沒用 relative_url');
  assert.ok(page.includes('type="module"'), 'JS 要以 module 載入');
  assert.ok(!page.includes('assets/css/book-reader.css'), '不該自己再 link 一次通用閱讀器樣式（head include 已含）');
  // 前端接線點
  for (const hook of ['data-search-form', 'data-search-input', 'data-search-status', 'data-search-results', 'data-root=']) {
    assert.ok(page.includes(hook), `缺接線點 ${hook}`);
  }
  assert.ok(page.includes("data-root=\"{{ '/' | relative_url }}\""), 'data-root 要用 relative_url 產生');
  // 可及性
  assert.match(page, /<label class="bks-query__label" for="bks-q">[^<]+<\/label>/, '搜尋框缺中文 label');
  assert.ok(page.includes('id="bks-q"'), 'label 對應不到輸入框');
  assert.ok(page.includes('aria-describedby="bks-q-help"'), '輸入框缺說明關聯');
  assert.ok(page.includes('role="status"') && page.includes('aria-live="polite"'), '狀態區缺 aria-live');
  assert.ok(page.includes('<legend>'), '選書區缺 legend');
  assert.ok(page.includes('aria-labelledby="bks-results-h"'), '結果區缺標題關聯');
  assert.ok(page.includes(`value="${ALL_EDITIONS}"`), '缺「五部一起找」選項');
  assert.ok(page.includes('bk-skip'), '缺跳過導覽連結');
  // 可選範圍一律由 _data/books.yml 產生（加一本書不必改這頁）
  assert.ok(page.includes('{{ b.title }}') && page.includes('{{ ed.label }}'), '選書清單沒有從註冊表產生');
  assert.ok(page.includes('site.data.books'), '沒有讀 _data/books.yml');
});

test('搜尋頁對外文案不出現工程術語', () => {
  const page = readFileSync('books/search/index.html', 'utf8');
  const body = page.slice(page.indexOf('<body'));
  const visible = body.replace(/<[^>]+>/g, ' ');
  for (const word of ['索引', 'JSON', '快取', 'localStorage', 'render', 'schema', '載入中', '段落 ID', '深連結']) {
    assert.ok(!visible.includes(word), `對外文案出現術語「${word}」`);
  }
});

test('llms.txt 收了搜尋頁，描述沿用頁面 front matter 原文', () => {
  const page = readFileSync('books/search/index.html', 'utf8');
  const desc = page.match(/^description:\s*(.+?)\s*$/m);
  assert.ok(desc, '頁面缺 description front matter');
  const llms = readFileSync('llms.txt', 'utf8');
  assert.ok(llms.includes('https://swanky.github.io/books/search/'), 'llms.txt 沒有搜尋頁');
  assert.ok(llms.includes(desc[1]), 'llms.txt 的描述沒有沿用頁面 description（不得自行改寫）');
});
