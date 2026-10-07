import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const hash = p => createHash('sha256').update(readFileSync(join(root, p))).digest('hex');
const read = p => JSON.parse(readFileSync(join(root, p), 'utf8'));
const expected = [
  {
    "data": "li_pinger_before_the_rain",
    "count": 34,
    "data_sha256": "5dc5b3ed5bd7af4f7259e03bfe9c79c64457723461fa744a28a2e517442b4f41",
    "pdf_sha256": "4fa7cd91bbcb87c5fac72449e970fa1da092d3d03c5b906658b2202b04a95bfb"
  },
  {
    "data": "pan_jinlian_daylight_on_loan",
    "count": 36,
    "data_sha256": "23dd0163d039b41fddbfe05874ccd43f706a76464fbb33a56b689ad79b338844",
    "pdf_sha256": "e5e6157797f1fca5cd1aa964d88f024887461faf8628e44a7ba1b846cdb7a1d5"
  },
  {
    "data": "nft_small_freedoms",
    "count": 35,
    "data_sha256": "0f3464dd7eaf779d2b09c7a28b21b99fb65b6c652cb80f1d6f2306fc5e1d4df1",
    "pdf_sha256": "5d7c45ec1d785496fc142f0205920d9a4b7ef0667d3f32cf98bfa4922fdfcb58"
  },
  {
    "data": "pan_jinlian_one_more_turn",
    "count": 35,
    "data_sha256": "3d63a2e470d18f9d480ef32b48e90aad8e7bd6aed64a75c47c4d35cec119aafe",
    "pdf_sha256": "07e733d9b5757af1d9bdbcfa8c868f57d8cdd44af08258ef77c92d19d55a4c54"
  },
  {
    "data": "meebit_city_out_of_fit",
    "count": 36,
    "data_sha256": "a90a8905312b7d7c1cb3de1ea0149f2b2b1d47564785db4c21081b41b3108d1b",
    "pdf_sha256": "917c76db2326e5bce3644700289a3f245e9cc6dc211bf87d137c1c685ceef268"
  },
  {
    "data": "li_pinger_above_the_waterline",
    "count": 36,
    "data_sha256": "e9c62aef4b45a9a9e9b4eb3f3d1090fc227088d0bc7ac908a3ac92f639970f91",
    "pdf_sha256": "bb0e266f0f9f3838664adc23c04813469881c861634bb305323ef60cb3e9ccb0"
  },
  {
    "data": "pan_jinlian_unwritten_stage",
    "count": 36,
    "data_sha256": "ffef16ac4ae6b38441a7ceb92c518c6836f6bed14faf49f5a02d592b838ec838",
    "pdf_sha256": "c2dd39c01e50d5c5e166f62f975f096e74a31abcd90c9ffa50d66ff6cdcf2d08"
  },
  {
    "data": "nft_quiet_machines",
    "count": 36,
    "data_sha256": "3ff282afb5d04bd0194fca9d8fd9d70e7dff0ded33db19712aff8a9ff2c4a226",
    "pdf_sha256": "d806db74919e868499f2d9538f9c8d2da34af76e92d964413a8ff7d8644135ca"
  },
  {
    "data": "li_pinger_shore_without_a_name",
    "count": 36,
    "data_sha256": "3bc39f66bc3b040f72041198db0f40c1c1726e68dc19a38a823e88ce721cf5fa",
    "pdf_sha256": "a80eeb6d7c3cb06ba1985e4ab7a772a203d7ccde8710daca7042976aaf9431dc"
  }
];
const routes = read('_data/photography_books_2026_10.json');
const downloads = read('_data/photography_downloads.json');
test('October nine books preserve approved data, original PDFs and exactly 320 frames in chapter order', () => {
  let total = 0, extended = 0;
  for (const e of expected) {
    const path = `_data/${e.data}.json`, b = read(path);
    assert.equal(hash(path), e.data_sha256, `Changed approved copy: ${path}`);
    assert.equal(hash(b.pdf), e.pdf_sha256, `Changed original PDF: ${b.title}`);
    assert.equal(b.count, e.count);
    const sequence = Array.from({length:e.count}, (_, i) => i + 1);
    assert.deepEqual(b.photos.map(p => p.order), sequence);
    assert.deepEqual(b.chapters.flatMap(c => c.frames), sequence);
    for (const c of b.chapters) assert.deepEqual(b.photos.filter(p => p.chapter === c.title).map(p => p.order), c.frames);
    for (const p of b.photos) {
      assert.ok(existsSync(join(root, p.image)) && existsSync(join(root, p.preview)));
      assert.ok(p.width > 0 && p.height > 0);
      assert.ok(p.alt.includes('AI'));
      assert.match(p.flickr_url, new RegExp(`/photos/[^/]+/${p.flickr_id}/$`));
    }
    assert.match(b.disclosure, /AI/);
    assert.equal(b.flickr_total_count, b.count + b.flickr_extended_count);
    total += b.count; extended += b.flickr_extended_count;
  }
  assert.equal(total,320); assert.equal(extended,178);
});
test('All nine books have distinct published routes and unchanged original download destinations', () => {
  assert.equal(new Set(routes.map(r => r.url)).size,9);
  assert.deepEqual(routes.map(r => r.data).sort(),expected.map(r => r.data).sort());
  for (const r of routes) {
    const b = read(`_data/${r.data}.json`);
    assert.ok(downloads[b.pdf].endsWith(b.pdf.split('/').at(-1)));
    assert.match(downloads[b.pdf], /^https:\/\/github.com\/swanky\/swanky.github.io\/releases\/download\/photobooks-2026-10-07\//);
  }
});
