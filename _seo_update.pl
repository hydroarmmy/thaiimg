#!/usr/bin/perl
use strict;
use warnings;
use utf8;
use open ':std', ':encoding(UTF-8)';

# ── Page metadata table ──
my %pages = (
  'index.html' => {
    path  => '/',
    title => 'thaiimg.com — แปลง บีบอัด ครอบตัด ปรับแต่งรูปภาพออนไลน์ฟรี ไม่ต้องอัพโหลด',
    desc  => 'เครื่องมือจัดการรูปภาพออนไลน์ครบทุกอย่าง แปลง JPG PNG WEBP PDF GIF บีบอัด ปรับขนาด ครอบตัด ปรับแต่ง ฟรี 100% ไม่ต้องอัพโหลด ปลอดภัยสูงสุด ทำในเครื่องคุณ',
    keys  => 'แปลงรูป, บีบอัดรูป, ปรับขนาดรูป, ครอบตัดรูป, ปรับแต่งภาพ, jpg, png, webp, pdf, gif, heic, svg, ลดขนาดรูป, แต่งรูปออนไลน์, ฟรี',
  },
  'convert.html' => {
    path  => '/convert',
    title => 'แปลงรูปเป็น JPG ออนไลน์ ฟรี ไม่ต้องอัพโหลด | thaiimg.com',
    desc  => 'แปลงไฟล์รูป PNG WEBP HEIC BMP เป็น JPG ฟรี ไม่ต้องอัพโหลดเซิร์ฟเวอร์ ทำงานในเครื่องคุณเอง ปลอดภัย 100% รองรับทุกขนาด ไม่จำกัดจำนวนไฟล์',
    keys  => 'แปลง png เป็น jpg, แปลง webp เป็น jpg, แปลง heic เป็น jpg, แปลงรูปเป็น jpg, แปลงไฟล์รูป, jpg converter, convert to jpg',
  },
  'topng.html' => {
    path  => '/topng',
    title => 'แปลงรูปเป็น PNG ออนไลน์ ฟรี รักษาพื้นหลังโปร่งใส | thaiimg.com',
    desc  => 'แปลงไฟล์ JPG WEBP HEIC เป็น PNG ฟรี รักษาความใส (transparency) ไม่ต้องอัพโหลด ทำในเครื่องคุณเอง ปลอดภัยสูงสุด รองรับทุกขนาด ใช้งานง่าย',
    keys  => 'แปลง jpg เป็น png, แปลง webp เป็น png, แปลงรูปเป็น png, png converter, convert to png, รูปพื้นหลังโปร่งใส, transparent png',
  },
  'towebp.html' => {
    path  => '/towebp',
    title => 'แปลงรูปเป็น WEBP ออนไลน์ ฟรี ลดขนาดไฟล์ 70% | thaiimg.com',
    desc  => 'แปลงไฟล์ JPG PNG เป็น WEBP ฟรี ลดขนาดไฟล์ได้ถึง 70% โดยคงคุณภาพ เหมาะกับเว็บไซต์ ทำให้โหลดเร็วขึ้น ไม่ต้องอัพโหลด ปลอดภัย 100%',
    keys  => 'แปลง jpg เป็น webp, แปลง png เป็น webp, แปลงรูปเป็น webp, webp converter, ลดขนาดรูป, รูปขนาดเล็กเว็บไซต์',
  },
  'topdf.html' => {
    path  => '/topdf',
    title => 'แปลงรูปเป็น PDF ออนไลน์ ฟรี รวมหลายไฟล์ในเล่มเดียว | thaiimg.com',
    desc  => 'แปลงรูป JPG PNG WEBP เป็น PDF ฟรี รวมหลายภาพในไฟล์เดียว จัดเรียงลำดับได้ ไม่ต้องอัพโหลด ทำในเครื่องคุณเอง ปลอดภัย 100% เหมาะกับงานเอกสาร',
    keys  => 'แปลงรูปเป็น pdf, รวมรูปเป็น pdf, jpg to pdf, png to pdf, รวมไฟล์ pdf, สร้าง pdf จากรูป, image to pdf',
  },
  'togif.html' => {
    path  => '/togif',
    title => 'สร้าง GIF Animation ออนไลน์ ฟรี จากรูปหลายใบ | thaiimg.com',
    desc  => 'สร้างภาพเคลื่อนไหว GIF จากรูปหลายใบ ปรับความเร็วได้ ฟรี ไม่ต้องอัพโหลด ทำในเครื่องคุณเอง ใช้งานง่าย ปลอดภัย เหมาะกับ social media และ Line sticker',
    keys  => 'สร้าง gif, แปลงรูปเป็น gif, ทำ gif, gif maker, gif animation, รูปเคลื่อนไหว, image to gif, line sticker',
  },
  'tosvg.html' => {
    path  => '/tosvg',
    title => 'แปลงรูปเป็น SVG ออนไลน์ ฟรี | thaiimg.com',
    desc  => 'แปลงไฟล์รูปเป็น SVG ฟรี ไม่ต้องอัพโหลด ทำในเครื่องคุณเอง รองรับ JPG PNG WEBP ใช้งานง่าย ปลอดภัย 100% เหมาะกับเว็บไซต์และงานออกแบบ',
    keys  => 'แปลงรูปเป็น svg, jpg to svg, png to svg, svg converter, vector image, ไฟล์ svg',
  },
  'fromheic.html' => {
    path  => '/fromheic',
    title => 'แปลง HEIC เป็น JPG/PNG/WEBP ออนไลน์ ฟรี (รูปจาก iPhone) | thaiimg.com',
    desc  => 'แปลงไฟล์ HEIC จาก iPhone เป็น JPG PNG WEBP ฟรี ไม่ต้องอัพโหลด ทำในเครื่องคุณเอง รองรับทุก iPhone iPad ปลอดภัย 100% ไม่ต้องลงโปรแกรม',
    keys  => 'แปลง heic เป็น jpg, แปลง heic เป็น png, heic converter, iphone photo, รูป iphone เปิดไม่ได้, แปลงไฟล์ iphone',
  },
  'compress.html' => {
    path  => '/compress',
    title => 'บีบอัดรูปภาพออนไลน์ ฟรี ลดขนาดไฟล์โดยคงคุณภาพ | thaiimg.com',
    desc  => 'บีบอัดรูป JPG PNG WEBP ลดขนาดไฟล์ได้ 50-90% โดยคงคุณภาพดี ฟรี ไม่ต้องอัพโหลด ทำในเครื่องคุณเอง ปลอดภัย เหมาะกับการอัพโหลดเว็บไซต์ Line Facebook',
    keys  => 'บีบอัดรูป, ลดขนาดรูป, compress image, image compressor, ย่อขนาดรูป, ลดขนาดไฟล์รูป, รูปขนาดเล็ก',
  },
  'resize.html' => {
    path  => '/resize',
    title => 'ปรับขนาดรูปภาพออนไลน์ ฟรี ย่อ-ขยายภาพในคลิกเดียว | thaiimg.com',
    desc  => 'ปรับขนาดรูปภาพ ย่อ-ขยาย JPG PNG WEBP กำหนดความกว้าง-สูงเป็น pixel ได้ ฟรี ไม่ต้องอัพโหลด ทำในเครื่องคุณเอง ปลอดภัย เหมาะกับรูปโปรไฟล์ social media',
    keys  => 'ปรับขนาดรูป, resize image, ย่อรูป, ขยายรูป, เปลี่ยนขนาดรูป, รูปโปรไฟล์, image resizer',
  },
  'crop.html' => {
    path  => '/crop',
    title => 'ครอบตัดรูปภาพออนไลน์ ฟรี ตัดภาพในส่วนที่ต้องการ | thaiimg.com',
    desc  => 'ครอบตัดรูปภาพ JPG PNG WEBP เลือกพื้นที่ที่ต้องการ ปรับขนาดได้อิสระ ฟรี ไม่ต้องอัพโหลด ทำในเครื่องคุณเอง ปลอดภัย 100% เหมาะกับงานทุกประเภท',
    keys  => 'ครอบตัดรูป, ตัดรูป, crop image, image cropper, ตัดรูปออนไลน์, ตัดภาพ',
  },
  'edit.html' => {
    path  => '/edit',
    title => 'ปรับแต่งภาพถ่ายออนไลน์ ฟรี ฟิลเตอร์ ลายน้ำ ลบพื้นหลัง AI | thaiimg.com',
    desc  => 'ปรับแต่งรูปภาพออนไลน์ครบครัน ฟิลเตอร์ วาด ข้อความ สติกเกอร์ กรอบ ลายน้ำ ลบพื้นหลัง AI เพิ่มความคมชัด เบลอ ปรับแสง ฟรี ไม่ต้องอัพโหลด ปลอดภัย',
    keys  => 'แต่งรูป, ปรับแต่งภาพ, ฟิลเตอร์รูป, ใส่ลายน้ำ, ลบพื้นหลัง, remove background, photo editor, แต่งรูปออนไลน์, เพิ่มความคมชัด',
  },
  'about.html' => {
    path  => '/about',
    title => 'เกี่ยวกับเรา | thaiimg.com',
    desc  => 'thaiimg.com เครื่องมือจัดการรูปภาพออนไลน์ฟรี สำหรับคนไทย ทำงานในเครื่องคุณเอง ไม่ส่งไฟล์ไปเซิร์ฟเวอร์ ปลอดภัย รวดเร็ว ใช้งานง่าย',
    keys  => 'thaiimg, เกี่ยวกับเรา, เครื่องมือแต่งรูปไทย, image tool thai',
  },
  'privacy.html' => {
    path  => '/privacy',
    title => 'นโยบายความเป็นส่วนตัว | thaiimg.com',
    desc  => 'thaiimg.com ให้ความสำคัญกับความเป็นส่วนตัวสูงสุด ภาพของคุณไม่ถูกส่งไปเซิร์ฟเวอร์เลย ทุกอย่างประมวลผลในเครื่องคุณเอง ปลอดภัย 100% ตาม PDPA',
    keys  => 'นโยบายความเป็นส่วนตัว, privacy policy, pdpa, ความปลอดภัยของข้อมูล',
  },
  'terms.html' => {
    path  => '/terms',
    title => 'ข้อตกลงการใช้งาน | thaiimg.com',
    desc  => 'ข้อตกลงการใช้งานเว็บไซต์ thaiimg.com เครื่องมือจัดการรูปภาพออนไลน์ ผู้ใช้รับผิดชอบเนื้อหาที่อัพโหลดเอง อ่านรายละเอียดข้อตกลงและเงื่อนไขทั้งหมด',
    keys  => 'ข้อตกลงการใช้งาน, terms of service, เงื่อนไขการใช้',
  },
  'help.html' => {
    path  => '/help',
    title => 'ศูนย์ช่วยเหลือและ FAQ | thaiimg.com',
    desc  => 'คำถามที่พบบ่อยและคำแนะนำการใช้งาน thaiimg.com แปลงรูป บีบอัด ครอบตัด ปรับแต่ง ตอบทุกคำถามที่คุณสงสัย พร้อมช่องทางติดต่อทีมงาน',
    keys  => 'คำถามที่พบบ่อย, faq, ช่วยเหลือ, วิธีใช้งาน, help center',
  },
);

# Process each file
for my $file (sort keys %pages) {
  my $info = $pages{$file};
  my $path  = $info->{path};
  my $title = $info->{title};
  my $desc  = $info->{desc};
  my $keys  = $info->{keys};

  # Read file
  open my $fh, '<:encoding(UTF-8)', $file or do { warn "Cannot read $file: $!\n"; next };
  local $/;
  my $html = <$fh>;
  close $fh;

  # Replace title
  $html =~ s|<title>[^<]+</title>|<title>$title</title>|;

  # Remove any existing meta description/keywords/canonical/og/twitter blocks (re-run safe)
  $html =~ s|\s*<meta name="description"[^>]*>||gi;
  $html =~ s|\s*<meta name="keywords"[^>]*>||gi;
  $html =~ s|\s*<meta name="robots"[^>]*>||gi;
  $html =~ s|\s*<link rel="canonical"[^>]*>||gi;
  $html =~ s|\s*<meta property="og:[^"]+"[^>]*>||gi;
  $html =~ s|\s*<meta name="twitter:[^"]+"[^>]*>||gi;
  $html =~ s|\s*<!-- Open Graph[^>]*-->||gi;
  $html =~ s|\s*<!-- Twitter Card[^>]*-->||gi;
  $html =~ s|\s*<!-- SEO[^>]*-->||gi;

  # Build SEO block (inserted right after the new title)
  my $url = "https://thaiimg.com$path";
  my $img = "https://thaiimg.com/icons/logo.png";

  my $seo = qq{
<!-- SEO -->
<meta name="description" content="$desc">
<meta name="keywords" content="$keys">
<meta name="robots" content="index, follow">
<link rel="canonical" href="$url">
<!-- Open Graph (Facebook / Line) -->
<meta property="og:type" content="website">
<meta property="og:url" content="$url">
<meta property="og:title" content="$title">
<meta property="og:description" content="$desc">
<meta property="og:image" content="$img">
<meta property="og:locale" content="th_TH">
<meta property="og:site_name" content="thaiimg.com">
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="$title">
<meta name="twitter:description" content="$desc">
<meta name="twitter:image" content="$img">};

  # Insert SEO block right after the title
  $html =~ s|(<title>$title</title>)|$1$seo|;

  # Write back
  open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!\n";
  print $out $html;
  close $out;

  print "OK: $file\n";
}
