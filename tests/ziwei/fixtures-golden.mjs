// fixtures-golden.mjs — 紫微斗數 golden 案例（獨立參考：自寫 Python 安星＋sxtwl 農曆）。
//
// 來源（2026-11-21）：tools/golden/ziwei_golden.py 依《紫微斗數全書》通行安星口訣另寫一套程式重算，
//   農曆用 sxtwl（壽星天文曆，許劍偉演算法）；本站用 iztro（農曆為 lunar-lite 系），兩者程式與曆法皆不同源。
//   版本見 tools/golden/requirements.txt。比對項目：農曆日期、命宮、身宮、五行局、十二宮宮名與宮干、
//   十四主星落宮、生年四化、大限歲數。輔星、煞星、雜曜、亮度、流年不在本檔範圍。
// 首次比對：本檔 18 筆全數一致；另以 --random 3000（1901–2099、含晚子時 97 筆、閏月 89 筆）大量比對，
//   2992 筆完全一致，8 筆差異全部可歸類，且第三套實作 fortel-ziweidoushu（中州派、自帶曆法）佐證：
//   - 5 筆：晚子時恰逢跨月／跨年或閏月下半月——參考版把晚子整個算隔天（含換月），iztro 只把日數加一、
//     月份沿用當天（fortel 在月份上與 iztro 相同）。屬流派細節，頁面規則說明已揭露。
//   - 3 筆：2057 年農曆九月初一的朔日落在子夜附近，sxtwl 與 iztro／fortel 的曆表差一天（曆法來源差異）。
//   另 fortel 與參考版的差異只在：晚子時不換日（中州派）、戊／庚／壬年四化（各派寫法不同），皆屬流派差異。
// ⚠ 不得手改 expected；要加案例就改 tools/golden/ziwei_golden.py 的 CASES 重跑。案例皆為虛構時間。
//
// input:    { year, month, day, hour, minute, gender }（牆鐘時分，經本站 timeIndexOf 換時辰）
// expected: { lunar, yearGZ, soulBranch, bodyBranch, fiveElementsClass, mutagen:[祿,權,科,忌],
//             palaces: { 地支: { name, stem, major:[主星], decadal:[起,迄] } } }
export const GOLDEN_ZIWEI = [
 {
  "label": "1990-06-15 14:30 女",
  "input": {
   "year": 1990,
   "month": 6,
   "day": 15,
   "hour": 14,
   "minute": 30,
   "gender": "female"
  },
  "expected": {
   "lunar": "1990-5-23",
   "yearGZ": "庚午",
   "soulBranch": "亥",
   "bodyBranch": "丑",
   "fiveElementsClass": "土五局",
   "mutagen": [
    "太陽",
    "武曲",
    "太陰",
    "天同"
   ],
   "palaces": {
    "子": {
     "name": "父母",
     "stem": "戊",
     "major": [
      "廉貞",
      "天相"
     ],
     "decadal": [
      115,
      124
     ]
    },
    "丑": {
     "name": "福德",
     "stem": "己",
     "major": [
      "天梁"
     ],
     "decadal": [
      105,
      114
     ]
    },
    "寅": {
     "name": "田宅",
     "stem": "戊",
     "major": [
      "七殺"
     ],
     "decadal": [
      95,
      104
     ]
    },
    "卯": {
     "name": "官祿",
     "stem": "己",
     "major": [
      "天同"
     ],
     "decadal": [
      85,
      94
     ]
    },
    "辰": {
     "name": "交友",
     "stem": "庚",
     "major": [
      "武曲"
     ],
     "decadal": [
      75,
      84
     ]
    },
    "巳": {
     "name": "遷移",
     "stem": "辛",
     "major": [
      "太陽"
     ],
     "decadal": [
      65,
      74
     ]
    },
    "午": {
     "name": "疾厄",
     "stem": "壬",
     "major": [
      "破軍"
     ],
     "decadal": [
      55,
      64
     ]
    },
    "未": {
     "name": "財帛",
     "stem": "癸",
     "major": [
      "天機"
     ],
     "decadal": [
      45,
      54
     ]
    },
    "申": {
     "name": "子女",
     "stem": "甲",
     "major": [
      "紫微",
      "天府"
     ],
     "decadal": [
      35,
      44
     ]
    },
    "酉": {
     "name": "夫妻",
     "stem": "乙",
     "major": [
      "太陰"
     ],
     "decadal": [
      25,
      34
     ]
    },
    "戌": {
     "name": "兄弟",
     "stem": "丙",
     "major": [
      "貪狼"
     ],
     "decadal": [
      15,
      24
     ]
    },
    "亥": {
     "name": "命宮",
     "stem": "丁",
     "major": [
      "巨門"
     ],
     "decadal": [
      5,
      14
     ]
    }
   }
  }
 },
 {
  "label": "1975-03-08 01:00 男（丑時起點）",
  "input": {
   "year": 1975,
   "month": 3,
   "day": 8,
   "hour": 1,
   "minute": 0,
   "gender": "male"
  },
  "expected": {
   "lunar": "1975-1-26",
   "yearGZ": "乙卯",
   "soulBranch": "丑",
   "bodyBranch": "卯",
   "fiveElementsClass": "火六局",
   "mutagen": [
    "天機",
    "天梁",
    "紫微",
    "太陰"
   ],
   "palaces": {
    "子": {
     "name": "兄弟",
     "stem": "戊",
     "major": [
      "七殺"
     ],
     "decadal": [
      16,
      25
     ]
    },
    "丑": {
     "name": "命宮",
     "stem": "己",
     "major": [],
     "decadal": [
      6,
      15
     ]
    },
    "寅": {
     "name": "父母",
     "stem": "戊",
     "major": [
      "廉貞"
     ],
     "decadal": [
      116,
      125
     ]
    },
    "卯": {
     "name": "福德",
     "stem": "己",
     "major": [],
     "decadal": [
      106,
      115
     ]
    },
    "辰": {
     "name": "田宅",
     "stem": "庚",
     "major": [
      "破軍"
     ],
     "decadal": [
      96,
      105
     ]
    },
    "巳": {
     "name": "官祿",
     "stem": "辛",
     "major": [
      "天同"
     ],
     "decadal": [
      86,
      95
     ]
    },
    "午": {
     "name": "交友",
     "stem": "壬",
     "major": [
      "武曲",
      "天府"
     ],
     "decadal": [
      76,
      85
     ]
    },
    "未": {
     "name": "遷移",
     "stem": "癸",
     "major": [
      "太陽",
      "太陰"
     ],
     "decadal": [
      66,
      75
     ]
    },
    "申": {
     "name": "疾厄",
     "stem": "甲",
     "major": [
      "貪狼"
     ],
     "decadal": [
      56,
      65
     ]
    },
    "酉": {
     "name": "財帛",
     "stem": "乙",
     "major": [
      "天機",
      "巨門"
     ],
     "decadal": [
      46,
      55
     ]
    },
    "戌": {
     "name": "子女",
     "stem": "丙",
     "major": [
      "紫微",
      "天相"
     ],
     "decadal": [
      36,
      45
     ]
    },
    "亥": {
     "name": "夫妻",
     "stem": "丁",
     "major": [
      "天梁"
     ],
     "decadal": [
      26,
      35
     ]
    }
   }
  }
 },
 {
  "label": "1975-03-08 00:59 男（早子時終點）",
  "input": {
   "year": 1975,
   "month": 3,
   "day": 8,
   "hour": 0,
   "minute": 59,
   "gender": "male"
  },
  "expected": {
   "lunar": "1975-1-26",
   "yearGZ": "乙卯",
   "soulBranch": "寅",
   "bodyBranch": "寅",
   "fiveElementsClass": "土五局",
   "mutagen": [
    "天機",
    "天梁",
    "紫微",
    "太陰"
   ],
   "palaces": {
    "子": {
     "name": "夫妻",
     "stem": "戊",
     "major": [],
     "decadal": [
      25,
      34
     ]
    },
    "丑": {
     "name": "兄弟",
     "stem": "己",
     "major": [],
     "decadal": [
      15,
      24
     ]
    },
    "寅": {
     "name": "命宮",
     "stem": "戊",
     "major": [],
     "decadal": [
      5,
      14
     ]
    },
    "卯": {
     "name": "父母",
     "stem": "己",
     "major": [
      "廉貞",
      "破軍"
     ],
     "decadal": [
      115,
      124
     ]
    },
    "辰": {
     "name": "福德",
     "stem": "庚",
     "major": [],
     "decadal": [
      105,
      114
     ]
    },
    "巳": {
     "name": "田宅",
     "stem": "辛",
     "major": [
      "天府"
     ],
     "decadal": [
      95,
      104
     ]
    },
    "午": {
     "name": "官祿",
     "stem": "壬",
     "major": [
      "天同",
      "太陰"
     ],
     "decadal": [
      85,
      94
     ]
    },
    "未": {
     "name": "交友",
     "stem": "癸",
     "major": [
      "武曲",
      "貪狼"
     ],
     "decadal": [
      75,
      84
     ]
    },
    "申": {
     "name": "遷移",
     "stem": "甲",
     "major": [
      "太陽",
      "巨門"
     ],
     "decadal": [
      65,
      74
     ]
    },
    "酉": {
     "name": "疾厄",
     "stem": "乙",
     "major": [
      "天相"
     ],
     "decadal": [
      55,
      64
     ]
    },
    "戌": {
     "name": "財帛",
     "stem": "丙",
     "major": [
      "天機",
      "天梁"
     ],
     "decadal": [
      45,
      54
     ]
    },
    "亥": {
     "name": "子女",
     "stem": "丁",
     "major": [
      "紫微",
      "七殺"
     ],
     "decadal": [
      35,
      44
     ]
    }
   }
  }
 },
 {
  "label": "2001-09-21 22:59 女（亥時終點）",
  "input": {
   "year": 2001,
   "month": 9,
   "day": 21,
   "hour": 22,
   "minute": 59,
   "gender": "female"
  },
  "expected": {
   "lunar": "2001-8-5",
   "yearGZ": "辛巳",
   "soulBranch": "戌",
   "bodyBranch": "申",
   "fiveElementsClass": "木三局",
   "mutagen": [
    "巨門",
    "太陽",
    "文曲",
    "文昌"
   ],
   "palaces": {
    "子": {
     "name": "福德",
     "stem": "庚",
     "major": [
      "破軍"
     ],
     "decadal": [
      23,
      32
     ]
    },
    "丑": {
     "name": "田宅",
     "stem": "辛",
     "major": [
      "天機"
     ],
     "decadal": [
      33,
      42
     ]
    },
    "寅": {
     "name": "官祿",
     "stem": "庚",
     "major": [
      "紫微",
      "天府"
     ],
     "decadal": [
      43,
      52
     ]
    },
    "卯": {
     "name": "交友",
     "stem": "辛",
     "major": [
      "太陰"
     ],
     "decadal": [
      53,
      62
     ]
    },
    "辰": {
     "name": "遷移",
     "stem": "壬",
     "major": [
      "貪狼"
     ],
     "decadal": [
      63,
      72
     ]
    },
    "巳": {
     "name": "疾厄",
     "stem": "癸",
     "major": [
      "巨門"
     ],
     "decadal": [
      73,
      82
     ]
    },
    "午": {
     "name": "財帛",
     "stem": "甲",
     "major": [
      "廉貞",
      "天相"
     ],
     "decadal": [
      83,
      92
     ]
    },
    "未": {
     "name": "子女",
     "stem": "乙",
     "major": [
      "天梁"
     ],
     "decadal": [
      93,
      102
     ]
    },
    "申": {
     "name": "夫妻",
     "stem": "丙",
     "major": [
      "七殺"
     ],
     "decadal": [
      103,
      112
     ]
    },
    "酉": {
     "name": "兄弟",
     "stem": "丁",
     "major": [
      "天同"
     ],
     "decadal": [
      113,
      122
     ]
    },
    "戌": {
     "name": "命宮",
     "stem": "戊",
     "major": [
      "武曲"
     ],
     "decadal": [
      3,
      12
     ]
    },
    "亥": {
     "name": "父母",
     "stem": "己",
     "major": [
      "太陽"
     ],
     "decadal": [
      13,
      22
     ]
    }
   }
  }
 },
 {
  "label": "2024-02-09 12:00 男（除夕，農曆癸卯年）",
  "input": {
   "year": 2024,
   "month": 2,
   "day": 9,
   "hour": 12,
   "minute": 0,
   "gender": "male"
  },
  "expected": {
   "lunar": "2023-12-30",
   "yearGZ": "癸卯",
   "soulBranch": "未",
   "bodyBranch": "未",
   "fiveElementsClass": "火六局",
   "mutagen": [
    "破軍",
    "巨門",
    "太陰",
    "貪狼"
   ],
   "palaces": {
    "子": {
     "name": "交友",
     "stem": "甲",
     "major": [
      "貪狼"
     ],
     "decadal": [
      76,
      85
     ]
    },
    "丑": {
     "name": "遷移",
     "stem": "乙",
     "major": [
      "天同",
      "巨門"
     ],
     "decadal": [
      66,
      75
     ]
    },
    "寅": {
     "name": "疾厄",
     "stem": "甲",
     "major": [
      "武曲",
      "天相"
     ],
     "decadal": [
      56,
      65
     ]
    },
    "卯": {
     "name": "財帛",
     "stem": "乙",
     "major": [
      "太陽",
      "天梁"
     ],
     "decadal": [
      46,
      55
     ]
    },
    "辰": {
     "name": "子女",
     "stem": "丙",
     "major": [
      "七殺"
     ],
     "decadal": [
      36,
      45
     ]
    },
    "巳": {
     "name": "夫妻",
     "stem": "丁",
     "major": [
      "天機"
     ],
     "decadal": [
      26,
      35
     ]
    },
    "午": {
     "name": "兄弟",
     "stem": "戊",
     "major": [
      "紫微"
     ],
     "decadal": [
      16,
      25
     ]
    },
    "未": {
     "name": "命宮",
     "stem": "己",
     "major": [],
     "decadal": [
      6,
      15
     ]
    },
    "申": {
     "name": "父母",
     "stem": "庚",
     "major": [
      "破軍"
     ],
     "decadal": [
      116,
      125
     ]
    },
    "酉": {
     "name": "福德",
     "stem": "辛",
     "major": [],
     "decadal": [
      106,
      115
     ]
    },
    "戌": {
     "name": "田宅",
     "stem": "壬",
     "major": [
      "廉貞",
      "天府"
     ],
     "decadal": [
      96,
      105
     ]
    },
    "亥": {
     "name": "官祿",
     "stem": "癸",
     "major": [
      "太陰"
     ],
     "decadal": [
      86,
      95
     ]
    }
   }
  }
 },
 {
  "label": "2024-02-10 12:00 男（春節，農曆甲辰年）",
  "input": {
   "year": 2024,
   "month": 2,
   "day": 10,
   "hour": 12,
   "minute": 0,
   "gender": "male"
  },
  "expected": {
   "lunar": "2024-1-1",
   "yearGZ": "甲辰",
   "soulBranch": "申",
   "bodyBranch": "申",
   "fiveElementsClass": "金四局",
   "mutagen": [
    "廉貞",
    "破軍",
    "武曲",
    "太陽"
   ],
   "palaces": {
    "子": {
     "name": "官祿",
     "stem": "丙",
     "major": [],
     "decadal": [
      44,
      53
     ]
    },
    "丑": {
     "name": "交友",
     "stem": "丁",
     "major": [],
     "decadal": [
      54,
      63
     ]
    },
    "寅": {
     "name": "遷移",
     "stem": "丙",
     "major": [],
     "decadal": [
      64,
      73
     ]
    },
    "卯": {
     "name": "疾厄",
     "stem": "丁",
     "major": [
      "廉貞",
      "破軍"
     ],
     "decadal": [
      74,
      83
     ]
    },
    "辰": {
     "name": "財帛",
     "stem": "戊",
     "major": [],
     "decadal": [
      84,
      93
     ]
    },
    "巳": {
     "name": "子女",
     "stem": "己",
     "major": [
      "天府"
     ],
     "decadal": [
      94,
      103
     ]
    },
    "午": {
     "name": "夫妻",
     "stem": "庚",
     "major": [
      "天同",
      "太陰"
     ],
     "decadal": [
      104,
      113
     ]
    },
    "未": {
     "name": "兄弟",
     "stem": "辛",
     "major": [
      "武曲",
      "貪狼"
     ],
     "decadal": [
      114,
      123
     ]
    },
    "申": {
     "name": "命宮",
     "stem": "壬",
     "major": [
      "太陽",
      "巨門"
     ],
     "decadal": [
      4,
      13
     ]
    },
    "酉": {
     "name": "父母",
     "stem": "癸",
     "major": [
      "天相"
     ],
     "decadal": [
      14,
      23
     ]
    },
    "戌": {
     "name": "福德",
     "stem": "甲",
     "major": [
      "天機",
      "天梁"
     ],
     "decadal": [
      24,
      33
     ]
    },
    "亥": {
     "name": "田宅",
     "stem": "乙",
     "major": [
      "紫微",
      "七殺"
     ],
     "decadal": [
      34,
      43
     ]
    }
   }
  }
 },
 {
  "label": "2024-02-05 08:00 女（立春後、春節前）",
  "input": {
   "year": 2024,
   "month": 2,
   "day": 5,
   "hour": 8,
   "minute": 0,
   "gender": "female"
  },
  "expected": {
   "lunar": "2023-12-26",
   "yearGZ": "癸卯",
   "soulBranch": "酉",
   "bodyBranch": "巳",
   "fiveElementsClass": "木三局",
   "mutagen": [
    "破軍",
    "巨門",
    "太陰",
    "貪狼"
   ],
   "palaces": {
    "子": {
     "name": "田宅",
     "stem": "甲",
     "major": [
      "天梁"
     ],
     "decadal": [
      33,
      42
     ]
    },
    "丑": {
     "name": "官祿",
     "stem": "乙",
     "major": [
      "廉貞",
      "七殺"
     ],
     "decadal": [
      43,
      52
     ]
    },
    "寅": {
     "name": "交友",
     "stem": "甲",
     "major": [],
     "decadal": [
      53,
      62
     ]
    },
    "卯": {
     "name": "遷移",
     "stem": "乙",
     "major": [],
     "decadal": [
      63,
      72
     ]
    },
    "辰": {
     "name": "疾厄",
     "stem": "丙",
     "major": [
      "天同"
     ],
     "decadal": [
      73,
      82
     ]
    },
    "巳": {
     "name": "財帛",
     "stem": "丁",
     "major": [
      "武曲",
      "破軍"
     ],
     "decadal": [
      83,
      92
     ]
    },
    "午": {
     "name": "子女",
     "stem": "戊",
     "major": [
      "太陽"
     ],
     "decadal": [
      93,
      102
     ]
    },
    "未": {
     "name": "夫妻",
     "stem": "己",
     "major": [
      "天府"
     ],
     "decadal": [
      103,
      112
     ]
    },
    "申": {
     "name": "兄弟",
     "stem": "庚",
     "major": [
      "天機",
      "太陰"
     ],
     "decadal": [
      113,
      122
     ]
    },
    "酉": {
     "name": "命宮",
     "stem": "辛",
     "major": [
      "紫微",
      "貪狼"
     ],
     "decadal": [
      3,
      12
     ]
    },
    "戌": {
     "name": "父母",
     "stem": "壬",
     "major": [
      "巨門"
     ],
     "decadal": [
      13,
      22
     ]
    },
    "亥": {
     "name": "福德",
     "stem": "癸",
     "major": [
      "天相"
     ],
     "decadal": [
      23,
      32
     ]
    }
   }
  }
 },
 {
  "label": "2020-06-01 10:00 男（閏四月上半月）",
  "input": {
   "year": 2020,
   "month": 6,
   "day": 1,
   "hour": 10,
   "minute": 0,
   "gender": "male"
  },
  "expected": {
   "lunar": "2020-4-10閏",
   "yearGZ": "庚子",
   "soulBranch": "子",
   "bodyBranch": "戌",
   "fiveElementsClass": "火六局",
   "mutagen": [
    "太陽",
    "武曲",
    "太陰",
    "天同"
   ],
   "palaces": {
    "子": {
     "name": "命宮",
     "stem": "戊",
     "major": [
      "天同",
      "太陰"
     ],
     "decadal": [
      6,
      15
     ]
    },
    "丑": {
     "name": "父母",
     "stem": "己",
     "major": [
      "武曲",
      "貪狼"
     ],
     "decadal": [
      16,
      25
     ]
    },
    "寅": {
     "name": "福德",
     "stem": "戊",
     "major": [
      "太陽",
      "巨門"
     ],
     "decadal": [
      26,
      35
     ]
    },
    "卯": {
     "name": "田宅",
     "stem": "己",
     "major": [
      "天相"
     ],
     "decadal": [
      36,
      45
     ]
    },
    "辰": {
     "name": "官祿",
     "stem": "庚",
     "major": [
      "天機",
      "天梁"
     ],
     "decadal": [
      46,
      55
     ]
    },
    "巳": {
     "name": "交友",
     "stem": "辛",
     "major": [
      "紫微",
      "七殺"
     ],
     "decadal": [
      56,
      65
     ]
    },
    "午": {
     "name": "遷移",
     "stem": "壬",
     "major": [],
     "decadal": [
      66,
      75
     ]
    },
    "未": {
     "name": "疾厄",
     "stem": "癸",
     "major": [],
     "decadal": [
      76,
      85
     ]
    },
    "申": {
     "name": "財帛",
     "stem": "甲",
     "major": [],
     "decadal": [
      86,
      95
     ]
    },
    "酉": {
     "name": "子女",
     "stem": "乙",
     "major": [
      "廉貞",
      "破軍"
     ],
     "decadal": [
      96,
      105
     ]
    },
    "戌": {
     "name": "夫妻",
     "stem": "丙",
     "major": [],
     "decadal": [
      106,
      115
     ]
    },
    "亥": {
     "name": "兄弟",
     "stem": "丁",
     "major": [
      "天府"
     ],
     "decadal": [
      116,
      125
     ]
    }
   }
  }
 },
 {
  "label": "2020-06-10 10:00 女（閏四月下半月）",
  "input": {
   "year": 2020,
   "month": 6,
   "day": 10,
   "hour": 10,
   "minute": 0,
   "gender": "female"
  },
  "expected": {
   "lunar": "2020-4-19閏",
   "yearGZ": "庚子",
   "soulBranch": "丑",
   "bodyBranch": "亥",
   "fiveElementsClass": "火六局",
   "mutagen": [
    "太陽",
    "武曲",
    "太陰",
    "天同"
   ],
   "palaces": {
    "子": {
     "name": "兄弟",
     "stem": "戊",
     "major": [
      "紫微"
     ],
     "decadal": [
      16,
      25
     ]
    },
    "丑": {
     "name": "命宮",
     "stem": "己",
     "major": [],
     "decadal": [
      6,
      15
     ]
    },
    "寅": {
     "name": "父母",
     "stem": "戊",
     "major": [
      "破軍"
     ],
     "decadal": [
      116,
      125
     ]
    },
    "卯": {
     "name": "福德",
     "stem": "己",
     "major": [],
     "decadal": [
      106,
      115
     ]
    },
    "辰": {
     "name": "田宅",
     "stem": "庚",
     "major": [
      "廉貞",
      "天府"
     ],
     "decadal": [
      96,
      105
     ]
    },
    "巳": {
     "name": "官祿",
     "stem": "辛",
     "major": [
      "太陰"
     ],
     "decadal": [
      86,
      95
     ]
    },
    "午": {
     "name": "交友",
     "stem": "壬",
     "major": [
      "貪狼"
     ],
     "decadal": [
      76,
      85
     ]
    },
    "未": {
     "name": "遷移",
     "stem": "癸",
     "major": [
      "天同",
      "巨門"
     ],
     "decadal": [
      66,
      75
     ]
    },
    "申": {
     "name": "疾厄",
     "stem": "甲",
     "major": [
      "武曲",
      "天相"
     ],
     "decadal": [
      56,
      65
     ]
    },
    "酉": {
     "name": "財帛",
     "stem": "乙",
     "major": [
      "太陽",
      "天梁"
     ],
     "decadal": [
      46,
      55
     ]
    },
    "戌": {
     "name": "子女",
     "stem": "丙",
     "major": [
      "七殺"
     ],
     "decadal": [
      36,
      45
     ]
    },
    "亥": {
     "name": "夫妻",
     "stem": "丁",
     "major": [
      "天機"
     ],
     "decadal": [
      26,
      35
     ]
    }
   }
  }
 },
 {
  "label": "2023-04-05 16:00 男（閏二月下半月）",
  "input": {
   "year": 2023,
   "month": 4,
   "day": 5,
   "hour": 16,
   "minute": 0,
   "gender": "male"
  },
  "expected": {
   "lunar": "2023-2-15閏",
   "yearGZ": "癸卯",
   "soulBranch": "未",
   "bodyBranch": "亥",
   "fiveElementsClass": "火六局",
   "mutagen": [
    "破軍",
    "巨門",
    "太陰",
    "貪狼"
   ],
   "palaces": {
    "子": {
     "name": "交友",
     "stem": "甲",
     "major": [
      "天機"
     ],
     "decadal": [
      76,
      85
     ]
    },
    "丑": {
     "name": "遷移",
     "stem": "乙",
     "major": [
      "紫微",
      "破軍"
     ],
     "decadal": [
      66,
      75
     ]
    },
    "寅": {
     "name": "疾厄",
     "stem": "甲",
     "major": [],
     "decadal": [
      56,
      65
     ]
    },
    "卯": {
     "name": "財帛",
     "stem": "乙",
     "major": [
      "天府"
     ],
     "decadal": [
      46,
      55
     ]
    },
    "辰": {
     "name": "子女",
     "stem": "丙",
     "major": [
      "太陰"
     ],
     "decadal": [
      36,
      45
     ]
    },
    "巳": {
     "name": "夫妻",
     "stem": "丁",
     "major": [
      "廉貞",
      "貪狼"
     ],
     "decadal": [
      26,
      35
     ]
    },
    "午": {
     "name": "兄弟",
     "stem": "戊",
     "major": [
      "巨門"
     ],
     "decadal": [
      16,
      25
     ]
    },
    "未": {
     "name": "命宮",
     "stem": "己",
     "major": [
      "天相"
     ],
     "decadal": [
      6,
      15
     ]
    },
    "申": {
     "name": "父母",
     "stem": "庚",
     "major": [
      "天同",
      "天梁"
     ],
     "decadal": [
      116,
      125
     ]
    },
    "酉": {
     "name": "福德",
     "stem": "辛",
     "major": [
      "武曲",
      "七殺"
     ],
     "decadal": [
      106,
      115
     ]
    },
    "戌": {
     "name": "田宅",
     "stem": "壬",
     "major": [
      "太陽"
     ],
     "decadal": [
      96,
      105
     ]
    },
    "亥": {
     "name": "官祿",
     "stem": "癸",
     "major": [],
     "decadal": [
      86,
      95
     ]
    }
   }
  }
 },
 {
  "label": "1960-12-31 06:00 男（庚子年）",
  "input": {
   "year": 1960,
   "month": 12,
   "day": 31,
   "hour": 6,
   "minute": 0,
   "gender": "male"
  },
  "expected": {
   "lunar": "1960-11-14",
   "yearGZ": "庚子",
   "soulBranch": "酉",
   "bodyBranch": "卯",
   "fiveElementsClass": "水二局",
   "mutagen": [
    "太陽",
    "武曲",
    "太陰",
    "天同"
   ],
   "palaces": {
    "子": {
     "name": "田宅",
     "stem": "戊",
     "major": [
      "廉貞",
      "天相"
     ],
     "decadal": [
      32,
      41
     ]
    },
    "丑": {
     "name": "官祿",
     "stem": "己",
     "major": [
      "天梁"
     ],
     "decadal": [
      42,
      51
     ]
    },
    "寅": {
     "name": "交友",
     "stem": "戊",
     "major": [
      "七殺"
     ],
     "decadal": [
      52,
      61
     ]
    },
    "卯": {
     "name": "遷移",
     "stem": "己",
     "major": [
      "天同"
     ],
     "decadal": [
      62,
      71
     ]
    },
    "辰": {
     "name": "疾厄",
     "stem": "庚",
     "major": [
      "武曲"
     ],
     "decadal": [
      72,
      81
     ]
    },
    "巳": {
     "name": "財帛",
     "stem": "辛",
     "major": [
      "太陽"
     ],
     "decadal": [
      82,
      91
     ]
    },
    "午": {
     "name": "子女",
     "stem": "壬",
     "major": [
      "破軍"
     ],
     "decadal": [
      92,
      101
     ]
    },
    "未": {
     "name": "夫妻",
     "stem": "癸",
     "major": [
      "天機"
     ],
     "decadal": [
      102,
      111
     ]
    },
    "申": {
     "name": "兄弟",
     "stem": "甲",
     "major": [
      "紫微",
      "天府"
     ],
     "decadal": [
      112,
      121
     ]
    },
    "酉": {
     "name": "命宮",
     "stem": "乙",
     "major": [
      "太陰"
     ],
     "decadal": [
      2,
      11
     ]
    },
    "戌": {
     "name": "父母",
     "stem": "丙",
     "major": [
      "貪狼"
     ],
     "decadal": [
      12,
      21
     ]
    },
    "亥": {
     "name": "福德",
     "stem": "丁",
     "major": [
      "巨門"
     ],
     "decadal": [
      22,
      31
     ]
    }
   }
  }
 },
 {
  "label": "1972-07-07 18:20 女（壬子年）",
  "input": {
   "year": 1972,
   "month": 7,
   "day": 7,
   "hour": 18,
   "minute": 20,
   "gender": "female"
  },
  "expected": {
   "lunar": "1972-5-27",
   "yearGZ": "壬子",
   "soulBranch": "酉",
   "bodyBranch": "卯",
   "fiveElementsClass": "土五局",
   "mutagen": [
    "天梁",
    "紫微",
    "左輔",
    "武曲"
   ],
   "palaces": {
    "子": {
     "name": "田宅",
     "stem": "壬",
     "major": [
      "武曲",
      "天府"
     ],
     "decadal": [
      95,
      104
     ]
    },
    "丑": {
     "name": "官祿",
     "stem": "癸",
     "major": [
      "太陽",
      "太陰"
     ],
     "decadal": [
      85,
      94
     ]
    },
    "寅": {
     "name": "交友",
     "stem": "壬",
     "major": [
      "貪狼"
     ],
     "decadal": [
      75,
      84
     ]
    },
    "卯": {
     "name": "遷移",
     "stem": "癸",
     "major": [
      "天機",
      "巨門"
     ],
     "decadal": [
      65,
      74
     ]
    },
    "辰": {
     "name": "疾厄",
     "stem": "甲",
     "major": [
      "紫微",
      "天相"
     ],
     "decadal": [
      55,
      64
     ]
    },
    "巳": {
     "name": "財帛",
     "stem": "乙",
     "major": [
      "天梁"
     ],
     "decadal": [
      45,
      54
     ]
    },
    "午": {
     "name": "子女",
     "stem": "丙",
     "major": [
      "七殺"
     ],
     "decadal": [
      35,
      44
     ]
    },
    "未": {
     "name": "夫妻",
     "stem": "丁",
     "major": [],
     "decadal": [
      25,
      34
     ]
    },
    "申": {
     "name": "兄弟",
     "stem": "戊",
     "major": [
      "廉貞"
     ],
     "decadal": [
      15,
      24
     ]
    },
    "酉": {
     "name": "命宮",
     "stem": "己",
     "major": [],
     "decadal": [
      5,
      14
     ]
    },
    "戌": {
     "name": "父母",
     "stem": "庚",
     "major": [
      "破軍"
     ],
     "decadal": [
      115,
      124
     ]
    },
    "亥": {
     "name": "福德",
     "stem": "辛",
     "major": [
      "天同"
     ],
     "decadal": [
      105,
      114
     ]
    }
   }
  }
 },
 {
  "label": "1988-11-07 03:30 女（戊辰年）",
  "input": {
   "year": 1988,
   "month": 11,
   "day": 7,
   "hour": 3,
   "minute": 30,
   "gender": "female"
  },
  "expected": {
   "lunar": "1988-9-28",
   "yearGZ": "戊辰",
   "soulBranch": "申",
   "bodyBranch": "子",
   "fiveElementsClass": "木三局",
   "mutagen": [
    "貪狼",
    "太陰",
    "右弼",
    "天機"
   ],
   "palaces": {
    "子": {
     "name": "官祿",
     "stem": "甲",
     "major": [
      "天機"
     ],
     "decadal": [
      83,
      92
     ]
    },
    "丑": {
     "name": "交友",
     "stem": "乙",
     "major": [
      "紫微",
      "破軍"
     ],
     "decadal": [
      73,
      82
     ]
    },
    "寅": {
     "name": "遷移",
     "stem": "甲",
     "major": [],
     "decadal": [
      63,
      72
     ]
    },
    "卯": {
     "name": "疾厄",
     "stem": "乙",
     "major": [
      "天府"
     ],
     "decadal": [
      53,
      62
     ]
    },
    "辰": {
     "name": "財帛",
     "stem": "丙",
     "major": [
      "太陰"
     ],
     "decadal": [
      43,
      52
     ]
    },
    "巳": {
     "name": "子女",
     "stem": "丁",
     "major": [
      "廉貞",
      "貪狼"
     ],
     "decadal": [
      33,
      42
     ]
    },
    "午": {
     "name": "夫妻",
     "stem": "戊",
     "major": [
      "巨門"
     ],
     "decadal": [
      23,
      32
     ]
    },
    "未": {
     "name": "兄弟",
     "stem": "己",
     "major": [
      "天相"
     ],
     "decadal": [
      13,
      22
     ]
    },
    "申": {
     "name": "命宮",
     "stem": "庚",
     "major": [
      "天同",
      "天梁"
     ],
     "decadal": [
      3,
      12
     ]
    },
    "酉": {
     "name": "父母",
     "stem": "辛",
     "major": [
      "武曲",
      "七殺"
     ],
     "decadal": [
      113,
      122
     ]
    },
    "戌": {
     "name": "福德",
     "stem": "壬",
     "major": [
      "太陽"
     ],
     "decadal": [
      103,
      112
     ]
    },
    "亥": {
     "name": "田宅",
     "stem": "癸",
     "major": [],
     "decadal": [
      93,
      102
     ]
    }
   }
  }
 },
 {
  "label": "1999-01-17 09:00 男（農曆初一）",
  "input": {
   "year": 1999,
   "month": 1,
   "day": 17,
   "hour": 9,
   "minute": 0,
   "gender": "male"
  },
  "expected": {
   "lunar": "1998-12-1",
   "yearGZ": "戊寅",
   "soulBranch": "申",
   "bodyBranch": "午",
   "fiveElementsClass": "木三局",
   "mutagen": [
    "貪狼",
    "太陰",
    "右弼",
    "天機"
   ],
   "palaces": {
    "子": {
     "name": "官祿",
     "stem": "甲",
     "major": [
      "武曲",
      "天府"
     ],
     "decadal": [
      43,
      52
     ]
    },
    "丑": {
     "name": "交友",
     "stem": "乙",
     "major": [
      "太陽",
      "太陰"
     ],
     "decadal": [
      53,
      62
     ]
    },
    "寅": {
     "name": "遷移",
     "stem": "甲",
     "major": [
      "貪狼"
     ],
     "decadal": [
      63,
      72
     ]
    },
    "卯": {
     "name": "疾厄",
     "stem": "乙",
     "major": [
      "天機",
      "巨門"
     ],
     "decadal": [
      73,
      82
     ]
    },
    "辰": {
     "name": "財帛",
     "stem": "丙",
     "major": [
      "紫微",
      "天相"
     ],
     "decadal": [
      83,
      92
     ]
    },
    "巳": {
     "name": "子女",
     "stem": "丁",
     "major": [
      "天梁"
     ],
     "decadal": [
      93,
      102
     ]
    },
    "午": {
     "name": "夫妻",
     "stem": "戊",
     "major": [
      "七殺"
     ],
     "decadal": [
      103,
      112
     ]
    },
    "未": {
     "name": "兄弟",
     "stem": "己",
     "major": [],
     "decadal": [
      113,
      122
     ]
    },
    "申": {
     "name": "命宮",
     "stem": "庚",
     "major": [
      "廉貞"
     ],
     "decadal": [
      3,
      12
     ]
    },
    "酉": {
     "name": "父母",
     "stem": "辛",
     "major": [],
     "decadal": [
      13,
      22
     ]
    },
    "戌": {
     "name": "福德",
     "stem": "壬",
     "major": [
      "破軍"
     ],
     "decadal": [
      23,
      32
     ]
    },
    "亥": {
     "name": "田宅",
     "stem": "癸",
     "major": [
      "天同"
     ],
     "decadal": [
      33,
      42
     ]
    }
   }
  }
 },
 {
  "label": "2010-05-13 20:45 女（農曆三十）",
  "input": {
   "year": 2010,
   "month": 5,
   "day": 13,
   "hour": 20,
   "minute": 45,
   "gender": "female"
  },
  "expected": {
   "lunar": "2010-3-30",
   "yearGZ": "庚寅",
   "soulBranch": "午",
   "bodyBranch": "寅",
   "fiveElementsClass": "木三局",
   "mutagen": [
    "太陽",
    "武曲",
    "太陰",
    "天同"
   ],
   "palaces": {
    "子": {
     "name": "遷移",
     "stem": "戊",
     "major": [],
     "decadal": [
      63,
      72
     ]
    },
    "丑": {
     "name": "疾厄",
     "stem": "己",
     "major": [],
     "decadal": [
      53,
      62
     ]
    },
    "寅": {
     "name": "財帛",
     "stem": "戊",
     "major": [],
     "decadal": [
      43,
      52
     ]
    },
    "卯": {
     "name": "子女",
     "stem": "己",
     "major": [
      "廉貞",
      "破軍"
     ],
     "decadal": [
      33,
      42
     ]
    },
    "辰": {
     "name": "夫妻",
     "stem": "庚",
     "major": [],
     "decadal": [
      23,
      32
     ]
    },
    "巳": {
     "name": "兄弟",
     "stem": "辛",
     "major": [
      "天府"
     ],
     "decadal": [
      13,
      22
     ]
    },
    "午": {
     "name": "命宮",
     "stem": "壬",
     "major": [
      "天同",
      "太陰"
     ],
     "decadal": [
      3,
      12
     ]
    },
    "未": {
     "name": "父母",
     "stem": "癸",
     "major": [
      "武曲",
      "貪狼"
     ],
     "decadal": [
      113,
      122
     ]
    },
    "申": {
     "name": "福德",
     "stem": "甲",
     "major": [
      "太陽",
      "巨門"
     ],
     "decadal": [
      103,
      112
     ]
    },
    "酉": {
     "name": "田宅",
     "stem": "乙",
     "major": [
      "天相"
     ],
     "decadal": [
      93,
      102
     ]
    },
    "戌": {
     "name": "官祿",
     "stem": "丙",
     "major": [
      "天機",
      "天梁"
     ],
     "decadal": [
      83,
      92
     ]
    },
    "亥": {
     "name": "交友",
     "stem": "丁",
     "major": [
      "紫微",
      "七殺"
     ],
     "decadal": [
      73,
      82
     ]
    }
   }
  }
 },
 {
  "label": "1985-05-20 11:10 男",
  "input": {
   "year": 1985,
   "month": 5,
   "day": 20,
   "hour": 11,
   "minute": 10,
   "gender": "male"
  },
  "expected": {
   "lunar": "1985-4-1",
   "yearGZ": "乙丑",
   "soulBranch": "亥",
   "bodyBranch": "亥",
   "fiveElementsClass": "土五局",
   "mutagen": [
    "天機",
    "天梁",
    "紫微",
    "太陰"
   ],
   "palaces": {
    "子": {
     "name": "父母",
     "stem": "戊",
     "major": [
      "貪狼"
     ],
     "decadal": [
      115,
      124
     ]
    },
    "丑": {
     "name": "福德",
     "stem": "己",
     "major": [
      "天同",
      "巨門"
     ],
     "decadal": [
      105,
      114
     ]
    },
    "寅": {
     "name": "田宅",
     "stem": "戊",
     "major": [
      "武曲",
      "天相"
     ],
     "decadal": [
      95,
      104
     ]
    },
    "卯": {
     "name": "官祿",
     "stem": "己",
     "major": [
      "太陽",
      "天梁"
     ],
     "decadal": [
      85,
      94
     ]
    },
    "辰": {
     "name": "交友",
     "stem": "庚",
     "major": [
      "七殺"
     ],
     "decadal": [
      75,
      84
     ]
    },
    "巳": {
     "name": "遷移",
     "stem": "辛",
     "major": [
      "天機"
     ],
     "decadal": [
      65,
      74
     ]
    },
    "午": {
     "name": "疾厄",
     "stem": "壬",
     "major": [
      "紫微"
     ],
     "decadal": [
      55,
      64
     ]
    },
    "未": {
     "name": "財帛",
     "stem": "癸",
     "major": [],
     "decadal": [
      45,
      54
     ]
    },
    "申": {
     "name": "子女",
     "stem": "甲",
     "major": [
      "破軍"
     ],
     "decadal": [
      35,
      44
     ]
    },
    "酉": {
     "name": "夫妻",
     "stem": "乙",
     "major": [],
     "decadal": [
      25,
      34
     ]
    },
    "戌": {
     "name": "兄弟",
     "stem": "丙",
     "major": [
      "廉貞",
      "天府"
     ],
     "decadal": [
      15,
      24
     ]
    },
    "亥": {
     "name": "命宮",
     "stem": "丁",
     "major": [
      "太陰"
     ],
     "decadal": [
      5,
      14
     ]
    }
   }
  }
 },
 {
  "label": "1995-10-03 23:30 女（晚子時）",
  "input": {
   "year": 1995,
   "month": 10,
   "day": 3,
   "hour": 23,
   "minute": 30,
   "gender": "female"
  },
  "expected": {
   "lunar": "1995-8-10閏",
   "yearGZ": "乙亥",
   "soulBranch": "酉",
   "bodyBranch": "酉",
   "fiveElementsClass": "水二局",
   "mutagen": [
    "天機",
    "天梁",
    "紫微",
    "太陰"
   ],
   "palaces": {
    "子": {
     "name": "田宅",
     "stem": "戊",
     "major": [
      "貪狼"
     ],
     "decadal": [
      32,
      41
     ]
    },
    "丑": {
     "name": "官祿",
     "stem": "己",
     "major": [
      "天同",
      "巨門"
     ],
     "decadal": [
      42,
      51
     ]
    },
    "寅": {
     "name": "交友",
     "stem": "戊",
     "major": [
      "武曲",
      "天相"
     ],
     "decadal": [
      52,
      61
     ]
    },
    "卯": {
     "name": "遷移",
     "stem": "己",
     "major": [
      "太陽",
      "天梁"
     ],
     "decadal": [
      62,
      71
     ]
    },
    "辰": {
     "name": "疾厄",
     "stem": "庚",
     "major": [
      "七殺"
     ],
     "decadal": [
      72,
      81
     ]
    },
    "巳": {
     "name": "財帛",
     "stem": "辛",
     "major": [
      "天機"
     ],
     "decadal": [
      82,
      91
     ]
    },
    "午": {
     "name": "子女",
     "stem": "壬",
     "major": [
      "紫微"
     ],
     "decadal": [
      92,
      101
     ]
    },
    "未": {
     "name": "夫妻",
     "stem": "癸",
     "major": [],
     "decadal": [
      102,
      111
     ]
    },
    "申": {
     "name": "兄弟",
     "stem": "甲",
     "major": [
      "破軍"
     ],
     "decadal": [
      112,
      121
     ]
    },
    "酉": {
     "name": "命宮",
     "stem": "乙",
     "major": [],
     "decadal": [
      2,
      11
     ]
    },
    "戌": {
     "name": "父母",
     "stem": "丙",
     "major": [
      "廉貞",
      "天府"
     ],
     "decadal": [
      12,
      21
     ]
    },
    "亥": {
     "name": "福德",
     "stem": "丁",
     "major": [
      "太陰"
     ],
     "decadal": [
      22,
      31
     ]
    }
   }
  }
 },
 {
  "label": "2050-08-08 08:08 男（本世紀中）",
  "input": {
   "year": 2050,
   "month": 8,
   "day": 8,
   "hour": 8,
   "minute": 8,
   "gender": "male"
  },
  "expected": {
   "lunar": "2050-6-21",
   "yearGZ": "庚午",
   "soulBranch": "卯",
   "bodyBranch": "亥",
   "fiveElementsClass": "土五局",
   "mutagen": [
    "太陽",
    "武曲",
    "太陰",
    "天同"
   ],
   "palaces": {
    "子": {
     "name": "子女",
     "stem": "戊",
     "major": [
      "七殺"
     ],
     "decadal": [
      95,
      104
     ]
    },
    "丑": {
     "name": "夫妻",
     "stem": "己",
     "major": [],
     "decadal": [
      105,
      114
     ]
    },
    "寅": {
     "name": "兄弟",
     "stem": "戊",
     "major": [
      "廉貞"
     ],
     "decadal": [
      115,
      124
     ]
    },
    "卯": {
     "name": "命宮",
     "stem": "己",
     "major": [],
     "decadal": [
      5,
      14
     ]
    },
    "辰": {
     "name": "父母",
     "stem": "庚",
     "major": [
      "破軍"
     ],
     "decadal": [
      15,
      24
     ]
    },
    "巳": {
     "name": "福德",
     "stem": "辛",
     "major": [
      "天同"
     ],
     "decadal": [
      25,
      34
     ]
    },
    "午": {
     "name": "田宅",
     "stem": "壬",
     "major": [
      "武曲",
      "天府"
     ],
     "decadal": [
      35,
      44
     ]
    },
    "未": {
     "name": "官祿",
     "stem": "癸",
     "major": [
      "太陽",
      "太陰"
     ],
     "decadal": [
      45,
      54
     ]
    },
    "申": {
     "name": "交友",
     "stem": "甲",
     "major": [
      "貪狼"
     ],
     "decadal": [
      55,
      64
     ]
    },
    "酉": {
     "name": "遷移",
     "stem": "乙",
     "major": [
      "天機",
      "巨門"
     ],
     "decadal": [
      65,
      74
     ]
    },
    "戌": {
     "name": "疾厄",
     "stem": "丙",
     "major": [
      "紫微",
      "天相"
     ],
     "decadal": [
      75,
      84
     ]
    },
    "亥": {
     "name": "財帛",
     "stem": "丁",
     "major": [
      "天梁"
     ],
     "decadal": [
      85,
      94
     ]
    }
   }
  }
 }
];
