# État du projet

Mis à jour le 3 octobre 2026. Le lot 6 (PR #23 : moteur de connecteurs, Systeme.io, demandes d'avis, désinscription) est en ligne ; sa vérification en production attend le premier envoi automatique. La PR #24 aligne Demandes, Connecteurs et la désinscription sur les maquettes du 3 octobre (m19, m5, m1) et attend sa recette (`docs-internes/recette/lot-6-maquettes.md`). À lire au début de chaque session, et à mettre à jour à chaque fusion sur `main`.

## En ligne sur pulsacity.com

- Socle : Next.js à Francfort, base Supabase, connexion par lien magique, CI (PR #8 à #14).
- Inscription, création de l'espace, onboarding des formations, page publique de collecte `/t/[espace]` et `/t/[espace]/[offre]` (PR #12).
- Espace du créateur, maquette 4 : accueil, témoignages (liste, filtres, fiche, « Valider », « Masquer », « Mettre en avant », texte affiché, suppression définitive). Identité v2 : logo, favicon, micro-animations (PR #15).
- Ajout manuel (m15), import CSV (m16) et page Offres (m17), avec les corrections de la recette du lot 4, recettés sur l'aperçu (PR #19).
- Widget, maquettes 2 et 6 : `w.js` (mur, carrousel, badge), JSON public `/api/widget/[id]` en cache à la périphérie, pages Widgets et éditeur avec aperçu en direct, guide « Coller dans Systeme.io » (PR #20). Vérifié le 2 octobre sur une vraie page Systeme.io.
- Suite du widget, maquettes du 2 octobre : liste m18, éditeur sur téléphone, nom du widget, coins des cartes, code qui nomme le type, chargements du carrousel et du badge (PR #21). Vérifié le 2 octobre sur la page Systeme.io, avec 15 avis.
- Lot 6, connecteurs et demandes : moteur de connecteurs, connecteur Systeme.io, pages Connecteurs et Demandes, offres à associer, e-mails de demande et de relance, désinscription (PR #23, fusionnée le 3 octobre, migration 0006 appliquée en production).
- Trois environnements : local, recette sur chaque aperçu Vercel, migrations de production lancées à chaque fusion et attendues par Vercel avant la mise en ligne (PR #16).

## Lot 6 (PR #23), en ligne depuis le 3 octobre

- Moteur de connecteurs : `/api/connectors/[connector]/[token]` résout le connecteur par le registre (`src/lib/connectors/registry.ts`) et la connexion par son jeton, 404 silencieux sinon. Le corps brut et les en-têtes vont dans `webhook_events`, la réponse 200 part tout de suite, le traitement suit (`after()`), et la tâche d'envoi rattrape un événement resté non traité. Le cœur (`src/lib/purchases/record-purchase.ts`) ne connaît que `NormalizedPurchase`. Ajouter un connecteur : son dossier et une ligne dans le registre (prouvé le 3 octobre avec un faux connecteur « test », puis retiré ; un test Vitest garde la preuve).
- Connecteur Systeme.io : « Nouvelle vente » (signée, HMAC-SHA256 du corps brut) et « Inscrit à la formation » (règle d'automatisation, non signée, authentifiée par le jeton de l'adresse). Tests sur les fixtures réelles.
- Écrans : Connecteurs (m5), Connecteurs > Systeme.io (m5 : voyant, 3 étapes, offres à associer, derniers événements, historique), Offres (prix et produit Systeme.io, m17), Demandes (sans maquette), page de confirmation de désinscription.
- Envois : tâche `/api/cron/requests` (verrou sur `sentAt`, limite du plan, relance unique à J+4, trois essais puis « Échec »), e-mails de demande et de relance de m3, désinscription en un clic par lien signé et par le bouton du client de messagerie (`List-Unsubscribe`).
- Migration 0006 : tables `external_products` et `connector_waitlist`, colonnes facultatives, contraintes uniques sur `connections (space_id, connector)` et `purchases (connection_id, external_ref)`.

## Recette de la PR #23 sur l'aperçu (3 octobre)

- `CRON_SECRET` ajouté dans Vercel (Production) et dans les secrets GitHub (prompts 1 et 2). Espace de recette rempli depuis la branche de la PR (prompt 3).
- Prompt 4 (écrans Connecteurs) : 16 points sur 16.
- Prompt 5 (vente simulée au format capturé, e-mail, rejeu, clé différente, désinscription) : 18 points sur 19. Le point manqué : la demande qui partait au prochain envoi était sixième de la liste Demandes. Corrigé : les demandes à envoyer d'abord, la plus proche en haut.
- Prompt 6 (360 px) : mise en page conforme, mais le filtre « Statut » de Demandes ne filtrait pas (nom du paramètre importé d'un composant client dans la page serveur). Corrigé et vérifié dans le conteneur ; contre-recette : prompt 6 bis.
- Prompt 6 bis (contre-recette) : 7 points sur 7. L'ordre et le filtre de Demandes sont conformes, à 1 536 px et à 360 px. Le menu natif du filtre ne réagit pas aux clics de Claude in Chrome dans un cadre de 360 px : à essayer au doigt sur un vrai téléphone.
- Le logo de l'e-mail « Nouveau témoignage » ne s'affiche pas depuis un aperçu (image protégée par Vercel Authentication) : rien à corriger, la production le sert à tous.

## Vérification du lot 6 en production (3 octobre)

- Prompt 7, sur l'espace de production « Recette Nutrition » : webhook « PULSACITY » créé dans Systeme.io, adresse et clé collées par le fondateur, « Nouvelle vente » et « Vente annulée » cochées. Vraie commande à 13:30 (produit physique à 1 €, paiement à la livraison, tunnel créé pour le test) : l'événement arrive en moins d'une minute, le voyant passe au vert, le produit s'associe à l'offre (délai 0 jour) et la demande est « Planifiée · Part au prochain envoi ».
- Point 12 manqué : 25 minutes après, la demande n'était pas partie. Le workflow « Send review requests » n'avait encore jamais tourné tout seul depuis la fusion : GitHub tarde parfois à démarrer un nouveau planning, surtout aux quarts d'heure pleins, les plus chargés. Claude Code l'a lancé à la main à 14:00 (heure de Paris) ; le résultat est à vérifier par le fondateur (Actions, Demandes, boîte de test). Le planning passe aux minutes 7, 22, 37 et 52.
- Restent : remettre le délai de l'offre de test à 14 jours une fois l'e-mail reçu ; désactiver le paiement à la livraison et le tunnel de test dans Systeme.io.

## Maquettes de Design du 3 octobre (prompt 8)

- 19 PNG dans `docs-internes/maquettes/`, index mis à jour : m19 Demandes (liste, filtre « Planifiées », plan Gratuit à 20 demandes, vide, planche des statuts), m5 (téléphone, clé différente, changer d'adresse et de clé, étape facultative des inscriptions), m1 (désinscription confirmée).
- Badges de Demandes, sans nouvelle couleur : Planifiée sur Papier ; Envoyée et Relancée en blanc cerclé d'Encre ; Annulée en pointillé Gris 400, texte Ardoise ; Complétée et Échec en Succès et Erreur.
- Étape facultative : Design supposait qu'une inscription arrive comme une vente à 0 €. Les formats capturés disent autre chose : c'est un événement à part (« Inscrit à la formation »), sans prix, associé à une offre comme un produit.
- Captures des réglages Systeme.io : Design recommande les vraies, recadrées sur la zone utile, le champ encadré en Encre, refaites quand Systeme.io change. Elles demandent le compte Systeme.io du fondateur : prompt Claude in Chrome à prévoir ; les dessins restent en attendant.
- Logos : un logo officiel seulement avec l'accord écrit de Systeme.io et de Calendly (aucun kit officiel trouvé ; le badge partenaire de Stripe est réservé à ses partenaires). En attendant, le nom en texte, comme aujourd'hui (l'initiale dans une case).
- Signature des e-mails : pas d'adresse postale du créateur. Le pied d'e-mail portera celle de PULSACITY, qui envoie le message, avec le nom de l'espace et le lien de désinscription (à faire valider). Prénom et ville : deux champs facultatifs, « Signature » et « Ville », dans Réglages, rubrique E-mails, hors de l'onboarding ; sans prénom, l'e-mail signe du nom de l'espace.

## Construit dans la PR #24 (maquettes du 3 octobre), en recette

- Demandes (m19) : sous-titre de la maquette ; chiffres du mois comme l'accueil (envoyées ce mois et relancées parmi elles, complétées, taux de réponse) ; pastilles « Statut » avec leur nombre sur ordinateur, liste déroulante avec les nombres sur téléphone ; une ligne par demande avec ses initiales, son badge et ses actions en liens ; badges de la planche des statuts ; « Afficher les … suivantes » et « Et … autres demandes planifiées. » au lieu des pages ; état vide avec « Connecter Systeme.io » (tant que la connexion n'est pas active) et « Copier mon lien ».
- Plan Gratuit plein : encadré « Les 20 demandes d'octobre sont parties. », lignes « Prévue le 6 oct. · partira le 1er nov. », plus de « Envoyer maintenant ».
- Actions par statut : « Envoyer maintenant » et « Annuler » (planifiée), « Annuler la relance » (envoyée, relance prévue), « Voir l'avis » (complétée, vers la fiche du témoignage), « Corriger l'adresse » (échec).
- Connecteurs (m5) : « Adresse partagée par erreur ? Changer d'adresse et de clé » et sa fenêtre ; bandeau ambre « 1 vente gardée de côté » quand la connexion remarche mais qu'une vente signée avec une autre clé attend « Rejouer » ; cette vente reste en tête des derniers événements, en ambre, avec « Rejouer » et son icône ; étape facultative « les inscriptions sans vente » ; mise en page téléphone (logo au-dessus du titre, titres de section plus petits, « Plus simple depuis un ordinateur. », « Voir tout l'historique » sous la liste).
- Désinscription (m1) : rond Encre, second texte en Ardoise, bouton carmin « Écrire à … » sur toute la largeur, « Propulsé par » juste dessous.
- Migration 0007 : colonnes facultatives `review_requests.cancelled_at`, `review_requests.failed_at`, `external_products.event_type`.
- Dates : « 1er » pour le premier jour d'un mois (« Partira le 1er oct. »), partout où l'application écrit une date courte.

## Pas encore construit

- « Vente annulée » de Systeme.io : son payload n'a jamais été capturé (un remboursement de paiement à la livraison n'émet rien). Les événements reçus sont gardés sans être lus ; une demande d'une vente remboursée part donc quand même, sauf si le créateur l'annule dans Demandes. À capturer avec une vente Stripe en mode test, puis à traiter.
- Pages Réglages et Facturation de l'espace.
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

## Recette de la PR #22 (3 octobre)

- Prompt 1 de `lot-5-widget-fin.md`, sur l'aperçu : 8 points sur 8. Deux éditeurs ouverts : l'un choisit « Arrondis », l'autre, resté sur « Droits », passe en carrousel ; après rechargement, les deux montrent « Carrousel » et « Arrondis ». L'encadré du plan Gratuit dit « à 9,99 € par mois ». L'extension Claude in Chrome était instable : les deux éditeurs ont été ouverts côte à côte dans un même onglet, pilotés par le code de la page.
- Prompt 3, Claude Design : m8 et m18 mis à jour (8 PNG). Prix 9,99 € et 19,99 € par mois, 99 € et 199 € par an, « par mois » ou « par an » sans « HT », l'ancien « soit … € par mois » de l'annuel retiré ; sous-titre « Sans engagement, TVA comprise. » ; réponse TVA ; « Tri par offre » inclus dans les trois plans. Centimes et « € » plus petits (inscrit dans la charte).

## À faire

1. Lot 6 : vérifier l'envoi lancé à la main le 3 octobre à 14:00 (prompt 7, point 12), puis que « Send review requests » tourne seul ; remettre le délai de l'offre de test à 14 jours ; essai au doigt du filtre « Statut » de Demandes sur le téléphone du fondateur.
2. PR #24 (m19, m5, m1) : recette sur l'aperçu, prompts de `docs-internes/recette/lot-6-maquettes.md`.
3. Captures réelles des réglages Systeme.io, par un prompt Claude in Chrome sur le compte du fondateur.
4. Toujours en attente du lot 5 : prompt 2 de `docs-internes/recette/lot-5-widget-fin.md` (mur d'une colonne sous 340 px sur la page Systeme.io) et contrôle au doigt du carrousel sur le téléphone du fondateur.
5. Régime de TVA de l'entité qui facture PULSACITY, à confirmer avec l'expert-comptable avant le lot Stripe (`decision_tarifs.md`).
6. Dépôt public ou privé : décision du fondateur (en privé, protéger `main` demande GitHub Pro).
7. Sentry, avant le lancement.
8. Plan Vercel : sur Hobby, Vercel Cron ne tourne qu'une fois par jour ; le workflow GitHub fait les 15 minutes. Si GitHub laisse des trous de plus d'une heure pendant quelques jours, passer à Pro (20 $ par mois) permettra de remettre la tâche toutes les 15 minutes dans `vercel.json` et de retirer le workflow. Décision du fondateur.
9. Prochain lot : au choix du fondateur, parmi « Pas encore construit » ci-dessus.

Remarques de la recette, à reprendre quand on touchera ces écrans :
- la photo met 3 à 5 secondes à s'afficher (adresse r2.dev, déjà prévue avant le lancement) et le récapitulatif après l'envoi ne la montre pas ;
- les compteurs du haut de la liste se mettent à jour environ une seconde après « Valider » ou « Masquer » ;
- un premier clic sur « Importez un fichier CSV » n'a rien fait une fois, le second a ouvert la page ;
- le lien Réglages mène à une page pas encore construite (Connecteurs et Demandes existent depuis le lot 6).

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

## Décisions du 3 octobre (lot 6, connecteurs et demandes)

- Un produit Systeme.io inconnu arrive dans « Offres à associer » (table `external_products`). Ses ventes sont gardées de côté, sans client ni achat ni demande, jusqu'à ce que le créateur l'associe à une offre ou crée l'offre à partir de lui. Elles sont alors traitées, et leur demande part à date de vente + délai de l'offre (tout de suite si cette date est passée).
- Référence d'une vente Systeme.io : son plan de prix (`price-plan:<id>`), seul identifiant observé dans la capture ; nom et prix du produit : ceux du plan. Une formation vendue avec deux plans de prix arrive donc en deux produits, à associer à la même offre. Une inscription porte la référence de la formation (`course:<id>`). La ressource « course » d'une vente n'a jamais été observée : elle n'est pas lue.
- Une vente est enregistrée une fois par connexion et par identifiant (`order-item:<id>`, ou contact et formation pour une inscription) : la même vente reçue deux fois, ou rejouée, ne crée rien de plus.
- Une seule demande par client et par offre, pour toujours, même annulée : avec sa relance, jamais plus de deux e-mails. Deux ventes simultanées du même client attendent l'une l'autre (verrou de transaction).
- Une vente signée avec une autre clé est gardée de côté, et la connexion passe en « Problème » jusqu'à la prochaine vente bien signée. « Rejouer » la traite si le créateur le décide : l'adresse, secrète, l'authentifie déjà (les inscriptions, que Systeme.io ne signe jamais, ne reposent que sur elle).
- L'adresse de connexion est créée à la première visite de la page Systeme.io. « Changer d'adresse et de clé » (lien discret sous l'étape 1, sans maquette) en crée de nouvelles ; les anciennes répondent 404 aussitôt.
- Étape 2 de m5 : trois dessins des réglages Systeme.io à la place des captures, comme pour le guide du widget. Les légendes reprennent les vrais libellés de Systeme.io capturés le 27 septembre (« URL », « Secret ») plutôt que ceux de la maquette (« URL du webhook », « Clé secrète »). Logos : la première lettre dans un carré, en attendant les vrais (question à Design).
- La ligne « Bloquée à une étape ? Écrivez-nous » de m5 n'est pas affichée : elle attend l'adresse de support, comme le guide du widget.
- E-mails de m3 : l'objet suit la consigne du lot, « Camille, votre avis sur Programme 30 jours ? », sans article (le nom de l'offre est libre). Le texte reprend la maquette sans ses phrases propres à Julie (« sans vous priver »). La signature est le nom de l'espace : le prénom, la ville et l'adresse postale du créateur ne sont pas demandés (question à Design). Une inscription dit « vous avez rejoint … » au lieu de « vous avez acheté … ».
- Désinscription : le lien de l'e-mail désinscrit en un clic, puis montre « Désinscription confirmée ». Les demandes planifiées sont annulées et la relance tombe ; une demande déjà reçue garde son lien, pour pouvoir encore donner son avis. Le client n'est désinscrit que des e-mails de cet espace.
- Limite du plan Gratuit (20 demandes par mois, `plans.ts`) : au-delà, les demandes restent planifiées et partent au début du mois suivant. Les relances ne comptent pas.
- Délai d'une demande : de 0 à 180 jours (0 : la demande part au prochain passage de la tâche d'envoi).
- Envoi toutes les 15 minutes : le plan Hobby de Vercel refuse une tâche Cron plus fréquente qu'une fois par jour (déploiement refusé le 3 octobre). Le workflow GitHub « Send review requests » appelle donc `/api/cron/requests` toutes les 15 minutes avec `CRON_SECRET` ; Vercel Cron passe une fois par jour (6h45 UTC, 8h45 à Paris en été) en filet de sécurité.
- Page Demandes : pas de maquette ; construite avec les chiffres de m4, les lignes de m5 et les badges de la charte, en attendant celle de Design (prompt 8). Badges Envoyée, Relancée et Annulée en gris (Ardoise sur Papier), faute de couleur dans la charte.
- « Me prévenir » et « Dites-nous quel outil » s'enregistrent dans `connector_waitlist`, sans adresse de support à laquelle écrire.

## Décisions du 3 octobre (PR #24, maquettes m19, m5 et m1)

- Chiffres de Demandes : ceux du mois, comme l'accueil et m19 (« 38 envoyées ce mois, dont 9 relancées, 8 avis reçus, soit 21 % »). Les complétées comptent les demandes envoyées ce mois qui ont reçu un avis : le taux de réponse en découle. La limite du plan se lit sur le même chiffre.
- Échec : la ligne dit « Non envoyée le 2 oct., après trois essais. Vérifiez l'adresse e-mail. » m19 écrit « l'adresse e-mail n'existe pas » : PULSACITY ne reçoit pas encore les retours de Resend (adresse inexistante, refusée), il ne sait donc que l'échec des trois essais.
- « Corriger l'adresse » (pas de maquette pour sa fenêtre, construite comme les autres fenêtres de confirmation) : l'adresse corrigée devient celle du client, pour ses autres demandes aussi, et la demande repart au prochain envoi. Une adresse déjà prise par un autre client de l'espace est refusée, jamais fusionnée. Une demande en échec n'a plus « Envoyer maintenant » ni « Annuler » : seulement « Corriger l'adresse », comme m19.
- Annulée : « Annulée le 25 sept. », et « : le client s'est désinscrit. » quand c'est le cas. « Vente annulée sur Systeme.io » (m19) attend le payload de « Vente annulée ». Les demandes annulées avant cette PR n'ont pas de date : « Annulée ».
- « Voir l'avis » mène au dernier témoignage du client pour cette offre, comme la fiche relie un témoignage à sa demande.
- Une demande en échec reste en haut de la liste, avec les planifiées : elle attend une action du créateur.
- Fenêtre « Changer d'adresse et de clé ? » : m5 écrit « D'ici là, vos ventes sont gardées de côté, pas perdues. » C'est vrai d'une vente envoyée à la nouvelle adresse avec l'ancienne clé, pas d'une vente envoyée à l'ancienne adresse, qui répond 404 aussitôt. La fenêtre dit donc : « Une vente envoyée entre-temps à l'ancienne adresse ne nous parviendra pas. »
- Bandeau ambre « vente gardée de côté » : quand la connexion est active (la dernière vente était bien signée) et qu'au moins une vente signée avec une autre clé n'a pas été rejouée. Tant que la dernière vente est mal signée, le bandeau rouge « Problème de connexion » reste. Sur téléphone, le texte s'arrête à « Rien n'est perdu. », comme m5.
- Une vente gardée de côté nomme l'offre de son produit quand il est associé (« Programme 30 jours », comme m5), plutôt que le nom du produit Systeme.io.
- Étape facultative : les inscriptions sans vente arrivent comme un événement à part, sans prix (l'hypothèse de Design, « une vente à 0 € », est corrigée dans le texte). Le produit d'une inscription dit « première inscription le … » dans « Offres à associer ».
- Bouton « Demander un avis » de m19 (en haut de Demandes) : pas construit, la maquette ne dit pas ce qu'il ouvre (question au fondateur).

## Questions ouvertes

- « Demander un avis » en haut de Demandes (m19) : envoyer une demande à un client saisi à la main (adresse, offre), ou copier le lien de collecte ? La première demande sa maquette, une limite contre les envois abusifs et l'accord du fondateur ; l'accueil mène déjà à Demandes avec ce bouton.

- Noms de colonnes de m16 en police à chasse fixe : la charte n'en a pas, ils sont en gras dans la police du texte. À confirmer par Design.
- Prénom du créateur : il n'est pas demandé à l'inscription, donc l'accueil dit « Bonjour » sans prénom.
- Adresse de support : « Aide et contact » pointe vers `/aide`, qui n'existe pas, et la page du guide sur mobile (« Bloquée à une étape ? Écrivez-nous ») l'attend aussi : sa ligne n'est pas affichée en attendant.
- Effet de 9,99 € sur le passage au payant : à vérifier avec les premiers chiffres de Stripe.
- E-mails aux clients : la loi sur la prospection demande l'adresse postale de l'expéditeur ; m3 la prévoit pour le créateur, PULSACITY ne la demande pas encore.
- Avant le lancement : afficher le JSON brut d'un événement inconnu à Claude Code (requête SQL dans Supabase, par prompt) pour capturer « Vente annulée » le jour où un créateur en reçoit une.
- La page de vente dessinée dans l'aperçu de l'éditeur reste générique (nom de l'espace, nom de l'offre, « Ce qu'en disent mes clients ») : m6 y montre la page de Julie Nutrition (menu, prix, « Tous les avis »). Écart gardé depuis le lot 5.
