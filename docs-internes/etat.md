# État du projet

Mis à jour le 1er octobre 2026, après la fusion de la PR #17. À lire au début de chaque session, et à mettre à jour à chaque fusion sur `main`.

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

## À faire hors code

Les prompts sont dans `docs-internes/recette/actions-1er-octobre.md`, dans l'ordre :
1. Donner à la base de recette son propre mot de passe.
2. Recette du lot 4 sur l'aperçu, pas sur pulsacity.com : le lot 4 est en ligne depuis la PR #15, fusionnée avant que la recette existe. Le prompt 1 de `lot-4-espace.md` (migrations 0003 et 0004) est fait.
3. Envoi d'une photo et lien de connexion, sur l'aperçu.
4. Protéger `main` sur GitHub.
5. Classer l'alerte GitGuardian 37781349 en faux positif.
6. Dépôt privé ou public : décision du fondateur (en privé, protéger `main` demande GitHub Pro).
7. Sentry, avant le lancement.

Fait : Vercel attend bien « CI » et « Database migration » avant de mettre la production en ligne (vérifié sur la fusion de la PR #17).

## Questions ouvertes

- Prénom du créateur : il n'est pas demandé à l'inscription, donc l'accueil dit « Bonjour » sans prénom.
- « Aide et contact » pointe vers `/aide`, qui n'existe pas : il manque l'adresse de support.
- L'étape « Coller le widget » se cochera au premier affichage du widget, que le lot widget enregistrera.
- Ajout manuel, import CSV et page des offres ont été construits sans maquette, à la demande du lot 4 : ils sont à faire relire par Design.
