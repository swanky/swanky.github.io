<#
  看懂寫真：把館藏頁另存的作品圖縮成「評論引用小圖」。
  長邊 600、JPEG q80、等比完整（不裁切、不疊字）、不帶中繼資料（重新編碼只寫像素）。
  用法：pwsh -File tools/photo-learn-quote-image.ps1 -In <本機檔> -Out assets/img/photo-learn/works/<頁 slug>/<nn>-<作品 slug>.jpg
  規則：docs/photography-study-zone-review-2026-10.md §2.2、§2.5。輸出尺寸會印出來，填進 works[] 的 img_w／img_h。
#>
param(
  [Parameter(Mandatory = $true)][string]$In,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$Max = 600,
  [int]$Quality = 80
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName PresentationCore, WindowsBase
$src = (Resolve-Path -LiteralPath $In).Path
$outFull = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Out)
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $outFull) | Out-Null

$frame = [System.Windows.Media.Imaging.BitmapFrame]::Create([Uri]$src, 'None', 'OnLoad')
$w = $frame.PixelWidth; $h = $frame.PixelHeight
$scale = [Math]::Min(1.0, $Max / [double][Math]::Max($w, $h))
$bmp = $frame
if ($scale -lt 1.0) {
  $bmp = New-Object System.Windows.Media.Imaging.TransformedBitmap($frame, (New-Object System.Windows.Media.ScaleTransform($scale, $scale)))
}
# 轉成不透明 BGR24（去 alpha；來源是灰階／CMYK／索引色也一律標準化）
$conv = New-Object System.Windows.Media.Imaging.FormatConvertedBitmap($bmp, [System.Windows.Media.PixelFormats]::Bgr24, $null, 0)
$enc = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder
$enc.QualityLevel = $Quality
# 只放像素，不帶來源的 metadata（EXIF／XMP／GPS）
$enc.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($conv))
$fs = [System.IO.File]::Create($outFull)
try { $enc.Save($fs) } finally { $fs.Dispose() }

$chk = [System.Windows.Media.Imaging.BitmapFrame]::Create([Uri]$outFull, 'None', 'OnLoad')
"{0}  {1}x{2}  (來源 {3}x{4})  {5} bytes" -f $Out, $chk.PixelWidth, $chk.PixelHeight, $w, $h, (Get-Item -LiteralPath $outFull).Length
