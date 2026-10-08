// Tecnologias usadas no CRM Lava Jato (fatos do README oficial do projeto).
// Só entra aqui o que o Breno confirmou; nada por suposição.
export interface GrupoStack {
  nome: 'Front-end' | 'Back-end' | 'Banco' | 'Ferramentas' | 'Estudando agora';
  itens: string[];
}

export const grupos: GrupoStack[] = [
  {
    nome: 'Front-end',
    itens: ['React', 'TypeScript (estrito)', 'Tailwind CSS', 'shadcn/ui', 'React Hook Form'],
  },
  { nome: 'Back-end', itens: ['Next.js (App Router)', 'Zod'] },
  { nome: 'Banco', itens: ['Prisma', 'SQLite', 'PostgreSQL (Neon)'] },
  { nome: 'Ferramentas', itens: ['Vitest', 'Playwright', 'GitHub Actions', 'Vercel'] },
];
