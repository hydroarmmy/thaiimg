let selectedFiles = [];
let dragSrcIndex = null;

const dropZone    = document.getElementById('drop-zone');
const fileInput   = document.getElementById('fileInput');
const fileSection = document.getElementById('file-section');
const fileGrid    = document.getElementById('file-grid');
const convertBtn  = document.getElementById('convertBtn');
const fileCount   = document.getElementById('file-count');
const progressBox  = document.getElementById('progress-box');
const progressBar  = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

const VALID_EXTS  = /\.(jpg|jpeg|png|webp)$/i;
const VALID_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

// ── File selection ─────────────────────────────────
fileInput.addEventListener('change', (e) => {
  addFiles(Array.from(e.target.files));
  fileInput.value = '';
});

// ── Drag & Drop (for upload) ───────────────────────
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
  // Allow file drops on document only if files came from outside the page
  if (selectedFiles.length > 0 && e.dataTransfer && e.dataTransfer.files.length > 0 && dragSrcIndex === null) {
    addFiles(Array.from(e.dataTransfer.files));
  }
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
  fileCount.textContent = `${selectedFiles.length} หน้า (ลากเพื่อสลับลำดับ)`;
  fileGrid.innerHTML = '';

  selectedFiles.forEach((file, index) => {
    const card = document.createElement('div');
    card.className = 'file-card draggable';
    card.draggable = true;
    card.dataset.index = index;

    const pageNum = document.createElement('div');
    pageNum.className = 'page-num';
    pageNum.textContent = `หน้า ${index + 1}`;
    card.appendChild(pageNum);

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

    // Drag reorder handlers
    card.addEventListener('dragstart', (e) => {
      dragSrcIndex = index;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      // Some browsers need data set
      try { e.dataTransfer.setData('text/plain', String(index)); } catch {}
    });

    card.addEventListener('dragover', (e) => {
      if (dragSrcIndex === null) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      card.classList.add('drag-over');
    });

    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });

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

// ── Build PDF ──────────────────────────────────────
convertBtn.addEventListener('click', async () => {
  if (convertBtn.classList.contains('done')) {
    convertBtn.classList.remove('done');
    convertBtn.innerHTML = 'รวมเป็น PDF <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 12 L3 14 A1 1 0 0 0 4 15 L14 15 A1 1 0 0 0 15 14 L15 12 M9 3 L9 11 M5.5 7.5 L9 11 L12.5 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
    resetPage();
    return;
  }
  if (!selectedFiles.length) return;

  convertBtn.disabled = true;
  progressBox.hidden = false;
  progressBar.style.width = '0%';

  try {
    const { jsPDF } = window.jspdf;
    let doc = null;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      progressBar.style.width = Math.round((i / selectedFiles.length) * 85) + '%';
      progressText.textContent = `กำลังเพิ่มหน้า ${i + 1} / ${selectedFiles.length}: ${file.name}`;

      const { dataUrl, width, height } = await imageToJpegDataUrl(file);
      const orientation = width > height ? 'l' : 'p';

      if (i === 0) {
        doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
      } else {
        doc.addPage('a4', orientation);
      }

      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 10;
      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2;
      const ratio = Math.min(availW / width, availH / height);
      const w = width * ratio;
      const h = height * ratio;
      const x = (pageW - w) / 2;
      const y = (pageH - h) / 2;

      doc.addImage(dataUrl, 'JPEG', x, y, w, h);
    }

    progressBar.style.width = '95%';
    progressText.textContent = 'กำลังสร้างไฟล์ PDF...';

    const blob = doc.output('blob');
    downloadFile(blob, 'thaiimg.pdf');

    progressBox.hidden = true;
    convertBtn.textContent = '✓ เซฟเสร็จแล้ว? รวม PDF ใหม่';
    convertBtn.classList.add('done');
  } catch (err) {
    console.error('รวม PDF ไม่สำเร็จ:', err);
    progressText.textContent = '❌ เกิดข้อผิดพลาด: ' + (err.message || 'ไม่ทราบสาเหตุ');
  } finally {
    convertBtn.disabled = false;
  }
});

// Convert any image to JPEG data URL via canvas
// (handles WEBP and ensures consistent format for jsPDF)
function imageToJpegDataUrl(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve({
        dataUrl: c.toDataURL('image/jpeg', 0.92),
        width: c.width,
        height: c.height
      });
    };
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
