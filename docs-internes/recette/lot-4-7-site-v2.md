# Lot 4.7 — Le site public en v2 : recette

Dans l'ordre :
- Prompt 1 : l'accueil sur ordinateur, avec ses deux démos.
- Prompt 2 : l'accueil à 360 px, la barre fixe et le menu.
- Prompt 3 : Tarifs, sur ordinateur puis à 360 px.
- Prompt 4 : Intégrations et les pages des outils.
- Prompt 5 : Guides, les pages de lecture (un guide, les textes légaux, « À propos de ces avis ») et Aide.
- Prompt 6 : les pages d'erreur et les images de partage.
- Action 7, à faire vous-même : Lighthouse sur l'accueil et sur la page Systeme.io.
- Prompt 8 : vérification sur pulsacity.com, après la fusion, à la toute fin avec celles des autres lots.

Ce lot ne touche à aucun service : aucune action sur Vercel, Supabase, Cloudflare, Resend ou Stripe, aucune variable, aucune migration. Il change l'apparence du site public et ses textes (`positionnement.md`, arbitrages n° 1 et 2), pas ce que fait le produit : la recette regarde chaque page à côté de sa maquette (`docs-internes/design-v2/maquettes/v2-site-*`, index dans `INDEX.md`, partie « Le site public — prompt 3.5 ») et vérifie que chaque bouton mène où il faut.
Pas besoin d'espace de démonstration : le site public se regarde sans être connecté. Si la dernière recette date de plus d'une semaine, réveillez d'abord la base de recette (prompt 0 bis de `lot-4-1-decisions.md`) : « Me prévenir » et « Dites-nous quel outil » y écrivent.

Adresse de l'aperçu (PR #46) : https://pulsacity-git-claude-beautiful-6a2566-jawadboughalems-projects.vercel.app

Maquettes : https://github.com/jawadboughalem/PULSACITY/tree/claude/beautiful-noether-lfdgg8/docs-internes/design-v2/maquettes (fichiers « v2-site-… »).

Une adresse e-mail que vous lisez, à garder pour vous (ne la collez pas dans les comptes rendus) : **B**, un alias « +lot47 » de votre adresse habituelle si votre messagerie l'accepte, pour « Me prévenir ». Aucun e-mail n'y part : l'adresse attend la sortie de l'outil.

Déjà vérifié par Claude Code dans son conteneur :
- chaque page à 1440 et 360 px, à côté de sa maquette, avec ses états (démo : saisie, erreurs, avis sur le mur ; widget : six combinaisons ; Tarifs : mensuel, annuel, prix de lancement ; Intégrations : filtre, « Dites-nous quel outil » ; « Me prévenir » : adresse incomplète, inscrit ; menu ouvert ; erreurs) : aucun débordement, aucune erreur dans la console sur 19 adresses ;
- aucun lien mort ni ancre manquante sur 40 pages ;
- Lighthouse sur la version de production, téléphone : performance 97 à 99, accessibilité 100, bonnes pratiques 100 sur onze pages, dont `/integrations/systeme-io` (98) ; SEO 100, sauf les textes légaux et « À propos de ces avis » (69 : hors index tant que les textes ne sont pas validés, voulu) ; ordinateur : 100 partout sur l'accueil et `/integrations/systeme-io` ;
- `pnpm lint`, `pnpm typecheck`, `pnpm build` ; `pnpm test` vert, sauf `decode-csv-file.test.ts`, qui échoue déjà sur `main` dans ce conteneur et passe en CI.

Écarts gardés avec la maquette, à trancher par vous (détail dans la PR) : grand titre de l'accueil en 72 px ; bande des outils sur Ciel ; section 10 (« Les premiers créateurs » tant que le mur de PULSACITY n'existe pas) ; avis de test sans prénom signé « Vous » ; exemple de widget dans son dessin actuel jusqu'au lot 4.8 ; voile du menu à 56 % et chevrons en Encre ; 64 px au-dessus du titre des pages légales ; CGV sans la ligne « régime de TVA » de la maquette ; texte des pages d'erreur en 17 px au téléphone ; séparateur « · PULSACITY » dans les titres ; textes des guides repris du code. Ne les relevez pas comme des défauts dans les comptes rendus.

---

## 1. L'accueil sur ordinateur

Avant ce prompt : fenêtre en grand. Si l'aperçu demande de vous identifier à Vercel, faites-le vous-même.

```
Tu fais la recette de l'accueil du site PULSACITY sur l'aperçu https://pulsacity-git-claude-beautiful-6a2566-jawadboughalems-projects.vercel.app, fenêtre en grand (1440 px environ). Je ne suis pas connecté à l'espace. Pour chaque point, note « OK » ou décris ce que tu vois. Compare à la maquette https://github.com/jawadboughalem/PULSACITY/blob/claude/beautiful-noether-lfdgg8/docs-internes/design-v2/maquettes/v2-site-accueil-desktop-01-page-entiere.png et note toute différence de disposition, de couleur ou d'espacement. Ne crée aucun compte. Ne relève pas les erreurs réseau vues par ton outil de surveillance du navigateur : elles ne font pas foi.

A. Le haut de page
1. L'en-tête blanc : le logo, puis Intégrations · Tarifs · Guides · Se connecter, et le bouton blanc bordé « Créer mon espace gratuit ». Fais défiler un peu : l'en-tête reste en haut, avec une ombre légère.
2. Le grand titre « Vous vendez. PULSACITY demande l'avis. », une phrase, le bouton jaune « Créer mon espace gratuit », le lien souligné « Voir comment ça marche » à sa droite, et dessous en petit gris « Gratuit, sans carte bancaire. Vous payez le prix affiché. Données hébergées dans l'Union européenne. »
3. À droite, un grand aplat jaune arrondi : une pastille blanche avec les étoiles et « 4,7/5 », une carte blanche avec une citation et son auteur, et « Exemple, avis fictifs » en petit.
4. Clique « Voir comment ça marche » : la page descend à « De la vente au témoignage, sans y penser ». Remonte.

B. Les sections, dans l'ordre
5. « Fonctionne avec l'outil où vous encaissez », sur fond bleu clair : une phrase, six pastilles blanches d'outils (Systeme.io, Connecteur universel, Stripe, Calendly, Learnybox, Kajabi) avec un carré d'initiales, puis « Voir toutes les intégrations ».
6. « Vos clients sont contents. Votre page de vente ne le dit pas. », sur fond bleu très pâle : un texte et le grand chiffre « 93 % » avec sa source en lien.
7. « De la vente au témoignage, sans y penser » : quatre étapes numérotées dans des disques jaunes (La vente, L'e-mail, L'avis, Le mur), chacune avec son petit dessin, puis « Exemple, avis fictifs ».
8. Dessous, une bande bleu clair avec le bouton blanc bordé « Écrire un avis de test ». Clique-le : un formulaire s'ouvre (« Votre note » en étoiles, « Votre avis », « Votre prénom (facultatif) »), le bouton jaune « Envoyer mon avis », et une phrase qui dit que rien n'est enregistré. Compare à v2-site-accueil-desktop-02-avis-de-test-saisie.png.
9. Clique « Envoyer mon avis » sans rien remplir : « Choisissez une note. » et « Écrivez quelques mots pour voir votre avis sur le mur. » s'affichent en rouge. Compare à v2-site-accueil-desktop-03-avis-de-test-erreur.png.
10. Choisis 5 étoiles, écris « Avis de test de la recette », laisse le prénom vide, et envoie : « Votre avis est arrivé sur le mur. » en vert, et ton avis apparaît en premier sur « Le mur de démonstration », signé « Vous », avant trois avis d'exemple. Compare à v2-site-accueil-desktop-04-avis-de-test-avis-sur-le-mur.png. Recharge la page : ton avis a disparu.
11. « Il prend les couleurs de votre page », sur fond bleu très pâle : deux groupes de boutons (Mur, Carrousel, Badge ; Clair, Sombre) et, dessous, un cadre « Page de vente de Julie Nutrition · exemple » avec le widget. Essaie Carrousel, puis Badge, puis Sombre avec Mur, puis Sombre avec Carrousel : le widget change à chaque fois, la page sous le cadre ne saute pas, et « Exemple, avis fictifs » reste dessous. Compare aux maquettes v2-site-accueil-desktop-05 à 08.
12. Le lien « Votre site est-il compatible ? » mène à /integrations, à la partie « Compatible avec votre site ». Reviens.
13. « Le bon moment pour chaque offre » : trois cartes bleu très pâle avec une icône dans un rond blanc.
14. « Reliez l'outil où vous encaissez » : les six familles, chacune sur une carte blanche avec ses outils ; « Voir toutes les intégrations » (bouton bordé) et le lien « Votre outil n'y est pas ? Dites-nous lequel. », qui mène à « Dites-nous quel outil » sur /integrations.
15. « Des avis de vrais clients, et la preuve qui va avec » : cinq lignes cochées en vert et le lien « À propos de ces avis ».
16. « Gratuit pour commencer, moins de 10 € ensuite » : trois colonnes (Gratuit, Essentiel sur fond bleu clair, Pro), avec 0 €, 9,99 € et 19,99 € par mois, la ligne « Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois. » sous Essentiel (24,99 € sous Pro), puis « Annuel : 2 mois offerts. Dépasser une limite ne supprime jamais rien. », le bouton jaune et « Voir les tarifs ». Compare à v2-site-accueil-desktop-09-tarifs-prix-de-lancement.png.
17. « PULSACITY est nouveau. Vous ne verrez ici aucun avis inventé. » sur un aplat jaune, avec « Écrivez-nous ».
18. « Vos questions » : neuf questions ; la première est ouverte. Ouvre-en une autre.
19. L'appel final, centré : « Votre prochaine vente peut devenir votre prochain témoignage », une phrase, le bouton jaune et « Gratuit, sans carte bancaire. ». Puis le pied de page bleu marine avec ses liens.

C. Les liens
20. Clique « Créer mon espace gratuit » du haut : on arrive sur /inscription. N'écris rien, reviens.
21. Nulle part tu ne vois « TVA comprise », « HT », « avis vérifiés », un prix barré, un nombre de places restantes, ni de flèche « → » dans un bouton.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 2. L'accueil à 360 px, la barre fixe et le menu

```
Tu fais la recette de l'accueil du site PULSACITY à la largeur d'un téléphone, sur l'aperçu https://pulsacity-git-claude-beautiful-6a2566-jawadboughalems-projects.vercel.app. Règle la fenêtre (ou le mode appareil) sur 360 px de large. Pour chaque point, note « OK » ou décris ce que tu vois. Rien ne doit déborder sur le côté : pas de défilement horizontal. Compare aux maquettes « mobile » de https://github.com/jawadboughalem/PULSACITY/tree/claude/beautiful-noether-lfdgg8/docs-internes/design-v2/maquettes (fichiers « v2-site-accueil-mobile-… » et « v2-site-menu-mobile-… »). Ne crée aucun compte.

A. La page
1. L'en-tête : le logo et le bouton à trois traits « Ouvrir le menu ». Le grand titre sur trois ou quatre lignes, le bouton jaune sur toute la largeur, « Voir comment ça marche » dessous, puis la mention en petit. Compare à v2-site-accueil-mobile-01-page-entiere-1-sur-2.png.
2. Fais défiler toute la page : les sections dans le même ordre que sur ordinateur, les étapes de la démo empilées, les colonnes de prix empilées. Compare à v2-site-accueil-mobile-02-page-entiere-2-sur-2.png.

B. La barre fixe
3. En haut de page : pas de barre en bas de l'écran (v2-site-accueil-mobile-10-barre-fixe-haut-de-page.png).
4. Fais défiler jusqu'à ce que le bouton jaune du haut sorte de l'écran : une barre blanche apparaît en bas, avec « Gratuit, sans carte bancaire » et le bouton jaune « Créer mon espace gratuit » (v2-site-accueil-mobile-11-barre-fixe-en-defilant.png).
5. Ouvre « Écrire un avis de test » et touche le champ « Votre avis » : la barre disparaît tant que le champ est actif (v2-site-accueil-mobile-12-barre-fixe-clavier-ouvert.png). Envoie un avis de 4 étoiles avec le prénom « Inès » : il arrive sur le mur, signé « Inès ».
6. Descends jusqu'à l'appel final : la barre disparaît dès qu'il entre à l'écran (v2-site-accueil-mobile-13-barre-fixe-appel-final.png). Rien du pied de page n'est caché par la barre.

C. Le widget et les prix
7. Essaie Carrousel, Badge et Sombre : chaque exemple tient dans la largeur, « Exemple, avis fictifs » dessous.

D. Le menu
8. Ouvre /integrations, puis touche « Ouvrir le menu » : un panneau blanc sous l'en-tête, aux coins bas arrondis, avec Intégrations (sur fond bleu clair, c'est la page en cours), Tarifs, Guides, Se connecter, chacun avec un chevron ; puis le bouton jaune « Créer mon espace gratuit » sur toute la largeur et « Gratuit, sans carte bancaire. » dessous. La page derrière est assombrie. Le bouton est devenu une croix « Fermer le menu ». Compare à v2-site-menu-mobile-02-ouvert.png.
9. Touche la partie assombrie : le menu se ferme. Rouvre-le et touche « Tarifs » : on arrive sur Tarifs, menu fermé.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 3. Tarifs, sur ordinateur puis à 360 px

```
Tu fais la recette de la page Tarifs du site PULSACITY sur l'aperçu https://pulsacity-git-claude-beautiful-6a2566-jawadboughalems-projects.vercel.app/tarifs. Pour chaque point, note « OK » ou décris ce que tu vois. Compare aux maquettes « v2-site-tarifs-… » de https://github.com/jawadboughalem/PULSACITY/tree/claude/beautiful-noether-lfdgg8/docs-internes/design-v2/maquettes. Ne crée aucun compte et ne paie rien.

A. Ordinateur, fenêtre en grand
1. Sur fond bleu très pâle : le titre « Un prix simple, qui suit vos ventes. », une phrase, « Prix finaux : rien ne s'ajoute au paiement. » en gras, puis la bascule Mensuel / Annuel (Mensuel choisi, sur fond bleu marine) et « Annuel : 2 mois offerts » à sa droite.
2. Trois colonnes : Gratuit et Pro sur fond blanc, Essentiel sur fond bleu clair avec « Recommandé » au-dessus du nom. Prix : 0 €, 9,99 € et 19,99 € « par mois », la ligne « Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois. » (24,99 € sous Pro), la phrase, la liste cochée en vert, le bouton (« Créer mon espace gratuit », « Choisir Essentiel » en jaune, « Choisir Pro »). Les boutons et les listes sont alignés d'une colonne à l'autre. Compare à v2-site-tarifs-desktop-01-mensuel-prix-de-lancement.png.
3. Choisis Annuel : 99 € et 199 € « par an », « Ensuite, 149 € par an. » et « Ensuite, 249 € par an. ». Compare à v2-site-tarifs-desktop-02-annuel-prix-de-lancement.png. Reviens à Mensuel.
4. Sous les colonnes, centré : « Sans engagement · Changez de plan à tout moment · Paiement par carte ».
5. « Comparer en détail » : des bandes blanches séparées, la colonne Essentiel bleu clair d'un seul tenant dans chaque groupe, des coches vertes. On n'y voit pas « Témoignages vidéo ». On y voit « Corriger le texte avec l'accord du client » et « Demandes saisies à la main » (20 par jour).
6. « Facturation » : des questions dépliables, dont « Les prix incluent-ils la TVA ? » ; ouvre-la : la réponse parle de prix finaux, sans « TVA comprise » ni « HT ».
7. Clique « Choisir Essentiel » : comme tu n'es pas connecté, on arrive sur /inscription. N'écris rien, reviens.

B. Téléphone, 360 px
8. Le titre, la bascule et « Annuel : 2 mois offerts » dessous ; les colonnes empilées ; aucun débordement. Compare à v2-site-tarifs-mobile-01-mensuel-prix-de-lancement-1-sur-2.png.
9. « Comparer en détail » : un sélecteur Gratuit / Essentiel / Pro, et une seule valeur par ligne, à droite, en gras. Choisis Gratuit puis Pro : les valeurs changent (v2-site-tarifs-mobile-06-comparatif-gratuit.png et 07-comparatif-pro.png).

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 4. Intégrations et les pages des outils

```
Tu fais la recette des intégrations du site PULSACITY sur l'aperçu https://pulsacity-git-claude-beautiful-6a2566-jawadboughalems-projects.vercel.app. Pour chaque point, note « OK » ou décris ce que tu vois. Compare aux maquettes « v2-site-integrations-… », « v2-site-integration-systeme-io-… » et « v2-site-integration-stripe-… » de https://github.com/jawadboughalem/PULSACITY/tree/claude/beautiful-noether-lfdgg8/docs-internes/design-v2/maquettes. Ne crée aucun compte.

A. /integrations, fenêtre en grand
1. Sur fond bleu très pâle : « Intégrations », deux phrases, puis une rangée de pastilles (Toutes, puis les six familles), « Toutes » choisie en jaune.
2. Six familles, chacune avec son titre, une phrase, et ses outils en cartes blanches sur quatre colonnes : un carré d'initiales, le nom, un chevron, un badge vert « Disponible » ou bleu « Bientôt », une phrase, et pour les outils à venir une ligne grise « En attendant : … ». Compare à v2-site-integrations-desktop-01-catalogue.png.
3. Choisis « Paiements en ligne » : seule cette famille reste, avec « 1 famille sur 6 affichée. Voir toutes les familles » ; la suite de la page est masquée. Compare à v2-site-integrations-desktop-02-filtre-famille.png. Clique « Voir toutes les familles ».
4. « Vous vendez ailleurs ? Dites-nous quel outil » : clique le lien, écris « Outil de recette », envoie : « Merci, c'est noté. » en vert. Compare à v2-site-integrations-desktop-03-dites-nous-quel-outil.png.
5. « Sans connecteur, ça marche déjà » : trois cartes (Demander un avis, Votre lien de collecte, Le widget).
6. « Compatible avec votre site » : un tableau dans une carte blanche, en-tête bleu clair, des badges « Oui » (vert), « Selon la formule », « Pas encore testé ». Puis le bouton jaune et « Gratuit, sans carte bancaire. » à sa droite.

B. /integrations/systeme-io
7. « Intégrations › Systeme.io » en haut, un carré d'initiales et le badge « Disponible », le titre « Témoignages automatiques pour Systeme.io », une phrase, le bouton jaune et « Voir le guide d'installation ». Trois points dessous, chacun sous une icône dans un rond bleu clair.
8. Clique « Voir le guide d'installation » : la page descend à « Installer la connexion Systeme.io, pas à pas » ; à gauche le titre, une phrase et un encadré bleu clair « Un souci à une étape ? Écrivez-nous… » ; à droite, une carte blanche avec les étapes 1 à 6 numérotées dans des disques jaunes, leurs dessins, puis « Facultatif : les inscriptions sans vente ». En faisant défiler, la colonne de gauche reste visible.
9. « Vos questions », puis l'appel final « Vos clients ont déjà quelque chose à dire. ». Compare toute la page à v2-site-integration-systeme-io-desktop-01-page-entiere.png.

C. /integrations/stripe
10. Le titre « Témoignages automatiques pour Stripe », le badge « Bientôt », puis un panneau bleu très pâle « Être prévenu à la sortie de Stripe » avec le champ « Adresse e-mail » et le bouton jaune « Me prévenir ». Compare à v2-site-integration-stripe-desktop-01-page-entiere-vide.png.
11. Écris « julie@ » et clique « Me prévenir » : le champ prend un bord rouge et le message dit d'écrire l'adresse en entier (v2-site-integration-stripe-desktop-02-adresse-incomplete.png).
12. Demande-moi l'adresse B, écris-la, envoie : « Nous vous préviendrons par e-mail. » en vert (v2-site-integration-stripe-desktop-04-inscrit.png).
13. « Ce que fera la connexion », « En attendant : avec Zapier ou Make » avec les boutons « Guide Zapier » et « Guide Make » (ouvre l'un : un guide s'affiche ; reviens), puis « Ou, sans aucun outil ».

D. Téléphone, 360 px
14. /integrations : les pastilles des familles passent à la ligne, les cartes sont sur une colonne, le tableau de compatibilité devient des cartes ; aucun débordement (v2-site-integrations-mobile-01-catalogue.png).
15. /integrations/systeme-io : le bouton jaune sur toute la largeur, les étapes empilées, aucun débordement (v2-site-integration-systeme-io-mobile-01 et 02).

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Ne recopie aucune adresse e-mail.
```

---

## 5. Guides, les pages de lecture et Aide

```
Tu fais la recette des guides et des pages de lecture du site PULSACITY sur l'aperçu https://pulsacity-git-claude-beautiful-6a2566-jawadboughalems-projects.vercel.app. Pour chaque point, note « OK » ou décris ce que tu vois. Compare aux maquettes « v2-site-guides-… », « v2-site-legal-… » et « v2-site-a-propos-des-avis-… » de https://github.com/jawadboughalem/PULSACITY/tree/claude/beautiful-noether-lfdgg8/docs-internes/design-v2/maquettes.

A. Ordinateur, fenêtre en grand
1. /guides : sur fond bleu très pâle, « Guides », une phrase, puis trois groupes (Démarrer, Relier vos outils, Aller plus loin), chacun avec son titre et sa phrase à gauche et ses guides en cartes blanches à droite (titre, une ligne, « Mis à jour le … · … minutes de lecture », chevron). Puis un panneau bleu clair « Une question sans réponse ici ? » avec « Nous écrire », et l'appel final sur fond blanc. Compare à v2-site-guides-desktop-01-liste.png (la maquette n'a pas le groupe « Relier vos outils » : c'est voulu).
2. Ouvre « Comment ajouter des témoignages sur une page Systeme.io » : « Guides › … » en haut, le titre, la date, une phrase, puis le texte sur une grande plaque blanche et, à droite, « Dans ce guide » sur une plaque blanche, le titre en cours sur fond bleu clair. Compare à v2-site-guides-desktop-02-guide.png.
3. Fais défiler : le sommaire reste visible, et le titre surligné suit la partie lue (v2-site-guides-desktop-03-guide-titre-en-cours.png). Clique un titre du sommaire : la page y va.
4. Sous le guide, « Autres guides ».
5. /cgv : le titre, « Version du … », le bandeau crème « Brouillon en cours de relecture », puis le texte et « Sur cette page ». Article 2 : prix finaux, 14,99 € et 24,99 €, le prix de lancement ; nulle part « TVA comprise ». Compare à v2-site-legal-desktop-03-cgv.png (sans la ligne « régime de TVA » de la maquette : c'est voulu).
6. /mentions-legales, /cgu, /confidentialite : la même mise en page, chacune avec son sommaire.
7. /a-propos-des-avis : « Accueil › À propos de ces avis », le titre, une phrase, les sept règles sur la plaque blanche, le sommaire à droite. Compare à v2-site-a-propos-des-avis-desktop-01-page.png.
8. /aide : la page s'affiche comme avant (questions par thème, « Écrivez-nous »).

B. Téléphone, 360 px
9. Le guide du point 2 : le sommaire est replié dans une bande blanche « Dans ce guide » sous le titre ; touche-la : la liste s'ouvre, touche un titre : la page y va (v2-site-guides-mobile-03-guide-sommaire-ouvert.png).
10. /confidentialite : même chose avec « Sur cette page » (v2-site-legal-mobile-05-confidentialite-sommaire-ouvert.png). Aucun débordement, même sur les longues adresses ou les tableaux.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 6. Les pages d'erreur et les images de partage

```
Tu fais la recette des pages d'erreur et des images de partage du site PULSACITY sur l'aperçu https://pulsacity-git-claude-beautiful-6a2566-jawadboughalems-projects.vercel.app. Pour chaque point, note « OK » ou décris ce que tu vois. Compare aux maquettes « v2-site-erreurs-… » et « v2-site-partage-… » de https://github.com/jawadboughalem/PULSACITY/tree/claude/beautiful-noether-lfdgg8/docs-internes/design-v2/maquettes.

A. Page introuvable
1. Ouvre /une-page-qui-n-existe-pas, fenêtre en grand : un en-tête blanc réduit au logo, ni menu ni pied de page ; sur fond bleu très pâle, une carte blanche au centre avec une loupe dans un rond bleu clair, « Cette page n'existe pas », « L'adresse est peut-être incomplète. Vérifiez le lien que vous avez reçu, puis ouvrez-le à nouveau. », le bouton jaune « Revenir à l'accueil » et le lien « Écrire à l'équipe ». Compare à v2-site-erreurs-desktop-01-page-introuvable.png.
2. Clique « Écrire à l'équipe » : on arrive sur /aide, à « Écrivez-nous ». Reviens et clique « Revenir à l'accueil » : l'accueil s'affiche.
3. À 360 px : le bouton jaune sur toute la largeur, le lien centré dessous (v2-site-erreurs-mobile-01-page-introuvable.png).
La page « Cette page n'a pas pu s'afficher » ne se provoque pas d'ici : Claude Code l'a vérifiée dans son conteneur.

B. Images de partage (chaque adresse affiche une image de 1200 × 630)
4. /opengraph-image-pwu6ef : à gauche sur blanc, le logo, « Vous vendez. PULSACITY demande l'avis. » en grand et la promesse en gris ; à droite, une colonne jaune avec la fusée seule, en bleu marine. Compare à v2-site-partage-desktop-01-accueil.png.
5. /integrations/systeme-io/opengraph-image-oi60db : « Témoignages automatiques pour Systeme.io », et dans la colonne jaune la fusée, « avec », et un carré blanc « SI ». Compare à v2-site-partage-desktop-02-integration-systeme-io.png.
6. /guides/ajouter-des-temoignages-sur-une-page-systeme-io/opengraph-image-1kutxw : le titre du guide en un peu plus petit, sur trois lignes au plus, et la fusée avec une pastille blanche « Guide ». Compare à v2-site-partage-desktop-03-guide.png.
7. /tarifs/opengraph-image-p1oddr : « Un prix simple, qui suit vos ventes. » et la fusée seule.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 7. À faire vous-même : Lighthouse sur l'accueil et la page Systeme.io

Claude in Chrome n'ouvre pas les outils de développement : ce contrôle passe par vous.

1. Dans Chrome, ouvrez https://pulsacity-git-claude-beautiful-6a2566-jawadboughalems-projects.vercel.app dans une fenêtre de navigation privée, sans extension ; identifiez-vous à Vercel si la page le demande.
2. Clic droit, « Inspecter », onglet « Lighthouse ». Mode « Navigation », appareil « Mobile », toutes les catégories. Cliquez « Analyser le chargement de la page ».
3. Recommencez sur `/integrations/systeme-io`, puis les deux en appareil « Ordinateur ».

On attend au moins 90 en performance et 100 en accessibilité. L'aperçu est plus lent que la production (protection Vercel) : un chiffre un peu sous 90 sur téléphone n'est pas un défaut s'il n'est pas loin. Le SEO de l'aperçu est bas, c'est voulu : un aperçu demande à ne pas être indexé. Dans le conteneur, sur la version de production : 97 et 98 sur téléphone, 100 sur ordinateur, accessibilité 100.

Compte rendu à me renvoyer : les scores, page par page et appareil par appareil.

---

## 8. Vérification sur pulsacity.com, après la fusion

À lancer à la toute fin, avec les vérifications en production des autres lots. Avant ce prompt : « CI » vert sur `main` après la fusion.

```
Tu vérifies sur la production de PULSACITY le site public en v2. Je ne suis pas connecté. Tu ne crées aucun compte et tu n'envoies aucun formulaire. Pour chaque point, note « OK » ou décris ce que tu vois. Ne relève pas les erreurs réseau vues par ton outil de surveillance du navigateur : elles ne font pas foi.

1. https://pulsacity.com : le grand titre « Vous vendez. PULSACITY demande l'avis. », l'aplat jaune avec l'exemple d'avis, puis la bande bleu clair des outils.
2. Sur la même page, « Écrire un avis de test » : choisis 5 étoiles, écris « Vérification », envoie : l'avis arrive sur le mur de démonstration. Recharge : il a disparu.
3. https://pulsacity.com/tarifs : Essentiel sur fond bleu clair, 9,99 € par mois et la ligne « Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois. » (ou, si le prix de lancement est fermé, 14,99 € sans cette ligne).
4. https://pulsacity.com/integrations : les pastilles des six familles et les cartes d'outils.
5. https://pulsacity.com/integrations/systeme-io : « Intégrations › Systeme.io » et les étapes dans des disques jaunes.
6. https://pulsacity.com/guides : les trois groupes et le panneau bleu clair « Une question sans réponse ici ? ».
7. https://pulsacity.com/une-page-qui-n-existe-pas : la carte blanche « Cette page n'existe pas » avec la loupe.
8. https://pulsacity.com/opengraph-image-pwu6ef : l'image de partage, avec la colonne jaune et la fusée.
9. À 360 px, sur https://pulsacity.com : en défilant, la barre blanche « Créer mon espace gratuit » apparaît en bas ; elle disparaît à l'appel final.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```
