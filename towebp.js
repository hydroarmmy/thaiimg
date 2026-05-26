let selectedFiles = [];
let currentQuality = 0.85;

const dropZone    = document.getElementById('drop-zone');
const fileInput   = document.getElementById('fileInput');
const fileSection = document.getElementById('file-section');
const fileGrid    = document.getElementById('file-grid');
const convertBtn  = document.getElementById('convertBtn');
const fileCount   = document.getElementById('file-count');
const progressBox  = document.getElementById('progress-box');
const progressBar  = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

const VALID_EXTS  = /\.(png|gif|webp|heic|heif|jpg|jpeg)$/i;
const VALID_TYPES = new Set([
  'image/png','image/gif','image/webp',
  'image/heic','image/heif','image/jpeg'
]);

// Quality selector
document.querySelectorAll('.quality-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentQuality = parseFloat(btn.dataset.quality);
  });
});

fileInput.addEventListener('change', (e) => {
  addFiles(Array.from(e.target.files));
  fileInput.value = '';
});

dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('hover'); });
dropZone.addEventListener('dragleave', (e) => { if (!dropZone.contains(e.relatedTarget)) dropZone.classList.remove('hover'); });
dropZone.addEventListener('drop', (e) => {
  e.preventDefault(); e.stopPropagation();
  dropZone.classList.remove('hover');
  addFiles(Array.from(e.dataTransfer.files));
});
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => {
  e.preventDefault();
  if (selectedFiles.length > 0) addFiles(Array.from(e.dataTransfer.files));
});

function addFiles(files) {
  const valid = files.filter(f => VALID_TYPES.has(f.type) || VALID_EXTS.test(f.name));
  if (!valid.length) return;
  selectedFiles = [...selectedFiles, ...valid];
  renderGrid();
}

function isHeic(file) {
  return file.type === 'image/heic' || file.type === 'image/heif' || /\.(heic|heif)$/i.test(file.name);
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
    if (isHeic(file)) {
      const thumb = document.createElement('div');
      thumb.className = 'heic-thumb';
      thumb.textContent = 'HEIC';
      card.appendChild(thumb);
    } else {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      card.appendChild(img);
    }
    const name = document.createElement('div');
    name.className = 'file-card-name';
    name.textContent = file.name;
    name.title = file.name;
    card.appendChild(name);
    const removeBtn = document.createElement('button');
    removeBtn.className = 'file-card-remove';
    removeBtn.innerHTML = '&times;';
    removeBtn.title = 'ลบไฟล์';
    removeBtn.addEventListener('click', () => { selectedFiles.splice(index, 1); renderGrid(); });
    card.appendChild(removeBtn);
    fileGrid.appendChild(card);
  });
}

convertBtn.addEventListener('click', async () => {
  if (convertBtn.classList.contains('done')) {
    convertBtn.classList.remove('done');
    convertBtn.innerHTML = 'แปลงเป็น WEBP <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="white" stroke-width="1.5"/><path d="M6 9 L12 9 M9.5 6.5 L12 9 L9.5 11.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    resetPage();
    return;
  }
  if (!selectedFiles.length) return;

  convertBtn.disabled = true;
  progressBox.hidden = false;
  progressBar.style.width = '0%';

  const zip = new JSZip();
  let success = 0;

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    progressBar.style.width = Math.round((i / selectedFiles.length) * 85) + '%';
    progressText.textContent = `กำลังแปลง ${i + 1} / ${selectedFiles.length}: ${file.name}`;
    try {
      const blob = await convertToWebp(file);
      zip.file(toWebpName(file.name), blob);
      success++;
    } catch (err) {
      console.error('แปลงไม่สำเร็จ:', file.name, err);
    }
  }

  if (success > 0) {
    progressBar.style.width = '95%';
    progressText.textContent = 'กำลังสร้างไฟล์ ZIP...';
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadFile(zipBlob, 'thaiimg.zip');
    progressBox.hidden = true;
    convertBtn.textContent = '✓ เซฟเสร็จแล้ว? เริ่มแปลงใหม่';
    convertBtn.classList.add('done');
    convertBtn.disabled = false;
  } else {
    convertBtn.disabled = false;
  }
});

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

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

async function convertToWebp(file) {
  // HEIC → first decode to PNG via heic2any, then re-encode as WEBP via canvas
  if (isHeic(file)) {
    const intermediate = await heic2any({ blob: file, toType: 'image/png' });
    const pngBlob = Array.isArray(intermediate) ? intermediate[0] : intermediate;
    return convertViaCanvas(pngBlob);
  }
  return convertViaCanvas(file);
}

function convertViaCanvas(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      c.toBlob(b => b ? resolve(b) : reject(new Error('Canvas failed')), 'image/webp', currentQuality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Load failed')); };
    img.src = url;
  });
}

function toWebpName(filename) {
  return filename.replace(/\.[^/.]+$/, '') + '.webp';
}
