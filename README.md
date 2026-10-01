# PULSACITY

Vos ventes deviennent des témoignages, automatiquement.

## Installer et lancer en local

Il faut Node.js 22.12 ou plus récent, pnpm 10 (`corepack enable` suffit : la version est fixée dans
`package.json`) et Docker Desktop pour la base.

```bash
pnpm install
docker compose up -d          # Postgres 16 sur le port 54322
cp .env.example .env.local    # puis remplir les valeurs ci-dessous
pnpm db:migrate
pnpm db:seed vous@exemple.fr  # un espace de démonstration complet pour cette adresse
pnpm dev                      # http://localhost:3000
```

Valeurs de `.env.local` pour travailler en local :

```
DATABASE_URL=postgres://postgres@localhost:54322/pulsacity
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
EMAIL_FROM_DOMAIN=envois.pulsacity.com
LEGAL_VALIDATED=false
```

Sans `RESEND_API_KEY`, aucun e-mail ne part : leur texte s'affiche dans le terminal de `pnpm dev`.
Pour vous connecter, demandez un lien sur `/connexion` avec l'adresse passée à `pnpm db:seed`, puis
ouvrez le lien affiché dans le terminal. Les photos demandent un bucket R2 : sans les variables `R2_*`,
tout fonctionne sauf leur envoi.

`pnpm db:seed` remet l'espace de démonstration à zéro à chaque passage. Il refuse une base qui n'est
pas sur votre machine, sauf avec `--recette`. `--plan=essentiel` ou `--plan=pro` change le plan.

## Les trois environnements

| Environnement | Adresse | Base | Sert à |
| --- | --- | --- | --- |
| Local | http://localhost:3000 | Postgres de `compose.yaml` | Développer, essayer sans risque |
| Recette | l'aperçu Vercel de chaque PR | Supabase « pulsacity-recette » | Tester une PR avant de la fusionner |
| Production | https://pulsacity.com | Supabase « PULSACITY » | Les vrais créateurs |

Mise en ligne : branche, PR, CI verte, recette sur l'aperçu de la PR, fusion sur `main`. Vercel construit
alors la production pendant que le workflow « Database migration » applique les nouvelles migrations.
La nouvelle version ne passe en ligne qu'une fois « CI » et « Database migration » verts (Deployment
Checks de Vercel) : le code ne rencontre jamais une base sans ses colonnes.

Une migration doit rester compatible avec le code en place pendant le déploiement : on ajoute d'abord
(colonne facultative, nouvelle table), on retire seulement dans une PR suivante, une fois plus rien ne
l'utilise.

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
| `pnpm db:seed`      | Remplit un espace de démonstration (voir plus haut)                |

Pour voir le widget : `pnpm build:widget`, puis ouvrir `widget/test.html` dans un navigateur.

Migrations des bases Supabase, par GitHub Actions :

- « Database migration » applique les migrations de `main` sur la production, à chaque fusion. Sans
  nouvelle migration, il ne fait rien. Il lit le secret `DATABASE_URL`. On peut aussi le lancer à la main.
- « Recette database migration » applique celles d'une PR sur la base de recette, et celles de `main`
  ensuite. Il ne lit que le secret `RECETTE_DATABASE_URL`.
- « Recette demo space » remplit l'espace de démonstration d'une adresse, sur la base de recette.

## Variables d'environnement

La liste complète est dans `.env.example`. Celles qui demandent une précision :

- `DATABASE_URL` : chaîne du pooler Supabase en mode transaction (port 6543), de la forme
  `postgres://postgres.<ref-du-projet>:<mot-de-passe>@<hôte-du-pooler>:6543/postgres?sslmode=require`.
  Sans `?sslmode=require`, Supabase refuse la connexion.
- `BETTER_AUTH_SECRET` : au moins 32 caractères aléatoires, par exemple `openssl rand -base64 32`.
- `BETTER_AUTH_URL` et `NEXT_PUBLIC_APP_URL` : sur un aperçu Vercel, l'application prend l'adresse de
  la branche à leur place, pour que les liens de connexion et de collecte restent sur l'aperçu.
- `SENTRY_DSN` : facultatif. Vide, Sentry reste éteint. Il est aussi transmis au navigateur au build.
- `LEGAL_VALIDATED` : `false` tant que les textes légaux ne sont pas relus.
