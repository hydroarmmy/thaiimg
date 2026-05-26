// ── Sidebar expand sub-menu ────────────────────────
(function () {
  function init() {
    const buttons = document.querySelectorAll('.tool-expand-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        const isHidden = target.hidden;
        target.hidden = !isHidden;
        btn.textContent = isHidden ? '−' : '+';
      });
    });

    // Auto-open the edit sub-menu when we are on /edit and highlight the
    // sub-item that matches the current hash
    const isEditPage = /\/edit(\.html)?$/.test(location.pathname) ||
                       location.pathname === '/edit';
    if (isEditPage) {
      const submenu = document.getElementById('editSubmenu');
      const btn = document.querySelector('.tool-expand-btn[data-target="editSubmenu"]');
      if (submenu && btn) {
        submenu.hidden = false;
        btn.textContent = '−';
      }
      highlightActiveSub();
      window.addEventListener('hashchange', highlightActiveSub);
    }
  }

  function highlightActiveSub() {
    const hash = location.hash;
    document.querySelectorAll('.tool-submenu a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const match = (hash && href.endsWith(hash)) ||
                    (!hash && href === '/edit#filter');
      a.classList.toggle('active', match);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
