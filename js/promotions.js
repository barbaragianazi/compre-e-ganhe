/* ============================================
   PROMOTIONS PAGE — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  ThemeSwitcher.init();
  initHeader();
  initFilters();
  initLoginModal();
  initScrollReveal();
  checkAutoRedirect();
});

/* ============================================
   REDIRECT — if already logged in
   ============================================ */

function checkAutoRedirect() {
  if (Auth.isLoggedIn()) {
    window.location.href = 'area-logada.html#promocao';
  }
}

/* ============================================
   HEADER — scroll shadow
   ============================================ */

function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================
   FILTERS — pill tabs
   ============================================ */

function initFilters() {
  const pills = document.querySelectorAll('.promo-filter__pill');
  const cards = document.querySelectorAll('.promo-card[data-category]');

  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.dataset.filter;

      cards.forEach(card => {
        const cardCats = (card.dataset.category || '').split(/\s+/);
        const matches  = cat === 'all' || cardCats.includes(cat);
        card.style.display = matches ? '' : 'none';

        /* micro-fade on filter switch */
        if (matches) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 300ms ease, transform 300ms ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        }
      });
    });
  });
}

/* ============================================
   LOGIN MODAL
   ============================================ */

function initLoginModal() {
  const modal        = document.getElementById('login-modal');
  const overlay      = modal?.querySelector('.login-modal__overlay');
  const closeBtn     = modal?.querySelector('.login-modal__close');
  const form         = document.getElementById('login-form');
  const errorEl      = document.getElementById('login-error');
  const roleTabs     = document.querySelectorAll('.login-modal__tab');
  const emailInput   = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  if (!modal) return;

  /* open triggers */
  document.querySelectorAll('[data-open-login]').forEach(trigger => {
    trigger.addEventListener('click', () => openModal());
  });

  /* close triggers */
  [overlay, closeBtn].forEach(el => el?.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* role tabs */
  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const role = tab.dataset.role;
      if (emailInput) {
        emailInput.placeholder = role === 'admin' ? 'admin@admin.com' : 'user@user.com.br';
        emailInput.value = '';
      }
      if (passwordInput) passwordInput.value = '';
      clearError();
    });
  });

  /* form submit */
  form?.addEventListener('submit', e => {
    e.preventDefault();
    clearError();

    const email    = emailInput?.value.trim() || '';
    const password = passwordInput?.value || '';
    const result   = Auth.login(email, password);

    if (result.ok) {
      showSuccess();
      setTimeout(() => {
        window.location.href = 'area-logada.html#promocao';
      }, 800);
    } else {
      showError(result.message);
      /* shake input group */
      form.querySelector('.login-modal__fields')?.classList.add('shake');
      setTimeout(() => form.querySelector('.login-modal__fields')?.classList.remove('shake'), 600);
    }
  });

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => emailInput?.focus(), 300);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    form?.reset();
    clearError();
  }

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
  }

  function clearError() {
    if (!errorEl) return;
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }

  function showSuccess() {
    if (!form) return;
    const btn = form.querySelector('.login-modal__submit');
    if (btn) {
      btn.textContent = 'Redirecionando…';
      btn.disabled = true;
    }
  }
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
  }, { threshold: 0.10, rootMargin: '0px 0px -32px 0px' });

  els.forEach(el => observer.observe(el));
}
