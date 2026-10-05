# PULSACITY — le brief

À joindre au projet Claude « PULSACITY — Stratégie » et au projet Claude Design « PULSACITY v2 ». État au 5 octobre 2026.

Ce fichier ne contient aucune donnée personnelle. Ce qui concerne le fondateur (situation professionnelle, adresse, banque) se dit dans la conversation, quand un prompt le demande, et ne revient jamais dans le dépôt.

## Le produit

PULSACITY transforme automatiquement les ventes des indépendants francophones en témoignages affichés sur leurs pages de vente.

Promesse : « Vos ventes deviennent des témoignages, automatiquement. »

### Pour qui

Les indépendants francophones qui vendent en ligne : coachs, formateurs, consultants, créateurs de formations, thérapeutes, accompagnants. Ils sont le plus souvent seuls, souvent micro-entrepreneurs, et encaissent dans un outil tout-en-un (Systeme.io, Learnybox, Podia, Kajabi…), par Stripe, ou à la séance (Calendly, Cal.com). Pays visés : France, Belgique, Suisse, Luxembourg, Québec, Afrique francophone.

### Le problème

Les témoignages sont la meilleure preuve d'une page de vente. Mais les demander prend du temps, on oublie, on n'ose pas relancer, et les afficher proprement demande un outil de plus. Résultat : des pages de vente avec trois avis datés, ou aucun.

### Comment ça marche

1. Le créateur crée son espace (lien de connexion par e-mail, sans mot de passe) et déclare ses offres : formation, accompagnement, séance.
2. Il connecte l'outil où il encaisse, en y collant une adresse propre à son espace. Aujourd'hui : Systeme.io.
3. À chaque vente ou inscription, PULSACITY reçoit le client.
4. Après un délai (14 jours par défaut, réglable par offre), le client reçoit un e-mail au nom du créateur qui lui demande son avis. Une relance au plus : jamais plus de 2 e-mails par client et par offre.
5. Le client laisse une note, un texte et une photo sur une page pensée pour le téléphone, en moins de 60 secondes, avec son accord explicite pour la publication.
6. Le créateur valide. Le témoignage s'affiche sur sa page de vente par un widget collé une seule fois : mur, carrousel, ou badge « 4,9/5 · 87 avis ».

Autres entrées : ajout manuel d'un témoignage reçu ailleurs, import d'un fichier CSV, « Demander un avis » à un client saisi à la main, lien de collecte à partager.

### Ce qui le distingue (à confirmer par la recherche)

- La demande part toute seule, au bon moment, à partir de la vraie vente : pas de liste à importer, pas d'oubli.
- Pensé pour les outils des indépendants francophones, Systeme.io en premier.
- En français, données hébergées dans l'Union européenne, consentement à la publication prouvé et horodaté.
- Un widget léger qui prend les polices et les couleurs de la page du créateur.
- Un prix sous les 10 € par mois.

## Ce qui existe, en ligne sur pulsacity.com

- **Site public** : accueil, tarifs, intégrations (Systeme.io disponible ; Stripe et Calendly en « Bientôt », avec « Me prévenir »), trois guides, pages légales en brouillon.
- **Inscription et connexion** par lien magique ; création de l'espace (nom, adresse publique, logo, couleur d'accent) ; choix des formations.
- **Espace du créateur** :
  - accueil ;
  - témoignages : valider, masquer, mettre en avant, corriger le texte affiché (l'original est gardé), preuve du consentement ;
  - ajout manuel et import CSV ;
  - offres ;
  - widgets, avec un éditeur à aperçu en direct ;
  - connecteurs : Systeme.io et son historique ;
  - demandes : planifiées, envoyées, relancées, complétées, annulées, en échec ;
  - « Demander un avis ».
- **Pour les clients du créateur** : page de collecte, e-mails de demande et de relance, désinscription en un clic.
- **Widget** : un seul script de moins de 30 Ko compressé, sans dépendance, isolé de la page hôte.

## Ce qui manque

- Les pages Réglages, Mon compte, Abonnement et factures, Aide et contact : les liens existent dans l'espace, les pages non.
- Le paiement : rien ne permet encore d'encaisser. Chaque « Passer au plan Essentiel » mène à une page qui n'existe pas.
- L'entreprise : pas encore immatriculée. Les textes légaux attendent ses informations, puis une relecture.
- Les connecteurs : un seul est disponible.
- Le parrainage : le lien « Propulsé par PULSACITY » porte un code de parrainage, que rien n'enregistre encore.

## Plans et prix

| Plan | Prix | Témoignages | Demandes automatiques par mois | Widgets | Badge « Propulsé par PULSACITY » |
| --- | --- | --- | --- | --- | --- |
| Gratuit | 0 € | 15 validés | 20 | 1 | obligatoire |
| Essentiel | 9,99 € par mois, 99 € par an | illimités | illimitées | illimités | obligatoire |
| Pro | 19,99 € par mois, 199 € par an | illimités | illimitées | illimités | retirable |

- Sur tous les plans : 20 demandes saisies à la main par jour, contre les envois en masse.
- Dépasser une limite ne supprime jamais de données : on bloque l'ajout et on propose le plan supérieur. Au-delà de 15 témoignages validés, les nouveaux arrivent et attendent.
- L'annuel vaut dix mois (« 2 mois offerts »).
- **Prix TVA comprise** : le montant affiché est celui que le créateur paie. Beaucoup d'indépendants ne récupèrent pas la TVA (franchise en base, formations exonérées) ; un prix hors taxes serait un prix qu'ils ne paient jamais.
- Ce qui reste à PULSACITY par abonné Essentiel mensuel, si PULSACITY collecte la TVA à 20 % : environ 7,81 € après la TVA et les frais Stripe. Sans TVA collectée (franchise en base) : environ 9,50 €. Les cotisations sociales et l'impôt viennent ensuite.
- Le Pro n'a aujourd'hui qu'un avantage : retirer le badge.

## Coûts connus, à vérifier

| Poste | Aujourd'hui | À prévoir |
| --- | --- | --- |
| Vercel (hébergement) | Hobby, gratuit, réservé à un usage personnel non commercial | Pro, 20 $ par mois, avant d'encaisser |
| Supabase (base de données) | Production et recette | Plan Pro (environ 25 $ par mois) si le plan gratuit ne suffit plus |
| Resend (e-mails) | Offre gratuite : environ 3 000 e-mails par mois, 100 par jour | Environ 20 $ par mois au-delà |
| Cloudflare R2 (photos) | Gratuit jusqu'à 10 Go | Quelques centimes par Go ensuite |
| Domaines pulsacity.com et pulsacity.fr | OVH, par an | — |
| GitHub | Gratuit, dépôt public | Environ 4 $ par mois si le dépôt passe en privé |
| Stripe | — | 1,5 % + 0,25 € par paiement par carte européenne, Billing 0,7 %, Tax 0,5 % |
| Abonnement Claude | En cours | — |
| Comptabilité, assurance, relecture juridique | — | Selon le statut retenu |

Coûts variables d'un espace (e-mails, photos) : quelques centimes par mois.

## Technique (pour mémoire)

Next.js sur Vercel à Francfort, Postgres chez Supabase à Francfort, e-mails par Resend, photos sur Cloudflare R2, paiements par Stripe Billing (à brancher). Construit par Claude Code, une session par lot, avec une recette sur chaque aperçu avant la mise en ligne.

## L'identité actuelle (v1)

- **Logo** : une fusée droite, en Encre, portée par une étoile en Carmin qui remplace la flamme. Récit : les avis (les étoiles) font décoller l'activité (la fusée). Mot « PULSACITY » en Newsreader 600.
- **Couleurs** : Carmin #A3243B (accent), Encre #16213E (texte, boutons), Papier #F3F3F0 (fonds de section), Ardoise #5A5F6E (texte secondaire), blanc, et trois couleurs d'état (succès vert, attente ambre, erreur rouge).
- **Polices** : Newsreader (titres, citations) et Public Sans (interface).
- **Formes** : filets fins, coins peu arrondis, très peu d'ombres, beaucoup de blanc.
- **Verdict du fondateur, le 5 octobre** : trop basique, trop linéaire, pas assez moderne, fade, et trop proche du style des assistants d'IA (serif + fond crème + filets). Le logo peut être amélioré pour paraître moins fade. Il veut un style sobre et accessible, mais pas fade.

Interdits permanents, qui restent en v2 (signatures de sites générés) :
- étiquettes en majuscules espacées au-dessus des titres ;
- un mot du titre en couleur ou en italique ;
- flèches « → » dans les boutons ;
- grilles de cartes identiques avec la même ombre ;
- dégradés décoratifs ;
- animations d'apparition sur chaque section ;
- numérotation 01/02/03 hors d'une vraie séquence.

## Ce qui ne change pas

- **Toute la logique** : parcours, états, règles, textes des boutons (« Créer mon espace », « Copier le code », « Valider », « Masquer », « Envoyer mon avis »). La v2 change l'apparence, pas le fonctionnement.
- **Ton** : français, vouvoiement, phrases courtes, casse de phrase. On parle de ventes, de formations, de pages de vente, jamais de « payload », « endpoint » ou « token ». Une erreur dit ce qui s'est passé et quoi faire ; un état vide, une phrase et l'action suivante.
- **RGPD** : PULSACITY est sous-traitant des données des clients du créateur. Consentement explicite et horodaté à la publication ; export et suppression faciles.
- **Widget** : rendu isolé de la page hôte, polices et couleurs de la page hôte par défaut, aucun saut de mise en page, moins de 30 Ko.
- **Badge « Propulsé par PULSACITY »** : visible sur Gratuit et Essentiel, retirable sur Pro seulement, avec le lien de parrainage de l'espace.
- **E-mails aux clients du créateur** : au nom de l'espace, réponse vers le créateur, lien de désinscription dans chacun, 2 au plus par client et par offre.
- **Accessibilité** : contrastes WCAG AA (4,5:1 pour le texte), cibles tactiles de 44 px au moins, champs en 16 px au moins, tout lisible à 360 px de large.

## Concurrence repérée, à vérifier

- Collecte et murs de témoignages : Senja, Testimonial.to, Famewall, Shapo, Trustmary, Vocal Video, EmbedSocial, Elfsight.
- Avis clients en France, plutôt pour le commerce et les établissements : Avis Vérifiés (groupe Skeepers), Guest Suite, Custplace.

## Le fondateur

- Seul, avec Claude : Claude Chat pour décider, Claude Design pour dessiner, Claude Code pour construire, Claude in Chrome pour agir sur les services.
- A déjà des comptes LinkedIn et Instagram.
- Fera lui-même, avec Claude, les publicités, les vidéos (motion design compris) et les publications.
- Entreprise pas encore créée : la micro-entreprise est envisagée.
