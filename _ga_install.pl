#!/usr/bin/perl
use strict;
use warnings;
use utf8;
use open ':std', ':encoding(UTF-8)';

my $ga_id = 'G-24FR9E6CYV';

my $ga_snippet = <<"GASNIPPET";
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=$ga_id"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '$ga_id');
</script>
GASNIPPET

chomp $ga_snippet;

my @files = glob('*.html');

for my $file (@files) {
  open my $fh, '<:encoding(UTF-8)', $file or do { warn "Cannot read $file: $!\n"; next };
  local $/;
  my $html = <$fh>;
  close $fh;

  if ($html =~ /\Q$ga_id\E/) {
    print "SKIP (already has GA): $file\n";
    next;
  }

  unless ($html =~ /adsbygoogle\.js/) {
    print "SKIP (no AdSense anchor): $file\n";
    next;
  }

  $html =~ s|(<script async src="https://pagead2\.googlesyndication\.com[^>]+></script>)|$1\n$ga_snippet|;

  open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!\n";
  print $out $html;
  close $out;

  print "OK: $file\n";
}
