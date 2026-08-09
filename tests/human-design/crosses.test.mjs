import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getIncarnationCross, INCARNATION_CROSS_COUNT } from '../../assets/js/human-design/hd-data-crosses.js';

test('輪迴交叉名稱涵蓋 64 閘門 × 3 種角度', () => {
  assert.equal(INCARNATION_CROSS_COUNT, 192);
  const ids = new Set();
  for (const angle of ['right', 'left', 'juxtaposition']) {
    for (let gate = 1; gate <= 64; gate++) {
      const cross = getIncarnationCross(gate, angle);
      assert.ok(cross, `${angle} gate ${gate}`);
      assert.match(cross.nameZh, /交叉之/);
      assert.match(cross.nameEn, /^The /);
      ids.add(cross.id);
    }
  }
  assert.equal(ids.size, 192);
});

test('代表性交叉名稱與變體正確', () => {
  assert.equal(getIncarnationCross(15, 'left').nameZh, '左角度交叉之預防');
  assert.equal(getIncarnationCross(10, 'left').nameZh, '左角度交叉之預防（2）');
  assert.equal(getIncarnationCross(13, 'right').nameZh, '右角度交叉之人面獅身');
  assert.equal(getIncarnationCross(1, 'juxtaposition').nameZh, '並列交叉之自我表達');
  assert.equal(getIncarnationCross(0, 'right'), null);
});
