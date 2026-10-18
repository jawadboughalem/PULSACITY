# Stripe Billing de PULSACITY : les événements capturés

Les abonnements des créateurs à PULSACITY passent par Stripe (lot 4.5). Ce n'est pas un connecteur, mais la même règle s'applique : les vrais événements du mode test sont d'abord capturés, puis deviennent les fixtures des tests.

## Ce que le code lit

L'adresse : `/api/stripe/webhook`. La signature (`Stripe-Signature`) est vérifiée sur les octets reçus, puis l'événement est gardé entier dans `stripe_events` avant tout traitement. Version d'API : `2026-09-30.endive`, celle du paquet `stripe` 23.0.0 (`src/lib/billing/stripe-client.ts`) ; la destination du webhook est créée avec la même (prompt 6 de `recette/lot-4-5-abonnement.md`).

Un événement ne sert qu'à savoir quel abonnement relire chez Stripe (`findEventSubscription`) :

| Objet de l'événement | Abonnement relu |
| --- | --- |
| `subscription` (`customer.subscription.*`) | son `id` |
| `checkout.session` (`checkout.session.*`, en mode `subscription`) | `subscription` |
| `invoice` (`invoice.paid`, `invoice.payment_failed`, `invoice.payment_action_required`, `invoice.upcoming`) | `parent.subscription_details.subscription` |
| `subscription_schedule` (`subscription_schedule.*`) | `subscription`, ou `released_subscription` une fois le changement programmé annulé |
| `customer` (`customer.updated`) et `payment_method` (`payment_method.attached`) | l'abonnement courant de l'espace de ce client |

L'abonnement relu (`subscriptions.retrieve`, développé : `default_payment_method`, `latest_invoice`, `discounts`, `schedule.phases.items.price`, `customer.invoice_settings.default_payment_method`) est lu par `readSubscriptionSnapshot` :
- `items.data[0].price.lookup_key` : le plan, la période et le prix fondateur ou public ; un autre prix est ignoré ;
- `items.data[0].current_period_end` : la prochaine échéance (elle a quitté l'abonnement pour ses éléments depuis l'API « basil ») ;
- `status`, `cancel_at`, `cancel_at_period_end`, `ended_at` ;
- `discounts[].source.coupon` = `beta-essentiel-3-mois` et `discounts[].end` : le bêta-testeur et la fin de ses mois offerts ;
- `schedule.current_phase.end_date` et la phase suivante : le changement programmé ;
- `default_payment_method.card` (sinon celle du client) : la marque et les quatre derniers chiffres ;
- `latest_invoice` ouverte et tentée, quand l'abonnement est `past_due` : le paiement refusé.
- `metadata.space_id` (mis par Checkout) relie l'abonnement à l'espace ; à défaut, `customer`.

`invoice.paid` garde en plus la facture payée (`amount_paid` > 0) dans `billing_payments`, pour le seuil de la micro-entreprise. `invoice.upcoming` déclenche le rappel d'un bêta-testeur 7 jours avant son premier prélèvement.

## Les captures

Recette du 16 octobre 2026, compte A (prompt 8 de `recette/lot-4-5-abonnement.md`), relevée le 18 octobre (prompts 12 et 13) : 20 événements reçus, tous traités, aucune erreur.

| Type | Nombre |
| --- | --- |
| `checkout.session.completed` | 1 |
| `customer.subscription.created` | 1 |
| `customer.subscription.updated` | 8 |
| `customer.updated` | 1 |
| `invoice.paid` | 2 |
| `payment_method.attached` | 1 |
| `subscription_schedule.released` | 2 |
| `subscription_schedule.updated` | 4 |

Le parcours : paiement d'Essentiel au prix de lancement (9,99 €), passage à l'annuel programmé puis annulé, passage au Pro (10 € au prorata), retour à Essentiel programmé puis annulé par l'arrêt, arrêt depuis la page de Stripe, reprise. Seuil, sur la recette : 1 client payant, 1 mois avec des paiements, 19,99 € en 2 paiements.

Pas capturés (prompts 9 à 11 non faits) : `invoice.payment_failed`, `invoice.payment_action_required`, `invoice.upcoming`, `customer.subscription.deleted`, une remise de bêta-testeur. Ils restent couverts par `src/lib/billing/stripe-fixtures.ts`, écrites d'après les types du paquet `stripe`.

Les fixtures : `src/lib/billing/__fixtures__/`, 14 des 20 événements, testés par `src/lib/billing/stripe-recette-events.test.ts`. Anonymisées avant d'entrer dans le dépôt :
- adresses e-mail : `julie@example.com` ;
- identifiants Stripe (ils contiennent un morceau de l'identifiant du compte) : `<préfixe>_recette<n>`, les mêmes d'un fichier à l'autre ;
- liens des factures (`hosted_invoice_url`, `invoice_pdf`), empreinte de la carte, clés d'idempotence, numéros de facture : remplacés ;
- l'espace : `00000000-0000-4000-8000-000000000001` ; l'adresse de l'aperçu : `https://pulsacity.com`.

Ce que les captures ont appris :
- l'arrêt depuis la page de Stripe pose `cancel_at` (la fin de la période) et laisse `cancel_at_period_end` à `false` : le code lit les deux ;
- un changement programmé puis annulé (`subscription_schedule.released`, puis `subscription_schedule.updated` au statut `released`) n'a plus de `subscription`, seulement `released_subscription` : le code le lit désormais ;
- la facture garde `space_id` dans `parent.subscription_details.metadata` ; `status_transitions.paid_at` vaut l'heure de l'horloge de test ;
- les prix sont au comportement fiscal `unspecified` ; la page de paiement ne propose que `card` (Link et Apple Pay en font partie) ;
- les lignes de facture sont écrites par Stripe : « 1 × PULSACITY Essentiel (à €9.99 / mois) », « Temps restant sur PULSACITY Pro après le 16 Oct 2026 ».
