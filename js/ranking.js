/* ============================================
   RANKING PAGE — Interactions
   ============================================ */

/* ——— Dados de ranking estático ——— */

const RANKING_DATA = [
  { position: 1, name: 'Carlos Eduardo', location: 'São Paulo, SP', points: 15850 },
  { position: 2, name: 'Marina Silva', location: 'Rio de Janeiro, RJ', points: 14320 },
  { position: 3, name: 'Roberto Santos', location: 'Belo Horizonte, MG', points: 13190 },
  { position: 4, name: 'Juliana Costa', location: 'Brasília, DF', points: 12750 },
  { position: 5, name: 'Fernando Oliveira', location: 'Curitiba, PR', points: 12100 },
  { position: 6, name: 'Amanda Pereira', location: 'Porto Alegre, RS', points: 11450 },
  { position: 7, name: 'Paulo Mendes', location: 'Fortaleza, CE', points: 10880 },
  { position: 8, name: 'Beatriz Gomes', location: 'Salvador, BA', points: 10320 },
  { position: 9, name: 'Lucas Ferreira', location: 'Manaus, AM', points: 9750 },
  { position: 10, name: 'Sophia Martins', location: 'Recife, PE', points: 9200 },
];

/* ——— KPIs de desempenho (por tipo de combo) ——— */

const KPIS = [
  {
    id: 'pontos-acumulados',
    label: 'Pontos acumulados',
    scoreLabel: 'pontos',
    goal: 62594,
    showRank: true,
    formatText: c => `<span class="performance-card__rank-label">Minha classificação #${USER_RANK_POSITION}</span><b>${c.toLocaleString('pt-BR')} pontos</b>`,
  },
  {
    id: 'meta-compras',
    label: 'Meta de compras',
    scoreLabel: 'meta de compras',
    goal: 15000,
    showRank: false,
    formatText: () => 'Atingimento médio das metas por produto',
  },
  {
    id: 'quantidade-compras',
    label: 'Quantidade de compras',
    scoreLabel: 'compras',
    goal: 200,
    showRank: false,
    formatText: () => 'Atingimento médio das metas por produto',
  },
];

/* ——— Histórico mockado do usuário logado (Bárbara Gianazi) ——— */
/* Preços unitários: Simparic R$185, Apoquel R$195, Vanguard Plus R$180 */

const USER_HISTORY_NOTES = [
  { id: 'uh_001', numeroNota: 'NF-BG-001', data: '2026-01-10', valor: 565.00, status: 'aprovada', estabelecimento: 'PetShop Central', produtos: [{ nome: 'Simparic', qtd: 2, valorUnit: 185.00 }, { nome: 'Apoquel', qtd: 1, valorUnit: 195.00 }] },
  { id: 'uh_002', numeroNota: 'NF-BG-002', data: '2026-01-18', valor: 540.00, status: 'aprovada', estabelecimento: 'Clínica Vet Fiel', produtos: [{ nome: 'Vanguard Plus', qtd: 3, valorUnit: 180.00 }] },
  { id: 'uh_003', numeroNota: 'NF-BG-003', data: '2026-01-25', valor: 390.00, status: 'aguardando', estabelecimento: 'Pet Life Store', produtos: [{ nome: 'Apoquel', qtd: 2, valorUnit: 195.00 }] },
  { id: 'uh_004', numeroNota: 'NF-BG-004', data: '2026-02-05', valor: 730.00, status: 'aprovada', estabelecimento: 'VetMed Distribuidora', produtos: [{ nome: 'Simparic', qtd: 2, valorUnit: 185.00 }, { nome: 'Vanguard Plus', qtd: 2, valorUnit: 180.00 }] },
  { id: 'uh_005', numeroNota: 'NF-BG-005', data: '2026-02-12', valor: 195.00, status: 'reprovada', estabelecimento: 'AnimalCare', produtos: [{ nome: 'Apoquel', qtd: 1, valorUnit: 195.00 }] },
  { id: 'uh_006', numeroNota: 'NF-BG-006', data: '2026-02-20', valor: 740.00, status: 'aprovada', estabelecimento: 'PetShop Central', produtos: [{ nome: 'Simparic', qtd: 4, valorUnit: 185.00 }] },
  { id: 'uh_007', numeroNota: 'NF-BG-007', data: '2026-02-27', valor: 540.00, status: 'aprovada', estabelecimento: 'Clínica Vet Fiel', produtos: [{ nome: 'Vanguard Plus', qtd: 3, valorUnit: 180.00 }] },
  { id: 'uh_008', numeroNota: 'NF-BG-008', data: '2026-03-07', valor: 565.00, status: 'excluida', estabelecimento: 'Pet Life Store', produtos: [{ nome: 'Apoquel', qtd: 1, valorUnit: 195.00 }, { nome: 'Simparic', qtd: 2, valorUnit: 185.00 }] },
  { id: 'uh_009', numeroNota: 'NF-BG-009', data: '2026-03-14', valor: 1125.00, status: 'aprovada', estabelecimento: 'VetMed Distribuidora', produtos: [{ nome: 'Simparic', qtd: 3, valorUnit: 185.00 }, { nome: 'Apoquel', qtd: 2, valorUnit: 195.00 }, { nome: 'Vanguard Plus', qtd: 1, valorUnit: 180.00 }] },
  { id: 'uh_010', numeroNota: 'NF-BG-010', data: '2026-03-21', valor: 360.00, status: 'aguardando', estabelecimento: 'AnimalCare', produtos: [{ nome: 'Vanguard Plus', qtd: 2, valorUnit: 180.00 }] },
  { id: 'uh_011', numeroNota: 'NF-BG-011', data: '2026-03-28', valor: 740.00, status: 'aprovada', estabelecimento: 'PetShop Central', produtos: [{ nome: 'Simparic', qtd: 4, valorUnit: 185.00 }] },
  { id: 'uh_012', numeroNota: 'NF-BG-012', data: '2026-04-04', valor: 585.00, status: 'aprovada', estabelecimento: 'Clínica Vet Fiel', produtos: [{ nome: 'Apoquel', qtd: 3, valorUnit: 195.00 }] },
  { id: 'uh_013', numeroNota: 'NF-BG-013', data: '2026-04-10', valor: 360.00, status: 'reprovada', estabelecimento: 'Pet Life Store', produtos: [{ nome: 'Vanguard Plus', qtd: 2, valorUnit: 180.00 }] },
  { id: 'uh_014', numeroNota: 'NF-BG-014', data: '2026-04-17', valor: 925.00, status: 'aprovada', estabelecimento: 'VetMed Distribuidora', produtos: [{ nome: 'Simparic', qtd: 2, valorUnit: 185.00 }, { nome: 'Apoquel', qtd: 1, valorUnit: 195.00 }, { nome: 'Vanguard Plus', qtd: 2, valorUnit: 180.00 }] },
  { id: 'uh_015', numeroNota: 'NF-BG-015', data: '2026-04-23', valor: 555.00, status: 'aguardando', estabelecimento: 'AnimalCare', produtos: [{ nome: 'Simparic', qtd: 3, valorUnit: 185.00 }] },
  { id: 'uh_016', numeroNota: 'NF-BG-016', data: '2026-04-30', valor: 780.00, status: 'aprovada', estabelecimento: 'PetShop Central', produtos: [{ nome: 'Apoquel', qtd: 4, valorUnit: 195.00 }] },
  { id: 'uh_017', numeroNota: 'NF-BG-017', data: '2026-05-06', valor: 360.00, status: 'excluida', estabelecimento: 'Clínica Vet Fiel', produtos: [{ nome: 'Vanguard Plus', qtd: 2, valorUnit: 180.00 }] },
  { id: 'uh_018', numeroNota: 'NF-BG-018', data: '2026-05-10', valor: 915.00, status: 'aprovada', estabelecimento: 'Pet Life Store', produtos: [{ nome: 'Simparic', qtd: 3, valorUnit: 185.00 }, { nome: 'Vanguard Plus', qtd: 2, valorUnit: 180.00 }] },
  { id: 'uh_019', numeroNota: 'NF-BG-019', data: '2026-05-14', valor: 390.00, status: 'aguardando', estabelecimento: 'VetMed Distribuidora', produtos: [{ nome: 'Apoquel', qtd: 2, valorUnit: 195.00 }] },
  { id: 'uh_020', numeroNota: 'NF-BG-020', data: '2026-05-18', valor: 1310.00, status: 'aprovada', estabelecimento: 'AnimalCare', produtos: [{ nome: 'Simparic', qtd: 4, valorUnit: 185.00 }, { nome: 'Apoquel', qtd: 2, valorUnit: 195.00 }, { nome: 'Vanguard Plus', qtd: 1, valorUnit: 180.00 }] },
  { id: 'uh_021', numeroNota: 'NF-BG-021', data: '2026-05-20', valor: 540.00, status: 'reprovada', estabelecimento: 'PetShop Central', produtos: [{ nome: 'Vanguard Plus', qtd: 3, valorUnit: 180.00 }] },
  { id: 'uh_022', numeroNota: 'NF-BG-022', data: '2026-05-22', valor: 380.00, status: 'aguardando', estabelecimento: 'Clínica Vet Fiel', produtos: [{ nome: 'Simparic', qtd: 1, valorUnit: 185.00 }, { nome: 'Apoquel', qtd: 1, valorUnit: 195.00 }] },
  { id: 'uh_023', numeroNota: 'NF-BG-023', data: '2026-05-24', valor: 730.00, status: 'aprovada', estabelecimento: 'Pet Life Store', produtos: [{ nome: 'Simparic', qtd: 2, valorUnit: 185.00 }, { nome: 'Vanguard Plus', qtd: 2, valorUnit: 180.00 }] },
  { id: 'uh_024', numeroNota: 'NF-BG-024', data: '2026-05-26', valor: 195.00, status: 'reprovada', estabelecimento: 'VetMed Distribuidora', produtos: [{ nome: 'Apoquel', qtd: 1, valorUnit: 195.00 }] },
  { id: 'uh_025', numeroNota: 'NF-BG-025', data: '2026-05-28', valor: 745.00, status: 'aprovada', estabelecimento: 'AnimalCare', produtos: [{ nome: 'Simparic', qtd: 2, valorUnit: 185.00 }, { nome: 'Apoquel', qtd: 1, valorUnit: 195.00 }, { nome: 'Vanguard Plus', qtd: 1, valorUnit: 180.00 }] },
];

const HISTORY_PAGE_SIZE = 6;
let historyCurrentPage = 1;
const historyFilters = {
  status: 'all',
  period: 'all',
  establishment: 'all',
};

/* ——— Constantes ——— */

const INVOICE_KEY = 'lp_invoices';
const ADMIN_NOTES_KEY = 'lp_admin_notes';
const ADMIN_IMPORTED_USERS_KEY = 'lp_admin_imported_users';
const DEFAULT_CAMPAIGN_ID = 'simparic-trio';
const BARBARA_USER = {
  id: 170,
  nome: 'Bárbara Gianazi',
  email: 'barbara.gianazi@email.com',
  documento: '123.456.789-09',
  telefone: '(14) 99999-0000',
  cidade: 'Bauru',
  estado: 'SP',
};
const USER_RANK_POSITION = 17;
const PRODUCT_NAMES = ['Simparic', 'Apoquel', 'Vanguard Plus'];
const PRODUCT_UNIT_PRICES = { Simparic: 185, Apoquel: 195, 'Vanguard Plus': 180 };
const COMBO_TARGETS = {
  'meta-compras': {
    total: 15000,
    products: { Simparic: 10000, Apoquel: 3000, 'Vanguard Plus': 2000 },
  },
  'quantidade-compras': {
    total: 200,
    products: { Simparic: 130, Apoquel: 40, 'Vanguard Plus': 30 },
  },
};
const RANKING_BASE_ADMIN_MOCK = typeof ADMIN_MOCK !== 'undefined'
  ? JSON.parse(JSON.stringify(ADMIN_MOCK))
  : [];

let editingId = null;
let isAdminMode = false;
let activeRankingKPI = Auth.getRankingView ? Auth.getRankingView() : KPIS[0].id;
let selectedInvoiceUserId = null;
const invoiceUserSearchState = {
  search: '',
  sort: 'name-asc',
  originFilter: 'all',
  page: 1,
  perPage: 10,
};

/* ============================================
   INIT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  guardRoute();
  isAdminMode = Auth.getRole() === 'admin';
  applySelectedCampaignData();
  syncAllBarbaraLocalInvoicesToAdmin();
  updateInvoiceUserFieldVisibility();

  ThemeSwitcher.init();
  initHeader();
  Auth.initUserMenu();
  populateUserInfo();
  initCampaignSelectorAccess();

  if (isAdminMode) applyAdminRankingMode();

  initRankingViewSelector();
  initHistoryCard();
  initInvoices();
  syncInvoiceCardHeight();
  initScrollReveal();
});

/* ============================================
   ROUTE GUARD
   ============================================ */

function guardRoute() {
  if (!Auth.isLoggedIn()) {
    window.location.href = 'area-logada.html';
  }
}

/* ============================================
   HEADER
   ============================================ */

function initHeader() {
  const header = document.querySelector('.header') || document.querySelector('.ranking-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const toggle = document.querySelector('.header__menu-toggle') || document.querySelector('.ranking-header__toggle');
  const mobileNav = document.querySelector('.mobile-nav') || document.querySelector('.ranking-mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', () => {
      Auth.logout();
      window.location.href = 'area-logada.html';
    });
  });
}

/* ============================================
   USER INFO
   ============================================ */

function populateUserInfo() {
  const name = Auth.getName();
  const initials = Auth.getInitials();
  const email = Auth.getEmail() || '';
  const firstName = name.split(' ')[0];
  const menuUser = Auth.getMenuUser();

  document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = name; });
  document.querySelectorAll('[data-user-first]').forEach(el => { el.textContent = firstName; });
  document.querySelectorAll('[data-user-email]').forEach(el => { el.textContent = email; });
  document.querySelectorAll('[data-user-initials]').forEach(el => { el.textContent = initials; });

  const avatarImg = document.getElementById('performanceAvatarImg');
  if (avatarImg && menuUser?.avatar) {
    avatarImg.src = menuUser.avatar;
    avatarImg.alt = name;
    avatarImg.onerror = () => { avatarImg.hidden = true; };
  }
}

function initCampaignSelectorAccess() {
  if (window.CampaignSelector) {
    CampaignSelector.init();
    CampaignSelector.updateLabels();
  }

  window.addEventListener('campaign:changed', () => { refreshCampaignRanking(); });

  window.addEventListener('storage', event => {
    if (!window.CampaignSelector || event.key !== CampaignSelector.key) return;
    CampaignSelector.updateLabels();
    refreshCampaignRanking();
  });

  window.addEventListener('focus', () => {
    if (window.CampaignSelector) CampaignSelector.updateLabels();
    refreshCampaignRanking();
  });
}

function applySelectedCampaignData() {
  if (!window.CampaignSelector || typeof ADMIN_MOCK === 'undefined') return;
  ADMIN_MOCK = CampaignSelector.buildCampaignMock(RANKING_BASE_ADMIN_MOCK, CampaignSelector.getActiveCampaign());
  mergeImportedUsersIntoAdminMock();
  ensureBarbaraAdminUser();
  mergeAdminStorageNotes();
}

function refreshCampaignRanking() {
  applySelectedCampaignData();
  syncAdminInvoiceUserSelect();
  renderRankingList();
  if (isAdminMode) renderAdminInvoiceList();
}

window.refreshCampaignRanking = refreshCampaignRanking;

function getEligibleNotes(user) {
  return (user.notas || []).filter(nota => nota.status === 'validada' || nota.status === 'aguardando');
}

function getMetricValueFromNotes(notes, kpiId) {
  if (kpiId === 'quantidade-compras') return notes.length;

  const total = notes.reduce((sum, nota) => sum + Number(nota.valor || 0), 0);
  return Math.round(total);
}

function getStaticRankingMetric(item, kpiId) {
  if (kpiId === 'meta-compras') return Math.round(item.points * 1.18);
  if (kpiId === 'quantidade-compras') return Math.max(1, Math.round(item.points / 520));
  return item.points;
}

function getActiveKPI() {
  return KPIS.find(kpi => kpi.id === activeRankingKPI) || KPIS[0];
}

function formatRankingMetric(value, kpiId) {
  if (kpiId === 'meta-compras') {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  }
  return Number(value).toLocaleString('pt-BR');
}

function getRankingDataByKPI(kpiId = activeRankingKPI) {
  if (typeof ADMIN_MOCK === 'undefined' || !ADMIN_MOCK.length) {
    return RANKING_DATA.map(item => ({
      ...item,
      metricValue: getStaticRankingMetric(item, kpiId),
    }))
      .sort((a, b) => b.metricValue - a.metricValue)
      .slice(0, 10)
      .map((item, index) => ({ ...item, position: index + 1 }));
  }

  return ADMIN_MOCK.map(user => {
    const notes = getEligibleNotes(user);
    return {
      name: user.nome,
      location: `${user.cidade}, ${user.estado}`,
      metricValue: getMetricValueFromNotes(notes, kpiId),
    };
  })
    .sort((a, b) => b.metricValue - a.metricValue)
    .slice(0, 10)
    .map((item, index) => ({ ...item, position: index + 1 }));
}

function getActiveCampaignId() {
  if (!window.CampaignSelector) return DEFAULT_CAMPAIGN_ID;
  const campaign = CampaignSelector.getActiveCampaign();
  return campaign?.id || DEFAULT_CAMPAIGN_ID;
}

function noteBelongsToActiveCampaign(item) {
  return (item?.campaignId || DEFAULT_CAMPAIGN_ID) === getActiveCampaignId();
}

function getActiveCampaignAdminNotes() {
  return getAdminStorageNotes().filter(noteBelongsToActiveCampaign);
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function maskDocumento(value) {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length > 11) {
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function normalizeDocumento(value) {
  return maskDocumento(value);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getImportedUsers() {
  try { return JSON.parse(localStorage.getItem(ADMIN_IMPORTED_USERS_KEY) || '[]'); }
  catch { return []; }
}

function saveImportedUsers(users) {
  localStorage.setItem(ADMIN_IMPORTED_USERS_KEY, JSON.stringify(users));
}

function ensureRankingUserFields(user, index = 0) {
  if (!user) return user;
  if (!Array.isArray(user.notas)) user.notas = [];
  if (!user.documento) user.documento = String(10000000000 + Number(user.id || index + 1) * 97 + index * 13).slice(0, 11);
  user.documento = normalizeDocumento(user.documento);
  if (!user.telefone) user.telefone = '149' + String(90000000 + Number(user.id || index + 1) * 11111).slice(0, 8);
  if (!user.origem) user.origem = 'manual';
  if (!user.cidade) user.cidade = '';
  if (!user.estado) user.estado = '';
  return user;
}

function getNextRankingUserId() {
  if (typeof ADMIN_MOCK === 'undefined' || !ADMIN_MOCK.length) return 1;
  return ADMIN_MOCK.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1;
}

function mergeImportedUsersIntoAdminMock() {
  if (typeof ADMIN_MOCK === 'undefined') return;

  ADMIN_MOCK.forEach(ensureRankingUserFields);

  getImportedUsers().forEach(imported => {
    const importedDoc = onlyDigits(imported.documento);
    if (!importedDoc) return;

    const existing = ADMIN_MOCK.find(user => onlyDigits(user.documento) === importedDoc);
    if (existing) {
      existing.nome = imported.nome || existing.nome;
      existing.email = imported.email || existing.email;
      existing.telefone = imported.telefone || existing.telefone;
      existing.documento = imported.documento || existing.documento;
      existing.origem = 'csv';
      existing.origemDetalhada = imported.origemDetalhada || existing.origemDetalhada;
      existing.dataUltimaAtualizacao = imported.dataUltimaAtualizacao || existing.dataUltimaAtualizacao;
      ensureRankingUserFields(existing);
      return;
    }

    const importedId = Number(imported.id);
    const nextUserId = importedId && !ADMIN_MOCK.some(user => Number(user.id) === importedId)
      ? importedId
      : getNextRankingUserId();

    ADMIN_MOCK.push(ensureRankingUserFields({
      id: nextUserId,
      nome: imported.nome || 'Usuário importado',
      email: imported.email || '',
      telefone: imported.telefone || '',
      documento: imported.documento || '',
      cidade: imported.cidade || '',
      estado: imported.estado || '',
      origem: 'csv',
      origemDetalhada: imported.origemDetalhada || 'Importação CSV',
      dataCriacao: imported.dataCriacao || imported.dataUltimaAtualizacao || new Date().toISOString(),
      dataUltimaAtualizacao: imported.dataUltimaAtualizacao || new Date().toISOString(),
      notas: [],
    }, ADMIN_MOCK.length));
  });
}

function getBarbaraImportedUserRecord() {
  const now = new Date().toISOString();
  return {
    id: BARBARA_USER.id,
    nome: BARBARA_USER.nome,
    email: BARBARA_USER.email,
    telefone: BARBARA_USER.telefone,
    documento: BARBARA_USER.documento,
    cidade: BARBARA_USER.cidade,
    estado: BARBARA_USER.estado,
    origem: 'manual',
    origemDetalhada: 'Usuária comum sincronizada',
    dataCriacao: now,
    dataUltimaAtualizacao: now,
  };
}

function ensureBarbaraImportedUserStorage() {
  const users = getImportedUsers();
  const barbaraDoc = onlyDigits(BARBARA_USER.documento);
  const existingIndex = users.findIndex(user =>
    onlyDigits(user.documento) === barbaraDoc || String(user.email || '').toLowerCase() === BARBARA_USER.email
  );
  const barbaraRecord = getBarbaraImportedUserRecord();

  if (existingIndex === -1) {
    users.push(barbaraRecord);
  } else {
    users[existingIndex] = { ...users[existingIndex], ...barbaraRecord };
  }
  saveImportedUsers(users);
}

function ensureBarbaraAdminUser() {
  if (typeof ADMIN_MOCK === 'undefined') return null;
  ensureBarbaraImportedUserStorage();
  const barbaraDoc = onlyDigits(BARBARA_USER.documento);
  let user = ADMIN_MOCK.find(item =>
    onlyDigits(item.documento) === barbaraDoc || String(item.email || '').toLowerCase() === BARBARA_USER.email
  );

  if (!user) {
    user = ensureRankingUserFields({
      ...getBarbaraImportedUserRecord(),
      notas: [],
    }, ADMIN_MOCK.length);
    ADMIN_MOCK.push(user);
    return user;
  }

  Object.assign(user, getBarbaraImportedUserRecord());
  return ensureRankingUserFields(user);
}

function mergeAdminStorageNotes() {
  if (typeof ADMIN_MOCK === 'undefined') return;

  getActiveCampaignAdminNotes().forEach(({ userId, nota }) => {
    const user = ADMIN_MOCK.find(u => Number(u.id) === Number(userId));
    if (!user || !nota) return;

    const existingIndex = user.notas.findIndex(existing => String(existing.id) === String(nota.id));
    if (existingIndex === -1) user.notas.unshift(nota);
    else user.notas[existingIndex] = { ...user.notas[existingIndex], ...nota };
  });
}

/* ============================================
   ADMIN RANKING MODE
   ============================================ */

function applyAdminRankingMode() {
  const userCol = document.getElementById('ranking-user-col');
  if (userCol) userCol.hidden = true;

  const historyCard = document.getElementById('history-card');
  if (historyCard) historyCard.hidden = true;

  const top10Col = document.getElementById('ranking-top10-col');
  if (top10Col) top10Col.hidden = false;

  const rankingLayout = document.getElementById('ranking-layout');
  if (rankingLayout) rankingLayout.classList.add('ranking-layout--admin');

  const rankingContainer = document.querySelector('.ranking-main .container');
  if (rankingContainer) rankingContainer.classList.add('container--wide');
}

/* ============================================
   RANKING LIST — render top 10
   ============================================ */

function positionClass(pos) {
  if (pos === 1) return 'ranking-item--gold';
  if (pos === 2) return 'ranking-item--silver';
  if (pos === 3) return 'ranking-item--bronze';
  return '';
}

function positionMedal(pos) {
  if (pos === 1) return '🥇';
  if (pos === 2) return '🥈';
  if (pos === 3) return '🥉';
  return String(pos);
}

function renderRankingList() {
  const listEl = document.getElementById('ranking-list');
  if (!listEl) return;
  const kpi = getActiveKPI();

  listEl.innerHTML = getRankingDataByKPI(kpi.id).map(item => `
    <li class="ranking-item ${positionClass(item.position)} reveal revealed reveal-delay-${Math.min(item.position, 5)}"
        aria-label="${item.position}º lugar: ${item.name}">
      <div class="ranking-item__medal" aria-hidden="true">${positionMedal(item.position)}</div>
      <div class="ranking-item__info">
        <div class="ranking-item__name">${item.name}</div>
        <div class="ranking-item__location">${item.location}</div>
      </div>
      <div class="ranking-item__score">
        <div class="ranking-item__points">${formatRankingMetric(item.metricValue, kpi.id)}</div>
        <div class="ranking-item__points-label">${kpi.scoreLabel}</div>
      </div>
    </li>
  `).join('');
}

/* ============================================
   RANKING VIEW SELECTOR + LAYOUT
   ============================================ */

function initRankingViewSelector() {
  window.addEventListener('ranking-view:changed', event => {
    applyRankingView(event.detail?.view?.id || Auth.getRankingView?.() || KPIS[0].id);
  });

  setTimeout(() => applyRankingView(activeRankingKPI), 200);
}

function updateRankingMenuState(kpi) {
  document.querySelectorAll('[data-ranking-kpi]').forEach(btn => {
    const active = btn.dataset.rankingKpi === kpi.id;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-checked', String(active));
  });
}

function updatePerformanceKPI(kpi) {
  const dynamicKpi = getDynamicKPI(kpi);
  const gaugeEl = document.getElementById('kpi-gauge');
  const barFill = document.getElementById('kpi-bar-fill');
  const barPct = document.getElementById('kpi-pct');
  const barText = document.getElementById('kpi-text');
  const kpiName = document.getElementById('kpi-name');

  if (!gaugeEl && !barFill) return;

  const pct = dynamicKpi.goal ? Math.min(100, (dynamicKpi.current / dynamicKpi.goal) * 100) : 0;
  const pctRounded = Math.round(pct);

  if (kpiName) kpiName.textContent = dynamicKpi.label;
  if (barPct) barPct.textContent = pctRounded + '%';
  if (barText) barText.innerHTML = dynamicKpi.formatText(dynamicKpi.current, dynamicKpi.goal);

  if (gaugeEl && typeof Gauge !== 'undefined') {
    Gauge.setValue(gaugeEl, pctRounded);
  } else if (barFill) {
    barFill.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { barFill.style.width = pct + '%'; });
    });
  }
}

function goalStatusClass(value, goal) {
  const pct = goal ? (value / goal) * 100 : 0;
  if (pct >= 100) return 'is-goal-green';
  if (pct >= 65) return 'is-goal-yellow';
  return 'is-goal-red';
}

function applyLayoutForKPI(kpiId) {
  if (isAdminMode) return;

  const layout = document.getElementById('ranking-layout');
  const top10Col = document.getElementById('ranking-top10-col');
  const showTop10 = kpiId === 'pontos-acumulados';

  if (layout) {
    layout.classList.remove(
      'ranking-layout--kpi-pontos-acumulados',
      'ranking-layout--kpi-meta-compras',
      'ranking-layout--kpi-quantidade-compras'
    );
    layout.classList.add(`ranking-layout--kpi-${kpiId}`);
    layout.dataset.activeKpi = kpiId;
    layout.classList.toggle('ranking-layout--no-top10', !showTop10);
  }
  if (top10Col) {
    top10Col.hidden = !showTop10;
  }
}

function applyRankingView(kpiId) {
  const kpi = KPIS.find(item => item.id === kpiId) || KPIS[0];
  activeRankingKPI = kpi.id;

  if (Auth.updateStatusPageLabels) Auth.updateStatusPageLabels();
  updateRankingMenuState(kpi);
  updatePerformanceKPI(kpi);
  applyLayoutForKPI(kpi.id);
  renderRankingList();
  renderHistoryKPISummary(kpi.id);
  if (!isAdminMode) renderInvoices();
}

function refreshUserDashboard() {
  if (isAdminMode) return;
  updatePerformanceKPI(getActiveKPI());
  renderHistoryKPISummary(activeRankingKPI);
  renderHistoryPreview();
  renderInvoices();
  if (document.getElementById('modal-history')?.classList.contains('is-open')) {
    renderHistoryModalPage(historyCurrentPage);
  }
}

/* ============================================
   HISTÓRICO DE COMPRAS — card + modal
   ============================================ */

function historyStatusLabel(s) {
  const labels = {
    aprovada: 'Aprovada',
    validada: 'Aprovada',
    aguardando: 'Pendente',
    reprovada: 'Reprovada',
    excluida: 'Excluída',
  };
  return labels[s] || s;
}

function historyStatusClass(s) {
  if (s === 'aprovada' || s === 'validada') return 'aprovada';
  if (s === 'aguardando') return 'aguardando';
  if (s === 'reprovada') return 'reprovada';
  return 'excluida';
}

function fmtDate(iso) {
  return iso ? iso.split('-').reverse().join('/') : '—';
}

function getHistoryPreviewSrc(nota) {
  const products = (nota.produtos || []).map(p => `${p.qtd}x ${p.nome}`).join(' | ') || 'Produtos da campanha';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1280" viewBox="0 0 900 1280">
      <rect width="900" height="1280" fill="#eef2f7"/>
      <rect x="96" y="48" width="708" height="1184" rx="28" fill="#ffffff" stroke="#d8dee8" stroke-width="4"/>
      <text x="450" y="118" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#111827">NOTA DE COMPRA</text>
      <text x="450" y="156" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#6b7280">Histórico de compras da campanha</text>
      <line x1="140" y1="194" x2="760" y2="194" stroke="#e5e7eb" stroke-width="3"/>
      <text x="140" y="250" font-family="Courier New, monospace" font-size="24" fill="#111827">${nota.estabelecimento}</text>
      <text x="140" y="294" font-family="Courier New, monospace" font-size="20" fill="#4b5563">Nota ${nota.numeroNota}</text>
      <text x="140" y="336" font-family="Courier New, monospace" font-size="20" fill="#4b5563">Emissão ${fmtDate(nota.data)}</text>
      <text x="140" y="378" font-family="Courier New, monospace" font-size="20" fill="#4b5563">Status ${historyStatusLabel(nota.status)}</text>
      <line x1="140" y1="420" x2="760" y2="420" stroke="#e5e7eb" stroke-width="3"/>
      <text x="140" y="480" font-family="Courier New, monospace" font-size="20" fill="#111827">${products}</text>
      <line x1="140" y1="584" x2="760" y2="584" stroke="#e5e7eb" stroke-width="3"/>
      <text x="140" y="640" font-family="Courier New, monospace" font-size="24" fill="#111827">TOTAL</text>
      <text x="760" y="640" text-anchor="end" font-family="Courier New, monospace" font-size="24" font-weight="700" fill="#111827">${nota.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</text>
      <rect x="140" y="820" width="620" height="220" rx="16" fill="#f9fafb" stroke="#e5e7eb" stroke-width="2"/>
      <text x="450" y="892" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#6b7280">QR / código de barras ilustrativo</text>
      <g fill="#111827">
        <rect x="184" y="930" width="6" height="78"/><rect x="198" y="910" width="12" height="98"/><rect x="220" y="924" width="8" height="84"/><rect x="236" y="900" width="16" height="108"/><rect x="262" y="934" width="6" height="74"/><rect x="276" y="916" width="10" height="92"/><rect x="296" y="904" width="14" height="104"/><rect x="318" y="930" width="7" height="78"/><rect x="334" y="914" width="11" height="94"/><rect x="354" y="900" width="18" height="108"/><rect x="382" y="926" width="7" height="82"/><rect x="398" y="908" width="12" height="100"/><rect x="420" y="936" width="6" height="72"/><rect x="434" y="900" width="14" height="108"/><rect x="456" y="922" width="8" height="86"/><rect x="472" y="908" width="12" height="100"/><rect x="494" y="934" width="6" height="74"/><rect x="508" y="900" width="16" height="108"/><rect x="534" y="926" width="8" height="82"/><rect x="550" y="910" width="10" height="98"/>
      </g>
    </svg>`;

  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

function getHistoryPeriodCutoff(period) {
  if (period === 'all') return null;
  const days = Number(period);
  if (!days) return null;
  const notes = getCombinedUserNotes();
  const latestTime = Math.max(...notes.map(nota => new Date(nota.data + 'T00:00:00').getTime()));
  return latestTime - ((days - 1) * 24 * 60 * 60 * 1000);
}

function getFilteredHistoryNotes() {
  const cutoff = getHistoryPeriodCutoff(historyFilters.period);

  return getCombinedUserNotes().filter(nota => {
    const status = historyStatusClass(nota.status);
    const noteTime = new Date(nota.data + 'T00:00:00').getTime();

    if (historyFilters.status !== 'all' && status !== historyFilters.status) return false;
    if (historyFilters.establishment !== 'all' && nota.estabelecimento !== historyFilters.establishment) return false;
    if (cutoff && noteTime < cutoff) return false;

    return true;
  });
}

function renderHistoryFilters() {
  const filtersEl = document.getElementById('modal-history-filters');
  if (!filtersEl) return;

  const establishments = Array.from(new Set(getCombinedUserNotes().map(nota => nota.estabelecimento))).sort();
  const resetActiveClass = hasActiveHistoryFilters() ? ' is-active' : '';

  filtersEl.innerHTML = `
    <label class="history-filter">
      <span>Status da nota</span>
      <select data-history-filter="status">
        <option value="all"${historyFilters.status === 'all' ? ' selected' : ''}>Todos</option>
        <option value="aprovada"${historyFilters.status === 'aprovada' ? ' selected' : ''}>Aprovada</option>
        <option value="aguardando"${historyFilters.status === 'aguardando' ? ' selected' : ''}>Pendente</option>
        <option value="reprovada"${historyFilters.status === 'reprovada' ? ' selected' : ''}>Reprovada</option>
        <option value="excluida"${historyFilters.status === 'excluida' ? ' selected' : ''}>Excluída</option>
      </select>
    </label>
    <label class="history-filter">
      <span>Período</span>
      <select data-history-filter="period">
        <option value="all"${historyFilters.period === 'all' ? ' selected' : ''}>Todo período</option>
        <option value="7"${historyFilters.period === '7' ? ' selected' : ''}>Últimos 7 dias</option>
        <option value="15"${historyFilters.period === '15' ? ' selected' : ''}>Últimos 15 dias</option>
        <option value="30"${historyFilters.period === '30' ? ' selected' : ''}>Últimos 30 dias</option>
        <option value="60"${historyFilters.period === '60' ? ' selected' : ''}>Últimos 60 dias</option>
        <option value="90"${historyFilters.period === '90' ? ' selected' : ''}>Últimos 90 dias</option>
      </select>
    </label>
    <label class="history-filter">
      <span>Estabelecimento</span>
      <select data-history-filter="establishment">
        <option value="all"${historyFilters.establishment === 'all' ? ' selected' : ''}>Todos</option>
        ${establishments.map(name => `<option value="${name}"${historyFilters.establishment === name ? ' selected' : ''}>${name}</option>`).join('')}
      </select>
    </label>
    <div class="history-filter history-filter--actions">
      <span>&nbsp;</span>
      <button class="history-filter__reset${resetActiveClass}" type="button" data-history-filter-reset>
        <i class="fa-solid fa-filter-circle-xmark"></i> Limpar filtros
      </button>
    </div>
  `;
}

function hasActiveHistoryFilters() {
  return historyFilters.status !== 'all' ||
    historyFilters.period !== 'all' ||
    historyFilters.establishment !== 'all';
}

function resetHistoryFilters() {
  historyFilters.status = 'all';
  historyFilters.period = 'all';
  historyFilters.establishment = 'all';
}

function isApprovedUserNote(nota) {
  return nota.status === 'aprovada' || nota.status === 'validada';
}

function parsePtBrDateToIso(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parts = String(value).split('/');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return new Date().toISOString().slice(0, 10);
}

function normalizeInvoiceProducts(products) {
  if (!Array.isArray(products)) return [];
  return products
    .map(product => {
      const name = product.nome || product.name;
      const qtd = Math.max(0, parseInt(product.qtd || product.quantity || 0, 10) || 0);
      if (!PRODUCT_NAMES.includes(name) || qtd <= 0) return null;
      return {
        nome: name,
        qtd,
        valorUnit: Number(product.valorUnit || product.unitValue || PRODUCT_UNIT_PRICES[name]),
      };
    })
    .filter(Boolean);
}

function getInvoiceProductSeed(invoice) {
  const raw = String(invoice?.id || invoice?.numeroNota || invoice?.luckyNumber || invoice?.arquivoNome || invoice?.filename || 'nota');
  return Array.from(raw).reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 7);
}

function simulateInvoiceProducts(invoice) {
  const value = Math.max(0, Number(invoice?.valor || invoice?.value || 0));
  const seed = getInvoiceProductSeed(invoice);
  const orderedNames = PRODUCT_NAMES
    .map((name, index) => ({ name, rank: (seed + index * 17) % PRODUCT_NAMES.length }))
    .sort((a, b) => a.rank - b.rank)
    .map(item => item.name);
  const totals = PRODUCT_NAMES.reduce((acc, name) => {
    acc[name] = 0;
    return acc;
  }, {});

  let remaining = value;
  let guard = 0;
  while (remaining >= 180 && guard < 80) {
    const nextName = orderedNames.find(name => PRODUCT_UNIT_PRICES[name] <= remaining + 0.01);
    if (!nextName) break;
    totals[nextName] += 1;
    remaining -= PRODUCT_UNIT_PRICES[nextName];
    guard += 1;
  }

  if (!Object.values(totals).some(Boolean)) {
    totals[orderedNames[seed % orderedNames.length]] = 1;
  }

  return PRODUCT_NAMES
    .filter(name => totals[name] > 0)
    .map(name => ({ nome: name, qtd: totals[name], valorUnit: PRODUCT_UNIT_PRICES[name] }));
}

function ensureInvoiceProducts(invoice) {
  const normalized = normalizeInvoiceProducts(invoice?.produtos);
  return normalized.length ? normalized : simulateInvoiceProducts(invoice);
}

function normalizeStoredInvoice(inv) {
  const syncedAdminNote = findSyncedAdminNoteForInvoice(inv);
  const value = Number(inv.value || inv.valor || 0);
  const date = parsePtBrDateToIso(inv.date || inv.data);
  const productsSource = syncedAdminNote?.nota?.produtos?.length ? syncedAdminNote.nota : { ...inv, valor: value };
  return {
    id: inv.id,
    numeroNota: inv.numeroNota || `NF-${inv.luckyNumber || String(inv.id).slice(-6)}`,
    data: date,
    valor: value,
    status: syncedAdminNote?.nota?.status || inv.status || 'aguardando',
    estabelecimento: inv.estabelecimento || 'Nota lançada pelo usuário',
    origem: inv.origem || 'manual',
    arquivoNome: inv.filename || inv.arquivoNome || 'Arquivo não informado',
    luckyNumber: inv.luckyNumber,
    produtos: ensureInvoiceProducts(productsSource),
  };
}

function compareNotesByDateDesc(a, b) {
  const dateDiff = new Date(b.data + 'T00:00:00').getTime() - new Date(a.data + 'T00:00:00').getTime();
  if (dateDiff) return dateDiff;
  return String(b.id).localeCompare(String(a.id));
}

function getCombinedUserNotes() {
  const syncedIds = new Set(getBarbaraAdminNotes().map(nota => String(nota.sourceInvoiceId || nota.id)));
  const unsyncedLocalNotes = ensureInvoiceDefaults(getInvoices())
    .filter(inv => !syncedIds.has(String(inv.id)) && !findSyncedAdminNoteForInvoice(inv))
    .map(normalizeStoredInvoice);

  const approvedBarbaraAdminNotes = getBarbaraAdminNotes().filter(isApprovedUserNote);

  return USER_HISTORY_NOTES
    .map(nota => ({ ...nota, produtos: ensureInvoiceProducts(nota) }))
    .concat(approvedBarbaraAdminNotes, unsyncedLocalNotes.filter(isApprovedUserNote))
    .sort(compareNotesByDateDesc);
}

function computeHistoryKPIs() {
  const approved = getCombinedUserNotes().filter(isApprovedUserNote);
  const totals = PRODUCT_NAMES.reduce((acc, name) => {
    acc[name] = { qtd: 0, valor: 0 };
    return acc;
  }, {});

  approved.forEach(nota => {
    (nota.produtos || []).forEach(p => {
      if (totals[p.nome]) {
        totals[p.nome].qtd += p.qtd;
        totals[p.nome].valor += p.qtd * p.valorUnit;
      }
    });
  });

  return totals;
}

function sumProductTotals(totals, field) {
  return PRODUCT_NAMES.reduce((sum, name) => sum + Number(totals[name]?.[field] || 0), 0);
}

function getComboProgressKPI(kpiId, totals) {
  const targets = COMBO_TARGETS[kpiId];
  if (!targets) return { current: 0, goal: 100 };

  const field = kpiId === 'meta-compras' ? 'valor' : 'qtd';
  const productTargets = targets.products || {};
  const productNames = PRODUCT_NAMES.filter(name => Number(productTargets[name] || 0) > 0);
  if (!productNames.length) return { current: 0, goal: 100 };

  const progressSum = productNames.reduce((sum, name) => {
    const current = Number(totals[name]?.[field] || 0);
    const goal = Number(productTargets[name] || 0);
    const pct = goal ? Math.min(100, (current / goal) * 100) : 0;
    return sum + pct;
  }, 0);

  return {
    current: progressSum / productNames.length,
    goal: 100,
  };
}

function getDynamicKPI(kpi) {
  const totals = computeHistoryKPIs();
  if (kpi.id === 'pontos-acumulados') {
    const current = sumProductTotals(totals, 'valor');
    return { ...kpi, current, goal: kpi.goal };
  }
  if (kpi.id === 'meta-compras') {
    return { ...kpi, ...getComboProgressKPI('meta-compras', totals) };
  }
  if (kpi.id === 'quantidade-compras') {
    return { ...kpi, ...getComboProgressKPI('quantidade-compras', totals) };
  }
  return { ...kpi, current: 0 };
}

function renderHistoryKPISummary(kpiId) {
  const el = document.getElementById('history-kpi-summary');
  if (!el) return;

  const totals = computeHistoryKPIs();

  const useValue = kpiId === 'meta-compras';
  const useQty = kpiId === 'quantidade-compras';

  if (!useValue && !useQty) {
    el.hidden = true;
    return;
  }

  el.hidden = false;
  const targets = COMBO_TARGETS[kpiId];
  const field = useValue ? 'valor' : 'qtd';
  const formatGoalValue = value => useValue
    ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : `${value} un.`;
  const formatCurrentValue = value => useValue
    ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : `${value} un.`;
  const renderChip = (name, current, goal) => {
    const pct = goal ? Math.round(Math.min(100, (current / goal) * 100)) : 0;
    return `
      <div class="history-kpi-chip ${goalStatusClass(current, goal)}">
        <span class="history-kpi-chip__name">${name}</span>
        <span class="history-kpi-chip__value">${formatCurrentValue(current)}</span>
        <span class="history-kpi-chip__goal">Meta: ${formatGoalValue(goal)}</span>
        <span class="history-kpi-chip__pct">${pct}% atingido</span>
      </div>
    `;
  };

  el.innerHTML = `
    <div class="history-kpi-summary__label">
      ${useValue ? 'Metas de compras (notas aprovadas)' : 'Metas de quantidade (notas aprovadas)'}
    </div>
    <div class="history-kpi-summary__grid">
      ${PRODUCT_NAMES.map(nome => renderChip(nome, totals[nome][field], targets.products[nome])).join('')}
    </div>
  `;
}

function renderHistoryPreview() {
  const previewEl = document.getElementById('history-notes-preview');
  const countEl = document.getElementById('history-count');
  if (!previewEl) return;

  const notes = getCombinedUserNotes();
  const total = notes.length;
  const preview = notes.slice(0, 3);

  if (countEl) countEl.textContent = `${total} notas`;

  previewEl.innerHTML = preview.map(nota => buildHistoryNoteHTML(nota)).join('');
}

function buildHistoryNoteHTML(nota) {
  const sc = historyStatusClass(nota.status);
  const label = historyStatusLabel(nota.status);
  const prodTags = (nota.produtos || []).map(p =>
    `<span class="history-note__product-tag">${p.nome} x${p.qtd}</span>`
  ).join('');

  return `
    <div class="history-note history-note--${sc}">
      <div class="history-note__header">
        <span class="history-note__number">${nota.numeroNota}</span>
        <div class="history-note__header-right">
          <span class="history-note__status history-note__status--${sc}">${label}</span>
          <button class="history-note__action" type="button" title="Visualizar nota ${nota.numeroNota}"
            aria-label="Visualizar nota ${nota.numeroNota}" data-history-preview="${nota.id}">
            <i class="fa-solid fa-eye" aria-hidden="true"></i>
          </button>
          <a href="${getHistoryPreviewSrc(nota)}" class="history-note__action" title="Download da nota ${nota.numeroNota}"
             aria-label="Baixar nota ${nota.numeroNota}" download="${nota.numeroNota}.svg">
            <i class="fa-solid fa-download" aria-hidden="true"></i>
          </a>
        </div>
      </div>
      <div class="history-note__body">
        <div class="history-note__field">
          <span class="history-note__field-label">Data</span>
          <span class="history-note__field-value">${fmtDate(nota.data)}</span>
        </div>
        <div class="history-note__field">
          <span class="history-note__field-label">Valor</span>
          <span class="history-note__field-value">${nota.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div class="history-note__field">
          <span class="history-note__field-label">Estabelecimento</span>
          <span class="history-note__field-value">${nota.estabelecimento}</span>
        </div>
      </div>
      ${prodTags ? `<div class="history-note__products">${prodTags}</div>` : ''}
    </div>
  `;
}

function initHistoryCard() {
  if (isAdminMode) return;

  renderHistoryPreview();
  renderHistoryKPISummary(activeRankingKPI);

  const btnAll = document.getElementById('history-btn-all');
  if (btnAll) {
    btnAll.addEventListener('click', () => {
      historyCurrentPage = 1;
      openHistoryModal();
    });
  }

  const closeBtn = document.getElementById('modal-history-close');
  if (closeBtn) closeBtn.addEventListener('click', closeHistoryModal);

  const previewCloseBtn = document.getElementById('modal-history-preview-close');
  if (previewCloseBtn) previewCloseBtn.addEventListener('click', closeHistoryPreviewModal);

  const filtersEl = document.getElementById('modal-history-filters');
  if (filtersEl) {
    filtersEl.addEventListener('change', event => {
      const filter = event.target.closest('[data-history-filter]');
      if (!filter) return;
      historyFilters[filter.dataset.historyFilter] = filter.value;
      historyCurrentPage = 1;
      renderHistoryModalPage(historyCurrentPage);
    });

    filtersEl.addEventListener('click', event => {
      const resetBtn = event.target.closest('[data-history-filter-reset]');
      if (!resetBtn) return;
      resetHistoryFilters();
      historyCurrentPage = 1;
      renderHistoryModalPage(historyCurrentPage);
    });
  }

  const modalList = document.getElementById('modal-history-list');
  if (modalList) {
    modalList.addEventListener('click', event => {
      const btn = event.target.closest('[data-history-preview]');
      if (!btn) return;
      openHistoryPreviewModal(btn.dataset.historyPreview);
    });
  }

  const previewList = document.getElementById('history-notes-preview');
  if (previewList) {
    previewList.addEventListener('click', event => {
      const btn = event.target.closest('[data-history-preview]');
      if (!btn) return;
      openHistoryPreviewModal(btn.dataset.historyPreview);
    });
  }

  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      const invoiceUserSearchModal = document.getElementById('modal-invoice-user-search');
      if (invoiceUserSearchModal?.classList.contains('is-open')) closeInvoiceUserSearchModal();
      const previewModal = document.getElementById('modal-history-preview');
      if (previewModal?.classList.contains('is-open')) closeHistoryPreviewModal();
      const historyModal = document.getElementById('modal-history');
      if (historyModal?.classList.contains('is-open')) closeHistoryModal();
    });
  }

  ['modal-history', 'modal-history-preview'].forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.addEventListener('click', event => {
      if (event.target !== modal) return;
      if (modalId === 'modal-history-preview') closeHistoryPreviewModal();
      if (modalId === 'modal-history') closeHistoryModal();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeInvoiceUserSearchModal();
    closeHistoryPreviewModal();
    closeHistoryModal();
  });
}

function openHistoryModal() {
  const modal = document.getElementById('modal-history');
  const overlay = document.getElementById('modal-overlay');
  if (modal) { modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); }
  if (overlay) { overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden', 'false'); }
  document.body.classList.add('modal-open');
  renderHistoryModalPage(historyCurrentPage);
}

function closeHistoryModal() {
  const modal = document.getElementById('modal-history');
  if (!modal || !modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');

  /* Só fecha overlay/body se nenhum outro modal estiver aberto */
  const anyOtherOpen = document.querySelector('.modal.is-open');
  if (!anyOtherOpen) {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) { overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden', 'true'); }
    document.body.classList.remove('modal-open');
  }
}

function openHistoryPreviewModal(noteId) {
  const nota = getCombinedUserNotes().find(item => String(item.id) === String(noteId));
  const modal = document.getElementById('modal-history-preview');
  const overlay = document.getElementById('modal-overlay');
  if (!nota || !modal) return;

  const title = document.getElementById('modal-history-preview-title');
  const image = document.getElementById('history-preview-image');

  if (title) title.textContent = 'Visualizar ' + nota.numeroNota;
  if (image) {
    image.src = getHistoryPreviewSrc(nota);
    image.alt = 'Prévia da nota ' + nota.numeroNota;
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  if (overlay) { overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden', 'false'); }
  document.body.classList.add('modal-open');
}

function closeHistoryPreviewModal() {
  const modal = document.getElementById('modal-history-preview');
  if (!modal || !modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');

  const anyOtherOpen = document.querySelector('.modal.is-open');
  if (!anyOtherOpen) {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) { overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden', 'true'); }
    document.body.classList.remove('modal-open');
  }
}

function renderHistoryModalPage(page) {
  const listEl = document.getElementById('modal-history-list');
  const paginationEl = document.getElementById('modal-history-pagination');
  if (!listEl) return;

  renderHistoryFilters();

  const filteredNotes = getFilteredHistoryNotes();
  const total = filteredNotes.length;
  const totalPages = Math.max(1, Math.ceil(total / HISTORY_PAGE_SIZE));
  if (page > totalPages) {
    historyCurrentPage = totalPages;
    renderHistoryModalPage(totalPages);
    return;
  }
  const start = (page - 1) * HISTORY_PAGE_SIZE;
  const pageNotes = filteredNotes.slice(start, start + HISTORY_PAGE_SIZE);

  listEl.innerHTML = pageNotes.length
    ? pageNotes.map(nota => buildHistoryNoteHTML(nota)).join('')
    : '<div class="invoice-empty"><div class="invoice-empty__icon" aria-hidden="true">📋</div><p class="invoice-empty__text">Nenhuma nota encontrada para os filtros selecionados.</p></div>';

  if (paginationEl) {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(`
        <button class="history-pagination__btn${i === page ? ' is-active' : ''}"
          type="button" data-page="${i}" aria-label="Página ${i}"${i === page ? ' aria-current="page"' : ''}>
          ${i}
        </button>
      `);
    }

    paginationEl.innerHTML = `
      <button class="history-pagination__btn history-pagination__btn--nav"
        type="button" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''} aria-label="Página anterior">
        <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
      </button>
      ${pages.join('')}
      <button class="history-pagination__btn history-pagination__btn--nav"
        type="button" data-page="${page + 1}" ${page === totalPages ? 'disabled' : ''} aria-label="Próxima página">
        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </button>
    `;

    paginationEl.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page, 10);
        if (!p || p < 1 || p > totalPages) return;
        historyCurrentPage = p;
        renderHistoryModalPage(p);
        listEl.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }
}

/* ============================================
   INVOICES — localStorage helpers
   ============================================ */

function getInvoices() {
  try { return JSON.parse(localStorage.getItem(INVOICE_KEY) || '[]'); }
  catch { return []; }
}

function saveInvoices(invoices) {
  localStorage.setItem(INVOICE_KEY, JSON.stringify(invoices));
}

function getAdminStorageNotes() {
  try {
    const stored = JSON.parse(localStorage.getItem(ADMIN_NOTES_KEY) || '[]');
    let changed = false;
    const normalized = stored.map(item => {
      if (!item?.nota) return item;
      const products = ensureInvoiceProducts(item.nota);
      if (JSON.stringify(normalizeInvoiceProducts(item.nota.produtos)) === JSON.stringify(products)) return item;
      changed = true;
      return { ...item, nota: { ...item.nota, produtos: products } };
    });
    if (changed) saveAdminStorageNotes(normalized);
    return normalized;
  }
  catch { return []; }
}

function saveAdminStorageNotes(notes) {
  localStorage.setItem(ADMIN_NOTES_KEY, JSON.stringify(notes));
}

function getBarbaraAdminUserId() {
  const user = ensureBarbaraAdminUser();
  return user ? user.id : BARBARA_USER.id;
}

function adminNoteBelongsToBarbara(item) {
  return noteBelongsToActiveCampaign(item) && Number(item.userId) === Number(getBarbaraAdminUserId());
}

function getBarbaraAdminNotes() {
  return getAdminStorageNotes()
    .filter(adminNoteBelongsToBarbara)
    .map(item => normalizeAdminNoteForHistory(item.nota));
}

function normalizeAdminNoteForHistory(nota) {
  const value = Number(nota.valor || 0);
  return {
    id: nota.id,
    sourceInvoiceId: nota.sourceInvoiceId,
    numeroNota: nota.numeroNota || `NF-${nota.luckyNumber || String(nota.id).slice(-6)}`,
    data: nota.data || new Date().toISOString().slice(0, 10),
    valor: value,
    status: nota.status || 'aguardando',
    estabelecimento: nota.estabelecimento || 'Nota lançada pelo administrador',
    origem: nota.origem || 'manual',
    arquivoNome: nota.arquivoNome || 'Arquivo não informado',
    luckyNumber: nota.luckyNumber,
    produtos: ensureInvoiceProducts({ ...nota, valor: value }),
  };
}

function findSyncedAdminNoteForInvoice(inv) {
  const syncedId = inv.adminNoteId || inv.id;
  return getAdminStorageNotes().find(item =>
    adminNoteBelongsToBarbara(item) &&
    (String(item.nota?.id) === String(syncedId) || String(item.nota?.sourceInvoiceId) === String(inv.id))
  );
}

function syncBarbaraInvoiceToAdmin(inv) {
  const userId = getBarbaraAdminUserId();
  const stored = getAdminStorageNotes();
  const existingIndex = stored.findIndex(item =>
    adminNoteBelongsToBarbara(item) &&
    (String(item.nota?.id) === String(inv.adminNoteId || inv.id) || String(item.nota?.sourceInvoiceId) === String(inv.id))
  );
  const noteId = inv.adminNoteId || inv.id;
  const initialStatus = ['validada', 'aprovada'].includes(inv.status)
    ? 'validada'
    : (inv.status === 'excluida' ? 'excluida' : 'aguardando');
  const existingProducts = existingIndex === -1 ? [] : normalizeInvoiceProducts(stored[existingIndex].nota.produtos);
  const nota = {
    id: noteId,
    sourceInvoiceId: inv.id,
    numeroNota: inv.numeroNota || `NF-${inv.luckyNumber || String(inv.id).slice(-6)}`,
    valor: Number(inv.value || inv.valor || 0),
    data: parsePtBrDateToIso(inv.date || inv.data),
    status: existingIndex === -1 ? initialStatus : (stored[existingIndex].nota.status || initialStatus),
    origem: inv.origem || 'manual',
    estabelecimento: inv.estabelecimento || 'Nota lançada por Bárbara',
    responsavelLancamento: BARBARA_USER.nome,
    arquivoNome: inv.filename || inv.arquivoNome || 'Arquivo não informado',
    luckyNumber: inv.luckyNumber,
    justificativa: existingIndex === -1 ? null : (stored[existingIndex].nota.justificativa || null),
    produtos: existingProducts.length ? existingProducts : ensureInvoiceProducts(inv),
  };
  const item = { campaignId: getActiveCampaignId(), userId, nota };

  if (existingIndex === -1) stored.unshift(item);
  else stored[existingIndex] = { ...stored[existingIndex], userId, campaignId: getActiveCampaignId(), nota };
  saveAdminStorageNotes(stored);
  return nota;
}

function syncAllBarbaraLocalInvoicesToAdmin() {
  const invoices = ensureInvoiceDefaults(getInvoices());
  let changed = false;
  const syncedInvoices = invoices.map(inv => {
    const syncedNote = syncBarbaraInvoiceToAdmin(inv);
    if (inv.adminNoteId === syncedNote.id && inv.status === syncedNote.status) return inv;
    changed = true;
    return {
      ...inv,
      adminNoteId: syncedNote.id,
      status: syncedNote.status,
    };
  });
  if (changed) saveInvoices(syncedInvoices);
}

function removeAdminStorageNote(noteId) {
  const targetId = String(noteId);
  const stored = getAdminStorageNotes();
  const noteItem = stored.find(item => noteBelongsToActiveCampaign(item) && String(item.nota.id) === targetId);
  const nextStored = stored.filter(item => !(noteBelongsToActiveCampaign(item) && String(item.nota.id) === targetId));

  saveAdminStorageNotes(nextStored);

  if (noteItem) {
    const user = ADMIN_MOCK.find(u => u.id === noteItem.userId);
    if (user) user.notas = user.notas.filter(nota => String(nota.id) !== targetId);
  }
}

/* ——— Formatação geral ——— */

function generateLucky() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

function fmtCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatMoneyInput(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';
  return (Number(digits) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseMoneyInput(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return NaN;
  return Number(digits) / 100;
}

function bindInvoiceValueMask(valueInput) {
  if (!valueInput || valueInput.dataset.moneyMaskBound === 'true') return;
  valueInput.dataset.moneyMaskBound = 'true';
  valueInput.addEventListener('input', () => {
    valueInput.value = formatMoneyInput(valueInput.value);
  });
  valueInput.addEventListener('blur', () => {
    valueInput.value = formatMoneyInput(valueInput.value);
  });
}

function statusLabelPt(s) {
  return { aguardando: 'Aguardando', validada: 'Validada', excluida: 'Excluída', reprovada: 'Reprovada' }[s] || s;
}

function origemLabelPt(origem) {
  return { manual: 'Manual', csv: 'Importado via CSV', 'sell-out': 'Sell-Out' }[origem] || 'Manual';
}

function ensureLuckyNumbers(items, saveFn) {
  let changed = false;
  const normalized = items.map(item => {
    if (item.luckyNumber) return item;
    changed = true;
    return { ...item, luckyNumber: generateLucky() };
  });
  if (changed && saveFn) saveFn(normalized);
  return normalized;
}

function ensureInvoiceLuckyNumbers(invoices) {
  return ensureLuckyNumbers(invoices, saveInvoices);
}

function ensureInvoiceDefaults(invoices) {
  let changed = false;
  const normalized = invoices.map(inv => {
    const next = { ...inv };
    if (!next.luckyNumber) { next.luckyNumber = generateLucky(); changed = true; }
    if (!next.status) { next.status = 'aguardando'; changed = true; }
    if (!next.origem) { next.origem = 'manual'; changed = true; }
    const products = ensureInvoiceProducts(next);
    if (JSON.stringify(normalizeInvoiceProducts(next.produtos)) !== JSON.stringify(products)) {
      next.produtos = products;
      changed = true;
    }
    return next;
  });
  if (changed) saveInvoices(normalized);
  return normalized;
}

function ensureAdminStorageLuckyNumbers(storedNotes) {
  let changed = false;
  const normalized = storedNotes.map(item => {
    if (item.nota?.luckyNumber) return item;
    changed = true;
    return { ...item, nota: { ...item.nota, luckyNumber: generateLucky() } };
  });

  if (changed) {
    const normalizedById = new Map(normalized.map(item => [String(item.nota?.id), item]));
    const allNotes = getAdminStorageNotes().map(item => {
      const normalizedItem = normalizedById.get(String(item.nota?.id));
      return normalizedItem && noteBelongsToActiveCampaign(item) ? normalizedItem : item;
    });
    saveAdminStorageNotes(allNotes);
  }
  return normalized;
}

/* ============================================
   INVOICES — roteador
   ============================================ */

function initInvoices() {
  updateInvoiceUserFieldVisibility();
  if (isAdminMode) initAdminInvoices();
  else initUserInvoices();
}

function updateInvoiceUserFieldVisibility() {
  const userField = document.getElementById('invoice-user-field');
  const userInput = document.getElementById('invoice-user');
  const canSelect = Auth.getRole() === 'admin';

  if (userField) {
    userField.hidden = !canSelect;
    userField.setAttribute('aria-hidden', String(!canSelect));
  }
  if (userInput) {
    userInput.disabled = !canSelect;
    if (!canSelect) {
      selectedInvoiceUserId = null;
      userInput.value = '';
    }
  }
}

function syncAdminInvoiceUserSelect() {
  if (!isAdminMode) return;
  const userInput = document.getElementById('invoice-user');
  if (!userInput || typeof ADMIN_MOCK === 'undefined') return;

  if (selectedInvoiceUserId) {
    const stillExists = ADMIN_MOCK.some(user => Number(user.id) === Number(selectedInvoiceUserId));
    if (!stillExists) selectedInvoiceUserId = null;
  }

  userInput.value = selectedInvoiceUserId || '';
  renderSelectedInvoiceUser();
  renderInvoiceUserSearchResults();
}

function getInvoiceSearchableUsers() {
  if (typeof ADMIN_MOCK === 'undefined') return [];
  return ADMIN_MOCK.slice();
}

function getSelectedInvoiceUser() {
  if (!selectedInvoiceUserId || typeof ADMIN_MOCK === 'undefined') return null;
  return ADMIN_MOCK.find(user => Number(user.id) === Number(selectedInvoiceUserId)) || null;
}

function getOriginBadgeHTML(user) {
  const origin = user?.origem === 'csv' ? 'csv' : 'manual';
  const label = origin === 'csv' ? 'Importado via CSV' : 'Manual';
  return '<span class="user-badge user-badge--origem user-badge--origem-' + origin + '">' + label + '</span>';
}

function renderSelectedInvoiceUser() {
  const userInput = document.getElementById('invoice-user');
  const emptyEl = document.getElementById('invoice-user-empty');
  const selectedEl = document.getElementById('invoice-user-selected');
  const searchBtn = document.getElementById('invoice-user-search-btn');
  const user = getSelectedInvoiceUser();

  if (userInput) userInput.value = user ? user.id : '';
  if (emptyEl) emptyEl.hidden = Boolean(user);
  if (selectedEl) {
    selectedEl.hidden = !user;
    selectedEl.innerHTML = user ? `
      <strong class="invoice-user-picker__name">${escapeHtml(user.nome)}</strong>
      <span class="invoice-user-picker__meta">${escapeHtml(user.email || 'E-mail não informado')}</span>
      <span class="invoice-user-picker__meta">${escapeHtml(user.documento || 'Documento não informado')}</span>
      ${getOriginBadgeHTML(user)}
    ` : '';
  }
  if (searchBtn) searchBtn.textContent = user ? 'Trocar usuário' : 'Pesquisar usuário';
}

function clearSelectedInvoiceUser() {
  selectedInvoiceUserId = null;
  renderSelectedInvoiceUser();
}

function selectInvoiceUser(userId) {
  const numericId = Number(userId);
  if (!numericId || typeof ADMIN_MOCK === 'undefined') return;
  const user = ADMIN_MOCK.find(item => Number(item.id) === numericId);
  if (!user) return;
  selectedInvoiceUserId = numericId;
  renderSelectedInvoiceUser();
  closeInvoiceUserSearchModal();
}

function userMatchesInvoiceSearch(user, term) {
  const normalizedTerm = String(term || '').trim().toLowerCase();
  if (!normalizedTerm) return true;
  const termDigits = onlyDigits(normalizedTerm);
  const haystack = [
    user.nome,
    user.email,
    user.documento,
    user.telefone,
  ].map(value => String(value || '').toLowerCase()).join(' ');
  return haystack.includes(normalizedTerm) || (termDigits && onlyDigits(user.documento).includes(termDigits));
}

function getInvoiceUserValidAmount(user) {
  return getEligibleNotes(user).reduce((total, note) => total + Number(note.valor || 0), 0);
}

function getInvoiceUserLatestNoteDate(user) {
  const dates = (user.notas || [])
    .map(note => note.data ? new Date(note.data + 'T00:00:00').getTime() : 0)
    .filter(Boolean);
  return dates.length ? Math.max(...dates) : 0;
}

function sortInvoiceUsers(users) {
  const sort = invoiceUserSearchState.sort;
  return users.sort((a, b) => {
    if (sort === 'name-desc') return String(b.nome || '').localeCompare(String(a.nome || ''), 'pt-BR');
    if (sort === 'valor-desc') return getInvoiceUserValidAmount(b) - getInvoiceUserValidAmount(a);
    if (sort === 'valor-asc') return getInvoiceUserValidAmount(a) - getInvoiceUserValidAmount(b);
    if (sort === 'date-desc') return getInvoiceUserLatestNoteDate(b) - getInvoiceUserLatestNoteDate(a);
    if (sort === 'date-asc') return getInvoiceUserLatestNoteDate(a) - getInvoiceUserLatestNoteDate(b);
    return String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR');
  });
}

function getFilteredSortedInvoiceUsers() {
  let users = getInvoiceSearchableUsers();

  if (invoiceUserSearchState.search.trim()) {
    users = users.filter(user => userMatchesInvoiceSearch(user, invoiceUserSearchState.search));
  }

  if (invoiceUserSearchState.originFilter !== 'all') {
    users = users.filter(user => (user.origem || 'manual') === invoiceUserSearchState.originFilter);
  }

  return sortInvoiceUsers(users);
}

function renderInvoiceUserSearchPagination(totalItems) {
  const paginationEl = document.getElementById('invoice-user-pagination');
  if (!paginationEl) return;

  const totalPages = Math.max(1, Math.ceil(totalItems / invoiceUserSearchState.perPage));
  if (invoiceUserSearchState.page > totalPages) invoiceUserSearchState.page = totalPages;
  const isEmpty = totalItems === 0;

  paginationEl.innerHTML = `
    <button class="admin-pagination__btn" type="button" data-invoice-user-page="prev"${isEmpty || invoiceUserSearchState.page === 1 ? ' disabled' : ''}>
      ← Anterior
    </button>
    <span class="admin-pagination__info">Página ${invoiceUserSearchState.page} de ${totalPages}</span>
    <button class="admin-pagination__btn" type="button" data-invoice-user-page="next"${isEmpty || invoiceUserSearchState.page === totalPages ? ' disabled' : ''}>
      Próxima →
    </button>
  `;
}

function renderInvoiceUserSearchResults() {
  const resultsEl = document.getElementById('invoice-user-search-results');
  if (!resultsEl) return;

  const users = getFilteredSortedInvoiceUsers();
  const totalPages = Math.max(1, Math.ceil(users.length / invoiceUserSearchState.perPage));
  if (invoiceUserSearchState.page > totalPages) invoiceUserSearchState.page = totalPages;
  const start = (invoiceUserSearchState.page - 1) * invoiceUserSearchState.perPage;
  const pageUsers = users.slice(start, start + invoiceUserSearchState.perPage);
  renderInvoiceUserSearchPagination(users.length);

  if (!pageUsers.length) {
    resultsEl.innerHTML = `
      <div class="invoice-user-search__empty">
        Nenhum usuário encontrado para a busca atual.
      </div>
    `;
    return;
  }

  resultsEl.innerHTML = pageUsers.map(user => `
    <article class="invoice-user-search-card${Number(user.id) === Number(selectedInvoiceUserId) ? ' is-selected' : ''}" role="listitem">
      <div class="invoice-user-search-card__main">
        <div class="invoice-user-search-card__top">
          <strong class="invoice-user-search-card__name">${escapeHtml(user.nome)}</strong>
          ${getOriginBadgeHTML(user)}
        </div>
        <div class="invoice-user-search-card__meta">
          <span>${escapeHtml(user.email || 'E-mail não informado')}</span>
          <span>${escapeHtml(user.documento || 'Documento não informado')}</span>
        </div>
      </div>
      <button class="invoice-user-search-card__btn" type="button" data-invoice-user-select="${user.id}">
        Selecionar
      </button>
    </article>
  `).join('');
}

function resetInvoiceUserSearchFilters() {
  const searchInput = document.getElementById('invoice-user-search');
  const sortSelect = document.getElementById('invoice-user-sort');
  const originSelect = document.getElementById('invoice-user-origin-filter');

  invoiceUserSearchState.search = '';
  invoiceUserSearchState.sort = 'name-asc';
  invoiceUserSearchState.originFilter = 'all';
  invoiceUserSearchState.page = 1;

  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = invoiceUserSearchState.sort;
  if (originSelect) originSelect.value = invoiceUserSearchState.originFilter;

  updateInvoiceUserFilterResetState();
  renderInvoiceUserSearchResults();
  searchInput?.focus();
}

function hasActiveInvoiceUserSearchFilters() {
  return invoiceUserSearchState.search.trim() !== '' ||
    invoiceUserSearchState.originFilter !== 'all' ||
    invoiceUserSearchState.sort !== 'name-asc';
}

function updateInvoiceUserFilterResetState() {
  const resetBtn = document.getElementById('invoice-user-filter-reset');
  if (!resetBtn) return;
  resetBtn.classList.toggle('is-active', hasActiveInvoiceUserSearchFilters());
}

function openInvoiceUserSearchModal() {
  const modal = document.getElementById('modal-invoice-user-search');
  const overlay = document.getElementById('modal-overlay');
  const searchInput = document.getElementById('invoice-user-search');
  const sortSelect = document.getElementById('invoice-user-sort');
  const originSelect = document.getElementById('invoice-user-origin-filter');
  if (!modal) return;

  invoiceUserSearchState.search = '';
  invoiceUserSearchState.sort = 'name-asc';
  invoiceUserSearchState.originFilter = 'all';
  invoiceUserSearchState.page = 1;
  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = invoiceUserSearchState.sort;
  if (originSelect) originSelect.value = invoiceUserSearchState.originFilter;
  updateInvoiceUserFilterResetState();
  renderInvoiceUserSearchResults();
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  if (overlay) { overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden', 'false'); }
  document.body.classList.add('modal-open');
  setTimeout(() => searchInput?.focus(), 0);
}

function closeInvoiceUserSearchModal() {
  const modal = document.getElementById('modal-invoice-user-search');
  if (!modal || !modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');

  const anyOtherOpen = document.querySelector('.modal.is-open');
  if (!anyOtherOpen) {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) { overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden', 'true'); }
    document.body.classList.remove('modal-open');
  }
}

function initInvoiceUserSearchModal() {
  const searchBtn = document.getElementById('invoice-user-search-btn');
  const closeBtn = document.getElementById('invoice-user-search-close');
  const searchInput = document.getElementById('invoice-user-search');
  const sortSelect = document.getElementById('invoice-user-sort');
  const originSelect = document.getElementById('invoice-user-origin-filter');
  const resetBtn = document.getElementById('invoice-user-filter-reset');
  const resultsEl = document.getElementById('invoice-user-search-results');
  const paginationEl = document.getElementById('invoice-user-pagination');
  const modal = document.getElementById('modal-invoice-user-search');

  searchBtn?.addEventListener('click', openInvoiceUserSearchModal);
  closeBtn?.addEventListener('click', closeInvoiceUserSearchModal);
  searchInput?.addEventListener('input', event => {
    invoiceUserSearchState.search = event.target.value || '';
    invoiceUserSearchState.page = 1;
    updateInvoiceUserFilterResetState();
    renderInvoiceUserSearchResults();
  });
  sortSelect?.addEventListener('change', event => {
    invoiceUserSearchState.sort = event.target.value || 'name-asc';
    invoiceUserSearchState.page = 1;
    updateInvoiceUserFilterResetState();
    renderInvoiceUserSearchResults();
  });
  originSelect?.addEventListener('change', event => {
    invoiceUserSearchState.originFilter = event.target.value || 'all';
    invoiceUserSearchState.page = 1;
    updateInvoiceUserFilterResetState();
    renderInvoiceUserSearchResults();
  });
  resetBtn?.addEventListener('click', resetInvoiceUserSearchFilters);
  resultsEl?.addEventListener('click', event => {
    const btn = event.target.closest('[data-invoice-user-select]');
    if (!btn) return;
    selectInvoiceUser(btn.dataset.invoiceUserSelect);
  });
  paginationEl?.addEventListener('click', event => {
    const btn = event.target.closest('[data-invoice-user-page]');
    if (!btn) return;
    const direction = btn.dataset.invoiceUserPage;
    const totalItems = getFilteredSortedInvoiceUsers().length;
    const totalPages = Math.max(1, Math.ceil(totalItems / invoiceUserSearchState.perPage));
    if (direction === 'prev' && invoiceUserSearchState.page > 1) invoiceUserSearchState.page--;
    if (direction === 'next' && invoiceUserSearchState.page < totalPages) invoiceUserSearchState.page++;
    renderInvoiceUserSearchResults();
  });
  modal?.addEventListener('click', event => {
    if (event.target === modal) closeInvoiceUserSearchModal();
  });
}

/* ============================================
   INVOICES — modo admin
   ============================================ */

function initAdminInvoices() {
  const invoiceTitle = document.getElementById('invoice-title');
  if (invoiceTitle) invoiceTitle.textContent = 'Lançar nota fiscal';

  const formCardTitle = document.querySelector('.invoice-form__title');
  if (formCardTitle) formCardTitle.textContent = 'Cadastrar nota para usuário';

  const listTitle = document.querySelector('.invoice-list-col__title');
  if (listTitle) listTitle.textContent = 'Últimas notas lançadas';

  renderAdminInvoiceList();

  const form = document.getElementById('invoice-form');
  const userInput = document.getElementById('invoice-user');
  const valueInput = document.getElementById('invoice-value');
  const fileInput = document.getElementById('invoice-file');
  const cancelBtn = document.getElementById('invoice-cancel');
  const errorEl = document.getElementById('invoice-error');

  if (!form) return;

  updateInvoiceUserFieldVisibility();
  if (cancelBtn) cancelBtn.classList.add('visible');
  syncAdminInvoiceUserSelect();
  initInvoiceUserSearchModal();
  bindInvoiceValueMask(valueInput);

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

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearError();

    const userId = selectedInvoiceUserId || (userInput ? parseInt(userInput.value, 10) : 0);
    const rawValue = (valueInput?.value || '').trim();
    const value = parseMoneyInput(rawValue);
    const file = fileInput?.files?.[0];

    if (!userId || isNaN(userId)) { showError('Selecione um usuário para associar a nota.'); return; }
    if (!rawValue || isNaN(value) || value <= 0) { showError('Informe um valor válido maior que zero.'); return; }
    if (!file) { showError('Selecione um arquivo de nota fiscal (.jpg, .png ou .pdf).'); return; }

    const user = ADMIN_MOCK.find(u => u.id === userId);
    if (!user) return;

    const noteId = Date.now();
    const nota = {
      id: noteId,
      numeroNota: 'NF-A' + String(noteId).slice(-6),
      valor: value,
      data: new Date().toISOString().slice(0, 10),
      status: 'validada',
      origem: 'manual',
      responsavelLancamento: Auth.getName(),
      arquivoNome: file.name,
      luckyNumber: generateLucky(),
      justificativa: null,
    };
    nota.produtos = ensureInvoiceProducts(nota);

    user.notas.unshift(nota);

    const stored = getAdminStorageNotes();
    stored.unshift({ campaignId: getActiveCampaignId(), userId, nota });
    saveAdminStorageNotes(stored);

    form.reset();
    clearSelectedInvoiceUser();
    updateInvoiceUserFieldVisibility();
    clearError();
    renderAdminInvoiceList();
    renderRankingList();
  });

  cancelBtn?.addEventListener('click', () => {
    form.reset();
    clearSelectedInvoiceUser();
    updateInvoiceUserFieldVisibility();
    clearError();
  });
}

function renderAdminInvoiceList() {
  const listEl = document.getElementById('invoice-list');
  const countEl = document.getElementById('invoice-count');
  const stored = ensureAdminStorageLuckyNumbers(getActiveCampaignAdminNotes());

  if (countEl) countEl.textContent = stored.length;
  if (!listEl) return;

  if (!stored.length) {
    listEl.innerHTML = `
      <div class="invoice-empty">
        <div class="invoice-empty__icon" aria-hidden="true">📋</div>
        <p class="invoice-empty__text">Nenhuma nota lançada ainda.<br/>Use o formulário ao lado para cadastrar.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = stored.map(({ userId, nota }) => {
    const user = ADMIN_MOCK.find(u => u.id === userId);
    const userName = user ? user.nome : 'Usuário desconhecido';
    const dataBr = nota.data ? nota.data.split('-').reverse().join('/') : '—';

    return `
      <div class="invoice-item invoice-item--admin" data-id="${nota.id}">
        <div class="invoice-item__header">
          <span class="invoice-item__number">Nota #${nota.numeroNota}</span>
          <div class="invoice-item__header-buttons">
            <span class="invoice-item__lucky" title="Número da sorte">🍀 Número da sorte: ${nota.luckyNumber}</span>
            <span class="invoice-item__status invoice-item__status--${nota.status}">${statusLabelPt(nota.status)}</span>
            <button class="invoice-btn invoice-btn--remove" type="button" data-admin-remove="${nota.id}" aria-label="Excluir nota ${nota.numeroNota}">
              <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div class="invoice-item__body">
          <div class="invoice-item__field">
            <div class="invoice-item__field-label">Usuário</div>
            <div class="invoice-item__field-value">${userName}</div>
          </div>
          <div class="invoice-item__field">
            <div class="invoice-item__field-label">Valor</div>
            <div class="invoice-item__field-value">${fmtCurrency(nota.valor)}</div>
          </div>
          <div class="invoice-item__field">
            <div class="invoice-item__field-label">Data</div>
            <div class="invoice-item__field-value">${dataBr}</div>
          </div>
          <div class="invoice-item__field">
            <div class="invoice-item__field-label">Origem</div>
            <div class="invoice-item__field-value">${origemLabelPt(nota.origem)}</div>
          </div>
          <div class="invoice-item__field">
            <div class="invoice-item__field-label">Arquivo</div>
            <div class="invoice-item__field-value" title="${nota.arquivoNome}">${nota.arquivoNome}</div>
          </div>
          <div class="invoice-item__field">
            <div class="invoice-item__field-label">Responsável</div>
            <div class="invoice-item__field-value">${nota.responsavelLancamento}</div>
          </div>
        </div>
        ${buildInvoiceProductTagsHTML(nota.produtos)}
      </div>
    `;
  }).join('');

  listEl.querySelectorAll('[data-admin-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      removeAdminStorageNote(btn.dataset.adminRemove);
      renderAdminInvoiceList();
      renderRankingList();
      syncInvoiceCardHeight();
    });
  });
}

/* ============================================
   INVOICES — modo usuário comum
   ============================================ */

function renderInvoices() {
  const listEl = document.getElementById('invoice-list');
  const countEl = document.getElementById('invoice-count');
  const invoices = getUserSubmittedInvoices().filter(inv => inv.status === 'aguardando');

  if (countEl) countEl.textContent = invoices.length;
  if (!listEl) return;

  if (!invoices.length) {
    listEl.innerHTML = `
      <div class="invoice-empty">
        <div class="invoice-empty__icon" aria-hidden="true">📋</div>
        <p class="invoice-empty__text">Nenhuma nota cadastrada ainda.<br/>Preencha o formulário ao lado para começar.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = invoices.map(inv => `
    <div class="invoice-item" data-id="${inv.id}">
      <div class="invoice-item__header">
        <span class="invoice-item__number">Nota #${inv.luckyNumber}</span>
        <div class="invoice-item__header-buttons">
          <span class="invoice-item__lucky" title="Número da sorte">🍀 Número da sorte: ${inv.luckyNumber}</span>
          <span class="invoice-item__status invoice-item__status--${inv.status}">${statusLabelPt(inv.status)}</span>
          <button class="invoice-btn invoice-btn--remove" type="button" data-remove="${inv.id}" aria-label="Excluir nota ${inv.luckyNumber}">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div class="invoice-item__body">
        <div class="invoice-item__field">
          <div class="invoice-item__field-label">Valor</div>
          <div class="invoice-item__field-value">${fmtCurrency(inv.value)}</div>
        </div>
        <div class="invoice-item__field">
          <div class="invoice-item__field-label">Data</div>
          <div class="invoice-item__field-value">${inv.date}</div>
        </div>
        <div class="invoice-item__field">
          <div class="invoice-item__field-label">Origem</div>
          <div class="invoice-item__field-value">${origemLabelPt(inv.origem)}</div>
        </div>
        <div class="invoice-item__field">
          <div class="invoice-item__field-label">Arquivo</div>
          <div class="invoice-item__field-value" title="${inv.filename}">${inv.filename}</div>
        </div>
      </div>
      ${buildInvoiceProductTagsHTML(inv.produtos)}
    </div>
  `).join('');

  listEl.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => removeInvoice(btn.dataset.remove));
  });
}

function getUserSubmittedInvoices() {
  return ensureInvoiceDefaults(getInvoices()).map(inv => {
    const adminItem = findSyncedAdminNoteForInvoice(inv);
    if (!adminItem) return inv;
    const productsSource = adminItem.nota.produtos?.length ? adminItem.nota : inv;
    return {
      ...inv,
      status: adminItem.nota.status || inv.status,
      value: Number(adminItem.nota.valor || inv.value || 0),
      date: fmtDate(adminItem.nota.data),
      filename: adminItem.nota.arquivoNome || inv.filename,
      produtos: ensureInvoiceProducts(productsSource),
      adminNoteId: adminItem.nota.id,
    };
  });
}

function buildInvoiceProductTagsHTML(products) {
  const normalized = normalizeInvoiceProducts(products);
  if (!normalized.length) return '';
  return `
    <div class="invoice-item__products" aria-label="Produtos contidos na nota">
      ${normalized.map(product => `<span class="invoice-item__product-tag">${product.nome} x${product.qtd}</span>`).join('')}
    </div>
  `;
}

function initUserInvoices() {
  updateInvoiceUserFieldVisibility();
  renderInvoices();
  window.addEventListener('storage', event => {
    if (event.key !== INVOICE_KEY && event.key !== ADMIN_NOTES_KEY) return;
    renderInvoices();
    refreshUserDashboard();
  });

  const form = document.getElementById('invoice-form');
  const valueInput = document.getElementById('invoice-value');
  const fileInput = document.getElementById('invoice-file');
  const submitBtn = document.getElementById('invoice-submit');
  const cancelBtn = document.getElementById('invoice-cancel');
  const errorEl = document.getElementById('invoice-error');

  if (!form) return;
  bindInvoiceValueMask(valueInput);

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearError();

    const rawValue = (valueInput?.value || '').trim();
    const value = parseMoneyInput(rawValue);
    const file = fileInput?.files?.[0];

    if (!rawValue || isNaN(value) || value <= 0) {
      showError('Informe um valor válido maior que zero.');
      return;
    }

    if (editingId) {
      const invoices = getInvoices();
      const idx = invoices.findIndex(i => i.id === editingId);
      if (idx !== -1) {
        invoices[idx].value = value;
        if (file) invoices[idx].filename = file.name;
        const syncedNote = syncBarbaraInvoiceToAdmin(invoices[idx]);
        invoices[idx].adminNoteId = syncedNote.id;
        invoices[idx].status = syncedNote.status;
        saveInvoices(invoices);
      }
      cancelEdit();
    } else {
      if (!file) { showError('Selecione um arquivo de nota fiscal (.jpg, .png ou .pdf).'); return; }
      const newInvoice = {
        id: 'inv_' + Date.now(),
        value,
        date: new Date().toLocaleDateString('pt-BR'),
        filename: file.name,
        luckyNumber: generateLucky(),
        status: 'aguardando',
        origem: 'manual',
      };
      newInvoice.produtos = ensureInvoiceProducts(newInvoice);
      const invoices = getInvoices();
      const syncedNote = syncBarbaraInvoiceToAdmin(newInvoice);
      newInvoice.adminNoteId = syncedNote.id;
      newInvoice.status = syncedNote.status;
      invoices.unshift(newInvoice);
      saveInvoices(invoices);
      form.reset();
    }

    renderInvoices();
    refreshUserDashboard();
  });

  cancelBtn?.addEventListener('click', cancelEdit);

  function startEdit(id) {
    const inv = getInvoices().find(i => i.id === id);
    if (!inv) return;
    editingId = id;
    if (valueInput) valueInput.value = inv.value;
    if (fileInput) fileInput.value = '';
    if (submitBtn) submitBtn.textContent = 'Salvar Alteração';
    if (cancelBtn) cancelBtn.classList.add('visible');
    clearError();
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function cancelEdit() {
    editingId = null;
    form.reset();
    if (submitBtn) submitBtn.textContent = 'Cadastrar Nota';
    if (cancelBtn) cancelBtn.classList.remove('visible');
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
}

function removeInvoice(id) {
  const invoice = getInvoices().find(i => i.id === id);
  if (invoice) removeAdminStorageNote(invoice.adminNoteId || invoice.id);
  saveInvoices(getInvoices().filter(i => i.id !== id));
  renderInvoices();
  refreshUserDashboard();
}

/* ============================================
   INVOICE CARD HEIGHT
   ============================================ */

function syncInvoiceCardHeight() {
  const layout = document.querySelector('.invoice-layout');
  const formCard = document.querySelector('.invoice-form-card');
  const listCard = document.querySelector('.invoice-list-col');
  if (!layout || !formCard || !listCard) return;

  const sync = () => {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      layout.style.removeProperty('--invoice-card-height');
      return;
    }
    layout.style.setProperty('--invoice-card-height', `${formCard.offsetHeight}px`);
  };

  sync();
  window.addEventListener('resize', sync, { passive: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(sync);
    observer.observe(formCard);
  }
}

/* ============================================
   SCROLL REVEAL
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
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  els.forEach(el => observer.observe(el));
}
