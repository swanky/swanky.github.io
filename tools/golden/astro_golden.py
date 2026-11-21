import json, sys, swisseph as swe
from datetime import datetime
from zoneinfo import ZoneInfo
CASES = [
 ('台北 1990-06-15 14:30', 1990,6,15,14,30,'Asia/Taipei',25.03,121.57,'whole'),
 ('台北 1975-07-10 09:00（台灣夏令時間）', 1975,7,10,9,0,'Asia/Taipei',25.03,121.57,'whole'),
 ('東京 1964-10-10 14:00（等宮制）', 1964,10,10,14,0,'Asia/Tokyo',35.68,139.69,'equal'),
 ('倫敦 1985-07-13 12:00（英國夏令時間）', 1985,7,13,12,0,'Europe/London',51.51,-0.13,'whole'),
 ('紐約 2001-01-01 00:05', 2001,1,1,0,5,'America/New_York',40.71,-74.01,'whole'),
 ('雪梨 2000-03-01 06:45（南半球）', 2000,3,1,6,45,'Australia/Sydney',-33.87,151.21,'whole'),
 ('雷克雅維克 1995-12-21 18:00（高緯度、等宮制）', 1995,12,21,18,0,'Atlantic/Reykjavik',64.15,-21.94,'equal'),
 ('香港 1950-02-17 03:20', 1950,2,17,3,20,'Asia/Hong_Kong',22.32,114.17,'whole'),
 ('洛杉磯 2020-11-03 23:59', 2020,11,3,23,59,'America/Los_Angeles',34.05,-118.24,'whole'),
 ('布宜諾斯艾利斯 1978-06-25 15:00（南半球）', 1978,6,25,15,0,'America/Argentina/Buenos_Aires',-34.60,-58.38,'whole'),
 ('高雄 2025-02-03 22:10', 2025,2,3,22,10,'Asia/Taipei',22.63,120.30,'whole'),
 ('新加坡 1982-01-01 00:00（時區變更日）', 1982,1,1,0,0,'Asia/Singapore',1.35,103.82,'whole'),
]
P = [('sun',swe.SUN),('moon',swe.MOON),('mercury',swe.MERCURY),('venus',swe.VENUS),('mars',swe.MARS),('jupiter',swe.JUPITER),('saturn',swe.SATURN),('uranus',swe.URANUS),('neptune',swe.NEPTUNE),('pluto',swe.PLUTO),('northNode',swe.TRUE_NODE)]
out = []
for label,y,mo,d,h,mi,tz,lat,lon,hs in CASES:
    utc = datetime(y,mo,d,h,mi,tzinfo=ZoneInfo(tz)).astimezone(ZoneInfo('UTC'))
    jd = swe.julday(utc.year,utc.month,utc.day,utc.hour+utc.minute/60+utc.second/3600)
    cusps, ascmc = swe.houses(jd, lat, lon, b'W' if hs=='whole' else b'E')
    planets = {k: round(swe.calc_ut(jd, b, swe.FLG_MOSEPH)[0][0], 3) for k,b in P}
    out.append(dict(label=label, input=dict(year=y,month=mo,day=d,hour=h,minute=mi,tz=tz,lat=lat,lon=lon,houseSystem=hs),
      expected=dict(asc=round(ascmc[0],3), mc=round(ascmc[1],3), cusps=[round(c,3) for c in cusps[:12]], planets=planets), utc=utc.isoformat()))
json.dump(out, sys.stdout, ensure_ascii=False, indent=1)
