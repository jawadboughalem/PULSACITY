# Lot 4.2 — les fondations v2 : recette

Dans l'ordre :
- Prompt 1 : l'espace de démonstration de recette, rempli depuis la branche de la PR.
- Prompts 2 et 3 : recette sur l'aperçu, sur ordinateur (le site, puis l'espace).
- Prompt 4 : recette à 360 px.
- Prompt 5 : vérification sur pulsacity.com, après la fusion.

Ce lot ne touche à aucun service : aucune action à faire de votre côté sur Vercel, Supabase, Stripe ou ailleurs. Aucune migration, aucune variable.
Si la dernière recette date de plus d'une semaine, réveillez d'abord la base de recette (prompt 0 bis de `lot-4-1-decisions.md`).

Adresse de l'aperçu (PR #35) : https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app

Déjà vérifié par Claude Code dans son conteneur :
- 46 adresses du site et de l'espace à 360 et 1440 px : aucun débordement, aucune erreur dans la console hors des 404 attendues ;
- les fenêtres de confirmation, le menu du téléphone, le menu du compte, une liste déroulante ouverte, les erreurs de champs, l'ombre de l'en-tête, le sommaire des guides, les images de partage ;
- `pnpm lint`, `pnpm typecheck`, `pnpm build` ; `pnpm test` vert, sauf `decode-csv-file.test.ts`, qui échoue déjà sur `main` dans ce conteneur et passe en CI ;
- Lighthouse sur la version de production : accueil 97 et tarifs 98 en performance, accueil de l'espace 92 (médiane de cinq passages) ; 100 en accessibilité.

Ce que la recette regarde : que la v2 est partout (couleurs, polices, logo, composants, coques), que rien n'est cassé, et que chaque écran a gardé sa mise en page et ses textes. Les mises en page v2 des écrans viennent avec les lots 4.3 à 4.8 : un écran qui a l'allure d'avant, aux nouvelles couleurs, est attendu.

Repères de la v2, pour les prompts : jaune Soleil (#FFBE3B, bouton principal), bleu marine Encre (#16213E, texte), corail (#F0674A, étoile du logo, pastille de comptage), bleu très clair Nuage (#F4F8FF, fond de l'espace), bleu clair Ciel (#DCEBFF, panneaux). Titres en Bricolage Grotesque, très gras ; texte en Figtree.

---

## 1. GitHub — l'espace de démonstration de recette, depuis la branche de la PR

```
Tu m'aides à remplir l'espace de démonstration de PULSACITY sur la base de recette, depuis la branche d'une PR.

Où : https://github.com/jawadboughalem/PULSACITY/actions/workflows/seed-recette.yml

Étapes :
1. Clique sur « Run workflow ».
2. « Use workflow from » : choisis la branche claude/lot-4-2-fondations-v2-cjckl5 (pas main).
3. « Adresse e-mail du compte de recette » : demande-la-moi et mets celle que je te donne.
4. Plan : free.
5. Clique sur « Run workflow », puis attends la fin : l'exécution doit être verte.

Ne touche surtout pas aux autres workflows, ni à la branche main.

Compte rendu à me donner : la branche choisie, le plan, et la couleur de l'exécution. Pas l'adresse e-mail.
```

---

## 2. Recette du site sur ordinateur, sur l'aperçu

Avant ce prompt : ouvrez l'aperçu et passez la protection de Vercel si elle s'affiche, fenêtre en grand. Pas besoin d'être connecté.

```
Tu fais la recette de la nouvelle charte graphique (v2) du site public de PULSACITY sur l'aperçu https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app, fenêtre en grand (1440 px environ). Tu ne crées aucun compte et tu n'envoies aucun formulaire. Pour chaque point, note « OK » ou décris ce que tu vois.

Repères : bouton principal jaune (#FFBE3B) à texte bleu marine ; texte bleu marine (#16213E) ; titres dans une police grotesque très grasse (Bricolage Grotesque) ; texte en Figtree ; aucun rouge carmin nulle part.

A. En-tête et pied de page (https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/tarifs)
1. En haut à gauche, le nouveau logo : une fusée bleu marine arrondie, portée par une étoile corail, puis « PULSACITY » en capitales. À droite : Intégrations, Tarifs, Guides, Se connecter, puis le bouton « Créer mon espace gratuit » en pilule blanche bordée de bleu marine.
2. « Tarifs » est souligné d'un trait épais : c'est la page en cours. Survole « Guides » : il se souligne plus finement.
3. Fais défiler la page : l'en-tête reste en haut et prend une ombre douce ; remonte tout en haut : l'ombre disparaît.
4. Lance dans la console : getComputedStyle(document.body).fontFamily. Le résultat commence par un nom de police qui contient « figtree ». Puis : getComputedStyle(document.querySelector("h1")).fontFamily ; le résultat contient « bricolage ».
5. En bas, le pied de page est bleu marine : le logo en blanc avec son étoile corail, les liens Mentions légales, CGU, CGV, Confidentialité, Cookies, Contact, soulignés, en blanc, et « © 2026 PULSACITY ».
6. L'onglet du navigateur montre la nouvelle icône : la fusée et son étoile corail.

B. Tarifs (même page)
7. Le bouton « Mensuel / Annuel » est une pilule bleu clair ; l'option choisie est bleu marine, texte blanc. Clique « Annuel » : les prix passent à l'année, l'option suit.
8. Trois colonnes aux coins arrondis, sans trait autour : Essentiel sur fond bleu clair avec « Recommandé » et le bouton jaune « Choisir Essentiel » ; Gratuit et Pro sur un fond bleu très pâle, avec un bouton blanc bordé. Les prix « 9,99 € » et « 19,99 € » sont en grands chiffres très gras, le « € » et les centimes de la même taille que l'euro.
9. Les boutons des trois colonnes sont alignés, et leurs listes commencent sur la même ligne.
10. Aucune ligne de séparation fine entre les sections de la page.

C. Accueil (https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/)
11. Le grand titre « Vos ventes deviennent des témoignages, automatiquement. » est très grand et très gras, sur quatre lignes environ. Dessous, le bouton jaune « Créer mon espace gratuit ».
12. La démo en quatre temps, la section du widget sur fond bleu clair (le widget lui-même garde son allure d'avant, en Georgia : c'est attendu), les connecteurs en cartes arrondies avec leurs badges « Disponible » (vert) et « Bientôt » (bleu clair), les tarifs, les questions. Aucun texte ne déborde.

D. Intégrations et guides
13. https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/integrations : chaque outil est une carte arrondie, avec son badge et, pour les « Bientôt », « En attendant : avec Zapier ou Make ».
14. https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/guides/recolter-des-temoignages-clients-formation-en-ligne : fais défiler jusqu'au milieu. Le sommaire « Dans ce guide », à droite, reste visible sous l'en-tête, jamais caché par lui ; le titre en cours y est marqué. Clique un titre du sommaire : la page s'y rend, et le titre s'affiche juste sous l'en-tête, pas dessous.

E. Connexion (https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/connexion)
15. Tape « julie@ » dans « Adresse e-mail », puis clique « Recevoir mon lien » : le champ prend un bord rouge et le message d'erreur apparaît dessous, avec une icône. Survole le champ : le bord reste rouge. N'envoie rien d'autre.
16. Appuie sur Tab depuis le haut de la page : chaque élément atteint montre un anneau bleu marine bien visible, légèrement décollé.

F. Image de partage
17. Ouvre https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/opengraph-image-pwu6ef : une image blanche avec le nouveau logo, le titre en grotesque très gras, et la promesse en gris dessous, sans trait.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 3. Recette de l'espace sur ordinateur, sur l'aperçu

Avant ce prompt : connectez-vous vous-même sur l'aperçu avec l'adresse du prompt 1, fenêtre en grand.

```
Tu continues la recette de la nouvelle charte (v2) de PULSACITY, dans l'espace du créateur, sur l'aperçu https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app, fenêtre en grand. Je suis connecté. Tu ne supprimes rien, tu n'envoies aucune demande, tu ne valides et ne masques aucun témoignage, sauf quand le point le dit. Pour chaque point, note « OK » ou décris ce que tu vois.

A. Coque (https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/app)
1. Le fond de la page est bleu très pâle. À gauche, une colonne blanche sans trait de séparation : le logo en haut, puis Accueil, Témoignages, Offres, Widgets, Connecteurs, Demandes, Réglages, chacun avec son icône.
2. « Accueil » est sur une pilule jaune, en gras. « Témoignages » porte une pastille corail avec un nombre en bleu marine. Survole « Offres » : une pilule bleu clair apparaît.
3. En bas de la colonne, le bouton du compte : un avatar rond, le nom, une flèche. Clique-le : un menu blanc s'ouvre au-dessus, avec le nom, l'adresse, « Plan Gratuit », puis Mon compte, Abonnement et factures, Aide et contact, Se déconnecter. N'en clique aucun.
4. Le menu ouvert, appuie sur Échap : il se ferme. Mets le focus sur le bouton du compte (Tab), puis appuie sur la flèche du bas : le menu s'ouvre sur « Mon compte » ; la flèche du bas passe à l'option suivante. Échap ferme et rend le focus au bouton.

B. Accueil de l'espace (même page)
5. « Bonjour » en grand titre très gras. Les quatre chiffres (témoignages validés, note moyenne, en attente, taux de réponse) sont chacun dans une tuile blanche arrondie, en grands chiffres très gras.
6. Les derniers témoignages sont des cartes blanches ; le texte des avis est dans une police simple (Figtree), pas dans la police des titres. Les étoiles pleines sont jaunes, cernées de bleu marine.
7. Le panneau « Étapes restantes » est bleu clair, aux coins arrondis.

C. Témoignages (https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/app/temoignages)
8. Le tableau : une rangée d'en-tête bleu clair arrondie, puis les lignes sans trait entre elles ; survolée, une ligne devient bleu très pâle. « Valider » est un bouton blanc bordé, « Masquer » un lien souligné, puis le bouton « … ».
9. Les badges : « En attente » sur fond crème avec une horloge, « Validé » sur fond vert pâle avec une coche, « Masqué » sur fond gris avec un œil barré.
10. Clique le « … » d'une ligne : un menu blanc arrondi s'ouvre, « Ouvrir » puis « Supprimer définitivement » en rouge. Clique « Supprimer définitivement » : une fenêtre s'ouvre au centre, sur un voile bleu marine. Le titre en grotesque gras, le bouton « Annuler » bordé à gauche, « Supprimer l'avis » en rouge à droite, une croix en haut à droite. Le focus est sur « Annuler ».
11. Appuie sur Échap : la fenêtre se ferme, rien n'est supprimé. Rouvre-la, puis clique sur le voile, hors de la fenêtre : elle se ferme aussi.
12. Dans les filtres, ouvre la liste « Statut » : dans Chrome, une liste blanche arrondie s'ouvre sous le champ, l'option choisie sur fond bleu clair en gras, avec une coche. Choisis « En attente », puis remets « Tous ».

D. Demandes (https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/app/demandes)
13. Les pastilles « Statut » au-dessus de la liste : bordées de bleu marine ; celle choisie est jaune, avec une coche. Clique « Planifiées » : la liste se filtre, la pastille devient jaune.
14. Clique « Demander un avis » : la fenêtre s'ouvre, ses champs ont 56 px de haut et des coins arrondis. Clique « Envoyer la demande » sans rien remplir : les champs en erreur prennent un bord rouge avec leur message. Ferme la fenêtre sans rien envoyer.

E. Connecteurs et widgets
15. https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/app/connecteurs/systeme-io : l'adresse de connexion et la clé sont dans des champs bleu très pâle (lecture seule), « Copier » jaune pour l'adresse, « Copier » bordé pour la clé ; les étapes et les derniers événements en cartes, sans trait.
16. https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/app/widgets, puis « Modifier » sur le widget : les réglages à gauche avec leurs champs v2, « Thème » et « Coins des cartes » en pilules bleu clair (option choisie en bleu marine), l'aperçu du widget à droite. Le widget de l'aperçu garde son allure d'avant : c'est attendu (lot 4.8).

F. Page de collecte
17. https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/t/julie-nutrition : fond blanc, champs arrondis, la case du consentement sur une ligne bleu très pâle, le bouton « Envoyer mon avis » jaune et arrondi. Tout en bas, « Propulsé par » suivi de la petite fusée et « PULSACITY » dessinés en gris. N'envoie rien.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu, sans adresse e-mail.
```

---

## 4. Recette à 360 px, sur l'aperçu

```
Tu continues la recette de la charte v2 de PULSACITY sur l'aperçu https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app, dans un cadre de 360 px de large (outils de développement, mode appareil, largeur 360). Je suis connecté. Pour chaque point, note « OK » ou décris ce que tu vois. Sur chaque page, vérifie aussi que rien ne dépasse à droite : document.documentElement.scrollWidth vaut 360.

1. https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/tarifs : en haut, le petit logo et un bouton menu (trois traits). Touche-le : un panneau blanc aux coins arrondis en bas s'ouvre sous l'en-tête, sur un voile bleu marine ; Intégrations, Tarifs (sur fond bleu clair, en gras), Guides, Se connecter, chacun avec une flèche, puis le bouton jaune « Créer mon espace gratuit » sur toute la largeur. Le bouton du menu est devenu une croix sur un rond bleu clair. La page derrière ne défile plus.
2. Touche le voile : le menu se ferme.
3. Les trois plans l'un sous l'autre, le pied de page en deux colonnes de liens.
4. https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/ : le grand titre tient dans la largeur, sans mot coupé qui déborde.
5. https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/app : en haut, un en-tête blanc avec le petit logo et l'avatar rond. En bas, une barre fixe blanche à l'ombre douce : Accueil, Témoignages, Demandes, Plus ; l'onglet actuel a son icône sur une pilule jaune et son libellé en gras. Le bas de la page n'est pas caché par la barre.
6. Touche l'avatar : la page « Plus » s'ouvre. « Votre espace » (Offres, Widgets, Connecteurs, Réglages) et « Votre compte » (avatar, nom, adresse, plan, puis Mon compte, Abonnement et factures, Aide et contact) sur des cartes blanches arrondies, sans trait entre les lignes. Puis « Se déconnecter » bordé, sur toute la largeur. Ne le touche pas.
7. https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/app/temoignages : les témoignages en cartes blanches sur fond bleu très pâle ; les filtres « Statut », « Offre », « Note » en pastilles bordées.
8. Sur une carte, touche le « … », puis « Supprimer définitivement » : la fenêtre s'ouvre comme une feuille ancrée en bas de l'écran, coins arrondis en haut, le bouton rouge « Supprimer l'avis » en premier sur toute la largeur, « Annuler » dessous. Touche « Annuler ».
9. https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/app/demandes, puis https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/app/connecteurs/systeme-io, puis https://pulsacity-git-claude-lot-4-2-fo-b3173d-jawadboughalems-projects.vercel.app/t/julie-nutrition : rien ne dépasse, les boutons tiennent sur leur ligne.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu.
```

---

## 5. Vérification sur pulsacity.com, après la fusion

```
Tu vérifies la nouvelle charte graphique de PULSACITY en production, sur https://pulsacity.com. Tu ne crées aucun compte et tu n'envoies aucun formulaire. Pour chaque point, note « OK » ou décris ce que tu vois.

1. https://pulsacity.com : le nouveau logo (fusée bleu marine, étoile corail) dans l'en-tête et l'onglet du navigateur ; le bouton principal jaune ; les titres en grotesque très gras. Aucun rouge carmin.
2. https://pulsacity.com/tarifs : les trois colonnes arrondies, Essentiel en bleu clair ; la bascule Mensuel / Annuel en pilule.
3. Dans la console, sur https://pulsacity.com : performance.getEntriesByType("resource").filter(e => e.name.includes("fonts.g")).length doit valoir 0 (aucune police chargée chez Google).
4. Lance PageSpeed Insights (https://pagespeed.web.dev) sur https://pulsacity.com puis sur https://pulsacity.com/tarifs, en mobile. Note la performance, l'accessibilité, les bonnes pratiques et le SEO de chaque page.
5. Ouvre https://www.opengraph.xyz/url/https%3A%2F%2Fpulsacity.com%2Ftarifs : l'aperçu montre le nouveau logo et le titre en grotesque très gras.

Compte rendu à me donner : la liste des points avec « OK » ou ce que tu as vu, et les notes de PageSpeed.
```
