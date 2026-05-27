/* ─────────────────────────────────────────────────────
   thaiimg.com custom GA4 event tracking
   Fires:
     - file_uploaded:        when any <input type="file"> gets files
     - tool_clicked:         when a .tool-card is clicked (home page)
     - conversion_complete:  when any <a download> is clicked
   Uses event delegation so dynamically created elements work too.
   ───────────────────────────────────────────────────── */
(function () {
  if (typeof gtag !== 'function') return;

  // Detect current tool from URL path
  function getCurrentTool() {
    var path = window.location.pathname;
    var m = path.match(/\/([^\/]+?)(?:\.html)?\/?$/);
    return m ? m[1] : 'home';
  }
  var currentTool = getCurrentTool();

  // ── 1. file_uploaded ─────────────────────────────
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (!t || t.type !== 'file' || !t.files || t.files.length === 0) return;

    var totalBytes = 0;
    for (var i = 0; i < t.files.length; i++) totalBytes += t.files[i].size;

    gtag('event', 'file_uploaded', {
      tool: currentTool,
      file_count: t.files.length,
      total_size_kb: Math.round(totalBytes / 1024)
    });
  }, true);

  // ── 2. tool_clicked (home page) ──────────────────
  // ── 3. conversion_complete (any tool page) ───────
  document.addEventListener('click', function (e) {
    // tool_clicked: any .tool-card link
    var card = e.target.closest && e.target.closest('.tool-card');
    if (card) {
      var href = card.getAttribute('href') || '';
      var toolSlug = href.replace(/^\//, '').replace(/\/$/, '') || 'unknown';
      gtag('event', 'tool_clicked', {
        tool: toolSlug,
        from_page: currentTool
      });
      return;
    }

    // conversion_complete: any <a download>
    var dl = e.target.closest && e.target.closest('a[download]');
    if (dl) {
      gtag('event', 'conversion_complete', {
        tool: currentTool,
        filename: dl.getAttribute('download') || ''
      });
    }
  }, true);
})();
