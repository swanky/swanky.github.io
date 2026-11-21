// fixtures-golden.mjs — 八字四柱 golden 案例（獨立參考：sxtwl＋Swiss Ephemeris）。
//
// 來源（2026-11-21 改採，取代原訂「≥3 個排盤站人工抄錄」）：
//   年／月／日／時柱：sxtwl 2.x（壽星天文曆，許劍偉演算法；與本站 iztro／lunar 系的 6tail 血緣不同）以腳本算出。
//   節氣當日：依 sxtwl 給的節氣精確時刻判斷生在節前或節後；月支再用 pyswisseph 2.10.03 的太陽視黃經
//   （寅月＝315° 起每 30°）逐筆交叉，兩者一致才入檔。日柱與時柱採 23:00 換日（zi23，本站預設）。
//   本站引擎（太陽黃經用 astronomy-engine、日柱用儒略日算術）與上述兩套為不同實作。
// 常識抽查：1949-10-01＝甲子日、2000-01-01＝戊午日，與公認一致。
// 首次比對（14 筆，含立春前後、驚蟄前後、23 點換日、早子時、1901／2050）：四柱全數一致。
// ⚠ 不得手改 expected；要加案例就重跑產生腳本（設定如上，可重現）。夏令時間與真太陽時不在本檔範圍。
//
// input:    { year, month, day, hour, minute, tz, gender }
// expected: { year, month, day, hour }（干支字串）
export const GOLDEN_BAZI = [
  {
    "label": "台北 1990-06-15 14:30",
    "input": {
      "year": 1990,
      "month": 6,
      "day": 15,
      "hour": 14,
      "minute": 30,
      "tz": "Asia/Taipei",
      "gender": "male"
    },
    "expected": {
      "year": "庚午",
      "month": "壬午",
      "day": "辛亥",
      "hour": "乙未"
    }
  },
  {
    "label": "台北 2025-02-03 21:00（立春前）",
    "input": {
      "year": 2025,
      "month": 2,
      "day": 3,
      "hour": 21,
      "minute": 0,
      "tz": "Asia/Taipei",
      "gender": "male"
    },
    "expected": {
      "year": "甲辰",
      "month": "丁丑",
      "day": "癸卯",
      "hour": "癸亥"
    }
  },
  {
    "label": "台北 2025-02-03 22:30（立春後）",
    "input": {
      "year": 2025,
      "month": 2,
      "day": 3,
      "hour": 22,
      "minute": 30,
      "tz": "Asia/Taipei",
      "gender": "male"
    },
    "expected": {
      "year": "乙巳",
      "month": "戊寅",
      "day": "癸卯",
      "hour": "癸亥"
    }
  },
  {
    "label": "台北 2025-02-03 23:30（立春後＋23 點換日）",
    "input": {
      "year": 2025,
      "month": 2,
      "day": 3,
      "hour": 23,
      "minute": 30,
      "tz": "Asia/Taipei",
      "gender": "male"
    },
    "expected": {
      "year": "乙巳",
      "month": "戊寅",
      "day": "甲辰",
      "hour": "甲子"
    }
  },
  {
    "label": "台北 2024-03-05 09:30（驚蟄前）",
    "input": {
      "year": 2024,
      "month": 3,
      "day": 5,
      "hour": 9,
      "minute": 30,
      "tz": "Asia/Taipei",
      "gender": "male"
    },
    "expected": {
      "year": "甲辰",
      "month": "丙寅",
      "day": "戊辰",
      "hour": "丁巳"
    }
  },
  {
    "label": "台北 2024-03-05 11:30（驚蟄後）",
    "input": {
      "year": 2024,
      "month": 3,
      "day": 5,
      "hour": 11,
      "minute": 30,
      "tz": "Asia/Taipei",
      "gender": "male"
    },
    "expected": {
      "year": "甲辰",
      "month": "丁卯",
      "day": "戊辰",
      "hour": "戊午"
    }
  },
  {
    "label": "台北 1999-12-31 23:59（跨年夜 23 點換日）",
    "input": {
      "year": 1999,
      "month": 12,
      "day": 31,
      "hour": 23,
      "minute": 59,
      "tz": "Asia/Taipei",
      "gender": "male"
    },
    "expected": {
      "year": "己卯",
      "month": "丙子",
      "day": "戊午",
      "hour": "壬子"
    }
  },
  {
    "label": "台北 2000-01-01 00:30（早子時）",
    "input": {
      "year": 2000,
      "month": 1,
      "day": 1,
      "hour": 0,
      "minute": 30,
      "tz": "Asia/Taipei",
      "gender": "male"
    },
    "expected": {
      "year": "己卯",
      "month": "丙子",
      "day": "戊午",
      "hour": "壬子"
    }
  },
  {
    "label": "上海 1949-10-01 15:00",
    "input": {
      "year": 1949,
      "month": 10,
      "day": 1,
      "hour": 15,
      "minute": 0,
      "tz": "Asia/Shanghai",
      "gender": "male"
    },
    "expected": {
      "year": "己丑",
      "month": "癸酉",
      "day": "甲子",
      "hour": "壬申"
    }
  },
  {
    "label": "台北 1901-03-15 12:00（二十世紀初）",
    "input": {
      "year": 1901,
      "month": 3,
      "day": 15,
      "hour": 12,
      "minute": 0,
      "tz": "Asia/Taipei",
      "gender": "male"
    },
    "expected": {
      "year": "辛丑",
      "month": "辛卯",
      "day": "壬辰",
      "hour": "丙午"
    }
  },
  {
    "label": "台北 2050-08-08 08:08（本世紀中）",
    "input": {
      "year": 2050,
      "month": 8,
      "day": 8,
      "hour": 8,
      "minute": 8,
      "tz": "Asia/Taipei",
      "gender": "male"
    },
    "expected": {
      "year": "庚午",
      "month": "甲申",
      "day": "庚申",
      "hour": "庚辰"
    }
  },
  {
    "label": "香港 1960-12-31 12:00",
    "input": {
      "year": 1960,
      "month": 12,
      "day": 31,
      "hour": 12,
      "minute": 0,
      "tz": "Asia/Hong_Kong",
      "gender": "male"
    },
    "expected": {
      "year": "庚子",
      "month": "戊子",
      "day": "癸巳",
      "hour": "戊午"
    }
  },
  {
    "label": "台北 2010-05-20 06:15",
    "input": {
      "year": 2010,
      "month": 5,
      "day": 20,
      "hour": 6,
      "minute": 15,
      "tz": "Asia/Taipei",
      "gender": "male"
    },
    "expected": {
      "year": "庚寅",
      "month": "辛巳",
      "day": "庚午",
      "hour": "己卯"
    }
  },
  {
    "label": "東京 1988-11-07 18:00（立冬日）",
    "input": {
      "year": 1988,
      "month": 11,
      "day": 7,
      "hour": 18,
      "minute": 0,
      "tz": "Asia/Tokyo",
      "gender": "male"
    },
    "expected": {
      "year": "戊辰",
      "month": "癸亥",
      "day": "丙寅",
      "hour": "丁酉"
    }
  }
];
