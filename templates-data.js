/* ─────────────────────────────────────────────────────
   thaiimg.com Card Templates — Data
   Each template is a layered design rendered on Canvas.
   Coordinates are in template-space (template.width x template.height).
   Editor scales to display size and back when exporting.
   ───────────────────────────────────────────────────── */

window.THAIIMG_TEMPLATES = [

  // ── สวัสดีวันใหม่ ─────────────────────────────────
  {
    id: 'monday-1',
    category: 'weekday',
    categoryLabel: 'สวัสดีวันใหม่',
    name: 'สวัสดีวันจันทร์ — สดใส',
    width: 1080,
    height: 1080,
    background: { type: 'gradient', colors: ['#FFE5B4', '#FFB6A0'] },
    layers: [
      // Decorative circle top-right
      { type: 'circle', x: 920, y: 160, radius: 220, fill: 'rgba(255,255,255,0.30)' },
      { type: 'circle', x: 950, y: 130, radius: 90,  fill: 'rgba(255,255,255,0.45)' },
      // Photo slot — large center
      {
        type: 'photo-slot',
        id: 'main-photo',
        x: 140, y: 240, width: 800, height: 480,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      // Top tagline
      {
        type: 'text', id: 'tagline',
        x: 540, y: 130,
        text: 'HAPPY MONDAY',
        font: 'Mitr', size: 38, weight: 600,
        color: '#7A3E18', align: 'center', editable: true
      },
      // Main title (Thai)
      {
        type: 'text', id: 'title',
        x: 540, y: 820,
        text: 'สวัสดีวันจันทร์',
        font: 'Mitr', size: 90, weight: 700,
        color: '#7A3E18', align: 'center', editable: true
      },
      // Subtitle
      {
        type: 'text', id: 'subtitle',
        x: 540, y: 940,
        text: 'ขอให้วันนี้เป็นวันที่สดใส มีพลังตลอดวัน',
        font: 'IBM Plex Sans Thai', size: 36, weight: 500,
        color: '#5C2F11', align: 'center', editable: true
      },
    ],
  },

  // ── สวัสดีตอนเช้า ─────────────────────────────────
  {
    id: 'morning-1',
    category: 'weekday',
    categoryLabel: 'สวัสดีวันใหม่',
    name: 'อรุณสวัสดิ์ — โทนทอง',
    width: 1080,
    height: 1080,
    background: { type: 'gradient', colors: ['#FDF6E3', '#F5E6B8'] },
    layers: [
      // Sun (decorative)
      { type: 'circle', x: 900, y: 200, radius: 130, fill: '#F5C84B' },
      { type: 'circle', x: 900, y: 200, radius: 95,  fill: '#F8D466' },
      // Photo slot — circle (avatar-style)
      {
        type: 'photo-slot',
        id: 'main-photo',
        x: 290, y: 220, width: 500, height: 500,
        shape: 'circle',
        placeholder: 'แตะเพื่อใส่รูป'
      },
      // Title
      {
        type: 'text', id: 'title',
        x: 540, y: 800,
        text: 'อรุณสวัสดิ์',
        font: 'Mitr', size: 96, weight: 700,
        color: '#9C6B1A', align: 'center', editable: true
      },
      // Subtitle
      {
        type: 'text', id: 'subtitle',
        x: 540, y: 920,
        text: 'ขอให้เป็นวันที่ดีของคุณ ☀️',
        font: 'IBM Plex Sans Thai', size: 40, weight: 500,
        color: '#7A5215', align: 'center', editable: true
      },
    ],
  },

  // ── วันเกิด ───────────────────────────────────────
  {
    id: 'bday-1',
    category: 'birthday',
    categoryLabel: 'วันเกิด',
    name: 'สุขสันต์วันเกิด — สีชมพู',
    width: 1080,
    height: 1080,
    background: { type: 'gradient', colors: ['#FFE0EC', '#FFC4DC'] },
    layers: [
      // Decorative dots
      { type: 'circle', x: 100, y: 120, radius: 30, fill: '#F472B6' },
      { type: 'circle', x: 980, y: 980, radius: 40, fill: '#EC4899' },
      { type: 'circle', x: 150, y: 950, radius: 20, fill: '#F9A8D4' },
      { type: 'circle', x: 950, y: 130, radius: 25, fill: '#FBCFE8' },
      // Photo slot — circle big
      {
        type: 'photo-slot',
        id: 'main-photo',
        x: 240, y: 180, width: 600, height: 600,
        shape: 'circle',
        placeholder: 'ใส่รูปคนเกิด 🎂'
      },
      // HBD text
      {
        type: 'text', id: 'tagline',
        x: 540, y: 850,
        text: 'HAPPY BIRTHDAY',
        font: 'Mitr', size: 56, weight: 700,
        color: '#BE185D', align: 'center', editable: true
      },
      // Thai
      {
        type: 'text', id: 'title',
        x: 540, y: 950,
        text: 'สุขสันต์วันเกิด',
        font: 'Mitr', size: 64, weight: 600,
        color: '#9D174D', align: 'center', editable: true
      },
    ],
  },

  // ── ขอบคุณ ────────────────────────────────────────
  {
    id: 'thanks-1',
    category: 'thanks',
    categoryLabel: 'ขอบคุณ',
    name: 'ขอบคุณจากใจ',
    width: 1080,
    height: 1080,
    background: { type: 'gradient', colors: ['#F0F9FF', '#BAE6FD'] },
    layers: [
      // Decorative
      { type: 'circle', x: 920, y: 160, radius: 100, fill: 'rgba(255,255,255,0.5)' },
      { type: 'circle', x: 160, y: 920, radius: 130, fill: 'rgba(255,255,255,0.4)' },
      // Photo slot
      {
        type: 'photo-slot',
        id: 'main-photo',
        x: 190, y: 260, width: 700, height: 440,
        shape: 'rounded', borderRadius: 24,
        placeholder: 'ใส่รูปได้เลย'
      },
      // Title
      {
        type: 'text', id: 'title',
        x: 540, y: 180,
        text: 'ขอบคุณค่ะ ❤',
        font: 'Mitr', size: 86, weight: 700,
        color: '#0369A1', align: 'center', editable: true
      },
      // Subtitle
      {
        type: 'text', id: 'subtitle',
        x: 540, y: 820,
        text: 'ขอบคุณสำหรับทุกอย่างที่ดีๆ ที่มีให้',
        font: 'IBM Plex Sans Thai', size: 42, weight: 500,
        color: '#075985', align: 'center', editable: true
      },
      // Signature line
      {
        type: 'text', id: 'sign',
        x: 540, y: 920,
        text: '— จากใจคุณ',
        font: 'IBM Plex Sans Thai', size: 32, weight: 400,
        color: '#0C4A6E', align: 'center', editable: true
      },
    ],
  },

  // ── ปีใหม่ ────────────────────────────────────────
  {
    id: 'newyear-1',
    category: 'festival',
    categoryLabel: 'เทศกาล',
    name: 'สวัสดีปีใหม่ — โทนทอง',
    width: 1080,
    height: 1080,
    background: { type: 'gradient', colors: ['#1A1A2E', '#16213E'] },
    layers: [
      // Sparkles
      { type: 'circle', x: 200, y: 200, radius: 4, fill: '#FFD700' },
      { type: 'circle', x: 350, y: 150, radius: 6, fill: '#FFD700' },
      { type: 'circle', x: 880, y: 280, radius: 5, fill: '#FFD700' },
      { type: 'circle', x: 920, y: 180, radius: 3, fill: '#FFD700' },
      { type: 'circle', x: 160, y: 380, radius: 4, fill: '#FFD700' },
      { type: 'circle', x: 950, y: 850, radius: 6, fill: '#FFD700' },
      { type: 'circle', x: 250, y: 880, radius: 5, fill: '#FFD700' },
      // Photo slot
      {
        type: 'photo-slot',
        id: 'main-photo',
        x: 240, y: 280, width: 600, height: 400,
        shape: 'rounded', borderRadius: 20,
        placeholder: 'ใส่รูปครอบครัว/เพื่อน'
      },
      // Title
      {
        type: 'text', id: 'tagline',
        x: 540, y: 180,
        text: 'HAPPY NEW YEAR',
        font: 'Mitr', size: 48, weight: 600,
        color: '#FFD700', align: 'center', editable: true
      },
      // Main
      {
        type: 'text', id: 'title',
        x: 540, y: 790,
        text: 'สวัสดีปีใหม่',
        font: 'Mitr', size: 92, weight: 700,
        color: '#FFD700', align: 'center', editable: true
      },
      // Subtitle
      {
        type: 'text', id: 'subtitle',
        x: 540, y: 920,
        text: 'ขอให้ปีใหม่นี้เต็มไปด้วยความสุข',
        font: 'IBM Plex Sans Thai', size: 38, weight: 500,
        color: '#E5C76B', align: 'center', editable: true
      },
    ],
  },

];

window.THAIIMG_CATEGORIES = [
  { id: 'all',      label: 'ทั้งหมด' },
  { id: 'weekday',  label: 'สวัสดีวันใหม่' },
  { id: 'birthday', label: 'วันเกิด' },
  { id: 'festival', label: 'เทศกาล' },
  { id: 'thanks',   label: 'ขอบคุณ' },
];
