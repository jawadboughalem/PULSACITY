# PULSACITY

Vos ventes deviennent des témoignages, automatiquement.

## Installer et lancer

Node.js 22.12 ou plus récent, et pnpm 10 (`corepack enable` suffit : la version est fixée dans
`package.json`).

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Commandes

| Commande            | Effet                                                              |
| ------------------- | ------------------------------------------------------------------ |
| `pnpm dev`          | Serveur de développement, http://localhost:3000                    |
| `pnpm build`        | Build du widget, puis build de production                          |
| `pnpm build:widget` | Compile le widget vers `public/w.js`                               |
| `pnpm lint`         | ESLint                                                             |
| `pnpm typecheck`    | TypeScript strict                                                  |
| `pnpm test`         | Tests Vitest                                                       |
| `pnpm db:generate`  | Génère une migration depuis `src/db/schema.ts`                     |
| `pnpm db:migrate`   | Applique les migrations sur `DATABASE_URL` (lit `.env.local`)      |

Pour voir le widget : `pnpm build:widget`, puis ouvrir `widget/test.html` dans un navigateur.

## Variables d'environnement

La liste complète est dans `.env.example`. Celles qui demandent une précision :

- `DATABASE_URL` : chaîne du pooler Supabase en mode transaction (port 6543), de la forme
  `postgres://postgres.<ref-du-projet>:<mot-de-passe>@<hôte-du-pooler>:6543/postgres`.
- `BETTER_AUTH_SECRET` : au moins 32 caractères aléatoires, par exemple `openssl rand -base64 32`.
- `SENTRY_DSN` : facultatif. Vide, Sentry reste éteint. Il est aussi transmis au navigateur au build.
- `LEGAL_VALIDATED` : `false` tant que les textes légaux ne sont pas relus.
