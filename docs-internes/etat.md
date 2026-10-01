# État du projet

Mis à jour le 1er octobre 2026, après la recette du lot 4 sur l'aperçu. À lire au début de chaque session, et à mettre à jour à chaque fusion sur `main`.

## En ligne sur pulsacity.com

- Socle : Next.js à Francfort, base Supabase, connexion par lien magique, CI (PR #8 à #14).
- Inscription, création de l'espace, onboarding des formations, page publique de collecte `/t/[espace]` et `/t/[espace]/[offre]` (PR #12).
- Espace du créateur, maquette 4 : accueil, témoignages (liste, filtres, fiche, « Valider », « Masquer », « Mettre en avant », texte affiché, suppression définitive), ajout manuel, import CSV, offres. Identité v2 : logo, favicon, micro-animations (PR #15).
- Trois environnements : local, recette sur chaque aperçu Vercel, migrations de production lancées à chaque fusion et attendues par Vercel avant la mise en ligne (PR #16).

## Pas encore construit

- Connecteur Systeme.io : les payloads réels sont capturés (`docs-internes/connectors/systeme.md`, fixtures dans `src/lib/connectors/systeme/__fixtures__`). Restent `normalize`, la réception des webhooks (`/api/connectors/...`) et l'écran Connecteurs (maquette 5).
- Demandes d'avis : planification, Vercel Cron, e-mails de demande et de relance (maquette 3), désinscription.
- Widget : mur, carrousel et badge (maquette 2), éditeur (maquette 6), JSON public. `widget/` ne contient que l'amorce du montage.
- Pages Widgets, Connecteurs, Demandes, Réglages et Facturation de l'espace.
- Stripe (abonnements, Checkout, portail) et page Tarifs.
- Site : accueil (maquette 7), intégrations, guides, pages légales.

## Fait le 1er octobre (prompts de `docs-internes/recette/actions-1er-octobre.md`)

- Base de recette avec son propre mot de passe ; jeton R2 de production vérifié (Object Read & Write sur `pulsacity-photos` seul).
- Recette du lot 4 sur l'aperçu : 30 points sur 31 sur ordinateur, 7 sur 9 à 360 px. Les trois écarts sont corrigés dans la PR qui suit : messages « Délai enregistré. » et « Demandes automatiques désactivées. » absents, filtres « Statut / Offre / Note » qui débordaient à 360 px.
- Envoi d'une photo et lien de connexion vérifiés sur l'aperçu.
- `main` protégée sur GitHub ; alerte GitGuardian 37781349 classée (« test credential »).
- Vercel attend bien « CI » et « Database migration » avant de mettre la production en ligne.
- Claude Design a livré les maquettes m15 (ajout manuel), m16 (import CSV) et m17 (offres).

## À faire

1. Aligner l'ajout manuel, l'import CSV et la page Offres sur les maquettes m15 à m17.
2. Dépôt public ou privé : décision du fondateur (en privé, protéger `main` demande GitHub Pro).
3. Sentry, avant le lancement.

Remarques de la recette, à reprendre quand on touchera ces écrans :
- la photo met 3 à 5 secondes à s'afficher (adresse r2.dev, déjà prévue avant le lancement) et le récapitulatif après l'envoi ne la montre pas ;
- les compteurs du haut de la liste se mettent à jour environ une seconde après « Valider » ou « Masquer » ;
- un premier clic sur « Importez un fichier CSV » n'a rien fait une fois, le second a ouvert la page ;
- les liens Widgets, Connecteurs, Demandes et Réglages mènent à des pages pas encore construites.

## Questions ouvertes

- Prénom du créateur : il n'est pas demandé à l'inscription, donc l'accueil dit « Bonjour » sans prénom.
- « Aide et contact » pointe vers `/aide`, qui n'existe pas : il manque l'adresse de support.
- L'étape « Coller le widget » se cochera au premier affichage du widget, que le lot widget enregistrera.
