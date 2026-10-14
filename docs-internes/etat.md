# État du projet

Mis à jour le 14 octobre 2026 (lots 4.2 et 4.3 fusionnés ; leurs vérifications en production, comme celles des lots 4.1 et 4.1 b, se feront à la toute fin, décision du fondateur : voir « À faire »). La V0 n'est pas terminée : la feuille de route pour la finir (design v2, écrans manquants, paiements et textes légaux d'un vendeur particulier, tarifs, catalogue des connecteurs, commercialisation) est dans `docs-internes/fin-v0/README.md`, avec tous ses prompts dans l'ordre. Le lot 6 est en ligne en entier et vérifié en production : moteur de connecteurs, Systeme.io, demandes d'avis et désinscription (PR #23), Demandes, Connecteurs et désinscription selon les maquettes du 3 octobre (PR #24), « Demander un avis » (PR #25). Un point reste à régler avant le lancement : GitHub ne lance l'envoi planifié que toutes les 3 à 6 heures (voir « À faire »). Le lot 7, le site public (accueil, tarifs, intégrations, guides, pages légales), est en ligne depuis le 4 octobre (PR #27) et vérifié en production. À lire au début de chaque session, et à mettre à jour à chaque fusion sur `main`.

## En ligne sur pulsacity.com

- Socle : Next.js à Francfort, base Supabase, connexion par lien magique, CI (PR #8 à #14).
- Inscription, création de l'espace, onboarding des formations, page publique de collecte `/t/[espace]` et `/t/[espace]/[offre]` (PR #12).
- Espace du créateur, maquette 4 : accueil, témoignages (liste, filtres, fiche, « Valider », « Masquer », « Mettre en avant », texte affiché, suppression définitive). Identité v2 : logo, favicon, micro-animations (PR #15).
- Ajout manuel (m15), import CSV (m16) et page Offres (m17), avec les corrections de la recette du lot 4, recettés sur l'aperçu (PR #19).
- Widget, maquettes 2 et 6 : `w.js` (mur, carrousel, badge), JSON public `/api/widget/[id]` en cache à la périphérie, pages Widgets et éditeur avec aperçu en direct, guide « Coller dans Systeme.io » (PR #20). Vérifié le 2 octobre sur une vraie page Systeme.io.
- Suite du widget, maquettes du 2 octobre : liste m18, éditeur sur téléphone, nom du widget, coins des cartes, code qui nomme le type, chargements du carrousel et du badge (PR #21). Vérifié le 2 octobre sur la page Systeme.io, avec 15 avis.
- Lot 6, connecteurs et demandes : moteur de connecteurs, connecteur Systeme.io, pages Connecteurs et Demandes, offres à associer, e-mails de demande et de relance, désinscription (PR #23, fusionnée le 3 octobre, migration 0006 appliquée en production).
- Suite du lot 6, maquettes du 3 octobre : Demandes (m19), Connecteurs (m5 : téléphone, clé différente, changer d'adresse, inscriptions sans vente), désinscription (m1). PR #24, fusionnée le 3 octobre, migration 0007 appliquée en production.
- « Demander un avis » (m20) : demande d'avis à un client saisi à la main, depuis Demandes et l'accueil (PR #25, fusionnée le 3 octobre, migration 0008 appliquée en production).
- Lot 7, site public : accueil (m7), tarifs (m8), intégrations (m21), guides (m22), pages légales en brouillon (m23), menu du téléphone (m24), SEO (PR #27, fusionnée le 4 octobre, migrations 0009 et 0010 appliquées en production). Détail ci-dessous.
- Lot 4.1, les décisions appliquées : prix publics et prix fondateur, « Prix finaux », catalogue des connecteurs prêt, textes qui ne supposent plus Systeme.io (PR #33, fusionnée le 12 octobre ; vérification en production à noter).
- Lot 4.2, les fondations v2 : la charte Tournesol et le logo Galet partout (jetons, polices auto-hébergées, composants, identité, coques du site et de l'espace) ; les écrans gardent leur mise en page v1 jusqu'à leurs maquettes v2 (PR #35, fusionnée le 14 octobre, sans migration ; vérification en production reportée à la fin).
- Lot 4.3, Réglages et Mon compte : Réglages (`/app/reglages`) et Mon compte (`/app/compte`) selon les maquettes 3.3, export des données, suppression de l'espace, page « Votre espace est supprimé » (PR #36, fusionnée le 14 octobre, migration 0011 appliquée en production ; vérification en production reportée à la fin).
- Trois environnements : local, recette sur chaque aperçu Vercel, migrations de production lancées à chaque fusion et attendues par Vercel avant la mise en ligne (PR #16).

## Finir la V0 (feuille de route du 5 octobre, revue le 12 octobre)

Le fondateur juge la V0 inachevée : design trop fade et trop proche du style des assistants d'IA, écrans manquants (Réglages, Mon compte, Abonnement et factures, Aide et contact), textes légaux à compléter, tarifs à confirmer, Systeme.io trop au centre, commercialisation à préparer. `docs-internes/fin-v0/` donne l'ordre de toutes les actions et leurs prompts : Claude Chat (projet « PULSACITY — Stratégie »), Claude in Chrome, Claude Design (nouveau projet « PULSACITY v2 », l'actuel gardé comme référence de la v1), Claude Code (lots 4.1 à 4.11).

Stratégie du 12 octobre : encaisser dès la V0, en tant que particulier ; créer la micro-entreprise au seuil.
- Les paiements restent dans la V0 : Stripe Billing (lot 4.5), CGV publiées, textes légaux d'un vendeur particulier (lot 4.9), vos informations par des variables Vercel.
- Le seuil (`docs-internes/fin-v0/seuil-micro-entreprise.md`) : 5 clients payants, 3 mois de suite avec des paiements, ou 500 € encaissés, le premier atteint. Ce jour-là, les prompts 6.1 à 6.7 passent avant tout le reste.
- Une seule adresse : contact@pulsacity.com, redirection OVH déjà en place.
- La domiciliation Kandbaz : garder ou résilier, après lecture de leurs conditions (prompt K).
- Le catalogue des connecteurs est décidé (`docs-internes/decisions/connecteurs.md`) : 6 familles, 19 outils affichés ; le connecteur universel (lot 4.1 b) sort avant le catalogue.
- Décidés le 12 octobre et rangés dans `docs-internes/decisions/` : tarifs (Essentiel 14,99 €, Pro 24,99 €, prix fondateur 9,99 € et 19,99 € pour les bêta-testeurs et les 100 premiers abonnés), positionnement et page d'accueil v2, commercialisation (bêta, plan à 90 jours). `arbitrages.md` règle leurs contradictions. Deux lots s'ajoutent : 4.12 (accueil et acquisition) et 4.13 (avis en ligne).
- La demande de résiliation de la domiciliation Kandbaz est envoyée (12 octobre) ; réponse attendue.
- Le skill UI UX Pro Max (uupm.cc, licence MIT) sert à l'exploration (1.4), de liste de contrôle UX pour Claude Design, et de règles UX pour Claude Code à partir du lot 4.2. Ni son générateur, ni ses palettes, polices ou styles : la charte v2 reste la seule source.

La V1 attend ; la recette de bout en bout en production devient le lot 4.11, juste avant le lancement.

## Lot 4.1, les décisions appliquées (PR #33, 12 octobre)

- `plans.ts` tient les prix publics (Essentiel 14,99 € et 149 €, Pro 24,99 € et 249 €) et les prix fondateur (9,99 € et 99 €, 19,99 € et 199 €), avec `FOUNDER_PRICE_SEATS = 100` et `readOpenPriceList`. Les limites ne changent pas.
- Tarifs et accueil, dans la mise en page de m7 et m8 : le prix fondateur comme prix payé, et sous lui la ligne de l'arbitrage n° 1 (« Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois », « par an » en Annuel). Sur ordinateur, les colonnes partagent leurs rangées (sous-grille) : boutons et listes restent alignés malgré la ligne, absente du plan Gratuit.
- Le site affiche le prix fondateur tant que personne ne paie : le lot 4.5 branche le compte des abonnés au prix fondateur (`SHOWN_PRICE_LIST`, `src/content/plan-offer.ts`), pour que le centième fasse passer les pages aux prix publics sans nouvelle livraison.
- « TVA comprise » retiré : « Prix finaux : rien ne s'ajoute au paiement » sous le titre de Tarifs, nouvelle réponse à « Les prix incluent-ils la TVA ? ». Pour ne pas contredire `tarifs.md`, deux autres réponses de Tarifs (passage à l'annuel à la fin du mois payé ; au retour au Gratuit, un widget et 15 témoignages) et les CGV en brouillon (prix, prix de lancement, changements de plan, évolution des prix).
- Catalogue des connecteurs prêt, pas publié : les 6 familles et un fichier par outil dans `src/content/integrations/` (`INTEGRATION_CATALOG`, 19 outils), et leurs lignes pour l'espace (`CATALOG_UPCOMING_CONNECTORS`). Un test les tient fidèles à `connecteurs.md`. Les phrases décidées remplacent déjà les lignes de Systeme.io, Stripe et Calendly sur `/integrations`.
- Textes qui supposent Systeme.io (validés par le fondateur le 12 octobre, `recette/lot-4-1-decisions.md`) : « l'outil où vous vendez » sur l'accueil, dans les appels finaux, un guide et l'espace ; « Connecter Systeme.io » devient « Connecter mon outil », vers Connecteurs, et l'étape de démarrage se coche dès qu'un connecteur est actif. Restent nommés Systeme.io : son connecteur, ses guides, la démo de l'accueil ; la FAQ de compatibilité, le comparatif de Tarifs, le titre d'Intégrations et « Compatible avec Systeme.io » changent avec le catalogue (4.1 b).
- Durées : plus aucune durée d'installation affichée (« Deux minutes… », « environ 2 minutes ») ni « l'avis se laisse en deux minutes » (`positionnement.md`). « Comptez moins d'une minute » (collecte) et « Donner mon avis (1 minute) » (e-mail, démo) restent jusqu'aux maquettes v2 : à mesurer d'ici là.
- Recette sur l'aperçu, le 12 octobre (`recette/lot-4-1-decisions.md`) : prompt 1 vert au second essai (le premier a trouvé la base de recette injoignable, voir « À faire » n° 13) ; prompt 2, 20 points sur 20 ; prompt 3, 7 points sur 7. Deux déploiements d'aperçu de Vercel ont échoué en quelques secondes avant de passer au commit suivant, cause non lue (journaux de Vercel).
- Vérification en production (prompt 4 de `recette/lot-4-1-decisions.md`) : à faire après la fusion, et à noter ici.

## Lot 4.1 b, le connecteur universel et le catalogue publié (PR #34)

- Le connecteur universel, sur le contrat `Connector` : une adresse propre à l'espace (Connecteurs › Connecteur universel), sans clé, qui reçoit une vente par envoi, en JSON ou en formulaire. Champs : email (obligatoire), prenom, nom, offre, date, montant, devise, reference (`src/lib/connectors/universal/fields.ts`). Une offre inconnue attend dans « Offres à associer » ; sans offre, « Sans nom d'offre ».
- Règle n° 1 suivie : d'abord l'adresse qui garde le brut, puis six vraies ventes de test capturées depuis Make (plan gratuit), n8n 2.42.7 et Zapier (essai Professional), le 12 octobre, en JSON et en formulaire, devenues les fixtures ; puis seulement la lecture (`docs-internes/connectors/universel.md`). Montants en nombre ou en texte, virgule ou point ; dates ISO, avec fuseau, « Oct 12, 2026 », 12/10/2026 ou horodatage ; date illisible ou future : le moment de réception.
- Rien deux fois : la même référence est enregistrée une fois ; sans référence, une vente par client, par offre et par jour à Paris. Le moment de réception entre dans le contrat (`normalize(payload, headers, { receivedAt })`), pour qu'une vente se lise pareil à chaque traitement.
- Dédoublonnage entre connecteurs : un même client reçu par deux connecteurs dans les 48 heures ne reçoit qu'une demande ; la vente dont l'offre est associée la garde (« Déjà reçu d'un autre outil »). Testé de bout en bout entre Systeme.io et le connecteur universel.
- Le catalogue publié : 19 outils sur `/integrations`, « Bientôt » sans date, chacun avec « En attendant » ; l'accueil, la FAQ de compatibilité, le comparatif de Tarifs et le titre d'Intégrations parlent de Zapier, Make et n8n. « Me prévenir » se lit par `docs-internes/requetes/me-prevenir.md` (poids 3 pour un créateur connecté, 1 pour un visiteur).
- Les guides Make (voie gratuite), Zapier, n8n et Podia (m22), dans un groupe « Relier vos outils » de `/guides`, que m22 n'avait pas : à reprendre dans la maquette v2 des guides. « En attendant » mène ces quatre fiches à leur guide ; la fiche Make annonce l'app PULSACITY, la fiche Zapier l'app officielle de la vague 2.
- L'app PULSACITY pour Make existe, privée, dans l'organisation Make du fondateur (module « Envoyer une vente », essayé sur l'aperçu). Publier est définitif chez Make : décision du 13 octobre, on ne publie pas maintenant. Une version propre sera publiée le jour où elle est proposée aux créateurs ; son lien entrera alors dans le guide Make (« À faire » n° 14).
- Fiches « Bientôt » de Make, Zapier, n8n et Podia : elles annoncent l'intégration dédiée (app Make, app Zapier, nœud n8n, Podia par l'app Zapier) et disent que le guide fait déjà la même chose. Le nœud n8n est un arbitrage de Claude Code, absent de `connecteurs.md` : à confirmer ou retirer.
- Captures le 12 octobre (prompts 1 à 6) ; recette le 13 octobre, prompts 7 à 12 au vert, écarts corrigés (`recette/lot-4-1-b-universel.md`). Restent le ménage et le nouveau secret Vercel (prompt 13), puis la vérification en production (prompt 14), à noter ici.
- Points à suivre : une vente ancienne envoyée par un outil (rattrapage de l'historique) part tout de suite, comme avec Systeme.io ; la limite du plan Gratuit la contient, pas celle des plans payants. Le déclencheur Podia de Zapier, « Product Signed Up For », vient de l'aide de Podia : à confirmer au premier créateur sur Podia. Une vente illisible s'affiche « Autre événement » ; avec le connecteur universel, ce serait plutôt une vente : à revoir avec la maquette v2 de m5.

## Lot 4.2, les fondations v2 (PR #35, fusionnée le 14 octobre)

- Le ZIP du prompt 3.2 (charte Tournesol, logo Galet) est rangé dans `docs-internes/design-v2/` : `charte.md`, `maquettes/` et son `INDEX.md`, `identite/` (logo et `SPEC.md`). CLAUDE.md en fait la source ; la v1 reste dans le dépôt, pour la mise en page des écrans pas encore migrés.
- Les jetons v2 partout, d'un coup (`src/app/globals.css`, gardé par `globals.test.ts` contre la charte) : couleurs (Soleil, Corail, Encre, Nuage, Ciel…), Bricolage Grotesque 800 pour les titres, chiffres et prix, Figtree pour le reste, l'échelle de tailles, d'espacements, de rayons et d'ombres. Les polices sont auto-hébergées (`src/app/fonts/`, `next/font/local`) : plus aucun appel à Google, ni au build ni dans le navigateur. Le fichier du mouvement de Design est repris tel quel (`pulsacity-motion.css`, gardé par un test).
- Les composants de base, avec tous leurs états : boutons (principal Soleil, secondaire, discret, danger, icône, compact ; chargement avec le spinner), champs, listes déroulantes, cases, interrupteur, badges, bandeaux, fenêtres de dialogue (feuille en bas sur téléphone), menus au clavier, onglets de panneau et bascule, pastilles de filtre, avatars, étoiles, icônes v2 (trait 2).
- Le voile des fenêtres et du menu du téléphone : 56 % d'Encre partout, comme la charte. La question ouverte des 12 % et 48 % est close.
- L'identité : logo Galet (en-têtes, pied de page, espace), favicon, icônes d'application, manifeste, symbole des e-mails, « Propulsé par » dessiné (page de collecte, désinscription), polices des images de partage, symbole des trois moments de marque (chargement, premier jour, premier témoignage validé).
- Les coques : en-tête du site (88 px, collant, ombre après 8 px de défilement), menu du téléphone sur le voile, pied de page Encre ; colonne de navigation de l'espace (page actuelle sur Soleil, pastille Corail des témoignages en attente), menu du compte, en-tête et barre d'onglets du téléphone, page « Plus ».
- Tous les autres écrans gardent leur mise en page v1, avec les jetons et les composants v2 : plus aucun filet, cartes blanches sur le fond Nuage de l'espace, cartes Nuage sur les pages blanches du site, panneaux Ciel, tuiles de chiffres, tableau et liste en cartes de la charte. Les lots 4.3 à 4.8 les passent à leurs maquettes v2.
- Le widget (`w.js`) et les gabarits des e-mails ne changent pas (lot 4.8). Seule l'image du symbole des e-mails est la nouvelle.
- Le skill UI UX Pro Max 2.15.0 est dans `.claude/skills/ui-ux-pro-max/`, avec sa licence MIT, lu en entier avant l'ajout. Il ne sert qu'à ses règles UX et à sa liste de contrôle ; jamais son générateur, ses palettes, ses polices ou ses styles (CLAUDE.md).
- Vérifié dans le conteneur : 46 adresses du site et de l'espace à 360 et 1440 px, sans débordement ni erreur dans la console. Lighthouse sur la version de production : accueil 97, tarifs 98 en performance ; accueil de l'espace 92 (médiane de cinq passages, de 84 à 96, la page attend ses données) ; 100 en accessibilité sur les trois.
- Recette sur l'aperçu : `docs-internes/recette/lot-4-2-fondations-v2.md`.
- Recette du 14 octobre (prompts 1 à 4) : corrigés le menu « … » des témoignages (flotte au-dessus du tableau, s'ouvre vers le haut près du bas, options sur une ligne, focus rendu au « … »), le décalage de la page à l'ouverture d'une fenêtre, la case en erreur qui repassait en bleu marine sous la souris, la barre de défilement de « Demander un avis » qui coupait ses coins, le survol des cartes d'outils qui cachait « Bientôt », l'anneau du focus collé au « ? » de la connexion, la promesse répétée dans l'image de partage de l'accueil, « e-mail » coupé au trait d'union dans Demandes. Expliqués sans changement : hauteurs des boutons des tarifs (56 et 52, charte), textes « En attendant » (lot 4.1 b), carmin proposé pour le widget (lot 4.8), mises en page v1 au téléphone (lots 4.4 et 4.6), Réglages (lot 4.3). Contre-recette (prompt 4 bis) : 8 points OK ; le focus de la connexion, non testable connecté, est vérifié dans le conteneur et revu par le prompt 5. Recette validée le 14 octobre.
- Vérification en production : prompt 5 de `recette/lot-4-2-fondations-v2.md` (polices au premier chargement, focus de la connexion, PageSpeed, images de partage), à faire après la mise en ligne et à noter ici.

## Lot 4.3, Réglages et Mon compte (PR #36, fusionnée le 14 octobre)

- Le ZIP du prompt 3.3 est rangé dans `docs-internes/design-v2/` : ses PNG à côté de ceux de 3.2, sa charte (jauge, question dépliable, carte d'outil, monogramme, badges, étapes ; icônes gift, pause, external, file, monitor, phone) à la place de `charte.md`, son index à la suite de `INDEX.md`. Il sert aussi aux lots 4.4, 4.5, 4.12 et au catalogue.
- Réglages (`/app/reglages`, 8.1) : nom, logo, couleur d'accent et son alerte, adresse de la page de collecte modifiable (une adresse prise en propose une libre), e-mail de réponse, adresse postale de l'expéditeur, aperçu du vrai e-mail de demande, interrupteur « Nouveau témoignage », case « J'offre une contrepartie à mes clients ». Un aperçu de la page de collecte suit la saisie. Un seul bouton enregistre ; tous les points à corriger d'un coup, l'adresse prise comprise.
- Les réglages agissent : l'adresse postale s'écrit en bas des e-mails de demande et de relance ; « Nouveau témoignage » ne part plus quand il est coupé ; le bouton de la page de collecte prend la couleur d'accent (texte blanc ou Encre selon le contraste, comme la charte v2), ce qui ferme l'écart « accent du créateur sur la page de collecte » du lot 4.2.
- Mon compte (`/app/compte`, 8.2) : adresse de connexion changée par un lien envoyé à la nouvelle adresse (Better Auth, 24 heures, 5 liens par heure et par compte), prénom (« Bonjour Julie »), appareils connectés et « Se déconnecter partout ailleurs », export JSON préparé à la demande et jamais gardé, suppression de l'espace en écrivant son nom. La suppression arrête d'abord l'abonnement (`src/lib/billing/stop-space-subscription.ts`, point d'accroche du lot 4.5, testé), puis efface le compte et, en cascade, tout l'espace ; les fichiers (logo, photos) suivent ; page publique « Votre espace est supprimé » (`/espace-supprime`).
- Liens : « Réglages » (navigation, « Plus ») et « Mon compte » (menu du compte, « Plus ») mènent à leurs pages.
- Migration 0011 : `spaces.sender_postal_address`, `spaces.new_testimonial_email_enabled` (vrai par défaut), `spaces.incentive_declared_at`. Le prénom est `user.name`, déjà là.
- Au passage : la règle « téléphone » des e-mails visait le tableau de la carte, alors que react-email met la marge sur sa cellule ; les e-mails gardaient 48 px de marge de chaque côté sur téléphone. Corrigé et testé.
- Vérifié dans le conteneur : 360, 375, 768, 1024, 1440 px et 667 × 375 sans débordement ; parcours joués dans Chromium (erreurs, adresse prise, enregistrement, aperçu de l'e-mail, changement d'adresse par le lien, lien réutilisé, prénom, deux appareils, export, suppression d'un second espace).
- Recette sur l'aperçu : `docs-internes/recette/lot-4-3-reglages-compte.md`. Prompts 1 à 6 passés le 14 octobre. Deux corrections : le menu du compte se ferme quand on suit un de ses liens ; à 360 px, l'adresse d'un aperçu, trop longue, laissait 98 px à la partie modifiable (elle est coupée par son début, la partie modifiable garde 45 % du champ). Contre-recette (prompts 7 et 8) validée le 14 octobre : les deux corrections tiennent ; les 503 relevées par Claude in Chrome venaient de son outil de surveillance du réseau, les journaux de Vercel n'en montrent aucune. PR fusionnée le 14 octobre ; « CI » et « Database migration » verts sur `main`. La vérification en production (prompt 9) se fera à la toute fin.

## Décisions du 14 octobre (lot 4.3), à valider par le fondateur

- Choix de Design appliqués : Mon compte à part (`/app/compte`) ; adresse de la page de collecte modifiable, l'ancienne cesse de marcher ; interrupteur « Nouveau témoignage », allumé par défaut.
- Suppression immédiate et définitive (« rien ne reste », checklist du lot) : « au terme du délai prévu par nos CGU » devient « L'effacement est immédiat et définitif. » ; « Une erreur ? Écrivez-nous au plus vite » est retiré, il n'y aurait rien à rendre. Le compte part avec l'espace. Le délai des CGU (lot 4.9) ne couvre plus que les sauvegardes de Supabase.
- Textes neutres : « Vous restez connectée » devient « Cet appareil reste connecté. », « Vous êtes déconnectée » devient « Votre session est fermée. ».
- Export : préparé pendant que la page attend, ni fichier gardé ni e-mail ; « Restez sur cette page le temps de le préparer. » remplace « nous vous écrivons quand il est prêt ». Format JSON, clés en français sans accent ; ni clés de connexion ni liens des demandes.
- Aperçu de l'e-mail : l'e-mail réel (v1 jusqu'au lot 4.8), dessiné à la largeur d'un téléphone puis réduit ; l'expéditeur réel est « … via PULSACITY » ; la légende cite le nom, le logo et l'adresse postale (la couleur n'entre dans les e-mails qu'au lot 4.8).
- Avatar sans logo : initiales sur Ciel (charte, « Avatar »), pas sur la couleur d'accent comme dans les maquettes.
- Adresse postale : facultative, sans « (facultatif) » comme la maquette. La rendre obligatoire bloquerait l'envoi des demandes : question pour la relecture juridique (6.7).
- Contrepartie : la case et sa date sont gardées ; la mention sous les widgets et sur « À propos de ces avis » arrive avec le lot 4.13, avant la bêta.
- « Parrainage » (menu du compte et « Plus » de 3.3) : pas encore dans les menus, sa page arrive avec le lot 4.12.
- Réglages en erreur à 360 px : la maquette écrase le champ d'adresse à côté de « Prendre … » ; le champ garde sa largeur, l'erreur suit, puis le bouton. Sur ordinateur, l'aperçu passe sous « Votre espace » tant que les deux colonnes n'ont pas la place (fenêtre de moins de 1340 px de large environ) ; au-delà, la colonne de 712 px peut se resserrer, pour qu'une fenêtre de 1440 px avec une barre de défilement classique (Windows) garde les deux colonnes.
- Erreur d'un champ : juste sous le champ, puis l'aide (maquettes 3.3), dans tout l'espace.
- Logo remplacé ou retiré : l'ancien fichier est gardé, pour les e-mails déjà envoyés ; tous les fichiers partent à la suppression de l'espace.
- « Écrivez-nous » (page de suppression) : `mailto:contact@pulsacity.com` jusqu'à `/aide#contact` (lot 4.4).
- Bouton du compte : il montre l'espace (nom et logo), même une fois le prénom donné, comme les maquettes.
- Le titre de l'aperçu de la page de collecte est en h3 (24 px) : la maquette le montre plus petit, une taille absente de l'échelle.

## Lot 7 (PR #27), site public, en ligne depuis le 4 octobre

- Accueil (m7) : promesse, démo en quatre temps (vente, demande, avis, mur), comment ça marche, exemple de widget réel (le moteur de `w.js` sur la page de Julie Nutrition : badge et carrousel), connecteurs, tarifs résumés, questions, appel final.
- Tarifs (m8) : Mensuel ou Annuel, les trois plans, « Comparer en détail » (toutes les lignes sur ordinateur, choix du plan sur téléphone), questions de facturation. Prix, limites et « 2 mois offerts » calculés depuis `plans.ts` (`src/content/plan-offer.ts`).
- Intégrations (m21) : `/integrations` et une page par connecteur, chacune générée depuis son fichier de contenu (`src/content/integrations/`). `/integrations/systeme-io` porte le guide d'installation en six étapes, plus l'étape facultative, avec les dessins de l'espace (m5, m6). Stripe et Calendly en « Bientôt », avec « Me prévenir » public : table `connector_waitlist_emails` (migration 0009), 5 adresses par heure et par adresse IP, champ piège. « Dites-nous quel outil » public : table `tool_suggestions` (migration 0010), le nom de l'outil seulement, mêmes protections.
- Guides (m22) : `/guides` en deux groupes, « Démarrer » et « Aller plus loin », et `/guides/[slug]` en MDX (`@next/mdx`) avec son sommaire (« Dans ce guide », à droite sur ordinateur, replié sur téléphone, lu dans les titres du texte). Trois guides : récolter des témoignages pour une formation en ligne, ajouter des témoignages sur une page Systeme.io, témoignages et RGPD.
- Textes légaux (m23), en brouillon, en MDX : mentions légales, CGU (accord de sous-traitance RGPD en annexe), CGV, confidentialité (cookies compris), avec le sommaire « Sur cette page ». Bandeau « Brouillon en cours de relecture », `noindex` et absents du plan du site tant que `LEGAL_VALIDATED` n'est pas `true`. Les informations à fournir sont surlignées en Attention « [À COMPLÉTER : …] » (liste dans `recette/lot-7-site.md`).
- Menu du site (m24) : Intégrations, Tarifs, Guides, Se connecter ; sur téléphone, sous un voile Encre.
- SEO : titre, description, adresse canonique et Open Graph sur chaque page ; `sitemap.xml`, `robots.txt` (l'espace, l'API, les pages de collecte et la désinscription exclus ; aperçus fermés) ; une image de partage générée par page (`next/og`, polices dans `assets/og-fonts/`) ; données structurées Organization (accueil) et FAQPage (accueil, tarifs, Systeme.io).
- Espaces insécables avant « ? ! : ; » et dans « » sur tous les textes du site, gardés par un test (`src/content/french-spacing.test.ts`).
- Vérifié dans le conteneur le 4 octobre (deuxième passage) : Lighthouse mobile 94 (`/`), 95 (`/integrations/systeme-io`), 96 (`/tarifs`), 95 (`/integrations` et un guide) en performance, 100 en accessibilité, CLS 0 ; aucun lien mort ni ancre manquante sur 16 pages ; 360 px et 1440 px sans débordement ni erreur dans la console.

## Vérification du lot 7 en production (4 octobre, prompt 5 de `recette/lot-7-site.md`)

- pulsacity.com sert l'accueil, à la place de la page « bientôt ». `robots.txt` et `sitemap.xml` conformes : 10 pages, aucune page légale (elles portent aussi `noindex`).
- PageSpeed mobile : accueil 96, `/integrations/systeme-io` 90, `/tarifs` 98 en performance ; 100 en accessibilité, bonnes pratiques et SEO sur les trois. La page Systeme.io est la plus lente (affichage de l'élément principal 3,3 s) : PageSpeed y relève environ 69 Kio de JavaScript inutilisé et 120 ms de fichiers qui bloquent l'affichage. À regarder dans un lot suivant.
- Image de partage de `/integrations/systeme-io` conforme. Avertissement mineur d'opengraph.xyz : la description fait 148 caractères pour environ 125 conseillés.
- Données structurées : le test des résultats enrichis de Google ne détecte rien, ni sur l'accueil ni sur `/tarifs`, alors que le HTML exploré contient l'Organization et la FAQ et que le validateur de schema.org les reconnaît sans erreur. Pour la FAQ, c'est attendu : Google n'affiche plus les FAQ dans ses résultats depuis le 7 mai 2026 et les a retirées de cet outil en juin 2026 (Search Engine Land, Search Engine Journal). Le balisage reste, sans effet dans Google. Pour l'Organization (nom, adresse, logo de 512 px, ce que demande la documentation de Google), cause inconnue : à suivre dans la Search Console une fois le site validé (« À faire »).

## Décisions du 4 octobre (lot 7)

- Prix de l'accueil : ceux de m8 et de la décision du 2 octobre (9,99 € TVA comprise, « Tri par offre » dans tous les plans), pas les « 9 € HT » restés dans m7. Lien « Voir le détail des tarifs » en Carmin (charte), pas en vert (m7).
- Logo : celui de l'identité v2 (fusée) dans l'en-tête et le pied de page, à la place du wordmark de m7 et m8 (`identite-v2/SPEC.md`).
- « Compatible avec Systeme.io » : le texte et la coche verte de m7, sans logo officiel (décision du 3 octobre) ; il mène à `/integrations/systeme-io`. Les lignes des connecteurs gardent l'initiale dans une case, comme l'espace.
- Démo de l'accueil : immobile, les quatre temps visibles ensemble comme dans la page de m7 (pas d'animation d'apparition).
- Exemple de widget : le vrai moteur de rendu de `w.js`, en données d'exemple (Julie Nutrition, vert #4F6F52, 47 avis, 4,8). La page de Julie est en Georgia, comme l'aperçu de l'éditeur.
- Boutons de l'accueil à 56 px de haut, comme m7 (la charte dit 48 pour le bouton principal ; 56 est une hauteur de la charte, celle de la collecte).
- Comparatif de m8 sur ordinateur : vide dans l'export, construit avec les lignes de m8 sur téléphone.
- « Choisir Essentiel » et « Choisir Pro » mènent à l'inscription tant que Stripe n'est pas branché.
- CGV ajoutées aux pages légales demandées : le pied de page de m7 les liste, et la décision des prix les prévoit. « Cookies » mène à la rubrique de la confidentialité, « Contact » à celle des mentions légales, faute d'adresse de support.
- « Me prévenir » public : une adresse par connecteur et par visiteur, supprimée après l'annonce. Pas d'e-mail de confirmation.
- Pages sans maquette (`/integrations`, `/guides`, légal, menu du téléphone) : construites avec les éléments de m7 et m8 ; demande à Design dans `recette/lot-7-site.md` (prompt 4).
- Le délai par défaut (14 jours) et la relance (4 jours) sont lus dans `src/lib/requests/request-timing.ts`, comme le code d'envoi. Le nom du champ piège quitte le schéma du formulaire de collecte (`src/lib/forms/honeypot.ts`) : aucune page publique ne charge plus Zod.

## Décisions du 4 octobre, deuxième passage (maquettes m21 à m24 et première recette)

- Les quatre choix de Design sont appliqués : menu Intégrations, Tarifs, Guides, Se connecter ; voile Encre derrière le menu du téléphone ; logo de l'identité v2 partout ; à la place des « [Capture] », les dessins de l'espace (m5, m6), avec leurs légendes.
- « Recommandé » en Encre sur l'accueil comme sur `/tarifs` (m8) : la charte réserve le Carmin aux étoiles, aux liens et au bouton discret ; m7 le montre en Carmin.
- Carte « Action » de l'étape facultative : elle renvoie à l'étape où l'adresse se copie, la 2 sur la page publique, la 1 dans l'espace (m5).
- Question « Que se passe-t-il si une vente est annulée ? » : elle dit ce qui se passe aujourd'hui. « Vente annulée » nous arrive et est gardée, mais la demande n'est pas annulée toute seule (pas encore de capture de cet événement) : le créateur l'annule depuis Demandes.
- Note de l'étape facultative : « Chaque inscription arrive avec le nom de la formation », sans « comme une vente à 0 € » (m21) : une inscription arrive comme une inscription, sans prix.
- Pas construits, faute d'adresse de support : « Un souci à une étape ? Écrivez-nous » (m21), « Une question sans réponse ici ? Nous écrire » (m22), « Toujours rien ? Écrivez-nous » (m22). À ajouter avec l'adresse (Questions ouvertes).
- « Dites-nous quel outil » public : le nom de l'outil seulement, sans adresse ni promesse de prévenir, pour ne garder aucune donnée personnelle. La confidentialité le dit.
- « Me prévenir » public : les textes et les trois états de m21 ; le message d'adresse incomplète complète l'adresse tapée (« par exemple julie@example.com »), comme m20.
- Guides : nos trois guides, rangés dans les groupes de m22 (« Démarrer » : récolter, puis afficher ; « Aller plus loin » : RGPD), avec une ligne de résumé chacun. Les six guides de m22 (connecter Systeme.io, coller le widget, choisir le délai, recueillir sans connecteur, importer, formations offertes) ne sont pas écrits : un prochain lot de contenu.
- Exemple de widget : le badge aussi sur ordinateur, dans la bande blanche du haut de la page de Julie (m7 la laisse vide). Sur téléphone, la page de Julie garde des marges de 4 et 8 px pour que le widget ait la largeur d'une vraie page de 360 px : badge en entier, points sous le carrousel (en dessous de 288 px, `w.js` remplace les points par « 1 sur 4 », règle du widget inchangée).
- Démo de l'accueil : les quatre cadres prennent la hauteur du plus haut (le mur), sur une même ligne sur ordinateur ; rien n'est coupé, sur téléphone non plus.

## Contre-recette du 4 octobre (prompts 6 et 7) et suites

- 21 points sur 24 OK. Corrigés : le badge de l'exemple dépassait encore de 9 à 10 px à 360 px (Georgia de Windows est plus large que la police de remplacement du conteneur : environ 311 px au lieu de 297) ; le cadre de Julie prend maintenant 8 px des marges de la page sur téléphone et le badge n'a plus de marge intérieure (326 px pour lui). « e-mail » ne se coupe plus en fin de ligne (gardé par le test d'espacement). Le sommaire marque la dernière rubrique en bas de page, et la rubrique atteinte par un lien tant qu'elle est en vue (`src/lib/content/pick-current-heading.ts`). Le champ d'adresse de l'aperçu finit par « … ».
- « Vente annulée » (Systeme.io) : la réponse dit maintenant à quoi sert la case : l'annulation nous arrive et est gardée, et la demande prévue s'annulera seule bientôt, sans rien changer au réglage. Engagement à tenir : capturer « Vente annulée » et l'annuler automatiquement (voir « Questions ouvertes »), comme la page Stripe le promet.
- Dernière vérification (prompt 8) : 3 points sur 4 OK. À 360 px, une adresse de 37 caractères sans trait d'union poussait le bandeau « Nous vous préviendrons par e-mail. » hors de l'écran (23 px de défilement). Corrigé dans `StatusBanner` : la colonne de texte peut rétrécir et coupe un mot trop long ; les bandeaux de l'espace en profitent aussi.
- Gardés comme les maquettes : les deux « Copier » de styles différents (m21, m5 : l'adresse en bouton principal avec icône, la clé en bouton secondaire) ; le badge « Disponible » qui passe sous « Systeme.io » quand la ligne est trop courte (m21 sur téléphone).
- À proposer pour le widget (pas fait dans ce lot) : sous environ 312 px de large, le badge de `w.js` déborde de son conteneur, tout en restant sur une seule ligne. Piste : une requête de conteneur qui resserre les avatars sous cette largeur.

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

## Vérification du lot 6 en production, suite (4 octobre, prompt 5 de `lot-6-maquettes.md`)

- La demande de la vraie vente du 3 octobre est partie (« Envoyée le 3 oct. · relance prévue le 7 oct. ») et l'e-mail est arrivé. Elle est partie par l'exécution lancée à la main le 3 octobre à 13:59 (résumé `"sent":1`).
- « Send review requests » tourne seul depuis la fusion, mais GitHub ne le lance que toutes les 3 à 6 heures, à des minutes irrégulières (3 oct. 16:56, 20:40, 23:50 ; 4 oct. 02:14, 08:03, heure de Paris), au lieu des 15 minutes demandées. Toutes vertes, rien d'autre à envoyer (`"sent":0`). Le résumé de la tâche ne contient pas `"ok":true` : c'est le texte du prompt qui l'attendait à tort.
- Délai de « Produit physique test PULSACITY » remis à 14 jours. Paiement à la livraison décoché sur le « Tunnel test PULSACITY » : le bon de commande n'affiche plus de mode de paiement. Il reste branché au niveau du compte Systeme.io (Passerelles de paiement), sans effet tant qu'aucun tunnel ne l'active. Tunnel, produit et webhook « PULSACITY » gardés pour les tests.

## Maquettes de Design du 3 octobre (prompt 8)

- 19 PNG dans `docs-internes/maquettes/`, index mis à jour : m19 Demandes (liste, filtre « Planifiées », plan Gratuit à 20 demandes, vide, planche des statuts), m5 (téléphone, clé différente, changer d'adresse et de clé, étape facultative des inscriptions), m1 (désinscription confirmée).
- Badges de Demandes, sans nouvelle couleur : Planifiée sur Papier ; Envoyée et Relancée en blanc cerclé d'Encre ; Annulée en pointillé Gris 400, texte Ardoise ; Complétée et Échec en Succès et Erreur.
- Étape facultative : Design supposait qu'une inscription arrive comme une vente à 0 €. Les formats capturés disent autre chose : c'est un événement à part (« Inscrit à la formation »), sans prix, associé à une offre comme un produit.
- Captures des réglages Systeme.io : Design recommande les vraies, recadrées sur la zone utile, le champ encadré en Encre, refaites quand Systeme.io change. Elles demandent le compte Systeme.io du fondateur : prompt Claude in Chrome à prévoir ; les dessins restent en attendant.
- Logos : un logo officiel seulement avec l'accord écrit de Systeme.io et de Calendly (aucun kit officiel trouvé ; le badge partenaire de Stripe est réservé à ses partenaires). En attendant, le nom en texte, comme aujourd'hui (l'initiale dans une case).
- Signature des e-mails : pas d'adresse postale du créateur. Le pied d'e-mail portera celle de PULSACITY, qui envoie le message, avec le nom de l'espace et le lien de désinscription (à faire valider). Prénom et ville : deux champs facultatifs, « Signature » et « Ville », dans Réglages, rubrique E-mails, hors de l'onboarding ; sans prénom, l'e-mail signe du nom de l'espace.

## PR #24 (maquettes du 3 octobre), en ligne depuis le 3 octobre

- Demandes (m19) : sous-titre de la maquette ; chiffres du mois comme l'accueil (envoyées ce mois et relancées parmi elles, complétées, taux de réponse) ; pastilles « Statut » avec leur nombre sur ordinateur, liste déroulante avec les nombres sur téléphone ; une ligne par demande avec ses initiales, son badge et ses actions en liens ; badges de la planche des statuts ; « Afficher les … suivantes » et « Et … autres demandes planifiées. » au lieu des pages ; état vide avec « Connecter Systeme.io » (tant que la connexion n'est pas active) et « Copier mon lien ».
- Plan Gratuit plein : encadré « Les 20 demandes d'octobre sont parties. », lignes « Prévue le 6 oct. · partira le 1er nov. », plus de « Envoyer maintenant ».
- Actions par statut : « Envoyer maintenant » et « Annuler » (planifiée), « Annuler la relance » (envoyée, relance prévue), « Voir l'avis » (complétée, vers la fiche du témoignage), « Corriger l'adresse » (échec).
- Connecteurs (m5) : « Adresse partagée par erreur ? Changer d'adresse et de clé » et sa fenêtre ; bandeau ambre « 1 vente gardée de côté » quand la connexion remarche mais qu'une vente signée avec une autre clé attend « Rejouer » ; cette vente reste en tête des derniers événements, en ambre, avec « Rejouer » et son icône ; étape facultative « les inscriptions sans vente » ; mise en page téléphone (logo au-dessus du titre, titres de section plus petits, « Plus simple depuis un ordinateur. », « Voir tout l'historique » sous la liste).
- Désinscription (m1) : rond Encre, second texte en Ardoise, bouton carmin « Écrire à … » sur toute la largeur, « Propulsé par » juste dessous.
- Migration 0007 : colonnes facultatives `review_requests.cancelled_at`, `review_requests.failed_at`, `external_products.event_type`.
- Dates : « 1er » pour le premier jour d'un mois (« Partira le 1er oct. »), partout où l'application écrit une date courte.

## Recette de la PR #24 sur l'aperçu (3 octobre)

- Prompt 1 : « Recette demo space #5 » vert, depuis la branche (commit c66a469), plan free.
- Prompt 2 (Demandes, e-mail réel, désinscription) : 17 points sur 17. Trois remarques : l'ordre des demandes déjà traitées (une annulée remontait avec son jour prévu, corrigé) ; Sophie D. « Avis reçu le 1er oct. » mais sa fiche « reçu le 30 sept. » (dates de l'espace de démonstration, corrigées) ; badge « Annulée » en tirets (conforme à la planche de m19).
- Prompt 3 (Systeme.io) : 10 points sur 10. Remarques : le prix de « Suivi individuel 3 mois » est passé à 297 € (le script de test envoyait 297 € pour tous les plans : le prix suit la dernière vente, voulu) ; le bandeau était vert avant la vente à mauvaise clé (le prompt disait « comme avant », à tort).
- Prompt 4 (360 px) : 8 points sur 8, sans débordement. Le menu déroulant natif ne réagit toujours pas aux clics dans le cadre de Claude in Chrome : essai au doigt sur téléphone à faire.

## PR #25 (« Demander un avis », m20), en ligne depuis le 3 octobre

- Le bouton « Demander un avis » de Demandes ouvre le formulaire de m20 : une fenêtre sur ordinateur, tout l'écran sur téléphone (barre avec la croix, qui reste en haut quand on défile). Le bouton de l'accueil ouvre Demandes avec le formulaire déjà ouvert (`?demander=1`).
- Formulaire : prénom et nom facultatifs, adresse, offre, date d'achat (aujourd'hui par défaut, jamais dans le futur), case « Cette personne a acheté cette offre auprès de moi. ». Sous les noms, le début de l'e-mail (« Bonjour Élodie, ») ; sous la date, sa phrase « vous avez acheté … auprès de … le … », avec l'offre et la date choisies.
- Même chemin qu'une vente : le client (ses noms connus gardés), un achat `source = manual`, une demande au prochain envoi, le même e-mail, la relance, la désinscription. Une demande saisie à la main part même si les demandes automatiques de l'offre sont désactivées : elle a été voulue.
- Confirmation : Demandes avec « Demande prête pour … », l'adresse et le jour de la relance (`?demande=<id>`), la nouvelle ligne en tête.
- Refus de m20 : déjà une demande pour cette offre (ce qu'elle est devenue, « Copier mon lien de collecte » de l'offre, « Voir sa demande ») ; personne désinscrite ; adresse incomplète, avec l'adresse tapée complétée en exemple ; plafond du jour (bouton grisé, saisie gardée) ; plan Gratuit plein (encadré gris, « partira le 1er novembre ») ; aucune offre (« Ajoutez d'abord une offre », « Aller à Offres »).
- Plafond du jour dans `plans.ts` (`manualRequestsPerDay`, 20 sur tous les plans), compté sur `purchases.created_at` (migration 0008, colonne avec une valeur par défaut).

## Recette de la PR #25 sur l'aperçu (3 octobre)

- Prompt 1 : « Recette demo space #6 » vert, depuis la branche (commit 65cb2b4), plan free.
- Prompt 2 (formulaire, demande, e-mail réel, refus « déjà une demande » et « désinscrite ») : 13 points sur 13.
- Prompt 3 (360 px) : 4 points sur 4, sans débordement. Dans le cadre de Claude in Chrome, les champs font 297 px au lieu de 312 à cause de la barre de défilement classique ; sur un téléphone, elle se superpose au contenu.
- Le menu déroulant natif (offres, filtre « Statut ») ne réagit toujours pas aux clics dans ce cadre : choisi par la console, à essayer au doigt sur un téléphone.

## Pas encore construit

- « Vente annulée » de Systeme.io : son payload n'a jamais été capturé (un remboursement de paiement à la livraison n'émet rien). Les événements reçus sont gardés sans être lus ; une demande d'une vente remboursée part donc quand même, sauf si le créateur l'annule dans Demandes. À capturer avec une vente Stripe en mode test, puis à traiter.
- Page Facturation de l'espace (lot 4.5). Réglages et Mon compte : lot 4.3.
- Stripe (abonnements, Checkout, portail) : la page Tarifs existe (lot 7), ses boutons mènent à l'inscription.
- Le paramètre de parrainage `?ref=` des mentions « Propulsé par » arrive sur l'accueil, mais rien ne l'enregistre encore.

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

1. Envoi planifié, avant le lancement public : GitHub ne lance « Send review requests » que toutes les 3 à 6 heures. Pour une demande à J+14, quelques heures ne se voient pas ; pour « Demander un avis » et un délai de 0 jour, « dans les minutes qui suivent » est faux (en attendant : « Envoyer maintenant »). Recommandation : passer Vercel en Pro avant le lancement (20 $ par mois ; l'offre Hobby est réservée à un usage personnel non commercial), puis une petite PR : tâche toutes les 15 minutes dans `vercel.json`, workflow GitHub retiré. Décision et action du fondateur (prompt à écrire le jour venu).
2. Essai au doigt, sur le téléphone du fondateur, des menus déroulants natifs : filtre « Statut » de Demandes, offre de « Demander un avis ».
3. Captures réelles des réglages Systeme.io, par un prompt Claude in Chrome sur le compte du fondateur.
4. Toujours en attente du lot 5 : prompt 2 de `docs-internes/recette/lot-5-widget-fin.md` (mur d'une colonne sous 340 px sur la page Systeme.io) et contrôle au doigt du carrousel sur le téléphone du fondateur.
5. TVA : aucune n'est facturée tant que le fondateur vend en particulier (`decisions/tarifs.md`, arbitrage n° 2). Le régime de la micro-entreprise se confirme par écrit au seuil (6.4).
6. Dépôt public ou privé : décision du fondateur (en privé, protéger `main` demande GitHub Pro).
7. Sentry, avant le lancement.
8. Performance de `/integrations/systeme-io` (90 sur mobile) : réduire le JavaScript inutilisé et les fichiers qui bloquent l'affichage, dans un lot suivant.
9. Textes légaux : informations à fournir (SIREN, adresse, directeur de la publication, contact…, liste dans `recette/lot-7-site.md`), puis relecture par un juriste avant `LEGAL_VALIDATED=true`.
10. Le site est en ligne : déclarer pulsacity.com dans Google Search Console, y envoyer le plan du site et y suivre la reconnaissance de l'Organization (prompt à écrire ; une vérification par enregistrement DNS chez OVH ne touche ni MX ni SPF).
11. Lot 4.12, accueil et acquisition (`decisions/commercialisation.md`, arbitrage n° 11), après les maquettes 3.4 et 3.6. Avant la bêta : source d'inscription (UTM, liens courts `/go/…`, parrainage, « Comment avez-vous connu PULSACITY ? »), e-mails d'accueil J0, J1, J3 et J7, requête « tableau de bord fondateur », espace PULSACITY et son mur sur pulsacity.com, mesure d'audience Umami. Avant le lancement : parrainage, codes par partenaire, image de partage d'un témoignage, Resend Pro.
12. Lot 4.13, avis en ligne (`decisions/positionnement.md`, points 1 à 7, arbitrage n° 6), avant la bêta, après les maquettes 3.4, 3.5 et 3.6 : provenance de chaque témoignage, date de l'avis et mois de l'achat dans le widget, page « À propos de ces avis », correction soumise à l'accord du client, note du badge sur tous les avis reçus, motif de « Masquer », contrepartie. D'ici là, aucune mention de vérification.
13. La base de recette (Supabase, offre gratuite) se met en pause après 7 jours sans activité : le 12 octobre, « Recette demo space » a échoué pour cette raison. Avant une recette, la réveiller (prompt 0 bis de `recette/lot-4-1-decisions.md`). À régler dans le lot 4.10 : une activité régulière, ou un plan payant le moment venu.

14. App PULSACITY pour Make : publier une version propre (icône, textes relus) le jour où elle est proposée aux créateurs, puis mettre son lien dans le guide Make et sur la fiche Make. Publier est définitif chez Make.
15. Vérifications en production, toutes à la toute fin (décision du fondateur, 14 octobre) : lot 4.1 (prompt 4 de `recette/lot-4-1-decisions.md`), lot 4.1 b (prompt 14 de `recette/lot-4-1-b-universel.md`), lot 4.2 (prompt 5 de `recette/lot-4-2-fondations-v2.md`), lot 4.3 (prompt 9 de `recette/lot-4-3-reglages-compte.md`), puis celles des lots suivants. Chaque lot se fusionne après sa recette sur l'aperçu.

Remarques de la recette, à reprendre quand on touchera ces écrans :
- la photo met 3 à 5 secondes à s'afficher (adresse r2.dev, déjà prévue avant le lancement) et le récapitulatif après l'envoi ne la montre pas ;
- les compteurs du haut de la liste se mettent à jour environ une seconde après « Valider » ou « Masquer » ;
- un premier clic sur « Importez un fichier CSV » n'a rien fait une fois, le second a ouvert la page ;
- éditeur de widget, encadré « Code envoyé à … » (depuis le 2 octobre) : « Ouvrez l'e-mail sur votre ordinateur… » est décalé d'environ 20 px et « Renvoyer l'e-mail » d'environ 8 px par rapport au texte du titre (recette du lot 4.1). À aligner avec la maquette v2 de l'éditeur.

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
- Bouton « Demander un avis » de m19 (en haut de Demandes) : pas construit dans la PR #24, la maquette ne dit pas ce qu'il ouvre. Décision plus bas.
- Ordre de Demandes, après la recette : les demandes déjà traitées suivent leur dernier événement, annulation et échec compris. Une demande annulée avant l'enregistrement de sa date passe en dernier, au lieu de remonter avec son jour prévu.
- Espace de démonstration : un témoignage relié à une demande a la date de réponse de cette demande (« Avis reçu le … » et la fiche disent le même jour).
- Badge « Annulée » : contour en tirets, comme la planche des statuts de m19 (le texte de Design dit « pointillé »).
- Prix d'un produit Systeme.io : celui de la dernière vente reçue, car un plan de prix garde son montant. La date reste celle de la première vente. Les 297 € de « Suivi individuel 3 mois » vus en recette viennent du script de test, qui envoyait 297 € pour tous les plans.

## Décision du 3 octobre : « Demander un avis » (tranchée par Claude Code, à la demande du fondateur)

- Le bouton envoie une demande d'avis à un client que le créateur saisit lui-même : prénom et nom (facultatifs), adresse, offre, date d'achat. Plutôt que de copier le lien de collecte, que l'accueil, l'état vide de Demandes et Offres donnent déjà.
- Pourquoi :
  - la promesse de PULSACITY, ce sont des demandes qui partent au bon moment, au nom du créateur, avec une relance ; un lien copié n'en a ni la relance ni le suivi ;
  - beaucoup de créateurs encaissent aussi hors de Systeme.io (virement, Learnybox, séances), ou ont des clients d'avant PULSACITY : ils peuvent s'en servir dès le premier jour, sans attendre leur connecteur ;
  - chaque demande compte dans les 20 du mois du plan Gratuit : le bouton fait grandir l'usage, et donc le passage au payant.
- Comment, sans rien de nouveau dans le cœur : le même chemin qu'une vente reçue (client, achat `source = manual`, demande planifiée au prochain envoi), le même e-mail (m3), la désinscription, une seule demande par client et par offre.
- Garde-fous : une case obligatoire « Cette personne a acheté cette offre auprès de moi. » (le pied de l'e-mail l'affirme, et c'est la base légale de l'envoi) ; les adresses désinscrites refusées ; un plafond quotidien d'envois à la main contre les envois en masse, défini dans `plans.ts`.
- Maquette m20 livrée par Design le 3 octobre, construite dans la PR #25. Un envoi groupé (liste d'adresses, fichier comme m16) pourra suivre.

## Décisions du 3 octobre (PR #25, « Demander un avis », m20)

- Plafond proposé par Design, validé : 20 demandes saisies à la main par jour, sur tous les plans, dans `plans.ts`. Elles comptent aussi dans les 20 demandes du mois du plan Gratuit.
- La phrase « L'e-mail dira » reprend la date comme l'e-mail l'écrit vraiment (« le 3 oct. 2026 »), pas « le 5 octobre 2026 » de m20.
- Les refus parlent de « cette personne » plutôt que de « elle » : le client peut être un homme ou une femme.
- « Envoyer maintenant » reste sur une demande qui part au prochain envoi, y compris celle qu'on vient de saisir (m20 n'y montre que « Annuler ») : tant que l'envoi toutes les 15 minutes par GitHub n'a pas fait ses preuves, c'est le moyen de la faire partir tout de suite, et le seul sur un aperçu, où rien ne part tout seul.
- Plusieurs clients d'un coup : plus tard, comme le recommande Design (le plafond et la case n'ont plus de sens pour cinquante adresses ; regarder d'abord si les créateurs enchaînent les saisies). « Envoyer et en saisir une autre » n'est pas dessiné, donc pas construit.
- Un client déjà connu garde ses noms ; ceux tapés ne complètent que ce qui manque.

## Questions ouvertes


- Noms de colonnes de m16 en police à chasse fixe : la charte n'en a pas, ils sont en gras dans la police du texte. À confirmer par Design.
- Prénom du créateur : pas demandé à l'inscription ; il se donne dans Mon compte (lot 4.3), et l'accueil dit alors « Bonjour Julie ».
- Adresse de support : « Aide et contact » pointe vers `/aide`, qui n'existe pas, et la page du guide sur mobile (« Bloquée à une étape ? Écrivez-nous ») l'attend aussi : sa ligne n'est pas affichée en attendant. Le lien « Contact » du pied de page mène aux mentions légales, où l'adresse est encore « [À COMPLÉTER] ». Le site public l'attend aussi : « Écrivez-nous » de m21 et m22.
- Questions pour Design (lot 4.2) :
  - l'icône « alerte » : l'annexe de la charte la dessine en triangle, les planches montrent un rond avec « ! » (bandeaux, champs, badge « Problème », « alerte cerclée ») ; le code suit le texte, comme le veut l'INDEX ;
  - les badges de Demandes (Planifiée, Envoyée, Relancée, Annulée, m19) n'existent pas dans la charte v2 : gardés en jetons v2 (Ciel, bord Encre, tirets Gris) jusqu'à la maquette v2 de Demandes ;
  - les colonnes de prix Gratuit et Pro sont blanches sur une section Nuage dans la charte ; dans la mise en page v1 de Tarifs, sur une page blanche, elles sont Nuage jusqu'au lot 4.7 ;
  - survol non dessiné : liens du pied de page (le soulignement s'épaissit), onglets du téléphone (aucun) ;
  - CLAUDE.md donne « Créer mon espace » comme libellé exact ; la charte v2 fige « Créer mon espace gratuit », que les coques affichent ;
  - le grand titre v1 de l'accueil, « … automatiquement. », déborde à 360 px en taille display (42 px) : il est en h1 sur téléphone jusqu'à l'accueil v2 (lot 4.7).
- Dans ce conteneur (Node 22.22.0), `decode-csv-file.test.ts` échoue sur `main` comme sur la PR #27 : l'octet 0x9C de Windows‑1252 n'y donne pas « œ ». La CI, sur son propre Node 22, est verte. À surveiller si la CI passe à cette version.
- Effet des prix (9,99 € au prix fondateur, 14,99 € ensuite) sur le passage au payant : à la revue de `decisions/tarifs.md` (60 jours de paiements ou 300 inscrits).
- E-mails aux clients : la loi sur la prospection demande l'adresse postale de l'expéditeur. Réglages la demande depuis le lot 4.3, facultative ; faut-il la rendre obligatoire avant tout envoi ? Question pour la relecture juridique (6.7).
- Questions pour Design (lot 4.3) : l'avatar sans logo sur la couleur d'accent (maquettes) ou sur Ciel (charte) ; la taille du titre de l'aperçu de la page de collecte ; la place de « Prendre … » à 360 px ; un e-mail à l'ancienne adresse quand l'adresse de connexion change (non dessiné, non construit).
- Avant le lancement : afficher le JSON brut d'un événement inconnu à Claude Code (requête SQL dans Supabase, par prompt) pour capturer « Vente annulée » le jour où un créateur en reçoit une.
- La page de vente dessinée dans l'aperçu de l'éditeur reste générique (nom de l'espace, nom de l'offre, « Ce qu'en disent mes clients ») : m6 y montre la page de Julie Nutrition (menu, prix, « Tous les avis »). Écart gardé depuis le lot 5.
