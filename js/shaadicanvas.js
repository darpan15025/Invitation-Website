(function () {
  /** Sirf shubh vivah — mehndi, haldi, sangeet, reception, baraat, etc. off */
  const WEDDING_ONLY = true;
  const events = [
    {
      key: "wedding",
      title: "Shubh Vivah",
      when: "SOMVAAR · 14 DEC 2026 · SHAAM 7:00",
      venue: "Goel Regency, Pilkhuwa",
      description:
        "Pheron ke saath bandhega saat janmon ka bandhan — aapki upasthiti hamari khushi hai.",
      image: "assets/events/baraat.jpg",
      alt: "Shubh vivah samaaroh",
    },
  ];

  function renderEvents() {
    const root = document.getElementById("eventsList");
    if (!root) return;
    const list = WEDDING_ONLY ? events.filter((e) => e.key === "wedding") : events;
    root.innerHTML = list
      .map(
        (e) => `
      <article class="event-card rv in">
        <img src="${e.image}" alt="${e.alt}" loading="lazy" />
        <p class="when">${e.when}</p>
        <h3>${e.title}</h3>
        <p>${e.description}</p>
        <p class="when" style="margin-top: 8px; opacity: 0.9">${e.venue}</p>
      </article>`
      )
      .join("");
  }

  const app = document.getElementById("app");
  const opening = document.getElementById("opening");
  const openBtn = document.getElementById("openInvite");
  const dock = document.getElementById("dock");
  const target = new Date("2026-12-14T19:00:00+05:30").getTime();

  function openInvitation() {
    opening.classList.add("done");
    app.classList.add("ready");
    try {
      sessionStorage.setItem("tania-prabhat-open", "1");
    } catch (_e) {}
    setTimeout(() => dock.classList.add("show"), 800);
    bindScratch();
    startCountdown();
  }

  renderEvents();

  openBtn.addEventListener("click", openInvitation);
  try {
    if (sessionStorage.getItem("tania-prabhat-open") === "1") {
      opening.classList.add("done");
      app.classList.add("ready");
      dock.classList.add("show");
      bindScratch();
      startCountdown();
    }
  } catch (_e) {}

  const revealEls = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  const dockLinks = dock.querySelectorAll("a");
  const sections = [...dockLinks].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const navIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = "#" + e.target.id;
          dockLinks.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === id));
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => navIo.observe(s));
  }

  let scratchBound = false;
  function bindScratch() {
    if (scratchBound) return;
    scratchBound = true;
    const canvas = document.getElementById("scratchCanvas");
    const tapBtn = document.getElementById("tapReveal");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let drawing = false;
    let last = null;
    let revealed = false;

    function sizeCanvas() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFoil(w, h);
    }

    function paintFoil(w, h) {
      if (revealed) return;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#a8741f");
      g.addColorStop(0.35, "#f3d58a");
      g.addColorStop(0.65, "#c9932f");
      g.addColorStop(1, "#a8741f");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(110, 20, 35, 0.14)";
      for (let i = 0; i < 90; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
      ctx.textAlign = "center";
      ctx.fillStyle = "#4a0d1c";
      ctx.font = '600 11px "Cinzel", serif';
      ctx.fillText("✦ SCRATCH TO REVEAL ✦", w / 2, h / 2);
    }

    function pos(e) {
      const r = canvas.getBoundingClientRect();
      const k = canvas.offsetWidth / r.width;
      return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
    }

    function scratchTo(p) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 34;
      ctx.beginPath();
      ctx.moveTo((last || p).x, (last || p).y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
    }

    function cleared() {
      const { width: w, height: h } = canvas;
      const data = ctx.getImageData(0, 0, w, h).data;
      let clear = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 4 * 28) {
        total++;
        if (data[i] < 40) clear++;
      }
      return clear / total;
    }

    function finishReveal() {
      if (revealed) return;
      revealed = true;
      drawing = false;
      canvas.classList.add("done");
      document.getElementById("afterCount").hidden = false;
      startCountdown();
    }

    canvas.addEventListener("pointerdown", (e) => {
      if (revealed) return;
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      last = null;
      scratchTo(pos(e));
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!drawing) return;
      scratchTo(pos(e));
      if (cleared() > 0.42) finishReveal();
    });
    const end = () => {
      if (!drawing) return;
      drawing = false;
      last = null;
      if (cleared() > 0.35) finishReveal();
    };
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    tapBtn.addEventListener("click", finishReveal);

    sizeCanvas();
    window.addEventListener("resize", () => {
      if (!revealed) sizeCanvas();
    });
  }

  let countdownStarted = false;
  function startCountdown() {
    if (countdownStarted) return;
    countdownStarted = true;
    const ids = ["cd-days", "cd-hours", "cd-mins", "cd-secs"];
    function tick() {
      let d = target - Date.now();
      if (d < 0) d = 0;
      const v = {
        "cd-days": Math.floor(d / 86400000),
        "cd-hours": Math.floor((d % 86400000) / 3600000),
        "cd-mins": Math.floor((d % 3600000) / 60000),
        "cd-secs": Math.floor((d % 60000) / 1000),
      };
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(v[id]).padStart(2, "0");
      });
    }
    tick();
    setInterval(tick, 1000);
  }
})();