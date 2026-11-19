(function initAnimations() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (!el.classList.contains(`reveal-delay-${(i % 4) + 1}`)) {
      el.classList.add(`reveal-delay-${(i % 4) + 1}`);
    }
  });

  if (!reduced) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    document.querySelectorAll("#ghar .reveal, #ghar .mandala-frame > *").forEach((el) => {
      el.classList.add("is-visible");
    });
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  function spawnPetal() {
    if (reduced) return;
    const petal = document.createElement("span");
    petal.className = `petal${Math.random() > 0.5 ? " petal--gold" : ""}`;
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${10 + Math.random() * 8}s`;
    petal.style.animationDelay = `${Math.random() * 2}s`;
    document.body.appendChild(petal);
    petal.addEventListener("animationend", () => petal.remove());
  }

  if (!reduced) {
    setInterval(spawnPetal, 900);
    for (let i = 0; i < 8; i++) spawnPetal();
  }

  const overlay = document.getElementById("page-transition-overlay");

  document.querySelectorAll('.nav-bar a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href")?.slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      if (overlay && !reduced) {
        overlay.classList.add("active");
        setTimeout(() => overlay.classList.remove("active"), 400);
      }
      const header = document.getElementById("site-header");
      header?.classList.remove("is-hidden");
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", `#${id}`);
    });
  });
})();