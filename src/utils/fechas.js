// Utilidades de fecha compartidas entre la home y las páginas de /resultados/.
// Todas trabajan con fechas en formato ISO 'YYYY-MM-DD' sin depender del timezone del build.

export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export const DIAS = [
  'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado',
];

function partes(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d, date: new Date(Date.UTC(y, m - 1, d)) };
}

// "14 de julio de 2026"
export function fechaLarga(iso) {
  const { y, m, d } = partes(iso);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

// "lunes 14 de julio de 2026"
export function fechaConDia(iso) {
  const { date } = partes(iso);
  return `${DIAS[date.getUTCDay()]} ${fechaLarga(iso)}`;
}

// "Lunes, 14 de Julio de 2026" (formato que ya usa la tarjeta de resultados)
export function fechaTarjeta(iso) {
  const { y, m, d, date } = partes(iso);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return `${cap(DIAS[date.getUTCDay()])}, ${d} de ${cap(MESES[m - 1])} de ${y}`;
}
