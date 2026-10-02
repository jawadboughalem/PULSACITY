# État du projet

Mis à jour le 2 octobre 2026, avec la PR #22 : le lot 5 (widget) et sa suite (PR #21) sont en ligne et vérifiés sur une vraie page Systeme.io ; la PR #22 apporte les réponses de Design du 2 octobre, l'enregistrement de l'éditeur réglage par réglage et la décision des prix TVA comprise (`docs-internes/decision_tarifs.md`, recette dans `docs-internes/recette/lot-5-widget-fin.md`). À lire au début de chaque session, et à mettre à jour à chaque fusion sur `main`.

## En ligne sur pulsacity.com

- Socle : Next.js à Francfort, base Supabase, connexion par lien magique, CI (PR #8 à #14).
- Inscription, création de l'espace, onboarding des formations, page publique de collecte `/t/[espace]` et `/t/[espace]/[offre]` (PR #12).
- Espace du créateur, maquette 4 : accueil, témoignages (liste, filtres, fiche, « Valider », « Masquer », « Mettre en avant », texte affiché, suppression définitive). Identité v2 : logo, favicon, micro-animations (PR #15).
- Ajout manuel (m15), import CSV (m16) et page Offres (m17), avec les corrections de la recette du lot 4, recettés sur l'aperçu (PR #19).
- Widget, maquettes 2 et 6 : `w.js` (mur, carrousel, badge), JSON public `/api/widget/[id]` en cache à la périphérie, pages Widgets et éditeur avec aperçu en direct, guide « Coller dans Systeme.io » (PR #20). Vérifié le 2 octobre sur une vraie page Systeme.io.
- Suite du widget, maquettes du 2 octobre : liste m18, éditeur sur téléphone, nom du widget, coins des cartes, code qui nomme le type, chargements du carrousel et du badge (PR #21). Vérifié le 2 octobre sur la page Systeme.io, avec 15 avis.
- Trois environnements : local, recette sur chaque aperçu Vercel, migrations de production lancées à chaque fusion et attendues par Vercel avant la mise en ligne (PR #16).

## Pas encore construit

- Connecteur Systeme.io : les payloads réels sont capturés (`docs-internes/connectors/systeme.md`, fixtures dans `src/lib/connectors/systeme/__fixtures__`). Restent `normalize`, la réception des webhooks (`/api/connectors/...`) et l'écran Connecteurs (maquette 5).
- Demandes d'avis : planification, Vercel Cron, e-mails de demande et de relance (maquette 3), désinscription.
- Pages Connecteurs, Demandes, Réglages et Facturation de l'espace.
- Stripe (abonnements, Checkout, portail) et page Tarifs.
- Site : accueil (maquette 7), intégrations, guides, pages légales.

## Fait le 1er octobre (prompts de `docs-internes/recette/actions-1er-octobre.md`)

- Base de recette avec son propre mot de passe ; jeton R2 de production vérifié (Object Read & Write sur `pulsacity-photos` seul).
- Recette du lot 4 sur l'aperçu : 30 points sur 31 sur ordinateur, 7 sur 9 à 360 px. Les trois écarts sont corrigés dans la PR qui suit : messages « Délai enregistré. » et « Demandes automatiques désactivées. » absents, filtres « Statut / Offre / Note » qui débordaient à 360 px.
- Envoi d'une photo et lien de connexion vérifiés sur l'aperçu.
- `main` protégée sur GitHub ; alerte GitGuardian 37781349 classée (« test credential »).
- Vercel attend bien « CI » et « Database migration » avant de mettre la production en ligne.
- Claude Design a livré les maquettes m15 (ajout manuel), m16 (import CSV) et m17 (offres).

## Recette du lot 5 sur l'aperçu (2 octobre)

- Prompts 1 à 3 : 17 points sur 18 sur ordinateur, 7 sur 7 à 360 px. Le point manqué venait du test : le champ « Rechercher » coupe à 80 caractères, et le code copié, lu ailleurs, était correct.
- Trois remarques, corrigées dans la PR #20 : l'avertissement de couleur en thème sombre proposait Encre et poussait le sélecteur de thème ; les initiales du badge se coupaient ; à 360 px, dix points du carrousel touchaient les flèches. Contre-recette (prompt 3 bis) : 4 points sur 4.
- Remarque de la contre-recette, corrigée aussi : pendant le défilement lancé par une flèche, le compteur du carrousel revenait à l'avis de départ avant d'afficher le suivant.

## Vérification du lot 5 en production (2 octobre)

- Prompts 4 à 6 de `lot-5-widget.md`, sur une page de test Systeme.io : le mur, le carrousel et le badge s'affichent, et un changement de type arrive sur la page en une minute. « Sur une page depuis le 2 oct. 2026 » et l'étape « Coller le widget » de l'accueil se sont cochés.
- Le compte de test n'avait qu'un avis : le défilement du carrousel, ses points et « Voir les autres avis » restent à voir sur la vraie page (prompt 4 de `lot-5-widget-suite.md`).
- Styles agressifs collés dans un autre élément « Code HTML » : la page Systeme.io est abîmée, le widget reste intact. Systeme.io n'isole pas les éléments, le test est donc probant.
- PageSpeed Insights, page avec et sans widget : performances 100 et 96 sur mobile, 95 et 91 sur ordinateur, CLS 0 partout. Aucun effet mesurable du widget ; le temps de blocage vient du code de Systeme.io.
- À savoir, sans rien à corriger chez nous :
  - sur téléphone, le badge flottant « Réalisé avec systeme.io » de l'offre gratuite de Systeme.io couvre le bas de la page, donc « Propulsé par » quand le widget est le dernier élément. Une vraie page de vente a du contenu après ;
  - Systeme.io centre le contenu de la page : « Propulsé par » passe alors sous le badge, comme m2 le prévoit pour une page centrée ;
  - sans couleur d'accent dans l'espace, les étoiles prennent la couleur des liens de la page (bleu sur une page vierge).
- Les maquettes du 2 octobre (m18, éditeur mobile, chargements, nom, coins des cartes) sont construites dans la PR #21.

## Recette de la PR #21 sur l'aperçu (2 octobre)

- Prompt 1 : migration 0005 appliquée à la base de recette (« Recette database migration » n° 5, vert).
- Prompt 2 : 9 points sur 9 sur ordinateur (nom, coins des cartes, code copié, code avec son type).
- Prompt 3 : 6 points sur 8 à 360 px. Le point 1 venait du prompt : m18 mobile met la miniature à gauche, et l'écran la suit. Point 7 : l'aperçu passait « Camille R. » et « Thomas L. » sur deux lignes, l'initiale seule dessous ; il dessine maintenant la page à 390 px, comme m2 mobile.
- Contre-recette (prompt 3 bis) : les dix noms tiennent sur une ligne. PR #21 fusionnée ; « CI », « Database migration » (migration 0005 en production) et « Recette database migration » verts sur `main`.

## Vérification de la PR #21 en production (2 octobre)

- Prompt 4 de `lot-5-widget-suite.md`, sur la page Systeme.io de test. Offre « Atelier cuisine » ajoutée. Import de `temoignages-50-lignes.csv` : 47 témoignages importés, les 3 lignes fautives refusées comme prévu (note « 6 », nom vide, texte vide et date « 35/08/2026 ») ; 15 publiés, le maximum du plan Gratuit, et 33 en attente.
- Sur ordinateur : mur de 12 cartes sur 3 colonnes, « 4,7/5 · 15 avis », puis « Voir les 3 autres avis », qui ajoute les 3 dernières. Carrousel : 3 cartes, la flèche avance d'une carte et le point suit (12 avis, le « Nombre maximum »). Badge : la photo, deux initiales, les étoiles et la note.
- À 360 px : mur sur deux colonnes, aucune initiale seule sur une ligne. Carrousel : une carte, « 1 sur 12 », et le compteur passe à « 2 sur 12 » 115 ms après le début du défilement. Le vrai glissement au doigt reste à faire sur un téléphone (Claude in Chrome ne sait pas le simuler).
- Remarque : après des changements de type, les cartes avaient des coins arrondis. Aucun code ne touche aux coins quand le type change. Cause la plus probable : l'éditeur enregistrait tout le widget à chaque changement, si bien qu'un éditeur resté ouvert ailleurs (sur le téléphone, par exemple) réécrivait ses anciens réglages. Corrigé dans la PR #22 : chaque enregistrement ne porte que ce qui vient de changer, dans l'ordre. Vérifié avec deux éditeurs ouverts : l'un choisit « Arrondis », l'autre change le type, les coins restent arrondis.

## Réponses de Design du 2 octobre (prompt 5), construites dans la PR #22

- Mur : une colonne quand le widget fait moins de 340 px de large, deux jusqu'à 1024 px, trois au-delà. Ce sont les largeurs du widget, pas de l'écran : m2 mobile (390 px, 24 px de marge, widget de 342 px) garde deux colonnes ; un téléphone de 360 px avec 20 px de marge (320 px) passe à une colonne. Inscrit dans la charte.
- m6 mobile, « Aperçu » : la page à 390 px, réduite, avec ses deux colonnes, et « L'aperçu suit vos réglages. » : déjà le cas.
- m2 mobile, chargement du carrousel : les flèches encadrent quatre points sur une ligne, comme le carrousel chargé. Le squelette passe de trois à quatre points sur téléphone (trois sur ordinateur, comme m2).
- m18 : texte de l'encadré du plan Gratuit repris mot pour mot, sauf « HT », retiré par la décision des prix TVA comprise.
- Guide mobile : la ligne « Bloquée à une étape ? Écrivez-nous » reste dans la maquette, en attente de l'adresse de support.
- Design signale que le comparatif de m8 (Tarifs) montre encore « Tri par offre » comme absent du plan Gratuit : à corriger avec la décision des prix (prompt pour Design dans `lot-5-widget-fin.md`).

## À faire

1. Recette de la PR #22 : prompts de `docs-internes/recette/lot-5-widget-fin.md` (aperçu, puis page Systeme.io après la fusion, puis Design pour m8).
2. Régime de TVA de l'entité qui facture PULSACITY, à confirmer avec l'expert-comptable avant le lot Stripe (`decision_tarifs.md`).
3. Dépôt public ou privé : décision du fondateur (en privé, protéger `main` demande GitHub Pro).
4. Sentry, avant le lancement.
5. Prochain lot : au choix du fondateur, parmi « Pas encore construit » ci-dessus.

Remarques de la recette, à reprendre quand on touchera ces écrans :
- la photo met 3 à 5 secondes à s'afficher (adresse r2.dev, déjà prévue avant le lancement) et le récapitulatif après l'envoi ne la montre pas ;
- les compteurs du haut de la liste se mettent à jour environ une seconde après « Valider » ou « Masquer » ;
- un premier clic sur « Importez un fichier CSV » n'a rien fait une fois, le second a ouvert la page ;
- les liens Connecteurs, Demandes et Réglages mènent à des pages pas encore construites.

## Décisions du 1er octobre (maquettes m15 à m17)

- Import CSV : une formation qui ne correspond à aucune offre est refusée, avec le message de la maquette. L'import ne crée plus d'offre.
- Prix des offres (m17) : il s'affichera avec le connecteur Systeme.io, qui le fournit. En attendant, chaque offre montre son nombre de témoignages.
- Identifiants par connecteur (« Modifier », « Associer un produit Systeme.io ») : avec le connecteur. En attendant : « Aucun outil connecté ».
- Un témoignage ajouté à la main arrive en « Validé ».

## Décisions du 1er octobre (lot 5, widget)

- Le code à coller tient sur une ligne : `<div data-pulsacity-widget="…"></div><script async src="https://pulsacity.com/w.js"></script>`. Le même part de l'accueil, de l'éditeur et de l'e-mail. Plusieurs widgets sur une page : un seul `w.js` les monte tous, même ajoutés après coup.
- Le type, l'offre et les réglages sont lus à chaque affichage : les changer dans l'éditeur ne demande pas de recoller le code. Le JSON est en cache 60 s à la périphérie, puis servi en arrière-plan jusqu'à un jour ; `w.js` est gardé une heure par les navigateurs, la police du logo un an (une nouvelle version prend un nouveau nom).
- Le JSON public ne contient que ce qui s'affiche : nom, initiales, titre, photo, note, texte affiché, jour de réception (heure de Paris). Jamais d'e-mail ni d'identifiant de client ou de témoignage. Le badge ne reçoit que trois visages, sans nom.
- Ordre : mis en avant, puis les plus récents. Le mur montre « Nombre maximum » d'avis, puis « Voir les N autres avis » en apporte 50 à la fois. La note et le nombre d'avis comptent tous les témoignages validés du widget (de son offre, s'il en a une), pas seulement ceux affichés.
- Sans témoignage validé, ou pour un widget inconnu, le widget ne prend aucune place sur la page.
- Couleur d'accent : celle choisie dans l'éditeur, sinon celle de l'espace, sinon celle des liens de la page. Sous 3:1 sur les cartes, le widget prend Encre (cartes claires) ou le carmin clair (cartes sombres), et l'éditeur prévient.
- Le résumé (note et nombre d'avis) est sur sa propre ligne, au-dessus du mur, à droite sur un écran large : un widget ne peut pas se placer à côté du titre de la page, comme dans m2.
- La photo de m2 jointe à l'avis n'existe pas dans le modèle : la photo est le portrait de l'auteur, affiché dans le rond.
- Espace réservé pendant le chargement : sous le premier écran, un mur en attente (560 px, 600 dès 1024) ; dans le premier écran, rien, car le type n'est connu qu'avec la réponse et un badge n'a pas la taille d'un mur.
- Premier affichage : enregistré quand le JSON est demandé depuis une autre page que pulsacity.com. Il coche l'étape « Coller le widget » de l'accueil, et la liste dit « Sur une page depuis le … ».
- « Masquer « Propulsé par PULSACITY » » : plan Pro seulement, vérifié dans l'éditeur, à l'enregistrement et dans le JSON. Le lien mène à `https://pulsacity.com/?ref=<code de parrainage>`.
- Plan Gratuit : un widget (`plans.ts`). « Créer un widget » est grisé au-delà, avec le lien vers les plans.
- Une offre retirée ne supprime plus le widget filtré sur elle : il montre alors toutes les offres.
- Guide « Coller dans Systeme.io » : les quatre étapes de la consigne du lot (élément Code HTML, « Modifier le code », coller, enregistrer puis aperçu), illustrées par des dessins à la place des captures prévues par m6.
- Espace de démonstration : la couleur d'accent #4F6F52, le vert de m2 et m6.
- Contraste insuffisant : l'avertissement s'affiche sous le thème, pour ne jamais déplacer le contrôle utilisé. Il propose Encre sur les cartes claires seulement (la charte) ; sur les cartes sombres, il annonce le carmin clair.
- Initiales du badge superposées de −8 px, la valeur basse de la charte (−8 à −10), pour qu'elles se lisent en entier.
- Carrousel : chaque point garde sa zone de 44 × 44 (la charte). Quand ils ne tiennent plus entre les flèches, « 2 sur 10 » les remplace.

## Décisions du 2 octobre (suite du lot 5, maquettes de Design)

- Le choix d'une offre dans un widget reste ouvert à tous les plans (m18 le réservait au plan Essentiel). Raisons :
  - le plan Gratuit doit montrer la promesse sur une vraie page de vente : un widget qui mélange les avis de plusieurs offres convainc moins, et un créateur déçu ne passe pas au payant, il part ;
  - le passage au payant a déjà ses déclencheurs, qui grandissent avec l'usage : 15 témoignages validés (les suivants attendent, visibles dans l'espace), 20 demandes par mois, un seul widget (deux offres, deux pages, donc deux widgets) ;
  - chaque widget gratuit affiché porte « Propulsé par PULSACITY » et son lien de parrainage : plus il convainc, plus il amène de créateurs ;
  - une règle de moins, c'est une page Tarifs plus claire, et pas de cas à gérer quand un créateur repasse au plan Gratuit.
  L'encadré du plan Gratuit (m18) dit donc « vous créez autant de widgets que vous voulez : un pour chaque page de vente », sans la mention de l'offre.
- Le code à coller nomme le type du widget (`data-pulsacity-type`), toujours sur une ligne. `w.js` montre le squelette de ce type pendant le chargement, même dans le premier écran, comme les nouvelles maquettes m2. Changer le type ensuite ne demande pas de recoller le code : seul le squelette garde l'ancien type le temps du chargement. Un code collé avant le 2 octobre garde l'ancien comportement.
- Nom du widget : nouvelle colonne facultative `widgets.name` (migration 0005), 80 caractères au plus, jamais montrée aux visiteurs. Vide, le nom reste « Mur · Toutes les offres ».
- Coins des cartes : « Droits » (2 px, par défaut) ou « Arrondis » (16 px), dans `settings.cardStyle`.
- Éditeur sur téléphone : onglets « Réglages » et « Aperçu », puis « Installer le widget », l'e-mail d'abord. L'aperçu dessine la page à 390 px au moins, la largeur de m2 mobile, réduite au cadre : à 360 px, les deux colonnes du mur passaient « Camille R. » sur deux lignes, l'initiale seule dessous. Le guide a sa propre page (`/app/widgets/[id]/guide`).
- L'e-mail du code contient maintenant le guide en quatre étapes, du même texte que l'éditeur, comme l'annonce m6 mobile (« Il part à …, avec le guide »).
- Prix TVA comprise, ce que le créateur paie : 9,99 € et 19,99 € par mois, 99 € et 199 € par an (montants fixés par le fondateur, pour garder 8,33 € HT par abonné Essentiel). Arguments, chiffres et conséquences (textes, Stripe) dans `docs-internes/decision_tarifs.md`. L'application écrit « 9,99 € par mois », sans « HT ».
- L'éditeur enregistre réglage par réglage : chaque enregistrement ne porte que ce qui vient de changer, et ils partent l'un après l'autre. Un réglage qui n'a pas pu s'enregistrer repart avec le suivant, ou avec « Réessayer ».

## Questions ouvertes

- Noms de colonnes de m16 en police à chasse fixe : la charte n'en a pas, ils sont en gras dans la police du texte. À confirmer par Design.
- Prénom du créateur : il n'est pas demandé à l'inscription, donc l'accueil dit « Bonjour » sans prénom.
- Adresse de support : « Aide et contact » pointe vers `/aide`, qui n'existe pas, et la page du guide sur mobile (« Bloquée à une étape ? Écrivez-nous ») l'attend aussi : sa ligne n'est pas affichée en attendant.
- Page Tarifs (m8) : à redessiner par Design avant son lot, pour les prix TVA comprise (9,99 €, 19,99 €, 99 €, 199 €) et « Tri par offre » dans tous les plans.
- Effet de 9,99 € sur le passage au payant : à vérifier avec les premiers chiffres de Stripe.
- La page de vente dessinée dans l'aperçu de l'éditeur reste générique (nom de l'espace, nom de l'offre, « Ce qu'en disent mes clients ») : m6 y montre la page de Julie Nutrition (menu, prix, « Tous les avis »). Écart gardé depuis le lot 5.
