# Portfólio — Breno Ferreira

Landing page estática de portfólio (Astro 5 + TypeScript strict + Tailwind v4). Decisões, tokens e
checklists estão em [`../docs/ARQUITETURA.md`](../docs/ARQUITETURA.md).

## Como rodar

```bash
cd site
npm install
npm run dev          # servidor de desenvolvimento
npm run build        # build de desenvolvimento: passa, mas lista as pendências TODO_*
npm run build:prod   # build estrito: FALHA se sobrar qualquer TODO_* (exige SITE_URL)
npm run preview      # serve o dist/
npm run typecheck    # astro check
npm run lint         # eslint
```

Para o build de produção: `SITE_URL=https://seu-dominio npm run build:prod` (veja `.env.example`).

## Estrutura

- `src/pages` — `index.astro` (página única) e `404.astro`
- `src/components/{layout,sections,ui}` — componentes Astro (0 KB de JS por padrão)
- `src/components/react/ThemeToggle.tsx` — única ilha React (`client:idle`)
- `src/content/projetos/*.md` — content collection; **adicionar projeto = criar 1 arquivo** (schema em `src/content.config.ts`)
- `src/data/` — `site.ts` (links/contato) e `stack.ts`
- `src/styles/global.css` — tokens (cores, tipografia, tema claro/escuro)
- `public/_headers`, `wrangler.toml` — configuração do Cloudflare (Workers com arquivos estáticos)
- `../.github/workflows/ci.yml` — CI (lint, typecheck, build; main = build estrito + Lighthouse)

## Como funcionam as pendências

Tudo que ainda não temos fica como `TODO_*`. No build normal aparece como etiqueta tracejada
"pendente: TODO_X" na página e é listado no terminal. No `build:prod` qualquer pendência derruba o
build, então placeholders nunca chegam à produção.

## O que falta preencher

- `TODO_OG_IMAGE` (`site.ts`) — imagem 1200x630 em `public/`
- `SITE_URL` — domínio final ou `*.workers.dev` (variável de ambiente no `build:prod`)
- Opcional: `cv` em `site.ts` (PDF em `public/`); sem ele o botão "Baixar CV" não aparece.

O CRM não tem demo pública (uso interno do cliente, login de usuário único); o card mostra
"Ver código" (repositório público) e as telas ficam na galeria do estudo de caso
(`galeria` no frontmatter de `src/content/projetos/crm-lava-jato.md`, com alt obrigatório).

## Deploy (Cloudflare Workers, arquivos estáticos)

Conecte o repositório pela integração Git: diretório raiz `site`, comando de build
`npm run build:prod`, comando de deploy `npx wrangler deploy` (lê `wrangler.toml`, que publica a
pasta `dist`). O `name` do `wrangler.toml` deve ser igual ao nome do projeto no painel. Defina
`SITE_URL` e `NODE_VERSION=22` nas variáveis de build do projeto e `SITE_URL` no GitHub
(Settings > Variables).

## Uso de IA

Este site foi desenvolvido com apoio de agentes de IA, com revisão do Breno.
