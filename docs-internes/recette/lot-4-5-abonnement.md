# Lot 4.5 — Abonnement et factures : Stripe en mode test, puis recette

Le compte Stripe est ouvert (2.8 a, le 15 octobre 2026), en particulier, avec contact@pulsacity.com. Rien n'y est encore réglé. Ce fichier tient, dans l'ordre, tous les prompts Claude in Chrome du lot (groupe d'onglets « PULSACITY »).

Première phase, Stripe en mode test : prompts 1 à 5. Ils n'attendent pas le code : lancez-les dès maintenant, dans l'ordre.
- Prompt 1 : le compte (image de marque, informations publiques, liens légaux, reçus, factures). C'est le 2.8 b, complété.
- Prompt 2 : les produits et les huit prix.
- Prompt 3 : le portail client, les relances des paiements échoués, les e-mails de Stripe.
- Prompt 4 : le code des bêta-testeurs.
- Prompt 5 : la clé de test, collée par vous dans Vercel (aperçus seulement).

Deuxième phase, la PR ouverte ([#40](https://github.com/jawadboughalem/PULSACITY/pull/40)) : le webhook vers l'aperçu (prompt 6), l'espace de recette (prompt 7), puis la recette, qui capture en même temps les vrais événements de Stripe (prompts suivants, ajoutés ici avec eux).

Adresse de l'aperçu : https://pulsacity-git-claude-dreamy-edi-e47f0f-jawadboughalems-projects.vercel.app

À savoir :
- Tout se fait dans l'environnement de test de Stripe : le « mode test », ou un « bac à sable » (sandbox), selon ce que Stripe vous a ouvert. Le prompt 1 le relève ; les suivants restent dans le même.
- Vous vous connectez vous-même à Stripe et à Vercel. L'agent ne crée aucun compte, ne lit aucune clé et ne touche ni au mode réel, ni aux informations d'identité, ni au compte bancaire.
- Les prix sont trouvés par le code grâce à leur « clé de recherche » (lookup key) : aucun identifiant de prix à copier dans Vercel. Le code vérifie à chaque paiement que le prix de Stripe est celui de `src/config/plans.ts` (montant, euros, mensuel ou annuel, taxe incluse), et refuse d'ouvrir le paiement sinon.
- Aucune TVA : Stripe Tax reste désactivé, et chaque prix est « taxe incluse » (`tax_behavior: inclusive`), pour qu'aucun montant ne s'ajoute le jour où une taxe existerait.

---

## 1. Stripe — régler le compte (2.8 b)

Avant ce prompt :
- connectez-vous à Stripe ;
- téléchargez ces deux fichiers depuis le dépôt (il est public) et gardez-les sous la main :
  - l'icône : https://github.com/jawadboughalem/PULSACITY/raw/main/docs-internes/design-v2/identite/logo/png/icon-512.png
  - le logo : https://github.com/jawadboughalem/PULSACITY/raw/main/docs-internes/design-v2/identite/logo/png/pulsacity-logo-128.png

Le pied de page des factures attend les textes de 2.7 : il reste vide en mode test, et sera collé avant le mode réel (2.8 c).

```
Tu m'aides à régler le compte Stripe de PULSACITY, en environnement de test. Je suis connecté. Tu ne crées ni produit, ni prix, ni webhook, ni clé : ce sera pour les prompts suivants.

Où : https://dashboard.stripe.com/

D'abord : vérifie que tu es dans un environnement de test. Stripe l'appelle « mode test » (bascule « Mode test » ou « Test mode ») ou « bac à sable » (« Sandbox », choisi dans le menu du compte en haut à gauche). S'il y a un bac à sable, utilise-le ; sinon, active le mode test. Note lequel, et son nom s'il en a un. Si tu ne trouves ni l'un ni l'autre, arrête-toi et dis-le-moi.

Ce qu'il ne faut surtout pas toucher : le mode réel (« live »), les clés API, les webhooks, les comptes bancaires, les informations d'identité et d'activation du compte, l'abonnement de Stripe lui-même, Stripe Tax (ne l'active pas).

1. Image de marque (Paramètres › « Image de marque » ou « Branding ») :
   - icône : le fichier icon-512.png que je te donne ; logo : le fichier pulsacity-logo-128.png. Demande-les-moi au moment de les déposer ;
   - couleur de marque (« Brand color ») : #FFBE3B ; couleur d'accent (« Accent color ») : #16213E ;
   - s'il existe une couleur de fond pour les pages de paiement : #F4F8FF ; une forme de bouton : la plus arrondie ; une police : laisse celle par défaut.
   Enregistre.
2. Informations publiques (Paramètres › « Informations publiques » ou « Public details ») :
   - nom public de l'entreprise : PULSACITY ;
   - site web : https://pulsacity.com ;
   - e-mail d'assistance : contact@pulsacity.com ;
   - libellé sur les relevés bancaires : PULSACITY ; libellé abrégé, s'il est demandé : PULSACITY ;
   - conditions d'utilisation (« Terms of service ») : https://pulsacity.com/cgv ; politique de confidentialité : https://pulsacity.com/confidentialite ;
   - laisse vides le téléphone et l'adresse d'assistance : ils viendront avant le mode réel.
   Enregistre.
3. E-mails aux clients (Paramètres › « E-mails aux clients » ou « Customer emails ») : active les reçus des paiements réussis et les reçus des remboursements. Ne change rien d'autre ici : les relances sont au prompt 3.
4. Factures (Paramètres › Billing › « Factures » ou « Invoices ») :
   - numérotation des factures : séquentielle à l'échelle du compte (« account level » / « Sequentially across your account »), si le choix existe ;
   - laisse le préfixe tel qu'il est ;
   - laisse le pied de page et la note par défaut vides.
   Enregistre.
5. Taxes (Paramètres › « Taxes » ou « Tax ») : vérifie seulement que Stripe Tax n'est pas activé. Ne l'active pas, ne réponds à aucun assistant.
6. Moyens de paiement (Paramètres › « Moyens de paiement » ou « Payment methods ») : ne change rien. Relève seulement la liste des moyens activés.

Vérification : ouvre l'aperçu d'un reçu ou d'une facture s'il y en a un (Paramètres › Image de marque, ou E-mails aux clients › « Aperçu ») : il montre le logo, les couleurs et le nom public PULSACITY.

Compte rendu à me donner : l'environnement utilisé (mode test ou bac à sable, et son nom), chaque réglage fait, la liste des moyens de paiement activés, l'état de Stripe Tax, et ce que tu n'as pas trouvé. Ni clé, ni identifiant de compte (rien qui commence par acct_, sk_, pk_ ou rk_).
```

## 2. Stripe — les produits et les huit prix

```
Tu m'aides à créer les produits et les prix de PULSACITY dans Stripe, en environnement de test (le même que celui du prompt précédent : mode test, ou le même bac à sable). Je suis connecté.

Où : https://dashboard.stripe.com/ › « Catalogue de produits » (« Product catalog »). Vérifie d'abord que tu es bien dans l'environnement de test.

Ce qu'il ne faut surtout pas toucher : le mode réel, les clés API, les webhooks, les réglages du compte, Stripe Tax (ne l'active pas, même si un prix le propose).

Deux produits, quatre prix chacun. Tous les prix : récurrents (« Récurrent »), en EUR, tarification standard à l'unité (« Standard pricing » / quantité 1), et « Inclure les taxes dans le prix » sur « Oui » (« Include tax in price: Yes », c'est-à-dire « inclusive »). Pour chaque prix, ouvre les options avancées (« Plus d'options », « Advanced ») et remplis la « Clé de recherche » (« Lookup key ») et la « Description du prix » (« Price description ») exactement comme ci-dessous. Une faute dans une clé de recherche empêche le paiement : recopie-les caractère par caractère.

Produit 1
- Nom : PULSACITY Essentiel
- Description : Témoignages, demandes automatiques et widgets illimités.
- Prix :
  | Montant | Période | Clé de recherche | Description du prix |
  | 9,99 € | Mensuelle | essentiel_monthly_founder | Essentiel mensuel, prix de lancement |
  | 99,00 € | Annuelle | essentiel_yearly_founder | Essentiel annuel, prix de lancement |
  | 14,99 € | Mensuelle | essentiel_monthly_public | Essentiel mensuel |
  | 149,00 € | Annuelle | essentiel_yearly_public | Essentiel annuel |
- Prix par défaut du produit : 9,99 € mensuel.

Produit 2
- Nom : PULSACITY Pro
- Description : Tout Essentiel, et la mention « Propulsé par PULSACITY » retirable.
- Prix :
  | Montant | Période | Clé de recherche | Description du prix |
  | 19,99 € | Mensuelle | pro_monthly_founder | Pro mensuel, prix de lancement |
  | 199,00 € | Annuelle | pro_yearly_founder | Pro annuel, prix de lancement |
  | 24,99 € | Mensuelle | pro_monthly_public | Pro mensuel |
  | 249,00 € | Annuelle | pro_yearly_public | Pro annuel |
- Prix par défaut du produit : 19,99 € mensuel.

Laisse vides : l'image du produit, le code fiscal (« tax code »), le libellé d'unité, les métadonnées. Pas d'essai gratuit (« free trial ») sur aucun prix.

Si « Inclure les taxes dans le prix » n'apparaît pas pour un prix, ne crée pas ce prix : arrête-toi et dis-moi ce que tu vois à la place. Si la « Clé de recherche » n'apparaît pas à la création, crée le prix, puis ajoute-la en modifiant le prix ; si elle n'existe nulle part, arrête-toi et dis-le-moi.

Vérification : dans le catalogue, chaque produit a ses quatre prix, actifs ; ouvre chaque prix et relis son montant, sa période, « taxe incluse » (inclusive) et sa clé de recherche.

Compte rendu à me donner : pour chacun des huit prix, le montant, la période, le comportement fiscal affiché et la clé de recherche, relus sur la page du prix. Pas les identifiants (rien qui commence par price_ ou prod_).
```

## 3. Stripe — le portail client, les relances, les e-mails

```
Tu m'aides à régler le portail client et la relance des paiements échoués de PULSACITY dans Stripe, en environnement de test (le même que les prompts précédents). Je suis connecté.

Où : https://dashboard.stripe.com/ › Paramètres › Billing. Vérifie d'abord que tu es bien dans l'environnement de test.

Ce qu'il ne faut surtout pas toucher : le mode réel, les clés API, les webhooks, les produits et les prix, Stripe Tax, les informations du compte.

1. Portail client (Paramètres › Billing › « Portail client » ou « Customer portal ») :
   - historique des factures (« Invoice history ») : activé ;
   - informations du client : adresse e-mail et adresse de facturation modifiables ; téléphone désactivé ; numéro fiscal (« Tax ID ») désactivé ;
   - moyens de paiement (« Payment methods ») : modifiables ;
   - résiliation (« Cancel subscriptions ») : activée, « à la fin de la période de facturation » (« At the end of the billing period »), sans remboursement au prorata ; motif de résiliation (« Cancellation reason ») : activé, avec toutes les raisons proposées ;
   - changement d'abonnement (« Customers can switch plans » / « Subscription update ») : DÉSACTIVÉ. PULSACITY gère les changements de plan dans sa propre page ;
   - mise en pause (« Pause subscriptions ») : désactivée ;
   - informations de l'entreprise : titre (« Headline ») : PULSACITY : votre abonnement et vos factures ; conditions : https://pulsacity.com/cgv ; confidentialité : https://pulsacity.com/confidentialite ;
   - lien de redirection par défaut (« Default redirect link »), s'il est demandé : https://pulsacity.com/app/facturation ;
   - lien de connexion au portail (« Customer portal link » / « Login link ») : laisse-le désactivé s'il est désactivé.
   Enregistre (« Save »). C'est indispensable : sans configuration enregistrée en test, la page « Abonnement et factures » ne peut pas ouvrir le portail.
2. Relances des paiements échoués (Paramètres › Billing › « Récupération des revenus », « Revenue recovery », « Retries » ou « Subscriptions and emails ») :
   - nouvelles tentatives intelligentes (« Smart Retries ») : activées, 8 tentatives sur 2 semaines (la valeur recommandée par Stripe) ;
   - si toutes les tentatives échouent : annuler l'abonnement (« Cancel the subscription ») ;
   - e-mail au client quand un paiement par carte échoue : activé, avec le lien vers la page hébergée par Stripe ;
   - e-mail quand un paiement demande une confirmation (3D Secure) : activé ;
   - e-mail quand une carte va expirer : activé.
   Enregistre.
3. Rappels de renouvellement (« Upcoming renewal » / « Renewal reminders »), s'ils existent : active-les seulement si le réglage peut se limiter aux abonnements annuels, 7 jours avant. Sinon, laisse-les tels quels et dis-le-moi.
4. Essais gratuits (« Trials ») : ne change rien.

Vérification : rouvre le portail client et relis chaque réglage ; Stripe propose un aperçu du portail (« Preview »), ouvre-le : il montre les factures, les moyens de paiement et la résiliation, sans changement de plan.

Compte rendu à me donner : chaque réglage fait, tel que relu après l'enregistrement, et ce que tu n'as pas trouvé. Ni clé, ni identifiant (rien qui commence par bpc_, acct_, sk_ ou pk_).
```

## 4. Stripe — le code des bêta-testeurs

Les bêta-testeurs ont le plan Essentiel offert 3 mois, carte demandée, puis le prix de lancement (`decisions/tarifs.md`, arbitrage n° 3). Le code ne marche que sur Essentiel en mensuel : la page de paiement annuelle ne propose pas de code, pour qu'il n'offre jamais une année entière.

```
Tu m'aides à créer le code promotionnel des bêta-testeurs de PULSACITY dans Stripe, en environnement de test (le même que les prompts précédents). Je suis connecté.

Où : https://dashboard.stripe.com/ › « Catalogue de produits » › « Coupons » (ou Billing › « Coupons »). Vérifie d'abord que tu es bien dans l'environnement de test.

Ce qu'il ne faut surtout pas toucher : le mode réel, les produits et les prix, les clés API, les webhooks, les réglages.

1. Crée un coupon :
   - nom (visible sur les factures et la page de paiement) : Bêta-testeur : Essentiel offert 3 mois
   - identifiant (« ID ») : beta-essentiel-3-mois — recopie-le exactement, le code de PULSACITY le reconnaît à cet identifiant ;
   - type : pourcentage, 100 % ;
   - durée : plusieurs mois (« Multiple months » / « Repeating »), 3 mois ;
   - s'applique à certains produits seulement : PULSACITY Essentiel ;
   - pas de limite de date ni de nombre d'utilisations sur le coupon lui-même.
2. Dans ce coupon, crée un code promotionnel (« Promotion code ») :
   - code : BETA-PULSACITY
   - réservé à une première commande (« Eligible for first-time order only ») : oui ;
   - nombre maximal d'utilisations : 30 ;
   - pas de date d'expiration, pas de client particulier, pas de montant minimum.

Vérification : le coupon montre 100 %, 3 mois, le produit PULSACITY Essentiel et l'identifiant beta-essentiel-3-mois ; le code BETA-PULSACITY est actif, limité à 30 utilisations et aux premières commandes.

Compte rendu à me donner : le coupon et le code, tels que relus sur leur page (nom, identifiant du coupon, pourcentage, durée, produit, code, restrictions). Pas d'autre identifiant (rien qui commence par promo_, sk_ ou acct_).
```

## 5. Stripe puis Vercel — la clé de test, collée par vous

Le secret ne passe jamais par une conversation : c'est vous qui le copiez dans Stripe et le collez dans Vercel.

```
Tu m'aides à donner à PULSACITY la clé secrète de test de Stripe, sur les aperçus Vercel seulement. Tu ne lis jamais la clé : c'est moi qui la copie et la colle.

Étapes :
1. Stripe : https://dashboard.stripe.com/ › Développeurs (« Developers ») › « Clés API » (« API keys »). Vérifie que tu es dans l'environnement de test des prompts précédents : la clé secrète doit commencer par « sk_test_ ». Ne clique pas sur « Révéler » : dis-moi « Révélez et copiez la clé secrète de test, puis dites-moi OK. » Attends mon OK. Si la page ne propose qu'une clé commençant par « sk_live_ », arrête-toi.
2. Vercel : https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables
   - ajoute une variable : nom STRIPE_SECRET_KEY ;
   - environnements : « Preview » SEULEMENT. Décoche « Production » et « Development » ;
   - branche : toutes les branches d'aperçu (laisse le champ de branche vide) ;
   - « Sensitive » : activé, si l'option existe ;
   - pour la valeur, arrête-toi et dis-moi : « Collez la clé dans le champ Value, puis dites-moi OK. » Attends mon OK, puis enregistre.
3. Si une variable STRIPE_SECRET_KEY existe déjà en Preview, ne crée rien : dis-le-moi.

Ne touche surtout pas : aux variables de Production, aux autres variables, à la protection des déploiements, aux domaines. Ne lance aucun déploiement.

Vérification : la liste des variables montre STRIPE_SECRET_KEY, en « Preview » seulement, valeur masquée.

Compte rendu à me donner : « STRIPE_SECRET_KEY ajoutée en Preview seulement », et le préfixe vu dans Stripe (« sk_test_ », rien de plus). Jamais la clé.
```

---

# Deuxième phase — le webhook vers l'aperçu

## 6. Vercel et Stripe — le webhook de recette, et son secret collé par vous

Avant ce prompt : prompts 1 à 5 faits ; connectez-vous à Vercel et à Stripe. Deux secrets passent par vos mains, jamais par une conversation : celui de « Protection Bypass for Automation » (Vercel), et celui du webhook (Stripe, « whsec_ »).

```
Tu m'aides à brancher les événements Stripe de test sur l'aperçu Vercel de la PR #40 de PULSACITY. Tu ne lis jamais un secret : c'est moi qui les copie et les colle.

Adresse de l'aperçu : https://pulsacity-git-claude-dreamy-edi-e47f0f-jawadboughalems-projects.vercel.app

Ce qu'il ne faut surtout pas toucher : le mode réel de Stripe, les produits, les prix, le portail, les autres webhooks ; dans Vercel, « Vercel Authentication » (il reste activé), les variables de Production, les domaines, le déploiement de production.

1. Vercel, https://vercel.com/jawadboughalems-projects/pulsacity/settings/deployment-protection, rubrique « Protection Bypass for Automation » : vérifie qu'un secret existe (n'en crée pas s'il y en a un ; s'il n'y en a aucun, crée-le). Arrête-toi et dis-moi : « Copiez le secret de Protection Bypass for Automation et gardez-le pour l'étape 3, puis dites-moi OK. » Attends mon OK.
2. Stripe, https://dashboard.stripe.com/ , environnement de test des prompts précédents (vérifie-le). Développeurs › « Webhooks » (ou Workbench › « Webhooks ») › « Ajouter une destination » (« Add destination » / « Add endpoint ») :
   - événements de : « Votre compte » (« Your account ») ;
   - version de l'API : 2026-09-30.endive. Si elle n'est pas proposée, prends la plus récente et dis-moi laquelle ;
   - événements à envoyer, exactement ceux-ci (20) :
     checkout.session.completed
     checkout.session.async_payment_succeeded
     checkout.session.async_payment_failed
     customer.subscription.created
     customer.subscription.updated
     customer.subscription.deleted
     customer.subscription.paused
     customer.subscription.resumed
     customer.subscription.pending_update_applied
     customer.subscription.pending_update_expired
     invoice.paid
     invoice.payment_failed
     invoice.payment_action_required
     invoice.upcoming
     subscription_schedule.updated
     subscription_schedule.released
     subscription_schedule.canceled
     subscription_schedule.completed
     customer.updated
     payment_method.attached
   - type de destination : « Point de terminaison webhook » (« Webhook endpoint ») ;
   - nom ou description : PULSACITY recette (aperçu de la PR 40)
3. Adresse du point de terminaison : tape exactement
   https://pulsacity-git-claude-dreamy-edi-e47f0f-jawadboughalems-projects.vercel.app/api/stripe/webhook?x-vercel-protection-bypass=
   puis arrête-toi et dis-moi : « Collez le secret de Vercel juste à la fin de l'adresse, sans espace, puis dites-moi OK. » Attends mon OK, puis crée la destination.
4. Sur la page de la destination créée, repère le « Secret de signature » (« Signing secret », il commence par whsec_). Ne clique pas sur « Révéler » : dis-moi « Révélez et copiez le secret de signature, puis dites-moi OK. » Attends mon OK.
5. Vercel, https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables : ajoute STRIPE_WEBHOOK_SECRET, environnement « Preview » SEULEMENT (ni Production, ni Development), toutes les branches d'aperçu, « Sensitive » si l'option existe. Pour la valeur, dis-moi : « Collez le secret de signature dans Value, puis dites-moi OK. » Attends mon OK, puis enregistre. Si la variable existe déjà en Preview, ne crée rien et dis-le-moi.
6. Stripe, Paramètres › Billing › « Abonnements et e-mails » (« Subscriptions and emails ») : si un réglage « Événements de renouvellement à venir » (« Upcoming renewal events », l'envoi de invoice.upcoming) existe, mets-le à 7 jours avant. Ne change rien d'autre.
7. Vercel, https://vercel.com/jawadboughalems-projects/pulsacity/deployments : ouvre le dernier déploiement de la branche claude/dreamy-edison-yk9c9a, menu « … » › « Redeploy » (garde les options par défaut). Attends l'état « Ready ». C'est indispensable : un déploiement ne lit que les variables qui existaient à sa construction.

Vérification :
- la destination Stripe montre l'adresse de l'aperçu (le secret, masqué ou non, à la fin), la version d'API et 20 événements ;
- Vercel montre STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET en Preview seulement ;
- le dernier déploiement de la branche est « Ready », construit après l'ajout des variables.

Compte rendu à me donner : la version d'API choisie, le nombre d'événements, le réglage des renouvellements à venir (trouvé ou non, valeur), les deux variables vues en Preview, l'heure du déploiement « Ready ». Jamais un secret, ni l'adresse complète avec son secret, ni un identifiant (we_, whsec_, acct_).
```

## 7. GitHub — l'espace de recette, depuis la branche de la PR

```
Tu m'aides à remplir l'espace de démonstration de PULSACITY sur la base de recette, depuis la branche de la PR #40.

Où : https://github.com/jawadboughalem/PULSACITY/actions/workflows/seed-recette.yml

Étapes :
1. Vérifie d'abord, dans https://github.com/jawadboughalem/PULSACITY/actions/workflows/db-migrate-recette.yml , que la dernière exécution sur la branche claude/dreamy-edison-yk9c9a est verte (elle applique la migration 0012). Si elle est rouge ou absente, arrête-toi et dis-le-moi.
2. Sur « Recette demo space », clique sur « Run workflow ».
3. « Use workflow from » : la branche claude/dreamy-edison-yk9c9a (pas main).
4. « Adresse e-mail du compte de recette » : demande-la-moi et mets celle que je te donne.
5. Plan : free.
6. Clique sur « Run workflow », puis attends la fin : l'exécution doit être verte.
7. Recommence les étapes 2 à 6 avec une seconde adresse que je te donne (elle servira au bêta-testeur et aux cartes refusées), plan free.

Ne touche surtout pas aux autres workflows, ni à la branche main.

Compte rendu à me donner : la migration de recette (couleur, date), puis pour chaque exécution la branche, le plan et la couleur. Pas les adresses e-mail.
```

Si « Recette demo space » échoue sur « tenant/user not found », réveillez d'abord la base de recette (prompt 0 bis de `lot-4-1-decisions.md`).
