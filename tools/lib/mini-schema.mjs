/**
 * 最小 JSON Schema 驗證器——只支援 schema/*.schema.json 實際用到的關鍵字。
 *
 * 為什麼不用 ajv：本 repo 的 `npm test` 免 npm install 是刻意保留的優勢
 * （AGENTS.md），不為驗一個資料檔引入相依樹。
 *
 * 支援：type（含 ["integer","null"] 形式）、required、enum、pattern、properties、
 *       additionalProperties、items、minItems、minimum、maximum、$ref（僅 #/$defs/x）。
 * 不支援的關鍵字一律**丟錯**，不默默略過——免得寫了規則卻沒在驗。
 */

const KNOWN = new Set([
  '$schema', '$id', '$defs', '$ref', 'title', 'description',
  'type', 'required', 'enum', 'pattern', 'properties', 'additionalProperties',
  'items', 'minItems', 'minimum', 'maximum',
]);

const typeOf = (v) => {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return typeof v; // string | boolean | object
};

const typeMatches = (actual, want) => actual === want
  || (want === 'number' && actual === 'integer'); // integer 也是合法的 number

/**
 * @param {object} schema JSON Schema
 * @param {unknown} value 待驗值
 * @param {object} opts { root: 整份 schema（解 $ref 用）, path: 錯誤訊息用的路徑 }
 * @returns {string[]} 錯誤訊息陣列（空＝通過）
 */
export function validate(schema, value, opts = {}) {
  const root = opts.root || schema;
  const path = opts.path || '$';
  const errs = [];

  for (const k of Object.keys(schema)) {
    if (!KNOWN.has(k)) throw new Error(`mini-schema 不支援關鍵字 "${k}"（${path}）——請擴充驗證器，別讓規則失效`);
  }

  if (schema.$ref) {
    const m = /^#\/\$defs\/(.+)$/.exec(schema.$ref);
    if (!m) throw new Error(`mini-schema 只支援 #/$defs/x 形式的 $ref，收到 ${schema.$ref}`);
    const target = (root.$defs || {})[m[1]];
    if (!target) throw new Error(`$ref 找不到目標：${schema.$ref}`);
    return validate(target, value, { root, path });
  }

  const actual = typeOf(value);

  if (schema.type !== undefined) {
    const wants = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!wants.some((w) => typeMatches(actual, w))) {
      errs.push(`${path}: 型別應為 ${wants.join('|')}，實際 ${actual}`);
      return errs; // 型別就錯了，後續檢查沒意義
    }
  }

  if (schema.enum !== undefined && !schema.enum.includes(value)) {
    errs.push(`${path}: 值 ${JSON.stringify(value)} 不在允許清單 ${JSON.stringify(schema.enum)}`);
  }

  if (actual === 'string') {
    if (schema.pattern !== undefined && !new RegExp(schema.pattern, 'u').test(value)) {
      errs.push(`${path}: "${value.length > 40 ? `${value.slice(0, 40)}…` : value}" 不符 pattern ${schema.pattern}`);
    }
  }

  if (actual === 'integer' || actual === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) errs.push(`${path}: ${value} 小於最小值 ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errs.push(`${path}: ${value} 大於最大值 ${schema.maximum}`);
  }

  if (actual === 'array') {
    if (schema.minItems !== undefined && value.length < schema.minItems) errs.push(`${path}: 陣列長度 ${value.length} 少於 ${schema.minItems}`);
    if (schema.items) value.forEach((v, i) => errs.push(...validate(schema.items, v, { root, path: `${path}[${i}]` })));
  }

  if (actual === 'object') {
    for (const key of schema.required || []) {
      if (!(key in value)) errs.push(`${path}: 缺必填欄位 "${key}"`);
    }
    const props = schema.properties || {};
    for (const [key, v] of Object.entries(value)) {
      if (props[key]) errs.push(...validate(props[key], v, { root, path: `${path}.${key}` }));
      else if (schema.additionalProperties === false) errs.push(`${path}: 出現未定義欄位 "${key}"`);
    }
  }

  return errs;
}
