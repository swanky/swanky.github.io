/**
 * 金瓶梅角色索引（T6a）——tools/build_jinpingmei_character_index.mjs 的機械驗證。
 *
 * 結構性斷言直接對「重新抽取一次 _jinpingmei_characters/*.html」的結果做（不引入 yaml
 * 套件解析 _data/jinpingmei_characters.yml），這樣跟 tests/book-anchors.test.mjs 對
 * build_book_anchor_index.mjs 的驗證方式一致；檔案本身另外用輕量 grep 做一次「產出跟抽取
 * 結果一致」的健檢，抓的是「跑過腳本但忘記重新寫檔」這類漂移。
 */
import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { SRC_DIR, extractOne } from '../tools/build_jinpingmei_character_index.mjs';

const files = readdirSync(SRC_DIR).filter((f) => f.endsWith('.html')).sort();
const characters = files.map((f) => extractOne(path.join(SRC_DIR, f)));

test('19 位角色皆可從 collection 檔案抽取', () => {
  assert.equal(characters.length, 19, `預期 19 檔，實際抽到 ${characters.length} 筆`);
});

test('slug 唯一（等於檔名，不重複）', () => {
  const slugs = characters.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length, '有重複的 slug');
});

test('order 1-19 連續無缺', () => {
  const orders = characters.map((c) => c.order).sort((a, b) => a - b);
  assert.deepEqual(orders, Array.from({ length: 19 }, (_, i) => i + 1));
});

test('每筆 name 與 tier 非空，tier 只能是主角或要角', () => {
  for (const c of characters) {
    assert.ok(c.name.length > 0, `${c.slug}: name 為空`);
    assert.ok(['主角', '要角'].includes(c.tier), `${c.slug}: tier 為「${c.tier}」`);
  }
});

test('relationships 每人至少 1 條，且 name／description 都非空', () => {
  for (const c of characters) {
    assert.ok(c.relationships.length >= 1, `${c.slug}: 人物關係 0 條`);
    for (const r of c.relationships) {
      assert.ok(r.name.length > 0, `${c.slug}: 有一條關係 name 為空`);
      assert.ok(r.description.length > 0, `${c.slug}: 有一條關係 description 為空`);
    }
  }
});

test('life_stages 恰好只有 3 人有資料（ximenqing／lijiaoer／mengyulou），其餘留空陣列', () => {
  const withStages = characters.filter((c) => c.life_stages.length > 0).map((c) => c.slug).sort();
  assert.deepEqual(withStages, ['lijiaoer', 'mengyulou', 'ximenqing']);
  for (const c of characters) {
    if (!withStages.includes(c.slug)) {
      assert.deepEqual(c.life_stages, [], `${c.slug}: 預期空陣列（無書中年齡時間線資料）`);
    }
  }
});

test('aliases 是陣列，且不含空字串元素', () => {
  for (const c of characters) {
    assert.ok(Array.isArray(c.aliases), `${c.slug}: aliases 不是陣列`);
    for (const a of c.aliases) {
      assert.ok(typeof a === 'string' && a.length > 0, `${c.slug}: aliases 含空字串元素`);
    }
  }
});

test('quotes 至少有 1 條，且每條 text 非空', () => {
  for (const c of characters) {
    assert.ok(c.quotes.length >= 1, `${c.slug}: 原文依據 0 條`);
    for (const q of c.quotes) {
      assert.ok(q.text.length > 0, `${c.slug}: 有一條引文 text 為空`);
    }
  }
});

test('_data/jinpingmei_characters.yml 存在，內容含「請勿手動編輯」提醒，且 slug 集合與現抽取結果一致', () => {
  const yml = readFileSync('_data/jinpingmei_characters.yml', 'utf8');
  assert.ok(yml.startsWith('# _data/jinpingmei_characters.yml'), '缺少檔頭註解');
  assert.ok(/請勿手動編輯本檔/.test(yml), '缺少「請勿手動編輯」提醒');
  assert.ok(/build_jinpingmei_character_index\.mjs/.test(yml), '缺少產生工具的路徑說明');
  const slugsInFile = [...yml.matchAll(/- slug: "([^"]+)"/g)].map((m) => m[1]).sort();
  const slugsExtracted = characters.map((c) => c.slug).sort();
  assert.deepEqual(slugsInFile, slugsExtracted, '_data/jinpingmei_characters.yml 跟原始檔已不同步，需重跑 node tools/build_jinpingmei_character_index.mjs');
});
