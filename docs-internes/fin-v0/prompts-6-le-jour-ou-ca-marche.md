# Le jour du seuil : créer la micro-entreprise

Ces prompts attendent le seuil de `seuil-micro-entreprise.md` : 5 clients payants, 3 mois de suite avec des paiements, ou 500 € encaissés, le premier atteint. Ce jour-là, ils passent avant tout autre lot.

Les abonnements continuent pendant la démarche. Comptez une à quatre semaines pour le SIREN.

| N° | Quoi | Qui |
| --- | --- | --- |
| 6.1 | Le statut, la TVA et les démarches | Claude Chat |
| 6.2 | L'immatriculation | Vous, guidé par Claude Chat |
| 6.3 | Le compte bancaire | Vous, aidé par Claude Chat |
| 6.4 | Le régime de TVA, confirmé par écrit | Claude Chat prépare, vous envoyez |
| 6.5 | Le compte Stripe passé au nom de l'entreprise | Vous, aidé par Claude in Chrome |
| 6.6 | Le lot « Passer à l'entreprise » | Claude Code |
| 6.7 | La relecture des CGV par un juriste | Claude Chat prépare, un juriste relit |

---

## 6.1 Le statut, la TVA et les démarches

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation.

```
Prompt 6.1 — Créer l'entreprise de PULSACITY.

Contexte : PULSACITY vend ses abonnements depuis son lancement ; j'encaisse en tant que particulier (compte rendu 1.1). Le seuil de seuil-micro-entreprise.md est atteint : [le repère atteint, et sa valeur]. Je veux passer en micro-entreprise vite, légalement, au moindre coût, sans gêner mes abonnés.

Commence par me poser, en une seule liste, les questions dont tu as besoin sur ma situation (contrat de travail, autre activité, aides possibles, revenu fiscal de référence, chiffre d'affaires de l'année, adresse à afficher ou non). Attends mes réponses.

Puis, avec les règles en vigueur à la date d'aujourd'hui :
1. Le statut : micro-entreprise, ou autre si mon cas le justifie. Recommandes-en un.
2. L'activité : commerciale (BIC) ou libérale (BNC) pour des abonnements à un logiciel en ligne, le code APE (58.29C, 62.01Z ou 63.11Z), les taux de cotisations et de versement libératoire, le plafond de chiffre d'affaires.
3. Ce que j'ai encaissé avant : comment le déclarer, et à partir de quelle date la micro-entreprise prend le relais.
4. La TVA : franchise en base et ses seuils ; ventes aux entreprises de l'Union (autoliquidation, numéro de TVA intracommunautaire même en franchise) ; aux particuliers de l'Union (seuil de 10 000 €, OSS) ; à la Suisse et au Canada. La mention exacte des factures et des pages légales.
5. Les aides et les charges : ACRE, CFE, assurance responsabilité civile professionnelle, compte bancaire dédié.
6. L'adresse et le téléphone à publier, et les options les moins chères pour ne pas afficher mon domicile.
7. Le nom commercial « PULSACITY », les mentions « EI », et le dépôt de la marque à l'INPI.
8. Les factures : mentions obligatoires entre professionnels (pénalités de retard, indemnité de 40 €), et si celles de Stripe Billing suffisent.
9. La facturation électronique : ce qu'elle impose à une micro-entreprise, et les plateformes agréées gratuites.
10. Les démarches dans l'ordre, chacune avec son site officiel, son coût et son délai. Mets-moi en garde contre les sites payants qui imitent les démarches gratuites.

Termine par ta recommandation en cinq lignes, ce qui mérite un professionnel, et le « Compte rendu pour Claude Code » : statut, activité et code APE, date de reprise des abonnements, régime de TVA et mention exacte, mentions des factures et des pages légales (sans mes informations personnelles), facturation électronique, démarches dans l'ordre.
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

Contexte : comptes rendus 6.1 et 1.3. Je veux une réponse écrite et officielle sur mon régime de TVA.

1. Rédige la question pour mon service des impôts des entreprises, courte et précise : mon activité (abonnements à un logiciel en ligne, surtout à des professionnels, en France, dans l'Union et ailleurs), mon statut, mon chiffre d'affaires, et les points à confirmer : franchise en base, numéro de TVA intracommunautaire pour les clients professionnels de l'Union, ventes aux particuliers de l'Union, mentions des factures.
2. Si je préfère un expert-comptable : le prix d'une consultation ponctuelle, et les questions pour un rendez-vous d'une heure.

Quand je reviens avec la réponse, explique-la, dis ce qu'elle change pour Stripe et pour la phrase sur la TVA de la page Tarifs, puis donne le « Compte rendu pour Claude Code » : le régime confirmé, par qui et quand, la mention exacte des factures, et ce que Stripe doit collecter.
```

---

## 6.5 Le compte Stripe passé au nom de l'entreprise

Où : Claude in Chrome, après le SIREN et l'ouverture du compte bancaire. Avant ce prompt : connectez-vous à Stripe.

```
Tu m'aides à passer le compte Stripe de PULSACITY, ouvert en tant que particulier, au nom de ma micro-entreprise, sans interrompre les abonnements. Je suis connecté. Tu ne changes rien sans mon accord, et tu ne touches ni aux clés, ni aux webhooks, ni aux produits.

Où : https://dashboard.stripe.com/ , mode réel.

1. Cherche dans les réglages du compte et dans l'aide officielle de Stripe comment changer le type d'activité (de particulier à entreprise individuelle) et ajouter le SIREN, et si les abonnements, les clients et les moyens de paiement sont gardés. Dis-moi ce que tu as trouvé, avec les liens, et attends mon accord.
2. Si le changement se fait en place : ouvre la page, et dis-moi quoi saisir à chaque champ. Je saisis moi-même mes informations, mon SIREN et mon nouvel IBAN.
3. Si Stripe impose un nouveau compte : arrête-toi et dis-le-moi. Le lot 6.6 préparera la migration.
4. Le pied de page des factures : dis-moi « Collez votre nouveau pied de page, puis dites-moi OK », attends, puis enregistre.

Compte rendu à me donner : la voie suivie (changement en place ou nouveau compte), ce qui a été modifié, ce que Stripe vérifie encore, et ce que tu n'as pas trouvé. Ni mes informations, ni aucun identifiant.
```

---

## 6.6 Le lot « Passer à l'entreprise »

Où : une nouvelle session Claude Code, comme les lots de l'étape 4 (« Pour chaque lot » de `prompts-4-construire.md`).

```
Lot 6.6 — Passer à l'entreprise.

Lis d'abord CLAUDE.md, docs-internes/etat.md, docs-internes/fin-v0/README.md et docs-internes/fin-v0/prompts-4-construire.md (« Pour chaque lot »). La micro-entreprise existe. Je te joins les comptes rendus 6.1, 6.4 et 6.5.

À faire :
1. Les textes : mentions légales et politique de confidentialité de l'entreprise (mes informations et le SIREN par les variables Vercel, avec le prompt pour les mettre à jour), CGV de l'entreprise (régime de TVA, mentions entre professionnels, corrections de 6.7), CGU. Les abonnés sont prévenus du changement de vendeur, par un e-mail, selon ce que 6.1 et 6.7 imposent.
2. La TVA : la question de /tarifs selon le régime ; si la TVA est collectée, Stripe Tax et les prix TVA comprise (`tax_behavior: "inclusive"`), en prompts Claude in Chrome.
3. Si 6.5 a imposé un nouveau compte Stripe : la migration des abonnements, sans double paiement, avec ses tests et sa recette.
4. CLAUDE.md et docs-internes/decision_tarifs.md à jour ; docs-internes/fin-v0/seuil-micro-entreprise.md marqué « atteint le … ».

Checklist : aucune donnée personnelle dans le dépôt ; les abonnements en cours continuent (recette sur un abonnement de test) ; liens internes et ancres vérifiés.
```

---

## 6.7 La relecture des CGV par un juriste

Où : Claude Chat, projet « PULSACITY — Stratégie », nouvelle conversation, puis un juriste. Remplacez la ligne entre crochets par les CGV et les CGU, depuis le site ou l'aperçu du lot 6.6.

```
Prompt 6.7 — Préparer la relecture des CGV.

Contexte : comptes rendus 6.1 et 6.4. Voici les CGV et les CGU de PULSACITY, qui passent d'un vendeur particulier à une micro-entreprise.

[Les CGV et les CGU.]

1. Relis-les comme un avocat spécialisé dans les logiciels en ligne : mentions obligatoires du Code de commerce (dont pénalités de retard et indemnité de 40 €), prix et TVA, renouvellement, résiliation, changement de plan (règle de 1.3), défaut de paiement, évolution des prix, droit de rétractation des professionnels de cinq salariés au plus (article L221-3 du Code de la consommation) et médiateur, plafond de responsabilité, tribunal compétent face à des clients qui ne sont pas commerçants, changement de vendeur pour les abonnés en cours. Pour chaque point : ce qui va, ce qui manque, ce qui est risqué, et la rédaction proposée.
2. Les questions à poser au juriste, par ordre d'importance.
3. Les options pour la relecture (avocat spécialisé au forfait, services juridiques en ligne, consultations gratuites), avec leurs prix vérifiés, et ta recommandation.

Termine par le « Compte rendu pour Claude Code » : les corrections à faire, les rédactions proposées, et ce qui attend le juriste.
```
