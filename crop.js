// ── State ──────────────────────────────────────────
let currentFile = null;
let imgW = 0, imgH = 0;      // natural image size (px)
let cropX = 0, cropY = 0;     // crop position in natural px
let cropW = 0, cropH = 0;     // crop size in natural px
let displayScale = 1;          // displayed / natural ratio

const MIN_SIZE = 10;

// ── DOM ────────────────────────────────────────────
const dropZone    = document.getElementById('drop-zone');
const fileInput   = document.getElementById('fileInput');
const fileSection = document.getElementById('file-section');
const fileCount   = document.getElementById('file-count');
const convertBtn  = document.getElementById('convertBtn');
const cropWrap    = document.getElementById('cropWrap');
const cropImg     = document.getElementById('cropImg');
const cropBox     = document.getElementById('cropBox');

const inW = document.getElementById('cropW');
const inH = document.getElementById('cropH');
const inX = document.getElementById('cropX');
const inY = document.getElementById('cropY');

// ── File selection ─────────────────────────────────
fileInput.addEventListener('change', (e) => {
  if (e.target.files[0]) loadFile(e.target.files[0]);
  fileInput.value = '';
});

// ── Drag & Drop ────────────────────────────────────
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('hover');
});
dropZone.addEventListener('dragleave', (e) => {
  if (!dropZone.contains(e.relatedTarget)) dropZone.classList.remove('hover');
});
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('hover');
  if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
});
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => {
  e.preventDefault();
  if (currentFile && e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
});

function loadFile(file) {
  const validExt = /\.(jpg|jpeg|png|webp)$/i.test(file.name);
  const validType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  if (!validExt && !validType) return;

  currentFile = file;
  const url = URL.createObjectURL(file);
  cropImg.onload = () => {
    URL.revokeObjectURL(url);
    imgW = cropImg.naturalWidth;
    imgH = cropImg.naturalHeight;

    // Unhide first so the image has rendered dimensions
    fileSection.hidden = false;
    dropZone.classList.add('compact');
    fileCount.textContent = `${file.name} — ${imgW} × ${imgH}`;

    initCropBox();
  };
  cropImg.src = url;
}

// ── Init crop box ──────────────────────────────────
function initCropBox() {
  // Default: 80% centered
  cropW = Math.round(imgW * 0.8);
  cropH = Math.round(imgH * 0.8);
  cropX = Math.round((imgW - cropW) / 2);
  cropY = Math.round((imgH - cropH) / 2);
  cropBox.hidden = false;
  updateScale();
  updateBoxStyle();
  updateInputs();
}

function updateScale() {
  const rect = cropImg.getBoundingClientRect();
  displayScale = rect.width / imgW;
}

window.addEventListener('resize', () => {
  if (!currentFile) return;
  updateScale();
  updateBoxStyle();
});

// ── Box <-> Inputs sync ────────────────────────────
function updateBoxStyle() {
  cropBox.style.left   = (cropX * displayScale) + 'px';
  cropBox.style.top    = (cropY * displayScale) + 'px';
  cropBox.style.width  = (cropW * displayScale) + 'px';
  cropBox.style.height = (cropH * displayScale) + 'px';
}

function updateInputs() {
  inW.value = cropW;
  inH.value = cropH;
  inX.value = cropX;
  inY.value = cropY;
}

function clampCrop() {
  cropW = Math.max(MIN_SIZE, Math.min(cropW, imgW));
  cropH = Math.max(MIN_SIZE, Math.min(cropH, imgH));
  cropX = Math.max(0, Math.min(cropX, imgW - cropW));
  cropY = Math.max(0, Math.min(cropY, imgH - cropH));
}

[inW, inH, inX, inY].forEach(inp => {
  inp.addEventListener('input', () => {
    cropW = parseInt(inW.value) || MIN_SIZE;
    cropH = parseInt(inH.value) || MIN_SIZE;
    cropX = parseInt(inX.value) || 0;
    cropY = parseInt(inY.value) || 0;
    clampCrop();
    updateBoxStyle();
  });
  inp.addEventListener('blur', () => {
    updateInputs(); // reflect clamped values
  });
});

// ── Drag / Resize handlers ─────────────────────────
let dragMode = null; // 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e'
let dragStart = null;

cropBox.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  if (e.target.classList.contains('crop-handle')) {
    dragMode = e.target.dataset.h;
  } else {
    dragMode = 'move';
  }
  dragStart = {
    x: e.clientX,
    y: e.clientY,
    cx: cropX, cy: cropY,
    cw: cropW, ch: cropH
  };
  cropBox.setPointerCapture(e.pointerId);
});

cropBox.addEventListener('pointermove', (e) => {
  if (!dragMode) return;
  const dx = (e.clientX - dragStart.x) / displayScale;
  const dy = (e.clientY - dragStart.y) / displayScale;
  applyDrag(dx, dy);
  updateBoxStyle();
  updateInputs();
});

cropBox.addEventListener('pointerup', (e) => {
  dragMode = null;
  try { cropBox.releasePointerCapture(e.pointerId); } catch {}
});
cropBox.addEventListener('pointercancel', () => { dragMode = null; });

function applyDrag(dx, dy) {
  const s = dragStart;
  let nx = s.cx, ny = s.cy, nw = s.cw, nh = s.ch;

  if (dragMode === 'move') {
    nx = s.cx + dx;
    ny = s.cy + dy;
  } else {
    if (dragMode.includes('w')) { nx = s.cx + dx; nw = s.cw - dx; }
    if (dragMode.includes('e')) { nw = s.cw + dx; }
    if (dragMode.includes('n')) { ny = s.cy + dy; nh = s.ch - dy; }
    if (dragMode.includes('s')) { nh = s.ch + dy; }

    // Prevent inversion: if width/height goes below min, lock the moving edge
    if (nw < MIN_SIZE) {
      if (dragMode.includes('w')) nx = s.cx + s.cw - MIN_SIZE;
      nw = MIN_SIZE;
    }
    if (nh < MIN_SIZE) {
      if (dragMode.includes('n')) ny = s.cy + s.ch - MIN_SIZE;
      nh = MIN_SIZE;
    }
  }

  cropX = Math.round(nx);
  cropY = Math.round(ny);
  cropW = Math.round(nw);
  cropH = Math.round(nh);
  clampCrop();
}

// ── Crop & Download ────────────────────────────────
convertBtn.addEventListener('click', async () => {
  if (convertBtn.classList.contains('done')) {
    convertBtn.classList.remove('done');
    convertBtn.innerHTML = 'ครอบตัดรูปภาพ <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="white" stroke-width="1.5"/><path d="M6 9 L12 9 M9.5 6.5 L12 9 L9.5 11.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    resetPage();
    return;
  }
  if (!currentFile) return;

  convertBtn.disabled = true;
  try {
    const blob = await cropImage(currentFile, cropX, cropY, cropW, cropH);
    downloadFile(blob, currentFile.name);
    convertBtn.textContent = '✓ เซฟเสร็จแล้ว? เริ่มครอบตัดใหม่';
    convertBtn.classList.add('done');
  } catch (err) {
    console.error('ครอบตัดไม่สำเร็จ:', err);
  } finally {
    convertBtn.disabled = false;
  }
});

function cropImage(file, x, y, w, h) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      URL.revokeObjectURL(url);

      const isPng = file.type === 'image/png' || /\.png$/i.test(file.name);
      const mime = isPng ? 'image/png'
        : file.type === 'image/webp' ? 'image/webp'
        : 'image/jpeg';
      const quality = isPng ? undefined : 0.92;

      c.toBlob(
        b => b ? resolve(b) : reject(new Error('Canvas failed')),
        mime, quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Load failed')); };
    img.src = url;
  });
}

// ── Download ───────────────────────────────────────
function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Reset ──────────────────────────────────────────
function resetPage() {
  currentFile = null;
  cropImg.removeAttribute('src');
  cropBox.hidden = true;
  fileSection.hidden = true;
  dropZone.classList.remove('compact');
  fileInput.value = '';
}
