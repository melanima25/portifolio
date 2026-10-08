import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('isPendente', () => {
  it('detecta placeholders TODO_*', async () => {
    const { isPendente } = await import('../../src/lib/pendente');
    expect(isPendente('TODO_URL_DEMO')).toBe(true);
    expect(isPendente('veja TODO_X1 aqui')).toBe(true);
    expect(isPendente('todo_url')).toBe(false);
    expect(isPendente('TODO_')).toBe(false);
    expect(isPendente(42)).toBe(false);
    expect(isPendente(undefined)).toBe(false);
  });
});

describe('reportar', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });
  it('modo normal: avisa uma única vez por id', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { reportar } = await import('../../src/lib/pendente');
    reportar('TODO_A');
    reportar('TODO_A');
    reportar('TODO_B');
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });
  it('modo estrito: lança erro', async () => {
    vi.stubEnv('STRICT_TODO', '1');
    const { reportar } = await import('../../src/lib/pendente');
    expect(() => reportar('TODO_A')).toThrow(/TODO_A/);
  });
});
