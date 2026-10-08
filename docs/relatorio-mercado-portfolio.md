# Relatório de Mercado — Portfólio do Breno (07/10/2026)

Consolidação de 4 pesquisas (vagas, layouts, ferramentas, conteúdo). Fatos têm fonte; inferências estão marcadas como [I]. Detalhes e URLs completos em `research/*.md`.

## 1. O que o mercado pede (vagas e freelas)
- Vagas remotas júnior no BR (DevVagas, início de 2026): React lidera (~40+ vagas), seguido de TypeScript, JavaScript, Node, Java, Python, .NET. Combos comuns: React+Node e .NET+Angular. Júnior ≈ 28% das vagas remotas.
- Upwork (fev/2026): "AI Integration" +178% e "AI Chatbot Development" +71%.
- Workana (dez/2025): sites/landing pages, APIs, MVPs, automação de CRM/marketing e assistentes com IA.
- Salário remoto júnior PJ no BR: R$ 4.500–8.000 (CrazyStack, mar/2026).
- [I] Freelas para júnior: sites > automações/integrações > CRMs sob medida > dashboards > chatbots/IA. IA e automação crescem mais; sites são o mais saturado.
- Lacuna: sem dados verificados de vagas internacionais júnior nem contagem por tipo de serviço.

## 2. Ferramentas e stack
- Stack Overflow Survey 2026 (06/10/2026): JavaScript, SQL, HTML/CSS, Python e Bash lideram; freelance subiu de 3,9% para 10,5%; 70% usam agentes de IA, mas 48% só confiam quando conseguem verificar.
- GitHub Octoverse 2025: TypeScript virou a linguagem nº 1.
- **Landing page:** Astro + TypeScript + Tailwind, com uma ilha React para demonstrar React. HTML/CSS puro é a alternativa simples; Next.js é exagero para página estática.
- **Projetos futuros:** TypeScript em tudo (Python como segunda), React+Vite, Node+Zod, PostgreSQL (Prisma/Drizzle), Docker, GitHub Actions, Vitest/Playwright.
- **Hospedagem:** Cloudflare Pages e Netlify permitem uso comercial no plano grátis; Vercel Hobby e GitHub Pages restringem (relevante para o CRM do lava jato, que atende cliente). Fonte é agregador de terceiros — confirmar nos termos oficiais.
- Usar IA, mas saber explicar o código e registrar o uso no README.

## 3. Layout da landing page
- Recrutadores valorizam projetos completos e publicados, 3–5 bons > 10 medianos, README com o "porquê" das decisões.
- Tendências 2026: bento grid, tipografia grande, dark mode, microinterações, `clamp()`. Evitar glassmorphism (saturado) [I].
- **Wireframe:** header fixo → hero ("dev júnior, vaga remota" + CTAs) → projetos em bento grid (CRM Lava Jato em destaque) → estudo de caso → stack → sobre (hospital → programação) → contato.
- **Direção recomendada [I]:** A) Dev Terminal Escuro (#0B0F14, acento #3DDC97, mono nos títulos + Inter), com toggle de tema claro. Alternativas: B) Claro Editorial, C) Brutalista.
- Referência principal: brittanychiang.com. Metas: Lighthouse ≥ 95, LCP ≤ 2,5 s, acessibilidade (HTML semântico, `prefers-reduced-motion`).

## 4. Conteúdo (LinkedIn + GitHub)
- Carrossel em PDF é o formato com mais engajamento (Buffer, 2M+ posts, ago/2025); texto com gancho forte rende bom alcance.
- Frequência: 2–5 posts/semana; terça a quinta; evitar 12h–14h. Primeira hora de engajamento decide a distribuição.
- Links externos reduzem alcance (estimativas de 18,8% a 60%) → [I] link no perfil/"Em destaque".
- GitHub: README de perfil (repo com o nome do usuário), até 6 pins; só commits com e-mail vinculado, em branch padrão, contam.
- Lacunas: fontes de LinkedIn são blogs de marketing (correlacional); nada específico sobre devs júnior.

## 5. Projetos propostos (ordem sugerida)
1. **CRM v2 multiusuário** (React + Node/TS + Postgres, auth, testes, deploy) — evolução do lava jato.
2. **Dashboard de indicadores** com dados fictícios, inspirado na rotina do hospital (upload semanal por setor, consolidação mensal/anual, exportação). Nunca usar dados reais de pacientes.
3. **Automação/integração** (webhooks, APIs, relatório automático).
4. **Chatbot de IA com base de conhecimento (RAG)** para atendimento.
5. **Landing page de conversão** com SEO e Lighthouse.
A landing page do portfólio vem primeiro (vitrine), alimentada a cada projeto novo.

## 6. Próximos passos
1. Validar a stack (Astro + Cloudflare Pages) e o estilo A.
2. Arquiteto monta o plano da landing page; Frontend + DevOps implementam; QA e Revisor fecham.
3. Calendário de 4 semanas: 3 posts/semana + commits pequenos e frequentes (ver `research/conteudo.md`).
4. Quantificar demanda direto no LinkedIn, Wellfound, Remote OK, Workana e 99Freelas para trocar inferências por dados.
