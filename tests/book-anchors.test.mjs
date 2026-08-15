/**
 * 「本回節點」錨點資料的機械驗證——tools/merge_book_anchors.mjs 寫檔前已經核對過一次
 * （段落存在＋機械算出 k），這裡是第二道獨立檢查，直接對 _data/book_anchors/ 目前的內容
 * 驗證，抓的是「原文之後又被改動、k 已經跟資料對不上」這類 merge 當下不會出現的漂移。
 *
 * _data/book_anchors/ 不存在或是空目錄＝尚未有任何一本書上線本回節點，測試略過、不失敗。
 */
import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import { BOOKS, extractParagraphs, loadChapterFile } from '../tools/build_book_anchor_index.mjs';
import { prefix10 } from '../tools/merge_book_anchors.mjs';

const DIR = '_data/book_anchors';
const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith('.json')) : [];
const skip = files.length === 0 ? '_data/book_anchors 尚無資料（尚未有書上線本回節點）' : false;

test('本回節點：資料檔的檔名必須是 BOOKS 表裡的合法 key', { skip }, () => {
  for (const f of files) {
    const key = f.replace(/\.json$/, '');
    assert.ok(BOOKS[key], `${f} 的檔名「${key}」不在 tools/build_book_anchor_index.mjs 的 BOOKS 表中`);
  }
});

test('本回節點：每回 3–8 條、p 嚴格遞增', { skip }, () => {
  for (const f of files) {
    const key = f.replace(/\.json$/, '');
    if (!BOOKS[key]) continue; // 上一個測試已經報過，這裡不重複炸
    const data = JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8'));
    for (const [ch, anchors] of Object.entries(data)) {
      assert.ok(Array.isArray(anchors) && anchors.length >= 3 && anchors.length <= 8,
        `${key}/${ch} 有 ${anchors.length} 條，應為 3–8 條`);
      for (let i = 1; i < anchors.length; i += 1) {
        assert.ok(anchors[i].p > anchors[i - 1].p,
          `${key}/${ch} 的 p 未嚴格遞增：${anchors[i - 1].p} → ${anchors[i].p}`);
      }
    }
  }
});

test('本回節點：每筆段落存在於章檔、k 與原文前綴逐字相符、t 為 1–12 字', { skip }, () => {
  for (const f of files) {
    const key = f.replace(/\.json$/, '');
    if (!BOOKS[key]) continue;
    const data = JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8'));
    for (const [ch, anchors] of Object.entries(data)) {
      const chapterNum = parseInt(ch.slice(1), 10);
      const raw = loadChapterFile(key, chapterNum);
      assert.ok(raw, `${key} 找不到第 ${chapterNum} 回的章檔`);
      const paras = extractParagraphs(raw, BOOKS[key].idMode);
      for (const a of anchors) {
        const para = paras.find((x) => x.p === a.p);
        assert.ok(para, `${key}/${ch}/p${a.p}：章檔中找不到這個段序（共 ${paras.length} 段）`);
        assert.equal(a.k, prefix10(para.text),
          `${key}/${ch}/p${a.p}：k 與原文前綴不符（原文可能已異動，需重新跑 merge_book_anchors.mjs）`);
        const len = [...a.t].length;
        assert.ok(len >= 1 && len <= 12, `${key}/${ch}/p${a.p}：t 長度 ${len} 字，應為 1–12 字`);
      }
    }
  }
});
