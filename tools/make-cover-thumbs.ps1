# make-cover-thumbs.ps1
# 用途：掃描 _posts/*.md 與 *.html front matter 的 cover_image（僅 .jpg/.jpeg，不分大小寫），
#       為每張在同目錄產生「同名-card.jpg」縮圖（寬 640px 等比縮放、JPEG QualityLevel 82），
#       供文章列表卡片使用——避免列表頁載入平均 216KB／最大 1.7MB 的原圖當縮圖。
#       .png／.svg 封面略過；檔名含 .original. 的來源略過。
# 用法：pwsh -File tools/make-cover-thumbs.ps1（可重複執行，任何工作目錄皆可，
#       內部以 repo 根目錄為路徑基準）。
# 冪等：目標檔已存在且 mtime 不早於來源就跳過，適合日後新增文章後重跑。
# 圖像轉檔一律用 PowerShell WIC（BitmapFrame/TransformedBitmap/JpegBitmapEncoder），
#       不用 python、不用 System.Drawing 解碼 PNG（本專案慣例——GDI+ 對部分 PNG 解碼失敗）。

Add-Type -AssemblyName PresentationCore, WindowsBase

$repo = Split-Path $PSScriptRoot -Parent
$postsDir = Join-Path $repo '_posts'

$targetWidth = 640
$quality = 82

$created = 0
$skipped = 0
$failed = 0
$failures = @()
$orientedCount = 0

function Get-CoverImagePath([string]$postFile) {
  $lines = Get-Content -LiteralPath $postFile -Encoding UTF8
  if ($lines.Count -eq 0 -or $lines[0].Trim() -ne '---') { return $null }
  $end = -1
  for ($i = 1; $i -lt $lines.Count; $i++) {
    if ($lines[$i].Trim() -eq '---') { $end = $i; break }
  }
  if ($end -lt 0) { return $null }
  for ($i = 1; $i -lt $end; $i++) {
    if ($lines[$i] -match '^\s*cover_image:\s*(.+?)\s*$') {
      $val = $Matches[1].Trim()
      $val = $val.Trim('"').Trim("'")
      return $val
    }
  }
  return $null
}

$posts = Get-ChildItem -Path $postsDir -File | Where-Object { $_.Extension -in '.md', '.html' }

foreach ($post in $posts) {
  $cover = Get-CoverImagePath $post.FullName
  if (-not $cover) { continue }
  if ($cover -match '^https?://') { continue }
  if ($cover -notmatch '\.jpe?g$') { continue }
  if ($cover -match '\.original\.') { continue }

  $relPath = $cover.TrimStart('/')
  $srcPath = Join-Path $repo ($relPath -replace '/', '\')

  if (-not (Test-Path -LiteralPath $srcPath)) {
    $failed++
    $failures += "MISSING SOURCE: $relPath (from $($post.Name))"
    continue
  }

  $dir = Split-Path $srcPath -Parent
  $base = [System.IO.Path]::GetFileNameWithoutExtension($srcPath)
  $dstPath = Join-Path $dir "$base-card.jpg"

  if (Test-Path -LiteralPath $dstPath) {
    $srcTime = (Get-Item -LiteralPath $srcPath).LastWriteTimeUtc
    $dstTime = (Get-Item -LiteralPath $dstPath).LastWriteTimeUtc
    if ($dstTime -ge $srcTime) {
      $skipped++
      continue
    }
  }

  try {
    $uri = New-Object System.Uri((Resolve-Path -LiteralPath $srcPath).Path)
    $frame = [System.Windows.Media.Imaging.BitmapFrame]::Create($uri, 'None', 'OnLoad')
    $w = $frame.PixelWidth
    $h = $frame.PixelHeight

    # EXIF orientation：WIC 不會自動旋轉，重編碼又會丟 metadata，故偵測並手動轉正。
    $rotate = 0
    try {
      $orient = $frame.Metadata.GetQuery('/app1/ifd/exif:{ushort=274}')
      if ($orient -eq 3) { $rotate = 180 }
      elseif ($orient -eq 6) { $rotate = 90 }
      elseif ($orient -eq 8) { $rotate = 270 }
    } catch {}

    $srcForScale = $frame
    if ($rotate -ne 0) {
      $orientedCount++
      $rt = New-Object System.Windows.Media.RotateTransform($rotate)
      $srcForScale = New-Object System.Windows.Media.Imaging.TransformedBitmap($frame, $rt)
      $w = $srcForScale.PixelWidth
      $h = $srcForScale.PixelHeight
    }

    if ($w -le $targetWidth) {
      $outBitmap = $srcForScale
    } else {
      $scale = $targetWidth / $w
      $st = New-Object System.Windows.Media.ScaleTransform($scale, $scale)
      $outBitmap = New-Object System.Windows.Media.Imaging.TransformedBitmap($srcForScale, $st)
      if ($outBitmap.PixelWidth -ne $targetWidth) {
        Write-Output ("NOTE 縮放後寬度非 640：{0} -> {1}" -f $relPath, $outBitmap.PixelWidth)
      }
    }

    $enc = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder
    $enc.QualityLevel = $quality
    $enc.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($outBitmap))
    $outStream = [System.IO.File]::Create($dstPath)
    try { $enc.Save($outStream) } finally { $outStream.Dispose() }

    $created++
  } catch {
    $failed++
    $failures += "FAILED: $relPath ($($_.Exception.Message))"
  }
}

Write-Output ("新建 {0}／跳過 {1}／失敗 {2}" -f $created, $skipped, $failed)
Write-Output ("偵測到 EXIF 旋轉並校正：{0} 張" -f $orientedCount)
if ($failures.Count -gt 0) {
  Write-Output '失敗清單:'
  $failures | ForEach-Object { Write-Output "  $_" }
}
