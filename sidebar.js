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

    // Topbar hamburger menu — toggle + close on outside click
    const menuBtn = document.getElementById('topbarMenuBtn');
    const menu = document.getElementById('topbarMenu');
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.hidden = !menu.hidden;
      });
      document.addEventListener('click', (e) => {
        if (!menu.hidden && !menu.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
          menu.hidden = true;
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
