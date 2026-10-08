import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const tema of ['dark', 'light'] as const) {
  for (const [nome, width, height] of [['desktop', 1280, 800], ['mobile', 375, 800]] as const) {
    test(`axe sem violações: tema ${tema}, ${nome}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.addInitScript((t) => localStorage.setItem('theme', t), tema);
      await page.goto('/', { waitUntil: 'networkidle' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', tema);
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      const resumo = r.violations.map((v) => `${v.impact} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
      expect(resumo).toEqual([]);
    });
  }
}
