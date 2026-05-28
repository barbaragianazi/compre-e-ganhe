/* ============================================
   LOGIN MODAL — Shared Authentication Flow
   ============================================ */

const LoginModal = (() => {
  let api = { open: () => {} };

  function getPostLoginRedirect(role = Auth.getRole()) {
    return role === 'admin' ? 'admin.html' : 'area-logada.html#promocao';
  }

  function init() {
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
    const emailAuthBtn = modal?.querySelector('[data-auth-email]');
    const whatsAppBtn  = modal?.querySelector('[data-auth-whatsapp]');
    const registerBtn  = modal?.querySelector('[data-auth-register]');
    const accessStep   = modal?.querySelector('[data-login-step="access"]');
    const emailStep    = modal?.querySelector('[data-login-step="email"]');
    const registerStep = modal?.querySelector('[data-login-step="register"]');
    const otpStep      = modal?.querySelector('[data-login-step="otp"]');
    const emailInput   = document.getElementById('login-email');
    const registerNameInput = document.getElementById('register-name');
    const registerEmailInput = document.getElementById('register-email');
    const registerPhoneInput = document.getElementById('register-phone');
    const registerCpfInput = document.getElementById('register-cpf');
    const otpInputs    = Array.from(modal?.querySelectorAll('[data-otp-input]') || []);
    const submitBtn    = form?.querySelector('.login-modal__submit');

    const RESEND_SECONDS = 60;
    const ACCESS_HEADING = 'Acesse sua conta';
    const ACCESS_SUB = 'Escolha como deseja fazer o login na plataforma';
    const EMAIL_HEADING = 'Entrar com e-mail';
    const EMAIL_SUB = 'Informe seu e-mail para receber o código de acesso';
    const REGISTER_HEADING = 'Criar conta';
    const REGISTER_SUB = 'Preencha seus dados para participar';
    const OTP_HEADING = 'Verifique seu e-mail';
    let currentStep = 'access';
    let previousStep = 'access';
    let authMode = 'login';
    let selectedEmail = '';
    let registerData = null;
    let resendTimer = null;
    let remainingSeconds = RESEND_SECONDS;

    if (!modal) return api;

    document.querySelectorAll('[data-open-login]').forEach(trigger => {
      trigger.addEventListener('click', event => {
        event.preventDefault();
        openModal();
      });
    });

    [overlay, closeBtn].forEach(el => el?.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    emailAuthBtn?.addEventListener('click', () => showEmailStep());
    whatsAppBtn?.addEventListener('click', () => {
      clearError();
      showMessage('Login por WhatsApp ainda não disponível.');
    });
    registerBtn?.addEventListener('click', () => showRegisterStep());
    backBtn?.addEventListener('click', handleBack);
    resendBtn?.addEventListener('click', resendCode);
    registerPhoneInput?.addEventListener('input', () => {
      registerPhoneInput.value = maskPhone(registerPhoneInput.value);
    });
    registerCpfInput?.addEventListener('input', () => {
      registerCpfInput.value = maskCpf(registerCpfInput.value);
    });
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', () => handleOtpInput(input, index));
      input.addEventListener('keydown', event => handleOtpKeydown(event, index));
      input.addEventListener('paste', handleOtpPaste);
    });

    form?.addEventListener('submit', e => {
      e.preventDefault();
      clearError();
      clearMessage();

      if (currentStep === 'access') return;
      if (currentStep === 'email') return requestCode();
      if (currentStep === 'register') return continueRegister();

      verifyCode();
    });

    function requestCode() {
      const email = emailInput?.value.trim().toLowerCase() || '';

      if (!email) {
        showError('Informe seu e-mail para continuar.');
        shakeActiveFields();
        return;
      }

      if (!isValidEmail(email)) {
        showError('Informe um e-mail válido.');
        shakeActiveFields();
        return;
      }

      if (!Auth.hasUser(email)) {
        showError('E-mail não encontrado.');
        shakeActiveFields();
        return;
      }

      selectedEmail = email;
      authMode = 'login';
      showOtpStep();
    }

    function continueRegister() {
      const name = registerNameInput?.value.trim() || '';
      const email = registerEmailInput?.value.trim().toLowerCase() || '';
      const phoneDigits = onlyDigits(registerPhoneInput?.value || '');
      const cpfDigits = onlyDigits(registerCpfInput?.value || '');

      if (!name) {
        showError('Informe seu nome completo.');
        shakeActiveFields();
        return;
      }

      if (!email || !isValidEmail(email)) {
        showError('Informe um e-mail válido.');
        shakeActiveFields();
        return;
      }

      if (phoneDigits.length !== 11) {
        showError('Informe um telefone com DDD válido.');
        shakeActiveFields();
        return;
      }

      if (cpfDigits.length !== 11) {
        showError('Informe um CPF válido.');
        shakeActiveFields();
        return;
      }

      registerData = { name, email, phone: registerPhoneInput.value, cpf: registerCpfInput.value };
      selectedEmail = email;
      authMode = 'register';
      showOtpStep();
    }

    function verifyCode() {
      const code = getOtpCode();

      if (code.length !== 6) {
        showError('Informe o código de 6 dígitos.');
        shakeActiveFields();
        return;
      }

      const result = authMode === 'register'
        ? Auth.registerMockUser(code)
        : Auth.login(selectedEmail, code);

      if (result.ok) {
        showSuccess();
        setTimeout(() => {
          if (result.role === 'admin') {
            window.location.href = getPostLoginRedirect(result.role);
            return;
          }

          closeModal();
          if (typeof window.refreshAreaAccessState === 'function') {
            window.refreshAreaAccessState();
          }
        }, 800);
      } else {
        showError(result.message);
        shakeActiveFields();
      }
    }

    function openModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      showAccessStep();
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      form?.reset();
      showAccessStep();
      resetOtp();
      clearError();
      clearMessage();
      stopResendTimer();
    }

    function showAccessStep() {
      currentStep = 'access';
      selectedEmail = '';
      registerData = null;
      authMode = 'login';
      setActiveStep(accessStep);
      backBtn?.classList.remove('visible');
      setHeading(ACCESS_HEADING, ACCESS_SUB);
      setSubmit('', true);
      clearError();
      clearMessage();
      resetOtp();
      stopResendTimer();
    }

    function showEmailStep(shouldFocus = true) {
      currentStep = 'email';
      previousStep = 'access';
      selectedEmail = '';
      authMode = 'login';
      setActiveStep(emailStep);
      backBtn?.classList.add('visible');
      setHeading(EMAIL_HEADING, EMAIL_SUB);
      setSubmit('Enviar código por e-mail');
      resetOtp();
      clearError();
      clearMessage();
      stopResendTimer();
      if (shouldFocus) setTimeout(() => emailInput?.focus(), 80);
    }

    function showRegisterStep(shouldFocus = true) {
      currentStep = 'register';
      previousStep = 'access';
      selectedEmail = '';
      authMode = 'register';
      setActiveStep(registerStep);
      backBtn?.classList.add('visible');
      setHeading(REGISTER_HEADING, REGISTER_SUB);
      setSubmit('Continuar o registro');
      resetOtp();
      clearError();
      clearMessage();
      stopResendTimer();
      if (shouldFocus) setTimeout(() => registerNameInput?.focus(), 80);
    }

    function showOtpStep() {
      previousStep = currentStep;
      currentStep = 'otp';
      setActiveStep(otpStep);
      backBtn?.classList.add('visible');
      setHeading(OTP_HEADING, `O código de verificação foi enviado para o e-mail ${selectedEmail}`);
      setSubmit('Continuar');
      resetOtp();
      clearError();
      clearMessage();
      startResendTimer();
      setTimeout(() => otpInputs[0]?.focus(), 80);
    }

    function handleBack() {
      if (currentStep === 'otp') {
        if (previousStep === 'register') showRegisterStep();
        else showEmailStep();
        return;
      }

      showAccessStep();
    }

    function setActiveStep(activeStep) {
      [accessStep, emailStep, registerStep, otpStep].forEach(step => {
        step?.classList.toggle('active', step === activeStep);
      });
    }

    function setHeading(title, subtitle) {
      if (headingEl) headingEl.textContent = title;
      if (subEl) subEl.textContent = subtitle;
    }

    function setSubmit(text, hidden = false) {
      if (!submitBtn) return;
      submitBtn.hidden = hidden;
      submitBtn.textContent = text;
      submitBtn.disabled = false;
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
        resendBtn.textContent = `Reenviar o código em ${RESEND_SECONDS}s`;
      }
    }

    function updateResendButton() {
      if (!resendBtn) return;
      resendBtn.disabled = true;
      resendBtn.textContent = `Reenviar o código em ${remainingSeconds}s`;
    }

    function enableResend() {
      if (!resendBtn) return;
      resendBtn.disabled = false;
      resendBtn.textContent = 'Reenviar o código';
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
        : form?.querySelector(`[data-login-step="${currentStep}"] .login-modal__fields`);

      group?.classList.add('shake');
      setTimeout(() => group?.classList.remove('shake'), 600);
    }

    function showSuccess() {
      stopResendTimer(false);
      if (submitBtn) {
        submitBtn.textContent = 'Redirecionando...';
        submitBtn.disabled = true;
      }
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function onlyDigits(value) {
      return String(value || '').replace(/\D/g, '');
    }

    function maskPhone(value) {
      const digits = onlyDigits(value).slice(0, 11);
      if (digits.length <= 2) return digits;
      if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    function maskCpf(value) {
      const digits = onlyDigits(value).slice(0, 11);
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
      if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    }

    api = { open: openModal };
    return api;
  }

  return { init, open: () => api.open() };
})();
