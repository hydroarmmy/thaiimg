/* ─────────────────────────────────────────────────────
   PWA installation prompt + service worker registration
   ───────────────────────────────────────────────────── */
(function () {
  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function (reg) { /* console.log('[PWA] SW registered:', reg.scope); */ })
        .catch(function (err) { console.warn('[PWA] SW register failed:', err); });
    });
  }

  // Custom install prompt
  var deferredPrompt = null;
  var installBtn = null;

  function makeInstallBtn() {
    if (installBtn) return installBtn;
    var btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.className = 'pwa-install-btn';
    btn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>' +
      '</svg><span>ติดตั้งแอป</span>';
    btn.setAttribute('aria-label', 'ติดตั้ง thaiimg เป็นแอป');
    btn.addEventListener('click', async function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      var choice = await deferredPrompt.userChoice;
      if (typeof gtag === 'function') {
        gtag('event', 'pwa_install_prompt', { outcome: choice.outcome });
      }
      deferredPrompt = null;
      btn.style.display = 'none';
    });
    document.body.appendChild(btn);
    installBtn = btn;
    return btn;
  }

  // Show install button when browser fires beforeinstallprompt
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var btn = makeInstallBtn();
    btn.style.display = 'inline-flex';
  });

  // Hide button after install
  window.addEventListener('appinstalled', function () {
    if (installBtn) installBtn.style.display = 'none';
    if (typeof gtag === 'function') {
      gtag('event', 'pwa_installed');
    }
  });
})();
