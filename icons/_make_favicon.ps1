Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile('D:\Website\Thaiimg\Website\icons\logo.png')

# Crop a tighter square around the icon (avoid the "thaiimg" wordmark)
# Logo is 1703x608; icon sits in the leftmost portion
$cropW = 480
$cropH = 480
$cropX = 50
$cropY = ($src.Height - $cropH) / 2

$crop = New-Object System.Drawing.Bitmap $cropW, $cropH
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
$dstRect = New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH
$g.DrawImage($src, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

# Save as multiple favicon sizes
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
