// Navegación compartida por el header de escritorio, el footer y la interfaz
// tipo app de móvil (barra de pestañas, hojas inferiores y chips de juegos).
// Se deriva de JUEGOS para que un juego nuevo aparezca solo en todos los menús.

import { JUEGOS, JUEGOS_CON_PAGINA } from './juegos.js';
import { estados } from './estados.js';
import { fechaLarga } from '../utils/fechas.js';

// Siglas que se muestran dentro de la "bola" de cada juego en la hoja de Sorteos.
const ABREVIATURAS = { powerball: 'PB', megamillions: 'MM', lottoamerica: 'LA', cash4life: 'C4L', '2by2': '2×2' };

// Powerball primero (su página es la home) y luego el resto en el orden de OTROS_JUEGOS.
export const JUEGOS_NAV = [
  { id: 'powerball', href: '/', ...JUEGOS.powerball },
  ...JUEGOS_CON_PAGINA.map((id) => ({ id, href: `/${JUEGOS[id].slug}/`, ...JUEGOS[id] })),
].map((j) => ({ ...j, abrev: ABREVIATURAS[j.id] ?? j.nombre.slice(0, 2).toUpperCase() }));

function conBarra(pathname) {
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

// Pestaña activa de la barra inferior según la URL.
export function seccionDe(pathname) {
  const p = conBarra(pathname);
  if (p === '/') return 'inicio';
  if (p.startsWith('/resultados/')) return 'historial';
  if (p.startsWith('/estados/')) return 'estados';
  if (JUEGOS_NAV.some((j) => j.href === p)) return 'sorteos';
  return 'mas';
}

// Título de la app bar en móvil y a dónde lleva el botón "Volver" (su padre
// lógico: se usa cuando no hay historial del sitio al que regresar).
// En la home no hay título (se muestra el logo) ni botón de volver.
export function pantallaDe(pathname) {
  const p = conBarra(pathname);
  if (p === '/') return { titulo: null, atras: null };

  const juego = JUEGOS_NAV.find((j) => j.href === p);
  if (juego) return { titulo: juego.nombre, atras: '/' };

  if (p === '/resultados/') return { titulo: 'Historial Powerball', atras: '/' };
  const fecha = p.match(/^\/resultados\/(\d{4}-\d{2}-\d{2})\/$/);
  if (fecha) return { titulo: `Sorteo del ${fechaLarga(fecha[1])}`, atras: '/resultados/' };

  if (p === '/estados/') return { titulo: 'Powerball por estado', atras: '/' };
  const estado = p.match(/^\/estados\/([^/]+)\/$/);
  if (estado) {
    const e = estados.find((x) => x.slug === estado[1]);
    return { titulo: e ? `Powerball en ${e.nombreEs}` : 'Powerball por estado', atras: '/estados/' };
  }

  const fijas = { '/contacto/': 'Contacto', '/terminos/': 'Términos', '/privacidad/': 'Privacidad' };
  return { titulo: fijas[p] ?? null, atras: '/' };
}
