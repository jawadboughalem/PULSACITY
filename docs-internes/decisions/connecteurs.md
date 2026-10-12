# 1.2 — Catalogue des connecteurs (décidé le 10 octobre 2026)

Compte rendu du prompt 1.2 (Claude Chat, projet « PULSACITY — Stratégie »), reçu du fondateur le 12 octobre 2026 et rangé tel quel. Le lot 4.1 le reporte dans le contenu du site ; le lot 4.1 b construit le connecteur universel.

## Règles
- Un connecteur dédié n'est construit qu'après la capture de vraies notifications. « Bientôt » ne promet pas de date.
- Le connecteur universel est en ligne avant la publication du catalogue.
- Chaque fiche « Bientôt » montre « En attendant : avec Zapier ou Make ».
- Dédoublonnage : un même client (même e-mail) reçu par deux connecteurs dans les 48 h ne crée qu'une demande ; on garde la vente dont l'offre est associée. À valider en recette.
- Calendly et toute source lue périodiquement : une lecture par jour suffit (délai de 14 jours).
- « Me prévenir » : poids 3 pour un créateur connecté, 1 pour un visiteur. Un outil monte d'une vague à 5 créateurs inscrits et une capture acceptée. Un outil non listé demandé 3 fois dans « Dites-nous quel outil » passe en « Bientôt ».

## Familles (ordre d'affichage)
| # | Titre | Phrase | Affichée en V0 |
|---|---|---|---|
| 1 | Formations et tunnels de vente | Vos élèves reçoivent une demande d'avis après leur achat ou leur inscription. | oui |
| 2 | Rendez-vous et séances | Vos clients reçoivent une demande d'avis après la séance, jamais avant. | oui |
| 3 | Paiements en ligne | Une demande d'avis part après chaque paiement réussi. | oui |
| 4 | Événements et webinaires | Les participants reçoivent une demande d'avis après l'événement. | oui |
| 5 | Boutiques en ligne | Vos acheteurs reçoivent une demande d'avis après leur commande. | oui |
| 6 | Tous vos autres outils | Votre outil n'est pas dans la liste ? Reliez-le avec Zapier, Make ou n8n. | oui |
| 7 | Facturation | Une demande d'avis part quand votre facture est payée. | non (réserve) |
| 8 | Communautés et abonnements | Vos membres reçoivent une demande d'avis après leur arrivée. | non (réserve) |

## Outils
| Nom | Famille | Statut | Vague | Page publique | Phrase affichée | Déclencheur | Moyen technique |
|---|---|---|---|---|---|---|---|
| Systeme.io | 1 | disponible | — | oui | Une demande d'avis après chaque vente ou inscription à une formation. | vente, inscription | webhook (règle d'automatisation) |
| Learnybox | 1 | bientôt | 2 | oui | Une demande d'avis après chaque vente ou inscription. | vente, inscription | webhook natif chiffré (clé du compte) |
| Kajabi | 1 | bientôt | 2 | oui | Une demande d'avis après chaque achat d'une offre. | achat (Purchase Created) | webhook par offre ou pour le site |
| SchoolMaker | 1 | bientôt | 2 | oui | Une demande d'avis quand un membre rejoint une offre. | entrée dans une offre | webhook (plans Pro, Business), sinon Zapier ou Make |
| Podia | 1 | bientôt | 1 (guide) | oui | Une demande d'avis après chaque vente, avec Zapier. | nouvelle vente | Zapier seulement, vers le connecteur universel |
| Teachizy | 1 | plus tard | — | non | — | non vérifié | non vérifié |
| Teachable | 1 | plus tard | — | non | — | vente | Zapier (non revérifié) |
| Thinkific | 1 | plus tard | — | non | — | vente | non vérifié |
| Calendly | 2 | bientôt | 1 | oui | Une demande d'avis après chaque rendez-vous passé. | heure de fin passée, absents exclus | OAuth et lecture quotidienne (webhooks réservés aux plans payants) |
| Cal.com | 2 | bientôt | 2 | oui | Une demande d'avis après chaque séance terminée. | MEETING_ENDED | webhook collé dans les réglages |
| Acuity Scheduling | 2 | plus tard | — | non | — | rendez-vous passé | non vérifié |
| Stripe | 3 | bientôt | 1 | oui | Une demande d'avis après chaque paiement réussi. | paiement réussi | app Stripe (OAuth), un endpoint central |
| PayPal | 3 | bientôt | 3 | oui | Une demande d'avis après chaque paiement reçu. | paiement reçu | non vérifié |
| Mollie | 3 | plus tard | — | non | — | paiement réussi | non vérifié |
| Gumroad | 3 | plus tard | — | non | — | vente | non vérifié |
| Livestorm | 4 | bientôt | 3 | oui | Une demande d'avis aux participants présents, après le webinaire. | people.attended | webhook natif ou API (plans payants) |
| HelloAsso | 4 | bientôt | 3 | oui | Une demande d'avis après chaque adhésion, billet ou paiement à votre association. | commande, paiement | OAuth et notification (client partenaire à demander) |
| Weezevent | 4 | bientôt | 3 | oui | Une demande d'avis après l'événement, à chaque participant. | billet, puis date de l'événement | API par clé |
| Eventbrite | 4 | bientôt | 3 | oui | Une demande d'avis après l'événement, à chaque participant. | billet, puis date de l'événement | non vérifié |
| WooCommerce | 5 | bientôt | 2 | oui | Une demande d'avis après chaque commande payée. | commande payée | webhook natif (non revérifié) |
| Shopify | 5 | bientôt | plus tard | oui | Une demande d'avis après chaque commande payée. | commande payée | app publique, données protégées de niveau 2 |
| Connecteur universel | 6 | bientôt, puis disponible | 1 | oui | Envoyez vos ventes depuis n'importe quel outil : une demande d'avis part pour chacune. | vente reçue | adresse propre à l'espace, format simple |
| Zapier | 6 | bientôt | 1 (guide) ; app officielle en 2 | oui | Reliez des milliers d'outils : une demande d'avis après chaque vente que vous choisissez. | vente choisie | Webhooks by Zapier (payant), puis app officielle |
| Make | 6 | bientôt | 1 (guide et app privée) | oui | Reliez des milliers d'outils, même avec le plan gratuit de Make. | vente choisie | module HTTP (gratuit), app privée par lien |
| n8n | 6 | bientôt | 1 (guide) | oui | Reliez n'importe quel outil avec n8n : une demande d'avis après chaque vente. | vente choisie | requête HTTP |
| Pennylane | 7 | plus tard | — | non | — | facture payée | API, lecture périodique |
| Abby | 7 | plus tard | — | non | — | facture payée | non vérifié |
| Tiime | 7 | plus tard | — | non | — | facture payée | non vérifié |
| Circle | 8 | plus tard | — | non | — | nouveau membre | non vérifié |
| Skool | 8 | plus tard | — | non | — | nouveau membre | non vérifié |

V0 : 19 outils affichés, 6 familles. Les familles 7 et 8 restent masquées.

## Connecteur universel (verdict : oui, en vague 1)
- Adresse propre à l'espace, comme Systeme.io. Accepte JSON et formulaire. Répond vite. Ne crée rien deux fois pour la même référence.
- Champs : email (obligatoire), prenom, nom, offre, date, montant, devise, reference (identifiant unique de la vente).
- Offre inconnue : état « offres à associer », comme pour Systeme.io.
- Guides : Zapier, Make (voie gratuite), n8n, Podia.
- App Make : privée, partagée par lien, en vague 1.
- App Zapier officielle : en vague 2, quand 3 créateurs ont un Zap actif. La présenter comme un message après achat, 2 e-mails au plus, désinscription.

## Compatible avec votre site (liste distincte)
- Systeme.io : oui.
- WordPress installé soi-même : oui, avec un compte administrateur.
- WordPress.com : plan Business ou Commerce (à revérifier).
- Wix : plan Premium, domaine connecté, sans publicité.
- Squarespace : plan Core ou plus.
- Webflow : plan payant de site ou d'espace de travail.
- Carrd : Pro Standard ou plus.
- Framer : à tester sur le plan gratuit.
- Shopify, Kajabi, Podia, Learnybox, SchoolMaker : à tester.
- Notion, Linktree : non (à confirmer). Page publique du mur à décider.

## Ce que Claude Code relève (12 octobre)

Rien ne contredit une règle de `CLAUDE.md`. Trois points pour les lots :
- **Le connecteur universel suit la règle n° 1** : son format est le nôtre, mais ses fixtures viennent de vrais envois depuis Make, n8n et Zapier, capturés par son adresse avant d'écrire sa normalisation.
- **Le dédoublonnage entre connecteurs** change le cœur (une vente reçue deux fois par deux connecteurs). Il se construit avec le connecteur universel, puisque c'est lui qui rend le cas possible, avec ses tests.
- **« Page publique du mur »** (pour Notion et Linktree) est une fonctionnalité nouvelle : elle demande une maquette et une décision avant d'entrer dans un lot.
