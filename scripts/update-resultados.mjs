#!/usr/bin/env node
// Actualiza src/data/resultados.json con los sorteos oficiales del Powerball.
//
// Fuente: NY Open Data (Socrata), dataset oficial "Lottery Powerball Winning
// Numbers" (d6yy-54nr), publicado por la lotería de New York después de cada
// sorteo. No requiere API key. Los números son idénticos en todos los estados.
//
// Uso: node scripts/update-resultados.mjs
// Idempotente: solo modifica el archivo si hay sorteos nuevos o corregidos.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DATA_FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'resultados.json');
const API_URL = 'https://data.ny.gov/resource/d6yy-54nr.json?$order=draw_date%20DESC&$limit=300';

function normalizar(registro) {
  const fecha = String(registro.draw_date || '').slice(0, 10);
  const numeros = String(registro.winning_numbers || '').trim().split(/\s+/).map(Number);
  const powerplay = Number(registro.multiplier) || null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return null;
  if (numeros.length !== 6 || numeros.some((n) => !Number.isInteger(n))) return null;

  const blancos = numeros.slice(0, 5);
  const powerball = numeros[5];
  if (blancos.some((n) => n < 1 || n > 69) || powerball < 1 || powerball > 26) return null;

  return { fecha, blancos, powerball, powerplay };
}

const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
if (!res.ok) {
  console.error(`Error consultando la API (${res.status} ${res.statusText})`);
  process.exit(1);
}

const registros = await res.json();
const nuevos = registros.map(normalizar).filter(Boolean);
if (nuevos.length === 0) {
  console.error('La API no devolvió sorteos válidos; no se modifica nada.');
  process.exit(1);
}

const actual = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
const porFecha = new Map((actual.sorteos || []).map((s) => [s.fecha, s]));
for (const sorteo of nuevos) porFecha.set(sorteo.fecha, sorteo);

const sorteos = [...porFecha.values()].sort((a, b) => b.fecha.localeCompare(a.fecha));
const sinCambios =
  sorteos.length === (actual.sorteos || []).length &&
  JSON.stringify(sorteos) === JSON.stringify(actual.sorteos);

if (sinCambios) {
  console.log(`Sin cambios: ${sorteos.length} sorteos, último ${sorteos[0].fecha}.`);
  process.exit(0);
}

writeFileSync(
  DATA_FILE,
  JSON.stringify({ actualizado: new Date().toISOString(), sorteos }, null, 2) + '\n'
);
console.log(`Actualizado: ${sorteos.length} sorteos, último ${sorteos[0].fecha}.`);
