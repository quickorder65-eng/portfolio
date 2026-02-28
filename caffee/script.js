// script.js
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Sticky nav: mobile toggle
  const navToggle = $("#navToggle");
  const navList = $("#navList");

  const setNavOpen = (open) => {
    if (!navToggle || !navList) return;
    navList.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.body.style.overflow = open ? "hidden" : "";
  };

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.contains("is-open");
      setNavOpen(!isOpen);
    });

    // Close on link click (mobile)
    navList.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      setNavOpen(false);
    });

    // Close on resize up
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 721px)").matches) setNavOpen(false);
    });
  }

  // Smooth anchor (extra safety for older browsers)
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Scroll progress bar
  const scrollBar = $("#scrollBar");
  const onScrollProgress = () => {
    if (!scrollBar) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    scrollBar.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", onScrollProgress, { passive: true });
  onScrollProgress();

  // Parallax hero background
  const heroBg = $("#heroBg");
  const parallax = () => {
    if (!heroBg) return;
    const y = window.scrollY || 0;
    // translate a bit for a subtle premium parallax feel
    heroBg.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.04)`;
  };
  window.addEventListener("scroll", parallax, { passive: true });
  parallax();

  // Reveal on scroll (Intersection Observer)
  const revealEls = $$(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  // Menu filtering
  const chips = $$(".chip");
  const cards = $$(".menu-card");
  const setActiveChip = (chip) => {
    chips.forEach((c) => {
      const active = c === chip;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-selected", String(active));
    });
  };

  const filterMenu = (key) => {
    cards.forEach((card) => {
      const cat = card.getAttribute("data-category");
      const show = key === "all" || cat === key;
      card.style.display = show ? "" : "none";
    });
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.getAttribute("data-filter") || "all";
      setActiveChip(chip);
      filterMenu(key);
    });
  });

  // Toast helper
  const toast = $("#toast");
  let toastTimer = null;

  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 1800);
  };

  // "Add" interaction (demo)
  $$(".addToCart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name") || "Позиция";
      showToast(`Добавлено: ${name}`);
    });
  });

  // Modal (hours)
  const modal = $("#modal");
  const openHoursBtn = $("#openHours");

  const openModal = () => {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  if (openHoursBtn) openHoursBtn.addEventListener("click", openModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      const shouldClose = e.target.closest("[data-close='true']");
      if (shouldClose) closeModal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }
})();