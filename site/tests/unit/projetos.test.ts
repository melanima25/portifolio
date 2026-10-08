import { describe, it, expect, vi } from 'vitest';
vi.mock('astro:content', () => ({ getCollection: vi.fn() }));
import { ordenar, selecionarDestaque, isEmBreve } from '../../src/lib/projetos';

const p = (ordem: number, destaque = false, status = 'producao') => ({ data: { ordem, destaque, status } });

describe('projetos', () => {
  it('ordena por ordem sem mutar a lista original', () => {
    const l = [p(3), p(1), p(2)];
    expect(ordenar(l).map((x) => x.data.ordem)).toEqual([1, 2, 3]);
    expect(l.map((x) => x.data.ordem)).toEqual([3, 1, 2]);
  });
  it('seleciona o único destaque', () => {
    expect(selecionarDestaque([p(1), p(2, true)]).data.ordem).toBe(2);
  });
  it('falha com zero ou mais de um destaque', () => {
    expect(() => selecionarDestaque([p(1)])).toThrow();
    expect(() => selecionarDestaque([p(1, true), p(2, true)])).toThrow();
  });
  it('isEmBreve', () => {
    expect(isEmBreve(p(1, false, 'em-breve'))).toBe(true);
    expect(isEmBreve(p(1))).toBe(false);
  });
});
