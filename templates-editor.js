/* ─────────────────────────────────────────────────────
   thaiimg.com Card Templates — Editor
   Single Canvas, layer-based, with Smart Auto-fit + Drag-to-pan
   for photo slots.
   ───────────────────────────────────────────────────── */

(function () {
  'use strict';

  // ── DOM refs ──
  const canvas = document.getElementById('editorCanvas');
  const ctx    = canvas.getContext('2d');
  const titleEl = document.getElementById('templateTitle');
  const overlay = document.getElementById('editorOverlay');
  const editPanel = document.getElementById('editPanel');
  const textPanel = document.getElementById('textPanel');
  const fileInput = document.getElementById('fileInput');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn  = document.getElementById('resetSlotBtn');
  const editDoneBtn = document.getElementById('editDoneBtn');
  const editZoomIn = document.getElementById('editZoomIn');
  const editZoomOut = document.getElementById('editZoomOut');
  const editReset = document.getElementById('editReset');

  // ── State ──
  let template = null;
  let layerState = {};   // photo-slot id → { img, scale, offsetX, offsetY }
  let textState  = {};   // text id → current text string
  let activeSlot = null; // currently being edited (id)
  let editingTextId = null;
  let displayScale = 1;  // canvas scale on screen

  // ── Load template from URL ?t=ID ──
  function getQuery(k) {
    const m = window.location.search.match(new RegExp('[?&]' + k + '=([^&]+)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  const wanted = getQuery('t');
  template = (window.THAIIMG_TEMPLATES || []).find(t => t.id === wanted) ||
             (window.THAIIMG_TEMPLATES || [])[0];

  if (!template) {
    document.body.innerHTML = '<p style="padding:40px;text-align:center">ไม่พบ template</p>';
    return;
  }

  // Initialize state
  template.layers.forEach(layer => {
    if (layer.type === 'photo-slot') {
      layerState[layer.id] = { img: null, scale: 1, offsetX: 0, offsetY: 0 };
    }
    if (layer.type === 'text' && layer.editable) {
      textState[layer.id] = layer.text;
    }
  });

  titleEl.textContent = template.name;

  // ── Canvas sizing ──
  function setupCanvas() {
    canvas.width = template.width;
    canvas.height = template.height;
    fitToScreen();
  }

  function fitToScreen() {
    const wrap = canvas.parentElement;
    const maxW = wrap.clientWidth - 20;
    const maxH = window.innerHeight - 200;
    const ratio = Math.min(maxW / template.width, maxH / template.height, 1);
    displayScale = ratio;
    canvas.style.width  = (template.width  * ratio) + 'px';
    canvas.style.height = (template.height * ratio) + 'px';
  }

  window.addEventListener('resize', () => { fitToScreen(); render(); });

  // ── Render the entire template ──
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    template.layers.forEach(layer => {
      switch (layer.type) {
        case 'circle': drawCircle(layer);  break;
        case 'rect':   drawRect(layer);    break;
        case 'photo-slot': drawPhotoSlot(layer);  break;
        case 'text':   drawText(layer);    break;
      }
    });
  }

  function drawBackground() {
    const bg = template.background;
    if (!bg) return;
    if (bg.type === 'color') {
      ctx.fillStyle = bg.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bg.type === 'gradient') {
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.colors.forEach((c, i) => g.addColorStop(i / (bg.colors.length - 1), c));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function drawCircle(l) {
    ctx.fillStyle = l.fill;
    ctx.beginPath();
    ctx.arc(l.x, l.y, l.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawRect(l) {
    ctx.fillStyle = l.fill;
    ctx.fillRect(l.x, l.y, l.width, l.height);
  }

  // Get effective shape — user override (in state) trumps template default
  function getShape(l) {
    const st = layerState[l.id];
    return (st && st.shape) || l.shape || 'rect';
  }

  function clipSlot(ctxIn, l) {
    const shape = getShape(l);
    ctxIn.beginPath();
    if (shape === 'circle') {
      const cx = l.x + l.width / 2;
      const cy = l.y + l.height / 2;
      const r  = Math.min(l.width, l.height) / 2;
      ctxIn.arc(cx, cy, r, 0, Math.PI * 2);
    } else if (shape === 'rounded') {
      roundedRectPath(ctxIn, l.x, l.y, l.width, l.height, l.borderRadius || 16);
    } else {
      ctxIn.rect(l.x, l.y, l.width, l.height);
    }
    ctxIn.closePath();
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
  }

  function drawPhotoSlot(l) {
    const st = layerState[l.id];

    ctx.save();
    clipSlot(ctx, l);

    if (st.img) {
      // Draw image with cover-mode transform
      ctx.clip();
      const cx = l.x + l.width  / 2;
      const cy = l.y + l.height / 2;
      const drawW = st.img.naturalWidth  * st.scale;
      const drawH = st.img.naturalHeight * st.scale;
      ctx.drawImage(
        st.img,
        cx - drawW / 2 + st.offsetX,
        cy - drawH / 2 + st.offsetY,
        drawW, drawH
      );
    } else {
      // Empty slot — show placeholder
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fill();
      ctx.strokeStyle = '#E97132';
      ctx.lineWidth = 4;
      ctx.setLineDash([14, 10]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#7A3E18';
      ctx.font = '600 36px "IBM Plex Sans Thai", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+', l.x + l.width / 2, l.y + l.height / 2 - 30);
      ctx.font = '500 28px "IBM Plex Sans Thai", sans-serif';
      ctx.fillText(l.placeholder || 'แตะเพื่อใส่รูป', l.x + l.width / 2, l.y + l.height / 2 + 20);
    }
    ctx.restore();
  }

  function drawText(l) {
    const text = textState[l.id] != null ? textState[l.id] : l.text;
    if (!text) return;
    ctx.fillStyle = l.color;
    ctx.font = `${l.weight || 500} ${l.size}px "${l.font}", "IBM Plex Sans Thai", sans-serif`;
    ctx.textAlign = l.align || 'left';
    ctx.textBaseline = 'middle';

    const lines = text.split('\n');
    const lineH = l.size * 1.2;
    const startY = l.y - ((lines.length - 1) * lineH) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, l.x, startY + i * lineH);
    });
  }

  // ── Hit testing ──
  function getCanvasCoords(evt) {
    const rect = canvas.getBoundingClientRect();
    const x = (evt.clientX - rect.left) / rect.width  * canvas.width;
    const y = (evt.clientY - rect.top)  / rect.height * canvas.height;
    return { x, y };
  }

  function hitSlot(x, y) {
    // Iterate in reverse (top-most first)
    for (let i = template.layers.length - 1; i >= 0; i--) {
      const l = template.layers[i];
      if (l.type !== 'photo-slot') continue;
      if (x >= l.x && x <= l.x + l.width &&
          y >= l.y && y <= l.y + l.height) {
        return l;
      }
    }
    return null;
  }

  function hitText(x, y) {
    for (let i = template.layers.length - 1; i >= 0; i--) {
      const l = template.layers[i];
      if (l.type !== 'text' || !l.editable) continue;
      // Approximate hit area
      const text = textState[l.id] != null ? textState[l.id] : l.text;
      ctx.font = `${l.weight || 500} ${l.size}px "${l.font}", sans-serif`;
      const w = ctx.measureText(text).width;
      const halfW = w / 2 + 20;
      const halfH = l.size * 0.8;
      if (Math.abs(x - l.x) <= halfW && Math.abs(y - l.y) <= halfH) {
        return l;
      }
    }
    return null;
  }

  // ── Image upload + Auto-fit (cover mode) ──
  function autoFitImage(slot, img) {
    const sx = slot.width  / img.naturalWidth;
    const sy = slot.height / img.naturalHeight;
    const cover = Math.max(sx, sy);
    layerState[slot.id] = {
      img: img,
      scale: cover,
      offsetX: 0,
      offsetY: 0,
      minScale: cover * 0.7,
      maxScale: cover * 3
    };
  }

  // Resize huge images down to 2000px max for memory/performance
  function loadImage(file, cb) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = function () {
      URL.revokeObjectURL(url);
      const MAX = 2000;
      if (img.naturalWidth > MAX || img.naturalHeight > MAX) {
        // Resize via off-screen canvas
        const r = Math.min(MAX / img.naturalWidth, MAX / img.naturalHeight);
        const c = document.createElement('canvas');
        c.width  = Math.round(img.naturalWidth  * r);
        c.height = Math.round(img.naturalHeight * r);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        const out = new Image();
        out.onload = function () { cb(out); };
        out.src = c.toDataURL('image/jpeg', 0.92);
      } else {
        cb(img);
      }
    };
    img.onerror = function () { alert('โหลดรูปไม่สำเร็จ'); };
    img.src = url;
  }

  // ── Canvas click → slot or text ──
  canvas.addEventListener('click', function (evt) {
    if (overlay.classList.contains('show')) return; // editing — ignore canvas clicks
    const { x, y } = getCanvasCoords(evt);

    // text first (smaller area, takes priority over background slots)
    const t = hitText(x, y);
    if (t) {
      openTextEditor(t);
      return;
    }

    const s = hitSlot(x, y);
    if (s) {
      activeSlot = s.id;
      const st = layerState[s.id];
      if (st && st.img) {
        // Already has image → enter edit mode
        openEditMode(s);
      } else {
        // Empty → open file picker
        fileInput.click();
      }
    }
  });

  fileInput.addEventListener('change', function (evt) {
    const file = evt.target.files[0];
    if (!file || !activeSlot) return;
    const slot = template.layers.find(l => l.id === activeSlot);
    loadImage(file, function (img) {
      autoFitImage(slot, img);
      render();
      if (typeof gtag === 'function') {
        gtag('event', 'template_photo_added', { template: template.id });
      }
    });
    evt.target.value = ''; // allow re-upload of same file
  });

  // ── Edit mode (drag to pan + zoom) ──
  function openEditMode(slot) {
    overlay.classList.add('show');
    editPanel.classList.add('show');
    editPanel.dataset.slotId = slot.id;
    updateShapeButtons(slot);
    renderEditOverlay(slot);
  }

  // Highlight the active shape button
  function updateShapeButtons(slot) {
    const current = getShape(slot);
    document.querySelectorAll('.shape-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.shape === current);
    });
  }

  // Wire up shape buttons
  document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!activeSlot) return;
      const slot = template.layers.find(l => l.id === activeSlot);
      const newShape = btn.dataset.shape;
      const st = layerState[slot.id];
      st.shape = newShape;          // store override
      updateShapeButtons(slot);
      renderEditOverlay(slot);
      render();                      // also update background canvas
      if (typeof gtag === 'function') {
        gtag('event', 'template_shape_changed', {
          template: template.id, shape: newShape
        });
      }
    });
  });

  function closeEditMode() {
    overlay.classList.remove('show');
    editPanel.classList.remove('show');
    activeSlot = null;
    render();
  }

  editDoneBtn.addEventListener('click', closeEditMode);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeEditMode();
  });

  editReset.addEventListener('click', function () {
    const slot = template.layers.find(l => l.id === activeSlot);
    const st = layerState[slot.id];
    autoFitImage(slot, st.img);
    renderEditOverlay(slot);
  });

  editZoomIn.addEventListener('click', function () {
    const slot = template.layers.find(l => l.id === activeSlot);
    const st = layerState[slot.id];
    st.scale = Math.min(st.scale * 1.15, st.maxScale || st.scale * 3);
    renderEditOverlay(slot);
  });
  editZoomOut.addEventListener('click', function () {
    const slot = template.layers.find(l => l.id === activeSlot);
    const st = layerState[slot.id];
    st.scale = Math.max(st.scale * 0.87, st.minScale || st.scale * 0.5);
    renderEditOverlay(slot);
  });

  // Render edit overlay using an off-screen canvas to show full image
  // with dimmed area outside the slot
  function renderEditOverlay(slot) {
    const st = layerState[slot.id];
    const oc = document.getElementById('overlayCanvas');
    const octx = oc.getContext('2d');

    // Size overlay canvas to match a comfortable preview
    const W = template.width;
    const H = template.height;
    oc.width = W;
    oc.height = H;

    // 1) Draw full image dimmed
    octx.clearRect(0, 0, W, H);
    octx.fillStyle = '#1a1a1a';
    octx.fillRect(0, 0, W, H);

    const cx = slot.x + slot.width / 2;
    const cy = slot.y + slot.height / 2;
    const drawW = st.img.naturalWidth  * st.scale;
    const drawH = st.img.naturalHeight * st.scale;
    const imgX = cx - drawW / 2 + st.offsetX;
    const imgY = cy - drawH / 2 + st.offsetY;

    octx.globalAlpha = 0.35;
    octx.drawImage(st.img, imgX, imgY, drawW, drawH);
    octx.globalAlpha = 1;

    // 2) Draw image undimmed inside slot (uses effective shape)
    octx.save();
    clipSlot(octx, slot);
    octx.clip();
    octx.drawImage(st.img, imgX, imgY, drawW, drawH);
    octx.restore();

    // 3) Dotted slot border (uses effective shape)
    octx.strokeStyle = '#E97132';
    octx.lineWidth = 6;
    octx.setLineDash([18, 12]);
    clipSlot(octx, slot);
    octx.stroke();
    octx.setLineDash([]);
  }

  // Drag-to-pan + wheel-zoom on overlay
  let dragging = false;
  let lastX = 0, lastY = 0;
  let pinchDist = 0;

  function getOverlayCoords(evt) {
    const oc = document.getElementById('overlayCanvas');
    const rect = oc.getBoundingClientRect();
    const t = evt.touches ? evt.touches[0] : evt;
    const x = (t.clientX - rect.left) / rect.width  * oc.width;
    const y = (t.clientY - rect.top)  / rect.height * oc.height;
    return { x, y };
  }

  document.getElementById('overlayCanvas').addEventListener('pointerdown', function (e) {
    if (!activeSlot) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  });

  document.getElementById('overlayCanvas').addEventListener('pointermove', function (e) {
    if (!dragging || !activeSlot) return;
    const slot = template.layers.find(l => l.id === activeSlot);
    const st = layerState[slot.id];
    const oc = document.getElementById('overlayCanvas');
    const rect = oc.getBoundingClientRect();
    const dx = (e.clientX - lastX) / rect.width  * oc.width;
    const dy = (e.clientY - lastY) / rect.height * oc.height;
    st.offsetX += dx;
    st.offsetY += dy;
    lastX = e.clientX;
    lastY = e.clientY;
    renderEditOverlay(slot);
  });

  document.getElementById('overlayCanvas').addEventListener('pointerup', function (e) {
    dragging = false;
  });

  document.getElementById('overlayCanvas').addEventListener('wheel', function (e) {
    e.preventDefault();
    if (!activeSlot) return;
    const slot = template.layers.find(l => l.id === activeSlot);
    const st = layerState[slot.id];
    const factor = e.deltaY < 0 ? 1.1 : 0.91;
    const newScale = st.scale * factor;
    const min = st.minScale || st.scale * 0.5;
    const max = st.maxScale || st.scale * 3;
    st.scale = Math.max(min, Math.min(max, newScale));
    renderEditOverlay(slot);
  }, { passive: false });

  // Touch pinch zoom
  let pinchStartDist = 0, pinchStartScale = 1;
  document.getElementById('overlayCanvas').addEventListener('touchstart', function (e) {
    if (e.touches.length === 2 && activeSlot) {
      pinchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const slot = template.layers.find(l => l.id === activeSlot);
      pinchStartScale = layerState[slot.id].scale;
    }
  }, { passive: true });

  document.getElementById('overlayCanvas').addEventListener('touchmove', function (e) {
    if (e.touches.length === 2 && activeSlot) {
      e.preventDefault();
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const slot = template.layers.find(l => l.id === activeSlot);
      const st = layerState[slot.id];
      const newScale = pinchStartScale * (d / pinchStartDist);
      const min = st.minScale || st.scale * 0.5;
      const max = st.maxScale || st.scale * 3;
      st.scale = Math.max(min, Math.min(max, newScale));
      renderEditOverlay(slot);
    }
  }, { passive: false });

  // ── Text editing ──
  function openTextEditor(layer) {
    editingTextId = layer.id;
    const ta = document.getElementById('textTextarea');
    ta.value = textState[layer.id];
    textPanel.classList.add('show');
    setTimeout(() => ta.focus(), 50);
  }

  document.getElementById('textSaveBtn').addEventListener('click', function () {
    const ta = document.getElementById('textTextarea');
    if (editingTextId) {
      textState[editingTextId] = ta.value;
      render();
    }
    textPanel.classList.remove('show');
    editingTextId = null;
  });

  document.getElementById('textCancelBtn').addEventListener('click', function () {
    textPanel.classList.remove('show');
    editingTextId = null;
  });

  // ── Reset photo slot (clear image) ──
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (!activeSlot) return;
      if (!confirm('ลบรูปนี้ออกหรือไม่?')) return;
      layerState[activeSlot] = { img: null, scale: 1, offsetX: 0, offsetY: 0 };
      closeEditMode();
    });
  }

  // ── Download / Export ──
  downloadBtn.addEventListener('click', function () {
    // Make sure we render fresh at full template resolution
    render();
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `thaiimg-${template.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (typeof gtag === 'function') {
      gtag('event', 'template_exported', { template: template.id });
    }
  });

  // ── Init ──
  setupCanvas();
  // Wait a moment for fonts to load before first render
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(render);
  } else {
    setTimeout(render, 200);
  }
})();
