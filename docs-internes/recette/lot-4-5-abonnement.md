# Lot 4.5 — Abonnement et factures : Stripe en mode test, puis recette

Le compte Stripe est ouvert (2.8 a, le 15 octobre 2026), en particulier, avec contact@pulsacity.com. Rien n'y est encore réglé. Ce fichier tient, dans l'ordre, tous les prompts Claude in Chrome du lot (groupe d'onglets « PULSACITY »).

Première phase, Stripe en mode test : prompts 1 à 5. Ils n'attendent pas le code : lancez-les dès maintenant, dans l'ordre. Faits le 15 octobre, 3 bis compris (comptes rendus sous chaque prompt).
- Prompt 1 : le compte (image de marque, informations publiques, liens légaux, reçus, factures). C'est le 2.8 b, complété. Fait le 15 octobre, compte rendu sous le prompt.
- Prompt 1 bis : le bouton de la page de paiement, remis en Soleil.
- Prompt 2 : les produits et les huit prix. Réécrit le 15 octobre, après un premier essai arrêté avant la création.
- Prompt 3 : le portail client, les relances des paiements échoués, les e-mails de Stripe.
- Prompt 3 bis : le lien des e-mails de Stripe vers la page hébergée par Stripe.
- Prompt 4 : le code des bêta-testeurs.
- Prompt 5 : la clé de test, collée par vous dans Vercel (aperçus seulement).

Deuxième phase, la PR ouverte ([#40](https://github.com/jawadboughalem/PULSACITY/pull/40)) : le webhook vers l'aperçu (prompt 6), les espaces de recette (prompt 7).

Troisième phase, la recette, qui capture en même temps les vrais événements de Stripe : prompts 8 à 11, puis le relevé des événements (prompt 12) et la requête du seuil (prompt 13). Claude Code en tire les fixtures, corrige ce qui doit l'être, puis donne la contre-recette.

Plus tard, le passage en mode réel : seulement quand les lots 4.4 et 4.9 sont en ligne, Vercel en Pro et le compte Stripe activé (2.8 c). Ses prompts seront écrits à ce moment-là. Ils reprendront ce que le bac à sable ne laisse pas faire avant l'activation (compte rendu du prompt 1) :
- les informations publiques : nom public PULSACITY, site, e-mail d'assistance, adresse des CGV et de la confidentialité. L'adresse des CGV est indispensable : sans elle, Stripe n'affiche pas la case des CGV de la page de paiement, que le code demande en mode réel. Ces deux adresses donnent aussi les liens du portail client (« Aucun lien défini » en test) ;
- le libellé sur les relevés bancaires (page Paiements, en mode réel seulement) ;
- le pied de page des factures (textes de 2.7) ;
- les moyens de paiement du portail : la carte seulement, comme la page de paiement ;
- en mode réel, les réglages des prompts 1 à 4 sont à refaire : un bac à sable ne partage rien avec le compte réel.

Adresse de l'aperçu : https://pulsacity-git-claude-dreamy-edi-e47f0f-jawadboughalems-projects.vercel.app

À savoir :
- Tout se fait dans l'environnement de test de Stripe : le « mode test », ou un « bac à sable » (sandbox), selon ce que Stripe vous a ouvert. Le prompt 1 le relève ; les suivants restent dans le même.
- Vous vous connectez vous-même à Stripe et à Vercel. L'agent ne crée aucun compte, ne lit aucune clé et ne touche ni au mode réel, ni aux informations d'identité, ni au compte bancaire.
- Les prix sont trouvés par le code grâce à leur « clé de recherche » (lookup key) : aucun identifiant de prix à copier dans Vercel. Le code vérifie à chaque paiement que le prix de Stripe est celui de `src/config/plans.ts` (montant, euros, mensuel ou annuel, aucune taxe ajoutée par-dessus), et refuse d'ouvrir le paiement sinon.
- Aucune TVA : Stripe Tax reste désactivé. Sans lui, le tableau de bord crée les prix sans comportement fiscal (« non spécifié ») et rien ne s'ajoute au prix : c'est voulu. Le code refuse seulement un prix « taxe exclue », qui ajouterait une taxe par-dessus le jour où Stripe Tax en calculerait une.
- La page de paiement ne propose que la carte (Apple Pay, Google Pay et Link compris : ils paient par carte), quels que soient les moyens activés dans Stripe.
- Conditions générales de vente : en mode test, la page de paiement les cite sous le bouton (« En vous abonnant, vous acceptez les conditions générales de vente de PULSACITY. »). La case à cocher n'arrive qu'en mode réel : Stripe ne l'affiche que si l'adresse des CGV est dans les informations publiques, qu'un bac à sable ne laisse pas remplir.

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

Compte rendu du 15 octobre :
- Environnement : un seul bac à sable, renommé « PULSACITY » (il s'appelait « environnement de test PULSACITY ») ; bandeau « Environnement de test » visible ; rien touché en mode réel.
- Image de marque : icône et logo déposés (« Privilégier le logo » coché par Stripe au dépôt) ; couleur de marque #FFBE3B, d'accent #16213E. Page de paiement : fond #F4F8FF, forme « Ronde », police par défaut. Pour régler le fond, « Utiliser les couleurs de la marque » a été décoché et le bouton mis en #16213E : le prompt 1 bis le remet en Soleil.
- Reçus des paiements réussis et des remboursements : activés. Factures : numérotation déjà séquentielle pour tout le compte, préfixe, mémo et pied de page inchangés.
- Stripe Tax : pas activé. Moyens de paiement activés, non modifiés (15) : Cartes, Amazon Pay, Apple Pay, Kakao Pay, Link, MB WAY, Naver Pay, PAYCO, Samsung Pay, Satispay, Bancontact, BLIK, EPS, Klarna, Pix. La page de paiement n'en garde que la carte (le code le demande à Stripe).
- Pas faisable avant l'activation : les informations publiques (l'onglet demande « Activer les produits ») et le libellé sur les relevés (page Paiements, mode réel seulement). Reçus et factures de test disent donc « environnement de test PULSACITY ». Ils passent aux prompts du mode réel. Les réponses aux e-mails de Stripe vont déjà à contact@pulsacity.com.

## 1 bis. Stripe — le bouton de la page de paiement, en Soleil

```
Tu m'aides à corriger un seul réglage de la page de paiement de PULSACITY dans Stripe, dans le bac à sable « PULSACITY » (environnement de test, bandeau « Environnement de test » visible). Je suis connecté.

Où : https://dashboard.stripe.com/ › Paramètres › « Image de marque » (« Branding »), partie de la page de paiement (« Checkout »). Vérifie d'abord que tu es bien dans le bac à sable.

Ce qu'il ne faut surtout pas toucher : le mode réel, l'activation du compte, les clés API, Stripe Tax, les moyens de paiement, le logo, l'icône, la couleur de marque (#FFBE3B), la couleur d'accent (#16213E), le fond de la page de paiement (#F4F8FF), la forme « Ronde », la police.

1. Couleur du bouton de la page de paiement : #FFBE3B (au lieu de #16213E). C'est le bouton principal de la charte de PULSACITY : fond jaune, texte foncé.
2. Si Stripe demande aussi une couleur pour le texte du bouton, mets #16213E. S'il la choisit lui-même, laisse-le faire.
Enregistre.

Vérification : l'aperçu de la page de paiement montre le fond #F4F8FF, le logo PULSACITY et un bouton jaune #FFBE3B, arrondi, au texte foncé et lisible. Recharge la page des réglages : les valeurs sont gardées.

Compte rendu à me donner : la couleur du bouton, celle de son texte (choisie par toi ou par Stripe), le fond et la forme, relus après rechargement. Ni clé, ni identifiant.
```

Compte rendu du 15 octobre : bouton #FFBE3B, texte choisi par Stripe (aucun réglage), foncé et lisible ; fond #F4F8FF, forme « Ronde », police système ; « Utiliser les couleurs de la marque » reste décoché.

## 2. Stripe — les produits et les huit prix

Premier essai le 15 octobre, arrêté avant la création : sans Stripe Tax, le formulaire des prix ne propose pas « Inclure les taxes dans le prix ». Décision : les prix sont créés sans comportement fiscal (« non spécifié »), rien ne s'ajoute au prix, et le code n'exige plus « taxe incluse » (voir « À savoir » en haut). Ce prompt est la version réécrite.

```
Tu m'aides à créer les produits et les prix de PULSACITY dans Stripe, dans le bac à sable « PULSACITY » (l'environnement de test des prompts précédents, bandeau « Environnement de test » visible). Je suis connecté.

Où : https://dashboard.stripe.com/ › « Catalogue de produits » (« Product catalog »). Vérifie d'abord que tu es bien dans le bac à sable.

Ce qu'il ne faut surtout pas toucher : le mode réel, l'activation du compte, les clés API, les webhooks, les réglages du compte, Stripe Tax (ne clique sur aucun « Démarrer » ni « Configurer Stripe Tax », même si un formulaire le propose).

Avant de commencer : si un formulaire de produit est resté ouvert d'un essai précédent, ferme-le sans l'enregistrer. Si le catalogue contient déjà un produit ou un prix PULSACITY, ne crée rien : arrête-toi et dis-moi ce qu'il contient.

Deux produits, quatre prix chacun. Tous les prix : récurrents, en EUR, « Tarif fixe » (« Flat rate »), à l'unité. Pas de comportement fiscal à choisir : sans Stripe Tax, le formulaire n'en propose pas, et c'est voulu. Si un champ « Inclure les taxes dans le prix » ou « Comportement fiscal » apparaît quand même, choisis « Oui » / « Taxe incluse » (« Inclusive »), jamais « Non » / « Taxe exclue » (« Exclusive »).

Pour chaque prix, ouvre les options avancées (« Avancées » ou « Plus d'options ») et remplis la « Clé de recherche » (« Lookup key ») et la « Description du tarif » (« Price description ») exactement comme ci-dessous. Une faute dans une clé de recherche empêche le paiement : recopie-les caractère par caractère, en minuscules, avec les tirets bas.

Méthode : crée chaque produit avec son premier prix (celui marqué « par défaut »), puis, sur la page du produit, ajoute les trois autres un par un (« Ajouter un autre tarif » / « Add another price »).

Produit 1
- Nom : PULSACITY Essentiel
- Description : Témoignages, demandes automatiques et widgets illimités.
- Prix :
  | Montant | Période | Clé de recherche | Description du tarif |
  | 9,99 € | Mensuelle | essentiel_monthly_founder | Essentiel mensuel, prix de lancement |
  | 99,00 € | Annuelle | essentiel_yearly_founder | Essentiel annuel, prix de lancement |
  | 14,99 € | Mensuelle | essentiel_monthly_public | Essentiel mensuel |
  | 149,00 € | Annuelle | essentiel_yearly_public | Essentiel annuel |
- Prix par défaut du produit : 9,99 € mensuel (le premier, créé avec le produit).

Produit 2
- Nom : PULSACITY Pro
- Description : Tout Essentiel, et la mention « Propulsé par PULSACITY » retirable.
- Prix :
  | Montant | Période | Clé de recherche | Description du tarif |
  | 19,99 € | Mensuelle | pro_monthly_founder | Pro mensuel, prix de lancement |
  | 199,00 € | Annuelle | pro_yearly_founder | Pro annuel, prix de lancement |
  | 24,99 € | Mensuelle | pro_monthly_public | Pro mensuel |
  | 249,00 € | Annuelle | pro_yearly_public | Pro annuel |
- Prix par défaut du produit : 19,99 € mensuel (le premier, créé avec le produit).

Laisse vides : l'image du produit, le code fiscal (« tax code »), le libellé d'unité, les métadonnées. Pas d'essai gratuit (« free trial ») sur aucun prix.

Si la « Clé de recherche » n'apparaît pas à la création d'un prix, crée le prix, puis ajoute-la en modifiant le prix ; si elle n'existe nulle part, arrête-toi et dis-le-moi. Si Stripe refuse une clé (déjà utilisée), arrête-toi et dis-moi laquelle.

Vérification : dans le catalogue, chaque produit a ses quatre prix, actifs. Ouvre chacun des huit prix et relis son montant, sa devise, sa période, son comportement fiscal (« non spécifié » attendu, ou « taxe incluse ») et sa clé de recherche.

Compte rendu à me donner : pour chacun des huit prix, le montant, la période, le comportement fiscal affiché et la clé de recherche, relus sur la page du prix ; et le prix par défaut de chaque produit. Pas les identifiants (rien qui commence par price_ ou prod_).
```

Compte rendu du 15 octobre : les deux produits et leurs huit prix créés, actifs, en EUR, récurrents, tarif fixe, sans essai ; montants, périodes, clés de recherche et descriptions exactement ceux du tableau ; prix par défaut 9,99 € et 19,99 € par mois. La page d'un prix n'affiche pas le comportement fiscal : relu en lecture seule dans l'inspecteur du Workbench, « non spécifié » sur les huit. Aucun bandeau Stripe Tax cliqué.

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

Compte rendu du 15 octobre :
- Portail client enregistré : historique des factures ; e-mail, adresse de facturation et nom modifiables (le nom l'était déjà) ; téléphone et numéro fiscal désactivés ; moyens de paiement modifiables ; résiliation à la fin de la période (pas de prorata dans ce mode), avec les 8 motifs ; changement d'offre et de quantité désactivés ; pas d'option de pause dans ce portail ; titre « PULSACITY : votre abonnement et vos factures » ; redirection https://pulsacity.com/app/facturation ; lien de connexion désactivé. Aperçu : abonnement avec « Annuler l'abonnement », moyen de paiement, factures.
- Liens CGV et confidentialité du portail : ils viennent des informations publiques du compte, réservées au compte activé. « Aucun lien défini » en test ; ils passent aux prompts du mode réel.
- Relances : Smart Retries déjà à 8 tentatives en 2 semaines, puis annulation ; e-mails de carte refusée, de carte qui expire et de confirmation 3D Secure activés (Stripe a ajouté des rappels à 3, 5 et 7 jours).
- Lien de ces e-mails : un lien personnalisé vers https://pulsacity.com était en place. Le passage à la page hébergée par Stripe est irréversible et vaut pour tous les e-mails aux clients : l'agent s'est arrêté pour confirmation. Décision : on passe à la page hébergée par Stripe (prompt 3 bis). Le client y change sa carte, paie la facture restée ouverte ou confirme le 3D Secure, sans se connecter à PULSACITY ; l'accueil de pulsacity.com ne lui permettait rien de tout ça. On ne voudra jamais revenir en arrière : notre page renverrait de toute façon vers Stripe.
- Rappels de renouvellement aux clients : Stripe ne sait pas les limiter aux abonnements annuels, laissés désactivés. Essais gratuits inchangés.

## 3 bis. Stripe — le lien des e-mails vers la page hébergée par Stripe

```
Tu m'aides à changer un seul réglage des e-mails de Stripe pour PULSACITY, dans le bac à sable « PULSACITY » (environnement de test, bandeau « Environnement de test » visible). Je suis connecté.

Où : https://dashboard.stripe.com/ › Paramètres › Billing, là où tu as réglé les relances et les e-mails des paiements échoués au prompt précédent : le réglage du lien mis dans les e-mails aux clients (aujourd'hui un lien personnalisé vers https://pulsacity.com). Vérifie d'abord que tu es bien dans le bac à sable.

Ce qu'il ne faut surtout pas toucher : le mode réel, l'activation du compte, les informations publiques, les clés API, les produits et les prix, le portail client, les nouvelles tentatives (Smart Retries), les rappels de renouvellement, Stripe Tax.

1. Passe le lien des e-mails aux clients sur la page hébergée par Stripe (« Stripe-hosted page »). Stripe prévient que ce changement est irréversible et qu'il vaut pour tous les e-mails aux clients : je le confirme, c'est voulu. Accepte l'avertissement.
2. Vérifie que les e-mails de paiement par carte refusé, de carte qui expire et de confirmation 3D Secure (avec ses rappels) sont toujours activés.
Enregistre si Stripe le demande.

Vérification : recharge la page. Le lien des e-mails est la page hébergée par Stripe ; les trois e-mails sont activés ; les nouvelles tentatives restent à 8 en 2 semaines, puis annulation de l'abonnement. Si Stripe propose l'aperçu d'un e-mail de paiement refusé, ouvre-le : son bouton mène à une page de Stripe.

Compte rendu à me donner : le réglage du lien relu après rechargement, le texte exact de l'avertissement de Stripe, l'état des trois e-mails. Ni clé, ni identifiant.
```

Compte rendu du 15 octobre : « Lien vers une page hébergée par Stripe » coché ; « Utiliser un lien personnalisé » décoché. Avertissement accepté (« Confirmer le changement ») : « Vous passez d'une configuration de liens mixte à une méthode de mise à jour unique des paiements. Ce changement s'appliquera à toutes les communications des clients et est irréversible. » E-mails de carte refusée, de carte qui expire et de confirmation 3D Secure (rappels à 3, 5 et 7 jours) activés ; Smart Retries inchangées. L'aperçu de l'e-mail de carte refusée mène à une page de Stripe.

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

Compte rendu du 15 octobre : coupon « Bêta-testeur : Essentiel offert 3 mois », identifiant beta-essentiel-3-mois, 100 % pendant 3 mois, PULSACITY Essentiel seulement, sans limite de date ni d'utilisations. Code BETA-PULSACITY rattaché au coupon, actif, 0 sur 30 utilisations, première commande seulement, sans montant minimum, sans expiration, sans client particulier (relu dans l'inspecteur du Workbench).

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

Compte rendu du 15 octobre : STRIPE_SECRET_KEY ajoutée en Preview seulement, de type secret (valeur illisible), pour toutes les branches d'aperçu ; préfixe vu dans Stripe : « sk_test_ ». Le bouton « Redeploy » proposé par Vercel n'a pas été cliqué : le prompt 6 redéploie une fois les deux variables en place.

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
   - format des événements, si Stripe le demande : « Instantané » (« Snapshot »), l'événement complet. Jamais « Allégé » (« Thin ») ;
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
6. Stripe, Paramètres › Billing › « Abonnements et e-mails » (« Subscriptions and emails ») : cherche le réglage « Événements de renouvellement à venir » (« Upcoming renewal events »). Il règle quand Stripe envoie l'événement invoice.upcoming à PULSACITY, et n'envoie aucun e-mail aux clients. Mets-le à 7 jours avant. Ne confonds pas avec les « Rappels de renouvellement » envoyés par e-mail aux clients : ils restent désactivés. Ne change rien d'autre. Si le réglage n'existe pas, dis-le-moi.
7. Vercel, https://vercel.com/jawadboughalems-projects/pulsacity/deployments : ouvre le dernier déploiement de la branche claude/dreamy-edison-yk9c9a, menu « … » › « Redeploy » (garde les options par défaut). Attends l'état « Ready ». C'est indispensable : un déploiement ne lit que les variables qui existaient à sa construction.

Vérification :
- la destination Stripe montre l'adresse de l'aperçu (le secret, masqué ou non, à la fin), la version d'API et 20 événements ;
- Vercel montre STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET en Preview seulement ;
- le dernier déploiement de la branche est « Ready », construit après l'ajout des variables.

Compte rendu à me donner : la version d'API choisie, le format des événements, le nombre d'événements, le réglage des renouvellements à venir (trouvé ou non, valeur), les deux variables vues en Preview, l'heure du déploiement « Ready ». Jamais un secret, ni l'adresse complète avec son secret, ni un identifiant (we_, whsec_, acct_).
```

Compte rendu du 15 octobre : destination « PULSACITY recette (aperçu de la PR 40) » active, événements de « Votre compte », version 2026-09-30.endive, format « Instantané », 20 événements, secret de Vercel à la fin de l'adresse. Renouvellements à venir : déjà à 7 jours ; rappels aux clients désactivés. STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET en Preview seulement, de type secret. Redéploiement de la branche « Ready » vers 20 h 56 (heure de Paris), construit après l'ajout des deux variables.

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

Compte rendu du 15 octobre : migration de recette verte (n° 40, 20 h 21, branche de la PR) ; « Recette demo space » n° 14 (compte A) et n° 15 (compte B), branche de la PR, plan free, verts.

Si « Recette demo space » échoue sur « tenant/user not found », réveillez d'abord la base de recette (prompt 0 bis de `lot-4-1-decisions.md`).

---

# Troisième phase — la recette, qui capture les vrais événements

Chaque paiement de test ci-dessous envoie ses événements à l'aperçu, qui les garde entiers dans `stripe_events`. Le prompt 12 les relève : ils deviennent les fixtures des tests, comme pour un connecteur (règle n° 1 de CLAUDE.md).

À savoir :
- Cartes de test de Stripe, avec une date d'expiration future (12/34), un CVC au choix (123) et un nom fictif (« Julie Test ») : 4242 4242 4242 4242 (réussite), 4000 0025 0000 3155 (3D Secure demandé), 4000 0000 0000 0002 (refusée), 4000 0000 0000 0341 (enregistrée, puis refusée au prélèvement suivant).
- Sur l'aperçu, chaque espace qui paie pour la première fois reçoit sa propre horloge de test Stripe (« Recette <adresse de l'espace> »). Le prompt 10 l'avance dans le temps pour voir la fin de la bêta, un renouvellement refusé et le retour au plan Gratuit, sans attendre. Stripe n'avance une horloge que de deux périodes à la fois : on avance en plusieurs fois.
- Compte A : la première adresse du prompt 7 (le parcours principal). Compte B : la seconde (carte refusée, 3D Secure, bêta-testeur).
- Connectez-vous vous-même à l'aperçu avec le lien reçu par e-mail ; l'agent ne lit pas vos e-mails.

## 8. Aperçu — compte A : payer, changer de plan, gérer, s'arrêter

Avant ce prompt : connectez-vous à l'aperçu avec l'adresse A.

```
Tu fais la recette de la page « Abonnement et factures » de PULSACITY sur l'aperçu de la PR #40, avec les cartes de test de Stripe. Je suis connecté avec le compte A.

Aperçu : https://pulsacity-git-claude-dreamy-edi-e47f0f-jawadboughalems-projects.vercel.app

Ne touche à rien d'autre que ce qui est demandé. N'utilise jamais une vraie carte. Note pour chaque point : OK, ou ce que tu vois à la place (texte exact), avec une capture d'écran.

1. Ouvre /tarifs. Les prix affichés sont 9,99 € par mois (Essentiel) et 19,99 € par mois (Pro), avec la ligne « Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois. » En Annuel : 99 € et 199 € par an.
2. Toujours en Mensuel, clique sur « Choisir Essentiel ». La page de paiement de Stripe (mode test) s'ouvre : « PULSACITY Essentiel », 9,99 € par mois, la carte comme seul moyen de paiement (Apple Pay ou Google Pay peuvent s'y ajouter, ce sont des cartes), un lien « Ajouter un code promotionnel », et sous le bouton « En vous abonnant, vous acceptez les conditions générales de vente de PULSACITY. » avec un lien vers /cgv (pas de case à cocher en mode test : elle arrive en mode réel). Relève tout ce qui y est écrit en français ou non.
3. Paie avec 4242 4242 4242 4242, 12/34, 123, nom « Julie Test », pays France, puis « S'abonner ».
4. De retour sur /app/facturation (attends jusqu'à 30 secondes, la page se met à jour seule) : bandeau vert « Bienvenue dans Essentiel. » ; « Plan Essentiel » avec le badge « Prix de lancement » ; 9,99 € par mois ; Paiement : Mensuel ; Prochaine échéance : la date dans un mois · 9,99 € ; Votre prix : « Prix de lancement : vous le gardez à vie, tant que votre abonnement continue. » ; bouton « Passer à l'annuel » et « 99 € par an : 2 mois offerts. » ; « Changer de plan » : « Votre plan » sur Essentiel, « Votre plan actuel » ; « Paiement et factures » avec « Gérer mon paiement et mes factures ».
   Puis, dans un autre onglet : Stripe (bac à sable « PULSACITY ») › Développeurs › « Webhooks » (ou Workbench › « Webhooks ») › la destination « PULSACITY recette (aperçu de la PR 40) » › ses livraisons (« Event deliveries »). Les événements des dernières minutes (checkout.session.completed, customer.subscription.created, invoice.paid…) sont livrés, réponse 200. Si une livraison a une autre réponse (401, 400, 500…), relève son code et le début du message, sans aucun secret, et arrête-toi là : la suite en dépend. Reviens ensuite à l'aperçu.
5. Le menu du compte (en bas à gauche) dit « Plan Essentiel ». Dans Widgets, « Créer un widget » est actif : clique dessus ; dans l'éditeur qui s'ouvre, choisis le type « Carrousel », puis reviens à la liste. Recommence avec le type « Badge ». Il y a trois widgets en tout : le mur, le carrousel, le badge.
6. Retour à /app/facturation. Clique sur « Passer à l'annuel » : une fenêtre « Passer à l'annuel le … ? » dit « Jusque-là, rien ne change. Ensuite, 99 € par an. ». Confirme. Bandeau « Le …, votre plan Essentiel passe au paiement annuel. » et dans la carte « Jusqu'au … » / « À partir du … ». Clique sur « Annuler ce changement » : le bandeau disparaît.
7. Dans « Changer de plan », en Mensuel, clique sur « Passer au plan Pro » : la fenêtre dit « Vous payez aujourd'hui … : la différence jusqu'au …, au prorata. Ensuite, 19,99 € par mois. » Relève le montant. Confirme. Bandeau « Bienvenue dans Pro. » ; « Plan Pro » 19,99 € ; une ligne « Mention « Propulsé par PULSACITY » ».
8. Clique sur « Passer au plan Essentiel » : fenêtre « Passer au plan Essentiel le … ? ». Confirme. Bandeau « Le …, votre espace passe du plan Pro au plan Essentiel. » avec « Jusque-là, vous gardez le Pro. Ensuite, la mention « Propulsé par PULSACITY » revient sous vos widgets. » ; dans la carte, « Jusqu'au … : Plan Pro · 19,99 € par mois » et « À partir du … : Plan Essentiel · 9,99 € par mois, prix de lancement gardé à vie ».
9. Clique sur « Gérer mon paiement et mes factures » : la page de Stripe montre la carte, les factures (Essentiel, puis le prorata de Pro), la résiliation, et AUCUN changement de plan. Ouvre une facture en PDF : relève l'émetteur (en test, « environnement de test PULSACITY » est attendu), le logo et ce qui est écrit sous les montants (taxe ou non). Reviens avec le lien de retour de Stripe.
10. Clique sur « Passer au plan Gratuit » (colonne Gratuit) : la page de résiliation de Stripe s'ouvre. Choisis un motif, confirme. De retour : bandeau « Votre plan Pro s'arrête le … » avec « Reprendre mon abonnement » ; Prochaine échéance : « Aucune : l'abonnement s'arrête le … ». Le changement vers Essentiel programmé au point 8 n'apparaît plus.
11. Clique sur « Reprendre mon abonnement » : le bandeau disparaît ; Plan Pro, Prochaine échéance revenue.
12. Ouvre l'accueil de l'espace (/app) : aucun bandeau de paiement.

Compte rendu à me donner : chaque point (OK ou l'écart exact), le montant du point 7, ce que dit la facture PDF, et l'heure du paiement du point 3. Aucune donnée de carte, aucun identifiant Stripe (rien qui commence par cus_, sub_, in_, pi_, cs_).
```

Compte rendu du 16 octobre : les 12 points OK, 29 captures (gardées hors du dépôt : elles montrent une adresse e-mail). Toutes les livraisons du webhook ont répondu 200, du premier paiement à la fin. Paiement à 14 h 40 (heure de Paris), prochaine échéance le 16 novembre · 9,99 € ; passage au Pro : « Vous payez aujourd'hui 10 € », facture de 10,00 € (19,99 € moins 9,99 € non utilisés). Plan inférieur programmé, résiliation et reprise conformes. Écarts, tous dans les pages de Stripe, rien à changer chez nous :
- Link est proposé à côté de la carte et d'Apple Pay : c'est le portefeuille de cartes de Stripe, il paie par carte. Gardé.
- Le bouton dit « Payer et s'abonner » ; la phrase des CGV est au-dessus, suivie de la phrase de Stripe « En vous abonnant, vous autorisez environnement de test PULSACITY à vous débiter… » (le nom public viendra avec l'activation).
- La page annuelle n'a pas « Ajouter un code promotionnel » : voulu (le code des bêta-testeurs ne vaut que pour Essentiel mensuel).
- Portail : « mis à jour le16 novembre » sans espace, et « Reason » en anglais dans le menu des motifs de résiliation ; facture : « après le 16 Oct 2026 » dans les lignes de prorata. Textes de Stripe.
- Facture : émetteur « environnement de test PULSACITY », aucune ligne de taxe, aucune mention sous les montants. Le pied de page (textes de 2.7) se règle avec le mode réel.
- Le PDF de la facture s'est téléchargé sans être ouvert : non relu.

## 9. Aperçu — compte B : carte refusée, puis bêta-testeur avec 3D Secure

Le 16 octobre, arrêté au point 1 : la session de l'aperçu était encore celle du compte A (plan Pro), pas celle du compte B. Le prompt 10 n'a donc trouvé ni client, ni abonnement, ni horloge pour B, et s'est arrêté sans rien avancer. Ce n'est pas un défaut du code. Le fondateur a décidé, le 18 octobre, de ne pas reprendre les prompts 9, 10 et 11 (voir « Recette arrêtée » en fin de fichier).

Avant ce prompt : déconnectez-vous du compte A, puis connectez-vous à l'aperçu avec l'adresse B.

```
Tu fais la recette du paiement refusé et du code des bêta-testeurs de PULSACITY sur l'aperçu de la PR #40. Je suis connecté avec le compte B.

Aperçu : https://pulsacity-git-claude-dreamy-edi-e47f0f-jawadboughalems-projects.vercel.app

N'utilise jamais une vraie carte. Note pour chaque point : OK, ou ce que tu vois à la place (texte exact), avec une capture d'écran.

1. Ouvre /app/facturation : « Plan Gratuit », 0 € pour toujours, trois jauges (Témoignages validés, Demandes automatiques ce mois, Widgets « 1 sur 1 » et « Limite atteinte »), « Paiement et factures » : « Aucun paiement pour l'instant. Vos factures apparaîtront ici dès votre premier paiement. »
2. En Annuel, clique sur « Passer au plan Essentiel » : la page de Stripe montre 99 € par an et AUCUN lien « Ajouter un code promotionnel ». Reviens avec la flèche de retour de Stripe (en haut à gauche) : bandeau « Le paiement n'a pas été fait. » avec « Reprendre le paiement » ; toujours « Plan Gratuit ».
3. Repasse en Mensuel, clique sur « Passer au plan Essentiel ». Paie avec la carte refusée 4000 0000 0000 0002 (12/34, 123, « Julie Test », France) : Stripe dit que la carte est refusée. Relève le message. Reviens avec la flèche de retour : bandeau « Le paiement n'a pas été fait. ».
4. Clique sur « Reprendre le paiement » : la page de Stripe s'ouvre en Essentiel mensuel. Clique sur « Ajouter un code promotionnel », tape BETA-PULSACITY, applique : le total d'aujourd'hui passe à 0,00 €, et Stripe dit combien de temps (3 mois). Paie avec 4000 0025 0000 3155 (12/34, 123, « Julie Test », France). Une fenêtre de 3D Secure s'ouvre : clique sur « Complete » (ou « Autoriser »).
5. De retour sur /app/facturation (jusqu'à 30 secondes) : bandeau « Merci de tester PULSACITY. » avec « rien n'est prélevé avant le … » ; « Plan Essentiel » et le badge « Bêta-testeur » ; « Offert pendant 3 mois » ; Offert jusqu'au : une date dans trois mois ; Premier prélèvement : la même date · 9,99 € par mois, prix de lancement gardé à vie ; Carte enregistrée : Visa se terminant par 3155 ; « Nous vous écrivons le …, 7 jours avant le premier prélèvement. ».
6. Le menu du compte dit « Plan Essentiel ».

Compte rendu à me donner : chaque point, le message de refus du point 3, ce que Stripe dit du code au point 4, et les dates du point 5. Aucune donnée de carte, aucun identifiant Stripe.
```

## 10. Stripe puis l'aperçu — avancer le temps : fin de la bêta, renouvellement refusé, retour au Gratuit

Avant ce prompt : connectez-vous à Stripe ; ayez sous la main votre boîte de l'adresse B.

```
Tu m'aides à avancer le temps dans Stripe (environnement de test) pour faire la recette de PULSACITY sur l'aperçu de la PR #40. Je suis connecté à Stripe ; je me connecte moi-même à l'aperçu quand tu me le demandes.

Aperçu : https://pulsacity-git-claude-dreamy-edi-e47f0f-jawadboughalems-projects.vercel.app

Ce qu'il ne faut surtout pas toucher : le mode réel, les produits, les prix, le portail, le webhook, les réglages. Tu n'avances que les deux horloges des comptes A et B, jamais une autre.

Les horloges : Stripe › Billing › « Horloges de test » (« Test clocks »), ou Développeurs › « Horloges de test ». Chacune s'appelle « Recette julie-nutrition… » et porte un client ; ouvre-les pour savoir laquelle est celle du compte B (abonnement Essentiel avec la remise « Bêta-testeur ») et celle du compte A (abonnement Pro). Stripe n'avance une horloge que de deux mois à la fois : avance en plusieurs fois si besoin, et attends à chaque fois qu'elle soit « Prête » (« Ready »).

Compte B, la fin de la bêta :
1. Avance l'horloge du compte B jusqu'à 6 jours avant la date « Offert jusqu'au » relevée au prompt 9 (en deux fois). Attends 2 minutes.
2. Demande-moi de regarder la boîte de l'adresse B : un e-mail « Votre plan Essentiel devient payant le … » doit être arrivé (expéditeur PULSACITY), avec le jour, 9,99 €, la carte se terminant par 3155, et comment arrêter avant. Je te dis ce que je vois.
3. Avance l'horloge jusqu'au lendemain de la date « Offert jusqu'au ». Attends 2 minutes. Dans Stripe, la facture de ce jour-là est payée, 9,99 €.
4. Demande-moi de me connecter à l'aperçu avec le compte B et d'ouvrir /app/facturation : plus de bandeau « Merci de tester » ; « Plan Essentiel », badge « Prix de lancement », 9,99 € par mois, Prochaine échéance un mois plus tard · 9,99 €.

Compte A, un renouvellement refusé :
5. Demande-moi de me connecter à l'aperçu avec le compte A, d'ouvrir /app/facturation, « Gérer mon paiement et mes factures », et de remplacer la carte par 4000 0000 0000 0341 (12/34, 123), mise par défaut. Attends mon OK.
6. Avance l'horloge du compte A jusqu'au lendemain de la « Prochaine échéance ». Attends 2 minutes. Dans Stripe, la facture du renouvellement est « Échec » ou « Ouverte », l'abonnement « En retard » (« Past due »).
7. Demande-moi de recharger l'accueil de l'espace A (/app) : bandeau rouge « Votre dernier paiement a échoué. » « Mettez à jour votre carte pour garder le plan Pro. » avec « Mettre à jour ma carte » ; le même en haut de Témoignages et de Widgets. Sur /app/facturation : le même bandeau, et « Dernier paiement : … · 19,99 € · refusé par votre banque ». Le plan reste Pro.
8. Demande-moi de cliquer sur « Mettre à jour ma carte », de mettre 4242 4242 4242 4242 par défaut, puis de revenir. Si le bandeau reste, avance l'horloge de 3 jours (Stripe réessaie) et attends 2 minutes. Le bandeau disparaît partout ; Prochaine échéance revenue.

Compte A, le retour au plan Gratuit :
9. Demande-moi de cliquer sur « Passer au plan Gratuit », de confirmer la résiliation chez Stripe, puis de revenir : bandeau « Votre plan Pro s'arrête le … ».
10. Avance l'horloge du compte A jusqu'au lendemain de cette date. Attends 2 minutes.
11. Demande-moi de recharger /app/facturation : bandeau « Votre espace est repassé au plan Gratuit le … » : « Un widget reste affiché : « Mur · Toutes les offres ». Les 2 autres sont en pause… » avec « Choisir le widget affiché » ; « Plan Gratuit » ; jauge Widgets « 3 sur 1 » et « 1 affiché, 2 en pause » ; « Voir mes widgets » ; « Paiement et factures » : « Vos factures passées restent sur la page de paiement sécurisée de Stripe. » avec le bouton.
12. Puis Widgets : bandeau « Au plan Gratuit, un widget s'affiche. » ; le mur « Affiché » (« C'est le plus ancien : il reste affiché. »), les deux autres « En pause » avec « Afficher celui-ci à la place ». Demande-moi de cliquer sur « Afficher celui-ci à la place » sous le carrousel : le carrousel passe « Affiché », le mur « En pause ».
13. Demande-moi d'ouvrir le carrousel (« Modifier ») et de copier l'identifiant à la fin de son adresse (/app/widgets/<identifiant>), puis d'ouvrir <aperçu>/api/widget/<identifiant> : du JSON avec les témoignages. Même chose pour le mur : {"error":"not-found"}. La réponse est gardée une minute en cache : si l'une des deux montre encore l'ancien état, attends une minute et recharge deux fois.

Compte rendu à me donner : chaque point (OK ou l'écart exact), les dates avancées de chaque horloge, ce que dit l'e-mail du point 2. Aucun identifiant Stripe (clock_, cus_, sub_, in_), aucune adresse e-mail.
```

## 11. Aperçu — à 360 px

Avant ce prompt : connectez-vous à l'aperçu avec le compte A.

```
Tu vérifies à 360 px de large deux pages de PULSACITY sur l'aperçu de la PR #40. Je suis connecté.

Aperçu : https://pulsacity-git-claude-dreamy-edi-e47f0f-jawadboughalems-projects.vercel.app

1. Mets la fenêtre (ou l'outil de taille d'écran) à 360 × 800.
2. /app/facturation : un seul bandeau en haut, sous « ‹ Plus » et le titre ; les jauges l'une sous l'autre ; « Mensuel / Annuel » puis « Annuel : 2 mois offerts » dessous ; les trois colonnes l'une sous l'autre, le bouton avant la liste ; aucun défilement horizontal ; rien caché par la barre d'onglets en bas une fois en bas de page.
3. Touche « Annuel » puis « Mensuel » : les prix changent dans les trois colonnes.
4. /app/widgets : le bandeau, puis chaque widget avec son badge (« Affiché » ou « En pause »), sa phrase, « Afficher celui-ci à la place » sous les widgets en pause, et « Modifier » sur toute la largeur.
5. /tarifs : les boutons « Choisir Essentiel » et « Choisir Pro » sont sous chaque colonne, en Mensuel comme en Annuel.

Compte rendu à me donner : chaque point (OK ou l'écart exact), avec une capture d'écran de chaque page.
```

## 12. Supabase — relever les événements capturés

Avant ce prompt : connectez-vous à Supabase.

```
Tu m'aides à relever les événements Stripe reçus par l'aperçu de PULSACITY, sur la base de recette. Tu lances une seule requête, en lecture seule, et tu ne modifies rien.

Où : https://supabase.com/dashboard/projects, organisation PULSACITY, projet « pulsacity-recette » (jamais le projet « PULSACITY », la production), puis « SQL Editor ».

1. Ouvre un nouvel onglet de requête et colle exactement :

select type, count(*) as nombre,
       count(*) filter (where processed_at is not null) as traites,
       max(error) as une_erreur
from stripe_events
group by type
order by type;

2. Clique sur « Run ». Recopie le tableau en entier.
3. Ouvre un autre onglet de requête et colle exactement :

select id, type, received_at, payload
from stripe_events
order by received_at;

4. Clique sur « Run », puis sur « Export » (ou « Download ») › « CSV ». Dis-moi : « Le fichier est téléchargé : joignez-le à la conversation avec Claude Code. » Ne l'ouvre pas, ne recopie pas son contenu.

Ne touche surtout pas : aux tables, aux autres requêtes, aux réglages, au projet de production.

Compte rendu à me donner : le tableau du point 2, et le nom du fichier téléchargé.
```

Le fichier contient les adresses e-mail de test et des identifiants Stripe du mode test : il n'entre pas tel quel dans le dépôt. Claude Code en tire des fixtures anonymisées (`example.com`, identifiants remplacés), rangées avec leur description dans `docs-internes/connectors/stripe-billing.md`.

## 13. Supabase — la requête du seuil, sur la recette

```
Tu m'aides à vérifier une requête de PULSACITY sur la base de recette. Tu lances quatre requêtes, en lecture seule, et tu ne modifies rien.

Où : https://supabase.com/dashboard/projects, organisation PULSACITY, projet « pulsacity-recette » (jamais « PULSACITY »), puis « SQL Editor ».

Ouvre https://github.com/jawadboughalem/PULSACITY/blob/claude/dreamy-edison-yk9c9a/docs-internes/requetes/seuil-micro-entreprise.md : il contient quatre requêtes SQL, numérotées 1 à 4. Pour chacune, ouvre un onglet de requête, colle-la exactement, lance-la, et recopie le résultat.

Ne touche surtout pas : aux tables, aux réglages, au projet de production.

Compte rendu à me donner : les quatre résultats, recopiés. Ce ne sont que des nombres et des dates de test.
```

---

# Recette arrêtée le 18 octobre

Décision du fondateur : les prompts 9, 10 et 11 ne sont pas repris. Le prompt 8 a validé le parcours principal sur l'aperçu, avec le vrai Stripe (paiement, webhook, plan supérieur au prorata, plan inférieur programmé, portail, résiliation, reprise). Les prompts 12 et 13, deux relevés en lecture seule dans Supabase, sont réunis en un seul prompt (« 12 et 13 ») : ils vérifient ce que la page ne montre pas, chaque événement traité sans erreur et chaque paiement compté pour le seuil de la micro-entreprise, et donnent les vrais événements pour les fixtures.

Pas vu sur l'aperçu, couvert par les tests automatiques seulement :
- carte refusée et 3D Secure à la page de paiement ;
- code des bêta-testeurs, fin de la bêta et e-mail de rappel ;
- renouvellement refusé et bandeau « Votre dernier paiement a échoué » ;
- retour au plan Gratuit, widgets en pause, « Afficher celui-ci à la place » ;
- les écrans à 360 px (vérifiés dans le conteneur, à côté des maquettes).

## 12 et 13. Supabase — les événements reçus et la requête du seuil, en un prompt

Avant ce prompt : connectez-vous à Supabase. À la fin, joignez le fichier CSV à la conversation avec Claude Code : il contient vos adresses de test et des identifiants Stripe de test, anonymisés avant d'entrer dans le dépôt.

```
Tu m'aides à relever, en lecture seule, ce que l'aperçu de PULSACITY a enregistré dans la base de recette. Tu ne modifies rien.

Où : https://supabase.com/dashboard/projects, organisation PULSACITY, projet « pulsacity-recette » (jamais le projet « PULSACITY », la production), puis « SQL Editor ».

Ne touche surtout pas : aux tables, aux requêtes enregistrées, aux réglages, au projet de production. Ne lance que les requêtes ci-dessous, telles quelles.

1. Ouvre un nouvel onglet de requête et colle exactement :

select type, count(*) as nombre,
       count(*) filter (where processed_at is not null) as traites,
       max(error) as une_erreur
from stripe_events
group by type
order by type;

Clique sur « Run » et recopie le tableau en entier.

2. Ouvre un autre onglet de requête et colle exactement :

select id, type, received_at, payload
from stripe_events
order by received_at;

Clique sur « Run », puis sur « Export » (ou « Download ») › « CSV ». Dis-moi : « Le fichier est téléchargé : joignez-le à la conversation avec Claude Code. » Ne l'ouvre pas, ne recopie pas son contenu.

3. Ouvre https://github.com/jawadboughalem/PULSACITY/blob/claude/dreamy-edison-yk9c9a/docs-internes/requetes/seuil-micro-entreprise.md : il contient quatre requêtes SQL, numérotées 1 à 4. Pour chacune, ouvre un onglet de requête dans Supabase, colle-la exactement, lance-la et recopie le résultat.

Compte rendu à me donner : le tableau du point 1, le nom du fichier du point 2, les quatre résultats du point 3. Ce ne sont que des types d'événements, des nombres et des dates de test.
```

Compte rendu du 18 octobre, sur « pulsacity-recette » seulement : 20 événements, tous traités, aucune erreur (le détail par type est dans `docs-internes/connectors/stripe-billing.md`). Seuil : 1 client payant ; 1 mois de suite (2026-10) ; 19,99 € en 2 paiements, le premier le 16 octobre à 12 h 36 UTC ; 0 carte de bêta-testeur. Le fichier CSV a donné les fixtures anonymisées de `src/lib/billing/__fixtures__/` ; il n'entre pas dans le dépôt. L'éditeur SQL de Supabase a gardé de lui-même une requête privée « Untitled query » : sans effet, à supprimer quand on veut.

En mode réel, les cartes de test et les horloges n'existent plus. La vérification de production du lot (après le passage en mode réel) prendra le code des bêta-testeurs avec une vraie carte, à 0 € ce jour-là, puis l'arrêtera aussitôt : rien n'est prélevé.

