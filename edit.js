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
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  currentFilter = 'none';
  currentFrame = 'none';
  applyFilter('none');
  buildFilterStrip();
  buildFrameStrip && buildFrameStrip();
}

// ── Frames ─────────────────────────────────────────
const FRAMES = [
  { id: 'none',     name: 'ไม่มี' },
  { id: 'white',    name: 'ขาว' },
  { id: 'black',    name: 'ดำ' },
  { id: 'polaroid', name: 'โพลารอยด์' },
  { id: 'film',     name: 'ฟิล์ม' },
  { id: 'rounded',  name: 'มน' },
  { id: 'vignette', name: 'เงา' },
  { id: 'wood',     name: 'ไม้' }
];

let currentFrame = 'none';
let currentPadding = { left: 0, right: 0, top: 0, bottom: 0 };

function framePadding(id, w, h) {
  const m = Math.min(w, h);
  switch (id) {
    case 'white':
    case 'black':    return { left: Math.round(m*0.04), right: Math.round(m*0.04), top: Math.round(m*0.04), bottom: Math.round(m*0.04) };
    case 'polaroid': return { left: Math.round(m*0.05), right: Math.round(m*0.05), top: Math.round(m*0.05), bottom: Math.round(m*0.20) };
    case 'film':     return { left: 0, right: 0, top: Math.round(m*0.08), bottom: Math.round(m*0.08) };
    case 'wood':     return { left: Math.round(m*0.05), right: Math.round(m*0.05), top: Math.round(m*0.05), bottom: Math.round(m*0.05) };
    default:         return { left: 0, right: 0, top: 0, bottom: 0 };
  }
}

function drawFrameBg(c, w, h, id) {
  switch (id) {
    case 'white':
    case 'polaroid':
      c.fillStyle = '#ffffff';
      c.fillRect(0, 0, w, h);
      break;
    case 'black':
    case 'film':
      c.fillStyle = '#000000';
      c.fillRect(0, 0, w, h);
      break;
    case 'wood': {
      const grad = c.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0,    '#8B4513');
      grad.addColorStop(0.5,  '#A0522D');
      grad.addColorStop(1,    '#6B3410');
      c.fillStyle = grad;
      c.fillRect(0, 0, w, h);
      // Wood grain stripes
      c.fillStyle = 'rgba(0,0,0,0.08)';
      const stripe = Math.max(2, Math.round(Math.min(w,h)*0.008));
      for (let y = 0; y < h; y += stripe * 6) {
        c.fillRect(0, y, w, stripe);
      }
      break;
    }
  }
}

function roundedRectPath(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r);
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.closePath();
}

function drawFrameFg(c, w, h, id, pad) {
  if (id === 'film') {
    const top = pad.top;
    const hole = top * 0.45;
    const holeY1 = (top - hole) / 2;
    const holeY2 = h - top + (top - hole) / 2;
    const step = top * 1.1;
    c.fillStyle = '#ffffff';
    for (let x = step * 0.4; x + hole < w; x += step) {
      c.fillRect(x, holeY1, hole, hole);
      c.fillRect(x, holeY2, hole, hole);
    }
  }
  if (id === 'rounded') {
    c.save();
    c.globalCompositeOperation = 'destination-in';
    c.fillStyle = '#000';
    roundedRectPath(c, 0, 0, w, h, Math.min(w, h) * 0.06);
    c.fill();
    c.restore();
  }
  if (id === 'vignette') {
    const grad = c.createRadialGradient(
      w/2, h/2, Math.min(w, h) * 0.35,
      w/2, h/2, Math.max(w, h) * 0.75
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.7)');
    c.fillStyle = grad;
    c.fillRect(0, 0, w, h);
  }
}

// ── Render (filter + frame) ────────────────────────
function render() {
  if (!baseImg) return;
  const baseW = baseImg.naturalWidth || baseImg.width;
  const baseH = baseImg.naturalHeight || baseImg.height;
  currentPadding = framePadding(currentFrame, baseW, baseH);
  const pad = currentPadding;

  canvas.width  = baseW + pad.left + pad.right;
  canvas.height = baseH + pad.top + pad.bottom;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFrameBg(ctx, canvas.width, canvas.height, currentFrame);

  const f = FILTERS.find(x => x.id === currentFilter) || FILTERS[0];
  ctx.filter = f.css;
  ctx.drawImage(baseImg, pad.left, pad.top);
  ctx.filter = 'none';

  drawFrameFg(ctx, canvas.width, canvas.height, currentFrame, pad);

  // Keep overlays positioned correctly
  updateTextOverlay && updateTextOverlay();
  updateStickerOverlay && updateStickerOverlay();
}

// ── Apply filter ───────────────────────────────────
function applyFilter(id) {
  currentFilter = id;
  render();
}

function setFrame(id) {
  currentFrame = id;
  render();
}

// ── Coord helpers ──────────────────────────────────
function baseImgW() { return baseImg.naturalWidth || baseImg.width; }
function baseImgH() { return baseImg.naturalHeight || baseImg.height; }
function canvasToBaseImg(pt) {
  return { x: pt.x - currentPadding.left, y: pt.y - currentPadding.top };
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

// ── Frame strip thumbnails ─────────────────────────
const frameStrip = document.getElementById('frameStrip');

function buildFrameStrip() {
  if (!frameStrip || !baseImg) return;
  frameStrip.innerHTML = '';
  const THUMB = 80;
  const bw = baseImgW();
  const bh = baseImgH();
  const sampleSize = Math.min(bw, bh);
  const sx = (bw - sampleSize) / 2;
  const sy = (bh - sampleSize) / 2;

  FRAMES.forEach(f => {
    const item = document.createElement('button');
    item.className = 'filter-item frame-item';
    if (f.id === currentFrame) item.classList.add('active');
    item.dataset.frame = f.id;

    const pad = framePadding(f.id, sampleSize, sampleSize);
    const totalW = sampleSize + pad.left + pad.right;
    const totalH = sampleSize + pad.top + pad.bottom;
    const fit = Math.min(THUMB / totalW, THUMB / totalH);
    const rW = totalW * fit;
    const rH = totalH * fit;
    const ox = (THUMB - rW) / 2;
    const oy = (THUMB - rH) / 2;

    const t = document.createElement('canvas');
    t.width = THUMB; t.height = THUMB;
    const tc = t.getContext('2d');
    tc.save();
    tc.translate(ox, oy);
    drawFrameBg(tc, rW, rH, f.id);
    const sPad = {
      left: pad.left * fit, right: pad.right * fit,
      top:  pad.top  * fit, bottom: pad.bottom * fit
    };
    tc.drawImage(baseImg, sx, sy, sampleSize, sampleSize,
                 sPad.left, sPad.top, rW - sPad.left - sPad.right, rH - sPad.top - sPad.bottom);
    drawFrameFg(tc, rW, rH, f.id, sPad);
    tc.restore();

    const img = document.createElement('img');
    img.src = t.toDataURL('image/png');
    img.alt = f.name;
    item.appendChild(img);

    const label = document.createElement('span');
    label.textContent = f.name;
    item.appendChild(label);

    item.addEventListener('click', () => {
      document.querySelectorAll('.frame-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      setFrame(f.id);
      resetConvertBtn();
    });

    frameStrip.appendChild(item);
  });
}

// ── Hash routing: open the tab named in URL hash ───
function openTabFromHash() {
  const hash = location.hash.slice(1);
  if (!hash) return;
  const tab = document.querySelector(`.tool-tab[data-tool="${hash}"]`);
  if (tab) tab.click();
}
window.addEventListener('DOMContentLoaded', openTabFromHash);
window.addEventListener('hashchange', openTabFromHash);

// ── Tool tabs ──────────────────────────────────────
let currentTool = 'filter';
const editStage = document.querySelector('.edit-stage');

document.querySelectorAll('.tool-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const newTool = tab.dataset.tool;
    // Auto-bake pending overlays when leaving that mode
    if (currentTool === 'text' && newTool !== 'text') bakeText();
    if (currentTool === 'sticker' && newTool !== 'sticker') bakeSticker();
    if (currentTool === 'watermark' && newTool !== 'watermark') bakeWatermark();
    currentTool = newTool;
    document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tool-panel').forEach(p => {
      p.hidden = (p.dataset.toolPanel !== newTool);
    });
    editStage.classList.toggle('draw-mode', newTool === 'draw');
    updateTextOverlay();
    updateStickerOverlay();
    updateWmOverlay();
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
      const basePt = canvasToBaseImg(canvasCoords(e));
      textX = Math.max(0, Math.min(basePt.x, baseImgW()));
      textY = Math.max(0, Math.min(basePt.y, baseImgH()));
      updateTextOverlay();
    }
    return;
  }

  // In sticker mode: click on canvas to place sticker there
  if (currentTool === 'sticker') {
    if (stickerChar) {
      e.preventDefault();
      const basePt = canvasToBaseImg(canvasCoords(e));
      stickerX = Math.max(0, Math.min(basePt.x, baseImgW()));
      stickerY = Math.max(0, Math.min(basePt.y, baseImgH()));
      updateStickerOverlay();
    }
    return;
  }

  // In watermark mode: click on canvas to place watermark there
  if (currentTool === 'watermark') {
    if (wmText.trim()) {
      e.preventDefault();
      const basePt = canvasToBaseImg(canvasCoords(e));
      wmX = Math.max(0, Math.min(basePt.x, baseImgW()));
      wmY = Math.max(0, Math.min(basePt.y, baseImgH()));
      document.querySelectorAll('.wm-pos-btn').forEach(b => b.classList.remove('active'));
      updateWmOverlay();
    }
    return;
  }

  if (currentTool !== 'draw') return;
  e.preventDefault();
  drawing = true;
  try { canvas.setPointerCapture(e.pointerId); } catch {}
  lastPt = canvasCoords(e);
  // Dot on visible canvas
  ctx.fillStyle = brushColor;
  ctx.beginPath();
  ctx.arc(lastPt.x, lastPt.y, brushWidth / 2, 0, Math.PI * 2);
  ctx.fill();
  // Dot on baseImg (translate to baseImg coords)
  ensureBaseImgCanvas();
  const basePt = canvasToBaseImg(lastPt);
  const bctx = baseImg.getContext('2d');
  bctx.fillStyle = brushColor;
  bctx.beginPath();
  bctx.arc(basePt.x, basePt.y, brushWidth / 2, 0, Math.PI * 2);
  bctx.fill();
});

canvas.addEventListener('pointermove', (e) => {
  if (!drawing) return;
  const pt = canvasCoords(e);
  strokeSegment(ctx, lastPt, pt, brushColor, brushWidth);
  ensureBaseImgCanvas();
  const basePt = canvasToBaseImg(pt);
  const baseLastPt = canvasToBaseImg(lastPt);
  strokeSegment(baseImg.getContext('2d'), baseLastPt, basePt, brushColor, brushWidth);
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
  // First non-empty text → place at center of baseImg
  if (textValue.trim() && textX === null && baseImg) {
    textX = baseImgW() / 2;
    textY = baseImgH() / 2;
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
  textOverlay.style.left = ((textX + currentPadding.left) * scale) + 'px';
  textOverlay.style.top  = ((textY + currentPadding.top)  * scale) + 'px';
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
  textX = Math.max(0, Math.min(textX, baseImgW()));
  textY = Math.max(0, Math.min(textY, baseImgH()));
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
  if (currentTool === 'watermark') updateWmOverlay();
});

// ── Watermark tool ─────────────────────────────────
let wmText = '';
let wmColor = '#FFFFFF';
let wmSize = 36;
let wmFont = "'IBM Plex Sans Thai', Tahoma, sans-serif";
let wmOpacity = 0.5;
let wmX = null;
let wmY = null;
let wmPosition = 'br';
const WM_MARGIN = 20;

const wmInput        = document.getElementById('wmInput');
const wmSizeInput    = document.getElementById('wmSize');
const wmSizeLabel    = document.getElementById('wmSizeLabel');
const wmOpacityInput = document.getElementById('wmOpacity');
const wmOpacityLabel = document.getElementById('wmOpacityLabel');
const wmFontSelect   = document.getElementById('wmFont');
const wmCustomColor  = document.getElementById('wmCustomColor');
const applyWmBtn     = document.getElementById('applyWmBtn');
const wmOverlay      = document.getElementById('wmOverlay');

wmInput.addEventListener('input', () => {
  wmText = wmInput.value;
  if (wmText.trim() && baseImg) {
    if (wmX === null) setWmPositionToPreset(wmPosition);
  }
  updateWmOverlay();
});

wmSizeInput.addEventListener('input', () => {
  wmSize = parseInt(wmSizeInput.value) || 12;
  wmSizeLabel.textContent = wmSize;
  // Recompute position if a preset is currently active
  const activeBtn = document.querySelector('.wm-pos-btn.active');
  if (activeBtn) setWmPositionToPreset(activeBtn.dataset.pos);
  updateWmOverlay();
});

wmOpacityInput.addEventListener('input', () => {
  wmOpacity = (parseInt(wmOpacityInput.value) || 50) / 100;
  wmOpacityLabel.textContent = wmOpacityInput.value;
  updateWmOverlay();
});

wmFontSelect.addEventListener('change', () => {
  wmFont = wmFontSelect.value;
  const activeBtn = document.querySelector('.wm-pos-btn.active');
  if (activeBtn) setWmPositionToPreset(activeBtn.dataset.pos);
  updateWmOverlay();
});

document.querySelectorAll('.wm-color-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.wm-color-swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    wmColor = sw.dataset.color;
    wmCustomColor.value = wmColor;
    updateWmOverlay();
  });
});

wmCustomColor.addEventListener('input', () => {
  wmColor = wmCustomColor.value;
  document.querySelectorAll('.wm-color-swatch').forEach(s => s.classList.remove('active'));
  updateWmOverlay();
});

document.querySelectorAll('.wm-pos-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.wm-pos-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    wmPosition = btn.dataset.pos;
    setWmPositionToPreset(wmPosition);
    updateWmOverlay();
  });
});

function setWmPositionToPreset(pos) {
  if (!baseImg) return;
  // Measure text size via temp canvas to compute the right anchor
  const tmp = document.createElement('canvas').getContext('2d');
  tmp.font = `700 ${wmSize}px ${wmFont}`;
  const textW = tmp.measureText(wmText || ' ').width;
  const textH = wmSize;
  const w = baseImgW();
  const h = baseImgH();
  const m = WM_MARGIN;
  let x = 0, y = 0;
  switch (pos) {
    case 'tl': x = m;                       y = m; break;
    case 'tc': x = (w - textW) / 2;         y = m; break;
    case 'tr': x = w - textW - m;           y = m; break;
    case 'ml': x = m;                       y = (h - textH) / 2; break;
    case 'c':  x = (w - textW) / 2;         y = (h - textH) / 2; break;
    case 'mr': x = w - textW - m;           y = (h - textH) / 2; break;
    case 'bl': x = m;                       y = h - textH - m; break;
    case 'bc': x = (w - textW) / 2;         y = h - textH - m; break;
    case 'br': x = w - textW - m;           y = h - textH - m; break;
  }
  wmX = x;
  wmY = y;
}

function updateWmOverlay() {
  if (!baseImg || currentTool !== 'watermark' || !wmText.trim()) {
    wmOverlay.hidden = true;
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const scale = rect.width / canvas.width || 1;
  wmOverlay.hidden = false;
  wmOverlay.textContent = wmText;
  wmOverlay.style.fontFamily = wmFont;
  wmOverlay.style.fontSize = (wmSize * scale) + 'px';
  wmOverlay.style.color = wmColor;
  wmOverlay.style.opacity = wmOpacity;
  wmOverlay.style.left = ((wmX + currentPadding.left) * scale) + 'px';
  wmOverlay.style.top  = ((wmY + currentPadding.top)  * scale) + 'px';
}

// Drag watermark overlay
let wmDragging = false;
let wmDragStart = null;

wmOverlay.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  e.stopPropagation();
  wmDragging = true;
  try { wmOverlay.setPointerCapture(e.pointerId); } catch {}
  wmDragStart = { clientX: e.clientX, clientY: e.clientY, tx: wmX, ty: wmY };
  // Deselect preset since user is freely positioning now
  document.querySelectorAll('.wm-pos-btn').forEach(b => b.classList.remove('active'));
});

wmOverlay.addEventListener('pointermove', (e) => {
  if (!wmDragging) return;
  const rect = canvas.getBoundingClientRect();
  const scale = rect.width / canvas.width || 1;
  wmX = wmDragStart.tx + (e.clientX - wmDragStart.clientX) / scale;
  wmY = wmDragStart.ty + (e.clientY - wmDragStart.clientY) / scale;
  wmX = Math.max(0, Math.min(wmX, baseImgW()));
  wmY = Math.max(0, Math.min(wmY, baseImgH()));
  updateWmOverlay();
});

wmOverlay.addEventListener('pointerup', (e) => {
  wmDragging = false;
  try { wmOverlay.releasePointerCapture(e.pointerId); } catch {}
});
wmOverlay.addEventListener('pointercancel', () => { wmDragging = false; });

function bakeWatermark() {
  if (!baseImg || !wmText.trim() || wmX === null) return;
  ensureBaseImgCanvas();
  const bctx = baseImg.getContext('2d');
  bctx.save();
  bctx.globalAlpha = wmOpacity;
  bctx.font = `700 ${wmSize}px ${wmFont}`;
  bctx.fillStyle = wmColor;
  bctx.textBaseline = 'top';
  bctx.fillText(wmText, wmX, wmY);
  bctx.restore();
  applyFilter(currentFilter);
  // Reset for next watermark
  wmInput.value = '';
  wmText = '';
  wmX = null; wmY = null;
  wmOverlay.hidden = true;
}

applyWmBtn.addEventListener('click', bakeWatermark);

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
      stickerX = baseImgW() / 2 - stickerSize / 2;
      stickerY = baseImgH() / 2 - stickerSize / 2;
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
  stickerOverlay.style.left = ((stickerX + currentPadding.left) * scale) + 'px';
  stickerOverlay.style.top  = ((stickerY + currentPadding.top)  * scale) + 'px';
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
  stickerX = Math.max(0, Math.min(stickerX, baseImgW()));
  stickerY = Math.max(0, Math.min(stickerY, baseImgH()));
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
  if (wmText.trim() && wmX !== null) bakeWatermark();

  convertBtn.disabled = true;
  try {
    const isPng = currentFile.type === 'image/png' || /\.png$/i.test(currentFile.name);
    const needsAlpha = isPng || currentFrame === 'rounded';
    const mime = needsAlpha ? 'image/png'
      : currentFile.type === 'image/webp' ? 'image/webp'
      : 'image/jpeg';
    const quality = needsAlpha ? undefined : 0.92;

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(b => b ? resolve(b) : reject(new Error('Canvas failed')), mime, quality);
    });

    let saveName = currentFile.name;
    if (needsAlpha && !/\.png$/i.test(saveName)) {
      saveName = saveName.replace(/\.[^.]+$/, '.png');
    }
    downloadFile(blob, saveName);
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
