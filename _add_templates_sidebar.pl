#!/usr/bin/perl
use strict;
use warnings;
use utf8;
use open ':std', ':encoding(UTF-8)';

my $new_link = <<'TEMPLATELINK';
      <a href="/templates" class="tool-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        <span>เทมเพลตการ์ด</span>
      </a>
TEMPLATELINK
chomp $new_link;

my @files = glob('*.html');

for my $file (@files) {
  # Skip the templates pages themselves and verify file
  next if $file eq 'templates.html';
  next if $file eq 'templates-editor.html';
  next if $file eq 'google33fcce6d82baee43.html';

  open my $fh, '<:encoding(UTF-8)', $file or do { warn "Cannot read $file: $!\n"; next };
  local $/;
  my $html = <$fh>;
  close $fh;

  # Only process pages that have the sidebar with /edit link
  next unless $html =~ m{<a href="/edit"[^>]*class="tool-link[^"]*"};

  # Skip if already has /templates link in sidebar
  if ($html =~ m{<a href="/templates"[^>]*class="tool-link}) {
    print "SKIP (already has templates link): $file\n";
    next;
  }

  # Find the /edit link block (it's a single a tag with closing </a>)
  # Insert the new link AFTER the /edit link's closing </a>
  my $edit_block_re = qr{(
    <a\s+href="/edit"\s+class="tool-link[^"]*">
    \s*<svg[^>]*>.*?</svg>
    \s*<span>[^<]+</span>
    \s*</a>
  )}sx;

  if ($html =~ $edit_block_re) {
    my $matched = $1;
    my $replacement = $matched . "\n" . $new_link;
    $html =~ s/\Q$matched\E/$replacement/;

    open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!\n";
    print $out $html;
    close $out;
    print "OK: $file\n";
  } else {
    print "SKIP (edit link not found): $file\n";
  }
}
