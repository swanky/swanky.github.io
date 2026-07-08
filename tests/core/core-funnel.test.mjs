// core-funnel.test.mjs — 付費導流共用層的單元測試。
// 重點：CONTACT 格式、inquiryMailto 產生的 mailto href 可 decode 回原始中文 subject/body。
import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTACT, inquiryMailto } from '../../assets/js/core/core-funnel.js';

test('CONTACT 為預期的信箱字面值', () => {
  assert.equal(CONTACT, 'swanky.hsiao@gmail.com');
});

test('inquiryMailto：href 開頭為 mailto:CONTACT，subject/body 皆已 encodeURIComponent', () => {
  const href = inquiryMailto('主旨', '內文');
  assert.equal(href, `mailto:${CONTACT}?subject=${encodeURIComponent('主旨')}&body=${encodeURIComponent('內文')}`);
});

test('inquiryMailto：中文與多行內容 round-trip 回原字串', () => {
  const subject = '深度解卦：乾卦（之卦：坤卦）';
  const body = '嗨 史旺基，我的問題是：\n想要一份深度解卦（爻辭與行動建議）。';
  const href = inquiryMailto(subject, body);
  const m = /^mailto:([^?]+)\?subject=([^&]+)&body=(.+)$/.exec(href);
  assert.ok(m, 'href 應符合 mailto:CONTACT?subject=...&body=... 格式');
  assert.equal(m[1], CONTACT);
  assert.equal(decodeURIComponent(m[2]), subject);
  assert.equal(decodeURIComponent(m[3]), body);
});
