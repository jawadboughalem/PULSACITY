# Lot 7 — site public : recette

Dans l'ordre. Chaque bloc est un prompt à coller tel quel, à l'endroit indiqué.

- Prompt 1 (Claude in Chrome) : la migration 0009 sur la base de recette.
- Prompts 2 et 3 (Claude in Chrome) : recette sur l'aperçu de la PR #27, avant la fusion.
- Prompt 4 (Claude Design) : les maquettes qui manquent.
- Prompt 5 (Claude in Chrome) : vérification sur pulsacity.com, après la fusion.

Adresse de l'aperçu : https://pulsacity-git-claude-youthful-p-d48c42-jawadboughalems-projects.vercel.app. Aucun compte n'est nécessaire : toutes les pages du lot sont publiques. Il faut seulement être connecté à Vercel dans le navigateur (protection des aperçus).

Déjà vérifié par Claude Code dans son conteneur, sur le build de production :
- accueil et tarifs à côté de m7 et m8, à 1440 px et 390 px ; toutes les pages à 360 px et 1440 px, sans débordement ;
- Lighthouse mobile : `/` 95, `/integrations/systeme-io` 95, `/tarifs` 96 en performance ; 100 en accessibilité ; CLS 0 ;
- aucun lien mort ni ancre manquante sur les 16 pages ;
- « Me prévenir » : adresse incomplète refusée, adresse complète enregistrée une seule fois.

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
