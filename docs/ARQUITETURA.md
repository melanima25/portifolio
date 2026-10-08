# Arquitetura — Landing page de portfólio do Breno

> Autor: agente Arquiteto · Data: 07/10/2026 · Base: `research/relatorio-consolidado.md` (+ `layouts.md`, `ferramentas.md`, `conteudo.md`)
> Escopo: plano e contratos. **Este documento não contém o código da página.**

**Regras invioláveis de conteúdo**
1. Nada de dados reais de pacientes, nomes de setores, pessoas ou da instituição onde o Breno trabalha. A trajetória é citada de forma genérica ("área da saúde", "consolidação de indicadores").
2. Nada inventado: links, métricas, números de uso, depoimentos e datas que não temos ficam como placeholder **`TODO_*`** (ex.: `TODO_URL_DEMO`, `TODO_METRICA`). O build de produção deve falhar se sobrar algum `TODO_` (ver tarefa DO-4).
3. O CRM Lava Jato pode citar o nome do cliente (TZ Auto Estética) — autorizado pelo Breno. Logo/nome só com o arquivo fornecido por ele (`TODO_LOGO_CLIENTE`).

---

## 1. ADR-001 — Decisões de arquitetura

**Status:** aceito · **Contexto:** página única, estática, vitrine para recrutadores de vagas remotas júnior; precisa carregar rápido, ser acessível e mostrar ferramentas que o mercado pede (TypeScript nº 1 no GitHub Octoverse 2025; React lidera vagas júnior no BR).

| # | Decisão | Justificativa | Alternativa descartada |
|---|---|---|---|
| D1 | **Astro 5 + TypeScript (strict)** | Conteúdo estático; Astro envia 0 KB de JS por padrão → Lighthouse alto e SEO; lidera em satisfação (State of JS 2025). TS é a linguagem nº 1 do GitHub. | Next.js (≈85–95 KB de JS numa página simples, exagero); HTML puro (não demonstra ferramental). |
| D2 | **Tailwind CSS v4** com tokens em CSS custom properties | Muito citado em vagas; tokens em `:root` permitem tema claro/escuro sem duplicar classes. | CSS Modules / styled-components. |
| D3 | **Uma única ilha React** (`ThemeToggle`, `client:idle`) | Demonstra React (stack mais pedida) sem pagar JS na página toda. Escopo deliberadamente mínimo. | Página inteira em React (JS desnecessário). |
| D4 | **Content Collections** (`src/content/projetos/*.md` + schema Zod) | Adicionar projeto = criar 1 arquivo Markdown; schema tipado barra campo faltando no build. Casa com a estratégia "alimentar a vitrine a cada projeto". | Dados hardcoded no componente. |
| D5 | **Página única** com âncoras + bento grid | Wireframe da pesquisa (modelo brittanychiang.com); recrutador escaneia em segundos. Estudo de caso do CRM fica na mesma página (seção própria); páginas `/projetos/[slug]` ficam para v2. | Multi-página já na v1. |
| D6 | **Estilo A — Dev Terminal Escuro** (padrão) + toggle para claro | Direção recomendada; comum no meio dev; paleta validada com contraste AA (seção 3). Respeita `prefers-color-scheme` na primeira visita. | B Editorial / C Brutalista. |
| D7 | **Fontes self-hosted** via `@fontsource-variable` (JetBrains Mono, Inter), subset latin, `font-display: swap`, preload só da fonte do hero | Evita request a Google Fonts, melhora LCP e privacidade. | Google Fonts CDN. |
| D8 | **Cloudflare Pages** (Git integration, build `npm run build`, saída `dist/`) | Banda ilimitada para estático, plano grátis permite uso comercial (útil também para o CRM). Confirmar termos oficiais (fonte era agregador). | Vercel Hobby / GitHub Pages (restrição comercial). |
| D9 | **GitHub Actions** para CI (lint, typecheck, build, testes, Lighthouse CI) — o deploy fica com a integração nativa do Cloudflare | CI visível no repo é sinal de maturidade para recrutador; deploy simples. | Deploy via Action com `wrangler` (mais segredos para gerenciar). |
| D10 | **Testes enxutos:** Vitest (schema/util), Playwright + `@axe-core/playwright` (smoke + a11y), Lighthouse CI com orçamento ≥ 95 | Pouco e bem feito; ferramentas citadas na pesquisa. | Suíte pesada. |
| D11 | **Sem analytics de terceiros na v1** | Zero JS extra e nenhum banner de cookies. Se quiser, Cloudflare Web Analytics depois (decisão do Breno). | GA4. |
| D12 | **Formulário de contato: não na v1** — só `mailto:` + LinkedIn + GitHub | Evita backend, spam e LGPD. | Form com serviço externo. |
| D13 | **Uso de IA declarado** no README do repo e numa linha discreta no rodapé | Pedido do Breno (transparência) e recomendação da pesquisa (saber explicar o código). | — |

**Consequências:** JS total esperado < 15 KB gzip (só a ilha); qualquer novo projeto entra por Markdown; trocar estilo = trocar tokens.

---

## 2. Estrutura de pastas

```
portfolio/
├─ .github/
│  └─ workflows/
│     └─ ci.yml                 # lint, typecheck, test, build, lighthouse
├─ docs/
│  └─ ARQUITETURA.md            # este documento
├─ research/                    # pesquisas (não publicado)
├─ public/
│  ├─ favicon.svg
│  ├─ og-image.png              # 1200x630 (TODO_OG_IMAGE)
│  ├─ cv-breno.pdf              # TODO_CV (opcional; sem CV o botão some)
│  ├─ robots.txt
│  └─ _headers                  # headers Cloudflare (cache + segurança)
├─ src/
│  ├─ assets/
│  │  └─ projetos/              # screenshots (otimizadas por astro:assets)
│  ├─ components/
│  │  ├─ layout/   Header.astro, Footer.astro, SkipLink.astro, SEO.astro
│  │  ├─ sections/ Hero.astro, Projetos.astro, EstudoDeCaso.astro,
│  │  │            Stack.astro, Sobre.astro, Contato.astro
│  │  ├─ ui/       ProjectCard.astro, BentoGrid.astro, Badge.astro,
│  │  │            Button.astro, SectionTitle.astro, Icon.astro
│  │  └─ react/    ThemeToggle.tsx          # única ilha React
│  ├─ content/
│  │  └─ projetos/
│  │     ├─ crm-lava-jato.md
│  │     ├─ crm-advocacia.md                # status: em-breve
│  │     ├─ dashboard-indicadores.md        # status: em-breve
│  │     └─ chatbot-rag.md                  # status: em-breve
│  ├─ content.config.ts         # schema Zod da collection
│  ├─ data/
│  │  ├─ site.ts                # nome, título, links sociais (TODO_*)
│  │  └─ stack.ts               # tecnologias agrupadas
│  ├─ layouts/
│  │  └─ BaseLayout.astro       # <html lang="pt-BR">, script anti-flash de tema
│  ├─ lib/
│  │  └─ projetos.ts            # ordenação/filtro (testável)
│  ├─ pages/
│  │  ├─ index.astro
│  │  └─ 404.astro
│  └─ styles/
│     └─ global.css             # @import tailwind, tokens :root / [data-theme]
├─ tests/
│  ├─ unit/      projetos.test.ts, schema.test.ts
│  └─ e2e/       home.spec.ts, a11y.spec.ts
├─ astro.config.mjs             # site: TODO_DOMINIO, integração react + sitemap
├─ lighthouserc.json
├─ tsconfig.json                # extends astro/tsconfigs/strict
├─ eslint.config.js / .prettierrc
├─ package.json
└─ README.md                    # porquê das decisões + uso de IA
```

---

## 3. Design tokens

Definidos como CSS custom properties em `src/styles/global.css` e expostos ao Tailwind via `@theme`. Tema escuro é o padrão; o claro é aplicado com `[data-theme="light"]` (ou `prefers-color-scheme: light` sem escolha salva).

### 3.1 Cores (contraste calculado, WCAG 2.2)

| Token | Escuro (padrão) | Claro | Uso | Contraste verificado |
|---|---|---|---|---|
| `--color-bg` | `#0B0F14` | `#FAFAF7` | fundo da página | — |
| `--color-surface` | `#121821` | `#FFFFFF` | cards do bento | — |
| `--color-border` | `#2A3441` | `#D1D5DB` | bordas finas (decorativas) | não é texto |
| `--color-text` | `#E6EDF3` | `#1F2933` | texto principal | 16,3:1 / 14,1:1 |
| `--color-text-muted` | `#8B98A5` | `#52606D` | legendas, metadados | 6,5:1 (6,1:1 no surface) / 6,2:1 |
| `--color-accent` | `#3DDC97` | `#0E7A4F` | links, destaques, foco | 10,9:1 / 5,1:1 |
| `--color-accent-contrast` | `#0B0F14` | `#FAFAF7` | texto sobre botão de acento | 10,9:1 / 5,1:1 |
| `--color-warn` | `#F5A97F` | `#9A4A16` | badge "em breve" | 9,9:1 / 6,0:1 |

Regras: nunca usar `#3DDC97` como texto no tema claro (contraste baixo). Anel de foco = `--color-accent`, 2px + offset 2px (≥ 3:1 contra o fundo em ambos os temas).

### 3.2 Tipografia

| Token | Valor |
|---|---|
| `--font-mono` | "JetBrains Mono Variable", ui-monospace, monospace — títulos, badges, prompt do hero |
| `--font-sans` | "Inter Variable", system-ui, sans-serif — corpo |
| `--text-hero` | `clamp(2.25rem, 1.5rem + 3.5vw, 4rem)` / line-height 1.1 |
| `--text-h2` | `clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)` / 1.2 |
| `--text-h3` | `1.25rem` / 1.3 |
| `--text-body` | `1rem` (mín. 16px) / 1.6 |
| `--text-small` | `0.875rem` / 1.5 (mín. absoluto) |
| Pesos | 400 corpo · 600 títulos · 700 só no hero |
| Medida | parágrafos com `max-width: 65ch` |

### 3.3 Espaçamento, forma e movimento

| Token | Valor |
|---|---|
| Escala | base 4px: `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-6` 24 · `-8` 32 · `-12` 48 · `-16` 64 · `-24` 96 |
| `--section-gap` | `clamp(4rem, 3rem + 4vw, 6rem)` |
| `--container` | `72rem` (1152px), gutter lateral `--space-4` (16px) no mobile, `--space-8` ≥ 768px |
| `--radius` | `8px` cards · `6px` botões/badges |
| `--border-width` | `1px` |
| Bento | 1 col < 640px · 2 col ≥ 640px · 4 col ≥ 1024px; card destaque = 2×2; gap `--space-4` |
| Breakpoints | `sm 640` · `md 768` · `lg 1024` · `xl 1280` |
| Alvo de toque | mín. 44×44px |
| `--duration` | `150ms` hover · `250ms` entrada; easing `cubic-bezier(.2,.8,.2,1)` |
| Movimento | cursor piscando no hero e microinterações **desligados** em `prefers-reduced-motion: reduce` |
| Proibido | glassmorphism, parallax, autoplay de vídeo |

---

## 4. Componentes e conteúdo por seção

### 4.1 Componentes

| Componente | Tipo | Props principais | Notas |
|---|---|---|---|
| `BaseLayout` | layout | `title`, `description` | `lang="pt-BR"`, script inline anti-flash (lê `localStorage` em try/catch, define `data-theme` antes do paint) |
| `SEO` | layout | `title`, `description`, `image` | meta, Open Graph, Twitter card, canonical, JSON-LD `Person` |
| `SkipLink` | layout | — | "Pular para o conteúdo" → `#conteudo` |
| `Header` | layout | `links` | fixo, `<nav aria-label="Principal">`, âncoras, ícones LinkedIn/GitHub, `ThemeToggle`; menu colapsável no mobile **sem JS** (`<details>`) |
| `ThemeToggle` | **React ilha** | — | `<button aria-pressed>` + rótulo acessível "Ativar tema claro/escuro"; persiste em `localStorage` |
| `Hero` | section | — | `<h1>`, prompt mono com cursor, 3 CTAs |
| `Projetos` / `BentoGrid` / `ProjectCard` | section/ui | `projeto`, `variant: "destaque" \| "padrao"` | card inteiro clicável só se houver link real; badges de stack; badge de status |
| `EstudoDeCaso` | section | `projeto` (o `destaque: true`) | renderiza o corpo Markdown do projeto |
| `Stack` | section | `grupos` de `data/stack.ts` | lista agrupada, ícone + texto (ícone `aria-hidden`) |
| `Sobre`, `Contato`, `Footer` | section/layout | — | ver conteúdo |
| `Badge`, `Button`, `SectionTitle`, `Icon` | ui | `variant`, `href`, `as` | `Button` vira `<a>` quando tem `href`; ícones SVG inline |

### 4.2 Conteúdo por seção (rascunho — Breno revisa o texto final)

**Header** — `breno.dev` (`TODO_NOME_EXIBICAO`) · Projetos · Sobre · Stack · Contato · [LinkedIn `TODO_URL_LINKEDIN`] [GitHub `TODO_URL_GITHUB`] · toggle de tema.

**Hero** (`#inicio`)
- Prompt mono: `> breno --status` → `disponível para vaga remota`
- H1: **"Breno — Desenvolvedor Júnior"** (`TODO_SOBRENOME` opcional)
- Subtítulo: "Construo sistemas web que resolvem problemas reais. Meu primeiro CRM está em produção, usado todos os dias por um lava jato."
- CTAs: **Ver projetos** (`#projetos`) · **Falar comigo** (`#contato`) · **Baixar CV** (`TODO_CV` — esconder se ausente)

**Projetos** (`#projetos`) — título "Projetos"
- Card destaque (2×2): **CRM Lava Jato — TZ Auto Estética** · badge "Em produção" · "Sistema de gestão para um lava jato real: `TODO_RESUMO_FUNCIONALIDADES` (ex.: clientes, serviços, agenda — confirmar)." · stack `TODO_STACK_CRM` · links: Demo `TODO_URL_DEMO_CRM` · Código `TODO_URL_REPO_CRM` · "Ler estudo de caso ↓".
- Cards "Em breve" (sem links, badge âmbar, texto curto):
  - **CRM para escritório de advocacia** — clientes, processos, agenda e documentos.
  - **Dashboard de indicadores** — consolidação semanal → mensal/anual com dados **fictícios**.
  - **Chatbot com IA (RAG)** — atendimento com base de conhecimento.
- Linha final: "Novos projetos entram aqui conforme ficam prontos — acompanhe no GitHub."

**Estudo de caso** (`#estudo-de-caso`) — "Como construí o CRM do lava jato"
- O problema: `TODO_PROBLEMA` (como o cliente controlava antes)
- Decisões técnicas: `TODO_DECISOES` (stack, banco, hospedagem e porquê)
- Como usei IA: agentes de IA no desenvolvimento, com revisão e entendimento de cada parte (texto do Breno)
- Resultado: `TODO_RESULTADO` — **somente fatos confirmados**; nenhuma métrica sem fonte
- Próximos passos: versão multiusuário (CRM v2)
- Screenshot: `TODO_SCREENSHOT_CRM` (sem dados pessoais de clientes do lava jato — usar base de demonstração ou borrar)

**Stack** (`#stack`) — "Com o que trabalho" — só o que o Breno domina; grupos: Front-end · Back-end · Banco · Ferramentas. Conteúdo em `data/stack.ts` = `TODO_STACK_CONFIRMADA` (Breno marca cada item; nada entra por suposição). Sugestão de grupo "Estudando agora" separado.

**Sobre** (`#sobre`) — 3–4 linhas:
> "Trabalho na área da saúde com rotinas administrativas: todo mês consolido indicadores enviados por diferentes equipes. Foi automatizando essas planilhas que comecei a programar. Hoje construo sistemas web para pequenos negócios e busco minha primeira vaga remota como desenvolvedor."
(Genérico de propósito: sem nome da instituição, setores, pessoas ou dados.) Cidade/UF opcional: `TODO_LOCAL`.

**Contato** (`#contato`) — "Vamos conversar?" · "Estou aberto a vagas remotas júnior e a projetos freelance." · E-mail `TODO_EMAIL_PUBLICO` (mailto) · LinkedIn · GitHub.

**Footer** — "© 2026 Breno · Feito com Astro e Tailwind · Desenvolvido com apoio de agentes de IA" · link "Código deste site" `TODO_URL_REPO_PORTFOLIO`.

**404** — "Página não encontrada" + link para o início.

**SEO** — title "Breno — Desenvolvedor Júnior | Portfólio"; description ≤ 155 caracteres; `og-image` `TODO_OG_IMAGE`; `site` `TODO_DOMINIO`.

---

## 5. Estrutura de dados — Content Collection `projetos`

Arquivo: `src/content.config.ts` (loader `glob` em `src/content/projetos/*.md`). Contrato (o dev-frontend implementa exatamente estes campos):

| Campo | Tipo (Zod) | Obrig. | Regra |
|---|---|---|---|
| `titulo` | `string().min(3).max(60)` | sim | |
| `slug` | derivado do nome do arquivo | — | |
| `resumo` | `string().max(160)` | sim | uma frase: problema → solução |
| `status` | `enum(["producao","concluido","em-andamento","em-breve"])` | sim | |
| `destaque` | `boolean().default(false)` | não | **exatamente 1** projeto `true` (validado em teste) |
| `ordem` | `number().int()` | sim | ordenação crescente no grid |
| `stack` | `array(string()).max(8)` | sim | vazio permitido só em `em-breve` |
| `cliente` | `string().optional()` | não | só com autorização explícita |
| `links` | `object({ demo: url().optional(), repo: url().optional(), estudoDeCaso: string().optional() })` | não | `em-breve` não pode ter `demo`/`repo` |
| `imagem` | `image().optional()` | não | via `astro:assets`; exige `imagemAlt` |
| `imagemAlt` | `string().optional()` | cond. | obrigatório se `imagem` existir (`refine`) |
| `periodo` | `object({ inicio: string(), fim: string().optional() })` | não | formato `AAAA-MM` |
| `usoDeIA` | `string().max(200).optional()` | não | transparência sobre IA |
| corpo `.md` | Markdown | não | estudo de caso (usado se `destaque`) |

Placeholders `TODO_*` são strings — por isso `url()` falharia; durante o desenvolvimento os links não preenchidos ficam **ausentes** (campo omitido) e a pendência é registrada num comentário `# TODO_URL_DEMO_CRM` no frontmatter. O check de DO-4 procura `TODO_` no `dist/`.

Exemplo de frontmatter (estrutura, não conteúdo final):

```yaml
---
titulo: "CRM Lava Jato — TZ Auto Estética"
resumo: "TODO_RESUMO"
status: producao
destaque: true
ordem: 1
stack: [] # TODO_STACK_CRM
cliente: "TZ Auto Estética"
# links: TODO_URL_DEMO_CRM, TODO_URL_REPO_CRM
usoDeIA: "Desenvolvido com apoio de agentes de IA, com revisão de cada entrega."
---
```

Helper `src/lib/projetos.ts`: `getProjetosOrdenados()`, `getDestaque()` (lança erro se ≠ 1), `isEmBreve()` — puros e cobertos por Vitest.

---

## 6. Checklist de acessibilidade e performance (meta: Lighthouse ≥ 95 em todas as categorias, mobile e desktop)

### Acessibilidade (WCAG 2.2 AA)
- [ ] `<html lang="pt-BR">`; landmarks `header`/`nav`/`main#conteudo`/`footer`; uma `h1`, hierarquia h2→h3 sem saltos
- [ ] Skip link visível no foco
- [ ] Contraste ≥ 4,5:1 (texto) e ≥ 3:1 (UI/foco) nos **dois** temas — tabela da seção 3.1
- [ ] Foco visível em todo interativo (`:focus-visible`, anel de acento); nada de `outline: none` sem substituto
- [ ] Navegação 100% por teclado (Tab, Shift+Tab, Enter, Espaço); ordem lógica; menu mobile operável
- [ ] `ThemeToggle`: `button` com nome acessível e `aria-pressed`; sem flash de tema errado
- [ ] Imagens com `alt` descritivo; ícones decorativos `aria-hidden="true"`; links só-ícone com `aria-label`
- [ ] Links externos com indicação ("abre em nova aba") quando `target="_blank"` + `rel="noopener"`
- [ ] Badge de status não depende só de cor (texto "Em breve"/"Em produção")
- [ ] `prefers-reduced-motion` desativa animações; `prefers-color-scheme` respeitado na 1ª visita
- [ ] Alvos de toque ≥ 44×44px; zoom 200% e largura 320px sem rolagem horizontal
- [ ] axe-core: 0 violações sérias/críticas

### Performance (Core Web Vitals)
- [ ] LCP ≤ 2,5 s (hero é texto → LCP alvo < 1,5 s), CLS ≤ 0,1, INP ≤ 200 ms, TBT < 100 ms
- [ ] JS total < 15 KB gzip (só a ilha, `client:idle`); nenhum script de terceiros
- [ ] Fontes self-hosted, subset latin, `woff2`, `font-display: swap`, preload apenas da fonte do H1
- [ ] Imagens via `astro:assets` (AVIF/WebP, `width`/`height`, `loading="lazy"` fora da primeira dobra, `fetchpriority="high"` se houver imagem acima da dobra)
- [ ] CSS crítico inline pelo Astro; Tailwind sem classes não usadas
- [ ] `_headers`: cache longo (`immutable`) para `/_astro/*`; HTML com revalidação
- [ ] Peso total da página < 500 KB na primeira carga

### SEO / boas práticas
- [ ] title, description, canonical, Open Graph, JSON-LD `Person`, `sitemap.xml`, `robots.txt`, 404
- [ ] HTTPS, headers de segurança (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP básica)
- [ ] Zero erros no console; zero `TODO_` no build publicado

---

## 7. Plano de tarefas por agente (ordem de execução)

Dependências entre parênteses. Cada tarefa termina com commit pequeno e descritivo (o histórico também é vitrine).

### Fase 0 — Bloqueios com o Breno (antes ou em paralelo à Fase 1)
- **BR-1** Fornecer: URLs LinkedIn/GitHub, e-mail público, domínio (ou usar `*.pages.dev`), stack real do CRM, descrição/funcionalidades, links demo/repo do CRM, screenshot sem dados pessoais, logo do cliente, CV (opcional), lista de tecnologias que domina. Até lá, tudo segue como `TODO_*`.

### Fase 1 — Fundação
1. **devops-deploy · DO-1** Criar repo público, `npm create astro` (template mínimo, TS strict), Tailwind v4, `@astrojs/react`, `@astrojs/sitemap`, ESLint + Prettier, `.nvmrc` (Node LTS). Scripts: `dev`, `build`, `preview`, `lint`, `typecheck` (`astro check`), `test`, `test:e2e`.
2. **devops-deploy · DO-2** (DO-1) `ci.yml` no GitHub Actions: install → lint → typecheck → test → build. Proteção da branch `main` exigindo CI verde.
3. **dev-frontend · FE-1** (DO-1) Estrutura de pastas da seção 2, `global.css` com tokens da seção 3, `BaseLayout` + script anti-flash, `SEO`, `SkipLink`.

### Fase 2 — Conteúdo e componentes
4. **dev-frontend · FE-2** (FE-1) `content.config.ts` com o schema da seção 5 + 4 arquivos de projeto (1 destaque, 3 em-breve) + `lib/projetos.ts`.
5. **dev-frontend · FE-3** (FE-1) Componentes `ui/` (`Button`, `Badge`, `SectionTitle`, `Icon`, `ProjectCard`, `BentoGrid`).
6. **dev-frontend · FE-4** (FE-2, FE-3) Seções `Header`, `Hero`, `Projetos`, `EstudoDeCaso`, `Stack`, `Sobre`, `Contato`, `Footer`, `404` com o conteúdo da seção 4.2.
7. **dev-frontend · FE-5** (FE-4) Ilha `ThemeToggle.tsx` e menu mobile; revisar `prefers-reduced-motion`.
8. **qa-testes · QA-1** (FE-2) Vitest: schema (campos obrigatórios, exatamente 1 destaque, em-breve sem links, `imagemAlt` condicional) e helpers.

### Fase 3 — Deploy e qualidade
9. **devops-deploy · DO-3** (FE-4) Projeto no Cloudflare Pages ligado ao repo (build `npm run build`, saída `dist`, preview por PR); `public/_headers` e `robots.txt`; confirmar termos do plano grátis na página oficial.
10. **devops-deploy · DO-4** (DO-2) Passo no CI que falha se `grep -r "TODO_" dist/` encontrar algo **apenas no build de produção** (branch `main`); em PR é só aviso. Lighthouse CI (`lighthouserc.json`, asserts ≥ 0,95 nas 4 categorias, mobile).
11. **qa-testes · QA-2** (FE-5, DO-3) Playwright: carrega home, âncoras funcionam, toggle alterna e persiste tema, menu mobile por teclado, 404; `@axe-core/playwright` nos dois temas, em 375px e 1280px.
12. **qa-testes · QA-3** (QA-2) Passada manual pelo checklist da seção 6 (teclado, zoom 200%, 320px, leitor de tela básico); relatório de falhas para o dev-frontend.
13. **dev-frontend · FE-6** (QA-3) Correções apontadas pelo QA.

### Fase 4 — Revisão e publicação
14. **revisor-codigo · RV-1** (FE-6) Revisar: aderência a este documento, tipagem estrita, componentes sem duplicação, nenhum dado sensível (hospital, pacientes, setores, pessoas, dados de clientes do lava jato), nenhum link/métrica inventado, README com o "porquê" + seção "Como usei IA".
15. **dev-frontend · FE-7** (RV-1) Ajustes da revisão.
16. **devops-deploy · DO-5** (FE-7, BR-1) Substituir `TODO_*` com dados do Breno, CI de produção verde (sem `TODO_`, Lighthouse ≥ 95), domínio/`pages.dev` publicado, URL entregue para LinkedIn ("Em destaque") e README de perfil do GitHub.

### Definição de pronto (v1)
Lighthouse ≥ 95 nas 4 categorias (mobile), axe sem violações sérias, CI verde, zero `TODO_` em produção, revisão aprovada, URL no LinkedIn e no GitHub.

### Fora do escopo da v1 (backlog)
Páginas `/projetos/[slug]`, blog/posts, versão em inglês (útil para vagas internacionais), analytics, formulário de contato.
