# Décisions techniques

## 2026-09-27 — Socle

### Point de départ

- La branche retire tous les fichiers de l'ancien projet. Rien n'en est repris ; son historique reste
  sur `main`.
- `CLAUDE.md` est le brief produit fourni, tel quel. `AGENTS.md` porte le bloc géré par Next.js : sans
  lui, `next dev` injecterait ce bloc dans `CLAUDE.md`.

### Versions

- Next.js 16.3.6 (dernière stable), avec les versions de son gabarit officiel : React 19.2.8,
  TypeScript 5.9, ESLint 9.
- TypeScript 7 n'est pas utilisé : typescript-eslint n'accepte pas encore TypeScript au-delà de 6.0.
  ESLint 10 non plus : les plugins de `eslint-config-next` ne le déclarent pas encore.
- pnpm 10 (déjà installé, pris en charge partout). Vitest 5, qui demande Node.js 22.12 ou plus.

### Design

- `docs-internes/charte.md` n'existe pas encore. Le thème Tailwind est donc remis à zéro
  (`@theme { --*: initial; }`) : aucune couleur, taille, aucun espacement ni rayon n'est utilisable.
  Aucune police n'est chargée : l'écran provisoire est noir sur blanc, en police système.
- shadcn/ui est initialisé à la main : `ui.shadcn.com` est bloqué par la politique réseau de
  l'environnement de travail. `components.json` reprend le préréglage par défaut du CLI 4.21
  (`base-nova`) et `src/lib/utils.ts` le helper `cn`. Les variables CSS que `shadcn init` écrit (couleurs,
  rayon) sont volontairement absentes : elles seront tirées de la charte.
- Pas de favicon tant que la charte ne fournit pas la marque.

### Base de données

- Toutes les dates sont en `timestamptz`, y compris dans les tables Better Auth : la vérification de
  schéma de Better Auth 1.7 l'accepte.
- Tables Better Auth identiques à la sortie de `auth generate` (lien magique, adaptateur Drizzle
  Postgres), identifiants `text`. Tables PULSACITY en `uuid` générés par Postgres.
- `connections.connector` est un `text` : la liste des connecteurs est ouverte, et le registre la
  contrôle. Les listes fermées (plan, statuts, sources, type de widget) sont des enums Postgres.
- Contraintes ajoutées à celles de CLAUDE.md, chacune parce que le produit en dépend :
  - `products` unique par (espace, slug) : c'est le segment de `/t/[spaceSlug]/[productSlug]` ;
  - `product_refs` unique par (connexion, référence externe) : une offre reçue désigne une seule offre ;
  - `review_requests.purchase_id` unique : une demande par achat, soit un envoi et une relance ;
  - `spaces` : `referral_code`, `stripe_customer_id` et `stripe_subscription_id` uniques ;
  - `customers.email` en minuscules : une personne reste un seul client, jamais plus de deux envois ;
  - `testimonials.rating` entre 1 et 5, et consentement daté obligatoire pour la source `form`.
- Valeurs par défaut : plan `free`, délai 14 jours, demandes activées, statuts `pending` / `scheduled`.
- Suppressions : supprimer un utilisateur, un espace, une offre ou un client supprime ce qui en dépend.
  Supprimer une connexion garde les achats (`connection_id` passe à `null`). Supprimer une offre
  détache ses témoignages sans les supprimer.
- Choix à confirmer : `spaces.reply_to_email`, `testimonials.rating` et `testimonials.body` sont
  obligatoires. `purchases.event_type` et `purchases.external_ref` restent facultatifs et sans unicité :
  leur sens sera fixé par les payloads réels.
- La migration `0000_init` s'applique deux fois de suite sans erreur à travers pgbouncer en mode
  transaction (sans requêtes préparées), sur Postgres 16. drizzle-kit n'envoie que des requêtes non
  préparées. Elle n'a pas été appliquée sur Supabase.

### Connecteurs

- Le contrat `Connector` passe à `verify` les réglages de la connexion (`verify(request, config)`) : un
  secret de signature propre à chaque compte y vit.
- Le registre est vide : aucun payload Systeme.io n'a encore été versé.

### Widget

- Point d'ancrage : `<div data-pulsacity-widget="…">`. Racine Shadow DOM ouverte, rendue une seule fois.
- Le build échoue au-delà de 30 Ko gzip ou sur tout import de paquet. Cible : les navigateurs pris en
  charge par Next.js 16. `public/w.js` est un produit du build, non commité.

### Sentry

- `@sentry/nextjs` 11. Sans `SENTRY_DSN`, le SDK reste éteint et le build passe.
- Le DSN, public par nature, atteint le navigateur par `env` dans `next.config.ts`.
- Pas de traces de performance, pas de données personnelles envoyées, télémétrie du plugin de build
  coupée.
- L'envoi des source maps demande un jeton Sentry (`SENTRY_AUTH_TOKEN`, avec `SENTRY_ORG` et
  `SENTRY_PROJECT`). Ces variables ne figurent pas dans la liste de CLAUDE.md : elles ne sont pas
  ajoutées.
