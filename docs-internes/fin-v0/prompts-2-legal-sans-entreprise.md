# Étape 2 : le légal et Stripe, sans entreprise

Stratégie du 12 octobre : PULSACITY encaisse dès la V0, en tant que particulier. La micro-entreprise se crée au seuil de `seuil-micro-entreprise.md` (prompts 6.1 à 6.7).

| N° | Quoi | Qui | Quand |
| --- | --- | --- | --- |
| K | La domiciliation Kandbaz : la garder ou la résilier | Claude in Chrome | En premier |
| 2.2 | L'adresse e-mail | Fait : contact@pulsacity.com, redirection OVH | — |
| 2.4 | Les contrats de traitement des prestataires | Claude in Chrome | Avant le lot 4.9 |
| 2.7 | La relecture des textes légaux | Claude Chat | Après 2.4 |
| 2.6 | Les informations des textes légaux | Vous, vers Claude Code | Au début du lot 4.9 |
| 2.8 | Le compte Stripe : ouverture, réglages, activation | Vous, puis Claude in Chrome | Ouverture et réglages avant le lot 4.5 ; activation après les lots 4.4 et 4.9 |

Les prompts Claude Chat se lancent dans le projet « PULSACITY — Stratégie » (prompt 0). Les prompts Claude in Chrome, dans le groupe d'onglets « PULSACITY », après vous être connecté vous-même au service.

Une seule adresse sert à tout : contact@pulsacity.com (contact, aide, données personnelles, facturation).

Ce que deviennent les textes légaux :

| Texte | Sort |
| --- | --- |
| Mentions légales | Celles d'un vendeur particulier : nom et e-mail, et l'hébergeur ; ni adresse ni téléphone (décision du 21 octobre) |
| CGV | Gardées et publiées : celles d'un vendeur particulier, sans TVA |
| CGU, avec l'annexe de sous-traitance RGPD | Gardées |
| Politique de confidentialité, cookies compris | Gardée : le RGPD s'applique aussi à un particulier |
| Contact | `/aide` (lot 4.4), et contact@pulsacity.com |

2.7 confirme ou corrige ce tableau et réécrit les textes ; le lot 4.9 les met en ligne. Le prompt 1.1 n'a pas été lancé : 2.7 reprend ses questions sur les textes, et l'ouverture du compte Stripe (2.8 a) montre ce que Stripe demande à un particulier.

---

## K. La domiciliation Kandbaz : la garder ou la résilier

Où : Claude in Chrome. Avant ce prompt : connectez-vous vous-même à votre espace client Kandbaz.

Comme vous vendez, les mentions légales doivent donner une adresse. Sans domiciliation, ce sera la vôtre. Mais une domiciliation suppose en général une entreprise immatriculée. Le prompt vérifie d'abord ce que Kandbaz permet sans entreprise ; vous décidez ensuite.

```
Tu m'aides à décider du sort de mon contrat de domiciliation chez Kandbaz, souscrit pour une entreprise que je ne crée pas tout de suite : je vends d'abord en tant que particulier. Je suis connecté à mon espace client. Tu ne paies rien, tu n'acceptes aucune nouvelle offre, et tu n'envoies rien sans mon accord.

Où : mon espace client Kandbaz, ouvert dans ce groupe d'onglets.

1. L'état des lieux, sans rien changer : l'offre souscrite, la date de souscription, la date et le montant de chaque paiement, la durée d'engagement, la date de fin prévue, le renouvellement automatique ou non, et l'état du dossier (contrat signé ou non, adresse déjà attribuée, courrier déjà reçu).
2. Les règles : trouve les conditions générales de vente de Kandbaz (dans l'espace client ou sur kandbaz.com), et relève :
   - si la domiciliation peut servir à un particulier sans entreprise immatriculée, et dans quel délai ils exigent un justificatif d'immatriculation ;
   - si l'adresse peut être publiée dans les mentions légales d'un site ;
   - ce qu'elles disent de la rétractation, de la résiliation, du préavis et du remboursement.
   Cite les articles.
3. Dis-moi ce que tu en conclus, puis attends ma décision : garder, ou résilier.
4. Si je résilie :
   - si le paiement date de moins de 14 jours, le droit de rétractation d'un contrat conclu à distance peut s'appliquer : vérifie s'il est prévu ou exclu par leurs conditions ; sinon, la résiliation selon leurs conditions, et le remboursement de la période non utilisée si elles le permettent. Dis-moi ce que tu proposes de demander, et attends mon accord ;
   - si l'espace client a un bouton ou un formulaire de résiliation, remplis-le, montre-le-moi, et attends mon OK avant d'envoyer ;
   - sinon, rédige le message pour le service client, court et poli : mon contrat (numéro de client ou de contrat seulement), la demande, la date d'effet, le remboursement demandé et son fondement, et une demande de confirmation écrite. Je l'enverrai moi-même ;
   - si l'espace le permet, vérifie que le renouvellement automatique est arrêté.

Ne modifie ni mes coordonnées ni mon moyen de paiement, et ne supprime pas le compte avant la confirmation de la résiliation.

Compte rendu à me donner : l'offre, les dates (souscription, paiements, fin), ce que disent leurs conditions sur l'usage sans entreprise et sur la résiliation, la décision prise, ce qui a été demandé, et le remboursement attendu. Ni mes coordonnées, ni mon numéro de contrat, ni l'adresse de domiciliation.
```

---

## 2.4 Les contrats de traitement des prestataires

Où : Claude in Chrome. Avant ce prompt : connectez-vous vous-même à Vercel, Supabase, Resend et Cloudflare (et à Stripe s'il existe déjà).

Ce compte rendu complète les « [À COMPLÉTER : garantie retenue pour chaque prestataire] » de la politique de confidentialité et des CGU.

```
Tu m'aides à vérifier les contrats de traitement des données (DPA) des prestataires de PULSACITY, et les garanties de leurs transferts hors de l'Union européenne. Tu lis : tu ne changes aucun réglage, sauf l'acceptation d'un DPA quand je te la confirme.

Je suis connecté à Vercel, Supabase, Resend et Cloudflare dans ce groupe d'onglets, et à Stripe s'il existe déjà.

Pour chaque prestataire, dans cet ordre : Vercel (hébergement), Supabase (base de données), Resend (envoi des e-mails), Cloudflare (stockage des photos, R2), Stripe (paiements), OVHcloud (domaine et e-mails du fondateur) :
1. Trouve sa page officielle de DPA (« Data Processing Addendum », dans ses pages légales ou dans les réglages du compte). Dis-moi s'il s'applique de lui-même avec les conditions d'utilisation, ou s'il faut l'accepter ou le signer dans le compte. S'il faut l'accepter, montre-moi la page et attends mon accord : c'est moi qui décide.
2. Trouve sa garantie de transfert hors de l'Union : certification au Data Privacy Framework (vérifie l'inscription sur https://www.dataprivacyframework.gov/list, avec le nom exact de la société et la date de ta vérification), clauses contractuelles types de la Commission européenne, ou les deux.
3. Note où sont stockées les données de PULSACITY chez lui, d'après le tableau de bord, sans rien changer. Attendu : Francfort pour Vercel et Supabase, Europe de l'Ouest pour Cloudflare R2, Irlande (eu-west-1) pour Resend.
4. Note l'adresse de la liste de ses sous-traitants ultérieurs.

Ne touche à aucun réglage, aucune région, aucune clé, aucune facturation.

Compte rendu à me donner : un tableau avec, pour chaque prestataire, le nom exact de la société et son pays, ce qu'il traite, le lieu de stockage, le DPA (adresse ; s'applique de lui-même, ou accepté le …), la garantie de transfert (DPF avec la date de vérification ; clauses types), et l'adresse de la liste de ses sous-traitants. Aucun identifiant de compte, aucune clé.
```

---

## 2.7 La relecture des textes légaux

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation. Remplacez la ligne entre crochets par les quatre textes : copiez-les depuis les pages du site (`/mentions-legales`, `/cgu`, `/cgv`, `/confidentialite`).

Claude Chat réécrit les textes ; une relecture par un juriste reste conseillée, au plus tard le jour du seuil (6.7).

```
Prompt 2.7 — Relire les textes légaux d'un vendeur particulier.

Contexte : seuil-micro-entreprise.md, les décisions tarifs.md et positionnement.md (avis en ligne), et le compte rendu 2.4 (les prestataires). Le prompt 1.1 n'a pas été lancé : vérifie aussi, sources officielles à l'appui, ce qu'un vendeur particulier doit publier (nom, adresse, téléphone), comment il déclare ce qu'il encaisse, et la mention de TVA de ses reçus. Voici les quatre textes de PULSACITY, écrits pour une entreprise et encore en brouillon. Les passages « [À COMPLÉTER : …] » attendent une information ou une décision. Je vends des abonnements en tant que particulier, sans TVA, jusqu'au seuil où je créerai une micro-entreprise.

[Les quatre textes : mentions légales, CGU avec leur annexe de sous-traitance, CGV, politique de confidentialité.]

Réécris-les pour un vendeur particulier, au regard du droit français et européen en vigueur en octobre 2026. Pour chaque point : ce qui va, ce qui manque, ce qui est risqué, et la rédaction que tu proposes.

1. Les mentions légales d'un particulier qui vend en ligne (LCEN).
2. Les CGV : vendeur particulier, prix finaux sans TVA, prix fondateur, commande et paiement, renouvellement, résiliation, changement de plan (règles de tarifs.md), défaut de paiement, évolution des prix (la règle des hausses de tarifs.md), offre des bêta-testeurs, rétractation des professionnels de cinq salariés au plus (article L221-3 du Code de la consommation) et médiateur, ce qui se passera quand une micro-entreprise reprendra les abonnements.
3. Les CGU : objet, engagements du créateur, contenus, disponibilité, responsabilité d'un particulier et son plafond, fin du service et suppression des données, modification des conditions, droit applicable et tribunal compétent face à des clients qui ne sont pas commerçants.
4. L'annexe de sous-traitance (article 28 du RGPD), quand le sous-traitant est un particulier.
5. La politique de confidentialité : l'identité du responsable du traitement, les finalités, les bases légales, les durées de conservation, les destinataires et les transferts hors de l'Union (compte rendu 2.4), les droits, les deux cookies nécessaires.
6. Les avis en ligne. Les créateurs publient les avis de leurs clients avec nos widgets. Que demandent le Code de la consommation (article L111-7-2 et articles D111-16 et suivants) et la directive Omnibus à celui qui publie des avis : informations sur leur collecte et leur vérification, date de l'avis, traitement des avis négatifs ? Notre badge « 4,9/5 · 87 avis » est calculé sur les témoignages que le créateur a validés : est-ce un risque de pratique commerciale trompeuse, et que faut-il afficher ou changer ? Qui en porte la responsabilité, le créateur ou PULSACITY ?
7. Le droit à l'image et le consentement : photo et texte du client, retrait du consentement, ce que dit notre case de consentement.
8. Les e-mails de demande d'avis aux clients des créateurs : base légale, information, désinscription, adresse postale de l'expéditeur.

Puis le « Compte rendu pour Claude Code » : les quatre textes réécrits en entier, prêts à intégrer, avec des marques [INFO : …] là où une de mes informations personnelles doit apparaître, et la liste de ce qui changera le jour de la micro-entreprise.
```

---

## 2.6 Les informations des textes légaux

Où : vous, vers Claude Code, au début du lot 4.9.

Le dépôt est public et garde tout son historique. Votre nom apparaît dans les textes légaux, par une variable d'environnement que vous saisissez vous-même dans Vercel : le lot 4.9 vous donne le prompt. Il ne s'envoie pas à Claude Code. Votre adresse et votre téléphone ne sont publiés nulle part (décision du 21 octobre).

Remplissez ce modèle et envoyez-le à Claude Code, avec le compte rendu de 2.7 :

```
Informations pour les textes légaux (lot 4.9)

Vendeur et éditeur
- Qualité : vendeur particulier
- Nom commercial du service : PULSACITY
- Ce qui est publié : le nom seul (la valeur : Vercel)
- E-mail, pour tout : contact@pulsacity.com
- TVA : [mention d'après 2.7]

Confidentialité
- Délai de suppression après la fermeture d'un espace : [par exemple 30 jours]
- Durée maximale des adresses « Me prévenir » : [par exemple 12 mois]
- Garanties des prestataires : [tableau du compte rendu 2.4]
- Mesure d'audience : [outil retenu en 1.6, ou aucune]

CGU
- Plafond de responsabilité : [d'après 2.7]
- Tribunal compétent : [d'après 2.7]
- Durée de conservation des notifications des outils connectés : [par exemple 90 jours]

CGV
- Changements de plan et hausses de prix : docs-internes/decisions/tarifs.md
- Professionnels de cinq salariés au plus (article L221-3) : [d'après 2.7]
```

---

## 2.8 Le compte Stripe, en particulier

En trois temps. À l'ouverture du compte, Stripe montre ce qu'il demande à un particulier : notez-le pour 2.7.

### 2.8 a — Ouvrir le compte (vous)

Sur https://dashboard.stripe.com/register, avec l'adresse contact@pulsacity.com. Activez vous-même la double authentification. Le mode test est utilisable tout de suite : c'est lui que le lot 4.5 utilise.

### 2.8 b — Régler le compte, en mode test (Claude in Chrome)

Avant ce prompt :
- connectez-vous à Stripe ;
- téléchargez depuis le dépôt l'icône `public/icon-512.png` et le logo `docs-internes/identite-v2/assets/svg/pulsacity-logo.svg` (ou ceux de la charte v2 s'ils existent déjà) ;
- préparez le pied de page des reçus et des factures : les mentions de 2.7 (vendeur particulier, sans TVA), avec vos informations. Vous le collez vous-même dans Stripe, et il n'apparaît pas dans le compte rendu.

```
Tu m'aides à régler le compte Stripe de PULSACITY, en mode test. Je suis connecté. Tu ne crées ni produit, ni prix, ni webhook, ni clé : ce sera le lot suivant.

Où : https://dashboard.stripe.com/ . Vérifie d'abord que le mode test (environnement de test) est actif.

Ce qu'il ne faut surtout pas toucher : les clés API, les webhooks, les comptes bancaires, les informations d'identité et d'activation du compte, l'abonnement de Stripe lui-même.

1. Image de marque (Paramètres, « Image de marque ») : icône et logo avec les fichiers que je te donne ; couleur de marque et couleur d'accent : demande-les-moi (celles de la charte v2, ou Encre #16213E et Carmin #A3243B).
2. Informations publiques : nom public « PULSACITY », site https://pulsacity.com, e-mail d'assistance contact@pulsacity.com, libellé sur les relevés bancaires « PULSACITY ». Laisse vides les champs que je ne t'ai pas donnés.
3. Liens légaux, là où Stripe les demande (portail client, pages de paiement) : conditions https://pulsacity.com/cgv, confidentialité https://pulsacity.com/confidentialite.
4. E-mails aux clients : reçus des paiements réussis et des remboursements activés ; langue française si le réglage existe.
5. Factures (Paramètres de Billing, « Factures ») : numérotation séquentielle à l'échelle du compte. Pour le pied de page, ouvre le champ et dis-moi : « Collez votre pied de page, puis dites-moi OK. » Attends mon OK, puis enregistre.
6. Vérifie : un aperçu de facture et de reçu montre le logo, les couleurs, le nom public et le pied de page.

Compte rendu à me donner : chaque réglage fait, et ce que tu n'as pas trouvé. Ni le pied de page, ni aucune clé, ni aucun identifiant de compte.
```

### 2.8 c — Activer le compte (vous), plus tard

L'activation demande vos informations et votre IBAN, et Stripe vérifie le site : mentions légales, CGV, contact et prix doivent y être complets. Faites-la après les lots 4.4 (aide et contact) et 4.9 (légal), juste avant le passage en mode réel du lot 4.5.
