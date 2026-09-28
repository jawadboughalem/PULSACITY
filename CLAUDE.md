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

Ce dépôt est neuf. L'ancien projet PULSACITY a été abandonné et supprimé (seuls le nom et le domaine sont gardés) : il est ignoré. Aucun code, schéma, variable ou configuration n'en est repris. Claude Code ne modifie jamais les services externes (Vercel, Supabase, DNS, Stripe) : le fondateur s'en charge, jamais sans aide (voir « Actions du fondateur »).

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
docs-internes/                # décisions, payloads, recette
```

## Modèle de données

- Tables Better Auth : `user`, `session`, `account`, `verification`
- `spaces` : id, userId, name, slug (unique), logoUrl, accentColor, replyToEmail, plan (free|essentiel|pro), stripeCustomerId, stripeSubscriptionId, referralCode, createdAt
- `connections` : id, spaceId, connector (systeme|stripe|calendly|…), webhookToken (unique, secret, régénérable), status (pending|active|error), lastEventAt, config (jsonb), createdAt
- `products` (les « offres » : formation, accompagnement, séance…) : id, spaceId, name, slug, requestDelayDays (défaut 14), requestsEnabled (bool), createdAt
- `product_refs` : id, productId, connectionId, externalRef — relie une offre à son identifiant dans chaque connecteur
- `customers` : id, spaceId, email, firstName, lastName, unsubscribedAt, createdAt (unique spaceId + email)
- `purchases` : id, spaceId, customerId, productId, connectionId (nullable), source (connector|manual|csv), eventType, externalRef, purchasedAt
- `review_requests` : id, purchaseId, token (unique), scheduledAt, sentAt, reminderScheduledAt, reminderSentAt, completedAt, status (scheduled|sent|reminded|completed|cancelled|failed)
- `testimonials` : id, spaceId, productId (nullable), customerId (nullable), authorName, authorTitle, authorPhotoUrl, rating (1–5), body, status (pending|approved|hidden), source (form|manual|csv), consentAt, consentText, featured (bool), createdAt
- `widgets` : id, spaceId, type (wall|carousel|badge), productId (nullable = tous), settings (jsonb : thème, couleur, nombre max, afficher note/photo), createdAt
- `webhook_events` : id, connectionId, rawPayload (jsonb), headers (jsonb), eventType, receivedAt, processedAt, error — journal complet, rejouable
- `stripe_events` : id, type, processedAt

## Plans (`src/config/plans.ts`)

| Plan | Prix | Témoignages | Demandes auto / mois | Widgets | Badge |
| --- | --- | --- | --- | --- | --- |
| free | 0 € | 15 | 20 | 1 | obligatoire |
| essentiel | 9 €/mois, 90 €/an | illimité | illimité | illimité | obligatoire |
| pro | 19 €/mois, 190 €/an | illimité | illimité | illimité | retirable |

Dépasser une limite ne supprime jamais de données : on bloque l'ajout et on propose de passer au plan supérieur.

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

Rien de ce que le fondateur fait de son côté ne se fait sans l'aide de Claude Code. Chaque action sur un service externe (Vercel, Supabase, Cloudflare, Resend, Stripe, DNS, réglages GitHub…) lui est livrée en prompt Claude in Chrome prêt à coller :
- un prompt par service, numéroté dans l'ordre où les lancer ;
- les valeurs exactes à saisir, et ce qu'il ne faut surtout pas toucher ;
- la vérification qui prouve que c'est fait ;
- un compte rendu à renvoyer à Claude Code, sans aucun secret.

Un secret créé sur un service est collé directement là où il sert (variable Vercel, secret GitHub), jamais dans une conversation. La recette de chaque lot se prépare de la même façon : où tester, quoi tester, dans quel ordre.

## Définition de « fini »

`pnpm build`, `pnpm lint`, `pnpm test` passent ; la checklist du prompt est cochée ; vérifié à 360 px et en desktop ; commit fait ; les actions du fondateur et la recette du lot sont livrées en prompts Claude in Chrome.
