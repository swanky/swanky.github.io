// fixtures-golden.mjs — 星座命盤 golden 案例（獨立參考：Swiss Ephemeris）。
//
// 來源（2026-11-21 改採，取代原訂「人工從 astro.com 抄錄」）：
//   pyswisseph 2.10.03（Swiss Ephemeris，astro.com 背後就是同一套引擎）以腳本算出，未經本站程式碼。
//   設定：回歸黃道、視位置（真黃道、含章動與光行差）、Moshier 星曆、北交點＝真交點；
//   宮位 whole＝swe 'W'、equal＝swe 'E'；牆鐘時間以 Python zoneinfo（IANA）換成 UTC。
//   本站引擎是 astronomy-engine（Don Cross），與 Swiss Ephemeris 為不同實作，比對有獨立性。
// 首次比對（12 筆）：最大誤差 ASC 0.0041°、MC 0.0006°、行星 0.0049°、北交點 0.0056°。
// ⚠ 不得手改 expected；要加案例就重跑產生腳本（scripts 不進 repo，設定如上，可重現）。
//
// input:    { year, month, day, hour, minute, tz, lat, lon, houseSystem }
// expected: { asc, mc, cusps: [12 個黃經度數], planets: { sun..pluto, northNode } }
export const GOLDEN_ASTRO = [
  {
    "label": "台北 1990-06-15 14:30",
    "input": {
      "year": 1990,
      "month": 6,
      "day": 15,
      "hour": 14,
      "minute": 30,
      "tz": "Asia/Taipei",
      "lat": 25.03,
      "lon": 121.57,
      "houseSystem": "whole"
    },
    "expected": {
      "asc": 209.119,
      "mc": 120.167,
      "cusps": [
        180.0,
        210.0,
        240.0,
        270.0,
        300.0,
        330.0,
        0.0,
        30.0,
        60.0,
        90.0,
        120.0,
        150.0
      ],
      "planets": {
        "sun": 83.911,
        "moon": 342.305,
        "mercury": 65.299,
        "venus": 48.508,
        "mars": 10.877,
        "jupiter": 105.84,
        "saturn": 294.045,
        "uranus": 278.174,
        "neptune": 283.723,
        "pluto": 225.406,
        "northNode": 308.116
      }
    }
  },
  {
    "label": "台北 1975-07-10 09:00（台灣夏令時間）",
    "input": {
      "year": 1975,
      "month": 7,
      "day": 10,
      "hour": 9,
      "minute": 0,
      "tz": "Asia/Taipei",
      "lat": 25.03,
      "lon": 121.57,
      "houseSystem": "whole"
    },
    "expected": {
      "asc": 143.122,
      "mc": 51.297,
      "cusps": [
        120.0,
        150.0,
        180.0,
        210.0,
        240.0,
        270.0,
        300.0,
        330.0,
        0.0,
        30.0,
        60.0,
        90.0
      ],
      "planets": {
        "sun": 107.147,
        "moon": 118.283,
        "mercury": 86.695,
        "venus": 150.391,
        "mars": 36.239,
        "jupiter": 22.679,
        "saturn": 111.775,
        "uranus": 208.361,
        "neptune": 249.476,
        "pluto": 186.625,
        "northNode": 240.001
      }
    }
  },
  {
    "label": "東京 1964-10-10 14:00（等宮制）",
    "input": {
      "year": 1964,
      "month": 10,
      "day": 10,
      "hour": 14,
      "minute": 0,
      "tz": "Asia/Tokyo",
      "lat": 35.68,
      "lon": 139.69,
      "houseSystem": "equal"
    },
    "expected": {
      "asc": 307.244,
      "mc": 235.847,
      "cusps": [
        307.244,
        337.244,
        7.244,
        37.244,
        67.244,
        97.244,
        127.244,
        157.244,
        187.244,
        217.244,
        247.244,
        277.244
      ],
      "planets": {
        "sun": 196.921,
        "moon": 249.0,
        "mercury": 192.811,
        "venus": 155.101,
        "mars": 135.014,
        "jupiter": 55.064,
        "saturn": 328.774,
        "uranus": 162.686,
        "neptune": 226.452,
        "pluto": 165.128,
        "northNode": 85.316
      }
    }
  },
  {
    "label": "倫敦 1985-07-13 12:00（英國夏令時間）",
    "input": {
      "year": 1985,
      "month": 7,
      "day": 13,
      "hour": 12,
      "minute": 0,
      "tz": "Europe/London",
      "lat": 51.51,
      "lon": -0.13,
      "houseSystem": "whole"
    },
    "expected": {
      "asc": 184.331,
      "mc": 95.637,
      "cusps": [
        180.0,
        210.0,
        240.0,
        270.0,
        300.0,
        330.0,
        0.0,
        30.0,
        60.0,
        90.0,
        120.0,
        150.0
      ],
      "planets": {
        "sun": 110.987,
        "moon": 58.305,
        "mercury": 137.522,
        "venus": 67.713,
        "mars": 112.403,
        "jupiter": 314.731,
        "saturn": 231.591,
        "uranus": 254.616,
        "neptune": 271.722,
        "pluto": 211.925,
        "northNode": 46.202
      }
    }
  },
  {
    "label": "紐約 2001-01-01 00:05",
    "input": {
      "year": 2001,
      "month": 1,
      "day": 1,
      "hour": 0,
      "minute": 5,
      "tz": "America/New_York",
      "lat": 40.71,
      "lon": -74.01,
      "houseSystem": "whole"
    },
    "expected": {
      "asc": 190.439,
      "mc": 102.107,
      "cusps": [
        180.0,
        210.0,
        240.0,
        270.0,
        300.0,
        330.0,
        0.0,
        30.0,
        60.0,
        90.0,
        120.0,
        150.0
      ],
      "planets": {
        "sun": 280.849,
        "moon": 351.27,
        "mercury": 284.615,
        "venus": 327.201,
        "mars": 215.062,
        "jupiter": 62.173,
        "saturn": 54.582,
        "uranus": 318.66,
        "neptune": 305.335,
        "pluto": 253.776,
        "northNode": 105.519
      }
    }
  },
  {
    "label": "雪梨 2000-03-01 06:45（南半球）",
    "input": {
      "year": 2000,
      "month": 3,
      "day": 1,
      "hour": 6,
      "minute": 45,
      "tz": "Australia/Sydney",
      "lat": -33.87,
      "lon": 151.21,
      "houseSystem": "whole"
    },
    "expected": {
      "asc": 340.12,
      "mc": 248.146,
      "cusps": [
        330.0,
        0.0,
        30.0,
        60.0,
        90.0,
        120.0,
        150.0,
        180.0,
        210.0,
        240.0,
        270.0,
        300.0
      ],
      "planets": {
        "sun": 340.53,
        "moon": 279.356,
        "mercury": 342.179,
        "venus": 314.356,
        "mars": 13.464,
        "jupiter": 32.638,
        "saturn": 42.392,
        "uranus": 318.141,
        "neptune": 305.361,
        "pluto": 252.841,
        "northNode": 123.208
      }
    }
  },
  {
    "label": "雷克雅維克 1995-12-21 18:00（高緯度、等宮制）",
    "input": {
      "year": 1995,
      "month": 12,
      "day": 21,
      "hour": 18,
      "minute": 0,
      "tz": "Atlantic/Reykjavik",
      "lat": 64.15,
      "lon": -21.94,
      "houseSystem": "equal"
    },
    "expected": {
      "asc": 117.178,
      "mc": 336.123,
      "cusps": [
        117.178,
        147.178,
        177.178,
        207.178,
        237.178,
        267.178,
        297.178,
        327.178,
        357.178,
        27.178,
        57.178,
        87.178
      ],
      "planets": {
        "sun": 269.394,
        "moon": 264.404,
        "mercury": 284.878,
        "venus": 299.98,
        "mars": 286.208,
        "jupiter": 267.145,
        "saturn": 348.783,
        "uranus": 298.788,
        "neptune": 294.309,
        "pluto": 241.593,
        "northNode": 204.276
      }
    }
  },
  {
    "label": "香港 1950-02-17 03:20",
    "input": {
      "year": 1950,
      "month": 2,
      "day": 17,
      "hour": 3,
      "minute": 20,
      "tz": "Asia/Hong_Kong",
      "lat": 22.32,
      "lon": 114.17,
      "houseSystem": "whole"
    },
    "expected": {
      "asc": 270.112,
      "mc": 191.29,
      "cusps": [
        270.0,
        300.0,
        330.0,
        0.0,
        30.0,
        60.0,
        90.0,
        120.0,
        150.0,
        180.0,
        210.0,
        240.0
      ],
      "planets": {
        "sun": 327.563,
        "moon": 325.818,
        "mercury": 302.408,
        "venus": 303.421,
        "mars": 190.909,
        "jupiter": 317.515,
        "saturn": 167.474,
        "uranus": 91.132,
        "neptune": 197.126,
        "pluto": 136.754,
        "northNode": 7.967
      }
    }
  },
  {
    "label": "洛杉磯 2020-11-03 23:59",
    "input": {
      "year": 2020,
      "month": 11,
      "day": 3,
      "hour": 23,
      "minute": 59,
      "tz": "America/Los_Angeles",
      "lat": 34.05,
      "lon": -118.24,
      "houseSystem": "whole"
    },
    "expected": {
      "asc": 142.822,
      "mc": 47.996,
      "cusps": [
        120.0,
        150.0,
        180.0,
        210.0,
        240.0,
        270.0,
        300.0,
        330.0,
        0.0,
        30.0,
        60.0,
        90.0
      ],
      "planets": {
        "sun": 222.358,
        "moon": 83.012,
        "mercury": 205.93,
        "venus": 188.828,
        "mars": 15.864,
        "jupiter": 291.522,
        "saturn": 296.401,
        "uranus": 38.533,
        "neptune": 348.332,
        "pluto": 292.719,
        "northNode": 80.328
      }
    }
  },
  {
    "label": "布宜諾斯艾利斯 1978-06-25 15:00（南半球）",
    "input": {
      "year": 1978,
      "month": 6,
      "day": 25,
      "hour": 15,
      "minute": 0,
      "tz": "America/Argentina/Buenos_Aires",
      "lat": -34.6,
      "lon": -58.38,
      "houseSystem": "whole"
    },
    "expected": {
      "asc": 230.416,
      "mc": 122.852,
      "cusps": [
        210.0,
        240.0,
        270.0,
        300.0,
        330.0,
        0.0,
        30.0,
        60.0,
        90.0,
        120.0,
        150.0,
        180.0
      ],
      "planets": {
        "sun": 93.809,
        "moon": 341.83,
        "mercury": 106.815,
        "venus": 131.127,
        "mars": 156.482,
        "jupiter": 104.521,
        "saturn": 146.722,
        "uranus": 222.592,
        "neptune": 256.478,
        "pluto": 193.899,
        "northNode": 181.005
      }
    }
  },
  {
    "label": "高雄 2025-02-03 22:10",
    "input": {
      "year": 2025,
      "month": 2,
      "day": 3,
      "hour": 22,
      "minute": 10,
      "tz": "Asia/Taipei",
      "lat": 22.63,
      "lon": 120.3,
      "houseSystem": "whole"
    },
    "expected": {
      "asc": 195.48,
      "mc": 105.491,
      "cusps": [
        180.0,
        210.0,
        240.0,
        270.0,
        300.0,
        330.0,
        0.0,
        30.0,
        60.0,
        90.0,
        120.0,
        150.0
      ],
      "planets": {
        "sun": 315.0,
        "moon": 22.062,
        "mercury": 310.734,
        "venus": 359.447,
        "mars": 109.736,
        "jupiter": 71.28,
        "saturn": 347.707,
        "uranus": 53.268,
        "neptune": 358.043,
        "pluto": 302.135,
        "northNode": 358.181
      }
    }
  },
  {
    "label": "新加坡 1982-01-01 00:00（時區變更日）",
    "input": {
      "year": 1982,
      "month": 1,
      "day": 1,
      "hour": 0,
      "minute": 0,
      "tz": "Asia/Singapore",
      "lat": 1.35,
      "lon": 103.82,
      "houseSystem": "whole"
    },
    "expected": {
      "asc": 173.326,
      "mc": 84.317,
      "cusps": [
        150.0,
        180.0,
        210.0,
        240.0,
        270.0,
        300.0,
        330.0,
        0.0,
        30.0,
        60.0,
        90.0,
        120.0
      ],
      "planets": {
        "sun": 279.902,
        "moon": 339.012,
        "mercury": 291.989,
        "venus": 308.901,
        "mars": 186.921,
        "jupiter": 216.025,
        "saturn": 201.43,
        "uranus": 242.673,
        "neptune": 265.136,
        "pluto": 206.683,
        "northNode": 112.466
      }
    }
  }
];
