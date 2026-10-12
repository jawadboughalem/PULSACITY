# Lot 4.1 — les décisions appliquées : textes à valider, puis recette

Dans l'ordre :
- Partie A : les textes qui supposent Systeme.io, et les durées affichées. Validée par le fondateur le 12 octobre, appliquée dans la PR #33.
- Prompt 1 : l'espace de démonstration de recette, rempli depuis la branche de la PR.
- Prompts 2 et 3 : recette sur l'aperçu, sur ordinateur puis à 360 px.
- Prompt 4 : vérification sur pulsacity.com, après la fusion.

Ce lot ne touche à aucun service : aucune action à faire de votre côté sur Vercel, Supabase, Stripe ou ailleurs. Aucune migration.

Adresse de l'aperçu (PR #33) : https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app

Déjà vérifié par Claude Code dans son conteneur :
- un espace neuf : accueil, Témoignages, Demandes et Offres vides disent « l'outil où vous vendez » ou « votre outil », sans « Systeme.io », et leur bouton « Connecter mon outil » (« Connectez votre outil » sur Offres) mène à Connecteurs ; l'étape « Connecter votre outil de vente » se coche dès qu'un connecteur, quel qu'il soit, est actif ;
- `pnpm lint`, `pnpm typecheck`, `pnpm build` ; `pnpm test` vert, sauf `decode-csv-file.test.ts`, qui échoue déjà sur `main` dans ce conteneur (Node 22.22, voir `etat.md`) et passe en CI ;
- `/`, `/tarifs` (Mensuel et Annuel), `/cgv`, `/integrations` et `/app/widgets` à 360, 1024 et 1440 px : aucun débordement, aucune erreur dans la console ; sur ordinateur, les boutons et les listes des trois plans sont sur la même ligne ;
- le catalogue n'est pas publié : le plan du site et `/integrations` gardent Systeme.io, Stripe et Calendly, et `/integrations/kajabi` répond 404.

---

## A. Les textes qui supposent Systeme.io : validés et appliqués

Réponse du fondateur, le 12 octobre : tout est validé. « Connecter mon outil », car plusieurs outils sortent au lancement, puis d'autres rapidement. D3, laissé à l'arbitrage de Claude Code : les deux durées de saisie restent jusqu'aux maquettes v2.

Règle suivie : un texte général parle de « l'outil où vous vendez » ; Systeme.io reste nommé là où l'on parle de son connecteur, de son guide ou de son éditeur de pages. Répondez par numéro : « OK », une correction, ou « non ».

### Site public

| N° | Où | Aujourd'hui | Proposition |
| --- | --- | --- | --- |
| S1 | Accueil, description pour les moteurs de recherche | « Après chaque vente sur Systeme.io, votre client reçoit une demande d'avis à votre nom. Vous validez, et son témoignage s'affiche sur votre page de vente. Gratuit pour commencer. » | Celle de `positionnement.md` : « Après chaque vente, PULSACITY demande l'avis de votre client à votre nom et affiche son témoignage sur votre page de vente. Gratuit, sans carte bancaire. » |
| S2 | Accueil, texte sous le grand titre | « Après chaque vente sur Systeme.io, votre client reçoit une demande d'avis à votre nom. Vous validez, et son témoignage s'affiche sur votre page de vente. » | D'après `positionnement.md` (section 1) : « Après chaque vente, votre client reçoit un e-mail à votre nom qui lui demande son avis, au bon moment. Vous validez, et son témoignage s'affiche sur votre page de vente. » |
| S3 | Accueil, « Comment ça marche », étape 1 | « Connectez Systeme.io » / « Une adresse et une clé à coller dans vos paramètres Systeme.io. Deux minutes, sans rien installer. » | « Reliez l'outil où vous vendez » / « Une adresse à coller une fois dans votre outil de vente, Systeme.io par exemple. Rien à installer. » |
| S4 | Appel final de l'accueil, d'Intégrations et de Guides | « Deux minutes pour connecter Systeme.io, et la prochaine vente fait le reste. » | « Reliez l'outil où vous vendez : la prochaine vente fait le reste. » |
| S5 | Guide « Récolter des témoignages clients pour une formation en ligne », partie « Automatiser toute la méthode » | « C'est ce que PULSACITY automatise, à partir de vos ventes Systeme.io : » | « C'est ce que PULSACITY automatise, à partir des ventes de l'outil où vous encaissez : » |

### Espace

| N° | Où | Aujourd'hui | Proposition |
| --- | --- | --- | --- |
| E1 | Accueil d'un espace neuf | « Envoyez votre lien à vos clients, ou connectez Systeme.io pour qu'une demande parte après chaque vente. » ; bouton « Connecter Systeme.io », vers Connecteurs › Systeme.io | « Envoyez votre lien à vos clients, ou connectez l'outil où vous vendez pour qu'une demande parte après chaque vente. » ; bouton « Connecter mon outil », vers Connecteurs |
| E2 | Témoignages, liste vide | « Partagez votre lien de collecte ou connectez Systeme.io pour recevoir vos premiers avis. » ; bouton « Connecter Systeme.io » | « Partagez votre lien de collecte ou connectez l'outil où vous vendez pour recevoir vos premiers avis. » ; bouton « Connecter mon outil », vers Connecteurs |
| E3 | Accueil, étapes de démarrage | Étape « Connecter Systeme.io », cochée quand Systeme.io est connecté ; bouton « Connecter Systeme.io » | Étape « Connecter votre outil de vente », cochée dès qu'un connecteur est actif ; bouton « Connecter mon outil », vers Connecteurs |
| E4 | Demandes, liste vide | « Dès que Systeme.io nous envoie une vente, la demande d'avis se prépare ici, avec sa date de départ. » ; bouton « Connecter Systeme.io » tant que Systeme.io n'est pas actif | « Dès qu'une vente nous arrive de votre outil, la demande d'avis se prépare ici, avec sa date de départ. » ; bouton « Connecter mon outil » tant qu'aucun connecteur n'est actif |
| E5 | Offres, liste vide | « Vous vendez sur Systeme.io ? Connectez-le : vos produits arriveront tout seuls. » | « Vous vendez en ligne ? Connectez votre outil : vos produits arriveront tout seuls. » |
| E6 | Démarrage, étape des formations | « … Vous pourrez les relier à Systeme.io ensuite. » | « … Vous pourrez les relier à votre outil de vente ensuite. » |
| E7 | « Demander un avis », sous le titre | « Il reçoit le même e-mail qu'après une vente Systeme.io, au nom de … » | « Il reçoit le même e-mail qu'après une vente reçue d'un outil connecté, au nom de … » |
| E8 | Widgets, installation du code (téléphone et éditeur) | « Le code se colle dans l'éditeur de Systeme.io, plus confortable sur grand écran. » ; « Collez-le dans Systeme.io, dans un élément Code HTML. Le guide vous montre où. » ; « Collez-le maintenant dans Systeme.io : suivez les 4 étapes ci-dessous. » | « Le code se colle dans l'éditeur de votre page, plus confortable sur grand écran. » ; « Collez-le dans votre page, dans un bloc de code HTML. Le guide Systeme.io vous montre où. » ; « Collez-le maintenant dans votre page. Sur Systeme.io, suivez les 4 étapes ci-dessous. » Le guide « Coller dans Systeme.io » garde son nom. |
| E9 | E-mail « Code du widget » | « Collez-le une seule fois dans un bloc HTML de votre page de vente Systeme.io. » ; « Coller dans Systeme.io : 4 étapes, environ 2 minutes » | « Collez-le une seule fois dans un bloc de code HTML de votre page de vente. » ; « Sur Systeme.io : 4 étapes » (durée retirée, voir D) |

### À changer avec le catalogue (lot 4.1 b), pas maintenant

Ils parlent des connecteurs disponibles : ils sont vrais aujourd'hui et changent le jour où le connecteur universel sort.
- FAQ de l'accueil, « Est-ce compatible avec mon site ? » : « Pour les ventes, la connexion automatique marche aujourd'hui avec Systeme.io. Stripe et Calendly arrivent. »
- Tarifs, « Comparer en détail », rubrique Connecteurs : « Systeme.io » et « Stripe et Calendly, dès leur sortie ».
- Intégrations : titre « Intégrations : Systeme.io, Stripe, Calendly » et sa description.
- Accueil : « Compatible avec Systeme.io », sous le bouton (m7).

### Gardés tels quels

- Tout ce qui parle du connecteur Systeme.io ou de son guide : sa page publique, Connecteurs › Systeme.io, le guide « Coller dans Systeme.io », le guide « Comment ajouter des témoignages sur une page Systeme.io ».
- Les pages « Bientôt » : « Elle fonctionnera comme celle de Systeme.io » et « comme les produits Systeme.io » comparent à un connecteur.
- La démo de l'accueil (m7), où la vente vient de Systeme.io : un exemple, que la v2 refait (lot 4.7).
- Les CGU et les mentions légales (« Systeme.io, par exemple »).

### D. Les durées affichées

`positionnement.md` (« Incitations ») : « aucune durée d'installation ni de saisie affichée avant d'avoir chronométré trois vraies installations. » Le site en affiche plusieurs.
- D1, installation, à retirer : « Deux minutes, sans rien installer » (S3), « Deux minutes pour connecter … » (S4, et l'appel final de la page Systeme.io, qui deviendrait « Connectez Systeme.io : la prochaine vente fait le reste. »), « Deux minutes, depuis votre ordinateur » (avantage de la page Systeme.io, qui deviendrait « Plus simple depuis un ordinateur. »), « environ 2 minutes » du guide du widget (E9, et la même ligne dans l'éditeur).
- D2, saisie, à retirer : « L'avis se laisse en deux minutes. » (Intégrations et pages « Bientôt », qui deviendrait « L'avis se laisse depuis un téléphone. »).
- D3, question : la page de collecte (« Comptez moins d'une minute. ») et le bouton de l'e-mail de demande (« Donner mon avis (1 minute) », m3, repris dans la démo de l'accueil) annoncent aussi une durée de saisie. CLAUDE.md promet « moins de 60 secondes ». Arbitrage : elles restent jusqu'aux maquettes v2 de la collecte et des e-mails (3.6, lot 4.8), et se mesurent d'ici là. La démo de l'accueil garde aussi « 2 minutes plus tard », un exemple de déroulé, pas une promesse.

---

## 0. Vercel — si l'aperçu est en échec : lire l'erreur et relancer une fois

À lancer seulement si le commentaire de Vercel sur la PR affiche « Error » pour le dernier commit. Le 12 octobre, deux déploiements ont échoué ainsi en quelques secondes (eb0353c, 482429d), alors que la CI était verte.

```
Tu m'aides à comprendre pourquoi un aperçu Vercel de PULSACITY a échoué, puis à le relancer une fois. Tu ne changes aucun réglage.

Où : https://vercel.com/jawadboughalems-projects/pulsacity/deployments, puis le dernier déploiement de la branche claude/determined-meitner-gnbd7e marqué « Error ».

Étapes :
1. Ouvre ce déploiement. Note son état, sa durée et le message d'erreur affiché.
2. Ouvre ses journaux (« Build Logs ») et recopie les 30 dernières lignes telles quelles. Si une ligne contient une clé, un mot de passe ou une adresse de base de données, remplace la valeur par [masqué].
3. Clique sur les trois points (…) en haut à droite, puis « Redeploy ». Laisse les options par défaut et confirme. C'est un aperçu : rien ne part en production.
4. Attends la fin : l'état doit passer à « Ready ».

Ne touche surtout pas : aux réglages du projet, aux variables d'environnement, aux domaines, au déploiement de production (ne promeus rien).

Compte rendu à me donner : le message d'erreur, les 30 dernières lignes des journaux (valeurs secrètes masquées), et l'état final du nouveau déploiement.
```

---

## 0 bis. Supabase — réveiller la base de recette

Le 12 octobre, « Recette demo space » a échoué : la base de recette ne répondait plus (« tenant/user not found »). Sur l'offre gratuite, Supabase met un projet en pause après 7 jours sans activité. À lancer avant le prompt 1 quand la dernière recette date de plus d'une semaine.

```
Tu m'aides à réveiller la base de recette de PULSACITY sur Supabase. Je suis connecté à Supabase. Tu ne crées rien et tu ne changes aucun réglage.

Où : https://supabase.com/dashboard/projects (organisation PULSACITY).

Étapes :
1. Repère le projet « pulsacity-recette ». Note son état tel qu'il est affiché (par exemple « Paused », « Active », « Healthy »).
2. S'il est en pause : ouvre-le, clique sur « Restore project » (ou « Resume project »), puis confirme. Attends qu'il redevienne actif : cela prend quelques minutes. Recharge la page si besoin.
3. S'il n'est pas en pause, ou si tu ne le trouves pas : arrête-toi et décris ce que tu vois, sans rien changer.

Ne touche surtout pas : au projet « PULSACITY » (la production), aux mots de passe, aux clés, aux réglages de la base, à la facturation ni au plan.

Vérification : le projet « pulsacity-recette » est affiché comme actif, sans bandeau de pause.

Compte rendu à me donner : l'état du projet avant, ce que tu as fait, et l'état après. Aucun identifiant de projet, aucune adresse de connexion.
```

---

## 1. GitHub — l'espace de démonstration de recette, depuis la branche de la PR

```
Tu m'aides à remplir l'espace de démonstration de PULSACITY sur la base de recette, depuis la branche d'une PR.

Où : https://github.com/jawadboughalem/PULSACITY/actions/workflows/seed-recette.yml

Étapes :
1. Clique sur « Run workflow ».
2. « Use workflow from » : choisis la branche claude/determined-meitner-gnbd7e (pas main).
3. « Adresse e-mail du compte de recette » : demande-la-moi et mets celle que je te donne.
4. Plan : free.
5. Clique sur « Run workflow », puis attends la fin : l'exécution doit être verte.

Ne touche surtout pas aux autres workflows, ni à la branche main.

Compte rendu à me donner : la branche choisie, le plan, et la couleur de l'exécution. Pas l'adresse e-mail.
```

---

## 2. Recette sur ordinateur, sur l'aperçu

Avant ce prompt : ouvrez l'aperçu de la PR et connectez-vous vous-même avec l'adresse du prompt 1, fenêtre en grand. 

```
Tu fais la recette des prix et du catalogue de PULSACITY sur l'aperçu https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app, fenêtre en grand. Je suis connecté. Tu ne crées aucun compte et tu ne remplis aucun formulaire. Pour chaque point, note « OK » ou décris ce que tu vois.

A. Tarifs (https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/tarifs), « Mensuel » choisi
1. Sous le titre « Un prix simple, qui suit vos ventes. » : « Commencez gratuitement. Passez à Essentiel quand les avis arrivent. Sans engagement. Prix finaux : rien ne s'ajoute au paiement. »
2. Cherche « TVA comprise » dans la page (Ctrl+F) : aucun résultat.
3. Gratuit : « 0 € », « pour toujours », aucune ligne dessous. Essentiel : « 9,99 € », « par mois », puis « Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois. » Pro : « 19,99 € », « par mois », puis « … Ensuite, 24,99 € par mois. » Aucun prix barré, aucun compteur.
4. Les trois boutons (« Créer mon espace gratuit », « Choisir Essentiel », « Choisir Pro ») sont à la même hauteur, et les trois listes commencent sur la même ligne.
5. Clique sur « Annuel » : Essentiel « 99 € » « par an », « … Ensuite, 149 € par an. » ; Pro « 199 € » « par an », « … Ensuite, 249 € par an. » ; à droite, « Annuel : 2 mois offerts ». Les boutons restent alignés.
6. Rubrique « Facturation », ouvre chaque question :
   - « Les prix incluent-ils la TVA ? » : « Le prix affiché est celui que vous payez. PULSACITY ne facture pas de TVA aujourd'hui : il n'y en a donc aucune à récupérer sur nos factures. »
   - « Que deviennent mes témoignages si j'arrête ? » : « Rien n'est supprimé : vos témoignages restent dans votre espace. Au plan Gratuit, 1 widget reste sur votre page, avec 15 témoignages validés, ceux mis en avant d'abord. Les nouveaux attendent dans votre espace, et vos autres widgets reviennent avec Essentiel. »
   - « Puis-je passer du mensuel à l'annuel ? » : « Oui, depuis votre espace. Le changement prend effet à la fin du mois déjà payé. L'année coûte 10 mois : 2 mois sont offerts. »
7. Lance dans la console : document.querySelector('meta[name="description"]').content. Attendu : « Commencez gratuitement. Essentiel à 9,99 € par mois, Pro pour retirer la mention PULSACITY. Prix finaux, sans engagement, 2 mois offerts à l'année. »

B. Accueil (https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/)
8. Section « Tarifs » : Gratuit « 0 € pour toujours » ; Essentiel « 9,99 € par mois » puis la ligne du prix de lancement avec « 14,99 € par mois » ; Pro « 19,99 € par mois » puis la ligne avec « 24,99 € par mois ». Les trois phrases (« Pour recueillir vos premiers avis. », etc.) sont sur la même ligne, les listes aussi.

C. CGV (https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/cgv)
9. Partie « 2. Prix » : « Les prix sont des prix finaux : le montant affiché est celui que vous payez, rien ne s'y ajoute. PULSACITY ne facture pas de TVA aujourd'hui. » ; « Essentiel : 14,99 € par mois, ou 149 € par an. » ; « Pro : 24,99 € par mois, ou 249 € par an. » ; puis « Prix de lancement : les bêta-testeurs et les 100 premiers abonnés payants paient Essentiel 9,99 € par mois ou 99 € par an, et Pro 19,99 € par mois ou 199 € par an. Ce prix est gardé à vie, tant que l'abonnement ne s'interrompt pas. »
10. Partie « 5. Changement de plan » : un plan supérieur tout de suite, ce qui reste déduit ; un plan inférieur, ou un changement de période, à la fin de la période déjà payée, sans remboursement. Partie « 9. Évolution des prix » : un nouveau prix pour les nouveaux abonnés seulement, une hausse exceptionnelle annoncée par e-mail 30 jours avant, une baisse pour tous tout de suite.

D. Intégrations (https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/integrations)
11. Trois lignes, et seulement trois : Systeme.io « Une demande d'avis après chaque vente ou inscription à une formation. » (Disponible) ; Stripe « Une demande d'avis après chaque paiement réussi. » (Bientôt) ; Calendly « Une demande d'avis après chaque rendez-vous passé. » (Bientôt).
12. Ouvre https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/integrations/kajabi : page introuvable. Ouvre https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/sitemap.xml : aucune adresse ne contient « kajabi », « zapier » ou « connecteur-universel ».

E. Espace
13. Ouvre https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/app/widgets : l'encadré du bas dit « Avec le plan Essentiel, à 9,99 € par mois, vous créez autant de widgets que vous voulez : un pour chaque page de vente. »
14. Ouvre https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/app/connecteurs : Systeme.io, puis Stripe et Calendly en « Bientôt », avec leurs textes d'avant (« Paiements en ligne : … », « Rendez-vous : … »), et aucun autre outil.

F. Textes qui ne supposent plus Systeme.io
15. Accueil (https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/) : sous le grand titre, « Après chaque vente, votre client reçoit un e-mail à votre nom qui lui demande son avis, au bon moment. Vous validez, et son témoignage s'affiche sur votre page de vente. » Dans « Comment ça marche », l'étape 1 : « Reliez l'outil où vous vendez », puis « Une adresse à coller une fois dans votre outil de vente, Systeme.io par exemple. Rien à installer. » Tout en bas : « Reliez l'outil où vous vendez : la prochaine vente fait le reste. »
16. Le même texte tout en bas de https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/integrations et de https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/guides. Sur https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/integrations/systeme-io : « … Plus simple depuis un ordinateur. » sous « Rien à installer », et tout en bas « Connectez Systeme.io : la prochaine vente fait le reste. » Sur https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/integrations/stripe : « L'avis se laisse depuis un téléphone. »
17. Cherche « Deux minutes » sur ces cinq pages : aucun résultat.
18. Accueil de l'espace (https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/app) : dans « Étapes restantes », l'étape s'appelle « Connecter votre outil de vente », et elle est cochée.
19. Sur https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/app/demandes, clique sur « Demander un avis » : sous le titre, « … Il reçoit le même e-mail qu'après une vente reçue d'un outil connecté, au nom de Julie Nutrition. » Ferme la fenêtre sans rien envoyer.
20. Ouvre un widget depuis https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/app/widgets (« Modifier ») : le guide sous l'éditeur s'appelle « Coller dans Systeme.io » et dit « 4 étapes », sans durée. Clique sur « Copier le code » : la phrase dessous devient « Collez-le maintenant dans votre page. Sur Systeme.io, suivez les 4 étapes ci-dessous. »

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu, sans adresse e-mail.
```

---

## 3. Recette à 360 px, sur l'aperçu

```
Tu continues la recette de PULSACITY sur l'aperçu https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app, dans un cadre de 360 px de large (outils de développement, mode appareil, largeur 360). Je suis connecté. Pour chaque point, note « OK » ou décris ce que tu vois.

1. https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/tarifs : les trois plans l'un sous l'autre. Sous « 9,99 € » et « par mois », la ligne du prix de lancement sur deux ou trois lignes, en entier ; pareil sous « 19,99 € ». Rien ne dépasse à droite : document.documentElement.scrollWidth vaut 360.
2. Touche « Annuel » : « 99 € », « 199 € », et les lignes avec « 149 € par an » et « 249 € par an ».
3. https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/ : section Tarifs, les trois plans l'un sous l'autre, la ligne du prix de lancement sous Essentiel et sous Pro, rien ne dépasse.
4. https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/cgv : la partie « 2. Prix » se lit sans défilement horizontal.
5. https://pulsacity-git-claude-determined-1b6fa6-jawadboughalems-projects.vercel.app/app/widgets : l'encadré « Avec le plan Essentiel, à 9,99 € par mois, … » en entier, rien ne dépasse.
6. Ouvre un widget (« Modifier »), puis l'onglet de l'installation : « Plus simple depuis un ordinateur », puis « Le code se colle dans l'éditeur de votre page, plus confortable sur grand écran. Recevez-le par e-mail et ouvrez-le sur votre ordinateur. » Touche « Copier le code » : « Collez-le dans votre page, dans un bloc de code HTML. Le guide Systeme.io vous montre où. »
7. Touche « M'envoyer le code », puis dis-moi : « Ouvrez l'e-mail du code, puis dites-moi OK. » Attends mon OK. Je vérifie moi-même : « Collez-le une seule fois dans un bloc de code HTML de votre page de vente. », puis « Sur Systeme.io : 4 étapes », sans durée.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 4. Vérification sur pulsacity.com, après la fusion

```
Tu vérifies la mise en ligne des nouveaux prix de PULSACITY sur https://pulsacity.com, fenêtre en grand. Tu ne te connectes pas et tu ne remplis aucun formulaire. Pour chaque point, note « OK » ou décris ce que tu vois.

1. https://pulsacity.com/tarifs : sous le titre, « … Sans engagement. Prix finaux : rien ne s'ajoute au paiement. » ; Essentiel « 9,99 € » avec « Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois. » ; Pro « 19,99 € » avec « … Ensuite, 24,99 € par mois. » ; les trois boutons à la même hauteur.
2. Ctrl+F « TVA comprise » sur /tarifs et sur https://pulsacity.com/ : aucun résultat.
3. « Les prix incluent-ils la TVA ? » dit « Le prix affiché est celui que vous payez. PULSACITY ne facture pas de TVA aujourd'hui : … ».
4. https://pulsacity.com/integrations : Systeme.io, Stripe et Calendly, avec leurs nouvelles phrases, et rien d'autre. Tout en bas : « Reliez l'outil où vous vendez : la prochaine vente fait le reste. »
5. https://pulsacity.com/cgv : bandeau « Brouillon », et la partie « 2. Prix » avec les prix publics puis le prix de lancement.
6. https://pulsacity.com/ : sous le grand titre, « Après chaque vente, votre client reçoit un e-mail à votre nom qui lui demande son avis, au bon moment. … », sans « Systeme.io » ; l'étape 1 de « Comment ça marche » est « Reliez l'outil où vous vendez ».

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## Claude Design — les décisions à appliquer dans la refonte v2

À coller dans le projet Claude Design « PULSACITY v2 », pendant la refonte graphique.

```
Avant de continuer la refonte, voici les décisions du 12 octobre déjà appliquées au site (lot 4.1). Respecte-les dans toutes les maquettes v2, et signale-moi toute maquette déjà faite qui les contredit.

1. Prix. Gratuit 0 €. Essentiel : 9,99 € par mois ou 99 € par an (prix de lancement), 14,99 € et 149 € ensuite. Pro : 19,99 € par mois ou 199 € par an, 24,99 € et 249 € ensuite. On affiche le prix de lancement comme le prix payé, et juste dessous, en petit : « Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois. » (24,99 € pour Pro ; « 149 € par an » et « 249 € par an » en Annuel). Ni prix barré, ni compteur. « Annuel : 2 mois offerts ».
2. Cette ligne n'existe que sous les plans payants : dans les colonnes de prix (Tarifs et accueil), prévois sa place pour que les boutons et les listes des trois plans restent alignés.
3. Plus jamais « TVA comprise » ni « HT » : PULSACITY ne facture pas de TVA. Sous le titre de Tarifs : « Prix finaux : rien ne s'ajoute au paiement. »
4. Plus de « tout Systeme.io ». Plusieurs outils sortent au lancement, d'autres suivent vite. Les textes généraux disent « l'outil où vous vendez » ; le bouton est « Connecter mon outil » et mène à la liste des connecteurs. Systeme.io n'est nommé que là où l'on parle de son connecteur ou de son guide.
5. Catalogue : 6 familles, 19 outils (decisions/connecteurs.md). Disponibles : Systeme.io et le connecteur universel. Les autres en « Bientôt », sans date, avec « En attendant : avec Zapier ou Make ». « Fonctionne avec … », jamais « partenaire officiel ».
6. Aucune durée d'installation ou de saisie (« 2 minutes », « en moins d'une minute ») tant qu'elle n'est pas chronométrée sur de vraies installations. La page de collecte et l'e-mail de demande en portent encore une (« Comptez moins d'une minute », « Donner mon avis (1 minute) ») : propose leur version v2 sans durée.
7. Rien d'inventé : aucun client, logo, compteur ni témoignage ; « Exemple, avis fictifs » sous chaque exemple, avec une note d'exemple à 4,7/5 plutôt que 4,9/5. Jamais « avis vérifiés ».

Les détails sont dans decisions/tarifs.md, connecteurs.md, positionnement.md et arbitrages.md (n° 1 et 2).
```
