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
  if (!n || isNaN(n)) return '$0';
  
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
// PRÓXIMO SORTEO
// ============================================
function calcularProximoSorteo() {
  const ahora = new Date();
  
  // Convertir a Eastern Time (UTC-5, o UTC-4 en horario de verano)
  const utc = ahora.getTime() + ahora.getTimezoneOffset() * 60000;
  const et = new Date(utc - 5 * 3600000); // Eastern Time (simplificado)

  const dia = et.getDay();   // 0=Domingo, 1=Lunes, etc.
  const hora = et.getHours();
  const diasSorteo = [1, 3, 6]; // Lun, Mie, Sab

  let offset = 0;
  
  // Encontrar próximo día de sorteo
  for (let i = 0; i <= 7; i++) {
    const d = (dia + i) % 7;
    if (diasSorteo.includes(d)) {
      // Si es hoy y aún no han dado las 23:00
      if (i === 0 && hora < 23) {
        offset = 0;
        break;
      }
      // Si es un día futuro
      if (i > 0) {
        offset = i;
        break;
      }
    }
  }

  const fecha = new Date(et);
  fecha.setDate(fecha.getDate() + offset);

  const diasNom = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const mesesNom = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  return `${diasNom[fecha.getDay()]} ${fecha.getDate()} ${mesesNom[fecha.getMonth()]}`;
}

// ============================================
// CARGAR RESULTADOS (desde JSON)
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
    
    if (!response.ok) {
      throw new Error('No se pudieron cargar los resultados. Por favor, intenta de nuevo más tarde.');
    }
    
    const data = await response.json();
    const s = data.sorteo;

    // Validar datos
    if (!s || !s.blancos || (s.powerball === undefined && s.powerball !== 0)) {
      throw new Error('Datos incompletos en la respuesta');
    }

    // Ocultar skeleton, mostrar card real
    const skeletonCard = document.getElementById('skeleton-card');
    const realCard = document.getElementById('real-card');
    const errorCard = document.getElementById('error-card');
    
    if (skeletonCard) skeletonCard.style.display = 'none';
    if (errorCard) errorCard.classList.add('hidden');
    if (realCard) realCard.classList.remove('hidden');

    // Fecha
    const fechaSorteoEl = document.getElementById('fecha-sorteo');
    if (fechaSorteoEl) {
      fechaSorteoEl.textContent = formatearFecha(s.fecha);
    }

    // Blancos
    const blancosEl = document.getElementById('blancos');
    if (blancosEl && Array.isArray(s.blancos)) {
      blancosEl.innerHTML = s.blancos
        .map(n => `<div class="ball-white">${n}</div>`)
        .join('');
    }

    // Powerball
    const pbBallEl = document.getElementById('pb-ball');
    if (pbBallEl) {
      pbBallEl.textContent = s.powerball;
    }

    // Power Play
    const ppValueEl = document.getElementById('pp-value');
    if (ppValueEl) {
      ppValueEl.textContent = (s.powerplay || 2) + 'x';
    }

    // Premios
    const premioEstEl = document.getElementById('premio-est');
    const premioEfEl = document.getElementById('premio-ef');
    
    if (premioEstEl) {
      premioEstEl.textContent = formatearDinero(s.premio_estimado);
    }
    if (premioEfEl) {
      premioEfEl.textContent = formatearDinero(s.premio_efectivo);
    }

    // Última actualización
    const ultimaActEl = document.getElementById('ultima-act');
    if (ultimaActEl && data.fecha_actualizacion) {
      ultimaActEl.textContent = 'Actualizado: ' + data.fecha_actualizacion;
    }

  } catch (err) {
    console.error('Error cargando resultados:', err);
    
    const skeletonCard = document.getElementById('skeleton-card');
    const realCard = document.getElementById('real-card');
    const errorCard = document.getElementById('error-card');
    
    if (skeletonCard) skeletonCard.style.display = 'none';
    if (realCard) realCard.classList.add('hidden');
    if (errorCard) errorCard.classList.remove('hidden');
  }
}

// ============================================
// MENÚ MÓVIL
// ============================================
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    
    // Cambiar icono
    const icon = menuBtn.querySelector('i');
    if (icon) {
      if (mobileMenu.classList.contains('hidden')) {
        icon.setAttribute('data-lucide', 'menu');
      } else {
        icon.setAttribute('data-lucide', 'x');
      }
      lucide.createIcons();
    }
  });

  // Cerrar menú al hacer clic en un enlace
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
      }
    });
  });
}

// ============================================
// SMOOTH SCROLL PARA ANCLAS
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// SCROLL TO TOP BUTTON (NUEVO)
// ============================================
function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollTop');
  if (!scrollBtn) return;

  // Mostrar/ocultar botón según scroll
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    // Debounce para mejor performance
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, 100);
  });

  // Click para volver arriba
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// AÑO DINÁMICO EN FOOTER (NUEVO)
// ============================================
function updateCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ============================================
// PERFORMANCE: INTERSECTION OBSERVER PARA ANIMACIONES
// ============================================
function initIntersectionObserver() {
  // Observar elementos con animación al entrar en viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observar cards de pasos
  document.querySelectorAll('.step-card').forEach(card => {
    observer.observe(card);
  });
}

// ============================================
// OPTIMIZACIÓN: LAZY LOAD DE ICONOS LUCIDE
// ============================================
function initLucideIcons() {
  if (typeof lucide !== 'undefined') {
    try {
      lucide.createIcons();
    } catch (error) {
      console.warn('Error inicializando Lucide icons:', error);
    }
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Lucide Icons
  initLucideIcons();

  // Actualizar año dinámico
  updateCurrentYear();

  // Renderizar FAQ
  renderFaqs();
  
  // Re-crear iconos después de generar FAQ
  initLucideIcons();

  // Actualizar próximo sorteo
  const proximoSorteoEl = document.getElementById('proximo-sorteo');
  if (proximoSorteoEl) {
    proximoSorteoEl.textContent = 'Próximo sorteo: ' + calcularProximoSorteo();
  }

  // Cargar resultados
  cargarResultados();

  // Auto-refresh cada 5 minutos
  setInterval(cargarResultados, 5 * 60 * 1000);

  // Inicializar menú móvil
  initMobileMenu();

  // Inicializar smooth scroll
  initSmoothScroll();

  // Inicializar scroll to top
  initScrollToTop();

  // Inicializar intersection observer para animaciones
  initIntersectionObserver();
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================
window.addEventListener('error', (e) => {
  console.error('Error global:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Promise rechazada:', e.reason);
});

// ============================================
// PERFORMANCE: PRELOAD CRÍTICO
// ============================================
// Precargar el JSON en background para mejorar velocidad
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    fetch(JSON_URL, { cache: 'force-cache' }).catch(() => {});
  });
}

