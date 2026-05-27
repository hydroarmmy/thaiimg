# Generate Open Graph (1200x630) preview images for each page.
# Thai text is read from og_config.json with explicit UTF-8 encoding
# to avoid Windows codepage mojibake.

Add-Type -AssemblyName System.Drawing
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$outDir = $PSScriptRoot
$cfgPath = Join-Path $outDir 'og_config.json'

# Read JSON with explicit UTF-8 (Get-Content -Raw -Encoding UTF8 works in PS 5.1)
$jsonText = [System.IO.File]::ReadAllText($cfgPath, [System.Text.Encoding]::UTF8)
$cfg   = $jsonText | ConvertFrom-Json
$pages = $cfg.pages
$brand = [string]$cfg.brand
$badge = [string]$cfg.badge

# ── Thai modern palette ──
$bgColor      = [System.Drawing.Color]::FromArgb(255, 250, 247, 242)
$primaryColor = [System.Drawing.Color]::FromArgb(255, 233, 113, 50)
$goldColor    = [System.Drawing.Color]::FromArgb(255, 212, 164, 55)
$textDark     = [System.Drawing.Color]::FromArgb(255, 31, 26, 20)
$textMuted    = [System.Drawing.Color]::FromArgb(255, 95, 80, 65)

$logoPath = Join-Path $outDir 'logo-icon.png'
$logoImg  = [System.Drawing.Image]::FromFile($logoPath)

# Try a Thai-capable font (Leelawadee UI is built-in on Windows 8+)
$fontFamily = 'Leelawadee UI'
try {
  $testFont = New-Object System.Drawing.Font $fontFamily, 16
  $testFont.Dispose()
} catch {
  Write-Host "Leelawadee UI not found, falling back to Tahoma"
  $fontFamily = 'Tahoma'
}

foreach ($p in $pages) {
  $bmp = New-Object System.Drawing.Bitmap 1200, 630
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  # Background
  $g.Clear($bgColor)

  # Left accent bar
  $accentBrush = New-Object System.Drawing.SolidBrush $primaryColor
  $g.FillRectangle($accentBrush, 0, 0, 16, 630)

  # Decorative gold dots, bottom-right
  $goldBrush = New-Object System.Drawing.SolidBrush $goldColor
  for ($i = 0; $i -lt 5; $i++) {
    $g.FillEllipse($goldBrush, (1050 + $i * 28), (560 - $i * 14), 8, 8)
  }

  # Soft saffron circle, top-right
  $softSaffron = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 233, 113, 50))
  $g.FillEllipse($softSaffron, 950, -120, 360, 360)

  # Logo
  $g.DrawImage($logoImg, 80, 90, 96, 96)

  # Brand text
  $brandFont = New-Object System.Drawing.Font $fontFamily, 28, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $brandBrush = New-Object System.Drawing.SolidBrush $primaryColor
  $g.DrawString($brand, $brandFont, $brandBrush, 192, 110)

  # Tag
  $tagFont = New-Object System.Drawing.Font $fontFamily, 18, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  $tagBrush = New-Object System.Drawing.SolidBrush $textMuted
  $g.DrawString([string]$p.tag, $tagFont, $tagBrush, 192, 150)

  # Title
  $titleFont = New-Object System.Drawing.Font $fontFamily, 64, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $titleBrush = New-Object System.Drawing.SolidBrush $textDark
  $titleStr = [string]$p.title
  $titleSize = $g.MeasureString($titleStr, $titleFont)
  $titleY = 290
  $g.DrawString($titleStr, $titleFont, $titleBrush, 80, $titleY)

  # Subtitle
  $subFont = New-Object System.Drawing.Font $fontFamily, 30, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  $subBrush = New-Object System.Drawing.SolidBrush $textMuted
  $subY = $titleY + $titleSize.Height + 12
  $g.DrawString([string]$p.subtitle, $subFont, $subBrush, 80, $subY)

  # Bottom badge
  $badgeFont = New-Object System.Drawing.Font $fontFamily, 22, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $badgeBrush = New-Object System.Drawing.SolidBrush $primaryColor
  $g.DrawString($badge, $badgeFont, $badgeBrush, 80, 540)

  $outPath = Join-Path $outDir $p.file
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Host ("Generated: " + $p.file)

  $g.Dispose()
  $bmp.Dispose()
  $brandFont.Dispose()
  $titleFont.Dispose()
  $subFont.Dispose()
  $tagFont.Dispose()
  $badgeFont.Dispose()
}

$logoImg.Dispose()
Write-Host ("`nDone. Generated " + $pages.Count + " OG images.")
