# PULSACITY

Vos ventes deviennent des témoignages, automatiquement.

`CLAUDE.md` est la source de vérité du produit et de ses règles. Les décisions techniques du socle sont
consignées dans `docs-internes/decisions.md`.

## Prérequis

- Node.js 22.12 ou plus récent.
- pnpm 10 : la version est fixée dans `package.json` (`packageManager`), `corepack enable` suffit.

## Démarrer

```bash
pnpm install
cp .env.example .env.local   # puis remplissez les valeurs utiles
pnpm dev                     # http://localhost:3000
```

## Commandes

| Commande            | Effet                                                                 |
| ------------------- | --------------------------------------------------------------------- |
| `pnpm dev`          | Serveur de développement                                              |
| `pnpm build`        | Build du widget, puis build de production Next.js                     |
| `pnpm build:widget` | Compile `widget/src/index.ts` vers `public/w.js` (IIFE minifiée)      |
| `pnpm lint`         | ESLint                                                                |
| `pnpm typecheck`    | TypeScript strict                                                     |
| `pnpm test`         | Tests Vitest                                                          |
| `pnpm db:generate`  | Génère une migration depuis `src/db/schema.ts`                        |
| `pnpm db:migrate`   | Applique les migrations de `src/db/migrations/` sur `DATABASE_URL`    |

## Base de données

`DATABASE_URL` est la chaîne du pooler Supabase en mode transaction (port 6543). Le client de
l'application utilise postgres-js avec `prepare: false`. `pnpm db:migrate` lit `.env.local` et passe par
ce même pooler.

## Widget

`pnpm build:widget`, puis ouvrez `widget/test.html` dans un navigateur : la page hôte de test affiche
« PULSACITY widget OK » dans un Shadow DOM. Le build échoue si le script dépasse 30 Ko gzip ou importe
un paquet.
