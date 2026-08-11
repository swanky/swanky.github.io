/**
 * 回目字串的拆解規則。
 *
 * 獨立成一支模組是為了讓測試能直接進來——tools/import_book_chapters.mjs 是 CLI，
 * 一 import 就會跑起來。
 */

/**
 * 回目 heading 拆成 label（第一回／楔子）與 couplet（對句）。
 *
 * 分隔符不只有空白：三國演義那份底本寫成「第一回：宴桃園豪傑三結義，斬黃巾英雄首立功」，
 * 只切空白會把整條回目當成 label、couplet 留空，回目列表就把同一句印兩次（曾是正式站 bug）。
 * 所以先認回數標籤（楔子／第…回），再吃掉緊接的分隔符，其餘為對句。
 * 認不出標籤時退回原本的「切第一個空白」規則。
 *
 * 底本的空白寬度不一致（西遊記那份有「第一回     靈根…」五個半形空白），
 * 這裡一併收斂成單一全形空白——顯示層的事，儲存層 content/ 不動。
 */
export function splitHeading(heading) {
  const h = heading.trim().replace(/[ \t　]+/g, '　');
  const m = /^(楔子|引子|卷首|凡例|第[〇零一二三四五六七八九十百千○\d]+[回卷折出章])/.exec(h);
  const i = m ? m[0].length : h.search(/　/);
  if (i === -1) return { label: h, couplet: '' };
  return { label: h.slice(0, i), couplet: h.slice(i).replace(/^[　：:，,、]+/, '') };
}

/** 回目的顯示用寫法：把底本不一致的空白寬度收斂，其餘原樣。 */
export const normalizeHeading = (heading) => heading.trim().replace(/[ \t　]+/g, '　');
