/**
 * 奇門遁甲示意盤資料（教學展示用，非真實起局）。
 *
 * ⚠ 這是為了說明「九宮／八門／九星／八神」怎麼讀而編排的示意盤，
 *    不代表任何真實時間的排盤結果。正式排盤演算法開發中（見規劃 §6.5 spike）。
 *
 * gridData shape（每宮）：
 *   { palace, direction, men, star, shen, gan:[], tone:'auspicious'|'caution'|'neutral', note }
 *   中宮：{ palace:'中', center:true, summary }
 *
 * 方位排列採傳統盤面「上南下北」：離(南)在上、坎(北)在下，與現代地圖相反（method-note 會說明）。
 * palaces 陣列即 3×3 顯示順序（由左到右、由上到下）。
 */
export const QIMEN_DEMO = {
  question: '示意問題：這個提案，適合用什麼時機與方向推進？',
  palaces: [
    // 上排：東南 — 南 — 西南
    { palace: '巽', direction: '東南', men: '杜門', star: '天輔', shen: '玄武', gan: ['壬'], tone: 'neutral',
      note: '隱藏、專注、防洩密的位置。適合埋頭把事情做深，暫時不宜張揚。' },
    { palace: '離', direction: '南', men: '景門', star: '天英', shen: '九天', gan: ['丙'], tone: 'auspicious',
      note: '展示、發表、對外溝通的窗口。適合把成果亮出來、做行銷與簡報。' },
    { palace: '坤', direction: '西南', men: '死門', star: '天芮', shen: '九地', gan: ['乙', '癸'], tone: 'caution',
      note: '舊事收尾、盤點與整理的位置。適合結案，不適合此時開新局。' },
    // 中排：東 — 中 — 西
    { palace: '震', direction: '東', men: '傷門', star: '天沖', shen: '六合', gan: ['辛'], tone: 'caution',
      note: '容易衝動、起爭執的位置。行動前先緩一步，確認自己的動機。' },
    { palace: '中', center: true, summary: '示意問題：這個提案，適合用什麼時機與方向推進？' },
    { palace: '兌', direction: '西', men: '驚門', star: '天柱', shen: '白虎', gan: ['庚'], tone: 'caution',
      note: '口舌、談判、變動的位置。溝通需謹慎，把話與條件講清楚。' },
    // 下排：東北 — 北 — 西北
    { palace: '艮', direction: '東北', men: '生門', star: '天任', shen: '太陰', gan: ['己'], tone: 'auspicious',
      note: '生機、求財、開始新事的位置。適合啟動與布局，慢慢累積。' },
    { palace: '坎', direction: '北', men: '休門', star: '天蓬', shen: '螣蛇', gan: ['丁'], tone: 'neutral',
      note: '休整、沉澱、蓄力的位置。適合思考與調整，不急於立刻出手。' },
    { palace: '乾', direction: '西北', men: '開門', star: '天心', shen: '值符', gan: ['戊'], tone: 'auspicious',
      note: '開創、決策、尋求貴人的位置。適合做重要決定、談合作與資源。' },
  ],
};
