// Controle de pendências TODO_* (ver ADR-001, regra 2 e tarefa DO-4).
// - build normal: pendência vira aviso no terminal + marcação visível na página;
// - build estrito (STRICT_TODO=1, script build:prod): qualquer pendência derruba o build.
export const STRICT = process.env.STRICT_TODO === '1';

/** Verdadeiro quando o valor ainda é um placeholder TODO_*. */
export function isPendente(valor: unknown): valor is string {
  return typeof valor === 'string' && /TODO_[A-Z0-9_]+/.test(valor);
}

const vistos = new Set<string>();

/** Registra uma pendência: lança no modo estrito, avisa uma única vez no modo normal. */
export function reportar(id: string): void {
  if (STRICT) throw new Error(`Pendência ${id} não resolvida (build estrito).`);
  if (!vistos.has(id)) {
    vistos.add(id);
    console.warn(`[pendente] ${id}`);
  }
}
