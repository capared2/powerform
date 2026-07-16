import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://resultpowerball.com',
  // Las URLs canónicas del sitio llevan barra final (coinciden con el sitemap
  // y evitan que Google indexe /pagina y /pagina/ como duplicados).
  trailingSlash: 'always',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      serialize(item) {
        const url = item.url;
        // Home: se actualiza con cada sorteo (3x/semana)
        if (url === 'https://resultpowerball.com/') {
          return { ...item, changefreq: 'daily', priority: 1.0, lastmod: new Date() };
        }
        // Índice del historial de sorteos: cambia con cada sorteo (3x/semana)
        if (url === 'https://resultpowerball.com/resultados/') {
          return { ...item, changefreq: 'daily', priority: 0.9, lastmod: new Date() };
        }
        // Páginas de sorteos individuales: no cambian una vez publicadas
        if (url.startsWith('https://resultpowerball.com/resultados/')) {
          return { ...item, changefreq: 'yearly', priority: 0.6 };
        }
        // Índice de estados (debe ir antes del startsWith)
        if (url === 'https://resultpowerball.com/estados/') {
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        }
        // Páginas de estado individuales
        if (url.startsWith('https://resultpowerball.com/estados/')) {
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        }
        // Páginas legales / contacto
        return { ...item, changefreq: 'yearly', priority: 0.3 };
      },
    }),
  ],
});
