# Lot 5 — le widget : recette et actions du fondateur

Dans l'ordre. Chaque bloc est un prompt à coller tel quel dans Claude in Chrome, sauf le dernier, pour Claude Design.

- Prompts 1 à 3 : sur l'aperçu de la PR #20, avant la fusion.
- Prompts 4 à 6 : sur pulsacity.com et une vraie page Systeme.io de test, après la fusion. Les aperçus sont protégés par Vercel Authentication : une page Systeme.io ne peut pas y charger le widget, d'où ce test en production.
- Prompt 7 : pour Claude Design.

Adresse de l'aperçu qui sert à la recette : https://pulsacity-git-claude-amazing-ar-eb60d3-jawadboughalems-projects.vercel.app. C'est l'adresse de la branche : le lien de connexion reçu par e-mail y mène aussi. Elle fait tourner le code de la PR #20, sur la base de recette.

Déjà vérifié par Claude Code dans son conteneur :
- les trois types rendus en jsdom à partir d'un JSON d'exemple, et aucun style qui sort du Shadow DOM ni n'y entre (tests Vitest) ;
- les pages claire et sombre de la maquette 2, à 1440 et 360 px dans Chromium, à côté de leurs maquettes ;
- une page aux styles agressifs (`* { all: unset !important }`, `[data-pulsacity-widget] { display: none !important }`, polices énormes, majuscules, italiques) : le widget reste intact, seule sa police suit la page ;
- Lighthouse sur la page claire : performances 99 avec les trois widgets, 100 sans ; CLS 0,002 dans les deux cas ; temps de blocage 0 ms. `w.js` pèse 9,2 Ko compressé, pour un plafond de 30 Ko vérifié à chaque build.

---

## 1. GitHub — remplir l'espace de recette

L'espace de démonstration prend la couleur verte des maquettes (#4F6F52). Ce prompt remet à zéro l'espace « Julie Nutrition » de votre adresse de recette : ce que la recette du lot 4 y avait ajouté disparaît.

```
Tu m'aides à remplir l'espace de démonstration de la recette de PULSACITY, depuis GitHub.

Où : https://github.com/jawadboughalem/PULSACITY/actions

Étapes :
1. Dans la colonne de gauche, ouvre le workflow « Recette demo space ».
2. Clique sur « Run workflow ». Dans « Use workflow from », choisis la branche claude/amazing-archimedes-hrciu9.
3. Dans « Adresse e-mail du compte de recette », demande-moi mon adresse de recette et saisis-la. Laisse le plan sur free.
4. Valide avec le bouton vert « Run workflow », puis attends la fin (une à deux minutes) et ouvre l'exécution.

Ne touche surtout pas :
- au workflow « Database migration » (la production) : ne le lance pas ;
- aux secrets du dépôt (Settings › Secrets).

Vérification : l'exécution est verte, et son journal contient la ligne « Espace « Julie Nutrition » prêt pour … ».

Compte rendu à me donner : le statut de l'exécution et cette ligne, sans l'adresse e-mail.
```

## 2. Recette sur ordinateur, sur l'aperçu

Avant ce prompt : connectez-vous à l'aperçu avec votre adresse de recette, fenêtre en grand (1440 px de large ou plus).

```
Tu fais la recette du widget de PULSACITY sur l'aperçu de la PR, dans l'onglet où je suis connecté avec mon compte de recette (espace « Julie Nutrition », plan Gratuit). Tu ne crées aucun compte et tu ne changes rien hors de cet espace. Pour chaque point, note « OK » ou décris précisément ce que tu vois.

A. Liste des widgets
1. Dans la colonne de gauche, clique sur « Widgets ». La page « Widgets » montre une ligne « Mur · Toutes les offres », avec « Pas encore collé sur une page » dessous et « Modifier » à droite.
2. Le bouton « Créer un widget » est grisé, et le texte dessous dit « Le plan Gratuit comprend un widget. Voir les plans ».

B. Éditeur
3. Clique sur la ligne. La page « Modifier le widget » s'ouvre : en haut « Widgets / Mur · Toutes les offres » et « Enregistré automatiquement ». À gauche : Type (Mur, Carrousel, Badge), Offre, Nombre maximum de témoignages, Afficher (Photo, Note en étoiles, Date), Couleur d'accent, Thème, Masquer « Propulsé par PULSACITY », puis « Copier le code ». À droite : « Aperçu en direct », une page « Julie Nutrition » réduite, avec le mur d'avis dans sa section grise.
4. Dans l'aperçu, au-dessus des cartes, à droite : des étoiles et « 4,7/5 · 10 avis ». Chaque carte montre des initiales dans un rond, le nom, le métier, les étoiles, le texte entre guillemets et la date. La première carte est celle de Camille R. En bas à droite : « Propulsé par » et le logo Pulsacity.
5. Couleur d'accent : la première pastille, verte, est choisie, avec « Vert de votre page · #4F6F52 ». Les étoiles de l'aperçu sont vertes.
6. Nombre maximum : mets 4. L'aperçu garde 4 cartes et montre « Voir les 6 autres avis ». Clique dessus : 6 cartes s'ajoutent et le bouton disparaît. Écris 0 : un message rouge dit « Indiquez un nombre entre 1 et 50. ». Remets 12.
7. Afficher : décoche « Date », puis « Note en étoiles » : les dates, puis les étoiles et la note moyenne disparaissent de l'aperçu. Recoche les deux.
8. Couleur d'accent : clique sur la pastille bleu nuit, puis sur la rouge : les étoiles changent de couleur. Reviens sur la verte.
9. Thème : clique sur « Sombre » : les cartes deviennent sombres, et leurs étoiles passent en carmin clair, car le vert ressort trop peu sur ce fond. Sous le sélecteur, sans le déplacer, un avertissement le dit, sans proposer Encre. Reviens sur « Auto » : la page étant claire, les cartes redeviennent blanches, les étoiles vertes, et l'avertissement disparaît. Sous le sélecteur : « Auto suit le fond de votre page. »
10. « Masquer « Propulsé par PULSACITY » » : l'interrupteur est grisé et ne bouge pas quand tu cliques, avec « Disponible avec le plan Pro · Voir les plans ».
11. Offre : choisis « Atelier cuisine ». L'en-tête dit « Widgets / Mur · Atelier cuisine ». L'aperçu ne garde que 3 avis (Hugo P., Emma S., Jade K.) et « 4,3/5 · 3 avis ». Reviens sur « Toutes les offres ».
12. Type « Carrousel » : l'aperçu montre trois cartes côte à côte, une flèche ronde de chaque côté et des points dessous. Clique sur la flèche de droite : les cartes avancent d'une.
13. Type « Badge » : « Nombre maximum de témoignages » disparaît. Sous le bouton « Je m'inscris » de l'aperçu : une pilule avec trois ronds d'initiales qui se chevauchent sans couper les lettres, cinq étoiles et « 4,7/5 · 10 avis », et « Propulsé par Pulsacity » à côté.
14. Reviens sur « Mur ». À chaque changement, en haut à droite, « Enregistrement… » passe à « Enregistré automatiquement ». Recharge la page : le mur, « Toutes les offres », 12, le vert et « Auto » sont toujours là.
15. Clique sur « Copier le code » : le bouton dit « Code copié » quelques secondes. Pour lire le presse-papiers, ajoute à la page un champ de texte temporaire, colles-y le contenu (Ctrl+V, ou Cmd+V sur Mac), lis-le, puis retire ce champ : le champ « Rechercher » des Témoignages coupe à 80 caractères. Le texte collé est une seule ligne, de la forme <div data-pulsacity-widget="…"></div><script async src="…/w.js"></script>, où le second « … » est l'adresse de l'aperçu.
16. Sous l'éditeur, le cadre « Coller dans Systeme.io », « 4 étapes, environ 2 minutes » : quatre dessins, et dessous : 1. glisser un élément Code HTML, 2. cliquer sur « Modifier le code », 3. coller le code puis valider, 4. enregistrer la page puis ouvrir son aperçu, car le code ne s'exécute pas dans l'éditeur.

C. Données publiques du widget
17. Repère l'identifiant du widget : la fin de l'adresse de l'éditeur, après /app/widgets/. Ouvre dans un nouvel onglet l'adresse de l'aperçu suivie de /api/widget/ et de cet identifiant. La page montre du texte JSON avec "type":"wall", "total":10, "average":4.7, et aussi v, theme, accentColor, cardStyle, avatars et next. Dans la liste "testimonials", chaque avis n'a que name, initials, title, photo, rating, text et date. "poweredBy" se termine par /?ref= suivi d'un code. Aucune adresse e-mail n'y figure.
18. Reviens sur « Widgets » : la ligne dit toujours « Pas encore collé sur une page ». Ouvrir ces données dans le navigateur ne compte pas comme un affichage sur une page.

Compte rendu à me donner : les points 1 à 18 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK. Ne recopie ni l'adresse e-mail du compte, ni l'identifiant du widget.
```

## 3. Recette sur téléphone (360 px), sur l'aperçu

Avant ce prompt : dans Chrome, ouvrez les outils de développement (F12), activez la barre d'appareils (Ctrl+Maj+M), puis réglez la largeur sur 360 et la hauteur sur 800.

```
Tu fais la recette du widget de PULSACITY en largeur téléphone, sur l'aperçu de la PR où je suis connecté. La page est affichée en 360 × 800. Tu ne crées aucun compte. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Touche l'onglet « Plus », puis « Widgets » : la ligne « Mur · Toutes les offres » a une flèche à droite. Rien ne déborde sur le côté.
2. Touche la ligne : en haut, « Widgets » avec une flèche ; puis le titre « Modifier le widget », « Mur · Toutes les offres » et « Enregistré automatiquement ».
3. Les réglages sont les uns sous les autres. Les trois types (Mur, Carrousel, Badge) tiennent sur une ligne, et les trois thèmes aussi.
4. Plus bas, « Aperçu en direct » : une page de téléphone réduite, avec le mur sur deux colonnes.
5. Sous l'aperçu : « Copier le code », puis « Plus simple depuis un ordinateur : nous pouvons vous envoyer le code par e-mail. » et le bouton « M'envoyer le code par e-mail ». Touche ce bouton : « Le code est parti vers … » s'affiche. Demande-moi si l'e-mail « Le code de votre widget PULSACITY » est bien arrivé, avec le code dedans. Attends ma réponse.
6. Tout en bas, « Coller dans Systeme.io » : les 4 étapes, l'une sous l'autre, chacune avec son dessin.
7. Choisis le type « Carrousel » : dans l'aperçu, une carte à la fois. Dessous, entre les deux flèches, « 1 sur 10 » à la place des points, qui ne tiendraient pas. Touche la flèche de droite : « 2 sur 10 ». Reviens sur « Mur ».

Compte rendu à me donner : les points 1 à 7 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK.
```

## 3 bis. Contre-recette des corrections, sur l'aperçu

La recette du 2 octobre a relevé trois points, corrigés depuis : l'avertissement de couleur en thème sombre, les initiales du badge, les points du carrousel sur téléphone. Attendez que le commentaire de Vercel dans la PR #20 soit revenu à « Ready », puis, fenêtre en grand, collez :

```
Tu vérifies trois corrections du widget de PULSACITY sur l'aperçu de la PR, dans l'onglet où je suis connecté avec mon compte de recette. Tu ne crées aucun compte et tu ne changes rien hors de cet espace. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Ouvre « Widgets », puis le widget « Mur · Toutes les offres ». Note la position du sélecteur de thème, puis clique sur « Sombre » : le sélecteur ne bouge pas. Sous lui, un avertissement orange dit « La couleur d'accent ressort peu sur des cartes sombres : vos étoiles s'afficheront en carmin clair. », sans lien « Utiliser Encre ». Clique sur « Auto » : l'avertissement disparaît.
2. Type « Badge » : dans la pilule de l'aperçu, les trois ronds se chevauchent toujours, mais chaque paire d'initiales se lit en entier.
3. Type « Carrousel ». Charge l'éditeur dans un cadre de 360 × 800 à la même adresse, comme pour la recette sur téléphone. Dans l'aperçu, sous la carte, entre les deux flèches : « 1 sur 10 », à la place des points. La flèche de droite le fait passer à « 2 sur 10 ». En fenêtre normale, l'aperçu garde ses points, au nombre de 8.
4. Remets le type sur « Mur » et le thème sur « Auto ».

Compte rendu à me donner : les points 1 à 4 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK.
```

---

Après les prompts 2, 3 et 3 bis : envoyez les comptes rendus à Claude Code. S'il n'y a rien à corriger, fusionnez la PR #20, puis attendez que le déploiement de production soit « Ready » dans Vercel.

## 4. Systeme.io — coller le widget sur une vraie page de test (production)

Avant ce prompt :
- connectez-vous vous-même à https://pulsacity.com avec votre compte de test. Son espace doit avoir au moins trois témoignages validés : sinon, ajoutez-en par « Témoignages › Ajouter un témoignage » (ils arrivent en « Validé ») ;
- connectez-vous à Systeme.io dans le même navigateur, fenêtre en grand.

```
Tu m'aides à vérifier le widget de PULSACITY sur une vraie page Systeme.io de test. Je suis connecté à https://pulsacity.com avec mon compte de test, et à Systeme.io avec mon compte. Tu ne crées aucun compte. Dans Systeme.io, tu ne touches qu'au tunnel de test que tu crées ici.

Étapes :
1. Sur https://pulsacity.com/app/widgets, ouvre le widget de la liste. Mets le type sur « Mur » et l'offre sur « Toutes les offres », puis clique sur « Copier le code ».
2. Dans Systeme.io, ouvre « Tunnels » et crée un tunnel nommé « Test widget PULSACITY », avec une page de vente vierge ou le modèle le plus simple. Ouvre cette page dans l'éditeur.
3. En haut de la page, ajoute un titre « Page de test PULSACITY », puis trois ou quatre paragraphes de texte, comme sur une page de vente : le widget doit arriver plus bas que le premier écran.
4. Sous ces paragraphes, glisse un élément « Code HTML ». Clique dessus, puis sur « Modifier le code ». Colle le code (Ctrl+V, ou Cmd+V sur Mac), puis valide.
5. Note ce que l'éditeur montre à cet endroit : le code ne s'y exécute pas, c'est normal.
6. Enregistre la page, puis ouvre son aperçu. Si l'aperçu n'affiche pas les avis, ouvre l'adresse publique de la page.
7. Sur cette page, fenêtre en grand :
   a. le mur d'avis s'affiche : au-dessus, les étoiles, la note moyenne et le nombre d'avis ; puis les cartes en colonnes ; dessous, « Propulsé par » et le logo Pulsacity. Note le nombre de colonnes : trois quand la zone du widget fait au moins 1024 px de large, deux en dessous ;
   b. les cartes reprennent la police de la page Systeme.io ;
   c. survole « Propulsé par Pulsacity » sans cliquer : le lien mène à https://pulsacity.com/?ref= suivi d'un code ;
   d. le reste de la page n'a ni bougé ni changé de style.
8. Dans PULSACITY, passe le type sur « Carrousel ». Attends une minute, puis recharge deux fois la page Systeme.io : le carrousel remplace le mur, et ses flèches font défiler les avis.
9. Passe le type sur « Badge ». Attends une minute, recharge deux fois : une pilule avec trois visages ou initiales, des étoiles et « x,x/5 · N avis ».
10. Remets le type sur « Mur », attends une minute et recharge deux fois : le mur revient.
11. Dans PULSACITY, page « Widgets » : la ligne dit « Sur une page depuis le » suivi de la date du jour. Sur l'accueil, si le bloc « Étapes restantes » est affiché, l'étape « Coller le widget sur votre page de vente » y est cochée.

Ne touche surtout pas :
- aux tunnels, pages, contacts et réglages existants de Systeme.io (domaine, e-mails, paiements) ;
- aux réglages de l'espace PULSACITY autres que ceux du widget.

Compte rendu à me donner : chaque étape avec « OK » ou ta description, l'adresse publique de la page de test, et une capture d'écran du mur, du carrousel et du badge sur la page Systeme.io.
```

Puis, sur la même page Systeme.io, en largeur téléphone : ouvrez les outils de développement (F12), activez la barre d'appareils (Ctrl+Maj+M), réglez 360 × 800, puis collez :

```
Tu vérifies le widget de PULSACITY sur la page Systeme.io de test, en largeur téléphone (360 × 800). Tu ne modifies rien.

1. Fais défiler jusqu'au mur : deux colonnes de cartes, rien ne déborde sur le côté, et « Propulsé par Pulsacity » est centré sous les cartes.
2. S'il y a plus d'avis que de cartes, « Voir les N autres avis » prend toute la largeur. Touche-le : d'autres cartes s'ajoutent.
3. Demande-moi de passer le type sur « Carrousel » dans PULSACITY, attends ma réponse, puis attends une minute et recharge deux fois. Une seule carte à la fois. Fais-la glisser vers la gauche : la suivante arrive. Les flèches et les points sont sous la carte.
4. Demande-moi de passer le type sur « Badge », puis de le remettre sur « Mur » une fois ce point vérifié. Le badge tient sur une ligne, et « Propulsé par Pulsacity » est dessous.

Compte rendu à me donner : les points 1 à 4 avec « OK » ou ta description, et une capture d'écran de chacun.
```

## 5. Systeme.io — styles agressifs sur la page de test

```
Tu vérifies que le widget de PULSACITY résiste aux styles de la page qui l'accueille, sur la page de test du tunnel « Test widget PULSACITY » dans Systeme.io. Tu ne touches à aucun autre tunnel ni à aucune autre page.

Étapes :
1. Dans l'éditeur de la page de test, ajoute un deuxième élément « Code HTML », juste au-dessus de celui du widget. Dans « Modifier le code », colle exactement cette ligne, puis valide :
<style>* { all: unset !important; } div, section, p, h1, h2 { display: block !important; } body { font-size: 30px !important; letter-spacing: 4px !important; text-transform: uppercase !important; font-style: italic !important; } [data-pulsacity-widget] { display: none !important; } a, button { color: lime !important; background: red !important; } img, svg { display: none !important; } .card, .root, .wall, .badge { display: none !important; }</style>
2. Enregistre la page, puis ouvre son adresse publique. La page Systeme.io est très abîmée : c'est voulu.
3. Le widget, lui, est intact : cartes blanches bordées, étoiles, initiales ou photos, texte à taille normale, ni majuscules ni italique, « Propulsé par » et le logo. Seule sa police suit celle de la page.
4. Si la page n'est pas abîmée du tout, note-le : Systeme.io isole alors le code de chaque élément, et ce test ne prouve rien.
5. Supprime ce deuxième élément « Code HTML », enregistre, et vérifie que la page est revenue à la normale.

Compte rendu à me donner : les points 2 à 5 avec « OK » ou ta description, et une capture d'écran de la page abîmée avec le widget intact.
```

## 6. PageSpeed Insights — la page avec et sans widget

```
Tu compares la vitesse de la page de test Systeme.io avec et sans le widget de PULSACITY. Tu ne touches qu'au tunnel « Test widget PULSACITY ».

Étapes :
1. Dans Systeme.io, dans ce tunnel, duplique la page de test. Dans la copie, supprime l'élément « Code HTML » du widget, puis enregistre. Note l'adresse publique des deux pages.
2. Sur https://pagespeed.web.dev, analyse la page avec le widget. Note, pour « Mobile » puis pour « Ordinateur » : le score Performances, LCP, TBT (Total Blocking Time) et CLS.
3. Fais de même pour la copie sans widget.
4. Si l'écart du score Performances dépasse 5 points, relance une fois l'analyse des deux pages et garde le meilleur score de chacune.

Vérification : avec le widget, le score Performances perd 5 points ou moins, et le CLS reste sous 0,1.

Compte rendu à me donner : un tableau avec les deux pages, en mobile et en ordinateur, et les quatre valeurs de chacune.
```

---

## 7. Pour Claude Design (hors Chrome)

Quatre états du lot widget ont été construits sans maquette, et deux réglages attendent une décision. À coller dans Claude Design :

```
Pour PULSACITY, dessine ce qui manque au lot widget, dans la charte et les composants existants (maquettes 2 « Widgets » et 6 « Éditeur de widget », et la page Offres m17), en desktop 1440 px et en mobile 360 px :
1. Widgets : la liste des widgets de l'espace, avec pour chacun son type (mur, carrousel, badge), son offre, « Sur une page depuis le 12 sept. 2026 » ou « Pas encore collé sur une page », et « Modifier ». Le bouton « Créer un widget », et son état au plan Gratuit, limité à un widget, avec le lien vers les plans.
2. L'éditeur de widget en mobile 360 px : réglages, aperçu en direct, « Copier le code », l'envoi du code par e-mail (« Plus simple depuis un ordinateur »), et le guide « Coller dans Systeme.io ».
3. Le bouton « Copier le code » une fois le code copié : l'export m6-editeur-desktop-06-code-copie est identique au 01.
4. Le chargement du carrousel et du badge, sur page claire et sombre (m2 ne dessine que celui du mur). Et le carrousel sur téléphone quand ses points ne tiennent plus entre les flèches : aujourd'hui « 2 sur 10 » les remplace.
5. Le nom d'un widget : m6 affiche « Avis de la page Programme 30 jours ». Faut-il un champ pour le nommer ? Sans lui, le nom reste dérivé du type et de l'offre : « Mur · Toutes les offres ».
6. L'arrondi des cartes du widget (anguleuses ou arrondies) : faut-il un réglage dans l'éditeur ? Aujourd'hui elles sont anguleuses, comme dans m2.
Exporte un PNG par état, nommés m18-widgets-…, m6-editeur-mobile-… et m2-widgets-…-chargement-…
```
