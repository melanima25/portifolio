import { test, expect } from '@playwright/test';

const SECOES = ['inicio', 'projetos', 'estudo-de-caso', 'stack', 'sobre', 'contato'];

test('seções presentes, landmarks e uma h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  for (const id of SECOES) await expect(page.locator(`section#${id}`)).toHaveCount(1);
  await expect(page.locator('main#conteudo')).toHaveCount(1);
  await expect(page.locator('header').first()).toBeVisible();
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
});

test('links externos têm rel noopener', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('a[target="_blank"]').evaluateAll((as) =>
    as.map((a) => ({ href: (a as HTMLAnchorElement).href, rel: a.getAttribute('rel') ?? '' })),
  );
  expect(links.length).toBeGreaterThan(0);
  for (const l of links) expect(l.rel, l.href).toContain('noopener');
});

test('toggle de tema alterna e persiste após reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const html = page.locator('html');
  const btn = page.getByRole('button', { name: /Ativar tema/ });
  await expect(btn).toBeVisible();
  await page.waitForTimeout(500); // hidratação client:idle
  const antes = await html.getAttribute('data-theme');
  await btn.click();
  const depois = await html.getAttribute('data-theme');
  expect(depois).not.toBe(antes);
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', depois!);
});

test('skip link fica visível no foco e leva ao conteúdo', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.locator('a[href="#conteudo"]').first();
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#conteudo$/);
});

test('sem erros de console nem requisições falhas', async ({ page }) => {
  const erros: string[] = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('pageerror', (e) => erros.push(String(e)));
  page.on('response', (r) => r.status() >= 400 && erros.push(`${r.status()} ${r.url()}`));
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(erros).toEqual([]);
});

test('sem rolagem horizontal em 375px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const { sw, cw } = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  expect(sw).toBeLessThanOrEqual(cw);
});

test('404 responde com página própria', async ({ page }) => {
  const r = await page.goto('/nao-existe');
  expect(r?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveCount(1);
});
