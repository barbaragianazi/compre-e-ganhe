/* ============================================
   AUTH — Fake Authentication Engine
   ============================================ */

const Auth = (() => {

  const STORAGE_KEY_USER  = 'lp_user_email';
  const STORAGE_KEY_ROLE  = 'lp_user_role';
  const STORAGE_KEY_LOGIN = 'lp_is_logged_in';
  const STORAGE_KEY_ROLE_COMPAT = 'userRole';

  /* Accepted credentials — mocked OTP codes */
  const USERS = {
    'user@user.com': { role: 'user',  otp: '123456', name: 'Bárbara Gianazi',  initials: 'BG', avatar: 'assets/images/avatar-user.svg', redirectAfterLogout: 'index.html' },
    'admin@admin.com':  { role: 'admin', otp: '654321', name: 'Beto Delazane',   initials: 'BD', avatar: 'assets/images/avatar-admin.svg', redirectAfterLogout: 'index.html' },
  };

  const users = {
    admin: {
      name: 'Beto Delazane',
      avatar: 'assets/images/avatar-admin.svg',
      redirectAfterLogout: 'index.html',
    },
    user: {
      name: 'Bárbara Gianazi',
      avatar: 'assets/images/avatar-user.svg',
      redirectAfterLogout: 'index.html',
    },
  };

  function normaliseEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function hasUser(email) {
    return Boolean(USERS[normaliseEmail(email)]);
  }

  function login(email, code) {
    const normalised = normaliseEmail(email);
    const record = USERS[normalised];

    if (!record) return { ok: false, message: 'E-mail não encontrado.' };
    if (record.otp !== code) return { ok: false, message: 'Código incorreto. Tente novamente.' };

    localStorage.setItem(STORAGE_KEY_USER,  normalised);
    localStorage.setItem(STORAGE_KEY_ROLE,  record.role);
    localStorage.setItem(STORAGE_KEY_ROLE_COMPAT, record.role);
    localStorage.setItem(STORAGE_KEY_LOGIN, 'true');

    return { ok: true, role: record.role };
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_ROLE);
    localStorage.removeItem(STORAGE_KEY_ROLE_COMPAT);
    localStorage.removeItem(STORAGE_KEY_LOGIN);
  }

  function isLoggedIn() {
    return localStorage.getItem(STORAGE_KEY_LOGIN) === 'true';
  }

  function getRole() {
    return localStorage.getItem(STORAGE_KEY_ROLE) || localStorage.getItem(STORAGE_KEY_ROLE_COMPAT) || null;
  }

  function getEmail() {
    return localStorage.getItem(STORAGE_KEY_USER) || null;
  }

  /* Returns friendly display name for the logged-in user */
  function getName() {
    const email = getEmail();
    return USERS[email]?.name || email || 'Usuário';
  }

  /* Returns 2-letter initials for avatar */
  function getInitials() {
    const email = getEmail();
    return USERS[email]?.initials || '??';
  }

  function getMenuUser() {
    const savedRole = getRole();
    if (!localStorage.getItem("userRole") && users[savedRole]) {
      localStorage.setItem("userRole", savedRole);
    }

    const currentRole = localStorage.getItem("userRole") || "user";
    return users[currentRole] || users.user;
  }

  function initUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userMenuTrigger = document.getElementById('userMenuTrigger');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const logoutButton = document.getElementById('logoutButton');

    if (!userMenu || !userMenuTrigger || !userName || !userAvatar || !logoutButton) return;

    const currentUser = getMenuUser();
    userName.textContent = currentUser.name;
    userAvatar.src = currentUser.avatar;

    function closeMenu() {
      userMenu.classList.remove('is-open');
      document.body.classList.remove('user-menu-open');
      userMenuTrigger.setAttribute('aria-expanded', 'false');
    }

    userMenuTrigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = userMenu.classList.toggle('is-open');
      document.body.classList.toggle('user-menu-open', isOpen);
      userMenuTrigger.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      if (!userMenu.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    logoutButton.addEventListener('click', () => {
      logout();
      window.location.href = currentUser.redirectAfterLogout;
    });
  }

  return { login, hasUser, logout, isLoggedIn, getRole, getEmail, getName, getInitials, getMenuUser, initUserMenu };
})();
