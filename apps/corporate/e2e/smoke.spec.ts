import { expect, test, type Page } from '@playwright/test';

const CORPORATE_ORIGIN = 'http://pulsacity.localhost:3100';
const DEMO_ORIGIN = 'http://demo.localhost:3100';

/** `.env.example` ships the bare `sk_test_` prefix, which is not a usable key. */
const stripeConfigured = Boolean(
  process.env.STRIPE_SECRET_KEY &&
  !['sk_test_', 'sk_live_'].includes(process.env.STRIPE_SECRET_KEY),
);

/** Navigates and returns the response, failing loudly when there is none. */
async function goto(page: Page, url: string) {
  const response = await page.goto(url);
  expect(response, `aucune réponse pour ${url}`).not.toBeNull();
  return response!;
}

test.describe('page pulsacity.com', () => {
  test('affiche la promesse, le prix et les sections attendues', async ({ page }) => {
    await goto(page, '/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Le site de votre entreprise, déjà prêt.',
    );
    await expect(page.locator('#inclus')).toContainText('Ce qui est inclus');
    await expect(page.locator('#methode')).toContainText('Comment ça marche');
    await expect(page.locator('#mon-site')).toContainText('Votre site est peut-être déjà prêt');
    await expect(page.locator('#prix')).toContainText('500');
    await expect(page.locator('#faq')).toContainText('Questions fréquentes');
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('ne propose ni option ni remise', async ({ page }) => {
    await goto(page, '/');
    await expect(page.locator('#prix')).toContainText("pas d'option, pas de remise");
  });

  test('donne accès aux pages légales, sans texte non remplacé', async ({ page }) => {
    await goto(page, '/');
    await page.getByRole('link', { name: 'Mentions légales' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mentions légales');
    // CLAUDE.md rule 9: nothing unreplaced ever reaches a visitor.
    await expect(page.locator('body')).not.toContainText('{{');
  });

  test('le formulaire de recherche répond', async ({ page }) => {
    await goto(page, '/#mon-site');
    await page.getByLabel('Nom de votre entreprise').fill('Entreprise Introuvable Xyz');
    await page.getByRole('button', { name: 'Voir si mon site est déjà prêt' }).click();
    // Either the request form opens, or the search reports itself unavailable.
    // Both are correct; a blank screen is not.
    await expect(
      page.locator('text=/pas encore préparé|momentanément indisponible/').first(),
    ).toBeVisible();
  });

  test('est indexable et publie son sitemap', async ({ page }) => {
    const robots = await goto(page, `${CORPORATE_ORIGIN}/robots.txt`);
    expect(await robots.text()).toContain('Allow: /');

    const sitemap = await goto(page, `${CORPORATE_ORIGIN}/sitemap.xml`);
    expect(await sitemap.text()).toContain('pulsacity');
  });
});

test.describe('hôte de démonstration', () => {
  test('est interdit à l’indexation', async ({ page }) => {
    const response = await goto(page, `${DEMO_ORIGIN}/`);
    expect(response.headers()['x-robots-tag']).toContain('noindex');

    const robots = await goto(page, `${DEMO_ORIGIN}/robots.txt`);
    expect(await robots.text()).toContain('Disallow: /');
  });

  test('n’expose pas de sitemap', async ({ page }) => {
    const response = await goto(page, `${DEMO_ORIGIN}/sitemap.xml`);
    expect(response.status()).toBe(404);
  });

  test('affiche « Cette démo n’est plus disponible » pour un slug inconnu', async ({ page }) => {
    await goto(page, `${DEMO_ORIGIN}/slug-qui-n-existe-pas`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      "Cette démo n'est plus disponible",
    );
  });
});

test.describe('routage par hôte', () => {
  test('www redirige vers l’apex en 308', async ({ page }) => {
    const response = await goto(page, `http://www.pulsacity.localhost:3100/cgv`);
    expect(page.url()).toBe(`${CORPORATE_ORIGIN}/cgv`);

    const redirect = response.request().redirectedFrom();
    expect(redirect).not.toBeNull();
    expect((await redirect!.response())!.status()).toBe(308);
  });

  test('un hôte inconnu reçoit un 404 sobre', async ({ page }) => {
    const response = await goto(page, 'http://garage-inconnu.localhost:3100/');
    expect(response.status()).toBe(404);
  });

  test('les routes internes ne sont pas joignables depuis le site', async ({ page }) => {
    const response = await goto(page, `${CORPORATE_ORIGIN}/_hosts/demo/quelque-chose`);
    expect(response.status()).toBe(404);
  });
});

test.describe('paiement', () => {
  test.skip(!stripeConfigured, 'STRIPE_SECRET_KEY absente : test ignoré.');

  test('le bouton « Commander » mène à checkout.stripe.com', async ({ page }) => {
    await goto(page, '/#prix');
    await page
      .locator('#prix')
      .getByRole('button', { name: /Commander/ })
      .click();
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 });
    expect(page.url()).toContain('checkout.stripe.com');
  });
});
