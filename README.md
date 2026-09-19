# PULSACITY

Monorepo de PULSACITY. V0 : la page `pulsacity.com`, l'hôte de démonstration
`demo.pulsacity.com` et le paiement Stripe.

> Les règles de développement (UI en français, montants en centimes, prix unique,
> démos `noindex`…) sont dans [`CLAUDE.md`](./CLAUDE.md). Lisez-le avant de contribuer.

## Contenu

| Paquet               | Rôle                                                            |
| -------------------- | --------------------------------------------------------------- |
| `apps/corporate`     | Next.js 15 (App Router) : page corporate, hôte démo, API Stripe |
| `packages/db`        | Schéma Drizzle et requêtes (Supabase Postgres)                  |
| `packages/templates` | Contrat `SiteContent` (zod) et gabarit générique `renderSite`   |

`factory`, `radar`, `crm`, `content-prompts`, `sms` et `billing` arrivent en S2.

## Démarrer

```bash
nvm use            # Node 22 (.nvmrc)
pnpm install
cp .env.example .env.local   # puis remplissez les valeurs
pnpm db:migrate    # nécessite DATABASE_URL
pnpm db:seed       # fixture de développement (refusée en production)
pnpm dev
```

Le routage dépend du nom d'hôte. En développement, ouvrez :

- <http://pulsacity.localhost:3000> — la page corporate ;
- <http://demo.localhost:3000/garage-exemple-fixture> — la démo de la fixture.

et réglez dans `.env.local` :

```dotenv
NEXT_PUBLIC_CORPORATE_HOST=pulsacity.localhost:3000
NEXT_PUBLIC_DEMO_HOST=demo.localhost:3000
```

Les navigateurs récents résolvent `*.localhost` sans toucher à `/etc/hosts`.

## Matrice de routage

| Hôte                        | Cible                                             |
| --------------------------- | ------------------------------------------------- |
| `pulsacity.com`             | page corporate                                    |
| `www.pulsacity.com`         | 308 vers l'apex, même chemin                      |
| `pulsacity.fr`, `www.*.fr`  | 301 vers `https://pulsacity.com`, même chemin     |
| `demo.pulsacity.com/<slug>` | démo (réécriture interne, toujours `noindex`)     |
| `*.vercel.app`              | page corporate (déploiements de prévisualisation) |
| tout autre hôte             | recherche dans `domains` → 404 sobre en V0        |

La matrice est une fonction pure (`src/lib/host-routing.ts`) couverte par des tests.

## Commandes

```bash
pnpm lint          # ESLint + Prettier
pnpm typecheck     # TypeScript strict
pnpm test          # Vitest (unitaires)
pnpm build         # build de production
pnpm test:e2e      # Playwright (construit puis démarre l'application)
```

`pnpm lint && pnpm typecheck && pnpm test` doit passer avant tout commit.

Les tests Playwright ont besoin d'un navigateur :

```bash
pnpm --filter @pulsacity/corporate exec playwright install chromium
```

Sur une image qui fournit déjà Chromium, indiquez son chemin plutôt que de le
télécharger : `CHROMIUM_EXECUTABLE_PATH=/chemin/vers/chrome pnpm test:e2e`.

## Base de données

Connexion par le pooler Supabase en mode _transaction_ (`prepare: false`). Les
migrations utilisent la connexion directe (`DIRECT_DATABASE_URL`, port 5432).

```bash
pnpm db:generate   # génère une migration depuis le schéma
pnpm db:migrate    # applique les migrations
pnpm db:seed       # fixture « Garage Exemple (fixture) »
```

La migration `0001_search_indexes.sql` installe `pg_trgm` et `unaccent`, crée le
wrapper immuable `pulsacity_unaccent()` et l'index GIN trigramme sur `sites.name` :
c'est ce qui fait fonctionner « Votre site est peut-être déjà prêt ».

## Sites livrés

`apps/corporate/content/showcase.json` liste les sites réellement livrés
(`name`, `sector`, `city`, `url`), trois au maximum. La section disparaît si le
fichier est vide ; aucune carte fictive n'est jamais affichée.

```bash
pnpm showcase:shots   # captures desktop + mobile en WebP dans public/showcase/
```

## Déploiement (Vercel)

- **Root Directory** : `apps/corporate`. Vercel détecte le workspace pnpm et installe
  les dépendances à la racine du dépôt.
- **Domaines** : `pulsacity.com` (apex), `www.pulsacity.com`, `demo.pulsacity.com`,
  puis `pulsacity.fr` et `www.pulsacity.fr`.
- Les redirections d'hôtes sont gérées par le middleware, pas par la configuration
  Vercel : elles sont ainsi testées avec le reste du code.
