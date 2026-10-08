---
titulo: 'CRM Lava Jato — TZ Auto Estética'
resumo: 'Sistema de gestão para um lava jato real: clientes, atendimentos, fiado, caixa, estoque e relatórios.'
status: producao
destaque: true
ordem: 1
stack:
  ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'shadcn/ui', 'Vitest']
cliente: 'TZ Auto Estética'
links:
  repo: 'https://github.com/melanima25/crm-lava-jato'
imagem: '../../assets/projetos/crm-atendimentos.jpg'
imagemAlt: 'Tela de Atendimentos do sistema: lista do dia com hora, total, valor pago e situação (pago ou não pago), com nomes e placas desfocados.'
galeria:
  - imagem: '../../assets/projetos/crm-atendimentos.jpg'
    alt: 'Tela de Atendimentos: lista do dia com hora, total, valor pago e situação de cada atendimento, com dados de clientes desfocados.'
    legenda: 'Atendimentos do dia'
  - imagem: '../../assets/projetos/crm-fiado.jpg'
    alt: 'Tela de Fiado: total em aberto, busca por nome, telefone ou placa e tabela com saldo do cliente e botão Receber, com dados pessoais desfocados.'
    legenda: 'Fiado com saldo por cliente'
  - imagem: '../../assets/projetos/crm-caixa.jpg'
    alt: 'Tela de Caixa do dia: saldo acumulado, entradas, saídas, resultado do período e totais por forma de pagamento e por categoria.'
    legenda: 'Caixa com saldo acumulado'
  - imagem: '../../assets/projetos/crm-relatorios.jpg'
    alt: 'Tela de Relatórios: vendido, recebido, fiado, número de atendimentos, ticket médio e ranking de serviços mais vendidos.'
    legenda: 'Relatórios de vendas'
usoDeIA: 'Desenvolvido com agentes de IA em papéis de tech lead, backend, frontend e QA.'
---

### O problema

Um lava jato precisa acompanhar, no dia a dia, clientes e veículos, atendimentos, fiado, caixa e estoque. O sistema reúne tudo isso em um só lugar, construído para a TZ Auto Estética.

### O que o sistema faz

- Login de usuário único, com sessão em cookie assinado e limite de tentativas.
- Clientes e veículos (vários por cliente, carro ou moto) e catálogo de serviços com preços por carro e por moto.
- Atendimentos com serviços e produtos, desconto e pagamento em dinheiro, Pix, débito ou crédito.
- Fiado com saldo por cliente e recebimento de várias pendências de uma vez.
- Caixa com entradas, saídas, categorias, extrato e saldo acumulado.
- Produtos e estoque: entradas, baixas, acerto e baixa automática nas vendas.
- Relatórios: vendido x recebido, fiado, ticket médio, itens e clientes mais frequentes.

### Decisões técnicas

- Stack: Next.js (App Router), React e TypeScript estrito; Prisma com SQLite em desenvolvimento e PostgreSQL (Neon) em produção; Tailwind CSS e shadcn/ui; Zod e React Hook Form.
- Valores monetários guardados em centavos.
- Transações do banco nas escritas que tocam várias tabelas.
- Datas em UTC, exibidas no fuso de São Paulo.
- Regras de negócio isoladas em `src/server`.
- Testes com Vitest e Playwright, com e2e rodando em SQLite e em PostgreSQL.
- Deploy na Vercel e CI com GitHub Actions.

### Como usei IA

Desenvolvi o sistema com agentes de IA em papéis de tech lead, backend, frontend e QA.

### Resultado

O sistema está em produção na TZ Auto Estética, com as entregas 0 a 10 do plano concluídas. É de uso interno do cliente, com login de usuário único, por isso não há demo pública; o código está aberto no GitHub.

### Próximos passos

Lembretes de fiado atrasado via WhatsApp, agendamento de atendimentos e identidade visual.
