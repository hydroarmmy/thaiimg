#!/usr/bin/perl
# Quick-wins SEO + performance pass for all pages:
#   1. FAQ structured data (FAQPage JSON-LD)
#   2. Better image alt text
#   3. Internal links inside tool articles
#   4. Page speed: defer scripts, preconnect, lazy loading

use strict;
use warnings;
use utf8;
use open ':std', ':encoding(UTF-8)';

# ── FAQ data per tool page (same Q&A as visible <details>) ──
my %faqs = (
  'convert.html' => [
    ['แปลง HEIC จาก iPhone เป็น JPG ได้ไหม?', 'ได้ครับ รองรับไฟล์ .heic และ .heif จาก iPhone, iPad ทุกรุ่น'],
    ['แปลงรูปได้กี่ไฟล์ต่อครั้ง?', 'ไม่จำกัดจำนวนไฟล์ ขึ้นอยู่กับ RAM ของเครื่องคุณเท่านั้น แนะนำไม่เกิน 100 ไฟล์ต่อครั้งเพื่อความเร็ว'],
    ['ไฟล์ของฉันปลอดภัยไหม?', 'ปลอดภัย 100% เพราะภาพไม่ถูกส่งไปเซิร์ฟเวอร์เลย ทุกอย่างประมวลผลในเบราว์เซอร์ของคุณ'],
  ],
  'topng.html' => [
    ['PNG ดีกว่า JPG ตรงไหน?', 'PNG รองรับพื้นหลังโปร่งใส เหมาะกับโลโก้ ไอคอน กราฟิก ขณะที่ JPG เหมาะกับภาพถ่ายเพราะไฟล์เล็กกว่า'],
    ['แปลง JPG เป็น PNG จะมีพื้นหลังโปร่งใสไหม?', 'ไม่ครับ ถ้าต้นฉบับเป็น JPG จะไม่มีข้อมูลพื้นหลังโปร่งใส ต้องใช้เครื่องมือ "ลบพื้นหลัง" ในหน้า /edit แยกต่างหาก'],
  ],
  'towebp.html' => [
    ['WEBP เปิดด้วยอะไรได้บ้าง?', 'เบราว์เซอร์ Chrome, Firefox, Edge, Safari (เวอร์ชันใหม่) เปิดได้หมด รวมถึง Windows 10/11, Photoshop, Figma ก็รองรับ'],
    ['ทำไมเว็บไซต์ใหญ่ๆ ใช้ WEBP?', 'เพราะไฟล์เล็กกว่ามาก ทำให้เว็บโหลดเร็วขึ้น 30-70% ส่งผลให้ผู้ใช้ไม่ทิ้งเว็บไป และ Google ให้คะแนน SEO ดีกว่า'],
  ],
  'topdf.html' => [
    ['รวม PDF ได้กี่หน้า?', 'ไม่จำกัดจำนวนหน้า แนะนำไม่เกิน 50 หน้าต่อครั้งเพื่อความเร็ว'],
    ['เอกสารสำคัญส่งเข้าเว็บนี้ได้ไหม?', 'ปลอดภัยครับ เพราะไฟล์ไม่ถูกส่งไปเซิร์ฟเวอร์เลย เหมาะกับเอกสารส่วนตัว เช่น สลิปธนาคาร บัตรประชาชน'],
  ],
  'togif.html' => [
    ['GIF ที่สร้างเอาไปทำ Line sticker ได้ไหม?', 'ได้ครับ แต่ Line อาจมีข้อกำหนดขนาดไฟล์/ขนาดภาพ ควรตรวจสอบที่ Line Creator Market ก่อน'],
    ['ทำไมไฟล์ GIF ใหญ่จัง?', 'GIF ใช้การบีบอัดเก่า ไฟล์จะใหญ่ตามจำนวน frame ถ้าใหญ่เกินไป ลองลดขนาดรูปก่อนสร้าง GIF (ใช้หน้า /resize)'],
  ],
  'tosvg.html' => [
    ['SVG ที่ได้เป็น vector หรือเปล่า?', 'ไม่ครับ เป็น raster image ที่ห่อใน SVG container การแปลงรูปถ่ายเป็น vector จริงๆ ต้องใช้โปรแกรมเฉพาะ (vectorize)'],
    ['SVG ใช้ทำอะไรได้บ้าง?', 'ใช้ใน HTML/CSS เว็บไซต์, นำเข้า Figma/Illustrator, ใช้เป็น favicon, ไอคอน UI ได้หมด'],
  ],
  'fromheic.html' => [
    ['ทำไม iPhone บันทึกเป็น HEIC?', 'เพราะ HEIC ให้คุณภาพสูงกว่าและขนาดเล็กกว่า JPG ประมาณ 50% ประหยัดพื้นที่เก็บข้อมูล'],
    ['แปลงแล้วคุณภาพลดลงไหม?', 'JPG อาจลดลงเล็กน้อย (lossy), PNG ไม่ลดลงเลย (lossless), WEBP กลางๆ'],
    ['ตั้งค่า iPhone ให้บันทึกเป็น JPG ได้ไหม?', 'ได้ครับ ไป Settings - Camera - Formats - เลือก "Most Compatible" จะบันทึกเป็น JPG แทน'],
  ],
  'compress.html' => [
    ['บีบอัดแล้วคุณภาพลดมากไหม?', 'ลดเล็กน้อยที่ตาคนแทบไม่เห็น โหมด "เน้นคุณภาพ" จะลดน้อยมาก เหมาะถ้าต้องการคุณภาพ'],
    ['ทำไมบีบอัดแล้วไฟล์ใหญ่กว่าเดิม?', 'ถ้าไฟล์ต้นฉบับถูกบีบอัดมาแล้ว เราจะส่งไฟล์เดิมกลับให้ คุณจะไม่ได้ไฟล์ที่ใหญ่ขึ้นแน่นอน'],
  ],
  'resize.html' => [
    ['ปรับขนาดแล้วภาพเบลอไหม?', 'ย่อขนาดจะคมขึ้น ขยายขนาดอาจเบลอได้ ขึ้นกับการขยาย แนะนำไม่ขยายเกิน 200%'],
    ['รูปโปรไฟล์ Facebook ควรขนาดเท่าไหร่?', 'แนะนำ 320x320 px หรือ 720x720 px สำหรับจอความละเอียดสูง'],
  ],
  'crop.html' => [
    ['ครอบตัดกี่ขนาดได้บ้าง?', 'อิสระทุกขนาด ตามที่คุณลากหรือพิมพ์ตัวเลข ไม่มีข้อจำกัด'],
    ['ครอบตัดแล้วคุณภาพลดไหม?', 'ไม่ลดเลย เพราะแค่ตัดส่วนของภาพออก ไม่ได้บีบอัดใหม่'],
  ],
  'edit.html' => [
    ['ลบพื้นหลัง AI ทำงานยังไง?', 'ใช้โมเดล AI (ONNX) ทำงานในเบราว์เซอร์ของคุณเอง ไม่ส่งภาพไปเซิร์ฟเวอร์ ครั้งแรกอาจช้าหน่อยเพราะโหลดโมเดล (~30MB)'],
    ['รองรับการ undo/redo ไหม?', 'ในแต่ละเครื่องมือมี preview แบบ realtime สามารถยกเลิกได้ก่อน apply'],
    ['ใช้ฟรีจริงๆ ไหม?', 'ฟรีจริง 100% ไม่มี watermark ไม่จำกัดการใช้งาน ไม่ต้องสมัครสมาชิก'],
  ],
);

# ── Internal link map — keyword → URL ──
# Order matters: longer keywords first to avoid partial replacement.
my @link_map = (
  ['/topng',    'PNG'],
  ['/towebp',   'WEBP'],
  ['/towebp',   'WebP'],
  ['/topdf',    'PDF'],
  ['/togif',    'GIF'],
  ['/tosvg',    'SVG'],
  ['/fromheic', 'HEIC'],
  ['/convert',  'JPG'],
  ['/convert',  'JPEG'],
  ['/compress', 'บีบอัด'],
  ['/resize',   'ปรับขนาด'],
  ['/crop',     'ครอบตัด'],
  ['/edit',     'ลบพื้นหลัง'],
);

# ── Preconnect block for performance ──
my $preconnect = <<'PRECONNECT';
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://pagead2.googlesyndication.com">
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
PRECONNECT
chomp $preconnect;

# ── Helpers ──

sub esc_json {
  my $s = shift;
  $s =~ s/\\/\\\\/g;
  $s =~ s/"/\\"/g;
  $s =~ s/\n/\\n/g;
  return $s;
}

sub build_faq_jsonld {
  my $list = shift;
  my @items;
  for my $qa (@$list) {
    my ($q, $a) = @$qa;
    push @items, sprintf(
      '    {"@type":"Question","name":"%s","acceptedAnswer":{"@type":"Answer","text":"%s"}}',
      esc_json($q), esc_json($a)
    );
  }
  my $items = join(",\n", @items);
  return <<"JSONLD";
<!-- FAQ_JSONLD -->
<script type="application/ld+json">
{
  "\@context": "https://schema.org",
  "\@type": "FAQPage",
  "mainEntity": [
$items
  ]
}
</script>
<!-- /FAQ_JSONLD -->
JSONLD
}

# Add internal links inside tool-seo paragraphs.
# Process line by line, only modifying <p> lines. Each keyword can be
# linked at most once per page. Skip the page's own keyword.
sub add_internal_links {
  my ($html, $self_path) = @_;

  return $html unless $html =~ /<!-- LONGFORM_START -->(.*?)<!-- LONGFORM_END -->/s;
  my $before = $`;
  my $block  = $1;
  my $after  = $';

  # ── Idempotency: strip any existing internal <a href="/..."> links
  # inside the article block first, so re-runs produce identical output.
  $block =~ s|<a href="/[^"]+">([^<]+)</a>|$1|g;

  my %linked;
  my @lines = split /(\n)/, $block;  # keep newlines

  for my $line (@lines) {
    next unless $line =~ /<p[ >]/;     # paragraph lines only

    for my $pair (@link_map) {
      my ($url, $kw) = @$pair;
      next if $url eq $self_path;       # don't self-link
      next if $linked{$kw};

      # Skip if keyword already wrapped in a link in this line
      next if $line =~ /<a[^>]*>[^<]*\Q$kw\E[^<]*<\/a>/;

      # Replace first occurrence (anywhere in the line)
      if ($line =~ s{\b(\Q$kw\E)\b}{<a href="$url">$1</a>}) {
        $linked{$kw} = 1;
        last;   # max one link per paragraph
      }
    }
  }

  $block = join '', @lines;
  return $before . '<!-- LONGFORM_START -->' . $block . '<!-- LONGFORM_END -->' . $after;
}

# Self-path mapping
my %self_path = (
  'convert.html'  => '/convert',
  'topng.html'    => '/topng',
  'towebp.html'   => '/towebp',
  'topdf.html'    => '/topdf',
  'togif.html'    => '/togif',
  'tosvg.html'    => '/tosvg',
  'fromheic.html' => '/fromheic',
  'compress.html' => '/compress',
  'resize.html'   => '/resize',
  'crop.html'     => '/crop',
  'edit.html'     => '/edit',
);

# ── Process all HTML files ──

my @files = glob('*.html');

for my $file (@files) {
  open my $fh, '<:encoding(UTF-8)', $file or do { warn "Cannot read $file: $!\n"; next };
  local $/;
  my $html = <$fh>;
  close $fh;

  next unless $html =~ m{</head>};   # skip non-page files

  my $changed = 0;

  # ── 1. FAQ JSON-LD ──
  if ($faqs{$file}) {
    # Remove existing FAQ block (re-run safe)
    $html =~ s|\s*<!-- FAQ_JSONLD -->.*?<!-- /FAQ_JSONLD -->||s;
    my $faq = build_faq_jsonld($faqs{$file});
    # Insert right before </head>
    $html =~ s|(\s*</head>)|\n$faq$1|;
    $changed = 1;
  }

  # ── 2. Preconnect links (page speed) ──
  unless ($html =~ /rel="preconnect" href="https:\/\/fonts\.googleapis/) {
    # Insert right after <meta charset="UTF-8">
    $html =~ s|(<meta charset="UTF-8">)|$1\n$preconnect|;
    $changed = 1;
  }

  # ── 3. Defer non-critical scripts ──
  $html =~ s|<script src="sidebar\.js\?v=2"></script>|<script src="sidebar.js?v=2" defer></script>|g;
  $html =~ s|<script src="analytics\.js\?v=1"></script>|<script src="analytics.js?v=1" defer></script>|g;
  $html =~ s|<script src="pwa\.js\?v=2"></script>|<script src="pwa.js?v=2" defer></script>|g;

  # ── 4. Lazy load + async decode for all <img> ──
  $html =~ s{<img\s+([^>]*?)>}{
    my $attrs = $1;
    # Skip if already has loading attribute, or is the logo (above the fold)
    if ($attrs =~ /loading\s*=/ || $attrs =~ /class\s*=\s*"[^"]*brand-logo/) {
      "<img $attrs>";
    } else {
      "<img $attrs loading=\"lazy\" decoding=\"async\">";
    }
  }gex;

  # ── 5. Better alt text on home tool cards ──
  if ($file eq 'index.html') {
    my %better_alt = (
      'icons/convert.png'  => 'แปลงรูปเป็น JPG ออนไลน์ฟรี',
      'icons/compress.png' => 'บีบอัดรูปภาพลดขนาดไฟล์',
      'icons/resize.png'   => 'ปรับขนาดรูปภาพย่อขยาย',
      'icons/crop.png'     => 'ครอบตัดรูปภาพ',
      'icons/edit.png'     => 'ปรับแต่งภาพถ่าย ฟิลเตอร์ ลายน้ำ',
      'icons/removebg.png' => 'ลบพื้นหลังรูปด้วย AI',
    );
    for my $src (keys %better_alt) {
      my $new_alt = $better_alt{$src};
      $html =~ s{(<img\s+src="\Q$src\E[^"]*"\s+)alt="[^"]*"}{$1alt="$new_alt"};
    }
  }

  # ── 6. Internal linking in articles ──
  if ($self_path{$file}) {
    my $new = add_internal_links($html, $self_path{$file});
    if ($new ne $html) {
      $html = $new;
      $changed = 1;
    }
  }

  open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!\n";
  print $out $html;
  close $out;

  print "OK: $file\n";
}
