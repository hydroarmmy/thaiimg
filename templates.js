/* ─────────────────────────────────────────────────────
   Templates Gallery — category tabs + grid + thumbnails
   ───────────────────────────────────────────────────── */

(function () {
  const cats   = window.THAIIMG_CATEGORIES || [];
  const tmpls  = window.THAIIMG_TEMPLATES  || [];

  const tabsEl = document.getElementById('categoryTabs');
  const gridEl = document.getElementById('templatesGrid');

  let activeCat = 'all';

  // ── Build category tabs ──
  cats.forEach(c => {
    const a = document.createElement('button');
    a.className = 'template-tab';
    a.dataset.cat = c.id;
    a.textContent = c.label;
    a.addEventListener('click', () => {
      activeCat = c.id;
      renderTabs();
      renderGrid();
    });
    tabsEl.appendChild(a);
  });

  function renderTabs() {
    [...tabsEl.children].forEach(el => {
      el.classList.toggle('active', el.dataset.cat === activeCat);
    });
  }

  // ── Render thumbnail to a small canvas for each template ──
  function renderThumbnail(canvas, tpl) {
    const ctx = canvas.getContext('2d');
    const scale = canvas.width / tpl.width;
    ctx.save();
    ctx.scale(scale, scale);

    // background
    const bg = tpl.background;
    if (bg.type === 'color') {
      ctx.fillStyle = bg.value;
      ctx.fillRect(0, 0, tpl.width, tpl.height);
    } else if (bg.type === 'gradient') {
      const g = ctx.createLinearGradient(0, 0, 0, tpl.height);
      bg.colors.forEach((c, i) => g.addColorStop(i / (bg.colors.length - 1), c));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, tpl.width, tpl.height);
    }

    // layers
    tpl.layers.forEach(l => {
      if (l.type === 'circle') {
        ctx.fillStyle = l.fill;
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (l.type === 'photo-slot') {
        // Show placeholder pattern
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.beginPath();
        if (l.shape === 'circle') {
          ctx.arc(l.x + l.width/2, l.y + l.height/2, Math.min(l.width, l.height)/2, 0, Math.PI*2);
        } else if (l.shape === 'rounded') {
          roundedRectPath(ctx, l.x, l.y, l.width, l.height, l.borderRadius || 16);
        } else {
          ctx.rect(l.x, l.y, l.width, l.height);
        }
        ctx.fill();

        ctx.strokeStyle = '#E97132';
        ctx.lineWidth = 4;
        ctx.setLineDash([16, 12]);
        ctx.beginPath();
        if (l.shape === 'circle') {
          ctx.arc(l.x + l.width/2, l.y + l.height/2, Math.min(l.width, l.height)/2, 0, Math.PI*2);
        } else if (l.shape === 'rounded') {
          roundedRectPath(ctx, l.x, l.y, l.width, l.height, l.borderRadius || 16);
        } else {
          ctx.rect(l.x, l.y, l.width, l.height);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (l.type === 'text') {
        ctx.fillStyle = l.color;
        ctx.font = `${l.weight || 500} ${l.size}px "${l.font}", "IBM Plex Sans Thai", sans-serif`;
        ctx.textAlign = l.align || 'left';
        ctx.textBaseline = 'middle';
        const lines = l.text.split('\n');
        const lineH = l.size * 1.2;
        const startY = l.y - ((lines.length - 1) * lineH) / 2;
        lines.forEach((line, i) => ctx.fillText(line, l.x, startY + i * lineH));
      }
    });

    ctx.restore();
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    r = Math.min(r, w/2, h/2);
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.arcTo(x+w, y, x+w, y+r, r);
    ctx.lineTo(x+w, y+h-r);
    ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
    ctx.lineTo(x+r, y+h);
    ctx.arcTo(x, y+h, x, y+h-r, r);
    ctx.lineTo(x, y+r);
    ctx.arcTo(x, y, x+r, y, r);
  }

  // ── Render template grid ──
  function renderGrid() {
    const list = activeCat === 'all'
      ? tmpls
      : tmpls.filter(t => t.category === activeCat);

    gridEl.innerHTML = '';

    if (list.length === 0) {
      gridEl.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px">ยังไม่มีเทมเพลตในหมวดนี้ — กำลังเพิ่มอยู่</p>';
      return;
    }

    list.forEach(tpl => {
      const card = document.createElement('a');
      card.className = 'template-card';
      card.href = `/templates-editor?t=${encodeURIComponent(tpl.id)}`;
      card.setAttribute('aria-label', tpl.name);

      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400 * (tpl.height / tpl.width);
      canvas.className = 'template-card-canvas';
      card.appendChild(canvas);

      const meta = document.createElement('div');
      meta.className = 'template-card-meta';
      meta.innerHTML = `
        <span class="template-card-cat">${tpl.categoryLabel || ''}</span>
        <span class="template-card-name">${tpl.name}</span>
      `;
      card.appendChild(meta);

      gridEl.appendChild(card);

      // Render thumbnail after fonts are ready
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => renderThumbnail(canvas, tpl));
      } else {
        setTimeout(() => renderThumbnail(canvas, tpl), 200);
      }

      card.addEventListener('click', () => {
        if (typeof gtag === 'function') {
          gtag('event', 'template_selected', { template: tpl.id });
        }
      });
    });
  }

  // Init
  renderTabs();
  renderGrid();
})();
