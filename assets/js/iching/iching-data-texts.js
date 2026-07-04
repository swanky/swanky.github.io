// iching-data-texts.js — 六十四卦四段解讀（結構化生成：象徵／處境連結／反思問題／一週行動）。
//
// beta 策略（誠實）：v1 以「卦義(oneLine) ＋ 上下卦意象 ＋ 變爻/之卦」結構化生成四段，
// 覆蓋全 64 卦、語氣中性賦能；384 爻辭逐爻深度解讀與逐卦手寫深稿為後續（付費／增量）。
// 寫作守則沿用塔羅七守則：不神準、不斷吉凶、不恐嚇、不宿命；聚焦「把問題換個角度看」。

// 八經卦意象（處境連結用）
export const TRIGRAM_IMAGE = {
  乾: '剛健、主動、開創', 坤: '包容、承載、順應', 震: '震動、行動、起念',
  巽: '順入、滲透、溝通', 坎: '險阻、流動、內斂', 離: '光明、表現、依附',
  艮: '安止、穩定、界線', 兌: '喜悅、交流、和悅',
};

// 由「宜…」卦義萃取行動關鍵字
function actionSeed(oneLine) {
  const m = oneLine.match(/宜([^，。]+)/);
  return m ? m[1] : '順著這一卦的方向，先做好眼前該做的事';
}

// 之卦一句「變化方向」
function changeLine(hex, zhi, movingCount) {
  if (!zhi || movingCount === 0) return '';
  if (movingCount === 1) {
    return `有一個動爻，代表事情正從「${hex.name}」朝「${zhi.name}」的方向鬆動——${zhi.oneLine}`;
  }
  return `有多個動爻，本卦「${hex.name}」是你當下的處境，之卦「${zhi.name}」是它正走去的趨向：${zhi.oneLine}`;
}

// 生成四段解讀。cast = { ben, zhi, moving, method }
export function buildReading(cast) {
  const hex = cast.ben;
  const up = TRIGRAM_IMAGE[hex.upperName] || '';
  const low = TRIGRAM_IMAGE[hex.lowerName] || '';
  const mc = cast.moving ? cast.moving.length : 0;

  const symbol = `${hex.name}卦（${hex.symbol}）：${hex.oneLine}`;

  const situation = `這一卦上為${hex.upperName}（${up}）、下為${hex.lowerName}（${low}）。`
    + `外在偏向「${up.split('、')[0]}」的態勢，內在根基偏向「${low.split('、')[0]}」。`
    + `對照你問的處境，這組上下關係，或許正說出你此刻「外面在發生什麼、裡面靠什麼支撐」。`;

  const reflect = [
    `${hex.name}提醒的方向，對照你現在的狀況，哪一點最有共鳴？`,
    mc > 0
      ? '事情看起來正在變動——這個變化是你想要的，還是你需要因應的？'
      : '目前這個處境相對穩定，你希望維持它，還是想推動改變？',
    '如果順著這一卦，你這一週最想先釐清或改變的一件事是什麼？',
  ];

  const change = changeLine(hex, cast.zhi, mc);

  const action = `這一週，可以試著「${actionSeed(hex.oneLine)}」。`
    + '不必一次到位，先選一個具體、今天就能開始的小動作，讓卦義落到行動上。'
    + (change ? '　也留意上面說的變化方向，順勢而非硬抗。' : '');

  return { symbol, situation, reflect, action, change };
}
