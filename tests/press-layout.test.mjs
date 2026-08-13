import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const press = readFileSync(fileURLToPath(new URL('../press/index.html', import.meta.url)), 'utf8');

test('媒體報導卡片限制長摘要行寬', () => {
  assert.match(press, /\.press-card p\s*{[^}]*max-width:\s*70ch;/);
});
