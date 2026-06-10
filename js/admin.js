/* ============================================
   ADMIN — Painel Administrativo
   ============================================ */

(function guardAdmin() {
  if (!Auth.isLoggedIn()) { window.location.href = 'area-logada.html'; return; }
  if (Auth.getRole() !== 'admin') { window.location.href = 'area-logada.html'; }
})();

/* ============================================
   MOCK DATA — definido em js/mock-data.js (compartilhado com ranking.html)
   ============================================ */

/* Chave localStorage para notas adicionadas pelo admin via ranking.html */
var ADMIN_NOTES_KEY = 'lp_admin_notes';
var INVOICE_KEY = 'lp_invoices';
var ADMIN_IMPORTED_USERS_KEY = 'lp_admin_imported_users';
var ADMIN_BASE_MOCK = JSON.parse(JSON.stringify(ADMIN_MOCK));
var ADMIN_CAMPAIGN_KEY = 'lp_admin_selected_campaign';
var DEFAULT_CAMPAIGN_ID = 'simparic-trio';
var PRODUCT_NAMES = ['Simparic', 'Apoquel', 'Vanguard Plus'];
var PRODUCT_UNIT_PRICES = {
  Simparic: 185,
  Apoquel: 195,
  'Vanguard Plus': 180,
};
var BARBARA_USER = {
  id: 170,
  nome: 'Bárbara Gianazi',
  email: 'barbara.gianazi@email.com',
  documento: '123.456.789-09',
  telefone: '(14) 99999-0000',
  cidade: 'Bauru',
  estado: 'SP'
};

function normalizeAdminInvoiceProducts(products) {
  if (!Array.isArray(products)) return [];
  return products
    .map(function (product) {
      var name = product.nome || product.name;
      var qtd = Math.max(0, parseInt(product.qtd || product.quantity || 0, 10) || 0);
      if (PRODUCT_NAMES.indexOf(name) === -1 || qtd <= 0) return null;
      return {
        nome: name,
        qtd: qtd,
        valorUnit: Number(product.valorUnit || product.unitValue || PRODUCT_UNIT_PRICES[name]),
      };
    })
    .filter(Boolean);
}

function getAdminInvoiceProductSeed(invoice) {
  var raw = String(invoice && (invoice.id || invoice.numeroNota || invoice.luckyNumber || invoice.arquivoNome || invoice.filename) || 'nota');
  return raw.split('').reduce(function (acc, char) {
    return ((acc * 31) + char.charCodeAt(0)) >>> 0;
  }, 7);
}

function simulateAdminInvoiceProducts(invoice) {
  var value = Math.max(0, Number(invoice && (invoice.valor || invoice.value) || 0));
  var seed = getAdminInvoiceProductSeed(invoice);
  var orderedNames = PRODUCT_NAMES
    .map(function (name, index) { return { name: name, rank: (seed + index * 17) % PRODUCT_NAMES.length }; })
    .sort(function (a, b) { return a.rank - b.rank; })
    .map(function (item) { return item.name; });
  var totals = PRODUCT_NAMES.reduce(function (acc, name) {
    acc[name] = 0;
    return acc;
  }, {});
  var remaining = value;
  var guard = 0;

  while (remaining >= 180 && guard < 80) {
    var nextName = orderedNames.find(function (name) { return PRODUCT_UNIT_PRICES[name] <= remaining + 0.01; });
    if (!nextName) break;
    totals[nextName] += 1;
    remaining -= PRODUCT_UNIT_PRICES[nextName];
    guard += 1;
  }

  if (!Object.keys(totals).some(function (name) { return totals[name] > 0; })) {
    totals[orderedNames[seed % orderedNames.length]] = 1;
  }

  return PRODUCT_NAMES
    .filter(function (name) { return totals[name] > 0; })
    .map(function (name) { return { nome: name, qtd: totals[name], valorUnit: PRODUCT_UNIT_PRICES[name] }; });
}

function ensureAdminInvoiceProducts(invoice) {
  var normalized = normalizeAdminInvoiceProducts(invoice && invoice.produtos);
  return normalized.length ? normalized : simulateAdminInvoiceProducts(invoice);
}

var ADMIN_CAMPAIGNS = [
  { id: 'simparic-trio', title: 'Simparic Trio — Compre & Ganhe', category: 'brindes', label: 'Brindes', validity: '31/12/2026', desc: 'Acumule pontos para resgatar brindes exclusivos.', factor: 1.00, image: 'assets/images/simparic-trio.png', cardClass: 'promo-card--c1', badgeClass: 'brindes', participants: '1.204', captured: 'R$ 284k' },
  { id: 'apoquel', title: 'Apoquel — Bonificação Progressiva', category: 'bonificacao', label: 'Bonificação', validity: '30/11/2026', desc: 'Bonificação por volume de compras e metas atingidas.', factor: 0.82, image: 'assets/images/apoquel.png', cardClass: 'promo-card--c2', badgeClass: 'bonificacao', participants: '876', captured: 'R$ 198k' },
  { id: 'vanguard-plus', title: 'Vanguard Plus — Dose Extra', category: 'compre-ganhe ending', label: 'Compre e ganhe', validity: '15/10/2026', desc: 'Doses adicionais para ampliar a cobertura vacinal.', factor: 0.64, image: 'assets/images/vanguard.jpg', cardClass: 'promo-card--c3', badgeClass: 'compre-ganhe', participants: '532', captured: 'R$ 96k' },
  { id: 'revolution-plus', title: 'Revolution Plus — Prêmios para Felinos', category: 'brindes', label: 'Brindes', validity: '31/12/2026', desc: 'Troque pontos por prêmios selecionados para felinos.', factor: 0.58, image: 'assets/images/revolution-plus.webp', cardClass: 'promo-card--c4', badgeClass: 'brindes', participants: '445', captured: 'R$ 112k' },
  { id: 'cerenia', title: 'Cerenia — Bônus por Volume', category: 'bonificacao ending', label: 'Bonificação', validity: '20/10/2026', desc: 'Créditos para próximas compras ao atingir metas.', factor: 0.46, image: 'assets/images/cerenia.webp', cardClass: 'promo-card--c5', badgeClass: 'bonificacao', participants: '318', captured: 'R$ 74k' },
  { id: 'convenia', title: 'Convenia — Kit Clínica', category: 'compre-ganhe', label: 'Compre e ganhe', validity: '31/12/2026', desc: 'Materiais e equipamentos de apoio clínico.', factor: 0.72, image: 'assets/images/convenia.png', cardClass: 'promo-card--c6', badgeClass: 'compre-ganhe', participants: '621', captured: 'R$ 143k' }
];

var CAMPAIGN_FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'bonificacao', label: 'Bonificação' },
  { id: 'brindes', label: 'Brindes' },
  { id: 'compre-ganhe', label: 'Compre e ganhe' },
  { id: 'ending', label: 'Termina em breve' }
];

var CAMPAIGN_NAMES = {
  'simparic-trio': ['Carlos Eduardo Silva', 'Marina Silva Costa', 'Roberto Oliveira Santos', 'Juliana Costa Pereira', 'Fernando Almeida Souza', 'Camila Ferreira Santos', 'Gustavo Ribeiro Almeida', 'Amanda Pereira Lima', 'Paulo Mendes Rocha', 'Beatriz Gomes Martins', 'Lucas Ferreira Gomes', 'Sophia Martins Souza', 'Rafael Almeida Costa', 'Larissa Ribeiro Santos', 'Henrique Oliveira Lima', 'Daniela Costa Fernandes'],
  apoquel: ['Ana Luiza Martins', 'Bruno Carvalho Reis', 'Clara Mendes Alves', 'Diego Nogueira Lima', 'Elisa Prado Rocha', 'Felipe Antunes Moraes', 'Gabriela Torres Campos', 'Igor Santana Freire', 'Joana Vieira Castro', 'Leandro Pires Cunha', 'Manuela Batista Leal', 'Nicolas Ramos Teixeira', 'Olivia Duarte Farias', 'Pedro Henrique Matos', 'Renata Assis Moreira', 'Tiago Barbosa Neves'],
  'vanguard-plus': ['Aline Furtado Melo', 'Bernardo Cunha Lopes', 'Carolina Braga Reis', 'Danilo Martins Xavier', 'Eduarda Lima Paiva', 'Fabio Correia Dutra', 'Giovana Rocha Teles', 'Helena Sampaio Castro', 'Isabela França Moura', 'Jorge Melo Batista', 'Karen Nunes Prado', 'Leonardo Sales Amaral', 'Marcela Viana Pinto', 'Otavio Barros Lins', 'Patricia Gomes Rocha', 'Vinicius Costa Braga'],
  'revolution-plus': ['Alice Tavares Pinho', 'Breno Moura Duarte', 'Cecilia Matos Ribeiro', 'Davi Almeida Farias', 'Estela Freitas Gomes', 'Flavio Vieira Ramos', 'Heloisa Cardoso Lima', 'Iuri Campos Nobre', 'Julia Andrade Neves', 'Kaio Ferreira Torres', 'Laura Barbosa Cunha', 'Miguel Castro Reis', 'Natalia Prado Leite', 'Orlando Pires Rocha', 'Paula Nascimento Melo', 'Sergio Moreira Alves'],
  cerenia: ['Amanda Xavier Teles', 'Caio Ribeiro Nunes', 'Debora Sales Prado', 'Enzo Farias Melo', 'Fernanda Lopes Vieira', 'Guilherme Rocha Cunha', 'Iara Batista Campos', 'Jonas Leal Correia', 'Livia Duarte Sampaio', 'Mateus Costa Pinho', 'Nicole Freire Martins', 'Pietro Moura Reis', 'Raquel Gomes Tavares', 'Samuel Alves Matos', 'Talita Prado Neves', 'Yasmin Ferreira Lima'],
  convenia: ['Arthur Lima Barros', 'Bianca Moreira Sales', 'Cristina Prado Gomes', 'Eduardo Campos Leal', 'Flora Teixeira Rocha', 'Heitor Pires Castro', 'Ingrid Cunha Batista', 'Jose Henrique Souza', 'Leticia Ramos Paiva', 'Murilo Neves Almeida', 'Nathalia Freitas Reis', 'Rafaela Moraes Lima', 'Sandro Vieira Prado', 'Teresa Lopes Farias', 'Valentina Nobre Alves', 'William Rocha Duarte']
};

var activeCampaignId = localStorage.getItem(ADMIN_CAMPAIGN_KEY) || 'simparic-trio';
var campaignFilter = 'all';
var campaignPage = 1;
var CAMPAIGN_PER_PAGE = 6;

function getAdminAddedNotes() {
  try {
    var stored = JSON.parse(localStorage.getItem(ADMIN_NOTES_KEY) || '[]');
    var changed = false;
    var normalized = stored.map(function (item) {
      if (!item || !item.nota) return item;
      var products = ensureAdminInvoiceProducts(item.nota);
      if (JSON.stringify(normalizeAdminInvoiceProducts(item.nota.produtos)) === JSON.stringify(products)) return item;
      changed = true;
      return Object.assign({}, item, { nota: Object.assign({}, item.nota, { produtos: products }) });
    });
    if (changed) saveAdminAddedNotes(normalized);
    return normalized;
  }
  catch (e) { return []; }
}

function saveAdminAddedNotes(notes) {
  localStorage.setItem(ADMIN_NOTES_KEY, JSON.stringify(notes));
}

function noteBelongsToActiveCampaign(item) {
  return (item && item.campaignId ? item.campaignId : DEFAULT_CAMPAIGN_ID) === activeCampaignId;
}

function mergeAdminNotes() {
  getAdminAddedNotes().filter(noteBelongsToActiveCampaign).forEach(function (item) {
    var user = ADMIN_MOCK.find(function (u) { return u.id === item.userId; });
    if (!user) return;
    var existingIndex = user.notas.findIndex(function (n) { return String(n.id) === String(item.nota.id); });
    if (existingIndex === -1) user.notas.push(item.nota);
    else user.notas[existingIndex] = Object.assign({}, user.notas[existingIndex], item.nota);
  });
}

function getBarbaraLocalInvoices() {
  try { return JSON.parse(localStorage.getItem(INVOICE_KEY) || '[]'); }
  catch (e) { return []; }
}

function saveBarbaraLocalInvoices(invoices) {
  localStorage.setItem(INVOICE_KEY, JSON.stringify(invoices));
}

function parsePtBrDateToISO(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  var parts = String(value).split('/');
  if (parts.length === 3) return parts[2] + '-' + parts[1] + '-' + parts[0];
  return new Date().toISOString().slice(0, 10);
}

function syncBarbaraLocalInvoicesToAdmin() {
  var user = ensureBarbaraAdminUser();
  var invoices = getBarbaraLocalInvoices();
  var stored = getAdminAddedNotes();
  var invoicesChanged = false;
  var storedChanged = false;

  var syncedInvoices = invoices.map(function (invoice) {
    var existingIndex = stored.findIndex(function (item) {
      return noteBelongsToActiveCampaign(item) &&
        Number(item.userId) === Number(user.id) &&
        (String(item.nota && item.nota.id) === String(invoice.adminNoteId || invoice.id) ||
          String(item.nota && item.nota.sourceInvoiceId) === String(invoice.id));
    });
    var noteId = invoice.adminNoteId || invoice.id;
    var existingNote = existingIndex === -1 ? null : stored[existingIndex].nota;
    var initialStatus = ['validada', 'aprovada'].indexOf(invoice.status) !== -1
      ? 'validada'
      : (invoice.status === 'excluida' ? 'excluida' : 'aguardando');
    var products = existingNote && normalizeAdminInvoiceProducts(existingNote.produtos).length
      ? normalizeAdminInvoiceProducts(existingNote.produtos)
      : ensureAdminInvoiceProducts(invoice);
    var nota = {
      id: noteId,
      sourceInvoiceId: invoice.id,
      numeroNota: invoice.numeroNota || 'NF-' + (invoice.luckyNumber || String(invoice.id).slice(-6)),
      valor: Number(invoice.value || invoice.valor || 0),
      data: parsePtBrDateToISO(invoice.date || invoice.data),
      status: existingNote ? (existingNote.status || initialStatus) : initialStatus,
      origem: invoice.origem || 'manual',
      estabelecimento: invoice.estabelecimento || 'Nota lançada por Bárbara',
      responsavelLancamento: BARBARA_USER.nome,
      arquivoNome: invoice.filename || invoice.arquivoNome || 'Arquivo não informado',
      luckyNumber: invoice.luckyNumber,
      justificativa: existingNote ? (existingNote.justificativa || null) : null,
      produtos: products
    };
    var item = { campaignId: activeCampaignId || DEFAULT_CAMPAIGN_ID, userId: user.id, nota: nota };

    if (existingIndex === -1) {
      stored.unshift(item);
      storedChanged = true;
    } else {
      stored[existingIndex] = Object.assign({}, stored[existingIndex], item);
      storedChanged = true;
    }

    var invoiceProducts = normalizeAdminInvoiceProducts(invoice.produtos);
    if (
      invoice.adminNoteId === nota.id &&
      invoice.status === nota.status &&
      JSON.stringify(invoiceProducts) === JSON.stringify(products)
    ) return invoice;
    invoicesChanged = true;
    return Object.assign({}, invoice, {
      adminNoteId: nota.id,
      status: nota.status,
      produtos: products
    });
  });

  if (storedChanged) saveAdminAddedNotes(stored);
  if (invoicesChanged) saveBarbaraLocalInvoices(syncedInvoices);
}

function mergeImportedUsersIntoAdminMock() {
  var importedUsers = getImportedUsersStorage();
  if (!importedUsers.length) return;

  importedUsers.forEach(function (imported) {
    var importedDoc = onlyDigits(imported.documento);
    if (!importedDoc) return;

    var existingByDoc = ADMIN_MOCK.find(function (user) {
      return onlyDigits(user.documento) === importedDoc;
    });

    if (existingByDoc) {
      existingByDoc.nome = imported.nome || existingByDoc.nome;
      existingByDoc.documento = normalizeDocumento(imported.documento || existingByDoc.documento);
      existingByDoc.email = imported.email || existingByDoc.email;
      existingByDoc.telefone = normalizeTelefone(imported.telefone || existingByDoc.telefone);
      existingByDoc.cidade = imported.cidade || existingByDoc.cidade || '';
      existingByDoc.estado = imported.estado || existingByDoc.estado || '';
      existingByDoc.notificarWhatsapp = Boolean(imported.notificarWhatsapp);
      existingByDoc.notificarEmail = Boolean(imported.notificarEmail);
      existingByDoc.origem = 'csv';
      existingByDoc.origemDetalhada = imported.origemDetalhada || existingByDoc.origemDetalhada;
      existingByDoc.dataCriacao = imported.dataCriacao || existingByDoc.dataCriacao;
      existingByDoc.dataUltimaAtualizacao = imported.dataUltimaAtualizacao || existingByDoc.dataUltimaAtualizacao;
      return;
    }

    var importedId = parseInt(imported.id, 10);
    var existingById = ADMIN_MOCK.find(function (user) { return user.id === importedId; });
    var nextId = importedId && !existingById ? importedId : getNextUserId();

    ADMIN_MOCK.push({
      id: nextId,
      nome: imported.nome || 'Usuário importado',
      documento: normalizeDocumento(imported.documento || ''),
      email: imported.email || '',
      telefone: normalizeTelefone(imported.telefone || ''),
      cidade: imported.cidade || '',
      estado: imported.estado || '',
      notificarWhatsapp: Boolean(imported.notificarWhatsapp),
      notificarEmail: Boolean(imported.notificarEmail),
      origem: 'csv',
      dataCriacao: imported.dataCriacao || nowISO(),
      dataUltimaAtualizacao: imported.dataUltimaAtualizacao || nowISO(),
      origemDetalhada: imported.origemDetalhada || 'Importação CSV',
      notas: []
    });
  });
}

function getBarbaraImportedUserRecord() {
  var now = nowISO();
  return {
    id: BARBARA_USER.id,
    nome: BARBARA_USER.nome,
    documento: normalizeDocumento(BARBARA_USER.documento),
    email: BARBARA_USER.email,
    telefone: normalizeTelefone(BARBARA_USER.telefone),
    cidade: BARBARA_USER.cidade,
    estado: BARBARA_USER.estado,
    origem: 'manual',
    dataCriacao: now,
    dataUltimaAtualizacao: now,
    origemDetalhada: 'Usuária comum sincronizada'
  };
}

function ensureBarbaraImportedUserStorage() {
  var users = getImportedUsersStorage();
  var barbaraDoc = onlyDigits(BARBARA_USER.documento);
  var idx = users.findIndex(function (user) {
    return onlyDigits(user.documento) === barbaraDoc || String(user.email || '').toLowerCase() === BARBARA_USER.email;
  });
  var record = getBarbaraImportedUserRecord();
  if (idx === -1) users.push(record);
  else users[idx] = Object.assign({}, users[idx], record);
  saveImportedUsersStorage(users);
}

function ensureBarbaraAdminUser() {
  ensureBarbaraImportedUserStorage();
  var barbaraDoc = onlyDigits(BARBARA_USER.documento);
  var user = ADMIN_MOCK.find(function (item) {
    return onlyDigits(item.documento) === barbaraDoc || String(item.email || '').toLowerCase() === BARBARA_USER.email;
  });

  if (!user) {
    user = Object.assign(getBarbaraImportedUserRecord(), { notas: [] });
    ADMIN_MOCK.push(user);
  } else {
    Object.assign(user, getBarbaraImportedUserRecord());
    if (!Array.isArray(user.notas)) user.notas = [];
  }
  return user;
}

function getActiveCampaign() {
  return ADMIN_CAMPAIGNS.find(function (c) { return c.id === activeCampaignId; }) || ADMIN_CAMPAIGNS[0];
}

function buildCampaignMock(campaign) {
  if (campaign.id === 'simparic-trio') return JSON.parse(JSON.stringify(ADMIN_BASE_MOCK));

  var names = CAMPAIGN_NAMES[campaign.id] || CAMPAIGN_NAMES['simparic-trio'];
  var statusCycle = ['validada', 'aguardando', 'validada', 'excluida', 'validada', 'aguardando'];
  var cityCycle = [
    ['São Paulo', 'SP'], ['Rio de Janeiro', 'RJ'], ['Belo Horizonte', 'MG'], ['Curitiba', 'PR'],
    ['Recife', 'PE'], ['Fortaleza', 'CE'], ['Florianópolis', 'SC'], ['Salvador', 'BA']
  ];

  return ADMIN_BASE_MOCK.map(function (user, userIndex) {
    var city = cityCycle[(userIndex + campaign.id.length) % cityCycle.length];
    return {
      id: user.id,
      nome: names[userIndex] || user.nome,
      email: campaign.id + '.' + user.id + '@email.com',
      documento: '',
      telefone: '',
      origem: 'manual',
      dataCriacao: '2026-01-01T08:00:00.000Z',
      dataUltimaAtualizacao: '2026-01-01T08:00:00.000Z',
      origemDetalhada: 'Cadastro manual - 01/01/2026 08:00',
      cidade: city[0],
      estado: city[1],
      notas: user.notas.map(function (nota, noteIndex) {
        var status = statusCycle[(noteIndex + userIndex + campaign.id.length) % statusCycle.length];
        var value = Math.round((nota.valor * campaign.factor + ((userIndex + 1) * 43) + (noteIndex * 17)) * 100) / 100;
        var month = String(((noteIndex + campaign.id.length) % 5) + 1).padStart(2, '0');
        var day = String(((noteIndex * 3 + userIndex) % 26) + 1).padStart(2, '0');

        return {
          id: (ADMIN_CAMPAIGNS.findIndex(function (c) { return c.id === campaign.id; }) + 1) * 100000 + nota.id,
          numeroNota: campaign.id.slice(0, 3).toUpperCase() + '-' + String(user.id).padStart(2, '0') + '-' + String(noteIndex + 1).padStart(3, '0'),
          valor: value,
          data: '2026-' + month + '-' + day,
          status: status,
          responsavelLancamento: names[userIndex] || user.nome,
          arquivoNome: campaign.id + '-nf-' + String(user.id).padStart(2, '0') + '-' + String(noteIndex + 1).padStart(3, '0') + '.jpg',
          justificativa: status === 'excluida' ? 'Nota não atende às regras da campanha ' + campaign.title + '.' : null
        };
      })
    };
  });
}

function applyCampaign(campaignId) {
  var nextCampaign = ADMIN_CAMPAIGNS.find(function (c) { return c.id === campaignId; }) || ADMIN_CAMPAIGNS[0];
  activeCampaignId = nextCampaign.id;
  localStorage.setItem(ADMIN_CAMPAIGN_KEY, activeCampaignId);
  ADMIN_MOCK = buildCampaignMock(getActiveCampaign());
  ensureUserFields();
  mergeImportedUsersIntoAdminMock();
  ensureBarbaraAdminUser();
  syncBarbaraLocalInvoicesToAdmin();
  mergeAdminNotes();
  ensureMockAttachments();
  adminState.currentPage = 1;
  adminState.search = '';
  adminState.filterPending = false;
  adminState.originFilter = 'all';
  adminState.sort = 'date-desc';
  adminState.activeKPIModal = null;
  adminState.activeUserId = null;
  recentImportedUserIds = [];
  document.getElementById('admin-origin-filter').value = 'all';
  document.getElementById('admin-sort').value = adminState.sort;
  updateCampaignLabels();
  renderKPIs();
  renderUsers();
  updateAdminFilterResetState();
}

function updateCampaignLabels() {
  document.querySelectorAll('.js-selected-campaign').forEach(function (el) {
    el.textContent = 'Campanha selecionada: ' + getActiveCampaign().title;
  });
}

function openCampaignModal() {
  campaignPage = 1;
  renderCampaignModal();
  openPrimaryModal('modal-campaign-select');
}

function renderCampaignModal() {
  renderCampaignFilters();
  renderCampaignCards();
}

function renderCampaignFilters() {
  var el = document.getElementById('campaign-modal-filters');
  if (!el) return;
  el.innerHTML = CAMPAIGN_FILTERS.map(function (filter) {
    return '<button class="campaign-modal__filter' + (campaignFilter === filter.id ? ' active' : '') + '" type="button" data-campaign-filter="' + filter.id + '">' +
      '<span>' + filter.label + '</span>' +
      '<span class="campaign-modal__filter-count">' + getCampaignFilterCount(filter.id) + '</span>' +
      '</button>';
  }).join('');
}

function getFilteredCampaigns() {
  return ADMIN_CAMPAIGNS.filter(function (campaign) {
    if (campaignFilter === 'all') return true;
    return campaign.category.split(/\s+/).indexOf(campaignFilter) !== -1;
  });
}

function getCampaignFilterCount(filterId) {
  if (filterId === 'all') return ADMIN_CAMPAIGNS.length;
  return ADMIN_CAMPAIGNS.filter(function (campaign) {
    return campaign.category.split(/\s+/).indexOf(filterId) !== -1;
  }).length;
}

function renderCampaignCards() {
  var el = document.getElementById('campaign-modal-grid');
  if (!el) return;
  var campaigns = getFilteredCampaigns();
  var totalPages = campaigns.length > 0 ? Math.ceil(campaigns.length / CAMPAIGN_PER_PAGE) : 1;
  if (campaignPage > totalPages) campaignPage = totalPages;
  var start = (campaignPage - 1) * CAMPAIGN_PER_PAGE;
  var pageItems = campaigns.slice(start, start + CAMPAIGN_PER_PAGE);

  el.innerHTML = pageItems.map(function (campaign) {
    var ending = campaign.category.split(/\s+/).indexOf('ending') !== -1
      ? '<span class="campaign-card__ribbon"><span class="campaign-card__ribbon-dot"></span>Termina em breve</span>'
      : '';
    return '<button class="campaign-card ' + campaign.cardClass + (campaign.id === activeCampaignId ? ' active' : '') + '" type="button" data-campaign-id="' + campaign.id + '" role="listitem">' +
      
      '<div class="campaign-card__body">' +
      '<div class="campaign-card__tag campaign-card__tag--' + campaign.badgeClass + '">' + campaign.label + '</div>' +

      '<div class="campaign-card__title">' + campaign.title + '</div>' +
      '<div class="campaign-card__desc">' + campaign.desc + '</div>' +
      '<div class="campaign-card__validity">Validade ' + campaign.validity + '</div>' +
      '</div>' +
      '<div class="campaign-card__kpis">' +
      '<div><span>Participantes</span><strong>' + campaign.participants + '</strong></div>' +
      '<div><span>Valor captado</span><strong>' + campaign.captured + '</strong></div>' +
      '</div>' +
      '</button>';
  }).join('') + buildCampaignPagination(totalPages, campaigns.length);
}

function buildCampaignPagination(totalPages, totalItems) {
  if (totalItems <= CAMPAIGN_PER_PAGE) return '';
  return '<div class="admin-pagination admin-pagination--modal campaign-modal__pagination">' +
    '<button class="admin-pagination__btn" type="button" data-campaign-page="prev"' + (campaignPage === 1 ? ' disabled' : '') + '>← Anterior</button>' +
    '<span class="admin-pagination__info">Página ' + campaignPage + ' de ' + totalPages + '</span>' +
    '<button class="admin-pagination__btn" type="button" data-campaign-page="next"' + (campaignPage === totalPages ? ' disabled' : '') + '>Próxima →</button>' +
    '</div>';
}

function changeCampaignPage(direction) {
  var totalPages = Math.max(1, Math.ceil(getFilteredCampaigns().length / CAMPAIGN_PER_PAGE));
  if (direction === 'prev' && campaignPage > 1) campaignPage--;
  if (direction === 'next' && campaignPage < totalPages) campaignPage++;
  renderCampaignCards();
}


/* ============================================
   STATE
   ============================================ */

var adminState = {
  currentPage: 1,
  PER_PAGE: 6,
  search: '',
  filterPending: false,
  originFilter: 'all',
  sort: 'date-desc',
  primaryModal: null,
  actionModal: null,
  pendingAction: null,
  activeUserId: null,
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
    PER_PAGE: 6
  }
};

var recentImportedUserIds = [];
var adminFeedbackTimer = null;

function showAdminFeedback(message, type) {
  var feedbackType = type || 'success';
  var feedback = document.getElementById('admin-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.id = 'admin-feedback';
    feedback.className = 'admin-feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    document.body.appendChild(feedback);
  }
  feedback.className = 'admin-feedback admin-feedback--' + feedbackType;
  var icon = feedbackType === 'danger' ? 'fa-triangle-exclamation' : 'fa-circle-check';
  feedback.innerHTML = '<i class="fa-solid ' + icon + '" aria-hidden="true"></i><span>' + escapeHtml(message) + '</span>';
  feedback.classList.add('show');
  clearTimeout(adminFeedbackTimer);
  adminFeedbackTimer = setTimeout(function () {
    feedback.classList.remove('show');
  }, 3200);
}

/* ============================================
   HELPERS
   ============================================ */

function getUserStats(user) {
  var aprovadas = 0, excluidas = 0, pendentes = 0, valorValido = 0;
  user.notas.forEach(function (n) {
    if (n.status === 'validada') { aprovadas++; valorValido += n.valor; }
    else if (n.status === 'excluida') { excluidas++; }
    else if (n.status === 'aguardando') { pendentes++; valorValido += n.valor; }
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
      if (String(ADMIN_MOCK[i].notas[j].id) === String(id)) return ADMIN_MOCK[i].notas[j];
    }
  }
  return null;
}

function persistAdminStorageNoteStatus(note) {
  if (!note) return;
  var changed = false;
  var stored = getAdminAddedNotes().map(function (item) {
    if (!noteBelongsToActiveCampaign(item) || String(item.nota && item.nota.id) !== String(note.id)) return item;
    changed = true;
    return Object.assign({}, item, {
      nota: Object.assign({}, item.nota, {
        status: note.status,
        justificativa: note.justificativa || null
      })
    });
  });
  if (changed) saveAdminAddedNotes(stored);
}

function statusLabel(s) {
  return { aguardando: 'Aguardando', validada: 'Validada', excluida: 'Excluída' }[s] || s;
}

function origemLabel(origem) {
  return { manual: 'Manual', 'sell-out': 'Sell-Out' }[origem] || 'Manual';
}

function origemUsuarioLabel(origem) {
  return { manual: 'Manual', csv: 'Importado via CSV' }[origem] || 'Manual';
}

function fmtDateTimeShort(iso) {
  try {
    var d = new Date(iso);
    return String(d.getDate()).padStart(2, '0') + '/' +
      String(d.getMonth() + 1).padStart(2, '0') + '/' +
      d.getFullYear() + ' ' +
      String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0');
  } catch (e) { return iso; }
}

function nowISO() {
  return new Date().toISOString();
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function maskDocumento(value) {
  var digits = onlyDigits(value).slice(0, 14);
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

function maskTelefone(value) {
  var digits = onlyDigits(value).slice(0, 11);
  if (digits.length > 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function normalizeDocumento(value) {
  return maskDocumento(value);
}

function normalizeTelefone(value) {
  return maskTelefone(value);
}

function getImportedUsersStorage() {
  try { return JSON.parse(localStorage.getItem(ADMIN_IMPORTED_USERS_KEY) || '[]'); }
  catch (e) { return []; }
}

function saveImportedUsersStorage(users) {
  localStorage.setItem(ADMIN_IMPORTED_USERS_KEY, JSON.stringify(users));
}

function upsertImportedUserStorage(users, user) {
  var docDigits = onlyDigits(user.documento);
  if (!docDigits) return;
  var idx = users.findIndex(function (item) { return onlyDigits(item.documento) === docDigits; });
  var next = {
    id: user.id,
    nome: user.nome,
    documento: normalizeDocumento(user.documento),
    email: user.email,
    telefone: normalizeTelefone(user.telefone),
    cidade: user.cidade || '',
    estado: user.estado || '',
    notificarWhatsapp: Boolean(user.notificarWhatsapp),
    notificarEmail: Boolean(user.notificarEmail),
    origem: 'csv',
    dataCriacao: user.dataCriacao,
    dataUltimaAtualizacao: user.dataUltimaAtualizacao,
    origemDetalhada: user.origemDetalhada || ''
  };
  if (idx === -1) users.push(next);
  else users[idx] = Object.assign({}, users[idx], next);
}

function getNextUserId() {
  var max = 0;
  ADMIN_MOCK.forEach(function (u) { if (u.id > max) max = u.id; });
  return max + 1;
}

function ensureUserFields() {
  ADMIN_MOCK.forEach(function (user, i) {
    if (!user.documento) user.documento = String(10000000000 + user.id * 97 + i * 13).slice(0, 11);
    if (!user.telefone) user.telefone = '149' + String(90000000 + user.id * 11111).slice(0, 8);
    user.documento = normalizeDocumento(user.documento);
    user.telefone = normalizeTelefone(user.telefone);
    if (!user.origem) user.origem = 'manual';
    if (!user.dataCriacao) user.dataCriacao = '2026-01-01T08:00:00.000Z';
    if (!user.dataUltimaAtualizacao) user.dataUltimaAtualizacao = user.dataCriacao;
    if (!user.origemDetalhada) user.origemDetalhada = 'Cadastro manual - 01/01/2026 08:00';
  });
}

function canDeleteNote(nota) {
  return nota && nota.status === 'aguardando';
}

function getExclusionJustification(nota) {
  if (nota && nota.justificativa) return nota.justificativa;
  return 'Nota excluída por inconsistência nos dados enviados para validação.';
}

function ensureMockAttachments() {
  ADMIN_MOCK.forEach(function (user, userIndex) {
    user.notas.forEach(function (nota, noteIndex) {
      if (!nota.arquivoNome) {
        nota.arquivoNome = 'anexo-' + nota.numeroNota.toLowerCase() + '.jpg';
      }
      if (!nota.origem) {
        nota.origem = nota.numeroNota && nota.numeroNota.indexOf('NF-A') === 0
          ? 'manual'
          : ((userIndex + noteIndex) % 2 === 0 ? 'sell-out' : 'manual');
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
  return Math.max.apply(null, user.notas.map(function (n) { return parseISODate(n.data); }));
}

function getSortOptionsMarkup(selectedValue) {
  var options = [
    { value: 'name-asc', label: 'Nome A–Z' },
    { value: 'name-desc', label: 'Nome Z–A' },
    { value: 'valor-desc', label: 'Maior valor' },
    { value: 'valor-asc', label: 'Menor valor' },
    { value: 'date-desc', label: 'Mais recentes' },
    { value: 'date-asc', label: 'Mais antigo' }
  ];
  return options.map(function (option) {
    return '<option value="' + option.value + '"' + (option.value === selectedValue ? ' selected' : '') + '>' + option.label + '</option>';
  }).join('');
}

function sortUsers(users, sort) {
  if (sort === 'name-asc') users.sort(function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); });
  else if (sort === 'name-desc') users.sort(function (a, b) { return b.nome.localeCompare(a.nome, 'pt-BR'); });
  else if (sort === 'valor-desc') users.sort(function (a, b) { return getUserStats(b).valorValido - getUserStats(a).valorValido; });
  else if (sort === 'valor-asc') users.sort(function (a, b) { return getUserStats(a).valorValido - getUserStats(b).valorValido; });
  else if (sort === 'date-desc') users.sort(function (a, b) { return getUserLatestNoteDate(b) - getUserLatestNoteDate(a); });
  else if (sort === 'date-asc') users.sort(function (a, b) { return getUserLatestNoteDate(a) - getUserLatestNoteDate(b); });
  return users;
}

function sortKPINotes(list, sort) {
  list.sort(function (a, b) {
    if (sort === 'name-asc') return a.user.nome.localeCompare(b.user.nome, 'pt-BR');
    if (sort === 'name-desc') return b.user.nome.localeCompare(a.user.nome, 'pt-BR');
    if (sort === 'valor-desc') return b.nota.valor - a.nota.valor;
    if (sort === 'valor-asc') return a.nota.valor - b.nota.valor;
    if (sort === 'date-asc') return parseISODate(a.nota.data) - parseISODate(b.nota.data);
    return parseISODate(b.nota.data) - parseISODate(a.nota.data);
  });
  return list;
}

/* ============================================
   KPIs
   ============================================ */

function calcKPIs() {
  var r = {
    totalUsuarios: ADMIN_MOCK.length, totalNotas: 0, totalValor: 0,
    totalAguardando: 0, totalValidada: 0, totalExcluida: 0
  };
  ADMIN_MOCK.forEach(function (u) {
    u.notas.forEach(function (n) {
      if (n.status === 'aguardando') { r.totalNotas++; r.totalAguardando++; r.totalValor += n.valor; }
      else if (n.status === 'validada') { r.totalNotas++; r.totalValidada++; r.totalValor += n.valor; }
      else if (n.status === 'excluida') { r.totalExcluida++; }
    });
  });
  return r;
}

function kpiCard(icon, value, label, cls, onclickFn) {
  var extra = onclickFn ? ' kpi-card--clickable' : '';
  var attrs = onclickFn ? ' role="button" tabindex="0" onclick="' + onclickFn + '"' : '';
  var hint = onclickFn ? '<div class="kpi-card__hint">Ver detalhes →</div>' : '';
  return '<div class="kpi-card ' + cls + extra + '"' + attrs + '>' +
    '<div class="kpi-card__icon">' + icon + '</div>' +
    '<div class="kpi-card__value">' + value + '</div>' +
    '<div class="kpi-card__label">' + label + '</div>' +
    hint + '</div>';
}

function renderKPIs() {
  var k = calcKPIs();
  document.getElementById('admin-kpis').innerHTML =
    kpiCard('⏳', k.totalAguardando, 'Aguardando validação', 'kpi-card--aguardando', 'openKPIAguardandoModal()') +
    kpiCard('✅', k.totalValidada, 'Notas validadas', 'kpi-card--validada', 'openKPIValidadaModal()') +
    kpiCard('🗑️', k.totalExcluida, 'Notas excluídas', 'kpi-card--excluida', 'openKPIExcluidaModal()') +
    kpiCard('👥', k.totalUsuarios, 'Total de usuários', 'kpi-card--total-usuarios') +
    kpiCard('🧾', k.totalNotas, 'Total de notas', 'kpi-card--total-notas') +
    kpiCard('💰', fmtValor(k.totalValor), 'Valor total enviado', 'kpi-card--valor-total');
}

/* ============================================
   USERS
   ============================================ */

function getFilteredSortedUsers() {
  var search = adminState.search.trim().toLowerCase();
  var users = ADMIN_MOCK.slice();

  if (search) {
    users = users.filter(function (u) {
      return u.nome.toLowerCase().indexOf(search) !== -1;
    });
  }
  if (adminState.filterPending) {
    users = users.filter(function (u) {
      return u.notas.some(function (n) { return n.status === 'aguardando'; });
    });
  }
  if (adminState.originFilter !== 'all') {
    users = users.filter(function (u) {
      var origem = u.origem || 'manual';
      return origem === adminState.originFilter;
    });
  }

  return sortUsers(users, adminState.sort);
}

function buildUserCard(u) {
  var s = getUserStats(u);
  var pend = s.pendentes > 0;
  var origem = u.origem || 'manual';
  var importedHighlight = recentImportedUserIds.indexOf(u.id) !== -1;
  var locSvg = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
    '<path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5Z" stroke="currentColor" stroke-width="1.5"/>' +
    '<circle cx="8" cy="6" r="1.5" stroke="currentColor" stroke-width="1.5"/></svg>';
  var locText = (u.cidade || u.estado)
    ? locSvg + escapeHtml((u.cidade ? u.cidade + (u.estado ? ', ' + u.estado : '') : u.estado))
    : '';

  return '<div class="user-card' + (pend ? ' user-card--pending' : '') + (importedHighlight ? ' user-card--csv-imported' : '') + '" data-user-id="' + u.id + '">' +
    '<div class="user-card__avatar">' + initials(u.nome) + '</div>' +
    '<div class="user-card__body">' +
    '<div class="user-card__name-row">' +
    '<span class="user-card__name">' + escapeHtml(u.nome) + '</span>' +
    (pend ? '<span class="user-badge user-badge--pending">Notas Pendentes</span>' : '') +
    '<span class="user-badge user-badge--origem user-badge--origem-' + origem + '">' + origemUsuarioLabel(origem) + '</span>' +
    '</div>' +
    (u.documento ? '<div class="user-card__doc">Doc.: ' + escapeHtml(u.documento) + '</div>' : '') +
    '<div class="user-card__email">' + escapeHtml(u.email) + '</div>' +
    (locText ? '<div class="user-card__location">' + locText + '</div>' : '') +
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
    '<button class="btn btn--sm user-card__btn" type="button" onclick="verNotas(' + u.id + ')">Ver notas</button>' +
    '</div>' +
    '<div class="user-card__actions">' +
    '<button class="btn btn--outline btn--sm user-card__btn--edit" type="button" data-user-action="edit" data-user-id="' + u.id + '"><i class="fa-solid fa-pen" aria-hidden="true"></i>Editar</button>' +
    '<button class="btn btn--sm btn--danger-outline" type="button" data-user-action="delete" data-user-id="' + u.id + '" aria-label="Excluir usuário"><i class="fa-solid fa-trash" aria-hidden="true"></i>Excluir</button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderUsers() {
  var users = getFilteredSortedUsers();
  var totalPages = users.length > 0 ? Math.ceil(users.length / adminState.PER_PAGE) : 1;
  if (adminState.currentPage > totalPages) adminState.currentPage = totalPages;

  var start = (adminState.currentPage - 1) * adminState.PER_PAGE;
  var pageUsers = users.slice(start, start + adminState.PER_PAGE);
  var gridEl = document.getElementById('admin-users-grid');

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

function resetAdminUserFilters() {
  var searchInput = document.getElementById('admin-search');
  var sortSelect = document.getElementById('admin-sort');
  var originSelect = document.getElementById('admin-origin-filter');
  var pendingCheck = document.getElementById('admin-filter-pending');

  adminState.search = '';
  adminState.filterPending = false;
  adminState.originFilter = 'all';
  adminState.sort = 'date-desc';
  adminState.currentPage = 1;

  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = adminState.sort;
  if (originSelect) originSelect.value = adminState.originFilter;
  if (pendingCheck) pendingCheck.checked = false;

  renderUsers();
  updateAdminFilterResetState();
  searchInput && searchInput.focus();
}

function hasActiveAdminUserFilters() {
  return adminState.search.trim() !== '' ||
    adminState.filterPending ||
    adminState.originFilter !== 'all' ||
    adminState.sort !== 'date-desc';
}

function updateAdminFilterResetState() {
  var resetBtn = document.getElementById('admin-filter-reset');
  if (!resetBtn) return;
  resetBtn.classList.toggle('is-active', hasActiveAdminUserFilters());
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
  adminState.actionModal = null;
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
  var user = ADMIN_MOCK.find(function (u) { return u.id === userId; });
  if (!user) return;
  document.getElementById('modal-user-notes-title').textContent = 'Notas de ' + user.nome;
  document.getElementById('modal-user-notes-body').innerHTML = buildNotesTabsUI(user);
}

function buildNotesTabsUI(user) {
  var state = adminState.userNotesModal;
  var groups = {
    aguardando: user.notas.filter(function (n) { return n.status === 'aguardando'; }),
    validada: user.notas.filter(function (n) { return n.status === 'validada'; }),
    excluida: user.notas.filter(function (n) { return n.status === 'excluida'; })
  };

  var activeTab = state.activeTab;
  var activeNotes = groups[activeTab];
  var page = state.pages[activeTab];
  var total = activeNotes.length;
  var totalPages = total > 0 ? Math.ceil(total / state.PER_PAGE) : 1;
  if (page > totalPages) { state.pages[activeTab] = 1; page = 1; }

  var start = (page - 1) * state.PER_PAGE;
  var pageNotes = activeNotes.slice(start, start + state.PER_PAGE);

  var tabsNav = '<div class="notes-tabs__nav" role="tablist">' +
    buildNoteTabButton('aguardando', 'Aguardando validação', groups.aguardando.length, activeTab) +
    buildNoteTabButton('validada', 'Validadas', groups.validada.length, activeTab) +
    buildNoteTabButton('excluida', 'Excluídas', groups.excluida.length, activeTab) +
    '</div>';

  var notesList = '';
  if (total === 0) {
    notesList = '<p class="notes-empty">Nenhuma nota nesta categoria.</p>';
  } else {
    var canValidate = activeTab === 'aguardando';
    var canDelete = activeTab === 'aguardando';
    var canPreview = true;
    notesList = '<div class="notes-list">' + pageNotes.map(function (n) {
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
  var canPreviewAttachment = canPreview !== false && nota.arquivoNome;
  var canShowActions = canValidate || canDelete || canPreviewAttachment;
  var actions = '';
  if (canShowActions) {
    actions = '<div class="note-item__actions">';
    if (canPreviewAttachment) actions += '<button class="btn-note btn-note--attachment" type="button" data-note-action="preview" data-note-id="' + nota.id + '"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>';
    if (canDelete) actions += '<button class="btn-note btn-note--delete" type="button" data-note-action="delete" data-note-id="' + nota.id + '">Excluir</button>';
    if (canValidate) actions += '<button class="btn-note btn-note--validate" type="button" data-note-action="validate" data-note-id="' + nota.id + '">Validar</button>';
    actions += '</div>';
  }

  var details = '<div class="note-item__details">' +
    '<div class="note-detail"><span class="note-detail__label">Valor</span><span class="note-detail__value note-detail__value--valor">' + fmtValor(nota.valor) + '</span></div>' +
    '<div class="note-detail"><span class="note-detail__label">Data</span><span class="note-detail__value">' + fmtData(nota.data) + '</span></div>' +
    '<div class="note-detail"><span class="note-detail__label">Origem</span><span class="note-detail__value">' + origemLabel(nota.origem) + '</span></div>' +
    '<div class="note-detail"><span class="note-detail__label">Responsável</span><span class="note-detail__value">' + nota.responsavelLancamento + '</span></div>' +
    '<div class="note-detail"><span class="note-detail__label">Arquivo</span><span class="note-detail__value note-detail__value--file" title="' + escapeHtml(getAttachmentFileLabel(nota)) + '"><i class="fa-solid fa-paperclip" aria-hidden="true"></i> ' + getAttachmentFileLabel(nota) + '</span></div>' +
    '</div>';
  var products = buildAdminProductTags(nota.produtos);

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
    details + products + justif +
    '</div>';
}

function buildAdminProductTags(products) {
  var normalized = normalizeAdminInvoiceProducts(products);
  if (!normalized.length) return '';
  var tags = normalized.map(function (product) {
    return '<span class="admin-note-product-tag">' + escapeHtml(product.nome) + ' x' + escapeHtml(product.qtd) + '</span>';
  }).join('');
  if (!tags) return '';
  return '<div class="admin-note-products" aria-label="Produtos contidos na nota">' + tags + '</div>';
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
  ADMIN_MOCK.forEach(function (u) {
    u.notas.forEach(function (n) {
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
    list = list.filter(function (item) {
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

  return '<div class="kpi-notes-list">' + pageItems.map(function (item) {
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
  var arquivoNome = getAttachmentFileLabel(nota);
  var arquivo = '<span class="kpi-note__file" title="' + escapeHtml(arquivoNome) + '"><i class="fa-solid fa-paperclip" aria-hidden="true"></i> ' + arquivoNome + '</span>';
  var products = buildAdminProductTags(nota.produtos);
  var actions = '<div class="kpi-note__actions">' +
    '<button class="btn-note btn-note--attachment" type="button" data-note-action="preview" data-note-id="' + nota.id + '"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>' +
    '<a class="btn-note btn-note--attachment" href="' + getMockAttachmentSrc(nota) + '" download="' + getAttachmentFileLabel(nota) + '"><i class="fa-solid fa-download" aria-hidden="true"></i></a>' +
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
    '<span class="kpi-note__left">' +
    '<span class="kpi-note__resp">Resp.: ' + nota.responsavelLancamento + '</span>' +
    arquivo +
    '</span>' +
    '<span class="kpi-note__side">' +
    '<span class="kpi-note__date">' + fmtData(nota.data) + '</span>' +
    '<span class="kpi-note__origem">' + origemLabel(nota.origem) + '</span>' +
    '</span>' +
    '</div>' +
    '</div>' +
    products + actions + justif +
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
  if (adminState.primaryModal === 'modal-kpi-validada') renderKPIValidadaModal();
  if (adminState.primaryModal === 'modal-kpi-excluida') renderKPIExcluidaModal();
}

/* ============================================
   EVENTS
   ============================================ */

document.getElementById('admin-search').addEventListener('input', function () {
  adminState.search = this.value;
  adminState.currentPage = 1;
  renderUsers();
  updateAdminFilterResetState();
});

document.getElementById('admin-filter-pending').addEventListener('change', function () {
  adminState.filterPending = this.checked;
  adminState.currentPage = 1;
  renderUsers();
  updateAdminFilterResetState();
});

document.getElementById('admin-sort').addEventListener('change', function () {
  adminState.sort = this.value;
  adminState.currentPage = 1;
  renderUsers();
  updateAdminFilterResetState();
});

document.getElementById('admin-origin-filter').addEventListener('change', function () {
  adminState.originFilter = this.value;
  adminState.currentPage = 1;
  renderUsers();
  updateAdminFilterResetState();
});

document.getElementById('admin-filter-reset').addEventListener('click', resetAdminUserFilters);

document.getElementById('admin-prev').addEventListener('click', function () {
  if (adminState.currentPage > 1) { adminState.currentPage--; renderUsers(); }
});

document.getElementById('admin-next').addEventListener('click', function () {
  var total = Math.ceil(getFilteredSortedUsers().length / adminState.PER_PAGE);
  if (adminState.currentPage < total) { adminState.currentPage++; renderUsers(); }
});

/* Modal close buttons */
document.querySelectorAll('.modal__close').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var m = btn.closest('.modal');
    if (!m) return;
    if (adminState.actionModal === m.id) closeActionModal();
    else if (adminState.primaryModal === m.id) closePrimaryModal();
  });
});

/* Click outside dialog */
document.querySelectorAll('.modal').forEach(function (m) {
  m.addEventListener('click', function (e) {
    if (e.target !== m) return;
    if (adminState.actionModal === m.id) closeActionModal();
    else if (adminState.primaryModal === m.id) closePrimaryModal();
  });
});

/* Overlay click */
document.getElementById('modal-overlay').addEventListener('click', function () {
  if (adminState.actionModal) closeActionModal();
  else if (adminState.primaryModal) closePrimaryModal();
});

/* Escape key */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  if (adminState.actionModal) closeActionModal();
  else if (adminState.primaryModal) closePrimaryModal();
});

/* KPI cards — keyboard activation */
document.getElementById('admin-kpis').addEventListener('keydown', function (e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  var card = e.target.closest('[role="button"]');
  if (card) { e.preventDefault(); card.click(); }
});

/* User notes modal — tab, pagination and action delegation */
document.getElementById('modal-user-notes-body').addEventListener('click', function (e) {
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
    var dir = pageBtn.getAttribute('data-notes-page');
    var state = adminState.userNotesModal;
    var user = ADMIN_MOCK.find(function (u) { return u.id === adminState.activeUserId; });
    if (user) {
      var notes = user.notas.filter(function (n) { return n.status === state.activeTab; });
      var totalPages = notes.length > 0 ? Math.ceil(notes.length / state.PER_PAGE) : 1;
      if (dir === 'prev' && state.pages[state.activeTab] > 1) state.pages[state.activeTab]--;
      if (dir === 'next' && state.pages[state.activeTab] < totalPages) state.pages[state.activeTab]++;
    }
    renderUserNotesModal(adminState.activeUserId);
    return;
  }

  var btn = e.target.closest('[data-note-action]');
  if (!btn) return;
  var action = btn.getAttribute('data-note-action');
  var noteId = btn.getAttribute('data-note-id');
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
document.getElementById('modal-kpi-aguardando-body').addEventListener('click', function (e) {
  var btn = e.target.closest('[data-note-action]');
  if (!btn) return;
  var action = btn.getAttribute('data-note-action');
  var noteId = btn.getAttribute('data-note-id');
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

['modal-kpi-aguardando-body', 'modal-kpi-validada-body', 'modal-kpi-excluida-body'].forEach(function (id) {
  document.getElementById(id).addEventListener('input', function (e) {
    var input = e.target.closest('[data-kpi-search]');
    if (!input) return;
    adminState.kpiModalState.search = input.value;
    adminState.kpiModalState.page = 1;
    renderActiveKPIModal();
  });

  document.getElementById(id).addEventListener('change', function (e) {
    var select = e.target.closest('[data-kpi-sort]');
    if (!select) return;
    adminState.kpiModalState.sort = select.value;
    adminState.kpiModalState.page = 1;
    renderActiveKPIModal();
  });

  document.getElementById(id).addEventListener('click', function (e) {
    var previewBtn = e.target.closest('[data-note-action="preview"]');
    if (previewBtn) {
      openAttachmentPreview(previewBtn.getAttribute('data-note-id'));
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
document.getElementById('btn-confirm-validate').addEventListener('click', function () {
  if (!adminState.pendingAction) return;
  var note = findNoteById(adminState.pendingAction.noteId);
  if (note) note.status = 'validada';
  persistAdminStorageNoteStatus(note);
  closeActionModal();
  refreshAll();
  if (note) showAdminFeedback('Nota ' + note.numeroNota + ' validada com sucesso.', 'success');
});

document.getElementById('btn-cancel-validate').addEventListener('click', closeActionModal);

/* Confirm delete */
document.getElementById('btn-confirm-delete').addEventListener('click', function () {
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
  persistAdminStorageNoteStatus(note);
  closeActionModal();
  refreshAll();
  showAdminFeedback('Nota ' + note.numeroNota + ' excluída com sucesso.', 'danger');
});

document.getElementById('btn-cancel-delete').addEventListener('click', closeActionModal);

document.getElementById('delete-justificativa').addEventListener('input', function () {
  if (this.value.trim()) document.getElementById('delete-justificativa-error').hidden = true;
});

document.getElementById('btn-note-preview-back').addEventListener('click', closePrimaryModal);

document.querySelectorAll('.js-campaign-menu-action, .js-campaign-change').forEach(function (btn) {
  btn.addEventListener('click', function () {
    campaignFilter = 'all';
    openCampaignModal();
  });
});

document.getElementById('campaign-modal-filters').addEventListener('click', function (e) {
  var btn = e.target.closest('[data-campaign-filter]');
  if (!btn) return;
  campaignFilter = btn.getAttribute('data-campaign-filter');
  campaignPage = 1;
  renderCampaignModal();
});

document.getElementById('campaign-modal-grid').addEventListener('click', function (e) {
  var pageBtn = e.target.closest('[data-campaign-page]');
  if (pageBtn) {
    changeCampaignPage(pageBtn.getAttribute('data-campaign-page'));
    return;
  }

  var card = e.target.closest('[data-campaign-id]');
  if (!card) return;
  applyCampaign(card.getAttribute('data-campaign-id'));
  closePrimaryModal();
});

/* Mobile nav */
var menuToggle = document.querySelector('.header__menu-toggle');
var mobileNav = document.querySelector('.mobile-nav');
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* Header scroll shadow */
window.addEventListener('scroll', function () {
  document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ============================================
   UPLOAD CSV
   ============================================ */

var uploadCSVState = {
  phase: 'idle',
  fileName: '',
  parsedRows: [],
  errorMsg: '',
  notificarWhatsapp: true,
  notificarEmail: true,
  importedCount: 0,
  updatedCount: 0,
  importedUsers: []
};

function openUploadCSVModal() {
  uploadCSVState.phase = 'idle';
  uploadCSVState.fileName = '';
  uploadCSVState.parsedRows = [];
  uploadCSVState.errorMsg = '';
  uploadCSVState.notificarWhatsapp = true;
  uploadCSVState.notificarEmail = true;
  uploadCSVState.importedCount = 0;
  uploadCSVState.updatedCount = 0;
  uploadCSVState.importedUsers = [];
  renderUploadCSVModalBody();
  openPrimaryModal('modal-upload-csv');
}

function renderUploadCSVModalBody() {
  var body = document.getElementById('modal-upload-csv-body');
  if (!body) return;
  body.innerHTML = uploadCSVState.phase === 'success' ? buildUploadSuccessBody() : buildUploadMainBody();
}

function buildUploadMainBody() {
  var phase = uploadCSVState.phase;
  var canImport = phase === 'ready';
  var hasFile = uploadCSVState.fileName !== '';
  var whatsappYes = uploadCSVState.notificarWhatsapp ? ' checked' : '';
  var whatsappNo = uploadCSVState.notificarWhatsapp ? '' : ' checked';
  var emailYes = uploadCSVState.notificarEmail ? ' checked' : '';
  var emailNo = uploadCSVState.notificarEmail ? '' : ' checked';

  var dropzoneClass = 'upload-csv__dropzone' +
    (phase === 'ready' ? ' upload-csv__dropzone--ready' : '') +
    (phase === 'error' && hasFile ? ' upload-csv__dropzone--error' : '');

  var dropContent = hasFile
    ? '<div class="upload-csv__dropzone-icon upload-csv__dropzone-icon--file"><i class="fa-solid fa-file-csv" aria-hidden="true"></i></div>' +
      '<div class="upload-csv__dropzone-text">' +
      '<span class="upload-csv__filename">' + escapeHtml(uploadCSVState.fileName) + '</span>' +
      '<span class="upload-csv__change">Clique para trocar o arquivo</span>' +
      '</div>'
    : '<div class="upload-csv__dropzone-icon"><i class="fa-solid fa-file-arrow-up" aria-hidden="true"></i></div>' +
      '<div class="upload-csv__dropzone-text"><span>Clique para selecionar ou arraste o arquivo CSV aqui</span></div>';

  var errorHtml = phase === 'error'
    ? '<div class="upload-csv__error" role="alert"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> ' + escapeHtml(uploadCSVState.errorMsg) + '</div>'
    : '';

  return '<div class="upload-csv-content">' +
    '<div class="upload-csv__desc-block">' +
    '<p class="upload-csv__desc">Envie um arquivo CSV contendo a base de clientes que deseja importar.</p>' +
    '<p class="upload-csv__desc">O arquivo deve seguir exatamente o modelo disponibilizado abaixo.</p>' +
    '<p class="upload-csv__desc">Não altere os nomes ou a ordem das colunas.</p>' +
    '</div>' +
    '<button class="btn btn--outline btn--sm upload-csv__template-btn" type="button" id="btn-download-template">' +
    '<i class="fa-solid fa-download" aria-hidden="true"></i> Baixar template CSV' +
    '</button>' +
    '<label class="' + dropzoneClass + '" for="input-csv-file">' +
    dropContent +
    '<input type="file" id="input-csv-file" accept=".csv" class="upload-csv__input" aria-label="Selecionar arquivo CSV">' +
    '</label>' +
    '<fieldset class="upload-csv__notify-group">' +
    '<legend class="upload-csv__notify-title">Notificar clientes importados</legend>' +
    '<div class="upload-csv__notify-row">' +
    '<span class="upload-csv__notify-label">Por WhatsApp</span>' +
    '<span class="upload-csv__segmented" role="group" aria-label="Notificar por WhatsApp">' +
    '<label class="upload-csv__segment"><input type="radio" name="upload-notificar-whatsapp" value="sim" data-upload-notify="whatsapp"' + whatsappYes + '><span>Sim</span></label>' +
    '<label class="upload-csv__segment"><input type="radio" name="upload-notificar-whatsapp" value="nao" data-upload-notify="whatsapp"' + whatsappNo + '><span>Não</span></label>' +
    '</span>' +
    '</div>' +
    '<div class="upload-csv__notify-row">' +
    '<span class="upload-csv__notify-label">Por e-mail</span>' +
    '<span class="upload-csv__segmented" role="group" aria-label="Notificar por e-mail">' +
    '<label class="upload-csv__segment"><input type="radio" name="upload-notificar-email" value="sim" data-upload-notify="email"' + emailYes + '><span>Sim</span></label>' +
    '<label class="upload-csv__segment"><input type="radio" name="upload-notificar-email" value="nao" data-upload-notify="email"' + emailNo + '><span>Não</span></label>' +
    '</span>' +
    '</div>' +
    '</fieldset>' +
    errorHtml +
    '<div class="modal__foot">' +
    '<button class="modal-btn modal-btn--cancel" id="btn-cancel-upload-csv" type="button">Cancelar</button>' +
    '<button class="modal-btn modal-btn--validate" id="btn-confirm-upload-csv" type="button"' + (canImport ? '' : ' disabled') + '>Importar</button>' +
    '</div>' +
    '</div>';
}

function buildUploadSuccessBody() {
  var imp = uploadCSVState.importedCount;
  var upd = uploadCSVState.updatedCount;
  var statsHtml = '';
  if (imp > 0) statsHtml += '<p class="upload-csv__stat">' + imp + (imp === 1 ? ' cliente importado.' : ' clientes importados.') + '</p>';
  if (upd > 0) statsHtml += '<p class="upload-csv__stat">' + upd + (upd === 1 ? ' cliente atualizado.' : ' clientes atualizados.') + '</p>';

  return '<div class="upload-csv-content upload-csv-content--success">' +
    '<div class="upload-csv__success-icon"><i class="fa-solid fa-circle-check" aria-hidden="true"></i></div>' +
    '<p class="upload-csv__success-msg">Base de clientes importada com sucesso.</p>' +
    statsHtml +
    '<div class="modal__foot">' +
    '<button class="modal-btn modal-btn--validate" id="btn-close-upload-success" type="button">Fechar</button>' +
    '</div>' +
    '</div>';
}

function handleCSVFileSelected(file) {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    uploadCSVState.phase = 'error';
    uploadCSVState.fileName = file.name;
    uploadCSVState.errorMsg = 'Formato inválido. Apenas arquivos .csv são aceitos.';
    uploadCSVState.parsedRows = [];
    renderUploadCSVModalBody();
    return;
  }
  uploadCSVState.fileName = file.name;
  var reader = new FileReader();
  reader.onload = function (e) {
    var result = parseAndValidateCSV(e.target.result);
    if (result.error) {
      uploadCSVState.phase = 'error';
      uploadCSVState.errorMsg = result.error;
      uploadCSVState.parsedRows = [];
    } else {
      uploadCSVState.phase = 'ready';
      uploadCSVState.parsedRows = result.rows;
      uploadCSVState.errorMsg = '';
    }
    renderUploadCSVModalBody();
  };
  reader.readAsText(file, 'UTF-8');
}

function parseAndValidateCSV(text) {
  var lines = text.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (!lines.length || !lines[0].trim()) return { error: 'O arquivo está vazio.' };

  var headerLine = lines[0].replace(/﻿/g, '').trim().toLowerCase();
  if (headerLine !== 'nome,documento,email,telefone') {
    return { error: 'O arquivo enviado não segue o modelo esperado. Baixe o template CSV e tente novamente.' };
  }

  var validRows = [];
  var invalidCount = 0;
  lines.slice(1).forEach(function (line) {
    if (!line.trim()) return;
    var parts = line.split(',');
    if (parts.length < 4) { invalidCount++; return; }
    var nome = parts[0].trim();
    var documento = normalizeDocumento(parts[1].trim());
    var email = parts[2].trim();
    var telefone = normalizeTelefone(parts.slice(3).join(',').trim());
    if (!nome || !documento || !email || !telefone) { invalidCount++; return; }
    validRows.push({ nome: nome, documento: documento, email: email, telefone: telefone });
  });

  if (invalidCount > 0) {
    return { error: 'Importação não concluída. Foram encontrados ' + invalidCount + (invalidCount === 1 ? ' registro inválido.' : ' registros inválidos.') };
  }
  if (!validRows.length) return { error: 'O arquivo não contém nenhum registro válido.' };
  return { rows: validRows };
}

function downloadCSVTemplate() {
  var content = 'nome,documento,email,telefone\nJoão Silva,12345678900,joao@email.com,14999999999\nMaria Souza,98765432100,maria@email.com,14988888888';
  var blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'template-base-clientes.csv';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function doImportCSV() {
  var now = nowISO();
  var nowFmt = fmtDateTimeShort(now);
  var importedCount = 0;
  var updatedCount = 0;
  var importedUsers = [];
  var persistedImportedUsers = getImportedUsersStorage();
  var notificationFlags = {
    notificarWhatsapp: Boolean(uploadCSVState.notificarWhatsapp),
    notificarEmail: Boolean(uploadCSVState.notificarEmail)
  };
  uploadCSVState.parsedRows.forEach(function (row) {
    var rowDocumentoDigits = onlyDigits(row.documento);
    var existing = ADMIN_MOCK.find(function (u) { return onlyDigits(u.documento) === rowDocumentoDigits; });
    if (existing) {
      existing.nome = row.nome;
      existing.documento = normalizeDocumento(row.documento);
      existing.email = row.email;
      existing.telefone = normalizeTelefone(row.telefone);
      existing.notificarWhatsapp = notificationFlags.notificarWhatsapp;
      existing.notificarEmail = notificationFlags.notificarEmail;
      existing.origem = 'csv';
      existing.origemDetalhada = 'Importação CSV - ' + nowFmt;
      existing.dataUltimaAtualizacao = now;
      upsertImportedUserStorage(persistedImportedUsers, existing);
      updatedCount++;
    } else {
      var newUser = {
        id: getNextUserId(),
        nome: row.nome,
        documento: normalizeDocumento(row.documento),
        email: row.email,
        telefone: normalizeTelefone(row.telefone),
        cidade: '',
        estado: '',
        notificarWhatsapp: notificationFlags.notificarWhatsapp,
        notificarEmail: notificationFlags.notificarEmail,
        origem: 'csv',
        dataCriacao: now,
        dataUltimaAtualizacao: now,
        origemDetalhada: 'Importação CSV - ' + nowFmt,
        notas: []
      };
      ADMIN_MOCK.push(newUser);
      importedUsers.push(newUser);
      upsertImportedUserStorage(persistedImportedUsers, newUser);
      importedCount++;
    }
  });
  saveImportedUsersStorage(persistedImportedUsers);
  uploadCSVState.phase = 'success';
  uploadCSVState.importedCount = importedCount;
  uploadCSVState.updatedCount = updatedCount;
  uploadCSVState.importedUsers = importedUsers;
  recentImportedUserIds = importedUsers.map(function (user) { return user.id; });
  renderUploadCSVModalBody();
  adminState.currentPage = 1;
  if (recentImportedUserIds.length) {
    adminState.search = '';
    adminState.filterPending = false;
    adminState.originFilter = 'csv';
    document.getElementById('admin-search').value = '';
    document.getElementById('admin-filter-pending').checked = false;
    document.getElementById('admin-origin-filter').value = 'csv';
  }
  renderKPIs();
  renderUsers();
  updateAdminFilterResetState();
  if (importedCount > 0) {
    showAdminFeedback(importedCount + (importedCount === 1 ? ' usuário importado' : ' usuários importados') + ' por CSV.', 'success');
  } else if (updatedCount > 0) {
    showAdminFeedback(updatedCount + (updatedCount === 1 ? ' usuário atualizado' : ' usuários atualizados') + ' pelo CSV.', 'success');
  }
}

/* ============================================
   EDIT USER
   ============================================ */

var editUserState = { userId: null };

function openEditUserModal(userId) {
  var user = ADMIN_MOCK.find(function (u) { return u.id === userId; });
  if (!user) return;
  editUserState.userId = userId;
  renderEditUserModal(user);
  openPrimaryModal('modal-edit-user');
}

function renderEditUserModal(user) {
  var body = document.getElementById('modal-edit-user-body');
  if (!body) return;
  var origem = user.origem || 'manual';
  body.innerHTML =
    '<div class="form-field">' +
    '<label class="form-label" for="edit-user-nome">Nome <span class="form-required" aria-hidden="true">*</span></label>' +
    '<input class="form-input" type="text" id="edit-user-nome" value="' + escapeHtml(user.nome) + '" autocomplete="off">' +
    '<p class="form-error" id="edit-user-nome-error" hidden role="alert">Nome é obrigatório.</p>' +
    '</div>' +
    '<div class="form-field">' +
    '<label class="form-label" for="edit-user-documento">Documento</label>' +
    '<input class="form-input form-input--readonly" type="text" id="edit-user-documento" value="' + escapeHtml(maskDocumento(user.documento || '')) + '" readonly aria-describedby="edit-user-documento-help">' +
    '<p class="form-help form-help--locked" id="edit-user-documento-help">Documento não pode ser editado, pois é a chave de acesso ao sistema.</p>' +
    '</div>' +
    '<div class="form-field">' +
    '<label class="form-label" for="edit-user-email">E-mail <span class="form-required" aria-hidden="true">*</span></label>' +
    '<input class="form-input" type="email" id="edit-user-email" value="' + escapeHtml(user.email) + '" autocomplete="off">' +
    '<p class="form-error" id="edit-user-email-error" hidden role="alert">E-mail é obrigatório.</p>' +
    '</div>' +
    '<div class="form-field">' +
    '<label class="form-label" for="edit-user-telefone">Telefone <span class="form-required" aria-hidden="true">*</span></label>' +
    '<input class="form-input" type="text" id="edit-user-telefone" value="' + escapeHtml(maskTelefone(user.telefone || '')) + '" inputmode="numeric" maxlength="15" autocomplete="off">' +
    '<p class="form-error" id="edit-user-telefone-error" hidden role="alert">Telefone é obrigatório.</p>' +
    '</div>' +
    '<div class="form-field">' +
    '<label class="form-label">Origem</label>' +
    '<div class="form-readonly"><span class="user-badge user-badge--origem user-badge--origem-' + origem + '">' + origemUsuarioLabel(origem) + '</span></div>' +
    '</div>' +
    '<div class="modal__foot">' +
    '<button class="modal-btn modal-btn--cancel" id="btn-cancel-edit-user" type="button">Cancelar</button>' +
    '<button class="modal-btn modal-btn--validate" id="btn-save-edit-user" type="button">Salvar alterações</button>' +
    '</div>';
}

function saveEditUser() {
  var user = ADMIN_MOCK.find(function (u) { return u.id === editUserState.userId; });
  if (!user) return;

  var fields = [
    { inputId: 'edit-user-nome', errId: 'edit-user-nome-error' },
    { inputId: 'edit-user-email', errId: 'edit-user-email-error' },
    { inputId: 'edit-user-telefone', errId: 'edit-user-telefone-error' }
  ];
  var values = {};
  var valid = true;
  fields.forEach(function (f) {
    var val = document.getElementById(f.inputId).value.trim();
    values[f.inputId] = val;
    var err = document.getElementById(f.errId);
    if (!val) { if (err) err.hidden = false; valid = false; }
    else { if (err) err.hidden = true; }
  });
  if (!valid) return;

  user.nome = values['edit-user-nome'];
  user.email = values['edit-user-email'];
  user.telefone = normalizeTelefone(values['edit-user-telefone']);
  user.dataUltimaAtualizacao = nowISO();
  closePrimaryModal();
  renderKPIs();
  renderUsers();
  showAdminFeedback('Usuário ' + user.nome + ' atualizado com sucesso.', 'success');
}

/* ============================================
   DELETE USER
   ============================================ */

var deleteUserState = { userId: null };

function openDeleteUserModal(userId) {
  var user = ADMIN_MOCK.find(function (u) { return u.id === userId; });
  if (!user) return;
  deleteUserState.userId = userId;
  var nameEl = document.getElementById('delete-user-name');
  if (nameEl) nameEl.textContent = user.nome;
  openActionModal('modal-delete-user');
}

/* Upload CSV button */
document.getElementById('btn-upload-csv').addEventListener('click', openUploadCSVModal);

/* Upload CSV modal body — delegation */
document.getElementById('modal-upload-csv-body').addEventListener('click', function (e) {
  if (e.target.closest('#btn-download-template')) { downloadCSVTemplate(); return; }
  if (e.target.closest('#btn-cancel-upload-csv')) { closePrimaryModal(); return; }
  var confirmBtn = e.target.closest('#btn-confirm-upload-csv');
  if (confirmBtn && !confirmBtn.disabled) { doImportCSV(); return; }
  if (e.target.closest('#btn-close-upload-success')) { closePrimaryModal(); return; }
});

document.getElementById('modal-upload-csv-body').addEventListener('change', function (e) {
  var fi = e.target.closest('#input-csv-file');
  if (fi && fi.files[0]) handleCSVFileSelected(fi.files[0]);
  var notifyInput = e.target.closest('[data-upload-notify]');
  if (!notifyInput) return;
  var enabled = notifyInput.value === 'sim';
  if (notifyInput.getAttribute('data-upload-notify') === 'whatsapp') uploadCSVState.notificarWhatsapp = enabled;
  if (notifyInput.getAttribute('data-upload-notify') === 'email') uploadCSVState.notificarEmail = enabled;
});

/* Edit user modal body — delegation */
document.getElementById('modal-edit-user-body').addEventListener('click', function (e) {
  if (e.target.closest('#btn-cancel-edit-user')) { closePrimaryModal(); return; }
  if (e.target.closest('#btn-save-edit-user')) { saveEditUser(); return; }
});

document.getElementById('modal-edit-user-body').addEventListener('input', function (e) {
  var input = e.target;
  if (input.id === 'edit-user-telefone') input.value = maskTelefone(input.value);
});

/* Delete user */
document.getElementById('btn-confirm-delete-user').addEventListener('click', function () {
  var userId = deleteUserState.userId;
  if (!userId) return;
  var idx = ADMIN_MOCK.findIndex(function (u) { return u.id === userId; });
  var deletedName = idx !== -1 ? ADMIN_MOCK[idx].nome : '';
  if (idx !== -1) ADMIN_MOCK.splice(idx, 1);
  recentImportedUserIds = recentImportedUserIds.filter(function (id) { return id !== userId; });
  deleteUserState.userId = null;
  closeActionModal();
  renderKPIs();
  renderUsers();
  if (deletedName) showAdminFeedback('Usuário ' + deletedName + ' excluído com sucesso.', 'danger');
});

document.getElementById('btn-cancel-delete-user').addEventListener('click', closeActionModal);

/* User grid — edit / delete delegation */
document.getElementById('admin-users-grid').addEventListener('click', function (e) {
  var btn = e.target.closest('[data-user-action]');
  if (!btn) return;
  var action = btn.getAttribute('data-user-action');
  var userId = parseInt(btn.getAttribute('data-user-id'), 10);
  if (action === 'edit') openEditUserModal(userId);
  else if (action === 'delete') openDeleteUserModal(userId);
});

/* ============================================
   INIT
   ============================================ */

ThemeSwitcher.init();
Auth.initUserMenu();
applyCampaign(activeCampaignId);
