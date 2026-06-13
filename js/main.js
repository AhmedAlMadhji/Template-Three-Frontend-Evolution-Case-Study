/**
 * Template-Three — Interactive enhancements
 * Vanilla JS modules. Visual design unchanged; behavior only.
 */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MOBILE_BREAKPOINT = 768;

  /* ─── Utilities ─── */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function formatCountdownUnit(value) {
    return String(Math.max(0, value)).padStart(2, "0");
  }

  function formatCountdownDays(value) {
    return String(Math.max(0, value));
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  /* ─── Stats Counter ─── */
  const StatsCounter = {
    init() {
      this.section = document.querySelector(".stats");
      this.numbers = document.querySelectorAll(".stats .number[data-goal]");
      if (!this.section || !this.numbers.length) return;

      if (prefersReducedMotion) {
        this.numbers.forEach((el) => this.setFinalValue(el));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animateAll();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.35 }
      );
      observer.observe(this.section);
    },

    setFinalValue(el) {
      const goal = Number(el.dataset.goal);
      const suffix = el.dataset.suffix || "";
      el.textContent = goal + suffix;
    },

    animateAll() {
      this.numbers.forEach((el) => this.animateElement(el));
    },

    animateElement(el) {
      const goal = Number(el.dataset.goal);
      const suffix = el.dataset.suffix || "";
      const duration = 2000;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(easeOutQuart(progress) * goal);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = goal + suffix;
      };

      el.textContent = "0" + suffix;
      requestAnimationFrame(tick);
    },
  };

  /* ─── Events Countdown ─── */
  const Countdown = {
    init() {
      this.section = document.querySelector(".events");
      if (!this.section) return;

      this.daysEl = this.section.querySelector(".days");
      this.hoursEl = this.section.querySelector(".hours");
      this.minutesEl = this.section.querySelector(".minutes");
      this.secondsEl = this.section.querySelector(".seconds");

      const endAttr = this.section.dataset.countdownEnd;
      this.target = endAttr ? new Date(endAttr) : this.defaultTarget();
      if (Number.isNaN(this.target.getTime())) return;

      this.update();
      this.timerId = setInterval(() => this.update(), 1000);
    },

    defaultTarget() {
      const d = new Date();
      d.setDate(d.getDate() + 45);
      d.setHours(18, 0, 0, 0);
      return d;
    },

    update() {
      const diff = this.target - Date.now();
      if (diff <= 0) {
        this.render(0, 0, 0, 0);
        clearInterval(this.timerId);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      this.render(days, hours, minutes, seconds);
    },

    render(days, hours, minutes, seconds) {
      if (this.daysEl) this.daysEl.textContent = formatCountdownDays(days);
      if (this.hoursEl) this.hoursEl.textContent = formatCountdownUnit(hours);
      if (this.minutesEl) this.minutesEl.textContent = formatCountdownUnit(minutes);
      if (this.secondsEl) this.secondsEl.textContent = formatCountdownUnit(seconds);
    },
  };

  /* ─── Mega Menu ─── */
  const MegaMenu = {
    init() {
      this.item = document.querySelector(".mega-nav-item");
      this.trigger = document.getElementById("mega-menu-trigger");
      this.panel = document.getElementById("mega-menu-panel");
      if (!this.item || !this.trigger || !this.panel) return;

      this.trigger.addEventListener("click", (e) => this.onTriggerClick(e));
      document.addEventListener("click", (e) => this.onDocumentClick(e));
      document.addEventListener("keydown", (e) => this.onKeydown(e));
      window.addEventListener("resize", () => this.onResize());

      this.panel.querySelectorAll("a[href^='#']").forEach((link) => {
        link.addEventListener("click", () => this.close());
      });
    },

    isOpen() {
      return this.item.classList.contains("mega-open");
    },

    open() {
      this.item.classList.add("mega-open");
      this.trigger.setAttribute("aria-expanded", "true");
    },

    close() {
      this.item.classList.remove("mega-open");
      this.trigger.setAttribute("aria-expanded", "false");
    },

    toggle() {
      this.isOpen() ? this.close() : this.open();
    },

    onTriggerClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    },

    onDocumentClick(e) {
      if (!this.isOpen()) return;
      if (this.item.contains(e.target)) return;
      this.close();
    },

    onKeydown(e) {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
        this.trigger.focus();
      }
    },

    onResize() {
      if (this.isOpen()) this.close();
    },
  };

  /* ─── Articles Filter ─── */
  const ArticlesFilter = {
    init() {
      this.section = document.querySelector(".articles");
      this.filters = document.querySelector(".articles-filters");
      this.cards = document.querySelectorAll(".articles .card[data-category]");
      if (!this.section || !this.filters || !this.cards.length) return;

      this.filters.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        this.setActive(btn);
        this.filter(btn.dataset.filter);
      });

      if (!prefersReducedMotion) this.observeCards();
    },

    setActive(activeBtn) {
      this.filters.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.toggle("active", btn === activeBtn);
        btn.setAttribute("aria-selected", btn === activeBtn ? "true" : "false");
      });
    },

    filter(category) {
      this.cards.forEach((card) => {
        const match = category === "all" || card.dataset.category === category;
        card.classList.toggle("is-filtered-out", !match);
        card.setAttribute("aria-hidden", match ? "false" : "true");
      });
    },

    observeCards() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      this.cards.forEach((card) => observer.observe(card));
    },
  };

  /* ─── Discount Form ─── */
  const DiscountForm = {
    init() {
      this.form = document.getElementById("discount-form");
      if (!this.form) return;

      this.messageEl = document.getElementById("discount-form-message");
      this.form.addEventListener("submit", (e) => this.onSubmit(e));
      this.form.querySelectorAll(".input").forEach((input) => {
        input.addEventListener("input", () => this.clearFieldError(input));
      });
    },

    onSubmit(e) {
      e.preventDefault();
      const data = new FormData(this.form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const mobile = (data.get("mobile") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      this.clearAllErrors();

      let valid = true;
      if (!name) {
        this.setFieldError("name", "Please enter your name.");
        valid = false;
      }
      if (!email) {
        this.setFieldError("email", "Please enter your email.");
        valid = false;
      } else if (!isValidEmail(email)) {
        this.setFieldError("email", "Please enter a valid email address.");
        valid = false;
      }
      if (!mobile) {
        this.setFieldError("mobile", "Please enter your phone number.");
        valid = false;
      }
      if (!message) {
        this.setFieldError("message", "Please tell us about your needs.");
        valid = false;
      }

      if (!valid) {
        this.showMessage("Please fix the errors below.", "error");
        return;
      }

      this.showMessage("Thank you! Your request has been received.", "success");
      this.form.reset();
    },

    setFieldError(name, text) {
      const field = this.form.querySelector(`[name="${name}"]`);
      const errorEl = this.form.querySelector(`[data-error-for="${name}"]`);
      if (field) field.setAttribute("aria-invalid", "true");
      if (errorEl) errorEl.textContent = text;
    },

    clearFieldError(input) {
      const name = input.getAttribute("name");
      input.removeAttribute("aria-invalid");
      const errorEl = this.form.querySelector(`[data-error-for="${name}"]`);
      if (errorEl) errorEl.textContent = "";
    },

    clearAllErrors() {
      this.form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
      this.form.querySelectorAll("[data-error-for]").forEach((el) => (el.textContent = ""));
    },

    showMessage(text, type) {
      if (!this.messageEl) return;
      this.messageEl.textContent = text;
      this.messageEl.className = `form-message form-message--${type}`;
      this.messageEl.setAttribute("role", type === "error" ? "alert" : "status");
    },
  };

  /* ─── Events Subscribe Form ─── */
  const SubscribeForm = {
    init() {
      this.form = document.getElementById("subscribe-form");
      if (!this.form) return;

      this.messageEl = document.getElementById("subscribe-form-message");
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = this.form.querySelector('[name="email"]').value.trim();
        if (!email || !isValidEmail(email)) {
          this.showMessage("Please enter a valid email address.", "error");
          return;
        }
        this.showMessage("Subscribed successfully!", "success");
        this.form.reset();
      });
    },

    showMessage(text, type) {
      if (!this.messageEl) return;
      this.messageEl.textContent = text;
      this.messageEl.className = `form-message form-message--${type}`;
    },
  };

  /* ─── Scroll & Active Nav ─── */
  const ScrollNav = {
    init() {
      this.header = document.getElementById("header");
      this.navLinks = document.querySelectorAll(".main-nav > li > a[href^='#']:not([href='#'])");
      this.anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"]):not(#mega-menu-trigger)');
      this.sections = document.querySelectorAll("main section[id]");

      this.anchorLinks.forEach((link) => {
        link.addEventListener("click", (e) => this.onAnchorClick(e, link));
      });

      this.setupActiveObserver();
    },

    onAnchorClick(e, link) {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      this.scrollToTarget(target, href);
    },

    scrollToTarget(target, hash) {
      if (target === this.header || target.id === "header") {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        if (hash) history.pushState(null, "", hash);
        return;
      }

      const headerHeight = this.header ? this.header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      if (hash) history.pushState(null, "", hash);
    },

    setupActiveObserver() {
      const sectionMap = new Map();
      this.sections.forEach((section) => {
        if (!section.id) return;
        sectionMap.set(section.id, section);
      });

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (!visible.length) return;
          this.setActiveLink(visible[0].target.id);
        },
        { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.15, 0.4] }
      );

      sectionMap.forEach((section) => observer.observe(section));
    },

    setActiveLink(sectionId) {
      const normalized = `#${sectionId}`;
      this.navLinks.forEach((link) => {
        link.classList.toggle("nav-active", link.getAttribute("href") === normalized);
      });
    },
  };

  /* ─── Scroll Reveal ─── */
  const ScrollReveal = {
    init() {
      const elements = document.querySelectorAll(".reveal, .reveal-stagger");
      if (!elements.length) return;

      if (prefersReducedMotion) {
        elements.forEach((el) => el.classList.add("revealed"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
      );

      elements.forEach((el) => observer.observe(el));
    },
  };

  /* ─── Boot ─── */
  function initHeaderScroll() {
    const header = document.getElementById("header");
    const upBtn = document.querySelector(".up");
    if (!header) return;

    const darkSections = document.querySelectorAll(
      ".gallery, .services, .pricing, .stats, .case-study, .footer"
    );
    let activeDarkSection = null;

    if (darkSections.length) {
      const darkObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activeDarkSection = entry.target;
            } else if (activeDarkSection === entry.target) {
              activeDarkSection = null;
            }
          });
          header.classList.toggle(
            "header--on-dark",
            Boolean(activeDarkSection && window.scrollY > 60)
          );
        },
        { rootMargin: "-68px 0px -55% 0px", threshold: 0 }
      );

      darkSections.forEach((section) => darkObserver.observe(section));
    }

    const onScroll = () => {
      const y = window.scrollY;
      const isScrolled = y > 60;
      header.classList.toggle("is-scrolled", isScrolled);
      header.classList.toggle(
        "header--on-dark",
        isScrolled && Boolean(activeDarkSection)
      );
      if (upBtn) upBtn.classList.toggle("is-visible", y > 350);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function init() {
    document.documentElement.classList.add("js-ready");
    initHeaderScroll();
    StatsCounter.init();
    Countdown.init();
    MegaMenu.init();
    ArticlesFilter.init();
    DiscountForm.init();
    SubscribeForm.init();
    ScrollNav.init();
    ScrollReveal.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
