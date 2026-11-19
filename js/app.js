(function initApp() {
  const views = document.querySelectorAll(".view");
  const navLinks = document.querySelectorAll(".nav-bar a[data-route]");

  function routeFromHash() {
    const hash = window.location.hash.replace(/^#/, "") || "ghar";
    views.forEach((v) => {
      v.classList.toggle("active", v.dataset.view === hash);
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.dataset.route === hash);
    });
    if (hash === "shubh-tithi") {
      window.dispatchEvent(new Event("scratch-resize"));
    }
  }

  window.addEventListener("hashchange", routeFromHash);
  routeFromHash();

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

  ["btn-aatish-hero", "btn-aatish-tithi", "btn-aatish-footer"].forEach((id) => {
    const btn = document.getElementById(id);
    btn?.addEventListener("click", () => {
      if (typeof window.startAatishbaazi === "function") {
        window.startAatishbaazi();
      }
    });
  });

  window.addEventListener("scratch-resize", () => {
    window.dispatchEvent(new Event("resize"));
  });
})();