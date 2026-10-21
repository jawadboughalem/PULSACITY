# PULSACITY — CLAUDE.md

## Le produit

PULSACITY transforme automatiquement les ventes des indépendants francophones (coachs, formateurs, consultants, créateurs) en témoignages affichés sur leurs pages de vente.

Promesse : « Vos ventes deviennent des témoignages, automatiquement. »

Architecture produit : un moteur universel (collecte, gestion, widgets) + des **connecteurs** vers les outils où les indépendants encaissent. Connecteur n°1 au lancement : Systeme.io, puis le connecteur universel (lot 4.1 b) : une adresse propre à l'espace qui reçoit les ventes de n'importe quel outil, directement ou par Zapier, Make ou n8n, en JSON ou en formulaire (format et captures : `docs-internes/connectors/universel.md`). Catalogue décidé dans `docs-internes/decisions/connecteurs.md` : 19 outils affichés en 6 familles, « Bientôt » sans date. Vague 1 : Stripe, Calendly, et les guides Zapier, Make, n8n et Podia vers le connecteur universel ; vague 2 : Learnybox, Kajabi, SchoolMaker, Cal.com, WooCommerce ; vague 3 : PayPal, Livestorm, HelloAsso, Weezevent, Eventbrite ; plus tard : Shopify. Systeme.io est la première porte d'entrée, jamais une dépendance du cœur du produit.

Parcours (avec le connecteur Systeme.io) :
1. Le créateur crée son espace et colle une URL de webhook PULSACITY dans Systeme.io.
2. À chaque vente ou inscription à une formation, PULSACITY reçoit le client.
3. Après un délai (14 jours par défaut, réglable par formation), le client reçoit un e-mail au nom du créateur qui lui demande son avis, avec une relance.
4. Le client laisse note, texte, photo sur une page mobile en moins de 60 secondes.
5. Le créateur valide ; le témoignage s'affiche sur sa page de vente via un widget collé une fois dans un bloc HTML Systeme.io.

## Point de départ

Ce dépôt est neuf. L'ancien projet PULSACITY a été abandonné et supprimé (seuls le nom et le domaine sont gardés) : il est ignoré. Aucun code, schéma, variable ou configuration n'en est repris. Claude Code ne modifie jamais un service externe (Vercel, Supabase, DNS, Stripe) avec ses propres accès : il agit dans le navigateur du fondateur, ou lui donne un prompt (voir « Actions du fondateur »).

## Stratégie (12 octobre 2026)

- PULSACITY encaisse dès la V0 : le fondateur vend en tant que particulier, sans entreprise. Stripe Billing, la page « Abonnement et factures » et les CGV restent dans la V0.
- La micro-entreprise se crée au seuil de `docs-internes/fin-v0/seuil-micro-entreprise.md` : 5 clients payants, 3 mois de suite avec des paiements, ou 500 € encaissés, le premier atteint. Ce jour-là, les prompts 6.1 à 6.7 passent avant tout le reste.
- Textes légaux d'un vendeur particulier : son nom, son adresse et son téléphone viennent de variables Vercel, jamais du dépôt (lot 4.9). Une seule adresse : contact@pulsacity.com.
- Aucune TVA n'est facturée : les prix sont des prix finaux, jamais « TVA comprise ».
- Les décisions sont dans `docs-internes/decisions/` (connecteurs, tarifs, positionnement, commercialisation, textes légaux) ; `arbitrages.md` règle leurs contradictions et prime sur elles.

## Règles absolues

1. Chaque connecteur implémente le même contrat `Connector` (`src/lib/connectors/types.ts`) : `verify(request, config)`, `normalize(payload, headers, { receivedAt }) → NormalizedPurchase | null` (type d'événement, identifiant de la vente, e-mail, prénom, nom, référence, nom et prix du produit, date). Le cœur du produit ne connaît que `NormalizedPurchase`, jamais un format propre à une plateforme. Aucun connecteur n'est codé avant que ses payloads réels aient été capturés dans `docs-internes/connectors/<nom>.md` et transformés en fixtures de test.
2. Le widget est un produit à part entière : un seul script, < 30 Ko gzip, zéro dépendance, aucun impact sur la mise en page de la page hôte, polices et couleurs héritées de la page hôte par défaut.
3. Le badge « Propulsé par PULSACITY » est visible sur les plans Gratuit et Essentiel. Il n'est retirable que sur le plan Pro. Il pointe vers pulsacity.com avec un paramètre de parrainage de l'espace.
4. Les e-mails envoyés aux clients du créateur : nom d'expéditeur = nom de l'espace du créateur, adresse technique PULSACITY, réponse vers l'e-mail du créateur, lien de désinscription dans chaque e-mail, jamais plus de 2 demandes d'avis par client et par formation (la demande et sa relance). Hors demandes, seulement les e-mails que la loi attache à son avis : le motif d'un masquage (une fois par avis) et la demande d'accord d'une correction (deux au plus par avis). Rien à un client désinscrit.
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
- Vercel (région fra1, Francfort : les fonctions suivent la région de la base). Envoi des demandes planifiées : workflow GitHub « Send review requests » toutes les 15 min, Vercel Cron une fois par jour en filet (le plan Hobby n'en permet pas plus)
- Zod, Vitest, Sentry

## Structure

```
src/app/(marketing)/          # /, /integrations, /integrations/[connector], /tarifs, /guides, /guides/[slug], /aide (aide et « Écrivez-nous »), légal, /a-propos-des-avis, /espace-supprime
src/app/(auth)/               # /inscription, /connexion
src/app/app/                  # /app, /app/temoignages (image de partage : /app/temoignages/[id]/image), /app/offres, /app/widgets, /app/connecteurs, /app/connecteurs/[connector], /app/demandes, /app/reglages (l'espace), /app/compte (la personne, export /app/compte/export), /app/facturation, /app/parrainage
src/app/go/[slug]/            # liens courts /go/… : l'accueil, avec la source de la visite dans l'adresse
src/app/p/[slug]/             # lien de parrainage pulsacity.com/p/<adresse de l'espace>
src/app/t/[spaceSlug]/        # page publique de collecte (+ /t/[spaceSlug]/[productSlug]) ; le lien d'une demande déjà répondue : « Gérer mon avis » (retrait de l'accord) ; /t/[spaceSlug]/correction : réponse de l'auteur à une correction
src/app/api/connectors/[connector]/[token]/  # réception des webhooks de tous les connecteurs
src/app/api/widget/[widgetId]/# JSON public des témoignages d'un widget (cache CDN)
src/app/api/cron/requests/    # envoi des demandes planifiées
src/app/api/stripe/webhook/   # abonnements PULSACITY
src/app/api/unsubscribe/      # désinscription en un clic (lien signé, et bouton du client de messagerie) ; /accueil : les e-mails d'accueil
src/app/desinscription/       # page de confirmation de la désinscription ; /desinscription/[code] : l'adresse des e-mails (même désinscription en un clic)
src/app/entrer/[code]/        # lien de connexion lisible de « Votre lien », renvoyé vers Better Auth
widget/                       # source du widget embarquable, build → public/w.js
src/config/plans.ts           # plans et limites, mois offert par filleul payant
src/config/pulsacity-space.ts # l'espace PULSACITY (PULSACITY_SPACE_ID), son offre bêta, le seuil de son mur
src/db/schema.ts
src/lib/connectors/           # types.ts (contrat), registry.ts, moteur (réception, traitement), systeme/, universal/ (connecteur universel), upcoming-connectors.ts
src/lib/purchases/            # record-purchase.ts : de NormalizedPurchase au client, à l'achat et à la demande
src/lib/acquisition/          # source d'inscription : mots de l'adresse (UTM, ref), question « Comment avez-vous connu », liens courts
src/lib/referrals/            # parrainage : liens, récompense au premier paiement du filleul, fin du mois offert
src/lib/welcome-emails/       # e-mails d'accueil J0, J1, J3, J7 : échéances, arrêt à l'étape faite, désinscription
src/lib/billing/              # Stripe Billing de PULSACITY : prix par clé de recherche, Checkout, portail, changements de plan, événements, prix fondateur, rappel des bêta-testeurs
src/lib/requests/             # planification et envoi des demandes
src/lib/support/              # « Écrivez-nous » : contact@pulsacity.com, champs, limites, envoi (rien gardé en base), « Signaler un contenu » (/aide?sujet=signalement)
src/lib/legal/                # textes légaux : l'exploitant lu dans les variables LEGAL_PUBLISHER_*, leur validation
src/emails/                   # templates React Email
src/content/                  # textes du site : offres (depuis plans.ts), FAQ, aide par thème (help.ts), un fichier par connecteur et leurs familles (integrations/), guides et textes légaux en MDX
docs-internes/                # décisions, payloads, recette ; etat.md : où en est le projet ; design-v2/ : charte, maquettes et logo v2
scripts/seed-demo.mjs         # espace de démonstration (local, recette)
compose.yaml                  # Postgres local
assets/og-fonts/              # polices WOFF des images de partage (next/og)
src/app/fonts/                # Bricolage Grotesque et Figtree, auto-hébergées (next/font/local)
.claude/skills/ui-ux-pro-max/  # skill UI UX Pro Max, figé (règles UX seulement, voir « Design system »)
```

## Modèle de données

- Tables Better Auth : `user` (name = prénom du créateur, facultatif, « Bonjour Julie » ; Mon compte), `session`, `account`, `verification`
- `spaces` : id, userId, name, slug (unique, modifiable dans Réglages : l'ancienne adresse cesse de marcher, le lien de parrainage /p/<slug> aussi), logoUrl, accentColor (bouton de la page de collecte, étoiles et widgets), replyToEmail, senderPostalAddress (pied des e-mails aux clients, une ligne par ligne saisie), newTestimonialEmailEnabled (e-mail « Nouveau témoignage », vrai par défaut), incentiveDeclaredAt (« J'offre une contrepartie », depuis quand ; null = non), plan (free|essentiel|pro), stripeCustomerId, stripeSubscriptionId, referralCode, collectionLinkSharedAt, firstDayCelebratedAt, firstApprovalCelebratedAt (moments de marque déjà joués), freeSince (repassé au plan Gratuit le …), welcomeEmailsUnsubscribedAt (« Ne plus recevoir les e-mails d'accueil »), referralEssentielUntil (au plan Gratuit, Essentiel offert par le parrainage jusqu'au …), createdAt. Supprimer l'espace (Mon compte) supprime le compte `user` et, en cascade, tout l'espace ; l'abonnement s'arrête d'abord (`src/lib/billing/stop-space-subscription.ts`, branché au lot 4.5)
- `connections` : id, spaceId, connector (systeme|stripe|calendly|…), webhookToken (unique, secret, régénérable), status (pending|active|error), lastEventAt, config (jsonb : signingSecret), createdAt (unique spaceId + connector)
- `products` (les « offres » : formation, accompagnement, séance…) : id, spaceId, name, slug, requestDelayDays (défaut 14), requestsEnabled (bool), createdAt
- `product_refs` : id, productId, connectionId, externalRef — relie une offre à son identifiant dans chaque connecteur
- `external_products` : id, connectionId, externalRef, name, priceCents, currency, firstSeenAt, eventType (vente ou inscription, la première fois) — les produits vus par un connecteur ; « à associer » tant qu'aucun product_ref ne les relie à une offre
- `customers` : id, spaceId, email, firstName, lastName, unsubscribedAt, createdAt (unique spaceId + email)
- `purchases` : id, spaceId, customerId, productId, connectionId (nullable), source (connector|manual|csv), eventType, externalRef, purchasedAt, createdAt (unique connectionId + externalRef : une vente reçue deux fois est enregistrée une fois ; `manual` : « Demander un avis »)
- `review_requests` : id, purchaseId, token (unique), scheduledAt, sentAt, reminderScheduledAt, reminderSentAt, completedAt, cancelledAt, failedAt, status (scheduled|sent|reminded|completed|cancelled|failed), failedAttempts
- `testimonials` : id, spaceId, productId (nullable), customerId (nullable), authorName, authorTitle, authorPhotoUrl, rating (1–5), body (original, jamais modifié), displayBody (texte affiché, null = original), displayEditedAt, status (pending|approved|hidden), source (form|manual|csv), provenance (sale|request|added|import|public-link : vente reçue, demande manuelle, ajout, import, lien public), reviewRequestId, purchasedAt, purchaseConnector (la vente ou la demande à laquelle l'avis répond), hiddenAt, hiddenReason, hiddenReasonDetail (« Autre motif »), hiddenReasonSentAt (motif envoyé à l'auteur, une fois), consentAt, consentText, featured (bool), createdAt. Un avis masqué pour un motif ne compte plus dans la note du badge (`src/lib/testimonials/rated-testimonials.ts`). L'auteur qui retire son accord (« Gérer mon avis », le lien de sa demande) supprime son avis (`src/lib/testimonials/withdraw-consent.ts`)
- `testimonial_corrections` : id, testimonialId, fromBody, body, token (unique, lien de réponse), createdAt, sentAt, answeredAt, outcome (null = en attente | accepted | refused | cancelled) — « Corriger le texte affiché » : le texte ne change qu'avec l'accord de l'auteur ; une correction en attente à la fois, deux au plus par avis
- `widgets` : id, spaceId, name (nullable, pour le créateur seul), type (wall|carousel|badge), productId (nullable = tous), settings (jsonb : thème, couleur d'accent, nombre max, afficher photo/note (la date de l'avis s'affiche toujours), masquer « Propulsé par » (Pro), style des cartes), firstLoadedAt (premier affichage sur une page), lastLoadedAt (dernier affichage, à l'heure près), freePlanChosenAt (« Afficher celui-ci à la place » au plan Gratuit), createdAt
- `space_acquisitions` : spaceId (clé), heardFrom (réponse à « Comment avez-vous connu PULSACITY ? »), utmSource, utmMedium, utmCampaign, utmContent, utmTerm, referralCode (tel que reçu), createdAt — d'où vient un espace, écrit une fois à sa création ; rien sur la personne
- `referrals` : id, referrerSpaceId, refereeSpaceId (unique, null après suppression du filleul), createdAt, rewardedAt (verrou : un mois par filleul, au premier paiement avec de l'argent), reward (credit|free-month|offered), rewardInvoiceId
- `welcome_emails` : id, spaceId, step (j0|j1|j3|j7), claimedAt, sentAt, skippedAt (unique spaceId + step : écrit avant l'envoi, jamais deux fois)
- `webhook_events` : id, connectionId, rawPayload (jsonb), rawBody (octets reçus, pour la signature), headers (jsonb), eventType, receivedAt, processedAt, outcome, purchaseId, error — journal complet, rejouable
- `connector_waitlist` : id, spaceId, connector, toolName, createdAt — « Me prévenir » et « Dites-nous quel outil »
- `connector_waitlist_emails` : id, connector, email, createdAt (unique connector + email) — « Me prévenir » des pages publiques /integrations/[connector], pour un visiteur sans espace ; supprimée après l'annonce
- `tool_suggestions` : id, toolName, createdAt — « Dites-nous quel outil » de /integrations, pour un visiteur sans espace : le nom de l'outil seulement, sans adresse
- `stripe_events` : id, type, payload (l'événement entier, gardé à l'arrivée), receivedAt, processedAt (verrou d'idempotence, null tant qu'il n'est pas traité), error — rejoué par la tâche planifiée s'il reste non traité
- `subscriptions` : id (sub_…), spaceId, status, plan, period, priceList (founder|public), amountCents, currentPeriodEnd, cancelAt, endedAt, scheduledPlan, scheduledPeriod, scheduledPriceList, scheduledAmountCents, scheduledAt, betaTester, betaUntil, betaReminderSentAt, couponId (coupon du code tapé au paiement, gardé : `partenaire-…` pour un partenaire), cardBrand, cardLast4, lastPaymentFailedAt, lastPaymentFailedAmountCents — copie de ce que Stripe dit de chaque abonnement, réécrite à chaque événement ; `spaces.plan` suit l'abonnement courant (`spaces.stripeSubscriptionId`)
- `founder_seats` : id, spaceId (unique, null après suppression de l'espace), takenAt — une ligne par abonné payant au prix fondateur, bêta-testeurs à part ; la centième ferme le prix fondateur
- `billing_payments` : id (in_…), spaceId (null après suppression), subscriptionId, amountCents, currency, paidAt — chaque facture payée avec de l'argent, pour le seuil de la micro-entreprise (`docs-internes/requetes/seuil-micro-entreprise.md`)

## Plans (`src/config/plans.ts`)

| Plan | Prix public | Prix fondateur | Témoignages | Demandes auto / mois | Widgets | Badge |
| --- | --- | --- | --- | --- | --- | --- |
| free | 0 € | — | 15 | 20 | 1 | obligatoire |
| essentiel | 14,99 €/mois, 149 €/an | 9,99 €/mois, 99 €/an | illimité | illimité | illimité | obligatoire |
| pro | 24,99 €/mois, 249 €/an | 19,99 €/mois, 199 €/an | illimité | illimité | illimité | retirable |

Prix finaux : rien ne s'ajoute au paiement, aucune TVA n'est facturée (`docs-internes/decisions/tarifs.md`). L'annuel vaut dix mois, arrondi à l'euro inférieur (« 2 mois offerts »).

Prix fondateur : les bêta-testeurs et les 100 premiers abonnés payants (`FOUNDER_PRICE_SEATS`), gardé à vie tant que l'abonnement ne s'interrompt pas. Tant qu'il est ouvert, les pages l'affichent comme le prix payé, avec la ligne « Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois » ; ni prix barré, ni compteur. Au centième, elles passent aux prix publics sans nouvelle livraison : `founder_seats` compte les abonnés au prix fondateur, et l'accueil et Tarifs se régénèrent à la centième place prise (et toutes les heures). Les prix Stripe sont trouvés par leur clé de recherche (`essentiel_monthly_founder`…, `readStripeLookupKey` dans `plans.ts`) et vérifiés contre `plans.ts` à chaque paiement.

Sur tous les plans : 20 demandes saisies à la main par jour (« Demander un avis », `manualRequestsPerDay`), contre les envois en masse. Elles comptent aussi dans les demandes du mois.

Dépasser une limite ne supprime jamais de données : on bloque l'ajout et on propose de passer au plan supérieur. La limite de témoignages compte les témoignages validés : au-delà, les nouveaux arrivent et restent en attente.

Parrainage (`REFERRAL_REWARD_MONTHS`) : le premier paiement avec de l'argent d'un filleul offre au parrain un mois d'Essentiel, une fois, jamais d'argent : abonné, un crédit Stripe d'un mois d'Essentiel à son prix, déduit des paiements suivants ; au plan Gratuit, Essentiel pendant un mois.

## Design system (application et site)

Depuis le lot 4.2 (14 octobre 2026), la v2 (direction « Tournesol », logo « Galet ») est la source. Sources uniques :
- `docs-internes/design-v2/charte.md` : valeurs exactes des couleurs, polices, tailles, espacements, rayons, ombres, bordures, composants et leurs états, mouvement, ton de voix.
- `docs-internes/design-v2/maquettes/` (index : `INDEX.md`) : les planches de la charte et des coques, puis un export par écran, au fil des maquettes v2 (lots 4.3 à 4.8).
- `docs-internes/design-v2/identite/` : le logo (`logo/`) et sa spécification (`SPEC.md`).

La v1 (`docs-internes/charte.md`, `docs-internes/maquettes/`, `docs-internes/identite-v2/`) ne donne plus aucune valeur. Un écran pas encore migré garde sa mise en page v1 (sa maquette v1), avec les jetons et les composants v2, jusqu'à ce que sa maquette v2 arrive.

Règles :
- N'invente jamais une couleur, une police ou un espacement : si une valeur manque dans la charte v2, arrête-toi et demande-la.
- Chaque écran reproduit sa maquette. Un écran sans maquette n'est pas construit : demande la maquette.
- Les jetons sont dans `src/app/globals.css` (un test les compare à la charte v2), le mouvement dans `src/app/pulsacity-motion.css`, les composants de base dans `src/components/ui/`. Un écran s'en sert, il ne recopie pas leurs classes.

Interdits permanents (signatures de sites générés) : étiquettes en majuscules espacées au-dessus des titres ; un mot du titre en couleur ou italique ; flèches « → » dans les boutons ; grilles de cartes identiques avec la même ombre ; dégradés décoratifs ; animations d'apparition sur chaque section ; numérotation 01/02/03 hors vraie séquence. Et ceux de la charte v2 : filets fins pour séparer ; titres à empattements sur fond crème ; durées d'installation ou de saisie ; « TVA comprise », « HT » ; « tout Systeme.io » ; « partenaire officiel » ; « avis vérifiés » ; prix barré, compteur de places.

### Le skill UI UX Pro Max

Installé dans `.claude/skills/ui-ux-pro-max/` (version 2.15.0, figée, licence MIT dans le dossier). Il sert seulement à deux choses :
- ses règles UX et d'accessibilité : `python3 -B .claude/skills/ui-ux-pro-max/scripts/search.py "<question>" --domain ux`, `--stack nextjs` ou `--stack shadcn` (`-B` : aucun cache dans le dépôt) ;
- sa liste de contrôle avant de livrer un écran : `references/pro-rules.md` et `references/quick-reference.md`.

Jamais son générateur (`--design-system`, `--persist`), ni ses palettes, ses polices ou ses styles. En cas de conflit, la charte v2 et les interdits l'emportent. On ne le met pas à jour sans décision du fondateur.

## Design du widget

- Rendu dans un Shadow DOM : aucun style de la page hôte ne le casse, aucun style du widget ne fuit.
- `font-family: inherit` récupérée depuis l'élément hôte ; couleur d'accent configurable ; thème clair/sombre/auto ; rendu conforme à la section Widget de la charte v2 et aux maquettes 3.6 (`docs-internes/design-v2/maquettes/v2-widget-*`) depuis le lot 4.8.
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
STRIPE_SECRET_KEY              # sk_test_ en recette, sk_live_ en production
STRIPE_WEBHOOK_SECRET          # whsec_ du webhook de l'environnement
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET
R2_PUBLIC_URL
CRON_SECRET
NEXT_PUBLIC_APP_URL            # https://pulsacity.com
SENTRY_DSN
LEGAL_VALIDATED                # true quand le fondateur valide les textes légaux ; sans les trois variables suivantes, ils restent en brouillon
LEGAL_PUBLISHER_NAME           # prénom et nom de l'exploitant, vendeur particulier (lot 4.9) : textes légaux, pied des e-mails de PULSACITY
LEGAL_PUBLISHER_ADDRESS        # son adresse postale, sur une ligne
LEGAL_PUBLISHER_PHONE          # son numéro de mobile (mentions légales)
PULSACITY_SPACE_ID             # l'espace PULSACITY : son mur sur l'accueil, son badge sur Tarifs (sans elle, rien)
NEXT_PUBLIC_UMAMI_WEBSITE_ID   # mesure d'audience Umami Cloud des pages publiques (sans elle, aucun script)
NEXT_PUBLIC_UMAMI_SCRIPT_URL   # facultative : autre adresse du script d'Umami (cloud.umami.is par défaut)
```

## Conventions

- Composants serveur par défaut ; `"use client"` seulement pour l'interactivité.
- Mutations : Server Actions + Zod, retour `{ ok: true, data } | { ok: false, error }`.
- Toute action de l'espace vérifie la session ET l'appartenance de l'espace.
- Webhooks : on enregistre d'abord le payload brut dans `webhook_events`, on répond 200 vite, on traite ensuite. Un payload inconnu n'est jamais perdu.
- Envois d'e-mails idempotents : un `review_request` n'est envoyé qu'une fois (verrou sur `sentAt`).
- Les e-mails liés à un avis (règle n° 4) : le motif d'un masquage part une fois (verrou sur `hiddenReasonSentAt`), la demande d'accord d'une correction deux fois au plus (`MAX_CORRECTIONS_PER_TESTIMONIAL`), une correction en attente à la fois. Rien à un auteur sans adresse (ajout, import, lien public).
- Une demande par client et par offre. Un même client (même e-mail) reçu par deux connecteurs dans les 48 heures ne reçoit qu'une demande : la vente dont l'offre est associée la garde (`src/lib/requests/schedule-review-request.ts`).
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
