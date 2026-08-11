# 金瓶梅角色多角度參考圖轉檔：來源 PNG（本機專案 _current）→ 站內 JPG（q85）
# 一次性匯入工具；來源路徑為機器特定。以 WIC 轉檔（專案慣例，不用 GDI+）。
# 透明像素保護：合成站底色 #0e0d0b。
Add-Type -AssemblyName PresentationCore

$repo = Split-Path $PSScriptRoot -Parent
$src = 'C:\cc_home\novel-characters-lab\jinpingmei-full\_current\characters\reference-packs'

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

# reference pack slug（來源目錄名）→ 站內角色 slug
$packs = @{ 'pan-jinlian' = 'panjinlian'; 'li-pinger' = 'lipinger'; 'pang-chun-mei' = 'chunmei' }
$angles = @(
  'face-front', 'face-left-three-quarter', 'face-right-three-quarter', 'face-left-profile', 'face-right-profile',
  'body-front', 'body-back', 'body-left-profile', 'body-right-profile'
)

foreach ($pack in $packs.Keys) {
  foreach ($angle in $angles) {
    Convert-ToJpg "$src\$pack\$angle.png" "$repo\assets\img\jinpingmei\reference\$($packs[$pack])-$angle.jpg" '#0e0d0b'
  }
}

Write-Output '--- done ---'
