import json, sys, sxtwl, swisseph as swe
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
GAN='甲乙丙丁戊己庚辛壬癸'; ZHI='子丑寅卯辰巳午未申酉戌亥'
gz=lambda g: GAN[g.tg]+ZHI[g.dz]
CASES=[
 ('台北 1990-06-15 14:30',1990,6,15,14,30,'Asia/Taipei'),
 ('台北 2025-02-03 21:00（立春前）',2025,2,3,21,0,'Asia/Taipei'),
 ('台北 2025-02-03 22:30（立春後）',2025,2,3,22,30,'Asia/Taipei'),
 ('台北 2025-02-03 23:30（立春後＋23 點換日）',2025,2,3,23,30,'Asia/Taipei'),
 ('台北 2024-03-05 09:30（驚蟄前）',2024,3,5,9,30,'Asia/Taipei'),
 ('台北 2024-03-05 11:30（驚蟄後）',2024,3,5,11,30,'Asia/Taipei'),
 ('台北 1999-12-31 23:59（跨年夜 23 點換日）',1999,12,31,23,59,'Asia/Taipei'),
 ('台北 2000-01-01 00:30（早子時）',2000,1,1,0,30,'Asia/Taipei'),
 ('上海 1949-10-01 15:00',1949,10,1,15,0,'Asia/Shanghai'),
 ('台北 1901-03-15 12:00（二十世紀初）',1901,3,15,12,0,'Asia/Taipei'),
 ('台北 2050-08-08 08:08（本世紀中）',2050,8,8,8,8,'Asia/Taipei'),
 ('香港 1960-12-31 12:00',1960,12,31,12,0,'Asia/Hong_Kong'),
 ('台北 2010-05-20 06:15',2010,5,20,6,15,'Asia/Taipei'),
 ('東京 1988-11-07 18:00（立冬日）',1988,11,7,18,0,'Asia/Tokyo'),
]
def jd_ut(dt):
    u=dt.astimezone(ZoneInfo('UTC')); return swe.julday(u.year,u.month,u.day,u.hour+u.minute/60)
def sunlon(jd): return swe.calc_ut(jd, swe.SUN, swe.FLG_MOSEPH)[0][0]
out=[]
for label,y,mo,d,h,mi,tz in CASES:
    local=datetime(y,mo,d,h,mi,tzinfo=ZoneInfo(tz)); jd=jd_ut(local)
    # 年／月：sxtwl 以北京時間（UT+8）的日期判斷；節氣當日再依精確時刻修正
    bj=local.astimezone(ZoneInfo('Asia/Shanghai'))
    day=sxtwl.fromSolar(bj.year,bj.month,bj.day)
    yg, mg = day.getYearGZ(), day.getMonthGZ()
    if day.hasJieQi() and day.getJieQi()%2==1:   # 奇數＝「節」（立春=3…），月份在節的時刻切換
        tjd=day.getJieQiJD()                      # 北京時間 JD
        t=sxtwl.JD2DD(tjd); term=datetime(int(t.Y),int(t.M),int(t.D),tzinfo=ZoneInfo("Asia/Shanghai"))+timedelta(hours=t.h,minutes=t.m,seconds=t.s)
        if bj < term:
            prev=sxtwl.fromSolar(*( (bj-timedelta(days=1)).timetuple()[:3] ))
            yg, mg = prev.getYearGZ(), prev.getMonthGZ()
    # 交叉：Swiss Ephemeris 太陽黃經推月支（寅＝315°起，每 30°）
    sl=sunlon(jd); zhi_from_swe=(int(((sl-315)%360)//30)+2)%12
    assert ZHI[zhi_from_swe]==ZHI[mg.dz], (label, sl, gz(mg))
    # 日／時：23 點換日（zi23）
    dd=local+timedelta(days=1) if h>=23 else local
    dday=sxtwl.fromSolar(dd.year,dd.month,dd.day)
    hg=dday.getHourGZ(0 if h>=23 else h)
    out.append(dict(label=label,input=dict(year=y,month=mo,day=d,hour=h,minute=mi,tz=tz,gender='male'),
      expected=dict(year=gz(yg),month=gz(mg),day=gz(dday.getDayGZ()),hour=gz(hg)),sunLon=round(sl,3)))
json.dump(out,sys.stdout,ensure_ascii=False,indent=1)
