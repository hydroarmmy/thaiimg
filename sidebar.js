// ── Sidebar expand sub-menu ────────────────────────
(function () {
  function init() {
    document.querySelectorAll('.tool-expand-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        const isHidden = target.hidden;
        target.hidden = !isHidden;
        btn.textContent = isHidden ? '−' : '+';
      });
    });

    // On /edit page, auto-open the sub-menu so visitors see the feature list
    const isEditPage = /\/edit(\.html)?$/.test(location.pathname) ||
                       location.pathname === '/edit';
    if (isEditPage) {
      const submenu = document.getElementById('editSubmenu');
      const btn = document.querySelector('.tool-expand-btn[data-target="editSubmenu"]');
      if (submenu && btn) {
        submenu.hidden = false;
        btn.textContent = '−';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
