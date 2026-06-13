// hd-cities.js — 出生地城市庫
// 人類圖計算使用地心位置，經緯度不影響結果——出生地的唯一作用是決定時區，
// 因此每筆只存 { zh, en, aliases, tz, group }。
// 台灣縣市含改制前舊名（臺北縣→新北市等），方便長輩出生資料查詢。

export const CITIES = [
  // ---- 台灣（22 縣市，皆 Asia/Taipei）----
  { zh: '台北市', en: 'Taipei', aliases: ['臺北市'], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '新北市', en: 'New Taipei', aliases: ['臺北縣', '台北縣'], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '桃園市', en: 'Taoyuan', aliases: ['桃園縣'], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '台中市', en: 'Taichung', aliases: ['臺中市', '臺中縣', '台中縣'], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '台南市', en: 'Tainan', aliases: ['臺南市', '臺南縣', '台南縣'], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '高雄市', en: 'Kaohsiung', aliases: ['高雄縣'], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '基隆市', en: 'Keelung', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '新竹市', en: 'Hsinchu City', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '新竹縣', en: 'Hsinchu County', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '苗栗縣', en: 'Miaoli', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '彰化縣', en: 'Changhua', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '南投縣', en: 'Nantou', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '雲林縣', en: 'Yunlin', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '嘉義市', en: 'Chiayi City', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '嘉義縣', en: 'Chiayi County', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '屏東縣', en: 'Pingtung', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '宜蘭縣', en: 'Yilan', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '花蓮縣', en: 'Hualien', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '台東縣', en: 'Taitung', aliases: ['臺東縣'], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '澎湖縣', en: 'Penghu', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '金門縣', en: 'Kinmen', aliases: [], tz: 'Asia/Taipei', group: '台灣' },
  { zh: '連江縣', en: 'Lienchiang (Matsu)', aliases: ['馬祖'], tz: 'Asia/Taipei', group: '台灣' },
  // ---- 亞洲 ----
  { zh: '香港', en: 'Hong Kong', aliases: [], tz: 'Asia/Hong_Kong', group: '亞洲' },
  { zh: '澳門', en: 'Macau', aliases: [], tz: 'Asia/Macau', group: '亞洲' },
  { zh: '北京', en: 'Beijing', aliases: [], tz: 'Asia/Shanghai', group: '亞洲' },
  { zh: '上海', en: 'Shanghai', aliases: [], tz: 'Asia/Shanghai', group: '亞洲' },
  { zh: '廣州', en: 'Guangzhou', aliases: [], tz: 'Asia/Shanghai', group: '亞洲' },
  { zh: '深圳', en: 'Shenzhen', aliases: [], tz: 'Asia/Shanghai', group: '亞洲' },
  { zh: '成都', en: 'Chengdu', aliases: [], tz: 'Asia/Shanghai', group: '亞洲' },
  { zh: '東京', en: 'Tokyo', aliases: [], tz: 'Asia/Tokyo', group: '亞洲' },
  { zh: '大阪', en: 'Osaka', aliases: [], tz: 'Asia/Tokyo', group: '亞洲' },
  { zh: '首爾', en: 'Seoul', aliases: ['漢城'], tz: 'Asia/Seoul', group: '亞洲' },
  { zh: '新加坡', en: 'Singapore', aliases: [], tz: 'Asia/Singapore', group: '亞洲' },
  { zh: '吉隆坡', en: 'Kuala Lumpur', aliases: [], tz: 'Asia/Kuala_Lumpur', group: '亞洲' },
  { zh: '曼谷', en: 'Bangkok', aliases: [], tz: 'Asia/Bangkok', group: '亞洲' },
  { zh: '河內', en: 'Hanoi', aliases: [], tz: 'Asia/Ho_Chi_Minh', group: '亞洲' },
  { zh: '胡志明市', en: 'Ho Chi Minh City', aliases: ['西貢'], tz: 'Asia/Ho_Chi_Minh', group: '亞洲' },
  { zh: '馬尼拉', en: 'Manila', aliases: [], tz: 'Asia/Manila', group: '亞洲' },
  { zh: '雅加達', en: 'Jakarta', aliases: [], tz: 'Asia/Jakarta', group: '亞洲' },
  { zh: '新德里', en: 'New Delhi', aliases: [], tz: 'Asia/Kolkata', group: '亞洲' },
  { zh: '孟買', en: 'Mumbai', aliases: [], tz: 'Asia/Kolkata', group: '亞洲' },
  { zh: '杜拜', en: 'Dubai', aliases: [], tz: 'Asia/Dubai', group: '亞洲' },
  // ---- 美洲 ----
  { zh: '紐約', en: 'New York', aliases: [], tz: 'America/New_York', group: '美洲' },
  { zh: '波士頓', en: 'Boston', aliases: [], tz: 'America/New_York', group: '美洲' },
  { zh: '華盛頓特區', en: 'Washington D.C.', aliases: [], tz: 'America/New_York', group: '美洲' },
  { zh: '邁阿密', en: 'Miami', aliases: [], tz: 'America/New_York', group: '美洲' },
  { zh: '芝加哥', en: 'Chicago', aliases: [], tz: 'America/Chicago', group: '美洲' },
  { zh: '達拉斯', en: 'Dallas', aliases: [], tz: 'America/Chicago', group: '美洲' },
  { zh: '休士頓', en: 'Houston', aliases: [], tz: 'America/Chicago', group: '美洲' },
  { zh: '丹佛', en: 'Denver', aliases: [], tz: 'America/Denver', group: '美洲' },
  { zh: '鳳凰城', en: 'Phoenix', aliases: [], tz: 'America/Phoenix', group: '美洲' },
  { zh: '洛杉磯', en: 'Los Angeles', aliases: [], tz: 'America/Los_Angeles', group: '美洲' },
  { zh: '舊金山', en: 'San Francisco', aliases: ['三藩市'], tz: 'America/Los_Angeles', group: '美洲' },
  { zh: '西雅圖', en: 'Seattle', aliases: [], tz: 'America/Los_Angeles', group: '美洲' },
  { zh: '聖地牙哥', en: 'San Diego', aliases: [], tz: 'America/Los_Angeles', group: '美洲' },
  { zh: '安克拉治', en: 'Anchorage', aliases: [], tz: 'America/Anchorage', group: '美洲' },
  { zh: '檀香山', en: 'Honolulu', aliases: ['夏威夷'], tz: 'Pacific/Honolulu', group: '美洲' },
  { zh: '溫哥華', en: 'Vancouver', aliases: [], tz: 'America/Vancouver', group: '美洲' },
  { zh: '多倫多', en: 'Toronto', aliases: [], tz: 'America/Toronto', group: '美洲' },
  { zh: '墨西哥城', en: 'Mexico City', aliases: [], tz: 'America/Mexico_City', group: '美洲' },
  { zh: '聖保羅', en: 'Sao Paulo', aliases: [], tz: 'America/Sao_Paulo', group: '美洲' },
  { zh: '布宜諾斯艾利斯', en: 'Buenos Aires', aliases: [], tz: 'America/Argentina/Buenos_Aires', group: '美洲' },
  // ---- 歐洲 ----
  { zh: '倫敦', en: 'London', aliases: [], tz: 'Europe/London', group: '歐洲' },
  { zh: '巴黎', en: 'Paris', aliases: [], tz: 'Europe/Paris', group: '歐洲' },
  { zh: '柏林', en: 'Berlin', aliases: [], tz: 'Europe/Berlin', group: '歐洲' },
  { zh: '慕尼黑', en: 'Munich', aliases: [], tz: 'Europe/Berlin', group: '歐洲' },
  { zh: '法蘭克福', en: 'Frankfurt', aliases: [], tz: 'Europe/Berlin', group: '歐洲' },
  { zh: '阿姆斯特丹', en: 'Amsterdam', aliases: [], tz: 'Europe/Amsterdam', group: '歐洲' },
  { zh: '布魯塞爾', en: 'Brussels', aliases: [], tz: 'Europe/Brussels', group: '歐洲' },
  { zh: '蘇黎世', en: 'Zurich', aliases: [], tz: 'Europe/Zurich', group: '歐洲' },
  { zh: '維也納', en: 'Vienna', aliases: [], tz: 'Europe/Vienna', group: '歐洲' },
  { zh: '羅馬', en: 'Rome', aliases: [], tz: 'Europe/Rome', group: '歐洲' },
  { zh: '米蘭', en: 'Milan', aliases: [], tz: 'Europe/Rome', group: '歐洲' },
  { zh: '馬德里', en: 'Madrid', aliases: [], tz: 'Europe/Madrid', group: '歐洲' },
  { zh: '巴塞隆納', en: 'Barcelona', aliases: [], tz: 'Europe/Madrid', group: '歐洲' },
  { zh: '里斯本', en: 'Lisbon', aliases: [], tz: 'Europe/Lisbon', group: '歐洲' },
  { zh: '都柏林', en: 'Dublin', aliases: [], tz: 'Europe/Dublin', group: '歐洲' },
  { zh: '斯德哥爾摩', en: 'Stockholm', aliases: [], tz: 'Europe/Stockholm', group: '歐洲' },
  { zh: '哥本哈根', en: 'Copenhagen', aliases: [], tz: 'Europe/Copenhagen', group: '歐洲' },
  { zh: '奧斯陸', en: 'Oslo', aliases: [], tz: 'Europe/Oslo', group: '歐洲' },
  { zh: '赫爾辛基', en: 'Helsinki', aliases: [], tz: 'Europe/Helsinki', group: '歐洲' },
  { zh: '華沙', en: 'Warsaw', aliases: [], tz: 'Europe/Warsaw', group: '歐洲' },
  { zh: '布拉格', en: 'Prague', aliases: [], tz: 'Europe/Prague', group: '歐洲' },
  { zh: '雅典', en: 'Athens', aliases: [], tz: 'Europe/Athens', group: '歐洲' },
  { zh: '伊斯坦堡', en: 'Istanbul', aliases: [], tz: 'Europe/Istanbul', group: '歐洲' },
  { zh: '莫斯科', en: 'Moscow', aliases: [], tz: 'Europe/Moscow', group: '歐洲' },
  // ---- 大洋洲 ----
  { zh: '雪梨', en: 'Sydney', aliases: ['悉尼'], tz: 'Australia/Sydney', group: '大洋洲' },
  { zh: '墨爾本', en: 'Melbourne', aliases: [], tz: 'Australia/Melbourne', group: '大洋洲' },
  { zh: '布里斯本', en: 'Brisbane', aliases: [], tz: 'Australia/Brisbane', group: '大洋洲' },
  { zh: '伯斯', en: 'Perth', aliases: [], tz: 'Australia/Perth', group: '大洋洲' },
  { zh: '奧克蘭', en: 'Auckland', aliases: [], tz: 'Pacific/Auckland', group: '大洋洲' },
  // ---- 中東與非洲 ----
  { zh: '特拉維夫', en: 'Tel Aviv', aliases: [], tz: 'Asia/Jerusalem', group: '中東與非洲' },
  { zh: '開羅', en: 'Cairo', aliases: [], tz: 'Africa/Cairo', group: '中東與非洲' },
  { zh: '約翰尼斯堡', en: 'Johannesburg', aliases: [], tz: 'Africa/Johannesburg', group: '中東與非洲' },
  { zh: '奈洛比', en: 'Nairobi', aliases: [], tz: 'Africa/Nairobi', group: '中東與非洲' },
];

// 搜尋：正規化（臺→台、去空白、轉小寫）後做子字串比對，台灣群組優先
function normalize(s) {
  return s.toLowerCase().replace(/臺/g, '台').replace(/\s+/g, '');
}

export function searchCities(query, limit = 12) {
  const q = normalize(query);
  if (!q) return [];
  const hits = CITIES.filter((c) =>
    normalize(c.zh).includes(q) ||
    normalize(c.en).includes(q) ||
    c.aliases.some((a) => normalize(a).includes(q)));
  hits.sort((a, b) => (a.group === '台灣' ? 0 : 1) - (b.group === '台灣' ? 0 : 1));
  return hits.slice(0, limit);
}
