#!/usr/bin/perl
use strict;
use warnings;
use utf8;
use open ':std', ':encoding(UTF-8)';

# ── Page metadata for JSON-LD ──
# Type: "tool" = WebApplication, "info" = WebPage, "home" = WebSite+Org

my %pages = (
  'index.html' => {
    type => 'home',
    path => '/',
    name => 'thaiimg.com',
    desc => 'เครื่องมือจัดการรูปภาพออนไลน์ฟรี แปลง บีบอัด ครอบตัด ปรับแต่งรูป ไม่ต้องอัพโหลด ปลอดภัย 100%',
  },
  'convert.html' => {
    type => 'tool', path => '/convert',
    name => 'แปลงรูปเป็น JPG',
    desc => 'แปลงไฟล์ PNG WEBP HEIC BMP เป็น JPG ฟรี ไม่ต้องอัพโหลด ปลอดภัย 100%',
    features => ['แปลง PNG เป็น JPG', 'แปลง WEBP เป็น JPG', 'แปลง HEIC เป็น JPG', 'ทำงานในเครื่องคุณ', 'ไม่จำกัดจำนวนไฟล์'],
  },
  'topng.html' => {
    type => 'tool', path => '/topng',
    name => 'แปลงรูปเป็น PNG',
    desc => 'แปลงไฟล์ JPG WEBP HEIC เป็น PNG ฟรี รักษาพื้นหลังโปร่งใส',
    features => ['แปลง JPG เป็น PNG', 'รักษา transparency', 'ทำงานในเครื่องคุณ', 'ไม่จำกัดจำนวนไฟล์'],
  },
  'towebp.html' => {
    type => 'tool', path => '/towebp',
    name => 'แปลงรูปเป็น WEBP',
    desc => 'แปลงไฟล์ JPG PNG เป็น WEBP ลดขนาดได้ถึง 70% โดยคงคุณภาพ',
    features => ['แปลง JPG เป็น WEBP', 'แปลง PNG เป็น WEBP', 'เลือกคุณภาพ 65/85/95%', 'ลดขนาดไฟล์ 50-70%'],
  },
  'topdf.html' => {
    type => 'tool', path => '/topdf',
    name => 'แปลงรูปเป็น PDF',
    desc => 'รวมรูปหลายใบเป็น PDF ไฟล์เดียว จัดเรียงลำดับได้',
    features => ['รวมรูปหลายใบเป็น PDF', 'ลากจัดเรียงลำดับได้', 'รองรับ JPG PNG WEBP', 'auto-orient ภาพ'],
  },
  'togif.html' => {
    type => 'tool', path => '/togif',
    name => 'สร้าง GIF Animation',
    desc => 'สร้างภาพเคลื่อนไหว GIF จากรูปหลายใบ ปรับความเร็วได้',
    features => ['สร้าง GIF จากรูปหลายใบ', 'ปรับ frame delay', 'ลากจัดเรียงลำดับได้', 'รองรับทุกฟอร์แมต'],
  },
  'tosvg.html' => {
    type => 'tool', path => '/tosvg',
    name => 'แปลงรูปเป็น SVG',
    desc => 'แปลงไฟล์รูปเป็น SVG ใช้กับเว็บไซต์และงานออกแบบ',
    features => ['แปลง JPG/PNG/WEBP เป็น SVG', 'ทำงานในเครื่องคุณ'],
  },
  'fromheic.html' => {
    type => 'tool', path => '/fromheic',
    name => 'แปลง HEIC เป็น JPG/PNG/WEBP',
    desc => 'แปลงไฟล์ HEIC จาก iPhone เป็น JPG PNG หรือ WEBP',
    features => ['รองรับ HEIC จาก iPhone/iPad', 'เลือก output: JPG/PNG/WEBP', 'แปลงหลายไฟล์พร้อมกัน'],
  },
  'compress.html' => {
    type => 'tool', path => '/compress',
    name => 'บีบอัดรูปภาพ',
    desc => 'บีบอัดรูป JPG PNG WEBP ลดขนาดไฟล์ได้ 50-90% โดยคงคุณภาพ',
    features => ['ลดขนาดไฟล์ 50-90%', 'เลือกคุณภาพได้', 'รองรับ JPG PNG WEBP', 'แสดง % ที่ลดได้'],
  },
  'resize.html' => {
    type => 'tool', path => '/resize',
    name => 'ปรับขนาดรูปภาพ',
    desc => 'ย่อ-ขยายรูปภาพ กำหนดความกว้าง-สูงเป็น pixel ได้',
    features => ['กำหนด pixel ได้', 'preset ขนาด 25/50/75/150/200%', 'lock aspect ratio', 'รองรับทุกฟอร์แมต'],
  },
  'crop.html' => {
    type => 'tool', path => '/crop',
    name => 'ครอบตัดรูปภาพ',
    desc => 'ครอบตัดรูปภาพ เลือกพื้นที่ที่ต้องการ ปรับขนาดได้อิสระ',
    features => ['drag handles ปรับขอบ', 'พิมพ์ค่า pixel ตรงๆ ได้', 'preview แบบ realtime'],
  },
  'edit.html' => {
    type => 'tool', path => '/edit',
    name => 'ปรับแต่งภาพถ่าย',
    desc => 'ปรับแต่งรูปครบครัน ฟิลเตอร์ ลายน้ำ ลบพื้นหลัง AI เพิ่มความคมชัด',
    features => ['ฟิลเตอร์ภาพ', 'วาดบนภาพ', 'เพิ่มข้อความ/สติกเกอร์/กรอบ', 'ลบพื้นหลัง AI', 'ใส่ลายน้ำ', 'เพิ่มความคมชัด', 'เบลอภาพ', 'ปรับแสงอัตโนมัติ'],
  },
  'about.html'   => { type => 'info', path => '/about',   name => 'เกี่ยวกับเรา', desc => 'เกี่ยวกับ thaiimg.com เครื่องมือจัดการรูปภาพออนไลน์ฟรีสำหรับคนไทย' },
  'privacy.html' => { type => 'info', path => '/privacy', name => 'นโยบายความเป็นส่วนตัว', desc => 'นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูล PDPA' },
  'terms.html'   => { type => 'info', path => '/terms',   name => 'ข้อตกลงการใช้งาน', desc => 'ข้อตกลงและเงื่อนไขการใช้งานเว็บไซต์ thaiimg.com' },
  'help.html'    => { type => 'info', path => '/help',    name => 'ศูนย์ช่วยเหลือ',   desc => 'คำถามที่พบบ่อยและคำแนะนำการใช้งาน thaiimg.com' },
);

sub esc_json {
  my $s = shift;
  $s =~ s/\\/\\\\/g;
  $s =~ s/"/\\"/g;
  $s =~ s/\n/\\n/g;
  return $s;
}

sub build_jsonld {
  my $p = shift;
  my $type = $p->{type};
  my $url  = "https://thaiimg.com$p->{path}";
  my $name = esc_json($p->{name});
  my $desc = esc_json($p->{desc});
  my $logo = 'https://thaiimg.com/icons/logo.png';

  if ($type eq 'home') {
    return qq|<script type="application/ld+json">
{
  "\@context": "https://schema.org",
  "\@graph": [
    {
      "\@type": "Organization",
      "\@id": "https://thaiimg.com/#org",
      "name": "thaiimg.com",
      "url": "https://thaiimg.com/",
      "logo": "$logo"
    },
    {
      "\@type": "WebSite",
      "\@id": "https://thaiimg.com/#website",
      "url": "https://thaiimg.com/",
      "name": "$name",
      "description": "$desc",
      "publisher": { "\@id": "https://thaiimg.com/#org" },
      "inLanguage": "th-TH"
    }
  ]
}
</script>|;
  }
  elsif ($type eq 'tool') {
    my @feats = @{ $p->{features} || [] };
    my $feat_json = join(",\n      ", map { '"' . esc_json($_) . '"' } @feats);
    return qq|<script type="application/ld+json">
{
  "\@context": "https://schema.org",
  "\@type": "WebApplication",
  "name": "$name",
  "url": "$url",
  "description": "$desc",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires HTML5 and JavaScript enabled",
  "inLanguage": "th-TH",
  "isAccessibleForFree": true,
  "offers": {
    "\@type": "Offer",
    "price": "0",
    "priceCurrency": "THB"
  },
  "featureList": [
      $feat_json
  ],
  "publisher": {
    "\@type": "Organization",
    "name": "thaiimg.com",
    "url": "https://thaiimg.com/",
    "logo": "$logo"
  }
}
</script>|;
  }
  else {  # info
    return qq|<script type="application/ld+json">
{
  "\@context": "https://schema.org",
  "\@type": "WebPage",
  "name": "$name",
  "url": "$url",
  "description": "$desc",
  "inLanguage": "th-TH",
  "isPartOf": {
    "\@type": "WebSite",
    "name": "thaiimg.com",
    "url": "https://thaiimg.com/"
  }
}
</script>|;
  }
}

for my $file (sort keys %pages) {
  my $info = $pages{$file};

  open my $fh, '<:encoding(UTF-8)', $file or do { warn "Cannot read $file: $!\n"; next };
  local $/;
  my $html = <$fh>;
  close $fh;

  # Remove any existing JSON-LD
  $html =~ s|\s*<script type="application/ld\+json">.*?</script>||gis;

  my $jsonld = build_jsonld($info);

  # Insert right before </head>
  $html =~ s|(\s*</head>)|\n$jsonld$1|;

  open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!\n";
  print $out $html;
  close $out;

  print "OK: $file\n";
}
