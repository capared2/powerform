import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://resultpowerball.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
