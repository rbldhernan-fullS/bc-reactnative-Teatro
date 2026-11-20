// Regenera las fechas de la cartelera de demo para que nunca queden en el pasado.
//
// Uso (desde la raíz del repo):
//   node api/refresh-demo-dates.mjs
//
// - La obra "Hamlet" (id 1) queda a hoy + 3 horas, para poder probar el
//   recordatorio de 2 horas sin esperar días.
// - Las demás obras se reparten entre hoy + 7 y hoy + 180 días.
// - Solo se tocan `date` (y la hora de Hamlet); el resto del registro se conserva.

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const dbPath = join(scriptDir, 'db.json');

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

// 11 fechas escalonadas para las obras 2..12, de +7 a +180 días.
const STAGGERED_DAYS = [7, 24, 41, 58, 75, 93, 110, 127, 144, 162, 180];

function toLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toLocalTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

const raw = await readFile(dbPath, 'utf8');
const db = JSON.parse(raw);

if (!Array.isArray(db.plays) || db.plays.length === 0) {
  throw new Error('db.json no tiene una lista "plays" con contenido.');
}

const now = new Date();
const demoStart = new Date(now.getTime() + 3 * HOUR_MS);

let staggeredIndex = 0;

for (const play of db.plays) {
  if (play.id === '1') {
    play.date = toLocalDate(demoStart);
    play.time = toLocalTime(demoStart);
    continue;
  }

  const offsetDays = STAGGERED_DAYS[staggeredIndex % STAGGERED_DAYS.length];
  staggeredIndex += 1;

  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays);
  play.date = toLocalDate(target);
}

await writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`, 'utf8');

console.log(`Cartelera actualizada en ${dbPath}`);
console.log(`- Hamlet: ${db.plays[0].date} ${db.plays[0].time} (hoy + 3 h)`);
console.log(`- Resto: +${STAGGERED_DAYS[0]} a +${STAGGERED_DAYS.at(-1)} días`);
