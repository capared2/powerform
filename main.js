// ============================================
// CONFIGURACIÓN
// ============================================
const JSON_URL = '/api/resultados-v2';

// ============================================
// DATOS FAQ (generados dinámicamente para DRY)
// ============================================
const FAQS = [
  {
    pregunta: "¿Cuándo se juega el Powerball?",
    respuesta: "El Powerball se juega tres veces por semana: los <strong class=\"text-gray-200\">lunes, miércoles y sábados</strong>. Los sorteos ocurren a las 10:59 PM Eastern Time (ET), lo cual equivale a las 9:59 PM Central Time, 8:59 PM Mountain Time y 7:59 PM Pacific Time."
  },
  {
    pregunta: "¿Cómo jugar al Powerball?",
    respuesta: "Para jugar debes <strong class=\"text-gray-200\">elegir 5 números del 1 al 69</strong> (los blancos) y <strong class=\"text-gray-200\">1 número Powerball del 1 al 26</strong> (el rojo). Compra un boleto en cualquier estado participante por $2 USD. Si quieres multiplicar tus premios menores, agrega el Power Play por $1 adicional."
  },
  {
    pregunta: "¿Cuánto cuesta un boleto de Powerball?",
    respuesta: "Un boleto de Powerball cuesta <strong class=\"text-gray-200\">$2 USD</strong>. Si decides agregar la opción Power Play cuesta <strong class=\"text-gray-200\">$1 USD adicional</strong> (total $3). El Power Play multiplica los premios menores según el multiplicador sorteado (2x, 3x, 4x, 5x o 10x)."
  },
  {
    pregunta: "¿Cuáles son las probabilidades de ganar el Powerball?",
    respuesta: "La probabilidad de ganar el gran premio (jackpot) es <strong class=\"text-gray-200\">1 en 292,201,338</strong>. Sin embargo, hay 9 niveles de premios y la probabilidad de ganar <strong class=\"text-gray-200\">cualquier premio</strong> es mucho mejor: aproximadamente <strong class=\"text-gray-200\">1 en 24.9</strong>."
  },
  {
    pregunta: "¿Qué es el Power Play?",
    respuesta: "El Power Play es una opción opcional por <strong class=\"text-gray-200\">$1 USD adicional</strong>. Si ganas un premio menor (no el jackpot) y tienes Power Play, tu premio se multiplica por el número sorteado ese día. El multiplicador puede ser <strong class=\"text-gray-200\">2x, 3x, 4x, 5x o incluso 10x</strong>. El premio de $1 millón siempre se duplica a $2 millones con Power Play."
  },
  {
    pregunta: "¿Puedo jugar Powerball desde fuera de Estados Unidos?",
    respuesta: "Los boletos oficiales solo se compran físicamente en Estados Unidos, Puerto Rico o Islas Vírgenes. Sin embargo, si tienes <strong class=\"text-gray-200\">familiares o amigos en EE.UU.</strong> ellos pueden comprar el boleto por ti. También existen servicios de mensajería de lotería autorizados que compran boletos en tu nombre."
  },
  {
    pregunta: "¿Premio estimado vs Premio en efectivo, cuál es la diferencia?",
    respuesta: "El <strong class=\"text-gray-200\">Premio Estimado (Annuity)</strong> es el jackpot total que se paga en 30 cuotas anuales que aumentan 5% cada año. El <strong class=\"text-gray-200\">Premio en Efectivo (Lump Sum)</strong> es lo que recibas si cobras todo de un golpe, generalmente el 50–60% del total. En ambos casos se aplican impuestos federales y estatales."
  },
  {
    pregunta: "¿En qué estados se puede jugar Powerball?",
    respuesta: "Powerball se juega en <strong class=\"text-gray-200\">45 estados</strong>: todos excepto Alabama, Alaska, Hawaii, Nevada y Utah. También se juega en <strong class=\"text-gray-200\">Washington DC, Puerto Rico e Islas Vírgenes de EE.UU.</strong> Los resultados son válidos en todos estos territorios."
  }
];

// ============================================
// GENERAR FAQ DINÁMICAMENTE
// ============================================
function renderFaqs() {
  const container = document.getElementById('faq-list');
  if (!container) return;
  
  container.innerHTML = FAQS.map((faq, i) => `
    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/40 transition-colors" onclick="toggleFaq(${i})">
        <div class="flex items-center gap-3 pr-4">
          <i data-lucide="help-circle" class="w-5 h-5 text-red-500 flex-shrink-0"></i>
          <span class="text-white font-medium text-sm">${faq.pregunta}</span>
        </div>
        <i data-lucide="chevron-down" class="w-5 h-5 text-gray-500 faq-chevron flex-shrink-0" id="chevron-${i}"></i>
      </button>
      <div class="faq-body px-5" id="faq-body-${i}">
        <p class="text-gray-400 text-sm leading-relaxed">${faq.respuesta}</p>
      </div>
    </div>
  `).join('');
}

// ============================================
// FAQ ACCORDION
// ============================================
function toggleFaq(index) {
  const body = document.getElementById(`faq-body-${index}`);
  const chevron = document.getElementById(`chevron-${index}`);
  if (!body || !chevron) return;
  
  const isOpen = body.classList.contains('open');

  // Cerrar todos
  FAQS.forEach((_, i) => {
    const b = document.getElementById(`faq-body-${i}`);
    const c = document.getElementById(`chevron-${i}`);
    if (b) b.classList.remove('open');
    if (c) c.classList.remove('open');
  });

  // Si no estaba abierto, abrirlo
  if (!isOpen) {
    body.classList.add('open');
    chevron.classList.add('open');
  }
}

// ============================================
// FORMATEAR DINERO
// ============================================
function formatearDinero(n) {
  if (!n || isNaN(n)) return null;
  
  if (n >= 1e9) {
    return '$' + (n / 1e9).toFixed(1).replace(/\.0$/, '') + ' Mil Millones';
  }
  if (n >= 1e6) {
    return '$' + (n / 1e6).toFixed(1).replace(/\.0$/, '') + ' Millones';
  }
  return '$' + n.toLocaleString('es');
}

// ============================================
// FORMATEAR FECHA
// ============================================
function formatearFecha(str) {
  if (!str) return '—';
  
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
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
  const et = new Date(utc - 5 * 3600000);

  const dia = et.getDay();
  const hora = et.getHours();
  const diasSorteo = [1, 3, 6]; // Lun, Mie, Sab

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

  const diasNom = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const mesesNom = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  return `${diasNom[fecha.getDay()]} ${fecha.getDate()} ${mesesNom[fecha.getMonth()]}`;
}

// ============================================
// HELPER: Mostrar texto con fallback
// ============================================
function setTextoOPendiente(el, valor, fallback = 'Se actualizará pronto') {
  if (!el) return;
  if (valor) {
    el.textContent = valor;
    el.classList.remove('text-gray-500', 'text-base');
  } else {
    el.textContent = fallback;
    el.classList.add('text-gray-500', 'text-base');
  }
}

// ============================================
// CARGAR RESULTADOS (nueva estructura JSON)
// ============================================
async function cargarResultados() {
  try {
    const urlSinCache = `${JSON_URL}?t=${Date.now()}`;
    
    const response = await fetch(urlSinCache, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('No se pudieron cargar los resultados.');
    
    const data = await response.json();

    // ── Desestructurar nueva estructura ──────────────────
    const s = data.sorteo;           // Sorteo actual (números ganadores)
    const p = data.proximo_sorteo;   // Próximo sorteo (jackpot acumulado)

    if (!s || !Array.isArray(s.blancos) || s.powerball === undefined) {
      throw new Error('Datos incompletos en la respuesta');
    }

    // Mostrar card real, ocultar skeleton/error
    const skeletonCard = document.getElementById('skeleton-card');
    const realCard     = document.getElementById('real-card');
    const errorCard    = document.getElementById('error-card');
    
    if (skeletonCard) skeletonCard.style.display = 'none';
    if (errorCard)    errorCard.classList.add('hidden');
    if (realCard)     realCard.classList.remove('hidden');

    // ── SORTEO ACTUAL ─────────────────────────────────────

    // Fecha del sorteo
    const fechaSorteoEl = document.getElementById('fecha-sorteo');
    if (fechaSorteoEl) fechaSorteoEl.textContent = formatearFecha(s.fecha);

    // Bolas blancas
    const blancosEl = document.getElementById('blancos');
    if (blancosEl) {
      blancosEl.innerHTML = s.blancos
        .map(n => `<div class="ball-white">${n}</div>`)
        .join('');
    }

    // Powerball rojo
    const pbBallEl = document.getElementById('pb-ball');
    if (pbBallEl) pbBallEl.textContent = s.powerball;

    // Power Play
    const ppValueEl = document.getElementById('pp-value');
    if (ppValueEl) ppValueEl.textContent = (s.powerplay || 2) + 'x';

    // Estado del jackpot: ¿alguien ganó?
    const jackpotStatusEl = document.getElementById('jackpot-status');
    if (jackpotStatusEl) {
      if (s.jackpot_ganado) {
        jackpotStatusEl.innerHTML = `
          <span class="text-green-400 font-semibold">
            ✅ ¡Jackpot ganado${s.ganador_estado ? ' en ' + s.ganador_estado : ''}!
          </span>`;
      } else {
        jackpotStatusEl.innerHTML = `
          <span class="text-gray-400">
            ❌ Nadie ganó el jackpot — se acumula para el próximo sorteo
          </span>`;
      }
    }

    // ── PRÓXIMO SORTEO ────────────────────────────────────

    // Fecha del próximo sorteo (del JSON o calculada como fallback)
    const proximoSorteoEl = document.getElementById('proximo-sorteo');
    if (proximoSorteoEl) {
      const fechaProximo = p && p.fecha
        ? formatearFecha(p.fecha)
        : calcularProximoSorteo();
      proximoSorteoEl.textContent = 'Próximo sorteo: ' + fechaProximo;
    }

    // Premio estimado (jackpot acumulado del próximo sorteo)
    const premioEstEl = document.getElementById('premio-est');
    setTextoOPendiente(
      premioEstEl,
      p && p.premio_estimado ? formatearDinero(p.premio_estimado) : null
    );

    // Premio en efectivo del próximo sorteo
    const premioEfEl = document.getElementById('premio-ef');
    setTextoOPendiente(
      premioEfEl,
      p && p.premio_efectivo ? formatearDinero(p.premio_efectivo) : null
    );

    // Etiquetas descriptivas opcionales para dejar claro que son del próximo sorteo
    const labelEstEl = document.getElementById('label-premio-est');
    const labelEfEl  = document.getElementById('label-premio-ef');
    if (labelEstEl) labelEstEl.textContent = 'Premio Estimado — Próximo Sorteo';
    if (labelEfEl)  labelEfEl.textContent  = 'Valor en Efectivo — Próximo Sorteo';

    // ── METADATA ──────────────────────────────────────────

    // Última actualización
    const ultimaActEl = document.getElementById('ultima-act');
    if (ultimaActEl && data.fecha_actualizacion) {
      ultimaActEl.textContent = 'Actualizado: ' + data.fecha_actualizacion;
    }

  } catch (err) {
    console.error('Error cargando resultados:', err);
    
    const skeletonCard = document.getElementById('skeleton-card');
    const realCard     = document.getElementById('real-card');
    const errorCard    = document.getElementById('error-card');
    
    if (skeletonCard) skeletonCard.style.display = 'none';
    if (realCard)     realCard.classList.add('hidden');
    if (errorCard)    errorCard.classList.remove('hidden');
  }
}

// ============================================
// MENÚ MÓVIL
// ============================================
function initMobileMenu() {
  const menuBtn    = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = menuBtn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
      lucide.createIcons();
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      const icon = menuBtn.querySelector('i');
      if (icon) { icon.setAttribute('data-lucide', 'menu'); lucide.createIcons(); }
    });
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// ============================================
// SCROLL TO TOP
// ============================================
function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollTop');
  if (!scrollBtn) return;

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      scrollBtn.classList.toggle('visible', window.scrollY > 300);
    }, 100);
  });

  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================
// AÑO DINÁMICO EN FOOTER
// ============================================
function updateCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ============================================
// INTERSECTION OBSERVER PARA ANIMACIONES
// ============================================
function initIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('animate-in');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.step-card').forEach(card => observer.observe(card));
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
document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  updateCurrentYear();
  renderFaqs();
  initLucideIcons(); // Re-crear tras FAQ

  cargarResultados();
  setInterval(cargarResultados, 5 * 60 * 1000); // Refresh cada 5 min

  initMobileMenu();
  initSmoothScroll();
  initScrollToTop();
  initIntersectionObserver();
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================
window.addEventListener('error', (e) => console.error('Error global:', e.error));
window.addEventListener('unhandledrejection', (e) => console.error('Promise rechazada:', e.reason));

// Precargar JSON en background
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => { fetch(JSON_URL, { cache: 'force-cache' }).catch(() => {}); });
}


