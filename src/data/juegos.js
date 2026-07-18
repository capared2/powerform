// Metadatos de presentación de cada juego que publica el backend (capa2).
// Las claves coinciden con el diccionario GAMES de capa2/config.py y con
// src/data/sorteos.json. La bola especial y el multiplicador cambian de
// nombre según el juego.

export const JUEGOS = {
  powerball: {
    nombre: 'Powerball',
    bolaEspecialKey: 'powerball',
    bolaEspecialNombre: 'Powerball',
    multiplicadorKey: 'powerplay',
    multiplicadorNombre: 'Power Play',
    dias: 'Lunes, miércoles y sábado',
    hora: '10:59 PM ET',
    // Clases Tailwind de la bola especial en las tarjetas compactas
    bolaClases: 'bg-red-600 text-white',
    acentoClases: 'text-red-600',
  },
  megamillions: {
    nombre: 'Mega Millions',
    bolaEspecialKey: 'megaball',
    bolaEspecialNombre: 'Mega Ball',
    multiplicadorKey: 'megaplier',
    multiplicadorNombre: 'Megaplier',
    dias: 'Martes y viernes',
    hora: '11:00 PM ET',
    bolaClases: 'bg-amber-400 text-blue-950',
    acentoClases: 'text-amber-600',
  },
  lottoamerica: {
    nombre: 'Lotto America',
    bolaEspecialKey: 'star_ball',
    bolaEspecialNombre: 'Star Ball',
    multiplicadorKey: 'all_star_bonus',
    multiplicadorNombre: 'All Star Bonus',
    dias: 'Lunes, miércoles y sábado',
    hora: '10:15 PM ET',
    bolaClases: 'bg-blue-900 text-white',
    acentoClases: 'text-blue-800',
  },
  cash4life: {
    nombre: 'Cash4Life',
    bolaEspecialKey: 'cash_ball',
    bolaEspecialNombre: 'Cash Ball',
    multiplicadorKey: null,
    multiplicadorNombre: null,
    dias: 'Todos los días',
    hora: '9:00 PM ET',
    bolaClases: 'bg-emerald-600 text-white',
    acentoClases: 'text-emerald-700',
  },
};

// Orden de las tarjetas de "otros sorteos" en la home (todos menos Powerball,
// que tiene su propia tarjeta principal).
export const OTROS_JUEGOS = ['megamillions', 'lottoamerica', 'cash4life'];

// Un sorteo se considera vigente si ocurrió hace menos de MAX_DIAS_VIGENTE días.
// Evita mostrar como "último resultado" datos viejos si una fuente del backend
// se queda atrás (el juego reaparece automáticamente cuando llegan datos frescos).
export const MAX_DIAS_VIGENTE = 30;

export function esVigente(fechaISO, referencia = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fechaISO || ''))) return false;
  const [y, m, d] = fechaISO.split('-').map(Number);
  const fecha = new Date(y, m - 1, d);
  const dias = (referencia - fecha) / 86400000;
  return dias >= 0 && dias <= MAX_DIAS_VIGENTE;
}

export function formatearDineroCorto(n) {
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2).replace(/\.?0+$/, '')} Mil Millones`;
  if (n >= 1e6) return `$${Math.round(n / 1e6)} Millones`;
  return `$${n.toLocaleString('es-US')}`;
}
