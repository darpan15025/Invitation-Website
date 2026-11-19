(function initScratch() {
  const canvas = document.getElementById("scratch-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const wrap = canvas.parentElement;
  let revealed = false;

  function resizeCanvas() {
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawOverlay(rect.width, rect.height);
  }

  function drawOverlay(w, h) {
    const grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, "#b8962e");
    grd.addColorStop(0.5, "#8a6b18");
    grd.addColorStop(1, "#d4af37");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(61, 10, 16, 0.85)";
    ctx.font = "600 14px Cinzel, serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", w / 2, h / 2 - 8);
    ctx.font = "13px 'Noto Serif Devanagari', serif";
    ctx.fillText("यहाँ खुरचें", w / 2, h / 2 + 16);
  }

  function scratch(x, y) {
    const radius = 28;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    checkReveal();
  }

  function checkReveal() {
    if (revealed) return;
    const { width, height } = canvas;
    const sample = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    for (let i = 3; i < sample.length; i += 16) {
      if (sample[i] === 0) transparent++;
    }
    const ratio = transparent / (sample.length / 16);
    if (ratio > 0.42) {
      revealed = true;
      canvas.style.transition = "opacity 0.6s ease";
      canvas.style.opacity = "0";
      setTimeout(() => {
        canvas.style.pointerEvents = "none";
      }, 600);
    }
  }

  function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  let drawing = false;

  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    wrap?.classList.add("scratching");
    canvas.setPointerCapture(e.pointerId);
    const { x, y } = pointerPos(e);
    scratch(x, y);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const { x, y } = pointerPos(e);
    scratch(x, y);
  });

  canvas.addEventListener("pointerup", () => {
    drawing = false;
  });

  canvas.addEventListener("pointerleave", () => {
    drawing = false;
  });

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
})();