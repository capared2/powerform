# ResultPowerball — CLAUDE.md

Documentación técnica del proyecto para sesiones futuras con Claude Code.

## Stack

- **Framework:** Astro 5.8 (static site generation)
- **CSS:** Tailwind CSS 3.4 + `@tailwindcss/typography`
- **Imágenes:** Sharp (dev dependency, usado para optimizar la OG image)
- **Sitemap:** `@astrojs/sitemap` (genera sitemap dinámico automático en build)
- **Deploy:** Git push a `github-porto:capared2/powerform.git` (rama `main`)
- **Dominio:** `https://resultpowerball.com`

## Estructura del proyecto

```
src/
  components/
    AdBanner.astro       # Banner Adsterra (invoke.js + container div)
    AdSquare.astro       # Banner 300x250 iframe (atOptions + highperformanceformat)
  data/
    estados.js           # Datos de 20 estados: slugs, keywords, FAQs, ciudades + OG_IMAGE
  layouts/
    Layout.astro         # Layout global: head, header, footer, todos los scripts de anuncios
  pages/
    index.astro          # Home: resultados en vivo, FAQ, 45 estados, guía
    contacto.astro
    terminos.astro
    privacidad.astro
    estados/
      index.astro        # Índice de los 20 estados con grid de cards
      [estado].astro     # Ruta dinámica: genera 1 página por estado
  styles/
    global.css           # Tailwind directives + estilos custom (balls, skeleton, etc.)
public/
  main.js                # JS del cliente (Lucide icons, scroll, FAQ accordion)
  robots.txt
  powerball-estados.jpg  # Imagen OG local, 1200x630, 91KB (billboard Powerball, CC)
```

## Lo que se realizó en esta sesión

### 1. Google Analytics
- Agregado en `Layout.astro` dentro del `<head>` con `is:inline`
- ID: `G-ZQ3EWYTH5G`
- Aplica a todas las páginas automáticamente

### 2. SEO agresivo — 20 páginas de blog por estado

**Archivo de datos:** `src/data/estados.js`
- 20 estados con: `slug`, `nombre`, `nombreEs`, `capital`, `keywords[]`, `descripcion`, `faqs[]`, `ciudades[]`
- Exporta también `OG_IMAGE = '/powerball-estados.jpg'`
- Cada estado tiene 8 long-tail keywords y 4 FAQs únicas en español

**Estados cubiertos (lote 1 de 20):**
California, Texas, Florida, New York, Illinois, Arizona, New Mexico, Colorado, Nevada, Georgia, Carolina del Norte, New Jersey, Washington, Oregón, Pensilvania, Virginia, Michigan, Ohio, Massachusetts, Tennessee

**Páginas generadas:**
- `/estados` — índice con CollectionPage schema
- `/estados/[slug]` — artículo por estado con:
  - Schema JSON-LD: `Article` + `FAQPage` + `BreadcrumbList`
  - Open Graph + Twitter Card
  - Imagen OG absoluta: `https://resultpowerball.com/powerball-estados.jpg`
  - Breadcrumb visual: Inicio › Powerball por Estado › [Estado]
  - Secciones: héroe, ciudades, keywords chip, cómo jugar (5 pasos), FAQ accordion, CTA, navegación entre estados

**Próximo paso pendiente:** agregar los 30 estados restantes en `src/data/estados.js` y el array `estados[]`.

### 3. Sitemap dinámico
- Instalado `@astrojs/sitemap`
- Configurado en `astro.config.mjs`
- Genera `sitemap-index.xml` automáticamente en cada build

### 4. Fix CSS global
- `global.css` movido al import de `Layout.astro` (antes solo estaba en `index.astro`)
- Ahora Tailwind aplica en todas las páginas, incluyendo las de estados

### 5. Enlaces a /estados desde la home
Dos puntos de entrada en `index.astro`:
- Sección "45 Estados": botón outline al pie del grid
- Sección "Resultados por Estado": banner CTA con gradiente rojo

### 6. Imagen OG local
- Descargada de Wikimedia Commons (billboard Powerball, licencia CC, foto de Tony Webster)
- Optimizada con Sharp: 1200×630, 82% calidad JPEG, 91KB
- Servida desde `/powerball-estados.jpg`
- Crédito: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Powerball_and_Mega_Millions_Lottery_Jackpot_Prize_Billboard_in_Missouri_(44555666811).jpg)

### 7. Anuncios Adsterra
Integrados en todo el sitio. Dos componentes reutilizables:

**`AdBanner.astro`** — Banner con container div (invoke.js):
```
Script: pl29624141.effectivecpmnetwork.com
Container: caab74139c2a4dfb8eabf58864b37dfa
```

**`AdSquare.astro`** — Banner 300×250 iframe:
```
Key: 258892b31cefe22b315f151059a3c503
Script: highperformanceformat.com
```

**Scripts globales en `Layout.astro`** (antes de `</body>`):
```
Popunder #1:  pl29624140.effectivecpmnetwork.com
Popunder #2:  pl29624143.effectivecpmnetwork.com
Social bar:   effectivecpmnetwork.com/mpsm4fmaja?key=0b49c6471d5459515cedd3c45e94c357
```

**Ubicaciones de anuncios:**

| Ubicación | Componente |
|---|---|
| Bajo header (global, todas las páginas) | `AdBanner` |
| Sobre footer (global, todas las páginas) | `AdSquare` |
| `/estados` — entre hero y grid | `AdBanner` |
| `/estados` — entre grid e info | `AdSquare` |
| `/estados/[estado]` — entre ciudades y cómo jugar | `AdSquare` |
| `/estados/[estado]` — entre cómo jugar y FAQ | `AdBanner` |

### 8. Monetag
- Meta de verificación en `<head>` del Layout:
  ```html
  <meta name="monetag" content="5d589a48e42aaf91401a9b91f4dc8be6" />
  ```
- Script de zona en `Layout.astro` antes de `</body>`:
  ```html
  <script src="https://quge5.com/88/tag.min.js" data-zone="245655" async data-cfasync="false"></script>
  ```

## Comandos útiles

```bash
npm run dev       # Servidor de desarrollo local
npm run build     # Build estático → dist/
npm run preview   # Preview del build
git push origin main  # Deploy (CI/CD via git push)
```

## Convenciones importantes

- Todos los scripts de anuncios y externos usan `is:inline` en Astro para evitar procesamiento
- `OG_IMAGE` en `estados.js` exporta la ruta relativa (`/powerball-estados.jpg`); las páginas construyen la URL absoluta con `${siteUrl}${OG_IMAGE}` para las metas og/twitter
- El layout importa `global.css` — no repetirlo en páginas individuales
- `astro.config.mjs` tiene `site: 'https://resultpowerball.com'` necesario para el sitemap

## Pendiente

- [ ] Agregar los 30 estados restantes en `src/data/estados.js`
- [ ] Evaluar agregar más zonas de Monetag una vez aprobada la cuenta
- [ ] Verificar indexación de `/estados/*` en Google Search Console
