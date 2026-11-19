(function initEffects() {
  const layer = document.getElementById("sparkle-layer");
  if (layer) {
    const count = 55;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.setProperty("--dur", `${1.5 + Math.random() * 2.5}s`);
      s.style.animationDelay = `${Math.random() * 2}s`;
      layer.appendChild(s);
    }
  }

  const canvas = document.getElementById("fireworks-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let running = false;
  let raf = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  function burst(x, y, hue) {
    const n = 36 + Math.floor(Math.random() * 20);
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.2;
      const speed = 2 + Math.random() * 4.5;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.012 + Math.random() * 0.01,
        hue: hue ?? 42 + Math.random() * 18,
        size: 2 + Math.random() * 2,
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    particles = particles.filter((p) => p.life > 0);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.life -= p.decay;
      ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (running || particles.length > 0) {
      raf = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  function startFireworks(durationMs) {
    running = true;
    if (!raf) loop();

    const start = Date.now();
    const interval = setInterval(() => {
      const x = canvas.width * (0.15 + Math.random() * 0.7);
      const y = canvas.height * (0.15 + Math.random() * 0.45);
      burst(x, y);
      if (Date.now() - start > durationMs) {
        clearInterval(interval);
        running = false;
      }
    }, 380);
  }

  window.startAatishbaazi = function startAatishbaazi() {
    startFireworks(5200);
    burst(canvas.width / 2, canvas.height * 0.35);
    setTimeout(() => burst(canvas.width * 0.3, canvas.height * 0.25), 400);
    setTimeout(() => burst(canvas.width * 0.7, canvas.height * 0.3), 800);
  };
})();