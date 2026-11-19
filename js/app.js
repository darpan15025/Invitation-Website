(function initApp() {
  const header = document.getElementById("site-header");
  const progress = document.getElementById("header-progress");
  const navLinks = document.querySelectorAll(".nav-bar a[data-route]");
  const sections = document.querySelectorAll(".view[data-view]");

  let lastScrollY = window.scrollY;
  let scrollTicking = false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateHeaderOnScroll() {
    const y = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (y / docHeight) * 100) : 0;

    if (progress) {
      progress.style.width = `${pct}%`;
    }

    if (header) {
      header.classList.toggle("is-scrolled", y > 24);

      if (!reducedMotion) {
        const scrollingDown = y > lastScrollY;
        const pastHero = y > 100;

        if (scrollingDown && pastHero) {
          header.classList.add("is-hidden");
        } else {
          header.classList.remove("is-hidden");
        }
      }
    }

    lastScrollY = y;
    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        requestAnimationFrame(updateHeaderOnScroll);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  updateHeaderOnScroll();

  function setActiveNav(route) {
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.dataset.route === route);
    });
  }

  function routeFromHash() {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }
      setActiveNav(hash);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.dataset.view);
          if (entry.target.dataset.view === "shubh-tithi") {
            window.dispatchEvent(new Event("scratch-resize"));
          }
        }
      });
    },
    { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));

  window.addEventListener("hashchange", routeFromHash);
  if (window.location.hash) {
    setTimeout(routeFromHash, 100);
  } else {
    setActiveNav("ghar");
  }

  const wedding = new Date("2026-12-14T19:00:00+05:30");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tickCountdown() {
    const now = new Date();
    const diff = Math.max(0, wedding - now);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const elDays = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMins = document.getElementById("cd-mins");
    const elSecs = document.getElementById("cd-secs");
    if (elDays) elDays.textContent = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMins) elMins.textContent = pad(mins);
    if (elSecs) elSecs.textContent = pad(secs);
  }

  tickCountdown();
  setInterval(tickCountdown, 1000);

  const fireBtns = ["btn-aatish-hero", "btn-aatish-tithi", "btn-aatish-footer"];
  fireBtns.forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => {
      window.startAatishbaazi?.();
    });
  });

  window.addEventListener("scratch-resize", () => {
    window.dispatchEvent(new Event("resize"));
  });

})();