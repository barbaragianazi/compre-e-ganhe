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
    window.location.href = getPostLoginRedirect();
  }
}

function getPostLoginRedirect(role = Auth.getRole()) {
  return role === 'admin' ? 'admin.html' : 'area-logada.html#promocao';
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
  const messageEl    = document.getElementById('login-message');
  const headingEl    = document.getElementById('modal-heading');
  const subEl        = document.getElementById('login-modal-sub');
  const backBtn      = modal?.querySelector('[data-login-back]');
  const resendBtn    = modal?.querySelector('[data-resend-otp]');
  const emailStep    = modal?.querySelector('[data-login-step="email"]');
  const otpStep      = modal?.querySelector('[data-login-step="otp"]');
  const emailInput   = document.getElementById('login-email');
  const otpInputs    = Array.from(modal?.querySelectorAll('[data-otp-input]') || []);
  const submitBtn    = form?.querySelector('.login-modal__submit');

  const RESEND_SECONDS = 60;
  const EMAIL_HEADING = 'Login na plataforma';
  const EMAIL_SUB = 'Acesse sua conta para ver seu progresso e participar das promoções ativas.';
  let currentStep = 'email';
  let selectedEmail = '';
  let resendTimer = null;
  let remainingSeconds = RESEND_SECONDS;

  if (!modal) return;

  /* open triggers */
  document.querySelectorAll('[data-open-login]').forEach(trigger => {
    trigger.addEventListener('click', () => openModal());
  });

  /* close triggers */
  [overlay, closeBtn].forEach(el => el?.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  backBtn?.addEventListener('click', () => showEmailStep());
  resendBtn?.addEventListener('click', resendCode);
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => handleOtpInput(input, index));
    input.addEventListener('keydown', event => handleOtpKeydown(event, index));
    input.addEventListener('paste', handleOtpPaste);
  });

  /* form submit */
  form?.addEventListener('submit', e => {
    e.preventDefault();
    clearError();
    clearMessage();

    if (currentStep === 'email') {
      requestCode();
      return;
    }

    verifyCode();
  });

  function requestCode() {
    const email = emailInput?.value.trim().toLowerCase() || '';

    if (!email) {
      showError('Informe seu e-mail para continuar.');
      shakeActiveFields();
      return;
    }

    if (!Auth.hasUser(email)) {
      showError('E-mail não encontrado.');
      shakeActiveFields();
      return;
    }

    selectedEmail = email;
    showOtpStep();
  }

  function verifyCode() {
    const code = getOtpCode();

    if (code.length !== 6) {
      showError('Informe o código de 6 dígitos.');
      shakeActiveFields();
      return;
    }

    const result = Auth.login(selectedEmail, code);

    if (result.ok) {
      showSuccess();
      setTimeout(() => {
        window.location.href = getPostLoginRedirect(result.role);
      }, 800);
    } else {
      showError(result.message);
      shakeActiveFields();
    }
  }

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    showEmailStep(false);
    setTimeout(() => emailInput?.focus(), 300);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    form?.reset();
    showEmailStep(false);
    resetOtp();
    clearError();
    clearMessage();
    stopResendTimer();
  }

  function showEmailStep(shouldFocus = true) {
    currentStep = 'email';
    selectedEmail = '';
    emailStep?.classList.add('active');
    otpStep?.classList.remove('active');
    backBtn?.classList.remove('visible');
    if (headingEl) headingEl.textContent = EMAIL_HEADING;
    if (subEl) subEl.textContent = EMAIL_SUB;
    if (submitBtn) {
      submitBtn.textContent = 'Enviar código por e-mail';
      submitBtn.disabled = false;
    }
    resetOtp();
    clearError();
    clearMessage();
    stopResendTimer();
    if (shouldFocus) setTimeout(() => emailInput?.focus(), 80);
  }

  function showOtpStep() {
    currentStep = 'otp';
    emailStep?.classList.remove('active');
    otpStep?.classList.add('active');
    backBtn?.classList.add('visible');
    if (headingEl) headingEl.textContent = 'Verifique seu e-mail';
    if (subEl) subEl.textContent = `O código de verificação foi enviado para o e-mail ${selectedEmail}`;
    if (submitBtn) {
      submitBtn.textContent = 'Continuar';
      submitBtn.disabled = false;
    }
    resetOtp();
    startResendTimer();
    setTimeout(() => otpInputs[0]?.focus(), 80);
  }

  function handleOtpInput(input, index) {
    const digit = input.value.replace(/\D/g, '').slice(-1);
    input.value = digit;

    if (digit && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  }

  function handleOtpKeydown(event, index) {
    if (event.key !== 'Backspace') return;
    if (otpInputs[index]?.value || index === 0) return;

    event.preventDefault();
    otpInputs[index - 1].focus();
    otpInputs[index - 1].value = '';
  }

  function handleOtpPaste(event) {
    const pasted = event.clipboardData?.getData('text') || '';
    const digits = pasted.replace(/\D/g, '').slice(0, otpInputs.length);

    if (!digits) return;

    event.preventDefault();
    otpInputs.forEach((input, index) => {
      input.value = digits[index] || '';
    });

    const nextIndex = Math.min(digits.length, otpInputs.length - 1);
    otpInputs[nextIndex]?.focus();
  }

  function getOtpCode() {
    return otpInputs.map(input => input.value).join('');
  }

  function resetOtp() {
    otpInputs.forEach(input => { input.value = ''; });
  }

  function resendCode() {
    if (!resendBtn || resendBtn.disabled) return;

    clearError();
    showMessage('Código reenviado para o e-mail informado.');
    resetOtp();
    startResendTimer();
    setTimeout(() => otpInputs[0]?.focus(), 80);
  }

  function startResendTimer() {
    stopResendTimer();
    remainingSeconds = RESEND_SECONDS;
    updateResendButton();

    resendTimer = setInterval(() => {
      remainingSeconds -= 1;
      updateResendButton();

      if (remainingSeconds <= 0) {
        stopResendTimer(false);
        enableResend();
      }
    }, 1000);
  }

  function stopResendTimer(resetButton = true) {
    if (resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }

    if (resetButton && resendBtn) {
      resendBtn.disabled = true;
      resendBtn.textContent = `Reenviar código em ${RESEND_SECONDS}s`;
    }
  }

  function updateResendButton() {
    if (!resendBtn) return;
    resendBtn.disabled = true;
    resendBtn.textContent = `Reenviar código em ${remainingSeconds}s`;
  }

  function enableResend() {
    if (!resendBtn) return;
    resendBtn.disabled = false;
    resendBtn.textContent = 'Não recebeu? Reenviar código';
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

  function showMessage(msg) {
    if (!messageEl) return;
    messageEl.textContent = msg;
    messageEl.classList.add('visible');
  }

  function clearMessage() {
    if (!messageEl) return;
    messageEl.textContent = '';
    messageEl.classList.remove('visible');
  }

  function shakeActiveFields() {
    const group = currentStep === 'otp'
      ? form?.querySelector('.login-modal__otp-group')
      : form?.querySelector('.login-modal__fields');

    group?.classList.add('shake');
    setTimeout(() => group?.classList.remove('shake'), 600);
  }

  function showSuccess() {
    stopResendTimer(false);
    if (submitBtn) {
      submitBtn.textContent = 'Redirecionando…';
      submitBtn.disabled = true;
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
