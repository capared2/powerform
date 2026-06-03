import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://resultpowerball.com',
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
