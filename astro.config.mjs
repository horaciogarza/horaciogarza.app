// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// SELECT * FROM config WHERE env = 'production';
export default defineConfig({
  site: 'https://www.horaciogarza.app',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      // emit CSS variables only; global.css picks the theme per color scheme
      defaultColor: false,
      wrap: true,
    },
  },
  build: { inlineStylesheets: 'auto' },
});
