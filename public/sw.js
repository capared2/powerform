// Service worker de ResultPowerball: modo offline para la app instalada.
//
// Estrategia (pensada para un sitio de resultados, donde lo viejo no sirve):
// - Páginas y archivos propios: RED PRIMERO. Con conexión siempre se ve lo
//   último publicado; la copia en caché solo se usa si no hay red.
// - /_astro/* (CSS/JS con hash en el nombre, inmutables): caché primero.
// - Sin red y sin copia de la página: /offline.html.
// - Nunca se tocan peticiones a otros dominios (anuncios, Analytics, fuentes,
//   CDN de íconos) ni /api/ (lo refresca main.js).
//
// Para forzar que todos los clientes descarten la caché vieja, subir VERSION.

const VERSION = 'v1';
const CACHE = `resultpb-${VERSION}`;
const MAX_PAGINAS = 40;
const PRECACHE = ['/', '/offline.html', '/main.js', '/manifest.json', '/icons/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(
        claves.filter((k) => k.startsWith('resultpb-') && k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

async function recortarPaginas(cache) {
  const claves = await cache.keys();
  const paginas = claves.filter((req) => {
    const p = new URL(req.url).pathname;
    return p.endsWith('/') && p !== '/';
  });
  const sobrantes = paginas.length - MAX_PAGINAS;
  for (let i = 0; i < sobrantes; i++) await cache.delete(paginas[i]);
}

async function redPrimero(event, esNavegacion) {
  const { request } = event;
  const cache = await caches.open(CACHE);
  // Las páginas se guardan sin query string (?utm_source, ?fbclid…) para no
  // acumular copias de la misma URL.
  const url = new URL(request.url);
  const clave = esNavegacion ? url.origin + url.pathname : request;
  try {
    const respuesta = await fetch(request);
    if (respuesta.ok && respuesta.type === 'basic') {
      event.waitUntil(
        cache.put(clave, respuesta.clone()).then(() => (esNavegacion ? recortarPaginas(cache) : null))
      );
    }
    return respuesta;
  } catch (err) {
    const guardada = await cache.match(clave);
    if (guardada) return guardada;
    if (esNavegacion) {
      const offline = await cache.match('/offline.html');
      if (offline) return offline;
    }
    throw err;
  }
}

async function cachePrimero(event) {
  const { request } = event;
  const cache = await caches.open(CACHE);
  const guardada = await cache.match(request);
  if (guardada) return guardada;
  const respuesta = await fetch(request);
  if (respuesta.ok) event.waitUntil(cache.put(request, respuesta.clone()));
  return respuesta;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (url.pathname.startsWith('/_astro/')) {
    event.respondWith(cachePrimero(event));
    return;
  }

  event.respondWith(redPrimero(event, request.mode === 'navigate'));
});
