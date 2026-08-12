# 角色館圖片轉檔：PNG → JPG（WIC，q85）。
# 吃 tools/import_book_characters.mjs 產出的轉檔計畫 JSON（[{src, dst}]，dst 相對 repo 根）。
# 用 WIC 不用 System.Drawing/GDI+（reference_windows_image_convert：GDI+ 對部分 PNG 會色偏）。
# 用法：pwsh -File tools/convert_book_characters.ps1 -Plan <plan.json>
param(
  [Parameter(Mandatory = $true)][string]$Plan
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName PresentationCore

$items = Get-Content -Raw -Encoding UTF8 $Plan | ConvertFrom-Json
$done = 0
foreach ($it in $items) {
  if (-not (Test-Path $it.src)) { throw "來源不存在：$($it.src)" }
  $dstDir = Split-Path $it.dst -Parent
  if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Force $dstDir | Out-Null }

  $fs = [System.IO.File]::OpenRead($it.src)
  try {
    $decoder = [System.Windows.Media.Imaging.BitmapDecoder]::Create($fs,
      [System.Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat,
      [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad)
    $frame = $decoder.Frames[0]
    $encoder = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder
    $encoder.QualityLevel = 85
    $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($frame))
    $out = [System.IO.File]::Create($it.dst)
    try { $encoder.Save($out) } finally { $out.Dispose() }
    $done++
    "{0} → {1} ({2:N0} KB)" -f (Split-Path $it.src -Leaf), $it.dst, ((Get-Item $it.dst).Length / 1KB)
  } finally { $fs.Dispose() }
}
"完成：$done / $($items.Count) 張"
