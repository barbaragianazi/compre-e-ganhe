/* ============================================
   ADMIN — Painel Administrativo
   ============================================ */

(function guardAdmin() {
  if (!Auth.isLoggedIn()) { window.location.href = 'index.html'; return; }
  if (Auth.getRole() !== 'admin') { window.location.href = 'area-logada.html'; }
})();

/* ============================================
   MOCK DATA — definido em js/mock-data.js (compartilhado com ranking.html)
   ============================================ */

/* Chave localStorage para notas adicionadas pelo admin via ranking.html */
var ADMIN_NOTES_KEY = 'lp_admin_notes';

function getAdminAddedNotes() {
  try { return JSON.parse(localStorage.getItem(ADMIN_NOTES_KEY) || '[]'); }
  catch(e) { return []; }
}

function mergeAdminNotes() {
  getAdminAddedNotes().forEach(function(item) {
    var user = ADMIN_MOCK.find(function(u) { return u.id === item.userId; });
    if (!user) return;
    var exists = user.notas.some(function(n) { return n.id === item.nota.id; });
    if (!exists) user.notas.push(item.nota);
  });
}


/* ============================================
   STATE
   ============================================ */

var adminState = {
  currentPage:   1,
  PER_PAGE:      6,
  search:        '',
  filterPending: false,
  sort:          'name-asc',
  primaryModal:  null,
  actionModal:   null,
  pendingAction: null,
  activeUserId:  null,
  activeKPIModal: null,
  returnModalId: null,
  kpiModalState: {
    perPage: 6,
    page: 1,
    search: '',
    sort: 'date-desc'
  },
  userNotesModal: {
    activeTab: 'aguardando',
    pages: { aguardando: 1, validada: 1, excluida: 1 },
    PER_PAGE: 3
  }
};

/* ============================================
   HELPERS
   ============================================ */

function getUserStats(user) {
  var aprovadas = 0, excluidas = 0, pendentes = 0, valorValido = 0;
  user.notas.forEach(function(n) {
    if      (n.status === 'validada')   { aprovadas++;  valorValido += n.valor; }
    else if (n.status === 'excluida')   { excluidas++;  }
    else if (n.status === 'aguardando') { pendentes++;  valorValido += n.valor; }
  });
  return { aprovadas: aprovadas, excluidas: excluidas, pendentes: pendentes, valorValido: valorValido };
}

function fmtValor(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtData(iso) {
  var p = iso.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

function initials(nome) {
  var parts = nome.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function findNoteById(id) {
  for (var i = 0; i < ADMIN_MOCK.length; i++) {
    for (var j = 0; j < ADMIN_MOCK[i].notas.length; j++) {
      if (ADMIN_MOCK[i].notas[j].id === id) return ADMIN_MOCK[i].notas[j];
    }
  }
  return null;
}

function statusLabel(s) {
  return { aguardando: 'Aguardando', validada: 'Validada', excluida: 'Excluída' }[s] || s;
}

function canDeleteNote(nota) {
  return nota && nota.status === 'aguardando';
}

function getExclusionJustification(nota) {
  if (nota && nota.justificativa) return nota.justificativa;
  return 'Nota excluída por inconsistência nos dados enviados para validação.';
}

function ensureMockAttachments() {
  ADMIN_MOCK.forEach(function(user) {
    user.notas.forEach(function(nota) {
      if (!nota.arquivoNome) {
        nota.arquivoNome = 'anexo-' + nota.numeroNota.toLowerCase() + '.jpg';
      }
    });
  });
}

function getAttachmentFileLabel(nota) {
  return nota.arquivoNome || 'anexo-' + nota.numeroNota.toLowerCase() + '.jpg';
}

function getMockAttachmentSrc(nota) {
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1280" viewBox="0 0 900 1280">' +
    '<rect width="900" height="1280" fill="#eef2f7"/>' +
    '<rect x="96" y="48" width="708" height="1184" rx="28" fill="#ffffff" stroke="#d8dee8" stroke-width="4"/>' +
    '<text x="450" y="118" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#111827">CUPOM FISCAL MOCKADO</text>' +
    '<text x="450" y="156" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#6b7280">Visualização de anexo da campanha</text>' +
    '<line x1="140" y1="194" x2="760" y2="194" stroke="#e5e7eb" stroke-width="3"/>' +
    '<text x="140" y="248" font-family="Courier New, monospace" font-size="24" fill="#111827">Loja Veterinária Parceira</text>' +
    '<text x="140" y="286" font-family="Courier New, monospace" font-size="20" fill="#4b5563">CNPJ 12.345.678/0001-90</text>' +
    '<text x="140" y="324" font-family="Courier New, monospace" font-size="20" fill="#4b5563">NOTA ' + escapeHtml(nota.numeroNota) + '</text>' +
    '<text x="140" y="362" font-family="Courier New, monospace" font-size="20" fill="#4b5563">EMISSÃO ' + escapeHtml(fmtData(nota.data)) + '</text>' +
    '<line x1="140" y1="404" x2="760" y2="404" stroke="#e5e7eb" stroke-width="3"/>' +
    '<text x="140" y="460" font-family="Courier New, monospace" font-size="22" fill="#111827">1x PRODUTO PARTICIPANTE</text>' +
    '<text x="140" y="496" font-family="Courier New, monospace" font-size="22" fill="#111827">1x MEDICAMENTO VET</text>' +
    '<text x="140" y="532" font-family="Courier New, monospace" font-size="22" fill="#111827">1x ACESSÓRIO PET</text>' +
    '<line x1="140" y1="584" x2="760" y2="584" stroke="#e5e7eb" stroke-width="3"/>' +
    '<text x="140" y="640" font-family="Courier New, monospace" font-size="24" fill="#111827">TOTAL</text>' +
    '<text x="760" y="640" text-anchor="end" font-family="Courier New, monospace" font-size="24" font-weight="700" fill="#111827">' + escapeHtml(fmtValor(nota.valor)) + '</text>' +
    '<text x="140" y="712" font-family="Courier New, monospace" font-size="18" fill="#6b7280">Arquivo: ' + escapeHtml(getAttachmentFileLabel(nota)) + '</text>' +
    '<text x="140" y="748" font-family="Courier New, monospace" font-size="18" fill="#6b7280">Status: ' + escapeHtml(statusLabel(nota.status)) + '</text>' +
    '<rect x="140" y="820" width="620" height="220" rx="16" fill="#f9fafb" stroke="#e5e7eb" stroke-width="2"/>' +
    '<text x="450" y="892" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#6b7280">QR / código de barras ilustrativo</text>' +
    '<g fill="#111827">' +
      '<rect x="184" y="930" width="6" height="78"/><rect x="198" y="910" width="12" height="98"/><rect x="220" y="924" width="8" height="84"/><rect x="236" y="900" width="16" height="108"/><rect x="262" y="934" width="6" height="74"/><rect x="276" y="916" width="10" height="92"/><rect x="296" y="904" width="14" height="104"/><rect x="318" y="930" width="7" height="78"/><rect x="334" y="914" width="11" height="94"/><rect x="354" y="900" width="18" height="108"/><rect x="382" y="926" width="7" height="82"/><rect x="398" y="908" width="12" height="100"/><rect x="420" y="936" width="6" height="72"/><rect x="434" y="900" width="14" height="108"/><rect x="456" y="922" width="8" height="86"/><rect x="472" y="908" width="12" height="100"/><rect x="494" y="934" width="6" height="74"/><rect x="508" y="900" width="16" height="108"/><rect x="534" y="926" width="8" height="82"/><rect x="550" y="910" width="10" height="98"/><rect x="570" y="936" width="6" height="72"/><rect x="584" y="904" width="14" height="104"/><rect x="606" y="920" width="10" height="88"/><rect x="626" y="900" width="18" height="108"/><rect x="654" y="932" width="6" height="76"/><rect x="668" y="914" width="10" height="94"/><rect x="688" y="904" width="14" height="104"/>' +
    '</g>' +
    '</svg>';
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

function parseISODate(iso) {
  return new Date(iso + 'T00:00:00').getTime();
}

function getUserLatestNoteDate(user) {
  if (!user.notas.length) return 0;
  return Math.max.apply(null, user.notas.map(function(n) { return parseISODate(n.data); }));
}

function getSortOptionsMarkup(selectedValue) {
  var options = [
    { value: 'name-asc', label: 'Nome A–Z' },
    { value: 'name-desc', label: 'Nome Z–A' },
    { value: 'valor-desc', label: 'Maior valor' },
    { value: 'valor-asc', label: 'Menor valor' },
    { value: 'date-desc', label: 'Mais recente' },
    { value: 'date-asc', label: 'Mais antigo' }
  ];
  return options.map(function(option) {
    return '<option value="' + option.value + '"' + (option.value === selectedValue ? ' selected' : '') + '>' + option.label + '</option>';
  }).join('');
}

function sortUsers(users, sort) {
  if      (sort === 'name-asc')   users.sort(function(a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); });
  else if (sort === 'name-desc')  users.sort(function(a, b) { return b.nome.localeCompare(a.nome, 'pt-BR'); });
  else if (sort === 'valor-desc') users.sort(function(a, b) { return getUserStats(b).valorValido - getUserStats(a).valorValido; });
  else if (sort === 'valor-asc')  users.sort(function(a, b) { return getUserStats(a).valorValido - getUserStats(b).valorValido; });
  else if (sort === 'date-desc')  users.sort(function(a, b) { return getUserLatestNoteDate(b) - getUserLatestNoteDate(a); });
  else if (sort === 'date-asc')   users.sort(function(a, b) { return getUserLatestNoteDate(a) - getUserLatestNoteDate(b); });
  return users;
}

function sortKPINotes(list, sort) {
  list.sort(function(a, b) {
    if (sort === 'name-asc')  return a.user.nome.localeCompare(b.user.nome, 'pt-BR');
    if (sort === 'name-desc') return b.user.nome.localeCompare(a.user.nome, 'pt-BR');
    if (sort === 'valor-desc') return b.nota.valor - a.nota.valor;
    if (sort === 'valor-asc')  return a.nota.valor - b.nota.valor;
    if (sort === 'date-asc')   return parseISODate(a.nota.data) - parseISODate(b.nota.data);
    return parseISODate(b.nota.data) - parseISODate(a.nota.data);
  });
  return list;
}

/* ============================================
   KPIs
   ============================================ */

function calcKPIs() {
  var r = { totalUsuarios: ADMIN_MOCK.length, totalNotas: 0, totalValor: 0,
            totalAguardando: 0, totalValidada: 0, totalExcluida: 0 };
  ADMIN_MOCK.forEach(function(u) {
    u.notas.forEach(function(n) {
      if      (n.status === 'aguardando') { r.totalNotas++; r.totalAguardando++; r.totalValor += n.valor; }
      else if (n.status === 'validada')   { r.totalNotas++; r.totalValidada++;   r.totalValor += n.valor; }
      else if (n.status === 'excluida')   { r.totalExcluida++; }
    });
  });
  return r;
}

function kpiCard(icon, value, label, cls, onclickFn) {
  var extra  = onclickFn ? ' kpi-card--clickable' : '';
  var attrs  = onclickFn ? ' role="button" tabindex="0" onclick="' + onclickFn + '"' : '';
  var hint   = onclickFn ? '<div class="kpi-card__hint">Ver detalhes →</div>' : '';
  return '<div class="kpi-card ' + cls + extra + '"' + attrs + '>' +
    '<div class="kpi-card__icon">' + icon + '</div>' +
    '<div class="kpi-card__value">' + value + '</div>' +
    '<div class="kpi-card__label">' + label + '</div>' +
    hint + '</div>';
}

function renderKPIs() {
  var k = calcKPIs();
  document.getElementById('admin-kpis').innerHTML =
  kpiCard('⏳', k.totalAguardando,      'Aguardando validação', 'kpi-card--aguardando', 'openKPIAguardandoModal()') +
  kpiCard('✅', k.totalValidada,        'Notas validadas',      'kpi-card--validada',   'openKPIValidadaModal()') +
  kpiCard('🗑️', k.totalExcluida,       'Notas excluídas',      'kpi-card--excluida',   'openKPIExcluidaModal()') + 
    kpiCard('👥', k.totalUsuarios,       'Total de usuários',    'kpi-card--total-usuarios') +
    kpiCard('🧾', k.totalNotas,           'Total de notas',       'kpi-card--total-notas') +
    kpiCard('💰', fmtValor(k.totalValor), 'Valor total enviado',  'kpi-card--valor-total');
}

/* ============================================
   USERS
   ============================================ */

function getFilteredSortedUsers() {
  var search = adminState.search.trim().toLowerCase();
  var users  = ADMIN_MOCK.slice();

  if (search) {
    users = users.filter(function(u) {
      return u.nome.toLowerCase().indexOf(search) !== -1;
    });
  }
  if (adminState.filterPending) {
    users = users.filter(function(u) {
      return u.notas.some(function(n) { return n.status === 'aguardando'; });
    });
  }

  return sortUsers(users, adminState.sort);
}

function buildUserCard(u) {
  var s   = getUserStats(u);
  var pend = s.pendentes > 0;
  var loc  = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
    '<path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5Z" stroke="currentColor" stroke-width="1.5"/>' +
    '<circle cx="8" cy="6" r="1.5" stroke="currentColor" stroke-width="1.5"/></svg>' +
    u.cidade + ', ' + u.estado;

  return '<div class="user-card' + (pend ? ' user-card--pending' : '') + '" data-user-id="' + u.id + '">' +
    '<div class="user-card__avatar">' + initials(u.nome) + '</div>' +
    '<div class="user-card__body">' +
      '<div class="user-card__name-row">' +
        '<span class="user-card__name">' + u.nome + '</span>' +
        (pend ? '<span class="user-badge user-badge--pending">Pendente</span>' : '') +
      '</div>' +
      '<div class="user-card__email">' + u.email + '</div>' +
      '<div class="user-card__location">' + loc + '</div>' +
    '</div>' +
    '<div class="user-card__counts">' +
      '<div class="user-card__count user-card__count--aprov">' +
        '<span class="user-card__count-val">' + s.aprovadas + '</span>' +
        '<span class="user-card__count-lbl">' + (s.aprovadas === 1 ? 'aprovada' : 'aprovadas') + '</span>' +
      '</div>' +
      '<div class="user-card__count user-card__count--pend">' +
        '<span class="user-card__count-val">' + s.pendentes + '</span>' +
        '<span class="user-card__count-lbl">' + (s.pendentes === 1 ? 'pendente' : 'pendentes') + '</span>' +
      '</div>' +
      '<div class="user-card__count user-card__count--excl">' +
        '<span class="user-card__count-val">' + s.excluidas + '</span>' +
        '<span class="user-card__count-lbl">' + (s.excluidas === 1 ? 'excluída' : 'excluídas') + '</span>' +
      '</div>' +
    '</div>' +
    '<div class="user-card__value-col">' +
      '<span class="user-card__value-num">' + fmtValor(s.valorValido) + '</span>' +
      '<button class="btn btn--outline btn--sm user-card__btn" type="button" onclick="verNotas(' + u.id + ')">Ver notas</button>' +
      '</div>' +
  '</div>';
}

function renderUsers() {
  var users      = getFilteredSortedUsers();
  var totalPages = users.length > 0 ? Math.ceil(users.length / adminState.PER_PAGE) : 1;
  if (adminState.currentPage > totalPages) adminState.currentPage = totalPages;

  var start     = (adminState.currentPage - 1) * adminState.PER_PAGE;
  var pageUsers = users.slice(start, start + adminState.PER_PAGE);
  var gridEl    = document.getElementById('admin-users-grid');

  if (users.length === 0) {
    gridEl.innerHTML = '<div class="admin-empty" role="status" aria-live="polite">' +
      '<div class="admin-empty__icon">🔍</div>' +
      '<p class="admin-empty__text">Nenhum participante encontrado.</p>' +
      '</div>';
    document.getElementById('admin-page-info').textContent = 'Sem resultados';
    document.getElementById('admin-prev').disabled = true;
    document.getElementById('admin-next').disabled = true;
    return;
  }

  gridEl.innerHTML = pageUsers.map(buildUserCard).join('');
  document.getElementById('admin-page-info').textContent = 'Página ' + adminState.currentPage + ' de ' + totalPages;
  document.getElementById('admin-prev').disabled = adminState.currentPage === 1;
  document.getElementById('admin-next').disabled = adminState.currentPage === totalPages;
}

/* ============================================
   MODAL SYSTEM
   ============================================ */

function openPrimaryModal(id) {
  if (adminState.primaryModal) {
    var current = document.getElementById(adminState.primaryModal);
    if (current) {
      current.classList.remove('is-open');
      current.setAttribute('aria-hidden', 'true');
    }
  }
  adminState.primaryModal = id;
  var el = document.getElementById(id);
  el.classList.add('is-open');
  el.removeAttribute('aria-hidden');
  document.getElementById('modal-overlay').classList.add('is-open');
  document.body.classList.add('modal-open');
}

function closePrimaryModal() {
  if (!adminState.primaryModal) return;
  var el = document.getElementById(adminState.primaryModal);
  var closingModalId = adminState.primaryModal;
  el.classList.remove('is-open');
  el.setAttribute('aria-hidden', 'true');
  if (closingModalId === 'modal-note-preview' && adminState.returnModalId) {
    var returnModal = document.getElementById(adminState.returnModalId);
    adminState.primaryModal = adminState.returnModalId;
    adminState.returnModalId = null;
    if (returnModal) {
      returnModal.classList.add('is-open');
      returnModal.removeAttribute('aria-hidden');
    }
    return;
  }

  adminState.primaryModal = null;
  adminState.activeUserId = null;
  adminState.returnModalId = null;
  if (closingModalId === 'modal-kpi-aguardando' || closingModalId === 'modal-kpi-validada' || closingModalId === 'modal-kpi-excluida') {
    adminState.activeKPIModal = null;
  }
  if (!adminState.actionModal) {
    document.getElementById('modal-overlay').classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }
}

function openActionModal(id) {
  if (adminState.actionModal) closeActionModal();
  adminState.actionModal = id;
  var el = document.getElementById(id);
  el.classList.add('is-open');
  el.removeAttribute('aria-hidden');
  document.getElementById('modal-overlay').classList.add('is-open');
  document.body.classList.add('modal-open');
}

function closeActionModal() {
  if (!adminState.actionModal) return;
  var el = document.getElementById(adminState.actionModal);
  el.classList.remove('is-open');
  el.setAttribute('aria-hidden', 'true');
  adminState.actionModal  = null;
  adminState.pendingAction = null;
  if (!adminState.primaryModal) {
    document.getElementById('modal-overlay').classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }
}

/* ============================================
   USER NOTES MODAL
   ============================================ */

function verNotas(userId) {
  adminState.activeUserId = userId;
  adminState.userNotesModal.activeTab = 'aguardando';
  adminState.userNotesModal.pages = { aguardando: 1, validada: 1, excluida: 1 };
  renderUserNotesModal(userId);
  openPrimaryModal('modal-user-notes');
}

function renderUserNotesModal(userId) {
  var user = ADMIN_MOCK.find(function(u) { return u.id === userId; });
  if (!user) return;
  document.getElementById('modal-user-notes-title').textContent = 'Notas de ' + user.nome;
  document.getElementById('modal-user-notes-body').innerHTML = buildNotesTabsUI(user);
}

function buildNotesTabsUI(user) {
  var state = adminState.userNotesModal;
  var groups = {
    aguardando: user.notas.filter(function(n) { return n.status === 'aguardando'; }),
    validada:   user.notas.filter(function(n) { return n.status === 'validada'; }),
    excluida:   user.notas.filter(function(n) { return n.status === 'excluida'; })
  };

  var activeTab  = state.activeTab;
  var activeNotes = groups[activeTab];
  var page = state.pages[activeTab];
  var total = activeNotes.length;
  var totalPages = total > 0 ? Math.ceil(total / state.PER_PAGE) : 1;
  if (page > totalPages) { state.pages[activeTab] = 1; page = 1; }

  var start     = (page - 1) * state.PER_PAGE;
  var pageNotes = activeNotes.slice(start, start + state.PER_PAGE);

  var tabsNav = '<div class="notes-tabs__nav" role="tablist">' +
    buildNoteTabButton('aguardando', 'Aguardando validação', groups.aguardando.length, activeTab) +
    buildNoteTabButton('validada',   'Validadas',            groups.validada.length,   activeTab) +
    buildNoteTabButton('excluida',   'Excluídas',            groups.excluida.length,   activeTab) +
    '</div>';

  var notesList = '';
  if (total === 0) {
    notesList = '<p class="notes-empty">Nenhuma nota nesta categoria.</p>';
  } else {
    var canValidate = activeTab === 'aguardando';
    var canDelete   = activeTab === 'aguardando';
    var canPreview  = activeTab === 'excluida';
    notesList = '<div class="notes-list">' + pageNotes.map(function(n) {
      return buildNoteItem(n, canValidate, canDelete, canPreview);
    }).join('') + '</div>';
  }

  return '<div class="notes-tabs">' +
    tabsNav +
    '<div class="notes-tabs__content">' + notesList + '</div>' +
    buildUserNotesPagination(page, totalPages, total) +
  '</div>';
}

function buildNoteTabButton(tab, label, count, activeTab) {
  var isActive = tab === activeTab;
  return '<button class="notes-tab notes-tab--' + tab + (isActive ? ' is-active' : '') + '" ' +
    'data-notes-tab="' + tab + '" role="tab" aria-selected="' + isActive + '" type="button">' +
    escapeHtml(label) + ' <span class="notes-tab__count">(' + count + ')</span>' +
  '</button>';
}

function buildUserNotesPagination(page, totalPages, total) {
  var isEmpty = total === 0;
  return '<div class="admin-pagination admin-pagination--modal">' +
    '<button class="admin-pagination__btn" type="button" data-notes-page="prev"' + (isEmpty || page === 1 ? ' disabled' : '') + '>← Anterior</button>' +
    '<span class="admin-pagination__info">Página ' + page + ' de ' + totalPages + '</span>' +
    '<button class="admin-pagination__btn" type="button" data-notes-page="next"' + (isEmpty || page === totalPages ? ' disabled' : '') + '>Próxima →</button>' +
  '</div>';
}

function buildNoteItem(nota, canValidate, canDelete, canPreview) {
  var canShowActions = canValidate || canDelete || (canPreview !== false && nota.arquivoNome);
  var actions = '';
  if (canShowActions) {
    actions = '<div class="note-item__actions">';
    actions += '<button class="btn-note btn-note--attachment" type="button" data-note-action="preview" data-note-id="' + nota.id + '">Visualizar</button>';
    if (canDelete)   actions += '<button class="btn-note btn-note--delete" type="button" data-note-action="delete" data-note-id="' + nota.id + '">Excluir</button>';
    if (canValidate) actions += '<button class="btn-note btn-note--validate" type="button" data-note-action="validate" data-note-id="' + nota.id + '">Validar</button>';
    actions += '</div>';
  }

  var details = '<div class="note-item__details">' +
    '<div class="note-detail"><span class="note-detail__label">Valor</span><span class="note-detail__value note-detail__value--valor">' + fmtValor(nota.valor) + '</span></div>' +
    '<div class="note-detail"><span class="note-detail__label">Data</span><span class="note-detail__value">' + fmtData(nota.data) + '</span></div>' +
    '<div class="note-detail"><span class="note-detail__label">Responsável</span><span class="note-detail__value">' + nota.responsavelLancamento + '</span></div>' +
    '<div class="note-detail"><span class="note-detail__label">Arquivo</span><span class="note-detail__value note-detail__value--file"><i class="fa-solid fa-paperclip" aria-hidden="true"></i> ' + getAttachmentFileLabel(nota) + '</span></div>' +
    '</div>';

  var justif = nota.status === 'excluida'
    ? '<div class="note-item__justificativa"><span class="note-item__just-label">Justificativa da exclusão:</span> <span class="note-item__just-text">' + escapeHtml(getExclusionJustification(nota)) + '</span></div>'
    : '';

  return '<div class="note-item note-item--' + nota.status + '">' +
    '<div class="note-item__header">' +
      '<div class="note-item__meta">' +
        '<span class="note-item__number">' + nota.numeroNota + '</span>' +
      '</div>' +
      actions +
    '</div>' +
    details + justif +
  '</div>';
}

/* ============================================
   KPI MODALS
   ============================================ */

function openKPIAguardandoModal() {
  openKPIModal('aguardando');
}

function openKPIValidadaModal() {
  openKPIModal('validada');
}

function openKPIExcluidaModal() {
  openKPIModal('excluida');
}

function openKPIModal(type) {
  adminState.activeKPIModal = type;
  resetKPIModalState();
  renderActiveKPIModal();
  openPrimaryModal(getKPIModalId(type));
}

function resetKPIModalState() {
  adminState.kpiModalState.page = 1;
  adminState.kpiModalState.search = '';
  adminState.kpiModalState.sort = 'date-desc';
}

function getKPIModalId(type) {
  return {
    aguardando: 'modal-kpi-aguardando',
    validada: 'modal-kpi-validada',
    excluida: 'modal-kpi-excluida'
  }[type];
}

function getKPIModalBodyId(type) {
  return {
    aguardando: 'modal-kpi-aguardando-body',
    validada: 'modal-kpi-validada-body',
    excluida: 'modal-kpi-excluida-body'
  }[type];
}

function getKPIModalTitle(type) {
  return {
    aguardando: 'Notas aguardando validação',
    validada: 'Notas validadas',
    excluida: 'Notas excluídas'
  }[type];
}

function getKPINotesByType(type) {
  var list = [];
  ADMIN_MOCK.forEach(function(u) {
    u.notas.forEach(function(n) {
      if (n.status === type) list.push({ nota: n, user: u });
    });
  });
  return list;
}

function getFilteredSortedKPINotes(type) {
  var state = adminState.kpiModalState;
  var search = state.search.trim().toLowerCase();
  var list = getKPINotesByType(type);

  if (search) {
    list = list.filter(function(item) {
      return item.user.nome.toLowerCase().indexOf(search) !== -1;
    });
  }

  return sortKPINotes(list, state.sort);
}

function renderActiveKPIModal() {
  if (!adminState.activeKPIModal) return;
  renderKPIModal(adminState.activeKPIModal);
}

function renderKPIModal(type) {
  var state = adminState.kpiModalState;
  var list = getFilteredSortedKPINotes(type);
  var totalItems = list.length;
  var totalPages = totalItems > 0 ? Math.ceil(totalItems / state.perPage) : 1;
  if (state.page > totalPages) state.page = totalPages;

  var start = (state.page - 1) * state.perPage;
  var pageItems = list.slice(start, start + state.perPage);
  var body = document.getElementById(getKPIModalBodyId(type));

  body.innerHTML = '<div class="kpi-modal-content">' +
    buildKPIModalControls(type, totalItems) +
    '<div class="kpi-modal-results">' +
      buildKPIModalList(type, pageItems, totalItems) +
    '</div>' +
    buildKPIModalPagination(totalPages, totalItems) +
  '</div>';
}

function buildKPIModalControls(type, totalItems) {
  var state = adminState.kpiModalState;

  return '<div class="kpi-modal-tools">' +
    '<div class="kpi-modal-tools__top">' +
      '<div class="admin-search admin-search--modal">' +
        '<div class="admin-search__wrap">' +
          '<svg class="admin-search__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
            '<circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"></circle>' +
            '<path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>' +
          '</svg>' +
          '<input type="search" class="admin-search__input" data-kpi-search="' + type + '" placeholder="Buscar por nome do participante" value="' + escapeHtml(state.search) + '" autocomplete="off" aria-label="Buscar participante por nome">' +
        '</div>' +
      '</div>' +
      '<div class="admin-controls admin-controls--modal">' +
        '<label class="admin-sort-label" for="kpi-sort-' + type + '">Ordenar por</label>' +
        '<select class="admin-sort-select" id="kpi-sort-' + type + '" data-kpi-sort="' + type + '" aria-label="Ordenar notas">' +
          getSortOptionsMarkup(state.sort) +
        '</select>' +
      '</div>' +
    '</div>' +
    '</div>' +
  '</div>';
}

function buildKPIModalList(type, pageItems, totalItems) {
  if (totalItems === 0) {
    return '<div class="modal-empty modal-empty--compact"><p>Nenhuma nota encontrada para os filtros aplicados.</p></div>';
  }

  return '<div class="kpi-notes-list">' + pageItems.map(function(item) {
    return buildKPINoteItem(item.nota, item.user, type === 'aguardando');
  }).join('') + '</div>';
}

function buildKPIModalPagination(totalPages, totalItems) {
  var state = adminState.kpiModalState;
  var isEmpty = totalItems === 0;
  return '<div class="admin-pagination admin-pagination--modal">' +
    '<button class="admin-pagination__btn" type="button" data-kpi-page="prev"' + (isEmpty || state.page === 1 ? ' disabled' : '') + '>← Anterior</button>' +
    '<span class="admin-pagination__info">Página ' + state.page + ' de ' + totalPages + '</span>' +
    '<button class="admin-pagination__btn" type="button" data-kpi-page="next"' + (isEmpty || state.page === totalPages ? ' disabled' : '') + '>Próxima →</button>' +
  '</div>';
}

function renderKPIAguardandoModal() {
  renderKPIModal('aguardando');
}

function renderKPIValidadaModal() {
  renderKPIModal('validada');
}

function renderKPIExcluidaModal() {
  renderKPIModal('excluida');
}

function changeKPIModalPage(direction) {
  var totalItems = getFilteredSortedKPINotes(adminState.activeKPIModal).length;
  var totalPages = totalItems > 0 ? Math.ceil(totalItems / adminState.kpiModalState.perPage) : 1;
  if (direction === 'prev' && adminState.kpiModalState.page > 1) adminState.kpiModalState.page--;
  if (direction === 'next' && adminState.kpiModalState.page < totalPages) adminState.kpiModalState.page++;
  renderActiveKPIModal();
}

function openAttachmentPreview(noteId) {
  var note = findNoteById(noteId);
  if (!note) return;
  adminState.returnModalId = adminState.primaryModal;
  document.getElementById('modal-note-preview-title').textContent = 'Visualizar anexo da ' + note.numeroNota;
  document.getElementById('note-preview-meta').innerHTML =
    '<span class="attachment-preview__file"><i class="fa-solid fa-paperclip" aria-hidden="true"></i> ' + getAttachmentFileLabel(note) + '</span>' +
    '<span class="attachment-preview__amount">' + fmtValor(note.valor) + '</span>';
  document.getElementById('note-preview-image').src = getMockAttachmentSrc(note);
  document.getElementById('note-preview-image').alt = 'Prévia mockada do anexo da nota ' + note.numeroNota;
  openPrimaryModal('modal-note-preview');
}

function openDeleteNoteModal(noteId) {
  var note = findNoteById(noteId);
  if (!canDeleteNote(note)) return;
  adminState.pendingAction = { noteId: noteId };
  document.getElementById('delete-justificativa').value = '';
  document.getElementById('delete-justificativa-error').hidden = true;
  openActionModal('modal-delete-note');
}

function buildKPINoteItem(nota, user, canValidate) {
  var deleteAction = canValidate && canDeleteNote(nota)
    ? '<button class="btn-note btn-note--delete" type="button" data-note-action="delete" data-note-id="' + nota.id + '">Excluir</button>'
    : '';
  var validateAction = canValidate
    ? '<button class="btn-note btn-note--validate" type="button" data-note-action="validate" data-note-id="' + nota.id + '">Validar</button>'
    : '';
  var justif = nota.status === 'excluida'
    ? '<div class="kpi-note__justificativa"><span class="kpi-note__just-label">Justificativa:</span> <span class="kpi-note__just-text">' + escapeHtml(getExclusionJustification(nota)) + '</span></div>'
    : '';
  var arquivo = '<span class="kpi-note__file"><i class="fa-solid fa-paperclip" aria-hidden="true"></i> ' + getAttachmentFileLabel(nota) + '</span>';
  var actions = '<div class="kpi-note__actions">' +
    '<button class="btn-note btn-note--attachment" type="button" data-note-action="preview" data-note-id="' + nota.id + '">Visualizar</button>' +
    deleteAction +
    validateAction +
  '</div>';

  return '<div class="kpi-note kpi-note--' + nota.status + '">' +
    '<div class="kpi-note__user">' +
      '<div class="kpi-note__avatar">' + initials(user.nome) + '</div>' +
      '<div class="kpi-note__user-info">' +
        '<div class="kpi-note__user-name">' + user.nome + '</div>' +
        '<div class="kpi-note__user-loc">' + user.cidade + ', ' + user.estado + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="kpi-note__meta">' +
      '<div class="kpi-note__meta-main">' +
        '<span class="kpi-note__number">' + nota.numeroNota + '</span>' +
        '<span class="kpi-note__value">' + fmtValor(nota.valor) + '</span>' +
      '</div>' +
      '<div class="kpi-note__meta-sub">' +
        '<span class="kpi-note__resp">Resp.: ' + nota.responsavelLancamento + '</span>' +
        '<span class="kpi-note__date">' + fmtData(nota.data) + '</span>' +
      '</div>' +
      arquivo +
    '</div>' +
    actions + justif +
  '</div>';
}

/* ============================================
   REFRESH ALL
   ============================================ */

function refreshAll() {
  renderKPIs();
  renderUsers();
  if (adminState.primaryModal === 'modal-user-notes' && adminState.activeUserId) {
    renderUserNotesModal(adminState.activeUserId);
  }
  if (adminState.primaryModal === 'modal-kpi-aguardando') renderKPIAguardandoModal();
  if (adminState.primaryModal === 'modal-kpi-validada')   renderKPIValidadaModal();
  if (adminState.primaryModal === 'modal-kpi-excluida')   renderKPIExcluidaModal();
}

/* ============================================
   EVENTS
   ============================================ */

document.getElementById('admin-search').addEventListener('input', function() {
  adminState.search = this.value;
  adminState.currentPage = 1;
  renderUsers();
});

document.getElementById('admin-filter-pending').addEventListener('change', function() {
  adminState.filterPending = this.checked;
  adminState.currentPage = 1;
  renderUsers();
});

document.getElementById('admin-sort').addEventListener('change', function() {
  adminState.sort = this.value;
  adminState.currentPage = 1;
  renderUsers();
});

document.getElementById('admin-prev').addEventListener('click', function() {
  if (adminState.currentPage > 1) { adminState.currentPage--; renderUsers(); }
});

document.getElementById('admin-next').addEventListener('click', function() {
  var total = Math.ceil(getFilteredSortedUsers().length / adminState.PER_PAGE);
  if (adminState.currentPage < total) { adminState.currentPage++; renderUsers(); }
});

/* Modal close buttons */
document.querySelectorAll('.modal__close').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var m = btn.closest('.modal');
    if (!m) return;
    if (adminState.actionModal  === m.id) closeActionModal();
    else if (adminState.primaryModal === m.id) closePrimaryModal();
  });
});

/* Click outside dialog */
document.querySelectorAll('.modal').forEach(function(m) {
  m.addEventListener('click', function(e) {
    if (e.target !== m) return;
    if (adminState.actionModal  === m.id) closeActionModal();
    else if (adminState.primaryModal === m.id) closePrimaryModal();
  });
});

/* Overlay click */
document.getElementById('modal-overlay').addEventListener('click', function() {
  if (adminState.actionModal)  closeActionModal();
  else if (adminState.primaryModal) closePrimaryModal();
});

/* Escape key */
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  if (adminState.actionModal)  closeActionModal();
  else if (adminState.primaryModal) closePrimaryModal();
});

/* KPI cards — keyboard activation */
document.getElementById('admin-kpis').addEventListener('keydown', function(e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  var card = e.target.closest('[role="button"]');
  if (card) { e.preventDefault(); card.click(); }
});

/* User notes modal — tab, pagination and action delegation */
document.getElementById('modal-user-notes-body').addEventListener('click', function(e) {
  var tabBtn = e.target.closest('[data-notes-tab]');
  if (tabBtn) {
    var tab = tabBtn.getAttribute('data-notes-tab');
    adminState.userNotesModal.activeTab = tab;
    adminState.userNotesModal.pages[tab] = 1;
    renderUserNotesModal(adminState.activeUserId);
    return;
  }

  var pageBtn = e.target.closest('[data-notes-page]');
  if (pageBtn) {
    var dir       = pageBtn.getAttribute('data-notes-page');
    var state     = adminState.userNotesModal;
    var user      = ADMIN_MOCK.find(function(u) { return u.id === adminState.activeUserId; });
    if (user) {
      var notes      = user.notas.filter(function(n) { return n.status === state.activeTab; });
      var totalPages = notes.length > 0 ? Math.ceil(notes.length / state.PER_PAGE) : 1;
      if (dir === 'prev' && state.pages[state.activeTab] > 1)          state.pages[state.activeTab]--;
      if (dir === 'next' && state.pages[state.activeTab] < totalPages) state.pages[state.activeTab]++;
    }
    renderUserNotesModal(adminState.activeUserId);
    return;
  }

  var btn = e.target.closest('[data-note-action]');
  if (!btn) return;
  var action = btn.getAttribute('data-note-action');
  var noteId = parseInt(btn.getAttribute('data-note-id'), 10);
  if (action === 'validate') {
    adminState.pendingAction = { noteId: noteId };
    openActionModal('modal-confirm-validate');
  } else if (action === 'delete') {
    openDeleteNoteModal(noteId);
  } else if (action === 'preview') {
    openAttachmentPreview(noteId);
  }
});

/* KPI aguardando modal — action delegation */
document.getElementById('modal-kpi-aguardando-body').addEventListener('click', function(e) {
  var btn = e.target.closest('[data-note-action]');
  if (!btn) return;
  var action = btn.getAttribute('data-note-action');
  var noteId = parseInt(btn.getAttribute('data-note-id'), 10);
  if (action === 'preview') {
    openAttachmentPreview(noteId);
    return;
  }
  if (action === 'delete') {
    openDeleteNoteModal(noteId);
    return;
  }
  adminState.pendingAction = { noteId: noteId };
  openActionModal('modal-confirm-validate');
});

['modal-kpi-aguardando-body', 'modal-kpi-validada-body', 'modal-kpi-excluida-body'].forEach(function(id) {
  document.getElementById(id).addEventListener('input', function(e) {
    var input = e.target.closest('[data-kpi-search]');
    if (!input) return;
    adminState.kpiModalState.search = input.value;
    adminState.kpiModalState.page = 1;
    renderActiveKPIModal();
  });

  document.getElementById(id).addEventListener('change', function(e) {
    var select = e.target.closest('[data-kpi-sort]');
    if (!select) return;
    adminState.kpiModalState.sort = select.value;
    adminState.kpiModalState.page = 1;
    renderActiveKPIModal();
  });

  document.getElementById(id).addEventListener('click', function(e) {
    var previewBtn = e.target.closest('[data-note-action="preview"]');
    if (previewBtn) {
      openAttachmentPreview(parseInt(previewBtn.getAttribute('data-note-id'), 10));
      return;
    }
    var pageBtn = e.target.closest('[data-kpi-page]');
    if (pageBtn) {
      changeKPIModalPage(pageBtn.getAttribute('data-kpi-page'));
      return;
    }
  });
});

/* Confirm validate */
document.getElementById('btn-confirm-validate').addEventListener('click', function() {
  if (!adminState.pendingAction) return;
  var note = findNoteById(adminState.pendingAction.noteId);
  if (note) note.status = 'validada';
  closeActionModal();
  refreshAll();
});

document.getElementById('btn-cancel-validate').addEventListener('click', closeActionModal);

/* Confirm delete */
document.getElementById('btn-confirm-delete').addEventListener('click', function() {
  var justificativa = document.getElementById('delete-justificativa').value.trim();
  var errorEl = document.getElementById('delete-justificativa-error');
  if (!justificativa) { errorEl.hidden = false; return; }
  if (!adminState.pendingAction) return;
  var note = findNoteById(adminState.pendingAction.noteId);
  if (!canDeleteNote(note)) {
    closeActionModal();
    return;
  }
  note.status = 'excluida';
  note.justificativa = justificativa;
  closeActionModal();
  refreshAll();
});

document.getElementById('btn-cancel-delete').addEventListener('click', closeActionModal);

document.getElementById('delete-justificativa').addEventListener('input', function() {
  if (this.value.trim()) document.getElementById('delete-justificativa-error').hidden = true;
});

document.getElementById('btn-note-preview-back').addEventListener('click', closePrimaryModal);

/* Mobile nav */
var menuToggle = document.querySelector('.header__menu-toggle');
var mobileNav  = document.querySelector('.mobile-nav');
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', function() {
    var isOpen = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* Header scroll shadow */
window.addEventListener('scroll', function() {
  document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ============================================
   INIT
   ============================================ */

ThemeSwitcher.init();
Auth.initUserMenu();
mergeAdminNotes();
ensureMockAttachments();
renderKPIs();
renderUsers();
