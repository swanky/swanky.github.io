// core-dom.test.mjs — 共用防禦式 DOM helper 的單元測試。
// 重點：esc 跳脫正確、helper 皆為函式、且「容器不存在就略過、不拋錯」的防呆不變量成立。
// 以極簡 document/window mock 驗證 DOM helper；esc 為純函式免 mock。
import test from 'node:test';
import assert from 'node:assert/strict';
import { $, setHTML, setText, setVal, show, on, gtag, esc } from '../../assets/js/core/core-dom.js';

test('esc 跳脫 & < >；null/undefined → 空字串；數字轉字串', () => {
  assert.equal(esc('<a&b>'), '&lt;a&amp;b&gt;');
  assert.equal(esc(null), '');
  assert.equal(esc(undefined), '');
  assert.equal(esc(42), '42');
  assert.equal(esc('safe'), 'safe');
});

test('8 個 helper 皆為函式', () => {
  for (const fn of [$, setHTML, setText, setVal, show, on, gtag]) {
    assert.equal(typeof fn, 'function');
  }
});

test('DOM helper：容器不存在就略過、不拋錯（防呆核心不變量）', () => {
  const store = {};
  globalThis.document = { getElementById: (id) => store[id] || null };
  try {
    // 不存在 → 全部安靜 no-op，不拋錯
    assert.doesNotThrow(() => {
      setHTML('nope', '<b>'); setText('nope', 'x'); setVal('nope', 'v');
      show('nope', true); on('nope', 'click', () => {});
    });
    // 存在 → 正確寫入
    let bound = null;
    store.box = { innerHTML: '', textContent: '', value: '', style: {}, addEventListener(ev, fn) { bound = { ev, fn }; } };
    setHTML('box', '<i>hi</i>'); assert.equal(store.box.innerHTML, '<i>hi</i>');
    setText('box', 'plain'); assert.equal(store.box.textContent, 'plain');
    setVal('box', 'val'); assert.equal(store.box.value, 'val');
    show('box', false); assert.equal(store.box.style.display, 'none');
    show('box', true); assert.equal(store.box.style.display, '');
    on('box', 'click', () => {}); assert.equal(bound.ev, 'click');
    assert.equal($('box'), store.box);
  } finally {
    delete globalThis.document;
  }
});

test('gtag：window.gtag 不存在時安全 no-op，存在時透傳參數', () => {
  globalThis.window = {};
  try {
    assert.doesNotThrow(() => gtag('event', 'x'));
    let got = null;
    globalThis.window = { gtag: (...a) => { got = a; } };
    gtag('event', 'test', { v: 1 });
    assert.deepEqual(got, ['event', 'test', { v: 1 }]);
  } finally {
    delete globalThis.window;
  }
});
