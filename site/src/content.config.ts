import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Schema da collection "projetos" (ARQUITETURA seção 5). Adicionar projeto = criar 1 .md.
const projetos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projetos' }),
  schema: ({ image }) =>
    z
      .object({
        titulo: z.string().min(3).max(60),
        resumo: z.string().max(160),
        status: z.enum(['producao', 'concluido', 'em-andamento', 'em-breve']),
        destaque: z.boolean().default(false),
        ordem: z.number().int(),
        stack: z.array(z.string()).max(8),
        cliente: z.string().optional(),
        links: z
          .object({
            demo: z.string().url().optional(),
            repo: z.string().url().optional(),
            estudoDeCaso: z.string().optional(),
          })
          .optional(),
        imagem: image().optional(),
        imagemAlt: z.string().optional(),
        // Galeria do estudo de caso (extensão do schema da ADR): cada imagem exige alt.
        galeria: z
          .array(z.object({ imagem: image(), alt: z.string().min(10), legenda: z.string() }))
          .optional(),
        periodo: z
          .object({
            inicio: z.string().regex(/^\d{4}-\d{2}$/),
            fim: z
              .string()
              .regex(/^\d{4}-\d{2}$/)
              .optional(),
          })
          .optional(),
        usoDeIA: z.string().max(200).optional(),
      })
      .refine((p) => !p.imagem || !!p.imagemAlt, {
        message: 'imagemAlt é obrigatório quando há imagem',
        path: ['imagemAlt'],
      })
      .refine((p) => p.status !== 'em-breve' || (!p.links?.demo && !p.links?.repo), {
        message: 'Projeto "em-breve" não pode ter demo/repo',
        path: ['links'],
      }),
});

export const collections = { projetos };
