// sync-agent-skills.mjs — 把 .agents/skills/ 的共用正本鏡像到 .claude/skills/。
// 背景：docs/agents/cross-agent-sharing.md 決策「共用核心＋薄適配層」——skill 正本放
// .agents/skills/<name>/，.claude/skills/<name>/ 是給 Claude Code 用的可重跑鏡像，禁止
// 兩邊手動編輯（避免正本與鏡像分岔、知識悄悄流失）。
//
// 用法：
//   node tools/sync-agent-skills.mjs           重新產生鏡像（覆蓋既有、刪除鏡像中來源已不存在的檔案）
//   node tools/sync-agent-skills.mjs --check   只比對不寫入；有漂移 exit 1，否則印 OK 並 exit 0
//
// 行為：
//   - .claude/skills/ 底下沒有對應 .agents/skills/<name>/ 來源目錄的 skill 目錄，兩種模式都「不動、印警告」。
//   - 檔案比對採逐位元組（Buffer.equals），不做內容正規化。
import { readdirSync, statSync, mkdirSync, copyFileSync, unlinkSync, rmdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const SRC_ROOT = join(REPO_ROOT, '.agents', 'skills');
const DEST_ROOT = join(REPO_ROOT, '.claude', 'skills');

const CHECK = process.argv.includes('--check');

/** 列出目錄下所有一般檔案的相對路徑（遞迴，含子目錄），以 POSIX 分隔符回傳，排序過。 */
function listFilesRecursive(dir) {
  const out = [];
  function walk(current, prefix) {
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absPath = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(absPath, relPath);
      } else if (entry.isFile()) {
        out.push(relPath);
      }
    }
  }
  walk(dir, '');
  return out.sort();
}

function listSkillDirs(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function filesEqual(pathA, pathB) {
  if (!existsSync(pathA) || !existsSync(pathB)) return false;
  const bufA = readFileSync(pathA);
  const bufB = readFileSync(pathB);
  return Buffer.compare(bufA, bufB) === 0;
}

/** 遞迴刪除目錄下鏡像獨有（來源沒有）的檔案；並清掉因此變空的子目錄。 */
function pruneExtraneous(destDir, keepRelSet) {
  function walk(current, prefix) {
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absPath = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(absPath, relPath);
        // 目錄若因清空變空，順手移除
        try {
          if (readdirSync(absPath).length === 0) rmdirSync(absPath);
        } catch {
          /* 非空或已不存在，忽略 */
        }
      } else if (entry.isFile()) {
        if (!keepRelSet.has(relPath)) {
          unlinkSync(absPath);
        }
      }
    }
  }
  walk(destDir, '');
}

function runSync() {
  const srcSkills = listSkillDirs(SRC_ROOT);
  const destSkills = listSkillDirs(DEST_ROOT);
  const srcSkillSet = new Set(srcSkills);

  if (srcSkills.length === 0) {
    console.warn(`警告：找不到來源目錄 ${SRC_ROOT}，未執行任何鏡像。`);
  }

  for (const name of srcSkills) {
    const srcDir = join(SRC_ROOT, name);
    const destDir = join(DEST_ROOT, name);
    const relFiles = listFilesRecursive(srcDir);

    mkdirSync(destDir, { recursive: true });

    for (const rel of relFiles) {
      const srcFile = join(srcDir, rel);
      const destFile = join(destDir, rel);
      mkdirSync(dirname(destFile), { recursive: true });
      copyFileSync(srcFile, destFile);
    }

    pruneExtraneous(destDir, new Set(relFiles));
    console.log(`已同步：${name}（${relFiles.length} 個檔案）`);
  }

  for (const name of destSkills) {
    if (!srcSkillSet.has(name)) {
      console.warn(`警告：.claude/skills/${name}/ 沒有對應的 .agents/skills/${name}/ 來源，維持不動。`);
    }
  }

  return 0;
}

function runCheck() {
  const srcSkills = listSkillDirs(SRC_ROOT);
  const destSkills = listSkillDirs(DEST_ROOT);
  const srcSkillSet = new Set(srcSkills);

  const drift = []; // { skill, file, reason }

  for (const name of srcSkills) {
    const srcDir = join(SRC_ROOT, name);
    const destDir = join(DEST_ROOT, name);
    const srcFiles = listFilesRecursive(srcDir);
    const destFiles = new Set(listFilesRecursive(destDir));

    for (const rel of srcFiles) {
      const srcFile = join(srcDir, rel);
      const destFile = join(destDir, rel);
      if (!existsSync(destFile)) {
        drift.push({ skill: name, file: rel, reason: '鏡像缺漏' });
      } else if (!filesEqual(srcFile, destFile)) {
        drift.push({ skill: name, file: rel, reason: '內容漂移' });
      }
    }

    const srcFileSet = new Set(srcFiles);
    for (const rel of destFiles) {
      if (!srcFileSet.has(rel)) {
        drift.push({ skill: name, file: rel, reason: '鏡像多餘（來源已不存在）' });
      }
    }
  }

  for (const name of destSkills) {
    if (!srcSkillSet.has(name)) {
      console.warn(`警告：.claude/skills/${name}/ 沒有對應的 .agents/skills/${name}/ 來源，維持不動。`);
    }
  }

  if (drift.length > 0) {
    console.log(`發現 ${drift.length} 項漂移／缺漏：`);
    for (const d of drift) {
      console.log(`  [${d.skill}] ${d.file} — ${d.reason}`);
    }
    return 1;
  }

  console.log('OK：.claude/skills/ 與 .agents/skills/ 完全一致，無漂移。');
  return 0;
}

const exitCode = CHECK ? runCheck() : runSync();
process.exit(exitCode);
