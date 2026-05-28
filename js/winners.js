/* ============================================
   WINNERS PAGE — Logic
   ============================================ */

/* ============================================
   MOCK DATA
   ============================================ */

const mockAwards = {
  2026: {
    janeiro: {
      performanceWinners: [
        {
          place: 1,
          name: 'R. Pereira',
          kpi: 'Pontos acumulados',
          result: '10.820 pontos',
          prize: 'Smart TV 55"',
          prizeDesc: 'Televisão premium para o melhor desempenho da campanha.',
          img: 'assets/images/iphone.webp',
        },
        {
          place: 2,
          name: 'C. Alves',
          kpi: 'Meta de compras',
          result: '103% da meta',
          prize: 'Headphones Sony',
          prizeDesc: 'Áudio de alta fidelidade para acompanhar a rotina.',
          img: 'assets/images/airpads.jpg',
        },
        {
          place: 3,
          name: 'F. Lima',
          kpi: 'Quantidade de compras',
          result: '74 compras',
          prize: 'Smartwatch Garmin',
          prizeDesc: 'Relógio inteligente com monitoramento avançado.',
          img: 'assets/images/watch.webp',
        },
      ],
      luckyNumberWinners: [
        { ticket: '10291', name: 'Ana Souza',       prize: 'Mochila notebook'   },
        { ticket: '38472', name: 'Bruno Costa',     prize: 'Squeeze térmica'    },
        { ticket: '57831', name: 'Carla Mendes',    prize: 'Kit escritório'     },
        { ticket: '62910', name: 'Diego Nunes',     prize: 'Chaveiro metálico'  },
        { ticket: '74103', name: 'Elena Rocha',     prize: 'Caderno premium'    },
        { ticket: '81234', name: 'Felipe Torres',   prize: 'Garrafa térmica'    },
        { ticket: '93102', name: 'Gabi Faria',      prize: 'Pasta executiva'    },
        { ticket: '20481', name: 'Henrique Dias',   prize: 'Caneta premium'     },
        { ticket: '45671', name: 'Isabela Pinto',   prize: 'Kit vinho'          },
        { ticket: '59023', name: 'João Ribeiro',    prize: 'Mochila compacta'   },
      ],
    },
    fevereiro: {
      performanceWinners: [
        {
          place: 1,
          name: 'L. Gomes',
          kpi: 'Pontos acumulados',
          result: '11.340 pontos',
          prize: 'iPhone 16 Pro',
          prizeDesc: 'Smartphone topo de linha para o melhor da campanha.',
          img: 'assets/images/iphone.webp',
        },
        {
          place: 2,
          name: 'V. Barbosa',
          kpi: 'Meta de compras',
          result: '115% da meta',
          prize: 'AirPods Pro',
          prizeDesc: 'Áudio premium sem fio para o dia a dia.',
          img: 'assets/images/airpads.jpg',
        },
        {
          place: 3,
          name: 'T. Cardoso',
          kpi: 'Quantidade de compras',
          result: '80 compras',
          prize: 'Apple Watch SE',
          prizeDesc: 'Smartwatch com recursos essenciais de saúde.',
          img: 'assets/images/watch.webp',
        },
      ],
      luckyNumberWinners: [
        { ticket: '11432', name: 'Marina Oliveira',  prize: 'Kit churrasco'      },
        { ticket: '29103', name: 'Pedro Almeida',    prize: 'Mochila notebook'   },
        { ticket: '48291', name: 'Renata Souza',     prize: 'Squeeze térmica'    },
        { ticket: '67034', name: 'Samuel Lopes',     prize: 'Kit escritório'     },
        { ticket: '73918', name: 'Tatiane Ferreira', prize: 'Caderno premium'    },
        { ticket: '82047', name: 'Ulisses Costa',    prize: 'Garrafa térmica'    },
        { ticket: '94512', name: 'Vera Ramos',       prize: 'Pasta executiva'    },
        { ticket: '30184', name: 'Wagner Dias',      prize: 'Caneta premium'     },
        { ticket: '56723', name: 'Xuxa Lima',        prize: 'Kit vinho'          },
        { ticket: '68901', name: 'Yara Pinto',       prize: 'Mochila compacta'   },
      ],
    },
    março: {
      performanceWinners: [
        {
          place: 1,
          name: 'R. Martins',
          kpi: 'Pontos acumulados',
          result: '11.900 pontos',
          prize: 'MacBook Air M3',
          prizeDesc: 'Notebook premium para o melhor desempenho da campanha.',
          img: 'assets/images/iphone.webp',
        },
        {
          place: 2,
          name: 'K. Nogueira',
          kpi: 'Meta de compras',
          result: '110% da meta',
          prize: 'AirPods Pro 2',
          prizeDesc: 'Cancelamento ativo de ruído e áudio espacial.',
          img: 'assets/images/airpads.jpg',
        },
        {
          place: 3,
          name: 'S. Araújo',
          kpi: 'Quantidade de compras',
          result: '82 compras',
          prize: 'Apple Watch Ultra',
          prizeDesc: 'Smartwatch robusto para os mais exigentes.',
          img: 'assets/images/watch.webp',
        },
      ],
      luckyNumberWinners: [
        { ticket: '13421', name: 'André Borges',    prize: 'Kit churrasco'      },
        { ticket: '27834', name: 'Bia Castro',      prize: 'Mochila notebook'   },
        { ticket: '49201', name: 'Cássio Melo',     prize: 'Squeeze térmica'    },
        { ticket: '64739', name: 'Daniela Vieira',  prize: 'Kit escritório'     },
        { ticket: '71023', name: 'Eduardo Sá',      prize: 'Caderno premium'    },
        { ticket: '88341', name: 'Flávia Campos',   prize: 'Garrafa térmica'    },
        { ticket: '90217', name: 'Gustavo Moura',   prize: 'Pasta executiva'    },
        { ticket: '32918', name: 'Hélen Santos',    prize: 'Caneta premium'     },
        { ticket: '54601', name: 'Igor Machado',    prize: 'Kit vinho'          },
        { ticket: '67382', name: 'Júlia Pereira',   prize: 'Mochila compacta'   },
      ],
    },
    abril: {
      performanceWinners: [
        {
          place: 1,
          name: 'P. Costa',
          kpi: 'Pontos acumulados',
          result: '12.100 pontos',
          prize: 'iPad Pro',
          prizeDesc: 'Tablet profissional para o melhor desempenho da campanha.',
          img: 'assets/images/iphone.webp',
        },
        {
          place: 2,
          name: 'E. Ferreira',
          kpi: 'Meta de compras',
          result: '106% da meta',
          prize: 'AirPods Max',
          prizeDesc: 'Over-ear premium com áudio de alta fidelidade.',
          img: 'assets/images/airpads.jpg',
        },
        {
          place: 3,
          name: 'N. Souza',
          kpi: 'Quantidade de compras',
          result: '85 compras',
          prize: 'Apple Watch Series 9',
          prizeDesc: 'O smartwatch mais avançado da linha Apple.',
          img: 'assets/images/watch.webp',
        },
      ],
      luckyNumberWinners: [
        { ticket: '15923', name: 'Alice Ramos',     prize: 'Mochila notebook'   },
        { ticket: '28471', name: 'Bernardo Cruz',   prize: 'Squeeze térmica'    },
        { ticket: '41029', name: 'Camile Santos',   prize: 'Kit escritório'     },
        { ticket: '58312', name: 'Danilo Rocha',    prize: 'Chaveiro metálico'  },
        { ticket: '72104', name: 'Eduarda Lima',    prize: 'Caderno premium'    },
        { ticket: '89234', name: 'Fábio Dias',      prize: 'Garrafa térmica'    },
        { ticket: '94017', name: 'Giovana Teixeira',prize: 'Pasta executiva'    },
        { ticket: '31842', name: 'Hugo Martins',    prize: 'Caneta premium'     },
        { ticket: '56029', name: 'Inês Alves',      prize: 'Kit vinho'          },
        { ticket: '67193', name: 'Jorge Menezes',   prize: 'Mochila compacta'   },
      ],
    },
    maio: {
      performanceWinners: [
        {
          place: 1,
          name: 'J. Silva',
          kpi: 'Pontos acumulados',
          result: '12.450 pontos',
          prize: 'iPhone 17 Pro Max',
          prizeDesc: 'Smartphone premium para o melhor desempenho da campanha.',
          img: 'assets/images/iphone.webp',
        },
        {
          place: 2,
          name: 'M. Santos',
          kpi: 'Meta de compras',
          result: '108% da meta',
          prize: 'AirPods Pro',
          prizeDesc: 'Áudio premium para acompanhar a rotina.',
          img: 'assets/images/airpads.jpg',
        },
        {
          place: 3,
          name: 'A. Oliveira',
          kpi: 'Quantidade de compras',
          result: '87 compras',
          prize: 'Apple Watch',
          prizeDesc: 'Smartwatch com monitoramento e conectividade.',
          img: 'assets/images/watch.webp',
        },
      ],
      luckyNumberWinners: [
        { ticket: '93842', name: 'Bárbara Gianazi', prize: 'Mochila notebook'   },
        { ticket: '19482', name: 'Lucas Martins',   prize: 'Squeeze térmica azul'},
        { ticket: '78123', name: 'Fernanda Costa',  prize: 'Kit escritório'     },
        { ticket: '55291', name: 'Rafael Almeida',  prize: 'Chaveiro metálico'  },
        { ticket: '33710', name: 'Patrícia Souza',  prize: 'Caderno premium'    },
        { ticket: '90441', name: 'João Pereira',    prize: 'Garrafa térmica'    },
        { ticket: '12880', name: 'Camila Rocha',    prize: 'Pasta executiva'    },
        { ticket: '66732', name: 'Renata Lima',     prize: 'Caneta premium'     },
        { ticket: '21998', name: 'Diego Fernandes', prize: 'Kit vinho'          },
        { ticket: '48017', name: 'Amanda Ribeiro',  prize: 'Mochila compacta'   },
      ],
    },
    junho: { performanceWinners: [], luckyNumberWinners: [] },
    julho:  { performanceWinners: [], luckyNumberWinners: [] },
    agosto: { performanceWinners: [], luckyNumberWinners: [] },
    setembro:{ performanceWinners: [], luckyNumberWinners: [] },
    outubro: { performanceWinners: [], luckyNumberWinners: [] },
    novembro:{ performanceWinners: [], luckyNumberWinners: [] },
    dezembro:{ performanceWinners: [], luckyNumberWinners: [] },
  },
  2025: {
    janeiro:  { performanceWinners: [], luckyNumberWinners: [] },
    fevereiro:{ performanceWinners: [], luckyNumberWinners: [] },
    março:    { performanceWinners: [], luckyNumberWinners: [] },
    abril:    { performanceWinners: [], luckyNumberWinners: [] },
    maio: {
      performanceWinners: [
        {
          place: 1,
          name: 'G. Ribeiro',
          kpi: 'Pontos acumulados',
          result: '9.870 pontos',
          prize: 'Samsung Galaxy S24',
          prizeDesc: 'Smartphone top de linha para o campeão.',
          img: 'assets/images/iphone.webp',
        },
        {
          place: 2,
          name: 'H. Machado',
          kpi: 'Meta de compras',
          result: '104% da meta',
          prize: 'Galaxy Buds Pro',
          prizeDesc: 'Fones sem fio com cancelamento de ruído.',
          img: 'assets/images/airpads.jpg',
        },
        {
          place: 3,
          name: 'I. Cardoso',
          kpi: 'Quantidade de compras',
          result: '71 compras',
          prize: 'Galaxy Watch 6',
          prizeDesc: 'Smartwatch com design elegante.',
          img: 'assets/images/watch.webp',
        },
      ],
      luckyNumberWinners: [
        { ticket: '41209', name: 'Marcos Vieira',   prize: 'Mochila notebook'   },
        { ticket: '32847', name: 'Natália Souza',   prize: 'Squeeze térmica'    },
        { ticket: '56190', name: 'Osvaldo Lima',    prize: 'Kit escritório'     },
        { ticket: '73021', name: 'Paula Rocha',     prize: 'Chaveiro metálico'  },
        { ticket: '84913', name: 'Quirino Alves',   prize: 'Caderno premium'    },
        { ticket: '90132', name: 'Rosa Carvalho',   prize: 'Garrafa térmica'    },
        { ticket: '17048', name: 'Sérgio Dias',     prize: 'Pasta executiva'    },
        { ticket: '29841', name: 'Tânia Ferreira',  prize: 'Caneta premium'     },
        { ticket: '45902', name: 'Ubirajara Melo',  prize: 'Kit vinho'          },
        { ticket: '63017', name: 'Valéria Nunes',   prize: 'Mochila compacta'   },
      ],
    },
    junho:    { performanceWinners: [], luckyNumberWinners: [] },
    julho:    { performanceWinners: [], luckyNumberWinners: [] },
    agosto:   { performanceWinners: [], luckyNumberWinners: [] },
    setembro: { performanceWinners: [], luckyNumberWinners: [] },
    outubro:  { performanceWinners: [], luckyNumberWinners: [] },
    novembro:  { performanceWinners: [], luckyNumberWinners: [] },
    dezembro:  { performanceWinners: [], luckyNumberWinners: [] },
  },
};

/* ============================================
   STATE
   ============================================ */

const state = {
  year: 2026,
  month: 'maio',
  activeTab: 'performance',
};

/* ============================================
   HELPERS
   ============================================ */

const PLACE_MEDALS = ['🥇', '🥈', '🥉'];
const PLACE_LABELS = ['1º lugar', '2º lugar', '3º lugar'];
const PLACE_CLASSES = ['first', 'second', 'third'];

function getPeriodData() {
  return (mockAwards[state.year]?.[state.month]) || { performanceWinners: [], luckyNumberWinners: [] };
}

/* ============================================
   RENDER — PÓDIO
   ============================================ */

function renderPodium(winners) {
  const container = document.getElementById('podiumContainer');
  if (!container) return;

  if (!winners.length) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:var(--sp-10) 0; color:var(--neutral-400); font-size:var(--text-sm); font-weight:600;">
        Nenhum dado disponível para este período.
      </div>`;
    return;
  }

  container.innerHTML = winners.map((w, i) => {
    const cls = PLACE_CLASSES[i];
    return `
      <article class="podium__card podium__card--${cls} reveal reveal-delay-${i + 1}" aria-label="${PLACE_LABELS[i]}: ${w.name}">
        <div class="podium__card-img">
          <img src="${w.img}" alt="${w.prize}" loading="lazy" />
        </div>
        <div class="podium__card-body">
          <div class="podium__card-top">
            <span class="podium__card-badge">${PLACE_LABELS[i]}</span>
            <span class="podium__card-medal" aria-hidden="true">${PLACE_MEDALS[i]}</span>
          </div>
          <p class="podium__card-name">${w.name}</p>
          <p class="podium__card-kpi">${w.kpi}</p>
          <p class="podium__card-result">${w.result}</p>
          <div class="podium__card-divider" aria-hidden="true"></div>
          <p class="podium__card-prize">${w.prize}</p>
          <p class="podium__card-prize-desc">${w.prizeDesc}</p>
          <button class="podium__card-btn" data-modal-type="performance">Ver detalhes</button>
        </div>
      </article>`;
  }).join('');

  reobserveReveal();
  bindModalTriggers();
}

/* ============================================
   RENDER — TABELA
   ============================================ */

function renderPerfTable(winners) {
  const tbody = document.getElementById('perfTableBody');
  if (!tbody) return;

  if (!winners.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:var(--sp-5);color:var(--neutral-400);">Nenhum dado disponível para este período.</td></tr>`;
    return;
  }

  tbody.innerHTML = winners.map((w, i) => `
    <tr>
      <td>
        <span class="perf-table__pos">
          <span class="perf-table__pos-medal" aria-hidden="true">${PLACE_MEDALS[i]}</span>
          ${PLACE_LABELS[i]}
        </span>
      </td>
      <td class="perf-table__name">${w.name}</td>
      <td class="perf-table__kpi">${w.kpi}</td>
      <td class="perf-table__result">${w.result}</td>
      <td class="perf-table__prize">${w.prize}</td>
    </tr>`).join('');
}

/* ============================================
   RENDER — LISTA LUCKY
   ============================================ */

function renderLuckyList(winners) {
  const container = document.getElementById('luckyListContainer');
  if (!container) return;

  if (!winners.length) {
    container.innerHTML = `
      <div style="text-align:center; padding:var(--sp-10) 0; color:var(--neutral-400); font-size:var(--text-sm); font-weight:600;">
        Nenhum dado disponível para este período.
      </div>`;
    return;
  }

  container.innerHTML = winners.map((w, i) => `
    <div class="lucky-item reveal reveal-delay-${Math.min(i + 1, 5)}" role="listitem">
      <span class="lucky-item__rank" aria-hidden="true">${i + 1}</span>
      <span class="lucky-item__ticket">
        <span class="lucky-item__ticket-icon" aria-hidden="true">🎟️</span>
        ${w.ticket}
      </span>
      <div class="lucky-item__info">
        <span class="lucky-item__name">${w.name}</span>
        <span class="lucky-item__prize">${w.prize}</span>
      </div>
      <button class="lucky-item__btn" data-modal-type="lucky" aria-label="Ver detalhes do ganhador ${w.name}">Ver detalhes</button>
    </div>`).join('');

  reobserveReveal();
  bindModalTriggers();
}

/* ============================================
   RENDER PRINCIPAL
   ============================================ */

function renderAll() {
  const data = getPeriodData();
  renderPodium(data.performanceWinners);
  renderPerfTable(data.performanceWinners);
  renderLuckyList(data.luckyNumberWinners);
}

/* ============================================
   TABS
   ============================================ */

function initTabs() {
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      state.activeTab = target;

      tabs.forEach(t => {
        t.classList.remove('awards-switch__card--active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('awards-switch__card--active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        const isTarget = panel.id === `panel-${target}`;
        if (isTarget) {
          panel.removeAttribute('hidden');
          panel.classList.remove('awards-panel--hidden');
        } else {
          panel.setAttribute('hidden', '');
          panel.classList.add('awards-panel--hidden');
        }
      });
    });
  });
}

/* ============================================
   FILTERS
   ============================================ */

function initFilters() {
  const yearSel  = document.getElementById('filterYear');
  const monthSel = document.getElementById('filterMonth');
  if (!yearSel || !monthSel) return;

  yearSel.addEventListener('change', () => {
    state.year = Number(yearSel.value);
    renderAll();
  });

  monthSel.addEventListener('change', () => {
    state.month = monthSel.value;
    renderAll();
  });
}

/* ============================================
   MODAL
   ============================================ */

const MODAL_CRITERIA = {
  performance: 'Classificação oficial do ranking da campanha baseado nos KPIs do período.',
  lucky: 'Sorteio realizado entre os números da sorte gerados por notas fiscais cadastradas.',
};

function openModal(type) {
  const modal    = document.getElementById('detailsModal');
  const criteria = document.getElementById('modalCriteria');
  if (!modal) return;

  if (criteria) criteria.textContent = MODAL_CRITERIA[type] || MODAL_CRITERIA.performance;

  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.winners-modal__close')?.focus();
}

function closeModal() {
  const modal = document.getElementById('detailsModal');
  if (!modal) return;
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

function bindModalTriggers() {
  document.querySelectorAll('[data-modal-type]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modalType));
  });
}

function initModal() {
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ============================================
   SCROLL REVEAL
   ============================================ */

let revealObserver = null;

function initScrollReveal() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function reobserveReveal() {
  if (!revealObserver) return;
  document.querySelectorAll('.reveal:not(.revealed)').forEach(el => revealObserver.observe(el));
}

/* ============================================
   HEADER / MOBILE NAV
   ============================================ */

function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileNav() {
  const toggle = document.querySelector('.header__menu-toggle');
  const nav    = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   GUARD
   ============================================ */

function guardRoute() {
  if (typeof Auth === 'undefined' || !Auth.isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

/* ============================================
   INIT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  guardRoute();
  ThemeSwitcher.init();
  Auth.initUserMenu();
  initHeader();
  initMobileNav();
  initScrollReveal();
  initTabs();
  initFilters();
  initModal();
  renderAll();
});
