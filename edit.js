// ── State ──────────────────────────────────────────
let currentFile = null;
let baseImg = null;        // original Image object
let currentFilter = 'none';

// ── DOM ────────────────────────────────────────────
const dropZone    = document.getElementById('drop-zone');
const fileInput   = document.getElementById('fileInput');
const fileSection = document.getElementById('file-section');
const fileCount   = document.getElementById('file-count');
const convertBtn  = document.getElementById('convertBtn');
const canvas      = document.getElementById('editCanvas');
const ctx         = canvas.getContext('2d');
const filterStrip = document.getElementById('filterStrip');

// ── Filter presets ─────────────────────────────────
const FILTERS = [
  { id: 'none',     name: 'ต้นฉบับ',   css: 'none' },
  { id: 'grayscale',name: 'Grayscale', css: 'grayscale(100%)' },
  { id: 'bw',       name: 'ขาวดำ',     css: 'grayscale(100%) contrast(125%)' },
  { id: 'sharp',    name: 'ความคมชัด', css: 'contrast(140%) saturate(115%)' },
  { id: 'invert',   name: 'กลับสี',    css: 'invert(100%)' },
  { id: 'vintage',  name: 'Vintage',   css: 'sepia(45%) saturate(140%) hue-rotate(-15deg) contrast(95%)' },
  { id: 'polaroid', name: 'Polaroid',  css: 'brightness(108%) contrast(92%) saturate(85%) sepia(15%)' },
  { id: 'kodachr',  name: 'Kodachrome',css: 'contrast(115%) saturate(130%) hue-rotate(-10deg)' },
  { id: 'tech',     name: 'Technicolor',css:'saturate(180%) contrast(115%)' },
  { id: 'brownie',  name: 'Brownie',   css: 'sepia(60%) contrast(110%) saturate(120%) hue-rotate(-10deg)' },
  { id: 'sepia',    name: 'Sepia',     css: 'sepia(100%)' },
  { id: 'mute',     name: 'ลบสี',      css: 'saturate(40%)' },
  { id: 'bright',   name: 'สว่าง',     css: 'brightness(125%)' }
];

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
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    baseImg = img;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    fileSection.hidden = false;
    dropZone.classList.add('compact');
    fileCount.textContent = `${file.name} — ${img.naturalWidth} × ${img.naturalHeight}`;

    currentFilter = 'none';
    applyFilter('none');
    buildFilterStrip();
    resetConvertBtn();
  };
  img.src = url;
}

// ── Apply filter ───────────────────────────────────
function applyFilter(id) {
  const f = FILTERS.find(x => x.id === id) || FILTERS[0];
  currentFilter = id;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = f.css;
  ctx.drawImage(baseImg, 0, 0);
  ctx.filter = 'none';
}

// ── Filter strip thumbnails ────────────────────────
function buildFilterStrip() {
  filterStrip.innerHTML = '';
  const THUMB = 80;
  const size = Math.min(baseImg.naturalWidth, baseImg.naturalHeight);
  const sx = (baseImg.naturalWidth - size) / 2;
  const sy = (baseImg.naturalHeight - size) / 2;

  FILTERS.forEach(f => {
    const item = document.createElement('button');
    item.className = 'filter-item';
    if (f.id === currentFilter) item.classList.add('active');
    item.dataset.filter = f.id;

    const t = document.createElement('canvas');
    t.width = THUMB;
    t.height = THUMB;
    const tctx = t.getContext('2d');
    tctx.filter = f.css;
    tctx.drawImage(baseImg, sx, sy, size, size, 0, 0, THUMB, THUMB);
    tctx.filter = 'none';

    const img = document.createElement('img');
    img.src = t.toDataURL('image/jpeg', 0.85);
    img.alt = f.name;
    item.appendChild(img);

    const label = document.createElement('span');
    label.textContent = f.name;
    item.appendChild(label);

    item.addEventListener('click', () => {
      document.querySelectorAll('.filter-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      applyFilter(f.id);
      resetConvertBtn();
    });

    filterStrip.appendChild(item);
  });
}

// ── Tool tabs ──────────────────────────────────────
document.querySelectorAll('.tool-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tool = tab.dataset.tool;
    document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tool-panel').forEach(p => {
      p.hidden = (p.dataset.toolPanel !== tool);
    });
  });
});

// ── Save & Download ────────────────────────────────
convertBtn.addEventListener('click', async () => {
  if (convertBtn.classList.contains('done')) {
    convertBtn.classList.remove('done');
    resetConvertBtn();
    resetPage();
    return;
  }
  if (!currentFile) return;

  convertBtn.disabled = true;
  try {
    const isPng = currentFile.type === 'image/png' || /\.png$/i.test(currentFile.name);
    const mime = isPng ? 'image/png'
      : currentFile.type === 'image/webp' ? 'image/webp'
      : 'image/jpeg';
    const quality = isPng ? undefined : 0.92;

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(b => b ? resolve(b) : reject(new Error('Canvas failed')), mime, quality);
    });

    downloadFile(blob, currentFile.name);
    convertBtn.textContent = '✓ เซฟเสร็จแล้ว? เริ่มแต่งใหม่';
    convertBtn.classList.add('done');
  } catch (err) {
    console.error('บันทึกไม่สำเร็จ:', err);
  } finally {
    convertBtn.disabled = false;
  }
});

function resetConvertBtn() {
  convertBtn.classList.remove('done');
  convertBtn.innerHTML = 'บันทึก <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 12 L3 14 A1 1 0 0 0 4 15 L14 15 A1 1 0 0 0 15 14 L15 12 M9 3 L9 11 M5.5 7.5 L9 11 L12.5 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
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
  baseImg = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
  filterStrip.innerHTML = '';
  fileSection.hidden = true;
  dropZone.classList.remove('compact');
  fileInput.value = '';
}
