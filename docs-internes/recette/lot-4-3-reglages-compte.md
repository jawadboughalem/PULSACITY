# Lot 4.3 — Réglages et Mon compte : recette

Dans l'ordre :
- Prompt 1 : la migration de recette, puis deux espaces de démonstration, remplis depuis la branche de la PR.
- Prompts 2 à 5 : recette sur l'aperçu, sur ordinateur.
- Prompt 6 : recette à 360 px.
- Prompt 7 : vérification sur pulsacity.com, après la fusion.

Ce lot ne touche à aucun service : aucune action à faire de votre côté sur Vercel, Supabase, Cloudflare, Resend ou Stripe, aucune variable. Une migration (0011, trois colonnes facultatives) : « Recette database migration » l'applique à la base de recette dès l'ouverture de la PR, « Database migration » à la production à la fusion.
Si la dernière recette date de plus d'une semaine, réveillez d'abord la base de recette (prompt 0 bis de `lot-4-1-decisions.md`).

Adresse de l'aperçu (PR #36) : https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app

Trois adresses e-mail que vous lisez, à garder pour vous (ne les collez pas dans les comptes rendus) :
- **A** : celle des recettes précédentes, pour l'espace principal ;
- **B** : une seconde, pour un espace qu'on supprimera (un alias « +recette » suffit si votre messagerie l'accepte) ;
- **C** : une troisième, sans espace sur la recette, pour essayer le changement d'adresse.

Déjà vérifié par Claude Code dans son conteneur :
- Réglages, Mon compte et « Votre espace est supprimé » à 360, 375, 768, 1024, 1440 px et 667 × 375 : aucun débordement, aucune erreur dans la console ;
- les parcours : erreurs et résumé de Réglages, adresse prise et sa suggestion, enregistrement, aperçu de l'e-mail ; changement d'adresse par le lien reçu, lien réutilisé refusé ; prénom ; deux appareils puis déconnexion de l'autre ; export téléchargé et relu ; suppression d'un second espace ;
- `pnpm lint`, `pnpm typecheck`, `pnpm build` ; `pnpm test` vert, sauf `decode-csv-file.test.ts`, qui échoue déjà sur `main` dans ce conteneur et passe en CI.

Ce que la recette regarde : que chaque réglage s'enregistre et agit vraiment (e-mails, page de collecte), que Mon compte tient ses promesses (lien à la nouvelle adresse, appareils, export, suppression), et que les écrans suivent leurs maquettes (`docs-internes/design-v2/maquettes/v2-espace-reglages-*`, `v2-espace-compte-*`, `v2-site-espace-supprime-*`).

---

## 1. GitHub — la migration, puis deux espaces de démonstration, depuis la branche de la PR

```
Tu m'aides à préparer la base de recette de PULSACITY pour une PR.

Étape 1, la migration :
1. Ouvre https://github.com/jawadboughalem/PULSACITY/actions/workflows/db-migrate-recette.yml
2. Regarde la dernière exécution pour la branche claude/focused-pascal-yy7058 : elle doit être verte. Si elle est encore en cours, attends sa fin. Si elle est rouge, arrête-toi et dis-le-moi.

Étape 2, deux espaces de démonstration :
1. Ouvre https://github.com/jawadboughalem/PULSACITY/actions/workflows/seed-recette.yml
2. Clique sur « Run workflow ».
3. « Use workflow from » : choisis la branche claude/focused-pascal-yy7058 (pas main).
4. « Adresse e-mail du compte de recette » : demande-moi l'adresse A et mets celle que je te donne.
5. Plan : free. Clique sur « Run workflow », puis attends la fin : l'exécution doit être verte.
6. Recommence les points 2 à 5, une fois la première exécution finie, avec l'adresse B que je te donnerai.

Ne touche surtout pas aux autres workflows, ni à la branche main.

Compte rendu à me donner : la couleur de l'exécution de la migration, puis celle des deux remplissages, avec la branche choisie. Pas les adresses e-mail.
```

---

## 2. Réglages sur ordinateur, sur l'aperçu (espace A)

Avant ce prompt : connectez-vous vous-même sur l'aperçu avec l'adresse A, fenêtre en grand. Gardez sous la main une petite image JPEG ou PNG (un logo) : l'agent vous demandera de la choisir.

```
Tu fais la recette de la page Réglages de PULSACITY sur l'aperçu https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app, fenêtre en grand (1440 px environ). Je suis connecté. Pour chaque point, note « OK » ou décris ce que tu vois. N'envoie aucune demande d'avis et ne supprime rien.

A. La page (https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/app/reglages)
1. Dans la colonne de gauche, « Réglages » est sur une pilule jaune. Grand titre « Réglages », puis « Votre espace, vos e-mails à vos clients, vos notifications. »
2. Au centre, quatre cartes blanches arrondies, dans cet ordre : « Votre espace », « E-mails à vos clients », « Vos notifications », « Contrepartie », puis le bouton jaune « Enregistrer les modifications ». À droite, une carte « Aperçu de votre page de collecte », qui reste visible quand tu fais défiler la page.
3. « Votre espace » : « Nom de votre activité » vaut « Julie Nutrition » ; « Logo » montre un rond bleu clair « JN » et le bouton « Choisir un logo » ; « Couleur d'accent » montre un carré vert et « #4F6F52 » ; « Adresse de votre page de collecte » montre, dans le même champ, une partie grise (l'adresse de l'aperçu suivie de « /t/ ») puis « julie-nutrition » (parfois suivi de six caractères, si l'adresse était déjà prise sur la recette). Note cette fin d'adresse.
4. « E-mails à vos clients » : l'adresse de réponse est remplie ; « Adresse postale de l'expéditeur » montre trois lignes : « Julie Martin », « 12 rue des Lilas », « 69003 Lyon ». Puis le bouton « Voir l'e-mail de demande » et la phrase « Le délai d'envoi se règle pour chaque offre, dans Offres. », « Offres » souligné.
5. « Vos notifications » : « Recevoir l'e-mail « Nouveau témoignage » », et à droite un interrupteur allumé (piste bleu marine, rond jaune). « Contrepartie » : la case « J'offre une contrepartie à mes clients » est vide.
6. L'aperçu de droite : un bandeau bleu clair avec « JN », « Julie Nutrition » et « Votre avis sur « Programme 30 jours » ? », cinq étoiles vides, un bouton vert « Envoyer mon avis » à texte blanc, et « Exemple d'offre. Le bouton prend votre couleur d'accent. »

B. L'aperçu suit ce qu'on tape (rien n'est enregistré dans cette partie)
7. Remplace le nom par « Julie Nutrition Lyon » : l'aperçu de droite change de nom aussitôt.
8. Dans le champ de la couleur, remplace « #4F6F52 » par « #F2C94C » : le carré devient jaune ; sous la couleur, un message ambre « Cette couleur ressort peu sur fond blanc : vos étoiles seraient peu lisibles. Choisissez-la plus foncée. » ; le bouton de l'aperçu devient jaune, à texte bleu marine.
9. Recharge la page : le nom et la couleur reviennent à « Julie Nutrition » et « #4F6F52 ».

C. Le logo
10. Clique « Choisir un logo » et demande-moi de choisir une image. Une fois choisie : « Envoi du logo… » s'affiche un instant, puis le rond montre l'image, le bouton devient « Changer de logo », un lien « Retirer » apparaît, et l'aperçu de droite montre l'image dans son rond.
11. Clique « Enregistrer les modifications » : un message bleu marine « Modifications enregistrées. » apparaît en bas au centre de l'écran, avec une coche jaune, puis disparaît seul après quelques secondes.
12. Recharge la page : le logo est toujours là. Ouvre le menu du compte en bas à gauche : l'avatar montre le logo, avec « Julie Nutrition ».

D. La contrepartie et la couleur sur la page de collecte
13. Coche « J'offre une contrepartie à mes clients » : un encadré bleu très pâle apparaît dessous, « Mention affichée sous vos widgets : « Certains clients ont reçu une contrepartie pour leur avis. » ». Clique « Enregistrer les modifications », puis recharge : la case est toujours cochée. Décoche-la et enregistre de nouveau.
14. Ouvre https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/t/ suivi de la fin d'adresse notée au point 3, puis /programme-30-jours, dans un nouvel onglet : le bouton « Envoyer mon avis » en bas est vert (#4F6F52), à texte blanc ; survolé, il fonce un peu. N'envoie rien. Ferme l'onglet.

E. L'aperçu de l'e-mail
15. Clique « Voir l'e-mail de demande » : une fenêtre s'ouvre au centre, « Aperçu de l'e-mail de demande », avec en haut « De : Julie Nutrition via PULSACITY · Objet : Camille, votre avis sur Programme 30 jours ? », puis l'e-mail dessiné : le logo choisi au point 10, « Bonjour Camille, », le bouton rouge « Donner mon avis (1 minute) » (l'ancien style des e-mails, attendu jusqu'au lot 4.8), et tout en bas « Julie Martin · 12 rue des Lilas · 69003 Lyon » puis « Ne plus recevoir ces e-mails ».
16. Dessous : « Exemple, pour un client fictif. Le texte reste celui de PULSACITY ; votre nom, votre logo et votre adresse postale s'y appliquent. » Clique « Fermer » : la fenêtre se ferme. Rouvre-la, puis appuie sur Échap : elle se ferme aussi.
17. Vide l'adresse postale (sans enregistrer), puis rouvre l'aperçu : la ligne de l'adresse a disparu du bas de l'e-mail. Ferme la fenêtre et recharge la page sans enregistrer.

F. Le lien vers Offres et le clavier
18. Clique « Offres » dans la phrase du délai : la page Offres s'ouvre. Reviens sur Réglages.
19. Appuie sur Tab depuis le haut de la page : chaque champ et chaque bouton atteint montre un anneau bleu marine ; le carré de couleur aussi ; l'interrupteur se bascule avec la barre d'espace (remets-le comme avant, sans enregistrer).

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 3. Les réglages agissent sur les e-mails (espace A, votre boîte A)

Avant ce prompt : toujours connecté avec l'adresse A. Ouvrez votre boîte A dans un autre onglet : l'agent vous demandera ce que vous y voyez.

```
Tu continues la recette de Réglages de PULSACITY sur l'aperçu https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app. Je suis connecté. Pour chaque point, note « OK » ou décris ce que tu vois. Quand un point demande de regarder ma boîte e-mail, demande-moi ce que j'y vois et note ma réponse.

A. L'adresse postale dans un vrai e-mail
1. Va sur https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/app/demandes et clique « Demander un avis ». Demande-moi une adresse e-mail que je lis (je te donnerai la mienne) et remplis : prénom « Recette », adresse donnée, offre « Programme 30 jours », date du jour, coche la case « Cette personne a acheté cette offre auprès de moi. », puis envoie. Si on te répond qu'une demande existe déjà pour cette personne et cette offre, choisis une autre offre.
2. Sur la ligne de cette demande, clique « Envoyer maintenant ».
3. Demande-moi si l'e-mail « Recette, votre avis sur … ? » est arrivé, et ce qu'il y a tout en bas : on attend la ligne « Julie Martin · 12 rue des Lilas · 69003 Lyon », avant « Ne plus recevoir ces e-mails ». Demande-moi aussi si l'e-mail est lisible sur mon téléphone sans grande marge blanche de chaque côté.

B. L'interrupteur « Nouveau témoignage »
4. Sur https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/app/reglages, éteins l'interrupteur « Recevoir l'e-mail « Nouveau témoignage » » (la piste devient grise, le rond gris à gauche) et clique « Enregistrer les modifications ». Attends « Modifications enregistrées. ».
5. Dans Réglages, note la fin de l'adresse de la page de collecte (« julie-nutrition », parfois suivi de six caractères). Dans une fenêtre de navigation privée, ouvre https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/t/ suivi de cette fin d'adresse, puis /programme-30-jours ; passe la protection de Vercel si elle s'affiche (demande-moi), choisis 5 étoiles, écris « Témoignage de recette, interrupteur éteint. », prénom « Recette Un », coche la case d'accord et clique « Envoyer mon avis ».
6. Demande-moi, deux minutes plus tard, si un e-mail « Nouveau témoignage » est arrivé dans ma boîte A : on attend qu'il n'y en ait AUCUN.
7. Rallume l'interrupteur, enregistre, puis envoie de la même façon un second témoignage « Témoignage de recette, interrupteur allumé. », prénom « Recette Deux ».
8. Demande-moi si, cette fois, l'e-mail « Nouveau témoignage » de Recette Deux est arrivé : on l'attend.
9. Dans https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/app/temoignages, les deux témoignages sont « En attente ». Ne les valide pas.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Ne recopie aucune adresse e-mail.
```

---

## 4. Mon compte sur ordinateur (espace A, boîtes A et C)

Avant ce prompt : toujours connecté avec l'adresse A. Pour le point 5, ouvrez aussi l'aperçu sur votre téléphone et connectez-vous avec l'adresse A.

```
Tu fais la recette de la page Mon compte de PULSACITY sur l'aperçu https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app, fenêtre en grand. Je suis connecté. Pour chaque point, note « OK » ou décris ce que tu vois. Quand un point demande de regarder une boîte e-mail, demande-moi ce que j'y vois. Ne supprime rien dans cette partie.

A. La page
1. Ouvre le menu du compte en bas à gauche et clique « Mon compte » : l'adresse devient /app/compte. Grand titre « Mon compte », puis « Ce qui vous concerne, vous : votre adresse de connexion, vos appareils, vos données. »
2. Cinq cartes blanches, dans cet ordre : « Adresse de connexion », « Votre prénom », « Appareils connectés », « Exporter mes données », « Supprimer mon espace ».

B. Le prénom
3. Dans « Prénom (facultatif) », écris « Julie » (ou garde-le s'il y est déjà), puis clique « Enregistrer » : « Prénom enregistré. » apparaît en bas au centre.
4. Clique « Accueil » dans la colonne de gauche : le grand titre dit « Bonjour Julie ». Reviens sur Mon compte.

C. Les appareils
5. Demande-moi de me connecter à l'aperçu sur mon téléphone avec la même adresse, puis recharge Mon compte. « Appareils connectés » montre cet ordinateur en premier, avec « Cet appareil · actif maintenant », puis le téléphone (par exemple « Safari sur iPhone » ou « Chrome sur Android ») avec « Dernière visite le … ». Dessous, « Se déconnecter partout ailleurs » et « Cet appareil reste connecté. »
6. Clique « Se déconnecter partout ailleurs » : « Vos autres appareils sont déconnectés. » ; la liste ne montre plus que cet ordinateur, et le bouton disparaît. Demande-moi de recharger la page sur mon téléphone : on attend la page de connexion.

D. L'export
7. Clique « Préparer le fichier » : un bandeau crème « Préparation de votre fichier… » s'affiche un instant, puis un bandeau vert « Votre fichier est prêt. » avec « Préparé le … à … h … », et un bouton jaune « Télécharger le fichier ».
8. Clique « Télécharger le fichier » : un fichier « pulsacity-<fin de l'adresse de la page de collecte>-<date du jour>.json » est téléchargé. Ouvre-le dans un onglet : il contient les parties « fichier », « compte », « espace », « offres », « widgets », « clients », « ventes », « demandes », « temoignages » ; « espace » donne « Julie Nutrition » et l'adresse postale ; les deux témoignages de recette du prompt 3 y sont, avec leur « consentement ». Le fichier ne parle que de cet espace : sa partie « espace » donne l'adresse de la page de collecte vue dans Réglages, et aucune autre page de collecte n'y figure, sauf celles de ses offres.

E. Le changement d'adresse de connexion
9. Clique « Changer d'adresse » : « Aujourd'hui : … » rappelle l'adresse actuelle, puis le champ « Nouvelle adresse », le bouton « Envoyer le lien », le lien « Annuler », et « Nous envoyons un lien à la nouvelle adresse. Elle remplace l'ancienne dès que vous cliquez dessus. »
10. Écris « recette@exemple » et clique « Envoyer le lien » : le champ prend un bord rouge et le message « Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr. » apparaît juste dessous.
11. Demande-moi l'adresse C et écris-la, puis clique « Envoyer le lien » : un bandeau vert « Un lien est parti à <adresse C>. » avec « Votre adresse change quand vous cliquez dessus. D'ici là, gardez celle-ci : <adresse A>. »
12. Demande-moi si l'e-mail « Confirmez votre nouvelle adresse de connexion » est arrivé dans la boîte C, et de cliquer sur « Confirmer cette adresse » dans cette fenêtre de navigateur. On attend le retour sur Mon compte, avec « Adresse de connexion changée. » en bas, et l'adresse C dans « Adresse de connexion ».
13. Demande-moi de cliquer une seconde fois sur le même lien : on attend Mon compte avec un bandeau rouge « Ce lien ne marche plus. »
14. Remets l'adresse A de la même façon (« Changer d'adresse », adresse A, lien reçu dans la boîte A, clic). On attend de nouveau « Adresse de connexion changée. » et l'adresse A.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Ne recopie aucune adresse e-mail : écris « A », « C ».
```

---

## 5. La suppression d'un espace (espace B)

Avant ce prompt : déconnectez-vous de l'espace A, puis connectez-vous vous-même sur l'aperçu avec l'adresse B, fenêtre en grand.

```
Tu fais la recette des erreurs de Réglages, puis de la suppression d'un espace, sur l'aperçu https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app. Je suis connecté avec un espace de test qu'on va supprimer. Pour chaque point, note « OK » ou décris ce que tu vois.

A. Les erreurs de Réglages (https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/app/reglages)
1. Note la fin de l'adresse de la page de collecte : « julie-nutrition- » suivi de six caractères (l'adresse « julie-nutrition » était déjà prise).
2. Vide « Nom de votre activité », remplace l'adresse de la page de collecte par « julie-nutrition », remplace l'e-mail de réponse par « julie@exemple », puis clique « Enregistrer les modifications ».
3. En haut, un bandeau rouge « 3 points à corriger avant d'enregistrer », qui prend le focus, avec trois liens soulignés : « Nom de votre activité : indiquez le nom de votre activité. », « Adresse de votre page de collecte : déjà prise. », « E-mail de réponse : adresse incomplète. »
4. Clique le deuxième lien : la page se rend au champ de l'adresse et le focus y est. Le champ a un bord rouge, avec à sa droite le bouton « Prendre julie-nutrition-2 » (ou un autre numéro), et dessous « Cette adresse est déjà prise par un autre espace. »
5. Le nom vide a un bord rouge et « Indiquez le nom de votre activité. » juste dessous ; l'e-mail de réponse aussi, avec « Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr. »
6. Recharge la page sans rien enregistrer : l'espace a gardé son nom et son adresse du point 1.

B. La suppression (https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/app/compte)
7. Fais défiler jusqu'à « Supprimer mon espace » : quatre puces (« Vos témoignages, vos offres et vos clients sont effacés. », « Vos widgets disparaissent de vos pages de vente. », « Votre abonnement s'arrête : plus aucun prélèvement. », « Vos factures sont gardées, comme la loi l'impose. »), « L'effacement est immédiat et définitif. Pensez à exporter vos données avant. », et un bouton blanc bordé de rouge, « Supprimer mon espace ».
8. Clique-le : une fenêtre s'ouvre, « Supprimer l'espace Julie Nutrition ? », les mêmes puces, « Pour confirmer, écrivez le nom de votre espace : Julie Nutrition », un champ qui a le focus, « Le bouton s'active quand le nom est écrit à l'identique. », « Annuler » et « Supprimer définitivement » (rouge, grisé).
9. Écris « julie nutrition » : le bouton reste grisé. Appuie sur Échap : la fenêtre se ferme, rien n'est supprimé.
10. Rouvre-la, écris exactement « Julie Nutrition » : le bouton devient rouge. Clique « Supprimer définitivement » : « Suppression… » un instant, puis la page « Votre espace est supprimé. », sur le site public (en-tête et pied de page du site) : une bulle bleu clair avec une coche et un point corail, « Votre session est fermée. Vos témoignages ne s'affichent plus, et plus aucun prélèvement ne sera fait. », « Vos factures restent disponibles : écrivez-nous si vous en avez besoin. », le bouton « Revenir à l'accueil » et le lien « Écrivez-nous ».
11. Survole « Écrivez-nous » : il mène à « mailto:contact@pulsacity.com ». Ne clique pas.
12. Ouvre https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/app : on attend la page de connexion.
13. Ouvre https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/t/ suivi de l'adresse notée au point 1 : on attend la page « Cette page n'existe pas ».

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Ne recopie aucune adresse e-mail.
```

---

## 6. Réglages et Mon compte à 360 px (espace A)

Avant ce prompt : connectez-vous de nouveau avec l'adresse A.

```
Tu fais la recette de Réglages et de Mon compte de PULSACITY à la largeur d'un téléphone, sur l'aperçu https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app. Je suis connecté. Règle la fenêtre (ou les outils de développement, mode appareil) sur 360 px de large. Pour chaque point, note « OK » ou décris ce que tu vois. Rien ne doit déborder sur le côté : pas de défilement horizontal.

A. Réglages (https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/app/reglages)
1. En haut, l'en-tête blanc avec le logo et l'avatar ; dessous, sur le fond bleu pâle, « ‹ Plus », puis le titre « Réglages » (sans la phrase de sous-titre).
2. Les cartes se suivent sur toute la largeur : « Votre espace », puis l'aperçu de la page de collecte, puis « E-mails à vos clients », « Vos notifications », « Contrepartie », et le bouton jaune « Enregistrer les modifications » sur toute la largeur. Rien n'est caché par la barre d'onglets en bas (Accueil, Témoignages, Demandes, Plus, « Plus » en jaune).
3. Vide le nom, mets « julie@exemple » en e-mail de réponse, puis « Enregistrer les modifications » : le bandeau rouge dit « 2 points à corriger », avec seulement les noms des champs : « Nom de votre activité », « E-mail de réponse ».
4. Remplace l'adresse de la page de collecte par une adresse d'un autre espace si tu en connais une (sinon passe ce point) et enregistre : le champ garde toute sa hauteur, le message « Cette adresse est déjà prise par un autre espace. » est juste dessous, puis le bouton « Prendre … ». Recharge la page sans enregistrer.
5. Clique « Voir l'e-mail de demande » : la fenêtre monte du bas de l'écran, en feuille ; l'e-mail y tient en largeur, réduit, lisible. Ferme-la.
6. Modifie la contrepartie (coche, puis décoche), enregistre : « Modifications enregistrées. » apparaît au-dessus de la barre d'onglets, sans la couvrir.

B. Mon compte (https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/app/compte)
7. « ‹ Plus », le titre « Mon compte », puis les cinq cartes ; les boutons gardent leur taille, l'adresse e-mail ne déborde pas.
8. Clique « Préparer le fichier » : le bandeau vert, puis « Télécharger le fichier » sur toute la largeur.
9. Clique « Supprimer mon espace » : la fenêtre monte du bas, « Supprimer définitivement » au-dessus d'« Annuler », tous deux sur toute la largeur. Clique « Annuler » : rien n'est supprimé.

C. La page « Plus » (https://pulsacity-git-claude-focused-pa-64f557-jawadboughalems-projects.vercel.app/app/plus)
10. Dans « Votre espace », « Réglages » mène à Réglages ; dans « Votre compte », « Mon compte » mène à Mon compte.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 7. Vérification sur pulsacity.com, après la fusion

Avant ce prompt : la PR est fusionnée, « CI » et « Database migration » sont verts sur `main`, et le déploiement de production est en ligne. Connectez-vous vous-même sur https://pulsacity.com avec votre compte de test de production.

```
Tu vérifies sur la production de PULSACITY les pages Réglages et Mon compte. Je suis connecté sur https://pulsacity.com avec un compte de test. Tu ne supprimes rien, tu ne changes pas l'adresse de connexion, tu n'envoies aucune demande. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Ouvre https://github.com/jawadboughalem/PULSACITY/actions/workflows/db-migrate.yml : la dernière exécution, sur main, est verte.
2. https://pulsacity.com/app/reglages s'affiche, avec les quatre cartes, l'aperçu de la page de collecte à droite, et l'adresse de la page de collecte qui commence par « pulsacity.com/t/ ».
3. Clique « Voir l'e-mail de demande » : l'e-mail s'affiche dans la fenêtre, avec « De : <nom de l'espace> via PULSACITY ». Ferme-la.
4. Éteins puis rallume l'interrupteur « Nouveau témoignage » et clique « Enregistrer les modifications » : « Modifications enregistrées. »
5. https://pulsacity.com/app/compte s'affiche, avec les cinq cartes. « Appareils connectés » montre cet ordinateur avec « Cet appareil · actif maintenant ».
6. Clique « Préparer le fichier », puis « Télécharger le fichier » : le fichier JSON est téléchargé et s'ouvre.
7. Le menu du compte (en bas à gauche) : « Mon compte » mène à /app/compte. La navigation : « Réglages » mène à /app/reglages.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```
