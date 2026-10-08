// contact-form-script.test.mjs — /contact/ 洽詢表單的內嵌程式必須能被瀏覽器解析。
// 2026-09-15～10-08 曾因提示文字的單引號字串裡直接換行，整段程式語法錯誤：送出攔截沒掛上，
// 表單（沒有 action）按送出只會重新整理頁面，訪客的洽詢全數沒送出去，且畫面看不出異常。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = readFileSync(fileURLToPath(new URL('../contact/index.html', import.meta.url)), 'utf8');

test('contact 頁每段內嵌 script 都能解析（Liquid 先換成占位）', () => {
  const blocks = [...src.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter((m) => !/json|speculationrules/.test(m[1]));
  assert.ok(blocks.length > 0, '找不到內嵌 script');
  for (const [, , body] of blocks) {
    const js = body.replace(/\{\{[\s\S]*?\}\}/g, 'x').replace(/\{%[\s\S]*?%\}/g, '');
    assert.doesNotThrow(() => new Function(js), js.slice(0, 80));
  }
});

test('送出攔截與成功事件都在', () => {
  assert.match(src, /form\.addEventListener\('submit'/);
  assert.match(src, /gtag\('event', 'contact_form_submit'/);
});
