# Le jour où ça marche : l'entreprise et les paiements

Ces prompts attendent le seuil fixé en 1.3 : par exemple, dix créateurs inscrits à « Me prévenir à l'ouverture », ou des créateurs actifs qui butent sur les limites du plan Gratuit. Le nombre d'inscrits se lit grâce au lot 4.5.

Comptez deux à quatre semaines entre ce jour et le premier paiement : le SIREN prend du temps, et Stripe vérifie le compte. Lancez 6.1 dès que le seuil approche.

| N° | Quoi | Qui |
| --- | --- | --- |
| 6.1 | Le statut, la TVA et les démarches | Claude Chat |
| 6.2 | L'immatriculation | Vous, guidé par Claude Chat |
| 6.3 | Le compte bancaire | Vous, aidé par Claude Chat |
| 6.4 | Le régime de TVA, confirmé par écrit | Claude Chat prépare, vous envoyez |
| 6.5 | Le compte Stripe : ouverture, réglages, activation | Vous, puis Claude in Chrome |
| 6.6 | Le lot « Encaisser » | Claude Code |
| 6.7 | La relecture des CGV par un juriste | Claude Chat prépare, un juriste relit |

---

## 6.1 Le statut, la TVA et les démarches

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation.

```
Prompt 6.1 — Créer l'entreprise de PULSACITY.

Contexte : PULSACITY tourne gratuitement depuis son lancement (comptes rendus des fichiers du projet). Le seuil d'ouverture des abonnements est atteint : [le chiffre]. Je veux encaisser le plus tôt possible, légalement, au moindre coût. J'envisage la micro-entreprise.

Commence par me poser, en une seule liste, les questions dont tu as besoin sur ma situation (contrat de travail, autre activité, aides possibles, revenu fiscal de référence, chiffre d'affaires espéré, adresse à afficher ou non). Attends mes réponses.

Puis, avec les règles en vigueur à la date d'aujourd'hui :
1. Le statut : micro-entreprise, entreprise individuelle au réel, EURL ou SASU, pour mon cas. Recommandes-en un.
2. L'activité : commerciale (BIC) ou libérale (BNC) pour des abonnements à un logiciel en ligne, le code APE (58.29C, 62.01Z ou 63.11Z), les taux de cotisations et de versement libératoire, le plafond de chiffre d'affaires.
3. La TVA : franchise en base et ses seuils ; ventes aux entreprises de l'Union (autoliquidation, numéro de TVA intracommunautaire même en franchise) ; aux particuliers de l'Union (seuil de 10 000 €, OSS) ; à la Suisse et au Canada. La mention exacte des factures et des pages légales.
4. Les aides et les charges : ACRE, CFE, assurance responsabilité civile professionnelle, compte bancaire dédié.
5. L'adresse et le téléphone à publier, et les options les moins chères pour ne pas afficher mon domicile.
6. Le nom commercial « PULSACITY », les mentions « EI », et le dépôt de la marque à l'INPI.
7. Les factures : mentions obligatoires entre professionnels (pénalités de retard, indemnité de 40 €), et si celles de Stripe Billing suffisent.
8. La facturation électronique : ce qu'elle impose à une micro-entreprise, et les plateformes agréées gratuites.
9. Ce qui change pour le RGPD et les textes légaux en passant d'un particulier à une entreprise.
10. Les démarches dans l'ordre, chacune avec son site officiel, son coût et son délai, jusqu'au premier paiement reçu. Mets-moi en garde contre les sites payants qui imitent les démarches gratuites.

Termine par ta recommandation en cinq lignes, ce qui mérite un professionnel, et le « Compte rendu pour Claude Code » : statut, activité et code APE, régime de TVA et mention exacte, mentions des factures et des pages légales (sans mes informations personnelles), facturation électronique, démarches dans l'ordre.
```

---

## 6.2 L'immatriculation

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation. La démarche se fait sur le guichet unique, formalites.entreprises.gouv.fr : elle est gratuite pour une micro-entreprise. Ne passez par aucun site intermédiaire payant.

```
Prompt 6.2 — Immatriculer mon entreprise, pas à pas.

Contexte : le compte rendu 6.1 fixe le statut, l'activité et le régime de TVA. Je fais moi-même chaque saisie sur formalites.entreprises.gouv.fr. Toi, tu me guides.

1. Avant de commencer : ce que je dois avoir sous la main, et les choix que je devrai faire, avec ta recommandation pour chacun (date de début, activité et code APE, nom commercial PULSACITY, adresse, versement libératoire, ACRE, TVA, déclaration mensuelle ou trimestrielle).
2. Puis guide-moi écran par écran : je te dis ce que je vois, tu me dis quoi choisir ou écrire, d'après la documentation officielle à jour.
3. Après l'envoi : les délais, le suivi, ce que je reçois (SIREN, avis de situation de l'INSEE), et ce que je fais aussitôt (compte URSSAF, espace professionnel impots.gouv.fr, CFE, facturation électronique).

Termine par le « Compte rendu pour Claude Code » : la date de dépôt, ce qui reste à recevoir et à faire. Ni nom, ni adresse, ni numéro.
```

---

## 6.3 Le compte bancaire

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation. Vous ouvrez le compte vous-même.

```
Prompt 6.3 — Choisir le compte bancaire de l'entreprise.

Contexte : compte rendu 6.1. Je cherche le compte le moins cher, gratuit si possible, pour recevoir les virements de Stripe et payer les services de PULSACITY.

1. La loi m'impose-t-elle un compte dédié, et lequel : un second compte personnel, ou un compte professionnel ?
2. Compare les offres gratuites ou à moins de 10 € par mois : conditions, IBAN français, carte, virements de Stripe, paiements en dollars et frais de change, export comptable, plateforme de facturation électronique incluse.
3. Recommande une offre, et la liste de ce que je dois préparer pour l'ouvrir.

Termine par le « Compte rendu pour Claude Code » : le type de compte choisi et la date d'ouverture prévue. Ni banque, ni IBAN.
```

---

## 6.4 Le régime de TVA, confirmé par écrit

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation. Le plus simple et gratuit : une question écrite à votre service des impôts des entreprises, par la messagerie de votre espace professionnel sur impots.gouv.fr.

```
Prompt 6.4 — Faire confirmer mon régime de TVA.

Contexte : comptes rendus 6.1 et 1.3. Je veux une réponse écrite et officielle sur mon régime de TVA avant de brancher les paiements.

1. Rédige la question pour mon service des impôts des entreprises, courte et précise : mon activité (abonnements à un logiciel en ligne, surtout à des professionnels, en France, dans l'Union et ailleurs), mon statut, mon chiffre d'affaires prévu, et les points à confirmer : franchise en base, numéro de TVA intracommunautaire pour les clients professionnels de l'Union, ventes aux particuliers de l'Union, mentions des factures.
2. Si je préfère un expert-comptable : le prix d'une consultation ponctuelle, et les questions pour un rendez-vous d'une heure.

Quand je reviens avec la réponse, explique-la, dis ce qu'elle change pour Stripe et pour la phrase sur la TVA de la page Tarifs, puis donne le « Compte rendu pour Claude Code » : le régime confirmé, par qui et quand, la mention exacte des factures, et ce que Stripe doit collecter.
```

---

## 6.5 Le compte Stripe

### 6.5 a — Ouvrir le compte (vous)

1. Créez d'abord l'adresse facturation@pulsacity.com, comme les trois autres (prompt 2.2, une adresse de plus).
2. Ouvrez le compte sur https://dashboard.stripe.com/register, avec cette adresse, et activez vous-même la double authentification. Le mode test est utilisable tout de suite : c'est lui que le lot 6.6 utilise d'abord.

### 6.5 b — Régler le compte, en mode test (Claude in Chrome)

Avant ce prompt :
- connectez-vous à Stripe ;
- téléchargez depuis le dépôt l'icône `public/icon-512.png` et le logo de la charte v2 ;
- préparez le pied de page des factures : les mentions du compte rendu 6.1, avec vos informations. Vous le collez vous-même dans Stripe, et il n'apparaît pas dans le compte rendu.

```
Tu m'aides à régler le compte Stripe de PULSACITY, en mode test. Je suis connecté. Tu ne crées ni produit, ni prix, ni webhook, ni clé : ce sera le lot suivant.

Où : https://dashboard.stripe.com/ . Vérifie d'abord que le mode test (environnement de test) est actif.

Ce qu'il ne faut surtout pas toucher : les clés API, les webhooks, les comptes bancaires, les informations d'identité et d'activation du compte, l'abonnement de Stripe lui-même.

1. Image de marque (Paramètres, « Image de marque ») : icône et logo avec les fichiers que je te donne ; couleur de marque et couleur d'accent : demande-les-moi (celles de la charte v2).
2. Informations publiques : nom public « PULSACITY », site https://pulsacity.com, e-mail d'assistance support@pulsacity.com, libellé sur les relevés bancaires « PULSACITY ». Laisse vides les champs que je ne t'ai pas donnés.
3. Liens légaux, là où Stripe les demande (portail client, pages de paiement) : conditions https://pulsacity.com/cgv, confidentialité https://pulsacity.com/confidentialite.
4. E-mails aux clients : reçus des paiements réussis et des remboursements activés ; langue française si le réglage existe.
5. Factures (Paramètres de Billing, « Factures ») : numérotation séquentielle à l'échelle du compte. Pour le pied de page, ouvre le champ et dis-moi : « Collez votre pied de page, puis dites-moi OK. » Attends mon OK, puis enregistre.
6. Vérifie : un aperçu de facture et de reçu montre le logo, les couleurs, le nom public et le pied de page.

Compte rendu à me donner : chaque réglage fait, et ce que tu n'as pas trouvé. Ni le pied de page, ni aucune clé, ni aucun identifiant de compte.
```

### 6.5 c — Activer le compte (vous)

L'activation demande vos informations, votre SIREN et votre IBAN, et Stripe vérifie le site : mentions légales, CGV, contact et prix doivent y être complets. Faites-la quand le lot 6.6 a remis les CGV en ligne sur l'aperçu, juste avant son passage en mode réel.

---

## 6.6 Le lot « Encaisser »

Où : une nouvelle session Claude Code, comme les lots de l'étape 4 (« Pour chaque lot » de `prompts-4-construire.md`).

```
Lot 6.6 — Encaisser : abonnements, CGV, entreprise.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). L'entreprise existe. Je te joins les comptes rendus 6.1 et 6.4, et la note du lot 4.5 sur ce que Stripe change. Les maquettes v2 de « Mon abonnement », états du jour des abonnements, sont dans docs-internes/design-v2/. Le compte Stripe est réglé en mode test (6.5 b).

À faire, en mode test d'abord :
1. Mes actions sur Stripe, en prompts Claude in Chrome, avec les valeurs exactes : produits et prix (TVA comprise, mêmes montants que plans.ts), portail client, relances des paiements échoués, Stripe Tax selon le régime, webhook vers l'aperçu (protégé par Vercel Authentication : prévois le contournement que Vercel propose pour l'automatisation), variables d'environnement (je copie et colle les secrets moi-même).
2. Le paiement par Stripe Checkout, depuis /app/facturation et depuis /tarifs, avec le retour sur chaque état de la maquette.
3. /api/stripe/webhook : signature vérifiée, idempotence par stripe_events, plan de l'espace mis à jour. Les vrais événements du mode test sont d'abord capturés, puis transformés en fixtures, comme pour un connecteur.
4. /app/facturation : changer de plan, le portail Stripe, le bandeau de paiement échoué dans tout l'espace, la règle du plan inférieur (rien n'est jamais supprimé), et les plans offerts du lot 4.5, qui ne sont pas écrasés.
5. La suppression de l'espace (lot 4.3) arrête l'abonnement.
6. Les textes : les CGV remises en ligne avec le régime de TVA et les corrections de 6.7 ; les mentions légales et la politique de confidentialité de l'entreprise (mes informations par les variables Vercel) ; la question sur la TVA de /tarifs ; les plans « Bientôt » deviennent achetables.
7. L'annonce : l'e-mail aux inscrits de « Me prévenir à l'ouverture », un seul, puis leur liste supprimée.
8. Le passage en mode réel, en prompts, quand Vercel est en Pro (je m'abonne) et que le compte Stripe est activé (6.5 c) : produits et prix réels, webhook de production, variables de production, puis un vrai paiement de ma part, remboursé ensuite.

Checklist :
- tests des événements : création, renouvellement, échec, résiliation, changement de plan, doublon ;
- plans.ts reste la seule source des limites ; le lien entre prix Stripe et plan est testé ;
- recette avec les cartes de test de Stripe : réussite, 3D Secure, refus.
```

---

## 6.7 La relecture des CGV par un juriste

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation, puis un juriste. Conseillée avant le premier abonnement réel : les CGV engagent l'entreprise. Remplacez la ligne entre crochets par les CGV et les CGU, depuis le dépôt (`src/content/legal/`) ou l'aperçu du lot 6.6.

```
Prompt 6.7 — Préparer la relecture des CGV.

Contexte : comptes rendus 6.1 et 6.4. Voici les CGV et les CGU de PULSACITY, qui passe d'un service gratuit à des abonnements payants.

[Les CGV et les CGU.]

1. Relis-les comme un avocat spécialisé dans les logiciels en ligne : mentions obligatoires du Code de commerce (dont pénalités de retard et indemnité de 40 €), prix TVA comprise, renouvellement, résiliation, changement de plan (règle de 1.3), défaut de paiement, évolution des prix, droit de rétractation des professionnels de cinq salariés au plus (article L221-3 du Code de la consommation) et médiateur, plafond de responsabilité, tribunal compétent face à des clients qui ne sont pas commerçants. Pour chaque point : ce qui va, ce qui manque, ce qui est risqué, et la rédaction proposée.
2. Les questions à poser au juriste, par ordre d'importance.
3. Les options pour la relecture (avocat spécialisé au forfait, services juridiques en ligne, consultations gratuites), avec leurs prix vérifiés, et ta recommandation.

Termine par le « Compte rendu pour Claude Code » : les corrections à faire, les rédactions proposées, et ce qui attend le juriste.
```
