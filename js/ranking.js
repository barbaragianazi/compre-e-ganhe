/* ============================================
   RANKING PAGE — Interactions
   ============================================ */

/* ——— Static mock data (usuário comum) ——— */

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

const KPIS = [
  {
    id: 'points',
    label: 'Pontos acumulados',
    current: 6750,
    goal: 15850,
    formatText: (c, g) =>
      `${c.toLocaleString('pt-BR')} / ${g.toLocaleString('pt-BR')} pontos`,
  },
  {
    id: 'value',
    label: 'Meta de compras',
    current: 7500,
    goal: 10000,
    formatText: (c, g) =>
      `R$ ${c.toLocaleString('pt-BR', { minimumFractionDigits: 0 })} / R$ ${g.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
  },
  {
    id: 'qty',
    label: 'Quantidade de compras',
    current: 25,
    goal: 40,
    formatText: (c, g) => `${c} / ${g} compras`,
  },
  {
    id: 'frequency',
    label: 'Frequência semanal',
    current: 4,
    goal: 5,
    formatText: (c, g) => `${c} / ${g} compras por semana`,
  },
];

const INVOICE_KEY = 'lp_invoices';
const ADMIN_NOTES_KEY = 'lp_admin_notes';

let editingId = null;  /* tracks invoice being edited (usuário comum) */
let isAdminMode = false; /* definido no DOMContentLoaded */

/* ============================================
   INIT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  guardRoute();
  isAdminMode = Auth.getRole() === 'admin';

  ThemeSwitcher.init();
  initHeader();
  Auth.initUserMenu();
  populateUserInfo();

  if (isAdminMode) applyAdminRankingMode();

  renderRankingList();
  initKPISelector();
  initInvoices();
  syncInvoiceCardHeight();
  initScrollReveal();
});

/* ============================================
   ROUTE GUARD
   ============================================ */

function guardRoute() {
  if (!Auth.isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

/* ============================================
   HEADER — scroll shadow + mobile nav + logout
   ============================================ */

function initHeader() {
  const header = document.querySelector('.header') || document.querySelector('.ranking-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile toggle */
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

  /* Logout — any element with data-logout */
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', () => {
      Auth.logout();
      window.location.href = 'index.html';
    });
  });
}

/* ============================================
   USER INFO — populate data-* placeholders
   ============================================ */

function populateUserInfo() {
  const name = Auth.getName();
  const initials = Auth.getInitials();
  const email = Auth.getEmail() || '';
  const firstName = name.split(' ')[0];

  document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = name; });
  document.querySelectorAll('[data-user-first]').forEach(el => { el.textContent = firstName; });
  document.querySelectorAll('[data-user-email]').forEach(el => { el.textContent = email; });
  document.querySelectorAll('[data-user-initials]').forEach(el => { el.textContent = initials; });
}

/* ============================================
   ADMIN RANKING MODE — adapta UI para admin
   ============================================ */

function applyAdminRankingMode() {
  /* Troca título da página */
  const titleEl = document.getElementById('ranking-page-title');
  if (titleEl) {
    titleEl.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.replace('Ranking geral e minha performance', 'Ranking geral');
      }
    });
  }

  /* Oculta painel "Minha Performance" e expande lista para largura total */
  const perfCol = document.querySelector('.performance-col');
  if (perfCol) perfCol.hidden = true;

  const rankingLayout = document.querySelector('.ranking-layout');
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

  if (isAdminMode) {
    renderAdminRanking(listEl);
    return;
  }

  /* Stagger delay capped at 5 */
  listEl.innerHTML = RANKING_DATA.map(item => `
    <li class="ranking-item ${positionClass(item.position)} reveal reveal-delay-${Math.min(item.position, 5)}"
        aria-label="${item.position}º lugar: ${item.name}">
      <div class="ranking-item__medal" aria-hidden="true">
        ${positionMedal(item.position)}
      </div>
      <div class="ranking-item__info">
        <div class="ranking-item__name">${item.name}</div>
        <div class="ranking-item__location">${item.location}</div>
      </div>
      <div class="ranking-item__score">
        <div class="ranking-item__points">${item.points.toLocaleString('pt-BR')}</div>
        <div class="ranking-item__points-label">pontos</div>
      </div>
    </li>
  `).join('');
}

/* Ranking admin: top 10 por valor de notas validadas */
function renderAdminRanking(listEl) {
  const storedAdminNotes = getAdminStorageNotes();

  const userTotals = ADMIN_MOCK.map(user => {
    /* notas adicionadas via ranking.html para este usuário */
    const extraNotes = storedAdminNotes
      .filter(item => item.userId === user.id)
      .map(item => item.nota);

    const allNotes = [...user.notas, ...extraNotes];
    const total = allNotes
      .filter(n => n.status === 'validada')
      .reduce((sum, n) => sum + n.valor, 0);

    return { user, total };
  });

  userTotals.sort((a, b) => b.total - a.total);
  const top10 = userTotals.slice(0, 10);

  listEl.innerHTML = top10.map((item, idx) => {
    const pos = idx + 1;
    return `
      <li class="ranking-item ${positionClass(pos)} reveal reveal-delay-${Math.min(pos, 5)}"
          aria-label="${pos}º lugar: ${item.user.nome}">
        <div class="ranking-item__medal" aria-hidden="true">${positionMedal(pos)}</div>
        <div class="ranking-item__info">
          <div class="ranking-item__name">${item.user.nome}</div>
          <div class="ranking-item__location">${item.user.cidade}, ${item.user.estado}</div>
        </div>
        <div class="ranking-item__score">
          <div class="ranking-item__points">${fmtCurrency(item.total)}</div>
          <div class="ranking-item__points-label">em notas validadas</div>
        </div>
      </li>
    `;
  }).join('');
}

/* ============================================
   KPI SELECTOR — progress bar (usuário comum)
   ============================================ */

function initKPISelector() {
  /* Admin: painel já está oculto, sem necessidade de inicializar */
  if (isAdminMode) return;

  const select = document.getElementById('kpi-select');
  const barFill = document.getElementById('kpi-bar-fill');
  const barPct = document.getElementById('kpi-pct');
  const barText = document.getElementById('kpi-text');
  const kpiName = document.getElementById('kpi-name');

  if (!select || !barFill) return;

  /* Build <option> list from KPIS array */
  KPIS.forEach((kpi, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = kpi.label;
    select.appendChild(opt);
  });

  function applyKPI(index) {
    const kpi = KPIS[Number(index)];
    if (!kpi) return;

    const pct = Math.min(100, (kpi.current / kpi.goal) * 100);

    if (kpiName) kpiName.textContent = kpi.label;
    if (barPct) barPct.textContent = Math.round(pct) + '%';
    if (barText) barText.textContent = kpi.formatText(kpi.current, kpi.goal);

    /* Reset to 0 then animate to target */
    barFill.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        barFill.style.width = pct + '%';
      });
    });
  }

  select.addEventListener('change', () => applyKPI(select.value));

  /* Trigger initial KPI on load (slight delay so CSS transition fires) */
  setTimeout(() => applyKPI(0), 200);
}

/* ============================================
   INVOICES — CRUD + localStorage
   ============================================ */

/* --- Helpers localStorage usuário comum --- */
function getInvoices() {
  try {
    return JSON.parse(localStorage.getItem(INVOICE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveInvoices(invoices) {
  localStorage.setItem(INVOICE_KEY, JSON.stringify(invoices));
}

/* --- Helpers localStorage notas do admin --- */
function getAdminStorageNotes() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_NOTES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveAdminStorageNotes(notes) {
  localStorage.setItem(ADMIN_NOTES_KEY, JSON.stringify(notes));
}

function removeAdminStorageNote(noteId) {
  const numericId = Number(noteId);
  const stored = getAdminStorageNotes();
  const noteItem = stored.find(item => Number(item.nota.id) === numericId);
  const nextStored = stored.filter(item => Number(item.nota.id) !== numericId);

  saveAdminStorageNotes(nextStored);

  if (noteItem) {
    const user = ADMIN_MOCK.find(u => u.id === noteItem.userId);
    if (user) {
      user.notas = user.notas.filter(nota => Number(nota.id) !== numericId);
    }
  }
}

/* --- Formatação --- */
function generateLucky() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

function fmtCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function statusLabelPt(s) {
  return { aguardando: 'Aguardando', validada: 'Validada', excluida: 'Excluída' }[s] || s;
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

    if (!next.luckyNumber) {
      next.luckyNumber = generateLucky();
      changed = true;
    }

    if (!next.status) {
      next.status = 'aguardando';
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
    return {
      ...item,
      nota: {
        ...item.nota,
        luckyNumber: generateLucky(),
      },
    };
  });

  if (changed) saveAdminStorageNotes(normalized);
  return normalized;
}

/* ============================================
   INVOICES — roteador admin vs usuário
   ============================================ */

function initInvoices() {
  if (isAdminMode) {
    initAdminInvoices();
  } else {
    initUserInvoices();
  }
}

/* ============================================
   INVOICES — modo admin
   ============================================ */

function initAdminInvoices() {
  /* Adapta títulos da seção */
  const invoiceTitle = document.getElementById('invoice-title');
  if (invoiceTitle) invoiceTitle.textContent = 'Lançar nota fiscal';

  const formCardTitle = document.querySelector('.invoice-form__title');
  if (formCardTitle) formCardTitle.textContent = 'Cadastrar nota para usuário';

  const listTitle = document.querySelector('.invoice-list-col__title');
  if (listTitle) listTitle.textContent = 'Últimas notas lançadas';

  renderAdminInvoiceList();

  const form = document.getElementById('invoice-form');
  const userField = document.getElementById('invoice-user-field');
  const userSelect = document.getElementById('invoice-user');
  const valueInput = document.getElementById('invoice-value');
  const fileInput = document.getElementById('invoice-file');
  const cancelBtn = document.getElementById('invoice-cancel');
  const errorEl = document.getElementById('invoice-error');

  if (!form) return;

  /* Exibe dropdown de usuários e botão cancelar */
  if (userField) userField.hidden = false;
  if (cancelBtn) cancelBtn.classList.add('visible');

  /* Popula dropdown com usuários do ADMIN_MOCK */
  if (userSelect) {
    ADMIN_MOCK.forEach(user => {
      const opt = document.createElement('option');
      opt.value = user.id;
      opt.textContent = user.nome;
      userSelect.appendChild(opt);
    });
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

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearError();

    const userId = userSelect ? parseInt(userSelect.value, 10) : 0;
    const rawValue = (valueInput?.value || '').trim();
    const value = parseFloat(rawValue.replace(',', '.').replace(/[^\d.]/g, ''));
    const file = fileInput?.files?.[0];

    if (!userId || isNaN(userId)) {
      showError('Selecione um usuário para associar a nota.');
      return;
    }

    if (!rawValue || isNaN(value) || value <= 0) {
      showError('Informe um valor válido maior que zero.');
      return;
    }

    if (!file) {
      showError('Selecione um arquivo de nota fiscal (.jpg, .png ou .pdf).');
      return;
    }

    const user = ADMIN_MOCK.find(u => u.id === userId);
    if (!user) return;

    const noteId = Date.now();
    const nota = {
      id: noteId,
      numeroNota: 'NF-A' + String(noteId).slice(-6),
      valor: value,
      data: new Date().toISOString().slice(0, 10),
      status: 'aguardando',
      responsavelLancamento: Auth.getName(),
      arquivoNome: file.name,
      luckyNumber: generateLucky(),
      justificativa: null,
    };

    /* Adiciona ao ADMIN_MOCK em memória (visível na sessão atual) */
    user.notas.unshift(nota);

    /* Persiste para que admin.html consuma na próxima visita */
    const stored = getAdminStorageNotes();
    stored.unshift({ userId, nota });
    saveAdminStorageNotes(stored);

    form.reset();
    /* Garante que o dropdown continua visível após reset do form */
    if (userField) userField.hidden = false;

    clearError();
    renderAdminInvoiceList();
  });

  cancelBtn?.addEventListener('click', () => {
    form.reset();
    if (userField) userField.hidden = false;
    clearError();
  });
}

function renderAdminInvoiceList() {
  const listEl = document.getElementById('invoice-list');
  const countEl = document.getElementById('invoice-count');
  const stored = ensureAdminStorageLuckyNumbers(getAdminStorageNotes());

  if (countEl) countEl.textContent = stored.length;
  if (!listEl) return;

  if (!stored.length) {
    listEl.innerHTML = `
      <div class="invoice-empty">
        <div class="invoice-empty__icon" aria-hidden="true">📋</div>
        <p class="invoice-empty__text">
          Nenhuma nota lançada ainda.<br/>
          Use o formulário ao lado para cadastrar.
        </p>
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
            <div class="invoice-item__field-label">Arquivo</div>
            <div class="invoice-item__field-value" title="${nota.arquivoNome}">${nota.arquivoNome}</div>
          </div>
          <div class="invoice-item__field">
            <div class="invoice-item__field-label">Responsável</div>
            <div class="invoice-item__field-value">${nota.responsavelLancamento}</div>
          </div>
        </div>
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
  const invoices = ensureInvoiceDefaults(getInvoices());

  if (countEl) countEl.textContent = invoices.length;
  if (!listEl) return;

  if (!invoices.length) {
    listEl.innerHTML = `
      <div class="invoice-empty">
        <div class="invoice-empty__icon" aria-hidden="true">📋</div>
        <p class="invoice-empty__text">
          Nenhuma nota cadastrada ainda.<br/>
          Preencha o formulário ao lado para começar.
        </p>
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
          <div class="invoice-item__actions">
            <button class="invoice-btn invoice-btn--remove" type="button" data-remove="${inv.id}" aria-label="Remover nota ${inv.luckyNumber}">
              <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
          </div>
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
          <div class="invoice-item__field-label">Arquivo</div>
          <div class="invoice-item__field-value" title="${inv.filename}">${inv.filename}</div>
        </div>


      </div>
    </div>
  `).join('');

  /* Attach per-item handlers after render */
  listEl.querySelectorAll('[data-edit]').forEach(btn =>
    btn.addEventListener('click', () => startEdit(btn.dataset.edit))
  );
  listEl.querySelectorAll('[data-remove]').forEach(btn =>
    btn.addEventListener('click', () => removeInvoice(btn.dataset.remove))
  );
}

function initUserInvoices() {
  const userField = document.getElementById('invoice-user-field');
  const userSelect = document.getElementById('invoice-user');

  if (userField) userField.hidden = true;
  if (userSelect) userSelect.value = '';

  renderInvoices();

  const form = document.getElementById('invoice-form');
  const valueInput = document.getElementById('invoice-value');
  const fileInput = document.getElementById('invoice-file');
  const submitBtn = document.getElementById('invoice-submit');
  const cancelBtn = document.getElementById('invoice-cancel');
  const errorEl = document.getElementById('invoice-error');

  if (!form) return;

  /* Submit */
  form.addEventListener('submit', e => {
    e.preventDefault();
    clearError();

    const rawValue = (valueInput?.value || '').trim();
    const value = parseFloat(rawValue.replace(',', '.').replace(/[^\d.]/g, ''));
    const file = fileInput?.files?.[0];

    if (!rawValue || isNaN(value) || value <= 0) {
      showError('Informe um valor válido maior que zero.');
      return;
    }

    if (editingId) {
      /* EDIT mode — file is optional */
      const invoices = getInvoices();
      const idx = invoices.findIndex(i => i.id === editingId);
      if (idx !== -1) {
        invoices[idx].value = value;
        if (file) invoices[idx].filename = file.name;
        saveInvoices(invoices);
      }
      cancelEdit();
    } else {
      /* NEW invoice — file required */
      if (!file) {
        showError('Selecione um arquivo de nota fiscal (.jpg, .png ou .pdf).');
        return;
      }
      const newInvoice = {
        id: 'inv_' + Date.now(),
        value: value,
        date: new Date().toLocaleDateString('pt-BR'),
        filename: file.name,
        luckyNumber: generateLucky(),
        status: 'aguardando',
      };
      const invoices = getInvoices();
      invoices.unshift(newInvoice);  /* newest first */
      saveInvoices(invoices);
      form.reset();
    }

    renderInvoices();
  });

  cancelBtn?.addEventListener('click', cancelEdit);

  /* ——— helpers scoped to initUserInvoices ——— */

  function startEdit(id) {
    const inv = getInvoices().find(i => i.id === id);
    if (!inv) return;

    editingId = id;
    if (valueInput) valueInput.value = inv.value;
    if (fileInput) fileInput.value = '';
    if (submitBtn) submitBtn.textContent = 'Salvar Alteração';
    if (cancelBtn) cancelBtn.classList.add('visible');
    clearError();

    /* Scroll form into view */
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
  const updated = getInvoices().filter(i => i.id !== id);
  saveInvoices(updated);
  renderInvoices();
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
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  els.forEach(el => observer.observe(el));
}
