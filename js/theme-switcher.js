/* ============================================
   THEME SWITCHER — White Label Engine
   ============================================ */

const ThemeSwitcher = (() => {
  const STORAGE_KEY = 'lp_active_brand';
  let brandsData = null;
  let currentBrand = null;

  async function loadBrands() {
    const res = await fetch('data/brands.json');
    brandsData = await res.json();
    return brandsData;
  }

  function applyCSSVars(brand) {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', brand.primary);
    root.style.setProperty('--color-primary-dark', brand.secondary);

    root.style.setProperty("--gradient-soft-1", brand["gradient-soft-1"]);
    root.style.setProperty("--gradient-soft-2", brand["gradient-soft-2"]);
    root.style.setProperty("--gradient-soft-3", brand["gradient-soft-3"]);

    const rgb = hexToRgb(brand.primary);
    if (rgb) root.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);

    root.style.setProperty('--color-surface', brand.surface);
    root.style.setProperty('--color-surface-alt', brand.surfaceAlt);
    root.style.setProperty('--color-text', brand.text);
    root.style.setProperty('--color-text-light', brand.textLight);
    root.style.setProperty('--color-border', brand.border);
    root.style.setProperty('--logo-light', `url('${brand.logoLight}')`);
    root.style.setProperty('--logo-dark', `url('${brand.logoDark || brand.logoLight}')`);
    root.style.setProperty('--footer-logo-light', `url('${brand.footerLogoLight || brand.logoLight}')`);
    root.style.setProperty('--footer-logo-dark', `url('${brand.footerLogoDark || brand.logoDark || brand.logoLight}')`);
  }


  function applyThemeAttr(key) {
    document.documentElement.setAttribute('data-theme', key);
  }

  function updateLogoAlt(brand) {
    document.querySelectorAll('[data-logo]').forEach(el => {
      const variant = el.dataset.logo === 'dark' ? 'logoDark' : 'logoLight';
      el.src = brand[variant] || brand.logoLight;
      el.alt = brand.name;
    });
    document.querySelectorAll('[data-footer-logo]').forEach(el => {
      const variant = el.dataset.footerLogo === 'dark' ? 'footerLogoDark' : 'footerLogoLight';
      const fallback = el.dataset.footerLogo === 'dark' ? brand.logoDark : brand.logoLight;
      el.src = brand[variant] || fallback || brand.logoLight;
      el.alt = brand.footerLogoName || brand.name;
    });
  }

  function createGroupLabel(label) {
    const group = document.createElement('div');
    group.className = 'brand-dropdown__group';
    group.textContent = label;
    return group;
  }

  function createDivider() {
    const divider = document.createElement('div');
    divider.className = 'brand-dropdown__divider';
    divider.setAttribute('aria-hidden', 'true');
    return divider;
  }

  function updateDropdownState(activeKey) {
    document.querySelectorAll('.brand-dropdown__item').forEach(item => {
      item.classList.toggle('active', item.dataset.brand === activeKey);
    });
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : null;
  }

  function switchTo(key) {
    if (!brandsData || !brandsData[key]) {
      showComingSoon(key);
      return;
    }
    currentBrand = key;
    const brand = brandsData[key];
    applyThemeAttr(key);
    applyCSSVars(brand);
    updateLogoAlt(brand);
    updateDropdownState(key);
    localStorage.setItem(STORAGE_KEY, key);
  }

  function showComingSoon(key) {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: #1F1F1F; color: #fff; padding: 12px 20px;
      border-radius: 999px; font-size: 13px; font-weight: 600;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 9999;
      transition: opacity 0.3s; white-space: nowrap;
    `;
    toast.textContent = `${label} — em breve`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2200);
  }

  function buildDropdown(container, brands) {
    const dropdown = container.querySelector('.brand-dropdown');
    if (!dropdown) return;

    const savedKey = localStorage.getItem(STORAGE_KEY) || 'zoetis';

    const entries = Object.entries(brands);
    const primaryEntry = entries.find(([key]) => key === 'zoetis');
    const resellerEntries = entries.filter(([, brand]) => brand.group === 'Revendas');
    const remainingBrandEntries = entries.filter(([key, brand]) => (
      key !== 'zoetis' && (brand.group || 'Marcas') === 'Marcas'
    ));
    const sections = [
      primaryEntry ? { label: null, entries: [primaryEntry] } : null,
      resellerEntries.length ? { label: 'Revendas', entries: resellerEntries } : null,
      remainingBrandEntries.length ? { label: 'Marcas', entries: remainingBrandEntries, dividerBefore: true } : null,
    ].filter(Boolean);

    sections.forEach((section) => {
      if (section.dividerBefore) dropdown.appendChild(createDivider());
      if (section.label) dropdown.appendChild(createGroupLabel(section.label));

      section.entries.forEach(([key, brand]) => {
        const group = brand.group || 'Marcas';

        const btn = document.createElement('button');
        btn.className = 'brand-dropdown__item';
        btn.dataset.brand = key;
        btn.dataset.group = group;
        if (group !== 'Marcas') btn.classList.add('brand-dropdown__item--reseller');
        if (key === savedKey) btn.classList.add('active');

        const name = document.createElement('span');
        name.textContent = brand.name;

        if (group === 'Marcas') {
          const dot = document.createElement('span');
          dot.className = 'brand-dropdown__dot';
          dot.style.background = brand.primary;
          btn.appendChild(dot);
        }
        btn.appendChild(name);

        btn.addEventListener('click', () => {
          switchTo(key);
          closeDropdown(container);
        });

        dropdown.appendChild(btn);
      });
    });
  }

  function openDropdown(container) {
    container.classList.add('open');
    container.querySelector('.brand-dropdown').classList.add('visible');
  }

  function closeDropdown(container) {
    container.classList.remove('open');
    container.querySelector('.brand-dropdown').classList.remove('visible');
  }

  function toggleDropdown(container) {
    container.classList.contains('open') ? closeDropdown(container) : openDropdown(container);
  }

  async function init() {
    const brands = await loadBrands();
    const savedKey = localStorage.getItem(STORAGE_KEY) || 'zoetis';

    const brandContainer = document.querySelector('.header__brand');
    if (brandContainer) {
      buildDropdown(brandContainer, brands);

      const logoBtn = brandContainer.querySelector('.header__logo-btn');
      if (logoBtn) {
        logoBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleDropdown(brandContainer);
        });
      }

      document.addEventListener('click', (e) => {
        if (!brandContainer.contains(e.target)) {
          closeDropdown(brandContainer);
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDropdown(brandContainer);
      });
    }

    switchTo(savedKey);
  }

  return { init, switchTo };
})();
