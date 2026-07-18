#!/usr/bin/env node
// Actualiza src/data/sorteos.json con el último resultado de todos los juegos
// que publica el backend (repo capared2/capa2, archivo resultados_todos.json).
//
// Fuente: el scraper multi-juego de capa2 (Powerball + Double Play, Mega Millions,
// Lotto America, Cash4Life) commitea sus JSON a main después de cada corrida.
//
// Uso: node scripts/update-sorteos.mjs
// Idempotente: solo modifica el archivo si el backend publicó datos nuevos.
// Si el backend no responde, conserva los datos existentes y sale sin error.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DATA_FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'sorteos.json');
const API_URL = 'https://raw.githubusercontent.com/capared2/capa2/main/resultados_todos.json';

const JUEGOS_VALIDOS = ['powerball', 'megamillions', 'lottoamerica', 'cash4life'];

function esFechaValida(fecha) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(fecha || ''));
}

// Valida y limpia el registro de un juego; devuelve null si está incompleto.
function normalizar(id, juego) {
  const s = juego?.sorteo;
  if (!s || !esFechaValida(s.fecha)) return null;
  if (!Array.isArray(s.blancos) || s.blancos.length !== 5 || s.blancos.some((n) => !Number.isInteger(n))) return null;

  const sorteo = { fecha: s.fecha, blancos: s.blancos };
  // La bola especial y el multiplicador cambian de nombre según el juego
  // (powerball/powerplay, megaball/megaplier, star_ball/all_star_bonus, cash_ball).
  for (const campo of ['powerball', 'megaball', 'star_ball', 'cash_ball']) {
    if (Number.isInteger(s[campo]) && s[campo] > 0) sorteo[campo] = s[campo];
  }
  for (const campo of ['powerplay', 'megaplier', 'all_star_bonus']) {
    if (Number.isInteger(s[campo]) && s[campo] > 0) sorteo[campo] = s[campo];
  }
  if (typeof s.jackpot_ganado === 'boolean') sorteo.jackpot_ganado = s.jackpot_ganado;
  if (s.ganador_estado) sorteo.ganador_estado = s.ganador_estado;

  const dj = s.doble_jugada;
  if (dj && Array.isArray(dj.blancos) && dj.blancos.length === 5 && Number.isInteger(dj.powerball)) {
    sorteo.doble_jugada = { blancos: dj.blancos, powerball: dj.powerball };
  }

  const p = juego.proximo_sorteo;
  const proximo = {};
  if (p && esFechaValida(p.fecha)) proximo.fecha = p.fecha;
  if (p && Number.isFinite(p.premio_estimado)) proximo.premio_estimado = p.premio_estimado;
  if (p && Number.isFinite(p.premio_efectivo)) proximo.premio_efectivo = p.premio_efectivo;
  if (p && p.premio_descripcion) proximo.premio_descripcion = p.premio_descripcion;

  return {
    juego: id,
    nombre: juego.nombre || id,
    sorteo,
    ...(Object.keys(proximo).length ? { proximo_sorteo: proximo } : {}),
  };
}

let data;
try {
  const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  data = await res.json();
} catch (err) {
  console.error(`No se pudo consultar el backend (${err.message}); se conservan los datos existentes.`);
  process.exit(0);
}

const juegos = {};
for (const id of JUEGOS_VALIDOS) {
  const limpio = normalizar(id, data?.juegos?.[id]);
  if (limpio) juegos[id] = limpio;
}

if (Object.keys(juegos).length === 0) {
  console.error('El backend no devolvió ningún juego válido; no se modifica nada.');
  process.exit(0);
}

const actual = existsSync(DATA_FILE) ? JSON.parse(readFileSync(DATA_FILE, 'utf8')) : {};
if (JSON.stringify(actual.juegos) === JSON.stringify(juegos)) {
  console.log(`Sin cambios: ${Object.keys(juegos).join(', ')}.`);
  process.exit(0);
}

writeFileSync(
  DATA_FILE,
  JSON.stringify({ actualizado: new Date().toISOString(), juegos }, null, 2) + '\n'
);
console.log(`Actualizado: ${Object.keys(juegos).join(', ')}.`);
