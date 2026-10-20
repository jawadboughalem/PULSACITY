# Lot 4.6 — L'espace en v2 : recette

Dans l'ordre :
- Prompt 1 : un espace de démonstration, rempli depuis la branche de la PR.
- Prompt 2 : inscription, connexion et démarrage, sur ordinateur, avec une adresse sans espace ; puis les états vides de l'espace.
- Prompts 3 à 5 : l'espace rempli, sur ordinateur.
- Prompt 6 : tout l'espace à 360 px.
- Prompts 7 et 8 : contre-recette des corrections apportées après la recette du 20 octobre, sur ordinateur puis à 360 px.
- Action 9, à faire vous-même : Lighthouse sur l'accueil de l'espace (deux minutes, dans Chrome).
- Prompt 10 : vérification sur pulsacity.com, après la fusion, à la toute fin avec celles des autres lots.

Ce lot ne touche à aucun service : aucune action sur Vercel, Supabase, Cloudflare, Resend ou Stripe, aucune variable, aucune migration. Il change l'apparence de l'espace, pas ce qu'il fait : la recette regarde chaque écran à côté de sa maquette (`docs-internes/design-v2/maquettes/v2-espace-*`, index dans `INDEX.md`), et vérifie que chaque bouton fait toujours ce qu'il faisait.
Si la dernière recette date de plus d'une semaine, réveillez d'abord la base de recette (prompt 0 bis de `lot-4-1-decisions.md`).

Adresse de l'aperçu (PR #45) : https://pulsacity-git-claude-admiring-a-90c6c6-jawadboughalems-projects.vercel.app

Deux adresses e-mail que vous lisez, à garder pour vous (ne les collez pas dans les comptes rendus) :
- **A** : celle des recettes précédentes, pour l'espace rempli « Julie Nutrition » ;
- **B** : une adresse sans espace sur la recette (un alias « +lot46 » suffit si votre messagerie l'accepte), pour l'inscription et le démarrage.

Déjà vérifié par Claude Code dans son conteneur :
- chaque écran de l'espace, de la connexion et du démarrage à 1440 et 360 px, à côté de sa maquette, avec ses états (vide, filtre sans résultat, erreurs, adresse prise, alerte de contraste, retrait impossible, fenêtres) : aucun débordement, aucune erreur dans la console ;
- Lighthouse : 100 en accessibilité sur l'accueil de l'espace et sur quinze autres écrans du lot ; performance de l'accueil 99 sur ordinateur, médiane 87 sur téléphone (86 à 97 ; `main` : 84 dans le même conteneur) ;
- `pnpm lint`, `pnpm typecheck`, `pnpm build` ; `pnpm test` vert, sauf `decode-csv-file.test.ts`, qui échoue déjà sur `main` dans ce conteneur et passe en CI. Aucun test modifié.

Écarts gardés avec la maquette, à trancher par vous (détail dans la PR) : textes et titres du code gardés là où la maquette en propose d'autres (démarrage, connexion, accueil, guides) ; au démarrage, sélecteur de couleur du navigateur au lieu des quatre pastilles, adresse prise affichée comme dans Réglages, pas de « Revenir à l'étape 1 » ; pas de « Vente annulée » ni « Non distribuée » dans les demandes ; pas de tuiles de guides pour le connecteur universel. Ne les relevez pas comme des défauts dans les comptes rendus.

---

## 1. GitHub — un espace de démonstration, depuis la branche de la PR

```
Tu m'aides à préparer la base de recette de PULSACITY pour une PR.

1. Ouvre https://github.com/jawadboughalem/PULSACITY/actions/workflows/seed-recette.yml
2. Clique sur « Run workflow ».
3. « Use workflow from » : choisis la branche claude/admiring-albattani-6epde4 (pas main).
4. « Adresse e-mail du compte de recette » : demande-moi l'adresse A et mets celle que je te donne.
5. Plan : free. Clique sur « Run workflow », puis attends la fin : l'exécution doit être verte. Si elle est rouge, arrête-toi et dis-le-moi.

Ne touche surtout pas aux autres workflows, ni à la branche main.

Compte rendu à me donner : la couleur de l'exécution et la branche choisie. Pas l'adresse e-mail.
```

---

## 2. Inscription, connexion et démarrage sur ordinateur (adresse B), puis l'espace vide

Avant ce prompt : déconnectez-vous de l'aperçu s'il le faut, fenêtre en grand. Ouvrez votre boîte B dans un autre onglet : l'agent vous demandera de cliquer le lien reçu.

```
Tu fais la recette de l'inscription, de la connexion et des premiers pas de PULSACITY sur l'aperçu https://pulsacity-git-claude-admiring-a-90c6c6-jawadboughalems-projects.vercel.app, fenêtre en grand (1440 px environ). Je ne suis pas connecté. Pour chaque point, note « OK » ou décris ce que tu vois. Compare chaque écran à sa maquette quand je te la donne. Ne relève pas les erreurs réseau vues par ton outil de surveillance du navigateur : elles ne font pas foi.

A. Connexion et inscription
1. Ouvre /connexion. En haut, un en-tête blanc avec le logo PULSACITY. Dessous, un fond bleu très pâle (Nuage) et, au centre, une carte blanche arrondie d'environ 640 px de large : le titre « Retrouvez votre espace », une phrase, le champ e-mail (exemple « vous@example.com » en gris), un bouton jaune « Recevoir mon lien » sur toute la largeur de la carte, puis en petit « Pas encore d'espace ? Créer mon espace gratuit », le lien souligné.
2. Clique « Recevoir mon lien » sans rien écrire : le champ prend un bord rouge et un message rouge dit quoi faire, juste dessous.
3. Ouvre /inscription. Même carte : « Créez votre espace », « Indiquez votre adresse e-mail. Vous recevrez un lien pour entrer, sans mot de passe. », le champ, la question « Comment avez-vous connu PULSACITY ? » si elle s'affiche, le bouton jaune, puis « Vous avez déjà un espace ? Me connecter ».
4. Demande-moi l'adresse B, écris-la, et clique le bouton. La carte entière change : un rond bleu clair avec une enveloppe, le titre « Un lien vous attend dans votre boîte de réception. », l'adresse en gras, une phrase d'aide, puis « Utiliser une autre adresse ». Le titre « Créez votre espace » et le lien « Me connecter » ont disparu.
5. Demande-moi de cliquer le lien reçu dans la boîte B, dans cette fenêtre.

B. Démarrage, étape 1 (/app/onboarding)
6. En-tête blanc : le logo à gauche, « Se déconnecter » souligné tout à droite. Sur le fond Nuage, une carte blanche d'environ 720 px : « Étape 1 sur 2 » en petit et en gras, puis deux barres arrondies côte à côte, la première bleu marine, la seconde gris clair ; le grand titre « Votre espace » et une phrase.
7. Les champs, dans l'ordre : « Nom de votre activité », « Adresse de votre page de collecte » (sous le champ, l'adresse de l'aperçu suivie de « /t/ »), « Votre logo (facultatif) » avec un rond en pointillés gris, fond bleu très pâle et une icône d'appareil photo, puis le bouton blanc bordé « Choisir un logo » avec une flèche vers le haut ; « Couleur d'accent (facultatif) » ; « E-mail de réponse », déjà rempli ; le bouton jaune « Créer mon espace ».
8. Écris « Julie Nutrition » dans le nom : l'adresse se remplit seule, « julie-nutrition ». Clique « Créer mon espace » : le champ de l'adresse prend un bord rouge, avec « Cette adresse est déjà prise par un autre espace. » et, dessous, un bouton blanc bordé, plus petit, « Prendre julie-nutrition-… ». Ne clique pas encore.
9. Clique le rond de la couleur et choisis un jaune très clair (par exemple #F2E9A0), ou écris-le si le sélecteur le permet : dessous apparaît un encadré crème aux coins arrondis, avec un triangle d'alerte et, en gras ambre, « Cette couleur ressort peu sur fond blanc : vos étoiles seraient peu lisibles. Choisissez-la plus foncée. » Clique « Retirer la couleur » : l'encadré disparaît.
10. Clique « Prendre julie-nutrition-… » : l'adresse change et l'erreur disparaît. Clique « Créer mon espace ».

C. Démarrage, étape 2 (/app/onboarding/formations)
11. « Étape 2 sur 2 », les deux barres bleu marine, « Vos formations ». Le champ « Nom de la formation » et, à sa droite sur la même ligne, le bouton blanc bordé « Ajouter la formation ». Dessous, un encadré bleu très pâle : « Aucune formation pour l'instant. Ajoutez la première, ou passez cette étape. » Puis le bouton jaune « Ouvrir mon espace ».
12. Clique « Ajouter la formation » sans rien écrire : « Indiquez le nom de la formation, en 2 caractères au moins. » en rouge sous le champ ; le bouton reste aligné sur le champ.
13. Ajoute « Programme test », puis « Atelier test ». Chacune s'affiche sur une bande bleu très pâle : le nom en gras, son adresse en gris dessous, et à droite une icône de copie puis « Retirer ».
14. Clique l'icône de copie de « Programme test » : elle devient une coche, et « Le lien est copié. » s'affiche en vert sous la ligne, puis disparaît après quelques secondes.
15. Clique « Retirer » sur « Atelier test » : la ligne disparaît.
16. Compare à https://github.com/jawadboughalem/PULSACITY/blob/claude/admiring-albattani-6epde4/docs-internes/design-v2/maquettes/v2-espace-demarrage-formations-desktop-02-liste.png (sans les écarts de texte : titre, boutons, « Revenir à l'étape 1 »). Note toute différence de disposition, de couleur ou d'espacement.
17. Clique « Ouvrir mon espace ».

D. L'espace vide
18. L'accueil : « Bienvenue » (ou « Bienvenue » et un prénom), une grande carte blanche « Pas encore de témoignage » avec le symbole de la marque, le champ du lien de collecte et son bouton de copie, puis « ou » et « Connecter mon outil » avec une icône de lien. Compare à v2-espace-accueil-desktop-02-premier-jour (même dossier que la maquette du point 16).
19. Témoignages : une carte blanche avec une illustration ronde bleu clair, une phrase, et le lien de collecte à copier. Widgets : « Aucun widget pour l'instant » et l'action suivante. Demandes : « Aucune demande pour l'instant », avec un bouton qui porte une icône de lien. Connecteurs : le catalogue, Systeme.io marqué « Connecter ».
20. Clique « Se déconnecter » si tu le vois (sinon ouvre le menu du compte en bas à gauche, puis « Se déconnecter ») : on revient à la page de connexion.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Ne recopie aucune adresse e-mail.
```

---

## 3. L'accueil et les témoignages, sur ordinateur (espace A)

Avant ce prompt : connectez-vous vous-même sur l'aperçu avec l'adresse A, fenêtre en grand. Téléchargez https://github.com/jawadboughalem/PULSACITY/raw/claude/admiring-albattani-6epde4/docs-internes/recette/temoignages-50-lignes.csv : l'agent vous demandera de le choisir.

```
Tu fais la recette de l'accueil et des témoignages de l'espace PULSACITY sur l'aperçu https://pulsacity-git-claude-admiring-a-90c6c6-jawadboughalems-projects.vercel.app, fenêtre en grand. Je suis connecté. Pour chaque point, note « OK » ou décris ce que tu vois. Les maquettes sont dans https://github.com/jawadboughalem/PULSACITY/tree/claude/admiring-albattani-6epde4/docs-internes/design-v2/maquettes (fichiers « v2-espace-… ») : ouvre celle que je cite et note toute différence de disposition, de couleur ou d'espacement. Ne valide, ne masque et ne supprime aucun témoignage, sauf quand un point le demande.

A. L'accueil (/app), maquette v2-espace-accueil-desktop-01-tableau-de-bord
1. « Bonjour Julie » (ou « Bonjour »), une phrase, et à droite le bouton jaune « Demander un avis ».
2. Quatre tuiles : la première jaune (Soleil), « témoignages validés » ; la deuxième bleu clair (Ciel), la note moyenne avec ses étoiles dessous ; deux tuiles blanches, « en attente de validation · Les voir » et le taux de réponse.
3. « Derniers témoignages reçus » avec « Tout voir », des cartes blanches ; à droite, « Étapes restantes » sur une carte blanche : une barre de progression, les étapes faites cochées en gris, la suivante sur un encadré bleu très pâle avec un disque jaune numéroté et son bouton.
4. Si une étape propose « Copier le code », clique-la : l'icône devient une coche, et un message vert avec une coche s'affiche sous le bouton.

B. Témoignages (/app/temoignages), maquette v2-espace-temoignages-desktop-01-liste-et-pagination
5. Titre « Témoignages », les compteurs en dessous, et à droite le bouton jaune « Ajouter un témoignage ». Les filtres : « Rechercher » avec « Un prénom, un mot… », « Statut », « Offre », « Note ».
6. Une barre d'en-tête bleu clair (Client, Témoignage, Note, Statut, En avant), puis chaque témoignage sur une bande blanche séparée : l'avatar, le nom, l'offre et « Reçu le … » dans la colonne Client ; le texte ; les étoiles ; le badge ; un rond bordé pour « En avant » (jaune rempli quand il est en avant) ; « Valider » et « Masquer » à droite. Il n'y a plus de colonne Offre.
7. Survole une ligne : son fond devient bleu clair.
8. Clique le rond « En avant » d'un témoignage validé qui ne l'est pas : il devient jaune. Reclique : il revient comme avant.
9. Écris « zzz » dans la recherche et valide : une carte blanche dit qu'aucun témoignage ne correspond, avec de quoi effacer les filtres. Efface-les.

C. La fiche
10. Clique le nom d'un témoignage : sa fiche s'ouvre, avec en haut « Témoignages › … ». Compare à v2-espace-fiche-desktop-01-… Reviens à la liste.

D. Ajouter un témoignage (/app/temoignages/ajouter), maquette v2-espace-ajouter-desktop-01-vide
11. « Témoignages › Ajouter un témoignage », le titre, une phrase plus grande. Le formulaire sur une carte blanche ; à droite, un encadré bleu clair « Bon à savoir » avec « Importer un fichier CSV ».
12. Les étoiles sont grandes (28 px) ; clique la quatrième : quatre étoiles se remplissent.
13. Clique le bouton d'envoi sans rien remplir d'autre : les champs obligatoires prennent un bord rouge avec leur message, et l'encadré de l'accord (fond bleu très pâle, texte en gras) passe sur fond rose bordé de rouge. N'envoie rien.

E. Importer un CSV (/app/temoignages/importer), maquettes v2-espace-importer-desktop-01-choix-du-fichier et 02-apercu-et-limite-du-plan
14. Trois étapes en barres au-dessus (« Choisir le fichier », « Vérifier », « Importer »), la première en gras, barre bleu marine, les autres en gris clair.
15. Une zone de dépôt blanche à bord pointillé, avec un disque bleu clair et une flèche, et le guide des colonnes dans une carte (titre, tableau).
16. Choisis le fichier temoignages-50-lignes.csv (demande-moi de le sélectionner). L'étape « Vérifier » : le fichier sur une carte avec son icône, l'aperçu des lignes, et, si des lignes sont refusées, une carte blanche bordée de rouge, titre rouge avec un triangle, chaque ligne refusée sur fond rose. N'importe pas : clique pour revenir ou quitte la page.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 4. Offres, widgets, éditeur et guide, sur ordinateur (espace A)

```
Tu continues la recette de l'espace PULSACITY sur l'aperçu https://pulsacity-git-claude-admiring-a-90c6c6-jawadboughalems-projects.vercel.app, fenêtre en grand. Je suis connecté. Pour chaque point, note « OK » ou décris ce que tu vois. Compare aux maquettes citées (même dossier que le prompt précédent : https://github.com/jawadboughalem/PULSACITY/tree/claude/admiring-albattani-6epde4/docs-internes/design-v2/maquettes). Ne supprime rien.

A. Offres (/app/offres), maquette v2-espace-offres-desktop-01-liste
1. Chaque offre sur sa carte blanche : le nom en grand ; « Demandes d'avis » avec son interrupteur à droite du texte ; le délai ; le lien de collecte dans un champ bleu très pâle avec un petit bouton de copie ; les identifiants de l'outil sur des aplats (fond crème pour un produit pas encore associé).
2. Clique la copie du lien d'une offre : l'icône devient une coche et « Le lien est copié. » s'affiche en vert dessous.
3. Change le délai d'une offre (par exemple 15), quitte le champ : « Délai enregistré. » s'affiche en vert avec une coche. Remets la valeur d'origine.
4. Ouvre le retrait d'une offre qui a des ventes (« Programme 30 jours ») : un encadré blanc à bord bleu marine dit « Cette offre a déjà des ventes : elle ne peut pas être retirée. » Ferme-le sans rien retirer.

B. Widgets (/app/widgets), maquette v2-espace-widgets-desktop-01-liste
5. Le mur dans sa ligne : une vignette dessinée en bleu clair, blanc et jaune, son nom, « Sur une page depuis … » en gras s'il a déjà été affiché, et un petit bouton « Modifier ».

C. L'éditeur (clique « Modifier »), maquettes v2-espace-editeur-desktop-01 à 03
6. « Widgets › … », le titre, l'état d'enregistrement avec une coche. À gauche, les réglages sur une carte blanche d'environ 400 px ; à droite, l'aperçu sur sa propre carte.
7. Choisis le type « Carrousel » : sa case devient jaune, l'aperçu montre un carrousel. Reviens à « Mur ».
8. Les pastilles de couleur sont rondes ; la choisie a un anneau bleu marine. Change de couleur, puis remets celle d'origine.
9. Clique « Copier le code » : l'icône devient une coche et un message vert s'affiche sous le bouton.
10. Sous l'éditeur, le guide « Coller dans Systeme.io » : trois étapes avec des disques jaunes numérotés et leurs dessins.

D. Le guide sur sa page (/app/widgets/<le widget>/guide, depuis le lien de l'éditeur s'il existe, sinon passe), maquette v2-espace-guide-systemeio-desktop-01-guide-pas-a-pas
11. Le fil « Modifier le widget › Coller dans Systeme.io », les étapes sur une carte blanche, puis le code et « Un souci à une étape ? Écrivez-nous ».

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 5. Connecteurs et demandes, sur ordinateur (espace A)

```
Tu continues la recette de l'espace PULSACITY sur l'aperçu https://pulsacity-git-claude-admiring-a-90c6c6-jawadboughalems-projects.vercel.app, fenêtre en grand. Je suis connecté. Pour chaque point, note « OK » ou décris ce que tu vois. Compare aux maquettes citées (https://github.com/jawadboughalem/PULSACITY/tree/claude/admiring-albattani-6epde4/docs-internes/design-v2/maquettes). N'envoie aucune demande d'avis, sauf au point 15, et ne change ni l'adresse ni la clé d'une connexion.

A. Le catalogue (/app/connecteurs), maquette v2-espace-connecteurs-desktop-01-catalogue
1. Titre « Connecteurs », « Reliez l'outil où vous vendez : chaque achat déclenche une demande d'avis. », puis une rangée de pastilles : « Toutes » (jaune, avec une coche), « Formations », « Rendez-vous », « Paiements », « Événements », « Boutiques », « Autres outils ».
2. Six familles, chacune avec son titre (« Formations et tunnels de vente »…) et sa phrase. Chaque outil sur une bande blanche : un carré bleu clair avec ses initiales (« SI » pour Systeme.io), son nom, un badge (« Connecté » en vert avec une coche pour Systeme.io, « Bientôt » pour les autres), une phrase, et pour les outils à venir « En attendant : avec Zapier ou Make » (liens soulignés) ou « Déjà possible avec le connecteur universel : voir le guide ». À droite, un petit bouton : « Gérer », « Connecter » ou « Me prévenir ».
3. Clique la pastille « Paiements » : seule cette famille reste, et en bas « 1 famille sur 6 affichée. Voir toutes les familles ». Clique « Voir toutes les familles ».
4. Clique « Me prévenir » sur un outil « Bientôt » : en haut de la page, un message vert « C'est noté : nous vous écrirons le jour de la sortie de … ». Le bouton de la ligne change.
5. Tout en bas, « Vous vendez ailleurs ? Dites-nous quel outil. … » : clique le lien, écris « Outil de recette », clique « Envoyer » : « Merci, c'est noté. Nous vous préviendrons s'il arrive. » en vert.

B. Systeme.io (clique « Gérer »), maquettes v2-espace-connecteur-systemeio-desktop-01 à 06
6. « Connecteurs › … », le carré « SI » à côté du titre « Connecter Systeme.io », une phrase plus grande. Le bandeau vert « Connecté — dernière vente reçue … ».
7. « La connexion en 3 étapes » sur une carte blanche, chaque étape avec un disque jaune numéroté. Clique « Copier » de l'adresse de connexion : l'icône devient une coche et un message vert s'affiche dessous. Fais de même pour la clé secrète.
8. L'étape « Facultatif : les inscriptions sans vente », marquée d'un « + » cerclé, avec ses deux cadres (déclencheur, action).
9. « Offres à associer » sur une carte blanche : la barre d'en-tête bleu clair, chaque produit avec son offre, son délai et son badge (« Associée » vert, « À associer » crème).
10. « Derniers événements reçus », puis, si le lien existe, « Voir tout l'historique » : l'historique s'ouvre, avec en bas des petits boutons pour changer de page. Reviens.
11. En bas, un encadré bleu clair : « Un souci à une étape ? Écrivez-nous : nous faisons la connexion avec vous, en partage d'écran. »

C. Le connecteur universel (/app/connecteurs/connecteur-universel)
12. Le carré « CU », le titre, les étapes ; les champs reconnus en tableau sur fond bleu très pâle (nom du champ, ce qu'il contient). Ne connecte rien.

D. Demandes (/app/demandes), maquettes v2-espace-demandes-desktop-01 à 10
13. Titre, phrase, et à droite le bouton bordé « Demander un avis ». Quatre tuiles : la première bleu clair (planifiées), trois blanches. Les pastilles de statut, avec leur nombre.
14. Chaque demande sur une bande blanche : l'avatar, le nom, l'offre, la date ; le badge dans sa colonne (« Planifiée », « Échec » rouge, « Annulée » gris avec un rond barré…) ; les actions à droite (« Envoyer maintenant », « Annuler », « Corriger l'adresse »…). Clique la pastille « Annulées » : seules les annulées restent ; si une pastille n'a aucune demande, une carte blanche le dit.
15. Clique « Demander un avis » : une fenêtre « Demander un avis » s'ouvre au centre. Clique le bouton d'envoi sans rien remplir : les erreurs s'affichent, et l'encadré « Cette personne a acheté cette offre auprès de moi. » passe sur fond rose bordé de rouge. Ferme avec « Annuler » puis rouvre et ferme avec Échap. N'envoie rien.
16. Sur une demande planifiée, clique « Annuler » : la fenêtre de confirmation montre un bouton rouge. Clique « Garder » : rien ne change.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 6. Tout l'espace à 360 px (espace A)

```
Tu fais la recette de l'espace PULSACITY à la largeur d'un téléphone, sur l'aperçu https://pulsacity-git-claude-admiring-a-90c6c6-jawadboughalems-projects.vercel.app. Je suis connecté. Règle la fenêtre (ou les outils de développement, mode appareil) sur 360 px de large. Pour chaque point, note « OK » ou décris ce que tu vois. Rien ne doit déborder sur le côté : pas de défilement horizontal. Compare aux maquettes « mobile » (https://github.com/jawadboughalem/PULSACITY/tree/claude/admiring-albattani-6epde4/docs-internes/design-v2/maquettes, fichiers « v2-espace-…-mobile-… »). N'envoie, ne valide, ne masque et ne supprime rien.

1. Accueil (/app) : l'en-tête blanc avec le logo et l'avatar, en bas la barre d'onglets (Accueil, Témoignages, Demandes, Plus). Les tuiles de chiffres sur deux colonnes, les témoignages, les étapes restantes. Rien n'est caché par la barre d'onglets.
2. Témoignages : chaque témoignage sur une carte ; le rond « En avant » aligné sur la carte ; la recherche montre « Rechercher un prénom, un mot… ».
3. Ouvre une fiche : sous l'en-tête, « ‹ Témoignages » à gauche (plus de barre retour sur toute la largeur). Reviens.
4. Ajouter un témoignage (depuis Témoignages) : « ‹ Témoignages », le formulaire sur sa carte, le lien vers l'import sous le formulaire ; pas d'encadré « Bon à savoir ».
5. Importer : les trois étapes en barres, la zone de dépôt, le guide des colonnes en petites cartes.
6. Par « Plus » : Offres (« ‹ Plus », chaque offre sur sa carte, interrupteur à droite), Widgets puis l'éditeur (réglages, aperçu, puis « Copier le code » et « M'envoyer le code par e-mail », sans l'envoyer), Connecteurs (pastilles qui passent à la ligne, outils en bandes), Systeme.io (« ‹ Connecteurs », étapes, bandes « Offres à associer » sur fond bleu très pâle), Demandes (badge et actions sous chaque demande).
7. Demandes, « Demander un avis » : la fenêtre monte du bas, en feuille ; les champs sur toute la largeur. Ferme-la.
8. Ouvre une fenêtre de navigation privée à 360 px et va sur /connexion : la page est blanche (pas de carte sur fond bleu), le titre, le champ, le bouton jaune sur toute la largeur. Puis /inscription : la même chose.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## Résultats de la recette du 20 octobre (prompts 1 à 6)

Tout fonctionne ; les remarques portent sur l'apparence. Fenêtre à 2 048 px (les maquettes sont à 1 440), téléphone dans un cadre de 360 px.

Corrigé (commit « Lot 4.6: the recette's corrections »), à revoir aux prompts 7 et 8 :
- **Démarrage** : le bouton « Prendre julie-nutrition-… » se place juste sous le message, avant l'adresse ; une adresse e-mail longue ne se coupe plus en plein mot dans « Un lien vous attend… » ; « Copier le lien d'Atelier test » (et non « de ») ; copier le lien d'une formation ne fait plus sauter les lignes du dessous (la coche du bouton suffit, le message reste lu aux lecteurs d'écran) ; retrait des bandes à 16 px.
- **Liens seuls** (« Masquer », « Ouvrir », « Tout voir », « Effacer les filtres », « Importer un fichier CSV », « Voir toutes les lignes », « Voir le plan Essentiel », « Voir tout l'historique ») : leur texte s'aligne sur le texte voisin, sans les 10 px de leur zone de clic.
- **Accueil** : encadré de l'étape suivante à 16 px de marge ; au téléphone, 24 px avant « Derniers reçus » et « Demandes ce mois » (au lieu de 48), et ce titre à la taille de la maquette.
- **Témoignages** : au survol d'une ligne, l'avatar passe en blanc et ne se confond plus avec le fond.
- **Ajouter** : 28 px entre le formulaire et « Bon à savoir », large de 360 px.
- **Import** : les trois barres d'étapes ont la même largeur ; le disque de la zone de dépôt fait 64 px.
- **Offres** : 24 px entre les cartes ; l'adresse de collecte se coupe à un tiret, plus en plein mot.
- **Widgets** : la ligne sous le titre d'un widget sans nom ne répète plus le titre ; dans l'éditeur, le « » » de « Masquer « Propulsé par PULSACITY » » reste avec son texte, et les cases de type non choisies ont le bord gris clair de la maquette.
- **Connecteurs** : « Me prévenir » répond sur la ligne de l'outil (« Nous vous préviendrons par e-mail »), plus en haut de la page, qu'on ne voyait pas et qui faisait descendre le contenu ; 12 px entre les lignes de pastilles au téléphone.
- **Systeme.io** : « La clé secrète est copiée. » s'affiche sous la clé ; les deux cadres de l'étape facultative sont sur Nuage ; « Voir tout l'historique » s'affiche dès le premier événement reçu (avant : au-delà de cinq) ; le carré « SI » fait 48 px au téléphone.
- **Demandes** : les deux boutons de l'état vide sont centrés l'un sur l'autre ; dans « Demander un avis », le titre et la croix restent visibles quand le formulaire défile.

Pas un défaut de ce lot :
- **Widgets vide** (prompt 2, point 19) : chaque espace reçoit un mur à sa création ; l'état « Aucun widget pour l'instant » ne se voit qu'après avoir supprimé ce mur. Le prompt se trompait.
- **Inscription avec une adresse qui a déjà un espace** (prompt 2, point 5) : le lien ouvre cet espace, c'est voulu.
- **Champ vide** (prompt 2, point 2) : « Cette adresse e-mail est incomplète » est le texte d'avant ce lot, qui ne change pas les textes. Proposition pour un lot suivant : « Indiquez votre adresse e-mail. » quand le champ est vide.
- **Podia « avec Zapier », Zapier « Bientôt »** : textes du catalogue décidés au lot 4.1. « Bientôt » parle de l'app PULSACITY dans Zapier ; en attendant, le guide passe déjà par le connecteur universel.
- **Fiche** : le texte original replié et « donnée à l'envoi » viennent du lot 4.13.
- **Offres** : prix pour une offre vendue, nombre de témoignages pour les autres : logique d'avant ce lot.
- **Éditeur** : pas de case « Date » (lot 4.13) ; l'aperçu réduit une page de 1 280 px à la largeur du cadre, presque en taille réelle dans une fenêtre de 2 048 px ; guide en 4 étapes et ses textes : ceux du code ; « Voir le guide » sur téléphone seulement : déjà le cas.
- **Aperçu du mur au téléphone** en deux colonnes étroites, dates coupées : c'est le widget lui-même (deux colonnes dès 340 px de large), comme sur un vrai téléphone. Il passe en v2 au lot 4.8 : à reprendre là.
- **Demandes** : la demande en échec en tête de liste (ordre d'avant ce lot) ; fenêtres centrées ; au téléphone, « Demander un avis » occupe l'écran comme sur la maquette (la feuille ancrée en bas de la charte reste à trancher).
- Les écarts de quelques pixels qui restent dans un pas de l'échelle d'espacement (4, 8, 12…) ne sont pas repris.

À trancher, en plus de la liste du haut : connecteur universel, tableau des champs replié sous « Les champs à envoyer » et bouton « Copier » bordé, comme sur la maquette.

Pas testé : connexion et inscription à 360 px (prompt 6, point 8), faute de fenêtre sans session. Le prompt 8 le fait après une déconnexion.

---

## 7. Contre-recette sur ordinateur

Avant ce prompt : sur https://github.com/jawadboughalem/PULSACITY/pull/45, le commentaire de Vercel dit « Ready », mis à jour après le commit « Lot 4.6: the recette's corrections ». Connectez-vous vous-même sur l'aperçu avec l'adresse A. Gardez sous la main une nouvelle adresse sans espace (par exemple l'alias de B suivi de « recette1020 ») et le fichier temoignages-50-lignes.csv.

```
Tu revérifies les corrections de l'espace PULSACITY sur l'aperçu https://pulsacity-git-claude-admiring-a-90c6c6-jawadboughalems-projects.vercel.app, fenêtre en grand. Je suis connecté avec l'espace « Julie Nutrition ». Pour chaque point, note « OK » ou décris ce que tu vois. Ne valide, ne masque, ne supprime et n'importe rien ; n'envoie aucune demande. Ne relève pas les erreurs réseau vues par ton outil de surveillance du navigateur.

A. Les liens seuls
1. Accueil (/app) : dans une carte de témoignage déjà validé, « Masquer » seul en bas à gauche commence exactement sous le début du texte du témoignage (pas 10 px plus à droite) ; « Ouvrir » finit au bord droit du texte. « Tout voir » finit au bord droit de la colonne.
2. Témoignages : écris « zzz » dans la recherche et valide ; « Effacer les filtres » commence sous le début de la phrase « Aucun témoignage ne correspond à ces filtres. ». Efface les filtres.
3. Ajouter un témoignage : dans « Bon à savoir », « Importer un fichier CSV » commence sous le début de « Vous en avez beaucoup ? ». L'écart entre la carte du formulaire et « Bon à savoir » est d'environ 28 px.
4. Importer : les trois barres d'étapes ont la même largeur ; le disque bleu de la zone de dépôt fait 64 px. Choisis le fichier temoignages-50-lignes.csv (demande-moi de le sélectionner) : à l'étape « Vérifier », les trois barres ont toujours la même largeur, et « Voir toutes les lignes » et « Voir le plan Essentiel » commencent sous le début du texte au-dessus. Quitte la page sans importer.

B. Témoignages et offres
5. Témoignages : survole une ligne : son fond devient bleu clair et le rond de l'avatar devient blanc, ses initiales restent lisibles.
6. Offres : 24 px environ entre deux cartes d'offre.
7. Widgets : la ligne du mur montre son titre, puis directement son état (« Pas encore collé sur une page » ou « Sur une page depuis … »), sans répéter le titre. Ouvre l'éditeur : les cases de type non choisies ont un bord gris clair ; « Masquer « Propulsé par PULSACITY » » tient sans « » » seul sur sa ligne.

C. Connecteurs
8. Connecteurs : fais défiler jusqu'à un outil « Bientôt » assez bas (par exemple dans « Événements »), clique « Me prévenir » : la ligne affiche « Nous vous préviendrons par e-mail » en vert avec une coche, rien n'apparaît en haut de la page, et la page ne bouge pas.
9. Systeme.io (« Gérer ») : clique « Copier » de la clé secrète : « La clé secrète est copiée. » s'affiche sous la clé, à droite, et non sous l'adresse. L'étape « Facultatif » : ses deux cadres sont bleu très pâle (comme le fond de la page), plus bleu clair.
10. « Derniers événements reçus » : « Voir tout l'historique » est à droite du titre. Clique-le : l'historique des ventes reçues s'ouvre, avec chaque événement et son traitement. Reviens.

D. Demandes
11. Demandes, « Demander un avis » : clique « Envoyer la demande » sans rien remplir. Les erreurs s'affichent ; le titre « Demander un avis » et la croix restent visibles en haut de la fenêtre. Fais défiler la fenêtre jusqu'en bas : le bouton « Envoyer la demande » s'affiche en entier. Ferme avec Échap.

E. Le démarrage (déconnecte-toi d'abord par le menu du compte, en bas à gauche)
12. Sur /inscription, demande-moi la nouvelle adresse sans espace, et envoie le lien : dans « Nous l'avons envoyé à … », l'adresse ne se coupe pas en plein mot (si elle ne tient pas, elle passe entière à la ligne, ou se coupe seulement à la fin de la ligne). Demande-moi de cliquer le lien reçu.
13. Étape 1 : écris « Julie Nutrition », clique « Créer mon espace » : sous le champ de l'adresse, d'abord le message rouge, juste dessous le bouton « Prendre julie-nutrition-… », puis seulement la ligne de l'adresse. Clique « Prendre … », puis « Créer mon espace ».
14. Étape 2 : ajoute « Atelier test » et « Programme test ». Les bandes ont 16 px de marge à gauche. Clique l'icône de copie d'« Atelier test » : l'icône devient une coche, et la bande du dessous ne bouge pas. Si ton outil lit le nom des boutons, celui-ci s'appelle « Copier le lien d'Atelier test ». Clique « Ouvrir mon espace ».
15. Demandes de ce nouvel espace : « Aucune demande pour l'instant », les deux boutons « Connecter mon outil » et « Copier mon lien » sont centrés l'un sur l'autre (le jaune un peu plus haut que le bordé, de 2 px en haut et en bas).

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu. Ne recopie aucune adresse e-mail.
```

---

## 8. Contre-recette à 360 px

Avant ce prompt : connectez-vous de nouveau avec l'adresse A.

```
Tu revérifies les corrections de l'espace PULSACITY à la largeur d'un téléphone, sur l'aperçu https://pulsacity-git-claude-admiring-a-90c6c6-jawadboughalems-projects.vercel.app, dans un cadre de 360 px de large. Je suis connecté avec l'espace « Julie Nutrition ». Pour chaque point, note « OK » ou décris ce que tu vois. N'envoie, ne valide, ne masque et ne supprime rien.

1. Accueil : sous les étapes restantes, environ 24 px avant le titre « Derniers reçus », qui a la taille de « Étapes restantes » ou plus ; même écart avant « Demandes ce mois ». « Tout voir » finit au bord droit des cartes.
2. Offres (par « Plus ») : l'adresse de collecte de chaque offre se coupe à un tiret ou une barre, jamais en plein mot (« julie-nutritio / n »).
3. Connecteurs : environ 12 px entre deux lignes de pastilles de familles.
4. Systeme.io : le carré « SI » fait 48 px.
5. Déconnecte-toi (« Plus », puis « Se déconnecter »), puis ouvre /connexion dans le cadre de 360 px : la page est blanche (pas de carte sur fond bleu), le titre « Retrouvez votre espace », le champ, le bouton jaune « Recevoir mon lien » sur toute la largeur, puis « Pas encore d'espace ? Créer mon espace gratuit ». Rien ne déborde.
6. /inscription dans le même cadre : la même chose, avec « Créez votre espace », la question « Comment avez-vous connu PULSACITY ? » et « Vous avez déjà un espace ? Me connecter ».

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## Résultats de la contre-recette du 20 octobre (prompts 7 et 8)

Vingt points sur vingt et un corrigés. Restaient deux défauts, corrigés depuis (commit « Lot 4.6: two last alignments ») :
- **Demandes vides** (prompt 7, point 15) : les boutons restaient alignés en haut, car « Copier mon lien » se calait en haut de sa ligne. Il est maintenant centré sur « Connecter mon outil ».
- **Connexion à 360 px** (prompt 8, point 5) : quand « Créer mon espace gratuit » passe à la ligne, il commençait 10 px à droite du texte. Il s'aligne maintenant, et « Me connecter » de l'inscription aussi.

À revoir au prompt 10, sur pulsacity.com, après la fusion (points 7 et 8).

## Lighthouse sur l'aperçu, 20 octobre (action 9)

Rapport du fondateur, Lighthouse 13.4 dans Chrome, téléphone simulé :
- **Accessibilité** : 100.
- **Bonnes pratiques** : 100.
- **SEO** : 58. Attendu : l'espace est privé, l'aperçu et `/app` ne doivent pas être indexés (« is-crawlable ») et n'ont pas de description pour les moteurs de recherche.
- **Performance** : 75. Premier affichage 1,0 s, plus grand élément 3,4 s, blocage du fil principal 640 ms, aucun décalage de mise en page. Dans le conteneur, la médiane est de 87 (`main` : 84).

L'écart avec le conteneur vient surtout de l'ordinateur qui mesure : 1,5 s de tâches longues « non attribuées », qui ne viennent pas du code de la page (extensions du navigateur, dont Claude in Chrome, ou les outils de développement eux-mêmes). Ce qui revient à la page, sur le même rapport et dans le conteneur, c'est l'écran « Ouverture de votre espace… » : le contenu s'affiche au moins 300 ms après lui, et le plus grand élément arrive donc tard. Ce lot ne l'atteint pas sur téléphone ; voir « À trancher ».

## 9. À faire vous-même : Lighthouse sur l'accueil de l'espace

Claude in Chrome n'ouvre pas les outils de développement : ce contrôle passe par vous, deux minutes.

1. Dans Chrome, connecté avec l'adresse A, ouvrez https://pulsacity-git-claude-admiring-a-90c6c6-jawadboughalems-projects.vercel.app/app dans une fenêtre de navigation privée, sans extension : identifiez-vous à Vercel si la page le demande, puis connectez-vous à l'espace avec le lien reçu.
2. Clic droit, « Inspecter », onglet « Lighthouse ». Mode « Navigation », appareil « Mobile », catégories « Performances » et « Accessibilité ». Cliquez « Analyser le chargement de la page ».
3. Recommencez deux fois, puis en appareil « Ordinateur ».

On attend 100 en accessibilité. En performance, l'aperçu est plus lent que la production (protection Vercel, base de recette en plan Free) : notez les chiffres sans vous en inquiéter sous 90 sur téléphone. Dans le conteneur : 99 sur ordinateur, médiane 87 sur téléphone, contre 84 pour `main`. Ce qui reste vient de l'écran « Ouverture de votre espace… » : le contenu s'affiche au moins 300 ms après lui. Les passages où le contenu arrive avec la page, sans cet écran, donnent 93 à 97 : le retirer de l'accueil viserait ces scores, mais retire ce moment de marque. À trancher.

Compte rendu à me renvoyer : les scores, appareil par appareil.

---

## 10. Vérification sur pulsacity.com, après la fusion

À lancer à la toute fin, avec les vérifications en production des autres lots. Avant ce prompt : « CI » vert sur `main` après la fusion, et connectez-vous vous-même sur https://pulsacity.com avec votre compte de test de production.

```
Tu vérifies sur la production de PULSACITY l'apparence v2 de l'espace. Je suis connecté sur https://pulsacity.com avec un compte de test. Tu n'envoies aucune demande, tu ne valides, ne masques et ne supprimes rien. Pour chaque point, note « OK » ou décris ce que tu vois. Ne relève pas les erreurs réseau vues par ton outil de surveillance du navigateur : elles ne font pas foi.

1. https://pulsacity.com/app : les tuiles de chiffres (la première jaune, la deuxième bleu clair) ou, sans témoignage, la carte « Pas encore de témoignage ».
2. https://pulsacity.com/app/temoignages : la barre d'en-tête bleu clair et les bandes blanches, sans colonne Offre (ou, sans témoignage, la carte avec l'illustration).
3. https://pulsacity.com/app/connecteurs : la rangée de pastilles des familles, les carrés d'initiales, « Systeme.io » avec son badge.
4. https://pulsacity.com/app/demandes : les tuiles, puis les demandes en bandes (ou « Aucune demande pour l'instant »).
5. À 360 px, sur https://pulsacity.com/app/offres : l'en-tête blanc, « ‹ Plus » dessous, les offres sur leurs cartes, sans débordement.
6. Dans une fenêtre de navigation privée, https://pulsacity.com/connexion : une carte blanche sur fond bleu très pâle, « Retrouvez votre espace ». N'envoie rien.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```
