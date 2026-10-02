# Lot 5, suite — les maquettes du 2 octobre : recette

Dans l'ordre. Chaque bloc est un prompt à coller tel quel dans Claude in Chrome, sauf le dernier, pour Claude Design.

- Prompts 1 à 3 : sur l'aperçu de la PR #21, avant la fusion.
- Prompt 4 : sur pulsacity.com et la page Systeme.io de test du 2 octobre, après la fusion.
- Prompt 5 : pour Claude Design.

Adresse de l'aperçu, la même que pour la PR #20 puisque la branche n'a pas changé : https://pulsacity-git-claude-amazing-ar-eb60d3-jawadboughalems-projects.vercel.app. Elle fait tourner le code de la PR #21, sur la base de recette.

Cette PR ajoute une colonne facultative (`widgets.name`, migration 0005). Le workflow « Recette database migration » l'applique tout seul à la base de recette, et « Database migration » à la production lors de la fusion.

Déjà vérifié par Claude Code dans son conteneur, à 1440 et 360 px à côté des maquettes : m18 (liste, plan Gratuit, vide), m6 ordinateur 01, 06 et 07, m6 mobile 01 à 05, et les chargements du carrousel et du badge de m2, en clair et en sombre.

---

## 1. GitHub — la migration de recette

```
Tu vérifies, sans rien modifier, qu'une migration de base de données s'est appliquée sur la recette de PULSACITY.

Où : https://github.com/jawadboughalem/PULSACITY/actions/workflows/db-migrate-recette.yml

Étapes :
1. Ouvre la dernière exécution, celle de la PR #21 (branche claude/amazing-archimedes-hrciu9).
2. Lis son statut et la fin du journal de l'étape de migration.

Ne touche surtout pas :
- au workflow « Database migration » (la production) : ne le lance pas ;
- aux secrets du dépôt.

Vérification : l'exécution est verte, et le journal se termine par « migrations applied successfully ».

Compte rendu à me donner : le statut, la date de l'exécution et la dernière ligne du journal. Ne recopie aucune adresse de connexion.
```

## 2. Recette sur ordinateur, sur l'aperçu

Avant ce prompt : connectez-vous à l'aperçu avec votre adresse de recette, fenêtre en grand (1440 px de large ou plus).

```
Tu fais la recette des nouveaux écrans du widget de PULSACITY, sur l'aperçu de la PR où je suis connecté avec mon compte de recette (espace « Julie Nutrition », plan Gratuit). Tu ne crées aucun compte et tu ne changes rien hors de cet espace. Pour chaque point, note « OK » ou décris précisément ce que tu vois.

A. Liste des widgets
1. Ouvre « Widgets ». Sous le titre : « Affichez vos témoignages sur vos pages de vente. Chaque widget a son code, à coller une seule fois. » À droite, « Créer un widget » grisé, et dessous « Le plan Gratuit comprend 1 widget. Voir les plans ».
2. La ligne du widget : à gauche une miniature grise dessinant un mur, puis le titre « Mur · Toutes les offres » en grand, la même mention en petit dessous, et une ligne d'état (« Sur une page depuis le … » en vert, ou « Pas encore collé sur une page · Voir comment le coller »). À droite, un bouton encadré « Modifier ».
3. Sous la liste, un encadré gris : « Un mur, un carrousel et un badge sur vos pages ? », « Avec le plan Essentiel, à 9 € HT par mois, vous créez autant de widgets que vous voulez : un pour chaque page de vente. » et le lien « Voir le plan Essentiel ».

B. Éditeur
4. Clique sur « Modifier ». En tête des réglages : « Nom du widget (facultatif) », un champ vide qui montre en gris « Mur · Toutes les offres », et dessous « Pour le retrouver dans votre liste. Vos visiteurs ne le voient pas. Laissé vide : « Mur · Toutes les offres ». »
5. Écris « Avis de la page Programme 30 jours ». Le fil d'Ariane en haut passe à « Widgets / Avis de la page Programme 30 jours », et « Enregistré automatiquement » revient. Recharge la page : le nom est toujours là.
6. Sous « Thème » : « Coins des cartes », avec « Droits » (choisi) et « Arrondis », et dessous « Choisissez comme les boutons de votre page. ». Clique sur « Arrondis » : les cartes de l'aperçu ont maintenant des coins arrondis. Reviens sur « Droits ».
7. Clique sur « Copier le code » : le bouton devient vert avec « Code copié ». Dessous : « Collez-le maintenant dans Systeme.io : suivez les 4 étapes ci-dessous. » Le cadre « Coller dans Systeme.io » en bas prend un contour bleu nuit épais, et « Code copié, à vous de jouer » s'affiche en vert à sa droite. Quelques secondes plus tard, tout revient comme avant.
8. Pour lire le presse-papiers, ajoute à la page un champ de texte temporaire, colles-y le contenu, lis-le, puis retire ce champ. Le code tient sur une ligne : <div data-pulsacity-widget="…" data-pulsacity-type="wall"></div><script async src="…/w.js"></script>. Passe le type sur « Badge », copie à nouveau : le code dit maintenant data-pulsacity-type="badge". Reviens sur « Mur ».
9. Reviens sur « Widgets » : le titre de la ligne est « Avis de la page Programme 30 jours », et « Mur · Toutes les offres » est dessous.

Compte rendu à me donner : les points 1 à 9 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK. Ne recopie ni l'adresse e-mail du compte, ni l'identifiant du widget.
```

## 3. Recette sur téléphone (360 px), sur l'aperçu

Avant ce prompt : chargez l'aperçu dans un cadre de 360 × 800, comme pour la recette précédente sur téléphone.

```
Tu fais la recette des nouveaux écrans du widget de PULSACITY en largeur téléphone (360 × 800), sur l'aperçu de la PR où je suis connecté. Tu ne crées aucun compte. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Onglet « Plus », puis « Widgets » : miniature, titre et état les uns sous les autres, et « Modifier » en bouton sur toute la largeur. L'encadré du plan Essentiel est dessous. Rien ne déborde sur le côté.
2. Touche « Modifier ». Sous le titre « Modifier le widget » : « Avis de la page Programme 30 jours · Enregistré automatiquement », puis deux onglets, « Réglages » (choisi, souligné) et « Aperçu ».
3. Dans « Réglages » : le nom, le type, l'offre, le nombre, l'affichage, la couleur, le thème, les coins des cartes et « Masquer « Propulsé par PULSACITY » ».
4. Plus bas, « Installer le widget » : un encadré gris « Plus simple depuis un ordinateur » avec le bouton « M'envoyer le code » et « Il part à …, avec le guide. ». Puis « Ou copiez-le depuis ce téléphone », le bouton « Copier le code » et le lien « Voir le guide « Coller dans Systeme.io » ».
5. Touche « Copier le code » : le bouton devient vert, « Code copié », avec dessous « Collez-le dans Systeme.io, dans un élément Code HTML. Le guide vous montre où. »
6. Touche « M'envoyer le code » : l'encadré devient vert, « Code envoyé à … », « Ouvrez l'e-mail sur votre ordinateur : le code et le guide y sont. » et « Renvoyer l'e-mail ». Demande-moi si l'e-mail « Le code de votre widget PULSACITY » contient le code puis « Coller dans Systeme.io : 4 étapes, environ 2 minutes » et les 4 étapes numérotées. Attends ma réponse.
7. Touche l'onglet « Aperçu » : « Aperçu en direct », « Votre page, sur mobile », puis une page réduite « Julie Nutrition » qui commence par « Ce qu'en disent mes clients » et le mur sur deux colonnes, sans nom coupé en plein mot. Dessous : « L'aperçu suit vos réglages. » « Installer le widget » suit encore.
8. Touche « Voir le guide « Coller dans Systeme.io » » : une page s'ouvre avec « Modifier le widget » et une flèche en haut, le titre « Coller dans Systeme.io », « 4 étapes, environ 2 minutes. Plus simple depuis un ordinateur. », les 4 étapes dessinées l'une sous l'autre, puis « M'envoyer le code » et « Copier le code ». La flèche ramène à l'éditeur.

Compte rendu à me donner : les points 1 à 8 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK.
```

---

Après les prompts 2 et 3 : envoyez les comptes rendus à Claude Code. S'il n'y a rien à corriger, la PR #21 est fusionnée, puis attendez que la production soit « Ready » dans Vercel.

## 4. Systeme.io — le nouveau code, et assez d'avis pour tout voir (production)

Le 2 octobre, le compte de test n'avait qu'un avis. Ce prompt en importe assez pour voir le défilement du carrousel, ses points et « Voir les autres avis ». Ces témoignages de test resteront en production : ils partiront avec le nettoyage prévu avant le lancement.

Avant ce prompt : connectez-vous vous-même à https://pulsacity.com avec votre compte de test, et à Systeme.io dans le même navigateur. Téléchargez `docs-internes/recette/temoignages-50-lignes.csv` depuis GitHub (« Download raw file »).

```
Tu m'aides à finir la vérification du widget de PULSACITY sur la page Systeme.io de test du tunnel « Test widget PULSACITY ». Je suis connecté à https://pulsacity.com avec mon compte de test, et à Systeme.io. Tu ne crées aucun compte. Dans Systeme.io, tu ne touches qu'à la page de test de ce tunnel.

A. Des avis pour remplir le widget
1. Sur https://pulsacity.com/app/offres, vérifie que les offres « Programme 30 jours » et « Atelier cuisine » existent, avec ces noms exacts. Ajoute celles qui manquent avec « Ajouter une offre ».
2. Va sur « Témoignages › Ajouter un témoignage », puis « Importer un fichier CSV ». Demande-moi de choisir le fichier « temoignages-50-lignes.csv » et attends que je te dise que c'est fait.
3. Coche la case d'accord et lance l'import. Note le nombre de témoignages importés et le nombre qui restent en attente (le plan Gratuit en publie 15 au plus).

B. Le nouveau code sur la page
4. Sur https://pulsacity.com/app/widgets, ouvre le widget. Mets le type sur « Mur », l'offre sur « Toutes les offres », puis clique sur « Copier le code ».
5. Dans l'éditeur de la page de test Systeme.io, clique sur l'élément « Code HTML » du widget, puis sur « Modifier le code ». Remplace tout son contenu par le code copié, valide, puis enregistre la page.
6. Ouvre l'adresse publique de la page, fenêtre en grand. Le mur montre 12 cartes, puis « Voir les 3 autres avis » (ou le nombre qui correspond à l'import). Clique dessus : les autres cartes s'ajoutent et le bouton disparaît.
7. Dans PULSACITY, passe le type sur « Carrousel ». Attends une minute, puis recharge deux fois la page. Trois cartes à la fois sur un grand écran. La flèche de droite avance d'une carte, le point actif suit.
8. Passe le type sur « Badge », attends une minute, recharge deux fois : trois visages ou initiales, les étoiles et la note sur 15 avis.
9. Remets le type sur « Mur ».

Ne touche surtout pas :
- aux autres tunnels, pages, contacts et réglages de Systeme.io ;
- aux réglages de l'espace PULSACITY autres que ceux du widget et des offres nommées ci-dessus.

Compte rendu à me donner : chaque point avec « OK » ou ta description, et une capture d'écran du mur, du carrousel et du badge.
```

Puis, sur la même page, en largeur téléphone (cadre de 360 × 800), collez :

```
Tu vérifies le widget de PULSACITY sur la page Systeme.io de test, en largeur téléphone (360 × 800). Tu ne modifies rien.

1. Le mur : deux colonnes, puis « Voir les 3 autres avis » sur toute la largeur. Touche-le : les cartes s'ajoutent.
2. Demande-moi de passer le type sur « Carrousel », attends ma réponse, puis une minute, et recharge deux fois. Une carte à la fois. Fais-la glisser vers la gauche : la suivante arrive, et le compteur sous la carte passe de « 1 sur 12 » à « 2 sur 12 » tout de suite.
3. Demande-moi de remettre le type sur « Mur ».

Compte rendu à me donner : les points 1 à 3 avec « OK » ou ta description, et une capture d'écran de chacun.
```

---

## 5. Pour Claude Design (hors Chrome)

```
Pour PULSACITY, merci pour les maquettes du lot widget du 2 octobre : elles sont construites. Quatre points à aligner, sans rien redessiner d'autre :
1. m6 mobile, « Aperçu » : la phrase « Sur la vraie page, les avis s'affichent en une colonne sur mobile » contredit m2 et la charte, qui montrent deux colonnes sous 1024 px. Le widget garde deux colonnes et l'éditeur dit seulement « L'aperçu suit vos réglages. ». Confirme, ou redessine m2 mobile en une colonne.
2. m2 mobile, chargement du carrousel : les deux flèches y sont groupées au centre, alors que le carrousel chargé les place de part et d'autre des points. Le squelette suit le carrousel chargé, pour que rien ne bouge à l'arrivée des avis. Mets la maquette à jour dans ce sens.
3. m18, encadré du plan Gratuit : le choix d'une offre reste ouvert à tous les plans. Le texte devient « Avec le plan Essentiel, à 9 € HT par mois, vous créez autant de widgets que vous voulez : un pour chaque page de vente. ». Mets la maquette à jour.
4. Guide mobile : la ligne « Bloquée à une étape ? Écrivez-nous » attend une adresse de support, qui n'existe pas encore. Elle n'est pas affichée en attendant. Garde-la dans la maquette.
Exporte seulement les PNG modifiés, avec leurs noms actuels.
```
