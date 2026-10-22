# Lot 4.9 — Les textes légaux d'un vendeur particulier : vos actions et la recette

Adresse de l'aperçu (PR #48) : https://pulsacity-git-claude-legal-text-8e35c1-jawadboughalems-projects.vercel.app

Où en est chaque prompt (22 octobre) :
- Prompts 1 à 8 : faits les 21 et 22 octobre (comptes rendus sous chaque prompt). Le prompt 6 a donné le changement du 22 octobre : aucun nom, une voix d'équipe, aucune mention de l'absence d'entreprise. Le prompt 6 ci-dessous est réécrit pour revérifier les textes corrigés.
- Prompt 2 bis : Supabase — pourquoi la production est « Unhealthy » (lecture seule). À lancer quand vous voulez.
- Prompt 6 : à relancer sur l'aperçu, une fois son dernier déploiement « Ready » : les textes en voix d'équipe et l'aide de « Demander un avis ».
- Prompt 9 : fait le 22 octobre, `LEGAL_VALIDATED=true` en production, sans redéploiement.
- Prompt 9 bis : Vercel — retirer `LEGAL_PUBLISHER_NAME`, que plus rien ne lit.
- Puis vous fusionnez la PR #48, après votre validation des textes. La production se construit avec `LEGAL_VALIDATED=true` : les textes sont publiés tout de suite.
- Prompt 10 : vérification sur pulsacity.com, juste après la fusion.

**Attention, jusqu'à la fusion de la PR #48** : `LEGAL_VALIDATED` vaut déjà `true` en production. Un redéploiement de `main`, ou la fusion d'une autre PR avant la #48, publierait comme validés les anciens brouillons (ceux du 4 octobre, avec leurs « [À COMPLÉTER] ») et les ouvrirait aux moteurs de recherche. Ne redéployez rien et ne fusionnez rien d'autre avant la #48.

Décisions des 21 et 22 octobre : ni votre nom, ni votre adresse, ni votre téléphone ne sont publiés, nulle part. Les textes parlent au nom de « l'équipe PULSACITY » et ne disent rien de l'absence d'entreprise. Aucun prompt ne vous demande une information personnelle.

Une décision reste à prendre : **Vercel Pro** avant le premier paiement (le DPA de Vercel ne couvre pas Hobby). La politique de confidentialité dit « au plus 1 jour » de journaux : 1 heure en Hobby, 1 jour en Pro. Et une autre, avant les premiers clients : **les sauvegardes de la base** (Supabase Pro, 25 $ par mois, ou des sauvegardes faites par nous, lot 4.10) ; d'ici là, les textes n'en promettent aucune.

Deux adresses, à garder pour vous (jamais dans un compte rendu) :
- **A** : celle des recettes précédentes, l'espace « Julie Nutrition » de la recette ;
- **B** : une autre de vos adresses (un alias Gmail suffit), qui joue la cliente. Sa boîte de réception est ouverte dans un onglet du groupe « PULSACITY ».

Déjà vérifié par Claude Code dans son conteneur :
- les quatre textes à 360 et 1440 px, sans débordement ni erreur dans la console, en brouillon puis avec `LEGAL_VALIDATED=true` (ni bandeau ni `noindex`) ;
- aucun crochet de remplissage, ni sur le site, ni dans l'espace, ni dans les e-mails, ni dans le widget : un test le garde (`src/content/placeholder-brackets.test.ts`) ; aucun « exploitant », « personne physique », « immatriculée », « micro-entreprise » dans les textes publics : un autre test (`src/content/legal-voice.test.ts`) ;
- les prix et limites des CGV lus dans `plans.ts` ; liens internes et ancres (`#avis`, `#cookies`, `#destinataires`, `#contact`, `#sous-traitance`) par un test ;
- la page de collecte (demande et lien public) avec la nouvelle case et les deux aides, à 360 et 1440 px ;
- « Gérer mon avis » de bout en bout dans Chromium : avis enregistré, confirmation, « Garder mon avis », retrait, accord retiré, avis plus enregistré ; par des tests : l'avis, ses corrections et sa photo partent, rien d'un autre espace ni d'un lien pas encore répondu ;
- les pieds des e-mails (client : « … utilise PULSACITY … Vos données » ; créateur : « PULSACITY » seul) ;
- le rappel 7 jours avant un renouvellement annuel (CGV 5.2), par des tests : une fois par échéance, rien avant un paiement mensuel, une résiliation, un passage au mensuel ou au plan Gratuit ; il se verra en vrai au premier abonnement annuel ;
- `pnpm lint`, `pnpm typecheck`, `pnpm build` ; `pnpm test` vert, sauf `decode-csv-file.test.ts` (connu, propre au conteneur).

Relevés des prompts 1 à 4 : fonctions en FRA1 et adresse de Vercel (1) ; aucune sauvegarde sur l'offre Free de Supabase (2) ; facture « non recouvrable » après échec, pied « TVA non applicable, art. 293 B du CGI », rappel de renouvellement de Stripe laissé désactivé (il écrirait aussi chaque mois), événements de renouvellement à 7 jours (3) ; Umami Software, Inc., hors DPF, clauses contractuelles types 2021/914 (4). La purge à 90 jours des ventes déjà traitées est promise par les textes : elle se construit au lot 4.10, avant le 1er janvier 2027.

---

## 1. Vercel — votre nom, la région, l'offre, l'adresse de Vercel

Fait le 21 octobre. Depuis le 22 octobre, aucun nom n'est publié : la partie A (`LEGAL_PUBLISHER_NAME`) n'a plus lieu d'être, la variable se retire par le prompt 9 bis. Gardé pour l'historique.

```
Tu m'aides à préparer les textes légaux de PULSACITY sur Vercel. Je suis connecté à Vercel dans ce groupe d'onglets. Tu ne vois ni ne tapes mon nom : c'est moi qui le saisis. Tu ne touches à aucune autre variable, ni aux domaines, ni à la facturation, ni à la protection des déploiements, et tu ne redéploies rien.

Où : https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables

A. Mon nom
1. Clique « Add Environment Variable » (ou « Add New »). Écris le nom LEGAL_PUBLISHER_NAME. Coche les environnements Production et Preview, pas Development. Puis arrête-toi et dis-moi : « Tapez votre prénom et votre nom dans Value, puis dites-moi quand c'est fait. » Quand je te le dis, clique « Save ».
2. Vérification : la liste montre LEGAL_PUBLISHER_NAME en Production et Preview. N'ouvre pas sa valeur.

B. La région des fonctions et l'offre
3. Ouvre https://vercel.com/jawadboughalems-projects/pulsacity/deployments, le dernier déploiement de la branche claude/legal-texts-private-seller-049wke, onglet « Resources » ou « Functions » : relève la région indiquée pour les fonctions (attendu : fra1, Francfort).
4. Ouvre https://vercel.com/jawadboughalems-projects/pulsacity/settings/functions : relève la « Function Region » du réglage du projet, sans la changer.
5. Ouvre les réglages de l'équipe (« Settings » de jawadboughalems-projects, « Billing ») : relève l'offre (Hobby ou Pro), sans rien changer.

C. L'adresse de Vercel
6. Ouvre https://vercel.com/legal/privacy-notice : relève l'adresse postale de Vercel Inc. et l'adresse e-mail de contact, telles qu'écrites. Ne cherche pas de numéro de téléphone ailleurs : s'il n'y en a pas sur cette page, dis-le.

Compte rendu à me donner : le nom de la variable vu (sans sa valeur), les environnements cochés, la région des fonctions du déploiement et celle du réglage du projet, l'offre, l'adresse et le contact de Vercel Inc. Aucune information personnelle.
```

Compte rendu du 21 octobre : `LEGAL_PUBLISHER_NAME` créée, type « Config » (Vercel n'a plus de case « Sensitive »), en Production et Preview, pas en Development. Aucun redéploiement : le prochain envoi sur la branche reconstruit l'aperçu avec la variable ; la production la prendra à la fusion. Fonctions du dernier aperçu (d59885e) en FRA1 (Francfort) ; le réglage du projet indique cdg1, marqué « Overridden » par `vercel.json`. Offre Hobby. Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, United States ; aucun numéro de téléphone publié, contact privacy@vercel.com.

---

## 2. Supabase — l'offre et les sauvegardes de la production

À coller dans Claude in Chrome. Avant ce prompt : connectez-vous vous-même à Supabase.

```
Tu m'aides à vérifier ce que garde la base de production de PULSACITY. Tu lis seulement : tu ne changes rien, tu ne lances aucune requête, tu ne télécharges rien.

Où : https://supabase.com/dashboard, organisation PULSACITY, projet PULSACITY (la production, pas pulsacity-recette).

1. Relève l'offre de l'organisation (Free, Pro…) dans « Billing » ou « Usage ».
2. Ouvre « Database », puis « Backups » (ou « Platform › Backups ») : relève ce qui est écrit, mot pour mot : sauvegardes quotidiennes ou non, combien de jours, « Point in Time Recovery » ou non. Si la page dit que l'offre gratuite n'en a pas, recopie la phrase.
3. Relève la région du projet (attendu : eu-central-1, Francfort).

Ne touche à aucun réglage, aucune clé, aucune facturation.

Compte rendu à me donner : l'offre, le texte de la page des sauvegardes, la région. Aucun identifiant de projet, aucune clé.
```

Compte rendu du 22 octobre : offre Free ; « Free Plan does not include project backups. Upgrade to the Pro Plan for up to 7 days of scheduled backups. » ; « Point in Time Recovery is a Pro Plan add-on » ; « Last backup : No backups ». Région Central EU (Frankfurt). Statut « Unhealthy » : 111 requêtes Postgres, 111 erreurs (prompt 2 bis). Les textes ne promettent plus de sauvegardes.

---

## 2 bis. Supabase — pourquoi la production est « Unhealthy »

À coller dans Claude in Chrome. Avant ce prompt : connectez-vous vous-même à Supabase. L'application parle à la base par le pooler, jamais par l'API de Supabase. Une piste : des robots qui sondent l'API publique du projet ou tentent de se connecter à Postgres, sans rien obtenir (chaque table est protégée par RLS). Ce prompt cherche la cause, sans rien changer.

```
Tu m'aides à comprendre pourquoi la base de production de PULSACITY est marquée « Unhealthy ». Tu lis seulement : tu ne changes rien, tu ne lances aucune requête SQL, tu ne redémarres rien, tu ne mets rien en pause, tu ne touches à aucune clé ni à aucun réglage.

Où : https://supabase.com/dashboard, organisation PULSACITY, projet PULSACITY (la production, pas pulsacity-recette).

1. Sur la vue d'ensemble du projet, ouvre ou survole le statut « Unhealthy » : recopie mot pour mot ce qu'il dit, et le service qu'il vise (Database, Data API / PostgREST, Auth, Storage, Realtime…).
2. Dans les graphiques de la vue d'ensemble : à quel service correspondent les requêtes et les erreurs comptées (111 et 111 le 22 octobre), et sur quelle période.
3. Ouvre « Logs », puis « API Gateway » (ou « Edge »), sur les dernières 24 heures, en ne gardant que les erreurs si tu peux : pour 5 lignes au plus, relève la méthode, le chemin (par exemple /rest/v1/…, /auth/v1/…), le code de réponse (401, 404…) et l'agent utilisateur. Ne recopie ni adresse IP, ni en-tête « apikey » ou « authorization », ni jeton.
4. Ouvre « Logs », puis « Postgres », dernières 24 heures, niveau « ERROR » ou « FATAL » : pour 5 lignes au plus, recopie le message (par exemple « password authentication failed », « permission denied »), sans adresse IP ni nom d'utilisateur.
5. Relève l'état de chaque service tel que l'affiche le projet (« Project Settings », « Infrastructure » ou la vue d'ensemble), sans rien changer.

Compte rendu à me donner : le texte du statut, le service visé, les lignes relevées (méthode, chemin, code, agent), les messages de Postgres, l'état des services. Aucune adresse IP, aucune clé, aucun identifiant de projet.
```

---

## 3. Stripe, bac à sable — l'impayé, le rappel annuel, la mention des reçus

À coller dans Claude in Chrome. Avant ce prompt : connectez-vous vous-même à Stripe ; vérifiez que vous êtes dans le bac à sable « PULSACITY » (pas le mode réel). Ces réglages seront à refaire en mode réel (2.8 c), avec « PULSACITY » comme nom public.

```
Tu m'aides à aligner les réglages de Stripe sur les CGV de PULSACITY, dans le bac à sable « PULSACITY » (environnement de test), pas en mode réel. Vérifie d'abord le bandeau de test en haut de la page. Tu ne touches ni aux produits, ni aux prix, ni aux clés, ni au webhook, ni au portail client, ni à l'activation du compte, ni à Stripe Tax.

Où : https://dashboard.stripe.com/ › Paramètres › Billing (« Facturation »).

A. Les paiements qui échouent (CGV 9.1 et 9.2 : 14 jours de nouvelles tentatives, puis l'abonnement s'arrête, la période impayée n'est pas due)
1. Ouvre « Récupération des revenus » / « Revenue recovery » › « Nouvelles tentatives » / « Retries ». Relève le réglage actuel (attendu : 8 tentatives sur 2 semaines, Smart Retries).
2. « Si toutes les tentatives échouent » : l'abonnement doit être annulé (« Cancel the subscription ») ; la facture doit être marquée « irrécouvrable » (« Mark the invoice as uncollectible »). Si ce n'est pas le cas, montre-moi le réglage et attends mon accord avant d'enregistrer.

B. Le rappel avant un renouvellement annuel (CGV 5.2 : un e-mail au moins 7 jours avant)
3. Cherche « Rappels de renouvellement » / « Upcoming renewal reminders » / « Send emails about upcoming renewals » (dans « Abonnements et e-mails » ou « E-mails aux clients »). Recopie mot pour mot ce que Stripe dit des abonnements concernés (tous, ou seulement les annuels, ou selon la durée).
4. S'il ne vise que les abonnements annuels (ou plus longs qu'un mois) : active-le, à 7 jours, et enregistre. S'il enverrait aussi un e-mail chaque mois aux abonnés mensuels : ne l'active pas, arrête-toi et dis-le-moi.

C. La mention des reçus (2.7 : « TVA non applicable, art. 293 B du CGI »)
5. Ouvre « Factures » / « Invoices » › modèle de facture (« Invoice template »). Dans le pied de page par défaut (« Default footer »), écris exactement : TVA non applicable, art. 293 B du CGI. Enregistre. Si ce champ est réservé au compte activé, dis-le-moi sans rien changer d'autre.
6. Dis-moi si ce pied de page apparaît aussi sur les reçus de paiement (aperçu d'un reçu, s'il existe).

Compte rendu à me donner : chaque réglage tel que relu après l'enregistrement, et ce que tu n'as pas trouvé. Ni clé, ni identifiant (rien qui commence par acct_, sk_, pk_ ou whsec_).
```

Compte rendu du 22 octobre : Smart Retries, 8 fois en 2 semaines, puis annulation de l'abonnement (déjà ainsi) ; facture « marquée non recouvrable » (était « en retard de paiement »). Rappel de renouvellement de Stripe laissé désactivé : il écrirait pour toute période de plus de 7 jours, donc chaque mois. « Événements de renouvellement à venir » déjà à 7 jours : PULSACITY envoie lui-même le rappel des abonnements annuels (`AnnualRenewalEmail`, changement du 22 octobre). « Bas de page par défaut » : « TVA non applicable, art. 293 B du CGI », aucun modèle ne le remplace ; à voir sur le PDF d'une prochaine facture de test.

---

## 4. Umami — le contrat de traitement et la garantie de transfert

À coller dans Claude in Chrome. Le compte rendu 2.4 ne couvrait pas Umami.

```
Tu m'aides à vérifier les garanties d'Umami Cloud, l'outil de mesure d'audience de pulsacity.com. Tu lis seulement : tu ne changes aucun réglage, tu n'acceptes ni ne signes rien sans mon accord.

1. Sur https://umami.is (pages « Privacy », « Terms », « DPA », ou le PDF https://umami.is/umami-dpa.pdf) : le nom exact de la société, son pays, et comment le DPA s'applique (de lui-même avec les conditions d'utilisation, ou à signer). S'il faut le signer ou l'accepter, montre-moi la page et attends mon accord.
2. Sur https://www.dataprivacyframework.gov/list : cherche « Umami ». Dis-moi si Umami Software est inscrit au Data Privacy Framework, et la date de ta vérification.
3. Dans le DPA ou les conditions : les clauses contractuelles types de la Commission européenne sont-elles prévues ?
4. Connecte-toi seulement si je te le demande : dans les réglages du site « pulsacity.com » d'Umami Cloud, relève la région des données (attendu : Union européenne, Francfort) et la durée de conservation (attendu : 6 mois).

Compte rendu à me donner : la société et son pays, le DPA (adresse, s'applique de lui-même ou à accepter), le DPF (inscrit ou non, date), les clauses types (oui ou non), la région et la durée. Aucun identifiant de site.
```

Compte rendu du 22 octobre : Umami Software, Inc., Delaware ; DPA appliqué de lui-même ; pas inscrit au DPF (vérifié le 22 octobre) ; clauses contractuelles types 2021/914, modules 2 et 3 (ajoutées à sa ligne de la politique de confidentialité) ; région « EU (Frankfurt) » pour tout le compte ; 6 mois de conservation (offre Hobby).

---

## 5. GitHub — l'espace de démonstration (A, plan Essentiel)

À coller dans Claude in Chrome. Si la dernière recette date de plus d'une semaine, lancez d'abord le prompt 0 bis de `docs-internes/recette/lot-4-1-decisions.md` (réveiller la base de recette).

```
Tu m'aides à remplir l'espace de démonstration de PULSACITY sur la base de recette, depuis la branche de la PR #48.

Où : https://github.com/jawadboughalem/PULSACITY/actions/workflows/seed-recette.yml

Étapes :
1. Clique sur « Run workflow ».
2. « Use workflow from » : choisis la branche claude/legal-texts-private-seller-049wke (pas main).
3. « Adresse e-mail du compte de recette » : demande-la-moi et mets celle que je te donne.
4. Plan : essentiel.
5. Clique sur « Run workflow », puis attends la fin : l'exécution doit être verte.

Ne touche surtout pas aux autres workflows, ni à la branche main.

Vérification : la dernière exécution de « Recette demo space » est verte, sur la branche claude/legal-texts-private-seller-049wke.

Compte rendu à me donner : la branche choisie, le plan, et la couleur de l'exécution. Pas l'adresse e-mail.
```

Compte rendu du 22 octobre : exécution n° 21 verte, branche de la PR, plan essentiel.

---

## 6. Recette — les quatre textes en voix d'équipe, et « Demander un avis »

Compte rendu du 22 octobre, sur les textes corrigés : 7 points sur 7. Fusion décidée par le fondateur le même jour.

Compte rendu du 22 octobre (première version de ce prompt) : points 1, 3 à 6 et 10 à 12 OK ; non conformes, le nom et « une personne physique, sans entreprise immatriculée » (mentions légales, CGV 1.1, CGU 2, annexe 1, confidentialité 1), « exploité par une seule personne » (CGU 8.1), « Seul l'exploitant accède aux données » (annexe 6), l'article 13 des CGV ; Umami sans base de transfert. Tout est corrigé ; ce prompt revérifie.

Avant ce prompt : le dernier déploiement de l'aperçu (après les corrections du 22 octobre) est « Ready ». Connectez-vous vous-même à l'aperçu avec A. Fenêtre en grand.

```
Tu refais la recette des textes légaux du lot 4.9 de PULSACITY sur l'aperçu https://pulsacity-git-claude-legal-text-8e35c1-jawadboughalems-projects.vercel.app, fenêtre en grand (1440 px environ), après les corrections du 22 octobre : aucun nom de personne, une voix d'équipe, aucune mention de l'absence d'entreprise. Pour chaque point, note « OK » ou décris ce que tu vois. Si un nom de personne apparaît, ne le recopie pas : dis seulement où. N'envoie rien. Ne relève pas les erreurs réseau vues par ton outil de surveillance du navigateur.

A. Partout
1. Sur /mentions-legales, /cgv, /cgu, /confidentialite et /a-propos-des-avis : aucun prénom ni nom de personne, aucun crochet (« [ » ou « ] »), et nulle part les mots « exploitant », « personne physique », « immatriculée », « micro-entreprise », « société contrôlée », « une seule personne ». Sur les quatre premières : « Version du 22 octobre 2026 » et le bandeau jaune « Brouillon en cours de relecture » (l'aperçu reste en brouillon).

B. Mentions légales
2. « Éditeur » : « pulsacity.com et pulsacity.fr sont édités par l'équipe PULSACITY. », puis contact@pulsacity.com et « TVA non applicable, art. 293 B du CGI. ». « Directeur de la publication » : « L'équipe PULSACITY, joignable à contact@pulsacity.com. ». « Hébergement » : Vercel Inc., Covina, « région FRA1 », comme avant.

C. CGV
3. 13 articles ; le dernier est « 13. Modification des CGV », et il n'y a plus d'article « Quand PULSACITY deviendra une entreprise ». 1.1 : « PULSACITY (« nous ») vend les abonnements décrits ici. Coordonnées : mentions légales. ». 6.2 finit par « sauf à l'article 7 et dans les cas prévus par les CGU. ». 5.2 : le rappel par e-mail au moins 7 jours avant un renouvellement annuel.

D. CGU
4. « 2. Qui nous sommes » : « L'équipe PULSACITY (« nous ») exploite le service. ». 8.1 finit par « Le service repose sur des prestataires en ligne. ». 10.4 : « les données sont effacées sous 30 jours ; », sans le mot « sauvegardes ».
5. Annexe : point 1, « Le sous-traitant est PULSACITY (« nous »). » ; point 6, « Seule l'équipe PULSACITY accède aux données. Chaque personne de l'équipe est tenue à la confidentialité. » ; points 7 et 12 sans « sauvegardes de la base ».

E. Confidentialité
6. « 1. Qui est responsable » : « PULSACITY. Contact : contact@pulsacity.com. ». Dans « 4. Qui reçoit vos données », la ligne d'Umami finit par « Clauses contractuelles types. ».

F. « Demander un avis », dans l'espace
7. Ouvre Demandes (/app/demandes), « Demander un avis ». Sous « Date d'achat », tant que l'offre reste « Choisir une offre » : aucune phrase « L'e-mail dira », aucun crochet. Choisis « Programme 30 jours » : « L'e-mail dira : « vous avez acheté Programme 30 jours auprès de Julie Nutrition le … » » apparaît. Ferme avec « Annuler », sans rien envoyer.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Aucune information personnelle.
```

---

## 7. Recette de bout en bout avec B — la case, les e-mails, « Gérer mon avis »

Avant ce prompt : connectez-vous vous-même à l'aperçu avec A (lien de connexion dans la boîte de A). La boîte de B est ouverte dans un onglet du groupe « PULSACITY ».

```
Tu continues la recette du lot 4.9 de PULSACITY sur l'aperçu https://pulsacity-git-claude-legal-text-8e35c1-jawadboughalems-projects.vercel.app, connecté à l'espace « Julie Nutrition », fenêtre en grand. Pour chaque point, note « OK » ou décris ce que tu vois. N'envoie rien à une adresse en @exemple.fr. Ne recopie dans le compte rendu ni adresse e-mail, ni lien, ni information personnelle de l'exploitant.

A. Un e-mail de PULSACITY au créateur
1. Dans la boîte de A, ouvre le dernier e-mail « Votre lien pour entrer dans PULSACITY ». Tout en bas, sous la carte : la raison de l'e-mail, puis « PULSACITY », seul : ni nom de personne, ni adresse postale.

B. La demande et son pied
2. Ouvre Demandes (/app/demandes), « Demander un avis ». Prénom : Camille ; adresse : demande-moi l'adresse B ; offre : « Programme 30 jours » ; date proposée ; coche « Cette personne a acheté cette offre auprès de moi. » ; « Envoyer la demande ». Sur un aperçu, l'envoi planifié ne tourne pas : clique « Envoyer maintenant » sur cette demande.
3. Dans la boîte de B, ouvre l'e-mail « Camille, votre avis sur Programme 30 jours ? ». En bas, sous la carte, dans l'ordre : « Vous recevez cet e-mail parce que vous avez acheté Programme 30 jours auprès de Julie Nutrition le … », « Ne plus recevoir ces e-mails » (ne clique pas), « Julie Nutrition utilise PULSACITY pour recueillir les avis de ses clients. Vos données ». Aucune mention « Propulsé par » ni lien vers l'accueil de PULSACITY dans l'e-mail.
4. Clique « Vos données » : la politique de confidentialité s'ouvre sur « 9. Vous avez laissé un avis à un créateur » (sur pulsacity.com ou l'aperçu, selon l'adresse).

C. La page de collecte
5. Rouvre l'e-mail et clique « Donner mon avis ». Sous « Votre témoignage », toujours visible : « Votre avis sera public. Évitez les détails sur votre santé ou celle de vos proches. » Sous « Une photo de vous ? » : « Facultatif. Une photo de vous seulement, pas d'une autre personne. »
6. La case de consentement dit : « J'ai 18 ans ou plus et j'accepte que Julie Nutrition publie mon avis sur ses pages de vente : ma note, mon texte, le nom et le titre que j'indique, ma photo si j'en ajoute une, la date de mon avis et le mois de mon achat. Je peux retirer mon accord à tout moment avec le lien de l'e-mail reçu. »
7. Choisis 5 étoiles, écris « Avis de recette du lot 4.9. », coche la case et envoie : le remerciement.
8. Dans l'espace (A), Témoignages : l'avis de Camille est arrivé, en attente. Ouvre-le, clique « Valider ». Sur sa fiche, sous « Accordé le … », le texte cité est celui du point 6.

D. « Gérer mon avis »
9. Dans la boîte de B, rouvre l'e-mail et clique à nouveau « Donner mon avis ». L'onglet s'appelle « Gérer mon avis · Julie Nutrition ». La page : une icône cochée, « Votre avis est enregistré », « Julie Nutrition l'a bien reçu. Merci. », puis en gris « Vous pouvez retirer votre accord à sa publication. Votre avis sera alors supprimé. », un bouton bordé « Retirer mon accord » et le lien « Écrire à Julie Nutrition ».
10. Clique « Retirer mon accord » : « Retirer votre accord ? », la phrase sur les 24 heures, « Ce choix est définitif. », un bouton rouge « Retirer mon accord » et un bouton bordé « Garder mon avis ». Rien n'est encore retiré : clique « Garder mon avis », tu reviens au point 9.
11. Clique « Retirer mon accord », puis le bouton rouge : « Votre accord est retiré », « Votre avis est supprimé. Il disparaît des pages de Julie Nutrition sous 24 heures. »
12. Dans l'espace (A), recharge Témoignages : l'avis « Avis de recette du lot 4.9. » n'y est plus.
13. Rouvre une dernière fois le lien de l'e-mail : « Votre avis n'est plus enregistré », avec « Écrire à Julie Nutrition ».

E. La page publique
14. Ouvre la page de collecte générale de l'espace (Réglages, « Adresse de votre page de collecte »). Sa case de consentement finit par « … et la date de mon avis. Je peux retirer mon accord à tout moment en écrivant à Julie Nutrition ou à contact@pulsacity.com. » N'envoie rien.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Aucune adresse e-mail, aucun lien, aucune information personnelle.
```

Compte rendu du 22 octobre : les 14 points OK. Remarques : le symbole PULSACITY cassé dans Gmail (l'image est servie par l'aperçu, protégé par Vercel : connu depuis le lot 4.8, à voir en production) ; « [l'offre] » dans l'aide de « Demander un avis » avant le choix de l'offre (corrigé : la phrase n'apparaît qu'une fois l'offre et la date choisies, point 7 du prompt 6) ; la ligne du nom et de l'adresse postale de la créatrice sous « Vos données » (attendue : c'est l'adresse que l'espace de démonstration a remplie dans Réglages, facultative, maquette 3.6).

---

## 8. Recette — à 360 px

```
Tu continues la recette du lot 4.9 de PULSACITY sur l'aperçu https://pulsacity-git-claude-legal-text-8e35c1-jawadboughalems-projects.vercel.app. Règle la fenêtre (ou le mode appareil) sur 360 px de large. Pour chaque page, note « OK » ou décris ce que tu vois. Rien ne doit déborder sur le côté : pas de défilement horizontal.

1. /mentions-legales, /cgv, /cgu, /confidentialite : le titre, la version, le bandeau, le sommaire replié « Sur cette page », le texte lisible ; les longues lignes (noms de cookies, adresse de Vercel) passent à la ligne sans dépasser.
2. /aide?sujet=signalement#contact : le formulaire, sujet et questions déjà remplis, sans débordement.
3. La page de collecte générale de l'espace (Réglages, « Adresse de votre page de collecte ») : les deux aides et la case de consentement se lisent en entier.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

Compte rendu du 22 octobre : les trois points OK, dans un cadre de 360 px (345 px utiles). Remarque : connecté, l'adresse de l'espace préremplie dans « Écrivez-nous » est plus longue que le champ, sa fin est masquée ; le champ ne déborde pas.

---

## 9. `LEGAL_VALIDATED=true` en production

Fait le 22 octobre : `LEGAL_VALIDATED` vaut `true` en Production, `false` en Preview. Pas de redéploiement : il aurait publié les anciens textes de `main`. La fusion de la PR #48 construit la production avec cette valeur.

---

## 9 bis. Vercel — retirer `LEGAL_PUBLISHER_NAME`

À coller dans Claude in Chrome, quand vous voulez (avant ou après la fusion) : depuis le 22 octobre, plus aucun code ne lit cette variable. Avant ce prompt : connectez-vous vous-même à Vercel.

```
Tu m'aides à retirer une variable devenue inutile du projet PULSACITY sur Vercel. Je suis connecté à Vercel. Tu ne touches à aucune autre variable et tu ne redéploies rien.

Où : https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables

1. Trouve LEGAL_PUBLISHER_NAME (Production et Preview). N'ouvre pas sa valeur.
2. Dans le menu « … » de sa ligne, choisis « Remove » (ou « Delete ») et confirme. Si elle existe pour plusieurs environnements sur des lignes séparées, retire chacune.
3. Vérification : une recherche « LEGAL_PUBLISHER » ne trouve plus rien ; LEGAL_VALIDATED est toujours là, true en Production et false en Preview.

Compte rendu à me donner : la variable retirée et ses environnements, la valeur de LEGAL_VALIDATED en Production et en Preview. Aucune valeur d'une autre variable.
```

---

## La fusion

Après votre validation des textes (prompt 6 vert) : fusionnez la PR #48 sur GitHub (« Merge pull request »), une fois « Lint, typecheck, test, build » et « GitGuardian Security Checks » verts. La PR apporte une migration (une colonne facultative, `subscriptions.renewal_reminder_period_end`) : « Database migration » l'applique à la production, puis Vercel met la production en ligne. Avec `LEGAL_VALIDATED=true`, les textes sont publiés dès ce déploiement.

---

## 10. Vérification sur pulsacity.com

À coller dans Claude in Chrome, une fois le déploiement de production « Ready ».

```
Tu vérifies la mise en ligne des textes légaux sur https://pulsacity.com. Tu ne te connectes à rien, tu n'envoies rien.

1. Ouvre https://github.com/jawadboughalem/PULSACITY/actions : sur le commit de fusion de la PR #48, « CI » et « Database migration » sont verts.
2. Ouvre /mentions-legales, /cgv, /cgu, /confidentialite et /a-propos-des-avis : aucun bandeau « Brouillon en cours de relecture », aucun passage surligné, aucun crochet. Sur les quatre premières, « Version du 22 octobre 2026 ».
3. Voix d'équipe : les mentions légales disent « édités par l'équipe PULSACITY » et « L'équipe PULSACITY, joignable à contact@pulsacity.com. » ; aucune page ne donne un prénom et un nom de personne, une adresse postale ou un téléphone de l'éditeur, ni les mots « exploitant », « personne physique », « immatriculée », « micro-entreprise ». Les CGV ont 13 articles, le dernier « 13. Modification des CGV ».
4. Sur chacune, affiche le code source et cherche « noindex » : il n'y est plus.
5. Ouvre /sitemap.xml : il liste /mentions-legales, /cgu, /cgv, /confidentialite et /a-propos-des-avis.
6. Ouvre /robots.txt : rien n'y interdit ces pages.
7. Le pied de page : « Mentions légales », « CGU », « CGV », « Confidentialité », « Cookies » mènent à leur page ou rubrique.

Compte rendu à me donner : chaque point avec « OK » ou ce que tu as vu. Si un nom de personne apparaît, dis où, sans le recopier.
```

Compte rendu du 22 octobre (avant la fusion) : la production montre encore les brouillons du 4 octobre (CGU du 19 octobre), avec bandeau, passages à compléter et `noindex`, hors du plan du site. Normal : la PR #48 n'était pas fusionnée.

Ensuite, pour Stripe en mode réel (2.8 c) : les informations publiques du compte prennent « PULSACITY » et contact@pulsacity.com, sans nom de personne, sans adresse ni téléphone (si Stripe en exige un pour activer le compte, le prompt s'arrêtera et vous demandera), les liens https://pulsacity.com/cgv et https://pulsacity.com/confidentialite, et les réglages du prompt 3 sont refaits en mode réel. Claude Code écrit ces prompts avec le passage du lot 4.5 en mode réel.
