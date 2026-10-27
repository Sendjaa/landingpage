/* Sela Barat — minimal interaction */
(function () {
  "use strict";

  var btn = document.getElementById("mobile-menu-btn");
  var menu = document.getElementById("mobile-menu");

  function closeMobileMenu() {
    if (!menu || !btn) return;
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
  window.closeMobileMenu = closeMobileMenu;

  if (btn && menu) {
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      btn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
  }

  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hero video rotation. Two <video> elements swap with a crossfade so there is
  // no poster flash between clips.
  var heroVideos = document.querySelectorAll(".hero-bg");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var HERO = [
    "assets/hero/hero-1.mp4",
    "assets/hero/hero-5.mp4",
    "assets/hero/hero-6.mp4",
    "assets/hero/hero-7.mp4"
  ];
  var heroIdx = 0, heroCur = 0;
  var heroTimer = null;

  function heroPlay(el) {
    // Some browsers reject play() until the element is allowed; ignore and retry on next swap.
    var p = el.play();
    if (p && p.catch) p.catch(function () {});
  }

  function heroAdvance() {
    if (reduceMotion || heroVideos.length < 2) return;
    heroIdx = (heroIdx + 1) % HERO.length;
    var next = heroVideos[1 - heroCur];
    var cur = heroVideos[heroCur];

    next.src = HERO[heroIdx];
    heroPlay(next);
    next.classList.add("is-active");
    cur.classList.remove("is-active");

    // Free the old element's buffer once the fade is done.
    setTimeout(function () {
      if (!cur.classList.contains("is-active")) {
        cur.pause();
        cur.removeAttribute("src");
        cur.load();
      }
    }, 1400);

    heroCur = 1 - heroCur;
    heroSchedule();
  }

  function heroSchedule() {
    clearTimeout(heroTimer);
    var active = heroVideos[heroCur];
    var ms = (active.duration && isFinite(active.duration) ? active.duration : 12) * 1000;
    heroTimer = setTimeout(heroAdvance, Math.max(4000, ms - 1200));
  }

  if (heroVideos.length && !reduceMotion) {
    var first = heroVideos[heroCur];
    heroPlay(first);
    if (first.readyState >= 1) heroSchedule();
    else first.addEventListener("loadedmetadata", heroSchedule, { once: true });
    // If metadata never arrives (blocked asset), still rotate on a fixed clock.
    setTimeout(function () { if (!heroTimer) heroSchedule(); }, 5000);
  } else {
    // Reduced motion: keep the poster frame, no playback.
    for (var hv = 0; hv < heroVideos.length; hv++) {
      heroVideos[hv].pause();
      heroVideos[hv].removeAttribute("autoplay");
    }
  }
})();
