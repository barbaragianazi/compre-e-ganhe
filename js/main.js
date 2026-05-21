/* ============================================
   MAIN — Interactions & Behaviors
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  ThemeSwitcher.init();
  initHeader();
  initMobileNav();
  initHeroBlurFade();
  initScrollReveal();
  initSteps();
  initActiveNav();
});

/* ============================================
   HERO TITLE — BlurFade on load
   ============================================ */

function initHeroBlurFade() {
  const title = document.querySelector('.hero__title');
  if (!title) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      title.classList.add('hero__title--play');
    });
  });
}

/* ============================================
   HEADER — scroll state
   ============================================ */

function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================
   MOBILE NAV
   ============================================ */

function initMobileNav() {
  const toggle = document.querySelector('.header__menu-toggle');
  const nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   SCROLL REVEAL — IntersectionObserver
   ============================================ */

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ============================================
   STEPS — hover activate
   ============================================ */

function initSteps() {
  const steps = document.querySelectorAll('.step');
  if (!steps.length) return;

  steps.forEach((step, i) => {
    step.addEventListener('mouseenter', () => {
      steps.forEach((s, j) => {
        s.classList.toggle('active', j <= i);
      });
    });
  });

  document.querySelector('.steps-timeline')?.addEventListener('mouseleave', () => {
    steps.forEach(s => s.classList.remove('active'));
  });
}

/* ============================================
   ACTIVE NAV — highlight on scroll
   ============================================ */

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}
