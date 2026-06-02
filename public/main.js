// ============================================
// CONFIGURACIÓN
// ============================================
const JSON_URL = '/api/resultados-v2';

// ============================================
// FORMATEAR DINERO
// ============================================
function formatearDinero(n) {
  if (!n || isNaN(n)) return null;
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1).replace(/\.0$/, '') + ' Mil Millones';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1).replace(/\.0$/, '') + ' Millones';
  return '$' + n.toLocaleString('es');
}

// ============================================
// FORMATEAR FECHA
// ============================================
function formatearFecha(str) {
  if (!str) return '—';
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const dias  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const [y, m, d] = str.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${dias[date.getDay()]}, ${d} de ${meses[m - 1]} de ${y}`;
}

// ============================================
// PRÓXIMO SORTEO (fallback si no viene en JSON)
// ============================================
function calcularProximoSorteo() {
  const ahora = new Date();
  const utc = ahora.getTime() + ahora.getTimezoneOffset() * 60000;
  const et  = new Date(utc - 5 * 3600000);
  const dia  = et.getDay();
  const hora = et.getHours();
  const diasSorteo = [1, 3, 6];
  let offset = 0;
  for (let i = 0; i <= 7; i++) {
    const d = (dia + i) % 7;
    if (diasSorteo.includes(d)) {
      if (i === 0 && hora < 23) { offset = 0; break; }
      if (i > 0) { offset = i; break; }
    }
  }
  const fecha = new Date(et);
  fecha.setDate(fecha.getDate() + offset);
  const diasNom  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const mesesNom = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${diasNom[fecha.getDay()]} ${fecha.getDate()} ${mesesNom[fecha.getMonth()]}`;
}

// ============================================
// HELPER
// ============================================
function setTextoOPendiente(el, valor, fallback) {
  if (!el) return;
  fallback = fallback || 'Se actualizará pronto';
  if (valor) {
    el.textContent = valor;
    el.classList.remove('text-gray-500', 'text-base');
  } else {
    el.textContent = fallback;
    el.classList.add('text-gray-500', 'text-base');
  }
}

// ============================================
// CARGAR RESULTADOS
// ============================================
async function cargarResultados() {
  try {
    const response = await fetch(JSON_URL + '?t=' + Date.now(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error('No se pudieron cargar los resultados.');

    const data = await response.json();
    const s = data.sorteo;
    const p = data.proximo_sorteo;

    if (!s || !Array.isArray(s.blancos) || s.powerball === undefined) {
      throw new Error('Datos incompletos en la respuesta');
    }

    const skeletonCard = document.getElementById('skeleton-card');
    const realCard     = document.getElementById('real-card');
    const errorCard    = document.getElementById('error-card');

    if (skeletonCard) skeletonCard.style.display = 'none';
    if (errorCard)    errorCard.classList.add('hidden');
    if (realCard)     realCard.classList.remove('hidden');

    const fechaSorteoEl = document.getElementById('fecha-sorteo');
    if (fechaSorteoEl) fechaSorteoEl.textContent = formatearFecha(s.fecha);

    const blancosEl = document.getElementById('blancos');
    if (blancosEl) {
      blancosEl.innerHTML = s.blancos.map(function(n) {
        return '<div class="ball-white">' + n + '</div>';
      }).join('');
    }

    const pbBallEl = document.getElementById('pb-ball');
    if (pbBallEl) pbBallEl.textContent = s.powerball;

    const ppValueEl = document.getElementById('pp-value');
    if (ppValueEl) ppValueEl.textContent = (s.powerplay || 2) + 'x';

    const jackpotStatusEl = document.getElementById('jackpot-status');
    if (jackpotStatusEl) {
      if (s.jackpot_ganado) {
        jackpotStatusEl.innerHTML = '<span class="text-green-400 font-semibold">✅ ¡Jackpot ganado' + (s.ganador_estado ? ' en ' + s.ganador_estado : '') + '!</span>';
      } else {
        jackpotStatusEl.innerHTML = '<span class="text-gray-400">❌ Nadie ganó el jackpot — se acumula para el próximo sorteo</span>';
      }
    }

    const proximoSorteoEl = document.getElementById('proximo-sorteo');
    if (proximoSorteoEl) {
      const fechaProximo = (p && p.fecha) ? formatearFecha(p.fecha) : calcularProximoSorteo();
      proximoSorteoEl.textContent = 'Próximo sorteo: ' + fechaProximo;
    }

    setTextoOPendiente(document.getElementById('premio-est'), p && p.premio_estimado ? formatearDinero(p.premio_estimado) : null);
    setTextoOPendiente(document.getElementById('premio-ef'),  p && p.premio_efectivo ? formatearDinero(p.premio_efectivo) : null);

    const ultimaActEl = document.getElementById('ultima-act');
    if (ultimaActEl && data.fecha_actualizacion) {
      ultimaActEl.textContent = 'Actualizado: ' + data.fecha_actualizacion;
    }

  } catch (err) {
    console.error('Error cargando resultados:', err);
    var skeletonCard = document.getElementById('skeleton-card');
    var realCard     = document.getElementById('real-card');
    var errorCard    = document.getElementById('error-card');
    if (skeletonCard) skeletonCard.style.display = 'none';
    if (realCard)     realCard.classList.add('hidden');
    if (errorCard)    errorCard.classList.remove('hidden');
  }
}

// ============================================
// MENÚ MÓVIL
// ============================================
function initMobileMenu() {
  var menuBtn    = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('hidden');
    var icon = menuBtn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
      lucide.createIcons();
    }
  });

  mobileMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenu.classList.add('hidden');
      var icon = menuBtn.querySelector('i');
      if (icon) { icon.setAttribute('data-lucide', 'menu'); lucide.createIcons(); }
    });
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// ============================================
// SCROLL TO TOP
// ============================================
function initScrollToTop() {
  var scrollBtn = document.getElementById('scrollTop');
  if (!scrollBtn) return;

  var scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      scrollBtn.classList.toggle('visible', window.scrollY > 300);
    }, 100);
  });

  scrollBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// AÑO DINÁMICO
// ============================================
function updateCurrentYear() {
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ============================================
// INTERSECTION OBSERVER PARA ANIMACIONES
// ============================================
function initIntersectionObserver() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) entry.target.classList.add('animate-in');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.step-card').forEach(function(card) {
    observer.observe(card);
  });
}

// ============================================
// LUCIDE ICONS
// ============================================
function initLucideIcons() {
  if (typeof lucide !== 'undefined') {
    try { lucide.createIcons(); } catch (e) { console.warn('Lucide error:', e); }
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initLucideIcons();
  updateCurrentYear();

  // Solo cargar resultados si la página de resultados está presente
  if (document.getElementById('skeleton-card')) {
    cargarResultados();
    setInterval(cargarResultados, 5 * 60 * 1000);
  }

  initMobileMenu();
  initSmoothScroll();
  initScrollToTop();
  initIntersectionObserver();
});

window.addEventListener('error', function(e) { console.error('Error global:', e.error); });
window.addEventListener('unhandledrejection', function(e) { console.error('Promise rechazada:', e.reason); });

if ('requestIdleCallback' in window) {
  requestIdleCallback(function() { fetch(JSON_URL, { cache: 'force-cache' }).catch(function() {}); });
}
