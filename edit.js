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
const bgRemoveBtn = document.getElementById('bgRemoveBtn');
const bgStatus    = document.getElementById('bgStatus');

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

    fileSection.hidden = false;
    dropZone.classList.add('compact');
    fileCount.textContent = `${file.name} — ${img.naturalWidth} × ${img.naturalHeight}`;

    setBaseImage(img);
    resetConvertBtn();
    if (bgStatus) bgStatus.textContent = '';
  };
  img.src = url;
}

function setBaseImage(img) {
  baseImg = img;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  currentFilter = 'none';
  applyFilter('none');
  buildFilterStrip();
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
let currentTool = 'filter';
const editStage = document.querySelector('.edit-stage');

document.querySelectorAll('.tool-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const newTool = tab.dataset.tool;
    // Auto-bake pending overlays when leaving that mode
    if (currentTool === 'text' && newTool !== 'text') bakeText();
    if (currentTool === 'sticker' && newTool !== 'sticker') bakeSticker();
    currentTool = newTool;
    document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tool-panel').forEach(p => {
      p.hidden = (p.dataset.toolPanel !== newTool);
    });
    editStage.classList.toggle('draw-mode', newTool === 'draw');
    updateTextOverlay();
    updateStickerOverlay();
  });
});

// ── Draw tool ──────────────────────────────────────
let brushColor = '#000000';
let brushWidth = 8;
let drawing = false;
let lastPt = null;

const customColor    = document.getElementById('customColor');
const brushSizeInput = document.getElementById('brushSize');
const brushSizeLabel = document.getElementById('brushSizeLabel');

document.querySelectorAll('.color-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    brushColor = sw.dataset.color;
    customColor.value = brushColor;
  });
});

customColor.addEventListener('input', () => {
  brushColor = customColor.value;
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
});

brushSizeInput.addEventListener('input', () => {
  brushWidth = parseInt(brushSizeInput.value) || 1;
  brushSizeLabel.textContent = brushWidth;
});

function canvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

function ensureBaseImgCanvas() {
  if (baseImg instanceof HTMLCanvasElement) return;
  const c = document.createElement('canvas');
  c.width = baseImg.naturalWidth || baseImg.width;
  c.height = baseImg.naturalHeight || baseImg.height;
  c.getContext('2d').drawImage(baseImg, 0, 0);
  baseImg = c;
}

function strokeSegment(context, from, to, color, width) {
  context.strokeStyle = color;
  context.lineWidth = width;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(to.x, to.y);
  context.stroke();
}

canvas.addEventListener('pointerdown', (e) => {
  if (!baseImg) return;

  // In text mode: click on canvas to place text there
  if (currentTool === 'text') {
    if (textValue.trim()) {
      e.preventDefault();
      const pt = canvasCoords(e);
      textX = pt.x;
      textY = pt.y;
      updateTextOverlay();
    }
    return;
  }

  // In sticker mode: click on canvas to place sticker there
  if (currentTool === 'sticker') {
    if (stickerChar) {
      e.preventDefault();
      const pt = canvasCoords(e);
      stickerX = pt.x;
      stickerY = pt.y;
      updateStickerOverlay();
    }
    return;
  }

  if (currentTool !== 'draw') return;
  e.preventDefault();
  drawing = true;
  try { canvas.setPointerCapture(e.pointerId); } catch {}
  lastPt = canvasCoords(e);
  // Draw a dot at start so single clicks register
  ensureBaseImgCanvas();
  const bctx = baseImg.getContext('2d');
  bctx.fillStyle = brushColor;
  bctx.beginPath();
  bctx.arc(lastPt.x, lastPt.y, brushWidth / 2, 0, Math.PI * 2);
  bctx.fill();
  ctx.fillStyle = brushColor;
  ctx.beginPath();
  ctx.arc(lastPt.x, lastPt.y, brushWidth / 2, 0, Math.PI * 2);
  ctx.fill();
});

canvas.addEventListener('pointermove', (e) => {
  if (!drawing) return;
  const pt = canvasCoords(e);
  strokeSegment(ctx, lastPt, pt, brushColor, brushWidth);
  ensureBaseImgCanvas();
  strokeSegment(baseImg.getContext('2d'), lastPt, pt, brushColor, brushWidth);
  lastPt = pt;
});

canvas.addEventListener('pointerup', (e) => {
  if (!drawing) return;
  drawing = false;
  try { canvas.releasePointerCapture(e.pointerId); } catch {}
});
canvas.addEventListener('pointercancel', () => { drawing = false; });

// ── Text tool ──────────────────────────────────────
let textValue = '';
let textColor = '#000000';
let textSize = 48;
let textFont = 'Tahoma, sans-serif';
let textX = null;
let textY = null;

const textInput        = document.getElementById('textInput');
const textSizeInput    = document.getElementById('textSize');
const textSizeLabel    = document.getElementById('textSizeLabel');
const textFontSelect   = document.getElementById('textFont');
const textCustomColor  = document.getElementById('textCustomColor');
const applyTextBtn     = document.getElementById('applyTextBtn');
const textOverlay      = document.getElementById('textOverlay');

textInput.addEventListener('input', () => {
  textValue = textInput.value;
  // First non-empty text → place at center
  if (textValue.trim() && textX === null && baseImg) {
    textX = canvas.width / 2;
    textY = canvas.height / 2;
  }
  updateTextOverlay();
});

textSizeInput.addEventListener('input', () => {
  textSize = parseInt(textSizeInput.value) || 12;
  textSizeLabel.textContent = textSize;
  updateTextOverlay();
});

textFontSelect.addEventListener('change', () => {
  textFont = textFontSelect.value;
  updateTextOverlay();
});

document.querySelectorAll('.text-color-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.text-color-swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    textColor = sw.dataset.color;
    textCustomColor.value = textColor;
    updateTextOverlay();
  });
});

textCustomColor.addEventListener('input', () => {
  textColor = textCustomColor.value;
  document.querySelectorAll('.text-color-swatch').forEach(s => s.classList.remove('active'));
  updateTextOverlay();
});

function updateTextOverlay() {
  if (!baseImg || currentTool !== 'text' || !textValue.trim()) {
    textOverlay.hidden = true;
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const scale = rect.width / canvas.width || 1;
  textOverlay.hidden = false;
  textOverlay.textContent = textValue;
  textOverlay.style.fontFamily = textFont;
  textOverlay.style.fontSize = (textSize * scale) + 'px';
  textOverlay.style.color = textColor;
  textOverlay.style.left = (textX * scale) + 'px';
  textOverlay.style.top = (textY * scale) + 'px';
}

// Drag the text overlay
let textDragging = false;
let textDragStart = null;

textOverlay.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  e.stopPropagation();
  textDragging = true;
  try { textOverlay.setPointerCapture(e.pointerId); } catch {}
  textDragStart = { clientX: e.clientX, clientY: e.clientY, tx: textX, ty: textY };
});

textOverlay.addEventListener('pointermove', (e) => {
  if (!textDragging) return;
  const rect = canvas.getBoundingClientRect();
  const scale = rect.width / canvas.width || 1;
  textX = textDragStart.tx + (e.clientX - textDragStart.clientX) / scale;
  textY = textDragStart.ty + (e.clientY - textDragStart.clientY) / scale;
  textX = Math.max(0, Math.min(textX, canvas.width));
  textY = Math.max(0, Math.min(textY, canvas.height));
  updateTextOverlay();
});

textOverlay.addEventListener('pointerup', (e) => {
  textDragging = false;
  try { textOverlay.releasePointerCapture(e.pointerId); } catch {}
});
textOverlay.addEventListener('pointercancel', () => { textDragging = false; });

function bakeText() {
  if (!baseImg || !textValue.trim() || textX === null) return;
  ensureBaseImgCanvas();
  const bctx = baseImg.getContext('2d');
  bctx.font = `700 ${textSize}px ${textFont}`;
  bctx.fillStyle = textColor;
  bctx.textBaseline = 'top';
  bctx.fillText(textValue, textX, textY);
  applyFilter(currentFilter);
  // Reset for next entry
  textInput.value = '';
  textValue = '';
  textX = null; textY = null;
  textOverlay.hidden = true;
}

applyTextBtn.addEventListener('click', bakeText);

window.addEventListener('resize', () => {
  if (currentTool === 'text') updateTextOverlay();
  if (currentTool === 'sticker') updateStickerOverlay();
});

// ── Sticker tool ───────────────────────────────────
const STICKERS = [
  '😀','😁','😂','🤣','😊','😍','🥰','😘','😎','🤩',
  '😢','😭','😱','😔','🥺','🤔','😴','🤯','🥳','😈',
  '👍','👎','👏','🙏','💪','✌️','🤘','✊','🤞','🤝',
  '❤️','💕','💯','✨','🔥','⭐','🌈','☀️','🌙','💫',
  '🐶','🐱','🦊','🐼','🐨','🦄','🐸','🐯','🦁','🐵',
  '🍕','🍔','🍦','🍰','🍎','🍌','☕','🍿','🎉','🎁',
  '🎈','🎵','📷','✅','❌','❗','💡','🌸','👑','🎀'
];

let stickerChar = '';
let stickerSize = 100;
let stickerX = null;
let stickerY = null;

const stickerGrid      = document.getElementById('stickerGrid');
const stickerSizeInput = document.getElementById('stickerSize');
const stickerSizeLabel = document.getElementById('stickerSizeLabel');
const applyStickerBtn  = document.getElementById('applyStickerBtn');
const stickerOverlay   = document.getElementById('stickerOverlay');

STICKERS.forEach(s => {
  const btn = document.createElement('button');
  btn.className = 'sticker-item';
  btn.textContent = s;
  btn.dataset.sticker = s;
  btn.title = s;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sticker-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    stickerChar = s;
    if (stickerX === null && baseImg) {
      stickerX = canvas.width / 2 - stickerSize / 2;
      stickerY = canvas.height / 2 - stickerSize / 2;
    }
    updateStickerOverlay();
  });
  stickerGrid.appendChild(btn);
});

stickerSizeInput.addEventListener('input', () => {
  stickerSize = parseInt(stickerSizeInput.value) || 30;
  stickerSizeLabel.textContent = stickerSize;
  updateStickerOverlay();
});

function updateStickerOverlay() {
  if (!baseImg || currentTool !== 'sticker' || !stickerChar) {
    stickerOverlay.hidden = true;
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const scale = rect.width / canvas.width || 1;
  stickerOverlay.hidden = false;
  stickerOverlay.textContent = stickerChar;
  stickerOverlay.style.fontSize = (stickerSize * scale) + 'px';
  stickerOverlay.style.left = (stickerX * scale) + 'px';
  stickerOverlay.style.top = (stickerY * scale) + 'px';
}

// Drag the sticker overlay
let stickerDragging = false;
let stickerDragStart = null;

stickerOverlay.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  e.stopPropagation();
  stickerDragging = true;
  try { stickerOverlay.setPointerCapture(e.pointerId); } catch {}
  stickerDragStart = { clientX: e.clientX, clientY: e.clientY, tx: stickerX, ty: stickerY };
});

stickerOverlay.addEventListener('pointermove', (e) => {
  if (!stickerDragging) return;
  const rect = canvas.getBoundingClientRect();
  const scale = rect.width / canvas.width || 1;
  stickerX = stickerDragStart.tx + (e.clientX - stickerDragStart.clientX) / scale;
  stickerY = stickerDragStart.ty + (e.clientY - stickerDragStart.clientY) / scale;
  stickerX = Math.max(0, Math.min(stickerX, canvas.width));
  stickerY = Math.max(0, Math.min(stickerY, canvas.height));
  updateStickerOverlay();
});

stickerOverlay.addEventListener('pointerup', (e) => {
  stickerDragging = false;
  try { stickerOverlay.releasePointerCapture(e.pointerId); } catch {}
});
stickerOverlay.addEventListener('pointercancel', () => { stickerDragging = false; });

function bakeSticker() {
  if (!baseImg || !stickerChar || stickerX === null) return;
  ensureBaseImgCanvas();
  const bctx = baseImg.getContext('2d');
  bctx.font = `${stickerSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  bctx.textBaseline = 'top';
  bctx.fillText(stickerChar, stickerX, stickerY);
  applyFilter(currentFilter);
  document.querySelectorAll('.sticker-item').forEach(b => b.classList.remove('active'));
  stickerChar = '';
  stickerX = null; stickerY = null;
  stickerOverlay.hidden = true;
}

applyStickerBtn.addEventListener('click', bakeSticker);

// ── Background removal (AI) ────────────────────────
let imglyRemoveBackground = null;

async function loadImgly() {
  if (imglyRemoveBackground) return imglyRemoveBackground;
  bgStatus.textContent = '⏳ กำลังโหลดไลบรารี AI...';
  const mod = await import('https://esm.sh/@imgly/background-removal@1.5.5');
  imglyRemoveBackground = mod.default || mod.removeBackground;
  return imglyRemoveBackground;
}

bgRemoveBtn.addEventListener('click', async () => {
  if (!currentFile) {
    bgStatus.textContent = 'กรุณาเลือกรูปภาพก่อน';
    return;
  }

  bgRemoveBtn.disabled = true;
  try {
    const removeBackground = await loadImgly();
    bgStatus.textContent = '⏳ กำลังประมวลผล (ครั้งแรกอาจดาวน์โหลดโมเดล ~5MB)...';

    // Use current canvas state as input (so applied filter is baked in)
    const inputBlob = await new Promise(r => canvas.toBlob(r, 'image/png'));

    const blob = await removeBackground(inputBlob, {
      progress: (key, current, total) => {
        const pct = total > 0 ? Math.round((current / total) * 100) : 0;
        bgStatus.textContent = `⏳ ${key}: ${pct}%`;
      }
    });

    const url = URL.createObjectURL(blob);
    const newImg = new Image();
    newImg.onload = () => {
      URL.revokeObjectURL(url);
      setBaseImage(newImg);

      // Force PNG output to preserve transparency
      const newName = currentFile.name.replace(/\.[^.]+$/, '.png');
      currentFile = new File([blob], newName, { type: 'image/png' });

      bgStatus.textContent = '✓ สำเร็จ — กดบันทึกจะได้ PNG พร้อมความโปร่งใส';
      resetConvertBtn();
    };
    newImg.src = url;
  } catch (err) {
    console.error('Background removal failed:', err);
    bgStatus.textContent = '❌ เกิดข้อผิดพลาด: ' + (err.message || 'ไม่ทราบสาเหตุ');
  } finally {
    bgRemoveBtn.disabled = false;
  }
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

  // Auto-bake any pending overlays before saving
  if (textValue.trim() && textX !== null) bakeText();
  if (stickerChar && stickerX !== null) bakeSticker();

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
