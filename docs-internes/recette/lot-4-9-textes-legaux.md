# Lot 4.9 — Les textes légaux d'un vendeur particulier : vos actions et la recette

Adresse de l'aperçu (PR #48) : https://pulsacity-git-claude-legal-text-8e35c1-jawadboughalems-projects.vercel.app

Dans l'ordre :
- Prompt 1 : Vercel — votre nom (vous le tapez vous-même), la région des fonctions, l'offre, l'adresse de Vercel. Fait le 21 octobre (compte rendu sous le prompt).
- Prompt 2 : Supabase — l'offre et les sauvegardes de la production (lecture seule).
- Prompt 3 : Stripe, bac à sable — l'impayé à 14 jours, le rappel avant un renouvellement annuel, la mention de TVA des reçus.
- Prompt 4 : Umami — son contrat de traitement et sa garantie de transfert (lecture seule).
- Prompt 5 : GitHub, l'espace de démonstration (A, plan Essentiel), depuis la branche de la PR.
- Prompt 6 : recette, les quatre textes et « Signaler un contenu ».
- Prompt 7 : recette de bout en bout avec B : la case de consentement, le pied des e-mails, « Gérer mon avis » et le retrait de l'accord.
- Prompt 8 : recette à 360 px.
- Après votre validation des textes, puis la fusion : prompt 9 (`LEGAL_VALIDATED=true` en production) et prompt 10 (vérification sur pulsacity.com).

Décision du 21 octobre : ni votre adresse ni votre téléphone ne sont publiés, nulle part. Seul votre nom apparaît, dans les textes légaux, par `LEGAL_PUBLISHER_NAME`. Aucun prompt ne vous les demande.

Une décision reste à prendre : **Vercel Pro** avant le premier paiement (le DPA de Vercel ne couvre pas Hobby). La politique de confidentialité dit « au plus 1 jour » de journaux : 1 heure en Hobby, 1 jour en Pro.

Deux adresses, à garder pour vous (jamais dans un compte rendu) :
- **A** : celle des recettes précédentes, l'espace « Julie Nutrition » de la recette ;
- **B** : une autre de vos adresses (un alias Gmail suffit), qui joue la cliente. Sa boîte de réception est ouverte dans un onglet du groupe « PULSACITY ».

Déjà vérifié par Claude Code dans son conteneur :
- les quatre textes à 360 et 1440 px, sans débordement ni erreur dans la console : sans `LEGAL_PUBLISHER_NAME`, les phrases se lisent sans le nom, sans crochet ; avec elle et `LEGAL_VALIDATED=true`, ni bandeau ni `noindex` ;
- aucun crochet de remplissage dans les pages : un test le garde (`src/content/placeholder-brackets.test.ts`) ;
- les prix et limites des CGV lus dans `plans.ts` ; liens internes et ancres (`#avis`, `#cookies`, `#destinataires`, `#contact`, `#sous-traitance`) par un test ;
- la page de collecte (demande et lien public) avec la nouvelle case et les deux aides, à 360 et 1440 px ;
- « Gérer mon avis » de bout en bout dans Chromium : avis enregistré, confirmation, « Garder mon avis », retrait, accord retiré, avis plus enregistré ; par des tests : l'avis, ses corrections et sa photo partent, rien d'un autre espace ni d'un lien pas encore répondu ;
- les pieds des e-mails (client : « … utilise PULSACITY … Vos données » ; créateur : « PULSACITY » seul) ;
- `pnpm lint`, `pnpm typecheck`, `pnpm build` ; `pnpm test` vert, sauf `decode-csv-file.test.ts` (connu, propre au conteneur).

Ce que les textes affirment et que la recette ne voit pas, à vérifier par les prompts 2 à 4 avant votre validation : les sauvegardes de Supabase (7 jours supposés), les réglages de Stripe, la garantie de transfert d'Umami. La région des fonctions (FRA1) et l'adresse de Vercel sont relevées (prompt 1) ; Vercel ne publie pas de téléphone. La purge à 90 jours des ventes déjà traitées est promise par les textes : elle se construit au lot 4.10, avant le 1er janvier 2027.

---

## 1. Vercel — votre nom, la région, l'offre, l'adresse de Vercel

Fait le 21 octobre. À coller dans Claude in Chrome, s'il fallait le refaire. Avant ce prompt : connectez-vous vous-même à Vercel. C'est vous qui tapez votre nom, jamais l'agent.

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

---

## 3. Stripe, bac à sable — l'impayé, le rappel annuel, la mention des reçus

À coller dans Claude in Chrome. Avant ce prompt : connectez-vous vous-même à Stripe ; vérifiez que vous êtes dans le bac à sable « PULSACITY » (pas le mode réel). Ces réglages seront à refaire en mode réel (2.8 c), avec le nom de l'exploitant dans les informations publiques.

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

---

## 6. Recette — les quatre textes et « Signaler un contenu »

Avant ce prompt : le dernier déploiement de l'aperçu (après le changement du 21 octobre) est « Ready ». Fenêtre en grand. Si l'aperçu demande de vous identifier à Vercel, faites-le vous-même.

```
Tu fais la recette du lot 4.9 de PULSACITY sur l'aperçu https://pulsacity-git-claude-legal-text-8e35c1-jawadboughalems-projects.vercel.app, fenêtre en grand (1440 px environ). Pour chaque point, note « OK » ou décris ce que tu vois. Ne recopie pas dans le compte rendu le nom de l'exploitant : dis seulement s'il apparaît, et où. Ne relève pas les erreurs réseau vues par ton outil de surveillance du navigateur.

A. Les mentions légales (/mentions-legales)
1. En haut : « Version du 21 octobre 2026 », puis le bandeau jaune « Brouillon en cours de relecture », « Ce texte n'est pas encore validé. ». Aucun passage surligné, aucun crochet (« [ » ou « ] ») dans la page, aucun « LEGAL_PUBLISHER ».
2. « Éditeur » : « édités par », un prénom et un nom, « une personne physique, sans entreprise immatriculée à ce jour », puis contact@pulsacity.com et « TVA non applicable, art. 293 B du CGI ». Aucune adresse postale ni aucun numéro de téléphone de l'exploitant. « Directeur de la publication » : « l'éditeur », suivi du même nom.
3. « Hébergement » : Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis, « vercel.com, contact : privacy@vercel.com », « Serveurs utilisés : Francfort, Allemagne (région FRA1). », sans numéro de téléphone ; le lien « politique de confidentialité » mène à la rubrique « 4. Qui reçoit vos données ».
4. « Nous contacter, signaler un contenu » : clique « pulsacity.com/aide ». La page Aide s'ouvre sur « Écrivez-nous » : le sujet est déjà rempli, « Signaler un contenu », et le message commence par trois lignes « Page ou widget : », « Contenu visé : », « Pourquoi il est illicite : ». N'envoie rien.
5. Le sommaire « Sur cette page » à droite mène à chaque titre.

B. Les CGV (/cgv)
6. 14 articles. Article 2 : Gratuit 0 €, Essentiel 14,99 € par mois ou 149 € par an, Pro 24,99 € par mois ou 249 € par an ; « 15 témoignages validés, 20 demandes automatiques par mois, 1 widget » ; « 20 demandes saisies à la main par jour ». Article 3 : 9,99 € et 99 €, 19,99 € et 199 €, « 100 premiers abonnés payants ». Aucune trace de « TVA comprise » ni de « HT ».
7. L'article 1.1 nomme l'exploitant ; les articles 7 (14 jours), 9 (14 jours, 40 €, L441-10) et 10.2 (hausse annoncée 30 jours avant) sont là.

C. Les CGU (/cgu)
8. 13 articles et l'annexe « Annexe : contrat de sous-traitance (article 28 du RGPD) ». Aucune mention « [4.13] ». L'article 6.2 a un lien « page qui explique », qui mène à « À propos de ces avis ». L'article 7.4 a un lien vers l'aide, avec le sujet rempli comme au point 4. L'annexe nomme l'exploitant (point 1) et liste quatre sous-traitants ultérieurs (Vercel, Supabase, Resend, Cloudflare).

D. La politique de confidentialité (/confidentialite)
9. « 1. Qui est responsable » : « L'exploitant de PULSACITY », son nom, « personne physique », contact@pulsacity.com ; aucune adresse postale. « 3. Ce que nous traitons… » : huit rubriques (espace, abonnements, e-mails, d'où viennent les inscriptions, messages, « Me prévenir », protection, mesure d'audience), chacune avec « Données », « Base légale », « Durée ».
10. « 4. Qui reçoit vos données » : huit prestataires, dont Umami, OVH et Google (Gmail). « 5. Cookies » : trois cookies, avec leurs noms. « 9. Vous avez laissé un avis à un créateur » : « Retirer votre accord » parle de la page « Gérer mon avis ».

E. « À propos de ces avis »
11. Ouvre /a-propos-des-avis, dernière rubrique « Une question sur un avis » : le lien « écrivez à l'équipe PULSACITY » ouvre l'aide avec le sujet « Signaler un contenu » déjà rempli.

F. Les pages restent hors des moteurs
12. Sur /cgv, affiche le code source de la page (Ctrl+U) et cherche « noindex » : il y est (l'aperçu et le brouillon le veulent).

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Aucune information personnelle de l'exploitant.
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

---

## 8. Recette — à 360 px

```
Tu continues la recette du lot 4.9 de PULSACITY sur l'aperçu https://pulsacity-git-claude-legal-text-8e35c1-jawadboughalems-projects.vercel.app. Règle la fenêtre (ou le mode appareil) sur 360 px de large. Pour chaque page, note « OK » ou décris ce que tu vois. Rien ne doit déborder sur le côté : pas de défilement horizontal.

1. /mentions-legales, /cgv, /cgu, /confidentialite : le titre, la version, le bandeau, le sommaire replié « Sur cette page », le texte lisible ; les longues lignes (noms de cookies, adresse de Vercel) passent à la ligne sans dépasser.
2. /aide?sujet=signalement#contact : le formulaire, sujet et questions déjà remplis, sans débordement.
3. La page de collecte générale de l'espace (Réglages, « Adresse de votre page de collecte ») : les deux aides et la case de consentement se lisent en entier.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 9. Après votre validation des textes et la fusion — la mise en ligne

Quand vous validez les textes (avec les comptes rendus des prompts 1 à 4 reportés par Claude Code), Claude Code fusionne la PR. Puis, à coller dans Claude in Chrome :

```
Tu m'aides à publier les textes légaux de PULSACITY en production. Je suis connecté à Vercel. Tu ne touches à aucune autre variable.

Où : https://vercel.com/jawadboughalems-projects/pulsacity/settings/environment-variables

1. Vérifie que LEGAL_PUBLISHER_NAME existe en Production (n'ouvre pas sa valeur). Si elle manque, arrête-toi et dis-le-moi.
2. Trouve LEGAL_VALIDATED. Modifie seulement sa valeur pour l'environnement Production : true. Ne change pas Preview (elle reste false). Enregistre.
3. Ouvre https://vercel.com/jawadboughalems-projects/pulsacity/deployments, le dernier déploiement de production (branche main), menu « … », « Redeploy », sans cocher « Use existing Build Cache », confirme. Attends « Ready ».

Compte rendu à me donner : LEGAL_PUBLISHER_NAME vue en Production, la valeur de LEGAL_VALIDATED en Production et en Preview, l'heure du déploiement « Ready ».
```

---

## 10. Vérification sur pulsacity.com

```
Tu vérifies la mise en ligne des textes légaux sur https://pulsacity.com. Tu ne te connectes à rien, tu n'envoies rien.

1. Ouvre /mentions-legales, /cgv, /cgu, /confidentialite et /a-propos-des-avis : aucun bandeau « Brouillon en cours de relecture », aucun passage surligné, aucun crochet. Les mentions légales donnent un nom (ne le recopie pas) et contact@pulsacity.com, ni adresse postale ni téléphone de l'exploitant.
2. Sur chacune, code source (Ctrl+U), cherche « noindex » : il n'y est plus.
3. Ouvre /sitemap.xml : il liste /mentions-legales, /cgu, /cgv, /confidentialite et /a-propos-des-avis.
4. Ouvre /robots.txt : rien n'y interdit ces pages.
5. Le pied de page : « Mentions légales », « CGU », « CGV », « Confidentialité », « Cookies » mènent à leur page ou rubrique.

Compte rendu à me donner : chaque point avec « OK » ou ce que tu as vu. Aucune information personnelle.
```

Ensuite, pour Stripe en mode réel (2.8 c) : les informations publiques du compte prennent le nom de l'exploitant et contact@pulsacity.com, sans adresse ni téléphone (si Stripe en exige un pour activer le compte, le prompt s'arrêtera et vous demandera), les liens https://pulsacity.com/cgv et https://pulsacity.com/confidentialite, et les réglages du prompt 3 sont refaits en mode réel. Claude Code écrit ces prompts avec le passage du lot 4.5 en mode réel.
