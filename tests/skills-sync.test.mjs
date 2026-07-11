// skills-sync：drift guard——確保 .claude/skills/ 鏡像沒有落後 .agents/skills/ 共用正本。
// 正本＝.agents/skills/<name>/SKILL.md（跨 agent 共用，Hermes/Codex 也讀）；
// .claude/skills/<name>/ 是給 Claude Code 用的可重跑鏡像，由 tools/sync-agent-skills.mjs 產生，
// 禁止手動編輯。若此測試失敗，代表有人只改了一邊——先跑
// `node tools/sync-agent-skills.mjs` 重新產生鏡像，再重新提交。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const SCRIPT = join(REPO_ROOT, 'tools', 'sync-agent-skills.mjs');

test('.claude/skills/ 鏡像與 .agents/skills/ 正本一致（無漂移）', () => {
  const result = spawnSync(process.execPath, [SCRIPT, '--check'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });

  const output = `${result.stdout || ''}${result.stderr || ''}`;
  assert.equal(
    result.status,
    0,
    `sync-agent-skills.mjs --check 失敗（exit ${result.status}）。輸出：\n${output}\n` +
      '請跑 `node tools/sync-agent-skills.mjs` 重新產生鏡像後再提交。',
  );
});
