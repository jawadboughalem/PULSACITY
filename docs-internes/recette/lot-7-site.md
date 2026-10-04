# Lot 7 — site public : recette

Dans l'ordre. Chaque bloc est un prompt à coller tel quel, à l'endroit indiqué.

- Prompt 1 (Claude in Chrome) : la migration 0009 sur la base de recette. Déjà vérifié par Claude Code le 4 octobre : « Recette database migration » n° 22, verte, sur le commit 592cb40. À relancer seulement si une nouvelle migration s'ajoute.
- Prompts 2 et 3 (Claude in Chrome) : recette sur l'aperçu de la PR #27, avant la fusion.
- Prompt 4 (Claude Design) : les maquettes qui manquent.
- Prompts 6 et 7 (Claude in Chrome) : contre-recette du deuxième passage (maquettes m21 à m24 et corrections de la première recette), sur l'aperçu, avant la fusion.
- Prompt 8 (Claude in Chrome) : les quatre corrections de la contre-recette, sur l'aperçu, avant la fusion.
- Prompt 9 (Claude in Chrome) : le bandeau de « Me prévenir » à 360 px avec une adresse longue, avant la fusion.
- Prompt 5 (Claude in Chrome) : vérification sur pulsacity.com, après la fusion, en dernier.

Adresse de l'aperçu : https://pulsacity-git-claude-youthful-p-d48c42-jawadboughalems-projects.vercel.app. Aucun compte n'est nécessaire : toutes les pages du lot sont publiques. Il faut seulement être connecté à Vercel dans le navigateur (protection des aperçus).

Déjà vérifié par Claude Code dans son conteneur, sur le build de production :
- accueil et tarifs à côté de m7 et m8, à 1440 px et 390 px ; toutes les pages à 360 px et 1440 px, sans débordement ;
- Lighthouse mobile : `/` 95, `/integrations/systeme-io` 95, `/tarifs` 96 en performance ; 100 en accessibilité ; CLS 0 ;
- aucun lien mort ni ancre manquante sur les 16 pages ;
- « Me prévenir » : adresse incomplète refusée, adresse complète enregistrée une seule fois.

Deuxième passage (4 octobre), vérifié de la même façon :
- intégrations, guides, pages légales et menu à côté de m21, m22, m23 et m24, à 1440 px et 360 px ; accueil et tarifs à côté des m7 et m8 corrigées ;
- Lighthouse mobile : `/` 94, `/integrations/systeme-io` 95, `/tarifs` 96, `/integrations` 95, un guide 95 en performance ; 100 en accessibilité ; CLS 0 ;
- aucun lien mort ni ancre manquante sur les 16 pages, aucune erreur dans la console ;
- à 360 px, le badge tient dans le cadre de Julie (297 px pour 302) et le carrousel a ses points (294 px pour 288 nécessaires) ;
- « Me prévenir » : les trois états de m21 ; « Dites-nous quel outil » : nom refusé s'il fait une lettre, enregistré sinon ;
- migration 0010 (table `tool_suggestions`) : appliquée en local ; sur la base de recette, Claude Code vérifie « Recette database migration » après l'envoi.

À savoir :
- Les textes légaux sont des brouillons : bandeau « Brouillon en cours de relecture », exclus des moteurs de recherche et du plan du site tant que `LEGAL_VALIDATED` n'est pas `true`. Les informations à fournir sont surlignées « [À COMPLÉTER : …] » (liste en fin de fichier).
- « Choisir Essentiel » et « Choisir Pro » mènent à l'inscription : le paiement arrive avec le lot Stripe.

---

## 1. GitHub — la migration 0009 sur la base de recette

```
Tu vérifies qu'une migration de base de données s'est bien appliquée à la base de recette de PULSACITY.

Où : https://github.com/jawadboughalem/PULSACITY/actions/workflows/db-migrate-recette.yml

Étapes :
1. Regarde la dernière exécution lancée par la branche claude/youthful-planck-ef7owc (pull request #27).
2. Dis-moi sa couleur. Si elle est verte, ouvre-la et cherche la ligne qui mentionne 0009_public_connector_waitlist, ou « migrations applied successfully ».
3. Si aucune exécution n'existe pour cette branche, ou si elle est rouge, arrête-toi et dis-le-moi.

Ne lance aucun workflow, ne touche à aucun réglage.

Compte rendu à me donner : la couleur de l'exécution, son numéro, et la ligne trouvée à l'étape 2.
```

---

## 2. Recette sur ordinateur, sur l'aperçu

Avant ce prompt : fenêtre en grand, connecté à Vercel. Choisissez une adresse de test qui arrive dans votre boîte (par exemple un alias avec « +recette7 ») et remplacez ADRESSE_TEST par elle dans le prompt.

```
Tu fais la recette du site public de PULSACITY sur l'aperçu https://pulsacity-git-claude-youthful-p-d48c42-jawadboughalems-projects.vercel.app, fenêtre en grand. Tu ne crées aucun compte et tu ne remplis aucun formulaire, sauf au point 15. Pour chaque point, note « OK » ou décris ce que tu vois.

A. L'accueil (/)
1. En haut : le logo (une petite fusée et « Pulsacity »), puis « Fonctionnement », « Tarifs », « Questions », « Se connecter » et le bouton cerclé « Créer mon espace gratuit ».
2. Le grand titre « Vos ventes deviennent des témoignages, automatiquement. » sur deux lignes, la phrase « Après chaque vente sur Systeme.io, … », le bouton foncé « Créer mon espace gratuit » et, à sa droite, une coche verte et « Compatible avec Systeme.io ».
3. Dessous, quatre colonnes numérotées de 1 à 4, reliées par un trait : « Jour 0 · la vente arrive » (une notification Systeme.io), « Jour 30 · la demande part » (un e-mail avec le bouton « Donner mon avis (1 minute) »), « 2 minutes plus tard · l'avis » (cinq étoiles et une citation), « Sur la page · le mur » (quatre petites cartes, celle de Camille R. entourée de rouge). Rien ne bouge ni n'apparaît en fondu en descendant.
4. « Comment ça marche » : trois colonnes 1, 2, 3. Puis, sur fond gris clair, « Chez vous, avec vos couleurs » et un cadre « Page de vente de Julie Nutrition · exemple » avec un carrousel d'avis aux étoiles vertes. Clique sur la flèche de droite du carrousel : il avance. Sous le carrousel, « Propulsé par Pulsacity ».
5. « Connecteurs » : Systeme.io avec le badge vert « Disponible », Stripe et Calendly avec « Bientôt ». Clique sur la ligne Stripe : la page « Témoignages automatiques pour Stripe » s'ouvre. Reviens en arrière.
6. « Tarifs » : Gratuit « 0 € pour toujours », Essentiel « 9,99 € par mois » avec « Recommandé » en rouge, Pro « 19,99 € par mois ». Aucun « HT » nulle part.
7. « Vos questions » : la première réponse est ouverte et dit « Par défaut, 14 jours ». Clique sur « Est-ce conforme au RGPD ? » : sa réponse s'ouvre et la première se ferme.
8. En bas : « Vos clients ont déjà quelque chose à dire. », le bouton, puis le pied de page foncé avec « Mentions légales », « CGU », « CGV », « Confidentialité », « Cookies », « Contact ».
9. Clique sur « Fonctionnement » puis sur « Questions » dans le menu du haut : la page descend chaque fois à la bonne section.

B. Les tarifs (/tarifs)
10. « Tarifs » est souligné dans le menu. Le titre « Un prix simple, qui suit vos ventes. », à droite « Mensuel » (actif) et « Annuel », et « Annuel : 2 mois offerts ».
11. Clique sur « Annuel » : Essentiel affiche « 99 € par an » et Pro « 199 € par an ». Reclique sur « Mensuel » : retour à 9,99 € et 19,99 €.
12. « Comparer en détail » : un tableau à quatre colonnes, la colonne Essentiel sur fond gris, les groupes « Témoignages », « Widgets », « Connecteurs », « Bientôt ». Gratuit dit « 15 », « 20 par mois », « 1 », « 1 au choix ». « Tri par offre » est coché dans les trois plans. « Mention « Propulsé par PULSACITY » » dit « Affichée », « Affichée », « Retirable ».
13. « Facturation » : « Les prix incluent-ils la TVA ? » est ouvert et parle de « 8,33 € HT par mois ».

C. Les connecteurs
14. /integrations/systeme-io : titre « Témoignages automatiques pour Systeme.io », badge « Disponible », puis « Installer la connexion Systeme.io, pas à pas » avec six étapes numérotées et une étape « Facultatif : les inscriptions sans vente ». L'étape 3 montre trois dessins des réglages Systeme.io, l'étape 6 quatre dessins de l'éditeur. Le lien « Comment ajouter des témoignages sur une page Systeme.io » ouvre le guide ; reviens. Les questions s'ouvrent une à une.
15. /integrations/stripe : badge « Bientôt », puis « Être prévenu à la sortie de Stripe ». Écris « test@exemple » dans « Adresse e-mail » et clique sur « Me prévenir » : un message rouge « Cette adresse e-mail est incomplète. … », l'adresse tapée reste dans le champ. Remplace-la par ADRESSE_TEST et clique sur « Me prévenir » : un bandeau vert « Nous vous préviendrons par e-mail. » avec l'adresse et « le jour où Stripe sera disponible ».
16. /integrations/calendly : la même page pour Calendly. Ne remplis rien.

D. Les guides
17. /guides : trois guides, chacun avec « Mis à jour le 4 oct. 2026 · … minutes de lecture ». Ouvre « Témoignages clients et RGPD : ce qu'un formateur doit savoir » : le texte se lit sur une colonne, avec des intertitres, et finit par « La liste à garder sous la main ». En bas, « Autres guides » propose les deux autres.

E. Les pages légales
18. Ouvre « Mentions légales », « CGU », « CGV », « Confidentialité » depuis le pied de page. Chacune a le bandeau gris « Brouillon en cours de relecture » et des passages surlignés « [À COMPLÉTER : …] ». La page CGU finit par « Annexe : accord de sous-traitance (article 28 du RGPD) ».
19. Dans le pied de page, « Cookies » mène à la rubrique « Cookies » de la confidentialité, « Contact » à la rubrique « Contact » des mentions légales.

Ne touche à aucun autre réglage, ne crée aucun compte.

Compte rendu à me donner : les points 1 à 19 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK. Jamais l'adresse e-mail de test.
```

---

## 3. Recette à 360 px, sur l'aperçu

Avant ce prompt : connecté à Vercel, en 360 × 800 (le même cadre que d'habitude).

```
Tu fais la recette du site public de PULSACITY à 360 px de large, sur l'aperçu https://pulsacity-git-claude-youthful-p-d48c42-jawadboughalems-projects.vercel.app. Tu ne remplis aucun formulaire. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Accueil : en haut, le logo et un bouton à trois traits. Touche-le : un menu s'ouvre avec « Fonctionnement », « Tarifs », « Questions », « Se connecter » et le bouton « Créer mon espace gratuit » ; le bouton devient une croix. Touche la croix : le menu se ferme.
2. Le grand titre, la phrase, le bouton « Créer mon espace gratuit » sur toute la largeur et, centré dessous, « Compatible avec Systeme.io ».
3. Les quatre temps de la démo l'un sous l'autre, reliés par un trait vertical à gauche, chacun avec son dessin et sa phrase.
4. « Chez vous, avec vos couleurs » : en haut du cadre, le badge « 4,8/5 · 47 avis » avec trois initiales, puis « Ils ont suivi le programme » et un carrousel d'un avis à la fois, avec des points dessous.
5. « Tarifs » : les trois plans l'un sous l'autre, « Voir le détail des tarifs » après Pro. Le pied de page range ses six liens sur deux colonnes.
6. /tarifs : « Mensuel » et « Annuel » sur toute la largeur. Chaque plan liste ses avantages, puis son bouton. Touche « Annuel » : 99 € et 199 € par an.
7. « Comparer en détail » : trois boutons « Gratuit », « Essentiel » (actif), « Pro », puis une seule colonne de valeurs. Touche « Gratuit » : « 15 », « 20 par mois », « 1 au choix », « Non inclus » pour les témoignages vidéo. Touche « Pro » : « Retirable » et « Bientôt ».
8. /integrations/systeme-io : les étapes se lisent sans rien couper ; les dessins tiennent dans la largeur.
9. /integrations/stripe : le champ « Adresse e-mail » puis le bouton « Me prévenir » sur toute la largeur.
10. Sur chacune de ces pages, rien ne déborde sur le côté (pas de défilement horizontal).

Compte rendu à me donner : les points 1 à 10 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK.
```

---

## 4. Claude Design — les maquettes qui manquent

À coller dans Claude Design, sur le projet PULSACITY.

```
Le site public de PULSACITY est construit d'après m7 (accueil) et m8 (tarifs), avec la charte v1 et l'identité v2. Plusieurs écrans n'avaient pas de maquette ; ils ont été construits avec les éléments de m7 et m8, en attendant les tiennes. Peux-tu les dessiner, en 1440 et en 360, dans le même style ?

1. /integrations : la liste des connecteurs. Construit aujourd'hui comme la section « Connecteurs » de m7 (titre à gauche, lignes à droite avec une ligne de description sous chaque nom), puis « Votre outil n'est pas encore là ? » en trois colonnes (Demander un avis, Votre lien de collecte, Le widget), puis l'appel final de m7.
2. /integrations/systeme-io : la page principale du lancement, « Témoignages automatiques pour Systeme.io ». Fil d'Ariane, case de l'initiale et badge « Disponible », grand titre, phrase en Newsreader, bouton « Créer mon espace gratuit » et lien « Voir le guide d'installation », trois avantages en colonnes. Puis « Installer la connexion Systeme.io, pas à pas » : six étapes numérotées (créer l'espace, copier l'adresse et la clé, les coller dans Systeme.io avec les trois dessins de m5, vente test, associer les produits, coller le widget avec les quatre dessins de m6), l'étape facultative « inscriptions sans vente ». Puis les questions et l'appel final.
3. /integrations/stripe (et Calendly) : badge « Bientôt », titre, phrase, puis « Être prévenu à la sortie de Stripe » avec un champ « Adresse e-mail » et le bouton « Me prévenir » ; l'état « Nous vous préviendrons par e-mail. » ; « Ce que fera la connexion » ; « En attendant, sans connecteur ».
4. /guides et un guide : liste des guides (titre, description, « Mis à jour le … · … minutes de lecture ») ; la page d'un guide : texte long sur une colonne de 68 caractères, intertitres, listes, un dessin de m6 au milieu, puis « Autres guides ».
5. Pages légales : titre, date, bandeau « Brouillon en cours de relecture » (tant que les textes ne sont pas validés), texte long, passages « [À COMPLÉTER : …] » surlignés en Attention.
6. Le menu du site sur téléphone, ouvert : aujourd'hui un panneau blanc sous l'en-tête, avec ombre shadow-float, quatre liens séparés par des filets et le bouton principal « Créer mon espace gratuit ».

Et trois corrections de m7, pour qu'elle suive m8 et la charte :
- les prix de « Tarifs » : 9,99 € et 19,99 € par mois, sans « HT », et « Tri par offre » dans les trois plans (décision du 2 octobre) ;
- le lien « Voir le détail des tarifs » est vert dans m7 : il est construit en Carmin, la couleur des liens de la charte. Confirmes-tu ?
- le comparatif de m8 sur ordinateur est vide dans l'export (seuls les noms des plans apparaissent) : il est construit avec les lignes de m8 sur téléphone. Peux-tu réexporter m8-tarifs-desktop-01 et 02 avec les lignes ?

Exporte chaque écran en PNG 2x, nommés m21-integrations-…, m22-guides-…, m23-legal-…, m24-menu-…, et les corrections sous leurs noms actuels.
```

---

## 6. Contre-recette sur ordinateur, sur l'aperçu

Avant ce prompt : fenêtre en grand, connecté à Vercel. Remplacez ADRESSE_TEST par une adresse de test qui arrive dans votre boîte (par exemple un alias avec « +recette7b »).

```
Tu fais la contre-recette du site public de PULSACITY sur l'aperçu https://pulsacity-git-claude-youthful-p-d48c42-jawadboughalems-projects.vercel.app, fenêtre en grand. Tu ne crées aucun compte. Tu remplis seulement les deux formulaires des points 9 et 11. Pour chaque point, note « OK » ou décris ce que tu vois.

A. En-tête et accueil (/)
1. En haut : « Intégrations », « Tarifs », « Guides », « Se connecter », puis le bouton cerclé « Créer mon espace gratuit ». Clique sur « Guides » : « Guides » est souligné. Reviens à l'accueil.
2. La démo en quatre temps : les quatre cadres gris ont la même hauteur, et dans le 4ᵉ, la carte de Nadia B. se lit en entier, son nom compris.
3. « Chez vous, avec vos couleurs » : dans le cadre de Julie Nutrition, juste sous la barre « Page de vente de Julie Nutrition · exemple », le badge « 4,8/5 · 47 avis » avec trois initiales et « Propulsé par Pulsacity ». Plus de bande blanche vide.
4. « Tarifs » : « Recommandé » à côté d'Essentiel est bleu foncé, comme sur /tarifs. Le lien « Voir le détail des tarifs » est rouge.

B. Tarifs (/tarifs)
5. « Recommandé » au-dessus d'Essentiel, bleu foncé. Dans « Comparer en détail », sous les titres de groupe (« Témoignages », « Widgets », « Connecteurs », « Bientôt »), il n'y a plus de trait foncé ; les valeurs (« 15 », « Illimités », « Affichée »…) sont en texte normal, pas en gras. La ligne « Témoignages vidéo » dit « — », « — » et « Bientôt » en gris.

C. Intégrations
6. /integrations : le titre « Intégrations » et une phrase à gauche ; à droite, trois lignes Systeme.io, Stripe, Calendly, chacune avec une phrase, son badge et une flèche « › ». Dessous, sur fond gris, « Votre outil n'est pas encore là ? » et trois colonnes avec une petite icône (enveloppe, lien, grille).
7. /integrations/systeme-io : le fil « Intégrations › Systeme.io ». La section « Installer la connexion Systeme.io, pas à pas » a son titre à gauche et les étapes à droite. L'étape 2 montre un cadre « Votre espace · Connecteurs › Systeme.io » avec « Adresse de connexion », « Clé secrète » et deux boutons « Copier ». L'étape 4 montre un cadre avec le bandeau vert « Connecté — dernière vente reçue il y a 3 min ». L'étape 6 montre quatre dessins, deux par ligne.
8. Toujours sur cette page : dans « Facultatif : les inscriptions sans vente », la carte « Action » dit « Collez l'adresse de l'étape 2. ». Dans « Vos questions », ouvre « Que se passe-t-il si une vente est annulée ? » : la réponse parle de « Vente annulée » cochée à l'étape 3 et dit que vous annulez la demande depuis la page Demandes. Lis-la à côté de l'étape 3 : dis-moi si tu vois encore une contradiction.
9. Retourne sur /integrations. Clique sur « Dites-nous quel outil » : un champ « L'outil où vous vendez » s'ouvre. Clique sur « Envoyer » sans rien écrire : le message rouge « Indiquez le nom de l'outil, en 2 caractères au moins. ». Écris « Recette lot 7 » et clique sur « Envoyer » : « Merci, c'est noté. » en vert.
10. /integrations/stripe : un cadre gris « Être prévenu à la sortie de Stripe », le champ « Adresse e-mail » (exemple « vous@example.com ») et « Me prévenir » à sa droite, puis « Un seul e-mail, le jour de la sortie. Votre adresse ne sert qu'à cela. ». Plus bas, « Ce que fera la connexion » (trois coches) et, sur fond gris, « En attendant, sans connecteur » (trois lignes et le bouton « Créer mon espace gratuit »). Pas de grand appel final avant le pied de page.
11. Dans le cadre gris, écris « julie@example » et clique sur « Me prévenir » : le champ devient rouge avec « Il manque la fin de l'adresse, par exemple julie@example.com. », et la phrase « Un seul e-mail… » disparaît. Remplace par ADRESSE_TEST et clique sur « Me prévenir » : dans le même cadre, un bandeau vert « Nous vous préviendrons par e-mail. » et « À l'adresse …, le jour de la sortie de Stripe. Un seul e-mail. ».

D. Guides et pages légales
12. /guides : « Démarrer » (deux guides) puis « Aller plus loin » (un guide), chaque guide avec une phrase courte, « Mis à jour le 4 octobre 2026 · … minutes de lecture » et une flèche « › ».
13. Ouvre « Comment ajouter des témoignages sur une page Systeme.io » : le fil « Guides › … », un grand titre, la date, une phrase d'introduction en Newsreader ; à droite, « Dans ce guide » et la liste des intertitres, le premier marqué d'un trait foncé. Fais défiler : le trait suit l'intertitre lu, et la liste reste visible. Clique sur « Les erreurs à éviter » : la page y saute. En bas, « Autres guides », puis directement le pied de page.
14. /confidentialite : grand titre, « Version du 4 octobre 2026 », un bandeau beige « Brouillon en cours de relecture » avec une horloge, et à droite « Sur cette page ». Les passages « [À COMPLÉTER : …] » sont surlignés en beige, en gras brun. Une rubrique « « Dites-nous quel outil », sans espace » existe. Dans le pied de page, « Cookies » mène à la rubrique « Cookies ».

Ne touche à aucun autre réglage, ne crée aucun compte.

Compte rendu à me donner : les points 1 à 14 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK. Jamais l'adresse e-mail de test.
```

---

## 7. Contre-recette à 360 px, sur l'aperçu

Avant ce prompt : connecté à Vercel, dans le même cadre de 360 × 800 que la première fois.

```
Tu fais la contre-recette du site public de PULSACITY à 360 px de large, sur l'aperçu https://pulsacity-git-claude-youthful-p-d48c42-jawadboughalems-projects.vercel.app. Tu ne remplis aucun formulaire. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Accueil : touche le bouton à trois traits. Le menu s'ouvre avec « Intégrations », « Tarifs », « Guides », « Se connecter » en grands caractères, séparés par des filets, puis le bouton « Créer mon espace gratuit ». Sous le menu, la page est assombrie par un voile bleu foncé. Touche ce voile : le menu se ferme.
2. Démo, 4ᵉ temps « Sur la page · le mur » : les quatre cartes se lisent en entier, la carte de Nadia B. avec son nom.
3. « Chez vous, avec vos couleurs » : le badge « 4,8/5 · 47 avis » tient entièrement dans le cadre, sans toucher le bord de l'écran. Sous le carrousel, entre les deux flèches, quatre points (et non « 1 sur 4 »). Touche la flèche de droite : le deuxième point devient plein.
4. « Tarifs » de l'accueil : « Recommandé » à côté d'Essentiel est bleu foncé.
5. /integrations : chaque ligne montre le nom, son badge à côté, la phrase dessous et une flèche « › » à droite.
6. /integrations/systeme-io : à l'étape 2, le cadre « Votre espace · Connecteurs › Systeme.io » montre le champ de l'adresse, le bouton « Copier » sur toute la largeur, le champ de la clé et un second « Copier ». Les dessins des étapes 3 et 6 sont l'un sous l'autre, sur toute la largeur. La carte « Action » dit « Collez l'adresse de l'étape 2. ».
7. Sur /integrations/systeme-io, dans « Vos questions », aucun « ? » ne commence une ligne. Même chose dans les questions de l'accueil et de /tarifs.
8. /guides/ajouter-des-temoignages-sur-une-page-systeme-io : sous la phrase d'introduction, un bloc « Dans ce guide » avec une flèche. Touche-le : la liste des intertitres s'ouvre. Touche « En résumé » : la page y saute.
9. /confidentialite : le bandeau beige, puis un bloc « Sur cette page » replié.
10. Sur toutes ces pages, rien ne déborde sur le côté.

Compte rendu à me donner : les points 1 à 10 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK.
```

---

## 8. Dernière vérification sur l'aperçu

Avant ce prompt : connecté à Vercel. Remplacez ADRESSE_TEST par une adresse de test (un nouvel alias, par exemple « +recette7c »).

```
Tu vérifies quatre corrections du site public de PULSACITY sur l'aperçu https://pulsacity-git-claude-youthful-p-d48c42-jawadboughalems-projects.vercel.app. Tu ne crées aucun compte. Pour chaque point, note « OK » ou décris ce que tu vois.

1. À 360 px de large (même cadre que la dernière fois) : sur l'accueil, « Chez vous, avec vos couleurs ». Le cadre de Julie Nutrition est un peu plus large que le texte au-dessus, et le badge « 4,8/5 · 47 avis » tient entièrement dedans, avec un peu de blanc de chaque côté. Sous le carrousel, quatre points.
2. Fenêtre en grand : /confidentialite. Clique sur « Cookies » dans le pied de page : dans « Sur cette page », « Cookies » est marqué d'un trait foncé. Clique ensuite sur « Vos droits » dans « Sur cette page » : « Vos droits » est marqué. Remonte tout en haut : « Qui sommes-nous » est marqué.
3. Fenêtre en grand : /integrations/stripe. Écris ADRESSE_TEST et clique sur « Me prévenir ». Dans le bandeau vert, « e-mail » n'est jamais coupé en fin de ligne. Recommence à 360 px avec un autre alias : même chose.
4. /integrations/systeme-io, « Vos questions » : ouvre « Que se passe-t-il si une vente est annulée ? ». La réponse dit qu'il faut cocher « Vente annulée » à l'étape 3, que la demande prévue s'annulera seule bientôt sans rien changer au réglage, et qu'en attendant on l'annule depuis la page Demandes. À 360 px, à l'étape 2, le champ de l'adresse finit par « … ».

Compte rendu à me donner : les points 1 à 4 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK. Jamais l'adresse e-mail de test.
```

---

## 9. Le bandeau de « Me prévenir » à 360 px

Avant ce prompt : connecté à Vercel, dans le cadre de 360 px. Remplacez ADRESSE_LONGUE par une variante « +… » de votre adresse de test, longue et sans trait d'union (la même que la dernière fois convient : une adresse déjà inscrite reçoit la même confirmation).

```
Tu vérifies une correction du site public de PULSACITY à 360 px de large, sur l'aperçu https://pulsacity-git-claude-youthful-p-d48c42-jawadboughalems-projects.vercel.app. Tu ne crées aucun compte. Pour chaque point, note « OK » ou décris ce que tu vois.

1. Ouvre /integrations/stripe. Écris ADRESSE_LONGUE dans « Adresse e-mail » et touche « Me prévenir ».
2. Le bandeau vert « Nous vous préviendrons par e-mail. » reste dans le cadre gris : l'adresse passe à la ligne si elle est trop longue (coupée au besoin à l'intérieur), et « e-mail » n'est pas coupé.
3. La page ne défile pas sur le côté.

Compte rendu à me donner : les points 1 à 3 avec « OK » ou ta description, et une capture d'écran de chaque point qui n'est pas OK, l'adresse masquée.
```

---

## 5. Vérification sur pulsacity.com, après la fusion

Après la fusion de la PR #27, une fois « CI » et « Database migration » verts sur `main`.

```
Tu vérifies le site public de PULSACITY en production. Tu ne crées aucun compte et tu ne remplis aucun formulaire.

1. Ouvre https://pulsacity.com : l'accueil s'affiche (« Vos ventes deviennent des témoignages, automatiquement. »), plus la page « bientôt ».
2. Ouvre https://pulsacity.com/robots.txt : il contient « Disallow: /app/ », « Disallow: /t/ » et « Sitemap: https://pulsacity.com/sitemap.xml ».
3. Ouvre https://pulsacity.com/sitemap.xml : il liste l'accueil, /tarifs, /integrations, /integrations/systeme-io, /integrations/stripe, /integrations/calendly, /guides et les trois guides, toutes en https://pulsacity.com. Aucune page légale (elles sont encore en brouillon).
4. Ouvre https://pagespeed.web.dev, analyse https://pulsacity.com en mobile. Note les quatre notes (performances, accessibilité, bonnes pratiques, SEO). Recommence avec https://pulsacity.com/integrations/systeme-io puis https://pulsacity.com/tarifs.
5. Ouvre https://www.opengraph.xyz/url/https%3A%2F%2Fpulsacity.com%2Fintegrations%2Fsysteme-io : l'aperçu de partage montre une image blanche avec le logo, « Témoignages automatiques pour Systeme.io » et « Vos ventes deviennent des témoignages, automatiquement. ».
6. Ouvre https://search.google.com/test/rich-results et teste https://pulsacity.com : il trouve une « Organisation » et une « FAQ » valides. Teste ensuite https://pulsacity.com/tarifs : une « FAQ » valide.

Compte rendu à me donner : les points 1 à 6 avec « OK » ou ta description, les notes PageSpeed des trois pages, et une capture d'écran de chaque point qui n'est pas OK.
```

Fait le 4 octobre : points 1 à 5 conformes. Le point 6 ne peut plus passer tel qu'il est écrit : Google a retiré les FAQ de ses résultats (mai 2026) puis de cet outil (juin 2026), et l'outil n'a pas montré l'Organization, pourtant valide pour le validateur de schema.org (voir `etat.md`).

---

## Ce que les textes légaux attendent du fondateur

À fournir à Claude Code (dans la conversation : ce ne sont pas des secrets), puis à faire relire par un juriste avant de passer `LEGAL_VALIDATED` à `true` :

- forme juridique et capital, SIREN, adresse du siège, numéro de TVA ou mention de franchise ;
- nom du directeur de la publication ;
- adresse e-mail de contact (et pour les données personnelles, si différente) et numéro de téléphone ;
- ville du tribunal compétent ;
- régime de TVA de l'entité qui facture (expert-comptable, déjà dans « À faire ») ;
- durées : suppression après la fermeture d'un espace, conservation des notifications reçues des outils (proposé : 90 jours), conservation des adresses « Me prévenir » si un connecteur ne sort pas (proposé : 12 mois) ;
- plafond de responsabilité, règle de passage à un plan inférieur, droit de rétractation des très petites entreprises : à trancher avec le juriste ;
- garantie de transfert hors Union retenue pour chaque prestataire (Vercel, Supabase, Cloudflare, Resend, Stripe).
