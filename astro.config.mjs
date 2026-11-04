// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://studioslowpace.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    sitemap(),
    react()
  ],
});