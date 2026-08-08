# 金瓶梅宇宙圖像資產轉檔：來源 PNG（本機專案）→ 站內 JPG（q85）
# 一次性匯入工具；來源路徑為機器特定。以 WIC 轉檔（專案慣例，不用 GDI+）。
# 透明像素保護：turnaround 合成白底，其餘合成站底色 #0e0d0b。
Add-Type -AssemblyName PresentationCore

$repo = Split-Path $PSScriptRoot -Parent
$design = 'C:\cc_home\godot-test\project-plum-steam\docs\design\梅香境_新版女角設計'
$lab = 'C:\cc_home\novel-characters-lab\jinpingmei-full'
$boards = 'C:\cc_home\godot-test\project-plum-steam\docs\planning\金瓶異夢_120秒擬真電影版_20260726\storyboards\scope-2.39'

function Convert-ToJpg([string]$src, [string]$dst, [string]$bg) {
  $s = [System.IO.File]::OpenRead($src)
  try {
    $frame = [System.Windows.Media.Imaging.BitmapDecoder]::Create($s, 'None', 'Default').Frames[0]
    $w = $frame.PixelWidth; $h = $frame.PixelHeight
    $dv = New-Object System.Windows.Media.DrawingVisual
    $dc = $dv.RenderOpen()
    $brush = New-Object System.Windows.Media.SolidColorBrush ([System.Windows.Media.ColorConverter]::ConvertFromString($bg))
    $rect = New-Object System.Windows.Rect 0, 0, $w, $h
    $dc.DrawRectangle($brush, $null, $rect)
    $dc.DrawImage($frame, $rect)
    $dc.Close()
    $rtb = New-Object System.Windows.Media.Imaging.RenderTargetBitmap $w, $h, 96, 96, ([System.Windows.Media.PixelFormats]::Pbgra32)
    $rtb.Render($dv)
    $enc = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder
    $enc.QualityLevel = 85
    $enc.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($rtb))
    $dir = Split-Path $dst -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
    $out = [System.IO.File]::Create($dst)
    try { $enc.Save($out) } finally { $out.Dispose() }
    Write-Output ("OK {0} ({1}x{2})" -f (Split-Path $dst -Leaf), $w, $h)
  } finally { $s.Dispose() }
}

$slugs = @{ '西門慶'='ximenqing'; '吳月娘'='wuyueniang'; '李瓶兒'='lipinger'; '李嬌兒'='lijiaoer'; '孟玉樓'='mengyulou'; '春梅'='chunmei'; '孫雪娥'='sunxuee'; '陳經濟'='chenjingji'; '潘金蓮'='panjinlian'; '應伯爵'='yingbojue' }

# 1. 角色三視圖（白底）
foreach ($name in $slugs.Keys) {
  Convert-ToJpg "$lab\images\$name-turnaround.png" "$repo\assets\img\jinpingmei\turnaround\$($slugs[$name]).jpg" '#FFFFFF'
}

# 2. 真人選角母版
$masters = @{ '潘金蓮'='panjinlian'; '李瓶兒'='lipinger'; '吳月娘'='wuyueniang'; '龐春梅'='chunmei'; '宋惠蓮'='songhuilian' }
foreach ($name in $masters.Keys) {
  Convert-ToJpg "$lab\live-action-five\masters\$name-master.png" "$repo\assets\img\jinpingmei\live-action\$($masters[$name])-master.jpg" '#0e0d0b'
}

# 3. 遊戲版個人形象（標準版＋成熟感官版＋兩張總覽）
$figures = @(
  @('個人形象圖_標準版\01_潘金蓮_漆廊折扇.png', 'panjinlian-standard.jpg'),
  @('個人形象圖_標準版\02_李瓶兒_瓷水藥庭.png', 'lipinger-standard.jpg'),
  @('個人形象圖_標準版\03_吳月娘_門鑰中樞.png', 'wuyueniang-standard.jpg'),
  @('個人形象圖_標準版\04_龐春梅_高階梅槍.png', 'chunmei-standard.jpg'),
  @('個人形象圖_標準版\05_宋惠蓮_契火帳房.png', 'songhuilian-standard.jpg'),
  @('個人形象圖_標準版\00_五人獨立形象圖_標準版總覽.png', 'overview-standard.jpg'),
  @('個人形象圖_成熟感官版\01_潘金蓮_漆廊感官版.png', 'panjinlian-sensual.jpg'),
  @('個人形象圖_成熟感官版\02_李瓶兒_瓷水感官版.png', 'lipinger-sensual.jpg'),
  @('個人形象圖_成熟感官版\03_吳月娘_門鑰感官版.png', 'wuyueniang-sensual.jpg'),
  @('個人形象圖_成熟感官版\04_龐春梅_梅槍感官版.png', 'chunmei-sensual.jpg'),
  @('個人形象圖_成熟感官版\05_宋惠蓮_契火感官版.png', 'songhuilian-sensual.jpg'),
  @('個人形象圖_成熟感官版\00_五人獨立形象圖_成熟感官版總覽.png', 'overview-sensual.jpg')
)
foreach ($f in $figures) {
  Convert-ToJpg "$design\$($f[0])" "$repo\assets\img\jinpingmei\figures\$($f[1])" '#0e0d0b'
}

# 4. 影像工作室：分鏡（以 DC 前綴對映）＋contact sheet＋選角迭代示例
Get-ChildItem "$boards\*.png" | ForEach-Object {
  if ($_.Name -match '^(DC\d{2})-([AB])') {
    $slug = ($Matches[1] + $Matches[2]).ToLower()
    Convert-ToJpg $_.FullName "$repo\assets\img\jinpingmei\studio\board-$slug.jpg" '#0e0d0b'
  }
}
Convert-ToJpg "$lab\casting-master-rnd\series-contact-sheet-v001.png" "$repo\assets\img\jinpingmei\studio\casting-contact-sheet.jpg" '#0e0d0b'
Convert-ToJpg "$lab\casting-master-rnd\pan-jinlian\identity-compare-v004.png" "$repo\assets\img\jinpingmei\studio\identity-compare-sample.jpg" '#0e0d0b'

Write-Output '--- done ---'
