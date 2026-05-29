/* ============================================
   SHARED CAMPAIGN SELECTOR
   ============================================ */

(function () {
  var CAMPAIGN_KEY = 'lp_admin_selected_campaign';
  var CAMPAIGN_PER_PAGE = 6;
  var campaignFilter = 'all';
  var campaignPage = 1;

  var campaigns = [
    { id: 'simparic-trio', title: 'Simparic Trio — Compre & Ganhe', category: 'brindes', label: 'Brindes', validity: '31/12/2026', desc: 'Acumule pontos para resgatar brindes exclusivos.', factor: 1.00, image: 'assets/images/simparic-trio.png', cardClass: 'promo-card--c1', badgeClass: 'brindes', participants: '1.204', captured: 'R$ 284k' },
    { id: 'apoquel', title: 'Apoquel — Bonificação Progressiva', category: 'bonificacao', label: 'Bonificação', validity: '30/11/2026', desc: 'Bonificação por volume de compras e metas atingidas.', factor: 0.82, image: 'assets/images/apoquel.png', cardClass: 'promo-card--c2', badgeClass: 'bonificacao', participants: '876', captured: 'R$ 198k' },
    { id: 'vanguard-plus', title: 'Vanguard Plus — Dose Extra', category: 'compre-ganhe ending', label: 'Compre e ganhe', validity: '15/10/2026', desc: 'Doses adicionais para ampliar a cobertura vacinal.', factor: 0.64, image: 'assets/images/vanguard.jpg', cardClass: 'promo-card--c3', badgeClass: 'compre-ganhe', participants: '532', captured: 'R$ 96k' },
    { id: 'revolution-plus', title: 'Revolution Plus — Prêmios para Felinos', category: 'brindes', label: 'Brindes', validity: '31/12/2026', desc: 'Troque pontos por prêmios selecionados para felinos.', factor: 0.58, image: 'assets/images/revolution-plus.webp', cardClass: 'promo-card--c4', badgeClass: 'brindes', participants: '445', captured: 'R$ 112k' },
    { id: 'cerenia', title: 'Cerenia — Bônus por Volume', category: 'bonificacao ending', label: 'Bonificação', validity: '20/10/2026', desc: 'Créditos para próximas compras ao atingir metas.', factor: 0.46, image: 'assets/images/cerenia.webp', cardClass: 'promo-card--c5', badgeClass: 'bonificacao', participants: '318', captured: 'R$ 74k' },
    { id: 'convenia', title: 'Convenia — Kit Clínica', category: 'compre-ganhe', label: 'Compre e ganhe', validity: '31/12/2026', desc: 'Materiais e equipamentos de apoio clínico.', factor: 0.72, image: 'assets/images/convenia.png', cardClass: 'promo-card--c6', badgeClass: 'compre-ganhe', participants: '621', captured: 'R$ 143k' }
  ];

  var filters = [
    { id: 'all', label: 'Todas' },
    { id: 'bonificacao', label: 'Bonificação' },
    { id: 'brindes', label: 'Brindes' },
    { id: 'compre-ganhe', label: 'Compre e ganhe' },
    { id: 'ending', label: 'Termina em breve' }
  ];

  var names = {
    'simparic-trio': ['Carlos Eduardo Silva', 'Marina Silva Costa', 'Roberto Oliveira Santos', 'Juliana Costa Pereira', 'Fernando Almeida Souza', 'Camila Ferreira Santos', 'Gustavo Ribeiro Almeida', 'Amanda Pereira Lima', 'Paulo Mendes Rocha', 'Beatriz Gomes Martins', 'Lucas Ferreira Gomes', 'Sophia Martins Souza', 'Rafael Almeida Costa', 'Larissa Ribeiro Santos', 'Henrique Oliveira Lima', 'Daniela Costa Fernandes'],
    apoquel: ['Ana Luiza Martins', 'Bruno Carvalho Reis', 'Clara Mendes Alves', 'Diego Nogueira Lima', 'Elisa Prado Rocha', 'Felipe Antunes Moraes', 'Gabriela Torres Campos', 'Igor Santana Freire', 'Joana Vieira Castro', 'Leandro Pires Cunha', 'Manuela Batista Leal', 'Nicolas Ramos Teixeira', 'Olivia Duarte Farias', 'Pedro Henrique Matos', 'Renata Assis Moreira', 'Tiago Barbosa Neves'],
    'vanguard-plus': ['Aline Furtado Melo', 'Bernardo Cunha Lopes', 'Carolina Braga Reis', 'Danilo Martins Xavier', 'Eduarda Lima Paiva', 'Fabio Correia Dutra', 'Giovana Rocha Teles', 'Helena Sampaio Castro', 'Isabela Franca Moura', 'Jorge Melo Batista', 'Karen Nunes Prado', 'Leonardo Sales Amaral', 'Marcela Viana Pinto', 'Otavio Barros Lins', 'Patricia Gomes Rocha', 'Vinicius Costa Braga'],
    'revolution-plus': ['Alice Tavares Pinho', 'Breno Moura Duarte', 'Cecilia Matos Ribeiro', 'Davi Almeida Farias', 'Estela Freitas Gomes', 'Flavio Vieira Ramos', 'Heloisa Cardoso Lima', 'Iuri Campos Nobre', 'Julia Andrade Neves', 'Kaio Ferreira Torres', 'Laura Barbosa Cunha', 'Miguel Castro Reis', 'Natalia Prado Leite', 'Orlando Pires Rocha', 'Paula Nascimento Melo', 'Sergio Moreira Alves'],
    cerenia: ['Amanda Xavier Teles', 'Caio Ribeiro Nunes', 'Debora Sales Prado', 'Enzo Farias Melo', 'Fernanda Lopes Vieira', 'Guilherme Rocha Cunha', 'Iara Batista Campos', 'Jonas Leal Correia', 'Livia Duarte Sampaio', 'Mateus Costa Pinho', 'Nicole Freire Martins', 'Pietro Moura Reis', 'Raquel Gomes Tavares', 'Samuel Alves Matos', 'Talita Prado Neves', 'Yasmin Ferreira Lima'],
    convenia: ['Arthur Lima Barros', 'Bianca Moreira Sales', 'Cristina Prado Gomes', 'Eduardo Campos Leal', 'Flora Teixeira Rocha', 'Heitor Pires Castro', 'Ingrid Cunha Batista', 'Jose Henrique Souza', 'Leticia Ramos Paiva', 'Murilo Neves Almeida', 'Nathalia Freitas Reis', 'Rafaela Moraes Lima', 'Sandro Vieira Prado', 'Teresa Lopes Farias', 'Valentina Nobre Alves', 'William Rocha Duarte']
  };

  function getActiveId() {
    return localStorage.getItem(CAMPAIGN_KEY) || campaigns[0].id;
  }

  function getActiveCampaign() {
    var activeId = getActiveId();
    return campaigns.find(function (campaign) { return campaign.id === activeId; }) || campaigns[0];
  }

  function setActiveCampaign(campaignId) {
    var campaign = campaigns.find(function (item) { return item.id === campaignId; }) || campaigns[0];
    localStorage.setItem(CAMPAIGN_KEY, campaign.id);
    updateLabels();
    window.dispatchEvent(new CustomEvent('campaign:changed', { detail: { campaign: campaign } }));
    window.requestAnimationFrame(function () {
      if (typeof window.refreshCampaignRanking === 'function') window.refreshCampaignRanking();
      if (typeof window.refreshCampaignWinners === 'function') window.refreshCampaignWinners();
    });
  }

  function buildCampaignMock(baseMock, campaign) {
    if (!Array.isArray(baseMock)) return [];
    if (!campaign || campaign.id === 'simparic-trio') return JSON.parse(JSON.stringify(baseMock));

    var campaignNames = names[campaign.id] || names['simparic-trio'];
    var statusCycle = ['validada', 'aguardando', 'validada', 'excluida', 'validada', 'aguardando'];
    var cityCycle = [
      ['São Paulo', 'SP'], ['Rio de Janeiro', 'RJ'], ['Belo Horizonte', 'MG'], ['Curitiba', 'PR'],
      ['Recife', 'PE'], ['Fortaleza', 'CE'], ['Florianópolis', 'SC'], ['Salvador', 'BA']
    ];

    return baseMock.map(function (user, userIndex) {
      var city = cityCycle[(userIndex + campaign.id.length) % cityCycle.length];
      return {
        id: user.id,
        nome: campaignNames[userIndex] || user.nome,
        email: campaign.id + '.' + user.id + '@email.com',
        cidade: city[0],
        estado: city[1],
        notas: user.notas.map(function (nota, noteIndex) {
          var status = statusCycle[(noteIndex + userIndex + campaign.id.length) % statusCycle.length];
          var value = Math.round((nota.valor * campaign.factor + ((userIndex + 1) * 43) + (noteIndex * 17)) * 100) / 100;
          var month = String(((noteIndex + campaign.id.length) % 5) + 1).padStart(2, '0');
          var day = String(((noteIndex * 3 + userIndex) % 26) + 1).padStart(2, '0');

          return {
            id: (campaigns.findIndex(function (item) { return item.id === campaign.id; }) + 1) * 100000 + nota.id,
            numeroNota: campaign.id.slice(0, 3).toUpperCase() + '-' + String(user.id).padStart(2, '0') + '-' + String(noteIndex + 1).padStart(3, '0'),
            valor: value,
            data: '2026-' + month + '-' + day,
            status: status,
            responsavelLancamento: campaignNames[userIndex] || user.nome,
            arquivoNome: campaign.id + '-nf-' + String(user.id).padStart(2, '0') + '-' + String(noteIndex + 1).padStart(3, '0') + '.jpg',
            justificativa: status === 'excluida' ? 'Nota não atende às regras da campanha ' + campaign.title + '.' : null
          };
        })
      };
    });
  }

  function updateLabels() {
    var campaign = getActiveCampaign();
    document.querySelectorAll('.js-selected-campaign').forEach(function (el) {
      el.textContent = 'Campanha selecionada: ' + campaign.title;
    });
  }

  function openModal() {
    campaignFilter = 'all';
    campaignPage = 1;
    renderModal();
    var modal = document.getElementById('modal-campaign-select');
    var overlay = document.getElementById('modal-overlay');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    overlay?.classList.add('is-open');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    var modal = document.getElementById('modal-campaign-select');
    var overlay = document.getElementById('modal-overlay');
    modal?.classList.remove('is-open');
    modal?.setAttribute('aria-hidden', 'true');
    overlay?.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  function renderModal() {
    renderFilters();
    renderCards();
  }

  function renderFilters() {
    var el = document.getElementById('campaign-modal-filters');
    if (!el) return;
    el.innerHTML = filters.map(function (filter) {
      return '<button class="campaign-modal__filter' + (campaignFilter === filter.id ? ' active' : '') + '" type="button" data-campaign-filter="' + filter.id + '">' +
        '<span>' + filter.label + '</span>' +
        '<span class="campaign-modal__filter-count">' + getFilterCount(filter.id) + '</span>' +
        '</button>';
    }).join('');
  }

  function getFilteredCampaigns() {
    return campaigns.filter(function (campaign) {
      if (campaignFilter === 'all') return true;
      return campaign.category.split(/\s+/).indexOf(campaignFilter) !== -1;
    });
  }

  function getFilterCount(filterId) {
    if (filterId === 'all') return campaigns.length;
    return campaigns.filter(function (campaign) {
      return campaign.category.split(/\s+/).indexOf(filterId) !== -1;
    }).length;
  }

  function renderCards() {
    var el = document.getElementById('campaign-modal-grid');
    if (!el) return;
    var activeId = getActiveId();
    var filtered = getFilteredCampaigns();
    var totalPages = filtered.length ? Math.ceil(filtered.length / CAMPAIGN_PER_PAGE) : 1;
    if (campaignPage > totalPages) campaignPage = totalPages;
    var start = (campaignPage - 1) * CAMPAIGN_PER_PAGE;
    var pageItems = filtered.slice(start, start + CAMPAIGN_PER_PAGE);

    el.innerHTML = pageItems.map(function (campaign) {
      return '<button class="campaign-card ' + campaign.cardClass + (campaign.id === activeId ? ' active' : '') + '" type="button" data-campaign-id="' + campaign.id + '" role="listitem">' +
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
    }).join('') + buildPagination(totalPages, filtered.length);
  }

  function buildPagination(totalPages, totalItems) {
    if (totalItems <= CAMPAIGN_PER_PAGE) return '';
    return '<div class="admin-pagination admin-pagination--modal campaign-modal__pagination">' +
      '<button class="admin-pagination__btn" type="button" data-campaign-page="prev"' + (campaignPage === 1 ? ' disabled' : '') + '>← Anterior</button>' +
      '<span class="admin-pagination__info">Página ' + campaignPage + ' de ' + totalPages + '</span>' +
      '<button class="admin-pagination__btn" type="button" data-campaign-page="next"' + (campaignPage === totalPages ? ' disabled' : '') + '>Próxima →</button>' +
      '</div>';
  }

  function bind() {
    updateLabels();
    document.querySelectorAll('.js-campaign-change, .js-campaign-menu-action').forEach(function (btn) {
      btn.addEventListener('click', openModal);
    });

    document.querySelectorAll('#modal-campaign-select .modal__close, #modal-overlay').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    var campaignModal = document.getElementById('modal-campaign-select');
    campaignModal?.addEventListener('click', function (e) {
      if (e.target !== campaignModal) return;
      closeModal();
    });

    document.getElementById('campaign-modal-filters')?.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-campaign-filter]');
      if (!btn) return;
      campaignFilter = btn.getAttribute('data-campaign-filter');
      campaignPage = 1;
      renderModal();
    });

    document.getElementById('campaign-modal-grid')?.addEventListener('click', function (e) {
      var pageBtn = e.target.closest('[data-campaign-page]');
      if (pageBtn) {
        var totalPages = Math.max(1, Math.ceil(getFilteredCampaigns().length / CAMPAIGN_PER_PAGE));
        var direction = pageBtn.getAttribute('data-campaign-page');
        if (direction === 'prev' && campaignPage > 1) campaignPage--;
        if (direction === 'next' && campaignPage < totalPages) campaignPage++;
        renderCards();
        return;
      }

      var card = e.target.closest('[data-campaign-id]');
      if (!card) return;
      setActiveCampaign(card.getAttribute('data-campaign-id'));
      closeModal();
    });
  }

  window.CampaignSelector = {
    key: CAMPAIGN_KEY,
    campaigns: campaigns,
    names: names,
    init: bind,
    getActiveCampaign: getActiveCampaign,
    setActiveCampaign: setActiveCampaign,
    buildCampaignMock: buildCampaignMock,
    updateLabels: updateLabels,
    openModal: openModal
  };
})();
