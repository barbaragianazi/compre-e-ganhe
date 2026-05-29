/* ============================================
   AUTH — Fake Authentication Engine
   ============================================ */

const Auth = (() => {

  const STORAGE_KEY_USER  = 'lp_user_email';
  const STORAGE_KEY_ROLE  = 'lp_user_role';
  const STORAGE_KEY_LOGIN = 'lp_is_logged_in';
  const STORAGE_KEY_ROLE_COMPAT = 'userRole';
  const STORAGE_KEY_RANKING_VIEW = 'lp_ranking_view';

  const RANKING_VIEWS = [
    { id: 'pontos-acumulados', label: 'Pontos acumulados', icon: 'fa-chart-line' },
    { id: 'meta-compras', label: 'Meta de compras', icon: 'fa-bullseye' },
    { id: 'quantidade-compras', label: 'Quantidade de compras', icon: 'fa-cart-shopping' },
  ];

  /* Accepted credentials — mocked OTP codes */
  const USERS = {
    'user@user.com': { role: 'user',  otp: '123456', name: 'Bárbara Gianazi',  initials: 'BG', avatar: 'assets/images/avatar-user.svg', redirectAfterLogout: 'area-logada.html' },
    'admin@admin.com':  { role: 'admin', otp: '654321', name: 'Beto Delazane',   initials: 'BD', avatar: 'assets/images/avatar-admin.svg', redirectAfterLogout: 'area-logada.html' },
  };

  const users = {
    admin: {
      name: 'Beto Delazane',
      avatar: 'assets/images/avatar-admin.svg',
      redirectAfterLogout: 'area-logada.html',
    },
    user: {
      name: 'Bárbara Gianazi',
      avatar: 'assets/images/avatar-user.svg',
      redirectAfterLogout: 'area-logada.html',
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

  function registerMockUser(code) {
    const record = USERS['user@user.com'];

    if (record.otp !== code) return { ok: false, message: 'Código incorreto. Tente novamente.' };

    localStorage.setItem(STORAGE_KEY_USER, 'user@user.com');
    localStorage.setItem(STORAGE_KEY_ROLE, record.role);
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

  function getRankingView() {
    const legacyViewMap = {
      points: 'pontos-acumulados',
      value: 'meta-compras',
      qty: 'quantidade-compras',
    };
    const savedView = localStorage.getItem(STORAGE_KEY_RANKING_VIEW);
    const normalisedView = legacyViewMap[savedView] || savedView;

    if (normalisedView !== savedView && normalisedView) {
      localStorage.setItem(STORAGE_KEY_RANKING_VIEW, normalisedView);
    }

    return RANKING_VIEWS.some(view => view.id === normalisedView) ? normalisedView : RANKING_VIEWS[0].id;
  }

  function setRankingView(viewId) {
    const nextView = RANKING_VIEWS.find(view => view.id === viewId) || RANKING_VIEWS[0];
    localStorage.setItem(STORAGE_KEY_RANKING_VIEW, nextView.id);
    updateRankingViewMenuState();
    window.dispatchEvent(new CustomEvent('ranking-view:changed', { detail: { view: nextView } }));
  }

  function updateRankingViewMenuState() {
    const activeView = getRankingView();

    document.querySelectorAll('[data-ranking-kpi]').forEach(btn => {
      const active = btn.dataset.rankingKpi === activeView;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-checked', String(active));
    });
  }

  function ensureRankingViewMenu(userDropdown, logoutButton) {
    if (!userDropdown || !logoutButton || userDropdown.querySelector('[data-ranking-view-menu]')) return;

    const section = document.createElement('div');
    section.className = 'user-menu__section';
    section.setAttribute('role', 'group');
    section.setAttribute('aria-label', 'Tipo do ranking');
    section.setAttribute('data-ranking-view-menu', '');

    const label = document.createElement('div');
    label.className = 'user-menu__section-label';
    label.textContent = 'Tipo do combo';
    section.appendChild(label);

    RANKING_VIEWS.forEach(view => {
      const button = document.createElement('button');
      button.className = 'user-menu__item user-menu__item--choice';
      button.type = 'button';
      button.setAttribute('role', 'menuitemradio');
      button.setAttribute('aria-checked', 'false');
      button.dataset.rankingKpi = view.id;
      button.innerHTML = '<i class="fa-solid ' + view.icon + '"></i>' + view.label;
      section.appendChild(button);
    });

    userDropdown.insertBefore(section, logoutButton);
    updateRankingViewMenuState();
  }

  function initUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userMenuTrigger = document.getElementById('userMenuTrigger');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const userDropdown = document.getElementById('userDropdown');
    const logoutButton = document.getElementById('logoutButton');

    initAdminNav();

    if (!userMenu || !userMenuTrigger || !userName || !userAvatar || !logoutButton) return;

    const currentUser = getMenuUser();
    userName.textContent = currentUser.name;
    userAvatar.src = currentUser.avatar;
    ensureRankingViewMenu(userDropdown, logoutButton);

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

    userDropdown.querySelectorAll('[data-ranking-kpi]').forEach(btn => {
      if (btn.dataset.rankingBound === 'true') return;
      btn.dataset.rankingBound = 'true';
      btn.addEventListener('click', () => {
        setRankingView(btn.dataset.rankingKpi);
        closeMenu();
      });
    });

    logoutButton.addEventListener('click', () => {
      logout();
      window.location.href = currentUser.redirectAfterLogout;
    });
  }

  function initAdminNav() {
    const isAdmin = getRole() === 'admin';

    document.querySelectorAll('[data-admin-nav]').forEach(link => {
      link.hidden = !isAdmin;
    });

    document.querySelectorAll('[data-admin-only]').forEach(el => {
      el.hidden = !isAdmin;
      el.style.display = isAdmin ? '' : 'none';
    });
  }

  return {
    login,
    hasUser,
    logout,
    isLoggedIn,
    getRole,
    getEmail,
    getName,
    getInitials,
    getMenuUser,
    getRankingView,
    setRankingView,
    initUserMenu,
    initAdminNav
  };
})();
