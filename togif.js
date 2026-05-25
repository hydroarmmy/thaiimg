let selectedFiles = [];
let dragSrcIndex = null;
let frameDelay = 300;

const MAX_DIM = 800;
const GIF_WORKER_CDN = 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js';
let cachedWorkerUrl = null;

// Fetch worker script and convert to Blob URL so it loads as same-origin
// (browsers block Workers built directly from cross-origin script URLs)
async function getWorkerUrl() {
  if (cachedWorkerUrl) return cachedWorkerUrl;
  const r = await fetch(GIF_WORKER_CDN);
  if (!r.ok) throw new Error('โหลด gif worker ไม่สำเร็จ');
  const text = await r.text();
  const blob = new Blob([text], { type: 'application/javascript' });
  cachedWorkerUrl = URL.createObjectURL(blob);
  return cachedWorkerUrl;
}

const dropZone    = document.getElementById('drop-zone');
const fileInput   = document.getElementById('fileInput');
const fileSection = document.getElementById('file-section');
const fileGrid    = document.getElementById('file-grid');
const convertBtn  = document.getElementById('convertBtn');
const fileCount   = document.getElementById('file-count');
const progressBox  = document.getElementById('progress-box');
const progressBar  = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const delayInput   = document.getElementById('frameDelay');
const delayLabel   = document.getElementById('delayLabel');
const fpsLabel     = document.getElementById('fpsLabel');

const VALID_EXTS  = /\.(jpg|jpeg|png|webp)$/i;
const VALID_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

// ── Frame delay slider ─────────────────────────────
delayInput.addEventListener('input', () => {
  frameDelay = parseInt(delayInput.value) || 300;
  delayLabel.textContent = frameDelay;
  fpsLabel.textContent = (1000 / frameDelay).toFixed(1);
});

// ── File selection ─────────────────────────────────
fileInput.addEventListener('change', (e) => {
  addFiles(Array.from(e.target.files));
  fileInput.value = '';
});

// ── Drag & Drop (upload) ───────────────────────────
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
  if (selectedFiles.length > 0 && e.dataTransfer && e.dataTransfer.files.length > 0 && dragSrcIndex === null) {
    addFiles(Array.from(e.dataTransfer.files));
  }
});

// ── File management ────────────────────────────────
function addFiles(files) {
  const valid = files.filter(f => VALID_TYPES.has(f.type) || VALID_EXTS.test(f.name));
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
  fileCount.textContent = `${selectedFiles.length} เฟรม (ลากเพื่อสลับลำดับ)`;
  fileGrid.innerHTML = '';

  selectedFiles.forEach((file, index) => {
    const card = document.createElement('div');
    card.className = 'file-card draggable';
    card.draggable = true;
    card.dataset.index = index;

    const num = document.createElement('div');
    num.className = 'page-num';
    num.textContent = `เฟรม ${index + 1}`;
    card.appendChild(num);

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    img.draggable = false;
    card.appendChild(img);

    const name = document.createElement('div');
    name.className = 'file-card-name';
    name.textContent = file.name;
    name.title = file.name;
    card.appendChild(name);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'file-card-remove';
    removeBtn.innerHTML = '&times;';
    removeBtn.title = 'ลบไฟล์';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedFiles.splice(index, 1);
      renderGrid();
    });
    card.appendChild(removeBtn);

    // Drag reorder
    card.addEventListener('dragstart', (e) => {
      dragSrcIndex = index;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', String(index)); } catch {}
    });
    card.addEventListener('dragover', (e) => {
      if (dragSrcIndex === null) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      card.classList.remove('drag-over');
      if (dragSrcIndex === null || dragSrcIndex === index) return;
      const moved = selectedFiles.splice(dragSrcIndex, 1)[0];
      selectedFiles.splice(index, 0, moved);
      dragSrcIndex = null;
      renderGrid();
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.file-card').forEach(c => c.classList.remove('drag-over'));
      dragSrcIndex = null;
    });

    fileGrid.appendChild(card);
  });
}

// ── Build GIF ──────────────────────────────────────
convertBtn.addEventListener('click', async () => {
  if (convertBtn.classList.contains('done')) {
    convertBtn.classList.remove('done');
    convertBtn.innerHTML = 'สร้าง GIF <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 12 L3 14 A1 1 0 0 0 4 15 L14 15 A1 1 0 0 0 15 14 L15 12 M9 3 L9 11 M5.5 7.5 L9 11 L12.5 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
    resetPage();
    return;
  }
  if (!selectedFiles.length) return;

  convertBtn.disabled = true;
  progressBox.hidden = false;
  progressBar.style.width = '0%';
  progressText.textContent = 'กำลังโหลดภาพ...';

  try {
    // Load all images
    const images = await Promise.all(selectedFiles.map(loadImage));

    // Determine output dimensions from first image (capped at MAX_DIM)
    let outW = images[0].naturalWidth;
    let outH = images[0].naturalHeight;
    if (Math.max(outW, outH) > MAX_DIM) {
      const s = MAX_DIM / Math.max(outW, outH);
      outW = Math.round(outW * s);
      outH = Math.round(outH * s);
    }

    progressText.textContent = `กำลังเตรียม ${images.length} เฟรม...`;
    progressBar.style.width = '10%';

    const workerScript = await getWorkerUrl();
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: outW,
      height: outH,
      workerScript: workerScript
    });

    for (const img of images) {
      const c = document.createElement('canvas');
      c.width = outW; c.height = outH;
      const cx = c.getContext('2d');
      cx.fillStyle = '#ffffff';
      cx.fillRect(0, 0, outW, outH);
      const r = Math.min(outW / img.naturalWidth, outH / img.naturalHeight);
      const w = img.naturalWidth * r;
      const h = img.naturalHeight * r;
      cx.drawImage(img, (outW - w) / 2, (outH - h) / 2, w, h);
      gif.addFrame(c, { delay: frameDelay, copy: true });
    }

    const blob = await new Promise((resolve, reject) => {
      gif.on('progress', (p) => {
        const pct = Math.round(10 + p * 85);
        progressBar.style.width = pct + '%';
        progressText.textContent = `กำลังสร้าง GIF: ${Math.round(p * 100)}%`;
      });
      gif.on('finished', resolve);
      gif.on('abort', () => reject(new Error('Aborted')));
      gif.render();
    });

    progressBar.style.width = '100%';
    downloadFile(blob, 'thaiimg.gif');

    progressBox.hidden = true;
    const sizeMB = (blob.size / 1024 / 1024).toFixed(2);
    convertBtn.textContent = `✓ สร้าง GIF เสร็จ (${sizeMB} MB) — สร้างใหม่`;
    convertBtn.classList.add('done');
  } catch (err) {
    console.error('สร้าง GIF ไม่สำเร็จ:', err);
    progressText.textContent = '❌ เกิดข้อผิดพลาด: ' + (err.message || 'ไม่ทราบสาเหตุ');
  } finally {
    convertBtn.disabled = false;
  }
});

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('โหลดภาพไม่สำเร็จ')); };
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
  selectedFiles = [];
  fileGrid.innerHTML = '';
  fileSection.hidden = true;
  progressBox.hidden = true;
  progressBar.style.width = '0%';
  progressText.textContent = '';
  dropZone.classList.remove('compact');
  fileInput.value = '';
}
