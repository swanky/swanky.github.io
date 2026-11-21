"""紫微斗數 golden 參考實作（獨立重算，不使用 iztro，也不讀本站任何程式碼）。

用途：產生 tests/ziwei/fixtures-golden.mjs，並供大量隨機比對（--random N）。
農曆換算：sxtwl（壽星天文曆，許劍偉演算法）；iztro 用的是 lunar-lite 系，兩者不同源。

採用的通行排法（本站頁面宣稱「《紫微斗數全書》通行排法」，以下各條在跑 iztro 之前先定案）：
  1. 年：以春節（正月初一）分年，取農曆年干支。
  2. 時辰：23:00–23:59 晚子時、00:00–00:59 早子時，其餘每兩小時一辰（丑＝01–02…亥＝21–22）。
  3. 晚子時：整個農曆日期一律算「隔天」（含跨月、跨年），以隔天的農曆年月日安星。
  4. 閏月：閏月 1–15 日算本月、16 日以後算下個月（常見「閏月下半月作下月」）。
  5. 生年四化：甲廉破武陽、乙機梁紫陰、丙同機昌廉、丁陰同機巨、戊貪陰右機、
     己武貪梁曲、庚陽武陰同、辛巨陽曲昌、壬梁紫左武、癸破巨陰貪（庚、壬、戊各派有異，見頁面說明）。

規則出處（皆為公版古籍中的通行安星法；表格依口訣逐條轉寫，未參考任何程式碼）：
  - 安命身宮：「寅起正月順數至生月，逆數生時為命宮；順數生時為身宮」——《紫微斗數全書》〈安命身宮訣〉
  - 十二宮次序（自命宮逆行）：命、兄弟、夫妻、子女、財帛、疾厄、遷移、交友、官祿、田宅、福德、父母
  - 宮干：五虎遁「甲己之年丙作首、乙庚之歲戊為頭、丙辛歲首尋庚起、丁壬壬位順行流、戊癸甲寅好追求」
  - 五行局：命宮干支之納音（六十甲子納音，《三命通會》），水二、木三、金四、土五、火六
  - 安紫微：以生日除以局數；不整除則借數補足，商數自寅起順數，借數為奇數逆退、偶數順進
    ——《紫微斗數全書》〈起紫微星訣〉通行算法
  - 紫微系逆布：紫微、天機(-1)、空一宮、太陽(-3)、武曲(-4)、天同(-5)、空二宮、廉貞(-8)
  - 天府與紫微以寅申線對稱；天府系順布：天府、太陰、貪狼、巨門、天相、天梁、七殺、空三宮、破軍(+10)
  - 大限：起於命宮，起始歲數＝局數；陽男陰女順行、陰男陽女逆行，每宮十年
"""
import argparse
import json
import random
import sys
from datetime import date, timedelta

import sxtwl

STEMS = '甲乙丙丁戊己庚辛壬癸'
BRANCHES = '子丑寅卯辰巳午未申酉戌亥'
PALACE_NAMES = ['命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄', '遷移', '交友', '官祿', '田宅', '福德', '父母']
# 六十甲子納音五行（每兩組一個納音，依甲子、丙寅…順序）：海中金、爐中火、大林木、路旁土、劍鋒金、山頭火、
# 澗下水、城頭土、白蠟金、楊柳木、泉中水、屋上土、霹靂火、松柏木、長流水、沙中金、山下火、平地木、壁上土、
# 金箔金、覆燈火、天河水、大驛土、釵釧金、桑柘木、大溪水、沙中土、天上火、石榴木、大海水
NAYIN = '金火木土金火水土金木水土火木水金火木土金火水土金木水土火木水'
JU = {'水': 2, '木': 3, '金': 4, '土': 5, '火': 6}
JU_NAME = {2: '水二局', 3: '木三局', 4: '金四局', 5: '土五局', 6: '火六局'}
ZIWEI_SERIES = [('紫微', 0), ('天機', -1), ('太陽', -3), ('武曲', -4), ('天同', -5), ('廉貞', -8)]
TIANFU_SERIES = [('天府', 0), ('太陰', 1), ('貪狼', 2), ('巨門', 3), ('天相', 4), ('天梁', 5), ('七殺', 6), ('破軍', 10)]
MUTAGEN = {  # 祿、權、科、忌
    '甲': ['廉貞', '破軍', '武曲', '太陽'], '乙': ['天機', '天梁', '紫微', '太陰'],
    '丙': ['天同', '天機', '文昌', '廉貞'], '丁': ['太陰', '天同', '天機', '巨門'],
    '戊': ['貪狼', '太陰', '右弼', '天機'], '己': ['武曲', '貪狼', '天梁', '文曲'],
    '庚': ['太陽', '武曲', '太陰', '天同'], '辛': ['巨門', '太陽', '文曲', '文昌'],
    '壬': ['天梁', '紫微', '左輔', '武曲'], '癸': ['破軍', '巨門', '太陰', '貪狼'],
}


def hour_branch(h):
    """回傳 (時支 index 子=0, 是否晚子)。"""
    if h == 23:
        return 0, True
    return ((h + 1) // 2) % 12, False


def lunar_of(y, mo, d, h):
    late_zi = h == 23
    sd = date(y, mo, d) + (timedelta(days=1) if late_zi else timedelta(0))
    day = sxtwl.fromSolar(sd.year, sd.month, sd.day)
    return dict(year=day.getLunarYear(), month=day.getLunarMonth(), day=day.getLunarDay(), leap=bool(day.isLunarLeap()))


def chart(y, mo, d, h, gender):
    lun = lunar_of(y, mo, d, h)
    hb, _ = hour_branch(h)
    ys = (lun['year'] - 4) % 10
    yb = (lun['year'] - 4) % 12
    month = lun['month'] + (1 if lun['leap'] and lun['day'] > 15 else 0)
    month = (month - 1) % 12 + 1
    yin = 2  # 寅
    soul = (yin + (month - 1) - hb) % 12
    body = (yin + (month - 1) + hb) % 12
    # 五虎遁：寅宮天干
    yin_stem = ((ys % 5) * 2 + 2) % 10
    stem_of = lambda br: (yin_stem + (br - yin) % 12) % 10
    s, b = stem_of(soul), soul
    idx60 = (6 * s - 5 * b) % 60
    ju = JU[NAYIN[idx60 // 2]]
    # 安紫微
    day = lun['day']
    x = 0
    while (day + x) % ju:
        x += 1
    q = (day + x) // ju
    zw = (yin + q - 1 + (-x if x % 2 else x)) % 12
    tf = (4 - zw) % 12  # 寅申線對稱（子=0 編號下 紫微+天府 ≡ 4）：紫微在子→天府在辰、紫微在寅→天府同在寅
    major = {br: [] for br in range(12)}
    for name, off in ZIWEI_SERIES:
        major[(zw + off) % 12].append(name)
    for name, off in TIANFU_SERIES:
        major[(tf + off) % 12].append(name)
    # 宮名（自命宮逆行）
    names = {(soul - i) % 12: PALACE_NAMES[i] for i in range(12)}
    # 大限
    yang_year = ys % 2 == 0
    forward = (yang_year and gender == 'male') or (not yang_year and gender == 'female')
    decadal = {}
    for j in range(12):
        br = (soul + j) % 12 if forward else (soul - j) % 12
        decadal[br] = [ju + 10 * j, ju + 10 * j + 9]
    palaces = {
        BRANCHES[br]: dict(name=names[br], stem=STEMS[stem_of(br)], major=major[br], decadal=decadal[br])
        for br in range(12)
    }
    return dict(
        lunar=f"{lun['year']}-{lun['month']}-{lun['day']}{'閏' if lun['leap'] else ''}",
        yearGZ=STEMS[ys] + BRANCHES[yb],
        soulBranch=BRANCHES[soul], bodyBranch=BRANCHES[body],
        fiveElementsClass=JU_NAME[ju],
        mutagen=MUTAGEN[STEMS[ys]],
        palaces=palaces,
    )


# 精選案例：只用虛構時間與公開城市；時間以牆鐘時分輸入，測得到本站時辰換算的邊界。
CASES = [
    ('1990-06-15 14:30 女', 1990, 6, 15, 14, 30, 'female'),
    ('1975-03-08 01:00 男（丑時起點）', 1975, 3, 8, 1, 0, 'male'),
    ('1975-03-08 00:59 男（早子時終點）', 1975, 3, 8, 0, 59, 'male'),
    ('2001-09-21 22:59 女（亥時終點）', 2001, 9, 21, 22, 59, 'female'),
    ('2024-02-09 12:00 男（除夕，農曆癸卯年）', 2024, 2, 9, 12, 0, 'male'),
    ('2024-02-10 12:00 男（春節，農曆甲辰年）', 2024, 2, 10, 12, 0, 'male'),
    ('2024-02-05 08:00 女（立春後、春節前）', 2024, 2, 5, 8, 0, 'female'),
    ('2020-06-01 10:00 男（閏四月上半月）', 2020, 6, 1, 10, 0, 'male'),
    ('2020-06-10 10:00 女（閏四月下半月）', 2020, 6, 10, 10, 0, 'female'),
    ('2023-04-05 16:00 男（閏二月下半月）', 2023, 4, 5, 16, 0, 'male'),
    ('1960-12-31 06:00 男（庚子年）', 1960, 12, 31, 6, 0, 'male'),
    ('1972-07-07 18:20 女（壬子年）', 1972, 7, 7, 18, 20, 'female'),
    ('1988-11-07 03:30 女（戊辰年）', 1988, 11, 7, 3, 30, 'female'),
    ('1999-01-17 09:00 男（農曆初一）', 1999, 1, 17, 9, 0, 'male'),
    ('2010-05-13 20:45 女（農曆三十）', 2010, 5, 13, 20, 45, 'female'),
    ('1985-05-20 11:10 男', 1985, 5, 20, 11, 10, 'male'),
    ('1995-10-03 23:30 女（晚子時）', 1995, 10, 3, 23, 30, 'female'),
    ('2050-08-08 08:08 男（本世紀中）', 2050, 8, 8, 8, 8, 'male'),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--random', type=int, default=0, help='產生 N 筆隨機案例（1901–2099，含晚子時）')
    ap.add_argument('--seed', type=int, default=20261121)
    a = ap.parse_args()
    out = []
    if a.random:
        rnd = random.Random(a.seed)
        start, span = date(1901, 3, 1), (date(2099, 12, 31) - date(1901, 3, 1)).days
        for _ in range(a.random):
            dd = start + timedelta(days=rnd.randrange(span))
            h = rnd.randrange(24)
            g = rnd.choice(['male', 'female'])
            out.append(dict(input=dict(year=dd.year, month=dd.month, day=dd.day, hour=h, minute=rnd.randrange(60), gender=g),
                            expected=chart(dd.year, dd.month, dd.day, h, g)))
    else:
        for label, y, mo, d, h, mi, g in CASES:
            out.append(dict(label=label, input=dict(year=y, month=mo, day=d, hour=h, minute=mi, gender=g), expected=chart(y, mo, d, h, g)))
    json.dump(out, sys.stdout, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
