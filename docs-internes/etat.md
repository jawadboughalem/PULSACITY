# État du projet

Mis à jour le 1er octobre 2026, avec la PR #20 : le lot 5 (widget) est construit, sa recette reste à faire (`docs-internes/recette/lot-5-widget.md`). À lire au début de chaque session, et à mettre à jour à chaque fusion sur `main`.

## En ligne sur pulsacity.com

- Socle : Next.js à Francfort, base Supabase, connexion par lien magique, CI (PR #8 à #14).
- Inscription, création de l'espace, onboarding des formations, page publique de collecte `/t/[espace]` et `/t/[espace]/[offre]` (PR #12).
- Espace du créateur, maquette 4 : accueil, témoignages (liste, filtres, fiche, « Valider », « Masquer », « Mettre en avant », texte affiché, suppression définitive). Identité v2 : logo, favicon, micro-animations (PR #15).
- Ajout manuel (m15), import CSV (m16) et page Offres (m17), avec les corrections de la recette du lot 4, recettés sur l'aperçu (PR #19).
- Widget, maquettes 2 et 6 : `w.js` (mur, carrousel, badge), JSON public `/api/widget/[id]` en cache à la périphérie, pages Widgets et éditeur avec aperçu en direct, guide « Coller dans Systeme.io » (PR #20).
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

## À faire

1. Recette du lot 5 : fusion de la PR #20, puis prompts 4 à 6 de `docs-internes/recette/lot-5-widget.md` sur une vraie page Systeme.io de test.
2. Dépôt public ou privé : décision du fondateur (en privé, protéger `main` demande GitHub Pro).
3. Sentry, avant le lancement.
4. Prochain lot : au choix du fondateur, parmi « Pas encore construit » ci-dessus.

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

## Questions ouvertes

- Noms de colonnes de m16 en police à chasse fixe : la charte n'en a pas, ils sont en gras dans la police du texte. À confirmer par Design.
- Prénom du créateur : il n'est pas demandé à l'inscription, donc l'accueil dit « Bonjour » sans prénom.
- « Aide et contact » pointe vers `/aide`, qui n'existe pas : il manque l'adresse de support.
- Nom d'un widget : m6 affiche « Avis de la page Programme 30 jours », mais le modèle de données n'a pas de nom. Il est dérivé du type et de l'offre (« Mur · Toutes les offres »). Un champ demanderait une colonne : à décider avec Design (prompt 7 de la recette du lot 5).
- Sans maquette : la liste des widgets, l'éditeur en mobile, l'état « Code copié », le chargement du carrousel et du badge. Construits dans le style de m6 et m17, à faire dessiner (prompt 7).
- Arrondi des cartes du widget : `settings.cardStyle` (anguleux par défaut, comme m2) existe, sans réglage dans l'éditeur, que m6 ne prévoit pas.
