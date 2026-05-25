let selectedFiles = [];
let currentScale = 0.50;
let customWidth = null;
let customHeight = null;

const dropZone    = document.getElementById('drop-zone');
const fileInput   = document.getElementById('fileInput');
const fileSection = document.getElementById('file-section');
const fileGrid    = document.getElementById('file-grid');
const convertBtn  = document.getElementById('convertBtn');
const fileCount   = document.getElementById('file-count');
const progressBox  = document.getElementById('progress-box');
const progressBar  = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const pixelWidthInput  = document.getElementById('pixelWidth');
const pixelHeightInput = document.getElementById('pixelHeight');

const VALID_EXTS  = /\.(jpg|jpeg|png|webp)$/i;
const VALID_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

// ── Scale selector ─────────────────────────────────
document.querySelectorAll('.scale-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentScale = parseFloat(btn.dataset.scale);
    // Clear pixel inputs when switching to preset mode
    pixelWidthInput.value = '';
    pixelHeightInput.value = '';
    customWidth = null;
    customHeight = null;
  });
});

// ── Pixel inputs ───────────────────────────────────
function clampPixel(v) {
  const n = parseInt(v, 10);
  if (!n || n < 1) return null;
  return Math.min(n, 12000);
}

function onPixelChange() {
  customWidth  = clampPixel(pixelWidthInput.value);
  customHeight = clampPixel(pixelHeightInput.value);

  if (customWidth || customHeight) {
    // User is typing → deactivate all preset buttons
    document.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
  } else {
    // Both empty → restore default 50%
    if (!document.querySelector('.scale-btn.active')) {
      const defaultBtn = document.querySelector('.scale-btn[data-scale="0.50"]');
      if (defaultBtn) defaultBtn.classList.add('active');
      currentScale = 0.50;
    }
  }
}

[pixelWidthInput, pixelHeightInput].forEach(inp => {
  inp.addEventListener('input', onPixelChange);
});

// ── File selection ─────────────────────────────────
fileInput.addEventListener('change', (e) => {
  addFiles(Array.from(e.target.files));
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
  addFiles(Array.from(e.dataTransfer.files));
});

document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => {
  e.preventDefault();
  if (selectedFiles.length > 0) addFiles(Array.from(e.dataTransfer.files));
});

// ── File management ────────────────────────────────
function addFiles(files) {
  const valid = files.filter(
    f => VALID_TYPES.has(f.type) || VALID_EXTS.test(f.name)
  );
  if (!valid.length) return;
  selectedFiles = [...selectedFiles, ...valid];
  renderGrid();
}

function renderGrid() {
  if (selectedFiles.length === 0) {
    fileSection.hidden = true;
    dropZone.classList.remove('compact');
    return;
  }

  fileSection.hidden = false;
  dropZone.classList.add('compact');
  fileCount.textContent = `${selectedFiles.length} ไฟล์ที่เลือก`;
  fileGrid.innerHTML = '';

  selectedFiles.forEach((file, index) => {
    const card = document.createElement('div');
    card.className = 'file-card';

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    card.appendChild(img);

    const name = document.createElement('div');
    name.className = 'file-card-name';
    name.textContent = file.name;
    name.title = file.name;
    card.appendChild(name);

    const dims = document.createElement('div');
    dims.className = 'file-card-size';
    dims.textContent = '…';
    card.appendChild(dims);

    img.addEventListener('load', () => {
      dims.textContent = `${img.naturalWidth} × ${img.naturalHeight}`;
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'file-card-remove';
    removeBtn.innerHTML = '&times;';
    removeBtn.title = 'ลบไฟล์';
    removeBtn.addEventListener('click', () => {
      selectedFiles.splice(index, 1);
      renderGrid();
    });
    card.appendChild(removeBtn);

    fileGrid.appendChild(card);
  });
}

// ── Resize & Auto-download ─────────────────────────
convertBtn.addEventListener('click', async () => {
  if (convertBtn.classList.contains('done')) {
    convertBtn.classList.remove('done');
    convertBtn.innerHTML = 'ปรับขนาดรูปภาพ <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="white" stroke-width="1.5"/><path d="M6 9 L12 9 M9.5 6.5 L12 9 L9.5 11.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    resetPage();
    return;
  }
  if (!selectedFiles.length) return;

  const useCustom = customWidth || customHeight;
  const opts = useCustom
    ? { width: customWidth, height: customHeight }
    : { scale: currentScale };

  convertBtn.disabled = true;
  progressBox.hidden = false;
  progressBar.style.width = '0%';

  const zip = new JSZip();
  let success = 0;

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    progressBar.style.width = Math.round((i / selectedFiles.length) * 85) + '%';
    progressText.textContent =
      `กำลังปรับขนาด ${i + 1} / ${selectedFiles.length}: ${file.name}`;

    try {
      const blob = await resizeImage(file, opts);
      zip.file(file.name, blob);
      success++;
    } catch (err) {
      console.error('ปรับขนาดไม่สำเร็จ:', file.name, err);
    }
  }

  if (success > 0) {
    progressBar.style.width = '95%';
    progressText.textContent = 'กำลังสร้างไฟล์ ZIP...';
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadFile(zipBlob, 'thaiimg.zip');

    let doneLabel;
    if (useCustom) {
      const w = customWidth || 'auto';
      const h = customHeight || 'auto';
      doneLabel = `✓ ปรับเป็น ${w}×${h} แล้ว — เริ่มใหม่`;
    } else {
      const pct = currentScale < 1
        ? `${Math.round(currentScale * 100)}%`
        : `x${currentScale}`;
      doneLabel = `✓ ปรับขนาดเป็น ${pct} แล้ว — เริ่มใหม่`;
    }

    progressBox.hidden = true;
    convertBtn.textContent = doneLabel;
    convertBtn.classList.add('done');
    convertBtn.disabled = false;
  } else {
    convertBtn.disabled = false;
  }
});

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
  selectedFiles = [];
  fileGrid.innerHTML = '';
  fileSection.hidden = true;
  progressBox.hidden = true;
  progressBar.style.width = '0%';
  progressText.textContent = '';
  dropZone.classList.remove('compact');
  fileInput.value = '';
}

// ── Resize ─────────────────────────────────────────
function resizeImage(file, opts) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const ow = img.naturalWidth;
      const oh = img.naturalHeight;
      let newW, newH;

      if (opts.scale != null) {
        newW = Math.max(1, Math.round(ow * opts.scale));
        newH = Math.max(1, Math.round(oh * opts.scale));
      } else if (opts.width && opts.height) {
        newW = opts.width;
        newH = opts.height;
      } else if (opts.width) {
        newW = opts.width;
        newH = Math.max(1, Math.round(oh * (opts.width / ow)));
      } else if (opts.height) {
        newH = opts.height;
        newW = Math.max(1, Math.round(ow * (opts.height / oh)));
      } else {
        URL.revokeObjectURL(url);
        reject(new Error('ไม่ได้ระบุขนาด'));
        return;
      }

      // No-op if dimensions unchanged
      if (newW === ow && newH === oh) {
        URL.revokeObjectURL(url);
        resolve(file);
        return;
      }

      const c = document.createElement('canvas');
      c.width = newW;
      c.height = newH;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, newW, newH);
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
