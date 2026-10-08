// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { rehypePendente } from './src/lib/rehype-pendente.mjs';

// Modo estrito (build:prod): qualquer pendência TODO_* derruba o build (ADR, DO-4).
const strict = process.env.STRICT_TODO === '1';

// Domínio final (TODO_DOMINIO). Em produção vem de SITE_URL (ex.: https://meu-site.pages.dev).
const site = process.env.SITE_URL ?? (strict ? '' : 'http://localhost:4321');
if (strict && !site) {
  throw new Error('TODO_DOMINIO: defina SITE_URL para o build de produção.');
}

export default defineConfig({
  site,
  integrations: [react(), sitemap()],
  markdown: { rehypePlugins: [[rehypePendente, { strict }]] },
  vite: { plugins: [tailwindcss()] },
});
