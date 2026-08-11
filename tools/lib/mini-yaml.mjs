/**
 * 最小 YAML 子集解析器——只為讀 _data/books.yml 而存在。
 *
 * 為什麼不用 npm 套件：本 repo 的 `npm test` 免 npm install 是刻意保留的優勢
 * （AGENTS.md「便宜可靠，開發期的主要驗證手段」），不為讀一個資料檔破壞它。
 * 為什麼不改用 JSON：books.yml 的註解是給後續維護者的說明，JSON 放不下。
 *
 * 支援（books.yml 實際用到的全部語法）：
 *   - 整份文件為 mapping 的序列（`- key: value`）
 *   - 巢狀 mapping 序列（editions）
 *   - scalar：裸字串、單引號字串、整數、true/false/null
 *   - flow sequence：`[a, b, c]`
 *   - 整行註解（`#` 開頭）與空行
 * 不支援（用到就丟錯，不默默解錯）：區塊字串（| >）、雙引號轉義、錨點、行尾註解、多份文件。
 */

const parseScalar = (raw) => {
  const s = raw.trim();
  if (s === '') return '';
  if (s === 'null' || s === '~') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s.startsWith("'") && s.endsWith("'") && s.length >= 2) return s.slice(1, -1).replace(/''/g, "'");
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    return inner === '' ? [] : inner.split(',').map((x) => parseScalar(x));
  }
  if (/^-?\d+$/.test(s)) return Number(s);
  if (s.startsWith('|') || s.startsWith('>')) throw new Error(`mini-yaml 不支援區塊字串：${s}`);
  if (s.startsWith('"')) throw new Error(`mini-yaml 不支援雙引號字串：${s}`);
  if (s.startsWith('&') || s.startsWith('*')) throw new Error(`mini-yaml 不支援錨點：${s}`);
  return s;
};

/** 把 `key: value` 拆成 [key, valueRaw]；URL 的 `://` 不會被誤切，因為只認 `: ` 與行尾 `:`。 */
const splitKey = (line) => {
  const m = /^([A-Za-z_][A-Za-z0-9_-]*)\s*:(?:\s+(.*))?$/.exec(line);
  if (!m) throw new Error(`mini-yaml 無法解析這行：${line}`);
  return [m[1], m[2] === undefined ? '' : m[2]];
};

/**
 * 解析 mapping 序列。回傳物件陣列。
 * @param {string} text YAML 內容
 */
export function parseYamlSequence(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
    .map((l, i) => ({ n: i + 1, raw: l }))
    .filter(({ raw }) => raw.trim() !== '' && !/^\s*#/.test(raw));

  const items = [];
  let cur = null;          // 目前的頂層 mapping
  let curIndent = 0;       // 頂層 mapping 的鍵縮排
  let nestKey = null;      // 目前的巢狀序列鍵名（如 editions）
  let nestItem = null;     // 巢狀序列中目前的 mapping
  let nestIndent = 0;      // 巢狀 mapping 的鍵縮排

  for (const { n, raw } of lines) {
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();
    try {
      if (indent === 0 && line.startsWith('- ')) {           // 新的頂層項目
        cur = {}; items.push(cur); nestKey = null; nestItem = null;
        const [k, v] = splitKey(line.slice(2));
        curIndent = 2;
        cur[k] = parseScalar(v);
        continue;
      }
      if (cur === null) throw new Error('頂層必須是 `- key: value` 序列');

      if (nestKey && line.startsWith('- ')) {                // 巢狀序列的新項目
        nestItem = {}; cur[nestKey].push(nestItem);
        nestIndent = indent + 2;
        const [k, v] = splitKey(line.slice(2));
        nestItem[k] = parseScalar(v);
        continue;
      }
      if (nestItem && indent === nestIndent) {               // 巢狀項目的後續鍵
        const [k, v] = splitKey(line);
        nestItem[k] = parseScalar(v);
        continue;
      }
      if (indent === curIndent) {                            // 頂層 mapping 的後續鍵
        nestItem = null;
        const [k, v] = splitKey(line);
        if (v === '') { nestKey = k; cur[k] = []; } else { nestKey = null; cur[k] = parseScalar(v); }
        continue;
      }
      throw new Error(`縮排不符預期（indent=${indent}）`);
    } catch (e) {
      throw new Error(`第 ${n} 行：${e.message}\n  ${raw}`);
    }
  }
  return items;
}
