// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // 1. 你的正式網域
  site: 'https://studioslowpace.com',
  
  // 2. Cloudflare SSR 相關設定
  output: 'server', // 如果部分頁面想用靜態，也可以改用 'hybrid'
  adapter: cloudflare(),
  
  // 3. 整合套件（包含 sitemap）
  integrations: [
    sitemap()
  ],
});