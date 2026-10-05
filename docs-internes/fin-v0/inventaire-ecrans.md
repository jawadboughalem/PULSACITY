# Inventaire des écrans

Établi le 5 octobre 2026 à partir du code en ligne (`main`) et de `docs-internes/maquettes/INDEX.md`. C'est la liste de contrôle des maquettes v2 :
- Claude Design dessine chaque ligne, avec chacun de ses états, à 1440 px et à 360 px ;
- le prompt 3.7 vérifie qu'il ne manque rien, dans les deux sens : aucun écran ni état en ligne sans maquette v2, aucune maquette v2 d'un écran ou d'un état qui n'existe pas (sauf les écrans à créer, partie 8).

La logique ne change pas : les états, les textes et les parcours décrits ici restent ceux d'aujourd'hui. La v2 change l'apparence.

## 1. Site public

| Écran | Adresse | États construits | Maquette v1 |
| --- | --- | --- | --- |
| Accueil | `/` | Page entière. Démo en quatre temps : vente, e-mail, avis, mur. Exemple de widget réel (badge, carrousel). Questions. | m7 (page et démo) |
| Tarifs | `/tarifs` | Mensuel, annuel. Comparatif : toutes les lignes sur ordinateur, un plan à la fois sur téléphone. Questions de facturation. | m8 |
| Intégrations | `/integrations` | Liste. « Dites-nous quel outil » : fermé, ouvert, nom refusé, trop d'envois, merci. | m21-01 |
| Intégration disponible | `/integrations/systeme-io` | Guide en six étapes et étape facultative, dessins de l'espace, questions. | m21-02 |
| Intégration « Bientôt » | `/integrations/stripe`, `/integrations/calendly` | « Me prévenir » : vide, adresse incomplète, trop de demandes, inscrit. « En attendant ». | m21-03 à 06 |
| Guides | `/guides` | Deux groupes, « Démarrer » et « Aller plus loin ». | m22-01 |
| Un guide | `/guides/[slug]` | Sommaire à droite sur ordinateur, replié sur téléphone, titre en cours marqué. | m22-02 |
| Pages légales | `/mentions-legales`, `/cgu`, `/cgv`, `/confidentialite` | Bandeau « Brouillon », sommaire « Sur cette page », champs « [À COMPLÉTER] ». | m23 : confidentialité seulement, les trois autres suivent sa mise en page |
| En-tête, pied de page, menu du téléphone | — | Menu ouvert sous un voile. | m7, m24 |
| Page introuvable, erreur | — | Introuvable, affichage impossible. | m14 |
| Images de partage | une par page | Titre de la page, logo. | **aucune** |

## 2. Connexion et démarrage

| Écran | Adresse | États construits | Maquette v1 |
| --- | --- | --- | --- |
| Inscription | `/inscription` | À remplir, lien envoyé, adresse incomplète, trop de demandes, envoi impossible, lien expiré. | m9 |
| Connexion | `/connexion` | Les mêmes états. | m9 |
| E-mail « Votre lien » | — | Ordinateur et téléphone. | m10 |
| Démarrage 1, l'espace | `/app/onboarding` | À remplir, adresse déjà prise, alerte de contraste de la couleur. | m11 |
| Démarrage 2, les formations | `/app/onboarding/formations` | Vide, liste, erreur. | m12 |

## 3. Espace du créateur

| Écran | Adresse | États construits | Maquette v1 |
| --- | --- | --- | --- |
| Coque de l'espace | — | Navigation de l'ordinateur, quatre onglets du téléphone, menu du compte, page « Plus » et déconnexion. | m4 (composants), m4-05 |
| Accueil | `/app` | Tableau de bord, premier jour (aucun témoignage), étapes de mise en route, résumé des demandes, limite du plan Gratuit atteinte. | m4-01, 04, 06 |
| Témoignages | `/app/temoignages` | Liste, filtres, pagination, menu d'une ligne, vide. | m4-02 |
| Fiche d'un témoignage | `/app/temoignages/[id]` | « Valider », « Masquer », « Mettre en avant », texte affiché (l'original gardé), suppression définitive, preuve du consentement (fichier texte). | m4-03 |
| Premier témoignage validé | — | Célébration. | c0-charte-12 |
| Ajouter un témoignage | `/app/temoignages/ajouter` | Vide, erreurs, envoi en cours. | m15 |
| Importer un CSV | `/app/temoignages/importer` | Choix du fichier, aperçu, rapport, limite du plan. | m16 |
| Offres | `/app/offres` | Liste, renommage, ajout, retrait, retrait impossible, vide. | m17 |
| Widgets | `/app/widgets` | Liste, plan Gratuit, vide. | m18 |
| Éditeur de widget | `/app/widgets/[id]` | Mur, carrousel, badge, thème sombre, filtre par offre, coins des cartes, code copié. Téléphone : réglages, aperçu, code copié, code envoyé par e-mail. | m6 |
| Coller dans Systeme.io | `/app/widgets/[id]/guide` | Guide pas à pas, sur téléphone. | m6-mobile-05 |
| Connecteurs | `/app/connecteurs` | Liste, « Bientôt », « Me prévenir », « Dites-nous quel outil ». | m5-01 |
| Un connecteur | `/app/connecteurs/systeme-io` | En attente, connecté, problème, clé différente, changer d'adresse et de clé, étape facultative des inscriptions, offres à associer. | m5-02 à 07 |
| Historique d'un connecteur | `/app/connecteurs/[connecteur]/historique` | Liste des ventes reçues et de leur traitement. | **aucune** |
| Demandes | `/app/demandes` | Chiffres du mois, filtre par statut, badges des statuts, actions par statut, « Corriger l'adresse », plan Gratuit plein, vide. | m19 |
| Demander un avis | `/app/demandes?demander=1` | Formulaire, confirmation, refus (déjà demandée, désinscrite, adresse invalide, plafond du jour), plan Gratuit plein, aucune offre. | m20 |

## 4. Pour les clients du créateur

| Écran | Adresse | États construits | Maquette v1 |
| --- | --- | --- | --- |
| Page de collecte | `/t/[espace]`, `/t/[espace]/[offre]` | Arrivée, saisie (clavier ouvert), consentement manquant, envoi réussi, lien expiré ou déjà utilisé. | m1 |
| Désinscription | `/desinscription` | Confirmée. | m1-06 |
| E-mails de demande et de relance | — | Demande, relance, version texte, aperçu dans la boîte de réception. | m3 |

## 5. E-mails au créateur

| E-mail | États | Maquette v1 |
| --- | --- | --- |
| « Votre lien » | — | m10 |
| Nouveau témoignage | Standard, plan Gratuit plein. | m13 |
| Code du widget, envoyé depuis le téléphone | — | **aucune** |

## 6. Widget, sur la page du créateur

| Type | États | Maquette v1 |
| --- | --- | --- |
| Mur | Clair, sombre, chargement. | m2 |
| Carrousel | Clair, sombre, chargement, flèche suivante. | m2 |
| Badge « 4,9/5 · 87 avis » | Clair, sombre, chargement. | m2 |
| « Propulsé par PULSACITY » | Sous chaque type. | m2 |

## 7. Ce qui n'a pas de maquette aujourd'hui

- L'historique d'un connecteur.
- L'e-mail « Code du widget ».
- Les images de partage.
- Les mentions légales, les CGU et les CGV : seule leur mise en page commune est dessinée (m23).
- À vérifier par Design en 3.7, faute de planche repérée : la fenêtre de suppression définitive d'un témoignage, la fenêtre « Corriger l'adresse », le résultat vide d'un filtre, les messages qui suivent une action (enregistré, copié, envoyé).

## 8. Écrans à créer

Ils sont dessinés en premier (prompt 3.3), car ils débloquent l'encaissement (lots 4.3 à 4.5). Les tables et colonnes nouvelles restent facultatives, compatibles avec le code en ligne.

### 8.1 Réglages — `/app/reglages`

Lien « Réglages » de la navigation et de « Plus ».

- **Votre espace** :
  - nom de l'espace (c'est aussi le nom d'expéditeur des e-mails aux clients) ;
  - logo : envoyer, remplacer, retirer ;
  - couleur d'accent, avec l'alerte de contraste de m11 ;
  - adresse publique de la page de collecte. À décider : figée, ou modifiable avec un avertissement (les liens déjà partagés ne marcheraient plus).
- **E-mails à vos clients** :
  - adresse de réponse ;
  - adresse postale de l'expéditeur, que la loi sur la prospection demande (question ouverte de `etat.md`, nouvelle colonne facultative) ;
  - aperçu de l'e-mail de demande.
  - Le délai d'envoi reste réglé par offre, dans Offres.
- **Vos notifications**, à décider : recevoir ou non l'e-mail « Nouveau témoignage ».
- **États** : enregistré, nom vide, adresse publique déjà prise, logo trop lourd ou d'un format refusé, contraste insuffisant, adresse de réponse invalide.

### 8.2 Mon compte

Lien « Mon compte » du menu du compte et de « Plus », qui mène aujourd'hui à `/app/reglages`. Proposition : une page à part, `/app/compte`. Réglages parle de l'espace ; Mon compte parle de la personne.

- **Adresse de connexion** : changement confirmé par un lien envoyé à la nouvelle adresse.
- **Prénom**, facultatif : l'accueil dit aujourd'hui « Bonjour » sans prénom (question ouverte de `etat.md`).
- **Appareils connectés** : se déconnecter partout ailleurs.
- **Exporter mes données** : un fichier avec l'espace, les offres, les clients, les ventes, les demandes, et les témoignages avec la preuve de leur consentement. États : préparation, prêt, échec.
- **Supprimer mon espace** :
  - ce qui disparaît : les témoignages, et les widgets des pages de vente ;
  - l'abonnement s'arrête ;
  - le délai de suppression est celui des CGU ; les factures sont gardées, comme la loi l'impose ;
  - confirmation en tapant le nom de l'espace.
  - États : fenêtre de confirmation, puis page « Votre espace est supprimé » après déconnexion.

### 8.3 Abonnement et factures — `/app/facturation`

Lien « Abonnement et factures » du menu du compte, et destination de chaque « Voir le plan Essentiel » et « Voir les plans ».

- **Votre plan** : nom, prix, mensuel ou annuel, prochaine échéance. Sur Gratuit, la consommation : témoignages validés (12/15), demandes du mois (18/20), widgets (1/1).
- **Changer de plan** :
  - les trois plans, plus compacts qu'en m8, avec Mensuel et Annuel ;
  - le plan actuel marqué ;
  - « Passer au plan Essentiel », « Passer au plan Pro », « Passer à l'annuel », vers le paiement Stripe.
- **Paiement et factures** : un bouton vers le portail Stripe (carte, adresse et numéro de TVA de facturation, factures en PDF, résiliation). À décider : une liste des dernières factures dans la page, ou le portail seul.
- **États** :
  - Gratuit, Essentiel mensuel, Pro annuel ;
  - retour du paiement réussi (« Bienvenue dans Essentiel ») ;
  - paiement en cours de confirmation ;
  - paiement abandonné ;
  - paiement échoué : bandeau dans tout l'espace, et ici ;
  - résiliation programmée (« Votre plan Essentiel s'arrête le 12 novembre », « Reprendre mon abonnement ») ;
  - passage à un plan inférieur programmé ;
  - code promotionnel ou prix de fondateur, si 1.3 le retient.
- **Passage à un plan inférieur** : règle à fixer avec 1.3 et 2.7 (champ « [À COMPLÉTER] » des CGV). Rien n'est jamais supprimé, mais il faut dire ce qui s'affiche au-delà des limites : widgets en trop, témoignages au-delà de 15, retour du badge.
- **E-mails de facturation** (reçu, paiement échoué, fin de période) : ceux de Stripe, aux couleurs de PULSACITY (prompt 2.8). Pas de maquette, sauf si 1.3 décide d'e-mails à nous.

### 8.4 Aide et contact — `/aide`

Lien « Aide et contact » du menu du compte. Page publique, dans la coque du site, ouverte aussi aux visiteurs sans espace.

- **Questions fréquentes par thème** : démarrer, connecteurs, demandes, widgets, abonnement, données personnelles. Avec des liens vers les guides.
- **« Écrivez-nous »** :
  - champs : adresse (déjà remplie quand on est connecté), sujet, message ;
  - protections des formulaires publics : champ piège, limite par adresse IP ;
  - le message part à l'adresse de support par e-mail, la réponse revient à l'expéditeur, rien n'est gardé en base.
  - États : vide, erreurs, envoyé (« Nous vous répondons sous deux jours ouvrés »), trop d'envois.
- **Liens qui y mèneront** :
  - « Contact » du pied de page, qui va aujourd'hui aux mentions légales : vers `/aide#contact` ;
  - « Écrivez-nous » de m21 et m22 ;
  - « Bloquée à une étape ? Écrivez-nous » du guide sur téléphone.

### 8.5 Le catalogue des connecteurs (décidé en 1.2)

- `/integrations` et `/app/connecteurs`, groupés par familles : disponibles d'abord, puis « Bientôt » avec « Me prévenir ».
- Une page publique par outil, comme `/integrations/stripe`.
- À décider par Design : un filtre par famille si la liste est longue ; les noms seuls, ou les logos des outils dans le respect des règles de chaque marque.
- **États** : disponible, bientôt, inscrit, « Dites-nous quel outil ».

### 8.6 La page d'accueil v2 (décidée en 1.5)

Sections et textes donnés par le compte rendu de 1.5. La démo en quatre temps et l'exemple de widget réel restent, redessinés.

### 8.7 Selon les décisions de 1.6, facultatif

- **Parrainage** (`/app/parrainage`) : le lien de l'espace, les créateurs venus par lui, la récompense.
- **Bandeau de consentement aux cookies** : seulement si un pixel publicitaire arrive (5.5).
- Pages « À propos » et « Nouveautés ».
- Plus tard : un tableau de bord d'administration pour le fondateur.

## 9. Liens morts en production aujourd'hui

| Lien | Où | Mène à |
| --- | --- | --- |
| « Réglages » | Navigation de l'espace, page « Plus » | `/app/reglages` |
| « Mon compte » | Menu du compte, page « Plus » | `/app/reglages` |
| « Abonnement et factures » | Menu du compte, page « Plus » | `/app/facturation` |
| « Aide et contact » | Menu du compte, page « Plus » | `/aide` |
| « Voir le plan Essentiel » | Accueil (limite atteinte), Widgets, Demandes, Demander un avis, import CSV | `/app/facturation` |
| « Voir les plans » | Widgets, éditeur de widget (retirer le badge) | `/app/facturation` |

Le lien « Contact » du pied de page fonctionne, mais l'adresse qu'il montre est encore « [À COMPLÉTER] ».
