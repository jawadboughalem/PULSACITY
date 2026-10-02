# PULSACITY — CLAUDE.md

## Le produit

PULSACITY transforme automatiquement les ventes des indépendants francophones (coachs, formateurs, consultants, créateurs) en témoignages affichés sur leurs pages de vente.

Promesse : « Vos ventes deviennent des témoignages, automatiquement. »

Architecture produit : un moteur universel (collecte, gestion, widgets) + des **connecteurs** vers les outils où les indépendants encaissent. Connecteur n°1 au lancement : Systeme.io. Puis Stripe et Calendly/Cal.com (V1), Learnybox, Podia, Kajabi, Shopify, WooCommerce, Zapier/Make (V2). Systeme.io est la première porte d'entrée, jamais une dépendance du cœur du produit.

Parcours (avec le connecteur Systeme.io) :
1. Le créateur crée son espace et colle une URL de webhook PULSACITY dans Systeme.io.
2. À chaque vente ou inscription à une formation, PULSACITY reçoit le client.
3. Après un délai (14 jours par défaut, réglable par formation), le client reçoit un e-mail au nom du créateur qui lui demande son avis, avec une relance.
4. Le client laisse note, texte, photo sur une page mobile en moins de 60 secondes.
5. Le créateur valide ; le témoignage s'affiche sur sa page de vente via un widget collé une fois dans un bloc HTML Systeme.io.

## Point de départ

Ce dépôt est neuf. L'ancien projet PULSACITY a été abandonné et supprimé (seuls le nom et le domaine sont gardés) : il est ignoré. Aucun code, schéma, variable ou configuration n'en est repris. Claude Code ne modifie jamais un service externe (Vercel, Supabase, DNS, Stripe) avec ses propres accès : il agit dans le navigateur du fondateur, ou lui donne un prompt (voir « Actions du fondateur »).

## Règles absolues

1. Chaque connecteur implémente le même contrat `Connector` (`src/lib/connectors/types.ts`) : `verify(request, config)`, `normalize(payload, headers) → NormalizedPurchase | null` (email, prénom, nom, référence et nom de l'offre, date). Le cœur du produit ne connaît que `NormalizedPurchase`, jamais un format propre à une plateforme. Aucun connecteur n'est codé avant que ses payloads réels aient été capturés dans `docs-internes/connectors/<nom>.md` et transformés en fixtures de test.
2. Le widget est un produit à part entière : un seul script, < 30 Ko gzip, zéro dépendance, aucun impact sur la mise en page de la page hôte, polices et couleurs héritées de la page hôte par défaut.
3. Le badge « Propulsé par PULSACITY » est visible sur les plans Gratuit et Essentiel. Il n'est retirable que sur le plan Pro. Il pointe vers pulsacity.com avec un paramètre de parrainage de l'espace.
4. Les e-mails envoyés aux clients du créateur : nom d'expéditeur = nom de l'espace du créateur, adresse technique PULSACITY, réponse vers l'e-mail du créateur, lien de désinscription dans chaque e-mail, jamais plus de 2 envois par client et par formation.
5. PULSACITY est sous-traitant RGPD des données clients du créateur. Consentement explicite et horodaté à la publication sur chaque formulaire. Export et suppression faciles.
6. Les limites de plan sont définies en un seul endroit : `src/config/plans.ts`. Jamais de limite codée ailleurs.
7. Français partout, vouvoiement. Code en anglais.
8. Aucune nouvelle dépendance sans nécessité claire.

## Stack

- Next.js (App Router, dernière version stable), TypeScript strict, Server Actions
- Tailwind CSS + shadcn/ui pour l'application
- Widget : TypeScript compilé en un fichier unique (esbuild), Shadow DOM, sans framework
- Postgres sur un projet Supabase neuf (région eu-central-1, Francfort), utilisé uniquement comme base (pas d'auth ni de client Supabase) + Drizzle ORM + drizzle-kit. Connexion serverless via le pooler en mode transaction, driver postgres-js avec `prepare: false`
- Better Auth, lien magique par e-mail
- Resend + React Email
- Stripe Billing (abonnements PULSACITY uniquement) + Checkout + portail client
- Cloudflare R2 pour les photos (V1 : vidéos)
- Vercel (région fra1, Francfort : les fonctions suivent la région de la base), Vercel Cron pour l'envoi des demandes planifiées
- Zod, Vitest, Sentry

## Structure

```
src/app/(marketing)/          # /, /integrations, /integrations/[connector], /tarifs, /guides/[slug], légal
src/app/(auth)/               # /inscription, /connexion
src/app/app/                  # /app, /app/temoignages, /app/offres, /app/widgets, /app/connecteurs, /app/connecteurs/[connector], /app/demandes, /app/reglages, /app/facturation
src/app/t/[spaceSlug]/        # page publique de collecte (+ /t/[spaceSlug]/[productSlug])
src/app/api/connectors/[connector]/[token]/  # réception des webhooks de tous les connecteurs
src/app/api/widget/[widgetId]/# JSON public des témoignages d'un widget (cache CDN)
src/app/api/cron/requests/    # envoi des demandes planifiées
src/app/api/stripe/webhook/   # abonnements PULSACITY
src/app/api/unsubscribe/      # désinscription
widget/                       # source du widget embarquable, build → public/w.js
src/config/plans.ts           # plans et limites
src/db/schema.ts
src/lib/connectors/           # types.ts (contrat), registry.ts, systeme/, (V1) stripe/, calendly/
src/lib/requests/             # planification et envoi des demandes
src/emails/                   # templates React Email
docs-internes/                # décisions, payloads, recette ; etat.md : où en est le projet
scripts/seed-demo.mjs         # espace de démonstration (local, recette)
compose.yaml                  # Postgres local
```

## Modèle de données

- Tables Better Auth : `user`, `session`, `account`, `verification`
- `spaces` : id, userId, name, slug (unique), logoUrl, accentColor, replyToEmail, plan (free|essentiel|pro), stripeCustomerId, stripeSubscriptionId, referralCode, collectionLinkSharedAt, firstDayCelebratedAt, firstApprovalCelebratedAt (moments de marque déjà joués), createdAt
- `connections` : id, spaceId, connector (systeme|stripe|calendly|…), webhookToken (unique, secret, régénérable), status (pending|active|error), lastEventAt, config (jsonb), createdAt
- `products` (les « offres » : formation, accompagnement, séance…) : id, spaceId, name, slug, requestDelayDays (défaut 14), requestsEnabled (bool), createdAt
- `product_refs` : id, productId, connectionId, externalRef — relie une offre à son identifiant dans chaque connecteur
- `customers` : id, spaceId, email, firstName, lastName, unsubscribedAt, createdAt (unique spaceId + email)
- `purchases` : id, spaceId, customerId, productId, connectionId (nullable), source (connector|manual|csv), eventType, externalRef, purchasedAt
- `review_requests` : id, purchaseId, token (unique), scheduledAt, sentAt, reminderScheduledAt, reminderSentAt, completedAt, status (scheduled|sent|reminded|completed|cancelled|failed)
- `testimonials` : id, spaceId, productId (nullable), customerId (nullable), authorName, authorTitle, authorPhotoUrl, rating (1–5), body (original, jamais modifié), displayBody (texte affiché, null = original), displayEditedAt, status (pending|approved|hidden), source (form|manual|csv), consentAt, consentText, featured (bool), createdAt
- `widgets` : id, spaceId, name (nullable, pour le créateur seul), type (wall|carousel|badge), productId (nullable = tous), settings (jsonb : thème, couleur d'accent, nombre max, afficher photo/note/date, masquer « Propulsé par » (Pro), style des cartes), firstLoadedAt (premier affichage sur une page), createdAt
- `webhook_events` : id, connectionId, rawPayload (jsonb), headers (jsonb), eventType, receivedAt, processedAt, error — journal complet, rejouable
- `stripe_events` : id, type, processedAt

## Plans (`src/config/plans.ts`)

| Plan | Prix | Témoignages | Demandes auto / mois | Widgets | Badge |
| --- | --- | --- | --- | --- | --- |
| free | 0 € | 15 | 20 | 1 | obligatoire |
| essentiel | 9 €/mois, 90 €/an | illimité | illimité | illimité | obligatoire |
| pro | 19 €/mois, 190 €/an | illimité | illimité | illimité | retirable |

Dépasser une limite ne supprime jamais de données : on bloque l'ajout et on propose de passer au plan supérieur. La limite de témoignages compte les témoignages validés : au-delà, les nouveaux arrivent et restent en attente.

## Design system (application et site)

**La charte graphique et les maquettes sont définies en Phase 1, AVANT tout code d'interface.** Sources uniques :
- `docs-internes/charte.md` : valeurs exactes des couleurs, polices, tailles, espacements, rayons, ombres, ton de voix.
- `docs-internes/maquettes/` : un export par écran (collecte mobile, widget ×3, e-mail de demande, tableau de bord, connexion Systeme.io, éditeur de widget, accueil, tarifs).

Règles :
- N'invente jamais une couleur, une police ou un espacement : si une valeur manque dans charte.md, arrête-toi et demande-la.
- Chaque écran reproduit sa maquette. Un écran sans maquette n'est pas construit : demande la maquette.
- Tant que charte.md n'existe pas, seuls des écrans techniques neutres (noir sur blanc, police système) sont autorisés, et uniquement pour tester la logique.

Interdits permanents (signatures de sites générés) : étiquettes en majuscules espacées au-dessus des titres ; un mot du titre en couleur ou italique ; flèches « → » dans les boutons ; grilles de cartes identiques avec la même ombre ; dégradés décoratifs ; animations d'apparition sur chaque section ; numérotation 01/02/03 hors vraie séquence.

## Design du widget

- Rendu dans un Shadow DOM : aucun style de la page hôte ne le casse, aucun style du widget ne fuit.
- `font-family: inherit` récupérée depuis l'élément hôte ; couleur d'accent configurable ; thème clair/sombre/auto ; rendu conforme à la maquette 2 (`docs-internes/maquettes/`).
- Mur : colonnes en maçonnerie responsive. Carrousel : défilement au doigt, flèches accessibles. Badge : « 4,9/5 · 87 avis » + 3 avatars.
- Chargement asynchrone, espace réservé pour éviter les sauts de mise en page, images en lazy-load.
- Badge « Propulsé par PULSACITY » discret mais lisible.

## Règles de rédaction

Phrases courtes, casse de phrase. Boutons exacts : « Créer mon espace », « Copier le code », « Valider », « Masquer », « Envoyer mon avis ». On parle de ventes, de formations, de pages de vente — jamais de « payload », « endpoint », « token » côté utilisateur. Erreurs : ce qui s'est passé + quoi faire. États vides : une phrase + l'action suivante.

## Variables d'environnement

```
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
RESEND_API_KEY
EMAIL_FROM_DOMAIN              # envois.pulsacity.com
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ESSENTIEL_MONTHLY
STRIPE_PRICE_ESSENTIEL_YEARLY
STRIPE_PRICE_PRO_MONTHLY
STRIPE_PRICE_PRO_YEARLY
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET
R2_PUBLIC_URL
CRON_SECRET
NEXT_PUBLIC_APP_URL            # https://pulsacity.com
SENTRY_DSN
LEGAL_VALIDATED                # false tant que les textes ne sont pas relus
```

## Conventions

- Composants serveur par défaut ; `"use client"` seulement pour l'interactivité.
- Mutations : Server Actions + Zod, retour `{ ok: true, data } | { ok: false, error }`.
- Toute action de l'espace vérifie la session ET l'appartenance de l'espace.
- Webhooks : on enregistre d'abord le payload brut dans `webhook_events`, on répond 200 vite, on traite ensuite. Un payload inconnu n'est jamais perdu.
- Envois d'e-mails idempotents : un `review_request` n'est envoyé qu'une fois (verrou sur `sentAt`).
- Tests Vitest obligatoires : normalisation de chaque connecteur (à partir des payloads réels), planification des demandes, calcul des limites de plan, rendu du widget (jsdom).

## Actions du fondateur

Rien de ce que le fondateur fait de son côté ne se fait sans l'aide de Claude Code. Chaque action sur un service externe (Vercel, Supabase, Cloudflare, Resend, Stripe, DNS, réglages GitHub…) est d'abord écrite en prompt Claude in Chrome dans `docs-internes/recette/` :
- un prompt par service, numéroté dans l'ordre où les lancer ;
- les valeurs exactes à saisir, et ce qu'il ne faut surtout pas toucher ;
- la vérification qui prouve que c'est fait ;
- un compte rendu à renvoyer à Claude Code, sans aucun secret.

Postes de travail : bureau sous Windows (deux écrans), maison sous Mac (un écran). Partout, le code se fait dans une session Claude Code dans le cloud (claude.ai/code, sur ce dépôt), et les actions dans le navigateur passent par l'extension Claude in Chrome, dans le groupe d'onglets « PULSACITY ». La session cloud n'atteint ni le navigateur du fondateur, ni une session sur son ordinateur.

Livraison des prompts : directement dans la conversation, un bloc par prompt, numérotés dans l'ordre, en disant où coller chacun (Claude in Chrome ou Claude Design). Le fondateur les colle un par un et renvoie chaque compte rendu. Une copie est gardée dans `docs-internes/recette/`. Une session locale `claude --chrome` peut aussi les lancer (PowerShell au bureau dans `$HOME\pulsacity` ; sur Mac, après `curl -fsSL https://claude.ai/install.sh | bash`, dans `~/pulsacity`), mais le fondateur préfère l'extension pour l'instant.

Claude Code ne demande au fondateur que ce qui doit passer par lui : fusionner une PR, se connecter à un service, copier et coller un secret, créer un compte de test.

Un secret créé sur un service est collé directement là où il sert (variable Vercel, secret GitHub), jamais dans une conversation : c'est le fondateur qui le copie et le colle, même quand Claude Code fait le reste. La recette de chaque lot se prépare de la même façon : où tester, quoi tester, dans quel ordre.

## Mode opératoire d'un lot

1. Le fondateur donne le lot dans la session cloud. Claude Code lit d'abord `docs-internes/etat.md`.
2. Claude Code développe sur sa branche et vérifie dans son conteneur : Postgres local, espace de démonstration, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, écrans à 360 px et en desktop dans Chromium, à côté de leur maquette.
3. Claude Code ouvre la PR et la suit jusqu'au vert (CI, GitGuardian). Vercel construit l'aperçu, branché sur la recette. « Recette database migration » y applique les migrations de la PR.
4. Recette sur l'aperçu, avec un compte rempli par « Recette demo space », par des prompts Claude in Chrome. Le conteneur de la session cloud n'atteint ni les aperçus ni pulsacity.com.
5. Fusion sur `main`. Vercel construit la production et la met en ligne une fois « CI » et « Database migration » verts.
6. Vérification sur pulsacity.com, puis mise à jour de `docs-internes/etat.md`.

## Environnements

Mise en ligne : branche, PR, CI verte, recette sur l'aperçu de la PR, fusion sur `main`.

Migrations : une PR n'ajoute que des colonnes facultatives ou des tables, compatibles avec le code déjà en ligne. Retirer ou renommer se fait dans une PR suivante, quand plus rien ne lit l'ancienne colonne. Si la base de recette s'écarte de `main` (migration d'une PR abandonnée), on la vide et on relance les deux workflows de recette.

Le dépôt GitHub est public, docs-internes compris : aucun secret, aucune donnée client réelle, aucun identifiant technique de compte (Account ID Cloudflare, référence de projet Supabase, adresse r2.dev, début de clé) n'y entre.

### Local

Postgres 16 dans Docker (`compose.yaml`, port 54322, sans mot de passe, ouvert à la seule machine), `.env.local`, `pnpm db:migrate`, puis `pnpm db:seed <e-mail>` pour un espace de démonstration complet. Sans `RESEND_API_KEY`, les e-mails s'affichent dans le terminal de `pnpm dev`. Voir le README. Le local sert d'abord à Claude Code, dans son conteneur : les postes du fondateur n'en ont pas besoin.

### Recette

En place depuis le 1er octobre 2026 (`docs-internes/recette/environnement-recette.md`). C'est l'aperçu Vercel de chaque PR, branché sur des services de recette, jamais sur la production :
- Supabase : projet `pulsacity-recette` (organisation PULSACITY, plan Free, eu-central-1). Son mot de passe lui est propre, jamais celui de la production, en lettres et chiffres seulement : un caractère spécial casse l'adresse de connexion (« URI malformed »).
- Cloudflare R2 : bucket `pulsacity-photos-recette` (Europe de l'Ouest), jeton `pulsacity-recette` limité à ce bucket, lecture publique par une adresse r2.dev. CORS : `PUT` depuis toutes les origines, car l'adresse des aperçus change.
- Resend : clé `pulsacity-recette`, envoi seul, sur envois.pulsacity.com.
- Vercel, environnement Preview uniquement : `DATABASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM_DOMAIN`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`, `LEGAL_VALIDATED`. Ni `BETTER_AUTH_URL` ni `NEXT_PUBLIC_APP_URL` : sur un aperçu, les adresses viennent de `VERCEL_BRANCH_URL`. Les aperçus sont protégés par Vercel Authentication (Standard Protection).
- GitHub : secret `RECETTE_DATABASE_URL`, lu seulement par « Recette database migration » (à chaque PR qui apporte une migration, puis sur `main`) et « Recette demo space » (espace « Julie Nutrition » pour une adresse).

### Production

- Vercel : équipe « jawadboughalems-projects », projet « pulsacity », production sur `main`. pulsacity.com sert la production ; www.pulsacity.com, pulsacity.fr et www.pulsacity.fr y redirigent en 301. Un déploiement de production ne passe en ligne qu'une fois verts, sur son commit, les deux Deployment Checks de Vercel : « Lint, typecheck, test, build » (workflow CI) et « Apply pending migrations » (workflow Database migration).
- GitHub : `main` est protégée par le ruleset « main » : PR obligatoire (0 approbation, le fondateur est seul), checks « Lint, typecheck, test, build » et « GitGuardian Security Checks » verts avant fusion, ni suppression ni force-push.
- DNS de pulsacity.com : chez OVH. Les e-mails du fondateur en @pulsacity.com passent par OVH (MX et SPF de la racine) : ne jamais les modifier. DMARC en `p=none`.
- Supabase : projet PULSACITY, eu-central-1. Migrations par le workflow GitHub « Database migration », lancé à chaque fusion sur `main`, avec le secret `DATABASE_URL` du dépôt.
- Resend : domaine envois.pulsacity.com vérifié, région eu-west-1.
- Cloudflare R2 : bucket `pulsacity-photos` (Europe de l'Ouest), jeton `pulsacity-production` limité à ce bucket, lecture publique par une adresse r2.dev. CORS : `PUT` depuis https://pulsacity.com seulement.
- Comptes de test : le fondateur les crée lui-même, ou par le workflow « Recette demo space » sur la recette. Un agent Claude in Chrome ne crée pas de compte sur un site en ligne.

Avant le lancement public :
- servir les photos depuis une adresse à nous (r2.dev est limité en débit) ;
- renseigner `SENTRY_DSN`, pour que les erreurs de production remontent ;
- effacer les données de test de la production.

## Définition de « fini »

`pnpm build`, `pnpm lint`, `pnpm test` passent ; la checklist du prompt est cochée ; vérifié à 360 px et en desktop ; commit fait ; les actions du fondateur et la recette du lot sont livrées en prompts Claude in Chrome.
