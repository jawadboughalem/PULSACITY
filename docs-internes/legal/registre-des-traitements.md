# Registre des traitements (article 30 du RGPD)

Brouillon préparé par Claude Code au lot 4.9, d'après le modèle de la CNIL et les textes publiés (politique de confidentialité, annexe des CGU). Le fondateur le tient à jour : il le recopie dans le modèle de la CNIL (cnil.fr, « Le registre des activités de traitement »), y ajoute son identité et ses coordonnées, et le garde hors du dépôt public. Aucune donnée personnelle ici, et aucune sur le site (décisions des 21 et 22 octobre 2026).

À revoir à chaque nouveau prestataire, nouvelle donnée ou nouvelle durée, et au jour de la micro-entreprise (6.6).

## Responsable et contact

- Responsable du traitement : PULSACITY, « l'équipe PULSACITY » dans les textes publiés. Son identité réelle n'est écrite que dans le registre tenu hors du dépôt.
- Contact pour les données : contact@pulsacity.com.
- Pas de délégué à la protection des données (non obligatoire).

## Partie 1 — Traitements dont PULSACITY est responsable (article 30.1)

| Traitement | Finalité | Personnes | Données | Base légale | Destinataires | Durée |
| --- | --- | --- | --- | --- | --- | --- |
| Espace du créateur | Faire fonctionner le service | Créateurs | E-mail, prénom, nom et adresse de l'espace, logo, couleur, offres, réglages, outils connectés, appareils connectés (navigateur, adresse IP) | Contrat | Vercel, Supabase, Cloudflare (logos), Resend | Durée du compte, effacement sous 30 jours (dans les faits, à la suppression) ; aucune sauvegarde de la base (offre Free de Supabase, relevé du 22 octobre) |
| Abonnements | Vendre et encaisser | Créateurs abonnés | Plan, paiements, reçus ; la carte chez Stripe | Contrat ; obligations comptables | Stripe | Durée de l'abonnement ; reçus 10 ans |
| E-mails du service | Lien de connexion, nouveau témoignage, facturation, accueil | Créateurs | E-mail, étapes faites | Contrat ; intérêt légitime (accueil, désinscription en un clic) | Resend | Durée du compte |
| Source des inscriptions | Savoir d'où viennent les inscriptions | Créateurs | Réponse « Comment avez-vous connu PULSACITY ? », source de l'adresse, code de parrainage | Intérêt légitime | Supabase | Durée du compte |
| Messages reçus | Répondre | Toute personne qui écrit | Adresse, sujet, message (nom et plan de l'espace s'il y en a un) | Intérêt légitime | Resend, OVH, Google (Gmail) | 3 ans après le dernier échange ; compteurs d'envois 48 heures |
| « Me prévenir », « Dites-nous quel outil » | Annoncer un connecteur, choisir les suivants | Visiteurs, créateurs | E-mail, outil (sans espace : l'outil seul pour « Dites-nous quel outil ») | Consentement | Supabase, Resend | Jusqu'à l'annonce, au plus 3 ans |
| Protection du service | Sécurité, limites d'envoi | Visiteurs | Adresse IP, date, page ; empreinte HMAC de l'adresse IP | Intérêt légitime | Vercel | Journaux : 1 heure (Vercel Hobby), 1 jour (Pro) ; compteurs : 48 heures |
| Mesure d'audience | Statistiques des pages publiques | Visiteurs | Pages, source, pays, langue, appareil ; sans cookie, IP non gardée | Intérêt légitime (exemptée de consentement, auto-évaluation CNIL faite) | Umami Software (clauses contractuelles types) | 6 mois |

## Partie 2 — Traitements faits pour le compte des créateurs (article 30.2)

- Responsables : chaque créateur qui a un espace (liste : table `spaces` et leur e-mail de compte).
- Catégories de traitements : réception des ventes des outils connectés ; planification et envoi des demandes d'avis et d'une relance ; collecte des avis, notes, photos et accords ; hébergement et affichage des avis validés par les widgets ; motif d'un masquage et accord sur une correction ; désinscriptions et retraits d'accord ; exports.
- Personnes concernées : les clients des créateurs, et toute personne dont un créateur transmet une vente.
- Données : e-mail, prénom, nom, offre, date, montant et référence de l'achat, statut des demandes, avis (note, texte, nom et titre indiqués, photo), preuve de l'accord (date, heure, texte accepté), désinscriptions ; contenu brut des notifications des outils, supprimé 90 jours après son traitement (purge à construire au lot 4.10).
- Sous-traitants ultérieurs : Vercel Inc. (hébergement, Francfort), Supabase Pte. Ltd (base de données, Francfort), Plus Five Five, Inc. / Resend (e-mails, Irlande), Cloudflare, Inc. (photos, Europe de l'Ouest).
- Transferts hors de l'Union : vers ces prestataires seulement, encadrés par le DPF et les clauses contractuelles types (compte rendu 2.4).
- Sécurité : HTTPS ; connexion par lien unique ; chaque requête de l'espace vérifie la session et l'appartenance de l'espace ; secrets dans les variables Vercel et GitHub, jamais dans le dépôt ; aucune sauvegarde de la base tant que Supabase reste sur l'offre Free (à décider au lot 4.10) ; accès aux tableaux de bord réservés à l'équipe PULSACITY.

## Violations de données

Toute violation se note ici, même sans notification : date, nature, données et personnes touchées, conséquences, mesures prises. Notification à la CNIL sous 72 heures si un risque existe ; aux créateurs concernés sous 48 heures pour les données de leurs clients (annexe des CGU, point 11).

| Date | Nature | Données, personnes | Mesures | Notifiée à |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |
