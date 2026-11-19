(function initEffects() {
  const layer = document.getElementById("sparkle-layer");
  if (layer) {
    const count = 80;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.setProperty("--dur", `${1.2 + Math.random() * 2.8}s`);
      s.style.setProperty("--drift-dur", `${4 + Math.random() * 8}s`);
      s.style.animationDelay = `${Math.random() * 3}s`;
      const size = 2 + Math.random() * 4;
      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
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

  function burst(x, y, hue, count) {
    const n = count ?? 36 + Math.floor(Math.random() * 24);
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.25;
      const speed = 2.5 + Math.random() * 5;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.01 + Math.random() * 0.012,
        hue: hue ?? 38 + Math.random() * 22,
        size: 2 + Math.random() * 2.5,
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
      p.vy += 0.045;
      p.vx *= 0.992;
      p.life -= p.decay;
      ctx.fillStyle = `hsla(${p.hue}, 95%, 62%, ${p.life})`;
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running = true;
    if (!raf) loop();

    const start = Date.now();
    const interval = setInterval(() => {
      burst(
        canvas.width * (0.1 + Math.random() * 0.8),
        canvas.height * (0.12 + Math.random() * 0.45),
        35 + Math.random() * 20
      );
      if (Date.now() - start > durationMs) {
        clearInterval(interval);
        running = false;
      }
    }, 320);
  }

  window.startAatishbaazi = function startAatishbaazi() {
    startFireworks(6000);
    burst(canvas.width / 2, canvas.height * 0.32, 42, 50);
    setTimeout(() => burst(canvas.width * 0.25, canvas.height * 0.22, 48, 40), 350);
    setTimeout(() => burst(canvas.width * 0.75, canvas.height * 0.28, 36, 40), 700);
  };
})();