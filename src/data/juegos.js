// Metadatos y contenido de cada juego que publica el backend (capa2).
// Las claves coinciden con el diccionario GAMES de capa2/config.py y con
// src/data/sorteos.json. La bola especial y el multiplicador cambian de
// nombre según el juego.

export const JUEGOS = {
  powerball: {
    slug: null, // la página del Powerball es la home
    nombre: 'Powerball',
    bolaEspecialKey: 'powerball',
    bolaEspecialNombre: 'Powerball',
    multiplicadorKey: 'powerplay',
    multiplicadorNombre: 'Power Play',
    dias: 'Lunes, miércoles y sábado',
    hora: '10:59 PM ET',
    bolaClases: 'bg-red-600 text-white',
    acentoClases: 'text-red-600',
    tagline: 'La lotería más grande de Estados Unidos',
    formato: 'Elige 5 números del 1 al 69 + 1 Powerball del 1 al 26',
    precio: '$2 por jugada · Power Play +$1',
    premioMinimo: 'Jackpot mínimo de $20 millones',
    donde: '45 estados, Washington DC, Puerto Rico e Islas Vírgenes',
  },
  megamillions: {
    slug: 'mega-millions',
    nombre: 'Mega Millions',
    bolaEspecialKey: 'megaball',
    bolaEspecialNombre: 'Mega Ball',
    multiplicadorKey: 'megaplier',
    multiplicadorNombre: 'Multiplicador',
    dias: 'Martes y viernes',
    hora: '11:00 PM ET',
    bolaClases: 'bg-amber-400 text-blue-950',
    acentoClases: 'text-amber-600',
    tagline: 'Jackpots gigantes cada martes y viernes',
    formato: 'Elige 5 números del 1 al 70 + 1 Mega Ball del 1 al 24',
    precio: '$5 por jugada (incluye multiplicador aleatorio 2x–10x)',
    premioMinimo: 'Jackpot mínimo de $50 millones',
    donde: '45 estados, Washington DC e Islas Vírgenes',
    descripcion:
      'Mega Millions es, junto al Powerball, una de las dos grandes loterías nacionales de Estados Unidos. Sus jackpots comienzan en $50 millones y han superado los $1,600 millones. Desde 2025 cada boleto cuesta $5 e incluye un multiplicador aleatorio (2x a 10x) que aumenta los premios menores automáticamente.',
    comoJugar: [
      'Compra tu boleto por $5 en cualquier tienda autorizada de un estado participante.',
      'Elige 5 números del 1 al 70 (bolas blancas) y 1 Mega Ball del 1 al 24 (bola dorada), o pide Quick Pick.',
      'Cada boleto trae un multiplicador aleatorio (2x, 3x, 4x, 5x o 10x) que multiplica cualquier premio que no sea el jackpot.',
      'Los sorteos son los martes y viernes a las 11:00 PM ET. Compara tus números aquí después de cada sorteo.',
    ],
    faqs: [
      {
        pregunta: '¿Cuándo se juega el Mega Millions?',
        respuesta:
          'El Mega Millions se sortea dos veces por semana: los martes y viernes a las 11:00 PM Eastern Time (10:00 PM CT, 9:00 PM MT, 8:00 PM PT). Los resultados se publican aquí automáticamente después de cada sorteo.',
      },
      {
        pregunta: '¿Cuánto cuesta un boleto de Mega Millions?',
        respuesta:
          'Desde abril de 2025 el boleto cuesta $5 USD e incluye un multiplicador aleatorio de 2x a 10x que se aplica a todos los premios menores al jackpot. Ya no se vende el Megaplier por separado.',
      },
      {
        pregunta: '¿Cuáles son las probabilidades de ganar el Mega Millions?',
        respuesta:
          'La probabilidad de ganar el jackpot es 1 en 290,472,336 (5 números + Mega Ball). La probabilidad de ganar cualquier premio es aproximadamente 1 en 23.',
      },
      {
        pregunta: '¿Mega Millions o Powerball, cuál es mejor?',
        respuesta:
          'Ambas loterías tienen jackpots enormes y probabilidades similares. El Powerball cuesta $2 y se juega 3 veces por semana; el Mega Millions cuesta $5, se juega 2 veces por semana e incluye el multiplicador en el precio. Muchos jugadores participan en las dos.',
      },
    ],
  },
  lottoamerica: {
    slug: 'lotto-america',
    nombre: 'Lotto America',
    bolaEspecialKey: 'star_ball',
    bolaEspecialNombre: 'Star Ball',
    multiplicadorKey: 'all_star_bonus',
    multiplicadorNombre: 'All Star Bonus',
    dias: 'Lunes, miércoles y sábado',
    hora: '10:15 PM ET',
    bolaClases: 'bg-blue-900 text-white',
    acentoClases: 'text-blue-800',
    tagline: 'El boleto de $1 con jackpots millonarios',
    formato: 'Elige 5 números del 1 al 52 + 1 Star Ball del 1 al 10',
    precio: '$1 por jugada · All Star Bonus +$1',
    premioMinimo: 'Jackpot mínimo de $2 millones',
    donde: '13 estados participantes',
    descripcion:
      'Lotto America es la lotería multiestatal más económica: cada jugada cuesta solo $1 y los jackpots comienzan en $2 millones. Se juega en 13 estados y usa el mismo formato clásico de 5 números más una bola extra (Star Ball). Con el All Star Bonus, por $1 adicional, los premios menores se multiplican hasta 5x.',
    comoJugar: [
      'Compra tu boleto por $1 en una tienda autorizada de uno de los 13 estados participantes.',
      'Elige 5 números del 1 al 52 (bolas blancas) y 1 Star Ball del 1 al 10, o pide Quick Pick.',
      'Agrega el All Star Bonus por $1 más para multiplicar los premios menores por 2x, 3x, 4x o 5x.',
      'Los sorteos son los lunes, miércoles y sábados a las 10:15 PM ET. Verifica tus números aquí.',
    ],
    faqs: [
      {
        pregunta: '¿Dónde se juega Lotto America?',
        respuesta:
          'Lotto America se vende en 13 estados: Delaware, Idaho, Iowa, Kansas, Maine, Minnesota, Montana, New Mexico, North Dakota, Oklahoma, South Dakota, Tennessee y West Virginia.',
      },
      {
        pregunta: '¿Cuándo son los sorteos de Lotto America?',
        respuesta:
          'Los sorteos son tres veces por semana: lunes, miércoles y sábados a las 10:15 PM Eastern Time, poco antes del sorteo del Powerball.',
      },
      {
        pregunta: '¿Cuáles son las probabilidades de ganar Lotto America?',
        respuesta:
          'La probabilidad de ganar el jackpot es 1 en 25,989,600 — mucho mejor que la del Powerball o Mega Millions. La probabilidad de ganar cualquier premio es aproximadamente 1 en 9.6.',
      },
      {
        pregunta: '¿Qué es el All Star Bonus?',
        respuesta:
          'Es una opción de $1 adicional que multiplica cualquier premio que no sea el jackpot por 2x, 3x, 4x o 5x, según el multiplicador sorteado esa noche.',
      },
    ],
  },
  cash4life: {
    slug: 'cash4life',
    nombre: 'Cash4Life',
    bolaEspecialKey: 'cash_ball',
    bolaEspecialNombre: 'Cash Ball',
    multiplicadorKey: null,
    multiplicadorNombre: null,
    dias: 'Todos los días',
    hora: '9:00 PM ET',
    bolaClases: 'bg-emerald-600 text-white',
    acentoClases: 'text-emerald-700',
    tagline: '$1,000 al día de por vida, todos los días',
    formato: 'Elige 5 números del 1 al 60 + 1 Cash Ball del 1 al 4',
    precio: '$2 por jugada',
    premioMinimo: 'Premio mayor: $1,000 al día de por vida',
    donde: '10 estados participantes',
    descripcion:
      'Cash4Life es diferente a las demás loterías: en lugar de un jackpot acumulado, el premio mayor es $1,000 al día de por vida (o un pago único de $7 millones). El segundo premio es $1,000 a la semana de por vida. Se sortea todos los días a las 9:00 PM ET, así que hay una oportunidad nueva cada noche.',
    comoJugar: [
      'Compra tu boleto por $2 en una tienda autorizada de uno de los estados participantes.',
      'Elige 5 números del 1 al 60 (bolas blancas) y 1 Cash Ball del 1 al 4, o pide Quick Pick.',
      'Los sorteos son todos los días a las 9:00 PM ET.',
      'Si aciertas los 5 números + Cash Ball ganas $1,000 al día de por vida; con solo los 5 números, $1,000 a la semana de por vida.',
    ],
    faqs: [
      {
        pregunta: '¿Qué premio da el Cash4Life?',
        respuesta:
          'El premio mayor es $1,000 al día de por vida (mínimo garantizado de 20 años) o un pago único de aproximadamente $7 millones. El segundo premio es $1,000 a la semana de por vida.',
      },
      {
        pregunta: '¿Dónde se juega Cash4Life?',
        respuesta:
          'Cash4Life se vende en 10 estados: Florida, Georgia, Indiana, Maryland, Missouri, New Jersey, New York, Pennsylvania, Tennessee y Virginia.',
      },
      {
        pregunta: '¿Cuándo son los sorteos de Cash4Life?',
        respuesta:
          'Todos los días a las 9:00 PM Eastern Time, incluidos fines de semana y días festivos.',
      },
      {
        pregunta: '¿Cuáles son las probabilidades de ganar Cash4Life?',
        respuesta:
          'La probabilidad de ganar el premio mayor es 1 en 21,846,048. La probabilidad de ganar cualquier premio es aproximadamente 1 en 8, una de las mejores entre las loterías multiestatales.',
      },
    ],
  },
};

// Juegos con tarjeta propia en la home además del Powerball (que tiene la
// tarjeta principal). El orden define el orden de las tarjetas.
export const OTROS_JUEGOS = ['megamillions', 'lottoamerica', 'cash4life'];

// Juegos con página propia (/[slug]/). El Powerball no está: su página es la home.
export const JUEGOS_CON_PAGINA = OTROS_JUEGOS;

// Un sorteo se considera vigente si ocurrió hace menos de MAX_DIAS_VIGENTE días.
// Se usa para marcar datos atrasados (la tarjeta se muestra igual, con nota).
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
