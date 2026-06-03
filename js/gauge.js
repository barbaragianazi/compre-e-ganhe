/* ============================================
   GAUGE — Circular SVG Progress Component
   Reutilizável via classe .gauge
   ============================================ */

const Gauge = (() => {

  const SIZES         = { tiny: 20,  small: 32,  medium: 64,  large: 128 };
  const STROKE_WIDTHS = { tiny: 2.5, small: 3.5, medium: 6,   large: 10  };

  function getColor(value) {
    if (value <= 33) return '#e2162a';
    if (value <= 67) return '#ffae00';
    return '#00ac3a';
  }

  function createSVG(size, radius, sw) {
    const cx          = size / 2;
    const cy          = size / 2;
    const circumference = 2 * Math.PI * radius;
    const NS          = 'http://www.w3.org/2000/svg';

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('width',  size);
    svg.setAttribute('height', size);
    svg.setAttribute('aria-hidden', 'true');

    const track = document.createElementNS(NS, 'circle');
    track.setAttribute('cx', cx);
    track.setAttribute('cy', cy);
    track.setAttribute('r',  radius);
    track.setAttribute('fill', 'none');
    track.setAttribute('stroke-width', sw);
    track.classList.add('gauge__track');

    const progress = document.createElementNS(NS, 'circle');
    progress.setAttribute('cx', cx);
    progress.setAttribute('cy', cy);
    progress.setAttribute('r',  radius);
    progress.setAttribute('fill', 'none');
    progress.setAttribute('stroke-width', sw);
    progress.setAttribute('stroke-linecap', 'round');
    progress.setAttribute('stroke-dasharray',  circumference);
    progress.setAttribute('stroke-dashoffset', circumference);
    progress.setAttribute('transform', `rotate(-90 ${cx} ${cy})`);
    progress.classList.add('gauge__progress');

    svg.appendChild(track);
    svg.appendChild(progress);

    return { svg, progress, circumference };
  }

  function initGauge(el) {
    const sizeName  = el.dataset.size || 'medium';
    const size      = SIZES[sizeName]         || SIZES.medium;
    const sw        = STROKE_WIDTHS[sizeName]  || STROKE_WIDTHS.medium;
    const radius    = (size - sw) / 2;
    const target    = Math.min(100, Math.max(0, parseFloat(el.dataset.value) || 0));
    const showValue = el.dataset.showValue === 'true' && sizeName !== 'tiny';

    el.classList.add('gauge--initialized');

    el.setAttribute('role',          'progressbar');
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '100');
    el.setAttribute('aria-valuenow', '0');

    const { svg, progress, circumference } = createSVG(size, radius, sw);
    el.appendChild(svg);

    let label = null;
    if (showValue) {
      label = document.createElement('span');
      label.className = 'gauge__label';
      label.style.fontSize = Math.max(8, Math.floor(size * 0.155)) + 'px';
      label.textContent = '0%';
      el.appendChild(label);
    }

    el._gaugeState = { circumference, progress, label };

    animateTo(el, target, true);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateTo(el, target, fromZero) {
    const state = el._gaugeState;
    if (!state) return;

    if (el._gaugeRafId) cancelAnimationFrame(el._gaugeRafId);

    const { circumference, progress, label } = state;
    const startValue = fromZero ? 0 : (parseFloat(el.getAttribute('aria-valuenow')) || 0);
    const endValue   = Math.min(100, Math.max(0, target));
    const duration   = 1200;
    const startTime  = performance.now();

    function frame(now) {
      const t      = Math.min((now - startTime) / duration, 1);
      const eased  = easeOutCubic(t);
      const value  = startValue + (endValue - startValue) * eased;
      const color  = getColor(value);
      const offset = circumference * (1 - value / 100);

      progress.setAttribute('stroke-dashoffset', offset);
      progress.setAttribute('stroke', color);

      if (label) label.textContent = Math.round(value) + '%';

      el.setAttribute('aria-valuenow', Math.round(value));

      if (t < 1) {
        el._gaugeRafId = requestAnimationFrame(frame);
      } else {
        el.setAttribute('aria-valuenow', endValue);
        el.dataset.value = endValue;
        el._gaugeRafId   = null;
      }
    }

    el._gaugeRafId = requestAnimationFrame(frame);
  }

  function setValue(el, newValue) {
    if (!el._gaugeState) {
      el.dataset.value = newValue;
      initGauge(el);
    } else {
      animateTo(el, newValue, false);
    }
  }

  function init() {
    document.querySelectorAll('.gauge:not(.gauge--initialized)').forEach(initGauge);
  }

  return { init, setValue, initGauge };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Gauge.init());
} else {
  Gauge.init();
}
