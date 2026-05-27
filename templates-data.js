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

  // ── 7 วันมงคล (สีประจำวันไทย) ─────────────────────

  // จันทร์ — เหลือง (ทานตะวัน)
  {
    id: 'day-mon',
    category: 'weekday',
    categoryLabel: 'สวัสดีวันใหม่',
    name: 'สวัสดีวันจันทร์ — เหลืองทานตะวัน',
    width: 1080, height: 1080,
    background: { type: 'gradient', colors: ['#FFFBE6', '#FFE066'] },
    layers: [
      // Big sunflower top-right
      { type: 'circle', x: 956, y: 180, radius: 38, fill: '#FFC107' },
      { type: 'circle', x: 933, y: 220, radius: 38, fill: '#FFC107' },
      { type: 'circle', x: 887, y: 220, radius: 38, fill: '#FFC107' },
      { type: 'circle', x: 864, y: 180, radius: 38, fill: '#FFC107' },
      { type: 'circle', x: 887, y: 140, radius: 38, fill: '#FFC107' },
      { type: 'circle', x: 933, y: 140, radius: 38, fill: '#FFC107' },
      { type: 'circle', x: 910, y: 180, radius: 26, fill: '#6B4226' },
      // Small sunflower bottom-left
      { type: 'circle', x: 156, y: 940, radius: 22, fill: '#FFC107' },
      { type: 'circle', x: 142, y: 962, radius: 22, fill: '#FFC107' },
      { type: 'circle', x: 116, y: 962, radius: 22, fill: '#FFC107' },
      { type: 'circle', x: 102, y: 940, radius: 22, fill: '#FFC107' },
      { type: 'circle', x: 116, y: 918, radius: 22, fill: '#FFC107' },
      { type: 'circle', x: 142, y: 918, radius: 22, fill: '#FFC107' },
      { type: 'circle', x: 129, y: 940, radius: 14, fill: '#6B4226' },
      // Accent dots
      { type: 'circle', x: 230, y: 110, radius: 8,  fill: '#FFC107' },
      { type: 'circle', x: 970, y: 720, radius: 12, fill: '#FFE066' },
      { type: 'circle', x: 90,  y: 580, radius: 10, fill: '#FFC107' },
      {
        type: 'photo-slot', id: 'main-photo',
        x: 140, y: 290, width: 800, height: 480,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      { type: 'text', id: 'title', x: 540, y: 850,
        text: 'สวัสดีวันจันทร์',
        font: 'Mitr', size: 88, weight: 700,
        color: '#8B6914', align: 'center', editable: true },
      { type: 'text', id: 'subtitle', x: 540, y: 950,
        text: 'ขอให้วันจันทร์เป็นวันที่สดใส',
        font: 'IBM Plex Sans Thai', size: 38, weight: 500,
        color: '#A0750E', align: 'center', editable: true },
    ],
  },

  // อังคาร — ชมพู (ดอกซากุระ)
  {
    id: 'day-tue',
    category: 'weekday',
    categoryLabel: 'สวัสดีวันใหม่',
    name: 'สวัสดีวันอังคาร — ชมพูซากุระ',
    width: 1080, height: 1080,
    background: { type: 'gradient', colors: ['#FFE0EC', '#FFB6CD'] },
    layers: [
      // Big cherry blossom top-right
      { type: 'circle', x: 956, y: 180, radius: 38, fill: '#F472B6' },
      { type: 'circle', x: 933, y: 220, radius: 38, fill: '#F472B6' },
      { type: 'circle', x: 887, y: 220, radius: 38, fill: '#F472B6' },
      { type: 'circle', x: 864, y: 180, radius: 38, fill: '#F472B6' },
      { type: 'circle', x: 887, y: 140, radius: 38, fill: '#F472B6' },
      { type: 'circle', x: 933, y: 140, radius: 38, fill: '#F472B6' },
      { type: 'circle', x: 910, y: 180, radius: 22, fill: '#BE185D' },
      // Small blossom bottom-left
      { type: 'circle', x: 156, y: 940, radius: 22, fill: '#F9A8D4' },
      { type: 'circle', x: 142, y: 962, radius: 22, fill: '#F9A8D4' },
      { type: 'circle', x: 116, y: 962, radius: 22, fill: '#F9A8D4' },
      { type: 'circle', x: 102, y: 940, radius: 22, fill: '#F9A8D4' },
      { type: 'circle', x: 116, y: 918, radius: 22, fill: '#F9A8D4' },
      { type: 'circle', x: 142, y: 918, radius: 22, fill: '#F9A8D4' },
      { type: 'circle', x: 129, y: 940, radius: 12, fill: '#BE185D' },
      // Scattered petals
      { type: 'circle', x: 260, y: 130, radius: 9,  fill: '#F472B6' },
      { type: 'circle', x: 950, y: 760, radius: 14, fill: '#F9A8D4' },
      { type: 'circle', x: 80,  y: 620, radius: 10, fill: '#F472B6' },
      {
        type: 'photo-slot', id: 'main-photo',
        x: 140, y: 290, width: 800, height: 480,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      { type: 'text', id: 'title', x: 540, y: 850,
        text: 'สวัสดีวันอังคาร',
        font: 'Mitr', size: 86, weight: 700,
        color: '#9D174D', align: 'center', editable: true },
      { type: 'text', id: 'subtitle', x: 540, y: 950,
        text: 'ขอให้วันอังคารเต็มไปด้วยรอยยิ้ม',
        font: 'IBM Plex Sans Thai', size: 38, weight: 500,
        color: '#BE185D', align: 'center', editable: true },
    ],
  },

  // พุธ — ขาว (มะลิ) บนพื้นเขียวอ่อน
  {
    id: 'day-wed',
    category: 'weekday',
    categoryLabel: 'สวัสดีวันใหม่',
    name: 'สวัสดีวันพุธ — ขาวมะลิ',
    width: 1080, height: 1080,
    background: { type: 'gradient', colors: ['#ECFDF5', '#A7F3D0'] },
    layers: [
      // Big jasmine top-right (white petals + green center)
      { type: 'circle', x: 956, y: 180, radius: 38, fill: '#FFFFFF' },
      { type: 'circle', x: 933, y: 220, radius: 38, fill: '#FFFFFF' },
      { type: 'circle', x: 887, y: 220, radius: 38, fill: '#FFFFFF' },
      { type: 'circle', x: 864, y: 180, radius: 38, fill: '#FFFFFF' },
      { type: 'circle', x: 887, y: 140, radius: 38, fill: '#FFFFFF' },
      { type: 'circle', x: 933, y: 140, radius: 38, fill: '#FFFFFF' },
      { type: 'circle', x: 910, y: 180, radius: 20, fill: '#16A34A' },
      // Small jasmine bottom-left
      { type: 'circle', x: 156, y: 940, radius: 22, fill: '#FFFFFF' },
      { type: 'circle', x: 142, y: 962, radius: 22, fill: '#FFFFFF' },
      { type: 'circle', x: 116, y: 962, radius: 22, fill: '#FFFFFF' },
      { type: 'circle', x: 102, y: 940, radius: 22, fill: '#FFFFFF' },
      { type: 'circle', x: 116, y: 918, radius: 22, fill: '#FFFFFF' },
      { type: 'circle', x: 142, y: 918, radius: 22, fill: '#FFFFFF' },
      { type: 'circle', x: 129, y: 940, radius: 11, fill: '#16A34A' },
      // Tiny jasmine clusters
      { type: 'circle', x: 250, y: 110, radius: 9, fill: '#FFFFFF' },
      { type: 'circle', x: 240, y: 130, radius: 9, fill: '#FFFFFF' },
      { type: 'circle', x: 260, y: 130, radius: 9, fill: '#FFFFFF' },
      { type: 'circle', x: 250, y: 122, radius: 5, fill: '#16A34A' },
      { type: 'circle', x: 960, y: 760, radius: 14, fill: '#FFFFFF' },
      { type: 'circle', x: 945, y: 776, radius: 14, fill: '#FFFFFF' },
      { type: 'circle', x: 952, y: 768, radius: 7,  fill: '#16A34A' },
      {
        type: 'photo-slot', id: 'main-photo',
        x: 140, y: 290, width: 800, height: 480,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      { type: 'text', id: 'title', x: 540, y: 850,
        text: 'สวัสดีวันพุธ',
        font: 'Mitr', size: 92, weight: 700,
        color: '#166534', align: 'center', editable: true },
      { type: 'text', id: 'subtitle', x: 540, y: 950,
        text: 'ขอให้วันพุธสงบและสบายใจ',
        font: 'IBM Plex Sans Thai', size: 38, weight: 500,
        color: '#15803D', align: 'center', editable: true },
    ],
  },

  // พฤหัสบดี — ส้ม (ดอกดาวเรือง)
  {
    id: 'day-thu',
    category: 'weekday',
    categoryLabel: 'สวัสดีวันใหม่',
    name: 'สวัสดีวันพฤหัสบดี — ส้มดาวเรือง',
    width: 1080, height: 1080,
    background: { type: 'gradient', colors: ['#FFEAB3', '#FFA94D'] },
    layers: [
      // Marigold top-right (8 petals — denser)
      { type: 'circle', x: 956, y: 180, radius: 30, fill: '#FF8C00' },
      { type: 'circle', x: 942, y: 213, radius: 30, fill: '#FF8C00' },
      { type: 'circle', x: 910, y: 226, radius: 30, fill: '#FF8C00' },
      { type: 'circle', x: 878, y: 213, radius: 30, fill: '#FF8C00' },
      { type: 'circle', x: 864, y: 180, radius: 30, fill: '#FF8C00' },
      { type: 'circle', x: 878, y: 147, radius: 30, fill: '#FF8C00' },
      { type: 'circle', x: 910, y: 134, radius: 30, fill: '#FF8C00' },
      { type: 'circle', x: 942, y: 147, radius: 30, fill: '#FF8C00' },
      { type: 'circle', x: 910, y: 180, radius: 22, fill: '#7A3E0A' },
      // Small marigold bottom-left
      { type: 'circle', x: 156, y: 940, radius: 20, fill: '#FFA94D' },
      { type: 'circle', x: 142, y: 962, radius: 20, fill: '#FFA94D' },
      { type: 'circle', x: 116, y: 962, radius: 20, fill: '#FFA94D' },
      { type: 'circle', x: 102, y: 940, radius: 20, fill: '#FFA94D' },
      { type: 'circle', x: 116, y: 918, radius: 20, fill: '#FFA94D' },
      { type: 'circle', x: 142, y: 918, radius: 20, fill: '#FFA94D' },
      { type: 'circle', x: 129, y: 940, radius: 12, fill: '#7A3E0A' },
      { type: 'circle', x: 240, y: 110, radius: 9,  fill: '#FF8C00' },
      { type: 'circle', x: 960, y: 760, radius: 14, fill: '#FFA94D' },
      {
        type: 'photo-slot', id: 'main-photo',
        x: 140, y: 290, width: 800, height: 480,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      { type: 'text', id: 'title', x: 540, y: 850,
        text: 'สวัสดีวันพฤหัสบดี',
        font: 'Mitr', size: 76, weight: 700,
        color: '#B8650A', align: 'center', editable: true },
      { type: 'text', id: 'subtitle', x: 540, y: 950,
        text: 'ขอให้วันพฤหัสมีความสุข',
        font: 'IBM Plex Sans Thai', size: 38, weight: 500,
        color: '#C77A1A', align: 'center', editable: true },
    ],
  },

  // ศุกร์ — ฟ้า (Forget-me-not)
  {
    id: 'day-fri',
    category: 'weekday',
    categoryLabel: 'สวัสดีวันใหม่',
    name: 'สวัสดีวันศุกร์ — ฟ้าใส',
    width: 1080, height: 1080,
    background: { type: 'gradient', colors: ['#DBEAFE', '#93C5FD'] },
    layers: [
      // Big blue flower top-right (5 petals + yellow center)
      { type: 'circle', x: 956, y: 180, radius: 38, fill: '#3B82F6' },
      { type: 'circle', x: 933, y: 220, radius: 38, fill: '#3B82F6' },
      { type: 'circle', x: 887, y: 220, radius: 38, fill: '#3B82F6' },
      { type: 'circle', x: 864, y: 180, radius: 38, fill: '#3B82F6' },
      { type: 'circle', x: 887, y: 140, radius: 38, fill: '#3B82F6' },
      { type: 'circle', x: 933, y: 140, radius: 38, fill: '#3B82F6' },
      { type: 'circle', x: 910, y: 180, radius: 18, fill: '#FBBF24' },
      // Small forget-me-not bottom-left
      { type: 'circle', x: 156, y: 940, radius: 22, fill: '#60A5FA' },
      { type: 'circle', x: 142, y: 962, radius: 22, fill: '#60A5FA' },
      { type: 'circle', x: 116, y: 962, radius: 22, fill: '#60A5FA' },
      { type: 'circle', x: 102, y: 940, radius: 22, fill: '#60A5FA' },
      { type: 'circle', x: 116, y: 918, radius: 22, fill: '#60A5FA' },
      { type: 'circle', x: 142, y: 918, radius: 22, fill: '#60A5FA' },
      { type: 'circle', x: 129, y: 940, radius: 10, fill: '#FBBF24' },
      // Cloud-like dots
      { type: 'circle', x: 240, y: 120, radius: 10, fill: '#FFFFFF' },
      { type: 'circle', x: 260, y: 120, radius: 12, fill: '#FFFFFF' },
      { type: 'circle', x: 280, y: 120, radius: 10, fill: '#FFFFFF' },
      { type: 'circle', x: 960, y: 760, radius: 14, fill: '#3B82F6' },
      { type: 'circle', x: 80,  y: 600, radius: 10, fill: '#60A5FA' },
      {
        type: 'photo-slot', id: 'main-photo',
        x: 140, y: 290, width: 800, height: 480,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      { type: 'text', id: 'title', x: 540, y: 850,
        text: 'สวัสดีวันศุกร์',
        font: 'Mitr', size: 90, weight: 700,
        color: '#1E40AF', align: 'center', editable: true },
      { type: 'text', id: 'subtitle', x: 540, y: 950,
        text: 'ขอให้วันศุกร์เริ่มต้นที่ดี',
        font: 'IBM Plex Sans Thai', size: 38, weight: 500,
        color: '#2563EB', align: 'center', editable: true },
    ],
  },

  // เสาร์ — ม่วง (ดอกบัว)
  {
    id: 'day-sat',
    category: 'weekday',
    categoryLabel: 'สวัสดีวันใหม่',
    name: 'สวัสดีวันเสาร์ — ม่วงบัว',
    width: 1080, height: 1080,
    background: { type: 'gradient', colors: ['#EDE9FE', '#A78BFA'] },
    layers: [
      // Big purple lotus top-right
      { type: 'circle', x: 956, y: 180, radius: 38, fill: '#8B5CF6' },
      { type: 'circle', x: 933, y: 220, radius: 38, fill: '#8B5CF6' },
      { type: 'circle', x: 887, y: 220, radius: 38, fill: '#8B5CF6' },
      { type: 'circle', x: 864, y: 180, radius: 38, fill: '#8B5CF6' },
      { type: 'circle', x: 887, y: 140, radius: 38, fill: '#8B5CF6' },
      { type: 'circle', x: 933, y: 140, radius: 38, fill: '#8B5CF6' },
      // Inner lotus layer
      { type: 'circle', x: 910, y: 158, radius: 22, fill: '#C4B5FD' },
      { type: 'circle', x: 910, y: 202, radius: 22, fill: '#C4B5FD' },
      { type: 'circle', x: 932, y: 180, radius: 22, fill: '#C4B5FD' },
      { type: 'circle', x: 888, y: 180, radius: 22, fill: '#C4B5FD' },
      { type: 'circle', x: 910, y: 180, radius: 16, fill: '#FBBF24' },
      // Small lotus bottom-left
      { type: 'circle', x: 156, y: 940, radius: 22, fill: '#A78BFA' },
      { type: 'circle', x: 142, y: 962, radius: 22, fill: '#A78BFA' },
      { type: 'circle', x: 116, y: 962, radius: 22, fill: '#A78BFA' },
      { type: 'circle', x: 102, y: 940, radius: 22, fill: '#A78BFA' },
      { type: 'circle', x: 116, y: 918, radius: 22, fill: '#A78BFA' },
      { type: 'circle', x: 142, y: 918, radius: 22, fill: '#A78BFA' },
      { type: 'circle', x: 129, y: 940, radius: 10, fill: '#FBBF24' },
      { type: 'circle', x: 240, y: 110, radius: 9,  fill: '#8B5CF6' },
      { type: 'circle', x: 960, y: 760, radius: 14, fill: '#A78BFA' },
      {
        type: 'photo-slot', id: 'main-photo',
        x: 140, y: 290, width: 800, height: 480,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      { type: 'text', id: 'title', x: 540, y: 850,
        text: 'สวัสดีวันเสาร์',
        font: 'Mitr', size: 90, weight: 700,
        color: '#5B21B6', align: 'center', editable: true },
      { type: 'text', id: 'subtitle', x: 540, y: 950,
        text: 'ขอให้วันเสาร์ได้พักผ่อนเต็มที่',
        font: 'IBM Plex Sans Thai', size: 38, weight: 500,
        color: '#7C3AED', align: 'center', editable: true },
    ],
  },

  // อาทิตย์ — แดง (ดอกกุหลาบ)
  {
    id: 'day-sun',
    category: 'weekday',
    categoryLabel: 'สวัสดีวันใหม่',
    name: 'สวัสดีวันอาทิตย์ — แดงกุหลาบ',
    width: 1080, height: 1080,
    background: { type: 'gradient', colors: ['#FECACA', '#F87171'] },
    layers: [
      // Big rose top-right (layered)
      { type: 'circle', x: 956, y: 180, radius: 38, fill: '#DC2626' },
      { type: 'circle', x: 933, y: 220, radius: 38, fill: '#DC2626' },
      { type: 'circle', x: 887, y: 220, radius: 38, fill: '#DC2626' },
      { type: 'circle', x: 864, y: 180, radius: 38, fill: '#DC2626' },
      { type: 'circle', x: 887, y: 140, radius: 38, fill: '#DC2626' },
      { type: 'circle', x: 933, y: 140, radius: 38, fill: '#DC2626' },
      // Inner darker layer
      { type: 'circle', x: 910, y: 180, radius: 28, fill: '#991B1B' },
      { type: 'circle', x: 910, y: 180, radius: 14, fill: '#7F1D1D' },
      // Small rose bottom-left
      { type: 'circle', x: 156, y: 940, radius: 22, fill: '#EF4444' },
      { type: 'circle', x: 142, y: 962, radius: 22, fill: '#EF4444' },
      { type: 'circle', x: 116, y: 962, radius: 22, fill: '#EF4444' },
      { type: 'circle', x: 102, y: 940, radius: 22, fill: '#EF4444' },
      { type: 'circle', x: 116, y: 918, radius: 22, fill: '#EF4444' },
      { type: 'circle', x: 142, y: 918, radius: 22, fill: '#EF4444' },
      { type: 'circle', x: 129, y: 940, radius: 12, fill: '#7F1D1D' },
      { type: 'circle', x: 240, y: 110, radius: 9,  fill: '#DC2626' },
      { type: 'circle', x: 960, y: 760, radius: 14, fill: '#EF4444' },
      { type: 'circle', x: 80,  y: 600, radius: 10, fill: '#DC2626' },
      {
        type: 'photo-slot', id: 'main-photo',
        x: 140, y: 290, width: 800, height: 480,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      { type: 'text', id: 'title', x: 540, y: 850,
        text: 'สวัสดีวันอาทิตย์',
        font: 'Mitr', size: 86, weight: 700,
        color: '#B91C1C', align: 'center', editable: true },
      { type: 'text', id: 'subtitle', x: 540, y: 950,
        text: 'ขอให้วันอาทิตย์เต็มไปด้วยความสุข',
        font: 'IBM Plex Sans Thai', size: 36, weight: 500,
        color: '#DC2626', align: 'center', editable: true },
    ],
  },

  // ── วันเกิด (4 ธีมใหม่) ───────────────────────────

  // 🎁 กล่องของขวัญ
  {
    id: 'bday-gift',
    category: 'birthday',
    categoryLabel: 'วันเกิด',
    name: 'สุขสันต์วันเกิด — กล่องของขวัญ',
    width: 1080, height: 1080,
    background: { type: 'gradient', colors: ['#FFE4E6', '#FBCFE8'] },
    layers: [
      // Gift box (top-right area)
      // Main box body
      { type: 'rect', x: 830, y: 145, width: 160, height: 130, fill: '#EC4899', borderRadius: 8 },
      // Lid (slightly wider, sits on top)
      { type: 'rect', x: 815, y: 125, width: 190, height: 30,  fill: '#DB2777', borderRadius: 6 },
      // Vertical ribbon
      { type: 'rect', x: 897, y: 125, width: 28,  height: 150, fill: '#FBBF24' },
      // Horizontal ribbon
      { type: 'rect', x: 830, y: 195, width: 160, height: 28,  fill: '#FBBF24' },
      // Bow (two loops + knot)
      { type: 'circle', x: 890, y: 110, radius: 18, fill: '#FBBF24' },
      { type: 'circle', x: 930, y: 110, radius: 18, fill: '#FBBF24' },
      { type: 'rect',   x: 902, y: 105, width: 16, height: 14, fill: '#F59E0B', borderRadius: 3 },
      // Confetti dots scattered
      { type: 'circle', x: 240, y: 130, radius: 9,  fill: '#EC4899' },
      { type: 'circle', x: 280, y: 110, radius: 7,  fill: '#FBBF24' },
      { type: 'circle', x: 320, y: 140, radius: 8,  fill: '#A78BFA' },
      { type: 'circle', x: 130, y: 920, radius: 10, fill: '#EC4899' },
      { type: 'circle', x: 170, y: 940, radius: 8,  fill: '#FBBF24' },
      { type: 'circle', x: 210, y: 920, radius: 9,  fill: '#A78BFA' },
      { type: 'circle', x: 970, y: 760, radius: 11, fill: '#F472B6' },
      { type: 'circle', x: 90,  y: 600, radius: 9,  fill: '#FBBF24' },
      {
        type: 'photo-slot', id: 'main-photo',
        x: 140, y: 320, width: 800, height: 460,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      { type: 'text', id: 'title', x: 540, y: 860,
        text: 'สุขสันต์วันเกิด',
        font: 'Mitr', size: 86, weight: 700,
        color: '#BE185D', align: 'center', editable: true },
      { type: 'text', id: 'subtitle', x: 540, y: 950,
        text: 'มีของขวัญพิเศษให้คุณ ขอให้มีความสุขมากๆ',
        font: 'IBM Plex Sans Thai', size: 34, weight: 500,
        color: '#9D174D', align: 'center', editable: true },
    ],
  },

  // 🎂 เค้กวันเกิด
  {
    id: 'bday-cake',
    category: 'birthday',
    categoryLabel: 'วันเกิด',
    name: 'สุขสันต์วันเกิด — เค้กวันเกิด',
    width: 1080, height: 1080,
    background: { type: 'gradient', colors: ['#FEF3C7', '#FBCFE8'] },
    layers: [
      // 3-tier cake at top-center
      // Plate
      { type: 'rect', x: 380, y: 295, width: 320, height: 14, fill: '#9CA3AF', borderRadius: 6 },
      // Bottom layer (largest)
      { type: 'rect', x: 395, y: 225, width: 290, height: 70, fill: '#FFE4E6', borderRadius: 8 },
      // Bottom decoration dots (frosting)
      { type: 'circle', x: 420, y: 230, radius: 6, fill: '#EC4899' },
      { type: 'circle', x: 460, y: 230, radius: 6, fill: '#FBBF24' },
      { type: 'circle', x: 500, y: 230, radius: 6, fill: '#A78BFA' },
      { type: 'circle', x: 540, y: 230, radius: 6, fill: '#EC4899' },
      { type: 'circle', x: 580, y: 230, radius: 6, fill: '#FBBF24' },
      { type: 'circle', x: 620, y: 230, radius: 6, fill: '#A78BFA' },
      { type: 'circle', x: 660, y: 230, radius: 6, fill: '#EC4899' },
      // Middle layer
      { type: 'rect', x: 425, y: 155, width: 230, height: 70, fill: '#FED7AA', borderRadius: 8 },
      // Middle decoration
      { type: 'circle', x: 450, y: 160, radius: 5, fill: '#EA580C' },
      { type: 'circle', x: 490, y: 160, radius: 5, fill: '#EA580C' },
      { type: 'circle', x: 530, y: 160, radius: 5, fill: '#EA580C' },
      { type: 'circle', x: 570, y: 160, radius: 5, fill: '#EA580C' },
      { type: 'circle', x: 610, y: 160, radius: 5, fill: '#EA580C' },
      { type: 'circle', x: 630, y: 160, radius: 5, fill: '#EA580C' },
      // Top layer (smallest)
      { type: 'rect', x: 460, y: 90, width: 160, height: 65, fill: '#FBCFE8', borderRadius: 8 },
      // Top decoration
      { type: 'circle', x: 485, y: 95, radius: 5, fill: '#DB2777' },
      { type: 'circle', x: 525, y: 95, radius: 5, fill: '#DB2777' },
      { type: 'circle', x: 565, y: 95, radius: 5, fill: '#DB2777' },
      { type: 'circle', x: 595, y: 95, radius: 5, fill: '#DB2777' },
      // Candles (3 colors)
      { type: 'rect', x: 490, y: 50, width: 9,  height: 42, fill: '#FBBF24' },
      { type: 'rect', x: 535, y: 40, width: 9,  height: 52, fill: '#EC4899' },
      { type: 'rect', x: 580, y: 50, width: 9,  height: 42, fill: '#A78BFA' },
      // Flames
      { type: 'circle', x: 494, y: 42, radius: 7, fill: '#F97316' },
      { type: 'circle', x: 539, y: 32, radius: 8, fill: '#F97316' },
      { type: 'circle', x: 584, y: 42, radius: 7, fill: '#F97316' },
      // Inner flames (yellow)
      { type: 'circle', x: 494, y: 44, radius: 4, fill: '#FBBF24' },
      { type: 'circle', x: 539, y: 34, radius: 4, fill: '#FBBF24' },
      { type: 'circle', x: 584, y: 44, radius: 4, fill: '#FBBF24' },
      // Confetti dots
      { type: 'circle', x: 160, y: 200, radius: 10, fill: '#EC4899' },
      { type: 'circle', x: 200, y: 230, radius: 8,  fill: '#FBBF24' },
      { type: 'circle', x: 880, y: 220, radius: 9,  fill: '#A78BFA' },
      { type: 'circle', x: 920, y: 180, radius: 10, fill: '#EC4899' },
      { type: 'circle', x: 140, y: 740, radius: 8,  fill: '#FBBF24' },
      { type: 'circle', x: 940, y: 760, radius: 9,  fill: '#A78BFA' },
      {
        type: 'photo-slot', id: 'main-photo',
        x: 140, y: 380, width: 800, height: 420,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      { type: 'text', id: 'title', x: 540, y: 870,
        text: 'สุขสันต์วันเกิด',
        font: 'Mitr', size: 86, weight: 700,
        color: '#BE185D', align: 'center', editable: true },
      { type: 'text', id: 'subtitle', x: 540, y: 960,
        text: 'ขอให้มีความสุข อายุยืน สุขภาพแข็งแรง',
        font: 'IBM Plex Sans Thai', size: 34, weight: 500,
        color: '#9D174D', align: 'center', editable: true },
    ],
  },

  // 🍩 โดนัท
  {
    id: 'bday-donut',
    category: 'birthday',
    categoryLabel: 'วันเกิด',
    name: 'สุขสันต์วันเกิด — โดนัทหวาน',
    width: 1080, height: 1080,
    background: { type: 'gradient', colors: ['#FFF7ED', '#FED7AA'] },
    layers: [
      // Donut (top-right): body (brown) + frosting (pink) + hole + sprinkles
      // Body (brown ring shown around edge)
      { type: 'circle', x: 910, y: 190, radius: 88, fill: '#92400E' },
      // Pink frosting (sits on top, slightly smaller so brown shows)
      { type: 'circle', x: 910, y: 190, radius: 76, fill: '#F472B6' },
      // Drip 1
      { type: 'circle', x: 855, y: 220, radius: 16, fill: '#F472B6' },
      // Drip 2
      { type: 'circle', x: 970, y: 215, radius: 14, fill: '#F472B6' },
      // Hole
      { type: 'circle', x: 910, y: 190, radius: 26, fill: '#FFF7ED' },
      // Sprinkles (rotated tiny rects)
      { type: 'rect', x: 880, y: 145, width: 4, height: 10, fill: '#FFFFFF' },
      { type: 'rect', x: 930, y: 150, width: 4, height: 10, fill: '#FBBF24' },
      { type: 'rect', x: 858, y: 175, width: 4, height: 10, fill: '#3B82F6' },
      { type: 'rect', x: 955, y: 178, width: 4, height: 10, fill: '#FFFFFF' },
      { type: 'rect', x: 870, y: 215, width: 4, height: 10, fill: '#FBBF24' },
      { type: 'rect', x: 945, y: 218, width: 4, height: 10, fill: '#3B82F6' },
      { type: 'rect', x: 890, y: 235, width: 4, height: 10, fill: '#FFFFFF' },
      { type: 'rect', x: 925, y: 235, width: 4, height: 10, fill: '#FBBF24' },
      // Small donut bottom-left
      { type: 'circle', x: 140, y: 920, radius: 38, fill: '#92400E' },
      { type: 'circle', x: 140, y: 920, radius: 32, fill: '#FBBF24' }, // yellow frosting
      { type: 'circle', x: 140, y: 920, radius: 11, fill: '#FFF7ED' },
      { type: 'circle', x: 124, y: 905, radius: 2, fill: '#EC4899' },
      { type: 'circle', x: 156, y: 905, radius: 2, fill: '#EC4899' },
      { type: 'circle', x: 124, y: 935, radius: 2, fill: '#EC4899' },
      { type: 'circle', x: 156, y: 935, radius: 2, fill: '#EC4899' },
      // Confetti
      { type: 'circle', x: 250, y: 130, radius: 8, fill: '#F472B6' },
      { type: 'circle', x: 290, y: 110, radius: 7, fill: '#FBBF24' },
      { type: 'circle', x: 960, y: 760, radius: 12, fill: '#F472B6' },
      { type: 'circle', x: 80,  y: 600, radius: 9,  fill: '#FBBF24' },
      {
        type: 'photo-slot', id: 'main-photo',
        x: 140, y: 320, width: 800, height: 460,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      { type: 'text', id: 'title', x: 540, y: 860,
        text: 'สุขสันต์วันเกิด',
        font: 'Mitr', size: 86, weight: 700,
        color: '#9A3412', align: 'center', editable: true },
      { type: 'text', id: 'subtitle', x: 540, y: 950,
        text: 'หวานๆ เหมือนวันเกิดของคุณนะ',
        font: 'IBM Plex Sans Thai', size: 36, weight: 500,
        color: '#C2410C', align: 'center', editable: true },
    ],
  },

  // 🎉 หมวกน่ารัก (Party Hat)
  {
    id: 'bday-hat',
    category: 'birthday',
    categoryLabel: 'วันเกิด',
    name: 'สุขสันต์วันเกิด — หมวกปาร์ตี้',
    width: 1080, height: 1080,
    background: { type: 'gradient', colors: ['#E0E7FF', '#C7D2FE'] },
    layers: [
      // Party hat top-right area — base cone is yellow triangle
      { type: 'triangle', x1: 845, y1: 270, x2: 910, y2: 105, x3: 975, y3: 270, fill: '#FBBF24' },
      // Pink stripe (small triangle inside)
      { type: 'triangle', x1: 870, y1: 217, x2: 910, y2: 158, x3: 950, y3: 217, fill: '#EC4899' },
      // Top stripe (purple)
      { type: 'triangle', x1: 890, y1: 184, x2: 910, y2: 130, x3: 930, y3: 184, fill: '#A78BFA' },
      // Pompom (fluffy ball on top)
      { type: 'circle', x: 910, y: 95, radius: 22, fill: '#EC4899' },
      { type: 'circle', x: 898, y: 87, radius: 12, fill: '#F9A8D4' },
      { type: 'circle', x: 920, y: 88, radius: 11, fill: '#F9A8D4' },
      { type: 'circle', x: 912, y: 102, radius: 10, fill: '#F9A8D4' },
      // Brim (rounded rect at base)
      { type: 'rect', x: 838, y: 263, width: 144, height: 14, fill: '#3B82F6', borderRadius: 7 },
      // Small hat bottom-left
      { type: 'triangle', x1: 100, y1: 970, x2: 140, y2: 870, x3: 180, y3: 970, fill: '#A78BFA' },
      { type: 'circle',   x: 140, y: 866, radius: 12, fill: '#EC4899' },
      { type: 'rect',     x: 96, y: 966, width: 88, height: 10, fill: '#FBBF24', borderRadius: 5 },
      // Confetti scattered (varied colors)
      { type: 'circle', x: 240, y: 120, radius: 9,  fill: '#EC4899' },
      { type: 'circle', x: 285, y: 100, radius: 7,  fill: '#FBBF24' },
      { type: 'circle', x: 320, y: 130, radius: 8,  fill: '#A78BFA' },
      { type: 'rect',   x: 360, y: 110, width: 5, height: 12, fill: '#3B82F6' },
      { type: 'rect',   x: 400, y: 130, width: 5, height: 12, fill: '#EC4899' },
      { type: 'circle', x: 970, y: 700, radius: 10, fill: '#FBBF24' },
      { type: 'circle', x: 80,  y: 600, radius: 9,  fill: '#A78BFA' },
      { type: 'rect',   x: 950, y: 820, width: 5, height: 12, fill: '#EC4899' },
      {
        type: 'photo-slot', id: 'main-photo',
        x: 140, y: 330, width: 800, height: 450,
        shape: 'rounded', borderRadius: 28,
        placeholder: 'แตะเพื่อใส่รูปของคุณ'
      },
      { type: 'text', id: 'title', x: 540, y: 860,
        text: 'สุขสันต์วันเกิด',
        font: 'Mitr', size: 86, weight: 700,
        color: '#5B21B6', align: 'center', editable: true },
      { type: 'text', id: 'subtitle', x: 540, y: 950,
        text: 'มาฉลองวันพิเศษของคุณกันเถอะ 🎉',
        font: 'IBM Plex Sans Thai', size: 34, weight: 500,
        color: '#6D28D9', align: 'center', editable: true },
    ],
  },

  // ── วันเกิด (เดิม) ──────────────────────────────
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
