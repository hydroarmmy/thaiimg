#!/usr/bin/perl
# Move "เทมเพลตการ์ด" link OUTSIDE the /edit tool-link-row, and place it
# BEFORE the /edit tool-group entirely (so it appears above
# "ปรับแต่งภาพถ่าย" in the sidebar without breaking the expand layout).
use strict;
use warnings;
use utf8;
use open ':std', ':encoding(UTF-8)';

my $template_link = <<'TEMPLATELINK';
      <a href="/templates" class="tool-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        <span>เทมเพลตการ์ด</span>
      </a>
TEMPLATELINK
chomp $template_link;

my @files = glob('*.html');

for my $file (@files) {
  next if $file eq 'templates.html';           # active state lives there
  next if $file eq 'templates-editor.html';
  next if $file eq 'google33fcce6d82baee43.html';

  open my $fh, '<:encoding(UTF-8)', $file or do { warn "Cannot read $file: $!\n"; next };
  local $/;
  my $html = <$fh>;
  close $fh;

  next unless $html =~ m{<a href="/edit"[^>]*class="tool-link[^"]*"};

  my $orig = $html;

  # Step 1: Remove any existing /templates link from anywhere in the sidebar
  # Matches the full <a href="/templates"> ... </a> block including the SVG.
  $html =~ s{\s*<a\s+href="/templates"\s+class="tool-link[^"]*">\s*<svg[^>]*>.*?</svg>\s*<span>[^<]+</span>\s*</a>}{}sg;

  # Step 2: Find the tool-group containing /edit, and insert the
  # templates link as a sibling immediately BEFORE it.
  # The /edit group looks like:
  #   <div class="tool-group">
  #     <div class="tool-link-row">
  #       <a href="/edit" ...>...</a>
  #       <button class="tool-expand-btn" ...>+</button>
  #     </div>
  #     <div class="tool-submenu" ...> ... </div>
  #   </div>
  #
  # Some pages might have /edit as a plain tool-link (no group) — handle both.

  if ($html =~ m{(<div class="tool-group">\s*<div class="tool-link-row">\s*<a href="/edit"[^>]*class="tool-link[^"]*">)}) {
    # Has the group wrapper
    my $anchor = $1;
    my $replacement = $template_link . "\n\n      " . $anchor;
    # Use Perl's quotemeta for safe substitution
    my $q = quotemeta $anchor;
    $html =~ s/$q/$template_link\n\n      $anchor/;
  } elsif ($html =~ m{(<a href="/edit"[^>]*class="tool-link[^"]*">)}) {
    # Plain link, no expand button
    my $anchor = $1;
    my $q = quotemeta $anchor;
    $html =~ s/$q/$template_link\n\n      $anchor/;
  } else {
    print "SKIP (no /edit found): $file\n";
    next;
  }

  if ($html ne $orig) {
    open my $out, '>:encoding(UTF-8)', $file or die "Cannot write $file: $!\n";
    print $out $html;
    close $out;
    print "OK: $file\n";
  } else {
    print "NO CHANGE: $file\n";
  }
}
