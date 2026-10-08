import { getCollection } from 'astro:content';

// Funções puras (testáveis com Vitest) sobre qualquer objeto com o formato mínimo abaixo.
interface ComDados {
  data: { ordem: number; destaque: boolean; status: string };
}

export function ordenar<T extends ComDados>(lista: T[]): T[] {
  return [...lista].sort((a, b) => a.data.ordem - b.data.ordem);
}

/** Exatamente 1 projeto deve ter `destaque: true`; caso contrário o build falha. */
export function selecionarDestaque<T extends ComDados>(lista: T[]): T {
  const destaques = lista.filter((p) => p.data.destaque);
  if (destaques.length !== 1) {
    throw new Error(`Esperado exatamente 1 projeto em destaque, encontrado ${destaques.length}.`);
  }
  return destaques[0];
}

export const isEmBreve = (p: ComDados): boolean => p.data.status === 'em-breve';

export async function getProjetosOrdenados() {
  return ordenar(await getCollection('projetos'));
}

export async function getDestaque() {
  return selecionarDestaque(await getCollection('projetos'));
}
