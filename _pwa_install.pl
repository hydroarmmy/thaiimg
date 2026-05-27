#!/usr/bin/perl
use strict;
use warnings;
use utf8;
use open ':std', ':encoding(UTF-8)';

my $pwa_head = <<'PWAHEAD';
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#E97132">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="thaiimg">
PWAHEAD
chomp $pwa_head;

my $pwa_script = '<script src="pwa.js?v=1"></script>';

my @files = glob('*.html');

for my $file (@files) {
  open my $fh, '<:encoding(UTF-8)', $file or do { warn "Cannot read $file: $!\n"; next };
  local $/;
  my $html = <$fh>;
  close $fh;

  # Skip files that don't have <head> (e.g. Google verification stub)
  next unless $html =~ /<\/head>/;

  my $changed = 0;

  # 1) Insert manifest + theme-color in <head> (right before </head>)
  unless ($html =~ /rel="manifest"/) {
    $html =~ s|(\s*</head>)|\n$pwa_head\n$1|;
    $changed = 1;
  }

  # 2) Insert pwa.js right before </body> if not present
  unless ($html =~ /pwa\.js/) {
    $html =~ s|(\s*</body>)|\n$pwa_script$1|;
    $changed = 1;
  }

  if ($changed) {
    open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!\n";
    print $out $html;
    close $out;
    print "OK: $file\n";
  } else {
    print "SKIP (already has PWA): $file\n";
  }
}
