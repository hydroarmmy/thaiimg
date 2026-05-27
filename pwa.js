/* ─────────────────────────────────────────────────────
   PWA — service worker + smart install prompt
   Behavior:
     - SW registered always
     - Install card shown only AFTER user has done a successful conversion
       (file_uploaded or download click), OR after 60s of active use
     - Dismissable; dismiss is remembered for 30 days
     - Hidden completely on iOS (Safari uses native "Add to Home Screen")
   ───────────────────────────────────────────────────── */
(function () {
  // ── Register service worker ──
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js').catch(function (err) {
        console.warn('[PWA] SW register failed:', err);
      });
    });
  }

  // ── Install prompt state ──
  var deferredPrompt = null;
  var card           = null;
  var triggered      = false;
  var DISMISS_KEY    = 'thaiimg_pwa_dismissed_until';
  var ENGAGED_KEY    = 'thaiimg_engagement';

  // Skip everything on iOS Safari (uses its own share menu)
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) return;

  // Skip if recently dismissed
  function isDismissed() {
    try {
      var until = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
      return until > Date.now();
    } catch (e) { return false; }
  }

  // Skip if already installed (standalone display)
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  if (isStandalone()) return;

  // Get current engagement count
  function getEngagement() {
    try { return parseInt(localStorage.getItem(ENGAGED_KEY) || '0', 10); }
    catch (e) { return 0; }
  }
  function bumpEngagement() {
    try {
      var n = getEngagement() + 1;
      localStorage.setItem(ENGAGED_KEY, String(n));
      return n;
    } catch (e) { return 0; }
  }

  // ── Build the install card ──
  function buildCard() {
    if (card) return card;
    card = document.createElement('div');
    card.className = 'pwa-install-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'ติดตั้ง thaiimg เป็นแอป');
    card.innerHTML =
      '<div class="pwa-install-icon">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
          '<polyline points="7 10 12 15 17 10"/>' +
          '<line x1="12" y1="15" x2="12" y2="3"/>' +
        '</svg>' +
      '</div>' +
      '<div class="pwa-install-text">' +
        '<b>ติดตั้ง thaiimg เป็นแอป</b>' +
        '<span>เปิดใช้ครั้งหน้าง่ายขึ้น ไม่ต้องเปิดเบราว์เซอร์</span>' +
      '</div>' +
      '<button class="pwa-install-cta" type="button">ติดตั้ง</button>' +
      '<button class="pwa-install-close" type="button" aria-label="ปิด">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>';

    // Install action
    card.querySelector('.pwa-install-cta').addEventListener('click', async function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      var choice = await deferredPrompt.userChoice;
      if (typeof gtag === 'function') {
        gtag('event', 'pwa_install_prompt', { outcome: choice.outcome });
      }
      deferredPrompt = null;
      hideCard();
    });

    // Dismiss action (remember 30 days)
    card.querySelector('.pwa-install-close').addEventListener('click', function () {
      var thirtyDays = 30 * 24 * 60 * 60 * 1000;
      try { localStorage.setItem(DISMISS_KEY, String(Date.now() + thirtyDays)); } catch (e) {}
      if (typeof gtag === 'function') {
        gtag('event', 'pwa_prompt_dismissed');
      }
      hideCard();
    });

    document.body.appendChild(card);
    return card;
  }

  function showCard() {
    if (!deferredPrompt || isDismissed() || isStandalone()) return;
    var c = buildCard();
    // Animate in next frame so transition fires
    requestAnimationFrame(function () { c.classList.add('show'); });
    if (typeof gtag === 'function') {
      gtag('event', 'pwa_prompt_shown');
    }
  }

  function hideCard() {
    if (!card) return;
    card.classList.remove('show');
    setTimeout(function () {
      if (card && card.parentNode) card.parentNode.removeChild(card);
      card = null;
    }, 300);
  }

  // Trigger prompt once when user becomes "engaged":
  //   - completed a conversion (downloaded a file)
  //   - OR uploaded a file (means they're actively trying the tool)
  //   - OR stayed 60s on any page
  function triggerOnce() {
    if (triggered) return;
    triggered = true;
    bumpEngagement();
    // Small delay so install card doesn't pop right on top of their action
    setTimeout(showCard, 1500);
  }

  // ── Save the prompt event when browser offers it ──
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    // If user is already engaged from past visits, show immediately
    if (getEngagement() >= 2) triggerOnce();
  });

  // ── Engagement signals ──
  // a) Successful conversion (download click)
  document.addEventListener('click', function (e) {
    var dl = e.target.closest && e.target.closest('a[download]');
    if (dl) triggerOnce();
  }, true);

  // b) File uploaded
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t && t.type === 'file' && t.files && t.files.length > 0) {
      triggerOnce();
    }
  }, true);

  // c) 60 seconds active on page (any page)
  setTimeout(triggerOnce, 60000);

  // ── Track install completion ──
  window.addEventListener('appinstalled', function () {
    hideCard();
    if (typeof gtag === 'function') {
      gtag('event', 'pwa_installed');
    }
    try { localStorage.removeItem(DISMISS_KEY); } catch (e) {}
  });
})();
