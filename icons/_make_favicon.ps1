Add-Type -AssemblyName System.Drawing
# Use the dedicated square icon if it exists; fall back to cropping from logo.png
$iconPath = 'D:\Website\Thaiimg\Website\icons\logo-icon.png'
$bannerPath = 'D:\Website\Thaiimg\Website\icons\logo.png'

if (Test-Path $iconPath) {
  $src = [System.Drawing.Image]::FromFile($iconPath)
  $crop = New-Object System.Drawing.Bitmap $src.Width, $src.Height
  $g = [System.Drawing.Graphics]::FromImage($crop)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($src, 0, 0, $src.Width, $src.Height)
  $g.Dispose()
  Write-Host "Source: logo-icon.png ($($src.Width)x$($src.Height))"
} else {
  # Fallback — crop leftmost ~480px from the wide banner
  $src = [System.Drawing.Image]::FromFile($bannerPath)
  $cropW = 480; $cropH = 480; $cropX = 50
  $cropY = ($src.Height - $cropH) / 2
  $crop = New-Object System.Drawing.Bitmap $cropW, $cropH
  $g = [System.Drawing.Graphics]::FromImage($crop)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
  $dstRect = New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH
  $g.DrawImage($src, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  Write-Host "Source: logo.png cropped"
}

$sizes = @(512, 192, 180, 32)
foreach ($s in $sizes) {
    $out = New-Object System.Drawing.Bitmap $s, $s
    $g = [System.Drawing.Graphics]::FromImage($out)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($crop, 0, 0, $s, $s)
    $g.Dispose()
    $out.Save("D:\Website\Thaiimg\Website\icons\favicon-$s.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $out.Dispose()
    Write-Host "Saved favicon-$s.png ($s x $s)"
}
$crop.Dispose()
$src.Dispose()
