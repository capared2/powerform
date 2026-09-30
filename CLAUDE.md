# ResultPowerball — CLAUDE.md

Documentación técnica del proyecto para sesiones futuras con Claude Code.

## Stack

- **Framework:** Astro 5.8 (static site generation, `trailingSlash: 'always'`)
- **CSS:** Tailwind CSS 3.4 + `@tailwindcss/typography`
- **Imágenes:** Sharp (dev dependency, usado para optimizar la OG image)
- **Sitemap:** `@astrojs/sitemap` (genera sitemap dinámico automático en build)
- **Deploy:** Git push a `github-porto:capared2/powerform.git` (rama `main`)
- **Dominio:** `https://resultpowerball.com`

## Estructura del proyecto

```
src/
  data/
    estados.js           # Datos de 25 estados: slugs, keywords, FAQs, ciudades + OG_IMAGE
    resultados.json      # Sorteos del Powerball (lo actualiza GitHub Actions 3x/semana)
    sorteos.json         # Último sorteo de cada juego del backend capa2 (multi-juego)
    juegos.js            # Metadatos de presentación por juego + esVigente() + helpers
    navegacion.js        # JUEGOS_NAV (menús), pestaña activa y título/atrás de cada pantalla
  utils/
    fechas.js            # Formateo de fechas en español compartido (home + /resultados/)
  components/
    Icon.astro           # Íconos Lucide incrustados (SVG) para la interfaz tipo app
    app/                 # Interfaz tipo app en móvil (ver "Interfaz tipo app")
      BarraPestanas.astro  # Barra de pestañas inferior
      Hoja.astro           # Hoja inferior (bottom sheet) genérica
      ChipsSorteos.astro   # Chips deslizables para saltar entre juegos
    anuncios/            # 1 archivo por unidad de anuncio (ver "Anuncios")
  layouts/
    Layout.astro         # Layout global: head, header, footer + anuncios globales
  pages/
    index.astro          # Home multi-sorteo: Powerball + tarjetas de todos los juegos
    [juego].astro        # 1 página por sorteo: /mega-millions/, /lotto-america/, /cash4life/
    contacto.astro
    terminos.astro
    privacidad.astro
    estados/
      index.astro        # Índice de estados con grid de cards
      [estado].astro     # Ruta dinámica: 1 página por estado
    resultados/
      index.astro        # Historial de sorteos agrupado por mes
      [fecha].astro      # 1 página por sorteo (/resultados/YYYY-MM-DD/)
scripts/
  update-resultados.mjs  # Descarga sorteos oficiales (NY Open Data) → resultados.json
  update-sorteos.mjs     # Descarga resultados_todos.json del backend capa2 → sorteos.json
.github/workflows/
  update-resultados.yml  # Cron 3x/semana + respaldo diario: actualiza datos y pushea a main
public/
  main.js                # JS del cliente (Lucide, scroll, refresco de resultados, interfaz tipo app)
  sw.js                  # Service worker: modo offline (red primero)
  offline.html           # Página sin conexión (la sirve sw.js)
  manifest.json          # Manifest PWA (instalable como app)
  apple-touch-icon.png   # Ícono de inicio en iOS (180x180)
  icons/                 # Íconos PWA 192/512 + maskable (generados con sharp desde logo.svg)
  robots.txt
  powerball-estados.jpg  # Imagen OG local, 1200x630, 91KB (billboard Powerball, CC)
```

## Arquitectura de resultados (importante)

1. **Build-time:** `index.astro` y `/resultados/*` leen `src/data/resultados.json`.
   Los números ganadores quedan **en el HTML estático** (crítico para SEO — antes
   solo se cargaban por JS y Google indexaba un skeleton vacío).
2. **Actualización:** `.github/workflows/update-resultados.yml` corre después de cada
   sorteo (lun/mié/sáb 10:59 PM ET → cron 04:30 UTC dom/mar/jue + respaldo diario 14:15 UTC),
   ejecuta `scripts/update-resultados.mjs` (fuente: dataset oficial `d6yy-54nr` de
   data.ny.gov, sin API key) y hace push a `main` solo si hay sorteos nuevos.
   Ese push dispara el deploy → el sitio se reconstruye con los números nuevos.
3. **Cliente:** `main.js` sigue consultando `/api/resultados-v2` (endpoint externo, no
   está en el repo) para refrescar la tarjeta y llenar jackpot/premios. Si la tarjeta
   tiene `data-static` (datos del build) y el API falla, se conservan los datos del build.
4. **Premio estimado/efectivo:** solo se llenan client-side y llevan disclaimer visible
   de "pueden estar desactualizados" (decisión del dueño: el API no los captura bien
   en tiempo real).
5. Si `resultados.json` está vacío, la home cae al comportamiento skeleton+fetch y
   no se generan páginas de sorteo (getStaticPaths devuelve []).
6. **Multi-juego (jul 2026):** el backend `capared2/capa2` scrapea Powerball
   (+ Double Play), Mega Millions, Lotto America, Cash4Life y 2by2 y commitea
   `resultados_todos.json` a su main. `scripts/update-sorteos.mjs` lo baja de
   raw.githubusercontent.com → `src/data/sorteos.json`. El sitio ya NO es solo
   Powerball: cubre todos los sorteos.
   - **Home** = portal multi-sorteo: tarjeta principal del Powerball (con
     refresco client-side y Double Play si el backend lo trae para la misma
     fecha) + sección `#sorteos` con tarjeta de CADA juego, siempre visible:
     con números si hay datos, placeholder si no hay, y nota ámbar si el
     último dato tiene más de 30 días (`esVigente()` en `src/data/juegos.js`).
   - **Páginas por sorteo** (`src/pages/[juego].astro`): /mega-millions/,
     /lotto-america/, /cash4life/ y /2by2/, con resultado estático, cómo funciona,
     cómo jugar, FAQ (con FAQPage JSON-LD) y enlaces cruzados. La página del
     Powerball es la home (no crear /powerball/: canibalizaría el SEO).
   - Todo el contenido por juego (reglas, precios, FAQs, colores, slug) vive
     en `src/data/juegos.js`. Para agregar un juego nuevo: agregarlo a capa2,
     a `JUEGOS` y a `OTROS_JUEGOS`, y sale solo en home + página propia.
     2by2 es el único con formato distinto: 2 rojas + 2 blancas, sin bola
     especial (campo `rojos` en sorteos.json).
   - Del menú de juegos de powerball.com quedan fuera **Jackpot USA** y
     **Millionaire for Life**: sus páginas no publican números de sorteo
     (verificado con capa2/probe_juegos.py), no hay nada que extraer.

## Tema visual (jul 2026)

- **Tema claro** estilo bandera de EE.UU.: fondo blanco, encabezados azul marino
  (`text-blue-950`), acentos rojos (`red-600`), secciones alternas `bg-slate-50`.
- Header blanco con franja tricolor superior; footer `bg-blue-950` con borde
  rojo (`border-t-4 border-red-600`) y textos `text-blue-300/400`.
- Ya NO hay tema oscuro. Cuidado con clases inyectadas desde `public/main.js`:
  Tailwind solo escanea `src/`, así que esas clases deben existir también en
  algún archivo de `src/` (hoy: text-slate-500/600, text-emerald-600).
- Las bolas: `.ball-white`/`.ball-red` en global.css; en tarjetas compactas se
  usan chips `bg-gray-200 text-gray-900` (blancas) + color por juego
  (`bolaClases` en juegos.js).

## Interfaz tipo app nativa en móvil (sep 2026)

Por debajo de `lg` (1024px) el sitio se comporta como una app; en escritorio
no cambia nada (header con nav + dropdown, FAB de subir).

- **App bar** (header): en la home muestra el logo; en las demás páginas,
  botón "Volver" + título de la pantalla (`pantallaDe()` en navegacion.js).
  "Volver" hace `history.back()` si se llegó desde el sitio; si no (entrada
  desde Google), va al padre lógico (`/estados/`, `/resultados/` o `/`).
  A la derecha, "Compartir" (Web Share API; si no hay, copia el enlace).
- **Barra de pestañas** inferior: Inicio · Sorteos · Historial · Estados · Más.
  Sorteos y Más abren **hojas inferiores** (`Hoja.astro`); son enlaces reales
  (`/#sorteos`, `#footer`) para que funcionen sin JS. Tocar la pestaña de la
  pantalla actual sube al inicio (reemplaza al FAB `#scrollTop` en móvil).
- Las hojas se cierran con el fondo, la X, Escape o arrastrando el asa, y
  **empujan una entrada al historial**: el "atrás" de Android cierra la hoja
  en lugar de salir. Al tocar un enlace dentro de una hoja, `main.js` primero
  saca esa entrada del historial y luego navega (`navegarDesdeHoja`).
- **Chips de juegos** bajo el header en la home y en las páginas de juego.
- **Transiciones entre páginas** con View Transitions de CSS (`@view-transition`),
  solo < lg y sin `prefers-reduced-motion`. No se usa el `<ClientRouter />` de
  Astro: rompería los anuncios (`document.write`) y la inicialización de main.js.
- Alturas de las barras en variables CSS (`--appbar-h`, `--tabbar-h`, `--adbar-h`,
  `--safe-top/bottom` con `viewport-fit=cover`); el `body` reserva ese espacio
  arriba y abajo. Si cambias la altura de una barra, cambia la variable.
- Las clases de estas piezas (`.tabbar`, `.hoja`, `.app-icon-btn`…) van en
  global.css **fuera** de `@layer` y **sin `display`** en elementos con
  `lg:hidden` (el CSS propio va después de las utilidades y lo pisaría).
- **PWA**: manifest + íconos + meta de Apple en el Layout (todas las páginas).
  `sw.js` usa **red primero** para páginas y archivos propios (con conexión
  siempre se ve lo último), caché primero solo para `/_astro/*` (con hash), y
  no toca otros dominios (anuncios, Analytics, CDN) ni `/api/`. Para invalidar
  la caché de todos los usuarios, sube `VERSION` en sw.js. "Instalar la app"
  aparece en la hoja "Más" (diálogo nativo en Chrome/Android; instrucciones en iOS).

## SEO — decisiones tomadas (jul 2026)

Basadas en el reporte de Search Console (feb–jul 2026: 9 clics, 2,588 impresiones):

- **Anuncios re-activados (ago 2026)** por decisión del dueño, tras haberlos quitado
  en jul 2026 por page experience. Ver la sección "Anuncios" más abajo: esta vez NO
  hay vignette ni interstitial de página completa (eso era lo penalizado); lo más
  intrusivo es una barra adhesiva de 50px en móvil, dentro de lo que Google acepta.
  Si el tráfico vuelve a caer, el primer sospechoso es esta capa.
- **Canonical = URL con barra final** en todas las páginas (`trailingSlash: 'always'`).
  Antes el canonical de /estados/* apuntaba sin barra y Google indexaba duplicados.
- Título y description de la home son **dinámicos** con la fecha y números del último
  sorteo. `article:modified_time` y `dateModified` del schema usan la fecha del sorteo.
- Sin `SearchAction` falso en el schema WebSite; sin breadcrumb con anclas `#`.
- Páginas `/resultados/YYYY-MM-DD/` capturan long-tail ("números powerball [fecha]",
  "powerball ayer"). Lo que mejor rankea del sitio son las long-tail de estados
  (pos 5–15); las keywords head ("resultados powerball") están en pos 40+ por falta
  de autoridad del dominio.

## Anuncios (ago 2026)

Todas las unidades viven en `src/components/anuncios/`, una por archivo, y cada key
aparece **una sola vez por página** (dos veces la misma key en un HTML hace que la
segunda no renderice).

| Componente | Formato | Dónde |
|---|---|---|
| `Leaderboard.astro` | 728x90 | Layout, bajo el header — solo `md:` (≥768px) |
| `RailIzquierdo.astro` | 160x600 | Layout, fijo al margen izquierdo — solo `2xl:` (≥1536px) |
| `RailDerecho.astro` | 160x300 | Layout, fijo al margen derecho — solo `2xl:` |
| `Nativo.astro` | native banner | Layout, antes del footer — responsive, `async` |
| `MovilSticky.astro` | 320x50 | Layout, barra fija encima de la barra de pestañas — solo móvil (`md:hidden`) |
| `Global.astro` | script de red | Layout, final del `<body>` |
| `Rectangulo.astro` | 300x250 | in-content, en cada página (bajo los números) |
| `Banner468.astro` | 468x60 | in-content, corte de mitad de página — solo `sm:` (≥640px) |

Detalles que importan si tocas esto:

- Los pares `atOptions` + `invoke.js` van con **`is:inline`** obligatorio: `invoke.js`
  escribe el iframe con `document.write()` en la posición del script, así que Astro no
  puede moverlos ni agruparlos. Tampoco se les puede poner `async`/`defer`.
- `.anuncio-slot` (en `global.css`) reserva el tamaño exacto de cada creativo → CLS 0.
  Los breakpoints están elegidos para que ningún creativo desborde: 468 solo desde
  640px, 728 desde 768px, y los rails desde 1536px (a esa anchura quedan 192px de
  margen a cada lado del contenido `max-w-6xl`, y el rail mide 160px).
- La barra adhesiva de móvil va apilada sobre la barra de pestañas
  (`.barra-anuncio-movil` en global.css) y el `body` reserva ambas alturas
  (`--adbar-h` + `--tabbar-h`), así que no tapa el footer.
- `privacidad.astro` y `terminos.astro` declaran las cookies publicitarias y las
  redes de terceros. Si cambias de red, actualiza también esos textos.

## Comandos útiles

```bash
npm run dev       # Servidor de desarrollo local
npm run build     # Build estático → dist/
npm run preview   # Preview del build
node scripts/update-resultados.mjs  # Actualizar resultados.json a mano
node scripts/update-sorteos.mjs     # Actualizar sorteos.json (multi-juego, capa2)
git push origin main  # Deploy (CI/CD via git push)
```

## Convenciones importantes

- Scripts externos usan `is:inline` en Astro para evitar procesamiento
- `OG_IMAGE` en `estados.js` exporta la ruta relativa (`/powerball-estados.jpg`); las páginas construyen la URL absoluta con `${siteUrl}${OG_IMAGE}`
- El layout importa `global.css` — no repetirlo en páginas individuales
- `astro.config.mjs` tiene `site: 'https://resultpowerball.com'` (necesario para el sitemap) y `trailingSlash: 'always'`
- Los enlaces internos siempre con barra final (`/estados/`, `/resultados/2026-07-14/`)
- Fechas de sorteos en formato ISO `YYYY-MM-DD`; formateo en español via `src/utils/fechas.js`

## Pendiente

- [ ] Cash4Life: dataset de data.ny.gov atrasado (último sorteo feb 2026); se
      muestra con nota de "último resultado disponible" hasta que haya datos frescos
- [ ] Historial por juego (/mega-millions/resultados/…) cuando el backend
      acumule histórico de los demás juegos
- [ ] Agregar los ~20 estados restantes (+ DC, Puerto Rico, Islas Vírgenes) en `src/data/estados.js`
- [ ] Bloque de respuesta directa arriba en páginas de estado (precio, días y hora local del sorteo) — las queries tipo "cuándo se juega el powerball en california" ya rankean pos 9–12
- [ ] Páginas informacionales: "¿A qué hora juega el Powerball?", "¿Cómo cobrar premios?" (98 consultas sin página en el reporte GSC)
- [ ] Verificar indexación de `/resultados/*` en Google Search Console tras el primer deploy con datos
