# Generate Open Graph (1200x630) preview images for each page
# Uses Thai-capable font (Leelawadee UI, built-in on Windows)

Add-Type -AssemblyName System.Drawing

$outDir = $PSScriptRoot

# ── Thai modern palette ──
$bgColor       = [System.Drawing.Color]::FromArgb(255, 250, 247, 242)  # jasmine cream
$primaryColor  = [System.Drawing.Color]::FromArgb(255, 233, 113, 50)   # saffron
$goldColor     = [System.Drawing.Color]::FromArgb(255, 212, 164, 55)   # gold
$textDark      = [System.Drawing.Color]::FromArgb(255, 31, 26, 20)
$textMuted     = [System.Drawing.Color]::FromArgb(255, 95, 80, 65)

# Load logo icon
$logoPath = Join-Path $outDir 'logo-icon.png'
$logoImg  = [System.Drawing.Image]::FromFile($logoPath)

# ── Pages to generate ──
$pages = @(
  @{ file='og-home.png';     title='thaiimg.com'; subtitle='แปลง บีบอัด ครอบตัด ปรับแต่งรูปภาพออนไลน์ฟรี'; tag='เครื่องมือรูปภาพออนไลน์' },
  @{ file='og-convert.png';  title='แปลงรูปเป็น JPG'; subtitle='แปลง PNG, WEBP, HEIC เป็น JPG ฟรี'; tag='เครื่องมือแปลงไฟล์' },
  @{ file='og-topng.png';    title='แปลงรูปเป็น PNG'; subtitle='รักษาพื้นหลังโปร่งใส ฟรี ไม่ต้องอัพโหลด'; tag='เครื่องมือแปลงไฟล์' },
  @{ file='og-towebp.png';   title='แปลงรูปเป็น WEBP'; subtitle='ลดขนาดไฟล์ 70% โดยคงคุณภาพ'; tag='เครื่องมือแปลงไฟล์' },
  @{ file='og-topdf.png';    title='แปลงรูปเป็น PDF'; subtitle='รวมรูปหลายใบเป็น PDF เล่มเดียว'; tag='เครื่องมือแปลงไฟล์' },
  @{ file='og-togif.png';    title='สร้าง GIF Animation'; subtitle='สร้างภาพเคลื่อนไหวจากรูปหลายใบ'; tag='เครื่องมือแปลงไฟล์' },
  @{ file='og-tosvg.png';    title='แปลงรูปเป็น SVG'; subtitle='ใช้กับเว็บไซต์และงานออกแบบ'; tag='เครื่องมือแปลงไฟล์' },
  @{ file='og-fromheic.png'; title='แปลง HEIC เป็น JPG'; subtitle='แปลงไฟล์รูปจาก iPhone, iPad ฟรี'; tag='เครื่องมือแปลงไฟล์' },
  @{ file='og-compress.png'; title='บีบอัดรูปภาพ'; subtitle='ลดขนาดไฟล์ 50-90% โดยคงคุณภาพ'; tag='จัดการรูป' },
  @{ file='og-resize.png';   title='ปรับขนาดรูปภาพ'; subtitle='ย่อ-ขยายรูปในคลิกเดียว'; tag='จัดการรูป' },
  @{ file='og-crop.png';     title='ครอบตัดรูปภาพ'; subtitle='ตัดภาพเฉพาะส่วนที่ต้องการ'; tag='จัดการรูป' },
  @{ file='og-edit.png';     title='ปรับแต่งภาพถ่าย'; subtitle='ฟิลเตอร์ ลายน้ำ ลบพื้นหลัง AI'; tag='Photo Editor' }
)

foreach ($p in $pages) {
  $bmp = New-Object System.Drawing.Bitmap 1200, 630
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  # Background — solid jasmine cream
  $g.Clear($bgColor)

  # Left accent bar (saffron)
  $accentBrush = New-Object System.Drawing.SolidBrush $primaryColor
  $g.FillRectangle($accentBrush, 0, 0, 16, 630)

  # Decorative gold dots in bottom right corner
  $goldBrush = New-Object System.Drawing.SolidBrush $goldColor
  for ($i = 0; $i -lt 5; $i++) {
    $g.FillEllipse($goldBrush, (1050 + $i * 28), (560 - $i * 14), 8, 8)
  }

  # Soft saffron circle in top right (decorative)
  $softSaffron = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 233, 113, 50))
  $g.FillEllipse($softSaffron, 950, -120, 360, 360)

  # Logo (top-left area)
  $logoSize = 96
  $g.DrawImage($logoImg, 80, 90, $logoSize, $logoSize)

  # Brand text next to logo
  $brandFont = New-Object System.Drawing.Font 'Leelawadee UI', 28, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $brandBrush = New-Object System.Drawing.SolidBrush $primaryColor
  $g.DrawString('thaiimg.com', $brandFont, $brandBrush, 192, 110)

  # Small tag below brand
  $tagFont = New-Object System.Drawing.Font 'Leelawadee UI', 18, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  $tagBrush = New-Object System.Drawing.SolidBrush $textMuted
  $g.DrawString($p.tag, $tagFont, $tagBrush, 192, 150)

  # Main title (huge, centered vertically in lower area)
  $titleFont = New-Object System.Drawing.Font 'Leelawadee UI', 72, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $titleBrush = New-Object System.Drawing.SolidBrush $textDark

  # Wrap title if too long
  $titleSize = $g.MeasureString($p.title, $titleFont)
  $titleX = 80
  $titleY = 290
  $g.DrawString($p.title, $titleFont, $titleBrush, $titleX, $titleY)

  # Subtitle
  $subFont = New-Object System.Drawing.Font 'Leelawadee UI', 32, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  $subBrush = New-Object System.Drawing.SolidBrush $textMuted
  $subY = $titleY + $titleSize.Height + 16
  $g.DrawString($p.subtitle, $subFont, $subBrush, 80, $subY)

  # Bottom badge "ฟรี · ไม่อัพโหลด · ปลอดภัย"
  $badgeFont = New-Object System.Drawing.Font 'Leelawadee UI', 22, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $badgeBrush = New-Object System.Drawing.SolidBrush $primaryColor
  $g.DrawString('● ฟรี   ● ไม่ต้องอัพโหลด   ● ปลอดภัย 100%', $badgeFont, $badgeBrush, 80, 540)

  # Save
  $outPath = Join-Path $outDir $p.file
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Host "Generated: $($p.file)"

  $g.Dispose()
  $bmp.Dispose()
  $brandFont.Dispose()
  $titleFont.Dispose()
  $subFont.Dispose()
  $tagFont.Dispose()
  $badgeFont.Dispose()
}

$logoImg.Dispose()
Write-Host "`nDone. Generated $($pages.Count) OG images."
