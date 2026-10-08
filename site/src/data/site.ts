// Dados do site. Tudo que o Breno ainda não forneceu fica como TODO_* (ver README).
export const site = {
  nome: 'Breno Ferreira',
  cargo: 'Desenvolvedor Júnior',
  titulo: 'Breno Ferreira — Desenvolvedor Júnior | Portfólio',
  descricao:
    'Portfólio de Breno Ferreira, desenvolvedor júnior: sistemas web para pequenos negócios, com um CRM já em produção. Aberto a vagas remotas.',
  email: 'brenojf19@gmail.com',
  linkedin: 'https://www.linkedin.com/in/breno-ferreira-928340385/',
  github: 'https://github.com/melanima25',
  repoPortfolio: 'https://github.com/melanima25/portifolio',
  // Opcional: caminho do PDF em /public (ex.: '/cv-breno.pdf'). Sem valor, o botão "Baixar CV" some.
  cv: undefined as string | undefined,
  ogImage: '/og.png',
} as const;

export const navLinks = [
  { href: '#projetos', rotulo: 'Projetos' },
  { href: '#sobre', rotulo: 'Sobre' },
  { href: '#stack', rotulo: 'Stack' },
  { href: '#contato', rotulo: 'Contato' },
] as const;
