/* ============================================
   MAIN — Interactions & Behaviors
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD
  initAuthGuard();
  ThemeSwitcher.init();
  initHeader();
  Auth.initUserMenu();
  initMobileNav();
  initHeroBlurFade();
  initItemDetailsModal();
=======
  ThemeSwitcher.init();
  initHeader();
  initMobileNav();
  initHeroBlurFade();
>>>>>>> 3773146bd72f5ff921b4f8048dbde727f5d16448
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

<<<<<<< HEAD
  const underline = title.querySelector('.hero__title-underline');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    underline?.classList.add('is-drawing');
    return;
  }
=======
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
>>>>>>> 3773146bd72f5ff921b4f8048dbde727f5d16448

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      title.classList.add('hero__title--play');
<<<<<<< HEAD
      if (underline) {
        window.setTimeout(() => underline.classList.add('is-drawing'), 650);
      }
=======
>>>>>>> 3773146bd72f5ff921b4f8048dbde727f5d16448
    });
  });
}

/* ============================================
<<<<<<< HEAD
   AUTH GUARD — área logada
   ============================================ */

function initAuthGuard() {
  if (!document.body.classList.contains('area-logada')) return;
  if (typeof Auth === 'undefined' || !Auth.isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

/* ============================================
=======
>>>>>>> 3773146bd72f5ff921b4f8048dbde727f5d16448
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
<<<<<<< HEAD
   ITEM DETAILS MODAL
   ============================================ */

function initItemDetailsModal() {
  const modal = document.getElementById('item-modal');
  const image = modal?.querySelector('.item-modal__image');
  const eyebrow = document.getElementById('item-modal-eyebrow');
  const title = document.getElementById('item-modal-title');
  const desc = document.getElementById('item-modal-desc');
  const closeTriggers = modal?.querySelectorAll('[data-close-item-modal]');
  const cards = document.querySelectorAll('.product-card, .gift-card');

  if (!modal || !image || !eyebrow || !title || !desc || !cards.length) return;

  let activeTrigger = null;
  let previousBodyOverflow = '';

  cards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openModal(card);
    });
  });

  closeTriggers?.forEach(trigger => {
    trigger.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  function openModal(card) {
    const isProduct = card.classList.contains('product-card');
    const cardImage = card.querySelector('img');
    const cardEyebrow = card.querySelector(isProduct ? '.product-card__category' : '.gift-card__rank');
    const cardTitle = card.querySelector(isProduct ? '.product-card__name' : '.gift-card__name');
    const cardDesc = card.querySelector(isProduct ? '.product-card__desc' : '.gift-card__desc');

    if (!cardTitle || !cardDesc) return;

    activeTrigger = card;
    previousBodyOverflow = document.body.style.overflow;

    image.src = cardImage?.getAttribute('src') || '';
    image.alt = cardTitle.textContent.trim();
    eyebrow.textContent = cardEyebrow?.textContent.trim() || (isProduct ? 'Produto participante' : 'Brinde exclusivo');
    title.textContent = cardTitle.textContent.trim();
    desc.textContent = cardDesc.textContent.trim();

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.item-modal__close')?.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = previousBodyOverflow;

    if (activeTrigger instanceof HTMLElement) {
      activeTrigger.focus();
    }

    activeTrigger = null;
  }
}

/* ============================================
=======
>>>>>>> 3773146bd72f5ff921b4f8048dbde727f5d16448
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
