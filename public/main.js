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
    el.classList.remove('text-slate-500', 'text-base');
  } else {
    el.textContent = fallback;
    el.classList.add('text-slate-500', 'text-base');
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
        jackpotStatusEl.innerHTML = '<span class="text-emerald-600 font-semibold">✅ ¡Jackpot ganado' + (s.ganador_estado ? ' en ' + s.ganador_estado : '') + '!</span>';
      } else {
        jackpotStatusEl.innerHTML = '<span class="text-slate-600">❌ Nadie ganó el jackpot — se acumula para el próximo sorteo</span>';
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
    var realCard = document.getElementById('real-card');
    // Si la tarjeta ya trae los números del build (data-static), se conservan tal cual.
    if (realCard && realCard.dataset.static) return;
    var skeletonCard = document.getElementById('skeleton-card');
    var errorCard    = document.getElementById('error-card');
    if (skeletonCard) skeletonCard.style.display = 'none';
    if (realCard)     realCard.classList.add('hidden');
    if (errorCard)    errorCard.classList.remove('hidden');
  }
}

// ============================================
// INTERFAZ TIPO APP (móvil): hojas inferiores
// ============================================
// Abrir una hoja agrega una entrada al historial para que el botón "atrás"
// de Android (o el gesto de volver) la cierre en lugar de salir de la página.
var hojaAbierta = null;
var disparadorHoja = null;

function hayEntradaDeHoja() {
  return !!(history.state && history.state.hoja);
}

function abrirHoja(id, disparador) {
  var hoja = document.getElementById(id);
  if (!hoja) return;
  if (hojaAbierta) cerrarHoja({ conservarHistorial: true });

  hojaAbierta = hoja;
  disparadorHoja = disparador || null;
  hoja.classList.add('abierta');
  document.documentElement.classList.add('hoja-abierta');
  document.querySelectorAll('[data-hoja="' + id + '"]').forEach(function(t) { t.setAttribute('aria-expanded', 'true'); });

  if (hayEntradaDeHoja()) history.replaceState({ hoja: id }, '');
  else history.pushState({ hoja: id }, '');

  var cerrar = hoja.querySelector('button[data-cerrar-hoja]');
  setTimeout(function() { if (cerrar) cerrar.focus({ preventScroll: true }); }, 60);
}

// opciones.conservarHistorial: no tocar el historial (lo maneja quien llama,
// p. ej. al cerrar desde popstate o al cambiar de una hoja a otra).
function cerrarHoja(opciones) {
  opciones = opciones || {};
  var hoja = hojaAbierta;
  if (!hoja) return;
  hojaAbierta = null;
  hoja.classList.remove('abierta');
  document.documentElement.classList.remove('hoja-abierta');
  document.querySelectorAll('[data-hoja="' + hoja.id + '"]').forEach(function(t) { t.setAttribute('aria-expanded', 'false'); });

  if (disparadorHoja) { disparadorHoja.focus({ preventScroll: true }); disparadorHoja = null; }
  if (!opciones.conservarHistorial && hayEntradaDeHoja()) history.back();
}

// Navega a `destino` desde dentro de una hoja: primero saca del historial la
// entrada de la hoja (si no, "atrás" en la página nueva volvería a esta con la
// hoja) y luego navega. Los enlaces "/#seccion" en la misma página hacen scroll.
function navegarDesdeHoja(destino) {
  var url = new URL(destino, location.href);
  var irA = function() {
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
      var target = document.querySelector(url.hash);
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    }
    location.href = url.href;
  };

  cerrarHoja({ conservarHistorial: true });
  if (!hayEntradaDeHoja()) { irA(); return; }

  var hecho = false;
  var continuar = function() {
    if (hecho) return;
    hecho = true;
    window.removeEventListener('popstate', continuar);
    setTimeout(irA, 0); // después de que el navegador restaure el scroll del historial
  };
  window.addEventListener('popstate', continuar);
  setTimeout(continuar, 400); // por si el navegador no emite popstate
  history.back();
}

function initArrastreHoja(hoja) {
  var panel = hoja.querySelector('.hoja-panel');
  var zona  = hoja.querySelector('.hoja-arrastre');
  if (!panel || !zona) return;

  var inicioY = null, dy = 0, t0 = 0;

  zona.addEventListener('pointerdown', function(e) {
    if (e.target.closest('button')) return;
    inicioY = e.clientY; dy = 0; t0 = Date.now();
    panel.classList.add('arrastrando');
    try { zona.setPointerCapture(e.pointerId); } catch (_) {}
  });
  zona.addEventListener('pointermove', function(e) {
    if (inicioY === null) return;
    dy = Math.max(0, e.clientY - inicioY);
    panel.style.transform = 'translateY(' + dy + 'px)';
  });
  function soltar() {
    if (inicioY === null) return;
    inicioY = null;
    panel.classList.remove('arrastrando');
    panel.style.transform = '';
    var velocidad = dy / Math.max(1, Date.now() - t0); // px/ms
    if (dy > 90 || (dy > 30 && velocidad > 0.5)) cerrarHoja();
  }
  zona.addEventListener('pointerup', soltar);
  zona.addEventListener('pointercancel', soltar);
}

function initHojas() {
  var hojas = document.querySelectorAll('.hoja');
  if (!hojas.length) return;

  hojas.forEach(function(hoja) {
    hoja.querySelectorAll('[data-cerrar-hoja]').forEach(function(el) {
      el.addEventListener('click', function() { cerrarHoja(); });
    });
    // En fase de captura: se adelanta a los demás listeners de los enlaces
    hoja.addEventListener('click', function(e) {
      var a = e.target.closest('a[href]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      e.stopPropagation();
      navegarDesdeHoja(a.href);
    }, true);
    initArrastreHoja(hoja);
  });

  document.querySelectorAll('[data-hoja]').forEach(function(t) {
    t.setAttribute('aria-expanded', 'false');
    t.addEventListener('click', function(e) {
      e.preventDefault();
      var id = t.getAttribute('data-hoja');
      if (hojaAbierta && hojaAbierta.id === id) cerrarHoja();
      else abrirHoja(id, t);
    });
  });

  // Botón/gesto "atrás" con una hoja abierta: solo la cierra
  window.addEventListener('popstate', function() {
    if (hojaAbierta) cerrarHoja({ conservarHistorial: true });
  });

  // Al volver a la página desde el bfcache no debe quedar ninguna hoja abierta
  window.addEventListener('pageshow', function(e) {
    if (e.persisted && hojaAbierta) cerrarHoja({ conservarHistorial: true });
  });

  document.addEventListener('keydown', function(e) {
    if (!hojaAbierta) return;
    if (e.key === 'Escape') { cerrarHoja(); return; }
    if (e.key !== 'Tab') return;
    // Mantener el foco dentro de la hoja
    var focables = Array.prototype.filter.call(
      hojaAbierta.querySelectorAll('a[href], button:not([disabled])'),
      function(el) { return el.offsetParent !== null; }
    );
    if (!focables.length) return;
    var primero = focables[0], ultimo = focables[focables.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

// ============================================
// INTERFAZ TIPO APP: pestañas, volver, compartir, chips, sombra del header
// ============================================
function initPestanas() {
  // Tocar la pestaña de la pantalla actual sube al inicio (como en iOS/Android)
  document.querySelectorAll('#tabBar a[aria-current="page"]').forEach(function(t) {
    t.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function initBotonAtras() {
  var btn = document.getElementById('btnAtras');
  if (!btn) return;
  btn.addEventListener('click', function(e) {
    // Si llegamos desde otra página del sitio, se comporta como el "atrás"
    // nativo; si no (entrada desde Google, enlace directo), va al padre lógico.
    var mismoSitio = false;
    try { mismoSitio = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (_) {}
    if (mismoSitio && history.length > 1) { e.preventDefault(); history.back(); }
  });
}

var toastTimer;
function mostrarToast(texto) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = texto;
  t.classList.add('mostrar');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { t.classList.remove('mostrar'); }, 2500);
}

function initCompartir() {
  var btn = document.getElementById('btnCompartir');
  if (!btn) return;
  btn.addEventListener('click', function() {
    var canonical = document.querySelector('link[rel="canonical"]');
    var url = canonical ? canonical.href : location.href;
    if (navigator.share) {
      navigator.share({ title: document.title, url: url }).catch(function() {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function() { mostrarToast('Enlace copiado'); },
        function() { mostrarToast('No se pudo copiar el enlace'); }
      );
    }
  });
}

function initChipsSorteos() {
  var cont = document.getElementById('chipsSorteos');
  if (!cont) return;
  var activo = cont.querySelector('[aria-current="page"]');
  if (!activo) return;
  // Centrar el chip del juego actual sin mover el scroll vertical de la página
  var desplazamiento = activo.getBoundingClientRect().left - cont.getBoundingClientRect().left;
  cont.scrollLeft += desplazamiento - (cont.clientWidth - activo.offsetWidth) / 2;
}

function initSombraHeader() {
  var header = document.getElementById('appHeader');
  if (!header) return;
  var pendiente = false;
  function actualizar() {
    pendiente = false;
    header.classList.toggle('con-sombra', window.scrollY > 4);
  }
  window.addEventListener('scroll', function() {
    if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
  }, { passive: true });
  actualizar();
}

// ============================================
// INSTALAR COMO APP (PWA)
// ============================================
var eventoInstalar = null;

function esStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function esIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function mostrarBloqueInstalar(mostrar) {
  var bloque = document.getElementById('bloqueInstalar');
  if (bloque) bloque.hidden = !mostrar;
}

// Chrome/Edge/Samsung: guardamos el evento para lanzar el diálogo desde "Más".
window.addEventListener('beforeinstallprompt', function(e) {
  eventoInstalar = e;
  mostrarBloqueInstalar(true);
});

window.addEventListener('appinstalled', function() {
  eventoInstalar = null;
  mostrarBloqueInstalar(false);
  mostrarToast('¡App instalada! Búscala en tu pantalla de inicio');
});

function initInstalar() {
  var btn   = document.getElementById('btnInstalar');
  var ayuda = document.getElementById('ayudaIos');
  if (!btn || esStandalone()) return;

  // Safari en iOS no tiene diálogo de instalación: se muestran instrucciones.
  if (esIOS()) mostrarBloqueInstalar(true);

  btn.addEventListener('click', function() {
    if (eventoInstalar) {
      var ev = eventoInstalar;
      eventoInstalar = null; // prompt() solo se puede llamar una vez
      ev.prompt();
      ev.userChoice.then(function(r) {
        if (r && r.outcome === 'accepted') mostrarBloqueInstalar(false);
      }).catch(function() {});
    } else if (ayuda) {
      ayuda.hidden = !ayuda.hidden;
    }
  });
}

// ============================================
// SERVICE WORKER (modo offline) Y ESTADO DE CONEXIÓN
// ============================================
function initServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').catch(function(e) { console.warn('Service worker:', e); });
  });
}

function initEstadoConexion() {
  window.addEventListener('offline', function() { mostrarToast('Sin conexión: mostrando lo último guardado'); });
  window.addEventListener('online',  function() { mostrarToast('Conexión restablecida'); });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([data-hoja])').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
  // Enlaces del header tipo "/#seccion": solo interceptar si ya estamos en la home
  document.querySelectorAll('a[href^="/#"]:not([data-hoja])').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      if (window.location.pathname !== '/') return;
      var target = document.querySelector(this.getAttribute('href').slice(1));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// ============================================
// DROPDOWN DE SORTEOS (header)
// ============================================
function initSorteosDropdown() {
  var wrap = document.getElementById('sorteosDropdown');
  var btn  = document.getElementById('sorteosBtn');
  var menu = document.getElementById('sorteosMenu');
  if (!wrap || !btn || !menu) return;

  function abrir()  { menu.classList.remove('hidden'); btn.setAttribute('aria-expanded', 'true'); }
  function cerrar() { menu.classList.add('hidden');    btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    menu.classList.contains('hidden') ? abrir() : cerrar();
  });
  wrap.addEventListener('mouseenter', abrir);
  wrap.addEventListener('mouseleave', cerrar);
  document.addEventListener('click', function(e) {
    if (!wrap.contains(e.target)) cerrar();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') cerrar();
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
  if (document.getElementById('real-card')) {
    cargarResultados();
    setInterval(cargarResultados, 5 * 60 * 1000);
  }

  initHojas();
  initPestanas();
  initBotonAtras();
  initCompartir();
  initChipsSorteos();
  initSombraHeader();
  initInstalar();
  initServiceWorker();
  initEstadoConexion();
  initSorteosDropdown();
  initSmoothScroll();
  initScrollToTop();
  initIntersectionObserver();
});

window.addEventListener('error', function(e) { console.error('Error global:', e.error); });
window.addEventListener('unhandledrejection', function(e) { console.error('Promise rechazada:', e.reason); });

if ('requestIdleCallback' in window) {
  requestIdleCallback(function() { fetch(JSON_URL, { cache: 'force-cache' }).catch(function() {}); });
}
