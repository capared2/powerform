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
  utils/
    fechas.js            # Formateo de fechas en español compartido (home + /resultados/)
  layouts/
    Layout.astro         # Layout global: head, header, footer (SIN anuncios)
  pages/
    index.astro          # Home: resultados renderizados en build-time, FAQ, estados, guía
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
.github/workflows/
  update-resultados.yml  # Cron 3x/semana + respaldo diario: actualiza datos y pushea a main
public/
  main.js                # JS del cliente (Lucide, scroll, FAQ, refresco de resultados)
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

## SEO — decisiones tomadas (jul 2026)

Basadas en el reporte de Search Console (feb–jul 2026: 9 clics, 2,588 impresiones):

- **Anuncios eliminados por completo** (Monetag popunder/vignette/push + Adsterra).
  El vignette era un interstitial de página completa (penalización de page experience).
  No re-agregar anuncios intrusivos hasta tener tráfico estable.
- **Canonical = URL con barra final** en todas las páginas (`trailingSlash: 'always'`).
  Antes el canonical de /estados/* apuntaba sin barra y Google indexaba duplicados.
- Título y description de la home son **dinámicos** con la fecha y números del último
  sorteo. `article:modified_time` y `dateModified` del schema usan la fecha del sorteo.
- Sin `SearchAction` falso en el schema WebSite; sin breadcrumb con anclas `#`.
- Páginas `/resultados/YYYY-MM-DD/` capturan long-tail ("números powerball [fecha]",
  "powerball ayer"). Lo que mejor rankea del sitio son las long-tail de estados
  (pos 5–15); las keywords head ("resultados powerball") están en pos 40+ por falta
  de autoridad del dominio.

## Comandos útiles

```bash
npm run dev       # Servidor de desarrollo local
npm run build     # Build estático → dist/
npm run preview   # Preview del build
node scripts/update-resultados.mjs  # Actualizar resultados.json a mano
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

- [ ] Agregar los ~20 estados restantes (+ DC, Puerto Rico, Islas Vírgenes) en `src/data/estados.js`
- [ ] Bloque de respuesta directa arriba en páginas de estado (precio, días y hora local del sorteo) — las queries tipo "cuándo se juega el powerball en california" ya rankean pos 9–12
- [ ] Páginas informacionales: "¿A qué hora juega el Powerball?", "¿Cómo cobrar premios?" (98 consultas sin página en el reporte GSC)
- [ ] Verificar indexación de `/resultados/*` en Google Search Console tras el primer deploy con datos
