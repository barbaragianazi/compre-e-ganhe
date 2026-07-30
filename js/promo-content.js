/* ============================================
   PROMO CONTENT — swap hero/benefits copy for "Mix Turbinado"
   Text nodes are marked with data-promo="..." (textContent) or
   data-promo-html="..." (innerHTML, for markup like <br>).
   Whole blocks are marked with data-combo-visible="<comboId>"
   (or "default" for the block shown when no specific combo matches).
   Any combo other than mix-turbinado keeps the original
   (captured on first run) content untouched.
   ============================================ */

(function () {
  var PROMO_CONTENT = {
    'mix-turbinado': {
      'eyebrow': '1º período da campanha TRIMESTRAL - 2026 • 01/05 à 30/06',
      'title-1': 'Combine.',
      'title-2': 'Turbine.',
      'title-3': 'Multiplique.',
      'subtitle': 'O Mix Turbinado está chegando: uma nova forma de combinar produtos participantes e acelerar seus ganhos na campanha.',
      'meta-participants': '+1.200',
      'meta-gifts': '48',
      'benefits-eyebrow': 'Como funciona o Mix Turbinado',
      'gifts-eyebrow': 'Recompensas do Mix Turbinado',
      'gifts-subtitle': 'Os melhores colocados em cada cluster — Bronze, Prata e Ouro — garantem premiação em dinheiro ao final de cada campanha trimestral.',
    },
  };

  var PROMO_CONTENT_HTML = {
    'mix-turbinado': {
      'benefits-title': 'As regras do<br />Mix Turbinado',
      'gifts-title': 'Prêmios que<br />valorizam o mix',
    },
  };

  var originalText = null;
  var originalHtml = null;

  function applyTextContent(activeView) {
    var elements = Array.prototype.slice.call(document.querySelectorAll('[data-promo]'));
    if (!elements.length) return;

    if (!originalText) {
      originalText = {};
      elements.forEach(function (el) {
        originalText[el.dataset.promo] = el.textContent;
      });
    }
    var content = PROMO_CONTENT[activeView];

    elements.forEach(function (el) {
      var key = el.dataset.promo;
      el.textContent = (content && content[key]) ? content[key] : originalText[key];
    });
  }

  function applyHtmlContent(activeView) {
    var elements = Array.prototype.slice.call(document.querySelectorAll('[data-promo-html]'));
    if (!elements.length) return;

    if (!originalHtml) {
      originalHtml = {};
      elements.forEach(function (el) {
        originalHtml[el.dataset.promoHtml] = el.innerHTML;
      });
    }
    var content = PROMO_CONTENT_HTML[activeView];

    elements.forEach(function (el) {
      var key = el.dataset.promoHtml;
      el.innerHTML = (content && content[key]) ? content[key] : originalHtml[key];
    });
  }

  function applyComboVisibility(activeView) {
    var groups = Array.prototype.slice.call(document.querySelectorAll('[data-combo-visible]'));
    if (!groups.length) return;

    var hasSpecificMatch = groups.some(function (el) {
      return el.dataset.comboVisible === activeView;
    });

    groups.forEach(function (el) {
      var isDefaultGroup = el.dataset.comboVisible === 'default';
      var shouldShow = isDefaultGroup ? !hasSpecificMatch : el.dataset.comboVisible === activeView;
      var wasHidden = el.hidden;
      el.hidden = !shouldShow;
      /* .benefits__grid sets display:grid in styles.css, which (author
         origin) beats the browser's default [hidden]{display:none} rule
         (user-agent origin) regardless of specificity — so the hidden
         attribute alone doesn't actually hide it. Force it inline. */
      el.style.display = shouldShow ? '' : 'none';

      if (wasHidden && shouldShow) {
        if (el.classList.contains('reveal')) el.classList.add('revealed');
        el.querySelectorAll('.reveal').forEach(function (revealEl) {
          revealEl.classList.add('revealed');
        });
      }
    });
  }

  function applyPromoContent() {
    var activeView = (typeof Auth !== 'undefined' && Auth.getRankingView) ? Auth.getRankingView() : null;
    applyTextContent(activeView);
    applyHtmlContent(activeView);
    applyComboVisibility(activeView);
  }

  document.addEventListener('DOMContentLoaded', applyPromoContent);
  window.addEventListener('ranking-view:changed', applyPromoContent);
})();
